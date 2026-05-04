import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { MenuItem } from '../mockData';

const COLORS = {
  accent: '#F97316',
  text: '#1E293B',
  textLight: '#64748b',
  card: '#FFFFFF',
  tagBg: '#FFF7ED',
};

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, index, quantity, onAdd, onRemove }) => {
  const addScale = useSharedValue(1);
  const addAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: addScale.value }] }));

  const onPressIn = useCallback(() => { addScale.value = withSpring(0.9); }, []);
  const onPressOut = useCallback(() => { addScale.value = withSpring(1); }, []);

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
      <View style={styles.card}>
        {/* 图片占位 */}
        <View style={[styles.imageBlock, { backgroundColor: item.imageColor }]}>
          <MaterialIcons name="restaurant" size={24} color="rgba(0,0,0,0.15)" />
        </View>

        {/* 信息区 */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            {item.spicy && (
              <Text style={styles.spicy}>辣</Text>
            )}
          </View>
          <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
          <View style={styles.tagsRow}>
            {item.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.priceWrap}>
              <Text style={styles.priceSymbol}>¥</Text>
              <Text style={styles.priceValue}>{item.price}</Text>
            </View>

            {quantity === 0 ? (
              <TouchableOpacity
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={() => onAdd(item)}
                activeOpacity={0.8}
              >
                <Animated.View style={[styles.addBtn, addAnimatedStyle]}>
                  <MaterialIcons name="add" size={20} color="#FFFFFF" />
                </Animated.View>
              </TouchableOpacity>
            ) : (
              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => onRemove(item)} activeOpacity={0.7}>
                  <View style={styles.stepBtn}>
                    <MaterialIcons name="remove" size={16} color={COLORS.accent} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={() => onAdd(item)} activeOpacity={0.7}>
                  <View style={styles.stepBtn}>
                    <MaterialIcons name="add" size={16} color={COLORS.accent} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  imageBlock: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  spicy: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  desc: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: COLORS.tagBg,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceSymbol: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.accent,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 16,
    textAlign: 'center',
  },
});

export default MenuItemCard;
