import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      // Temporarily commented out until the component is created
      // {
      //   path: 'list',
      //   name: 'EventList',
      //   component: () => import('@/views/events/list/index.vue'),
      //   meta: {
      //     title: 'Event List'
      //   }
      // },
      {
        path: 'rules',
        name: 'EventRules',
        component: () => import('@/views/events/rules/index.vue'),
        meta: {
          title: 'Event Rules'
        }
      },
      {
        path: 'logs',
        name: 'EventLogs',
        component: () => import('@/views/events/logs/index.vue'),
        meta: {
          title: 'Event Logs'
        }
      },
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