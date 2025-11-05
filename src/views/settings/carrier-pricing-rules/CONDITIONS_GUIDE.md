# Rate Shipping 触发条件完整指南

基于美国标准物流流程设计的完整触发条件列表。

## 📋 条件分类

### 1️⃣ Order Filters（订单过滤）

#### Order Status（订单状态）
- **用途**: 根据订单状态触发询价
- **选项**: Pending, Processing, Ready to Ship, Awaiting Fulfillment
- **业务场景**: 只对"准备发货"状态的订单自动询价

#### Order Value Range（订单金额范围）
- **用途**: 根据订单总金额筛选
- **配置**: 最小值 / 最大值
- **业务场景**: 
  - 高价值订单使用快递服务
  - 低价值订单使用经济服务

#### Sales Channels（销售渠道）
- **用途**: 区分不同销售渠道
- **选项**: Amazon, eBay, Shopify, WooCommerce, Walmart, Website, Wholesale
- **业务场景**: 
  - Amazon订单必须使用Prime配送
  - 批发渠道使用经济运输

---

### 2️⃣ Destination Filters（目的地过滤）

#### Destination Countries（目的地国家）
- **用途**: 国际 vs 国内运输
- **选项**: US, CN, UK, EU等
- **业务场景**: 
  - 美国国内使用USPS Ground
  - 国际订单使用FedEx International

#### Destination States（目的地州）
- **用途**: 特定州的运输策略
- **选项**: 全部50个美国州
- **业务场景**: 
  - 加州订单使用区域承运商
  - 阿拉斯加/夏威夷额外处理

#### Destination Zip Codes（目的地邮编）
- **用途**: 更精确的地理定位
- **配置**: 支持输入多个邮编或邮编范围
- **业务场景**: 
  - 偏远地区识别
  - 大都市区特殊处理

#### Address Type（地址类型）
- **用途**: 住宅 vs 商业地址
- **选项**: Any, Residential Only, Commercial Only
- **业务场景**: 
  - 住宅地址可能需要额外费用
  - 商业地址可能有更多运输选项

---

### 3️⃣ Origin Filters（发货地过滤）

#### Origin States（发货州）
- **用途**: 从特定州发货的订单
- **选项**: 全部50个美国州
- **业务场景**: 
  - 不同仓库使用不同承运商账户
  - 东西海岸用不同的区域承运商

#### Warehouses（仓库）
- **用途**: 特定仓库的运输策略
- **配置**: 选择已配置的仓库
- **业务场景**: 
  - 主仓库使用主要承运商
  - 第三方仓库使用其合作承运商

---

### 4️⃣ Package Characteristics（包裹特性）

#### Weight Range（重量范围）
- **用途**: 根据重量选择服务
- **配置**: 最小重量 / 最大重量（kg）
- **业务场景**: 
  - 轻量级包裹使用USPS First Class
  - 重量级包裹使用Freight服务

#### Package Count（包裹数量）
- **用途**: 多件货运处理
- **配置**: 最小数量 / 最大数量
- **业务场景**: 
  - 单件使用标准包裹服务
  - 多件使用LTL/FTL服务

#### Oversized Items（超大件）
- **用途**: 识别超大货物
- **配置**: 是/否
- **业务场景**: 
  - 超大件需要特殊处理
  - 可能需要Freight服务

---

### 5️⃣ Product Characteristics（产品特性）

#### Product SKUs（产品SKU）
- **用途**: 特定产品的运输规则
- **配置**: 输入或选择SKU列表
- **业务场景**: 
  - 特定产品使用特定承运商
  - 季节性产品特殊处理

#### Product Tags（产品标签）
- **用途**: 按产品标签分类
- **配置**: 选择或输入标签
- **业务场景**: 
  - "易碎品"标签增加保险
  - "促销品"标签使用经济服务

#### Hazmat/Dangerous Goods（危险品）
- **用途**: 识别危险品货物
- **配置**: 是/否
- **业务场景**: 
  - 危险品必须使用认证承运商
  - 需要特殊文件和标签
  - 某些服务不可用

#### Temperature Controlled（温控）
- **用途**: 需要温度控制的货物
- **配置**: 是/否
- **业务场景**: 
  - 食品、医药品需要冷链
  - 只能使用提供温控服务的承运商

#### Fragile Items（易碎品）
- **用途**: 易碎品特殊处理
- **配置**: 是/否
- **业务场景**: 
  - 增加保险金额
  - 使用更可靠但可能更贵的服务
  - 要求签名确认

---

### 6️⃣ Customer Filters（客户过滤）

#### Customer Type（客户类型）
- **用途**: 区分客户级别
- **选项**: Retail（零售）, Wholesale（批发）, VIP, Enterprise（企业）
- **业务场景**: 
  - VIP客户使用快递服务
  - 批发客户使用经济服务
  - 企业客户有定制运输协议

#### Customer Priority Level（客户优先级）
- **用途**: 客户优先级分级
- **选项**: Standard（标准）, Priority（优先）, Express（快速）
- **业务场景**: 
  - 高优先级客户优先使用快速服务
  - 标准客户使用性价比服务

#### Customer Tags（客户标签）
- **用途**: 自定义客户分组
- **配置**: 选择或输入标签
- **业务场景**: 
  - "免运费"客户使用协议价承运商
  - "国际客户"特殊处理

---

### 7️⃣ Service Requirements（服务要求）

#### Signature Required（签名要求）
- **用途**: 需要签名确认的订单
- **配置**: 是/否
- **业务场景**: 
  - 高价值订单要求签名
  - 成人签名（酒类等）
  - 排除不支持签名的服务

#### Saturday Delivery（周六配送）
- **用途**: 需要周六送达
- **配置**: 是/否
- **业务场景**: 
  - 紧急订单周六配送
  - 只查询支持周六送达的服务
  - 可能有额外费用

#### Liftgate Service（尾板服务）
- **用途**: 需要卸货辅助
- **配置**: 是/否
- **业务场景**: 
  - 重货配送到住宅
  - 收货地址没有装卸设备
  - Freight运输必需

---

### 8️⃣ Time Constraints（时间限制）

#### Order Date Range（订单日期范围）
- **用途**: 特定时间段的订单
- **配置**: 开始日期 / 结束日期
- **业务场景**: 
  - 旺季（黑五、圣诞）特殊规则
  - 促销活动期间使用快速服务
  - 淡季使用经济服务

#### Required Ship Date（要求发货日期）
- **用途**: 客户要求的发货日期
- **配置**: 具体日期
- **业务场景**: 
  - 紧急订单使用快递
  - 预售订单可以等待
  - 礼品订单按时送达

#### Business Days Only（仅工作日）
- **用途**: 限制仅工作日处理
- **配置**: 是/否
- **业务场景**: 
  - 商业地址周末不收货
  - 避免周末额外费用
  - 仓库周末不发货

---

## 🔍 询价设置（Rate Shopping Configuration）扩展

### 基础配置（已实现）
- Carrier Selection（承运商选择）
- Shipping Account（运输账户）
- Service Types（服务类型）
- Price Markup（价格调整）

### 高级配置（新增）

#### 📦 Package Configuration（包裹配置）

##### Default Package Type（默认包裹类型）
- **选项**: Box, Envelope, Pak, Tube, Pallet
- **用途**: API询价时的默认包裹类型

##### Default Dimensions（默认尺寸）
- **配置**: 长 × 宽 × 高（英寸或厘米）
- **用途**: 体积重量计算

##### Dimensional Weight Divisor（体积重量除数）
- **配置**: 数值（默认139国内，166国际）
- **公式**: (L × W × H) ÷ Divisor = 体积重量
- **用途**: 使用实际重量和体积重量中的较大值

---

#### 🛎️ Additional Services（附加服务）

##### Saturday Delivery（周六配送）
- **配置**: 启用/禁用
- **费用**: 通常 +$15-25

##### Signature Confirmation（签名确认）
- **选项**: 
  - None（无）
  - Adult Signature（成人签名）- 酒类
  - Direct Signature（直接签名）- 收件人本人
  - Indirect Signature（间接签名）- 任何人

##### Insurance（保险）
- **配置**: 启用/禁用，保险金额
- **费率**: 通常 $0.50 per $100

##### COD (Cash on Delivery)（货到付款）
- **配置**: 金额
- **用途**: 某些地区或客户类型

##### Residential Delivery（住宅配送）
- **配置**: 启用/禁用
- **费用**: FedEx +$4.45, UPS +$5.15

---

#### 🔍 Rate Filtering（费率过滤）

##### Max Rate Limit（最高费率限制）
- **用途**: 排除超过预算的选项
- **示例**: 不考虑超过$50的服务

##### Transit Time Constraints（时效限制）
- **Min Transit Days**: 最短时效（避免太慢）
- **Max Transit Days**: 最长时效（避免太快浪费）

---

#### ⚙️ API Configuration（API配置）

##### Timeout Settings（超时设置）
- **API Timeout**: 单个API调用超时（秒）
- **Retry Attempts**: 失败重试次数
- **Retry Delay**: 重试间隔

##### Test Mode（测试模式）
- **用途**: 使用测试凭证，不产生真实费用
- **环境**: 开发/测试环境使用

---

## 💡 实际业务场景示例

### 场景 1: Amazon Prime 订单
```yaml
规则名称: Amazon Prime Fast Shipping
触发条件:
  - Sales Channels: Amazon
  - Customer Tags: Prime
  - Order Status: Ready to Ship
询价配置:
  - FedEx (2-Day, Overnight)
  - UPS (2nd Day Air, Next Day Air)
选择逻辑: Fastest
审核: 不需要
```

### 场景 2: 加州住宅轻量包裹
```yaml
规则名称: CA Residential Light Packages
触发条件:
  - Destination States: CA
  - Address Type: Residential
  - Weight: 0-5 kg
  - Order Value: < $100
询价配置:
  - USPS (First Class, Priority)
  - OnTrac (Ground) +5% markup
选择逻辑: Cheapest
审核: 不需要
```

### 场景 3: 危险品国际运输
```yaml
规则名称: Hazmat International Shipping
触发条件:
  - Hazmat Flag: Yes
  - Destination Countries: CN, UK, EU
  - Order Status: Ready to Ship
询价配置:
  - FedEx (International, Express) - 认证账户
  - DHL (International) - 危险品认证账户
附加服务:
  - Signature Required: Direct
  - Insurance: Yes ($1000)
选择逻辑: Fastest (安全优先)
审核: 需要 (所有危险品订单)
  - 通知: hazmat@company.com
```

### 场景 4: 黑五大促期间
```yaml
规则名称: Black Friday Rush Orders
触发条件:
  - Order Date Range: 2024-11-24 to 2024-11-30
  - Destination: US
  - Weight: 0-10 kg
询价配置:
  - FedEx (Ground, 2-Day) - 备用账户
  - UPS (Ground, 3-Day)
  - USPS (Priority) +10% markup (拥堵附加费)
选择逻辑: Custom Balance (60% Price, 40% Speed)
审核: 价格超过 $75 需审核
```

### 场景 5: 批发大宗货运
```yaml
规则名称: Wholesale LTL Freight
触发条件:
  - Customer Type: Wholesale
  - Weight: > 150 kg
  - Package Count: > 5
询价配置:
  - Echo Freight (LTL)
  - SWFT Logistics (FTL)
附加服务:
  - Liftgate Required: 根据地址判断
  - Residential Delivery: 根据地址类型
包裹配置:
  - Package Type: Pallet
  - Freight Class: 根据产品类别
选择逻辑: Cheapest
审核: 价格超过 $500 或时效超过7天
```

### 场景 6: 温控医药品运输
```yaml
规则名称: Temperature Controlled Pharmaceuticals
触发条件:
  - Temperature Controlled: Yes
  - Product Tags: Pharmaceuticals
  - Order Value: > $200
询价配置:
  - FedEx (Priority Overnight, Standard Overnight)
    - 使用温控认证账户
  - 只查询支持冷链的服务
附加服务:
  - Signature Required: Direct (必须本人签收)
  - Insurance: Yes (订单金额的120%)
  - Saturday Delivery: 可选（避免周末延误）
选择逻辑: Fastest (时效优先，确保产品品质)
审核: 所有温控货物必须审核
  - 检查包装是否符合要求
  - 确认冰袋/干冰配置
  - 通知: coldchain@company.com
```

---

## 📊 条件优先级建议

### 🔴 高优先级（规则1-10）
1. 危险品专用规则
2. 温控货物规则
3. VIP客户规则
4. 紧急订单规则
5. 特殊销售渠道（Amazon Prime）

### 🟡 中优先级（规则11-50）
1. 区域性规则（州/邮编）
2. 重量/尺寸分段规则
3. 客户类型规则
4. 一般销售渠道规则

### 🟢 低优先级（规则51-100）
1. 兜底默认规则
2. 通用国内运输
3. 经济服务规则

---

## 🎯 最佳实践

### 1. 规则设计原则
✅ **从特殊到一般**: 特殊情况优先，通用规则兜底  
✅ **互斥条件**: 避免规则冲突  
✅ **明确边界**: 清晰的触发条件范围  
✅ **文档记录**: 每个规则写清楚用途  

### 2. 测试策略
✅ **测试模式**: 新规则先在测试环境验证  
✅ **小范围试运行**: 限制特定渠道或客户  
✅ **监控费率**: 对比实际费率与预期  
✅ **性能监控**: 关注API响应时间  

### 3. 维护建议
✅ **定期审查**: 每月检查规则有效性  
✅ **费率对比**: 对比不同承运商的协议价  
✅ **客户反馈**: 收集运输时效和费用反馈  
✅ **淡旺季调整**: 根据季节调整规则  

---

这套触发条件设计完全符合美国物流行业标准实践，覆盖了从小包裹到大货运、从普通商品到特殊货物的所有场景！🎉

