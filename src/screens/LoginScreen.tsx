import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  FlatList,
  StatusBar,
  Image,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAppStore } from '../store/useAppStore';
import { fetchBundleConfigWithRetry } from '../services/BundleConfigService';
import { updateRemoteBundleConfig } from '../../index';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

const LOGIN_BG = require('../static/image/login_bg.png');

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HOTELS = [
  { id: '1', name: '锦江国际大酒店', city: '上海' },
  { id: '2', name: '万豪行政公寓', city: '北京' },
  { id: '3', name: '香格里拉大酒店', city: '杭州' },
  { id: '4', name: '半岛酒店', city: '香港' },
  { id: '5', name: '丽思卡尔顿酒店', city: '广州' },
  { id: '6', name: 'W酒店', city: '苏州' },
  { id: '7', name: '柏悦酒店', city: '深圳' },
  { id: '8', name: '四季酒店', city: '成都' },
  { id: '9', name: '瑞吉酒店', city: '南京' },
  { id: '10', name: '朗廷酒店', city: '厦门' },
];

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<(typeof HOTELS)[0] | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [focusedInput, setFocusedInput] = useState<'employeeId' | 'password' | null>(null);

  const login = useAppStore((s) => s.login);

  const buttonScale = useSharedValue(1);
  const animatedButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handleLogin = useCallback(() => {
    if (!employeeId || !password || !selectedHotel) return;
    Keyboard.dismiss();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login('mock-token-123', {
        name: employeeId,
        level: 1,
        points: 0,
      });

      navigation.replace('Home');

      fetchBundleConfigWithRetry()
        .then((config) => updateRemoteBundleConfig(config))
        .catch(console.warn);
    }, 1500);
  }, [employeeId, password, selectedHotel, login, navigation]);

  const handleSelectHotel = useCallback((hotel: (typeof HOTELS)[0]) => {
    setSelectedHotel(hotel);
    setShowPicker(false);
  }, []);

  const isFormValid = employeeId && password && selectedHotel && !loading;

  return (
    <View style={styles.container}>
      {/* Explicit Image instead of ImageBackground for better Webpack/Re.pack compatibility */}
      <Image 
        source={LOGIN_BG?.default || LOGIN_BG} 
        style={StyleSheet.absoluteFillObject} 
        resizeMode="cover" 
      />
      {/* Light Overlay to let image bleed through but match light theme better */}
      <View style={styles.overlay} />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.inner}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(800).delay(100)} style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>H</Text>
            </View>
            <Text style={styles.title}>HOTELPACK</Text>
            <Text style={styles.subtitle}>E L E G A N C E   &   L U X U R Y</Text>
          </Animated.View>

          {/* Centered Form Card - Light Theme */}
          <Animated.View entering={FadeIn.duration(600).delay(200)} style={styles.form}>
            
            <Text style={styles.welcomeText}>员工登录</Text>

            {/* Employee ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>工号</Text>
              <View style={[styles.inputWrapper, focusedInput === 'employeeId' && styles.inputWrapperFocused]}>
                <Icon name="person-outline" size={20} color={focusedInput === 'employeeId' ? COLORS.accent : COLORS.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="请输入员工工号"
                  placeholderTextColor={COLORS.textLight}
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  keyboardType="number-pad"
                  onFocus={() => setFocusedInput('employeeId')}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor={COLORS.accent}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>密码</Text>
              <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}>
                <Icon name="lock-outline" size={20} color={focusedInput === 'password' ? COLORS.accent : COLORS.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="请输入密码"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  selectionColor={COLORS.accent}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible((v) => !v)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name={passwordVisible ? "visibility-off" : "visibility"} size={22} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Hotel Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>所属酒店</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowPicker(true);
                }}
                activeOpacity={0.7}
              >
                <Icon name="domain" size={20} color={selectedHotel ? COLORS.accent : COLORS.textLight} style={styles.inputIcon} />
                <Text
                  style={[
                    styles.inputTextStatic,
                    !selectedHotel && { color: COLORS.textLight },
                  ]}
                  numberOfLines={1}
                >
                  {selectedHotel
                    ? `${selectedHotel.name}（${selectedHotel.city}）`
                    : '请选择所属酒店'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Animated.View style={animatedButtonStyles}>
              <TouchableOpacity
                style={styles.loginBtnContainer}
                onPress={handleLogin}
                disabled={!isFormValid}
                activeOpacity={0.9}
                onPressIn={() => buttonScale.value = withSpring(0.95)}
                onPressOut={() => buttonScale.value = withSpring(1)}
              >
                <LinearGradient
                  colors={isFormValid ? ['#E8D099', '#C8A96E'] : ['#E2E6ED', '#D1D5DB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loginBtn}
                >
                  <Text style={[styles.loginBtnText, !isFormValid && styles.loginBtnTextDisabled]}>
                    {loading ? '登 录 中...' : '登 录'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Centered Hotel Picker Modal */}
      {showPicker && (
        <HotelPicker
          hotels={HOTELS}
          selected={selectedHotel}
          onSelect={handleSelectHotel}
          onClose={() => setShowPicker(false)}
        />
      )}
    </View>
  );
}

/* ---------- Centered Hotel Picker Modal ---------- */

interface HotelPickerProps {
  hotels: typeof HOTELS;
  selected: (typeof HOTELS)[0] | null;
  onSelect: (hotel: (typeof HOTELS)[0]) => void;
  onClose: () => void;
}

function HotelPicker({ hotels, selected, onSelect, onClose }: HotelPickerProps) {
  return (
    <View style={pickerStyles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={pickerStyles.backdrop} entering={FadeIn.duration(200)} exiting={FadeIn.duration(200)} />
      </TouchableWithoutFeedback>
      <Animated.View
        entering={SlideInDown.duration(350).springify().damping(30).stiffness(120)}
        exiting={SlideOutDown.duration(300)}
        style={pickerStyles.modalCard}
      >
        <View style={pickerStyles.modalInner}>
          {/* Header */}
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>选择所在酒店</Text>
            <TouchableOpacity onPress={onClose} style={pickerStyles.closeBtn} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={hotels}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={pickerStyles.listContent}
            renderItem={({ item }) => {
              const isSelected = selected?.id === item.id;
              return (
                <TouchableOpacity
                  style={[pickerStyles.item, isSelected && pickerStyles.itemActive]}
                  onPress={() => onSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={pickerStyles.itemLeft}>
                    <Text style={[pickerStyles.itemName, isSelected && pickerStyles.itemNameActive]}>{item.name}</Text>
                    <Text style={[pickerStyles.itemCity, isSelected && pickerStyles.itemCityActive]}>{item.city}</Text>
                  </View>
                  {isSelected && (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <Icon name="check-circle" size={22} color={COLORS.accent} />
                    </Animated.View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

/* ---------- Styles ---------- */

const COLORS = {
  primary: '#1B2A4A',
  accent: '#C8A96E', // Gold
  bg: 'transparent',
  card: 'rgba(255, 255, 255, 0.92)', // Light glass card
  text: '#1B2A4A', // Dark text for light bg
  textLight: '#8892A6', // Muted dark text
  border: 'rgba(0, 0, 0, 0.08)',
  inputBg: 'rgba(0, 0, 0, 0.03)', // Subtle input background
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Very light overlay
  },
  inner: {
    flex: 1,
    justifyContent: 'center', 
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: -40, 
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(200, 169, 110, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(200, 169, 110, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    fontSize: 34,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF', // Keeping header title white to contrast with dark bg image
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.accent,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: 24, 
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)', // Crisp white border
    shadowColor: '#1B2A4A',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.15, // Softer shadow for light card
    shadowRadius: 32,
    elevation: 15,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text, // Dark text
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 52,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(200, 169, 110, 0.05)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    height: '100%',
    paddingVertical: 0, 
  },
  inputTextStatic: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    textAlignVertical: 'center',
    lineHeight: Platform.OS === 'ios' ? 0 : 20, 
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 0,
    marginLeft: 8,
  },
  loginBtnContainer: {
    marginTop: 24,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loginBtn: {
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#1B2A4A',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 6,
  },
  loginBtnTextDisabled: {
    color: '#9CA3AF', // Muted text for disabled light button
  },
});

/* ---------- Picker Styles ---------- */

const pickerStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(27, 42, 74, 0.4)', // Darker blueish backdrop for light modal
  },
  modalCard: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  modalInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Pure light modal
    borderRadius: 24, 
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    shadowColor: '#1B2A4A',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)', // subtle dark border
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.02)', // subtle gray for items
  },
  itemActive: {
    backgroundColor: 'rgba(200, 169, 110, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200, 169, 110, 0.3)',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemNameActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  itemCity: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  itemCityActive: {
    color: 'rgba(200, 169, 110, 0.8)',
  },
});
