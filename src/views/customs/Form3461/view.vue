<template>
  <div class="form3461-view-page">
    <div class="page-header">
      <div class="header-content">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          Back to List
        </el-button>
        <h1>View Form 3461 Details</h1>
      </div>
      <div class="status-section">
        <span class="status-label">Status:</span>
        <span 
          class="status-value"
          :style="{ color: STATUS_CONFIG[formData.status].color }"
        >
          {{ STATUS_CONFIG[formData.status].label }}
        </span>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Entry Information -->
      <div class="info-section">
        <h2 class="section-title">Entry Information</h2>
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
          <div class="info-item">
            <label>Port of Entry</label>
            <span>{{ formData.portOfEntry }}</span>
          </div>
          <div class="info-item">
            <label>Bond Type</label>
            <span>{{ formData.bondType }}</span>
          </div>
          <div class="info-item">
            <label>Entry Date</label>
            <span>{{ formData.entryDate }}</span>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="info-section" v-if="formData.documents.length">
        <h2 class="section-title">Documents</h2>
        <div class="documents-list">
          <div 
            v-for="doc in formData.documents" 
            :key="doc.url"
            class="document-item"
          >
            <el-icon><Document /></el-icon>
            <span class="doc-name">{{ doc.name }}</span>
            <span class="doc-time">{{ doc.uploadTime }}</span>
            <el-button 
              type="primary" 
              link 
              @click="downloadDocument(doc)"
            >
              Download
            </el-button>
          </div>
        </div>
      </div>

      <!-- Status History -->
      <div class="info-section">
        <h2 class="section-title">Status History</h2>
        <el-timeline>
          <el-timeline-item
            v-for="(status, index) in statusHistory"
            :key="index"
            :type="status.type"
            :color="status.color"
            :timestamp="status.timestamp"
          >
            <h3>{{ status.title }}</h3>
            <p>{{ status.description }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <div class="actions-wrapper">
          <el-button 
            v-for="action in STATUS_CONFIG[formData.status].actions"
            :key="action.value"
            :type="action.value === 'view' ? 'default' : 'primary'"
            :style="{ color: action.color }"
            @click="handleAction(action.handler)"
          >
            {{ action.label }}
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
import { ArrowLeft, Document } from '@element-plus/icons-vue'
import type { Form3461TableItem } from './types'
import { STATUS_CONFIG } from './types'
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
  status: 'Pending',
  description: '',
  lastUpdated: '',
  documents: []
})

const statusHistory = ref([
  {
    title: 'Form Created',
    description: 'Entry form has been created and saved as draft',
    timestamp: '2024-01-15 10:30:00',
    type: 'info',
    color: '#8C8C8C'
  },
  {
    title: 'Form Submitted',
    description: 'Entry has been submitted to CBP system',
    timestamp: '2024-01-15 14:20:00',
    type: 'primary',
    color: '#1890FF'
  },
  {
    title: 'Under Review',
    description: 'CBP is reviewing the submitted entry',
    timestamp: '2024-01-16 09:15:00',
    type: 'warning',
    color: '#FAAD14'
  }
])

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

const downloadDocument = (doc: { name: string; url: string }) => {
  // TODO: Implement actual download logic
  ElMessage.success(`Downloading ${doc.name}`)
}

const handleAction = (handler: string) => {
  switch (handler) {
    case 'handleSubmitForm':
      router.push(`/customs/form3461/submit/${formData.value.systemId}`)
      break
    case 'handleApproveAndComplete':
      router.push(`/customs/form3461/approve/${formData.value.systemId}`)
      break
    case 'handleRejectForm':
      router.push(`/customs/form3461/reject/${formData.value.systemId}`)
      break
    case 'handleCancelForm':
      router.push(`/customs/form3461/cancel/${formData.value.systemId}`)
      break
    case 'handleViewFailureReason':
      router.push(`/customs/form3461/failure/${formData.value.systemId}`)
      break
    case 'handleEditForm':
      router.push(`/customs/form3461/edit/${formData.value.systemId}`)
      break
  }
}
</script>

<style lang="scss" scoped>
.form3461-view-page {
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-darker);

  .page-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

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

    .status-section {
      display: flex;
      align-items: center;
      gap: 8px;

      .status-label {
        color: var(--text-secondary);
        font-size: 14px;
      }

      .status-value {
        font-size: 14px;
        font-weight: 500;
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

      .documents-list {
        .document-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .el-icon {
            font-size: 20px;
            color: var(--text-secondary);
          }

          .doc-name {
            flex: 1;
            color: var(--text-primary);
            font-size: 14px;
          }

          .doc-time {
            color: var(--text-secondary);
            font-size: 12px;
          }
        }
      }

      :deep(.el-timeline) {
        padding-left: 16px;

        .el-timeline-item__node {
          background: var(--bg-dark);
          border: 2px solid currentColor;
        }

        .el-timeline-item__wrapper {
          padding-left: 20px;
        }

        .el-timeline-item__timestamp {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .el-timeline-item__content {
          h3 {
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 500;
            margin: 0 0 4px;
          }

          p {
            color: var(--text-secondary);
            font-size: 12px;
            margin: 0;
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