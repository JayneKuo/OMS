<template>
  <div class="return-page">
    <!-- Search Form -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="Return Order No.">
          <el-input
            v-model="searchForm.returnOrderNo"
            placeholder="Enter return order number"
            clearable
            :prefix-icon="Search"
          />
        </el-form-item>
        <el-form-item label="Sales Order No.">
          <el-input
            v-model="searchForm.originalOrderNo"
            placeholder="Enter sales order number"
            clearable
            :prefix-icon="Document"
          />
        </el-form-item>
        <el-form-item label="Channel Order No.">
          <el-input
            v-model="searchForm.channelOrderNo"
            placeholder="Enter channel order number"
            clearable
            :prefix-icon="Document"
          />
        </el-form-item>
        <el-form-item label="Return Type">
          <el-select
            v-model="searchForm.returnType"
            placeholder="Select type"
            clearable
          >
            <el-option label="Refund" :value="ReturnType.Refund" />
            <el-option label="Exchange" :value="ReturnType.Exchange" />
          </el-select>
        </el-form-item>
        <el-form-item label="Channel">
          <el-select
            v-model="searchForm.channel"
            placeholder="Select channel"
            clearable
          >
            <el-option
              v-for="channel in channelOptions"
              :key="channel.value"
              :label="channel.label"
              :value="channel.value"
            >
              <div class="channel-option">
                <el-tag
                  :type="getChannelTagType(channel.value)"
                  size="small"
                >
                  {{ channel.label }}
                </el-tag>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Customer">
          <el-input
            v-model="searchForm.customerName"
            placeholder="Enter customer name"
            clearable
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="Status">
          <el-select
            v-model="searchForm.status"
            placeholder="Select status"
            clearable
            multiple
            collapse-tags
          >
            <el-option
              v-for="status in statusList"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            >
              <div class="status-option">
                <el-tag
                  :type="getStatusType(status.value)"
                  size="small"
                >
                  {{ status.label }}
                </el-tag>
                <span class="status-count" v-if="status.count">
                  ({{ status.count }})
                </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Date Range">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="to"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="YYYY-MM-DD"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            Search
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            Reset
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Status Filter -->
    <div class="status-filter">
      <el-radio-group v-model="activeStatus" @change="handleStatusFilterChange">
        <el-radio-button label="">All</el-radio-button>
        <el-radio-button
          v-for="status in statusList"
          :key="status.value"
          :label="status.value"
        >
          {{ status.label }}
          <el-badge v-if="status.count" :value="status.count" class="status-count" />
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="left">
        <el-button type="primary" @click="handleCreate">New Return Order</el-button>
        <el-button :disabled="!selectedRows.length" @click="handleBatchExport">Batch Export</el-button>
        <el-button :disabled="!selectedRows.length" @click="handleBatchSync">Batch Sync</el-button>
      </div>
      <div class="right">
        <el-button type="primary" plain @click="handleExport">Export</el-button>
      </div>
    </div>

    <!-- Table Layout -->
      <el-table
        v-loading="loading"
      :data="returnOrders"
        style="width: 100%"
      border
      stripe
        @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection" width="55" fixed="left" />
      
      <!-- Channel -->
      <el-table-column label="Channel" min-width="120" fixed="left">
          <template #default="{ row }">
          <el-tag :type="getChannelTagType(row.channel.type)" size="small">
            {{ row.channel.storeName }}
          </el-tag>
          </template>
        </el-table-column>

      <!-- Channel Order No. -->
      <el-table-column 
        prop="channel.platformOrderNo" 
        label="Channel Order No." 
        min-width="150"
        show-overflow-tooltip
      />

      <!-- Channel Return Order No. -->
      <el-table-column 
        prop="channel.returnOrderNo" 
        label="Channel Return Order No." 
        min-width="180"
        show-overflow-tooltip
      />

      <!-- Sales Order No. -->
        <el-table-column 
          prop="originalOrderNo" 
        label="Sales Order No." 
        min-width="150"
        show-overflow-tooltip
      />

      <!-- Return Order No. -->
      <el-table-column 
        prop="returnOrderNo" 
        label="Return Order No." 
          min-width="150"
        show-overflow-tooltip
        />

      <!-- Return Type -->
      <el-table-column 
        prop="returnType" 
        label="Return Type" 
        min-width="120"
      >
          <template #default="{ row }">
          <el-tag size="small" :type="row.returnType === ReturnType.Refund ? 'warning' : 'success'">
              {{ row.returnType }}
            </el-tag>
          </template>
        </el-table-column>

      <!-- Status -->
      <el-table-column 
        prop="status" 
        label="Status" 
        min-width="120"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- RMA No. -->
      <el-table-column 
        prop="rma" 
        label="RMA No." 
        min-width="120"
        show-overflow-tooltip
      />

      <!-- RMS Status -->
      <el-table-column 
        prop="systemMapping.rms.status" 
        label="RMS Status" 
        min-width="120"
      >
          <template #default="{ row }">
          <el-tag size="small" type="info">
            {{ row.systemMapping?.rms?.status || '-' }}
            </el-tag>
          </template>
        </el-table-column>

      <!-- Warehouse -->
      <el-table-column 
        prop="facilityId" 
        label="Warehouse" 
        min-width="120"
        show-overflow-tooltip
      />

      <!-- Carrier -->
      <el-table-column 
        prop="shipment.carrier" 
        label="Carrier" 
        min-width="100"
        show-overflow-tooltip
      />

      <!-- Tracking No. -->
      <el-table-column 
        prop="shipment.trackingNumber" 
        label="Tracking No." 
        min-width="150"
        show-overflow-tooltip
      />

      <!-- ETA -->
      <el-table-column 
        prop="shipment.eta" 
        label="ETA" 
        min-width="150"
      >
        <template #default="{ row }">
          {{ row.shipment?.eta ? formatDateTime(row.shipment.eta) : '-' }}
        </template>
      </el-table-column>

      <!-- Create Time -->
      <el-table-column 
        prop="createTime" 
        label="Create Time" 
        min-width="150"
        show-overflow-tooltip
      >
          <template #default="{ row }">
          {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>

      <!-- Actions -->
      <el-table-column 
        label="Actions" 
        width="150" 
        fixed="right"
      >
          <template #default="{ row }">
          <el-space>
            <el-button
              v-for="button in getActionButtons(row)"
              :key="button.action"
              :type="button.buttonType"
              size="small"
              :icon="button.icon"
              :disabled="button.disabled"
              @click="handleAction(button.action, row)"
            >
              {{ button.label }}
            </el-button>
          </el-space>
          </template>
        </el-table-column>
      </el-table>

    <!-- Pagination -->
    <div class="pagination">
        <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    <!-- System Mapping Drawer -->
    <el-drawer
      v-model="showMapping"
      title="System Mapping"
      size="500px"
    >
      <template v-if="selectedOrder">
        <el-descriptions :column="1" border>
          <!-- RMS Mapping -->
          <el-descriptions-item label="RMS Status">
            {{ selectedOrder.systemMapping?.rms?.status || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="RMA No.">
            {{ selectedOrder.systemMapping?.rms?.rmaNo || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="Facility ID">
            {{ selectedOrder.systemMapping?.rms?.facilityId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="Close Time">
            {{ selectedOrder.systemMapping?.rms?.closedTime ? formatDateTime(selectedOrder.systemMapping.rms.closedTime) : '-' }}
          </el-descriptions-item>

          <!-- WMS Mapping -->
          <el-descriptions-item label="WMS Status">
            {{ selectedOrder.systemMapping?.wms?.status || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="Inbound No.">
            {{ selectedOrder.systemMapping?.wms?.inboundNo || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="Warehouse ID">
            {{ selectedOrder.systemMapping?.wms?.warehouseId || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="DN Number">
            {{ selectedOrder.systemMapping?.wms?.dnNumber || '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="drawer-footer">
          <el-button type="primary" @click="handleSync">Sync Status</el-button>
    </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  ReturnOrderStatus,
  ReturnType,
  ChannelType,
  ReturnAction,
  RETURN_STATUS_CONFIG,
  type SearchParams
} from './types'
import type {
  ReturnOrder,
  ActionButton,
  ButtonType
} from './types'
import { useReturnStatus } from './composables/useReturnStatus'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format'
import { searchReturnOrders } from './mock/data'
import { ElMessage } from 'element-plus'
import {
  Search,
  Document,
  User,
  ArrowDown,
  Plus,
  Download,
  Refresh,
  View,
  Edit,
  Check,
  Close,
  Ship,
  Money,
  Delete,
  Lock,
  Unlock
} from '@element-plus/icons-vue'

// Icons
const icons = {
  Search,
  Document,
  User,
  ArrowDown,
  Plus,
  Download,
  Refresh,
  View,
  Edit,
  Check,
  Close,
  Ship,
  Money,
  Delete,
  Lock,
  Unlock
}

// 状态管理
const { statusOptions, getStatusLabel, getStatusColor, getAvailableActions } = useReturnStatus()

// 状态列表
const statusList = computed(() => {
  return Object.entries(RETURN_STATUS_CONFIG).map(([value, config]) => ({
    value: value as ReturnOrderStatus,
    label: config.label,
    count: returnOrders.value.filter(order => order.status === value).length
  }))
})

// 获取状态类型
const getStatusType = (status: ReturnOrderStatus): string => {
  const config = RETURN_STATUS_CONFIG[status]
  return config?.color || 'info'
}

// 搜索表单
interface SearchForm {
  returnOrderNo: string
  originalOrderNo: string
  channelOrderNo: string
  returnType: ReturnType | null
  channel: ChannelType | null
  status: ReturnOrderStatus[]
  dateRange: [string, string] | null
}

const searchForm = ref<SearchForm>({
  returnOrderNo: '',
  originalOrderNo: '',
  channelOrderNo: '',
  returnType: null,
  channel: null,
  status: [],
  dateRange: null
})

// 表格数据
const returnOrders = ref<ReturnOrder[]>([])
const loading = ref(false)
const selectedRows = ref<ReturnOrder[]>([])
const activeStatus = ref<ReturnOrderStatus | ''>('')

// 分页
const pagination = ref({
  page: 1,
  pageSize: 20
})
const total = ref(0)

// Channel配置
const channelOptions = [
  { label: 'Shopify', value: ChannelType.SHOPIFY },
  { label: 'Amazon', value: ChannelType.AMAZON },
  { label: 'Walmart', value: ChannelType.WALMART },
  { label: 'eBay', value: ChannelType.EBAY },
  { label: 'Lazada', value: ChannelType.LAZADA }
]

// 获取渠道标签类型
const getChannelTagType = (channelType: ChannelType): string => {
  const typeMap: Record<ChannelType, string> = {
    [ChannelType.SHOPIFY]: 'success',
    [ChannelType.AMAZON]: 'warning',
    [ChannelType.WALMART]: 'primary',
    [ChannelType.EBAY]: 'info',
    [ChannelType.LAZADA]: 'danger',
    [ChannelType.MANUAL]: 'default'
  }
  return typeMap[channelType] || 'default'
}

// 获取操作按钮
const getActionButtons = (row: ReturnOrder): ActionButton[] => {
  const availableActions = getAvailableActions(row.status)
  
  return availableActions.map(action => ({
    action,
    label: action,
    buttonType: getActionButtonType(action),
    icon: getActionIcon(action),
    disabled: false
  }))
}

// 获取按钮类型
const getActionButtonType = (action: ReturnAction): ButtonType => {
  const typeMap: Record<ReturnAction, ButtonType> = {
    [ReturnAction.View]: 'default',
    [ReturnAction.Create]: 'primary',
    [ReturnAction.Edit]: 'info',
    [ReturnAction.Approve]: 'success',
    [ReturnAction.Reject]: 'danger',
    [ReturnAction.Ship]: 'primary',
    [ReturnAction.Receive]: 'success',
    [ReturnAction.Refund]: 'warning',
    [ReturnAction.Cancel]: 'danger',
    [ReturnAction.Hold]: 'info',
    [ReturnAction.Release]: 'primary'
  }
  return typeMap[action] || 'default'
}

// 获取操作图标
const getActionIcon = (action: ReturnAction): string => {
  const iconMap: Record<ReturnAction, string> = {
    [ReturnAction.View]: 'View',
    [ReturnAction.Create]: 'Plus',
    [ReturnAction.Edit]: 'Edit',
    [ReturnAction.Approve]: 'Check',
    [ReturnAction.Reject]: 'Close',
    [ReturnAction.Ship]: 'Ship',
    [ReturnAction.Receive]: 'Receive',
    [ReturnAction.Refund]: 'Money',
    [ReturnAction.Cancel]: 'Delete',
    [ReturnAction.Hold]: 'Lock',
    [ReturnAction.Release]: 'Unlock'
  }
  return iconMap[action] || ''
}

// 处理表格选择
const handleSelectionChange = (rows: ReturnOrder[]) => {
  selectedRows.value = rows
}

// 处理搜索
const handleSearch = async () => {
  loading.value = true
  try {
    const searchParams: SearchParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      returnOrderNo: searchForm.value.returnOrderNo || undefined,
      originalOrderNo: searchForm.value.originalOrderNo || undefined,
      channelOrderNo: searchForm.value.channelOrderNo || undefined,
      returnType: searchForm.value.returnType || undefined,
      channel: searchForm.value.channel || undefined,
      status: searchForm.value.status.length > 0 ? searchForm.value.status : undefined,
      dateRange: searchForm.value.dateRange
    }
    const response = await searchReturnOrders(searchParams)
    returnOrders.value = response.data
    total.value = response.total
  } catch (error) {
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// 处理重置
const handleReset = () => {
  searchForm.value = {
    returnOrderNo: '',
    originalOrderNo: '',
    channelOrderNo: '',
    returnType: null,
    channel: null,
    status: [],
    dateRange: null
  }
  handleSearch()
}

// 处理状态筛选变化
const handleStatusFilterChange = (status: ReturnOrderStatus | '') => {
  activeStatus.value = status
  handleSearch()
}

// 处理分页变化
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  handleSearch()
}

const handleCurrentChange = (page: number) => {
  pagination.value.page = page
  handleSearch()
}

// 处理新建退货单
const router = useRouter()
const handleCreate = () => {
  router.push('/return/create')
}

// 处理查看
const handleView = (row: ReturnOrder) => {
  selectedOrder.value = row
  showMapping.value = true
}

// 处理同步
const handleSync = async () => {
  if (!selectedOrder.value) return
  try {
    // TODO: 实现同步逻辑
    ElMessage.success('同步成功')
    await handleSearch()
  } catch (error) {
    ElMessage.error('同步失败')
  }
}

// 处理操作
const handleAction = async (action: ReturnAction, row: ReturnOrder) => {
  selectedOrder.value = row
  
  try {
    switch (action) {
      case ReturnAction.View:
        handleView(row)
        break
      case ReturnAction.Create:
        handleCreate()
        break
      case ReturnAction.Edit:
        // TODO: 实现编辑逻辑
        await handleSearch()
        break
      case ReturnAction.Approve:
        // TODO: 实现审批逻辑
        await handleSearch()
        break
      case ReturnAction.Reject:
        // TODO: 实现拒绝逻辑
        await handleSearch()
        break
      case ReturnAction.Ship:
        // TODO: 实现发货逻辑
        await handleSearch()
        break
      case ReturnAction.Receive:
        // TODO: 实现收货逻辑
        await handleSearch()
        break
      case ReturnAction.Refund:
        // TODO: 实现退款逻辑
        await handleSearch()
      break
      case ReturnAction.Cancel:
        // TODO: 实现取消逻辑
        await handleSearch()
      break
      case ReturnAction.Hold:
        // TODO: 实现暂停逻辑
        await handleSearch()
      break
      case ReturnAction.Release:
        // TODO: 实现释放逻辑
        await handleSearch()
      break
  }
  } catch (error) {
    console.error(`Error handling action ${action}:`, error)
    ElMessage.error(`操作失败: ${action}`)
  }
}

// 系统映射相关
const showMapping = ref(false)
const selectedOrder = ref<ReturnOrder | null>(null)

// 导出相关
const handleExport = () => {
  // TODO: 实现导出逻辑
}

const handleBatchExport = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('Please select records to export')
    return
  }
  // TODO: 实现批量导出逻辑
}

const handleBatchSync = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('Please select records to sync')
    return
  }
  // TODO: 实现批量同步逻辑
}

// Date shortcuts
const dateShortcuts = [
  {
    text: 'Last Week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last Month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: 'Last 3 Months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 初始化
handleSearch()
</script>

<style lang="scss" scoped>
.return-page {
  padding: 20px;

  .search-form {
    background: var(--el-bg-color);
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .status-filter {
    margin-bottom: 20px;

    .status-count {
      margin-left: 4px;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .left {
      display: flex;
      gap: 10px;
    }
  }

  .return-table {
    .order-info,
    .channel-info,
    .customer-info,
    .return-details,
    .shipping-info,
    .system-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .text-secondary {
        color: var(--el-text-color-secondary);
        font-size: 12px;
      }

      .label {
        color: var(--el-text-color-secondary);
        margin-right: 8px;
      }

      .value {
        font-weight: 500;
      }
    }

    .order-info {
      .order-number {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .channel-info {
      .store-info {
        margin-top: 4px;
      }
    }

    .customer-info {
      .customer-name {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .return-details {
      .amount {
        font-weight: 500;
      }
    }

    .shipping-info {
      .carrier {
        display: flex;
        align-items: center;
        gap: 8px;
  }
}

    .system-info {
      .rms,
      .wms {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-light);
    text-align: right;
  }

  :deep(.el-drawer__body) {
    padding: 20px;
  }

  .el-table {
    // 表格样式优化
    .text-secondary {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }

    .amount {
      font-family: monospace;
      font-weight: 500;
    }

    // 操作按钮组样式
    .el-button-group {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      justify-content: center;
      
      .el-button {
        margin: 0;
        padding: 4px 8px;
        
        .el-icon {
          margin-right: 4px;
        }
      }
    }
  }
}
</style> 