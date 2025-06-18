import { OrderStatus } from './order'

// 更新类型
export enum UpdateType {
  Quantity = 'quantity',
  Address = 'address',
  SKU = 'sku',
  QuantityIncrease = 'quantity_increase',
  QuantityDecrease = 'quantity_decrease',
  NewLineItem = 'new_line_item',
  RemoveLineItem = 'remove_line_item',
  AddressChange = 'address_change',
  Exchange = 'exchange'
}

// 更新状态
export enum UpdateStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed'
}

export enum WMSStatus {
  Created = 'Created',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Cancelled = 'Cancelled'
}

export enum FailureType {
  WMSProcessing = 'wms_processing',
  ShippedQuantityDecrease = 'shipped_quantity_decrease',
  NewSKUFailed = 'new_sku_failed',
  QuantityIncreaseFailed = 'quantity_increase_failed',
  AddressChangeDispatchIssued = 'address_change_dispatch_issued',
  AddressChangeShipped = 'address_change_shipped',
  ShippedItemModification = 'shipped_item_modification'
}

interface BaseContent {
  wmsStatus: WMSStatus
  wmsCancelled: boolean
  shipmentNo?: string
  dispatchNo?: string[] // WMS派单号列表
}

interface QuantityContent extends BaseContent {
  before: {
    quantity: number
    sku: string
    productName: string
    price: number
    warehouse: string
  }
  after: {
    quantity: number
    sku: string
    productName: string
    price: number
    warehouse: string
  }
}

interface AddressContent extends BaseContent {
  before: {
    address: string
    zipCode: string
    contactName: string
    phone: string
  }
  after: {
    address: string
    zipCode: string
    contactName: string
    phone: string
  }
}

export type UpdateContent = QuantityContent | AddressContent

// 更新记录
export interface OrderUpdate {
  id: string;                   // 更新记录ID
  orderId: string;              // 订单ID
  orderNo: string;              // 订单编号
  sourceOrderNo: string;        // 源订单编号
  channel: string;              // 渠道
  updateType: UpdateType;        // 更新类型
  updateStatus: UpdateStatus;    // 更新状态
  orderStatus: string;          // 订单当前状态
  failureType: FailureType;      // 失败类型
  content: {
    before: any
    after: any
    dispatchNos?: string[]
    isShipped?: boolean
    wmsCancelled?: boolean
    wmsStatus?: string
    shipmentNo?: string
  }
  failureDescription: string;    // 失败描述
  suggestion: string;           // 建议
  failureTime: string;          // 失败时间
  remarks?: string;            // 备注
  wmsMessage?: string;          // WMS返回的错误信息
}

// 更新记录查询参数
export interface UpdateQueryParams {
  orderId?: string;             // 订单ID
  orderNo?: string;             // 订单编号
  updateType?: UpdateType;      // 更新类型
  updateStatus?: UpdateStatus;  // 更新状态
  startTime?: string;           // 开始时间
  endTime?: string;            // 结束时间
  operator?: string;           // 操作人
  page: number;                // 页码
  pageSize: number;            // 每页条数
}

// 更新记录响应
export interface UpdateResponse {
  total: number;               // 总记录数
  items: OrderUpdate[];        // 更新记录列表
  page: number;                // 页码
  pageSize: number;            // 每页条数
}

// 更新记录搜索参数
export interface UpdateSearchParams {
  page: number;                // 页码
  pageSize: number;            // 每页条数
  orderNo?: string;            // 订单编号
  channelOrderNo?: string;     // 渠道订单编号
  channel?: string;            // 渠道
  updateType?: UpdateType;      // 更新类型
  updateStatus?: UpdateStatus;  // 更新状态
  startTime?: string;          // 开始时间
  endTime?: string;           // 结束时间
} 