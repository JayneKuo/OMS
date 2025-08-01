<template>
  <div class="trigger-conditions">
    <ConditionBuilder
      v-model="conditions"
      @update:modelValue="updateConditions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import type { RuleConfig } from '@/types/automation'
import ConditionBuilder from './ConditionBuilder.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<RuleConfig>,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 条件状态
const conditions = ref({
  operator: 'AND',
  rules: []
})

// 更新条件
const updateConditions = (value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    conditions: value
  })
}
</script>

<style lang="scss" scoped>
.trigger-conditions {
  padding: 16px;
}
</style> 