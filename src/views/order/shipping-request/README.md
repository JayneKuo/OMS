# Shipping Request 模块

## 概述

Shipping Request 模块用于承接和管理 Allocation Orders,支持将多个 Allocation Order 合并成一个 Shipping Request 进行统一处理和配送。

## 功能特性

### 1. 列表页面 (index.vue)

**主要功能:**
- 📊 **数据展示**: 显示所有 Shipping Request,包括请求编号、状态、优先级、关联的 Allocation Order 数量等信息
- 🔍 **搜索筛选**: 支持按请求编号、跟踪号、状态、优先级、仓库、物流商等多维度筛选
- 🏷️ **状态标签页**: 快速切换不同状态的请求(全部/待处理/准备发货/已发货/异常)
- ✅ **批量操作**: 支持批量分配物流商、打印标签、更新状态
- 🔄 **合并订单**: 支持将多个 Allocation Order 合并创建新的 Shipping Request
- 📤 **导出功能**: 支持导出为 Excel 或 CSV 格式
- ⚙️ **列自定义**: 支持自定义显示列和列的顺序

**列字段:**
- Request No. (请求编号)
- Status (状态)
- Priority (优先级)
- Allocation Orders (关联的配货订单数量)
- Warehouse (仓库)
- Shipping Carrier (物流商)
- Tracking Number (跟踪号)
- Total Items (总商品种类)
- Total Quantity (总数量)
- Created Date (创建日期)
- Expected Ship Date (预期发货日期)
- Actual Ship Date (实际发货日期)
- Destination (目的地)
- Recipient Name (收件人姓名)
- Recipient Phone (收件人电话)
- Notes (备注)
- Updated Date (更新日期)

### 2. 详情页面 (detail.vue)

**主要功能:**
- 📋 **基础信息**: 显示 Shipping Request 的完整信息
- 👤 **收件人信息**: 显示收件人的联系方式和地址
- 📦 **Allocation Orders 列表**: 
  - 展示该 Shipping Request 包含的所有 Allocation Order
  - 支持展开/折叠查看每个订单的详细信息
  - 显示每个订单的商品列表
  - 显示原始订单号和渠道信息
- 📊 **汇总信息**: 显示总订单数、总商品种类、总数量
- 🎯 **快捷操作**: 打印标签、更新状态、分配物流商、添加跟踪号等
- 📋 **复制跟踪号**: 一键复制跟踪号到剪贴板

**展示结构:**
```
Shipping Request Detail
├── 基础信息卡片
│   ├── Request No.
│   ├── Status / Priority
│   ├── Warehouse
│   ├── Shipping Carrier
│   ├── Tracking Number
│   └── 日期信息
├── 收件人信息卡片
│   ├── Name / Phone
│   └── Destination Address
├── Allocation Orders 卡片
│   └── 订单列表 (可展开)
│       ├── 订单头部信息
│       ├── 订单基本信息
│       ├── 商品列表
│       └── 收件人信息
└── 汇总信息卡片
    ├── Total Allocation Orders
    ├── Total Items
    └── Total Quantity
```

### 3. 搜索组件 (SearchForm.vue)

**搜索方式:**
- **快速搜索**: 在搜索框输入请求编号或跟踪号
- **筛选器**: 
  - 状态 (多选)
  - 优先级 (多选)
  - 仓库 (多选)
  - 物流商 (多选)
  - 创建日期范围
- **高级搜索**:
  - Request No. (支持批量输入)
  - Allocation Order No. (支持批量输入)
  - Tracking Number (支持批量输入)
  - Recipient Name
  - 以及所有筛选器的组合

## 数据结构

### ShippingRequestItem (Shipping Request 主体)
```typescript
interface ShippingRequestItem {
  id: string
  requestNo: string                    // 请求编号
  status: ShippingRequestStatus        // 状态
  priority: Priority                   // 优先级
  allocationOrderCount: number         // 关联订单数
  allocationOrders: string[]           // 关联订单编号列表
  warehouse: string                    // 仓库
  shippingCarrier: string              // 物流商
  trackingNumber: string               // 跟踪号
  totalItems: number                   // 总商品种类
  totalQuantity: number                // 总数量
  createdDate: string                  // 创建日期
  expectedShipDate: string             // 预期发货日期
  actualShipDate: string               // 实际发货日期
  destination: string                  // 目的地
  recipientName: string                // 收件人姓名
  recipientPhone: string               // 收件人电话
  notes: string                        // 备注
  updatedDate: string                  // 更新日期
}
```

### AllocationOrderDetail (配货订单详情)
```typescript
interface AllocationOrderDetail {
  id: string
  orderNo: string                      // 配货订单号
  originalOrderNo: string              // 原始订单号
  status: string                       // 状态
  channel: string                      // 渠道
  channelName: string                  // 渠道名称
  items: AllocationOrderItem[]         // 商品列表
  totalQuantity: number                // 总数量
  allocatedDate: string                // 配货日期
  warehouse: string                    // 仓库
  shippingMethod: string               // 配送方式
  recipientName: string                // 收件人
  recipientAddress: string             // 地址
  recipientCity: string                // 城市
  recipientState: string               // 州/省
  recipientZip: string                 // 邮编
  recipientCountry: string             // 国家
  recipientPhone: string               // 电话
  recipientEmail: string               // 邮箱
}
```

### ShippingRequestStatus (状态枚举 - 参考 Allocation Order)
- `Allocated` - 已配货（审核通过后也回到此状态）
- `CarrierQuoting` - 询价中 🆕
- `PendingApproval` - 待审核 🆕
- `WarehouseReceived` - 仓库已接收
- `Picked` - 已拣货
- `Packed` - 已打包
- `Loaded` - 已装载
- `Shipped` - 已发货
- `PartiallyShipped` - 部分发货
- `ShortShipped` - 短发
- `InTransit` - 运输中
- `Delivered` - 已送达
- `Exception` - 异常
- `Cancelled` - 已取消

> **注意**: 新增了询价和审核流程，审核通过后状态变回 `Allocated` 并自动推送WMS，详见 [WORKFLOW.md](./WORKFLOW.md)

## 业务流程

### 1. 创建 Shipping Request

#### 方式一: 从 Allocation Orders 合并创建
```
1. 点击 "Create" -> "Merge Allocation Orders"
2. 在弹出对话框中选择要合并的 Allocation Orders
   - 需要选择至少 2 个订单
   - 建议选择相同仓库、相同目的地的订单
3. 点击 "Merge X Orders" 创建
4. 系统自动生成 Shipping Request
```

#### 方式二: 手动创建
```
1. 点击 "Create" -> "New Shipping Request"
2. 填写基本信息
3. 选择要关联的 Allocation Orders
4. 保存创建
```

### 2. 处理流程

```
Allocated (已配货) - 订单已分配到仓库
  ↓
  ↓ [请求询价]
  ↓
Carrier Quoting (询价中) - 向 Carrier 询价 🆕
  ↓
  ↓ [选择报价并提交审核]
  ↓
Pending Approval (待审核) - 等待人工审核 🆕
  ↓
  ↓ [审核通过 → 自动推送WMS]
  ↓
Allocated (已配货) - 审核通过后回到此状态 🆕
  ↓
Warehouse Received (仓库已接收) - 仓库确认接收
  ↓
Picked (已拣货) - 仓库完成拣货
  ↓
Packed (已打包) - 仓库完成打包
  ↓
Loaded (已装载) - 装载到运输车辆
  ↓
Shipped (已发货) - 已发货并获得跟踪号
  ↓
In Transit (运输中) - 运输途中
  ↓
Delivered (已送达) - 已送达收件人

特殊状态:
- Partially Shipped (部分发货) - 订单部分商品已发货
- Short Shipped (短发) - 实际发货数量少于订单数量
- Exception (异常) - 处理过程中出现异常
- Cancelled (已取消) - 订单已取消

⚠️ 审核拒绝后:
- 状态退回到 Carrier Quoting
- 可以重新选择报价或刷新报价
- 可以修改 Carrier/Method/Service

✅ 审核通过后:
- 状态变回 Allocated
- 系统自动推送WMS
- 记录审核人和审核时间

📖 详细流程说明请查看: [WORKFLOW.md](./WORKFLOW.md)
```

### 3. 批量操作

支持的批量操作:
- **Request Quote**: 批量请求询价 🆕
- **Approve Requests**: 批量审核通过 🆕
- **Reject Requests**: 批量拒绝 🆕
- **Assign Carrier**: 批量分配物流商
- **Print Labels**: 批量打印物流标签
- **Update Status**: 批量更新状态

## 设计参考

本模块的设计参考了 `sales-orders-new` 模块:
- 采用相同的 UI/UX 风格
- 使用相似的列表和详情页面布局
- 继承搜索和筛选功能的交互模式
- 保持一致的暗色主题样式

## 目录结构

```
src/views/order/shipping-request/
├── index.vue                 # 列表页面
├── detail.vue                # 详情页面
├── types.ts                  # 类型定义
├── components/
│   └── SearchForm.vue        # 搜索组件
└── README.md                 # 说明文档
```

## 使用示例

### 在路由中配置

```typescript
// router/index.ts
{
  path: '/order/shipping-request',
  name: 'ShippingRequest',
  component: () => import('@/views/order/shipping-request/index.vue'),
  meta: { title: 'Shipping Requests' }
},
{
  path: '/order/shipping-request/:id',
  name: 'ShippingRequestDetail',
  component: () => import('@/views/order/shipping-request/detail.vue'),
  meta: { title: 'Shipping Request Detail' }
}
```

### API 集成建议

需要实现以下 API 接口:

1. **列表查询**: `GET /api/shipping-requests`
   - 支持分页、排序、筛选
   
2. **详情查询**: `GET /api/shipping-requests/:id`
   - 包含关联的 Allocation Orders 详情

3. **创建**: `POST /api/shipping-requests`
   - 支持从 Allocation Orders 合并创建

4. **更新**: `PUT /api/shipping-requests/:id`
   - 更新状态、物流信息等

5. **批量操作**: `POST /api/shipping-requests/batch`
   - 支持批量更新状态、分配物流商等

6. **获取可合并的订单**: `GET /api/allocation-orders/available`
   - 用于合并订单对话框

## ⭐ 新增功能

### 1. Carrier 询价和审核流程 🆕

#### 询价功能
- 自动向多个 Carrier 发起询价请求
- 展示所有报价信息（费用、时效、服务等）
- 支持刷新报价获取最新价格
- 支持选择最优报价

#### 审核流程  
- 人工审核选定的报价
- 审核通过自动推送 WMS
- 审核拒绝可重新询价
- 记录审核人和审核时间

#### 相关字段
```typescript
carrierQuotes: CarrierQuote[]          // Carrier 询价列表
selectedQuoteId: string                // 选中的报价ID
approvalStatus: 'pending' | 'approved' | 'rejected'  // 审核状态
approvedBy: string                     // 审核人
approvedDate: string                   // 审核日期
rejectionReason: string                // 拒绝原因
```

详细流程请查看: **[WORKFLOW.md](./WORKFLOW.md)**

## 扩展建议

1. **打印功能**: 集成标签打印功能,支持批量打印物流标签
2. **物流跟踪**: 集成物流商 API,实时更新配送状态
3. **通知功能**: 配送状态变更时发送邮件/短信通知
4. **报表统计**: 添加发货统计报表,分析物流效率
5. **移动端**: 开发移动端应用,支持扫码打包发货
6. **询价优化**: 接入更多 Carrier API,提供更多报价选择 🆕
7. **自动审核**: 基于规则引擎的自动审核功能 🆕

## 注意事项

- 合并订单时,需要验证订单的仓库、目的地等信息是否一致
- 状态变更需要记录操作日志
- 跟踪号需要验证格式
- 物流商分配需要考虑时效和成本
- 支持撤销操作(在特定状态下)

