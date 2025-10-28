# DC 回传拆分策略文档

## 📋 功能概述

当订单合并后从 DC 回传部分发货时，系统需要决定如何分配发货状态给原始订单。本功能提供了 4 种智能拆分策略。

## 🎯 业务场景

### 典型问题

```
订单 A: 需要商品 X × 50 件
订单 B: 需要商品 X × 50 件
────────────────────────────────
合并后: 商品 X × 100 件

DC 实际发货: 只有 90 件 ❌

问题: 如何向第三方平台回传发货状态？
      - 订单 A 应该标记为已发货还是未发货？
      - 订单 B 应该标记为已发货还是未发货？
      - 如何分配这 90 件商品？
```

## 💡 四种拆分策略

### 1️⃣ Priority-Based（优先级策略）

**原理**: 根据设定的优先级字段，优先满足高优先级订单。

**适用场景**:
- VIP 客户优先发货
- 紧急订单优先处理
- 早下单的订单优先发货

**配置选项**:
- **Order Created Time (Earliest First)** - 最早订单优先
- **Order Created Time (Latest First)** - 最晚订单优先
- **Order Value (Highest First)** - 高价值订单优先
- **Order Value (Lowest First)** - 低价值订单优先
- **Customer VIP Level** - VIP 等级高优先
- **Shipping Priority** - 配送优先级

**示例**:
```yaml
配置: 最早订单优先
订单 A: 2024-03-20 10:00 (需要 50)
订单 B: 2024-03-20 10:30 (需要 50)
DC 发货: 90 件

结果:
  订单 A: ✅ 50/50 (完全发货)
  订单 B: ✅ 40/50 (部分发货)
  剩余: 10 件未发货，创建 backorder
```

**业务逻辑**:
```python
def priority_based_split(orders, shipped_qty, priority_field):
    # 按优先级排序
    sorted_orders = sort_by_priority(orders, priority_field)
    
    remaining_qty = shipped_qty
    results = []
    
    for order in sorted_orders:
        if remaining_qty >= order.quantity:
            # 完全满足该订单
            results.append({
                'order_id': order.id,
                'fulfilled_qty': order.quantity,
                'status': 'shipped',
                'fulfillment_rate': 1.0
            })
            remaining_qty -= order.quantity
        else:
            # 部分满足
            results.append({
                'order_id': order.id,
                'fulfilled_qty': remaining_qty,
                'status': 'partially_shipped',
                'fulfillment_rate': remaining_qty / order.quantity
            })
            remaining_qty = 0
            break
    
    # 剩余订单标记为未发货
    for order in sorted_orders[len(results):]:
        results.append({
            'order_id': order.id,
            'fulfilled_qty': 0,
            'status': 'pending',
            'fulfillment_rate': 0.0
        })
    
    return results
```

---

### 2️⃣ Proportional Split（比例分配策略）

**原理**: 按订单原始数量的比例分配发货数量。

**适用场景**:
- 公平对待所有订单
- 多个订单同等重要
- 避免优先级争议

**配置选项**:
- **Minimum Fulfillment Percentage** - 最低完成率阈值（低于此值标记为未发货）

**示例**:
```yaml
配置: 最低完成率 80%
订单 A: 需要 50 件
订单 B: 需要 50 件
DC 发货: 90 件

计算:
  总需求: 100 件
  完成率: 90 / 100 = 90%
  订单 A 分配: 50 × 90% = 45 件
  订单 B 分配: 50 × 90% = 45 件

结果:
  订单 A: ✅ 45/50 (90% 完成，超过阈值)
  订单 B: ✅ 45/50 (90% 完成，超过阈值)
  状态: 两个订单都标记为 partially_shipped
```

**边界情况**:
```yaml
情况 1: 完成率低于阈值
订单 A: 需要 50 件
订单 B: 需要 50 件
DC 发货: 70 件 (70%)

配置: 最低 80%

结果:
  订单 A: ❌ 35/50 (70%，低于阈值，标记为未发货)
  订单 B: ❌ 35/50 (70%，低于阈值，标记为未发货)
```

**业务逻辑**:
```python
def proportional_split(orders, shipped_qty, min_percentage):
    total_qty = sum(order.quantity for order in orders)
    fulfillment_rate = shipped_qty / total_qty
    
    results = []
    
    # 如果完成率低于阈值，全部标记为未发货
    if fulfillment_rate < (min_percentage / 100):
        for order in orders:
            results.append({
                'order_id': order.id,
                'fulfilled_qty': 0,
                'status': 'pending',
                'fulfillment_rate': 0.0,
                'reason': f'Overall fulfillment {fulfillment_rate*100}% below threshold {min_percentage}%'
            })
        return results
    
    # 按比例分配
    for order in orders:
        fulfilled_qty = int(order.quantity * fulfillment_rate)
        results.append({
            'order_id': order.id,
            'fulfilled_qty': fulfilled_qty,
            'status': 'partially_shipped' if fulfilled_qty < order.quantity else 'shipped',
            'fulfillment_rate': fulfillment_rate
        })
    
    return results
```

---

### 3️⃣ Complete Orders First（完整订单优先策略）

**原理**: 优先完全满足能够完整发货的订单，不足的订单全部标记为未发货。

**适用场景**:
- 避免拆分发货增加物流成本
- 客户体验优先（要么全发，要么不发）
- 简化物流和客服处理

**示例**:
```yaml
订单 A: 需要 50 件
订单 B: 需要 50 件
DC 发货: 90 件

结果:
  订单 A: ✅ 50/50 (完整发货)
  订单 B: ❌ 0/50 (标记为未发货，等待下次发货)
  
说明: 虽然有 40 件剩余，但不足以满足订单 B，
      所以订单 B 标记为未发货，创建 backorder
```

**优势**:
- ✅ 客户体验好（收到的都是完整订单）
- ✅ 减少客服咨询（不会有"为什么只发了一部分"）
- ✅ 物流成本低（避免多次发货）
- ✅ 退货率低（不会因为"发少了"退货）

**业务逻辑**:
```python
def complete_first_split(orders, shipped_qty):
    results = []
    remaining_qty = shipped_qty
    
    # 按某种顺序（如创建时间）排序
    sorted_orders = sorted(orders, key=lambda x: x.created_at)
    
    for order in sorted_orders:
        if remaining_qty >= order.quantity:
            # 可以完整满足
            results.append({
                'order_id': order.id,
                'fulfilled_qty': order.quantity,
                'status': 'shipped',
                'fulfillment_rate': 1.0
            })
            remaining_qty -= order.quantity
        else:
            # 不能完整满足，标记为未发货
            results.append({
                'order_id': order.id,
                'fulfilled_qty': 0,
                'status': 'pending',
                'fulfillment_rate': 0.0,
                'reason': 'Insufficient quantity for complete fulfillment'
            })
    
    return results
```

---

### 4️⃣ All Partial（全部部分发货策略）

**原理**: 所有订单都标记为部分发货，记录实际发货数量。

**适用场景**:
- 需要精确跟踪每个订单的发货情况
- 支持多次发货、逐步补发
- 财务需要准确的发货记录

**示例**:
```yaml
订单 A: 需要 50 件
订单 B: 需要 50 件
DC 发货: 90 件

结果:
  订单 A: ⚠️ 45/50 (部分发货 90%)
  订单 B: ⚠️ 45/50 (部分发货 90%)
  
状态: 两个订单都标记为 partially_shipped
      可以后续继续补发剩余数量
```

**业务逻辑**:
```python
def all_partial_split(orders, shipped_qty):
    total_qty = sum(order.quantity for order in orders)
    fulfillment_rate = shipped_qty / total_qty
    
    results = []
    distributed_qty = 0
    
    # 按比例分配，但确保总和等于实际发货数
    for i, order in enumerate(orders):
        if i == len(orders) - 1:
            # 最后一个订单，分配所有剩余
            fulfilled_qty = shipped_qty - distributed_qty
        else:
            fulfilled_qty = int(order.quantity * fulfillment_rate)
            distributed_qty += fulfilled_qty
        
        results.append({
            'order_id': order.id,
            'fulfilled_qty': fulfilled_qty,
            'original_qty': order.quantity,
            'status': 'partially_shipped',
            'fulfillment_rate': fulfilled_qty / order.quantity,
            'backorder_qty': order.quantity - fulfilled_qty
        })
    
    return results
```

---

## 🔧 配置界面

### UI 布局

```
┌─────────────────────────────────────────────────────────┐
│ 💡 Scenario Example                                     │
│ Order A (50 units) + Order B (50 units) = 100 units    │
│ DC ships only 90 units → How to report status?         │
└─────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┐
│ 📊 Priority-    │ 🥧 Proportional │
│    Based        │    Split        │
│                 │                 │
│ Fulfill by      │ Distribute by   │
│ priority order  │ percentage      │
│                 │                 │
│ Example: Order  │ Example: Both   │
│ A 50✓, B 40✓   │ get 45 (90%)    │
│             ✓   │                 │
└─────────────────┴─────────────────┘

┌─────────────────┬─────────────────┐
│ ✅ Complete     │ ⚠️ All Partial  │
│    First        │                 │
│                 │                 │
│ Complete orders │ Mark all as     │
│ only, skip rest │ partial         │
│                 │                 │
│ Example: A 50✓ │ Example: A 45/50│
│ B 0 (pending)   │ B 45/50         │
└─────────────────┴─────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📋 Priority Field                                        │
│ [Order Created Time (Earliest First) ▼]                │
│                                                          │
│ ☑ Send notification when partial shipment occurs       │
│ ☑ Automatically create backorder for unfulfilled qty   │
└─────────────────────────────────────────────────────────┘
```

### 配置项说明

| 配置项 | 适用策略 | 说明 |
|--------|---------|------|
| **Priority Field** | Priority-Based | 选择优先级排序字段 |
| **Min Fulfillment %** | Proportional | 最低完成率阈值 (0-100%) |
| **Partial Notification** | All | 部分发货时发送通知 |
| **Auto Backorder** | All | 自动为未发货数量创建 backorder |

---

## 📊 策略对比表

| 策略 | 优势 | 劣势 | 最佳场景 |
|------|------|------|---------|
| **Priority-Based** | • 灵活可控<br>• 支持业务规则<br>• 可优先重要订单 | • 需要定义优先级<br>• 可能不够"公平" | VIP优先、紧急订单 |
| **Proportional** | • 公平分配<br>• 适用所有场景<br>• 数学上合理 | • 可能产生零碎数量<br>• 都不完整 | 同等重要的订单 |
| **Complete First** | • 客户体验好<br>• 减少物流成本<br>• 降低客服压力 | • 后面订单可能等很久<br>• 不够"公平" | B2C零售、快消品 |
| **All Partial** | • 精确跟踪<br>• 支持多次补发<br>• 财务准确 | • 所有订单都不完整<br>• 增加客服工作量 | B2B订单、大批量 |

---

## 🔄 完整业务流程

### 1. 订单合并
```
订单 A (50) + 订单 B (50) → 合并订单 (100)
```

### 2. DC 发货通知
```
DC 回传: 实际发货 90 件
触发: DC Partial Fulfillment Strategy
```

### 3. 策略执行
```python
# 获取合并订单的原始订单列表
original_orders = get_original_orders(merged_order_id)

# 获取配置的策略
strategy = rule.dc_split_strategy  # 'priority', 'proportional', etc.

# 执行拆分逻辑
split_results = execute_split_strategy(
    strategy=strategy,
    orders=original_orders,
    shipped_qty=90,
    config=rule.split_config
)
```

### 4. 回传第三方
```python
for result in split_results:
    # 向第三方平台报告发货状态
    report_to_channel(
        order_id=result['order_id'],
        status=result['status'],
        fulfilled_qty=result['fulfilled_qty'],
        original_qty=result['original_qty']
    )
```

### 5. 创建 Backorder
```python
if config.auto_create_backorder:
    for result in split_results:
        if result['backorder_qty'] > 0:
            create_backorder(
                original_order_id=result['order_id'],
                quantity=result['backorder_qty'],
                reason='DC partial fulfillment'
            )
```

### 6. 发送通知
```python
if config.partial_ship_notification:
    send_notification(
        type='partial_shipment',
        orders=split_results,
        shipped_qty=90,
        total_qty=100
    )
```

---

## 📝 数据结构

### 配置存储

```typescript
{
  dc_split_strategy: 'priority' | 'proportional' | 'complete_first' | 'all_partial',
  
  // Priority-Based 配置
  split_priority_field: 'created_asc' | 'created_desc' | 'value_desc' | 'value_asc' | 'vip_level_desc' | 'shipping_priority',
  
  // Proportional 配置
  min_fulfillment_percentage: number,  // 0-100
  
  // 通用配置
  partial_ship_notification: boolean,
  auto_create_backorder: boolean
}
```

### 拆分结果

```typescript
interface SplitResult {
  order_id: string
  original_qty: number
  fulfilled_qty: number
  backorder_qty: number
  status: 'shipped' | 'partially_shipped' | 'pending'
  fulfillment_rate: number  // 0-1
  reason?: string
}
```

---

## ✅ 测试场景

### 场景 1: 优先级策略
```python
def test_priority_strategy():
    orders = [
        Order(id='A', qty=50, created_at='2024-03-20 10:00'),
        Order(id='B', qty=50, created_at='2024-03-20 11:00')
    ]
    result = priority_split(orders, 90, 'created_asc')
    
    assert result[0]['order_id'] == 'A'
    assert result[0]['fulfilled_qty'] == 50
    assert result[0]['status'] == 'shipped'
    
    assert result[1]['order_id'] == 'B'
    assert result[1]['fulfilled_qty'] == 40
    assert result[1]['status'] == 'partially_shipped'
```

### 场景 2: 比例分配
```python
def test_proportional_strategy():
    orders = [
        Order(id='A', qty=50),
        Order(id='B', qty=50)
    ]
    result = proportional_split(orders, 90, min_percentage=80)
    
    assert result[0]['fulfilled_qty'] == 45
    assert result[1]['fulfilled_qty'] == 45
    assert all(r['status'] == 'partially_shipped' for r in result)
```

### 场景 3: 完整优先
```python
def test_complete_first_strategy():
    orders = [
        Order(id='A', qty=50),
        Order(id='B', qty=50)
    ]
    result = complete_first_split(orders, 90)
    
    assert result[0]['fulfilled_qty'] == 50
    assert result[0]['status'] == 'shipped'
    
    assert result[1]['fulfilled_qty'] == 0
    assert result[1]['status'] == 'pending'
```

---

## 📞 相关文档

- [Order Merge Rules Guide](./order_merge_rules_guide.md) - 订单合并规则基础
- [Order Merge Value Filter](./order_merge_value_filter_guide.md) - 指定值过滤
- [Order Merge UI Improvements](./order_merge_ui_improvements.md) - UI 优化

---

**更新时间**: 2024-03-20  
**版本**: v1.0  
**作者**: AI Assistant

