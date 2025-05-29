<template>
  <el-card class="strategy-panel-card">
    <div class="card-title">补货策略建议</div>
    <el-table :data="strategyData" border stripe>
      <el-table-column prop="sku" label="SKU" width="120" />
      <el-table-column prop="suggestQty" label="建议补货量" width="120" />
      <el-table-column prop="reason" label="建议说明" min-width="200" />
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ strategyData: any[] }>()
</script>
<style scoped>
.strategy-panel-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background: #23272e;
  color: #e0e6ed;
}
.card-title {
  font-size: 14px;
  color: #8a919f;
  margin-bottom: 8px;
  text-align: center;
}
</style> 