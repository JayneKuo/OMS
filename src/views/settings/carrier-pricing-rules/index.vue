<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">Rate Shopping</h1>
          <p class="subtitle">Configure carrier rate shopping automation rules</p>
        </div>
        <div class="action-section">
          <el-input
            v-model="filterText"
            placeholder="Search rules..."
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="filterForm.carrier"
            placeholder="All Carriers"
            clearable
            class="filter-select"
          >
            <el-option
              v-for="carrier in CARRIER_OPTIONS"
              :key="carrier.value"
              :label="carrier.label"
              :value="carrier.value"
            />
          </el-select>

          <el-select 
            v-model="statusFilter" 
            placeholder="Status"
            class="status-filter"
            clearable
          >
            <el-option label="All Status" value="all" />
            <el-option label="Active" value="active">
              <div class="filter-option">
                <el-icon color="#67C23A"><CircleCheck /></el-icon>
                <span>Active</span>
              </div>
            </el-option>
            <el-option label="Inactive" value="inactive">
              <div class="filter-option">
                <el-icon color="#909399"><CircleClose /></el-icon>
                <span>Inactive</span>
              </div>
            </el-option>
          </el-select>
          
          <el-button 
            type="primary" 
            size="large"
            @click="handleAdd"
          >
            <el-icon class="mr-1"><Plus /></el-icon>
            Create Rule
          </el-button>
        </div>
      </div>
    </div>

    <!-- Rules List -->
    <el-card class="rules-card">
      <!-- Empty State -->
      <div v-if="!loading && filteredRules.length === 0" class="empty-state">
        <el-empty :description="filterText ? 'No rules found matching your search' : 'No rate shopping rules yet'">
          <el-button v-if="!filterText" type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            Create Your First Rule
          </el-button>
          <el-button v-else @click="filterText = ''">
            <el-icon><Close /></el-icon>
            Clear Search
          </el-button>
        </el-empty>
      </div>

      <el-table
        v-else
        ref="tableRef"
        :data="paginatedRules"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
        :row-class-name="'draggable-row'"
        :class="{ 'is-dragging': dragging }"
        class="rule-table"
      >
        <!-- Order Column with Drag Handle -->
        <el-table-column width="60" align="center">
          <template #default="{ row }">
            <el-icon class="drag-handle"><Operation /></el-icon>
          </template>
        </el-table-column>

      <el-table-column label="Rule Name" min-width="200">
        <template #default="{ row }">
          <div class="rule-name-section">
            <span class="rule-name">{{ row.ruleName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Carriers" min-width="180">
        <template #default="{ row }">
          <div class="tag-group">
            <el-tag 
              v-for="carrier in row.rateShoppingConfig.carriers.filter(c => c.enabled)" 
              :key="carrier.carrier"
              size="small"
              type="primary"
              class="mr-2"
            >
              {{ getCarrierLabel(carrier.carrier) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Shipping Service" min-width="150">
        <template #default="{ row }">
          <div class="tag-group">
            <el-tag 
              v-for="carrier in row.rateShoppingConfig.carriers.filter(c => c.enabled && c.shippingService)" 
              :key="carrier.carrier"
              size="small"
              type="success"
              class="mr-2"
            >
              {{ getCarrierLabel(carrier.carrier) }}: {{ carrier.shippingService }}
            </el-tag>
            <span v-if="!row.rateShoppingConfig.carriers.some(c => c.enabled && c.shippingService)" class="text-muted">
              -
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Trigger Conditions" min-width="250">
        <template #default="{ row }">
          <div class="condition-info">
            <div class="tag-group" v-if="row.triggerConditions.orderStatus?.length">
              <el-tag 
                v-for="status in row.triggerConditions.orderStatus"
                :key="status"
                size="small"
                type="info"
                class="mr-2"
              >
                {{ status }}
              </el-tag>
            </div>
            <div v-if="row.triggerConditions.destinationCountries?.length">
              <span class="label">Countries:</span> {{ row.triggerConditions.destinationCountries.join(', ') }}
            </div>
            <div v-if="row.triggerConditions.weightMin || row.triggerConditions.weightMax">
              <span class="label">Weight:</span> {{ row.triggerConditions.weightMin || 0 }}-{{ row.triggerConditions.weightMax || '∞' }} kg
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Review" width="100" align="center">
        <template #default="{ row }">
          <el-tag 
            :type="row.reviewRules.requireReview ? 'danger' : 'success'" 
            size="small"
          >
            {{ row.reviewRules.requireReview ? 'Required' : 'Auto' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Status" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-value="active"
            inactive-value="inactive"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="Operations" width="140" align="center">
        <template #default="{ row }">
          <el-button-group>
            <el-tooltip content="Edit">
              <el-button 
                type="primary" 
                link
                @click="handleEdit(row)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip content="Duplicate">
              <el-button 
                type="success" 
                link
                @click="cloneRule(row)"
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip content="Delete">
              <el-button
                type="danger" 
                link
                @click="handleDelete(row)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div v-if="filteredRules.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Create/Edit Dialog -->
    <RuleDialog
      v-model="dialogVisible"
      :rule="editingRule"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, Search, CircleCheck, CircleClose, Operation,
  Edit, Delete, CopyDocument, Close
} from '@element-plus/icons-vue'
import Sortable from 'sortablejs'
import type { RateShoppingRule, RateShoppingRuleFilter } from './types'
import { CARRIER_OPTIONS } from './types'
import RuleDialog from './RuleDialog.vue'

const loading = ref(false)
const filterText = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const dialogVisible = ref(false)
const editingRule = ref<RateShoppingRule | null>(null)

const tableRef = ref<InstanceType<typeof import('element-plus').ElTable>>()
const tableData = ref<RateShoppingRule[]>([])

// Filter form
const filterForm = reactive<RateShoppingRuleFilter>({
  ruleName: '',
  status: '',
  carrier: ''
})

// Pagination
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 拖拽相关状态
const dragging = ref(false)
let sortable: Sortable | null = null

// 初始化拖拽排序
const initSortable = () => {
  const el = tableRef.value?.$el.querySelector('.el-table__body-wrapper tbody')
  if (!el) return

  sortable?.destroy()
  sortable = new Sortable(el, {
    animation: 300,
    handle: '.drag-handle',
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onStart: () => {
      dragging.value = true
    },
    onEnd: (evt) => {
      dragging.value = false
      const { oldIndex, newIndex } = evt
      if (oldIndex !== newIndex && oldIndex !== undefined && newIndex !== undefined) {
        const currRow = filteredRules.value.splice(oldIndex, 1)[0]
        filteredRules.value.splice(newIndex, 0, currRow)
        
        // 更新所有规则的优先级
        filteredRules.value.forEach((rule, index) => {
          rule.priority = index + 1
        })
        
        ElMessage.success('Rule priority updated successfully')
      }
    }
  })
}

// Get carrier label
const getCarrierLabel = (value: string) => {
  const carrier = CARRIER_OPTIONS.find(c => c.value === value)
  return carrier ? carrier.label : value
}

// Computed
const filteredRules = computed(() => {
  let rules = tableData.value
  
  // Filter by status
  if (statusFilter.value !== 'all') {
    rules = rules.filter(rule => rule.status === statusFilter.value)
  }
  
  // Filter by search text
  if (filterText.value) {
    const searchText = filterText.value.toLowerCase()
    rules = rules.filter(rule => 
      rule.ruleName.toLowerCase().includes(searchText) ||
      rule.description?.toLowerCase().includes(searchText)
    )
  }

  // Filter by carrier
  if (filterForm.carrier) {
    rules = rules.filter(rule =>
      rule.rateShoppingConfig.carriers.some(c => c.carrier === filterForm.carrier && c.enabled)
    )
  }
  
  // Sort by priority
  return rules.sort((a, b) => a.priority - b.priority)
})

// Paginated data
const paginatedRules = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredRules.value.slice(start, end)
})

// Load data
const loadData = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    tableData.value = [
      {
        id: 1,
        ruleName: 'US Domestic Standard Shipping',
        description: 'Auto rate shopping for all US domestic orders under 20kg',
        status: 'active',
        priority: 1,
        triggerConditions: {
          orderStatus: ['ready_to_ship'],
          destinationCountries: ['US'],
          weightMax: 20
        },
        rateShoppingConfig: {
          carriers: [
            {
              carrier: 'fedex',
              enabled: true,
              shippingAccountId: 1,
              shippingAccountName: 'FedEx Main Account (123456789)',
              serviceTypes: ['ground', 'express', '2day']
            },
            {
              carrier: 'ups',
              enabled: true,
              shippingAccountId: 2,
              shippingAccountName: 'UPS Business Account (987654321)',
              serviceTypes: ['ground', 'express']
            },
            {
              carrier: 'usps',
              enabled: true,
              shippingAccountId: 3,
              shippingAccountName: 'USPS Standard',
              serviceTypes: ['ground', 'priority']
            }
          ]
        },
        selectionLogic: {
          primaryCriteria: 'cheapest',
          carrierPriority: ['fedex', 'ups', 'usps']
        },
        reviewRules: {
          requireReview: false
        },
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: 2,
        ruleName: 'International Express Orders',
        description: 'Fast delivery for international high-value orders',
        status: 'active',
        priority: 2,
        triggerConditions: {
          orderStatus: ['ready_to_ship'],
          destinationCountries: ['CN', 'UK', 'EU'],
          orderValueMin: 500
        },
        rateShoppingConfig: {
          carriers: [
            {
              carrier: 'fedex',
              enabled: true,
              shippingAccountId: 1,
              shippingAccountName: 'FedEx Main Account (123456789)',
              serviceTypes: ['international', 'express']
            },
            {
              carrier: 'dhl',
              enabled: true,
              shippingAccountId: 4,
              shippingAccountName: 'DHL Express Account',
              serviceTypes: ['international']
            }
          ]
        },
        selectionLogic: {
          primaryCriteria: 'fastest',
          carrierPriority: ['fedex', 'dhl']
        },
        reviewRules: {
          requireReview: true,
          reviewConditions: {
            priceThreshold: 100,
            priceDeviationPercentage: 20
          }
        },
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01'
      },
      {
        id: 3,
        ruleName: 'California Economy Shipping',
        description: 'Cost-effective shipping for California lightweight packages',
        status: 'inactive',
        priority: 5,
        triggerConditions: {
          orderStatus: ['ready_to_ship'],
          destinationCountries: ['US'],
          destinationStates: ['CA'],
          weightMax: 5
        },
        rateShoppingConfig: {
          carriers: [
            {
              carrier: 'usps',
              enabled: true,
              shippingAccountId: 3,
              shippingAccountName: 'USPS Standard',
              serviceTypes: ['ground', 'priority']
            }
          ]
        },
        selectionLogic: {
          primaryCriteria: 'cheapest',
          carrierPriority: ['usps']
        },
        reviewRules: {
          requireReview: false
        },
        createdAt: '2024-03-01',
        updatedAt: '2024-03-01'
      }
    ]
    
    pagination.total = tableData.value.length
  } catch (error) {
    console.error('Failed to load rate shopping rules:', error)
    ElMessage.error('Failed to load rate shopping rules')
  } finally {
    loading.value = false
  }
}

// Handle status change
const handleStatusChange = async (row: RateShoppingRule) => {
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 300))
    ElMessage.success(`Rule ${row.status === 'active' ? 'activated' : 'deactivated'} successfully`)
  } catch (error) {
    // Revert on error
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.error('Failed to update rule status')
  }
}

// Handle add
const handleAdd = () => {
  editingRule.value = null
  dialogVisible.value = true
}

// Handle edit
const handleEdit = (row: RateShoppingRule) => {
  editingRule.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

// Handle save
const handleSave = async (rule: RateShoppingRule) => {
  try {
    if (editingRule.value) {
      // Update existing rule
      const index = tableData.value.findIndex(r => r.id === editingRule.value?.id)
      if (index > -1) {
        tableData.value[index] = {
          ...rule,
          id: editingRule.value.id,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      }
      ElMessage.success('Rule updated successfully')
    } else {
      // Add new rule
      tableData.value.push({
        ...rule,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      })
      ElMessage.success('Rule created successfully')
    }
    
    pagination.total = tableData.value.length
    dialogVisible.value = false
  } catch (error) {
    console.error('Failed to save rule:', error)
    ElMessage.error('Failed to save rule')
  }
}

// Clone rule
const cloneRule = (row: RateShoppingRule) => {
  const clonedRule = JSON.parse(JSON.stringify(row))
  clonedRule.id = undefined
  clonedRule.ruleName = `${row.ruleName} (Copy)`
  clonedRule.status = 'inactive'
  tableData.value.push(clonedRule)
  ElMessage.success('Rule cloned successfully')
}

// Handle delete
const handleDelete = async (row: RateShoppingRule) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete rule "${row.ruleName}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    // TODO: Replace with actual API call
    const index = tableData.value.findIndex(r => r.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('Rule deleted successfully')
  } catch (error) {
    // User cancelled
  }
}

// Handle page size change
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

// Handle page change
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

// Initialize
onMounted(async () => {
  await loadData()
  await nextTick()
  initSortable()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

/* 拖拽相关样式 */
.draggable-row {
  cursor: move;
  transition: all 0.2s ease;
}

.draggable-row:hover {
  background-color: var(--el-fill-color-light) !important;
}

.draggable-row:hover .drag-handle {
  opacity: 1;
  color: var(--el-color-primary);
  transform: scale(1.1);
}

.drag-handle {
  opacity: 0.3;
  transition: all 0.2s;
  cursor: move;
  color: var(--el-text-color-secondary);
}

.is-dragging .el-table__row:not(.dragging) {
  opacity: 0.4;
  transition: opacity 0.3s;
}

.is-dragging .el-table__row.dragging {
  background-color: var(--el-color-primary-light-9);
  border: 2px dashed var(--el-color-primary);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  transform: scale(1.02);
}

/* 覆盖Element Plus表格样式以支持拖拽 */
:deep(.el-table__row) {
  cursor: move;
}

:deep(.el-table__body) {
  transition: all 0.3s ease;
}

:deep(.el-table__row.sortable-ghost) {
  background-color: var(--el-color-primary-light-9) !important;
  opacity: 0.5;
  border: 2px dashed var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

:deep(.el-table__row.sortable-chosen) {
  background-color: var(--el-color-primary-light-8);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  transform: scale(1.01);
  transition: all 0.2s ease;
}

:deep(.el-table__row.sortable-drag) {
  background-color: var(--el-color-primary-light-7);
  opacity: 0.9;
  box-shadow: 0 8px 16px rgba(64, 158, 255, 0.3);
  transform: rotate(2deg);
  cursor: grabbing !important;
}

.page-header {
  margin-bottom: 24px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.header-content {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  flex: 1;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
  line-height: 32px;
}

.subtitle {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 20px;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 24px;
}

.search-input {
  width: 300px;
}

.filter-select,
.status-filter {
  width: 150px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rules-card {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-state :deep(.el-empty__description) {
  margin-top: 16px;
  font-size: 14px;
}

.empty-state :deep(.el-button) {
  margin-top: 16px;
}

.rule-table {
  .rule-name-section {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .rule-name {
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }
  
  .tag-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .condition-info {
    font-size: 13px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
    
    > div {
      margin-bottom: 4px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    .label {
      font-weight: 500;
      color: var(--el-text-color-secondary);
    }
  }
}

.pagination-container {
  margin-top: 20px;
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
}

/* Button Group Animations */
.el-button-group .el-button {
  transition: all 0.2s ease;
}

.el-button-group .el-button:hover {
  transform: translateY(-2px);
}

.el-button-group .el-button:active {
  transform: translateY(0);
}

/* Status Switch Enhancement */
:deep(.el-switch) {
  transition: all 0.3s ease;
}

:deep(.el-switch:hover) {
  transform: scale(1.05);
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: var(--el-color-success);
}

.mr-1 {
  margin-right: 4px;
}

.mr-2 {
  margin-right: 8px;
}

.text-muted {
  color: var(--el-text-color-placeholder);
  font-size: 13px;
}
</style>
