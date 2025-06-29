import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/customs/isf',
    children: [
      {
        path: '/customs',
        name: 'Customs',
        component: () => import('@/layouts/RouterView.vue'),
        children: [
          {
            path: 'isf',
            name: 'ISF',
            component: () => import('@/views/customs/ISF/index.vue')
          },
          {
            path: 't86',
            name: 'T86',
            component: () => import('@/views/customs/T86/index.vue')
          },
          {
            path: 'ftze214',
            name: 'FTZe214',
            component: () => import('@/views/customs/FTZe214/index.vue')
          },
          {
            path: 'ftze214/create',
            name: 'CreateFTZe214',
            component: () => import('@/views/customs/FTZe214/edit.vue')
          },
          {
            path: 'ftze214/edit/:id',
            name: 'EditFTZe214',
            component: () => import('@/views/customs/FTZe214/edit.vue')
          },
          {
            path: 'ftze214/view/:id',
            name: 'ViewFTZe214',
            component: () => import('@/views/customs/FTZe214/edit.vue')
          },
          {
            path: 'ftze214/track/:id',
            name: 'TrackFTZe214',
            component: () => import('@/views/customs/FTZe214/track.vue')
          },
          {
            path: 'form3461',
            name: 'Form3461',
            component: () => import('@/views/customs/Form3461/index.vue')
          },
          {
            path: 'form3461/create',
            name: 'CreateForm3461',
            component: () => import('@/views/customs/Form3461/edit.vue')
          },
          {
            path: 'form3461/edit/:id',
            name: 'EditForm3461',
            component: () => import('@/views/customs/Form3461/edit.vue')
          },
          {
            path: 'form3461/view/:id',
            name: 'ViewForm3461',
            component: () => import('@/views/customs/Form3461/edit.vue')
          },
          {
            path: 'form3461/track/:id',
            name: 'TrackForm3461',
            component: () => import('@/views/customs/Form3461/track.vue')
          }
        ]
      },
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/layouts/RouterView.vue'),
        children: [
          {
            path: 'sales',
            name: 'SalesOrder',
            component: () => import('@/views/order/sales/index.vue')
          },
          {
            path: 'sales/:id',
            name: 'SalesOrderDetail',
            component: () => import('@/views/order/sales/detail.vue')
          },
          {
            path: 'shipment',
            name: 'Shipment',
            component: () => import('@/views/order/shipment/index.vue')
          },
          {
            path: 'shipment/:shipmentNo',
            name: 'ShipmentDetail',
            component: () => import('@/views/order/shipment/detail.vue')
          },
          {
            path: 'ai-tracelink',
            name: 'ai-tracelink',
            component: () => import('@/views/order/ai-tracelink/index.vue'),
            meta: {
              title: 'AI TraceLink',
              icon: 'Connection'
            }
          },
          {
            path: 'tracking/:id',
            name: 'OrderTracking',
            component: () => import('@/views/order/ai-tracelink/components/TrackingWrapper.vue'),
            meta: {
              title: '订单追踪',
              icon: 'Connection'
            }
          },
          {
            path: 'updates',
            name: 'OrderUpdates',
            component: () => import('@/views/order/update/UpdateList.vue'),
            meta: {
              title: '更新记录',
              icon: 'Refresh'
            }
          },
          {
            path: 'log',
            name: 'OrderLog',
            component: () => import('@/views/order/log/index.vue'),
            meta: {
              title: 'Order Logs',
              icon: 'List'
            }
          }
        ]
      },
      {
        path: '/return',
        name: 'Return',
        component: () => import('@/layouts/RouterView.vue'),
        meta: {
          title: 'Returns',
          icon: 'Return'
        },
        children: [
          {
            path: 'order',
            name: 'ReturnOrderList',
            component: () => import('@/views/return/index.vue')
          },
          {
            path: 'create',
            name: 'CreateReturnOrder',
            component: () => import('@/views/return/create.vue')
          },
          {
            path: ':id',
            name: 'ReturnOrderDetail',
            component: () => import('@/views/return/detail.vue')
          }
        ]
      },
      {
        path: '/settings',
        name: 'Settings',
        children: [
          {
            path: 'automation',
            name: 'Automation',
            component: () => import('@/views/settings/Automation.vue')
          },
          {
            path: 'email-config',
            name: 'EmailConfig',
            component: () => import('@/views/settings/EmailConfig.vue')
          },
          {
            path: 'email-logs',
            name: 'ExceptionLogs',
            component: () => import('@/views/settings/EmailLogs.vue')
          }
        ]
      },
      {
        path: '/warehouse',
        name: 'Warehouse',
        component: () => import('@/layouts/RouterView.vue'),
        children: [
          {
            path: 'list',
            name: 'WarehouseList',
            component: () => import('@/views/warehouse/WarehouseList.vue')
          },
          {
            path: 'zipcode-range',
            name: 'ZipcodeRange',
            component: () => import('@/views/warehouse/ZipcodeRange.vue')
          }
        ]
      },
      {
        path: '/foundation-data',
        name: 'FoundationData',
        component: () => import('@/layouts/RouterView.vue'),
        children: [
          {
            path: 'mapping',
            name: 'Mapping',
            component: () => import('@/views/foundation-data/Mapping.vue')
          },
          {
            path: 'inventory',
            name: 'Inventory',
            component: () => import('@/views/foundation-data/components/Inventory.vue')
          },
          {
            path: 'store-inventory',
            name: 'StoreInventory',
            component: () => import('@/views/foundation-data/StoreInventory.vue')
          },
          {
            path: 'inventory-sync-rule',
            name: 'InventorySyncRule',
            component: () => import('@/views/foundation-data/InventorySyncRule.vue')
          },
          {
            path: 'query-tool',
            name: 'QueryTool',
            component: () => import('@/views/foundation-data/QueryTool.vue')
          },
          {
            path: 'order-update-control',
            name: 'OrderUpdateControl',
            component: () => import('@/views/foundation-data/OrderUpdateControl.vue')
          }
        ]
      },
      {
        path: '/knowledge-base',
        name: 'KnowledgeBase',
        component: () => import('@/layouts/RouterView.vue'),
        children: [
          {
            path: 'knowledge-center',
            name: 'KnowledgeCenter',
            component: () => import('@/views/knowledge-base/KnowledgeCenter.vue')
          },
          {
            path: 'knowledge-application',
            name: 'KnowledgeApplication',
            component: () => import('@/views/knowledge-base/KnowledgeApplication.vue')
          },
          {
            path: 'enhanced-editor',
            name: 'EnhancedKnowledgeEditor',
            component: () => import('@/views/knowledge-base/EnhancedKnowledgeEditor.vue')
          }
        ]
      },
      {
        path: '/data-reports',
        name: 'DataReports',
        component: () => import('@/layouts/RouterView.vue'),
        meta: {
          title: '数据报表'
        },
        children: [
          {
            path: '',
            name: 'DataReportsOverview',
            component: () => import('@/views/data-reports/index.vue')
          },
          {
            path: 'sales-forecast',
            name: 'SalesForecast',
            component: () => import('@/views/data-reports/SalesForecast.vue')
          },
          {
            path: 'sales-prediction',
            name: 'SalesPrediction',
            component: () => import('@/views/data-reports/SalesPrediction.vue')
          },
          {
            path: 'slow-moving-rules',
            name: 'SlowMovingRules',
            component: () => import('@/views/data-reports/SlowMovingRules.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由调试信息
router.beforeEach((to, from, next) => {
  console.log('路由跳转:', from.path, '->', to.path)
  next()
})

export default router 