import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PRICE_FILTERS } from '../mockData';

const COLORS = {
  card: '#FFFFFF',
  accent: '#C8A96E',
  text: '#1B2A4A',
  textLight: '#8892A6',
  border: 'rgba(0, 0, 0, 0.06)',
  chipActive: '#C8A96E',
  chipBg: '#F0F2F5',
};

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onPriceFilterChange: (max: number | null) => void;
  activePriceFilter: number | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onPriceFilterChange, activePriceFilter }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(prev => !prev);
  };

  const handlePriceSelect = (max: number | null) => {
    onPriceFilterChange(max);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputRow, isFocused && styles.inputRowFocused]}>
        <MaterialIcons name="search" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.input}
          placeholder="搜索房型或价格..."
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={toggleFilters} style={styles.filterBtn}>
          <MaterialIcons
            name="tune"
            size={20}
            color={showFilters || activePriceFilter !== null ? COLORS.accent : COLORS.textLight}
          />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterRow}>
          {PRICE_FILTERS.map((filter) => {
            const isActive = activePriceFilter === filter.max;
            return (
              <TouchableOpacity
                key={filter.label}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => handlePriceSelect(filter.max)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#1B2A4A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  inputRowFocused: {
    borderColor: COLORS.accent,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    padding: 0,
  },
  filterBtn: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.chipBg,
  },
  chipActive: {
    backgroundColor: COLORS.chipActive,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});

export default SearchBar;
