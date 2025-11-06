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
                <div class="rating-row">
                  <el-rate
                    :model-value="getIntegrationRating(row.id.toString().split('-')[0])"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                    size="small"
                  />
                  <span class="review-count">({{ getIntegrationReviewCount(row.id.toString().split('-')[0]) }})</span>
                </div>
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
                  
                  <!-- Star Rating -->
                  <div class="rating-section">
                    <el-rate
                      :model-value="getIntegrationRating(integration.id)"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                      size="small"
                    />
                    <span class="rating-count">({{ getIntegrationReviewCount(integration.id) }} reviews)</span>
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
          <!-- Error Alert -->
          <div v-if="authError" class="error-alert">
            <el-alert
              :title="authError"
              type="error"
              show-icon
              closable
              @close="authError = null"
            />
          </div>
          
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
            <!-- Connector Name Field -->
            <el-form-item
              label="Connector Name"
              prop="connectorName"
              class="connector-name-field"
            >
              <el-input
                v-model="formData.connectorName"
                placeholder="Enter a custom name for this connection"
                :maxlength="50"
                show-word-limit
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
              <div class="field-hint">
                This name will help you identify this connection in your integration list
              </div>
            </el-form-item>

            <!-- Merchant Selection Field -->
            <el-form-item
              label="Merchant"
              prop="merchant"
              class="merchant-field"
            >
              <el-select
                v-model="formData.merchant"
                placeholder="Select a merchant"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="merchant in merchantOptions"
                  :key="merchant.value"
                  :label="merchant.label"
                  :value="merchant.value"
                >
                  <div class="merchant-option">
                    <span class="merchant-name">{{ merchant.label }}</span>
                    <span v-if="merchant.description" class="merchant-desc">{{ merchant.description }}</span>
                  </div>
                </el-option>
                
                <!-- Auto Create Option -->
                <el-option
                  value="__auto_create__"
                  label="Auto Create New Merchant"
                >
                  <div class="merchant-option auto-create-option">
                    <el-icon><Plus /></el-icon>
                    <span class="merchant-name">Auto Create New Merchant</span>
                  </div>
                </el-option>
              </el-select>
              <div class="field-hint">
                Select an existing merchant or choose "Auto Create" to automatically create a new merchant for this connection
              </div>
              
              <!-- Auto Create New Merchant Input -->
              <div v-if="formData.merchant === '__auto_create__'" class="auto-create-section">
                <div class="auto-create-header">
                  <el-icon><Shop /></el-icon>
                  <span>New Merchant Information</span>
                </div>
                
                <div class="auto-create-fields">
                  <!-- Merchant Name -->
                  <div class="field-row">
                    <label class="field-label">
                      Merchant Name <span class="required-star">*</span>
                    </label>
                    <el-input
                      v-model="formData.newMerchantName"
                      placeholder="Enter merchant name"
                      :maxlength="50"
                      show-word-limit
                      clearable
                    >
                      <template #prefix>
                        <el-icon><Shop /></el-icon>
                      </template>
                    </el-input>
                  </div>

                  <!-- Country -->
                  <div class="field-row">
                    <label class="field-label">
                      Country <span class="required-star">*</span>
                    </label>
                    <el-select
                      v-model="formData.newMerchantCountry"
                      placeholder="Select country"
                      filterable
                      clearable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="country in countryOptions"
                        :key="country.value"
                        :label="country.label"
                        :value="country.value"
                      >
                        <span class="country-option">
                          <span class="country-flag">{{ country.flag }}</span>
                          <span>{{ country.label }}</span>
                        </span>
                      </el-option>
                    </el-select>
                  </div>

                  <!-- State -->
                  <div class="field-row">
                    <label class="field-label">
                      State <span class="required-star">*</span>
                    </label>
                    <el-select
                      v-model="formData.newMerchantState"
                      placeholder="Select state"
                      filterable
                      clearable
                      style="width: 100%"
                    >
                      <el-option
                        v-for="state in stateOptions"
                        :key="state.value"
                        :label="state.label"
                        :value="state.value"
                      />
                    </el-select>
                  </div>

                  <!-- City -->
                  <div class="field-row">
                    <label class="field-label">
                      City <span class="required-star">*</span>
                    </label>
                    <el-input
                      v-model="formData.newMerchantCity"
                      placeholder="Enter city name"
                      :maxlength="50"
                      clearable
                    >
                      <template #prefix>
                        <el-icon><Location /></el-icon>
                      </template>
                    </el-input>
                  </div>

                  <!-- Address -->
                  <div class="field-row">
                    <label class="field-label">
                      Address <span class="required-star">*</span>
                    </label>
                    <el-input
                      v-model="formData.newMerchantAddress"
                      type="textarea"
                      :rows="2"
                      placeholder="Enter full address"
                      :maxlength="200"
                      show-word-limit
                    />
                  </div>

                  <!-- Zip Code -->
                  <div class="field-row">
                    <label class="field-label">
                      Zip Code <span class="required-star">*</span>
                    </label>
                    <el-input
                      v-model="formData.newMerchantZipCode"
                      placeholder="Enter zip code"
                      :maxlength="10"
                      clearable
                    >
                      <template #prefix>
                        <el-icon><Document /></el-icon>
                      </template>
                    </el-input>
                  </div>
                </div>

                <div class="field-hint">
                  ✓ A new merchant will be created with the information above
                </div>
              </div>
            </el-form-item>
            
            <!-- Divider -->
            <el-divider content-position="left">Connection Settings</el-divider>
            
            <!-- Auth Type Selection -->
            <div v-if="AUTH_CONFIGS[selectedIntegration.subType]?.authTypes?.length > 1" class="auth-type-selection">
              <el-radio-group v-model="selectedAuthType" @change="handleAuthTypeChange">
                <el-radio-button 
                  v-for="authType in AUTH_CONFIGS[selectedIntegration.subType].authTypes"
                  :key="authType.type"
                  :value="authType.type">
                  {{ authType.label }}
                </el-radio-button>
              </el-radio-group>
            </div>
            
            <!-- Dynamic Form Fields based on selected auth type -->
            <template v-if="selectedAuthType && AUTH_CONFIGS[selectedIntegration.subType]">
              <template v-for="authTypeConfig in AUTH_CONFIGS[selectedIntegration.subType].authTypes" :key="authTypeConfig.type">
                <template v-if="authTypeConfig.type === selectedAuthType">
                  <!-- Auth Type Specific Fields -->
                  <div v-if="authTypeConfig.type === AuthType.OAUTH_V2_CODE" class="oauth-section">
                    <h4>fbm Authentication</h4>
                    <p class="section-description">Schema for fbm authentication parameters</p>
                  </div>
                  
                  <div v-if="authTypeConfig.type === AuthType.OAUTH_V2_REFRESH" class="oauth-section">
                    <h4>fbm Authentication</h4>
                    <p class="section-description">Schema for fbm authentication parameters</p>
                    <div class="session-auth-section">
                      <h5>Session Authentication</h5>
                      <p class="section-description">Schema for session authentication parameters</p>
                    </div>
                  </div>
                  
                  <el-form-item
                    v-for="field in authTypeConfig.fields"
                    :key="field.key"
                    :label="field.label"
                    :prop="field.key"
                    :class="{ 'required-field': field.required }"
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
                      <div v-if="field.description" class="field-description">
                        {{ field.description }}
                      </div>
                    </template>
                    
                    <template v-else>
                      <el-input
                        v-model="formData[field.key]"
                        :type="field.type"
                        :placeholder="field.placeholder"
                        :show-password="field.type === 'password'"
                      />
                      <div v-if="field.description" class="field-description">
                        {{ field.description }}
                      </div>
                    </template>
                  </el-form-item>
                  
                  <!-- OAuth V2 Code Special Fields -->
                  <template v-if="authTypeConfig.type === AuthType.OAUTH_V2_CODE">
                    <div class="oauth-verify-section">
                      <div class="verify-email-section">
                        <label class="verify-label">Verify email address</label>
                        <el-input
                          v-model="formData.verify_email"
                          placeholder="lantester@item.com"
                          readonly
                        />
                        <div class="verify-actions">
                          <el-button type="primary" @click="handleGoToVerify">Go to verify</el-button>
                          <el-button @click="handleShareLink">Share link</el-button>
                        </div>
                      </div>
                      
                      <el-input
                        v-model="formData.verification_url"
                        placeholder="Verification URL will appear here"
                      >
                        <template #append>
                          <el-button @click="handleCopyUrl">Copy</el-button>
                        </template>
                      </el-input>
                      
                      <el-checkbox v-model="formData.send_email_on_expire">
                        Send email when token expires
                      </el-checkbox>
                      
                      <div class="alert-email-section">
                        <label class="alert-label">Alert Email</label>
                        <el-input
                          v-model="formData.alert_email"
                          placeholder="Enter alert email address"
                        />
                      </div>
                    </div>
                  </template>
                </template>
              </template>
            </template>
          </el-form>
        </div>
      </div>

      <!-- Dialog Footer -->
      <template #footer>
        <div class="dialog-footer">
          <div class="left-actions">
            <el-button 
              v-if="authDialogVisible && selectedIntegration"
              type="info"
              plain
              :loading="isTesting"
              @click="handleTestConnection"
            >
              {{ isTesting ? 'Testing...' : 'Test Connection' }}
            </el-button>
            <div v-if="testPassed" class="test-success-indicator">
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
              <span>Test Passed</span>
            </div>
          </div>
          
          <div class="right-actions">
            <el-button @click="handleCloseDialog">Cancel</el-button>
            <el-button 
              v-if="authDialogVisible && selectedIntegration"
              type="default"
              :loading="isSaving"
              @click="handleSaveDraft"
            >
              {{ isSaving ? 'Saving...' : 'Save' }}
            </el-button>
            <el-button 
              v-if="authDialogVisible && selectedIntegration"
              type="primary" 
              :loading="isConnecting"
              :disabled="!testPassed"
              @click="handleAuthSubmit"
            >
              {{ isConnecting ? 'Connecting...' : 'Connect' }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { InfoFilled, MoreFilled, Sort, Link, User, Location, House, Timer, Search, Check, ArrowLeft, Document, Edit, SuccessFilled, Plus, Shop } from '@element-plus/icons-vue'
import { useIntegration } from '@/composables/useIntegration'
import type { Integration } from '@/types/integration'
import { IntegrationType, IntegrationSubType, AuthType, MOCK_INTEGRATIONS, AVAILABLE_INTEGRATIONS, AUTH_CONFIGS, INTEGRATION_LOGOS } from '@/constants/integration'
import type { FormInstance } from 'element-plus'

// 导入图片
import defaultLogo from '@/assets/logo.svg'

// 获取logo URL
const getLogoUrl = (integration: Integration) => {
  const id = integration.id.toString().split('-')[0].toUpperCase() // 处理 'amazon-1' 这样的ID
  return INTEGRATION_LOGOS[id] || ''
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
const selectedAuthType = ref<AuthType | null>(null)
const authError = ref<string | null>(null)
const isConnecting = ref(false)
const isTesting = ref(false)
const testPassed = ref(false)
const isSaving = ref(false)

// Merchant options
const merchantOptions = ref([
  { value: 'merchant_001', label: 'Main Store', description: 'Primary merchant account' },
  { value: 'merchant_002', label: 'EU Store', description: 'European operations' },
  { value: 'merchant_003', label: 'Asia Pacific Store', description: 'APAC region' },
  { value: 'merchant_004', label: 'North America Store', description: 'NA region' },
  { value: 'merchant_005', label: 'Wholesale Division', description: 'B2B operations' }
])

// Country options
const countryOptions = ref([
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'CN', label: 'China', flag: '🇨🇳' },
  { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  { value: 'AU', label: 'Australia', flag: '🇦🇺' },
  { value: 'DE', label: 'Germany', flag: '🇩🇪' },
  { value: 'FR', label: 'France', flag: '🇫🇷' },
  { value: 'JP', label: 'Japan', flag: '🇯🇵' },
  { value: 'KR', label: 'South Korea', flag: '🇰🇷' },
  { value: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { value: 'HK', label: 'Hong Kong', flag: '🇭🇰' },
  { value: 'IT', label: 'Italy', flag: '🇮🇹' },
  { value: 'ES', label: 'Spain', flag: '🇪🇸' },
  { value: 'NL', label: 'Netherlands', flag: '🇳🇱' },
  { value: 'SE', label: 'Sweden', flag: '🇸🇪' },
  { value: 'BR', label: 'Brazil', flag: '🇧🇷' },
  { value: 'MX', label: 'Mexico', flag: '🇲🇽' },
  { value: 'IN', label: 'India', flag: '🇮🇳' },
  { value: 'TH', label: 'Thailand', flag: '🇹🇭' },
  { value: 'VN', label: 'Vietnam', flag: '🇻🇳' }
])

// US State options
const stateOptions = ref([
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
])

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
  const rules: Record<string, any> = {
    // Connector Name validation
    connectorName: [
      {
        required: true,
        message: 'Please enter a connector name',
        trigger: 'blur'
      },
      {
        min: 2,
        max: 50,
        message: 'Connector name should be 2-50 characters',
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z0-9\s\-_]+$/,
        message: 'Connector name can only contain letters, numbers, spaces, hyphens and underscores',
        trigger: 'blur'
      }
    ],
    // Merchant validation
    merchant: [
      {
        required: true,
        message: 'Please select a merchant',
        trigger: 'change'
      }
    ],
    // New Merchant Name validation (when auto-create is selected)
    newMerchantName: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.merchant === '__auto_create__' && !value) {
            callback(new Error('Please enter a name for the new merchant'))
          } else if (formData.value.merchant === '__auto_create__' && value && (value.length < 2 || value.length > 50)) {
            callback(new Error('Merchant name should be 2-50 characters'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    // New Merchant Country validation
    newMerchantCountry: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.merchant === '__auto_create__' && !value) {
            callback(new Error('Please select a country'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ],
    // New Merchant State validation
    newMerchantState: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.merchant === '__auto_create__' && !value) {
            callback(new Error('Please select a state'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ],
    // New Merchant City validation
    newMerchantCity: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.merchant === '__auto_create__' && !value) {
            callback(new Error('Please enter a city name'))
          } else if (formData.value.merchant === '__auto_create__' && value && (value.length < 2 || value.length > 50)) {
            callback(new Error('City name should be 2-50 characters'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    // New Merchant Address validation
    newMerchantAddress: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.merchant === '__auto_create__' && !value) {
            callback(new Error('Please enter an address'))
          } else if (formData.value.merchant === '__auto_create__' && value && (value.length < 5 || value.length > 200)) {
            callback(new Error('Address should be 5-200 characters'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    // New Merchant Zip Code validation
    newMerchantZipCode: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (formData.value.merchant === '__auto_create__' && !value) {
            callback(new Error('Please enter a zip code'))
          } else if (formData.value.merchant === '__auto_create__' && value && (value.length < 5 || value.length > 10)) {
            callback(new Error('Zip code should be 5-10 characters'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  
  if (selectedIntegration.value?.subType && selectedAuthType.value) {
    const config = AUTH_CONFIGS[selectedIntegration.value.subType]
    const authTypeConfig = config?.authTypes?.find(auth => auth.type === selectedAuthType.value)
    
    if (authTypeConfig) {
      authTypeConfig.fields.forEach(field => {
        if (field.required) {
          rules[field.key] = [{
            required: true,
            message: `Please enter ${field.label}`,
            trigger: 'blur'
          }]
        }
      })
    }
  }
  return rules
})

// 处理选择集成
const handleSelectIntegration = (integration: Integration) => {
  selectedIntegration.value = integration
  authDialogVisible.value = true
  
  // 设置默认连接器名称和默认授权类型
  const defaultConnectorName = `${integration.name} Connection`
  const defaultMerchantName = `${integration.name} Store`
  
  formData.value = {
    connectorName: defaultConnectorName,
    merchant: '',
    newMerchantName: defaultMerchantName,
    newMerchantCountry: 'US',
    newMerchantState: 'CA',
    newMerchantCity: 'Los Angeles',
    newMerchantAddress: '123 Main Street',
    newMerchantZipCode: '90001'
  }
  
  // 设置默认授权类型为第一个可用类型
  if (integration.subType && AUTH_CONFIGS[integration.subType]?.authTypes?.length > 0) {
    selectedAuthType.value = AUTH_CONFIGS[integration.subType].authTypes[0].type
  } else {
    selectedAuthType.value = null
  }
  
  // 重置测试状态
  testPassed.value = false
  authError.value = null
  
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 返回集成列表
const handleBackToList = () => {
  authDialogVisible.value = false
  selectedIntegration.value = null
  selectedAuthType.value = null
  authError.value = null
  testPassed.value = false
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
    isConnecting.value = true
    authError.value = null // 清除之前的错误
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟随机成功/失败响应（用于演示）
    const isSuccess = Math.random() > 0.3 // 70% 成功率
    
    if (isSuccess) {
      // 模拟成功响应
      ElMessage.success(`Successfully connected to ${selectedIntegration.value?.name}`)
      addDialogVisible.value = false // 关闭整个对话框
      
      // 重置状态
      handleBackToList()
      searchQuery.value = ''
      activeType.value = ''
    } else {
      // 模拟授权失败
      const errorMessages = [
        'Invalid credentials. Please check your API key and secret.',
        'Authentication failed. The provided credentials are incorrect or expired.',
        'Connection timeout. Please check your network connection and try again.',
        'Access denied. Please ensure your account has the necessary permissions.',
        'Invalid shop domain. Please verify the domain name is correct.',
        'OAuth authorization failed. Please complete the authorization process.',
        'Server error occurred during authentication. Please try again later.'
      ]
      
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)]
      authError.value = randomError
      
      // 滚动到错误信息位置
      setTimeout(() => {
        const errorElement = document.querySelector('.error-alert')
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
    
  } catch (err) {
    // 表单验证失败
    console.error('Validation failed:', err)
    authError.value = 'Please fill in all required fields correctly.'
  } finally {
    isConnecting.value = false
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

// 模拟星评数据
const INTEGRATION_RATINGS: Record<string, { rating: number; reviewCount: number }> = {
  'shopify': { rating: 4.8, reviewCount: 2847 },
  'amazon': { rating: 4.6, reviewCount: 1923 },
  'walmart': { rating: 4.4, reviewCount: 856 },
  'tiktok': { rating: 4.7, reviewCount: 1245 },
  'facebook': { rating: 4.5, reviewCount: 1678 },
  'instagram': { rating: 4.6, reviewCount: 1432 },
  'woocommerce': { rating: 4.3, reviewCount: 967 },
  'magento': { rating: 4.2, reviewCount: 743 },
  'bigcommerce': { rating: 4.4, reviewCount: 589 },
  'shipbob': { rating: 4.7, reviewCount: 1156 },
  'fedex': { rating: 4.1, reviewCount: 892 },
  'ups': { rating: 4.0, reviewCount: 756 },
  'dhl': { rating: 4.2, reviewCount: 634 },
  'unis-wms': { rating: 4.9, reviewCount: 234 },
  'item-wms': { rating: 4.6, reviewCount: 178 }
}

// 获取集成星评
const getIntegrationRating = (integrationId: string) => {
  return INTEGRATION_RATINGS[integrationId]?.rating || 4.0
}

// 获取集成评论数量
const getIntegrationReviewCount = (integrationId: string) => {
  return INTEGRATION_RATINGS[integrationId]?.reviewCount || 0
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

// 处理授权类型变化
const handleAuthTypeChange = (authType: AuthType) => {
  // 清空表单数据，保留连接器名称和merchant信息
  const connectorName = formData.value.connectorName
  const merchant = formData.value.merchant
  const newMerchantName = formData.value.newMerchantName
  const newMerchantCountry = formData.value.newMerchantCountry
  const newMerchantState = formData.value.newMerchantState
  const newMerchantCity = formData.value.newMerchantCity
  const newMerchantAddress = formData.value.newMerchantAddress
  const newMerchantZipCode = formData.value.newMerchantZipCode
  formData.value = { 
    connectorName, 
    merchant, 
    newMerchantName,
    newMerchantCountry,
    newMerchantState,
    newMerchantCity,
    newMerchantAddress,
    newMerchantZipCode
  }
  
  // 清除错误信息和测试状态
  authError.value = null
  testPassed.value = false
  
  // 根据授权类型设置默认值
  if (authType === AuthType.OAUTH_V2_CODE) {
    formData.value.verify_email = 'lantester@item.com'
    formData.value.send_email_on_expire = false
  }
}

// OAuth相关处理函数
const handleGoToVerify = () => {
  ElMessage.info('Redirecting to verification page...')
}

const handleShareLink = () => {
  ElMessage.success('Verification link shared successfully')
}

const handleCopyUrl = () => {
  if (formData.value.verification_url) {
    navigator.clipboard.writeText(formData.value.verification_url)
    ElMessage.success('URL copied to clipboard')
  } else {
    ElMessage.warning('No URL to copy')
  }
}

// 测试连接
const handleTestConnection = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isTesting.value = true
    authError.value = null
    testPassed.value = false
    
    // 模拟测试连接API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟随机成功/失败响应（用于演示）
    const isSuccess = Math.random() > 0.2 // 80% 成功率
    
    if (isSuccess) {
      testPassed.value = true
      ElMessage.success('Connection test passed successfully!')
    } else {
      // 模拟测试失败
      const testErrorMessages = [
        'Connection test failed: Invalid credentials.',
        'Connection test failed: Network timeout.',
        'Connection test failed: Server unreachable.',
        'Connection test failed: Authentication error.',
        'Connection test failed: Invalid configuration.'
      ]
      
      const randomError = testErrorMessages[Math.floor(Math.random() * testErrorMessages.length)]
      authError.value = randomError
      
      // 滚动到错误信息位置
      setTimeout(() => {
        const errorElement = document.querySelector('.error-alert')
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
    
  } catch (err) {
    // 表单验证失败
    console.error('Validation failed:', err)
    authError.value = 'Please fill in all required fields correctly before testing.'
  } finally {
    isTesting.value = false
  }
}

// 保存草稿
const handleSaveDraft = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isSaving.value = true
    
    // 模拟保存草稿API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(`Integration configuration saved as draft for ${selectedIntegration.value?.name}`)
    
    // 可以选择保持对话框打开或关闭
    // addDialogVisible.value = false
    
  } catch (err) {
    // 表单验证失败
    console.error('Validation failed:', err)
    ElMessage.warning('Please fill in all required fields before saving.')
  } finally {
    isSaving.value = false
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
        
        .rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
          
          .el-rate {
            --el-rate-icon-size: 12px;
            --el-rate-icon-margin: 1px;
            
            :deep(.el-rate__text) {
              font-size: 11px;
              font-weight: 500;
              color: var(--el-text-color-primary);
              margin-left: 2px;
            }
            
            :deep(.el-rate__item) {
              .el-rate__icon {
                color: #ff9900;
              }
            }
          }
          
          .review-count {
            font-size: 11px;
            color: var(--el-text-color-secondary);
            white-space: nowrap;
          }
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
              margin-bottom: 8px;

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
            
            .rating-section {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
              
              .el-rate {
                --el-rate-icon-size: 14px;
                --el-rate-icon-margin: 2px;
                
                :deep(.el-rate__text) {
                  font-size: 13px;
                  font-weight: 500;
                  color: var(--el-text-color-primary);
                  margin-left: 4px;
                }
                
                :deep(.el-rate__item) {
                  .el-rate__icon {
                    color: #ff9900;
                  }
                }
              }
              
              .rating-count {
                font-size: 12px;
                color: var(--el-text-color-secondary);
                white-space: nowrap;
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

      .error-alert {
        margin-bottom: 20px;
        
        :deep(.el-alert) {
          border-radius: 8px;
          
          .el-alert__content {
            .el-alert__title {
              font-weight: 500;
              line-height: 1.5;
            }
          }
        }
      }
      
      .instructions {
        margin-bottom: 24px;
      }

      .el-form {
        max-width: 600px;
        margin: 0 auto;
        
        .connector-name-field {
          .el-input {
            :deep(.el-input__wrapper) {
              border: 2px solid var(--el-border-color);
              border-radius: 8px;
              transition: all 0.3s ease;
              
              &.is-focus {
                border-color: var(--el-color-primary);
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
              }
            }
            
            :deep(.el-input__prefix) {
              color: var(--el-color-primary);
            }
          }
          
          .field-hint {
            margin-top: 8px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
            line-height: 1.4;
          }
        }
        
        .merchant-field {
          .el-select {
            :deep(.el-input__wrapper) {
              border: 2px solid var(--el-border-color);
              border-radius: 8px;
              transition: all 0.3s ease;
              
              &.is-focus {
                border-color: var(--el-color-primary);
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
              }
            }
          }
          
          .field-hint {
            margin-top: 8px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
            line-height: 1.4;
          }
          
          .auto-create-section {
            margin-top: 16px;
            padding: 20px;
            background: var(--el-fill-color-light);
            border: 1px solid var(--el-border-color);
            border-radius: 8px;
            animation: fadeInDown 0.4s ease;
            
            .auto-create-header {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 20px;
              padding-bottom: 16px;
              border-bottom: 1px solid var(--el-border-color-lighter);
              
              .el-icon {
                font-size: 20px;
                color: var(--el-color-primary);
              }
              
              span {
                font-size: 15px;
                font-weight: 600;
                color: var(--el-text-color-primary);
              }
            }
            
            .auto-create-fields {
              display: flex;
              flex-direction: column;
              gap: 16px;
              
              .field-row {
                display: flex;
                flex-direction: column;
                gap: 8px;
                
                .field-label {
                  font-size: 13px;
                  font-weight: 500;
                  color: var(--el-text-color-primary);
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  
                  .required-star {
                    color: var(--el-color-danger);
                    font-weight: bold;
                  }
                }
                
                .el-input,
                .el-select,
                .el-textarea {
                  :deep(.el-input__wrapper),
                  :deep(.el-textarea__inner) {
                    border: 1px solid var(--el-border-color);
                    border-radius: 6px;
                    background: var(--el-bg-color-blank);
                    transition: all 0.3s ease;
                    
                    &:hover {
                      border-color: var(--el-border-color-dark);
                    }
                    
                    &.is-focus {
                      border-color: var(--el-color-primary);
                      box-shadow: 0 0 0 2px var(--el-color-primary-light-9);
                    }
                  }
                  
                  :deep(.el-input__prefix) {
                    color: var(--el-text-color-secondary);
                  }
                }
              }
            }
            
            > .field-hint {
              margin-top: 16px;
              padding: 10px 12px;
              font-size: 12px;
              color: var(--el-text-color-secondary);
              line-height: 1.5;
              background: var(--el-fill-color);
              border-left: 3px solid var(--el-color-primary);
              border-radius: 4px;
            }
          }
        }
        
        .el-divider {
          margin: 32px 0 24px;
          
          :deep(.el-divider__text) {
            font-weight: 500;
            color: var(--el-text-color-primary);
            background: var(--el-fill-color-light);
            padding: 0 16px;
          }
        }
        
        .auth-type-selection {
          margin-bottom: 24px;
          
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
                font-weight: 500;
                
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
        
        .oauth-section {
          margin: 24px 0 16px;
          
          h4 {
            margin: 0 0 8px;
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }
          
          .section-description {
            margin: 0 0 16px;
            font-size: 14px;
            color: var(--el-text-color-secondary);
          }
          
          .session-auth-section {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--el-border-color-lighter);
            
            h5 {
              margin: 0 0 8px;
              font-size: 14px;
              font-weight: 600;
              color: var(--el-text-color-primary);
            }
          }
        }
        
        .required-field {
          :deep(.el-form-item__label) {
            &::before {
              content: '*';
              color: var(--el-color-danger);
              margin-right: 4px;
            }
          }
        }
        
        .field-description {
          margin-top: 4px;
          font-size: 12px;
          color: var(--el-text-color-secondary);
          line-height: 1.4;
        }
        
        .oauth-verify-section {
          margin-top: 24px;
          
          .verify-email-section {
            margin-bottom: 16px;
            
            .verify-label {
              display: block;
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
            }
            
            .verify-actions {
              margin-top: 12px;
              display: flex;
              gap: 12px;
            }
          }
          
          .alert-email-section {
            margin-top: 16px;
            
            .alert-label {
              display: block;
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
            }
          }
          
          .el-checkbox {
            margin: 16px 0;
          }
        }
      }
    }
  }

  .dialog-footer {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color-blank);
    
    .left-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .test-success-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--el-color-success);
        font-size: 14px;
        font-weight: 500;
        
        .el-icon {
          font-size: 16px;
        }
      }
    }
    
    .right-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
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

// Merchant option styles
.merchant-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  
  .merchant-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
  
  .merchant-desc {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-left: auto;
  }
  
  &.auto-create-option {
    color: var(--el-color-primary);
    font-weight: 500;
    
    .el-icon {
      font-size: 16px;
    }
    
    .merchant-name {
      color: var(--el-color-primary);
    }
  }
}

// Country option styles
.country-option {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .country-flag {
    font-size: 18px;
    line-height: 1;
  }
}

// Animation for auto-create section
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 