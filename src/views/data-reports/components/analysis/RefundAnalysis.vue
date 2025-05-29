<!-- 退款分析组件 -->
<template>
  <div class="refund-analysis">
    <div class="module-header">
      <div class="title-area">
        <h3>退款分析</h3>
        <el-tooltip content="多维度分析退款原因，支持按平台、品类、时间等维度分析" placement="top">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      
      <div class="operation-area">
        <el-select v-model="selectedPlatform" placeholder="选择平台" class="platform-select">
          <el-option v-for="item in platforms" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        
        <el-select v-model="timeRange" placeholder="时间范围" class="time-select">
          <el-option v-for="item in timeRanges" :key="item.value" :label="item.label" :value="item.value" />
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
        <div class="metric-card" @click="showRefundDetail('amount')">
          <span class="label">退款总额</span>
          <span class="value">¥{{ formatNumber(refundData.totalAmount) }}</span>
          <span class="trend" :class="getValueClass(-refundData.trend)">
            {{ formatChange(refundData.trend) }}
          </span>
        </div>
        
        <div class="metric-card" @click="showRefundDetail('rate')">
          <span class="label">退款率</span>
          <span class="value">{{ refundData.rate }}%</span>
          <span class="trend" :class="getValueClass(-refundData.rateTrend)">
            {{ formatChange(refundData.rateTrend) }}
          </span>
        </div>
      </div>

      <div class="charts-wrapper">
        <div class="trend-chart">
          <h4>退款趋势</h4>
          <RefundTrendChart 
            :data="refundData.trendData"
            :loading="loading"
            @bar-click="handleBarClick"
          />
        </div>

        <div class="reasons-chart">
          <h4>退款原因TOP5</h4>
          <div class="reasons-list">
            <div v-for="reason in refundReasons" 
              :key="reason.name" 
              class="reason-item"
              @click="showReasonDetail(reason)">
              <div class="reason-info">
                <span class="reason-name">{{ reason.name }}</span>
                <span class="reason-count">{{ formatNumber(reason.count) }}次</span>
              </div>
              <el-progress 
                :percentage="reason.percentage" 
                :color="reason.color"
                :format="formatPercentage"
                :stroke-width="8" />
              <div class="reason-trend">
                <span class="trend-label">环比</span>
                <span class="trend-value" :class="getValueClass(-reason.trend)">
                  {{ formatChange(reason.trend) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 退款原因详情弹窗 -->
      <el-dialog
        v-model="reasonDetailVisible"
        :title="selectedReason?.name"
        width="70%"
        class="reason-detail-dialog">
        <template v-if="selectedReason">
          <div class="reason-detail">
            <div class="detail-metrics">
              <div class="detail-metric">
                <span class="metric-label">影响金额</span>
                <span class="metric-value">¥{{ formatNumber(selectedReason.amount) }}</span>
              </div>
              <div class="detail-metric">
                <span class="metric-label">影响订单数</span>
                <span class="metric-value">{{ formatNumber(selectedReason.count) }}</span>
              </div>
              <div class="detail-metric">
                <span class="metric-label">平均处理时长</span>
                <span class="metric-value">{{ selectedReason.avgProcessTime }}h</span>
              </div>
            </div>

            <div class="detail-charts">
              <div class="detail-chart">
                <h5>商品品类分布</h5>
                <CategoryDistributionChart :data="selectedReason.categoryDistribution" />
              </div>
              <div class="detail-chart">
                <h5>退款时间分布</h5>
                <TimeDistributionChart :data="selectedReason.timeDistribution" />
              </div>
            </div>

            <div class="improvement-suggestions">
              <h5>改进建议</h5>
              <div class="suggestion-list">
                <div v-for="(suggestion, index) in selectedReason.suggestions" 
                  :key="index"
                  class="suggestion-item">
                  <el-tag size="small" :type="suggestion.priority">{{ suggestion.type }}</el-tag>
                  <span class="suggestion-content">{{ suggestion.content }}</span>
                  <span class="estimated-effect">预计改善: {{ suggestion.effect }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QuestionFilled, Download, Bell } from '@element-plus/icons-vue'
import RefundTrendChart from '../charts/RefundTrendChart.vue'
import CategoryDistributionChart from '../charts/CategoryDistributionChart.vue'
import TimeDistributionChart from '../charts/TimeDistributionChart.vue'
import { ElMessage } from 'element-plus'

// 平台选项
const platforms = [
  { label: '全部平台', value: 'all' },
  { label: '天猫', value: 'tmall' },
  { label: '京东', value: 'jd' },
  { label: '抖音', value: 'douyin' },
  { label: '自营商城', value: 'self' }
]

// 时间范围选项
const timeRanges = [
  { label: '今日', value: 'today' },
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
  { label: '自定义', value: 'custom' }
]

const selectedPlatform = ref('all')
const timeRange = ref('7d')
const loading = ref(false)

// 退款数据
const refundData = ref({
  totalAmount: 125000,
  trend: -5.2,
  rate: 3.5,
  rateTrend: -2.1,
  trendData: [] // 趋势数据
})

// 退款原因数据
const refundReasons = ref([
  {
    name: '尺码不合适',
    count: 1250,
    percentage: 35,
    trend: -8.5,
    color: '#ff6b81',
    amount: 62500,
    avgProcessTime: 24,
    categoryDistribution: [],
    timeDistribution: [],
    suggestions: [
      {
        type: '商品优化',
        priority: 'warning',
        content: '优化商品尺码表的展示方式，增加尺码对比工具',
        effect: '预计可降低20%尺码问题退款'
      },
      {
        type: '流程优化',
        priority: 'info',
        content: '简化换尺码流程，支持先发货后退回',
        effect: '提升30%客户满意度'
      }
    ]
  },
  {
    name: '质量问题',
    count: 850,
    percentage: 25,
    trend: -12.3,
    color: '#ff9f43',
    amount: 42500,
    avgProcessTime: 36,
    categoryDistribution: [],
    timeDistribution: [],
    suggestions: [
      {
        type: '品控优化',
        priority: 'danger',
        content: '加强面料质量检测标准，增加穿着测试环节',
        effect: '预计可降低30%质量问题退款'
      }
    ]
  },
  {
    name: '描述不符',
    count: 680,
    percentage: 20,
    trend: -15.8,
    color: '#54a0ff',
    amount: 34000,
    avgProcessTime: 18,
    categoryDistribution: [],
    timeDistribution: [],
    suggestions: [
      {
        type: '信息优化',
        priority: 'warning',
        content: '优化商品图片展示，增加实物对比说明',
        effect: '预计可降低25%描述不符退款'
      }
    ]
  }
])

// 退款原因详情
const reasonDetailVisible = ref(false)
const selectedReason = ref(null)

// 显示退款详情
const showRefundDetail = (type: string) => {
  ElMessage.info(`查看${type === 'amount' ? '退款金额' : '退款率'}详细分析`)
}

// 显示原因详情
const showReasonDetail = (reason: any) => {
  selectedReason.value = reason
  reasonDetailVisible.value = true
}

// 处理柱状图点击
const handleBarClick = (data: any) => {
  console.log('点击了柱状图:', data)
}

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出中...')
}

// 订阅报告
const subscribeReport = () => {
  ElMessage.success('订阅设置已保存')
}

// 格式化数字
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('zh-CN').format(num)
}

// 格式化变化率
const formatChange = (change: number) => {
  return (change >= 0 ? '+' : '') + change.toFixed(2) + '%'
}

// 格式化百分比
const formatPercentage = (percentage: number) => {
  return `${percentage}%`
}

// 获取趋势样式
const getValueClass = (value: number) => {
  return value >= 0 ? 'positive' : 'negative'
}
</script>

<style lang="scss" scoped>
.refund-analysis {
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

.charts-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.trend-chart,
.reasons-chart {
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;

  h4 {
    font-size: 14px;
    color: #e0e6ed;
    margin: 0 0 16px;
  }
}

.trend-chart {
  height: 300px;
}

.reasons-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reason-item {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

.reason-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.reason-name {
  font-size: 13px;
  color: #e0e6ed;
}

.reason-count {
  font-size: 13px;
  color: #909399;
}

.reason-trend {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.trend-label {
  font-size: 12px;
  color: #909399;
}

.trend-value {
  font-size: 12px;

  &.positive {
    color: #67c23a;
  }

  &.negative {
    color: #f56c6c;
  }
}

.reason-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 24px;
  }
}

.reason-detail {
  .detail-metrics {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
  }

  .detail-metric {
    flex: 1;
    background: #2a2e35;
    border-radius: 6px;
    padding: 16px;
    text-align: center;

    .metric-label {
      font-size: 13px;
      color: #909399;
      display: block;
      margin-bottom: 8px;
    }

    .metric-value {
      font-size: 20px;
      color: #e0e6ed;
      font-weight: 500;
    }
  }

  .detail-charts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
  }

  .detail-chart {
    background: #2a2e35;
    border-radius: 6px;
    padding: 16px;
    height: 300px;

    h5 {
      font-size: 14px;
      color: #e0e6ed;
      margin: 0 0 16px;
    }
  }

  .improvement-suggestions {
    background: #2a2e35;
    border-radius: 6px;
    padding: 16px;

    h5 {
      font-size: 14px;
      color: #e0e6ed;
      margin: 0 0 16px;
    }
  }

  .suggestion-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;

    .suggestion-content {
      flex: 1;
      font-size: 13px;
      color: #e0e6ed;
    }

    .estimated-effect {
      font-size: 12px;
      color: #67c23a;
    }
  }
}
</style> 