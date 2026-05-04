import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet, Text, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast, { ToastRef } from '../../components/Toast';
import { TASKS, STATUS_TABS } from './mockData';
import type { CleaningStatus, CleaningTask } from './mockData';
import StatusTabs from './components/StatusTabs';
import StatsBar from './components/StatsBar';
import TaskCard from './components/TaskCard';

const COLORS = {
  primary: '#059669',
  bg: '#F8FAFB',
  card: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748b',
};

type RootStackParamList = {
  HotelCleaning: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'HotelCleaning'>;

const HotelCleaning: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const toastRef = useRef<ToastRef>(null);

  const [activeTab, setActiveTab] = useState<CleaningStatus | 'all'>('all');
  const [tasks, setTasks] = useState<CleaningTask[]>(TASKS);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: stats.pending,
    in_progress: stats.inProgress,
    completed: stats.completed,
  }), [tasks, stats]);

  const filteredTasks = useMemo(() => {
    if (activeTab === 'all') return tasks;
    return tasks.filter(t => t.status === activeTab);
  }, [tasks, activeTab]);

  const handleStatusChange = useCallback((taskId: string, newStatus: CleaningStatus) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : null }
          : t
      )
    );
    const task = tasks.find(t => t.id === taskId);
    const statusLabel = { pending: '待打扫', in_progress: '打扫中', completed: '已完成' }[newStatus];
    toastRef.current?.show({
      type: 'success',
      message: `${task?.roomNumber} 房间已更新为「${statusLabel}」`,
      duration: 2000,
    });
  }, [tasks]);

  const renderItem = useCallback(({ item, index }: { item: CleaningTask; index: number }) => (
    <TaskCard task={item} index={index} onStatusChange={handleStatusChange} />
  ), [handleStatusChange]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>客房打扫</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => setTasks(TASKS)}>
            <MaterialIcons name="refresh" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <StatsBar {...stats} />

      {/* Status Tabs */}
      <StatusTabs
        tabs={STATUS_TABS}
        activeKey={activeTab}
        onSelect={setActiveTab}
        counts={counts}
      />

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Toast ref={toastRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 8,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  refreshBtn: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },
  separator: {
    height: 10,
  },
});

export default HotelCleaning;
