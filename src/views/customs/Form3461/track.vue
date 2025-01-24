<template>
  <div class="track-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Track Form 3461</h1>
        <p class="subtitle">Track the status and progress of your Form 3461 entry</p>
      </div>
      <el-button @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
        Back to List
      </el-button>
    </div>

    <div class="track-content">
      <div class="entry-info">
        <h2>Entry Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Entry No</label>
            <span>{{ entryData?.entryNo }}</span>
          </div>
          <div class="info-item">
            <label>Importer No</label>
            <span>{{ entryData?.importerNo }}</span>
          </div>
          <div class="info-item">
            <label>Entry Type</label>
            <span>{{ entryData?.entryType }}</span>
          </div>
          <div class="info-item">
            <label>Port of Entry</label>
            <span>{{ entryData?.portOfEntry }}</span>
          </div>
          <div class="info-item">
            <label>Bill of Lading</label>
            <span>{{ entryData?.billOfLading }}</span>
          </div>
          <div class="info-item">
            <label>Entry Date</label>
            <span>{{ entryData?.entryDate }}</span>
          </div>
        </div>
      </div>

      <div class="status-timeline">
        <h2>Status Timeline</h2>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useTableData } from './composables/useTableData'
import type { Form3461TableItem } from './types'
import { STATUS_CONFIG } from './types'

const route = useRoute()
const router = useRouter()
const { tableData } = useTableData()

const entryData = ref<Form3461TableItem | null>(null)
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
  entryData.value = tableData.value.find(item => item.systemId === id) || null
})

const goBack = () => {
  router.push('/customs/form3461')
}
</script>

<style lang="scss" scoped>
.track-page {
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-darker);
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

  .back-btn {
    height: 40px;
    padding: 0 24px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.track-content {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr;

  .entry-info, .status-timeline {
    background: var(--bg-dark);
    border-radius: 8px;
    padding: 24px;

    h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 20px;
      color: var(--text-primary);
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

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
</style> 