import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'sales-orders-new',
        name: 'SalesOrdersNew',
        component: () => import('@/views/order/sales-orders-new/index.vue'),
        meta: {
          title: 'Sales Orders New'
        }
      },
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
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      title: 'Warehouse Management'
    },
    children: [
      {
        path: 'inventory',
        name: 'WarehouseInventory',
        component: () => import('@/views/warehouse/inventory/index.vue'),
        meta: {
          title: 'Inventory Management'
        }
      },
      {
        path: 'inventory/:id',
        name: 'WarehouseInventoryDetail',
        component: () => import('@/views/warehouse/inventory/InventoryLedgerDetail.vue'),
        meta: {
          title: 'Inventory Detail'
        }
      }
    ]
  }
]

export default routes 