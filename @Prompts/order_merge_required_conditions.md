# 订单合并 - 必要条件（Required Conditions）

## 📋 功能概述

为了确保订单合并的安全性和正确性，系统设置了两个**不可关闭的必要条件**，这些条件在任何情况下都必须满足才能合并订单。

## 🔒 必要条件

### 1️⃣ Same Customer（同一客户）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- ✅ **隐私保护** - 防止不同客户的订单信息泄露
- ✅ **财务安全** - 确保订单金额和支付归属正确
- ✅ **法律合规** - 遵守数据保护法规（GDPR、CCPA等）
- ✅ **客户体验** - 避免客户收到他人订单的通知

**风险场景**（如果允许关闭）:
```yaml
❌ 错误示例:
订单 A: 客户 John Smith, 订单金额 $100
订单 B: 客户 Mary Johnson, 订单金额 $200
结果: 合并后，一个客户会收到另一个客户的订单信息

潜在问题:
  - 隐私泄露
  - 财务纠纷
  - 法律风险
  - 客户投诉
```

---

### 2️⃣ Same Shipping Address（同一收货地址）⚠️ **必须**

**状态**: 默认开启，不可关闭

**原因**:
- ✅ **物流基本原则** - 不同地址无法在同一包裹中配送
- ✅ **成本控制** - 避免多次配送增加成本
- ✅ **操作效率** - 简化仓库拣货和打包流程
- ✅ **客户期望** - 客户期望订单送到指定地址

**风险场景**（如果允许关闭）:
```yaml
❌ 错误示例:
订单 A: 配送到 纽约
订单 B: 配送到 洛杉矶
结果: 合并后，一个地址的客户收不到货

潜在问题:
  - 物流混乱
  - 配送错误
  - 客户投诉
  - 额外成本
```

---

## 🎨 UI 设计

### 视觉标识

```
┌────────────────────────────────────────────┐
│ 🔴 Same Customer [Required] (禁用开关)     │
│    Match customer ID - Cannot be disabled  │
│    for safety                              │
│    [⚙️ Configure]                          │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🔴 Same Shipping Address [Required]        │
│    Identical delivery address - Cannot be  │
│    disabled for logistics safety           │
│    [⚙️ Configure]                          │
└────────────────────────────────────────────┘
```

### 设计元素

1. **左侧红色边框** - 突出显示这是必要条件
2. **淡红色背景** - 渐变效果，视觉区分
3. **Required 标签** - 红色徽章，明确标识
4. **禁用开关** - 开关显示为禁用状态但保持开启
5. **说明文字** - 解释为什么不能关闭

---

## 💻 技术实现

### HTML 结构

```vue
<!-- Customer - Required -->
<div class="condition-item-advanced required-condition">
  <div class="condition-header">
    <el-switch 
      v-model="ruleForm.actions[0].config.match_customer" 
      disabled 
    />
    <div class="condition-label">
      <span class="label-text">
        Same Customer
        <el-tag size="small" type="danger" effect="plain">Required</el-tag>
      </span>
      <span class="label-desc">
        Match customer ID - Cannot be disabled for safety
      </span>
    </div>
  </div>
</div>
```

### CSS 样式

```css
/* 必要条件样式 */
.required-condition {
  background: linear-gradient(90deg, rgba(245, 108, 108, 0.03) 0%, transparent 100%);
  border-left: 3px solid var(--el-color-danger);
  padding-left: 13px !important;
}

.required-condition .label-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.required-condition .el-switch.is-disabled {
  opacity: 0.6;
}

.required-condition:hover {
  background: linear-gradient(90deg, rgba(245, 108, 108, 0.05) 0%, var(--el-fill-color-light) 100%);
}
```

### 数据保护

```typescript
// 初始化时强制设置为 true
const handleRuleTypeChange = (type: string) => {
  if (type === 'order_merge') {
    ruleForm.value.actions = [{
      type: 'merge_orders',
      config: {
        // 必要条件，始终为 true
        match_customer: true,
        match_shipping_address: true,
        // ... 其他条件
      }
    }]
  }
}

// 保存前验证
const handleSaveRule = () => {
  if (ruleType.value === 'order_merge') {
    // 强制确保必要条件为 true
    ruleForm.value.actions[0].config.match_customer = true
    ruleForm.value.actions[0].config.match_shipping_address = true
  }
  
  // ... 保存逻辑
}
```

---

## 📊 可选条件对比

| 条件 | 状态 | 原因 | 可关闭 |
|------|------|------|--------|
| **Same Customer** | ✅ 必须 | 隐私和安全 | ❌ |
| **Same Shipping Address** | ✅ 必须 | 物流基本原则 | ❌ |
| Same Recipient Name | ⚪ 可选 | 业务规则 | ✅ |
| Same Phone | ⚪ 可选 | 业务规则 | ✅ |
| Same Email | ⚪ 可选 | 业务规则 | ✅ |
| Same Warehouse | ⚪ 可选 | 业务规则 | ✅ |
| Same Carrier | ⚪ 可选 | 业务规则 | ✅ |
| Same Shipping Method | ⚪ 可选 | 业务规则 | ✅ |
| Same Payment Method | ⚪ 可选 | 业务规则 | ✅ |
| Same Currency | ⚪ 可选 | 业务规则 | ✅ |
| Same Channel | ⚪ 可选 | 业务规则 | ✅ |
| Same Tags | ⚪ 可选 | 业务规则 | ✅ |

---

## 🔍 业务场景分析

### 场景 1: 为什么不允许跨客户合并？

**假设**: 允许关闭 Customer 条件

```yaml
订单 A:
  客户: John Smith
  邮箱: john@example.com
  商品: iPhone × 1
  金额: $999

订单 B:
  客户: Mary Johnson
  邮箱: mary@example.com
  商品: iPad × 1
  金额: $799

地址: 相同（公司地址）

如果合并:
  ❌ John 收到了 Mary 的订单通知
  ❌ Mary 的支付记录出现在 John 的账户
  ❌ 订单跟踪链接泄露给错误的人
  ❌ 客服无法确定订单归属
  ❌ 退换货流程混乱
```

**结论**: 绝对不能跨客户合并 ❌

---

### 场景 2: 为什么不允许跨地址合并？

**假设**: 允许关闭 Address 条件

```yaml
订单 A:
  地址: 纽约 123 Main St
  商品: 商品 X × 1

订单 B:
  地址: 洛杉矶 456 Park Ave
  商品: 商品 Y × 1

客户: 相同

如果合并:
  物流方案 1: 发往纽约
    ❌ 洛杉矶的订单无法收到
  
  物流方案 2: 发往洛杉矶
    ❌ 纽约的订单无法收到
  
  物流方案 3: 分两次发货
    ❌ 那就不需要合并了
```

**结论**: 不同地址物理上无法合并 ❌

---

## ⚠️ 特殊情况处理

### 情况 1: 地址字段为空

```python
def validate_merge_conditions(order1, order2):
    """验证合并条件"""
    
    # Customer 检查
    if not order1.customer_id or not order2.customer_id:
        raise ValidationError("Customer ID is required")
    
    if order1.customer_id != order2.customer_id:
        raise ValidationError("Different customers cannot be merged")
    
    # Address 检查
    if not order1.shipping_address or not order2.shipping_address:
        raise ValidationError("Shipping address is required")
    
    if order1.shipping_address != order2.shipping_address:
        raise ValidationError("Different addresses cannot be merged")
    
    return True
```

### 情况 2: 系统管理员权限

即使是管理员，也不应该允许关闭这些必要条件：

```typescript
// ❌ 错误：给管理员开后门
if (user.isAdmin) {
  allowDisableRequiredConditions = true  // 危险！
}

// ✅ 正确：任何人都不能关闭
const REQUIRED_CONDITIONS = ['match_customer', 'match_shipping_address']
REQUIRED_CONDITIONS.forEach(condition => {
  config[condition] = true  // 强制为 true
  disabled[condition] = true  // 禁用开关
})
```

---

## 📝 用户教育

### 帮助文档说明

```markdown
Q: 为什么我不能关闭 "Same Customer" 条件？

A: 出于以下安全考虑，该条件必须始终启用：
   1. 保护客户隐私
   2. 防止订单混乱
   3. 确保财务准确
   4. 遵守法律法规

如果您需要合并不同客户的订单，请考虑：
   - 让客户使用同一账户下单
   - 联系客服手动处理特殊情况
```

```markdown
Q: 为什么我不能关闭 "Same Shipping Address" 条件？

A: 物流基本原则决定：
   1. 一个包裹只能送到一个地址
   2. 不同地址需要分开配送
   3. 合并不同地址会导致配送错误

如果客户需要配送到多个地址：
   - 每个地址将收到单独的包裹
   - 系统会自动优化同地址订单
```

### Tooltip 提示

在 UI 上悬停时显示：

```
💡 该条件不可关闭

原因：
  • 确保订单归属正确
  • 保护客户隐私
  • 遵守数据保护法规

如有特殊需求，请联系系统管理员。
```

---

## ✅ 测试场景

### 测试 1: 验证必要条件始终启用

```python
def test_required_conditions_always_enabled():
    """测试必要条件始终启用"""
    rule = create_merge_rule()
    
    # 尝试关闭必要条件
    rule.config['match_customer'] = False
    rule.config['match_shipping_address'] = False
    
    # 保存
    saved_rule = save_rule(rule)
    
    # 验证：必要条件被强制设置为 True
    assert saved_rule.config['match_customer'] == True
    assert saved_rule.config['match_shipping_address'] == True
```

### 测试 2: UI 开关不可操作

```javascript
test('required condition switches are disabled', () => {
  render(<OrderMergeRuleForm />)
  
  const customerSwitch = screen.getByRole('switch', { name: /Same Customer/ })
  const addressSwitch = screen.getByRole('switch', { name: /Same Shipping Address/ })
  
  // 验证：开关是禁用的
  expect(customerSwitch).toBeDisabled()
  expect(addressSwitch).toBeDisabled()
  
  // 验证：开关是打开的
  expect(customerSwitch).toBeChecked()
  expect(addressSwitch).toBeChecked()
})
```

### 测试 3: 后端验证

```python
def test_backend_validation():
    """测试后端验证必要条件"""
    
    # 尝试提交没有必要条件的规则
    rule_data = {
        'type': 'order_merge',
        'config': {
            'match_customer': False,  # 尝试关闭
            'match_warehouse': True
        }
    }
    
    with pytest.raises(ValidationError) as exc:
        create_rule(rule_data)
    
    assert "match_customer is required" in str(exc.value)
```

---

## 🚀 未来扩展

### 可能的其他必要条件

根据业务发展，可能会添加更多必要条件：

1. **Same Currency** - 在跨境电商场景下
   - 原因：不同货币无法在同一订单中结算
   
2. **Same Fulfillment Method** - 在多履约模式下
   - 原因：自营和第三方无法合并发货

3. **Same Legal Entity** - 在多主体运营下
   - 原因：不同法律主体的订单必须分开

### 动态必要条件

某些条件可能在特定场景下变为必要：

```typescript
// 根据业务规则动态设置必要条件
function getRequiredConditions(merchantId: string): string[] {
  const baseRequired = ['match_customer', 'match_shipping_address']
  
  // 跨境商户额外要求
  if (isCrossBorderMerchant(merchantId)) {
    baseRequired.push('match_currency')
  }
  
  // 多主体商户额外要求
  if (isMultiEntityMerchant(merchantId)) {
    baseRequired.push('match_legal_entity')
  }
  
  return baseRequired
}
```

---

## 📞 相关文档

- [Order Merge Rules Guide](./order_merge_rules_guide.md) - 合单规则基础
- [Order Merge Conditions](./order_merge_conditions_optimization.md) - 条件扩展
- [Order Merge Recipient Conditions](./order_merge_recipient_conditions.md) - 收货人条件

---

**更新时间**: 2024-03-20  
**版本**: v3.3  
**作者**: AI Assistant

