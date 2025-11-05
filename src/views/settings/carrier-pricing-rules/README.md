# Rate Shopping Automation Rules（自动询价规则）

## 功能概述

Rate Shopping Automation Rules 模块允许用户创建自动化规则，当订单满足特定条件时，系统自动向配置的承运商询价（Rate Shopping），并根据预设的选择逻辑自动选择最优的承运商和服务类型。这是基于美国标准业务流程设计的承运商自动询价系统。

## 核心业务流程

```
订单创建/更新 
  → 检查是否匹配规则触发条件
    → 并行调用承运商API询价（使用配置的Account）
      → 应用价格调整规则（Markup）
        → 根据选择逻辑选择最优方案
          → 检查是否需要人工审核
            → 自动应用 或 提交审核
```

## 文件结构

```
src/views/settings/carrier-pricing-rules/
├── index.vue           # 列表页面 - 显示所有自动询价规则（带拖拽排序）
├── RuleDialog.vue      # 弹窗组件 - 新增/编辑规则配置（左右分栏布局）
├── types.ts            # 类型定义文件
└── README.md           # 本文档
```

## 菜单位置

主导航 > **Automation (Settings)** > **Rate Shipping**

## 路由配置

- `/settings/carrier-pricing-rules` - 列表页（所有操作在弹窗中完成）

## 设计模式

本模块参考了 `OrderAutomations.vue` 的设计模式：

### 列表页特性
- ✅ **拖拽排序**: 通过拖动行来调整规则优先级，无需手动输入数字
- ✅ **实时筛选**: 支持按名称、承运商、状态搜索
- ✅ **状态切换**: 直接在列表中启用/禁用规则
- ✅ **空状态**: 友好的空列表提示

### 弹窗界面
- **左侧边栏**: 基本信息 + 可选条件选择
- **右侧内容区**: 详细配置表单（根据左侧选择动态显示）
- **响应式设计**: 适配不同屏幕尺寸

## 四大核心配置模块

### 1️⃣ 触发条件（Trigger Conditions）

定义什么情况下触发这个规则进行自动询价。

#### 订单状态条件
- **Order Status**: 选择哪些订单状态触发询价
  - Pending（待处理）
  - Processing（处理中）
  - Ready to Ship（准备发货）
  - Awaiting Fulfillment（等待履行）

#### 目的地条件
- **Destination Countries**: 目的地国家（如：US, CN, UK, EU）
- **Destination States**: 目的地州（如：CA, NY, TX）
- **Destination Zip Codes**: 目的地邮编

#### 包裹条件
- **Weight Range**: 重量范围（kg）
  - Weight Min: 最小重量
  - Weight Max: 最大重量

#### 订单价值条件
- **Order Value Range**: 订单金额范围（$）
  - Order Value Min: 最小金额
  - Order Value Max: 最大金额

#### 产品条件
- **Product SKUs**: 特定产品SKU
- **Product Categories**: 产品类别

#### 客户条件
- **Customer Tags**: 客户标签
- **Customer Groups**: 客户组

---

### 2️⃣ 询价配置（Rate Shopping Configuration）

配置向哪些承运商询价，使用哪个账户。

#### 承运商配置（可添加多个）

每个承运商需要配置：

**基本设置：**
- ✅ **Enabled/Disabled**: 是否启用该承运商
- 🔑 **Shipping Account**: 选择关联的 Shipping Account
  - 下拉列表只显示该承运商的账户
  - 显示格式：`账户名称 (账户号)`
  - 选择后账户名称会回显在规则中

**服务类型：**
- **Service Types**: 选择查询哪些服务类型
  - Ground（陆运）
  - Express（快递）
  - Overnight（隔夜）
  - 2-Day（两日达）
  - International（国际）
  - Economy（经济）

**价格调整（可选）：**
- **Markup Type**: 价格调整类型
  - None（无调整）
  - Percentage（百分比）
  - Fixed Amount（固定金额）
- **Markup Value**: 调整值
  - 如选择 Percentage：输入百分比（如10表示+10%）
  - 如选择 Fixed Amount：输入金额（如5表示+$5）

#### 示例配置：
```
✅ FedEx
   Account: FedEx Main Account (123456789)
   Services: Ground, Express, 2-Day
   Markup: +10%

✅ UPS
   Account: UPS Business Account (987654321)
   Services: Ground, Express
   Markup: None

✅ USPS
   Account: USPS Standard (555666777)
   Services: Ground, Priority
   Markup: +$2.00
```

---

### 3️⃣ 选择逻辑（Selection Logic）

配置如何从询价结果中选择最优方案。

#### 主要选择标准
- **Cheapest Rate（最便宜）**: 选择价格最低的选项
- **Fastest Delivery（最快送达）**: 选择时效最快的选项
- **Custom Balance（自定义平衡）**: 自定义价格和速度的权重
  - Price Weight: 价格权重 (0-100%)
  - Speed Weight: 速度权重 (自动计算 = 100% - 价格权重)

#### 承运商优先级（Tie Breaker）
- 当多个选项价格/时效相近时的优先顺序
- 通过拖拽排序设置优先级
- 示例：FedEx > UPS > USPS

#### 排除条件
- **Max Price Limit**: 最高价格限制（超过则不考虑）
- **Max Delivery Days**: 最长送达时间限制（超过则不考虑）

#### Fallback 策略
- **Manual Review**: 提交人工审核
- **Cheapest Available**: 选择最便宜的可用选项
- **Specific Carrier**: 使用指定的承运商

---

### 4️⃣ 审核规则（Review Rules）

配置哪些情况需要人工审核，而不是自动应用。

#### 启用审核
- ☑️ **Require manual review for this rule**: 是否需要审核

#### 审核触发条件（任一满足即触发）

**价格相关：**
- **Price Exceeds ($)**: 价格超过指定金额
- **Price Deviation (%)**: 价格偏离预期/历史价格的百分比

**包裹相关：**
- **Weight Exceeds (kg)**: 重量超过阈值

**异常情况：**
- ☑️ **No rates available**: 没有任何承运商返回费率
- ☑️ **All rates exceed budget**: 所有费率都超过预算

**特定场景：**
- **Specific Destinations**: 特定目的地（如某些国家/州）
- **Specific Carriers**: 特定承运商被选中
- **Specific Service Types**: 特定服务类型被选中

#### 通知设置
- **Notify Emails**: 发送审核通知的邮箱地址（逗号分隔）

---

## 列表页功能

### 展示字段
| 字段 | 说明 |
|------|------|
| 拖拽手柄 | 拖动行来调整优先级（替代手动输入） |
| Rule Name | 规则名称 |
| Carriers | 配置的承运商标签（只显示启用的） |
| Selection Method | 选择方法（最便宜/最快/自定义） |
| Trigger Conditions | 触发条件概要（订单状态、目的地等） |
| Review | 是否需要审核（Required/Auto） |
| Status | 状态开关（可直接切换启用/禁用） |
| Operations | 编辑/复制/删除操作（图标按钮） |

### 拖拽排序功能
- 🎯 **拖拽调整**: 点击并拖动左侧手柄，上下移动行来调整优先级
- 📊 **实时更新**: 拖拽完成后自动更新所有规则的优先级数字
- 🎨 **视觉反馈**: 拖拽时行高亮显示，其他行半透明
- ⚡ **即时保存**: 优先级更改立即生效并保存

### 弹窗操作
- **新增规则**: 点击"Create Rule"按钮打开弹窗
- **编辑规则**: 点击操作栏的编辑按钮打开弹窗
- **弹窗布局**:
  - 左侧：基本信息、条件选择器
  - 右侧：详细配置表单（滚动查看）

### 功能特性
- ✅ 搜索过滤（规则名称、描述）
- ✅ 承运商筛选（下拉选择）
- ✅ 状态筛选（All/Active/Inactive）
- ✅ 一键启用/禁用规则
- ✅ 承运商标签展示
- ✅ 分页支持
- ✅ 空状态提示

---

## 使用场景示例

### 场景1：美国国内标准运输
```
规则名称: US Domestic Standard Shipping
触发条件:
  - 订单状态: Ready to Ship
  - 目的地: US
  - 重量: 0-20kg

询价配置:
  - FedEx (Main Account): Ground, Express, 2-Day
  - UPS (Business Account): Ground, Express
  - USPS (Standard): Ground, Priority

选择逻辑: 最便宜
审核: 不需要
```

### 场景2：国际高价值订单
```
规则名称: International High-Value Orders
触发条件:
  - 订单状态: Ready to Ship
  - 目的地: CN, UK, EU
  - 订单金额: ≥$500

询价配置:
  - FedEx (Main Account): International, Express
  - DHL (Express Account): International

选择逻辑: 最快送达
审核: 需要
  - 价格超过 $100
  - 价格偏离 >20%
```

### 场景3：加州轻量包裹
```
规则名称: California Lightweight Packages
触发条件:
  - 订单状态: Ready to Ship
  - 目的地州: CA
  - 重量: 0-5kg

询价配置:
  - USPS (Standard): Ground, Priority + 10% markup
  - FedEx (Main Account): Ground

选择逻辑: 最便宜
承运商优先级: USPS > FedEx
审核: 不需要
```

---

## 实际运行流程

### 1. 订单到达 Ready to Ship 状态

### 2. 系统检查所有启用的规则
- 按 Priority 从小到大排序
- 找到第一个匹配的规则

### 3. 执行 Rate Shopping
```javascript
// 并行调用承运商API
Promise.all([
  fetchFedExRates(order, account),
  fetchUPSRates(order, account),
  fetchUSPSRates(order, account)
])
```

### 4. 应用价格调整
```javascript
// 如果配置了 Markup
if (markupType === 'percentage') {
  adjustedPrice = originalPrice * (1 + markupValue/100)
} else if (markupType === 'fixed') {
  adjustedPrice = originalPrice + markupValue
}
```

### 5. 根据选择逻辑选择最优方案
```javascript
if (selectionLogic === 'cheapest') {
  selectedRate = rates.sort((a, b) => a.price - b.price)[0]
} else if (selectionLogic === 'fastest') {
  selectedRate = rates.sort((a, b) => a.days - b.days)[0]
} else if (selectionLogic === 'custom') {
  // 计算加权分数
  score = (price * priceWeight + days * speedWeight) / 100
}
```

### 6. 检查审核条件
```javascript
if (requireReview) {
  if (price > priceThreshold || 
      deviation > deviationThreshold || 
      noRatesAvailable) {
    submitForReview()
    return
  }
}
```

### 7. 自动应用
```javascript
// 创建 Shipment
createShipment({
  carrier: selectedRate.carrier,
  service: selectedRate.service,
  account: selectedRate.account,
  price: selectedRate.price
})
```

---

## API 集成要点

### 后端需要实现的API

#### 1. 规则管理
- `GET /api/rate-shopping-rules` - 获取规则列表
- `POST /api/rate-shopping-rules` - 创建规则
- `PUT /api/rate-shopping-rules/:id` - 更新规则
- `DELETE /api/rate-shopping-rules/:id` - 删除规则
- `PATCH /api/rate-shopping-rules/:id/status` - 切换启用状态

#### 2. Shipping Account 查询
- `GET /api/shipping-accounts?carrier=fedex` - 按承运商获取账户列表

#### 3. 承运商API集成
- FedEx Rate API
- UPS Rating API
- USPS Web Tools API
- DHL Express API

#### 4. 执行引擎
- 规则匹配引擎
- 并行询价引擎
- 选择逻辑引擎
- 审核工作流

---

## 注意事项

### 规则优先级
- 通过拖拽调整优先级，列表顺序即为执行顺序
- 位于顶部的规则优先级最高
- 系统使用第一个匹配的规则
- 建议规则排序：
  - **顶部**: 特殊规则（特定客户、高价值订单）
  - **中部**: 常规规则（按地区、重量等）
  - **底部**: 兜底规则（默认规则）

### Shipping Account 关联
- 必须先创建 Shipping Account才能配置规则
- 账户信息会回显在列表的展开详情中
- 删除 Shipping Account 前需要先解除规则关联

### 价格调整策略
- Markup 用于调整承运商报价
- 常见用途：
  - 给客户加价（利润）
  - 补偿额外成本（包装、保险）
  - 测试不同价格策略

### 审核流程
- 触发审核后订单不会自动发货
- 需要人工在审核界面确认
- 可以选择使用询价结果或手动修改

### API 调用限制
- 注意承运商 API 的调用频率限制
- 建议对询价结果做缓存（相同参数）
- 考虑实现失败重试机制

---

## 后续优化建议

- [x] ~~规则复制功能~~ ✅ 已实现（Duplicate 按钮）
- [x] ~~拖拽排序~~ ✅ 已实现（可拖动行调整优先级）
- [x] ~~弹窗式编辑~~ ✅ 已实现（参考 Automation 模块）
- [ ] 规则测试功能（输入订单参数测试匹配和选择结果）
- [ ] 规则执行日志（查看历史询价记录）
- [ ] 规则性能统计（节省了多少成本）
- [ ] 规则模板（常用规则快速创建）
- [ ] 条件组合（AND/OR 逻辑）
- [ ] 时间段限制（特定时间启用）
- [ ] A/B 测试支持
- [ ] 智能学习（基于历史数据优化选择）
- [ ] 预估价格对比（实际价格 vs 预估价格）

---

## 与其他模块的关系

### Shipping Account 模块
- 提供承运商账户信息
- Rate Shopping 使用这些账户调用 API

### Order Management 模块
- 订单状态变更触发规则检查
- 选中的费率应用到订单

### Automation 模块
- 作为自动化规则的一部分
- 可与其他自动化规则配合使用

### Review/Approval 模块
- 需要审核的订单进入审核队列
- 审核通过后应用选中的费率

---

## 技术栈

- Vue 3 + TypeScript
- Element Plus UI
- Sortable.js（表格行拖拽排序）
- vue-draggable-next（承运商优先级拖拽）
- 表单验证
- 弹窗式编辑
- 左右分栏布局
- 响应式设计

---

## 总结

这个模块实现了美国标准的承运商自动询价流程，核心特点：

✅ **灵活的触发条件** - 支持多维度条件组合  
✅ **多承运商支持** - 并行询价提高效率  
✅ **Account 关联** - 使用真实账户获取协议价  
✅ **智能选择** - 多种选择策略  
✅ **价格调整** - 灵活的 Markup 配置  
✅ **审核机制** - 异常情况人工介入  
✅ **可视化配置** - 友好的UI界面  
✅ **拖拽排序** - 直观的优先级调整  
✅ **弹窗编辑** - 左右分栏的高效布局  
✅ **条件选择器** - 动态表单配置  

这是一个完整的、符合美国业务实践的承运商询价自动化解决方案，UI设计参考了成熟的 Automation 模块！🎉
