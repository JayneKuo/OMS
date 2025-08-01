/// <reference types="element-plus/global" />
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Rule, Condition, ConditionGroup, Action } from '@/types/automation'
import { FIELD_GROUPS, OPERATOR_OPTIONS, ACTION_GROUPS } from '@/constants/automation'
import { mockResponse } from '@/mock/automationRules'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 图标组件
const icons = ElementPlusIconsVue

// 组件引用
const ruleFormRef = ref<FormInstance>()

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
  modifiedBy: ''
})

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
    modifiedBy: ''
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
onMounted(() => {
  loadRules()
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
        :data="rules"
        style="width: 100%"
        v-loading="loading"
      >
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
            <div class="status-section">
              <el-switch
                v-model="row.enabled"
                :active-value="true"
                :inactive-value="false"
                @change="() => handleStatusChange(row)"
              />
              <el-tag 
                :type="row.enabled ? 'success' : 'info'"
                size="small"
                class="status-tag"
              >
                {{ row.enabled ? 'Active' : 'Inactive' }}
              </el-tag>
            </div>
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
              <h3>Conditions</h3>
              <p class="text-gray-500">Define when this rule should be triggered</p>
            </div>
          </div>

          <div class="section-content">
            <div 
              v-for="(group, groupIndex) in ruleForm.conditions" 
              :key="groupIndex"
              class="condition-group"
            >
              <div class="group-header">
                <div class="flex items-center gap-4">
                  <el-select v-model="group.operator" class="w-40">
                    <el-option label="Match ALL conditions" value="all" />
                    <el-option label="Match ANY condition" value="any" />
                  </el-select>
                </div>
              </div>

              <div class="conditions-container">
                <div 
                  v-for="(condition, condIndex) in group.conditions" 
                  :key="condIndex"
                  class="condition-row"
                >
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
                        <div>
                          <div>{{ field.label }}</div>
                          <div class="text-gray-400 text-xs">{{ field.description }}</div>
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
                    >
                      <div>
                        <div>{{ op.label }}</div>
                        <div class="text-gray-400 text-xs">{{ op.description }}</div>
                        <div class="text-gray-400 text-xs">Example: {{ op.example }}</div>
                      </div>
                    </el-option>
                  </el-select>

                  <el-input 
                    v-model="condition.value" 
                    placeholder="Enter value"
                    class="value-input"
                  />

                  <el-button
                    type="danger"
                    link
                    @click="removeCondition(groupIndex, condIndex)"
                  >
                    <el-icon><component :is="icons.Delete" /></el-icon>
                  </el-button>
                </div>

                <el-button
                  type="primary"
                  link
                  @click="handleAddCondition(groupIndex)"
                >
                  <el-icon><component :is="icons.Plus" /></el-icon>
                  Add Condition
                </el-button>
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

.status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.status-tag {
  min-width: 64px;
  text-align: center;
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

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color);
  border-radius: 4px 4px 0 0;
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
</style> 