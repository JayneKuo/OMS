// 默认列配置
export const DEFAULT_COLUMNS: OrderColumn[] = [
  // 第一组
  {
    key: 'orderId',
    label: 'Order No.',
    minWidth: 120,
    sortable: true,
    visible: true,
    fixed: 'left'
  },
  {
    key: 'status',
    label: 'Status',
    minWidth: 120,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'exceptions',
    label: 'Status Info',
    minWidth: 150,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'source',
    label: 'Channel',
    minWidth: 100,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'storeName',
    label: 'Channel Name',
    minWidth: 120,
    sortable: true,
    visible: true,
    noWrap: true
  },
  // 第二组
  {
    key: 'channelOrderNo',
    label: 'Channel Order No.',
    minWidth: 140,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'referenceNo',
    label: 'Reference No.',
    minWidth: 140,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'total',
    label: 'Total',
    minWidth: 120,
    sortable: true,
    visible: true,
    noWrap: true,
    align: 'right'
  },
  // 第三组
  {
    key: 'ordered',
    label: 'Order Date',
    minWidth: 150,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'ingested',
    label: 'Ingested',
    minWidth: 150,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'shipDate',
    label: 'Ship Date',
    minWidth: 120,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'updated',
    label: 'Updated',
    minWidth: 150,
    sortable: true,
    visible: false,
    noWrap: true
  },
  // 第四组
  {
    key: 'shippingCarrier',
    label: 'Shipping Carrier',
    minWidth: 150,
    visible: false,
    noWrap: true
  },
  // 第五组
  {
    key: 'tags',
    label: 'Tags',
    minWidth: 150,
    visible: false,
    noWrap: true
  },
  // 第六组
  {
    key: 'email',
    label: 'Email',
    minWidth: 200,
    visible: false,
    noWrap: true
  },
  {
    key: 'firstName',
    label: 'First Name',
    minWidth: 120,
    visible: false,
    noWrap: true
  },
  {
    key: 'lastName',
    label: 'Last Name',
    minWidth: 120,
    visible: false,
    noWrap: true
  },
  {
    key: 'state',
    label: 'State',
    minWidth: 100,
    visible: false,
    noWrap: true
  },
  {
    key: 'country',
    label: 'Country',
    minWidth: 120,
    visible: false,
    noWrap: true
  },
  {
    key: 'company',
    label: 'Company',
    minWidth: 150,
    visible: false,
    noWrap: true
  }
]

// 订单列接口
export interface OrderColumn {
  key: string
  label: string
  minWidth: number
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
  visible: boolean
  noWrap?: boolean
  align?: 'left' | 'right' | 'center'
}

// 订单项接口
export interface OrderItem {
  id: string
  orderId: string
  status: string
  exceptions: string
  source: string
  storeName: string
  channelOrderNo: string
  referenceNo: string
  total: number
  ordered: string
  ingested: string
  shipDate: string
  updated: string
  shippingCarrier: string
  tags: string[]
  email: string
  firstName: string
  lastName: string
  state: string
  country: string
  company: string
}

// 订单状态枚举
export enum OrderStatus {
  All = 'all',
  Imported = 'imported',
  Pending = 'pending',
  Allocated = 'allocated',
  Deallocated = 'deallocated',
  WarehouseProcessing = 'warehouse_processing',
  Shipped = 'shipped',
  Cancelled = 'cancelled',
  Exception = 'exception',
  Cancelling = 'cancelling',
  Completed = 'completed'
}

// 异常类型
export enum ExceptionType {
  AddressValidation = 'address_validation',
  InventoryShortage = 'inventory_shortage',
  PaymentFailed = 'payment_failed',
  ShippingError = 'shipping_error',
  SystemError = 'system_error'
}

// 渠道类型
export enum ChannelType {
  Shopify = 'shopify',
  Amazon = 'amazon',
  Ebay = 'ebay',
  Walmart = 'walmart'
}

// 搜索条件接口
export interface SearchCondition {
  orderNos: string[];
  channelOrderNos: string[];
  statuses: OrderStatus[];
  channels: ChannelType[];
  exceptionTypes: ExceptionType[];
  dateRange: {
    start: string;
    end: string;
  } | null;
}

export enum OrderAction {
  SetHold = 'setHold',
  UpdateStatus = 'updateStatus',
  RunRouting = 'runRouting',
  PushOrders = 'pushOrders'
} 