// 库存项类型
export interface InventoryItem {
  sku: string
  name: string
  location: string
  available: number
  committed: number
  onHand: number
  inbound: number
  sourceIntegration: string
  lastEvent: string
  updated: string
  hasChildren?: boolean
}

// 库存详情类型
export interface InventoryDetail {
  sku: string
  name: string
  location: string
  statusItems: StatusItem[]
  chartData: ChartDataItem[]
  eventList: EventItem[]
}

// 状态项类型
export interface StatusItem {
  label: string
  value: number
  editable: boolean
}

// 图表数据项类型
export interface ChartDataItem {
  date: string
  onHand: number
  committed: number
  available: number
  future: number
  committedFuture: number
  inbound: number
}

// 事件记录类型
export interface EventItem {
  date: string
  event: string
  onHand: number
  committed: number
  available: number
  future: number
  committedFuture: number
  inbound: number
  unavailable: number
}

// 搜索表单类型
export interface SearchForm {
  groupBySku: boolean
  sku: string
  location: string
  onHand: string
}

// 分页参数类型
export interface PaginationParams {
  page: number
  pageSize: number
  total: number
} 