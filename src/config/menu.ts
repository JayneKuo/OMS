import {
  Location,
  Document,
  Ship,
  Files,
  ShoppingCart,
  Setting,
  Operation,
  Box,
  Grid,
  Share,
  Goods,
  TrendCharts,
  Message,
  List,
  Search,
  DataLine,
  Timer,
  Warning,
  Connection,
  Edit,
  Refresh,
  HomeFilled,
  Van,
  ShoppingBag,
  Calendar,
  Link,
  Monitor
} from '@element-plus/icons-vue'
import type { MenuItem } from '@/types/menu'

export const menuConfig: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: Monitor
  },
  {
    title: 'Orders',
    path: '/order',
    icon: ShoppingCart,
    children: [
      {
        title: 'Sales Orders New',
        path: '/order/sales-orders-new',
        icon: Document
      },
      {
        title: 'Sales Order',
        path: '/order/sales',
        icon: Document
      },
      {
        title: 'Shipment',
        path: '/order/shipment',
        icon: Ship
      },
      {
        title: 'AI Order Tracking Assistant',
        path: '/order/ai-tracelink',
        icon: Connection
      }
    ]
  },
  {
    title: 'Returns',
    path: '/return',
    icon: Box,
    children: [
      {
        title: 'Return Orders',
        path: '/return/order',
        icon: Document
      }
    ]
  },
  {
    title: 'Purchase',
    path: '/purchase',
    icon: ShoppingBag,
    children: [
      {
        title: 'Purchase Orders',
        path: '/purchase/orders',
        icon: Document
      },
      {
        title: 'Transfer Orders',
        path: '/purchase/transfer',
        icon: Share
      },
      {
        title: 'Arrivals',
        path: '/purchase/arrivals',
        icon: Van
      },
      {
        title: 'Receipts',
        path: '/purchase/receipts',
        icon: Files
      }
    ]
  },
  {
    title: 'Logistics',
    path: '/logistics',
    icon: Van,
    children: [
      {
        title: 'Shipments',
        path: '/logistics/shipments',
        icon: Ship
      },
      {
        title: 'Carriers',
        path: '/logistics/carriers',
        icon: Files
      },
      {
        title: 'Tracking',
        path: '/logistics/tracking',
        icon: Location
      }
    ]
  },
  {
    title: 'Inventory',
    path: '/warehouse',
    icon: Box,
    children: [
      {
        title: 'Warehouse List',
        path: '/warehouse/list',
        icon: Files
      },
      {
        title: 'Inventory',
        path: '/warehouse/inventory',
        icon: Goods
      },
      {
        title: 'Store Inventory',
        path: '/foundation-data/store-inventory',
        icon: ShoppingCart
      },
      {
        title: 'Zipcode Range',
        path: '/warehouse/zipcode-range',
        icon: Location
      },
      {
        title: 'Inventory',
        path: '/foundation-data/inventory',
        icon: Goods
      }
    ]
  },
  {
    title: 'Product',
    path: '/product',
    icon: Goods,
    children: [
      {
        title: 'Product List',
        path: '/product/list',
        icon: Files
      },
      {
        title: 'Categories',
        path: '/product/categories',
        icon: Grid
      },
      {
        title: 'Attributes',
        path: '/product/attributes',
        icon: List
      }
    ]
  },
  {
    title: 'Events',
    path: '/events',
    icon: Calendar,
    children: [
      {
        title: 'Order Updates',
        path: '/events/order-updates',
        icon: Refresh
      },
      {
        title: 'Order Logs',
        path: '/events/order-logs',
        icon: List
      },
      {
        title: 'Exception Logs',
        path: '/settings/email-logs',
        meta: {
          activeMenu: '/events'
        },
        icon: List
      },
      {
        title: 'Query Tool',
        path: '/foundation-data/query-tool',
        meta: {
          activeMenu: '/events'
        },
        icon: Search
      }
    ]
  },
  {
    title: 'Integrations',
    icon: Connection,
    path: '/integration/connections'
  },
  {
    title: 'POM',
    path: '/customs',
    icon: Location,
    children: [
      {
        title: 'ISF',
        path: '/customs/isf',
        icon: Ship
      },
      {
        title: 'T86',
        path: '/customs/t86',
        icon: Files
      },
      {
        title: 'Form 3461',
        path: '/customs/form3461',
        icon: Document
      },
      {
        title: 'FTZ e-214',
        path: '/customs/ftze214',
        icon: Document
      }
    ]
  },
  {
    title: 'Automation',
    path: '/settings',
    icon: Setting,
    children: [
      {
        title: 'Order Automations',
        path: '/settings/order-automations',
        icon: Operation
      },
      {
        title: 'Rules',
        path: '/settings/automation',
        icon: Operation
      },
      {
        title: 'Email Configuration',
        path: '/settings/email-config',
        icon: Message
      },
      {
        title: 'Event Callback Routing',
        path: '/settings/event-callback',
        icon: Connection
      },
      {
        title: 'Mapping',
        path: '/foundation-data/mapping',
        meta: {
          activeMenu: '/settings'
        },
        icon: Share
      },
      {
        title: 'Inventory Sync Rules',
        path: '/foundation-data/inventory-sync-rule',
        meta: {
          activeMenu: '/settings'
        },
        icon: TrendCharts
      },
      {
        title: 'Order Update Settings',
        path: '/foundation-data/order-update-control',
        meta: {
          activeMenu: '/settings'
        },
        icon: Edit
      }
    ]
  }
]

export default menuConfig 