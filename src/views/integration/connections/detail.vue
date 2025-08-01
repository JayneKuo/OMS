<template>
  <div class="connection-detail">
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="handleBack" class="back-button">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <div class="connection-info">
          <div class="integration-logo">
            <img :src="connectionData.logo" :alt="connectionData.name" @error="handleImageError($event, connectionData)">
            <span v-if="connectionData.showNameFallback" class="name-fallback">
              {{ getNameInitials(connectionData.name) }}
            </span>
          </div>
          <div class="connection-meta">
            <h2>{{ connectionData.name }}</h2>
            <div class="version">{{ connectionData.version }}</div>
          </div>
        </div>
      </div>
      <div class="connection-status">
        <div class="status-tag" :class="{ 'connected': connectionData.status === 'connected' }">
          {{ connectionData.status === 'connected' ? 'Connected' : 'Disabled' }}
        </div>
        <el-switch
          v-model="connectionData.enabled"
          :active-value="true"
          :inactive-value="false"
          @change="handleStatusChange"
        />
        <el-dropdown trigger="click">
          <el-button link>
            <el-icon><MoreFilled /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleDelete">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="detail-content">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="Connection Details" name="details">
          <div class="connection-form">
            <div class="form-section">
              <h3>Select UNIS environment</h3>
              <el-select 
                v-model="connectionSettings.environment" 
                placeholder="Select environment"
                class="full-width-input"
              >
                <el-option label="UNIS Sandbox" value="sandbox" />
                <el-option label="UNIS Production" value="production" />
              </el-select>
            </div>

            <div class="form-section">
              <h3>User name</h3>
              <el-input 
                v-model="connectionSettings.username" 
                placeholder="Enter the UNIS user name"
                class="full-width-input"
              />
            </div>

            <div class="form-section">
              <h3>Password</h3>
              <el-input 
                v-model="connectionSettings.password" 
                type="password" 
                show-password 
                placeholder="Enter the UNIS password"
                class="full-width-input"
              />
            </div>

            <div class="form-section">
              <h3>Company Id</h3>
              <el-input 
                v-model="connectionSettings.companyId" 
                placeholder="Enter the UNIS company id"
                class="full-width-input"
              />
            </div>

            <div class="form-section">
              <h3>Customer Id</h3>
              <el-input 
                v-model="connectionSettings.customerId" 
                placeholder="Enter the UNIS customer id"
                class="full-width-input"
              />
            </div>

            <div class="form-section">
              <h3>Facility Id</h3>
              <el-input 
                v-model="connectionSettings.facilityId" 
                placeholder="Enter the UNIS facility id"
                class="full-width-input"
              />
            </div>

            <div class="form-actions">
              <el-button type="primary" @click="handleSave">Save</el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Settings" name="settings">
          <settings-tab v-model="settings" />
        </el-tab-pane>

        <el-tab-pane label="Mappings" name="mappings">
          <mapping-settings :channel-name="connectionData.type" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { MoreFilled, ArrowLeft } from '@element-plus/icons-vue'
import ConnectionSettings from './components/ConnectionSettings.vue'
import MappingSettings from './components/MappingSettings.vue'
import ShopifySettings from './components/ShopifySettings.vue'
import ChannelSettings from './components/ChannelSettings.vue'
import SettingsTab from './components/SettingsTab.vue'

const router = useRouter()
const activeTab = ref('details')

const handleTabClick = (tab: any) => {
  console.log('Tab clicked:', tab.props.name)
  // 这里可以添加其他tab切换逻辑
}

// 连接数据
const connectionData = ref({
  name: 'Fontana',
  version: 'UNIS 3PL version 1.0.0',
  type: 'UNIS', // 或 'Shopify'
  status: 'connected',
  enabled: true,
  logo: '/icons/unis.png',
  showNameFallback: false
})

// UNIS连接设置
const connectionSettings = ref({
  environment: 'sandbox',
  username: 'csg90',
  password: '********',
  companyId: 'LT',
  customerId: 'BATEST0001',
  facilityId: '930'
})

// 设置数据
const settings = ref({
  orders: {
    mode: 'pull',
    lastPull: '07/22/2025 8:20 AM',
    nextStatus: 'In Progress'
  },
  products: {
    mode: 'pull',
    lastPull: '07/22/2025 1:00 PM',
    nextStatus: 'In Progress'
  },
  inventory: {
    mode: 'disabled'
  },
  fulfillments: {
    mode: 'disabled'
  },
  returns: {
    mode: 'disabled'
  },
  refunds: {
    mode: 'disabled'
  },
  statements: {
    enabled: false
  },
  locations: {
    enabled: false
  },
  shopifySettings: {
    // Orders
    timezone: 'GMT+8',
    excludeBeforeDate: '07/17/2025 10:07 AM',
    createdAt: '07/17/2025 10:07 AM',
    regularOrders: '',
    paymentStatuses: ['paid', 'refunded', 'partially_refunded'],
    orderTags: 'wholesale_order',
    excludeTagsPattern: '/.+USED$/',
    excludeSkuPattern: '/.+USED$/',
    pullAllocatedOnly: true,
    pullAmazonBuyPrime: true,
    adjustPriceWithTax: false,
    pullPayments: false,
    localizedFieldsCountries: '',
    fetchCompanyProfile: false,

    // Order Tags
    acceptedTag: 'oms_accepted',
    routedTag: 'oms_routed',
    cancelledTag: 'oms_cancelled',
    pushOrderTags: false,

    // Order Flow
    resolveCustomerConflicts: false,
    removeInvalidCustomerData: false,
    splitByFulfillmentOrder: false,

    // Outbound Orders Matching
    orderStatuses: [],
    orderSourcePattern: '',
    orderTagPattern: '',

    // Order Flow Settings
    pushForFulfillment: false,
    pushForTracking: false,
    markAsSentToFulfillment: false,
    defaultOrdersLocation: '',
    holdAndReleaseFulfillment: false,
    allowOrderUpdates: false,

    // Fulfillments
    excludeReferencePattern: '/^REPLACEMENT-/',
    allowLocationSwap: false,
    allowPullFulfillments: false,

    // Returns
    pullReturnsWithShipping: false,
    pullReturnsWithLocation: false,

    // Products
    productExcludeSkuPattern: '',
    productExcludeTagPattern: '',
    priceField: 'price',
    compareAtPriceField: 'compare_at_price',
    allowEmptySku: false,
    allowOverwriteProducts: false,
    allowExtendProducts: false,
    pullAllVariants: false,
    enableDailyResync: false,
    forceProductResync: false,

    // Inventory
    reportInventoryTotals: false,
    inventoryField: 'available',
    autoConnectInventory: false,
    inventoryExcludeSkuPattern: '',
    inventoryExcludeTagPattern: '',
    inventoryIncludeSkuPattern: '',
    inventoryIncludeTagPattern: '',
    enableInventoryReconciliation: false,
    increaseInventoryInDedicatedHours: false,
    forceInventoryResync: false,

    // Statements
    statementDateFormat: 'mm/dd/yyyy hh:mm (a|p)m',

    // Advanced
    fulfillmentServiceMode: '',
    createFromFulfillmentOrder: false,

    // Fulfillment Service Locations
    fulfillmentServiceName: 'OMS',
    tracksInventory: false,
    requiresShipping: false,
    providesTrackingNumbers: false
  }
})

// 方法
const handleBack = () => {
  router.back()
}

const handleStatusChange = (value: boolean) => {
  connectionData.value.status = value ? 'connected' : 'disabled'
  ElMessage.success(`Integration ${value ? 'enabled' : 'disabled'} successfully`)
}

const handleSave = () => {
  ElMessage.success('Settings saved successfully')
}

const handleDelete = () => {
  ElMessage.warning('Delete functionality not implemented')
}

const handleImageError = (event: Event, item: any) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  item.showNameFallback = true
}

const getNameInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<style lang="scss" scoped>
.connection-detail {
  padding: 24px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    background: var(--el-bg-color);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .back-button {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: var(--el-text-color-regular);

        &:hover {
          color: var(--el-color-primary);
        }

        .el-icon {
          font-size: 16px;
        }
      }

      .connection-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .integration-logo {
          position: relative;
          width: 40px;
          height: 40px;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .name-fallback {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--el-color-primary-light-8);
            color: var(--el-color-primary);
            font-weight: bold;
            font-size: 14px;
            border-radius: 4px;
          }
        }

        .connection-meta {
          h2 {
            margin: 0 0 4px;
            font-size: 20px;
            font-weight: 600;
          }

          .version {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 16px;

      .status-tag {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 4px;
        background-color: var(--el-fill-color);
        color: var(--el-text-color-secondary);
        min-width: 70px;
        text-align: center;

        &.connected {
          background-color: var(--el-color-success-light-9);
          color: var(--el-color-success);
        }
      }
    }
  }

  .detail-content {
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 20px;
      border-bottom: 1px solid var(--el-border-color-light);
    }

    :deep(.el-tabs__nav-wrap) {
      &::after {
        display: none;
      }
    }

    :deep(.el-tabs__item) {
      padding: 16px 20px;
      height: auto;
      font-size: 14px;
      
      &.is-active {
        font-weight: 600;
      }
    }

    :deep(.el-tabs__content) {
      padding: 24px;
    }

    // Connection Details 表单样式
    .connection-form {
      max-width: 800px;

      .form-section {
        margin-bottom: 32px;

        &:last-child {
          margin-bottom: 0;
        }

        h3 {
          margin: 0 0 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .full-width-input {
          width: 100%;
          
          :deep(.el-input__inner) {
            height: 40px;
            padding: 0 16px;
          }

          :deep(.el-input__wrapper) {
            box-shadow: 0 0 0 1px var(--el-border-color) inset;

            &:hover {
              box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
            }

            &.is-focus {
              box-shadow: 0 0 0 1px var(--el-color-primary) inset;
            }
          }
        }
      }

      .form-actions {
        margin-top: 40px;
        padding-top: 24px;
        border-top: 1px solid var(--el-border-color-light);

        .el-button {
          min-width: 120px;
          height: 40px;
          padding: 0 24px;
        }
      }
    }

    // Settings 标签页样式
    .settings-content {
      .settings-section {
        margin-bottom: 40px;

        &:last-child {
          margin-bottom: 0;
        }

        h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--el-border-color-light);
          color: var(--el-text-color-primary);
        }

        .setting-group {
          margin-bottom: 32px;
          background: var(--el-bg-color-overlay);
          border-radius: 8px;
          padding: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          h4 {
            margin: 0 0 20px;
            font-size: 14px;
            font-weight: 500;
            color: var(--el-text-color-primary);
          }

          .setting-item {
            .setting-row {
              margin-bottom: 20px;

              &:last-child {
                margin-bottom: 0;
              }

              .label {
                display: block;
                margin-bottom: 8px;
                font-size: 13px;
                color: var(--el-text-color-regular);
              }

              .el-switch {
                margin-left: 0;
              }
            }

            .setting-hint {
              margin-top: 6px;
              font-size: 12px;
              color: var(--el-text-color-secondary);
              line-height: 1.5;
            }

            .setting-switches {
              .el-checkbox {
                display: block;
                margin: 16px 0;
                margin-left: 0;
                margin-right: 0;
                white-space: normal;
                line-height: 1.5;
                
                &:first-of-type {
                  margin-top: 0;
                }
                
                &:last-of-type {
                  margin-bottom: 0;
                }

                :deep(.el-checkbox__label) {
                  line-height: 1.5;
                  white-space: normal;
                }

                .setting-hint {
                  margin-top: 4px;
                  margin-left: 24px;
                }
              }
            }
          }
        }
      }
    }

    // Mappings 标签页样式
    :deep(.mapping-settings) {
      .mapping-header {
        margin-bottom: 32px;
      }

      .mapping-filters {
        margin-bottom: 32px;
      }

      .mapping-list {
        .mapping-item {
          margin-bottom: 20px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

          &:last-child {
            margin-bottom: 0;
          }

          .mapping-row {
            padding: 20px;
          }

          .mapping-advanced {
            padding: 16px 20px;
          }
        }
      }
    }
  }
}
</style> 