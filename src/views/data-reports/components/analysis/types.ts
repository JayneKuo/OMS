// 趋势数据类型
export interface TrendData {
  time: string
  value: number
}

// 异常点类型
export interface AnomalyItem {
  time: string
  type: string
  level: 'warning' | 'danger' | 'info'
  value: number
  description: string
  factors: Array<{
    name: string
    value: string
    weight: number
  }>
}

// 漏斗数据类型
export interface FunnelItem {
  name: string
  value: number
  rate: number
  trend: number
  color: string
}

// 流量来源类型
export interface TrafficSource {
  name: string
  value: number
  percentage: number
  color: string
  conversionRate: number
  bounceRate: number
  visitors: number
  pagesPerVisit: number
  avgDuration: number
  visitorsTrend: number
  pagesTrend: number
  durationTrend: number
  visitTrend: TrendData[]
  conversionPath: Array<{
    source: string
    target: string
    value: number
  }>
  suggestions: Array<{
    type: string
    priority: string
    content: string
    effect: string
  }>
}

// 转化路径类型
export interface PathNode {
  source: string
  target: string
  value: number
} 