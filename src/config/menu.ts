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
  Refresh
} from '@element-plus/icons-vue'
import { Menu } from '@/types/menu'

export interface MenuItem {
  title: string
  path: string
  icon?: any
  children?: MenuItem[]
}

export const menuConfig: MenuItem[] = [
  {
    title: 'Customs',
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
    title: 'Order',
    path: '/order',
    icon: ShoppingCart,
    children: [
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
      },
      {
        title: 'Order Updates',
        path: '/order/updates',
        icon: Refresh
      },
      {
        title: 'Order Logs',
        path: '/order/log',
        icon: List
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
    title: 'Settings',
    path: '/settings',
    icon: Setting,
    children: [
      {
        title: 'Automation',
        path: '/settings/automation',
        icon: Operation
      },
      {
        title: 'Email Configuration',
        path: '/settings/email-config',
        icon: Message
      },
      {
        title: 'Exception Logs',
        path: '/settings/email-logs',
        icon: List
      }
    ]
  },
  {
    title: 'Warehouse',
    path: '/warehouse',
    icon: Box,
    children: [
      {
        title: 'Warehouse List',
        path: '/warehouse/list',
        icon: Files
      },
      {
        title: 'Zipcode Range',
        path: '/warehouse/zipcode-range',
        icon: Location
      }
    ]
  },
  {
    title: 'Foundation Data',
    path: '/foundation-data',
    icon: Grid,
    children: [
      {
        title: 'Mapping',
        path: '/foundation-data/mapping',
        icon: Share
      },
      {
        title: 'Inventory',
        path: '/foundation-data/inventory',
        icon: Goods
      },
      {
        title: 'Store Inventory',
        path: '/foundation-data/store-inventory',
        icon: ShoppingCart
      },
      {
        title: 'Inventory Sync Rules',
        path: '/foundation-data/inventory-sync-rule',
        icon: TrendCharts
      },
      {
        title: 'Query Tool',
        path: '/foundation-data/query-tool',
        icon: Search
      },
      {
        title: 'Order Update Settings',
        path: '/foundation-data/order-update-control',
        icon: Edit
      }
    ]
  },
  {
    title: 'AI Knowledge Base',
    path: '/knowledge-base',
    icon: Files,
    children: [
      {
        title: 'Knowledge Center',
        path: '/knowledge-base/knowledge-center',
        icon: TrendCharts
      },
      {
        title: 'Knowledge Application',
        path: '/knowledge-base/knowledge-application',
        icon: Document
      }
    ]
  },
  {
    title: '数据报表',
    path: '/data-reports',
    icon: DataLine,
    children: [
      {
        title: '实时概览',
        path: '/data-reports/sales-forecast',
        icon: TrendCharts
      },
      {
        title: '销量预测',
        path: '/data-reports/sales-prediction',
        icon: Timer
      },
      {
        title: '滞销规则',
        path: '/data-reports/slow-moving-rules',
        icon: Warning
      }
    ]
  }
]

const menus: Menu[] = [
  {
    path: '/order',
    name: '订单管理',
    icon: 'ShoppingCart',
    children: [
      {
        path: '/order/sales',
        name: '订单列表'
      },
      {
        path: '/order/updates',
        name: '更新记录'
      }
    ]
  },
  {
    path: '/return',
    name: '退货管理',
    icon: 'RefreshLeft'
  },
  {
    path: '/customs',
    name: '报关管理',
    icon: 'Document',
    children: [
      {
        path: '/customs/form3461',
        name: 'Form 3461'
      },
      {
        path: '/customs/ftze214',
        name: 'FTZ e214'
      },
      {
        path: '/customs/isf',
        name: 'ISF'
      },
      {
        path: '/customs/t86',
        name: 'T86'
      }
    ]
  },
  {
    path: '/warehouse',
    name: '仓库管理',
    icon: 'House',
    children: [
      {
        path: '/warehouse/list',
        name: '仓库列表'
      },
      {
        path: '/warehouse/zipcode',
        name: '邮编范围'
      }
    ]
  },
  {
    path: '/settings',
    name: '系统设置',
    icon: 'Setting',
    children: [
      {
        path: '/settings/automation',
        name: '自动化规则'
      },
      {
        path: '/settings/email',
        name: '邮件配置'
      },
      {
        path: '/settings/logs',
        name: '邮件日志'
      }
    ]
  }
]

export default menus 