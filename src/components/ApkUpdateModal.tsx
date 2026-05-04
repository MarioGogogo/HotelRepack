import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing, Dimensions } from 'react-native';
import AnimatedProgressBar from './AnimatedProgressBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppStore } from '../store/useAppStore';
import {
  startDownload,
  installApk,
  cancelDownload,
  checkInstallPermission,
  requestInstallPermission,
  resetApkUpdate,
} from '../services/ApkUpdateService';

const { width } = Dimensions.get('window');

export default function ApkUpdateModal() {
  const {
    apkUpdateInfo,
    apkDownloadProgress,
    apkDownloadState,
    apkDownloadError,
    setApkDownloadState,
  } = useAppStore();

  const visible = apkUpdateInfo !== null;
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // 弹窗显示/隐藏动画
  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.9);
      Animated.parallel([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        }),
      ]).start();
    }
  }, [visible]);

  const handleDownload = useCallback(() => {
    if (!apkUpdateInfo) return;
    startDownload(apkUpdateInfo.downloadUrl, apkUpdateInfo.fileSize);
  }, [apkUpdateInfo]);

  const handleInstall = useCallback(async () => {
    const hasPermission = await checkInstallPermission();
    if (hasPermission) {
      installApk();
    } else {
      await requestInstallPermission();
      setApkDownloadState('downloaded');
    }
  }, [setApkDownloadState]);

  const handleCancel = useCallback(() => {
    if (apkDownloadState === 'downloading') {
      cancelDownload();
    }
    resetApkUpdate();
  }, [apkDownloadState]);

  const handleRetry = useCallback(() => {
    if (!apkUpdateInfo) return;
    startDownload(apkUpdateInfo.downloadUrl, apkUpdateInfo.fileSize);
  }, [apkUpdateInfo]);

  if (!visible) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: animValue }]} />
        <Animated.View style={[styles.dialogContainer, { opacity: animValue, transform: [{ scale: scaleAnim }] }]}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="system-update-alt" size={48} color="#135bec" />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {apkDownloadState === 'error' ? '下载失败' :
             apkDownloadState === 'downloading' ? '正在下载' :
             apkDownloadState === 'downloaded' ? '下载完成' :
             `发现新版本 v${apkUpdateInfo.versionName}`}
          </Text>

          {/* Content */}
          {apkDownloadState === 'idle' && (
            <>
              {apkUpdateInfo.changelog ? (
                <Text style={styles.message}>{apkUpdateInfo.changelog}</Text>
              ) : null}
              {apkUpdateInfo.fileSize > 0 && (
                <Text style={styles.sizeText}>安装包大小: {formatSize(apkUpdateInfo.fileSize)}</Text>
              )}
            </>
          )}

          {apkDownloadState === 'downloading' && (
            <View style={styles.progressContainer}>
              <AnimatedProgressBar progress={apkDownloadProgress} />
              <Text style={styles.progressText}>{apkDownloadProgress}%</Text>
            </View>
          )}

          {apkDownloadState === 'downloaded' && (
            <Text style={styles.message}>安装包已就绪，点击安装完成更新</Text>
          )}

          {apkDownloadState === 'error' && (
            <Text style={styles.errorText}>{apkDownloadError || '下载过程中出现错误'}</Text>
          )}

          {/* Buttons */}
          {apkDownloadState === 'idle' && (
            <View style={styles.columnButtons}>
              <TouchableOpacity style={styles.fullButton} onPress={handleDownload}>
                <Text style={styles.fullButtonText}>立即下载</Text>
              </TouchableOpacity>
              {!apkUpdateInfo.forceUpdate && (
                <TouchableOpacity style={styles.textButton} onPress={handleCancel}>
                  <Text style={styles.textButtonText}>以后再说</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {apkDownloadState === 'downloading' && (
            <TouchableOpacity style={[styles.fullButton, { backgroundColor: '#94a3b8' }]} onPress={handleCancel}>
              <Text style={styles.fullButtonText}>取消下载</Text>
            </TouchableOpacity>
          )}

          {apkDownloadState === 'downloaded' && (
            <View style={styles.columnButtons}>
              <TouchableOpacity style={styles.fullButton} onPress={handleInstall}>
                <Text style={styles.fullButtonText}>立即安装</Text>
              </TouchableOpacity>
            </View>
          )}

          {apkDownloadState === 'error' && (
            <View style={styles.columnButtons}>
              <TouchableOpacity style={styles.fullButton} onPress={handleRetry}>
                <Text style={styles.fullButtonText}>重新下载</Text>
              </TouchableOpacity>
              {!apkUpdateInfo.forceUpdate && (
                <TouchableOpacity style={styles.textButton} onPress={handleCancel}>
                  <Text style={styles.textButtonText}>以后再说</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  dialogContainer: {
    width: width - 64,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 91, 236, 0.1)',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111318',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#616f89',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  sizeText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#135bec',
    marginTop: 12,
  },
  columnButtons: {
    width: '100%',
    gap: 12,
  },
  fullButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#135bec',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textButton: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  textButtonText: {
    color: '#616f89',
    fontSize: 16,
    fontWeight: '500',
  },
});
