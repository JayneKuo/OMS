// Shipping Request 列配置
export const DEFAULT_COLUMNS: ShippingRequestColumn[] = [
  {
    key: 'requestNo',
    label: 'Request No.',
    minWidth: 120,
    sortable: true,
    visible: true,
    fixed: 'left'
  },
  {
    key: 'status',
    label: 'Status',
    minWidth: 140,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'orderNos',
    label: 'Order No.',
    minWidth: 150,
    sortable: true,
    visible: true
  },
  {
    key: 'dnNo',
    label: 'DN No.',
    minWidth: 120,
    sortable: true,
    visible: true
  },
  {
    key: 'channel',
    label: 'Channel',
    minWidth: 120,
    sortable: true,
    visible: true
  },
  {
    key: 'channelName',
    label: 'Channel Name',
    minWidth: 140,
    sortable: true,
    visible: true
  },
  {
    key: 'channelSalesOrderNo',
    label: 'Channel Sales Order No.',
    minWidth: 180,
    sortable: true,
    visible: true
  },
  {
    key: 'referenceNo',
    label: 'Reference No.',
    minWidth: 140,
    sortable: true,
    visible: true
  },
  {
    key: 'warehouse',
    label: 'Warehouse',
    minWidth: 120,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'shippingCarrier',
    label: 'Shipping Carrier',
    minWidth: 140,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'trackingNumber',
    label: 'Tracking Number',
    minWidth: 160,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    minWidth: 150,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'expectedShipDate',
    label: 'Ship Date',
    minWidth: 150,
    sortable: true,
    visible: true,
    noWrap: true
  },
  {
    key: 'actualShipDate',
    label: 'Ship Date',
    minWidth: 150,
    sortable: true,
    visible: false,
    noWrap: true
  },
  {
    key: 'destination',
    label: 'Destination',
    minWidth: 150,
    visible: false,
    noWrap: true
  },
  {
    key: 'recipientName',
    label: 'Recipient Name',
    minWidth: 150,
    visible: false,
    noWrap: true
  },
  {
    key: 'recipientPhone',
    label: 'Recipient Phone',
    minWidth: 140,
    visible: false,
    noWrap: true
  },
  {
    key: 'notes',
    label: 'Notes',
    minWidth: 200,
    visible: false,
    noWrap: true
  },
  {
    key: 'updatedDate',
    label: 'Updated Date',
    minWidth: 150,
    sortable: true,
    visible: false,
    noWrap: true
  }
]

// 列接口
export interface ShippingRequestColumn {
  key: string
  label: string
  minWidth: number
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
  visible: boolean
  noWrap?: boolean
  align?: 'left' | 'right' | 'center'
}

// Shipping Request 项接口
export interface ShippingRequestItem {
  id: string
  requestNo: string
  status: ShippingRequestStatus
  isMerged: boolean // 是否为聚合请求（合并订单）
  mergedOrderCount?: number // 聚合的订单数量
  mergedRequestIds?: string[] // 合并的原始请求ID列表
  orderNos: string[] // Order No. 列表 (可能有多个)
  dnNo: string // DN No.
  channel: string // Channel
  channelName: string // Channel Name
  channelSalesOrderNo: string // Channel Sales Order No.
  referenceNo: string // Reference No.
  warehouse: string
  shippingCarrier: string
  trackingNumber: string
  totalItems: number
  totalQuantity: number
  createdDate: string
  expectedShipDate: string
  actualShipDate: string
  destination: string
  recipientName: string
  recipientPhone: string
  notes: string
  updatedDate: string
  carrierQuotes?: CarrierQuote[]              // Carrier 询价列表
  selectedQuoteId?: string                    // 选中的报价ID
  approvalStatus?: 'pending' | 'approved' | 'rejected'  // 审核状态
  approvedBy?: string                         // 审核人
  approvedDate?: string                       // 审核日期
  rejectionReason?: string                    // 拒绝原因
}

// Allocation Order 详情接口
export interface AllocationOrderDetail {
  id: string
  orderNo: string
  originalOrderNo: string // 原始订单号
  status: string
  channel: string
  channelName: string
  items: AllocationOrderItem[]
  totalQuantity: number
  allocatedDate: string
  warehouse: string
  shippingMethod: string
  recipientName: string
  recipientAddress: string
  recipientCity: string
  recipientState: string
  recipientZip: string
  recipientCountry: string
  recipientPhone: string
  recipientEmail: string
}

// Allocation Order 商品项
export interface AllocationOrderItem {
  id: string
  sku: string
  productName: string
  quantity: number
  allocatedQuantity: number
  unitPrice: number
  totalPrice: number
  imageUrl?: string
}

// Shipping Request 状态枚举 (根据 WMS 实际流程)
export enum ShippingRequestStatus {
  // 前置状态（审核流程）
  Allocated = 'allocated',                    // 已配货（审核通过后也是此状态）
  CarrierQuoting = 'carrier_quoting',         // 询价中
  PendingApproval = 'pending_approval',       // 待审核
  
  // WMS 处理流程
  WarehouseReceived = 'warehouse_received',   // 仓库已接收
  Committed = 'committed',                    // 已提交
  Planning = 'planning',                      // 计划中
  Planned = 'planned',                        // 已计划
  Picking = 'picking',                        // 拣货中
  Picked = 'picked',                          // 已拣货
  Packing = 'packing',                        // 打包中（可选）
  Packed = 'packed',                          // 已打包（可选）
  Loading = 'loading',                        // 装载中（可选）
  Loaded = 'loaded',                          // 已装载（可选）
  
  // 发货状态
  PartialShip = 'partial_ship',               // 部分发货
  Shipped = 'shipped',                        // 已发货
  InTransit = 'in_transit',                   // 运输中
  Delivered = 'delivered',                    // 已送达
  
  // 异常状态
  Exception = 'exception',                    // 异常
  Cancelled = 'cancelled'                     // 已取消
}

// Carrier 询价信息
export interface CarrierQuote {
  id: string
  carrier: string
  service: string
  method: string
  estimatedCost: number
  estimatedDays: number
  quoteDate: string
  validUntil: string
  selected: boolean
}

// 搜索条件接口
export interface SearchCondition {
  requestNos: string[]
  allocationOrderNos: string[]
  trackingNumbers: string[]
  statuses: ShippingRequestStatus[]
  warehouses: string[]
  carriers: string[]
  dateRange: {
    start: string
    end: string
  } | null
}

// 批量操作类型
export enum ShippingRequestAction {
  MergeOrders = 'mergeOrders',
  RequestQuote = 'requestQuote',              // 请求询价
  ApproveRequests = 'approveRequests',        // 批量审核通过
  RejectRequests = 'rejectRequests',          // 批量拒绝
  AssignCarrier = 'assignCarrier',
  UpdateStatus = 'updateStatus',
  PrintLabels = 'printLabels',
  ExportData = 'exportData',
  CancelRequest = 'cancelRequest'
}

