<!-- 分析面板组件 -->
<template>
  <div class="analysis-panel">
    <!-- 时间范围选择 -->
    <div class="time-range">
      <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
        <el-radio-button label="7d">近7天</el-radio-button>
        <el-radio-button label="30d">近30天</el-radio-button>
        <el-radio-button label="90d">近90天</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 销量趋势 -->
    <div class="chart-section">
      <div class="chart-placeholder">
        <div class="placeholder-content">
          <h4>销量趋势</h4>
          <p>图表加载中...</p>
        </div>
      </div>
    </div>

    <!-- 流量分析 -->
    <div class="chart-section">
      <div class="chart-placeholder">
        <div class="placeholder-content">
          <h4>流量趋势</h4>
          <p>图表加载中...</p>
        </div>
      </div>
    </div>

    <!-- 退款分析 -->
    <div class="chart-section">
      <div class="chart-placeholder">
        <div class="placeholder-content">
          <h4>退款趋势</h4>
          <p>图表加载中...</p>
        </div>
      </div>
    </div>

    <!-- 渠道分布 -->
    <div class="chart-section">
      <div class="chart-title">渠道分布</div>
      <div class="channel-list">
        <div v-for="channel in channels" :key="channel.value" class="channel-item">
          <span class="channel-name">{{ channel.label }}</span>
          <span class="channel-value">{{ channel.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

interface TrendDataItem {
  date: string
  value: number
}

interface TrendData {
  current: TrendDataItem[]
  previous?: TrendDataItem[]
}

interface Channel {
  label: string
  value: string
}

interface Props {
  data: {
    sales?: TrendData
    traffic?: TrendData
    refund?: TrendData
  }
  channels?: Channel[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'timeRangeChange', range: string): void
}>()

const timeRange = ref('30d')

function handleTimeRangeChange(range: string) {
  emit('timeRangeChange', range)
}
</script>

<style scoped>
.analysis-panel {
  margin-top: 20px;
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
}

.time-range {
  margin-bottom: 20px;
}

.chart-section {
  height: 400px;
  margin-bottom: 20px;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  border: 2px dashed var(--el-border-color);
}

.placeholder-content {
  text-align: center;
  color: var(--el-text-color-secondary);
}

.placeholder-content h4 {
  margin: 0 0 8px 0;
  color: var(--el-text-color-primary);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.channel-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

.channel-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
}

.channel-name {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.channel-value {
  color: var(--el-text-color-secondary);
}
</style> 