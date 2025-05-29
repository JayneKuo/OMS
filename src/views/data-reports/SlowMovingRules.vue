<!-- 滞销品规则设置组件 -->
<template>
  <div class="slow-moving-rules">
    <el-card class="rule-list-card">
      <template #header>
        <div class="card-header">
          <span class="title">滞销规则列表</span>
          <el-button type="primary" @click="handleAddRule">新增规则</el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="规则名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入规则名称"
              clearable
              @clear="handleSearch"
            />
          </el-form-item>
          <el-form-item label="商品类目">
            <el-select
              v-model="searchForm.categories"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择商品类目"
              clearable
              @clear="handleSearch"
              class="search-select"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="适用仓库">
            <el-select
              v-model="searchForm.warehouses"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择仓库"
              clearable
              @clear="handleSearch"
              class="search-select"
            >
              <el-option
                v-for="item in warehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="规则状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
              @clear="handleSearch"
              class="search-select"
            >
              <el-option label="启用" value="active" />
              <el-option label="停用" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 表格区域 -->
      <el-table 
        :data="displayRuleList" 
        border 
        stripe
        v-loading="tableLoading"
        class="rule-table"
      >
        <el-table-column prop="baseInfo.name" label="规则名称" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="rule-name-cell">
              <span>{{ row.baseInfo.name }}</span>
              <el-tag size="small" :type="row.baseInfo.priority <= 30 ? 'danger' : row.baseInfo.priority <= 60 ? 'warning' : 'info'" class="priority-tag">
                P{{ row.baseInfo.priority }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="适用范围" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="scope-cell">
              <el-tooltip 
                v-if="row.baseInfo.categories.length" 
                :content="getCategoryLabels(row.baseInfo.categories)"
              >
                <div class="scope-item">
                  <el-icon><Goods /></el-icon>
                  {{ row.baseInfo.categories.length }}个类目
                </div>
              </el-tooltip>
              <el-tooltip 
                v-if="row.baseInfo.warehouses.length"
                :content="getWarehouseLabels(row.baseInfo.warehouses)"
              >
                <div class="scope-item">
                  <el-icon><House /></el-icon>
                  {{ row.baseInfo.warehouses.length }}个仓库
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="生效时间" min-width="200">
          <template #default="{ row }">
            <div v-if="row.baseInfo.effectiveTime?.length === 2">
              {{ formatDate(row.baseInfo.effectiveTime[0]) }} 至 {{ formatDate(row.baseInfo.effectiveTime[1]) }}
            </div>
            <el-tag v-else type="info" size="small">未设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="规则条件" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip
              :content="formatConditions(row.conditionGroups)"
              placement="top"
            >
              <div class="condition-cell">
                {{ getConditionSummary(row.conditionGroups) }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="动作" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip
              :content="formatActions(row.actions)"
              placement="top"
            >
              <div class="actions-cell">
                <el-tag 
                  v-for="(action, index) in row.actions" 
                  :key="index"
                  size="small"
                  :type="getActionTagType(action.type)"
                  class="action-tag"
                >
                  {{ getActionLabel(action.type) }}
                </el-tag>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="baseInfo.isEnabled" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.baseInfo.isEnabled ? 'success' : 'info'" class="status-tag">
              {{ row.baseInfo.isEnabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleEditRule(row)">编辑</el-button>
              <el-button type="primary" link @click="handleToggleStatus(row)">
                {{ row.baseInfo.isEnabled ? '停用' : '启用' }}
              </el-button>
              <el-button type="danger" link @click="handleDeleteRule(row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalRules"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 规则编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingRule ? '编辑规则' : '新增规则'"
      width="65%"
      class="rule-dialog"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="rule-form">
        <!-- 基础信息卡片 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">基础信息</span>
            <el-tooltip content="配置规则的基本属性和适用范围">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
          
          <div class="section-content">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="规则名称" prop="baseInfo.name">
                  <el-input 
                    v-model="ruleForm.baseInfo.name" 
                    placeholder="请输入规则名称，如：临期食品处理"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="优先级" prop="baseInfo.priority">
                  <el-input-number 
                    v-model="ruleForm.baseInfo.priority" 
                    :min="1" 
                    :max="100"
                    placeholder="数值越小优先级越高"
                    class="w-full"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="规则描述">
              <el-input 
                v-model="ruleForm.baseInfo.description" 
                type="textarea" 
                rows="2"
                placeholder="请简要说明规则用途或适用场景"
              />
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="适用类目" prop="baseInfo.categories">
                  <el-select 
                    v-model="ruleForm.baseInfo.categories" 
                    multiple 
                    placeholder="请选择适用商品类目"
                    class="w-full"
                  >
                    <el-option
                      v-for="item in categoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适用品牌" prop="baseInfo.brands">
                  <el-select 
                    v-model="ruleForm.baseInfo.brands" 
                    multiple 
                    placeholder="请选择适用品牌"
                    class="w-full"
                  >
                    <el-option
                      v-for="item in brandOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="适用仓库" prop="baseInfo.warehouses">
                  <el-select 
                    v-model="ruleForm.baseInfo.warehouses" 
                    multiple 
                    placeholder="请选择适用仓库"
                    class="w-full"
                  >
                    <el-option
                      v-for="item in warehouseOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生效时间" prop="baseInfo.effectiveTime">
                  <el-date-picker
                    v-model="ruleForm.baseInfo.effectiveTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="w-full"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="是否启用">
              <el-switch
                v-model="ruleForm.baseInfo.isEnabled"
                active-text="启用"
                inactive-text="停用"
              />
            </el-form-item>
          </div>
        </div>

        <!-- 规则条件区域 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">规则条件</span>
            <el-tooltip content="配置触发规则的条件组合">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>

          <div class="section-content">
            <div class="condition-groups">
              <div 
                v-for="(group, groupIndex) in ruleForm.conditionGroups" 
                :key="groupIndex" 
                class="condition-group"
              >
                <div class="group-header">
                  <span class="group-title">条件组 {{ groupIndex + 1 }}</span>
                  <div class="group-actions">
                    <el-radio-group v-model="group.relation" size="small">
                      <el-radio-button label="AND">且</el-radio-button>
                      <el-radio-button label="OR">或</el-radio-button>
                    </el-radio-group>
                    <el-button 
                      type="danger" 
                      link 
                      @click="removeConditionGroup(groupIndex)"
                      :disabled="ruleForm.conditionGroups.length === 1"
                    >
                      删除组
                    </el-button>
                  </div>
                </div>

                <div 
                  v-for="(condition, index) in group.conditions" 
                  :key="index" 
                  class="condition-item"
                >
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-select 
                        v-model="condition.field" 
                        placeholder="选择条件字段"
                        class="w-full"
                        @change="handleFieldChange(condition)"
                      >
                        <el-option-group
                          v-for="group in fieldOptions"
                          :key="group.label"
                          :label="group.label"
                        >
                          <el-option
                            v-for="item in group.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-option-group>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-select 
                        v-model="condition.operator" 
                        placeholder="选择运算符"
                        class="w-full"
                      >
                        <el-option label="等于" value="=" />
                        <el-option label="大于" value=">" />
                        <el-option label="大于等于" value=">=" />
                        <el-option label="小于" value="<" />
                        <el-option label="小于等于" value="<=" />
                        <el-option label="不等于" value="!=" />
                        <el-option label="包含" value="in" v-if="condition.valueType === 'select'" />
                        <el-option label="不包含" value="not in" v-if="condition.valueType === 'select'" />
                        <el-option label="介于" value="between" v-if="condition.valueType === 'number' || condition.valueType === 'date'" />
                      </el-select>
                    </el-col>
                    <el-col :span="7">
                      <template v-if="condition.valueType === 'number'">
                        <el-input-number 
                          v-model="condition.value" 
                          class="w-full" 
                          :controls="false"
                          placeholder="请输入数值"
                        />
                      </template>
                      <template v-else-if="condition.valueType === 'percentage'">
                        <el-input-number 
                          v-model="condition.value" 
                          class="w-full"
                          :controls="false"
                          :min="0"
                          :max="100"
                          placeholder="请输入百分比"
                        >
                          <template #suffix>%</template>
                        </el-input-number>
                      </template>
                      <template v-else-if="condition.valueType === 'date'">
                        <el-date-picker 
                          v-model="condition.value"
                          type="date"
                          placeholder="选择日期"
                          class="w-full"
                        />
                      </template>
                      <template v-else-if="condition.valueType === 'select' && condition.options">
                        <el-select
                          v-model="condition.value"
                          class="w-full"
                          placeholder="请选择"
                          :multiple="condition.operator === 'in' || condition.operator === 'not in'"
                        >
                          <el-option
                            v-for="opt in condition.options"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          />
                        </el-select>
                      </template>
                      <template v-else>
                        <el-input 
                          v-model="condition.value" 
                          class="w-full"
                          placeholder="请输入值"
                        />
                      </template>
                    </el-col>
                    <el-col :span="3" class="flex items-center justify-end">
                      <el-button 
                        type="danger" 
                        link 
                        @click="removeCondition(groupIndex, index)"
                        :disabled="group.conditions.length === 1"
                      >
                        删除
                      </el-button>
                    </el-col>
                  </el-row>
                </div>

                <div class="group-footer">
                  <el-button type="primary" link @click="addCondition(groupIndex)">
                    <el-icon><Plus /></el-icon> 添加条件
                  </el-button>
                </div>
              </div>
            </div>

            <div class="add-group-action">
              <el-button type="primary" @click="addConditionGroup">
                <el-icon><Plus /></el-icon> 添加条件组
              </el-button>
              <span class="group-tip">不同条件组之间为"或"的关系</span>
            </div>
          </div>
        </div>

        <!-- 动作配置区域 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">动作配置</span>
            <el-tooltip content="配置规则触发后要执行的操作">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>

          <div class="section-content">
            <div class="actions-container">
              <div v-for="(action, actionIndex) in ruleForm.actions" :key="actionIndex" class="action-item">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-select 
                      v-model="action.type" 
                      placeholder="选择动作类型"
                      class="w-full"
                      @change="handleActionTypeChange(action)"
                    >
                      <el-option
                        v-for="type in actionTypes"
                        :key="type.value"
                        :label="type.label"
                        :value="type.value"
                      />
                    </el-select>
                  </el-col>
                  
                  <el-col :span="13">
                    <div class="action-params" v-if="action.params.length">
                      <div 
                        v-for="param in action.params" 
                        :key="param.name"
                        class="param-item"
                      >
                        <span class="param-label">{{ param.label }}:</span>
                        <template v-if="param.type === 'number'">
                          <el-input-number 
                            v-model="param.value" 
                            :controls="false"
                            class="param-input"
                          />
                        </template>
                        <template v-else-if="param.type === 'percentage'">
                          <el-input-number 
                            v-model="param.value" 
                            :controls="false"
                            :min="0"
                            :max="100"
                            class="param-input"
                          >
                            <template #suffix>%</template>
                          </el-input-number>
                        </template>
                        <template v-else-if="param.type === 'select'">
                          <el-select 
                            v-model="param.value" 
                            class="param-input"
                          >
                            <el-option
                              v-for="opt in param.options"
                              :key="opt"
                              :label="opt"
                              :value="opt"
                            />
                          </el-select>
                        </template>
                        <template v-else-if="param.type === 'warehouse'">
                          <el-select 
                            v-model="param.value" 
                            class="param-input"
                          >
                            <el-option
                              v-for="warehouse in warehouseOptions"
                              :key="warehouse.value"
                              :label="warehouse.label"
                              :value="warehouse.value"
                            />
                          </el-select>
                        </template>
                        <template v-else>
                          <el-input 
                            v-model="param.value" 
                            class="param-input"
                          />
                        </template>
                      </div>
                    </div>
                  </el-col>

                  <el-col :span="3" class="flex items-center justify-end">
                    <el-button 
                      type="danger" 
                      link 
                      @click="removeAction(actionIndex)"
                    >
                      删除
                    </el-button>
                  </el-col>
                </el-row>

                <div class="action-trigger">
                  <el-radio-group v-model="action.triggerType" size="small">
                    <el-radio-button label="auto">自动执行</el-radio-button>
                    <el-radio-button label="manual">人工确认</el-radio-button>
                  </el-radio-group>
                </div>
              </div>

              <el-button 
                type="primary" 
                @click="addAction" 
                class="mt-4"
                v-if="ruleForm.actions.length < 5"
              >
                <el-icon><Plus /></el-icon> 添加动作
              </el-button>
            </div>
          </div>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="info" @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSaveRule">保存并启用</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Setting, Delete, Edit, Search, InfoFilled, House, Goods } from '@element-plus/icons-vue'
import type { Rule, BaseInfo, ConditionGroup, RuleCondition, RuleAction, ActionParam } from './types'
import { formatDateTime } from '@/utils/date'

// 字段选项配置
const fieldOptions = [
  { 
    label: '库存属性',
    options: [
      { label: '库龄(天)', value: 'inventory_age', type: 'number' },
      { label: '库存数量', value: 'inventory_qty', type: 'number' },
      { label: '库存成本', value: 'inventory_cost', type: 'number' },
      { label: '库存价值', value: 'inventory_value', type: 'number' }
    ]
  },
  {
    label: '销售属性',
    options: [
      { label: '日均销量', value: 'daily_sales', type: 'number' },
      { label: '周均销量', value: 'weekly_sales', type: 'number' },
      { label: '月均销量', value: 'monthly_sales', type: 'number' },
      { label: '售罄率', value: 'sell_through_rate', type: 'percentage' },
      { label: '库存周转率', value: 'inventory_turnover', type: 'number' }
    ]
  },
  {
    label: '商品属性',
    options: [
      { label: '商品类目', value: 'category', type: 'select', options: 'categoryOptions' },
      { label: '商品品牌', value: 'brand', type: 'select', options: 'brandOptions' },
      { label: '商品状态', value: 'status', type: 'select', options: 'statusOptions' },
      { label: '上架时间', value: 'list_time', type: 'date' },
      { label: '保质期', value: 'shelf_life', type: 'number' }
    ]
  }
]

// 动作类型配置
const actionTypes = [
  { 
    label: '价格调整',
    value: 'price_adjustment',
    params: [
      { name: 'discount_rate', label: '折扣率', type: 'percentage' },
      { name: 'min_price', label: '最低价', type: 'number' }
    ]
  },
  {
    label: '库存处理',
    value: 'inventory_process',
    params: [
      { name: 'process_type', label: '处理方式', type: 'select', options: ['调拨', '报废', '降级销售'] },
      { name: 'target_warehouse', label: '目标仓库', type: 'warehouse' }
    ]
  },
  {
    label: '系统标记',
    value: 'system_mark',
    params: [
      { name: 'mark_type', label: '标记类型', type: 'select', options: ['滞销品', '待处理', '特殊关注'] }
    ]
  },
  {
    label: '通知提醒',
    value: 'notification',
    params: [
      { name: 'notify_roles', label: '通知角色', type: 'select', options: ['运营', '仓储', '采购'] },
      { name: 'notify_method', label: '通知方式', type: 'select', options: ['站内信', '邮件', '钉钉'] }
    ]
  }
]

// 表单数据
const ruleForm = reactive<{
  baseInfo: {
    name: string
    description: string
    categories: string[]
    brands: string[]
    skus: string[]
    warehouses: string[]
    effectiveTime: [Date, Date] | []
    priority: number
    isEnabled: boolean
  }
  conditionGroups: ConditionGroup[]
  actions: RuleAction[]
}>({
  baseInfo: {
    name: '',
    description: '',
    categories: [],
    brands: [],
    skus: [],
    warehouses: [],
    effectiveTime: [],
    priority: 1,
    isEnabled: true
  },
  conditionGroups: [{
    conditions: [{ 
      field: '', 
      operator: '', 
      value: '', 
      valueType: 'number',
      options: []
    }],
    relation: 'AND'
  }],
  actions: []
})

// 模拟数据 - 仓库列表
const warehouseOptions = [
  { label: '华东中心仓', value: 'HZ001' },
  { label: '华南中心仓', value: 'GZ001' },
  { label: '华北中心仓', value: 'BJ001' },
  { label: '西南中心仓', value: 'CD001' }
]

// 模拟数据 - 商品类目
const categoryOptions = [
  { label: '服装服饰', value: 'clothing' },
  { label: '食品饮料', value: 'food' },
  { label: '家居用品', value: 'household' },
  { label: '电子产品', value: 'electronics' },
  { label: '美妆个护', value: 'beauty' }
]

// 模拟数据 - 品牌列表
const brandOptions = [
  { label: '品牌A', value: 'brand_a' },
  { label: '品牌B', value: 'brand_b' },
  { label: '品牌C', value: 'brand_c' }
]

// 模拟数据 - 商品状态
const statusOptions = [
  { label: '正常销售', value: 'normal' },
  { label: '清仓特卖', value: 'clearance' },
  { label: '即将下架', value: 'discontinuing' },
  { label: '暂停销售', value: 'suspended' }
]

// 获取选项列表的方法
const getOptionsForField = (field: string) => {
  const fieldConfig = fieldOptions
    .flatMap(group => group.options)
    .find(opt => opt.value === field)

  if (!fieldConfig || !fieldConfig.options) return []
  
  switch (fieldConfig.options) {
    case 'categoryOptions':
      return categoryOptions
    case 'brandOptions':
      return brandOptions
    case 'statusOptions':
      return statusOptions
    default:
      return []
  }
}

// 修改条件字段变更处理方法
const handleFieldChange = (condition: RuleCondition) => {
  const field = fieldOptions
    .flatMap(group => group.options)
    .find(opt => opt.value === condition.field)
  
  if (field) {
    condition.valueType = field.type as 'number' | 'text' | 'percentage' | 'date' | 'select'
    condition.value = field.type === 'select' ? [] as string[] : ''
    if (field.type === 'select' && field.options) {
      condition.options = getOptionsForField(field.value)
    } else {
      condition.options = []
    }
  }
}

// 修改handleActionTypeChange方法
const handleActionTypeChange = (action: RuleAction) => {
  const actionType = actionTypes.find(type => type.value === action.type)
  if (actionType) {
    action.params = actionType.params.map(param => ({
      name: param.name,
      label: param.label,
      type: param.type as ActionParam['type'],
      value: null,
      options: param.options
    }))
  }
}

const addConditionGroup = () => {
  ruleForm.conditionGroups.push({
    conditions: [{
      field: '',
      operator: '',
      value: '',
      valueType: 'number',
      options: []
    }],
    relation: 'AND'
  })
}

const removeConditionGroup = (groupIndex: number) => {
  ruleForm.conditionGroups.splice(groupIndex, 1)
}

const addCondition = (groupIndex: number) => {
  ruleForm.conditionGroups[groupIndex].conditions.push({
    field: '',
    operator: '',
    value: '',
    valueType: 'number',
    options: []
  })
}

const removeCondition = (groupIndex: number, conditionIndex: number) => {
  ruleForm.conditionGroups[groupIndex].conditions.splice(conditionIndex, 1)
}

const addAction = () => {
  ruleForm.actions.push({
    type: '',
    params: [],
    triggerType: 'auto'
  })
}

const removeAction = (actionIndex: number) => {
  ruleForm.actions.splice(actionIndex, 1)
}

const previewVisible = ref(false)

const handleCancel = () => {
  // TODO: 确认是否放弃更改
  ElMessageBox.confirm('确定要放弃当前更改吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 返回列表页
  })
}

const handleSaveDraft = async () => {
  // TODO: 保存为草稿
  try {
    // 调用保存API
    ElMessage.success('保存草稿成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const handleSaveRule = async () => {
  // TODO: 保存并启用规则
  try {
    // 调用保存API
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 新增规则
const handleAddRule = () => {
  editingRule.value = null
  resetRuleForm()
  dialogVisible.value = true
}

// 编辑规则
const handleEditRule = (row: Rule) => {
  editingRule.value = row
  Object.assign(ruleForm, {
    baseInfo: {
      name: row.baseInfo.name,
      description: row.baseInfo.description,
      categories: [...row.baseInfo.categories],
      brands: [...row.baseInfo.brands],
      skus: [...row.baseInfo.skus],
      warehouses: [...row.baseInfo.warehouses],
      effectiveTime: row.baseInfo.effectiveTime || [],
      priority: row.baseInfo.priority,
      isEnabled: row.status === 'active'
    },
    conditionGroups: JSON.parse(JSON.stringify(row.conditionGroups)),
    actions: JSON.parse(JSON.stringify(row.actions))
  })
  dialogVisible.value = true
}

// 切换规则状态
const handleToggleStatus = async (row: Rule) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 'active' ? '禁用' : '启用'}该规则吗？`,
      '提示'
    )
    // TODO: 调用API更新状态
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success('操作成功')
  } catch (e) {
    // 用户取消操作
  }
}

// 删除规则
const handleDeleteRule = async (row: Rule) => {
  try {
    await ElMessageBox.confirm('确定要删除该规则吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用API删除规则
    const index = ruleList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      ruleList.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (e) {
    // 用户取消操作
  }
}

// 重置表单
const resetRuleForm = () => {
  Object.assign(ruleForm, {
    baseInfo: {
      name: '',
      description: '',
      categories: [],
      brands: [],
      skus: [],
      warehouses: [],
      effectiveTime: [],
      priority: 1,
      isEnabled: true
    },
    conditionGroups: [{
      conditions: [{ 
        field: '', 
        operator: '', 
        value: '', 
        valueType: 'number',
        options: []
      }],
      relation: 'AND'
    }],
    actions: []
  })
}

// 规则列表数据
const ruleList = ref<Rule[]>([
  {
    id: 1,
    baseInfo: {
      name: '基础库龄规则',
      description: '根据库龄和销量判断滞销',
      categories: ['clothing', 'food'],
      brands: [],
      skus: [],
      warehouses: ['HZ001', 'GZ001'],
      effectiveTime: [new Date('2023-01-01'), new Date('2023-12-31')],
      priority: 1,
      isEnabled: true
    },
    conditionGroups: [
      {
        conditions: [
          { field: 'inventory_age', operator: '>', value: '90', valueType: 'number' },
          { field: 'daily_sales', operator: '<', value: '10', valueType: 'number' }
        ],
        relation: 'AND'
      }
    ],
    actions: [
      {
        type: 'system_mark',
        params: [{ name: 'mark_type', label: '标记类型', value: '滞销品', type: 'select', options: ['滞销品', '待处理', '特殊关注'] }],
        triggerType: 'auto'
      },
      {
        type: 'notification',
        params: [{ name: 'notify_roles', label: '通知角色', value: ['运营', '仓储'], type: 'select', options: ['运营', '仓储', '采购'] }],
        triggerType: 'auto'
      }
    ],
    status: 'active'
  }
])

// 对话框显示状态
const dialogVisible = ref(false)
// 当前编辑的规则
const editingRule = ref<Rule | null>(null)
// 表单引用
const ruleFormRef = ref()

// 验证规则
const rules = {
  'baseInfo.name': [
    { required: true, message: '请输入规则名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  'baseInfo.categories': [
    { required: true, message: '请选择适用类目', trigger: 'change' },
    { type: 'array', min: 1, message: '至少选择一个类目', trigger: 'change' }
  ],
  'baseInfo.warehouses': [
    { required: true, message: '请选择适用仓库', trigger: 'change' },
    { type: 'array', min: 1, message: '至少选择一个仓库', trigger: 'change' }
  ],
  'baseInfo.effectiveTime': [
    { required: true, message: '请选择生效时间', trigger: 'change' },
    { type: 'array', len: 2, message: '请选择完整的时间范围', trigger: 'change' }
  ],
  'baseInfo.priority': [
    { required: true, message: '请输入优先级', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '优先级范围在1-100之间', trigger: 'blur' }
  ]
}

// SKU选项
const skuOptions = ref<{ label: string; value: string }[]>([])

// SKU搜索方法
const handleSkuSearch = async (query: string) => {
  if (query) {
    // TODO: 调用后端API搜索SKU
    // 这里模拟一些数据
    skuOptions.value = [
      { label: `SKU-${query}-1`, value: `sku-${query}-1` },
      { label: `SKU-${query}-2`, value: `sku-${query}-2` },
      { label: `SKU-${query}-3`, value: `sku-${query}-3` }
    ]
  } else {
    skuOptions.value = []
  }
}

// 搜索表单
const searchForm = reactive({
  name: '',
  categories: [] as string[],
  warehouses: [] as string[],
  status: ''
})

// 表格加载状态
const tableLoading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(20)

// 过滤规则列表
const filteredRuleList = computed(() => {
  return ruleList.value.filter(rule => {
    const nameMatch = !searchForm.name || 
      rule.baseInfo.name.toLowerCase().includes(searchForm.name.toLowerCase())
    
    const categoriesMatch = !searchForm.categories.length || 
      rule.baseInfo.categories.some(cat => searchForm.categories.includes(cat))
    
    const warehousesMatch = !searchForm.warehouses.length || 
      rule.baseInfo.warehouses.some(wh => searchForm.warehouses.includes(wh))
    
    const statusMatch = !searchForm.status || 
      (searchForm.status === 'active' ? rule.baseInfo.isEnabled : !rule.baseInfo.isEnabled)
    
    return nameMatch && categoriesMatch && warehousesMatch && statusMatch
  })
})

// 总记录数
const totalRules = computed(() => filteredRuleList.value.length)

// 当前显示的规则列表
const displayRuleList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRuleList.value.slice(start, end)
})

// 获取类目标签
const getCategoryLabels = (categories: string[]) => {
  return categories
    .map(cat => categoryOptions.find(opt => opt.value === cat)?.label)
    .filter(Boolean)
    .join('、')
}

// 获取仓库标签
const getWarehouseLabels = (warehouses: string[]) => {
  return warehouses
    .map(wh => warehouseOptions.find(opt => opt.value === wh)?.label)
    .filter(Boolean)
    .join('、')
}

// 格式化条件组描述
const formatConditions = (groups: ConditionGroup[]) => {
  return groups.map((group, groupIndex) => {
    const conditions = group.conditions.map(condition => {
      const fieldOption = fieldOptions
        .flatMap(g => g.options)
        .find(opt => opt.value === condition.field)
      return `${fieldOption?.label || condition.field} ${condition.operator} ${condition.value}`
    }).join(` ${group.relation} `)
    return `${groupIndex > 0 ? 'OR ' : ''}(${conditions})`
  }).join('\n')
}

// 获取条件概述
const getConditionSummary = (groups: ConditionGroup[]) => {
  const totalConditions = groups.reduce((sum, group) => sum + group.conditions.length, 0)
  return `${groups.length}组条件，共${totalConditions}个判断条件`
}

// 获取动作标签类型
const getActionTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    'price_adjustment': 'danger',
    'inventory_process': 'warning',
    'system_mark': 'info',
    'notification': 'success'
  }
  return typeMap[type] || 'info'
}

// 获取动作标签文本
const getActionLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    'price_adjustment': '价格调整',
    'inventory_process': '库存处理',
    'system_mark': '系统标记',
    'notification': '通知提醒'
  }
  return labelMap[type] || type
}

// 格式化动作描述
const formatActions = (actions: RuleAction[]) => {
  return actions.map(action => {
    const actionType = actionTypes.find(type => type.value === action.type)
    const params = action.params
      .map(param => `${param.label}: ${param.value}`)
      .join('\n')
    return `${actionType?.label || action.type}\n${params}`
  }).join('\n\n')
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  // 实际项目中这里可能需要调用API
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.categories = []
  searchForm.warehouses = []
  searchForm.status = ''
  handleSearch()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  // 实际项目中这里可能需要调用API
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 实际项目中这里可能需要调用API
}

// 格式化日期
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
}
</script>

<style scoped lang="scss">
.slow-moving-rules {
  min-height: calc(100vh - 120px);
  background-color: var(--el-bg-color-page);
}

.rule-list-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.search-area {
  margin: 16px 20px;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.search-select {
  width: 200px;
}

.rule-table {
  margin: 0 20px 16px;
}

.rule-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-tag {
  font-size: 12px;
  padding: 0 4px;
  height: 20px;
  line-height: 18px;
}

.scope-cell {
  display: flex;
  gap: 16px;
}

.scope-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-text-color-regular);
}

.condition-cell {
  color: var(--el-text-color-regular);
}

.actions-cell {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.action-tag {
  white-space: nowrap;
}

.status-tag {
  width: 48px;
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
}

/* Dialog styles */
:deep(.el-dialog) {
  --el-dialog-padding-primary: 0;
  border-radius: 8px;
  overflow: hidden;

  .dialog-content {
    padding: 20px;
  }

  .form-actions {
    margin-top: 24px;
    padding: 16px 20px;
    display: flex;
    justify-content: center;
    gap: 12px;
    background-color: var(--el-fill-color-light);
    border-top: 1px solid var(--el-border-color-light);
  }
}

/* Card styles */
:deep(.el-card) {
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  
  .el-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}

/* Form styles */
:deep(.el-form-item__label) {
  font-weight: 500;
}

/* Table styles */
:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-light);
  --el-table-header-bg-color: var(--el-fill-color-light);
  
  th {
    font-weight: 600;
    background-color: var(--el-fill-color-light);
  }
}

/* 对话框样式 */
.rule-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.rule-form {
  background-color: var(--el-bg-color-page);
}

.form-section {
  margin-bottom: 24px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background-color: var(--el-fill-color);
  border-bottom: 1px solid var(--el-border-color-light);

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .el-icon {
    color: var(--el-text-color-secondary);
    cursor: help;
  }
}

.section-content {
  padding: 20px;
}

/* 条件组样式 */
.condition-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.condition-group {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background-color: var(--el-bg-color);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-light);
  border-radius: 8px 8px 0 0;
}

.group-title {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.group-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.condition-item {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-bottom: none;
  }
}

.group-footer {
  padding: 12px 16px;
  background-color: var(--el-fill-color-light);
  border-top: 1px solid var(--el-border-color-light);
  border-radius: 0 0 8px 8px;
}

.add-group-action {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-tip {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

/* 动作样式 */
.actions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-item {
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
}

.action-params {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.param-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.param-label {
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.param-input {
  width: 120px;
}

.action-trigger {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--el-border-color-light);
}

/* 通用样式 */
.w-full {
  width: 100%;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-end {
  justify-content: flex-end;
}

.mt-4 {
  margin-top: 16px;
}

/* 底部按钮样式 */
.dialog-footer {
  padding: 16px 20px;
  background-color: var(--el-fill-color-light);
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style> 