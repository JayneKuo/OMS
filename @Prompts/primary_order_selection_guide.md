# Primary Order Selection - 主订单选择策略

## 📋 概述

**Primary Order Selection**（主订单选择）是订单合并规则中的**核心配置项**，用于决定当多个订单合并成一个订单时，**哪个订单作为主订单（Primary Order）**，其信息将被保留和优先使用。

---

## 🎯 作用和重要性

### 为什么需要主订单？

当多个订单合并时，会遇到以下问题：

```yaml
场景：订单合并
订单 A:
  - 订单号: ORD-001
  - 创建时间: 2024-01-01 10:00
  - 订单金额: $50
  - 备注: "Gift wrap please"
  - 客户留言: "Deliver before noon"

订单 B:
  - 订单号: ORD-002
  - 创建时间: 2024-01-01 10:15
  - 订单金额: $100
  - 备注: "Express shipping"
  - 客户留言: "Call before delivery"

合并后的订单应该保留谁的信息？
  ❓ 使用哪个订单号作为参考？
  ❓ 保留哪个订单的备注？
  ❓ 使用哪个订单的客户留言？
  ❓ 计算金额时以哪个为基准？
```

**Primary Order Selection** 就是用来解决这个问题的！

---

## 🔧 三种选择策略

### 1️⃣ Earliest Order（最早订单）⏰

**选择规则**: 使用**创建时间最早**的订单作为主订单

**适用场景**:
- ✅ **FIFO（先进先出）**原则
- ✅ 保证最早下单的客户优先级最高
- ✅ 符合传统的订单处理逻辑

**示例**:
```yaml
订单 A: 创建于 10:00 AM
订单 B: 创建于 10:15 AM
订单 C: 创建于 10:30 AM

主订单: 订单 A ✅
原因: 创建时间最早

合并结果:
  - 主订单号: ORD-A
  - 参考编号: ORD-A, ORD-B, ORD-C
  - 订单备注: 使用订单 A 的备注
  - 客户留言: 使用订单 A 的留言
  - 优先级: 按订单 A 的优先级处理
```

**优势**:
- 📅 符合时间逻辑，易于理解
- 👍 客户体验好（最早下单的优先）
- 📊 便于追溯订单历史

**典型应用**:
```
客户在 10:00 下了订单 A（普通商品）
客户在 10:15 又下了订单 B（追加商品）
→ 使用订单 A 作为主订单
→ 订单 B 作为附属订单
→ 物流单上显示"订单 A + 订单 B"
```

---

### 2️⃣ Latest Order（最新订单）🆕

**选择规则**: 使用**创建时间最晚**的订单作为主订单

**适用场景**:
- ✅ 以最新需求为准
- ✅ 客户可能在后续订单中修改了要求
- ✅ 最新订单通常包含最完整的信息

**示例**:
```yaml
订单 A: 创建于 10:00 AM
  备注: "标准配送"
  
订单 B: 创建于 10:15 AM
  备注: "加急！今天必须发货"

主订单: 订单 B ✅
原因: 创建时间最晚，客户最新意愿

合并结果:
  - 主订单号: ORD-B
  - 处理优先级: 按订单 B 的要求（加急）
  - 备注: "加急！今天必须发货"
```

**优势**:
- 🔄 反映客户最新意愿
- ⚡ 能及时响应变更需求
- 🎯 避免按旧信息处理

**典型应用**:
```
客户在 10:00 下了订单 A（标准配送）
客户在 10:15 发现需要加急，下了订单 B（加急配送）
→ 使用订单 B 作为主订单
→ 按加急要求处理整个合并单
→ 满足客户最新需求
```

---

### 3️⃣ Highest Value（最高价值）💰

**选择规则**: 使用**订单金额最大**的订单作为主订单

**适用场景**:
- ✅ VIP 客户优先
- ✅ 高价值订单优先处理
- ✅ 利润导向的业务策略

**示例**:
```yaml
订单 A: 金额 $50
  客户等级: 普通
  
订单 B: 金额 $500
  客户等级: VIP
  包含高价值商品

主订单: 订单 B ✅
原因: 金额最高，优先级最高

合并结果:
  - 主订单号: ORD-B
  - 处理优先级: VIP 级别
  - 包装标准: 按高价值商品要求
  - 客服关注度: 高
```

**优势**:
- 💎 优先保护高价值订单
- 🎖️ VIP 客户体验更好
- 📈 提高客单价订单的满意度

**典型应用**:
```
客户下了订单 A（$50，一本书）
客户又下了订单 B（$500，一台笔记本电脑）
→ 使用订单 B 作为主订单
→ 按高价值商品的标准打包
→ 赠送 VIP 礼品和服务
```

---

## 📊 对比分析

| 策略 | 优势 | 劣势 | 最佳场景 |
|------|------|------|----------|
| **Earliest** | 公平、符合直觉 | 可能忽略后续变更 | 标准电商、B2C |
| **Latest** | 反映最新需求 | 可能不够公平 | 客户频繁修改订单 |
| **Highest Value** | VIP 体验好 | 可能忽视小单 | 高端电商、奢侈品 |

---

## 🔄 主订单信息的使用范围

选定主订单后，以下信息会优先使用主订单的数据：

### 1. 订单元数据
```yaml
✅ 主订单号（Primary Order Number）
✅ 创建时间
✅ 客户ID
✅ 订单来源
```

### 2. 配送信息
```yaml
✅ 配送地址（如果相同）
✅ 配送方式优先级
✅ 时效要求
✅ 签收要求
```

### 3. 客户沟通
```yaml
✅ 订单备注
✅ 客户留言
✅ 特殊要求
✅ 礼品信息
```

### 4. 处理优先级
```yaml
✅ 订单优先级
✅ 客户等级
✅ 加急标识
✅ 服务水平
```

### 5. 财务相关
```yaml
⚠️ 订单金额（合并后重新计算）
⚠️ 优惠券（可能需要重新验证）
⚠️ 运费（重新计算）
```

---

## 💡 实际应用示例

### 场景 1: 电商平台（使用 Earliest）

```yaml
业务规则:
  - 遵循 FIFO 原则
  - 保证订单公平性
  - 追溯方便

示例:
  客户 John Smith
  订单 A: 10:00 AM - $30 (T恤)
  订单 B: 10:10 AM - $20 (袜子)
  
  配置: Primary Order = Earliest
  
  结果:
    主订单: A
    合并单号: MERGE-A-B
    订单备注: 使用 A 的备注
    发货标签: 参考 A 的配送要求
    
  客户体验:
    ✅ 客户看到的主订单号是 A
    ✅ 物流追踪以 A 为准
    ✅ 客服查询时优先看 A
```

### 场景 2: 奢侈品商店（使用 Highest Value）

```yaml
业务规则:
  - VIP 客户优先
  - 高价值订单特殊处理
  - 附加增值服务

示例:
  客户 Sarah Johnson (VIP)
  订单 A: $50 (香水小样)
  订单 B: $2000 (LV手袋)
  
  配置: Primary Order = Highest Value
  
  结果:
    主订单: B
    处理级别: VIP+
    包装标准: 高端礼盒
    附加服务: 专属物流 + 保险
    
  客户体验:
    ✅ 整个包裹按 VIP 标准处理
    ✅ 赠送高端礼品包装
    ✅ 专属客服跟进
    ✅ 附送品牌礼品
```

### 场景 3: B2B 批发（使用 Latest）

```yaml
业务规则:
  - 客户经常调整订单
  - 以最新需求为准
  - 快速响应变更

示例:
  客户 ABC Company
  订单 A: 9:00 AM - 100件商品 (标准配送)
  订单 B: 9:30 AM - 50件商品 (备注: "本周五前必达")
  
  配置: Primary Order = Latest
  
  结果:
    主订单: B
    时效要求: 本周五前
    整个合并单加急处理
    
  客户体验:
    ✅ 按最新时效要求处理
    ✅ 避免按旧要求慢速配送
    ✅ 满足客户紧急需求
```

---

## 🔧 技术实现

### 前端配置

```typescript
// 配置项
{
  priority_field: 'earliest' | 'latest' | 'highest_value',
  // ...其他配置
}

// UI 展示
<el-select v-model="action.config.priority_field">
  <el-option value="earliest" label="Earliest Order">
    Use the first order's information
  </el-option>
  <el-option value="latest" label="Latest Order">
    Use the most recent order's information
  </el-option>
  <el-option value="highest_value" label="Highest Value">
    Use the highest value order's information
  </el-option>
</el-select>
```

### 后端逻辑

```python
def select_primary_order(orders, strategy):
    """
    选择主订单
    """
    if strategy == 'earliest':
        # 按创建时间升序，取第一个
        return min(orders, key=lambda o: o.created_at)
    
    elif strategy == 'latest':
        # 按创建时间降序，取第一个
        return max(orders, key=lambda o: o.created_at)
    
    elif strategy == 'highest_value':
        # 按订单金额降序，取第一个
        return max(orders, key=lambda o: o.total_amount)
    
    else:
        raise ValueError(f"Unknown strategy: {strategy}")


def merge_orders(orders, config):
    """
    合并订单
    """
    # 1. 选择主订单
    primary_order = select_primary_order(
        orders, 
        config['priority_field']
    )
    
    # 2. 创建合并订单
    merged_order = {
        'primary_order_id': primary_order.id,
        'merged_from': [o.id for o in orders],
        
        # 使用主订单的元数据
        'order_number': primary_order.order_number,
        'customer_id': primary_order.customer_id,
        'order_note': primary_order.order_note,
        'customer_message': primary_order.customer_message,
        'priority_level': primary_order.priority_level,
        
        # 合并所有订单的商品
        'line_items': merge_line_items(orders),
        
        # 重新计算总金额
        'total_amount': sum(o.total_amount for o in orders),
        
        # 其他字段...
    }
    
    return merged_order
```

---

## ⚠️ 注意事项

### 1. 订单号管理

```yaml
问题: 合并后，其他订单的订单号怎么办？

解决方案:
  主订单号: 保留在显眼位置
  其他订单号: 存储在 "merged_from" 字段
  追溯: 可以通过任一订单号查询到合并单
  
示例:
  主订单: ORD-001
  合并单: MERGE-001-002-003
  包含订单: ORD-001, ORD-002, ORD-003
  
  客户查询 ORD-002 时:
    → 系统自动定位到 MERGE-001-002-003
    → 显示: "您的订单已与其他订单合并"
```

### 2. 金额计算

```yaml
注意: 订单金额需要重新计算

正确做法:
  总金额 = 所有订单金额之和
  运费 = 重新计算（合并后可能优惠）
  优惠券 = 重新验证（可能失效）
  
错误做法:
  ❌ 直接使用主订单的金额
  ❌ 忽略其他订单的优惠
```

### 3. 客户沟通

```yaml
建议: 合并后通知客户

通知内容:
  - 哪些订单被合并了
  - 主订单号是什么
  - 物流跟踪号是什么
  - 预计送达时间
  
模板:
  "您的订单 ORD-001 和 ORD-002 已合并发货
   主订单号: ORD-001
   物流单号: SF1234567890
   预计 2024-01-05 送达"
```

### 4. 数据一致性

```yaml
确保:
  ✅ 所有被合并的订单更新状态
  ✅ 库存正确扣减（避免重复扣减）
  ✅ 财务记录准确（避免重复计费）
  ✅ 客户积分正确累计
```

---

## 📈 最佳实践

### 1. 根据业务类型选择策略

```yaml
B2C 电商: Earliest（公平原则）
高端零售: Highest Value（VIP 优先）
B2B 批发: Latest（响应变更）
快消品: Earliest（快速流转）
```

### 2. 配合其他规则使用

```yaml
✅ 时间窗口: 只合并 30 分钟内的订单
✅ 最大订单数: 最多合并 5 个订单
✅ 最大商品数: 总商品不超过 20 件
✅ 同仓库: 只合并相同仓库的订单
```

### 3. 监控和优化

```yaml
监控指标:
  - 合并率（多少订单被合并）
  - 平均合并数量
  - 客户投诉率
  - 物流成本节省
  
优化方向:
  - 根据客户反馈调整策略
  - A/B 测试不同策略
  - 季节性调整（大促期间可能调整）
```

---

## 🎓 总结

**Primary Order Selection** 是订单合并的核心决策点，它决定了：

1. 🎯 **哪个订单的信息被优先保留**
2. 📋 **如何向客户展示合并结果**
3. ⚡ **订单的处理优先级**
4. 📊 **系统如何追溯和报表**

选择正确的策略可以：
- ✅ 提升客户满意度
- ✅ 优化运营效率
- ✅ 降低物流成本
- ✅ 提高订单履约率

---

## 📚 相关文档

- [Order Merge Rules Guide](./order_merge_rules_guide.md)
- [DC Partial Fulfillment Strategy](./dc_partial_fulfillment_strategy.md)
- [Four Required Conditions](./order_merge_four_required_conditions.md)

---

**更新时间**: 2024-03-20  
**版本**: v1.0  
**作者**: AI Assistant

