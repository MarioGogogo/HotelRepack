import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  LayoutChangeEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const mockTransactions = [
  { id: 'TRX-1001', type: 'income', title: '客房订单 - 8201', time: '今天 14:30', amount: 480.00, method: 'wechat', methodLabel: '微信支付' },
  { id: 'TRX-1002', type: 'income', title: '餐饮消费 - 大堂吧', time: '今天 13:15', amount: 128.00, method: 'alipay', methodLabel: '支付宝' },
  { id: 'TRX-1003', type: 'expense', title: '客房退款 - 8105 (押金)', time: '今天 11:20', amount: -200.00, method: 'wechat', methodLabel: '微信退款' },
  { id: 'TRX-1004', type: 'income', title: '客房订单 - 8312', time: '昨天 22:10', amount: 560.00, method: 'card', methodLabel: '银行卡' },
  { id: 'TRX-1005', type: 'income', title: '商品销售 - 迷你吧', time: '昨天 19:40', amount: 45.00, method: 'cash', methodLabel: '现金' },
  { id: 'TRX-1006', type: 'expense', title: '客房退款 - 8208 (取消单)', time: '昨天 16:05', amount: -480.00, method: 'alipay', methodLabel: '支付宝退款' },
  { id: 'TRX-1007', type: 'income', title: '客房订单 - 8501', time: '昨天 14:00', amount: 1280.00, method: 'card', methodLabel: '银行卡' },
];

type PaymentMethod = 'wechat' | 'alipay' | 'card' | 'cash';

const methodConfig: Record<PaymentMethod, { icon: string; color: string; bg: string }> = {
  wechat: { icon: 'chat', color: '#10b981', bg: '#ecfdf5' },
  alipay: { icon: 'account-balance', color: '#3b82f6', bg: '#eff6ff' },
  card: { icon: 'credit-card', color: '#6366f1', bg: '#eef2ff' },
  cash: { icon: 'money', color: '#f59e0b', bg: '#fffbeb' },
};

const tabs = [
  { id: 'all', label: '全部流水' },
  { id: 'income', label: '收入' },
  { id: 'expense', label: '支出/退款' },
] as const;

export default function FinanceTransactions() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [tabWidth, setTabWidth] = useState(0);

  const filteredData = mockTransactions.filter(
    t => activeTab === 'all' || t.type === activeTab,
  );

  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  const indicatorStyle = useAnimatedStyle(() => {
    if (tabWidth === 0) return { left: 0 };
    const segW = tabWidth / tabs.length;
    const indW = 24;
    const target = activeIndex * segW + (segW - indW) / 2;
    return {
      left: withTiming(target, { duration: 250, easing: Easing.inOut(Easing.ease) }),
    };
  }, [activeIndex, tabWidth]);

  const handleTabLayout = (e: LayoutChangeEvent) => {
    setTabWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight ?? 24) + 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 8, marginLeft: -8 }}
            activeOpacity={0.5}
          >
            <MaterialIcons name="arrow-back-ios" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827' }}>流水明细</Text>
          <TouchableOpacity style={{ padding: 8, marginRight: -8 }} activeOpacity={0.5}>
            <MaterialIcons name="filter-list" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 8 }}>
          <View style={{ backgroundColor: '#f3f4f6', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 40 }}>
            <MaterialIcons name="search" size={18} color="#9ca3af" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="搜索订单号或房间号"
              placeholderTextColor="#9ca3af"
              style={{ flex: 1, fontSize: 15, color: '#111827', padding: 0 }}
              autoCorrect={false}
            />
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
        <View
          style={{ flexDirection: 'row', paddingHorizontal: 16, position: 'relative' }}
          onLayout={handleTabLayout}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{ flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 12 }}
              activeOpacity={1}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: activeTab === tab.id ? '#ff6c65' : '#6b7280',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              indicatorStyle,
              {
                position: 'absolute',
                bottom: 0,
                width: 24,
                height: 3,
                backgroundColor: '#ff6c65',
                borderRadius: 1.5,
              },
            ]}
          />
        </View>
      </View>

      {/* List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.map((item, index) => {
          const config = methodConfig[item.method as PaymentMethod];
          return (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(200).delay(index * 50)}
              exiting={FadeOut.duration(200)}
              layout={LinearTransition}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#f9fafb',
              }}
            >
              {/* Method Icon */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: config.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name={config.icon} size={22} color={config.color} />
              </View>

              {/* Info */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: '500', color: '#111827', marginBottom: 4 }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 12, color: '#9ca3af' }}>{item.time}</Text>
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#d1d5db' }} />
                  <Text style={{ fontSize: 12, color: '#9ca3af' }}>{item.methodLabel}</Text>
                </View>
              </View>

              {/* Amount */}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: item.type === 'income' ? '#10b981' : '#111827',
                  marginLeft: 12,
                }}
              >
                {item.type === 'income' ? '+' : ''}
                {item.amount.toFixed(2)}
              </Text>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}
