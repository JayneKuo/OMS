<template>
  <div class="form3461-submit-page">
    <div class="page-header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1>Submit Form 3461</h1>
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

      <!-- Required Documents -->
      <div class="info-section">
        <h2 class="section-title">Required Documents</h2>
        <div class="documents-section">
          <div class="upload-list">
            <div 
              v-for="(doc, index) in requiredDocuments" 
              :key="index"
              class="upload-item"
            >
              <div class="doc-info">
                <span class="doc-name">{{ doc.name }}</span>
                <span class="doc-status" :class="doc.status">
                  {{ doc.status }}
                </span>
              </div>
              <el-upload
                class="upload-component"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="(file) => handleFileChange(index, file)"
              >
                <el-button type="primary">
                  {{ doc.file ? 'Replace' : 'Upload' }}
                </el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </div>

      <!-- Submission Notes -->
      <div class="info-section">
        <h2 class="section-title">Submission Notes</h2>
        <el-form :model="submitForm" label-position="top">
          <el-form-item label="Additional Notes">
            <el-input
              v-model="submitForm.notes"
              type="textarea"
              :rows="4"
              placeholder="Enter any additional notes for the review process"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="submitForm.confirmation">
              I confirm that all the information provided is accurate and complete
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
            :disabled="!canSubmit"
            @click="handleSubmit"
          >
            Submit Form
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
  status: 'Pending',
  description: '',
  lastUpdated: '',
  documents: []
})

const requiredDocuments = ref([
  { name: 'Commercial Invoice', status: 'pending', file: null },
  { name: 'Bill of Lading', status: 'pending', file: null },
  { name: 'Packing List', status: 'pending', file: null }
])

const submitForm = ref({
  notes: '',
  confirmation: false
})

const canSubmit = computed(() => {
  const allDocsUploaded = requiredDocuments.value.every(doc => doc.file)
  return allDocsUploaded && submitForm.value.confirmation
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

const handleFileChange = (index: number, file: any) => {
  requiredDocuments.value[index].file = file
  requiredDocuments.value[index].status = 'uploaded'
}

const handleSubmit = async () => {
  try {
    // TODO: Implement actual submission logic
    await updateStatus(formData.value.id, 'Processing')
    ElMessage.success('Form submitted successfully')
    router.push('/customs/form3461')
  } catch (error) {
    ElMessage.error('Failed to submit form')
  }
}
</script>

<style lang="scss" scoped>
.form3461-submit-page {
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

      .upload-list {
        .upload-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--border-color);

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .doc-info {
            display: flex;
            align-items: center;
            gap: 12px;

            .doc-name {
              color: var(--text-primary);
              font-size: 14px;
            }

            .doc-status {
              font-size: 12px;
              padding: 2px 8px;
              border-radius: 4px;

              &.pending {
                color: #FAAD14;
                background: rgba(250, 173, 20, 0.1);
              }

              &.uploaded {
                color: #52C41A;
                background: rgba(82, 196, 26, 0.1);
              }
            }
          }
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