import type { Rule } from '../types/automation'

export const mockRules: Rule[] = [
  {
    id: 1,
    name: 'High Value Order Priority',
    description: 'When order total is over $1000, set high priority and add VIP tag',
    enabled: true,
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