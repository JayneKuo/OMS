# 订单合并规则 - UI 优化改进文档

## 📋 优化概述

本次优化针对订单合并规则的用户界面进行了三个主要改进：
1. ✅ 为 Shipping Address 添加指定值配置功能
2. ✅ 条件列表改为网格布局（一行两个）
3. ✅ Trigger Mode 采用卡片式布局

## 🎯 改进详情

### 1️⃣ Shipping Address 指定值配置

#### 问题
原本 Shipping Address 条件只能开启/关闭，无法指定特定的目标地址或区域。

#### 解决方案
为 Shipping Address 添加了与其他条件一致的"指定值"功能。

#### UI 效果

```
┌──────────────────────────────────────────────┐
│ [Switch] Same Shipping Address                │
│          Identical delivery address           │
│                          [⚙️ Configure]       │
│ ──────────────────────────────────────────── │
│ [Input: New York, Los Angeles, 90001...]     │
│ 💡 Specify cities/zip codes to limit...      │
└──────────────────────────────────────────────┘
```

#### 使用场景

**场景 1: 特定城市优先合单**
```yaml
配置:
  - Address: ✓ [New York, Los Angeles, Chicago]
效果: 只合并配送到这三个城市的订单
```

**场景 2: 邮编区域控制**
```yaml
配置:
  - Address: ✓ [90001, 90002, 90003, 10001-10099]
效果: 只合并特定邮编范围的订单
```

#### 数据结构

```typescript
{
  match_shipping_address: boolean,
  address_filter_values: string[],  // ['New York', '90001', ...]
  address_filter_expanded: boolean
}
```

---

### 2️⃣ 条件网格布局（一行两个）

#### 问题
原本每个条件占据一整行，在大屏幕上显得空间利用率低，且需要过多滚动。

#### 解决方案
使用 CSS Grid 将条件列表改为 2 列布局，小屏幕自动切换为单列。

#### 布局对比

**优化前（单列）**
```
┌────────────────────────────────┐
│ [Switch] Same Customer         │
└────────────────────────────────┘
┌────────────────────────────────┐
│ [Switch] Same Address          │
└────────────────────────────────┘
┌────────────────────────────────┐
│ [Switch] Same Warehouse        │
└────────────────────────────────┘
... 继续向下 ...
```

**优化后（双列）**
```
┌────────────────┬────────────────┐
│ Same Customer  │ Same Address   │
├────────────────┼────────────────┤
│ Same Warehouse │ Same Carrier   │
├────────────────┼────────────────┤
│ Same Shipping  │ Same Payment   │
├────────────────┼────────────────┤
│ Same Currency  │ Same Channel   │
└────────────────┴────────────────┘
```

#### CSS 实现

```css
.conditions-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 响应式：小屏幕切换为单列 */
@media (max-width: 1200px) {
  .conditions-list {
    grid-template-columns: 1fr;
  }
}
```

#### 优势
- ✅ 节省 50% 的垂直空间
- ✅ 提升信息密度，减少滚动
- ✅ 大屏幕更好的视觉平衡
- ✅ 小屏幕自动适配

---

### 3️⃣ Trigger Mode 卡片式布局

#### 问题
原本使用垂直的 Radio Button 列表，占据过多空间，视觉效果不够直观。

#### 解决方案
改为水平的卡片式布局，每个模式一个独立的可点击卡片。

#### UI 对比

**优化前（Radio List）**
```
○ Immediate
  Merge as soon as conditions are met

○ Scheduled
  Merge at specific time intervals

○ Manual
  Require manual approval before merging
```

**优化后（Card Layout）**
```
┌───────────────┬───────────────┬───────────────┐
│ 🎬 Immediate  │ ⏱️ Scheduled  │ 👤 Manual     │
│               │               │               │
│ Merge as soon │ Merge at time │ Manual review │
│ as met        │ intervals     │ required      │
│           ✓   │               │               │
└───────────────┴───────────────┴───────────────┘
```

#### 特性

**1. 视觉图标**
- Immediate: 🎬 (绿色)
- Scheduled: ⏱️ (蓝色)
- Manual: 👤 (橙色)

**2. 交互状态**
- **未选中**: 灰色边框，白色背景
- **悬停**: 深色边框，轻微阴影
- **选中**: 蓝色边框，浅蓝背景，显示勾选图标

**3. Scheduled 模式增强**
选中 Scheduled 时，下方展开配置面板：

```
┌─────────────────────────────────────────────┐
│ ⏱️ Check Interval                           │
│                                              │
│ [  30  ] minutes                            │
│ System will check and merge orders every    │
│ 30 minutes                                  │
└─────────────────────────────────────────────┘
```

#### 代码实现

```vue
<!-- Trigger Mode 数据 -->
<script setup>
const triggerModes = [
  {
    value: 'immediate',
    label: 'Immediate',
    description: 'Merge as soon as conditions are met',
    icon: 'VideoPlay',
    color: '#67C23A'
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    description: 'Merge at specific time intervals',
    icon: 'Timer',
    color: '#409EFF'
  },
  {
    value: 'manual',
    label: 'Manual',
    description: 'Require manual approval before merging',
    icon: 'User',
    color: '#E6A23C'
  }
]
</script>

<!-- 模板 -->
<template>
  <div class="trigger-mode-cards">
    <div 
      v-for="mode in triggerModes" 
      :key="mode.value"
      class="trigger-mode-card"
      :class="{ active: action.config.trigger_mode === mode.value }"
      @click="action.config.trigger_mode = mode.value"
    >
      <div class="mode-icon" :style="{ backgroundColor: mode.color + '15', color: mode.color }">
        <el-icon :size="20"><component :is="icons[mode.icon]" /></el-icon>
      </div>
      <div class="mode-content">
        <div class="mode-title">{{ mode.label }}</div>
        <div class="mode-desc">{{ mode.description }}</div>
      </div>
      <div class="mode-check">
        <el-icon v-if="action.config.trigger_mode === mode.value">
          <Select />
        </el-icon>
      </div>
    </div>
  </div>
</template>
```

#### CSS 样式

```css
.trigger-mode-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.trigger-mode-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--el-fill-color-blank);
  border: 2px solid var(--el-border-color-lighter);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trigger-mode-card:hover {
  border-color: var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.trigger-mode-card.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

/* 响应式 */
@media (max-width: 1200px) {
  .trigger-mode-cards {
    grid-template-columns: 1fr;
  }
}
```

---

## 📊 整体效果对比

### 优化前
- ❌ 地址条件无法精确配置
- ❌ 条件列表占据过多垂直空间
- ❌ Trigger Mode 视觉层级不清晰
- ❌ 需要大量滚动才能查看所有配置

### 优化后
- ✅ 所有条件支持精确值过滤
- ✅ 空间利用率提升 50%
- ✅ Trigger Mode 一目了然
- ✅ 整体配置流程更流畅

## 🎨 完整配置流程展示

```
┌─────────────────────────────────────────────────────────┐
│ 📝 Basic Information                                     │
│ Name: [VIP Customer Express Merge          ]            │
│ Description: [Merge VIP orders quickly     ]            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔧 Rule Type                                             │
│ [Order Merge ▼]                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔍 Merge Matching Conditions                            │
│                                                           │
│ ┌──────────────────┬──────────────────┐                │
│ │ ✓ Customer (2)   │ ✓ Address (3)    │                │
│ └──────────────────┴──────────────────┘                │
│ ┌──────────────────┬──────────────────┐                │
│ │ ✓ Warehouse (1)  │ ✓ Carrier (2)    │                │
│ └──────────────────┴──────────────────┘                │
│ ┌──────────────────┬──────────────────┐                │
│ │ ○ Shipping       │ ○ Payment        │                │
│ └──────────────────┴──────────────────┘                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🎬 Trigger Mode                                          │
│                                                           │
│ ┌────────────┬────────────┬────────────┐               │
│ │ 🎬 Immediate│ ⏱️ Scheduled│ 👤 Manual  │               │
│ │ Auto merge │ Time-based │ Need review│               │
│ │         ✓  │            │            │               │
│ └────────────┴────────────┴────────────┘               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📊 Preview                                               │
│ Merge at SO Level                                        │
│ [Customer(2)] [Address(3)] [Warehouse(1)] [⏱️60min]    │
└─────────────────────────────────────────────────────────┘
```

## 📱 响应式适配

### 桌面端 (>1200px)
- 条件列表：2 列网格
- Trigger Mode：3 列卡片
- 最佳信息密度

### 平板/小屏 (<1200px)
- 条件列表：1 列
- Trigger Mode：1 列
- 保持可读性

## ✅ 测试清单

### 功能测试
- [ ] Address 条件配置正常工作
- [ ] 可以添加/删除地址值
- [ ] 预览横幅显示地址数量
- [ ] 条件在 2 列布局下正常显示
- [ ] 展开的配置不影响布局
- [ ] Trigger Mode 卡片点击切换正常
- [ ] Scheduled 模式展开配置面板

### 响应式测试
- [ ] 1920px 显示 2 列条件
- [ ] 1200px 切换为 1 列条件
- [ ] 768px 所有元素堆叠正常
- [ ] 移动端（375px）可正常操作

### 兼容性测试
- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版

### 性能测试
- [ ] 大量条件（9个）渲染流畅
- [ ] 展开/收起配置无延迟
- [ ] 切换 Trigger Mode 即时响应

## 📁 更新的文件

1. **src/views/settings/OrderAutomations.vue**
   - 为 Shipping Address 添加配置功能
   - 条件列表改为网格布局
   - Trigger Mode 改为卡片布局
   - 添加 triggerModes 常量
   - 更新相关样式

2. **@Prompts/order_merge_ui_improvements.md**
   - 本文档，记录 UI 优化改进

## 🚀 后续优化建议

### 阶段 1: 条件分组
将 9 个条件分为逻辑组：
```
Customer & Location
├── Customer
├── Shipping Address
└── Warehouse

Logistics
├── Carrier
└── Shipping Method

Payment & Finance
├── Payment Method
└── Currency

Business
├── Channel
└── Tags
```

### 阶段 2: 快速预设
添加常用配置预设：
- "严格匹配" - 所有条件启用
- "灵活匹配" - 仅客户和地址
- "仓库优先" - 按仓库分组
- "VIP快速" - VIP客户专属

### 阶段 3: 智能提示
根据配置给出建议：
```
💡 Tip: You've selected Immediate mode with 8 conditions.
   Consider reducing conditions or using Scheduled mode
   to avoid performance issues.
```

### 阶段 4: 批量操作
为条件添加批量操作：
- "全选" / "全不选"
- "反选"
- "从模板加载"
- "保存为模板"

## 📞 相关文档

- [Order Merge Value Filter Guide](./order_merge_value_filter_guide.md) - 指定值过滤功能
- [Order Merge Conditions Optimization](./order_merge_conditions_optimization.md) - 条件扩展
- [Order Merge Rules Guide](./order_merge_rules_guide.md) - 基础规则文档

---

**更新时间**: 2024-03-20  
**版本**: v3.1  
**作者**: AI Assistant

