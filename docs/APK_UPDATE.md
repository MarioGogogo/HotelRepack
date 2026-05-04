# APK 自更新模块

## 架构概览

```
┌─ RN 层 ─────────────────────────────────────────────────┐
│  SettingsScreen.tsx  →  检查更新入口                      │
│  ApkUpdateService.ts →  版本检查 + 事件监听 + 流程编排     │
│  ApkUpdateModal.tsx  →  更新弹窗 UI（进度/下载/安装）      │
│  useAppStore.ts      →  Zustand 状态管理                  │
└──────────────────────────┬───────────────────────────────┘
                           │ NativeModules.ApkUpdate
                           │ DeviceEventEmitter
┌─ 原生层 (Kotlin) ────────┴───────────────────────────────┐
│  ApkUpdateModule.kt  →  OkHttp 下载 + FileProvider 安装   │
│  ApkUpdatePackage.kt →  ReactPackage 注册                 │
│  file_paths.xml      →  FileProvider 路径配置             │
└──────────────────────────────────────────────────────────┘
```

---

## 原生模块 API（ApkUpdateModule）

模块名：`NativeModules.ApkUpdate`

### 方法列表

#### 1. `getVersionCode(): Promise<number>`

获取当前应用 versionCode。

```typescript
const versionCode = await ApkUpdate.getVersionCode();
// 例: 10006
```

#### 2. `getVersionName(): Promise<string>`

获取当前应用 versionName。

```typescript
const versionName = await ApkUpdate.getVersionName();
// 例: "1.0.6"
```

#### 3. `downloadApk(url: string, fileSize: number): Promise<string>`

下载 APK 文件。立即返回 `"started"`，下载过程异步进行，通过事件通知进度。

```typescript
await ApkUpdate.downloadApk('https://example.com/app.apk', 74442780);
```

**参数：**
- `url` — APK 下载地址（需指向 universal APK）
- `fileSize` — 文件大小（字节），用于存储空间预检，传 0 跳过检查

**行为：**
- 自动取消正在进行的下载任务
- 删除旧下载文件
- 存储空间不足时 reject（错误码 `STORAGE_ERROR`）
- 下载目录：`{cacheDir}/apk_updates/update.apk`

#### 4. `cancelDownload(): Promise<boolean>`

取消正在进行的下载，删除已下载的部分文件。

```typescript
await ApkUpdate.cancelDownload();
```

#### 5. `installApk(filePath: string): Promise<boolean>`

调用系统安装器安装 APK。内部使用 FileProvider 生成 content:// URI。

```typescript
await ApkUpdate.installApk('/data/data/com.hotelrepack/cache/apk_updates/update.apk');
```

**错误码：**
- `FILE_ERROR` — 文件不存在或已损坏
- `INSTALL_ERROR` — 未找到安装器或其他异常

#### 6. `canRequestInstallPackages(): Promise<boolean>`

检查是否有安装未知来源 APK 的权限（Android 8+ 必需）。

```typescript
const hasPermission = await ApkUpdate.canRequestInstallPackages();
// Android < 8.0: 始终返回 true
// Android >= 8.0: 返回用户是否已授权
```

#### 7. `requestInstallPermission(): Promise<boolean>`

打开系统"安装未知应用"设置页面，引导用户授权。

```typescript
await ApkUpdate.requestInstallPermission();
// 跳转后需用户手动返回 app，再次调用 canRequestInstallPackages() 确认
```

---

## 原生事件

下载过程通过 `DeviceEventEmitter` 向 RN 层发送事件：

### `ApkDownloadProgress`

每增长 1% 触发一次。

```typescript
{
  bytesDownloaded: number;  // 已下载字节数
  totalBytes: number;       // 总字节数
  progress: number;         // 百分比 0-100
}
```

### `ApkDownloadComplete`

下载完成时触发。

```typescript
{
  filePath: string;  // APK 文件绝对路径
}
```

### `ApkDownloadError`

下载出错时触发，自动删除不完整的文件。

```typescript
{
  error: string;  // 错误信息
}
```

---

## RN 服务层（ApkUpdateService）

### `initApkUpdateListeners()`

初始化原生事件监听，在 `App.tsx` 中调用一次。

```typescript
// App.tsx
useEffect(() => {
  initApkUpdateListeners();
}, []);
```

### `checkForUpdate(apiUrl: string): Promise<ApkUpdateInfo | null>`

向服务器检查是否有新版本。POST 当前 versionCode，返回更新信息或 null。

```typescript
const updateInfo = await checkForUpdate('http://192.168.5.67:8080/app/update');
```

**请求体：**
```json
{ "versionCode": 10006, "platform": "android" }
```

**期望响应：**
```json
{
  "success": true,
  "data": {
    "versionCode": 10007,
    "versionName": "1.0.7",
    "downloadUrl": "https://example.com/HotelRepack-universal.apk",
    "changelog": "修复若干问题",
    "forceUpdate": false,
    "fileSize": 74442780
  }
}
```

### `startDownload(url: string, fileSize: number): Promise<void>`

开始下载。自动设置 store 状态为 `downloading`，重置进度和错误。

### `installApk(): Promise<void>`

安装 APK。内部自动检查权限，无权限时跳转设置页。

### `cancelDownload(): Promise<void>`

取消下载并重置 store 状态。

### `resetApkUpdate()`

重置所有 APK 更新相关状态。

---

## 状态管理（Zustand Store）

所有 APK 更新状态均为**非持久化**（重启后重置）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `apkUpdateInfo` | `ApkUpdateInfo \| null` | 更新信息（版本、URL、变更日志等） |
| `apkDownloadProgress` | `number` | 下载进度 0-100 |
| `apkDownloadState` | `'idle' \| 'downloading' \| 'downloaded' \| 'error'` | 下载状态 |
| `apkDownloadError` | `string \| null` | 错误信息 |
| `apkFilePath` | `string \| null` | 下载完成的 APK 文件路径 |

**Actions：** `setApkUpdateInfo` / `setApkDownloadProgress` / `setApkDownloadState` / `setApkDownloadError` / `setApkFilePath` / `resetApkUpdate`

---

## UI 组件（ApkUpdateModal）

挂载在 `App.tsx` 根层级，当 `apkUpdateInfo` 不为 null 时自动显示。

### 状态流转

```
检查更新成功
    │
    ▼
┌─ idle: 更新可用 ──── [立即下载] ──┐    [以后再说] → 关闭
│                                   │
│    (强制更新时隐藏"以后再说"按钮)  │
└───────────────────────────────────┘
                    │
                    ▼
┌─ downloading: 下载中 ────────────┐
│  ████████░░░░░░░░  56%           │
│                        [取消下载] │
└───────────────────────────────────┘
                    │
          ┌────────┴────────┐
          ▼                  ▼
┌─ downloaded: 完成    ┌─ error: 失败 ──┐
│  [立即安装]          │  [重新下载]     │
│       │              │  [以后再说]     │
│       ▼              └────────────────┘
│  权限检查            │
│  ├─ 有权限 → 安装    │
│  └─ 无权限 → 跳转设置│
└──────────────────────┘
```

### 进度条组件

使用 `react-native-reanimated` 的 `useAnimatedStyle` + `withTiming` 驱动，运行在 UI 线程。

```tsx
<AnimatedProgressBar progress={apkDownloadProgress} />
```

---

## 文件清单

| 文件 | 作用 |
|------|------|
| `android/app/src/main/java/com/hotelrepack/ApkUpdateModule.kt` | 原生模块核心 |
| `android/app/src/main/java/com/hotelrepack/ApkUpdatePackage.kt` | ReactPackage 注册 |
| `android/app/src/main/res/xml/file_paths.xml` | FileProvider 路径配置 |
| `src/services/ApkUpdateService.ts` | RN 服务层 |
| `src/components/ApkUpdateModal.tsx` | 更新弹窗 |
| `src/components/AnimatedProgressBar.tsx` | 进度条组件 |

**修改的文件：**

| 文件 | 改动 |
|------|------|
| `android/app/src/main/AndroidManifest.xml` | 安装权限 + FileProvider + queries |
| `android/app/src/main/java/com/hotelrepack/MainApplication.kt` | 注册 ApkUpdatePackage |
| `android/app/build.gradle` | kotlinx-coroutines-android 依赖 |
| `src/store/useAppStore.ts` | APK 更新状态切片 |
| `src/screens/SettingsScreen.tsx` | "检查更新"入口 + Toast |
| `App.tsx` | 挂载 ApkUpdateModal + 初始化监听 |

---

## 版本检查 API 接入

替换 SettingsScreen 中的 API 地址即可：

```typescript
// src/screens/SettingsScreen.tsx
const updateInfo = await checkForUpdate('https://your-api.com/app/update');
```

API 需返回如下格式：

```json
{
  "success": true,
  "data": {
    "versionCode": 10007,
    "versionName": "1.0.7",
    "downloadUrl": "https://xxx/HotelRepack-universal.apk",
    "changelog": "更新说明",
    "forceUpdate": false,
    "fileSize": 74442780
  }
}
```

`downloadUrl` 必须指向 **universal APK**（项目开启了 ABI splits，设备可能是 arm64-v8a 或 armeabi-v7a）。

---

## 注意事项

1. **Android 8+ 安装权限**：首次安装需用户手动授权，流程为 `canRequestInstallPackages()` → 不通过 → `requestInstallPermission()` → 跳转系统设置 → 用户返回后重新检查
2. **APK 类型**：必须下载 universal APK，不要下载 ABI 分包 APK
3. **存储空间**：下载前自动检查可用空间，不足 10MB 缓冲会报错
4. **重复下载**：调用 `downloadApk` 会自动取消上一次下载
5. **MIUI/Samsung**：部分 OEM 有二次安装确认，属系统行为
