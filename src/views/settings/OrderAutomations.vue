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

// 编辑规则
const handleEditRule = async (rule: Rule) => {
  editingRule.value = rule
  ruleForm.value = JSON.parse(JSON.stringify(rule))
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

// 添加动作
const handleAddAction = () => {
  ruleForm.value.actions.push({
    type: '',
    config: {},
    order: ruleForm.value.actions.length,
  })
}

// 移除动作
const removeAction = (actionIndex: number) => {
  if (ruleForm.value.actions.length <= 1) {
    ElMessage.warning('At least one action is required')
    return
  }
  ruleForm.value.actions.splice(actionIndex, 1)
}

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
  for (const group of ACTION_GROUPS) {
    const action = group.actions.find(a => a.value === actionType)
    if (action?.config?.fields) {
      return action.config.fields
    }
  }
  return []
}

// 处理动作类型变化
const handleActionTypeChange = (actionIndex: number) => {
  const action = ruleForm.value.actions[actionIndex]
  if (action.type) {
    // 如果动作类型已改变，则清空配置
    action.config = {}
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
      width="80%"
      destroy-on-close
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

        <!-- Conditions -->
        <div class="form-section">
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

            <!-- Condition Groups -->
            <div class="filter-label mb-4">
              <span class="text-sm font-medium">Filter Conditions</span>
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
          </div>
        </div>

        <!-- Actions -->
        <div class="form-section">
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
                    >
                      <div>
                        <div>{{ act.label }}</div>
                        <div class="text-gray-400 text-xs">{{ act.description }}</div>
                      </div>
                    </el-option>
                  </el-option-group>
                </el-select>

                <el-button
                  type="danger"
                  link
                  @click="removeAction(actionIndex)"
                >
                  <el-icon><component :is="icons.Delete" /></el-icon>
                </el-button>
              </div>

              <div v-if="action.type" class="action-config">
                <template v-for="field in getActionConfigFields(action.type)" :key="field.name">
                  <div class="config-field">
                    <label class="field-label">
                      {{ field.label }}
                      <span v-if="field.required" class="text-red-500">*</span>
                      <el-tooltip v-if="field.description" :content="field.description">
                        <el-icon><component :is="icons.InfoFilled" /></el-icon>
                      </el-tooltip>
                    </label>

                    <template v-if="field.type === 'string'">
                      <el-input 
                        v-model="action.config[field.name]"
                        :placeholder="field.label"
                      />
                    </template>

                    <template v-else-if="field.type === 'number'">
                      <el-input-number
                        v-model="action.config[field.name]"
                        :min="field.min"
                        :max="field.max"
                        :placeholder="field.label"
                      />
                    </template>

                    <template v-else-if="field.type === 'boolean'">
                      <el-switch
                        v-model="action.config[field.name]"
                        :active-text="field.label"
                        :default-value="field.default"
                      />
                    </template>

                    <template v-else-if="field.type === 'enum'">
                      <el-select 
                        v-model="action.config[field.name]"
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

                    <template v-else-if="field.type === 'date'">
                      <el-date-picker
                        v-model="action.config[field.name]"
                        type="date"
                        :placeholder="field.label"
                      />
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

                            <template v-else-if="subField.type === 'date'">
                              <el-date-picker
                                v-model="action.config[field.name][subField.name]"
                                type="date"
                                :placeholder="subField.label"
                              />
                            </template>
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </div>

            <el-button
              type="primary"
              link
              @click="handleAddAction"
            >
              <el-icon><component :is="icons.Plus" /></el-icon>
              Add Action
            </el-button>
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
  background: var(--el-bg-color);
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid var(--el-border-color-light);
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
</style> 