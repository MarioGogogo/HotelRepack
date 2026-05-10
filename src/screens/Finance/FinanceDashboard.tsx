import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-gifted-charts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32 - 32 - 32; // screen padding + container padding + chart area padding
const CHART_HEIGHT = 200;

// ─── Data ────────────────────────────────────────────────────────────
const revenueData = [
  { name: '10-01', amount: 12400 },
  { name: '10-02', amount: 14200 },
  { name: '10-03', amount: 18500 },
  { name: '10-04', amount: 22100 },
  { name: '10-05', amount: 19800 },
  { name: '10-06', amount: 15300 },
  { name: '10-07', amount: 16900 },
];

const occupancyData = [
  { name: '周一', rate: 75 },
  { name: '周二', rate: 82 },
  { name: '周三', rate: 88 },
  { name: '周四', rate: 95 },
  { name: '周五', rate: 100 },
  { name: '周六', rate: 98 },
  { name: '周日', rate: 85 },
];

// ─── Chart Data Builders ─────────────────────────────────────────────
type ChartType = 'revenue' | 'occupancy' | 'channel';
type TabDef = { id: ChartType; label: string; icon: string };

const CHART_TABS: TabDef[] = [
  { id: 'revenue', label: '营收趋势', icon: 'trending-up' },
  { id: 'occupancy', label: '出租率', icon: 'show-chart' },
  { id: 'channel', label: '客源渠道', icon: 'people' },
];

// ─── Animated Pressable Wrapper ──────────────────────────────────────
function ScaleButton({
  children,
  onPress,
  style,
  activeScale = 0.97,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  activeScale?: number;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[animStyle, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => (scale.value = withSpring(activeScale))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Channel Stacked Data ──────────────────────────────────────────
const channelStackData = [
  { label: 'OTA平台', stacks: [{ value: 120, color: '#ff6c65' }, { value: 0, color: '#10b981' }] },
  { label: '微信小程序', stacks: [{ value: 85, color: '#ff6c65' }, { value: 0, color: '#10b981' }] },
  { label: '企业协议', stacks: [{ value: 45, color: '#ff6c65' }, { value: 0, color: '#10b981' }] },
  { label: '散客/上门', stacks: [{ value: 0, color: '#ff6c65' }, { value: 60, color: '#10b981' }] },
];

// ─── Main Component ──────────────────────────────────────────────────
export default function FinanceDashboard() {
  const navigation = useNavigation<any>();
  const [activeChart, setActiveChart] = useState<ChartType>('revenue');

  const handleTabPress = (id: ChartType) => {
    setActiveChart(id);
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'revenue':
        return (
          <Animated.View key="revenue" entering={FadeInDown.springify().damping(15).stiffness(100)} exiting={FadeOutUp.duration(150)}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>近七日营收趋势</Text>
              <View style={styles.chartUnit}>
                <Text style={styles.chartUnitText}>单位：元</Text>
              </View>
            </View>
            <View style={styles.chartBody}>
              <Animated.View entering={FadeIn.delay(200).duration(400)}>
                <LineChart
                  data={revenueData.map((d) => ({
                    value: d.amount,
                    label: d.name,
                  }))}
                  color="#ff6c65"
                  thickness={3}
                  startFillColor="#ff6c65"
                  startOpacity={0.15}
                  endFillColor="#ff6c65"
                  endOpacity={0}
                  curved
                  isAnimated
                  animateOnDataChange
                  animationDuration={600}
                  width={CHART_WIDTH}
                  height={CHART_HEIGHT}
                  noOfSections={4}
                  yAxisLabelPrefix="¥"
                  showVerticalLines={false}
                  rulesColor="#f0f0f0"
                  rulesType="dashed"
                  xAxisColor="transparent"
                  yAxisColor="transparent"
                  xAxisLabelTextStyle={{ color: '#9ca3af', fontSize: 11 }}
                  yAxisTextStyle={{ color: '#9ca3af', fontSize: 11 }}
                  dataPointsColor="#ff6c65"
                  dataPointsRadius={4}
                  scrollToEnd
                />
              </Animated.View>
            </View>
          </Animated.View>
        );
      case 'occupancy':
        return (
          <Animated.View key="occupancy" entering={FadeInDown.springify().damping(15).stiffness(100).delay(50)} exiting={FadeOutUp.duration(150)}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>近七日出租率趋势</Text>
              <View style={styles.chartUnit}>
                <Text style={styles.chartUnitText}>单位：%</Text>
              </View>
            </View>
            <View style={styles.chartBody}>
              <Animated.View entering={FadeIn.delay(250).duration(400)}>
                <LineChart
                  data={occupancyData.map((d) => ({
                    value: d.rate,
                    label: d.name,
                  }))}
                  color="#3b82f6"
                  thickness={3}
                  startFillColor="#3b82f6"
                  startOpacity={0.15}
                  endFillColor="#3b82f6"
                  endOpacity={0}
                  curved
                  isAnimated
                  animateOnDataChange
                  animationDuration={600}
                  width={CHART_WIDTH}
                  height={CHART_HEIGHT}
                  maxValue={100}
                  noOfSections={4}
                  showVerticalLines={false}
                  rulesColor="#f0f0f0"
                  rulesType="dashed"
                  xAxisColor="transparent"
                  yAxisColor="transparent"
                  xAxisLabelTextStyle={{ color: '#9ca3af', fontSize: 11 }}
                  yAxisTextStyle={{ color: '#9ca3af', fontSize: 11 }}
                  dataPointsColor="#3b82f6"
                  dataPointsRadius={4}
                  scrollToEnd
                />
              </Animated.View>
            </View>
          </Animated.View>
        );
      case 'channel':
        return (
          <Animated.View key="channel" entering={FadeInDown.springify().damping(15).stiffness(100).delay(100)} exiting={FadeOutUp.duration(150)}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>本月客源渠道分布</Text>
              <View style={styles.chartUnit}>
                <Text style={styles.chartUnitText}>单位：单</Text>
              </View>
            </View>
            <View style={styles.chartBody}>
              <Animated.View entering={FadeIn.delay(300).duration(400)}>
                <BarChart
                  horizontal
                  stackData={channelStackData}
                  isAnimated
                  animationDuration={600}
                  width={CHART_WIDTH}
                  height={CHART_HEIGHT + 20}
                  barBorderRadius={4}
                  spacing={16}
                  initialSpacing={0}
                  xAxisColor="transparent"
                  yAxisColor="transparent"
                  yAxisLabelWidth={70}
                  xAxisLabelTextStyle={{ color: '#4b5563', fontSize: 12 }}
                  yAxisTextStyle={{ color: '#9ca3af', fontSize: 11 }}
                  hideRules
                />
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#ff6c65' }]} />
                    <Text style={styles.legendText}>线上预订</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.legendText}>线下散客</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          </Animated.View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
            activeOpacity={0.5}
          >
            <Icon name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>财务报表</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('提示', '日期选择功能开发中')}
            style={styles.headerBtn}
            activeOpacity={0.5}
          >
            <Icon name="calendar-today" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>今日实收 (元)</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsAmount}>32,850.00</Text>
          <View style={styles.statsBadge}>
            <Icon name="trending-up" size={14} color="#fff" />
            <Text style={styles.statsBadgeText}>12.5%</Text>
          </View>
        </View>

        <View style={styles.statsFooter}>
          <View style={styles.statsItem}>
            <Text style={styles.statsItemLabel}>出租率</Text>
            <Text style={styles.statsItemValue}>85.4%</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsItemLabel}>RevPAR (元)</Text>
            <Text style={styles.statsItemValue}>286.50</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <ScaleButton onPress={() => navigation.navigate('FinanceRevenue')} style={styles.actionBtn}>
            <View style={styles.actionInner}>
              <View style={[styles.actionIcon, { backgroundColor: '#eff6ff' }]}>
                <Icon name="pie-chart" size={20} color="#3b82f6" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>营收分析</Text>
                <Text style={styles.actionDesc}>收入构成占比</Text>
              </View>
            </View>
          </ScaleButton>

          <ScaleButton onPress={() => navigation.navigate('FinanceTransactions')} style={styles.actionBtn}>
            <View style={styles.actionInner}>
              <View style={[styles.actionIcon, { backgroundColor: '#fffbeb' }]}>
                <Icon name="receipt" size={20} color="#f59e0b" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>流水明细</Text>
                <Text style={styles.actionDesc}>交易记录查询</Text>
              </View>
            </View>
          </ScaleButton>
        </View>

        {/* Charts Container */}
        <View style={styles.chartContainer}>
          {/* Chart Segmented Control */}
          <View style={styles.segmentBar}>
            {CHART_TABS.map((tab) => {
              const isActive = activeChart === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => handleTabPress(tab.id)}
                  activeOpacity={0.7}
                  style={styles.segmentTab}
                >
                  <Icon
                    name={tab.icon}
                    size={16}
                    color={isActive ? '#ff6c65' : '#9ca3af'}
                  />
                  <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
                    {tab.label}
                  </Text>
                  {isActive && (
                    <Animated.View
                      entering={FadeIn.duration(150)}
                      style={styles.segmentIndicator}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Chart Area */}
          <Animated.View style={styles.chartArea} exiting={FadeOut.duration(150)}>
            {renderChart()}
          </Animated.View>
        </View>
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
    backgroundColor: '#ff6c65',
    paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight ?? 24) + 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    padding: 8,
    marginLeft: -8,
    marginRight: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },

  // Stats Card
  statsCard: {
    backgroundColor: '#ff6c65',
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  statsLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 24,
  },
  statsAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  statsBadgeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginLeft: 2,
  },
  statsFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  statsItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 12,
  },
  statsItemLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  statsItemValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
  },
  actionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  actionDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 1,
  },

  // Chart Container
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // Segment Control
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9ca3af',
  },
  segmentLabelActive: {
    color: '#ff6c65',
  },
  segmentIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#ff6c65',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  // Chart Area
  chartArea: {
    padding: 16,
    paddingTop: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  chartUnit: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chartUnitText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  chartBody: {
    // alignItems: 'center',
  },

  // Legend
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: '#9ca3af',
  },
});
