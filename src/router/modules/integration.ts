import { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/integration',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/integration/connections'
      },
      {
        path: 'connections',
        name: 'Connections',
        component: () => import('@/views/integration/connections/index.vue'),
        meta: {
          title: 'Integrations',
          icon: 'Connection'
        }
      },
      {
        path: 'connections/:id',
        name: 'ConnectionDetail',
        component: () => import('@/views/integration/connections/detail.vue'),
        meta: {
          title: 'Integration Detail',
          hidden: true
        }
      }
    ]
  }
]

export default routes 