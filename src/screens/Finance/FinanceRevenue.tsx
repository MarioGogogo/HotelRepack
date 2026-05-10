import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-gifted-charts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const revenueData = [
  { name: '客房收入', value: 24500, color: '#ff6c65', percentage: 74.5 },
  { name: '餐饮收入', value: 5800, color: '#3b82f6', percentage: 17.7 },
  { name: '商品销售', value: 1200, color: '#10b981', percentage: 3.7 },
  { name: '增值服务', value: 850, color: '#f59e0b', percentage: 2.6 },
  { name: '其他收入', value: 500, color: '#8b5cf6', percentage: 1.5 },
];

const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);

const pieData = revenueData.map((item) => ({
  value: item.value,
  color: item.color,
}));

// ─── Animated Progress Bar ──────────────────────────────────────────
function ProgressBar({
  percent,
  color,
  delay,
}: {
  percent: number;
  color: string;
  delay: number;
}) {
  const [containerW, setContainerW] = useState(0);
  const widthSV = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => ({ width: widthSV.value }));

  useEffect(() => {
    if (containerW > 0) {
      widthSV.value = withDelay(
        delay,
        withSpring((containerW * percent) / 100, { damping: 20, stiffness: 80 }),
      );
    }
  }, [containerW]);

  return (
    <View
      onLayout={(e) => {
        if (containerW === 0) setContainerW(e.nativeEvent.layout.width);
      }}
      style={styles.progressBg}
    >
      <Animated.View style={[styles.progressFill, { backgroundColor: color }, animStyle]} />
    </View>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export default function FinanceRevenue() {
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState('today');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
            activeOpacity={0.5}
          >
            <Icon name="chevron-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>营收分析</Text>
          <TouchableOpacity
            onPress={() => {}}
            style={styles.headerBtn}
            activeOpacity={0.5}
          >
            <Icon name="calendar-today" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentBar}>
          {[
            { id: 'today', label: '今日' },
            { id: 'week', label: '本周' },
            { id: 'month', label: '本月' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setPeriod(tab.id)}
              activeOpacity={0.7}
              style={[styles.segmentTab, period === tab.id && styles.segmentTabActive]}
            >
              <Text style={[styles.segmentLabel, period === tab.id && styles.segmentLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Revenue Card */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>总营收 (元)</Text>
          <Text style={styles.revenueAmount}>¥{totalRevenue.toLocaleString()}</Text>

          <View style={styles.chartWrapper}>
            <PieChart
              data={pieData}
              donut
              isAnimated
              animationDuration={800}
              innerRadius={65}
              radius={90}
              strokeWidth={0}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelSub}>客房收入占比</Text>
                  <Text style={styles.centerLabelValue}>74.5%</Text>
                </View>
              )}
            />
          </View>
        </Animated.View>

        {/* Breakdown List */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.breakdownCard}
        >
          <Text style={styles.breakdownTitle}>收入构成明细</Text>

          {revenueData.map((item, index) => (
            <Animated.View
              key={item.name}
              entering={FadeInDown.delay(100 + index * 100).duration(400)}
              style={styles.breakdownItem}
            >
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.breakdownName}>{item.name}</Text>
                </View>
                <View style={styles.breakdownRight}>
                  <Text style={styles.breakdownValue}>
                    ¥{item.value.toLocaleString()}
                  </Text>
                  <Text style={styles.breakdownPercent}>{item.percentage}%</Text>
                </View>
              </View>
              <ProgressBar
                percent={item.percentage}
                color={item.color}
                delay={200 + index * 100}
              />
            </Animated.View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight ?? 24) + 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerBtn: {
    padding: 8,
    marginLeft: -8,
    marginRight: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
  },

  // Segment Control
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  segmentLabelActive: {
    color: '#111827',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Revenue Card
  revenueCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    marginBottom: 20,
  },
  revenueLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  chartWrapper: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelSub: {
    fontSize: 12,
    color: '#9ca3af',
  },
  centerLabelValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ff6c65',
  },

  // Breakdown Card
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  breakdownItem: {
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownName: {
    fontSize: 14,
    color: '#374151',
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  breakdownPercent: {
    fontSize: 13,
    color: '#9ca3af',
    width: 40,
    textAlign: 'right',
  },

  // Progress Bar
  progressBg: {
    height: 6,
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
