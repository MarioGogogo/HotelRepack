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

// 保修模块分包
const WarrantyListScreen = __DEV__
  ? require('../screens/Warranty/WarrantyList').default
  : React.lazy(() => import(/* webpackChunkName: "warranty" */ '../screens/Warranty/WarrantyList'));

const WarrantyEquipmentScreen = __DEV__
  ? require('../screens/Warranty/WarrantyEquipment').default
  : React.lazy(() => import(/* webpackChunkName: "warranty" */ '../screens/Warranty/WarrantyEquipment'));

const WarrantySubmitScreen = __DEV__
  ? require('../screens/Warranty/WarrantySubmit').default
  : React.lazy(() => import(/* webpackChunkName: "warranty" */ '../screens/Warranty/WarrantySubmit'));

const WarrantySuccessScreen = __DEV__
  ? require('../screens/Warranty/WarrantySuccess').default
  : React.lazy(() => import(/* webpackChunkName: "warranty" */ '../screens/Warranty/WarrantySuccess'));

const WarrantyDetailScreen = __DEV__
  ? require('../screens/Warranty/WarrantyDetail').default
  : React.lazy(() => import(/* webpackChunkName: "warranty" */ '../screens/Warranty/WarrantyDetail'));

// 财务报表分包
const FinanceDashboardScreen = __DEV__
  ? require('../screens/Finance/FinanceDashboard').default
  : React.lazy(() => import(/* webpackChunkName: "finance" */ '../screens/Finance/FinanceDashboard'));

const FinanceRevenueScreen = __DEV__
  ? require('../screens/Finance/FinanceRevenue').default
  : React.lazy(() => import(/* webpackChunkName: "finance" */ '../screens/Finance/FinanceRevenue'));

const FinanceTransactionsScreen = __DEV__
  ? require('../screens/Finance/FinanceTransactions').default
  : React.lazy(() => import(/* webpackChunkName: "finance" */ '../screens/Finance/FinanceTransactions'));

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
      <Stack.Screen name="Warranty" component={(props: any) => <ChunkScreenWrapper component={WarrantyListScreen} {...props} />} />
      <Stack.Screen name="WarrantyEquipment" component={(props: any) => <ChunkScreenWrapper component={WarrantyEquipmentScreen} {...props} />} />
      <Stack.Screen name="WarrantySubmit" component={(props: any) => <ChunkScreenWrapper component={WarrantySubmitScreen} {...props} />} />
      <Stack.Screen name="WarrantySuccess" component={(props: any) => <ChunkScreenWrapper component={WarrantySuccessScreen} {...props} />} />
      <Stack.Screen name="WarrantyDetail" component={(props: any) => <ChunkScreenWrapper component={WarrantyDetailScreen} {...props} />} />

      {/* 财务报表 */}
      <Stack.Screen name="Finance" component={(props: any) => <ChunkScreenWrapper component={FinanceDashboardScreen} {...props} />} />
      <Stack.Screen name="FinanceRevenue" component={(props: any) => <ChunkScreenWrapper component={FinanceRevenueScreen} {...props} />} />
      <Stack.Screen name="FinanceTransactions" component={(props: any) => <ChunkScreenWrapper component={FinanceTransactionsScreen} {...props} />} />

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
