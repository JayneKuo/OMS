<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Warehouse List</h1>
        <p class="subtitle">Manage warehouses and their WMS version assignments</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">Add Warehouse</el-button>
        <el-button 
          type="primary" 
          plain 
          :icon="Setting"
          @click="showBatchConfig">
          Batch Configure
        </el-button>
        <el-button type="default" :icon="Refresh" @click="refreshData">Refresh</el-button>
      </div>
    </div>

    <el-table 
      :data="warehouseList" 
      style="width: 100%"
      border
      stripe
      row-key="rank"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="50" />
      <el-table-column width="50">
        <template #default>
          <el-icon class="drag-handle"><Operation /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="rank" label="RANK" width="80" align="center">
        <template #default="{ row }">
          <span class="rank-number">{{ row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouse" label="WAREHOUSE" width="150" />
      <el-table-column prop="accountingCode" label="ACCOUNTING CODE" width="180" />
      <el-table-column prop="city" label="CITY" width="120" />
      <el-table-column prop="state" label="STATE" width="100" />
      <el-table-column prop="country" label="COUNTRY" width="120" />
      <el-table-column prop="address1" label="ADDRESS 1" min-width="200" />
      <el-table-column prop="zipCode" label="ZIP CODE" width="120" />
      <el-table-column prop="contactName" label="CONTACT NAME" width="150" />
      <el-table-column prop="contactEmail" label="CONTACT EMAIL" width="180" />
      <el-table-column prop="contactPhone" label="CONTACT PHONE" width="150" />
      <el-table-column prop="wms" label="WMS" width="150">
        <template #default="{ row }">
          <el-select 
            v-model="row.wmsVersion" 
            placeholder="Select WMS Version"
            :disabled="row.loading"
            @change="handleWmsChange(row)">
            <el-option 
              v-for="version in getAvailableWmsVersions(row)"
              :key="version.value === null ? 'unassigned' : version.value"
              :label="version.label"
              :value="version.value"
              :disabled="version.disabled"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <!-- Batch Configuration Dialog -->
    <el-dialog
      v-model="batchConfigVisible"
      title="Batch WMS Configuration"
      width="500px">
      <div class="batch-config-content">
        <div class="selected-info">
          <p>Selected Warehouses: {{ selectedWarehouses.length }}</p>
          <el-alert
            v-if="hasConfiguredWarehouses"
            type="warning"
            :closable="false"
            show-icon>
            Some selected warehouses already have WMS configuration. Their settings will be overwritten.
          </el-alert>
        </div>
        <el-form :model="batchForm" label-width="120px" class="batch-form">
          <el-form-item label="WMS Version">
            <el-select v-model="batchForm.wmsVersion" placeholder="Select WMS Version">
              <el-option label="WMS V1" value="V1" />
              <el-option label="WMS V2" value="V2" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchConfigVisible = false">Cancel</el-button>
          <el-button 
            type="primary" 
            @click="handleBatchConfig"
            :loading="batchConfigLoading"
            :disabled="!batchForm.wmsVersion || selectedWarehouses.length === 0">
            Apply Configuration
          </el-button>
        </span>
      </template>
    </el-dialog>

    <div class="pagination-container">
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, Refresh, Operation, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Sortable from 'sortablejs'

interface Warehouse {
  rank: number
  warehouse: string
  accountingCode: string
  city: string
  state: string
  country: string
  address1: string
  zipCode: string
  contactName: string
  contactEmail: string
  contactPhone: string
  wmsVersion?: 'V1' | 'V2' | null
  availableVersions: ('V1' | 'V2')[]
  loading?: boolean
  isAvailable?: boolean
  lastStatusCheck?: Date
  statusCheckResult?: {
    connected: boolean
    lastSuccessful: Date
    errorMessage?: string
  }
}

interface BatchConfigForm {
  wmsVersion: 'V1' | 'V2' | null
}

// Mock data
const warehouseList = ref<Warehouse[]>([
  {
    rank: 6,
    warehouse: 'Roanoke',
    accountingCode: '869',
    city: 'Beijing',
    state: 'CA',
    country: 'US',
    address1: '159, Row 18, Progressive Way',
    zipCode: '90001',
    contactName: 'John Smith',
    contactEmail: 'john.smith@roanoke.com',
    contactPhone: '(555) 123-4567',
    wmsVersion: 'V1',
    availableVersions: ['V1'],
    loading: false
  },
  {
    rank: 7,
    warehouse: 'Fontana',
    accountingCode: '931',
    city: 'Fontana',
    state: 'CA',
    country: 'US',
    address1: '10681 Production Ave',
    zipCode: '92337',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah.j@fontana.com',
    contactPhone: '(555) 234-5678',
    wmsVersion: 'V2',
    availableVersions: ['V1', 'V2']
  },
  {
    rank: 8,
    warehouse: 'Joliet',
    accountingCode: '890',
    city: 'Elwood',
    state: 'IL',
    country: 'US',
    address1: '3901 S Brandon Rd',
    zipCode: '60421',
    contactName: 'Mike Wilson',
    contactEmail: 'mike.w@joliet.com',
    contactPhone: '(555) 345-6789',
    wmsVersion: 'V1',
    availableVersions: ['V1', 'V2']
  },
  {
    rank: 9,
    warehouse: 'Valley View',
    accountingCode: '889',
    city: 'Buena Park',
    state: 'CA',
    country: 'US',
    address1: '6800 Valley View St #11',
    zipCode: '90620',
    contactName: 'Lisa Brown',
    contactEmail: 'lisa.b@valleyview.com',
    contactPhone: '(555) 456-7890',
    wmsVersion: 'V1',
    availableVersions: ['V1']
  },
  {
    rank: 10,
    warehouse: 'Vista',
    accountingCode: '112',
    city: 'Sparks',
    state: 'NV',
    country: 'US',
    address1: '250 Vista Blvd Ste 101',
    zipCode: '89434',
    contactName: 'David Miller',
    contactEmail: 'david.m@vista.com',
    contactPhone: '(555) 567-8901',
    wmsVersion: 'V2',
    availableVersions: ['V1', 'V2']
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(warehouseList.value.length)

const selectedWarehouses = ref<Warehouse[]>([])
const batchConfigVisible = ref(false)
const batchConfigLoading = ref(false)
const batchForm = ref<BatchConfigForm>({
  wmsVersion: null
})

const hasConfiguredWarehouses = computed(() => {
  return selectedWarehouses.value.some(warehouse => warehouse.wmsVersion !== null)
})

const tableRowClassName = () => {
  return 'draggable-row'
}

// Add initialization function
const initializeFirstWarehouse = async () => {
  const firstWarehouse = warehouseList.value[0]
  if (!firstWarehouse) return

  firstWarehouse.loading = true
  
  try {
    // Simulate API call that fails
    await new Promise(resolve => setTimeout(resolve, 1000))
    throw new Error('Failed to initialize WMS version V1 for warehouse Roanoke')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'Failed to initialize WMS version')
    firstWarehouse.wmsVersion = null
  } finally {
    firstWarehouse.loading = false
  }
}

// Update onMounted to include initialization
onMounted(() => {
  // Initialize sortable
  const tbody = document.querySelector('.el-table__body-wrapper tbody') as HTMLElement
  if (tbody) {
    new Sortable(tbody, {
      handle: '.drag-handle',
      animation: 150,
      onEnd(evt: Sortable.SortableEvent) {
        const newIndex = evt.newIndex
        const oldIndex = evt.oldIndex
        
        if (typeof newIndex !== 'number' || typeof oldIndex !== 'number') return
        
        const list = [...warehouseList.value]
        const [movedItem] = list.splice(oldIndex, 1)
        list.splice(newIndex, 0, movedItem)
        
        // Update ranks
        list.forEach((item, index) => {
          item.rank = index + 1
        })
        
        warehouseList.value = list
        
        // Call API to update ranks
        updateWarehouseRanks(list)
      }
    })
  }

  // Simulate failed initialization for first warehouse
  initializeFirstWarehouse()
})

const updateWarehouseRanks = async (list: Warehouse[]) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Warehouse order updated successfully')
  } catch (error) {
    ElMessage.error('Failed to update warehouse order')
  }
}

const getAvailableWmsVersions = (warehouse: Warehouse) => {
  return [
    {
      value: null,
      label: 'Unassigned',
      disabled: false
    },
    { 
      value: 'V1', 
      label: 'V1',
      disabled: !warehouse.availableVersions.includes('V1')
    },
    { 
      value: 'V2', 
      label: 'V2',
      disabled: !warehouse.availableVersions.includes('V2')
    }
  ]
}

const refreshData = () => {
  // Refresh data logic here
  ElMessage.success('Data refreshed successfully')
}

const handleWmsChange = async (row: Warehouse) => {
  row.loading = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (row.wmsVersion === null) {
      ElMessage.success(`Successfully unassigned WMS version from ${row.warehouse}`)
      return
    }
    
    // Check if version is available for the warehouse
    if (!row.availableVersions.includes(row.wmsVersion!)) {
      throw new Error(`WMS version ${row.wmsVersion} is not available for warehouse ${row.warehouse}`)
    }
    
    ElMessage.success(`Successfully updated ${row.warehouse} to WMS version ${row.wmsVersion}`)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'Failed to update WMS version')
    // Revert to previous version or unassigned
    row.wmsVersion = null
  } finally {
    row.loading = false
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // Reload data with new page size
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // Reload data for new page
}

const handleSelectionChange = (selection: Warehouse[]) => {
  selectedWarehouses.value = selection
}

const showBatchConfig = () => {
  if (selectedWarehouses.value.length === 0) {
    ElMessage.warning('Please select warehouses to configure')
    return
  }
  batchConfigVisible.value = true
}

const handleBatchConfig = async () => {
  if (!batchForm.value.wmsVersion || selectedWarehouses.value.length === 0) return

  batchConfigLoading.value = true
  const version = batchForm.value.wmsVersion
  const warehouses = selectedWarehouses.value

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update warehouses
    for (const warehouse of warehouses) {
      warehouse.wmsVersion = version
      warehouse.isAvailable = true
      warehouse.lastStatusCheck = new Date()
      warehouse.statusCheckResult = {
        connected: true,
        lastSuccessful: new Date(),
      }
    }

    ElMessage.success(`Successfully configured ${warehouses.length} warehouses to WMS ${version}`)
    batchConfigVisible.value = false
    batchForm.value.wmsVersion = null
  } catch (error) {
    ElMessage.error('Failed to apply batch configuration')
  } finally {
    batchConfigLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  h1 {
    font-size: 32px;
    font-weight: 500;
    margin: 0;
    color: var(--text-primary);
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.draggable-row {
  cursor: move;
}

.drag-handle {
  cursor: move;
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  
  &:hover {
    color: var(--text-primary);
  }
}

.rank-number {
  display: inline-block;
  font-weight: 500;
}

:deep(.el-table) {
  --el-table-border-color: var(--border-color);
  --el-table-header-bg-color: var(--bg-darker);
  --el-table-row-hover-bg-color: var(--bg-darker);
  
  th {
    background-color: var(--bg-darker) !important;
    color: var(--text-primary);
    font-weight: 500;
  }
  
  td {
    color: var(--text-secondary);
  }
  
  .draggable-row.sortable-ghost {
    background-color: var(--el-color-primary-light-9);
    opacity: 0.5;
  }
  
  .draggable-row.sortable-chosen {
    background-color: var(--el-color-primary-light-8);
  }
}

.batch-config-content {
  .selected-info {
    margin-bottom: 20px;
    
    p {
      margin: 0 0 10px;
      font-weight: 500;
    }
  }
  
  .batch-form {
    margin-top: 20px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 