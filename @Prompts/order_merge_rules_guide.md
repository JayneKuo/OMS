# 订单合并规则使用指南

## 📋 概述

订单合并规则允许您自动将多个订单合并为一个，以优化物流和降低成本。系统支持两个合并节点：

- **SO Level (销售订单级别)**: 在订单创建后、仓库分配前进行合并
- **DN Level (发货单级别)**: 在仓库分配后、生成发货单时进行合并

## 🎯 核心功能

### 1. 合并节点选择

#### SO (Sales Order) Level
- **时机**: 订单导入后立即合并
- **优势**: 
  - 减少仓库分配次数
  - 优化库存分配策略
  - 降低系统处理负载
- **适用场景**: 
  - 同一客户短时间内多次下单
  - 订单来源相同且需要统一处理

#### DN (Delivery Note) Level
- **时机**: 仓库分配完成后，准备发货前合并
- **优势**: 
  - 减少物流包裹数量
  - 降低运费成本
  - 提升配送效率
- **适用场景**: 
  - 同一客户、同一仓库的订单
  - 需要统一发货的订单

### 2. 合并条件配置

| 条件 | 说明 | 必填 | 推荐 |
|------|------|------|------|
| Same Customer | 同一客户 | 是 | ✓ |
| Same Shipping Address | 同一收货地址 | 是 | ✓ |
| Same Warehouse | 同一仓库（DN级别） | 否 | ✓ |
| Same Shipping Method | 同一配送方式 | 否 | 根据业务需求 |

### 3. 时间窗口

设置订单可以合并的时间范围：

- **启用时间窗口**: 只合并指定时间范围内的订单
- **时间长度**: 1-1440分钟（1分钟到24小时）
- **推荐设置**: 
  - SO Level: 30-60分钟
  - DN Level: 60-120分钟

### 4. 合并策略

#### 最大合并数量
- **范围**: 2-50个订单
- **推荐**: 3-5个订单
- **说明**: 避免合并过多订单导致拣货困难

#### 最大商品数量（可选）
- **用途**: 控制合并后订单的总商品数
- **场景**: 限制大型订单的生成

#### 主订单选择
- **Earliest Order**: 使用最早的订单信息
- **Latest Order**: 使用最新的订单信息
- **Highest Value**: 使用金额最高的订单信息

### 5. 触发模式

#### Immediate（即时）
- 订单满足条件立即合并
- 适合高频订单场景
- 响应最快

#### Scheduled（定时）
- 按设定间隔批量合并
- **间隔范围**: 5-1440分钟
- **推荐**: 30分钟
- 适合订单量适中场景

#### Manual（手动）
- 需要人工审核后合并
- 适合需要严格控制的场景
- 提供合并预览功能

## 📝 配置示例

### 示例1：SO级别即时合并

**场景**: 同一客户在1小时内的订单自动合并

```
规则名称: 自动合并同客户订单 - SO级别
描述: 1小时内同一客户、同一收货地址的订单自动合并

过滤条件:
- Order Source: Shopify
- Financial Status = Paid
- Status = Open

动作配置:
- Merge Node: SO (Sales Order)
- Same Customer: ✓
- Same Shipping Address: ✓
- Same Warehouse: - (SO级别不适用)
- Same Shipping Method: -
- Time Window: 60 minutes
- Max Orders: 5
- Primary Order: Earliest Order
- Trigger Mode: Immediate
- Notify on Merge: ✓
```

### 示例2：DN级别定时合并

**场景**: 每30分钟合并一次DN级别的订单

```
规则名称: 定时合并发货单
描述: 每30分钟合并同一客户、同一仓库、同一配送方式的订单

过滤条件:
- Status = Open

动作配置:
- Merge Node: DN (Delivery Note)
- Same Customer: ✓
- Same Shipping Address: ✓
- Same Warehouse: ✓
- Same Shipping Method: ✓
- Time Window: 120 minutes
- Max Orders: 3
- Max Items: 50
- Primary Order: Highest Value
- Trigger Mode: Scheduled
- Schedule Interval: 30 minutes
- Notify on Merge: ✓
```

### 示例3：手动审核合并

**场景**: 高价值订单需要人工审核后合并

```
规则名称: 高价值订单合并审核
描述: 总金额超过$500的订单需要手动审核合并

过滤条件:
- Total Price > 500
- Status = Open

动作配置:
- Merge Node: SO (Sales Order)
- Same Customer: ✓
- Same Shipping Address: ✓
- Time Window: 180 minutes
- Max Orders: 3
- Primary Order: Highest Value
- Trigger Mode: Manual
- Notify on Merge: ✓
```

## 🎨 UI界面说明

### 创建合并规则步骤

1. **基本信息**
   - 输入规则名称和描述

2. **过滤条件**
   - 选择订单来源
   - 设置过滤条件（可选）

3. **动作配置**
   - 选择 Action Type: `Merge Orders`
   - 选择合并节点（SO或DN）
   - 配置合并条件
   - 设置时间窗口
   - 配置合并策略
   - 选择触发模式

4. **预览横幅**
   - 自动显示当前配置的合并规则摘要
   - 实时预览已启用的合并条件

## 🔄 工作流程

### SO Level 合并流程

```
订单导入 → 触发规则检查 → 查找可合并订单 → 执行合并 → 生成合并订单 → 仓库分配
```

### DN Level 合并流程

```
订单导入 → 仓库分配 → 生成DN → 触发规则检查 → 查找可合并DN → 执行合并 → 生成合并DN → 打包发货
```

## ⚠️ 注意事项

### 1. 合并限制
- 已部分发货的订单不能合并
- 已取消的订单不能合并
- 不同支付状态的订单不能合并
- Hold状态的订单不能合并

### 2. 优先级处理
- 合并规则优先级应高于其他规则
- 建议将合并规则的 Order 设置为较小的数字（先执行）

### 3. 库存影响
- SO级别合并后重新计算库存分配
- DN级别合并不影响已分配的库存

### 4. 订单追踪
- 合并后的订单保留所有原订单号的关联
- 可以通过原订单号查询合并后的订单
- 订单时间线记录完整的合并历史

## 📊 监控和统计

### 规则执行统计
- 触发次数
- 成功合并次数
- 平均合并订单数
- 节省的配送成本

### 通知配置
- 合并成功通知
- 合并失败告警
- 每日合并报表

## 🛠️ 高级配置

### API 接口

```typescript
// 手动触发合并检查
POST /api/automation/merge-orders/check
{
  "rule_id": 4,
  "order_ids": ["SO001", "SO002", "SO003"]
}

// 获取可合并订单预览
GET /api/automation/merge-orders/preview?rule_id=4

// 手动执行合并
POST /api/automation/merge-orders/execute
{
  "rule_id": 4,
  "order_ids": ["SO001", "SO002"],
  "force": false
}

// 撤销合并
POST /api/automation/merge-orders/unmerge
{
  "merged_order_id": "SO-MERGED-001"
}
```

## 📈 最佳实践

1. **从简单开始**: 先配置SO级别的即时合并，观察效果
2. **逐步优化**: 根据业务数据调整时间窗口和最大合并数
3. **监控效果**: 定期查看合并统计，评估成本节约
4. **A/B测试**: 对比合并前后的配送效率和客户满意度
5. **定期review**: 每月review合并规则，优化配置参数

## 🤝 常见问题

### Q: SO和DN级别可以同时配置吗？
A: 不建议。选择其中一个级别配置即可，避免重复合并。

### Q: 合并后客户会收到几个包裹？
A: DN级别合并后，客户只会收到一个包裹。

### Q: 如何处理部分商品缺货的情况？
A: 建议配合库存检查规则，缺货订单自动排除在合并范围外。

### Q: 合并后的订单号是什么？
A: 系统会生成新的合并订单号（如SO-M-20240320-001），并保留原订单号的关联。

### Q: 可以撤销已合并的订单吗？
A: 发货前可以撤销合并，发货后不建议撤销。

## 📚 相关文档

- [订单自动化规则指南](./automation_rules_guide.md)
- [库存检查规则指南](./inventory_guide.md)
- [订单状态流转指南](./order_timeline_guide.md)

