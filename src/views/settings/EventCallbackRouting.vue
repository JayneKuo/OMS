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

      <!-- Return Configuration -->
      <div class="form-section">
        <h3 class="form-section-title">Return Configuration</h3>
        <el-form-item label="Return Type" prop="returnType">
          <el-select 
            v-model="form.returnType" 
            placeholder="Select return type"
            class="w-full"
          >
            <el-option
              v-for="option in RETURN_TYPE_OPTIONS"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item 
          v-if="form.returnType !== ReturnTypeEnum.NONE"
          label="Target Endpoint" 
          prop="targetEndpoint"
          :rules="targetEndpointRules"
        >
          <el-input
            v-model="form.targetEndpoint"
            :placeholder="targetEndpointPlaceholder"
            @blur="validateField('targetEndpoint')"
          >
            <template #prepend v-if="form.returnType === ReturnTypeEnum.WEBHOOK || form.returnType === ReturnTypeEnum.API">
              https://
            </template>
          </el-input>
          <div class="mt-1 text-gray-500 text-sm">
            <template v-if="form.returnType === ReturnTypeEnum.WEBHOOK">
              The webhook URL where event data will be sent. Must be a valid HTTPS URL.
            </template>
            <template v-else-if="form.returnType === ReturnTypeEnum.EMAIL">
              The email address(es) to receive event notifications. Separate multiple addresses with commas.
            </template>
            <template v-else-if="form.returnType === ReturnTypeEnum.API">
              The API endpoint to receive event data. Must be a valid HTTPS URL.
            </template>
            <template v-else-if="form.returnType === ReturnTypeEnum.TOPIC">
              The topic name for event publishing. Use forward slashes (/) for hierarchical topics.
            </template>
          </div>
        </el-form-item>
      </div>

      <!-- Retry Configuration -->
      <div class="form-section">
        <h3 class="form-section-title">Retry Configuration</h3>
        <el-form-item label="Enable Retry">
          <el-switch v-model="form.enableRetry" />
        </el-form-item>

        <el-form-item 
          v-if="form.enableRetry"
          label="Retry Times" 
          prop="retryTimes"
        >
          <el-input-number 
            v-model="form.retryTimes" 
            :min="1" 
            :max="10"
            class="w-[200px]"
          />
          <div class="mt-1 text-gray-500 text-sm">
            Maximum number of retry attempts if the event delivery fails.
          </div>
        </el-form-item>
      </div>

      <!-- Authentication Configuration -->
      <div class="form-section">
        <h3 class="form-section-title">Authentication</h3>
        <el-form-item label="Authentication Type" prop="authentication">
          <el-select v-model="form.authentication" placeholder="Select authentication type" class="w-full">
            <el-option
              v-for="option in AUTH_TYPE_OPTIONS"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- Basic Auth Configuration -->
        <template v-if="form.authentication === 'basic'">
          <el-form-item label="Username" prop="authConfig.username" required>
            <el-input v-model="form.authConfig.username" placeholder="Enter username" />
          </el-form-item>
          <el-form-item label="Password" prop="authConfig.password" required>
            <el-input v-model="form.authConfig.password" type="password" placeholder="Enter password" show-password />
          </el-form-item>
        </template>

        <!-- Bearer Token Configuration -->
        <template v-if="form.authentication === 'bearer'">
          <el-form-item label="Token" prop="authConfig.token" required>
            <el-input v-model="form.authConfig.token" placeholder="Enter Bearer Token" />
          </el-form-item>
        </template>

        <!-- HMAC Signature Configuration -->
        <template v-if="form.authentication === 'hmac'">
          <el-form-item label="Algorithm" prop="authConfig.hmacConfig.algorithm" required>
            <el-select v-model="form.authConfig.hmacConfig.algorithm" placeholder="Select algorithm" class="w-full">
              <el-option label="SHA256" value="SHA256" />
              <el-option label="SHA512" value="SHA512" />
              <el-option label="MD5" value="MD5" />
            </el-select>
          </el-form-item>
          <el-form-item label="Secret Key" prop="authConfig.hmacConfig.secret" required>
            <el-input v-model="form.authConfig.hmacConfig.secret" placeholder="Enter secret key" show-password />
          </el-form-item>
          <el-form-item label="Signature Parameter" prop="authConfig.hmacConfig.signatureParam" required>
            <el-input v-model="form.authConfig.hmacConfig.signatureParam" placeholder="Enter signature parameter name" />
          </el-form-item>
          <el-form-item label="Signature Header" prop="authConfig.hmacConfig.signatureHeader" required>
            <el-input v-model="form.authConfig.hmacConfig.signatureHeader" placeholder="Enter signature header name" />
          </el-form-item>
          <el-form-item label="Signature Scope">
            <div class="flex gap-4">
              <el-checkbox v-model="form.authConfig.hmacConfig.includeBody">Include Request Body</el-checkbox>
              <el-checkbox v-model="form.authConfig.hmacConfig.includeQuery">Include Query Parameters</el-checkbox>
            </div>
          </el-form-item>
        </template>

        <!-- Header Authentication Configuration -->
        <template v-if="form.authentication === 'header'">
          <el-form-item label="Headers Configuration" prop="authConfig.headers">
            <div class="header-config">
              <div v-for="(header, index) in form.authConfig.headers" :key="index" class="header-item mb-2">
                <div class="flex items-center gap-2 w-full">
                  <el-input v-model="header.key" placeholder="Header name" class="header-key" />
                  <el-input v-model="header.value" placeholder="Header value" class="header-value" />
                  <el-button type="danger" link @click="deleteHeader(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <el-button @click="addHeader" type="primary" plain class="mt-2">
                <el-icon><Plus /></el-icon>
                Add Header
              </el-button>
            </div>
          </el-form-item>
        </template>

        <!-- Custom Authentication Configuration -->
        <template v-if="form.authentication === 'custom'">
          <el-form-item label="Custom Configuration" prop="authConfig.custom" required>
            <el-input
              v-model="form.authConfig.custom"
              type="textarea"
              :rows="4"
              placeholder="Enter custom authentication configuration (JSON format)"
            />
          </el-form-item>
        </template>
      </div>

      <!-- Additional Info -->
      <div class="form-section">
        <h3 class="form-section-title">Additional Information</h3>
        <el-form-item label="Status">
          <div class="flex items-center gap-4">
            <el-switch
              v-model="form.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              :disabled="form.returnType !== ReturnTypeEnum.NONE && !testPassed"
            />
            <span class="text-sm text-gray-500" v-if="form.returnType !== ReturnTypeEnum.NONE && !testPassed">
              请先测试连接成功后才能启用
            </span>
          </div>
        </el-form-item>

        <el-form-item label="Remark">
          <el-input 
            v-model="form.remark" 
            type="textarea" 
            :rows="3" 
            placeholder="Enter remark"
          />
        </el-form-item>

        <!-- 测试连接按钮 -->
        <el-form-item v-if="form.returnType !== ReturnTypeEnum.NONE">
          <div class="flex items-center gap-4">
            <el-button 
              type="primary" 
              :loading="testingConnection"
              @click="testConnection"
            >
              测试连接
            </el-button>
            <div v-if="testResult" :class="['flex items-center gap-2', testPassed ? 'text-success' : 'text-danger']">
              <el-icon v-if="testPassed"><circle-check-filled /></el-icon>
              <el-icon v-else><circle-close-filled /></el-icon>
              <span>{{ testResult }}</span>
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
    
    <template #footer>
      <el-button @click="handleCancel(formRef)">Cancel</el-button>
      <el-button 
        type="primary" 
        @click="handleSubmit(formRef)"
        :disabled="form.returnType !== ReturnTypeEnum.NONE && !testPassed"
      >
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
import type { FormInstance, FormRules, FormItemRule } from 'element-plus'

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

enum ReturnTypeEnum {
  NONE = 'none',
  WEBHOOK = 'webhook',
  EMAIL = 'email',
  API = 'api',
  TOPIC = 'topic'
}

type ReturnType = ReturnTypeEnum;

// Return type options
const RETURN_TYPE_OPTIONS = [
  { label: 'None', value: ReturnTypeEnum.NONE },
  { label: 'Webhook', value: ReturnTypeEnum.WEBHOOK },
  { label: 'Email', value: ReturnTypeEnum.EMAIL },
  { label: 'API', value: ReturnTypeEnum.API },
  { label: 'Topic', value: ReturnTypeEnum.TOPIC }
];

type AuthType = 'none' | 'header' | 'basic' | 'bearer' | 'hmac' | 'custom';

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
  custom: string;
}

interface FormData {
  ruleName: string;
  merchant: string[];
  warehouse: string[];
  eventType: string;
  returnType: ReturnType;
  targetEndpoint: string;
  priority: number;
  enableRetry: boolean;
  retryTimes: number;
  authType: AuthType;
  headers: HeaderItem[];
  payloadTemplate: string;
  authConfig: AuthConfig;
}

interface AuthTypeOption {
  label: string;
  value: AuthType;
}

// 常量定义
const AuthTypeEnum = {
  NONE: 'none' as AuthType,
  HEADER: 'header' as AuthType,
  BASIC: 'basic' as AuthType,
  BEARER: 'bearer' as AuthType,
  HMAC: 'hmac' as AuthType,
  CUSTOM: 'custom' as AuthType
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
  },
  custom: '' // For custom auth
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
  status: 'active' as const,
  authConfig: defaultAuthConfig // Initialize authConfig
})

// 添加测试状态相关的变量
const testingConnection = ref(false)
const testPassed = ref(false)
const testResult = ref('')

// 测试连接方法
const testConnection = async () => {
  if (!form.targetEndpoint) {
    ElMessage.warning('请先输入目标地址')
    return
  }

  testingConnection.value = true
  testPassed.value = false
  testResult.value = ''
  
  try {
    // 根据不同的返回类型构建测试数据
    const testData = {
      eventType: form.eventType || 'test.event',
      timestamp: new Date().toISOString(),
      data: {
        message: '这是一条测试消息',
        testId: Date.now()
      }
    }

    // 构建请求配置
    const requestConfig: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    // 根据认证类型添加认证信息
    if (form.authentication === 'basic') {
      const base64Auth = btoa(`${form.authConfig.username}:${form.authConfig.password}`)
      requestConfig.headers['Authorization'] = `Basic ${base64Auth}`
    } else if (form.authentication === 'bearer') {
      requestConfig.headers['Authorization'] = `Bearer ${form.authConfig.token}`
    } else if (form.authentication === 'header') {
      form.authConfig.headers.forEach(header => {
        requestConfig.headers[header.key] = header.value
      })
    } else if (form.authentication === 'hmac') {
      // 计算HMAC签名
      const message = JSON.stringify(testData)
      const signatureHeader = form.authConfig.hmacConfig.signatureHeader || 'X-Signature'
      // 这里需要实现HMAC签名的计算
      requestConfig.headers[signatureHeader] = 'test-signature'
    }

    let testEndpoint = form.targetEndpoint
    if (form.returnType === ReturnTypeEnum.WEBHOOK || form.returnType === ReturnTypeEnum.API) {
      testEndpoint = testEndpoint.startsWith('http') ? testEndpoint : `https://${testEndpoint}`
    }

    // 发送测试请求
    const response = await fetch(testEndpoint, {
      ...requestConfig,
      body: JSON.stringify(testData)
    })

    if (response.ok) {
      testPassed.value = true
      testResult.value = '连接测试成功！'
      ElMessage.success('连接测试成功！')
    } else {
      testPassed.value = false
      throw new Error(`请求失败: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error('测试连接失败:', error)
    testResult.value = `连接测试失败: ${error.message}`
    ElMessage.error(`连接测试失败: ${error.message}`)
  } finally {
    testingConnection.value = false
  }
}

// 监听表单变化，重置测试状态
watch(
  () => [form.returnType, form.targetEndpoint, form.authentication, form.authConfig],
  () => {
    testPassed.value = false
    testResult.value = ''
  },
  { deep: true }
)

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
});

// 添加认证配置的验证规则
const authConfigRules = {
  username: [
    { required: true, message: 'Please enter username for Basic Auth', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter password for Basic Auth', trigger: 'blur' }
  ],
  token: [
    { required: true, message: 'Please enter token for Bearer Token', trigger: 'blur' }
  ],
  hmacConfig: {
    algorithm: [
      { required: true, message: 'Please select algorithm for HMAC', trigger: 'change' }
    ],
    secret: [
      { required: true, message: 'Please enter secret for HMAC', trigger: 'blur' }
    ],
    signatureParam: [
      { required: true, message: 'Please enter signature parameter name for HMAC', trigger: 'blur' }
    ],
    signatureHeader: [
      { required: true, message: 'Please enter signature header name for HMAC', trigger: 'blur' }
    ]
  },
  custom: [
    { required: true, message: 'Please enter custom authentication config for Custom Auth', trigger: 'blur' }
  ],
  headers: [
    { 
      validator: (rule: any, value: HeaderItem[], callback: Function) => {
        if (form.authentication === 'header') {
          if (!Array.isArray(value) || value.length === 0) {
            callback(new Error('Please add at least one header'));
            return;
          }
          for (const header of value) {
            if (!header.key || !header.value) {
              callback(new Error('Header name and value are required'));
              return;
            }
          }
        }
        callback();
      },
      trigger: 'change'
    }
  ]
};

// Header 配置相关方法
const addHeader = () => {
  if (!Array.isArray(form.authConfig.headers)) {
    form.authConfig.headers = [];
  }
  form.authConfig.headers.push({ key: '', value: '' });
};

const deleteHeader = (index: number) => {
  if (Array.isArray(form.authConfig.headers)) {
    form.authConfig.headers.splice(index, 1);
  }
};

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
    status: 'active',
    authConfig: defaultAuthConfig // Reset authConfig
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
    status: row.status,
    authConfig: { ...row.authConfig } // Assign authConfig
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

// Validation patterns
const VALIDATION_PATTERNS = {
  // 支持多级域名、允许 IP 地址、支持端口号、支持路径和查询参数
  URL: /^https?:\/\/(?:(?:[\w-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(?::\d{1,5})?(?:\/[\w-./?%&=]*)?$/,
  
  // 支持多级域名、允许带名字的邮箱地址、支持多个邮箱（逗号分隔）
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|\[(?:\d{1,3}\.){3}\d{1,3}\])(?:\s*,\s*[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|\[(?:\d{1,3}\.){3}\d{1,3}\]))*$/,
  
  // 支持字母、数字、下划线、中划线、点号、斜杠，但不能以特殊字符开头或结尾
  TOPIC: /^[a-zA-Z0-9](?:[a-zA-Z0-9._/-]*[a-zA-Z0-9])?$/
};

// Validation messages
const VALIDATION_MESSAGES = {
  URL: {
    pattern: 'Please enter a valid URL. Examples:\n' +
      '- https://api.example.com\n' +
      '- http://192.168.1.1:8080/webhook\n' +
      '- https://api.example.com/callback?token=123'
  },
  EMAIL: {
    pattern: 'Please enter valid email address(es). Examples:\n' +
      '- user@example.com\n' +
      '- user.name@sub.example.com\n' +
      '- user1@example.com, user2@example.com'
  },
  TOPIC: {
    pattern: 'Please enter a valid topic name. Examples:\n' +
      '- my-topic\n' +
      '- order/status/updated\n' +
      '- user.notification.email'
  }
};

// Computed properties
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
      return 'Enter webhook URL (e.g., api.example.com/webhook)';
    case ReturnTypeEnum.EMAIL:
      return 'Enter email address(es), separate multiple with commas';
    case ReturnTypeEnum.API:
      return 'Enter API endpoint URL (e.g., api.example.com/callback)';
    case ReturnTypeEnum.TOPIC:
      return 'Enter topic name (e.g., order/status/updated)';
    default:
      return 'Enter target endpoint';
  }
});

const targetEndpointRules = computed(() => {
  const rules: FormItemRule[] = [
    { required: true, message: 'Please enter target endpoint', trigger: 'blur' }
  ];

  switch (formData.value.returnType) {
    case ReturnTypeEnum.WEBHOOK:
    case ReturnTypeEnum.API:
      rules.push({
        pattern: VALIDATION_PATTERNS.URL,
        message: VALIDATION_MESSAGES.URL.pattern,
        trigger: 'blur'
      });
      break;
    case ReturnTypeEnum.EMAIL:
      rules.push({
        pattern: VALIDATION_PATTERNS.EMAIL,
        message: VALIDATION_MESSAGES.EMAIL.pattern,
        trigger: 'blur'
      });
      break;
    case ReturnTypeEnum.TOPIC:
      rules.push({
        pattern: VALIDATION_PATTERNS.TOPIC,
        message: VALIDATION_MESSAGES.TOPIC.pattern,
        trigger: 'blur'
      });
      break;
  }

  return rules;
});

const templateLabel = computed(() => {
  return formData.value.returnType === ReturnTypeEnum.EMAIL ? '邮件模板' : 'Payload Template';
});

// 获取认证类型选项
const AUTH_TYPE_OPTIONS = computed<AuthTypeOption[]>(() => {
  return [
    { label: 'None', value: AuthTypeEnum.NONE },
    { label: 'Basic Auth', value: AuthTypeEnum.BASIC },
    { label: 'Bearer Token', value: AuthTypeEnum.BEARER },
    { label: 'HMAC Signature', value: AuthTypeEnum.HMAC },
    { label: 'Header Authentication', value: AuthTypeEnum.HEADER },
    { label: 'Custom', value: AuthTypeEnum.CUSTOM }
  ];
});

// 表单校验规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {
    ruleName: [
      { required: true, message: 'Please enter rule name', trigger: 'blur' },
      { min: 3, max: 50, message: 'Length should be 3 to 50 characters', trigger: 'blur' }
    ],
    merchant: [
      { required: true, message: 'Please select merchant', trigger: 'change' }
    ],
    eventType: [
      { required: true, message: 'Please select event type', trigger: 'change' }
    ],
    returnType: [
      { required: true, message: 'Please select return type', trigger: 'change' }
    ]
  };

  if (formData.value.returnType && formData.value.returnType !== ReturnTypeEnum.NONE) {
    rules.targetEndpoint = [
      { required: true, message: 'Please enter target endpoint', trigger: 'blur' }
    ];

    if ([ReturnTypeEnum.WEBHOOK, ReturnTypeEnum.API].includes(formData.value.returnType)) {
      rules.targetEndpoint.push({
        pattern: VALIDATION_PATTERNS.URL,
        message: VALIDATION_MESSAGES.URL.pattern,
        trigger: 'blur'
      });
    }

    if (formData.value.returnType === ReturnTypeEnum.EMAIL) {
      rules.targetEndpoint.push({
        pattern: VALIDATION_PATTERNS.EMAIL,
        message: VALIDATION_MESSAGES.EMAIL.pattern,
        trigger: 'blur'
      });
    }

    if (formData.value.returnType === ReturnTypeEnum.KAFKA) {
      rules.targetEndpoint.push({
        pattern: VALIDATION_PATTERNS.TOPIC,
        message: VALIDATION_MESSAGES.TOPIC.pattern,
        trigger: 'blur'
      });
    }

    if (formData.value.returnType !== ReturnTypeEnum.NONE) {
      rules.payloadTemplate = [
        { required: true, message: 'Please enter template content', trigger: 'blur' }
      ];
    }
  }

  // Add validation for authConfig
  rules.authConfig = {
    username: [
      { required: true, message: 'Please enter username', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'Please enter password', trigger: 'blur' }
    ],
    token: [
      { required: true, message: 'Please enter token', trigger: 'blur' }
    ],
    hmacConfig: {
      algorithm: [
        { required: true, message: 'Please select algorithm', trigger: 'change' }
      ],
      secret: [
        { required: true, message: 'Please enter secret key', trigger: 'blur' }
      ],
      signatureParam: [
        { required: true, message: 'Please enter signature parameter', trigger: 'blur' }
      ],
      signatureHeader: [
        { required: true, message: 'Please enter signature header', trigger: 'blur' }
      ],
      includeBody: [
        { type: 'boolean', message: 'Please select if body is included', trigger: 'change' }
      ],
      includeQuery: [
        { type: 'boolean', message: 'Please select if query is included', trigger: 'change' }
      ]
    },
    custom: [
      { required: true, message: 'Please enter custom authentication config', trigger: 'blur' }
    ],
    headers: [
      { 
        validator: (rule: any, value: HeaderItem[], callback: Function) => {
          if (formData.value.authType === AuthTypeEnum.HEADER) {
            if (!Array.isArray(value) || value.length === 0) {
              callback(new Error('Please add at least one header'));
              return;
            }
            for (const header of value) {
              if (!header.key || !header.value) {
                callback(new Error('Header name and value are required'));
                return;
              }
            }
          }
          callback();
        },
        trigger: 'change'
      }
    ]
  };

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

.text-danger {
  color: var(--el-color-danger);
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

.header-config {
  .header-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .header-key {
      width: 200px;
    }

    .header-value {
      width: 300px;
    }
  }
}

.form-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:last-child {
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
}

:deep(.el-form-item) {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  box-shadow: none;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &.is-focus {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary) inset;
  }
}
</style> 