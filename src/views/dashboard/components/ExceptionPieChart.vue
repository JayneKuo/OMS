<template>
  <div class="exception-pie-chart">
    <div class="metrics">
      <div 
        v-for="item in data" 
        :key="item.type"
        class="metric-item"
        :style="{ '--item-color': item.color }"
      >
        <div class="info">
          <span class="color-dot"></span>
          <span class="type">{{ item.type }}</span>
          <span class="value">{{ item.value }}</span>
        </div>
        <div class="percentage-bar">
          <div class="bar" :style="{ width: getPercentage(item.value) + '%' }"></div>
        </div>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface ExceptionData {
  type: string
  value: number
  color: string
}

const props = defineProps<{
  data: ExceptionData[]
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 计算总数
const total = computed(() => {
  return props.data.reduce((sum, item) => sum + item.value, 0)
})

// 计算百分比
const getPercentage = (value: number) => {
  return ((value / total.value) * 100).toFixed(1)
}

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value, 'dark')
  updateChart()
}

const updateChart = () => {
  if (!chart) return
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        data: props.data.map(item => ({
          name: item.type,
          value: item.value,
          itemStyle: {
            color: item.color
          }
        }))
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
.exception-pie-chart {
  height: 100%;
  display: flex;
  padding: 20px;
  gap: 20px;
  
  .metrics {
    width: 240px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .metric-item {
      --item-color: var(--el-color-primary);
      
      .info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        
        .color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--item-color);
        }
        
        .type {
          flex: 1;
          font-size: 14px;
          color: #fff;
        }
        
        .value {
          font-size: 15px;
          font-weight: 500;
          color: var(--item-color);
        }
      }
      
      .percentage-bar {
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        
        .bar {
          height: 100%;
          background: var(--item-color);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      }
    }
  }
  
  .chart-container {
    flex: 1;
    height: 100%;
  }
}
</style> 