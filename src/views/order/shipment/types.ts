// 运单状态枚举
export enum ShipmentStatus {
  New = 'new',
  InTransit = 'in_transit',
  Delivered = 'delivered',
  Closed = 'closed'
}

// 运单状态配置
export interface ShipmentStatusConfig {
  label: string
  value: ShipmentStatus
  color: string
  icon: string
}

// 运单数据接口
export interface ShipmentItem {
  id: string
  shipmentNo: string
  salesOrderNo: string
  truckingNo: string
  carrier: string
  status: ShipmentStatus
  channel: string
  channelName: string
  dispatchedNo: string
  channelSalesOrderNo: string
  shipDate: string
  recipient: {
    name: string
    address: string
    phone: string
    email: string
  }
  sender: {
    name: string
    address: string
    phone: string
  }
  packageInfo: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    value: number
    description: string
  }
  timeline: ShipmentEvent[]
  createDate: string
  updateDate: string
  estimatedDelivery?: string
  actualDelivery?: string
  notes?: string
}

// 运单事件/时间线
export interface ShipmentEvent {
  id: string
  timestamp: string
  status: ShipmentStatus
  location: string
  description: string
  operator?: string
}

// 创建运单的表单数据
export interface CreateShipmentForm {
  salesOrderNo: string
  truckingNo: string
  carrier: string
  channel: string
  channelName: string
  dispatchedNo: string
  channelSalesOrderNo: string
  shipDate: string
  recipient: {
    name: string
    address: string
    phone: string
    email: string
  }
  packageInfo: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    value: number
    description: string
  }
  notes?: string
}

// 运单状态配置
export const SHIPMENT_STATUS_CONFIG: Record<ShipmentStatus, ShipmentStatusConfig> = {
  [ShipmentStatus.New]: {
    label: '新建',
    value: ShipmentStatus.New,
    color: '#909399',
    icon: 'Plus'
  },
  [ShipmentStatus.InTransit]: {
    label: '运输中',
    value: ShipmentStatus.InTransit,
    color: '#409EFF',
    icon: 'Van'
  },
  [ShipmentStatus.Delivered]: {
    label: '已签收',
    value: ShipmentStatus.Delivered,
    color: '#67C23A',
    icon: 'Check'
  },
  [ShipmentStatus.Closed]: {
    label: '已关闭',
    value: ShipmentStatus.Closed,
    color: '#F56C6C',
    icon: 'Close'
  }
}

// 承运商选项
export const CARRIER_OPTIONS = [
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'dhl', label: 'DHL' },
  { value: 'usps', label: 'USPS' },
  { value: 'other', label: '其他' }
]

// 查询筛选条件
export interface ShipmentFilter {
  shipmentNo?: string
  salesOrderNo?: string
  truckingNo?: string
  status?: ShipmentStatus[]
  carrier?: string[]
  dateRange?: [string, string]
  recipient?: string
} 