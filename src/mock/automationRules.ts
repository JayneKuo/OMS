import type { Rule } from '../types/automation'

export const mockRules: Rule[] = [
  {
    id: 1,
    name: 'High Value Order Priority',
    description: 'When order total is over $1000, set high priority and add VIP tag',
    enabled: true,
    order: 1,
    conditions: [
      {
        operator: 'all',
        enabled: true,
        conditions: [
          {
            field: 'total_price',
            operator: 'gt',
            value: 1000
          }
        ]
      }
    ],
    actions: [
      {
        type: 'update_oms',
        config: {
          status: 'processing',
          priority: 'high'
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-03-15 10:30:00',
    createdBy: 'system',
    modifiedBy: 'system',
    source: 'simple'
  },
  {
    id: 2,
    name: 'Out of Stock Hold',
    description: 'Check inventory and hold order if out of stock',
    enabled: true,
    order: 2,
    conditions: [
      {
        operator: 'all',
        enabled: true,
        conditions: [
          {
            field: 'oms_status',
            operator: 'eq',
            value: 'new'
          }
        ]
      }
    ],
    actions: [
      {
        type: 'hold_order',
        config: {
          reason: 'inventory_check',
          note: 'Checking inventory availability'
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-03-15 11:20:00',
    createdBy: 'system',
    modifiedBy: 'system',
    source: 'simple'
  },
  {
    id: 3,
    name: 'International Order Routing',
    description: 'Route international orders to specific warehouse',
    enabled: true,
    order: 3,
    conditions: [
      {
        operator: 'any',
        enabled: true,
        conditions: [
          {
            field: 'shipping_country',
            operator: 'neq',
            value: 'US'
          }
        ]
      }
    ],
    actions: [
      {
        type: 'update_oms',
        config: {
          warehouse_code: 'INTL_01',
          note: 'International order auto-routing'
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-03-15 14:15:00',
    createdBy: 'system',
    modifiedBy: 'system',
    source: 'simple'
  },
  {
    id: 4,
    name: 'Auto Merge Same Customer Orders - SO Level',
    description: 'Automatically merge orders from the same customer at Sales Order level',
    enabled: true,
    order: 4,
    conditions: [
      {
        operator: 'all',
        enabled: true,
        conditions: [
          {
            field: 'financial_status',
            operator: 'eq',
            value: 'paid'
          },
          {
            field: 'status',
            operator: 'eq',
            value: 'open'
          }
        ]
      }
    ],
    actions: [
      {
        type: 'merge_orders',
        config: {
          merge_node: 'so',
          match_customer: true,
          match_shipping_address: true,
          match_warehouse: false,
          match_shipping_method: false,
          time_window_enabled: true,
          time_window_minutes: 60,
          max_orders: 5,
          priority_field: 'earliest',
          trigger_mode: 'immediate',
          notify_on_merge: true
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-03-20 10:30:00',
    createdBy: 'admin',
    modifiedBy: 'admin',
    source: 'simple'
  },
  {
    id: 5,
    name: 'Scheduled Merge at DN Level',
    description: 'Merge orders at delivery note level every 30 minutes',
    enabled: true,
    order: 5,
    conditions: [
      {
        operator: 'all',
        enabled: true,
        conditions: [
          {
            field: 'status',
            operator: 'eq',
            value: 'open'
          }
        ]
      }
    ],
    actions: [
      {
        type: 'merge_orders',
        config: {
          merge_node: 'dn',
          match_customer: true,
          match_shipping_address: true,
          match_warehouse: true,
          match_shipping_method: true,
          time_window_enabled: true,
          time_window_minutes: 120,
          max_orders: 3,
          max_items: 50,
          priority_field: 'highest_value',
          trigger_mode: 'scheduled',
          schedule_interval: 30,
          notify_on_merge: true
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-03-20 11:45:00',
    createdBy: 'admin',
    modifiedBy: 'admin',
    source: 'simple'
  },
  {
    id: 6,
    name: 'B2C Parcel - No Contract Rate',
    description: 'Request quotes for B2C orders without contract rates',
    enabled: true,
    order: 6,
    conditions: [
      {
        operator: 'all',
        enabled: true,
        conditions: [
          {
            field: 'status',
            operator: 'eq',
            value: 'open'
          },
          {
            field: 'customer_type',
            operator: 'eq',
            value: 'B2C'
          },
          {
            field: 'has_contract_rate',
            operator: 'eq',
            value: false
          },
          {
            field: 'weight_lbs',
            operator: 'lt',
            value: 150
          }
        ]
      }
    ],
    actions: [
      {
        type: 'request_shipping_rate',
        config: {
          carriers: ['ups', 'fedex', 'usps'],
          service_types: ['ground', 'express', '2day'],
          package_dimensions: {
            length: 15,
            width: 12,
            height: 10
          },
          weight_config: {
            actual_weight: 8,
            use_dimensional_weight: true,
            dim_divisor: 139
          },
          shipping_mode: 'parcel',
          approval_threshold: 50,
          approval_workflow: {
            enabled: true,
            approvers: ['logistics_manager'],
            hold_order: true,
            notification_enabled: true
          }
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-10-31 14:30:00',
    createdBy: 'admin',
    modifiedBy: 'admin',
    source: 'simple'
  },
  {
    id: 7,
    name: 'B2B LTL - High Weight Threshold',
    description: 'Get LTL quotes for B2B orders exceeding weight threshold without assigned carrier',
    enabled: true,
    order: 7,
    conditions: [
      {
        operator: 'all',
        enabled: true,
        conditions: [
          {
            field: 'status',
            operator: 'eq',
            value: 'open'
          },
          {
            field: 'customer_type',
            operator: 'eq',
            value: 'B2B'
          },
          {
            field: 'weight_lbs',
            operator: 'gt',
            value: 150
          },
          {
            field: 'assigned_carrier',
            operator: 'eq',
            value: ''
          }
        ]
      }
    ],
    actions: [
      {
        type: 'request_shipping_rate',
        config: {
          carriers: ['ups', 'fedex'],
          service_types: ['standard'],
          package_dimensions: {
            length: 48,
            width: 40,
            height: 48
          },
          weight_config: {
            actual_weight: 500,
            use_dimensional_weight: false,
            dim_divisor: 139
          },
          shipping_mode: 'ltl',
          freight_class: '85',
          pallet_count: 2,
          stackable: true,
          liftgate_required: false,
          approval_threshold: 200,
          approval_workflow: {
            enabled: true,
            approvers: ['logistics_manager', 'operations_director'],
            hold_order: true,
            notification_enabled: true
          }
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-10-31 15:00:00',
    createdBy: 'admin',
    modifiedBy: 'admin',
    source: 'simple'
  },
  {
    id: 8,
    name: 'Expedited Orders - Rush Quote',
    description: 'Immediate quote request for expedited/overnight service levels',
    enabled: true,
    order: 8,
    conditions: [
      {
        operator: 'any',
        enabled: true,
        conditions: [
          {
            field: 'ship_service_level',
            operator: 'eq',
            value: 'Expedited'
          },
          {
            field: 'ship_service_level',
            operator: 'eq',
            value: 'Overnight'
          },
          {
            field: 'priority_level',
            operator: 'eq',
            value: 'Rush'
          },
          {
            field: 'lead_time_days',
            operator: 'lt',
            value: 1
          }
        ]
      }
    ],
    actions: [
      {
        type: 'request_shipping_rate',
        config: {
          carriers: ['ups', 'fedex', 'dhl'],
          service_types: ['express', 'overnight', '2day'],
          package_dimensions: {
            length: 12,
            width: 12,
            height: 12
          },
          weight_config: {
            actual_weight: 10,
            use_dimensional_weight: true,
            dim_divisor: 139
          },
          shipping_mode: 'parcel',
          approval_threshold: 100,
          approval_workflow: {
            enabled: true,
            approvers: ['logistics_manager', 'operations_director'],
            hold_order: true,
            notification_enabled: true
          }
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-10-31 15:30:00',
    createdBy: 'admin',
    modifiedBy: 'admin',
    source: 'simple'
  },
  {
    id: 9,
    name: 'Hazmat & Temperature Control',
    description: 'Special handling quote for hazmat or temperature-controlled shipments',
    enabled: true,
    order: 9,
    conditions: [
      {
        operator: 'any',
        enabled: true,
        conditions: [
          {
            field: 'hazmat_flag',
            operator: 'eq',
            value: true
          },
          {
            field: 'temperature_control',
            operator: 'eq',
            value: true
          }
        ]
      }
    ],
    actions: [
      {
        type: 'request_shipping_rate',
        config: {
          carriers: ['ups', 'fedex'],
          service_types: ['ground', 'express'],
          package_dimensions: {
            length: 18,
            width: 14,
            height: 12
          },
          weight_config: {
            actual_weight: 25,
            use_dimensional_weight: true,
            dim_divisor: 139
          },
          shipping_mode: 'parcel',
          approval_threshold: 75,
          approval_workflow: {
            enabled: true,
            approvers: ['logistics_manager', 'warehouse_manager'],
            hold_order: true,
            notification_enabled: true
          }
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-10-31 16:00:00',
    createdBy: 'admin',
    modifiedBy: 'admin',
    source: 'simple'
  },
  {
    id: 10,
    name: 'Long Distance Lane - Cost Verification',
    description: 'Quote verification for shipments over 1500 miles or specific high-cost lanes',
    enabled: true,
    order: 10,
    conditions: [
      {
        operator: 'any',
        enabled: true,
        conditions: [
          {
            field: 'distance_miles',
            operator: 'gt',
            value: 1500
          },
          {
            field: 'lane_code',
            operator: 'contains',
            value: 'CA→NY'
          },
          {
            field: 'estimated_freight_cost',
            operator: 'gt',
            value: 500
          }
        ]
      }
    ],
    actions: [
      {
        type: 'request_shipping_rate',
        config: {
          carriers: ['ups', 'fedex', 'usps'],
          service_types: ['ground', 'standard'],
          package_dimensions: {
            length: 20,
            width: 16,
            height: 14
          },
          weight_config: {
            actual_weight: 50,
            use_dimensional_weight: true,
            dim_divisor: 139
          },
          shipping_mode: 'parcel',
          approval_threshold: 150,
          approval_workflow: {
            enabled: true,
            approvers: ['logistics_manager', 'finance_manager'],
            hold_order: false,
            notification_enabled: true
          }
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-10-31 16:30:00',
    createdBy: 'admin',
    modifiedBy: 'admin',
    source: 'simple'
  },
  {
    id: 11,
    name: 'Budget Overrun Alert',
    description: 'Trigger quote when estimated cost exceeds budget threshold percentage',
    enabled: true,
    order: 11,
    conditions: [
      {
        operator: 'all',
        enabled: true,
        conditions: [
          {
            field: 'budget_threshold_percent',
            operator: 'gt',
            value: 10
          },
          {
            field: 'estimated_freight_cost',
            operator: 'gt',
            value: 200
          }
        ]
      }
    ],
    actions: [
      {
        type: 'request_shipping_rate',
        config: {
          carriers: ['ups', 'fedex', 'usps', 'ontrac'],
          service_types: ['ground', 'standard', 'economy'],
          package_dimensions: {
            length: 16,
            width: 12,
            height: 10
          },
          weight_config: {
            actual_weight: 15,
            use_dimensional_weight: true,
            dim_divisor: 139
          },
          shipping_mode: 'parcel',
          approval_threshold: 250,
          approval_workflow: {
            enabled: true,
            approvers: ['logistics_manager', 'finance_manager'],
            hold_order: true,
            notification_enabled: true
          }
        },
        order: 0,
        enabled: true
      }
    ],
    lastModified: '2024-10-31 17:00:00',
    createdBy: 'admin',
    modifiedBy: 'admin',
    source: 'simple'
  }
]

// Mock API response
export const mockResponse = {
  code: 200,
  message: 'success',
  data: mockRules,
  total: mockRules.length,
  page: 1,
  pageSize: 20
} 