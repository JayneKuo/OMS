<template>
  <div class="exception-chart">
    <div class="summary">
      <div class="total-exceptions">
        <span class="label">Total Exceptions</span>
        <span class="value">{{ totalExceptions }}</span>
      </div>
      <div class="exception-list">
        <div 
          v-for="item in exceptionData" 
          :key="item.name"
          class="exception-item"
          :style="{ '--item-color': item.color }"
        >
          <div class="info">
            <span class="color-dot"></span>
            <span class="name">{{ item.name }}</span>
          </div>
          <div class="stats">
            <span class="count">{{ item.value }}</span>
            <span class="percentage">{{ ((item.value / totalExceptions) * 100).toFixed(1) }}%</span>
          </div>
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

const props = defineProps<{
  data: Array<{
    date: string
    hold: number
    allocate: number
    dc: number
    inventory: number
  }>
}>()

// 计算异常数据
const exceptionData = computed(() => {
  const latestData = props.data[props.data.length - 1]
  return [
    {
      name: 'On Hold',
      value: latestData.hold,
      color: '#ff9c6e'
    },
    {
      name: 'Allocation Failed',
      value: latestData.allocate,
      color: '#ffd666'
    },
    {
      name: 'DC Response Failed',
      value: latestData.dc,
      color: '#95de64'
    },
    {
      name: 'Out of Stock',
      value: latestData.inventory,
      color: '#69c0ff'
    }
  ]
})

// 计算总异常数
const totalExceptions = computed(() => {
  return exceptionData.value.reduce((sum, item) => sum + item.value, 0)
})

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return
  
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: false
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
        data: exceptionData.value.map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color
          }
        }))
      }
    ]
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
.exception-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  
  .summary {
    margin-bottom: 24px;
    
    .total-exceptions {
      text-align: center;
      margin-bottom: 24px;
      
      .label {
        display: block;
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-bottom: 8px;
      }
      
      .value {
        font-size: 32px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        font-feature-settings: "tnum";
      }
    }
    
    .exception-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      
      .exception-item {
        --item-color: var(--el-color-primary);
        padding: 16px;
        border-radius: 8px;
        background: var(--el-bg-color-page);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--el-box-shadow-light);
        }
        
        .info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          
          .color-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--item-color);
          }
          
          .name {
            font-size: 14px;
            font-weight: 500;
            color: var(--el-text-color-primary);
          }
        }
        
        .stats {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          
          .count {
            font-size: 24px;
            font-weight: 600;
            color: var(--item-color);
            font-feature-settings: "tnum";
          }
          
          .percentage {
            font-size: 14px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }
  
  .chart-container {
    flex: 1;
    min-height: 300px;
  }
}
</style> 