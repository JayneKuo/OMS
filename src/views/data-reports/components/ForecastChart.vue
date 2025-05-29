<template>
  <el-card class="forecast-chart-card">
    <div class="card-title">销量预测趋势</div>
    <div ref="chartRef" class="forecast-chart"></div>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
const props = defineProps<{ forecastData: any[], impactData: any[] }>()
const chartRef = ref()
let chart: echarts.ECharts | null = null
const renderChart = () => {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value, 'dark')
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['销量', '转化量', '流量'] },
    xAxis: { type: 'category', data: props.forecastData.map(i => i.date) },
    yAxis: { type: 'value' },
    series: [
      { name: '销量', type: 'line', data: props.forecastData.map(i => i.sales) },
      { name: '转化量', type: 'line', data: props.forecastData.map(i => i.conversion) },
      { name: '流量', type: 'line', data: props.forecastData.map(i => i.traffic) }
    ]
  })
}
onMounted(renderChart)
watch(() => props.forecastData, renderChart, { deep: true })
</script>
<style scoped>
.forecast-chart-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background: #23272e;
  color: #e0e6ed;
}
.forecast-chart {
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