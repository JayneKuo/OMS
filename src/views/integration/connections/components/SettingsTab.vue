<template>
  <div class="settings-tab">
    <div class="section">
      <h3>Connection Flow</h3>
      
      <!-- Orders -->
      <div class="flow-item">
        <h4>Orders</h4>
        <div class="process-info">Process orders information</div>
        <el-radio-group v-model="modelValue.orders.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull orders from {{ channelName }}</el-radio>
          <el-radio label="push">Push orders to {{ channelName }}</el-radio>
          <el-radio label="both">Push and pull orders</el-radio>
        </el-radio-group>
        <div class="status-info" v-if="modelValue.orders.lastPull">
          Last Pull: {{ modelValue.orders.lastPull }}, Next: {{ modelValue.orders.nextStatus }}
        </div>
      </div>

      <!-- Products -->
      <div class="flow-item">
        <h4>Products</h4>
        <div class="process-info">Process product catalog updates</div>
        <el-radio-group v-model="modelValue.products.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull products from {{ channelName }} to OMS</el-radio>
          <el-radio label="push">Push products from OMS to {{ channelName }}</el-radio>
        </el-radio-group>
        <div class="status-info" v-if="modelValue.products.lastPull">
          Last Pull: {{ modelValue.products.lastPull }}, Next: {{ modelValue.products.nextStatus }}
        </div>
      </div>

      <!-- Inventory -->
      <div class="flow-item">
        <h4>Inventory</h4>
        <div class="process-info">Process inventory updates</div>
        <el-radio-group v-model="modelValue.inventory.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull inventory information from {{ channelName }} to OMS</el-radio>
          <el-radio label="push">Push inventory information from OMS to {{ channelName }}</el-radio>
        </el-radio-group>
      </div>

      <!-- Fulfillments -->
      <div class="flow-item">
        <h4>Fulfillments</h4>
        <div class="process-info">Process fulfillment information</div>
        <el-radio-group v-model="modelValue.fulfillments.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull fulfillments from {{ channelName }}</el-radio>
          <el-radio label="push">Push fulfillments to {{ channelName }}</el-radio>
          <el-radio label="both">Push and pull fulfillments</el-radio>
        </el-radio-group>
      </div>

      <!-- Returns -->
      <div class="flow-item">
        <h4>Returns</h4>
        <div class="process-info">Process returns</div>
        <el-radio-group v-model="modelValue.returns.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull return requests from {{ channelName }} to OMS</el-radio>
          <el-radio label="push">Push return requests from OMS to {{ channelName }}</el-radio>
        </el-radio-group>
      </div>

      <!-- Refunds -->
      <div class="flow-item">
        <h4>Refunds</h4>
        <div class="process-info">Process refunds</div>
        <el-radio-group v-model="modelValue.refunds.mode" class="flow-options">
          <el-radio label="disabled">Disabled</el-radio>
          <el-radio label="pull">Pull refunds from {{ channelName }} to OMS</el-radio>
          <el-radio label="push">Push refunds from OMS to {{ channelName }}</el-radio>
        </el-radio-group>
      </div>

      <!-- Statements -->
      <div class="flow-item" v-if="hasStatements">
        <h4>Statements</h4>
        <el-checkbox v-model="modelValue.statements.enabled">Pull statements from {{ channelName }}</el-checkbox>
      </div>

      <!-- Locations -->
      <div class="flow-item" v-if="hasLocations">
        <h4>Locations</h4>
        <el-checkbox v-model="modelValue.locations.enabled">Pull locations from {{ channelName }}</el-checkbox>
      </div>
    </div>

    <!-- Channel Specific Settings -->
    <div class="section" v-if="channelType">
      <h3>{{ channelName }} Settings</h3>
      <!-- 根据渠道类型显示对应的设置组件 -->
      <component 
        :is="channelSettingsComponent"
        v-if="channelSettingsComponent"
        v-model="modelValue.channelSettings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { IntegrationSubType } from '@/constants/integration'
import ShopifySettings from './ShopifySettings.vue'
import AmazonSettings from './AmazonSettings.vue'
import WalmartSettings from './WalmartSettings.vue'
import TiktokSettings from './TiktokSettings.vue'
import WooCommerceSettings from './WooCommerceSettings.vue'
import { onMounted } from 'vue'

const props = defineProps<{
  modelValue: any,
  channelType?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

// 根据渠道类型返回对应的设置组件
const channelSettingsComponent = computed(() => {
  console.log('Current channel type:', props.channelType) // 添加日志
  switch (props.channelType) {
    case IntegrationSubType.SHOPIFY:
      return ShopifySettings
    case IntegrationSubType.AMAZON:
      return AmazonSettings
    case IntegrationSubType.WALMART:
      return WalmartSettings
    case IntegrationSubType.TIKTOK:
      return TiktokSettings
    case IntegrationSubType.WOOCOMMERCE:
      return WooCommerceSettings
    default:
      return null
  }
})

// 获取渠道名称
const channelName = computed(() => {
  switch (props.channelType) {
    case IntegrationSubType.SHOPIFY:
      return 'Shopify'
    case IntegrationSubType.AMAZON:
      return 'Amazon'
    case IntegrationSubType.WALMART:
      return 'Walmart'
    case IntegrationSubType.TIKTOK:
      return 'TikTok'
    case IntegrationSubType.WOOCOMMERCE:
      return 'WooCommerce'
    case IntegrationSubType.UNIS_WMS:
      return 'UNIS WMS'
    case IntegrationSubType.ITEM_WMS:
      return 'Item WMS'
    default:
      return 'Channel'
  }
})

// 初始化渠道设置
const initChannelSettings = () => {
  if (!props.modelValue.channelSettings) {
    props.modelValue.channelSettings = {}
  }
}

// 在组件挂载时初始化
onMounted(() => {
  initChannelSettings()
})

// 判断是否显示 Statements 和 Locations
const hasStatements = computed(() => {
  return [
    IntegrationSubType.SHOPIFY,
    IntegrationSubType.AMAZON,
    IntegrationSubType.WALMART
  ].includes(props.channelType as IntegrationSubType)
})

const hasLocations = computed(() => {
  return [
    IntegrationSubType.SHOPIFY,
    IntegrationSubType.WALMART,
    IntegrationSubType.UNIS_WMS,
    IntegrationSubType.ITEM_WMS
  ].includes(props.channelType as IntegrationSubType)
})

const orderStatusOptions = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]

const toggleStatus = (field: string, value: string) => {
  const current = [...props.modelValue.shopifySettings[field]]
  const index = current.indexOf(value)
  if (index === -1) {
    current.push(value)
  } else {
    current.splice(index, 1)
  }
  emit('update:modelValue', {
    ...props.modelValue,
    shopifySettings: {
      ...props.modelValue.shopifySettings,
      [field]: current
    }
  })
}

const defaultColumns = [
  'sku',
  'location',
  'available',
  'committed',
  'onHand',
  'inbound',
  'lastEvent',
  'updated',
  'adjustedBy'
]
</script>

<style lang="scss" scoped>
.settings-tab {
  padding: 0 20px;

  .section {
    margin-bottom: 40px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 24px;
      color: var(--el-text-color-primary);
    }
  }

  .flow-item {
    margin-bottom: 24px;
    border-bottom: 1px solid var(--el-border-color-light);
    padding-bottom: 24px;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    h4 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 12px;
      color: var(--el-text-color-primary);
    }

    .process-info {
      font-size: 14px;
      color: var(--el-text-color-regular);
      margin-bottom: 12px;
    }

    .flow-options {
      .el-radio-group {
        width: 100%;
        
        :deep(.el-radio) {
          margin: 0;
          height: auto;
          padding: 4px 0;
          width: 100%;
          
          .el-radio__input {
            float: left;
            margin-top: 3px;
          }
          
          .el-radio__label {
            display: block;
            white-space: normal;
            line-height: 1.4;
            margin-left: 25px;
            padding-left: 0;
          }
        }
      }
    }

    .status-info {
      margin-top: 8px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
      padding-left: 24px;
    }

    .el-checkbox {
      margin: 4px 0;
      
      .el-checkbox__label {
        line-height: 1.4;
      }
    }
  }

  .setting-group {
    margin-bottom: 32px;
    padding: 20px;
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;

    h4 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 16px;
      color: var(--el-text-color-primary);
    }

    .setting-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        font-size: 14px;
        color: var(--el-text-color-regular);
        margin-bottom: 8px;
      }

      .hint {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin-top: 8px;
        line-height: 1.4;
      }

      .status-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;

        .el-tag {
          cursor: pointer;
          
          &.active {
            background-color: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);
            color: var(--el-color-primary);
          }
        }
      }

      .el-input,
      .el-select,
      .el-date-picker {
        width: 100%;
      }

      .el-checkbox {
        display: block;
        margin: 0;
        height: auto;
        white-space: normal;

        .el-checkbox__label {
          white-space: normal;
          line-height: 1.4;
        }

        .hint {
          margin-left: 24px;
        }
      }
    }
  }
}

.expanded-table {
  padding: 16px;
  background-color: var(--el-table-row-hover-bg-color);
}

:deep(.el-table__row) {
  cursor: pointer;
  
  &.expandable-row {
    background-color: var(--el-bg-color);
    
    &:hover {
      background-color: var(--el-table-row-hover-bg-color);
    }
  }
}
</style> 