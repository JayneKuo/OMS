<template>
  <div class="form3461-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>{{ isEdit ? 'Edit Form 3461' : 'Create Form 3461' }}</h1>
        <p class="subtitle">{{ isEdit ? 'Edit existing Form 3461 entry' : 'Create a new Form 3461 entry' }}</p>
      </div>
    </div>

    <!-- 表单区域 -->
    <div class="form-section">
      <el-form 
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
      >
        <!-- 基本信息 -->
        <div class="form-group">
          <h2 class="group-title">Basic Information</h2>
          <div class="form-row">
            <el-form-item label="Entry No" prop="entryNo">
              <el-input v-model="formData.entryNo" placeholder="Enter entry number" />
            </el-form-item>
            <el-form-item label="Importer No" prop="importerNo">
              <el-input v-model="formData.importerNo" placeholder="Enter importer number" />
            </el-form-item>
            <el-form-item label="Entry Type" prop="entryType">
              <el-select v-model="formData.entryType" placeholder="Select entry type">
                <el-option
                  v-for="option in entryTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="Bill of Lading" prop="billOfLading">
              <el-input v-model="formData.billOfLading" placeholder="Enter bill of lading" />
            </el-form-item>
            <el-form-item label="Port of Entry" prop="portOfEntry">
              <el-select v-model="formData.portOfEntry" placeholder="Select port of entry">
                <el-option
                  v-for="option in portOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Entry Date" prop="entryDate">
              <el-date-picker
                v-model="formData.entryDate"
                type="date"
                placeholder="Select entry date"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 运输信息 -->
        <div class="form-group">
          <h2 class="group-title">Transportation Details</h2>
          <div class="form-row">
            <el-form-item label="Country of Origin" prop="countryOfOrigin">
              <el-input v-model="formData.countryOfOrigin" placeholder="Enter country of origin" />
            </el-form-item>
            <el-form-item label="Vessel Name" prop="vesselName">
              <el-input v-model="formData.vesselName" placeholder="Enter vessel name" />
            </el-form-item>
            <el-form-item label="Voyage No" prop="voyageNo">
              <el-input v-model="formData.voyageNo" placeholder="Enter voyage number" />
            </el-form-item>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="form-group">
          <h2 class="group-title">Merchandise Information</h2>
          <div class="form-row">
            <el-form-item label="Manufacturer ID" prop="manufacturerId">
              <el-input v-model="formData.manufacturerId" placeholder="Enter manufacturer ID" />
            </el-form-item>
            <el-form-item label="Value" prop="value">
              <el-input v-model="formData.value" placeholder="Enter value">
                <template #prefix>$</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="Description" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="3"
                placeholder="Enter merchandise description"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 申报人信息 -->
        <div class="form-group">
          <h2 class="group-title">Declarant Information</h2>
          <div class="form-row">
            <el-form-item label="Declarant Name" prop="declarantName">
              <el-input v-model="formData.declarantName" placeholder="Enter declarant name" />
            </el-form-item>
            <el-form-item label="Contact Phone" prop="contactPhone">
              <el-input v-model="formData.contactPhone" placeholder="Enter contact phone" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="formData.email" placeholder="Enter email" />
            </el-form-item>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">{{ isEdit ? 'Save Changes' : 'Create Entry' }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import type { Form3461FormState } from './types'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

// 判断是否为编辑模式
const isEdit = computed(() => route.name === 'EditForm3461')

// 表单数据
const formData = ref<Form3461FormState>({
  entryNo: '',
  importerNo: '',
  entryType: '',
  billOfLading: '',
  portOfEntry: '',
  entryDate: '',
  countryOfOrigin: '',
  vesselName: '',
  voyageNo: '',
  manufacturerId: '',
  value: '',
  description: '',
  declarantName: '',
  contactPhone: '',
  email: ''
})

// 表单验证规则
const formRules = {
  entryNo: [{ required: true, message: 'Please enter entry number', trigger: 'blur' }],
  importerNo: [{ required: true, message: 'Please enter importer number', trigger: 'blur' }],
  entryType: [{ required: true, message: 'Please select entry type', trigger: 'change' }],
  billOfLading: [{ required: true, message: 'Please enter bill of lading', trigger: 'blur' }],
  portOfEntry: [{ required: true, message: 'Please select port of entry', trigger: 'change' }],
  entryDate: [{ required: true, message: 'Please select entry date', trigger: 'change' }],
  countryOfOrigin: [{ required: true, message: 'Please enter country of origin', trigger: 'blur' }],
  manufacturerId: [{ required: true, message: 'Please enter manufacturer ID', trigger: 'blur' }],
  value: [{ required: true, message: 'Please enter value', trigger: 'blur' }],
  description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
  declarantName: [{ required: true, message: 'Please enter declarant name', trigger: 'blur' }],
  contactPhone: [{ required: true, message: 'Please enter contact phone', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
  ]
}

// 下拉选项
const entryTypeOptions = [
  { label: 'Consumption', value: 'Consumption' },
  { label: 'Warehouse', value: 'Warehouse' },
  { label: 'Foreign Trade Zone', value: 'FTZ' },
  { label: 'Transportation & Exportation', value: 'T&E' },
  { label: 'Informal', value: 'Informal' }
]

const portOptions = [
  { label: 'Los Angeles', value: 'Los Angeles' },
  { label: 'New York', value: 'New York' },
  { label: 'Miami', value: 'Miami' },
  { label: 'Seattle', value: 'Seattle' },
  { label: 'Chicago', value: 'Chicago' }
]

// 处理取消
const handleCancel = () => {
  router.push('/customs/form-3461')
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('Form submitted:', formData.value)
      // TODO: 实现表单提交逻辑
      router.push('/customs/form-3461')
    } else {
      console.error('Form validation failed:', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
.form3461-edit-page {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
  color: var(--text-primary);
}

.page-header {
  margin-bottom: 32px;

  .header-content {
    h1 {
      font-size: 32px;
      font-weight: 500;
      margin: 0;
      color: var(--text-primary);
    }

    .subtitle {
      margin: 8px 0 0;
      color: var(--text-secondary);
      font-size: 14px;
    }
  }
}

.form-section {
  background: var(--bg-darker);
  border-radius: 8px;
  padding: 24px;

  .form-group {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    .group-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 16px;
      color: var(--text-primary);
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;

      .el-form-item__label {
        color: var(--text-secondary);
        padding: 0 0 8px;
        line-height: 1;
      }

      .el-input__wrapper,
      .el-textarea__wrapper {
        background-color: var(--bg-dark);
        border-color: var(--border-color);
        box-shadow: none;

        &.is-focus {
          border-color: var(--primary-color);
        }

        input,
        textarea {
          color: var(--text-primary);

          &::placeholder {
            color: var(--text-placeholder);
          }
        }
      }

      &.is-required .el-form-item__label:before {
        color: var(--danger-color);
      }
    }

    &.full-width {
      grid-column: 1 / -1;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-date-editor) {
  width: 100%;
}
</style> 