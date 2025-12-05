<template>
  <div class="load-plan-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>Load Plan</h1>
        <el-tooltip content="Help">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="header-right">
        <div class="action-buttons">
          <el-dropdown trigger="click" @command="handleExportCommand">
            <el-button type="primary">
              Export
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="excel">Export to Excel</el-dropdown-item>
                <el-dropdown-item command="csv">Export to CSV</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="success" @click="handleAutoGenerate">
            <el-icon><MagicStick /></el-icon>
            Auto Generate Plans
          </el-button>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            Create Load Plan
          </el-button>
          <el-button @click="showRuleConfig = true">
            <el-icon><Setting /></el-icon>
            Planning Rules
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索和过滤器区域 -->
    <search-form @search="handleSearch" @reset="handleReset" />

    <!-- 状态标签页和工具栏 -->
    <div class="status-toolbar">
      <div class="status-tabs">
        <div class="tab-list">
          <div
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-item"
            :class="{ active: activeStatus === tab.value }"
            @click="handleTabChange(tab.value)"
          >
            <div class="tab-content">
              <span class="tab-label">{{ tab.label }}</span>
              <span class="count-tag" :class="tab.tagType">{{ tab.count }}</span>
            </div>
            <div class="tab-line" />
          </div>
        </div>
      </div>

      <div class="toolbar-actions">
        <el-tooltip content="Refresh" placement="top">
          <el-button class="action-btn" @click="refreshTable">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="Customize Columns" placement="top">
          <el-button class="action-btn" @click="showColumnSettings = true">
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 批量操作工具栏 -->
    <div v-if="selectedRows.length > 0" class="selection-toolbar">
      <div class="selection-info">
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
        >
          <span class="selection-text">{{ selectedRows.length }} selected</span>
        </el-checkbox>
      </div>
      <div class="action-buttons">
        <el-button-group>
          <el-button @click="handleBatchAction('markPlanned')" :disabled="!canBatchMarkPlanned">
            <el-icon><Check /></el-icon>
            Mark as Planned
          </el-button>
          <el-button @click="handleBatchAction('confirm')" :disabled="!canBatchConfirm">
            <el-icon><Check /></el-icon>
            Confirm
          </el-button>
          <el-button type="success" @click="handleBatchAction('generateLoad')" :disabled="!canBatchGenerateLoad">
            <el-icon><Plus /></el-icon>
            Generate Load
          </el-button>
          <el-button type="warning" @click="handleBatchAction('cancel')">
            <el-icon><Close /></el-icon>
            Cancel
          </el-button>
          <el-button @click="handleBatchAction('export')">
            <el-icon><Download /></el-icon>
            Export Selected
          </el-button>
          <el-button @click="handleBatchAction('delete')">
            <el-icon><Delete /></el-icon>
            Delete
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="filteredTableData"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#333' }"
        @selection-change="handleSelectionChange"
        :scrollbar-always-on="true"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="id" label="Plan ID" min-width="200" fixed>
          <template #default="{ row }">
            <span style="font-family: monospace; font-size: 12px;">{{ row.id || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="planNo" label="Plan No." min-width="140" fixed>
          <template #default="{ row }">
            <el-link type="primary" @click="handleView(row)">{{ row.planNo || '-' }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="planName" label="Plan Name" min-width="150" />
        <el-table-column prop="status" label="Status" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ LOAD_PLAN_STATUS_MAP[row.status || '']?.label || row.status || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customer" label="Customer" min-width="150" />
        <el-table-column prop="carrier" label="Carrier" min-width="150" />
        <el-table-column prop="loadType" label="Load Type" min-width="120" />
        <el-table-column prop="shipFrom" label="Ship From" min-width="200">
          <template #default="{ row }">
            <div v-if="row.shipFrom">
              <div v-if="row.shipFrom.city && row.shipFrom.state">
                {{ row.shipFrom.city }}, {{ row.shipFrom.state }}
              </div>
              <div v-else-if="row.shipFrom.address1">
                {{ row.shipFrom.address1 }}
              </div>
              <span v-else>-</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="shipTo" label="Ship To" min-width="200">
          <template #default="{ row }">
            <div v-if="row.shipTo">
              <div v-if="row.shipTo.city && row.shipTo.state">
                {{ row.shipTo.city }}, {{ row.shipTo.state }}
              </div>
              <div v-else-if="row.shipTo.address1">
                {{ row.shipTo.address1 }}
              </div>
              <span v-else>-</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="plannedShipDate" label="Planned Ship Date" min-width="160">
          <template #default="{ row }">
            {{ formatDate(row.plannedShipDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="plannedDeliveryDate" label="Planned Delivery Date" min-width="160">
          <template #default="{ row }">
            {{ formatDate(row.plannedDeliveryDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="loadIds" label="Load Count" min-width="120" align="right">
          <template #default="{ row }">
            {{ row.loadIds?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="estimatedFreightCost" label="Est. Freight Cost" min-width="140" align="right">
          <template #default="{ row }">
            <span v-if="row.estimatedFreightCost">
              ${{ row.estimatedFreightCost.toFixed(2) }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="plannedPalletQty" label="Planned Pallet Qty" min-width="150" align="right">
          <template #default="{ row }">
            {{ row.plannedPalletQty || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="orderLines" label="Order Count" min-width="120" align="right">
          <template #default="{ row }">
            {{ row.orderLines?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="Created By" min-width="120" />
        <el-table-column prop="createdAt" label="Created At" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="Last Update" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="(cmd) => handleAction(cmd, row)">
              <el-button type="primary" link size="small">
                Actions <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">View</el-dropdown-item>
                  <!-- PLANNING状态：可编辑、标记为已规划、取消、删除、复制 -->
                  <el-dropdown-item command="edit" :disabled="row.status === 'PLANNED' || row.status === 'CONFIRMED' || row.status === 'CANCELLED'">Edit</el-dropdown-item>
                  <el-dropdown-item command="markPlanned" :disabled="row.status !== 'PLANNING'">Mark as Planned</el-dropdown-item>
                  <!-- PLANNED状态：可编辑、确认、取消、复制 -->
                  <el-dropdown-item command="confirm" :disabled="row.status !== 'PLANNED'">Confirm</el-dropdown-item>
                  <!-- CONFIRMED状态：生成Load、取消、复制 -->
                  <el-dropdown-item command="generateLoad" :disabled="row.status !== 'CONFIRMED' || !row.orderLines || row.orderLines.length === 0">Generate Load</el-dropdown-item>
                  <!-- 所有状态都可以取消（除了已取消的） -->
                  <el-dropdown-item command="cancel" :disabled="row.status === 'CANCELLED'">Cancel</el-dropdown-item>
                  <!-- 所有状态都可以复制 -->
                  <el-dropdown-item command="duplicate">Duplicate</el-dropdown-item>
                  <!-- 只有PLANNING和CANCELLED状态可以删除 -->
                  <el-dropdown-item command="delete" divided :disabled="row.status !== 'PLANNING' && row.status !== 'CANCELLED'">Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 列设置对话框 -->
    <el-dialog
      v-model="showColumnSettings"
      title="Customize Columns"
      width="500px"
    >
      <div class="column-settings">
        <el-checkbox-group v-model="visibleColumns">
          <el-checkbox label="id">Plan ID</el-checkbox>
          <el-checkbox label="planNo">Plan No.</el-checkbox>
          <el-checkbox label="planName">Plan Name</el-checkbox>
          <el-checkbox label="status">Status</el-checkbox>
          <el-checkbox label="customer">Customer</el-checkbox>
          <el-checkbox label="carrier">Carrier</el-checkbox>
          <el-checkbox label="loadType">Load Type</el-checkbox>
          <el-checkbox label="shipFrom">Ship From</el-checkbox>
          <el-checkbox label="shipTo">Ship To</el-checkbox>
          <el-checkbox label="plannedShipDate">Planned Ship Date</el-checkbox>
          <el-checkbox label="plannedDeliveryDate">Planned Delivery Date</el-checkbox>
          <el-checkbox label="loadIds">Load Count</el-checkbox>
          <el-checkbox label="estimatedFreightCost">Est. Freight Cost</el-checkbox>
          <el-checkbox label="plannedPalletQty">Planned Pallet Qty</el-checkbox>
          <el-checkbox label="orderLines">Order Count</el-checkbox>
          <el-checkbox label="createdBy">Created By</el-checkbox>
          <el-checkbox label="createdAt">Created At</el-checkbox>
          <el-checkbox label="updatedAt">Last Update</el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="showColumnSettings = false">Cancel</el-button>
        <el-button type="primary" @click="saveColumnSettings">Save</el-button>
      </template>
    </el-dialog>

    <!-- 规划规则配置对话框 -->
    <el-dialog
      v-model="showRuleConfig"
      title="Planning Rules Configuration"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <div class="rules-management">
        <div class="rules-header">
          <el-button type="primary" @click="handleAddRule">
            <el-icon><Plus /></el-icon>
            Add Rule
          </el-button>
          <el-input
            v-model="ruleSearchText"
            placeholder="Search rules..."
            style="width: 300px;"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <el-table :data="filteredRules" border style="width: 100%; margin-top: 16px;">
          <el-table-column prop="name" label="Rule Name" min-width="200" />
          <el-table-column prop="priority" label="Priority" width="100" align="center" />
          <el-table-column label="Status" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'">
                {{ row.enabled ? 'Enabled' : 'Disabled' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="Description" min-width="200" />
          <el-table-column label="Actions" width="200" align="center">
            <template #default="{ row, $index }">
              <el-button link type="primary" @click="handleEditRule($index)">Edit</el-button>
              <el-button link type="danger" @click="handleDeleteRule($index)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="showRuleConfig = false">Close</el-button>
      </template>
    </el-dialog>

    <!-- 规则编辑对话框 -->
    <el-dialog
      v-model="showRuleEditDialog"
      :title="currentRuleEditMode === 'add' ? 'Add Planning Rule' : 'Edit Planning Rule'"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <PlanningRuleConfig v-if="currentEditingRule" v-model="currentEditingRule" />
      <template #footer>
        <el-button @click="showRuleEditDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleSaveRule">Save</el-button>
      </template>
    </el-dialog>

    <!-- 自动生成 Plan 对话框 -->
    <el-dialog
      v-model="showAutoGenerateDialog"
      title="Auto Generate Load Plans"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="auto-generate-content">
        <el-alert
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px;"
        >
          <template #title>
            <span>System will automatically generate Load Plans based on enabled planning rules and available orders.</span>
          </template>
        </el-alert>
        <el-form label-width="200px">
          <el-form-item label="Select Rules">
            <el-checkbox-group v-model="selectedRulesForGeneration">
              <el-checkbox
                v-for="rule in enabledRules"
                :key="rule.id"
                :label="rule.id"
              >
                {{ rule.name }} (Priority: {{ rule.priority }})
              </el-checkbox>
            </el-checkbox-group>
            <div v-if="enabledRules.length === 0" style="color: #8b949e; margin-top: 8px;">
              No enabled rules found. Please enable at least one rule first.
            </div>
          </el-form-item>
          <el-form-item label="Preview">
            <div class="preview-info">
              <p><strong>Estimated Plans:</strong> {{ estimatedPlanCount }}</p>
              <p><strong>Orders to Process:</strong> {{ estimatedOrderCount }}</p>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showAutoGenerateDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirmAutoGenerate" :loading="generatingPlans">
          Generate Plans
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  QuestionFilled,
  ArrowDown,
  Plus,
  Refresh,
  Grid,
  Check,
  VideoPlay,
  Download,
  Delete,
  MagicStick,
  Setting,
  Close
} from '@element-plus/icons-vue'
import SearchForm from './components/SearchForm.vue'
import PlanningRuleConfig from './components/PlanningRuleConfig.vue'
import type { LoadPlan, LoadPlanSearchParams, PlanningRule, OrderLine } from './types'
import { LOAD_PLAN_STATUS_MAP } from './types'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const showColumnSettings = ref(false)
const activeStatus = ref('all')
const selectedRows = ref<LoadPlan[]>([])
const showRuleConfig = ref(false)
const showRuleEditDialog = ref(false)
const showAutoGenerateDialog = ref(false)
const ruleSearchText = ref('')
const currentRuleEditMode = ref<'add' | 'edit'>('add')
const currentEditingRule = ref<PlanningRule | null>(null)
const currentEditingRuleIndex = ref(-1)
const selectedRulesForGeneration = ref<string[]>([])
const generatingPlans = ref(false)

// 规划规则列表
const planningRules = ref<PlanningRule[]>([])

// 过滤后的规则
const filteredRules = computed(() => {
  if (!ruleSearchText.value) return planningRules.value
  const search = ruleSearchText.value.toLowerCase()
  return planningRules.value.filter(rule =>
    rule.name.toLowerCase().includes(search) ||
    rule.description?.toLowerCase().includes(search)
  )
})

// 启用的规则
const enabledRules = computed(() => {
  return planningRules.value.filter(rule => rule.enabled).sort((a, b) => b.priority - a.priority)
})

// 预估的计划数量和订单数量
const estimatedPlanCount = computed(() => {
  // TODO: 根据规则和订单计算预估数量
  return selectedRulesForGeneration.value.length * 3
})

const estimatedOrderCount = computed(() => {
  // TODO: 根据规则计算预估订单数量
  return selectedRulesForGeneration.value.length * 10
})

// 标签页配置（4个状态）
const tabs = ref([
  { label: 'All', value: 'all', count: 0, tagType: 'info' },
  { label: 'Planning', value: 'PLANNING', count: 0, tagType: 'info' },
  { label: 'Planned', value: 'PLANNED', count: 0, tagType: 'primary' },
  { label: 'Confirmed', value: 'CONFIRMED', count: 0, tagType: 'success' },
  { label: 'Cancelled', value: 'CANCELLED', count: 0, tagType: 'danger' }
])

// 表格数据
const tableData = ref<LoadPlan[]>([])

// 根据activeStatus过滤表格数据
const filteredTableData = computed(() => {
  if (activeStatus.value === 'all') {
    return tableData.value
  }
  return tableData.value.filter(item => item.status === activeStatus.value)
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 搜索参数
const searchParams = ref<LoadPlanSearchParams>({})

// 选择相关计算属性
const isAllSelected = computed({
  get: () => selectedRows.value.length === filteredTableData.value.length && filteredTableData.value.length > 0,
  set: (val) => {
    if (val) {
      selectedRows.value = [...filteredTableData.value]
    } else {
      selectedRows.value = []
    }
  }
})

const isIndeterminate = computed(
  () => selectedRows.value.length > 0 && selectedRows.value.length < filteredTableData.value.length
)

// 批量操作可用性判断
const canBatchMarkPlanned = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.every(row => row.status === 'PLANNING')
})

const canBatchConfirm = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.every(row => row.status === 'PLANNED')
})

const canBatchGenerateLoad = computed(() => {
  return selectedRows.value.length > 0 && 
    selectedRows.value.every(row => 
      row.status === 'CONFIRMED' && 
      row.orderLines && 
      row.orderLines.length > 0
    )
})

const visibleColumns = ref<string[]>([
  'id', 'planNo', 'planName', 'status', 'customer', 'carrier', 'loadType', 'shipFrom', 'shipTo',
  'plannedShipDate', 'plannedDeliveryDate', 'executionStatus', 'estimatedFreightCost',
  'plannedPalletQty', 'orderLines', 'createdBy', 'createdAt', 'updatedAt'
])

// 规则管理
const handleAddRule = () => {
  currentRuleEditMode.value = 'add'
  currentEditingRuleIndex.value = -1
  currentEditingRule.value = createDefaultRule()
  showRuleEditDialog.value = true
}

const handleEditRule = (index: number) => {
  currentRuleEditMode.value = 'edit'
  currentEditingRuleIndex.value = index
  currentEditingRule.value = JSON.parse(JSON.stringify(planningRules.value[index]))
  showRuleEditDialog.value = true
}

const handleDeleteRule = async (index: number) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete rule "${planningRules.value[index].name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    planningRules.value.splice(index, 1)
    // TODO: 保存到 API
    ElMessage.success('Rule deleted successfully')
  } catch {
    // User cancelled
  }
}

const handleSaveRule = () => {
  if (!currentEditingRule.value) return
  
  if (!currentEditingRule.value.name) {
    ElMessage.warning('Please enter rule name')
    return
  }
  
  if (currentRuleEditMode.value === 'add') {
    currentEditingRule.value.id = `rule-${Date.now()}`
    planningRules.value.push(JSON.parse(JSON.stringify(currentEditingRule.value)))
    ElMessage.success('Rule added successfully')
  } else {
    planningRules.value[currentEditingRuleIndex.value] = JSON.parse(JSON.stringify(currentEditingRule.value))
    ElMessage.success('Rule updated successfully')
  }
  
  // TODO: 保存到 API
  showRuleEditDialog.value = false
  currentEditingRule.value = null
}

const createDefaultRule = (): PlanningRule => {
  return {
    id: '',
    name: '',
    enabled: true,
    priority: 100,
    description: '',
    orderFilters: {
      customers: [],
      warehouses: [],
      carriers: [],
      shipToRegions: [],
      shipToCities: [],
      deliveryDateRange: {
        daysFromNow: 0,
        maxDays: 30
      },
      orderStatuses: [],
      minOrderQuantity: undefined,
      skuCategories: [],
      skuBrands: []
    },
    groupingRules: {
      groupBy: 'customer',
      maxOrdersPerGroup: undefined,
      maxWeightPerGroup: undefined,
      maxVolumePerGroup: undefined,
      maxPalletsPerGroup: undefined,
      allowCrossCustomer: false
    },
    planRules: {
      defaultMode: 'CUSTOMER',
      defaultLoadType: 'FTL',
      defaultFreightTerm: undefined,
      carrierSelectionRule: {
        type: 'auto',
        preferredCarriers: []
      },
      planNameTemplate: 'Plan - {customer} - {date}',
      autoCalculateFreight: true,
      planDateRule: {
        shipDateOffset: 1,
        deliveryDateOffset: 3
      }
    },
    autoExecute: false,
    autoApprove: false
  }
}

// 自动生成 Plan
const handleAutoGenerate = () => {
  if (enabledRules.value.length === 0) {
    ElMessage.warning('Please enable at least one planning rule first')
    showRuleConfig.value = true
    return
  }
  selectedRulesForGeneration.value = enabledRules.value.map(r => r.id || '')
  showAutoGenerateDialog.value = true
}

const handleConfirmAutoGenerate = async () => {
  if (selectedRulesForGeneration.value.length === 0) {
    ElMessage.warning('Please select at least one rule')
    return
  }
  
  generatingPlans.value = true
  try {
    // 获取选中的规则
    const selectedRules = planningRules.value.filter(r => 
      r.id && selectedRulesForGeneration.value.includes(r.id)
    ).sort((a, b) => b.priority - a.priority)
    
    // 根据规则生成 Plan
    const generatedPlans = await generatePlansFromRules(selectedRules)
    
    if (generatedPlans.length === 0) {
      ElMessage.info('No plans generated. No orders match the rules.')
    } else {
      ElMessage.success(`Successfully generated ${generatedPlans.length} plan(s)`)
      // 刷新列表
      loadData()
      loadStatistics()
    }
    
    showAutoGenerateDialog.value = false
  } catch (error) {
    console.error('Failed to generate plans:', error)
    ElMessage.error('Failed to generate plans')
  } finally {
    generatingPlans.value = false
  }
}

// 根据规则生成 Plan 的核心逻辑
const generatePlansFromRules = async (rules: PlanningRule[]): Promise<LoadPlan[]> => {
  const plans: LoadPlan[] = []
  
  // TODO: 从 API 获取符合条件的订单
  // const orders = await fetchOrdersMatchingRules(rules)
  
  // 模拟订单数据
  const mockOrders: OrderLine[] = generateMockOrders()
  
  // 对每个规则处理
  for (const rule of rules) {
    if (!rule.enabled) continue
    
    // 1. 筛选符合条件的订单
    const filteredOrders = filterOrdersByRule(mockOrders, rule)
    
    if (filteredOrders.length === 0) continue
    
    // 2. 根据分组规则分组订单
    const orderGroups = groupOrders(filteredOrders, rule.groupingRules)
    
    // 3. 为每个分组生成 Plan
    for (const group of orderGroups) {
      const plan = createPlanFromOrderGroup(group, rule)
      if (plan) {
        plans.push(plan)
      }
    }
  }
  
  // 保存生成的 Plan 到本地数据（实际应该保存到 API）
  if (plans.length > 0) {
    // 添加到表格数据
    tableData.value.unshift(...plans)
    pagination.total = tableData.value.length
    
    // 更新统计
    loadStatistics()
    
    // TODO: 保存到 API
    // await savePlans(plans)
  }
  
  return plans
}

// 根据规则筛选订单
const filterOrdersByRule = (orders: OrderLine[], rule: PlanningRule): OrderLine[] => {
  return orders.filter(order => {
    const filters = rule.orderFilters
    
    // 客户筛选
    if (filters.customers && filters.customers.length > 0) {
      if (!order.customer || !filters.customers.includes(order.customer)) {
        return false
      }
    }
    
    // 排除客户
    if (filters.excludeCustomers && filters.excludeCustomers.length > 0) {
      if (order.customer && filters.excludeCustomers.includes(order.customer)) {
        return false
      }
    }
    
    // 仓库筛选
    if (filters.warehouses && filters.warehouses.length > 0) {
      if (!order.warehouse || !filters.warehouses.includes(order.warehouse)) {
        return false
      }
    }
    
    // 排除仓库
    if (filters.excludeWarehouses && filters.excludeWarehouses.length > 0) {
      if (order.warehouse && filters.excludeWarehouses.includes(order.warehouse)) {
        return false
      }
    }
    
    // 承运商筛选
    if (filters.carriers && filters.carriers.length > 0) {
      if (!order.carrier || !filters.carriers.includes(order.carrier)) {
        return false
      }
    }
    
    // 排除承运商
    if (filters.excludeCarriers && filters.excludeCarriers.length > 0) {
      if (order.carrier && filters.excludeCarriers.includes(order.carrier)) {
        return false
      }
    }
    
    // 渠道筛选
    if (filters.channels && filters.channels.length > 0) {
      if (!order.channel || !filters.channels.includes(order.channel)) {
        return false
      }
    }
    
    // 订单状态筛选
    if (filters.orderStatuses && filters.orderStatuses.length > 0) {
      if (!order.status || !filters.orderStatuses.includes(order.status)) {
        return false
      }
    }
    
    // 数量范围筛选
    const qty = order.totalQuantity || 0
    if (filters.minOrderQuantity && qty < filters.minOrderQuantity) {
      return false
    }
    if (filters.maxOrderQuantity && qty > filters.maxOrderQuantity) {
      return false
    }
    
    // 金额范围筛选（需要从订单计算总金额）
    // TODO: 如果订单有金额字段，可以添加金额筛选
    
    // 日期范围筛选
    if (filters.deliveryDateRange) {
      const today = new Date()
      const minDate = new Date(today)
      minDate.setDate(today.getDate() + filters.deliveryDateRange.daysFromNow)
      
      if (order.deliveryRequestDate) {
        const deliveryDate = new Date(order.deliveryRequestDate)
        if (deliveryDate < minDate) {
          return false
        }
        if (filters.deliveryDateRange.maxDays) {
          const maxDate = new Date(minDate)
          maxDate.setDate(minDate.getDate() + filters.deliveryDateRange.maxDays)
          if (deliveryDate > maxDate) {
            return false
          }
        }
      }
    }
    
    // SKU 筛选（需要从订单项中检查）
    if (filters.skuCategories && filters.skuCategories.length > 0) {
      // TODO: 检查订单项中的 SKU 分类
    }
    
    return true
  })
}

// 分组订单
const groupOrders = (orders: OrderLine[], groupingRules: PlanningRule['groupingRules']): OrderLine[][] => {
  const groups: Record<string, OrderLine[]> = {}
  
  for (const order of orders) {
    let groupKey = ''
    
    switch (groupingRules.groupBy) {
      case 'customer':
        groupKey = order.customer || 'unknown'
        break
      case 'carrier':
        groupKey = order.carrier || 'unknown'
        break
      case 'warehouse':
        groupKey = order.warehouse || 'unknown'
        break
      case 'destination':
        groupKey = order.shipTo || 'unknown'
        break
      case 'deliveryDate':
        groupKey = order.deliveryRequestDate || 'unknown'
        break
      default:
        groupKey = 'default'
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    
    groups[groupKey].push(order)
  }
  
  // 应用分组限制
  const result: OrderLine[][] = []
  for (const [key, groupOrders] of Object.entries(groups)) {
    // 检查是否超过最大订单数
    if (groupingRules.maxOrdersPerGroup && groupOrders.length > groupingRules.maxOrdersPerGroup) {
      // 拆分成多个组
      for (let i = 0; i < groupOrders.length; i += groupingRules.maxOrdersPerGroup) {
        result.push(groupOrders.slice(i, i + groupingRules.maxOrdersPerGroup))
      }
    } else {
      result.push(groupOrders)
    }
  }
  
  return result
}

// 从订单组创建 Plan
const createPlanFromOrderGroup = (orderGroup: OrderLine[], rule: PlanningRule): LoadPlan | null => {
  if (orderGroup.length === 0) return null
  
  const firstOrder = orderGroup[0]
  const today = new Date()
  const shipDate = new Date(today)
  shipDate.setDate(today.getDate() + rule.planRules.planDateRule.shipDateOffset)
  const deliveryDate = new Date(shipDate)
  deliveryDate.setDate(shipDate.getDate() + rule.planRules.planDateRule.deliveryDateOffset)
  
  // 计算计划数量
  const totalQty = orderGroup.reduce((sum, order) => sum + (order.totalQuantity || 0), 0)
  const plannedPalletQty = Math.ceil(totalQty / 50)
  const plannedWeight = totalQty * 2
  const plannedVolume = totalQty * 0.05
  
  // 生成计划名称
  let planName = rule.planRules.planNameTemplate || 'Plan - {customer} - {date}'
  planName = planName.replace('{customer}', firstOrder.customer || 'Unknown')
  planName = planName.replace('{carrier}', firstOrder.carrier || 'Unknown')
  planName = planName.replace('{date}', today.toLocaleDateString())
  planName = planName.replace('{warehouse}', firstOrder.warehouse || 'Unknown')
  
  const plan: LoadPlan = {
    planNo: `LP${Date.now()}`,
    planName,
    mode: rule.planRules.defaultMode,
    customer: firstOrder.customer,
    customerId: '', // TODO: 从 customer 名称查找 ID
    carrier: firstOrder.carrier,
    carrierId: '', // TODO: 从 carrier 名称查找 ID
    loadType: rule.planRules.defaultLoadType,
    freightTerm: rule.planRules.defaultFreightTerm,
    status: rule.autoApprove ? 'CONFIRMED' : 'PLANNING',
    plannedShipDate: shipDate.toISOString(),
    plannedDeliveryDate: deliveryDate.toISOString(),
    estimatedFreightCost: rule.planRules.autoCalculateFreight ? plannedWeight * 0.3 : 0,
    plannedPalletQty,
    plannedWeight,
    plannedVolume,
    orderLines: orderGroup,
    planningRules: [rule],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System'
  }
  
  return plan
}

// 生成模拟订单数据
const generateMockOrders = (): OrderLine[] => {
  const orders: OrderLine[] = []
  const customers = ['Customer A', 'Customer B', 'Customer C']
  const carriers = ['FedEx', 'UPS', 'DHL']
  const warehouses = ['WH-A', 'WH-B', 'WH-C']
  
  for (let i = 0; i < 50; i++) {
    orders.push({
      orderNo: `ORD${10000 + i}`,
      requestNo: `REQ${20000 + i}`,
      dnNo: `DN${30000 + i}`,
      customer: customers[i % customers.length],
      carrier: carriers[i % carriers.length],
      warehouse: warehouses[i % warehouses.length],
      shipTo: `Address ${i}`,
      totalQuantity: 10 + (i % 50),
      deliveryRequestDate: new Date(Date.now() + (i % 10) * 86400000).toISOString()
    })
  }
  
  return orders
}

onMounted(() => {
  loadData()
  loadStatistics()
  loadPlanningRules()
})

// 加载规划规则
const loadPlanningRules = async () => {
  try {
    // TODO: 从 API 加载规则
    // const rules = await getPlanningRules()
    // planningRules.value = rules
    
    // 模拟数据
    planningRules.value = [
      {
        id: 'rule-1',
        name: 'Customer A - FedEx FTL',
        enabled: true,
        priority: 200,
        description: 'Group Customer A orders by FedEx carrier, FTL load type',
        orderFilters: {
          customers: ['Customer A'],
          carriers: ['FedEx'],
          deliveryDateRange: { daysFromNow: 0, maxDays: 7 }
        },
        groupingRules: {
          groupBy: 'customer',
          maxOrdersPerGroup: 20,
          allowCrossCustomer: false
        },
        planRules: {
          defaultMode: 'CUSTOMER',
          defaultLoadType: 'FTL',
          planDateRule: { shipDateOffset: 1, deliveryDateOffset: 3 },
          carrierSelectionRule: { type: 'preferred', preferredCarriers: ['FedEx'] },
          autoCalculateFreight: true
        }
      }
    ]
  } catch (error) {
    console.error('Failed to load planning rules:', error)
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取数据
    // const response = await getLoadPlans({ ...searchParams.value, page: pagination.page, pageSize: pagination.pageSize })
    // tableData.value = response.data
    // pagination.total = response.total
    
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 如果有搜索条件，应用筛选
    const mockData = generateMockData()
    
    // 应用搜索筛选
    let filteredData = mockData
    if (searchParams.value.planNo) {
      filteredData = filteredData.filter(p => p.planNo?.includes(searchParams.value.planNo!))
    }
    if (searchParams.value.status && searchParams.value.status !== 'all') {
      filteredData = filteredData.filter(p => p.status === searchParams.value.status)
    }
    if (searchParams.value.customerId) {
      filteredData = filteredData.filter(p => p.customerId === searchParams.value.customerId)
    }
    
    tableData.value = filteredData
    pagination.total = filteredData.length
  } catch (error) {
    console.error('Load data failed:', error)
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStatistics = async () => {
  // 根据实际数据计算统计
  const allCount = tableData.value.length
  const planningCount = tableData.value.filter(p => p.status === 'PLANNING').length
  const plannedCount = tableData.value.filter(p => p.status === 'PLANNED').length
  const confirmedCount = tableData.value.filter(p => p.status === 'CONFIRMED').length
  const cancelledCount = tableData.value.filter(p => p.status === 'CANCELLED').length
  
  tabs.value[0].count = allCount
  tabs.value[1].count = planningCount
  tabs.value[2].count = plannedCount
  tabs.value[3].count = confirmedCount
  tabs.value[4].count = cancelledCount
}

// 生成模拟数据
const generateMockData = (): LoadPlan[] => {
  const statuses = ['PLANNING', 'PLANNED', 'CONFIRMED', 'CANCELLED'] // 4个状态
  const modes = ['CENTRAL', 'CUSTOMER']
  const loadTypes = ['LTL', 'FTL', 'PARCEL']
  const customers = ['Customer A', 'Customer B', 'Customer C']
  const customerIds = ['1', '2', '3']
  const carriers = ['FedEx', 'UPS', 'DHL', 'USPS']
  const carrierIds = ['1', '2', '3', '4']
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']

  return Array.from({ length: 20 }, (_, i) => ({
    id: `plan-${i + 1}`,
    planNo: `LP${(10000 + i).toString()}`,
    planName: `Load Plan ${i + 1}`,
    mode: modes[i % modes.length],
    customer: customers[i % customers.length],
    customerId: customerIds[i % customerIds.length],
    carrier: carriers[i % carriers.length],
    carrierId: carrierIds[i % carrierIds.length],
    loadType: loadTypes[i % loadTypes.length],
    status: statuses[i % statuses.length],
    plannedShipDate: new Date(Date.now() + i * 86400000).toISOString(),
    plannedDeliveryDate: new Date(Date.now() + (i + 3) * 86400000).toISOString(),
    shipFrom: {
      city: cities[i % cities.length],
      state: 'NY',
      address1: `${i + 1} Main St`
    },
    shipTo: {
      city: cities[(i + 1) % cities.length],
      state: 'CA',
      address1: `${i + 2} Oak Ave`
    },
    estimatedFreightCost: 1000 + i * 100,
    plannedPalletQty: 10 + (i % 20),
    plannedWeight: (10 + (i % 20)) * 50,
    plannedVolume: (10 + (i % 20)) * 0.5,
    orderLines: Array.from({ length: 3 + (i % 5) }, (_, j) => ({
      orderNo: `ORD${10000 + i * 10 + j}`,
      requestNo: `REQ${20000 + i * 10 + j}`,
      customer: customers[i % customers.length],
      totalQuantity: 10 + j
    })),
    executionStatus: i % 3 === 0 ? 'NOT_STARTED' : i % 3 === 1 ? 'IN_PROGRESS' : 'COMPLETED',
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    createdBy: `User ${i + 1}`
  }))
}

// 事件处理
const handleCreate = () => {
  router.push('/order/load-plan/create')
}

const handleView = (row: LoadPlan) => {
  router.push(`/order/load-plan/${row.id}`)
}

const handleEdit = (row: LoadPlan) => {
  router.push(`/order/load-plan/edit/${row.id}`)
}

const handleAction = (command: string, row: LoadPlan) => {
  switch (command) {
    case 'view':
      handleView(row)
      break
    case 'edit':
      handleEdit(row)
      break
    case 'confirm':
      handleConfirm(row)
      break
    case 'generateLoad':
      handleGenerateLoad(row)
      break
    case 'cancel':
      handleCancelPlan(row)
      break
    case 'duplicate':
      handleDuplicate(row)
      break
    case 'delete':
      handleDelete(row)
      break
    default:
      console.warn(`Unknown command: ${command}`)
  }
}

const handleGenerateLoad = async (row: LoadPlan) => {
  try {
    if (!row.orderLines || row.orderLines.length === 0) {
      ElMessage.warning('Please add orders to the plan first')
      return
    }

    await ElMessageBox.confirm(
      `Generate Load from plan ${row.planNo}? This will create a new Load with the selected orders.`,
      'Generate Load',
      {
        confirmButtonText: 'Generate',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    
    // 将 Plan 转换为 Load 并跳转到 Load 创建页面
    const loadData = convertPlanToLoad(row)
    
    // 将数据存储到 sessionStorage，在 Load 创建页面使用
    sessionStorage.setItem('loadFromPlan', JSON.stringify({
      ...loadData,
      planId: row.id,
      planNo: row.planNo
    }))
    
    // 跳转到 Load 创建页面
    router.push('/order/load/create')
  } catch {
    // User cancelled
  }
}

// 将 Plan 转换为 Load 数据
const convertPlanToLoad = (plan: LoadPlan): any => {
  return {
    mode: plan.mode || 'CUSTOMER',
    customerId: plan.customerId,
    customer: plan.customer,
    carrierId: plan.carrierId,
    carrier: plan.carrier,
    freightTerm: plan.freightTerm,
    loadType: plan.loadType,
    desiredShipDate: plan.plannedShipDate,
    freightCost: plan.estimatedFreightCost,
    shipFrom: plan.shipFrom,
    shipTo: plan.shipTo,
    billTo: plan.billTo,
    note: plan.note ? `Generated from Load Plan: ${plan.planNo}\n${plan.note}` : `Generated from Load Plan: ${plan.planNo}`,
    orderLines: plan.orderLines || [],
    shippingRequestIds: plan.orderLines?.map(line => line.id).filter(Boolean) || []
  }
}

// 标记为已规划
const handleMarkPlanned = async (row: LoadPlan) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to mark plan ${row.planNo} as planned?`,
      'Mark as Planned',
      {
        confirmButtonText: 'Mark as Planned',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    
    // 更新状态
    row.status = 'PLANNED'
    row.updatedAt = new Date().toISOString()
    
    // TODO: 调用API更新状态
    ElMessage.success('Plan marked as planned')
    loadStatistics()
  } catch {
    // User cancelled
  }
}

const handleConfirm = async (row: LoadPlan) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to confirm plan ${row.planNo}? After confirmation, you can generate Load.`,
      'Confirm Plan',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    
    // 更新状态
    row.status = 'CONFIRMED'
    row.updatedAt = new Date().toISOString()
    
    // TODO: 调用API确认计划
    ElMessage.success('Plan confirmed successfully')
    loadStatistics()
  } catch {
    // User cancelled
  }
}


const handleDuplicate = async (row: LoadPlan) => {
  try {
    // TODO: 调用API复制计划
    ElMessage.success('Plan duplicated successfully')
    loadData()
  } catch (error) {
    console.error('Duplicate failed:', error)
    ElMessage.error('Failed to duplicate plan')
  }
}

const handleDelete = async (row: LoadPlan) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete plan ${row.planNo}?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    // TODO: 调用API删除
    ElMessage.success('Plan deleted successfully')
    loadData()
    loadStatistics()
  } catch {
    // User cancelled
  }
}

const handleTabChange = (status: string) => {
  activeStatus.value = status
  pagination.page = 1
  loadData()
}

const handleSearch = (params: LoadPlanSearchParams) => {
  searchParams.value = params
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchParams.value = {}
  pagination.page = 1
  loadData()
}

const handleExportCommand = (command: string) => {
  ElMessage.info(`Export as ${command.toUpperCase()}`)
}

const refreshTable = () => {
  loadData()
  loadStatistics()
}

const handleSelectionChange = (selection: LoadPlan[]) => {
  selectedRows.value = selection
}

const handleSelectAll = (val: boolean) => {
  isAllSelected.value = val
}

const handleBatchAction = async (action: string) => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('Please select at least one plan')
    return
  }

  switch (action) {
    case 'markPlanned':
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to mark ${selectedRows.value.length} plan(s) as planned?`,
          'Mark as Planned',
          {
            confirmButtonText: 'Mark as Planned',
            cancelButtonText: 'Cancel',
            type: 'info'
          }
        )
        // 批量更新状态
        selectedRows.value.forEach(plan => {
          plan.status = 'PLANNED'
          plan.updatedAt = new Date().toISOString()
        })
        // TODO: 调用API批量更新
        ElMessage.success('Plans marked as planned')
        selectedRows.value = []
        loadStatistics()
      } catch {
        // User cancelled
      }
      break
    case 'confirm':
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to confirm ${selectedRows.value.length} plan(s)?`,
          'Confirm Plans',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'info'
          }
        )
        // 批量更新状态
        selectedRows.value.forEach(plan => {
          plan.status = 'CONFIRMED'
          plan.updatedAt = new Date().toISOString()
        })
        // TODO: 调用API批量确认
        ElMessage.success('Plans confirmed successfully')
        selectedRows.value = []
        loadStatistics()
      } catch {
        // User cancelled
      }
      break
    case 'generateLoad':
      // 批量生成 Load - 只处理第一个选中的 Plan
      if (selectedRows.value.length > 0) {
        const firstPlan = selectedRows.value[0]
        handleGenerateLoad(firstPlan)
      }
      break
    case 'cancel':
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to cancel ${selectedRows.value.length} plan(s)?`,
          'Cancel Plans',
          {
            confirmButtonText: 'Cancel Plans',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        // 批量更新状态
        selectedRows.value.forEach(plan => {
          plan.status = 'CANCELLED'
          plan.updatedAt = new Date().toISOString()
        })
        // TODO: 调用API批量更新
        ElMessage.success('Plans cancelled')
        selectedRows.value = []
        loadStatistics()
      } catch {
        // User cancelled
      }
      break
    case 'export':
      ElMessage.info('Export selected feature coming soon')
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to delete ${selectedRows.value.length} plan(s)?`,
          'Confirm Delete',
          {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // TODO: 调用API批量删除
        ElMessage.success('Plans deleted successfully')
        selectedRows.value = []
        loadData()
        loadStatistics()
      } catch {
        // User cancelled
      }
      break
  }
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadData()
}

const saveColumnSettings = () => {
  // TODO: 保存列设置到本地存储或用户配置
  showColumnSettings.value = false
  ElMessage.success('Column settings saved')
}

// 工具函数
const getStatusType = (status?: string): any => {
  if (!status) return 'info'
  const colorMap: Record<string, any> = {
    'PLANNING': 'info',
    'PLANNED': 'primary',
    'CONFIRMED': 'success',
    'CANCELLED': 'danger'
  }
  return colorMap[status] || 'info'
}


const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped lang="scss">
.load-plan-page {
  padding: 24px;
  background-color: #1a1d21;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px 24px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
    }

    .help-icon {
      font-size: 18px;
      color: #8b949e;
      cursor: pointer;

      &:hover {
        color: #7c4dff;
      }
    }
  }

  .header-right {
    .action-buttons {
      display: flex;
      gap: 12px;
    }
  }
}

.status-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 16px;

  .status-tabs {
    flex: 1;

    .tab-list {
      display: flex;
      gap: 8px;

      .tab-item {
        padding: 8px 16px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s;
        position: relative;

        .tab-content {
          display: flex;
          align-items: center;
          gap: 8px;

          .tab-label {
            font-size: 14px;
            color: #8b949e;
            font-weight: 500;
          }

          .count-tag {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            background-color: rgba(255, 255, 255, 0.05);
            color: #8b949e;

            &.info { 
              background-color: rgba(144, 147, 153, 0.1);
              color: #909399;
            }
            &.warning { 
              background-color: rgba(230, 162, 60, 0.1);
              color: #e6a23c;
            }
            &.primary { 
              background-color: rgba(124, 77, 255, 0.1);
              color: #7c4dff;
            }
            &.success { 
              background-color: rgba(103, 194, 58, 0.1);
              color: #67c23a;
            }
            &.danger { 
              background-color: rgba(245, 108, 108, 0.1);
              color: #f56c6c;
            }
          }
        }

        .tab-line {
          height: 2px;
          background-color: transparent;
          margin-top: 4px;
          transition: all 0.3s;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.04);
        }

        &.active {
          .tab-label {
            color: #7c4dff;
            font-weight: 600;
          }

          .tab-line {
            background-color: #7c4dff;
          }
        }
      }
    }
  }

  .toolbar-actions {
    display: flex;
    gap: 8px;

    .action-btn {
      padding: 8px;
      border-radius: 4px;
      background-color: #2d3139;
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #8b949e;

      &:hover {
        background-color: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

.selection-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: rgba(124, 77, 255, 0.1);
  border: 1px solid rgba(124, 77, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 16px;

  .selection-info {
    .selection-text {
      margin-left: 8px;
      font-weight: 500;
      color: #7c4dff;
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }
}

.table-container {
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  overflow: hidden;

  :deep(.el-table) {
    background-color: transparent !important;
    border: none !important;
    width: 100% !important;

    .el-table__header-wrapper,
    .el-table__body-wrapper {
      width: 100% !important;
    }

    th.el-table__cell {
      background-color: #2d3139 !important;
      color: #8b949e !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
      padding: 12px 8px !important;
    }

    td.el-table__cell {
      background-color: transparent !important;
      color: #8b949e !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
      padding: 12px 8px !important;
    }

    .el-button {
      padding: 4px 8px;
    }

    .el-link {
      color: #7c4dff;

      &:hover {
        color: #9670ff;
      }
    }

    .el-table__fixed,
    .el-table__fixed-right {
      background-color: #1e2227 !important;
    }

    .el-scrollbar__bar.is-horizontal {
      height: 8px;
      
      .el-scrollbar__thumb {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 4px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.column-settings {
  :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.rules-management {
  .rules-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
}

.auto-generate-content {
  .preview-info {
    padding: 16px;
    background-color: #2d3139;
    border-radius: 4px;
    
    p {
      margin: 8px 0;
      color: #8b949e;
      
      strong {
        color: #fff;
        margin-right: 8px;
      }
    }
  }
}
</style>

