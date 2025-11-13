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
      component: () => import('../../views/product/category/edit.vue'),
      meta: {
        title: '新增分类',
        activeMenu: '/product/category',
        hidden: true
      },
    },
    {
      path: 'category/edit/:id',
      name: 'EditCategory',
      component: () => import('../../views/product/category/edit.vue'),
      meta: {
        title: '编辑分类',
        activeMenu: '/product/category',
        hidden: true
      },
    },
    {
      path: 'category/mapping/:id',
      name: 'CategoryMapping',
      component: () => import('../../views/product/category/mapping.vue'),
      meta: {
        title: '分类映射',
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
      path: 'ai-product-creator',
      name: 'AiProductCreator',
      component: () => import('../../views/AiProductCreator.vue'),
      meta: {
        title: 'AI Product Creator',
        icon: 'MagicStick',
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
          name: 'ProductChannelInfo',
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
    },
    {
      path: 'channel',
      name: 'ProductChannelList',
      component: () => import('../../layouts/RouterView.vue'),
      redirect: '/product/channel/shein',
      meta: {
        title: 'Channel Product',
        icon: 'Connection',
        keepAlive: true
      },
      children: [
        {
          path: 'shein',
          name: 'SheinProductList',
          component: () => import('../../views/product/channel/shein/index.vue'),
          meta: {
            title: 'Shein Product List',
            icon: 'List',
            keepAlive: true
          },
        }
      ]
    }
  ],
};

export default productRoutes;
