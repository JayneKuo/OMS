<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <h1>Return Order</h1>
      </div>
      <div class="header-actions">
        <el-button class="export-button">
          <el-icon><Download /></el-icon>
          Export
        </el-button>
        <el-dropdown @command="handleAction">
          <el-button type="primary">
            Actions
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="create">
                <el-icon><Plus /></el-icon>
                New Return Order
              </el-dropdown-item>
              <el-dropdown-item command="import">
                <el-icon><Upload /></el-icon>
                Import
              </el-dropdown-item>
              
              <!-- 选中订单时可见的操作 -->
              <template v-if="selectedRows.length">
                <el-dropdown-item command="rawData">
                  <el-icon><Document /></el-icon>
                  Raw Data
                </el-dropdown-item>

                <!-- 状态相关操作 -->
                <template v-if="hasAvailableActions">
                  <el-dropdown-item divided></el-dropdown-item>
                  <template v-for="action in availableActions" :key="action">
                    <el-dropdown-item :command="action">
                      {{ getActionLabel(action) }}
                    </el-dropdown-item>
                  </template>
                </template>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-title">SEARCH BY</div>
      <el-form :model="searchForm" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchForm.returnOrderNo"
            placeholder="Return Order No."
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.originalOrderNo"
            placeholder="Original Order No."
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item label="Return Type:">
          <el-select
            v-model="searchForm.returnType"
            placeholder="Return Type"
            clearable
            popper-class="dark-select-dropdown"
            class="search-select"
          >
            <el-option label="All" value="all" />
            <el-option label="Refund" value="Refund" />
            <el-option label="Exchange" value="Exchange" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.customerName"
            placeholder="Customer Name"
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item label="Status:">
          <el-select
            v-model="searchForm.status"
            placeholder="Status"
            clearable
            popper-class="dark-select-dropdown"
            class="search-select"
          >
            <el-option label="All" value="all" />
            <el-option label="Created" value="Created" />
            <el-option label="Pending" value="Pending" />
            <el-option label="Approved" value="Approved" />
            <el-option label="Processing" value="Processing" />
            <el-option label="Shipped" value="Shipped" />
            <el-option label="Received" value="Received" />
            <el-option label="Refunded" value="Refunded" />
            <el-option label="Completed" value="Completed" />
            <el-option label="Cancelled" value="Cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            class="search-date-picker"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">Search</el-button>
          <el-button @click="handleReset">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 状态过滤器 -->
    <div class="status-filter">
      <el-radio-group v-model="currentStatus">
        <el-radio-button label="all">All({{ getTotalByStatus('all') }})</el-radio-button>
        <el-radio-button label="created">Created({{ getTotalByStatus('Created') }})</el-radio-button>
        <el-radio-button label="pending">Pending({{ getTotalByStatus('Pending') }})</el-radio-button>
        <el-radio-button label="approved">Approved({{ getTotalByStatus('Approved') }})</el-radio-button>
        <el-radio-button label="processing">Processing({{ getTotalByStatus('Processing') }})</el-radio-button>
        <el-radio-button label="shipped">Shipped({{ getTotalByStatus('Shipped') }})</el-radio-button>
        <el-radio-button label="received">Received({{ getTotalByStatus('Received') }})</el-radio-button>
        <el-radio-button label="refunded">Refunded({{ getTotalByStatus('Refunded') }})</el-radio-button>
        <el-radio-button label="completed">Completed({{ getTotalByStatus('Completed') }})</el-radio-button>
        <el-radio-button label="cancelled">Cancelled({{ getTotalByStatus('Cancelled') }})</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        row-key="returnOrderNo"
      >
        <el-table-column type="selection" width="55" reserve-selection />
        <el-table-column label="RETURN ORDER NO." min-width="150">
          <template #default="{ row }">
            <el-link 
              type="primary" 
              @click="handleView(row)"
            >
              {{ row.returnOrderNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column 
          label="ORIGINAL ORDER NO." 
          prop="originalOrderNo" 
          min-width="150"
        />
        <el-table-column label="TYPE" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.returnType === 'Refund' ? 'danger' : 'warning'">
              {{ row.returnType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="STATUS" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="CUSTOMER" prop="customerName" min-width="150" />
        <el-table-column label="TOTAL AMOUNT" min-width="120">
          <template #default="{ row }">
            ${{ row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="CREATE DATE" min-width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createDate) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <div class="total-info">Total {{ total }}</div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Download,
  Plus,
  Upload,
  Document,
  ArrowDown
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 定义接口
interface ReturnOrder {
  returnOrderNo: string
  originalOrderNo: string
  returnType: string
  status: string
  customerName: string
  totalAmount: number
  createDate: string
}

interface SearchForm {
  returnOrderNo: string
  originalOrderNo: string
  returnType: string
  status: string
  customerName: string
  dateRange: [Date | null, Date | null] | null
}

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const selectedRows = ref<ReturnOrder[]>([])
const currentStatus = ref('all')

// 搜索表单
const searchForm = reactive<SearchForm>({
  returnOrderNo: '',
  originalOrderNo: '',
  returnType: 'all',
  status: 'all',
  customerName: '',
  dateRange: null
})

// 表格数据
const tableData = ref<ReturnOrder[]>([])

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    Created: 'info',
    Pending: 'warning',
    Approved: 'success',
    Processing: 'warning',
    Shipped: 'primary',
    Received: 'success',
    Refunded: 'success',
    Completed: 'success',
    Cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态总数
const getTotalByStatus = (status: string) => {
  if (status === 'all') return total.value
  return tableData.value.filter(item => item.status === status).length
}

// 处理选择变化
const handleSelectionChange = (rows: ReturnOrder[]) => {
  selectedRows.value = rows
}

// 处理操作
const handleAction = (command: string) => {
  switch (command) {
    case 'create':
      router.push('/return/create')
      break
    case 'import':
      // TODO: 实现导入功能
      break
    case 'rawData':
      // TODO: 实现查看原始数据功能
      break
  }
}

// 处理查看
const handleView = (row: ReturnOrder) => {
  router.push(`/return/${row.returnOrderNo}`)
}

// 处理搜索
const handleSearch = () => {
  fetchData()
}

// 处理重置
const handleReset = () => {
  searchForm.returnOrderNo = ''
  searchForm.originalOrderNo = ''
  searchForm.returnType = 'all'
  searchForm.status = 'all'
  searchForm.customerName = ''
  searchForm.dateRange = null
  fetchData()
}

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

// 格式化日期时间
const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // TODO: 实现数据获取
    // 模拟数据
    const mockData: ReturnOrder[] = [
      {
        returnOrderNo: 'RO001',
        originalOrderNo: 'SO00184716',
        returnType: 'Refund',
        status: 'Created',
        customerName: 'Bagwell Diane',
        totalAmount: 299.00,
        createDate: '2024-03-19 10:00:00'
      },
      {
        returnOrderNo: 'RO002',
        originalOrderNo: 'SO00184654',
        returnType: 'Exchange',
        status: 'Pending',
        customerName: 'John Smith',
        totalAmount: 199.00,
        createDate: '2024-03-19 09:30:00'
      },
      {
        returnOrderNo: 'RO003',
        originalOrderNo: 'SO00184655',
        returnType: 'Refund',
        status: 'Received',
        customerName: 'John Doe',
        totalAmount: 399.00,
        createDate: '2024-03-19 09:00:00'
      }
    ]
    tableData.value = mockData
    total.value = mockData.length
  } catch (error) {
    ElMessage.error('Failed to fetch return orders')
  } finally {
    loading.value = false
  }
}

// 可用操作
const availableActions = computed(() => {
  if (!selectedRows.value.length) return []
  const actions = []
  const status = selectedRows.value[0].status

  switch (status) {
    case 'Created':
    case 'Pending':
      actions.push('approve', 'reject')
      break
    case 'Approved':
    case 'Processing':
      actions.push('ship', 'cancel')
      break
    case 'Shipped':
      actions.push('receive')
      break
    case 'Received':
      actions.push('refund')
      break
  }

  return actions
})

const hasAvailableActions = computed(() => availableActions.value.length > 0)

const getActionLabel = (action: string) => {
  const actionLabels: Record<string, string> = {
    approve: 'Approve',
    reject: 'Reject',
    ship: 'Ship',
    cancel: 'Cancel',
    receive: 'Receive',
    refund: 'Refund'
  }
  return actionLabels[action] || action
}

// 初始化
fetchData()
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  background: var(--bg-dark);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.search-section {
  background: var(--component-bg);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;

  .search-title {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }

  .search-form {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    :deep(.el-form-item__label) {
      color: var(--text-secondary);
      font-size: 14px;
      padding-right: 8px;
    }

    :deep(.search-input),
    :deep(.search-select),
    :deep(.search-date-picker) {
      width: 240px;
    }

    :deep(.el-range-editor) {
      width: 360px;
      background-color: var(--bg-dark);
      border: 1px solid var(--border-color);
      
      &:hover, &.is-focus {
        border-color: var(--el-color-primary);
      }

      .el-range-input {
        color: var(--text-primary);
        background-color: transparent;
        &::placeholder {
          color: var(--text-secondary);
        }
      }

      .el-range-separator {
        color: var(--text-secondary);
      }
    }
  }
}

.status-filter {
  margin-bottom: 24px;

  :deep(.el-radio-group) {
    .el-radio-button__inner {
      background: transparent;
      border-color: var(--border-color);
      color: var(--text-secondary);
    }

    .el-radio-button__original-radio:checked + .el-radio-button__inner {
      background-color: #6366f1;
      border-color: #6366f1;
      color: white;
      box-shadow: -1px 0 0 0 #6366f1;
    }

    .el-radio-button:not(:first-child) .el-radio-button__inner {
      border-left-color: var(--border-color);
    }

    .el-radio-button:first-child .el-radio-button__inner {
      border-left-color: var(--border-color);
    }

    .el-radio-button:not(:last-child) .el-radio-button__inner {
      border-right-color: var(--border-color);
    }
  }
}

.table-section {
  background: var(--component-bg);
  padding: 24px;
  border-radius: 8px;

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 24px;
    gap: 16px;
  }
}

.total-info {
  color: var(--text-secondary);
}

// 添加暗色下拉菜单样式
:deep(.dark-select-dropdown) {
  background-color: var(--bg-dark) !important;
  border: 1px solid var(--border-color) !important;

  .el-select-dropdown__item {
    color: var(--text-primary);

    &.hover, &:hover {
      background-color: var(--el-color-primary-light-9);
    }

    &.selected {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }

  .el-select-dropdown__list {
    padding: 4px 0;
  }
}
</style> 