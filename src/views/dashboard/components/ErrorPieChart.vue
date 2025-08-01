<template>
  <div class="error-pie-chart">
    <div class="legend">
      <div 
        v-for="item in chartData" 
        :key="item.name"
        class="legend-item"
      >
        <div class="item-header">
          <span 
            class="color-dot"
            :style="{ backgroundColor: item.itemStyle.color }"
          ></span>
          <span class="name">{{ item.name }}</span>
        </div>
        <div class="value-bar">
          <div 
            class="bar"
            :style="{ 
              width: `${(item.value / total * 100).toFixed(0)}%`,
              backgroundColor: item.itemStyle.color
            }"
          ></div>
          <span class="value">{{ item.value }}</span>
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

interface ErrorData {
  type: string
  value: number
  color: string
}

const props = defineProps<{
  data: ErrorData[]
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const chartData = [
  { name: 'On Hold Orders', value: 8, itemStyle: { color: '#8B5CF6' } },
  { name: 'Allocation Failures', value: 6, itemStyle: { color: '#06B6D4' } },
  { name: 'DC Transmission Failures', value: 5, itemStyle: { color: '#F59E0B' } },
  { name: 'Insufficient Stock', value: 5, itemStyle: { color: '#EF4444' } },
  { name: 'Cancelled Allocations', value: 5, itemStyle: { color: '#3B82F6' } },
  { name: 'Unfulfilled Items', value: 5, itemStyle: { color: '#10B981' } }
]

const total = computed(() => chartData.reduce((sum, item) => sum + item.value, 0))

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
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
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
          borderColor: '#0a0a0a',
          borderWidth: 2,
          borderRadius: 4
        },
        label: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: chartData
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
.error-pie-chart {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px;
  gap: 40px;
  
  .legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px 0;
    
    .legend-item {
      .item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        
        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .name {
          color: #fff;
          font-size: 14px;
        }
      }
      
      .value-bar {
        position: relative;
        height: 24px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        
        .bar {
          height: 100%;
          transition: width 0.3s ease;
          opacity: 0.8;
        }
        
        .value {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          color: #fff;
          font-size: 14px;
          font-weight: 500;
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