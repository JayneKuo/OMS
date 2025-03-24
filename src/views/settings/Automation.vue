<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Automation Rules</h1>
        <p class="subtitle">Configure automation rules to improve work efficiency</p>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="operation-bar">
      <div class="left-actions">
        <el-button type="primary" @click="addNewRule">
          <el-icon><Plus /></el-icon>
          Add New Rule
        </el-button>
      </div>
      <div class="right-actions">
        <el-input
          v-model="filterText"
          placeholder="Search rules..."
          prefix-icon="Search"
          clearable
          class="search-input"
        />
        <el-switch
          v-model="showDisabled"
          active-text="Show Disabled"
          class="ml-4"
        />
      </div>
    </div>

    <!-- 规则列表 -->
    <el-table
      :data="paginatedRules"
      style="width: 100%"
      class="rule-table"
    >
      <el-table-column label="Priority" width="100" sortable>
        <template #default="{ row }">
          <el-input-number 
            v-model="row.config.priority" 
            :min="0"
            :max="999"
            controls-position="right"
            size="small"
          />
        </template>
      </el-table-column>

      <el-table-column label="Rule Name" min-width="200">
        <template #default="{ row }">
          <div class="rule-name-section">
            <span class="rule-name">{{ row.name }}</span>
            <el-tag 
              v-if="row.config.mutuallyExclusive"
              type="warning"
              size="small"
              class="ml-2"
            >
              Exclusive
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Order Sources" min-width="150">
        <template #default="{ row }">
          <div class="tag-group">
            <el-tag 
              v-for="source in row.config.orderSource" 
              :key="source"
              size="small"
              class="mr-2"
            >
              {{ source }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Warehouse" min-width="150">
        <template #default="{ row }">
          <div class="tag-group">
            <el-tag 
              v-for="wh in row.config.warehouse.list" 
              :key="wh"
              size="small"
              type="success"
              class="mr-2"
            >
              {{ wh }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Address Rule" min-width="250">
        <template #default="{ row }">
          <div class="address-info">
            <div>Match: {{ row.config.deliveryAddress.matchType }}</div>
            <div>Logic: {{ row.config.deliveryAddress.logic }}</div>
            <div class="tag-group" v-if="row.config.deliveryAddress.keywords.length">
              <el-tag 
                v-for="keyword in row.config.deliveryAddress.keywords"
                :key="keyword"
                size="small"
                type="info"
                class="mr-2"
              >
                {{ keyword }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="SKU Rules" min-width="250">
        <template #default="{ row }">
          <div class="sku-info">
            <div class="tag-group" v-if="row.config.skus.list.length">
              <el-tag 
                v-for="sku in row.config.skus.list"
                :key="sku"
                size="small"
                type="danger"
                class="mr-2"
              >
                {{ sku }}
              </el-tag>
            </div>
            <div class="tag-group" v-if="row.config.skus.categories.length">
              <el-tag 
                v-for="category in row.config.skus.categories"
                :key="category"
                size="small"
                type="warning"
                class="mr-2"
              >
                {{ category }}
              </el-tag>
            </div>
            <div v-if="row.config.skus.priceRange.min || row.config.skus.priceRange.max">
              Price: 
              {{ row.config.skus.priceRange.min ? `$${row.config.skus.priceRange.min}` : '-∞' }} 
              to 
              {{ row.config.skus.priceRange.max ? `$${row.config.skus.priceRange.max}` : '+∞' }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Notifications" min-width="250">
        <template #default="{ row }">
          <div class="notification-info">
            <div class="tag-group">
              <el-tag 
                v-for="email in row.config.notifications.emails"
                :key="email"
                size="small"
                type="info"
                class="mr-2"
              >
                {{ email }}
              </el-tag>
            </div>
            <div v-if="row.config.notifications.webhook" class="webhook-info">
              <el-link type="primary" :underline="false">
                {{ row.config.notifications.webhook.url }}
              </el-link>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Status" width="100" align="center">
        <template #default="{ row, $index }">
          <el-switch
            v-model="row.enabled"
            :active-value="true"
            :inactive-value="false"
            @change="(val: boolean) => onRuleStatusChange(val, $index)"
          />
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="220" fixed="right">
        <template #default="{ $index }">
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              @click="editRule($index)"
            >
              Edit
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="cloneRule($index)"
            >
              Clone
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteRule($index)"
            >
              Delete
            </el-button>
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
        :total="filteredRules.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="editDialog.visible"
      :title="editDialog.title"
      width="800px"
      destroy-on-close
    >
      <div v-if="editDialog.currentRule" class="edit-form">
        <el-form 
          :model="editDialog.currentRule" 
          label-width="120px"
          label-position="left"
        >
          <!-- 基本信息 -->
          <el-divider content-position="left">Basic Information</el-divider>
          <el-form-item label="Rule Name" required>
            <el-input 
              v-model="editDialog.currentRule.name"
              placeholder="Enter rule name"
            />
          </el-form-item>
          <el-form-item label="Priority">
            <el-input-number
              v-model="editDialog.currentRule.config.priority"
              :min="0"
              :max="999"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="Status">
            <el-switch
              v-model="editDialog.currentRule.enabled"
              active-text="Enable"
              inactive-text="Disable"
            />
          </el-form-item>
          <el-form-item label="Exclusive">
            <el-switch
              v-model="editDialog.currentRule.config.mutuallyExclusive"
              active-text="Yes"
              inactive-text="No"
            />
          </el-form-item>

          <!-- 触发条件 -->
          <el-divider content-position="left">Trigger Conditions</el-divider>
          
          <!-- 订单来源 -->
          <el-form-item label="Order Source">
            <el-select 
              v-model="editDialog.currentRule.config.orderSource" 
              multiple 
              placeholder="Select order sources"
              clearable
            >
              <el-option label="No Limit" value="all" />
              <el-option label="Website" value="website" />
              <el-option label="Mobile App" value="app" />
              <el-option label="Third Party" value="third_party" />
              <el-option label="Offline" value="offline" />
            </el-select>
          </el-form-item>

          <!-- 仓库选择 -->
          <el-form-item label="Warehouse">
            <el-select
              v-model="editDialog.currentRule.config.warehouse.list"
              multiple
              filterable
              placeholder="Select warehouses"
              clearable
            >
              <el-option
                v-for="warehouse in warehouseOptions"
                :key="warehouse.value"
                :label="warehouse.label"
                :value="warehouse.value"
              />
            </el-select>
          </el-form-item>

          <!-- 收货地址 -->
          <el-form-item label="Delivery Address">
            <div class="address-filters">
              <el-select
                v-model="editDialog.currentRule.config.deliveryAddress.matchType"
                placeholder="Match type"
                class="match-type-select"
              >
                <el-option
                  v-for="type in MATCH_TYPES"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
              <el-select
                v-model="editDialog.currentRule.config.deliveryAddress.logic"
                placeholder="Logic"
                class="logic-select"
              >
                <el-option
                  v-for="type in LOGIC_TYPES"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
              <el-select
                v-model="editDialog.currentRule.config.deliveryAddress.keywords"
                multiple
                filterable
                allow-create
                placeholder="Enter keywords"
                class="keywords-input"
              />
            </div>
          </el-form-item>

          <!-- SKU条件 -->
          <el-form-item label="SKU Conditions">
            <div class="sku-filters">
              <el-select
                v-model="editDialog.currentRule.config.skus.list"
                multiple
                filterable
                remote
                :remote-method="searchSkus"
                placeholder="Search SKUs"
                class="sku-select"
              >
                <el-option
                  v-for="item in skuOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select
                v-model="editDialog.currentRule.config.skus.categories"
                multiple
                filterable
                placeholder="Select categories"
                class="category-select"
              >
                <el-option label="Phones" value="phones" />
                <el-option label="Laptops" value="laptops" />
                <el-option label="Accessories" value="accessories" />
              </el-select>
              <el-select
                v-model="editDialog.currentRule.config.skus.brands"
                multiple
                filterable
                placeholder="Select brands"
                class="brand-select"
              >
                <el-option label="Apple" value="apple" />
                <el-option label="Samsung" value="samsung" />
                <el-option label="Xiaomi" value="xiaomi" />
              </el-select>
              <div class="price-range">
                <el-input-number
                  v-model="editDialog.currentRule.config.skus.priceRange.min"
                  placeholder="Min price"
                  :min="0"
                  :precision="2"
                  :step="10"
                />
                <span class="mx-2">-</span>
                <el-input-number
                  v-model="editDialog.currentRule.config.skus.priceRange.max"
                  placeholder="Max price"
                  :min="0"
                  :precision="2"
                  :step="10"
                />
              </div>
            </div>
          </el-form-item>

          <!-- 通知设置 -->
          <el-divider content-position="left">Notification</el-divider>
          <el-form-item label="Email" required>
            <div class="email-input-group">
              <div v-for="(email, index) in editDialog.currentRule.config.notifications.emails" :key="index" class="email-item">
                <el-input
                  v-model="editDialog.currentRule.config.notifications.emails[index]"
                  placeholder="Enter email address"
                />
                <el-button type="danger" @click="removeEmail(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
              <el-button type="primary" @click="addEmail">Add Email</el-button>
            </div>
          </el-form-item>
          
          <el-form-item label="Webhook">
            <div class="webhook-config">
              <template v-if="!editDialog.currentRule.config.notifications.webhook">
                <el-button
                  type="primary"
                  size="small"
                  @click="editDialog.currentRule.config.notifications.webhook = { url: '' }"
                >
                  Add Webhook
                </el-button>
              </template>
              <template v-else>
                <div class="webhook-input-group">
                  <el-input
                    v-model="editDialog.currentRule.config.notifications.webhook.url"
                    placeholder="Webhook URL"
                  />
                  <el-button-group>
                    <el-button
                      type="primary"
                      size="small"
                      @click="testWebhook(editDialog.currentRule.config.notifications.webhook)"
                    >
                      Test
                    </el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click="editDialog.currentRule.config.notifications.webhook = null"
                    >
                      Remove
                    </el-button>
                  </el-button-group>
                </div>
              </template>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialog.visible = false">Cancel</el-button>
          <el-button type="primary" @click="saveEdit">Save</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Warning, Plus, Delete, Sort, Document, Bell } from '@element-plus/icons-vue'

// Types
interface AddressRule {
  keywords: string[];
  matchType: 'fuzzy' | 'exact';
  logic: 'AND' | 'OR';
  regions: string[];
}

interface SKURule {
  list: string[];
  categories: string[];
  brands: string[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
}

interface Notification {
  emails: string[];
  webhook: {
    url: string;
    headers?: Record<string, string>;
  } | null;
}

interface RuleConfig {
  priority: number;
  orderSource: string[];
  deliveryAddress: AddressRule;
  warehouse: {
    list: string[];
  };
  skus: SKURule;
  notifications: Notification;
  mutuallyExclusive: boolean;
}

interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  config: RuleConfig;
  lastTriggered?: string;
  triggerCount: number;
}

// Constants
const MATCH_TYPES = [
  { label: 'Fuzzy Match', value: 'fuzzy' },
  { label: 'Exact Match', value: 'exact' }
]

const LOGIC_TYPES = [
  { label: 'Match Any (OR)', value: 'OR' },
  { label: 'Match All (AND)', value: 'AND' }
]

// State
const viewMode = ref('list')
const filterText = ref('')
const showDisabled = ref(true)
const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const editDialog = ref({
  visible: false,
  title: '',
  currentRule: null as Rule | null,
  editIndex: -1,
  mode: 'add' as 'add' | 'edit'
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 仓库选项
const warehouseOptions = [
  { value: 'WH001', label: 'Main Warehouse' },
  { value: 'WH002', label: 'East Coast Warehouse' },
  { value: 'WH003', label: 'West Coast Warehouse' },
  { value: 'WH004', label: 'Central Warehouse' }
]

// Computed
const filteredRules = computed(() => {
  let rules = holdRules.value
  
  // Filter by enabled status
  if (!showDisabled.value) {
    rules = rules.filter(rule => rule.enabled)
  }
  
  // Filter by search text
  if (filterText.value) {
    const searchText = filterText.value.toLowerCase()
    rules = rules.filter(rule => 
      rule.name.toLowerCase().includes(searchText)
    )
  }
  
  // Sort by priority
  return rules.sort((a, b) => b.config.priority - a.config.priority)
})

const groupedRules = computed(() => {
  const groups: Record<string, Rule[]> = {}
  filteredRules.value.forEach(rule => {
    const key = rule.name
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(rule as Rule)
  })
  return groups
})

// 地址选项（示例数据）
const addressOptions = [
  {
    value: 'china',
    label: 'China',
    children: [
      {
        value: 'guangdong',
        label: 'Guangdong',
        children: [
          { value: 'shenzhen', label: 'Shenzhen' },
          { value: 'guangzhou', label: 'Guangzhou' }
        ]
      }
    ]
  }
]

// SKU选项（示例数据）
const skuOptions = ref([
  { value: 'SKU001', label: 'iPhone 13 Pro - Black' },
  { value: 'SKU002', label: 'iPhone 13 Pro - White' }
])

// 搜索SKU
const searchSkus = (query: string) => {
  // TODO: 实现SKU搜索逻辑
  console.log('搜索SKU:', query)
}

// Hold单规则列表
const holdRules = ref([
  {
    id: 'rule_001',
    name: 'VIP订单优先处理',
    enabled: true,
    triggerCount: 156,
    lastTriggered: '2024-03-15 10:30:00',
    config: {
      priority: 100,
      orderSource: ['website', 'app'],
      deliveryAddress: {
        keywords: ['上海', '北京'],
        matchType: 'fuzzy',
        logic: 'OR',
        regions: []
      },
      warehouse: {
        list: ['WH001', 'WH002']
      },
      skus: {
        list: ['SKU001', 'SKU002'],
        categories: ['phones'],
        brands: ['apple'],
        priceRange: {
          min: 5000,
          max: null
        }
      },
      notifications: {
        emails: ['vip@example.com', 'manager@example.com'],
        webhook: {
          url: 'https://api.example.com/webhook/vip'
        }
      },
      mutuallyExclusive: true
    }
  },
  {
    id: 'rule_002',
    name: '海外订单处理',
    enabled: true,
    triggerCount: 89,
    lastTriggered: '2024-03-15 09:15:00',
    config: {
      priority: 80,
      orderSource: ['website'],
      deliveryAddress: {
        keywords: ['USA', 'UK', 'Europe'],
        matchType: 'fuzzy',
        logic: 'OR',
        regions: []
      },
      warehouse: {
        list: ['WH003']
      },
      skus: {
        list: [],
        categories: ['phones', 'laptops'],
        brands: [],
        priceRange: {
          min: null,
          max: null
        }
      },
      notifications: {
        emails: ['overseas@example.com'],
        webhook: null
      },
      mutuallyExclusive: false
    }
  },
  {
    id: 'rule_003',
    name: '大额订单审核',
    enabled: true,
    triggerCount: 45,
    lastTriggered: '2024-03-14 16:20:00',
    config: {
      priority: 90,
      orderSource: ['website', 'app', 'offline'],
      deliveryAddress: {
        keywords: [],
        matchType: 'fuzzy',
        logic: 'OR',
        regions: []
      },
      warehouse: {
        list: ['WH001', 'WH002', 'WH003', 'WH004']
      },
      skus: {
        list: [],
        categories: [],
        brands: [],
        priceRange: {
          min: 10000,
          max: null
        }
      },
      notifications: {
        emails: ['finance@example.com', 'audit@example.com', 'manager@example.com'],
        webhook: {
          url: 'https://api.example.com/webhook/large-order'
        }
      },
      mutuallyExclusive: true
    }
  }
])

// 创建新规则的默认配置
const createDefaultRule = (): Rule => ({
  id: `rule_${Date.now()}`,
  name: 'New Rule',
  enabled: false,
  triggerCount: 0,
  lastTriggered: '',
  config: {
    priority: 0,
    orderSource: [],
    deliveryAddress: {
      keywords: [],
      matchType: 'fuzzy',
      logic: 'OR',
      regions: []
    },
    warehouse: {
      list: []
    },
    skus: {
      list: [],
      categories: [],
      brands: [],
      priceRange: {
        min: null,
        max: null
      }
    },
    notifications: {
      emails: [],
      webhook: null
    },
    mutuallyExclusive: false
  }
})

// 添加新规则
const addNewRule = () => {
  const newRule = createDefaultRule()
  editDialog.value = {
    visible: true,
    title: 'Add New Rule',
    currentRule: newRule,
    editIndex: -1,
    mode: 'add'
  }
}

// 编辑规则
const editRule = (index: number) => {
  editDialog.value = {
    visible: true,
    title: `Edit Rule - ${holdRules.value[index].name}`,
    currentRule: JSON.parse(JSON.stringify(holdRules.value[index])),
    editIndex: index,
    mode: 'edit'
  }
}

// 保存编辑
const saveEdit = () => {
  if (!editDialog.value.currentRule) return
  
  // 验证必填字段
  if (!editDialog.value.currentRule.name) {
    ElMessage.error('Please enter rule name')
    return
  }
  
  if (!editDialog.value.currentRule.config.notifications.emails.length) {
    ElMessage.error('Please enter at least one notification email')
    return
  }
  
  // 保存编辑
  if (editDialog.value.mode === 'edit' && editDialog.value.editIndex > -1) {
    holdRules.value[editDialog.value.editIndex] = JSON.parse(
      JSON.stringify(editDialog.value.currentRule)
    )
    ElMessage.success('Rule updated')
  } else if (editDialog.value.mode === 'add') {
    holdRules.value.push(JSON.parse(JSON.stringify(editDialog.value.currentRule)))
    ElMessage.success('Rule added')
  }
  
  editDialog.value.visible = false
}

// 切换规则状态
const toggleRule = (index: number) => {
  holdRules.value[index].enabled = !holdRules.value[index].enabled
  onRuleStatusChange(holdRules.value[index].enabled, index)
}

// 删除规则
const deleteRule = (index: number) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this rule?',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    holdRules.value.splice(index, 1)
    ElMessage.success('Rule deleted')
  })
}

// 规则状态改变
const onRuleStatusChange = (value: boolean, index: number) => {
  holdRules.value[index].enabled = value
  ElMessage.success(`Rule "${holdRules.value[index].name}" ${value ? 'enabled' : 'disabled'}`)
}

// 格式化时间范围
const formatTimeRange = (orderTime: any) => {
  if (!orderTime.enabled) return 'No limit'
  return `${orderTime.start} - ${orderTime.end}`
}

// 格式化排期
const formatSchedule = (schedule: any) => {
  if (schedule.type === 'permanent') return 'Permanent'
  return `${schedule.effectiveDate} to ${schedule.expiryDate}`
}

// 保存所有规则
const saveAllRules = () => {
  // Validate email
  const invalidRules = holdRules.value.filter(rule => !rule.config.notifications.emails.length)
  if (invalidRules.length > 0) {
    ElMessage.error('Please enter at least one notification email for all rules')
    return
  }

  // TODO: Call API to save configuration
  console.log('Saving rules:', holdRules.value)
  ElMessage.success('All rules saved')
}

// 重置所有规则
const resetAllRules = () => {
  ElMessageBox.confirm(
    'Are you sure you want to reset all rules?',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    holdRules.value = [createDefaultRule()]
    ElMessage.success('All rules reset')
  })
}

// 在 script setup 中添加新的方法
const formatAddressRule = (addressRule: AddressRule) => {
  const parts = []
  if (addressRule.regions.length) {
    parts.push(`Regions: ${addressRule.regions.join(', ')}`)
  }
  if (addressRule.keywords.length) {
    parts.push(`Keywords: ${addressRule.keywords.join(` ${addressRule.logic} `)}`)
  }
  return parts.join('\n')
}

const hasSKUConditions = (skuRule: SKURule) => {
  return skuRule.list.length > 0 || 
         skuRule.categories.length > 0 || 
         skuRule.brands.length > 0 || 
         skuRule.priceRange.min !== null || 
         skuRule.priceRange.max !== null
}

const formatSKURule = (skuRule: SKURule) => {
  const parts = []
  if (skuRule.list.length) {
    parts.push(`SKUs: ${skuRule.list.length}`)
  }
  if (skuRule.categories.length) {
    parts.push(`Categories: ${skuRule.categories.join(', ')}`)
  }
  if (skuRule.brands.length) {
    parts.push(`Brands: ${skuRule.brands.join(', ')}`)
  }
  if (skuRule.priceRange.min !== null || skuRule.priceRange.max !== null) {
    const range = []
    if (skuRule.priceRange.min !== null) range.push(`>= $${skuRule.priceRange.min}`)
    if (skuRule.priceRange.max !== null) range.push(`<= $${skuRule.priceRange.max}`)
    parts.push(`Price: ${range.join(' AND ')}`)
  }
  return parts.join('\n')
}

const cloneRule = (index: number) => {
  const rule = JSON.parse(JSON.stringify(holdRules.value[index]))
  rule.id = `rule_${Date.now()}`
  rule.name = `${rule.name} (Copy)`
  rule.enabled = false
  holdRules.value.push(rule)
  ElMessage.success('Rule cloned')
}

const viewLogs = (index: number) => {
  const rule = holdRules.value[index]
  // TODO: 实现日志查看功能
  console.log('View logs for rule:', rule.id)
}

const testWebhook = async (webhook: { url: string; headers?: Record<string, string> } | null) => {
  if (!webhook?.url) {
    ElMessage.warning('Please enter webhook URL first')
    return
  }

  try {
    // TODO: 实现实际的 webhook 测试逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Webhook test successful')
  } catch (error) {
    ElMessage.error('Webhook test failed: ' + (error as Error).message)
  }
}

// 分页数据
const paginatedRules = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRules.value.slice(start, end)
})

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 添加邮箱
const addEmail = () => {
  if (!editDialog.value.currentRule) return
  editDialog.value.currentRule.config.notifications.emails.push('')
}

// 删除邮箱
const removeEmail = (index: number) => {
  if (!editDialog.value.currentRule) return
  editDialog.value.currentRule.config.notifications.emails.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    color: var(--text-primary);
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
  }
}

.operation-bar {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .left-actions,
  .right-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .search-input {
    width: 240px;
  }
}

.rule-table {
  margin-bottom: 24px;
  
  .rule-details {
    padding: 16px;
    
    .el-descriptions {
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .address-detail,
    .sku-detail,
    .time-detail,
    .notification-detail {
      > div {
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .rule-name-section {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .rule-name {
      font-weight: 500;
    }
  }
  
  .condition-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .schedule-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.mt-4 {
  margin-top: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.ml-2 {
  margin-left: 8px;
}

.ml-4 {
  margin-left: 16px;
}

.edit-form {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 20px;
  
  .el-form {
    margin-top: 20px;
  }
  
  .address-filters {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    
    .match-type-select,
    .logic-select {
      width: 150px;
    }
    
    .keywords-input {
      flex: 1;
    }
  }
  
  .sku-filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .sku-select,
    .category-select,
    .brand-select {
      width: 100%;
    }
    
    .price-range {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .el-input-number {
        width: 150px;
      }
    }
  }
  
  .time-schedule {
    .daily-range,
    .schedule-type-select {
      margin-top: 12px;
    }
    
    .el-checkbox-group {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  }
  
  .webhook-config {
    .webhook-input-group {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      
      .el-input {
        flex: 1;
      }
    }
  }
}

.dialog-footer {
  padding: 20px 0;
  text-align: right;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
}

.address-info,
.sku-info,
.time-info,
.notification-info {
  font-size: 12px;
  
  > div {
    margin-bottom: 4px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.webhook-info {
  margin-top: 4px;
}

.rule-table {
  .el-table__row {
    .cell {
      padding: 12px;
    }
  }
  
  .tag-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 6px;
  }
  
  .rule-name-section {
    .rule-name {
      font-weight: 500;
      font-size: 14px;
    }
  }
  
  .address-info,
  .sku-info,
  .notification-info {
    font-size: 13px;
    line-height: 1.5;
    
    > div {
      margin-bottom: 6px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.email-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .email-item {
    display: flex;
    gap: 8px;
    align-items: center;
    
    .el-input {
      flex: 1;
    }
  }
}
</style> 