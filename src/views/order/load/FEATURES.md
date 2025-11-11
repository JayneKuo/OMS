# Load Management Module - 功能清单

## ✅ 已完成功能

### 📋 列表页 (index.vue)
- [x] 页面头部（标题、帮助图标、操作按钮）
- [x] 创建按钮
- [x] 导出下拉菜单（Excel/CSV）
- [x] 搜索表单（基础+高级搜索）
- [x] 状态标签页切换（6种状态）
- [x] 状态统计数量显示
- [x] 刷新和自定义列按钮
- [x] 批量选择和操作工具栏
- [x] 数据表格（15个字段）
- [x] 行内操作（View/Edit/More）
- [x] 分页组件
- [x] 列设置对话框
- [x] Mock数据生成
- [x] 响应式布局

### ✏️ 创建/编辑页 (create.vue)
- [x] 动态标题（Create/Edit）
- [x] 表单验证规则
- [x] 第一行：Load NO、Mode、Customer、Carrier
- [x] 第二行：Freight Term、Load Type、Appointment Time、Long Haul
- [x] 第三行：Pro No、Retailer Authorization、TMS Shipment ID、Desired Ship Date
- [x] 第四行：Freight Cost、Routing Request Date、Routing Receipt Date、Trailer Pick Up Mode
- [x] 第五行：Adjusted Pallet Qty
- [x] 三个地址表单（Ship From/To、Bill To）
- [x] 备注字段
- [x] 订单行表格组件
- [x] 保存和取消按钮
- [x] 加载状态
- [x] 路由参数处理（创建/编辑模式）

### 👁️ 详情页 (detail.vue)
- [x] 面包屑导航（Back按钮）
- [x] 动态标题和状态标签
- [x] 操作按钮（Print、Export、Edit、More）
- [x] 基本信息卡片（el-descriptions）
- [x] 三个地址卡片（Ship From/To、Bill To）
- [x] 订单行表格
- [x] 备注卡片
- [x] 更多操作下拉菜单
- [x] 删除确认对话框
- [x] 日期时间格式化
- [x] 空数据提示

### 🔍 搜索表单组件 (SearchForm.vue)
- [x] Load NO 搜索
- [x] Customer 下拉选择
- [x] Carrier 下拉选择
- [x] Mode 下拉选择
- [x] Pro NO 搜索
- [x] TMS Shipment ID 搜索
- [x] Created Date 日期范围
- [x] Ship Date 日期范围
- [x] 高级搜索折叠面板
- [x] Load Type 筛选
- [x] Retailer Authorization 搜索
- [x] Ship From City 搜索
- [x] Ship To City 搜索
- [x] Search/Reset 按钮
- [x] 回车键触发搜索

### 📍 地址表单组件 (AddressForm.vue)
- [x] 折叠/展开功能
- [x] 清空功能
- [x] Name、Company 字段
- [x] Address Line 1/2 字段
- [x] City、State、Zip Code 字段
- [x] Country、Phone、Email 字段
- [x] 双向数据绑定
- [x] 响应式布局

### 📦 订单行表格组件 (OrderLineTable.vue)
- [x] 5个功能按钮（Extract、Import、Refill、Add、Load Builder）
- [x] Batch Update Pro NO 按钮
- [x] Enable Load Sequence 开关
- [x] 序列号列（条件显示）
- [x] 8个数据列（Order NO、Customer、Reference NO等）
- [x] 状态标签
- [x] View/Remove 操作
- [x] 序列号输入框
- [x] 空数据提示

### 🎨 类型定义 (types.ts)
- [x] Load 接口
- [x] Address 接口
- [x] OrderLine 接口
- [x] OrderItem 接口
- [x] SearchParams 接口
- [x] ListResponse 接口
- [x] LOAD_MODES 常量（3种）
- [x] LOAD_TYPES 常量（3种）
- [x] TRAILER_PICKUP_MODES 常量（2种）
- [x] LOAD_STATUS 常量（6种状态）
- [x] LOAD_STATUS_MAP 映射

### 🛣️ 路由配置
- [x] /order/load - 列表页
- [x] /order/load/create - 创建页
- [x] /order/load/edit/:id - 编辑页
- [x] /order/load/:id - 详情页
- [x] 页面元信息（title）

### 📱 菜单配置
- [x] Orders > Load 菜单项
- [x] 图标配置

### 📚 文档
- [x] README.md - 完整功能说明
- [x] FEATURES.md - 功能清单
- [x] API集成说明
- [x] 待实现功能列表

## 🎯 设计特点

### 美国物流业务特性
✅ 基于美国物流业务流程设计
✅ 支持主流运输模式（Customer Routing、Prepaid、Collect）
✅ 支持主流装载类型（LTL、FTL、Parcel）
✅ 完整的地址管理（Ship From/To、Bill To）
✅ Pro NO（提单号）管理
✅ TMS系统集成
✅ Retailer Authorization（零售商授权）
✅ 窗口签到流程（Window Checkin）
✅ 拖车提货模式（Live Load、Drop Trailer）

### 状态流转
```
New → Loading → Window Checkin Done → Loaded → Shipped
                         ↓
                    Cancelled
```

### UI/UX 设计
- 现代化卡片式布局
- 响应式设计，支持不同屏幕尺寸
- 清晰的视觉层次
- 直观的操作流程
- 状态颜色编码
- 加载状态提示
- 空数据状态处理
- 友好的错误提示

### 技术栈
- Vue 3 Composition API
- TypeScript
- Element Plus
- Vue Router
- SCSS

## 📊 统计数据

- **总文件数**: 8个
  - 3个页面组件
  - 3个子组件
  - 1个类型定义
  - 1个README

- **代码行数**: 约3000+行
  - index.vue: ~600行
  - create.vue: ~450行
  - detail.vue: ~550行
  - SearchForm.vue: ~250行
  - AddressForm.vue: ~140行
  - OrderLineTable.vue: ~180行
  - types.ts: ~120行

- **组件数**: 6个
- **路由**: 4个
- **状态**: 6种
- **表单字段**: 20+个
- **表格列**: 15列

## 🚀 快速开始

1. 访问菜单：`Orders > Load`
2. 查看列表，点击状态标签筛选
3. 点击 "Create Load" 创建新装载单
4. 填写表单，添加订单行
5. 保存后在列表中查看
6. 点击 Load NO 查看详情
7. 点击 Edit 编辑装载单

## 🔗 相关页面

- 订单管理: `/order/sales`
- 发货请求: `/order/shipping-request`
- 物流发货: `/order/shipment`

## 📝 注意事项

1. 当前使用Mock数据，需要集成真实API
2. 部分功能显示"coming soon"，需要后续实现
3. 列设置持久化需要实现本地存储或后端保存
4. 打印和导出功能需要实现具体模板
5. 批量操作需要后端API支持

