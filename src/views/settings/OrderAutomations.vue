/// <reference types="element-plus/global" />
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { Rule, Condition, ConditionGroup, Action } from '@/types/automation'
import { FIELD_GROUPS, OPERATOR_OPTIONS, ACTION_GROUPS } from '@/constants/automation'
import { mockResponse } from '@/mock/automationRules'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Sortable from 'sortablejs'

// Debug log
console.log('ACTION_GROUPS:', ACTION_GROUPS)

// 图标组件
const icons = ElementPlusIconsVue

// 组件引用
const ruleFormRef = ref<FormInstance>()
const tableRef = ref<InstanceType<typeof import('element-plus').ElTable>>()

// 状态管理
const rules = ref<Rule[]>([])
const ruleForm = ref<Rule>({
  id: 0,
  name: '',
  description: '',
  conditions: [{
    operator: 'all',
    conditions: [{
      field: '',
      operator: 'eq',
      value: ''
    }]
  }],
  actions: [{
    type: '',
    config: {},
    order: 0
  }],
  lastModified: new Date().toLocaleString(),
  createdBy: '',
  modifiedBy: '',
  source: 'simple' // Added source field
})

// 规则类型定义
const ruleType = ref<string>('')

// 规则类型选项
const RULE_TYPES = [
  {
    value: 'order_merge',
    label: 'Order Merge',
    icon: 'Connection',
    description: 'Automatically merge multiple orders based on conditions',
    color: '#409EFF',
    features: ['SO Level Merge', 'DN Level Merge', 'Time Window', 'Smart Matching']
  },
  {
    value: 'order_routing',
    label: 'Order Routing',
    icon: 'Guide',
    description: 'Route orders to specific warehouses or channels',
    color: '#67C23A',
    features: ['Warehouse Assignment', 'Channel Routing', 'Priority Rules', 'Load Balancing']
  },
  {
    value: 'order_hold',
    label: 'Order Hold',
    icon: 'CircleClose',
    description: 'Temporarily hold orders based on conditions',
    color: '#E6A23C',
    features: ['Auto Hold', 'Hold Duration', 'Release Conditions', 'Notifications']
  },
  {
    value: 'inventory_check',
    label: 'Inventory Check',
    icon: 'Box',
    description: 'Check inventory and take actions',
    color: '#F56C6C',
    features: ['Stock Validation', 'Auto Hold', 'Alert System', 'Restock Trigger']
  },
  {
    value: 'order_update',
    label: 'Order Update',
    icon: 'Edit',
    description: 'Update order fields automatically',
    color: '#909399',
    features: ['Field Update', 'Bulk Operations', 'Conditional Logic', 'Tag Management']
  },
  {
    value: 'custom',
    label: 'Custom Action',
    icon: 'Setting',
    description: 'Create custom automation with flexible actions',
    color: '#606266',
    features: ['Multiple Actions', 'Complex Logic', 'API Integration', 'Advanced Rules']
  }
]

// Trigger Mode 选项
const triggerModes = [
  {
    value: 'immediate',
    label: 'Immediate',
    description: 'Merge as soon as conditions are met',
    icon: 'VideoPlay',
    color: '#67C23A'
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    description: 'Merge at specific time intervals',
    icon: 'Timer',
    color: '#409EFF'
  },
  {
    value: 'manual',
    label: 'Manual',
    description: 'Require manual approval before merging',
    icon: 'User',
    color: '#E6A23C'
  }
]

// DC 分配策略选项
const allocationStrategyOptions = [
  {
    value: 'PRIORITY_BASED',
    label: 'Priority-Based',
    description: 'Allocate by priority (earliest order first)',
    note: '按优先级分配（订单创建时间最早）',
    isDefault: true
  },
  {
    value: 'COMPLETE_FIRST',
    label: 'Complete Orders First',
    description: 'Fulfill complete orders first, then split partial',
    note: '整单优先（先满足整单，再拆部分）',
    isDefault: false
  }
]

// DC 发货回传时机选项
const shipmentSyncTimingOptions = [
  {
    value: 'WAIT_UNTIL_FULLY_SHIPPED',
    label: 'Wait Until Fully Shipped',
    description: 'Report shipment only after all items are shipped',
    note: '等到全部发货完成后，再统一回传 Shipment',
    isDefault: true
  },
  {
    value: 'IMMEDIATE_ON_PARTIAL',
    label: 'Immediate on Partial',
    description: 'Report immediately when any partial shipment occurs',
    note: '一旦有部分发货即立即回传渠道',
    isDefault: false
  }
]

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
      if (oldIndex !== newIndex) {
        const currRow = rules.value.splice(oldIndex!, 1)[0]
        rules.value.splice(newIndex!, 0, currRow)
        
        // 更新所有规则的顺序
        rules.value = rules.value.map((rule, index) => ({
          ...rule,
          order: index + 1,
          lastModified: new Date().toLocaleString()
        }))
        
        ElMessage.success('Rule order updated successfully')
      }
    }
  })
}

// 处理拖拽排序
const handleDragStart = () => {
  dragging.value = true
}

const handleDragEnd = () => {
  dragging.value = false
}

const handleSort = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
  const currRow = rules.value.splice(oldIndex, 1)[0]
  rules.value.splice(newIndex, 0, currRow)
  
  // 更新所有规则的顺序
  rules.value = rules.value.map((rule, index) => ({
    ...rule,
    order: index + 1,
    lastModified: new Date().toLocaleString()
  }))
  
  ElMessage.success('Rule order updated successfully')
}

const editingRule = ref<Rule | null>(null)
const dialogVisible = ref(false)
const loading = ref(false)
const saving = ref(false)

// Add status options
const STATUS_OPTIONS = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

// 加载规则列表
const loadRules = async () => {
  try {
    loading.value = true
    // 使用模拟数据
    rules.value = mockResponse.data
  } catch (error) {
    console.error('Error loading rules:', error)
    ElMessage.error('Failed to load rules')
  } finally {
    loading.value = false
  }
}

// 创建规则
const handleCreateRule = () => {
  editingRule.value = null
  ruleType.value = '' // 重置规则类型
  ruleForm.value = {
    id: 0,
    name: '',
    description: '',
    conditions: [{
      operator: 'all',
      conditions: [{
        field: '',
        operator: 'eq',
        value: ''
      }]
    }],
    actions: [{
      type: '',
      config: {},
      order: 0
    }],
    lastModified: new Date().toLocaleString(),
    createdBy: '',
    modifiedBy: '',
    source: 'simple' // Added source field
  }
  dialogVisible.value = true
}

// 处理规则类型变化
const handleRuleTypeChange = (type: string) => {
  ruleType.value = type
  
  // 根据规则类型初始化默认配置
  switch (type) {
    case 'order_merge':
      ruleForm.value.actions = [{
        type: '', // 用户需要选择 merge_orders_so 或 merge_orders_dn
        config: {
          // Primary Order Selection
          priority_field: 'earliest',
          // DC 配置
          allocation_strategy: 'PRIORITY_BASED',
          shipment_sync_timing: 'WAIT_UNTIL_FULLY_SHIPPED',
          // 必填条件 - 默认打开
          match_customer: true,
          match_shipping_address: true,
          match_warehouse: true,
          match_channel: true,
          // 可选条件 - 默认关闭
          match_recipient_name: false,
          match_phone: false,
          match_email: false,
          match_carrier: false,
          match_shipping_method: false,
          match_payment_method: false,
          match_currency: false,
          match_tags: false,
          // 初始化过滤值数组和展开状态
          customer_filter_values: [],
          customer_filter_expanded: false,
          address_filter_values: [],
          address_filter_expanded: false,
          phone_filter_values: [],
          phone_filter_expanded: false,
          email_filter_values: [],
          email_filter_expanded: false,
          warehouse_filter_values: [],
          warehouse_filter_expanded: false,
          carrier_filter_values: [],
          carrier_filter_expanded: false,
          shipping_method_filter_values: [],
          shipping_method_filter_expanded: false,
          payment_method_filter_values: [],
          payment_method_filter_expanded: false,
          currency_filter_values: [],
          currency_filter_expanded: false,
          channel_filter_values: [],
          channel_filter_expanded: false,
          tags_filter_values: [],
          tags_filter_expanded: false,
          // 初始化时间窗口
          time_window_enabled: true,
          time_window_minutes: 60
        },
        order: 0
      }]
      break
    case 'order_routing':
      ruleForm.value.actions = [{
        type: 'override_warehouse',
        config: {
          warehouse: ''
        },
        order: 0
      }]
      break
    case 'order_hold':
      ruleForm.value.actions = [{
        type: 'hold_order',
        config: {
          hold_minutes: 60,
          hold_by_business_hour: false,
          hold_scope: 'whole_order',
          next_status_after_hold: 'review_required'
        },
        order: 0
      }]
      break
    case 'inventory_check':
      ruleForm.value.actions = [{
        type: 'check_inventory_hold',
        config: {
          hold_type: 'entire_order',
          auto_release: true
        },
        order: 0
      }]
      break
    case 'order_update':
      ruleForm.value.actions = [{
        type: 'update_order_field',
        config: {
          field: '',
          value: ''
        },
        order: 0
      }]
      break
    case 'custom':
      ruleForm.value.actions = [{
        type: '',
        config: {},
        order: 0
      }]
      break
  }
}

// 编辑规则
const handleEditRule = async (rule: Rule) => {
  editingRule.value = rule
  ruleForm.value = JSON.parse(JSON.stringify(rule))
  
  // 根据 action type 识别规则类型
  if (rule.actions && rule.actions.length > 0) {
    const actionType = rule.actions[0].type
    switch (actionType) {
      case 'merge_orders':
      case 'merge_orders_so':
      case 'merge_orders_dn':
        ruleType.value = 'order_merge'
        break
      case 'override_warehouse':
        ruleType.value = 'order_routing'
        break
      case 'hold_order':
        ruleType.value = 'order_hold'
        break
      case 'check_inventory_hold':
        ruleType.value = 'inventory_check'
        break
      case 'update_order_field':
      case 'add_line_item':
      case 'update_line_item':
        ruleType.value = 'order_update'
        break
      case 'create_exception':
      case 'close_order':
        ruleType.value = 'custom'
        break
      default:
        ruleType.value = 'custom'
    }
  }
  
  dialogVisible.value = true
}

// 删除规则
const handleDeleteRule = async (rule: Rule) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this rule?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    const index = rules.value.findIndex(r => r.id === rule.id)
    if (index > -1) {
      rules.value.splice(index, 1)
      ElMessage.success('Rule deleted successfully')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting rule:', error)
      ElMessage.error('Failed to delete rule')
    }
  }
}

// 保存规则
const handleSaveRule = async () => {
  if (!ruleFormRef.value) return
  
  try {
    await ruleFormRef.value.validate()
    
    saving.value = true
    
    if (editingRule.value) {
      const index = rules.value.findIndex(r => r.id === editingRule.value?.id)
      if (index > -1) {
        rules.value[index] = {
          ...ruleForm.value,
          lastModified: new Date().toLocaleString()
        }
      }
      ElMessage.success('Rule updated successfully')
    } else {
      rules.value.push({
        ...ruleForm.value,
        id: Date.now(),
        lastModified: new Date().toLocaleString()
      })
      ElMessage.success('Rule created successfully')
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('Error saving rule:', error)
    ElMessage.error('Failed to save rule')
  } finally {
    saving.value = false
  }
}

// 添加条件
const handleAddCondition = (groupIndex: number) => {
  const group = ruleForm.value.conditions[groupIndex]
  if (!group) return
  
  group.conditions.push({
    field: '',
    operator: 'eq',
    value: ''
  })
}

// 移除条件
const removeCondition = (groupIndex: number, condIndex: number) => {
  const group = ruleForm.value.conditions[groupIndex]
  if (!group || group.conditions.length <= 1) {
    ElMessage.warning('Each condition group must have at least one condition')
    return
  }
  group.conditions.splice(condIndex, 1)
}

// 移除动作方法（不再需要，因为规则类型决定动作）

// 格式化条件显示
const formatCondition = (condition: Condition): string => {
  const field = FIELD_GROUPS
    .flatMap(g => g.fields)
    .find(f => f.value === condition.field)

  const operator = OPERATOR_OPTIONS
    .find(op => op.value === condition.operator)

  if (!field || !operator) return ''

  return `${field.label} ${operator.label} ${condition.value}`
}

// 格式化动作显示
const formatAction = (action: Action): string => {
  const actionDef = ACTION_GROUPS
    .flatMap(g => g.actions)
    .find(a => a.value === action.type)

  if (!actionDef) return ''

  let result = actionDef.label
  
  // Format based on action type and config
  switch (action.type) {
    case 'update_order_field':
      const field = action.config.field
      const value = action.config.value
      result += ` (${field} → ${value})`
      break
    case 'add_line_item':
      result += ` (${action.config.sku}, Qty: ${action.config.quantity})`
      break
    case 'update_line_item':
      result += ` (${action.config.selector?.value})`
      break
    case 'hold_order':
      result += ` (${action.config.hold_minutes} mins)`
      break
    case 'override_warehouse':
      result += ` (${action.config.warehouse})`
      break
    case 'create_exception':
      result += ` (${action.config.exception_type})`
      break
    case 'check_inventory_hold':
      const holdType = action.config.hold_type === 'entire_order' ? 'Entire Order' : 'Items Only'
      result += ` (Threshold: ${action.config.min_stock_threshold}, Type: ${holdType})`
      break
    case 'close_order':
      result += ` (Reason: ${action.config.close_reason})`
      break
    case 'merge_orders':
    case 'merge_orders_so':
    case 'merge_orders_dn':
      const priorityLabel = action.config.priority_field === 'earliest' ? 'Earliest' : 
                           action.config.priority_field === 'latest' ? 'Latest' : 'Highest Value'
      const allocationLabel = action.config.allocation_strategy === 'PRIORITY_BASED' ? 'Priority' : 'Complete First'
      result += ` (Priority: ${priorityLabel}, Allocation: ${allocationLabel})`
      break
  }

  return result
}

// 获取操作符选项
const getOperatorOptions = (fieldType: string) => {
  return OPERATOR_OPTIONS.filter(op => 
    op.applicableTypes?.includes(fieldType)
  )
}

// 获取动作配置字段
const getActionConfigFields = (actionType: string) => {
  console.log('Getting config fields for action type:', actionType)
  console.log('Available groups:', ACTION_GROUPS)
  
  for (const group of ACTION_GROUPS) {
    console.log('Checking group:', group.key)
    const action = group.actions.find(a => a.value === actionType)
    if (action?.config?.fields) {
      console.log('Found fields:', action.config.fields)
      return action.config.fields
    }
  }
  console.log('No fields found for action type:', actionType)
  return []
}

// 处理动作类型变化
const handleActionTypeChange = (actionIndex: number) => {
  const action = ruleForm.value.actions[actionIndex]
  console.log('Action type changed:', action.type)
  if (action.type) {
    // 如果是合并订单 action，保留已有的匹配条件配置
    const preservedConfig = (action.type === 'merge_orders_so' || action.type === 'merge_orders_dn') 
      ? { ...action.config } 
      : {}
    
    // 初始化配置对象
    action.config = {}
    
    // 获取字段定义
    const fields = getActionConfigFields(action.type)
    console.log('Initializing fields:', fields)
    
    // 递归初始化字段值
    const initFieldValue = (field: any) => {
      if (field.type === 'object' && field.fields) {
        // 如果是对象类型，初始化一个空对象
        action.config[field.name] = {}
        // 递归初始化子字段
        field.fields.forEach((subField: any) => {
          if (subField.default !== undefined) {
            action.config[field.name][subField.name] = subField.default
          }
        })
      } else if (field.default !== undefined) {
        // 对于普通字段，直接设置默认值
        action.config[field.name] = field.default
      }
    }

    // 初始化所有字段
    fields.forEach(initFieldValue)
    
    // 如果是合并订单 action，恢复保留的配置（包括匹配条件）
    if (action.type === 'merge_orders_so' || action.type === 'merge_orders_dn') {
      action.config = {
        ...action.config,
        ...preservedConfig
      }
    }
  }
}

// Handle status change
const handleStatusChange = async (rule: Rule) => {
  try {
    const index = rules.value.findIndex(r => r.id === rule.id)
    if (index > -1) {
      rules.value[index] = {
        ...rule,
        enabled: !rule.enabled,
        lastModified: new Date().toLocaleString()
      }
      ElMessage.success(`Rule ${rule.enabled ? 'enabled' : 'disabled'} successfully`)
    }
  } catch (error) {
    console.error('Error updating rule status:', error)
    ElMessage.error('Failed to update rule status')
  }
}

// 获取当前选中的规则类型信息
const getCurrentRuleType = () => {
  return RULE_TYPES.find(type => type.value === ruleType.value)
}

// 判断字段是否应该显示（支持条件显示）
const shouldShowField = (field: any, action: Action): boolean => {
  // 如果字段名是 schedule_interval，只在 trigger_mode 为 scheduled 时显示
  if (field.name === 'schedule_interval') {
    return action.config.trigger_mode === 'scheduled'
  }
  
  // 如果字段名是 time_window_minutes，只在 time_window_enabled 为 true 时显示
  if (field.name === 'time_window_minutes') {
    return action.config.time_window_enabled === true
  }
  
  // 默认显示所有字段
  return true
}

// 初始化
onMounted(async () => {
  await loadRules()
  await nextTick()
  initSortable()
})
</script>

<template>
  <div class="order-automations">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">Order Automation Rules</h1>
          <p class="subtitle">
            Create and manage automation rules to streamline order processing
          </p>
        </div>
        <div class="action-section">
          <el-button 
            type="primary" 
            size="large"
            @click="handleCreateRule"
          >
            <el-icon class="mr-1"><component :is="icons.Plus" /></el-icon>
            Create Rule
          </el-button>
        </div>
      </div>
    </div>

    <!-- Rules List -->
    <el-card class="rules-card">
      <el-table
        ref="tableRef"
        :data="rules"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
        :row-class-name="'draggable-row'"
        :class="{ 'is-dragging': dragging }"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @sort-end="handleSort"
      >
        <!-- Order Column -->
        <el-table-column width="60" align="center">
          <template #default="{ row }">
            <el-icon class="drag-handle"><component :is="icons.Operation" /></el-icon>
          </template>
        </el-table-column>
        
        <!-- Rule Name & Description -->
        <el-table-column label="Rule" min-width="300">
          <template #default="{ row }">
            <div class="rule-info">
              <div class="rule-details">
                <div class="rule-name">{{ row.name }}</div>
                <div class="rule-description">{{ row.description }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Conditions -->
        <el-table-column label="Conditions" min-width="250">
          <template #default="{ row }">
            <div v-for="(group, index) in row.conditions" :key="index" class="mb-2">
              <div class="text-gray-500 text-sm mb-1">
                {{ group.operator === 'all' ? 'Match ALL conditions:' : 'Match ANY condition:' }}
              </div>
              <div 
                v-for="(condition, cIndex) in group.conditions" 
                :key="cIndex"
                class="text-sm ml-4"
              >
                {{ formatCondition(condition) }}
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Actions -->
        <el-table-column label="Actions" min-width="250">
          <template #default="{ row }">
            <div 
              v-for="(action, index) in row.actions" 
              :key="index"
              class="mb-2"
            >
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-sm">{{ index + 1 }}.</span>
                {{ formatAction(action) }}
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Last Modified -->
        <el-table-column label="Last Modified" width="180">
          <template #default="{ row }">
            <div class="text-sm">
              <div>{{ row.lastModified }}</div>
              <div class="text-gray-500">by {{ row.modifiedBy }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- Status -->
        <el-table-column label="Status" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              :active-value="true"
              :inactive-value="false"
              @change="() => handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <!-- Operations -->
        <el-table-column fixed="right" label="Operations" width="100" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-tooltip content="Edit">
                <el-button 
                  type="primary" 
                  link
                  @click="handleEditRule(row)"
                >
                  <el-icon><component :is="icons.Edit" /></el-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip content="Delete">
                <el-button
                  type="danger" 
                  link
                  @click="handleDeleteRule(row)"
                >
                  <el-icon><component :is="icons.Delete" /></el-icon>
                </el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingRule ? 'Edit Rule' : 'Create Rule'"
      width="1200px"
      destroy-on-close
      class="rule-dialog"
    >
      <el-form 
        ref="ruleFormRef"
        :model="ruleForm"
        label-width="100px"
        class="rule-form"
      >
        <!-- Basic Information -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title">
              <h3>Basic Information</h3>
            </div>
          </div>
          
          <div class="section-content">
            <el-form-item 
              label="Name" 
              prop="name"
              :rules="[
                { required: true, message: 'Please enter rule name', trigger: 'blur' },
                { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' }
              ]"
            >
              <el-input 
                v-model="ruleForm.name" 
                placeholder="Enter a descriptive name"
              />
            </el-form-item>

            <el-form-item label="Description" prop="description">
              <el-input 
                v-model="ruleForm.description" 
                type="textarea"
                :rows="2"
                placeholder="Describe what this rule does"
              />
            </el-form-item>
          </div>
        </div>

        <!-- Rule Type Selection -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title">
              <h3>Rule Type</h3>
              <p class="text-gray-500">Select the type of automation rule you want to create</p>
            </div>
          </div>

          <div class="section-content">
            <el-form-item label="Rule Type" prop="ruleType" required>
              <el-select 
                v-model="ruleType" 
                placeholder="Select rule type"
                size="large"
                @change="handleRuleTypeChange"
                class="rule-type-select"
              >
                <el-option
                  v-for="type in RULE_TYPES"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                >
                  <div class="rule-type-option">
                    <div class="option-icon" :style="{ color: type.color }">
                      <el-icon :size="20"><component :is="icons[type.icon]" /></el-icon>
                    </div>
                    <div class="option-content">
                      <div class="option-label">{{ type.label }}</div>
                      <div class="option-description">{{ type.description }}</div>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 规则类型说明 -->
            <div v-if="ruleType" class="rule-type-hint">
              <el-icon class="hint-icon"><component :is="icons.InfoFilled" /></el-icon>
              <span>{{ getCurrentRuleType()?.description }}</span>
            </div>
          </div>
        </div>

        <!-- Conditions -->
        <div v-if="ruleType" class="form-section">
          <div class="section-header">
            <div class="section-title">
              <h3>Filter Conditions</h3>
            </div>
          </div>

          <div class="section-content">
            <!-- Order Source -->
            <div class="source-selection mb-6">
              <div class="source-label mb-2">
                <span class="text-sm font-medium">Order Source</span>
                <el-tooltip content="Select the source of orders this rule will apply to">
                  <el-icon class="text-gray-400 ml-1"><component :is="icons.InfoFilled" /></el-icon>
                </el-tooltip>
              </div>
              <el-select 
                v-model="ruleForm.source" 
                placeholder="Select order source"
                class="w-full"
              >
                <el-option label="Simple" value="simple" />
                <el-option-group label="Marketplaces">
                  <el-option label="Amazon" value="amazon" />
                  <el-option label="eBay" value="ebay" />
                  <el-option label="Walmart" value="walmart" />
                </el-option-group>
                <el-option-group label="E-commerce">
                  <el-option label="Shopify" value="shopify" />
                  <el-option label="WooCommerce" value="woocommerce" />
                </el-option-group>
              </el-select>
            </div>

            <!-- 合单规则专用条件 -->
            <div v-if="ruleType === 'order_merge'" class="merge-conditions-filter">
              <div class="section-label">
                <el-icon class="label-icon"><component :is="icons.Filter" /></el-icon>
                <span>Merge Matching Conditions</span>
                <span class="required-mark">*</span>
                <el-tooltip content="Orders must meet ALL selected conditions to be merged together">
                  <el-icon class="help-icon"><component :is="icons.QuestionFilled" /></el-icon>
                </el-tooltip>
              </div>
              <div class="conditions-list">
                <!-- ========== 必要条件区域 ========== -->
                
                <!-- Customer - Required -->
                <div class="condition-item-advanced required-condition">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_customer" disabled />
                    <div class="condition-label">
                      <span class="label-text">
                        Same Customer
                        <el-tag size="small" type="danger" effect="plain">Required</el-tag>
                      </span>
                      <span class="label-desc">Match customer ID - Cannot be disabled for safety</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_customer"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.customer_filter_expanded = !ruleForm.actions[0].config.customer_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.customer_filter_values?.length ? `${ruleForm.actions[0].config.customer_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_customer && ruleForm.actions[0].config.customer_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.customer_filter_values"
                      multiple
                      filterable
                      allow-create
                      placeholder="Select or enter customer IDs (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="All Customers (default)" value="" disabled />
                    </el-select>
                    <span class="config-hint">💡 Leave empty to merge all orders with same customer</span>
                  </div>
                </div>

                <!-- Shipping Address - Required -->
                <div class="condition-item-advanced required-condition">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_shipping_address" disabled />
                    <div class="condition-label">
                      <span class="label-text">
                        Same Shipping Address
                        <el-tag size="small" type="danger" effect="plain">Required</el-tag>
                      </span>
                      <span class="label-desc">Identical delivery address - Cannot be disabled for logistics safety</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_shipping_address"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.address_filter_expanded = !ruleForm.actions[0].config.address_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.address_filter_values?.length ? `${ruleForm.actions[0].config.address_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_shipping_address && ruleForm.actions[0].config.address_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.address_filter_values"
                      multiple
                      filterable
                      allow-create
                      placeholder="Enter destination cities or zip codes (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="All Addresses (default)" value="" disabled />
                    </el-select>
                    <span class="config-hint">💡 Specify cities/zip codes to limit merging (e.g., "New York", "90001")</span>
                  </div>
                </div>

                <!-- Warehouse - Required -->
                <div class="condition-item-advanced required-condition">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_warehouse" disabled />
                    <div class="condition-label">
                      <span class="label-text">
                        Same Warehouse
                        <el-tag size="small" type="danger" effect="plain">Required</el-tag>
                      </span>
                      <span class="label-desc">Allocated to same warehouse - Different warehouses cannot merge for logistics</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_warehouse"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.warehouse_filter_expanded = !ruleForm.actions[0].config.warehouse_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.warehouse_filter_values?.length ? `${ruleForm.actions[0].config.warehouse_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_warehouse && ruleForm.actions[0].config.warehouse_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.warehouse_filter_values"
                      multiple
                      filterable
                      placeholder="Select warehouses (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="Warehouse A" value="WH001" />
                      <el-option label="Warehouse B" value="WH002" />
                      <el-option label="Warehouse C" value="WH003" />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders from selected warehouses</span>
                  </div>
                </div>

                <!-- Channel - Required -->
                <div class="condition-item-advanced required-condition">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_channel" disabled />
                    <div class="condition-label">
                      <span class="label-text">
                        Same Sales Channel
                        <el-tag size="small" type="danger" effect="plain">Required</el-tag>
                      </span>
                      <span class="label-desc">Same order source channel - Different channels have different business rules</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_channel"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.channel_filter_expanded = !ruleForm.actions[0].config.channel_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.channel_filter_values?.length ? `${ruleForm.actions[0].config.channel_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_channel && ruleForm.actions[0].config.channel_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.channel_filter_values"
                      multiple
                      filterable
                      placeholder="Select channels (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="Amazon" value="amazon" />
                      <el-option label="eBay" value="ebay" />
                      <el-option label="Shopify" value="shopify" />
                      <el-option label="Website" value="website" />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders from selected channels</span>
                  </div>
                </div>

                <!-- ========== 可选条件区域 ========== -->
                
                <!-- Recipient Name -->
                <div class="condition-item-advanced">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_recipient_name" />
                    <div class="condition-label">
                      <span class="label-text">Same Recipient Name</span>
                      <span class="label-desc">Same receiver name</span>
                    </div>
                  </div>
                </div>

                <!-- Phone Number -->
                <div class="condition-item-advanced">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_phone" />
                    <div class="condition-label">
                      <span class="label-text">Same Phone Number</span>
                      <span class="label-desc">Same contact phone</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_phone"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.phone_filter_expanded = !ruleForm.actions[0].config.phone_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.phone_filter_values?.length ? `${ruleForm.actions[0].config.phone_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_phone && ruleForm.actions[0].config.phone_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.phone_filter_values"
                      multiple
                      filterable
                      allow-create
                      placeholder="Enter phone numbers (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="All Phones (default)" value="" disabled />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders with specified phone numbers</span>
                  </div>
                </div>

                <!-- Email -->
                <div class="condition-item-advanced">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_email" />
                    <div class="condition-label">
                      <span class="label-text">Same Email</span>
                      <span class="label-desc">Same email address</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_email"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.email_filter_expanded = !ruleForm.actions[0].config.email_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.email_filter_values?.length ? `${ruleForm.actions[0].config.email_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_email && ruleForm.actions[0].config.email_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.email_filter_values"
                      multiple
                      filterable
                      allow-create
                      placeholder="Enter email addresses (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="All Emails (default)" value="" disabled />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders with specified email addresses</span>
                  </div>
                </div>

                <!-- Carrier -->
                <div class="condition-item-advanced">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_carrier" />
                    <div class="condition-label">
                      <span class="label-text">Same Carrier</span>
                      <span class="label-desc">Same delivery carrier</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_carrier"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.carrier_filter_expanded = !ruleForm.actions[0].config.carrier_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.carrier_filter_values?.length ? `${ruleForm.actions[0].config.carrier_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_carrier && ruleForm.actions[0].config.carrier_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.carrier_filter_values"
                      multiple
                      filterable
                      placeholder="Select carriers (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="UPS" value="UPS" />
                      <el-option label="FedEx" value="FedEx" />
                      <el-option label="DHL" value="DHL" />
                      <el-option label="USPS" value="USPS" />
                      <el-option label="SF Express" value="SF" />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders using selected carriers</span>
                  </div>
                </div>

                <!-- Shipping Method -->
                <div class="condition-item-advanced">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_shipping_method" />
                    <div class="condition-label">
                      <span class="label-text">Same Shipping Method</span>
                      <span class="label-desc">Same delivery method</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_shipping_method"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.shipping_method_filter_expanded = !ruleForm.actions[0].config.shipping_method_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.shipping_method_filter_values?.length ? `${ruleForm.actions[0].config.shipping_method_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_shipping_method && ruleForm.actions[0].config.shipping_method_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.shipping_method_filter_values"
                      multiple
                      filterable
                      placeholder="Select shipping methods (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="Standard Shipping" value="standard" />
                      <el-option label="Express Shipping" value="express" />
                      <el-option label="Overnight" value="overnight" />
                      <el-option label="Economy" value="economy" />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders with selected shipping methods</span>
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="condition-item-advanced">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_payment_method" />
                    <div class="condition-label">
                      <span class="label-text">Same Payment Method</span>
                      <span class="label-desc">Same payment type</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_payment_method"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.payment_method_filter_expanded = !ruleForm.actions[0].config.payment_method_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.payment_method_filter_values?.length ? `${ruleForm.actions[0].config.payment_method_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_payment_method && ruleForm.actions[0].config.payment_method_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.payment_method_filter_values"
                      multiple
                      filterable
                      placeholder="Select payment methods (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="Credit Card" value="credit_card" />
                      <el-option label="PayPal" value="paypal" />
                      <el-option label="Cash on Delivery" value="cod" />
                      <el-option label="Bank Transfer" value="bank_transfer" />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders with selected payment methods</span>
                  </div>
                </div>

                <!-- Currency -->
                <div class="condition-item-advanced">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_currency" />
                    <div class="condition-label">
                      <span class="label-text">Same Currency</span>
                      <span class="label-desc">Same order currency</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_currency"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.currency_filter_expanded = !ruleForm.actions[0].config.currency_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.currency_filter_values?.length ? `${ruleForm.actions[0].config.currency_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_currency && ruleForm.actions[0].config.currency_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.currency_filter_values"
                      multiple
                      filterable
                      placeholder="Select currencies (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="USD" value="USD" />
                      <el-option label="EUR" value="EUR" />
                      <el-option label="GBP" value="GBP" />
                      <el-option label="CNY" value="CNY" />
                      <el-option label="JPY" value="JPY" />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders in selected currencies</span>
                  </div>
                </div>

                <!-- Tags -->
                <div class="condition-item-advanced">
                  <div class="condition-header">
                    <el-switch v-model="ruleForm.actions[0].config.match_tags" />
                    <div class="condition-label">
                      <span class="label-text">Same Order Tags</span>
                      <span class="label-desc">Orders with identical tags</span>
                    </div>
                    <el-button 
                      v-if="ruleForm.actions[0].config.match_tags"
                      text 
                      type="primary" 
                      size="small"
                      @click="ruleForm.actions[0].config.tags_filter_expanded = !ruleForm.actions[0].config.tags_filter_expanded"
                    >
                      <el-icon><component :is="icons.Setting" /></el-icon>
                      {{ ruleForm.actions[0].config.tags_filter_values?.length ? `${ruleForm.actions[0].config.tags_filter_values.length} selected` : 'Configure' }}
                    </el-button>
                  </div>
                  <div v-if="ruleForm.actions[0].config.match_tags && ruleForm.actions[0].config.tags_filter_expanded" class="condition-config">
                    <el-select
                      v-model="ruleForm.actions[0].config.tags_filter_values"
                      multiple
                      filterable
                      allow-create
                      placeholder="Select or create tags (leave empty to match all)"
                      class="w-full"
                    >
                      <el-option label="VIP" value="vip" />
                      <el-option label="Urgent" value="urgent" />
                      <el-option label="Gift" value="gift" />
                    </el-select>
                    <span class="config-hint">💡 Only merge orders with selected tags</span>
                  </div>
                </div>
              </div>

              <!-- 时间窗口配置 -->
              <div class="time-window-filter mt-4">
                <div class="section-label">
                  <el-icon class="label-icon"><component :is="icons.Timer" /></el-icon>
                  <span>Time Window</span>
                </div>
                <div class="time-window-config">
                  <div class="switch-row">
                    <el-switch v-model="ruleForm.actions[0].config.time_window_enabled" />
                    <span class="switch-label">Only merge orders within a time window</span>
                  </div>
                  <div v-if="ruleForm.actions[0].config.time_window_enabled" class="time-input-row">
                    <el-input-number
                      v-model="ruleForm.actions[0].config.time_window_minutes"
                      :min="1"
                      :max="1440"
                      :step="5"
                    />
                    <span class="unit-label">minutes</span>
                    <span class="hint-text">Orders created within this time range can be merged</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 通用条件组（非合单规则使用） -->
            <template v-if="ruleType !== 'order_merge'">
            <div class="filter-label mb-4">
                <span class="text-sm font-medium">Advanced Conditions</span>
              <el-tooltip content="Set specific conditions for when this rule should apply">
                <el-icon class="text-gray-400 ml-1"><component :is="icons.InfoFilled" /></el-icon>
              </el-tooltip>
            </div>
            
            <div 
              v-for="(group, groupIndex) in ruleForm.conditions" 
              :key="groupIndex"
              class="condition-group"
            >
              <div class="condition-group-header">
                <div class="flex items-center gap-2">
                  <span class="text-sm">If</span>
                  <el-select v-model="group.operator" class="operator-select">
                    <el-option label="Any" value="any" />
                    <el-option label="All" value="all" />
                  </el-select>
                  <span class="text-sm">of the following conditions are met</span>
                </div>
              </div>

              <div class="conditions-container">
                <div 
                  v-for="(condition, condIndex) in group.conditions" 
                  :key="condIndex"
                  class="condition-row"
                >
                  <div class="condition-content">
                    <el-select 
                      v-model="condition.field" 
                      placeholder="Select field"
                      class="field-select"
                    >
                      <el-option-group 
                        v-for="group in FIELD_GROUPS"
                        :key="group.key"
                        :label="group.label"
                      >
                        <el-option
                          v-for="field in group.fields"
                          :key="field.value"
                          :label="field.label"
                          :value="field.value"
                        >
                          <div class="field-option">
                            <div class="field-label">{{ field.label }}</div>
                            <div class="field-description">{{ field.description }}</div>
                          </div>
                        </el-option>
                      </el-option-group>
                    </el-select>

                    <el-select 
                      v-model="condition.operator" 
                      placeholder="Select operator"
                      class="operator-select"
                    >
                      <el-option
                        v-for="op in getOperatorOptions(
                          FIELD_GROUPS
                            .flatMap(g => g.fields)
                            .find(f => f.value === condition.field)?.type || ''
                        )"
                        :key="op.value"
                        :label="op.label"
                        :value="op.value"
                      />
                    </el-select>

                    <el-input 
                      v-model="condition.value" 
                      placeholder="Enter value"
                      class="value-input"
                    />
                  </div>

                  <div class="condition-actions">
                    <el-button
                      type="danger"
                      circle
                      plain
                      size="small"
                      @click="removeCondition(groupIndex, condIndex)"
                    >
                      <el-icon><component :is="icons.Delete" /></el-icon>
                    </el-button>
                  </div>
                </div>

                <div class="add-condition">
                  <el-button
                    type="primary"
                    plain
                    size="small"
                    class="add-condition-btn"
                    @click="handleAddCondition(groupIndex)"
                  >
                    <el-icon><component :is="icons.Plus" /></el-icon>
                    Add Rule
                  </el-button>
                </div>
              </div>
            </div>
            </template>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="ruleType" class="form-section">
          <div class="section-header">
            <div class="section-title">
              <h3>Actions</h3>
              <p class="text-gray-500">Define what should happen when conditions are met</p>
            </div>
          </div>

          <div class="section-content">
            <div 
              v-for="(action, actionIndex) in ruleForm.actions" 
              :key="actionIndex"
              class="action-item"
            >
              <div class="action-header">
                <el-select 
                  v-model="action.type" 
                  placeholder="Select action"
                  class="action-type-select"
                  @change="handleActionTypeChange(actionIndex)"
                >
                  <el-option-group 
                    v-for="group in ACTION_GROUPS"
                    :key="group.key"
                    :label="group.label"
                  >
                    <el-option
                      v-for="act in group.actions"
                      :key="act.value"
                      :label="act.label"
                      :value="act.value"
                      :disabled="false"
                    >
                      <div>
                        <div>{{ act.label }}</div>
                        <div class="text-gray-400 text-xs">{{ act.description }}</div>
                      </div>
                    </el-option>
                  </el-option-group>
                </el-select>

                <div v-if="action.type" class="text-xs text-gray-400 mt-1">
                  Selected action: {{ action.type }}
                </div>

                <el-button
                  type="danger"
                  link
                  @click="removeAction(actionIndex)"
                >
                  <el-icon><component :is="icons.Delete" /></el-icon>
                </el-button>
              </div>

              <div v-if="ruleType === 'order_merge'" class="action-config">
                <!-- 合并规则专用配置 -->
                <template v-if="action.type === 'merge_orders_so' || action.type === 'merge_orders_dn'">
                  <!-- Primary Order Selection -->
                  <div class="primary-order-section">
                    <div class="section-label">
                      <el-icon class="label-icon"><component :is="icons.User" /></el-icon>
                      <span>Primary Order Selection</span>
                      <span class="required-mark">*</span>
                      <el-tooltip content="Select which order's information to use as primary in the merged order">
                        <el-icon class="help-icon"><component :is="icons.QuestionFilled" /></el-icon>
                      </el-tooltip>
                    </div>
                    <el-select v-model="action.config.priority_field" size="large" style="width: 100%">
                      <el-option label="Earliest Order" value="earliest">
                        <div class="option-content">
                          <span>Earliest Order</span>
                          <span class="option-desc">Use the first order's information</span>
                        </div>
                      </el-option>
                      <el-option label="Latest Order" value="latest">
                        <div class="option-content">
                          <span>Latest Order</span>
                          <span class="option-desc">Use the most recent order's information</span>
                        </div>
                      </el-option>
                      <el-option label="Highest Value" value="highest_value">
                        <div class="option-content">
                          <span>Highest Value</span>
                          <span class="option-desc">Use the highest value order's information</span>
                        </div>
                      </el-option>
                    </el-select>
                  </div>

                  <!-- DC 配置 -->
                  <div class="dc-config-section">
                    <div class="section-label">
                      <el-icon class="label-icon"><component :is="icons.Operation" /></el-icon>
                      <span>DC Configuration</span>
                      <el-tooltip content="Configure how DC handles partial fulfillment and shipment reporting">
                        <el-icon class="help-icon"><component :is="icons.QuestionFilled" /></el-icon>
                      </el-tooltip>
                    </div>
                    
                    <!-- Allocation Strategy -->
                    <div class="dc-config-item">
                      <div class="config-item-label">
                        <span class="label-name">Allocation Strategy</span>
                        <span class="label-subtitle">分配策略</span>
                      </div>
                      <el-select 
                        v-model="action.config.allocation_strategy" 
                        placeholder="Select allocation strategy"
                        class="w-full"
                        size="large"
                      >
                        <el-option
                          v-for="option in allocationStrategyOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        >
                          <div class="dc-option-content">
                            <div class="option-header">
                              <span class="option-label">{{ option.label }}</span>
                              <el-tag v-if="option.isDefault" size="small" type="success" effect="plain">Default</el-tag>
                            </div>
                            <div class="option-note">{{ option.note }}</div>
                          </div>
                        </el-option>
                      </el-select>
                      <div class="config-hint">
                        <el-icon><component :is="icons.InfoFilled" /></el-icon>
                        <span>
                          <template v-if="action.config.allocation_strategy === 'PRIORITY_BASED'">
                            Orders will be fulfilled based on creation time (earliest first)
                          </template>
                          <template v-else-if="action.config.allocation_strategy === 'COMPLETE_FIRST'">
                            Complete orders will be fulfilled first, partial quantities will be distributed to remaining orders
                          </template>
                        </span>
                      </div>
                    </div>

                    <!-- Shipment Sync Timing -->
                    <div class="dc-config-item">
                      <div class="config-item-label">
                        <span class="label-name">Shipment Sync Timing</span>
                        <span class="label-subtitle">发货回传时机</span>
                      </div>
                      <el-select 
                        v-model="action.config.shipment_sync_timing" 
                        placeholder="Select shipment sync timing"
                        class="w-full"
                        size="large"
                      >
                        <el-option
                          v-for="option in shipmentSyncTimingOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        >
                          <div class="dc-option-content">
                            <div class="option-header">
                              <span class="option-label">{{ option.label }}</span>
                              <el-tag v-if="option.isDefault" size="small" type="success" effect="plain">Default</el-tag>
                            </div>
                            <div class="option-note">{{ option.note }}</div>
                          </div>
                        </el-option>
                      </el-select>
                      <div class="config-hint">
                        <el-icon><component :is="icons.InfoFilled" /></el-icon>
                        <span>
                          <template v-if="action.config.shipment_sync_timing === 'WAIT_UNTIL_FULLY_SHIPPED'">
                            System will wait until all items are shipped before reporting to channel
                          </template>
                          <template v-else-if="action.config.shipment_sync_timing === 'IMMEDIATE_ON_PARTIAL'">
                            System will immediately report to channel when any partial shipment occurs
                          </template>
                        </span>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 其他规则类型的配置 -->
                <template v-else-if="ruleType === 'order_routing'">
                  <div class="routing-config">
                    <div class="section-label">
                      <el-icon class="label-icon"><component :is="icons.Guide" /></el-icon>
                      <span>Warehouse Assignment</span>
                      <span class="required-mark">*</span>
                    </div>
                    <el-select v-model="action.config.warehouse" placeholder="Select warehouse" style="width: 100%">
                      <el-option label="Main Warehouse" value="WH001" />
                      <el-option label="East DC" value="WH002" />
                      <el-option label="West DC" value="WH003" />
                    </el-select>
                  </div>
                </template>

                <template v-else-if="ruleType === 'order_hold'">
                  <div class="hold-config">
                    <div class="section-label">
                      <el-icon class="label-icon"><component :is="icons.CircleClose" /></el-icon>
                      <span>Hold Configuration</span>
                    </div>
                    <div class="config-grid">
                      <div class="config-item">
                        <label class="config-label">Hold Duration (Minutes) <span class="required-mark">*</span></label>
                        <el-input-number v-model="action.config.hold_minutes" :min="1" style="width: 100%" />
                      </div>
                      <div class="config-item">
                        <label class="config-label">Hold Scope <span class="required-mark">*</span></label>
                        <el-select v-model="action.config.hold_scope" style="width: 100%">
                          <el-option label="Entire Order" value="whole_order" />
                          <el-option label="Specific Items" value="specific_items" />
                        </el-select>
                      </div>
                    </div>
                    <div class="config-item mt-3">
                      <div class="boolean-field">
                        <el-switch v-model="action.config.hold_by_business_hour" />
                        <span class="boolean-label">Calculate by business hours only</span>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="ruleType === 'inventory_check'">
                  <div class="inventory-config">
                    <div class="section-label">
                      <el-icon class="label-icon"><component :is="icons.Box" /></el-icon>
                      <span>Inventory Check Configuration</span>
                    </div>
                    <div class="config-grid">
                      <div class="config-item">
                        <label class="config-label">Hold Type <span class="required-mark">*</span></label>
                        <el-select v-model="action.config.hold_type" style="width: 100%">
                          <el-option label="Hold Entire Order" value="entire_order" />
                          <el-option label="Hold Items Only" value="items_only" />
                        </el-select>
                      </div>
                      <div class="config-item">
                        <div class="boolean-field">
                          <el-switch v-model="action.config.auto_release" />
                          <span class="boolean-label">Auto release when stock available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="ruleType === 'order_update'">
                  <div class="update-config">
                    <div class="section-label">
                      <el-icon class="label-icon"><component :is="icons.Edit" /></el-icon>
                      <span>Field Update Configuration</span>
                    </div>
                    <div class="config-grid">
                      <div class="config-item">
                        <label class="config-label">Field to Update <span class="required-mark">*</span></label>
                        <el-select v-model="action.config.field" placeholder="Select field" style="width: 100%">
                          <el-option label="Status" value="status" />
                          <el-option label="Tags" value="tags" />
                          <el-option label="Currency" value="currency" />
                          <el-option label="Order Note" value="order_note" />
                        </el-select>
                      </div>
                      <div class="config-item">
                        <label class="config-label">New Value <span class="required-mark">*</span></label>
                        <el-input v-model="action.config.value" placeholder="Enter new value" />
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Custom 类型：显示通用配置 -->
                <template v-else-if="ruleType === 'custom'" v-for="field in getActionConfigFields(action.type)" :key="field.name">
                  <div class="config-field" v-if="shouldShowField(field, action)">
                    <label class="field-label">
                      {{ field.label }}
                      <span v-if="field.required" class="text-red-500">*</span>
                      <el-tooltip v-if="field.description" :content="field.description">
                        <el-icon><component :is="icons.InfoFilled" /></el-icon>
                      </el-tooltip>
                    </label>

                    <template v-if="field.type === 'string'">
                      <el-input 
                        v-if="shouldShowField(field, action)"
                        v-model="action.config[field.name]"
                        :placeholder="field.label"
                      />
                    </template>

                    <template v-else-if="field.type === 'number'">
                      <el-input-number
                        v-if="shouldShowField(field, action)"
                        v-model="action.config[field.name]"
                        :min="field.min"
                        :max="field.max"
                        :placeholder="field.label"
                        style="width: 100%"
                      />
                    </template>

                    <template v-else-if="field.type === 'boolean'">
                      <div v-if="shouldShowField(field, action)" class="boolean-field">
                      <el-switch
                        v-model="action.config[field.name]"
                      />
                        <span class="boolean-label">{{ field.label }}</span>
                      </div>
                    </template>

                    <template v-else-if="field.type === 'enum'">
                      <el-select 
                        v-if="shouldShowField(field, action)"
                        v-model="action.config[field.name]"
                        :placeholder="field.label"
                      >
                        <el-option
                          v-for="opt in field.options"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        >
                          <div>
                            <div>{{ opt.label }}</div>
                            <div v-if="opt.description" class="text-gray-400 text-xs">{{ opt.description }}</div>
                          </div>
                        </el-option>
                      </el-select>
                    </template>

                    <template v-else-if="field.type === 'array'">
                      <el-select 
                        v-model="action.config[field.name]"
                        multiple
                        :placeholder="field.label"
                      >
                        <el-option
                          v-for="opt in field.options"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        />
                      </el-select>
                    </template>

                    <template v-else-if="field.type === 'object' && field.fields">
                      <div class="nested-fields">
                        <template v-for="subField in field.fields" :key="subField.name">
                          <div class="nested-field">
                            <label class="field-label">
                              {{ subField.label }}
                              <span v-if="subField.required" class="text-red-500">*</span>
                              <el-tooltip v-if="subField.description" :content="subField.description">
                                <el-icon><component :is="icons.InfoFilled" /></el-icon>
                              </el-tooltip>
                            </label>

                            <template v-if="subField.type === 'string'">
                              <el-input 
                                v-model="action.config[field.name][subField.name]"
                                :placeholder="subField.label"
                              />
                            </template>

                            <template v-else-if="subField.type === 'number'">
                              <el-input-number
                                v-model="action.config[field.name][subField.name]"
                                :min="subField.min"
                                :max="subField.max"
                                :placeholder="subField.label"
                              />
                            </template>

                            <template v-else-if="subField.type === 'boolean'">
                              <el-switch
                                v-model="action.config[field.name][subField.name]"
                                :active-text="subField.label"
                                :default-value="subField.default"
                              />
                            </template>

                            <template v-else-if="subField.type === 'enum'">
                              <el-select 
                                v-model="action.config[field.name][subField.name]"
                                :placeholder="subField.label"
                              >
                                <el-option
                                  v-for="opt in subField.options"
                                  :key="opt.value"
                                  :label="opt.label"
                                  :value="opt.value"
                                />
                              </el-select>
                            </template>

                            <template v-else-if="subField.type === 'array'">
                              <el-select 
                                v-model="action.config[field.name][subField.name]"
                                multiple
                                :placeholder="subField.label"
                              >
                                <el-option
                                  v-for="opt in subField.options"
                                  :key="opt.value"
                                  :label="opt.label"
                                  :value="opt.value"
                                />
                              </el-select>
                            </template>
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </div>

            <!-- 移除 Add Action 按钮，因为规则类型决定了动作 -->
          </div>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            :loading="saving"
            @click="handleSaveRule"
          >
            Save
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.order-automations {
  padding: 24px;
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

/* 拖拽相关样式 */
.draggable-row {
  cursor: move;
}

.draggable-row:hover .drag-handle {
  opacity: 1;
}

.drag-handle {
  opacity: 0.3;
  transition: opacity 0.2s;
  cursor: move;
  color: var(--el-text-color-secondary);
}

.is-dragging .el-table__row:not(.dragging) {
  opacity: 0.5;
}

.is-dragging .el-table__row.dragging {
  background-color: var(--el-color-primary-light-9);
  border: 1px dashed var(--el-color-primary);
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
}

:deep(.el-table__row.sortable-chosen) {
  background-color: var(--el-color-primary-light-8);
}

:deep(.el-table__row.sortable-drag) {
  background-color: var(--el-color-primary-light-7);
  opacity: 0.8;
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
  margin-left: 24px;
}

.rules-card {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.rule-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.rule-details {
  flex: 1;
}

.rule-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.rule-description {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.form-section {
  background: transparent;
  border-radius: 8px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.form-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.section-title {
  margin-bottom: 0;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--el-text-color-primary);
}

.section-title p {
  font-size: 12px;
  margin: 4px 0 0;
  color: var(--el-text-color-secondary);
}

.section-content {
  padding: 20px;
}

.condition-group {
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  margin-bottom: 16px;
}

.condition-group-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color);
  border-radius: 4px 4px 0 0;
}

.condition-operator {
  .el-radio-button__inner {
    padding: 8px 16px;
  }
}

.operator-summary {
  display: flex;
  align-items: center;
  justify-content: center;
}

.operator-tag {
  font-size: 13px;
  padding: 6px 12px;
}

.conditions-container {
  padding: 16px;
}

.condition-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.condition-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.condition-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-select {
  width: 240px;
}

.operator-select {
  width: 200px;
}

.value-input {
  flex: 1;
  min-width: 200px;
}

.add-condition {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.add-condition-btn {
  font-size: 14px;
  padding: 8px 16px;
}

.action-item {
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  margin-bottom: 16px;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color);
  border-radius: 4px 4px 0 0;
}

.action-type-select {
  width: 300px;
}

.action-config {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.config-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-option {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.dialog-footer {
  padding: 20px 0 0;
  border-top: 1px solid var(--el-border-color-light);
}

.nested-fields {
  background: var(--el-fill-color-light);
  border-radius: 4px;
  padding: 12px;
}

.nested-field {
  margin-bottom: 12px;
}

.nested-field:last-child {
  margin-bottom: 0;
}

.source-selection {
  margin-bottom: 24px;
}

.source-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.filter-radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-radio-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.filter-radio-item.is-checked {
  background-color: var(--el-color-primary-light-8);
  font-weight: bold;
}

/* Merge Orders Preview Banner */
.merge-preview-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin: 16px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(103, 194, 58, 0.1) 100%);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.merge-preview-banner:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.preview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-size: 24px;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
}

.preview-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.preview-conditions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-count {
  margin-left: 4px;
  opacity: 0.8;
  font-weight: 600;
}

/* Boolean Field Styling */
.boolean-field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  transition: background 0.2s ease;
}

.boolean-field:hover {
  background: var(--el-fill-color);
}

.boolean-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  user-select: none;
}

/* Enhanced config field for merge orders */
.action-item[data-action-type="merge_orders"] .action-config {
  padding: 20px;
}

.action-item[data-action-type="merge_orders"] .config-field {
  margin-bottom: 16px;
}

/* Grid layout for merge config - 上下流式布局 */
.action-item .action-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Full width for certain fields */
.config-field:has(.el-select[placeholder*="Primary"]),
.config-field:has(.el-select[placeholder*="Trigger"]),
.config-field:has(.el-select[placeholder*="Merge Node"]) {
  grid-column: 1 / -1;
}

/* 合并规则专用样式 */
.merge-node-selection {
  margin-bottom: 24px;
  padding: 20px 0;
  background: transparent;
  border-radius: 8px;
}

/* 高级条件列表样式 */
.conditions-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 1200px) {
  .conditions-list {
    grid-template-columns: 1fr;
  }
}

.condition-item-advanced {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  transition: all 0.2s ease;
}

.condition-item-advanced:hover {
  background: var(--el-fill-color-light);
  padding: 12px 16px;
}

.condition-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.condition-header .condition-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.condition-header .label-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.condition-header .label-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.condition-config {
  margin-top: 12px;
  padding-top: 12px;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

/* 必要条件样式 */
.required-condition {
  background: linear-gradient(90deg, rgba(245, 108, 108, 0.03) 0%, transparent 100%);
  border-left: 3px solid var(--el-color-danger);
  padding-left: 13px !important;
}

.required-condition .label-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.required-condition .el-switch.is-disabled {
  opacity: 0.6;
}

.required-condition:hover {
  background: linear-gradient(90deg, rgba(245, 108, 108, 0.05) 0%, var(--el-fill-color-light) 100%);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.label-icon {
  font-size: 18px;
  color: var(--el-color-primary);
}

.help-icon {
  font-size: 14px;
  color: var(--el-text-color-placeholder);
  cursor: help;
  margin-left: auto;
}

.required-mark {
  color: var(--el-color-danger);
  margin-left: 2px;
}

.node-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.node-card {
  position: relative;
  padding: 20px;
  background: var(--el-fill-color-blank);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.node-card:hover {
  background: var(--el-fill-color-light);
}

.node-card.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.card-icon {
  font-size: 28px;
  color: var(--el-color-primary);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-desc {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin-bottom: 4px;
}

.card-info {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-success);
  color: white;
  border-radius: 50%;
  font-size: 14px;
}

/* 合并条件网格 */
.merge-conditions-section,
.time-window-section,
.merge-strategy-section,
.trigger-mode-section {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--el-fill-color-blank);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

.conditions-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.condition-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--el-bg-color);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.2s ease;
}

.condition-item:hover {
  border-color: var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.condition-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.label-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 时间窗口配置 */
.time-window-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.time-input-row,
.schedule-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 48px;
}

.unit-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.hint-text {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  font-style: italic;
}

/* 合并策略 */
.strategy-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.strategy-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strategy-item.full-width {
  grid-column: 1 / -1;
}

.strategy-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.strategy-hint {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

/* 触发模式 */
.trigger-radios {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trigger-radios :deep(.el-radio) {
  margin-right: 0;
  padding: 12px;
  background: var(--el-bg-color);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.2s ease;
}

.trigger-radios :deep(.el-radio:hover) {
  border-color: var(--el-color-primary-light-5);
}

.trigger-radios :deep(.el-radio.is-checked) {
  border-color: var(--el-color-primary);
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.05) 0%, transparent 100%);
}

.radio-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 8px;
}

.radio-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.radio-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* Trigger Mode Cards */
.trigger-mode-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.trigger-mode-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--el-fill-color-blank);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trigger-mode-card:hover {
  background: var(--el-fill-color-light);
}

.trigger-mode-card.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.mode-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
}

.mode-content {
  flex: 1;
  min-width: 0;
}

.mode-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

.mode-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

.mode-check {
  flex-shrink: 0;
  color: var(--el-color-primary);
  font-size: 20px;
}

.schedule-config {
  margin-top: 12px;
  padding: 20px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

.schedule-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.schedule-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.schedule-input-row .hint-text {
  flex: 1;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

/* 选项内容样式 */
.option-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-desc {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
}

/* 弹窗响应式 */
.rule-dialog {
  max-width: 95vw;
}

@media (max-width: 1400px) {
  .rule-dialog :deep(.el-dialog) {
    width: 95% !important;
  }
}

@media (max-width: 768px) {
  .rule-dialog :deep(.el-dialog) {
    width: 100% !important;
    margin: 0 !important;
    max-height: 100vh;
  }
}

/* 响应式调整 - 已全部改为流式布局，无需响应式 */

/* 规则类型下拉选择器 */
.rule-type-select {
  width: 100%;
}

.rule-type-select :deep(.el-input__wrapper) {
  padding: 12px 16px;
}

/* 下拉选项样式 */
.rule-type-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.option-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.option-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

/* 规则类型提示 */
.rule-type-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin-top: 12px;
  background: var(--el-color-info-light-9);
  border-left: 3px solid var(--el-color-info);
  border-radius: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.rule-type-hint .hint-icon {
  color: var(--el-color-info);
  font-size: 16px;
  flex-shrink: 0;
}

/* 合单规则过滤条件样式 */
.merge-conditions-filter {
  margin-top: 24px;
  padding: 20px 0;
  background: transparent;
  border-radius: 8px;
}

.time-window-filter {
  padding: 20px 0;
  background: transparent;
  border-radius: 8px;
}

.mb-6 {
  margin-bottom: 24px;
}

/* 其他规则类型的配置样式 */
.routing-config,
.hold-config,
.inventory-config,
.update-config {
  padding: 20px 0;
  background: transparent;
  border-radius: 8px;
}

.config-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  gap: 4px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

/* Primary Order Selection 样式 */
.primary-order-section {
  margin-bottom: 24px;
  padding: 24px 0;
  background: transparent;
  border-radius: 8px;
}

/* DC 配置样式 */
.dc-config-section {
  margin-top: 24px;
  padding: 24px 0;
  background: transparent;
  border-radius: 8px;
}

.dc-config-item {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dc-config-item:hover {
  border-color: var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dc-config-item:last-child {
  margin-bottom: 0;
}

.config-item-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.label-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.label-subtitle {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  font-style: italic;
}

/* DC 选项内容样式 */
.dc-option-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.option-note {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.config-hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: var(--el-color-info-light-9);
  border-left: 3px solid var(--el-color-info);
  border-radius: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.config-hint .el-icon {
  color: var(--el-color-info);
  font-size: 14px;
  margin-top: 2px;
  flex-shrink: 0;
}

.config-hint span {
  flex: 1;
}

.config-row {
  margin-bottom: 12px;
}

.config-row:last-child {
  margin-bottom: 0;
}

.help-icon {
  color: var(--el-text-color-placeholder);
  margin-left: 4px;
  cursor: help;
}
</style> 