export interface Amenity {
  id: string;
  label: string;
}

export interface Room {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  area: string;
  bedType: string;
  maxGuests: number;
  amenities: Amenity[];
  imageColor: string;
  floor: string;
}

export interface RoomCategory {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: RoomCategory[] = [
  { id: 'standard', name: '标准间', icon: 'bed' },
  { id: 'king', name: '大床房', icon: 'king-bed' },
  { id: 'suite', name: '套房', icon: 'weekend' },
  { id: 'deluxe', name: '豪华房', icon: 'stars' },
  { id: 'family', name: '家庭房', icon: 'family-restroom' },
];

export const ROOMS: Room[] = [
  // 标准间
  {
    id: 's1', categoryId: 'standard', name: '标准双床间',
    price: 328, area: '30m²', bedType: '双床1.2m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a3', label: '市景' }],
    imageColor: '#DBEAFE', floor: '3-6层',
  },
  {
    id: 's2', categoryId: 'standard', name: '标准大床间',
    price: 368, area: '32m²', bedType: '大床1.8m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a4', label: '空调' }, { id: 'a3', label: '市景' }],
    imageColor: '#DBEAFE', floor: '3-6层',
  },
  {
    id: 's3', categoryId: 'standard', name: '高级标准间',
    price: 428, area: '35m²', bedType: '双床1.2m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a5', label: '浴缸' }],
    imageColor: '#DBEAFE', floor: '7-10层',
  },

  // 大床房
  {
    id: 'k1', categoryId: 'king', name: '豪华大床房',
    price: 488, area: '38m²', bedType: '大床2.0m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a5', label: '浴缸' }, { id: 'a6', label: '迷你吧' }],
    imageColor: '#FEF3C7', floor: '8-15层',
  },
  {
    id: 'k2', categoryId: 'king', name: '行政大床房',
    price: 588, area: '42m²', bedType: '大床2.0m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a7', label: '行政酒廊' }, { id: 'a5', label: '浴缸' }],
    imageColor: '#FEF3C7', floor: '16-20层',
  },
  {
    id: 'k3', categoryId: 'king', name: '园景大床房',
    price: 458, area: '36m²', bedType: '大床1.8m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a4', label: '空调' }, { id: 'a8', label: '园景' }],
    imageColor: '#FEF3C7', floor: '5-10层',
  },
  {
    id: 'k4', categoryId: 'king', name: '海景大床房',
    price: 668, area: '45m²', bedType: '大床2.0m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a9', label: '海景' }, { id: 'a5', label: '浴缸' }],
    imageColor: '#FEF3C7', floor: '12-18层',
  },

  // 套房
  {
    id: 'su1', categoryId: 'suite', name: '商务套房',
    price: 888, area: '55m²', bedType: '大床2.0m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a10', label: '客厅' }, { id: 'a5', label: '浴缸' }],
    imageColor: '#D1FAE5', floor: '15-20层',
  },
  {
    id: 'su2', categoryId: 'suite', name: '行政套房',
    price: 1288, area: '68m²', bedType: '大床2.2m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a7', label: '行政酒廊' }, { id: 'a10', label: '客厅' }, { id: 'a6', label: '迷你吧' }],
    imageColor: '#D1FAE5', floor: '20-25层',
  },
  {
    id: 'su3', categoryId: 'suite', name: '总统套房',
    price: 2888, area: '120m²', bedType: '大床2.2m', maxGuests: 4,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a10', label: '客厅' }, { id: 'a11', label: '管家服务' }, { id: 'a5', label: '浴缸' }, { id: 'a6', label: '迷你吧' }],
    imageColor: '#D1FAE5', floor: '25-28层',
  },

  // 豪华房
  {
    id: 'd1', categoryId: 'deluxe', name: '豪华城景房',
    price: 768, area: '48m²', bedType: '大床2.0m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a3', label: '市景' }, { id: 'a5', label: '浴缸' }],
    imageColor: '#EDE9FE', floor: '10-18层',
  },
  {
    id: 'd2', categoryId: 'deluxe', name: '豪华全景房',
    price: 988, area: '52m²', bedType: '大床2.0m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a12', label: '全景落地窗' }, { id: 'a5', label: '浴缸' }, { id: 'a6', label: '迷你吧' }],
    imageColor: '#EDE9FE', floor: '18-25层',
  },
  {
    id: 'd3', categoryId: 'deluxe', name: '至尊豪华房',
    price: 1188, area: '58m²', bedType: '大床2.2m', maxGuests: 2,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a7', label: '行政酒廊' }, { id: 'a5', label: '浴缸' }, { id: 'a11', label: '管家服务' }],
    imageColor: '#EDE9FE', floor: '22-28层',
  },

  // 家庭房
  {
    id: 'f1', categoryId: 'family', name: '亲子主题房',
    price: 588, area: '45m²', bedType: '大床1.8m+单人床1.2m', maxGuests: 3,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a13', label: '儿童乐园' }, { id: 'a14', label: '儿童用品' }],
    imageColor: '#FCE7F3', floor: '5-10层',
  },
  {
    id: 'f2', categoryId: 'family', name: '家庭联通房',
    price: 728, area: '60m²', bedType: '双床1.5m×2', maxGuests: 4,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a15', label: '双卧室' }, { id: 'a4', label: '空调' }],
    imageColor: '#FCE7F3', floor: '6-12层',
  },
  {
    id: 'f3', categoryId: 'family', name: '家庭套房',
    price: 888, area: '72m²', bedType: '大床2.0m+上下铺', maxGuests: 4,
    amenities: [{ id: 'a1', label: 'WiFi' }, { id: 'a2', label: '早餐' }, { id: 'a10', label: '客厅' }, { id: 'a13', label: '儿童乐园' }, { id: 'a14', label: '儿童用品' }],
    imageColor: '#FCE7F3', floor: '8-15层',
  },
];

export const PRICE_FILTERS: { label: string; max: number | null }[] = [
  { label: '不限', max: null },
  { label: '¥300以下', max: 300 },
  { label: '¥300-600', max: 600 },
  { label: '¥600-1000', max: 1000 },
];
