# 菜单配置指南

## 系统现有路由结构

```typescript
// src/router/index.ts 当前结构
const routes = [
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
            component: () => import('@/views/customs/ISF.vue')
          },
          {
            path: 't86',
            name: 'T86',
            component: () => import('@/views/customs/T86.vue')
          }
        ]
      },
      {
        path: '/work-order',
        name: 'Work Order',
        component: () => import('@/views/work-order/index.vue')
      },
      {
        path: '/delivery-order',
        name: 'Delivery Order',
        component: () => import('@/views/delivery-order/index.vue')
      }
    ]
  }
]
```

## 系统现有菜单结构

```typescript
// src/config/menu.ts 当前结构
export const menuConfig: MenuItem[] = [
  {
    title: 'Customs',
    path: '/customs',
    icon: Location,
    children: [
      {
        title: 'ISF',
        path: '/customs/isf',
        icon: Ship
      },
      {
        title: 'T86',
        path: '/customs/t86',
        icon: Files
      }
    ]
  },
  {
    title: 'Work Order',
    path: '/work-order',
    icon: Document
  },
  {
    title: 'Delivery Order',
    path: '/delivery-order',
    icon: Box
  }
]
```

## 菜单结构说明

系统采用两级菜单结构：
1. 父级菜单（一级菜单）
   - 包含图标、标题、路径
   - 可以包含子菜单
2. 子级菜单（二级菜单）
   - 包含标题、路径
   - 可选图标

## 添加菜单的完整步骤

### 1. 确定菜单信息
```typescript
// 需要确定以下信息
{
  父级菜单: {
    title: string;     // 菜单标题
    path: string;      // 路由路径（如：/customs）
    icon?: Component;  // 菜单图标（来自 @element-plus/icons-vue）
  }
  子级菜单: {
    title: string;     // 菜单标题
    path: string;      // 路由路径（如：/customs/isf）
    icon?: Component;  // 可选图标
  }
}
```

### 2. 创建视图文件
```bash
# 在对应目录创建视图文件
src/views/[父级路径]/[子级路径].vue

# 示例：添加 Customs 下的 Declaration 页面
src/views/customs/Declaration.vue

# 基础视图模板
<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>[页面标题]</h1>
        <p class="subtitle">[页面描述]</p>
      </div>
    </div>
    <!-- 页面内容 -->
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 500;
    margin: 0;
    color: var(--text-primary);
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
  }
}
</style>
```

### 3. 配置路由
```typescript
// 在 src/router/index.ts 中添加路由配置

// 1. 添加到现有父级菜单
{
  path: '/customs',
  name: 'Customs',
  children: [
    {
      path: 'declaration',  // 新增子路由
      name: 'Declaration',
      component: () => import('@/views/customs/Declaration.vue')
    }
  ]
}

// 2. 添加新的父级菜单
{
  path: '/new-parent',
  name: 'NewParent',
  children: [
    {
      path: 'child',
      name: 'Child',
      component: () => import('@/views/new-parent/Child.vue')
    }
  ]
}
```

### 4. 添加菜单配置
```typescript
// 在 src/config/menu.ts 中添加菜单配置

// 1. 在现有父级菜单下添加子菜单
{
  title: 'Customs',
  path: '/customs',
  icon: Location,
  children: [
    {
      title: 'Declaration',  // 新增子菜单
      path: '/customs/declaration',
      icon: Document
    }
  ]
}

// 2. 添加新的父级菜单
{
  title: 'New Parent',
  path: '/new-parent',
  icon: Location,
  children: [
    {
      title: 'Child',
      path: '/new-parent/child',
      icon: Document
    }
  ]
}
```

## 命名规范

1. 路由路径（path）
   - 全小写
   - 使用连字符（-）连接多个单词
   - 示例：`/work-order`、`/customs/isf`

2. 组件名称（name）
   - 大驼峰命名
   - 示例：`WorkOrder`、`CustomsISF`

3. 文件命名
   - 视图文件使用首字母大写的驼峰命名
   - 示例：`ISF.vue`、`WorkOrder.vue`

## 图标使用

1. 导入图标
```typescript
import { 
  Location,   // 位置/导航
  Document,   // 文档/表单
  Box,        // 包裹/订单
  Ship,       // 运输/物流
  Files,      // 文件/列表
  Setting,    // 设置
  User,       // 用户
  Calendar,   // 日历/时间
  Tickets,    // 票据
  Money,      // 财务
  TrendCharts // 图表/统计
} from '@element-plus/icons-vue'
```

2. 常用图标场景
   - Location: 导航、地址、位置相关
   - Document: 文档、表单、申报相关
   - Box: 订单、包裹、货物相关
   - Ship: 运输、物流、船运相关
   - Files: 文件、列表、记录相关
   - Setting: 设置、配置相关
   - User: 用户、账户相关
   - Calendar: 日期、计划相关
   - Tickets: 单据、票据相关
   - Money: 财务、支付相关
   - TrendCharts: 统计、报表相关

## 快速添加菜单流程

1. 确认信息
   - 选择父级菜单（现有或新建）
   - 确定子菜单名称和路径
   - 选择合适的图标

2. 执行添加
   - 创建视图文件（使用基础模板）
   - 添加路由配置
   - 添加菜单配置
   - 实现页面功能

## 注意事项

1. 路径一致性
   - 确保路由配置和菜单配置中的路径完全一致
   - 注意路径大小写
   - 确保路径唯一性

2. 组件导入
   - 使用异步导入以优化性能
   - 确保路径正确
   - 保持组件命名规范

3. 权限控制
   - 如需添加权限控制，在路由配置中添加 meta 信息
   ```typescript
   {
     path: 'sensitive-data',
     name: 'SensitiveData',
     component: () => import('@/views/data/SensitiveData.vue'),
     meta: {
       requiresAuth: true,
       roles: ['admin', 'manager']
     }
   }
   ```
   - 在菜单配置中添加对应的权限标识

4. 图标选择
   - 选择语义化的图标
   - 保持图标风格统一
   - 适当使用图标增强视觉识别度

5. 开发建议
   - 先完成菜单和路由配置
   - 使用基础模板快速创建页面
   - 遵循项目既有的开发规范
   - 注意代码复用和组件抽象 