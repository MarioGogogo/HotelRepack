import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function WarrantySuccess() {
  const navigation = useNavigation();

  const circleScale = useSharedValue(0.5);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    circleOpacity.value = withSpring(1, { damping: 10, stiffness: 100 });

    setTimeout(() => {
      checkScale.value = withSpring(1, { damping: 8, stiffness: 90 });
    }, 200);
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <Animated.View style={[styles.circle, circleStyle]}>
        <Animated.View style={checkStyle}>
          <Icon name="check" size={48} color="#10b981" />
        </Animated.View>
      </Animated.View>

      <Animated.Text
        entering={FadeIn.delay(300).duration(400).springify()}
        style={styles.title}
      >
        提交成功
      </Animated.Text>

      <Animated.Text
        entering={FadeIn.delay(400).duration(400).springify()}
        style={styles.description}
      >
        您的保修单已经成功提交，维修人员将尽快接单处理。
      </Animated.Text>

      <Animated.View
        entering={FadeIn.delay(500).duration(400).springify()}
        style={styles.buttonGroup}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Warranty' as never)}
        >
          <Text style={styles.primaryButtonText}>返回保修列表</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('WarrantyDetail' as never)}
        >
          <Text style={styles.secondaryButtonText}>查看工单详情</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  buttonGroup: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#ff6c65',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff6c65',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
});
