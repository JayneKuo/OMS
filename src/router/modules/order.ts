import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/order',
    name: 'Order',
    redirect: '/order/sales',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'sales',
        name: 'OrderList',
        component: () => import('@/views/order/sales/index.vue'),
        meta: {
          title: '订单列表'
        }
      },
      {
        path: 'sales/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/sales/detail.vue'),
        meta: {
          title: '订单详情'
        }
      },
      {
        path: 'updates',
        name: 'OrderUpdateList',
        component: () => import('@/views/order/update/UpdateList.vue'),
        meta: {
          title: '订单更新记录'
        }
      },
      {
        path: 'log',
        name: 'OrderLog',
        component: () => import('@/views/order/log/index.vue'),
        meta: {
          title: 'Order Logs'
        }
      }
    ]
  },
  {
    path: '/return',
    name: 'Return',
    children: [
      {
        path: '',
        name: 'ReturnList',
        component: () => import('@/views/return/index.vue'),
        meta: {
          title: '退货单列表'
        }
      },
      {
        path: 'create',
        name: 'ReturnCreate',
        component: () => import('@/views/return/create.vue'),
        meta: {
          title: '创建退货单'
        }
      },
      {
        path: ':id',
        name: 'ReturnDetail',
        component: () => import('@/views/return/detail.vue'),
        meta: {
          title: '退货单详情'
        }
      }
    ]
  }
]

export default routes 