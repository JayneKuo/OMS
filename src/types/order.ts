// 订单状态枚举
export enum OrderStatus {
  All = 'All',
  Imported = 'Imported',
  Pending = 'Pending',
  Allocated = 'Allocated',
  Exception = 'Exception',
  Deallocated = 'Deallocated',
  Cancelling = 'Cancelling',
  Cancelled = 'Cancelled',
  Processing = 'Processing',
  Shipped = 'Shipped',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Completed = 'Completed'
}

// 订单状态分组
export const OrderStatusGroups = {
  Active: [
    OrderStatus.Imported,
    OrderStatus.Pending,
    OrderStatus.Processing,
    OrderStatus.Allocated,
    OrderStatus.Shipped,
    OrderStatus.InTransit,
    OrderStatus.Delivered
  ],
  Completed: [
    OrderStatus.Completed
  ],
  Exception: [
    OrderStatus.Exception
  ],
  Cancelled: [
    OrderStatus.Deallocated,
    OrderStatus.Cancelling,
    OrderStatus.Cancelled
  ]
};

// 动态节点配置接口
export interface DynamicNodeConfig {
  status: OrderStatus;
  position: 'beforeAllocated' | 'afterAllocated' | 'afterPending' | 'beforeWarehouse' | 'afterWarehouse';
  reason?: string;
  time?: string;
  orderId?: string;
  updateContent?: string;
  updateType?: 'quantity' | 'address' | 'other';
  affectedItems?: Array<{
    sku: string;
    name: string;
    quantity: number;
    reason?: string;
  }>;
}

export interface OrderStatusTime {
  [key in OrderStatus]?: string;
}

export interface Order {
  id: string
  orderNo: string
  channelOrderNo: string
  channel: string
  status: OrderStatus
  recipient: string
  country: string
  purchaseOrderId: string
  referenceNo: string
  carrier: string
  orderDate: string
  grandTotal: number
  shipDate?: string
  product: string
  returnStatus?: string
}

export interface OrderDetail extends Order {
  items: OrderItem[]
  address: Address
  timeline: TimelineItem[]
  notes: Note[]
}

export interface OrderItem {
  id: string
  sku: string
  name: string
  quantity: number
  price: number
  total: number
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  contactName: string
  phone: string
}

export interface TimelineItem {
  id: string
  time: string
  status: OrderStatus
  operator: string
  note?: string
}

export interface Note {
  id: string
  content: string
  createTime: string
  operator: string
} 