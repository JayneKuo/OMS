# 产品基础信息组件完整规格文档 (BasicInfoRevised.vue)

## 概述

本文档详细描述了产品基础信息组件 `BasicInfoRevised.vue` 的完整实现规格，包括所有字段定义、表单验证规则、UI组件使用规范、文件上传功能和样式系统。

## 1. 组件结构

### 1.1 组件架构
```
BasicInfoRevised.vue
├── Basic Information Section (基础信息)
├── Product Attributes Section (产品属性)
├── Sales Attributes Section (销售属性)
├── Product Images Section (产品图片)
├── Product Videos Section (产品视频)
└── Logistics Information Section (物流信息)
```

### 1.2 依赖组件
- **CategorySelector**: 分类选择器组件
- **DynamicAttributes**: 动态属性组件
- **SalesAttributes**: 销售属性组件

### 1.3 类型定义
```typescript
interface Product {
  generalInfo: GeneralInfo;
  mediaInfo: MediaInfo;
  logisticsInfo: LogisticsInfo;
  // ... 其他字段
}
```

## 2. 基础信息区域 (Basic Information)

### 2.1 字段定义

#### Product Name (产品名称)
- **字段**: `form.generalInfo.productName`
- **类型**: `string`
- **验证规则**:
  - 必填字段 (required)
  - 最大长度: 1000字符
  - 显示字符计数
- **UI组件**: `el-input`
- **尺寸**: large
- **帮助文本**: "Product name displayed in all channels and marketplaces"

#### SKU (库存保持单位)
- **字段**: `form.generalInfo.parentSku`
- **类型**: `string`
- **验证规则**:
  - 必填字段 (required)
  - 系统内唯一性约束
- **UI组件**: `el-input`
- **尺寸**: large
- **帮助文本**: "Unique identifier for this product, must be unique across all products"

#### Product Type (产品类型)
- **字段**: `form.generalInfo.type`
- **类型**: `enum`
- **验证规则**: 必填字段 (required)
- **取值范围**:
  - `PHYSICAL`: Physical Product - 实体商品
  - `VIRTUAL`: Virtual Product - 虚拟商品 (点卡、话费充值)
  - `SERVICE`: Service - 服务类商品 (延保、上门服务)
  - `GIFT`: Gift - 赠品 (促销礼品，可独立标记)
  - `SAMPLE`: Sample - 样品 (试用装、样品)
  - `MATERIAL`: Material - 原材料 (B2B/供应链场景)
- **UI组件**: `el-select`
- **显示格式**: 每个选项包含标签和描述
- **帮助文本**: "Product type classification"

#### Product Status (产品状态)
- **字段**: `form.generalInfo.status`
- **类型**: `enum`
- **验证规则**: 必填字段 (required)
- **取值范围**:
  - `Draft`: 草稿状态 - 初始状态，未发布
  - `Active`: 激活状态 - 已发布，可用
  - `Inactive`: 未激活状态 - 暂时禁用
  - `Disabled`: 禁用状态 - 永久禁用
- **UI组件**: `el-select`
- **默认值**: Draft
- **显示格式**: 每个选项包含状态标签和描述
- **帮助文本**: "System default is Draft, can be switched to Active, Inactive, or Disabled"

#### UOM (计量单位)
- **字段**: `form.generalInfo.unitOfMeasure`
- **类型**: `enum`
- **验证规则**: 必填字段 (required)
- **分组选项**:
  - **Common (常用)**:
    - `EA`: Each (个)
    - `PCS`: Piece (件)
    - `BOX`: Box (盒)
    - `CTN`: Carton (箱)
  - **Weight (重量)**:
    - `KG`: Kilogram (千克)
    - `G`: Gram (克)
    - `LB`: Pound (磅)
  - **Volume (体积)**:
    - `L`: Liter (升)
    - `ML`: Milliliter (毫升)
- **UI组件**: `el-select` with `el-option-group`
- **帮助文本**: "Product measurement unit such as EA, BOX, KG"

#### Category (分类)
- **字段**: `form.generalInfo.category`
- **类型**: `CategoryInfo`
- **验证规则**: 可选
- **UI组件**: `CategorySelector` (自定义组件)
- **功能**: 支持平台分类映射
- **帮助文本**: "Support platform category mapping"

#### Brand (品牌)
- **字段**: `form.generalInfo.brand`
- **类型**: `string`
- **验证规则**: 可选
- **UI组件**: `el-select` (可筛选)
- **数据源**: 预定义品牌列表 `['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Canon']`
- **功能**: 支持搜索筛选
- **约束**: 必须是系统中已存在的品牌
- **帮助文本**: "Must be an existing brand in the system"

#### Barcode (条码)
- **字段**: `form.generalInfo.sku`
- **类型**: `string`
- **验证规则**: 可选
- **UI组件**: `el-input`
- **支持格式**: EAN/UPC/ISBN
- **帮助文本**: "Product barcode, supports EAN/UPC/ISBN format"

#### Description (描述)
- **字段**: `form.generalInfo.description`
- **类型**: `string`
- **验证规则**:
  - 可选
  - 最大长度: 5000字符
  - 显示字符计数
- **UI组件**: `el-input` (textarea类型)
- **行数**: 4行
- **帮助文本**: "Detailed description of the product"

#### Keywords (关键词)
- **字段**: `keywords`
- **类型**: `string[]`
- **验证规则**: 可选
- **UI组件**: `el-select` (多选)
- **功能**:
  - 支持多选
  - 支持筛选
  - 支持创建新关键词 (allow-create)
  - 默认选择第一个选项
- **帮助文本**: "Keywords to improve search visibility, press Enter to add"

## 3. 产品属性区域 (Product Attributes)

### 3.1 动态属性组件
- **组件**: `DynamicAttributes`
- **数据绑定**: `v-model="dynamicAttributesValue"`
- **属性传递**: `:category-info="form.generalInfo.category"`
- **功能**: 根据选择的分类动态显示相应的属性字段

### 3.2 属性数据结构
```typescript
const dynamicAttributesValue = ref({
  platformAttributes: {},
  customAttributes: []
});
```

## 4. 销售属性区域 (Sales Attributes)

### 4.1 销售属性组件
- **组件**: `SalesAttributes`
- **数据绑定**: `v-model="salesAttributesValue"`
- **功能**: 配置产品的销售形式和规格属性

### 4.2 销售属性数据结构
```typescript
const salesAttributesValue = ref({
  sellingForm: 'single',        // 销售形式
  dimensions: [],               // 规格维度
  primaryDimension: '',         // 主要维度
  colorOptions: [],            // 颜色选项
  sizeOptions: [],             // 尺寸选项
  styleOptions: [],            // 样式选项
  bundleProducts: []           // 组合产品
});
```

## 5. 产品图片区域 (Product Images)

### 5.1 主图上传

#### 上传配置
- **字段**: `mainImageFiles`
- **类型**: `FileList`
- **UI组件**: `el-upload`
- **上传模式**: `list-type="picture-card"`
- **限制条件**:
  - 最大数量: 5张
  - 自动上传: false
  - 接受格式: `image/*`
- **推荐规格**:
  - 尺寸: 1000x1000px
  - 格式: JPG, PNG, WebP
  - 大小: 最大5MB每张

#### 上传提示
- **提示文本**: "Upload up to 5 main product images • Recommended size: 1000x1000px • Supported formats: JPG, PNG, WebP • Max 5MB per image"
- **样式**: 信息提示框，深色主题

### 5.2 SKU图片上传

#### 上传需求表格
- **表格结构**: 
  - SKU规格列 (300px宽)
  - 图片上传列 (500px宽)
- **上传限制**:
  - 格式: JPG, JPEG, PNG
  - 大小: 最大3MB每张
  - 推荐尺寸: 800x800像素
  - 最大数量: 每个SKU 10张图片
  - 支持拖拽排序

#### 示例SKU行
```
SKU001-RED-L    [+ Upload Images] 0/10
SKU001-BLUE-M   [+ Upload Images] 0/10
SKU001-GREEN-S  [+ Upload Images] 0/10
```

#### 上传按钮样式
- **按钮文本**: "+ Upload Images"
- **计数显示**: "0/10" 格式
- **交互效果**: 悬停时变色和轻微上移

## 6. 产品视频区域 (Product Videos)

### 6.1 视频文件上传

#### 上传配置
- **字段**: `videoFiles`
- **类型**: `FileList`
- **UI组件**: `el-upload`
- **限制条件**:
  - 最大数量: 3个视频
  - 自动上传: false
  - 接受格式: `video/*`
  - 最大大小: 100MB每个
- **上传提示**: "Max 3 videos, 100MB each"

### 6.2 视频URL
- **字段**: `form.mediaInfo.videoUrl`
- **类型**: `string`
- **UI组件**: `el-input`
- **功能**: 作为文件上传的替代方案
- **支持平台**: YouTube, Vimeo或其他视频URL
- **帮助文本**: "Alternative to file upload"

## 7. 物流信息区域 (Logistics Information)

### 7.1 重量信息

#### 净重 (Net Weight)
- **字段**: `form.logisticsInfo.weight.net`
- **类型**: `number`
- **验证规则**:
  - 最小值: 0
  - 精度: 2位小数
- **UI组件**: `el-input-number`
- **单位选择**: 
  - `kg`: 千克
  - `g`: 克
  - `lb`: 磅
  - `oz`: 盎司

#### 毛重 (Gross Weight)
- **字段**: `form.logisticsInfo.weight.gross`
- **类型**: `number`
- **验证规则**:
  - 最小值: 0
  - 精度: 2位小数
- **UI组件**: `el-input-number`
- **单位选择**: 与净重共享单位字段

### 7.2 尺寸信息 (Dimensions L×W×H)

#### 长宽高输入
- **字段**: 
  - `form.logisticsInfo.dimensions.length`
  - `form.logisticsInfo.dimensions.width`
  - `form.logisticsInfo.dimensions.height`
- **类型**: `number`
- **验证规则**:
  - 最小值: 0
  - 精度: 1位小数
- **UI组件**: `el-input-number`
- **布局**: 水平排列，用 "×" 分隔
- **单位选择**:
  - `cm`: 厘米
  - `inch`: 英寸
  - `mm`: 毫米

## 8. 表单验证规则

### 8.1 必填字段验证
- **Product Name**: 必填，最大1000字符
- **SKU**: 必填，唯一性验证
- **Product Type**: 必填，枚举值验证
- **Product Status**: 必填，枚举值验证
- **UOM**: 必填，枚举值验证
- **Main Images**: 必填，至少1张图片

### 8.2 可选字段验证
- **Description**: 最大5000字符
- **Barcode**: 格式验证 (EAN/UPC/ISBN)
- **Brand**: 系统品牌列表验证
- **Weight**: 非负数，精度验证
- **Dimensions**: 非负数，精度验证

### 8.3 文件上传验证
- **图片格式**: JPG, PNG, WebP
- **图片大小**: 主图5MB，SKU图片3MB
- **图片数量**: 主图最多5张，SKU图片最多10张
- **视频格式**: 所有video/*格式
- **视频大小**: 最大100MB
- **视频数量**: 最多3个

## 9. UI组件规范

### 9.1 表单布局
- **标签位置**: 右对齐 (label-position="right")
- **标签宽度**: 200px
- **组件尺寸**: large (统一使用大尺寸)
- **间距**: 表单项间距20px

### 9.2 区域分割
- **区域容器**: `.info-section`
- **区域标题**: `.section-title` 带图标和渐变背景
- **区域内容**: `.section-content` 统一内边距24px
- **区域间距**: 底部间距24px

### 9.3 帮助文本
- **样式**: `.help-text`
- **颜色**: `#a0aec0` (浅灰色)
- **字体大小**: 13px
- **位置**: 表单控件下方，间距6px

## 10. 深色主题样式系统

### 10.1 颜色方案
- **主背景**: `#1e1e1e`
- **区域背景**: `#2d3748`
- **边框颜色**: `#4a5568`
- **文本颜色**: `#e2e8f0`
- **次要文本**: `#cbd5e0`
- **占位符**: `#718096`
- **主色调**: `#63b3ed`

### 10.2 交互状态
- **悬停状态**: 边框变为主色调
- **聚焦状态**: 边框主色调 + 阴影效果
- **按钮悬停**: 背景色变化 + 轻微上移
- **禁用状态**: 降低透明度

### 10.3 组件样式定制

#### 输入框 (el-input)
```scss
:deep(.el-input__wrapper) {
  background-color: #2d3748;
  border: 1px solid #4a5568;
  
  &:hover {
    border-color: #63b3ed;
  }
  
  &.is-focus {
    border-color: #63b3ed;
    box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
  }
}
```

#### 选择器 (el-select)
- 继承输入框样式
- 下拉选项深色主题适配

#### 数字输入 (el-input-number)
- 增减按钮深色主题
- 悬停状态突出显示

#### 上传组件 (el-upload)
- 拖拽区域深色背景
- 悬停状态边框高亮
- 图片卡片深色主题

## 11. 响应式设计

### 11.1 移动端适配 (≤768px)
- **内容边距**: 减少为16-20px
- **图片上传**: 垂直排列
- **尺寸输入**: 垂直堆叠，隐藏分隔符
- **表格**: 字体缩小为12px

### 11.2 布局调整
- **两列布局**: 在小屏幕上变为单列
- **按钮组**: 垂直排列或自适应换行
- **表单标签**: 可能调整为顶部对齐

## 12. 数据流和事件处理

### 12.1 Props接收
```typescript
const props = defineProps<{
  form: Product;
}>();
```

### 12.2 数据绑定
- **双向绑定**: 所有表单字段与 `form` 对象绑定
- **子组件通信**: 通过 `v-model` 与子组件交互
- **文件上传**: 独立的 ref 管理文件列表

### 12.3 数据验证
- **实时验证**: 表单字段失焦时验证
- **提交验证**: 表单提交前完整验证
- **错误显示**: Element Plus 内置错误提示

## 13. 性能优化

### 13.1 组件懒加载
- **子组件**: CategorySelector、DynamicAttributes、SalesAttributes
- **图标**: 按需引入 Element Plus 图标

### 13.2 文件处理
- **图片预览**: 本地预览，避免频繁上传
- **文件压缩**: 上传前可选压缩
- **进度显示**: 大文件上传进度反馈

## 14. 扩展性设计

### 14.1 字段扩展
- **动态属性**: 通过 DynamicAttributes 组件扩展
- **自定义字段**: 支持添加自定义属性
- **平台适配**: 支持不同平台的特殊字段

### 14.2 功能扩展
- **多语言**: 预留多语言支持接口
- **模板**: 支持产品信息模板功能
- **批量编辑**: 支持批量修改产品信息

## 15. 错误处理和用户体验

### 15.1 错误反馈
- **字段验证**: 实时错误提示
- **文件上传**: 上传失败错误处理
- **网络错误**: 友好的错误提示

### 15.2 用户引导
- **帮助文本**: 每个字段都有详细说明
- **提示信息**: 重要操作的提示说明
- **进度指示**: 多步骤操作的进度显示

### 15.3 数据保护
- **自动保存**: 定期保存草稿
- **离开确认**: 未保存数据的离开确认
- **版本控制**: 支持数据版本管理

---

本文档涵盖了产品基础信息组件的完整实现规格，为开发、测试和维护提供了全面的技术参考。组件设计注重用户体验、数据完整性和系统扩展性，支持复杂的产品信息管理需求。
