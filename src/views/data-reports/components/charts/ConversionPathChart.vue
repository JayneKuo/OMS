<!-- 转化路径图组件 -->
<template>
  <div class="conversion-path-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  data: Array<{
    source: string
    target: string
    value: number
  }>
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chart) return

  // 获取所有节点
  const nodes = Array.from(new Set([
    ...props.data.map(item => item.source),
    ...props.data.map(item => item.target)
  ])).map(name => ({
    name,
    itemStyle: {
      color: '#409eff'
    }
  }))

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} -> ${params.data.target}<br/>转化量: ${params.data.value}`
        }
        return params.name
      }
    },
    series: [
      {
        type: 'sankey',
        left: 50,
        right: 50,
        emphasis: {
          focus: 'adjacency'
        },
        data: nodes,
        links: props.data,
        orient: 'horizontal',
        label: {
          color: '#e0e6ed',
          position: 'top'
        },
        lineStyle: {
          color: 'source',
          opacity: 0.3,
          curveness: 0.5
        }
      }
    ]
  }

  chart.setOption(option)
}

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

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
.conversion-path-chart {
  width: 100%;
  height: 100%;
}
</style> 