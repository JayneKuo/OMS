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
            <div class="address-items mt-2" v-if="row.config.deliveryAddress.addresses.length">
              <div v-for="(addr, idx) in row.config.deliveryAddress.addresses" :key="idx" class="address-item-display">
                <el-tag 
                  size="small" 
                  type="success"
                  class="mr-2"
                >
                  {{ addr.type }}
                </el-tag>
                {{ addr.value }}
              </div>
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

      <el-table-column label="Hold Mode" min-width="150">
        <template #default="{ row }">
          <div class="hold-info">
            <el-tag 
              :type="row.config.holdMode === 'permanent' ? 'danger' : row.config.holdMode === 'duration' ? 'warning' : 'info'"
              size="small"
            >
              {{ row.config.holdMode === 'permanent' ? 'Permanent' : row.config.holdMode === 'duration' ? 'Duration' : 'Date Range' }}
            </el-tag>
            <div v-if="row.config.holdMode === 'duration' || row.config.holdMode === 'dateRange'" class="duration-info">
              {{ row.config.holdDuration.value }} {{ row.config.holdDuration.unit }}
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

      <el-table-column label="Order Tags" min-width="150">
        <template #default="{ row }">
          <div class="tag-group">
            <el-tag 
              v-for="tag in row.config.orderTags.tags" 
              :key="tag"
              size="small"
              type="warning"
              class="mr-2"
            >
              {{ tag }}
            </el-tag>
            <div v-if="row.config.orderTags.tags.length > 0">
              Logic: {{ row.config.orderTags.logic }}
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

          <!-- Hold模式设置 -->
          <el-divider content-position="left">Hold Settings</el-divider>
          <el-form-item label="Hold Mode">
            <el-radio-group v-model="editDialog.currentRule.config.holdMode">
              <el-radio label="permanent">Permanent</el-radio>
              <el-radio label="duration">Duration</el-radio>
              <el-radio label="dateRange">Date Range</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 自定义时长 -->
          <el-form-item 
            v-if="editDialog.currentRule.config.holdMode === 'duration'"
            label="Hold Duration"
          >
            <div class="duration-input">
              <el-input-number
                v-model="editDialog.currentRule.config.holdDuration.value"
                :min="1"
                controls-position="right"
                style="width: 120px"
              />
              <el-select
                v-model="editDialog.currentRule.config.holdDuration.unit"
                style="width: 120px; margin-left: 12px"
              >
                <el-option label="Minutes" value="minutes" />
                <el-option label="Hours" value="hours" />
                <el-option label="Days" value="days" />
              </el-select>
            </div>
          </el-form-item>

          <!-- 日期范围 -->
          <el-form-item 
            v-if="editDialog.currentRule.config.holdMode === 'dateRange'"
            label="Date Range"
          >
            <el-date-picker
              v-model="editDialog.currentRule.config.holdDateRange"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 400px"
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
            <!-- 添加的地址条件部分 -->
            <div class="address-list">
              <div class="address-list-header">
                <div class="address-logic-selector">
                  <span>Address Match Logic:</span>
                  <el-select
                    v-model="editDialog.currentRule.config.deliveryAddress.logic"
                    style="width: 150px; margin-left: 10px; margin-right: 20px;"
                  >
                    <el-option
                      v-for="type in LOGIC_TYPES"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    />
                  </el-select>
                </div>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="addAddressCondition"
                >
                  Add Address Condition
                </el-button>
              </div>
              
              <div class="address-logic-explanation">
                <span v-if="editDialog.currentRule.config.deliveryAddress.logic === 'AND'">
                  <el-icon><InfoFilled /></el-icon> All conditions must match (AND logic)
                </span>
                <span v-else>
                  <el-icon><InfoFilled /></el-icon> Any condition may match (OR logic)
                </span>
              </div>
              
              <div 
                v-for="(addr, index) in editDialog.currentRule.config.deliveryAddress.addresses" 
                :key="index"
                class="address-item"
              >
                <el-select
                  v-model="addr.type"
                  placeholder="Address Type"
                  style="width: 140px"
                >
                  <el-option
                    v-for="type in ADDRESS_TYPES"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
                
                <!-- 国家选择 -->
                <template v-if="addr.type === 'country'">
                  <el-select
                    v-model="addr.value"
                    placeholder="Select Country"
                    filterable
                    style="flex: 1"
                  >
                    <el-option
                      v-for="country in COUNTRIES"
                      :key="country.value"
                      :label="country.label"
                      :value="country.value"
                    />
                  </el-select>
                </template>
                
                <!-- 州/省选择 -->
                <template v-else-if="addr.type === 'state'">
                  <el-select
                    v-model="addr.country"
                    placeholder="Select Country"
                    style="width: 120px"
                    @change="(val: string) => { addr.value = ''; }"
                  >
                    <el-option
                      v-for="country in COUNTRIES"
                      :key="country.value"
                      :label="country.label"
                      :value="country.value"
                    />
                  </el-select>
                  <el-select
                    v-model="addr.value"
                    placeholder="Select State"
                    filterable
                    style="flex: 1"
                    :disabled="!addr.country"
                  >
                    <template v-if="addr.country === 'USA'">
                      <el-option
                        v-for="state in US_STATES"
                        :key="state.value"
                        :label="state.label"
                        :value="state.value"
                      />
                    </template>
                    <template v-else-if="addr.country === 'China'">
                      <el-option
                        v-for="state in CHINA_PROVINCES"
                        :key="state.value"
                        :label="state.label"
                        :value="state.value"
                      />
                    </template>
                    <template v-else-if="addr.country === 'Canada'">
                      <el-option
                        v-for="state in CANADA_PROVINCES"
                        :key="state.value"
                        :label="state.label"
                        :value="state.value"
                      />
                    </template>
                  </el-select>
                </template>
                
                <!-- 城市选择 -->
                <template v-else-if="addr.type === 'city'">
                  <el-select
                    v-model="addr.country"
                    placeholder="Select Country"
                    style="width: 120px"
                    @change="(val: string) => { addr.state = ''; addr.value = ''; }"
                  >
                    <el-option
                      v-for="country in COUNTRIES"
                      :key="country.value"
                      :label="country.label"
                      :value="country.value"
                    />
                  </el-select>
                  <el-select
                    v-model="addr.state"
                    placeholder="Select State"
                    filterable
                    style="width: 140px"
                    :disabled="!addr.country"
                    @change="(val: string) => { addr.value = ''; }"
                  >
                    <template v-if="addr.country === 'USA'">
                      <el-option
                        v-for="state in US_STATES"
                        :key="state.value"
                        :label="state.label"
                        :value="state.value"
                      />
                    </template>
                    <template v-else-if="addr.country === 'China'">
                      <el-option
                        v-for="state in CHINA_PROVINCES"
                        :key="state.value"
                        :label="state.label"
                        :value="state.value"
                      />
                    </template>
                    <template v-else-if="addr.country === 'Canada'">
                      <el-option
                        v-for="state in CANADA_PROVINCES"
                        :key="state.value"
                        :label="state.label"
                        :value="state.value"
                      />
                    </template>
                  </el-select>
                  <el-select
                    v-model="addr.value"
                    placeholder="Select City"
                    filterable
                    style="flex: 1"
                    :disabled="!addr.state"
                  >
                    <template v-if="addr.country === 'USA' && addr.state">
                      <el-option
                        v-for="city in addr.country === 'USA' ? (US_CITIES[addr.state as keyof typeof US_CITIES] || []) : []"
                        :key="city.value"
                        :label="city.label"
                        :value="city.value"
                      />
                    </template>
                    <template v-else-if="addr.country === 'China' && addr.state">
                      <el-option
                        v-for="city in addr.country === 'China' ? (CHINA_CITIES[addr.state as keyof typeof CHINA_CITIES] || []) : []"
                        :key="city.value"
                        :label="city.label"
                        :value="city.value"
                      />
                    </template>
                    <template v-else-if="addr.country === 'Canada' && addr.state">
                      <el-option
                        v-for="city in addr.country === 'Canada' ? (CANADA_CITIES[addr.state as keyof typeof CANADA_CITIES] || []) : []"
                        :key="city.value"
                        :label="city.label"
                        :value="city.value"
                      />
                    </template>
                  </el-select>
                </template>
                
                <!-- 地址关键词选择 -->
                <template v-else-if="addr.type === 'keyword'">
                  <el-select
                    v-model="addr.value"
                    placeholder="Select Keyword"
                    filterable
                    allow-create
                    style="flex: 1"
                  >
                    <el-option
                      v-for="keyword in ADDRESS_KEYWORDS"
                      :key="keyword.value"
                      :label="keyword.label"
                      :value="keyword.value"
                    />
                  </el-select>
                </template>
                
                <!-- 其他地址类型输入 -->
                <template v-else>
                  <el-input
                    v-model="addr.value"
                    :placeholder="addr.type === 'full' ? 'Enter Full Address' : addr.type === 'zipcode' ? 'Enter Zip Code' : 'Enter Value'"
                    style="flex: 1"
                  />
                </template>
                
                <el-button
                  type="danger"
                  @click="removeAddressCondition(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </el-form-item>

          <!-- 订单标签条件 -->
          <el-form-item label="Order Tags">
            <div class="tags-filter">
              <el-select
                v-model="editDialog.currentRule.config.orderTags.logic"
                placeholder="Logic"
                class="logic-select"
                style="width: 140px"
              >
                <el-option
                  v-for="type in LOGIC_TYPES"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
              <el-select
                v-model="editDialog.currentRule.config.orderTags.tags"
                multiple
                filterable
                allow-create
                placeholder="Enter order tags"
                class="tags-input"
                style="flex: 1"
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
import { Warning, Plus, Delete, Sort, Document, Bell, InfoFilled } from '@element-plus/icons-vue'

// Types
interface AddressRule {
  keywords: string[];
  matchType: 'fuzzy' | 'exact';
  logic: 'AND' | 'OR';
  regions: string[];
  addresses: Array<{
    type: 'country' | 'full' | 'state' | 'city' | 'zipcode' | 'keyword';
    value: string;
    country?: string; // 州/城市所属的国家
    state?: string;   // 城市所属的州
  }>;
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

// 添加订单标签规则接口
interface OrderTagRule {
  tags: string[];
  logic: 'AND' | 'OR';
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
  // 添加订单标签规则
  orderTags: OrderTagRule;
  notifications: Notification;
  mutuallyExclusive: boolean;
  holdMode: 'permanent' | 'duration' | 'dateRange';
  holdDuration: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  holdDateRange: [string, string] | null;
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

const ADDRESS_TYPES = [
  { label: 'Country', value: 'country' },
  { label: 'Full Address', value: 'full' },
  { label: 'State/Province', value: 'state' },
  { label: 'City', value: 'city' },
  { label: 'Zip Code', value: 'zipcode' },
  { label: 'Address Keyword', value: 'keyword' }
]

// 添加国家列表
const COUNTRIES = [
  { label: 'USA', value: 'USA' },
  { label: 'China', value: 'China' },
  { label: 'Canada', value: 'Canada' },
  { label: 'UK', value: 'UK' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Australia', value: 'Australia' }
]

// 添加美国州列表
const US_STATES = [
  { label: 'Alabama', value: 'Alabama' },
  { label: 'Alaska', value: 'Alaska' },
  { label: 'Arizona', value: 'Arizona' },
  { label: 'Arkansas', value: 'Arkansas' },
  { label: 'California', value: 'California' },
  { label: 'Colorado', value: 'Colorado' },
  { label: 'Connecticut', value: 'Connecticut' },
  { label: 'Delaware', value: 'Delaware' },
  { label: 'Florida', value: 'Florida' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Hawaii', value: 'Hawaii' },
  { label: 'Idaho', value: 'Idaho' },
  { label: 'Illinois', value: 'Illinois' },
  { label: 'Indiana', value: 'Indiana' },
  { label: 'Iowa', value: 'Iowa' },
  { label: 'Kansas', value: 'Kansas' },
  { label: 'Kentucky', value: 'Kentucky' },
  { label: 'Louisiana', value: 'Louisiana' },
  { label: 'Maine', value: 'Maine' },
  { label: 'Maryland', value: 'Maryland' },
  { label: 'Massachusetts', value: 'Massachusetts' },
  { label: 'Michigan', value: 'Michigan' },
  { label: 'Minnesota', value: 'Minnesota' },
  { label: 'Mississippi', value: 'Mississippi' },
  { label: 'Missouri', value: 'Missouri' },
  { label: 'Montana', value: 'Montana' },
  { label: 'Nebraska', value: 'Nebraska' },
  { label: 'Nevada', value: 'Nevada' },
  { label: 'New Hampshire', value: 'New Hampshire' },
  { label: 'New Jersey', value: 'New Jersey' },
  { label: 'New Mexico', value: 'New Mexico' },
  { label: 'New York', value: 'New York' },
  { label: 'North Carolina', value: 'North Carolina' },
  { label: 'North Dakota', value: 'North Dakota' },
  { label: 'Ohio', value: 'Ohio' },
  { label: 'Oklahoma', value: 'Oklahoma' },
  { label: 'Oregon', value: 'Oregon' },
  { label: 'Pennsylvania', value: 'Pennsylvania' },
  { label: 'Rhode Island', value: 'Rhode Island' },
  { label: 'South Carolina', value: 'South Carolina' },
  { label: 'South Dakota', value: 'South Dakota' },
  { label: 'Tennessee', value: 'Tennessee' },
  { label: 'Texas', value: 'Texas' },
  { label: 'Utah', value: 'Utah' },
  { label: 'Vermont', value: 'Vermont' },
  { label: 'Virginia', value: 'Virginia' },
  { label: 'Washington', value: 'Washington' },
  { label: 'West Virginia', value: 'West Virginia' },
  { label: 'Wisconsin', value: 'Wisconsin' },
  { label: 'Wyoming', value: 'Wyoming' }
]

// 美国主要城市数据（示例数据）
const US_CITIES = {
  'California': [
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'San Francisco', value: 'San Francisco' },
    { label: 'San Diego', value: 'San Diego' },
    { label: 'San Jose', value: 'San Jose' },
    { label: 'Sacramento', value: 'Sacramento' }
  ],
  'New York': [
    { label: 'New York City', value: 'New York City' },
    { label: 'Buffalo', value: 'Buffalo' },
    { label: 'Rochester', value: 'Rochester' },
    { label: 'Syracuse', value: 'Syracuse' },
    { label: 'Albany', value: 'Albany' }
  ],
  'Texas': [
    { label: 'Houston', value: 'Houston' },
    { label: 'Dallas', value: 'Dallas' },
    { label: 'Austin', value: 'Austin' },
    { label: 'San Antonio', value: 'San Antonio' },
    { label: 'Fort Worth', value: 'Fort Worth' }
  ],
  'Florida': [
    { label: 'Miami', value: 'Miami' },
    { label: 'Orlando', value: 'Orlando' },
    { label: 'Tampa', value: 'Tampa' },
    { label: 'Jacksonville', value: 'Jacksonville' },
    { label: 'Tallahassee', value: 'Tallahassee' }
  ]
}

// 常见地址关键词
const ADDRESS_KEYWORDS = [
  { label: 'PO BOX', value: 'PO BOX' },
  { label: 'P.O. BOX', value: 'P.O. BOX' },
  { label: 'APT', value: 'APT' },
  { label: 'APARTMENT', value: 'APARTMENT' },
  { label: 'SUITE', value: 'SUITE' },
  { label: 'STE', value: 'STE' },
  { label: 'UNIT', value: 'UNIT' },
  { label: 'FLOOR', value: 'FLOOR' },
  { label: 'FL', value: 'FL' },
  { label: 'BUILDING', value: 'BUILDING' },
  { label: 'BLDG', value: 'BLDG' }
]

// 添加中国省份列表
const CHINA_PROVINCES = [
  { label: 'Beijing', value: 'Beijing' },
  { label: 'Shanghai', value: 'Shanghai' },
  { label: 'Guangdong', value: 'Guangdong' },
  { label: 'Jiangsu', value: 'Jiangsu' },
  { label: 'Zhejiang', value: 'Zhejiang' },
  { label: 'Sichuan', value: 'Sichuan' },
  { label: 'Shandong', value: 'Shandong' },
  { label: 'Henan', value: 'Henan' },
  { label: 'Hubei', value: 'Hubei' },
  { label: 'Fujian', value: 'Fujian' }
]

// 添加加拿大省份列表
const CANADA_PROVINCES = [
  { label: 'Ontario', value: 'Ontario' },
  { label: 'Quebec', value: 'Quebec' },
  { label: 'British Columbia', value: 'British Columbia' },
  { label: 'Alberta', value: 'Alberta' },
  { label: 'Manitoba', value: 'Manitoba' },
  { label: 'Saskatchewan', value: 'Saskatchewan' },
  { label: 'Nova Scotia', value: 'Nova Scotia' },
  { label: 'New Brunswick', value: 'New Brunswick' },
  { label: 'Newfoundland and Labrador', value: 'Newfoundland and Labrador' },
  { label: 'Prince Edward Island', value: 'Prince Edward Island' }
]

// 中国城市数据
const CHINA_CITIES = {
  'Guangdong': [
    { label: 'Guangzhou', value: 'Guangzhou' },
    { label: 'Shenzhen', value: 'Shenzhen' },
    { label: 'Dongguan', value: 'Dongguan' },
    { label: 'Foshan', value: 'Foshan' },
    { label: 'Zhuhai', value: 'Zhuhai' }
  ],
  'Beijing': [
    { label: 'Beijing', value: 'Beijing' }
  ],
  'Shanghai': [
    { label: 'Shanghai', value: 'Shanghai' }
  ],
  'Jiangsu': [
    { label: 'Nanjing', value: 'Nanjing' },
    { label: 'Suzhou', value: 'Suzhou' },
    { label: 'Wuxi', value: 'Wuxi' },
    { label: 'Changzhou', value: 'Changzhou' },
    { label: 'Yangzhou', value: 'Yangzhou' }
  ],
  'Zhejiang': [
    { label: 'Hangzhou', value: 'Hangzhou' },
    { label: 'Ningbo', value: 'Ningbo' },
    { label: 'Wenzhou', value: 'Wenzhou' },
    { label: 'Shaoxing', value: 'Shaoxing' },
    { label: 'Jinhua', value: 'Jinhua' }
  ]
}

// 加拿大城市数据
const CANADA_CITIES = {
  'Ontario': [
    { label: 'Toronto', value: 'Toronto' },
    { label: 'Ottawa', value: 'Ottawa' },
    { label: 'Mississauga', value: 'Mississauga' },
    { label: 'Hamilton', value: 'Hamilton' },
    { label: 'London', value: 'London' }
  ],
  'Quebec': [
    { label: 'Montreal', value: 'Montreal' },
    { label: 'Quebec City', value: 'Quebec City' },
    { label: 'Laval', value: 'Laval' },
    { label: 'Gatineau', value: 'Gatineau' },
    { label: 'Longueuil', value: 'Longueuil' }
  ],
  'British Columbia': [
    { label: 'Vancouver', value: 'Vancouver' },
    { label: 'Victoria', value: 'Victoria' },
    { label: 'Surrey', value: 'Surrey' },
    { label: 'Burnaby', value: 'Burnaby' },
    { label: 'Richmond', value: 'Richmond' }
  ]
}

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
        regions: [],
        addresses: [
          { type: 'city' as const, value: '上海', country: 'China', state: '' },
          { type: 'city' as const, value: '北京', country: 'China', state: '' }
        ]
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
      orderTags: {
        tags: ['VIP', 'premium'],
        logic: 'OR'
      },
      notifications: {
        emails: ['vip@example.com', 'manager@example.com'],
        webhook: {
          url: 'https://api.example.com/webhook/vip'
        }
      },
      mutuallyExclusive: true,
      holdMode: 'permanent',
      holdDuration: {
        value: 1,
        unit: 'days'
      },
      holdDateRange: null
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
        regions: [],
        addresses: [
          { type: 'state' as const, value: 'California', country: 'USA', state: '' },
          { type: 'country' as const, value: 'UK', country: '', state: '' }
        ]
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
      orderTags: {
        tags: ['international', 'priority'],
        logic: 'AND'
      },
      notifications: {
        emails: ['overseas@example.com'],
        webhook: null
      },
      mutuallyExclusive: false,
      holdMode: 'permanent',
      holdDuration: {
        value: 1,
        unit: 'days'
      },
      holdDateRange: null
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
        regions: [],
        addresses: []
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
      orderTags: {
        tags: ['high-value'],
        logic: 'OR'
      },
      notifications: {
        emails: ['finance@example.com', 'audit@example.com', 'manager@example.com'],
        webhook: {
          url: 'https://api.example.com/webhook/large-order'
        }
      },
      mutuallyExclusive: true,
      holdMode: 'permanent',
      holdDuration: {
        value: 1,
        unit: 'days'
      },
      holdDateRange: null
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
      regions: [],
      addresses: []
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
    // 添加订单标签规则默认值
    orderTags: {
      tags: [],
      logic: 'OR'
    },
    notifications: {
      emails: [],
      webhook: null
    },
    mutuallyExclusive: false,
    holdMode: 'permanent',
    holdDuration: {
      value: 24,
      unit: 'hours'
    },
    holdDateRange: null
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
    // 使用示例规则来重置
    holdRules.value = [{
      id: `rule_${Date.now()}`,
      name: 'Default Rule',
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
          regions: [],
          addresses: []
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
        orderTags: {
          tags: [],
          logic: 'OR'
        },
        notifications: {
          emails: [],
          webhook: null
        },
        mutuallyExclusive: false,
        holdMode: 'permanent',
        holdDuration: {
          value: 24,
          unit: 'hours'
        },
        holdDateRange: null
      }
    }];
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

// 添加地址条件
const addAddressCondition = () => {
  if (!editDialog.value.currentRule) return
  editDialog.value.currentRule.config.deliveryAddress.addresses.push({
    type: 'full',
    value: '',
    country: '',
    state: ''
  })
}

// 删除地址条件
const removeAddressCondition = (index: number) => {
  if (!editDialog.value.currentRule) return
  editDialog.value.currentRule.config.deliveryAddress.addresses.splice(index, 1)
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
  }
  
  .hold-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .duration-info {
      font-size: 12px;
      color: var(--text-secondary);
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
  
  .duration-input {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .el-input-number,
    .el-select {
      width: 120px;
    }
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

.address-items {
  margin-top: 8px;
  
  .address-item-display {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    font-size: 12px;
  }
}

.mt-2 {
  margin-top: 8px;
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

.address-list {
  margin-top: 16px;
  
  .address-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .address-logic-selector {
    display: flex;
    align-items: center;
  }
  
  .address-logic-explanation {
    margin-bottom: 12px;
    color: #606266;
    font-size: 13px;
    
    .el-icon {
      margin-right: 5px;
      color: #409EFF;
    }
  }
  
  .address-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;
  }
}

.tags-filter {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style> 