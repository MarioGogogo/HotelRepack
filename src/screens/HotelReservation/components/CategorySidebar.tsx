import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { RoomCategory } from '../mockData';

const COLORS = {
  sidebarBg: '#F0F2F5',
  sidebarActive: '#FFFFFF',
  accent: '#C8A96E',
  text: '#1B2A4A',
  textLight: '#8892A6',
};

interface CategorySidebarProps {
  categories: RoomCategory[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, selectedId, onSelect }) => {
  const renderItem = useCallback(({ item }: { item: RoomCategory }) => {
    const isActive = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.item, isActive && styles.itemActive]}
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        {isActive && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.indicator} />
        )}
        <MaterialIcons
          name={item.icon as any}
          size={24}
          color={isActive ? COLORS.accent : COLORS.textLight}
        />
        <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedId, onSelect]);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        extraData={selectedId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 88,
    backgroundColor: COLORS.sidebarBg,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  itemActive: {
    backgroundColor: COLORS.sidebarActive,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 6,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default CategorySidebar;
