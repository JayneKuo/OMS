import request from '@/utils/request'
import type {
  SafetyStockConfig,
  SafetyStockQueryParams,
  SafetyStockQueryResponse,
  SafetyStockCreateRequest,
  SafetyStockUpdateRequest,
  SafetyStockBatchOperation,
  StockAlert,
  StockAlertQueryParams,
  SafetyStockStats,
  ChannelOption,
  StoreOption,
  WarehouseOption,
  SkuOption
} from '@/types/safetyStock'

// 安全库存配置相关API
export const safetyStockApi = {
  // 查询安全库存配置列表
  getSafetyStockConfigs(params: SafetyStockQueryParams): Promise<SafetyStockQueryResponse> {
    return request({
      url: '/api/safety-stock/configs',
      method: 'get',
      params
    })
  },

  // 根据ID获取安全库存配置详情
  getSafetyStockConfig(id: string): Promise<SafetyStockConfig> {
    return request({
      url: `/api/safety-stock/configs/${id}`,
      method: 'get'
    })
  },

  // 创建安全库存配置
  createSafetyStockConfig(data: SafetyStockCreateRequest): Promise<SafetyStockConfig[]> {
    return request({
      url: '/api/safety-stock/configs',
      method: 'post',
      data
    })
  },

  // 更新安全库存配置
  updateSafetyStockConfig(data: SafetyStockUpdateRequest): Promise<SafetyStockConfig> {
    return request({
      url: `/api/safety-stock/configs/${data.id}`,
      method: 'put',
      data: data.data
    })
  },

  // 删除安全库存配置
  deleteSafetyStockConfig(id: string): Promise<void> {
    return request({
      url: `/api/safety-stock/configs/${id}`,
      method: 'delete'
    })
  },

  // 批量操作安全库存配置
  batchOperateSafetyStockConfig(data: SafetyStockBatchOperation): Promise<void> {
    return request({
      url: '/api/safety-stock/configs/batch',
      method: 'post',
      data
    })
  },

  // 启用/禁用安全库存配置
  toggleSafetyStockConfig(id: string, status: 'active' | 'inactive'): Promise<void> {
    return request({
      url: `/api/safety-stock/configs/${id}/toggle`,
      method: 'patch',
      data: { status }
    })
  },

  // 复制安全库存配置
  copySafetyStockConfig(id: string, data: Partial<SafetyStockConfig>): Promise<SafetyStockConfig> {
    return request({
      url: `/api/safety-stock/configs/${id}/copy`,
      method: 'post',
      data
    })
  }
}

// 库存预警相关API
export const stockAlertApi = {
  // 查询库存预警列表
  getStockAlerts(params: StockAlertQueryParams): Promise<{ data: StockAlert[], total: number }> {
    return request({
      url: '/api/safety-stock/alerts',
      method: 'get',
      params
    })
  },

  // 获取库存预警详情
  getStockAlert(id: string): Promise<StockAlert> {
    return request({
      url: `/api/safety-stock/alerts/${id}`,
      method: 'get'
    })
  },

  // 确认库存预警
  acknowledgeStockAlert(id: string, notes?: string): Promise<void> {
    return request({
      url: `/api/safety-stock/alerts/${id}/acknowledge`,
      method: 'patch',
      data: { notes }
    })
  },

  // 解决库存预警
  resolveStockAlert(id: string, notes?: string): Promise<void> {
    return request({
      url: `/api/safety-stock/alerts/${id}/resolve`,
      method: 'patch',
      data: { notes }
    })
  },

  // 批量处理库存预警
  batchHandleStockAlerts(ids: string[], action: 'acknowledge' | 'resolve', notes?: string): Promise<void> {
    return request({
      url: '/api/safety-stock/alerts/batch',
      method: 'post',
      data: { ids, action, notes }
    })
  }
}

// 统计数据相关API
export const safetyStockStatsApi = {
  // 获取安全库存统计数据
  getSafetyStockStats(): Promise<SafetyStockStats> {
    return request({
      url: '/api/safety-stock/stats',
      method: 'get'
    })
  },

  // 获取库存趋势数据
  getStockTrend(params: {
    dateFrom?: string
    dateTo?: string
    level?: string
    storeId?: string
    channelId?: string
  }): Promise<any> {
    return request({
      url: '/api/safety-stock/trend',
      method: 'get',
      params
    })
  }
}

// 基础数据相关API
export const safetyStockBaseApi = {
  // 获取渠道列表
  getChannels(): Promise<ChannelOption[]> {
    return request({
      url: '/api/safety-stock/channels',
      method: 'get'
    })
  },

  // 获取店铺列表
  getStores(channelId?: string): Promise<StoreOption[]> {
    return request({
      url: '/api/safety-stock/stores',
      method: 'get',
      params: { channelId }
    })
  },

  // 获取仓库列表
  getWarehouses(): Promise<WarehouseOption[]> {
    return request({
      url: '/api/safety-stock/warehouses',
      method: 'get'
    })
  },

  // 搜索SKU
  searchSkus(params: {
    keyword?: string
    storeId?: string
    channelId?: string
    page?: number
    pageSize?: number
  }): Promise<{ data: SkuOption[], total: number }> {
    return request({
      url: '/api/safety-stock/skus/search',
      method: 'get',
      params
    })
  },

  // 根据SKU获取产品信息
  getSkuInfo(sku: string, storeId?: string): Promise<SkuOption> {
    return request({
      url: `/api/safety-stock/skus/${sku}`,
      method: 'get',
      params: { storeId }
    })
  },

  // 验证SKU存在性
  validateSku(sku: string, storeId?: string): Promise<{ exists: boolean, info?: SkuOption }> {
    return request({
      url: `/api/safety-stock/skus/${sku}/validate`,
      method: 'get',
      params: { storeId }
    })
  },

  // 获取当前库存数量
  getCurrentStock(sku: string, storeId?: string, warehouseId?: string): Promise<{
    sku: string
    currentStock: number
    availableStock: number
    reservedStock: number
    inTransitStock: number
    lastUpdated: string
  }> {
    return request({
      url: `/api/safety-stock/skus/${sku}/current-stock`,
      method: 'get',
      params: { storeId, warehouseId }
    })
  }
}

// 导入导出相关API
export const safetyStockImportExportApi = {
  // 导出安全库存配置
  exportSafetyStockConfigs(params: SafetyStockQueryParams): Promise<Blob> {
    return request({
      url: '/api/safety-stock/configs/export',
      method: 'get',
      params,
      responseType: 'blob'
    })
  },

  // 下载导入模板
  downloadImportTemplate(level: string): Promise<Blob> {
    return request({
      url: '/api/safety-stock/configs/import-template',
      method: 'get',
      params: { level },
      responseType: 'blob'
    })
  },

  // 导入安全库存配置
  importSafetyStockConfigs(file: File, level: string): Promise<{
    success: number
    failed: number
    errors: Array<{ row: number, message: string }>
  }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('level', level)
    
    return request({
      url: '/api/safety-stock/configs/import',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 预设配置相关API
export const safetyStockPresetApi = {
  // 获取预设配置列表
  getPresets(): Promise<Array<{
    id: string
    name: string
    description: string
    config: Partial<SafetyStockConfig>
    isDefault: boolean
    createdAt: string
  }>> {
    return request({
      url: '/api/safety-stock/presets',
      method: 'get'
    })
  },

  // 保存为预设配置
  saveAsPreset(data: {
    name: string
    description: string
    config: Partial<SafetyStockConfig>
    isDefault?: boolean
  }): Promise<void> {
    return request({
      url: '/api/safety-stock/presets',
      method: 'post',
      data
    })
  },

  // 应用预设配置
  applyPreset(presetId: string, targetConfigs: string[]): Promise<void> {
    return request({
      url: `/api/safety-stock/presets/${presetId}/apply`,
      method: 'post',
      data: { targetConfigs }
    })
  },

  // 删除预设配置
  deletePreset(presetId: string): Promise<void> {
    return request({
      url: `/api/safety-stock/presets/${presetId}`,
      method: 'delete'
    })
  }
}
