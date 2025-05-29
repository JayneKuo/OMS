<!-- 销量预测页面 -->
<template>
  <div class="sales-prediction">
    <!-- 预测参数配置区 -->
    <div class="prediction-config">
      <el-form :model="predictionForm" label-width="120px" class="config-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="预测周期">
              <el-select v-model="predictionForm.period" placeholder="选择预测周期">
                <el-option label="未来7天" value="7" />
                <el-option label="未来14天" value="14" />
                <el-option label="未来30天" value="30" />
                <el-option label="未来90天" value="90" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="predictionForm.period === 'custom'">
            <el-form-item label="自定义时间">
              <el-date-picker
                v-model="predictionForm.customDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 多级联动选择 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="客户群体">
              <el-select 
                v-model="predictionForm.customer" 
                placeholder="选择客户群体"
                clearable
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="dimension-option">
                    <span>{{ item.label }}</span>
                    <span class="dimension-info" v-if="item.info">({{ item.info }})</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售渠道">
              <el-select 
                v-model="predictionForm.channel" 
                placeholder="选择销售渠道"
                clearable
              >
                <el-option
                  v-for="item in channelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="dimension-option">
                    <span>{{ item.label }}</span>
                    <span class="dimension-info" v-if="item.info">({{ item.info }})</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品品类">
              <el-select 
                v-model="predictionForm.category" 
                placeholder="选择商品品类"
                clearable
                :disabled="!predictionForm.channel"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="dimension-option">
                    <span>{{ item.label }}</span>
                    <span class="dimension-info" v-if="item.info">({{ item.info }})</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品SKU">
              <el-select 
                v-model="predictionForm.skus" 
                placeholder="选择商品SKU"
                clearable
                :disabled="!predictionForm.category"
                filterable
              >
                <el-option
                  v-for="item in skuOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="dimension-option">
                    <span>{{ item.label }}</span>
                    <span class="dimension-info" v-if="item.info">({{ item.info }})</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="影响因素">
              <el-checkbox-group v-model="predictionForm.factors">
                <el-checkbox label="season">季节性</el-checkbox>
                <el-checkbox label="promotion">促销活动</el-checkbox>
                <el-checkbox label="holiday">节假日</el-checkbox>
                <el-checkbox label="weather">天气</el-checkbox>
                <el-checkbox label="event">重大事件</el-checkbox>
                <el-checkbox label="competitor">竞品活动</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预测选项">
              <el-checkbox-group v-model="predictionForm.options">
                <el-checkbox label="replenishment">补货建议</el-checkbox>
                <el-checkbox label="promotion">促销建议</el-checkbox>
                <el-checkbox label="comparison">历史对比</el-checkbox>
                <el-checkbox label="analysis">因素分析</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item>
              <div class="form-buttons">
                <el-button type="primary" @click="handlePrediction" :loading="loading">
                  生成预测
                </el-button>
                <el-button @click="exportReport" :disabled="!hasPredictionData">
                  导出报告
                </el-button>
                <el-button @click="saveAsTemplate" :disabled="!predictionForm.category">
                  保存为模板
                </el-button>
                <el-dropdown v-if="predictionTemplates.length" trigger="click">
                  <el-button>
                    加载模板 <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="template in predictionTemplates"
                        :key="template.id"
                        @click="loadTemplate(template)"
                      >
                        {{ template.name }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 预测结果展示区 -->
    <div class="prediction-results" v-loading="loading" v-if="hasPredictionData">
      <!-- 预测总览卡片 -->
      <div class="overview-cards">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(card, index) in overviewCards" :key="index">
            <el-card class="overview-card">
              <div class="card-header">
                <span class="card-title">{{ card.title }}</span>
                <el-tooltip :content="card.tooltip" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="card-value">{{ card.value }}</div>
              <div class="card-trend">
                <span :class="['trend-value', card.trend > 0 ? 'positive' : 'negative']">
                  {{ card.trend > 0 ? '+' : '' }}{{ card.trend }}%
                </span>
                <span class="trend-label">较上期</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 预测趋势图 -->
      <div class="trend-chart-section">
        <div class="section-header">
          <h3>销量预测趋势</h3>
          <div class="chart-controls">
            <el-radio-group v-model="chartView" size="small">
              <el-radio-button label="line">趋势线</el-radio-button>
              <el-radio-button label="bar">柱状图</el-radio-button>
              <el-radio-button label="mixed">混合图</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="chart-container" ref="trendChartRef"></div>
      </div>

      <!-- 影响因素详细分析 -->
      <div class="factor-analysis-section">
        <div class="section-header">
          <h3>影响因素详细分析</h3>
        </div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="factor in factorDetails" :key="factor.name">
            <el-card class="factor-card">
              <div class="factor-header">
                <span class="factor-name">{{ factor.name }}</span>
                <div class="factor-impact" :class="factor.trend">
                  {{ factor.impact }}%
                  <el-icon v-if="factor.trend === 'up'"><ArrowUp /></el-icon>
                  <el-icon v-else-if="factor.trend === 'down'"><ArrowDown /></el-icon>
                  <el-icon v-else><Minus /></el-icon>
                </div>
              </div>
              <div class="factor-description">{{ factor.description }}</div>
              <div class="factor-metrics">
                <div class="metric-item" v-for="metric in factor.relatedMetrics" :key="metric.name">
                  <span class="metric-name">{{ metric.name }}</span>
                  <span class="metric-value">
                    {{ metric.value }}{{ metric.unit }}
                    <span class="metric-change" :class="metric.change > 0 ? 'positive' : 'negative'">
                      {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
                    </span>
                  </span>
                </div>
              </div>
              <div class="factor-suggestions">
                <h4>改进建议</h4>
                <ul>
                  <li v-for="(suggestion, index) in factor.suggestions" :key="index">
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 补货建议详细信息 -->
      <div class="replenishment-section">
        <div class="section-header">
          <h3>补货建议详细分析</h3>
        </div>
        <el-row :gutter="20">
          <el-col :span="24" v-for="item in replenishmentDetails" :key="item.sku">
            <el-card class="replenishment-card">
              <div class="replenishment-header">
                <div class="product-info">
                  <h4>{{ item.name }}</h4>
                  <span class="sku">SKU: {{ item.sku }}</span>
                </div>
                <el-tag :type="getUrgencyType(item.urgencyLevel)" effect="dark">
                  {{ item.urgencyLevel }}紧急度
                </el-tag>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="stock-info">
                    <div class="info-item">
                      <span class="label">当前库存</span>
                      <span class="value">{{ formatNumber(item.currentStock) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">预测需求</span>
                      <span class="value">{{ formatNumber(item.predictedDemand) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">建议补货</span>
                      <span class="value highlight">{{ formatNumber(item.suggestedReplenishment) }}</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="risk-analysis">
                    <el-progress
                      type="dashboard"
                      :percentage="item.stockoutRisk"
                      :color="getStockoutRiskColor"
                    >
                      <template #default="{ percentage }">
                        <span class="progress-label">断货风险</span>
                        <span class="percentage">{{ percentage }}%</span>
                      </template>
                    </el-progress>
                    <div class="profit-impact">
                      预计影响利润: ¥{{ formatNumber(item.profitImpact) }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="trend-analysis">
                    <div v-for="trend in item.trends" :key="trend.name" class="trend-item">
                      <span class="trend-name">{{ trend.name }}</span>
                      <el-progress :percentage="trend.change" :format="percentageFormat" />
                    </div>
                  </div>
                </el-col>
              </el-row>
              <div class="suggestion-box">
                <el-icon><InfoFilled /></el-icon>
                <span>{{ item.suggestion }}</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="24">
                  <div class="warehouse-details">
                    <h4>仓库补货详情</h4>
                    <el-table :data="item.warehouseDetails" border stripe>
                      <el-table-column prop="warehouseName" label="仓库" />
                      <el-table-column prop="currentStock" label="当前库存">
                        <template #default="{ row }">
                          {{ formatNumber(row.currentStock) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="suggestedReplenishment" label="建议补货">
                        <template #default="{ row }">
                          {{ formatNumber(row.suggestedReplenishment) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="transitTime" label="到货时间" />
                      <el-table-column prop="costPerUnit" label="单位成本">
                        <template #default="{ row }">
                          ¥{{ row.costPerUnit.toFixed(2) }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <div class="sku-composition">
                    <h4>SKU构成分析</h4>
                    <el-table :data="item.skuComposition" border stripe>
                      <el-table-column prop="sku" label="SKU" />
                      <el-table-column prop="name" label="名称" />
                      <el-table-column prop="percentage" label="占比">
                        <template #default="{ row }">
                          <el-progress :percentage="row.percentage" :format="percentageFormat" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="trend" label="趋势">
                        <template #default="{ row }">
                          <span :class="['trend-value', row.trend > 0 ? 'positive' : 'negative']">
                            {{ row.trend > 0 ? '+' : '' }}{{ row.trend }}%
                            <el-icon v-if="row.trend > 0"><ArrowUp /></el-icon>
                            <el-icon v-else><ArrowDown /></el-icon>
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 促销建议详细信息 -->
      <div class="promotion-section">
        <div class="section-header">
          <h3>促销建议详细分析</h3>
        </div>
        <el-row :gutter="20">
          <el-col :span="24" v-for="item in promotionDetails" :key="item.sku">
            <el-card class="promotion-card">
              <div class="promotion-header">
                <div class="product-info">
                  <h4>{{ item.name }}</h4>
                  <span class="sku">SKU: {{ item.sku }}</span>
                </div>
                <div class="promotion-metrics">
                  <el-tag :type="getSalesTrendType(item.salesTrend)">
                    销量趋势 {{ item.salesTrend > 0 ? '+' : '' }}{{ item.salesTrend }}%
                  </el-tag>
                  <el-tag type="success" effect="plain">
                    预期提升 +{{ item.expectedEffect }}%
                  </el-tag>
                  <el-tag type="info" effect="plain">
                    投入产出比 {{ item.costBenefit }}
                  </el-tag>
                </div>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="competitor-analysis">
                    <h5>竞品分析</h5>
                    <el-table :data="item.competitorAnalysis" border size="small">
                      <el-table-column prop="name" label="竞品" />
                      <el-table-column prop="price" label="价格" />
                      <el-table-column prop="promotion" label="促销活动" />
                    </el-table>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="historical-performance">
                    <h5>历史表现</h5>
                    <el-table :data="item.historicalPerformance" border size="small">
                      <el-table-column prop="period" label="时段" />
                      <el-table-column prop="sales" label="销量" />
                      <el-table-column prop="profit" label="利润" />
                    </el-table>
                  </div>
                </el-col>
              </el-row>
              <div class="promotion-suggestion">
                <div class="suggestion-header">
                  <el-icon><InfoFilled /></el-icon>
                  <span>促销建议</span>
                </div>
                <div class="suggestion-content">
                  <p>{{ item.suggestion }}</p>
                  <p class="timing">最佳时机：{{ item.timing }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 预测模板 -->
    <el-drawer
      v-model="showTemplates"
      title="预测模板"
      direction="rtl"
      size="500px"
    >
      <div class="templates-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索模板"
          prefix-icon="Search"
          clearable
        />
        <el-scrollbar height="calc(100vh - 200px)">
          <el-card
            v-for="template in filteredTemplates"
            :key="template.id"
            class="template-card"
            shadow="hover"
          >
            <template #header>
              <div class="template-header">
                <span>{{ template.name }}</span>
                <div class="template-actions">
                  <el-button text type="primary" @click="loadTemplate(template)">
                    使用
                  </el-button>
                  <el-button text type="danger" @click="deleteTemplate(template)">
                    删除
                  </el-button>
                </div>
              </div>
            </template>
            <div class="template-content">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="预测周期">
                  {{ template.config.period }}天
                </el-descriptions-item>
                <el-descriptions-item label="客户群体">
                  {{ template.config.customer }}
                </el-descriptions-item>
                <el-descriptions-item label="销售渠道">
                  {{ template.config.channel }}
                </el-descriptions-item>
                <el-descriptions-item label="商品品类">
                  {{ template.config.category }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption
} from 'echarts/components'
import type {
  LineSeriesOption,
  BarSeriesOption,
  PieSeriesOption
} from 'echarts/charts'
import { InfoFilled, ArrowDown, ArrowUp, Minus } from '@element-plus/icons-vue'
import {
  mockPredictionAPI,
  exportPredictionReport,
  savePredictionTemplate,
  getPredictionTemplates as getTemplates,
  type PredictionParams as APIPredictionParams,
  type PredictionResult as APIPredictionResult,
  type ReplenishmentItem,
  type PromotionItem,
  type FactorAnalysis
} from '@/api/prediction'
import { useTheme } from '@/composables/useTheme'
import type { Ref } from 'vue'

const { isDark } = useTheme()

// 注册必需的组件
echarts.use([
  TitleComponent as any,
  TooltipComponent as any,
  LegendComponent as any,
  GridComponent as any,
  LineChart as any,
  BarChart as any,
  PieChart as any,
  CanvasRenderer as any,
  UniversalTransition as any
])

// 定义接口
interface PredictionTemplate {
  id: number
  name: string
  config: {
    period: string
    customDateRange?: [Date, Date]
    customer: string
    channel: string
    category: string
    skus: string[]
    factors: string[]
    options: string[]
    dimension: string
    dimensionValues: string[]
  }
}

interface ExtendedReplenishmentItem extends ReplenishmentItem {
  suggestedStock: number
  urgency: string
}

interface ExtendedPromotionItem extends PromotionItem {
  id: number
  time: string
  type: string
  title: string
  expectedSales: number
  roi: string
  costBenefit: number
  timing: string
  competitorAnalysis: Array<{
    name: string
    price: number
    promotion: string
  }>
  historicalPerformance: Array<{
    period: string
    sales: number
    profit: number
  }>
}

interface Warehouse {
  id: string
  name: string
  region: string
  capacity: number
  currentStock: number
  address: string
}

interface ReplenishmentDetailItem extends ExtendedReplenishmentItem {
  name: string
  stockoutRisk: number
  profitImpact: number
  predictedDemand: number
  suggestedReplenishment: number
  urgencyLevel: string
  warehouseDetails: Array<{
    warehouseId: string
    warehouseName: string
    currentStock: number
    suggestedReplenishment: number
    transitTime: string
    costPerUnit: number
  }>
  trends: Array<{
    name: string
    data: number[]
    change: number
  }>
  skuComposition: Array<{
    sku: string
    name: string
    percentage: number
    trend: number
  }>
}

interface SelectOption {
  value: string
  label: string
  info?: string
}

interface PredictionParams extends APIPredictionParams {
  period: string
  customDateRange?: [Date, Date]
  customer: string
  channel: string
  category: string
  skus: string[]
  factors: string[]
  options: string[]
  dimension: string
  dimensionValues: string[]
}

interface PredictionResult {
  date: string
  predicted: number
  actual?: number
  lowerBound: number
  upperBound: number
  accuracy: number
  factors?: Array<{
    name: string
    impact: number
  }>
}

interface FactorDetail {
  name: string
  impact: number
  trend: 'up' | 'down' | 'stable'
  description: string
  suggestions: string[]
  relatedMetrics: {
    name: string
    value: number
    unit: string
    change: number
  }[]
}

interface PromotionItemDetail {
  id: number
  sku: string
  name: string
  salesTrend: number
  promotionType: string
  expectedEffect: number
  costBenefit: number
  timing: string
  suggestion: string
  competitorAnalysis: Array<{
    name: string
    price: number
    promotion: string
  }>
  historicalPerformance: Array<{
    period: string
    sales: number
    profit: number
  }>
}

// 基础响应式数据
const loading = ref(false)
const chartView = ref('line')
const searchKeyword = ref('')
const predictionForm = ref<PredictionParams>({
  period: '30',
  customDateRange: undefined,
  customer: '',
  channel: '',
  category: '',
  skus: [],
  factors: ['season', 'promotion', 'holiday'],
  options: ['replenishment', 'promotion', 'analysis'],
  dimension: 'category',
  dimensionValues: []
})

// 预测总览数据
const overviewCards = ref([
  {
    title: '预测总销量',
    value: '1,234,567',
    trend: 12.5,
    tooltip: '未来30天预测总销量'
  },
  {
    title: '平均日销量',
    value: '41,152',
    trend: 8.3,
    tooltip: '预测期间平均日销量'
  },
  {
    title: '预测准确率',
    value: '92.5%',
    trend: 2.1,
    tooltip: '基于历史数据的模型准确率'
  },
  {
    title: '增长潜力',
    value: '15.2%',
    trend: 5.4,
    tooltip: '与上期相比的增长预期'
  }
])

// 预测模板数据
const predictionTemplates = ref<PredictionTemplate[]>([
  {
    id: 1,
    name: '节日促销预测',
    config: {
      period: '30',
      customer: 'vip',
      channel: 'tmall',
      category: 'clothing',
      skus: [],
      factors: ['season', 'promotion', 'holiday'],
      options: ['replenishment', 'promotion', 'analysis'],
      dimension: 'category',
      dimensionValues: ['clothing']
    }
  }
])

// 预测结果数据
const predictionId = ref<string>('')
const predictionData = ref<PredictionResult[]>([])

// 计算属性
const hasPredictionData = computed(() => predictionData.value.length > 0)

// 图表相关的ref
const trendChartRef = ref<HTMLElement | null>(null)
const factorChartRef = ref<HTMLElement | null>(null)
const comparisonChartRef = ref<HTMLElement | null>(null)

// 图表实例
let trendChart: echarts.ECharts | null = null
let factorChart: echarts.ECharts | null = null
let comparisonChart: echarts.ECharts | null = null

// 客户选项
const customerOptions = ref<SelectOption[]>([
  { value: 'vip', label: 'VIP客户', info: '消费>10万' },
  { value: 'regular', label: '普通客户', info: '消费1-10万' },
  { value: 'new', label: '新客户', info: '首次购买' }
])

// 渠道选项
const channelOptions = ref<SelectOption[]>([
  { value: 'tmall', label: '天猫', info: '日均3000单' },
  { value: 'jd', label: '京东', info: '日均2500单' },
  { value: 'douyin', label: '抖音', info: '日均1800单' },
  { value: 'offline', label: '线下门店', info: '日均1200单' }
])

// 品类选项
const categoryOptions = ref<SelectOption[]>([
  { value: 'clothing', label: '服装', info: '主打品类' },
  { value: 'shoes', label: '鞋类', info: '高利润' },
  { value: 'bags', label: '箱包', info: '增长最快' },
  { value: 'accessories', label: '配饰', info: '高转化率' }
])

// SKU选项
const skuOptions = ref<SelectOption[]>([])

// 仓库数据
const warehouseOptions = ref<Warehouse[]>([
  {
    id: 'WH001',
    name: '华东中心仓',
    region: '华东',
    capacity: 100000,
    currentStock: 65000,
    address: '上海市松江区'
  },
  {
    id: 'WH002',
    name: '华南中心仓',
    region: '华南',
    capacity: 80000,
    currentStock: 45000,
    address: '广州市白云区'
  },
  {
    id: 'WH003',
    name: '华北中心仓',
    region: '华北',
    capacity: 90000,
    currentStock: 55000,
    address: '北京市通州区'
  }
])

// 补货建议数据
const replenishmentDetails = ref<ReplenishmentDetailItem[]>([
  {
    sku: 'SKU001',
    name: '夏季新品连衣裙',
    currentStock: 1000,
    suggestedStock: 1500,
    urgency: '高',
    suggestion: '建议立即补货500件，预计3天内库存不足',
    stockoutRisk: 85,
    profitImpact: 50000,
    predictedDemand: 1800,
    suggestedReplenishment: 500,
    urgencyLevel: '高',
    warehouseDetails: [
      {
        warehouseId: 'WH001',
        warehouseName: '华东中心仓',
        currentStock: 300,
        suggestedReplenishment: 200,
        transitTime: '2天',
        costPerUnit: 5.5
      },
      {
        warehouseId: 'WH002',
        warehouseName: '华南中心仓',
        currentStock: 400,
        suggestedReplenishment: 150,
        transitTime: '3天',
        costPerUnit: 6.0
      },
      {
        warehouseId: 'WH003',
        warehouseName: '华北中心仓',
        currentStock: 300,
        suggestedReplenishment: 150,
        transitTime: '2天',
        costPerUnit: 5.8
      }
    ],
    trends: [
      { name: '日均销量', data: [120, 135, 142, 158, 165, 180], change: 15.2 },
      { name: '库存周转', data: [4.2, 4.5, 4.8, 5.1, 5.5, 5.8], change: 8.5 }
    ],
    skuComposition: [
      { sku: 'SKU001-L', name: '夏季新品连衣裙-L', percentage: 35, trend: 5.2 },
      { sku: 'SKU001-M', name: '夏季新品连衣裙-M', percentage: 45, trend: 3.8 },
      { sku: 'SKU001-S', name: '夏季新品连衣裙-S', percentage: 20, trend: -2.1 }
    ]
  }
])

// 促销建议数据
const promotionDetails = ref<PromotionItemDetail[]>([
  {
    id: 1,
    sku: 'SKU001',
    name: '夏季新品连衣裙',
    salesTrend: -15,
    promotionType: '限时折扣',
    expectedEffect: 25,
    costBenefit: 2.5,
    timing: '建议在周末期间开展',
    suggestion: '根据历史数据分析，该商品对价格促销敏感度高，建议采用限时折扣策略。',
    competitorAnalysis: [
      { name: '竞品A', price: 299, promotion: '满300减50' },
      { name: '竞品B', price: 329, promotion: '无' }
    ],
    historicalPerformance: [
      { period: '上周', sales: 1200, profit: 36000 },
      { period: '本周', sales: 980, profit: 29400 }
    ]
  }
])

// 影响因素详细分析数据
const factorDetails = ref<FactorDetail[]>([
  {
    name: '季节性因素',
    impact: 35.2,
    trend: 'up',
    description: '当前正处于夏季旺季，消费需求呈现明显上升趋势。预计未来3个月内，季节性影响将持续走强。',
    suggestions: [
      '建议增加夏季新品的备货比例',
      '关注天气变化，及时调整库存策略',
      '提前规划促销活动，把握季节性销售机会'
    ],
    relatedMetrics: [
      { name: '季节性销量指数', value: 1.45, unit: '', change: 15.2 },
      { name: '天气敏感度', value: 0.82, unit: '', change: 5.6 },
      { name: '同期对比增长', value: 35.2, unit: '%', change: 8.3 }
    ]
  },
  {
    name: '促销活动',
    impact: 25.8,
    trend: 'down',
    description: '近期竞品促销活动频繁，对销量产生一定影响。建议及时调整促销策略。',
    suggestions: [
      '针对重点SKU开展差异化促销',
      '优化促销力度，提高性价比',
      '加强会员营销，提升客户粘性'
    ],
    relatedMetrics: [
      { name: '促销转化率', value: 18.5, unit: '%', change: -2.3 },
      { name: '客单价', value: 299, unit: '元', change: -5.1 },
      { name: '毛利率', value: 45.2, unit: '%', change: -1.8 }
    ]
  },
  {
    name: '节假日',
    impact: 20.5,
    trend: 'stable',
    description: '即将进入端午节假期，预计会带来短期销量提升。',
    suggestions: [
      '提前准备节日主题营销活动',
      '针对节日礼品需求进行选品',
      '优化物流配送，应对节日高峰'
    ],
    relatedMetrics: [
      { name: '节日销量提升', value: 25.6, unit: '%', change: 0.8 },
      { name: '礼品类占比', value: 35.2, unit: '%', change: 12.5 },
      { name: '活动参与度', value: 68.9, unit: '%', change: 5.2 }
    ]
  }
])

// 方法
const handleSkuSearch = async (query: string) => {
  if (query) {
    loading.value = true
    try {
      // 这里应该调用实际的SKU搜索API
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      skuOptions.value = [
        { value: 'SKU001', label: '基础T恤 - SKU001' },
        { value: 'SKU002', label: '牛仔裤 - SKU002' },
        { value: 'SKU003', label: '连衣裙 - SKU003' }
      ].filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('SKU搜索失败:', error)
      ElMessage.error('SKU搜索失败')
    } finally {
      loading.value = false
    }
  } else {
    skuOptions.value = []
  }
}

const deleteTemplate = async (template: PredictionTemplate) => {
  try {
    // 这里应该调用实际的删除模板API
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    const index = predictionTemplates.value.findIndex(t => t.id === template.id)
    if (index !== -1) {
      predictionTemplates.value.splice(index, 1)
      ElMessage.success('模板删除成功')
    }
  } catch (error) {
    console.error('删除模板失败:', error)
    ElMessage.error('删除模板失败')
  }
}

const disabledDate = (date: Date) => {
  return date.getTime() < Date.now()
}

// 生成模拟数据
const generateMockData = (days: number): PredictionResult[] => {
  const data: PredictionResult[] = []
  const baseValue = 1000
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    const seasonal = Math.sin((i / days) * Math.PI * 2) * 100
    const trend = i * 5
    const random = Math.random() * 50 - 25

    const predicted = Math.max(0, baseValue + seasonal + trend + random)
    const actual = i < 7 ? predicted * (1 + (Math.random() * 0.2 - 0.1)) : undefined
    const accuracy = actual ? 100 - Math.abs((predicted - actual) / actual * 100) : 95 // 默认准确率

    data.push({
      date: dateStr,
      predicted: Math.round(predicted),
      actual: actual ? Math.round(actual) : undefined,
      lowerBound: Math.round(predicted * 0.9),
      upperBound: Math.round(predicted * 1.1),
      accuracy: Math.round(accuracy),
      factors: [
        { name: '季节性', impact: 35 },
        { name: '促销活动', impact: 25 },
        { name: '节假日', impact: 20 },
        { name: '天气', impact: 15 },
        { name: '其他', impact: 5 }
      ]
    })
  }

  return data
}

// 工具函数
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num)
}

const getUrgencyType = (level: string): string => {
  const types: Record<string, string> = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return types[level] || 'info'
}

const getStockoutRiskColor = (percentage: number): string => {
  if (percentage > 80) return '#F56C6C'
  if (percentage > 50) return '#E6A23C'
  return '#67C23A'
}

const getSalesTrendType = (trend: number): string => {
  if (trend > 0) return 'success'
  if (trend < 0) return 'danger'
  return 'info'
}

const percentageFormat = (percentage: number): string => {
  return percentage.toFixed(1) + '%'
}

// 加载模板
const loadTemplate = (template: PredictionTemplate) => {
  predictionForm.value = { ...template.config } as PredictionParams
  ElMessage.success('预测模板加载成功')
}

// 修改handlePrediction函数
const handlePrediction = async () => {
  loading.value = true
  try {
    // 生成模拟数据
    const days = Number(predictionForm.value.period)
    const mockData = generateMockData(days)
    predictionData.value = mockData

    // 更新预测总览数据
    overviewCards.value = [
      {
        title: '预测总销量',
        value: formatNumber(mockData.reduce((sum, item) => sum + item.predicted, 0)),
        trend: 12.5,
        tooltip: '未来30天预测总销量'
      },
      {
        title: '平均日销量',
        value: formatNumber(Math.round(mockData.reduce((sum, item) => sum + item.predicted, 0) / days)),
        trend: 8.3,
        tooltip: '预测期间平均日销量'
      },
      {
        title: '预测准确率',
        value: '92.5%',
        trend: 2.1,
        tooltip: '基于历史数据的模型准确率'
      },
      {
        title: '增长潜力',
        value: '15.2%',
        trend: 5.4,
        tooltip: '与上期相比的增长预期'
      }
    ]

    // 更新图表
    nextTick(() => {
      initCharts()
    })

    ElMessage.success('预测数据生成成功')
  } catch (error) {
    console.error('预测失败:', error)
    ElMessage.error('预测失败，请重试')
  } finally {
    loading.value = false
  }
}

// 修改导出报告函数
const exportReport = async () => {
  if (!hasPredictionData.value) {
    ElMessage.warning('请先生成预测数据')
    return
  }

  try {
    loading.value = true
    
    // 准备导出数据
    const exportData = {
      overview: {
        title: '销量预测报告',
        date: new Date().toLocaleString(),
        period: predictionForm.value.period,
        customer: predictionForm.value.customer,
        channel: predictionForm.value.channel,
        category: predictionForm.value.category
      },
      predictionSummary: {
        totalSales: overviewCards.value[0].value,
        avgDailySales: overviewCards.value[1].value,
        accuracy: overviewCards.value[2].value,
        growthPotential: overviewCards.value[3].value
      },
      skuDetails: replenishmentDetails.value,
      promotionSuggestions: promotionDetails.value,
      factorAnalysis: factorDetails.value
    }

    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 创建模拟的Excel数据
    const mockExcelData = `
预测报告概览
生成时间：${exportData.overview.date}
预测周期：${exportData.overview.period}天
客户群体：${exportData.overview.customer}
销售渠道：${exportData.overview.channel}
商品品类：${exportData.overview.category}

预测汇总
预测总销量：${exportData.predictionSummary.totalSales}
平均日销量：${exportData.predictionSummary.avgDailySales}
预测准确率：${exportData.predictionSummary.accuracy}
增长潜力：${exportData.predictionSummary.growthPotential}
    `

    // 创建下载链接
    const blob = new Blob([mockExcelData], { 
      type: 'text/plain;charset=utf-8'
    })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `销量预测报告_${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    
    ElMessage.success('报告导出成功')
  } catch (error) {
    console.error('导出报告失败:', error)
    ElMessage.error('导出报告失败，请重试')
  } finally {
    loading.value = false
  }
}

const saveAsTemplate = async () => {
  try {
    const template: PredictionTemplate = {
      id: Date.now(),
      name: '预测模板_' + new Date().toLocaleString(),
      config: {
        period: predictionForm.value.period,
        customer: predictionForm.value.customer,
        channel: predictionForm.value.channel,
        category: predictionForm.value.category,
        skus: predictionForm.value.skus,
        factors: predictionForm.value.factors,
        options: predictionForm.value.options,
        dimension: predictionForm.value.dimension,
        dimensionValues: predictionForm.value.dimensionValues
      }
    }
    await savePredictionTemplate(template)
    ElMessage.success('预测模板保存成功')
  } catch (error) {
    console.error('保存模板失败:', error)
    ElMessage.error('保存模板失败')
  }
}

// 在script setup中添加
// 模板相关
const showTemplates = ref(false)
const filteredTemplates = computed(() => {
  if (!searchKeyword.value) return predictionTemplates.value
  const keyword = searchKeyword.value.toLowerCase()
  return predictionTemplates.value.filter(template => 
    template.name.toLowerCase().includes(keyword) ||
    template.config.customer.toLowerCase().includes(keyword) ||
    template.config.channel.toLowerCase().includes(keyword) ||
    template.config.category.toLowerCase().includes(keyword)
  )
})

// SKU选项加载函数
const loadSkuOptions = async (channelId: string, categoryId: string) => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据渠道和品类生成模拟数据
    const mockSkus: SelectOption[] = Array.from({ length: 10 }, (_, index) => ({
      value: `${channelId}_${categoryId}_${index + 1}`,
      label: `${getCategoryLabel(categoryId)}-${index + 1}`,
      info: `库存: ${Math.floor(Math.random() * 1000)}件`
    }))
    
    skuOptions.value = mockSkus
  } catch (error) {
    console.error('加载SKU选项失败:', error)
    ElMessage.error('加载SKU选项失败')
  }
}

// 获取品类标签
const getCategoryLabel = (categoryId: string): string => {
  const category = categoryOptions.value.find(c => c.value === categoryId)
  return category ? category.label : categoryId
}

// 修改图表初始化函数
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  if (!trendChart) {
    trendChart = echarts.init(trendChartRef.value)
  }

  trendChart.setOption({
    title: {
      text: '销量预测趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['预测销量', '实际销量']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '预测销量',
        type: 'line',
        data: [150, 230, 224, 218, 135, 147]
      },
      {
        name: '实际销量',
        type: 'line',
        data: [140, 232, 221, 214, 140, 142]
      }
    ]
  } as any)
}

const initFactorChart = () => {
  if (!factorChartRef.value) return
  
  if (!factorChart) {
    factorChart = echarts.init(factorChartRef.value)
  }

  factorChart.setOption({
    title: {
      text: '影响因素分析'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '影响因素',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 40, name: '季节性' },
          { value: 30, name: '促销活动' },
          { value: 20, name: '节假日' },
          { value: 10, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  } as any)
}

const initComparisonChart = () => {
  if (!comparisonChartRef.value) return
  
  if (!comparisonChart) {
    comparisonChart = echarts.init(comparisonChartRef.value)
  }

  comparisonChart.setOption({
    title: {
      text: '预测vs实际销量对比'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['预测值', '实际值', '误差率']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: [
      {
        type: 'value',
        name: '销量'
      },
      {
        type: 'value',
        name: '误差率',
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '预测值',
        type: 'bar',
        data: [150, 230, 224, 218, 135, 147]
      },
      {
        name: '实际值',
        type: 'bar',
        data: [140, 232, 221, 214, 140, 142]
      },
      {
        name: '误差率',
        type: 'line',
        yAxisIndex: 1,
        data: [7.1, -0.9, 1.4, 1.9, -3.6, 3.5]
      }
    ]
  } as any)
}

// 初始化所有图表
const initCharts = () => {
  initTrendChart()
  initFactorChart()
  initComparisonChart()
}

// 生成随机颜色
const getRandomColor = () => {
  const colors = [
    '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
    '#626AEF', '#36D399', '#FFB020', '#FF6B6B', '#8E99A4'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 监听窗口大小变化
const handleResize = () => {
  trendChart?.resize()
  factorChart?.resize()
  comparisonChart?.resize()
}

// 修改初始化数据函数
const initData = async () => {
  try {
    loading.value = true
    // 使用模拟数据
    predictionTemplates.value = [
      {
        id: 1,
        name: '节日促销预测',
        config: {
          period: '30',
          customer: 'vip',
          channel: 'tmall',
          category: 'clothing',
          skus: [],
          factors: ['season', 'promotion', 'holiday'],
          options: ['replenishment', 'promotion', 'analysis'],
          dimension: 'category',
          dimensionValues: ['clothing']
        }
      },
      {
        id: 2,
        name: '日常销售预测',
        config: {
          period: '7',
          customer: 'regular',
          channel: 'jd',
          category: 'shoes',
          skus: [],
          factors: ['season', 'promotion'],
          options: ['replenishment', 'analysis'],
          dimension: 'category',
          dimensionValues: ['shoes']
        }
      }
    ]
  } catch (error) {
    console.error('初始化数据失败:', error)
    ElMessage.error('初始化数据失败')
  } finally {
    loading.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('resize', handleResize)
  initData()
  initCharts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  factorChart?.dispose()
  comparisonChart?.dispose()
})

// 监听暗黑模式变化
watch(
  () => isDark.value,
  () => {
    nextTick(() => {
      initCharts()
    })
  }
)

// 监听表单变化
watch(
  () => predictionForm.value.channel,
  (newChannel) => {
    if (newChannel) {
      predictionForm.value.category = ''
      predictionForm.value.skus = []
    }
  }
)

watch(
  () => predictionForm.value.category,
  (newCategory) => {
    if (newCategory && predictionForm.value.channel) {
      loadSkuOptions(predictionForm.value.channel, newCategory)
    } else {
      predictionForm.value.skus = []
    }
  }
)
</script>

<style scoped>
.sales-prediction {
  padding: 20px;
}

.prediction-config {
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.overview-cards {
  margin-bottom: 20px;
}

.overview-card {
  height: 120px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  color: transparent;
}

.card-trend {
  font-size: 12px;
}

.trend-value {
  margin-right: 8px;
}

.trend-value.positive {
  color: var(--el-color-success);
}

.trend-value.negative {
  color: var(--el-color-danger);
}

.trend-label {
  color: var(--el-text-color-secondary);
}

.trend-chart-section {
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.chart-container {
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  color: transparent;
}

.prediction-details {
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.table-controls {
  display: flex;
  gap: 16px;
}

:deep(.el-table) {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-table th),
:deep(.el-table tr) {
  background: transparent !important;
}

:deep(.el-table td) {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.el-table--border) {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-table--border th),
:deep(.el-table--border td) {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.el-button) {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  border: none;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  border: none;
}

.form-buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
}

.dimension-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.dimension-info {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.factor-analysis-section {
  margin-top: 20px;
}

.factor-card {
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.factor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.factor-name {
  font-size: 18px;
  font-weight: 500;
}

.factor-impact {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}

.factor-impact.up {
  color: var(--el-color-success);
}

.factor-impact.down {
  color: var(--el-color-danger);
}

.factor-description {
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
}

.factor-metrics {
  margin-bottom: 16px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.metric-name {
  color: var(--el-text-color-regular);
}

.metric-value {
  font-weight: 500;
}

.metric-change {
  margin-left: 8px;
  font-size: 12px;
}

.metric-change.positive {
  color: var(--el-color-success);
}

.metric-change.negative {
  color: var(--el-color-danger);
}

.factor-suggestions {
  background: rgba(255, 255, 255, 0.02);
  padding: 16px;
  border-radius: 8px;
}

.factor-suggestions h4 {
  margin: 0 0 12px 0;
  color: var(--el-text-color-primary);
}

.factor-suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.factor-suggestions li {
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
  line-height: 1.5;
}

.replenishment-card,
.promotion-card {
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.replenishment-header,
.promotion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.product-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.sku {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.stock-info {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.info-item .label {
  color: var(--el-text-color-regular);
}

.info-item .value {
  font-weight: 500;
}

.info-item .value.highlight {
  color: var(--el-color-primary);
  font-size: 18px;
}

.risk-analysis {
  text-align: center;
}

.progress-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  display: block;
}

.percentage {
  font-size: 20px;
  font-weight: bold;
}

.profit-impact {
  margin-top: 12px;
  color: var(--el-text-color-secondary);
}

.trend-analysis {
  padding: 16px;
}

.trend-item {
  margin-bottom: 16px;
}

.trend-name {
  display: block;
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
}

.suggestion-box {
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.suggestion-box .el-icon {
  color: var(--el-color-primary);
  font-size: 20px;
}

.promotion-metrics {
  display: flex;
  gap: 12px;
}

.competitor-analysis,
.historical-performance {
  margin-bottom: 20px;
}

.competitor-analysis h5,
.historical-performance h5 {
  margin: 0 0 12px 0;
  color: var(--el-text-color-regular);
}

.promotion-suggestion {
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--el-color-primary);
  font-weight: 500;
}

.suggestion-content {
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.timing {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-style: italic;
}

.warehouse-details,
.sku-composition {
  margin-top: 20px;
}

.warehouse-details h4,
.sku-composition h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.el-progress-bar__inner) {
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
}

.trend-value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-value.positive {
  color: var(--el-color-success);
}

.trend-value.negative {
  color: var(--el-color-danger);
}
</style> 