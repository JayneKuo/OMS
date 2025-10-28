# 订单合并 - 四大必要条件

## 📋 核心原则

订单合并系统设置了**四个不可关闭的必要条件**，这些是保证合并逻辑正确性、安全性和业务合规的底线。

## 🔒 四大必要条件

### 1️⃣ Same Customer（同一客户）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- 🔐 **隐私保护** - 防止不同客户的订单信息泄露
- 💰 **财务安全** - 确保订单金额和支付归属正确
- ⚖️ **法律合规** - 遵守数据保护法规（GDPR、CCPA等）
- 😊 **客户体验** - 避免客户收到他人订单的通知

---

### 2️⃣ Same Shipping Address（同一收货地址）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- 📦 **物流基本原则** - 一个包裹只能送到一个地址
- 💵 **成本控制** - 避免多次配送增加成本
- ⚡ **操作效率** - 简化仓库拣货和打包流程
- 🎯 **客户期望** - 客户期望订单送到指定地址

---

### 3️⃣ Same Warehouse（同一仓库）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- 🏭 **物理限制** - 不同仓库的货物无法在同一包裹中发出
- 📊 **库存独立** - 每个仓库有独立的库存管理系统
- 🔄 **发货流程** - 不同仓库有不同的操作流程和标准
- 💰 **物流成本** - 跨仓库合并会产生额外的调拨成本

---

### 4️⃣ Same Sales Channel（同一销售渠道）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- 🏪 **订单号管理** - 不同渠道有不同的订单号规则和格式
- 💳 **财务对账** - 不同渠道需要独立对账和结算
- 🔄 **退换货政策** - 每个渠道有自己的退换货规则
- 💰 **佣金计算** - 不同渠道的佣金和费率不同
- 📊 **数据报表** - 运营需要按渠道统计数据
- 🔗 **API集成** - 不同渠道的API回调和同步逻辑不同

**风险示例**（如果允许关闭）:
```yaml
❌ 错误场景:
订单 A: 来自 Amazon
  - 订单号: AMZ-123456
  - 佣金: 15%
  - 退货政策: 30天无理由退货
  - 需要回传 FBA 物流信息

订单 B: 来自 eBay
  - 订单号: EBY-789012
  - 佣金: 12%
  - 退货政策: 14天退货
  - 需要更新 eBay tracking

如果合并:
  ❌ 订单号冲突：一个合并单有两个不同格式的订单号
  ❌ 佣金计算错误：无法确定使用哪个渠道的费率
  ❌ 退货流程混乱：不同政策无法同时满足
  ❌ API回传失败：Amazon和eBay需要不同的数据格式
  ❌ 财务对账困难：无法区分渠道收入
  ❌ 运营报表错误：渠道数据统计不准确
```

**业务场景分析**:

```yaml
场景 1: 跨渠道客户
客户: John Smith
订单 A: Amazon 下单，商品 X
订单 B: eBay 下单，商品 Y
地址: 相同

正确处理:
  ✅ 两个订单分别处理
  ✅ Amazon 订单回传 Amazon
  ✅ eBay 订单回传 eBay
  ✅ 财务对账清晰

场景 2: 渠道政策差异
Amazon FBA: 需要特殊标签和包装
Shopify: 可以直接发货
Walmart: 需要合规文件

如果合并不同渠道:
  ❌ 无法满足每个渠道的特殊要求
  ❌ 可能导致渠道处罚
  ❌ 客户体验差异大

场景 3: 财务结算
不同渠道结算周期不同:
  - Amazon: 每14天结算
  - eBay: 每周结算
  - Shopify: 实时到账

合并后无法正确计算每个渠道的应收款
```

---

## 📊 四大必要条件总览

| 条件 | 保护目标 | 不可关闭原因 | 违反后果 |
|------|---------|------------|---------|
| **Customer** | 客户隐私 | 法律法规 | 隐私泄露、法律风险 |
| **Address** | 物流准确 | 物理限制 | 配送错误、客户投诉 |
| **Warehouse** | 库存管理 | 物理限制 | 无法发货、成本增加 |
| **Channel** | 业务规则 | 渠道差异 | 对账错误、政策冲突 |

---

## 🎯 完整条件分类

| 条件 | 类型 | 可关闭 | 说明 |
|------|------|--------|------|
| **Customer** | 🔒 必须 | ❌ | 隐私和法律要求 |
| **Address** | 🔒 必须 | ❌ | 物流基本原则 |
| **Warehouse** | 🔒 必须 | ❌ | 库存管理原则 |
| **Channel** | 🔒 必须 | ❌ | 渠道业务规则 |
| Recipient Name | ⚪ 可选 | ✅ | 家庭成员可能不同 |
| Phone | ⚪ 可选 | ✅ | 同一人可能多个电话 |
| Email | ⚪ 可选 | ✅ | 同一人可能多个邮箱 |
| Carrier | ⚪ 可选 | ✅ | 业务灵活配置 |
| Shipping Method | ⚪ 可选 | ✅ | 业务灵活配置 |
| Payment Method | ⚪ 可选 | ✅ | 业务灵活配置 |
| Currency | ⚪ 可选 | ✅ | 跨境场景可选 |
| Tags | ⚪ 可选 | ✅ | 业务灵活配置 |

---

## 🎨 UI 展示

### 四大必要条件的视觉设计

```
┌────────────────────────────────────────────────┐
│ 🔴 Same Customer [Required]                    │
│    Match customer ID - Cannot be disabled for  │
│    safety                                      │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🔴 Same Shipping Address [Required]            │
│    Identical delivery address - Cannot be      │
│    disabled for logistics safety               │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🔴 Same Warehouse [Required]                   │
│    Allocated to same warehouse - Different     │
│    warehouses cannot merge for logistics       │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🔴 Same Sales Channel [Required]               │
│    Same order source channel - Different       │
│    channels have different business rules      │
└────────────────────────────────────────────────┘
```

---

## 💻 技术实现

### 前端强制

```typescript
const REQUIRED_CONDITIONS = [
  'match_customer',
  'match_shipping_address',
  'match_warehouse',
  'match_channel'
]

const handleRuleTypeChange = (type: string) => {
  if (type === 'order_merge') {
    ruleForm.value.actions = [{
      type: 'merge_orders',
      config: {
        // 四大必要条件，始终为 true
        match_customer: true,
        match_shipping_address: true,
        match_warehouse: true,
        match_channel: true,
        
        // 其他可选条件
        match_phone: false,
        match_email: false,
        // ...
      }
    }]
  }
}
```

### 后端验证

```python
REQUIRED_CONDITIONS = [
    'match_customer',
    'match_shipping_address',
    'match_warehouse',
    'match_channel'
]

def validate_merge_rule(rule_config):
    """验证合并规则的必要条件"""
    for condition in REQUIRED_CONDITIONS:
        if not rule_config.get(condition):
            raise ValidationError(
                f"Required condition '{condition}' must be enabled"
            )
    return True


def merge_orders(orders, config):
    """合并订单前的四项验证"""
    
    # 1. 验证客户
    customer_ids = set(o.customer_id for o in orders)
    if len(customer_ids) > 1:
        raise MergeError("Cannot merge orders from different customers")
    
    # 2. 验证地址
    addresses = set(o.shipping_address for o in orders)
    if len(addresses) > 1:
        raise MergeError("Cannot merge orders with different addresses")
    
    # 3. 验证仓库
    warehouses = set(o.warehouse_id for o in orders)
    if len(warehouses) > 1:
        raise MergeError("Cannot merge orders from different warehouses")
    
    # 4. 验证渠道
    channels = set(o.sales_channel for o in orders)
    if len(channels) > 1:
        raise MergeError("Cannot merge orders from different channels")
    
    # 全部验证通过，执行合并
    return perform_merge(orders, config)
```

---

## 🔍 渠道差异详解

### 不同渠道的特殊要求

#### Amazon

```yaml
特殊要求:
  - FBA发货需要Amazon物流标签
  - 订单状态需要实时同步
  - 退货必须符合Amazon政策
  - 需要提供tracking信息
  - 佣金15%，每14天结算
  
数据格式:
  order_id: "123-1234567-1234567"
  fulfillment_channel: "AFN" 或 "MFN"
  shipping_service: "Standard" | "Expedited" | "Priority"
```

#### eBay

```yaml
特殊要求:
  - 48小时内发货
  - 必须提供tracking
  - 需要上传物流信息到eBay
  - 遵守eBay卖家政策
  - 佣金12%，每周结算
  
数据格式:
  order_id: "12-12345-12345"
  shipping_carrier: "USPS" | "UPS" | "FedEx"
  tracking_number: string
```

#### Shopify

```yaml
特殊要求:
  - 支持部分发货
  - webhook实时通知
  - 自定义发货选项
  - 灵活的退款政策
  - 无平台佣金，直接到账
  
数据格式:
  order_id: "#1001"
  order_number: 1001
  fulfillment_status: "fulfilled" | "partial"
```

#### Walmart

```yaml
特殊要求:
  - 必须两天内发货
  - 需要Walmart合规标签
  - 严格的质量要求
  - 特殊的退货流程
  - 佣金8-15%，月结
  
数据格式:
  order_id: "1234567890123"
  purchase_order_id: "PO123456"
  carrier_method: "Standard" | "Express"
```

---

## 💡 为什么可选条件不是必须的？

### 可以跨越的条件及原因

**Phone（电话）**:
```yaml
合理场景:
  订单 A: +1-555-0001 (手机)
  订单 B: +1-555-0002 (座机)
  客户: 同一人
  
✅ 可以合并
原因: 同一个人可能有多个联系电话
```

**Email（邮箱）**:
```yaml
合理场景:
  订单 A: john@gmail.com (个人)
  订单 B: john@company.com (工作)
  客户: 同一人
  
✅ 可以合并
原因: 同一个人可能使用不同邮箱
```

**Payment Method（支付方式）**:
```yaml
合理场景:
  订单 A: 信用卡
  订单 B: PayPal
  客户: 同一人
  
✅ 可以合并
原因: 支付方式不影响发货
```

---

## ⚠️ 常见问题

### Q1: 为什么渠道不能跨？客户不关心订单来自哪个平台

**A**: 虽然客户不关心，但系统和运营关心：

1. **技术层面**:
   - 不同渠道的API接口不同
   - 订单状态同步机制不同
   - 数据格式和字段要求不同

2. **财务层面**:
   - 不同渠道的佣金不同
   - 结算周期不同
   - 对账单据不同

3. **运营层面**:
   - 退换货政策不同
   - 客服处理流程不同
   - 绩效统计需要分渠道

### Q2: 同一客户在不同渠道下单，真的不能合并吗？

**A**: 是的，不能合并。建议：

```yaml
最佳实践:
  - 同一渠道内合并订单
  - 不同渠道分别发货
  - 客户可能会收到多个包裹

优化建议:
  - 鼓励客户使用同一渠道购买
  - 提供"购物车合并"功能
  - 在客户下单前提示可能的多包裹情况
```

### Q3: 所有渠道都必须严格区分吗？

**A**: 是的，即使是同一公司的不同店铺：

```yaml
例子:
  店铺 A: Amazon US
  店铺 B: Amazon UK
  
虽然都是Amazon，但:
  - 结算账户不同
  - 报税要求不同
  - 物流体系不同
  - 必须分开处理
```

---

## ✅ 测试清单

### 功能测试
- [ ] 四个必要条件开关显示为禁用状态
- [ ] 四个必要条件保持在开启位置
- [ ] 四个必要条件显示红色 Required 标签
- [ ] 保存时强制这四个条件为 true

### 业务测试
- [ ] 不同客户订单无法合并
- [ ] 不同地址订单无法合并
- [ ] 不同仓库订单无法合并
- [ ] 不同渠道订单无法合并
- [ ] 四个条件相同的订单可以合并

### 渠道测试
- [ ] Amazon订单只能与Amazon订单合并
- [ ] eBay订单只能与eBay订单合并
- [ ] Shopify订单只能与Shopify订单合并
- [ ] 跨渠道合并被正确拒绝

---

## 📚 相关文档

- [Order Merge Rules Guide](./order_merge_rules_guide.md)
- [Order Merge Conditions](./order_merge_conditions_optimization.md)
- [Three Required Conditions](./order_merge_three_required_conditions.md)

---

**更新时间**: 2024-03-20  
**版本**: v5.0  
**作者**: AI Assistant

