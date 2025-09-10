// 平台类型
export type PlatformType = 'shein' | 'amazon' | 'shopify' | 'local'

// 分类来源
export type CategorySource = 'local' | 'platform'

// 分类状态
export type CategoryStatus = 'active' | 'inactive' | 'pending' | 'deleted'

// 映射状态
export type MappingStatus = 'mapped' | 'unmapped' | 'pending' | 'invalid'

// 更新操作类型
export type UpdateActionType = 'create' | 'update' | 'delete' | 'sync' | 'mapping' | 'import'

// 平台分类信息
export interface PlatformCategory {
  id: string
  name: string
  platform: PlatformType
  originalId: string
  path: string
  level: number
  parentId: string | null
  children?: string[]
  properties?: Record<string, any>
  lastSyncTime: string
  status: CategoryStatus
}

// 分类映射关系
export interface CategoryMapping {
  id: string
  localCategoryId: string
  platformCategoryId: string
  platform: PlatformType
  status: MappingStatus
  createTime: string
  updateTime: string
  operator: string
  autoMapped: boolean
  confidence?: number
  lastSyncTime?: string
  syncStatus?: 'success' | 'failed' | 'pending'
  syncMessage?: string
}

// 分类更新记录
export interface CategoryUpdateLog {
  id: string
  categoryId: string
  action: UpdateActionType
  timestamp: string
  operator: string
  details: string
  platformInfo?: {
    platform: PlatformType
    categoryId?: string
    categoryName?: string
    action: string
    status: 'success' | 'failed'
    message?: string
  }
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
}

// 本地分类
export interface LocalCategory {
  id: string
  name: string
  code: string
  level: number
  path: string
  parentId: string | null
  children?: string[]
  status: CategoryStatus
  source: CategorySource
  createTime: string
  updateTime: string
  operator: string
  description?: string
  properties?: Record<string, any>
  mappings?: CategoryMapping[]
  updateLogs?: CategoryUpdateLog[]
  meta?: {
    productCount?: number
    childrenCount?: number
    mappedPlatforms?: PlatformType[]
  }
}

// 分类树节点（用于树形展示）
export interface CategoryTreeNode {
  id: string
  name: string
  platform: PlatformType
  originalId: string
  parentId: string | null
  children?: CategoryTreeNode[]
  isLeaf?: boolean
  level: number
  status: CategoryStatus
  mappings?: CategoryMapping[]
  meta?: {
    productCount?: number
    childrenCount?: number
    hasMapping?: boolean
    mappedPlatforms?: PlatformType[]
  }
}

// API响应类型
export interface CategoryResponse {
  id: string
  name: string
  platform?: PlatformType
  originalId?: string
  parentId: string | null
  status: CategoryStatus
  children?: CategoryResponse[]
  mappings?: CategoryMapping[]
  meta?: {
    productCount?: number
    childrenCount?: number
    mappedPlatforms?: PlatformType[]
  }
}

// 分类查询参数
export interface CategoryQueryParams {
  keyword?: string
  platform?: PlatformType
  status?: CategoryStatus
  source?: CategorySource
  mappingStatus?: MappingStatus
  startTime?: string
  endTime?: string
  operator?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分类统计信息
export interface CategoryStats {
  total: number
  mapped: number
  unmapped: number
  pending: number
  byPlatform: Record<PlatformType, {
    total: number
    mapped: number
    unmapped: number
    pending: number
  }>
  byStatus: Record<CategoryStatus, number>
  lastSyncTime?: string
  syncStatus?: 'success' | 'failed' | 'pending'
}
