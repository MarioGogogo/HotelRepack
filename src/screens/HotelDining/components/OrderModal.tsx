import React, { useCallback } from 'react';
import { View, TouchableOpacity, Modal, FlatList, StyleSheet, Text, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { CartItem } from '../mockData';

const COLORS = {
  accent: '#F97316',
  text: '#1E293B',
  textLight: '#64748b',
  card: '#FFFFFF',
};

interface OrderModalProps {
  visible: boolean;
  cartItems: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onConfirm: () => void;
  onRemove: (itemId: string) => void;
  onAdd: (itemId: string) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  visible, cartItems, totalPrice, onClose, onConfirm, onRemove, onAdd,
}) => {
  const renderItem = useCallback(({ item }: { item: CartItem }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>¥{item.price}</Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity onPress={() => onRemove(item.id)} activeOpacity={0.7}>
          <View style={styles.stepBtn}>
            <MaterialIcons name="remove" size={14} color={COLORS.accent} />
          </View>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => onAdd(item.id)} activeOpacity={0.7}>
          <View style={styles.stepBtn}>
            <MaterialIcons name="add" size={14} color={COLORS.accent} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  ), [onRemove, onAdd]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View entering={FadeInUp.springify()} style={styles.sheet}>
          <TouchableOpacity activeOpacity={1}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>订单详情</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <MaterialIcons name="close" size={22} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {/* Item list */}
            <FlatList
              data={cartItems}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>合计</Text>
                <View style={styles.totalPriceWrap}>
                  <Text style={styles.totalSymbol}>¥</Text>
                  <Text style={styles.totalValue}>{totalPrice}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
                <Text style={styles.confirmText}>确认下单</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 12,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 14,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  totalPriceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.accent,
  },
  confirmBtn: {
    backgroundColor: COLORS.accent,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default OrderModal;
