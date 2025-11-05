# Shipping Account Module

## 功能概述

Shipping Account 模块允许用户管理运输承运商账户信息，包括账户的新增、编辑、删除和查询功能。

## 文件结构

```
src/views/settings/shipping-account/
├── index.vue           # 列表页面 - 显示所有运输账户
├── add.vue            # 新增/编辑页面 - 添加或编辑运输账户
├── types.ts           # 类型定义文件
└── README.md          # 本文档
```

## 菜单位置

主导航 > **Settings** > **Shipping Account**

## 路由配置

已在 `/src/router/index.ts` 中添加了以下路由：

- `/system-settings/shipping-account` - 列表页
- `/system-settings/shipping-account/add` - 新增页
- `/system-settings/shipping-account/edit/:id` - 编辑页

## 菜单配置

已在 `/src/config/menu.ts` 中创建了独立的 Settings 主导航模块，并添加了 Shipping Account 菜单项。

## 字段说明

### 必填字段
- **Carrier**: 承运商（FedEx, UPS, USPS, DHL, Other）
- **Account No**: 账户号码

### 可选字段
- **Api Client ID**: API 客户端 ID
- **Api Client Password**: API 客户端密码
- **Api Token**: API 令牌
- **Track Api Key**: 物流追踪 API 密钥
- **Track Api Secret**: 物流追踪 API 密钥（加密）
- **Name**: 联系人姓名
- **Company**: 公司名称
- **Address 1**: 地址 1
- **Address 2**: 地址 2
- **City**: 城市
- **Country / Region**: 国家/地区
- **State / Province**: 州/省
- **Zip Code**: 邮编
- **Phone**: 电话
- **Smart Post Hub Id**: Smart Post Hub ID
- **Return Account Number**: 退货账户号码
- **Is Return**: 是否为退货账户（开关）

## 功能特性

### 列表页（index.vue）
- ✅ 多条件搜索（承运商、账户号、姓名、公司）
- ✅ 数据表格展示
- ✅ 分页功能
- ✅ 编辑和删除操作
- ✅ 新增按钮

### 新增/编辑页（add.vue）
- ✅ 表单验证
- ✅ 两列布局，优化用户体验
- ✅ 密码字段支持显示/隐藏
- ✅ 返回和取消按钮
- ✅ 自动识别新增/编辑模式
- ✅ **分类展示** - 字段按逻辑分组，清晰明了：
  - 📄 **Basic Information** - 基本信息（承运商、账户号、联系人、公司）
  - 🔑 **API Configuration** - API配置（Client ID、密码、Token）
  - 📍 **Address Information** - 地址信息（完整的邮寄地址）
  - ⚙️ **Additional Settings** - 其他设置（Hub ID、退货账户等）

## 使用方法

### 访问列表页
1. 点击主导航的 **Settings** 模块
2. 在左侧菜单中点击 **Shipping Account**

### 新增账户
1. 在列表页点击右上角的 **Add Shipping Account** 按钮
2. 填写表单信息（必填项为 Carrier 和 Account No）
3. 点击 **Add Shipping Account** 按钮保存

### 编辑账户
1. 在列表页点击对应行的 **Edit** 按钮
2. 修改表单信息
3. 点击 **Update Shipping Account** 按钮保存

### 删除账户
1. 在列表页点击对应行的 **Delete** 按钮
2. 在确认对话框中点击 **Delete** 按钮

### 搜索账户
1. 在搜索表单中填写搜索条件
2. 点击 **Search** 按钮
3. 点击 **Reset** 按钮可清空搜索条件

## API 集成

当前使用 Mock 数据，需要集成实际 API：

### 列表查询 API
- **位置**: `index.vue` 的 `loadData()` 方法
- **需要实现**: GET 请求获取运输账户列表

### 详情查询 API
- **位置**: `add.vue` 的 `loadData()` 方法
- **需要实现**: GET 请求获取单个运输账户详情

### 新增 API
- **位置**: `add.vue` 的 `handleSubmit()` 方法
- **需要实现**: POST 请求创建新的运输账户

### 更新 API
- **位置**: `add.vue` 的 `handleSubmit()` 方法
- **需要实现**: PUT 请求更新运输账户

### 删除 API
- **位置**: `index.vue` 的 `handleDelete()` 方法
- **需要实现**: DELETE 请求删除运输账户

## 样式说明

使用 Element Plus 组件库，遵循系统统一的设计规范：
- 页面内边距: 20px
- 卡片间距: 20px
- 表单标签宽度: 160px
- 响应式两列布局

## 注意事项

1. API 接口需要替换 Mock 数据
2. 密码字段在列表展示时显示为 `********`
3. 删除操作需要用户确认
4. 表单验证规则可根据实际需求调整
5. 分页参数可根据后端 API 调整

## 后续优化建议

- [ ] 添加批量删除功能
- [ ] 添加导出功能
- [ ] 添加账户状态管理（启用/禁用）
- [ ] 添加账户测试功能（验证 API 凭证）
- [ ] 添加使用统计（该账户的使用次数）
- [ ] 支持账户图标显示（根据不同承运商显示对应 logo）

