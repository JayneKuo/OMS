<template>
  <div class="inventory">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input 
        v-model="searchForm.sku" 
        placeholder="SKU" 
        clearable
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-input 
        v-model="searchForm.warehouseCode" 
        placeholder="Warehouse Code" 
        clearable
        class="search-input"
      />
      <el-select 
        v-model="searchForm.wmsSystem" 
        placeholder="WMS System" 
        clearable
        class="search-select"
      >
        <el-option label="WMS V1" value="wms_v1" />
        <el-option label="WMS V2" value="wms_v2" />
        <el-option label="Other WMS" value="other" />
      </el-select>
      <el-select 
        v-model="searchForm.stockType" 
        placeholder="Stock Type" 
        clearable
        class="search-select"
      >
        <el-option label="Available" value="available" />
        <el-option label="Locked" value="locked" />
        <el-option label="Damaged" value="damaged" />
      </el-select>
      <el-button type="primary" @click="handleSearch">Search</el-button>
      <el-button @click="resetSearch">Reset</el-button>
    </div>

    <!-- 库存信息卡片 -->
    <div class="inventory-info" v-if="warehouseInfo.wmsSystem">
      <el-card class="warehouse-card">
        <template #header>
          <div class="card-header">
            <span>Warehouse Information</span>
          </div>
        </template>
        <div class="warehouse-info">
          <div class="info-item">
            <span class="label">Customer Code:</span>
            <span class="value">{{ warehouseInfo.customerCode }}</span>
          </div>
          <div class="info-item">
            <span class="label">Warehouse Code:</span>
            <span class="value">{{ warehouseInfo.warehouseCode }}</span>
          </div>
          <div class="info-item">
            <span class="label">WMS System:</span>
            <el-tag size="small" :type="warehouseInfo.wmsSystem === 'wms_v1' ? 'success' : warehouseInfo.wmsSystem === 'wms_v2' ? 'warning' : 'info'">
              {{ warehouseInfo.wmsSystem === 'wms_v1' ? 'WMS V1' : warehouseInfo.wmsSystem === 'wms_v2' ? 'WMS V2' : 'Other WMS' }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 库存表格 -->
    <div class="inventory-table">
      <div class="table-header">
        <h3>Inventory List</h3>
        <div class="header-actions">
          <el-button type="primary" @click="handleBatchSync" :loading="syncing">
            <el-icon><Refresh /></el-icon>
            Sync All
          </el-button>
        </div>
      </div>
      
      <el-table :data="inventoryData" style="width: 100%" v-loading="loading">
        <el-table-column prop="sku" label="SKU" min-width="120">
          <template #default="{ row }">
            <div class="sku-cell">
              <span>{{ row.sku }}</span>
            </div>
          </template>
        </el-table-column>
        <template v-for="warehouse in allWarehouses" :key="warehouse.id">
          <el-table-column :label="warehouse.name" min-width="400">
            <template #header>
              <div class="warehouse-header">
                <div class="warehouse-title">
                  <span>{{ warehouse.name }}</span>
                  <el-tag 
                    size="small" 
                    :type="getSystemTagType(warehouse.system)"
                  >
                    {{ getSystemName(warehouse.system) }}
                  </el-tag>
                </div>
                <div class="warehouse-code">{{ warehouse.code }}</div>
                <div class="stock-types">
                  <div class="stock-type available">Available</div>
                  <div class="stock-type locked">Locked</div>
                  <div class="stock-type damaged">Damaged</div>
                  <div class="stock-type in-transit">In Transit</div>
                </div>
              </div>
            </template>
            <template #default="{ row }">
              <div class="stock-row">
                <span class="stock-number available">
                  {{ getWarehouseStock(row, warehouse.id)?.availableStock || 0 }}
                </span>
                <span class="stock-number locked">
                  {{ getWarehouseStock(row, warehouse.id)?.lockedStock || 0 }}
                </span>
                <span class="stock-number damaged">
                  {{ getWarehouseStock(row, warehouse.id)?.damagedStock || 0 }}
                </span>
                <el-popover
                  placement="top"
                  :width="300"
                  trigger="hover"
                  v-if="getWarehouseStock(row, warehouse.id)?.inTransitDetails?.length"
                >
                  <template #reference>
                    <span class="stock-number in-transit">
                      {{ getWarehouseStock(row, warehouse.id)?.inTransitStock || 0 }}
                    </span>
                  </template>
                  <div class="transit-details">
                    <div class="transit-header">
                      <span>In Transit Details</span>
                    </div>
                    <el-divider />
                    <div class="transit-list">
                      <div v-for="detail in getWarehouseStock(row, warehouse.id)?.inTransitDetails" 
                           :key="detail.poNumber" 
                           class="transit-item"
                      >
                        <div class="po-info">
                          <span class="po-number">{{ detail.poNumber }}</span>
                          <span class="po-quantity">{{ detail.quantity }} units</span>
                        </div>
                        <div class="eta-info">
                          <span class="eta-label">ETA:</span>
                          <span class="eta-date">{{ formatDate(detail.eta) }}</span>
                          <span class="eta-days">({{ calculateDaysToETA(detail.eta) }})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-popover>
                <span v-else class="stock-number in-transit">
                  {{ getWarehouseStock(row, warehouse.id)?.inTransitStock || 0 }}
                </span>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="Total Available" min-width="100" align="right">
          <template #default="{ row }">
            <span class="stock-number available">{{ calculateTotalStock(row, 'available') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Total Locked" min-width="100" align="right">
          <template #default="{ row }">
            <span class="stock-number locked">{{ calculateTotalStock(row, 'locked') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Total Damaged" min-width="100" align="right">
          <template #default="{ row }">
            <span class="stock-number damaged">{{ calculateTotalStock(row, 'damaged') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Last Sync" width="180">
          <template #default="{ row }">
            <span class="time-cell">{{ row.lastSync || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              :loading="row.syncing"
              @click="handleSyncStock(row)"
            >
              <el-icon><Refresh /></el-icon>
              Sync Stock
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 同步结果弹窗 -->
    <el-dialog
      v-model="syncResultVisible"
      title="Sync Result"
      width="500px"
      class="sync-dialog"
    >
      <div class="sync-result">
        <el-result
          :icon="syncResult.success ? 'success' : 'warning'"
          :title="syncResult.success ? 'Sync Successful' : 'Sync Completed with Issues'"
          :sub-title="getSyncResultMessage()"
        >
          <template #extra>
            <el-button type="primary" @click="syncResultVisible = false">OK</el-button>
          </template>
        </el-result>
        <div v-if="syncResult.failedItems.length > 0" class="failed-items">
          <div class="failed-title">Failed Items:</div>
          <el-scrollbar height="200px">
            <ul class="failed-list">
              <li v-for="(item, index) in syncResult.failedItems" :key="index">
                {{ item }}
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Refresh, Link, CircleClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface WarehouseStock {
  id: string
  name: string
  code: string
  system: 'wms_v1' | 'wms_v2' | 'other'
  availableStock: number
  lockedStock: number
  damagedStock: number
  inTransitStock: number
  inTransitDetails?: {
    poNumber: string
    quantity: number
    eta: string
  }[]
}

interface InventoryItem {
  sku: string
  warehouses: WarehouseStock[]
  lastSync?: string
  syncing?: boolean
}

// 搜索表单
const searchForm = reactive({
  sku: '',
  warehouseCode: '',
  wmsSystem: '',
  stockType: ''
})

// 仓库信息
const warehouseInfo = reactive({
  customerCode: '',
  warehouseCode: '',
  wmsSystem: ''
})

// 库存数据
const inventoryData = ref<InventoryItem[]>([
  {
    sku: 'SKU001',
    syncing: false,
    warehouses: [
      {
        id: 'wh1',
        name: 'LA Warehouse',
        code: 'LAW',
        system: 'wms_v1',
        availableStock: 100,
        lockedStock: 10,
        damagedStock: 5,
        inTransitStock: 200,
        inTransitDetails: [
          {
            poNumber: 'PO001',
            quantity: 100,
            eta: '2024-03-20'
          },
          {
            poNumber: 'PO002',
            quantity: 100,
            eta: '2024-03-25'
          }
        ]
      },
      {
        id: 'wh2',
        name: 'NY Warehouse',
        code: 'NYW',
        system: 'wms_v2',
        availableStock: 50,
        lockedStock: 5,
        damagedStock: 2,
        inTransitStock: 150,
        inTransitDetails: [
          {
            poNumber: 'PO003',
            quantity: 150,
            eta: '2024-03-22'
          }
        ]
      },
      {
        id: 'wh3',
        name: 'Chicago Warehouse',
        code: 'CHW',
        system: 'other',
        availableStock: 75,
        lockedStock: 8,
        damagedStock: 3,
        inTransitStock: 0
      }
    ],
    lastSync: '2024-03-15 12:00:00'
  },
  {
    sku: 'SKU002',
    syncing: false,
    warehouses: [
      {
        id: 'wh1',
        name: 'LA Warehouse',
        code: 'LAW',
        system: 'wms_v1',
        availableStock: 0,
        lockedStock: 0,
        damagedStock: 0,
        inTransitStock: 0
      },
      {
        id: 'wh2',
        name: 'NY Warehouse',
        code: 'NYW',
        system: 'wms_v2',
        availableStock: 200,
        lockedStock: 20,
        damagedStock: 8,
        inTransitStock: 0
      },
      {
        id: 'wh3',
        name: 'Chicago Warehouse',
        code: 'CHW',
        system: 'other',
        availableStock: 150,
        lockedStock: 15,
        damagedStock: 5,
        inTransitStock: 0
      }
    ],
    lastSync: '2024-03-15 12:00:00'
  }
])

// 加载状态
const loading = ref(false)
const syncing = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 同步结果
const syncResultVisible = ref(false)
const syncResult = reactive({
  success: true,
  totalItems: 0,
  syncedItems: 0,
  failedItems: [] as string[]
})

// 所有仓库列表
const allWarehouses = [
  {
    id: 'wh1',
    name: 'LA Warehouse',
    code: 'LAW',
    system: 'wms_v1'
  },
  {
    id: 'wh2',
    name: 'NY Warehouse',
    code: 'NYW',
    system: 'wms_v2'
  },
  {
    id: 'wh3',
    name: 'Chicago Warehouse',
    code: 'CHW',
    system: 'other'
  }
]

// 获取仓库库存
const getWarehouseStock = (row: InventoryItem, warehouseId: string) => {
  return row.warehouses.find(w => w.id === warehouseId)
}

// 计算总库存
const calculateTotalStock = (row: InventoryItem, type: 'available' | 'locked' | 'damaged') => {
  return row.warehouses.reduce((sum, warehouse) => sum + warehouse[`${type}Stock`], 0)
}

// 获取仓库系统标签类型
const getSystemTagType = (system: string) => {
  switch (system) {
    case 'wms_v1':
      return 'success'
    case 'wms_v2':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取仓库系统显示名称
const getSystemName = (system: string) => {
  switch (system) {
    case 'wms_v1':
      return 'WMS V1'
    case 'wms_v2':
      return 'WMS V2'
    default:
      return 'Other WMS'
  }
}

// 获取同步结果消息
const getSyncResultMessage = () => {
  return `Successfully synced ${syncResult.syncedItems} out of ${syncResult.totalItems} items`
}

// 处理单个SKU同步
const handleSyncStock = async (row: InventoryItem) => {
  row.syncing = true
  try {
    // 实际项目中这里需要调用后端 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    row.lastSync = new Date().toLocaleString()
    ElMessage.success(`${row.sku} 库存同步成功`)
  } catch (error) {
    ElMessage.error(`${row.sku} 库存同步失败`)
  } finally {
    row.syncing = false
  }
}

// 处理批量同步
const handleBatchSync = async () => {
  syncing.value = true
  try {
    // 实际项目中这里需要调用后端 API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新所有项的同步时间
    const now = new Date().toLocaleString()
    inventoryData.value.forEach(item => {
      item.lastSync = now
    })
    
    ElMessage.success('All items synced successfully')
  } catch (error) {
    ElMessage.error('Failed to sync items')
  } finally {
    syncing.value = false
  }
}

// 处理搜索
const handleSearch = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新仓库信息
    warehouseInfo.warehouseCode = searchForm.warehouseCode
    warehouseInfo.wmsSystem = searchForm.wmsSystem || 'wms_v1'
    
    // 实际项目中这里需要调用后端 API
    // 前端筛选示例：
    const filteredData = inventoryData.value.filter(item => {
      const skuMatch = !searchForm.sku || item.sku.toLowerCase().includes(searchForm.sku.toLowerCase())
      const warehouseMatch = !searchForm.warehouseCode || item.warehouses.some(w => 
        w.code.toLowerCase().includes(searchForm.warehouseCode.toLowerCase())
      )
      const systemMatch = !searchForm.wmsSystem || item.warehouses.some(w => 
        w.system === searchForm.wmsSystem
      )
      
      return skuMatch && warehouseMatch && systemMatch
    })
    
    // 更新显示数据
    inventoryData.value = filteredData
    
  } catch (error) {
    ElMessage.error('Failed to fetch inventory data')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  handleSearch()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  handleSearch()
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.sku = ''
  searchForm.warehouseCode = ''
  searchForm.wmsSystem = ''
  searchForm.stockType = ''
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 计算距离到货还有多少天
const calculateDaysToETA = (etaString: string) => {
  const today = new Date()
  const eta = new Date(etaString)
  const diffTime = eta.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'Overdue'
  } else if (diffDays === 0) {
    return 'Arriving today'
  } else if (diffDays === 1) {
    return 'Arriving tomorrow'
  } else {
    return `${diffDays} days remaining`
  }
}
</script>

<style lang="scss" scoped>
.inventory {
  .search-bar {
    margin-bottom: 24px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;

    .search-input,
    .search-select {
      width: 200px;
    }
  }

  .inventory-info {
    margin-bottom: 24px;

    .warehouse-card {
      .card-header {
        font-weight: 500;
      }

      .warehouse-info {
        display: flex;
        gap: 32px;

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .label {
            color: var(--el-text-color-secondary);
          }

          .value {
            font-weight: 500;
          }
        }
      }
    }
  }

  .inventory-table {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 24px;
    border: 1px solid var(--el-border-color-lighter);

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .sku-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .warehouse-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .warehouse-stock {
        padding: 12px;
        background: var(--el-fill-color-light);
        border-radius: 6px;

        .warehouse-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;

          .warehouse-name {
            font-weight: 500;
            color: var(--el-text-color-primary);
          }
        }

        .warehouse-code {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          margin-bottom: 8px;
        }

        .stock-details {
          display: flex;
          gap: 16px;
          justify-content: flex-start;

          &.total {
            justify-content: flex-end;
          }

          .stock-item {
            font-family: monospace;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 13px;

            &.available {
              background-color: var(--el-color-success-light-9);
              color: var(--el-color-success);
            }

            &.locked {
              background-color: var(--el-color-warning-light-9);
              color: var(--el-color-warning);
            }

            &.damaged {
              background-color: var(--el-color-danger-light-9);
              color: var(--el-color-danger);
            }
          }
        }
      }
    }

    .time-cell {
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }

    .stock-number {
      font-family: monospace;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 13px;
      display: inline-block;
      min-width: 60px;
      text-align: center;

      &.available {
        background-color: var(--el-color-success-light-9);
        color: var(--el-color-success);
      }

      &.locked {
        background-color: var(--el-color-warning-light-9);
        color: var(--el-color-warning);
      }

      &.damaged {
        background-color: var(--el-color-danger-light-9);
        color: var(--el-color-danger);
      }

      &.in-transit {
        background-color: var(--el-color-info-light-9);
        color: var(--el-color-info);
        cursor: pointer;

        &:hover {
          background-color: var(--el-color-info-light-8);
        }
      }
    }

    .warehouse-header {
      padding: 8px 0;

      .warehouse-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        font-weight: 500;
      }

      .warehouse-code {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        margin-bottom: 8px;
      }

      .stock-types {
        display: flex;
        gap: 16px;
        justify-content: space-between;

        .stock-type {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;
          text-align: center;
          flex: 1;

          &.available {
            background-color: var(--el-color-success-light-9);
            color: var(--el-color-success);
          }

          &.locked {
            background-color: var(--el-color-warning-light-9);
            color: var(--el-color-warning);
          }

          &.damaged {
            background-color: var(--el-color-danger-light-9);
            color: var(--el-color-danger);
          }

          &.in-transit {
            background-color: var(--el-color-info-light-9);
            color: var(--el-color-info);
          }
        }
      }
    }

    .stock-row {
      display: flex;
      gap: 16px;
      justify-content: space-between;
    }

    .stock-number {
      flex: 1;
      text-align: center;
    }
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}

.sync-dialog {
  .sync-result {
    .failed-items {
      margin-top: 24px;
      
      .failed-title {
        font-weight: 500;
        margin-bottom: 12px;
      }

      .failed-list {
        margin: 0;
        padding-left: 20px;
        color: var(--el-text-color-regular);

        li {
          margin-bottom: 8px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.transit-details {
  .transit-header {
    font-weight: 500;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }

  .transit-list {
    .transit-item {
      padding: 8px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .po-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;

        .po-number {
          font-weight: 500;
          color: var(--el-color-primary);
        }

        .po-quantity {
          color: var(--el-text-color-secondary);
        }
      }

      .eta-info {
        display: flex;
        gap: 8px;
        align-items: center;
        color: var(--el-text-color-secondary);
        font-size: 13px;

        .eta-date {
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .eta-days {
          color: var(--el-color-info);
        }
      }
    }
  }
}
</style> 