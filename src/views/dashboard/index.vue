<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>OMS Dashboard</h1>
      <div class="time-filter">
        <el-radio-group v-model="timeRange" size="large">
          <el-radio-button label="today">Today</el-radio-button>
          <el-radio-button label="7d">7 Days</el-radio-button>
          <el-radio-button label="30d">30 Days</el-radio-button>
          <el-radio-button label="ytd">This Year</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="metric-cards">
      <div class="metric-card">
        <div class="card-content">
          <div class="metric-header">
            <h3>OMS Received Documents</h3>
            <el-icon class="metric-icon"><Document /></el-icon>
          </div>
          <div class="metric-value">1,234</div>
          <div class="metric-description">Total documents received</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="card-content">
          <div class="metric-header">
            <h3>Transported Quantity</h3>
            <el-icon class="metric-icon"><Van /></el-icon>
          </div>
          <div class="metric-value">987</div>
          <div class="metric-description">Items shipped successfully</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="card-content">
          <div class="metric-header">
            <h3>Abnormal Documents</h3>
            <el-icon class="metric-icon warning"><Warning /></el-icon>
          </div>
          <div class="metric-value error">5</div>
          <div class="metric-description">Documents requiring attention</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="card-content">
          <div class="metric-header">
            <h3>On Hold Quantity</h3>
            <el-icon class="metric-icon hold"><Timer /></el-icon>
          </div>
          <div class="metric-value warning">1</div>
          <div class="metric-description">Items currently on hold</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-section">
      <div class="chart-card trend">
        <div class="card-header">
          <h3>E-commerce Channel Distribution Trend</h3>
          <el-icon><TrendCharts /></el-icon>
        </div>
        <channel-trend-chart :data="channelData" />
      </div>

      <div class="chart-card pie">
        <div class="card-header">
          <h3>Error Reason Analysis</h3>
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <error-pie-chart :data="errorData" />
      </div>
    </div>

    <!-- 亚马逊发货提醒 -->
    <div class="amazon-alert-section">
      <amazon-shipping-alert />
    </div>

    <!-- 异常订单列表 -->
    <div class="alerts-section">
      <div class="section-header">
        <h3>Detailed Alerts & Issues</h3>
        <el-icon><Warning /></el-icon>
      </div>
      <div class="alert-tabs">
        <div 
          v-for="tab in alertTabs" 
          :key="tab.type"
          :class="['tab', { active: currentTab === tab.type }]"
          @click="currentTab = tab.type"
        >
          <el-icon><component :is="tab.icon" /></el-icon>
          {{ tab.label }} ({{ tab.count }})
        </div>
      </div>
      <div class="alerts-table">
        <el-table :data="filteredAlerts" style="width: 100%">
          <el-table-column prop="orderId" label="Order ID" width="180" />
          <el-table-column prop="reason" label="Reason" />
          <el-table-column prop="status" label="Status" width="200" />
        </el-table>
        <div class="table-footer">
          <el-button type="primary" text>View All ({{ currentTabData.count }})</el-button>
        </div>
      </div>
    </div>

    <!-- 库存管理 -->
    <div class="inventory-section">
      <div class="section-header">
        <div class="header-left">
          <h3>Inventory & Purchase Planning</h3>
          <div class="metrics">
            <div class="metric">
              <div class="value">390</div>
              <div class="label">Total Recommended Order Items (30 Days)</div>
            </div>
            <div class="metric">
              <div class="value">6</div>
              <div class="label">Products Needing Reorder</div>
            </div>
          </div>
        </div>
        <el-icon><ShoppingCart /></el-icon>
      </div>
      <div class="inventory-table">
        <el-table :data="inventoryData" style="width: 100%">
          <el-table-column prop="name" label="Product Name" min-width="200" />
          <el-table-column prop="sku" label="SKU" width="120" />
          <el-table-column prop="predictedDemand" label="Predicted Demand (30 Days)" width="200" align="right" />
          <el-table-column prop="currentStock" label="Current Stock" width="120" align="right" />
          <el-table-column prop="stockStatus" label="Stock Status" width="120">
            <template #default="{ row }">
              <el-tag 
                :type="getStockStatusType(row.stockStatus)"
                effect="dark"
                size="small"
              >
                {{ row.stockStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="recommendedOrder" label="Recommended Order Quantity" width="200" align="right">
            <template #default="{ row }">
              <span class="recommended-quantity">{{ row.recommendedOrder }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="100" fixed="right">
            <template #default>
              <el-button type="primary" link>Reorder</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import { Document, Van, Warning, Timer, TrendCharts, DataAnalysis, ShoppingCart } from '@element-plus/icons-vue'
import ChannelTrendChart from './components/ChannelTrendChart.vue'
import ErrorPieChart from './components/ErrorPieChart.vue'
import AmazonShippingAlert from './components/AmazonShippingAlert.vue'

interface AlertTab {
  type: string
  label: string
  icon: string
  count: number
}

interface Alert {
  orderId: string
  reason: string
  status: string
  type: string
}

interface InventoryItem {
  name: string
  sku: string
  predictedDemand: number
  currentStock: number
  stockStatus: string
  recommendedOrder: number
}

const timeRange = ref('today')
const currentTab = ref('hold')

// 告警标签页配置
const alertTabs: AlertTab[] = [
  { type: 'hold', label: 'On Hold', icon: 'Timer', count: 8 },
  { type: 'allocation', label: 'Allocation', icon: 'Connection', count: 6 },
  { type: 'transmission', label: 'DC Transmission', icon: 'Upload', count: 5 },
  { type: 'cancelled', label: 'Cancelled', icon: 'CircleClose', count: 4 },
  { type: 'unfulfilled', label: 'Unfulfilled', icon: 'Box', count: 5 }
]

// 告警数据
const alerts: Alert[] = [
  // On Hold Orders
  {
    orderId: 'ORD001',
    reason: 'Customer credit limit exceeded',
    status: 'Pending Review',
    type: 'hold'
  },
  {
    orderId: 'ORD005',
    reason: 'Payment failed',
    status: 'Awaiting Payment',
    type: 'hold'
  },
  {
    orderId: 'ORD012',
    reason: 'Address verification failed',
    status: 'Pending Customer Contact',
    type: 'hold'
  },
  {
    orderId: 'ORD020',
    reason: 'Fraud suspicion',
    status: 'Under Investigation',
    type: 'hold'
  },
  {
    orderId: 'ORD021',
    reason: 'Item out of stock',
    status: 'Pending Restock',
    type: 'hold'
  },
  {
    orderId: 'ORD025',
    reason: 'High risk order',
    status: 'Manual Review Required',
    type: 'hold'
  },
  {
    orderId: 'ORD028',
    reason: 'Invalid shipping address',
    status: 'Customer Contact Needed',
    type: 'hold'
  },
  {
    orderId: 'ORD030',
    reason: 'Payment verification needed',
    status: 'Verification Pending',
    type: 'hold'
  },

  // Allocation Failures
  {
    orderId: 'ORD102',
    reason: 'No available warehouse',
    status: 'Allocation Failed',
    type: 'allocation'
  },
  {
    orderId: 'ORD105',
    reason: 'Insufficient stock level',
    status: 'Stock Check Failed',
    type: 'allocation'
  },
  {
    orderId: 'ORD108',
    reason: 'Invalid SKU',
    status: 'Product Verification Needed',
    type: 'allocation'
  },
  {
    orderId: 'ORD110',
    reason: 'Warehouse capacity full',
    status: 'Capacity Exceeded',
    type: 'allocation'
  },
  {
    orderId: 'ORD115',
    reason: 'System allocation error',
    status: 'System Error',
    type: 'allocation'
  },
  {
    orderId: 'ORD118',
    reason: 'Zone restriction',
    status: 'Zone Check Failed',
    type: 'allocation'
  },

  // DC Transmission Failures
  {
    orderId: 'ORD201',
    reason: 'Network timeout',
    status: 'Connection Failed',
    type: 'transmission'
  },
  {
    orderId: 'ORD205',
    reason: 'Invalid data format',
    status: 'Data Error',
    type: 'transmission'
  },
  {
    orderId: 'ORD208',
    reason: 'DC system offline',
    status: 'System Unavailable',
    type: 'transmission'
  },
  {
    orderId: 'ORD210',
    reason: 'Message queue full',
    status: 'Queue Overflow',
    type: 'transmission'
  },
  {
    orderId: 'ORD215',
    reason: 'API response error',
    status: 'API Error',
    type: 'transmission'
  },

  // Cancelled by WMS
  {
    orderId: 'ORD301',
    reason: 'Stock discrepancy',
    status: 'Stock Mismatch',
    type: 'cancelled'
  },
  {
    orderId: 'ORD305',
    reason: 'Picking impossible',
    status: 'Cannot Pick',
    type: 'cancelled'
  },
  {
    orderId: 'ORD308',
    reason: 'Location inaccessible',
    status: 'Location Error',
    type: 'cancelled'
  },
  {
    orderId: 'ORD310',
    reason: 'Product damaged',
    status: 'Quality Issue',
    type: 'cancelled'
  },

  // Partially Allocated
  {
    orderId: 'ORD401',
    reason: 'Partial stock available',
    status: 'Partial Allocation',
    type: 'unfulfilled'
  },
  {
    orderId: 'ORD405',
    reason: 'Split shipment required',
    status: 'Split Required',
    type: 'unfulfilled'
  },
  {
    orderId: 'ORD408',
    reason: 'Multiple warehouse needed',
    status: 'Multi-Location',
    type: 'unfulfilled'
  },
  {
    orderId: 'ORD410',
    reason: 'Backorder items',
    status: 'Backorder',
    type: 'unfulfilled'
  },
  {
    orderId: 'ORD415',
    reason: 'Mixed inventory status',
    status: 'Mixed Status',
    type: 'unfulfilled'
  }
]

// 库存数据
const inventoryData: InventoryItem[] = [
  {
    name: 'Wireless Mouse',
    sku: 'WM-001',
    predictedDemand: 150,
    currentStock: 5,
    stockStatus: 'Low Stock',
    recommendedOrder: 145
  },
  {
    name: 'Mechanical Keyboard',
    sku: 'MK-005',
    predictedDemand: 80,
    currentStock: 0,
    stockStatus: 'Out of Stock',
    recommendedOrder: 80
  },
  {
    name: 'USB-C Hub',
    sku: 'UCH-010',
    predictedDemand: 60,
    currentStock: 12,
    stockStatus: 'Low Stock',
    recommendedOrder: 48
  },
  {
    name: 'Gaming Headset',
    sku: 'GH-003',
    predictedDemand: 100,
    currentStock: 8,
    stockStatus: 'In Stock',
    recommendedOrder: 92
  },
  {
    name: 'Ergonomic Chair',
    sku: 'EC-001',
    predictedDemand: 20,
    currentStock: 0,
    stockStatus: 'Out of Stock',
    recommendedOrder: 20
  },
  {
    name: 'Webcam 1080p',
    sku: 'WC-002',
    predictedDemand: 40,
    currentStock: 35,
    stockStatus: 'Low Stock',
    recommendedOrder: 5
  }
]

// 获取当前标签页数据
const currentTabData = computed(() => {
  return alertTabs.find(tab => tab.type === currentTab.value) || alertTabs[0]
})

// 过滤告警数据
const filteredAlerts = computed(() => {
  return alerts.filter(alert => alert.type === currentTab.value)
})

// 获取库存状态样式
const getStockStatusType = (status: string): string => {
  const types: Record<string, string> = {
    'Out of Stock': 'danger',
    'Low Stock': 'warning',
    'In Stock': 'success'
  }
  return types[status] || 'info'
}
</script>

<style lang="scss" scoped>
.dashboard {
  min-height: 100vh;
  padding: 24px;
  background-color: #0a0a0a;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 32px; // 增加整体间距

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      font-weight: 500;
      margin: 0;
    }

    .time-filter {
      :deep(.el-radio-button__inner) {
        background-color: #1a1a1a;
        border-color: #333;
        color: #888;

        &:hover {
          color: #fff;
        }

        &.is-active {
          background-color: #333;
          border-color: #444;
          color: #fff;
          box-shadow: none;
        }
      }
    }
  }

  .metric-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;

    .metric-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      overflow: hidden;

      .card-content {
        padding: 20px;

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h3 {
            font-size: 16px;
            font-weight: 500;
            margin: 0;
            color: #888;
          }

          .metric-icon {
            font-size: 24px;
            color: #666;

            &.warning {
              color: #e6a23c;
            }

            &.hold {
              color: #f56c6c;
            }
          }
        }

        .metric-value {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #fff;

          &.error {
            color: #f56c6c;
          }

          &.warning {
            color: #e6a23c;
          }
        }

        .metric-description {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .chart-section {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 20px;
    margin-bottom: 24px;

    .chart-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h3 {
          font-size: 16px;
          font-weight: 500;
          margin: 0;
          color: #fff;
        }

        .el-icon {
          font-size: 20px;
          color: #666;
        }
      }
    }
  }

  .amazon-alert-section {
    margin-bottom: 24px;
    min-height: 480px;
    position: relative;
    z-index: 1;
    
    // 添加hover效果
    :deep(.amazon-shipping-alert) {
      height: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 153, 0, 0.1);
      }
    }
  }

  .alerts-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    position: relative;
    z-index: 0;
    
    // 添加hover效果
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: #fff;
      }

      .el-icon {
        font-size: 20px;
        color: #666;
      }
    }

    .alert-tabs {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      border-bottom: 1px solid #333;
      padding-bottom: 12px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        height: 4px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
      }

      .tab {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        color: #888;
        transition: all 0.3s ease;
        white-space: nowrap;

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        &.active {
          color: #fff;
          background: #333;
        }

        .el-icon {
          font-size: 16px;
        }
      }
    }

    .alerts-table {
      :deep(.el-table) {
        background: transparent;
        border: none;

        &::before {
          display: none;
        }

        .el-table__header-wrapper {
          th {
            background: #1a1a1a;
            border-bottom: 1px solid #333;
            color: #888;
            font-weight: 500;
          }
        }

        .el-table__body-wrapper {
          tr {
            background: transparent;
            border-bottom: 1px solid #222;

            &:hover > td {
              background: rgba(255, 255, 255, 0.05);
            }

            td {
              border: none;
              color: #fff;
            }
          }
        }
      }

      .table-footer {
        display: flex;
        justify-content: center;
        padding: 16px 0;

        .el-button {
          color: #409eff;
        }
      }
    }
  }

  .inventory-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    z-index: 0;
    
    // 添加hover效果
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;

      .header-left {
        h3 {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 16px;
          color: #fff;
        }

        .metrics {
          display: flex;
          gap: 32px;

          .metric {
            .value {
              font-size: 24px;
              font-weight: 600;
              color: #fff;
              margin-bottom: 4px;
            }

            .label {
              font-size: 13px;
              color: #666;
            }
          }
        }
      }

      .el-icon {
        font-size: 24px;
        color: #666;
      }
    }

    .inventory-table {
      :deep(.el-table) {
        background: transparent;
        border: none;

        &::before {
          display: none;
        }

        .el-table__header-wrapper {
          th {
            background: #1a1a1a;
            border-bottom: 1px solid #333;
            color: #888;
            font-weight: 500;
          }
        }

        .el-table__body-wrapper {
          tr {
            background: transparent;
            border-bottom: 1px solid #222;

            &:hover > td {
              background: rgba(255, 255, 255, 0.05);
            }

            td {
              border: none;
              color: #fff;
            }
          }
        }

        .recommended-quantity {
          color: #67c23a;
          font-weight: 600;
        }
      }
    }
  }
}
</style> 