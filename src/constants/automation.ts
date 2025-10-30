import type { FieldGroup, OperatorOption, ActionGroup } from '../types/automation'

// Operator definitions
export const OPERATOR_OPTIONS: OperatorOption[] = [
  { 
    label: 'Equals',
    value: 'eq',
    applicableTypes: ['string', 'number', 'boolean', 'enum'],
    description: 'Exact match with the value',
    example: 'status Equals "processing"'
  },
  { 
    label: 'Equals Any Of',
    value: 'in',
    applicableTypes: ['string', 'number', 'enum'],
    description: 'Match any value in the list',
    example: 'status Equals Any Of ["processing", "pending"]'
  },
  { 
    label: 'Does Not Equal',
    value: 'neq',
    applicableTypes: ['string', 'number', 'boolean', 'enum'],
    description: 'Does not match the value',
    example: 'status Does Not Equal "cancelled"'
  },
  { 
    label: 'Does Not Equal Any Of',
    value: 'not_in',
    applicableTypes: ['string', 'number', 'enum'],
    description: 'Does not match any value in the list',
    example: 'status Does Not Equal Any Of ["cancelled", "failed"]'
  },
  { 
    label: 'Starts With',
    value: 'starts_with',
    applicableTypes: ['string'],
    description: 'Text starts with the value',
    example: 'order_number Starts With "US-"'
  },
  { 
    label: 'Ends With',
    value: 'ends_with',
    applicableTypes: ['string'],
    description: 'Text ends with the value',
    example: 'order_number Ends With "-RUSH"'
  },
  { 
    label: 'Contains',
    value: 'contains',
    applicableTypes: ['string', 'array'],
    description: 'Text contains the value or array includes the value',
    example: 'tags Contains "VIP"'
  },
  { 
    label: 'Does Not Contain',
    value: 'not_contains',
    applicableTypes: ['string', 'array'],
    description: 'Text does not contain the value or array does not include the value',
    example: 'tags Does Not Contain "test"'
  },
  { 
    label: 'Matches (* Wildcard)',
    value: 'matches',
    applicableTypes: ['string'],
    description: 'Text matches the pattern (* for any characters)',
    example: 'order_number Matches "US-*-2024"'
  },
  { 
    label: 'Greater Than',
    value: 'gt',
    applicableTypes: ['number', 'datetime', 'date'],
    description: 'Number is greater than the value',
    example: 'total_price Greater Than 100'
  },
  { 
    label: 'Less Than',
    value: 'lt',
    applicableTypes: ['number', 'datetime', 'date'],
    description: 'Number is less than the value',
    example: 'total_price Less Than 1000'
  }
]

// Field definitions
export const FIELD_GROUPS = [
  {
    key: 'basic',
    label: 'Order Basic Info',
    description: '订单基本信息',
    fields: [
      {
        label: 'Order ID',
        value: 'id',
        type: 'string',
        description: '唯一标识订单，用于精确识别',
        supportedOperators: ['equals', 'startsWith', 'contains']
      },
      {
        label: 'Created At',
        value: 'created_at',
        type: 'datetime',
        description: '可用于订单流控，如近期订单处理',
        supportedOperators: ['greaterThan', 'lessThan', 'between']
      },
      {
        label: 'Updated At',
        value: 'updated_at',
        type: 'datetime',
        description: '判断是否为最近修改订单，支持版本控制',
        supportedOperators: ['greaterThan', 'lessThan', 'between']
      },
      {
        label: 'Tags',
        value: 'tags',
        type: 'string',
        description: '标记类订单，便于分类处理',
        supportedOperators: ['equals', 'contains', 'equalsAnyOf']
      },
      {
        label: 'Note',
        value: 'note',
        type: 'string',
        description: '用户自定义备注内容',
        supportedOperators: ['contains', 'startsWith']
      },
      {
        label: 'Fulfillment Status',
        value: 'fulfillment_status',
        type: 'enum',
        description: '控制订单发货状态下的处理逻辑',
        options: [
          { label: 'Fulfilled', value: 'fulfilled' },
          { label: 'Partially Fulfilled', value: 'partial' },
          { label: 'Not Fulfilled', value: 'none' }
        ],
        supportedOperators: ['equals']
      },
      {
        label: 'Order Status',
        value: 'status',
        type: 'enum',
        description: '用于识别订单是否仍在处理、已取消、或履约完成，支持自定义扩展状态',
        options: [
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Fulfilled', value: 'fulfilled' },
          { label: 'Partially Fulfilled', value: 'partially_fulfilled' },
          { label: 'On Hold', value: 'on_hold' }
        ],
        supportedOperators: ['equals']
      }
    ]
  },
  {
    key: 'customer',
    label: 'Customer Info',
    description: '买家信息',
    fields: [
      {
        label: 'Customer ID',
        value: 'customer.id',
        type: 'string',
        description: '唯一标识客户',
        supportedOperators: ['equals']
      },
      {
        label: 'Customer Email',
        value: 'customer.email',
        type: 'string',
        description: '客户联系方式',
        supportedOperators: ['equals', 'contains']
      },
      {
        label: 'First Name',
        value: 'customer.first_name',
        type: 'string',
        description: '客户名',
        supportedOperators: ['equals', 'contains']
      },
      {
        label: 'Last Name',
        value: 'customer.last_name',
        type: 'string',
        description: '客户姓',
        supportedOperators: ['equals', 'contains']
      },
      {
        label: 'Phone',
        value: 'customer.phone',
        type: 'string',
        description: '客户电话',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Customer Tags',
        value: 'customer.tags',
        type: 'string',
        description: '区分亚马逊或特殊客户',
        supportedOperators: ['equals', 'contains']
      }
    ]
  },
  {
    key: 'shipping_address',
    label: 'Shipping Address',
    description: '收货地址信息',
    fields: [
      {
        label: 'Country Code',
        value: 'shipping_address.country_code',
        type: 'string',
        description: '用于区域履约策略',
        supportedOperators: ['equals']
      },
      {
        label: 'Province/State',
        value: 'shipping_address.province',
        type: 'string',
        description: '地区控制',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'City',
        value: 'shipping_address.city',
        type: 'string',
        description: '城市',
        supportedOperators: ['equals']
      },
      {
        label: 'ZIP/Postal Code',
        value: 'shipping_address.zip',
        type: 'string',
        description: '匹配特定物流区域',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Name',
        value: 'shipping_address.name',
        type: 'string',
        description: '收货人名',
        supportedOperators: ['equals', 'contains']
      },
      {
        label: 'Phone',
        value: 'shipping_address.phone',
        type: 'string',
        description: '收货人电话',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Company',
        value: 'shipping_address.company',
        type: 'string',
        description: '可用于识别平台来源',
        supportedOperators: ['equals', 'contains']
      }
    ]
  },
  {
    key: 'billing_address',
    label: 'Billing Address',
    description: '账单地址信息',
    fields: [
      {
        label: 'Country Code',
        value: 'billing_address.country_code',
        type: 'string',
        description: '用于区域履约策略',
        supportedOperators: ['equals']
      },
      {
        label: 'Province/State',
        value: 'billing_address.province',
        type: 'string',
        description: '地区控制',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'City',
        value: 'billing_address.city',
        type: 'string',
        description: '城市',
        supportedOperators: ['equals']
      },
      {
        label: 'ZIP/Postal Code',
        value: 'billing_address.zip',
        type: 'string',
        description: '匹配特定物流区域',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Name',
        value: 'billing_address.name',
        type: 'string',
        description: '收货人名',
        supportedOperators: ['equals', 'contains']
      },
      {
        label: 'Phone',
        value: 'billing_address.phone',
        type: 'string',
        description: '收货人电话',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Company',
        value: 'billing_address.company',
        type: 'string',
        description: '可用于识别平台来源',
        supportedOperators: ['equals', 'contains']
      }
    ]
  },
  {
    key: 'line_items',
    label: 'Line Items',
    description: '商品信息',
    fields: [
      {
        label: 'SKU',
        value: 'line_items.sku',
        type: 'string',
        description: 'SKU 映射规则匹配字段',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Quantity',
        value: 'line_items.quantity',
        type: 'number',
        description: '控制大订单场景',
        supportedOperators: ['greaterThan', 'lessThan']
      },
      {
        label: 'Title',
        value: 'line_items.title',
        type: 'string',
        description: '可用于模糊匹配商品类型',
        supportedOperators: ['contains']
      },
      {
        label: 'Vendor',
        value: 'line_items.vendor',
        type: 'string',
        description: 'SKU Mapping补充信息',
        supportedOperators: ['equals']
      },
      {
        label: 'Variant Title',
        value: 'line_items.variant_title',
        type: 'string',
        description: 'SKU Mapping辅助判断',
        supportedOperators: ['equals']
      },
      {
        label: 'Fulfillment Service',
        value: 'line_items.fulfillment_service',
        type: 'enum',
        description: '可判断是否走自配送、平台履约',
        options: [
          { label: 'Manual', value: 'manual' },
          { label: 'Amazon', value: 'amazon' }
        ],
        supportedOperators: ['equals']
      }
    ]
  },
  {
    key: 'payment',
    label: 'Payment Info',
    description: '支付信息',
    fields: [
      {
        label: 'Financial Status',
        value: 'financial_status',
        type: 'enum',
        description: '控制是否放行未支付订单',
        options: [
          { label: 'Paid', value: 'paid' },
          { label: 'Pending', value: 'pending' }
        ],
        supportedOperators: ['equals']
      },
      {
        label: 'Total Price',
        value: 'total_price',
        type: 'number',
        description: '用于高金额订单控制逻辑',
        supportedOperators: ['greaterThan']
      },
      {
        label: 'Currency',
        value: 'currency',
        type: 'string',
        description: '多币种订单支持',
        supportedOperators: ['equals']
      }
    ]
  },
  {
    key: 'refund',
    label: 'Refund Info',
    description: '退款信息',
    fields: [
      {
        label: 'Refund Status',
        value: 'refund_status',
        type: 'enum',
        description: '判断是否已发生退款处理',
        options: [
          { label: 'Refunded', value: 'refunded' },
          { label: 'Partially Refunded', value: 'partial' }
        ],
        supportedOperators: ['equals']
      },
      {
        label: 'Return Reason',
        value: 'returns.reason',
        type: 'string',
        description: '控制异常商品处理策略',
        supportedOperators: ['contains']
      }
    ]
  },
  {
    key: 'platform',
    label: 'Platform Info',
    description: '平台信息',
    fields: [
      {
        label: 'Original Order ID',
        value: 'original_order_id',
        type: 'string',
        description: '识别来源于 Amazon 的订单',
        supportedOperators: ['equals']
      },
      {
        label: 'Source Platform',
        value: 'source_name',
        type: 'string',
        description: '用于识别不同平台来源',
        supportedOperators: ['equals']
      },
      {
        label: 'Integration Channel',
        value: 'source_integration',
        type: 'string',
        description: '区分多系统同步来源',
        supportedOperators: ['equals']
      }
    ]
  }
]

// Action definitions
export const ACTION_GROUPS: ActionGroup[] = [
  {
    key: 'update_order',
    label: 'Update Order Field',
    description: 'Update order fields',
    actions: [
      {
        label: 'Update Order Field',
        value: 'update_order_field',
        description: 'Update specific order field values',
        config: {
          fields: [
            {
              name: 'field',
              type: 'enum',
              label: 'Field',
              description: 'Select field to update',
              required: true,
              options: [
                { label: 'Status', value: 'status' },
                { label: 'Tags', value: 'tags' },
                { label: 'Currency', value: 'currency' },
                { label: 'Order Note', value: 'order_note' }
              ]
            },
            {
              name: 'value',
              type: 'string',
              label: 'Value',
              description: 'New value for the selected field',
              required: true
            }
          ]
        }
      }
    ]
  },
  {
    key: 'line_items',
    label: 'Line Items',
    description: 'Manage line items',
    actions: [
      {
        label: 'Add Line Item',
        value: 'add_line_item',
        description: 'Add new line item',
        config: {
          fields: [
            {
              name: 'sku',
              type: 'string',
              label: 'SKU',
              description: 'Product SKU',
              required: true
            },
            {
              name: 'quantity',
              type: 'number',
              label: 'Quantity',
              description: 'Item quantity',
              required: true,
              min: 1
            },
            {
              name: 'price',
              type: 'number',
              label: 'Price',
              description: 'Item price',
              required: true,
              min: 0
            },
            {
              name: 'name',
              type: 'string',
              label: 'Name',
              description: 'Item name',
              required: true
            },
            {
              name: 'tax_code',
              type: 'string',
              label: 'Tax Code',
              description: 'Item tax code',
              required: false
            }
          ]
        }
      },
      {
        label: 'Update Line Item',
        value: 'update_line_item',
        description: 'Update existing line item',
        config: {
          fields: [
            {
              name: 'selector',
              type: 'object',
              label: 'Item Selector',
              description: 'Select items to update',
              required: true,
              fields: [
                {
                  name: 'type',
                  type: 'enum',
                  label: 'Selection Type',
                  description: 'How to select items',
                  required: true,
                  options: [
                    { label: 'SKU', value: 'sku' },
                    { label: 'Line Item ID', value: 'line_item_id' }
                  ]
                },
                {
                  name: 'value',
                  type: 'string',
                  label: 'Selection Value',
                  description: 'Value to match',
                  required: true
                }
              ]
            },
            {
              name: 'updates',
              type: 'object',
              label: 'Updates',
              description: 'Fields to update',
              required: true,
              fields: [
                {
                  name: 'item_uom',
                  type: 'enum',
                  label: 'Unit of Measure',
                  description: 'Item unit of measure',
                  required: false,
                  options: [
                    { label: 'Each', value: 'EA' },
                    { label: 'Case', value: 'CS' },
                    { label: 'Pallet', value: 'PLT' }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    key: 'order_hold',
    label: 'Hold Order',
    description: 'Place order on hold',
    actions: [
      {
        label: 'Hold Order',
        value: 'hold_order',
        description: 'Place order on hold status',
        config: {
          fields: [
            {
              name: 'hold_minutes',
              type: 'number',
              label: 'Hold Duration (Minutes)',
              description: 'Duration to hold the order',
              required: true,
              min: 1
            },
            {
              name: 'hold_by_business_hour',
              type: 'boolean',
              label: 'Use Business Hours',
              description: 'Calculate duration using business hours only',
              required: true
            },
            {
              name: 'hold_scope',
              type: 'enum',
              label: 'Hold Scope',
              description: 'What to place on hold',
              required: true,
              options: [
                { label: 'Entire Order', value: 'whole_order' },
                { label: 'Specific Items', value: 'specific_items' }
              ]
            },
            {
              name: 'next_status_after_hold',
              type: 'enum',
              label: 'Next Status',
              description: 'Status after hold expires',
              required: true,
              options: [
                { label: 'Review Required', value: 'review_required' },
                { label: 'Pending', value: 'pending' }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    key: 'warehouse',
    label: 'Warehouse Assignment',
    description: 'Manage warehouse assignments',
    actions: [
      {
        label: 'Override Warehouse',
        value: 'override_warehouse',
        description: 'Force assign to specific warehouse',
        config: {
          fields: [
            {
              name: 'warehouse',
              type: 'enum',
              label: 'Warehouse',
              description: 'Target warehouse',
              required: true,
              options: [
                { label: 'Main Warehouse', value: 'WH001' },
                { label: 'East DC', value: 'WH002' },
                { label: 'West DC', value: 'WH003' }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    key: 'exception',
    label: 'Exception',
    description: 'Handle order exceptions',
    actions: [
      {
        label: 'Create Exception',
        value: 'create_exception',
        description: 'Create order exception',
        config: {
          fields: [
            {
              name: 'exception_type',
              type: 'enum',
              label: 'Exception Type',
              description: 'Type of exception',
              required: true,
              options: [
                { label: 'Out of Stock', value: 'out_of_stock' },
                { label: 'Invalid Address', value: 'invalid_address' },
                { label: 'Payment Issue', value: 'payment_issue' },
                { label: 'System Error', value: 'system_error' }
              ]
            },
            {
              name: 'exception_note',
              type: 'string',
              label: 'Exception Note',
              description: 'Additional details about the exception',
              required: false
            }
          ]
        }
      }
    ]
  },
  {
    key: 'inventory',
    label: 'Inventory Check',
    description: 'Check product inventory and take corresponding actions',
    actions: [
      {
        label: 'Hold Order on Low Stock',
        value: 'check_inventory_hold',
        description: 'Check order items inventory and put order on hold if stock is insufficient',
        config: {
          fields: [
            {
              name: 'hold_type',
              type: 'enum',
              label: 'Hold Type',
              description: 'Choose whether to hold the entire order or only items with insufficient stock',
              required: true,
              options: [
                { 
                  label: 'Hold Entire Order', 
                  value: 'entire_order',
                  description: 'Put the entire order on hold when any item is out of stock'
                },
                { 
                  label: 'Hold Items Only', 
                  value: 'items_only',
                  description: 'Only hold items that are out of stock, allow fulfillment of other items'
                }
              ]
            },
            {
              name: 'auto_release',
              type: 'boolean',
              label: 'Auto Release',
              description: 'Automatically release hold when inventory becomes sufficient',
              required: true,
              default: true
            }
          ]
        }
      }
    ]
  },
  {
    key: 'order_close',
    label: 'Order Close',
    description: 'Mark order as closed',
    actions: [
      {
        label: 'Close Order',
        value: 'close_order',
        description: 'Update order status to closed',
        config: {
          fields: [
            {
              name: 'close_reason',
              type: 'enum',
              label: 'Close Reason',
              description: 'Select reason for closing the order',
              required: true,
              options: [
                { label: 'No Fulfillment Needed', value: 'no_fulfillment_needed' },
                { label: 'Customer Cancelled', value: 'customer_cancelled' },
                { label: 'System Auto Close', value: 'system_auto_close' }
              ]
            },
            {
              name: 'close_note',
              type: 'string',
              label: 'Close Note',
              description: 'Add note when closing the order',
              required: false
            }
          ]
        }
      }
    ]
  },
  {
    key: 'order_merge',
    label: 'Order Merge',
    description: 'Automatically merge orders based on conditions',
    actions: [
      {
        label: 'Merge Orders (SO Level)',
        value: 'merge_orders_so',
        description: 'Merge at Sales Order level before warehouse allocation',
        config: {
          fields: [
            {
              name: 'priority_field',
              type: 'enum',
              label: 'Primary Order Selection',
              description: 'Which order\'s data to use as primary',
              required: true,
              default: 'earliest',
              options: [
                { label: 'Earliest Order', value: 'earliest' },
                { label: 'Latest Order', value: 'latest' },
                { label: 'Highest Value', value: 'highest_value' }
              ]
            },
            {
              name: 'allocation_strategy',
              type: 'enum',
              label: 'Allocation Strategy',
              description: 'How to allocate fulfilled quantity when DC ships less than ordered',
              required: true,
              default: 'PRIORITY_BASED',
              options: [
                { 
                  label: 'Priority-Based', 
                  value: 'PRIORITY_BASED',
                  description: 'Allocate by priority (earliest order first)'
                },
                { 
                  label: 'Complete Orders First', 
                  value: 'COMPLETE_FIRST',
                  description: 'Fulfill complete orders first, then split partial'
                }
              ]
            },
            {
              name: 'shipment_sync_timing',
              type: 'enum',
              label: 'Shipment Sync Timing',
              description: 'When to report shipment to sales channel',
              required: true,
              default: 'WAIT_UNTIL_FULLY_SHIPPED',
              options: [
                { 
                  label: 'Wait Until Fully Shipped', 
                  value: 'WAIT_UNTIL_FULLY_SHIPPED',
                  description: 'Report shipment only after all items are shipped'
                },
                { 
                  label: 'Immediate on Partial', 
                  value: 'IMMEDIATE_ON_PARTIAL',
                  description: 'Report immediately when any partial shipment occurs'
                }
              ]
            }
          ]
        }
      },
      {
        label: 'Merge Orders (DN Level)',
        value: 'merge_orders_dn',
        description: 'Merge at Delivery Note level after warehouse allocation',
        config: {
          fields: [
            {
              name: 'priority_field',
              type: 'enum',
              label: 'Primary Order Selection',
              description: 'Which order\'s data to use as primary',
              required: true,
              default: 'earliest',
              options: [
                { label: 'Earliest Order', value: 'earliest' },
                { label: 'Latest Order', value: 'latest' },
                { label: 'Highest Value', value: 'highest_value' }
              ]
            },
            {
              name: 'allocation_strategy',
              type: 'enum',
              label: 'Allocation Strategy',
              description: 'How to allocate fulfilled quantity when DC ships less than ordered',
              required: true,
              default: 'PRIORITY_BASED',
              options: [
                { 
                  label: 'Priority-Based', 
                  value: 'PRIORITY_BASED',
                  description: 'Allocate by priority (earliest order first)'
                },
                { 
                  label: 'Complete Orders First', 
                  value: 'COMPLETE_FIRST',
                  description: 'Fulfill complete orders first, then split partial'
                }
              ]
            },
            {
              name: 'shipment_sync_timing',
              type: 'enum',
              label: 'Shipment Sync Timing',
              description: 'When to report shipment to sales channel',
              required: true,
              default: 'WAIT_UNTIL_FULLY_SHIPPED',
              options: [
                { 
                  label: 'Wait Until Fully Shipped', 
                  value: 'WAIT_UNTIL_FULLY_SHIPPED',
                  description: 'Report shipment only after all items are shipped'
                },
                { 
                  label: 'Immediate on Partial', 
                  value: 'IMMEDIATE_ON_PARTIAL',
                  description: 'Report immediately when any partial shipment occurs'
                }
              ]
            }
          ]
        }
      }
    ]
  }
] 