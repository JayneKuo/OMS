<template>
  <el-card class="impact-explanation-card">
    <div class="card-title">影响因子说明</div>
    <div class="explanation-content">{{ explanation }}</div>
  </el-card>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ explanation: string }>()
</script>
<style scoped>
.impact-explanation-card {
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
.explanation-content {
  font-size: 15px;
  line-height: 1.7;
  color: #e0e6ed;
  padding: 10px 0 0 0;
}
</style> 