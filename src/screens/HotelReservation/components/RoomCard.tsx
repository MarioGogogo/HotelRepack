import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { Room } from '../mockData';

const COLORS = {
  accent: '#C8A96E',
  primary: '#1B2A4A',
  text: '#1B2A4A',
  textLight: '#8892A6',
  card: '#FFFFFF',
  tagBg: 'rgba(200, 169, 110, 0.1)',
};

interface RoomCardProps {
  room: Room;
  index: number;
  onBook: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, index, onBook }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.94);
  }, []);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, []);

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <View style={styles.card}>
        <View style={[styles.imagePlaceholder, { backgroundColor: room.imageColor }]}>
          <MaterialIcons name="king-bed" size={32} color="rgba(255,255,255,0.6)" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{room.name}</Text>
          <Text style={styles.specs} numberOfLines={1}>
            {room.area}  |  {room.bedType}  |  {room.floor}
          </Text>

          <View style={styles.tagsRow}>
            {room.amenities.slice(0, 3).map(tag => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.label}</Text>
              </View>
            ))}
            {room.amenities.length > 3 && (
              <Text style={styles.moreText}>+{room.amenities.length - 3}</Text>
            )}
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.priceWrap}>
              <Text style={styles.priceSymbol}>¥</Text>
              <Text style={styles.priceValue}>{room.price}</Text>
              <Text style={styles.priceUnit}>/晚</Text>
            </View>

            <TouchableOpacity
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => onBook(room)}
              activeOpacity={0.8}
            >
              <Animated.View style={[styles.bookBtn, animatedStyle]}>
                <Text style={styles.bookText}>预订</Text>
              </Animated.View>
            </TouchableOpacity>
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
    borderRadius: 16,
    padding: 12,
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
  imagePlaceholder: {
    width: 110,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  specs: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: COLORS.tagBg,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '500',
  },
  moreText: {
    fontSize: 11,
    color: COLORS.textLight,
    alignSelf: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  priceWrap: {
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
    fontSize: 11,
    color: COLORS.textLight,
    marginLeft: 2,
  },
  bookBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default RoomCard;
