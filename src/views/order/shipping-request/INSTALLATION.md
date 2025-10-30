# Shipping Request 模块安装说明

## ✅ 已完成配置

### 1. 路由配置 (/src/router/index.ts)

已添加以下路由：

```typescript
{
  path: 'shipping-request',
  name: 'ShippingRequest',
  component: () => import('@/views/order/shipping-request/index.vue'),
  meta: {
    title: 'Shipping Request'
  }
},
{
  path: 'shipping-request/:id',
  name: 'ShippingRequestDetail',
  component: () => import('@/views/order/shipping-request/detail.vue'),
  meta: {
    title: 'Shipping Request Detail'
  }
}
```

**位置**: 在 `/order` 路由的 children 数组中，位于 `shipment` 和 `ai-tracelink` 之间

### 2. 菜单配置 (/src/config/menu.ts)

已添加以下菜单项：

```typescript
{
  title: 'Shipping Request',
  path: '/order/shipping-request',
  icon: 'Van'
}
```

**位置**: 在 `Orders` 菜单的 children 数组中，位于 `Shipment` 和 `AI Order Tracking Assistant` 之间

## 📂 文件结构

```
src/views/order/shipping-request/
├── index.vue                    # 列表页面 ✅
├── detail.vue                   # 详情页面 ✅
├── types.ts                     # 类型定义 ✅
├── components/
│   └── SearchForm.vue          # 搜索组件 ✅
├── README.md                    # 功能文档 ✅
└── INSTALLATION.md             # 本安装说明 ✅
```

## 🚀 如何访问

### 通过菜单访问
1. 点击左侧主导航的 **Orders** 菜单
2. 在侧边栏中找到 **Shipping Request** 菜单项
3. 点击即可进入列表页面

### 通过URL直接访问
- 列表页面: `http://your-domain/order/shipping-request`
- 详情页面: `http://your-domain/order/shipping-request/:id` (例如: `/order/shipping-request/1`)

## 🔍 菜单位置示意

```
📱 主导航
├── 📊 Dashboard
├── 🛒 Orders  ← 点击这里
│   ├── 📄 Sales Orders New
│   ├── 📄 Sales Order
│   ├── 🚢 Shipment
│   ├── 🚐 Shipping Request  ← 新增的菜单项在这里！
│   └── 🔗 AI Order Tracking Assistant
├── 📦 Returns
└── ...
```

## ⚠️ 注意事项

1. **热重载**: 如果修改了路由或菜单配置，可能需要重启开发服务器才能看到变化
2. **缓存清理**: 如果菜单还是没显示，尝试：
   - 清除浏览器缓存
   - 硬刷新页面 (Ctrl + Shift + R 或 Cmd + Shift + R)
   - 重启开发服务器

3. **权限配置**: 如果你的系统有权限管理，确保当前用户有访问 Shipping Request 模块的权限

## 🔧 故障排查

### 问题: 菜单没有显示

**检查清单**:
- [ ] 确认 `src/config/menu.ts` 已正确添加菜单配置
- [ ] 确认 `src/router/index.ts` 已正确添加路由配置
- [ ] 重启开发服务器
- [ ] 清除浏览器缓存
- [ ] 检查浏览器控制台是否有错误

### 问题: 点击菜单后页面空白

**可能原因**:
1. 组件导入路径错误 → 检查路由配置中的 `component` 路径
2. 组件内部有语法错误 → 检查浏览器控制台
3. 缺少依赖 → 确保所有 import 的组件和库都已安装

### 问题: 详情页面无法访问

**检查**:
- 确认路由参数名称一致 (`:id`)
- 在详情组件中正确使用 `useRoute()` 获取参数
- 检查路由配置中是否有冲突的路由

## 📝 后续步骤

1. **API 集成**: 
   - 实现列表查询接口
   - 实现详情查询接口
   - 实现创建/更新/删除接口
   - 实现批量操作接口

2. **功能完善**:
   - 集成真实的物流商 API
   - 实现标签打印功能
   - 添加物流跟踪功能
   - 实现状态变更通知

3. **测试**:
   - 单元测试
   - 集成测试
   - E2E 测试
   - 性能测试

## 🎉 完成

恭喜！Shipping Request 模块已经成功配置并可以使用了！

如果遇到任何问题，请参考：
- README.md - 功能说明和使用文档
- types.ts - 数据结构定义
- 或联系开发团队获取支持

