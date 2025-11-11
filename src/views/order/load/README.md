# Load Management 功能说明

## 功能概述

Load Management 是一个完整的货物装载单管理模块，基于美国物流业务设计。该模块提供装载单的完整生命周期管理，包括创建、查看、编辑、搜索和状态跟踪。

## 文件结构

```
src/views/order/load/
├── index.vue                    # 列表页面
├── create.vue                   # 创建/编辑页面
├── detail.vue                   # 详情页面
├── types.ts                     # 类型定义
├── components/
│   ├── SearchForm.vue           # 搜索表单组件
│   ├── AddressForm.vue          # 地址表单组件
│   └── OrderLineTable.vue       # 订单行表格组件
└── README.md                    # 本文档
```

## 功能特性

### 1. 基本信息管理
- Load NO (自动生成)
- Mode (模式选择: CUSTOMER ROUTING, PREPAID, COLLECT)
- Customer (客户选择)
- Carrier (承运商选择)
- Freight Term (运费条款)
- Load Type (装载类型: LTL, FTL, PARCEL)
- Appointment Time (预约时间)
- Long Haul (长途运输)

### 2. 运输信息
- Pro No (提单号)
- Retailer Authorization (ARN) (零售商授权号)
- TMS Shipment ID
- Desired Ship Date (期望发货日期)
- Freight Cost (运费成本)
- Routing Request Date (路由请求日期)
- Routing Receipt Date (路由接收日期)
- Trailer Pick Up Mode (拖车提货模式: LIVE LOAD, DROP TRAILER)
- Adjusted Pallet Qty (调整后托盘数量)

### 3. 地址管理
支持三种地址类型的管理：
- **Ship From** (发货地址) - 支持折叠
- **Ship To** (收货地址) - 支持折叠和清空
- **Bill To** (账单地址) - 支持折叠

每个地址包含以下字段：
- Name (姓名)
- Company (公司)
- Address Line 1/2 (地址行)
- City (城市)
- State (州/省)
- Zip Code (邮编)
- Country (国家)
- Phone (电话)
- Email (邮箱)

### 4. 订单行管理

#### 功能按钮
- **EXTRACT ORDER BIZ_NOTE**: 提取订单业务备注
- **IMPORT ORDERS**: 导入订单
- **REFILL LOAD INFO**: 重新填充装载信息
- **ADD ORDER/LINES**: 添加订单/订单行
- **LOAD BUILDER**: 装载构建器

#### 表格功能
- **BATCH UPDATE PRO NO**: 批量更新提单号
- **Enable Load Sequence**: 启用装载序列号
- 显示订单号、客户、参考号、采购订单号、收货地址、交货请求日期、状态
- 支持查看详情和删除操作

### 5. 备注
- 支持添加自由文本备注

## 装载单状态

系统支持以下6种状态，贯穿装载单的完整生命周期：

1. **New (新建)** - 装载单刚创建，等待分配
2. **Loading (装载中)** - 正在装载货物
3. **Window Checkin Done (窗口签到完成)** - 已完成仓库窗口签到
4. **Loaded (已装载)** - 货物装载完成，等待发运
5. **Shipped (已发运)** - 货物已发出，在途中
6. **Cancelled (已取消)** - 装载单已取消

## 使用方式

### 1. 菜单访问
在系统导航菜单中：`Orders > Load`

### 2. 列表页功能

#### 搜索和过滤
- 基础搜索：Load NO、Customer、Carrier、Mode、Pro NO、TMS Shipment ID
- 日期筛选：创建日期、发货日期范围
- 高级搜索：Load Type、Retailer Authorization、发货/收货城市

#### 状态标签页
- 点击不同状态标签快速筛选对应状态的装载单
- 每个标签显示该状态的数量统计

#### 批量操作
- 选择多个装载单后可以：
  - 批量更新状态
  - 批量导出
  - 批量删除

#### 列表操作
- **View**: 查看装载单详情
- **Edit**: 编辑装载单
- **More**: 更多操作（复制、打印、删除）

### 3. 创建装载单

点击 "Create Load" 按钮，填写以下信息：

1. **基本信息**
   - Mode (必填): CUSTOMER ROUTING / PREPAID / COLLECT
   - Customer (必填): 选择客户
   - Carrier: 选择承运商
   - Load Type: LTL / FTL / PARCEL

2. **运输信息**
   - Appointment Time: 预约时间
   - Desired Ship Date: 期望发货日期
   - Pro No: 提单号
   - TMS Shipment ID: TMS系统标识
   - Retailer Authorization (ARN): 零售商授权号

3. **费用和路由**
   - Freight Cost: 运费成本
   - Routing Request/Receipt Date: 路由请求/接收日期
   - Trailer Pick Up Mode: LIVE LOAD / DROP TRAILER

4. **地址信息**
   - Ship From: 发货地址（支持折叠）
   - Ship To: 收货地址（支持折叠和清空）
   - Bill To: 账单地址（支持折叠）

5. **订单行管理**
   - 导入订单
   - 添加订单/订单行
   - 启用装载序列
   - 批量更新Pro No

6. **备注**
   - 添加自由文本备注信息

### 4. 查看详情

详情页展示完整的装载单信息，包括：
- 基本信息和状态
- 完整的三个地址信息
- 订单行列表
- 备注信息
- 创建和更新时间

可执行操作：
- 编辑装载单
- 打印
- 导出
- 复制
- 更新状态
- 删除

### 5. 编辑装载单

编辑页面与创建页面相同，但会加载已有数据。
- Load NO 字段变为可编辑（编辑模式下）
- 所有字段可以修改
- 保存后返回列表页

## 数据类型

详细的类型定义请参考 `types.ts` 文件。

主要类型包括：
- `Load`: 装载单主数据结构
- `Address`: 地址信息结构
- `OrderLine`: 订单行结构
- `OrderItem`: 订单项结构

## API 集成说明

当前版本使用 Mock 数据。在实际使用时，需要实现以下 API：

### 列表页 (index.vue)
```typescript
// 获取装载单列表
GET /api/loads?page=1&pageSize=20&status=NEW&customer=xxx

// 获取状态统计
GET /api/loads/statistics

// 批量删除
DELETE /api/loads/batch
Body: { ids: ['id1', 'id2'] }

// 导出
GET /api/loads/export?format=excel&ids=xxx
```

### 创建/编辑页 (create.vue)
```typescript
// 创建装载单
POST /api/loads
Body: Load对象

// 更新装载单
PUT /api/loads/:id
Body: Load对象

// 获取装载单详情（编辑时）
GET /api/loads/:id

// 获取客户列表
GET /api/customers

// 获取承运商列表
GET /api/carriers
```

### 详情页 (detail.vue)
```typescript
// 获取装载单详情
GET /api/loads/:id

// 删除装载单
DELETE /api/loads/:id

// 更新状态
PATCH /api/loads/:id/status
Body: { status: 'LOADING' }
```

### 订单行相关 (OrderLineTable.vue)
```typescript
// 导入订单
POST /api/loads/:id/import-orders
Body: { orderIds: ['order1', 'order2'] }

// 添加订单行
POST /api/loads/:id/order-lines
Body: OrderLine对象

// 批量更新Pro No
PATCH /api/loads/:id/order-lines/pro-no
Body: { proNo: 'PRO123' }

// 提取BIZ_NOTE
POST /api/loads/:id/extract-biz-note
```

## 待实现功能

以下功能显示为 "coming soon"，需要后续开发：

### 高优先级
- [ ] **Extract BIZ_NOTE**: 从订单中提取业务备注
- [ ] **Import Orders**: 从订单列表批量导入
- [ ] **Add Order Lines**: 添加订单行对话框
- [ ] **Batch Update Pro No**: 批量更新提单号对话框
- [ ] **Update Status Dialog**: 状态更新对话框

### 中优先级
- [ ] **Refill Load Info**: 根据订单重新填充装载信息
- [ ] **Load Builder**: 智能装载构建器（根据规则自动组合订单）
- [ ] **Print Template**: 打印装载单模板
- [ ] **Export Templates**: 多种导出格式（Excel, CSV, PDF）

### 低优先级
- [ ] **Duplicate Load**: 复制装载单功能
- [ ] **Column Customization**: 列自定义持久化
- [ ] **Advanced Filters**: 更多高级筛选条件
- [ ] **Batch Status Update**: 批量更新状态
- [ ] **Load Timeline**: 装载单状态变更时间线

## 样式说明

页面采用现代化的卡片式布局：
- 浅灰色背景 (#f5f7fa)
- 白色内容卡片带阴影
- 圆角边框 (8px)
- 响应式栅格系统

## 注意事项

1. Load NO 字段当前设置为自动生成（禁用输入）
2. 地址表单采用灰色背景区分
3. 订单行表格支持水平滚动，适应大量列
4. 所有日期选择器支持日历选择
5. 下拉选择框支持搜索过滤（filterable）

