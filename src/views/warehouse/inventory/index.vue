<template>
  <div class="inventory-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>Inventory Management</h1>
        <p class="subtitle">Manage and track inventory across warehouses</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleExport">
          <el-icon><component :is="icons.Download" /></el-icon>Export
        </el-button>
        <el-button type="primary" @click="handleRefresh">
          <el-icon><component :is="icons.Refresh" /></el-icon>Refresh
        </el-button>
        <el-dropdown trigger="click" @command="handleColumnCommand">
          <el-button>
            <el-icon><component :is="icons.Setting" /></el-icon>Columns
            <el-icon class="el-icon--right"><component :is="icons.ArrowDown" /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="settings">Column Settings</el-dropdown-item>
              <el-dropdown-item command="reset">Reset to Default</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 搜索过滤区 -->
    <div class="search-section">
      <div class="search-row">
        <div class="group-switch">
          <span>Group by SKU</span>
          <el-switch v-model="searchForm.groupBySku" @change="handleSearch" />
        </div>
        <el-input
          v-model="searchForm.sku"
          placeholder="Search SKU"
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><component :is="icons.Search" /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="searchForm.location"
          placeholder="Location"
          clearable
          class="search-select"
        >
          <el-option
            v-for="loc in locations"
            :key="loc.value"
            :label="loc.label"
            :value="loc.value"
          />
        </el-select>
        <el-select
          v-model="searchForm.sourceIntegration"
          placeholder="Source"
          clearable
          class="search-select"
        >
          <el-option
            v-for="option in sourceIntegrationOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
          v-model="searchForm.lastEvent"
          placeholder="Last Event"
          clearable
          class="search-select"
        >
          <el-option
            v-for="option in lastEventOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
          v-model="searchForm.available"
          placeholder="Available"
          clearable
          class="search-select"
        >
          <el-option
            v-for="option in availableOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <div class="date-range">
          <el-date-picker
            v-model="searchForm.dateRange[0]"
            type="date"
            placeholder="Start date"
            class="date-picker"
            :clearable="true"
            @change="handleSearch"
          />
          <span class="date-separator">to</span>
          <el-date-picker
            v-model="searchForm.dateRange[1]"
            type="date"
            placeholder="End date"
            class="date-picker"
            :clearable="true"
            @change="handleSearch"
          />
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch">Search</el-button>
          <el-button @click="handleReset">Reset</el-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-table 
        ref="tableRef"
        :data="tableData" 
        style="width: 100%"
        v-loading="loading"
        :row-class-name="tableRowClassName"
        :expand-row-keys="expandedRows"
        :row-key="(row) => row.sku"
        stripe
        border
        @row-click="handleRowClick"
        @expand-change="handleExpandChange">
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column type="expand" v-if="searchForm.groupBySku" width="0" class-name="hidden-expand-column">
          <template #default="{ row }">
            <div v-if="row.hasChildren && row.children && row.children.length" class="expanded-table">
              <el-table 
                :data="row.children" 
                style="width: 100%"
                :show-header="false">
                <template v-for="col in visibleColumns" :key="col.prop">
                  <el-table-column v-bind="col">
                    <template #default="{ row: childRow }">
                      <template v-if="col.prop === 'salable' || col.prop === 'fulfillable'">
                        <span class="quantity highlight-positive" :class="{ 'negative': childRow[col.prop] < 0, 'zero': childRow[col.prop] === 0 }">
                          {{ formatNumber(childRow[col.prop]) }}
                        </span>
                      </template>
                      <template v-else-if="['wmsAvailable', 'onHand', 'openOrder', 'locked', 'allocated', 'safetyStock', 'wmsOpenOrder', 'wmsAllocate', 'incoming', 'receiving', 'hold', 'damaged'].includes(col.prop)">
                        <span class="quantity" :class="{ 'negative': childRow[col.prop] < 0, 'zero': childRow[col.prop] === 0 }">
                          {{ formatNumber(childRow[col.prop]) }}
                        </span>
                      </template>
                      <template v-else-if="col.prop === 'lastEvent'">
                        <span class="last-event-text">{{ childRow.lastEvent }}</span>
                      </template>
                      <template v-else>
                        {{ childRow[col.prop] }}
                      </template>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <template v-for="col in visibleColumns" :key="col.prop">
          <el-table-column v-bind="col" :class-name="getColumnClassName(col.prop)">
            <template #default="{ row }">
              <template v-if="col.prop === 'sku'">
                <div class="sku-cell">
                  <el-icon 
                    v-if="row.hasChildren && searchForm.groupBySku" 
                    class="expand-icon"
                    @click.stop="handleExpandToggle(row)"
                  >
                    <component :is="row.expanded ? icons.CaretBottom : icons.CaretRight" />
                  </el-icon>
                  <span class="sku-link" @click.stop="handleSkuClick(row)">{{ row.sku }}</span>
                </div>
              </template>
              <template v-else-if="col.prop === 'salable'">
                <span class="quantity highlight-positive" :class="{ 'negative': row[col.prop] < 0, 'zero': row[col.prop] === 0 }">
                  {{ formatNumber(row[col.prop]) }}
                </span>
              </template>
              <template v-else-if="col.prop === 'fulfillable'">
                <span class="quantity highlight-positive" :class="{ 'negative': row[col.prop] < 0, 'zero': row[col.prop] === 0 }">
                  {{ formatNumber(row[col.prop]) }}
                </span>
              </template>
              <template v-else-if="['wmsAvailable', 'onHand', 'openOrder', 'locked', 'allocated', 'safetyStock', 'wmsOpenOrder', 'wmsAllocate', 'incoming', 'receiving', 'hold', 'damaged'].includes(col.prop)">
                <span class="quantity" :class="{ 'negative': row[col.prop] < 0, 'zero': row[col.prop] === 0 }">
                  {{ formatNumber(row[col.prop]) }}
                </span>
              </template>
              <template v-else-if="col.prop === 'lastEvent'">
                <span class="last-event-text">{{ row.lastEvent }}</span>
              </template>
              <template v-else>
                {{ row[col.prop] }}
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 列设置对话框 -->
    <el-dialog
      v-model="columnSettingsVisible"
      title="Column Settings"
      width="600px"
    >
      <div class="column-settings">
        <el-checkbox
          v-model="selectAllColumns"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          Select All
        </el-checkbox>
        <el-divider />
        <el-checkbox-group 
          v-model="selectedColumns"
          @change="handleColumnChange"
          class="column-list"
        >
          <el-checkbox 
            v-for="col in allColumns" 
            :key="col.prop" 
            :label="col.prop"
            class="column-item"
          >
            {{ col.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetColumnSettings">Reset to Default</el-button>
          <el-button type="primary" @click="saveColumnSettings">
            Save
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { TableColumnCtx } from 'element-plus'

const router = useRouter()

// 表格引用
const tableRef = ref()

// 导入所需图标
const icons = {
  CaretRight: markRaw(ElementPlusIconsVue.CaretRight),
  CaretBottom: markRaw(ElementPlusIconsVue.CaretBottom),
  Download: markRaw(ElementPlusIconsVue.Download),
  Refresh: markRaw(ElementPlusIconsVue.RefreshRight),
  Setting: markRaw(ElementPlusIconsVue.Setting),
  ArrowDown: markRaw(ElementPlusIconsVue.ArrowDown),
  Search: markRaw(ElementPlusIconsVue.Search)
}

// 类型定义
interface InventoryItem {
  sku: string
  location: string
  salable: number
  fulfillable: number
  wmsAvailable: number
  onHand: number
  openOrder: number
  locked: number
  allocated: number
  safetyStock: number
  wmsOpenOrder: number
  wmsAllocate: number
  incoming: number
  receiving: number
  hold: number
  damaged: number
  lastEvent: string
  updated: string
  adjustedBy: string
  children?: InventoryItem[]
  hasChildren?: boolean
  expanded?: boolean
}

// 位置选项
const locations = [
  { label: 'UNIS - 890', value: 'UNIS-890' },
  { label: 'UNIS - 889', value: 'UNIS-889' },
  { label: 'Fontana', value: 'Fontana' },
  { label: '01', value: '01' }
]

// 列配置 - 增加最小宽度，让内容不那么拥挤
const allColumns = [
  { prop: 'sku', label: 'SKU', minWidth: 140, fixed: 'left', showOverflowTooltip: true },
  { prop: 'location', label: 'Location', minWidth: 140, showOverflowTooltip: true },
  { prop: 'salable', label: 'Salable', minWidth: 110, align: 'right' },
  { prop: 'fulfillable', label: 'Fulfillable', minWidth: 110, align: 'right' },
  { prop: 'onHand', label: 'On Hand', minWidth: 110, align: 'right' },
  { prop: 'wmsAvailable', label: 'WMS Available', minWidth: 130, align: 'right' },
  { prop: 'wmsOpenOrder', label: 'WMS Open Order', minWidth: 140, align: 'right' },
  { prop: 'openOrder', label: 'Open Order', minWidth: 110, align: 'right' },
  { prop: 'locked', label: 'Locked', minWidth: 110, align: 'right' },
  { prop: 'allocated', label: 'Allocated', minWidth: 110, align: 'right' },
  { prop: 'safetyStock', label: 'Safety Stock', minWidth: 130, align: 'right' },
  { prop: 'wmsAllocate', label: 'WMS Allocate', minWidth: 130, align: 'right' },
  { prop: 'incoming', label: 'Incoming', minWidth: 110, align: 'right' },
  { prop: 'receiving', label: 'Receiving', minWidth: 110, align: 'right' },
  { prop: 'hold', label: 'Hold', minWidth: 110, align: 'right' },
  { prop: 'damaged', label: 'Damaged', minWidth: 110, align: 'right' },
  { prop: 'lastEvent', label: 'Last Event', minWidth: 130, showOverflowTooltip: true },
  { prop: 'updated', label: 'Updated', minWidth: 170, showOverflowTooltip: true },
  { prop: 'adjustedBy', label: 'Adjusted By', minWidth: 140, showOverflowTooltip: true }
]

// 默认显示的列
const defaultColumns = [
  'sku',
  'location',
  'salable',
  'fulfillable',
  'onHand',
  'wmsAvailable',
  'wmsOpenOrder',
  'openOrder',
  'locked',
  'allocated',
  'safetyStock',
  'lastEvent',
  'updated',
  'adjustedBy'
]

const columnSettingsVisible = ref(false)
const selectedColumns = ref<string[]>(defaultColumns)
const selectAllColumns = ref(false)

const isIndeterminate = computed(() => {
  const selected = selectedColumns.value.length
  return selected > 0 && selected < allColumns.length
})

const visibleColumns = computed(() => 
  allColumns.filter(col => selectedColumns.value.includes(col.prop))
)

// 列设置方法
const handleColumnCommand = (command: string) => {
  if (command === 'settings') {
    columnSettingsVisible.value = true
  } else if (command === 'reset') {
    resetColumnSettings()
  }
}

const handleCheckAllChange = (val: boolean) => {
  selectedColumns.value = val ? allColumns.map(col => col.prop) : []
}

const handleColumnChange = (value: string[]) => {
  selectedColumns.value = value
  const checkedCount = value.length
  selectAllColumns.value = checkedCount === allColumns.length
}

const resetColumnSettings = () => {
  selectedColumns.value = [...defaultColumns]
  ElMessage.success('已重置为默认列设置')
}

const saveColumnSettings = () => {
  try {
    localStorage.setItem('inventoryColumns', JSON.stringify(selectedColumns.value))
    columnSettingsVisible.value = false
    ElMessage.success('列设置已保存')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 初始化时从localStorage加载列设置
const initColumnSettings = () => {
  try {
    const saved = localStorage.getItem('inventoryColumns')
    if (saved) {
      selectedColumns.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load column settings:', error)
  }
}

// 搜索表单类型
interface SearchForm {
  groupBySku: boolean
  sku: string
  location: string
  onHand: string
  sourceIntegration: string
  lastEvent: string
  inventoryType: string
  available: string
  inbound: string
  dateRange: [Date | null, Date | null]
}

// 搜索表单
const searchForm = ref<SearchForm>({
  groupBySku: false,
  sku: '',
  location: '',
  onHand: '',
  sourceIntegration: '',
  lastEvent: '',
  inventoryType: '',
  available: '',
  inbound: '',
  dateRange: [null, null]
})

// 搜索选项
const sourceIntegrationOptions = [
  { label: 'Inventory Engine', value: 'inventory_engine' },
  { label: 'Manual', value: 'manual' },
  { label: 'System', value: 'system' }
]

const lastEventOptions = [
  { label: 'Fulfill', value: 'fulfill' },
  { label: 'Release', value: 'release' },
  { label: 'Ship', value: 'ship' },
  { label: 'Cancel', value: 'cancel' }
]

const inventoryTypeOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Special', value: 'special' }
]

const availableOptions = [
  { label: 'Out of Stock', value: 'out' },
  { label: 'Low Stock', value: 'low' },
  { label: 'In Stock', value: 'in' }
]

// 处理SKU分组
const processTableData = (data: InventoryItem[]) => {
  if (!searchForm.value.groupBySku) {
    return data
  }

  // 先统计每个 SKU 的数量
  const skuCount = new Map<string, number>()
  data.forEach(item => {
    skuCount.set(item.sku, (skuCount.get(item.sku) || 0) + 1)
  })

  const groupedData = new Map<string, InventoryItem>()
  const result: InventoryItem[] = []
  
  data.forEach(item => {
    const count = skuCount.get(item.sku) || 0
    
    // 如果该 SKU 只有一条记录，直接添加到结果中，不分组
    if (count === 1) {
      result.push({ ...item, hasChildren: false })
      return
    }
    
    // 如果有多条记录，进行分组
    if (!groupedData.has(item.sku)) {
      const groupItem: InventoryItem = {
        ...item,
        location: 'Multiple',
        children: [],
        hasChildren: true,
        expanded: false,
        salable: 0,
        fulfillable: 0,
        wmsAvailable: 0,
        onHand: 0,
        openOrder: 0,
        locked: 0,
        allocated: 0,
        safetyStock: 0,
        wmsOpenOrder: 0,
        wmsAllocate: 0,
        incoming: 0,
        receiving: 0,
        hold: 0,
        damaged: 0,
        lastEvent: '',
        updated: '',
        adjustedBy: ''
      }
      groupedData.set(item.sku, groupItem)
      result.push(groupItem)
    }
    
    const group = groupedData.get(item.sku)!
    group.children!.push(item)
    group.salable += item.salable
    group.fulfillable += item.fulfillable
    group.wmsAvailable += item.wmsAvailable
    group.onHand += item.onHand
    group.openOrder += item.openOrder
    group.locked += item.locked
    group.allocated += item.allocated
    group.safetyStock += item.safetyStock
    group.wmsOpenOrder += item.wmsOpenOrder
    group.wmsAllocate += item.wmsAllocate
    group.incoming += item.incoming
    group.receiving += item.receiving
    group.hold += item.hold
    group.damaged += item.damaged
  })
  
  return result
}

// 表格展开行配置
const tableRowClassName = ({ row }: { row: InventoryItem }) => {
  return searchForm.value.groupBySku && row.hasChildren && row.children?.length ? 'expandable-row' : ''
}

// 初始数据
const initialData: InventoryItem[] = [
  {
    sku: 'CM007',
    location: 'UNIS - 890',
    salable: 5,
    fulfillable: 3,
    wmsAvailable: 8,
    onHand: 10,
    openOrder: 2,
    locked: 1,
    allocated: 4,
    safetyStock: 5,
    wmsOpenOrder: 3,
    wmsAllocate: 2,
    incoming: 15,
    receiving: 8,
    hold: 2,
    damaged: 1,
    lastEvent: 'fulfill',
    updated: '07/23/2025 5:46 PM',
    adjustedBy: 'System'
  },
  {
    sku: 'CM007',
    location: 'Fontana',
    salable: 2,
    fulfillable: 1,
    wmsAvailable: 3,
    onHand: 5,
    openOrder: 1,
    locked: 0,
    allocated: 2,
    safetyStock: 3,
    wmsOpenOrder: 1,
    wmsAllocate: 1,
    incoming: 10,
    receiving: 5,
    hold: 1,
    damaged: 0,
    lastEvent: 'shipCancel',
    updated: '07/18/2025 9:55 AM',
    adjustedBy: 'System'
  },
  {
    sku: 'FDKS8',
    location: 'UNIS - 890',
    salable: 8,
    fulfillable: 6,
    wmsAvailable: 12,
    onHand: 15,
    openOrder: 3,
    locked: 2,
    allocated: 5,
    safetyStock: 8,
    wmsOpenOrder: 4,
    wmsAllocate: 3,
    incoming: 20,
    receiving: 12,
    hold: 3,
    damaged: 2,
    lastEvent: 'fulfill',
    updated: '07/28/2025 3:15 PM',
    adjustedBy: 'John'
  },
  {
    sku: 'HD003',
    location: 'UNIS - 890',
    salable: 12,
    fulfillable: 10,
    wmsAvailable: 18,
    onHand: 25,
    openOrder: 5,
    locked: 3,
    allocated: 8,
    safetyStock: 10,
    wmsOpenOrder: 6,
    wmsAllocate: 5,
    incoming: 30,
    receiving: 18,
    hold: 4,
    damaged: 3,
    lastEvent: 'release',
    updated: '07/22/2025 8:29 AM',
    adjustedBy: 'Mary'
  },
  {
    sku: 'LED008',
    location: 'Multiple',
    salable: 15,
    fulfillable: 12,
    wmsAvailable: 22,
    onHand: 30,
    openOrder: 6,
    locked: 4,
    allocated: 10,
    safetyStock: 12,
    wmsOpenOrder: 8,
    wmsAllocate: 6,
    incoming: 40,
    receiving: 25,
    hold: 5,
    damaged: 4,
    lastEvent: 'release',
    updated: '07/22/2025 5:29 PM',
    adjustedBy: 'System'
  },
  {
    sku: 'LPT001',
    location: 'UNIS - 890',
    salable: 20,
    fulfillable: 18,
    wmsAvailable: 28,
    onHand: 35,
    openOrder: 8,
    locked: 5,
    allocated: 12,
    safetyStock: 15,
    wmsOpenOrder: 10,
    wmsAllocate: 8,
    incoming: 50,
    receiving: 30,
    hold: 6,
    damaged: 5,
    lastEvent: 'release',
    updated: '07/22/2025 8:29 AM',
    adjustedBy: 'John'
  },
  {
    sku: 'Mac',
    location: 'Multiple',
    salable: 25,
    fulfillable: 22,
    wmsAvailable: 35,
    onHand: 45,
    openOrder: 10,
    locked: 8,
    allocated: 15,
    safetyStock: 20,
    wmsOpenOrder: 12,
    wmsAllocate: 10,
    incoming: 60,
    receiving: 40,
    hold: 8,
    damaged: 6,
    lastEvent: 'adjust',
    updated: '07/17/2025 5:50 PM',
    adjustedBy: 'System'
  },
  {
    sku: 'SKU001',
    location: '01',
    salable: 997,
    fulfillable: 995,
    wmsAvailable: 1000,
    onHand: 998,
    openOrder: 15,
    locked: 10,
    allocated: 20,
    safetyStock: 25,
    wmsOpenOrder: 18,
    wmsAllocate: 15,
    incoming: 100,
    receiving: 80,
    hold: 12,
    damaged: 8,
    lastEvent: 'xferin',
    updated: '07/17/2025 6:02 PM',
    adjustedBy: 'Mary'
  },
  {
    sku: 'TB310-2101-05-00',
    location: 'Fontana',
    salable: 0,
    fulfillable: 0,
    wmsAvailable: 0,
    onHand: 0,
    openOrder: 0,
    locked: 0,
    allocated: 0,
    safetyStock: 0,
    wmsOpenOrder: 0,
    wmsAllocate: 0,
    incoming: 0,
    receiving: 0,
    hold: 0,
    damaged: 0,
    lastEvent: 'adjust',
    updated: '07/17/2025 5:34 PM',
    adjustedBy: '2210512470948@rmak.in'
  },
  {
    sku: 'U_eddie_1',
    location: 'Fontana',
    salable: 0,
    fulfillable: 0,
    wmsAvailable: 0,
    onHand: 0,
    openOrder: 0,
    locked: 0,
    allocated: 0,
    safetyStock: 0,
    wmsOpenOrder: 0,
    wmsAllocate: 0,
    incoming: 0,
    receiving: 0,
    hold: 0,
    damaged: 0,
    lastEvent: 'shipCancelRestock',
    updated: '07/18/2025 10:23 AM',
    adjustedBy: 'System'
  },
  {
    sku: 'hi5-bc-4pk-3-2',
    location: 'UNIS - 890',
    salable: 3,
    fulfillable: 2,
    wmsAvailable: 5,
    onHand: 8,
    openOrder: 2,
    locked: 1,
    allocated: 3,
    safetyStock: 4,
    wmsOpenOrder: 2,
    wmsAllocate: 1,
    incoming: 12,
    receiving: 8,
    hold: 2,
    damaged: 1,
    lastEvent: 'release',
    updated: '07/22/2025 8:29 AM',
    adjustedBy: 'John'
  },
  {
    sku: 'w_sample',
    location: 'UNIS - 889',
    salable: 0,
    fulfillable: 0,
    wmsAvailable: 0,
    onHand: 0,
    openOrder: 0,
    locked: 0,
    allocated: 0,
    safetyStock: 0,
    wmsOpenOrder: 0,
    wmsAllocate: 0,
    incoming: 0,
    receiving: 0,
    hold: 0,
    damaged: 0,
    lastEvent: 'shipCancelRestock',
    updated: '07/18/2025 10:23 AM',
    adjustedBy: 'System'
  },
  {
    sku: 'CM007',
    location: 'UNIS - 889',
    salable: 3,
    fulfillable: 2,
    wmsAvailable: 5,
    onHand: 8,
    openOrder: 1,
    locked: 0,
    allocated: 2,
    safetyStock: 3,
    wmsOpenOrder: 1,
    wmsAllocate: 1,
    incoming: 10,
    receiving: 5,
    hold: 1,
    damaged: 0,
    lastEvent: 'adjust',
    updated: '07/19/2025 2:30 PM',
    adjustedBy: 'Admin'
  }
]

// 表格数据
const loading = ref(false)
const tableData = ref<InventoryItem[]>([])
const expandedRows = ref<string[]>([])

// 搜索方法
const handleSearch = async () => {
  loading.value = true
  // 清空展开状态
  expandedRows.value = []
  try {
    // 在实际应用中，这里会调用API
    // 现在我们直接处理本地数据
    const filteredData = initialData.filter(item => {
      if (searchForm.value.sku && !item.sku.toLowerCase().includes(searchForm.value.sku.toLowerCase())) return false
      if (searchForm.value.location && item.location !== searchForm.value.location) return false
      if (searchForm.value.sourceIntegration && item.sourceIntegration !== searchForm.value.sourceIntegration) return false
      if (searchForm.value.lastEvent && item.lastEvent !== searchForm.value.lastEvent) return false
      if (searchForm.value.available) {
        switch (searchForm.value.available) {
          case 'out':
            if (item.salable >= 0) return false
            break
          case 'low':
            if (item.salable <= 0 || item.salable > 10) return false
            break
          case 'in':
            if (item.salable <= 0) return false
            break
        }
      }
      return true
    })

    const processedData = searchForm.value.groupBySku ? processTableData(filteredData) : filteredData
    tableData.value = processedData
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 重置方法
const handleReset = () => {
  searchForm.value = {
    groupBySku: false,
    sku: '',
    location: '',
    onHand: '',
    sourceIntegration: '',
    lastEvent: '',
    inventoryType: '',
    available: '',
    inbound: '',
    dateRange: [null, null]
  }
  handleSearch()
}

// 初始化
onMounted(() => {
  initColumnSettings()
  handleSearch()
})

// 监听分组状态变化
watch(() => searchForm.value.groupBySku, () => {
  handleSearch()
})

// 分页
const currentPage = ref(1)
const pageSize = ref(25)
const total = ref(100)

// 分页方法
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

// 格式化数字显示（添加千分位分隔符）
const formatNumber = (num: number): string => {
  if (num === 0) return '0'
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// 获取列类名
const getColumnClassName = (prop: string): string => {
  if (prop === 'salable' || prop === 'fulfillable') {
    return 'highlight-column'
  }
  return ''
}

// 展开/收起切换
const handleExpandToggle = (row: InventoryItem) => {
  if (!row.hasChildren || !row.children?.length) return
  
  const index = expandedRows.value.indexOf(row.sku)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
    row.expanded = false
  } else {
    expandedRows.value.push(row.sku)
    row.expanded = true
  }
}

// SKU 点击处理 - 跳转到详情页
const handleSkuClick = (row: InventoryItem) => {
  router.push(`/warehouse/inventory/${row.sku}`)
}

// 事件标签类型
const getEventTagType = (event: string) => {
  const types: Record<string, string> = {
    'fulfill': 'success',
    'release': 'warning',
    'shipCancel': 'danger',
    'adjust': 'info',
    'xferin': 'primary',
    'shipCancelRestock': 'warning'
  }
  return types[event.toLowerCase()] || 'default'
}

// 行点击处理方法 - 优化交互
const handleRowClick = (row: InventoryItem, column?: any, event?: MouseEvent) => {
  // 如果有事件对象，检查点击目标
  if (event) {
    const target = event.target as HTMLElement
    // 如果点击的是选择框、展开图标或 SKU 链接，不处理
    if (target.closest('.el-checkbox') || 
        target.closest('.el-table__expand-icon') ||
        target.closest('.expand-icon') ||
        target.closest('.sku-link')) {
      return
    }
  }
  
  // 分组模式下，点击行可以展开/收起
  if (searchForm.value.groupBySku && row.hasChildren && row.children?.length) {
    handleExpandToggle(row)
  } else {
    // 否则跳转到详情页
    router.push(`/warehouse/inventory/${row.sku}`)
  }
}

// 展开行处理方法
const handleExpandChange = (row: InventoryItem, expanded: boolean) => {
  if (searchForm.value.groupBySku) {
    // 如果是分组模式，同步展开状态
    row.expanded = expanded
    const index = expandedRows.value.indexOf(row.sku)
    if (expanded && index === -1) {
      expandedRows.value.push(row.sku)
    } else if (!expanded && index > -1) {
      expandedRows.value.splice(index, 1)
    }
    return
  }
  // 如果是非分组模式，则处理展开/收起
  if (expanded) {
    // 展开
    // 在实际应用中，这里会调用API获取子项
    // 现在我们直接处理本地数据
    const expandedRow = tableData.value.find(item => item.sku === row.sku)
    if (expandedRow && expandedRow.children && expandedRow.children.length === 0) {
      // 如果展开的行没有子项，则尝试从API获取
      // 这里模拟一个异步获取过程
      loading.value = true
      setTimeout(() => {
        const newChildren = initialData.filter(item => item.sku === row.sku)
        if (newChildren.length > 0) {
          expandedRow.children = newChildren
          expandedRow.hasChildren = true
          ElMessage.success('子项已加载')
        } else {
          ElMessage.warning('未找到子项')
        }
        loading.value = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.inventory-page {
  padding: 20px;
  background-color: var(--el-bg-color);
  min-height: 100vh;

  .page-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .header-left {
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .subtitle {
        margin: 8px 0 0;
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .search-section {
    background-color: var(--el-bg-color-overlay);
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: var(--el-box-shadow-light);

    .search-row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;

      .group-switch {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--el-text-color-regular);
        min-width: 120px;
      }

      .search-input {
        width: 200px;
      }

      .search-select {
        width: 160px;
      }

      .date-range {
        display: flex;
        align-items: center;
        gap: 4px;

        .date-picker {
          width: 130px;  // 调整为更小的宽度
        }

        .date-separator {
          color: var(--el-text-color-regular);
          padding: 0 4px;
        }
      }

      .search-buttons {
        margin-left: auto;
        display: flex;
        gap: 8px;
      }
    }
  }

  .table-section {
    background-color: var(--el-bg-color-overlay);
    border-radius: 4px;
    padding: 16px;
    box-shadow: var(--el-box-shadow-light);

    // 表头样式优化 - 增加间距
    :deep(.el-table__header) {
      th {
        background-color: var(--el-bg-color);
        font-weight: 600;
        color: var(--el-text-color-primary);
        font-size: 13px;
        padding: 16px 12px;
        border-bottom: 2px solid var(--el-border-color);
        line-height: 1.5;
      }
    }

    // 表格边框和间距优化 - 增加内边距
    :deep(.el-table) {
      border: 1px solid var(--el-border-color-lighter);
      
      td {
        padding: 18px 12px;
        border-bottom: 1px solid var(--el-border-color-extra-light);
        line-height: 1.6;
      }
      
      // 增加单元格内容间距
      .cell {
        padding: 0 4px;
      }
    }

    // 突出显示列的背景色 - 更柔和
    :deep(.highlight-column) {
      background-color: rgba(var(--el-color-success-rgb), 0.03);
      
      .cell {
        font-weight: 600;
      }
    }

    // 表格行悬停效果 - 更柔和
    :deep(.el-table__body) {
      tr {
        transition: background-color 0.15s;
        cursor: pointer;

        &:hover {
          background-color: var(--el-fill-color-extra-light) !important;
        }
        
        // 展开行样式
        &.expandable-row {
          &:hover {
            background-color: var(--el-fill-color-light) !important;
          }
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

    .sku-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 0;
      
      .expand-icon {
        cursor: pointer;
        color: var(--el-text-color-regular);
        font-size: 14px;
        padding: 2px 4px;
        border-radius: 4px;
        transition: all 0.2s;
        flex-shrink: 0;
        
        &:hover {
          color: var(--el-color-primary);
          background-color: var(--el-fill-color-light);
        }
      }
      
      .sku-link {
        color: var(--el-text-color-primary);
        font-weight: 500;
        font-size: 14px;
        text-decoration: none;
        transition: color 0.2s;
        line-height: 1.5;
        cursor: pointer;
        
        &:hover {
          color: var(--el-color-primary);
          text-decoration: underline;
        }
      }
    }

    .quantity {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-regular);
      line-height: 1.5;
      display: inline-block;
      
      &.highlight-positive {
        font-size: 15px;
        font-weight: 600;
        color: var(--el-color-success);
      }
      
      &.negative {
        color: var(--el-color-danger);
        font-weight: 600;
      }
      
      &.zero {
        color: var(--el-text-color-placeholder);
        font-weight: 400;
      }
    }

    .last-event-text {
      font-size: 13px;
      color: var(--el-text-color-secondary);
      font-weight: 400;
      line-height: 1.5;
    }
    
    // 其他文本内容也增加行高
    :deep(.el-table__body) {
      td {
        .cell {
          font-size: 14px;
          line-height: 1.6;
        }
      }
    }

    // 隐藏 Element Plus 自带的展开图标列
    :deep(.hidden-expand-column) {
      width: 0 !important;
      padding: 0 !important;
      overflow: hidden;
      
      .cell {
        padding: 0 !important;
        width: 0 !important;
      }
      
      .el-table__expand-icon {
        display: none !important;
      }
    }
    
    // 完全隐藏展开图标列
    :deep(.el-table__expand-icon) {
      display: none !important;
    }

    .expanded-table {
      padding: 16px;
      background-color: var(--el-table-row-hover-bg-color);
    }

    :deep(.el-table__expanded-cell) {
      padding: 0;
      
      .el-table {
        margin: 0;
        background-color: var(--el-table-row-hover-bg-color);
      }
    }


    :deep(.el-table__row) {
      cursor: pointer;
      
      &.expandable-row {
        background-color: var(--el-bg-color);
        
        &:hover {
          background-color: var(--el-table-row-hover-bg-color);
        }
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .column-settings {
    .column-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .column-item {
      height: 32px;
    }
  }
}
</style> 