import {
  Location,
  Document,
  Ship,
  Files,
  ShoppingCart
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
  }
] 