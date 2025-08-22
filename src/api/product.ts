import request from '@/utils/request';
import type { Product } from '@/types/product';

// 获取商品列表
export function getProducts(params: any) {
  return request({
    url: '/api/products',
    method: 'get',
    params
  });
}

// 获取商品详情
export function getProduct(id: string) {
  return request({
    url: `/api/products/${id}`,
    method: 'get'
  });
}

// 创建商品
export function createProduct(data: Partial<Product>) {
  return request({
    url: '/api/products',
    method: 'post',
    data
  });
}

// 更新商品
export function updateProduct(id: string, data: Partial<Product>) {
  return request({
    url: `/api/products/${id}`,
    method: 'put',
    data
  });
}

// 删除商品
export function deleteProduct(id: string) {
  return request({
    url: `/api/products/${id}`,
    method: 'delete'
  });
}

// 批量删除商品
export function batchDeleteProducts(ids: string[]) {
  return request({
    url: '/api/products/batch',
    method: 'delete',
    data: { ids }
  });
}

// 商品SKU查重
export function checkSkuExists(sku: string) {
  return request({
    url: '/api/products/check-sku',
    method: 'get',
    params: { sku }
  });
}

// 获取商品类目
export function getCategories() {
  return request({
    url: '/api/products/categories',
    method: 'get'
  });
}

// 获取商品品牌列表
export function getBrands() {
  return request({
    url: '/api/products/brands',
    method: 'get'
  });
}

// 获取供应商列表
export function getVendors() {
  return request({
    url: '/api/products/vendors',
    method: 'get'
  });
}

// 查询HS编码
export function queryHsCode(params: any) {
  return request({
    url: '/api/products/hs-code',
    method: 'get',
    params
  });
}

// 同步渠道商品信息
export function syncChannelProduct(id: string, channel: string) {
  return request({
    url: `/api/products/${id}/sync`,
    method: 'post',
    data: { channel }
  });
}

// 获取渠道商品映射状态
export function getChannelMappingStatus(id: string) {
  return request({
    url: `/api/products/${id}/mapping-status`,
    method: 'get'
  });
}

// 更新商品库存
export function updateInventory(id: string, data: any) {
  return request({
    url: `/api/products/${id}/inventory`,
    method: 'put',
    data
  });
}

// 获取商品库存历史
export function getInventoryHistory(id: string, params: any) {
  return request({
    url: `/api/products/${id}/inventory-history`,
    method: 'get',
    params
  });
}

// 获取商品价格历史
export function getPriceHistory(id: string, params: any) {
  return request({
    url: `/api/products/${id}/price-history`,
    method: 'get',
    params
  });
}

// 导出商品数据
export function exportProducts(params: any) {
  return request({
    url: '/api/products/export',
    method: 'get',
    params,
    responseType: 'blob'
  });
}

// 导入商品数据
export function importProducts(data: FormData) {
  return request({
    url: '/api/products/import',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 获取商品统计数据
export function getProductStats() {
  return request({
    url: '/api/products/stats',
    method: 'get'
  });
}

// 获取商品变更历史
export function getProductHistory(id: string, params: any) {
  return request({
    url: `/api/products/${id}/history`,
    method: 'get',
    params
  });
}

// 复制商品
export function cloneProduct(id: string) {
  return request({
    url: `/api/products/${id}/clone`,
    method: 'post'
  });
}

// 批量更新商品
export function batchUpdateProducts(data: any) {
  return request({
    url: '/api/products/batch',
    method: 'put',
    data
  });
}

// 获取商品属性模板
export function getAttributeTemplates() {
  return request({
    url: '/api/products/attribute-templates',
    method: 'get'
  });
}

// 保存商品属性模板
export function saveAttributeTemplate(data: any) {
  return request({
    url: '/api/products/attribute-templates',
    method: 'post',
    data
  });
}

// 获取商品标签列表
export function getTags() {
  return request({
    url: '/api/products/tags',
    method: 'get'
  });
}

// 更新商品状态
export function updateProductStatus(id: string, status: string) {
  return request({
    url: `/api/products/${id}/status`,
    method: 'put',
    data: { status }
  });
}

// 批量更新商品状态
export function batchUpdateProductStatus(ids: string[], status: string) {
  return request({
    url: '/api/products/batch-status',
    method: 'put',
    data: { ids, status }
  });
}

// 获取商品审核历史
export function getApprovalHistory(id: string) {
  return request({
    url: `/api/products/${id}/approval-history`,
    method: 'get'
  });
}

// 提交商品审核
export function submitForApproval(id: string, data: any) {
  return request({
    url: `/api/products/${id}/submit-approval`,
    method: 'post',
    data
  });
}

// 审核商品
export function approveProduct(id: string, data: any) {
  return request({
    url: `/api/products/${id}/approve`,
    method: 'post',
    data
  });
}

// 驳回商品
export function rejectProduct(id: string, data: any) {
  return request({
    url: `/api/products/${id}/reject`,
    method: 'post',
    data
  });
}