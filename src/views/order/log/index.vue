<script lang="ts" setup>
import { ref, h, reactive, computed, watch, defineExpose } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ArrowDown, Refresh, View, Warning } from '@element-plus/icons-vue'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { formatDate } from '@/utils/date'

// Form ref
const searchFormRef = ref<FormInstance>()

// 定义搜索表单接口
interface SearchFormData {
  orderNo: string
  channelOrderNo: string
  channels: string[]
  eventType: EventTypeValue | ''  // 允许空字符串作为初始值
  eventSubtype: string
  eventTimeRange: [Date | null, Date | null]
  omsStatus: string
  operator: string
  dispatchNo: string
  exceptionStatus: string
}

// 定义日期快捷选项类型
interface DateShortcut {
  text: string
  value: () => [Date, Date]
}

// 日期快捷选项
const dateShortcuts: DateShortcut[] = [
  {
    text: 'Last 24 hours',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: 'Last 7 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]

// 类型定义
interface SearchForm {
  orderNo: string
  eventType: string
  eventSubtype: string
  timeRange: [string, string] | null
  actionBy: string
  channel?: string
  omsStatus?: string
}

interface OrderLogRow {
  omsOrderNo: string
  channelOrderNo: string
  channel: string
  createdFrom: 'DI' | 'API' | 'Manual'
  eventType: string
  eventSubtype: string
  description: string
  eventTime: string
  involvedEntities: {
    channel?: string
    subOrder?: string
    warehouse?: string
    rule?: string
    weight?: string
    packer?: string
    carrier?: string
    trackingNo?: string
    signer?: string
    refund?: string
    sku?: string
    operator?: string
    reason?: string
  }
  omsStatus: string
  actionBy: string
  suggestion?: string
}

// 搜索表单
const searchForm = reactive<SearchFormData>({
  orderNo: '',
  channelOrderNo: '',
  channels: [],
  eventType: '',  // 初始值为空字符串
  eventSubtype: '',
  eventTimeRange: [null, null],
  omsStatus: '',
  operator: '',
  dispatchNo: '',
  exceptionStatus: ''
})

// 渠道选项
const channelOptions = [
  { label: 'Shopify', value: 'Shopify' },
  { label: 'Amazon', value: 'Amazon' },
  { label: 'WooCommerce', value: 'WooCommerce' },
  { label: 'Walmart', value: 'Walmart' }
]

// 定义事件类型和子类型的接口
interface EventOption {
  label: string
  value: EventTypeValue
}

// 子类型选项接口
interface SubtypeOption {
  label: string
  value: string
}

// 使用字面量类型来限制可能的值
type EventTypeValue = 'Created' | 'Dispatched' | 'Updated' | 'Cancelled' | 'Exception' | 'Hold' | 'WMS' | 'Transport' | 'AfterSale'

// 事件类型选项
const eventTypeOptions: EventOption[] = [
  { label: 'Created', value: 'Created' },
  { label: 'Dispatched', value: 'Dispatched' },
  { label: 'Updated', value: 'Updated' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Exception', value: 'Exception' },
  { label: 'Hold', value: 'Hold' },
  { label: 'WMS', value: 'WMS' },
  { label: 'Transport', value: 'Transport' },
  { label: 'AfterSale', value: 'AfterSale' }
]

// 事件子类型映射
const eventSubtypeMap: Record<EventTypeValue, SubtypeOption[]> = {
  Created: [
    { label: 'Created by DI', value: 'CreatedByDI' },
    { label: 'Created Manually', value: 'CreatedManually' }
  ],
  Dispatched: [
    { label: 'Auto Dispatch', value: 'AutoDispatch' },
    { label: 'Manual Dispatch', value: 'ManualDispatch' },
    { label: 'Deallocated', value: 'Deallocated' }
  ],
  Updated: [
    { label: 'Address Updated', value: 'AddressUpdated' },
    { label: 'Status Updated', value: 'StatusUpdated' },
    { label: 'Items Updated', value: 'ItemsUpdated' }
  ],
  Cancelled: [
    { label: 'Auto Cancelled', value: 'AutoCancelled' },
    { label: 'Manual Cancelled', value: 'ManualCancelled' }
  ],
  Exception: [
    { label: 'Address Invalid', value: 'AddressInvalid' },
    { label: 'Stock Insufficient', value: 'StockInsufficient' },
    { label: 'System Error', value: 'SystemError' }
  ],
  Hold: [
    { label: 'Hold Reason', value: 'HoldReason' }
  ],
  WMS: [
    { label: 'Packed', value: 'Packed' },
    { label: 'Shipped', value: 'Shipped' }
  ],
  Transport: [
    { label: 'Delivered', value: 'Delivered' }
  ],
  AfterSale: [
    { label: 'Refund', value: 'Refund' },
    { label: 'SKU', value: 'SKU' }
  ]
}

// 当前可选的子类型选项
const currentSubtypeOptions = computed(() => {
  if (!searchForm.eventType) return []
  return eventSubtypeMap[searchForm.eventType as EventTypeValue] || []
})

// OMS状态选项
const omsStatusOptions = [
  { label: 'Created', value: 'Created' },
  { label: 'Dispatched', value: 'Dispatched' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Cancelled', value: 'Cancelled' }
]

// 异常状态选项
const exceptionStatusOptions = [
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Pending', value: 'Pending' }
]

// 事件类型定义
const eventTypes = [
  { value: 'Created', label: 'Created' },
  { value: 'Hold', label: 'Hold' },
  { value: 'Dispatch', label: 'Dispatch' },
  { value: 'Exception', label: 'Exception' },
  { value: 'WMS', label: 'WMS' },
  { value: 'DC', label: 'DC' },
  { value: 'Transport', label: 'Transport' },
  { value: 'AfterSale', label: 'AfterSale' },
  { value: 'Cancelled', label: 'Cancelled' }
]

// 子类型映射
const eventSubtypes = {
  Created: [
    { value: 'AutoImport', label: 'Auto Import' }
  ],
  Hold: [
    { value: 'SystemHold', label: 'System Hold' }
  ],
  Dispatch: [
    { value: 'AutoDispatch', label: 'Auto Dispatch' },
    { value: 'ManualDispatch', label: 'Manual Dispatch' }
  ],
  Exception: [
    { value: 'PushFailed', label: 'Push Failed' }
  ],
  WMS: [
    { value: 'Packed', label: 'Packed' },
    { value: 'Shipped', label: 'Shipped' }
  ],
  DC: [
    { value: 'Confirmed', label: 'Confirmed' }
  ],
  Transport: [
    { value: 'Delivered', label: 'Delivered' }
  ],
  AfterSale: [
    { value: 'ReturnCompleted', label: 'Return Completed' }
  ],
  Cancelled: [
    { value: 'ManualCancel', label: 'Manual Cancel' }
  ]
}

// Mock数据示例
const mockData: OrderLogRow[] = [
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Created',
    eventType: 'Created',
    eventSubtype: 'AutoImport',
    description: 'Imported from Shopify via API',
    eventTime: '2025-06-26 09:00',
    involvedEntities: {
      channel: 'Shopify'
    },
    actionBy: 'System'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'On Hold',
    eventType: 'Hold',
    eventSubtype: 'SystemHold',
    description: 'Held due to high-risk buyer rule',
    eventTime: '2025-06-26 09:05',
    involvedEntities: {
      rule: 'Fraud_Rule#001'
    },
    actionBy: 'System',
    suggestion: 'Manual Review Needed'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Allocated',
    eventType: 'Dispatch',
    eventSubtype: 'AutoDispatch',
    description: 'Auto dispatched to WH-LA',
    eventTime: '2025-06-26 09:10',
    involvedEntities: {
      subOrder: 'SUB001',
      warehouse: 'LA'
    },
    actionBy: 'System'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Failed',
    eventType: 'Exception',
    eventSubtype: 'PushFailed',
    description: 'WMS push failed: missing shipping address',
    eventTime: '2025-06-26 09:12',
    involvedEntities: {
      warehouse: 'LA'
    },
    actionBy: 'System',
    suggestion: 'Fix Address & Retry'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Allocated',
    eventType: 'Dispatch',
    eventSubtype: 'ManualDispatch',
    description: 'Manually dispatched to WH-LA after fix',
    eventTime: '2025-06-26 09:30',
    involvedEntities: {
      subOrder: 'SUB001',
      warehouse: 'LA'
    },
    actionBy: 'Alice'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Packed',
    eventType: 'WMS',
    eventSubtype: 'Packed',
    description: 'Packed with weight 3.2kg',
    eventTime: '2025-06-26 10:00',
    involvedEntities: {
      weight: '3.2kg',
      packer: 'Kevin'
    },
    actionBy: 'WMS'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Shipped',
    eventType: 'WMS',
    eventSubtype: 'Shipped',
    description: 'Shipped with Tracking No TRK999911',
    eventTime: '2025-06-26 10:20',
    involvedEntities: {
      carrier: 'FedEx',
      warehouse: 'LA'
    },
    actionBy: 'WMS',
    suggestion: 'Await DC Confirmation'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Delivered',
    eventType: 'DC',
    eventSubtype: 'Confirmed',
    description: 'DC confirmed tracking TRK999911',
    eventTime: '2025-06-26 11:00',
    involvedEntities: {
      trackingNo: 'TRK999911'
    },
    actionBy: 'System'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Delivered',
    eventType: 'Transport',
    eventSubtype: 'Delivered',
    description: 'Signed by customer Jenny',
    eventTime: '2025-06-26 15:20',
    involvedEntities: {
      signer: 'Jenny'
    },
    actionBy: 'Carrier'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Refunded',
    eventType: 'AfterSale',
    eventSubtype: 'ReturnCompleted',
    description: 'Refund of ¥180 completed for SKU123',
    eventTime: '2025-06-27 08:00',
    involvedEntities: {
      refund: '¥180',
      sku: 'SKU123'
    },
    actionBy: 'System'
  },
  {
    channel: 'Shopify',
    channelOrderNo: '#SHP123456',
    omsOrderNo: 'OMS98765',
    createdFrom: 'API',
    omsStatus: 'Cancelled',
    eventType: 'Cancelled',
    eventSubtype: 'ManualCancel',
    description: 'Cancelled due to customer request',
    eventTime: '2025-06-27 09:00',
    involvedEntities: {
      operator: 'Jack',
      reason: 'Change'
    },
    actionBy: 'Jack'
  }
]

// 初始化表格数据
const tableData = ref<OrderLogRow[]>(mockData)
const loading = ref(false)
const total = ref(mockData.length)
const currentPage = ref(1)
const pageSize = ref(20)

// 列类型定义
type ColumnType = 'omsInfo' | 'statusInfo' | 'timelineInfo' | 'systemInfo' | 'updateError' | 'actions'

// 表格列定义
const columns = [
  {
    prop: 'channelInfo',
    label: 'Channel Info',
    minWidth: 200,
    component: 'ChannelInfo'
  },
  {
    prop: 'omsInfo',
    label: 'OMS Info',
    minWidth: 200,
    component: 'OmsInfo'
  },
  {
    prop: 'shippingInfo',
    label: 'Shipping Info',
    minWidth: 220,
    component: 'ShippingInfo'
  },
  {
    prop: 'updateRecord',
    label: 'Update Record',
    minWidth: 220,
    component: 'UpdateRecord'
  },
  {
    prop: 'exceptionInfo',
    label: 'Exception Info',
    minWidth: 200,
    component: 'ExceptionInfo'
  },
  {
    prop: 'afterSaleInfo',
    label: 'After-Sale Info',
    minWidth: 200,
    component: 'AfterSaleInfo'
  },
  {
    prop: 'suggestion',
    label: 'Suggestion',
    minWidth: 180,
    component: 'Suggestion'
  },
  {
    prop: 'actions',
    label: 'Actions',
    width: 120,
    fixed: 'right',
    component: 'ActionButtons'
  }
]

// 搜索方法
const handleSearch = async () => {
  loading.value = true
  try {
    // TODO: 实现搜索逻辑
    console.log('Search with:', searchForm)
  } finally {
    loading.value = false
  }
}

// 重置方法
const handleReset = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
  }
}

// 分页方法
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

// 状态类型判断方法
const getOmsStatusType = (status: string) => {
  switch (status) {
    case 'Processing':
      return 'warning'
    case 'Shipped':
      return 'success'
    case 'Cancelled':
      return 'danger'
    case 'On Hold':
      return 'info'
    default:
      return ''
  }
}

const getChannelTagType = (channel: string) => {
  switch (channel) {
    case 'Shopify':
      return 'success'
    case 'Amazon':
      return 'warning'
    case 'B2B':
      return 'info'
    default:
      return ''
  }
}

// 操作方法
const handleRedispatch = (row: OrderLogRow) => {
  ElMessage.success(`重新派发订单: ${row.omsOrderNo}`);
};

const handleMarkProcessed = (row: OrderLogRow) => {
  ElMessage.success(`标记异常已处理: ${row.omsOrderNo}`);
};

const handleViewDetails = (row: OrderLogRow) => {
  ElMessage.info(`View details for order: ${row.omsOrderNo}`);
};

interface SourceTypeConfig {
  [key: string]: {
    color: string
    label: string
  }
}

interface OperationTypeConfig {
  [key: string]: {
    type: string
    label: string
  }
}

// 来源类型配置
const sourceTypeConfig: SourceTypeConfig = {
  DI: { color: '#67c23a', label: 'DI' },
  EDI: { color: '#409EFF', label: 'EDI' },
  API: { color: '#E6A23C', label: 'API' },
  MANUAL: { color: '#909399', label: '手动创建' }
}

// 操作类型配置
const operationTypeConfig: OperationTypeConfig = {
  CREATE: { type: 'success', label: 'Create' },
  UPDATE: { type: 'warning', label: 'Update' },
  CANCEL: { type: 'danger', label: 'Cancel' }
}

interface SourceTypeMap {
  [key: string]: string;
}

const getSourceTypeTag = (sourceType: string): string => {
  const typeMap: SourceTypeMap = {
    'DI': 'success',
    'EDI': 'primary',
    'API': 'warning',
    'Manual': 'info'
  };
  return typeMap[sourceType] || 'info';
};

const handleResolveException = (row: any) => {
  // 实现异常处理逻辑
  console.log('Resolving exception for row:', row);
};

const getExceptionIcon = (status: string): string => {
  const iconMap: Record<string, string> = {
    'Pending': 'el-icon-warning',
    'Processing': 'el-icon-loading',
    'Resolved': 'el-icon-success'
  };
  return iconMap[status] || 'el-icon-warning';
};

const getExceptionStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Pending': '待处理',
    'Processing': '处理中',
    'Resolved': '已解决'
  };
  return statusMap[status] || status;
};

const getUpdateTypeLabel = (action: string) => {
  const typeMap: Record<string, string> = {
    'CREATE': '创建订单',
    'UPDATE': '更新订单',
    'CANCEL': '取消订单',
    'DISPATCH': '发货处理',
    'RETURN': '退货处理',
    'REFUND': '退款处理',
    // 可以根据需要添加更多类型
  };
  return typeMap[action] || action;
};

const handleSuggestion = (row: any) => {
  // 处理建议的逻辑
  console.log('Handle suggestion for:', row);
};

const hasActions = (row: any): boolean => {
  return row.updateError || 
         row.systemSuggestion || 
         (row.exceptionType && row.exceptionStatus === 'Pending');
};

const getCreatedByType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'DI': 'info',
    'API': 'success',
    'Manual': 'warning'
  };
  return typeMap[type] || 'info';
};

// 类型定义
interface Action {
  type: string
  label: string
}

// 获取可用操作
const getActions = (row: OrderLogRow): Action[] => {
  const actions: Action[] = []

  // 基础操作
  actions.push({ type: 'view-detail', label: 'View Detail' })

  // 根据事件类型添加特定操作
  switch (row.eventType) {
    case 'Hold':
      actions.push({ type: 'view-risk', label: 'View Risk' })
      break
    case 'Exception':
      if (row.eventSubtype === 'PushFailed') {
        actions.push({ type: 'fix-address', label: 'Fix Address' })
      }
      break
    case 'WMS':
      if (row.eventSubtype === 'Packed') {
        actions.push({ type: 'view-packing', label: 'View Packing' })
      } else if (row.eventSubtype === 'Shipped') {
        actions.push({ type: 'view-tracking', label: 'View Tracking' })
      }
      break
    case 'Transport':
      if (row.eventSubtype === 'Delivered') {
        actions.push({ type: 'view-pod', label: 'View POD' })
      }
      break
    case 'AfterSale':
      actions.push({ type: 'view-refund', label: 'View Refund' })
      break
  }

  return actions
}

const handleAction = (actionType: string, row: OrderLogRow) => {
  console.log('Handle action:', actionType, 'for row:', row)
  switch (actionType) {
    case 'view-detail':
      console.log('View detail for:', row.omsOrderNo)
      break
    case 'view-risk':
      console.log('View risk for:', row.omsOrderNo)
      break
    case 'fix-address':
      console.log('Fix address for:', row.omsOrderNo)
      break
    case 'view-packing':
      console.log('View packing for:', row.omsOrderNo)
      break
    case 'view-tracking':
      console.log('View tracking for:', row.omsOrderNo)
      break
    case 'view-pod':
      console.log('View POD for:', row.omsOrderNo)
      break
    case 'view-refund':
      console.log('View refund for:', row.omsOrderNo)
      break
  }
}

// 事件类型变更处理
const handleEventTypeChange = (value: EventTypeValue | '') => {
  console.log('Event type changed:', value)
  searchForm.eventSubtype = ''
  
  if (value) {
    const subtypes = eventSubtypeMap[value]
    console.log('Available subtypes:', subtypes)
  }
}

// 监听事件类型变化
watch(
  () => searchForm.eventType,
  (newValue) => {
    console.log('Watch - Event type:', newValue)
    console.log('Form state:', {
      eventType: searchForm.eventType,
      subtypeOptions: currentSubtypeOptions.value
    })
  },
  { immediate: true }
)

// 获取异常状态标签类型
const getExceptionStatusTag = (status: string) => {
  const statusMap: Record<string, string> = {
    'Resolved': 'success',
    'Pending': 'warning'
  }
  return statusMap[status] || ''
}

// 获取事件类型标签
const getEventTypeTag = (type: string): string => {
  const typeMap: Record<string, string> = {
    'Created': 'primary',
    'Hold': 'warning',
    'Dispatch': 'success',
    'Exception': 'danger',
    'WMS': 'info',
    'DC': 'info',
    'Transport': 'success',
    'AfterSale': 'warning',
    'Cancelled': 'danger'
  }
  return typeMap[type] || ''
}

// 获取操作人类型标签样式
const getOperatorType = (operator: string): string => {
  if (operator === 'System') return 'info'
  if (operator === 'DI') return 'success'
  return 'warning' // User
}

// 获取状态类型标签样式
const getStatusType = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Created': 'primary',
    'On Hold': 'warning',
    'Allocated': 'success',
    'Failed': 'danger',
    'Packed': 'success',
    'Shipped': 'success',
    'Delivered': 'success',
    'Refunded': 'info',
    'Cancelled': 'info'
  }
  return statusMap[status] || ''
}

// 获取Created From类型的标签样式
const getCreatedFromType = (source: string): string => {
  const typeMap: Record<string, string> = {
    'DI': 'success',
    'API': 'primary',
    'Manual': 'warning'
  }
  return typeMap[source] || 'info'
}

// 格式化日期时间
const formatDateTime = (_row: OrderLogRow, _column: unknown, cellValue: string) => {
  if (!cellValue) return '—'
  return cellValue
}

// 处理查看订单详情
const handleViewOrder = (row: OrderLogRow) => {
  console.log('View order:', row.omsOrderNo)
  // TODO: 实现查看订单详情逻辑
}

// 导出方法
defineExpose({
  handleViewOrder,
  getCreatedFromType,
  getEventTypeTag,
  formatDateTime,
  getStatusType,
  getActions,
  handleAction,
  handleSizeChange,
  handleCurrentChange
})
</script>

<template>
  <div class="order-log-page">
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form :model="searchForm" ref="searchFormRef" class="search-form" inline>
        <!-- OMS订单号 -->
        <el-form-item label="Order No">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="OMS/Channel Order No"
            clearable
          />
        </el-form-item>

        <!-- 事件类型 -->
        <el-form-item label="Event Type">
          <el-select
            v-model="searchForm.eventType"
            placeholder="Select Type"
            clearable
            @change="handleEventTypeChange"
          >
            <el-option
              v-for="type in eventTypeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            >
              {{ type.label }}
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 子类型 -->
        <el-form-item label="Subtype" v-if="searchForm.eventType">
          <el-select
            v-model="searchForm.eventSubtype"
            placeholder="Select Subtype"
            clearable
          >
            <el-option
              v-for="subtype in currentSubtypeOptions"
              :key="subtype.value"
              :label="subtype.label"
              :value="subtype.value"
            />
          </el-select>
        </el-form-item>

        <!-- 事件发生时间 -->
        <el-form-item label="Time Range">
          <el-date-picker
            v-model="searchForm.eventTimeRange"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start Time"
            end-placeholder="End Time"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>

        <!-- OMS订单状态 -->
        <el-form-item label="OMS Status">
          <el-select
            v-model="searchForm.omsStatus"
            placeholder="Select OMS status"
            clearable
          >
            <el-option
              v-for="item in omsStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span :class="['status-dot', item.value.toLowerCase()]"></span>
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 操作人 -->
        <el-form-item label="Operator">
          <el-input
            v-model="searchForm.operator"
            placeholder="Enter operator name"
            clearable
          />
        </el-form-item>

        <!-- 子单号 -->
        <el-form-item label="Dispatch No">
          <el-input
            v-model="searchForm.dispatchNo"
            placeholder="Enter dispatch number"
            clearable
          />
        </el-form-item>

        <!-- 异常状态 -->
        <el-form-item label="Exception Status">
          <el-select
            v-model="searchForm.exceptionStatus"
            placeholder="Select exception status"
            clearable
          >
            <el-option
              v-for="item in exceptionStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag :type="getExceptionStatusTag(item.value)" size="small">
                {{ item.label }}
              </el-tag>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">Search</el-button>
          <el-button @click="handleReset">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
      >
        <!-- Channel -->
        <el-table-column
          prop="channel"
          label="Channel"
          width="100"
        />

        <!-- Channel Order No -->
        <el-table-column
          prop="channelOrderNo"
          label="Channel Order No"
          width="140"
        />

        <!-- OMS Order No -->
        <el-table-column
          label="OMS Order No"
          width="140"
        >
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewOrder(row)">
              {{ row.omsOrderNo }}
            </el-link>
          </template>
        </el-table-column>

        <!-- Source From -->
        <el-table-column
          label="Source From"
          width="100"
        >
          <template #default="{ row }">
            <el-tag size="small" :type="getCreatedFromType(row.createdFrom)">
              {{ row.createdFrom }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- OMS Status -->
        <el-table-column
          label="OMS Status"
          width="120"
        >
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.omsStatus)"
              size="small"
            >
              {{ row.omsStatus }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Event Type -->
        <el-table-column
          label="Event Type"
          width="180"
        >
          <template #default="{ row }">
            <div class="event-type">
              <el-tag
                :type="getEventTypeTag(row.eventType)"
                size="small"
                class="mb-1"
              >
                {{ row.eventType }}
              </el-tag>
              <div class="subtype" v-if="row.eventSubtype">
                <el-tag
                  type="info"
                  effect="plain"
                  size="small"
                >
                  {{ row.eventSubtype }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Description -->
        <el-table-column
          prop="description"
          label="Description"
          min-width="250"
          show-overflow-tooltip
        />

        <!-- Time -->
        <el-table-column
          prop="eventTime"
          label="Time"
          width="160"
          :formatter="formatDateTime"
        />

        <!-- Involved Entity -->
        <el-table-column
          label="Involved Entity"
          width="200"
        >
          <template #default="{ row }">
            <el-popover
              placement="right"
              trigger="hover"
              :width="300"
            >
              <template #reference>
                <div class="involved-entity">
                  <template v-for="(value, key) in row.involvedEntities" :key="key">
                    <div v-if="value" class="entity-item">
                      <span class="entity-label">{{ key }}:</span>
                      <span class="entity-value">{{ value }}</span>
                    </div>
                  </template>
                </div>
              </template>
              <div class="entity-details">
                <div v-for="(value, key) in row.involvedEntities" 
                     :key="key" 
                     class="detail-item"
                >
                  <span class="label">{{ key }}:</span>
                  <span class="value">{{ value }}</span>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <!-- By -->
        <el-table-column
          prop="actionBy"
          label="By"
          width="100"
        >
          <template #default="{ row }">
            <el-tag
              :type="row.actionBy === 'System' ? 'info' : 'warning'"
              size="small"
              effect="plain"
            >
              {{ row.actionBy }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Suggestion -->
        <el-table-column
          prop="suggestion"
          label="Suggestion"
          width="160"
        >
          <template #default="{ row }">
            <span v-if="row.suggestion" class="suggestion-text">
              {{ row.suggestion }}
            </span>
            <span v-else>—</span>
          </template>
        </el-table-column>

        <!-- Action -->
        <el-table-column
          label="Action"
          width="120"
          fixed="right"
          align="right"
        >
          <template #default="{ row }">
            <el-dropdown v-if="getActions(row).length">
              <el-button type="primary" size="small">
                Actions<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="action in getActions(row)"
                    :key="action.type"
                    @click="handleAction(action.type, row)"
                  >
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-log-page {
  padding: 20px;

  .search-section {
    background: var(--el-bg-color);
    padding: 24px;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: var(--el-box-shadow-light);

    .search-form {
      .el-form-item {
        margin-bottom: 16px;
        margin-right: 20px;
        
        // 调整输入框和选择器的宽度
        :deep(.el-input),
        :deep(.el-select) {
          width: 220px;
        }

        // 调整日期选择器的宽度
        :deep(.el-date-picker) {
          width: 400px;
        }
      }
    }
  }

  .table-section {
    background: var(--el-bg-color);
    padding: 24px;
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-light);

    .event-type {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .subtype {
        font-size: 12px;
      }
    }

    .involved-entity {
      max-height: 48px;
      overflow: hidden;
      
      .entity-item {
        margin-bottom: 2px;
        font-size: 13px;
        color: var(--el-text-color-regular);
        
        .entity-label {
          color: var(--el-text-color-secondary);
          margin-right: 4px;
        }
        
        .entity-value {
          color: var(--el-text-color-primary);
        }
      }
    }

    .entity-details {
      .detail-item {
        margin-bottom: 8px;
        
        .label {
          color: var(--el-text-color-secondary);
          margin-right: 8px;
          text-transform: capitalize;
        }
        
        .value {
          color: var(--el-text-color-primary);
        }
      }
    }

    .suggestion-text {
      color: var(--el-color-warning);
      font-style: italic;
      font-size: 13px;
    }

    .mb-1 {
      margin-bottom: 4px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.table-cell {
  padding: 8px 0;
  font-size: 12px;
  line-height: 1.5;

  .info-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: var(--el-text-color-secondary);
      font-size: 11px;
      width: 100px;
      flex-shrink: 0;
    }

    .value {
      color: var(--el-text-color-primary);
      flex: 1;
      word-break: break-word;

      &.order-no {
        color: var(--el-color-primary);
      }
    }
  }

  .status-tag {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 10px;
    
    &.success, &.completed, &.fulfilled, &.shipped {
      color: var(--el-color-success);
      background: var(--el-color-success-light-9);
    }
    
    &.error, &.failed {
      color: var(--el-color-danger);
      background: var(--el-color-danger-light-9);
    }
    
    &.pending {
      color: var(--el-color-warning);
      background: var(--el-color-warning-light-9);
    }
    
    &.processing {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }
  }

  .error-text {
    color: var(--el-color-danger);
  }

  .tracking-list {
    font-size: 11px;
    color: var(--el-text-color-regular);
  }

  .suggestion-text {
    color: var(--el-color-warning-dark-2);
    font-weight: 500;
  }

  .split-tag {
    font-size: 11px;
    color: var(--el-color-warning);
  }

  &.empty {
    color: var(--el-text-color-secondary);
    font-style: italic;
    padding: 8px 0;
  }
}

.action-cell {
  display: flex;
  justify-content: center;
}

:deep(.el-button--small) {
  padding: 4px 12px;
  font-size: 12px;
}

:deep(.el-tag--small) {
  height: 18px;
  padding: 0 6px;
  font-size: 11px;
}

// 状态点样式
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;

  &.created { background-color: var(--el-color-primary); }
  &.dispatched { background-color: var(--el-color-success); }
  &.shipped { background-color: var(--el-color-success); }
  &.failed { background-color: var(--el-color-danger); }
  &.pending { background-color: var(--el-color-warning); }
  &.onhold { background-color: var(--el-color-info); }
  &.resolved { background-color: var(--el-color-success); }
  &.cancelled { background-color: var(--el-color-info); }
}
</style> 