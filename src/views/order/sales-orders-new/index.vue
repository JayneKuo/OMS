<template>
  <div class="sales-orders-new">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>Orders</h1>
        <el-tooltip content="Help">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="header-right">
        <div class="action-buttons">
          <el-dropdown trigger="click">
            <el-button type="primary">
              Export
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
          </el-dropdown>
          <el-dropdown trigger="click" @command="handleCreateCommand">
            <el-button type="primary">
              Create
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="new_order">New Order</el-dropdown-item>
                <el-dropdown-item command="bulk_import">Bulk Import</el-dropdown-item>
                <el-dropdown-item command="download_template">
                  <div style="padding-left: 20px;">Download Bulk Import Template</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 搜索和过滤器区域 -->
    <search-form @search="handleSearch" />

    <!-- 状态标签页和工具栏 -->
    <div class="status-toolbar">
      <div class="status-tabs">
        <div class="tab-list">
          <div
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-item"
            :class="{ active: activeStatus === tab.value }"
            @click="activeStatus = tab.value"
          >
            <div class="tab-content">
              <span class="tab-label">{{ tab.label }}</span>
              <span class="count-tag" :class="tab.tagType">{{ tab.count }}</span>
            </div>
            <div class="tab-line" />
          </div>
        </div>
      </div>

      <div class="toolbar-actions">
        <el-tooltip content="Pull Orders" placement="top">
          <el-button class="action-btn" @click="showPullDialog = true">
            <el-icon><Download /></el-icon>
          </el-button>
        </el-tooltip>
        
        <!-- Pull Orders Dialog -->
        <el-dialog
          v-model="showPullDialog"
          title="Pull Orders"
          width="800px"
          destroy-on-close
        >
          <div class="pull-dialog-content">
            <!-- Channel Selection -->
            <div class="pull-section">
              <div class="section-title">
                Channel
                <span class="required-mark">*</span>
              </div>
              <div class="section-content">
                <el-select
                  v-model="pullForm.channel"
                  placeholder="Select channel"
                  class="w-full"
                >
                  <el-option-group label="Marketplaces">
                    <el-option label="Amazon" value="amazon" />
                    <el-option label="eBay" value="ebay" />
                    <el-option label="Walmart" value="walmart" />
                  </el-option-group>
                  <el-option-group label="E-commerce">
                    <el-option label="Shopify" value="shopify" />
                    <el-option label="WooCommerce" value="woocommerce" />
                  </el-option-group>
                </el-select>
              </div>
            </div>

            <!-- Order Numbers -->
            <div class="pull-section">
              <div class="section-title">Order Numbers</div>
              <div class="section-content">
                <el-input
                  v-model="pullForm.orderNumbers"
                  type="textarea"
                  :rows="3"
                  placeholder="Enter order numbers (one per line)"
                />
                <div class="text-gray-400 text-xs mt-1">
                  Enter multiple order numbers, one per line
                </div>
              </div>
            </div>

            <!-- Date Range -->
            <div class="pull-section">
              <div class="section-title">Date Range</div>
              <div class="section-content">
                <el-date-picker
                  v-model="pullForm.dateRange"
                  type="daterange"
                  range-separator="to"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Status Selection -->
            <div class="pull-section">
              <div class="section-title">Order Status</div>
              <div class="section-content">
                <el-select
                  v-model="pullForm.status"
                  multiple
                  placeholder="Select status"
                  class="w-full"
                >
                  <el-option label="Pending" value="pending" />
                  <el-option label="Processing" value="processing" />
                  <el-option label="Shipped" value="shipped" />
                  <el-option label="Delivered" value="delivered" />
                  <el-option label="Cancelled" value="cancelled" />
                </el-select>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showPullDialog = false">Cancel</el-button>
              <el-button
                type="primary"
                plain
                :loading="previewing"
                @click="handlePreviewPull"
              >
                Preview
              </el-button>
              <el-button
                type="primary"
                :loading="pulling"
                @click="handlePullOrders"
              >
                Pull Orders
              </el-button>
            </div>
          </template>
        </el-dialog>

        <!-- Error Dialog -->
        <el-dialog
          v-model="showErrorDialog"
          title="Pull Orders Failed"
          width="600px"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div class="error-dialog-content">
            <div class="error-summary">
              <el-alert
                :title="pullErrorDetails.errorSummary"
                type="error"
                :closable="false"
                show-icon
              />
            </div>

            <div v-if="pullErrorDetails.failedOrders.length" class="failed-orders-list">
              <div class="list-title">Failed Orders:</div>
              <el-table :data="pullErrorDetails.failedOrders" max-height="300">
                <el-table-column prop="orderNo" label="Order No." width="120" />
                <el-table-column prop="channel" label="Channel" width="120" />
                <el-table-column prop="error" label="Error" min-width="200">
                  <template #default="{ row }">
                    <el-tooltip 
                      :content="row.error"
                      placement="top"
                      :show-after="200"
                    >
                      <div class="error-text">{{ row.error }}</div>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showErrorDialog = false">Close</el-button>
              <el-button
                type="primary"
                :loading="pulling"
                @click="handleRetryPull"
              >
                Retry Pull
              </el-button>
            </div>
          </template>
        </el-dialog>

        <!-- Preview Results Dialog -->
        <el-dialog
          v-model="showPreviewDialog"
          title="Preview Pull Results"
          width="1000px"
          destroy-on-close
          :close-on-click-modal="false"
        >
          <div class="preview-dialog-content">
            <div class="preview-summary mb-4">
              <div class="summary-item">
                <span class="label">Total Orders:</span>
                <span class="value">{{ previewResults.total }}</span>
              </div>
              <div class="summary-item">
                <span class="label">New Orders:</span>
                <span class="value text-success">{{ previewResults.newOrders.length }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Duplicate Orders:</span>
                <span class="value text-warning">{{ previewResults.duplicateOrders.length }}</span>
              </div>
            </div>

            <!-- New Orders Table -->
            <div v-if="previewResults.newOrders.length" class="preview-section mb-4">
              <div class="section-title">New Orders</div>
              <el-table 
                :data="previewResults.newOrders" 
                max-height="300"
                @selection-change="handleNewOrdersSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="orderNo" label="Order No." width="180" />
                <el-table-column prop="channel" label="Channel" width="120" />
                <el-table-column prop="orderDate" label="Order Date" width="180" />
                <el-table-column prop="status" label="Status" width="120" />
                <el-table-column prop="total" label="Total" width="120">
                  <template #default="{ row }">
                    {{ formatCurrency(row.total) }}
                  </template>
                </el-table-column>
                <el-table-column prop="items" label="Items">
                  <template #default="{ row }">
                    {{ row.items.length }} items
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- Duplicate Orders Table -->
            <div v-if="previewResults.duplicateOrders.length" class="preview-section">
              <div class="section-title">Duplicate Orders</div>
              <el-table 
                :data="previewResults.duplicateOrders" 
                max-height="300"
                @selection-change="handleDuplicateOrdersSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="orderNo" label="Order No." width="180" />
                <el-table-column prop="channel" label="Channel" width="120" />
                <el-table-column prop="orderDate" label="Order Date" width="180" />
                <el-table-column prop="status" label="Status" width="120" />
                <el-table-column prop="total" label="Total" width="120">
                  <template #default="{ row }">
                    {{ formatCurrency(row.total) }}
                  </template>
                </el-table-column>
                <el-table-column prop="items" label="Items">
                  <template #default="{ row }">
                    {{ row.items.length }} items
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- Failed Orders Table -->
            <div v-if="previewResults.failedOrders.length" class="preview-section">
              <div class="section-header">
                <div class="section-title text-danger">Failed Orders</div>
                <el-button
                  type="primary"
                  size="small"
                  :loading="retrying"
                  @click="handleRetryFailed"
                >
                  Retry Failed Orders
                </el-button>
              </div>
              <el-table 
                ref="failedTableRef"
                :data="previewResults.failedOrders" 
                max-height="300"
                @selection-change="handleFailedOrdersSelectionChange"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="orderNo" label="Order No." width="180" />
                <el-table-column prop="channel" label="Channel" width="120" />
                <el-table-column prop="orderDate" label="Order Date" width="180" />
                <el-table-column prop="status" label="Status" width="120" />
                <el-table-column prop="error" label="Error" min-width="200">
                  <template #default="{ row }">
                    <el-tooltip 
                      v-if="row.error"
                      :content="row.error"
                      placement="top"
                      :show-after="200"
                    >
                      <div class="error-text">{{ row.error }}</div>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="Actions" width="100" fixed="right">
                  <template #default="{ row }">
                    <el-button
                      type="primary"
                      link
                      :loading="retryingOrder === row.orderNo"
                      @click="handleRetrySingleOrder(row)"
                    >
                      Retry
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- Selection Summary -->
            <div class="selection-summary">
              <div class="summary-text">
                Selected: 
                <span class="text-primary">{{ selectedNewOrders.length + selectedDuplicateOrders.length }}</span> orders
                (<span class="text-success">{{ selectedNewOrders.length }}</span> new,
                <span class="text-warning">{{ selectedDuplicateOrders.length }}</span> duplicate)
                <template v-if="previewResults.failedOrders.length">
                  <span class="text-danger ml-2">
                    {{ previewResults.failedOrders.length }} orders failed to process
                    <template v-if="selectedFailedOrders.length">
                      ({{ selectedFailedOrders.length }} selected for retry)
                    </template>
                  </span>
                </template>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showPreviewDialog = false">Cancel</el-button>
              <el-button
                type="primary"
                :loading="pulling"
                :disabled="!selectedNewOrders.length"
                @click="handleConfirmPull"
              >
                Pull {{ selectedNewOrders.length }} Orders
              </el-button>
            </div>
          </template>
        </el-dialog>

        <el-tooltip content="Refresh" placement="top">
          <el-button class="action-btn" @click="refreshTable">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="Customize Columns" placement="top">
          <el-button class="action-btn" @click="showColumnSettings = true">
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        :size="displayMode"
        :row-class-name="getRowClassName"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @row-click="handleRowClick"
        row-key="id"
        class="order-table"
        :header-cell-style="{
          background: '#1a1d21',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          color: '#8b949e',
          padding: '4px 8px',
          fontWeight: 500,
          fontSize: '12px'
        }"
        :cell-style="{
          padding: '4px 8px',
          fontSize: '13px'
        }"
        height="100%"
      >
        <!-- 选择列 -->
        <el-table-column 
          type="selection"
          width="40"
          fixed="left"
          align="center"
        />
        
        <!-- Order No. 列 -->
        <el-table-column 
          prop="orderId"
          label="Order No."
          min-width="120"
          fixed="left"
          sortable
          align="left"
        >
          <template #default="{ row }">
            <span class="order-id-link" @click="handleOrderClick(row)">{{ row.orderId }}</span>
          </template>
        </el-table-column>
        
        <template v-for="col in visibleColumns.filter(col => col.key !== 'orderId')" :key="col.key">
          <el-table-column
            :prop="col.key"
            :label="col.label"
            :min-width="col.minWidth"
            :fixed="col.fixed"
            :sortable="col.sortable"
            :sort-orders="['ascending', 'descending']"
            :align="getColumnAlign(col.key)"
          >
            <template #default="{ row }">
              <div :class="['cell-content', `cell-${col.key}`]">
                <template v-if="col.key === 'status'">
                  <span :class="['status-tag', getStatusClass(row.status)]">
                    {{ row.status }}
                  </span>
                </template>
                <template v-else-if="col.key === 'exceptions'">
                  <span class="status-info-tag">
                    {{ row.exceptions }}
                  </span>
                </template>
                <template v-else-if="col.key === 'tags'">
                  <span v-for="tag in row.tags" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </template>
                <template v-else-if="col.key === 'total'">
                  <span class="amount">{{ formatAmount(row[col.key]) }}</span>
                </template>
                <template v-else>
                  {{ row[col.key] }}
                </template>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 25, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 列设置抽屉 -->
      <el-drawer
        v-model="showColumnSettings"
        title="Columns"
        size="320px"
        direction="rtl"
        :show-close="false"
        class="column-settings-drawer"
      >
        <template #header>
          <div class="drawer-header">
            <span class="drawer-title">Columns</span>
            <el-button link @click="showColumnSettings = false">
              <el-icon class="close-icon"><Close /></el-icon>
            </el-button>
          </div>
        </template>

        <div class="column-settings">
          <div class="columns-list">
            <draggable
              v-model="columnsList"
              :item-key="'key'"
              handle=".drag-handle"
              @end="handleColumnSort"
            >
              <template #item="{ element }">
                <div class="column-item">
                  <el-checkbox 
                    v-model="element.visible"
                    @change="handleColumnVisibilityChange"
                  >
                    {{ element.label }}
                  </el-checkbox>
                  <el-icon class="drag-handle"><Rank /></el-icon>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import VueDraggable from 'vuedraggable/src/vuedraggable'
import { useElementSize } from '@vueuse/core'
import { 
  QuestionFilled, 
  Mic, 
  ArrowDown, 
  Plus, 
  Search,
  Refresh,
  Grid,
  List,
  Rank,
  Timer,
  Edit,
  Connection,
  Upload,
  Close,
  RefreshRight,
  Download
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ColumnRenderer from './components/ColumnRenderer.vue'
import { DEFAULT_COLUMNS, type OrderItem, type OrderColumn } from './types'
import draggable from 'vuedraggable'
import SearchForm from './components/SearchForm.vue'
import type { SearchCondition } from './types'

const router = useRouter()

// 模拟数据
const mockData: OrderItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: String(index + 1),
  orderId: `#${1942 - index}`,
  status: 'Ready For Fulfillment',
  exceptions: 'Sent Order Failure',
  source: 'Shopify',
  storeName: 'UNIS Store',
  channelOrderNo: `SO-${10000 + index}`,
  referenceNo: `REF-${20000 + index}`,
  ordered: '07/18/2025 10:07 AM',
  ingested: '07/18/2025 10:10 AM',
  shipDate: '07/21/2025',
  updated: '07/18/2025 11:06 AM',
  total: 46510.00,
  shippingCarrier: 'FedEx',
  tags: ['shopify_draft_order'],
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  state: 'CA',
  country: 'United States',
  company: 'ACME Corp'
}))

// 状态管理
const loading = ref(false)
const pulling = ref(false)
const previewing = ref(false)
const retrying = ref(false)
const retryingOrder = ref<string>('')
const showPullDialog = ref(false)
const showPreviewDialog = ref(false)
const showErrorDialog = ref(false)
const pullErrorDetails = ref<{
  failedOrders: {
    orderNo: string
    channel: string
    error: string
  }[]
  errorSummary: string
}>({
  failedOrders: [],
  errorSummary: ''
})
const failedTableRef = ref<InstanceType<typeof import('element-plus').ElTable>>()

interface PreviewOrder {
  orderNo: string
  channel: string
  orderDate: string
  status: string
  total: number
  items: any[]
  error?: string // 添加错误信息字段
}

interface PreviewResults {
  total: number
  newOrders: PreviewOrder[]
  duplicateOrders: PreviewOrder[]
  failedOrders: PreviewOrder[] // 添加失败订单
}

const previewResults = ref<PreviewResults>({
  total: 0,
  newOrders: [],
  duplicateOrders: [],
  failedOrders: []
})

const pullForm = ref({
  channel: '',
  orderNumbers: '',
  dateRange: [] as [Date | null, Date | null],
  status: [] as string[]
})
const searchKeyword = ref('')
const selectedRows = ref<OrderItem[]>([])
const showColumnSettings = ref(false)
const displayMode = ref('comfortable')
const enableWordWrap = ref(false)
const columnsList = ref(DEFAULT_COLUMNS)
const currentPage = ref(1)
const pageSize = ref(10) // 修改为默认显示10条
const total = ref(mockData.length)
const tableHeight = ref(0)
const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return mockData.slice(start, end)
})
const tableRef = ref()

// 视图模式
const viewMode = ref('list')

// 状态选项
const orderStatuses = [
  { label: 'Ready For Fulfillment', value: 'ready_for_fulfillment' },
  { label: 'Pending', value: 'pending' },
  { label: 'Exception', value: 'exception' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Cancelled', value: 'cancelled' }
]

// 来源选项
const sources = [
  { label: 'Shopify', value: 'shopify' },
  { label: 'Amazon', value: 'amazon' },
  { label: 'eBay', value: 'ebay' }
]

// 过滤器按钮配置
const filterButtons = ref([
  { key: 'ordered', label: 'Ordered', hasValue: false, activeFilters: 0 },
  { key: 'ingested', label: 'Ingested', hasValue: false, activeFilters: 0 },
  { key: 'source', label: 'Source', hasValue: false, activeFilters: 0 },
  { key: 'orderSourceType', label: 'Order Source Type', hasValue: false, activeFilters: 0 },
  { key: 'status', label: 'Status', hasValue: false, activeFilters: 0 },
  { key: 'tags', label: 'Tags', hasValue: false, activeFilters: 0 },
  { key: 'location', label: 'Location', hasValue: false, activeFilters: 0 },
  { key: 'exceptionCategories', label: 'Exception Categories', hasValue: false, activeFilters: 0 },
  { key: 'integration', label: 'Integration', hasValue: false, activeFilters: 0 },
  { key: 'advanced', label: 'Advanced', hasValue: false, activeFilters: 0 },
  { key: 'savedFilters', label: 'Saved Filters', hasValue: false, activeFilters: 0 }
])

// 活动过滤器
const activeFilters = ref<Array<{ key: string; label: string; value: string }>>([])

// 状态标签页
const activeStatus = ref('all')
const counts = ref({
  all: 156,
  onHold: 23,
  exception: 12
})

// 标签页配置
const tabs = [
  { label: 'All Orders', value: 'all', count: 156, tagType: 'default' },
  { label: 'On Hold', value: 'on_hold', count: 23, tagType: 'warning' },
  { label: 'Exception', value: 'exception', count: 12, tagType: 'danger' }
]

// 监听状态变化
watch(activeStatus, (newStatus) => {
  console.log('Status changed:', newStatus)
  // TODO: 根据状态筛选数据
  refreshTable()
})

// 计算属性
const visibleColumns = computed(() => {
  return columnsList.value.filter(col => col.visible)
})

const isAllSelected = computed({
  get: () => selectedRows.value.length > 0,
  set: (val) => {
    if (tableRef.value) {
      tableRef.value.toggleAllSelection()
    }
  }
})

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < tableData.value.length
})

// 计算是否有活动过滤器
const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// 方法
const handleSelectionChange = (rows: OrderItem[]) => {
  selectedRows.value = rows
}

const handleSortChange = ({ prop, order }: { prop: string, order: string }) => {
  // 实现排序逻辑
  console.log('Sort changed:', prop, order)
}

const handleFilterChange = (command: any) => {
  if (typeof command === 'string') {
    // 处理日期过滤器
    const [key, value] = command.split('_')
    const filter = filterButtons.value.find(f => f.key === key)
    if (filter) {
      filter.hasValue = true
      filter.activeFilters = 1
      activeFilters.value.push({
        key,
        label: filter.label,
        value: value === 'custom' ? 'Custom Range' : `Last ${value}`
      })
    }
  } else if (command.type && command.value) {
    // 处理其他过滤器
    const filter = filterButtons.value.find(f => f.key === command.type)
    if (filter) {
      filter.hasValue = true
      filter.activeFilters = 1
      activeFilters.value.push({
        key: command.type,
        label: filter.label,
        value: command.value
      })
    }
  }
}

const handleBatchAction = (action: string) => {
  // 实现批量操作逻辑
  console.log('Batch action:', action)
  ElMessage.success(`${action} executed successfully`)
}

const refreshTable = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('Table refreshed')
  }, 1000)
}

const handleColumnSort = () => {
  saveColumnSettings()
}

const handleColumnVisibilityChange = () => {
  saveColumnSettings()
}

// 重置列设置
const resetColumns = () => {
  columnsList.value = DEFAULT_COLUMNS
  saveColumnSettings()
  ElMessage.success('Column settings reset to default')
}

const saveColumnSettings = () => {
  localStorage.setItem('salesOrdersNewColumns', JSON.stringify({
    columns: columnsList.value,
    displayMode: displayMode.value,
    enableWordWrap: enableWordWrap.value
  }))
}

const handleExplainFilters = () => {
  ElMessage.info('Explaining filters with Pippen...')
}

// 处理搜索
const handleSearch = (condition: SearchCondition) => {
  console.log('Search condition:', condition)
  // TODO: 实现搜索逻辑
  loading.value = true
  setTimeout(() => {
    // 模拟搜索结果
    loading.value = false
  }, 1000)
}

// 移除过滤器
const removeFilter = (filter: { key: string; label: string; value: string }) => {
  const index = activeFilters.value.findIndex(f => f.key === filter.key && f.value === filter.value)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
    const button = filterButtons.value.find(f => f.key === filter.key)
    if (button) {
      button.activeFilters--
      if (button.activeFilters === 0) {
        button.hasValue = false
      }
    }
  }
}

// 清除所有过滤器
const clearAllFilters = () => {
  activeFilters.value = []
  filterButtons.value.forEach(filter => {
    filter.hasValue = false
    filter.activeFilters = 0
  })
}

// 处理全选
const handleSelectAll = (val: boolean) => {
  if (tableRef.value) {
    val ? tableRef.value.toggleAllSelection() : tableRef.value.clearSelection()
  }
}

// 清除选择
const clearSelection = () => {
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

// 获取行类名
const getRowClassName = ({ row }: { row: OrderItem }) => {
  return selectedRows.value.some(selected => selected.id === row.id) ? 'selected-row' : ''
}

// 处理行点击
const handleRowClick = (row: OrderItem) => {
  if (tableRef.value) {
    tableRef.value.toggleRowSelection(row)
  }
}

// 处理单元格点击
const handleCellClick = (row: OrderItem, column: OrderColumn) => {
  if (column.key === 'orderId') {
    router.push(`/order/sales/${row.id}`)
  }
}

// 处理单个选择
const handleSingleSelect = (row: OrderItem, selected: boolean) => {
  if (tableRef.value) {
    tableRef.value.toggleRowSelection(row, selected)
  }
}

// 处理订单点击
const handleOrderClick = (row: OrderItem) => {
  router.push(`/order/sales/${row.id}`)
}

// 处理每页显示条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 当每页显示条数改变时，重置当前页为1
}

// 处理当前页变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 处理 Create 按钮下拉菜单命令
const handleCreateCommand = (command: string) => {
  switch (command) {
    case 'new_order':
      // 处理新建订单
      ElMessage.info('Creating new order...')
      break
    case 'bulk_import':
      // 处理批量导入
      ElMessage.info('Opening bulk import dialog...')
      break
    case 'download_template':
      // 处理下载模板
      ElMessage.success('Downloading bulk import template...')
      break
  }
}

// 拉取订单
const handlePullOrders = async () => {
  try {
    // 表单验证
    if (!validatePullForm()) {
      return
    }

    pulling.value = true
    const params = formatPullParams()
    
    // TODO: 调用拉取订单的API
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    // 模拟拉取失败
    const mockError = {
      errorSummary: 'Failed to connect to channel API',
      failedOrders: [
        {
          orderNo: '#10001',
          channel: 'Amazon',
          error: 'Network timeout'
        },
        {
          orderNo: '#10002',
          channel: 'Amazon',
          error: 'Invalid response format'
        }
      ]
    }

    // 处理失败情况
    if (mockError.failedOrders.length > 0) {
      pullErrorDetails.value = mockError
      showErrorDialog.value = true
      return
    }

    ElMessage.success('Orders pulled successfully')
    showPullDialog.value = false
    refreshTable() // 刷新表格数据
  } catch (error) {
    console.error('Error pulling orders:', error)
    pullErrorDetails.value = {
      errorSummary: 'Unexpected error occurred while pulling orders',
      failedOrders: []
    }
    showErrorDialog.value = true
  } finally {
    pulling.value = false
  }
}

// 重试拉取订单
const handleRetryPull = async () => {
  showErrorDialog.value = false
  await handlePullOrders()
}

// 预览拉单
const handlePreviewPull = async () => {
  previewing.value = true
  try {
    // 表单验证
    if (!validatePullForm()) {
      previewing.value = false
      return
    }

    const params = formatPullParams()
    
    // TODO: 调用预览拉取订单的API
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    // 模拟预览结果
    previewResults.value = {
      total: 10,
      newOrders: Array.from({ length: 5 }, (_, i) => ({
        orderNo: `#${10000 + i}`,
        channel: ['Amazon', 'eBay', 'Walmart'][i % 3],
        orderDate: '07/18/2025',
        status: 'Ready For Fulfillment',
        total: 1234.56,
        items: 5
      })),
      duplicateOrders: Array.from({ length: 2 }, (_, i) => ({
        orderNo: `#${10000 + i}`,
        channel: ['Shopify', 'WooCommerce'][i % 2],
        orderDate: '07/17/2025',
        status: 'Shipped',
        total: 789.01,
        items: 3
      })),
      failedOrders: Array.from({ length: 1 }, (_, i) => ({
        orderNo: `#${10000 + i}`,
        channel: ['Amazon'][i % 1],
        orderDate: '07/17/2025',
        status: 'Failed',
        total: 0,
        items: 0,
        error: 'Failed to fetch order details'
      }))
    }
    showPreviewDialog.value = true
  } catch (error) {
    console.error('Error previewing orders:', error)
    ElMessage.error('Failed to preview orders')
  } finally {
    previewing.value = false
  }
}

// 确认拉单
const handleConfirmPull = async () => {
  try {
    // 表单验证
    if (!validatePullForm()) {
      return
    }

    pulling.value = true
    const params = formatPullParams()
    
    // TODO: 调用拉取订单的API
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    // 模拟部分订单拉取失败
    const results = {
      success: selectedNewOrders.value.slice(0, -1),
      failed: [{
        ...selectedNewOrders.value[selectedNewOrders.value.length - 1],
        error: 'Failed to connect to channel API'
      }]
    }

    if (results.failed.length > 0) {
      ElMessageBox.alert(
        `${results.success.length} orders pulled successfully.<br/>
         ${results.failed.length} orders failed:<br/>
         ${results.failed.map(order => `${order.orderNo}: ${order.error}`).join('<br/>')}`,
        'Pull Results',
        {
          type: 'warning',
          dangerouslyHtml: true,
          confirmButtonText: 'OK'
        }
      )
    } else {
      ElMessage.success('All orders pulled successfully')
    }

    showPullDialog.value = false
    refreshTable() // 刷新表格数据
  } catch (error) {
    console.error('Error pulling orders:', error)
    ElMessage.error('Failed to pull orders')
  } finally {
    pulling.value = false
  }
}

// 验证拉单表单
const validatePullForm = () => {
  const { channel, orderNumbers, dateRange, status } = pullForm.value
  
  if (!channel) {
    ElMessage.warning('Please select a channel')
    return false
  }

  const hasAdditionalFilter = orderNumbers.trim() || 
                            (dateRange[0] && dateRange[1]) || 
                            status.length > 0

  if (!hasAdditionalFilter) {
    ElMessage.warning('Please set at least one additional filter condition')
    return false
  }
  
  return true
}

// 格式化拉单参数
const formatPullParams = () => {
  const { channel, orderNumbers, dateRange, status } = pullForm.value
  
  const params: Record<string, any> = {}

  if (channel.length > 0) {
    params.channel = channel
  }

  if (orderNumbers.trim()) {
    params.orderNumbers = orderNumbers.split('\n').map(no => no.trim()).filter(Boolean)
  }

  if (dateRange[0] && dateRange[1]) {
    params.startDate = dateRange[0]
    params.endDate = dateRange[1]
  }

  if (status.length > 0) {
    params.status = status
  }

  return params
}

// 生命周期钩子
onMounted(() => {
  // 加载保存的列设置
  const saved = localStorage.getItem('salesOrdersNewColumns')
  if (saved) {
    handleSavedColumnSettings(saved)
  } else {
    // 如果没有保存的设置，使用默认列
    columnsList.value = DEFAULT_COLUMNS
  }
  
  // 计算表格高度
  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})

// 格式化金额
const formatAmount = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// 获取列对齐方式
const getColumnAlign = (key: string) => {
  if (key === 'total') {
    return 'right'
  }
  return 'left'
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'Ready For Fulfillment': 'status-ready',
    'Pending': 'status-pending',
    'Exception': 'status-exception',
    'Shipped': 'status-shipped',
    'Cancelled': 'status-cancelled'
  }
  return statusMap[status] || ''
}

// 格式化数字
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// 更新表格高度的函数
const updateTableHeight = () => {
  tableHeight.value = window.innerHeight - 300 // 减去其他区域高度
}

// 处理保存的列设置
const handleSavedColumnSettings = (saved: string) => {
  try {
    const settings = JSON.parse(saved)
    // 使用默认列作为基础
    const defaultColumns = DEFAULT_COLUMNS
    // 如果有保存的设置，只更新visible属性，保持默认顺序
    if (settings.columns) {
      defaultColumns.forEach(col => {
        const savedCol = settings.columns.find((saved: OrderColumn) => saved.key === col.key)
        if (savedCol) {
          col.visible = savedCol.visible
        }
      })
    }
    columnsList.value = defaultColumns
    displayMode.value = settings.displayMode || 'comfortable'
    enableWordWrap.value = settings.enableWordWrap || false
  } catch (error) {
    console.error('Failed to load column settings:', error)
    // 如果加载失败，使用默认列
    columnsList.value = DEFAULT_COLUMNS
  }
}

// 预览表格选择相关
const selectedNewOrders = ref<PreviewOrder[]>([])
const selectedDuplicateOrders = ref<PreviewOrder[]>([])

const handleNewOrdersSelectionChange = (selection: PreviewOrder[]) => {
  selectedNewOrders.value = selection
}

const handleDuplicateOrdersSelectionChange = (selection: PreviewOrder[]) => {
  selectedDuplicateOrders.value = selection
}

// 格式化货币
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const selectedFailedOrders = ref<PreviewOrder[]>([])

const handleFailedOrdersSelectionChange = (selection: PreviewOrder[]) => {
  selectedFailedOrders.value = selection
}

// 重试单个失败订单
const handleRetrySingleOrder = async (order: PreviewOrder) => {
  try {
    retryingOrder.value = order.orderNo
    
    // TODO: 调用重试单个订单的API
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    // 模拟重试成功
    const retrySuccess = Math.random() > 0.3 // 70%成功率

    if (retrySuccess) {
      // 从失败列表中移除
      const index = previewResults.value.failedOrders.findIndex(o => o.orderNo === order.orderNo)
      if (index > -1) {
        const [retried] = previewResults.value.failedOrders.splice(index, 1)
        // 添加到新订单列表
        previewResults.value.newOrders.push({
          ...retried,
          error: undefined
        })
      }
      ElMessage.success(`Order ${order.orderNo} retried successfully`)
    } else {
      // 更新错误信息
      const failedOrder = previewResults.value.failedOrders.find(o => o.orderNo === order.orderNo)
      if (failedOrder) {
        failedOrder.error = 'Retry failed: Network timeout'
      }
      ElMessage.error(`Failed to retry order ${order.orderNo}`)
    }
  } catch (error) {
    console.error('Error retrying order:', error)
    ElMessage.error(`Failed to retry order ${order.orderNo}`)
  } finally {
    retryingOrder.value = ''
  }
}

// 重试选中的失败订单
const handleRetryFailed = async () => {
  if (!selectedFailedOrders.value.length) {
    ElMessage.warning('Please select orders to retry')
    return
  }

  try {
    retrying.value = true
    
    // TODO: 调用批量重试API
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    // 模拟部分重试成功
    const results = {
      success: selectedFailedOrders.value.slice(0, -1),
      failed: [selectedFailedOrders.value[selectedFailedOrders.value.length - 1]]
    }

    // 处理成功的订单
    for (const order of results.success) {
      const index = previewResults.value.failedOrders.findIndex(o => o.orderNo === order.orderNo)
      if (index > -1) {
        const [retried] = previewResults.value.failedOrders.splice(index, 1)
        // 添加到新订单列表
        previewResults.value.newOrders.push({
          ...retried,
          error: undefined
        })
      }
    }

    // 更新失败订单的错误信息
    for (const order of results.failed) {
      const failedOrder = previewResults.value.failedOrders.find(o => o.orderNo === order.orderNo)
      if (failedOrder) {
        failedOrder.error = 'Retry failed: Network timeout'
      }
    }

    // 清除选择
    failedTableRef.value?.clearSelection()

    // 显示结果
    if (results.failed.length > 0) {
      ElMessageBox.alert(
        `${results.success.length} orders retried successfully.<br/>
         ${results.failed.length} orders failed:<br/>
         ${results.failed.map(order => `${order.orderNo}: ${order.error}`).join('<br/>')}`,
        'Retry Results',
        {
          type: 'warning',
          dangerouslyHtml: true,
          confirmButtonText: 'OK'
        }
      )
    } else {
      ElMessage.success('All selected orders retried successfully')
    }
  } catch (error) {
    console.error('Error retrying orders:', error)
    ElMessage.error('Failed to retry orders')
  } finally {
    retrying.value = false
  }
}
</script>

<style lang="scss" scoped>
.sales-orders-new {
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1d21;
  color: #fff;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        color: #fff;
      }
      
      .help-icon {
        color: #8b949e;
        cursor: pointer;
        
        &:hover {
          color: #7c4dff;
        }
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .action-buttons {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-button {
          height: 32px;
          padding: 0 12px;
          font-weight: normal;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;

          &:not(.el-button--primary) {
            background: transparent;
            border: none;
            color: #8b949e;

            &:hover {
              color: #fff;
              background: rgba(255, 255, 255, 0.05);
            }
          }

          &.el-button--primary {
            background: #0066ff;
            border-color: #0066ff;
            padding: 0 16px;

            &:hover {
              background: #1a75ff;
              border-color: #1a75ff;
            }
          }

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .filter-section {
    background: #1e2227;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    
    .search-input {
      width: 240px;
      margin-right: 16px;
      
      :deep(.el-input__wrapper) {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: none;
        
        &:hover {
          border-color: #7c4dff;
        }
        
        &.is-focus {
          border-color: #7c4dff;
          box-shadow: 0 0 0 1px #7c4dff;
        }
      }
      
      :deep(.el-input__inner) {
        color: #fff;
        
        &::placeholder {
          color: #8b949e;
        }
      }
    }
    
    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      
      .el-button {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #8b949e;
        
        &:hover {
          border-color: #7c4dff;
          color: #7c4dff;
        }
        
        &.has-value {
          color: #7c4dff;
          border-color: #7c4dff;
        }
      }
    }
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    min-height: 32px;
    background: #1e2227;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 8px;

    .search-input-wrapper {
      width: 140px;
      margin-right: 4px;

      :deep(.el-input) {
        .el-input__wrapper {
          background: transparent;
          border: none;
          box-shadow: none !important;
          padding: 0;
          height: 32px;

          &:hover {
            background: transparent;
          }

          &.is-focus {
            background: transparent;
          }

          .el-input__inner {
            color: #fff;
            font-size: 13px;
            height: 32px;
            padding: 0 8px;

            &::placeholder {
              color: #8b949e;
            }
          }

          .el-input__prefix {
            color: #8b949e;
            font-size: 14px;
          }
        }
      }
    }

    .filter-buttons {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .el-dropdown {
        .el-button {
          height: 32px;
          padding: 0 12px;
          background: transparent;
          border: none;
          color: #8b949e;
          font-weight: normal;
          font-size: 13px;

          &:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.05);
          }

          .el-icon {
            font-size: 12px;
            margin-left: 4px;
          }
        }

        &.is-active {
          .el-button {
            color: #0066ff;
            background: rgba(0, 102, 255, 0.1);
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      padding-left: 8px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);

      .explain-btn {
        height: 32px;
        padding: 0 12px;
        background: transparent;
        border: none;
        color: #8b949e;
        font-weight: normal;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .el-icon {
          font-size: 14px;
        }
      }

      .el-button {
        height: 32px;
        padding: 0 12px;
        font-weight: normal;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;

        &:not(.el-button--primary) {
          background: transparent;
          border: none;
          color: #8b949e;

          &:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.05);
          }
        }

        &.el-button--primary {
          background: #0066ff;
          border-color: #0066ff;
          padding: 0 16px;

          &:hover {
            background: #1a75ff;
            border-color: #1a75ff;
          }
        }

        .el-icon {
          font-size: 14px;
        }
      }
    }
  }

  .search-section {
    background: transparent;
    margin-bottom: 16px;

    .search-filters {
      display: flex;
      align-items: center;
      gap: 16px;
      justify-content: space-between;

      .search-input-wrapper {
        width: 240px;

        :deep(.el-input) {
          .el-input__wrapper {
            background: #1e2227;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: none;
            border-radius: 4px;

            &:hover {
              border-color: #7c4dff;
            }

            &.is-focus {
              border-color: #7c4dff;
              box-shadow: 0 0 0 1px #7c4dff;
            }
          }

          .el-input__inner {
            color: #fff;
            height: 32px;
            line-height: 32px;

            &::placeholder {
              color: #8b949e;
            }
          }

          .el-input__prefix {
            color: #8b949e;
          }
        }
      }

      .filter-group {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .el-dropdown {
          .filter-btn {
            height: 32px;
            padding: 0 12px;
            background: #1e2227;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #8b949e;
            font-weight: normal;
            display: flex;
            align-items: center;
            gap: 4px;

            &:hover {
              border-color: #7c4dff;
              color: #7c4dff;
            }
          }

          &.has-value {
            .filter-btn {
              color: #7c4dff;
              border-color: #7c4dff;
              background: rgba(124, 77, 255, 0.1);
            }
          }
        }
      }

      .action-group {
        display: flex;
        align-items: center;
        gap: 8px;

        .explain-btn {
          height: 32px;
          padding: 0 12px;
          background: #1e2227;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #8b949e;
          font-weight: normal;
          display: flex;
          align-items: center;
          gap: 4px;

          &:hover {
            border-color: #7c4dff;
            color: #7c4dff;
          }

          .el-icon {
            font-size: 16px;
          }
        }

        .el-button {
          height: 32px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: normal;

          &:not(.el-button--primary) {
            background: #1e2227;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #8b949e;

            &:hover {
              border-color: #7c4dff;
              color: #7c4dff;
            }
          }

          &.el-button--primary {
            background: #7c4dff;
            border-color: #7c4dff;

            &:hover {
              background: #9575ff;
              border-color: #9575ff;
            }
          }

          .el-icon {
            font-size: 16px;
          }
        }
      }

      .active-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;

        .filter-tag {
          background: rgba(124, 77, 255, 0.1);
          border-color: rgba(124, 77, 255, 0.2);
          color: #7c4dff;
          padding: 0 8px;
          height: 24px;
          line-height: 22px;

          .el-tag__close {
            color: #7c4dff;

            &:hover {
              background-color: #7c4dff;
              color: #fff;
            }
          }
        }
      }
    }

    &.has-selection {
      background: #7c4dff;
      padding: 12px 16px;

      .selection-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;

        .selection-info {
          :deep(.el-checkbox) {
            --el-checkbox-text-color: white;
            --el-checkbox-input-border-color: white;
            --el-checkbox-checked-input-border-color: white;
            --el-checkbox-checked-bg-color: white;
            --el-checkbox-checked-icon-color: #7c4dff;
          }
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 16px;

          .el-button-group {
            .el-button {
              color: white;
              border-color: rgba(255, 255, 255, 0.3);
              background: transparent;
              padding: 8px 16px;
              display: flex;
              align-items: center;
              gap: 6px;

              &:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: white;
              }

              .el-icon {
                font-size: 16px;
              }

              & + .el-button {
                border-left-color: rgba(255, 255, 255, 0.3);

                &:hover {
                  border-left-color: white;
                }
              }
            }
          }

          .el-button--text {
            color: rgba(255, 255, 255, 0.8);
            
            &:hover {
              color: white;
            }
          }
        }
      }
    }
  }
  
  .selection-actions {
    background: #7c4dff;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    
    .selection-info {
      :deep(.el-checkbox) {
        --el-checkbox-text-color: white;
        --el-checkbox-input-border-color: white;
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
      
      .el-button {
        color: white;
        border-color: white;
        background: transparent;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
  
  .table-section {
    flex: 1;
    background: #1e2227;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
    min-height: 500px;
    
    :deep(.el-table) {
      flex: 1;
      background: transparent;
      border: none;
      overflow: auto;
      
      &::before,
      &::after {
        display: none;
      }
      
      .el-table__inner-wrapper {
        background: transparent;
      }
      
      th {
        background: #1a1d21 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: #8b949e;
        font-size: 12px;
        font-weight: 500;
        height: 40px;
        
        .cell {
          white-space: nowrap;
        }
        
        &.is-sortable:hover {
          color: #0066ff;
        }
      }
      
      td {
        background: transparent;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: #fff;
        height: 48px;
        padding: 8px 0;
        
        .cell {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      
      tr {
        background: transparent;
        
        &:hover > td {
          background: rgba(255, 255, 255, 0.02) !important;
        }
      }
      
      .el-table__empty-block {
        background: transparent;
        height: 480px;
      }

      .el-table__row {
        height: 48px;
      }

      .el-table__body-wrapper {
        min-height: 480px;
      }
    }
    
    .pagination-container {
      margin-top: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      min-height: 32px;
      width: 100%;
      box-sizing: border-box;
      background: #1e2227;
      
      .total-info {
        color: #8b949e;
      }
      
      :deep(.el-pagination) {
        --el-pagination-button-bg-color: transparent;
        --el-pagination-hover-color: #0066ff;
        --el-pagination-text-color: #8b949e;
        white-space: nowrap;
        
        .el-pagination__total {
          color: #8b949e;
          font-size: 13px;
        }

        .el-pagination__sizes {
          margin-right: 16px;
        }
        
        .el-input__wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: none;
          height: 32px;
        }
        
        .el-select:hover .el-input__wrapper {
          border-color: #0066ff;
        }
        
        button {
          height: 32px;
          min-width: 32px;
          
          &:not(:disabled):hover {
            color: #0066ff;
          }
        }
        
        .el-pager {
          li {
            height: 32px;
            min-width: 32px;
            line-height: 32px;
            background: transparent;
            color: #8b949e;
            font-size: 13px;
            
            &:hover {
              color: #0066ff;
            }
            
            &.is-active {
              color: #0066ff;
              background: rgba(0, 102, 255, 0.1);
            }
          }
        }

        .el-pagination__jump {
          color: #8b949e;
          margin-left: 16px;
          
          .el-input__inner {
            color: #fff;
            font-size: 13px;
          }
        }
      }
    }
  }
  
  .column-settings {
    height: 100%;
    padding: 16px 20px;
    
    .columns-list {
      height: 100%;
      overflow-y: auto;
      margin: 0 -20px;
      padding: 0 20px;

      .column-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        margin-bottom: 4px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        
        &:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        :deep(.el-checkbox) {
          --el-checkbox-checked-bg-color: #0066ff;
          --el-checkbox-checked-input-border-color: #0066ff;
          --el-checkbox-text-color: #fff;
          --el-checkbox-input-border-color: rgba(255, 255, 255, 0.3);

          .el-checkbox__label {
            font-size: 13px;
          }
        }

        .drag-handle {
          color: #8b949e;
          font-size: 16px;
          cursor: move;

          &:hover {
            color: #fff;
          }
        }
      }
    }
  }
}

.status-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .status-tabs {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    
    &::-webkit-scrollbar {
      display: none;
    }

    .tab-list {
      display: flex;
      min-width: min-content;
      height: 48px;
      padding: 0 8px;

      .tab-item {
        position: relative;
        padding: 0 24px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        
        &:hover {
          .tab-content {
            .tab-label {
              color: #fff;
            }
          }
        }

        .tab-content {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 8px;

          .tab-label {
            color: #8b949e;
            font-size: 13px;
            font-weight: 500;
            transition: color 0.2s;
          }

          .count-tag {
            padding: 0 8px;
            height: 20px;
            min-width: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 500;
            background: rgba(255, 255, 255, 0.04);
            color: #8b949e;

            &.warning {
              background: rgba(255, 171, 0, 0.1);
              color: #ffab00;
            }

            &.danger {
              background: rgba(255, 77, 79, 0.1);
              color: #ff4d4f;
            }
          }
        }

        .tab-line {
          position: absolute;
          bottom: 0;
          left: 24px;
          right: 24px;
          height: 2px;
          background: transparent;
          transition: background-color 0.2s;
        }

        &.active {
          .tab-content {
            .tab-label {
              color: #0066ff;
            }

            .count-tag {
              background: rgba(0, 102, 255, 0.1);
              color: #0066ff;

              &.warning {
                background: rgba(255, 171, 0, 0.1);
                color: #ffab00;
              }

              &.danger {
                background: rgba(255, 77, 79, 0.1);
                color: #ff4d4f;
              }
            }
          }

          .tab-line {
            background: #0066ff;
          }
        }
      }
    }
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: 1px;
    padding-right: 8px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);

    .action-btn {
      height: 48px;
      width: 48px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: #8b949e;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
      }

      .el-icon {
        font-size: 18px;
      }
    }
  }
}

:deep(.el-dropdown-menu) {
  background: #1a1d21;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  min-width: 220px;
  margin-top: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);

  .el-dropdown-menu__item {
    color: #8b949e;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 4px;
    line-height: 1.4;
    margin: 2px 0;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }

    &.is-active {
      color: #0066ff;
      background: rgba(0, 102, 255, 0.1);
    }

    // 子选项样式
    div[style*="padding-left"] {
      margin: -8px -16px;
      padding: 8px 16px 8px 36px;
      color: inherit;
      font-size: inherit;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  }
}

// 修改 Create 按钮样式
.action-buttons {
  .el-dropdown {
    .el-button--primary {
      background: #0066ff;
      border-color: #0066ff;
      padding: 0 16px;
      height: 32px;
      font-size: 13px;
      font-weight: normal;

      &:hover {
        background: #1a75ff;
        border-color: #1a75ff;
      }

      .el-icon {
        font-size: 12px;
        margin-left: 4px;
      }
    }
  }
}

// 添加右侧分页和视图切换按钮
.page-header {
  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .pagination-info {
      color: #8b949e;
      font-size: 13px;
    }

    .view-toggle {
      display: flex;
      align-items: center;
      gap: 4px;

      .el-button {
        height: 32px;
        width: 32px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #8b949e;

        &:hover, &.is-active {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
}

// 修改分页器样式，确保它始终在底部
.pagination-container {
  margin-top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 32px;
  width: 100%;
  box-sizing: border-box;
  background: #1e2227;
  
  :deep(.el-pagination) {
    --el-pagination-button-bg-color: transparent;
    --el-pagination-hover-color: #0066ff;
    --el-pagination-text-color: #8b949e;
    white-space: nowrap;
    font-size: 13px;
    
    .el-pagination__total {
      color: #8b949e;
      font-size: 13px;
    }

    .el-pagination__sizes {
      margin-right: 16px;
      
      .el-select {
        .el-input__wrapper {
          padding: 0 8px;
        }
      }
    }
    
    .el-input__wrapper {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: none;
      height: 32px;
    }
    
    .el-select:hover .el-input__wrapper {
      border-color: #0066ff;
    }
    
    button {
      height: 32px;
      min-width: 32px;
      
      &:not(:disabled):hover {
        color: #0066ff;
      }
    }
    
    .el-pager {
      li {
        height: 32px;
        min-width: 32px;
        line-height: 32px;
        background: transparent;
        color: #8b949e;
        font-size: 13px;
        
        &:hover {
          color: #0066ff;
        }
        
        &.is-active {
          color: #0066ff;
          background: rgba(0, 102, 255, 0.1);
        }
      }
    }

    .el-pagination__jump {
      color: #8b949e;
      margin-left: 16px;
      font-size: 13px;
      
      .el-input {
        margin: 0 8px;
        width: 50px;
        
        .el-input__inner {
          color: #fff;
          font-size: 13px;
          text-align: center;
          padding: 0 4px;
        }
      }
    }
  }
}

:deep(.column-settings-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .drawer-header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .drawer-title {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }

    .close-icon {
      font-size: 18px;
      color: #8b949e;
      cursor: pointer;

      &:hover {
        color: #fff;
      }
    }
  }
}

:deep(.el-table) {
  --el-table-border-color: rgba(255, 255, 255, 0.05);
  --el-table-header-bg-color: #1a1d21;
  --el-table-header-text-color: #8b949e;
  --el-table-text-color: #fff;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.02);

  .el-table__header {
    th.el-table__cell {
      .cell {
        padding: 0 0 0 8px;
      }
    }
  }

  .el-table__body {
    td.el-table__cell {
      .cell {
        padding: 0 0 0 8px;
      }
    }
  }

  .el-checkbox__inner {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.3);
    width: 14px;
    height: 14px;

    &:hover {
      border-color: #0066ff;
    }
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #0066ff;
    border-color: #0066ff;
  }

  .el-table__header {
    th.el-table__cell {
      .cell {
        font-weight: 500;
      }
    }
  }

  .el-table__row {
    td.el-table__cell {
      transition: background-color 0.2s;
    }

    &:hover td.el-table__cell {
      background-color: rgba(255, 255, 255, 0.02);
    }
  }
}

.order-table {
  :deep(.el-table__body) {
    td {
      .cell {
        white-space: nowrap;
      }
    }
  }

  .cell-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .order-id-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 4px;

    :deep(.el-checkbox) {
      margin-right: 0;
      .el-checkbox__inner {
        width: 14px;
        height: 14px;
      }
    }

    .order-id {
      color: #0066ff;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .order-id-link {
    color: #0066ff;
    cursor: pointer;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      color: #1a75ff;
      text-decoration: underline;
    }
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    
    &.status-ready {
      background: rgba(82, 196, 26, 0.1);
      color: #52c41a;
    }
    
    &.status-pending {
      background: rgba(250, 173, 20, 0.1);
      color: #faad14;
    }
    
    &.status-exception {
      background: rgba(255, 77, 79, 0.1);
      color: #ff4d4f;
    }
    
    &.status-shipped {
      background: rgba(24, 144, 255, 0.1);
      color: #1890ff;
    }
    
    &.status-cancelled {
      background: rgba(140, 140, 140, 0.1);
      color: #8c8c8c;
    }
  }

  .exception-tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(255, 77, 79, 0.1);
    color: #ff4d4f;
  }

  .status-info-tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(255, 77, 79, 0.1);
    color: #ff4d4f;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 8px;
    border-radius: 10px;
    font-size: 12px;
    background: rgba(0, 102, 255, 0.1);
    color: #0066ff;
    margin-right: 4px;
    
    &:last-child {
      margin-right: 0;
    }
  }

  .number {
    font-family: 'Roboto Mono', monospace;
    color: #fff;
  }

  .amount {
    font-family: 'Roboto Mono', monospace;
    color: #fff;
    font-weight: 500;
  }

  .cell-content {
    display: flex;
    align-items: center;
    min-height: 32px;
    
    &.cell-total,
    &.cell-totalQuantity,
    &.cell-lineItemCount {
      justify-content: flex-end;
    }
  }
}

.dialog-footer {
  padding: 20px 0 0;
  text-align: right;
  border-top: 1px solid var(--el-border-color-lighter);
}

.pull-dialog-content {
  padding: 0 20px;
}

.pull-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.section-content {
  padding: 0 12px;
}

.pull-type-group {
  width: 100%;
  display: flex;
  
  :deep(.el-radio-button__inner) {
    flex: 1;
    text-align: center;
  }
}

.preview-dialog-content {
  padding: 0 20px;
}

.preview-summary {
  display: flex;
  gap: 32px;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .label {
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  .value {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);

    &.text-success {
      color: var(--el-color-success);
    }

    &.text-warning {
      color: var(--el-color-warning);
    }
  }
}

.preview-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin-bottom: 0;

    &.text-danger {
      color: var(--el-color-danger);
    }
  }
}

.selection-summary {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .summary-text {
    font-size: 13px;
    color: #8b949e;
  }
}

.error-text {
  color: #ff4d4f;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  text-align: left;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.required-mark {
  color: var(--el-color-danger);
  margin-left: 4px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 0;
  display: flex;
  align-items: center;

  &.text-danger {
    color: var(--el-color-danger);
  }
}

.error-dialog-content {
  padding: 20px;
}

.failed-orders-list {
  margin-top: 16px;

  .list-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }
}
</style> 