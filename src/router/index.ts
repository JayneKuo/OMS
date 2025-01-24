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
        children: [
          {
            path: 'isf',
            name: 'ISF',
            component: () => import('@/views/customs/ISF/index.vue')
          },
          {
            path: 'form-3461',
            name: 'Form3461',
            component: () => import('@/views/customs/Form3461/index.vue')
          },
          {
            path: 'form-3461/create',
            name: 'CreateForm3461',
            component: () => import('@/views/customs/Form3461/edit.vue')
          },
          {
            path: 'form-3461/edit/:id',
            name: 'EditForm3461',
            component: () => import('@/views/customs/Form3461/edit.vue')
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

export default router 