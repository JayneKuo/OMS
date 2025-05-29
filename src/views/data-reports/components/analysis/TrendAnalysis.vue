<!-- 销量趋势分析组件 -->
<template>
  <div class="trend-analysis">
    <div class="module-header">
      <div class="title-area">
        <h3>销量趋势分析</h3>
        <el-tooltip content="实时监控各平台销量趋势，支持异常检测和多维分析" placement="top">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      
      <div class="operation-area">
        <el-select v-model="selectedPlatform" placeholder="选择平台" class="platform-select">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        
        <el-select v-model="timeGranularity" placeholder="时间粒度" class="time-select">
          <el-option v-for="item in timeGranularities" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <div class="action-buttons">
          <el-button type="primary" plain size="small" @click="exportData">
            <el-icon><Download /></el-icon>导出数据
          </el-button>
          <el-button type="primary" plain size="small" @click="subscribeReport">
            <el-icon><Bell /></el-icon>订阅报告
          </el-button>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <div class="main-metrics">
        <div class="metric-card" @click="showTrendDetail('sales')">
          <span class="label">累计销量</span>
          <span class="value">{{ formatNumber(salesData.total) }}</span>
          <span class="trend" :class="getValueClass(salesData.trend)">
            {{ formatChange(salesData.trend) }}
          </span>
        </div>
        
        <div class="metric-card" @click="showTrendDetail('amount')">
          <span class="label">销售额</span>
          <span class="value">¥{{ formatNumber(salesData.amount) }}</span>
          <span class="trend" :class="getValueClass(salesData.amountTrend)">
            {{ formatChange(salesData.amountTrend) }}
          </span>
        </div>
      </div>

      <div class="chart-area">
        <div class="chart-placeholder">
          <div class="placeholder-content">
            <el-icon size="48"><TrendCharts /></el-icon>
            <p>趋势图表加载中...</p>
          </div>
        </div>
      </div>

      <!-- 异常点说明 -->
      <div v-if="anomalies.length" class="anomaly-list">
        <div v-for="item in anomalies" :key="item.time" class="anomaly-item">
          <el-tag :type="item.level" size="small" effect="dark">{{ item.type }}</el-tag>
          <span class="time">{{ item.time }}</span>
          <span class="description">{{ item.description }}</span>
          <el-popover placement="right" trigger="hover" width="300">
            <template #reference>
              <el-button type="text">查看原因分析</el-button>
            </template>
            <div class="factors-analysis">
              <h4>影响因素分析</h4>
              <ul>
                <li v-for="factor in item.factors" :key="factor.name">
                  <span class="factor-name">{{ factor.name }}</span>
                  <span class="factor-value">{{ factor.value }}</span>
                  <span class="factor-weight">影响权重: {{ factor.weight }}%</span>
                </li>
              </ul>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QuestionFilled, Download, Bell, TrendCharts } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 类型定义
interface AnomalyItem {
  time: string
  type: string
  level: 'warning' | 'danger' | 'success'
  value: number
  description: string
  factors: Array<{
    name: string
    value: string
    weight: number
  }>
}

// 平台选项
const platforms = [
  { label: '全部平台', value: 'all' },
  { label: '天猫', value: 'tmall' },
  { label: '京东', value: 'jd' },
  { label: '抖音', value: 'douyin' },
  { label: '自营商城', value: 'self' }
]

// 时间粒度选项
const timeGranularities = [
  { label: '分钟', value: 'minute' },
  { label: '小时', value: 'hour' },
  { label: '日', value: 'day' },
  { label: '周', value: 'week' }
]

const selectedPlatform = ref('all')
const timeGranularity = ref('hour')
const loading = ref(false)

// 销售数据
const salesData = ref({
  total: 25000,
  trend: 8.5,
  amount: 1250000,
  amountTrend: 12.3
})

// 异常点数据
const anomalies = ref<AnomalyItem[]>([
  {
    time: '2024-03-15 10:00',
    type: '销量异常',
    level: 'warning',
    value: 1500,
    description: '销量突增超出预期',
    factors: [
      { name: '促销活动', value: '3.8折特卖', weight: 60 },
      { name: '直播带货', value: '明星推荐', weight: 30 },
      { name: '节日效应', value: '周末促销', weight: 10 }
    ]
  }
])

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出中...')
}

// 订阅报告
const subscribeReport = () => {
  ElMessage.success('订阅设置已保存')
}

// 显示趋势详情
const showTrendDetail = (type: string) => {
  ElMessage.info(`查看${type === 'sales' ? '销量' : '销售额'}详细趋势`)
}

// 格式化数字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}

// 格式化变化率
const formatChange = (change: number) => {
  return (change >= 0 ? '+' : '') + change.toFixed(2) + '%'
}

// 获取趋势样式
const getValueClass = (value: number) => {
  return value >= 0 ? 'positive' : 'negative'
}
</script>

<style lang="scss" scoped>
.trend-analysis {
  background: #23272e;
  border-radius: 8px;
  padding: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 8px;

  h3 {
    font-size: 16px;
    color: #e0e6ed;
    margin: 0;
  }

  .help-icon {
    font-size: 14px;
    color: #909399;
    cursor: help;
  }
}

.operation-area {
  display: flex;
  align-items: center;
  gap: 16px;

  .platform-select,
  .time-select {
    width: 120px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }
}

.main-metrics {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.metric-card {
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .label {
    font-size: 14px;
    color: #909399;
    display: block;
    margin-bottom: 8px;
  }

  .value {
    font-size: 24px;
    color: #e0e6ed;
    font-weight: 500;
    display: block;
    margin-bottom: 8px;
  }

  .trend {
    font-size: 13px;

    &.positive {
      color: #67c23a;
    }

    &.negative {
      color: #f56c6c;
    }
  }
}

.chart-area {
  height: 300px;
  margin-bottom: 16px;
}

.anomaly-list {
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;
}

.anomaly-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #4c4d4f;

  &:last-child {
    border-bottom: none;
  }

  .time {
    font-size: 13px;
    color: #909399;
  }

  .description {
    flex: 1;
    font-size: 13px;
    color: #e0e6ed;
  }
}

.factors-analysis {
  h4 {
    margin: 0 0 12px;
    color: #e0e6ed;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .factor-name {
    color: #909399;
  }

  .factor-value {
    color: #e0e6ed;
  }

  .factor-weight {
    color: #67c23a;
  }
}
</style> 