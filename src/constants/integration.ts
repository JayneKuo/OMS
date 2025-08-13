import type { Integration } from '@/types/integration'

// 集成类型枚举
export enum IntegrationType {
  MARKETPLACE = 'Marketplace',
  SOCIAL = 'Social Commerce',
  ECOMMERCE = 'E-commerce Platform',
  ACCOUNTING = 'Accounting',
  LOGISTICS = '3PL & Logistics'
}

// 集成子类型
export enum IntegrationSubType {
  // Marketplaces
  AMAZON = 'Amazon',
  WALMART = 'Walmart',
  EBAY = 'eBay',
  
  // Social Commerce
  TIKTOK = 'TikTok Shop',
  
  // E-commerce Platforms
  SHOPIFY = 'Shopify',
  WOOCOMMERCE = 'WooCommerce',
  
  // Accounting
  QUICKBOOKS = 'QuickBooks',
  
  // 3PL & Logistics
  UNIS_WMS = 'UNIS WMS',
  UPS = 'UPS Capital',
  ITEM_WMS = 'Item WMS'
}

// 授权配置类型
export interface AuthConfig {
  fields: Array<{
    key: string
    label: string
    type: 'text' | 'password' | 'select' | 'textarea'
    required: boolean
    options?: Array<{ label: string; value: string }>
    placeholder?: string
  }>
  instructions?: string
}

// 各平台授权配置
export const AUTH_CONFIGS: Record<string, AuthConfig> = {
  [IntegrationSubType.AMAZON]: {
    fields: [
      {
        key: 'seller_id',
        label: 'Seller ID',
        type: 'text',
        required: true,
        placeholder: 'Your Amazon Seller ID'
      },
      {
        key: 'marketplace_id',
        label: 'Marketplace',
        type: 'select',
        required: true,
        options: [
          { label: 'United States', value: 'ATVPDKIKX0DER' },
          { label: 'Canada', value: 'A2EUQ1WTGCTBG2' },
          { label: 'Mexico', value: 'A1AM78C64UM0Y8' }
        ]
      },
      {
        key: 'aws_access_key',
        label: 'AWS Access Key',
        type: 'text',
        required: true
      },
      {
        key: 'aws_secret_key',
        label: 'AWS Secret Key',
        type: 'password',
        required: true
      }
    ],
    instructions: 'Go to Seller Central > Settings > Developer Settings to get your credentials'
  },
  [IntegrationSubType.WALMART]: {
    fields: [
      {
        key: 'client_id',
        label: 'Client ID',
        type: 'text',
        required: true
      },
      {
        key: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        required: true
      },
      {
        key: 'channel_type',
        label: 'Channel Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Marketplace', value: 'marketplace' },
          { label: 'Drop Ship Vendor', value: 'dsv' }
        ]
      }
    ],
    instructions: 'Get your API credentials from Walmart Seller Center > Settings > API'
  },
  [IntegrationSubType.SHOPIFY]: {
    fields: [
      {
        key: 'shop_domain',
        label: 'Shop Domain',
        type: 'text',
        required: true,
        placeholder: 'your-store.myshopify.com'
      },
      {
        key: 'access_token',
        label: 'Access Token',
        type: 'password',
        required: true,
        placeholder: 'shpat_xxxxxx'
      }
    ],
    instructions: 'Generate an access token from Shopify Admin > Apps > Develop Apps'
  },
  [IntegrationSubType.TIKTOK]: {
    fields: [
      {
        key: 'app_key',
        label: 'App Key',
        type: 'text',
        required: true
      },
      {
        key: 'app_secret',
        label: 'App Secret',
        type: 'password',
        required: true
      },
      {
        key: 'shop_region',
        label: 'Shop Region',
        type: 'select',
        required: true,
        options: [
          { label: 'United States', value: 'US' },
          { label: 'United Kingdom', value: 'UK' },
          { label: 'Southeast Asia', value: 'SEA' }
        ]
      }
    ],
    instructions: 'Get your API credentials from TikTok Shop Seller Center > Settings > API Management'
  },
  [IntegrationSubType.WOOCOMMERCE]: {
    fields: [
      {
        key: 'store_url',
        label: 'Store URL',
        type: 'text',
        required: true,
        placeholder: 'https://your-store.com'
      },
      {
        key: 'consumer_key',
        label: 'Consumer Key',
        type: 'text',
        required: true
      },
      {
        key: 'consumer_secret',
        label: 'Consumer Secret',
        type: 'password',
        required: true
      }
    ],
    instructions: 'Generate REST API keys from WooCommerce > Settings > Advanced > REST API'
  },
  [IntegrationSubType.QUICKBOOKS]: {
    fields: [
      {
        key: 'client_id',
        label: 'Client ID',
        type: 'text',
        required: true
      },
      {
        key: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        required: true
      },
      {
        key: 'environment',
        label: 'Environment',
        type: 'select',
        required: true,
        options: [
          { label: 'Production', value: 'production' },
          { label: 'Sandbox', value: 'sandbox' }
        ]
      }
    ],
    instructions: 'Get your API credentials from QuickBooks Developer Portal'
  },
  [IntegrationSubType.UNIS_WMS]: {
    fields: [
      {
        key: 'environment',
        label: 'Environment',
        type: 'select',
        required: true,
        options: [
          { label: 'Test Environment', value: 'test' },
          { label: 'Production Environment', value: 'production' }
        ]
      },
      {
        key: 'api_url',
        label: 'API URL',
        type: 'text',
        required: true,
        placeholder: 'Enter API URL'
      },
      {
        key: 'client_id',
        label: 'Client ID',
        type: 'text',
        required: true,
        placeholder: 'Enter Client ID'
      },
      {
        key: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        placeholder: 'Enter Client Secret'
      }
    ],
    instructions: 'Please select an environment and fill in the corresponding authentication information. The API URL will be automatically populated based on your environment selection.'
  },
  [IntegrationSubType.UPS]: {
    fields: [
      {
        key: 'client_id',
        label: 'Client ID',
        type: 'text',
        required: true
      },
      {
        key: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        required: true
      },
      {
        key: 'account_number',
        label: 'UPS Account Number',
        type: 'text',
        required: true
      },
      {
        key: 'environment',
        label: 'Environment',
        type: 'select',
        required: true,
        options: [
          { label: 'Production', value: 'production' },
          { label: 'Test', value: 'test' }
        ]
      }
    ],
    instructions: 'Get your API credentials from UPS Developer Portal'
  },
  [IntegrationSubType.ITEM_WMS]: {
    fields: [
      {
        key: 'environment',
        label: 'Environment',
        type: 'select',
        required: true,
        options: [
          { label: 'Test Environment', value: 'test' },
          { label: 'Production Environment', value: 'production' }
        ]
      },
      {
        key: 'api_url',
        label: 'API URL',
        type: 'text',
        required: true,
        placeholder: 'Enter API URL'
      },
      {
        key: 'access_key',
        label: 'Access Key',
        type: 'text',
        required: true,
        placeholder: 'Enter Access Key'
      },
      {
        key: 'secret_key',
        label: 'Secret Key',
        type: 'password',
        required: true,
        placeholder: 'Enter Secret Key'
      }
    ],
    instructions: 'Please select an environment and fill in the corresponding authentication information. The API URL will be automatically populated based on your environment selection.'
  }
}

// 图标URL常量
export const INTEGRATION_LOGOS = {
  AMAZON: 'https://assets.pipe17.com/tiles/tile_amazon_seller_central.svg',
  WALMART: 'https://assets.pipe17.com/tiles/tile_walmart_marketplace.svg',
  TIKTOK: 'https://assets.pipe17.com/tiles/tile_tiktok.svg',
  SHOPIFY: 'https://assets.pipe17.com/tiles/tile_shopify.svg',
  WOOCOMMERCE: 'https://assets.pipe17.com/tiles/tile_woocommerce.svg',
  UNIS: 'https://assets.pipe17.com/tiles/tile_unis.svg',
  UPS: 'https://assets.pipe17.com/tiles/tile_upscapital.svg',
  EBAY: 'https://assets.pipe17.com/tiles/tile_ebay.svg',
  SQUARE: 'https://assets.pipe17.com/tiles/tile_square.svg',
  ITEM_WMS: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAhCAYAAAAlK6DZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASlSURBVHgBvVdPaBxVGP/em5lNag6ugZDcMlFT6G09FQ+luyDUgGKLCApCpp4UD3FRL1529iA9iCZBSzw1GxApeNhUqhFBdoNIQZAk1xTNJKEGcrCRBtfszLzP37d/EohNM0PafvB2Z9+87/3e93u/971vFaW0/C+cI0XjBs9a0Y3686pOKU0lHXhxibO796hkNE0QsxJHfLIyNOfEVP6hoIKkcyUCvbDIE/gqYXS21QEgVhTA2QO0K10WKT9jaHq+oHaOm++BoBdrnI8BxkTnJS5Sqm6Yit8X1LK8f7HGrkXGx4vx9mRKFuJ/W1BzqUEB5mojYOy1R6kAkJcRRf2o8WS4hslcluGslnssunT9CMrVIedsJqIJgL2Hn1m83WHm6cjWU0loe+0nLDKWbcAiWOCpYjm6fBh8H/TNBc4bxbPoGW51aLphIlW8PpZcIGKvL4ByGws3WLgixv6vE5vy12N2ZR/Uq3KWe7mKiPIiSQhz2ai4+NWYU6cTmAdwg/3G43grMobwlC5UEITtZGjSGM6jcweElK+9pKfoIVilzZD31ndRHQIT5Q+rGEwSFdTbN81fJPtnqae/TEllUhM2ex3+AzQ+RbYe0bbhrBOzelSAYpVLascxtIJG9r+RawsgPQazYyPnGPqERpHCSFaQ1tbW1rJpxmcgGLDaetYOpwPd3NzMr6+vr1mWdXdjY2N2a2vLTeLXDa43AqgtPCcE3d7ensTRqiml3E6XF4ZhLUnUwGCAsi2gDkJOGunAwECuv7+fEGXrNxtDYbPpRlGUSwCqpImnFsA09Pb19dHQ0BDuUkWIEqeAE/nZMe/Tawu1kogombXyr9Yad0A60YuQZIGty99BwrWTH5si2v61BSfJYsXR0dH6cY52R0iyp7YD9IQMSXQBvjysuGI7Tl6H4dQzIyPH3j5iGQlUtpJEvYgSCSKJn9Azi5YDeH1wcNCXvt9v3y6trq4eL6RIhMSdSNMlBhdtSSLdCIKVKI5x95KLRSwe52hLXNwWD+hVwm/aVOiBXgqjKLGDCAknjNgSIUX8tyj4m5kwT4/IqjMN145MDsBIDnagLVZTqOLIQo0zf7U5W51pV3cPBWyWs9WrYYlia8lmlcVWzr3xjgr0q+86ZZvYl8xkGfKcsFm7+UU0Tie0hc/DvHOvuWQb42M/Acjz9IQjR+6gRlqYbLiktNzwnmp1c4BCunih2DPfHQMBScEmNbD755071Gg0pLtuRdHlkTNngu48WlvXkGYLEBgIpZXQxMWXi6fq3Xn+J6AfJxueRVpqXbczoKLJlAvFU0EHWPp93C7n/9ndLT97+nRF+muTjKQfluJ2JSln+i7kWX5hIjN9GONI1S5+uudLVMh2TyJ5KFy+/rn3e8r3G/vzZ80JwyzjW7cNktw0qR6/ULx/2frAo3ILVJlYl0CSJzwhyQfIuv7ZDzKtVHjrk0YeSigh/ry8R7VXjzkun/vwgMrUoF379eNmDiqrKq2GqV3CL0r1CJRXuHXG8Q8gpuLZjw72/8SgXfvtSsPTUk529lv+AYDWab3XO/WcrxLl4LZbSlu6ApXLQbd1trnXO58GrGv/AbZsJ+kVTTHxAAAAAElFTkSuQmCC'
}

// 模拟的集成数据
export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'amazon-1',
    name: 'Amazon US Store',
    type: IntegrationType.MARKETPLACE,
    subType: IntegrationSubType.AMAZON,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.AMAZON,
    showNameFallback: false,
    connectionInfo: {
      seller_id: 'A2XXXXXXXXXXX',
      marketplace: 'United States',
      lastSyncTime: '2024-03-15T08:45:00Z',
      orderCount: 3500,
      productCount: 1200,
      revenue: '$125,000'
    }
  },
  {
    id: 'walmart-1',
    name: 'Walmart Marketplace',
    type: IntegrationType.MARKETPLACE,
    subType: IntegrationSubType.WALMART,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.WALMART,
    showNameFallback: false,
    connectionInfo: {
      channel_type: 'marketplace',
      lastSyncTime: '2024-03-15T08:30:00Z',
      orderCount: 850,
      productCount: 750,
      revenue: '$45,000'
    }
  },
  {
    id: 'tiktok-1',
    name: 'TikTok Shop US',
    type: IntegrationType.SOCIAL,
    subType: IntegrationSubType.TIKTOK,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.TIKTOK,
    showNameFallback: false,
    connectionInfo: {
      shop_region: 'US',
      lastSyncTime: '2024-03-15T09:00:00Z',
      orderCount: 1200,
      productCount: 300,
      revenue: '$28,000'
    }
  },
  {
    id: 'shopify-1',
    name: 'Main Shopify Store',
    type: IntegrationType.ECOMMERCE,
    subType: IntegrationSubType.SHOPIFY,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.SHOPIFY,
    showNameFallback: false,
    connectionInfo: {
      shop_domain: 'your-store.myshopify.com',
      lastSyncTime: '2024-03-15T08:15:00Z',
      orderCount: 950,
      productCount: 600,
      revenue: '$65,000'
    }
  },
  {
    id: 'shopify-2',
    name: 'Shopify B2B Store',
    type: IntegrationType.ECOMMERCE,
    subType: IntegrationSubType.SHOPIFY,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.SHOPIFY,
    showNameFallback: false,
    connectionInfo: {
      shop_domain: 'b2b-store.myshopify.com',
      lastSyncTime: '2024-03-15T08:20:00Z',
      orderCount: 320,
      productCount: 450,
      revenue: '$89,000'
    }
  },
  {
    id: 'woo-1',
    name: 'WooCommerce Store',
    type: IntegrationType.ECOMMERCE,
    subType: IntegrationSubType.WOOCOMMERCE,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.WOOCOMMERCE,
    showNameFallback: false,
    connectionInfo: {
      store_url: 'https://your-store.com',
      lastSyncTime: '2024-03-15T07:45:00Z',
      orderCount: 180,
      productCount: 250,
      revenue: '$15,000'
    }
  },
  {
    id: 'ebay-1',
    name: 'eBay US Store',
    type: IntegrationType.MARKETPLACE,
    subType: IntegrationSubType.EBAY,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.EBAY,
    showNameFallback: false,
    connectionInfo: {
      account_id: 'EBAY-US-1',
      marketplace: 'United States',
      lastSyncTime: '2024-03-15T07:30:00Z',
      orderCount: 420,
      productCount: 380,
      revenue: '$32,000'
    }
  },
  {
    id: 'amazon-2',
    name: 'Amazon Canada Store',
    type: IntegrationType.MARKETPLACE,
    subType: IntegrationSubType.AMAZON,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.AMAZON,
    showNameFallback: false,
    connectionInfo: {
      seller_id: 'A2YYYYYYYYYYY',
      marketplace: 'Canada',
      lastSyncTime: '2024-03-14T18:45:00Z',
      orderCount: 150,
      productCount: 800,
      revenue: '$18,000'
    }
  },
  {
    id: 'ups-1',
    name: 'UPS Capital - Main',
    type: IntegrationType.LOGISTICS,
    subType: IntegrationSubType.UPS,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.UPS,
    showNameFallback: false,
    connectionInfo: {
      account_number: '12345678',
      lastSyncTime: '2024-03-15T08:00:00Z',
      shipmentCount: 1200,
      trackingCount: 3500,
      revenue: '$42,000'
    }
  },
  {
    id: 'unis-wms-1',
    name: 'UNIS WMS - LA',
    type: IntegrationType.LOGISTICS,
    subType: IntegrationSubType.UNIS_WMS,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.UNIS,
    showNameFallback: false,
    connectionInfo: {
      warehouse_id: 'LA-001',
      lastSyncTime: '2024-03-15T08:15:00Z',
      inventoryCount: 25000,
      locationCount: 1500,
      orderCount: 850
    }
  },
  {
    id: 'unis-wms-2',
    name: 'UNIS WMS - NY',
    type: IntegrationType.LOGISTICS,
    subType: IntegrationSubType.UNIS_WMS,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.UNIS,
    showNameFallback: false,
    connectionInfo: {
      warehouse_id: 'NY-001',
      lastSyncTime: '2024-03-15T08:20:00Z',
      inventoryCount: 18000,
      locationCount: 1200,
      orderCount: 620
    }
  },
  {
    id: 'item-wms-1',
    name: 'Item WMS - Chicago',
    type: IntegrationType.LOGISTICS,
    subType: IntegrationSubType.ITEM_WMS,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.ITEM_WMS,
    showNameFallback: false,
    connectionInfo: {
      warehouse_id: 'CHI-001',
      lastSyncTime: '2024-03-15T08:25:00Z',
      inventoryCount: 32000,
      locationCount: 2200,
      orderCount: 980
    }
  },
  {
    id: 'item-wms-2',
    name: 'Item WMS - Dallas',
    type: IntegrationType.LOGISTICS,
    subType: IntegrationSubType.ITEM_WMS,
    status: 'connected',
    enabled: true,
    logo: INTEGRATION_LOGOS.ITEM_WMS,
    showNameFallback: false,
    connectionInfo: {
      warehouse_id: 'DAL-001',
      lastSyncTime: '2024-03-15T08:30:00Z',
      inventoryCount: 28000,
      locationCount: 1800,
      orderCount: 750
    }
  }
]

// 可用的集成列表
export const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    type: IntegrationType.MARKETPLACE,
    subType: IntegrationSubType.AMAZON,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.AMAZON,
    showNameFallback: false,
    description: 'Integrate with Amazon Marketplace to sync orders, inventory, and listings. Support for multiple regions and FBA.',
    features: [
      'Real-time order sync',
      'Inventory management',
      'FBA integration',
      'Multi-marketplace support'
    ]
  },
  {
    id: 'walmart',
    name: 'Walmart',
    type: IntegrationType.MARKETPLACE,
    subType: IntegrationSubType.WALMART,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.WALMART,
    showNameFallback: false,
    description: 'Connect with Walmart Marketplace for order management, inventory sync, and catalog updates.',
    features: [
      'Order management',
      'Inventory sync',
      'Price updates',
      'Shipping integration'
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    type: IntegrationType.SOCIAL,
    subType: IntegrationSubType.TIKTOK,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.TIKTOK,
    showNameFallback: false,
    description: 'Integrate with TikTok Shop to manage orders, products, and fulfill social commerce sales.',
    features: [
      'Order processing',
      'Product sync',
      'Inventory updates',
      'Fulfillment management'
    ]
  },
  {
    id: 'shopify',
    name: 'Shopify',
    type: IntegrationType.ECOMMERCE,
    subType: IntegrationSubType.SHOPIFY,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.SHOPIFY,
    showNameFallback: false,
    description: 'Connect your Shopify store to sync orders, products, inventory and fulfillment updates.',
    features: [
      'Real-time order sync',
      'Product management',
      'Inventory updates',
      'Fulfillment automation'
    ]
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    type: IntegrationType.ECOMMERCE,
    subType: IntegrationSubType.WOOCOMMERCE,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.WOOCOMMERCE,
    showNameFallback: false,
    description: 'Integrate WooCommerce store with our platform for complete order and inventory management.',
    features: [
      'Order sync',
      'Product management',
      'Inventory control',
      'Shipping integration'
    ]
  },
  {
    id: 'unis-wms',
    name: 'UNIS WMS',
    type: IntegrationType.LOGISTICS,
    subType: IntegrationSubType.UNIS_WMS,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.UNIS,
    showNameFallback: false,
    description: 'Integrate with UNIS Warehouse Management System for comprehensive inventory and fulfillment management.',
    features: [
      'Real-time inventory tracking',
      'Order fulfillment',
      'Warehouse management',
      'Shipping automation'
    ]
  },
  {
    id: 'ups',
    name: 'UPS Capital',
    type: IntegrationType.LOGISTICS,
    subType: IntegrationSubType.UPS,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.UPS,
    showNameFallback: false,
    description: 'Connect with UPS Capital for shipping, tracking, and logistics services.',
    features: [
      'Real-time tracking',
      'Label generation',
      'Rate calculation',
      'Insurance services'
    ]
  },
  {
    id: 'ebay',
    name: 'eBay',
    type: IntegrationType.MARKETPLACE,
    subType: IntegrationSubType.EBAY,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.EBAY,
    showNameFallback: false,
    description: 'Connect with eBay marketplace to manage listings, orders, and inventory.',
    features: [
      'Listing management',
      'Order processing',
      'Inventory sync',
      'Message management'
    ]
  },
  {
    id: 'item-wms',
    name: 'Item WMS',
    type: IntegrationType.LOGISTICS,
    subType: IntegrationSubType.ITEM_WMS,
    status: 'disabled',
    enabled: false,
    logo: INTEGRATION_LOGOS.ITEM_WMS,
    showNameFallback: false,
    description: 'Connect with Item WMS for advanced warehouse management and inventory control.',
    features: [
      'Real-time inventory tracking',
      'Advanced warehouse management',
      'Order fulfillment automation',
      'Multi-location support'
    ]
  }
] 