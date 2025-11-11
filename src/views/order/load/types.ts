export interface Load {
  id?: string
  loadNo: string
  mode: string
  customer?: string
  customerId?: string
  carrier?: string
  carrierId?: string
  freightTerm?: string
  loadType?: string
  appointmentTime?: string
  longHaul?: boolean
  proNo?: string
  retailerAuthorization?: string
  tmsShipmentId?: string
  desiredShipDate?: string
  freightCost?: number
  routingRequestDate?: string
  routingReceiptDate?: string
  trailerPickUpMode?: string
  adjustedPalletQty?: number
  shipFrom?: Address
  shipTo?: Address
  billTo?: Address
  note?: string
  orderLines: OrderLine[]
  status?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  // 各阶段字段
  // ASSIGNED 阶段 (调度阶段)
  dispatchTime?: string
  driverName?: string
  truckNo?: string
  trailerNo?: string
  equipment?: string
  // CHECKIN 阶段 (签到阶段)
  driverCheckinTime?: string
  gateInTime?: string
  dockNo?: string
  gateInOperator?: string
  checkInWarehouse?: string
  vehicleInfo?: VehicleInfo
  // LOADING 阶段 (装载阶段)
  loadingStartTime?: string
  shipmentIds?: string[]
  plannedPalletQty?: number
  plannedWeight?: number
  // LOADED 阶段 (装载完成阶段)
  bolNo?: string
  sealNo?: string
  actualPalletQty?: number
  actualWeight?: number
  loadCompleteTime?: string
  loadSequence?: LoadSequence[]
  loadExceptions?: LoadException[]
  bolInfo?: BillOfLading
  signedBOLFileUrl?: string
  // SHIPPED 阶段 (发运阶段)
  gateOutTime?: string
  trackingNo?: string
  departureTime?: string
  driverInfo?: DriverInfo
  estimatedDeliveryDate?: string
  // DELIVERED 阶段 (交付阶段)
  deliveredTime?: string
  receivedBy?: string
  receivedQty?: number
  podFileUrl?: string
  deliveryConfirmation?: DeliveryConfirmation
  // CLOSED 阶段 (关单阶段)
  closeTime?: string
  closedBy?: string
  finalFreightCost?: number
  invoiceNo?: string
  billingStatus?: BillingStatus
  // CANCELLED 阶段 (取消阶段)
  cancelReason?: string
  cancelTime?: string
  cancelOperator?: string
  // 状态历史
  statusHistory?: LoadStatusHistory[]
  // 关联的 Shipping Request IDs
  shippingRequestIds?: string[]
}

export interface VehicleInfo {
  licensePlate?: string
  trailerNo?: string
  vehicleType?: string
}

export interface DriverInfo {
  name?: string
  phone?: string
  licenseNo?: string
}

export interface LoadSequence {
  orderLineId: string
  sequence: number
  position?: string
}

export interface LoadException {
  type: string
  description: string
  action?: string
}

export interface DeliveryConfirmation {
  delivered: boolean
  deliveryDate?: string
  signedBy?: string
  signature?: string
}

export interface BillingStatus {
  invoiced: boolean
  invoiceNo?: string
  invoiceDate?: string
  paid: boolean
  paidDate?: string
}

// Bill of Lading (BOL) 完整信息
export interface BillOfLading {
  // 基本信息
  bolNumber: string
  sealNumber?: string
  bolDate?: string
  proNumber?: string
  
  // 发货人信息
  shipperName?: string
  shipperAddress?: Address
  shipperContact?: string
  shipperPhone?: string
  
  // 收货人信息
  consigneeName?: string
  consigneeAddress?: Address
  consigneeContact?: string
  consigneePhone?: string
  
  // 承运商信息
  carrierName?: string
  carrierMCNumber?: string
  carrierDOTNumber?: string
  
  // 地址信息
  originAddress?: Address
  destinationAddress?: Address
  
  // 日期信息
  shipDate?: string
  requestedDeliveryDate?: string
  estimatedDeliveryDate?: string
  
  // 运费信息
  freightTerms?: string
  freightCharges?: number
  currency?: string
  
  // 设备信息
  equipmentType?: string
  truckNumber?: string
  trailerNumber?: string
  containerNumber?: string
  
  // 司机信息
  driverName?: string
  driverPhone?: string
  driverLicense?: string
  
  // 货物信息
  goodsDescription?: string
  commodityCode?: string
  numberOfPieces?: number
  palletQuantity?: number
  weight?: number
  weightUnit?: string
  volume?: number
  volumeUnit?: string
  
  // 特殊说明
  specialInstructions?: string
  handlingInstructions?: string
  temperatureControl?: string
  
  // 签名信息
  shipperSignature?: string
  shipperSignatureDate?: string
  carrierSignature?: string
  carrierSignatureDate?: string
  consigneeSignature?: string
  consigneeSignatureDate?: string
  
  // 文件
  signedBOLFileUrl?: string
  bolTemplateUrl?: string
}

export interface LoadStatusHistory {
  id?: string
  status: string
  changedBy: string
  changedAt: string
  reason?: string
  note?: string
}

export interface Address {
  name?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  phone?: string
  email?: string
}

export interface OrderLine {
  id?: string
  sequence?: number
  orderNo: string
  requestNo?: string
  dnNo?: string
  customer?: string
  channel?: string
  referenceNo?: string
  purchaseOrderNo?: string
  shipTo?: string
  deliveryRequestDate?: string
  warehouse?: string
  carrier?: string
  trackingNumber?: string
  totalItems?: number
  totalQuantity?: number
  recipientName?: string
  recipientPhone?: string
  status?: string
  proNo?: string
  items?: OrderItem[]
}

export interface OrderItem {
  id?: string
  sku?: string
  productName?: string
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  warehouse?: string
}

export interface LoadSearchParams {
  loadNo?: string
  customer?: string
  carrier?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface LoadListResponse {
  data: Load[]
  total: number
  page: number
  pageSize: number
}

export const LOAD_MODES = [
  { label: 'CUSTOMER ROUTING', value: 'CUSTOMER_ROUTING' },
  { label: 'PREPAID', value: 'PREPAID' },
  { label: 'COLLECT', value: 'COLLECT' }
]

export const LOAD_TYPES = [
  { label: 'LTL', value: 'LTL' },
  { label: 'FTL', value: 'FTL' },
  { label: 'PARCEL', value: 'PARCEL' }
]

export const TRAILER_PICKUP_MODES = [
  { label: 'LIVE LOAD', value: 'LIVE_LOAD' },
  { label: 'DROP TRAILER', value: 'DROP_TRAILER' }
]

export const FREIGHT_TERMS = [
  { label: 'PREPAID', value: 'PREPAID' },
  { label: 'COLLECT', value: 'COLLECT' },
  { label: 'THIRD PARTY', value: 'THIRD_PARTY' },
  { label: 'PREPAID AND CHARGE', value: 'PREPAID_AND_CHARGE' },
  { label: 'COLLECT AND CHARGE', value: 'COLLECT_AND_CHARGE' }
]

export const LOAD_STATUS = [
  { label: 'New', value: 'NEW', color: 'info' },
  { label: 'Assigned', value: 'ASSIGNED', color: 'primary' },
  { label: 'Check In', value: 'CHECKIN', color: 'primary' },
  { label: 'Loading', value: 'LOADING', color: 'warning' },
  { label: 'Loaded', value: 'LOADED', color: 'success' },
  { label: 'Shipped', value: 'SHIPPED', color: 'success' },
  { label: 'Delivered', value: 'DELIVERED', color: 'success' },
  { label: 'Closed', value: 'CLOSED', color: 'success' },
  { label: 'Cancelled', value: 'CANCELLED', color: 'danger' }
]

// 状态流转规则
export const LOAD_STATUS_TRANSITIONS: Record<string, string[]> = {
  'NEW': ['ASSIGNED', 'CANCELLED'],
  'ASSIGNED': ['CHECKIN', 'CANCELLED'],
  'CHECKIN': ['LOADING', 'CANCELLED'],
  'LOADING': ['LOADED', 'CANCELLED'],
  'LOADED': ['SHIPPED', 'CANCELLED'],
  'SHIPPED': ['DELIVERED'],
  'DELIVERED': ['CLOSED'],
  'CLOSED': [],
  'CANCELLED': []
}

// 状态对应的操作按钮配置
export interface StatusAction {
  command: string
  label: string
  type?: 'primary' | 'danger' | 'warning' | 'info'
  divided?: boolean
  condition?: (load: any) => boolean
}

export const STATUS_ACTIONS: Record<string, StatusAction[]> = {
  'NEW': [
    { command: 'edit', label: 'Edit' },
    { command: 'status:ASSIGNED', label: 'Assign Carrier' },
    { command: 'delete', label: 'Delete', type: 'danger' },
    { command: 'status:CANCELLED', label: 'Cancel', type: 'danger', divided: true }
  ],
  'ASSIGNED': [
    { command: 'edit', label: 'Edit' },
    { command: 'status:CHECKIN', label: 'Start Check-in' },
    { command: 'reassign', label: 'Reassign Carrier' },
    { command: 'status:CANCELLED', label: 'Cancel', type: 'danger', divided: true }
  ],
  'CHECKIN': [
    { command: 'status:LOADING', label: 'Start Loading' },
    { command: 'editDriver', label: 'Edit Driver Info' },
    { command: 'uploadGateDoc', label: 'Upload Gate Doc' },
    { command: 'status:CANCELLED', label: 'Cancel', type: 'danger', divided: true }
  ],
  'LOADING': [
    { command: 'status:LOADED', label: 'Complete Loading' },
    { command: 'editLoadDetails', label: 'Edit Load Details' },
    { command: 'uploadBOL', label: 'Upload BOL' },
    { command: 'status:CANCELLED', label: 'Cancel', type: 'danger', divided: true }
  ],
  'LOADED': [
    { command: 'status:SHIPPED', label: 'Ship' },
    { command: 'editBOL', label: 'Edit BOL' },
    { command: 'previewBOL', label: 'Preview BOL' },
    { command: 'downloadBOL', label: 'Download BOL' },
    { command: 'uploadSignedBOL', label: 'Upload Signed BOL' },
    { command: 'uploadSealDoc', label: 'Upload Seal / Doc' },
    { command: 'status:CANCELLED', label: 'Cancel', type: 'danger', divided: true }
  ],
  'SHIPPED': [
    { command: 'status:DELIVERED', label: 'Mark Delivered' },
    { command: 'previewBOL', label: 'Preview BOL' },
    { command: 'downloadBOL', label: 'Download BOL' },
    { command: 'uploadSignedBOL', label: 'Upload Signed BOL' },
    { command: 'uploadPOD', label: 'Upload POD' },
    { command: 'editTracking', label: 'Edit Tracking Info' }
  ],
  'DELIVERED': [
    { command: 'status:CLOSED', label: 'Close Load' },
    { command: 'editFreight', label: 'Edit Freight Info' },
    { command: 'uploadInvoice', label: 'Upload Invoice' }
  ],
  'CLOSED': [
    { command: 'view', label: 'View Details' },
    { command: 'exportDocs', label: 'Export BOL / POD' }
  ],
  'CANCELLED': [
    { command: 'view', label: 'View Details' },
    { command: 'reopen', label: 'Reopen' }
  ]
}

export const LOAD_STATUS_MAP: Record<string, { label: string; color: string }> = {
  'NEW': { label: 'New', color: 'info' },
  'ASSIGNED': { label: 'Assigned', color: 'primary' },
  'CHECKIN': { label: 'Check In', color: 'primary' },
  'LOADING': { label: 'Loading', color: 'warning' },
  'LOADED': { label: 'Loaded', color: 'success' },
  'SHIPPED': { label: 'Shipped', color: 'success' },
  'DELIVERED': { label: 'Delivered', color: 'success' },
  'CLOSED': { label: 'Closed', color: 'success' },
  'CANCELLED': { label: 'Cancelled', color: 'danger' }
}

