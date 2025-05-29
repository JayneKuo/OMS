<template>
  <el-card class="data-table-card">
    <el-table :data="tableData" border stripe :loading="loading">
      <el-table-column prop="customer" label="客户" width="120" />
      <el-table-column prop="channel" label="渠道" width="100" />
      <el-table-column prop="sku" label="SKU" width="120" />
      <el-table-column prop="sales" label="销量" width="100" />
      <el-table-column prop="conversion" label="转化量" width="100" />
      <el-table-column prop="traffic" label="流量" width="100" />
      <el-table-column prop="conversionRate" label="转化率" width="100">
        <template #default="{ row }">{{ row.conversionRate }}%</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ tableData: any[], loading: boolean }>()
</script>
<style scoped>
.data-table-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background: #23272e;
  color: #e0e6ed;
}
</style> 