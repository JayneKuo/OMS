<template>
  <div class="address-form">
    <div class="address-header">
      <span class="address-label">{{ label }}</span>
      <div class="address-actions">
        <el-button v-if="showFold" link type="primary" @click="toggleFold">
          {{ isFolded ? 'Unfold' : 'Fold' }}
        </el-button>
        <el-button v-if="showClear" link type="primary" @click="handleClear">
          Clear
        </el-button>
      </div>
    </div>
    <div v-if="!isFolded" class="address-content">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Name">
            <el-input v-model="localAddress.name" placeholder="Enter name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Company">
            <el-input v-model="localAddress.company" placeholder="Enter company" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="Address Line 1">
            <el-input v-model="localAddress.address1" placeholder="Enter address" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item label="Address Line 2">
            <el-input v-model="localAddress.address2" placeholder="Enter address (optional)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="City">
            <el-input v-model="localAddress.city" placeholder="Enter city" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="State">
            <el-input v-model="localAddress.state" placeholder="Enter state" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Zip Code">
            <el-input v-model="localAddress.zipCode" placeholder="Enter zip code" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="Country">
            <el-input v-model="localAddress.country" placeholder="Enter country" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Phone">
            <el-input v-model="localAddress.phone" placeholder="Enter phone" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Email">
            <el-input v-model="localAddress.email" placeholder="Enter email" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Address } from '../types'

interface Props {
  label: string
  modelValue?: Address
  showFold?: boolean
  showClear?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFold: true,
  showClear: false,
  modelValue: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: Address]
  clear: []
}>()

const isFolded = ref(false)

const localAddress = computed({
  get: () => props.modelValue || {},
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const toggleFold = () => {
  isFolded.value = !isFolded.value
}

const handleClear = () => {
  emit('update:modelValue', {})
  emit('clear')
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    localAddress.value = newVal
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.address-form {
  margin-bottom: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 16px;
  background-color: #2d3139;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    border-color: rgba(88, 166, 255, 0.3);
    box-shadow: 0 2px 8px rgba(88, 166, 255, 0.1);
  }
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.address-label {
  font-weight: 600;
  font-size: 14px;
  color: #58a6ff;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 14px;
    background-color: #58a6ff;
    border-radius: 2px;
  }
}

.address-actions {
  display: flex;
  gap: 8px;
  
  :deep(.el-button) {
    font-size: 12px;
    padding: 4px 8px;
    
    &:hover {
      color: #58a6ff;
    }
  }
}

.address-content {
  :deep(.el-form-item) {
    margin-bottom: 14px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #8b949e;
    font-size: 12px;
  }

  :deep(.el-input__wrapper) {
    background-color: #1e2227;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.2s ease;
    
    &:hover {
      border-color: rgba(88, 166, 255, 0.3);
    }
    
    &.is-focus {
      border-color: #58a6ff;
      box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.1);
    }
  }

  :deep(.el-input__inner) {
    color: #fff;
  }
}
</style>

