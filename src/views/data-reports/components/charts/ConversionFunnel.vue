<!-- 转化漏斗图组件 -->
<template>
  <div class="conversion-funnel" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  data: Array<{
    name: string
    value: number
    rate: number
    trend: number
    color: string
  }>
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'stage-click', stage: any): void
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  chart.on('click', (params) => {
    emit('stage-click', props.data[params.dataIndex])
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
            <div>数量：${data.value.toLocaleString()}</div>
            <div>转化率：${data.rate}%</div>
            <div>环比：${(data.trend >= 0 ? '+' : '') + data.trend}%</div>
          </div>
        `
      }
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        top: 20,
        bottom: 20,
        width: '80%',
        minSize: '20%',
        maxSize: '100%',
        sort: 'none',
        gap: 10,
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            const data = props.data[params.dataIndex]
            return [
              `{name|${params.name}}`,
              `{value|${params.value.toLocaleString()}}`,
              `{rate|转化率: ${data.rate}%}`
            ].join('\n')
          },
          rich: {
            name: {
              fontSize: 14,
              color: '#e0e6ed',
              padding: [0, 0, 5, 0]
            },
            value: {
              fontSize: 12,
              color: '#909399',
              padding: [0, 0, 5, 0]
            },
            rate: {
              fontSize: 12,
              color: '#409eff'
            }
          }
        },
        labelLine: {
          length: 20,
          lineStyle: {
            color: '#4c4d4f'
          }
        },
        itemStyle: {
          borderWidth: 0
        },
        emphasis: {
          label: {
            fontSize: 15
          }
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
.conversion-funnel {
  width: 100%;
  height: 100%;
}
</style> 