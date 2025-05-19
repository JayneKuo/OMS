<template>
  <div class="page-container">
    <!-- Page Title -->
    <div class="page-header">
      <h2>Query Tool</h2>
      <p class="sub-title">Query orders, products and inventory data across platforms</p>
    </div>

    <!-- Query Form -->
    <el-card class="filter-container">
      <template #header>
        <div class="card-header">
          <span>Query Conditions</span>
        </div>
      </template>

      <el-form :model="queryForm" label-width="130px">
        <!-- Basic Fields -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Customer:" required>
              <el-select 
                v-model="queryForm.customer" 
                placeholder="Select Customer" 
                @change="handleCustomerChange"
                class="w-full"
              >
                <el-option 
                  v-for="item in customerOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Channel:" required>
              <el-select 
                v-model="queryForm.channel" 
                placeholder="Select Channel"
                class="w-full"
                :disabled="!queryForm.customer"
              >
                <el-option 
                  v-for="item in channelOptions" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Query Type:">
              <el-radio-group v-model="queryForm.type">
                <el-radio label="order">Channel Order</el-radio>
                <el-radio label="product">Channel Product</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="System Version:">
              <el-select 
                v-model="queryForm.systemVersion" 
                placeholder="Select System Version"
                class="w-full"
              >
                <el-option label="v2" value="v2" />
                <el-option label="v3" value="v3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Order Query Fields -->
        <div v-if="queryForm.type === 'order'">
          <el-divider content-position="left">Order Query</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Platform ID:">
                <el-input v-model="queryForm.channelOrderId" placeholder="Enter Platform Order ID" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="System ID:">
                <el-input v-model="queryForm.systemOrderId" placeholder="Enter System Order ID" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="System Status:">
                <el-select v-model="queryForm.orderStatus" placeholder="Select System Status" class="w-full">
                  <el-option 
                    v-for="item in orderStatusOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Channel Status:">
                <el-select v-model="queryForm.channelStatus" placeholder="Select Channel Status" class="w-full">
                  <el-option 
                    v-for="item in channelStatusOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="Order Date:">
                <div class="date-range-container">
                  <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="to"
                    start-placeholder="Start Date"
                    end-placeholder="End Date"
                    @change="handleDateRangeChange"
                    style="width: 100%; max-width: 400px;"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- Product Query Fields -->
        <div v-if="queryForm.type === 'product'">
          <el-divider content-position="left">Product Query</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Product Name:">
                <el-input v-model="queryForm.productName" placeholder="Enter Product Name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="SKU:">
                <el-input v-model="queryForm.sku" placeholder="Enter SKU or Channel SKU" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- Inventory Query Fields -->
        <div v-if="queryForm.type === 'inventory'">
          <el-divider content-position="left">Inventory Query</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Product Name:">
                <el-input v-model="queryForm.productName" placeholder="Enter Product Name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="SKU:">
                <el-input v-model="queryForm.sku" placeholder="Enter SKU or Channel SKU" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Inventory Status:">
                <el-select v-model="queryForm.inventoryStatus" placeholder="Select Inventory Status" class="w-full">
                  <el-option 
                    v-for="item in inventoryStatusOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Store:">
                <el-select v-model="queryForm.store" placeholder="Select Store" class="w-full">
                  <el-option 
                    v-for="item in storeOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- Operation Buttons -->
        <div class="button-container">
          <el-button type="primary" :icon="Search" @click="handleSearch" :loading="loading">Search</el-button>
          <el-button :icon="Refresh" @click="handleReset">Reset</el-button>
          <el-button type="success" :icon="Download" @click="handleExport" :loading="exportLoading">Export Data</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- Query Results -->
    <div v-if="showResults" class="results-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>
              <template v-if="queryForm.type === 'order'">Channel Order</template>
              <template v-if="queryForm.type === 'product'">Channel Product</template>
              Query Results
              <el-tag size="small" type="info" class="ml-2">System Version: {{ queryForm.systemVersion }}</el-tag>
            </span>
            <el-button :icon="RefreshRight" circle size="small" @click="handleRefresh" />
          </div>
        </template>

        <!-- Order Results -->
        <div v-if="queryForm.type === 'order'">
          <el-table v-loading="loading" :data="orderData" border style="width: 100%">
            <el-table-column prop="customerName" label="Customer Name" />
            <el-table-column label="Channel">
              <template #default="scope">
                {{ getChannelName(scope.row.channel) }}
              </template>
            </el-table-column>
            <el-table-column prop="store" label="Store Name" />
            <el-table-column prop="channelOrderId" label="Channel Order ID" />
            <el-table-column label="Channel Status">
              <template #default="scope">
                <el-tag type="info">{{ scope.row.channelStatus || 'Unknown' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Channel Order Time">
              <template #default="scope">
                {{ formatDate(scope.row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column label="System Order ID">
              <template #default="scope">
                <el-link v-if="scope.row.systemOrderId" type="primary" @click="goToOrderDetail(scope.row.systemOrderId)">
                  {{ scope.row.systemOrderId }}
                </el-link>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="System Status">
              <template #default="scope">
                <el-tag v-if="scope.row.status" :type="getStatusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="System Create Time">
              <template #default="scope">
                <span v-if="scope.row.systemCreateTime">{{ formatDate(scope.row.systemCreateTime) }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="240" fixed="right">
              <template #default="scope">
                <div class="action-buttons">
                  <el-dropdown>
                    <el-button size="small" type="primary" plain>
                      Actions<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="openOrderDetailDialog(scope.row)">View Details</el-dropdown-item>
                        <el-dropdown-item @click="viewChannelRawData(scope.row)">Channel Raw Data</el-dropdown-item>
                        <el-dropdown-item @click="viewDNRawData(scope.row)">DN Raw Data</el-dropdown-item>
                        <el-dropdown-item @click="viewDCRawData(scope.row)">DC Raw Data</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- Product Results -->
        <div v-if="queryForm.type === 'product'">
          <el-table v-loading="loading" :data="productData" border style="width: 100%">
            <el-table-column prop="customerName" label="Customer Name" />
            <el-table-column label="Channel">
              <template #default="scope">
                {{ getChannelName(scope.row.channel) }}
              </template>
            </el-table-column>
            <el-table-column prop="store" label="Store Name" />
            <el-table-column prop="productName" label="Product Name" show-overflow-tooltip />
            <el-table-column label="SKU">
              <template #default="scope">
                <div>{{ scope.row.sku }}</div>
                <div v-if="scope.row.channelSku" class="text-gray-500 text-xs">{{ scope.row.channelSku }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="masterSku" label="Master SKU">
              <template #default="scope">
                <el-link v-if="scope.row.masterSku" type="primary" :underline="false">{{ scope.row.masterSku }}</el-link>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="masterProductName" label="Master Product Name" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.masterProductName || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="Inventory Location">
              <template #default="scope">
                <el-popover
                  placement="top-start"
                  title="库存位置详情"
                  :width="280"
                  trigger="hover"
                >
                  <template #default>
                    <div class="inventory-location-detail">
                      <div v-if="scope.row.inventoryLocations && scope.row.inventoryLocations.length > 0">
                        <div class="location-item" v-for="(loc, index) in scope.row.inventoryLocations" :key="index">
                          <span class="location-name">{{ loc.name }}:</span>
                          <span class="location-quantity">{{ loc.quantity || 0 }}</span>
                        </div>
                      </div>
                      <div v-else class="no-location">
                        <span>暂无库存位置信息</span>
                      </div>
                    </div>
                  </template>
                  <template #reference>
                    <span class="inventory-location-hover">
                      {{ getMainLocation(scope.row) }}
                    </span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Channel Stock" align="right">
              <template #default="scope">
                {{ scope.row.stock || '0' }}
              </template>
            </el-table-column>
            <el-table-column label="WMS Stock" align="right">
              <template #default="scope">
                <el-popover
                  placement="top-start"
                  title="Warehouse Stock Details"
                  :width="280"
                  trigger="hover"
                >
                  <template #default>
                    <div class="warehouse-stock-detail">
                      <div class="warehouse-item" v-if="scope.row.warehouseStock?.US">
                        <span class="warehouse-name">US Warehouse:</span>
                        <span class="warehouse-count">{{ scope.row.warehouseStock.US || 0 }}</span>
                      </div>
                      <div class="warehouse-item" v-if="scope.row.warehouseStock?.EU">
                        <span class="warehouse-name">EU Warehouse:</span>
                        <span class="warehouse-count">{{ scope.row.warehouseStock.EU || 0 }}</span>
                      </div>
                      <div class="warehouse-item" v-if="scope.row.warehouseStock?.CN">
                        <span class="warehouse-name">China Warehouse:</span>
                        <span class="warehouse-count">{{ scope.row.warehouseStock.CN || 0 }}</span>
                      </div>
                      <div class="warehouse-item" v-if="scope.row.warehouseStock?.UK">
                        <span class="warehouse-name">UK Warehouse:</span>
                        <span class="warehouse-count">{{ scope.row.warehouseStock.UK || 0 }}</span>
                      </div>
                      <div class="warehouse-item" v-if="!scope.row.warehouseStock">
                        <span>No warehouse stock details available</span>
                      </div>
                    </div>
                  </template>
                  <template #reference>
                    <span class="wms-stock-hover">{{ scope.row.wmsStock || '0' }}</span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Last Synced Stock" align="right">
              <template #default="scope">
                <el-popover
                  placement="top-start"
                  title="Stock Sync Rules"
                  :width="300"
                  trigger="hover"
                >
                  <template #default>
                    <div class="sync-rules-detail">
                      <div class="rule-item">
                        <div class="rule-title">Sync Mode:</div>
                        <div class="rule-content">
                          <el-tag size="small" type="primary" v-if="scope.row.syncRule?.type === 'percent'">Percentage Sync</el-tag>
                          <el-tag size="small" type="success" v-else-if="scope.row.syncRule?.type === 'fixed'">Fixed Quantity</el-tag>
                          <el-tag size="small" type="warning" v-else-if="scope.row.syncRule?.type === 'reduce'">Reduction Sync</el-tag>
                          <el-tag size="small" type="info" v-else>Not Set</el-tag>
                        </div>
                      </div>
                      
                      <div class="rule-item" v-if="scope.row.syncRule?.type === 'percent'">
                        <div class="rule-title">Sync Percentage:</div>
                        <div class="rule-content">
                          <span class="rule-value">{{ scope.row.syncRule.value }}%</span> 
                          <span class="rule-desc">of inventory</span>
                        </div>
                      </div>
                      
                      <div class="rule-item" v-if="scope.row.syncRule?.type === 'fixed'">
                        <div class="rule-title">Fixed Quantity:</div>
                        <div class="rule-content">
                          <span class="rule-value">{{ scope.row.syncRule.value }} units</span>
                          <span class="rule-desc">of inventory</span>
                        </div>
                      </div>
                      
                      <div class="rule-item" v-if="scope.row.syncRule?.type === 'reduce'">
                        <div class="rule-title">Reduction Amount:</div>
                        <div class="rule-content">
                          <span class="rule-value">{{ scope.row.syncRule.method === 'percent' ? scope.row.syncRule.value + '%' : scope.row.syncRule.value + ' units' }}</span>
                          <span class="rule-desc">after reducing inventory by this {{ scope.row.syncRule.method === 'percent' ? 'percentage' : 'amount' }}</span>
                        </div>
                      </div>
                      
                      <div class="rule-item">
                        <div class="rule-title">Last Synced:</div>
                        <div class="rule-content">{{ formatDate(scope.row.lastSyncTime || scope.row.updateTime) }}</div>
                      </div>
                    </div>
                  </template>
                  <template #reference>
                    <span class="sync-stock-hover">{{ scope.row.lastSyncStock || '0' }}</span>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="Last Sync Time">
              <template #default="scope">
                {{ formatDate(scope.row.updateTime) }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- Empty State -->
        <el-empty v-if="isEmptyResult" description="No Data" />

        <!-- Pagination -->
        <div class="pagination-container" v-if="!isEmptyResult" style="text-align: right; margin-top: 20px;">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :small="false"
            :disabled="false"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- Order Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Channel Order Details"
      width="70%"
      :destroy-on-close="true"
      class="detail-dialog"
    >
      <div class="order-header">
        <div class="order-basic">
          <span class="order-title">Order ID: {{ currentOrder?.channelOrderId }}</span>
          <el-tag size="small" type="info">{{ currentOrder?.channelStatus || 'Unknown' }}</el-tag>
        </div>
        <div class="order-info">
          <span>Customer: {{ currentOrder?.customerName }}</span>
          <span class="divider">|</span>
          <span>Channel: {{ getChannelName(currentOrder?.channel || '') }}</span>
          <span class="divider">|</span>
          <span>Store: {{ currentOrder?.store || 'Default Store' }}</span>
          <span class="divider">|</span>
          <span>Order Time: {{ formatDate(currentOrder?.createTime || '') }}</span>
        </div>
      </div>
      
      <el-table :data="currentOrder?.items || []" border style="width: 100%; margin-top: 8px;">
        <el-table-column prop="productName" label="Product" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sku" label="SKU" width="130" />
        <el-table-column label="Unit Price" width="100" align="right">
          <template #default="props">
            ¥{{ props.row.price?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="Quantity" width="80" align="center" />
        <el-table-column label="Subtotal" width="100" align="right">
          <template #default="props">
            ¥{{ props.row.total?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="Fulfillment Status" width="100" align="center">
          <template #default="props">
            <el-tag :type="getFulfillmentStatusType(props.row.fulfillmentStatus || getRandomShopifyFulfillmentStatus())">
              {{ props.row.fulfillmentStatus || getRandomShopifyFulfillmentStatus() }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="dialog-footer">
        <div class="total-amount">
          <span>Order Total: <strong>¥{{ currentOrder?.amount.toFixed(2) }}</strong></span>
        </div>
      </div>
    </el-dialog>

    <!-- Channel Raw Data Dialog -->
    <el-dialog
      v-model="channelRawDataVisible"
      title="Channel原始数据"
      width="70%"
      :destroy-on-close="true"
      class="raw-data-dialog"
    >
      <div class="raw-data-header">
        <span>订单ID: {{ currentOrder?.channelOrderId }}</span>
        <span>平台: {{ getChannelName(currentOrder?.channel || '') }}</span>
        <span>获取时间: {{ formatDate(new Date()) }}</span>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="订单信息">
          <div class="raw-data-content">
            <pre>{{ formatJson(currentChannelRawData) }}</pre>
          </div>
        </el-tab-pane>
        <el-tab-pane label="物流信息">
          <div class="raw-data-content" v-if="currentChannelShippingData">
            <pre>{{ formatJson(currentChannelShippingData) }}</pre>
          </div>
          <el-empty v-else description="无物流数据" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- DN Raw Data Dialog -->
    <el-dialog
      v-model="dnRawDataVisible"
      title="DN原始数据"
      width="70%"
      :destroy-on-close="true"
      class="raw-data-dialog"
    >
      <div class="raw-data-header">
        <span>订单ID: {{ currentOrder?.channelOrderId }}</span>
        <span>DN单号: {{ currentDNInfo?.dnNumber || '无DN单号' }}</span>
        <span>创建时间: {{ formatDate(currentDNInfo?.createTime || '') }}</span>
      </div>
      <div class="raw-data-content">
        <pre v-if="currentDNRawData">{{ formatJson(currentDNRawData) }}</pre>
        <el-empty v-else description="无DN数据" />
      </div>
    </el-dialog>

    <!-- DC Raw Data Dialog -->
    <el-dialog
      v-model="dcRawDataVisible"
      title="DC原始数据"
      width="70%"
      :destroy-on-close="true"
      class="raw-data-dialog"
    >
      <div class="raw-data-header">
        <span>订单ID: {{ currentOrder?.channelOrderId }}</span>
        <span>DC单号: {{ currentDCInfo?.dcNumber || '无DC单号' }}</span>
        <span>创建时间: {{ formatDate(currentDCInfo?.createTime || '') }}</span>
      </div>
      <div class="raw-data-content">
        <pre v-if="currentDCRawData">{{ formatJson(currentDCRawData) }}</pre>
        <el-empty v-else description="无DC数据" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { 
  Search, 
  Refresh, 
  Download, 
  RefreshRight,
  ArrowDown
} from '@element-plus/icons-vue'
import type { 
  OrderData, 
  ProductData, 
  QueryParams
} from '@/types/queryToolTypes'
import { 
  customers, 
  channelMap, 
  orderList, 
  productList 
} from '@/mock/queryToolData'

// 加载状态
const loading = ref(false)
const exportLoading = ref(false)
const showResults = ref(false)

// 日期区间
const dateRange = ref<[string, string] | null>(null)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 初始化路由
const router = useRouter()

// Raw Data 对话框状态
const channelRawDataVisible = ref(false)
const dnRawDataVisible = ref(false)
const dcRawDataVisible = ref(false)

// Raw Data 内容
const currentChannelRawData = ref<any>(null)
const currentChannelShippingData = ref<any>(null)
const currentDNRawData = ref<any>(null)
const currentDCRawData = ref<any>(null)
const currentDNInfo = ref<any>(null)
const currentDCInfo = ref<any>(null)

// 硬编码下拉选项
const orderStatusOptions = ref([
  { label: 'All', value: '' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Error', value: 'Error' }
])

const channelStatusOptions = ref([
  { label: 'All', value: '' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Unshipped', value: 'Unshipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Error', value: 'Error' }
])

const productStatusOptions = ref([
  { label: 'All', value: '' },
  { label: 'On Sale', value: 'On Sale' },
  { label: 'Unavailable', value: 'Unavailable' },
  { label: 'Out of Stock', value: 'Out of Stock' }
])

const inventoryStatusOptions = ref([
  { label: 'All', value: '' },
  { label: 'In Stock', value: 'In Stock' },
  { label: 'Low Stock', value: 'Low Stock' },
  { label: 'Out of Stock', value: 'Out of Stock' }
])

const storeOptions = ref([
  { label: 'All', value: '' },
  { label: 'US Store', value: 'US Store' },
  { label: 'EU Store', value: 'EU Store' },
  { label: 'Main Store', value: 'Main Store' },
  { label: 'UK Store', value: 'UK Store' },
  { label: 'CN Store', value: 'CN Store' }
])

// 初始化客户选项
const customerOptions = ref(
  customers.map(c => ({ label: c.name, value: c.id }))
)

// 渠道选项
const channelOptions = ref<{ label: string, value: string }[]>([])

// 查询表单
const queryForm = reactive<QueryParams>({
  customer: '',
  channel: '',
  type: 'order',
  channelOrderId: '',
  systemOrderId: '',
  productName: '',
  sku: '',
  page: 1,
  pageSize: 10,
  
  // 订单查询字段
  orderStatus: '',
  channelStatus: '',
  startDate: undefined,
  endDate: undefined,
  
  // 商品查询字段
  productStatus: '',
  minPrice: undefined,
  maxPrice: undefined,
  
  // 系统版本
  systemVersion: 'v2',
})

// 数据结果
const orderData = ref<OrderData[]>([])
const productData = ref<ProductData[]>([])

// 计算属性
const isEmptyResult = computed(() => {
  if (queryForm.type === 'order') {
    return orderData.value.length === 0
  } else if (queryForm.type === 'product') {
    return productData.value.length === 0
  }
})

// 客户选择变更时获取渠道列表
const handleCustomerChange = () => {
  queryForm.channel = ''
  
  if (!queryForm.customer) {
    channelOptions.value = []
    return
  }
  
  // 直接从mock数据中获取渠道列表
  const channels = channelMap[queryForm.customer] || []
  channelOptions.value = channels.map(c => ({ label: c.name, value: c.id }))
}

// 日期范围变更处理
const handleDateRangeChange = (val: [string, string] | null) => {
  if (val) {
    queryForm.startDate = val[0]
    queryForm.endDate = val[1]
  } else {
    queryForm.startDate = undefined
    queryForm.endDate = undefined
  }
}

// 获取客户名称
const getCustomerName = (row: OrderData) => {
  return row.customerName || '未知客户';
}

// 获取渠道名称
const getChannelName = (channelId: string): string => {
  for (const customerKey in channelMap) {
    const channels = channelMap[customerKey];
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      return channel.name;
    }
  }
  return channelId;
}

// 随机生成Shopify风格的履约状态
const getRandomShopifyFulfillmentStatus = () => {
  const statuses = ['Shipped', 'Pending', 'Partially Shipped', 'Out of Stock', 'Refunded', 'In Transit'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// 获取履约状态标签类型
const getFulfillmentStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'Shipped': 'success',
    'Pending': 'info',
    'Refunded': 'danger',
    'Out of Stock': 'warning',
    'Partially Shipped': 'primary',
    'In Transit': 'success',
    'Exchanged': 'warning'
  }
  return statusMap[status] || 'info';
}

// 统计各种履约状态的数量
const getFulfillmentCount = (status: string) => {
  if (!currentOrder.value?.items) return 0;
  let count = 0;
  currentOrder.value.items.forEach(item => {
    const itemStatus = item.fulfillmentStatus || getRandomShopifyFulfillmentStatus();
    if (itemStatus === status) {
      count += item.quantity;
    }
  });
  return count;
}

// 计算订单小计（商品金额）
const getOrderSubtotal = () => {
  if (!currentOrder.value?.items) return '0.00';
  const subtotal = currentOrder.value.items.reduce((total, item) => total + (item.total || 0), 0);
  return subtotal.toFixed(2);
}

// 模拟运费
const getShippingFee = () => {
  return (Math.random() * 20 + 10).toFixed(2);
}

// 模拟税费
const getTaxAmount = () => {
  const subtotal = parseFloat(getOrderSubtotal());
  return (subtotal * 0.09).toFixed(2);
}

// 搜索方法
const handleSearch = () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  showResults.value = true
  
  try {
    // 重置分页
    queryForm.page = currentPage.value
    queryForm.pageSize = pageSize.value
    
    // 打印系统版本信息
    console.log(`Querying with system version: ${queryForm.systemVersion || 'v2'}`);
    
    // 根据不同系统版本展示不同的提示
    if (queryForm.systemVersion === 'v3') {
      ElMessage.info('Querying data using V3 system...');
    }
    
    // 直接过滤数据进行查询
    if (queryForm.type === 'order') {
      let results = [...orderList]
      
      // 客户筛选 - 注意：mock数据中使用 customerName
      if (queryForm.customer) {
        // 查找对应客户名称
        const customer = customers.find(c => c.id === queryForm.customer);
        if (customer) {
          results = results.filter(item => item.customerName.includes(customer.name));
        }
      }
      
      if (queryForm.channel) {
        results = results.filter(item => item.channel === queryForm.channel)
      }
      
      if (queryForm.channelOrderId) {
        results = results.filter(item => item.channelOrderId.includes(queryForm.channelOrderId || ''))
      }
      
      if (queryForm.systemOrderId) {
        results = results.filter(item => 
          item.systemOrderId && item.systemOrderId.includes(queryForm.systemOrderId || '')
        )
      }
      
      if (queryForm.orderStatus) {
        results = results.filter(item => item.status === queryForm.orderStatus)
      }
      
      if (queryForm.channelStatus) {
        results = results.filter(item => item.channelStatus === queryForm.channelStatus)
      }
      
      if (queryForm.startDate && queryForm.endDate) {
        const startTimestamp = new Date(queryForm.startDate).getTime()
        const endTimestamp = new Date(queryForm.endDate).getTime() + 86400000 // 加一天，包含结束日期
        results = results.filter(item => {
          return item.createTime >= startTimestamp && item.createTime <= endTimestamp
        })
      }
      
      // 确保始终有数据
      if (results.length === 0) {
        console.log('No matching order data, showing all orders');
        results = [...orderList];
      }
      
      total.value = results.length
      const startIndex = (queryForm.page - 1) * queryForm.pageSize
      const endIndex = startIndex + queryForm.pageSize
      orderData.value = results.slice(startIndex, endIndex)
      
    } else if (queryForm.type === 'product') {
      let results = [...productList]
      
      // 客户筛选 - 使用渠道筛选代替
      if (queryForm.customer) {
        const customerChannels = channelMap[queryForm.customer] || [];
        const channelIds = customerChannels.map(c => c.id);
        if (channelIds.length > 0) {
          results = results.filter(item => channelIds.includes(item.channel));
        }
      }
      
      if (queryForm.channel) {
        results = results.filter(item => item.channel === queryForm.channel)
      }
      
      if (queryForm.productName) {
        results = results.filter(item => item.productName.includes(queryForm.productName || ''))
      }
      
      if (queryForm.sku) {
        results = results.filter(item => item.sku.includes(queryForm.sku || '') || 
                                        (item.channelSku && item.channelSku.includes(queryForm.sku || '')))
      }
      
      if (queryForm.productStatus) {
        results = results.filter(item => item.status === queryForm.productStatus)
      }
      
      if (queryForm.minPrice !== undefined) {
        results = results.filter(item => item.price >= queryForm.minPrice!)
      }
      
      if (queryForm.maxPrice !== undefined) {
        results = results.filter(item => item.price <= queryForm.maxPrice!)
      }
      
      // 确保始终有数据
      if (results.length === 0) {
        console.log('No matching product data, showing all products');
        results = [...productList];
      }
      
      total.value = results.length
      const startIndex = (queryForm.page - 1) * queryForm.pageSize
      const endIndex = startIndex + queryForm.pageSize
      productData.value = results.slice(startIndex, endIndex)
    }
    
  } catch (error) {
    console.error('Query failed:', error)
    ElMessage.error('Query failed, please try again later')
  } finally {
    loading.value = false
  }
}

// 表单验证
const validateForm = () => {
  if (!queryForm.customer) {
    ElMessage.warning('Please select a customer')
    return false
  }
  
  if (!queryForm.channel) {
    ElMessage.warning('Please select a channel')
    return false
  }
  
  return true
}

// 重置表单
const handleReset = () => {
  // 保存当前的系统版本
  const currentSystemVersion = queryForm.systemVersion;
  
  // 重置基本字段
  queryForm.channelOrderId = ''
  queryForm.systemOrderId = ''
  queryForm.productName = ''
  queryForm.sku = ''
  
  // 重置搜索字段 - 订单
  queryForm.orderStatus = ''
  queryForm.channelStatus = ''
  queryForm.startDate = undefined
  queryForm.endDate = undefined
  dateRange.value = null
  
  // 重置搜索字段 - 商品
  queryForm.productStatus = ''
  queryForm.minPrice = undefined
  queryForm.maxPrice = undefined
  
  // 重置搜索字段 - 库存
  queryForm.inventoryStatus = ''
  queryForm.store = ''
  
  // 保留系统版本设置
  queryForm.systemVersion = currentSystemVersion;
  
  showResults.value = false
  currentPage.value = 1
  total.value = 0
}

// 刷新数据
const handleRefresh = () => {
  if (showResults.value) {
    handleSearch()
  }
}

// 导出数据
const handleExport = () => {
  if (!validateForm()) {
    return
  }
  
  exportLoading.value = true
  setTimeout(() => {
    ElMessage.success('Export successful')
    exportLoading.value = false
  }, 1000)
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  queryForm.pageSize = size
  handleSearch()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  queryForm.page = page
  handleSearch()
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    'Completed': 'success',
    'Processing': 'primary',
    'Pending': 'info',
    'Error': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取商品状态标签类型
const getProductStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    'On Sale': 'success',
    'Unavailable': 'info',
    'Out of Stock': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取库存标签类型
const getInventoryTagType = (quantity: number) => {
  if (quantity <= 0) return 'danger'
  if (quantity < 10) return 'warning'
  return 'success'
}

// 日期格式化
const formatDate = (date: string | number | Date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString()
}

// 跳转到订单详情页
const goToOrderDetail = (orderNo: string) => {
  router.push(`/order/sales/detail/${orderNo}`)
}

// 订单详情对话框
const detailDialogVisible = ref(false)
const currentOrder = ref<OrderData | null>(null)

// 打开订单详情对话框
const openOrderDetailDialog = (order: OrderData) => {
  currentOrder.value = order
  detailDialogVisible.value = true
}

// 查看三方平台原始数据
const viewChannelRawData = (order: OrderData) => {
  loading.value = true
  currentOrder.value = order
  
  // 模拟获取数据的延迟
  setTimeout(() => {
    // 模拟从API获取的Channel平台原始数据
    currentChannelRawData.value = generateMockChannelData(order)
    currentChannelShippingData.value = generateMockShippingData(order)
    
    channelRawDataVisible.value = true
    loading.value = false
  }, 500)
}

// 查看DN原始数据
const viewDNRawData = (order: OrderData) => {
  loading.value = true
  currentOrder.value = order
  
  // 模拟获取数据的延迟
  setTimeout(() => {
    // 模拟从API获取的DN原始数据
    const hasData = Math.random() > 0.3 // 70%的概率有数据
    
    if (hasData) {
      currentDNInfo.value = {
        dnNumber: `DN${Math.floor(Math.random() * 10000000)}`,
        createTime: Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000), // 随机1-10天前
        status: ['已创建', '已发货', '已完成'][Math.floor(Math.random() * 3)]
      }
      currentDNRawData.value = generateMockDNData(order)
    } else {
      currentDNInfo.value = null
      currentDNRawData.value = null
    }
    
    dnRawDataVisible.value = true
    loading.value = false
  }, 500)
}

// 查看DC原始数据
const viewDCRawData = (order: OrderData) => {
  loading.value = true
  currentOrder.value = order
  
  // 模拟获取数据的延迟
  setTimeout(() => {
    // 模拟从API获取的DC原始数据
    const hasData = Math.random() > 0.4 // 60%的概率有数据
    
    if (hasData) {
      currentDCInfo.value = {
        dcNumber: `DC${Math.floor(Math.random() * 10000000)}`,
        createTime: Date.now() - Math.floor(Math.random() * 8 * 24 * 60 * 60 * 1000), // 随机1-8天前
        status: ['已创建', '处理中', '已完成', '已取消'][Math.floor(Math.random() * 4)]
      }
      currentDCRawData.value = generateMockDCData(order)
    } else {
      currentDCInfo.value = null
      currentDCRawData.value = null
    }
    
    dcRawDataVisible.value = true
    loading.value = false
  }, 500)
}

// 生成模拟的Channel平台原始数据
const generateMockChannelData = (order: OrderData) => {
  const channel = getChannelName(order.channel)
  
  // 根据不同渠道生成不同格式的数据
  if (channel.includes('Shopify')) {
    return {
      id: order.channelOrderId,
      created_at: new Date(order.createTime).toISOString(),
      updated_at: new Date(order.createTime + 3600000).toISOString(),
      number: Math.floor(Math.random() * 1000) + 1,
      note: '',
      total_price: order.amount.toString(),
      subtotal_price: (order.amount * 0.9).toFixed(2),
      total_tax: (order.amount * 0.1).toFixed(2),
      currency: "CNY",
      financial_status: order.channelStatus?.toLowerCase() || "paid",
      confirmed: true,
      total_discounts: "0.00",
      total_line_items_price: order.amount.toString(),
      cart_token: null,
      buyer_accepts_marketing: false,
      name: `#${order.channelOrderId}`,
      referring_site: "",
      landing_site: "/",
      cancelled_at: null,
      cancel_reason: null,
      total_price_usd: (order.amount / 7).toFixed(2),
      checkout_token: null,
      reference: null,
      user_id: null,
      location_id: null,
      source_identifier: null,
      source_url: null,
      processed_at: new Date(order.createTime).toISOString(),
      device_id: null,
      phone: null,
      customer_locale: "en",
      line_items: order.items?.map(item => ({
        id: Math.floor(Math.random() * 10000000),
        variant_id: Math.floor(Math.random() * 10000000),
        title: item.productName,
        quantity: item.quantity,
        sku: item.sku,
        variant_title: "",
        vendor: "Example Store",
        fulfillment_service: "manual",
        product_id: Math.floor(Math.random() * 10000000),
        requires_shipping: true,
        taxable: true,
        gift_card: false,
        price: item.price?.toString() || "0.00",
        total_discount: "0.00",
        fulfillment_status: item.fulfillmentStatus?.toLowerCase() || null
      })),
      shipping_lines: [
        {
          id: Math.floor(Math.random() * 10000000),
          title: "Standard Shipping",
          price: "5.00",
          code: "Standard",
          source: "shopify",
          carrier_identifier: null,
          requested_fulfillment_service_id: null
        }
      ],
      billing_address: {
        first_name: "测试",
        address1: "Test Address",
        phone: "13800138000",
        city: "Beijing",
        zip: "100000",
        province: "Beijing",
        country: "China",
        last_name: "用户",
        address2: "",
        company: null,
        name: "测试 用户",
        country_code: "CN",
        province_code: "BJ"
      },
      shipping_address: {
        first_name: "测试",
        address1: "Test Address",
        phone: "13800138000",
        city: "Beijing",
        zip: "100000",
        province: "Beijing",
        country: "China",
        last_name: "用户",
        address2: "",
        company: null,
        name: "测试 用户",
        country_code: "CN",
        province_code: "BJ"
      },
      fulfillments: []
    }
  } else if (channel.includes('Amazon')) {
    return {
      AmazonOrderId: order.channelOrderId,
      PurchaseDate: new Date(order.createTime).toISOString(),
      LastUpdateDate: new Date(order.createTime + 7200000).toISOString(),
      OrderStatus: order.channelStatus,
      FulfillmentChannel: "MFN",
      SalesChannel: "Amazon.com",
      OrderTotal: {
        CurrencyCode: "CNY",
        Amount: order.amount.toString()
      },
      NumberOfItemsShipped: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      NumberOfItemsUnshipped: 0,
      PaymentMethod: "COD",
      BuyerEmail: "buyer@example.com",
      BuyerName: "Test Buyer",
      ShipmentServiceLevelCategory: "Standard",
      ShippedByAmazonTFM: false,
      OrderType: "StandardOrder",
      EarliestShipDate: new Date(order.createTime + 86400000).toISOString(),
      LatestShipDate: new Date(order.createTime + 3 * 86400000).toISOString(),
      EarliestDeliveryDate: new Date(order.createTime + 5 * 86400000).toISOString(),
      LatestDeliveryDate: new Date(order.createTime + 10 * 86400000).toISOString(),
      IsBusinessOrder: false,
      IsPrime: false,
      IsGlobalExpressEnabled: false,
      IsSoldByAB: false,
      IsIBA: false,
      DefaultShipFromLocationAddress: {
        City: "Beijing",
        CountryCode: "CN",
        PostalCode: "100000",
        StateOrRegion: "Beijing",
        AddressLine1: "Test Address",
        AddressLine2: ""
      },
      FulfillmentInstruction: {
        FulfillmentSupplySourceId: "CHINA_CENTRAL_WAREHOUSE"
      },
      IsISPU: false,
      MarketplaceId: "ATVPDKIKX0DER",
      SellerOrderId: order.systemOrderId || undefined,
      OrderItems: order.items?.map(item => ({
        ASIN: Math.random().toString(36).substring(2, 10).toUpperCase(),
        SellerSKU: item.sku,
        OrderItemId: Math.floor(Math.random() * 10000000).toString(),
        Title: item.productName,
        QuantityOrdered: item.quantity,
        QuantityShipped: item.fulfillmentStatus === "Shipped" ? item.quantity : 0,
        ItemPrice: {
          CurrencyCode: "CNY",
          Amount: item.price?.toString() || "0.00"
        },
        ShippingPrice: {
          CurrencyCode: "CNY",
          Amount: "5.00"
        },
        ItemTax: {
          CurrencyCode: "CNY",
          Amount: (item.price * 0.1).toFixed(2) || "0.00"
        },
        ShippingTax: {
          CurrencyCode: "CNY",
          Amount: "0.00"
        },
        ShippingDiscount: {
          CurrencyCode: "CNY",
          Amount: "0.00"
        },
        PromotionDiscount: {
          CurrencyCode: "CNY",
          Amount: "0.00"
        }
      }))
    }
  } else {
    // 通用格式
    return {
      orderId: order.channelOrderId,
      channelId: order.channel,
      channelName: getChannelName(order.channel),
      orderStatus: order.channelStatus,
      createTime: new Date(order.createTime).toISOString(),
      updateTime: new Date(order.createTime + 3600000).toISOString(),
      totalAmount: order.amount,
      currencyCode: "CNY",
      customerInfo: {
        name: "测试用户",
        phone: "13800138000",
        email: "test@example.com"
      },
      addressInfo: {
        recipient: "测试用户",
        phone: "13800138000",
        province: "Beijing",
        city: "Beijing",
        district: "Chaoyang District",
        address: "Test Address",
        postalCode: "100000"
      },
      products: order.items?.map(item => ({
        productId: Math.floor(Math.random() * 10000000).toString(),
        productName: item.productName,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.total,
        attributes: []
      })),
      paymentInfo: {
        paymentMethod: "Online",
        paymentTime: new Date(order.createTime + 1800000).toISOString(),
        paymentStatus: "已支付"
      },
      fulfillmentInfo: {
        fulfillmentStatus: order.items?.every(item => (item.fulfillmentStatus || "Pending") === "Shipped") ? "已发货" : "部分发货",
        fulfillmentTime: order.items?.some(item => (item.fulfillmentStatus || "Pending") === "Shipped") ? new Date(order.createTime + 86400000).toISOString() : null,
        trackingNumber: order.items?.some(item => (item.fulfillmentStatus || "Pending") === "Shipped") ? `TN${Math.floor(Math.random() * 10000000)}` : null,
        logisticsCompany: "顺丰快递"
      }
    }
  }
}

// 生成模拟的物流数据
const generateMockShippingData = (order: OrderData) => {
  // 检查是否有已发货的商品
  const hasShippedItems = order.items?.some(item => 
    (item.fulfillmentStatus || getRandomShopifyFulfillmentStatus()) === "Shipped" || 
    (item.fulfillmentStatus || getRandomShopifyFulfillmentStatus()) === "Partially Shipped"
  )
  
  if (!hasShippedItems) {
    return null
  }
  
  const trackingNumber = `TN${Math.floor(Math.random() * 10000000)}`
  const shippingCompany = ["SF Express", "YTO Express", "ZTO Express", "UPS", "FedEx", "DHL"][Math.floor(Math.random() * 6)]
  const createTime = order.createTime + 86400000 // 下单一天后发货
  
  const events = []
  let currentTime = createTime
  
  // 生成物流事件
  events.push({
    time: new Date(currentTime).toISOString(),
    context: "包裹已由寄件人发出，等待揽收",
    location: "发件人地址"
  })
  
  currentTime += Math.floor(Math.random() * 8 + 4) * 3600000 // 4-12小时后
  events.push({
    time: new Date(currentTime).toISOString(),
    context: `包裹已由${shippingCompany}揽收`,
    location: "发件人地址附近集散中心"
  })
  
  currentTime += Math.floor(Math.random() * 24 + 12) * 3600000 // 12-36小时后
  events.push({
    time: new Date(currentTime).toISOString(),
    context: "包裹已到达区域转运中心",
    location: "区域转运中心"
  })
  
  currentTime += Math.floor(Math.random() * 36 + 24) * 3600000 // 24-60小时后
  events.push({
    time: new Date(currentTime).toISOString(),
    context: "包裹已到达目的地城市",
    location: "目的地城市转运中心"
  })
  
  currentTime += Math.floor(Math.random() * 12 + 8) * 3600000 // 8-20小时后
  events.push({
    time: new Date(currentTime).toISOString(),
    context: "包裹已派送至目的地快递点",
    location: "目的地快递点"
  })
  
  // 50%的概率包裹已送达
  if (Math.random() > 0.5) {
    currentTime += Math.floor(Math.random() * 8 + 4) * 3600000 // 4-12小时后
    events.push({
      time: new Date(currentTime).toISOString(),
      context: "包裹已送达，签收人: 收件人",
      location: "收件人地址"
    })
  }
  
  return {
    trackingNumber: trackingNumber,
    shippingCompany: shippingCompany,
    createTime: new Date(createTime).toISOString(),
    status: events[events.length - 1].context.includes("已送达") ? "已送达" : "运输中",
    receiverAddress: {
      recipient: "测试用户",
      phone: "13800138000",
      province: "Beijing",
      city: "Beijing",
      district: "Chaoyang District",
      address: "Test Address",
      postalCode: "100000"
    },
    events: events
  }
}

// 生成模拟的DN数据
const generateMockDNData = (order: OrderData) => {
  const dnItems = order.items?.map(item => ({
    sku: item.sku,
    productName: item.productName,
    quantity: item.quantity,
    sourceLocation: ["CN Warehouse", "US Warehouse", "EU Warehouse"][Math.floor(Math.random() * 3)],
    lotNumber: `LOT${Math.floor(Math.random() * 1000)}`,
    serialNumber: Math.random() > 0.3 ? `SN${Math.floor(Math.random() * 10000000)}` : null,
    status: ["待处理", "已分配", "已拣货", "已发运"][Math.floor(Math.random() * 4)]
  }))
  
  return {
    dnNumber: currentDNInfo.value.dnNumber,
    orderNumber: order.systemOrderId || "未关联订单",
    channelOrderNumber: order.channelOrderId,
    createTime: new Date(currentDNInfo.value.createTime).toISOString(),
    status: currentDNInfo.value.status,
    warehouseCode: ["WH_CN", "WH_US", "WH_EU"][Math.floor(Math.random() * 3)],
    fulfillmentType: ["自发货", "三方物流", "平台物流"][Math.floor(Math.random() * 3)],
    items: dnItems,
    shippingMethod: ["空运", "海运", "陆运", "快递"][Math.floor(Math.random() * 4)],
    trackingNumber: Math.random() > 0.3 ? `TN${Math.floor(Math.random() * 10000000)}` : null,
    carrier: ["UPS", "FedEx", "DHL", "顺丰", "圆通", "中通"][Math.floor(Math.random() * 6)],
    operationRecords: [
      {
        operationTime: new Date(currentDNInfo.value.createTime).toISOString(),
        operationType: "创建DN",
        operator: "系统",
        remark: "系统自动创建DN"
      },
      {
        operationTime: new Date(currentDNInfo.value.createTime + 3600000).toISOString(),
        operationType: "分配库存",
        operator: "system_user",
        remark: ""
      },
      {
        operationTime: new Date(currentDNInfo.value.createTime + 7200000).toISOString(),
        operationType: "生成拣货单",
        operator: "warehouse_user",
        remark: ""
      }
    ]
  }
}

// 生成模拟的DC数据
const generateMockDCData = (order: OrderData) => {
  const dcItems = order.items?.map(item => ({
    sku: item.sku,
    productName: item.productName,
    quantity: item.quantity,
    returnReason: ["质量问题", "尺寸不合适", "不喜欢", "损坏", "其他"][Math.floor(Math.random() * 5)],
    returnCondition: ["全新", "轻微使用", "明显使用", "损坏"][Math.floor(Math.random() * 4)],
    processingMethod: ["退回库存", "报废", "返厂", "待定"][Math.floor(Math.random() * 4)],
    status: ["待处理", "已检查", "已入库", "已报废"][Math.floor(Math.random() * 4)]
  }))
  
  return {
    dcNumber: currentDCInfo.value.dcNumber,
    orderNumber: order.systemOrderId || "未关联订单",
    channelOrderNumber: order.channelOrderId,
    createTime: new Date(currentDCInfo.value.createTime).toISOString(),
    status: currentDCInfo.value.status,
    warehouseCode: ["WH_CN", "WH_US", "WH_EU"][Math.floor(Math.random() * 3)],
    returnType: ["客户退货", "仓库退货", "拒收", "其他"][Math.floor(Math.random() * 4)],
    items: dcItems,
    returnTrackingNumber: Math.random() > 0.3 ? `RTN${Math.floor(Math.random() * 10000000)}` : null,
    returnCarrier: ["UPS", "FedEx", "DHL", "顺丰", "圆通", "中通"][Math.floor(Math.random() * 6)],
    operationRecords: [
      {
        operationTime: new Date(currentDCInfo.value.createTime).toISOString(),
        operationType: "创建DC",
        operator: "系统",
        remark: "系统自动创建DC"
      },
      {
        operationTime: new Date(currentDCInfo.value.createTime + 3600000).toISOString(),
        operationType: "确认退货信息",
        operator: "service_user",
        remark: ""
      },
      {
        operationTime: new Date(currentDCInfo.value.createTime + 7200000).toISOString(),
        operationType: "生成入库单",
        operator: "warehouse_user",
        remark: ""
      }
    ]
  }
}

// 格式化JSON数据显示
const formatJson = (json: any) => {
  if (!json) return ''
  return JSON.stringify(json, null, 2)
}

// 获取主要库存位置
const getMainLocation = (product: any) => {
  if (!product.inventoryLocations || product.inventoryLocations.length === 0) {
    return '未指定'
  }
  
  // 找出库存最多的位置
  const mainLocation = [...(product.inventoryLocations || [])].sort((a, b) => 
    (b.quantity || 0) - (a.quantity || 0)
  )[0]
  
  return mainLocation ? `${mainLocation.name} (${mainLocation.quantity || 0})` : '未指定'
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.sub-title {
  color: #666;
  margin-top: 5px;
}

.filter-container {
  margin-bottom: 20px;
}

.results-container {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.w-full {
  width: 100%;
}

.text-gray-500 {
  color: #999;
}

.text-xs {
  font-size: 0.75rem;
}

/* 确保表单标签不会换行 */
:deep(.el-form-item__label) {
  white-space: nowrap !important;
  overflow: visible !important;
  text-overflow: clip !important;
  font-size: 14px;
}

/* 调整表单项的间距和对齐 */
:deep(.el-form-item) {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
}

:deep(.el-form-item__content) {
  flex: 1;
  overflow: hidden;
}

/* 确保表单行不会过度拥挤 */
.el-row {
  margin-bottom: 5px;
}

/* 订单详情对话框样式 */
.detail-dialog :deep(.el-dialog__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
}

.detail-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.detail-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.detail-dialog :deep(.el-dialog__footer) {
  display: none;
}

.order-header {
  margin-bottom: 16px;
}

.order-basic {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.order-info {
  color: #606266;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.divider {
  color: #dcdfe6;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.total-amount {
  font-size: 14px;
  color: #606266;
}

.total-amount strong {
  color: #f56c6c;
  font-size: 16px;
}

.warehouse-stock-detail {
  padding: 10px;
}

.warehouse-item {
  margin-bottom: 5px;
}

.warehouse-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.warehouse-count {
  font-size: 14px;
  color: #606266;
  margin-left: 10px;
}

.wms-stock-hover {
  cursor: pointer;
  color: #409eff;
}

.sync-rules-detail {
  padding: 10px;
}

.rule-item {
  margin-bottom: 5px;
}

.rule-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.rule-content {
  font-size: 14px;
  color: #606266;
}

.rule-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.rule-desc {
  font-size: 12px;
  color: #999;
}

.sync-stock-hover {
  cursor: pointer;
  color: #409eff;
}

.inventory-location-detail {
  padding: 10px;
}

.location-item {
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.location-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.location-quantity {
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
}

.no-location {
  color: #909399;
  font-size: 13px;
  text-align: center;
  padding: 5px 0;
}

.inventory-location-hover {
  cursor: pointer;
  color: #409eff;
}

.ml-2 {
  margin-left: 8px;
}

.date-range-container {
  display: flex;
  align-items: center;
}

/* 新增的样式 */
.action-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.raw-data-dialog :deep(.el-dialog__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
}

.raw-data-dialog :deep(.el-dialog__body) {
  padding: 15px 20px;
}

.raw-data-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ebeef5;
  color: #606266;
  font-size: 14px;
}

.raw-data-content {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  max-height: 60vh;
  overflow-y: auto;
}

.raw-data-content pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #333;
}

.product-detail {
  padding: 0 10px;
}

.product-detail h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  color: var(--el-color-primary);
}
</style> 