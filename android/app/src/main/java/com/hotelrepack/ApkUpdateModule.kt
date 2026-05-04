package com.hotelrepack

import android.content.Intent
import android.os.Build
import android.os.StatFs
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.BufferedInputStream
import java.io.File
import java.io.FileOutputStream

class ApkUpdateModule(private val appContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(appContext) {

    private val moduleScope = CoroutineScope(Dispatchers.Main)
    private var downloadJob: Job? = null
    private val httpClient = OkHttpClient.Builder().build()
    private val apkDir = File(appContext.cacheDir, "apk_updates").apply { mkdirs() }
    private val apkFile = File(apkDir, "update.apk")

    companion object {
        private const val EVENT_PROGRESS = "ApkDownloadProgress"
        private const val EVENT_COMPLETE = "ApkDownloadComplete"
        private const val EVENT_ERROR = "ApkDownloadError"
        private const val FILE_PROVIDER_AUTHORITY = "com.hotelrepack.fileprovider"
        private const val BUFFER_SIZE = 8 * 1024
        private const val MIN_FREE_SPACE = 10L * 1024 * 1024
    }

    override fun getName(): String = "ApkUpdate"

    @ReactMethod
    fun getVersionCode(promise: Promise) {
        try {
            val info = appContext.packageManager.getPackageInfo(appContext.packageName, 0)
            promise.resolve(info.longVersionCode.toInt())
        } catch (e: Exception) {
            promise.reject("VERSION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getVersionName(promise: Promise) {
        try {
            val info = appContext.packageManager.getPackageInfo(appContext.packageName, 0)
            promise.resolve(info.versionName)
        } catch (e: Exception) {
            promise.reject("VERSION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun canRequestInstallPackages(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            promise.resolve(appContext.packageManager.canRequestPackageInstalls())
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun requestInstallPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val intent = Intent(
                    android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    android.net.Uri.parse("package:${appContext.packageName}")
                ).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                appContext.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("PERMISSION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun downloadApk(url: String, fileSize: Double, promise: Promise) {
        downloadJob?.cancel()
        if (apkFile.exists()) apkFile.delete()

        if (fileSize > 0) {
            val stat = StatFs(apkDir.path)
            val freeBytes = stat.availableBlocksLong * stat.blockSizeLong
            if (freeBytes < fileSize.toLong() + MIN_FREE_SPACE) {
                promise.reject("STORAGE_ERROR", "存储空间不足")
                return
            }
        }

        promise.resolve("started")

        downloadJob = moduleScope.launch {
            try {
                downloadInternal(url)
            } catch (e: Exception) {
                if (apkFile.exists()) apkFile.delete()
                sendErrorEvent(e.message ?: "下载失败")
            }
        }
    }

    private suspend fun downloadInternal(url: String) = withContext(Dispatchers.IO) {
        val request = Request.Builder().url(url).build()
        val response = httpClient.newCall(request).execute()

        if (!response.isSuccessful) {
            throw Exception("服务器返回错误: ${response.code}")
        }

        val body = response.body ?: throw Exception("下载内容为空")
        val totalBytes = body.contentLength()

        val inputStream = BufferedInputStream(body.byteStream())
        val outputStream = FileOutputStream(apkFile)

        var lastReportedProgress = -1
        var bytesDownloaded = 0L

        outputStream.use { out ->
            inputStream.use { input ->
                val buffer = ByteArray(BUFFER_SIZE)
                var bytesRead: Int

                while (input.read(buffer).also { bytesRead = it } != -1) {
                    out.write(buffer, 0, bytesRead)
                    bytesDownloaded += bytesRead

                    if (totalBytes > 0) {
                        val progress = (bytesDownloaded * 100 / totalBytes).toInt()
                        if (progress != lastReportedProgress) {
                            lastReportedProgress = progress
                            sendProgressEvent(bytesDownloaded, totalBytes, progress)
                        }
                    }
                }
            }
        }

        sendCompleteEvent(apkFile.absolutePath)
    }

    @ReactMethod
    fun cancelDownload(promise: Promise) {
        downloadJob?.cancel()
        downloadJob = null
        if (apkFile.exists()) apkFile.delete()
        promise.resolve(true)
    }

    @ReactMethod
    fun installApk(filePath: String, promise: Promise) {
        try {
            val file = File(filePath)
            if (!file.exists() || file.length() == 0L) {
                promise.reject("FILE_ERROR", "APK 文件不存在或已损坏")
                return
            }

            val uri = FileProvider.getUriForFile(
                appContext,
                FILE_PROVIDER_AUTHORITY,
                file
            )

            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "application/vnd.android.package-archive")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            if (intent.resolveActivity(appContext.packageManager) != null) {
                appContext.startActivity(intent)
                promise.resolve(true)
            } else {
                promise.reject("INSTALL_ERROR", "未找到安装器")
            }
        } catch (e: Exception) {
            promise.reject("INSTALL_ERROR", e.message)
        }
    }

    private fun sendProgressEvent(bytesDownloaded: Long, totalBytes: Long, progress: Int) {
        appContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVENT_PROGRESS, Arguments.createMap().apply {
                putDouble("bytesDownloaded", bytesDownloaded.toDouble())
                putDouble("totalBytes", totalBytes.toDouble())
                putInt("progress", progress)
            })
    }

    private fun sendCompleteEvent(filePath: String) {
        appContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVENT_COMPLETE, Arguments.createMap().apply {
                putString("filePath", filePath)
            })
    }

    private fun sendErrorEvent(error: String) {
        appContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVENT_ERROR, Arguments.createMap().apply {
                putString("error", error)
            })
    }
}
