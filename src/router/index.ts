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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 