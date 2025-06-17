<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { OrderUpdateControlConfig } from '@/types/orderUpdateControl'
import { ORDER_SOURCES, ORDER_STATUSES, DISPATCH_ORDER_STATUSES } from '@/types/orderUpdateControl'

const config = ref<OrderUpdateControlConfig>({
  orderUpdateEnabled: false,
  allowedUpdateSource: ['all'],
  allowedUpdateStatuses: ['import', 'pending', 'warehouseprocessing'],
  dispatchOrder: 'allocate',
  exceptionUpdatable: false,
  dispatchForNewLineItems: false,
  allowIncreaseQuantityForDispatchedItems: false,
  dispatchForReplacementItems: true
})

const showAdvancedSettings = computed(() => config.value.orderUpdateEnabled)
const showDispatchOrderSelect = computed(() => 
  config.value.allowedUpdateStatuses.includes('warehouseprocessing')
)

const handleSave = async () => {
  try {
    // TODO: Call API to save configuration
    ElMessage.success('Settings saved successfully')
  } catch (error) {
    ElMessage.error('Failed to save settings')
  }
}
</script>

<template>
  <div class="order-update-control">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <h2>Order Update Settings</h2>
        </div>
      </template>

      <el-form label-width="280px" class="config-form">
        <!-- Main Switch -->
        <el-form-item label="Enable Order Updates">
          <el-switch
            v-model="config.orderUpdateEnabled"
            active-text="Allow Updates"
            inactive-text="Disable Updates"
          />
        </el-form-item>

        <!-- Advanced Settings -->
        <template v-if="showAdvancedSettings">
          <!-- Order Sources -->
          <el-form-item label="Allowed Order Sources">
            <el-select
              v-model="config.allowedUpdateSource"
              multiple
              placeholder="Select order sources"
              style="width: 100%"
            >
              <el-option
                v-for="source in ORDER_SOURCES"
                :key="source"
                :label="source"
                :value="source"
              />
            </el-select>
          </el-form-item>

          <!-- Order Statuses -->
          <el-form-item label="Allowed Order Statuses">
            <el-select
              v-model="config.allowedUpdateStatuses"
              multiple
              placeholder="Select order statuses"
              style="width: 100%"
            >
              <el-option
                v-for="status in ORDER_STATUSES"
                :key="status"
                :label="status"
                :value="status"
              />
            </el-select>
          </el-form-item>

          <!-- Dispatch Order Status -->
          <el-form-item 
            v-if="showDispatchOrderSelect"
            label="Dispatch Order Status for Warehouse Processing"
          >
            <el-select
              v-model="config.dispatchOrder"
              placeholder="Select dispatch order status"
              style="width: 100%"
            >
              <el-option
                v-for="status in DISPATCH_ORDER_STATUSES"
                :key="status"
                :label="status"
                :value="status"
              />
            </el-select>
          </el-form-item>

          <!-- Exception Order Updates -->
          <el-form-item label="Allow Exception Order Updates">
            <el-switch
              v-model="config.exceptionUpdatable"
              active-text="Allow"
              inactive-text="Disable"
            />
            <div class="form-item-tip">When enabled, orders in exception status can be updated</div>
          </el-form-item>

          <!-- New Line Items Dispatch -->
          <el-form-item label="New Line Items Dispatch Control">
            <el-switch
              v-model="config.dispatchForNewLineItems"
              active-text="Separate Dispatch"
              inactive-text="Batch Dispatch"
            />
            <div class="form-item-tip">
              When enabled, new line items will be dispatched separately. When disabled, updates require downstream approval before batch dispatch
            </div>
          </el-form-item>

          <!-- Quantity Increase Dispatch -->
          <el-form-item label="Quantity Increase Dispatch Control">
            <el-switch
              v-model="config.allowIncreaseQuantityForDispatchedItems"
              active-text="Separate Dispatch"
              inactive-text="Batch Dispatch"
            />
            <div class="form-item-tip">
              When enabled, quantity increases will be dispatched separately. When disabled, updates require downstream approval before batch dispatch
            </div>
          </el-form-item>

          <!-- Replacement Items Dispatch -->
          <el-form-item label="Replacement Items Dispatch Control">
            <el-switch
              v-model="config.dispatchForReplacementItems"
              active-text="Separate Dispatch"
              inactive-text="Batch Dispatch"
            />
            <div class="form-item-tip">Controls whether replacement items are dispatched separately</div>
          </el-form-item>
        </template>
      </el-form>

      <div class="form-actions">
        <el-button type="primary" @click="handleSave">Save Settings</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.order-update-control {
  padding: 20px;

  .config-card {
    max-width: 1000px;
    margin: 0 auto;

    .card-header {
      h2 {
        margin: 0;
        font-size: 18px;
        color: #303133;
      }
    }

    .config-form {
      margin-top: 20px;

      .form-item-tip {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
        margin-left: 4px;
      }
    }

    .form-actions {
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style> 