import { OrderData, SystemOrderData, ProductData, InventoryData, Customer, Channel, QueryParams, PaginatedResponse } from '@/types/queryToolTypes'

// 客户数据
export const customers: Customer[] = [
  { id: 'nyf', name: '纽约服饰', code: 'NYF' },
  { id: 'cat', name: '加州科技', code: 'CAT' },
  { id: 'txe', name: '德克萨斯电子', code: 'TXE' },
  { id: 'chi', name: '芝加哥食品', code: 'CHI' },
  { id: 'sea', name: '西雅图咖啡', code: 'SEA' }
]

// 渠道数据
export const channelMap: Record<string, Channel[]> = {
  nyf: [
    { id: 'amazon', name: 'Amazon', code: 'AMZ', type: 'marketplace' },
    { id: 'shopify', name: 'Shopify', code: 'SHF', type: 'ecommerce' },
    { id: 'walmart', name: 'Walmart', code: 'WMT', type: 'marketplace' }
  ],
  cat: [
    { id: 'amazon', name: 'Amazon', code: 'AMZ', type: 'marketplace' },
    { id: 'ebay', name: 'eBay', code: 'EBY', type: 'marketplace' },
    { id: 'shopify', name: 'Shopify', code: 'SHF', type: 'ecommerce' }
  ],
  txe: [
    { id: 'amazon', name: 'Amazon', code: 'AMZ', type: 'marketplace' },
    { id: 'ebay', name: 'eBay', code: 'EBY', type: 'marketplace' },
    { id: 'walmart', name: 'Walmart', code: 'WMT', type: 'marketplace' }
  ],
  chi: [
    { id: 'amazon', name: 'Amazon', code: 'AMZ', type: 'marketplace' },
    { id: 'shopify', name: 'Shopify', code: 'SHF', type: 'ecommerce' }
  ],
  sea: [
    { id: 'amazon', name: 'Amazon', code: 'AMZ', type: 'marketplace' },
    { id: 'shopify', name: 'Shopify', code: 'SHF', type: 'ecommerce' },
    { id: 'ebay', name: 'eBay', code: 'EBY', type: 'marketplace' }
  ]
}

// 订单商品项
export interface OrderItem {
  sku: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  fulfillmentStatus?: string;
}

// 订单数据
export const orderList: OrderData[] = [
  {
    channelOrderId: 'AMZ-123456789',
    systemOrderId: 'SO-987654321',
    channel: 'amazon',
    status: '已完成',
    customerName: '张三',
    amount: 299.99,
    createTime: new Date().getTime() - 86400000, // 一天前
    systemCreateTime: new Date().getTime() - 85000000, 
    items: [
      { sku: 'SKU001', productName: '高品质无线蓝牙耳机', quantity: 2, price: 99.99, total: 199.98, fulfillmentStatus: '已发货' },
      { sku: 'SKU002', productName: '智能手表', quantity: 1, price: 100.01, total: 100.01, fulfillmentStatus: '已发货' }
    ],
    channelStatus: 'Shipped',
    store: 'US Store'
  },
  {
    channelOrderId: 'SHF-987654321',
    systemOrderId: 'SO-123456789',
    channel: 'shopify',
    status: '处理中',
    customerName: '李四',
    amount: 499.99,
    createTime: new Date().getTime() - 43200000, // 12小时前
    systemCreateTime: new Date().getTime() - 42000000,
    items: [
      { sku: 'SKU003', productName: '超薄笔记本电脑', quantity: 1, price: 499.99, total: 499.99, fulfillmentStatus: '待发货' }
    ],
    channelStatus: 'Processing',
    store: 'Main Store'
  },
  {
    channelOrderId: 'WMT-456789123',
    systemOrderId: null,
    channel: 'walmart',
    status: null,
    customerName: '王五',
    amount: 159.99,
    createTime: new Date().getTime() - 21600000, // 6小时前
    items: [
      { sku: 'SKU004', productName: '防水运动相机', quantity: 3, price: 53.33, total: 159.99, fulfillmentStatus: '已退款' }
    ],
    channelStatus: 'Pending',
    store: 'US Store'
  },
  {
    channelOrderId: 'AMZ-234567891',
    systemOrderId: 'SO-345678912',
    channel: 'amazon',
    status: '待处理',
    customerName: '赵六',
    amount: 89.95,
    createTime: new Date().getTime() - 3600000, // 1小时前
    items: [
      { sku: 'SKU005', productName: '便携式充电宝', quantity: 1, price: 39.99, total: 39.99, fulfillmentStatus: '待发货' },
      { sku: 'SKU006', productName: '数据线套装', quantity: 2, price: 24.98, total: 49.96, fulfillmentStatus: '待发货' }
    ],
    channelStatus: 'Unshipped',
    store: 'EU Store'
  },
  {
    channelOrderId: 'EBY-345678912',
    systemOrderId: 'SO-567891234',
    channel: 'ebay',
    status: '已完成',
    customerName: '钱七',
    amount: 59.99,
    createTime: new Date().getTime() - 172800000, // 2天前
    items: [
      { sku: 'SKU007', productName: '智能家居控制器', quantity: 1, price: 59.99, total: 59.99, fulfillmentStatus: '已发货' }
    ],
    channelStatus: 'Delivered',
    store: 'Main Store'
  },
  {
    channelOrderId: 'SHF-456789123',
    systemOrderId: 'SO-678912345',
    channel: 'shopify',
    status: '异常',
    customerName: '孙八',
    amount: 129.98,
    createTime: new Date().getTime() - 259200000, // 3天前
    items: [
      { sku: 'SKU008', productName: '无线键鼠套装', quantity: 1, price: 79.99, total: 79.99 },
      { sku: 'SKU009', productName: '鼠标垫', quantity: 1, price: 49.99, total: 49.99 }
    ],
    channelStatus: 'Payment Failed',
    store: 'CN Store'
  },
  // 新增订单数据
  {
    channelOrderId: 'AMZ-567891234',
    systemOrderId: 'SO-789123456',
    channel: 'amazon',
    status: '已完成',
    customerName: '周九',
    amount: 1299.99,
    createTime: new Date().getTime() - 345600000, // 4天前
    items: [
      { sku: 'SKU010', productName: '游戏笔记本电脑', quantity: 1, price: 1299.99, total: 1299.99 }
    ],
    channelStatus: 'Delivered',
    store: 'US Store'
  },
  {
    channelOrderId: 'WMT-678912345',
    systemOrderId: 'SO-891234567',
    channel: 'walmart',
    status: '已完成',
    customerName: '吴十',
    amount: 249.99,
    createTime: new Date().getTime() - 432000000, // 5天前
    items: [
      { sku: 'SKU011', productName: '智能音箱', quantity: 2, price: 124.99, total: 249.98 }
    ],
    channelStatus: 'Shipped',
    store: 'US Store'
  },
  {
    channelOrderId: 'EBY-789123456',
    systemOrderId: 'SO-912345678',
    channel: 'ebay',
    status: '处理中',
    customerName: '郑十一',
    amount: 79.99,
    createTime: new Date().getTime() - 518400000, // 6天前
    items: [
      { sku: 'SKU012', productName: '智能灯泡套装', quantity: 4, price: 19.99, total: 79.96 }
    ],
    channelStatus: 'Processing',
    store: 'EU Store'
  },
  {
    channelOrderId: 'SHF-891234567',
    systemOrderId: 'SO-123789456',
    channel: 'shopify',
    status: '待处理',
    customerName: '王五',
    amount: 399.98,
    createTime: new Date().getTime() - 604800000, // 7天前
    items: [
      { sku: 'SKU013', productName: '无线耳机', quantity: 2, price: 199.99, total: 399.98 }
    ],
    channelStatus: 'Awaiting Fulfillment',
    store: 'Main Store'
  },
  {
    channelOrderId: 'AMZ-912345678',
    systemOrderId: 'SO-234891567',
    channel: 'amazon',
    status: '异常',
    customerName: '张三',
    amount: 59.97,
    createTime: new Date().getTime() - 691200000, // 8天前
    items: [
      { sku: 'SKU014', productName: '手机保护壳', quantity: 3, price: 19.99, total: 59.97 }
    ],
    channelStatus: 'Error',
    store: 'EU Store'
  },
  {
    channelOrderId: 'WMT-123789456',
    systemOrderId: 'SO-345912678',
    channel: 'walmart',
    status: '已完成',
    customerName: '李四',
    amount: 29.99,
    createTime: new Date().getTime() - 777600000, // 9天前
    items: [
      { sku: 'SKU015', productName: '手机支架', quantity: 1, price: 29.99, total: 29.99 }
    ],
    channelStatus: 'Delivered',
    store: 'US Store'
  }
]

// 系统订单数据
export const systemOrderList: SystemOrderData[] = [
  {
    systemOrderId: 'SO-987654321',
    status: '已完成',
    createTime: new Date().getTime() - 86400000,
    updateTime: new Date().getTime() - 43200000
  },
  {
    systemOrderId: 'SO-123456789',
    status: '处理中',
    createTime: new Date().getTime() - 43200000,
    updateTime: new Date().getTime() - 21600000
  },
  {
    systemOrderId: 'SO-456789123',
    status: '异常',
    errorReason: '地址信息不完整，缺少街道号码，无法完成配送地址验证',
    createTime: new Date().getTime() - 21600000,
    updateTime: new Date().getTime() - 3600000
  },
  {
    systemOrderId: 'SO-345678912',
    status: '待处理',
    createTime: new Date().getTime() - 3600000,
    updateTime: new Date().getTime() - 1800000
  },
  {
    systemOrderId: 'SO-567891234',
    status: '已完成',
    createTime: new Date().getTime() - 172800000,
    updateTime: new Date().getTime() - 86400000
  },
  {
    systemOrderId: 'SO-678912345',
    status: '异常',
    errorReason: '付款信息验证失败，银行卡号无效',
    createTime: new Date().getTime() - 259200000,
    updateTime: new Date().getTime() - 172800000
  },
  {
    systemOrderId: 'SO-789123456',
    status: '已完成',
    createTime: new Date().getTime() - 345600000,
    updateTime: new Date().getTime() - 259200000
  },
  {
    systemOrderId: 'SO-891234567',
    status: '已完成',
    createTime: new Date().getTime() - 432000000,
    updateTime: new Date().getTime() - 345600000
  },
  {
    systemOrderId: 'SO-912345678',
    status: '处理中',
    createTime: new Date().getTime() - 518400000,
    updateTime: new Date().getTime() - 432000000
  },
  {
    systemOrderId: 'SO-123789456',
    status: '待处理',
    createTime: new Date().getTime() - 604800000,
    updateTime: new Date().getTime() - 518400000
  },
  {
    systemOrderId: 'SO-234891567',
    status: '异常',
    errorReason: '商品库存不足，无法满足订单需求',
    createTime: new Date().getTime() - 691200000,
    updateTime: new Date().getTime() - 604800000
  },
  {
    systemOrderId: 'SO-345912678',
    status: '已完成',
    createTime: new Date().getTime() - 777600000,
    updateTime: new Date().getTime() - 691200000
  }
]

// 商品数据
export const productList: ProductData[] = [
  {
    sku: 'SKU001',
    productName: '高品质无线蓝牙耳机',
    channelSku: 'AMZ-SKU001',
    channel: 'amazon',
    price: 99.99,
    status: '在售',
    imageUrl: 'https://example.com/images/headphones.jpg',
    updateTime: new Date().getTime() - 172800000, // 2天前
    lastSyncTime: new Date().getTime() - 86400000, // 1天前
    customerName: '客户A',
    stock: 30,
    wmsStock: 45,
    lastSyncStock: 38,
    store: 'US Store',
    masterSku: 'MS-001',
    masterProductName: 'Master 蓝牙耳机',
    warehouseStock: {
      US: 20,
      EU: 15,
      CN: 10
    },
    syncRule: {
      type: 'percent',
      value: 80
    }
  },
  {
    sku: 'SKU001',
    productName: '高品质无线蓝牙耳机',
    channelSku: 'SHF-SKU001',
    channel: 'shopify',
    price: 109.99,
    status: '在售',
    imageUrl: 'https://example.com/images/headphones.jpg',
    updateTime: new Date().getTime() - 259200000, // 3天前
    lastSyncTime: new Date().getTime() - 172800000, // 2天前
    customerName: '客户B',
    stock: 10,
    wmsStock: 25,
    lastSyncStock: 22,
    store: 'Main Store',
    masterSku: 'MS-001',
    masterProductName: 'Master 蓝牙耳机',
    warehouseStock: {
      US: 10,
      EU: 15
    },
    syncRule: {
      type: 'fixed',
      value: 100
    }
  },
  {
    sku: 'SKU001',
    productName: '高品质无线蓝牙耳机',
    channelSku: 'WMT-SKU001',
    channel: 'walmart',
    price: 89.99,
    status: '缺货',
    imageUrl: 'https://example.com/images/headphones.jpg',
    updateTime: new Date().getTime() - 345600000, // 4天前
    lastSyncTime: new Date().getTime() - 259200000, // 3天前
    customerName: '客户C',
    stock: 0,
    wmsStock: 15,
    lastSyncStock: 12,
    store: 'US Store',
    warehouseStock: {
      US: 15
    },
    syncRule: {
      type: 'reduce',
      value: 10,
      method: 'percent'
    }
  },
  {
    sku: 'SKU002',
    productName: '智能手表',
    channelSku: 'AMZ-SKU002',
    channel: 'amazon',
    price: 100.01,
    status: '在售',
    imageUrl: 'https://example.com/images/smartwatch.jpg',
    updateTime: new Date().getTime() - 172800000, // 2天前
    lastSyncTime: new Date().getTime() - 86400000, // 1天前
    customerName: '客户A',
    stock: 18,
    wmsStock: 22,
    lastSyncStock: 20,
    store: 'US Store',
    masterSku: 'MS-002',
    masterProductName: 'Master 智能手表',
    warehouseStock: {
      US: 12,
      UK: 10
    },
    syncRule: {
      type: 'reduce',
      value: 50,
      method: 'fixed'
    }
  },
  {
    sku: 'SKU003',
    productName: '超薄笔记本电脑',
    channelSku: 'SHF-SKU003',
    channel: 'shopify',
    price: 499.99,
    status: '在售',
    imageUrl: 'https://example.com/images/laptop.jpg',
    updateTime: new Date().getTime() - 86400000, // 1天前
    lastSyncTime: new Date().getTime() - 43200000, // 12小时前
    customerName: '客户B',
    stock: 5,
    wmsStock: 7,
    lastSyncStock: 6,
    store: 'Main Store',
    syncRule: {
      type: 'percent',
      value: 90
    }
  },
  {
    sku: 'SKU004',
    productName: '防水运动相机',
    channelSku: 'WMT-SKU004',
    channel: 'walmart',
    price: 53.33,
    status: '在售',
    imageUrl: 'https://example.com/images/camera.jpg',
    updateTime: new Date().getTime() - 172800000, // 2天前
    lastSyncTime: new Date().getTime() - 129600000, // 1.5天前
    customerName: '客户C',
    stock: 12,
    wmsStock: 18,
    lastSyncStock: 16,
    store: 'US Store',
    syncRule: {
      type: 'percent',
      value: 90
    }
  },
  {
    sku: 'SKU005',
    productName: '便携式充电宝',
    channelSku: 'AMZ-SKU005',
    channel: 'amazon',
    price: 39.99,
    status: '在售',
    imageUrl: 'https://example.com/images/powerbank.jpg',
    updateTime: new Date().getTime() - 259200000, // 3天前
    customerName: '客户A',
    stock: 25,
    wmsStock: 38,
    store: 'US Store'
  },
  // 新增商品数据
  {
    sku: 'SKU010',
    productName: '游戏笔记本电脑',
    channelSku: 'AMZ-SKU010',
    channel: 'amazon',
    price: 1299.99,
    status: '在售',
    imageUrl: 'https://example.com/images/gaming-laptop.jpg',
    updateTime: new Date().getTime() - 86400000, // 1天前
    customerName: '客户A',
    stock: 8,
    wmsStock: 10,
    store: 'US Store'
  },
  {
    sku: 'SKU011',
    productName: '智能音箱',
    channelSku: 'WMT-SKU011',
    channel: 'walmart',
    price: 124.99,
    status: '在售',
    imageUrl: 'https://example.com/images/smart-speaker.jpg',
    updateTime: new Date().getTime() - 172800000, // 2天前
    customerName: '客户C',
    stock: 15,
    wmsStock: 20,
    store: 'US Store'
  },
  {
    sku: 'SKU012',
    productName: '智能灯泡套装',
    channelSku: 'EBY-SKU012',
    channel: 'ebay',
    price: 19.99,
    status: '下架',
    imageUrl: 'https://example.com/images/smart-bulb.jpg',
    updateTime: new Date().getTime() - 259200000, // 3天前
    customerName: '客户D',
    stock: 2,
    wmsStock: 5,
    store: 'EU Store'
  },
  {
    sku: 'SKU013',
    productName: '无线耳机',
    channelSku: 'SHF-SKU013',
    channel: 'shopify',
    price: 199.99,
    status: '在售',
    imageUrl: 'https://example.com/images/wireless-earphones.jpg',
    updateTime: new Date().getTime() - 345600000, // 4天前
    customerName: '客户B',
    stock: 20,
    wmsStock: 25,
    store: 'Main Store'
  },
  {
    sku: 'SKU014',
    productName: '手机保护壳',
    channelSku: 'AMZ-SKU014',
    channel: 'amazon',
    price: 19.99,
    status: '缺货',
    imageUrl: 'https://example.com/images/phone-case.jpg',
    updateTime: new Date().getTime() - 432000000, // 5天前
    customerName: '客户A',
    stock: 0,
    wmsStock: 6,
    store: 'EU Store'
  },
  {
    sku: 'SKU015',
    productName: '手机支架',
    channelSku: 'WMT-SKU015',
    channel: 'walmart',
    price: 29.99,
    status: '在售',
    imageUrl: 'https://example.com/images/phone-stand.jpg',
    updateTime: new Date().getTime() - 518400000, // 6天前
    customerName: '客户C',
    stock: 32,
    wmsStock: 40,
    store: 'US Store'
  },
  {
    sku: 'SKU010',
    productName: '游戏笔记本电脑',
    channelSku: 'AMZ-SKU010',
    channel: 'amazon',
    store: 'EU Store',
    available: 2,
    reserved: 0,
    total: 2,
    updateTime: new Date().getTime() - 25200000, // 7小时前
    customerName: '客户A',
    stock: 2,
    wmsStock: 4,
    price: 1299.99,
    status: '在售'
  }
]

// 库存数据
export const inventoryList: InventoryData[] = [
  {
    sku: 'SKU001',
    productName: '高品质无线蓝牙耳机',
    channelSku: 'AMZ-SKU001',
    channel: 'amazon',
    store: 'US Store',
    available: 25,
    reserved: 5,
    total: 30,
    updateTime: new Date().getTime() - 3600000 // 1小时前
  },
  {
    sku: 'SKU001',
    productName: '高品质无线蓝牙耳机',
    channelSku: 'SHF-SKU001',
    channel: 'shopify',
    store: 'Main Store',
    available: 8,
    reserved: 2,
    total: 10,
    updateTime: new Date().getTime() - 7200000 // 2小时前
  },
  {
    sku: 'SKU001',
    productName: '高品质无线蓝牙耳机',
    channelSku: 'WMT-SKU001',
    channel: 'walmart',
    store: 'US Store',
    available: 0,
    reserved: 0,
    total: 0,
    updateTime: new Date().getTime() - 10800000 // 3小时前
  },
  {
    sku: 'SKU002',
    productName: '智能手表',
    channelSku: 'AMZ-SKU002',
    channel: 'amazon',
    store: 'US Store',
    available: 15,
    reserved: 3,
    total: 18,
    updateTime: new Date().getTime() - 3600000 // 1小时前
  },
  {
    sku: 'SKU003',
    productName: '超薄笔记本电脑',
    channelSku: 'SHF-SKU003',
    channel: 'shopify',
    store: 'Main Store',
    available: 5,
    reserved: 1,
    total: 6,
    updateTime: new Date().getTime() - 7200000 // 2小时前
  },
  {
    sku: 'SKU004',
    productName: '防水运动相机',
    channelSku: 'WMT-SKU004',
    channel: 'walmart',
    store: 'US Store',
    available: 12,
    reserved: 2,
    total: 14,
    updateTime: new Date().getTime() - 10800000 // 3小时前
  },
  {
    sku: 'SKU005',
    productName: '便携式充电宝',
    channelSku: 'AMZ-SKU005',
    channel: 'amazon',
    store: 'US Store',
    available: 30,
    reserved: 7,
    total: 37,
    updateTime: new Date().getTime() - 3600000 // 1小时前
  },
  // 新增库存数据
  {
    sku: 'SKU010',
    productName: '游戏笔记本电脑',
    channelSku: 'AMZ-SKU010',
    channel: 'amazon',
    store: 'US Store',
    available: 3,
    reserved: 1,
    total: 4,
    updateTime: new Date().getTime() - 3600000 // 1小时前
  },
  {
    sku: 'SKU011',
    productName: '智能音箱',
    channelSku: 'WMT-SKU011',
    channel: 'walmart',
    store: 'US Store',
    available: 8,
    reserved: 2,
    total: 10,
    updateTime: new Date().getTime() - 7200000 // 2小时前
  },
  {
    sku: 'SKU012',
    productName: '智能灯泡套装',
    channelSku: 'EBY-SKU012',
    channel: 'ebay',
    store: 'Main Store',
    available: 0,
    reserved: 0,
    total: 0,
    updateTime: new Date().getTime() - 10800000 // 3小时前
  },
  {
    sku: 'SKU013',
    productName: '无线耳机',
    channelSku: 'SHF-SKU013',
    channel: 'shopify',
    store: 'Main Store',
    available: 12,
    reserved: 3,
    total: 15,
    updateTime: new Date().getTime() - 14400000 // 4小时前
  },
  {
    sku: 'SKU014',
    productName: '手机保护壳',
    channelSku: 'AMZ-SKU014',
    channel: 'amazon',
    store: 'EU Store',
    available: 0,
    reserved: 0,
    total: 0,
    updateTime: new Date().getTime() - 18000000 // 5小时前
  },
  {
    sku: 'SKU015',
    productName: '手机支架',
    channelSku: 'WMT-SKU015',
    channel: 'walmart',
    store: 'EU Store',
    available: 25,
    reserved: 5,
    total: 30,
    updateTime: new Date().getTime() - 21600000 // 6小时前
  },
  {
    sku: 'SKU010',
    productName: '游戏笔记本电脑',
    channelSku: 'AMZ-SKU010',
    channel: 'amazon',
    store: 'EU Store',
    available: 2,
    reserved: 0,
    total: 2,
    updateTime: new Date().getTime() - 25200000, // 7小时前
    customerName: '客户A',
    stock: 2,
    wmsStock: 4,
    price: 1299.99,
    status: '在售'
  }
]

// 查询函数
export function queryOrders(params: QueryParams): PaginatedResponse<OrderData> {
  let results = [...orderList]
  
  // 基本过滤条件
  if (params.customer && params.channel) {
    results = results.filter(item => item.channel === params.channel)
  }
  
  if (params.channelOrderId) {
    results = results.filter(item => item.channelOrderId.includes(params.channelOrderId as string))
  }
  
  if (params.systemOrderId) {
    results = results.filter(item => item.systemOrderId.includes(params.systemOrderId as string))
  }
  
  // 高级查询条件 - 订单
  if (params.orderStatus) {
    results = results.filter(item => item.status === params.orderStatus)
  }
  
  if (params.customerName) {
    results = results.filter(item => item.customerName.includes(params.customerName))
  }
  
  if (params.startDate && params.endDate) {
    const startTimestamp = new Date(params.startDate).getTime()
    const endTimestamp = new Date(params.endDate).getTime() + 86400000 // 加一天，包含结束日期
    results = results.filter(item => {
      return item.createTime >= startTimestamp && item.createTime <= endTimestamp
    })
  }
  
  // 计算分页
  const total = results.length
  const startIndex = (params.page - 1) * params.pageSize
  const endIndex = startIndex + params.pageSize
  const data = results.slice(startIndex, endIndex)
  
  return {
    data,
    total
  }
}

export function querySystemOrders(channelOrderId: string): SystemOrderData[] {
  // 通过渠道订单号找到对应的系统订单
  const order = orderList.find(o => o.channelOrderId === channelOrderId)
  if (!order) return []
  
  return systemOrderList.filter(so => so.systemOrderId === order.systemOrderId)
}

export function queryProducts(params: QueryParams): PaginatedResponse<ProductData> {
  let results = [...productList]
  
  // 基本过滤条件
  if (params.customer && params.channel) {
    results = results.filter(item => item.channel === params.channel)
  }
  
  if (params.productName) {
    results = results.filter(item => item.productName.includes(params.productName as string))
  }
  
  if (params.sku) {
    results = results.filter(item => item.sku.includes(params.sku as string) || item.channelSku.includes(params.sku as string))
  }
  
  // 高级查询条件 - 商品
  if (params.productStatus) {
    results = results.filter(item => item.status === params.productStatus)
  }
  
  if (params.minPrice !== undefined) {
    results = results.filter(item => item.price >= params.minPrice!)
  }
  
  if (params.maxPrice !== undefined) {
    results = results.filter(item => item.price <= params.maxPrice!)
  }
  
  // 计算分页
  const total = results.length
  const startIndex = (params.page - 1) * params.pageSize
  const endIndex = startIndex + params.pageSize
  const data = results.slice(startIndex, endIndex)
  
  return {
    data,
    total
  }
}

export function queryInventory(params: QueryParams): PaginatedResponse<InventoryData> {
  let results = [...inventoryList]
  
  // 基本过滤条件
  if (params.customer && params.channel) {
    results = results.filter(item => item.channel === params.channel)
  }
  
  if (params.productName) {
    results = results.filter(item => item.productName.includes(params.productName as string))
  }
  
  if (params.sku) {
    results = results.filter(item => item.sku.includes(params.sku as string) || item.channelSku.includes(params.sku as string))
  }
  
  // 高级查询条件 - 库存
  if (params.store) {
    results = results.filter(item => item.store.includes(params.store))
  }
  
  if (params.inventoryStatus) {
    switch(params.inventoryStatus) {
      case '有库存':
        results = results.filter(item => item.available > 10)
        break
      case '低库存':
        results = results.filter(item => item.available > 0 && item.available <= 10)
        break
      case '无库存':
        results = results.filter(item => item.available <= 0)
        break
    }
  }
  
  // 计算分页
  const total = results.length
  const startIndex = (params.page - 1) * params.pageSize
  const endIndex = startIndex + params.pageSize
  const data = results.slice(startIndex, endIndex)
  
  return {
    data,
    total
  }
} 