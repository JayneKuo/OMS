<template>
  <div class="channel-sales-trend">
    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <el-tooltip 
        placement="top" 
        effect="dark"
        :content="getTooltipContent('totalSales')"
        raw-content>
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">总销售额</span>
            <el-icon class="card-icon"><Money /></el-icon>
          </div>
          <div class="card-value">¥{{ formatNumber(realtimeData.totalSales) }}</div>
          <div class="card-trend">
            <span class="trend-label">同比</span>
            <span :class="getTrendClass(realtimeData.salesYoY)">
              {{ formatTrend(realtimeData.salesYoY) }}
            </span>
            <span class="trend-separator">|</span>
            <span class="trend-label">环比</span>
            <span :class="getTrendClass(realtimeData.salesMoM)">
              {{ formatTrend(realtimeData.salesMoM) }}
            </span>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip 
        placement="top" 
        effect="dark"
        :content="getTooltipContent('totalOrders')"
        raw-content>
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">总订单数</span>
            <el-icon class="card-icon"><Document /></el-icon>
          </div>
          <div class="card-value">{{ formatNumber(realtimeData.totalOrders) }}</div>
          <div class="card-trend">
            <span class="trend-label">同比</span>
            <span :class="getTrendClass(realtimeData.ordersYoY)">
              {{ formatTrend(realtimeData.ordersYoY) }}
            </span>
            <span class="trend-separator">|</span>
            <span class="trend-label">环比</span>
            <span :class="getTrendClass(realtimeData.ordersMoM)">
              {{ formatTrend(realtimeData.ordersMoM) }}
            </span>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip 
        placement="top" 
        effect="dark"
        :content="getTooltipContent('avgOrderValue')"
        raw-content>
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">客单价</span>
            <el-icon class="card-icon"><Wallet /></el-icon>
          </div>
          <div class="card-value">¥{{ formatNumber(realtimeData.avgOrderValue) }}</div>
          <div class="card-trend">
            <span class="trend-label">同比</span>
            <span :class="getTrendClass(realtimeData.aovYoY)">
              {{ formatTrend(realtimeData.aovYoY) }}
            </span>
            <span class="trend-separator">|</span>
            <span class="trend-label">环比</span>
            <span :class="getTrendClass(realtimeData.aovMoM)">
              {{ formatTrend(realtimeData.aovMoM) }}
            </span>
          </div>
        </div>
      </el-tooltip>

      <el-tooltip 
        placement="top" 
        effect="dark"
        :content="getTooltipContent('conversionRate')"
        raw-content>
        <div class="overview-card">
          <div class="card-header">
            <span class="card-title">转化率</span>
            <el-icon class="card-icon"><TrendCharts /></el-icon>
          </div>
          <div class="card-value">{{ realtimeData.conversionRate }}%</div>
          <div class="card-trend">
            <span class="trend-label">同比</span>
            <span :class="getTrendClass(realtimeData.conversionYoY)">
              {{ formatTrend(realtimeData.conversionYoY) }}
            </span>
            <span class="trend-separator">|</span>
            <span class="trend-label">环比</span>
            <span :class="getTrendClass(realtimeData.conversionMoM)">
              {{ formatTrend(realtimeData.conversionMoM) }}
            </span>
          </div>
        </div>
      </el-tooltip>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-panel">
      <el-form :inline="true" size="small">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item label="渠道">
          <el-select 
            v-model="selectedChannels" 
            multiple 
            collapse-tags 
            placeholder="选择渠道"
            @change="handleDataChange">
            <el-option 
              v-for="channel in channels" 
              :key="channel.value" 
              :label="channel.label" 
              :value="channel.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="展示方式">
          <el-radio-group v-model="displayMode" @change="handleDisplayModeChange">
            <el-radio-button label="merge">合并展示</el-radio-button>
            <el-radio-button label="group">分组展示</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指标">
          <el-checkbox-group v-model="selectedMetrics" @change="handleMetricsChange">
            <el-checkbox label="sales">销售额</el-checkbox>
            <el-checkbox label="orders">订单数</el-checkbox>
            <el-checkbox label="conversion">转化率</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>

    <!-- 图表区域 -->
    <div class="chart-container" ref="chartRef"></div>

    <!-- 渠道明细表格 -->
    <div class="channel-detail">
      <div class="table-header">
        <div class="table-title">渠道销售明细</div>
        <div class="table-actions">
          <el-button size="small" @click="exportData">导出数据</el-button>
        </div>
      </div>
      <el-table :data="channelDetailData" border style="width: 100%" :max-height="300">
        <el-table-column prop="channel" label="渠道" width="120">
          <template #default="{ row }: { row: TableRowData }">
            <div class="channel-name">
              <span class="channel-dot" :style="{ backgroundColor: channelColors[row.channelCode] }"></span>
              {{ row.channel }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销售额" width="150">
          <template #default="{ row }">
            ¥{{ formatNumber(row.sales) }}
          </template>
        </el-table-column>
        <el-table-column prop="salesPercent" label="销售占比" width="120">
          <template #default="{ row }: { row: TableRowData }">
            <div class="percent-bar">
              <div class="bar-inner" :style="{ width: row.salesPercent + '%', backgroundColor: channelColors[row.channelCode] }"></div>
              <span class="bar-text">{{ row.salesPercent }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orders" label="订单数" width="120">
          <template #default="{ row }">
            {{ formatNumber(row.orders) }}
          </template>
        </el-table-column>
        <el-table-column prop="conversion" label="转化率" width="120">
          <template #default="{ row }">
            {{ row.conversion }}%
          </template>
        </el-table-column>
        <el-table-column prop="avgOrderValue" label="客单价" width="120">
          <template #default="{ row }">
            ¥{{ formatNumber(row.avgOrderValue) }}
          </template>
        </el-table-column>
        <el-table-column prop="yoy" label="同比增长" width="120">
          <template #default="{ row }">
            <span :class="getValueClass(row.yoy)">
              {{ formatChange(row.yoy) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import { QuestionFilled, Money, Document, Wallet, TrendCharts } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

// 类型定义
interface ChannelData {
  time: string
  channel: keyof typeof channelColors
  sales: number
  orders: number
  conversion: number
  avgOrderValue: number
}

interface OverviewItem {
  title: string
  tooltip: string
  value: number
  prefix?: string
  suffix?: string
  yoy: number
  mom?: number
}

interface TableRowData {
  channel: string
  channelCode: keyof typeof channelColors
  sales: number
  salesPercent: number
  orders: number
  conversion: number
  avgOrderValue: number
  yoy: number
}

// 常量定义
const channelColors = {
  tmall: '#ff6b81',
  jd: '#45aaf2',
  douyin: '#2ecc71',
  store: '#fed330'
} as const

const channels = [
  { label: '天猫', value: 'tmall' },
  { label: '京东', value: 'jd' },
  { label: '抖音', value: 'douyin' },
  { label: '门店', value: 'store' }
]

const dateShortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 组件状态
const chartRef = ref<HTMLElement | null>(null)
const dateRange = ref<[Date, Date]>([
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  new Date()
])
const selectedChannels = ref<(keyof typeof channelColors)[]>(['tmall', 'jd', 'douyin', 'store'])
const displayMode = ref<'merge' | 'group'>('merge')
const selectedMetrics = ref<string[]>(['sales', 'orders'])
let chart: echarts.ECharts | null = null
let realtimeTimer: NodeJS.Timeout | null = null

// 实时数据
const realtimeData = ref({
  totalSales: 1250000,
  salesYoY: 15.8,
  salesMoM: 8.2,
  totalOrders: 3420,
  ordersYoY: 12.5,
  ordersMoM: 5.7,
  avgOrderValue: 365.5,
  aovYoY: 2.8,
  aovMoM: 2.3,
  conversionRate: 3.45,
  conversionYoY: 0.8,
  conversionMoM: 0.5
})

// 获取提示内容
const getTooltipContent = (type: string) => {
  const tooltips: Record<string, string> = {
    totalSales: `
      <div style="line-height: 1.6;">
        <strong>总销售额</strong><br/>
        <span style="color: #909399;">计算公式：</span>所有渠道销售金额之和<br/>
        <span style="color: #909399;">数据来源：</span>实时订单数据<br/>
        <span style="color: #909399;">更新频率：</span>每5分钟更新一次<br/>
        <br/>
        <span style="color: #909399;">同比：</span>与去年同期相比的增长率<br/>
        <span style="color: #909399;">环比：</span>与上月同期相比的增长率
      </div>
    `,
    totalOrders: `
      <div style="line-height: 1.6;">
        <strong>总订单数</strong><br/>
        <span style="color: #909399;">计算公式：</span>所有渠道订单数量之和<br/>
        <span style="color: #909399;">数据来源：</span>实时订单数据<br/>
        <span style="color: #909399;">更新频率：</span>每5分钟更新一次<br/>
        <br/>
        <span style="color: #909399;">同比：</span>与去年同期相比的增长率<br/>
        <span style="color: #909399;">环比：</span>与上月同期相比的增长率
      </div>
    `,
    avgOrderValue: `
      <div style="line-height: 1.6;">
        <strong>客单价</strong><br/>
        <span style="color: #909399;">计算公式：</span>总销售额 ÷ 总订单数<br/>
        <span style="color: #909399;">数据来源：</span>实时订单数据<br/>
        <span style="color: #909399;">更新频率：</span>每5分钟更新一次<br/>
        <br/>
        <span style="color: #909399;">同比：</span>与去年同期相比的增长率<br/>
        <span style="color: #909399;">环比：</span>与上月同期相比的增长率
      </div>
    `,
    conversionRate: `
      <div style="line-height: 1.6;">
        <strong>转化率</strong><br/>
        <span style="color: #909399;">计算公式：</span>订单数 ÷ 访问人数 × 100%<br/>
        <span style="color: #909399;">数据来源：</span>实时访问和订单数据<br/>
        <span style="color: #909399;">更新频率：</span>每5分钟更新一次<br/>
        <br/>
        <span style="color: #909399;">同比：</span>与去年同期相比的变化（百分点）<br/>
        <span style="color: #909399;">环比：</span>与上月同期相比的变化（百分点）
      </div>
    `
  }
  return tooltips[type] || ''
}

// 格式化趋势值
const formatTrend = (value: number) => {
  return (value >= 0 ? '+' : '') + value.toFixed(1) + '%'
}

// 获取趋势样式类
const getTrendClass = (value: number) => {
  return value >= 0 ? 'positive' : 'negative'
}

// 生成概览数据
const overviewData = computed<OverviewItem[]>(() => {
  const totalSales = channelDetailData.value.reduce((sum, item) => sum + item.sales, 0)
  const totalOrders = channelDetailData.value.reduce((sum, item) => sum + item.orders, 0)
  const avgConversion = channelDetailData.value.reduce((sum, item) => sum + item.conversion, 0) / channelDetailData.value.length
  
  return [
    {
      title: '总销售额',
      tooltip: '所选时间范围内的总销售金额',
      value: totalSales,
      prefix: '¥',
      yoy: 15.8,
      mom: 5.2
    },
    {
      title: '总订单数',
      tooltip: '所选时间范围内的总订单量',
      value: totalOrders,
      yoy: 12.5,
      mom: 3.8
    },
    {
      title: '平均客单价',
      tooltip: '总销售额/总订单数',
      value: totalSales / totalOrders,
      prefix: '¥',
      yoy: 2.5
    },
    {
      title: '平均转化率',
      tooltip: '订单数/访客数',
      value: avgConversion,
      suffix: '%',
      yoy: 0.5
    }
  ]
})

// 生成渠道明细数据
const channelDetailData = ref([
  {
    channel: '天猫',
    channelCode: 'tmall',
    sales: 1235689,
    salesPercent: 48.5,
    orders: 1589,
    conversion: 3.2,
    avgOrderValue: 778,
    yoy: 18.5
  },
  {
    channel: '京东',
    channelCode: 'jd',
    sales: 856432,
    salesPercent: 33.2,
    orders: 1102,
    conversion: 2.8,
    avgOrderValue: 777,
    yoy: 12.3
  },
  {
    channel: '抖音',
    channelCode: 'douyin',
    sales: 325678,
    salesPercent: 12.8,
    orders: 425,
    conversion: 4.5,
    avgOrderValue: 766,
    yoy: 45.6
  },
  {
    channel: '门店',
    channelCode: 'store',
    sales: 150633,
    salesPercent: 5.5,
    orders: 140,
    conversion: 2.1,
    avgOrderValue: 1076,
    yoy: -5.2
  }
])

// 生成图表数据
function generateChartData(): ChannelData[] {
  const data: ChannelData[] = []
  const days = Math.floor((dateRange.value[1].getTime() - dateRange.value[0].getTime()) / (24 * 60 * 60 * 1000))
  
  // 渠道基础数据
  const channelBaseData = {
    tmall: {
      baseSales: 150000,
      variance: 0.2,
      trend: 0.15,
      weekendBoost: 1.3,
      conversion: 3.2
    },
    jd: {
      baseSales: 120000,
      variance: 0.15,
      trend: 0.1,
      weekendBoost: 1.2,
      conversion: 2.8
    },
    douyin: {
      baseSales: 80000,
      variance: 0.3,
      trend: 0.25,
      weekendBoost: 1.4,
      conversion: 4.5
    },
    store: {
      baseSales: 50000,
      variance: 0.1,
      trend: -0.05,
      weekendBoost: 0.9,
      conversion: 2.1
    }
  }

  for (let i = 0; i < days; i++) {
    const date = new Date(dateRange.value[0].getTime() + i * 24 * 60 * 60 * 1000)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    
    Object.entries(channelBaseData).forEach(([channel, config]) => {
      // 基础销售额
      let baseSales = config.baseSales
      
      // 添加趋势影响
      baseSales *= (1 + config.trend * i / days)
      
      // 添加周末效应
      if (isWeekend) {
        baseSales *= config.weekendBoost
      }
      
      // 添加随机波动
      const variance = baseSales * config.variance
      const sales = Math.floor(baseSales + (Math.random() * variance - variance / 2))
      
      // 生成订单数和转化率
      const avgOrderValue = channel === 'store' ? 1000 : 
                          channel === 'tmall' ? 800 :
                          channel === 'jd' ? 750 : 600
      const orders = Math.floor(sales / avgOrderValue)
      const conversion = config.conversion * (0.9 + Math.random() * 0.2)
      
      data.push({
        time: dayjs(date).format('YYYY-MM-DD'),
        channel: channel as keyof typeof channelColors,
        sales,
        orders,
        conversion,
        avgOrderValue
      })
    })
  }
  
  return data
}

// 更新图表配置
function updateChart() {
  if (!chart) return
  
  const chartData = generateChartData()
  const filteredData = chartData.filter(item => selectedChannels.value.includes(item.channel))
  
  // 按时间分组数据
  const groupedData = filteredData.reduce((acc, curr) => {
    if (!acc[curr.time]) {
      acc[curr.time] = {}
    }
    if (!acc[curr.time][curr.channel]) {
      acc[curr.time][curr.channel] = curr
    }
    return acc
  }, {} as Record<string, Record<string, ChannelData>>)

  const times = Object.keys(groupedData).sort()
  const series: any[] = []

  if (displayMode.value === 'merge') {
    // 合并展示模式
    if (selectedMetrics.value.includes('sales')) {
      const salesData = times.map(time => {
        return Object.values(groupedData[time]).reduce((sum, data) => sum + data.sales, 0)
      })
      
      series.push({
        name: '销售额',
        type: 'line',
        data: salesData,
        yAxisIndex: 0,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#67c23a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.2)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0)' }
          ])
        }
      })
    }
    
    if (selectedMetrics.value.includes('orders')) {
      const ordersData = times.map(time => {
        return Object.values(groupedData[time]).reduce((sum, data) => sum + data.orders, 0)
      })
      
      series.push({
        name: '订单数',
        type: 'line',
        data: ordersData,
        yAxisIndex: 1,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#409eff' }
      })
    }
    
    if (selectedMetrics.value.includes('conversion')) {
      const conversionData = times.map(time => {
        const values = Object.values(groupedData[time])
        return values.reduce((sum, data) => sum + data.conversion, 0) / values.length
      })
      
      series.push({
        name: '转化率',
        type: 'line',
        data: conversionData,
        yAxisIndex: 2,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#e6a23c' }
      })
    }
  } else {
    // 分组展示模式
    selectedChannels.value.forEach(channel => {
      if (selectedMetrics.value.includes('sales')) {
        const salesData = times.map(time => groupedData[time][channel]?.sales || 0)
        
        series.push({
          name: `${channels.find(c => c.value === channel)?.label}-销售额`,
          type: 'line',
          data: salesData,
          smooth: true,
          lineStyle: { width: 2 },
          itemStyle: { color: channelColors[channel] }
        })
      }
      
      if (selectedMetrics.value.includes('orders')) {
        const ordersData = times.map(time => groupedData[time][channel]?.orders || 0)
        
        series.push({
          name: `${channels.find(c => c.value === channel)?.label}-订单数`,
          type: 'line',
          data: ordersData,
          smooth: true,
          lineStyle: { width: 2, type: 'dashed' },
          itemStyle: { color: channelColors[channel] }
        })
      }
      
      if (selectedMetrics.value.includes('conversion')) {
        const conversionData = times.map(time => groupedData[time][channel]?.conversion || 0)
        
        series.push({
          name: `${channels.find(c => c.value === channel)?.label}-转化率`,
          type: 'line',
          data: conversionData,
          smooth: true,
          lineStyle: { width: 2, type: 'dotted' },
          itemStyle: { color: channelColors[channel] }
        })
      }
    })
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!Array.isArray(params)) return ''
        const time = params[0].axisValue
        let html = `<div style="margin-bottom:8px">${time}</div>`
        
        params.forEach(param => {
          const value = formatChartValue(param.seriesName, param.value)
          html += `
            <div style="margin: 3px 0">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${param.color};margin-right:5px"></span>
              <span>${param.seriesName}：${value}</span>
            </div>`
        })
        return html
      }
    },
    legend: {
      data: series.map(s => s.name),
      textStyle: { color: '#909399' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { 
        color: '#909399',
        formatter: (value: string) => dayjs(value).format('MM-DD')
      }
    },
    yAxis: displayMode.value === 'merge' ? [
      {
        type: 'value',
        name: '销售额',
        axisLine: { lineStyle: { color: '#4c4d4f' } },
        axisLabel: { 
          color: '#909399',
          formatter: (value: number) => `${(value / 10000).toFixed(0)}w`
        },
        splitLine: { lineStyle: { color: '#2c3036' } }
      },
      {
        type: 'value',
        name: '订单数',
        axisLine: { lineStyle: { color: '#4c4d4f' } },
        axisLabel: { color: '#909399' },
        splitLine: { lineStyle: { color: '#2c3036' } }
      },
      {
        type: 'value',
        name: '转化率',
        axisLine: { lineStyle: { color: '#4c4d4f' } },
        axisLabel: { 
          color: '#909399',
          formatter: (value: number) => `${value.toFixed(1)}%`
        },
        splitLine: { lineStyle: { color: '#2c3036' } }
      }
    ] : {
      type: 'value',
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { 
        color: '#909399',
        formatter: (value: number) => {
          if (selectedMetrics.value.includes('sales')) {
            return `${(value / 10000).toFixed(0)}w`
          }
          if (selectedMetrics.value.includes('conversion')) {
            return `${value.toFixed(1)}%`
          }
          return formatNumber(value)
        }
      },
      splitLine: { lineStyle: { color: '#2c3036' } }
    },
    series,
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    }, {
      type: 'slider',
      height: 20,
      bottom: 0,
      start: 0,
      end: 100,
      borderColor: 'transparent',
      backgroundColor: '#2c3036',
      fillerColor: '#40444b',
      handleStyle: {
        color: '#67c23a'
      },
      textStyle: {
        color: '#909399'
      }
    }]
  }

  chart.setOption(option as any)
}

// 格式化图表数值
function formatChartValue(seriesName: string, value: number): string {
  if (seriesName.includes('销售额')) {
    return `¥${formatNumber(value)}`
  }
  if (seriesName.includes('转化率')) {
    return `${value.toFixed(2)}%`
  }
  return formatNumber(value)
}

// 事件处理函数
function handleDateChange() {
  updateChart()
}

function handleDataChange() {
  updateChart()
}

function handleDisplayModeChange() {
  updateChart()
}

function handleMetricsChange() {
  updateChart()
}

function exportData() {
  ElMessage.success('数据导出成功')
}

// 工具函数
function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(Math.round(num))
}

function formatChange(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function getValueClass(value: number): string {
  return value >= 0 ? 'positive' : 'negative'
}

// 实时数据更新
const updateRealtimeData = () => {
  // 模拟实时数据更新
  const baseData = {
    totalSales: 1250000,
    totalOrders: 3420,
    avgOrderValue: 365.5,
    conversionRate: 3.45
  }
  
  // 添加随机波动
  realtimeData.value = {
    totalSales: Math.round(baseData.totalSales * (1 + (Math.random() - 0.5) * 0.1)),
    salesYoY: 15.8 + (Math.random() - 0.5) * 2,
    salesMoM: 8.2 + (Math.random() - 0.5) * 2,
    totalOrders: Math.round(baseData.totalOrders * (1 + (Math.random() - 0.5) * 0.1)),
    ordersYoY: 12.5 + (Math.random() - 0.5) * 2,
    ordersMoM: 5.7 + (Math.random() - 0.5) * 2,
    avgOrderValue: Math.round(baseData.avgOrderValue * (1 + (Math.random() - 0.5) * 0.1) * 100) / 100,
    aovYoY: 2.8 + (Math.random() - 0.5) * 2,
    aovMoM: 2.3 + (Math.random() - 0.5) * 2,
    conversionRate: Math.round(baseData.conversionRate * (1 + (Math.random() - 0.5) * 0.1) * 100) / 100,
    conversionYoY: 0.8 + (Math.random() - 0.5) * 0.5,
    conversionMoM: 0.5 + (Math.random() - 0.5) * 0.5
  }
}

// 组件挂载时启动定时器
onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value, 'dark')
    updateChart()
    window.addEventListener('resize', () => chart?.resize())
  }
  
  // 启动实时数据更新定时器（每30秒更新一次）
  realtimeTimer = setInterval(updateRealtimeData, 30000)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (chart) {
    chart.dispose()
    window.removeEventListener('resize', () => chart?.resize())
  }
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
  }
})
</script>

<style scoped>
.channel-sales-trend {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
}

.overview-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.overview-card {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  width: 24%;
  height: 140px;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-right: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.card-trend {
  font-size: 13px;
}

.trend-label {
  margin-right: 8px;
}

.trend-separator {
  margin: 0 8px;
}

.positive {
  color: var(--el-color-success);
}

.negative {
  color: var(--el-color-danger);
}

.filter-panel {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.chart-container {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  height: 400px;
  margin-bottom: 24px;
}

.channel-detail {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.channel-name {
  display: flex;
  align-items: center;
}

.channel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.percent-bar {
  position: relative;
  width: 100%;
  height: 20px;
  background: var(--el-bg-color);
  border-radius: 10px;
  overflow: hidden;
}

.bar-inner {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.bar-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 12px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}

:deep(.el-radio-button__inner) {
  background: var(--el-bg-color);
  border-color: var(--el-border-color);
  color: var(--el-text-color-regular);
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #ffffff;
}

:deep(.el-select) {
  width: 200px;
}

:deep(.el-form-item__label) {
  color: var(--el-text-color-regular);
}

:deep(.el-table) {
  background-color: transparent;
  color: var(--el-text-color-primary);
}

:deep(.el-table th) {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-regular);
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-table td) {
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-table--border) {
  border: 1px solid var(--el-border-color);
}

:deep(.el-table--border th), :deep(.el-table--border td) {
  border-right: 1px solid var(--el-border-color);
}

:deep(.el-button) {
  background: var(--el-bg-color);
  border-color: var(--el-border-color);
  color: var(--el-text-color-regular);
}

:deep(.el-button.el-button--primary) {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #ffffff;
}

:deep(.el-checkbox) {
  margin-right: 20px;
}

:deep(.el-checkbox__label) {
  color: var(--el-text-color-regular);
}
</style> 