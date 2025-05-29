<!-- 流量转化分析组件 -->
<template>
  <div class="conversion-analysis">
    <div class="module-header">
      <div class="title-area">
        <h3>流量转化分析</h3>
        <el-tooltip content="多维度分析流量转化路径，支持按平台、渠道、时间等维度分析" placement="top">
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
        <div class="metric-card" @click="showDetail('traffic')">
          <span class="label">总访问量</span>
          <span class="value">{{ formatNumber(trafficData.total) }}</span>
          <span class="trend" :class="getValueClass(trafficData.trend)">
            {{ formatChange(trafficData.trend) }}
          </span>
        </div>
        
        <div class="metric-card" @click="showDetail('conversion')">
          <span class="label">整体转化率</span>
          <span class="value">{{ trafficData.conversionRate }}%</span>
          <span class="trend" :class="getValueClass(trafficData.conversionTrend)">
            {{ formatChange(trafficData.conversionTrend) }}
          </span>
        </div>

        <div class="metric-card" @click="showDetail('bounce')">
          <span class="label">跳出率</span>
          <span class="value">{{ trafficData.bounceRate }}%</span>
          <span class="trend" :class="getValueClass(-trafficData.bounceTrend)">
            {{ formatChange(trafficData.bounceTrend) }}
          </span>
        </div>
      </div>

      <div class="charts-wrapper">
        <div class="funnel-chart">
          <h4>转化漏斗</h4>
          <div class="funnel-view">
            <ConversionFunnel 
              :data="funnelData"
              :loading="loading"
              @stage-click="handleStageClick"
            />
          </div>
          <div class="funnel-metrics">
            <div v-for="stage in funnelData" :key="stage.name" class="funnel-metric">
              <span class="stage-name">{{ stage.name }}</span>
              <div class="stage-info">
                <span class="stage-value">{{ formatNumber(stage.value) }}</span>
                <span class="stage-rate">转化率: {{ stage.rate }}%</span>
                <span class="stage-trend" :class="getValueClass(stage.trend)">
                  {{ formatChange(stage.trend) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="source-chart">
          <h4>流量来源分布</h4>
          <div class="source-view">
            <TrafficSourceChart 
              :data="trafficView.sources"
              :loading="loading"
              @source-click="handleSourceClick"
            />
          </div>
          <div class="source-list">
            <div v-for="source in trafficView.sources" 
              :key="source.name"
              class="source-item"
              @click="showSourceDetail(source)">
              <div class="source-info">
                <span class="source-name">{{ source.name }}</span>
                <span class="source-value">{{ formatNumber(source.value) }}</span>
              </div>
              <el-progress 
                :percentage="source.percentage"
                :color="source.color"
                :format="formatPercentage"
                :stroke-width="8" />
              <div class="source-metrics">
                <div class="metric">
                  <span class="label">转化率</span>
                  <span class="value" :class="getValueClass(source.conversionRate - trafficData.conversionRate)">
                    {{ source.conversionRate }}%
                  </span>
                </div>
                <div class="metric">
                  <span class="label">跳出率</span>
                  <span class="value" :class="getValueClass(trafficData.bounceRate - source.bounceRate)">
                    {{ source.bounceRate }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 流量来源详情弹窗 -->
      <el-dialog
        v-model="sourceDetailVisible"
        :title="selectedSource?.name"
        width="70%"
        class="source-detail-dialog">
        <template v-if="selectedSource">
          <div class="source-detail">
            <div class="detail-metrics">
              <div class="detail-metric">
                <span class="metric-label">访问人数</span>
                <span class="metric-value">{{ formatNumber(selectedSource.visitors) }}</span>
                <span class="metric-trend" :class="getValueClass(selectedSource.visitorsTrend)">
                  {{ formatChange(selectedSource.visitorsTrend) }}
                </span>
              </div>
              <div class="detail-metric">
                <span class="metric-label">人均访问页面</span>
                <span class="metric-value">{{ selectedSource.pagesPerVisit }}</span>
                <span class="metric-trend" :class="getValueClass(selectedSource.pagesTrend)">
                  {{ formatChange(selectedSource.pagesTrend) }}
                </span>
              </div>
              <div class="detail-metric">
                <span class="metric-label">平均停留时间</span>
                <span class="metric-value">{{ selectedSource.avgDuration }}分钟</span>
                <span class="metric-trend" :class="getValueClass(selectedSource.durationTrend)">
                  {{ formatChange(selectedSource.durationTrend) }}
                </span>
              </div>
            </div>

            <div class="detail-charts">
              <div class="detail-chart">
                <h5>访问趋势</h5>
                <VisitTrendChart :data="selectedSource.visitTrend" />
              </div>
              <div class="detail-chart">
                <h5>转化路径</h5>
                <ConversionPathChart :data="selectedSource.conversionPath" />
              </div>
            </div>

            <div class="optimization-suggestions">
              <h5>优化建议</h5>
              <div class="suggestion-list">
                <div v-for="(suggestion, index) in selectedSource.suggestions" 
                  :key="index"
                  class="suggestion-item">
                  <el-tag size="small" :type="suggestion.priority">{{ suggestion.type }}</el-tag>
                  <span class="suggestion-content">{{ suggestion.content }}</span>
                  <span class="estimated-effect">预计提升: {{ suggestion.effect }}</span>
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
// import ConversionFunnel from '../charts/ConversionFunnel.vue'
// import TrafficSourceChart from '../charts/TrafficSourceChart.vue'
// import VisitTrendChart from '../charts/VisitTrendChart.vue'
// import ConversionPathChart from '../charts/ConversionPathChart.vue'
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

// 流量数据
const trafficData = ref({
  total: 150000,
  trend: 12.5,
  conversionRate: 3.5,
  conversionTrend: 0.8,
  bounceRate: 35.2,
  bounceTrend: -2.1
})

// 漏斗数据
const funnelData = ref([
  {
    name: '访问',
    value: 150000,
    rate: 100,
    trend: 12.5,
    color: '#409eff'
  },
  {
    name: '浏览商品',
    value: 75000,
    rate: 50,
    trend: 8.3,
    color: '#67c23a'
  },
  {
    name: '加入购物车',
    value: 22500,
    rate: 30,
    trend: 5.2,
    color: '#e6a23c'
  },
  {
    name: '提交订单',
    value: 5250,
    rate: 23.3,
    trend: 3.5,
    color: '#f56c6c'
  },
  {
    name: '完成支付',
    value: 3500,
    rate: 66.7,
    trend: 2.8,
    color: '#909399'
  }
])

// 流量来源数据
const trafficView = ref({
  sources: [
    {
      name: '搜索引擎',
      value: 60000,
      percentage: 40,
      color: '#409eff',
      conversionRate: 4.2,
      bounceRate: 32.5,
      visitors: 45000,
      pagesPerVisit: 4.5,
      avgDuration: 3.2,
      visitorsTrend: 15.2,
      pagesTrend: 5.8,
      durationTrend: 8.3,
      visitTrend: [],
      conversionPath: [],
      suggestions: [
        {
          type: 'SEO优化',
          priority: 'warning',
          content: '优化商品详情页的关键词布局，提升自然搜索排名',
          effect: '预计可提升15%自然流量'
        }
      ]
    },
    {
      name: '社交媒体',
      value: 45000,
      percentage: 30,
      color: '#67c23a',
      conversionRate: 3.8,
      bounceRate: 38.5,
      visitors: 35000,
      pagesPerVisit: 3.8,
      avgDuration: 2.5,
      visitorsTrend: 25.5,
      pagesTrend: -2.1,
      durationTrend: -1.5,
      visitTrend: [],
      conversionPath: [],
      suggestions: [
        {
          type: '内容优化',
          priority: 'warning',
          content: '增加短视频内容的产品展示，提升种草效果',
          effect: '预计可提升20%转化率'
        }
      ]
    },
    {
      name: '直接访问',
      value: 30000,
      percentage: 20,
      color: '#e6a23c',
      conversionRate: 5.5,
      bounceRate: 28.5,
      visitors: 25000,
      pagesPerVisit: 5.2,
      avgDuration: 4.5,
      visitorsTrend: 8.5,
      pagesTrend: 12.3,
      durationTrend: 15.8,
      visitTrend: [],
      conversionPath: [],
      suggestions: [
        {
          type: '用户体验',
          priority: 'info',
          content: '优化网站加载速度，提升直接访问用户体验',
          effect: '预计可提升10%留存率'
        }
      ]
    }
  ]
})

// 来源详情
const sourceDetailVisible = ref(false)
const selectedSource = ref(null)

// 显示详情
const showDetail = (type: string) => {
  ElMessage.info(`查看${type}详细分析`)
}

// 显示来源详情
const showSourceDetail = (source: any) => {
  selectedSource.value = source
  sourceDetailVisible.value = true
}

// 处理漏斗阶段点击
const handleStageClick = (stage: any) => {
  console.log('点击了漏斗阶段:', stage)
}

// 处理来源点击
const handleSourceClick = (source: any) => {
  console.log('点击了流量来源:', source)
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
.conversion-analysis {
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
  flex: 1;
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
  grid-template-columns: 3fr 2fr;
  gap: 24px;
}

.funnel-chart,
.source-chart {
  background: #2a2e35;
  border-radius: 6px;
  padding: 16px;

  h4 {
    font-size: 14px;
    color: #e0e6ed;
    margin: 0 0 16px;
  }
}

.funnel-view {
  height: 300px;
  margin-bottom: 16px;
}

.funnel-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.funnel-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;

  .stage-name {
    font-size: 13px;
    color: #e0e6ed;
  }

  .stage-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stage-value {
    font-size: 13px;
    color: #e0e6ed;
  }

  .stage-rate {
    font-size: 13px;
    color: #409eff;
  }

  .stage-trend {
    font-size: 12px;

    &.positive {
      color: #67c23a;
    }

    &.negative {
      color: #f56c6c;
    }
  }
}

.source-view {
  height: 200px;
  margin-bottom: 16px;
}

.source-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.source-item {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

.source-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.source-name {
  font-size: 13px;
  color: #e0e6ed;
}

.source-value {
  font-size: 13px;
  color: #909399;
}

.source-metrics {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;

  .metric {
    display: flex;
    align-items: center;
    gap: 8px;

    .label {
      font-size: 12px;
      color: #909399;
    }

    .value {
      font-size: 12px;

      &.positive {
        color: #67c23a;
      }

      &.negative {
        color: #f56c6c;
      }
    }
  }
}

.source-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 24px;
  }
}

.source-detail {
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
      display: block;
      margin-bottom: 4px;
    }

    .metric-trend {
      font-size: 12px;

      &.positive {
        color: #67c23a;
      }

      &.negative {
        color: #f56c6c;
      }
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

  .optimization-suggestions {
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