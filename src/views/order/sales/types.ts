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
  Merge = 'merge'
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
    availableActions: [],
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