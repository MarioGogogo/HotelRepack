/**
 * 根导航器 - 包含登录页、首页和分包页面
 *
 * 起始页：LoginScreen（登录页面）
 * 首页：HomeScreen（九宫格）
 * 分包：SettingsScreen（生产环境）/ 主包（开发环境）
 */

import React, { Suspense, useEffect } from 'react';
import { View, ActivityIndicator, Platform, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useAppStore } from '../store/useAppStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ChunkErrorBoundary from '../components/ChunkErrorBoundary';

// 登录页面
import LoginScreen from '../screens/LoginScreen';
// 新的主页（九宫格）
import HomeScreen from '../screens/HomeScreen';
import WarrantyList from '../screens/Warranty/WarrantyList';
import WarrantyEquipment from '../screens/Warranty/WarrantyEquipment';
import WarrantySubmit from '../screens/Warranty/WarrantySubmit';
import WarrantySuccess from '../screens/Warranty/WarrantySuccess';
import WarrantyDetail from '../screens/Warranty/WarrantyDetail';
import FinanceDashboard from '../screens/Finance/FinanceDashboard';
import FinanceRevenue from '../screens/Finance/FinanceRevenue';
import FinanceTransactions from '../screens/Finance/FinanceTransactions';

// 分包页面：开发模式主包，生产模式分包
const HotelReservationScreen = __DEV__
  ? require('../screens/HotelReservation').default
  : React.lazy(() => import(/* webpackChunkName: "hotel-reservation" */ '../screens/HotelReservation'));

const ReservationDetailScreen = __DEV__
  ? require('../screens/HotelReservation/DetailPage').default
  : React.lazy(() => import(/* webpackChunkName: "hotel-reservation" */ '../screens/HotelReservation/DetailPage'));

const HotelCleaningScreen = __DEV__
  ? require('../screens/HotelCleaning').default
  : React.lazy(() => import(/* webpackChunkName: "hotel-cleaning" */ '../screens/HotelCleaning'));

const HotelDiningScreen = __DEV__
  ? require('../screens/HotelDining').default
  : React.lazy(() => import(/* webpackChunkName: "hotel-dining" */ '../screens/HotelDining'));

const SettingsScreen = __DEV__
  ? require('../screens/SettingsScreen').default
  : React.lazy(() => import(/* webpackChunkName: "settings" */ '../screens/SettingsScreen'));

// 分包加载状态
function ChunkLoader() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f7' }}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}

// 分包页面包装器：带错误边界 + Suspense
function ChunkScreenWrapper({ component: Component, ...props }: { component: React.ComponentType<any> }) {
  const navigation = useNavigation<any>();
  return (
    <ChunkErrorBoundary onGoBack={() => navigation.goBack()}>
      <Suspense fallback={<ChunkLoader />}>
        <Component {...props} />
      </Suspense>
    </ChunkErrorBoundary>
  );
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  HotelReservation: undefined;
  ReservationDetail: { roomId: string };
  HotelCleaning: undefined;
  HotelDining: undefined;
  Settings: undefined;
  BundleError: { bundleName: string };
  Warranty: undefined;
  WarrantyEquipment: undefined;
  WarrantySubmit: { category?: string };
  WarrantySuccess: undefined;
  WarrantyDetail: { id?: string };
  Finance: undefined;
  FinanceRevenue: undefined;
  FinanceTransactions: undefined;
};

// 分包错误页面组件
type BundleErrorProps = NativeStackScreenProps<RootStackParamList, 'BundleError'>;

function BundleErrorScreen({ route, navigation }: BundleErrorProps) {
  const { bundleName } = route.params;
  const { bundleConfigs } = useAppStore();

  // 从 bundleConfigs 中查找对应的配置信息
  const bundleConfig = bundleConfigs.find(b => b.screen === bundleName);
  const url = bundleConfig?.url || '未配置';
  const version = bundleConfig?.version || '-';

  return (
    <View style={bundleErrorStyles.container}>
      <Text style={bundleErrorStyles.emoji}>📦❌</Text>
      <Text style={bundleErrorStyles.title}>分包配置不存在</Text>
      <Text style={bundleErrorStyles.code}>404</Text>
      <Text style={bundleErrorStyles.message}>
        分包 "{bundleName}" 未在服务端配置{'\n'}请联系管理员添加该分包
      </Text>

      {/* 显示 URL 信息 */}
      {bundleConfig && (
        <View style={bundleErrorStyles.infoBox}>
          <Text style={bundleErrorStyles.infoLabel}>分包信息:</Text>
          <Text style={bundleErrorStyles.infoText}>名称: {bundleConfig.label || bundleName}</Text>
          <Text style={bundleErrorStyles.infoText}>版本: {version}</Text>
          <Text style={bundleErrorStyles.infoUrl} numberOfLines={2}>
            URL: {url}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={bundleErrorStyles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={bundleErrorStyles.buttonText}>← 返回</Text>
      </TouchableOpacity>
    </View>
  );
}

const bundleErrorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    padding: 20,
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  code: { fontSize: 64, fontWeight: 'bold', color: '#e0e0e0', marginBottom: 16 },
  message: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#666', marginBottom: 4 },
  infoUrl: { fontSize: 11, color: '#999', fontFamily: 'monospace' },
  button: { backgroundColor: '#6366f1', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * iOS 标准的页面切换动画配置
 * 适用于所有非底部Tab栏切换的页面跳转
 *
 * 动画效果：
 * - iOS: 原生从右侧滑入动画
 * - Android: 模拟 iOS 的水平滑动动画（从右滑入，向左滑出）
 */
const stackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  // 统一使用滑动动画，让 Android 也有 iOS 风格的滑动效果
  animation: 'slide_from_right',
  // 确保使用原生的 iOS 动画类型
  gestureEnabled: true,
  // iOS 使用水平方向的滑动返回手势
  gestureDirection: 'horizontal',
  // 卡片式展示（iOS 默认）
  presentation: 'card',
  // 内容样式（iOS 默认卡片样式）
  contentStyle: {
    backgroundColor: '#f2f2f7',
  },
  // 确保动画类型为 iOS 原生
  animationTypeForReplace: 'push',
};

export default function RootNavigator() {
  const { isLoggedIn } = useAppStore();

  return (
    <Stack.Navigator
      screenOptions={stackScreenOptions}
      initialRouteName={isLoggedIn ? "Home" : "Login"}
    >
      {/* 登录页面（起始页） */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* 设备保修 */}
      <Stack.Screen name="Warranty" component={WarrantyList} />
      <Stack.Screen name="WarrantyEquipment" component={WarrantyEquipment} />
      <Stack.Screen name="WarrantySubmit" component={WarrantySubmit} />
      <Stack.Screen name="WarrantySuccess" component={WarrantySuccess} />
      <Stack.Screen name="WarrantyDetail" component={WarrantyDetail} />

      {/* 财务报表 */}
      <Stack.Screen name="Finance" component={FinanceDashboard} />
      <Stack.Screen name="FinanceRevenue" component={FinanceRevenue} />
      <Stack.Screen name="FinanceTransactions" component={FinanceTransactions} />

      {/* 九宫格首页 */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* 客房预订 */}
      <Stack.Screen name="HotelReservation" component={(props: any) => <ChunkScreenWrapper component={HotelReservationScreen} {...props} />} />
      <Stack.Screen name="ReservationDetail" component={(props: any) => <ChunkScreenWrapper component={ReservationDetailScreen} {...props} />} />

      {/* 客房打扫 */}
      <Stack.Screen name="HotelCleaning" component={(props: any) => <ChunkScreenWrapper component={HotelCleaningScreen} {...props} />} />

      {/* 餐饮服务 */}
      <Stack.Screen name="HotelDining" component={(props: any) => <ChunkScreenWrapper component={HotelDiningScreen} {...props} />} />

      {/* 分包页面：开发模式主包，生产模式分包（使用iOS push动画） */}
      <Stack.Screen name="Settings" component={(props: any) => <ChunkScreenWrapper component={SettingsScreen} {...props} />} />

      {/* 分包错误页面 */}
      <Stack.Screen name="BundleError" component={BundleErrorScreen} />
    </Stack.Navigator>
  );
}
