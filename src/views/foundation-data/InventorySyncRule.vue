<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Inventory Sync Rules</h1>
        <p class="subtitle">Configure inventory synchronization rules for different channel stores to control sync quantities and source warehouses</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="openForm()" class="add-button">
          <el-icon><Plus /></el-icon>
          <span>Add Rule</span>
          <el-tooltip content="Add a new inventory sync rule based on DI configuration" placement="top">
            <el-icon class="info-icon"><InfoFilled /></el-icon>
          </el-tooltip>
        </el-button>
      </div>
    </div>

    <!-- 通知说明 -->
    <el-alert
      title="By default, all channel stores will fully synchronize inventory based on DI configuration. Set custom rules here to override the default behavior."
      type="info"
      show-icon
      :closable="false"
      class="mb-4"
    />

    <!-- 规则列表 -->
    <el-card class="rule-list">
      <el-table 
        :data="rules" 
        style="width: 100%" 
        border 
        v-loading="loading"
        row-key="id"
        empty-text="No custom sync rules. All channel stores will fully synchronize inventory."
      >
        <el-table-column prop="channelType" label="Channel" width="120">
          <template #default="{ row }">
            <div class="channel-type">
              {{ getChannelTypeName(row.channelType) }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="storeName" label="Store Name" min-width="150">
          <template #default="{ row }">
            <div class="store-info">
              <span>{{ row.storeName }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column 
          prop="inventorySource" 
          label="Inventory Source" 
          min-width="180"
        >
          <template #default="{ row }">
            <div class="inventory-source">
              <div class="source-type" :class="row.inventorySource === 'all' ? 'all-source' : 'specific-source'">
                {{ row.inventorySource === 'all' ? 'All Warehouses' : 'Specific Warehouses' }}
              </div>
            
              <div class="warehouse-list-simple">
                <template v-if="row.inventorySource === 'all'">
                  <div class="warehouse-names">
                    {{ warehouses.map((w: Warehouse) => w.name).join(', ') }}
                  </div>
                </template>
                <template v-else>
                  <div class="warehouse-names">
                    {{ row.warehouseIds.map((id: string) => getWarehouseName(id)).join(', ') }}
                  </div>
                </template>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 添加商品同步规则列 -->
        <el-table-column 
          prop="productSyncMode" 
          label="Product Sync" 
          min-width="180"
        >
          <template #default="{ row }">
            <div class="product-sync">
              <div class="sync-type" :class="row.productSyncMode === 'all' ? 'all-products' : row.productSyncMode === 'include' ? 'include-products' : 'exclude-products'">
                {{ row.productSyncMode === 'all' ? 'All Products' : row.productSyncMode === 'include' ? 'Include Products' : 'Exclude Products' }}
              </div>
              
              <div v-if="row.productSyncMode !== 'all'" class="product-list-simple">
                <div class="product-count">
                  {{ row.productIds.length }} products {{ row.productSyncMode === 'include' ? 'included' : 'excluded' }}
                </div>
                <el-popover
                  placement="top"
                  :width="300"
                  trigger="hover"
                >
                  <template #reference>
                    <el-link type="primary" class="view-products">View Products</el-link>
                  </template>
                  <template #default>
                    <div class="products-popover">
                      <div class="popover-title">
                        {{ row.productSyncMode === 'include' ? 'Included Products' : 'Excluded Products' }}
                      </div>
                      <div class="product-items">
                        <div v-for="productId in row.productIds" :key="productId" class="product-item">
                          <el-image 
                            v-if="getProductImage(productId)"
                            :src="getProductImage(productId)"
                            class="product-item-image"
                          />
                          <div class="product-item-info">
                            <div class="product-item-name">{{ getProductName(productId) }}</div>
                            <div class="product-item-sku">SKU: {{ getProductSku(productId) }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="syncSetting" label="Sync Settings" min-width="180">
          <template #default="{ row }">
            <div class="sync-setting">
              <span class="sync-type">{{ row.syncType === 'percentage' ? 'Sync ' : 'Sync ' }}</span>
              <span class="sync-value" :class="row.syncType === 'percentage' ? 'percentage' : 'fixed'">{{ row.syncValue }}{{ row.syncType === 'percentage' ? '%' : ' units' }}</span>
              <span class="mode-value">{{ row.syncMode === 'proportion' ? ' of inventory' : row.syncType === 'percentage' ? ' after reducing inventory by this percentage' : ' after reducing inventory by this amount' }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="Status" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              @change="(val: boolean) => updateStatus(row, val)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="Actions" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="openForm(row)" title="Edit">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)" title="Delete">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 表单对话框 -->
    <inventory-sync-rule-form
      v-model:visible="formVisible"
      :rule="currentRule"
      :channel-stores="channelStores"
      :warehouses="warehouses"
      :existing-rules="rules"
      @save="saveRule"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, InfoFilled, House } from '@element-plus/icons-vue'
import InventorySyncRuleForm from './components/InventorySyncRuleForm.vue'

// 定义类型
type Warehouse = {
  id: string
  name: string
  code: string
}

interface ChannelStore {
  id: string
  channelType: string
  storeName: string
  storeIcon?: string
  diConfig?: {
    inventorySource: 'all' | 'specific'
    warehouseIds: string[]
  }
}

interface SyncRule {
  id: string
  channelType: string
  channelStoreId: string
  storeName: string
  storeIcon?: string
  inventorySource: 'all' | 'specific'
  warehouseIds: string[]
  syncMode: 'proportion' | 'deduction'
  syncType: 'percentage' | 'fixed'
  syncValue: number
  status?: boolean
  createdTime?: string
  updatedTime?: string
  productSyncMode: 'all' | 'include' | 'exclude'
  productIds: string[]
}

// 响应式状态
const loading = ref(false)
const rules = ref<SyncRule[]>([])
const formVisible = ref(false)
const currentRule = ref<SyncRule | null>(null)

// 渠道店铺数据
const channelStores = ref<ChannelStore[]>([])

// 仓库数据
const warehouses = ref<Warehouse[]>([
  { id: 'wh1', name: 'Main Warehouse', code: 'WH001' },
  { id: 'wh2', name: 'Shanghai Warehouse', code: 'WH002' },
  { id: 'wh3', name: 'Beijing Warehouse', code: 'WH003' },
  { id: 'wh4', name: 'Guangzhou Warehouse', code: 'WH004' },
  { id: 'wh5', name: 'Shenzhen Warehouse', code: 'WH005' },
])

// 添加控制仓库列显示的状态
const showWarehouseColumn = ref(true);

// 根据仓库ID获取仓库名称的方法
const getWarehouseName = (warehouseId: string): string => {
  const warehouse = warehouses.value.find(item => item.id === warehouseId)
  return warehouse ? warehouse.name : 'Unknown Warehouse'
}

// 根据仓库ID获取仓库编码的方法
const getWarehouseCode = (warehouseId: string): string => {
  const warehouse = warehouses.value.find(item => item.id === warehouseId)
  return warehouse ? warehouse.code : ''
}

// 获取渠道类型名称
const getChannelTypeName = (type: string): string => {
  const channelMap: Record<string, string> = {
    'amazon': 'Amazon',
    'shopify': 'Shopify',
    'lazada': 'Lazada',
    'shopee': 'Shopee',
    'walmart': 'Walmart',
    'ebay': 'eBay'
  }
  return channelMap[type] || type
}

// 格式化仓库显示
const formatWarehouse = (row: SyncRule): string => {
  if (row.inventorySource === 'all') {
    return 'All Warehouses'
  }
  return row.warehouseIds.map(id => getWarehouseName(id)).join(', ')
}

// 增加格式化同步设置的函数
const getFormattedSyncSetting = (row: SyncRule): string => {
  const valueWithUnit = `${row.syncValue}${row.syncType === 'percentage' ? '%' : ' units'}`;
  
  if (row.syncMode === 'proportion') {
    return row.syncType === 'percentage' 
      ? `Sync ${valueWithUnit} of inventory` 
      : `Sync ${valueWithUnit}`;
  } else {
    return row.syncType === 'percentage'
      ? `Sync after deducting ${valueWithUnit}`
      : `Sync after deducting ${valueWithUnit}`;
  }
}

// 打开编辑表单
const openForm = async (rule?: SyncRule) => {
  loading.value = true;
  try {
    if (rule) {
      // 如果是编辑，直接使用现有规则
      currentRule.value = { ...rule };
    } else {
      // 如果是新增，设置默认值
      currentRule.value = null;
    }
  } catch (error) {
    console.error('Error preparing form:', error);
    ElMessage.error('Unable to prepare form');
  } finally {
    loading.value = false;
    formVisible.value = true;
  }
};

// 保存规则
const saveRule = async (rule: SyncRule) => {
  try {
    // 直接保存规则，不再检查与DI配置的一致性
    saveRuleToList(rule);
  } catch (error) {
    console.error('Error saving rule:', error);
    ElMessage.error('Unable to save rule');
  }
}

// 辅助函数：保存规则到列表
const saveRuleToList = (rule: SyncRule) => {
  // 创建简单的时间戳字符串
  const timestamp = new Date().toISOString();
  
  if (rule.id) {
    // 更新现有规则
    const index = rules.value.findIndex(r => r.id === rule.id)
    if (index > -1) {
      const updatedRule = { ...rule };
      if (updatedRule.updatedTime !== undefined) {
        updatedRule.updatedTime = timestamp;
      }
      rules.value[index] = updatedRule;
      ElMessage.success('Rule updated successfully')
    }
  } else {
    // 添加新规则
    const newRule = { 
      ...rule,
      id: `rule-${Date.now()}`
    };
    
    // 仅当接口定义包含这些可选字段时才添加
    if ('createdTime' in newRule) {
      newRule.createdTime = timestamp;
    }
    if ('updatedTime' in newRule) {
      newRule.updatedTime = timestamp;
    }
    
    rules.value.push(newRule as SyncRule);
    ElMessage.success('Rule created successfully')
  }
  formVisible.value = false
}

const updateStatus = (rule: SyncRule, status: boolean): void => {
  rule.status = status
  if (!status) {
    ElMessage.success(`Rule disabled. Inventory will be fully synchronized based on DI warehouse settings.`)
  } else {
    ElMessage.success(`Rule enabled. Inventory will be synchronized according to rule settings.`)
  }
}

const handleDelete = (rule: SyncRule) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete the sync rule for ${rule.storeName}? After deletion, inventory will be fully synchronized based on DI warehouse settings.`,
    'Confirmation',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    rules.value = rules.value.filter(r => r.id !== rule.id)
    ElMessage.success('Rule deleted successfully. Inventory will be fully synchronized based on DI warehouse settings.')
  }).catch(() => {})
}

// 格式化日期时间
function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 添加商品相关的类型定义
interface Product {
  id: string
  name: string
  sku: string
  barcode?: string
  image?: string
}

// 添加商品数据缓存
const productsCache = ref<Map<string, Product>>(new Map())

// 添加获取商品信息的方法
function getProductName(productId: string): string {
  const product = productsCache.value.get(productId)
  return product ? product.name : `Product ${productId}`
}

function getProductSku(productId: string): string {
  const product = productsCache.value.get(productId)
  return product ? product.sku : productId
}

function getProductImage(productId: string): string | undefined {
  const product = productsCache.value.get(productId)
  return product?.image
}

// 修改加载数据的方法
onMounted(async () => {
  // 模拟加载渠道数据，包含DI配置
  channelStores.value = [
    { 
      id: '1', 
      channelType: 'shopify', 
      storeName: 'My Shopify Store',
      storeIcon: 'https://cdn.shopify.com/s/files/1/0249/3519/5648/files/shopify-square.png?width=20',
      diConfig: {
        inventorySource: 'all',
        warehouseIds: []
      }
    },
    { 
      id: '2', 
      channelType: 'lazada', 
      storeName: 'Lazada MY Store',
      storeIcon: 'https://laz-img-cdn.alicdn.com/images/ims-web/TB1BF1ZaMFY.1VjSZFnXXcFHXXa.png',
      diConfig: {
        inventorySource: 'specific',
        warehouseIds: ['wh1', 'wh3']
      }
    },
    { 
      id: '3', 
      channelType: 'shopee', 
      storeName: 'Shopee SG Store',
      storeIcon: 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5d12864c12916c05640b36e47ac5c9.png',
      diConfig: {
        inventorySource: 'specific',
        warehouseIds: ['wh2', 'wh4', 'wh5']
      }
    },
    { 
      id: '4', 
      channelType: 'amazon', 
      storeName: 'Amazon UK Store',
      storeIcon: 'https://m.media-amazon.com/images/G/01/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_us-main._CB468775337_.png',
      diConfig: {
        inventorySource: 'all',
        warehouseIds: []
      }
    },
    { 
      id: '5', 
      channelType: 'walmart', 
      storeName: 'Walmart US Store',
      storeIcon: 'https://i5.walmartimages.com/dfw/4ff9c6c9-ad46/k2-_0a671c38-d307-447c-b10e-c7ec93fdb715.v1.png',
      diConfig: {
        inventorySource: 'specific',
        warehouseIds: ['wh1', 'wh2']
      }
    },
    { 
      id: '6', 
      channelType: 'ebay', 
      storeName: 'eBay Global Store',
      storeIcon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png',
      diConfig: {
        inventorySource: 'all',
        warehouseIds: []
      }
    }
  ]
  
  // 模拟加载同步规则数据
  rules.value = [
    {
      id: '1',
      channelType: 'shopify',
      channelStoreId: '1',
      storeName: 'My Shopify Store',
      storeIcon: 'https://cdn.shopify.com/s/files/1/0249/3519/5648/files/shopify-square.png?width=20',
      inventorySource: 'all',
      warehouseIds: [],
      syncMode: 'proportion',
      syncType: 'percentage',
      syncValue: 80,
      status: true,
      createdTime: '2023-06-15 14:30:00',
      updatedTime: '2023-06-15 14:30:00',
      productSyncMode: 'include',
      productIds: ['1', '2', '3']
    },
    {
      id: '2',
      channelType: 'lazada',
      channelStoreId: '2',
      storeName: 'Lazada MY Store',
      storeIcon: 'https://laz-img-cdn.alicdn.com/images/ims-web/TB1BF1ZaMFY.1VjSZFnXXcFHXXa.png',
      inventorySource: 'specific',
      warehouseIds: ['wh1', 'wh3'],
      syncMode: 'deduction',
      syncType: 'fixed',
      syncValue: 60,
      status: true,
      createdTime: '2023-06-16 09:15:00',
      updatedTime: '2023-06-16 10:20:00',
      productSyncMode: 'exclude',
      productIds: ['4']
    },
    {
      id: '3',
      channelType: 'shopee',
      channelStoreId: '3',
      storeName: 'Shopee SG Store',
      storeIcon: 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5d12864c12916c05640b36e47ac5c9.png',
      inventorySource: 'specific',
      warehouseIds: ['wh2', 'wh4', 'wh5'],
      syncMode: 'proportion',
      syncType: 'fixed',
      syncValue: 100,
      status: false,
      createdTime: '2023-06-17 16:45:00',
      updatedTime: '2023-06-17 16:45:00',
      productSyncMode: 'all',
      productIds: ['5', '6', '7']
    },
    {
      id: '4',
      channelType: 'amazon',
      channelStoreId: '4',
      storeName: 'Amazon UK Store',
      storeIcon: 'https://m.media-amazon.com/images/G/01/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_us-main._CB468775337_.png',
      inventorySource: 'all',
      warehouseIds: [],
      syncMode: 'deduction',
      syncType: 'percentage',
      syncValue: 10,
      status: true,
      createdTime: '2023-06-18 10:30:00',
      updatedTime: '2023-06-18 10:30:00',
      productSyncMode: 'exclude',
      productIds: ['8']
    },
    {
      id: '5',
      channelType: 'walmart',
      channelStoreId: '5',
      storeName: 'Walmart US Store',
      storeIcon: 'https://i5.walmartimages.com/dfw/4ff9c6c9-ad46/k2-_0a671c38-d307-447c-b10e-c7ec93fdb715.v1.png',
      inventorySource: 'specific',
      warehouseIds: ['wh1', 'wh2'],
      syncMode: 'proportion',
      syncType: 'percentage',
      syncValue: 90,
      status: true,
      createdTime: '2023-07-01 08:15:00',
      updatedTime: '2023-07-02 09:30:00',
      productSyncMode: 'include',
      productIds: ['9', '10']
    },
    {
      id: '6',
      channelType: 'ebay',
      channelStoreId: '6',
      storeName: 'eBay Global Store',
      storeIcon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png',
      inventorySource: 'all',
      warehouseIds: [],
      syncMode: 'deduction',
      syncType: 'fixed',
      syncValue: 50,
      status: false,
      createdTime: '2023-07-05 14:20:00',
      updatedTime: '2023-07-05 14:20:00',
      productSyncMode: 'exclude',
      productIds: ['11']
    }
  ]

  // 模拟加载商品数据
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      sku: 'TEST001',
      barcode: '123456789',
      image: 'https://placeholder.com/100'
    },
    {
      id: '2',
      name: 'Test Product 2',
      sku: 'TEST002',
      barcode: '987654321',
      image: 'https://placeholder.com/100'
    },
    {
      id: '3',
      name: 'Test Product 3',
      sku: 'TEST003',
      barcode: '456789123',
      image: 'https://placeholder.com/100'
    },
    {
      id: '4',
      name: 'Test Product 4',
      sku: 'TEST004',
      barcode: '123456789',
      image: 'https://placeholder.com/100'
    },
    {
      id: '5',
      name: 'Test Product 5',
      sku: 'TEST005',
      barcode: '987654321',
      image: 'https://placeholder.com/100'
    },
    {
      id: '6',
      name: 'Test Product 6',
      sku: 'TEST006',
      barcode: '456789123',
      image: 'https://placeholder.com/100'
    },
    {
      id: '7',
      name: 'Test Product 7',
      sku: 'TEST007',
      barcode: '123456789',
      image: 'https://placeholder.com/100'
    },
    {
      id: '8',
      name: 'Test Product 8',
      sku: 'TEST008',
      barcode: '987654321',
      image: 'https://placeholder.com/100'
    },
    {
      id: '9',
      name: 'Test Product 9',
      sku: 'TEST009',
      barcode: '456789123',
      image: 'https://placeholder.com/100'
    },
    {
      id: '10',
      name: 'Test Product 10',
      sku: 'TEST010',
      barcode: '123456789',
      image: 'https://placeholder.com/100'
    },
    {
      id: '11',
      name: 'Test Product 11',
      sku: 'TEST011',
      barcode: '987654321',
      image: 'https://placeholder.com/100'
    }
  ]

  // 缓存商品数据
  mockProducts.forEach(product => {
    productsCache.value.set(product.id, product)
  })
})

// 添加获取DI配置的方法
const getDIConfig = async (storeId: string): Promise<{
  inventorySource: 'all' | 'specific';
  warehouseIds: string[];
}> => {
  try {
    // 模拟API调用，获取DI配置
    await new Promise(resolve => setTimeout(resolve, 800))
    const store = channelStores.value.find(s => s.id === storeId)
    if (!store || !store.diConfig) {
      return {
        inventorySource: 'all',
        warehouseIds: []
      }
    }
    return store.diConfig
  } catch (error) {
    console.error('Error fetching DI config:', error)
    ElMessage.error('Failed to load DI configuration')
    return {
      inventorySource: 'all', 
      warehouseIds: []
    }
  }
}

// 根据仓库ID获取仓库对象
const getWarehouseObj = (warehouseId: string) => {
  return warehouses.value.find(w => w.id === warehouseId) || null;
}

// 获取仓库名称预览 (显示前3个仓库名，如果有更多则显示+N)
const getWarehouseNamesPreview = (rule: SyncRule): string => {
  if (rule.inventorySource === 'all') {
    // 对于全部仓库，最多显示3个仓库名
    const names = warehouses.value.slice(0, 3).map(w => w.name);
    return names.join(', ') + (warehouses.value.length > 3 ? ` +${warehouses.value.length - 3} more` : '');
  } else if (rule.warehouseIds && rule.warehouseIds.length > 0) {
    // 对于指定仓库，最多显示3个仓库名
    const warehouseNames = rule.warehouseIds
      .map(id => {
        const warehouse = getWarehouseObj(id);
        return warehouse ? warehouse.name : null;
      })
      .filter(Boolean);
    
    return warehouseNames.slice(0, 3).join(', ') + 
      (rule.warehouseIds.length > 3 ? ` +${rule.warehouseIds.length - 3} more` : '');
  }
  
  return 'No warehouses';
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
}

.subtitle {
  color: #606266;
  margin: 8px 0 0;
}

.mb-4 {
  margin-bottom: 16px;
}

.rule-list {
  margin-bottom: 20px;
}

.channel-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-info {
  display: flex;
  align-items: center;
}

.store-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  object-fit: contain;
}

.inventory-source {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.source-type {
  font-weight: 600;
  font-size: 14px;
}

.all-source {
  color: #409eff;
}

.specific-source {
  color: #e6a23c;
}

.warehouse-list-simple {
  margin-top: 2px;
}

.warehouse-names {
  color: #606266;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-word;
}

.sync-setting {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sync-type {
  color: #606266;
  font-size: 14px;
}

.sync-value {
  font-weight: 700;
  font-size: 18px;
  padding: 2px 10px;
  border-radius: 4px;
}

.sync-value.percentage {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.sync-value.fixed {
  color: #e6a23c;
  background-color: rgba(230, 162, 60, 0.1);
}

.mode-value {
  color: #409EFF;
  font-size: 14px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.info-icon {
  margin-left: 5px;
  font-size: 14px;
  opacity: 0.8;
}

.channel-type {
  font-weight: 500;
  color: #606266;
  text-align: center;
}

.product-sync {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sync-type {
  font-weight: 600;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.all-products {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.include-products {
  color: #67c23a;
  background-color: rgba(103, 194, 58, 0.1);
}

.exclude-products {
  color: #e6a23c;
  background-color: rgba(230, 162, 60, 0.1);
}

.product-list-simple {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-count {
  font-size: 13px;
  color: #606266;
}

.view-products {
  font-size: 13px;
}

.products-popover {
  padding: 8px;
}

.popover-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.product-items {
  max-height: 300px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-item-image {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
}

.product-item-info {
  flex: 1;
}

.product-item-name {
  font-size: 13px;
  color: #303133;
  margin-bottom: 2px;
}

.product-item-sku {
  font-size: 12px;
  color: #909399;
}
</style> 