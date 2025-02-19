<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>T86</h1>
        <p class="subtitle">海关T86报关单管理</p>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <el-empty description="功能开发中..." />
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 500;
    margin: 0;
    color: var(--text-primary);
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
  }
}

.content-section {
  background: var(--bg-light);
  border-radius: 8px;
  padding: 24px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 