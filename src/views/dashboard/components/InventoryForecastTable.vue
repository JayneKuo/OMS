<template>
  <div class="inventory-forecast-table">
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
      
      <el-table-column prop="currentStock" label="Current Stock" width="120" align="right">
        <template #default="{ row }">
          <span :class="['stock', { 'low': row.currentStock < row.forecastDemand }]">
            {{ row.currentStock }}
          </span>
        </template>
      </el-table-column>
      
      <el-table-column prop="forecastDemand" label="Forecast Demand" width="140" align="right">
        <template #default="{ row }">
          <span class="forecast">{{ row.forecastDemand }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="suggestedPurchase" label="Suggested Purchase" width="160" align="right">
        <template #default="{ row }">
          <el-tag 
            :type="getPurchaseTagType(row)" 
            effect="plain" 
            size="small"
          >
            {{ row.suggestedPurchase }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="expectedStockout" label="Expected Stockout" width="140">
        <template #default="{ row }">
          <el-tag 
            type="danger" 
            effect="light" 
            size="small"
            v-if="isStockoutSoon(row.expectedStockout)"
          >
            {{ row.expectedStockout }}
          </el-tag>
          <span class="date" v-else>{{ row.expectedStockout }}</span>
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
interface ForecastItem {
  sku: string
  name: string
  currentStock: number
  forecastDemand: number
  suggestedPurchase: number
  expectedStockout: string
}

defineProps<{
  data: ForecastItem[]
}>()

const getPurchaseTagType = (row: ForecastItem) => {
  const ratio = row.suggestedPurchase / row.forecastDemand
  if (ratio > 1.5) return 'danger'
  if (ratio > 1.2) return 'warning'
  return 'info'
}

const isStockoutSoon = (date: string) => {
  const stockoutDate = new Date(date)
  const today = new Date()
  const days = Math.ceil((stockoutDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return days <= 7
}

const handlePurchase = (row: ForecastItem) => {
  console.log('Purchase:', row)
}
</script>

<style lang="scss" scoped>
.inventory-forecast-table {
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
    
    .stock {
      font-weight: 600;
      color: var(--el-color-success);
      
      &.low {
        color: var(--el-color-danger);
      }
    }
    
    .forecast {
      font-weight: 500;
      color: var(--el-color-primary);
    }
    
    .date {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }
}
</style> 