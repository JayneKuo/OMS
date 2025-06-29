// Channel Types
export enum ChannelType {
  AMAZON = 'AMAZON',
  EBAY = 'EBAY',
  WALMART = 'WALMART',
  SHOPIFY = 'SHOPIFY',
  LAZADA = 'LAZADA',
  MANUAL = 'MANUAL'
}

// Status Types
export enum ReturnOrderStatus {
  Created = 'CREATED',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED',
  Received = 'RECEIVED',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  OnHold = 'ON_HOLD'
}

// Return Type
export enum ReturnType {
  Regular = 'Regular Return',
  ExceptionAuthorized = 'Exception Authorized by Client',
  InTransit = 'In Transit',
  Refund = 'Refund',
  Exchange = 'Exchange'
}

// Return Reason
export enum ReturnReason {
  QualityIssue = 'QUALITY_ISSUE',
  WrongSize = 'WRONG_SIZE',
  WrongItem = 'WRONG_ITEM',
  Defective = 'DEFECTIVE',
  NotAsDescribed = 'NOT_AS_DESCRIBED',
  BetterPrice = 'BETTER_PRICE',
  Other = 'OTHER'
}

// Return Action
export enum ReturnAction {
  View = 'VIEW',
  Create = 'CREATE',
  Edit = 'EDIT',
  Approve = 'APPROVE',
  Reject = 'REJECT',
  Ship = 'SHIP',
  Receive = 'RECEIVE',
  Refund = 'REFUND',
  Cancel = 'CANCEL',
  Hold = 'HOLD',
  Release = 'RELEASE'
}

// Return Item Status
export enum ReturnItemStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Received = 'RECEIVED',
  Refunded = 'REFUNDED'
}

// 退货商品接口
export interface ReturnItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  originalQty: number
  originalPrice: number
  refundPrice: number
  reason: ReturnReason
  condition?: string
  status: ReturnItemStatus
  notes?: string
  images?: string[]
  locationCode?: string
}

// RMS系统映射
export interface RMSMapping {
  status: string
  rmaNo: string
  facilityId: string
  notes: string
  dnNumber?: string
  closedTime?: string
}

// WMS系统映射
export interface WMSMapping {
  status: string
  inboundNo: string
  warehouseId: string
  notes: string
  dnNumber?: string
  receivedDate?: string
}

// 物流信息
export interface Shipment {
  carrier?: string;
  trackingNumber?: string;
  bol?: string;
  eta?: string;
}

// Channel Information
export interface ChannelInfo {
  type: ChannelType
  storeName: string
  storeId: string
  platformOrderNo: string
  accountId: string
}

// Channel Information
export interface Channel {
  type?: ChannelType
  storeName: string
  storeId: string
  platformOrderNo: string
  accountId: string
}

// Return Order interface
export interface ReturnOrder {
  returnOrderNo?: string;
  originalOrderNo: string;
  status: ReturnStatus;
  returnType?: ReturnType;
  reason?: ReturnReason;
  reference?: string;
  channel: Channel;
  firstName: string;
  lastName: string;
  customerEmail: string;
  customerPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  items: ReturnItem[];
  facilityId: string;
  gracePeriod?: number;
  shipMethod?: ShipMethod;
  shipments?: Shipment[];
  rmaClosedTime?: string;
  originalPO?: string;
  originalSO?: string;
  wmsSN?: string;
  source?: Source;
  createBy?: string;
  createdAt?: string;
  updateBy?: string;
  updatedAt?: string;
  dynamicText?: {
    [key: string]: string;
  };
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
  },
  [ReturnOrderStatus.OnHold]: {
    label: 'On Hold',
    value: ReturnOrderStatus.OnHold,
    color: 'secondary',
    availableActions: []
  }
}

// 退货原因选项
export const RETURN_REASONS = [
  { value: ReturnReason.QualityIssue, label: 'Quality Issue' },
  { value: ReturnReason.WrongItem, label: 'Wrong Item' },
  { value: ReturnReason.WrongSize, label: 'Wrong Size' },
  { value: ReturnReason.Defective, label: 'Defective' },
  { value: ReturnReason.NotAsDescribed, label: 'Not As Described' },
  { value: ReturnReason.BetterPrice, label: 'Better Price' },
  { value: ReturnReason.Other, label: 'Other' }
]

// 退货类型选项
export const RETURN_TYPES = [
  { value: ReturnType.Refund, label: 'Refund' },
  { value: ReturnType.Exchange, label: 'Exchange' }
]

// Action Button Type
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'

// Action Button Interface
export interface ActionButton {
  action: ReturnAction
  label: string
  buttonType: ButtonType
  disabled?: boolean
  icon?: string
}

export interface SearchParams {
  page: number
  pageSize: number
  returnOrderNo?: string
  originalOrderNo?: string
  channelOrderNo?: string
  returnType?: ReturnType
  channel?: ChannelType
  status?: ReturnOrderStatus[]
  dateRange?: [string, string] | null
  customerName?: string
}

export enum ReturnStatus {
  Initiated = 'Initiated',
  Hold = 'Hold',
  PartialReceived = 'Partial Received',
  Received = 'Received',
  Screening = 'Screening',
  Screened = 'Screened',
  ForceClose = 'Force Closed',
  RMAFinished = 'RMA Finished',
  SystemClosed = 'System Closed'
}

export enum ShipMethod {
  USPSParcel = 'USPS Parcel',
  FedExUPSLTL = 'FedEx/UPS/LTL',
  CustomerDropOff = 'Customer Drop-off',
  Unknown = 'Unknown'
}

export enum Source {
  WMS = 'WMS',
  ClientPortal = 'Client Portal',
  VoiceASR = 'Voice ASR',
  WebServiceInquiry = 'Web Service Inquiry',
  ManualCreate = 'Manual Create',
  SystemLog = 'System Log'
}

export interface ReturnHistory {
  returnOrderNo: string;
  items: {
    productId: string;
    quantity: number;
    type: ReturnType;
  }[];
  status: ReturnStatus;
  createdAt: string;
} 