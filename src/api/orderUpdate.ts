import request from '@/utils/request'
import type { UpdateQueryParams, UpdateResponse, OrderUpdate } from '@/types/orderUpdate'

// 获取更新记录列表
export const getUpdateList = (params: UpdateQueryParams) => {
  return request<UpdateResponse>({
    url: '/api/order/updates',
    method: 'GET',
    params
  })
}

// 重试更新
export const retryUpdate = (updateId: string) => {
  return request<void>({
    url: `/api/order/updates/${updateId}/retry`,
    method: 'POST'
  })
}

// 取消更新
export const cancelUpdate = (updateId: string) => {
  return request<void>({
    url: `/api/order/updates/${updateId}/cancel`,
    method: 'POST'
  })
}

// 获取更新详情
export const getUpdateDetail = (updateId: string) => {
  return request<OrderUpdate>({
    url: `/api/order/updates/${updateId}`,
    method: 'GET'
  })
}

// 创建更新记录
export const createUpdate = (data: Omit<OrderUpdate, 'id' | 'createTime' | 'updateTime'>) => {
  return request<OrderUpdate>({
    url: '/api/order/updates',
    method: 'POST',
    data
  })
} 