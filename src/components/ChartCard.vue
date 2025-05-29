<template>
  <div class="chart-card">
    <div class="chart-header" v-if="showHeader">
      <div class="chart-title">
        <el-tooltip :content="title + '说明'" placement="top">
          <span>{{ title }}</span>
        </el-tooltip>
      </div>
      <div class="chart-controls" v-if="enableExport">
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
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'

interface Props {
  title?: string
  showHeader?: boolean
  enableExport?: boolean
  xAxisData: string[]
  series: any[]
  yAxisName?: string
  yAxis2Name?: string
  isDualAxis?: boolean
  legend?: string[]
  darkTheme?: boolean
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  enableExport: true,
  yAxisName: '',
  yAxis2Name: '',
  isDualAxis: false,
  darkTheme: true,
  height: 300
})

const emit = defineEmits<{
  (e: 'click', data: any): void
  (e: 'legendSelect', selected: Record<string, boolean>): void
}>()

const chartRef = ref<HTMLElement>()
let chart: ECharts | null = null

// 获取图表配置
function getChartOption(): EChartsOption {
  const baseOption: EChartsOption = {
    backgroundColor: props.darkTheme ? 'transparent' : undefined,
    tooltip: {
      trigger: 'axis',
      backgroundColor: props.darkTheme ? 'rgba(35, 39, 46, 0.9)' : undefined,
      borderColor: props.darkTheme ? '#4c4d4f' : undefined,
      textStyle: { color: props.darkTheme ? '#e0e6ed' : undefined }
    },
    legend: {
      data: props.legend,
      type: 'scroll',
      orient: 'horizontal',
      top: 0,
      right: 10,
      textStyle: { color: props.darkTheme ? '#909399' : undefined }
    },
    grid: {
      top: props.legend?.length ? 60 : 30,
      left: '5%',
      right: '5%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.xAxisData,
      axisLine: { 
        lineStyle: { color: props.darkTheme ? '#4c4d4f' : undefined } 
      },
      axisLabel: { color: props.darkTheme ? '#909399' : undefined }
    },
    yAxis: props.isDualAxis ? [
      {
        type: 'value',
        name: props.yAxisName,
        axisLine: { 
          lineStyle: { color: props.darkTheme ? '#4c4d4f' : undefined } 
        },
        axisLabel: { color: props.darkTheme ? '#909399' : undefined }
      },
      {
        type: 'value',
        name: props.yAxis2Name,
        axisLine: { 
          lineStyle: { color: props.darkTheme ? '#4c4d4f' : undefined } 
        },
        axisLabel: { color: props.darkTheme ? '#909399' : undefined }
      }
    ] : {
      type: 'value',
      name: props.yAxisName,
      axisLine: { 
        lineStyle: { color: props.darkTheme ? '#4c4d4f' : undefined } 
      },
      axisLabel: { color: props.darkTheme ? '#909399' : undefined }
    },
    series: props.series
  }

  return baseOption
}

// 导出CSV
async function exportCSV() {
  if (!props.series || !props.xAxisData) return
  
  const header = ['日期', ...props.legend || []]
  const rows = props.xAxisData.map((date, index) => {
    const values = props.series.map(s => s.data[index])
    return [date, ...values].join(',')
  })
  
  const csv = [header.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${props.title || 'chart'}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`)
}

// 导出PNG
async function exportImage() {
  if (!chart) return
  const dataURL = chart.getDataURL({
    type: 'png',
    backgroundColor: props.darkTheme ? '#23272e' : '#ffffff'
  })
  const blob = await (await fetch(dataURL)).blob()
  saveAs(blob, `${props.title || 'chart'}_${dayjs().format('YYYYMMDD_HHmmss')}.png`)
}

// 初始化图表
function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  
  chart.on('click', (params: echarts.ECElementEvent) => {
    emit('click', params)
  })
  
  chart.on('legendselectchanged', (params: { selected: Record<string, boolean> }) => {
    emit('legendSelect', params.selected)
  })
  
  window.addEventListener('resize', handleResize)
  updateChart()
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
watch(
  () => [props.series, props.xAxisData],
  () => updateChart(),
  { deep: true }
)

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
.chart-card {
  width: 100%;
  height: v-bind('`${props.height}px`');
  background: v-bind('props.darkTheme ? "#23272e" : "#ffffff"');
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
  color: v-bind('props.darkTheme ? "#e0e6ed" : "#303133"');
  cursor: help;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.chart-content {
  flex: 1;
  min-height: 0;
}

:deep(.el-button) {
  background: v-bind('props.darkTheme ? "#2c3036" : "#f5f7fa"');
  border-color: v-bind('props.darkTheme ? "#4c4d4f" : "#dcdfe6"');
  color: v-bind('props.darkTheme ? "#909399" : "#606266"');
}

:deep(.el-button:hover) {
  background: #409eff;
  border-color: #409eff;
  color: #ffffff;
}
</style> 