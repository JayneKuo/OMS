<template>
  <div class="tracking-result">
    <div class="top-bar">
      <el-button class="back-to-search" @click="handleBack">
        <el-icon><Back /></el-icon>
        Back to Search
      </el-button>
      <div class="refresh-section">
        <span class="last-update">Last Updated: {{ formatTime(lastUpdateTime) }}</span>
        <el-button type="primary" class="refresh-button" @click="refresh">
          <el-icon class="refresh-icon"><Refresh /></el-icon>
          Refresh Data
        </el-button>
      </div>
    </div>

    <!-- Smart Insights -->
    <div class="smart-insights" v-if="insights.length">
      <div class="insights-header">
        <el-icon><Notification /></el-icon>
        <span>Smart Insights</span>
      </div>
      <div class="insights-list">
        <div v-for="(item, index) in insights" :key="index" 
          class="insight-card"
          :class="item.type">
          <div class="icon-wrapper">
            <el-icon>
              <Warning v-if="item.type === 'warning'" />
              <InfoFilled v-else-if="item.type === 'info'" />
              <CircleCheckFilled v-else />
            </el-icon>
          </div>
          <div class="content">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Tracking -->
    <div class="tracking-container" v-html="trackingHtml"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import {
  Warning,
  InfoFilled,
  CircleCheckFilled,
  Refresh,
  Location,
  Check,
  Loading,
  Back,
  ArrowRight,
  Notification
} from '@element-plus/icons-vue'
import axios from 'axios'

const props = defineProps({
  insights: {
    type: Array,
    default: () => []
  },
  data: {
    type: Object,
    required: true,
    default: () => ({
      orderNumber: '',
      status: '',
      steps: [],
      packages: []
    })
  }
})

const lastUpdateTime = ref(new Date().toISOString())
const trackingHtml = ref('')

const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US')
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const getStatusType = (status) => {
  const statusMap = {
    'Processing': 'warning',
    'Shipped': 'success',
    'Delivered': 'success',
    'Exception': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'pending': 'Pending',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'exception': 'Exception'
  }
  return textMap[status] || status
}

const getParcelStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'in_transit': 'warning',
    'delivered': 'success',
    'exception': 'danger'
  }
  return typeMap[status] || 'info'
}

const getParcelStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'in_transit': 'In Transit',
    'delivered': 'Delivered',
    'exception': 'Exception'
  }
  return textMap[status] || status
}

const getCarrierLogo = (carrier: string) => {
  return `/images/carriers/${carrier.toLowerCase()}.png`
}

const refresh = () => {
  // Implement refresh logic
  lastUpdateTime.value = new Date().toISOString()
}

const trackPackage = (trackingNo: string) => {
  // Implement package tracking detail logic
}

const handleBack = () => {
  emit('back')
}

const emit = defineEmits(['back'])

// Order Tracking specific logic
const orderData = ref(props.data)

const getProgressWidth = () => {
  if (!props.data?.steps?.length) return '0%'
  const completedSteps = props.data.steps.filter(step => step.completed).length
  return `${(completedSteps / props.data.steps.length) * 100}%`
}

const getStepIconClass = (step) => ({
  completed: step?.completed || false,
  active: step?.active || false,
  pending: !step?.completed && !step?.active
})

const getStepIcon = (step) => {
  if (step?.completed) return '✓'
  if (step?.active) return '📦'
  return step?.icon || '○'
}

const getCarrierIcon = (carrier) => {
  const carrierIcons = {
    'UPS': '📦',
    'FedEx': '🚚',
    'DHL': '✈️',
    'USPS': '📬'
  }
  return carrierIcons[carrier] || '📦'
}

const getPackageStatusClass = (status) => {
  const statusClasses = {
    'In Transit': 'warning',
    'Delivered': 'success',
    'Exception': 'error',
    'Processing': 'info'
  }
  return statusClasses[status]
}

const getEventClass = (event) => ({
  completed: event?.completed || false,
  active: event?.active || false,
  exception: event?.type === 'exception'
})

const getEventIcon = (event) => {
  const eventIcons = {
    'pickup': '📥',
    'transit': '🚚',
    'delivery': '📬',
    'exception': '⚠️'
  }
  return eventIcons[event?.type] || '●'
}

onMounted(async () => {
  try {
    const response = await fetch('/src/views/order/sales/order-tracking(1).html')
    trackingHtml.value = await response.text()
  } catch (error) {
    console.error('Failed to load tracking page:', error)
  }
})
</script>

<style lang="scss" scoped>
.tracking-result {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .back-to-search {
      background: linear-gradient(135deg, #4285f4, #34a853);
      border: none;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
        background: linear-gradient(135deg, #5294ff, #3cb85d);
      }

      .el-icon {
        font-size: 16px;
      }
    }
    
    .refresh-section {
      display: flex;
      align-items: center;
      gap: 16px;

      .last-update {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        background: rgba(255, 255, 255, 0.05);
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .refresh-button {
        background: linear-gradient(135deg, #4285f4, #34a853);
        border: none;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        text-shadow: 0 0 20px rgba(66, 133, 244, 0.3);

        .refresh-icon {
          font-size: 16px;
          animation: spin 2s linear infinite paused;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
          background: linear-gradient(135deg, #5294ff, #3cb85d);

          .refresh-icon {
            animation-play-state: running;
          }
        }
      }
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  // Smart Insights styles
  .smart-insights {
    margin-bottom: 24px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    overflow: hidden;
    
    .insights-header {
      padding: 16px;
      background: rgba(66, 133, 244, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      gap: 8px;
      
      .el-icon {
        font-size: 18px;
        color: #4285f4;
      }
      
      span {
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
      }
    }
    
    .insights-list {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .insight-card {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);

          .icon-wrapper {
            transform: scale(1.1);
          }
        }
        
        &.warning {
          border-left: 3px solid #f4b400;
          .icon-wrapper {
            background: rgba(244, 180, 0, 0.1);
            .el-icon {
              color: #f4b400;
            }
          }
        }
        
        &.info {
          border-left: 3px solid #4285f4;
          .icon-wrapper {
            background: rgba(66, 133, 244, 0.1);
            .el-icon {
              color: #4285f4;
            }
          }
        }
        
        &.success {
          border-left: 3px solid #0f9d58;
          .icon-wrapper {
            background: rgba(15, 157, 88, 0.1);
            .el-icon {
              color: #0f9d58;
            }
          }
        }
        
        .icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
          
          .el-icon {
            font-size: 20px;
          }
        }
        
        .content {
          flex: 1;
          min-width: 0;
          
          h4 {
            margin: 0 0 8px;
            font-size: 15px;
            color: #ffffff;
            font-weight: 500;
          }
          
          p {
            margin: 0;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            line-height: 1.5;
          }
        }
      }
    }
  }

  // Order Tracking styles
  .tracking-container {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    
    :deep(*) {
      font-family: inherit;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .order-tracking {
    .order-header {
      padding: 16px;
      
      .order-title {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
    
    .progress-timeline {
      .timeline-steps {
        flex-direction: column;
        gap: 24px;
        
        .timeline-step {
          flex-direction: row;
          
          .step-content {
            text-align: left;
          }
        }
      }
      
      .timeline-track,
      .timeline-progress {
        display: none;
      }
    }
    
    .package-card {
      .package-header {
        flex-direction: column;
        gap: 16px;
        
        .package-status {
          align-self: flex-start;
        }
      }
    }
  }
}
</style>