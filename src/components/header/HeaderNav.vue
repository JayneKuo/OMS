<template>
  <div class="header-nav">
    <div class="left">
      <el-button class="menu-btn">
        <el-icon><Menu /></el-icon>
      </el-button>
      <div class="breadcrumb">
        <el-icon><HomeFilled /></el-icon>
        <span class="separator">/</span>
        <span>ISF</span>
      </div>
    </div>
    <div class="right">
      <div class="module-selector">
        <el-icon><HomeFilled /></el-icon>
        <span class="module-name">LAUNDRY SAUCE</span>
        <el-icon><ArrowDown /></el-icon>
      </div>
      <div class="user-info">
        <el-avatar :size="32" class="user-avatar">LZ</el-avatar>
        <span class="username">Admin</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Menu, HomeFilled, ArrowDown } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.header-nav {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #1e2227;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .left {
    display: flex;
    align-items: center;
    gap: 16px;

    .menu-btn {
      padding: 8px;
      height: 32px;
      background: transparent;
      border: none;
      color: #8b949e;

      &:hover {
        color: #fff;
      }
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #8b949e;

      .separator {
        margin: 0 4px;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 24px;

    .module-selector {
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

      .module-name {
        margin: 0 4px;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }

      .user-avatar {
        background-color: #7c4dff;
      }

      .username {
        color: #fff;
      }
    }
  }
}
</style> 