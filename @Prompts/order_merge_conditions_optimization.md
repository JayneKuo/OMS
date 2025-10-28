# 订单合并规则条件优化文档

## 📋 优化概述

本次优化针对订单合并规则的匹配条件进行了扩展和UI改进，增强了合单规则的灵活性和用户体验。

## 🎯 主要改进

### 1. 扩展合单匹配条件

在原有的 4 个基础匹配条件基础上，新增了 4 个高级匹配条件：

#### 基础匹配条件（原有）
- ✅ **Same Customer** - 同一客户
  - 匹配客户ID
  
- ✅ **Same Shipping Address** - 同一收货地址
  - 完全相同的配送地址
  
- ✅ **Same Warehouse** - 同一仓库
  - 分配到相同仓库（仅DN层级）
  
- ✅ **Same Shipping Method** - 同一配送方式
  - 相同的配送方式

#### 新增匹配条件 ⭐
- ✅ **Same Payment Method** - 同一支付方式
  - 匹配相同的支付类型（信用卡、PayPal、货到付款等）
  - 适用场景：某些支付方式需要单独处理，不能合并
  
- ✅ **Same Currency** - 同一货币
  - 匹配相同的订单货币（USD、EUR、GBP等）
  - 适用场景：不同货币订单需要分开结算
  
- ✅ **Same Sales Channel** - 同一销售渠道
  - 匹配相同的订单来源渠道（Amazon、eBay、Shopify等）
  - 适用场景：不同平台订单有不同处理流程
  
- ✅ **Same Order Tags** - 同一订单标签
  - 匹配具有相同标签的订单
  - 适用场景：特殊标记订单（VIP、急单、礼品等）需要单独处理

### 2. UI/UX 优化

#### 条件组件分离
- **合单规则专用条件**：在"Filter Conditions"区域显示合单专用的匹配条件
- **通用条件组隐藏**：合单规则类型下，自动隐藏通用的高级条件组（Advanced Conditions）
- **条件逻辑清晰**：合单规则使用专门的匹配条件，其他规则使用通用条件组

#### 视觉增强
```
合单规则条件区域：
┌─────────────────────────────────────┐
│ 🔍 Merge Matching Conditions *      │
│ ⓘ Orders must meet ALL selected...  │
│                                      │
│ [Switch] Same Customer               │
│ [Switch] Same Shipping Address       │
│ [Switch] Same Warehouse              │
│ [Switch] Same Shipping Method        │
│ [Switch] Same Payment Method  ⭐     │
│ [Switch] Same Currency        ⭐     │
│ [Switch] Same Sales Channel   ⭐     │
│ [Switch] Same Order Tags      ⭐     │
└─────────────────────────────────────┘
```

### 3. 预览横幅增强

合单预览横幅现在显示所有启用的匹配条件：

```
Merge at Sales Order (SO) Level
────────────────────────────────────
[Customer] [Address] [Shipping] [Payment] [Currency] [Channel] [Tags] [⏱️ 60min]
```

## 💻 技术实现

### 数据结构扩展

```typescript
// Action Config 中的新字段
{
  type: 'merge_orders',
  config: {
    merge_node: 'so' | 'dn',
    
    // 基础条件
    match_customer: boolean,
    match_shipping_address: boolean,
    match_warehouse: boolean,
    match_shipping_method: boolean,
    
    // 新增条件 ⭐
    match_payment_method: boolean,
    match_currency: boolean,
    match_channel: boolean,
    match_tags: boolean,
    
    // 时间窗口
    time_window_enabled: boolean,
    time_window_minutes: number,
    
    // 其他配置...
  }
}
```

### 条件渲染逻辑

```vue
<!-- 合单规则显示专用条件 -->
<div v-if="ruleType === 'order_merge'" class="merge-conditions-filter">
  <!-- 8个匹配条件开关 -->
</div>

<!-- 其他规则显示通用条件组 -->
<template v-if="ruleType !== 'order_merge'">
  <div class="condition-group">
    <!-- 通用的条件构建器 -->
  </div>
</template>
```

## 📊 使用场景示例

### 场景 1: 跨境电商严格合单
```
合并节点: SO Level
匹配条件:
✓ Same Customer
✓ Same Shipping Address  
✓ Same Currency          (避免汇率问题)
✓ Same Sales Channel     (同平台订单)
✓ Same Payment Method    (同支付方式)
时间窗口: 30分钟
```

### 场景 2: 灵活的仓库合单
```
合并节点: DN Level
匹配条件:
✓ Same Customer
✓ Same Shipping Address
✓ Same Warehouse
✗ Same Shipping Method   (可以混合配送)
✗ Same Payment Method    (不限支付方式)
时间窗口: 2小时
```

### 场景 3: VIP客户特殊处理
```
合并节点: SO Level
匹配条件:
✓ Same Customer
✓ Same Shipping Address
✓ Same Order Tags        (只合并VIP订单)
时间窗口: 24小时
```

## 🔄 后端集成要点

### API 字段更新
后端需要支持处理以下新字段：

```json
{
  "action_type": "merge_orders",
  "action_config": {
    "match_payment_method": true,
    "match_currency": true,
    "match_channel": true,
    "match_tags": true
  }
}
```

### 匹配逻辑实现
```python
def can_merge_orders(order1, order2, config):
    # 基础条件
    if config.match_customer and order1.customer_id != order2.customer_id:
        return False
    
    # 新增条件
    if config.match_payment_method and order1.payment_method != order2.payment_method:
        return False
        
    if config.match_currency and order1.currency != order2.currency:
        return False
        
    if config.match_channel and order1.channel != order2.channel:
        return False
        
    if config.match_tags and set(order1.tags) != set(order2.tags):
        return False
    
    return True
```

## ✅ 验收标准

### 功能验收
- [ ] 创建合单规则时，显示 8 个匹配条件开关
- [ ] 合单规则下不显示通用条件组
- [ ] 其他规则类型显示通用条件组
- [ ] 预览横幅正确显示所有启用的条件
- [ ] 切换条件开关，预览横幅实时更新

### UI验收
- [ ] 条件开关布局整齐（2列网格）
- [ ] 新增条件图标和描述清晰
- [ ] 预览标签简洁（单词而非长句）
- [ ] 响应式设计良好

### 数据验收
- [ ] 保存规则时包含所有条件字段
- [ ] 编辑规则时正确加载条件状态
- [ ] 默认值设置合理

## 📝 更新的文件清单

1. **src/views/settings/OrderAutomations.vue**
   - 添加 4 个新的条件UI组件
   - 更新预览横幅显示逻辑
   - 添加条件组隐藏逻辑
   - 更新默认配置

2. **src/constants/automation.ts**
   - 在 `merge_orders` action 中添加 4 个新字段定义

3. **@Prompts/order_merge_conditions_optimization.md**
   - 本文档，记录优化细节

## 🚀 后续扩展建议

### 条件分组
将 8 个条件分为三组，提升可读性：
- **客户信息**: Customer, Shipping Address
- **订单属性**: Warehouse, Shipping Method, Payment Method, Currency
- **业务标记**: Channel, Tags

### 条件模板
提供常见的条件组合模板：
- "严格模式" - 所有条件启用
- "灵活模式" - 仅匹配客户和地址
- "跨境模式" - 匹配货币和渠道
- "VIP模式" - 匹配标签

### 条件预估
显示当前条件下可能被合并的订单数量预估。

## 📞 相关文档

- [Order Merge Rules Guide](./order_merge_rules_guide.md) - 合单规则完整文档
- [Order Merge UI Guide](./order_merge_ui_guide.md) - 合单UI设计文档
- [Order Automation Refactor Guide](./order_automation_refactor_guide.md) - 规则类型重构文档

---

**更新时间**: 2024-03-20  
**版本**: v2.0  
**作者**: AI Assistant

