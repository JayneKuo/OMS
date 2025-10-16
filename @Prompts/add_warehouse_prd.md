# Add Warehouse 功能产品需求文档

## 1. 标题
**Add Warehouse - 仓库添加功能**

---

## 1.1 功能概述

Add Warehouse 功能允许用户通过两种方式向系统中添加仓库：本地仓库创建和集成仓库导入。该功能支持用户管理多种类型的仓库，包括自建仓库和第三方物流服务商的集成仓库，为订单履行和库存管理提供基础设施支持。

---

## 1.2 用户故事

### 用户故事 1：本地仓库创建
**作为** 仓库管理员  
**我希望** 能够创建本地仓库记录  
**以便于** 管理自有仓库的基本信息和操作配置  

### 用户故事 2：集成仓库导入
**作为** 运营经理  
**我希望** 能够从已集成的第三方物流服务商中选择仓库  
**以便于** 快速扩展履行网络而无需手动输入详细信息  

### 用户故事 3：集成连接管理
**作为** 系统管理员  
**我希望** 能够管理与第三方服务商的集成连接  
**以便于** 建立新的仓库合作关系和维护现有连接  

---

## 1.3 业务流程

### 主流程图
```
开始 → 点击"Add Warehouse"按钮 → 选择仓库类型 → 分支处理 → 完成添加
```

### 详细流程

#### 1.3.1 本地仓库添加流程
1. **触发入口**
   - 用户点击仓库列表页面的"Add Warehouse"按钮

2. **类型选择**
   - 系统显示仓库类型选择：Local Warehouse / Integration

3. **信息填写**
   - 用户选择"Local Warehouse"
   - 系统展示本地仓库信息表单
   - 用户填写必填字段：仓库名称、会计代码、城市、州/省、国家、地址、邮编、联系人信息

4. **验证提交**
   - 系统验证表单完整性和数据格式
   - 用户点击"Add Warehouse"按钮提交

5. **处理结果**
   - 系统创建本地仓库记录，默认设置WMS版本为"Local"
   - 默认启用订单履行和库存同步功能
   - 显示成功消息并关闭对话框

#### 1.3.2 集成仓库添加流程
1. **类型选择**
   - 用户选择"Integration"类型

2. **仓库展示**
   - 系统展示可用的已集成仓库列表
   - 显示仓库详细信息：名称、服务商、位置、容量、功能特性、连接状态

3. **仓库选择**
   - 用户点击选择已连接状态的仓库
   - 系统高亮显示选中仓库并显示选择指示器

4. **添加确认**
   - 用户点击"Add Warehouse"按钮
   - 系统检查仓库是否已存在于列表中

5. **处理结果**
   - 系统创建集成仓库记录，设置相应的WMS版本
   - 默认启用订单履行和库存同步功能
   - 显示成功消息并关闭对话框

#### 1.3.3 集成管理流程
1. **管理入口**
   - 用户点击"Integration"按钮或空状态下的引导按钮

2. **页面跳转**
   - 系统跳转到集成连接管理页面 (/integration/connections)

---

## 1.4 业务规则

### 1.4.1 本地仓库规则

#### 数据验证规则
- **必填字段**: 仓库名称、会计代码、城市、州/省、国家、地址、邮编、联系人姓名、邮箱、电话
- **邮箱格式**: 必须符合标准邮箱格式
- **唯一性约束**: 会计代码在系统中必须唯一
- **字符长度**: 各字段需符合预设的最大长度限制

#### 默认配置规则
- **WMS版本**: 自动设置为"Local"
- **排序位置**: 自动分配为当前最大排序号+1
- **功能开关**: 默认启用订单履行和库存同步

### 1.4.2 集成仓库规则

#### 选择限制规则
- **连接状态**: 只能选择连接状态为"Connected"的仓库
- **重复检查**: 不能添加已存在于仓库列表中的集成仓库
- **单选限制**: 每次只能选择一个仓库进行添加

#### 自动配置规则
- **WMS版本**: 自动设置为服务商名称（如"ShipBob"、"Amazon FBA"）
- **联系信息**: 自动填充服务商的标准联系信息
- **地址信息**: 根据集成仓库的位置信息自动生成

#### 断连处理规则
- **WMS重置**: 集成仓库断开连接时，WMS版本自动设为"Unassigned"
- **功能禁用**: 断连时自动禁用订单履行和库存同步
- **选项标识**: 下拉菜单中显示"(Disconnected)"标识且禁用选择

### 1.4.3 通用业务规则

#### 权限控制规则
- **操作权限**: 只有具备仓库管理权限的用户可以添加仓库
- **数据可见性**: 用户只能看到其权限范围内的集成仓库

#### 数据一致性规则
- **排序更新**: 添加新仓库后自动更新所有仓库的排序号
- **状态同步**: 集成仓库的连接状态需与集成系统保持同步

---

## 1.5 功能描述

### 1.5.1 界面组件

#### 主对话框
- **标题**: "Add Warehouse"
- **尺寸**: 800px宽度，自适应高度
- **关闭方式**: 点击遮罩层不关闭，必须通过按钮操作

#### 仓库类型选择器
- **组件类型**: 单选按钮组 (Radio Button Group)
- **选项**: 
  - "Local Warehouse" - 本地仓库
  - "Integration" - 集成仓库
- **默认值**: "Local Warehouse"

#### 本地仓库表单
- **布局**: 两列网格布局，响应式设计
- **字段组织**:
  - 第一行：Warehouse Name / 仓库名称、Accounting Code / 会计代码
  - 第二行：City / 城市、State / 州省、Country / 国家
  - 第三行：Address / 地址
  - 第四行：ZIP Code / 邮编、Contact Name / 联系人姓名
  - 第五行：Contact Email / 联系邮箱、Contact Phone / 联系电话

#### 集成仓库展示区

##### 仓库卡片
- **布局**: 网格布局，最小宽度300px，自适应列数
- **卡片内容**:
  - 连接状态标签
  - 仓库名称和服务商名称
  - 位置信息
  - 选择指示器（选中时显示）

##### 空状态展示
- **图标**: 大尺寸仓库图标
- **标题**: "No Integrated Warehouses Available"
- **描述**: "You don't have any integrated warehouses yet. Connect with warehouse service providers to expand your fulfillment network."

### 1.5.2 交互行为

#### 表单验证
- **实时验证**: 失焦时验证单个字段
- **提交验证**: 提交时验证所有必填字段
- **错误提示**: 字段下方显示具体错误信息

#### 仓库选择交互
- **悬停效果**: 鼠标悬停时卡片边框变色和轻微上移
- **选中状态**: 选中时卡片高亮显示并显示选择指示器
- **禁用状态**: 未连接仓库显示禁用样式且无法选择

#### 按钮状态管理
- **Cancel按钮**: 始终可用，点击关闭对话框
- **Add Warehouse按钮**: 
  - 本地仓库：表单完整时启用
  - 集成仓库：选择仓库时启用
- **Integration按钮**: 始终可用，跳转到集成管理页面

### 1.5.3 数据处理

#### 本地仓库数据处理
```javascript
// 数据结构示例
const localWarehouse = {
  rank: nextRank,
  warehouse: formData.warehouse,
  accountingCode: formData.accountingCode,
  city: formData.city,
  state: formData.state,
  country: formData.country,
  address1: formData.address1,
  zipCode: formData.zipCode,
  contactName: formData.contactName,
  contactEmail: formData.contactEmail,
  contactPhone: formData.contactPhone,
  wmsVersion: 'Local',
  availableVersions: ['Local'],
  enableFulfillment: true,
  enableInventorySync: true,
  isIntegrated: false
}
```

#### 集成仓库数据处理
```javascript
// 数据转换示例
const integratedWarehouse = {
  rank: nextRank,
  warehouse: selectedWarehouse.name,
  accountingCode: selectedWarehouse.warehouseCode,
  city: parseLocation(selectedWarehouse.location).city,
  state: parseLocation(selectedWarehouse.location).state,
  country: 'US',
  address1: `${selectedWarehouse.provider} Integration - ${selectedWarehouse.location}`,
  zipCode: '00000',
  contactName: selectedWarehouse.contactInfo.name,
  contactEmail: selectedWarehouse.contactInfo.email,
  contactPhone: selectedWarehouse.contactInfo.phone,
  wmsVersion: selectedWarehouse.provider,
  availableVersions: [selectedWarehouse.provider],
  enableFulfillment: true,
  enableInventorySync: true,
  isIntegrated: true,
  integrationDate: selectedWarehouse.integrationDate,
  integrationStatus: selectedWarehouse.connectionStatus
}
```

### 1.5.4 错误处理

#### 验证错误
- **字段级错误**: 在对应字段下显示具体错误信息
- **表单级错误**: 在表单顶部显示整体错误提示

#### 业务逻辑错误
- **重复仓库**: 提示 "Warehouse already exists in your warehouse list" / "仓库已存在于您的仓库列表中"
- **连接失败**: 提示 "Failed to add warehouse. Please try again." / "添加仓库失败，请重试"
- **权限不足**: 提示 "Insufficient permission to add warehouse" / "权限不足，无法添加仓库"

#### 系统错误
- **API调用失败**: 显示友好的错误提示，记录详细错误日志
- **数据保存失败**: 提示保存失败，保留用户输入数据

### 1.5.5 成功反馈

#### 操作成功提示
- **本地仓库添加成功**: 
  - `Local warehouse "${warehouseName}" added successfully`

- **集成仓库添加成功**:
  - `🎉 Successfully added "${warehouseName}" to your warehouse list!`

- **断连仓库WMS重置**:
  - `${warehouseName} is disconnected. WMS version has been set to unassigned.`

#### 后续操作
- **对话框关闭**: 成功添加后自动关闭对话框
- **列表刷新**: 仓库列表自动更新显示新添加的仓库
- **表单重置**: 清空所有表单数据和选择状态

---

## 附录：技术实现要点

### 前端技术栈
- **框架**: Vue 3 + TypeScript
- **UI组件库**: Element Plus
- **状态管理**: Vue Composition API
- **路由管理**: Vue Router

### 关键技术实现
- **表单验证**: 基于Element Plus的表单验证规则
- **数据持久化**: 通过API调用后端服务
- **状态同步**: 响应式数据绑定
- **错误边界**: 统一错误处理机制

### 性能优化
- **懒加载**: 集成仓库数据按需加载
- **防抖处理**: 表单验证和搜索功能防抖
- **缓存策略**: 集成仓库列表数据缓存

---

**文档版本**: 1.0  
**创建日期**: 2024-01-16  
**最后更新**: 2024-01-16  
**文档状态**: 已完成
