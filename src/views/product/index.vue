<template>
  <div class="product-list">
    <!-- Shein风格筛选面板 -->
    <div class="filter-panel-shein">
      <div class="filter-grid">
        <!-- 第一行 -->
        <div class="filter-item">
          <label class="filter-label">Product Name</label>
          <el-input
            v-model="searchQuery"
            placeholder="Enter product name"
            clearable
            @input="handleSearch"
            @clear="handleSearch"
          />
        </div>
        <div class="filter-item">
          <label class="filter-label">Seller SKU</label>
          <el-input
            placeholder="Enter seller SKU"
            clearable
          />
        </div>
        <div class="filter-item">
          <label class="filter-label">Parent SKU</label>
          <el-input
            placeholder="Enter parent SKU"
            clearable
          />
        </div>
        
        <!-- 第二行 -->
        <div class="filter-item">
          <label class="filter-label">SKC</label>
          <el-input
            placeholder="Enter SKC"
            clearable
          />
        </div>
        <div class="filter-item">
          <label class="filter-label">Brand</label>
          <el-select
            v-model="filterBrand"
            placeholder="Select brand"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="brand in brands"
              :key="brand"
              :label="brand"
              :value="brand"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-label">Category</label>
          <el-select
            v-model="filterCategory"
            placeholder="Select category"
            clearable
            @change="handleSearch"
          >
            <el-option label="Electronics" value="electronics" />
            <el-option label="Clothing" value="clothing" />
            <el-option label="Books" value="books" />
            <el-option label="Home & Garden" value="home-garden" />
          </el-select>
        </div>
        
        <!-- 第三行 - 日期筛选 -->
        <div class="filter-item filter-date">
          <label class="filter-label">Date Created</label>
          <div class="date-range">
            <el-date-picker
              placeholder="Start date"
              style="width: 48%"
            />
            <span class="date-separator">to</span>
            <el-date-picker
              placeholder="End date"
              style="width: 48%"
            />
          </div>
        </div>
        <div class="filter-item filter-date">
          <label class="filter-label">Date Listed</label>
          <div class="date-range">
            <el-date-picker
              placeholder="Start date"
              style="width: 48%"
            />
            <span class="date-separator">to</span>
            <el-date-picker
              placeholder="End date"
              style="width: 48%"
            />
          </div>
        </div>
        <div class="filter-item filter-date">
          <label class="filter-label">Date Added</label>
          <div class="date-range">
            <el-date-picker
              placeholder="Start date"
              style="width: 48%"
            />
            <span class="date-separator">to</span>
            <el-date-picker
              placeholder="End date"
              style="width: 48%"
            />
          </div>
        </div>
      </div>
      
      <!-- 搜索按钮区 -->
      <div class="filter-actions">
        <el-button @click="clearAllFilters" :icon="Refresh">Reset</el-button>
        <el-button type="primary" @click="handleSearch" :icon="Search">Search</el-button>
      </div>
    </div>

    <!-- 状态标签栏 + 统计 + 操作 -->
    <div class="status-bar-shein">
      <!-- 左侧：状态标签 -->
      <div class="status-tabs">
        <div class="status-tab active">
          <span>All</span>
          <span class="status-count">({{ total }})</span>
        </div>
        <div class="status-tab">
          <span>Pending</span>
          <span class="status-count">(1)</span>
        </div>
        <div class="status-tab">
          <span>Listed</span>
          <span class="status-count">(1)</span>
        </div>
        <div class="status-tab">
          <span>Sold Out</span>
          <span class="status-count">(1)</span>
        </div>
        <div class="status-tab">
          <span>Deleted</span>
          <span class="status-count">(1)</span>
        </div>
        <div class="status-tab">
          <span>Draft</span>
          <span class="status-count">(1)</span>
        </div>
        <div class="status-tab">
          <span>Failed</span>
          <span class="status-count">(1)</span>
        </div>
      </div>
      
      <!-- 右侧：统计 + 操作 -->
      <div class="status-right">
        <div class="stats-group">
          <span class="stat-item">Total Products: <strong>{{ total }}</strong></span>
          <span class="stat-item">Published: <strong class="text-success">2</strong></span>
          <span class="stat-item">Remaining: <strong class="text-warning">5998</strong></span>
        </div>
        
        <el-dropdown trigger="click" class="batch-dropdown">
          <el-button type="primary" plain>
            Batch Actions
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Upload" @click="handleBatchPublish" :disabled="selectedProducts.length === 0 || !canBatchPublish">
                Batch Publish
              </el-dropdown-item>
              <el-dropdown-item :icon="Money" @click="handleBatchPriceAdjust" :disabled="selectedProducts.length === 0">
                Batch Price
              </el-dropdown-item>
              <el-dropdown-item :icon="PriceTag" @click="handleBatchSpecialPrice" :disabled="selectedProducts.length === 0">
                Batch Special Price
              </el-dropdown-item>
              <el-dropdown-item :icon="Delete" @click="handleBatchDelete" :disabled="selectedProducts.length === 0 || !canBatchDelete" divided>
                Batch Delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <el-button type="primary" :icon="Plus" @click="handleCreate">Create</el-button>
        
        <el-button :icon="Refresh" @click="loadProducts" circle />
        <el-button :icon="Setting" @click="handleColumnConfig" circle />
      </div>
    </div>

    <el-card class="table-card" shadow="never">

      <el-table
        v-loading="loading"
        :data="products"
        border
        stripe
         style="width: 100%; min-width: 100%;"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectAll"
         :row-class-name="getRowClassName"
         table-layout="auto"
      >
        <el-table-column
          type="selection"
          width="55"
          fixed="left"
        />
        <template v-for="col in visibleColumns" :key="col.key">
          <el-table-column
            :prop="col.key"
            :label="col.title"
            :width="col.width"
            :fixed="col.fixed"
            :sortable="col.sortable ? 'custom' : false"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <slot :name="col.key" :row="row">
                <template v-if="col.key === 'tags' && row.tags?.length">
                  <el-tag
                    v-for="tag in row.tags"
                    :key="tag"
                    size="small"
                    class="tag-item"
                    effect="light"
                  >
                    {{ tag }}
                  </el-tag>
                </template>
                <template v-else-if="col.key === 'categories' && row.categories?.length">
                  <el-tag
                    v-for="category in row.categories"
                    :key="category"
                    size="small"
                    class="tag-item"
                    type="info"
                    effect="plain"
                  >
                    {{ category }}
                  </el-tag>
                </template>
                <template v-else-if="col.key === 'cost' || col.key === 'regularPrice' || col.key === 'salePrice'">
                  $ {{ row[col.key]?.toFixed(2) }}
                </template>
                <template v-else-if="col.key === 'type'">
                  <span class="type-display">
                    <el-icon><Box /></el-icon>
                    <span>{{ row.type }}</span>
                  </span>
                </template>
                <template v-else-if="col.key === 'status'">
                  <span class="status-display" :class="`status-${row.status?.toLowerCase()}`">
                    <el-icon v-if="row.status === 'Active'"><CircleCheck /></el-icon>
                    <el-icon v-else-if="row.status === 'Draft'"><Edit /></el-icon>
                    <el-icon v-else><CircleClose /></el-icon>
                    <span>{{ row.status?.replace('_', ' ') || row.status }}</span>
                  </span>
                </template>
                <template v-else-if="col.key === 'integration' && row.integration">
                  <el-tag
                    type="success"
                    effect="plain"
                    size="small"
                  >
                    {{ row.integration }}
                  </el-tag>
                </template>
                <template v-else-if="col.key === 'created' || col.key === 'updated'">
                  {{ formatDate(row[col.key]) }}
                </template>
                <template v-else-if="col.key === 'sku'">
                  <div class="sku-cell" :class="{ 'is-child': row.isChild }">
                    <!-- SPU行显示 -->
                    <div v-if="row.isSpu" class="spu-content">
                      <span
                        v-if="row.variantCount > 1"
                        @click="toggleVariants(row)"
                        class="expand-arrow"
                        :class="{ 'expanded': row.expanded }"
                      >
                        <el-icon><ArrowDown /></el-icon>
                      </span>
                      <span class="sku-text clickable" @click="handleView(row)">{{ row.spu }}</span>
                    </div>
                    <!-- SKU行显示 -->
                    <div v-else-if="row.isChild" class="sku-content">
                      <span class="sku-text clickable" @click="handleView(row)">{{ row.sku }}</span>
                      <span v-if="row.variant" class="variant-info">{{ row.variant }}</span>
                    </div>
                    <!-- 单规格产品显示 -->
                    <div v-else class="single-content">
                      <span class="sku-text clickable" @click="handleView(row)">{{ row.spu }}</span>
                    </div>
                  </div>
                </template>
                <template v-else-if="col.key === 'category'">
                  {{ row.category || '-' }}
                </template>
                <template v-else-if="col.key === 'sellingForm'">
                  <span class="selling-form-display">
                    <el-icon v-if="row.sellingForm === 'single'"><Goods /></el-icon>
                    <el-icon v-else-if="row.sellingForm === 'bundle'"><Collection /></el-icon>
                    <el-icon v-else><Grid /></el-icon>
                    <span>{{ getSellingFormLabel(row.sellingForm) }}</span>
                  </span>
                </template>
                <template v-else-if="col.key === 'sellingPrice'">
                  $ {{ row.sellingPrice?.toFixed(2) || '0.00' }}
                </template>
                <template v-else-if="col.key === 'dataSource'">
                  {{ getDataSourceLabel(row.dataSource) }}
                </template>
                <template v-else-if="col.key === 'publishedChannels'">
                  <div class="channels-cell">
                    <span v-if="row.publishedChannels && row.publishedChannels.length > 0" class="channels-display">
                      <el-icon><Link /></el-icon>
                      <span>{{ row.publishedChannels.join(', ') }}</span>
                    </span>
                    <span v-else class="no-channels">
                      <el-icon><Close /></el-icon>
                      <span>Not Published</span>
                    </span>
                  </div>
                </template>
                <template v-else-if="col.key === 'uom'">
                  {{ row.uom || 'EA' }}
                </template>
                <template v-else>
                  {{ row[col.key] }}
                </template>
              </slot>
            </template>
          </el-table-column>
        </template>

        <el-table-column fixed="right" label="Actions" width="120" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-tooltip content="Edit" placement="top">
                <el-button link type="warning" :icon="Edit" @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip content="Publish" placement="top" v-if="row.status === 'Draft'">
                <el-button link type="success" :icon="Upload" @click="handlePublish(row)" />
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="columnDialogVisible"
      title="Column Settings"
      width="500px"
      destroy-on-close
      align-center
    >
      <el-alert
        title="Drag columns to reorder them in the table"
        type="info"
        :closable="false"
        class="mb-4"
      />
      <el-table
        :data="allColumns"
        border
        stripe
        row-key="key"
        class="column-table"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="title" label="Column Name" />
        <el-table-column label="Display" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.visible" @change="handleColumnVisibilityChange" />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="columnDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSaveColumnSettings">
            Save
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量调价对话框 -->
    <el-dialog
      v-model="batchPriceDialogVisible"
      title="Batch Price Adjustment"
      width="500px"
      destroy-on-close
      align-center
    >
      <div class="batch-price-form">
        <el-form :model="batchPriceAdjustment" label-width="120px">
          <el-form-item label="Adjustment Type">
            <el-radio-group v-model="batchPriceAdjustment.type">
              <el-radio value="percentage">By Percentage</el-radio>
              <el-radio value="fixed">By Fixed Amount</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="Operation">
            <el-radio-group v-model="batchPriceAdjustment.operation">
              <el-radio value="increase">Increase</el-radio>
              <el-radio value="decrease">Decrease</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item :label="batchPriceAdjustment.type === 'percentage' ? 'Percentage' : 'Amount'">
            <el-input-number
              v-model="batchPriceAdjustment.value"
              :min="0"
              :max="batchPriceAdjustment.type === 'percentage' ? 100 : 9999"
              :precision="batchPriceAdjustment.type === 'percentage' ? 1 : 2"
              :step="batchPriceAdjustment.type === 'percentage' ? 1 : 0.01"
              style="width: 100%"
            >
              <template #append>
                {{ batchPriceAdjustment.type === 'percentage' ? '%' : '$' }}
              </template>
            </el-input-number>
          </el-form-item>
          
          <el-form-item>
            <el-alert
              :title="`Will adjust prices for ${selectedProducts.length} selected products`"
              type="info"
              :closable="false"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchPriceDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmBatchPriceAdjust">
            Confirm Adjustment
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量特价对话框 -->
    <el-dialog
      v-model="batchSpecialPriceDialogVisible"
      title="Batch Special Price Setting"
      width="500px"
      destroy-on-close
      align-center
    >
      <div class="batch-special-price-form">
        <el-form :model="batchSpecialPrice" label-width="120px">
          <el-form-item label="Special Price">
            <el-input-number
              v-model="batchSpecialPrice.price"
              :min="0"
              :precision="2"
              :step="0.01"
              placeholder="Enter special price"
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="batchSpecialPrice.startDate"
              type="datetime"
              placeholder="Select start date"
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item label="End Date">
            <el-date-picker
              v-model="batchSpecialPrice.endDate"
              type="datetime"
              placeholder="Select end date"
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item>
            <el-alert
              :title="`Will set special price for ${selectedProducts.length} selected products`"
              type="warning"
              :closable="false"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchSpecialPriceDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmBatchSpecialPrice">
            Set Special Price
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Search,
  Setting,
  Plus,
  Edit,
  Delete,
  Refresh,
  ArrowDown,
  Upload,
  Money,
  Box,
  CircleCheck,
  CircleClose,
  Goods,
  Collection,
  Grid,
  Link,
  Close,
  Download,
  PriceTag,
  Filter
} from '@element-plus/icons-vue';
import type { Product, ColumnConfig } from '@/types/product';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { getMockProducts, mockDeleteProduct, mockVendors, mockBrands, toggleSpuExpansion } from '@/mock/productData';

const router = useRouter();
const loading = ref(false);
const products = ref<Array<Product>>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const searchQuery = ref('');
const filterType = ref('');
const filterStatus = ref('');
const filterIntegration = ref('');
const filterSellingForm = ref('');
const filterDataSource = ref('');
const filterBrand = ref('');
const filterCategory = ref('');
const selectedProducts = ref<Array<Product>>([]);
const vendors = ref<Array<string>>(mockVendors);
const brands = ref<Array<string>>(mockBrands);

// 批量操作相关
const batchPriceDialogVisible = ref(false);
const batchPriceAdjustment = ref({
  type: 'percentage', // 'percentage' | 'fixed'
  value: 0,
  operation: 'increase' // 'increase' | 'decrease'
});

// 批量特价相关
const batchSpecialPriceDialogVisible = ref(false);
const batchSpecialPrice = ref({
  price: 0,
  startDate: null as Date | null,
  endDate: null as Date | null
});

// 批量操作权限检查
const canBatchDelete = computed(() => {
  return selectedProducts.value.every(product => product.status === 'Draft');
});

const canBatchPublish = computed(() => {
  return selectedProducts.value.every(product => product.status === 'Draft');
});

const columnDialogVisible = ref(false);

// Default column configuration - 基于新需求优化
const defaultColumns: ColumnConfig[] = [
  // SKU 结构 - 默认显示
  { key: 'sku', title: 'SKU', visible: true, width: 120, fixed: 'left', sortable: true },
  { key: 'name', title: 'Product Name', visible: true, width: 240, sortable: true },
  
  // 核心分类字段 - 默认显示
  { key: 'category', title: 'Category', visible: true, width: 150, sortable: true },
  { key: 'type', title: 'Type', visible: true, width: 100, filterable: true },
  
  // 售卖相关 - 默认显示
  { key: 'sellingForm', title: 'Selling Form', visible: true, width: 120, filterable: true },
  { key: 'sellingPrice', title: 'Selling Price', visible: true, width: 120, sortable: true },
  { key: 'status', title: 'Status', visible: true, width: 100, filterable: true },
  
  // 渠道和来源 - 默认显示
  { key: 'dataSource', title: 'Data Source', visible: true, width: 120, filterable: true },
  { key: 'publishedChannels', title: 'Published Channels', visible: true, width: 180 },
  
  // 时间字段 - 默认显示
  { key: 'created', title: 'Created', visible: true, width: 130, sortable: true },
  { key: 'updated', title: 'Updated', visible: true, width: 130, sortable: true },
  
  // 其他字段 - 可选显示
  { key: 'brand', title: 'Brand', visible: false, width: 120, sortable: true, filterable: true },
  { key: 'uom', title: 'UOM', visible: false, width: 80, sortable: true },
  
  // 库存字段 - 可选显示
  { key: 'quantity', title: 'Stock', visible: false, width: 90, sortable: true },
  
  // 供应商字段 - 可选显示
  { key: 'vendor', title: 'Vendor', visible: false, width: 160, sortable: true, filterable: true },
  
  // 价格字段 - 可选显示
  { key: 'cost', title: 'Cost', visible: false, width: 100, sortable: true },
  { key: 'regularPrice', title: 'Regular Price', visible: false, width: 120, sortable: true },
  { key: 'salePrice', title: 'Sale Price', visible: false, width: 120, sortable: true },
  
  // 标签 - 可选显示
  { key: 'tags', title: 'Tags', visible: false, width: 180 },
  
  // 集成平台 - 可选显示
  { key: 'integration', title: 'Platform', visible: false, width: 120, filterable: true },
  
  // 物理属性 - 隐藏，需要时可开启
  { key: 'weight', title: 'Weight', visible: false, width: 100, sortable: true },
  { key: 'weightUnit', title: 'Weight Unit', visible: false, width: 100 },
  { key: 'dimensions', title: 'Dimensions', visible: false, width: 150 },
  
  // 标识码 - 隐藏，需要时可开启
  { key: 'upc', title: 'UPC', visible: false, width: 120 },
  { key: 'ean', title: 'EAN', visible: false, width: 120 },
  { key: 'isbn', title: 'ISBN', visible: false, width: 120 },
  { key: 'mpn', title: 'MPN', visible: false, width: 120 },
  { key: 'partId', title: 'Part ID', visible: false, width: 120 },
  { key: 'externalProductId', title: 'External ID', visible: false, width: 120 },
  
  // 税务和海关 - 隐藏，需要时可开启
  { key: 'taxClass', title: 'Tax Class', visible: false, width: 120 },
  { key: 'hsCode', title: 'HS Code', visible: false, width: 120 },
  { key: 'countryOfOrigin', title: 'Origin', visible: false, width: 120 },
  
  // 发布时间 - 隐藏，需要时可开启
  { key: 'publishedAt', title: 'Published At', visible: false, width: 160, sortable: true },
];

const allColumns = ref(defaultColumns);
const visibleColumns = computed(() => allColumns.value.filter(col => col.visible));

// 检查是否有活跃的筛选器
const hasActiveFilters = computed(() => {
  return !!(
    searchQuery.value ||
    filterType.value ||
    filterStatus.value ||
    filterSellingForm.value ||
    filterDataSource.value ||
    filterIntegration.value ||
    filterBrand.value ||
    filterCategory.value
  );
});

// Load product list data
async function loadProducts() {
  loading.value = true;
  try {
    // 使用模拟数据
    const response = getMockProducts({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value,
      type: filterType.value,
      status: filterStatus.value,
      sellingForm: filterSellingForm.value,
      dataSource: filterDataSource.value,
      integration: filterIntegration.value,
    });
    products.value = response.data;
    total.value = response.total;
  } catch (error) {
    ElMessage.error('Failed to load product list');
  } finally {
    loading.value = false;
  }
}

// Search handling
const handleSearch = debounce(() => {
  currentPage.value = 1;
  loadProducts();
}, 300);

// Pagination handling
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  loadProducts();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  loadProducts();
};

// Sort handling
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  // Implement sorting logic
};

// Column settings
const handleColumnConfig = () => {
  columnDialogVisible.value = true;
};

const handleColumnVisibilityChange = () => {
  localStorage.setItem('productColumnConfig', JSON.stringify(allColumns.value));
};

const handleSaveColumnSettings = () => {
  handleColumnVisibilityChange();
  columnDialogVisible.value = false;
  ElMessage.success('Column settings saved successfully');
};

// Load saved column settings
const loadColumnConfig = () => {
  const savedConfig = localStorage.getItem('productColumnConfig');
  if (savedConfig) {
    allColumns.value = JSON.parse(savedConfig);
  }
};


// Helper functions
const getTypeTagType = (type: string) => {
  const types: Record<string, string> = {
    PHYSICAL: '',         // 默认色：实体商品
    VIRTUAL: 'info',      // 信息色：虚拟商品
    SERVICE: 'info',      // 信息色：服务类商品
    GIFT: 'success',      // 成功色：赠品
    SAMPLE: 'warning',    // 警告色：样品
    MATERIAL: 'warning'   // 警告色：原材料
  };
  return types[type] || '';
};

const getStatusTagType = (status: string) => {
  const types: Record<string, string> = {
    Draft: 'warning',     // 警告色：草稿状态
    Active: 'success',    // 成功色：激活状态
    Inactive: 'info',     // 信息色：未激活状态
    Disabled: 'danger'    // 危险色：禁用状态
  };
  return types[status] || '';
};

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

// 售卖方式标签类型
const getSellingFormTagType = (form: string) => {
  const types: Record<string, string> = {
    single: '',           // 默认色：单规格
    multi: 'success',     // 成功色：多规格
    bundle: 'warning'     // 警告色：组合商品
  };
  return types[form] || '';
};

// 售卖方式标签文本
const getSellingFormLabel = (form: string) => {
  const labels: Record<string, string> = {
    single: 'Single',
    multi: 'Multi',
    bundle: 'Bundle'
  };
  return labels[form] || form;
};

// 数据来源标签类型
const getDataSourceTagType = (source: string) => {
  const types: Record<string, string> = {
    oms: 'success',       // 成功色：OMS创建
    external: 'info',     // 信息色：外部导入
    api: 'warning'        // 警告色：API同步
  };
  return types[source] || '';
};

// 数据来源标签文本
const getDataSourceLabel = (source: string) => {
  const labels: Record<string, string> = {
    oms: 'OMS',
    external: 'External',
    api: 'API'
  };
  return labels[source] || source;
};

// 切换变体展开/收起
const toggleVariants = (row: any) => {
  // 调用模拟数据的切换函数
  toggleSpuExpansion(row.id);
  // 重新加载产品列表以更新显示
  loadProducts();
};

// 获取行类名
const getRowClassName = ({ row }: { row: any }) => {
  if (row.isChild) {
    return 'child-row';
  }
  if (row.isSpu) {
    return 'spu-row';
  }
  return 'single-row';
};

// 清除所有筛选器
const clearAllFilters = () => {
  searchQuery.value = '';
  filterType.value = '';
  filterStatus.value = '';
  filterSellingForm.value = '';
  filterDataSource.value = '';
  filterIntegration.value = '';
  filterBrand.value = '';
  filterCategory.value = '';
  loadProducts();
};

// Selection handling
const handleSelectionChange = (selection: Product[]) => {
  selectedProducts.value = selection;
};

const handleSelectAll = (selection: Product[]) => {
  selectedProducts.value = selection;
};

// 批量操作方法
const handleBatchDelete = async () => {
  if (selectedProducts.value.length === 0) return;
  
  const draftProducts = selectedProducts.value.filter(product => product.status === 'Draft');
  if (draftProducts.length === 0) {
    ElMessage.warning('Only draft products can be deleted');
    return;
  }
  
  if (draftProducts.length < selectedProducts.value.length) {
    ElMessage.warning('Only draft products can be deleted, other status products have been filtered');
  }
  
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the selected ${draftProducts.length} products? This action cannot be undone.`,
      'Batch Delete Confirmation',
      {
        confirmButtonText: 'Confirm Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );
    
    // 执行批量删除
    for (const product of draftProducts) {
      await mockDeleteProduct(product.id);
    }
    
    ElMessage.success(`Successfully deleted ${draftProducts.length} products`);
    selectedProducts.value = [];
    loadProducts();
  } catch (error) {
    console.log('User cancelled deletion');
  }
};

const handleBatchPublish = async () => {
  if (selectedProducts.value.length === 0) return;
  
  const draftProducts = selectedProducts.value.filter(product => product.status === 'Draft');
  if (draftProducts.length === 0) {
    ElMessage.warning('Only draft products can be published');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to publish the selected ${draftProducts.length} products?`,
      'Batch Publish Confirmation',
      {
        confirmButtonText: 'Confirm Publish',
        cancelButtonText: 'Cancel',
        type: 'info',
      }
    );
    
    // 模拟批量发布
    ElMessage.success(`Successfully published ${draftProducts.length} products`);
    selectedProducts.value = [];
    loadProducts();
  } catch (error) {
    console.log('User cancelled publishing');
  }
};

const handleBatchPriceAdjust = () => {
  if (selectedProducts.value.length === 0) return;
  batchPriceDialogVisible.value = true;
};

const confirmBatchPriceAdjust = () => {
  if (selectedProducts.value.length === 0) return;
  
  const { type, value, operation } = batchPriceAdjustment.value;
  
  if (value <= 0) {
    ElMessage.warning('Please enter a valid adjustment value');
    return;
  }
  
  // 模拟批量调价
  ElMessage.success(`Successfully adjusted prices for ${selectedProducts.value.length} products`);
  batchPriceDialogVisible.value = false;
  selectedProducts.value = [];
  
  // 重置调价参数
  batchPriceAdjustment.value = {
    type: 'percentage',
    value: 0,
    operation: 'increase'
  };
  
  loadProducts();
};

// 批量特价方法
const handleBatchSpecialPrice = () => {
  if (selectedProducts.value.length === 0) return;
  batchSpecialPriceDialogVisible.value = true;
};

const confirmBatchSpecialPrice = () => {
  if (selectedProducts.value.length === 0) return;
  
  const { price, startDate, endDate } = batchSpecialPrice.value;
  
  if (price <= 0) {
    ElMessage.warning('Please enter a valid special price');
    return;
  }
  
  if (!startDate || !endDate) {
    ElMessage.warning('Please select both start and end dates');
    return;
  }
  
  if (startDate >= endDate) {
    ElMessage.warning('End date must be after start date');
    return;
  }
  
  // 模拟批量设置特价
  ElMessage.success(`Successfully set special price for ${selectedProducts.value.length} products`);
  batchSpecialPriceDialogVisible.value = false;
  selectedProducts.value = [];
  
  // 重置特价参数
  batchSpecialPrice.value = {
    price: 0,
    startDate: null,
    endDate: null
  };
  
  loadProducts();
};

// 单个商品操作方法
const handleView = (row: Product) => {
  router.push(`/product/${row.id}`);
};

const handleEdit = (row: Product) => {
  router.push(`/product/${row.id}`);
};

const handleCreate = () => {
  router.push('/product/create');
};

const handlePublish = async (row: Product) => {
  if (row.status !== 'Draft') {
    ElMessage.warning('Only draft products can be published');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to publish product "${row.name}"?`,
      'Publish Confirmation',
      {
        confirmButtonText: 'Confirm Publish',
        cancelButtonText: 'Cancel',
        type: 'info',
      }
    );
    
    ElMessage.success('Product published successfully');
    loadProducts();
  } catch (error) {
    console.log('User cancelled publishing');
  }
};

const handleDelete = async (row: Product) => {
  if (row.status !== 'Draft') {
    ElMessage.warning('Only draft products can be deleted');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete product "${row.name}"? This action cannot be undone.`,
      'Delete Confirmation',
      {
        confirmButtonText: 'Confirm Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );
    
    await mockDeleteProduct(row.id);
    ElMessage.success('Product deleted successfully');
    loadProducts();
  } catch (error) {
    console.log('User cancelled deletion');
  }
};

onMounted(() => {
  loadColumnConfig();
  loadProducts();
});
</script>

<style scoped>
.product-list {
  padding: 0;
  height: 100vh;
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  position: relative;
}

/* Shein风格筛选面板 */
.filter-panel-shein {
  background: var(--el-bg-color);
  padding: 20px 24px;
  border-bottom: 1px solid var(--el-border-color-light);
  flex-shrink: 0;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 20px;
  margin-bottom: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.filter-date {
  .date-range {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .date-separator {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

/* 状态标签栏 */
.status-bar-shein {
  background: var(--el-bg-color);
  padding: 0 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  min-height: 56px;
}

.status-tabs {
  display: flex;
  gap: 4px;
  flex: 1;
}

.status-tab {
  padding: 16px 20px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
  
  &:hover {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }
  
  &.active {
    color: var(--el-color-primary);
    font-weight: 600;
    border-bottom-color: var(--el-color-primary);
    
    .status-count {
      color: var(--el-color-primary);
    }
  }
  
  .status-count {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.status-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.stats-group {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 20px;
  border-right: 1px solid var(--el-border-color-light);
}

.stat-item {
  font-size: 13px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  
  strong {
    font-weight: 600;
    margin-left: 4px;
  }
  
  .text-success {
    color: var(--el-color-success);
  }
  
  .text-warning {
    color: var(--el-color-warning);
  }
}


.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  width: calc(100% - 32px);
  margin: 0 16px 16px 16px;

  :deep(.el-card__body) {
    flex: 1;
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    width: 100%;
  }

  :deep(.el-table) {
    flex: 1;
    width: 100% !important;
    min-width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  :deep(.el-table__inner-wrapper) {
    width: 100% !important;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  :deep(.el-table__header-wrapper) {
    width: 100% !important;
    max-width: 100%;
    overflow: hidden;
  }

  :deep(.el-table__body-wrapper) {
    width: 100% !important;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: auto;
    max-height: calc(100vh - 320px);
  }

  :deep(.el-table__body),
  :deep(.el-table__header) {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100%;
  }

  :deep(.el-table colgroup) {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.el-table table) {
    width: 100% !important;
    max-width: 100%;
    table-layout: auto !important;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.count-tag {
  font-size: 13px;
}

.tag-item {
  margin-right: 4px;
  margin-bottom: 4px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}

.column-table {
  margin-top: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.batch-price-form {
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .el-radio-group {
    width: 100%;
  }
  
  .el-input-number {
    width: 100%;
  }
}

/* 列显示样式优化 */
.type-display,
.status-display,
.selling-form-display,
.channels-display,
.no-channels {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .el-icon {
    font-size: 14px;
  }
  
  span {
    font-size: 13px;
  }
}

.type-display {
  .el-icon {
    color: #409eff;
  }
}

.status-display {
  &.status-active {
    .el-icon {
      color: #67c23a;
    }
    span {
      color: #67c23a;
      font-weight: 500;
    }
  }
  
  &.status-draft {
    .el-icon {
      color: #e6a23c;
    }
    span {
      color: #e6a23c;
      font-weight: 500;
    }
  }
  
  &.status-inactive,
  &.status-disabled {
    .el-icon {
      color: #f56c6c;
    }
    span {
      color: #f56c6c;
      font-weight: 500;
    }
  }
}

.selling-form-display {
  .el-icon {
    color: #7c4dff;
  }
}

.channels-display {
  .el-icon {
    color: #67c23a;
  }
  span {
    color: #67c23a;
    font-weight: 500;
  }
}

.no-channels {
  .el-icon {
    color: #909399;
  }
  span {
    color: #909399;
  }
}

.channels-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}


/* SKU cell styling */
.sku-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  &.is-child {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .spu-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .sku-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 24px;
    
    .variant-info {
      font-size: 12px;
      color: #666;
      margin-left: 4px;
    }
  }
  
  .single-content {
    display: flex;
    align-items: center;
  }
  
  .sku-text {
    font-weight: 600;
    color: #7c4dff;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .sku-text.clickable {
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 2px 4px;
    border-radius: 4px;
  }

  .sku-text.clickable:hover {
    background-color: rgba(124, 77, 255, 0.1);
    color: #5a2dce;
    transform: translateY(-1px);
  }
  
  .expand-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.3s;
    margin-right: 6px;
    flex-shrink: 0;
    
    &:hover {
      background-color: rgba(64, 158, 255, 0.1);
    }
    
    .el-icon {
      font-size: 14px;
      color: #409eff;
      transition: transform 0.3s;
    }
    
    &.expanded .el-icon {
      transform: rotate(180deg);
    }
  }
}

/* Channels cell styling */
.channels-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  
  .channel-tag {
    margin: 0;
  }
  
  .no-channels {
    color: #999;
    font-size: 12px;
    font-style: italic;
  }
}



:deep(.el-card__body) {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

:deep(.el-table) {
  flex: 1;
  overflow: hidden;
  border-radius: 4px;
}

:deep(.el-table .el-table__inner-wrapper) {
  height: 100%;
}

:deep(.el-table .el-table__body-wrapper) {
  overflow-y: auto;
}

:deep(.el-table) {
  .el-table__fixed-right,
  .el-table__fixed {
    position: absolute !important;
    height: 100% !important;
    z-index: 3;
    background-color: var(--el-bg-color);
    overflow: hidden;
    
    &::before {
      display: none;
    }

    .el-table__fixed-header-wrapper,
    .el-table__fixed-body-wrapper {
      background-color: var(--el-bg-color);
    }

    .el-table__fixed-header-wrapper {
      z-index: 4;
    }
  }

  .el-table__fixed-right {
    right: 0;
    box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);
  }

  .el-table__fixed {
    left: 0;
    box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15);
  }

  .el-table__fixed-header-wrapper,
  .el-table__fixed-body-wrapper {
    width: 100% !important;
    overflow: hidden !important;
  }

  .el-table__fixed-body-wrapper {
    top: auto !important;
    height: auto !important;
    bottom: 0;
  }
}

:deep(.el-table__body) {
  .el-table__row {
    .el-table__cell.is-fixed-left,
    .el-table__cell.is-fixed-right {
      background-color: var(--el-bg-color) !important;
    }

    &.el-table__row--striped {
      .el-table__cell.is-fixed-left,
      .el-table__cell.is-fixed-right {
        background-color: var(--el-table-striped-bg-color) !important;
      }
    }

    &:hover {
      .el-table__cell.is-fixed-left,
      .el-table__cell.is-fixed-right {
        background-color: var(--el-table-row-hover-bg-color) !important;
      }
    }
  }
}

:deep(.el-table .el-table__row--striped .el-table__cell.is-fixed-left),
:deep(.el-table .el-table__row--striped .el-table__cell.is-fixed-right) {
  background-color: var(--el-table-striped-bg-color) !important;
}

:deep(.el-table .el-table__row:hover .el-table__cell.is-fixed-left),
:deep(.el-table .el-table__row:hover .el-table__cell.is-fixed-right) {
  background-color: var(--el-table-row-hover-bg-color) !important;
}

/* SPU/SKU行的特殊样式 */
:deep(.el-table) {
  .el-table__row {
    transition: all 0.2s ease;
    height: 48px !important;
    
    &:hover {
      background-color: rgba(124, 77, 255, 0.03) !important;
      transform: translateY(-0.5px);
      box-shadow: 0 1px 4px rgba(124, 77, 255, 0.08);
    }
    
    .el-table__cell {
      height: 48px !important;
      padding: 8px 12px !important;
      vertical-align: middle !important;
    }
  }
  
  .child-row {
    background-color: rgba(0, 0, 0, 0.02) !important;
    height: 48px !important;
    
    &:hover {
      background-color: rgba(124, 77, 255, 0.02) !important;
      transform: translateY(-0.5px);
      box-shadow: 0 1px 4px rgba(124, 77, 255, 0.06);
    }
    
    .el-table__cell {
      border-top: 1px dashed #e0e0e0 !important;
      font-size: 13px;
      height: 48px !important;
      padding: 8px 12px !important;
      vertical-align: middle !important;
    }
  }
  
  .spu-row {
    font-weight: 500;
    height: 48px !important;
    
    &:hover {
      background-color: rgba(124, 77, 255, 0.04) !important;
      transform: translateY(-0.5px);
      box-shadow: 0 1px 6px rgba(124, 77, 255, 0.1);
    }
    
    .el-table__cell {
      border-bottom: none !important;
      height: 48px !important;
      padding: 8px 12px !important;
      vertical-align: middle !important;
    }
  }
  
  .single-row {
    font-weight: normal;
    height: 48px !important;
    
    &:hover {
      background-color: rgba(124, 77, 255, 0.03) !important;
      transform: translateY(-0.5px);
      box-shadow: 0 1px 4px rgba(124, 77, 255, 0.08);
    }
    
    .el-table__cell {
      height: 48px !important;
      padding: 8px 12px !important;
      vertical-align: middle !important;
    }
  }
}


/* 额外的响应式设计 - 表格 */
@media (max-width: 768px) {
  :deep(.el-table) {
    font-size: 12px;
    
    .el-table__row {
      height: 48px !important;
      
      .el-table__cell {
        height: 48px !important;
        padding: 8px 4px !important;
        vertical-align: middle !important;
      }
    }
  }
  
  .pagination {
    padding: 0 12px 12px;
    
    :deep(.el-pagination) {
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .main-search {
    :deep(.el-input-group__append) {
      .el-button {
        padding: 0 12px;
      }
    }
  }
  
  :deep(.el-table) {
    font-size: 11px;
    
    .el-table__row {
      height: 48px !important;
      
      .el-table__cell {
        height: 48px !important;
        padding: 6px 2px !important;
        vertical-align: middle !important;
      }
    }
  }
  
  .sku-cell {
    .variant-info {
      font-size: 10px;
    }
  }
  
  .channels-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
}

:deep(.el-table .el-table__fixed-right) {
  box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.12);
}

:deep(.el-table .el-table__fixed) {
  box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.12);
}

:deep(.el-button-group) {
  display: inline-flex;
  gap: 8px;

  .el-button {
    margin-left: 0;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background-color: var(--el-color-primary-light-9);
      transform: translateY(-1px);
    }

    &.el-button--info:hover {
      color: var(--el-color-info);
    }

    &.el-button--warning:hover {
      color: var(--el-color-warning);
    }

    &.el-button--danger:hover {
      color: var(--el-color-danger);
    }
  }
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding: 12px 20px;
  flex-shrink: 0;
}

:deep(.el-table__cell) {
  .cell {
    white-space: nowrap;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .status-tabs {
    overflow-x: auto;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  .stats-group {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .filter-panel-shein {
    padding: 16px;
  }
  
  .filter-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .status-bar-shein {
    padding: 0 16px;
    flex-direction: column;
    align-items: stretch;
    min-height: auto;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  
  .status-tabs {
    order: 1;
    width: 100%;
    margin-bottom: 12px;
  }
  
  .status-right {
    order: 2;
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .stats-group {
    width: 100%;
    padding: 0;
    border: none;
    margin-bottom: 12px;
  }
  
  .table-card {
    margin: 0 12px 12px 12px;
    width: calc(100% - 24px);
  }
}

@media (max-width: 480px) {
  .filter-panel-shein {
    padding: 12px;
  }
  
  .filter-actions {
    .el-button {
      flex: 1;
    }
  }
  
  .status-tab {
    padding: 12px 16px;
    font-size: 13px;
  }
  
  .status-right {
    .el-button {
      flex: 1;
    }
  }
  
  .table-card {
    margin: 0 8px 8px 8px;
    width: calc(100% - 16px);
  }
}

/* 批量特价表单样式 */
.batch-special-price-form {
  padding: 16px 0;
}

.batch-special-price-form .el-form-item {
  margin-bottom: 20px;
}

.batch-special-price-form .el-input-number,
.batch-special-price-form .el-date-picker {
  width: 100% !important;
}
</style>