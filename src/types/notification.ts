// 通知类型定义
export interface NotificationType {
  code: string
  name: string
  nameEn?: string
  category: string
  categoryEn?: string
  subcategory?: string
  subcategoryEn?: string
  errorReason?: string
  errorReasonEn?: string
  solution?: string
  solutionEn?: string
  description?: string
}

// 定义所有通知分类
export type NotificationCategory = 
  | '订单更新失败'
  | '订单创建异常'
  | 'dispatch异常'
  | '系统异常'
  | 'DC报错';

// 邮箱联系人接口
export interface EmailContact {
  email: string
  name: string
}

// 重发配置接口
export interface ResendConfig {
  enabled: boolean                  // 是否启用重发
  mode: 'interval' | 'nextday' | 'endday'  // 重发模式：间隔、次日指定时间、每天结束时
  intervalHours?: number           // 间隔多少小时后重发
  specifiedTime?: string           // 次日指定时间，格式 "HH:MM"
  maxResendTimes?: number          // 最大重发次数，0表示不限制
  onlyForUnresolved?: boolean      // 是否仅重发未解决的问题
}

// 邮箱配置接口
export interface EmailConfig {
  id: string
  contacts: EmailContact[] // 改为contacts数组，支持多个邮箱和接收人
  status: boolean
  notificationTypes: NotificationType[]
  notificationSetting: {
    mode: 'realtime' | 'scheduled'
    scheduledTimes?: string[] // 定时发送时间点，格式 ["HH:MM"]
  }
  
  // 重发配置
  resendConfig?: ResendConfig
  
  // 废弃字段，保留以兼容旧数据
  notificationTime?: {
    enabled: boolean
    timeRange: {
      start: string // 格式 "HH:MM"
      end: string // 格式 "HH:MM"
    }
    workdaysOnly?: boolean
  }
  notificationFrequency?: {
    mode: 'immediate' | 'digest' | 'scheduled'
    digest?: {
      interval: 'hourly' | 'daily' | 'weekly'
      time?: string // 每日/每周的发送时间，格式 "HH:MM"
      weekDay?: number // 每周的发送日（0-6，0代表周日）
    }
    scheduled?: {
      times: string[] // 固定时间点，格式 ["HH:MM"]
    }
    maxPerDay?: number // 每日最大通知次数限制
  }
  createdTime: string
  updatedTime?: string
}

// 定义所有可能的通知类型代码
export type NotificationTypeCode = 
  // 库存与商品异常
  | 'insufficient_inventory' 
  | 'product_not_exist' 
  | 'warehouse_error'
  | 'product_price_change'
  
  // 订单地址相关
  | 'address_invalid'
  | 'address_update'
  | 'address_verify_fail'
  | 'zipcode_not_supported'
  
  // 订单状态变更
  | 'order_placed'
  | 'order_paid'
  | 'order_cancel'
  | 'order_ship'
  | 'order_delivery'
  | 'order_complete'
  
  // 订单内容变更
  | 'order_items_change'
  | 'order_quantity_change'
  | 'order_split'
  | 'order_merge'
  
  // 退换货相关
  | 'return_request'
  | 'return_approved'
  | 'return_rejected'
  | 'return_received'
  | 'exchange_request'
  | 'exchange_processed'
  
  // 支付相关
  | 'payment_failure'
  | 'payment_refund'
  | 'payment_partial'
  
  // 物流相关
  | 'logistics_exception'
  | 'logistics_delay'
  | 'delivery_failed'
  | 'package_damaged'
  
  // 价格相关
  | 'price_mismatch'
  | 'discount_applied'
  | 'discount_expired'
  
  // 系统相关
  | 'system_error'
  | 'api_connection_error'
  | 'integration_failure'

// 通知类型标签颜色映射
export const notificationTypeColorMap: Record<NotificationTypeCode, string> = {
  // 库存与商品异常
  'insufficient_inventory': 'danger',
  'product_not_exist': 'warning',
  'warehouse_error': 'info',
  'product_price_change': 'warning',
  
  // 订单地址相关
  'address_invalid': 'warning',
  'address_update': 'info',
  'address_verify_fail': 'danger',
  'zipcode_not_supported': 'warning',
  
  // 订单状态变更
  'order_placed': 'success',
  'order_paid': 'success',
  'order_cancel': 'info',
  'order_ship': 'success',
  'order_delivery': 'success',
  'order_complete': 'success',
  
  // 订单内容变更
  'order_items_change': 'warning',
  'order_quantity_change': 'warning',
  'order_split': 'info',
  'order_merge': 'info',
  
  // 退换货相关
  'return_request': 'info',
  'return_approved': 'success',
  'return_rejected': 'danger',
  'return_received': 'success',
  'exchange_request': 'info',
  'exchange_processed': 'success',
  
  // 支付相关
  'payment_failure': 'danger',
  'payment_refund': 'warning',
  'payment_partial': 'warning',
  
  // 物流相关
  'logistics_exception': 'warning',
  'logistics_delay': 'warning',
  'delivery_failed': 'danger',
  'package_damaged': 'danger',
  
  // 价格相关
  'price_mismatch': 'danger',
  'discount_applied': 'success',
  'discount_expired': 'info',
  
  // 系统相关
  'system_error': 'danger',
  'api_connection_error': 'danger',
  'integration_failure': 'danger'
}

// 通知类型分组
export const notificationGroups = [
  {
    id: 'inventory',
    name: '库存与商品',
    types: ['insufficient_inventory', 'product_not_exist', 'warehouse_error', 'product_price_change']
  },
  {
    id: 'address',
    name: '地址信息',
    types: ['address_invalid', 'address_update', 'address_verify_fail', 'zipcode_not_supported']
  },
  {
    id: 'order_status',
    name: '订单状态',
    types: ['order_placed', 'order_paid', 'order_cancel', 'order_ship', 'order_delivery', 'order_complete']
  },
  {
    id: 'order_changes',
    name: '订单变更',
    types: ['order_items_change', 'order_quantity_change', 'order_split', 'order_merge']
  },
  {
    id: 'returns',
    name: '退换货',
    types: ['return_request', 'return_approved', 'return_rejected', 'return_received', 'exchange_request', 'exchange_processed']
  },
  {
    id: 'payment',
    name: '支付',
    types: ['payment_failure', 'payment_refund', 'payment_partial']
  },
  {
    id: 'logistics',
    name: '物流',
    types: ['logistics_exception', 'logistics_delay', 'delivery_failed', 'package_damaged']
  },
  {
    id: 'pricing',
    name: '价格',
    types: ['price_mismatch', 'discount_applied', 'discount_expired']
  },
  {
    id: 'system',
    name: '系统',
    types: ['system_error', 'api_connection_error', 'integration_failure']
  }
]

// 默认通知类型列表
export const defaultNotificationTypes: NotificationType[] = [
  // 订单更新失败 Order Update Failed
  { 
    code: 'sku_update_failed', 
    name: '商品数量更新失败',
    nameEn: 'SKU quantity update failed',
    category: '订单更新失败', 
    categoryEn: 'Order Update Failed',
    errorReason: '订单已存在，需更新商品信息',
    errorReasonEn: 'Order exists, need to update SKUs',
    solution: '检查商品信息后重新提交',
    solutionEn: 'Verify SKU info and resubmit'
  },
  { 
    code: 'address_update_failed', 
    name: '收货地址更新失败',
    nameEn: 'Address update failed',
    category: '订单更新失败', 
    categoryEn: 'Order Update Failed',
    errorReason: '订单已存在，需更新收货地址',
    errorReasonEn: 'Order exists, need to update address',
    solution: '检查地址是否准确完整',
    solutionEn: 'Verify and complete address'
  },
  
  // 订单创建异常 Order Creation Exception
  { 
    code: 'order_creation_failed', 
    name: '订单创建失败',
    nameEn: 'Order creation failed',
    category: '订单创建异常', 
    categoryEn: 'Order Creation Exception',
    errorReason: '系统建单失败',
    errorReasonEn: 'Order creation failed',
    solution: '检查订单字段完整性并重试',
    solutionEn: 'Verify fields and retry'
  },
  { 
    code: 'insufficient_inventory', 
    name: '商品库存不足',
    nameEn: 'Insufficient inventory',
    category: '订单创建异常', 
    categoryEn: 'Order Creation Exception',
    errorReason: '库存不足导致建单失败',
    errorReasonEn: 'Order creation failed due to low inventory',
    solution: '补充库存后重试建单',
    solutionEn: 'Replenish inventory and retry'
  },
  { 
    code: 'product_not_found', 
    name: '商品不存在',
    nameEn: 'Product not found',
    category: '订单创建异常', 
    categoryEn: 'Order Creation Exception',
    errorReason: '商品未在系统中注册',
    errorReasonEn: 'Product not found in system',
    solution: '补充商品数据并重新建单',
    solutionEn: 'Add SKU and retry'
  },
  { 
    code: 'invalid_address', 
    name: '收货地址不正确',
    nameEn: 'Invalid address',
    category: '订单创建异常', 
    categoryEn: 'Order Creation Exception',
    errorReason: '地址格式错误或缺失',
    errorReasonEn: 'Incorrect or missing address',
    solution: '修正地址格式',
    solutionEn: 'Fix address format'
  },
  
  // dispatch异常 Dispatch Exception
  { 
    code: 'dispatch_inventory_insufficient', 
    name: '商品库存不足',
    nameEn: 'Inventory insufficient',
    category: 'dispatch异常', 
    categoryEn: 'Dispatch Exception',
    subcategory: 'dispatch失败',
    subcategoryEn: 'Dispatch failed',
    errorReason: 'dispatch时库存不足',
    errorReasonEn: 'Inventory shortage during dispatch',
    solution: '补充库存后重试dispatch',
    solutionEn: 'Replenish inventory and retry'
  },
  { 
    code: 'dispatch_sku_not_found', 
    name: '商品不存在',
    nameEn: 'SKU not found',
    category: 'dispatch异常', 
    categoryEn: 'Dispatch Exception',
    subcategory: 'dispatch失败',
    subcategoryEn: 'Dispatch failed',
    errorReason: 'dispatch时商品未找到',
    errorReasonEn: 'SKU missing in dispatch',
    solution: '添加SKU数据后重试',
    solutionEn: 'Add SKU and retry'
  },
  { 
    code: 'dispatch_invalid_address', 
    name: '收货地址不正确',
    nameEn: 'Invalid address',
    category: 'dispatch异常', 
    categoryEn: 'Dispatch Exception',
    subcategory: 'dispatch失败',
    subcategoryEn: 'Dispatch failed',
    errorReason: 'dispatch时地址不符合要求',
    errorReasonEn: 'Invalid address during dispatch',
    solution: '检查并修正地址',
    solutionEn: 'Verify and fix address'
  },
  { 
    code: 'warehouse_config_error', 
    name: '仓库信息异常',
    nameEn: 'Warehouse config error',
    category: 'dispatch异常', 
    categoryEn: 'Dispatch Exception',
    subcategory: 'dispatch失败',
    subcategoryEn: 'Dispatch failed',
    errorReason: '仓库信息无效或缺失',
    errorReasonEn: 'Invalid/missing warehouse config',
    solution: '检查仓库配置',
    solutionEn: 'Review warehouse setup'
  },
  { 
    code: 'version_not_set', 
    name: '未指定版本',
    nameEn: 'Version not set',
    category: 'dispatch异常', 
    categoryEn: 'Dispatch Exception',
    subcategory: 'dispatch失败',
    subcategoryEn: 'Dispatch failed',
    errorReason: '仓库未设置version字段',
    errorReasonEn: 'Warehouse version missing',
    solution: '指定正确的仓库version',
    solutionEn: 'Set correct version'
  },
  { 
    code: 'no_matching_zipcode', 
    name: '匹配不到zipcode',
    nameEn: 'No matching zipcode',
    category: 'dispatch异常', 
    categoryEn: 'Dispatch Exception',
    subcategory: 'dispatch失败',
    subcategoryEn: 'Dispatch failed',
    errorReason: '无满足条件的库房',
    errorReasonEn: 'No warehouse matches ZIP',
    solution: '更新ZIP规则或补充库房',
    solutionEn: 'Update ZIP rules'
  },
  { 
    code: 'no_matching_country', 
    name: '匹配不到country',
    nameEn: 'No matching country',
    category: 'dispatch异常', 
    categoryEn: 'Dispatch Exception',
    subcategory: 'dispatch失败',
    subcategoryEn: 'Dispatch failed',
    errorReason: '无满足条件的国家库房',
    errorReasonEn: 'No warehouse matches country',
    solution: '更新国家与库房配置',
    solutionEn: 'Update country-warehouse config'
  },
  { 
    code: 'warehouse_mismatch', 
    name: '指定库房不匹配',
    nameEn: 'Warehouse mismatch',
    category: 'dispatch异常', 
    categoryEn: 'Dispatch Exception',
    subcategory: 'dispatch失败',
    subcategoryEn: 'Dispatch failed',
    errorReason: '订单不在指定库房中',
    errorReasonEn: 'Order not in specified warehouse',
    solution: '调整订单或库房设置',
    solutionEn: 'Adjust order or warehouse'
  },
  
  // 系统异常 System Exception
  { 
    code: 'system_error', 
    name: '系统内部错误',
    nameEn: 'System error',
    category: '系统异常', 
    categoryEn: 'System Exception',
    errorReason: '建单或dispatch失败',
    errorReasonEn: 'System failure in order or dispatch',
    solution: '查看系统日志并联系技术支持',
    solutionEn: 'Check logs and contact support'
  },
  { 
    code: 'wms_error', 
    name: 'WMS异常',
    nameEn: 'WMS error',
    category: '系统异常', 
    categoryEn: 'System Exception',
    errorReason: 'WMS建单/履约失败',
    errorReasonEn: 'WMS creation/fulfillment error',
    solution: '联系WMS对接人并处理',
    solutionEn: 'Contact WMS support'
  },
  { 
    code: 'inventory_api_error', 
    name: '库存接口报错',
    nameEn: 'Inventory API error',
    category: '系统异常', 
    categoryEn: 'System Exception',
    errorReason: '请求超时或接口返回错误',
    errorReasonEn: 'Timeout or API failure',
    solution: '检查网络或接口状态',
    solutionEn: 'Check API or network'
  },
  { 
    code: 'distance_api_error', 
    name: '最短距离接口报错',
    nameEn: 'Distance API error',
    category: '系统异常', 
    categoryEn: 'System Exception',
    errorReason: '请求最短距离接口失败',
    errorReasonEn: 'Shortest distance API failed',
    solution: '联系开发排查错误',
    solutionEn: 'Contact dev to debug'
  },
  
  // DC报错 DC Error
  { 
    code: 'dc_data_missing', 
    name: 'DC数据缺失',
    nameEn: 'DC data missing',
    category: 'DC报错', 
    categoryEn: 'DC Error',
    errorReason: '缺少polineno等关键字段，三方数据未同步',
    errorReasonEn: 'Missing key fields such as polineno',
    solution: '补充缺失字段',
    solutionEn: 'Patch missing data'
  }
]; 