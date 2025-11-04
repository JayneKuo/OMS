/// <reference types="element-plus/global" />
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
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
    value: 'shipping_rate',
    label: 'Shipping Rate Quote',
    icon: 'Van',
    description: 'Get shipping quotes and trigger approval for high-cost shipments',
    color: '#13C2C2',
    features: ['Multi-Carrier Quotes', 'Dimensional Weight', 'Price Approval', 'Insurance Options']
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

// 搜索和筛选状态
const searchQuery = ref('')
const activeTab = ref('all')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const selectedRules = ref<number[]>([])

// 批量操作相关
const isBatchMode = ref(false)

// 可选条件状态（用于左侧勾选）
const selectedConditionFields = ref<string[]>([])

// 合单规则的默认必选条件
const mergeRequiredConditions = [
  { value: 'match_customer', label: 'Same Customer' },
  { value: 'match_shipping_address', label: 'Same Shipping Address' },
  { value: 'match_warehouse', label: 'Same Warehouse' },
  { value: 'match_channel', label: 'Same Sales Channel' }
]

// 合单规则的可选条件
const mergeOptionalConditions = [
  { value: 'order_source', label: 'Order Source', type: 'basic' },
  { value: 'match_recipient_name', label: 'Same Recipient Name', type: 'optional' },
  { value: 'match_phone', label: 'Same Phone Number', type: 'optional' },
  { value: 'match_email', label: 'Same Email', type: 'optional' },
  { value: 'match_carrier', label: 'Same Carrier', type: 'optional' },
  { value: 'match_shipping_method', label: 'Same Shipping Method', type: 'optional' },
  { value: 'match_payment_method', label: 'Same Payment Method', type: 'optional' },
  { value: 'match_currency', label: 'Same Currency', type: 'optional' },
  { value: 'match_tags', label: 'Same Order Tags', type: 'optional' }
]

// 合单规则选中的可选条件
const selectedMergeOptionalConditions = ref<string[]>([])

// Add status options
const STATUS_OPTIONS = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
]

// Tab 选项（基于规则类型）
const TAB_OPTIONS = [
  { value: 'all', label: 'All Rules', icon: 'Grid' },
  { value: 'order_merge', label: 'Order Merge', icon: 'Connection', color: '#409EFF' },
  { value: 'order_routing', label: 'Order Routing', icon: 'Guide', color: '#67C23A' },
  { value: 'order_hold', label: 'Order Hold', icon: 'CircleClose', color: '#E6A23C' },
  { value: 'inventory_check', label: 'Inventory Check', icon: 'Box', color: '#F56C6C' },
  { value: 'order_update', label: 'Order Update', icon: 'Edit', color: '#909399' },
  { value: 'shipping_rate', label: 'Shipping Rate', icon: 'Van', color: '#13C2C2' },
  { value: 'custom', label: 'Custom', icon: 'Setting', color: '#606266' }
]

// 根据 action type 识别规则类型
const getRuleType = (rule: Rule): string => {
  if (rule.actions && rule.actions.length > 0) {
    const actionType = rule.actions[0].type
    switch (actionType) {
      case 'merge_orders':
      case 'merge_orders_so':
      case 'merge_orders_dn':
        return 'order_merge'
      case 'override_warehouse':
        return 'order_routing'
      case 'hold_order':
        return 'order_hold'
      case 'check_inventory_hold':
        return 'inventory_check'
      case 'update_order_field':
      case 'add_line_item':
      case 'update_line_item':
        return 'order_update'
      case 'request_shipping_rate':
        return 'shipping_rate'
      default:
        return 'custom'
    }
  }
  return 'custom'
}

// 筛选后的规则列表
const filteredRules = computed(() => {
  let result = rules.value

  // Tab 筛选
  if (activeTab.value !== 'all') {
    result = result.filter(rule => getRuleType(rule) === activeTab.value)
  }

  // 状态筛选
  if (statusFilter.value !== 'all') {
    const isActive = statusFilter.value === 'active'
    result = result.filter(rule => rule.enabled === isActive)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(rule => {
      return (
        rule.name.toLowerCase().includes(query) ||
        rule.description?.toLowerCase().includes(query) ||
        rule.createdBy?.toLowerCase().includes(query) ||
        rule.modifiedBy?.toLowerCase().includes(query)
      )
    })
  }

  return result
})

// 统计每个类型的规则数量
const getRuleCountByType = (type: string): number => {
  if (type === 'all') {
    return rules.value.length
  }
  return rules.value.filter(rule => getRuleType(rule) === type).length
}

// 获取规则类型标签
const getRuleTypeTag = (type: string): { label: string, type: string } => {
  const typeMap: Record<string, { label: string, type: string }> = {
    'order_merge': { label: 'Order Merge', type: 'primary' },
    'order_routing': { label: 'Routing', type: 'success' },
    'order_hold': { label: 'Hold', type: 'warning' },
    'inventory_check': { label: 'Inventory', type: 'danger' },
    'order_update': { label: 'Update', type: 'info' },
    'shipping_rate': { label: 'Shipping Rate', type: '' },
    'custom': { label: 'Custom', type: 'info' }
  }
  return typeMap[type] || { label: 'Unknown', type: 'info' }
}

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
  selectedConditionFields.value = [] // 重置选中的条件
  selectedMergeOptionalConditions.value = [] // 重置合单可选条件
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
  selectedConditionFields.value = [] // 清空已选择的条件
  selectedMergeOptionalConditions.value = [] // 清空合单可选条件
  
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
    case 'shipping_rate':
      ruleForm.value.actions = [{
        type: 'request_shipping_rate',
        config: {
          // 基础配置字段
          has_contract_rate: false,
          assigned_carrier: '',
          ship_method: 'Freight',
          ship_service_level: 'Standard',
          service_type: 'LTL',
          estimated_freight_cost: 0,
          weight_lbs: 100,
          volume_cbm: 1,
          pallet_count_config: 1,
          priority_level: 'Normal',
          customer_code: '',
          account_type: 'Prepaid',
          ship_from: '',
          ship_to: '',
          hazmat_flag: false,
          // 承运商池配置
          carrier_pool: ['UPS', 'FedEx'],
          service_types: ['Ground', 'Express'],
          inquiry_method: 'API',
          timeout_min: 60,
          max_carrier_count: 5,
          package_dimensions: {
            length: 12,
            width: 12,
            height: 12
          },
          weight_config: {
            actual_weight: 5,
            use_dimensional_weight: true,
            dim_divisor: 139
          },
          shipping_mode: 'parcel',
          freight_class: '',
          pallet_count: 1,
          stackable: true,
          liftgate_required: false,
          auto_select_carrier: true,
          auto_assign_shipment: true,
          save_rate_result: true,
          generate_quote_id: true,
          require_approval_if_cost_gt: 2000,
          approval_roles: ['transportation_manager'],
          auto_requote_on_timeout: true,
          fallback_carrier: 'SWFT',
          notify_roles: ['dispatcher', 'operations'],
          webhook_callback_url: '',
          billing_mode: 'prepaid',
          billing_account_source: 'customer',
          billing_account_default: 'ITEM_DEFAULT_ACCOUNT',
          fallback_policy: 'use_default',
          charge_to_party: 'shipper',
          validate_account: false,
          update_status: 'rate_inquired',
          update_oms_status: true,
          log_inquiry_result: true,
          log_table: 'tms_rate_inquiry_log',
          generate_report: false,
          score_weighting: {
            cost: 0.7,
            service: 0.3
          },
          response_validity_hours: 24
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
      case 'request_shipping_rate':
        ruleType.value = 'shipping_rate'
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
    case 'request_shipping_rate':
      const carrierPool = action.config.carrier_pool?.join(', ') || 'N/A'
      const inquiryMethod = action.config.inquiry_method || 'API'
      const requireApproval = action.config.require_approval_if_cost_gt || 0
      const autoSelect = action.config.auto_select_carrier ? 'Yes' : 'No'
      result += ` (Carriers: ${carrierPool}, Method: ${inquiryMethod}, Auto-Select: ${autoSelect}, Approval > $${requireApproval})`
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

// 获取运价规则相关的字段组
const getShippingRateFieldGroups = () => {
  // 只返回与运价相关的字段组
  const shippingRateKeys = [
    'basic',           // 基本信息（订单状态等）
    'shipping_rate',   // 运价信息
    'shipping_location', // 运输地点
    'shipping_specs',  // 运输规格
    'customer_account', // 客户账户
    'special_requirements' // 特殊要求
  ]
  
  return FIELD_GROUPS.filter(group => shippingRateKeys.includes(group.key))
}

// 获取字段的预设选项
const getFieldOptions = (fieldValue: string) => {
  const field = FIELD_GROUPS
    .flatMap(g => g.fields)
    .find(f => f.value === fieldValue)
  
  // 如果字段有options，返回options
  if (field?.options && field.options.length > 0) {
    return field.options
  }
  
  // 为一些常用字段提供预设值
  const presetOptions: Record<string, Array<{label: string, value: any}>> = {
    // 订单状态
    'status': [
      { label: 'Open', value: 'open' },
      { label: 'Pending', value: 'pending' },
      { label: 'Processing', value: 'processing' },
      { label: 'On Hold', value: 'on_hold' }
    ],
    // 承运商
    'assigned_carrier': [
      { label: 'Not Assigned', value: '' },
      { label: 'UPS', value: 'UPS' },
      { label: 'FedEx', value: 'FedEx' },
      { label: 'USPS', value: 'USPS' },
      { label: 'DHL', value: 'DHL' }
    ],
    // 州代码（美国常用州）
    'origin_state': [
      { label: 'California (CA)', value: 'CA' },
      { label: 'Texas (TX)', value: 'TX' },
      { label: 'New York (NY)', value: 'NY' },
      { label: 'Florida (FL)', value: 'FL' },
      { label: 'Illinois (IL)', value: 'IL' },
      { label: 'Pennsylvania (PA)', value: 'PA' },
      { label: 'Ohio (OH)', value: 'OH' },
      { label: 'Georgia (GA)', value: 'GA' },
      { label: 'North Carolina (NC)', value: 'NC' },
      { label: 'Michigan (MI)', value: 'MI' }
    ],
    'destination_state': [
      { label: 'California (CA)', value: 'CA' },
      { label: 'Texas (TX)', value: 'TX' },
      { label: 'New York (NY)', value: 'NY' },
      { label: 'Florida (FL)', value: 'FL' },
      { label: 'Illinois (IL)', value: 'IL' },
      { label: 'Pennsylvania (PA)', value: 'PA' },
      { label: 'Ohio (OH)', value: 'OH' },
      { label: 'Georgia (GA)', value: 'GA' },
      { label: 'North Carolina (NC)', value: 'NC' },
      { label: 'Michigan (MI)', value: 'MI' }
    ],
    // 运输线路
    'lane_code': [
      { label: 'CA → TX', value: 'CA→TX' },
      { label: 'CA → NY', value: 'CA→NY' },
      { label: 'TX → CA', value: 'TX→CA' },
      { label: 'NY → CA', value: 'NY→CA' },
      { label: 'FL → NY', value: 'FL→NY' }
    ],
    // 布尔值字段
    'has_contract_rate': [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    'temperature_control': [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    'hazmat_flag': [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    'insurance_required': [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ]
  }
  
  return presetOptions[fieldValue] || []
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

// 复制规则
const handleDuplicateRule = (rule: Rule) => {
  const duplicatedRule = {
    ...JSON.parse(JSON.stringify(rule)),
    id: Date.now(),
    name: `${rule.name} (Copy)`,
    enabled: false,
    lastModified: new Date().toLocaleString(),
    createdBy: 'Current User',
    modifiedBy: 'Current User'
  }
  rules.value.push(duplicatedRule)
  ElMessage.success('Rule duplicated successfully')
}

// 切换批量模式
const toggleBatchMode = () => {
  isBatchMode.value = !isBatchMode.value
  if (!isBatchMode.value) {
    selectedRules.value = []
  }
}

// 全选/取消全选
const handleSelectAll = (val: boolean) => {
  if (val) {
    selectedRules.value = filteredRules.value.map(rule => rule.id)
  } else {
    selectedRules.value = []
  }
}

// 批量启用
const handleBatchEnable = async () => {
  if (selectedRules.value.length === 0) {
    ElMessage.warning('Please select rules first')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `Enable ${selectedRules.value.length} selected rule(s)?`,
      'Confirm',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    
    selectedRules.value.forEach(id => {
      const index = rules.value.findIndex(r => r.id === id)
      if (index > -1) {
        rules.value[index].enabled = true
        rules.value[index].lastModified = new Date().toLocaleString()
      }
    })
    
    ElMessage.success(`${selectedRules.value.length} rule(s) enabled successfully`)
    selectedRules.value = []
    isBatchMode.value = false
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error enabling rules:', error)
    }
  }
}

// 批量禁用
const handleBatchDisable = async () => {
  if (selectedRules.value.length === 0) {
    ElMessage.warning('Please select rules first')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `Disable ${selectedRules.value.length} selected rule(s)?`,
      'Confirm',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    selectedRules.value.forEach(id => {
      const index = rules.value.findIndex(r => r.id === id)
      if (index > -1) {
        rules.value[index].enabled = false
        rules.value[index].lastModified = new Date().toLocaleString()
      }
    })
    
    ElMessage.success(`${selectedRules.value.length} rule(s) disabled successfully`)
    selectedRules.value = []
    isBatchMode.value = false
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error disabling rules:', error)
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRules.value.length === 0) {
    ElMessage.warning('Please select rules first')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedRules.value.length} selected rule(s)? This action cannot be undone.`,
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    rules.value = rules.value.filter(rule => !selectedRules.value.includes(rule.id))
    ElMessage.success(`${selectedRules.value.length} rule(s) deleted successfully`)
    selectedRules.value = []
    isBatchMode.value = false
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting rules:', error)
    }
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
          <el-input
            v-model="searchQuery"
            placeholder="Search rules by name, description..."
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><component :is="icons.Search" /></el-icon>
            </template>
          </el-input>
          
          <el-select 
            v-model="statusFilter" 
            placeholder="Status"
            class="status-filter"
            clearable
          >
            <el-option label="All Status" value="all" />
            <el-option label="Active" value="active">
              <div class="filter-option">
                <el-icon color="#67C23A"><component :is="icons.CircleCheck" /></el-icon>
                <span>Active</span>
              </div>
            </el-option>
            <el-option label="Inactive" value="inactive">
              <div class="filter-option">
                <el-icon color="#909399"><component :is="icons.CircleClose" /></el-icon>
                <span>Inactive</span>
              </div>
            </el-option>
          </el-select>
          
          <el-button 
            v-if="!isBatchMode"
            @click="toggleBatchMode"
            size="large"
          >
            <el-icon><component :is="icons.Operation" /></el-icon>
            Batch
          </el-button>
          
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
      <!-- Tabs -->
      <div class="rules-tabs">
        <el-tabs v-model="activeTab" class="custom-tabs">
          <el-tab-pane
            v-for="tab in TAB_OPTIONS"
            :key="tab.value"
            :name="tab.value"
          >
            <template #label>
              <div class="tab-label">
                <el-icon 
                  v-if="tab.icon" 
                  :style="{ color: tab.value === activeTab ? (tab.color || 'var(--el-color-primary)') : '' }"
                >
                  <component :is="icons[tab.icon]" />
                </el-icon>
                <span>{{ tab.label }}</span>
                <el-badge 
                  :value="getRuleCountByType(tab.value)" 
                  :type="tab.value === activeTab ? 'primary' : 'info'"
                  class="count-badge"
                />
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- Batch Mode Toolbar -->
      <div v-if="isBatchMode" class="batch-toolbar">
        <div class="batch-info">
          <el-checkbox 
            :model-value="selectedRules.length > 0 && selectedRules.length === filteredRules.length"
            :indeterminate="selectedRules.length > 0 && selectedRules.length < filteredRules.length"
            @change="handleSelectAll"
          />
          <span class="selected-count">
            {{ selectedRules.length }} of {{ filteredRules.length }} selected
          </span>
        </div>
        <div class="batch-actions">
          <el-button 
            size="small" 
            @click="handleBatchEnable"
            :disabled="selectedRules.length === 0"
          >
            <el-icon><component :is="icons.CircleCheck" /></el-icon>
            Enable
          </el-button>
          <el-button 
            size="small" 
            @click="handleBatchDisable"
            :disabled="selectedRules.length === 0"
          >
            <el-icon><component :is="icons.CircleClose" /></el-icon>
            Disable
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleBatchDelete"
            :disabled="selectedRules.length === 0"
          >
            <el-icon><component :is="icons.Delete" /></el-icon>
            Delete
          </el-button>
          <el-button 
            size="small" 
            text
            @click="toggleBatchMode"
          >
            <el-icon><component :is="icons.Close" /></el-icon>
            Cancel
          </el-button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div v-if="searchQuery && !isBatchMode" class="search-stats">
        <el-icon><component :is="icons.InfoFilled" /></el-icon>
        <span>Found {{ filteredRules.length }} rule{{ filteredRules.length !== 1 ? 's' : '' }} matching "{{ searchQuery }}"</span>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredRules.length === 0" class="empty-state">
        <el-empty :description="searchQuery ? 'No rules found matching your search' : activeTab !== 'all' ? 'No rules of this type yet' : 'No automation rules yet'">
          <el-button v-if="!searchQuery" type="primary" @click="handleCreateRule">
            <el-icon><component :is="icons.Plus" /></el-icon>
            Create Your First Rule
          </el-button>
          <el-button v-else @click="searchQuery = ''">
            <el-icon><component :is="icons.Close" /></el-icon>
            Clear Search
          </el-button>
        </el-empty>
      </div>

      <el-table
        v-else
        ref="tableRef"
        :data="filteredRules"
        style="width: 100%"
        v-loading="loading"
        row-key="id"
        :row-class-name="'draggable-row'"
        :class="{ 'is-dragging': dragging, 'batch-mode': isBatchMode }"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @sort-end="handleSort"
      >
        <!-- Selection Column (Batch Mode) -->
        <el-table-column v-if="isBatchMode" type="selection" width="55" :selectable="() => true">
          <template #default="{ row }">
            <el-checkbox 
              :model-value="selectedRules.includes(row.id)"
              @change="(val: boolean) => {
                if (val) {
                  selectedRules.push(row.id)
                } else {
                  const index = selectedRules.indexOf(row.id)
                  if (index > -1) selectedRules.splice(index, 1)
                }
              }"
            />
          </template>
        </el-table-column>

        <!-- Order Column (Normal Mode) -->
        <el-table-column v-else width="60" align="center">
          <template #default="{ row }">
            <el-icon class="drag-handle"><component :is="icons.Operation" /></el-icon>
          </template>
        </el-table-column>
        
        <!-- Rule Name & Description -->
        <el-table-column label="Rule" min-width="300">
          <template #default="{ row }">
            <div class="rule-info">
              <div class="rule-details">
                <div class="rule-name-row">
                  <span class="rule-name">{{ row.name }}</span>
                  <el-tag 
                    :type="getRuleTypeTag(getRuleType(row)).type"
                    size="small"
                    effect="plain"
                  >
                    {{ getRuleTypeTag(getRuleType(row)).label }}
                  </el-tag>
                </div>
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
        <el-table-column fixed="right" label="Operations" width="140" align="center">
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

              <el-tooltip content="Duplicate">
                <el-button 
                  type="success" 
                  link
                  @click="handleDuplicateRule(row)"
                >
                  <el-icon><component :is="icons.CopyDocument" /></el-icon>
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
      width="1400px"
      destroy-on-close
      class="rule-dialog"
      top="5vh"
    >
      <div class="rule-form-container">
        <!-- Left Sidebar -->
        <div class="rule-form-sidebar">
          <div class="sidebar-content">
            <!-- Basic Information -->
            <div class="sidebar-section">
              <div class="sidebar-section-title">
                <el-icon><component :is="icons.Document" /></el-icon>
                <span>Basic Info</span>
              </div>
              <div class="sidebar-form-group">
                <label class="sidebar-label">Rule Name <span class="required-mark">*</span></label>
                <el-input 
                  v-model="ruleForm.name" 
                  placeholder="Enter rule name"
                  size="default"
                />
              </div>
              <div class="sidebar-form-group">
                <label class="sidebar-label">Description</label>
                <el-input 
                  v-model="ruleForm.description" 
                  type="textarea"
                  :rows="2"
                  placeholder="Brief description"
                  size="default"
                />
              </div>
            </div>

            <!-- Rule Type Selection -->
            <div class="sidebar-section">
              <div class="sidebar-section-title">
                <el-icon><component :is="icons.Setting" /></el-icon>
                <span>Rule Type</span>
                <span v-if="!ruleType" class="required-badge">Required</span>
              </div>
              <el-radio-group v-model="ruleType" @change="handleRuleTypeChange" class="rule-type-radios">
                <el-radio 
                  v-for="type in RULE_TYPES"
                  :key="type.value"
                  :label="type.value"
                  class="rule-type-radio"
                >
                  <div class="radio-content">
                    <div class="radio-icon" :style="{ color: type.color }">
                      <el-icon :size="18"><component :is="icons[type.icon]" /></el-icon>
                    </div>
                    <span class="radio-text">{{ type.label }}</span>
                  </div>
                </el-radio>
              </el-radio-group>
            </div>

            <!-- Merge Rule Conditions -->
            <div v-if="ruleType === 'order_merge'" class="sidebar-section">
              <div class="sidebar-section-title">
                <el-icon><component :is="icons.Filter" /></el-icon>
                <span>Merge Conditions</span>
              </div>
              <div class="condition-groups">
                <div class="condition-group">
                  <div class="group-fields">
                    <!-- Required Conditions (disabled, checked) -->
                    <el-checkbox
                      v-for="condition in mergeRequiredConditions"
                      :key="condition.value"
                      :label="condition.value"
                      :model-value="true"
                      disabled
                      class="field-checkbox required-checkbox"
                    >
                      {{ condition.label }}
                    </el-checkbox>

                    <!-- Optional Conditions -->
                    <el-checkbox
                      v-for="condition in mergeOptionalConditions"
                      :key="condition.value"
                      :label="condition.value"
                      v-model="selectedMergeOptionalConditions"
                      class="field-checkbox"
                    >
                      {{ condition.label }}
                    </el-checkbox>
                  </div>
                </div>
              </div>
            </div>

            <!-- Other Rule Types Conditions -->
            <div v-else-if="ruleType && ruleType !== 'order_merge'" class="sidebar-section">
              <div class="sidebar-section-title">
                <el-icon><component :is="icons.Filter" /></el-icon>
                <span>Available Conditions</span>
              </div>
              <div class="condition-groups">
                <template v-for="group in (ruleType === 'shipping_rate' ? getShippingRateFieldGroups() : FIELD_GROUPS)" :key="group.key">
                  <div class="condition-group">
                    <div class="group-title">{{ group.label }}</div>
                    <div class="group-fields">
                      <el-checkbox
                        v-for="field in group.fields"
                        :key="field.value"
                        :label="field.value"
                        v-model="selectedConditionFields"
                        class="field-checkbox"
                      >
                        {{ field.label }}
                      </el-checkbox>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="rule-form-content">
          <el-form 
            ref="ruleFormRef"
            :model="ruleForm"
            label-width="140px"
            class="rule-form"
          >
        <!-- Empty State -->
        <div v-if="!ruleType" class="content-empty-state">
          <el-empty description="Please select a rule type from the left panel to continue">
            <el-icon class="empty-icon" :size="60" color="#909399">
              <component :is="icons.DocumentCopy" />
            </el-icon>
          </el-empty>
        </div>

        <!-- Conditions -->
        <div v-if="ruleType" class="form-section">
          <div class="section-header">
            <div class="section-title">
              <h3>Filter Conditions</h3>
            </div>
          </div>

          <div class="section-content">
            <!-- 合单规则专用条件 -->
            <div v-if="ruleType === 'order_merge'" class="merge-conditions-filter">
              <!-- Required Conditions Configuration -->
              <div class="required-conditions-config mb-6">
                <div class="config-header mb-4">
                  <span class="text-sm font-medium">Required Match Conditions</span>
                  <el-tag size="small" type="danger">4 mandatory</el-tag>
                </div>

                <div class="conditions-list">
                  <!-- Customer - Required -->
                  <div class="condition-item-advanced required-condition">
                    <div class="condition-header">
                      <el-switch v-model="ruleForm.actions[0].config.match_customer" disabled />
                      <div class="condition-label">
                        <span class="label-text">Same Customer</span>
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
                        <span class="label-text">Same Shipping Address</span>
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
                        <span class="label-text">Same Warehouse</span>
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
                        <span class="label-text">Same Sales Channel</span>
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
                </div>
              </div>

              <!-- Optional Conditions Configuration -->
              <div v-if="selectedMergeOptionalConditions.length > 0" class="selected-merge-conditions">
                <div class="config-header mb-4">
                  <span class="text-sm font-medium">Additional Match Conditions</span>
                  <el-tag size="small">{{ selectedMergeOptionalConditions.length }} selected</el-tag>
                </div>

                <div 
                  v-for="conditionValue in selectedMergeOptionalConditions" 
                  :key="conditionValue"
                  class="merge-condition-config-item"
                >
                  <div class="config-item-header">
                    <span class="config-item-title">
                      {{ mergeOptionalConditions.find(c => c.value === conditionValue)?.label }}
                    </span>
                    <el-button 
                      text 
                      type="danger" 
                      size="small"
                      @click="selectedMergeOptionalConditions = selectedMergeOptionalConditions.filter(c => c !== conditionValue)"
                    >
                      <el-icon><component :is="icons.Close" /></el-icon>
                    </el-button>
                  </div>
                  <div class="config-item-body">
                    <!-- Order Source 特殊配置 -->
                    <el-form-item 
                      v-if="conditionValue === 'order_source'" 
                      label="Select Order Source" 
                      class="inline-form-item"
                    >
                      <el-select
                        v-model="ruleForm.source"
                        placeholder="Select order source"
                        class="value-input"
                        size="default"
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
                      <span class="config-hint-text">💡 Select the source of orders this rule will apply to</span>
                    </el-form-item>

                    <!-- 其他可选条件的过滤值配置 -->
                    <el-form-item 
                      v-else
                      label="Filter Values (Optional)" 
                      class="inline-form-item"
                    >
                      <el-select
                        multiple
                        filterable
                        allow-create
                        placeholder="Leave empty to match all"
                        class="value-input"
                        size="default"
                      >
                        <el-option label="All (default)" value="" disabled />
                      </el-select>
                      <span class="config-hint-text">💡 Specify values to limit matching, or leave empty to match all</span>
                    </el-form-item>
                  </div>
                </div>
              </div>

            </div>

            <!-- 通用条件组（非合单规则使用） -->
            <template v-if="ruleType !== 'order_merge'">
            <!-- Selected Conditions Configuration -->
            <div v-if="selectedConditionFields.length === 0" class="no-conditions-hint">
              <el-alert
                type="info"
                :closable="false"
                show-icon
              >
                <template #title>
                  <span class="text-sm">Please select conditions from the left panel to configure</span>
                </template>
              </el-alert>
            </div>

            <div v-else class="selected-conditions-config">
              <div class="config-header mb-4">
                <span class="text-sm font-medium">Configure Selected Conditions</span>
                <el-tag size="small">{{ selectedConditionFields.length }} selected</el-tag>
              </div>

              <div 
                v-for="fieldValue in selectedConditionFields" 
                :key="fieldValue"
                class="condition-config-item"
              >
                <div class="config-item-header">
                  <span class="config-item-title">
                    {{ FIELD_GROUPS.flatMap(g => g.fields).find(f => f.value === fieldValue)?.label }}
                  </span>
                  <el-button 
                    text 
                    type="danger" 
                    size="small"
                    @click="selectedConditionFields = selectedConditionFields.filter(f => f !== fieldValue)"
                  >
                    <el-icon><component :is="icons.Close" /></el-icon>
                  </el-button>
                </div>
                <div class="config-item-body">
                  <el-form-item label="Operator" class="inline-form-item">
                    <el-select 
                      placeholder="Select operator"
                      class="operator-input"
                      size="default"
                    >
                      <el-option
                        v-for="op in getOperatorOptions(
                          FIELD_GROUPS
                            .flatMap(g => g.fields)
                            .find(f => f.value === fieldValue)?.type || ''
                        )"
                        :key="op.value"
                        :label="op.label"
                        :value="op.value"
                      />
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item label="Value" class="inline-form-item">
                    <el-select
                      v-if="getFieldOptions(fieldValue).length > 0"
                      placeholder="Select value"
                      class="value-input"
                      size="default"
                      clearable
                    >
                      <el-option
                        v-for="opt in getFieldOptions(fieldValue)"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      />
                    </el-select>
                    <el-input 
                      v-else
                      placeholder="Enter value"
                      class="value-input"
                      size="default"
                    />
                  </el-form-item>
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

              <div v-if="action.type" class="action-config">
                <!-- 合并规则专用配置 -->
                <template v-if="(action.type === 'merge_orders_so' || action.type === 'merge_orders_dn') && ruleType === 'order_merge'">
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

                  <!-- Time Window Configuration -->
                  <div class="time-window-section mb-4">
                    <div class="section-label">
                      <el-icon class="label-icon"><component :is="icons.Timer" /></el-icon>
                      <span>Time Window</span>
                      <el-tooltip content="Orders will be held and merged after the specified time window">
                        <el-icon class="help-icon"><component :is="icons.QuestionFilled" /></el-icon>
                      </el-tooltip>
                    </div>
                    <div class="time-window-config">
                      <div class="switch-row">
                        <el-switch v-model="action.config.time_window_enabled" />
                        <span class="switch-label">Hold orders for a time window before merging</span>
                      </div>
                      <div v-if="action.config.time_window_enabled" class="time-input-row">
                        <el-input-number
                          v-model="action.config.time_window_minutes"
                          :min="1"
                          :max="1440"
                          :step="5"
                        />
                        <span class="unit-label">minutes</span>
                        <span class="hint-text">Orders matching conditions will be held for this duration, then merged and released</span>
                      </div>
                    </div>
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
                <template v-else-if="action.type === 'override_warehouse' && ruleType === 'order_routing'">
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

                <template v-else-if="action.type === 'hold_order' && ruleType === 'order_hold'">
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

                <template v-else-if="action.type === 'check_inventory_hold' && ruleType === 'inventory_check'">
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

                <template v-else-if="action.type === 'update_order_field' && ruleType === 'order_update'">
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

                <template v-else-if="action.type === 'request_shipping_rate' && ruleType === 'shipping_rate'">
                  <div class="shipping-rate-config">
                    <!-- Carrier Pool Selection -->
                    <div class="config-section">
                      <div class="section-label">
                        <el-icon class="label-icon"><component :is="icons.Van" /></el-icon>
                        <span>Carrier Pool</span>
                        <span class="required-mark">*</span>
                        <el-tooltip content="Select carriers to participate in rate inquiry">
                          <el-icon class="help-icon"><component :is="icons.QuestionFilled" /></el-icon>
                        </el-tooltip>
                      </div>
                      <el-select 
                        v-model="action.config.carrier_pool" 
                        multiple 
                        placeholder="Select carriers for rate inquiry"
                        style="width: 100%"
                        size="large"
                      >
                        <el-option label="UPS" value="UPS">
                          <div class="carrier-option">
                            <span>UPS</span>
                            <span class="option-desc">United Parcel Service</span>
                          </div>
                        </el-option>
                        <el-option label="FedEx" value="FedEx">
                          <div class="carrier-option">
                            <span>FedEx</span>
                            <span class="option-desc">Federal Express</span>
                          </div>
                        </el-option>
                        <el-option label="USPS" value="USPS">
                          <div class="carrier-option">
                            <span>USPS</span>
                            <span class="option-desc">United States Postal Service</span>
                          </div>
                        </el-option>
                        <el-option label="DHL" value="DHL">
                          <div class="carrier-option">
                            <span>DHL</span>
                            <span class="option-desc">DHL Express</span>
                          </div>
                        </el-option>
                        <el-option label="OnTrac" value="OnTrac">
                          <div class="carrier-option">
                            <span>OnTrac</span>
                            <span class="option-desc">Regional Carrier (West Coast)</span>
                          </div>
                        </el-option>
                        <el-option label="LaserShip" value="LaserShip">
                          <div class="carrier-option">
                            <span>LaserShip</span>
                            <span class="option-desc">Regional Carrier (East Coast)</span>
                          </div>
                        </el-option>
                        <el-option label="Echo" value="Echo">
                          <div class="carrier-option">
                            <span>Echo</span>
                            <span class="option-desc">Echo Global Logistics</span>
                          </div>
                        </el-option>
                        <el-option label="SWFT" value="SWFT">
                          <div class="carrier-option">
                            <span>SWFT</span>
                            <span class="option-desc">Swift Transportation</span>
                          </div>
                        </el-option>
                      </el-select>
                    </div>

                    <!-- Inquiry Method -->
                    <div class="config-section">
                      <div class="section-label">
                        <el-icon class="label-icon"><component :is="icons.Connection" /></el-icon>
                        <span>Inquiry Method</span>
                        <span class="required-mark">*</span>
                      </div>
                      <el-select 
                        v-model="action.config.inquiry_method" 
                        placeholder="Select inquiry method"
                        style="width: 100%"
                        size="large"
                      >
                        <el-option value="API">
                          <div class="mode-option">
                            <div class="mode-option-header">
                              <span class="mode-option-label">API (Real-time)</span>
                              <el-tag size="small" type="success">Recommended</el-tag>
                            </div>
                            <div class="mode-option-desc">Call carrier API for real-time rates</div>
                          </div>
                        </el-option>
                        <el-option value="Email">
                          <div class="mode-option">
                            <div class="mode-option-header">
                              <span class="mode-option-label">Email</span>
                            </div>
                            <div class="mode-option-desc">Send email inquiry to carrier</div>
                          </div>
                        </el-option>
                        <el-option value="Mock">
                          <div class="mode-option">
                            <div class="mode-option-header">
                              <span class="mode-option-label">Mock (Testing)</span>
                              <el-tag size="small" type="warning">Dev Only</el-tag>
                            </div>
                            <div class="mode-option-desc">Use internal mock rates for testing</div>
                          </div>
                        </el-option>
                      </el-select>
                    </div>

                    <!-- Timeout & Limits -->
                    <div class="config-section">
                      <div class="section-label">
                        <el-icon class="label-icon"><component :is="icons.Timer" /></el-icon>
                        <span>Timeout & Limits</span>
                      </div>
                      <div class="config-grid">
                        <div class="config-item">
                          <label class="config-label">Timeout (Minutes)</label>
                          <el-input-number 
                            v-model="action.config.timeout_min" 
                            :min="1" 
                            :max="120"
                            style="width: 100%"
                          />
                          <span class="config-hint">Carrier response timeout threshold</span>
                        </div>
                        <div class="config-item">
                          <label class="config-label">Max Carrier Count</label>
                          <el-input-number 
                            v-model="action.config.max_carrier_count" 
                            :min="1" 
                            :max="10"
                            style="width: 100%"
                          />
                          <span class="config-hint">Limit simultaneous carrier inquiries</span>
                        </div>
                      </div>
                    </div>

                    <!-- Service Types -->
                    <div class="config-section">
                      <div class="section-label">
                        <el-icon class="label-icon"><component :is="icons.Stopwatch" /></el-icon>
                        <span>Service Types</span>
                        <span class="required-mark">*</span>
                      </div>
                      <el-select 
                        v-model="action.config.service_types" 
                        multiple 
                        placeholder="Select shipping service types"
                        style="width: 100%"
                        size="large"
                      >
                        <el-option label="Ground" value="ground" />
                        <el-option label="Express" value="express" />
                        <el-option label="2-Day" value="2day" />
                        <el-option label="Overnight" value="overnight" />
                        <el-option label="Standard" value="standard" />
                        <el-option label="Economy" value="economy" />
                      </el-select>
                    </div>

                    <!-- Package Dimensions -->
                    <div class="config-section">
                      <div class="section-label">
                        <el-icon class="label-icon"><component :is="icons.Box" /></el-icon>
                        <span>Package Dimensions</span>
                        <span class="required-mark">*</span>
                      </div>
                      <div class="dimensions-grid">
                        <div class="dimension-item">
                          <label class="config-label">Length (inches)</label>
                          <el-input-number 
                            v-model="action.config.package_dimensions.length" 
                            :min="0" 
                            :precision="2"
                            style="width: 100%"
                          />
                        </div>
                        <div class="dimension-item">
                          <label class="config-label">Width (inches)</label>
                          <el-input-number 
                            v-model="action.config.package_dimensions.width" 
                            :min="0" 
                            :precision="2"
                            style="width: 100%"
                          />
                        </div>
                        <div class="dimension-item">
                          <label class="config-label">Height (inches)</label>
                          <el-input-number 
                            v-model="action.config.package_dimensions.height" 
                            :min="0" 
                            :precision="2"
                            style="width: 100%"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Weight Configuration -->
                    <div class="config-section">
                      <div class="section-label">
                        <el-icon class="label-icon"><component :is="icons.ScaleToOriginal" /></el-icon>
                        <span>Weight Configuration</span>
                        <span class="required-mark">*</span>
                      </div>
                      <div class="weight-config">
                        <div class="config-item">
                          <label class="config-label">Actual Weight (lbs)</label>
                          <el-input-number 
                            v-model="action.config.weight_config.actual_weight" 
                            :min="0" 
                            :precision="2"
                            style="width: 100%"
                          />
                        </div>
                        <div class="config-item">
                          <div class="boolean-field">
                            <el-switch v-model="action.config.weight_config.use_dimensional_weight" />
                            <span class="boolean-label">Use Dimensional Weight</span>
                          </div>
                          <span class="config-hint">Calculate dimensional weight (L×W×H÷divisor) and use the greater of actual or dimensional weight</span>
                        </div>
                        <div v-if="action.config.weight_config.use_dimensional_weight" class="config-item">
                          <label class="config-label">Dimensional Divisor</label>
                          <el-input-number 
                            v-model="action.config.weight_config.dim_divisor" 
                            :min="1" 
                            style="width: 100%"
                          />
                          <span class="config-hint">Standard divisor: 139 (domestic), 166 (international)</span>
                        </div>
                      </div>
                    </div>

                    <!-- Shipping Mode -->
                    <div class="config-section">
                      <div class="section-label">
                        <el-icon class="label-icon"><component :is="icons.TruckFilled" /></el-icon>
                        <span>Shipping Mode</span>
                        <span class="required-mark">*</span>
                        <el-tooltip content="Select appropriate shipping mode based on weight and size">
                          <el-icon class="help-icon"><component :is="icons.QuestionFilled" /></el-icon>
                        </el-tooltip>
                      </div>
                      <el-select 
                        v-model="action.config.shipping_mode" 
                        placeholder="Select shipping mode"
                        style="width: 100%"
                        size="large"
                      >
                        <el-option value="parcel">
                          <div class="mode-option">
                            <div class="mode-option-header">
                              <span class="mode-option-label">Parcel (Small Package)</span>
                              <el-tag size="small" type="success">Most Common</el-tag>
                            </div>
                            <div class="mode-option-desc">For packages under 150 lbs, typical e-commerce shipments</div>
                          </div>
                        </el-option>
                        <el-option value="ltl">
                          <div class="mode-option">
                            <div class="mode-option-header">
                              <span class="mode-option-label">LTL (Less Than Truckload)</span>
                            </div>
                            <div class="mode-option-desc">For freight 150-15,000 lbs, palletized shipments</div>
                          </div>
                        </el-option>
                        <el-option value="ftl">
                          <div class="mode-option">
                            <div class="mode-option-header">
                              <span class="mode-option-label">FTL (Full Truckload)</span>
                            </div>
                            <div class="mode-option-desc">For freight over 15,000 lbs or 10+ pallets</div>
                          </div>
                        </el-option>
                      </el-select>
                    </div>

                    <!-- LTL/FTL Specific Configuration -->
                    <div v-if="action.config.shipping_mode === 'ltl' || action.config.shipping_mode === 'ftl'" class="config-section freight-config">
                      <div class="section-label">
                        <el-icon class="label-icon"><component :is="icons.Box" /></el-icon>
                        <span>Freight Configuration</span>
                      </div>
                      
                      <!-- Freight Class for LTL -->
                      <div v-if="action.config.shipping_mode === 'ltl'" class="config-item">
                        <label class="config-label">Freight Class (NMFC)</label>
                        <el-select 
                          v-model="action.config.freight_class" 
                          placeholder="Select freight class"
                          style="width: 100%"
                          filterable
                        >
                          <el-option label="Class 50 - Clean freight" value="50" />
                          <el-option label="Class 55 - Bricks, cement" value="55" />
                          <el-option label="Class 60 - Car parts" value="60" />
                          <el-option label="Class 65 - Bottled beverages" value="65" />
                          <el-option label="Class 70 - Food items" value="70" />
                          <el-option label="Class 77.5 - Tires" value="77.5" />
                          <el-option label="Class 85 - Crated machinery" value="85" />
                          <el-option label="Class 92.5 - Computers" value="92.5" />
                          <el-option label="Class 100 - Boat covers" value="100" />
                          <el-option label="Class 110 - Cabinets" value="110" />
                          <el-option label="Class 125 - Small appliances" value="125" />
                          <el-option label="Class 150 - Auto parts" value="150" />
                          <el-option label="Class 175 - Clothing" value="175" />
                          <el-option label="Class 200 - Auto sheet metal" value="200" />
                          <el-option label="Class 250 - Bamboo furniture" value="250" />
                          <el-option label="Class 300 - Wood cabinets" value="300" />
                          <el-option label="Class 400 - Deer antlers" value="400" />
                          <el-option label="Class 500 - Bags of gold dust" value="500" />
                        </el-select>
                        <span class="config-hint">💡 Freight class affects pricing - based on density and handling</span>
                      </div>

                      <!-- Pallet Count -->
                      <div class="config-item">
                        <label class="config-label">Pallet Count</label>
                        <el-input-number 
                          v-model="action.config.pallet_count" 
                          :min="1" 
                          style="width: 100%"
                        />
                      </div>

                      <!-- Stackable -->
                      <div class="config-item">
                        <div class="boolean-field">
                          <el-switch v-model="action.config.stackable" />
                          <span class="boolean-label">Pallets are Stackable</span>
                        </div>
                        <span class="config-hint">Non-stackable freight may incur additional charges</span>
                      </div>

                      <!-- Liftgate Required -->
                      <div class="config-item">
                        <div class="boolean-field">
                          <el-switch v-model="action.config.liftgate_required" />
                          <span class="boolean-label">Liftgate Service Required</span>
                        </div>
                        <span class="config-hint">Required if delivery location has no loading dock</span>
                      </div>
                    </div>

                    <!-- 使用通用配置显示所有字段 -->
                    <!-- 这些字段将通过 getActionConfigFields 自动渲染 -->
                  </div>
                </template>

                <!-- Custom 类型或其他未匹配的类型：显示通用配置 -->
                <template v-else v-for="field in getActionConfigFields(action.type)" :key="field.name">
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
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" size="large">Cancel</el-button>
          <el-button
            type="primary"
            :loading="saving"
            @click="handleSaveRule"
            size="large"
            :disabled="!ruleType"
          >
            <el-icon v-if="!saving"><component :is="icons.Check" /></el-icon>
            {{ editingRule ? 'Update Rule' : 'Create Rule' }}
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

/* Tabs Styling */
.rules-tabs {
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.custom-tabs {
  margin-top: 0;
}

.custom-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  border-bottom: none;
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.custom-tabs :deep(.el-tabs__item) {
  transition: all 0.3s ease;
  border-radius: 4px 4px 0 0;
}

.custom-tabs :deep(.el-tabs__item:hover) {
  background-color: var(--el-fill-color-light);
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  background-color: var(--el-fill-color);
  font-weight: 600;
}

.custom-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px 3px 0 0;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 14px;
  transition: all 0.3s ease;
}

.tab-label .el-icon {
  font-size: 16px;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.el-tabs__item.is-active) .tab-label .el-icon {
  transform: scale(1.1);
}

.count-badge {
  margin-left: 4px;
}

.count-badge :deep(.el-badge__content) {
  font-size: 11px;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
  font-weight: 600;
}

/* Search Stats Bar */
.search-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(90deg, rgba(64, 158, 255, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.search-stats .el-icon {
  color: var(--el-color-primary);
  font-size: 16px;
}

.search-stats span {
  font-weight: 500;
}

/* Batch Mode Toolbar */
.batch-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: linear-gradient(90deg, rgba(103, 194, 58, 0.08) 0%, transparent 100%);
  border-bottom: 1px solid var(--el-color-success-light-7);
}

.batch-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-color-success-dark-2);
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.batch-actions .el-button {
  margin: 0;
}

/* Batch Mode Table Styles */
.el-table.batch-mode :deep(.el-table__row) {
  cursor: default;
  transition: all 0.2s ease;
}

.el-table.batch-mode :deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-light);
  transform: translateX(2px);
}

.el-table.batch-mode :deep(.el-table__row.selected) {
  background-color: var(--el-color-success-light-9);
  border-left: 3px solid var(--el-color-success);
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

/* Table Row Animations */
:deep(.el-table__body tr) {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* Loading State */
.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

/* Tooltip Enhancements */
.el-tooltip__popper {
  font-size: 13px;
  padding: 8px 12px;
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

.rule-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.rule-details {
  flex: 1;
}

.rule-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.rule-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
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
.time-window-section {
  padding: 20px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.time-window-section:hover {
  border-color: var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

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
  font-weight: 500;
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
  line-height: 1.5;
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

/* 弹窗样式增强 */
.rule-dialog {
  max-width: 95vw;
}

.rule-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.rule-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.rule-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: var(--el-fill-color-lighter);
}

.rule-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
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

/* Rule Dialog - Left-Right Layout */
.rule-form-container {
  display: flex;
  min-height: 70vh;
  max-height: 75vh;
  margin: -20px;
  gap: 0;
}

.rule-form-sidebar {
  width: 320px;
  background: var(--el-fill-color-lighter);
  border-right: 1px solid var(--el-border-color-lighter);
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-content {
  padding: 20px 16px;
}

.sidebar-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.sidebar-section:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.sidebar-form-group {
  margin-bottom: 16px;
}

.sidebar-form-group:last-child {
  margin-bottom: 0;
}

.sidebar-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.sidebar-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.sidebar-section-title .el-icon {
  color: var(--el-color-primary);
  font-size: 16px;
}

.required-badge {
  margin-left: auto;
  font-size: 11px;
  padding: 2px 8px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
  border-radius: 10px;
  font-weight: 500;
}

/* Rule Type Radios */
.rule-type-radios {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.rule-type-radios :deep(.el-radio) {
  margin-right: 0;
  height: auto;
  white-space: normal;
}

.rule-type-radio {
  width: 100%;
  margin: 0 !important;
}

.rule-type-radio :deep(.el-radio__label) {
  width: 100%;
  padding: 0;
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
  transition: all 0.2s ease;
  width: 100%;
  border-radius: 4px;
}

.rule-type-radio:hover .radio-content {
  background: var(--el-fill-color);
}

.rule-type-radio :deep(.el-radio__input.is-checked) + .el-radio__label .radio-content {
  background: var(--el-fill-color);
}

.radio-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radio-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  flex: 1;
}

/* Condition Groups */
.condition-groups {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 4px;
}

.condition-groups::-webkit-scrollbar {
  width: 4px;
}

.condition-groups::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 2px;
}

.condition-group {
  margin-bottom: 16px;
}

.condition-group:last-child {
  margin-bottom: 0;
}

.group-fields {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 8px;
}

.field-checkbox {
  margin: 0 !important;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.field-checkbox:hover {
  background: var(--el-fill-color-lighter);
}

.field-checkbox :deep(.el-checkbox__label) {
  font-size: 12px;
  color: var(--el-text-color-regular);
  white-space: normal;
  line-height: 1.4;
}

/* Required Checkbox Style */
.required-checkbox {
  background: var(--el-color-success-light-9);
  border-radius: 4px;
  padding: 6px 8px !important;
}

.required-checkbox :deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
}

.required-checkbox :deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

.required-checkbox :deep(.el-checkbox__label) {
  color: var(--el-text-color-regular) !important;
}

.group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
  padding: 4px 8px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

/* Merge Condition Config Items */
.selected-merge-conditions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.merge-condition-config-item {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.merge-condition-config-item:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.merge-condition-config-item .config-item-body {
  padding: 16px;
  grid-template-columns: 1fr;
}

.config-hint-text {
  display: block;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
  line-height: 1.5;
}

.required-conditions-info {
  margin-bottom: 20px;
}


.rule-form-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: var(--el-bg-color);
}

.rule-form-content::-webkit-scrollbar {
  width: 6px;
}

.rule-form-content::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}

.rule-form-content::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
}

/* Right Content Empty State */
.content-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.content-empty-state .empty-icon {
  margin-bottom: 20px;
}

/* Selected Conditions Configuration */
.no-conditions-hint {
  margin-bottom: 20px;
}

.selected-conditions-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.condition-config-item {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.condition-config-item:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.config-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--el-fill-color-lighter);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.config-item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.config-item-body {
  padding: 16px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  align-items: start;
}

.inline-form-item {
  margin-bottom: 0;
}

.inline-form-item :deep(.el-form-item__label) {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.operator-input {
  width: 100%;
}

.value-input {
  width: 100%;
}

/* 调整表单区域样式 */
.rule-form .form-section {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 0;
}

.rule-form .section-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-lighter);
  border-radius: 8px 8px 0 0;
}

.rule-form .section-content {
  padding: 20px;
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
  margin-top: 0;
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

/* Shipping Rate Config Styles */
.shipping-rate-config {
  padding: 20px 0;
  background: transparent;
  border-radius: 8px;
}

.config-section {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.config-section:hover {
  border-color: var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.carrier-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.carrier-option .option-desc {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .dimensions-grid {
    grid-template-columns: 1fr;
  }
}

.dimension-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weight-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.approval-threshold-config {
  display: flex;
  align-items: center;
  gap: 16px;
}

.threshold-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.approval-workflow-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Shipping Mode Options */
.mode-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
}

.mode-option-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-option-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.mode-option-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

/* Freight Config */
.freight-config {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 152, 0, 0.05) 100%);
  border-color: var(--el-color-warning-light-7);
}

.freight-config .section-label {
  color: var(--el-color-warning-dark-2);
}

/* Shipping Rate Hint */
.shipping-rate-hint {
  margin-bottom: 16px;
}

.shipping-rate-hint :deep(.el-alert__title) {
  line-height: 1.6;
}

/* Responsive Styles for Search and Tabs */
@media (max-width: 1024px) {
  .action-section {
    flex-wrap: wrap;
  }

  .search-input {
    width: 240px;
  }

  .status-filter {
    width: 130px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .action-section {
    width: 100%;
    margin-left: 0;
    flex-direction: column;
  }

  .search-input,
  .status-filter {
    width: 100%;
  }

  .action-section .el-button {
    width: 100%;
  }

  .rules-tabs {
    padding: 0 12px;
  }

  .custom-tabs :deep(.el-tabs__nav) {
    display: flex;
    flex-wrap: wrap;
  }

  .tab-label {
    font-size: 12px;
    gap: 4px;
  }

  .tab-label .el-icon {
    font-size: 14px;
  }

  .count-badge :deep(.el-badge__content) {
    font-size: 10px;
    padding: 0 4px;
    height: 16px;
    line-height: 16px;
  }

  /* Batch Toolbar Mobile */
  .batch-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .batch-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .batch-actions .el-button {
    flex: 1;
  }

  /* Dialog Responsive */
  .rule-dialog :deep(.el-dialog) {
    width: 98% !important;
  }

  .rule-form-container {
    flex-direction: column;
    min-height: auto;
    max-height: none;
  }

  .rule-form-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--el-border-color-lighter);
    max-height: 40vh;
  }

  .rule-type-radios {
    gap: 6px;
  }

  .radio-content {
    padding: 8px 10px;
  }

  .radio-text {
    font-size: 12px;
  }

  .condition-groups {
    max-height: 400px;
  }

  .config-item-body {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .rule-form-content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .sidebar-content {
    padding: 16px 12px;
  }

  .sidebar-section {
    margin-bottom: 16px;
    padding-bottom: 16px;
  }

  .sidebar-label {
    font-size: 12px;
  }

  .radio-icon {
    width: 20px;
    height: 20px;
  }
}
</style> 