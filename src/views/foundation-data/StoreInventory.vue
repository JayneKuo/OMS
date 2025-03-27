<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Store Inventory Management</h1>
        <p class="subtitle">Monitor and manage inventory across different sales channels</p>
      </div>
      <div class="header-actions">
        <el-button-group>
          <el-button type="primary" @click="handleSync" :loading="syncLoading">
            <el-icon><Connection /></el-icon>
            Sync Now
          </el-button>
          <el-button type="primary" @click="handleRefresh" :loading="loading">
            <el-icon><Refresh /></el-icon>
            Refresh
          </el-button>
        </el-button-group>
        <el-button type="success" @click="handleExport" :loading="exportLoading">
          <el-icon><Download /></el-icon>
          Export
        </el-button>
      </div>
    </div>

    <!-- Sync Progress -->
    <el-card v-if="syncInfo.isSyncing" class="sync-section">
      <div class="sync-header">
        <div class="sync-title">
          <el-icon><Loading /></el-icon>
          <span>Synchronizing Inventory Data</span>
        </div>
        <span class="sync-time">Started at: {{ formatDate(syncInfo.startTime) }}</span>
      </div>
      <div class="sync-progress">
        <div class="channel-progress" v-for="channel in syncInfo.channels" :key="channel.name">
          <div class="progress-header">
            <span class="channel-name">{{ channel.name }}</span>
            <span class="progress-percentage">{{ channel.progress }}%</span>
          </div>
          <el-progress :percentage="channel.progress" :status="getProgressStatus(channel.progress)" />
        </div>
      </div>
    </el-card>

    <!-- Filter Section -->
    <el-card class="filter-section">
      <el-form :inline="true" :model="filterForm" @keyup.enter="handleSearch">
        <el-form-item label="SKU">
          <el-input v-model="filterForm.sku" placeholder="Search by SKU" clearable />
        </el-form-item>
        <el-form-item label="Channel">
          <el-select v-model="filterForm.channel" placeholder="Select channel" clearable>
            <el-option label="Amazon" value="amazon" />
            <el-option label="Shopify" value="shopify" />
            <el-option label="Walmart" value="walmart" />
          </el-select>
        </el-form-item>
        <el-form-item label="Store">
          <el-select v-model="filterForm.store" placeholder="Select store" clearable>
            <el-option 
              v-for="store in storeOptions" 
              :key="store.value" 
              :label="store.label" 
              :value="store.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="filterForm.status" placeholder="Select status" clearable>
            <el-option label="In Stock" value="sufficient" />
            <el-option label="Low Stock" value="warning" />
            <el-option label="Out of Stock" value="insufficient" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              Search
            </el-button>
            <el-button @click="handleReset">
              <el-icon><RefreshRight /></el-icon>
              Reset
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Table Section -->
    <el-card class="table-section" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>Inventory List</span>
          <div class="header-summary">
            <el-tag type="info">Total Items: {{ total }}</el-tag>
            <el-tag type="success">In Stock: {{ stockSummary.inStock }}</el-tag>
            <el-tag type="warning">Low Stock: {{ stockSummary.lowStock }}</el-tag>
            <el-tag type="danger">Out of Stock: {{ stockSummary.outOfStock }}</el-tag>
          </div>
        </div>
      </template>

      <el-table 
        :data="inventoryData" 
        border 
        style="width: 100%"
        @sort-change="handleSortChange"
        highlight-current-row
      >
        <el-table-column prop="sku" label="SKU" sortable="custom" width="150" />
        <el-table-column prop="productName" label="Product Name" min-width="200">
          <template #default="{ row }">
            <div class="product-info">
              <el-image 
                :src="row.imageUrl" 
                :preview-src-list="[row.imageUrl]"
                fit="contain"
                class="product-image"
              >
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <span>{{ row.productName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="channel" label="Channel" width="120" />
        <el-table-column prop="store" label="Store" width="150" />
        <el-table-column prop="available" label="Available" sortable="custom" width="120">
          <template #default="{ row }">
            <el-tag 
              :type="getInventoryTagType(row.available)" 
              effect="plain"
            >
              {{ row.available }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reserved" label="Reserved" width="120" />
        <el-table-column prop="inTransit" label="In Transit" width="120" />
        <el-table-column prop="total" label="Total" sortable="custom" width="120" />
        <el-table-column prop="updateTime" label="Last Updated" sortable="custom" width="180">
          <template #default="{ row }">
            {{ formatDate(row.updateTime) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Refresh, 
  Download, 
  RefreshRight,
  Connection,
  Loading,
  Picture 
} from '@element-plus/icons-vue'

// Loading states
const loading = ref(false)
const syncLoading = ref(false)
const exportLoading = ref(false)

// Sync information
const syncInfo = reactive({
  isSyncing: false,
  startTime: '',
  channels: [
    { name: 'Amazon', progress: 0 },
    { name: 'Shopify', progress: 0 },
    { name: 'Walmart', progress: 0 }
  ]
})

// Filter form
const filterForm = reactive({
  sku: '',
  channel: '',
  store: '',
  status: ''
})

// Store options
const storeOptions = computed(() => {
  if (filterForm.channel === 'amazon') {
    return [
      { label: 'Amazon US', value: 'amazon-us' },
      { label: 'Amazon UK', value: 'amazon-uk' },
      { label: 'Amazon DE', value: 'amazon-de' }
    ]
  } else if (filterForm.channel === 'shopify') {
    return [
      { label: 'Main Store', value: 'shopify-main' },
      { label: 'Sub Store', value: 'shopify-sub' }
    ]
  } else if (filterForm.channel === 'walmart') {
    return [
      { label: 'Walmart US', value: 'walmart-us' }
    ]
  }
  return []
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// Sort parameters
const sortParams = reactive({
  prop: '',
  order: ''
})

// Mock data
const inventoryData = ref([
  {
    sku: 'SKU001',
    productName: 'Sample Product 1',
    imageUrl: 'https://placeholder.com/150',
    channel: 'Amazon',
    store: 'Amazon US',
    available: 100,
    reserved: 10,
    inTransit: 20,
    total: 130,
    updateTime: new Date().toISOString()
  }
])

// Stock summary
const stockSummary = computed(() => {
  return {
    inStock: inventoryData.value.filter(item => item.available > 10).length,
    lowStock: inventoryData.value.filter(item => item.available > 0 && item.available <= 10).length,
    outOfStock: inventoryData.value.filter(item => item.available <= 0).length
  }
})

// Get inventory tag type
const getInventoryTagType = (available: number) => {
  if (available <= 0) return 'danger'
  if (available <= 10) return 'warning'
  return 'success'
}

// Get progress status
const getProgressStatus = (progress: number) => {
  if (progress >= 100) return 'success'
  if (progress > 0) return 'exception'
  return ''
}

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// Handle sync
const handleSync = async () => {
  try {
    await ElMessageBox.confirm(
      'This will synchronize inventory data from all channels. Continue?',
      'Sync Confirmation',
      {
        confirmButtonText: 'Sync',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    syncLoading.value = true
    syncInfo.isSyncing = true
    syncInfo.startTime = new Date().toISOString()
    
    // Mock sync progress
    const updateProgress = () => {
      syncInfo.channels.forEach(channel => {
        if (channel.progress < 100) {
          channel.progress += Math.floor(Math.random() * 20)
          if (channel.progress > 100) channel.progress = 100
        }
      })
      
      if (syncInfo.channels.every(channel => channel.progress === 100)) {
        clearInterval(progressInterval)
        syncInfo.isSyncing = false
        syncLoading.value = false
        ElMessage.success('Sync completed successfully')
        handleSearch()
      }
    }
    
    const progressInterval = setInterval(updateProgress, 1000)
  } catch {
    // User cancelled sync
  }
}

// Handle search
const handleSearch = async () => {
  loading.value = true
  try {
    // TODO: Implement actual search logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Data loaded successfully')
  } catch (error) {
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// Handle reset
const handleReset = () => {
  filterForm.sku = ''
  filterForm.channel = ''
  filterForm.store = ''
  filterForm.status = ''
  handleSearch()
}

// Handle refresh
const handleRefresh = () => {
  handleSearch()
}

// Handle export
const handleExport = async () => {
  exportLoading.value = true
  try {
    // TODO: Implement export logic
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('Export completed successfully')
  } catch (error) {
    ElMessage.error('Failed to export data')
  } finally {
    exportLoading.value = false
  }
}

// Handle sort
const handleSortChange = ({ prop, order }: { prop: string, order: string }) => {
  sortParams.prop = prop
  sortParams.order = order
  handleSearch()
}

// Handle pagination
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  background: var(--el-bg-color-page);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .header-content {
    h1 {
      font-size: 24px;
      font-weight: 500;
      margin: 0;
      color: var(--el-text-color-primary);
    }
    
    .subtitle {
      margin: 8px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.sync-section {
  margin-bottom: 24px;

  .sync-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .sync-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      
      .el-icon {
        animation: rotating 2s linear infinite;
      }
    }

    .sync-time {
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }

  .sync-progress {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .channel-progress {
      .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .channel-name {
          font-weight: 500;
        }

        .progress-percentage {
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}

.filter-section {
  margin-bottom: 24px;
}

.table-section {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-summary {
      display: flex;
      gap: 12px;
    }
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .product-image {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-fill-color-lighter);
      color: var(--el-text-color-secondary);
    }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 