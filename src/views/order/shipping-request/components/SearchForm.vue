<template>
  <div class="search-form">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <el-input
          v-model="searchKeyword"
          placeholder="Search by Request No., Tracking No..."
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="filter-buttons">
        <!-- 状态过滤 -->
        <el-dropdown trigger="click" @command="handleStatusFilter">
          <el-button :class="{ 'is-active': hasFilter('status') }">
            Status
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="status in statuses"
                :key="status.value"
                :command="{ type: 'status', value: status.value }"
              >
                <el-checkbox
                  :model-value="isStatusSelected(status.value)"
                  @click.prevent
                >
                  {{ status.label }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 仓库过滤 -->
        <el-dropdown trigger="click" @command="handleWarehouseFilter">
          <el-button :class="{ 'is-active': hasFilter('warehouse') }">
            Warehouse
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="warehouse in warehouses"
                :key="warehouse"
                :command="{ type: 'warehouse', value: warehouse }"
              >
                <el-checkbox
                  :model-value="isWarehouseSelected(warehouse)"
                  @click.prevent
                >
                  {{ warehouse }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 物流商过滤 -->
        <el-dropdown trigger="click" @command="handleCarrierFilter">
          <el-button :class="{ 'is-active': hasFilter('carrier') }">
            Carrier
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="carrier in carriers"
                :key="carrier"
                :command="{ type: 'carrier', value: carrier }"
              >
                <el-checkbox
                  :model-value="isCarrierSelected(carrier)"
                  @click.prevent
                >
                  {{ carrier }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 创建日期过滤 -->
        <el-dropdown trigger="click">
          <el-button :class="{ 'is-active': hasFilter('createdDate') }">
            Created Date
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <div class="date-filter-content" @click.stop>
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="to"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  value-format="YYYY-MM-DD"
                  @change="handleDateChange"
                />
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 高级筛选 -->
        <el-button @click="showAdvancedSearch = true">
          <el-icon><Filter /></el-icon>
          Advanced
        </el-button>
      </div>

      <div class="action-buttons">
        <el-button v-if="hasAnyFilters" link @click="clearAllFilters">
          Clear All
        </el-button>
      </div>
    </div>

    <!-- 活动过滤器标签 -->
    <div v-if="hasAnyFilters" class="active-filters">
      <el-tag
        v-for="(filter, index) in activeFilters"
        :key="index"
        closable
        @close="removeFilter(filter)"
        class="filter-tag"
      >
        {{ filter.label }}: {{ filter.value }}
      </el-tag>
    </div>

    <!-- 高级搜索对话框 -->
    <el-dialog
      v-model="showAdvancedSearch"
      title="Advanced Search"
      width="800px"
      destroy-on-close
    >
      <div class="advanced-search-content">
        <el-form :model="advancedForm" label-position="top">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="Request No.">
                <el-input
                  v-model="advancedForm.requestNos"
                  type="textarea"
                  :rows="3"
                  placeholder="Enter request numbers (one per line)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Allocation Order No.">
                <el-input
                  v-model="advancedForm.allocationOrderNos"
                  type="textarea"
                  :rows="3"
                  placeholder="Enter allocation order numbers (one per line)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="Order No.">
                <el-input
                  v-model="advancedForm.orderNos"
                  type="textarea"
                  :rows="3"
                  placeholder="Enter order numbers (one per line)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="DN No.">
                <el-input
                  v-model="advancedForm.dnNo"
                  placeholder="Enter DN number"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="Channel">
                <el-input
                  v-model="advancedForm.channel"
                  placeholder="Enter channel (e.g., Shopify, Amazon)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Channel Sales Order No.">
                <el-input
                  v-model="advancedForm.channelSalesOrderNo"
                  placeholder="Enter channel sales order number"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="Tracking Number">
                <el-input
                  v-model="advancedForm.trackingNumbers"
                  type="textarea"
                  :rows="3"
                  placeholder="Enter tracking numbers (one per line)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Recipient Name">
                <el-input
                  v-model="advancedForm.recipientName"
                  placeholder="Enter recipient name"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Status">
            <el-select
              v-model="advancedForm.statuses"
              multiple
              placeholder="Select status"
              style="width: 100%"
            >
              <el-option
                v-for="status in statuses"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="Warehouse">
                <el-select
                  v-model="advancedForm.warehouses"
                  multiple
                  placeholder="Select warehouse"
                  style="width: 100%"
                >
                  <el-option
                    v-for="warehouse in warehouses"
                    :key="warehouse"
                    :label="warehouse"
                    :value="warehouse"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Carrier">
                <el-select
                  v-model="advancedForm.carriers"
                  multiple
                  placeholder="Select carrier"
                  style="width: 100%"
                >
                  <el-option
                    v-for="carrier in carriers"
                    :key="carrier"
                    :label="carrier"
                    :value="carrier"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Created Date Range">
            <el-date-picker
              v-model="advancedForm.dateRange"
              type="daterange"
              range-separator="to"
              start-placeholder="Start date"
              end-placeholder="End date"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetAdvancedForm">Reset</el-button>
          <el-button type="primary" @click="handleAdvancedSearch">
            Search
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ArrowDown, Filter } from '@element-plus/icons-vue'
import { ShippingRequestStatus } from '../types'
import type { SearchCondition } from '../types'

const emit = defineEmits<{
  (e: 'search', condition: SearchCondition): void
}>()

// 搜索关键词
const searchKeyword = ref('')

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 高级搜索
const showAdvancedSearch = ref(false)
const advancedForm = ref({
  requestNos: '',
  allocationOrderNos: '',
  orderNos: '',
  dnNo: '',
  channel: '',
  channelSalesOrderNo: '',
  trackingNumbers: '',
  recipientName: '',
  statuses: [] as string[],
  warehouses: [] as string[],
  carriers: [] as string[],
  dateRange: null as [string, string] | null
})

// 过滤器数据
const selectedStatuses = ref<string[]>([])
const selectedWarehouses = ref<string[]>([])
const selectedCarriers = ref<string[]>([])

// 状态选项 (参考 Allocation Order 状态)
const statuses = [
  // 前置状态
  { label: 'Allocated', value: ShippingRequestStatus.Allocated },
  { label: 'Carrier Quoting', value: ShippingRequestStatus.CarrierQuoting },
  { label: 'Pending Approval', value: ShippingRequestStatus.PendingApproval },
  
  // WMS 处理流程
  { label: 'Warehouse Received', value: ShippingRequestStatus.WarehouseReceived },
  { label: 'Committed', value: ShippingRequestStatus.Committed },
  { label: 'Planning', value: ShippingRequestStatus.Planning },
  { label: 'Planned', value: ShippingRequestStatus.Planned },
  { label: 'Picking', value: ShippingRequestStatus.Picking },
  { label: 'Picked', value: ShippingRequestStatus.Picked },
  { label: 'Packing', value: ShippingRequestStatus.Packing },
  { label: 'Packed', value: ShippingRequestStatus.Packed },
  { label: 'Loading', value: ShippingRequestStatus.Loading },
  { label: 'Loaded', value: ShippingRequestStatus.Loaded },
  
  // 发货状态
  { label: 'Partial Ship', value: ShippingRequestStatus.PartialShip },
  { label: 'Shipped', value: ShippingRequestStatus.Shipped },
  { label: 'In Transit', value: ShippingRequestStatus.InTransit },
  { label: 'Delivered', value: ShippingRequestStatus.Delivered },
  
  // 异常状态
  { label: 'Exception', value: ShippingRequestStatus.Exception },
  { label: 'Cancelled', value: ShippingRequestStatus.Cancelled }
]

// 仓库选项
const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D']

// 物流商选项
const carriers = ['FedEx', 'UPS', 'USPS', 'DHL', 'SF Express']

// 活动过滤器
const activeFilters = computed(() => {
  const filters: Array<{ type: string; label: string; value: string }> = []

  selectedStatuses.value.forEach(status => {
    const statusObj = statuses.find(s => s.value === status)
    if (statusObj) {
      filters.push({
        type: 'status',
        label: 'Status',
        value: statusObj.label
      })
    }
  })

  selectedWarehouses.value.forEach(warehouse => {
    filters.push({
      type: 'warehouse',
      label: 'Warehouse',
      value: warehouse
    })
  })

  selectedCarriers.value.forEach(carrier => {
    filters.push({
      type: 'carrier',
      label: 'Carrier',
      value: carrier
    })
  })

  if (dateRange.value) {
    filters.push({
      type: 'createdDate',
      label: 'Created Date',
      value: `${dateRange.value[0]} to ${dateRange.value[1]}`
    })
  }

  return filters
})

const hasAnyFilters = computed(() => {
  return activeFilters.value.length > 0 || searchKeyword.value.trim().length > 0
})

// 方法
const hasFilter = (type: string) => {
  return activeFilters.value.some(f => f.type === type)
}

const isStatusSelected = (status: string) => {
  return selectedStatuses.value.includes(status)
}

const isWarehouseSelected = (warehouse: string) => {
  return selectedWarehouses.value.includes(warehouse)
}

const isCarrierSelected = (carrier: string) => {
  return selectedCarriers.value.includes(carrier)
}

const handleStatusFilter = (command: { type: string; value: string }) => {
  const index = selectedStatuses.value.indexOf(command.value)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  } else {
    selectedStatuses.value.push(command.value)
  }
  handleSearch()
}

const handleWarehouseFilter = (command: { type: string; value: string }) => {
  const index = selectedWarehouses.value.indexOf(command.value)
  if (index > -1) {
    selectedWarehouses.value.splice(index, 1)
  } else {
    selectedWarehouses.value.push(command.value)
  }
  handleSearch()
}

const handleCarrierFilter = (command: { type: string; value: string }) => {
  const index = selectedCarriers.value.indexOf(command.value)
  if (index > -1) {
    selectedCarriers.value.splice(index, 1)
  } else {
    selectedCarriers.value.push(command.value)
  }
  handleSearch()
}

const handleDateChange = () => {
  handleSearch()
}

const removeFilter = (filter: { type: string; label: string; value: string }) => {
  switch (filter.type) {
    case 'status':
      {
        const statusObj = statuses.find(s => s.label === filter.value)
        if (statusObj) {
          const index = selectedStatuses.value.indexOf(statusObj.value)
          if (index > -1) {
            selectedStatuses.value.splice(index, 1)
          }
        }
      }
      break
    case 'warehouse':
      {
        const index = selectedWarehouses.value.indexOf(filter.value)
        if (index > -1) {
          selectedWarehouses.value.splice(index, 1)
        }
      }
      break
    case 'carrier':
      {
        const index = selectedCarriers.value.indexOf(filter.value)
        if (index > -1) {
          selectedCarriers.value.splice(index, 1)
        }
      }
      break
    case 'createdDate':
      dateRange.value = null
      break
  }
  handleSearch()
}

const clearAllFilters = () => {
  searchKeyword.value = ''
  selectedStatuses.value = []
  selectedWarehouses.value = []
  selectedCarriers.value = []
  dateRange.value = null
  handleSearch()
}

const handleSearch = () => {
  const condition: SearchCondition = {
    requestNos: searchKeyword.value ? [searchKeyword.value.trim()] : [],
    allocationOrderNos: [],
    trackingNumbers: searchKeyword.value ? [searchKeyword.value.trim()] : [],
    statuses: selectedStatuses.value as any,
    warehouses: selectedWarehouses.value,
    carriers: selectedCarriers.value,
    dateRange: dateRange.value
      ? {
          start: dateRange.value[0],
          end: dateRange.value[1]
        }
      : null
  }
  emit('search', condition)
}

const handleAdvancedSearch = () => {
  const condition: SearchCondition = {
    requestNos: advancedForm.value.requestNos
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    allocationOrderNos: advancedForm.value.allocationOrderNos
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    trackingNumbers: advancedForm.value.trackingNumbers
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    statuses: advancedForm.value.statuses as any,
    warehouses: advancedForm.value.warehouses,
    carriers: advancedForm.value.carriers,
    dateRange: advancedForm.value.dateRange
      ? {
          start: advancedForm.value.dateRange[0],
          end: advancedForm.value.dateRange[1]
        }
      : null
  }
  emit('search', condition)
  showAdvancedSearch.value = false
}

const resetAdvancedForm = () => {
  advancedForm.value = {
    requestNos: '',
    allocationOrderNos: '',
    orderNos: '',
    dnNo: '',
    channel: '',
    channelSalesOrderNo: '',
    trackingNumbers: '',
    recipientName: '',
    statuses: [],
    warehouses: [],
    carriers: [],
    dateRange: null
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  margin-bottom: 16px;

  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    background: #1e2227;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 8px;

    .search-input-wrapper {
      width: 240px;
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

        &.is-active {
          color: #0066ff;
          background: rgba(0, 102, 255, 0.1);
        }

        .el-icon {
          font-size: 12px;
          margin-left: 4px;
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

      .el-button {
        height: 32px;
        padding: 0 12px;
        font-weight: normal;
        font-size: 13px;
        color: #8b949e;

        &:hover {
          color: #fff;
        }
      }
    }
  }

  .active-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;

    .filter-tag {
      background: rgba(0, 102, 255, 0.1);
      border-color: rgba(0, 102, 255, 0.2);
      color: #0066ff;
      padding: 0 8px;
      height: 24px;
      line-height: 22px;
      font-size: 12px;

      :deep(.el-tag__close) {
        color: #0066ff;

        &:hover {
          background-color: #0066ff;
          color: #fff;
        }
      }
    }
  }
}

.advanced-search-content {
  padding: 0 20px;
}

.date-filter-content {
  padding: 12px;
  min-width: 300px;
}

.dialog-footer {
  padding: 20px 0 0;
  text-align: right;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-dropdown-menu) {
  background: #1a1d21;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;

  .el-dropdown-menu__item {
    color: #8b949e;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }

    .el-checkbox {
      width: 100%;

      :deep(.el-checkbox__label) {
        width: 100%;
        color: inherit;
      }
    }
  }
}
</style>

