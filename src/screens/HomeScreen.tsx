import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  FlatList,
  Platform,
  Image,
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { getRemoteBundleConfig, getLoadedVersions, isBundleConfigured } from '../../index';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 宫格配置
const MODULES = [
  { id: '1', name: '客房预订', icon: 'king-bed', route: 'HotelReservation', chunkName: 'hotel-reservation' },
  { id: '2', name: '客房打扫', icon: 'cleaning-services', route: 'HotelCleaning', chunkName: 'hotel-cleaning' },
  { id: '3', name: '餐饮服务', icon: 'restaurant', route: 'HotelDining', chunkName: 'hotel-dining' },
  { id: '4', name: '酒店设置', icon: 'settings', route: 'Settings', chunkName: 'settings' },
  { id: '5', name: '设备报修', icon: 'build', route: 'Warranty' },
  { id: '6', name: '前台接待', icon: 'support-agent', route: null },
  { id: '7', name: '财务报表', icon: 'bar-chart', route: 'Finance' },
  { id: '8', name: '库存管理', icon: 'inventory', route: null },
  { id: '9', name: '员工排班', icon: 'event-note', route: null },
];

// 计算每个网格的宽度
const SPACING = 16;
const GRID_PADDING = 24;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - SPACING * 2) / 3;

function GridItem({ item, index, onPress, hasUpdate }: { item: typeof MODULES[0]; index: number; onPress: () => void; hasUpdate: boolean }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      entering={() => {
        'worklet';
        const delayMs = 100 + index * 60;
        return {
          initialValues: {
            opacity: 0,
            transform: [{ scale: 0.6 }],
          },
          animations: {
            opacity: withDelay(delayMs, withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })),
            transform: [{ scale: withDelay(delayMs, withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })) }],
          },
        };
      }}
      style={[animatedStyle, { width: ITEM_WIDTH, marginBottom: SPACING }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => (scale.value = withSpring(0.92))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        style={styles.gridItemContainer}
      >
        <View style={styles.gridItemInner}>
          {/* 图标发光外圈 */}
          <View style={styles.iconCircle}>
            <Icon name={item.icon} size={36} color={COLORS.accent} />
          </View>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        {/* 更新角标 */}
        {hasUpdate && (
          <Image source={require('../static/image/新.png')} style={styles.updateBadge} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  // 记录有更新的模块：chunkName -> { localVersion, remoteVersion }
  const [updatedChunks, setUpdatedChunks] = useState<Record<string, { localVersion: string; remoteVersion: string }>>({});

  useEffect(() => {
    if (__DEV__) return;
    const remoteConfig = getRemoteBundleConfig() as Record<string, { url: string; version: string }>;
    const localVersions = getLoadedVersions() as Record<string, string>;

    MODULES.forEach((mod) => {
      if (!mod.chunkName) return;
      const remote = remoteConfig[mod.chunkName];
      if (!remote || typeof remote === 'string') return;

      const localVersion = localVersions[mod.chunkName];
      const remoteVersion = remote.version;

      // 已加载过且版本号不同 → 有更新
      if (localVersion && localVersion !== remoteVersion) {
        setUpdatedChunks((prev) => ({
          ...prev,
          [mod.chunkName!]: { localVersion, remoteVersion },
        }));
      }
    });
  }, []);

  const handlePress = useCallback(
    (item: typeof MODULES[0]) => {
      if (!item.route) {
        Alert.alert('模块建设中', `【${item.name}】正在紧急开发中，敬请期待！`, [{ text: '我知道了' }]);
        return;
      }
      // 生产模式下检查分包配置是否存在
      if (item.chunkName && !isBundleConfigured(item.chunkName)) {
        // @ts-ignore
        navigation.navigate('BundleError', { bundleName: item.chunkName });
        return;
      }
      // @ts-ignore - Dynamic routing
      navigation.navigate(item.route);
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* 头部区域 */}
      <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>晚上好，</Text>
          <Text style={styles.title}>HOTELPACK</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8} onPress={() => navigation.replace('Login')}>
          <Icon name="logout" size={22} color={COLORS.textLight} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300).duration(800)}>
        <Text style={styles.sectionTitle}>工作台 (Workspace)</Text>
      </Animated.View>

      {/* 九宫格区域 */}
      <FlatList
        data={MODULES}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <GridItem item={item} index={index} onPress={() => handlePress(item)} hasUpdate={!!item.chunkName && !!updatedChunks[item.chunkName]} />
        )}
      />
    </View>
  );
}

/* ---------- Styles ---------- */

const COLORS = {
  primary: '#1B2A4A',
  accent: '#C8A96E', // Gold
  bg: '#F5F7FA', // Soft light gray/blue background
  card: '#FFFFFF', // Pure white cards
  cardBorder: 'rgba(0, 0, 0, 0.04)',
  text: '#1B2A4A',
  textLight: '#8892A6',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: GRID_PADDING,
    paddingTop: 80, // 适配刘海屏
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 6,
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B2A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 12,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 4,
    paddingHorizontal: GRID_PADDING,
    marginBottom: 20,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'flex-start', // gap fallback
    gap: SPACING, // RN >= 0.71 supports gap on flex-row
  },
  gridItemContainer: {
    flex: 1,
    aspectRatio: 1, // 保持正方形
    borderRadius: 24,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  gridItemInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(200, 169, 110, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  updateBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
