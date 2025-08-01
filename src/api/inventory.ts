import request from '@/utils/request'

// 获取库存列表
export function getInventoryList(params: any) {
  return request({
    url: '/api/warehouse/inventory',
    method: 'get',
    params
  })
}

// 获取库存详情
export function getInventoryDetail(sku: string) {
  return request({
    url: `/api/warehouse/inventory/${sku}`,
    method: 'get'
  })
}

// 更新库存数量
export function updateInventory(sku: string, data: any) {
  return request({
    url: `/api/warehouse/inventory/${sku}`,
    method: 'put',
    data
  })
}

// 锁定库存
export function lockInventory(sku: string) {
  return request({
    url: `/api/warehouse/inventory/${sku}/lock`,
    method: 'post'
  })
}

// 同步库存
export function syncInventory(sku: string) {
  return request({
    url: `/api/warehouse/inventory/${sku}/sync`,
    method: 'post'
  })
}

// 删除SKU
export function deleteSku(sku: string) {
  return request({
    url: `/api/warehouse/inventory/${sku}`,
    method: 'delete'
  })
}

// 获取库存历史记录
export function getInventoryHistory(sku: string, params: any) {
  return request({
    url: `/api/warehouse/inventory/${sku}/history`,
    method: 'get',
    params
  })
}

// 导出库存数据
export function exportInventory(params: any) {
  return request({
    url: '/api/warehouse/inventory/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
} 