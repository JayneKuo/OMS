<template>
  <el-card class="impact-pie-card">
    <div class="card-title">影响因子分布</div>
    <div ref="pieRef" class="pie-chart"></div>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
const props = defineProps<{ impactData: any[] }>()
const pieRef = ref()
let chart: echarts.ECharts | null = null
const renderChart = () => {
  if (!pieRef.value) return
  if (!chart) chart = echarts.init(pieRef.value, 'dark')
  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: props.impactData,
      label: { show: true, formatter: '{b}: {d}%' }
    }]
  })
}
onMounted(renderChart)
watch(() => props.impactData, renderChart, { deep: true })
</script>
<style scoped>
.impact-pie-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background: #23272e;
  color: #e0e6ed;
}
.pie-chart {
  width: 100%;
  height: 260px;
}
.card-title {
  font-size: 14px;
  color: #8a919f;
  margin-bottom: 8px;
  text-align: center;
}
</style> 