<template>
  <el-dialog
    v-model="dialogVisible"
    title="Select Shipping Request"
    width="90%"
    :close-on-click-modal="false"
    class="shipping-request-dialog"
  >
    <!-- Search Bar -->
    <div class="search-bar">
      <el-input
        v-model="searchText"
        placeholder="Search Request No, Order No, DN No..."
        clearable
        style="width: 300px; margin-right: 12px;"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select
        v-model="filterStatus"
        placeholder="Filter by Status"
        clearable
        style="width: 200px; margin-right: 12px;"
      >
        <el-option
          v-for="status in statusOptions"
          :key="status.value"
          :label="status.label"
          :value="status.value"
        />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="to"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        style="width: 260px;"
      />
      <el-button type="primary" style="margin-left: 12px;" @click="handleSearch">
        Search
      </el-button>
      <el-button @click="handleReset">
        Reset
      </el-button>
    </div>

    <!-- Status Info Banner -->
    <el-alert
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 16px;"
    >
      <template #title>
        <span>Showing only requests with selectable status: <strong>Allocated, Warehouse Received, Planned, or Picked</strong>. Use status filter to view other statuses.</span>
      </template>
    </el-alert>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="filteredTableData"
      height="500"
      @selection-change="handleSelectionChange"
      class="request-selector-table"
    >
      <el-table-column 
        type="selection"
        width="55"
        :selectable="checkSelectable"
      />
      <el-table-column 
        prop="requestNo"
        label="Request No."
        min-width="140"
        fixed="left"
      >
        <template #default="{ row }">
          <div class="request-no-cell">
            <span class="request-no-text">{{ row.requestNo }}</span>
            <el-tag
              v-if="row.isMerged"
              type="warning"
              size="small"
              style="margin-left: 8px;"
            >
              Merged {{ row.mergedOrderCount }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        prop="status"
        label="Status"
        min-width="140"
      >
        <template #default="{ row }">
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
            <el-tooltip
              v-if="!isSelectableStatus(row.status)"
              content="This status cannot be added to load"
              placement="top"
            >
              <el-icon color="#f56c6c" style="cursor: help;">
                <WarningFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        prop="orderNos"
        label="Order No."
        min-width="140"
      >
        <template #default="{ row }">
          <div class="order-nos-cell">
            <span>{{ formatOrderNos(row.orderNos) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        prop="dnNo"
        label="DN No."
        min-width="120"
      />
      <el-table-column 
        prop="warehouse"
        label="Warehouse"
        min-width="100"
      />
      <el-table-column 
        prop="shippingCarrier"
        label="Carrier"
        min-width="120"
      />
      <el-table-column 
        prop="destination"
        label="Destination"
        min-width="150"
      />
      <el-table-column 
        prop="recipientName"
        label="Recipient"
        min-width="120"
      />
      <el-table-column 
        prop="totalQuantity"
        label="Total Qty"
        min-width="100"
        align="right"
      />
      <el-table-column 
        prop="expectedShipDate"
        label="Expected Ship Date"
        min-width="140"
      />
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
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

    <template #footer>
      <div class="dialog-footer">
        <span class="selected-info">{{ selectedRequests.length }} item(s) selected</span>
        <div>
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="handleConfirm" :disabled="selectedRequests.length === 0">
            Confirm Add
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, WarningFilled } from '@element-plus/icons-vue'
import { ShippingRequestStatus, type ShippingRequestItem } from '../../shipping-request/types'

// 可以被添加到 Load 的状态 - 参考 ShippingRequestStatus 枚举
const SELECTABLE_STATUSES: ShippingRequestStatus[] = [
  ShippingRequestStatus.Allocated,
  ShippingRequestStatus.WarehouseReceived,
  ShippingRequestStatus.Planned,
  ShippingRequestStatus.Picked
]

interface Props {
  modelValue: boolean
  excludeRequestNos?: string[]
  mode?: string
  customerId?: string
  shipFrom?: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', requests: ShippingRequestItem[]): void
}

const props = withDefaults(defineProps<Props>(), {
  excludeRequestNos: () => [],
  mode: 'CUSTOMER',
  customerId: '',
  shipFrom: undefined
})

const emit = defineEmits<Emits>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const tableRef = ref()
const loading = ref(false)
const searchText = ref('')
const filterStatus = ref('')
const dateRange = ref<[Date, Date] | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const selectedRequests = ref<ShippingRequestItem[]>([])

// Mock 数据 - 实际应该从API获取
const mockData = ref<ShippingRequestItem[]>([])

const statusOptions = [
  { label: 'Allocated ✓', value: ShippingRequestStatus.Allocated },
  { label: 'Warehouse Received ✓', value: ShippingRequestStatus.WarehouseReceived },
  { label: 'Planned ✓', value: ShippingRequestStatus.Planned },
  { label: 'Picked ✓', value: ShippingRequestStatus.Picked },
  { label: 'Carrier Quoting (Not Selectable)', value: ShippingRequestStatus.CarrierQuoting },
  { label: 'Pending Approval (Not Selectable)', value: ShippingRequestStatus.PendingApproval },
  { label: 'Committed (Not Selectable)', value: ShippingRequestStatus.Committed },
  { label: 'Picking (Not Selectable)', value: ShippingRequestStatus.Picking },
  { label: 'Packed (Not Selectable)', value: ShippingRequestStatus.Packed },
  { label: 'Loaded (Not Selectable)', value: ShippingRequestStatus.Loaded },
  { label: 'Shipped (Not Selectable)', value: ShippingRequestStatus.Shipped }
]

// 生成Mock数据
const generateMockData = () => {
  const data: ShippingRequestItem[] = []
  // 包含可选和不可选的状态
  const statuses: ShippingRequestStatus[] = [
    ShippingRequestStatus.Allocated,
    ShippingRequestStatus.WarehouseReceived,
    ShippingRequestStatus.Planned,
    ShippingRequestStatus.Picked,
    ShippingRequestStatus.CarrierQuoting,
    ShippingRequestStatus.Picking,
    ShippingRequestStatus.PendingApproval,
    ShippingRequestStatus.Committed,
    ShippingRequestStatus.Shipped,
    ShippingRequestStatus.Packed,
    ShippingRequestStatus.Loaded
  ]
  const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C']
  const carriers = ['FedEx', 'UPS', 'DHL', 'USPS']
  
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: `SR${i.toString().padStart(5, '0')}`,
      requestNo: `SR-2024-${i.toString().padStart(5, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      isMerged: Math.random() > 0.8,
      mergedOrderCount: Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 2 : undefined,
      orderNos: [`ORD-${i.toString().padStart(5, '0')}`],
      dnNo: `DN-${i.toString().padStart(5, '0')}`,
      channel: 'Online',
      channelName: 'Amazon',
      channelSalesOrderNo: `AMZ-${i.toString().padStart(8, '0')}`,
      referenceNo: `REF-${i.toString().padStart(5, '0')}`,
      warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
      shippingCarrier: carriers[Math.floor(Math.random() * carriers.length)],
      trackingNumber: `TRK${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      totalItems: Math.floor(Math.random() * 10) + 1,
      totalQuantity: Math.floor(Math.random() * 100) + 1,
      createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      expectedShipDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      actualShipDate: '',
      destination: `${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]}, ${['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)]}`,
      recipientName: `Customer ${i}`,
      recipientPhone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
      notes: '',
      updatedDate: new Date().toISOString()
    })
  }
  return data
}

mockData.value = generateMockData()

// 判断状态是否可选
const isSelectableStatus = (status: string) => {
  return SELECTABLE_STATUSES.includes(status as ShippingRequestStatus)
}

const filteredTableData = computed(() => {
  let data = mockData.value

  // 根据 mode 过滤订单
  if (props.mode === 'CUSTOMER' && props.customerId) {
    // CUSTOMER mode: 只能选择当前 customer 的订单
    // 注意：ShippingRequestItem 中没有 customerId 字段，实际项目中应该：
    // 1. 从 API 获取 ShippingRequestItem 时包含 customerId 字段
    // 2. 或者根据 channelName 查找对应的 customerId
    // 这里暂时不过滤，实际项目中需要根据 customerId 字段匹配
    // TODO: 实现 customerId 匹配逻辑
    // data = data.filter(item => item.customerId === props.customerId)
  } else if (props.mode === 'CENTRAL' && props.shipFrom) {
    // CENTRAL mode: 可以选择相同 terminal (warehouse)，不同 customer 的订单
    // 根据 warehouse 匹配，允许不同 customer
    const terminalWarehouse = props.shipFrom.warehouse || props.shipFrom.name || ''
    if (terminalWarehouse) {
      data = data.filter(item => {
        // 根据 warehouse 匹配，允许不同 customer
        return item.warehouse === terminalWarehouse
      })
    }
  }

  // 默认只显示可以添加到 Load 的状态（除非用户选择了其他状态过滤）
  if (!filterStatus.value) {
    data = data.filter(item => isSelectableStatus(item.status))
  }

  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    data = data.filter(item =>
      item.requestNo.toLowerCase().includes(search) ||
      item.orderNos.some(no => no.toLowerCase().includes(search)) ||
      item.dnNo.toLowerCase().includes(search)
    )
  }

  // 状态过滤
  if (filterStatus.value) {
    data = data.filter(item => item.status === filterStatus.value)
  }

  // 日期范围过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    data = data.filter(item => {
      const itemDate = new Date(item.createdDate)
      return itemDate >= start && itemDate <= end
    })
  }

  return data
})

const total = computed(() => filteredTableData.value.length)

const checkSelectable = (row: ShippingRequestItem) => {
  // 检查是否已经被添加
  if (props.excludeRequestNos.includes(row.requestNo)) {
    return false
  }
  // 检查状态是否允许被添加
  return isSelectableStatus(row.status)
}

const handleSelectionChange = (selection: ShippingRequestItem[]) => {
  selectedRequests.value = selection
}

const handleSearch = () => {
  currentPage.value = 1
  // 实际项目中应该调用API
}

const handleReset = () => {
  searchText.value = ''
  filterStatus.value = ''
  dateRange.value = null
  currentPage.value = 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const handleConfirm = () => {
  emit('confirm', selectedRequests.value)
  dialogVisible.value = false
  // 清空选择
  selectedRequests.value = []
  tableRef.value?.clearSelection()
}

const handleCancel = () => {
  dialogVisible.value = false
  selectedRequests.value = []
  tableRef.value?.clearSelection()
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    [ShippingRequestStatus.Allocated]: 'info',
    [ShippingRequestStatus.CarrierQuoting]: 'warning',
    [ShippingRequestStatus.PendingApproval]: 'warning',
    [ShippingRequestStatus.WarehouseReceived]: 'primary',
    [ShippingRequestStatus.Committed]: 'primary',
    [ShippingRequestStatus.Planning]: 'primary',
    [ShippingRequestStatus.Planned]: 'primary',
    [ShippingRequestStatus.Picking]: 'warning',
    [ShippingRequestStatus.Picked]: 'success',
    [ShippingRequestStatus.Packing]: 'warning',
    [ShippingRequestStatus.Packed]: 'success',
    [ShippingRequestStatus.Loading]: 'warning',
    [ShippingRequestStatus.Loaded]: 'success',
    [ShippingRequestStatus.PartialShip]: 'warning',
    [ShippingRequestStatus.Shipped]: '',
    [ShippingRequestStatus.InTransit]: 'primary',
    [ShippingRequestStatus.Delivered]: 'success',
    [ShippingRequestStatus.Exception]: 'danger',
    [ShippingRequestStatus.Cancelled]: 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    [ShippingRequestStatus.Allocated]: 'Allocated',
    [ShippingRequestStatus.CarrierQuoting]: 'Carrier Quoting',
    [ShippingRequestStatus.PendingApproval]: 'Pending Approval',
    [ShippingRequestStatus.WarehouseReceived]: 'Warehouse Received',
    [ShippingRequestStatus.Committed]: 'Committed',
    [ShippingRequestStatus.Planning]: 'Planning',
    [ShippingRequestStatus.Planned]: 'Planned',
    [ShippingRequestStatus.Picking]: 'Picking',
    [ShippingRequestStatus.Picked]: 'Picked',
    [ShippingRequestStatus.Packing]: 'Packing',
    [ShippingRequestStatus.Packed]: 'Packed',
    [ShippingRequestStatus.Loading]: 'Loading',
    [ShippingRequestStatus.Loaded]: 'Loaded',
    [ShippingRequestStatus.PartialShip]: 'Partially Shipped',
    [ShippingRequestStatus.Shipped]: 'Shipped',
    [ShippingRequestStatus.InTransit]: 'In Transit',
    [ShippingRequestStatus.Delivered]: 'Delivered',
    [ShippingRequestStatus.Exception]: 'Exception',
    [ShippingRequestStatus.Cancelled]: 'Cancelled'
  }
  return statusMap[status] || status
}

const formatOrderNos = (orderNos: string[]) => {
  if (!orderNos || orderNos.length === 0) return '-'
  if (orderNos.length === 1) return orderNos[0]
  return `${orderNos[0]} +${orderNos.length - 1}`
}

// 当对话框打开时重置状态
watch(dialogVisible, (val) => {
  if (val) {
    handleReset()
  }
})
</script>

<style scoped lang="scss">
.shipping-request-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
    background-color: #1a1d21;
  }

  :deep(.el-dialog__header) {
    background-color: #1e2227;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  :deep(.el-dialog__title) {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }

  :deep(.el-dialog__footer) {
    background-color: #1e2227;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 16px 20px;
  }
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.request-selector-table {
  :deep(.el-table) {
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  :deep(.el-table__header-wrapper) {
    th {
      background-color: #1e2227 !important;
      color: #8b949e !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  :deep(.el-table__body-wrapper) {
    td {
      background-color: #1a1d21 !important;
      color: #c9d1d9 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .el-table__row:hover td {
      background-color: #21262d !important;
    }
  }
}

.request-no-cell {
  display: flex;
  align-items: center;
  
  .request-no-text {
    color: #58a6ff;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.order-nos-cell {
  color: #c9d1d9;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  :deep(.el-pagination) {
    .el-pagination__total,
    .el-pagination__jump {
      color: #8b949e;
    }

    .btn-prev,
    .btn-next,
    .el-pager li {
      background-color: #2d3139;
      color: #c9d1d9;
      border: 1px solid rgba(255, 255, 255, 0.05);
      
      &:hover {
        color: #58a6ff;
      }

      &.active {
        background-color: #388bfd;
        color: #fff;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .selected-info {
    color: #8b949e;
    font-size: 14px;
  }
}
</style>

