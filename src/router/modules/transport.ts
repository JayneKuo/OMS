import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/transport',
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      title: '运输管理',
      icon: 'Van'
    },
    children: [
      {
        path: 'plan',
        name: 'TransportPlan',
        component: () => import('@/views/transport/plan/index.vue'),
        meta: {
          title: '运输计划',
          icon: 'List',
          permission: 'transport.plan'
        }
      },
      {
        path: 'plan/create',
        name: 'TransportPlanCreate',
        component: () => import('@/views/transport/plan/form.vue'),
        meta: {
          title: '新建运输计划',
          icon: 'List',
          hidden: true
        }
      },
      {
        path: 'plan/edit/:id',
        name: 'TransportPlanEdit',
        component: () => import('@/views/transport/plan/form.vue'),
        meta: {
          title: '编辑运输计划',
          icon: 'List',
          hidden: true
        }
      },
      {
        path: 'settings',
        name: 'TransportSettings',
        component: () => import('@/views/transport/settings/index.vue'),
        meta: {
          title: '运输配置',
          icon: 'Setting',
          permission: 'transport.settings'
        }
      }
    ]
  }
]

export default routes 