# Load 字段优化建议（从 OMS 业务角度）

## 字段分类分析

### ✅ 核心必需字段（创建时必须）
这些字段是 Load 业务的核心，创建时必须填写：

1. **Load NO** - Load 编号（自动生成）
2. **Load Type** - Load 类型（LTL/FTL/PARCEL），决定运输方式
3. **Customer** - 客户（必填）
4. **Carrier** - 承运商（必填）
5. **Desired Ship Date** - 期望发货日期（必填）
6. **Ship From** - 发货地址（必填）
7. **Ship To** - 收货地址（必填）
8. **Order Lines** - 订单行（必填，至少一条）

### ⚠️ 可选但重要的字段（创建时可选）
这些字段在创建时可选，但后续可能需要：

1. **Freight Term** - 运费条款（建议设为必填，影响结算）
2. **Freight Cost** - 运费成本（创建时可能还不知道，后续更新）
3. **Note** - 备注（可选）

### ❌ 建议移除或后置的字段（创建时不需要）

#### 1. **TMS Shipment ID** 
- **问题**: 这是 TMS 系统的字段，OMS 创建 Load 时还没有这个 ID
- **建议**: 移除或移到详情页，在 Load 同步到 TMS 后自动填充

#### 2. **Routing Request Date / Routing Receipt Date**
- **问题**: 路由相关日期，属于路由管理流程，不是 Load 创建时的信息
- **建议**: 移除或移到详情页，在路由流程中自动填充

#### 3. **Pro No** (提单号)
- **问题**: 创建 Load 时通常还没有 Pro No，这是承运商确认后产生的
- **建议**: 移除创建表单，在详情页显示，在承运商确认后自动填充

#### 4. **Retailer Authorization (ARN)**
- **问题**: 这是特定零售商（如 Walmart）的授权号，不是所有 Load 都需要
- **建议**: 
  - 如果必须保留，建议根据 Customer 动态显示（某些客户才显示）
  - 或者移到 Order Line 级别（因为不同订单可能有不同的 ARN）

#### 5. **Adjusted Pallet Qty** (调整后托盘数量)
- **问题**: 创建时无法知道实际装载的托盘数，这是实际装载时的调整
- **建议**: 移除创建表单，在详情页显示，在装载完成后填写

#### 6. **Appointment Time** (预约时间)
- **问题**: 创建 Load 时通常还没有预约，这是后续预约流程中的信息
- **建议**: 移除创建表单，在详情页显示，在预约后自动填充

#### 7. **Trailer Pick Up Mode** (拖车提货模式)
- **问题**: 这个字段在创建时可能还太早，应该在后续流程中确定
- **建议**: 
  - 如果必须保留，建议设为可选，或根据 Load Type 自动推断（FTL 通常需要，PARCEL 不需要）
  - 或者移到详情页，在后续流程中填写

#### 8. **Long Haul** (长途运输)
- **问题**: 这个字段可以根据 Ship From 和 Ship To 的距离自动计算
- **建议**: 
  - 移除手动选择，改为自动计算字段（在详情页显示）
  - 或者根据距离自动设置，不需要用户选择

#### 9. **Bill To** (账单地址)
- **问题**: 账单地址通常从 Customer 配置中获取，不需要在创建时手动填写
- **建议**: 
  - 从 Customer 配置自动填充（如果 Customer 有配置）
  - 或者设为可选，只在需要特殊账单地址时才填写

## 优化后的字段结构

### 创建 Load 时的字段（简化版）

#### Basic Information（基本信息）
- Load NO (自动生成)
- Load Type (必填) - LTL/FTL/PARCEL
- Customer (必填)
- Carrier (必填)
- Freight Term (建议必填)

#### Date Information（日期信息）
- Desired Ship Date (必填)

#### Address Information（地址信息）
- Ship From (必填)
- Ship To (必填)
- Bill To (可选，从 Customer 自动填充)

#### Financial Information（财务信息）
- Freight Cost (可选，创建时可能还不知道)

#### Order Lines（订单行）
- Order Lines (必填，至少一条)

#### Note（备注）
- Note (可选)

### 后续流程中填充的字段（不在创建表单中）

这些字段应该在 Load 的后续流程中自动填充或手动更新：

1. **Pro No** - 承运商确认后
2. **TMS Shipment ID** - 同步到 TMS 后
3. **Appointment Time** - 预约后
4. **Routing Request Date / Routing Receipt Date** - 路由流程中
5. **Adjusted Pallet Qty** - 实际装载后
6. **Trailer Pick Up Mode** - 后续流程中确定
7. **Long Haul** - 自动计算

## 建议的优化方案

### 方案1: 简化创建表单（推荐）
- 只保留核心必需字段
- 将流程相关字段移到详情页或后续流程中

### 方案2: 分阶段填写
- 第一阶段：创建 Load（核心字段）
- 第二阶段：预约和路由（预约时间、路由日期）
- 第三阶段：装载和发货（Pro No、托盘数量）

### 方案3: 动态字段显示
- 根据 Customer 或 Load Type 动态显示相关字段
- 例如：只有特定客户才显示 ARN 字段

## 字段优先级总结

| 字段 | 创建时 | 建议操作 |
|------|--------|---------|
| Load NO | ✅ 自动生成 | 保留 |
| Load Type | ✅ 必填 | 保留 |
| Customer | ✅ 必填 | 保留 |
| Carrier | ✅ 必填 | 保留 |
| Freight Term | ⚠️ 建议必填 | 保留，设为必填 |
| Desired Ship Date | ✅ 必填 | 保留 |
| Ship From | ✅ 必填 | 保留 |
| Ship To | ✅ 必填 | 保留 |
| Bill To | ⚠️ 可选 | 保留，从 Customer 自动填充 |
| Freight Cost | ⚠️ 可选 | 保留 |
| Order Lines | ✅ 必填 | 保留 |
| Note | ⚠️ 可选 | 保留 |
| Pro No | ❌ 移除 | 移到详情页 |
| TMS Shipment ID | ❌ 移除 | 移到详情页 |
| Routing Request Date | ❌ 移除 | 移到详情页 |
| Routing Receipt Date | ❌ 移除 | 移到详情页 |
| Retailer Authorization | ❌ 移除或条件显示 | 根据 Customer 动态显示 |
| Adjusted Pallet Qty | ❌ 移除 | 移到详情页 |
| Appointment Time | ❌ 移除 | 移到详情页 |
| Trailer Pick Up Mode | ❌ 移除或可选 | 移到详情页或设为可选 |
| Long Haul | ❌ 移除 | 自动计算 |

