import request from '@/utils/request'
import type { PurchaseOrderTracking } from '@/views/purchase/tracking/types'

export interface SearchParams {
  poNumber?: string
  supplier?: string
  status?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

export interface SearchResponse {
  total: number
  items: PurchaseOrderTracking[]
}

export interface StatusUpdateParams {
  stage: string
  subprocess: string
  status: string
  remarks?: string
  attachments?: File[]
}

export const purchaseApi = {
  // 获取采购订单追踪列表
  getTrackingList(params: SearchParams) {
    return request<SearchResponse>({
      url: '/api/purchase/tracking',
      method: 'get',
      params
    })
  },

  // 获取采购订单追踪详情
  getTrackingDetail(id: string) {
    return request<PurchaseOrderTracking>({
      url: `/api/purchase/tracking/${id}`,
      method: 'get'
    })
  },

  // 更新采购订单状态
  updateTrackingStatus(id: string, data: StatusUpdateParams) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'attachments' && Array.isArray(value)) {
        value.forEach(file => {
          formData.append('attachments', file)
        })
      } else if (value !== undefined) {
        formData.append(key, value)
      }
    })

    return request({
      url: `/api/purchase/tracking/${id}/status`,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 创建采购订单
  createTracking(data: Partial<PurchaseOrderTracking>) {
    return request<PurchaseOrderTracking>({
      url: '/api/purchase/tracking',
      method: 'post',
      data
    })
  },

  // 更新采购订单
  updateTracking(id: string, data: Partial<PurchaseOrderTracking>) {
    return request<PurchaseOrderTracking>({
      url: `/api/purchase/tracking/${id}`,
      method: 'put',
      data
    })
  }
} 