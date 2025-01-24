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
          },
          {
            path: 'form3461/upload/:id',
            name: 'UploadForm3461',
            component: () => import('@/views/customs/Form3461/upload.vue')
          },
          {
            path: 'form3461/contact/:id',
            name: 'ContactForm3461',
            component: () => import('@/views/customs/Form3461/contact.vue')
          },
          {
            path: 'form3461/arrange/:id',
            name: 'ArrangeForm3461',
            component: () => import('@/views/customs/Form3461/arrange.vue')
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