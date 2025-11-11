import type { MenuItem } from '@/types/menu'

export const menuConfig: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'Monitor'
  },
  {
    title: 'Orders',
    path: '/order',
    icon: 'ShoppingCart',
    children: [
      {
        title: 'Sales Orders New',
        path: '/order/sales-orders-new',
        icon: 'Document'
      },
      {
        title: 'Sales Order',
        path: '/order/sales',
        icon: 'Document'
      },
      {
        title: 'Shipping Request',
        path: '/order/shipping-request',
        icon: 'Van'
      },
      {
        title: 'Shipment',
        path: '/order/shipment',
        icon: 'Ship'
      },
      {
        title: 'Load',
        path: '/order/load',
        icon: 'Box'
      },
      {
        title: 'AI Order Tracking Assistant',
        path: '/order/ai-tracelink',
        icon: 'Connection'
      }
    ]
  },
  {
    title: 'Returns',
    path: '/return',
    icon: 'Box',
    children: [
      {
        title: 'Return Orders',
        path: '/return/order',
        icon: 'Document'
      }
    ]
  },
  {
    title: 'Purchase',
    path: '/purchase',
    icon: 'ShoppingBag',
    children: [
      {
        title: 'Purchase Orders',
        path: '/purchase/orders',
        icon: 'Document'
      },
      {
        title: 'Order Tracking',
        path: '/purchase/tracking',
        icon: 'Location'
      },
      {
        title: 'Transfer Orders',
        path: '/purchase/transfer',
        icon: 'Share'
      },
      {
        title: 'Arrivals',
        path: '/purchase/arrivals',
        icon: 'Van'
      },
      {
        title: 'Receipts',
        path: '/purchase/receipts',
        icon: 'Folder'
      }
    ]
  },
  {
    title: 'Logistics',
    path: '/logistics',
    icon: 'Van',
    children: [
      {
        title: 'Shipments',
        path: '/logistics/shipments',
        icon: 'Ship'
      },
      {
        title: 'Carriers',
        path: '/logistics/carriers',
        icon: 'Folder'
      },
      {
        title: 'Tracking',
        path: '/logistics/tracking',
        icon: 'Location'
      }
    ]
  },
  {
    title: 'Inventory',
    path: '/warehouse',
    icon: 'Box',
    children: [
      {
        title: 'Warehouse List',
        path: '/warehouse/list',
        icon: 'Folder'
      },
      {
        title: 'Inventory',
        path: '/warehouse/inventory',
        icon: 'Goods'
      },
      {
        title: 'Store Inventory',
        path: '/foundation-data/store-inventory',
        icon: 'ShoppingCart'
      },
      {
        title: 'Zipcode Range',
        path: '/warehouse/zipcode-range',
        icon: 'Location'
      },
      {
        title: 'Inventory',
        path: '/foundation-data/inventory',
        icon: 'Goods'
      }
    ]
  },
  {
    title: 'Product',
    path: '/product',
    icon: 'Goods',
    children: [
      {
        title: 'Product List',
        path: '/product/list',
        icon: 'Folder'
      },
      {
        title: 'Categories',
        path: '/product/category',
        icon: 'Menu'
      },
      {
        title: 'Brands',
        path: '/product/brand',
        icon: 'ShoppingBag'
      },
      {
        title: 'Channel Product',
        path: '/product/channel',
        icon: 'Connection',
        children: [
          {
            title: 'Shein Product List',
            path: '/product/channel/shein',
            icon: 'List'
          }
        ]
      }
    ]
  },
  {
    title: 'Events',
    path: '/events',
    icon: 'Calendar',
    children: [
      {
        title: 'Order Updates',
        path: '/events/order-updates',
        icon: 'Refresh'
      },
      {
        title: 'Order Logs',
        path: '/events/order-logs',
        icon: 'List'
      },
      {
        title: 'Exception Logs',
        path: '/settings/email-logs',
        meta: {
          activeMenu: '/events'
        },
        icon: 'List'
      },
      {
        title: 'Query Tool',
        path: '/foundation-data/query-tool',
        meta: {
          activeMenu: '/events'
        },
        icon: 'Search'
      }
    ]
  },
  {
    title: 'Integrations',
    icon: 'Connection',
    path: '/integration/connections'
  },
  {
    title: 'POM',
    path: '/customs',
    icon: 'Location',
    children: [
      {
        title: 'ISF',
        path: '/customs/isf',
        icon: 'Ship'
      },
      {
        title: 'T86',
        path: '/customs/t86',
        icon: 'Folder'
      },
      {
        title: 'Form 3461',
        path: '/customs/form3461',
        icon: 'Document'
      },
      {
        title: 'FTZ e-214',
        path: '/customs/ftze214',
        icon: 'Document'
      }
    ]
  },
  {
    title: 'Automation',
    path: '/settings',
    icon: 'Setting',
    children: [
      {
        title: 'Order Automations',
        path: '/settings/order-automations',
        icon: 'Operation'
      },
      {
        title: 'Rules',
        path: '/settings/automation',
        icon: 'Operation'
      },
      {
        title: 'Email Configuration',
        path: '/settings/email-config',
        icon: 'Message'
      },
      {
        title: 'Event Callback Routing',
        path: '/settings/event-callback',
        icon: 'Connection'
      },
      {
        title: 'Mapping',
        path: '/foundation-data/mapping',
        meta: {
          activeMenu: '/settings'
        },
        icon: 'Share'
      },
      {
        title: 'Inventory Sync Rules',
        path: '/foundation-data/inventory-sync-rule',
        meta: {
          activeMenu: '/settings'
        },
        icon: 'TrendCharts'
      },
      {
        title: 'Order Update Settings',
        path: '/foundation-data/order-update-control',
        meta: {
          activeMenu: '/settings'
        },
        icon: 'Edit'
      },
      {
        title: 'Safety Stock Settings',
        path: '/settings/safety-stock',
        icon: 'Warning'
      },
      {
        title: 'Rate Shopping',
        path: '/settings/rate-shipping',
        icon: 'Money',
        children: [
          {
            title: 'Rate Shopping',
            path: '/settings/rate-shipping/carrier-pricing-rules',
            icon: 'Money'
          },
          {
            title: 'Shipping Account',
            path: '/system-settings/shipping-account',
            icon: 'Van'
          }
        ]
      }
    ]
  },
  {
    title: 'Customer Management',
    path: '/customer',
    icon: 'List',
    children: [
      {
        title: 'Customer List',
        path: '/customer/list',
        icon: 'Folder'
      },
      {
        title: 'Customer Groups',
        path: '/customer/groups',
        icon: 'Grid'
      },
      {
        title: 'Customer Levels',
        path: '/customer/level',
        icon: 'TrendCharts'
      },
      {
        title: 'Customer Tags',
        path: '/customer/tags',
        icon: 'Operation'
      },
      {
        title: 'Customer Analytics',
        path: '/customer/analysis',
        icon: 'DataLine'
      },
      {
        title: 'Import/Export',
        path: '/customer/import-export',
        icon: 'Share'
      }
    ]
  },
  {
    title: 'Merchant Management',
    path: '/merchant',
    icon: 'ShoppingBag',
    children: [
      {
        title: 'Merchant List',
        path: '/merchant/list',
        icon: 'Folder'
      }
    ]
  }
]

export default menuConfig