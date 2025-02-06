<template>
  <div class="form3461-cancel-page">
    <div class="page-header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1>Cancel Form 3461</h1>
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

      <!-- Cancellation Details -->
      <div class="info-section">
        <h2 class="section-title">Cancellation Details</h2>
        <el-form :model="cancelForm" label-position="top">
          <el-form-item label="Cancellation Reason" required>
            <el-select
              v-model="cancelForm.reason"
              placeholder="Select reason for cancellation"
            >
              <el-option
                v-for="reason in cancellationReasons"
                :key="reason.value"
                :label="reason.label"
                :value="reason.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Detailed Explanation" required>
            <el-input
              v-model="cancelForm.explanation"
              type="textarea"
              :rows="4"
              placeholder="Provide detailed explanation for the cancellation"
            />
          </el-form-item>

          <el-form-item label="Next Steps">
            <el-input
              v-model="cancelForm.nextSteps"
              type="textarea"
              :rows="4"
              placeholder="Describe any next steps or follow-up actions required"
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="cancelForm.confirmation">
              I understand that this action cannot be undone and the form will be permanently cancelled
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <div class="actions-wrapper">
          <el-button @click="goBack">Back</el-button>
          <el-button 
            type="primary" 
            :disabled="!canCancel"
            @click="handleCancel"
          >
            Cancel Form
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

const cancellationReasons = [
  { label: 'Duplicate Entry', value: 'duplicate' },
  { label: 'Incorrect Filing', value: 'incorrect_filing' },
  { label: 'Change in Shipment', value: 'shipment_change' },
  { label: 'Business Decision', value: 'business_decision' },
  { label: 'Technical Error', value: 'technical_error' },
  { label: 'Other', value: 'other' }
]

const cancelForm = ref({
  reason: '',
  explanation: '',
  nextSteps: '',
  confirmation: false
})

const canCancel = computed(() => {
  return cancelForm.value.reason &&
    cancelForm.value.explanation.trim() !== '' &&
    cancelForm.value.confirmation
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

const handleCancel = async () => {
  try {
    // TODO: Implement actual cancellation logic
    await updateStatus(formData.value.id, 'Cancelled')
    ElMessage.success('Form cancelled successfully')
    router.push('/customs/form3461')
  } catch (error) {
    ElMessage.error('Failed to cancel form')
  }
}
</script>

<style lang="scss" scoped>
.form3461-cancel-page {
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