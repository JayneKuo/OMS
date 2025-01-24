<template>
  <el-dropdown trigger="click" class="module-dropdown">
    <div class="module-trigger">
      <el-icon><HomeFilled /></el-icon>
      <span>LAUNDRY SAUCE</span>
      <el-icon><ArrowDown /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in modules" :key="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { HomeFilled, ArrowDown } from '@element-plus/icons-vue'

const modules = [
  { label: 'LAUNDRY SAUCE', value: 'laundry' },
  { label: 'WAREHOUSE', value: 'warehouse' },
  { label: 'LOGISTICS', value: 'logistics' }
]
</script>

<style lang="scss" scoped>
.module-dropdown {
  .module-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;

    &:hover {
      background-color: rgba(255, 255, 255, 0.04);
    }
  }
}
</style> 