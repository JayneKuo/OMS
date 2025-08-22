import {
  SafetyStockLevel,
  SafetyStockStatus,
  AlertType,
  ChannelScopeType,
  StoreScopeType
} from '@/types/safetyStock'
import type {
  SafetyStockConfig,
  FlexibleSafetyStockConfig,
  StockAlert,
  SafetyStockStats,
  ChannelOption,
  StoreOption,
  WarehouseOption,
  SkuOption
} from '@/types/safetyStock'

// 模拟渠道数据
export const mockChannels: ChannelOption[] = [
  {
    id: 'CH001',
    name: 'Amazon US',
    type: 'marketplace',
    status: 'active'
  },
  {
    id: 'CH002',
    name: 'eBay US',
    type: 'marketplace',
    status: 'active'
  },
  {
    id: 'CH003',
    name: 'Shopify Store',
    type: 'ecommerce',
    status: 'active'
  },
  {
    id: 'CH004',
    name: 'Walmart',
    type: 'marketplace',
    status: 'active'
  },
  {
    id: 'CH005',
    name: 'Target Plus',
    type: 'marketplace',
    status: 'inactive'
  }
]

// 模拟店铺数据
export const mockStores: StoreOption[] = [
  {
    id: 'ST001',
    name: 'Main Amazon Store',
    channelId: 'CH001',
    channelName: 'Amazon US',
    status: 'active'
  },
  {
    id: 'ST002',
    name: 'Brand Store Amazon',
    channelId: 'CH001',
    channelName: 'Amazon US',
    status: 'active'
  },
  {
    id: 'ST003',
    name: 'eBay Official Store',
    channelId: 'CH002',
    channelName: 'eBay US',
    status: 'active'
  },
  {
    id: 'ST004',
    name: 'Direct Shopify',
    channelId: 'CH003',
    channelName: 'Shopify Store',
    status: 'active'
  },
  {
    id: 'ST005',
    name: 'Walmart Supplier',
    channelId: 'CH004',
    channelName: 'Walmart',
    status: 'active'
  }
]

// 模拟仓库数据
export const mockWarehouses: WarehouseOption[] = [
  {
    id: 'WH001',
    name: 'Los Angeles Warehouse',
    code: 'LAX-001',
    address: '1234 Industrial Blvd, Los Angeles, CA 90021',
    status: 'active'
  },
  {
    id: 'WH002',
    name: 'New York Warehouse',
    code: 'NYC-001',
    address: '5678 Commerce St, Brooklyn, NY 11232',
    status: 'active'
  },
  {
    id: 'WH003',
    name: 'Chicago Distribution Center',
    code: 'CHI-001',
    address: '9012 Logistics Ave, Chicago, IL 60634',
    status: 'active'
  },
  {
    id: 'WH004',
    name: 'Dallas Fulfillment Center',
    code: 'DAL-001',
    address: '3456 Shipping Rd, Dallas, TX 75237',
    status: 'active'
  }
]

// 模拟SKU数据
export const mockSkus: SkuOption[] = [
  {
    sku: 'SKU-001-BLK-M',
    productId: 'PROD001',
    productName: 'Classic T-Shirt Black Medium',
    category: 'Apparel',
    brand: 'BasicWear',
    status: 'active'
  },
  {
    sku: 'SKU-001-WHT-L',
    productId: 'PROD001',
    productName: 'Classic T-Shirt White Large',
    category: 'Apparel',
    brand: 'BasicWear',
    status: 'active'
  },
  {
    sku: 'SKU-002-RED-S',
    productId: 'PROD002',
    productName: 'Premium Hoodie Red Small',
    category: 'Apparel',
    brand: 'PremiumLine',
    status: 'active'
  },
  {
    sku: 'SKU-003-BLU-XL',
    productId: 'PROD003',
    productName: 'Sports Jacket Blue Extra Large',
    category: 'Sports',
    brand: 'ActiveWear',
    status: 'active'
  },
  {
    sku: 'SKU-004-GRN-M',
    productId: 'PROD004',
    productName: 'Casual Pants Green Medium',
    category: 'Apparel',
    brand: 'ComfortFit',
    status: 'active'
  }
]

// 模拟安全库存配置数据
export const mockSafetyStockConfigs: SafetyStockConfig[] = [
  // 全局默认配置
  {
    id: 'SSC-GLOBAL-001',
    level: SafetyStockLevel.GLOBAL,
    status: SafetyStockStatus.ACTIVE,
    minStockQuantity: 100,
    minStockType: 'quantity',
    alertType: [AlertType.LOW_STOCK, AlertType.OUT_OF_STOCK],
    alertThreshold: 20,
    maxStockQuantity: 1000,
    maxStockType: 'quantity',
    disableWmsSync: false,
    disableThirdPartySync: false,
    description: 'Global default safety stock configuration',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  
  // 渠道级别配置
  {
    id: 'SSC-CHANNEL-001',
    level: SafetyStockLevel.CHANNEL,
    status: SafetyStockStatus.ACTIVE,
    channelId: 'CH001',
    channelName: 'Amazon US',
    channelType: 'marketplace',
    minStockQuantity: 200,
    minStockType: 'quantity',
    alertType: [AlertType.LOW_STOCK],
    alertThreshold: 15,
    maxStockQuantity: 2000,
    maxStockType: 'quantity',
    disableWmsSync: false,
    disableThirdPartySync: true,
    priority: 1,
    description: 'Amazon US channel specific configuration',
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    createdBy: 'channel_manager',
    updatedBy: 'channel_manager'
  },
  {
    id: 'SSC-CHANNEL-002',
    level: SafetyStockLevel.CHANNEL,
    status: SafetyStockStatus.ACTIVE,
    channelId: 'CH002',
    channelName: 'eBay US',
    channelType: 'marketplace',
    minStockQuantity: 15,
    minStockType: 'percentage',
    alertType: [AlertType.LOW_STOCK, AlertType.OUT_OF_STOCK],
    alertThreshold: 25,
    maxStockQuantity: 80,
    maxStockType: 'percentage',
    disableWmsSync: true,
    disableThirdPartySync: false,
    priority: 2,
    description: 'eBay US channel configuration with percentage-based stock levels',
    createdAt: '2024-01-03T11:30:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    createdBy: 'channel_manager',
    updatedBy: 'inventory_manager'
  },

  // 店铺级别配置
  {
    id: 'SSC-STORE-001',
    level: SafetyStockLevel.STORE,
    status: SafetyStockStatus.ACTIVE,
    storeId: 'ST001',
    storeName: 'Main Amazon Store',
    channelId: 'CH001',
    channelName: 'Amazon US',
    warehouseId: 'WH001',
    warehouseName: 'Los Angeles Warehouse',
    minStockQuantity: 250,
    alertType: [AlertType.LOW_STOCK],
    alertThreshold: 10,
    maxStockQuantity: 2500,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 1,
    description: '主要Amazon店铺配置',
    createdAt: '2024-01-04T13:15:00Z',
    updatedAt: '2024-01-22T09:30:00Z',
    createdBy: 'store_manager',
    updatedBy: 'store_manager'
  },
  {
    id: 'SSC-STORE-002',
    level: SafetyStockLevel.STORE,
    status: SafetyStockStatus.INACTIVE,
    storeId: 'ST003',
    storeName: 'eBay Official Store',
    channelId: 'CH002',
    channelName: 'eBay US',
    warehouseId: 'WH002',
    warehouseName: 'New York Warehouse',
    minStockQuantity: 100,
    alertType: [AlertType.OUT_OF_STOCK],
    alertThreshold: 30,
    maxStockQuantity: 1200,
    disableWmsSync: true,
    disableThirdPartySync: true,
    priority: 3,
    description: 'eBay官方店铺配置（已停用）',
    createdAt: '2024-01-05T15:45:00Z',
    updatedAt: '2024-01-19T12:15:00Z',
    createdBy: 'store_manager',
    updatedBy: 'inventory_manager'
  },

  // SKU级别配置
  {
    id: 'SSC-SKU-001',
    level: SafetyStockLevel.SKU,
    status: SafetyStockStatus.ACTIVE,
    sku: 'SKU-001-BLK-M',
    productId: 'PROD001',
    productName: 'Classic T-Shirt Black Medium',
    storeId: 'ST001',
    storeName: 'Main Amazon Store',
    channelId: 'CH001',
    channelName: 'Amazon US',
    warehouseId: 'WH001',
    warehouseName: 'Los Angeles Warehouse',
    category: 'Apparel',
    brand: 'BasicWear',
    minStockQuantity: 500,
    alertType: [AlertType.LOW_STOCK],
    alertThreshold: 5,
    maxStockQuantity: 3000,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 1,
    description: '热销T恤特殊配置',
    createdAt: '2024-01-06T10:20:00Z',
    updatedAt: '2024-01-25T08:45:00Z',
    createdBy: 'product_manager',
    updatedBy: 'inventory_specialist'
  },
  {
    id: 'SSC-SKU-002',
    level: SafetyStockLevel.SKU,
    status: SafetyStockStatus.ACTIVE,
    sku: 'SKU-002-RED-S',
    productId: 'PROD002',
    productName: 'Premium Hoodie Red Small',
    storeId: 'ST002',
    storeName: 'Brand Store Amazon',
    channelId: 'CH001',
    channelName: 'Amazon US',
    warehouseId: 'WH001',
    warehouseName: 'Los Angeles Warehouse',
    category: 'Apparel',
    brand: 'PremiumLine',
    minStockQuantity: 50,
    alertType: [AlertType.LOW_STOCK, AlertType.OUT_OF_STOCK],
    alertThreshold: 20,
    maxStockQuantity: 500,
    disableWmsSync: true,
    disableThirdPartySync: false,
    priority: 2,
    description: '高端卫衣限量款配置',
    createdAt: '2024-01-07T14:30:00Z',
    updatedAt: '2024-01-23T11:20:00Z',
    createdBy: 'product_manager',
    updatedBy: 'product_manager'
  }
]

// 模拟灵活安全库存配置数据
export const mockFlexibleSafetyStockConfigs: FlexibleSafetyStockConfig[] = [
  {
    id: 'FSC-001',
    name: 'Amazon平台热销商品配置',
    status: SafetyStockStatus.ACTIVE,
    channelScope: ChannelScopeType.SPECIFIC,
    channelIds: ['CH001'],
    channelNames: ['Amazon US'],
    storeScope: StoreScopeType.ALL,
    specialSkus: ['SKU-001-BLK-M', 'SKU-001-WHT-L'],
    specialSkuConfigs: {
      'SKU-001-BLK-M': {
        minStockQuantity: 800,
        maxStockQuantity: 3000,
        alertType: [AlertType.LOW_STOCK],
        alertThreshold: 5,
        disableWmsSync: false,
        disableThirdPartySync: false
      },
      'SKU-001-WHT-L': {
        minStockQuantity: 600,
        maxStockQuantity: 2500,
        alertType: [AlertType.LOW_STOCK, AlertType.OUT_OF_STOCK],
        alertThreshold: 10,
        disableWmsSync: false,
        disableThirdPartySync: true
      }
    },
    minStockQuantity: 200,
    maxStockQuantity: 1500,
    alertType: [AlertType.LOW_STOCK],
    alertThreshold: 15,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 1,
    description: 'Amazon平台热销商品专用安全库存配置，包含特殊SKU设置',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    createdBy: 'admin',
    updatedBy: 'inventory_manager'
  },
  {
    id: 'FSC-002',
    name: '跨平台通用配置',
    status: SafetyStockStatus.ACTIVE,
    channelScope: ChannelScopeType.ALL,
    storeScope: StoreScopeType.ALL,
    specialSkus: ['SKU-003-BLU-XL'],
    specialSkuConfigs: {
      'SKU-003-BLU-XL': {
        minStockQuantity: 50,
        maxStockQuantity: 300,
        alertType: [AlertType.OUT_OF_STOCK],
        alertThreshold: 30,
        disableWmsSync: true,
        disableThirdPartySync: true
      }
    },
    minStockQuantity: 150,
    maxStockQuantity: 800,
    alertType: [AlertType.LOW_STOCK, AlertType.OUT_OF_STOCK],
    alertThreshold: 20,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 2,
    description: '适用于所有渠道的通用安全库存配置',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'FSC-003',
    name: 'eBay指定店铺配置',
    status: SafetyStockStatus.ACTIVE,
    channelScope: ChannelScopeType.SPECIFIC,
    channelIds: ['CH002'],
    channelNames: ['eBay US'],
    storeScope: StoreScopeType.SPECIFIC,
    storeIds: ['ST003'],
    storeNames: ['eBay Official Store'],
    specialSkus: [],
    specialSkuConfigs: {},
    minStockQuantity: 80,
    maxStockQuantity: 500,
    alertType: [AlertType.LOW_STOCK],
    alertThreshold: 25,
    disableWmsSync: true,
    disableThirdPartySync: false,
    priority: 3,
    description: 'eBay官方店铺专用配置，禁用WMS推送',
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2024-01-22T11:45:00Z',
    createdBy: 'store_manager',
    updatedBy: 'store_manager'
  }
]

// 模拟库存预警数据
export const mockStockAlerts: StockAlert[] = [
  {
    id: 'ALERT-001',
    configId: 'SSC-SKU-001',
    level: SafetyStockLevel.SKU,
    alertType: AlertType.LOW_STOCK,
    sku: 'SKU-001-BLK-M',
    productName: 'Classic T-Shirt Black Medium',
    currentStock: 480,
    safetyStock: 500,
    deficit: 20, // 当前库存480低于安全库存500，差值20
    storeId: 'ST001',
    storeName: 'Main Amazon Store',
    channelId: 'CH001',
    channelName: 'Amazon US',
    warehouseId: 'WH001',
    warehouseName: 'Los Angeles Warehouse',
    alertTime: '2024-01-25T15:30:00Z',
    status: 'new'
  },
  {
    id: 'ALERT-002',
    configId: 'SSC-STORE-001',
    level: SafetyStockLevel.STORE,
    alertType: AlertType.OUT_OF_STOCK,
    sku: 'SKU-003-BLU-XL',
    productName: 'Sports Jacket Blue Extra Large',
    currentStock: 0,
    safetyStock: 250,
    deficit: 250, // 缺货，距离安全库存还差250
    storeId: 'ST001',
    storeName: 'Main Amazon Store',
    channelId: 'CH001',
    channelName: 'Amazon US',
    warehouseId: 'WH001',
    warehouseName: 'Los Angeles Warehouse',
    alertTime: '2024-01-24T09:15:00Z',
    status: 'acknowledged',
    resolvedTime: '2024-01-24T10:30:00Z',
    resolvedBy: 'inventory_manager',
    notes: '已联系供应商紧急补货'
  },
  {
    id: 'ALERT-003',
    configId: 'SSC-CHANNEL-001',
    level: SafetyStockLevel.CHANNEL,
    alertType: AlertType.LOW_STOCK,
    sku: 'SKU-004-GRN-M',
    productName: 'Casual Pants Green Medium',
    currentStock: 180,
    safetyStock: 200,
    deficit: 20, // 当前库存180低于安全库存200，差值20
    storeId: 'ST002',
    storeName: 'Brand Store Amazon',
    channelId: 'CH001',
    channelName: 'Amazon US',
    warehouseId: 'WH002',
    warehouseName: 'New York Warehouse',
    alertTime: '2024-01-23T12:45:00Z',
    status: 'resolved',
    resolvedTime: '2024-01-24T16:20:00Z',
    resolvedBy: 'channel_manager',
    notes: '补货已到位，库存恢复正常'
  }
]

// 模拟统计数据
export const mockSafetyStockStats: SafetyStockStats = {
  totalConfigs: 8,
  activeConfigs: 6,
  inactiveConfigs: 2,
  configsByLevel: {
    [SafetyStockLevel.GLOBAL]: 1,
    [SafetyStockLevel.CHANNEL]: 2,
    [SafetyStockLevel.STORE]: 2,
    [SafetyStockLevel.SKU]: 3
  },
  alertsCount: {
    total: 15,
    new: 3,
    acknowledged: 5,
    resolved: 7
  },
  lowStockItems: 8,
  outOfStockItems: 2
}

// 模拟预设配置数据
export const mockPresets = [
  {
    id: 'PRESET-001',
    name: '快销品配置',
    description: '适用于快速销售的热门产品',
    config: {
      minStockQuantity: 500,
      alertType: [AlertType.LOW_STOCK],
      alertThreshold: 10,
      maxStockQuantity: 2000,
      disableWmsSync: false,
      disableThirdPartySync: false
    },
    isDefault: false,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'PRESET-002',
    name: '季节性商品配置',
    description: '适用于季节性或节日性商品',
    config: {
      minStockQuantity: 100,
      alertType: [AlertType.LOW_STOCK, AlertType.OUT_OF_STOCK],
      alertThreshold: 25,
      maxStockQuantity: 800,
      disableWmsSync: false,
      disableThirdPartySync: true
    },
    isDefault: false,
    createdAt: '2024-01-12T10:30:00Z'
  },
  {
    id: 'PRESET-003',
    name: '高价值产品配置',
    description: '适用于高价值、低周转的产品',
    config: {
      minStockQuantity: 20,
      alertType: [AlertType.LOW_STOCK],
      alertThreshold: 30,
      maxStockQuantity: 200,
      disableWmsSync: true,
      disableThirdPartySync: true
    },
    isDefault: true,
    createdAt: '2024-01-08T14:15:00Z'
  }
]
