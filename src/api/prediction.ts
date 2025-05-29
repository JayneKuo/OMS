import request from '@/utils/request'
import type { AxiosResponse } from 'axios'

// 预测参数接口
export interface PredictionParams {
  period: string
  customDateRange?: [Date, Date]
  dimension: string
  dimensionValues: string[]
  factors: string[]
  options: string[]
}

// 预测结果接口
export interface PredictionResult {
  date: string
  predicted: number
  actual?: number
  lowerBound: number
  upperBound: number
  accuracy: number
  factors: {
    name: string
    impact: number
  }[]
}

// 补货建议接口
export interface ReplenishmentItem {
  sku: string
  name: string
  currentStock: number
  predictedDemand: number
  suggestedReplenishment: number
  urgencyLevel: string
  suggestion: string
}

// 促销建议接口
export interface PromotionItem {
  sku: string
  name: string
  salesTrend: number
  promotionType: string
  expectedEffect: number
  suggestion: string
}

// 影响因素分析接口
export interface FactorAnalysis {
  name: string
  impact: number
  description: string
  suggestions: string[]
}

// 获取预测维度选项
export function getDimensionOptions(dimension: string) {
  return request({
    url: '/api/prediction/dimensions',
    method: 'get',
    params: { dimension }
  })
}

// 生成销量预测
export function generatePrediction(params: PredictionParams) {
  return request({
    url: '/api/prediction/generate',
    method: 'post',
    data: params
  })
}

// 获取补货建议
export function getReplenishmentSuggestions(predictionId: string) {
  return request({
    url: '/api/prediction/replenishment',
    method: 'get',
    params: { predictionId }
  })
}

// 获取促销建议
export function getPromotionSuggestions(predictionId: string) {
  return request({
    url: '/api/prediction/promotion',
    method: 'get',
    params: { predictionId }
  })
}

// 获取影响因素分析
export function getFactorAnalysis(predictionId: string) {
  return request({
    url: '/api/prediction/factors',
    method: 'get',
    params: { predictionId }
  })
}

// 导出预测报告
export function exportPredictionReport(predictionId: string) {
  return request({
    url: '/api/prediction/export',
    method: 'get',
    params: { predictionId },
    responseType: 'blob'
  })
}

// 保存预测模板
export function savePredictionTemplate(template: {
  name: string
  config: PredictionParams
}) {
  return request({
    url: '/api/prediction/templates',
    method: 'post',
    data: template
  })
}

// 获取预测模板列表
export function getPredictionTemplates() {
  return request({
    url: '/api/prediction/templates',
    method: 'get'
  })
}

// Mock API调用（开发环境使用）
export function mockPredictionAPI(params: PredictionParams): Promise<{
  predictionId: string
  results: PredictionResult[]
  replenishment: ReplenishmentItem[]
  promotion: PromotionItem[]
  factors: FactorAnalysis[]
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        predictionId: 'mock-prediction-id',
        results: Array(30).fill(null).map((_, index) => ({
          date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString(),
          predicted: Math.floor(Math.random() * 50000 + 30000),
          actual: index < 7 ? Math.floor(Math.random() * 50000 + 30000) : undefined,
          lowerBound: Math.floor(Math.random() * 40000 + 25000),
          upperBound: Math.floor(Math.random() * 60000 + 40000),
          accuracy: Number((Math.random() * 10 + 85).toFixed(1)),
          factors: [
            { name: '季节性', impact: 5.2 },
            { name: '促销活动', impact: -2.1 },
            { name: '节假日', impact: 8.3 }
          ]
        })),
        replenishment: [
          {
            sku: 'SKU001',
            name: '商品A',
            currentStock: 1000,
            predictedDemand: 1500,
            suggestedReplenishment: 500,
            urgencyLevel: '高',
            suggestion: '建议立即补货，预计3天内库存不足'
          },
          {
            sku: 'SKU002',
            name: '商品B',
            currentStock: 2000,
            predictedDemand: 1800,
            suggestedReplenishment: 0,
            urgencyLevel: '低',
            suggestion: '当前库存充足，无需补货'
          }
        ],
        promotion: [
          {
            sku: 'SKU003',
            name: '商品C',
            salesTrend: -15,
            promotionType: '折扣',
            expectedEffect: 25,
            suggestion: '建议进行限时折扣活动，预期可提升销量25%'
          },
          {
            sku: 'SKU004',
            name: '商品D',
            salesTrend: 20,
            promotionType: '满减',
            expectedEffect: 15,
            suggestion: '建议进行满减活动，巩固增长态势'
          }
        ],
        factors: [
          {
            name: '季节性因素',
            impact: 15.2,
            description: '即将进入夏季，相关产品需求将显著提升',
            suggestions: [
              '提前备货夏季新品',
              '关注天气变化及时调整库存'
            ]
          },
          {
            name: '促销活动',
            impact: -8.5,
            description: '竞品促销活动对销量产生负面影响',
            suggestions: [
              '制定针对性的促销策略',
              '加强产品差异化竞争'
            ]
          }
        ]
      })
    }, 1500)
  })
}

export interface PredictionOverview {
  totalSales: number
  averageDailySales: number
  accuracy: number
  growthPotential: number
}

/**
 * 获取预测总览数据
 */
export function getPredictionOverview(): Promise<AxiosResponse> {
  return request({
    url: '/api/prediction/overview',
    method: 'get'
  })
}

/**
 * 获取历史预测准确率
 */
export function getPredictionAccuracy(): Promise<AxiosResponse> {
  return request({
    url: '/api/prediction/accuracy',
    method: 'get'
  })
} 