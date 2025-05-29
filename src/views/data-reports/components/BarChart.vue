<template>
  <div class="bar-chart-container">
    <div class="chart-title">{{ title }}</div>
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface DataItem {
  [key: string]: any
}

const props = defineProps<{
  barData: DataItem[]
  xKey: string
  yKey: string
  title?: string
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
}

const updateChart = () => {
  if (!chart) return

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(35, 39, 46, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: {
        color: '#e0e6ed'
      }
    },
    xAxis: {
      type: 'category',
      data: props.barData.map(item => item[props.xKey]),
      axisLabel: {
        color: '#909399',
        interval: 0,
        rotate: 45,
        formatter: function(value: string) {
          if (value.startsWith('SKU')) {
            return value.slice(3)
          }
          return value
        }
      },
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399',
        formatter: function(value: number) {
          if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'k'
          }
          return value.toString()
        }
      }
    },
    series: [{
      type: 'bar',
      data: props.barData.map(item => ({
        value: item[props.yKey],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.3)' }
          ])
        }
      })),
      barWidth: '40%',
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#67c23a' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.3)' }
          ])
        }
      },
      label: {
        show: true,
        position: 'top',
        color: '#909399',
        fontSize: 12
      }
    }]
  }

  chart.setOption(option as echarts.EChartsOption)
}

// 监听数据变化
watch(() => props.barData, () => {
  updateChart()
}, { deep: true })

// 初始化图表
onMounted(() => {
  initChart()
  updateChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})

// 组件销毁时清理
onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<style scoped>
.bar-chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 14px;
  color: #909399;
  text-align: center;
  margin-bottom: 8px;
}

.chart-content {
  flex: 1;
  width: 100%;
}
</style> 