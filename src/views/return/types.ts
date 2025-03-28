// 退货订单状态枚举
export enum ReturnOrderStatus {
  Created = 'Created',           // 已创建
  Pending = 'Pending',          // 待处理
  Approved = 'Approved',        // 已批准
  Processing = 'Processing',    // 处理中
  Shipped = 'Shipped',         // 已发货
  Received = 'Received',       // 已收货
  Refunded = 'Refunded',       // 已退款
  Completed = 'Completed',     // 已完成
  Cancelled = 'Cancelled'      // 已取消
}

// 退货类型枚举
export enum ReturnType {
  Refund = 'Refund',           // 退款
  Exchange = 'Exchange'        // 换货
}

// 退货原因枚举
export enum ReturnReason {
  QualityIssue = 'Quality Issue',           // 质量问题
  WrongItem = 'Wrong Item',                 // 商品错误
  SizeIssue = 'Size Issue',                 // 尺码问题
  ColorIssue = 'Color Issue',               // 颜色问题
  CustomerChangedMind = 'Customer Changed Mind', // 客户改变主意
  Other = 'Other'                           // 其他原因
}

// 退货商品接口
export interface ReturnItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  originalPrice: number
  refundPrice: number
  reason: ReturnReason
  notes?: string
}

// 退货订单接口
export interface ReturnOrder {
  id: string
  returnOrderNo: string
  originalOrderNo: string
  status: ReturnOrderStatus
  returnType: ReturnType
  reason: ReturnReason
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  country: string
  createDate: string
  approvedDate?: string
  shipDate?: string
  receiveDate?: string
  refundDate?: string
  items: ReturnItem[]
  totalAmount: number
  refundAmount: number
  trackingNumber?: string
  carrier?: string
  notes?: string
}

// 退货记录接口（用于销售订单中的退货历史）
export interface ReturnRecord {
  returnOrderNo: string
  type: ReturnType
  status: ReturnOrderStatus
  createDate: string
  items: ReturnItem[]
  amount: number
}

// 状态配置接口
export interface ReturnStatusConfig {
  label: string
  value: ReturnOrderStatus
  color: string
  availableActions: ReturnAction[]
}

// 退货操作枚举
export enum ReturnAction {
  Approve = 'approve',
  Reject = 'reject',
  Ship = 'ship',
  Receive = 'receive',
  Refund = 'refund',
  Cancel = 'cancel'
}

// 状态配置
export const RETURN_STATUS_CONFIG: Record<ReturnOrderStatus, ReturnStatusConfig> = {
  [ReturnOrderStatus.Created]: {
    label: 'Created',
    value: ReturnOrderStatus.Created,
    color: 'info',
    availableActions: [ReturnAction.Approve, ReturnAction.Reject]
  },
  [ReturnOrderStatus.Pending]: {
    label: 'Pending',
    value: ReturnOrderStatus.Pending,
    color: 'warning',
    availableActions: [ReturnAction.Approve, ReturnAction.Reject]
  },
  [ReturnOrderStatus.Approved]: {
    label: 'Approved',
    value: ReturnOrderStatus.Approved,
    color: 'success',
    availableActions: [ReturnAction.Ship, ReturnAction.Cancel]
  },
  [ReturnOrderStatus.Processing]: {
    label: 'Processing',
    value: ReturnOrderStatus.Processing,
    color: 'primary',
    availableActions: [ReturnAction.Ship, ReturnAction.Cancel]
  },
  [ReturnOrderStatus.Shipped]: {
    label: 'Shipped',
    value: ReturnOrderStatus.Shipped,
    color: 'info',
    availableActions: [ReturnAction.Receive]
  },
  [ReturnOrderStatus.Received]: {
    label: 'Received',
    value: ReturnOrderStatus.Received,
    color: 'success',
    availableActions: [ReturnAction.Refund]
  },
  [ReturnOrderStatus.Refunded]: {
    label: 'Refunded',
    value: ReturnOrderStatus.Refunded,
    color: 'success',
    availableActions: []
  },
  [ReturnOrderStatus.Completed]: {
    label: 'Completed',
    value: ReturnOrderStatus.Completed,
    color: 'success',
    availableActions: []
  },
  [ReturnOrderStatus.Cancelled]: {
    label: 'Cancelled',
    value: ReturnOrderStatus.Cancelled,
    color: 'danger',
    availableActions: []
  }
}

// 退货原因选项
export const RETURN_REASONS = [
  { value: ReturnReason.QualityIssue, label: 'Quality Issue' },
  { value: ReturnReason.WrongItem, label: 'Wrong Item' },
  { value: ReturnReason.SizeIssue, label: 'Size Issue' },
  { value: ReturnReason.ColorIssue, label: 'Color Issue' },
  { value: ReturnReason.CustomerChangedMind, label: 'Customer Changed Mind' },
  { value: ReturnReason.Other, label: 'Other' }
]

// 退货类型选项
export const RETURN_TYPES = [
  { value: ReturnType.Refund, label: 'Refund' },
  { value: ReturnType.Exchange, label: 'Exchange' }
] 