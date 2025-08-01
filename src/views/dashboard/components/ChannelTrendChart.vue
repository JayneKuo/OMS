<template>
  <div class="channel-trend-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface DailyData {
  date: string
  Shopify: number
  Amazon: number
  Walmart: number
  eBay: number
  [key: string]: string | number
}

const props = defineProps<{
  data: DailyData[]
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#333',
          type: 'dashed'
        }
      }
    },
    legend: {
      data: ['Shopify', 'Amazon', 'Walmart', 'eBay'],
      right: '3%',
      top: '3%',
      textStyle: {
        color: '#888'
      },
      itemWidth: 15,
      itemHeight: 15,
      itemStyle: {
        borderWidth: 0
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jul 22', 'Jul 23', 'Jul 24', 'Jul 25', 'Jul 26', 'Jul 27', 'Jul 28'],
      axisLine: {
        lineStyle: {
          color: '#333'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        margin: 15
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#1a1a1a',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 180,
      interval: 45,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        margin: 15,
        formatter: '{value}'
      },
      splitLine: {
        lineStyle: {
          color: '#1a1a1a',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'Shopify',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: '#96bf48',
          borderColor: '#fff',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(150, 191, 72, 0.3)',
          shadowBlur: 10
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(150, 191, 72, 0.2)' },
              { offset: 1, color: 'rgba(150, 191, 72, 0)' }
            ]
          }
        }
      },
      {
        name: 'Amazon',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [90, 95, 88, 92, 98, 102, 105],
        itemStyle: {
          color: '#ff9900',
          borderColor: '#fff',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(255, 153, 0, 0.3)',
          shadowBlur: 10
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 153, 0, 0.2)' },
              { offset: 1, color: 'rgba(255, 153, 0, 0)' }
            ]
          }
        }
      },
      {
        name: 'Walmart',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [40, 42, 38, 41, 44, 46, 48],
        itemStyle: {
          color: '#0071ce',
          borderColor: '#fff',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0, 113, 206, 0.3)',
          shadowBlur: 10
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 113, 206, 0.2)' },
              { offset: 1, color: 'rgba(0, 113, 206, 0)' }
            ]
          }
        }
      },
      {
        name: 'eBay',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [28, 30, 27, 29, 31, 32, 33],
        itemStyle: {
          color: '#e53238',
          borderColor: '#fff',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(229, 50, 56, 0.3)',
          shadowBlur: 10
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(229, 50, 56, 0.2)' },
              { offset: 1, color: 'rgba(229, 50, 56, 0)' }
            ]
          }
        }
      }
    ]
  } as echarts.EChartsOption

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
.channel-trend-chart {
  width: 100%;
  height: 100%;
  
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style> 