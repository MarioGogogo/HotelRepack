import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

type WarrantyDetailRouteProp = RouteProp<RootStackParamList, 'WarrantyDetail'>;

export default function WarrantyDetail() {
  const navigation = useNavigation();
  const route = useRoute<WarrantyDetailRouteProp>();
  const { id } = route.params || {};

  const ticket = {
    id: id || 'REP-20231001',
    room: '8201',
    type: '空调故障',
    status: 'processing',
    desc: '空调开机后没有冷风，并且有异响。客人在房间比较热，希望能尽快修理。',
    time: '2023-10-01 14:30',
    urgent: true,
    worker: {
      name: '李师傅',
      phone: '13800138000',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  };

  const steps = [
    { label: '提交申请', time: '14:30', active: true },
    { label: '已接单', time: '14:35', active: true },
    { label: '处理中', time: '14:40', active: true, current: true },
    { label: '已完成', time: '', active: false },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>工单详情</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={styles.bodyContent}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>正在处理中</Text>
          <Text style={styles.statusDesc}>维修人员已接单，正在赶往现场</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineInner}>
            {/* 连续时间线 */}
            <View style={styles.timelineLine} />
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepGutter}>
                  <View
                    style={[
                      styles.dot,
                      step.active && !step.current && styles.dotActive,
                      step.current && styles.dotCurrent,
                      !step.active && styles.dotInactive,
                    ]}
                  >
                    {step.current && <View style={styles.dotInner} />}
                  </View>
                </View>
                <View style={styles.stepBody}>
                  <Text style={[styles.stepLabel, !step.active && styles.stepLabelInactive]}>
                    {step.label}
                  </Text>
                </View>
                {step.time ? (
                  <Text style={styles.stepTime}>{step.time}</Text>
                ) : (
                  <View style={styles.stepTimePlaceholder} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Worker Info */}
        <View style={styles.workerCard}>
          <View style={styles.workerLeft}>
            <Image source={{ uri: ticket.worker.avatar }} style={styles.workerAvatar} />
            <View>
              <Text style={styles.workerName}>{ticket.worker.name}</Text>
              <Text style={styles.workerRole}>维修部 · 空调专员</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.phoneButton} activeOpacity={0.7}>
            <Icon name="phone-in-talk" size={18} color="#ff6c65" />
          </TouchableOpacity>
        </View>

        {/* Ticket Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Icon name="description" size={18} color="#ff6c65" />
            <Text style={styles.detailsTitle}>工单信息</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>工单编号</Text>
            <Text style={styles.detailValue}>{ticket.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>房间号码</Text>
            <Text style={[styles.detailValue, styles.detailValueBold]}>{ticket.room}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>故障类型</Text>
            <Text style={styles.detailValue}>{ticket.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>加急状态</Text>
            <Text style={[styles.detailValue, ticket.urgent && styles.detailValueUrgent]}>
              {ticket.urgent ? '是' : '否'}
            </Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowLast]}>
            <Text style={styles.detailLabel}>问题描述</Text>
            <Text style={[styles.detailValue, styles.detailDesc]}>{ticket.desc}</Text>
          </View>
        </View>

        {/* Bottom spacing for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7}>
          <Text style={styles.cancelButtonText}>取消工单</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.urgeButton} activeOpacity={0.8}>
          <Text style={styles.urgeButtonText}>催单</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
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
    paddingBottom: 24,
  },

  // Status Card
  statusCard: {
    backgroundColor: '#ff6c65',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statusDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },

  // Timeline
  timelineCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineInner: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 13,
    top: 4,
    bottom: 36,
    width: 2,
    backgroundColor: '#e5e7eb',
    borderRadius: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  stepGutter: {
    width: 28,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotActive: {
    borderColor: '#ff6c65',
    backgroundColor: '#ff6c65',
  },
  dotCurrent: {
    borderColor: '#ff6c65',
  },
  dotInactive: {
    borderColor: '#d1d5db',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff6c65',
  },
  stepBody: {
    flex: 1,
    paddingTop: 0,
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  stepLabelInactive: {
    color: '#9ca3af',
  },
  stepTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 0,
    lineHeight: 20,
  },
  stepTimePlaceholder: {
    width: 50,
  },

  // Worker Card
  workerCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  workerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  workerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  workerRole: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  phoneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,108,101,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Details Card
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailRowLast: {
    marginBottom: 0,
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    color: '#999',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  detailValueBold: {
    fontWeight: '600',
  },
  detailValueUrgent: {
    color: '#ff6c65',
  },
  detailDesc: {
    lineHeight: 22,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  urgeButton: {
    flex: 1,
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
  urgeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});
