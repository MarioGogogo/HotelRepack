import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Toast, { ToastRef } from '../../components/Toast';
import { ROOMS } from '../HotelReservation/mockData';
import type { Room } from '../HotelReservation/mockData';

const COLORS = {
  primary: '#1B2A4A',
  accent: '#C8A96E',
  bg: '#F5F7FA',
  card: '#FFFFFF',
  text: '#1B2A4A',
  textLight: '#8892A6',
  border: 'rgba(0,0,0,0.06)',
  tagBg: 'rgba(200,169,110,0.1)',
};

type RootStackParamList = {
  ReservationDetail: { roomId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ReservationDetail'>;

// 日期快捷选项
const DATE_OPTIONS = [
  { label: '今天', value: 0 },
  { label: '明天', value: 1 },
  { label: '后天', value: 2 },
];

const ReservationDetail: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const toastRef = useRef<ToastRef>(null);

  const room = useMemo(() => ROOMS.find(r => r.id === route.params.roomId), [route.params.roomId]);

  const [checkInOffset, setCheckInOffset] = useState(0);
  const [checkOutOffset, setCheckOutOffset] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  const submitScale = useSharedValue(1);
  const submitAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: submitScale.value }] }));

  // 计算日期
  const getDateByOffset = (offset: number) => {
    const today = new Date();
    const target = new Date(today.getTime() + offset * 24 * 60 * 60 * 1000);
    return `${target.getMonth() + 1}月${target.getDate()}日`;
  };

  const checkInDate = getDateByOffset(checkInOffset);
  const checkOutDate = getDateByOffset(checkOutOffset);
  const nights = checkOutOffset - checkInOffset;
  const totalPrice = room ? room.price * nights : 0;

  const onPressIn = useCallback(() => { submitScale.value = withSpring(0.96); }, []);
  const onPressOut = useCallback(() => { submitScale.value = withSpring(1); }, []);

  const handleSubmit = useCallback(() => {
    if (!guestName.trim()) {
      toastRef.current?.show({ type: 'warning', message: '请填写入住人姓名', duration: 2000 });
      return;
    }
    if (!guestPhone.trim()) {
      toastRef.current?.show({ type: 'warning', message: '请填写联系电话', duration: 2000 });
      return;
    }
    if (nights <= 0) {
      toastRef.current?.show({ type: 'warning', message: '离店日期需晚于入住日期', duration: 2000 });
      return;
    }

    toastRef.current?.show({
      type: 'success',
      message: `${room?.name} 预订成功！${checkInDate} - ${checkOutDate} 共${nights}晚`,
      duration: 3000,
    });

    setTimeout(() => navigation.goBack(), 1500);
  }, [guestName, guestPhone, nights, room, checkInDate, checkOutDate, navigation]);

  if (!room) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 100 }}>房间信息不存在</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>预订详情</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 房间信息卡片 */}
        <Animated.View entering={FadeInDown.springify()} style={styles.roomCard}>
          <View style={[styles.roomImage, { backgroundColor: room.imageColor }]}>
            <MaterialIcons name="king-bed" size={40} color="rgba(255,255,255,0.5)" />
          </View>
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomSpec}>{room.area}  |  {room.bedType}  |  {room.floor}</Text>
            <View style={styles.tagsRow}>
              {room.amenities.map(tag => (
                <View key={tag.id} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.roomPriceRow}>
              <Text style={styles.roomPriceLabel}>房价</Text>
              <View style={styles.roomPriceWrap}>
                <Text style={styles.priceSymbol}>¥</Text>
                <Text style={styles.priceValue}>{room.price}</Text>
                <Text style={styles.priceUnit}>/晚</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* 日期选择 */}
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>入住日期</Text>
          <View style={styles.dateOptions}>
            {DATE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.dateOption, checkInOffset === opt.value && styles.dateOptionActive]}
                onPress={() => {
                  setCheckInOffset(opt.value);
                  if (checkOutOffset <= opt.value) setCheckOutOffset(opt.value + 1);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.dateOptionText, checkInOffset === opt.value && styles.dateOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.selectedDate}>{checkInDate} 入住</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>离店日期</Text>
          <View style={styles.dateOptions}>
            {DATE_OPTIONS.slice(1).map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.dateOption, checkOutOffset === opt.value && styles.dateOptionActive]}
                onPress={() => setCheckOutOffset(opt.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dateOptionText, checkOutOffset === opt.value && styles.dateOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.dateOption, checkOutOffset > 2 && styles.dateOptionActive]}
              onPress={() => setCheckOutOffset(3)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateOptionText, checkOutOffset > 2 && styles.dateOptionTextActive]}>
                3天后
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.selectedDate}>{checkOutDate} 离店  ·  共 {nights} 晚</Text>
        </Animated.View>

        {/* 入住人信息 */}
        <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>入住人信息</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="person-outline" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.input}
              placeholder="入住人姓名"
              placeholderTextColor={COLORS.textLight}
              value={guestName}
              onChangeText={setGuestName}
            />
          </View>
          <View style={[styles.inputRow, { marginTop: 12 }]}>
            <MaterialIcons name="phone-outline" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.input}
              placeholder="联系电话"
              placeholderTextColor={COLORS.textLight}
              value={guestPhone}
              onChangeText={setGuestPhone}
              keyboardType="phone-pad"
            />
          </View>
        </Animated.View>

        {/* 特殊要求 */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>特殊要求（可选）</Text>
          <TextInput
            style={styles.textArea}
            placeholder="如：需要高楼层、无烟房、婴儿床等..."
            placeholderTextColor={COLORS.textLight}
            value={specialRequest}
            onChangeText={setSpecialRequest}
            multiline
            numberOfLines={3}
          />
        </Animated.View>

        {/* 价格明细 */}
        <Animated.View entering={FadeInDown.delay(240).springify()} style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>房费 ({nights}晚)</Text>
            <Text style={styles.priceRowValue}>¥{room.price * nights}</Text>
          </View>
          <View style={[styles.priceRow, { marginTop: 8 }]}>
            <Text style={styles.priceRowLabel}>服务费</Text>
            <Text style={styles.priceRowValue}>¥0</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>合计</Text>
            <View style={styles.totalPriceWrap}>
              <Text style={styles.totalSymbol}>¥</Text>
              <Text style={styles.totalValue}>{totalPrice}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* 底部提交按钮 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={handleSubmit}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.submitBtn, submitAnimatedStyle]}>
            <View style={styles.submitPriceWrap}>
              <Text style={styles.submitPriceSymbol}>¥</Text>
              <Text style={styles.submitPriceValue}>{totalPrice}</Text>
            </View>
            <Text style={styles.submitText}>确认预订</Text>
          </Animated.View>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  roomCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#1B2A4A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  roomImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomInfo: {
    flex: 1,
    paddingLeft: 14,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  roomSpec: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: COLORS.tagBg,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '500',
  },
  roomPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  roomPriceLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  roomPriceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceSymbol: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.accent,
  },
  priceUnit: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 2,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  dateOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  dateOptionActive: {
    backgroundColor: COLORS.accent,
  },
  dateOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  dateOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedDate: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    padding: 0,
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80,
  },
  priceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRowLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  priceRowValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 12,
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.card,
    ...Platform.select({
      ios: {
        shadowColor: '#1B2A4A',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    height: 52,
    borderRadius: 16,
    gap: 12,
  },
  submitPriceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  submitPriceSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  submitPriceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default ReservationDetail;