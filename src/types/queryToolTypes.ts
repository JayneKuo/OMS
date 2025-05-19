// 客户信息
export interface Customer {
  id: string;
  name: string;
  code: string;
}

// 渠道信息
export interface Channel {
  id: string;
  name: string;
  code: string;
  type: string;
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
export interface OrderData {
  channelOrderId: string;
  systemOrderId?: string;
  channel: string;
  status?: string;
  customerName: string;
  amount: number;
  createTime: number;
  items: OrderItem[];
  channelStatus?: string;
  store?: string;
  systemCreateTime?: number;
}

// 系统订单数据
export interface SystemOrderData {
  systemOrderId: string;
  status: string;
  createTime: number;
  updateTime: number;
  errorReason?: string;
}

// 商品数据
export interface ProductData {
  sku: string;
  productName: string;
  channelSku: string;
  channel: string;
  price: number;
  status: string;
  imageUrl?: string;
  updateTime: number;
  store?: string;
  available?: number;
  reserved?: number;
  total?: number;
  stock?: number;
  wmsStock?: number;
  lastSyncStock?: number;
  lastSyncTime?: number;
  customerName?: string;
  masterSku?: string;
  masterProductName?: string;
  warehouseStock?: {
    US?: number;
    EU?: number;
    CN?: number;
    UK?: number;
    [key: string]: number | undefined;
  };
  syncRule?: {
    type: 'percent' | 'fixed' | 'reduce';
    value: number;
    method?: 'percent' | 'fixed';
  };
  inventoryLocations?: Array<{
    name: string;
    quantity: number;
  }>;
}

// 库存数据
export interface InventoryData {
  sku: string;
  productName: string;
  channelSku: string;
  channel: string;
  store: string;
  available: number;
  reserved: number;
  total: number;
  updateTime: number;
}

// 查询参数
export interface QueryParams {
  customer: string;
  channel: string;
  type: 'order' | 'product' | 'inventory';
  page: number;
  pageSize: number;
  
  // 订单查询字段
  channelOrderId?: string;
  systemOrderId?: string;
  orderStatus?: string;
  channelStatus?: string;
  startDate?: string;
  endDate?: string;
  
  // 商品查询字段
  productName?: string;
  sku?: string;
  productStatus?: string;
  minPrice?: number;
  maxPrice?: number;
  
  // 库存查询字段
  inventoryStatus?: string;
  store?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
} 