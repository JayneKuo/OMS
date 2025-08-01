<template>
  <div class="price-range-input">
    <el-input-number
      v-model="minValue"
      :min="min"
      :step="step"
      :precision="precision"
      placeholder="Min price"
      @change="updateValue"
    />
    <span class="separator">~&lt;/span&gt;
    <el-input-number
      v-model="maxValue"
      :min="min"
      :step="step"
      :precision="precision"
      placeholder="Max price"
      @change="updateValue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ min: null, max: null })
  },
  min: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  },
  precision: {
    type: Number,
    default: 2
  }
})

const emit = defineEmits(['update:modelValue'])

const minValue = ref(props.modelValue?.min)
const maxValue = ref(props.modelValue?.max)

watch(() => props.modelValue, (newVal) => {
  minValue.value = newVal?.min
  maxValue.value = newVal?.max
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', {
    min: minValue.value,
    max: maxValue.value
  })
}
</script>

<style lang="scss" scoped>
.price-range-input {
  display: flex;
  align-items: center;
  gap: 8px;

  .separator {
    color: var(--el-text-color-secondary);
  }

  :deep(.el-input-number) {
    width: 160px;
  }
}
</style> 