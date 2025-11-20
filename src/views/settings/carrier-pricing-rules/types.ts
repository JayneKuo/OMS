// 自动询价规则
export interface RateShoppingRule {
  id?: string | number
  ruleName: string
  description: string
  status: 'active' | 'inactive'
  priority: number
  
  // 触发条件
  triggerConditions: TriggerConditions
  
  // 询价配置
  rateShoppingConfig: RateShoppingConfig
  
  // 选择逻辑
  selectionLogic: SelectionLogic
  
  // 审核规则
  reviewRules: ReviewRules
  
  createdAt?: string
  updatedAt?: string
}

// 触发条件
export interface TriggerConditions {
  // 订单状态
  orderStatus?: string[]
  
  // 目的地条件
  destinationCountries?: string[]
  destinationStates?: string[]
  destinationZipCodes?: string[]
  destinationAddressType?: 'residential' | 'commercial' | 'any' // 地址类型
  
  // 发货地条件
  originStates?: string[]
  warehouseIds?: string[]
  
  // 重量条件
  weightMin?: number | null
  weightMax?: number | null
  dimensionalWeight?: boolean // 是否考虑体积重量
  
  // 金额条件
  orderValueMin?: number | null
  orderValueMax?: number | null
  
  // 产品条件
  productSKUs?: string[]
  productCategories?: string[]
  productTags?: string[]
  hazmatFlag?: boolean | null // 危险品
  temperatureControlled?: boolean | null // 温控
  fragileItems?: boolean | null // 易碎品
  
  // 时间条件
  orderDateRange?: {
    startDate: string
    endDate: string
  }
  requiredShipDate?: string
  requiredDeliveryDate?: string
  businessDaysOnly?: boolean
  
  // 客户条件
  customerTags?: string[]
  customerGroups?: string[]
  customerType?: string[] // Retail, Wholesale, VIP
  customerPriorityLevel?: string[]
  
  // 销售渠道
  salesChannels?: string[] // Amazon, eBay, Shopify, etc.
  orderSource?: string[]
  
  // 服务要求
  signatureRequired?: boolean | null
  saturdayDelivery?: boolean | null
  liftgateRequired?: boolean | null
  
  // 包裹特性
  packageCountMin?: number | null
  packageCountMax?: number | null
  oversized?: boolean | null
}

// 询价配置
export interface RateShoppingConfig {
  carriers: CarrierConfig[]
}

export interface CarrierConfig {
  carrier: string // fedex, ups, usps, dhl
  enabled: boolean
  shippingAccountId: string | number // 关联的shipping account
  shippingAccountName?: string // 用于显示
  serviceTypes: string[] // 选择哪些服务类型
  excludeServiceTypes?: string[] // 排除哪些服务类型
  deliveryService?: string // 配送服务
  shipMethod?: 'FTL' | 'LTL' | 'SMALL PARCEL' // 发货方式
  
  // 价格调整
  markupType?: 'percentage' | 'fixed' | 'none'
  markupValue?: number
  
  // 询价参数配置
  packageConfig?: {
    defaultPackageType?: string // Box, Envelope, Pak, Tube
    defaultDimensions?: {
      length: number
      width: number
      height: number
      unit: 'in' | 'cm'
    }
    dimDivisor?: number // 体积重量除数 (139 for domestic, 166 for international)
  }
  
  // 附加服务
  additionalServices?: {
    saturdayDelivery?: boolean
    signatureConfirmation?: 'none' | 'adult' | 'direct' | 'indirect'
    insurance?: boolean
    insuranceValue?: number
    codAmount?: number // Cash on Delivery
    residentialDelivery?: boolean
  }
  
  // 费率过滤
  rateFilters?: {
    maxRate?: number // 最高费率限制
    minTransitDays?: number // 最短时效
    maxTransitDays?: number // 最长时效
  }
  
  // API配置
  apiConfig?: {
    timeout?: number // 超时时间（秒）
    retryAttempts?: number // 重试次数
    useTestMode?: boolean // 测试模式
  }
}

// 选择逻辑
export interface SelectionLogic {
  primaryCriteria: 'cheapest' | 'fastest' | 'custom' // 主要标准
  
  // 自定义权重（当primaryCriteria为custom时）
  customWeights?: {
    priceWeight: number // 价格权重 0-100
    speedWeight: number // 时效权重 0-100
  }
  
  // 排除条件
  excludeConditions?: {
    maxPrice?: number // 最高价格限制
    maxDays?: number // 最长时效限制
  }
  
  // 承运商优先级（当价格/时效相近时）
  carrierPriority?: string[] // ['fedex', 'ups', 'usps']
  
  // Fallback策略
  fallbackStrategy?: 'manual_review' | 'cheapest_available' | 'specific_carrier'
  fallbackCarrier?: string
}

// 审核规则
export interface ReviewRules {
  requireReview: boolean
  
  // 审核条件（任一满足则需要审核）
  reviewConditions?: {
    // 价格超过阈值
    priceThreshold?: number
    
    // 与预估价格差异过大
    priceDeviationPercentage?: number
    
    // 特定目的地
    specificDestinations?: string[]
    
    // 特定承运商
    specificCarriers?: string[]
    
    // 特定服务类型
    specificServiceTypes?: string[]
    
    // 重量超过阈值
    weightThreshold?: number
    
    // 无可用费率
    noRatesAvailable: boolean
    
    // 所有费率都超过预期
    allRatesExceedBudget: boolean
  }
  
  // 审核通知
  notifyUsers?: string[] // 用户ID列表
  notifyEmails?: string[]
}

// 筛选条件
export interface RateShoppingRuleFilter {
  ruleName?: string
  status?: string
  carrier?: string
}

// 常量选项
export const CARRIER_OPTIONS = [
  { label: 'FedEx', value: 'fedex' },
  { label: 'UPS', value: 'ups' },
  { label: 'USPS', value: 'usps' },
  { label: 'DHL', value: 'dhl' }
]

export const ORDER_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Ready to Ship', value: 'ready_to_ship' },
  { label: 'Awaiting Fulfillment', value: 'awaiting_fulfillment' }
]

export const SERVICE_TYPE_OPTIONS = [
  { label: 'Ground', value: 'ground' },
  { label: 'Express', value: 'express' },
  { label: 'Overnight', value: 'overnight' },
  { label: '2-Day', value: '2day' },
  { label: 'International', value: 'international' },
  { label: 'Economy', value: 'economy' }
]

export const PRIMARY_CRITERIA_OPTIONS = [
  { label: 'Cheapest Rate', value: 'cheapest' },
  { label: 'Fastest Delivery', value: 'fastest' },
  { label: 'Custom Balance', value: 'custom' }
]

export const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

export const MARKUP_TYPE_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed Amount', value: 'fixed' }
]

export const ADDRESS_TYPE_OPTIONS = [
  { label: 'Any', value: 'any' },
  { label: 'Residential Only', value: 'residential' },
  { label: 'Commercial Only', value: 'commercial' }
]

export const CUSTOMER_TYPE_OPTIONS = [
  { label: 'Retail', value: 'retail' },
  { label: 'Wholesale', value: 'wholesale' },
  { label: 'VIP', value: 'vip' },
  { label: 'Enterprise', value: 'enterprise' }
]

export const PRIORITY_LEVEL_OPTIONS = [
  { label: 'Standard', value: 'standard' },
  { label: 'Priority', value: 'priority' },
  { label: 'Express', value: 'express' }
]

export const SALES_CHANNEL_OPTIONS = [
  { label: 'Amazon', value: 'amazon' },
  { label: 'eBay', value: 'ebay' },
  { label: 'Shopify', value: 'shopify' },
  { label: 'WooCommerce', value: 'woocommerce' },
  { label: 'Walmart', value: 'walmart' },
  { label: 'Website', value: 'website' },
  { label: 'Wholesale Portal', value: 'wholesale' }
]

export const PACKAGE_TYPE_OPTIONS = [
  { label: 'Box', value: 'box' },
  { label: 'Envelope', value: 'envelope' },
  { label: 'Pak', value: 'pak' },
  { label: 'Tube', value: 'tube' },
  { label: 'Pallet', value: 'pallet' }
]

export const SIGNATURE_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Adult Signature', value: 'adult' },
  { label: 'Direct Signature', value: 'direct' },
  { label: 'Indirect Signature', value: 'indirect' }
]

export const US_STATES = [
  { label: 'Alabama (AL)', value: 'AL' },
  { label: 'Alaska (AK)', value: 'AK' },
  { label: 'Arizona (AZ)', value: 'AZ' },
  { label: 'Arkansas (AR)', value: 'AR' },
  { label: 'California (CA)', value: 'CA' },
  { label: 'Colorado (CO)', value: 'CO' },
  { label: 'Connecticut (CT)', value: 'CT' },
  { label: 'Delaware (DE)', value: 'DE' },
  { label: 'Florida (FL)', value: 'FL' },
  { label: 'Georgia (GA)', value: 'GA' },
  { label: 'Hawaii (HI)', value: 'HI' },
  { label: 'Idaho (ID)', value: 'ID' },
  { label: 'Illinois (IL)', value: 'IL' },
  { label: 'Indiana (IN)', value: 'IN' },
  { label: 'Iowa (IA)', value: 'IA' },
  { label: 'Kansas (KS)', value: 'KS' },
  { label: 'Kentucky (KY)', value: 'KY' },
  { label: 'Louisiana (LA)', value: 'LA' },
  { label: 'Maine (ME)', value: 'ME' },
  { label: 'Maryland (MD)', value: 'MD' },
  { label: 'Massachusetts (MA)', value: 'MA' },
  { label: 'Michigan (MI)', value: 'MI' },
  { label: 'Minnesota (MN)', value: 'MN' },
  { label: 'Mississippi (MS)', value: 'MS' },
  { label: 'Missouri (MO)', value: 'MO' },
  { label: 'Montana (MT)', value: 'MT' },
  { label: 'Nebraska (NE)', value: 'NE' },
  { label: 'Nevada (NV)', value: 'NV' },
  { label: 'New Hampshire (NH)', value: 'NH' },
  { label: 'New Jersey (NJ)', value: 'NJ' },
  { label: 'New Mexico (NM)', value: 'NM' },
  { label: 'New York (NY)', value: 'NY' },
  { label: 'North Carolina (NC)', value: 'NC' },
  { label: 'North Dakota (ND)', value: 'ND' },
  { label: 'Ohio (OH)', value: 'OH' },
  { label: 'Oklahoma (OK)', value: 'OK' },
  { label: 'Oregon (OR)', value: 'OR' },
  { label: 'Pennsylvania (PA)', value: 'PA' },
  { label: 'Rhode Island (RI)', value: 'RI' },
  { label: 'South Carolina (SC)', value: 'SC' },
  { label: 'South Dakota (SD)', value: 'SD' },
  { label: 'Tennessee (TN)', value: 'TN' },
  { label: 'Texas (TX)', value: 'TX' },
  { label: 'Utah (UT)', value: 'UT' },
  { label: 'Vermont (VT)', value: 'VT' },
  { label: 'Virginia (VA)', value: 'VA' },
  { label: 'Washington (WA)', value: 'WA' },
  { label: 'West Virginia (WV)', value: 'WV' },
  { label: 'Wisconsin (WI)', value: 'WI' },
  { label: 'Wyoming (WY)', value: 'WY' }
]
