# 订单合并规则 - 指定值过滤功能文档

## 📋 功能概述

在原有的"相同性匹配"基础上，新增了"指定值过滤"功能，允许用户精确控制哪些订单可以被合并。

### 核心逻辑

1. **开启条件但不指定值** → 合并所有满足"相同"条件的订单
2. **开启条件并指定值** → 只合并指定值的订单

## 🎯 新增功能

### 1. Carrier（配送商）条件 ⭐

新增了 **Same Carrier** 匹配条件，用于控制配送商级别的合单：

- ✅ **Same Carrier** - 同一配送商
  - 匹配相同的配送商（UPS、FedEx、DHL、USPS、SF Express等）
  - 可指定特定配送商进行合并

### 2. 所有条件支持指定值过滤

每个匹配条件现在都可以配置具体的过滤值：

| 条件 | 默认行为 | 指定值后的行为 | 使用场景 |
|------|---------|--------------|---------|
| **Customer** | 合并相同客户的订单 | 只合并指定客户的订单 | VIP客户优先合单 |
| **Warehouse** | 合并相同仓库的订单 | 只合并指定仓库的订单 | 特定仓库专用规则 |
| **Carrier** | 合并相同配送商的订单 | 只合并指定配送商的订单 | 优先配送商合单优化 |
| **Shipping Method** | 合并相同配送方式的订单 | 只合并指定配送方式的订单 | 快递/标准分别处理 |
| **Payment Method** | 合并相同支付方式的订单 | 只合并指定支付方式的订单 | COD订单单独处理 |
| **Currency** | 合并相同货币的订单 | 只合并指定货币的订单 | 主要货币优先合单 |
| **Channel** | 合并相同渠道的订单 | 只合并指定渠道的订单 | 重点平台优先处理 |
| **Tags** | 合并相同标签的订单 | 只合并指定标签的订单 | 特殊标记订单管理 |

## 💻 UI 设计

### 条件展示

每个条件现在包含三部分：

```
┌─────────────────────────────────────────────────┐
│ [Switch] Same Customer                          │
│          Match customer ID                      │
│                          [⚙️ Configure] / [2 selected] │
│ ─────────────────────────────────────────────── │
│ [Select: CUST001, CUST002]                      │
│ 💡 Leave empty to merge all orders with same...│
└─────────────────────────────────────────────────┘
```

**组成部分：**
1. **开关** - 启用/禁用该条件
2. **配置按钮** - 点击展开/收起值配置
3. **值选择器** - 多选下拉框，支持搜索和创建

### 配置按钮状态

- **未配置值**: 显示 "Configure"
- **已配置值**: 显示 "X selected"（X为已选数量）

### 预览横幅

预览标签现在显示已选值数量：

```
Merge at Sales Order (SO) Level
────────────────────────────────────────────────
[Customer(2)] [Warehouse(1)] [Carrier(3)] [⏱️ 60min]
```

## 📊 数据结构

### Action Config 扩展

```typescript
{
  type: 'merge_orders',
  config: {
    // 条件开关
    match_customer: boolean,
    match_warehouse: boolean,
    match_carrier: boolean,      // ⭐ 新增
    match_shipping_method: boolean,
    match_payment_method: boolean,
    match_currency: boolean,
    match_channel: boolean,
    match_tags: boolean,
    
    // 指定值过滤（为空则匹配所有）⭐
    customer_filter_values: string[],
    customer_filter_expanded: boolean,
    
    warehouse_filter_values: string[],
    warehouse_filter_expanded: boolean,
    
    carrier_filter_values: string[],        // ⭐ 新增
    carrier_filter_expanded: boolean,       // ⭐ 新增
    
    shipping_method_filter_values: string[],
    shipping_method_filter_expanded: boolean,
    
    payment_method_filter_values: string[],
    payment_method_filter_expanded: boolean,
    
    currency_filter_values: string[],
    currency_filter_expanded: boolean,
    
    channel_filter_values: string[],
    channel_filter_expanded: boolean,
    
    tags_filter_values: string[],
    tags_filter_expanded: boolean,
    
    // 其他配置...
  }
}
```

### 字段说明

- **`*_filter_values`**: 指定值数组，为空则匹配所有
- **`*_filter_expanded`**: UI展开状态，不需要保存到后端

## 🎨 使用场景示例

### 场景 1: VIP客户专属快速合单

```yaml
规则名称: VIP客户快速合单
合并节点: SO Level
匹配条件:
  - Customer: ✓ [指定: CUST_VIP001, CUST_VIP002, CUST_VIP003]
  - Shipping Address: ✓
  - Carrier: ✓ [指定: UPS, FedEx]  # 只使用快递公司
  - Currency: ✓ [指定: USD]
时间窗口: 30分钟
触发模式: Immediate
```

**效果**: 只有这3个VIP客户、使用UPS或FedEx、美元订单会在30分钟内自动合并。

### 场景 2: 特定仓库优化合单

```yaml
规则名称: 深圳仓优化合单
合并节点: DN Level
匹配条件:
  - Customer: ✓
  - Shipping Address: ✓
  - Warehouse: ✓ [指定: WH_SHENZHEN]
  - Shipping Method: ✓  # 不指定，所有方式都可以
时间窗口: 2小时
触发模式: Scheduled (每15分钟)
```

**效果**: 只处理深圳仓的订单，所有配送方式都可以合并。

### 场景 3: 亚马逊订单特殊处理

```yaml
规则名称: Amazon订单合单
合并节点: SO Level
匹配条件:
  - Customer: ✓
  - Shipping Address: ✓
  - Channel: ✓ [指定: amazon]
  - Payment Method: ✓ [指定: credit_card, paypal]  # 排除COD
  - Tags: ✓ [指定: fba_ready]
时间窗口: 1小时
```

**效果**: 只合并Amazon渠道、非COD支付、带fba_ready标签的订单。

### 场景 4: 多货币混合场景

```yaml
规则名称: 主要货币快速合单
合并节点: SO Level
匹配条件:
  - Customer: ✓
  - Shipping Address: ✓
  - Currency: ✓ [指定: USD, EUR, GBP]  # 主要货币
  - Carrier: ✓ [指定: DHL, FedEx]      # 国际快递
时间窗口: 45分钟
```

**效果**: 优先处理主要货币的国际订单。

## 🔄 后端集成

### API 请求格式

```json
{
  "rule_id": 123,
  "name": "VIP Customer Priority Merge",
  "rule_type": "order_merge",
  "actions": [{
    "type": "merge_orders",
    "config": {
      "merge_node": "so",
      
      "match_customer": true,
      "customer_filter_values": ["CUST001", "CUST002"],
      
      "match_carrier": true,
      "carrier_filter_values": ["UPS", "FedEx"],
      
      "match_currency": true,
      "currency_filter_values": ["USD"],
      
      "time_window_enabled": true,
      "time_window_minutes": 30
    }
  }]
}
```

### 后端匹配逻辑

```python
def should_merge_orders(order1, order2, config):
    """
    判断两个订单是否应该合并
    
    Args:
        order1, order2: 待匹配的订单
        config: 合并规则配置
    
    Returns:
        bool: 是否应该合并
    """
    
    # 1. Customer 条件检查
    if config.match_customer:
        # 如果指定了客户列表，两个订单必须都在列表中
        if config.customer_filter_values:
            if (order1.customer_id not in config.customer_filter_values or 
                order2.customer_id not in config.customer_filter_values):
                return False
        
        # 如果没有指定，则要求customer_id相同
        if order1.customer_id != order2.customer_id:
            return False
    
    # 2. Carrier 条件检查
    if config.match_carrier:
        # 如果指定了配送商列表
        if config.carrier_filter_values:
            if (order1.carrier not in config.carrier_filter_values or 
                order2.carrier not in config.carrier_filter_values):
                return False
        
        # 如果没有指定，则要求carrier相同
        if order1.carrier != order2.carrier:
            return False
    
    # 3. Warehouse 条件检查
    if config.match_warehouse:
        if config.warehouse_filter_values:
            if (order1.warehouse not in config.warehouse_filter_values or 
                order2.warehouse not in config.warehouse_filter_values):
                return False
        
        if order1.warehouse != order2.warehouse:
            return False
    
    # ... 其他条件类似处理 ...
    
    return True


def find_mergeable_orders(orders, config):
    """
    找出可以合并的订单组
    
    Args:
        orders: 待处理的订单列表
        config: 合并规则配置
    
    Returns:
        List[List[Order]]: 可合并的订单组列表
    """
    
    mergeable_groups = []
    processed = set()
    
    for i, order1 in enumerate(orders):
        if order1.id in processed:
            continue
        
        # 当前订单组
        current_group = [order1]
        processed.add(order1.id)
        
        # 查找可以和order1合并的其他订单
        for order2 in orders[i+1:]:
            if order2.id in processed:
                continue
            
            # 检查是否可以合并
            if should_merge_orders(order1, order2, config):
                # 检查时间窗口
                if config.time_window_enabled:
                    time_diff = abs((order2.created_at - order1.created_at).total_seconds() / 60)
                    if time_diff > config.time_window_minutes:
                        continue
                
                # 检查合并数量限制
                if len(current_group) >= config.max_orders:
                    break
                
                current_group.append(order2)
                processed.add(order2.id)
        
        # 只有2个或以上订单才算一组
        if len(current_group) >= 2:
            mergeable_groups.append(current_group)
    
    return mergeable_groups
```

## ✅ 测试用例

### 测试 1: 指定客户过滤

```python
def test_customer_filter():
    config = {
        'match_customer': True,
        'customer_filter_values': ['CUST001', 'CUST002']
    }
    
    order1 = Order(customer_id='CUST001')
    order2 = Order(customer_id='CUST002')
    order3 = Order(customer_id='CUST003')
    
    # CUST001 和 CUST002 可以合并（都在列表中）
    assert should_merge_orders(order1, order2, config) == True
    
    # CUST001 和 CUST003 不能合并（CUST003不在列表中）
    assert should_merge_orders(order1, order3, config) == False
```

### 测试 2: 未指定值（匹配所有相同）

```python
def test_carrier_no_filter():
    config = {
        'match_carrier': True,
        'carrier_filter_values': []  # 未指定
    }
    
    order1 = Order(carrier='UPS')
    order2 = Order(carrier='UPS')
    order3 = Order(carrier='FedEx')
    
    # UPS 和 UPS 可以合并（相同）
    assert should_merge_orders(order1, order2, config) == True
    
    # UPS 和 FedEx 不能合并（不同）
    assert should_merge_orders(order1, order3, config) == False
```

### 测试 3: 多条件组合

```python
def test_multiple_conditions():
    config = {
        'match_customer': True,
        'customer_filter_values': ['CUST001'],
        'match_carrier': True,
        'carrier_filter_values': ['UPS', 'FedEx'],
        'match_currency': True,
        'currency_filter_values': ['USD']
    }
    
    order1 = Order(
        customer_id='CUST001',
        carrier='UPS',
        currency='USD'
    )
    
    order2 = Order(
        customer_id='CUST001',
        carrier='FedEx',
        currency='USD'
    )
    
    order3 = Order(
        customer_id='CUST001',
        carrier='DHL',  # 不在指定列表中
        currency='USD'
    )
    
    # order1 和 order2 可以合并（都满足所有条件）
    assert should_merge_orders(order1, order2, config) == True
    
    # order1 和 order3 不能合并（carrier不在列表中）
    assert should_merge_orders(order1, order3, config) == False
```

## 🎨 UI/UX 优化建议

### 1. 批量操作

添加"快速配置"按钮：
- "选择所有主要货币"（USD, EUR, GBP, CNY）
- "选择所有快递公司"
- "从最近订单中选择"

### 2. 智能提示

根据历史数据提供建议：
```
💡 Suggestion: Based on your recent orders, 85% are using UPS and FedEx.
   Consider adding them to speed up merging.
```

### 3. 预估影响

显示当前条件下的订单匹配预估：
```
📊 Estimated Impact:
   - Current pending orders: 1,250
   - Match this rule: ~320 orders (25.6%)
   - Potential merge groups: ~85 groups
   - Estimated time saved: 2.5 hours
```

## 📝 更新的文件清单

1. **src/views/settings/OrderAutomations.vue**
   - 新增 Carrier 条件UI
   - 为所有条件添加"配置"按钮和值选择器
   - 更新预览横幅显示选中数量
   - 添加高级条件列表样式

2. **@Prompts/order_merge_value_filter_guide.md**
   - 本文档，完整记录指定值过滤功能

## 🚀 后续增强计划

### 阶段 1: 数据驱动选项
- [ ] 从实际订单数据中获取可选值
- [ ] 显示每个选项的订单数量统计
- [ ] 支持正则表达式匹配

### 阶段 2: 条件模板
- [ ] 保存常用的条件组合为模板
- [ ] 一键应用预设条件组合
- [ ] 分享条件模板给其他用户

### 阶段 3: 智能推荐
- [ ] 基于历史数据分析最优条件组合
- [ ] 自动识别异常订单模式
- [ ] 提供合单效率优化建议

## 📞 相关文档

- [Order Merge Rules Guide](./order_merge_rules_guide.md) - 合单规则基础文档
- [Order Merge Conditions Optimization](./order_merge_conditions_optimization.md) - 条件扩展文档
- [Order Merge UI Guide](./order_merge_ui_guide.md) - UI设计文档

---

**更新时间**: 2024-03-20  
**版本**: v3.0  
**作者**: AI Assistant

