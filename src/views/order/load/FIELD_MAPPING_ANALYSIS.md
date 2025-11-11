# 从 Shipping Request 生成 Load 的字段映射分析

## 当前字段对比

### Shipping Request 字段 → Load 字段映射

| Shipping Request 字段 | Load 字段 | 映射方式 | 状态 |
|---------------------|----------|---------|------|
| `shippingCarrier` (字符串) | `carrierId` | 需要名称→ID映射 | ⚠️ 需要处理 |
| `expectedShipDate` | `desiredShipDate` | 直接映射 | ✅ 可直接映射 |
| `warehouse` (字符串) | `shipFrom` (地址对象) | 需要从仓库获取地址 | ⚠️ 需要处理 |
| `destination` (字符串) | `shipTo` (地址对象) | 需要解析或从 AllocationOrder 获取 | ⚠️ 需要处理 |
| `channelName` (字符串) | `customerId` | 需要名称→ID映射 | ⚠️ 需要处理 |
| `notes` | `note` | 直接映射 | ✅ 可直接映射 |
| `orderNos[]` | `orderLines[].orderNo` | 已处理 (OrderLineTable) | ✅ 已实现 |
| `requestNo` | `orderLines[].requestNo` | 已处理 (OrderLineTable) | ✅ 已实现 |

### Load 独有字段（Shipping Request 没有）

| Load 字段 | 来源 | 建议 |
|----------|------|------|
| `loadType` | 无 | 需要手动选择或根据订单数量/重量推断 |
| `freightTerm` | 无 | 需要手动选择 |
| `freightCost` | 可能从 `carrierQuotes[].estimatedCost` | 可以从选中的报价获取 |
| `billTo` | 无 | 需要从 customer 配置获取 |
| `proNo` | 无 | 手动填写或自动生成 |
| `retailerAuthorization` | 无 | 手动填写 |
| `tmsShipmentId` | 无 | 手动填写 |
| `appointmentTime` | 无 | 手动填写 |
| `routingRequestDate` | 无 | 手动填写或自动填充当前日期 |
| `routingReceiptDate` | 无 | 手动填写 |
| `trailerPickUpMode` | 无 | 手动选择，默认值已设置 |
| `adjustedPalletQty` | 无 | 手动填写或从订单计算 |

## 问题分析

### 1. 地址信息不完整
- **问题**: Shipping Request 的 `destination` 是字符串，无法直接映射到 `shipTo` 地址对象
- **解决方案**: 
  - 从 `AllocationOrderDetail` 中获取完整地址信息（recipientAddress, recipientCity, recipientState, recipientZip, recipientCountry）
  - 或者解析 `destination` 字符串（如果格式固定）

### 2. Ship From 地址缺失
- **问题**: Shipping Request 只有 `warehouse` 名称，没有地址信息
- **解决方案**: 
  - 需要维护一个仓库地址映射表
  - 或者从 customer 配置中获取默认的 shipFrom 地址

### 3. 名称到ID的映射
- **问题**: Shipping Request 使用名称（channelName, shippingCarrier），Load 需要ID
- **解决方案**: 
  - 需要维护映射关系
  - 或者在导入时进行名称匹配

### 4. 缺少关键业务字段
- **问题**: Load 的 `loadType`、`freightTerm` 等关键字段在 Shipping Request 中没有对应
- **解决方案**: 
  - 需要手动填写
  - 或者根据业务规则自动推断（如根据订单数量推断 loadType）

## 建议的改进方案

### 方案1: 添加从 Shipping Request 导入的功能
在 create.vue 中添加一个功能，允许从 Shipping Request 导入数据：

```typescript
// 从 Shipping Request 填充 Load 数据
const fillFromShippingRequest = (shippingRequest: ShippingRequestItem, allocationOrders: AllocationOrderDetail[]) => {
  // 1. 映射 Carrier
  const carrier = carriers.value.find(c => c.label === shippingRequest.shippingCarrier)
  if (carrier) {
    formData.carrierId = carrier.value
  }
  
  // 2. 映射 Customer
  const customer = customers.value.find(c => c.label === shippingRequest.channelName)
  if (customer) {
    formData.customerId = customer.value
  }
  
  // 3. 映射日期
  formData.desiredShipDate = shippingRequest.expectedShipDate
  
  // 4. 映射 Ship To 地址（从第一个 AllocationOrder 获取）
  if (allocationOrders.length > 0) {
    const firstOrder = allocationOrders[0]
    formData.shipTo = {
      name: firstOrder.recipientName,
      address1: firstOrder.recipientAddress,
      city: firstOrder.recipientCity,
      state: firstOrder.recipientState,
      zipCode: firstOrder.recipientZip,
      country: firstOrder.recipientCountry,
      phone: firstOrder.recipientPhone,
      email: firstOrder.recipientEmail
    }
  }
  
  // 5. 映射 Freight Cost（从选中的报价）
  if (shippingRequest.selectedQuoteId && shippingRequest.carrierQuotes) {
    const selectedQuote = shippingRequest.carrierQuotes.find(q => q.id === shippingRequest.selectedQuoteId)
    if (selectedQuote) {
      formData.freightCost = selectedQuote.estimatedCost
    }
  }
  
  // 6. 映射 Note
  formData.note = shippingRequest.notes || ''
  
  // 7. 推断 Load Type（根据订单数量）
  if (shippingRequest.totalQuantity > 100) {
    formData.loadType = 'FTL'
  } else if (shippingRequest.totalQuantity > 10) {
    formData.loadType = 'LTL'
  } else {
    formData.loadType = 'PARCEL'
  }
}
```

### 方案2: 增强 OrderLineTable 的导入功能
在 OrderLineTable 组件中，当导入 Shipping Request 时，同时填充 Load 的基本信息。

### 方案3: 添加仓库地址配置
在系统中维护仓库地址信息，以便自动填充 `shipFrom`。

## 当前字段完整性评估

### ✅ 已正确配置的字段
- Load Type (必填)
- Customer (必填)
- Carrier (必填)
- Desired Ship Date (必填)
- Ship From (必填，但需要从仓库获取)
- Ship To (必填，但需要从 AllocationOrder 获取)
- Order Lines (已实现导入功能)

### ⚠️ 需要改进的字段
- **Ship From**: 需要从 warehouse 获取地址信息
- **Ship To**: 需要从 AllocationOrderDetail 获取完整地址
- **Carrier**: 需要名称到ID的映射
- **Customer**: 需要名称到ID的映射
- **Load Type**: 可以添加自动推断逻辑
- **Freight Cost**: 可以从 carrierQuotes 获取

### 📝 建议添加的功能
1. 从 Shipping Request 导入时自动填充 Load 基本信息
2. 维护仓库地址映射表
3. 维护 Carrier 和 Customer 的名称到ID映射
4. 根据订单数量/重量自动推断 Load Type
5. 从 Carrier Quote 自动填充 Freight Cost

