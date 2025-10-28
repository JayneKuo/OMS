# 订单合并 - 三大必要条件

## 📋 核心原则

订单合并系统设置了**三个不可关闭的必要条件**，这些是保证合并逻辑正确性和安全性的底线。

## 🔒 三大必要条件

### 1️⃣ Same Customer（同一客户）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- 🔐 **隐私保护** - 防止不同客户的订单信息泄露
- 💰 **财务安全** - 确保订单金额和支付归属正确
- ⚖️ **法律合规** - 遵守数据保护法规（GDPR、CCPA等）
- 😊 **客户体验** - 避免客户收到他人订单的通知

**风险示例**（如果允许关闭）:
```yaml
❌ 错误场景:
订单 A: 客户 John Smith, $100
订单 B: 客户 Mary Johnson, $200

如果合并:
  - 订单通知发给错误的人
  - 财务记录混乱
  - 隐私泄露风险
  - 法律纠纷风险
```

---

### 2️⃣ Same Shipping Address（同一收货地址）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- 📦 **物流基本原则** - 一个包裹只能送到一个地址
- 💵 **成本控制** - 避免多次配送增加成本
- ⚡ **操作效率** - 简化仓库拣货和打包流程
- 🎯 **客户期望** - 客户期望订单送到指定地址

**风险示例**（如果允许关闭）:
```yaml
❌ 错误场景:
订单 A: 纽约 123 Main St
订单 B: 洛杉矶 456 Park Ave

如果合并:
  - 包裹只能送到一个地址
  - 另一个地址收不到货
  - 客户投诉
  - 额外物流成本
```

---

### 3️⃣ Same Warehouse（同一仓库）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- 🏭 **物理限制** - 不同仓库的货物无法在同一包裹中发出
- 📊 **库存独立** - 每个仓库有独立的库存管理系统
- 🔄 **发货流程** - 不同仓库有不同的操作流程和标准
- 💰 **物流成本** - 跨仓库合并会产生额外的调拨成本
- ⏱️ **时效保障** - 同仓库发货可以确保配送时效

**风险示例**（如果允许关闭）:
```yaml
❌ 错误场景:
订单 A: 纽约仓库
订单 B: 洛杉矶仓库
客户地址: 纽约

如果合并:
  方案 1: 从纽约仓发货
    - 洛杉矶仓库的货需要先调拨到纽约 ❌
    - 增加 3-5 天时间
    - 增加调拨成本
  
  方案 2: 从洛杉矶仓发货
    - 纽约仓库的货需要先调拨到洛杉矶 ❌
    - 增加运输距离
    - 客户等待时间更长
  
  方案 3: 分两次发货
    - 那就不应该合并 ❌
    - 失去合并的意义
```

**特殊说明**: 
- 此条件主要针对 **DN Level**（已分配仓库）
- SO Level 时订单还未分配仓库，但系统应确保合并后的订单分配到同一仓库

---

## 📊 必要条件总览

| 条件 | 保护目标 | 不可关闭原因 | 违反后果 |
|------|---------|------------|---------|
| **Customer** | 客户隐私 | 法律法规 | 隐私泄露、法律风险 |
| **Address** | 物流准确 | 物理限制 | 配送错误、客户投诉 |
| **Warehouse** | 库存管理 | 物理限制 | 无法发货、成本增加 |

## 🎯 可选条件对比

| 条件 | 类型 | 可关闭 | 说明 |
|------|------|--------|------|
| **Customer** | 🔒 必须 | ❌ | 隐私和法律要求 |
| **Address** | 🔒 必须 | ❌ | 物流基本原则 |
| **Warehouse** | 🔒 必须 | ❌ | 库存管理原则 |
| Recipient Name | ⚪ 可选 | ✅ | 家庭成员可能不同 |
| Phone | ⚪ 可选 | ✅ | 同一人可能多个电话 |
| Email | ⚪ 可选 | ✅ | 同一人可能多个邮箱 |
| Carrier | ⚪ 可选 | ✅ | 业务灵活配置 |
| Shipping Method | ⚪ 可选 | ✅ | 业务灵活配置 |
| Payment Method | ⚪ 可选 | ✅ | 业务灵活配置 |
| Currency | ⚪ 可选 | ✅ | 跨境场景可选 |
| Channel | ⚪ 可选 | ✅ | 多渠道可合并 |
| Tags | ⚪ 可选 | ✅ | 业务灵活配置 |

---

## 🎨 UI 展示

### 必要条件的视觉设计

```
┌────────────────────────────────────────────────┐
│ 🔴 Same Customer [Required]                    │
│    Match customer ID - Cannot be disabled for  │
│    safety                                      │
│    [⚙️ Configure]                              │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🔴 Same Shipping Address [Required]            │
│    Identical delivery address - Cannot be      │
│    disabled for logistics safety               │
│    [⚙️ Configure]                              │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🔴 Same Warehouse [Required]                   │
│    Allocated to same warehouse - Different     │
│    warehouses cannot merge for logistics       │
│    [⚙️ Configure]                              │
└────────────────────────────────────────────────┘
```

### 设计特点

1. **左侧红色边框** - 突出必要条件
2. **淡红色渐变背景** - 视觉区分
3. **Required 红色标签** - 明确标识
4. **禁用的开关** - 保持开启但无法操作
5. **详细说明** - 解释不可关闭的原因

---

## 💻 技术实现

### 前端强制

```vue
<!-- 必要条件模板 -->
<div class="condition-item-advanced required-condition">
  <div class="condition-header">
    <!-- 开关禁用但保持开启 -->
    <el-switch 
      v-model="ruleForm.actions[0].config.match_warehouse" 
      disabled 
    />
    <div class="condition-label">
      <span class="label-text">
        Same Warehouse
        <el-tag size="small" type="danger" effect="plain">Required</el-tag>
      </span>
      <span class="label-desc">
        Allocated to same warehouse - Different warehouses cannot merge
      </span>
    </div>
  </div>
</div>
```

### 数据初始化

```typescript
const handleRuleTypeChange = (type: string) => {
  if (type === 'order_merge') {
    ruleForm.value.actions = [{
      type: 'merge_orders',
      config: {
        // 三大必要条件，始终为 true
        match_customer: true,
        match_shipping_address: true,
        match_warehouse: true,
        
        // 其他可选条件
        match_phone: false,
        match_email: false,
        // ...
      }
    }]
  }
}
```

### 保存前验证

```typescript
const handleSaveRule = () => {
  if (ruleType.value === 'order_merge') {
    // 强制确保三大必要条件
    const config = ruleForm.value.actions[0].config
    config.match_customer = true
    config.match_shipping_address = true
    config.match_warehouse = true
  }
  
  // 保存规则
  saveRule(ruleForm.value)
}
```

### 后端验证

```python
def validate_merge_rule(rule_config):
    """验证合并规则的必要条件"""
    
    required_conditions = [
        'match_customer',
        'match_shipping_address', 
        'match_warehouse'
    ]
    
    for condition in required_conditions:
        if not rule_config.get(condition):
            raise ValidationError(
                f"Required condition '{condition}' must be enabled"
            )
    
    return True


def merge_orders(orders, config):
    """合并订单前验证"""
    
    # 验证客户
    customer_ids = set(o.customer_id for o in orders)
    if len(customer_ids) > 1:
        raise MergeError("Cannot merge orders from different customers")
    
    # 验证地址
    addresses = set(o.shipping_address for o in orders)
    if len(addresses) > 1:
        raise MergeError("Cannot merge orders with different addresses")
    
    # 验证仓库
    warehouses = set(o.warehouse_id for o in orders)
    if len(warehouses) > 1:
        raise MergeError("Cannot merge orders from different warehouses")
    
    # 执行合并
    return perform_merge(orders, config)
```

---

## 🔍 业务场景深度分析

### 场景 1: 为什么仓库必须相同？

**实际运营场景**:

```yaml
公司配置:
  - 东部仓库（纽约）
  - 西部仓库（洛杉矶）
  - 中部仓库（芝加哥）

订单情况:
  订单 A:
    客户: John Smith
    地址: 纽约 123 Main St
    分配: 东部仓库
    商品: iPhone × 1
  
  订单 B:
    客户: John Smith (同一客户)
    地址: 纽约 123 Main St (同一地址)
    分配: 西部仓库
    商品: iPad × 1

问题分析:
  如果允许合并:
    ❌ 需要从西部仓库调拨 iPad 到东部仓库
    ❌ 调拨时间: 3-5 天
    ❌ 调拨成本: $50-100
    ❌ 客户等待时间延长
    ❌ 库存准确性下降
  
  正确做法:
    ✅ 两个订单分别发货
    ✅ 东部仓发 iPhone
    ✅ 西部仓发 iPad
    ✅ 客户更快收到商品
    ✅ 成本更低
```

### 场景 2: 多仓库复杂情况

```yaml
场景: 电商平台有 10 个区域仓库

客户: VIP 客户 Mary Johnson
地址: 波士顿

订单流水:
  订单 1: 8:00 AM - 图书 × 3 → 分配到波士顿仓
  订单 2: 9:00 AM - 衣服 × 2 → 分配到纽约仓
  订单 3: 10:00 AM - 电子产品 × 1 → 分配到波士顿仓
  订单 4: 11:00 AM - 食品 × 5 → 分配到波士顿仓

分析:
  波士顿仓订单: 1, 3, 4
    ✅ 可以合并（同仓库）
    ✅ 节省包装和运费
  
  纽约仓订单: 2
    ❌ 不能与其他订单合并（不同仓库）
    ✅ 单独发货
    
  结果:
    - 2 个包裹（波士顿仓 1 个，纽约仓 1 个）
    - 而不是 4 个包裹
    - 节省了 50% 的包装和运费
```

---

## ⚠️ 例外情况处理

### 情况 1: SO Level vs DN Level

**SO Level（Sales Order）**:
- 订单刚创建，还未分配仓库
- 系统应确保合并后分配到同一仓库
- 条件逻辑：如果合并，则一起分配仓库

**DN Level（Delivery Note）**:
- 订单已分配仓库
- 必须严格检查仓库是否相同
- 条件逻辑：仓库不同，拒绝合并

```python
def can_merge_at_so_level(orders):
    """SO Level 合并检查"""
    # SO 阶段还没有仓库分配
    # 但要确保合并后能分配到同一仓库
    
    # 检查客户和地址
    if not check_customer_and_address(orders):
        return False
    
    # 检查是否可以分配到同一仓库
    available_warehouse = find_common_warehouse(orders)
    if not available_warehouse:
        return False, "No common warehouse can fulfill all orders"
    
    return True


def can_merge_at_dn_level(orders):
    """DN Level 合并检查"""
    # DN 阶段必须检查仓库分配
    
    warehouses = set(o.allocated_warehouse for o in orders)
    if len(warehouses) > 1:
        return False, "Orders allocated to different warehouses"
    
    return True
```

### 情况 2: 特殊权限处理

**即使是系统管理员，也不应允许跨仓库合并**：

```python
# ❌ 错误：给管理员特权
if user.is_super_admin:
    allow_cross_warehouse_merge = True  # 危险！

# ✅ 正确：任何人都受限制
IMMUTABLE_RULES = [
    'match_customer',
    'match_shipping_address',
    'match_warehouse'
]

def validate_merge(orders, user):
    # 无论用户权限，都必须遵守基本规则
    validate_required_conditions(orders)
    return perform_merge(orders)
```

---

## ✅ 测试清单

### 功能测试

- [ ] 三个必要条件开关显示为禁用状态
- [ ] 三个必要条件开关保持在开启位置
- [ ] 三个必要条件显示红色 Required 标签
- [ ] 三个必要条件有红色左边框和淡红背景
- [ ] 尝试保存时强制设置这三个条件为 true
- [ ] 后端验证拒绝没有必要条件的规则

### 业务测试

- [ ] 不同客户订单无法合并
- [ ] 不同地址订单无法合并
- [ ] 不同仓库订单无法合并
- [ ] 同客户同地址同仓库订单可以合并
- [ ] 错误提示信息清晰明确

### 压力测试

- [ ] 大量订单合并性能测试
- [ ] 并发合并请求处理
- [ ] 错误恢复机制验证

---

## 📚 相关文档

- [Order Merge Rules Guide](./order_merge_rules_guide.md) - 合单规则基础
- [Order Merge Conditions](./order_merge_conditions_optimization.md) - 条件扩展
- [Order Merge Required Conditions](./order_merge_required_conditions.md) - 必要条件详解

---

**更新时间**: 2024-03-20  
**版本**: v4.0  
**作者**: AI Assistant

