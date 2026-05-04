import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { CleaningStatus } from '../mockData';

const COLORS = {
  active: '#059669',
  activeBg: '#ECFDF5',
  inactive: '#64748b',
  inactiveBg: '#F1F5F9',
};

interface StatusTabsProps {
  tabs: { key: CleaningStatus | 'all'; label: string }[];
  activeKey: CleaningStatus | 'all';
  onSelect: (key: CleaningStatus | 'all') => void;
  counts: Record<string, number>;
}

const StatusTabs: React.FC<StatusTabsProps> = ({ tabs, activeKey, onSelect, counts }) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onSelect(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {counts[tab.key] > 0 && (
              <View style={[styles.badge, isActive && styles.badgeActive]}>
                <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                  {counts[tab.key]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.inactiveBg,
    gap: 5,
  },
  tabActive: {
    backgroundColor: COLORS.activeBg,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.inactive,
  },
  tabTextActive: {
    color: COLORS.active,
    fontWeight: '600',
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeActive: {
    backgroundColor: COLORS.active,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  badgeTextActive: {
    color: '#FFFFFF',
  },
});

export default StatusTabs;
