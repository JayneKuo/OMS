<template>
  <div class="amazon-shipping-alert">
    <div class="alert-header">
      <div class="title">
        <el-icon class="amazon-icon"><Timer /></el-icon>
        <h3>Amazon Shipping Alerts</h3>
      </div>
      <div class="header-stats">
        <div class="stat-item danger">
          <span class="value">{{ criticalOrders }}</span>
          <span class="label">&lt; 4h</span>
        </div>
        <div class="stat-item warning">
          <span class="value">{{ urgentOrders }}</span>
          <span class="label">&lt; 8h</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ totalOrders }}</span>
          <span class="label">Total</span>
        </div>
      </div>
    </div>

    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-title">
          <el-icon><Warning /></el-icon>
          <span>Late Shipment Rate</span>
        </div>
        <div class="card-value" :class="{ warning: lateShipmentRate > 2 }">
          {{ lateShipmentRate }}%
        </div>
        <div class="card-trend" :class="{ up: lateShipmentTrend > 0 }">
          <el-icon><component :is="lateShipmentTrend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
          {{ Math.abs(lateShipmentTrend) }}% vs last week
        </div>
      </div>

      <div class="summary-card">
        <div class="card-title">
          <el-icon><Stopwatch /></el-icon>
          <span>Avg Processing Time</span>
        </div>
        <div class="card-value" :class="{ warning: avgProcessingTime > 12 }">
          {{ avgProcessingTime }}h
        </div>
        <div class="card-trend" :class="{ up: processingTimeTrend > 0 }">
          <el-icon><component :is="processingTimeTrend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
          {{ Math.abs(processingTimeTrend) }}h vs last week
        </div>
      </div>

      <div class="summary-card">
        <div class="card-title">
          <el-icon><Box /></el-icon>
          <span>Pending Items</span>
        </div>
        <div class="card-value">{{ totalPendingItems }}</div>
        <div class="items-detail">
          {{ priorityItems }} Priority / {{ standardItems }} Standard
        </div>
      </div>
    </div>

    <div class="alert-content">
      <div class="content-header">
        <div class="filters">
          <el-radio-group v-model="timeFilter" size="small">
            <el-radio-button label="all">All</el-radio-button>
            <el-radio-button label="critical">&lt; 4h</el-radio-button>
            <el-radio-button label="urgent">&lt; 8h</el-radio-button>
          </el-radio-group>
          <el-select v-model="sortBy" size="small" style="width: 140px">
            <el-option label="Time Remaining" value="time" />
            <el-option label="Items Count" value="items" />
            <el-option label="Priority" value="priority" />
          </el-select>
        </div>
        <el-button type="primary" size="small">
          <el-icon><Refresh /></el-icon>
          Refresh
        </el-button>
      </div>

      <el-scrollbar height="280px">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="alert-item"
          :class="{ 
            critical: order.remainingHours <= 4,
            urgent: order.remainingHours <= 8 && order.remainingHours > 4
          }"
        >
          <div class="order-info">
            <div class="left">
              <span class="order-id">{{ order.id }}</span>
              <el-tag 
                :type="getPriorityType(order.priority)"
                effect="plain"
                size="small"
              >
                {{ order.priority }}
              </el-tag>
            </div>
            <el-tag 
              :type="getTimeStatusType(order.remainingHours)"
              effect="dark"
              size="small"
            >
              {{ formatRemainingTime(order.remainingHours) }}
            </el-tag>
          </div>

          <div class="shipping-info">
            <div class="info-row">
              <div class="deadline">
                <el-icon><Clock /></el-icon>
                <span>Must ship before: {{ formatDeadline(order.deadline) }}</span>
              </div>
              <div class="items">
                <el-icon><Box /></el-icon>
                <span>{{ order.items }} items ({{ order.itemTypes }} types)</span>
              </div>
            </div>
            <div class="info-row">
              <div class="destination">
                <el-icon><Location /></el-icon>
                <span>{{ order.destination }}</span>
              </div>
              <div class="shipping-method">
                <el-icon><Van /></el-icon>
                <span>{{ order.shippingMethod }}</span>
              </div>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-bar">
              <div 
                class="progress" 
                :style="{ 
                  width: getProgressWidth(order.remainingHours),
                  backgroundColor: getProgressColor(order.remainingHours)
                }"
              ></div>
            </div>
            <div class="status-tags">
              <el-tag 
                v-for="status in order.status" 
                :key="status.label"
                :type="status.type"
                effect="plain"
                size="small"
              >
                {{ status.label }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="alert-footer">
      <el-button type="primary" text>View All Amazon Orders</el-button>
      <el-button type="warning" text>View Shipping SLA Report</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Timer, Clock, Box, Warning, Stopwatch, Location, Van,
  ArrowUp, ArrowDown, Refresh
} from '@element-plus/icons-vue'

interface OrderStatus {
  label: string
  type: string
}

interface ShippingAlert {
  id: string
  deadline: string
  remainingHours: number
  items: number
  itemTypes: number
  priority: string
  destination: string
  shippingMethod: string
  status: OrderStatus[]
}

// 统计数据
const lateShipmentRate = ref(2.8)
const lateShipmentTrend = ref(-0.5)
const avgProcessingTime = ref(10.5)
const processingTimeTrend = ref(-1.2)
const totalPendingItems = ref(156)
const priorityItems = ref(45)
const standardItems = ref(111)

// 筛选和排序
const timeFilter = ref('all')
const sortBy = ref('time')

// 订单数据
const alerts = ref<ShippingAlert[]>([
  {
    id: 'AMZ-2024-001',
    deadline: '2024-01-29 18:00:00',
    remainingHours: 2,
    items: 5,
    itemTypes: 3,
    priority: 'High',
    destination: 'California, US',
    shippingMethod: 'Prime 2-Day',
    status: [
      { label: 'Payment Verified', type: 'success' },
      { label: 'Stock Reserved', type: 'success' },
      { label: 'Picking In Progress', type: 'warning' }
    ]
  },
  {
    id: 'AMZ-2024-002',
    deadline: '2024-01-29 20:00:00',
    remainingHours: 4,
    items: 2,
    itemTypes: 1,
    priority: 'Medium',
    destination: 'New York, US',
    shippingMethod: 'Standard',
    status: [
      { label: 'Payment Verified', type: 'success' },
      { label: 'Awaiting Stock', type: 'warning' }
    ]
  },
  {
    id: 'AMZ-2024-003',
    deadline: '2024-01-30 10:00:00',
    remainingHours: 6,
    items: 8,
    itemTypes: 4,
    priority: 'High',
    destination: 'Texas, US',
    shippingMethod: 'Prime 1-Day',
    status: [
      { label: 'Payment Verified', type: 'success' },
      { label: 'Stock Reserved', type: 'success' },
      { label: 'Label Created', type: 'success' }
    ]
  },
  {
    id: 'AMZ-2024-004',
    deadline: '2024-01-30 14:00:00',
    remainingHours: 10,
    items: 1,
    itemTypes: 1,
    priority: 'Low',
    destination: 'Florida, US',
    shippingMethod: 'Standard',
    status: [
      { label: 'Payment Pending', type: 'danger' }
    ]
  },
  {
    id: 'AMZ-2024-005',
    deadline: '2024-01-30 16:00:00',
    remainingHours: 12,
    items: 4,
    itemTypes: 2,
    priority: 'Medium',
    destination: 'Washington, US',
    shippingMethod: 'Prime 2-Day',
    status: [
      { label: 'Payment Verified', type: 'success' },
      { label: 'Stock Reserved', type: 'success' }
    ]
  }
])

// 计算属性
const filteredOrders = computed(() => {
  let filtered = [...alerts.value]
  
  // 时间筛选
  if (timeFilter.value === 'critical') {
    filtered = filtered.filter(order => order.remainingHours <= 4)
  } else if (timeFilter.value === 'urgent') {
    filtered = filtered.filter(order => order.remainingHours <= 8)
  }
  
  // 排序
  filtered.sort((a, b) => {
    if (sortBy.value === 'time') {
      return a.remainingHours - b.remainingHours
    } else if (sortBy.value === 'items') {
      return b.items - a.items
    } else {
      // priority
      const priorityWeight = { High: 3, Medium: 2, Low: 1 }
      return priorityWeight[b.priority as keyof typeof priorityWeight] - 
             priorityWeight[a.priority as keyof typeof priorityWeight]
    }
  })
  
  return filtered
})

const criticalOrders = computed(() => 
  alerts.value.filter(order => order.remainingHours <= 4).length
)

const urgentOrders = computed(() => 
  alerts.value.filter(order => order.remainingHours <= 8 && order.remainingHours > 4).length
)

const totalOrders = computed(() => alerts.value.length)

// 工具函数
const getPriorityType = (priority: string): string => {
  const types: Record<string, string> = {
    High: 'danger',
    Medium: 'warning',
    Low: 'info'
  }
  return types[priority] || 'info'
}

const getTimeStatusType = (hours: number): string => {
  if (hours <= 4) return 'danger'
  if (hours <= 8) return 'warning'
  return 'info'
}

const formatRemainingTime = (hours: number): string => {
  if (hours < 1) return 'Less than 1 hour'
  return `${hours} hours remaining`
}

const formatDeadline = (deadline: string): string => {
  return new Date(deadline).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

const getProgressWidth = (hours: number): string => {
  const percentage = Math.min(100, (24 - hours) / 24 * 100)
  return `${percentage}%`
}

const getProgressColor = (hours: number): string => {
  if (hours <= 4) return '#f56c6c'
  if (hours <= 8) return '#e6a23c'
  return '#409eff'
}
</script>

<style lang="scss" scoped>
.amazon-shipping-alert {
  background: rgba(255, 153, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .alert-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .amazon-icon {
        font-size: 24px;
        color: #ff9900;
      }
      
      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: #fff;
      }
    }

    .header-stats {
      display: flex;
      gap: 16px;

      .stat-item {
        text-align: center;
        
        .value {
          display: block;
          font-size: 20px;
          font-weight: 600;
          color: #fff;
        }
        
        .label {
          font-size: 12px;
          color: #888;
        }

        &.danger .value {
          color: #f56c6c;
        }

        &.warning .value {
          color: #e6a23c;
        }
      }
    }
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .summary-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 16px;

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #888;
        font-size: 14px;
        margin-bottom: 8px;

        .el-icon {
          font-size: 16px;
        }
      }

      .card-value {
        font-size: 24px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 8px;

        &.warning {
          color: #e6a23c;
        }
      }

      .card-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #67c23a;

        &.up {
          color: #f56c6c;
        }
      }

      .items-detail {
        font-size: 13px;
        color: #888;
      }
    }
  }
  
  .alert-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .filters {
        display: flex;
        gap: 12px;
      }
    }
    
    .alert-item {
      padding: 16px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      margin-bottom: 12px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      &.critical {
        background: rgba(245, 108, 108, 0.1);
        
        &:hover {
          background: rgba(245, 108, 108, 0.15);
        }
      }

      &.urgent {
        background: rgba(230, 162, 60, 0.1);
        
        &:hover {
          background: rgba(230, 162, 60, 0.15);
        }
      }
      
      .order-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .left {
          display: flex;
          align-items: center;
          gap: 8px;

          .order-id {
            font-size: 14px;
            font-weight: 500;
            color: #fff;
          }
        }
      }
      
      .shipping-info {
        margin-bottom: 12px;

        .info-row {
          display: flex;
          gap: 24px;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
          
          .deadline,
          .items,
          .destination,
          .shipping-method {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #888;
            font-size: 13px;
            
            .el-icon {
              font-size: 16px;
            }
          }
        }
      }
      
      .progress-section {
        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
          
          .progress {
            height: 100%;
            transition: all 0.3s ease;
          }
        }

        .status-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
      }
    }
  }
  
  .alert-footer {
    display: flex;
    justify-content: center;
    gap: 16px;
    
    .el-button {
      &:first-child {
        color: #ff9900;
      }
    }
  }
}
</style> 