<template>
  <div class="track-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Track FTZ e-214</h1>
        <p class="subtitle">Track the status and history of your FTZ e-214 entry</p>
      </div>
    </div>
    <div class="content-section">
      <el-empty description="Tracking feature under development..." />
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added later
</script>

<style lang="scss" scoped>
.track-page {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  margin-bottom: 24px;

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