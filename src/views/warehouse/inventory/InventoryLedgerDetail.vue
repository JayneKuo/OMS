<template>
  <div class="inventory-ledger-detail">
    <!-- 返回按钮 -->
    <div class="back-header">
      <el-button type="text" @click="handleBack" class="back-button">
        <el-icon><ArrowLeft /></el-icon>
        <span>Back</span>
      </el-button>
    </div>

    <!-- 页面顶部：标题 + 操作按钮 -->
    <div class="page-header">
      <div class="header-left">
        <div class="title-section">
          <h1 class="main-title">{{ sku.name }}</h1>
          <div class="sku-info">
            <span class="sku-label">SKU</span>
            <span class="sku-code">{{ sku.code }}</span>
          </div>
        </div>
        <div class="location-section">
          <span class="location-label">Location</span>
          <div class="location-display">
            <!-- 单个仓库时直接显示 -->
            <template v-if="locationOptions.length === 1">
              <span class="location-text">
                {{ locationOptions[0].label }}
                <el-tag size="small" :type="locationOptions[0].status === 'Active' ? 'success' : 'warning'" class="location-tag">
                  {{ locationOptions[0].status }}
                </el-tag>
              </span>
            </template>
            <!-- 多个仓库时显示标签列表 -->
            <template v-else>
              <div class="location-tags">
                <el-tag
                  :type="selectedLocation === 'ALL' ? 'success' : 'info'"
                  :effect="selectedLocation === 'ALL' ? 'dark' : 'plain'"
                  class="location-tag-item"
                  @click="handleLocationSelect('ALL')"
                  style="cursor: pointer;"
                >
                  All Locations
                </el-tag>
                <el-tag
                  v-for="location in locationOptions"
                  :key="location.value"
                  :type="selectedLocation === location.value ? 'primary' : 'info'"
                  :effect="selectedLocation === location.value ? 'dark' : 'plain'"
                  class="location-tag-item"
                  @click="handleLocationSelect(location.value)"
                  style="cursor: pointer;"
                >
                  {{ location.label }}
                  <el-tag 
                    size="small" 
                    :type="location.status === 'Active' ? 'success' : 'warning'"
                    class="status-tag"
                  >
                    {{ location.status }}
                  </el-tag>
                </el-tag>
              </div>
            </template>
          </div>
          <el-button link type="primary" class="view-location-btn" @click="handleViewLocation">
            View location
          </el-button>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleSync">
          <el-icon><Refresh /></el-icon>
          Sync
        </el-button>
      </div>
    </div>

    <!-- 库存概览 Snapshot -->
    <div class="snapshot-section">
      <el-card class="snapshot-card">
        <template #header>
          <div class="card-title">Inventory Overview</div>
        </template>
        <div class="snapshot-row">
          <!-- WMS Physical View 字段 -->
          <div class="snapshot-item">
            <div class="item-label">On Hand</div>
            <div class="item-value">{{ aggregatedSnapshot.on_hand }}</div>
            <div class="item-formula">
              <div class="formula-title">计算公式：</div>
              <div class="formula-content">
                On Hand = Hold + Damaged + WMS Allocated + WMS Available
              </div>
              <div class="formula-calculation">
                {{ aggregatedSnapshot.on_hand }} = {{ aggregatedSnapshot.hold }} + {{ aggregatedSnapshot.damaged }} + {{ aggregatedSnapshot.wms_allocated }} + {{ aggregatedSnapshot.wms_available }}
              </div>
            </div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">Hold</div>
            <div class="item-value">{{ aggregatedSnapshot.hold }}</div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">Damaged</div>
            <div class="item-value">{{ aggregatedSnapshot.damaged }}</div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">WMS Available</div>
            <div class="item-value">{{ aggregatedSnapshot.wms_available }}</div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">WmsOpenOrder</div>
            <div class="item-value">
              {{ displayWmsOpenOrder }}
              <span class="uom-badge">{{ skuUOM.baseUOM }}</span>
            </div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">WMS Allocated</div>
            <div class="item-value">{{ aggregatedSnapshot.wms_allocated }}</div>
          </div>

          <!-- OMS View 字段 -->
          <div class="snapshot-item">
            <div class="item-label">OMS Available</div>
            <div class="item-value highlight">{{ omsAvailable }}</div>
            <div class="item-formula">
              <div class="formula-title">计算公式：</div>
              <div class="formula-content">
                OMS Available = WMS Available - WmsOpenOrder
              </div>
              <div class="formula-calculation">
                {{ omsAvailable }} = {{ aggregatedSnapshot.wms_available }} - {{ displayWmsOpenOrder }}
              </div>
            </div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">OMS Salable</div>
            <div class="item-value highlight">{{ omsSalable }}</div>
            <div class="item-formula">
              <div class="formula-title">计算公式：</div>
              <div class="formula-content">
                OMS Salable = OMS Available - (OpenOrder + Locked + Allocated + SafetyStock)
              </div>
              <div class="formula-calculation">
                {{ omsSalable }} = {{ omsAvailable }} - ({{ aggregatedSnapshot.OpenOrder }} + {{ aggregatedSnapshot.Locked }} + {{ aggregatedSnapshot.Allocated }} + {{ aggregatedSnapshot.SafetyStock }})
              </div>
            </div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">OMS Fulfillable</div>
            <div class="item-value highlight">{{ omsFulfillable }}</div>
            <div class="item-formula">
              <div class="formula-title">计算公式：</div>
              <div class="formula-content">
                OMS Fulfillable = (WMS Available + WMS Allocated) - Locked - Allocated
              </div>
              <div class="formula-calculation">
                {{ omsFulfillable }} = ({{ aggregatedSnapshot.wms_available }} + {{ aggregatedSnapshot.wms_allocated }}) - {{ aggregatedSnapshot.Locked }} - {{ aggregatedSnapshot.Allocated }}
              </div>
            </div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">OpenOrder</div>
            <div class="item-value">{{ aggregatedSnapshot.OpenOrder }}</div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">Locked</div>
            <div class="item-value">{{ aggregatedSnapshot.Locked }}</div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">Allocated</div>
            <div class="item-value">{{ aggregatedSnapshot.Allocated }}</div>
          </div>
          <div class="snapshot-item">
            <div class="item-label">SafetyStock</div>
            <div class="item-value">{{ aggregatedSnapshot.SafetyStock }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 库存流水表格 -->
    <el-card class="ledger-card">
      <template #header>
        <div class="card-header-row">
          <div class="card-title">Inventory Movement History</div>
        </div>
      </template>

      <!-- 筛选条件区域 -->
      <div class="ledger-filters-section">
        <div class="filter-row">
          <!-- 时间范围 - 使用两个独立的日期选择器，更紧凑 -->
          <div class="date-range-group">
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="Start"
              value-format="YYYY-MM-DD"
              format="MM/DD"
              style="width: 110px;"
              clearable
            />
            <span class="date-separator">-</span>
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="End"
              value-format="YYYY-MM-DD"
              format="MM/DD"
              style="width: 110px;"
              clearable
            />
          </div>
          
          <!-- Location 筛选 -->
          <el-select
            v-model="locationFilter"
            placeholder="Location"
            clearable
            style="width: 140px;"
          >
            <el-option label="All Locations" value="" />
            <el-option
              v-for="location in ledgerLocationOptions"
              :key="location"
              :label="location"
              :value="location"
            />
          </el-select>
          
          <!-- 事件类型 -->
          <el-select
            v-model="selectedEventType"
            placeholder="Event Type"
            clearable
            style="width: 160px;"
          >
            <el-option label="All Events" value="" />
            <el-option
              v-for="event in eventTypeOptions"
              :key="event.value"
              :label="event.label"
              :value="event.value"
            />
          </el-select>
          
          <!-- 字段类型 -->
          <el-select
            v-model="selectedField"
            placeholder="Inventory Type"
            clearable
            style="width: 160px;"
          >
            <el-option label="All Types" value="" />
            <el-option
              v-for="field in fieldOptions"
              :key="field"
              :label="getFieldDisplayName(field)"
              :value="field"
            />
          </el-select>
          
          <!-- 单号类型选择 -->
          <el-select
            v-model="documentTypeFilter"
            placeholder="Doc Type"
            clearable
            style="width: 120px;"
          >
            <el-option label="All Types" value="" />
            <el-option label="PO" value="PO" />
            <el-option label="ASN" value="ASN" />
            <el-option label="ORD" value="ORD" />
            <el-option label="WMS" value="WMS" />
            <el-option label="SHIP" value="SHIP" />
            <el-option label="DMG" value="DMG" />
            <el-option label="HOLD" value="HOLD" />
          </el-select>
          
          <!-- 单号搜索 -->
          <el-input
            v-model="documentNoFilter"
            placeholder="Search by Document No..."
            clearable
            style="width: 220px;"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <!-- 操作按钮 -->
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            Search
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            Reset
          </el-button>
        </div>
      </div>

      <!-- 表格容器 -->
      <div class="table-container">
        <el-table 
          :data="pagedLedgerRows" 
          stripe 
          border
          style="width: 100%"
          :height="tableHeight"
        >
          <el-table-column prop="time" label="Time" width="180" fixed="left">
            <template #default="{ row }">
              <span class="time-value">{{ formatTime(row.time) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="warehouse" label="Location" min-width="120">
            <template #default="{ row }">
              <span class="location-text">{{ row.warehouse }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="eventName" label="Event" min-width="140" class-name="highlight-event-column">
            <template #default="{ row }">
              <span class="event-text highlight">{{ row.eventName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="documentNo" label="Document No" min-width="160" class-name="highlight-document-column">
            <template #default="{ row }">
              <span class="document-text highlight">{{ row.documentNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="field" label="Inventory Type" min-width="140" class-name="highlight-field-column">
            <template #default="{ row }">
              <span class="field-name highlight">{{ getFieldDisplayName(row.field) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="before" label="Before" align="right" width="120">
            <template #default="{ row }">
              <span class="number-value before-value" :class="{ 
                'negative-value': row.before < 0,
                'zero-value': row.before === 0
              }">
                {{ formatNumber(row.before) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="change" label="Change" align="right" width="130" class-name="change-column">
            <template #default="{ row }">
              <span 
                class="change-value" 
                :class="row.change > 0 ? 'positive-change' : row.change < 0 ? 'negative-change' : 'zero-change'"
              >
                {{ row.change > 0 ? '+' : '' }}{{ formatNumber(row.change) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="after" label="After" align="right" width="110">
            <template #default="{ row }">
              <span class="number-value" :class="{ 'negative-value': row.after < 0 }">
                {{ formatNumber(row.after) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredLedgerRows.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Search, RefreshLeft, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ==================== 类型定义 ====================

interface SkuInfo {
  id: string
  code: string
  name: string
  imageUrl?: string
}

interface Warehouse {
  code: string
  name: string
}

interface InventorySnapshot {
  skuId: string
  warehouse: string
  on_hand: number
  hold: number
  damaged: number
  wms_available: number
  wms_allocated: number
  Incoming: number
  Receiving: number
  OpenOrder: number
  Locked: number
  Allocated: number
  WmsOpenOrder: number // WMS 返回的值（可能是 defaultUOM）
  WmsOpenOrderUOM?: string // WMS 返回的 WmsOpenOrder 的 UOM
  SafetyStock: number
  // UOM 信息
  baseUOM?: string // 基础单位，默认 EA
  defaultUOM?: string // 默认单位
  uomRatio?: number // defaultUOM 到 baseUOM 的转换比例
}

type InventoryEventType =
  | 'PO_CREATED'
  | 'PO_CANCELLED'
  | 'ASN_CREATED'
  | 'RECEIVING_STARTED'
  | 'RECEIVING_COMPLETED'
  | 'PUTAWAY_COMPLETED'
  | 'INBOUND_TRANSFER_IN'
  | 'INBOUND_TRANSFER_OUT'
  | 'ADJUSTMENT_INCREASE'
  | 'ADJUSTMENT_DECREASE'
  | 'CYCLE_COUNT_ADJUST'
  | 'DAMAGE_REPORTED'
  | 'DAMAGE_REVERSED'
  | 'HOLD_APPLIED'
  | 'HOLD_RELEASED'
  | 'SAFETY_STOCK_CHANGED'
  | 'OMS_ORDER_CREATED'
  | 'OMS_ORDER_CANCELLED'
  | 'OMS_LOCK'
  | 'OMS_UNLOCK'
  | 'OMS_ALLOCATE'
  | 'OMS_DEALLOCATE'
  | 'OMS_BACKORDERED'
  | 'WMS_ORDER_CREATED'
  | 'WMS_ORDER_CANCELLED'
  | 'WMS_ALLOCATE'
  | 'WMS_DEALLOCATE'
  | 'PICK_STARTED'
  | 'PICK_COMPLETED'
  | 'PACKED'
  | 'LOADED'
  | 'SHIPPED'
  | 'RETURN_RECEIVED'
  | 'RETURN_PUTAWAY'
  | 'MANUAL_CORRECTION'

type InventoryField =
  | 'Incoming'
  | 'Receiving'
  | 'on_hand'
  | 'wms_available'
  | 'wms_allocated'
  | 'hold'
  | 'damaged'
  | 'OpenOrder'
  | 'Locked'
  | 'Allocated'
  | 'WmsOpenOrder'
  | 'SafetyStock'

interface InventoryLedgerRow {
  time: string
  warehouse: string
  eventType: InventoryEventType
  eventName: string
  documentNo: string
  field: InventoryField
  before: number
  change: number
  after: number
}

// ==================== Props / 路由参数 ====================

const route = useRoute()
const router = useRouter()

// SKU 信息（从路由参数或 mock）
const sku = ref<SkuInfo>({
  id: (route.params.id as string) || 'sku-001',
  code: 'CM007-BLK',
  name: 'Demo SKU - Black',
  imageUrl: 'https://via.placeholder.com/80x80'
})

// SKU UOM 信息（mock 数据，实际应从 API 获取）
const skuUOM = ref({
  baseUOM: 'EA', // 基础单位
  defaultUOM: 'CS', // 默认单位（WMS 可能返回的单位）
  uomRatio: 12 // 1 CS = 12 EA
})

// Location 选项（mock 数据）
interface LocationOption {
  label: string
  value: string
  status: 'Active' | 'Inactive'
  source?: string
}

const locationOptions = ref<LocationOption[]>([
  { 
    label: 'UNIS - 890 [Source: Joliet]', 
    value: 'UNIS-890',
    status: 'Active',
    source: 'Joliet'
  },
  { 
    label: 'UNIS - CA01 [Source: Fontana]', 
    value: 'UNIS-CA01',
    status: 'Active',
    source: 'Fontana'
  }
])

// 默认选中第一个仓库，如果有多个仓库则默认选中"全部"
const selectedLocation = ref<string>(
  locationOptions.value.length > 1 ? 'ALL' : locationOptions.value[0]?.value || 'UNIS-890'
)

// 当前 Location 显示信息
const currentLocation = computed(() => {
  if (selectedLocation.value === 'ALL') {
    return null
  }
  return locationOptions.value.find(loc => loc.value === selectedLocation.value)
})

// 返回按钮处理
const handleBack = () => {
  router.back()
}

// 仓库列表（mock 数据，实际应从 props 或 API 获取）
const warehouses = ref<Warehouse[]>([
  { code: 'UNIS-890', name: 'UNIS 890 DC' },
  { code: 'UNIS-CA01', name: 'UNIS CA 01' }
])

// ==================== 仓库选择逻辑 ====================

// 根据选中的 Location 初始化仓库选择
const selectedWarehouses = computed(() => {
  if (selectedLocation.value === 'ALL') {
    return warehouses.value.map(w => w.code)
  }
  return [selectedLocation.value]
})

// 仓库筛选逻辑已通过 Location 选择来控制，不再需要单独的函数

// ==================== Mock Snapshot 数据 ====================

const snapshots = ref<InventorySnapshot[]>([
  {
    skuId: 'sku-001',
    warehouse: 'UNIS-890',
    on_hand: 150,
    hold: 10,
    damaged: 5,
    wms_available: 120,
    wms_allocated: 15,
    Incoming: 50,
    Receiving: 20,
    OpenOrder: 30,
    Locked: 20,
    Allocated: 15,
    WmsOpenOrder: 10, // WMS 返回的值（单位：CS）
    WmsOpenOrderUOM: 'CS', // WMS 返回的 UOM
    SafetyStock: 25,
    baseUOM: 'EA',
    defaultUOM: 'CS',
    uomRatio: 12
  },
  {
    skuId: 'sku-001',
    warehouse: 'UNIS-CA01',
    on_hand: 200,
    hold: 15,
    damaged: 8,
    wms_available: 160,
    wms_allocated: 17,
    Incoming: 30,
    Receiving: 15,
    OpenOrder: 25,
    Locked: 15,
    Allocated: 10,
    WmsOpenOrder: 8, // WMS 返回的值（单位：CS）
    WmsOpenOrderUOM: 'CS', // WMS 返回的 UOM
    SafetyStock: 30,
    baseUOM: 'EA',
    defaultUOM: 'CS',
    uomRatio: 12
  }
])

// ==================== UOM 转换函数 ====================

/**
 * 将 WMS 返回的 WmsOpenOrder 值从 defaultUOM 转换为 baseUOM (EA)
 * @param value WMS 返回的原始值
 * @param fromUOM 源 UOM（WMS 返回的单位）
 * @param toUOM 目标 UOM（默认 EA）
 * @param ratio 转换比例（defaultUOM 到 baseUOM）
 */
const convertToBaseUOM = (value: number, fromUOM: string = 'CS', toUOM: string = 'EA', ratio: number = 12): number => {
  // 如果已经是 baseUOM，直接返回
  if (fromUOM === toUOM || fromUOM === 'EA') {
    return value
  }
  // 转换为 baseUOM (EA)
  return value * ratio
}

// ==================== 聚合 Snapshot 计算 ====================

const aggregatedSnapshot = computed<InventorySnapshot>(() => {
  // 根据选中的 Location 过滤
  let filtered = snapshots.value
  if (selectedLocation.value !== 'ALL') {
    filtered = filtered.filter(s => s.warehouse === selectedLocation.value)
  }
  
  if (filtered.length === 0) {
    return {
      skuId: sku.value.id,
      warehouse: 'ALL',
      on_hand: 0,
      hold: 0,
      damaged: 0,
      wms_available: 0,
      wms_allocated: 0,
      Incoming: 0,
      Receiving: 0,
      OpenOrder: 0,
      Locked: 0,
      Allocated: 0,
      WmsOpenOrder: 0,
      SafetyStock: 0,
      baseUOM: 'EA',
      defaultUOM: 'CS',
      uomRatio: 12
    }
  }

  // 聚合时，WmsOpenOrder 需要先转换为 baseUOM 再相加
  const aggregated = filtered.reduce((acc, curr) => {
    // 将每个仓库的 WmsOpenOrder 转换为 baseUOM 后相加
    const wmsOpenOrderInBaseUOM = convertToBaseUOM(
      curr.WmsOpenOrder,
      curr.WmsOpenOrderUOM || curr.defaultUOM || 'CS',
      'EA',
      curr.uomRatio || skuUOM.value.uomRatio
    )
    
    return {
      skuId: sku.value.id,
      warehouse: 'ALL',
      on_hand: acc.on_hand + curr.on_hand,
      hold: acc.hold + curr.hold,
      damaged: acc.damaged + curr.damaged,
      wms_available: acc.wms_available + curr.wms_available,
      wms_allocated: acc.wms_allocated + curr.wms_allocated,
      Incoming: acc.Incoming + curr.Incoming,
      Receiving: acc.Receiving + curr.Receiving,
      OpenOrder: acc.OpenOrder + curr.OpenOrder,
      Locked: acc.Locked + curr.Locked,
      Allocated: acc.Allocated + curr.Allocated,
      WmsOpenOrder: acc.WmsOpenOrder + wmsOpenOrderInBaseUOM, // 使用转换后的值
      SafetyStock: acc.SafetyStock + curr.SafetyStock,
      baseUOM: 'EA',
      defaultUOM: curr.defaultUOM || 'CS',
      uomRatio: curr.uomRatio || skuUOM.value.uomRatio
    }
  }, {
    skuId: sku.value.id,
    warehouse: 'ALL',
    on_hand: 0,
    hold: 0,
    damaged: 0,
    wms_available: 0,
    wms_allocated: 0,
    Incoming: 0,
    Receiving: 0,
    OpenOrder: 0,
    Locked: 0,
    Allocated: 0,
    WmsOpenOrder: 0,
    SafetyStock: 0,
    baseUOM: 'EA' as string,
    defaultUOM: 'CS' as string,
    uomRatio: 12
  })

  return aggregated
})

// WmsOpenOrder 显示值（已转换为 baseUOM）
const displayWmsOpenOrder = computed(() => {
  return aggregatedSnapshot.value.WmsOpenOrder
})

// ==================== 派生指标计算 ====================

// OMS Available = wms_available - WmsOpenOrder
const omsAvailable = computed(() => {
  return aggregatedSnapshot.value.wms_available - aggregatedSnapshot.value.WmsOpenOrder
})

// OMS Salable = OMS_Available - (OpenOrder + Locked + Allocated + SafetyStock)
const omsSalable = computed(() => {
  const reserved = aggregatedSnapshot.value.OpenOrder +
    aggregatedSnapshot.value.Locked +
    aggregatedSnapshot.value.Allocated +
    aggregatedSnapshot.value.SafetyStock
  return omsAvailable.value - reserved
})

// OMS Fulfillable = (wms_available + wms_allocated) - Locked - Allocated
const omsFulfillable = computed(() => {
  const wmsFulfillable = aggregatedSnapshot.value.wms_available + aggregatedSnapshot.value.wms_allocated
  return wmsFulfillable - aggregatedSnapshot.value.Locked - aggregatedSnapshot.value.Allocated
})

// ==================== Mock Ledger 数据 ====================

const eventTypeLabels: Record<InventoryEventType, string> = {
  PO_CREATED: 'PO Created',
  PO_CANCELLED: 'PO Cancelled',
  ASN_CREATED: 'ASN Created',
  RECEIVING_STARTED: 'Receiving Started',
  RECEIVING_COMPLETED: 'Receiving Completed',
  PUTAWAY_COMPLETED: 'Putaway Completed',
  INBOUND_TRANSFER_IN: 'Inbound Transfer In',
  INBOUND_TRANSFER_OUT: 'Inbound Transfer Out',
  ADJUSTMENT_INCREASE: 'Adjustment Increase',
  ADJUSTMENT_DECREASE: 'Adjustment Decrease',
  CYCLE_COUNT_ADJUST: 'Cycle Count Adjust',
  DAMAGE_REPORTED: 'Damage Reported',
  DAMAGE_REVERSED: 'Damage Reversed',
  HOLD_APPLIED: 'Hold Applied',
  HOLD_RELEASED: 'Hold Released',
  SAFETY_STOCK_CHANGED: 'Safety Stock Changed',
  OMS_ORDER_CREATED: 'OMS Order Created',
  OMS_ORDER_CANCELLED: 'OMS Order Cancelled',
  OMS_LOCK: 'OMS Lock',
  OMS_UNLOCK: 'OMS Unlock',
  OMS_ALLOCATE: 'OMS Allocate',
  OMS_DEALLOCATE: 'OMS Deallocate',
  OMS_BACKORDERED: 'OMS Backordered',
  WMS_ORDER_CREATED: 'WMS Order Created',
  WMS_ORDER_CANCELLED: 'WMS Order Cancelled',
  WMS_ALLOCATE: 'WMS Allocate',
  WMS_DEALLOCATE: 'WMS Deallocate',
  PICK_STARTED: 'Pick Started',
  PICK_COMPLETED: 'Pick Completed',
  PACKED: 'Packed',
  LOADED: 'Loaded',
  SHIPPED: 'Shipped',
  RETURN_RECEIVED: 'Return Received',
  RETURN_PUTAWAY: 'Return Putaway',
  MANUAL_CORRECTION: 'Manual Correction'
}

const allLedgerRows = ref<InventoryLedgerRow[]>([
  // PO Created → Incoming 增加
  {
    time: '2025-01-14 11:40:00',
    warehouse: 'UNIS-890',
    eventType: 'PO_CREATED',
    eventName: eventTypeLabels.PO_CREATED,
    documentNo: 'PO#1001',
    field: 'Incoming',
    before: 0,
    change: 50,
    after: 50
  },
  {
    time: '2025-01-14 10:20:00',
    warehouse: 'UNIS-CA01',
    eventType: 'PO_CREATED',
    eventName: eventTypeLabels.PO_CREATED,
    documentNo: 'PO#1002',
    field: 'Incoming',
    before: 0,
    change: 30,
    after: 30
  },
  // Receiving Started → Incoming 减少、Receiving 增加
  {
    time: '2025-01-13 15:30:00',
    warehouse: 'UNIS-890',
    eventType: 'RECEIVING_STARTED',
    eventName: eventTypeLabels.RECEIVING_STARTED,
    documentNo: 'ASN#5001',
    field: 'Incoming',
    before: 50,
    change: -30,
    after: 20
  },
  {
    time: '2025-01-13 15:30:00',
    warehouse: 'UNIS-890',
    eventType: 'RECEIVING_STARTED',
    eventName: eventTypeLabels.RECEIVING_STARTED,
    documentNo: 'ASN#5001',
    field: 'Receiving',
    before: 0,
    change: 30,
    after: 30
  },
  // Putaway Completed → Receiving 减少、on_hand / wms_available 增加
  {
    time: '2025-01-13 16:45:00',
    warehouse: 'UNIS-890',
    eventType: 'PUTAWAY_COMPLETED',
    eventName: eventTypeLabels.PUTAWAY_COMPLETED,
    documentNo: 'ASN#5001',
    field: 'Receiving',
    before: 30,
    change: -30,
    after: 0
  },
  {
    time: '2025-01-13 16:45:00',
    warehouse: 'UNIS-890',
    eventType: 'PUTAWAY_COMPLETED',
    eventName: eventTypeLabels.PUTAWAY_COMPLETED,
    documentNo: 'ASN#5001',
    field: 'on_hand',
    before: 120,
    change: 30,
    after: 150
  },
  {
    time: '2025-01-13 16:45:00',
    warehouse: 'UNIS-890',
    eventType: 'PUTAWAY_COMPLETED',
    eventName: eventTypeLabels.PUTAWAY_COMPLETED,
    documentNo: 'ASN#5001',
    field: 'wms_available',
    before: 90,
    change: 30,
    after: 120
  },
  // Damage Reported → wms_available 减少、damaged 增加
  {
    time: '2025-01-12 14:20:00',
    warehouse: 'UNIS-890',
    eventType: 'DAMAGE_REPORTED',
    eventName: eventTypeLabels.DAMAGE_REPORTED,
    documentNo: 'DMG#001',
    field: 'wms_available',
    before: 125,
    change: -5,
    after: 120
  },
  {
    time: '2025-01-12 14:20:00',
    warehouse: 'UNIS-890',
    eventType: 'DAMAGE_REPORTED',
    eventName: eventTypeLabels.DAMAGE_REPORTED,
    documentNo: 'DMG#001',
    field: 'damaged',
    before: 0,
    change: 5,
    after: 5
  },
  // Hold Applied → wms_available 减少、hold 增加
  {
    time: '2025-01-12 10:15:00',
    warehouse: 'UNIS-890',
    eventType: 'HOLD_APPLIED',
    eventName: eventTypeLabels.HOLD_APPLIED,
    documentNo: 'HOLD#001',
    field: 'wms_available',
    before: 130,
    change: -10,
    after: 120
  },
  {
    time: '2025-01-12 10:15:00',
    warehouse: 'UNIS-890',
    eventType: 'HOLD_APPLIED',
    eventName: eventTypeLabels.HOLD_APPLIED,
    documentNo: 'HOLD#001',
    field: 'hold',
    before: 0,
    change: 10,
    after: 10
  },
  // OMS Order Created / OMS Lock / OMS Allocate
  {
    time: '2025-01-11 09:30:00',
    warehouse: 'UNIS-890',
    eventType: 'OMS_ORDER_CREATED',
    eventName: eventTypeLabels.OMS_ORDER_CREATED,
    documentNo: 'ORD#2001',
    field: 'OpenOrder',
    before: 0,
    change: 30,
    after: 30
  },
  {
    time: '2025-01-11 09:35:00',
    warehouse: 'UNIS-890',
    eventType: 'OMS_LOCK',
    eventName: eventTypeLabels.OMS_LOCK,
    documentNo: 'ORD#2001',
    field: 'Locked',
    before: 0,
    change: 20,
    after: 20
  },
  {
    time: '2025-01-11 09:40:00',
    warehouse: 'UNIS-890',
    eventType: 'OMS_ALLOCATE',
    eventName: eventTypeLabels.OMS_ALLOCATE,
    documentNo: 'ORD#2001',
    field: 'Allocated',
    before: 0,
    change: 15,
    after: 15
  },
  // WMS Order Created / WMS Allocate / Pick Started / Pick Completed / Shipped
  {
    time: '2025-01-10 16:20:00',
    warehouse: 'UNIS-890',
    eventType: 'WMS_ORDER_CREATED',
    eventName: eventTypeLabels.WMS_ORDER_CREATED,
    documentNo: 'WMS#3001',
    field: 'WmsOpenOrder',
    before: 0,
    change: 10,
    after: 10
  },
  {
    time: '2025-01-10 16:25:00',
    warehouse: 'UNIS-890',
    eventType: 'WMS_ALLOCATE',
    eventName: eventTypeLabels.WMS_ALLOCATE,
    documentNo: 'WMS#3001',
    field: 'wms_allocated',
    before: 0,
    change: 15,
    after: 15
  },
  {
    time: '2025-01-10 16:30:00',
    warehouse: 'UNIS-890',
    eventType: 'PICK_STARTED',
    eventName: eventTypeLabels.PICK_STARTED,
    documentNo: 'WMS#3001',
    field: 'wms_allocated',
    before: 15,
    change: 0,
    after: 15
  },
  {
    time: '2025-01-10 17:00:00',
    warehouse: 'UNIS-890',
    eventType: 'PICK_COMPLETED',
    eventName: eventTypeLabels.PICK_COMPLETED,
    documentNo: 'WMS#3001',
    field: 'wms_allocated',
    before: 15,
    change: 0,
    after: 15
  },
  {
    time: '2025-01-10 18:00:00',
    warehouse: 'UNIS-890',
    eventType: 'SHIPPED',
    eventName: eventTypeLabels.SHIPPED,
    documentNo: 'SHIP#6001',
    field: 'on_hand',
    before: 155,
    change: -15,
    after: 140
  },
  {
    time: '2025-01-10 18:00:00',
    warehouse: 'UNIS-890',
    eventType: 'SHIPPED',
    eventName: eventTypeLabels.SHIPPED,
    documentNo: 'SHIP#6001',
    field: 'wms_allocated',
    before: 15,
    change: -15,
    after: 0
  },
  {
    time: '2025-01-10 18:00:00',
    warehouse: 'UNIS-890',
    eventType: 'SHIPPED',
    eventName: eventTypeLabels.SHIPPED,
    documentNo: 'SHIP#6001',
    field: 'Allocated',
    before: 15,
    change: -15,
    after: 0
  },
  {
    time: '2025-01-10 18:00:00',
    warehouse: 'UNIS-890',
    eventType: 'SHIPPED',
    eventName: eventTypeLabels.SHIPPED,
    documentNo: 'SHIP#6001',
    field: 'Locked',
    before: 20,
    change: -20,
    after: 0
  },
  {
    time: '2025-01-10 18:00:00',
    warehouse: 'UNIS-890',
    eventType: 'SHIPPED',
    eventName: eventTypeLabels.SHIPPED,
    documentNo: 'SHIP#6001',
    field: 'OpenOrder',
    before: 30,
    change: -30,
    after: 0
  }
])

// ==================== Ledger 筛选逻辑 ====================

const selectedEventType = ref<string>('')
const selectedField = ref<string>('')
const documentNoFilter = ref<string>('')
const documentTypeFilter = ref<string>('') // 单号类型筛选
const locationFilter = ref<string>('') // Location 筛选
const startDate = ref<string>('')
const endDate = ref<string>('')

const eventTypeOptions = computed(() => {
  const uniqueTypes = Array.from(new Set(allLedgerRows.value.map(row => row.eventType)))
  return uniqueTypes.map(type => ({
    label: eventTypeLabels[type],
    value: type
  }))
})

const fieldOptions = computed(() => {
  const uniqueFields = Array.from(new Set(allLedgerRows.value.map(row => row.field)))
  return uniqueFields.sort()
})

const ledgerLocationOptions = computed(() => {
  const uniqueLocations = Array.from(new Set(allLedgerRows.value.map(row => row.warehouse)))
  return uniqueLocations.sort()
})

const filteredLedgerRows = computed(() => {
  let filtered = [...allLedgerRows.value]

  // 按仓库过滤（根据选中的 Location）
  if (selectedLocation.value !== 'ALL') {
    filtered = filtered.filter(row => row.warehouse === selectedLocation.value)
  }

  // 按 Location 筛选（表格筛选条件）
  if (locationFilter.value) {
    filtered = filtered.filter(row => row.warehouse === locationFilter.value)
  }

  // 按事件类型过滤
  if (selectedEventType.value) {
    filtered = filtered.filter(row => row.eventType === selectedEventType.value)
  }

  // 按字段过滤
  if (selectedField.value) {
    filtered = filtered.filter(row => row.field === selectedField.value)
  }

  // 按单号类型过滤
  if (documentTypeFilter.value) {
    filtered = filtered.filter(row => 
      row.documentNo.toUpperCase().startsWith(documentTypeFilter.value + '#')
    )
  }

  // 按文档号过滤（支持模糊搜索）
  if (documentNoFilter.value) {
    const searchText = documentNoFilter.value.toLowerCase()
    filtered = filtered.filter(row => {
      // 支持搜索完整单号或单号中的数字部分
      const docNo = row.documentNo.toLowerCase()
      return docNo.includes(searchText) || docNo.replace(/[^0-9]/g, '').includes(searchText.replace(/[^0-9]/g, ''))
    })
  }

  // 按日期范围过滤
  if (startDate.value || endDate.value) {
    filtered = filtered.filter(row => {
      const rowDate = row.time.split(' ')[0] // 提取日期部分 YYYY-MM-DD
      if (startDate.value && rowDate < startDate.value) {
        return false
      }
      if (endDate.value && rowDate > endDate.value) {
        return false
      }
      return true
    })
  }

  // 按时间倒序排序，相同 time + documentNo 的相邻显示
  filtered.sort((a, b) => {
    const timeCompare = b.time.localeCompare(a.time)
    if (timeCompare !== 0) return timeCompare
    return a.documentNo.localeCompare(b.documentNo)
  })

  return filtered
})

// 搜索和重置
const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  selectedEventType.value = ''
  selectedField.value = ''
  documentNoFilter.value = ''
  documentTypeFilter.value = ''
  locationFilter.value = ''
  startDate.value = ''
  endDate.value = ''
  currentPage.value = 1
}

// ==================== 表格显示辅助函数 ====================

// 根据事件类型返回标签类型
const getEventTagType = (eventType: InventoryEventType): string => {
  const typeMap: Record<string, string> = {
    // 入库相关 - primary
    'PO_CREATED': 'primary',
    'ASN_CREATED': 'primary',
    'RECEIVING_STARTED': 'primary',
    'RECEIVING_COMPLETED': 'primary',
    'PUTAWAY_COMPLETED': 'primary',
    'INBOUND_TRANSFER_IN': 'primary',
    // 出库相关 - success
    'PICK_STARTED': 'success',
    'PICK_COMPLETED': 'success',
    'PACKED': 'success',
    'LOADED': 'success',
    'SHIPPED': 'success',
    'WMS_ALLOCATE': 'success',
    'OMS_ALLOCATE': 'success',
    // 调整/异常 - warning
    'ADJUSTMENT_INCREASE': 'warning',
    'ADJUSTMENT_DECREASE': 'warning',
    'CYCLE_COUNT_ADJUST': 'warning',
    'DAMAGE_REPORTED': 'warning',
    'MANUAL_CORRECTION': 'warning',
    // 锁定/保留 - info
    'HOLD_APPLIED': 'info',
    'HOLD_RELEASED': 'info',
    'OMS_LOCK': 'info',
    'OMS_UNLOCK': 'info',
    'SAFETY_STOCK_CHANGED': 'info',
    // 取消/退回 - danger
    'PO_CANCELLED': 'danger',
    'OMS_ORDER_CANCELLED': 'danger',
    'WMS_ORDER_CANCELLED': 'danger',
    'DAMAGE_REVERSED': 'danger',
    'INBOUND_TRANSFER_OUT': 'danger',
    'WMS_DEALLOCATE': 'danger',
    'OMS_DEALLOCATE': 'danger',
    // 订单相关 - 
    'OMS_ORDER_CREATED': '',
    'WMS_ORDER_CREATED': '',
    'OMS_BACKORDERED': '',
    'RETURN_RECEIVED': 'warning',
    'RETURN_PUTAWAY': 'warning'
  }
  return typeMap[eventType] || ''
}

// 格式化数字显示（添加千分位分隔符）
const formatNumber = (num: number): string => {
  if (num === 0) return '0'
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// 格式化时间显示
const formatTime = (timeStr: string): string => {
  if (!timeStr) return ''
  try {
    const date = new Date(timeStr.replace(/-/g, '/'))
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return timeStr
  }
}

// 获取字段的友好显示名称（确保没有下划线）
const getFieldDisplayName = (field: InventoryField): string => {
  const fieldNameMap: Record<InventoryField, string> = {
    'Incoming': 'Incoming',
    'Receiving': 'Receiving',
    'on_hand': 'On Hand',
    'wms_available': 'WMS Available',
    'wms_allocated': 'WMS Allocated',
    'hold': 'Hold',
    'damaged': 'Damaged',
    'OpenOrder': 'Open Order',
    'Locked': 'Locked',
    'Allocated': 'Allocated',
    'WmsOpenOrder': 'WMS Open Order',
    'SafetyStock': 'Safety Stock'
  }
  // 如果映射中有，直接返回
  if (fieldNameMap[field]) {
    return fieldNameMap[field]
  }
  // 如果映射中没有，自动转换下划线为空格并首字母大写
  return field.replace(/_/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

// ==================== 分页逻辑 ====================

const currentPage = ref(1)
const pageSize = ref(20)

const pagedLedgerRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLedgerRows.value.slice(start, end)
})

// 表格高度计算（动态计算，确保表格铺满容器）
const tableHeight = ref<string | number>('calc(100vh - 600px)')

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

// ==================== 操作按钮处理 ====================

const handleSync = () => {
  // TODO: 实现同步逻辑
  ElMessage.success('Sync completed')
}

const handleLocationSelect = (locationValue: string) => {
  selectedLocation.value = locationValue
  // 更新仓库筛选
  if (locationValue === 'ALL') {
    // 显示所有仓库的数据
  } else {
    // 只显示选中仓库的数据
  }
}

const handleViewLocation = () => {
  // TODO: 实现查看位置逻辑
  ElMessage.info('View location function')
}

// ==================== 生命周期 ====================

// 表格高度更新函数
let updateTableHeight: (() => void) | null = null

onMounted(() => {
  // TODO: 调用后端 API 获取 SKU 信息
  // TODO: 调用后端 API 获取仓库列表
  // TODO: 调用后端 API 获取 Snapshot 数据
  // TODO: 调用后端 API 获取 Ledger 数据

  // 计算表格高度
  updateTableHeight = () => {
    const windowHeight = window.innerHeight
    // 减去：返回按钮(40) + 页面头部(120) + Snapshot区域(300) + 卡片头部(60) + 筛选区域(80) + 分页(60) + 内边距(40)
    tableHeight.value = windowHeight - 700
  }

  updateTableHeight()
  window.addEventListener('resize', updateTableHeight)
})

onUnmounted(() => {
  if (updateTableHeight) {
    window.removeEventListener('resize', updateTableHeight)
  }
})
</script>

<style lang="scss" scoped>
.inventory-ledger-detail {
  padding: 20px;
  background-color: var(--el-bg-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;

  // 返回按钮
  .back-header {
    margin-bottom: 12px;

    .back-button {
      padding: 8px 12px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--el-text-color-primary);

      &:hover {
        color: var(--el-color-primary);
      }

      .el-icon {
        font-size: 16px;
      }
    }
  }

  // 页面顶部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    flex-shrink: 0;
    margin-bottom: 20px;

    .header-left {
      flex: 1;

      .title-section {
        margin-bottom: 16px;

        .main-title {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .sku-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .sku-label {
            font-size: 14px;
            color: var(--el-text-color-secondary);
          }

          .sku-code {
            font-size: 14px;
            font-weight: 500;
            color: var(--el-text-color-primary);
          }
        }
      }

      .location-section {
        display: flex;
        align-items: center;
        gap: 12px;

        .location-label {
          font-size: 14px;
          color: var(--el-text-color-secondary);
        }

        .location-display {
          font-size: 14px;
          color: var(--el-text-color-primary);
          display: flex;
          align-items: center;
          gap: 8px;

          .location-text {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .location-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;

            .location-tag-item {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 4px 12px;
              transition: all 0.2s;

              &:hover {
                opacity: 0.8;
              }

              .status-tag {
                margin-left: 4px;
              }
            }
          }

          .location-tag {
            margin-left: 4px;
          }
        }

        .view-location-btn {
          padding: 0;
          font-size: 14px;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
    }
  }

  // Snapshot 区域
  .snapshot-section {
    flex-shrink: 0;

    .snapshot-card {
      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .snapshot-row {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        flex-wrap: wrap;
        overflow-x: auto;

        .snapshot-item {
          flex: 1;
          min-width: 120px;
          padding: 12px;
          background: var(--el-fill-color-lighter);
          border-radius: 6px;
          transition: all 0.2s;
          position: relative;

          &:hover {
            background: var(--el-fill-color);
            transform: translateY(-2px);
            box-shadow: var(--el-box-shadow-light);
            z-index: 10;

            .item-formula {
              opacity: 1;
              max-height: 200px;
              padding: 12px;
              margin-top: 8px;
              background: var(--el-bg-color-overlay);
              border: 1px solid var(--el-border-color);
              border-radius: 6px;
              box-shadow: var(--el-box-shadow);
            }
          }

          .item-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-bottom: 6px;
            font-weight: 500;
          }

          .item-value {
            font-size: 20px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;

            &.highlight {
              color: var(--el-color-primary);
            }

            .uom-badge {
              font-size: 11px;
              font-weight: 400;
              color: var(--el-text-color-secondary);
              background: var(--el-fill-color);
              padding: 2px 6px;
              border-radius: 3px;
            }
          }

          .item-formula {
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s ease;
            line-height: 1.6;

            .formula-title {
              font-size: 11px;
              font-weight: 600;
              color: var(--el-text-color-primary);
              margin-bottom: 6px;
            }

            .formula-content {
              font-size: 12px;
              color: var(--el-text-color-regular);
              font-family: 'Courier New', monospace;
              margin-bottom: 8px;
              padding: 6px;
              background: var(--el-fill-color-lighter);
              border-radius: 4px;
            }

            .formula-calculation {
              font-size: 11px;
              color: var(--el-color-primary);
              font-family: 'Courier New', monospace;
              font-weight: 500;
              padding: 6px;
              background: var(--el-color-primary-light-9);
              border-radius: 4px;
              border-left: 3px solid var(--el-color-primary);
            }
          }
        }
      }
    }
  }

  // Ledger 表格区域
  .ledger-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .ledger-filters-section {
      margin-bottom: 16px;
      padding: 16px;
      background: var(--el-fill-color-lighter);
      border-radius: 6px;

      .filter-row {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;

        .date-range-group {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 8px;
          background: var(--el-bg-color);
          border-radius: 4px;
          border: 1px solid var(--el-border-color);

          .date-separator {
            color: var(--el-text-color-placeholder);
            font-size: 12px;
            padding: 0 4px;
          }

          :deep(.el-date-editor) {
            border: none;
            box-shadow: none;
            width: 110px !important;

            .el-input__wrapper {
              box-shadow: none;
            }
          }
        }
      }
    }

    .table-container {
      flex: 1;
      min-height: 400px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;

      :deep(.el-table) {
        width: 100% !important;
        table-layout: fixed;

        .el-table__inner-wrapper {
          width: 100% !important;
        }

        .el-table__header-wrapper,
        .el-table__body-wrapper {
          width: 100% !important;
        }

        .el-table__header {
          width: 100% !important;

          th {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .el-table__body {
          width: 100% !important;

          td {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        // 确保表格填满容器
        table {
          width: 100% !important;
          table-layout: fixed;
        }

        // 没有设置宽度的列自动分配剩余空间
        colgroup col {
          &:not([style*="width"]) {
            width: 0;
          }
        }
      }
    }

    // 表格边框和间距优化
    :deep(.el-table) {
      border: 1px solid var(--el-border-color-lighter);
      
      td {
        padding: 12px 8px;
        border-bottom: 1px solid var(--el-border-color-extra-light);
      }
    }

    // 表格行悬停效果 - 更柔和
    :deep(.el-table__body) {
      tr {
        transition: background-color 0.15s;

        &:hover {
          background-color: var(--el-fill-color-extra-light) !important;
        }
      }
    }

    // 斑马纹样式优化
    :deep(.el-table--striped) {
      .el-table__body {
        tr.el-table__row--striped {
          background-color: var(--el-fill-color-extra-light);
          
          &:hover {
            background-color: var(--el-fill-color-light) !important;
          }
        }
      }
    }

    // 表头样式优化 - 更简洁
    :deep(.el-table__header) {
      th {
        background-color: var(--el-bg-color);
        font-weight: 600;
        color: var(--el-text-color-primary);
        font-size: 13px;
        padding: 12px 8px;
        border-bottom: 2px solid var(--el-border-color);
      }
    }

    // 时间值样式
    .time-value {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 12px;
      color: var(--el-text-color-regular);
      white-space: nowrap;
    }

    // Location 文本样式
    .location-text {
      font-size: 13px;
      color: var(--el-text-color-regular);
      font-weight: 400;
    }

    // 高亮列背景
    :deep(.highlight-event-column),
    :deep(.highlight-document-column),
    :deep(.highlight-field-column) {
      background-color: rgba(var(--el-color-primary-rgb), 0.04);
      
      .cell {
        font-weight: 500;
      }
    }

    // Event 文本样式 - 高亮
    .event-text {
      font-size: 13px;
      color: var(--el-text-color-primary);
      font-weight: 400;
      
      &.highlight {
        font-weight: 600;
        color: var(--el-color-primary);
      }
    }

    // Document No 文本样式 - 高亮
    .document-text {
      font-size: 13px;
      color: var(--el-text-color-primary);
      font-weight: 500;
      
      &.highlight {
        font-weight: 600;
        color: var(--el-color-primary);
        letter-spacing: 0.2px;
      }
    }

    // 字段名称样式 - 高亮
    .field-name {
      font-weight: 400;
      font-size: 13px;
      color: var(--el-text-color-regular);
      
      &.highlight {
        font-weight: 600;
        color: var(--el-color-primary);
      }
    }

    // Before 值样式
    .before-value {
      font-weight: 500;
      
      &.zero-value {
        color: var(--el-text-color-placeholder);
      }
    }

    // 数字值样式
    .number-value {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 13px;
      font-weight: 400;
      color: var(--el-text-color-regular);
    }

    // Change 列样式 - 简化
    :deep(.change-column) {
      .cell {
        padding: 12px 8px;
      }
    }

    .change-value {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 13px;
      font-weight: 500;
    }

    .positive-change {
      color: var(--el-color-success);
      font-weight: 600;
    }

    .negative-change {
      color: var(--el-color-danger);
      font-weight: 600;
    }

    .zero-change {
      color: var(--el-text-color-placeholder);
      font-weight: 400;
    }

    .negative-value {
      color: var(--el-color-danger);
      font-weight: 600;
    }

    .pagination-wrapper {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--el-border-color-lighter);
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
    }
  }
}

// 响应式布局
@media (max-width: 1200px) {
  .inventory-ledger-detail {
    .snapshot-section {
      .snapshot-card {
        .snapshot-row {
          .snapshot-item {
            min-width: 100px;
          }
        }
      }
    }

    .ledger-card {
      .ledger-filters-section {
        .filter-row {
          .el-date-picker {
            width: 100% !important;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .inventory-ledger-detail {
    padding: 16px;

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
    }

    .snapshot-section {
      .snapshot-card {
        .snapshot-grid {
          grid-template-columns: 1fr;
        }
      }
    }

    .ledger-card {
      .ledger-filters-section {
        padding: 12px;

        .filter-row {
          gap: 8px;

          > * {
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>


