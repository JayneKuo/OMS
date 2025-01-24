<template>
  <div class="search-section">
    <div class="search-title">SEARCH BY</div>
    <div class="search-form">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SearchForm'
})
</script>

<style lang="scss" scoped>
.search-section {
  background: var(--bg-dark);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;

  .search-title {
    color: var(--text-secondary);
    font-size: 13px;
    margin-bottom: 16px;
  }

  .search-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style> 