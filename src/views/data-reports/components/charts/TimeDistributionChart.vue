<!-- 时间分布图表组件 -->
<template>
  <div class="time-distribution-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface TimeData {
  time: string
  value: number
}

interface Props {
  data: TimeData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value, 'dark')
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chart) return
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `
          <div style="line-height: 1.6;">
            <strong>${data.name}</strong><br/>
            <span style="color: #909399;">退款数量：</span>${data.value}笔
          </div>
        `
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
      name: '退款数量',
      nameTextStyle: {
        color: '#909399'
      },
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399'
      },
      splitLine: {
        lineStyle: {
          color: '#2c3036'
        }
      }
    },
    series: [
      {
        name: '退款数量',
        type: 'line',
        data: props.data.map(item => item.value),
        smooth: true,
        lineStyle: {
          color: '#4ecdc4',
          width: 3
        },
        itemStyle: {
          color: '#4ecdc4'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
            { offset: 1, color: 'rgba(78, 205, 196, 0.1)' }
          ])
        }
      }
    ]
  }
  
  chart.setOption(option as any)
}

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// 监听loading状态
watch(() => props.loading, (loading) => {
  if (chart) {
    if (loading) {
      chart.showLoading()
    } else {
      chart.hideLoading()
    }
  }
})

// 生命周期
onMounted(() => {
  initChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})

onUnmounted(() => {
  chart?.dispose()
})
</script>

<style scoped>
.time-distribution-chart {
  width: 100%;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 250px;
}
</style> 