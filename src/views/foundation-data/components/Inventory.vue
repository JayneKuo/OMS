<template>
  <div class="inventory">
    <!-- 主题标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon class="title-icon"><Box /></el-icon>
        Inventory Management
      </h1>
      <p class="page-subtitle">Manage your inventory across multiple warehouses and track batch details</p>
    </div>

    <!-- 顶部搜索卡片 -->
    <el-card class="search-card">
      <template #header>
        <div class="search-card-header">
          <el-icon class="search-icon"><Search /></el-icon>
          <span>Search & Filter</span>
        </div>
      </template>
      
      <div class="search-content">
        <template v-if="viewMode === 'summary'">
          <div class="search-row">
            <el-input 
              v-model="summarySearchForm.sku" 
              placeholder="Search SKU..." 
              clearable 
              class="search-input"
              prefix-icon="Search"
            />
            <el-input 
              v-model="summarySearchForm.warehouseCode" 
              placeholder="Warehouse Code..." 
              clearable 
              class="search-input"
              prefix-icon="OfficeBuilding"
            />
            <el-select 
              v-model="summarySearchForm.wmsSystem" 
              placeholder="WMS System" 
              clearable 
              class="search-select"
            >
              <el-option label="WMS V1" value="wms_v1" />
              <el-option label="WMS V2" value="wms_v2" />
              <el-option label="Other WMS" value="other" />
            </el-select>
            <el-select 
              v-model="summarySearchForm.stockType" 
              placeholder="Stock Type" 
              clearable 
              class="search-select"
            >
              <el-option label="Available" value="available" />
              <el-option label="Locked" value="locked" />
              <el-option label="Damaged" value="damaged" />
            </el-select>
          </div>
          <div class="search-actions">
            <el-button type="primary" @click="handleSearch" class="search-btn">
              <el-icon><Search /></el-icon>
              Search
            </el-button>
            <el-button @click="resetSearch" class="reset-btn">
              <el-icon><RefreshLeft /></el-icon>
              Reset
            </el-button>
          </div>
        </template>
        
        <template v-else>
          <div class="search-row">
            <el-input 
              v-model="batchSearchForm.sku" 
              placeholder="Search SKU..." 
              clearable 
              class="search-input"
              prefix-icon="Search"
            />
            <el-input 
              v-model="batchSearchForm.warehouse" 
              placeholder="Warehouse..." 
              clearable 
              class="search-input"
              prefix-icon="OfficeBuilding"
            />
            <el-input 
              v-model="batchSearchForm.lotNo" 
              placeholder="Lot No..." 
              clearable 
              class="search-input"
              prefix-icon="Collection"
            />
            <el-input 
              v-model="batchSearchForm.sn" 
              placeholder="Serial Number..." 
              clearable 
              class="search-input"
              prefix-icon="Postcard"
            />
          </div>
          <div class="search-actions">
            <el-button type="primary" @click="batchPagination.currentPage = 1" class="search-btn">
              <el-icon><Search /></el-icon>
              Search
            </el-button>
            <el-button @click="resetBatchSearch" class="reset-btn">
              <el-icon><RefreshLeft /></el-icon>
              Reset
            </el-button>
          </div>
        </template>
      </div>
    </el-card>

    <!-- 库存信息卡片 -->
    <div class="inventory-info" v-if="warehouseInfo.wmsSystem && viewMode === 'summary'">
      <el-card class="warehouse-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><OfficeBuilding /></el-icon>
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

    <!-- 列表区域 -->
    <el-card class="list-card">
      <!-- 列表顶部：标题 + 右侧操作 -->
      <template #header>
        <div class="list-header">
          <div class="list-title">
            <h3 v-if="viewMode === 'summary'">
              <el-icon><Grid /></el-icon>
              Inventory Summary
            </h3>
            <h3 v-else>
              <el-icon><List /></el-icon>
              Batch Details
            </h3>
            <span class="list-subtitle" v-if="viewMode === 'summary'">
              {{ inventoryData.length }} SKUs across {{ allWarehouses.length }} warehouses
            </span>
            <span class="list-subtitle" v-else>
              {{ filteredBatchList.length }} batch records
            </span>
          </div>
          
          <!-- 右侧操作按钮 -->
          <div class="list-actions">
            <!-- 视图切换 -->
            <el-radio-group v-model="viewMode" size="small" class="view-switch">
              <el-radio-button label="summary">
                <el-icon><Grid /></el-icon>
                Summary
              </el-radio-button>
              <el-radio-button label="batch">
                <el-icon><List /></el-icon>
                Batch
              </el-radio-button>
            </el-radio-group>
            
            <!-- 刷新按钮 -->
            <el-button 
              v-if="viewMode === 'summary'" 
              type="primary" 
              @click="handleBatchSync" 
              :loading="syncing" 
              class="refresh-btn"
            >
              <el-icon><Refresh /></el-icon>
              Sync All
            </el-button>
            <el-button 
              v-else 
              type="primary" 
              @click="refreshBatchData" 
              :loading="loading" 
              class="refresh-btn"
            >
              <el-icon><Refresh /></el-icon>
              Refresh
            </el-button>
          </div>
        </div>
      </template>

      <!-- 表格内容 -->
      <div class="table-content">
        <!-- 汇总视图表格 -->
        <transition name="fade" mode="out-in">
          <div v-if="viewMode === 'summary'" key="summary">
            <el-table :data="inventoryData" style="width: 100%" v-loading="loading" class="modern-table">
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
          </div>
        </transition>

        <!-- 批次明细视图表格 -->
        <transition name="fade" mode="out-in">
          <div v-if="viewMode === 'batch'" key="batch">
            <el-table :data="pagedBatchList" style="width: 100%" v-loading="loading" stripe class="modern-table batch-table">
              <el-table-column prop="sku" label="SKU" min-width="100" />
              <el-table-column prop="title" label="TITLE" min-width="180" />
              <el-table-column prop="warehouse" label="Warehouse" min-width="120" />
              <el-table-column prop="lotNo" label="Lot No." min-width="120" />
              <el-table-column prop="expirationDate" label="Expiration Date" min-width="120">
                <template #default="{ row }">
                  <span :class="{ 'expired-date': getExpiredQty(row.expirationDate, row.quantity) > 0 }">
                    {{ row.expirationDate }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="sn" label="SN" min-width="120" />
              <el-table-column prop="shelfLifeDays" label="Shelf Life Days" min-width="100" />
              <el-table-column prop="mfgDate" label="Mfg Date" min-width="120" />
              <el-table-column prop="defaultUom" label="Default UOM" min-width="120">
                <template #default="{ row }">
                  <div class="uom-tag">{{ row.defaultUom }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="baseUom" label="Base UOM" min-width="120">
                <template #default="{ row }">
                  <div class="uom-tag">{{ row.baseUom }}</div>
                </template>
              </el-table-column>
              <el-table-column label="Available Default" min-width="150">
                <template #default="{ row }">
                  <div class="uom-cell">
                    <span class="qty">{{ row.availableDefaultQty }}</span>
                    <span class="uom">{{ row.defaultUom }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Available Base" min-width="150">
                <template #default="{ row }">
                  <div class="uom-cell">
                    <span class="qty">{{ row.availableBaseQty }}</span>
                    <span class="uom">{{ row.baseUom }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="Quantity" min-width="80" align="center">
                <template #default="{ row }">
                  <el-tag size="small" type="info">{{ row.quantity }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Expired Qty" min-width="100" align="center">
                <template #default="{ row }">
                  <el-tag 
                    v-if="getExpiredQty(row.expirationDate, row.quantity) > 0"
                    size="small" 
                    type="danger"
                    class="expired-tag"
                  >
                    {{ getExpiredQty(row.expirationDate, row.quantity) }}
                  </el-tag>
                  <span v-else class="no-expired">0</span>
                </template>
              </el-table-column>
            </el-table>
            
            <div v-if="pagedBatchList.length === 0" class="empty-state">
              <el-icon class="empty-icon"><Box /></el-icon>
              <p>No batch data available</p>
              <span>Try adjusting your search criteria</span>
            </div>
          </div>
        </transition>
      </div>
    </el-card>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="viewMode === 'summary'"
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="modern-pagination"
      />
      <el-pagination
        v-else
        v-model:current-page="batchPagination.currentPage"
        v-model:page-size="batchPagination.pageSize"
        :total="filteredBatchList.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleBatchPageSizeChange"
        @current-change="handleBatchPageChange"
        class="modern-pagination"
      />
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
import { ref, reactive, computed } from 'vue'
import { Search, Refresh, Link, CircleClose, View, Grid, List, OfficeBuilding, RefreshLeft, Collection, Postcard, Box } from '@element-plus/icons-vue'
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
  batchDetails?: {
    lotNo: string
    expirationDate: string
    sn: string
    shelfLifeDays: number
    mfgDate: string
    quantity: number
    title: string
    defaultUom: string
    baseUom: string
    availableDefaultQty: number
    availableBaseQty: number
  }[]
}

interface InventoryItem {
  sku: string
  warehouses: WarehouseStock[]
  lastSync?: string
  syncing?: boolean
}

// 视图切换：'summary'（汇总视图）或 'batch'（按批次视图）
const viewMode = ref<'summary' | 'batch'>('summary')

// 汇总视图搜索表单
const summarySearchForm = reactive({
  sku: '',
  warehouseCode: '',
  wmsSystem: '',
  stockType: ''
})

// 批次明细视图的搜索表单
const batchSearchForm = reactive({
  sku: '',
  warehouse: '',
  lotNo: '',
  sn: ''
})

// 优化后的批次明细mock数据生成函数（必须在inventoryData之前定义）
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}
function pad(num: number) { return num < 10 ? '0' + num : num }
function randomSN() { return 'SN' + Math.floor(Math.random() * 9000 + 1000) }
function randomLot() { return 'LOT-' + Math.floor(Math.random() * 9000 + 1000) }
function randomQty() { return Math.floor(Math.random() * 100 + 1) }
const today = new Date()
function mockBatchDetails(sku: string, warehouse: string) {
  const arr = []
  const uomPairs = [
    { defaultUom: 'CS', baseUom: 'EA', ratio: 12 },
    { defaultUom: 'PK', baseUom: 'EA', ratio: 6 },
    { defaultUom: 'BX', baseUom: 'EA', ratio: 24 },
    { defaultUom: 'CT', baseUom: 'EA', ratio: 48 }
  ]
  
  for (let i = 0; i < 5; i++) {
    const isExpired = i < 2
    const expDate = isExpired
      ? randomDate(new Date(today.getFullYear(), today.getMonth() - 6, 1), new Date(today.getFullYear(), today.getMonth() - 1, 28))
      : randomDate(new Date(today.getFullYear(), today.getMonth() + 1, 1), new Date(today.getFullYear(), today.getMonth() + 12, 28))
    const mfgDate = randomDate(new Date(today.getFullYear() - 1, 0, 1), new Date(today.getFullYear(), today.getMonth(), 1))
    
    // 随机选择一个UOM对
    const uomPair = uomPairs[Math.floor(Math.random() * uomPairs.length)]
    const baseQty = Math.floor(Math.random() * 1000 + 100) // 100-1100的基础单位数量
    const defaultQty = Math.floor(baseQty / uomPair.ratio) // 根据比例计算默认单位数量
    
    arr.push({
      lotNo: randomLot(),
      expirationDate: `${expDate.getFullYear()}-${pad(expDate.getMonth() + 1)}-${pad(expDate.getDate())}`,
      sn: randomSN(),
      shelfLifeDays: Math.floor((expDate.getTime() - mfgDate.getTime()) / (1000 * 60 * 60 * 24)),
      mfgDate: `${mfgDate.getFullYear()}-${pad(mfgDate.getMonth() + 1)}-${pad(mfgDate.getDate())}`,
      quantity: randomQty(),
      title: `${sku} - ${warehouse} Batch ${i + 1}`,
      defaultUom: uomPair.defaultUom,
      baseUom: uomPair.baseUom,
      availableDefaultQty: defaultQty,
      availableBaseQty: baseQty
    })
  }
  return arr
}

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
        availableStock: 150,
        lockedStock: 25,
        damagedStock: 8,
        inTransitStock: 200,
        inTransitDetails: [
          { poNumber: 'PO-2024-001', quantity: 100, eta: '2024-03-20' },
          { poNumber: 'PO-2024-002', quantity: 100, eta: '2024-03-25' }
        ],
        batchDetails: mockBatchDetails('SKU001', 'LA Warehouse')
      },
      {
        id: 'wh2',
        name: 'NY Warehouse',
        code: 'NYW',
        system: 'wms_v2',
        availableStock: 89,
        lockedStock: 12,
        damagedStock: 3,
        inTransitStock: 150,
        inTransitDetails: [
          { poNumber: 'PO-2024-003', quantity: 150, eta: '2024-03-22' }
        ],
        batchDetails: mockBatchDetails('SKU001', 'NY Warehouse')
      },
      {
        id: 'wh3',
        name: 'Chicago Warehouse',
        code: 'CHW',
        system: 'other',
        availableStock: 75,
        lockedStock: 8,
        damagedStock: 3,
        inTransitStock: 0,
        batchDetails: mockBatchDetails('SKU001', 'Chicago Warehouse')
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
        inTransitStock: 300,
        inTransitDetails: [
          { poNumber: 'PO-2024-004', quantity: 200, eta: '2024-03-18' },
          { poNumber: 'PO-2024-005', quantity: 100, eta: '2024-03-28' }
        ],
        batchDetails: mockBatchDetails('SKU002', 'LA Warehouse')
      },
      {
        id: 'wh2',
        name: 'NY Warehouse',
        code: 'NYW',
        system: 'wms_v2',
        availableStock: 245,
        lockedStock: 35,
        damagedStock: 12,
        inTransitStock: 0,
        batchDetails: mockBatchDetails('SKU002', 'NY Warehouse')
      },
      {
        id: 'wh3',
        name: 'Chicago Warehouse',
        code: 'CHW',
        system: 'other',
        availableStock: 180,
        lockedStock: 20,
        damagedStock: 5,
        inTransitStock: 50,
        inTransitDetails: [
          { poNumber: 'PO-2024-006', quantity: 50, eta: '2024-03-30' }
        ],
        batchDetails: mockBatchDetails('SKU002', 'Chicago Warehouse')
      }
    ],
    lastSync: '2024-03-15 12:00:00'
  },
  {
    sku: 'SKU003',
    syncing: false,
    warehouses: [
      {
        id: 'wh1',
        name: 'LA Warehouse',
        code: 'LAW',
        system: 'wms_v1',
        availableStock: 95,
        lockedStock: 15,
        damagedStock: 2,
        inTransitStock: 80,
        inTransitDetails: [
          { poNumber: 'PO-2024-007', quantity: 80, eta: '2024-03-26' }
        ],
        batchDetails: mockBatchDetails('SKU003', 'LA Warehouse')
      },
      {
        id: 'wh2',
        name: 'NY Warehouse',
        code: 'NYW',
        system: 'wms_v2',
        availableStock: 156,
        lockedStock: 18,
        damagedStock: 6,
        inTransitStock: 0,
        batchDetails: mockBatchDetails('SKU003', 'NY Warehouse')
      },
      {
        id: 'wh3',
        name: 'Chicago Warehouse',
        code: 'CHW',
        system: 'other',
        availableStock: 67,
        lockedStock: 9,
        damagedStock: 4,
        inTransitStock: 120,
        inTransitDetails: [
          { poNumber: 'PO-2024-008', quantity: 70, eta: '2024-03-24' },
          { poNumber: 'PO-2024-009', quantity: 50, eta: '2024-04-02' }
        ],
        batchDetails: mockBatchDetails('SKU003', 'Chicago Warehouse')
      }
    ],
    lastSync: '2024-03-15 12:00:00'
  },
  {
    sku: 'SKU004',
    syncing: false,
    warehouses: [
      {
        id: 'wh1',
        name: 'LA Warehouse',
        code: 'LAW',
        system: 'wms_v1',
        availableStock: 0,
        lockedStock: 0,
        damagedStock: 15,
        inTransitStock: 0,
        batchDetails: mockBatchDetails('SKU004', 'LA Warehouse')
      },
      {
        id: 'wh2',
        name: 'NY Warehouse',
        code: 'NYW',
        system: 'wms_v2',
        availableStock: 45,
        lockedStock: 5,
        damagedStock: 0,
        inTransitStock: 200,
        inTransitDetails: [
          { poNumber: 'PO-2024-010', quantity: 200, eta: '2024-03-21' }
        ],
        batchDetails: mockBatchDetails('SKU004', 'NY Warehouse')
      },
      {
        id: 'wh3',
        name: 'Chicago Warehouse',
        code: 'CHW',
        system: 'other',
        availableStock: 123,
        lockedStock: 27,
        damagedStock: 8,
        inTransitStock: 0,
        batchDetails: mockBatchDetails('SKU004', 'Chicago Warehouse')
      }
    ],
    lastSync: '2024-03-15 11:30:00'
  },
  {
    sku: 'SKU005',
    syncing: false,
    warehouses: [
      {
        id: 'wh1',
        name: 'LA Warehouse',
        code: 'LAW',
        system: 'wms_v1',
        availableStock: 234,
        lockedStock: 45,
        damagedStock: 12,
        inTransitStock: 100,
        inTransitDetails: [
          { poNumber: 'PO-2024-011', quantity: 100, eta: '2024-03-29' }
        ],
        batchDetails: mockBatchDetails('SKU005', 'LA Warehouse')
      },
      {
        id: 'wh2',
        name: 'NY Warehouse',
        code: 'NYW',
        system: 'wms_v2',
        availableStock: 78,
        lockedStock: 8,
        damagedStock: 2,
        inTransitStock: 0,
        batchDetails: mockBatchDetails('SKU005', 'NY Warehouse')
      },
      {
        id: 'wh3',
        name: 'Chicago Warehouse',
        code: 'CHW',
        system: 'other',
        availableStock: 189,
        lockedStock: 31,
        damagedStock: 7,
        inTransitStock: 250,
        inTransitDetails: [
          { poNumber: 'PO-2024-012', quantity: 150, eta: '2024-03-23' },
          { poNumber: 'PO-2024-013', quantity: 100, eta: '2024-04-05' }
        ],
        batchDetails: mockBatchDetails('SKU005', 'Chicago Warehouse')
      }
    ],
    lastSync: '2024-03-15 13:15:00'
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

// 处理搜索
const handleSearch = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新仓库信息
    warehouseInfo.warehouseCode = summarySearchForm.warehouseCode
    warehouseInfo.wmsSystem = summarySearchForm.wmsSystem || 'wms_v1'
    
    // 实际项目中这里需要调用后端 API
    // 前端筛选示例：
    const filteredData = inventoryData.value.filter(item => {
      const skuMatch = !summarySearchForm.sku || item.sku.toLowerCase().includes(summarySearchForm.sku.toLowerCase())
      const warehouseMatch = !summarySearchForm.warehouseCode || item.warehouses.some(w => 
        w.code.toLowerCase().includes(summarySearchForm.warehouseCode.toLowerCase())
      )
      const systemMatch = !summarySearchForm.wmsSystem || item.warehouses.some(w => 
        w.system === summarySearchForm.wmsSystem
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
  summarySearchForm.sku = ''
  summarySearchForm.warehouseCode = ''
  summarySearchForm.wmsSystem = ''
  summarySearchForm.stockType = ''
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

// 批次明细一维化数据
const batchList = computed(() => {
  // 将所有SKU、所有仓库的批次明细平铺为一维数组
  const result: Array<{
    sku: string
    warehouse: string
    lotNo: string
    expirationDate: string
    sn: string
    shelfLifeDays: number
    mfgDate: string
    quantity: number
  }> = []
  inventoryData.value.forEach(item => {
    item.warehouses.forEach(wh => {
      (wh.batchDetails || []).forEach(batch => {
        result.push({
          sku: item.sku,
          warehouse: wh.name,
          lotNo: batch.lotNo,
          expirationDate: batch.expirationDate,
          sn: batch.sn,
          shelfLifeDays: batch.shelfLifeDays,
          mfgDate: batch.mfgDate,
          quantity: batch.quantity
        })
      })
    })
  })
  return result
})

// 批次明细视图的过滤后数据
const filteredBatchList = computed(() => {
  return batchList.value.filter(row => {
    const skuMatch = !batchSearchForm.sku || row.sku.toLowerCase().includes(batchSearchForm.sku.toLowerCase())
    const warehouseMatch = !batchSearchForm.warehouse || row.warehouse.toLowerCase().includes(batchSearchForm.warehouse.toLowerCase())
    const lotNoMatch = !batchSearchForm.lotNo || row.lotNo.toLowerCase().includes(batchSearchForm.lotNo.toLowerCase())
    const snMatch = !batchSearchForm.sn || row.sn.toLowerCase().includes(batchSearchForm.sn.toLowerCase())
    return skuMatch && warehouseMatch && lotNoMatch && snMatch
  })
})

// 批次明细分页
const batchPagination = reactive({
  currentPage: 1,
  pageSize: 10
})
const pagedBatchList = computed(() => {
  const start = (batchPagination.currentPage - 1) * batchPagination.pageSize
  const end = start + batchPagination.pageSize
  return filteredBatchList.value.slice(start, end)
})

// 计算过期数量
const getExpiredQty = (expirationDate: string, quantity: number) => {
  const exp = new Date(expirationDate)
  return exp < today ? quantity : 0
}

// 批次明细分页事件
const handleBatchPageChange = (page: number) => {
  batchPagination.currentPage = page
}
const handleBatchPageSizeChange = (size: number) => {
  batchPagination.pageSize = size
  batchPagination.currentPage = 1
}

// 批次明细搜索重置
const resetBatchSearch = () => {
  batchSearchForm.sku = ''
  batchSearchForm.warehouse = ''
  batchSearchForm.lotNo = ''
  batchSearchForm.sn = ''
}

// 处理批量同步
const handleBatchSync = async () => {
  syncing.value = true
  try {
    // 模拟批量同步所有SKU
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 更新所有SKU的同步时间
    inventoryData.value.forEach(item => {
      item.lastSync = new Date().toLocaleString()
    })
    
    // 显示同步结果
    syncResult.success = true
    syncResult.totalItems = inventoryData.value.length
    syncResult.syncedItems = inventoryData.value.length
    syncResult.failedItems = []
    syncResultVisible.value = true
    
    ElMessage.success('All inventory synced successfully')
  } catch (error) {
    ElMessage.error('Failed to sync inventory')
  } finally {
    syncing.value = false
  }
}

// 刷新批次数据
const refreshBatchData = async () => {
  loading.value = true
  try {
    // 模拟刷新数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Batch data refreshed successfully')
  } catch (error) {
    ElMessage.error('Failed to refresh batch data')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.inventory {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;

  .page-header {
    margin-bottom: 24px;
    
    .page-title {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
      color: #2d3748;
      display: flex;
      align-items: center;
      gap: 12px;
      
      .title-icon {
        color: #4299e1;
        font-size: 28px;
      }
    }
    
    .page-subtitle {
      margin: 0;
      color: #718096;
      font-size: 15px;
    }
  }

  .search-card {
    margin-bottom: 24px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    background: #ffffff;

    .search-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #4a5568;

      .search-icon {
        color: #4299e1;
        font-size: 16px;
      }
    }

    .search-content {
      .search-row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
        flex-wrap: wrap;

        .search-input, .search-select {
          flex: 1;
          min-width: 200px;
          
          :deep(.el-input__wrapper) {
            border-radius: 6px;
            transition: border-color 0.2s ease;

            &:hover {
              border-color: #cbd5e1;
            }

            &.is-focus {
              border-color: #4299e1;
            }
          }
        }
      }

      .search-actions {
        display: flex;
        gap: 12px;

        .search-btn {
          background: #4299e1;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.2s ease;

          &:hover {
            background: #3182ce;
          }
        }

        .reset-btn {
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          transition: all 0.2s ease;

          &:hover {
            border-color: #cbd5e1;
            background: #f7fafc;
          }
        }
      }
    }
  }

  .inventory-info {
    margin-bottom: 24px;

    .warehouse-card {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      background: #ffffff;

      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: #4a5568;

        .header-icon {
          color: #4299e1;
          font-size: 16px;
        }
      }

      .warehouse-info {
        display: flex;
        gap: 32px;

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .label {
            color: #718096;
            font-weight: 500;
          }

          .value {
            font-weight: 500;
            color: #4a5568;
          }
        }
      }
    }
  }

  .list-card {
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    background: #ffffff;
    margin-bottom: 24px;

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .list-title {
        h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 8px;

          .el-icon {
            color: #4299e1;
          }
        }

        .list-subtitle {
          color: #718096;
          font-size: 14px;
        }
      }

      .list-actions {
        display: flex;
        align-items: center;
        gap: 16px;

        .view-switch {
          :deep(.el-radio-button) {
            .el-radio-button__inner {
              border-radius: 6px;
              font-weight: 500;
              padding: 8px 16px;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 6px;
              border: 1px solid #e2e8f0;

              &:hover {
                background: #f7fafc;
                border-color: #cbd5e1;
              }
            }

            &.is-active .el-radio-button__inner {
              background: #4299e1;
              color: white;
              border-color: #4299e1;
            }
          }
        }

        .refresh-btn {
          background: #48bb78;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.2s ease;

          &:hover {
            background: #38a169;
          }
        }
      }
    }

    .table-content {
      .modern-table {
        :deep(.el-table__header) {
          th {
            background: #f7fafc;
            color: #4a5568;
            font-weight: 600;
            border: none;
          }
        }

        :deep(.el-table__body) {
          tr {
            transition: background-color 0.2s ease;

            &:hover {
              background: #f7fafc;
            }

            td {
              border: none;
            }
          }
        }

        // Summary视图的库存数字样式
        .sku-cell {
          display: flex;
          align-items: center;
          gap: 8px;
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
            color: #718096;
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
                background-color: #c6f6d5;
                color: #22543d;
              }

              &.locked {
                background-color: #fed7d7;
                color: #742a2a;
              }

              &.damaged {
                background-color: #fbb6ce;
                color: #702459;
              }

              &.in-transit {
                background-color: #bee3f8;
                color: #2a4365;
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
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 13px;
          display: inline-block;
          min-width: 60px;
          text-align: center;
          font-weight: 500;

          &.available {
            background-color: #c6f6d5;
            color: #22543d;
          }

          &.locked {
            background-color: #fed7d7;
            color: #742a2a;
          }

          &.damaged {
            background-color: #fbb6ce;
            color: #702459;
          }

          &.in-transit {
            background-color: #bee3f8;
            color: #2a4365;
            cursor: pointer;

            &:hover {
              background-color: #90cdf4;
            }
          }
        }

        .time-cell {
          color: #718096;
          font-size: 13px;
        }

        &.batch-table {
          .expired-date {
            color: #e53e3e;
            font-weight: 600;
          }

          .expired-tag {
            animation: pulse 2s infinite;
          }

          .no-expired {
            color: #38a169;
            font-weight: 500;
          }
        }
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #718096;

        .empty-icon {
          font-size: 48px;
          color: #cbd5e1;
          margin-bottom: 16px;
        }

        p {
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 8px 0;
          color: #4a5568;
        }

        span {
          font-size: 14px;
          color: #a0aec0;
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 20px 0;

    .modern-pagination {
      :deep(.el-pager) {
        li {
          border-radius: 4px;
          margin: 0 2px;
          transition: all 0.2s ease;

          &:hover {
            background: #4299e1;
            color: white;
          }

          &.is-active {
            background: #4299e1;
            color: white;
          }
        }
      }

      :deep(.btn-prev), :deep(.btn-next) {
        border-radius: 4px;
        transition: all 0.2s ease;

        &:hover {
          background: #4299e1;
          color: white;
        }
      }
    }
  }

  // 过渡动画
  .fade-enter-active, .fade-leave-active {
    transition: all 0.2s ease;
  }

  .fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }

  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  // 脉冲动画
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
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

.uom-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .qty {
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-weight: 500;
    color: #2d3748;
  }
  
  .uom {
    font-size: 12px;
    color: #718096;
    background: #edf2f7;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.uom-tag {
  display: inline-block;
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
  background: #edf2f7;
  padding: 2px 8px;
  border-radius: 4px;
  text-align: center;
  min-width: 50px;
}
</style> 