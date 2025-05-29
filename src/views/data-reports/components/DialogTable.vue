<template>
  <el-dialog :model-value="visible" @update:model-value="updateVisible" :title="title" width="80%" :close-on-click-modal="false">
    <el-table :data="data" style="width: 100%" :border="true" v-loading="loading">
      <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" />
    </el-table>
    <template #footer>
      <el-button @click="updateVisible(false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  visible: Boolean,
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  title: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible'])
function updateVisible(val: boolean) {
  emit('update:visible', val)
}
</script>

<style scoped>
.el-dialog {
  max-width: 900px;
}
</style> 