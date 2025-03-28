<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>退货订单</h1>
        <p class="subtitle">管理所有退货订单信息</p>
      </div>
    </div>
    <!-- 页面内容 -->
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
</style> 