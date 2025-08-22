// 安全库存设置类型定义

// 设置级别枚举
export enum SafetyStockLevel {
  GLOBAL = 'global',      // 全局级别
  CHANNEL = 'channel',    // 渠道级别
  STORE = 'store',        // 店铺级别
  SKU = 'sku'            // SKU级别
}

// 安全库存设置状态
export enum SafetyStockStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// 库存预警类型
export enum AlertType {
  LOW_STOCK = 'low_stock',      // 低库存预警
  OUT_OF_STOCK = 'out_of_stock' // 缺货预警
}

// 渠道选择类型
export enum ChannelScopeType {
  ALL = 'all',           // 全部渠道
  SPECIFIC = 'specific'  // 指定渠道
}

// 店铺选择类型
export enum StoreScopeType {
  ALL = 'all',           // 渠道下全部店铺
  SPECIFIC = 'specific'  // 指定店铺
}

// 履约扣减类型
export enum FulfillmentDeductionType {
  UNIFIED = 'unified',         // 统一扣减
  PER_WAREHOUSE = 'per_warehouse'  // 每个仓库单独扣减
}

// 基础安全库存配置接口
export interface BaseSafetyStockConfig {
  id?: string
  level: SafetyStockLevel
  status: SafetyStockStatus
  minStockQuantity: number        // 最低安全库存数量
  alertType: AlertType[]         // 预警类型
  alertThreshold: number         // 预警阈值百分比
  maxStockQuantity?: number      // 最大库存数量
  disableWmsSync?: boolean       // WMS寻仓时不扣减安全库存
  disableThirdPartySync?: boolean // 第三方同步时不扣减安全库存
  description?: string           // 描述
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

// 渠道级别安全库存配置
export interface ChannelSafetyStockConfig extends BaseSafetyStockConfig {
  level: SafetyStockLevel.CHANNEL
  channelId: string
  channelName?: string
  channelType?: string
  priority?: number              // 优先级
}

// 店铺级别安全库存配置
export interface StoreSafetyStockConfig extends BaseSafetyStockConfig {
  level: SafetyStockLevel.STORE
  storeId: string
  storeName?: string
  channelId?: string            // 所属渠道
  channelName?: string
  warehouseId?: string          // 关联仓库
  warehouseName?: string
  priority?: number             // 优先级
}

// SKU级别安全库存配置
export interface SkuSafetyStockConfig extends BaseSafetyStockConfig {
  level: SafetyStockLevel.SKU
  sku: string
  productId?: string
  productName?: string
  storeId?: string              // 指定店铺（可选）
  storeName?: string
  channelId?: string            // 指定渠道（可选）
  channelName?: string
  warehouseId?: string          // 指定仓库（可选）
  warehouseName?: string
  category?: string             // 产品分类
  brand?: string               // 品牌
  priority?: number            // 优先级
}

// 全局默认安全库存配置
export interface GlobalSafetyStockConfig extends BaseSafetyStockConfig {
  level: SafetyStockLevel.GLOBAL
  isDefault: true
}

// 灵活安全库存配置（新的设计）
export interface FlexibleSafetyStockConfig {
  id?: string
  name: string                        // 配置名称
  status: SafetyStockStatus
  
  // 渠道范围设置
  channelScope: ChannelScopeType      // all | specific
  channelIds?: string[]               // 当channelScope为specific时的渠道ID列表
  channelNames?: string[]             // 渠道名称（用于显示）
  
  // 店铺范围设置
  storeScope: StoreScopeType          // all | specific
  storeIds?: string[]                 // 当storeScope为specific时的店铺ID列表
  storeNames?: string[]               // 店铺名称（用于显示）
  
  // 特殊SKU设置
  specialSkus?: string[]              // 特殊处理的SKU列表
  specialSkuConfigs?: {               // SKU特殊配置
    [sku: string]: {
      minStockQuantity: number
      minStockType?: 'quantity' | 'percentage' // 最小库存类型
      maxStockQuantity?: number
      maxStockType?: 'quantity' | 'percentage' // 最大库存类型
      alertType: AlertType[]
      alertThreshold: number
      disableWmsSync?: boolean       // WMS寻仓时不扣减安全库存
      disableThirdPartySync?: boolean // 第三方同步时不扣减安全库存
    }
  }
  
  // 基础配置（适用于非特殊SKU）
  minStockQuantity: number
  minStockType?: 'quantity' | 'percentage' // 最小库存类型
  maxStockQuantity?: number
  maxStockType?: 'quantity' | 'percentage' // 最大库存类型
  alertType: AlertType[]
  alertThreshold: number
  deductions?: ('unified_fulfillment' | 'per_warehouse_fulfillment' | 'sync')[]  // 扣减设置
  
  // 其他信息
  priority?: number
  description?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

// 联合类型
export type SafetyStockConfig = 
  | GlobalSafetyStockConfig
  | ChannelSafetyStockConfig 
  | StoreSafetyStockConfig
  | SkuSafetyStockConfig
  | FlexibleSafetyStockConfig

// 安全库存查询参数
export interface SafetyStockQueryParams {
  level?: SafetyStockLevel
  status?: SafetyStockStatus
  channelId?: string
  storeId?: string
  sku?: string
  keyword?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 安全库存查询响应
export interface SafetyStockQueryResponse {
  data: SafetyStockConfig[]
  total: number
  page: number
  pageSize: number
}

// 安全库存批量操作
export interface SafetyStockBatchOperation {
  action: 'create' | 'update' | 'delete' | 'enable' | 'disable'
  ids: string[]
  data?: Partial<SafetyStockConfig>
}

// 安全库存创建请求
export interface SafetyStockCreateRequest {
  level: SafetyStockLevel
  configs: Partial<SafetyStockConfig>[]
}

// 安全库存更新请求
export interface SafetyStockUpdateRequest {
  id: string
  data: Partial<SafetyStockConfig>
}

// 库存预警记录
export interface StockAlert {
  id: string
  configId: string            // 关联的安全库存配置ID
  level: SafetyStockLevel
  alertType: AlertType
  sku: string
  productName?: string
  currentStock: number
  safetyStock: number
  deficit: number             // 缺货数量（相对于安全库存的差值）
  storeId?: string
  storeName?: string
  channelId?: string
  channelName?: string
  warehouseId?: string
  warehouseName?: string
  alertTime: string
  status: 'new' | 'acknowledged' | 'resolved'
  resolvedTime?: string
  resolvedBy?: string
  notes?: string
}

// 库存预警查询参数
export interface StockAlertQueryParams {
  level?: SafetyStockLevel
  alertType?: AlertType
  status?: 'new' | 'acknowledged' | 'resolved'
  storeId?: string
  channelId?: string
  sku?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

// 安全库存统计数据
export interface SafetyStockStats {
  totalConfigs: number
  activeConfigs: number
  inactiveConfigs: number
  configsByLevel: {
    [K in SafetyStockLevel]: number
  }
  alertsCount: {
    total: number
    new: number
    acknowledged: number
    resolved: number
  }
  lowStockItems: number
  outOfStockItems: number
}

// 渠道选项
export interface ChannelOption {
  id: string
  name: string
  type: string
  status: string
}

// 店铺选项
export interface StoreOption {
  id: string
  name: string
  channelId: string
  channelName: string
  status: string
}

// 仓库选项
export interface WarehouseOption {
  id: string
  name: string
  code: string
  address: string
  status: string
}

// 产品SKU选项
export interface SkuOption {
  sku: string
  productId: string
  productName: string
  category: string
  brand: string
  status: string
}
