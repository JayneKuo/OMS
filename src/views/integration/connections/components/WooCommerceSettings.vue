<template>
  <div class="woocommerce-settings">
    <div class="setting-group">
      <h4>Store Configuration</h4>
      
      <div class="setting-item">
        <div class="label">Store URL</div>
        <el-input 
          v-model="modelValue.storeUrl" 
          placeholder="https://your-store.com"
          class="full-width-input"
        />
      </div>

      <div class="setting-item">
        <div class="label">Order Status</div>
        <el-select v-model="modelValue.orderStatuses" multiple class="full-width-input">
          <el-option label="Pending" value="pending" />
          <el-option label="Processing" value="processing" />
          <el-option label="On Hold" value="on-hold" />
          <el-option label="Completed" value="completed" />
          <el-option label="Cancelled" value="cancelled" />
          <el-option label="Refunded" value="refunded" />
          <el-option label="Failed" value="failed" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="label">Payment Status</div>
        <el-select v-model="modelValue.paymentStatuses" multiple class="full-width-input">
          <el-option label="Pending" value="pending" />
          <el-option label="Processing" value="processing" />
          <el-option label="Completed" value="completed" />
          <el-option label="Refunded" value="refunded" />
          <el-option label="Failed" value="failed" />
        </el-select>
      </div>
    </div>

    <div class="setting-group">
      <h4>Sync Settings</h4>

      <div class="setting-item">
        <div class="label">Sync Interval (minutes)</div>
        <el-input-number 
          v-model="modelValue.syncInterval" 
          :min="5" 
          :max="60"
          class="full-width-input"
        />
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.enableAutoSync">
          Enable Automatic Sync
        </el-checkbox>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.syncProducts">
          Sync Products
        </el-checkbox>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.syncInventory">
          Sync Inventory
        </el-checkbox>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.syncCategories">
          Sync Categories
        </el-checkbox>
      </div>
    </div>

    <div class="setting-group">
      <h4>Product Settings</h4>

      <div class="setting-item">
        <div class="label">Product Type</div>
        <el-select v-model="modelValue.productType" class="full-width-input">
          <el-option label="Simple" value="simple" />
          <el-option label="Variable" value="variable" />
          <el-option label="Grouped" value="grouped" />
          <el-option label="External" value="external" />
        </el-select>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.manageStock">
          Manage Stock
        </el-checkbox>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.backorders">
          Allow Backorders
        </el-checkbox>
      </div>
    </div>

    <div class="setting-group">
      <h4>Shipping</h4>

      <div class="setting-item">
        <div class="label">Default Shipping Method</div>
        <el-select v-model="modelValue.defaultShippingMethod" class="full-width-input">
          <el-option label="Flat Rate" value="flat_rate" />
          <el-option label="Free Shipping" value="free_shipping" />
          <el-option label="Local Pickup" value="local_pickup" />
        </el-select>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.requireShipping">
          Require Shipping Address
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  modelValue: any
}>()
</script>

<style lang="scss" scoped>
.woocommerce-settings {
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

      .full-width-input {
        width: 100%;
      }
    }
  }
}
</style> 