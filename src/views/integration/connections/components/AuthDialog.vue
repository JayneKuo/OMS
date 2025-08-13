<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    @close="handleClose"
  >
    <div class="auth-dialog">
      <div v-if="config?.instructions" class="instructions">
        {{ config.instructions }}
      </div>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="auth-form"
      >
        <el-form-item
          v-for="field in config?.fields"
          :key="field.key"
          :label="field.label"
          :prop="field.key"
        >
          <el-select
            v-if="field.type === 'select'"
            v-model="formData[field.key]"
            :placeholder="field.placeholder"
            style="width: 100%"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <el-input
            v-else
            v-model="formData[field.key]"
            :type="field.type"
            :placeholder="field.placeholder"
            :show-password="field.type === 'password'"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          Authorize
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Integration } from '@/types/integration'
import { AUTH_CONFIGS } from '@/constants/integration'

const props = defineProps<{
  visible: boolean
  integration: Integration
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success', data: any): void
}>()

const loading = ref(false)
const formRef = ref<FormInstance>()
const formData = ref<Record<string, any>>({})

// Get auth config for current integration
const config = computed(() => {
  if (!props.integration.subType) return null
  return AUTH_CONFIGS[props.integration.subType]
})

// Generate form validation rules
const rules = computed(() => {
  const result: Record<string, any> = {}
  config.value?.fields.forEach(field => {
    if (field.required) {
      result[field.key] = [{
        required: true,
        message: `Please enter ${field.label}`,
        trigger: 'blur'
      }]
    }
  })
  return result
})

// Dialog title
const title = computed(() => `Connect ${props.integration.name}`)

// Dialog visibility
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Handle close
const handleClose = () => {
  dialogVisible.value = false
  formData.value = {}
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// Handle submit
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate success response
    emit('success', {
      ...formData.value,
      integration_id: props.integration.id
    })
    
    ElMessage.success('Authorization successful')
    handleClose()
  } catch (err) {
    // Form validation failed
    console.error('Validation failed:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-dialog {
  .instructions {
    margin-bottom: 20px;
    padding: 12px;
    background-color: var(--el-color-primary-light-9);
    border-radius: 4px;
    color: var(--el-text-color-regular);
    font-size: 14px;
    line-height: 1.4;
  }

  .auth-form {
    margin-top: 20px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style> 