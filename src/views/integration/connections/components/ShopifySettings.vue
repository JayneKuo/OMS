<template>
  <div class="shopify-settings">
    <h3>Shopify Settings</h3>
    
    <div class="settings-group">
      <h4>Orders</h4>
      
      <!-- Exclude orders created before -->
      <div class="setting-item">
        <div class="setting-label">Exclude orders created before</div>
        <div class="setting-content">
          <el-date-picker
            v-model="settings.orders.excludeBeforeDate"
            type="datetime"
            format="MM/DD/YYYY hh:mm A"
            placeholder="07/17/2025 10:07 AM"
            class="date-input"
          />
          <div class="setting-hint">
            When the exclude orders created before date is not set, the default value is when the integration was created. This integration was created on {{ settings.orders.createdAt }} (UTC).
          </div>
        </div>
      </div>

      <!-- Regular orders -->
      <div class="setting-item">
        <div class="setting-label">Process only regular Shopify orders (POS/Shopify orders, or both types of orders from Shopify)</div>
        <div class="setting-content">
          <el-input
            v-model="settings.orders.regularOrders"
            placeholder="regular"
            class="full-width-input"
          />
        </div>
      </div>

      <!-- Process only orders assigned to specific channels in Shopify -->
      <div class="setting-item">
        <div class="setting-label">Process only orders assigned to specific channels in Shopify</div>
        <div class="setting-content">
          <el-input
            type="textarea"
            v-model="settings.orders.channelPattern"
            :rows="3"
            class="full-width-input"
          />
        </div>
      </div>

      <!-- Payment Statuses -->
      <div class="setting-item">
        <div class="setting-label">Process only orders with following financial statuses</div>
        <div class="setting-content">
          <div class="status-tags">
            <el-tag
              v-for="status in ['paid', 'partially_refunded', 'refunded', 'return']"
              :key="status"
              :class="{ active: settings.orders.paymentStatuses.includes(status) }"
              @click="togglePaymentStatus(status)"
            >
              {{ status }}
            </el-tag>
          </div>
          <div class="setting-hint">
            Select the order payment statuses you want to allow OMS to ingest. If blank, only paid, refunded, partially_refunded orders are pulled.
          </div>
        </div>
      </div>

      <!-- Fulfillment Statuses -->
      <div class="setting-item">
        <div class="setting-label">Process only orders with following fulfillment statuses</div>
        <div class="setting-content">
          <el-select
            v-model="settings.orders.fulfillmentStatuses"
            multiple
            placeholder="Select fulfillment statuses"
            class="full-width-input"
          >
            <el-option label="Unfulfilled" value="unfulfilled" />
            <el-option label="Fulfilled" value="fulfilled" />
            <el-option label="Partially Fulfilled" value="partially_fulfilled" />
          </el-select>
          <div class="setting-hint">
            Select the order fulfillment statuses you want to allow OMS to ingest. If blank, orders of any fulfillment status are pulled.
          </div>
        </div>
      </div>

      <!-- Order Tags -->
      <div class="setting-item">
        <div class="setting-label">Process only orders assigned following tags</div>
        <div class="setting-content">
          <el-input
            v-model="settings.orders.orderTags"
            placeholder="wholesale_order"
            class="full-width-input"
          />
          <div class="setting-hint">
            Only orders with these tags are pulled. If left blank, all orders are pulled.
          </div>
        </div>
      </div>

      <!-- SKU Pattern -->
      <div class="setting-item">
        <div class="setting-label">Process only line items with matched SKUs</div>
        <div class="setting-content">
          <el-input
            v-model="settings.orders.skuPattern"
            placeholder="/.+USED$/"
            class="full-width-input"
          />
          <div class="setting-hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
          </div>
        </div>
      </div>

      <!-- Line Item Pattern -->
      <div class="setting-item">
        <div class="setting-label">Process only line items with matched SKUs (legacy)</div>
        <div class="setting-content">
          <el-input
            v-model="settings.orders.lineItemPattern"
            placeholder="/.+USED$/"
            class="full-width-input"
          />
          <div class="setting-hint">
            Pure string value denotes precise match (case-insensitive), string value wrapped in // denotes regexp pattern.
          </div>
        </div>
      </div>

      <!-- Additional Settings -->
      <div class="setting-item">
        <div class="setting-content no-label">
          <el-checkbox v-model="settings.orders.pullAllocatedOnly">
            Pull only orders allocated to warehouses tied with fulfillment locations in OMS
          </el-checkbox>

          <el-checkbox v-model="settings.orders.pullAmazonBuyPrime">
            Always pull Amazon Buy with Prime orders
            <div class="setting-hint">
              When ON, orders with Buy with Prime line items will be pulled without warehouse allocation check.
            </div>
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const settings = ref({
  orders: {
    excludeBeforeDate: '07/17/2025 10:07 AM',
    createdAt: '07/17/2025 10:07 AM',
    regularOrders: '',
    channelPattern: '',
    paymentStatuses: ['paid', 'refunded', 'partially_refunded'],
    fulfillmentStatuses: [],
    orderTags: 'wholesale_order',
    skuPattern: '/.+USED$/',
    lineItemPattern: '/.+USED$/',
    pullAllocatedOnly: true,
    pullAmazonBuyPrime: true
  }
})

const togglePaymentStatus = (status: string) => {
  const index = settings.value.orders.paymentStatuses.indexOf(status)
  if (index === -1) {
    settings.value.orders.paymentStatuses.push(status)
  } else {
    settings.value.orders.paymentStatuses.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
.shopify-settings {
  h3 {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 24px;
    color: var(--el-text-color-primary);
  }

  .settings-group {
    h4 {
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 20px;
      color: var(--el-text-color-primary);
    }

    .setting-item {
      display: flex;
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .setting-label {
        width: 240px;
        padding-top: 8px;
        font-size: 13px;
        color: var(--el-text-color-regular);
        line-height: 1.5;
        flex-shrink: 0;
      }

      .setting-content {
        flex: 1;
        min-width: 0;

        &.no-label {
          margin-left: 240px;
        }

        .date-input {
          width: 240px;
        }

        .full-width-input {
          width: 100%;
        }

        :deep(.el-input__wrapper),
        :deep(.el-textarea__inner) {
          box-shadow: 0 0 0 1px var(--el-border-color) inset;
          padding: 0 12px;

          &:hover {
            box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
          }

          &.is-focus {
            box-shadow: 0 0 0 1px var(--el-color-primary) inset;
          }
        }

        :deep(.el-input__inner) {
          height: 32px;
          font-size: 13px;
        }

        :deep(.el-textarea__inner) {
          padding: 8px 12px;
          font-size: 13px;
        }

        .setting-hint {
          margin-top: 8px;
          font-size: 12px;
          color: var(--el-text-color-secondary);
          line-height: 1.5;
        }

        .status-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .el-tag {
            cursor: pointer;
            background: var(--el-fill-color-light);
            border-color: transparent;
            color: var(--el-text-color-regular);
            font-size: 12px;
            height: 24px;
            padding: 0 8px;
            border-radius: 4px;

            &.active {
              background: var(--el-color-primary-light-9);
              border-color: var(--el-color-primary-light-7);
              color: var(--el-color-primary);
            }

            &:hover {
              border-color: var(--el-border-color);
            }
          }
        }

        .el-checkbox {
          display: block;
          margin: 0 0 12px 0;
          padding: 0;
          height: auto;

          &:last-child {
            margin-bottom: 0;
          }

          :deep(.el-checkbox__input) {
            margin-top: 2px;
          }

          :deep(.el-checkbox__label) {
            font-size: 13px;
            color: var(--el-text-color-primary);
            line-height: 1.5;
            white-space: normal;
          }

          .setting-hint {
            margin: 4px 0 8px 24px;
          }
        }
      }
    }
  }
}
</style> 