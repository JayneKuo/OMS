<!-- 退款趋势图表组件 -->
<template>
  <div class="refund-trend-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface TrendData {
  date: string
  amount: number
  count: number
}

interface Props {
  data: TrendData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  barClick: [data: TrendData]
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value, 'dark')
  
  chart.on('click', (params: any) => {
    if (params.data) {
      emit('barClick', params.data.rawData)
    }
  })
  
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chart) return
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      formatter: (params: any) => {
        const data = params[0]
        return `
          <div style="line-height: 1.6;">
            <strong>${data.name}</strong><br/>
            <span style="color: #909399;">退款金额：</span>¥${formatNumber(data.value)}<br/>
            <span style="color: #909399;">退款笔数：</span>${data.data.rawData?.count || 0}笔
          </div>
        `
      }
    },
    legend: {
      data: ['退款金额'],
      textStyle: {
        color: '#909399'
      }
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.date),
      axisPointer: {
        type: 'shadow'
      },
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
      name: '退款金额(元)',
      nameTextStyle: {
        color: '#909399'
      },
      axisLine: {
        lineStyle: {
          color: '#4c4d4f'
        }
      },
      axisLabel: {
        color: '#909399',
        formatter: (value: number) => {
          if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}万`
          }
          return value.toString()
        }
      },
      splitLine: {
        lineStyle: {
          color: '#2c3036'
        }
      }
    },
    series: [
      {
        name: '退款金额',
        type: 'bar',
        data: props.data.map(item => ({
          value: item.amount,
          rawData: item
        })),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ff6b81' },
            { offset: 1, color: '#ff8fab' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ff5722' },
              { offset: 1, color: '#ff7043' }
            ])
          }
        },
        barWidth: '60%'
      }
    ]
  }
  
  chart.setOption(option)
}

// 格式化数字
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('zh-CN').format(Math.round(num))
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
.refund-trend-chart {
  width: 100%;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 300px;
}
</style> 