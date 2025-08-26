import { RouteRecordRaw } from 'vue-router';

const productRoutes: RouteRecordRaw = {
  path: '/product',
  name: 'Product',
  component: () => import('../../layouts/MainLayout.vue'),
  redirect: '/product/list',
  meta: {
    title: 'Product',
    icon: 'shopping-bag',
  },
  children: [
    {
      path: 'category',
      name: 'ProductCategory',
      component: () => import('../../views/product/category/index.vue'),
      meta: {
        title: '分类管理',
        icon: 'Menu',
        keepAlive: true
      },
    },
    {
      path: 'category/create',
      name: 'CreateCategory',
      component: () => import('../../views/product/category/index.vue'),
      meta: {
        title: '新增分类',
        activeMenu: '/product/category',
        hidden: true
      },
    },
    {
      path: 'category/edit/:id',
      name: 'EditCategory',
      component: () => import('../../views/product/category/index.vue'),
      meta: {
        title: '编辑分类',
        activeMenu: '/product/category',
        hidden: true
      },
    },
    {
      path: 'brand',
      name: 'ProductBrand',
      component: () => import('../../views/product/brand/index.vue'),
      meta: {
        title: '品牌管理',
        icon: 'Shop',
        keepAlive: true
      },
    },
    {
      path: 'brand/create',
      name: 'CreateBrand',
      component: () => import('../../views/product/brand/index.vue'),
      meta: {
        title: '新增品牌',
        activeMenu: '/product/brand',
        hidden: true
      },
    },
    {
      path: 'brand/edit/:id',
      name: 'EditBrand',
      component: () => import('../../views/product/brand/index.vue'),
      meta: {
        title: '编辑品牌',
        activeMenu: '/product/brand',
        hidden: true
      },
    },
    {
      path: 'list',
      name: 'ProductList',
      component: () => import('../../views/product/index.vue'),
      meta: {
        title: 'Product List',
      },
    },
    {
      path: 'select-category',
      name: 'SelectCategory',
      component: () => import('../../views/product/components/CategorySelector.vue'),
      meta: {
        title: '选择商品分类',
      },
    },
    {
      path: 'create',
      name: 'ProductCreate',
      component: () => import('../../views/product/create.vue'),
      meta: {
        title: 'Create Product',
      },
    },
    {
      path: ':id',
      name: 'ProductDetail',
      component: () => import('../../views/product/detail.vue'),
      redirect: { name: 'ProductBasic' },
      children: [
        {
          path: 'basic',
          name: 'ProductBasic',
          component: () => import('../../views/product/components/basics/BasicInfo.vue'),
          meta: {
            title: 'Basic Info',
          },
        },
        {
          path: 'channel',
          name: 'ProductChannel',
          component: () => import('../../views/product/components/basics/ChannelInfo.vue'),
          meta: {
            title: 'Channel',
          },
        },
        {
          path: 'warehouse',
          name: 'ProductWarehouse',
          component: () => import('../../views/product/components/basics/WarehouseInfo.vue'),
          meta: {
            title: 'Warehouse',
          },
        },
        {
          path: 'compliance',
          name: 'ProductCompliance',
          component: () => import('../../views/product/components/basics/ComplianceInfo.vue'),
          meta: {
            title: 'Compliance',
          },
        },
        {
          path: 'bundle',
          name: 'ProductBundle',
          component: () => import('../../views/product/components/basics/BundleInfo.vue'),
          meta: {
            title: 'Bundle / Kit',
          },
        },
        {
          path: 'mapping',
          name: 'ProductMapping',
          component: () => import('../../views/product/components/basics/MappingInfo.vue'),
          meta: {
            title: 'Mapping',
          },
        }
      ]
    }
  ],
};

export default productRoutes;
