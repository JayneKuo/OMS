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
    modifiedBy: 'system'
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
    modifiedBy: 'system'
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
    modifiedBy: 'system'
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
    modifiedBy: 'admin'
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
    modifiedBy: 'admin'
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