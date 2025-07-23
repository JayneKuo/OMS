import { ReturnOrderStatus, ReturnType, ReturnReason } from '@/views/return/types'

// 订单状态枚举
export enum OrderStatus {
  Imported = 'Imported',
  Pending = 'Pending',
  Allocated = 'Allocated',
  Exception = 'Exception',
  Deallocated = 'Deallocated',
  Cancelling = 'Cancelling',
  Cancelled = 'Cancelled',
  WarehouseProcessing = 'Warehouse Processing',
  Shipped = 'Shipped',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Completed = 'Completed'
}

export enum SubOrderStatus {
  NotCreated = 'Not Created',
  Created = 'Created',
  Allocated = 'Allocated',
  Exception = 'Exception',
  Deallocated = 'Deallocated',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Completed = 'Completed'
}

// 订单操作枚举
export enum OrderAction {
  Allocate = 'allocate',
  Pend = 'pend',
  Cancel = 'cancel',
  Edit = 'edit',
  Deallocate = 'deallocate',
  Dispatch = 'dispatch',
  Reopen = 'reopen',
  Split = 'split',
  Merge = 'merge',
  SyncLogistics = 'sync_logistics'
}

export enum FulfillmentMode {
  Manual = 'Manual',
  AutoAllocate = 'Auto Allocate',
  AutoDispatch = 'Auto Dispatch'
}

// 订单状态配置接口
export interface OrderStatusConfig {
  label: string
  value: OrderStatus
  color: string
  availableActions: OrderAction[]
}

// 状态操作配置接口
export interface StatusAction {
  availableActions: OrderAction[]
  allowSplit: boolean
  allowMerge: boolean
  requireWarehouse: boolean
  requireSubOrderCheck: boolean
}

// 仓库选项接口
export interface WarehouseOption {
  value: string
  label: string
  disabled?: boolean
}

// 订单数据接口
export interface OrderItem {
  id: string
  channel: string
  channelName: string
  orderNo: string
  channelOrderNo: string
  status: OrderStatus
  recipient: string
  country: string
  purchaseOrderId: string
  referenceNo: string
  carrier: string
  orderDate: string
  grandTotal: number
  shipDate: string | null
  product: string
  fulfillmentMode: FulfillmentMode
  subOrders: SubOrder[]
  returnStatus?: ReturnOrderStatus
  returnQuantity?: number
  returnAmount?: number
  returns?: ReturnRecord[]
}

// 新增退货记录接口
export interface ReturnRecord {
  returnOrderNo: string
  type: ReturnType
  status: ReturnOrderStatus
  createDate: string
  items: ReturnItem[]
  amount: number
}

export interface ReturnItem {
  sku: string
  quantity: number
  reason: ReturnReason
}

// 状态配置
export const STATUS_CONFIG: Record<OrderStatus, StatusAction> = {
  [OrderStatus.Imported]: {
    availableActions: [OrderAction.Allocate, OrderAction.Pend, OrderAction.Cancel, OrderAction.Edit],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: true,
    requireSubOrderCheck: false
  },
  [OrderStatus.Pending]: {
    availableActions: [OrderAction.Allocate, OrderAction.Cancel, OrderAction.Edit],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: true,
    requireSubOrderCheck: false
  },
  [OrderStatus.Allocated]: {
    availableActions: [OrderAction.Deallocate, OrderAction.Cancel],
    allowSplit: true,
    allowMerge: false,
    requireWarehouse: false,
    requireSubOrderCheck: true
  },
  [OrderStatus.Exception]: {
    availableActions: [OrderAction.Allocate, OrderAction.Cancel, OrderAction.Edit],
    allowSplit: false,
    allowMerge: true,
    requireWarehouse: true,
    requireSubOrderCheck: true
  },
  [OrderStatus.Deallocated]: {
    availableActions: [OrderAction.Allocate, OrderAction.Cancel],
    allowSplit: false,
    allowMerge: true,
    requireWarehouse: true,
    requireSubOrderCheck: true
  },
  [OrderStatus.Cancelling]: {
    availableActions: [],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: false,
    requireSubOrderCheck: true
  },
  [OrderStatus.Cancelled]: {
    availableActions: [OrderAction.Reopen],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: false,
    requireSubOrderCheck: false
  },
  [OrderStatus.WarehouseProcessing]: {
    availableActions: [OrderAction.Deallocate],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: false,
    requireSubOrderCheck: true
  },
  [OrderStatus.Shipped]: {
    availableActions: [OrderAction.SyncLogistics],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: false,
    requireSubOrderCheck: true
  },
  [OrderStatus.InTransit]: {
    availableActions: [OrderAction.SyncLogistics],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: false,
    requireSubOrderCheck: true
  },
  [OrderStatus.Delivered]: {
    availableActions: [OrderAction.SyncLogistics],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: false,
    requireSubOrderCheck: true
  },
  [OrderStatus.Completed]: {
    availableActions: [],
    allowSplit: false,
    allowMerge: false,
    requireWarehouse: false,
    requireSubOrderCheck: true
  }
}

// 仓库列表
export const WAREHOUSE_OPTIONS: WarehouseOption[] = [
  { value: 'WH_US_01', label: 'US Warehouse 01' },
  { value: 'WH_US_02', label: 'US Warehouse 02' },
  { value: 'WH_UK_01', label: 'UK Warehouse 01' }
]

// 挂起原因选项
export interface HoldReason {
  value: string
  label: string
}

export const HOLD_REASONS: HoldReason[] = [
  { value: 'address_verification', label: 'Address Verification Required' },
  { value: 'payment_review', label: 'Payment Review' },
  { value: 'customer_request', label: 'Customer Request' },
  { value: 'fraud_check', label: 'Fraud Check' }
]

// 取消原因选项
export interface CancelReason {
  value: string
  label: string
}

export const CANCEL_REASONS: CancelReason[] = [
  { value: 'customer_request', label: 'Customer Requested' },
  { value: 'fraud_detected', label: 'Fraud Detected' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'address_invalid', label: 'Invalid Address' }
]

export const REOPEN_REASONS = [
  { value: 'customer_request', label: 'Customer Requested' },
  { value: 'system_error', label: 'System Error' },
  { value: 'wrong_operation', label: 'Wrong Operation' }
]

export interface SubOrder {
  id: string
  orderNo: string
  subOrderNo: string
  status: SubOrderStatus
  warehouse: string
  quantity: number
  product: string
}

// 商品基础类型
export interface Product {
  id: string
  name: string
  category: string
  status: string
  quantity: number
  uom: string // 计量单位
  price: number
  discount: number
  tax: number
  amount: number
  snCode: string
  remarks: string
  color: string
}

// 商品操作历史记录
export interface ProductHistoryRecord {
  type: string // cancel, return, exchange, refund
  action: string // 操作描述
  beforeQuantity: number // 操作前数量
  afterQuantity: number // 操作后数量
  reason: string // 操作原因
  time: string // 操作时间
}

// 增强商品数据结构
export interface EnhancedProduct {
  id: string
  name: string
  category: string
  snCode: string
  poLineNo?: string  // 添加 poLineNo 字段，设为可选
  uom: string
  price: number
  discount: number
  tax: number
  color: string
  originalQuantity: number // 原始购买数量
  shouldDispatchQuantity: number // 应发货数量
  dispatchedQuantity: number // 已下发数量
  shippedQuantity: number // 已shipped数量
  fulfillmentQuantity: number // 当前需要履约的数量
  cancelledQuantity: number // 已取消数量
  returnedQuantity: number // 已退货数量
  exchangedQuantity: number // 已换货数量
  refundedQuantity: number // 已退款数量
  productStatus: string // 商品状态：待发货、已取消、已退款、已退货
  fulfillmentStatus: string // 履约状态
  hasOperations: boolean // 是否有操作历史
  operationTypes: string[] // 操作类型列表
  history: ProductHistoryRecord[] // 操作历史
  isExchangeProduct?: boolean // 是否为换货商品
  originalProductId?: string // 原商品ID（换货商品使用）
  isOnHold?: boolean // 是否处于 hold 状态
  holdReason?: string // hold 原因
}

// 取消商品数据结构
export interface CancelledProduct extends Product {
  cancelReason: string
  cancelTime: string
}

// 退货商品数据结构
export interface ReturnedProduct extends Product {
  returnQuantity: number
  returnReason: string
  returnStatus: string
  returnTime: string
}

// 换货商品数据结构
export interface ExchangedProduct {
  id: string
  originalProduct: Product
  newProduct: Product
  exchangeReason: string
  exchangeStatus: string
  exchangeTime: string
  priceDifference: number
} 