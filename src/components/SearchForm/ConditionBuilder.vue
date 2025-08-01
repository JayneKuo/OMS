<template>
  <div class="condition-builder">
    <div class="condition-header">
      <el-select v-model="rootOperator" class="operator-select">
        <el-option label="AND" value="AND" />
        <el-option label="OR" value="OR" />
      </el-select>
    </div>

    <div class="rules-container">
      <div v-for="(rule, index) in rules" :key="index" class="rule-row">
        <div class="rule-content">
          <!-- 字段选择 -->
          <el-select 
            v-model="rule.field" 
            placeholder="Field" 
            class="field-select"
            @change="handleFieldChange(index)"
          >
            <el-option-group
              v-for="group in fieldGroups"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="field in group.options"
                :key="field.value"
                :label="field.label"
                :value="field.value"
              />
            </el-option-group>
          </el-select>

          <!-- 操作符选择 -->
          <el-select 
            v-model="rule.operator" 
            placeholder="Operator"
            class="operator-select"
          >
            <el-option
              v-for="op in getOperators(rule.field)"
              :key="op.value"
              :label="op.label"
              :value="op.value"
            />
          </el-select>

          <!-- 值输入 -->
          <component
            :is="getValueComponent(rule.field)"
            v-model="rule.value"
            v-bind="getValueProps(rule.field)"
            class="value-input"
          />
        </div>

        <el-button 
          type="danger" 
          circle 
          @click="removeRule(index)"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>

    <el-button 
      type="primary" 
      plain 
      class="add-rule-btn"
      @click="addRule"
    >
      <el-icon><Plus /></el-icon>
      Add Rule
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import PriceRangeInput from './PriceRangeInput.vue'

interface Rule {
  field: string;
  operator: string;
  value: any;
}

// 字段组定义
const fieldGroups = [
  {
    label: 'Order',
    options: [
      { 
        label: 'Order Source', 
        value: 'orderSource', 
        type: 'directSelect',
        options: [
          { label: 'Website', value: 'website' },
          { label: 'Mobile App', value: 'app' },
          { label: 'Third Party', value: 'third_party' },
          { label: 'Offline', value: 'offline' }
        ]
      },
      { label: 'Channel Order Number', value: 'channelOrderNumber', type: 'string' },
      { label: 'Channel Order Status', value: 'channelOrderStatus', type: 'string' },
      { label: 'Channel Order Date', value: 'channelOrderDate', type: 'date' },
      { label: 'Channel Order Tags', value: 'channelOrderTags', type: 'string' }
    ]
  },
  {
    label: 'Product',
    options: [
      { label: 'SKU', value: 'sku', type: 'string' },
      { label: 'Category', value: 'category', type: 'string' },
      { label: 'Brand', value: 'brand', type: 'string' },
      { label: 'Price Range', value: 'priceRange', type: 'priceRange' },
      { 
        label: 'Warehouse', 
        value: 'warehouse', 
        type: 'directSelect',
        options: [
          { label: 'Main Warehouse', value: 'WH001' },
          { label: 'East Coast Warehouse', value: 'WH002' },
          { label: 'West Coast Warehouse', value: 'WH003' },
          { label: 'Central Warehouse', value: 'WH004' }
        ]
      },
      { label: 'Inventory Condition', value: 'inventoryCondition', type: 'number' }
    ]
  },
  {
    label: 'Shipping',
    options: [
      { label: 'Shipping Method', value: 'shippingMethod', type: 'string' },
      { label: 'Shipping Country', value: 'shippingCountry', type: 'string' },
      { label: 'Shipping State', value: 'shippingState', type: 'string' },
      { label: 'Shipping City', value: 'shippingCity', type: 'string' },
      { label: 'Shipping Address1', value: 'shippingAddress1', type: 'string' },
      { label: 'Shipping Address2', value: 'shippingAddress2', type: 'string' },
      { label: 'Shipping Company', value: 'shippingCompany', type: 'string' }
    ]
  }
]

// 操作符映射
const operatorsByType = {
  string: [
    { label: 'Equals', value: 'eq' },
    { label: 'Equals Any Of', value: 'eqAny' },
    { label: 'Does Not Equal', value: 'neq' },
    { label: 'Does Not Equal Any Of', value: 'neqAny' },
    { label: 'Starts With', value: 'startsWith' },
    { label: 'Ends With', value: 'endsWith' },
    { label: 'Contains', value: 'contains' },
    { label: 'Does Not Contain', value: 'notContains' },
    { label: 'Matches (* Wildcard)', value: 'matches' }
  ],
  number: [
    { label: 'Equals', value: 'eq' },
    { label: 'Does Not Equal', value: 'neq' },
    { label: 'Greater Than', value: 'gt' },
    { label: 'Less Than', value: 'lt' },
    { label: 'Greater Than or Equal', value: 'gte' },
    { label: 'Less Than or Equal', value: 'lte' }
  ],
  date: [
    { label: 'Equals', value: 'eq' },
    { label: 'Does Not Equal', value: 'neq' },
    { label: 'After', value: 'after' },
    { label: 'Before', value: 'before' },
    { label: 'Between', value: 'between' }
  ],
  directSelect: [
    { label: 'Is', value: 'is' },
    { label: 'Is Not', value: 'isNot' }
  ]
}

// 枚举值选项
const enumOptions = {
  orderStatus: [
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ],
  customerType: [
    { label: 'Regular', value: 'regular' },
    { label: 'VIP', value: 'vip' },
    { label: 'Wholesale', value: 'wholesale' }
  ],
  category: [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home & Garden', value: 'home' }
  ],
  shippingMethod: [
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express' },
    { label: 'Next Day', value: 'nextDay' }
  ],
  shippingCountry: [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Australia', value: 'AU' }
  ]
}

const props = defineProps<{
  modelValue: {
    operator: string;
    rules: Rule[];
  }
}>()

const emit = defineEmits(['update:modelValue'])

// 状态
const rootOperator = ref(props.modelValue?.operator || 'AND')
const rules = ref<Rule[]>(props.modelValue?.rules || [])

// 监听变化
watch([rootOperator, rules], () => {
  emit('update:modelValue', {
    operator: rootOperator.value,
    rules: rules.value
  })
}, { deep: true })

// 获取字段类型
const getFieldType = (fieldValue: string) => {
  for (const group of fieldGroups) {
    const field = group.options.find(opt => opt.value === fieldValue)
    if (field) return field.type
  }
  return 'string'
}

// 获取操作符选项
const getOperators = (fieldValue: string) => {
  const type = getFieldType(fieldValue)
  return operatorsByType[type as keyof typeof operatorsByType] || []
}

// 获取值组件类型
const getValueComponent = (fieldValue: string) => {
  const field = findField(fieldValue)
  if (!field) return 'el-input'

  switch (field.type) {
    case 'date':
      return 'el-date-picker'
    case 'directSelect':
      return 'el-select'
    case 'priceRange':
      return 'PriceRangeInput'
    case 'number':
      return 'el-input-number'
    default:
      return 'el-input'
  }
}

// 获取值组件属性
const getValueProps = (fieldValue: string) => {
  const field = findField(fieldValue)
  if (!field) return { placeholder: 'Enter value' }

  const props: Record<string, any> = {
    placeholder: 'Enter value'
  }

  switch (field.type) {
    case 'date':
      props.type = 'date'
      props.valueFormat = 'YYYY-MM-DD'
      break
    case 'directSelect':
      props.options = field.options || []
      props.multiple = true
      props.filterable = true
      props.clearable = true
      break
    case 'priceRange':
      props.min = 0
      props.step = 1
      props.precision = 2
      break
    case 'number':
      props.min = 0
      props.step = 1
      break
  }

  return props
}

// 查找字段定义
const findField = (fieldValue: string) => {
  for (const group of fieldGroups) {
    const field = group.options.find(opt => opt.value === fieldValue)
    if (field) return field
  }
  return null
}

// 添加规则
const addRule = () => {
  rules.value.push({
    field: '',
    operator: '',
    value: null
  })
}

// 删除规则
const removeRule = (index: number) => {
  rules.value.splice(index, 1)
}

// 处理字段变化
const handleFieldChange = (index: number) => {
  const rule = rules.value[index]
  rule.operator = ''
  rule.value = null
}
</script>

<style lang="scss" scoped>
.condition-builder {
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  .condition-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    .operator-select {
      width: 120px;
    }
  }

  .rules-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;

    .rule-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .rule-content {
        flex: 1;
        display: flex;
        gap: 8px;

        .field-select {
          width: 200px;
        }

        .operator-select {
          width: 160px;
        }

        .value-input {
          flex: 1;
        }
      }
    }
  }

  .add-rule-btn {
    width: 100%;
  }
}
</style> 