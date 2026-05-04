/**
 * APK 更新服务
 * 负责版本检查、下载、安装流程
 */

import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';

const { ApkUpdate } = NativeModules;

export interface ApkUpdateInfo {
  versionCode: number;
  versionName: string;
  downloadUrl: string;
  changelog: string;
  forceUpdate: boolean;
  fileSize: number;
}

interface CheckUpdateResponse {
  code: number;
  data: {
    hasUpdate: boolean;
    versionCode: number;
    versionName: string;
    downloadUrl: string;
    changelog: string;
    forceUpdate: boolean;
    fileSize: number;
  };
}

// 监听原生下载事件
let listenersInitialized = false;

export function initApkUpdateListeners() {
  if (listenersInitialized || Platform.OS !== 'android') return;
  listenersInitialized = true;

  DeviceEventEmitter.addListener('ApkDownloadProgress', (event: { bytesDownloaded: number; totalBytes: number; progress: number }) => {
    useAppStore.getState().setApkDownloadProgress(event.progress);
  });

  DeviceEventEmitter.addListener('ApkDownloadComplete', (event: { filePath: string }) => {
    useAppStore.getState().setApkFilePath(event.filePath);
    useAppStore.getState().setApkDownloadState('downloaded');
  });

  DeviceEventEmitter.addListener('ApkDownloadError', (event: { error: string }) => {
    useAppStore.getState().setApkDownloadError(event.error);
    useAppStore.getState().setApkDownloadState('error');
  });
}

/**
 * 检查更新
 */
export async function checkForUpdate(apiUrl: string): Promise<ApkUpdateInfo | null> {
  if (Platform.OS !== 'android' || !ApkUpdate) return null;

  const currentVersionCode = await ApkUpdate.getVersionCode();

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionCode: currentVersionCode, platform: 'android' }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result: CheckUpdateResponse = await response.json();
    console.log(result)
    if (!result.success) return null;
    return {
      versionCode: result.data.versionCode,
      versionName: result.data.versionName,
      downloadUrl: result.data.downloadUrl,
      changelog: result.data.changelog,
      forceUpdate: result.data.forceUpdate,
      fileSize: result.data.fileSize,
    };
  } catch (error) {
    console.error('[ApkUpdateService] checkForUpdate error:', error);
    throw error;
  }
}

/**
 * 开始下载 APK
 */
export async function startDownload(url: string, fileSize: number): Promise<void> {
  if (!ApkUpdate) return;

  useAppStore.getState().setApkDownloadState('downloading');
  useAppStore.getState().setApkDownloadProgress(0);
  useAppStore.getState().setApkDownloadError(null);

  await ApkUpdate.downloadApk(url, fileSize);
}

/**
 * 安装 APK
 */
export async function installApk(): Promise<void> {
  const filePath = useAppStore.getState().apkFilePath;
  if (!filePath || !ApkUpdate) return;

  const hasPermission = await ApkUpdate.canRequestInstallPackages();
  if (!hasPermission) {
    await ApkUpdate.requestInstallPermission();
    return;
  }

  await ApkUpdate.installApk(filePath);
}

/**
 * 检查安装权限
 */
export async function checkInstallPermission(): Promise<boolean> {
  if (!ApkUpdate) return false;
  return ApkUpdate.canRequestInstallPackages();
}

/**
 * 请求安装权限
 */
export async function requestInstallPermission(): Promise<void> {
  if (!ApkUpdate) return;
  await ApkUpdate.requestInstallPermission();
}

/**
 * 取消下载
 */
export async function cancelDownload(): Promise<void> {
  if (!ApkUpdate) return;
  await ApkUpdate.cancelDownload();
  useAppStore.getState().setApkDownloadState('idle');
  useAppStore.getState().setApkDownloadProgress(0);
}

/**
 * 重置更新状态
 */
export function resetApkUpdate() {
  useAppStore.getState().resetApkUpdate();
}
