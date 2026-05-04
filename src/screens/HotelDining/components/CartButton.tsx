import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const COLORS = {
  accent: '#F97316',
  card: '#FFFFFF',
  text: '#1E293B',
};

interface CartButtonProps {
  totalCount: number;
  totalPrice: number;
  onPress: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ totalCount, totalPrice, onPress }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = useCallback(() => { scale.value = withSpring(0.96); }, []);
  const onPressOut = useCallback(() => { scale.value = withSpring(1); }, []);

  if (totalCount === 0) return null;

  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="shopping-bag" size={22} color="#FFFFFF" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalCount}</Text>
          </View>
        </View>
        <View style={styles.priceWrap}>
          <Text style={styles.priceSymbol}>¥</Text>
          <Text style={styles.priceValue}>{totalPrice}</Text>
        </View>
        <View style={styles.submitBtn}>
          <Text style={styles.submitText}>去下单</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 28,
    paddingLeft: 10,
    paddingRight: 5,
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  iconWrap: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 14,
  },
  priceSymbol: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    marginLeft: 10,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CartButton;
