<template>
  <span class="status-tag" :class="type">{{ label }}</span>
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
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  
  &.success {
    background: rgba(82, 196, 26, 0.15);
    color: #52c41a;
  }
  
  &.warning {
    background: rgba(250, 173, 20, 0.15);
    color: #faad14;
  }
  
  &.danger {
    background: rgba(255, 77, 79, 0.15);
    color: #ff4d4f;
  }
  
  &.default {
    background: rgba(255, 255, 255, 0.15);
    color: var(--text-secondary);
  }
}
</style> 