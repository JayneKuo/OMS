<template>
  <div class="amazon-settings">
    <div class="setting-group">
      <h4>Orders</h4>
      
      <div class="setting-item">
        <div class="label">Marketplace</div>
        <el-select v-model="modelValue.marketplace" class="full-width-input">
          <el-option label="United States" value="ATVPDKIKX0DER" />
          <el-option label="Canada" value="A2EUQ1WTGCTBG2" />
          <el-option label="Mexico" value="A1AM78C64UM0Y8" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="label">Order Status</div>
        <el-select v-model="modelValue.orderStatuses" multiple class="full-width-input">
          <el-option label="Unshipped" value="Unshipped" />
          <el-option label="Partially Shipped" value="PartiallyShipped" />
          <el-option label="Shipped" value="Shipped" />
          <el-option label="Canceled" value="Canceled" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="label">Fulfillment Channel</div>
        <el-select v-model="modelValue.fulfillmentChannel" multiple class="full-width-input">
          <el-option label="Amazon (FBA)" value="AFN" />
          <el-option label="Merchant (FBM)" value="MFN" />
        </el-select>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.pullPrimeOrders">
          Pull Prime Orders
        </el-checkbox>
      </div>
    </div>

    <div class="setting-group">
      <h4>Inventory</h4>

      <div class="setting-item">
        <div class="label">Inventory Update Mode</div>
        <el-select v-model="modelValue.inventoryMode" class="full-width-input">
          <el-option label="Sync with FBA" value="fba" />
          <el-option label="Sync with FBM" value="fbm" />
          <el-option label="Both" value="both" />
        </el-select>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.enableAutoFulfillment">
          Enable Auto-Fulfillment for FBA Orders
        </el-checkbox>
      </div>

      <div class="setting-item">
        <el-checkbox v-model="modelValue.enableInventorySync">
          Enable Real-time Inventory Sync
        </el-checkbox>
      </div>
    </div>

    <div class="setting-group">
      <h4>Reports</h4>

      <div class="setting-item">
        <div class="label">Report Types</div>
        <el-checkbox-group v-model="modelValue.reportTypes">
          <el-checkbox label="inventory">Inventory Reports</el-checkbox>
          <el-checkbox label="orders">Order Reports</el-checkbox>
          <el-checkbox label="returns">Return Reports</el-checkbox>
          <el-checkbox label="settlement">Settlement Reports</el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="setting-item">
        <div class="label">Report Schedule</div>
        <el-select v-model="modelValue.reportSchedule" class="full-width-input">
          <el-option label="Every 15 minutes" value="15min" />
          <el-option label="Every 30 minutes" value="30min" />
          <el-option label="Every hour" value="1hour" />
          <el-option label="Every 4 hours" value="4hours" />
          <el-option label="Daily" value="daily" />
        </el-select>
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
.amazon-settings {
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

      .el-checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }
  }
}
</style> 