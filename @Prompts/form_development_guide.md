# Element Plus 暗色主题表单开发指南

## 一、需求分析模板

在开始开发表单前，请确保回答以下问题：

1. 表单用途
   - 表单的主要功能是什么？
   - 数据最终如何使用？
   - 是否需要特殊的验证规则？

2. 数据结构
   - 必填字段有哪些？
   - 可选字段有哪些？
   - 是否包含动态数据（如表格）？

3. 交互需求
   - 是否需要即时验证？
   - 是否有联动字段？
   - 提交后的行为是什么？

## 二、基础结构模板

```vue
<template>
  <div class="page-container">
    <div class="page-content">
      <!-- 1. 头部导航 -->
      <div class="fixed-header">
        <div class="back-button" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>Back</span>
        </div>
        <div class="title">表单标题</div>
      </div>

      <!-- 2. 表单容器 -->
      <div class="content-wrapper">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-position="top"
          class="form-container"
        >
          <!-- 3. 表单分区 -->
          <form-section title="分区标题">
            <template #default>
              <!-- 表单项在这里 -->
            </template>
          </form-section>

          <!-- 4. 操作按钮 -->
          <div class="form-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
```

## 三、组件使用规范

### 1. 基础输入组件

```vue
<!-- 文本输入 -->
<el-form-item label="文本" prop="textField" required>
  <el-input 
    v-model="formData.textField"
    placeholder="请输入"
    class="dark-input"
  />
</el-form-item>

<!-- 日期选择 -->
<el-form-item label="日期" prop="dateField" required>
  <el-date-picker
    v-model="formData.dateField"
    type="date"
    placeholder="年/月/日"
    format="YYYY/MM/DD"
    class="dark-date-picker"
  />
</el-form-item>

<!-- 下拉选择 -->
<el-form-item label="选择" prop="selectField">
  <el-select 
    v-model="formData.selectField" 
    placeholder="请选择"
    class="dark-select"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</el-form-item>

<!-- 数字输入 -->
<el-form-item label="数值" prop="numberField">
  <el-input-number
    v-model="formData.numberField"
    :min="0"
    :precision="2"
    controls-position="right"
    placeholder="0"
    class="dark-number-input"
  />
</el-form-item>
```

### 2. 表单分区组件

```vue
<form-section title="基本信息">
  <div class="form-row">
    <el-form-item label="字段1" prop="field1" required>
      <el-input v-model="formData.field1" />
    </el-form-item>
    <el-form-item label="字段2" prop="field2" required>
      <el-input v-model="formData.field2" />
    </el-form-item>
    <el-form-item label="字段3" prop="field3" required>
      <el-input v-model="formData.field3" />
    </el-form-item>
  </div>
</form-section>
```

### 3. 动态表格组件

```vue
<dynamic-table
  :items="formData.items"
  title="动态表格"
  @add="addItem"
  @remove="removeItem"
>
  <template #default="{ item }">
    <div class="line-item-col">
      <label class="line-item-label">描述<span class="required">*</span></label>
      <el-input v-model="item.description" />
    </div>
    <!-- 其他列 -->
  </template>
</dynamic-table>
```

## 四、样式规范

### 1. 全局样式变量

```scss
// 主题色
$colors: (
  'background': #000000,
  'card': #1A1D1F,
  'input': #1E2127,
  'primary': #6b4fff,
  'error': #ff4d4f,
  'border': rgba(255, 255, 255, 0.1)
);

// 间距
$spacing: (
  'xs': 8px,
  'sm': 12px,
  'md': 16px,
  'lg': 20px,
  'xl': 24px
);

// 字体
$font: (
  'xs': 12px,
  'sm': 14px,
  'md': 16px
);
```

### 2. 基础样式模板

```scss
.page-container {
  min-height: 100vh;
  background: var(--background);
  
  .page-content {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
  }
}

.form-section {
  background: var(--card);
  border-radius: 4px;
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}
```

## 五、TypeScript 接口规范

```typescript
// 基础表单数据接口
interface FormData {
  [key: string]: any;
  required_fields: {
    field1: string;
    field2: number;
  };
  optional_fields?: {
    field3?: string;
    field4?: number;
  };
  items: Array<ItemData>;
}

// 表格项数据接口
interface ItemData {
  id: number;
  description: string;
  value: number;
}

// 选项接口
interface SelectOption {
  value: string | number;
  label: string;
}
```

## 六、表单验证规范

```typescript
const formRules = {
  // 必填文本
  required_text: [
    { required: true, message: '此项为必填项', trigger: 'blur' }
  ],
  
  // 数字验证
  number: [
    { required: true, message: '此项为必填项', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' }
  ],
  
  // 选择验证
  select: [
    { required: true, message: '请选择选项', trigger: 'change' }
  ],
  
  // 自定义验证
  custom: [
    { required: true, message: '此项为必填项', trigger: 'blur' },
    { validator: customValidator, trigger: 'blur' }
  ]
}
```

## 七、开发流程指南

1. 需求分析
   - 根据第一部分的模板进行需求分析
   - 确定所有字段和验证规则

2. 结构搭建
   - 使用基础结构模板创建页面
   - 规划表单分区

3. 组件开发
   - 按需使用基础组件
   - 开发特殊组件

4. 样式开发
   - 使用预定义的样式变量
   - 遵循样式规范

5. 功能实现
   - 实现数据管理
   - 添加验证规则
   - 实现提交逻辑

6. 测试验证
   - 表单验证测试
   - 交互功能测试
   - 样式兼容性测试

## 八、注意事项

1. 组件使用
   - 统一使用预定义的暗色主题组件
   - 保持组件的可复用性
   - 合理使用插槽进行自定义

2. 样式编写
   - 使用变量管理主题
   - 遵循 BEM 命名规范
   - 避免样式冲突

3. 表单验证
   - 合理设置验证时机
   - 提供清晰的错误提示
   - 考虑字段间的联动验证

4. 性能优化
   - 组件按需引入
   - 合理使用计算属性
   - 避免不必要的重渲染

## 九、常见问题解决方案

1. 表单验证不生效
   ```typescript
   // 确保正确设置 prop 和 rules
   const formRef = ref<FormInstance>();
   const validate = async () => {
     if (!formRef.value) return;
     try {
       await formRef.value.validate();
       // 验证通过
     } catch (error) {
       // 验证失败
     }
   };
   ```

2. 样式覆盖问题
   ```scss
   // 使用 :deep() 选择器
   :deep(.el-input__wrapper) {
     background-color: var(--input) !important;
   }
   ```

3. 动态表单项处理
   ```typescript
   // 使用 Vue 的响应式数组方法
   const addItem = () => {
     formData.value.items.push({
       id: Date.now(),
       description: '',
       value: 0
     });
   };
   ```

## 十、开发检查清单

- [ ] 需求分析是否完整
- [ ] 数据结构是否合理
- [ ] 组件使用是否规范
- [ ] 样式是否符合规范
- [ ] 验证规则是否完整
- [ ] 交互是否流畅
- [ ] 代码是否规范
- [ ] 性能是否优化 