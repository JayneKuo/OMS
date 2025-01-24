<template>
  <el-tooltip 
    :content="description" 
    placement="top"
    effect="dark"
  >
    <span 
      class="status-tag"
      :style="{
        backgroundColor: `${color}1A`,  // 添加10%的透明度
        color: color,
        borderColor: `${color}33`  // 添加20%的透明度
      }"
    >
      {{ label }}
    </span>
  </el-tooltip>
</template>

<script setup lang="ts">
defineOptions({
  name: 'StatusTag'
})

interface Props {
  type?: string
  label: string
  color: string
  description: string
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
  border: 1px solid;
  cursor: help;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}
</style> 