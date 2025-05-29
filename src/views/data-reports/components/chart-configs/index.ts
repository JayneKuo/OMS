import { EChartsOption, SeriesOption } from 'echarts'

// 渠道定义
export interface Channel {
  id: string
  name: string
  color: string
}

export const CHANNELS: Channel[] = [
  { id: 'tmall', name: '天猫', color: '#ff6b81' },
  { id: 'jd', name: '京东', color: '#ff4757' },
  { id: 'douyin', name: '抖音', color: '#2f3542' },
  { id: 'self', name: '自营', color: '#67c23a' }
]

// 数据接口定义
export interface TrendData {
  date: string
  value: number
  wow?: number
  yoy?: number
}

export interface TrafficData extends TrendData {
  traffic: number
  conversion: number
}

export interface RefundData extends TrendData {
  amount: number
  rate: number
}

export interface RiskSkuData {
  skuId: string
  name: string
  refundRate: number
  refundAmount: number
  orderCount: number
}

// 基础图表配置
const BASE_CHART_CONFIG: EChartsOption = {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(35, 39, 46, 0.9)',
    borderColor: '#4c4d4f',
    textStyle: { color: '#e0e6ed' }
  },
  legend: {
    type: 'scroll',
    orient: 'horizontal',
    top: 0,
    right: 10,
    textStyle: { color: '#909399' }
  },
  grid: {
    top: 60,
    left: '5%',
    right: '5%',
    bottom: '8%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisLine: { lineStyle: { color: '#4c4d4f' } },
    axisLabel: { color: '#909399' }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#4c4d4f' } },
    axisLabel: { color: '#909399' }
  }
}

// 销售趋势图配置
export function getSalesTrendConfig(data: Record<string, TrendData[]>): EChartsOption {
  const series: SeriesOption[] = CHANNELS.map(channel => ({
    name: channel.name,
    type: 'line',
    smooth: true,
    showSymbol: false,
    emphasis: {
      focus: 'series',
      showSymbol: true
    },
    data: data[channel.id]?.map(item => ({
      value: item.value,
      itemStyle: {
        color: item.wow >= 20 ? '#67c23a' : channel.color
      }
    })),
    lineStyle: { width: 2 }
  }))

  return {
    ...BASE_CHART_CONFIG,
    legend: {
      ...BASE_CHART_CONFIG.legend,
      data: CHANNELS.map(c => c.name)
    },
    tooltip: {
      ...BASE_CHART_CONFIG.tooltip,
      formatter: (params: any) => {
        const item = params[0]
        const date = item.axisValue
        let html = `<div style="margin-bottom:8px">${date}</div>`
        params.forEach((param: any) => {
          const data = data[CHANNELS.find(c => c.name === param.seriesName)?.id || '']
            ?.find(d => d.date === date)
          html += `
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="margin-right:16px">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color};margin-right:8px"></span>
                <span>${param.seriesName}</span>
              </span>
              <span style="color:${param.color}">${param.value}</span>
            </div>
            ${data?.wow ? `<div style="margin-left:18px;font-size:12px">环比 ${data.wow >= 0 ? '+' : ''}${data.wow}%</div>` : ''}
            ${data?.yoy ? `<div style="margin-left:18px;font-size:12px">同比 ${data.yoy >= 0 ? '+' : ''}${data.yoy}%</div>` : ''}
          `
        })
        return html
      }
    },
    series
  }
}

// 流量转化图配置
export function getTrafficConfig(data: Record<string, TrafficData[]>): EChartsOption {
  const series: SeriesOption[] = CHANNELS.map(channel => [
    {
      name: `${channel.name}-流量`,
      type: 'bar',
      barWidth: 10,
      data: data[channel.id]?.map(item => ({
        value: item.traffic,
        itemStyle: { color: channel.color }
      }))
    },
    {
      name: `${channel.name}-转化率`,
      type: 'line',
      yAxisIndex: 1,
      showSymbol: false,
      emphasis: { focus: 'series' },
      data: data[channel.id]?.map(item => ({
        value: item.conversion,
        itemStyle: {
          color: item.conversion >= 10 ? '#f56c6c' : channel.color
        }
      })),
      lineStyle: { 
        width: 2,
        type: 'dashed'
      }
    }
  ]).flat()

  return {
    ...BASE_CHART_CONFIG,
    legend: {
      ...BASE_CHART_CONFIG.legend,
      data: CHANNELS.map(c => [`${c.name}-流量`, `${c.name}-转化率`]).flat()
    },
    tooltip: {
      ...BASE_CHART_CONFIG.tooltip,
      formatter: (params: any) => {
        const date = params[0].axisValue
        let html = `<div style="margin-bottom:8px">${date}</div>`
        
        // 按渠道分组展示数据
        CHANNELS.forEach(channel => {
          const traffic = params.find((p: any) => p.seriesName === `${channel.name}-流量`)
          const conversion = params.find((p: any) => p.seriesName === `${channel.name}-转化率`)
          if (traffic && conversion) {
            html += `
              <div style="margin-bottom:8px">
                <div style="display:flex;align-items:center;margin-bottom:4px">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${channel.color};margin-right:8px"></span>
                  <span>${channel.name}</span>
                </div>
                <div style="margin-left:18px">流量: ${traffic.value}</div>
                <div style="margin-left:18px">转化率: ${conversion.value}%</div>
              </div>
            `
          }
        })
        return html
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '访客数',
        axisLine: { lineStyle: { color: '#4c4d4f' } },
        axisLabel: { color: '#909399' }
      },
      {
        type: 'value',
        name: '转化率(%)',
        axisLine: { lineStyle: { color: '#4c4d4f' } },
        axisLabel: { color: '#909399' }
      }
    ],
    series
  }
}

// 退款趋势图配置
export function getRefundConfig(data: Record<string, RefundData[]>): EChartsOption {
  const series: SeriesOption[] = CHANNELS.map(channel => ({
    name: channel.name,
    type: 'line',
    smooth: true,
    showSymbol: false,
    emphasis: { 
      focus: 'series',
      showSymbol: true
    },
    data: data[channel.id]?.map(item => ({
      value: item.amount,
      symbol: item.wow >= 20 ? 'circle' : 'none',
      symbolSize: 8,
      itemStyle: {
        color: item.wow >= 20 ? '#f56c6c' : channel.color
      }
    })),
    lineStyle: { width: 2 }
  }))

  return {
    ...BASE_CHART_CONFIG,
    legend: {
      ...BASE_CHART_CONFIG.legend,
      data: CHANNELS.map(c => c.name)
    },
    tooltip: {
      ...BASE_CHART_CONFIG.tooltip,
      formatter: (params: any) => {
        const date = params[0].axisValue
        let html = `<div style="margin-bottom:8px">${date}</div>`
        params.forEach((param: any) => {
          const channelData = data[CHANNELS.find(c => c.name === param.seriesName)?.id || '']
            ?.find(d => d.date === date)
          if (channelData) {
            html += `
              <div style="margin-bottom:8px">
                <div style="display:flex;justify-content:space-between">
                  <span>
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color};margin-right:8px"></span>
                    <span>${param.seriesName}</span>
                  </span>
                  <span style="color:${param.color}">¥${param.value}k</span>
                </div>
                <div style="margin-left:18px">退款率: ${channelData.rate}%</div>
                ${channelData.wow ? `<div style="margin-left:18px">环比: ${channelData.wow >= 0 ? '+' : ''}${channelData.wow}%</div>` : ''}
              </div>
            `
          }
        })
        return html
      }
    },
    series
  }
}

// 高风险SKU分布图配置
export function getRiskSkuConfig(data: RiskSkuData[]): EChartsOption {
  return {
    ...BASE_CHART_CONFIG,
    tooltip: {
      ...BASE_CHART_CONFIG.tooltip,
      trigger: 'item',
      formatter: (params: any) => {
        const { name, value, data } = params
        return `
          <div style="margin-bottom:4px">${name}</div>
          <div style="margin-bottom:4px">退款率: ${value}%</div>
          <div>退款金额: ¥${data.refundAmount}k</div>
          <div>订单数: ${data.orderCount}</div>
        `
      }
    },
    xAxis: {
      type: 'value',
      name: '退款率(%)',
      max: 100,
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { color: '#909399' }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { 
        color: '#909399',
        width: 100,
        overflow: 'truncate'
      }
    },
    series: [{
      type: 'bar',
      data: data.map(item => ({
        ...item,
        value: item.refundRate,
        itemStyle: {
          color: item.refundRate >= 15 ? '#f56c6c' :
                item.refundRate >= 10 ? '#e6a23c' : '#409eff'
        }
      }))
    }]
  }
} 