export interface LoadPlan {
  id?: string
  planNo: string
  planName?: string
  customer?: string
  customerId?: string
  carrier?: string
  carrierId?: string
  mode?: string
  loadType?: string
  status?: string
  plannedShipDate?: string
  plannedDeliveryDate?: string
  shipFrom?: Address
  shipTo?: Address
  billTo?: Address
  freightTerm?: string
  estimatedFreightCost?: number
  plannedPalletQty?: number
  plannedWeight?: number
  plannedVolume?: number
  orderLines?: OrderLine[]
  note?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  // 计划执行相关
  executionStatus?: string
  actualShipDate?: string
  actualDeliveryDate?: string
  loadIds?: string[] // 关联的实际Load IDs
  // 计划规则
  planningRules?: PlanningRule[]
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

// 规划规则配置
export interface PlanningRule {
  id?: string
  name: string
  enabled: boolean
  priority: number
  description?: string
  // 订单筛选条件
  orderFilters: OrderFilterRule
  // 分组规则
  groupingRules: GroupingRule
  // 计划生成规则
  planRules: PlanGenerationRule
  // 自动执行规则
  autoExecute?: boolean
  autoApprove?: boolean
  createdAt?: string
  updatedAt?: string
}

// 订单筛选规则
export interface OrderFilterRule {
  // 客户筛选
  customers?: string[]
  // 仓库筛选
  warehouses?: string[]
  // 承运商筛选
  carriers?: string[]
  // 渠道筛选
  channels?: string[]
  // 地址筛选
  shipToRegions?: string[] // 州/省
  shipToCities?: string[]
  shipToZipCodes?: string[] // 邮编
  // 日期范围
  deliveryDateRange?: {
    daysFromNow: number // 从今天起多少天内
    maxDays?: number // 最多多少天
  }
  createdDateRange?: {
    daysFromNow: number
    maxDays?: number
  }
  // 订单状态
  orderStatuses?: string[]
  // 数量范围
  minOrderQuantity?: number
  maxOrderQuantity?: number
  // 金额范围
  minOrderAmount?: number
  maxOrderAmount?: number
  // SKU 筛选
  skuCategories?: string[]
  skuBrands?: string[]
  skuList?: string[] // 具体 SKU 列表
  // 订单标签
  orderTags?: string[]
  // 排除条件
  excludeCustomers?: string[]
  excludeCarriers?: string[]
  excludeWarehouses?: string[]
  // 自定义表达式
  customExpression?: string
}

// 分组规则
export interface GroupingRule {
  // 分组方式
  groupBy: 'customer' | 'carrier' | 'warehouse' | 'destination' | 'deliveryDate' | 'custom'
  // 自定义分组字段
  customGroupFields?: string[]
  // 每组最大订单数
  maxOrdersPerGroup?: number
  // 每组最大重量（kg）
  maxWeightPerGroup?: number
  // 每组最大体积（m³）
  maxVolumePerGroup?: number
  // 每组最大托盘数
  maxPalletsPerGroup?: number
  // 是否允许跨客户分组（仅当 groupBy 为其他时）
  allowCrossCustomer?: boolean
}

// 计划生成规则
export interface PlanGenerationRule {
  // 默认模式
  defaultMode: 'CENTRAL' | 'CUSTOMER'
  // 默认 Load Type
  defaultLoadType: 'LTL' | 'FTL' | 'PARCEL'
  // 默认 Freight Term
  defaultFreightTerm?: string
  // 自动选择承运商规则
  carrierSelectionRule?: {
    type: 'auto' | 'preferred' | 'cheapest' | 'fastest'
    preferredCarriers?: string[]
  }
  // 计划名称模板
  planNameTemplate?: string // 例如: "Plan - {customer} - {date}"
  // 自动计算运费
  autoCalculateFreight?: boolean
  // 计划日期规则
  planDateRule?: {
    shipDateOffset: number // 计划发货日期偏移（天数）
    deliveryDateOffset: number // 计划送达日期偏移（天数）
  }
}

export interface LoadPlanSearchParams {
  planNo?: string
  planName?: string
  customerId?: string
  carrierId?: string
  mode?: string
  loadType?: string
  status?: string
  plannedShipDateRange?: [Date, Date] | null
  plannedDeliveryDateRange?: [Date, Date] | null
  createdDateRange?: [Date, Date] | null
  shipFromCity?: string
  shipToCity?: string
  page?: number
  pageSize?: number
}

export interface LoadPlanListResponse {
  data: LoadPlan[]
  total: number
  page: number
  pageSize: number
}

export const LOAD_PLAN_MODES = [
  { 
    label: 'CENTRAL', 
    value: 'CENTRAL',
    description: 'Can select orders from same terminal, different customers'
  },
  { 
    label: 'CUSTOMER', 
    value: 'CUSTOMER',
    description: 'Can only select orders from current customer'
  }
]

export const LOAD_PLAN_TYPES = [
  { label: 'LTL', value: 'LTL' },
  { label: 'FTL', value: 'FTL' },
  { label: 'PARCEL', value: 'PARCEL' }
]

export const FREIGHT_TERMS = [
  { label: 'PREPAID', value: 'PREPAID' },
  { label: 'COLLECT', value: 'COLLECT' },
  { label: 'THIRD PARTY', value: 'THIRD_PARTY' },
  { label: 'PREPAID AND CHARGE', value: 'PREPAID_AND_CHARGE' },
  { label: 'COLLECT AND CHARGE', value: 'COLLECT_AND_CHARGE' }
]

// 状态流转：PLANNING -> PLANNED -> CONFIRMED（生成Load）-> 完成
// 或任意状态 -> CANCELLED
// 4个状态，流程清晰
export const LOAD_PLAN_STATUS = [
  { label: 'Planning', value: 'PLANNING', color: 'info' },
  { label: 'Planned', value: 'PLANNED', color: 'primary' },
  { label: 'Confirmed', value: 'CONFIRMED', color: 'success' },
  { label: 'Cancelled', value: 'CANCELLED', color: 'danger' }
]

export const LOAD_PLAN_STATUS_MAP: Record<string, { label: string; color: string }> = {
  'PLANNING': { label: 'Planning', color: 'info' },
  'PLANNED': { label: 'Planned', color: 'primary' },
  'CONFIRMED': { label: 'Confirmed', color: 'success' },
  'CANCELLED': { label: 'Cancelled', color: 'danger' }
}

export const EXECUTION_STATUS = [
  { label: 'Not Started', value: 'NOT_STARTED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Partial', value: 'PARTIAL' },
  { label: 'Completed', value: 'COMPLETED' }
]

