import React, { useCallback, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { FlatList as FlatListType } from 'react-native';
import type { Room } from '../mockData';
import RoomCard from './RoomCard';

const COLORS = {
  textLight: '#8892A6',
};

interface RoomListProps {
  rooms: Room[];
  onBook: (room: Room) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onBook }) => {
  const listRef = useRef<FlatListType<Room>>(null);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [rooms]);

  const renderItem = useCallback(({ item, index }: { item: Room; index: number }) => (
    <RoomCard room={item} index={index} onBook={onBook} />
  ), [onBook]);

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const renderEmpty = useCallback(() => (
    <View style={styles.empty}>
      <MaterialIcons name="search-off" size={48} color={COLORS.textLight} />
      <Text style={styles.emptyText}>暂无符合条件的房型</Text>
    </View>
  ), []);

  return (
    <FlatList
      ref={listRef}
      data={rooms}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 12,
  },
});

export default RoomList;
