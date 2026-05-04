import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast, { ToastRef } from '../../components/Toast';
import { CATEGORIES, MENU_ITEMS } from './mockData';
import type { MenuItem, CartItem } from './mockData';
import CategoryScroll from './components/CategoryScroll';
import MenuItemCard from './components/MenuItemCard';
import CartButton from './components/CartButton';
import OrderModal from './components/OrderModal';

const COLORS = {
  accent: '#F97316',
  bg: '#FFF7ED',
  card: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748b',
};

type RootStackParamList = {
  HotelDining: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'HotelDining'>;

const HotelDining: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const toastRef = useRef<ToastRef>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORIES[0].id);
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [modalVisible, setModalVisible] = useState(false);

  const filteredItems = useMemo(() =>
    MENU_ITEMS.filter(item => item.categoryId === selectedCategoryId),
    [selectedCategoryId]
  );

  const cartItems = useMemo(() => Array.from(cart.values()), [cart]);

  const totalCount = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const getItemQuantity = useCallback((itemId: string) =>
    cart.get(itemId)?.quantity || 0,
    [cart]
  );

  const handleAdd = useCallback((item: MenuItem) => {
    setCart(prev => {
      const newCart = new Map(prev);
      const existing = newCart.get(item.id);
      if (existing) {
        newCart.set(item.id, { ...existing, quantity: existing.quantity + 1 });
      } else {
        newCart.set(item.id, { ...item, quantity: 1 });
      }
      return newCart;
    });
  }, []);

  const handleRemove = useCallback((item: MenuItem) => {
    setCart(prev => {
      const newCart = new Map(prev);
      const existing = newCart.get(item.id);
      if (existing) {
        if (existing.quantity <= 1) {
          newCart.delete(item.id);
        } else {
          newCart.set(item.id, { ...existing, quantity: existing.quantity - 1 });
        }
      }
      return newCart;
    });
  }, []);

  const handleModalAdd = useCallback((itemId: string) => {
    const item = MENU_ITEMS.find(m => m.id === itemId);
    if (item) handleAdd(item);
  }, [handleAdd]);

  const handleModalRemove = useCallback((itemId: string) => {
    const item = MENU_ITEMS.find(m => m.id === itemId);
    if (item) handleRemove(item);
  }, [handleRemove]);

  const handleConfirmOrder = useCallback(() => {
    setModalVisible(false);
    setCart(new Map());
    toastRef.current?.show({
      type: 'success',
      message: `订单已提交，共 ${totalCount} 件商品，合计 ¥${totalPrice}`,
      duration: 2500,
    });
  }, [totalCount, totalPrice]);

  const renderItem = useCallback(({ item, index }: { item: MenuItem; index: number }) => (
    <MenuItemCard
      item={item}
      index={index}
      quantity={getItemQuantity(item.id)}
      onAdd={handleAdd}
      onRemove={handleRemove}
    />
  ), [getItemQuantity, handleAdd, handleRemove]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>餐饮服务</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <MaterialIcons name="search" size={22} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <CategoryScroll
        categories={CATEGORIES}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      {/* Menu List */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Cart Button */}
      <CartButton
        totalCount={totalCount}
        totalPrice={totalPrice}
        onPress={() => setModalVisible(true)}
      />

      {/* Order Modal */}
      <OrderModal
        visible={modalVisible}
        cartItems={cartItems}
        totalPrice={totalPrice}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmOrder}
        onRemove={handleModalRemove}
        onAdd={handleModalAdd}
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
  searchBtn: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 120,
  },
  separator: {
    height: 10,
  },
});

export default HotelDining;