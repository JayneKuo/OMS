# 产品管理系统完整规格文档

## 概述

本文档详细描述了OMS产品管理系统的完整实现规格，包括所有字段定义、筛选规则、排序逻辑、批量操作和按钮展示逻辑。

## 1. 产品数据结构

### 1.1 核心字段定义

#### 基础标识字段
- **id**: 产品唯一标识符 (string)
- **spu**: 标准产品单元编码 (string) - 用于多规格产品的父级标识
- **sku**: 库存保持单位编码 (string) - 具体商品的唯一标识
- **name**: 产品名称 (string) - 支持搜索
- **category**: 产品分类 (string) - 可排序，可筛选

#### 产品类型字段
- **type**: 产品类型 (enum)
  - 取值范围: `PHYSICAL` | `VIRTUAL` | `SERVICE` | `GIFT` | `SAMPLE` | `MATERIAL`
  - 显示标签:
    - PHYSICAL: 实体商品 (默认色)
    - VIRTUAL: 虚拟商品 (info色)
    - SERVICE: 服务类商品 (info色)
    - GIFT: 赠品 (success色)
    - SAMPLE: 样品 (warning色)
    - MATERIAL: 原材料 (warning色)

#### 状态字段
- **status**: 产品状态 (enum)
  - 取值范围: `Draft` | `Active` | `Inactive` | `Disabled`
  - 显示标签:
    - Draft: 草稿状态 (warning色，编辑图标)
    - Active: 激活状态 (success色，勾选图标)
    - Inactive: 未激活状态 (info色，关闭图标)
    - Disabled: 禁用状态 (danger色，关闭图标)
  - 权限控制:
    - 只有Draft状态的产品可以删除
    - 只有Draft状态的产品可以发布

#### 售卖相关字段
- **sellingForm**: 售卖形式 (enum)
  - 取值范围: `single` | `multi` | `bundle`
  - 显示标签:
    - single: 单规格 (默认色，商品图标)
    - multi: 多规格 (success色，网格图标)
    - bundle: 组合商品 (warning色，收藏图标)

- **sellingPrice**: 售价 (number) - 显示为货币格式，保留2位小数
- **cost**: 成本价 (number) - 可选显示，货币格式
- **regularPrice**: 常规价格 (number) - 可选显示，货币格式
- **salePrice**: 促销价格 (number) - 可选显示，货币格式

#### 数据来源字段
- **dataSource**: 数据来源 (enum)
  - 取值范围: `oms` | `external` | `api`
  - 显示标签:
    - oms: OMS创建 (success色)
    - external: 外部导入 (info色)
    - api: API同步 (warning色)

#### 渠道发布字段
- **publishedChannels**: 已发布渠道 (string[])
  - 可选值: `Shopify` | `Amazon` | `eBay` | `Walmart` | `B2B Portal`
  - 显示逻辑:
    - 有渠道时显示链接图标和渠道列表
    - 无渠道时显示关闭图标和"Not Published"

#### 库存和单位字段
- **quantity**: 库存数量 (number) - 可选显示，可排序
- **uom**: 计量单位 (string) - 默认值"EA"，可选显示

#### 供应商和品牌字段
- **vendor**: 供应商 (string) - 可选显示，可排序，可筛选
- **brand**: 品牌 (string) - 可选显示，可排序，可筛选

#### 标签字段
- **tags**: 标签列表 (string[]) - 可选显示，以小标签形式展示

#### 时间字段
- **created**: 创建时间 (string, ISO格式) - 默认显示，可排序
- **updated**: 更新时间 (string, ISO格式) - 默认显示，可排序
- **publishedAt**: 发布时间 (string, ISO格式) - 可选显示，可排序

#### SPU/SKU结构字段
- **isSpu**: 是否为SPU行 (boolean) - 用于多规格产品的父级行
- **isChild**: 是否为SKU行 (boolean) - 用于多规格产品的子级行
- **parentId**: 父级ID (string) - SKU行的父级SPU ID
- **variantCount**: 变体数量 (number) - SPU行显示变体总数
- **expanded**: 是否展开 (boolean) - SPU行的展开状态
- **variant**: 变体信息 (string) - SKU行显示的变体描述
- **children**: 子级产品列表 (Product[]) - SPU的所有SKU变体

#### 扩展字段（可选显示）
- **weight**: 重量 (number) - 可排序
- **weightUnit**: 重量单位 (string)
- **dimensions**: 尺寸信息 (string)
- **upc**: UPC码 (string)
- **ean**: EAN码 (string)
- **isbn**: ISBN码 (string)
- **mpn**: 制造商零件号 (string)
- **partId**: 零件ID (string)
- **externalProductId**: 外部产品ID (string)
- **taxClass**: 税务分类 (string)
- **hsCode**: 海关编码 (string)
- **countryOfOrigin**: 原产国 (string)

## 2. 筛选规则

### 2.1 搜索功能
- **搜索字段**: `searchQuery`
- **搜索范围**: name、spu、sku、vendor
- **搜索逻辑**: 模糊匹配，不区分大小写
- **防抖延迟**: 300ms
- **搜索行为**: 自动重置到第一页

### 2.2 筛选条件

#### Type筛选器
- **字段**: `filterType`
- **选项**:
  - Physical (PHYSICAL)
  - Virtual (VIRTUAL)
  - Service (SERVICE)
  - Gift (GIFT)
  - Sample (SAMPLE)
  - Material (MATERIAL)
- **清空**: 支持清空选项

#### Status筛选器
- **字段**: `filterStatus`
- **选项**:
  - Draft
  - Active
  - Inactive
  - Disabled
- **清空**: 支持清空选项

#### Selling Form筛选器
- **字段**: `filterSellingForm`
- **选项**:
  - Single (single)
  - Multi (multi)
  - Bundle (bundle)
- **清空**: 支持清空选项

#### Data Source筛选器
- **字段**: `filterDataSource`
- **选项**:
  - OMS (oms)
  - External (external)
  - API (api)
- **清空**: 支持清空选项

#### Channel筛选器
- **字段**: `filterIntegration`
- **选项**:
  - Shopify
  - Amazon
  - eBay
  - Walmart
- **筛选逻辑**: 检查产品的publishedChannels数组是否包含选中的渠道
- **清空**: 支持清空选项

### 2.3 筛选器状态检测
- **活跃筛选器检测**: `hasActiveFilters` 计算属性
- **检测字段**: searchQuery、filterType、filterStatus、filterSellingForm、filterDataSource、filterIntegration
- **清空所有筛选器**: `clearAllFilters()` 方法，重置所有筛选条件并重新加载数据

## 3. 排序规则

### 3.1 可排序字段
以下字段支持排序功能（sortable: true）:

#### 默认显示且可排序
- **sku**: SKU编码排序
- **name**: 产品名称排序
- **category**: 分类排序
- **sellingPrice**: 售价排序
- **created**: 创建时间排序
- **updated**: 更新时间排序

#### 可选显示且可排序
- **brand**: 品牌排序
- **uom**: 计量单位排序
- **quantity**: 库存数量排序
- **vendor**: 供应商排序
- **cost**: 成本价排序
- **regularPrice**: 常规价格排序
- **salePrice**: 促销价格排序
- **weight**: 重量排序
- **publishedAt**: 发布时间排序

### 3.2 排序实现
- **排序方法**: `handleSortChange({ prop, order })`
- **排序类型**: 'custom' - 由后端处理排序逻辑
- **排序状态**: 支持升序(ascending)、降序(descending)、无排序(null)

## 4. 列配置系统

### 4.1 列配置结构
```typescript
interface ColumnConfig {
  key: string;           // 字段键名
  title: string;         // 列标题
  visible: boolean;      // 是否显示
  width?: number;        // 列宽度
  fixed?: 'left'|'right';// 固定位置
  sortable?: boolean;    // 是否可排序
  filterable?: boolean;  // 是否可筛选
}
```

### 4.2 默认列配置

#### 默认显示列 (visible: true)
1. **sku** - SKU (120px, 左固定, 可排序)
2. **name** - Product Name (240px, 可排序)
3. **category** - Category (150px, 可排序)
4. **type** - Type (100px, 可筛选)
5. **sellingForm** - Selling Form (120px, 可筛选)
6. **sellingPrice** - Selling Price (120px, 可排序)
7. **status** - Status (100px, 可筛选)
8. **dataSource** - Data Source (120px, 可筛选)
9. **publishedChannels** - Published Channels (180px)
10. **created** - Created (130px, 可排序)
11. **updated** - Updated (130px, 可排序)

#### 可选显示列 (visible: false)
- **brand** - Brand (120px, 可排序, 可筛选)
- **uom** - UOM (80px, 可排序)
- **quantity** - Stock (90px, 可排序)
- **vendor** - Vendor (160px, 可排序, 可筛选)
- **cost** - Cost (100px, 可排序)
- **regularPrice** - Regular Price (120px, 可排序)
- **salePrice** - Sale Price (120px, 可排序)
- **tags** - Tags (180px)
- **integration** - Platform (120px, 可筛选)

#### 隐藏列（需要时可开启）
- 物理属性: weight, weightUnit, dimensions
- 标识码: upc, ean, isbn, mpn, partId, externalProductId
- 税务海关: taxClass, hsCode, countryOfOrigin
- 发布时间: publishedAt

### 4.3 列配置管理
- **配置对话框**: `columnDialogVisible`
- **保存配置**: localStorage存储，键名`productColumnConfig`
- **加载配置**: 页面初始化时从localStorage加载
- **拖拽排序**: 支持列的拖拽重排序
- **显示切换**: 每列都有开关控制显示/隐藏

## 5. SPU/SKU结构显示

### 5.1 行类型分类
- **SPU行** (`spu-row`): 多规格产品的父级行
- **SKU行** (`child-row`): 多规格产品的子级行  
- **单品行** (`single-row`): 单规格产品行

### 5.2 SPU/SKU显示逻辑

#### SPU行显示
- **展开按钮**: 当variantCount > 1时显示展开/收起箭头
- **SKU字段**: 显示SPU编码
- **展开状态**: 通过`expanded`字段控制
- **点击行为**: 点击SKU文本跳转到产品详情页

#### SKU行显示
- **缩进显示**: 左侧缩进24px
- **SKU字段**: 显示具体的SKU编码
- **变体信息**: 显示variant描述（如颜色、尺寸等）
- **父级关联**: 通过parentId关联到SPU
- **点击行为**: 点击SKU文本跳转到具体SKU详情页

#### 单品行显示
- **SKU字段**: 显示SPU编码（单品的SPU和SKU相同）
- **无展开**: 不显示展开按钮
- **点击行为**: 点击SKU文本跳转到产品详情页

### 5.3 展开/收起逻辑
- **切换方法**: `toggleVariants(row)`
- **状态更新**: 调用`toggleSpuExpansion(row.id)`更新模拟数据
- **界面刷新**: 重新加载产品列表以更新显示
- **动画效果**: 展开箭头旋转180度动画

## 6. 分页系统

### 6.1 分页配置
- **当前页**: `currentPage` (默认: 1)
- **页面大小**: `pageSize` (默认: 20)
- **总数**: `total`
- **页面大小选项**: [10, 20, 50, 100]

### 6.2 分页布局
- **布局**: "total, sizes, prev, pager, next, jumper"
- **位置**: 右对齐
- **响应式**: 移动端居中显示

### 6.3 分页事件
- **页面大小变更**: `handleSizeChange(val)` - 更新pageSize并重新加载
- **当前页变更**: `handleCurrentChange(val)` - 更新currentPage并重新加载

## 7. 批量操作系统

### 7.1 选择机制
- **选择方法**: `handleSelectionChange(selection)`
- **全选方法**: `handleSelectAll(selection)`
- **选择状态**: `selectedProducts` 数组存储选中的产品
- **选择显示**: 批量操作区域显示选中数量

### 7.2 批量操作权限控制

#### 批量删除权限
- **权限检查**: `canBatchDelete` 计算属性
- **权限规则**: 只有所有选中产品都是Draft状态才能删除
- **按钮状态**: 无权限时按钮禁用

#### 批量发布权限
- **权限检查**: `canBatchPublish` 计算属性
- **权限规则**: 只有所有选中产品都是Draft状态才能发布
- **按钮状态**: 无权限时按钮禁用

### 7.3 批量操作功能

#### 批量发布 (Batch Publish)
- **触发方法**: `handleBatchPublish()`
- **权限检查**: 筛选出Draft状态的产品
- **确认对话框**: 显示将要发布的产品数量
- **执行逻辑**: 模拟批量发布操作
- **反馈**: 成功消息提示
- **后续处理**: 清空选择，重新加载列表

#### 批量删除 (Batch Delete)
- **触发方法**: `handleBatchDelete()`
- **权限检查**: 筛选出Draft状态的产品
- **警告处理**: 如果包含非Draft产品，显示警告信息
- **确认对话框**: 危险类型，显示将要删除的产品数量
- **执行逻辑**: 循环调用`mockDeleteProduct`
- **反馈**: 成功消息提示删除数量
- **后续处理**: 清空选择，重新加载列表

#### 批量调价 (Batch Price Adjustment)
- **触发方法**: `handleBatchPriceAdjust()`
- **对话框**: `batchPriceDialogVisible`
- **调价参数**:
  - `type`: 'percentage' | 'fixed' (百分比或固定金额)
  - `operation`: 'increase' | 'decrease' (增加或减少)
  - `value`: 调价数值
- **验证规则**:
  - 百分比: 0-100%，精度1位小数，步长1
  - 固定金额: 0-9999，精度2位小数，步长0.01
- **确认方法**: `confirmBatchPriceAdjust()`
- **验证逻辑**: value必须大于0
- **执行逻辑**: 模拟批量调价
- **参数重置**: 执行后重置调价参数

#### 批量特价 (Batch Special Price)
- **触发方法**: `handleBatchSpecialPrice()`
- **对话框**: `batchSpecialPriceDialogVisible`
- **特价参数**:
  - `price`: 特价金额 (必填，>0)
  - `startDate`: 开始日期 (必填，datetime类型)
  - `endDate`: 结束日期 (必填，datetime类型)
- **验证规则**:
  - 特价必须大于0
  - 开始和结束日期都必须选择
  - 结束日期必须晚于开始日期
- **确认方法**: `confirmBatchSpecialPrice()`
- **执行逻辑**: 模拟批量设置特价
- **参数重置**: 执行后重置特价参数

### 7.4 批量操作UI布局

#### 批量操作区域
- **显示条件**: 始终显示 (v-if="selectedProducts.length > 0 || true")
- **布局**: 左右分布，左侧显示选择信息，右侧显示操作按钮
- **选择信息**: 
  - 有选择时: "X items selected"
  - 无选择时: "Select items for batch operations"

#### 按钮分组
- **批量操作组** (`batch-actions-group`):
  - Publish (success类型，上传图标)
  - Price (默认类型，金钱图标)
  - Special (warning类型，价格标签图标)
  - Delete (danger类型，删除图标)

- **工具操作组** (`utility-actions-group`):
  - Refresh (刷新图标)
  - Column Settings (设置图标)

#### 按钮状态控制
- **禁用条件**:
  - 无选择时: 所有批量操作按钮禁用
  - 无权限时: Delete和Publish按钮禁用
- **提示信息**: 每个按钮都有tooltip提示功能

## 8. 单个产品操作

### 8.1 行内操作按钮

#### 编辑按钮 (Edit)
- **图标**: Edit图标
- **类型**: warning链接按钮
- **方法**: `handleEdit(row)`
- **导航**: 跳转到编辑页面 `/product/edit/${row.id}`
- **权限**: 无限制

#### 发布按钮 (Publish)
- **显示条件**: 只在产品状态为Draft时显示
- **图标**: Upload图标
- **类型**: success链接按钮
- **方法**: `handlePublish(row)`
- **确认对话框**: 确认发布操作
- **权限检查**: 只有Draft状态可发布

#### 查看操作 (View)
- **触发**: 点击SKU文本
- **方法**: `handleView(row)`
- **导航**: 跳转到详情页面 `/product/view/${row.id}`
- **样式**: 可点击的紫色文本，hover效果

### 8.2 页面级操作按钮

#### 创建按钮 (Create)
- **位置**: 页面标题右侧
- **图标**: Plus图标
- **类型**: primary按钮
- **方法**: `handleCreate()`
- **导航**: 跳转到创建页面 `/product/create`

#### 导出按钮 (Export)
- **位置**: 页面标题右侧
- **图标**: Download图标
- **类型**: 默认按钮
- **功能**: 导出产品列表（待实现）

#### 刷新按钮 (Refresh)
- **位置**: 工具操作组
- **图标**: Refresh图标
- **方法**: `loadProducts()`
- **功能**: 重新加载产品列表

#### 列设置按钮 (Column Settings)
- **位置**: 工具操作组
- **图标**: Setting图标
- **方法**: `handleColumnConfig()`
- **功能**: 打开列配置对话框

## 9. 数据格式化显示

### 9.1 货币格式化
- **适用字段**: cost, regularPrice, salePrice, sellingPrice
- **格式**: `$ XX.XX`
- **精度**: 保留2位小数
- **默认值**: 0.00

### 9.2 日期格式化
- **适用字段**: created, updated, publishedAt
- **格式**: `YYYY-MM-DD HH:mm`
- **工具**: dayjs库
- **方法**: `formatDate(date)`

### 9.3 标签显示
- **标签字段**: tags数组
- **样式**: 小标签，浅色效果
- **布局**: 横向排列，自动换行
- **限制**: 最大宽度150px，超出显示省略号

### 9.4 分类标签显示
- **分类字段**: categories数组
- **样式**: info类型标签，朴素效果
- **布局**: 横向排列，自动换行

### 9.5 渠道显示
- **有渠道**: 显示链接图标 + 渠道列表（逗号分隔）
- **无渠道**: 显示关闭图标 + "Not Published"文本
- **颜色**: 有渠道为绿色，无渠道为灰色

## 10. 响应式设计

### 10.1 断点设置
- **大屏**: > 1200px - 完整布局
- **中屏**: 768px - 1200px - 调整布局
- **小屏**: 480px - 768px - 紧凑布局
- **超小屏**: < 480px - 垂直布局

### 10.2 响应式调整

#### 中屏适配 (768px - 1200px)
- 筛选器垂直排列
- 搜索框宽度调整为300px
- 操作按钮重新布局

#### 小屏适配 (480px - 768px)
- 页面标题垂直排列
- 批量操作区域垂直布局
- 搜索框宽度调整为250px
- 表格字体缩小为12px
- 分页居中显示

#### 超小屏适配 (< 480px)
- 页面标题字体缩小为20px
- 筛选器完全垂直排列
- 搜索框宽度调整为200px
- 表格字体缩小为11px
- 渠道标签垂直排列

## 11. 样式系统

### 11.1 主题变量
- 使用CSS自定义属性
- 支持亮色/暗色主题切换
- 颜色变量: `--el-color-*`
- 背景变量: `--el-bg-color-*`
- 边框变量: `--el-border-color-*`

### 11.2 交互效果
- **悬停效果**: 行悬停时背景色变化和轻微上移
- **点击效果**: 可点击元素的视觉反馈
- **过渡动画**: 所有状态变化都有0.2s-0.3s过渡
- **阴影效果**: 悬停时添加轻微阴影

### 11.3 固定列样式
- **左固定列**: 选择框和SKU列
- **右固定列**: 操作列
- **阴影效果**: 固定列边缘添加阴影分隔
- **背景同步**: 固定列背景与主表格同步

## 12. 错误处理和用户反馈

### 12.1 加载状态
- **加载指示器**: 表格加载时显示loading状态
- **加载变量**: `loading` 控制加载状态

### 12.2 错误处理
- **网络错误**: 显示错误消息"Failed to load product list"
- **操作失败**: 各类操作失败时的具体错误提示
- **验证错误**: 表单验证失败的警告信息

### 12.3 成功反馈
- **操作成功**: 各类成功操作的确认消息
- **数量反馈**: 批量操作成功时显示处理数量
- **状态更新**: 操作完成后自动刷新列表

## 13. 性能优化

### 13.1 防抖处理
- **搜索防抖**: 300ms延迟，避免频繁请求
- **使用工具**: lodash-es的debounce函数

### 13.2 虚拟滚动
- **表格滚动**: 大数据量时的滚动优化
- **最大高度**: `calc(100vh - 320px)`

### 13.3 内存管理
- **组件销毁**: 正确清理事件监听器
- **数据重置**: 页面切换时重置状态

## 14. 数据持久化

### 14.1 本地存储
- **列配置**: localStorage存储列显示配置
- **存储键**: `productColumnConfig`
- **数据格式**: JSON格式的列配置数组

### 14.2 状态恢复
- **页面加载**: 自动加载保存的列配置
- **配置同步**: 配置变更时实时保存

## 15. 国际化支持

### 15.1 多语言准备
- **文本提取**: 所有用户界面文本可提取为多语言资源
- **日期格式**: 支持不同地区的日期格式
- **数字格式**: 支持不同地区的数字和货币格式

### 15.2 RTL支持
- **布局适配**: CSS支持从右到左的文本方向
- **图标方向**: 箭头等方向性图标的适配

## 16. 扩展性设计

### 16.1 字段扩展
- **新增字段**: 通过修改defaultColumns配置轻松添加新列
- **字段类型**: 支持多种数据类型的显示格式化
- **自定义渲染**: 支持自定义列内容渲染

### 16.2 操作扩展
- **新增操作**: 可在批量操作和单个操作中添加新功能
- **权限控制**: 灵活的权限检查机制
- **插件化**: 支持功能的插件化扩展

---

本文档涵盖了产品管理系统的完整实现规格，为开发、测试和维护提供了全面的技术参考。
