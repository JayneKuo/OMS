import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'order-updates',
        name: 'OrderUpdateList',
        component: () => import('@/views/order/update/UpdateList.vue'),
        meta: {
          title: '订单更新记录'
        }
      },
      {
        path: 'order-logs',
        name: 'OrderLog',
        component: () => import('@/views/order/log/index.vue'),
        meta: {
          title: 'Order Logs'
        }
      }
    ]
  }
]

export default routes 