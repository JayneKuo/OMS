<template>
  <div class="form3461-approve-page">
    <div class="page-header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1>Approve Form 3461</h1>
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

      <!-- Review Checklist -->
      <div class="info-section">
        <h2 class="section-title">Review Checklist</h2>
        <div class="checklist">
          <el-checkbox 
            v-model="checklist.documentsComplete"
            label="All required documents are complete and valid"
          />
          <el-checkbox 
            v-model="checklist.dataAccurate"
            label="All form data is accurate and verified"
          />
          <el-checkbox 
            v-model="checklist.complianceChecked"
            label="Compliance requirements are met"
          />
          <el-checkbox 
            v-model="checklist.feesVerified"
            label="All applicable fees have been verified"
          />
        </div>
      </div>

      <!-- Approval Notes -->
      <div class="info-section">
        <h2 class="section-title">Approval Notes</h2>
        <el-form :model="approvalForm" label-position="top">
          <el-form-item label="Notes">
            <el-input
              v-model="approvalForm.notes"
              type="textarea"
              :rows="4"
              placeholder="Enter any notes regarding the approval"
            />
          </el-form-item>
          <el-form-item label="Release Number" required>
            <el-input
              v-model="approvalForm.releaseNumber"
              placeholder="Enter release number"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="approvalForm.confirmation">
              I confirm that I have reviewed all aspects of this form and approve its completion
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
            :disabled="!canApprove"
            @click="handleApprove"
          >
            Approve and Complete
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

const checklist = ref({
  documentsComplete: false,
  dataAccurate: false,
  complianceChecked: false,
  feesVerified: false
})

const approvalForm = ref({
  notes: '',
  releaseNumber: '',
  confirmation: false
})

const canApprove = computed(() => {
  const allChecked = Object.values(checklist.value).every(value => value)
  return allChecked && 
    approvalForm.value.confirmation && 
    approvalForm.value.releaseNumber.trim() !== ''
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

const handleApprove = async () => {
  try {
    // TODO: Implement actual approval logic
    await updateStatus(formData.value.id, 'Completed')
    ElMessage.success('Form approved and completed successfully')
    router.push('/customs/form3461')
  } catch (error) {
    ElMessage.error('Failed to approve form')
  }
}
</script>

<style lang="scss" scoped>
.form3461-approve-page {
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

      .checklist {
        display: flex;
        flex-direction: column;
        gap: 16px;

        :deep(.el-checkbox) {
          color: var(--text-primary);
        }
      }

      :deep(.el-form) {
        .el-form-item__label {
          color: var(--text-primary);
        }

        .el-input__wrapper {
          background-color: var(--bg-darker);
        }

        .el-checkbox {
          color: var(--text-primary);
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