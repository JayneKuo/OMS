<template>
  <div class="source-distribution-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  data: Array<{
    source: string
    value: number
    color: string
    growth: string
    orders: number
  }>
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 生成7天的数据
const generateDailyData = () => {
  const days = 7
  const result = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    const dayData = {
      date: dateStr,
      Website: Math.round(180 + Math.random() * 20 - 10),
      'Mobile App': Math.round(60 + Math.random() * 10 - 5),
      API: Math.round(30 + Math.random() * 6 - 3),
      Manual: Math.round(10 + Math.random() * 4 - 2)
    }

    result.push(dayData)
  }

  return result
}

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value, 'dark')
  updateChart()
}

const updateChart = () => {
  if (!chart) return
  
  const dailyData = generateDailyData()
  const channels = ['Website', 'Mobile App', 'API', 'Manual']
  const colors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444']
  
  const option: EChartsOption = {
    title: {
      text: 'E-commerce Channel Distribution Trend',
      left: '20',
      top: '20',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
    legend: {
      data: channels,
      right: '20',
      top: '20',
      textStyle: {
        color: '#888'
      },
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle'
    },
    grid: {
      left: '40',
      right: '40',
      top: '80',
      bottom: '40',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dailyData.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#888',
        fontSize: 12
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#888',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    series: channels.map((channel, index) => ({
      name: channel,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      sampling: 'average',
      data: dailyData.map(item => item[channel]),
      itemStyle: {
        color: colors[index],
        borderColor: '#fff',
        borderWidth: 2
      },
      lineStyle: {
        width: 3
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderWidth: 3
        }
      },
      showSymbol: false,
      symbolSize: 6
    }))
  }
  
  chart.setOption(option)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', updateChart)
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', updateChart)
})

watch(() => props.data, updateChart, { deep: true })
</script>

<style lang="scss" scoped>
.source-distribution-chart {
  height: 100%;
  background-color: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style> 