<template>
  <div class="tiktok-settings">
    <div class="setting-group">
      <h4>Shop Configuration</h4>
      
      <div class="setting-item">
        <div class="label">Shop Region</div>
        <el-select v-model="modelValue.shopRegion" class="full-width-input">
          <el-option label="United States" value="US" />
          <el-option label="United Kingdom" value="UK" />
          <el-option label="Southeast Asia" value="SEA" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="label">Order Status</div>
        <el-select v-model="modelValue.orderStatuses" multiple class="full-width-input">
          <el-option label="UNPAID" value="UNPAID" />
          <el-option label="AWAITING_SHIPMENT" value="AWAITING_SHIPMENT" />
          <el-option label="SHIPPED" value="SHIPPED" />
          <el-option label="CANCELLED" value="CANCELLED" />
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
    </div>

    <div class="setting-group">
      <h4>Fulfillment</h4>

      <div class="setting-item">
        <div class="label">Default Shipping Provider</div>
        <el-select v-model="modelValue.defaultShippingProvider" class="full-width-input">
          <el-option label="TikTok Shipping" value="TIKTOK" />
          <el-option label="Self Shipping" value="SELF" />
        </el-select>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.autoFulfillment">
          Enable Auto-Fulfillment
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
.tiktok-settings {
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