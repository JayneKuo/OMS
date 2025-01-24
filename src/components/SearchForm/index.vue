<template>
  <div class="search-form">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SearchForm'
})
</script>

<style lang="scss" scoped>
.search-form {
  background: var(--bg-dark);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}
</style> 