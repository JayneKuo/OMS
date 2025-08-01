<template>
  <div class="channel-performance-chart">
    <div class="chart-header">
      <div class="metrics">
        <div class="metric-item" v-for="(metric, channel) in totalMetrics" :key="channel">
          <span class="label">{{ channel }}</span>
          <span class="value" :style="{ color: getChannelColor(channel) }">{{ metric.total }}</span>
          <span class="trend" :class="metric.trend">
            <el-icon><component :is="metric.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
            {{ metric.percentage }}%
          </span>
        </div>
      </div>
      <div class="legend">
        <div class="legend-item" v-for="channel in channels" :key="channel" @click="toggleChannel(channel)">
          <span class="color-dot" :style="{ backgroundColor: getChannelColor(channel) }"></span>
          <span class="label" :class="{ 'disabled': !activeChannels.includes(channel) }">{{ channel }}</span>
        </div>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import 'echarts/theme/dark'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps<{
  data: Array<{
    date: string
    shopify: number
    amazon: number
    walmart: number
    ebay: number
  }>
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const channels = ['Shopify', 'Amazon', 'Walmart', 'eBay']
const activeChannels = ref(channels)

const channelColors = {
  Shopify: '#95de64',
  Amazon: '#69c0ff',
  Walmart: '#ffd666',
  eBay: '#ff9c6e'
}

const getChannelColor = (channel: string) => channelColors[channel as keyof typeof channelColors]

const toggleChannel = (channel: string) => {
  const index = activeChannels.value.indexOf(channel)
  if (index > -1) {
    if (activeChannels.value.length > 1) {
      activeChannels.value.splice(index, 1)
    }
  } else {
    activeChannels.value.push(channel)
  }
  updateChart()
}

const totalMetrics = computed(() => {
  const result: Record<string, { total: number; trend: 'up' | 'down'; percentage: number }> = {}
  
  channels.forEach(channel => {
    const channelData = props.data.map(d => d[channel.toLowerCase() as keyof typeof d] as number)
    const total = channelData.reduce((sum, val) => sum + val, 0)
    const prevTotal = channelData.slice(0, -1).reduce((sum, val) => sum + val, 0)
    const percentage = prevTotal ? Math.round((total - prevTotal) / prevTotal * 100) : 0
    
    result[channel] = {
      total,
      trend: percentage >= 0 ? 'up' : 'down',
      percentage: Math.abs(percentage)
    }
  })
  
  return result
})

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return
  
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.data.map(d => d.date),
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
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
          color: '#E5E7EB',
          type: 'dashed'
        }
      }
    },
    series: activeChannels.value.map(channel => ({
      name: channel,
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: props.data.map(d => d[channel.toLowerCase() as keyof typeof d]),
      itemStyle: {
        color: getChannelColor(channel)
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: echarts.color.stringify(echarts.color.lerp(0.6, echarts.color.parse(getChannelColor(channel))!, { r: 255, g: 255, b: 255, a: 1 }))
          },
          {
            offset: 1,
            color: echarts.color.stringify(echarts.color.lerp(0.9, echarts.color.parse(getChannelColor(channel))!, { r: 255, g: 255, b: 255, a: 1 }))
          }
        ])
      }
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
watch(() => activeChannels.value, updateChart, { deep: true })
</script>

<style lang="scss" scoped>
.channel-performance-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .chart-header {
    padding: 0 16px;
    
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
      
      .metric-item {
        padding: 16px;
        border-radius: 12px;
        background: var(--el-bg-color-page);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--el-box-shadow-light);
        }
        
        .label {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          
          &.up {
            background: var(--el-color-success-light-9);
            color: var(--el-color-success);
          }
          
          &.down {
            background: var(--el-color-danger-light-9);
            color: var(--el-color-danger);
          }
          
          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
    
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 16px;
      background: var(--el-bg-color-page);
      border-radius: 12px;
      margin-bottom: 16px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--el-bg-color);
          transform: translateY(-1px);
        }
        
        .color-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .label {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-regular);
          transition: all 0.3s ease;
          
          &.disabled {
            color: var(--el-text-color-placeholder);
          }
        }
        
        &:hover .color-dot {
          transform: scale(1.2);
        }
      }
    }
  }
  
  .chart-container {
    flex: 1;
    min-height: 300px;
    padding: 16px;
    border-radius: 12px;
    background: var(--el-bg-color-page);
  }
}
</style> 