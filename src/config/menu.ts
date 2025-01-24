import {
  Location,
  Document,
  Ship
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
        title: 'Form 3461',
        path: '/customs/form-3461',
        icon: Document
      }
    ]
  }
] 