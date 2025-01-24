<template>
  <div class="breadcrumb">
    <el-icon><HomeFilled /></el-icon>
    <span class="module-name">LAUNDRY SAUCE</span>
    <el-icon><ArrowRight /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { HomeFilled, ArrowRight } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8b949e;
  
  .module-name {
    color: #fff;
    font-weight: 500;
  }
  
  .el-icon {
    font-size: 16px;
  }
}
</style> 