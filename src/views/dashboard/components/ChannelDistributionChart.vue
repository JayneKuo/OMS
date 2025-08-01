<template>
  <div class="channel-distribution-chart">
    <div class="chart-header">
      <div class="total-orders">
        <span class="label">Total Orders</span>
        <span class="value">{{ totalOrders.toLocaleString() }}</span>
      </div>
      <div class="period-selector">
        <el-radio-group v-model="selectedPeriod" size="small">
          <el-radio-button label="day">Day</el-radio-button>
          <el-radio-button label="week">Week</el-radio-button>
          <el-radio-button label="month">Month</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
    <div class="distribution-list">
      <div 
        v-for="item in data" 
        :key="item.channel" 
        class="distribution-item"
        :style="setChannelColor(item.color)"
      >
        <div class="info">
          <span class="color-dot" :style="{ backgroundColor: item.color }"></span>
          <div class="channel-info">
            <span class="channel">{{ item.channel }}</span>
            <span class="growth" :class="{ 'positive': item.growth.startsWith('+') }">
              {{ item.growth }}
              <el-icon class="trend-icon">
                <component :is="item.growth.startsWith('+') ? 'ArrowUpBold' : 'ArrowDownBold'" />
              </el-icon>
            </span>
          </div>
        </div>
        <div class="stats">
          <div class="stat-group">
            <span class="percentage">{{ item.value }}</span>
            <span class="count">{{ item.orders.toLocaleString() }} orders</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  data: Array<{
    channel: string
    value: number
    color: string
  }>
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
const selectedPeriod = ref('day')

const totalOrders = computed(() => {
  return props.data.reduce((sum, item) => sum + item.orders, 0)
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
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
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
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: props.data.map(item => ({
          name: item.channel,
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
watch(() => selectedPeriod.value, updateChart)

// 添加计算属性来设置渠道颜色
const setChannelColor = (color: string) => {
  return { '--channel-color': color } as any
}
</script>

<style lang="scss" scoped>
.channel-distribution-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 0 16px;
    
    .total-orders {
      padding: 16px 24px;
      background: linear-gradient(135deg, var(--el-color-primary-light-8), var(--el-color-primary-light-9));
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      
      .label {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        margin-bottom: 4px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      
      .value {
        font-size: 32px;
        font-weight: 700;
        color: var(--el-color-primary);
        line-height: 1.2;
      }
    }
    
    .period-selector {
      .el-radio-group {
        padding: 4px;
        background: var(--el-bg-color-page);
        border-radius: 8px;
        
        .el-radio-button__inner {
          border: none;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          
          &:hover {
            color: var(--el-color-primary);
          }
        }
        
        .el-radio-button__original-radio:checked + .el-radio-button__inner {
          background: var(--el-color-primary);
          box-shadow: none;
        }
      }
    }
  }
  
  .chart-container {
    flex: 1;
    min-height: 240px;
    padding: 16px;
    background: var(--el-bg-color-page);
    border-radius: 12px;
    margin-bottom: 24px;
  }
  
  .distribution-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    padding: 0 16px;
    
    .distribution-item {
      position: relative;
      padding: 20px;
      border-radius: 12px;
      background: var(--el-bg-color-page);
      transition: all 0.3s ease;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--channel-color, var(--el-color-primary));
        opacity: 0.5;
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--el-box-shadow-light);
        
        &::before {
          opacity: 1;
        }
      }
      
      .info {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        
        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        
        .channel-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .channel {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
          
          .growth {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            
            &.positive {
              background: var(--el-color-success-light-9);
              color: var(--el-color-success);
            }
            
            &:not(.positive) {
              background: var(--el-color-danger-light-9);
              color: var(--el-color-danger);
            }
            
            .trend-icon {
              font-size: 12px;
            }
          }
        }
      }
      
      .stats {
        .stat-group {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          
          .percentage {
            font-size: 28px;
            font-weight: 700;
            color: var(--el-text-color-primary);
            
            &::after {
              content: '%';
              font-size: 16px;
              font-weight: 500;
              margin-left: 2px;
              color: var(--el-text-color-secondary);
            }
          }
          
          .count {
            font-size: 14px;
            color: var(--el-text-color-secondary);
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style> 