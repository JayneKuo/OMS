<template>
  <div class="shipping-requests-table">
    <el-table :data="data" style="width: 100%" size="large">
      <el-table-column prop="id" label="Shipping Request ID" min-width="200">
        <template #default="{ row }">
          <el-button type="primary" link>{{ row.id }}</el-button>
        </template>
      </el-table-column>
      
      <el-table-column prop="status" label="Status" min-width="150">
        <template #default="{ row }">
          <el-tag type="warning" effect="light" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="orderId" label="Order ID" min-width="150">
        <template #default="{ row }">
          <el-button type="primary" link>{{ row.orderId }}</el-button>
        </template>
      </el-table-column>
      
      <el-table-column prop="location" label="Location" min-width="200" />
      
      <el-table-column prop="updated" label="Updated" min-width="150" />
      
      <el-table-column fixed="right" label="Actions" width="200">
        <template #default>
          <el-button type="primary" size="small">Review</el-button>
          <el-button type="info" link>Details</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
interface ShippingRequest {
  id: string
  status: string
  orderId: string
  location: string
  updated: string
}

defineProps<{
  data: ShippingRequest[]
}>()
</script>

<style lang="scss" scoped>
.shipping-requests-table {
  :deep(.el-table) {
    --el-table-border-color: var(--el-border-color-lighter);
    
    .el-table__cell {
      padding: 12px 0;
    }
  }
}
</style> 