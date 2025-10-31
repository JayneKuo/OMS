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
  },
  {
    key: 'shipping_rate',
    label: 'Shipping Rate Info',
    description: '运价相关信息',
    fields: [
      {
        label: 'Has Contract Rate',
        value: 'has_contract_rate',
        type: 'boolean',
        description: '是否已有合同价，false时需要询价',
        supportedOperators: ['equals']
      },
      {
        label: 'Assigned Carrier',
        value: 'assigned_carrier',
        type: 'string',
        description: '当前是否已有承运商，为空时应触发询价',
        supportedOperators: ['equals', 'contains']
      },
      {
        label: 'Estimated Freight Cost',
        value: 'estimated_freight_cost',
        type: 'number',
        description: '预估运费金额，超过阈值时需重新询价',
        supportedOperators: ['greaterThan', 'lessThan']
      },
      {
        label: 'Budget Threshold Percent',
        value: 'budget_threshold_percent',
        type: 'number',
        description: '预算偏差百分比，超预算时触发询价',
        supportedOperators: ['greaterThan']
      },
      {
        label: 'Service Type',
        value: 'service_type',
        type: 'enum',
        description: '运输大类：FTL/LTL/Parcel',
        options: [
          { label: 'FTL (Full Truckload)', value: 'FTL' },
          { label: 'LTL (Less Than Truckload)', value: 'LTL' },
          { label: 'Parcel', value: 'Parcel' }
        ],
        supportedOperators: ['equals']
      },
      {
        label: 'Ship Method',
        value: 'ship_method',
        type: 'enum',
        description: '运输方式：Freight/Ground/Parcel/Air',
        options: [
          { label: 'Freight', value: 'Freight' },
          { label: 'Ground', value: 'Ground' },
          { label: 'Parcel', value: 'Parcel' },
          { label: 'Air', value: 'Air' }
        ],
        supportedOperators: ['equals']
      },
      {
        label: 'Ship Service',
        value: 'ship_service',
        type: 'string',
        description: '运输服务名称，如FedEx 2Day/UPS Ground',
        supportedOperators: ['equals', 'contains']
      },
      {
        label: 'Ship Service Level',
        value: 'ship_service_level',
        type: 'enum',
        description: '服务等级',
        options: [
          { label: 'Standard', value: 'Standard' },
          { label: 'Expedited', value: 'Expedited' },
          { label: 'Overnight', value: 'Overnight' }
        ],
        supportedOperators: ['equals']
      },
      {
        label: 'Ship Service Type',
        value: 'ship_service_type',
        type: 'enum',
        description: '收货地址类型',
        options: [
          { label: 'Residential', value: 'Residential' },
          { label: 'Commercial', value: 'Commercial' }
        ],
        supportedOperators: ['equals']
      }
    ]
  },
  {
    key: 'shipping_location',
    label: 'Shipping Location',
    description: '运输地点信息',
    fields: [
      {
        label: 'Origin State',
        value: 'origin_state',
        type: 'string',
        description: '起运地州代码，如CA',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Origin ZIP Code',
        value: 'origin_zip',
        type: 'string',
        description: '起运地邮编',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Destination State',
        value: 'destination_state',
        type: 'string',
        description: '目的地州代码，如TX',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Destination ZIP Code',
        value: 'destination_zip',
        type: 'string',
        description: '目的地邮编',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Lane Code',
        value: 'lane_code',
        type: 'string',
        description: '运输线路代码，如CA→TX',
        supportedOperators: ['equals', 'contains']
      },
      {
        label: 'Distance (Miles)',
        value: 'distance_miles',
        type: 'number',
        description: '运输里程，超长运输需询价',
        supportedOperators: ['greaterThan', 'lessThan']
      }
    ]
  },
  {
    key: 'shipping_specs',
    label: 'Shipping Specifications',
    description: '运输规格信息',
    fields: [
      {
        label: 'Weight (lbs)',
        value: 'weight_lbs',
        type: 'number',
        description: '重量（磅），超重时触发询价',
        supportedOperators: ['greaterThan', 'lessThan']
      },
      {
        label: 'Volume (CBM)',
        value: 'volume_cbm',
        type: 'number',
        description: '体积（立方米），大体积需询价',
        supportedOperators: ['greaterThan', 'lessThan']
      },
      {
        label: 'Pallet Count',
        value: 'pallet_count',
        type: 'number',
        description: '托盘数量，超指定数量时触发询价',
        supportedOperators: ['greaterThan', 'lessThan']
      },
      {
        label: 'Pickup Date',
        value: 'pickup_date',
        type: 'date',
        description: '计划提货日期',
        supportedOperators: ['greaterThan', 'lessThan']
      },
      {
        label: 'Lead Time (Days)',
        value: 'lead_time_days',
        type: 'number',
        description: '提前天数，小于1天触发加急询价',
        supportedOperators: ['greaterThan', 'lessThan']
      },
      {
        label: 'Priority Level',
        value: 'priority_level',
        type: 'enum',
        description: '订单优先级',
        options: [
          { label: 'Normal', value: 'Normal' },
          { label: 'Expedite', value: 'Expedite' },
          { label: 'Rush', value: 'Rush' }
        ],
        supportedOperators: ['equals']
      }
    ]
  },
  {
    key: 'customer_account',
    label: 'Customer & Account',
    description: '客户与账户信息',
    fields: [
      {
        label: 'Customer Type',
        value: 'customer_type',
        type: 'enum',
        description: '客户类型：B2B/B2C',
        options: [
          { label: 'B2B', value: 'B2B' },
          { label: 'B2C', value: 'B2C' }
        ],
        supportedOperators: ['equals']
      },
      {
        label: 'Customer Code',
        value: 'customer_code',
        type: 'string',
        description: '客户编码，某些客户可定义专属询价规则',
        supportedOperators: ['equals', 'startsWith']
      },
      {
        label: 'Account Type',
        value: 'account_type',
        type: 'enum',
        description: '结算模式',
        options: [
          { label: 'Prepaid', value: 'Prepaid' },
          { label: 'Collect', value: 'Collect' },
          { label: '3PL', value: '3PL' }
        ],
        supportedOperators: ['equals']
      }
    ]
  },
  {
    key: 'special_requirements',
    label: 'Special Requirements',
    description: '特殊要求',
    fields: [
      {
        label: 'Temperature Control',
        value: 'temperature_control',
        type: 'boolean',
        description: '是否冷链运输，需匹配具备冷藏条件的承运商',
        supportedOperators: ['equals']
      },
      {
        label: 'Hazmat Flag',
        value: 'hazmat_flag',
        type: 'boolean',
        description: '是否危化品，需具备危化资质的承运商',
        supportedOperators: ['equals']
      },
      {
        label: 'Insurance Required',
        value: 'insurance_required',
        type: 'boolean',
        description: '是否需要保险，保价货物可能触发高价确认',
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
    key: 'shipping_rate',
    label: 'Shipping Rate Quote',
    description: 'Get shipping rate quotes and trigger approval workflow',
    actions: [
      {
        label: 'Request Shipping Rate Quote',
        value: 'request_shipping_rate',
        description: 'Request shipping rate quote from carriers and trigger approval if price exceeds threshold',
        config: {
          fields: [
            // ===== 基础配置字段 =====
            {
              name: 'has_contract_rate',
              type: 'boolean',
              label: 'Has Contract Rate',
              description: 'Whether DN has matched contract rate. If No → trigger inquiry',
              required: false,
              default: false
            },
            {
              name: 'assigned_carrier',
              type: 'enum',
              label: 'Assigned Carrier',
              description: 'Current assigned carrier. If empty → trigger inquiry',
              required: false,
              options: [
                { label: 'Not Assigned', value: '' },
                { label: 'UPS', value: 'UPS' },
                { label: 'FedEx', value: 'FedEx' },
                { label: 'USPS', value: 'USPS' },
                { label: 'Echo', value: 'Echo' },
                { label: 'SWFT', value: 'SWFT' }
              ]
            },
            {
              name: 'ship_method',
              type: 'enum',
              label: 'Shipping Method',
              description: 'Shipping method for this order',
              required: true,
              default: 'Freight',
              options: [
                { label: 'Freight', value: 'Freight' },
                { label: 'Parcel', value: 'Parcel' },
                { label: 'Ground', value: 'Ground' },
                { label: 'Air', value: 'Air' },
                { label: 'Ocean', value: 'Ocean' },
                { label: 'Drayage', value: 'Drayage' }
              ]
            },
            {
              name: 'ship_service_level',
              type: 'enum',
              label: 'Service Level',
              description: 'Shipping speed level',
              required: true,
              default: 'Standard',
              options: [
                { label: 'Standard', value: 'Standard' },
                { label: 'Expedited', value: 'Expedited' },
                { label: '2-Day', value: '2Day' },
                { label: 'Overnight', value: 'Overnight' },
                { label: 'Same Day', value: 'SameDay' }
              ]
            },
            {
              name: 'service_type',
              type: 'enum',
              label: 'Service Type',
              description: 'Shipment type (FTL/LTL/Parcel)',
              required: true,
              default: 'LTL',
              options: [
                { label: 'FTL (Full Truckload)', value: 'FTL' },
                { label: 'LTL (Less Than Truckload)', value: 'LTL' },
                { label: 'Small Parcel', value: 'Small Parcel' }
              ]
            },
            {
              name: 'estimated_freight_cost',
              type: 'number',
              label: 'Estimated Freight Cost (USD)',
              description: 'Estimated freight cost. Trigger inquiry if exceeds threshold (default: $1000)',
              required: false,
              min: 0,
              default: 0
            },
            {
              name: 'weight_lbs',
              type: 'number',
              label: 'Total Weight (lbs)',
              description: 'Total weight of the shipment',
              required: true,
              min: 0,
              default: 100
            },
            {
              name: 'volume_cbm',
              type: 'number',
              label: 'Total Volume (CBM)',
              description: 'Total volume in cubic meters',
              required: false,
              min: 0,
              default: 1
            },
            {
              name: 'pallet_count_config',
              type: 'number',
              label: 'Pallet Count',
              description: 'Number of pallets in shipment',
              required: false,
              min: 0,
              default: 1
            },
            {
              name: 'priority_level',
              type: 'enum',
              label: 'Priority Level',
              description: 'Order priority level',
              required: true,
              default: 'Normal',
              options: [
                { label: 'Normal', value: 'Normal' },
                { label: 'Expedite', value: 'Expedite' },
                { label: 'Urgent', value: 'Urgent' }
              ]
            },
            {
              name: 'customer_code',
              type: 'string',
              label: 'Customer Code',
              description: 'Customer code for special customer rules (e.g., TCL_US)',
              required: false
            },
            {
              name: 'account_type',
              type: 'enum',
              label: 'Account Type',
              description: 'Freight payment party',
              required: true,
              default: 'Prepaid',
              options: [
                { label: 'Prepaid (Shipper Pays)', value: 'Prepaid' },
                { label: 'Collect (Consignee Pays)', value: 'Collect' },
                { label: '3PL (Third Party)', value: '3PL' }
              ]
            },
            {
              name: 'ship_from',
              type: 'enum',
              label: 'Ship From (State)',
              description: 'Origin state or region',
              required: false,
              options: [
                { label: 'California (CA)', value: 'CA' },
                { label: 'Texas (TX)', value: 'TX' },
                { label: 'New Jersey (NJ)', value: 'NJ' },
                { label: 'Florida (FL)', value: 'FL' },
                { label: 'Illinois (IL)', value: 'IL' },
                { label: 'Georgia (GA)', value: 'GA' },
                { label: 'Pennsylvania (PA)', value: 'PA' },
                { label: 'Ohio (OH)', value: 'OH' }
              ]
            },
            {
              name: 'ship_to',
              type: 'enum',
              label: 'Ship To (State)',
              description: 'Destination state or region',
              required: false,
              options: [
                { label: 'California (CA)', value: 'CA' },
                { label: 'Texas (TX)', value: 'TX' },
                { label: 'New York (NY)', value: 'NY' },
                { label: 'Illinois (IL)', value: 'IL' },
                { label: 'Florida (FL)', value: 'FL' },
                { label: 'Washington (WA)', value: 'WA' },
                { label: 'Massachusetts (MA)', value: 'MA' },
                { label: 'Arizona (AZ)', value: 'AZ' }
              ]
            },
            {
              name: 'hazmat_flag',
              type: 'boolean',
              label: 'Hazmat Flag',
              description: 'Is this a hazardous material shipment? Requires special carrier',
              required: false,
              default: false
            },
            // ===== 承运商池配置 =====
            {
              name: 'carrier_pool',
              type: 'array',
              label: 'Carrier Pool',
              description: 'Select carriers to participate in rate inquiry',
              required: true,
              options: [
                { label: 'UPS', value: 'UPS' },
                { label: 'FedEx', value: 'FedEx' },
                { label: 'USPS', value: 'USPS' },
                { label: 'DHL', value: 'DHL' },
                { label: 'OnTrac', value: 'OnTrac' },
                { label: 'LaserShip', value: 'LaserShip' },
                { label: 'Echo', value: 'Echo' },
                { label: 'SWFT', value: 'SWFT' }
              ]
            },
            {
              name: 'service_types',
              type: 'array',
              label: 'Service Types',
              description: 'Limit shipping service categories',
              required: true,
              options: [
                { label: 'Ground', value: 'Ground' },
                { label: 'Express', value: 'Express' },
                { label: '2-Day', value: '2Day' },
                { label: 'Overnight', value: 'Overnight' },
                { label: 'Standard', value: 'Standard' },
                { label: 'Economy', value: 'Economy' },
                { label: 'FTL', value: 'FTL' },
                { label: 'LTL', value: 'LTL' }
              ]
            },
            {
              name: 'inquiry_method',
              type: 'enum',
              label: 'Inquiry Method',
              description: 'Method to request carrier rates',
              required: true,
              default: 'API',
              options: [
                { label: 'API (Real-time)', value: 'API', description: 'Call carrier API for real-time rates' },
                { label: 'Email', value: 'Email', description: 'Send email inquiry to carrier' },
                { label: 'Mock (Testing)', value: 'Mock', description: 'Use internal mock rates for testing' }
              ]
            },
            {
              name: 'timeout_min',
              type: 'number',
              label: 'Timeout (Minutes)',
              description: 'Carrier response timeout threshold',
              required: true,
              min: 1,
              max: 120,
              default: 60
            },
            {
              name: 'max_carrier_count',
              type: 'number',
              label: 'Max Carrier Count',
              description: 'Limit simultaneous carrier inquiries',
              required: false,
              min: 1,
              max: 10,
              default: 5
            },
            {
              name: 'package_dimensions',
              type: 'object',
              label: 'Package Dimensions',
              description: 'Configure package dimensions',
              required: true,
              fields: [
                {
                  name: 'length',
                  type: 'number',
                  label: 'Length (inches)',
                  description: 'Package length',
                  required: true,
                  min: 0,
                  default: 12
                },
                {
                  name: 'width',
                  type: 'number',
                  label: 'Width (inches)',
                  description: 'Package width',
                  required: true,
                  min: 0,
                  default: 12
                },
                {
                  name: 'height',
                  type: 'number',
                  label: 'Height (inches)',
                  description: 'Package height',
                  required: true,
                  min: 0,
                  default: 12
                }
              ]
            },
            {
              name: 'weight_config',
              type: 'object',
              label: 'Weight Configuration',
              description: 'Configure package weight',
              required: true,
              fields: [
                {
                  name: 'actual_weight',
                  type: 'number',
                  label: 'Actual Weight (lbs)',
                  description: 'Actual package weight',
                  required: true,
                  min: 0,
                  default: 5
                },
                {
                  name: 'use_dimensional_weight',
                  type: 'boolean',
                  label: 'Use Dimensional Weight',
                  description: 'Calculate and use dimensional weight if greater than actual weight',
                  required: true,
                  default: true
                },
                {
                  name: 'dim_divisor',
                  type: 'number',
                  label: 'Dimensional Divisor',
                  description: 'Divisor for dimensional weight calculation (L×W×H÷divisor)',
                  required: false,
                  min: 1,
                  default: 139
                }
              ]
            },
            {
              name: 'shipping_mode',
              type: 'enum',
              label: 'Shipping Mode',
              description: 'Select shipping mode based on package size and weight',
              required: true,
              default: 'parcel',
              options: [
                { 
                  label: 'Parcel (Small Package)', 
                  value: 'parcel',
                  description: 'For packages under 150 lbs, typical e-commerce shipments'
                },
                { 
                  label: 'LTL (Less Than Truckload)', 
                  value: 'ltl',
                  description: 'For freight 150-15,000 lbs, palletized shipments'
                },
                { 
                  label: 'FTL (Full Truckload)', 
                  value: 'ftl',
                  description: 'For freight over 15,000 lbs or 10+ pallets'
                }
              ]
            },
            {
              name: 'freight_class',
              type: 'enum',
              label: 'Freight Class (LTL Only)',
              description: 'NMFC freight class for LTL shipments',
              required: false,
              options: [
                { label: 'Class 50 - Clean freight', value: '50' },
                { label: 'Class 55 - Bricks, cement', value: '55' },
                { label: 'Class 60 - Car parts', value: '60' },
                { label: 'Class 65 - Bottled beverages', value: '65' },
                { label: 'Class 70 - Food items', value: '70' },
                { label: 'Class 77.5 - Tires', value: '77.5' },
                { label: 'Class 85 - Crated machinery', value: '85' },
                { label: 'Class 92.5 - Computers', value: '92.5' },
                { label: 'Class 100 - Boat covers', value: '100' },
                { label: 'Class 110 - Cabinets', value: '110' },
                { label: 'Class 125 - Small appliances', value: '125' },
                { label: 'Class 150 - Auto parts', value: '150' },
                { label: 'Class 175 - Clothing', value: '175' },
                { label: 'Class 200 - Auto sheet metal', value: '200' },
                { label: 'Class 250 - Bamboo furniture', value: '250' },
                { label: 'Class 300 - Wood cabinets', value: '300' },
                { label: 'Class 400 - Deer antlers', value: '400' },
                { label: 'Class 500 - Bags of gold dust', value: '500' }
              ]
            },
            {
              name: 'pallet_count',
              type: 'number',
              label: 'Pallet Count (LTL/FTL)',
              description: 'Number of pallets for freight shipments',
              required: false,
              min: 0,
              default: 1
            },
            {
              name: 'stackable',
              type: 'boolean',
              label: 'Stackable (LTL/FTL)',
              description: 'Can pallets be stacked',
              required: false,
              default: true
            },
            {
              name: 'liftgate_required',
              type: 'boolean',
              label: 'Liftgate Required (LTL/FTL)',
              description: 'Delivery location requires liftgate service',
              required: false,
              default: false
            },
            {
              name: 'auto_select_carrier',
              type: 'boolean',
              label: 'Auto Select Lowest Rate Carrier',
              description: 'Automatically select the carrier with lowest rate',
              required: true,
              default: true
            },
            {
              name: 'auto_assign_shipment',
              type: 'boolean',
              label: 'Auto Generate Shipment',
              description: 'Automatically assign carrier after successful quote',
              required: true,
              default: true
            },
            {
              name: 'save_rate_result',
              type: 'boolean',
              label: 'Save Rate Results',
              description: 'Save carrier rate responses to database',
              required: true,
              default: true
            },
            {
              name: 'generate_quote_id',
              type: 'boolean',
              label: 'Generate Quote ID',
              description: 'Generate unique ID for each inquiry',
              required: true,
              default: true
            },
            {
              name: 'require_approval_if_cost_gt',
              type: 'number',
              label: 'Require Approval If Cost >',
              description: 'Require manual approval if cost exceeds this amount',
              required: true,
              min: 0,
              default: 2000
            },
            {
              name: 'approval_roles',
              type: 'array',
              label: 'Approval Roles',
              description: 'Roles responsible for approving over-budget quotes',
              required: false,
              options: [
                { label: 'Transportation Manager', value: 'transportation_manager' },
                { label: 'Warehouse Manager', value: 'warehouse_manager' },
                { label: 'Logistics Manager', value: 'logistics_manager' },
                { label: 'Operations Director', value: 'operations_director' },
                { label: 'Finance Manager', value: 'finance_manager' }
              ]
            },
            {
              name: 'auto_requote_on_timeout',
              type: 'boolean',
              label: 'Auto Requote on Timeout',
              description: 'Automatically retry inquiry if carrier does not respond',
              required: true,
              default: true
            },
            {
              name: 'fallback_carrier',
              type: 'enum',
              label: 'Fallback Carrier',
              description: 'Use this carrier if primary carriers do not respond',
              required: false,
              options: [
                { label: 'UPS', value: 'UPS' },
                { label: 'FedEx', value: 'FedEx' },
                { label: 'USPS', value: 'USPS' },
                { label: 'SWFT', value: 'SWFT' },
                { label: 'Echo', value: 'Echo' }
              ]
            },
            {
              name: 'notify_roles',
              type: 'array',
              label: 'Notify Roles',
              description: 'Notify dispatcher/operations team',
              required: false,
              options: [
                { label: 'Dispatcher', value: 'dispatcher' },
                { label: 'Operations', value: 'operations' },
                { label: 'Customer Service', value: 'customer_service' },
                { label: 'Warehouse', value: 'warehouse' }
              ]
            },
            {
              name: 'webhook_callback_url',
              type: 'string',
              label: 'Webhook Callback URL',
              description: 'URL to receive carrier rate results',
              required: false
            },
            {
              name: 'billing_mode',
              type: 'enum',
              label: 'Billing Mode',
              description: 'Define who pays for shipping',
              required: true,
              default: 'prepaid',
              options: [
                { label: 'Prepaid (Shipper Pays)', value: 'prepaid' },
                { label: 'Collect (Consignee Pays)', value: 'collect' },
                { label: '3PL (Third Party)', value: '3pl' }
              ]
            },
            {
              name: 'billing_account_source',
              type: 'enum',
              label: 'Billing Account Source',
              description: 'Where to get carrier billing account',
              required: true,
              default: 'customer',
              options: [
                { label: 'Customer Master Data', value: 'customer' },
                { label: 'System Default', value: 'system' }
              ]
            },
            {
              name: 'billing_account_default',
              type: 'string',
              label: 'Default Billing Account',
              description: 'System default account when customer account is missing',
              required: false,
              default: 'ITEM_DEFAULT_ACCOUNT'
            },
            {
              name: 'fallback_policy',
              type: 'enum',
              label: 'Account Missing Policy',
              description: 'Action when billing account is missing',
              required: true,
              default: 'use_default',
              options: [
                { label: 'Use Default Account', value: 'use_default' },
                { label: 'Skip This Carrier', value: 'skip' }
              ]
            },
            {
              name: 'charge_to_party',
              type: 'enum',
              label: 'Charge To Party',
              description: 'Who will be charged for freight',
              required: true,
              default: 'shipper',
              options: [
                { label: 'Shipper', value: 'shipper' },
                { label: 'Consignee', value: 'consignee' },
                { label: '3PL', value: '3pl' }
              ]
            },
            {
              name: 'validate_account',
              type: 'boolean',
              label: 'Validate Carrier Account',
              description: 'Validate carrier account before inquiry (MVP: disabled)',
              required: false,
              default: false
            },
            {
              name: 'update_status',
              type: 'string',
              label: 'Update Status To',
              description: 'Update OMS status after rate inquiry completes',
              required: false,
              default: 'rate_inquired'
            },
            {
              name: 'update_oms_status',
              type: 'boolean',
              label: 'Update OMS Status',
              description: 'Control whether to write results back to OMS',
              required: true,
              default: true
            },
            {
              name: 'log_inquiry_result',
              type: 'boolean',
              label: 'Log Inquiry Results',
              description: 'Save inquiry history to database',
              required: true,
              default: true
            },
            {
              name: 'log_table',
              type: 'string',
              label: 'Log Table Name',
              description: 'Database table for storing rate results',
              required: false,
              default: 'tms_rate_inquiry_log'
            },
            {
              name: 'generate_report',
              type: 'boolean',
              label: 'Generate Report',
              description: 'Generate rate comparison report (MVP: disabled)',
              required: false,
              default: false
            },
            {
              name: 'score_weighting',
              type: 'object',
              label: 'Score Weighting',
              description: 'Weighting for auto carrier selection',
              required: false,
              fields: [
                {
                  name: 'cost',
                  type: 'number',
                  label: 'Cost Weight',
                  description: 'Weight for cost factor (0-1)',
                  required: false,
                  min: 0,
                  max: 1,
                  default: 0.7
                },
                {
                  name: 'service',
                  type: 'number',
                  label: 'Service Weight',
                  description: 'Weight for service factor (0-1)',
                  required: false,
                  min: 0,
                  max: 1,
                  default: 0.3
                }
              ]
            },
            {
              name: 'response_validity_hours',
              type: 'number',
              label: 'Rate Validity (Hours)',
              description: 'How long the rate quote remains valid',
              required: false,
              min: 1,
              max: 168,
              default: 24
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