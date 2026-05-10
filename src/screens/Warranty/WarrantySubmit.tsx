import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FAKE_IMAGE =
  'https://images.unsplash.com/photo-1718203862467-c33159fdc504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXIlMjBjb25kaXRpb25lcnxlbnwxfHx8fDE3NzgzNzg2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080';

type WarrantySubmitRouteProp = RouteProp<RootStackParamList, 'WarrantySubmit'>;

export default function WarrantySubmit() {
  const navigation = useNavigation();
  const route = useRoute<WarrantySubmitRouteProp>();
  const category = route.params?.category || '设备故障';

  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const canSubmit = room.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // Simulate submission
    // @ts-ignore
    navigation.navigate('WarrantySuccess');
  };

  const handleAddImage = () => {
    if (images.length >= 3) return;
    setImages([...images, FAKE_IMAGE]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>提交保修单</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false}>
          {/* Main Info */}
          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>故障类型</Text>
              <Text style={styles.infoValue}>{category}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                房间号码<Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.roomInput}
                placeholder="请输入房号"
                placeholderTextColor="#d1d5db"
                value={room}
                onChangeText={setRoom}
                textAlign="right"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionBlock}>
            <Text style={styles.sectionTitle}>
              问题描述<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.textarea}
              placeholder="请详细描述设备故障情况，以便维修人员更好准备配件..."
              placeholderTextColor="#b0b0b0"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            {/* Image upload */}
            <View style={styles.imageSection}>
              <View style={styles.imageRow}>
                {images.map((img, i) => (
                  <View key={i} style={styles.imageItem}>
                    <Image source={{ uri: img }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.imageRemove}
                      onPress={() => handleRemoveImage(i)}
                    >
                      <Icon name="close" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 3 && (
                  <TouchableOpacity
                    style={styles.imageAdd}
                    onPress={handleAddImage}
                    activeOpacity={0.7}
                  >
                    <Icon name="camera-alt" size={24} color="#b0b0b0" />
                    <Text style={styles.imageAddText}>上传照片</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.imageHint}>最多上传3张照片（选填）</Text>
            </View>
          </View>

          {/* Urgency Toggle */}
          <View style={styles.urgencyBlock}>
            <View style={styles.urgencyRow}>
              <View style={styles.urgencyLabel}>
                <Text style={styles.sectionTitle}>是否加急</Text>
                <Icon name="warning" size={16} color="#ff6c65" />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setUrgent(!urgent)}
                style={[styles.toggle, urgent && styles.toggleActive]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    urgent && styles.toggleThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
            {urgent && (
              <View style={styles.urgentHint}>
                <Text style={styles.urgentHintText}>
                  加急工单将优先分配处理，请仅在严重影响客房入住时勾选。
                </Text>
              </View>
            )}
          </View>

          {/* bottom padding for footer */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer Submit */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            activeOpacity={canSubmit ? 0.8 : 1}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text
              style={[styles.submitText, !canSubmit && styles.submitTextDisabled]}
            >
              提交申请
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  infoBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#f5f5f5',
  },
  required: {
    color: '#ff6c65',
  },
  roomInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'right',
    padding: 0,
    marginLeft: 16,
  },
  descriptionBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  textarea: {
    width: '100%',
    height: 128,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  imageSection: {
    marginTop: 16,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAdd: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAddText: {
    fontSize: 11,
    color: '#b0b0b0',
    marginTop: 2,
  },
  imageHint: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 8,
  },
  urgencyBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 80,
  },
  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgencyLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#ff6c65',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  urgentHint: {
    marginTop: 8,
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 8,
  },
  urgentHintText: {
    fontSize: 13,
    color: '#ff6c65',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ff6c65',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff6c65',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  submitTextDisabled: {
    color: '#999',
  },
});
