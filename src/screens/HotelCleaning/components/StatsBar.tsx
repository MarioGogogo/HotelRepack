import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeIn } from 'react-native-reanimated';

const COLORS = {
  card: '#FFFFFF',
  pending: '#F59E0B',
  inProgress: '#3B82F6',
  completed: '#059669',
  text: '#1E293B',
  textLight: '#64748b',
};

interface StatsBarProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const StatCard: React.FC<{
  icon: string;
  label: string;
  value: number;
  color: string;
  index: number;
}> = ({ icon, label, value, color, index }) => (
  <Animated.View
    entering={FadeIn.delay(index * 80).springify()}
    style={styles.card}
  >
    <View style={[styles.iconWrap, { backgroundColor: color + '15' }]}>
      <MaterialIcons name={icon} size={18} color={color} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </Animated.View>
);

const StatsBar: React.FC<StatsBarProps> = ({ total, pending, inProgress, completed }) => {
  return (
    <View style={styles.container}>
      <StatCard icon="assignment" label="总任务" value={total} color="#6366f1" index={0} />
      <StatCard icon="schedule" label="待打扫" value={pending} color={COLORS.pending} index={1} />
      <StatCard icon="cleaning-services" label="进行中" value={inProgress} color={COLORS.inProgress} index={2} />
      <StatCard icon="check-circle" label="已完成" value={completed} color={COLORS.completed} index={3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  label: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
});

export default StatsBar;
