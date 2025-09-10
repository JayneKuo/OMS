<template>
  <div class="page-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="description" class="page-description">{{ description }}</p>
      </div>
      <div v-if="$slots.extra" class="header-right">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.page-header {
  background: #1e1e1e;
  border-bottom: 1px solid #333333;
  padding: 20px 0;
  margin-bottom: 24px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .header-left {
    flex: 1;

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .page-description {
      font-size: 14px;
      color: #a0aec0;
      margin: 0;
      line-height: 1.4;
    }
  }

  .header-right {
    flex-shrink: 0;
    margin-left: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    .header-content {
      flex-direction: column;
      gap: 16px;
    }

    .header-right {
      margin-left: 0;
      width: 100%;
      justify-content: flex-start;
    }
  }
}
</style>
