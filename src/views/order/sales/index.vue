<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <h1>Sales Order</h1>
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
              <!-- 通用操作（始终可见） -->
              <el-dropdown-item command="create">
                <el-icon><Plus /></el-icon>
                New Order
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
        <el-button 
          type="primary" 
          class="ship-button"
          :disabled="!canShipOrder"
          @click="handleShipOrder"
        >
          Ship Order
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-title">SEARCH BY</div>
      <el-form :model="searchForm" class="search-form">
        <el-form-item>
          <div class="tags-input-wrapper">
            <div class="tags-input-field">
              <div class="tags-list-container">
                <div class="tags-list" v-show="orderNoTags.length > 0">
                  <el-tag 
                    v-for="(tag, index) in orderNoTags" 
                    :key="index" 
                    closable 
                    @close="removeOrderNoTag(tag)"
                    size="small"
                    class="tag-item"
                    @click="editOrderNoTag(tag, index)"
                  >
                    {{ tag }}
                  </el-tag>
                  <span v-if="orderNoTags.length > 10" class="more-tags">
                    +{{ orderNoTags.length - 10 }} more
                  </span>
                </div>
                <input
                  class="tags-input"
                  v-model="orderNoInput"
                  placeholder="Order No. (Press Enter to add multiple)"
                  @keydown.enter.prevent="addOrderNoTag"
                  @paste="handlePaste($event, 'orderNo')"
                  ref="orderNoInputRef"
                />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="tags-input-wrapper">
            <div class="tags-input-field">
              <div class="tags-list-container">
                <div class="tags-list" v-show="channelOrderNoTags.length > 0">
                  <el-tag 
                    v-for="(tag, index) in channelOrderNoTags" 
                    :key="index" 
                    closable 
                    @close="removeChannelOrderNoTag(tag)"
                    size="small"
                    class="tag-item"
                    @click="editChannelOrderNoTag(tag, index)"
                  >
                    {{ tag }}
                  </el-tag>
                  <span v-if="channelOrderNoTags.length > 10" class="more-tags">
                    +{{ channelOrderNoTags.length - 10 }} more
                  </span>
                </div>
                <input
                  class="tags-input"
                  v-model="channelOrderNoInput"
                  placeholder="Channel Sales Order No. (Press Enter to add multiple)"
                  @keydown.enter.prevent="addChannelOrderNoTag"
                  @paste="handlePaste($event, 'channelOrderNo')"
                  ref="channelOrderNoInputRef"
                />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.channel"
            placeholder="Channel"
            clearable
          >
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.carrier"
            placeholder="Carrier"
            clearable
          >
            <el-option
              v-for="item in carrierOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="filter-options">
        <el-switch
          v-model="searchForm.onlySingleUnit"
          active-text="Only Show Single Unit Orders"
          inactive-text="Only Show Single Unit Orders"
          style="--el-switch-off-color: var(--component-bg)"
          inline-prompt
        />
      </div>
    </div>

    <!-- 状态过滤器 -->
    <div class="status-filter">
      <el-radio-group v-model="currentStatus">
        <el-radio-button label="all">All({{ getTotalByStatus('all') }})</el-radio-button>
        <el-radio-button label="imported">Imported({{ getTotalByStatus(OrderStatus.Imported) }})</el-radio-button>
        <el-radio-button label="pending">Pending({{ getTotalByStatus(OrderStatus.Pending) }})</el-radio-button>
        <el-radio-button label="allocated">Allocated({{ getTotalByStatus(OrderStatus.Allocated) }})</el-radio-button>
        <el-radio-button label="exception">Exception({{ getTotalByStatus(OrderStatus.Exception) }})</el-radio-button>
        <el-radio-button label="deallocated">Deallocated({{ getTotalByStatus(OrderStatus.Deallocated) }})</el-radio-button>
        <el-radio-button label="cancelling">Cancelling({{ getTotalByStatus(OrderStatus.Cancelling) }})</el-radio-button>
        <el-radio-button label="cancelled">Cancelled({{ getTotalByStatus(OrderStatus.Cancelled) }})</el-radio-button>
        <el-radio-button label="warehouse_processing">Warehouse Processing({{ getTotalByStatus(OrderStatus.WarehouseProcessing) }})</el-radio-button>
        <el-radio-button label="shipped">Shipped({{ getTotalByStatus(OrderStatus.Shipped) }})</el-radio-button>
        <el-radio-button label="completed">Completed({{ getTotalByStatus(OrderStatus.Completed) }})</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55" reserve-selection />
        <el-table-column label="CHANNEL" min-width="120">
          <template #default="{ row }">
            <div class="channel-cell">
              <span class="channel-name">{{ row.channel }}</span>
              <span class="channel-subname">{{ row.channelName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="ORDER NO." min-width="150">
          <template #default="{ row }">
            <el-link 
              type="primary" 
              @click="handleOrderDetail(row)"
            >
              {{ row.orderNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column 
          label="CHANNEL SALES ORDER NO." 
          prop="channelOrderNo" 
          min-width="180" 
        />
        <el-table-column label="STATUS" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="RECIPIENT" prop="recipient" min-width="150" />
        <el-table-column label="COUNTRY" prop="country" min-width="120" />
        <el-table-column 
          label="PURCHASE ORDER ID" 
          prop="purchaseOrderId" 
          min-width="180" 
        />
        <el-table-column label="REFERENCE NO." prop="referenceNo" min-width="150" />
        <el-table-column label="CARRIER" prop="carrier" min-width="120" />
        <el-table-column label="ORDER DATE" min-width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.orderDate) }}
          </template>
        </el-table-column>
        <el-table-column label="GRAND TOTAL" min-width="120">
          <template #default="{ row }">
            ${{ row.grandTotal.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="SHIP DATE" min-width="180">
          <template #default="{ row }">
            {{ row.shipDate ? formatDateTime(row.shipDate) : '...' }}
          </template>
        </el-table-column>
        <el-table-column label="PRODUCT" prop="product" min-width="120" />
        <el-table-column label="RETURN STATUS" min-width="120">
          <template #default="{ row }">
            <el-tag 
              v-if="row.returnStatus"
              :type="getReturnStatusType(row.returnStatus)"
            >
              {{ row.returnStatus }}
            </el-tag>
            <span v-else>-</span>
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

    <action-dialogs
      ref="actionDialogsRef"
      :current-order="selectedRows[0]"
      @allocate="handleAllocate"
      @hold="handleHold"
      @cancel="handleCancel"
      @reopen="handleReopen"
      @deallocate="handleDeallocate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import {
  Download,
  Search,
  Refresh,
  Plus,
  Upload,
  Document,
  ArrowDown,
  ArrowUp,
  Close
} from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { OrderStatus, OrderAction, STATUS_CONFIG, type OrderItem, FulfillmentMode } from './types'
import ActionDialogs from './components/ActionDialogs.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ReturnOrderStatus } from '@/views/return/types'

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  channelOrderNo: '',
  channel: '',
  carrier: '',
  onlySingleUnit: false
})

// 批量输入相关
const orderNoInput = ref('')
const channelOrderNoInput = ref('')
const orderNoTags = ref<string[]>([])
const channelOrderNoTags = ref<string[]>([])
const orderNoInputRef = ref<HTMLInputElement | null>(null)
const channelOrderNoInputRef = ref<HTMLInputElement | null>(null)
const editingOrderNoIndex = ref(-1)
const editingChannelOrderNoIndex = ref(-1)

// 监听标签数量变化，检查是否需要显示更多标签
const checkTagsOverflow = () => {
  // 此函数保留以便将来可能的扩展
  // 当前的实现中不再需要特别检查溢出，但函数调用保留在现有代码中
}

// 编辑订单号标签
const editOrderNoTag = (tag: string, index: number) => {
  // 将标签内容放入输入框
  orderNoInput.value = tag
  // 标记正在编辑的标签索引
  editingOrderNoIndex.value = index
  // 删除原标签
  orderNoTags.value.splice(index, 1)
  // 更新搜索表单
  searchForm.orderNo = orderNoTags.value.join(',')
  // 聚焦输入框
  setTimeout(() => {
    orderNoInputRef.value?.focus()
  }, 10)
}

// 编辑渠道订单号标签
const editChannelOrderNoTag = (tag: string, index: number) => {
  // 将标签内容放入输入框
  channelOrderNoInput.value = tag
  // 标记正在编辑的标签索引
  editingChannelOrderNoIndex.value = index
  // 删除原标签
  channelOrderNoTags.value.splice(index, 1)
  // 更新搜索表单
  searchForm.channelOrderNo = channelOrderNoTags.value.join(',')
  // 聚焦输入框
  setTimeout(() => {
    channelOrderNoInputRef.value?.focus()
  }, 10)
}

// 修改添加标签的函数，支持编辑模式
const addOrderNoTag = () => {
  const value = orderNoInput.value.trim()
  if (value && !orderNoTags.value.includes(value)) {
    // 如果是编辑模式，插入到原来的位置
    if (editingOrderNoIndex.value >= 0) {
      orderNoTags.value.splice(editingOrderNoIndex.value, 0, value)
      editingOrderNoIndex.value = -1
    } else {
      orderNoTags.value.push(value)
    }
    searchForm.orderNo = orderNoTags.value.join(',')
    orderNoInput.value = ''
    // 自动触发搜索
    fetchData()
    // 检查是否需要显示更多标签
    checkTagsOverflow()
    // 保持焦点在输入框
    setTimeout(() => {
      orderNoInputRef.value?.focus()
    }, 10)
  }
}

// 修改添加渠道订单号标签的函数，支持编辑模式
const addChannelOrderNoTag = () => {
  const value = channelOrderNoInput.value.trim()
  if (value && !channelOrderNoTags.value.includes(value)) {
    // 如果是编辑模式，插入到原来的位置
    if (editingChannelOrderNoIndex.value >= 0) {
      channelOrderNoTags.value.splice(editingChannelOrderNoIndex.value, 0, value)
      editingChannelOrderNoIndex.value = -1
    } else {
      channelOrderNoTags.value.push(value)
    }
    searchForm.channelOrderNo = channelOrderNoTags.value.join(',')
    channelOrderNoInput.value = ''
    // 自动触发搜索
    fetchData()
    // 检查是否需要显示更多标签
    checkTagsOverflow()
    // 保持焦点在输入框
    setTimeout(() => {
      channelOrderNoInputRef.value?.focus()
    }, 10)
  }
}

// 处理粘贴事件
const handlePaste = (event: ClipboardEvent, type: 'orderNo' | 'channelOrderNo') => {
  event.preventDefault()
  const pasteText = event.clipboardData?.getData('text') || ''
  if (!pasteText) return
  
  // 按行分割并过滤空行
  const lines = pasteText.split(/[\n,;\s]+/).filter(line => line.trim())
  
  if (lines.length) {
    if (type === 'orderNo') {
      // 添加到订单号标签
      lines.forEach(line => {
        const trimmed = line.trim()
        if (trimmed && !orderNoTags.value.includes(trimmed)) {
          orderNoTags.value.push(trimmed)
        }
      })
      searchForm.orderNo = orderNoTags.value.join(',')
      // 检查是否需要显示展开按钮
      checkTagsOverflow()
      // 自动聚焦输入框
      setTimeout(() => {
        orderNoInputRef.value?.focus()
      }, 10)
    } else {
      // 添加到渠道订单号标签
      lines.forEach(line => {
        const trimmed = line.trim()
        if (trimmed && !channelOrderNoTags.value.includes(trimmed)) {
          channelOrderNoTags.value.push(trimmed)
        }
      })
      searchForm.channelOrderNo = channelOrderNoTags.value.join(',')
      // 检查是否需要显示展开按钮
      checkTagsOverflow()
      // 自动聚焦输入框
      setTimeout(() => {
        channelOrderNoInputRef.value?.focus()
      }, 10)
    }
    
    // 自动触发搜索
    fetchData()
  }
}

// 选项数据
const channelOptions = [
  { label: 'SHOPIFY', value: 'SHOPIFY' },
  { label: 'AMAZON', value: 'AMAZON' },
  { label: 'EBAY', value: 'EBAY' }
]

const carrierOptions = [
  { label: 'DHL', value: 'DHL' },
  { label: 'UPS', value: 'UPS' },
  { label: 'FEDEX', value: 'FEDEX' }
]

// 状态过滤
const currentStatus = ref('all')

// 表格数据
const loading = ref(false)
const tableData = ref<OrderItem[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(74)

// 引用操作对话框组件
const actionDialogsRef = ref()
const currentOrder = ref<OrderItem | null>(null)
const selectedRows = ref<OrderItem[]>([])
const router = useRouter()

// 模拟数据
const mockTableData: OrderItem[] = [
  {
    id: '1',
    channel: 'SHOPIFY',
    channelName: 'test-store-1',
    orderNo: 'SO00184716',
    channelOrderNo: '109',
    status: OrderStatus.Imported,
    recipient: 'Bagwell Diane',
    country: 'US',
    purchaseOrderId: 'abc37',
    referenceNo: 'abc37',
    carrier: 'DHL',
    orderDate: '2024-03-19T07:55:00',
    grandTotal: 4.10,
    shipDate: null,
    product: 'Product A',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '2',
    channel: 'AMAZON',
    channelName: 'amazon-store',
    orderNo: 'SO00184654',
    channelOrderNo: 'AMZ-123',
    status: OrderStatus.Pending,
    recipient: 'John Smith',
    country: 'UK',
    purchaseOrderId: 'PO-126356030',
    referenceNo: 'REF-126356030',
    carrier: 'UPS',
    orderDate: '2024-03-18T07:12:00',
    grandTotal: 13.00,
    shipDate: null,
    product: 'Product B',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '3',
    channel: 'SHOPIFY',
    channelName: 'test-store-2',
    orderNo: 'SO00184655',
    channelOrderNo: '110',
    status: OrderStatus.Allocated,
    recipient: 'John Doe',
    country: 'US',
    purchaseOrderId: 'abc38',
    referenceNo: 'abc38',
    carrier: 'DHL',
    orderDate: '2024-03-18T08:30:00',
    grandTotal: 25.50,
    shipDate: null,
    product: 'Product C',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '4',
    channel: 'EBAY',
    channelName: 'ebay-store',
    orderNo: 'SO00184656',
    channelOrderNo: 'EB-456',
    status: OrderStatus.Exception,
    recipient: 'Mary Johnson',
    country: 'CA',
    purchaseOrderId: 'PO-456',
    referenceNo: 'REF-456',
    carrier: 'FEDEX',
    orderDate: '2024-03-17T10:30:00',
    grandTotal: 45.99,
    shipDate: null,
    product: 'Product D',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '5',
    channel: 'SHOPIFY',
    channelName: 'test-store-1',
    orderNo: 'SO00184657',
    channelOrderNo: '111',
    status: OrderStatus.Deallocated,
    recipient: 'Sarah Wilson',
    country: 'US',
    purchaseOrderId: 'abc39',
    referenceNo: 'abc39',
    carrier: 'DHL',
    orderDate: '2024-03-16T15:20:00',
    grandTotal: 32.75,
    shipDate: null,
    product: 'Product E',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '6',
    channel: 'AMAZON',
    channelName: 'amazon-store',
    orderNo: 'SO00184658',
    channelOrderNo: 'AMZ-124',
    status: OrderStatus.Cancelling,
    recipient: 'Robert Brown',
    country: 'US',
    purchaseOrderId: 'PO-789',
    referenceNo: 'REF-789',
    carrier: 'UPS',
    orderDate: '2024-03-15T09:45:00',
    grandTotal: 67.50,
    shipDate: null,
    product: 'Product F',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '7',
    channel: 'EBAY',
    channelName: 'ebay-store',
    orderNo: 'SO00184659',
    channelOrderNo: 'EB-457',
    status: OrderStatus.Cancelled,
    recipient: 'Emily Davis',
    country: 'UK',
    purchaseOrderId: 'PO-457',
    referenceNo: 'REF-457',
    carrier: 'FEDEX',
    orderDate: '2024-03-14T14:15:00',
    grandTotal: 19.99,
    shipDate: null,
    product: 'Product G',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '8',
    channel: 'SHOPIFY',
    channelName: 'test-store-2',
    orderNo: 'SO00184660',
    channelOrderNo: '112',
    status: OrderStatus.WarehouseProcessing,
    recipient: 'Michael Lee',
    country: 'US',
    purchaseOrderId: 'abc40',
    referenceNo: 'abc40',
    carrier: 'DHL',
    orderDate: '2024-03-13T11:30:00',
    grandTotal: 88.25,
    shipDate: null,
    product: 'Product H',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '9',
    channel: 'AMAZON',
    channelName: 'amazon-store',
    orderNo: 'SO00184661',
    channelOrderNo: 'AMZ-125',
    status: OrderStatus.Shipped,
    recipient: 'Lisa Anderson',
    country: 'CA',
    purchaseOrderId: 'PO-125',
    referenceNo: 'REF-125',
    carrier: 'UPS',
    orderDate: '2024-03-12T16:20:00',
    grandTotal: 54.99,
    shipDate: '2024-03-13T10:00:00',
    product: 'Product I',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  },
  {
    id: '10',
    channel: 'SHOPIFY',
    channelName: 'test-store-1',
    orderNo: 'SO00184662',
    channelOrderNo: '113',
    status: OrderStatus.Completed,
    recipient: 'David Miller',
    country: 'US',
    purchaseOrderId: 'abc41',
    referenceNo: 'abc41',
    carrier: 'DHL',
    orderDate: '2024-03-11T13:45:00',
    grandTotal: 129.99,
    shipDate: '2024-03-12T09:30:00',
    product: 'Product J',
    fulfillmentMode: FulfillmentMode.Manual,
    subOrders: []
  }
]

tableData.value = mockTableData

// 方法
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    [OrderStatus.Imported]: 'info',
    [OrderStatus.Pending]: 'warning',
    [OrderStatus.Allocated]: 'success',
    [OrderStatus.Exception]: 'danger',
    [OrderStatus.Deallocated]: 'info',
    [OrderStatus.Cancelling]: 'warning',
    [OrderStatus.Cancelled]: 'danger',
    [OrderStatus.WarehouseProcessing]: 'primary',
    [OrderStatus.Shipped]: 'success',
    [OrderStatus.Completed]: 'success'
  }
  return types[status] || 'info'
}

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}

// 计算可用的操作
const availableActions = computed(() => {
  if (!selectedRows.value.length) return []
  
  // 如果选中多行，只返回所有选中状态共同的可用操作
  const commonActions = selectedRows.value.reduce((actions, row) => {
    const statusActions = STATUS_CONFIG[row.status].availableActions
    if (!actions) return new Set(statusActions)
    return new Set(Array.from(actions).filter(action => statusActions.includes(action)))
  }, null as Set<OrderAction> | null)

  return Array.from(commonActions || [])
})

// 是否有可用操作
const hasAvailableActions = computed(() => availableActions.value.length > 0)

// 获取操作标签
const getActionLabel = (action: OrderAction) => {
  const labels: Record<OrderAction, string> = {
    [OrderAction.Allocate]: 'Allocate',
    [OrderAction.Pend]: 'Hold',
    [OrderAction.Cancel]: 'Cancel',
    [OrderAction.Edit]: 'Edit',
    [OrderAction.Deallocate]: 'Deallocate',
    [OrderAction.Dispatch]: 'Dispatch',
    [OrderAction.Reopen]: 'Reopen',
    [OrderAction.Split]: 'Split',
    [OrderAction.Merge]: 'Merge'
  }
  return labels[action]
}

// 处理操作
const handleAction = (action: OrderAction | string) => {
  if (!actionDialogsRef.value) return

  switch (action) {
    // 通用操作
    case 'create':
      router.push('/order/sales/create')
      break
    case 'import':
      // TODO: 实现导入功能
      ElMessage.info('Import feature coming soon')
      break
    case 'rawData':
      // TODO: 实现查看原始数据功能
      ElMessage.info('Raw data feature coming soon')
      break
    // 状态相关操作
    case OrderAction.Allocate:
      actionDialogsRef.value?.openAllocateDialog()
      break
    case OrderAction.Pend:
      actionDialogsRef.value?.openHoldDialog()
      break
    case OrderAction.Cancel:
      actionDialogsRef.value?.openCancelDialog()
      break
    case OrderAction.Deallocate:
      actionDialogsRef.value?.openDeallocateDialog()
      break
    case OrderAction.Edit:
      handleEdit()
      break
    case OrderAction.Reopen:
      actionDialogsRef.value?.openReopenDialog()
      break
  }
}

// 处理分仓确认
const handleAllocate = (data: any) => {
  console.log('Allocate:', data)
  // TODO: 调用分仓 API
  ElMessage.success('Order allocated successfully')
  // 刷新列表
  fetchData()
}

// 处理挂起确认
const handleHold = (data: any) => {
  console.log('Hold:', data)
  // TODO: 调用挂起 API
  ElMessage.success('Order held successfully')
  // 刷新列表
  fetchData()
}

// 处理取消确认
const handleCancel = (data: any) => {
  console.log('Cancel:', data)
  // TODO: 调用取消 API
  ElMessage.success('Order cancelled successfully')
  // 刷新列表
  fetchData()
}

// 处理重开确认
const handleReopen = (data: any) => {
  console.log('Reopen:', data)
  // TODO: 调用重开 API
  ElMessage.success('Order reopened successfully')
  // 刷新列表
  fetchData()
}

// 处理解除分仓确认
const handleDeallocate = (data: any) => {
  console.log('Deallocate:', data)
  // TODO: 调用解除分仓 API
  ElMessage.success('Order deallocated successfully')
  // 刷新列表
  fetchData()
}

// 处理编辑
const handleEdit = () => {
  if (!selectedRows.value.length) return
  const orderId = selectedRows.value[0].id
  router.push(`/order/sales/edit/${orderId}`)
}

// 模拟获取数据
const fetchData = () => {
  // TODO: 实现获取数据的逻辑
  console.log('Fetching data...')
}

// 表格选择改变
const handleSelectionChange = (rows: OrderItem[]) => {
  selectedRows.value = rows
}

// 获取可用的批量操作
const getAvailableActions = () => {
  if (selectedRows.value.length === 0) return []
  
  // 使用最后选中的订单状态
  const lastSelectedStatus = selectedRows.value[selectedRows.value.length - 1].status
  return STATUS_CONFIG[lastSelectedStatus].availableActions
}

// 处理批量操作
const handleBatchAction = (action: OrderAction) => {
  if (selectedRows.value.length === 0) return
  
  // 使用最后选中的订单作为当前操作订单
  currentOrder.value = selectedRows.value[selectedRows.value.length - 1]
  
  switch (action) {
    case OrderAction.Allocate:
    case OrderAction.Dispatch:
      actionDialogsRef.value?.openAllocateDialog()
      break
    case OrderAction.Pend:
      actionDialogsRef.value?.openHoldDialog()
      break
    case OrderAction.Cancel:
      actionDialogsRef.value?.openCancelDialog()
      break
    case OrderAction.Deallocate:
      actionDialogsRef.value?.openDeallocateDialog()
      break
    case OrderAction.Edit:
      handleEdit()
      break
  }
}

const handleOrderDetail = (row: OrderItem) => {
  // 跳转到订单详情页
  router.push(`/order/sales/${row.orderNo}`)
}

// 添加获取状态数量的方法
const getTotalByStatus = (status: string) => {
  if (status === 'all') {
    return tableData.value.length
  }
  return tableData.value.filter(item => item.status === status).length
}

// 添加是否可以发货的计算属性
const canShipOrder = computed(() => {
  if (!selectedRows.value.length) return false
  
  // 检查是否所有选中的订单都可以发货
  return selectedRows.value.every(row => 
    row.status === OrderStatus.Allocated || 
    row.status === OrderStatus.WarehouseProcessing
  )
})

// 处理发货操作
const handleShipOrder = () => {
  if (!selectedRows.value.length) return
  // TODO: 实现发货逻辑
  ElMessage.success('Orders shipped successfully')
}

// 获取退货状态类型
const getReturnStatusType = (status?: ReturnOrderStatus) => {
  if (!status) return ''
  const types: Record<ReturnOrderStatus, string> = {
    [ReturnOrderStatus.Created]: 'info',
    [ReturnOrderStatus.Pending]: 'warning',
    [ReturnOrderStatus.Approved]: 'success',
    [ReturnOrderStatus.Processing]: 'primary',
    [ReturnOrderStatus.Shipped]: 'info',
    [ReturnOrderStatus.Received]: 'success',
    [ReturnOrderStatus.Refunded]: 'success',
    [ReturnOrderStatus.Completed]: 'success',
    [ReturnOrderStatus.Cancelled]: 'danger'
  }
  return types[status] || ''
}

// 移除订单号标签
const removeOrderNoTag = (tag: string) => {
  const index = orderNoTags.value.indexOf(tag)
  if (index > -1) {
    orderNoTags.value.splice(index, 1)
    searchForm.orderNo = orderNoTags.value.join(',')
    // 自动触发搜索
    fetchData()
    // 检查是否需要显示更多标签
    checkTagsOverflow()
    // 保持焦点在输入框
    setTimeout(() => {
      orderNoInputRef.value?.focus()
    }, 10)
  }
}

// 移除渠道订单号标签
const removeChannelOrderNoTag = (tag: string) => {
  const index = channelOrderNoTags.value.indexOf(tag)
  if (index > -1) {
    channelOrderNoTags.value.splice(index, 1)
    searchForm.channelOrderNo = channelOrderNoTags.value.join(',')
    // 自动触发搜索
    fetchData()
    // 检查是否需要显示更多标签
    checkTagsOverflow()
    // 保持焦点在输入框
    setTimeout(() => {
      channelOrderNoInputRef.value?.focus()
    }, 10)
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  min-height: 100vh;
  background: var(--app-bg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}

.search-section {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .search-title {
    color: var(--text-secondary);
    font-size: 12px;
    margin-bottom: 16px;
  }

  .search-form {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 16px;

    .el-form-item {
      margin: 0;
      flex: 1;
      min-width: 200px;
    }
  }

  .filter-options {
    display: flex;
    align-items: center;
    gap: 16px;
    
    :deep(.el-switch) {
      --el-switch-on-color: var(--primary-color);
      
      .el-switch__label {
        color: var(--text-secondary);
      }
    }
  }
  
  .tags-input-wrapper {
    width: 100%;
    
    .tags-input-field {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 36px;
      height: 36px;
      padding: 6px 12px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--component-bg);
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease;
      
      &:focus-within {
        height: auto;
        min-height: 36px;
        padding: 8px 12px;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px rgba(var(--el-color-primary-rgb), 0.2);
      }
      
      .tags-list-container {
        width: 100%;
        position: relative;
        
        .tags-list {
          display: flex;
          flex-wrap: nowrap;
          gap: 4px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          height: 24px;
          align-items: center;
          margin-bottom: 4px;
          
          &:empty {
            margin-bottom: 0;
            display: none;
          }
          
          .tag-item {
            flex-shrink: 0;
            margin: 0 2px 0 0;
            background-color: rgba(var(--el-color-primary-rgb), 0.1);
            border-color: rgba(var(--el-color-primary-rgb), 0.2);
            color: var(--primary-color);
            cursor: pointer;
            transition: all 0.2s ease;
            
            &:hover {
              background-color: rgba(var(--el-color-primary-rgb), 0.2);
            }
          }
          
          .more-tags {
            display: inline-block;
            margin-left: 4px;
            font-size: 12px;
            color: var(--primary-color);
            font-weight: 500;
            cursor: pointer;
            align-self: center;
            flex-shrink: 0;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
        
        .tags-input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          height: 24px;
          line-height: 24px;
          color: var(--text-primary);
          padding: 0;
          font-size: 14px;
          
          &::placeholder {
            color: var(--text-secondary);
            opacity: 0.95;
          }
        }
      }
      
      &:focus-within {
        .tags-list-container {
          .tags-list {
            flex-wrap: wrap;
            white-space: normal;
            height: auto;
            width: 100%;
          }
        }
      }
    }
  }
}

.status-filter {
  margin-bottom: 16px;

  :deep(.el-radio-button__inner) {
    background: var(--component-bg);
    border-color: var(--border-color);
    color: var(--text-secondary);
    
    &:hover {
      color: var(--primary-color);
    }
  }

  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
  }
}

.table-section {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 16px;

  .channel-cell {
    display: flex;
    flex-direction: column;

    .channel-name {
      color: var(--text-primary);
      font-weight: 500;
    }

    .channel-subname {
      color: var(--text-secondary);
      font-size: 12px;
    }
  }
}

:deep(.el-table) {
  --el-table-border-color: var(--border-color);
  --el-table-header-bg-color: var(--component-bg);
  
  th {
    background: var(--component-bg) !important;
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
  }
  
  td {
    color: var(--text-primary);
  }
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .total-info {
    color: var(--text-secondary);
    font-size: 14px;
  }
}

:deep(.el-pagination) {
  --el-pagination-button-bg-color: var(--component-bg);
  --el-pagination-hover-color: var(--primary-color);
  
  .el-pagination__sizes {
    margin-right: 16px;
  }
  
  .el-input__wrapper {
    background: var(--component-bg);
  }
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;

  .export-button {
    .el-icon {
      margin-right: 4px;
    }
  }

  .ship-button {
    background-color: var(--el-color-success);
    border-color: var(--el-color-success);
    
    &:hover {
      background-color: var(--el-color-success-light-3);
      border-color: var(--el-color-success-light-3);
    }
    
    &:disabled {
      background-color: var(--el-color-success-light-5);
      border-color: var(--el-color-success-light-5);
    }
  }

  :deep(.el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;

    .el-icon {
      margin-right: 0;
    }

    &.is-disabled {
      opacity: 0.6;
    }
  }
}
</style> 