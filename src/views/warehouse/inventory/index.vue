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
        :data="tableData" 
        style="width: 100%"
        v-loading="loading"
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
        @expand-change="handleExpandChange">
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column type="expand" v-if="searchForm.groupBySku">
          <template #default="{ row }">
            <div v-if="row.children && row.children.length" class="expanded-table">
              <el-table 
                :data="row.children" 
                style="width: 100%"
                :show-header="false">
                <template v-for="col in visibleColumns" :key="col.prop">
                  <el-table-column v-bind="col">
                    <template #default="{ row: childRow }">
                      <template v-if="col.prop === 'available'">
                        <span :class="['quantity', childRow.available < 0 ? 'negative' : '']">
                          {{ childRow.available }}
                        </span>
                      </template>
                      <template v-else-if="col.prop === 'lastEvent'">
                        <el-tag :type="getEventTagType(childRow.lastEvent)" size="small">
                          {{ childRow.lastEvent }}
                        </el-tag>
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
          <el-table-column v-bind="col">
            <template #default="{ row }">
              <template v-if="col.prop === 'sku'">
                <div class="sku-cell">
                  <el-icon v-if="row.hasChildren && searchForm.groupBySku">
                    <component :is="row.expanded ? icons.CaretBottom : icons.CaretRight" />
                  </el-icon>
                  {{ row.sku }}
                </div>
              </template>
              <template v-else-if="col.prop === 'available'">
                <span :class="['quantity', row.available < 0 ? 'negative' : '']">
                  {{ row.available }}
                </span>
              </template>
              <template v-else-if="col.prop === 'lastEvent'">
                <el-tag :type="getEventTagType(row.lastEvent)" size="small">
                  {{ row.lastEvent }}
                </el-tag>
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
  name: string
  location: string
  available: number
  committed: number
  onHand: number
  inbound: number
  sourceIntegration: string
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

// 列配置
const allColumns = [
  { prop: 'sku', label: 'SKU', minWidth: 120, fixed: 'left', showOverflowTooltip: true },
  { prop: 'name', label: 'Name', minWidth: 150, showOverflowTooltip: true },
  { prop: 'location', label: 'Location', minWidth: 120, showOverflowTooltip: true },
  { prop: 'available', label: 'Available', minWidth: 100, align: 'right' },
  { prop: 'committed', label: 'Committed', minWidth: 100, align: 'right' },
  { prop: 'onHand', label: 'On Hand', minWidth: 100, align: 'right' },
  { prop: 'inbound', label: 'Inbound', minWidth: 100, align: 'right' },
  { prop: 'sourceIntegration', label: 'Source Integration', minWidth: 150, showOverflowTooltip: true },
  { prop: 'lastEvent', label: 'Last Event', minWidth: 120, showOverflowTooltip: true },
  { prop: 'updated', label: 'Updated', minWidth: 160, showOverflowTooltip: true },
  { prop: 'adjustedBy', label: 'Adjusted By', minWidth: 120, showOverflowTooltip: true },
  { prop: 'vendorSku', label: 'Vendor SKU', minWidth: 120, showOverflowTooltip: true },
  { prop: 'availableInbound', label: 'Avail + Inbound', minWidth: 120, align: 'right' },
  { prop: 'future', label: 'Future', minWidth: 100, align: 'right' },
  { prop: 'unavailable', label: 'Unavailable', minWidth: 100, align: 'right' },
  { prop: 'committedFuture', label: 'Committed Future', minWidth: 130, align: 'right' },
  { prop: 'commitShip', label: 'Commit Ship', minWidth: 120, align: 'right' },
  { prop: 'commitTransfer', label: 'Commit Transfer', minWidth: 120, align: 'right' },
  { prop: 'adjustQuantity', label: 'Adjust Quantity', minWidth: 120, align: 'right' },
  { prop: 'lastOrder', label: 'Last Order', minWidth: 120, showOverflowTooltip: true },
  { prop: 'lastEventEntity', label: 'Last Event Entity', minWidth: 130, showOverflowTooltip: true },
  { prop: 'entityType', label: 'Entity Type', minWidth: 120, showOverflowTooltip: true },
  { prop: 'created', label: 'Created', minWidth: 160, showOverflowTooltip: true },
  { prop: 'doNotTrackInventory', label: 'Do Not Track Inventory', minWidth: 150 },
  { prop: 'inventoryType', label: 'Inventory Type', minWidth: 120, showOverflowTooltip: true }
]

// 默认显示的列
const defaultColumns = [
  'sku',
  'location',
  'available',
  'committed',
  'onHand',
  'inbound',
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

  const groupedData = new Map<string, InventoryItem>()
  data.forEach(item => {
    if (!groupedData.has(item.sku)) {
      groupedData.set(item.sku, {
        ...item,
        location: 'Multiple',
        children: [],
        hasChildren: true,
        available: 0,
        committed: 0,
        onHand: 0,
        inbound: 0
      })
    }
    const group = groupedData.get(item.sku)!
    group.children!.push(item)
    group.available += item.available
    group.committed += item.committed
    group.onHand += item.onHand
    group.inbound += item.inbound
  })
  return Array.from(groupedData.values())
}

// 表格展开行配置
const tableRowClassName = ({ row }: { row: InventoryItem }) => {
  return searchForm.value.groupBySku && row.children?.length ? 'expandable-row' : ''
}

// 初始数据
const initialData: InventoryItem[] = [
  {
    sku: 'CM007',
    name: 'Camera',
    location: 'UNIS - 890',
    available: -1,
    committed: 0,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'fulfill',
    updated: '07/23/2025 5:46 PM',
    adjustedBy: 'System'
  },
  {
    sku: 'CM007',
    name: 'Camera',
    location: 'Fontana',
    available: -1,
    committed: 0,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'shipCancel',
    updated: '07/18/2025 9:55 AM',
    adjustedBy: 'System'
  },
  {
    sku: 'FDKS8',
    name: 'FDKS8',
    location: 'UNIS - 890',
    available: -1,
    committed: 0,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'fulfill',
    updated: '07/28/2025 3:15 PM',
    adjustedBy: 'John'
  },
  {
    sku: 'HD003',
    name: 'Headphones',
    location: 'UNIS - 890',
    available: -1,
    committed: 1,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'release',
    updated: '07/22/2025 8:29 AM',
    adjustedBy: 'Mary'
  },
  {
    sku: 'LED008',
    name: 'LED',
    location: 'Multiple',
    available: -1,
    committed: 1,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Manual',
    lastEvent: 'release',
    updated: '07/22/2025 5:29 PM',
    adjustedBy: 'System'
  },
  {
    sku: 'LPT001',
    name: 'Laptop',
    location: 'UNIS - 890',
    available: -1,
    committed: 1,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'release',
    updated: '07/22/2025 8:29 AM',
    adjustedBy: 'John'
  },
  {
    sku: 'Mac',
    name: 'Mac',
    location: 'Multiple',
    available: -179,
    committed: 30,
    onHand: 0,
    inbound: 200,
    sourceIntegration: 'System',
    lastEvent: 'adjust',
    updated: '07/17/2025 5:50 PM',
    adjustedBy: 'System'
  },
  {
    sku: 'SKU001',
    name: 'SKU001',
    location: '01',
    available: 997,
    committed: 1,
    onHand: 998,
    inbound: 10,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'xferin',
    updated: '07/17/2025 6:02 PM',
    adjustedBy: 'Mary'
  },
  {
    sku: 'TB310-2101-05-00',
    name: 'TB310-2101-05-00',
    location: 'Fontana',
    available: 0,
    committed: 0,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Manual',
    lastEvent: 'adjust',
    updated: '07/17/2025 5:34 PM',
    adjustedBy: '2210512470948@rmak.in'
  },
  {
    sku: 'U_eddie_1',
    name: 'U_eddie_1',
    location: 'Fontana',
    available: 0,
    committed: 0,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'shipCancelRestock',
    updated: '07/18/2025 10:23 AM',
    adjustedBy: 'System'
  },
  {
    sku: 'hi5-bc-4pk-3-2',
    name: 'hi5-bc-4pk-3-2',
    location: 'UNIS - 890',
    available: -1,
    committed: 1,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'release',
    updated: '07/22/2025 8:29 AM',
    adjustedBy: 'John'
  },
  {
    sku: 'w_sample',
    name: 's1',
    location: 'UNIS - 889',
    available: 0,
    committed: 0,
    onHand: 0,
    inbound: 0,
    sourceIntegration: 'Inventory Engine',
    lastEvent: 'shipCancelRestock',
    updated: '07/18/2025 10:23 AM',
    adjustedBy: 'System'
  }
]

// 表格数据
const loading = ref(false)
const tableData = ref<InventoryItem[]>([])

// 搜索方法
const handleSearch = async () => {
  loading.value = true
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
            if (item.available >= 0) return false
            break
          case 'low':
            if (item.available <= 0 || item.available > 10) return false
            break
          case 'in':
            if (item.available <= 0) return false
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

// 行点击处理方法
const handleRowClick = (row: InventoryItem) => {
  if (searchForm.value.groupBySku && row.children?.length) {
    // 如果是分组模式且有子项，则切换展开状态
    row.expanded = !row.expanded
  } else {
    // 如果不是分组或没有子项，则跳转到详情页
    router.push(`/warehouse/inventory/${row.sku}`)
  }
}

// 展开行处理方法
const handleExpandChange = (row: InventoryItem, expanded: boolean) => {
  if (searchForm.value.groupBySku) {
    // 如果是分组模式，则不处理展开/收起
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

    .sku-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }

    .quantity {
      &.negative {
        color: var(--el-color-danger);
      }
    }

    :deep(.el-table__expand-icon) {
      display: none;
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