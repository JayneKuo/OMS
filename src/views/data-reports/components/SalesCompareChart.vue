<template>
  <el-card class="compare-chart-card">
    <div class="card-title">历史/预测销量对比趋势图</div>
    <div ref="chartRef" class="compare-chart"></div>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
const props = defineProps<{ compareData: any[] }>()
const chartRef = ref()
let chart: echarts.ECharts | null = null
const renderChart = () => {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value, 'dark')
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['实际销量', '预测销量'] },
    xAxis: { type: 'category', data: props.compareData.map(i => i.date) },
    yAxis: { type: 'value' },
    series: [
      { name: '实际销量', type: 'line', data: props.compareData.map(i => i.actual) },
      { name: '预测销量', type: 'line', data: props.compareData.map(i => i.forecast) }
    ]
  })
}
onMounted(renderChart)
watch(() => props.compareData, renderChart, { deep: true })
</script>
<style scoped>
.compare-chart-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background: #23272e;
  color: #e0e6ed;
}
.compare-chart {
  width: 100%;
  height: 320px;
}
.card-title {
  font-size: 14px;
  color: #8a919f;
  margin-bottom: 8px;
  text-align: center;
}
</style> 