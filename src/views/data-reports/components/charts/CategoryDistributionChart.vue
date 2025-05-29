<!-- 品类分布图表组件 -->
<template>
  <div class="category-distribution-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface CategoryData {
  name: string
  value: number
  percentage: number
}

interface Props {
  data: CategoryData[]
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
      trigger: 'item',
      formatter: (params: any) => {
        return `
          <div style="line-height: 1.6;">
            <strong>${params.name}</strong><br/>
            <span style="color: #909399;">数量：</span>${params.value}<br/>
            <span style="color: #909399;">占比：</span>${params.percent}%
          </div>
        `
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#909399'
      }
    },
    series: [
      {
        name: '品类分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#23272e',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#e0e6ed'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: ['#ff6b81', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][index % 6]
          }
        }))
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
.category-distribution-chart {
  width: 100%;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 250px;
}
</style> 