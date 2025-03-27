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
  Goods
} from '@element-plus/icons-vue'

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
      }
    ]
  }
] 