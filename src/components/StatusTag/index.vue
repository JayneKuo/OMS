<template>
  <span 
    class="status-tag" 
    :class="[`status-tag--${type}`]"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
defineOptions({
  name: 'StatusTag'
})

interface Props {
  type: 'success' | 'warning' | 'danger' | 'default'
  label: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  &--success {
    background: rgba(var(--success-color-rgb), 0.1);
    color: var(--success-color);
  }
  
  &--warning {
    background: rgba(var(--warning-color-rgb), 0.1);
    color: var(--warning-color);
  }
  
  &--danger {
    background: rgba(var(--danger-color-rgb), 0.1);
    color: var(--danger-color);
  }
  
  &--default {
    background: rgba(var(--text-secondary-rgb), 0.1);
    color: var(--text-secondary);
  }
}
</style> 