<template>
  <div class="product-list">
    <el-card class="filter-card" shadow="never">
      <div class="filter-header">
        <div class="left">
          <el-input
            v-model="searchQuery"
            placeholder="Search by name, SKU or vendor..."
            class="search-input"
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
            @clear="handleSearch"
          />
          <el-select
            v-model="filterType"
            placeholder="Product Type"
            clearable
            class="filter-select"
            @change="handleSearch"
          >
            <el-option label="Sample" value="Sample" />
            <el-option label="Normal" value="Normal" />
            <el-option label="Bundle" value="Bundle" />
            <el-option label="Service" value="Service" />
            <el-option label="Virtual" value="Virtual" />
          </el-select>
          <el-select
            v-model="filterStatus"
            placeholder="Status"
            clearable
            class="filter-select"
            @change="handleSearch"
          >
            <el-option label="Active" value="Active" />
            <el-option label="Inactive" value="Inactive" />
            <el-option label="Draft" value="Draft" />
            <el-option label="Archived" value="Archived" />
            <el-option label="Out of Stock" value="Out_Of_Stock" />
            <el-option label="Discontinued" value="Discontinued" />
          </el-select>
          <el-select
            v-model="filterIntegration"
            placeholder="Integration"
            clearable
            class="filter-select"
            @change="handleSearch"
          >
            <el-option label="Shopify" value="Shopify" />
            <el-option label="Amazon" value="Amazon" />
            <el-option label="eBay" value="eBay" />
            <el-option label="Walmart" value="Walmart" />
            <el-option label="WooCommerce" value="WooCommerce" />
            <el-option label="Magento" value="Magento" />
          </el-select>
          <el-select
            v-model="filterVendor"
            placeholder="Vendor"
            clearable
            filterable
            class="filter-select"
            @change="handleSearch"
          >
            <el-option
              v-for="vendor in vendors"
              :key="vendor"
              :label="vendor"
              :value="vendor"
            />
          </el-select>
          <el-select
            v-model="filterBrand"
            placeholder="Brand"
            clearable
            filterable
            class="filter-select"
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
        <div class="right">
          <el-button-group>
            <el-tooltip content="Refresh" placement="top">
              <el-button :icon="Refresh" @click="loadProducts" />
            </el-tooltip>
            <el-tooltip content="Column Settings" placement="top">
              <el-button :icon="Setting" @click="handleColumnConfig" />
            </el-tooltip>
          </el-button-group>
          <el-button type="primary" :icon="Plus" @click="handleCreate">
            Create Product
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">Product List</span>
          <el-tag type="info" class="count-tag">
            Total: {{ total }}
          </el-tag>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="products"
        border
        stripe
        style="width: 100%"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectAll"
        height="400"
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
                  <el-tag
                    :type="getTypeTagType(row.type)"
                    effect="plain"
                    size="small"
                  >
                    {{ row.type }}
                  </el-tag>
                </template>
                <template v-else-if="col.key === 'status'">
                  <el-tag
                    :type="getStatusTagType(row.status)"
                    effect="plain"
                    size="small"
                  >
                    {{ row.status?.replace('_', ' ') || row.status }}
                  </el-tag>
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
                  <el-tag
                    :type="row.status === 'Out_Of_Stock' ? 'danger' : row.status === 'Active' ? 'success' : 'info'"
                    effect="dark"
                  >
                    {{ row.sku }}
                  </el-tag>
                </template>
                <template v-else>
                  {{ row[col.key] }}
                </template>
              </slot>
            </template>
          </el-table-column>
        </template>

        <el-table-column fixed="right" label="Actions" width="150" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-tooltip content="View Details" placement="top">
                <el-button link type="info" :icon="View" @click="handleView(row)" />
              </el-tooltip>
              <el-tooltip content="Edit" placement="top">
                <el-button link type="warning" :icon="Edit" @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip content="Delete" placement="top">
                <el-button link type="danger" :icon="Delete" @click="handleDelete(row)" />
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
  View
} from '@element-plus/icons-vue';
import type { Product, ColumnConfig } from '@/types/product';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { getMockProducts, mockDeleteProduct, mockVendors, mockBrands } from '@/mock/productData';

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
const filterVendor = ref('');
const filterBrand = ref('');
const selectedProducts = ref<Array<Product>>([]);
const vendors = ref<Array<string>>(mockVendors);
const brands = ref<Array<string>>(mockBrands);

const columnDialogVisible = ref(false);

// Default column configuration
const defaultColumns: ColumnConfig[] = [
  { key: 'sku', title: 'SKU', visible: true, width: 150, fixed: 'left', sortable: true },
  { key: 'name', title: 'Product Name', visible: true, width: 250, sortable: true },
  { key: 'type', title: 'Product Type', visible: true, width: 130, filterable: true },
  { key: 'status', title: 'Status', visible: true, width: 130, filterable: true },
  { key: 'vendor', title: 'Vendor', visible: true, width: 180, sortable: true, filterable: true },
  { key: 'brand', title: 'Brand', visible: true, width: 180, sortable: true, filterable: true },
  { key: 'cost', title: 'Cost', visible: true, width: 120, sortable: true },
  { key: 'regularPrice', title: 'Regular Price', visible: true, width: 150, sortable: true },
  { key: 'salePrice', title: 'Sale Price', visible: true, width: 150, sortable: true },
  { key: 'quantity', title: 'Quantity', visible: true, width: 120, sortable: true },
  { key: 'doNotTrackInventory', title: 'No Inventory Track', visible: true, width: 150 },
  { key: 'categories', title: 'Categories', visible: true, width: 200 },
  { key: 'tags', title: 'Tags', visible: true, width: 200 },
  { key: 'integration', title: 'Integration', visible: true, width: 120, filterable: true },
  { key: 'weight', title: 'Weight', visible: false, width: 100, sortable: true },
  { key: 'weightUnit', title: 'Weight Unit', visible: false, width: 100 },
  { key: 'dimensions', title: 'Dimensions', visible: false, width: 150 },
  { key: 'upc', title: 'UPC', visible: false, width: 120 },
  { key: 'ean', title: 'EAN', visible: false, width: 120 },
  { key: 'isbn', title: 'ISBN', visible: false, width: 120 },
  { key: 'mpn', title: 'MPN', visible: false, width: 120 },
  { key: 'partId', title: 'Part ID', visible: false, width: 120 },
  { key: 'externalProductId', title: 'External ID', visible: false, width: 120 },
  { key: 'taxClass', title: 'Tax Class', visible: false, width: 120 },
  { key: 'hsCode', title: 'HS Code', visible: false, width: 120 },
  { key: 'countryOfOrigin', title: 'Origin', visible: false, width: 120 },
  { key: 'created', title: 'Created At', visible: true, width: 180, sortable: true },
  { key: 'updated', title: 'Updated At', visible: true, width: 180, sortable: true },
  { key: 'publishedAt', title: 'Published At', visible: false, width: 180, sortable: true },
];

const allColumns = ref(defaultColumns);
const visibleColumns = computed(() => allColumns.value.filter(col => col.visible));

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

// Product operations
const handleCreate = () => {
  router.push({ name: 'SelectCategory' });
};

const handleView = (row: Product) => {
  router.push(`/product/${row.id}/basic`);
};

const handleEdit = (row: Product) => {
  router.push(`/product/${row.id}/basic`);
};

const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm(
      'This action will permanently delete the product. Continue?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );
    await mockDeleteProduct(row.id);
    ElMessage.success('Product deleted successfully');
    loadProducts();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete product');
    }
  }
};

// Helper functions
const getTypeTagType = (type: string) => {
  const types: Record<string, string> = {
    Sample: 'warning',    // 警告色：提醒是样品
    Normal: '',          // 默认色：常规商品
    Bundle: 'success',   // 成功色：组合商品
    Service: 'info',     // 信息色：服务类商品
    Virtual: 'info'      // 信息色：虚拟商品
  };
  return types[type] || '';
};

const getStatusTagType = (status: string) => {
  const types: Record<string, string> = {
    Active: 'success',
    Inactive: 'info',
    Draft: 'warning',
    Archived: '',
    Out_Of_Stock: 'danger',
    Discontinued: 'danger'
  };
  return types[status] || '';
};

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

// Selection handling
const handleSelectionChange = (selection: Product[]) => {
  selectedProducts.value = selection;
};

const handleSelectAll = (selection: Product[]) => {
  selectedProducts.value = selection;
};

onMounted(() => {
  loadColumnConfig();
  loadProducts();
});
</script>

<style scoped>
.product-list {
  padding: 20px;
  height: 100%;
  min-height: 100%;
  background-color: var(--el-bg-color-page);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filter-card {
  margin-bottom: 16px;
  flex-shrink: 0;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.left {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.right {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}

.search-input {
  width: 300px;
  max-width: 100%;
}

.filter-select {
  width: 160px;
  max-width: 100%;
}

.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.el-card__body) {
    flex: 1;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-table) {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :deep(.el-table__inner-wrapper) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-table__body-wrapper) {
    flex: 1;
    overflow-y: auto;
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
</style>