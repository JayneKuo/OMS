<template>
  <div class="channel-settings">
    <!-- Connection Flow Section -->
    <div class="settings-section">
      <div class="section-header">
        <h3>Connection Flow</h3>
      </div>
      
      <div class="section-content">
        <!-- Orders -->
        <div class="flow-item">
          <div class="flow-title">Orders</div>
          <div class="flow-content">
            <div class="flow-description">Process orders information</div>
            <div class="flow-status" v-if="modelValue.connectionFlow.orders.mode !== 'disabled'">
              Last Pull: {{ modelValue.connectionFlow.orders.lastPull }}
              <span class="status">Next: {{ modelValue.connectionFlow.orders.nextStatus }}</span>
            </div>
            <el-radio-group v-model="modelValue.connectionFlow.orders.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull orders from {{ channelName }}</el-radio>
              <el-radio label="push">Push orders to {{ channelName }}</el-radio>
              <el-radio label="both">Push and pull orders</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- Products -->
        <div class="flow-item">
          <div class="flow-title">Products</div>
          <div class="flow-content">
            <div class="flow-description">Process product catalog updates</div>
            <div class="flow-status" v-if="modelValue.connectionFlow.products.mode !== 'disabled'">
              Last Pull: {{ modelValue.connectionFlow.products.lastPull }}
              <span class="status">Next: {{ modelValue.connectionFlow.products.nextStatus }}</span>
            </div>
            <el-radio-group v-model="modelValue.connectionFlow.products.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull products from {{ channelName }}</el-radio>
              <el-radio label="push">Push products to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- Inventory -->
        <div class="flow-item">
          <div class="flow-title">Inventory</div>
          <div class="flow-content">
            <div class="flow-description">Process inventory updates</div>
            <el-radio-group v-model="modelValue.connectionFlow.inventory.mode" class="flow-options">
              <el-radio label="disabled">Disabled</el-radio>
              <el-radio label="pull">Pull inventory from {{ channelName }}</el-radio>
              <el-radio label="push">Push inventory to {{ channelName }}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>

    <!-- Channel Specific Settings -->
    <div class="settings-section" v-if="channelName === 'Shopify'">
      <div class="section-header">
        <h3>Shopify Settings</h3>
      </div>
      
      <div class="section-content">
        <!-- Orders Settings -->
        <div class="setting-group">
          <div class="group-header">
            <h4>Orders</h4>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">Exclude orders created before</div>
            <div class="setting-content">
              <el-date-picker
                v-model="modelValue.orders.excludeBeforeDate"
                type="datetime"
                format="MM/DD/YYYY hh:mm A"
                placeholder="07/17/2025 10:07 AM"
                class="date-input"
              />
              <div class="setting-hint">
                When the exclude orders created before date is not set, the default value is when the integration was created.
                This integration was created on {{ modelValue.orders.createdAt }} (UTC).
              </div>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">Process only orders with following financial statuses</div>
            <div class="setting-content">
              <div class="status-tags">
                <el-tag
                  v-for="status in ['paid', 'partially_refunded', 'refunded', 'return']"
                  :key="status"
                  :class="{ active: modelValue.orders.paymentStatuses.includes(status) }"
                  @click="togglePaymentStatus(status)"
                >
                  {{ status }}
                </el-tag>
              </div>
              <div class="setting-hint">
                Select the order payment statuses you want to allow OMS to ingest.
                If blank, only paid, refunded, partially_refunded orders are pulled.
              </div>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-content no-label">
              <el-checkbox v-model="modelValue.orders.pullAllocatedOnly">
                Pull only orders allocated to warehouses tied with fulfillment locations in OMS
              </el-checkbox>

              <el-checkbox v-model="modelValue.orders.pullAmazonBuyPrime">
                Always pull Amazon Buy with Prime orders
                <div class="setting-hint">
                  When ON, orders with Buy with Prime line items will be pulled without warehouse allocation check.
                </div>
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: {
    connectionFlow: {
      orders: {
        mode: string
        lastPull: string
        nextStatus: string
      }
      products: {
        mode: string
        lastPull: string
        nextStatus: string
      }
      inventory: {
        mode: string
      }
    }
    orders: {
      excludeBeforeDate: string
      createdAt: string
      paymentStatuses: string[]
      pullAllocatedOnly: boolean
      pullAmazonBuyPrime: boolean
    }
  }
  channelName: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const togglePaymentStatus = (status: string) => {
  const statuses = [...props.modelValue.orders.paymentStatuses]
  const index = statuses.indexOf(status)
  if (index === -1) {
    statuses.push(status)
  } else {
    statuses.splice(index, 1)
  }
  emit('update:modelValue', {
    ...props.modelValue,
    orders: {
      ...props.modelValue.orders,
      paymentStatuses: statuses
    }
  })
}
</script>

<style lang="scss" scoped>
.channel-settings {
  .settings-section {
    margin-bottom: 40px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--el-border-color-light);

      h3 {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin: 0;
      }
    }

    .section-content {
      .flow-item {
        display: flex;
        margin-bottom: 32px;

        &:last-child {
          margin-bottom: 0;
        }

        .flow-title {
          width: 160px;
          padding-top: 4px;
          font-size: 13px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          flex-shrink: 0;
        }

        .flow-content {
          flex: 1;
          min-width: 0;

          .flow-description {
            font-size: 13px;
            color: var(--el-text-color-regular);
            margin-bottom: 8px;
          }

          .flow-status {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-bottom: 12px;

            .status {
              color: var(--el-color-success);
            }
          }

          .flow-options {
            display: flex;
            flex-direction: column;

            .el-radio {
              margin: 0 0 8px 0;
              padding: 0;
              height: 32px;
              line-height: 32px;

              &:last-child {
                margin-bottom: 0;
              }

              :deep(.el-radio__input) {
                margin-top: 9px;
              }

              :deep(.el-radio__label) {
                font-size: 13px;
                color: var(--el-text-color-primary);
              }
            }
          }
        }
      }

      .setting-group {
        .group-header {
          margin-bottom: 20px;

          h4 {
            font-size: 13px;
            font-weight: 500;
            color: var(--el-text-color-primary);
            margin: 0;
          }
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
  }
}
</style> 