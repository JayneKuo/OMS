<!-- 流量来源分布图组件 -->
<template>
  <div class="traffic-source-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  data: Array<{
    name: string
    value: number
    percentage: number
    color: string
    conversionRate: number
    bounceRate: number
  }>
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'source-click', source: any): void
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  chart.on('click', (params) => {
    emit('source-click', props.data[params.dataIndex])
  })
  
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chart) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = props.data[params.dataIndex]
        return `
          <div style="padding: 8px">
            <div style="font-weight: 500; margin-bottom: 4px">${data.name}</div>
            <div>访问量：${data.value.toLocaleString()}</div>
            <div>占比：${data.percentage}%</div>
            <div>转化率：${data.conversionRate}%</div>
            <div>跳出率：${data.bounceRate}%</div>
          </div>
        `
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#23272e',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data.map(item => ({
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

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// 监听加载状态
watch(() => props.loading, (val) => {
  if (chart) {
    val ? chart.showLoading({
      text: '加载中...',
      maskColor: 'rgba(0, 0, 0, 0.1)',
      textColor: '#909399'
    }) : chart.hideLoading()
  }
})

// 组件挂载时初始化
onMounted(() => {
  initChart()
})

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
})

// 监听窗口大小变化
window.addEventListener('resize', () => {
  if (chart) {
    chart.resize()
  }
})
</script>

<style lang="scss" scoped>
.traffic-source-chart {
  width: 100%;
  height: 100%;
}
</style> 