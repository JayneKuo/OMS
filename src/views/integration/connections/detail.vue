<template>
  <div class="connection-detail">
    <!-- Header -->
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
            <div class="type-tag">{{ connectionData.type }}</div>
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
      </div>
    </div>

    <!-- Content -->
    <div class="detail-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Connection Details" name="details">
          <div class="details-container">
            <!-- Connection Status -->
            <div class="detail-card status-card">
              <div class="card-header">
                <h3>Connection Status</h3>
              </div>
              <div class="card-content">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="Status">
                    <el-tag :type="connectionData.enabled ? 'success' : 'danger'" class="status-tag">
                      {{ connectionData.enabled ? 'Connected' : 'Disconnected' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="Last Sync">
                    {{ connectionData.lastSyncTime || 'Never' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Integration Type">
                    {{ connectionData.type }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Version">
                    {{ connectionData.version || 'Latest' }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>

            <!-- Connection Information -->
            <div class="detail-card info-card">
              <div class="card-header">
                <h3>Connection Information</h3>
                <el-alert
                  v-if="connectionData.subType && AUTH_CONFIGS[connectionData.subType]?.instructions"
                  :title="AUTH_CONFIGS[connectionData.subType].instructions"
                  type="info"
                  :closable="false"
                  show-icon
                  class="info-alert"
              />
            </div>
              <div class="card-content">
                <el-form 
                  ref="formRef"
                  :model="connectionSettings"
                  label-width="140px"
                  class="connection-form"
                  :rules="formRules"
                >
                  <template v-if="connectionData.subType && AUTH_CONFIGS[connectionData.subType]">
                    <el-form-item
                      v-for="field in AUTH_CONFIGS[connectionData.subType].fields"
                      :key="field.key"
                      :label="field.label"
                      :prop="field.key"
                      :required="field.required"
                    >
                      <!-- Select Field -->
                      <el-select
                        v-if="field.type === 'select'"
                        v-model="connectionSettings[field.key]"
                        :placeholder="field.placeholder"
                        class="field-input"
                        @change="handleEnvironmentChange"
                      >
                        <el-option
                          v-for="option in field.options"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                      <!-- Text/Password Field -->
              <el-input 
                        v-else
                        v-model="connectionSettings[field.key]"
                        :type="field.type"
                        :placeholder="field.placeholder"
                        :show-password="field.type === 'password'"
                        class="field-input"
                      />
                    </el-form-item>
                  </template>
                </el-form>
              </div>
            </div>

            <!-- Connection Statistics -->
            <div class="detail-card stats-card" v-if="connectionData.connectionInfo">
              <div class="card-header">
                <h3>Statistics</h3>
              </div>
              <div class="card-content">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="stat-item">
                      <div class="stat-label">Total Orders</div>
                      <div class="stat-value">{{ connectionData.connectionInfo.totalOrders || 0 }}</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="stat-item">
                      <div class="stat-label">Pending Orders</div>
                      <div class="stat-value">{{ connectionData.connectionInfo.pendingOrders || 0 }}</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="stat-item">
                      <div class="stat-label">Total Products</div>
                      <div class="stat-value">{{ connectionData.connectionInfo.totalProducts || 0 }}</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="stat-item">
                      <div class="stat-label">Active Products</div>
                      <div class="stat-value">{{ connectionData.connectionInfo.activeProducts || 0 }}</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="stat-item">
                      <div class="stat-label">Last Order Sync</div>
                      <div class="stat-value">{{ connectionData.connectionInfo.lastOrderSync || 'Never' }}</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="stat-item">
                      <div class="stat-label">Last Product Sync</div>
                      <div class="stat-value">{{ connectionData.connectionInfo.lastProductSync || 'Never' }}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="detail-card action-card">
              <div class="card-content">
                <div class="action-buttons">
                  <el-button type="primary" @click="handleTest" :icon="Check">Test Connection</el-button>
                  <el-button type="success" @click="handleSave" :icon="Upload">Save Changes</el-button>
            </div>
            </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Settings" name="settings">
          <settings-tab 
            v-model="settings" 
            :channel-type="connectionData.subType"
          />
        </el-tab-pane>

        <el-tab-pane label="Mappings" name="mappings">
          <mapping-settings :channel-name="connectionData.type" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { MoreFilled, ArrowLeft, Check, Upload } from '@element-plus/icons-vue'
import { IntegrationSubType, AUTH_CONFIGS, MOCK_INTEGRATIONS, AVAILABLE_INTEGRATIONS } from '@/constants/integration'
import type { Integration } from '@/types/integration'
import ConnectionSettings from './components/ConnectionSettings.vue'
import MappingSettings from './components/MappingSettings.vue'
import ShopifySettings from './components/ShopifySettings.vue'
import ChannelSettings from './components/ChannelSettings.vue'
import SettingsTab from './components/SettingsTab.vue'

const router = useRouter()
const route = useRoute()
const activeTab = ref('details')

const handleTabClick = (tab: any) => {
  console.log('Tab clicked:', tab.props.name)
  // 这里可以添加其他tab切换逻辑
}

// 连接数据 - 从路由参数获取
const connectionData = ref({
  id: route.params.id,
  name: '',
  version: '',
  type: '',
  subType: '', // 新增 subType
  status: 'disabled',
  enabled: false,
  logo: '',
  showNameFallback: false,
  connectionInfo: {}
})

// 连接设置
const connectionSettings = ref<Record<string, any>>({})

// 仓库设置
const warehouseSettings = ref({
  warehouseId: '',
  location: ''
})

// Shopify 统计数据
const shopifyStats = ref({
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  planName: 'Basic'
})

// Amazon 统计数据
const amazonStats = ref({
  totalOrders: 0,
  activeListings: 0,
  fbaInventory: 0,
  accountHealth: 'Good'
})

// Walmart 统计数据
const marketplaceStats = ref({
  totalOrders: 0,
  totalProducts: 0,
  totalInventory: 0,
  revenue: 0,
  accountStatus: 'Active'
})

// 添加新的状态数据
const tiktokStats = ref({
  totalOrders: 0,
  totalProducts: 0,
  revenue: 0,
  shopRegion: '',
  accountStatus: 'Active'
})

const wooStats = ref({
  totalOrders: 0,
  totalProducts: 0,
  revenue: 0,
  storeUrl: '',
  lastSync: null
})

const ebayStats = ref({
  totalOrders: 0,
  totalProducts: 0,
  revenue: 0,
  accountId: '',
  marketplace: ''
})

const upsStats = ref({
  shipmentCount: 0,
  trackingCount: 0,
  revenue: 0,
  accountNumber: '',
  serviceLevel: 'Standard'
})

// 测试连接
const testing = ref(false)
const handleTest = async () => {
  testing.value = true
  try {
    // TODO: 实现测试连接逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Connection test successful')
  } catch (error) {
    ElMessage.error('Connection test failed')
  } finally {
    testing.value = false
  }
}

// WMS环境 URL 配置
const WMS_URLS = {
  'UNIS WMS': {
    test: 'https://api-test.unis.com',
    production: 'https://api.unis.com'
  },
  'Item WMS': {
    test: 'https://api-test.itemwms.com',
    production: 'https://api.itemwms.com'
  }
}

// 环境变更处理
const handleEnvironmentChange = () => {
  const subType = connectionData.value.subType
  if (subType === IntegrationSubType.UNIS_WMS || subType === IntegrationSubType.ITEM_WMS) {
    const env = connectionSettings.value.environment
    if (env === 'test') {
      connectionSettings.value.api_url = subType === IntegrationSubType.UNIS_WMS 
        ? 'https://test-api.unis.com/v1'
        : 'https://test-api.itemwms.com/v1'
    } else if (env === 'production') {
      connectionSettings.value.api_url = subType === IntegrationSubType.UNIS_WMS
        ? 'https://api.unis.com/v1'
        : 'https://api.itemwms.com/v1'
    }
  }
}

// 初始化数据
const initConnectionData = async () => {
  try {
    const id = route.params.id
    let integration = MOCK_INTEGRATIONS.find(item => item.id.toString() === id)

    if (!integration) {
      ElMessage.error('Integration not found')
      router.push('/integration/connections')
      return
    }

    // 更新连接数据
    connectionData.value = {
      id: integration.id,
      name: integration.name,
      type: integration.type,
      subType: integration.subType,
      status: integration.status,
      enabled: integration.enabled,
      logo: integration.logo,
      showNameFallback: integration.showNameFallback,
      lastSyncTime: integration.connectionInfo?.lastSyncTime || null,
      connectionInfo: integration.connectionInfo || {}
    }

    // 初始化连接设置
    if (integration.subType && AUTH_CONFIGS[integration.subType]) {
      const formData: Record<string, any> = {}
      AUTH_CONFIGS[integration.subType].fields.forEach(field => {
        formData[field.key] = integration.connectionInfo?.[field.key] || ''
      })
      connectionSettings.value = formData
    }

    // 初始化渠道设置
    if (integration.subType) {
      settings.value.channelSettings = {
        ...getDefaultChannelSettings(integration.subType),
        ...integration.connectionInfo
      }
    }
  } catch (error) {
    console.error('Failed to fetch connection details:', error)
    ElMessage.error('Failed to load connection details')
  }
}

// 获取渠道默认设置
const getDefaultChannelSettings = (type: string) => {
  switch (type) {
    case IntegrationSubType.AMAZON:
      return {
        marketplace: 'ATVPDKIKX0DER',
        orderStatuses: ['Unshipped'],
        fulfillmentChannel: ['MFN'],
        pullPrimeOrders: true,
        inventoryMode: 'fbm',
        enableAutoFulfillment: false,
        enableInventorySync: true,
        reportTypes: ['inventory', 'orders'],
        reportSchedule: '30min'
      }
    case IntegrationSubType.WALMART:
      return {
        channelType: 'marketplace',
        orderStatuses: ['Created'],
        pullCancelledOrders: false,
        enableAutoAcknowledgement: true,
        inventoryMode: 'realtime',
        lagTime: 30,
        enableInventorySync: true,
        defaultShippingMethod: 'Standard',
        enableShipmentUpdates: true,
        requireTrackingNumbers: true,
        enableReturns: true,
        returnWindow: 30
      }
    case IntegrationSubType.TIKTOK:
      return {
        shopRegion: 'US',
        orderStatuses: ['AWAITING_SHIPMENT'],
        syncInterval: 15,
        enableAutoSync: true,
        syncProducts: true,
        syncInventory: true,
        defaultShippingProvider: 'SELF',
        autoFulfillment: false
      }
    case IntegrationSubType.WOOCOMMERCE:
      return {
        storeUrl: '',
        orderStatuses: ['processing'],
        paymentStatuses: ['completed'],
        syncInterval: 15,
        enableAutoSync: true,
        syncProducts: true,
        syncInventory: true,
        syncCategories: false,
        productType: 'simple',
        manageStock: true,
        backorders: false,
        defaultShippingMethod: 'flat_rate',
        requireShipping: true
      }
    default:
      return {}
  }
}

// 获取字段配置
const getFieldConfig = (type: string) => {
  return AUTH_CONFIGS[type]?.fields || []
}

// 获取字段说明
const getInstructions = (type: string) => {
  return AUTH_CONFIGS[type]?.instructions || ''
}

// 获取统计数据
const getStats = (info: any) => {
  return {
    orderCount: info?.orderCount || 0,
    productCount: info?.productCount || 0,
    revenue: info?.revenue || '$0',
    lastSyncTime: info?.lastSyncTime || null
  }
}

// 页面加载时初始化数据
onMounted(() => {
  initConnectionData()
})

// 初始化设置数据
const settings = ref({
  orders: {
    mode: 'pull',
    lastPull: null,
    nextStatus: null
  },
  products: {
    mode: 'pull',
    lastPull: null,
    nextStatus: null
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
  channelSettings: {} // 添加渠道特定设置
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
  background-color: #1a1a1a;

  .details-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .detail-card {
    background: #2d2d2d;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;
    border: 1px solid #3a3a3a;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2);
    }

    .card-header {
      padding: 16px 20px;
      border-bottom: 1px solid #3a3a3a;
      background: #252525;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .info-alert {
        margin-top: 12px;
        margin-bottom: 0;
        background-color: #2d2d2d;
        border-color: #3a3a3a;

        :deep(.el-alert__title) {
          color: #e0e0e0;
        }

        :deep(.el-alert__icon) {
          color: #e0e0e0;
        }
      }
    }

    .card-content {
      padding: 20px;
      background: #2d2d2d;
    }
  }

  .status-card {
    .status-tag {
      font-size: 14px;
      padding: 0 12px;
    }

    :deep(.el-descriptions) {
      .el-descriptions__cell {
        background-color: #2d2d2d !important;
        color: #e0e0e0;

        &.el-descriptions__label {
          background: #252525;
          color: #e0e0e0;
        }
      }
    }
  }

  .info-card {
    .connection-form {
      max-width: 800px;

      .field-input {
        width: 100%;

        &:deep(.el-input__wrapper) {
          background-color: #252525;
          border: 1px solid #3a3a3a;
          box-shadow: none;
          transition: all 0.3s ease;

          &:hover {
            border-color: #4c4c4c;
          }

          &.is-focus {
            border-color: #6b46c1;
            box-shadow: 0 0 0 1px #6b46c1 inset;
          }
        }

        &:deep(.el-input__inner) {
          color: #e0e0e0;
          background-color: transparent;

          &::placeholder {
            color: #666666;
          }
        }
      }

      :deep(.el-form-item__label) {
        font-weight: 500;
        color: #e0e0e0;
      }

      :deep(.el-select) {
        .el-input__wrapper {
          background-color: #252525;

          &.is-focus {
            border-color: #6b46c1;
            box-shadow: 0 0 0 1px #6b46c1 inset;
          }
        }

        .el-select__popper {
          background-color: #2d2d2d;
          border: 1px solid #3a3a3a;

          .el-select-dropdown__item {
            color: #e0e0e0;

            &.hover, &:hover {
              background-color: #353535;
            }

            &.selected {
              background-color: #6b46c1;
              color: #ffffff;
            }
          }
        }
      }
    }
  }

  .stats-card {
    .stat-item {
      padding: 20px;
      background: #252525;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #3a3a3a;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        background: #2a2a2a;
      }

      .stat-label {
        color: #999999;
        font-size: 14px;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .stat-value {
        color: #ffffff;
        font-size: 24px;
        font-weight: 600;
      }
    }
  }

  .action-card {
    background: #252525;

    .action-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;

      :deep(.el-button) {
        &.el-button--primary {
          --el-button-bg-color: #6b46c1;
          --el-button-border-color: #6b46c1;
          --el-button-hover-bg-color: #805ad5;
          --el-button-hover-border-color: #805ad5;
          --el-button-active-bg-color: #553c9a;
          --el-button-active-border-color: #553c9a;
        }

        &.el-button--success {
          --el-button-bg-color: #805ad5;
          --el-button-border-color: #805ad5;
          --el-button-hover-bg-color: #9f7aea;
          --el-button-hover-border-color: #9f7aea;
          --el-button-active-bg-color: #6b46c1;
          --el-button-active-border-color: #6b46c1;
        }
      }
    }
  }

  :deep(.el-descriptions) {
    padding: 0;

    .el-descriptions__header {
      margin-bottom: 0;
    }

    .el-descriptions__body {
      .el-descriptions__table {
        border-radius: 4px;
        border-color: #3a3a3a;
        background-color: #2d2d2d;
      }

      .el-descriptions__cell {
        padding: 12px 16px;
        color: #e0e0e0;

        &.el-descriptions__label {
          background: #252525;
          border-right-color: #3a3a3a;
          border-bottom-color: #3a3a3a;
          font-weight: 500;
          color: #e0e0e0;
        }

        &.el-descriptions__content {
          border-bottom-color: #3a3a3a;
          background-color: #2d2d2d;
        }
      }
    }
  }

  :deep(.el-tabs__item) {
    color: #999999;

    &.is-active {
      color: #ffffff;
    }

    &:hover {
      color: #e0e0e0;
    }
  }

  :deep(.el-tabs__active-bar) {
    background-color: #6b46c1;
  }

  :deep(.el-tabs__nav-wrap::after) {
    background-color: #3a3a3a;
  }
}

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
      max-width: 600px;

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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 16px;

  .info-item {
    label {
      display: block;
      font-size: 13px;
      color: var(--el-text-color-secondary);
      margin-bottom: 8px;
    }

    .status-value {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 13px;
      
      &.connected {
        background-color: var(--el-color-success-light-9);
        color: var(--el-color-success);
      }
      
      &.disconnected {
        background-color: var(--el-color-danger-light-9);
        color: var(--el-color-danger);
      }
    }
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-light);
}

.type-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
}

.instructions {
  margin-bottom: 24px;
}

.section {
  margin-bottom: 24px;

  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
  }
}

.status-info {
  margin-bottom: 20px;
}

.connection-form {
  max-width: 600px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  margin-top: 24px;
}
</style> 