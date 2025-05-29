<!-- 访问趋势图组件 -->
<template>
  <div class="visit-trend-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  data: Array<{
    time: string
    value: number
  }>
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chart) return

  const option: EChartsOption = {
    grid: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#4c4d4f'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.time),
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399'
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#2a2e35'
        }
      },
      axisLabel: {
        color: '#909399'
      }
    },
    series: [
      {
        type: 'line',
        data: props.data.map(item => item.value),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: '#409eff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64, 158, 255, 0.2)'
            },
            {
              offset: 1,
              color: 'rgba(64, 158, 255, 0)'
            }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// 组件挂载时初始化
onMounted(() => {
  initChart()
})

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
})

// 监听窗口大小变化
window.addEventListener('resize', () => {
  if (chart) {
    chart.resize()
  }
})
</script>

<style lang="scss" scoped>
.visit-trend-chart {
  width: 100%;
  height: 100%;
}
</style> 