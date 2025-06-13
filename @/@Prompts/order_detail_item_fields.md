# 订单详情页 Item 字段文档

## 概述
本文档详细描述了订单详情页中商品（Item）相关的所有字段定义、取值范围和业务含义。

## 核心数据结构

### 1. EnhancedProduct 接口
订单详情页主要使用的增强商品数据结构，包含完整的履约信息。

```typescript
interface EnhancedProduct {
  // 基础商品信息
  id: string;                        // 商品唯一标识
  name: string;                      // 商品名称
  category: string;                  // 商品分类（格式：类别 | 子类别 | 规格）
  snCode: string;                    // SN编码/SKU
  uom: string;                       // 计量单位
  price: number;                     // 单价
  discount: number;                  // 折扣金额
  tax: number;                       // 税费
  color: string;                     // 商品颜色（用于UI显示）
  
  // 数量相关字段
  originalQuantity: number;          // 原始购买数量
  shouldDispatchQuantity: number;    // 应发货数量
  dispatchedQuantity: number;        // 已下发数量
  shippedQuantity: number;           // 已shipped数量
  fulfillmentQuantity: number;       // 当前需要履约的数量
  cancelledQuantity: number;         // 已取消数量
  returnedQuantity: number;          // 已退货数量
  exchangedQuantity: number;         // 已换货数量
  refundedQuantity: number;          // 已退款数量
  
  // 状态字段
  productStatus: string;             // 商品状态
  fulfillmentStatus: string;         // 履约状态
  
  // 操作历史相关
  hasOperations: boolean;            // 是否有操作历史
  operationTypes: string[];          // 操作类型列表
  history: ProductHistoryRecord[];   // 操作历史记录
  
  // 换货相关（可选）
  isExchangeProduct?: boolean;       // 是否为换货商品
  originalProductId?: string;        // 原商品ID（换货商品使用）
}
```

### 2. ProductHistoryRecord 接口
商品操作历史记录结构。

```typescript
interface ProductHistoryRecord {
  type: string;                      // 操作类型
  action: string;                    // 操作描述
  beforeQuantity: number;            // 操作前数量
  afterQuantity: number;             // 操作后数量
  reason: string;                    // 操作原因
  time: string;                      // 操作时间
}
```

## 字段详细说明

### 基础商品信息字段

| 字段名 | 类型 | 说明 | 示例值 | 备注 |
|--------|------|------|--------|------|
| `id` | string | 商品唯一标识符 | "P001", "P003-EX" | 换货商品会有特殊后缀 |
| `name` | string | 商品名称 | "蓝色连衣裙", "黑色运动鞋" | 显示给用户的商品名称 |
| `category` | string | 商品分类信息 | "女装 \| 连衣裙 \| M码" | 格式：主类别\|子类别\|规格 |
| `snCode` | string | SN编码/SKU | "SN001234567" | 商品的唯一编码 |
| `uom` | string | 计量单位 | "PCS", "PAIR", "SET" | 商品的计量单位 |
| `price` | number | 商品单价 | 89.99, 199.99 | 单位：美元 |
| `discount` | number | 折扣金额 | 5.00, 20.00 | 单位：美元 |
| `tax` | number | 税费 | 8.10, 18.00 | 单位：美元 |
| `color` | string | 颜色标识 | "linear-gradient(45deg, #3B82F6, #1E40AF)" | 用于UI显示的渐变色 |

### 数量相关字段

| 字段名 | 类型 | 说明 | 计算公式 | 示例值 |
|--------|------|------|----------|--------|
| `originalQuantity` | number | 原始购买数量 | 客户下单时的数量 | 3, 5, 2 |
| `shouldDispatchQuantity` | number | 应发货数量 | originalQuantity - cancelledQuantity - returnedQuantity - exchangedQuantity - refundedQuantity | 2, 3, 1 |
| `dispatchedQuantity` | number | 已下发数量 | 已经下发到仓库的数量 | 1, 3, 0 |
| `shippedQuantity` | number | 已发货数量 | 已经发货的数量 | 1, 2, 0 |
| `fulfillmentQuantity` | number | 履约数量 | 当前需要履约的数量，通常等于shouldDispatchQuantity | 2, 3, 1 |
| `cancelledQuantity` | number | 已取消数量 | 客户或系统取消的数量 | 1, 0, 0 |
| `returnedQuantity` | number | 已退货数量 | 客户退货的数量 | 0, 2, 0 |
| `exchangedQuantity` | number | 已换货数量 | 换货退回的数量 | 0, 0, 1 |
| `refundedQuantity` | number | 已退款数量 | 直接退款的数量 | 0, 0, 0 |

### 状态字段

#### productStatus（商品状态）
| 取值 | 说明 | 使用场景 |
|------|------|----------|
| "待发货" | 商品等待发货 | 默认状态，商品已确认但未发货 |
| "已取消" | 商品已取消 | 客户或系统取消了该商品 |
| "已退货" | 商品已退货 | 客户退回了该商品 |
| "已退款" | 商品已退款 | 直接退款，无需退货 |
| "已发货" | 商品已发货 | 商品已经发出 |

#### fulfillmentStatus（履约状态）
| 取值 | 说明 | 业务含义 |
|------|------|----------|
| `NO_FULFILLMENT` | 无需履约 | 商品已全部取消或退款 |
| `HOLD` | 暂停履约 | 订单被暂停，等待处理 |
| `TO_BE_DISPATCHED` | 待下发 | 等待下发到仓库 |
| `DISPATCHED` | 已下发 | 已下发到仓库，等待发货 |
| `PARTIALLY_DISPATCHED` | 部分下发 | 只有部分数量下发到仓库 |
| `CANCELED` | 已取消 | 履约已取消 |
| `PARTIALLY_SHIPPED` | 部分发货 | 只有部分数量已发货 |
| `SHIPPED` | 已发货 | 全部数量已发货 |
| `SHORT_SHIPPED` | 短发 | 发货数量少于应发数量 |

### 操作历史字段

#### operationTypes（操作类型列表）
| 取值 | 说明 | 对应操作 |
|------|------|----------|
| `cancel` | 取消操作 | 客户或系统取消商品 |
| `return` | 退货操作 | 客户申请退货 |
| `exchange` | 换货操作 | 客户申请换货（原商品） |
| `exchange_new` | 换货新品 | 换货生成的新商品 |
| `refund` | 退款操作 | 直接退款 |

#### history（操作历史记录）
每条历史记录包含以下字段：

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `type` | string | 操作类型 | "cancel", "return", "exchange" |
| `action` | string | 操作描述 | "客户取消部分数量", "客户申请退货" |
| `beforeQuantity` | number | 操作前数量 | 3, 5, 2 |
| `afterQuantity` | number | 操作后数量 | 2, 3, 1 |
| `reason` | string | 操作原因 | "客户主动取消，不需要此商品" |
| `time` | string | 操作时间 | "2024-02-16 14:30:00" |

### 换货相关字段

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `isExchangeProduct` | boolean? | 是否为换货商品 | true, false |
| `originalProductId` | string? | 原商品ID | "P003" |

## 业务规则

### 1. 数量计算规则
```
应发货数量 = 原始购买数量 - 已取消数量 - 已退货数量 - 已换货数量 - 已退款数量
```

### 2. 金额计算规则
```typescript
// 单行总价计算
lineTotal = (price * quantity) - (discount * quantity / originalQuantity) + (tax * quantity / originalQuantity)

// 退款金额计算
refundAmount = calculateLineTotal(cancelledQuantity) + calculateLineTotal(returnedQuantity) + calculateLineTotal(refundedQuantity)
```

### 3. 状态流转规则
- 商品创建时默认状态为 `TO_BE_DISPATCHED`
- 下发到仓库后变为 `DISPATCHED`
- 部分发货时为 `PARTIALLY_SHIPPED`
- 全部发货后为 `SHIPPED`
- 取消后为 `CANCELED`

### 4. 编辑权限规则
- 只有状态为 `TO_BE_DISPATCHED` 的商品可以编辑
- 已下发（`DISPATCHED`）或已发货的商品不可编辑
- 已取消的商品不可编辑

## 界面显示规则

### 1. 操作汇总标签
在商品信息列显示操作汇总：
- 取消数量 > 0：显示红色标签 "Cancelled X"
- 退货数量 > 0：显示橙色标签 "Returned X"  
- 换货数量 > 0：显示蓝色标签 "Exchanged X"

### 2. 换货商品标识
- 换货商品显示橙色标签 "Exchange Product"
- 显示原商品ID信息

### 3. 数量显示格式
- 已下发数量：显示为 "X/Y" 格式（已下发/应下发）
- 已发货数量：显示为 "X/Y" 格式（已发货/已下发）

### 4. 金额显示
- 当前履约金额：基于应发货数量计算
- 原始金额：基于原始购买数量计算（如有差异则显示）
- 退款金额：以红色显示，前缀 "Refund: -$"

## 示例数据

### 正常商品示例
```json
{
  "id": "P001",
  "name": "蓝色连衣裙",
  "category": "女装 | 连衣裙 | M码",
  "snCode": "SN001234567",
  "uom": "PCS",
  "price": 89.99,
  "discount": 5.00,
  "tax": 8.10,
  "originalQuantity": 3,
  "shouldDispatchQuantity": 2,
  "dispatchedQuantity": 1,
  "shippedQuantity": 1,
  "cancelledQuantity": 1,
  "fulfillmentStatus": "PARTIALLY_SHIPPED",
  "hasOperations": true,
  "operationTypes": ["cancel"]
}
```

### 换货商品示例
```json
{
  "id": "P003-EX",
  "name": "黑色运动鞋",
  "category": "鞋类 | 运动鞋 | 43码",
  "snCode": "SN001234569-EX",
  "isExchangeProduct": true,
  "originalProductId": "P003",
  "fulfillmentStatus": "TO_BE_DISPATCHED"
}
```

## 注意事项

1. **数据一致性**：确保各数量字段的计算结果符合业务逻辑
2. **状态同步**：履约状态需要与实际业务流程保持同步
3. **历史记录**：所有数量变更都应记录在操作历史中
4. **换货处理**：换货会产生两条记录（原商品和新商品）
5. **权限控制**：编辑操作需要检查商品状态和用户权限

---

*文档版本：1.0*  
*最后更新：2024-02-20*  
*维护者：OMS开发团队* 