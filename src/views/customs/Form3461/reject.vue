<template>
  <div class="form3461-reject-page">
    <div class="page-header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1>Reject Form 3461</h1>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Form Summary -->
      <div class="info-section">
        <h2 class="section-title">Form Summary</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Entry No</label>
            <span>{{ formData.entryNo }}</span>
          </div>
          <div class="info-item">
            <label>Importer No</label>
            <span>{{ formData.importerNo }}</span>
          </div>
          <div class="info-item">
            <label>Entry Type</label>
            <span>{{ formData.entryType }}</span>
          </div>
        </div>
      </div>

      <!-- Rejection Reasons -->
      <div class="info-section">
        <h2 class="section-title">Rejection Reasons</h2>
        <el-form :model="rejectForm" label-position="top">
          <el-form-item label="Primary Reason" required>
            <el-select
              v-model="rejectForm.primaryReason"
              placeholder="Select primary reason for rejection"
            >
              <el-option
                v-for="reason in rejectionReasons"
                :key="reason.value"
                :label="reason.label"
                :value="reason.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Additional Reasons">
            <el-checkbox-group v-model="rejectForm.additionalReasons">
              <el-checkbox 
                v-for="reason in rejectionReasons"
                :key="reason.value"
                :label="reason.value"
              >
                {{ reason.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="Detailed Explanation" required>
            <el-input
              v-model="rejectForm.explanation"
              type="textarea"
              :rows="4"
              placeholder="Provide detailed explanation for the rejection"
            />
          </el-form-item>

          <el-form-item label="Required Actions">
            <el-input
              v-model="rejectForm.requiredActions"
              type="textarea"
              :rows="4"
              placeholder="List actions required to resolve the issues"
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="rejectForm.confirmation">
              I confirm that I have reviewed the form thoroughly and provided clear reasons for rejection
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <div class="actions-wrapper">
          <el-button @click="goBack">Cancel</el-button>
          <el-button 
            type="primary" 
            :disabled="!canReject"
            @click="handleReject"
          >
            Reject Form
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { Form3461TableItem } from './types'
import { useTableData } from './composables/useTableData'

const route = useRoute()
const router = useRouter()
const { tableData, updateStatus } = useTableData()

const formData = ref<Form3461TableItem>({
  systemId: '',
  id: '',
  entryNo: '',
  importerNo: '',
  entryType: '',
  portOfEntry: '',
  bondType: '',
  entryDate: '',
  status: 'Processing',
  description: '',
  lastUpdated: '',
  documents: []
})

const rejectionReasons = [
  { label: 'Incomplete Documentation', value: 'incomplete_docs' },
  { label: 'Incorrect Information', value: 'incorrect_info' },
  { label: 'Missing Signatures', value: 'missing_signatures' },
  { label: 'Non-compliance with Regulations', value: 'non_compliance' },
  { label: 'Invalid Classification', value: 'invalid_classification' },
  { label: 'Discrepancy in Values', value: 'value_discrepancy' }
]

const rejectForm = ref({
  primaryReason: '',
  additionalReasons: [],
  explanation: '',
  requiredActions: '',
  confirmation: false
})

const canReject = computed(() => {
  return rejectForm.value.primaryReason &&
    rejectForm.value.explanation.trim() !== '' &&
    rejectForm.value.confirmation
})

onMounted(() => {
  const id = route.params.id as string
  const data = tableData.value.find(item => item.systemId === id)
  if (data) {
    formData.value = { ...data }
  } else {
    ElMessage.error('Form not found')
    router.push('/customs/form3461')
  }
})

const goBack = () => {
  router.back()
}

const handleReject = async () => {
  try {
    // TODO: Implement actual rejection logic
    await updateStatus(formData.value.id, 'Failed')
    ElMessage.success('Form rejected successfully')
    router.push('/customs/form3461')
  } catch (error) {
    ElMessage.error('Failed to reject form')
  }
}
</script>

<style lang="scss" scoped>
.form3461-reject-page {
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-darker);

  .page-header {
    margin-bottom: 24px;

    .header-content {
      display: flex;
      align-items: center;
      gap: 24px;

      .back-btn {
        height: 40px;
        padding: 0 16px;
        border-radius: 8px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }
      }

      h1 {
        font-size: 24px;
        font-weight: 500;
        margin: 0;
        color: var(--text-primary);
      }
    }
  }

  .content-wrapper {
    .info-section {
      background: var(--bg-dark);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;

      .section-title {
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 20px;
        color: var(--text-primary);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;

        .info-item {
          label {
            display: block;
            color: var(--text-secondary);
            font-size: 12px;
            margin-bottom: 4px;
          }

          span {
            color: var(--text-primary);
            font-size: 14px;
          }
        }
      }

      :deep(.el-form) {
        .el-form-item__label {
          color: var(--text-primary);
        }

        .el-input__wrapper,
        .el-textarea__wrapper {
          background-color: var(--bg-darker);
        }

        .el-checkbox {
          color: var(--text-primary);
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .el-select {
          width: 100%;
        }
      }
    }

    .actions-section {
      background: var(--bg-dark);
      border-radius: 8px;
      padding: 24px;

      .actions-wrapper {
        display: flex;
        gap: 12px;
        justify-content: flex-end;

        .el-button {
          min-width: 120px;
        }
      }
    }
  }
}
</style> 