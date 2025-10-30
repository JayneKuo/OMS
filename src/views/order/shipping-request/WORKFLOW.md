# Shipping Request - Carrier Quote & Approval Workflow

## 📋 业务流程说明

### 完整流程图

```
Allocated (已配货)
    ↓
    ↓ [请求询价]
    ↓
Carrier Quoting (询价中)
    ↓ 
    ↓ [选择报价并提交审核]
    ↓
Pending Approval (待审核) ⟵━━━┓
    ↓                        ┃
    ↓ [审核通过]              ┃ [拒绝]
    ↓                        ┃
Allocated (已配货) ━━━━━━━━━━┛
    ↓ 自动推送WMS            (退回询价状态)
    ↓
Warehouse Received (仓库已接收)
    ↓
Picked → Packed → Loaded → Shipped → In Transit → Delivered
```

## 🔄 详细流程说明

### 1️⃣ 询价流程 (Carrier Quote Process)

#### 触发条件
- 状态为 **Allocated** 时可以请求询价

#### 操作步骤
1. **请求询价** (`Request Carrier Quote`)
   - 在详情页面点击 `Actions` → `Request Carrier Quote`
   - 系统状态变更为 `Carrier Quoting`
   - 系统自动向多个 Carrier 发起询价请求

2. **查看报价** (`View Quotes`)
   - 系统展示 Carrier 询价卡片
   - 显示所有返回的报价信息:
     - Carrier 名称
     - Service (服务类型)
     - Method (配送方式)
     - Estimated Cost (预估费用)
     - Estimated Days (预估天数)
     - Valid Until (报价有效期)

3. **选择报价** (`Select Quote`)
   - 点击任意报价卡片进行选择
   - 被选中的报价显示勾选图标和高亮边框
   - 只能选择一个报价

4. **刷新报价** (`Refresh Quotes`) - 可选
   - 如果对当前报价不满意
   - 点击 `Refresh Quotes` 按钮重新获取报价
   - 系统重新向 Carrier 发起询价

5. **提交审核** (`Submit for Approval`)
   - 选择报价后，点击 `Submit for Approval` 按钮
   - 系统状态变更为 `Pending Approval`
   - 进入人工审核流程

### 2️⃣ 审核流程 (Approval Process)

#### 审核人员操作

**方式一：通过详情页按钮操作**
1. 进入详情页
2. 查看 `Carrier Quotes` 卡片中的选定报价
3. 查看 `Approval Information` 卡片
4. 点击操作按钮:
   - `Approve & Push to WMS` - 审核通过并推送WMS
   - `Reject` - 拒绝

**方式二：通过 Actions 菜单操作**
1. 点击 `Actions` 下拉菜单
2. 选择 `Approve Request` 或 `Reject Request`

#### 审核通过 (Approve)
1. 点击 `Approve & Push to WMS`
2. 系统执行以下操作:
   - 更新状态为 `Allocated`（审核通过后回到已配货状态）
   - 记录审核人信息
   - 记录审核时间
   - **自动推送单据到 WMS 系统**
3. WMS 接收后，状态自动变更为 `Warehouse Received`

> **注意**: 审核通过后不会有单独的 `Approved` 状态，而是直接变回 `Allocated` 状态并推送WMS

#### 审核拒绝 (Reject)
1. 点击 `Reject` 按钮
2. 系统弹出对话框要求输入拒绝原因
3. 输入原因后确认
4. 系统执行以下操作:
   - 记录拒绝原因
   - **状态退回到 `Carrier Quoting`**
   - 操作人员可以:
     - 重新选择其他报价
     - 刷新获取新报价
     - 修改 Carrier / Shipping Method / Shipping Service

### 3️⃣ 审核拒绝后的处理

当审核被拒绝后，有以下几种处理方式：

#### 选项 1: 重新选择报价
1. 在现有报价中选择另一个报价
2. 再次提交审核

#### 选项 2: 刷新报价
1. 点击 `Refresh Quotes` 获取最新报价
2. 从新报价中选择合适的
3. 提交审核

#### 选项 3: 修改配送信息
1. 通过 `Actions` → `Assign Carrier` 修改 Carrier
2. 修改 Shipping Method
3. 修改 Shipping Service
4. 重新请求询价

## 🎯 关键功能点

### Carrier 询价信息 (CarrierQuote)

```typescript
interface CarrierQuote {
  id: string                    // 报价ID
  carrier: string               // 物流商名称 (FedEx, UPS, etc.)
  service: string               // 服务类型 (Ground, Express, etc.)
  method: string                // 配送方式 (Standard, Priority, etc.)
  estimatedCost: number         // 预估费用
  estimatedDays: number         // 预估天数
  quoteDate: string             // 询价日期
  validUntil: string            // 报价有效期
  selected: boolean             // 是否被选中
}
```

### 审核信息字段

```typescript
{
  approvalStatus: 'pending' | 'approved' | 'rejected'  // 审核状态
  approvedBy?: string           // 审核人
  approvedDate?: string         // 审核日期
  rejectionReason?: string      // 拒绝原因
  selectedQuoteId?: string      // 选中的报价ID
}
```

## ⚙️ 状态权限控制

### Allocated 状态
- ✅ 可以请求询价
- ✅ 审核通过后会回到此状态
- ✅ 此状态下已完成审核的单据会自动推送WMS

### Carrier Quoting 状态
- ✅ 可以选择报价
- ✅ 可以刷新报价
- ✅ 可以提交审核
- ❌ 不能推送WMS

### Pending Approval 状态
- ✅ 可以审核通过（通过后变为 Allocated）
- ✅ 可以审核拒绝（拒绝后退回 Carrier Quoting）
- ✅ 可以查看选定的报价
- ❌ 不能修改报价选择

## 🔔 通知机制

### 提交审核时
- 📧 发送邮件通知审核人员
- 📱 系统内消息通知

### 审核完成后
- ✅ **审核通过**: 通知提交人和相关人员
- ❌ **审核拒绝**: 通知提交人并说明拒绝原因

### WMS推送后
- 📦 通知仓库人员
- 📊 更新库存系统

## 🔧 API 接口说明

### 1. 请求询价
```
POST /api/shipping-requests/:id/request-quote
Response: {
  quotes: CarrierQuote[]
}
```

### 2. 刷新报价
```
POST /api/shipping-requests/:id/refresh-quotes
Response: {
  quotes: CarrierQuote[]
}
```

### 3. 选择报价并提交审核
```
POST /api/shipping-requests/:id/submit-for-approval
Body: {
  quoteId: string
}
```

### 4. 审核通过（并自动推送WMS）
```
POST /api/shipping-requests/:id/approve
Body: {
  approvedBy: string
}
Response: {
  status: 'allocated',     // 审核通过后状态变为 allocated
  wmsOrderId: string,      // WMS 订单ID
  approvedDate: string,
  approvedBy: string
}
```

### 5. 审核拒绝
```
POST /api/shipping-requests/:id/reject
Body: {
  reason: string
}
Response: {
  status: 'carrier_quoting'  // 拒绝后退回询价状态
}
```

## 📊 统计报表

系统应该提供以下统计信息：

1. **询价统计**
   - 平均询价响应时间
   - 各 Carrier 报价对比
   - 最常选择的 Carrier

2. **审核统计**
   - 审核通过率
   - 平均审核时长
   - 拒绝原因分析

3. **成本统计**
   - 实际运费 vs 预估运费
   - 各 Carrier 成本分析

## ⚠️ 注意事项

1. **报价有效期**
   - 报价都有有效期限制
   - 过期后需要重新询价

2. **审核时效**
   - 建议在 24 小时内完成审核
   - 超时未审核的需要重新询价

3. **WMS 推送**
   - 审核通过后自动推送 WMS
   - 推送失败时需要手动重试
   - 推送成功后不可撤回

4. **费用变更**
   - 如果实际费用与报价差异过大，需要重新审核

## 🎨 UI 交互说明

### 询价卡片样式
- 未选中: 灰色边框，透明背景
- Hover: 蓝色边框，半透明背景
- 已选中: 蓝色实线边框，蓝色背景，显示勾选图标

### 审核按钮
- `Approve & Push to WMS`: 绿色按钮
- `Reject`: 红色按钮

### 状态颜色
- **Carrier Quoting**: 橙色 (#faad14)
- **Pending Approval**: 深橙色 (#ffab00)
- **Approved**: 绿色 (#52c41a)

## 🔐 权限管理

不同角色的权限：

| 操作 | 操作员 | 审核员 | 管理员 |
|------|--------|--------|--------|
| 请求询价 | ✅ | ✅ | ✅ |
| 选择报价 | ✅ | ✅ | ✅ |
| 提交审核 | ✅ | ✅ | ✅ |
| 审核通过 | ❌ | ✅ | ✅ |
| 审核拒绝 | ❌ | ✅ | ✅ |
| 推送 WMS | ❌ | ✅ | ✅ |
| 修改已审核单据 | ❌ | ❌ | ✅ |

---

**最后更新**: 2025-10-30
**版本**: v1.0

