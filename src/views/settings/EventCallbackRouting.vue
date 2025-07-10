<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-xl font-semibold text-gray-800">Event Callback Routing</span>
    </div>

    <!-- Search Form -->
    <el-card class="search-card">
      <div class="search-form">
        <div class="search-row">
          <!-- Rule Name -->
          <div class="search-item">
            <div class="item-label">Rule Name</div>
            <el-input
              v-model="filters.keyword"
              placeholder="Enter rule name"
              style="width: 200px;"
              clearable
            />
          </div>

          <!-- Event Type -->
          <div class="search-item">
            <div class="item-label">Event Type</div>
            <el-select
              v-model="filters.eventType"
              placeholder="Select event type"
              style="width: 200px;"
              clearable
            >
              <el-option-group
                v-for="group in eventTypeOptions"
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
          </div>

          <!-- Status -->
          <div class="search-item">
            <div class="item-label">Status</div>
            <el-select
              v-model="filters.status"
              placeholder="Select status"
              style="width: 120px;"
              clearable
            >
              <el-option label="Active" value="active" />
              <el-option label="Inactive" value="inactive" />
            </el-select>
          </div>

          <!-- 占位空间，确保按钮靠右 -->
          <div class="flex-grow"></div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button @click="resetFilters">
              <el-icon><refresh /></el-icon>
              Reset
            </el-button>
            <el-button type="primary" @click="applyFilters">
              <el-icon><search /></el-icon>
              Search
            </el-button>
            <el-button type="primary" @click="handleAdd">
              <el-icon><plus /></el-icon>
              Add Rule
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Table Content -->
    <el-card class="table-card">
      <div class="table-header mb-4" v-if="selectedRules.length">
        <div class="flex items-center justify-between">
          <span class="text-gray-600">{{ selectedRules.length }} items selected</span>
          <div class="flex gap-2">
            <el-button 
              type="primary"
              plain
              @click="handleBatchCopy"
            >
              <el-icon><document-copy /></el-icon>
              Copy Selected
            </el-button>
            
            <el-button 
              type="danger"
              plain
              @click="handleBatchDelete"
            >
              <el-icon><delete /></el-icon>
              Delete Selected
            </el-button>
          </div>
        </div>
      </div>

      <!-- Rules Table -->
      <el-table
        v-loading="false"
        :data="filteredRules"
        @selection-change="handleSelectionChange"
        border
        class="w-full"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="Rule Name" prop="name" min-width="180">
          <template #default="{ row }">
            <span class="font-medium">{{ row.name }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Merchant" prop="merchant" min-width="120">
          <template #default="{ row }">
            <el-tag v-for="m in row.merchant" :key="m" size="small" class="mr-1">
              {{ m }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Warehouse" prop="warehouse" min-width="120">
          <template #default="{ row }">
            <el-tag v-for="w in row.warehouse" :key="w" size="small" type="info" class="mr-1">
              {{ w }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Event Type" prop="eventType" min-width="150">
          <template #default="{ row }">
            <el-tag :type="getEventTypeTag(row.eventType)">
              {{ formatEventType(row.eventType) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Return Type" prop="returnType" min-width="120">
          <template #default="{ row }">
            <el-tag type="success">{{ row.returnType }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Status" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="Created At" prop="createdAt" min-width="120">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="Operations" width="150" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-button 
                type="primary" 
                link
                @click="handleEdit(row)"
              >
                <el-icon><edit /></el-icon>
              </el-button>
              <el-button 
                type="primary" 
                link
                @click="handleCopy(row)"
              >
                <el-icon><document-copy /></el-icon>
              </el-button>
              <el-button 
                type="danger" 
                link
                @click="handleDelete(row)"
              >
                <el-icon><delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- Add/Edit Rule Dialog -->
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? 'Edit Rule' : 'Add New Rule'"
    width="800px"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="160px"
      label-position="left"
    >
      <!-- Basic Info -->
      <div class="form-section">
        <h3 class="form-section-title">Basic Information</h3>
        <el-form-item label="Rule Name" prop="name" required>
          <el-input v-model="form.name" placeholder="Enter rule name" />
        </el-form-item>
        
        <el-form-item label="Merchant" prop="merchant" required>
          <el-select
            v-model="form.merchant"
            multiple
            placeholder="Select merchants"
            class="w-full"
          >
            <el-option
              v-for="option in merchantOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Warehouse" prop="warehouse">
          <el-select
            v-model="form.warehouse"
            multiple
            placeholder="Select warehouses"
            class="w-full"
          >
            <el-option
              v-for="option in warehouseOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Event Type" prop="eventType" required>
          <el-select v-model="form.eventType" placeholder="Select event type" class="w-full">
            <el-option-group
              v-for="group in eventTypeOptions"
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
        </el-form-item>
      </div>

      <!-- Target Configuration -->
      <div class="form-section">
        <h3 class="form-section-title">Target Configuration</h3>
        <el-form-item label="Return Type" prop="returnType" required>
          <el-select v-model="form.returnType" placeholder="Select return type" class="w-full">
            <el-option
              v-for="option in returnTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Target Endpoint" prop="targetEndpoint" required>
          <el-input v-model="form.targetEndpoint" placeholder="Enter target endpoint" />
        </el-form-item>
        
        <el-form-item label="Priority" prop="priority" required>
          <el-input-number 
            v-model="form.priority" 
            :min="1" 
            :max="100"
            class="w-[200px]"
          />
        </el-form-item>
      </div>

      <!-- Retry Configuration -->
      <div class="form-section">
        <h3 class="form-section-title">Retry Configuration</h3>
        <el-form-item label="Enable Retry">
          <el-switch v-model="form.enableRetry" />
        </el-form-item>
        
        <el-form-item 
          label="Retry Times" 
          prop="retryTimes"
          v-if="form.enableRetry"
        >
          <el-input-number 
            v-model="form.retryTimes" 
            :min="0" 
            :max="10"
            class="w-[200px]"
          />
        </el-form-item>
      </div>

      <!-- Payload Configuration -->
      <div class="form-section">
        <h3 class="form-section-title">Payload Configuration</h3>
        <el-form-item label="Payload Template" prop="payloadTemplate" required>
          <el-input
            v-model="form.payloadTemplate"
            type="textarea"
            :rows="6"
            placeholder="Enter JSON template"
          />
        </el-form-item>
      </div>

      <!-- Authentication -->
      <div class="form-section">
        <h3 class="form-section-title">Authentication</h3>
        <el-form-item label="Authentication Type" prop="authentication">
          <el-select v-model="form.authentication" placeholder="Select auth type" class="w-full">
            <el-option
              v-for="option in authTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Header Config">
          <div class="header-config">
            <div v-for="(value, key) in form.headerConfig" :key="key" class="header-item">
              <el-input v-model="form.headerConfig[key]" placeholder="Header value">
                <template #prepend>{{ key }}</template>
                <template #append>
                  <el-button @click="deleteHeader(key)">
                    <el-icon><delete /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
            <el-button @click="addHeader" plain>Add Header</el-button>
          </div>
        </el-form-item>
      </div>

      <!-- Additional Info -->
      <div class="form-section">
        <h3 class="form-section-title">Additional Information</h3>
        <el-form-item label="Remark">
          <el-input 
            v-model="form.remark" 
            type="textarea" 
            rows="3" 
            placeholder="Enter remark"
          />
        </el-form-item>
      </div>
    </el-form>
    
    <template #footer>
      <el-button @click="handleCancel(formRef)">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit(formRef)">
        {{ isEdit ? 'Update' : 'Create' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowDown,
  ArrowUp,
  Plus,
  Edit,
  Delete,
  DocumentCopy,
  Search,
  Refresh,
  Filter,
  CircleCheckFilled,
  CircleCloseFilled
} from '@element-plus/icons-vue'
import { format, isWithinInterval, parseISO, subDays } from 'date-fns'
import type { FormInstance, FormRules } from 'element-plus'

// 模拟数据
interface Rule {
  id: number
  name: string
  merchant: string[]
  warehouse: string[]
  eventType: string
  returnType: string
  targetEndpoint: string
  priority: number
  enableRetry: boolean
  retryTimes: number
  payloadTemplate: string
  authentication: string
  headerConfig: Record<string, string>
  remark: string
  status: 'active' | 'inactive'
  createdAt: string
}

// 模拟选项数据
const merchantOptions = [
  { label: 'Merchant A', value: 'merchant_A' },
  { label: 'Merchant B', value: 'merchant_B' },
  { label: 'Merchant C', value: 'merchant_C' }
]

const warehouseOptions = [
  { label: 'UNIS US', value: 'UNIS_US' },
  { label: 'UNIS EU', value: 'UNIS_EU' },
  { label: 'UNIS CN', value: 'UNIS_CN' }
]

const eventTypeOptions = [
  {
    label: 'Order Events',
    options: [
      { label: 'Order Created', value: 'order.created' },
      { label: 'Order Updated', value: 'order.updated' },
      { label: 'Order Shipped', value: 'order.shipped' },
      { label: 'Delivery Confirmed', value: 'delivery.confirmed' }
    ]
  },
  {
    label: 'Inventory Events',
    options: [
      { label: 'Inventory Changed', value: 'inventory.changed' },
      { label: 'Stock Alert', value: 'inventory.alert' }
    ]
  }
]

const returnTypeOptions = [
  { label: 'Webhook', value: 'webhook' },
  { label: 'API', value: 'api' },
  { label: 'Kafka', value: 'kafka' },
  { label: 'RabbitMQ', value: 'rabbitmq' }
]

interface AuthTypeOption {
  label: string;
  value: string;
}

// 类型定义
interface HeaderItem {
  key: string;
  value: string;
}

type ReturnTypeValue = 'webhook' | 'api' | 'kafka' | 'email' | 'none';
type AuthTypeValue = 'none' | 'header' | 'basic' | 'bearer' | 'hmac' | 'custom';

interface HmacConfig {
  algorithm: string;
  secret: string;
  signatureParam: string;
  signatureHeader: string;
  includeBody: boolean;
  includeQuery: boolean;
}

interface AuthConfig {
  username: string;
  password: string;
  token: string;
  headers: HeaderItem[];
  hmacConfig: HmacConfig;
}

interface FormData {
  ruleName: string;
  merchant: string[];
  warehouse: string[];
  eventType: string;
  returnType: ReturnTypeValue;
  targetEndpoint: string;
  priority: number;
  enableRetry: boolean;
  retryTimes: number;
  authType: AuthTypeValue;
  headers: HeaderItem[];
  payloadTemplate: string;
  authConfig: AuthConfig;
}

interface AuthTypeOption {
  label: string;
  value: AuthTypeValue;
}

// 常量定义
const ReturnTypeEnum = {
  WEBHOOK: 'webhook' as ReturnTypeValue,
  API: 'api' as ReturnTypeValue,
  KAFKA: 'kafka' as ReturnTypeValue,
  EMAIL: 'email' as ReturnTypeValue,
  NONE: 'none' as ReturnTypeValue
};

const AuthTypeEnum = {
  NONE: 'none' as AuthTypeValue,
  HEADER: 'header' as AuthTypeValue,
  BASIC: 'basic' as AuthTypeValue,
  BEARER: 'bearer' as AuthTypeValue,
  HMAC: 'hmac' as AuthTypeValue,
  CUSTOM: 'custom' as AuthTypeValue
};

// 初始化表单数据时的 authConfig
const defaultAuthConfig: AuthConfig = {
  username: '',
  password: '',
  token: '',
  headers: [],
  hmacConfig: {
    algorithm: 'SHA256',
    secret: '',
    signatureParam: 'signature',
    signatureHeader: 'X-Signature',
    includeBody: true,
    includeQuery: true
  }
};

// 模拟数据
const mockRules = ref<Rule[]>([
  {
    id: 1,
    name: '发货通知回传',
    merchant: ['merchant_A'],
    warehouse: ['UNIS_US'],
    eventType: 'delivery.confirmed',
    returnType: 'webhook',
    targetEndpoint: 'https://api.example.com/webhook',
    priority: 1,
    enableRetry: true,
    retryTimes: 3,
    payloadTemplate: '{"orderId": "{{orderId}}", "status": "{{status}}"}',
    authentication: 'bearer',
    headerConfig: {
      'Content-Type': 'application/json',
      'X-API-Key': '{{apiKey}}'
    },
    remark: '用于回传发货状态',
    status: 'active',
    createdAt: '2024-03-20'
  }
])

// 表单数据
const form = reactive({
  name: '',
  merchant: [] as string[],
  warehouse: [] as string[],
  eventType: '',
  returnType: '',
  targetEndpoint: '',
  priority: 1,
  enableRetry: true,
  retryTimes: 3,
  payloadTemplate: '',
  authentication: 'none',
  headerConfig: {} as Record<string, string>,
  remark: '',
  status: 'active' as const
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please enter rule name', trigger: 'blur' },
    { min: 3, max: 50, message: 'Length should be 3 to 50 characters', trigger: 'blur' }
  ],
  merchant: [
    { required: true, message: 'Please select at least one merchant', trigger: 'change' },
    { type: 'array', min: 1, message: 'Please select at least one merchant', trigger: 'change' }
  ],
  eventType: [
    { required: true, message: 'Please select event type', trigger: 'change' }
  ],
  returnType: [
    { required: true, message: 'Please select return type', trigger: 'change' }
  ],
  targetEndpoint: [
    { required: true, message: 'Please enter target endpoint', trigger: 'blur' }
  ],
  priority: [
    { required: true, message: 'Please enter priority', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: 'Value should be between 1 and 100', trigger: 'blur' }
  ],
  retryTimes: [
    { type: 'number', min: 0, max: 10, message: 'Value should be between 0 and 10', trigger: 'blur' }
  ],
  payloadTemplate: [
    { required: true, message: 'Please enter payload template', trigger: 'blur' }
  ]
})

// Header 配置相关方法
const addHeader = () => {
  const key = `header_${Object.keys(form.headerConfig).length + 1}`
  form.headerConfig[key] = ''
}

const deleteHeader = (key: string) => {
  delete form.headerConfig[key]
}

// 弹窗控制
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const isEdit = ref(false)
const currentId = ref<number | null>(null)

// 选中项
const selectedRules = ref<Rule[]>([])

// 搜索过滤
const filters = reactive({
  keyword: '',
  merchant: [] as string[],
  warehouse: [] as string[],
  eventType: '',
  status: '',
  dateRange: [] as string[]
})

// 日期快捷选项
const dateShortcuts = [
  {
    text: 'Last 7 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last 30 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

// 事件类型标签
const getEventTypeTag = (type: string) => {
  if (type.startsWith('order')) return 'primary'
  if (type.startsWith('inventory')) return 'warning'
  if (type.startsWith('return')) return 'success'
  return 'info'
}

// 格式化事件类型
const formatEventType = (type: string) => {
  return type.split('.').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 表格选择
const handleSelectionChange = (selection: Rule[]) => {
  selectedRules.value = selection
}

// 批量复制
const handleBatchCopy = () => {
  if (!selectedRules.value.length) {
    ElMessage.warning('Please select rules to copy')
    return
  }

  ElMessageBox.confirm(
    `Are you sure to copy ${selectedRules.value.length} rules?`,
    'Confirm',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    const now = new Date().toISOString().split('T')[0]
    const maxId = Math.max(...mockRules.value.map(r => r.id))
    
    selectedRules.value.forEach((rule, index) => {
      mockRules.value.push({
        ...rule,
        id: maxId + index + 1,
        name: `${rule.name} (Copy)`,
        createdAt: now
      })
    })

    ElMessage.success('Rules copied successfully')
    selectedRules.value = []
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (!selectedRules.value.length) {
    ElMessage.warning('Please select rules to delete')
    return
  }

  ElMessageBox.confirm(
    `Are you sure to delete ${selectedRules.value.length} rules?`,
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    const ids = selectedRules.value.map(r => r.id)
    mockRules.value = mockRules.value.filter(r => !ids.includes(r.id))
    ElMessage.success('Rules deleted successfully')
    selectedRules.value = []
  })
}

// 状态切换
const handleStatusChange = (row: Rule) => {
  ElMessage.success(`Rule status changed to ${row.status}`)
}

// 单条删除
const handleDelete = (row: Rule) => {
  ElMessageBox.confirm(
    'Are you sure to delete this rule?',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    mockRules.value = mockRules.value.filter(r => r.id !== row.id)
    ElMessage.success('Rule deleted successfully')
  })
}

// 单条复制
const handleCopy = (row: Rule) => {
  const now = new Date().toISOString().split('T')[0]
  mockRules.value.push({
    ...row,
    id: Math.max(...mockRules.value.map(r => r.id)) + 1,
    name: `${row.name} (Copy)`,
    createdAt: now
  })
  ElMessage.success('Rule copied successfully')
}

// 新建规则
const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  Object.assign(form, {
    name: '',
    merchant: [],
    warehouse: [],
    eventType: '',
    returnType: '',
    targetEndpoint: '',
    priority: 1,
    enableRetry: true,
    retryTimes: 3,
    payloadTemplate: '',
    authentication: 'none',
    headerConfig: {},
    remark: '',
    status: 'active'
  })
  dialogVisible.value = true
}

// 编辑规则
const handleEdit = (row: Rule) => {
  isEdit.value = true
  currentId.value = row.id
  Object.assign(form, {
    name: row.name,
    merchant: row.merchant,
    warehouse: row.warehouse,
    eventType: row.eventType,
    returnType: row.returnType,
    targetEndpoint: row.targetEndpoint,
    priority: row.priority,
    enableRetry: row.enableRetry,
    retryTimes: row.retryTimes,
    payloadTemplate: row.payloadTemplate,
    authentication: row.authentication,
    headerConfig: { ...row.headerConfig },
    remark: row.remark,
    status: row.status
  })
  dialogVisible.value = true
}

// 取消编辑
const handleCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
}

// 提交表单
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate((valid, fields) => {
    if (valid) {
      const now = new Date().toISOString().split('T')[0]
      
      if (isEdit.value && currentId.value !== null) {
        const index = mockRules.value.findIndex(r => r.id === currentId.value)
        if (index > -1) {
          mockRules.value[index] = {
            ...mockRules.value[index],
            ...form,
            id: currentId.value
          }
        }
      } else {
        mockRules.value.push({
          ...form,
          id: Math.max(...mockRules.value.map(r => r.id)) + 1,
          createdAt: now
        })
      }
      
      ElMessage.success(`Rule ${isEdit.value ? 'updated' : 'created'} successfully`)
      dialogVisible.value = false
      formEl.resetFields()
    } else {
      console.error('Validation failed:', fields)
    }
  })
}

// 过滤规则
const filteredRules = computed(() => {
  return mockRules.value.filter(rule => {
    const matchKeyword = !filters.keyword || 
      rule.name.toLowerCase().includes(filters.keyword.toLowerCase())
    
    const matchEventType = !filters.eventType || 
      rule.eventType === filters.eventType
    
    const matchStatus = !filters.status || 
      rule.status === filters.status
    
    const matchMerchant = filters.merchant.length === 0 || 
      filters.merchant.every(m => rule.merchant.includes(m))
    
    const matchWarehouse = filters.warehouse.length === 0 || 
      filters.warehouse.every(w => rule.warehouse.includes(w))

    const matchDate = !filters.dateRange.length || (
      rule.createdAt >= filters.dateRange[0] && 
      rule.createdAt <= filters.dateRange[1]
    )
    
    return matchKeyword && matchEventType && matchStatus && 
           matchMerchant && matchWarehouse && matchDate
  })
})

// 重置过滤器
const resetFilters = () => {
  filters.keyword = ''
  filters.merchant = []
  filters.warehouse = []
  filters.eventType = ''
  filters.status = ''
  filters.dateRange = []
}

// 应用过滤器
const applyFilters = () => {
  // 过滤逻辑已经在 computed 中实现
  ElMessage.success('Filters applied')
}

// 表单数据
const formData = ref<FormData>({
  ruleName: '',
  merchant: [],
  warehouse: [],
  eventType: '',
  returnType: ReturnTypeEnum.NONE,
  targetEndpoint: '',
  priority: 0,
  enableRetry: false,
  retryTimes: 3,
  authType: AuthTypeEnum.NONE,
  headers: [],
  payloadTemplate: '',
  authConfig: defaultAuthConfig
});

// 计算属性
const showAuthConfig = computed(() => {
  return [ReturnTypeEnum.WEBHOOK, ReturnTypeEnum.API, ReturnTypeEnum.KAFKA].includes(formData.value.returnType);
});

// 是否显示 Header 配置
const showHeaderConfig = computed(() => {
  return [
    AuthTypeEnum.HEADER,
    AuthTypeEnum.BASIC,
    AuthTypeEnum.BEARER,
    AuthTypeEnum.HMAC,
    AuthTypeEnum.CUSTOM
  ].includes(formData.value.authType);
});

const targetEndpointPlaceholder = computed(() => {
  switch (formData.value.returnType) {
    case ReturnTypeEnum.WEBHOOK:
    case ReturnTypeEnum.API:
      return '请输入回调 URL';
    case ReturnTypeEnum.KAFKA:
      return '请输入 Topic 名称';
    case ReturnTypeEnum.EMAIL:
      return '请输入邮箱地址';
    default:
      return '请输入目标地址';
  }
});

const templateLabel = computed(() => {
  return formData.value.returnType === ReturnTypeEnum.EMAIL ? '邮件模板' : 'Payload Template';
});

// 获取认证类型选项
const authTypeOptions = computed<AuthTypeOption[]>(() => {
  return [
    { label: '无认证', value: AuthTypeEnum.NONE },
    { label: 'Header 认证', value: AuthTypeEnum.HEADER },
    { label: 'Basic Auth', value: AuthTypeEnum.BASIC },
    { label: 'Bearer Token', value: AuthTypeEnum.BEARER },
    { label: 'HMAC 签名', value: AuthTypeEnum.HMAC },
    { label: '自定义认证', value: AuthTypeEnum.CUSTOM }
  ];
});

// 表单校验规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {
    ruleName: [
      { required: true, message: '请输入规则名称', trigger: 'blur' },
      { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
    ],
    merchant: [
      { required: true, message: '请选择商户', trigger: 'change' }
    ],
    eventType: [
      { required: true, message: '请选择事件类型', trigger: 'change' }
    ],
    returnType: [
      { required: true, message: '请选择回传类型', trigger: 'change' }
    ]
  };

  if (formData.value.returnType && formData.value.returnType !== ReturnTypeEnum.NONE) {
    rules.targetEndpoint = [
      { required: true, message: '请输入目标地址', trigger: 'blur' }
    ];

    if ([ReturnTypeEnum.WEBHOOK, ReturnTypeEnum.API].includes(formData.value.returnType)) {
      rules.targetEndpoint.push({
        pattern: /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
        message: '请输入有效的 URL 地址',
        trigger: 'blur'
      });
    }

    if (formData.value.returnType === ReturnTypeEnum.EMAIL) {
      rules.targetEndpoint.push({
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: '请输入有效的邮箱地址',
        trigger: 'blur'
      });
    }

    if (formData.value.returnType === ReturnTypeEnum.KAFKA) {
      rules.targetEndpoint.push({
        pattern: /^[a-zA-Z0-9._-]+$/,
        message: '请输入有效的 Topic 名称',
        trigger: 'blur'
      });
    }

    if (formData.value.returnType !== ReturnTypeEnum.NONE) {
      rules.payloadTemplate = [
        { required: true, message: '请输入模板内容', trigger: 'blur' }
      ];
    }
  }

  return rules;
});

// 方法定义
const handleAddHeader = () => {
  formData.value.headers.push({ key: '', value: '' });
};

const handleRemoveHeader = (index: number) => {
  formData.value.headers.splice(index, 1);
};

// 监听器
watch(() => formData.value.returnType, (newType) => {
  formData.value.authType = AuthTypeEnum.NONE;
  formData.value.headers = [];
  formData.value.authConfig = { ...defaultAuthConfig };
  
  if (newType === ReturnTypeEnum.NONE) {
    formData.value.targetEndpoint = '';
    formData.value.payloadTemplate = '';
  }
});

// 监听认证类型变化
watch(() => formData.value.authType, (newType) => {
  // 重置认证配置
  formData.value.authConfig = { ...defaultAuthConfig };
  
  // 根据类型初始化默认值
  if (newType === AuthTypeEnum.HEADER) {
    formData.value.authConfig.headers = [{ key: '', value: '' }];
  }
});
</script>

<style scoped>
.event-callback-routing {
  padding: 20px;
}

.routing-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 8px 0;
}

.filter-group {
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.filter-select {
  transition: all 0.3s ease;
}

.filter-select:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
  margin-top: 16px;
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

.rule-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.merchant-tag,
.warehouse-tag,
.event-type-tag,
.target-type-tag {
  font-weight: 500;
}

.status-switch {
  --el-switch-on-color: #67c23a;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-buttons .el-button {
  padding: 4px 8px;
}

.rule-dialog {
  :deep(.el-dialog__body) {
    padding: 20px 30px;
  }
}

.rule-form {
  .el-form-item {
    margin-bottom: 22px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}

:deep(.custom-select-dropdown) {
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.add-button {
  display: flex;
  align-items: center;
}

.batch-dropdown {
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 0;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-date-editor.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover),
:deep(.el-date-editor.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary);
}

:deep(.el-select .el-select__tags) {
  padding-right: 25px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

:deep(.el-collapse-transition) {
  transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out;
}

.border-t {
  border-top: 1px solid var(--el-border-color-lighter);
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

.search-form-container {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--el-box-shadow-lighter);
}

.search-form :deep(.el-input__wrapper),
.search-form :deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) !important;
}

.search-form :deep(.el-input__wrapper:hover),
.search-form :deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary) !important;
}

.search-form :deep(.el-button) {
  height: 32px;
  padding: 0 16px;
}

.advanced-search-container {
  margin-top: -8px;
}

.search-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.quick-search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color-overlay);
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quick-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-btn {
  height: 32px;
  padding: 0 20px;
}

.advanced-btn {
  font-size: 14px;
  height: 32px;
  padding: 0 12px;
}

.advanced-search {
  padding: 20px;
  background: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-lighter);
}

.advanced-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.2;
}

.advanced-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.table-card {
  margin-top: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.selected-count {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.batch-actions {
  display: flex;
  gap: 12px;
}

.rotate-180 {
  transform: rotate(180deg);
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.2;
}

.item-label.required::before {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}

.search-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
  align-self: flex-end;
}

.el-dialog {
  --el-dialog-padding-primary: 20px;
}

.el-form {
  margin-top: 20px;
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
}

.text-success {
  color: var(--el-color-success);
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.header-config {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input-number) {
  width: 200px;
}

.search-card {
  background-color: var(--el-bg-color);
}

.search-form {
  padding: 4px;
}

.search-row {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 4px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  box-shadow: none !important;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select__wrapper:hover) {
  border-color: var(--el-border-color-hover);
}

:deep(.el-input__wrapper:focus-within),
:deep(.el-select__wrapper:focus-within) {
  border-color: var(--el-color-primary);
}

.table-card {
  margin-top: 16px;
}

/* 确保下拉菜单宽度与输入框一致 */
:deep(.el-select-dropdown) {
  min-width: unset !important;
  width: 100%;
}

/* 调整下拉选项的内边距 */
:deep(.el-select-dropdown__item) {
  padding: 0 12px;
}

/* 调整下拉菜单宽度 */
:deep(.event-type-dropdown) {
  min-width: 260px !important;
  width: auto !important;
}

:deep(.status-dropdown) {
  min-width: 160px !important;
  width: auto !important;
}

/* 调整下拉选项的内边距和样式 */
:deep(.el-select-dropdown__item) {
  padding: 8px 12px;
  font-size: 14px;
}

:deep(.el-select-group__title) {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
}

/* 优化下拉框的样式 */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  box-shadow: none !important;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 0 12px;
  height: 36px;
  line-height: 36px;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select__wrapper:hover) {
  border-color: var(--el-border-color-hover);
}

:deep(.el-input__wrapper:focus-within),
:deep(.el-select__wrapper:focus-within) {
  border-color: var(--el-color-primary);
}

/* 优化搜索表单布局 */
.search-form {
  padding: 16px;
}

.search-row {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.2;
}

/* 基础样式 */
.search-form {
  padding: 16px;
}

.search-row {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.2;
}

/* 下拉框样式优化 */
:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-darker);
  box-shadow: none;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

/* 下拉菜单样式 */
:deep(.el-select-dropdown) {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-darker);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-select-dropdown__item) {
  color: var(--el-text-color-regular);
  padding: 8px 16px;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

:deep(.el-select-dropdown__item.selected) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: bold;
}

/* 调整下拉框宽度 */
.event-type-select {
  width: 300px !important;
}

.status-select {
  width: 200px !important;
}

:deep(.el-select-dropdown.event-type-select) {
  min-width: 300px !important;
}

:deep(.el-select-dropdown.status-select) {
  min-width: 200px !important;
}
</style> 