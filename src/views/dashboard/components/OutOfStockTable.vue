<template>
  <div class="out-of-stock-table">
    <el-table
      :data="data"
      style="width: 100%"
      size="large"
    >
      <el-table-column prop="sku" label="SKU" width="120">
        <template #default="{ row }">
          <span class="sku-code">{{ row.sku }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="name" label="Product Name" min-width="200" show-overflow-tooltip />
      
      <el-table-column prop="demand" label="Demand" width="100" align="right">
        <template #default="{ row }">
          <span class="demand">{{ row.demand }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="available" label="Available" width="100" align="right">
        <template #default="{ row }">
          <el-tag type="danger" effect="plain" size="small">
            {{ row.available }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="lastStock" label="Last Stock" width="120">
        <template #default="{ row }">
          <span class="date">{{ row.lastStock }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="nextArrival" label="Next Arrival" width="120">
        <template #default="{ row }">
          <span class="date">{{ row.nextArrival }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handlePurchase(row)">
            Purchase
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
interface StockItem {
  sku: string
  name: string
  demand: number
  available: number
  lastStock: string
  nextArrival: string
}

defineProps<{
  data: StockItem[]
}>()

const handlePurchase = (row: StockItem) => {
  console.log('Purchase:', row)
}
</script>

<style lang="scss" scoped>
.out-of-stock-table {
  :deep(.el-table) {
    --el-table-border-color: var(--el-border-color-lighter);
    
    .el-table__cell {
      padding: 12px;
    }
    
    .sku-code {
      font-family: monospace;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
    
    .demand {
      font-weight: 600;
      color: var(--el-color-danger);
    }
    
    .date {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }
}
</style> 