<template>
  <div class="trend-chart-container">
    <div class="chart-header" v-if="showHeader">
      <div class="chart-title">
        <el-tooltip :content="title + '说明'" placement="top">
          <span>{{ title }}</span>
        </el-tooltip>
      </div>
      <div class="chart-controls">
        <el-tooltip content="导出CSV数据" placement="top">
          <el-button size="small" @click="exportCSV">
            <i-ep-document-copy />
          </el-button>
        </el-tooltip>
        <el-tooltip content="导出PNG图片" placement="top">
          <el-button size="small" @click="exportImage">
            <i-ep-picture-rounded />
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="trend-chart" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'

// 类型定义
interface TrendDataItem {
  date: string
  value: number
}

const props = defineProps<{
  data: TrendDataItem[]
  compareData?: TrendDataItem[]
  title?: string
  showHeader?: boolean
  areaStyle?: boolean
}>()

// Chart 相关
const chartRef = ref<HTMLElement>()
let chart: ECharts | null = null

// 获取图表配置
function getChartOption(): EChartsOption {
  const series: any[] = [
    {
      name: '当期',
      type: 'line',
      data: props.data,
      itemStyle: { color: '#67c23a' },
      areaStyle: props.areaStyle ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103, 194, 58, 0.2)' },
          { offset: 1, color: 'rgba(103, 194, 58, 0)' }
        ])
      } : undefined
    }
  ]

  if (props.compareData) {
    series.push({
      name: '同期',
      type: 'line',
      data: props.compareData,
      itemStyle: { color: '#909399' },
      lineStyle: { type: 'dashed' }
    })
  }

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      formatter: (params: any) => {
        const date = params[0].data.date
        const current = params[0].data.value
        const previous = params[1]?.data.value
        let text = `${date}<br/>当期: ${current}`
        if (previous) {
          const yoy = ((current - previous) / previous * 100).toFixed(2)
          text += `<br/>同比: ${yoy}%`
        }
        return text
      }
    },
    legend: {
      data: ['当期', '同期'],
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
      boundaryGap: false,
      data: props.data.map(item => item.date),
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { color: '#909399' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4c4d4f' } },
      axisLabel: { color: '#909399' },
      splitLine: { lineStyle: { color: '#2c3036' } }
    },
    series
  }
}

// 导出CSV
async function exportCSV() {
  if (!props.data) return
  
  const header = ['日期', '当期值', '同期值']
  const rows = props.data.map((item, index) => {
    const row = [
      item.date,
      item.value.toString(),
      props.compareData?.[index]?.value.toString() || '-'
    ]
    return row.join(',')
  })
  
  const csv = [header.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${props.title || '趋势图'}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`)
}

// 导出图片
async function exportImage() {
  if (!chart) return
  const dataURL = chart.getDataURL({
    type: 'png',
    backgroundColor: '#23272e'
  })
  const blob = await (await fetch(dataURL)).blob()
  saveAs(blob, `${props.title || '趋势图'}_${dayjs().format('YYYYMMDD_HHmmss')}.png`)
}

// 初始化图表
function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  updateChart()
  window.addEventListener('resize', handleResize)
}

// 更新图表
function updateChart() {
  if (!chart) return
  const option = getChartOption()
  chart.setOption(option)
}

// 窗口大小变化处理
function handleResize() {
  chart?.resize()
}

// 监听属性变化
watch(() => props.data, updateChart, { deep: true })

// 生命周期
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.trend-chart-container {
  width: 100%;
  height: 100%;
  background: #23272e;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #e0e6ed;
  cursor: help;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.trend-chart {
  flex: 1;
  min-height: 0;
}

:deep(.el-button) {
  background: #2c3036;
  border-color: #4c4d4f;
  color: #909399;
}

:deep(.el-button:hover) {
  background: #409eff;
  border-color: #409eff;
  color: #ffffff;
}
</style> 