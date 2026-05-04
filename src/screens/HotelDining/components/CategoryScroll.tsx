import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { MenuCategory } from '../mockData';

const COLORS = {
  active: '#F97316',
  activeBg: '#FFF7ED',
  inactive: '#64748b',
  inactiveBg: '#F1F5F9',
};

interface CategoryScrollProps {
  categories: MenuCategory[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const CategoryScroll: React.FC<CategoryScrollProps> = ({ categories, selectedId, onSelect }) => {
  return (
    <View style={styles.container}>
      {categories.map(cat => {
        const isActive = cat.id === selectedId;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={cat.icon as any}
              size={20}
              color={isActive ? COLORS.active : COLORS.inactive}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {cat.name}
            </Text>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.inactiveBg,
    gap: 5,
  },
  itemActive: {
    backgroundColor: COLORS.activeBg,
    borderWidth: 1,
    borderColor: COLORS.active + '30',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.inactive,
  },
  labelActive: {
    color: COLORS.active,
    fontWeight: '600',
  },
});

export default CategoryScroll;
