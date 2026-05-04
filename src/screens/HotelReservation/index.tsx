import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast, { ToastRef } from '../../components/Toast';
import { CATEGORIES, ROOMS } from './mockData';
import SearchBar from './components/SearchBar';
import CategorySidebar from './components/CategorySidebar';
import RoomList from './components/RoomList';
import type { Room } from './mockData';

const COLORS = {
  primary: '#1B2A4A',
  accent: '#C8A96E',
  bg: '#F5F7FA',
  card: '#FFFFFF',
  text: '#1B2A4A',
  textLight: '#8892A6',
};

type RootStackParamList = {
  HotelReservation: undefined;
  ReservationDetail: { roomId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'HotelReservation'>;

const HotelReservation: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const toastRef = useRef<ToastRef>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const filteredRooms = useMemo(() => {
    let result = ROOMS.filter(r => r.categoryId === selectedCategoryId);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.bedType.toLowerCase().includes(q)
      );
    }

    if (maxPrice !== null) {
      result = result.filter(r => r.price <= maxPrice);
    }

    return result;
  }, [selectedCategoryId, searchQuery, maxPrice]);

  const handleBook = useCallback((room: Room) => {
    navigation.navigate('ReservationDetail', { roomId: room.id });
  }, [navigation]);

  const handlePriceFilter = useCallback((value: number | null) => {
    setMaxPrice(value);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>客房预订</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onPriceFilterChange={handlePriceFilter}
        activePriceFilter={maxPrice}
      />

      {/* Main Content */}
      <View style={styles.body}>
        <CategorySidebar
          categories={CATEGORIES}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
        <View style={styles.rightPanel}>
          <RoomList rooms={filteredRooms} onBook={handleBook} />
        </View>
      </View>

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
        shadowColor: '#1B2A4A',
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
  headerRight: {
    width: 36,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});

export default HotelReservation;
