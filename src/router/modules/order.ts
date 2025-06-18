import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/order',
    name: 'Order',
    redirect: '/order/sales',
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
      }
    ]
  }
]

export default routes 