export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  imageColor: string;
  spicy: boolean;
  tags: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export const CATEGORIES: MenuCategory[] = [
  { id: 'chinese', name: '中餐厅', icon: 'ramen-dining' },
  { id: 'western', name: '西餐厅', icon: 'dinner-dining' },
  { id: 'bar', name: '大堂吧', icon: 'local-bar' },
  { id: 'breakfast', name: '早餐', icon: 'local-cafe' },
  { id: 'roomservice', name: '客房送餐', icon: 'room-service' },
];

export const MENU_ITEMS: MenuItem[] = [
  // 中餐厅
  { id: 'm1', categoryId: 'chinese', name: '松鼠桂鱼', price: 128, description: '酸甜适口，外酥里嫩', imageColor: '#FDE68A', spicy: false, tags: ['招牌', '必点'] },
  { id: 'm2', categoryId: 'chinese', name: '宫保鸡丁', price: 68, description: '花生酥脆，鸡丁滑嫩', imageColor: '#FCA5A5', spicy: true, tags: ['经典'] },
  { id: 'm3', categoryId: 'chinese', name: '麻婆豆腐', price: 48, description: '麻辣鲜香，嫩滑入味', imageColor: '#F87171', spicy: true, tags: ['素食可选'] },
  { id: 'm4', categoryId: 'chinese', name: '清蒸鲈鱼', price: 98, description: '鲜嫩爽滑，原汁原味', imageColor: '#93C5FD', spicy: false, tags: ['清淡'] },
  { id: 'm5', categoryId: 'chinese', name: '蛋炒饭', price: 28, description: '粒粒分明，锅气十足', imageColor: '#FDE68A', spicy: false, tags: ['主食'] },
  { id: 'm6', categoryId: 'chinese', name: '小笼包', price: 38, description: '皮薄馅多，汤汁鲜美', imageColor: '#FDBA74', spicy: false, tags: ['点心'] },

  // 西餐厅
  { id: 'm7', categoryId: 'western', name: '菲力牛排', price: 198, description: '澳洲进口，五分熟', imageColor: '#D4A574', spicy: false, tags: ['招牌'] },
  { id: 'm8', categoryId: 'western', name: '凯撒沙拉', price: 58, description: '新鲜罗马生菜配帕玛森', imageColor: '#86EFAC', spicy: false, tags: ['轻食'] },
  { id: 'm9', categoryId: 'western', name: '奶油蘑菇汤', price: 48, description: '法式浓汤，奶香四溢', imageColor: '#FDE68A', spicy: false, tags: ['汤品'] },
  { id: 'm10', categoryId: 'western', name: '意式肉酱面', price: 68, description: '手工意面配秘制肉酱', imageColor: '#FCA5A5', spicy: false, tags: ['主食'] },
  { id: 'm11', categoryId: 'western', name: '提拉米苏', price: 58, description: '经典意式甜品', imageColor: '#D4A574', spicy: false, tags: ['甜品'] },

  // 大堂吧
  { id: 'm12', categoryId: 'bar', name: '特调鸡尾酒', price: 88, description: '调酒师每日限定', imageColor: '#C4B5FD', spicy: false, tags: ['限定'] },
  { id: 'm13', categoryId: 'bar', name: '拿铁咖啡', price: 42, description: '精选阿拉比卡豆', imageColor: '#D4A574', spicy: false, tags: ['咖啡'] },
  { id: 'm14', categoryId: 'bar', name: '鲜榨果汁', price: 38, description: '当日鲜果现榨', imageColor: '#FDE68A', spicy: false, tags: ['饮品'] },
  { id: 'm15', categoryId: 'bar', name: '精酿啤酒', price: 58, description: '比利时进口白啤', imageColor: '#FDE68A', spicy: false, tags: ['酒类'] },

  // 早餐
  { id: 'm16', categoryId: 'breakfast', name: '美式早餐', price: 78, description: '蛋培根吐司配咖啡', imageColor: '#FDBA74', spicy: false, tags: ['套餐'] },
  { id: 'm17', categoryId: 'breakfast', name: '中式早点', price: 58, description: '粥品+小笼包+油条', imageColor: '#FDE68A', spicy: false, tags: ['套餐'] },
  { id: 'm18', categoryId: 'breakfast', name: '酸奶水果碗', price: 48, description: '希腊酸奶配时令鲜果', imageColor: '#C4B5FD', spicy: false, tags: ['轻食'] },

  // 客房送餐
  { id: 'm19', categoryId: 'roomservice', name: '商务套餐A', price: 98, description: '一荤一素一汤+米饭', imageColor: '#86EFAC', spicy: false, tags: ['套餐'] },
  { id: 'm20', categoryId: 'roomservice', name: '商务套餐B', price: 128, description: '两荤一素一汤+米饭', imageColor: '#FDBA74', spicy: false, tags: ['套餐'] },
  { id: 'm21', categoryId: 'roomservice', name: '深夜面食', price: 48, description: '22:00后供应', imageColor: '#FCA5A5', spicy: false, tags: ['夜间'] },
  { id: 'm22', categoryId: 'roomservice', name: '儿童套餐', price: 68, description: '卡通造型+果汁+水果', imageColor: '#F9A8D4', spicy: false, tags: ['儿童'] },
];
