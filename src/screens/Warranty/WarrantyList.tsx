import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  LayoutChangeEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const mockTickets = [
  { id: 'REP-20231001', room: '8201', type: '空调故障', status: 'pending', time: '10分钟前', urgent: true },
  { id: 'REP-20231002', room: '8305', type: '电视无法开机', status: 'processing', time: '2小时前', urgent: false },
  { id: 'REP-20231003', room: '8112', type: '下水道堵塞', status: 'processing', time: '昨天 15:30', urgent: true },
  { id: 'REP-20230928', room: '8408', type: '房门门锁没电', status: 'completed', time: '09-28', urgent: false },
  { id: 'REP-20230927', room: '8502', type: '淋浴喷头漏水', status: 'completed', time: '09-27', urgent: false },
];

const statusConfig = {
  pending: { label: '待处理', color: '#ff6c65', bg: '#fff0f0', icon: 'schedule' },
  processing: { label: '处理中', color: '#f59e0b', bg: '#fffbeb', icon: 'build' },
  completed: { label: '已完成', color: '#10b981', bg: '#ecfdf5', icon: 'check-circle' },
};

const TABS = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待处理' },
  { id: 'processing', label: '处理中' },
  { id: 'completed', label: '已完成' },
];

const TAB_INDICATOR_WIDTH = 24;

export default function WarrantyList() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');
  const [containerWidth, setContainerWidth] = useState(0);
  const hasInitialized = useRef(false);

  // Tab indicator animation
  const indicatorTranslateX = useSharedValue(0);
  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorTranslateX.value }],
  }));

  // FAB press animation
  const fabScale = useSharedValue(1);
  const animatedFabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  // Animate tab indicator when activeTab or containerWidth changes
  useEffect(() => {
    if (containerWidth === 0) return;
    const tabWidth = containerWidth / TABS.length;
    const index = TABS.findIndex(t => t.id === activeTab);
    const targetX = tabWidth * index + (tabWidth - TAB_INDICATOR_WIDTH) / 2;

    if (!hasInitialized.current) {
      indicatorTranslateX.value = targetX;
      hasInitialized.current = true;
    } else {
      indicatorTranslateX.value = withSpring(targetX, {
        damping: 20,
        stiffness: 200,
      });
    }
  }, [activeTab, containerWidth]);

  const filteredTickets = mockTickets.filter(
    t => activeTab === 'all' || t.status === activeTab,
  );

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-ios" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>设备保修</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索房号、单号"
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Icon name="filter-list" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs with animated indicator */}
      <View style={styles.tabBar}>
        <View
          style={styles.tabRow}
          onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
          {/* Animated sliding indicator */}
          <Animated.View style={[styles.tabIndicator, animatedIndicatorStyle]} />
        </View>
      </View>

      {/* List */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTickets.map((ticket, index) => {
          const config = statusConfig[ticket.status as keyof typeof statusConfig];
          return (
            <Animated.View
              key={ticket.id}
              entering={FadeIn.duration(200).delay(index * 50)}
              exiting={FadeOut.duration(150)}
              layout={LinearTransition.springify().damping(20).stiffness(200)}
            >
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('WarrantyDetail' as never)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardTopLeft}>
                    <Text style={styles.roomNumber}>{ticket.room}</Text>
                    {ticket.urgent && (
                      <View style={styles.urgentBadge}>
                        <Icon name="warning" size={12} color="#ff6c65" />
                        <Text style={styles.urgentText}>加急</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                    <Icon name={config.icon} size={14} color={config.color} />
                    <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                  </View>
                </View>

                <Text style={styles.issueType}>{ticket.type}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>单号: {ticket.id}</Text>
                  <Text style={styles.footerText}>{ticket.time}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {filteredTickets.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="check-circle" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>暂无相关保修单</Text>
          </View>
        )}

        {/* bottom padding for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB with press animation */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <Animated.View style={[styles.fab, animatedFabStyle]}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => { fabScale.value = withSpring(0.9, { damping: 15, stiffness: 200 }); }}
            onPressOut={() => { fabScale.value = withSpring(1, { damping: 15, stiffness: 200 }); }}
            onPress={() => navigation.navigate('WarrantyEquipment' as never)}
            style={styles.fabInner}
          >
            <Icon name="add" size={22} color="#fff" />
            <Text style={styles.fabText}>报修新设备</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 38,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
    height: 40,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#999',
  },
  tabLabelActive: {
    color: '#ff6c65',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: TAB_INDICATOR_WIDTH,
    height: 3,
    backgroundColor: '#ff6c65',
    borderRadius: 1.5,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  urgentText: {
    fontSize: 11,
    color: '#ff6c65',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  issueType: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#b0b0b0',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#b0b0b0',
    marginTop: 12,
    fontSize: 15,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    borderRadius: 28,
    shadowColor: '#ff6c65',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6c65',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
