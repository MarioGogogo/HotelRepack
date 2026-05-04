import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';
import type { CleaningTask, CleaningStatus } from '../mockData';

const STATUS_CONFIG: Record<CleaningStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: '待打扫', color: '#F59E0B', bg: '#FFFBEB', icon: 'schedule' },
  in_progress: { label: '打扫中', color: '#3B82F6', bg: '#EFF6FF', icon: 'cleaning-services' },
  completed: { label: '已完成', color: '#059669', bg: '#ECFDF5', icon: 'check-circle' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  urgent: { label: '紧急', color: '#EF4444' },
  normal: { label: '普通', color: '#F59E0B' },
  low: { label: '低优', color: '#94A3B8' },
};

const NEXT_STATUS: Record<CleaningStatus, CleaningStatus | null> = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: null,
};

const ACTION_LABEL: Record<CleaningStatus, string> = {
  pending: '开始',
  in_progress: '完成',
  completed: '已结束',
};

interface TaskCardProps {
  task: CleaningTask;
  index: number;
  onStatusChange: (taskId: string, newStatus: CleaningStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onStatusChange }) => {
  const scale = useSharedValue(1);
  const animatedBtnStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const statusConf = STATUS_CONFIG[task.status];
  const priorityConf = PRIORITY_CONFIG[task.priority];
  const nextStatus = NEXT_STATUS[task.status];

  const onPressIn = useCallback(() => { scale.value = withSpring(0.94); }, []);
  const onPressOut = useCallback(() => { scale.value = withSpring(1); }, []);

  return (
    <Animated.View entering={() => {
      'worklet';
      const d = index * 50;
      return {
        initialValues: { opacity: 0, transform: [{ scale: 0.7 }] },
        animations: {
          opacity: withDelay(d, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })),
          transform: [{ scale: withDelay(d, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })) }],
        },
      };
    }}>
      <View style={styles.card}>
        {/* 顶部：房号 + 状态 */}
        <View style={styles.topRow}>
          <View style={styles.roomInfo}>
            <View style={[styles.floorBadge]}>
              <Text style={styles.floorText}>{task.floor}F</Text>
            </View>
            <Text style={styles.roomNumber}>{task.roomNumber}</Text>
            <Text style={styles.roomType}>{task.roomType}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConf.bg }]}>
            <MaterialIcons name={statusConf.icon as any} size={13} color={statusConf.color} />
            <Text style={[styles.statusText, { color: statusConf.color }]}>{statusConf.label}</Text>
          </View>
        </View>

        {/* 详情行 */}
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <MaterialIcons name="person-outline" size={14} color="#94A3B8" />
            <Text style={styles.detailText}>{task.assignee}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="timer-outline" size={14} color="#94A3B8" />
            <Text style={styles.detailText}>约{task.estimatedMinutes}分钟</Text>
          </View>
          {task.checkoutTime && (
            <View style={styles.detailItem}>
              <MaterialIcons name="login" size={14} color="#94A3B8" />
              <Text style={styles.detailText}>退房 {task.checkoutTime}</Text>
            </View>
          )}
        </View>

        {/* 备注 + 优先级 + 操作 */}
        <View style={styles.bottomRow}>
          <View style={styles.bottomLeft}>
            {task.remark && (
              <Text style={styles.remarkText} numberOfLines={1}>
                {task.remark}
              </Text>
            )}
            {task.priority === 'urgent' && (
              <View style={[styles.priorityTag, { backgroundColor: priorityConf.color + '15' }]}>
                <Text style={[styles.priorityText, { color: priorityConf.color }]}>
                  {priorityConf.label}
                </Text>
              </View>
            )}
          </View>

          {nextStatus && (
            <TouchableOpacity
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => onStatusChange(task.id, nextStatus)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.actionBtn,
                  { backgroundColor: statusConf.color },
                  animatedBtnStyle,
                ]}
              >
                <Text style={styles.actionText}>{ACTION_LABEL[task.status]}</Text>
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  floorBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  roomNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  roomType: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  bottomLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  remarkText: {
    fontSize: 12,
    color: '#94A3B8',
    flex: 1,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TaskCard;
