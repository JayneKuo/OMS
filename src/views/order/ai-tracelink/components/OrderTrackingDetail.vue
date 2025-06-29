<template>
  <div class="order-tracking-detail">
    <!-- 页面状态栏 -->
    <div class="page-status">
      <div class="status-left">
        <p class="last-updated">Last Updated: {{ lastUpdateTime }}</p>
        <p class="auto-refresh">Auto Refresh Every 30 Seconds</p>
      </div>
      <div class="status-right">
        <el-button-group>
          <el-button type="primary" @click="refreshOrder" :loading="refreshing">
            <el-icon><Refresh /></el-icon>
            Refresh
          </el-button>
          <el-button @click="exportOrder">
            <el-icon><Download /></el-icon>
            Export
          </el-button>
          <el-button @click="printOrder">
            <el-icon><Printer /></el-icon>
            Print
          </el-button>
          <el-button @click="shareOrder">
            <el-icon><Share /></el-icon>
            Share
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- AI分析结果 -->
    <div class="ai-analysis" v-if="aiAnalysis">
      <div class="analysis-header">
        <el-icon class="header-icon"><Lightning /></el-icon>
        <h3 class="header-title">AI Intelligent Analysis</h3>
        <span class="confidence-tag">
          Confidence: {{ (aiAnalysis.confidence * 100).toFixed(1) }}%
        </span>
      </div>

      <div class="analysis-grid">
        <!-- 路线优化 -->
        <div class="analysis-card">
          <div class="card-title">
            <el-icon><Location /></el-icon>
            Route Optimization
          </div>
          <div class="card-content">
            {{ aiAnalysis.analysis.routeOptimization }}
          </div>
        </div>

        <!-- 天气影响 -->
        <div class="analysis-card">
          <div class="card-title">
            <el-icon><Warning /></el-icon>
            Weather Impact
          </div>
          <div class="card-content">
            {{ aiAnalysis.analysis.weatherImpact }}
          </div>
        </div>

        <!-- 交通状况 -->
        <div class="analysis-card">
          <div class="card-title">
            <el-icon><Warning /></el-icon>
            Traffic Conditions
          </div>
          <div class="card-content">
            {{ aiAnalysis.analysis.trafficConditions }}
          </div>
        </div>

        <!-- 历史表现 -->
        <div class="analysis-card">
          <div class="card-title">
            <el-icon><Warning /></el-icon>
            Historical Performance
          </div>
          <div class="card-content">
            {{ aiAnalysis.analysis.historicalPerformance }}
          </div>
        </div>
      </div>

      <!-- AI预测和建议 -->
      <div class="prediction-section">
        <el-alert
          v-if="aiPrediction.delayProbability > 0.1"
          :title="`Delay Risk: ${(aiPrediction.delayProbability * 100).toFixed(1)}%`"
          type="warning"
          :closable="false"
          show-icon
        >
          <template #default>
            <div class="suggested-actions">
              <p>Suggested Actions:</p>
              <ul>
                <li v-for="(action, index) in aiPrediction.suggestedActions" :key="index">
                  {{ action }}
                </li>
              </ul>
            </div>
          </template>
        </el-alert>
      </div>
    </div>

    <!-- 包裹信息 -->
    <div class="package-info" v-if="packages.length > 0">
      <div class="package-header">
        <h3 class="header-title">Package Information</h3>
        <p class="header-subtitle">Total {{ packages.length }} Packages</p>
      </div>
      <div class="package-grid">
        <div v-for="pkg in packages" :key="pkg.id" class="package-card">
          <div class="card-header">
            <span class="package-id">{{ pkg.packageNo }}</span>
            <el-tag :type="getStatusTagType(pkg.status)" size="small">
              {{ getStatusText(pkg.status) }}
            </el-tag>
          </div>
          <div class="card-content">
            <div class="info-item">
              <div class="label">Shipment Type</div>
              <div class="value">{{ getShipmentTypeText(pkg.type) }}</div>
            </div>
            <div class="info-item">
              <div class="label">Tracking Number</div>
              <div class="value">{{ pkg.trackingNumber }}</div>
            </div>
            <div class="info-item">
              <div class="label">Estimated Delivery</div>
              <div class="value">{{ pkg.estimatedDeliveryTime }}</div>
            </div>
            <div class="info-item">
              <div class="label">Package Specifications</div>
              <div class="value">{{ pkg.weight }}kg / {{ pkg.dimensions }}</div>
            </div>
            <div class="info-item">
              <div class="label">Current Location</div>
              <div class="value">{{ pkg.currentLocation.city }}, {{ pkg.currentLocation.state }}</div>
            </div>
            <div class="info-item">
              <div class="label">Next Stop</div>
              <div class="value">{{ pkg.routeInfo.nextStop }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 追踪时间线 -->
    <div class="tracking-timeline" v-if="trackingEvents.length > 0">
      <div class="timeline-header">
        <h3 class="header-title">Tracking Records</h3>
        <p class="header-subtitle">Total {{ trackingEvents.length }} Records</p>
      </div>
      <el-timeline>
        <el-timeline-item
          v-for="event in trackingEvents"
          :key="event.id"
          :type="getStatusTagType(event.status)"
          :timestamp="event.time"
        >
          <h4>{{ event.location }}</h4>
          <p>{{ event.description }}</p>
          <!-- Weather and Traffic Information -->
          <div class="event-details" v-if="event.weatherConditions || event.trafficConditions">
            <el-tag 
              v-if="event.weatherConditions"
              :type="event.weatherConditions.impact === 'none' ? 'success' : 'warning'"
              size="small"
            >
              Weather: {{ event.weatherConditions.condition }} {{ event.weatherConditions.temperature }}°C
            </el-tag>
            <el-tag 
              v-if="event.trafficConditions"
              :type="event.trafficConditions.congestion === 'low' ? 'success' : 'warning'"
              size="small"
            >
              Traffic: {{ event.trafficConditions.congestion === 'low' ? 'Smooth' : 'Congested' }}
              {{ event.trafficConditions.delay > 0 ? `Delay ${event.trafficConditions.delay} mins` : '' }}
            </el-tag>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  Download,
  Printer,
  Share,
  ArrowDown,
  Link,
  Lightning,
  Location,
  Warning
} from '@element-plus/icons-vue'
import {
  type OrderStatus,
  type ShipmentType,
  type PackageInfo,
  type TrackingEvent,
  type StatusTagType,
  type StatusMapValue,
  type ShipmentTypeMapValue,
  type AITrackingResponse,
  statusMap,
  shipmentTypeMap,
  statusTagMap
} from '../types'

// 组件属性定义
const props = defineProps<{
  orderNo: string  // 改为直接接收订单号
}>()

// AI分析结果
const aiAnalysis = ref<AITrackingResponse | null>(null)

// 组件状态
const showDetails = ref(false)
const refreshing = ref(false)
const lastUpdateTime = ref(new Date().toLocaleString())
let refreshInterval: number | null = null

// 包裹列表
const packages = computed(() => aiAnalysis.value?.packages || [])

// 追踪事件
const trackingEvents = computed(() => aiAnalysis.value?.trackingEvents || [])

// AI预测和建议
const aiPrediction = computed(() => aiAnalysis.value?.prediction)
const aiSuggestions = computed(() => aiAnalysis.value?.analysis)

// 刷新订单信息
const refreshOrder = async () => {
  refreshing.value = true
  try {
    // 模拟AI分析调用
    const response = await mockAIAnalysis(props.orderNo)
    aiAnalysis.value = response
    lastUpdateTime.value = new Date().toLocaleString()
    ElMessage.success('AI Analysis Completed, Data Updated')
  } catch (error) {
    ElMessage.error('Update Failed, Please Try Again Later')
  } finally {
    refreshing.value = false
  }
}

// 模拟AI分析
const mockAIAnalysis = async (orderNo: string): Promise<AITrackingResponse> => {
  // 这里模拟API调用，实际项目中应该调用真实的AI服务
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    orderNo,
    status: 'in_transit',
    source: 'shopify',
    createTime: '2025-06-10 09:30:00',
    updateTime: new Date().toISOString(),
    eta: '2025-06-12 15:00:00',
    confidence: 0.95,
    packages: [
      {
        id: '1',
        packageNo: 'PKG-001',
        status: 'in_transit',
        type: 'small-parcel',
        carrier: 'UPS',
        trackingNumber: '1Z999999999',
        estimatedDeliveryTime: '2025-06-12 15:00:00',
        weight: 2.5,
        dimensions: '30x20x15cm',
        currentLocation: {
          city: 'Los Angeles',
          state: 'California',
          country: 'USA',
          coordinates: {
            lat: 34.0522,
            lng: -118.2437
          }
        },
        routeInfo: {
          origin: 'Los Angeles Warehouse',
          destination: 'New York Distribution Center',
          currentStop: 'Chicago Transfer Station',
          nextStop: 'Cleveland Sorting Center',
          remainingStops: 2
        }
      }
    ],
    trackingEvents: [
      {
        id: '1',
        status: 'shipped',
        time: '2025-06-10 10:00:00',
        location: 'Los Angeles Warehouse',
        description: 'Package Sent from Warehouse',
        coordinates: {
          lat: 34.0522,
          lng: -118.2437
        },
        weatherConditions: {
          temperature: 25,
          condition: 'Clear',
          impact: 'none'
        },
        trafficConditions: {
          congestion: 'low',
          delay: 0
        }
      }
    ],
    prediction: {
      estimatedDeliveryTime: '2025-06-12 15:00:00',
      delayProbability: 0.15,
      suggestedActions: [
        'Suggest Arriving 2 Hours Early for Delivery',
        'Weather Good, No Impact on Delivery',
        'Road Smooth, No Route Adjustment Needed'
      ]
    },
    analysis: {
      routeOptimization: 'Current Route Optimal, Estimated Savings of 2 Hours for Delivery',
      weatherImpact: 'Next 48 Hours Weather Good, No Impact on Delivery',
      trafficConditions: 'Target City Traffic Smooth, No Congestion Risk',
      historicalPerformance: 'This Route History On-Time Rate 98%, Excellent Performance'
    }
  }
}

// 方法定义
const toggleOrderDetails = () => {
  showDetails.value = !showDetails.value
}

const exportOrder = () => {
  // TODO: 实现导出逻辑
}

const printOrder = () => {
  // TODO: 实现打印逻辑
}

const shareOrder = () => {
  // TODO: 实现分享逻辑
}

const trackPackage = (pkg: any) => {
  // TODO: 实现包裹追踪逻辑
  ElMessage.info(`Redirecting to ${pkg.carrier} Tracking Page...`)
}

// 标签类型获取方法
const getPlatformTagType = (platform: string) => {
  const types = {
    shopify: 'success',
    amazon: 'warning',
    ebay: 'danger',
    walmart: 'info'
  }
  return types[platform] || 'info'
}

const getStatusText = (status: OrderStatus): StatusMapValue => statusMap[status]

const getShipmentTypeText = (type: ShipmentType): ShipmentTypeMapValue => shipmentTypeMap[type]

const getStatusTagType = (status: OrderStatus): StatusTagType => statusTagMap[status]

// 生命周期钩子
onMounted(async () => {
  // 初始加载
  await refreshOrder()
  
  // 设置自动刷新
  refreshInterval = window.setInterval(refreshOrder, 30000)
})

onUnmounted(() => {
  // 清除自动刷新
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style lang="scss" scoped>
.order-tracking-detail {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  overflow: hidden;

  // 暗色主题变量
  --card-bg: var(--el-bg-color);
  --border-color: var(--el-border-color-light);
  --text-primary: var(--el-text-color-primary);
  --text-secondary: var(--el-text-color-secondary);
  --component-bg: var(--el-bg-color-overlay);
  --primary-color: var(--el-color-primary);
  --primary-hover: var(--el-color-primary-light-3);
  --success-color: var(--el-color-success);
  --warning-color: var(--el-color-warning);
  --danger-color: var(--el-color-danger);
  --info-color: var(--el-color-info);

  .page-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: var(--component-bg);
    border-bottom: 1px solid var(--border-color);

    .status-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .last-updated {
        color: var(--text-secondary);
        font-size: 14px;
      }

      .auto-refresh {
        color: var(--text-secondary);
        font-size: 14px;
        opacity: 0.8;
      }
    }

    .status-right {
      :deep(.el-button) {
        height: 32px;
        padding: 0 16px;
        border-radius: 4px;
        font-size: 14px;

        &.el-button--primary {
          background: var(--primary-color);
          border: none;
          color: #fff;

          &:hover {
            background: var(--primary-hover);
          }
        }

        &.el-button--default {
          background: var(--component-bg);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);

          &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
          }
        }

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }

  // AI分析部分样式
  .ai-analysis {
    padding: 20px;
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);

    .analysis-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .header-icon {
        font-size: 24px;
        color: var(--primary-color);
      }

      .header-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }

      .confidence-tag {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        background: var(--success-color);
        color: white;
      }
    }

    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;

      .analysis-card {
        padding: 16px;
        background: var(--component-bg);
        border-radius: 8px;
        border: 1px solid var(--border-color);

        .card-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .card-content {
          color: var(--text-secondary);
          font-size: 13px;
        }
      }
    }
  }

  .order-header {
    margin-bottom: 24px;

    .order-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;

      .order-number {
        font-size: 24px;
        font-weight: 600;
        margin: 0;
      }
    }

    .order-details-content {
      margin-top: 16px;
    }

    .progress-container {
      margin-top: 30px;
    }
  }

  .fulfillment-section,
  .shipment-section {
    margin-bottom: 24px;

    .section-header {
      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
    }
  }

  .fulfillment-grid,
  .package-grid {
    display: grid;
    gap: 20px;
    margin-top: 16px;
  }

  .fulfillment-card,
  .package-item {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;

    .fulfillment-header,
    .package-header {
      margin-bottom: 20px;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .page-status {
      flex-direction: column;
      gap: 16px;
      text-align: center;

      .status-right {
        width: 100%;
        
        :deep(.el-button-group) {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
      }
    }

    .order-title {
      flex-direction: column;
      gap: 16px;

      .order-number {
        font-size: 20px;
      }
    }
  }
}
</style> 