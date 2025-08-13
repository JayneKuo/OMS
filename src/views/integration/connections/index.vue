<template>
  <div class="integrations-page">
    <div class="page-header">
      <div class="title-section">
        <h2>Integrations</h2>
        <el-tooltip content="Learn more about integrations">
          <el-icon class="info-icon"><InfoFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="actions">
        <el-button type="primary" @click="handleAddIntegration">Add Integration</el-button>
        <el-button type="primary" @click="handleAddCustomIntegration">Add Custom Integration</el-button>
      </div>
    </div>

    <div class="filter-bar">
      <el-select v-model="filterType" placeholder="Type" clearable class="filter-select">
        <el-option label="All" value="" />
        <el-option :label="IntegrationType.ECOMMERCE" :value="IntegrationType.ECOMMERCE" />
        <el-option :label="IntegrationType.LOGISTICS" :value="IntegrationType.LOGISTICS" />
        <el-option :label="IntegrationType.UNIS" :value="IntegrationType.UNIS" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="Status" clearable class="filter-select">
        <el-option label="All" value="" />
        <el-option label="Connected" value="connected" />
        <el-option label="Disabled" value="disabled" />
      </el-select>
      <div class="sort-section">
        <span>Created At</span>
        <el-icon class="sort-icon" @click="toggleSort"><Sort /></el-icon>
      </div>
    </div>

    <!-- Error Alert -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      closable
      class="error-alert"
    />

    <!-- Table View -->
    <div class="table-container">
      <el-table
        :data="filteredIntegrations"
        style="width: 100%"
        @row-click="handleViewDetails"
      >
        <!-- Platform Column -->
        <el-table-column label="Platform" min-width="300">
          <template #default="{ row }">
            <div class="platform-cell">
              <div class="platform-logo">
                <img :src="row.logo" :alt="row.name" @error="handleImageError($event, row)">
                <span v-if="row.showNameFallback" class="name-fallback">
                  {{ getNameInitials(row.name) }}
            </span>
          </div>
              <div class="platform-info">
                <div class="name">{{ row.name }}</div>
                <div class="tags">
                  <el-tag size="small" :type="getTypeTagType(row.type)">{{ row.type }}</el-tag>
                  <el-tag size="small" type="info" v-if="row.subType">{{ row.subType }}</el-tag>
            </div>
          </div>
        </div>
          </template>
        </el-table-column>

        <!-- Connection Info Column -->
        <el-table-column label="Connection Info" min-width="280">
          <template #default="{ row }">
            <div class="connection-cell" v-if="row.connectionInfo">
              <template v-if="row.connectionInfo.shop_domain">
                <div class="info-item">
                  <el-icon><Link /></el-icon>
                  <span>{{ row.connectionInfo.shop_domain }}</span>
          </div>
              </template>
              <template v-if="row.connectionInfo.seller_id">
                <div class="info-item">
                  <el-icon><User /></el-icon>
                  <span>{{ row.connectionInfo.seller_id }}</span>
                </div>
              </template>
              <template v-if="row.connectionInfo.marketplace">
                <div class="info-item">
                  <el-icon><Location /></el-icon>
                  <span>{{ row.connectionInfo.marketplace }}</span>
                </div>
              </template>
              <template v-if="row.connectionInfo.warehouse_id">
                <div class="info-item">
                  <el-icon><House /></el-icon>
                  <span>Warehouse: {{ row.connectionInfo.warehouse_id }}</span>
                </div>
              </template>
              <template v-if="row.connectionInfo.account_number">
                <div class="info-item">
                  <el-icon><Document /></el-icon>
                  <span>Account: {{ row.connectionInfo.account_number }}</span>
                </div>
              </template>
            </div>
          </template>
        </el-table-column>

        <!-- Statistics Column -->
        <el-table-column label="Statistics" min-width="280">
          <template #default="{ row }">
            <div class="stats-cell" v-if="row.connectionInfo">
              <div class="stat-item" v-if="row.connectionInfo.orderCount">
                <span class="value">{{ row.connectionInfo.orderCount }}</span>
                <span class="label">Orders</span>
              </div>
              <div class="stat-item" v-if="row.connectionInfo.productCount">
                <span class="value">{{ row.connectionInfo.productCount }}</span>
                <span class="label">Products</span>
              </div>
              <div class="stat-item" v-if="row.connectionInfo.inventoryCount">
                <span class="value">{{ row.connectionInfo.inventoryCount }}</span>
                <span class="label">Inventory</span>
              </div>
              <div class="stat-item" v-if="row.connectionInfo.revenue">
                <span class="value">{{ row.connectionInfo.revenue }}</span>
                <span class="label">Revenue</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Last Sync Column -->
        <el-table-column label="Last Sync" width="180">
          <template #default="{ row }">
            <div class="sync-cell" v-if="row.connectionInfo?.lastSyncTime">
              <el-icon><Timer /></el-icon>
              <span>{{ formatDate(row.connectionInfo.lastSyncTime) }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Status Column -->
        <el-table-column label="Status" width="120">
          <template #default="{ row }">
            <div class="status-cell">
              <div class="status-tag" :class="{ 'connected': row.status === 'connected' }">
                {{ row.status === 'connected' ? 'Connected' : 'Disabled' }}
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Actions Column -->
        <el-table-column width="120" fixed="right">
          <template #default="{ row }">
            <div class="actions-cell">
            <el-switch
                v-model="row.enabled"
              :active-value="true"
              :inactive-value="false"
                :loading="loading"
                @change="(val) => handleStatusChange(row, val)"
                @click.stop
            />
              <el-dropdown trigger="click" @click.stop>
              <el-button link>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="handleDelete(row)">Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Add Integration Dialog -->
    <el-dialog
      v-model="addDialogVisible"
      :title="authDialogVisible && selectedIntegration ? `Connect ${selectedIntegration.name}` : 'Add Integration'"
      width="1200px"
      class="add-integration-dialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      :z-index="2000"
    >
      <!-- Integration List View -->
      <div v-if="!authDialogVisible" class="dialog-content">
        <div class="dialog-header">
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="Search integrations..."
            prefix-icon="Search"
            clearable
            @input="handleSearch"
            >
              <template #prefix>
                <el-icon class="search-icon"><Search /></el-icon>
              </template>
            </el-input>
        </div>
          <div class="filter-tabs">
            <el-radio-group v-model="activeType" size="large">
              <el-radio-button label="">All</el-radio-button>
              <el-radio-button :label="IntegrationType.MARKETPLACE">Marketplace</el-radio-button>
              <el-radio-button :label="IntegrationType.SOCIAL">Social Commerce</el-radio-button>
              <el-radio-button :label="IntegrationType.ECOMMERCE">E-commerce</el-radio-button>
              <el-radio-button :label="IntegrationType.LOGISTICS">3PL & Logistics</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="integration-types">
            <div class="type-grid">
              <div
              v-for="integration in filteredAvailableIntegrations"
                :key="integration.id"
                class="integration-option"
              :class="{ 'popular': isPopularIntegration(integration.id) }"
                @click="handleSelectIntegration(integration)"
              >
                <div class="integration-logo">
                  <img :src="integration.logo" :alt="integration.name" @error="handleImageError($event, integration)">
                  <span v-if="integration.showNameFallback" class="name-fallback">
                    {{ getNameInitials(integration.name) }}
                  </span>
                </div>
                <div class="integration-details">
                  <div class="name-row">
                    <h4>{{ integration.name }}</h4>
                  <el-tag 
                    size="small" 
                    :type="getTypeTagType(integration.type)"
                    effect="plain"
                  >
                    {{ integration.type }}
                  </el-tag>
                  </div>
                <p class="description">{{ integration.description }}</p>
                <div class="features" v-if="integration.features">
                  <div 
                    v-for="feature in integration.features" 
                    :key="feature"
                    class="feature-item"
                  >
                    <el-icon><Check /></el-icon>
                    <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- Auth Form View -->
      <div v-else-if="selectedIntegration && selectedIntegration.subType && AUTH_CONFIGS[selectedIntegration.subType]" class="auth-form-content">
        <div class="auth-header">
          <el-button link @click="handleBackToList">
            <el-icon><ArrowLeft /></el-icon>
            Back to integrations
          </el-button>
        </div>

        <div class="selected-integration">
          <div class="integration-logo">
            <img :src="selectedIntegration.logo" :alt="selectedIntegration.name">
          </div>
          <div class="integration-info">
            <h3>{{ selectedIntegration.name }}</h3>
            <p>{{ selectedIntegration.description }}</p>
          </div>
        </div>

        <div class="auth-form">
          <div v-if="AUTH_CONFIGS[selectedIntegration.subType].instructions" class="instructions">
            <el-alert
              type="info"
              :closable="false"
              show-icon
            >
              {{ AUTH_CONFIGS[selectedIntegration.subType].instructions }}
            </el-alert>
          </div>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="authFormRules"
            label-width="120px"
          >
            <el-form-item
              v-for="field in AUTH_CONFIGS[selectedIntegration.subType].fields"
              :key="field.key"
              :label="field.label"
              :prop="field.key"
            >
              <template v-if="field.type === 'select'">
                <el-select
                  v-model="formData[field.key]"
                  :placeholder="field.placeholder"
                  style="width: 100%"
                  @change="field.key === 'environment' ? handleEnvironmentChange($event) : undefined"
                >
                  <el-option
                    v-for="option in field.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
              
              <template v-else>
                <el-input
                  v-model="formData[field.key]"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  :show-password="field.type === 'password'"
                />
              </template>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- Dialog Footer -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">Cancel</el-button>
          <el-button 
            v-if="authDialogVisible && selectedIntegration"
            type="primary" 
            :loading="loading"
            @click="handleAuthSubmit"
          >
            Connect
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { InfoFilled, MoreFilled, Sort, Link, User, Location, House, Timer, Search, Check, ArrowLeft, Document } from '@element-plus/icons-vue'
import { useIntegration } from '@/composables/useIntegration'
import type { Integration } from '@/types/integration'
import { IntegrationType, IntegrationSubType, MOCK_INTEGRATIONS, AVAILABLE_INTEGRATIONS, AUTH_CONFIGS } from '@/constants/integration'
import type { FormInstance } from 'element-plus'

// 导入图片
import amazonLogo from '@/assets/integration/logos/amazon.png'
import walmartLogo from '@/assets/integration/logos/walmart.png'
import tiktokLogo from '@/assets/integration/logos/tiktok.png'
import shopifyLogo from '@/assets/integration/logos/shopify.png'
import wooLogo from '@/assets/integration/logos/woo.png'
import quickbooksLogo from '@/assets/integration/logos/quickbooks.png'
import unisLogo from '@/assets/integration/logos/unis.png'
import ebayLogo from '@/assets/integration/logos/ebay.png'
import upsLogo from '@/assets/integration/logos/ups.png'

// 图片映射
const logoMap: Record<string, string> = {
  amazon: amazonLogo,
  walmart: walmartLogo,
  tiktok: tiktokLogo,
  shopify: shopifyLogo,
  woocommerce: wooLogo,
  quickbooks: quickbooksLogo,
  'unis-wms': unisLogo,
  ebay: ebayLogo,
  ups: upsLogo
}

// 获取logo URL
const getLogoUrl = (integration: Integration) => {
  const id = integration.id.toString().split('-')[0] // 处理 'amazon-1' 这样的ID
  return logoMap[id] || ''
}

const router = useRouter()
const {
  loading,
  error,
  filterType,
  filterStatus,
  sortDesc,
  filteredIntegrations,
  handleStatusChange,
  deleteIntegration,
  initIntegrations
} = useIntegration()

// 状态管理
const addDialogVisible = ref(false)
const searchQuery = ref('')
const selectedIntegration = ref<Integration | null>(null)
const authDialogVisible = ref(false)
const formRef = ref<FormInstance>()
const formData = ref<Record<string, any>>({})
const activeType = ref('')

// 过滤可用集成
const filteredAvailableIntegrations = computed(() => {
  let result = [...AVAILABLE_INTEGRATIONS]
  
  // 按类型筛选
  if (activeType.value) {
    result = result.filter(item => item.type === activeType.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.features?.some(feature => feature.toLowerCase().includes(query))
    )
  }
  
  return result
})

// 生成表单验证规则
const authFormRules = computed(() => {
  const rules: Record<string, any> = {}
  if (selectedIntegration.value?.subType) {
    const config = AUTH_CONFIGS[selectedIntegration.value.subType]
    config.fields.forEach(field => {
      if (field.required) {
        rules[field.key] = [{
          required: true,
          message: `Please enter ${field.label}`,
          trigger: 'blur'
        }]
      }
    })
  }
  return rules
})

// 处理选择集成
const handleSelectIntegration = (integration: Integration) => {
  selectedIntegration.value = integration
  authDialogVisible.value = true
  formData.value = {} // 清空表单数据
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 返回集成列表
const handleBackToList = () => {
  authDialogVisible.value = false
  selectedIntegration.value = null
  formData.value = {}
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 关闭对话框
const handleCloseDialog = () => {
  if (authDialogVisible.value) {
    // 如果在授权页面，先返回列表
    handleBackToList()
  } else {
    // 如果在列表页面，关闭整个对话框
    addDialogVisible.value = false
    searchQuery.value = ''
    activeType.value = ''
    selectedIntegration.value = null
  }
}

// 提交授权表单
const handleAuthSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟成功响应
    ElMessage.success(`Successfully connected to ${selectedIntegration.value?.name}`)
    addDialogVisible.value = false // 关闭整个对话框
    
    // 重置状态
    handleBackToList()
    searchQuery.value = ''
    activeType.value = ''
    
  } catch (err) {
    // 表单验证失败
    console.error('Validation failed:', err)
  } finally {
    loading.value = false
  }
}

// 判断是否为热门集成
const isPopularIntegration = (id: string) => {
  return ['shopify', 'amazon', 'walmart', 'tiktok'].includes(id)
  }

// 获取类型标签样式
const getTypeTagType = (type: IntegrationType) => {
  switch (type) {
    case IntegrationType.MARKETPLACE:
      return 'success'
    case IntegrationType.SOCIAL:
      return 'warning'
    case IntegrationType.ECOMMERCE:
      return 'primary'
    case IntegrationType.LOGISTICS:
      return 'info'
    default:
      return 'info'
  }
}

// 获取名称缩写
const getNameInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑由computed属性处理
}

// 添加集成
const handleAddIntegration = () => {
  addDialogVisible.value = true
}

// 添加自定义集成
const handleAddCustomIntegration = () => {
  ElMessage.info('Custom integration feature is under development')
}

// 查看详情
const handleViewDetails = (row: Integration, column: any, event: Event) => {
  // 如果点击的是操作列，不进入详情
  const target = event.target as HTMLElement
  if (target.closest('.actions-cell')) {
    return
  }
  router.push({
    path: `/integration/connections/${row.id}`,
    query: {
      type: row.subType || row.type
    }
  })
}

// 处理授权成功
const handleAuthSuccess = (data: any) => {
  console.log('Authorization data:', data)
  ElMessage.success(`${selectedIntegration.value?.name} integration authorized successfully`)
  // 这里可以调用API保存授权信息
  addDialogVisible.value = false
}

// 处理删除集成
const handleDelete = async (integration: Integration) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this integration?',
      'Delete Integration',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    const success = await deleteIntegration(integration)
    if (success) {
    ElMessage.success('Integration deleted successfully')
    }
  } catch {
    // User cancelled
  }
}

// 图片加载错误处理
const handleImageError = (event: Event, item: Integration) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  item.showNameFallback = true
}

// 日期格式化
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 初始化集成数据
initIntegrations(MOCK_INTEGRATIONS)

// WMS环境 URL 配置
interface WmsUrls {
  [key: string]: {
    test: string;
    production: string;
  }
}

const WMS_URLS: WmsUrls = {
  'UNIS WMS': {
    test: 'https://api-test.unis.com',
    production: 'https://api.unis.com'
  },
  'Item WMS': {
    test: 'https://api-test.itemwms.com',
    production: 'https://api.itemwms.com'
  }
}

// 监听环境变化，自动填充 API URL
const handleEnvironmentChange = (value: string) => {
  if (!selectedIntegration.value?.subType) return
  
  const subType = selectedIntegration.value.subType
  if (subType === IntegrationSubType.UNIS_WMS) {
    formData.value.api_url = WMS_URLS['UNIS WMS'][value as 'test' | 'production']
  } else if (subType === IntegrationSubType.ITEM_WMS) {
    formData.value.api_url = WMS_URLS['Item WMS'][value as 'test' | 'production']
  }
}
</script>

<style lang="scss" scoped>
.integrations-page {
  padding: 24px;
  background-color: var(--el-bg-color-blank);
  min-height: 100%;

  .page-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .info-icon {
        color: var(--el-text-color-secondary);
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s;

        &:hover {
          color: var(--el-color-primary);
          transform: scale(1.1);
        }
      }
    }

    .actions {
      display: flex;
      gap: 12px;

      .el-button {
        height: 36px;
        padding: 0 20px;
        font-weight: 500;
      }
    }
  }

  .filter-bar {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--el-bg-color);
    border-radius: 8px;

    .filter-select {
      width: 180px;
    }

    .sort-section {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      cursor: pointer;
      color: var(--el-text-color-regular);
      transition: all 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }

      .sort-icon {
        font-size: 16px;
      }
    }
  }

  .table-container {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 0;
    margin: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;

      .el-table__row {
      cursor: pointer;
        transition: all 0.3s;

      &:hover {
          background-color: var(--el-fill-color-light) !important;
        }

        td {
          padding: 16px;
          border-bottom: 1px solid var(--el-border-color-lighter);
        }
      }

      .el-table__header {
        th {
          background-color: var(--el-bg-color) !important;
          border-bottom: 1px solid var(--el-border-color-lighter);
          padding: 12px 16px !important;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
      }
    }

    .platform-cell {
        display: flex;
        align-items: center;
        gap: 16px;

      .platform-logo {
          width: 40px;
          height: 40px;
        flex-shrink: 0;
        border-radius: 8px;
        overflow: hidden;
        background: var(--el-fill-color-blank);
        border: 1px solid var(--el-border-color-lighter);
        display: flex;
        align-items: center;
        justify-content: center;

          img {
          width: 32px;
          height: 32px;
            object-fit: contain;
          }

          .name-fallback {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
          font-weight: 600;
          font-size: 16px;
          }
        }

      .platform-info {
          flex: 1;
        min-width: 0;

            .name {
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .tags {
          display: flex;
          gap: 6px;

          .el-tag {
            --el-tag-bg-color: transparent;
            border-color: currentColor;
            text-transform: capitalize;
          }
        }
      }
            }

    .connection-cell {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--el-text-color-regular);
        font-size: 13px;

        .el-icon {
          font-size: 14px;
            color: var(--el-text-color-secondary);
        }

        span {
          flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

    .stats-cell {
        display: flex;
        align-items: center;
        gap: 24px;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;

        .value {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .sync-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--el-text-color-regular);
      font-size: 13px;

      .el-icon {
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }

    .status-cell {
      .status-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 24px;
        padding: 0 10px;
          border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        background: var(--el-fill-color);
          color: var(--el-text-color-secondary);

          &.connected {
          background: var(--el-color-success-light-9);
            color: var(--el-color-success);

          &::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
          }
        }
          }
        }

    .actions-cell {
          display: flex;
          align-items: center;
      justify-content: flex-end;
      gap: 12px;

      .el-switch {
        --el-switch-on-color: var(--el-color-success);
      }

      .el-button {
        padding: 6px;
        
        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
}

.add-integration-dialog {
  :deep(.el-dialog) {
    min-height: 700px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
      margin: 0;
      padding: 20px 24px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      .el-dialog__title {
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .el-dialog__body {
      flex: 1;
      overflow-y: auto;
    padding: 0;
    }

    .el-dialog__headerbtn {
      top: 20px;
      right: 20px;
    }
  }

  .dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .dialog-header {
      flex-shrink: 0;
      padding: 24px;
      background: var(--el-bg-color-blank);
      border-bottom: 1px solid var(--el-border-color-lighter);

    .search-section {
        margin-bottom: 24px;

      .el-input {
          width: 100%;
          
          :deep(.el-input__wrapper) {
            border-radius: 8px;
            padding-left: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

            &.is-focus {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
          }

          .search-icon {
            font-size: 18px;
            color: var(--el-text-color-secondary);
          }
        }
      }

      .filter-tabs {
        .el-radio-group {
          width: 100%;
          display: flex;
          gap: 12px;

          .el-radio-button {
            flex: 1;

            :deep(.el-radio-button__inner) {
              width: 100%;
              border-radius: 8px;
              border: 1px solid var(--el-border-color);
              
              &:not(:hover) {
                background: var(--el-bg-color-blank);
              }
            }

            &:first-child {
              :deep(.el-radio-button__inner) {
                border-left: 1px solid var(--el-border-color);
              }
            }
          }
        }
      }
    }

    .integration-types {
      flex: 1;
      padding: 24px;
      overflow-y: auto;

        .type-grid {
          display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 20px;

          .integration-option {
          position: relative;
          padding: 24px;
          background: var(--el-bg-color-blank);
          border: 1px solid var(--el-border-color-lighter);
          border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
            border-color: var(--el-color-primary);
            transform: translateY(-2px);
            box-shadow: 0 8px 23px -6px rgba(0, 0, 0, 0.12);

            .integration-logo img {
              transform: scale(1.05);
            }
          }

          &.popular::after {
            content: 'Popular';
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 4px 8px;
            background: var(--el-color-success-light-9);
            color: var(--el-color-success);
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            }

            .integration-logo {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 16px;
            background: var(--el-fill-color-blank);
            border: 1px solid var(--el-border-color-lighter);
            display: flex;
            align-items: center;
            justify-content: center;
            
            img {
              width: 40px;
              height: 40px;
                object-fit: contain;
              transition: transform 0.3s ease;
            }
          }

          .integration-details {
            .name-row {
                display: flex;
                align-items: center;
              gap: 12px;
              margin-bottom: 12px;

              h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: var(--el-text-color-primary);
                flex: 1;
              }

              .el-tag {
                --el-tag-bg-color: transparent;
                border-color: currentColor;
                text-transform: capitalize;
              }
            }

            .description {
              margin: 0 0 16px;
                font-size: 14px;
              color: var(--el-text-color-regular);
              line-height: 1.6;
            }

            .features {
              display: flex;
              flex-direction: column;
              gap: 8px;

              .feature-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--el-text-color-regular);

                .el-icon {
                  font-size: 16px;
                  color: var(--el-color-success);
                }
              }
            }
          }
        }
      }
    }
  }

  .auth-form-content {
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;

    .auth-header {
      margin: -24px -24px 0;
      padding: 0 24px 16px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      .el-button {
        display: flex;
        align-items: center;
        gap: 8px;
                  font-size: 14px;
        
        .el-icon {
          font-size: 16px;
        }
      }
    }

    .selected-integration {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin: 24px 0;
      padding: 20px;
      background: var(--el-fill-color-light);
      border-radius: 8px;

      .integration-logo {
        width: 48px;
        height: 48px;
                  flex-shrink: 0;
        border-radius: 8px;
        overflow: hidden;
        background: var(--el-bg-color-blank);
        border: 1px solid var(--el-border-color-lighter);
        display: flex;
        align-items: center;
        justify-content: center;
        
        img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }
      }

      .integration-info {
        flex: 1;
        min-width: 0;

        h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
              }

              p {
                margin: 0;
          font-size: 14px;
          color: var(--el-text-color-regular);
          line-height: 1.5;
        }
      }
    }

    .auth-form {
      flex: 1;
      overflow-y: auto;

      .instructions {
        margin-bottom: 24px;
      }

      .el-form {
        max-width: 600px;
        margin: 0 auto;
      }
    }
  }

  .dialog-footer {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color-blank);
  }
}

// 确保弹窗在最上层
:deep(.el-dialog) {
  &.add-integration-dialog {
    margin-top: 8vh !important;
              }
            }

:deep(.el-message-box) {
  z-index: 2100 !important;
}

:deep(.el-message) {
  z-index: 2200 !important;
}
</style> 