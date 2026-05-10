import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeIn } from 'react-native-reanimated';

const categories = [
  { id: 'ac', name: '空调设备', icon: 'ac-unit', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'tv', name: '电视音影', icon: 'tv', color: '#6366f1', bg: '#eef2ff' },
  { id: 'plumbing', name: '卫浴水电', icon: 'water-drop', color: '#06b6d4', bg: '#ecfeff' },
  { id: 'network', name: '网络宽带', icon: 'wifi', color: '#10b981', bg: '#ecfdf5' },
  { id: 'furniture', name: '门窗家具', icon: 'king-bed', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'lock', name: '智能门锁', icon: 'lock', color: '#f43f5e', bg: '#fff1f2' },
];

export default function WarrantyEquipment() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择故障设备</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>您要报修什么设备？</Text>
          <Text style={styles.subtitle}>请选择故障类型，以便我们为您匹配合适的维修人员</Text>
        </View>

        {/* Category Grid */}
        <View style={styles.grid}>
          {categories.map((cat, index) => (
            <Animated.View
              key={cat.id}
              entering={FadeIn.duration(300).delay(index * 50)}
              style={styles.gridItemWrapper}
            >
              <TouchableOpacity
                style={styles.gridItem}
                activeOpacity={0.7}
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('WarrantySubmit', { category: cat.name });
                }}
              >
                <View style={[styles.iconCircle, { backgroundColor: cat.bg }]}>
                  <Icon name={cat.icon} size={28} color={cat.color} />
                </View>
                <Text style={styles.gridItemLabel}>{cat.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Other problem link */}
        <TouchableOpacity style={styles.otherLink} onPress={() => {
          // @ts-ignore
          navigation.navigate('WarrantySubmit', { category: '其他问题' });
        }}>
          <Text style={styles.otherLinkText}>找不到类型？选择其他问题</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 38,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  gridItemWrapper: {
    width: '48%',
  },
  gridItem: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  otherLink: {
    marginTop: 32,
    alignItems: 'center',
  },
  otherLinkText: {
    fontSize: 14,
    color: '#b0b0b0',
    textDecorationLine: 'underline',
    textDecorationColor: '#b0b0b0',
  },
});
