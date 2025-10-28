# 订单自动化规则重构指南

## 🎯 重构目标

将原有的 **"条件 → 动作"** 流程优化为 **"规则类型 → 条件 → 动作"** 流程，提供更清晰的用户体验。

---

## 📊 重构前后对比

### ❌ 重构前的流程

```
1. 基本信息 (Name, Description)
2. 过滤条件 (Filter Conditions)
3. 动作配置 (Actions)
   └─ 选择动作类型 (Select action)
      └─ 配置动作参数
```

**问题：**
- 用户需要先设置条件，再选择动作
- 动作类型不清晰，需要在下拉框中查找
- 不同动作的配置界面一致性差
- 无法突出展示特殊规则（如合单规则）

---

### ✅ 重构后的流程

```
1. 基本信息 (Name, Description)
2. 规则类型 (Rule Type) ⭐ 新增
   └─ 6种规则类型卡片选择
3. 过滤条件 (Filter Conditions)
   └─ 根据规则类型显示
4. 动作配置 (Actions)
   └─ 根据规则类型自动配置
```

**优势：**
- ✅ 用户首先明确规则目的
- ✅ 可视化的卡片选择，更直观
- ✅ 每种规则类型有专门的配置界面
- ✅ 合单规则作为独立类型突出展示
- ✅ 更好的引导流程和用户体验

---

## 📝 6种规则类型

### 1️⃣ Order Merge（订单合并）🔵

**图标：** 🔗 Connection  
**颜色：** 蓝色 #409EFF  
**描述：** Automatically merge multiple orders based on conditions

**功能特性：**
- SO Level Merge
- DN Level Merge
- Time Window
- Smart Matching

**配置界面：**
- 合并节点选择（SO/DN）
- 合并条件（Same Customer, Same Address, etc.）
- 时间窗口
- 合并策略
- 触发模式
- 通知设置

---

### 2️⃣ Order Routing（订单路由）🟢

**图标：** 🧭 Guide  
**颜色：** 绿色 #67C23A  
**描述：** Route orders to specific warehouses or channels

**功能特性：**
- Warehouse Assignment
- Channel Routing
- Priority Rules
- Load Balancing

**配置界面：**
- 仓库选择下拉框

---

### 3️⃣ Order Hold（订单暂停）🟡

**图标：** ⭕ CircleClose  
**颜色：** 橙色 #E6A23C  
**描述：** Temporarily hold orders based on conditions

**功能特性：**
- Auto Hold
- Hold Duration
- Release Conditions
- Notifications

**配置界面：**
- Hold Duration（分钟）
- Hold Scope（整单/特定商品）
- Business Hour开关

---

### 4️⃣ Inventory Check（库存检查）🔴

**图标：** 📦 Box  
**颜色：** 红色 #F56C6C  
**描述：** Check inventory and take actions

**功能特性：**
- Stock Validation
- Auto Hold
- Alert System
- Restock Trigger

**配置界面：**
- Hold Type（整单/仅商品）
- Auto Release开关

---

### 5️⃣ Order Update（订单更新）⚫

**图标：** ✏️ Edit  
**颜色：** 灰色 #909399  
**描述：** Update order fields automatically

**功能特性：**
- Field Update
- Bulk Operations
- Conditional Logic
- Tag Management

**配置界面：**
- 字段选择（Status, Tags, Currency, Note）
- 新值输入

---

### 6️⃣ Custom Action（自定义动作）⚪

**图标：** ⚙️ Setting  
**颜色：** 深灰 #606266  
**描述：** Create custom automation with flexible actions

**功能特性：**
- Multiple Actions
- Complex Logic
- API Integration
- Advanced Rules

**配置界面：**
- 完全自定义的动作配置
- 支持所有 ACTION_GROUPS 中的动作

---

## 🎨 UI设计特点

### 规则类型卡片

```
┌─────────────────────────────────────────────┐
│ 🔗  [56x56 图标]              [✓ Badge]    │
│                                              │
│ Order Merge                                  │
│ Automatically merge multiple orders...       │
│                                              │
│ [SO Level] [DN Level] [Time Window] [...]   │
└─────────────────────────────────────────────┘
```

**交互效果：**
- 悬停：卡片上浮 4px + 阴影
- 选中：蓝色边框 + 渐变背景 + 顶部彩条
- 图标：选中时放大 + 旋转动画
- Badge：弹出动画

**布局响应式：**
- 桌面（≥1400px）：3列
- 平板（900-1400px）：2列
- 移动（<900px）：1列

---

## 📐 配置流程示例

### 创建订单合并规则

#### Step 1: 填写基本信息
```
Name: 同一客户订单自动合并
Description: 1小时内同一客户的订单自动合并
```

#### Step 2: 选择规则类型
```
点击 "Order Merge" 卡片
✓ 卡片高亮，显示 ✓ Badge
✓ 条件和动作区域自动显示
```

#### Step 3: 设置过滤条件（可选）
```
Order Source: Shopify
Conditions: Financial Status = Paid
```

#### Step 4: 配置合并设置
```
✓ 自动显示合并配置界面
✓ 选择 SO Level
✓ 设置合并条件
✓ 配置时间窗口
✓ 选择触发模式
```

#### Step 5: 保存规则
```
✓ 规则自动关联 merge_orders 动作
✓ 所有配置保存到 action.config
```

---

## 🔄 规则类型与动作的映射

| 规则类型 | Action Type | 说明 |
|---------|-------------|------|
| `order_merge` | `merge_orders` | 订单合并动作 |
| `order_routing` | `override_warehouse` | 仓库覆盖动作 |
| `order_hold` | `hold_order` | 订单暂停动作 |
| `inventory_check` | `check_inventory_hold` | 库存检查并暂停 |
| `order_update` | `update_order_field` | 字段更新动作 |
| `custom` | 任意动作 | 自定义动作配置 |

**自动映射逻辑：**
```typescript
handleRuleTypeChange(type) {
  switch(type) {
    case 'order_merge':
      // 自动创建 merge_orders 动作
      // 初始化默认配置
      break
    // ... 其他类型
  }
}
```

---

## 🎯 编辑规则时的类型识别

**问题：** 编辑已有规则时，如何识别规则类型？

**解决方案：** 通过 `action.type` 反向识别

```typescript
handleEditRule(rule) {
  const actionType = rule.actions[0].type
  
  // 映射表
  const typeMapping = {
    'merge_orders': 'order_merge',
    'override_warehouse': 'order_routing',
    'hold_order': 'order_hold',
    'check_inventory_hold': 'inventory_check',
    'update_order_field': 'order_update',
    // ... 默认为 custom
  }
  
  ruleType.value = typeMapping[actionType] || 'custom'
}
```

---

## 📱 列表页显示优化

### 建议增强

在规则列表中，可以显示规则类型标签：

```
Rule Name: 同一客户订单自动合并
Type: [🔗 Order Merge]
Actions: (SO Level, Max: 5, Time: 60min, Trigger: immediate)
```

**代码示例：**
```vue
<el-table-column label="Type" width="150">
  <template #default="{ row }">
    <el-tag :type="getRuleTypeColor(row)">
      {{ getRuleTypeLabel(row) }}
    </el-tag>
  </template>
</el-table-column>
```

---

## ⚡ 性能优化

### 1. 条件渲染优化
```vue
<!-- 只在选择规则类型后显示条件和动作 -->
<div v-if="ruleType" class="form-section">
  <!-- Conditions -->
</div>

<div v-if="ruleType" class="form-section">
  <!-- Actions -->
</div>
```

### 2. 按需加载配置
不同规则类型只渲染对应的配置界面，避免渲染所有可能的配置。

### 3. 动画性能
使用 CSS transform 和 opacity 实现动画，确保 60fps 流畅度。

---

## 🔮 未来扩展

### 1. 规则模板
```typescript
const RULE_TEMPLATES = {
  order_merge: [
    {
      name: 'SO Level - Same Customer',
      description: 'Merge orders from same customer at SO level',
      config: { /* 预设配置 */ }
    }
  ]
}
```

### 2. 规则预览
```vue
<div class="rule-preview">
  <h4>Rule Preview</h4>
  <code>
    IF order.customer.id = same 
    AND order.shipping_address = same
    THEN merge at SO level
  </code>
</div>
```

### 3. 规则验证
```typescript
const validateRule = (rule: Rule): string[] => {
  const errors = []
  
  if (rule.type === 'order_merge') {
    if (!rule.actions[0].config.merge_node) {
      errors.push('Merge node is required')
    }
  }
  
  return errors
}
```

---

## 📚 相关文档

- [订单合并规则指南](./order_merge_rules_guide.md)
- [订单合并UI指南](./order_merge_ui_guide.md)
- [自动化规则系统文档](./automation_rules_guide.md)

---

## ✅ 重构完成清单

- [x] 添加规则类型选择 UI
- [x] 实现 6 种规则类型卡片
- [x] 根据规则类型自动初始化动作
- [x] 为每种规则类型创建专门的配置界面
- [x] 编辑时支持规则类型识别
- [x] 移除不需要的"Add Action"按钮
- [x] 添加完整的样式和动画
- [x] 响应式布局适配
- [x] 编写使用文档

---

## 🎉 总结

通过这次重构，我们实现了：

1. **更清晰的流程**：规则类型 → 条件 → 动作
2. **更好的UX**：可视化卡片选择，直观明了
3. **更强的扩展性**：每种规则类型独立配置
4. **突出合单规则**：作为独立类型，配置界面完善
5. **保持兼容性**：与现有数据结构完全兼容

这为未来添加更多规则类型奠定了良好的基础！🚀

