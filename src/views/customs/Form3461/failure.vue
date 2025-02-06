<template>
  <div class="form3461-failure-page">
    <div class="page-header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1>Form 3461 Failure Details</h1>
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

      <!-- Failure Details -->
      <div class="info-section">
        <h2 class="section-title">Failure Details</h2>
        <div class="failure-details">
          <div class="detail-item">
            <label>Primary Reason</label>
            <span class="reason">{{ failureDetails.primaryReason }}</span>
          </div>

          <div class="detail-item" v-if="failureDetails.additionalReasons.length">
            <label>Additional Reasons</label>
            <ul class="reasons-list">
              <li v-for="reason in failureDetails.additionalReasons" :key="reason">{{ reason }}</li>
            </ul>
          </div>

          <div class="detail-item">
            <label>Detailed Explanation</label>
            <p class="explanation">{{ failureDetails.explanation }}</p>
          </div>

          <div class="detail-item">
            <label>Required Actions</label>
            <ul class="actions-list">
              <li v-for="(action, index) in failureDetails.requiredActions" :key="index">{{ action }}</li>
            </ul>
          </div>

          <div class="detail-item">
            <label>Review Date</label>
            <span>{{ failureDetails.reviewDate }}</span>
          </div>

          <div class="detail-item">
            <label>Reviewer</label>
            <span>{{ failureDetails.reviewer }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <div class="actions-wrapper">
          <el-button @click="goBack">Back to List</el-button>
          <el-button 
            type="primary"
            @click="handleEdit"
          >
            Edit Form
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { Form3461TableItem } from './types'
import { useTableData } from './composables/useTableData'

const route = useRoute()
const router = useRouter()
const { tableData } = useTableData()

const formData = ref<Form3461TableItem>({
  systemId: '',
  id: '',
  entryNo: '',
  importerNo: '',
  entryType: '',
  portOfEntry: '',
  bondType: '',
  entryDate: '',
  status: 'Failed',
  description: '',
  lastUpdated: '',
  documents: []
})

// Mock failure details - in real application, this would come from the API
const failureDetails = ref({
  primaryReason: 'Incomplete Documentation',
  additionalReasons: [
    'Missing required signatures',
    'Incorrect classification codes'
  ],
  explanation: 'The submitted form is missing several required documents and contains incorrect classification codes that need to be addressed before resubmission.',
  requiredActions: [
    'Upload all required supporting documents',
    'Review and correct classification codes',
    'Obtain necessary signatures',
    'Resubmit the form with all corrections'
  ],
  reviewDate: '2024-01-16',
  reviewer: 'John Smith'
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

const handleEdit = () => {
  router.push(`/customs/form3461/edit/${formData.value.systemId}`)
}
</script>

<style lang="scss" scoped>
.form3461-failure-page {
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

      .failure-details {
        .detail-item {
          margin-bottom: 24px;

          &:last-child {
            margin-bottom: 0;
          }

          label {
            display: block;
            color: var(--text-secondary);
            font-size: 12px;
            margin-bottom: 8px;
          }

          span {
            color: var(--text-primary);
            font-size: 14px;
          }

          .reason {
            color: #FF4D4F;
            font-weight: 500;
          }

          .explanation {
            color: var(--text-primary);
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
          }

          .reasons-list,
          .actions-list {
            margin: 0;
            padding-left: 20px;

            li {
              color: var(--text-primary);
              font-size: 14px;
              margin-bottom: 8px;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
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