export interface PlatformMapping {
  platformId: string
  platformName: string // 'shein' | 'amazon' | 'shopify' etc.
  platformCategoryId: string
  platformCategoryName: string
  mappingStatus: 'mapped' | 'unmapped' | 'pending'
  lastSyncTime?: string
}

export interface CategoryUpdateLog {
  id: number
  categoryId: number
  updateType: 'create' | 'update' | 'delete' | 'sync' | 'mapping'
  updateTime: string
  operator: string
  details: string
  platformInfo?: {
    platform: string
    action: string
    status: string
  }
}

export interface CategoryData {
  id: number
  name: string
  parentId: number | null
  sort: number
  status: number
  children?: CategoryData[]
  platformMappings?: PlatformMapping[]
  source: 'local' | 'platform'
  sourceDetails?: {
    platform: string
    originalId: string
    syncTime: string
  }
  createTime: string
  updateTime: string
  lastSyncTime?: string
  updateLogs?: CategoryUpdateLog[]
}
