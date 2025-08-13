<template>
  <div class="walmart-settings">
    <div class="setting-group">
      <h4>Orders</h4>
      
      <div class="setting-item">
        <div class="label">Channel Type</div>
        <el-select v-model="modelValue.channelType" class="full-width-input">
          <el-option label="Marketplace" value="marketplace" />
          <el-option label="Drop Ship Vendor" value="dsv" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="label">Order Status</div>
        <el-select v-model="modelValue.orderStatuses" multiple class="full-width-input">
          <el-option label="Created" value="Created" />
          <el-option label="Acknowledged" value="Acknowledged" />
          <el-option label="Shipped" value="Shipped" />
          <el-option label="Cancelled" value="Cancelled" />
        </el-select>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.pullCancelledOrders">
          Pull Cancelled Orders
        </el-checkbox>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.enableAutoAcknowledgement">
          Enable Auto-Acknowledgement
        </el-checkbox>
      </div>
    </div>

    <div class="setting-group">
      <h4>Inventory</h4>

      <div class="setting-item">
        <div class="label">Inventory Update Mode</div>
        <el-select v-model="modelValue.inventoryMode" class="full-width-input">
          <el-option label="Real-time" value="realtime" />
          <el-option label="Scheduled" value="scheduled" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="label">Lag Time (minutes)</div>
        <el-input-number 
          v-model="modelValue.lagTime" 
          :min="0" 
          :max="1440"
          class="full-width-input"
        />
        <div class="hint">
          Time to add to the estimated ship date when sending to Walmart
        </div>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.enableInventorySync">
          Enable Real-time Inventory Sync
        </el-checkbox>
      </div>
    </div>

    <div class="setting-group">
      <h4>Shipping</h4>

      <div class="setting-item">
        <div class="label">Default Shipping Method</div>
        <el-select v-model="modelValue.defaultShippingMethod" class="full-width-input">
          <el-option label="Standard" value="Standard" />
          <el-option label="Express" value="Express" />
          <el-option label="One Day" value="OneDay" />
          <el-option label="Freight" value="Freight" />
        </el-select>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.enableShipmentUpdates">
          Enable Shipment Status Updates
        </el-checkbox>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.requireTrackingNumbers">
          Require Tracking Numbers
        </el-checkbox>
      </div>
    </div>

    <div class="setting-group">
      <h4>Returns</h4>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.enableReturns">
          Enable Returns Processing
        </el-checkbox>
      </div>

      <div class="setting-item">
        <div class="label">Return Window (days)</div>
        <el-input-number 
          v-model="modelValue.returnWindow" 
          :min="1" 
          :max="90"
          class="full-width-input"
        />
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
.walmart-settings {
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
        margin-top: 4px;
      }

      .full-width-input {
        width: 100%;
      }
    }
  }
}
</style> 