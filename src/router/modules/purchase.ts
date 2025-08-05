import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'tracking',
        name: 'PurchaseOrderTracking',
        component: () => import('@/views/purchase/tracking/index.vue'),
        meta: {
          title: 'Purchase Order Tracking'
        }
      },
      {
        path: 'tracking/:id',
        name: 'PurchaseOrderTrackingDetail',
        component: () => import('@/views/purchase/tracking/detail.vue'),
        meta: {
          title: 'Purchase Order Tracking Detail'
        }
      }
    ]
  }
]

export default routes 