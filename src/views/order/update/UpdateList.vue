<!-- Update Records List -->
<template>
  <div class="update-list">
    <!-- Search Form -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="Order No.">
          <el-input 
            v-model="searchForm.orderNo" 
            placeholder="Fuzzy or exact search" 
            clearable 
          />
        </el-form-item>
        <el-form-item label="Source Order No.">
          <el-input 
            v-model="searchForm.sourceOrderNo" 
            placeholder="Fuzzy or exact search" 
            clearable 
          />
        </el-form-item>
        <el-form-item label="Dispatch Nos.">
          <el-input 
            v-model="searchForm.dispatchNos" 
            placeholder="Fuzzy or exact search" 
            clearable 
          />
        </el-form-item>
        <el-form-item label="Channel">
          <el-select 
            v-model="searchForm.channels" 
            placeholder="Select channels" 
            multiple 
            clearable
          >
            <el-option 
              v-for="(label, value) in channelLabels" 
              :key="value" 
              :label="label" 
              :value="value" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Update Types">
          <el-select 
            v-model="searchForm.updateTypes" 
            placeholder="Select update types" 
            multiple 
            clearable
          >
            <el-option 
              v-for="(label, type) in updateTypeLabels" 
              :key="type" 
              :label="label" 
              :value="type" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Failure Types">
          <el-select 
            v-model="searchForm.failureTypes" 
            placeholder="Select failure types" 
            multiple 
            clearable
          >
            <el-option 
              v-for="(label, type) in failureTypeLabels" 
              :key="type" 
              :label="label" 
              :value="type" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Failure Time">
          <el-date-picker
            v-model="searchForm.failureTimeRange"
            type="daterange"
            range-separator="to"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="YYYY-MM-DD"
            :default-time="['00:00:00', '23:59:59']"
            :shortcuts="dateShortcuts"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">Search</el-button>
          <el-button @click="handleReset">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Update Records Table -->
    <el-table
      v-loading="loading"
      :data="updateList"
      border
      stripe
      class="update-table"
    >
      <el-table-column prop="orderNo" label="Order No." width="150" />
      <el-table-column prop="sourceOrderNo" label="Source Order No." width="150" />
      <el-table-column label="Channel" width="120">
        <template #default="{ row }">
          <el-tag :type="getChannelTagType(row.channel)">
            {{ channelLabels[row.channel] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Order Status" width="120">
        <template #default="{ row }">
          <order-status-tag :status="row.orderStatus" />
        </template>
      </el-table-column>
      <el-table-column label="Update Type" width="150">
        <template #default="{ row }">
          <el-tag>{{ updateTypeLabels[row.updateType] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="failureDescription" label="Failure Description" min-width="250" />
      <el-table-column label="Dispatch Nos." width="150">
        <template #default="{ row }">
          <span>{{ row.content.dispatchNos?.join(', ') || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="suggestion" label="Suggestion" width="200" />
      <el-table-column prop="failureTime" label="Failure Time" width="150" />
      <el-table-column label="Action" width="200" fixed="right">
        <template #default="{ row }">
          <!-- 单独派单按钮 -->
          <el-button 
            v-if="row.failureType === FailureType.NewSKUFailed"
            type="primary" 
            link
            @click="handleDispatchSeparately(row)"
          >
            Dispatch Separately
          </el-button>

          <!-- 重新派单按钮 -->
          <el-button 
            v-if="showRedispatchButton(row)"
            type="primary" 
            link
            @click="handleRedispatch(row)"
          >
            Redispatch
          </el-button>

          <!-- 创建退单按钮 -->
          <el-button 
            v-if="showReturnButton(row)"
            type="warning" 
            link
            @click="handleCreateReturn(row)"
          >
            Create Return
          </el-button>
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

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailVisible"
      title="Update Details"
      width="60%"
      destroy-on-close
    >
      <template v-if="currentDetail">
        <div class="detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Order No">
              {{ currentDetail.orderNo }}
            </el-descriptions-item>
            <el-descriptions-item label="Channel Order No">
              {{ currentDetail.channelOrderNo }}
            </el-descriptions-item>
            <el-descriptions-item label="Channel">
              {{ currentDetail.channel }}
            </el-descriptions-item>
            <el-descriptions-item label="Order Status">
              <order-status-tag :status="currentDetail.orderStatus" />
            </el-descriptions-item>
            <el-descriptions-item label="Update Type">
              <el-tag :type="getUpdateTypeTag(currentDetail.updateType)">
                {{ getUpdateTypeLabel(currentDetail.updateType) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Update Status">
              <el-tag :type="getUpdateStatusTag(currentDetail.updateStatus)">
                {{ getUpdateStatusLabel(currentDetail.updateStatus) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Update Reason">
              {{ currentDetail.reason }}
            </el-descriptions-item>
            <el-descriptions-item label="Update Time">
              {{ formatTime(currentDetail.updateTime) }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="currentDetail.updateStatus === UpdateStatus.Failed"
              label="Error Reason"
              :span="2"
            >
              {{ currentDetail.errorReason }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="currentDetail.retryCount && currentDetail.retryCount > 0"
              label="Retry Count"
            >
              {{ currentDetail.retryCount }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="currentDetail.nextRetryTime"
              label="Next Retry Time"
            >
              {{ formatTime(currentDetail.nextRetryTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="Update Content" :span="2">
              <div class="update-content">
                <div class="content-before">
                  <h4>Before:</h4>
                  <pre>{{ formatContent(currentDetail.content.before) }}</pre>
                </div>
                <div class="content-after">
                  <h4>After:</h4>
                  <pre>{{ formatContent(currentDetail.content.after) }}</pre>
                </div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item
              v-if="currentDetail.remarks"
              label="Remarks"
              :span="2"
            >
              {{ currentDetail.remarks }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import OrderStatusTag from '@/components/OrderStatusTag.vue'
import { UpdateType, UpdateStatus, FailureType } from '@/types/orderUpdate'
import type { OrderUpdate } from '@/types/orderUpdate'
import { OrderStatus } from '@/types/order'
import { mockUpdateRecords } from '@/mock/orderUpdate'

const router = useRouter()

// Search form
const searchForm = ref({
  orderNo: '',
  sourceOrderNo: '',
  dispatchNos: '',
  channels: [],
  updateTypes: [],
  failureTypes: [],
  failureTimeRange: []
})

// Filtered data
const filteredData = computed(() => {
  let result = [...mockUpdateRecords]
  
  if (searchForm.value.orderNo) {
    result = result.filter(item => 
      item.orderNo.toLowerCase().includes(searchForm.value.orderNo.toLowerCase())
    )
  }
  
  if (searchForm.value.sourceOrderNo) {
    result = result.filter(item => 
      item.sourceOrderNo.toLowerCase().includes(searchForm.value.sourceOrderNo.toLowerCase())
    )
  }
  
  if (searchForm.value.dispatchNos) {
    result = result.filter(item => 
      item.content.dispatchNos?.some(no => 
        no.toLowerCase().includes(searchForm.value.dispatchNos.toLowerCase())
      )
    )
  }
  
  if (searchForm.value.channels.length) {
    result = result.filter(item => 
      searchForm.value.channels.includes(item.channel)
    )
  }
  
  if (searchForm.value.updateTypes.length) {
    result = result.filter(item => 
      searchForm.value.updateTypes.includes(item.updateType)
    )
  }
  
  if (searchForm.value.failureTypes.length) {
    result = result.filter(item => 
      searchForm.value.failureTypes.includes(item.failureType)
    )
  }
  
  if (searchForm.value.failureTimeRange?.length === 2) {
    const startTime = new Date(searchForm.value.failureTimeRange[0]).getTime()
    const endTime = new Date(searchForm.value.failureTimeRange[1]).getTime()
    result = result.filter(item => {
      const time = new Date(item.failureTime).getTime()
      return time >= startTime && time <= endTime
    })
  }
  
  return result
})

// Paginated data
const currentPage = ref(1)
const pageSize = ref(20)
const total = computed(() => filteredData.value.length)
const updateList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// Channel options
const channelOptions = [
  { value: 'AMAZON', label: 'Amazon' },
  { value: 'SHOPIFY', label: 'Shopify' },
  { value: 'WALMART', label: 'Walmart' },
  { value: 'EBAY', label: 'eBay' }
]

// Update type options
const updateTypeOptions = [
  { value: UpdateType.Quantity, label: 'Quantity' },
  { value: UpdateType.Price, label: 'Price' },
  { value: UpdateType.SKU, label: 'SKU' },
  { value: UpdateType.Address, label: 'Address' },
  { value: UpdateType.Shipping, label: 'Shipping' },
  { value: UpdateType.Payment, label: 'Payment' },
  { value: UpdateType.Split, label: 'Split' },
  { value: UpdateType.Merge, label: 'Merge' },
  { value: UpdateType.Gift, label: 'Gift' }
]

// List data
const loading = ref(false)
const currentDetail = ref<OrderUpdate | null>(null)

// 添加detailVisible ref
const detailVisible = ref(false)

// 修改 orderStatusOptions
const orderStatusOptions = [
  { value: OrderStatus.Pending, label: 'Pending' },
  { value: OrderStatus.Processing, label: 'Processing' },
  { value: OrderStatus.Allocated, label: 'Allocated' },
  { value: OrderStatus.Shipped, label: 'Shipped' },
  { value: OrderStatus.Delivered, label: 'Delivered' },
  { value: OrderStatus.Cancelled, label: 'Cancelled' },
  { value: OrderStatus.Exception, label: 'Exception' },
  { value: OrderStatus.UpdateFailed, label: 'Update Failed' }
];

// 添加mockDelay函数
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000))

// Get update type tag
const getUpdateTypeTag = (type: UpdateType): string => {
  const tagMap = {
    [UpdateType.Quantity]: 'primary',
    [UpdateType.Address]: 'success',
    [UpdateType.SKU]: 'warning',
    [UpdateType.Price]: 'danger',
    [UpdateType.Shipping]: 'info',
    [UpdateType.Payment]: 'info',
    [UpdateType.Split]: 'warning',
    [UpdateType.Merge]: 'warning',
    [UpdateType.Gift]: 'success',
    [UpdateType.Other]: ''
  };
  return tagMap[type] || '';
}

// Get update type label
const getUpdateTypeLabel = (type: UpdateType): string => {
  const map = {
    [UpdateType.Quantity]: 'Quantity',
    [UpdateType.Address]: 'Address'
  }
  return map[type]
}

// Get update status tag
const getUpdateStatusTag = (status: UpdateStatus) => {
  const tagMap: Record<UpdateStatus, string> = {
    [UpdateStatus.Pending]: 'info',
    [UpdateStatus.Processing]: 'warning',
    [UpdateStatus.Success]: 'success',
    [UpdateStatus.Failed]: 'danger',
    [UpdateStatus.Canceled]: ''
  }
  return tagMap[status]
}

// Get update status label
const getUpdateStatusLabel = (status: UpdateStatus) => {
  const labelMap: Record<UpdateStatus, string> = {
    [UpdateStatus.Pending]: 'Pending',
    [UpdateStatus.Processing]: 'Processing',
    [UpdateStatus.Success]: 'Success',
    [UpdateStatus.Failed]: 'Failed',
    [UpdateStatus.Canceled]: 'Canceled'
  }
  return labelMap[status]
}

// Format update content
const formatContent = (content: any) => {
  if (typeof content === 'object') {
    return JSON.stringify(content, null, 2)
  }
  return content
}

// Format time
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

// Truncate text
const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Search
const handleSearch = () => {
  currentPage.value = 1
}

// Reset search
const handleReset = () => {
  searchForm.value = {
    orderNo: '',
    sourceOrderNo: '',
    dispatchNos: '',
    channels: [],
    updateTypes: [],
    failureTypes: [],
    failureTimeRange: []
  }
  currentPage.value = 1
}

// Pagination
const handleSizeChange = (size: number) => {
  pageSize.value = size
  handleSearch()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  handleSearch()
}

// View order detail
const handleOrderDetail = (row: OrderUpdate) => {
  router.push(`/order/sales/${row.orderId}`)
}

// Retry update
const handleRetry = async (row: OrderUpdate) => {
  try {
    await mockDelay()
    ElMessage.success('Retry successful')
    handleSearch()
  } catch (error) {
    console.error('Retry failed:', error)
    ElMessage.error('Retry failed')
  }
}

// Cancel update
const handleCancel = async (row: OrderUpdate) => {
  try {
    await mockDelay()
    ElMessage.success('Cancel successful')
    handleSearch()
  } catch (error) {
    console.error('Cancel failed:', error)
    ElMessage.error('Cancel failed')
  }
}

// View detail
const handleViewDetail = (row: OrderUpdate) => {
  currentDetail.value = row
  detailVisible.value = true
}

// Helper functions for new tags
const getSourceTypeTag = (source: string) => {
  const map: Record<string, string> = {
    'MANUAL': '',
    'API': 'success',
    'SYSTEM': 'info',
    'BATCH': 'warning',
    'CUSTOMER': 'primary'
  }
  return map[source] || ''
}

const getPriorityTypeTag = (priority: string) => {
  const map: Record<string, string> = {
    'HIGH': 'danger',
    'NORMAL': '',
    'LOW': 'info'
  }
  return map[priority] || ''
}

// Action handlers
const handleCreateReturn = (row: OrderUpdate) => {
  router.push({
    path: '/return/create',
    query: { 
      orderId: row.orderId,
      dispatchNos: row.content.dispatchNos?.join(',')
    }
  })
}

const handleDispatchSeparately = async (row: OrderUpdate) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to dispatch the new items separately?',
      'Dispatch Separately'
    )
    ElMessage.success('Dispatch created successfully')
  } catch {
    // User cancelled operation
  }
}

const handleRedispatch = async (row: OrderUpdate) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to redispatch the entire order with the latest updates?',
      'Redispatch'
    )
    ElMessage.success('Order redispatched successfully')
  } catch {
    // User cancelled operation
  }
}

// Update type labels
const updateTypeLabels = {
  [UpdateType.QuantityIncrease]: 'Quantity Increase',
  [UpdateType.QuantityDecrease]: 'Quantity Decrease',
  [UpdateType.NewLineItem]: 'New Line Item',
  [UpdateType.RemoveLineItem]: 'Remove Line Item',
  [UpdateType.AddressChange]: 'Address Change',
  [UpdateType.Exchange]: 'Exchange'
}

// Failure type labels
const failureTypeLabels = {
  [FailureType.WMSProcessing]: 'WMS Processing',
  [FailureType.ShippedQuantityDecrease]: 'Shipped Quantity Decrease',
  [FailureType.NewSKUFailed]: 'New SKU Failed',
  [FailureType.QuantityIncreaseFailed]: 'Quantity Increase Failed',
  [FailureType.AddressChangeDispatchIssued]: 'Address Change (Dispatch Issued)',
  [FailureType.AddressChangeShipped]: 'Address Change (Shipped)',
  [FailureType.ShippedItemModification]: 'Shipped Item Modification'
}

// Date shortcuts
const dateShortcuts = [
  {
    text: 'Last 7 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last 30 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: 'Last 90 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// Disabled date
const disabledDate = (time: Date) => {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setTime(sixMonthsAgo.getTime() - 3600 * 1000 * 24 * 180)
  return time.getTime() < sixMonthsAgo.getTime()
}

// Button visibility logic
const showRedispatchButton = (row: OrderUpdate) => {
  return [
    FailureType.WMSProcessing,
    FailureType.NewSKUFailed,
    FailureType.QuantityIncreaseFailed,
    FailureType.AddressChangeDispatchIssued
  ].includes(row.failureType)
}

const showReturnButton = (row: OrderUpdate) => {
  return [
    FailureType.ShippedQuantityDecrease,
    FailureType.ShippedItemModification
  ].includes(row.failureType)
}

// Channel labels and configurations
const channelLabels = {
  'AMAZON': 'Amazon',
  'SHOPIFY': 'Shopify',
  'WALMART': 'Walmart',
  'EBAY': 'eBay',
  'WAYFAIR': 'Wayfair',
  'HOMEDEPOT': 'Home Depot',
  'LOWES': 'Lowes',
  'TARGET': 'Target',
  'COSTCO': 'Costco',
  'SAMSCLUB': 'Sam\'s Club'
}

const getChannelTagType = (channel: string) => {
  const typeMap: Record<string, string> = {
    'AMAZON': 'warning',
    'SHOPIFY': 'success',
    'WALMART': 'primary',
    'EBAY': '',
    'WAYFAIR': 'info',
    'HOMEDEPOT': 'danger',
    'LOWES': 'info',
    'TARGET': 'danger',
    'COSTCO': 'primary',
    'SAMSCLUB': 'warning'
  }
  return typeMap[channel] || ''
}

// Initialize
onMounted(() => {
  console.log('组件挂载，开始加载数据');
  handleSearch();
});
</script>

<style lang="scss" scoped>
.update-list {
  padding: 20px;

  .search-form {
    margin-bottom: 20px;
    padding: 20px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
  }

  .update-table {
    margin-bottom: 20px;

    .update-content-cell {
      .content-diff {
        .diff-item {
          .label {
            display: block;
            color: var(--el-text-color-regular);
            font-size: 12px;
            margin-bottom: 4px;
          }

          .value-change {
            display: flex;
            align-items: center;
            gap: 8px;

            .before {
              color: var(--el-text-color-secondary);
            }

            .after {
              color: var(--el-text-color-primary);
              font-weight: 500;
            }

            .arrow {
              color: var(--el-text-color-secondary);
            }
          }

          .sub-info {
            margin-top: 4px;
            color: var(--el-text-color-secondary);
            font-size: 12px;
            
            span + span {
              margin-left: 8px;
            }
          }
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
  }

  .error-reason {
    color: var(--el-color-danger);
  }

  .detail-content {
    .update-content {
      display: flex;
      gap: 20px;
      margin-top: 8px;

      .content-before,
      .content-after {
        flex: 1;
        padding: 12px;
        background-color: var(--el-fill-color-light);
        border-radius: 4px;

        h4 {
          margin: 0 0 8px;
          color: var(--el-text-color-regular);
          font-size: 14px;
        }

        pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
          font-family: var(--el-font-family);
          color: var(--el-text-color-primary);
        }
      }
    }
  }
}
</style> 