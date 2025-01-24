<template>
  <el-dropdown trigger="click" class="user-dropdown">
    <div class="user-info">
      <el-avatar :size="32" class="user-avatar">LZ</el-avatar>
      <span class="username">Admin</span>
      <el-icon><ArrowDown /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Profile</el-dropdown-item>
        <el-dropdown-item>Settings</el-dropdown-item>
        <el-dropdown-item divided>Sign Out</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.user-info {
  margin-left: 16px;
  
  .user-trigger {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    .username {
      margin-left: 8px;
      color: #fff;
    }
  }
}
</style> 