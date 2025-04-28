<template>
  <el-dropdown trigger="click" class="user-dropdown">
    <div class="user-info">
      <el-avatar :size="32" class="user-avatar">LZ</el-avatar>
      <span class="username">Admin</span>
      <el-icon class="dropdown-icon"><CaretBottom /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人设置</el-dropdown-item>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { CaretBottom } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.user-dropdown {
  height: 100%;
  
  .user-info {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 4px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.04);
      
      .dropdown-icon {
        opacity: 1;
      }
    }
    
    .user-avatar {
      background: #7c4dff;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }
    
    .username {
      font-size: 14px;
      color: #fff;
      margin-right: 2px;
    }
    
    .dropdown-icon {
      font-size: 12px;
      color: #8b949e;
      opacity: 0.7;
      transition: all 0.3s;
    }
  }
}

:deep(.el-dropdown-menu) {
  background-color: #1e2227;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 4px;
  
  .el-dropdown-menu__item {
    color: #8b949e;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(124, 77, 255, 0.1);
      color: #7c4dff;
    }
    
    &:not(:last-child) {
      margin-bottom: 2px;
    }
  }
}
</style> 