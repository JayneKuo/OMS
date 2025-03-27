<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Mapping</h1>
        <p class="subtitle">The shipping mapping of the original order, from channel mapping to warehouse.</p>
      </div>
      <div class="header-actions">
        <template v-if="activeTab === 'channel'">
          <el-button type="primary" @click="handleAddMapping">
            <el-icon><Plus /></el-icon>
            Add Channel Mapping
          </el-button>
        </template>
        <template v-else-if="activeTab === 'product'">
          <el-button type="primary" @click="handleAddProduct">
            <el-icon><Plus /></el-icon>
            Add Product
          </el-button>
          <el-button type="primary" @click="handleBulkImport">
            <el-icon><Upload /></el-icon>
            Bulk Import
          </el-button>
        </template>
        <template v-else-if="activeTab === 'uom'">
          <el-button type="primary" @click="handleAddUom">
            <el-icon><Plus /></el-icon>
            Add UOM
          </el-button>
        </template>
        <template v-else-if="activeTab === 'warehouse'">
          <el-button type="primary" @click="handleAddWarehouse">
            <el-icon><Plus /></el-icon>
            Add Warehouse
          </el-button>
        </template>
      </div>
    </div>

    <div class="tab-container">
      <el-tabs v-model="activeTab" class="mapping-tabs">
        <el-tab-pane label="Channel Shipping Mapping" name="channel">
          <div class="tab-description">
            <p>The shipping mapping of the original order, from channel mapping to warehouse.</p>
            <p>If the same conditions have different results, take the first one.</p>
          </div>
          <div class="mapping-content">
            <el-table :data="paginatedData" style="width: 100%" border v-loading="loading">
              <el-table-column prop="priority" label="Priority" width="100" sortable>
                <template #default="{ row }">
                  <el-input-number v-model="row.priority" :min="1" controls-position="right" size="small" />
                </template>
              </el-table-column>
              <el-table-column prop="channel" label="Channel" width="150">
                <template #default="{ row }">
                  <el-tag>{{ row.channel }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="inputConditions" label="Input Conditions">
                <template #default="{ row }">
                  <div class="condition-tags">
                    <el-tag 
                      v-for="(condition, index) in row.inputConditions" 
                      :key="index"
                      size="small"
                      class="mx-1"
                    >
                      {{ condition.field }}: {{ condition.value }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="outputMappings" label="Output Mappings">
                <template #default="{ row }">
                  <div class="condition-tags">
                    <el-tag 
                      v-for="(mapping, index) in row.outputMappings" 
                      :key="index"
                      size="small"
                      type="success"
                      class="mx-1"
                    >
                      {{ mapping.field }}: {{ mapping.value }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Actions" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button-group>
                    <el-button type="primary" link @click="handleEdit(row)">
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button type="danger" link @click="handleDelete(row)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="totalItems"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Product Mapping" name="product">
          <product-mapping ref="productMappingRef" />
        </el-tab-pane>
        <el-tab-pane label="UOM Mapping" name="uom">
          <div class="empty-content">
            <el-empty description="UOM Mapping Content" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Warehouse Shipping Mapping" name="warehouse">
          <div class="empty-content">
            <el-empty description="Warehouse Shipping Mapping Content" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Mapping Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Edit Mapping Rule' : 'Add Mapping Rule'"
      width="800px"
      class="mapping-dialog"
    >
      <el-form ref="formRef" :model="currentMapping" label-width="100px" class="mapping-form">
        <!-- 基础信息 -->
        <div class="form-section">
          <div class="section-title">Basic Information</div>
          <div class="section-content">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Priority" required>
                  <el-input-number v-model="currentMapping.priority" :min="1" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Channel" required>
                  <el-select v-model="currentMapping.channel" style="width: 100%">
                    <el-option
                      v-for="item in channels"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 输入条件 -->
        <div class="form-section">
          <div class="section-title">
            <span>Input Conditions</span>
            <el-button 
              type="primary" 
              link
              size="small" 
              @click="addInputCondition"
              :disabled="isInputConditionsFull"
            >
              <el-icon><Plus /></el-icon>
              Add Condition
            </el-button>
          </div>
          <div class="section-content">
            <div v-for="(condition, index) in currentMapping.inputConditions" :key="index" class="condition-row">
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-select 
                    v-model="condition.field" 
                    placeholder="Select Field" 
                    style="width: 100%"
                    @change="handleInputFieldChange(condition)"
                  >
                    <el-option
                      v-for="option in availableInputFields"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <template v-if="condition.field === 'productName'">
                    <el-select 
                      v-model="condition.value" 
                      placeholder="Select Product"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="option in getOptionsForCondition(condition.field)"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </template>
                  <template v-else-if="condition.field">
                    <div class="operator-value">
                      <el-select 
                        v-model="condition.operator" 
                        placeholder="Operator"
                        style="width: 120px"
                      >
                        <el-option label="Value" value="equal" />
                        <el-option label="Empty" value="empty" />
                      </el-select>
                      <el-select 
                        v-if="condition.operator === 'equal'"
                        v-model="condition.value" 
                        placeholder="Select Value"
                        style="width: calc(100% - 128px)"
                      >
                        <el-option
                          v-for="option in getOptionsForCondition(condition.field)"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                    </div>
                  </template>
                </el-col>
                <el-col :span="4" class="text-right">
                  <el-button type="danger" circle @click="removeInputCondition(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>

        <!-- 输出映射 -->
        <div class="form-section">
          <div class="section-title">
            <span>Output Mappings</span>
            <el-button 
              type="primary" 
              link
              size="small" 
              @click="addOutputMapping"
              :disabled="isOutputMappingsFull"
            >
              <el-icon><Plus /></el-icon>
              Add Mapping
            </el-button>
          </div>
          <div class="section-content">
            <div v-for="(mapping, index) in currentMapping.outputMappings" :key="index" class="condition-row">
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-select 
                    v-model="mapping.field" 
                    placeholder="Select Field" 
                    style="width: 100%"
                  >
                    <el-option
                      v-for="option in availableOutputFields"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-input v-model="mapping.value" placeholder="Enter Value" />
                </el-col>
                <el-col :span="4" class="text-right">
                  <el-button type="danger" circle @click="removeOutputMapping(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSaveMapping">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, ArrowRight, Upload, Edit, Delete, Minus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ProductMapping from './components/ProductMapping.vue'

interface Condition {
  field: string;
  operator?: string;
  value: string;
}

interface MappingRule {
  id: string;
  priority: number;
  channel: string;
  inputConditions: Condition[];
  outputMappings: Condition[];
}

// 状态管理
const activeTab = ref('channel')
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 列表数据
const mappingList = ref<MappingRule[]>([])

// 当前编辑的映射规则
const currentMapping = ref<MappingRule>({
  id: '',
  priority: 1,
  channel: '',
  inputConditions: [{
    field: '',
    operator: '',
    value: ''
  }],
  outputMappings: [{
    field: '',
    value: ''
  }]
})

// 模拟数据
const channels = ref([
  { value: 'amazon', label: 'Amazon' },
  { value: 'ebay', label: 'eBay' },
  { value: 'shopify', label: 'Shopify' }
])

const deliveryServices = ref([
  { value: 'standard', label: 'Standard Delivery' },
  { value: 'express', label: 'Express Delivery' },
  { value: 'next_day', label: 'Next Day Delivery' }
])

const carriers = ref([
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'dhl', label: 'DHL' }
])

const shipMethods = ref([
  { value: 'ground', label: 'Ground' },
  { value: 'air', label: 'Air' },
  { value: 'ocean', label: 'Ocean' }
])

// 根据选择的条件返回对应的选项
const getOptionsForCondition = (condition: string) => {
  switch (condition) {
    case 'productName':
      return [
        { value: 'product1', label: 'Product 1' },
        { value: 'product2', label: 'Product 2' }
      ]
    case 'deliveryService':
      return deliveryServices.value
    case 'shipMethod':
      return shipMethods.value
    case 'carrier':
      return carriers.value
    case 'freightTerm':
      return [
        { value: 'prepaid', label: 'Prepaid' },
        { value: 'collect', label: 'Collect' }
      ]
    default:
      return []
  }
}

// 方法
const handleAddMapping = () => {
  isEdit.value = false
  currentMapping.value = {
    id: '',
    priority: mappingList.value.length + 1,
    channel: '',
    inputConditions: [{
      field: '',
      operator: '',
      value: ''
    }],
    outputMappings: [{
      field: '',
      value: ''
    }]
  }
  dialogVisible.value = true
}

const handleEdit = (row: MappingRule) => {
  isEdit.value = true
  currentMapping.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

const handleDelete = (row: MappingRule) => {
  ElMessageBox.confirm(
    'Are you sure to delete this mapping rule?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    const index = mappingList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      mappingList.value.splice(index, 1)
      ElMessage.success('Deleted successfully')
    }
  })
}

const addInputCondition = () => {
  currentMapping.value.inputConditions.push({
    field: '',
    operator: '',
    value: ''
  })
}

const removeInputCondition = (index: number) => {
  currentMapping.value.inputConditions.splice(index, 1)
}

const addOutputMapping = () => {
  currentMapping.value.outputMappings.push({
    field: '',
    value: ''
  })
}

const removeOutputMapping = (index: number) => {
  currentMapping.value.outputMappings.splice(index, 1)
}

// 分页相关的状态
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 模拟数据生成函数
const generateMockData = () => {
  const mockData: MappingRule[] = []
  const channels = ['amazon', 'ebay', 'shopify']
  const products = ['product1', 'product2']
  const services = ['standard', 'express', 'next_day']
  const methods = ['ground', 'air', 'ocean']
  const carriers = ['fedex', 'ups', 'dhl']
  const terms = ['prepaid', 'collect']
  
  for (let i = 1; i <= 100; i++) {
    const inputConditionsCount = Math.floor(Math.random() * 3) + 1
    const outputMappingsCount = Math.floor(Math.random() * 3) + 1
    
    const inputConditions: Condition[] = []
    const usedFields = new Set()
    
    // 生成输入条件
    while (inputConditions.length < inputConditionsCount) {
      const fields = [
        { field: 'productName', values: products },
        { field: 'deliveryService', values: services },
        { field: 'shipMethod', values: methods },
        { field: 'carrier', values: carriers },
        { field: 'freightTerm', values: terms }
      ]
      
      const fieldIndex = Math.floor(Math.random() * fields.length)
      const field = fields[fieldIndex]
      
      if (!usedFields.has(field.field)) {
        usedFields.add(field.field)
        
        if (field.field === 'productName') {
          inputConditions.push({
            field: field.field,
            value: field.values[Math.floor(Math.random() * field.values.length)]
          })
        } else {
          const isEmptyCondition = Math.random() < 0.3
          inputConditions.push({
            field: field.field,
            operator: isEmptyCondition ? 'empty' : 'equal',
            value: isEmptyCondition ? '' : field.values[Math.floor(Math.random() * field.values.length)]
          })
        }
      }
    }
    
    // 生成输出映射
    const outputMappings: Condition[] = []
    const usedOutputFields = new Set()
    
    while (outputMappings.length < outputMappingsCount) {
      const fields = [
        { field: 'deliveryService', values: services },
        { field: 'shipMethod', values: methods },
        { field: 'carrier', values: carriers },
        { field: 'freightTerm', values: terms },
        { field: 'shipmentType', values: ['normal', 'express', 'special'] }
      ]
      
      const fieldIndex = Math.floor(Math.random() * fields.length)
      const field = fields[fieldIndex]
      
      if (!usedOutputFields.has(field.field)) {
        usedOutputFields.add(field.field)
        outputMappings.push({
          field: field.field,
          value: field.values[Math.floor(Math.random() * field.values.length)]
        })
      }
    }
    
    mockData.push({
      id: `rule_${i}`,
      priority: i,
      channel: channels[Math.floor(Math.random() * channels.length)],
      inputConditions,
      outputMappings
    })
  }
  
  return mockData
}

// 初始化模拟数据
const initMockData = async () => {
  loading.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    mappingList.value = generateMockData()
  } finally {
    loading.value = false
  }
}

// 计算分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return mappingList.value.slice(start, end)
})

// 计算总条目数
const totalItems = computed(() => mappingList.value.length)

// 处理分页变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 在组件挂载时初始化数据
onMounted(() => {
  initMockData()
})

// 修改保存方法，添加排序逻辑
const handleSaveMapping = () => {
  // 这里应该添加表单验证
  if (!currentMapping.value.channel) {
    ElMessage.warning('Please select a channel')
    return
  }

  if (currentMapping.value.inputConditions.length === 0) {
    ElMessage.warning('Please add at least one input condition')
    return
  }

  if (currentMapping.value.outputMappings.length === 0) {
    ElMessage.warning('Please add at least one output mapping')
    return
  }

  if (isEdit.value) {
    const index = mappingList.value.findIndex(item => item.id === currentMapping.value.id)
    if (index > -1) {
      mappingList.value[index] = JSON.parse(JSON.stringify(currentMapping.value))
    }
  } else {
    currentMapping.value.id = Date.now().toString()
    mappingList.value.push(JSON.parse(JSON.stringify(currentMapping.value)))
  }

  // 根据优先级排序
  mappingList.value.sort((a, b) => a.priority - b.priority)

  dialogVisible.value = false
  ElMessage.success('Saved successfully')
}

// 组件引用
const productMappingRef = ref<InstanceType<typeof ProductMapping> | null>(null)

// 输入字段选项
const inputFieldOptions = [
  { value: 'productName', label: 'Product Name' },
  { value: 'deliveryService', label: 'Delivery Service' },
  { value: 'shipMethod', label: 'Ship Method' },
  { value: 'carrier', label: 'Carrier' },
  { value: 'freightTerm', label: 'Freight Term' }
]

// 输出字段选项
const outputFieldOptions = [
  { value: 'deliveryService', label: 'Delivery Service' },
  { value: 'shipMethod', label: 'Ship Method' },
  { value: 'carrier', label: 'Carrier' },
  { value: 'freightTerm', label: 'Freight Term' },
  { value: 'shipmentType', label: 'Shipment Type' }
]

// 计算可用的输入字段
const availableInputFields = computed(() => {
  const usedFields = currentMapping.value.inputConditions.map(c => c.field)
  return inputFieldOptions.filter(option => !usedFields.includes(option.value) || option.value === '')
})

// 计算可用的输出字段
const availableOutputFields = computed(() => {
  const usedFields = currentMapping.value.outputMappings.map(m => m.field)
  return outputFieldOptions.filter(option => !usedFields.includes(option.value) || option.value === '')
})

// 判断是否所有输入条件都已添加
const isInputConditionsFull = computed(() => {
  return currentMapping.value.inputConditions.length === inputFieldOptions.length
})

// 判断是否所有输出映射都已添加
const isOutputMappingsFull = computed(() => {
  return currentMapping.value.outputMappings.length === outputFieldOptions.length
})

// 处理输入字段变化
const handleInputFieldChange = (condition: Condition) => {
  if (condition.field !== 'productName') {
    condition.operator = 'equal'
    condition.value = ''
  } else {
    delete condition.operator
    condition.value = ''
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--el-bg-color-page);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 500;
    margin: 0;
    color: var(--el-text-color-primary);
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    
    .el-button {
      border-radius: 8px;
      height: 40px;
      padding: 0 20px;
      
      .el-icon {
        margin-right: 8px;
      }
    }
  }
}

.tab-container {
  .mapping-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 24px;
    }

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
      background-color: var(--el-border-color-light);
    }

    :deep(.el-tabs__item) {
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      color: var(--el-text-color-regular);
      
      &.is-active {
        font-weight: 500;
        color: #9D5FFE;
      }

      &:hover {
        color: #9D5FFE;
      }
    }

    :deep(.el-tabs__active-bar) {
      background-color: #9D5FFE;
    }
  }
}

.tab-description {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--el-color-info-light-9);
  border-radius: 8px;
  
  p {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    line-height: 1.6;
    
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}

.mapping-content {
  .filter-section {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    
    .search-input {
      width: 300px;
    }
  }

  .mapping-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .mapping-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 24px;
    border: 1px solid var(--el-border-color-light);
    
    .mapping-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      
      .header-actions {
        display: flex;
        gap: 12px;
      }
    }
    
    .mapping-body {
      .mapping-row {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-bottom: 16px;
        
        .left-inputs,
        .right-inputs {
          flex: 1;
          display: flex;
          gap: 16px;
          
          :deep(.el-select) {
            flex: 1;
          }
        }
        
        .row-actions {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.empty-content {
  padding: 40px 0;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}

.mapping-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }

  .mapping-form {
    .form-section {
      padding: 24px;
      
      &:not(:last-child) {
        border-bottom: 1px solid var(--el-border-color-lighter);
      }

      .section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .section-content {
        .condition-row {
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.operator-value {
  display: flex;
  gap: 8px;
  width: 100%;
}

.text-right {
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 