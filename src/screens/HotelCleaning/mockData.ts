export type CleaningStatus = 'pending' | 'in_progress' | 'completed';
export type Priority = 'low' | 'normal' | 'urgent';

export interface CleaningTask {
  id: string;
  roomNumber: string;
  floor: number;
  roomType: string;
  status: CleaningStatus;
  priority: Priority;
  assignee: string;
  estimatedMinutes: number;
  checkoutTime: string | null;
  remark: string | null;
  createdAt: string;
  completedAt: string | null;
}

export const STATUS_TABS: { key: CleaningStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待打扫' },
  { key: 'in_progress', label: '打扫中' },
  { key: 'completed', label: '已完成' },
];

export const TASKS: CleaningTask[] = [
  {
    id: 't1', roomNumber: '501', floor: 5, roomType: '标准双床间',
    status: 'pending', priority: 'urgent', assignee: '张阿姨',
    estimatedMinutes: 40, checkoutTime: '10:30', remark: '客人提前退房，需尽快打扫',
    createdAt: '10:35', completedAt: null,
  },
  {
    id: 't2', roomNumber: '808', floor: 8, roomType: '豪华大床房',
    status: 'in_progress', priority: 'normal', assignee: '李姐',
    estimatedMinutes: 50, checkoutTime: '09:00', remark: null,
    createdAt: '09:10', completedAt: null,
  },
  {
    id: 't3', roomNumber: '1206', floor: 12, roomType: '行政套房',
    status: 'pending', priority: 'normal', assignee: '王姐',
    estimatedMinutes: 60, checkoutTime: '11:00', remark: null,
    createdAt: '11:05', completedAt: null,
  },
  {
    id: 't4', roomNumber: '302', floor: 3, roomType: '标准大床间',
    status: 'completed', priority: 'low', assignee: '张阿姨',
    estimatedMinutes: 35, checkoutTime: '08:00', remark: null,
    createdAt: '08:05', completedAt: '08:38',
  },
  {
    id: 't5', roomNumber: '1605', floor: 16, roomType: '海景大床房',
    status: 'pending', priority: 'urgent', assignee: '赵姐',
    estimatedMinutes: 45, checkoutTime: '10:00', remark: 'VIP客人下午入住',
    createdAt: '10:10', completedAt: null,
  },
  {
    id: 't6', roomNumber: '712', floor: 7, roomType: '园景大床房',
    status: 'in_progress', priority: 'normal', assignee: '刘姐',
    estimatedMinutes: 40, checkoutTime: '09:30', remark: null,
    createdAt: '09:40', completedAt: null,
  },
  {
    id: 't7', roomNumber: '2103', floor: 21, roomType: '总统套房',
    status: 'pending', priority: 'urgent', assignee: '王姐',
    estimatedMinutes: 90, checkoutTime: '12:00', remark: '需深度清洁+鲜花布置',
    createdAt: '12:05', completedAt: null,
  },
  {
    id: 't8', roomNumber: '415', floor: 4, roomType: '标准双床间',
    status: 'completed', priority: 'normal', assignee: '李姐',
    estimatedMinutes: 40, checkoutTime: '07:30', remark: null,
    createdAt: '07:35', completedAt: '08:10',
  },
  {
    id: 't9', roomNumber: '910', floor: 9, roomType: '商务套房',
    status: 'completed', priority: 'low', assignee: '赵姐',
    estimatedMinutes: 55, checkoutTime: '08:30', remark: null,
    createdAt: '08:35', completedAt: '09:25',
  },
  {
    id: 't10', roomNumber: '620', floor: 6, roomType: '亲子主题房',
    status: 'pending', priority: 'normal', assignee: '刘姐',
    estimatedMinutes: 50, checkoutTime: '11:30', remark: '需补充儿童用品',
    createdAt: '11:35', completedAt: null,
  },
  {
    id: 't11', roomNumber: '1802', floor: 18, roomType: '豪华全景房',
    status: 'in_progress', priority: 'normal', assignee: '张阿姨',
    estimatedMinutes: 45, checkoutTime: '10:00', remark: null,
    createdAt: '10:15', completedAt: null,
  },
  {
    id: 't12', roomNumber: '1005', floor: 10, roomType: '家庭联通房',
    status: 'pending', priority: 'low', assignee: '李姐',
    estimatedMinutes: 55, checkoutTime: '13:00', remark: null,
    createdAt: '13:05', completedAt: null,
  },
];
