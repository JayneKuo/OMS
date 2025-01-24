# 暗色主题管理系统 UI 设计规范

## 颜色系统

### 主题色
```css
:root {
  /* 主色 */
  --primary-color: #7c4dff;
  --primary-color-hover: #9069ff;
  --primary-color-rgb: 124, 77, 255;

  /* 状态色 */
  --success-color: #52c41a;
  --success-color-rgb: 82, 196, 26;
  --warning-color: #faad14;
  --warning-color-rgb: 250, 173, 20;
  --danger-color: #ff4d4f;
  --danger-color-rgb: 255, 77, 79;

  /* 背景色 */
  --bg-darker: #1a1d23;  /* 页面背景 */
  --bg-dark: #1e2227;    /* 卡片、表格背景 */
  --border-color: #303540;

  /* 文字颜色 */
  --text-primary: #e6e8ea;    /* 主要文字 */
  --text-secondary: #8b949e;  /* 次要文字 */
  --text-secondary-rgb: 139, 148, 158;
}
```

### 背景色使用规范

1. 页面背景：`var(--bg-darker)`
2. 卡片、表格背景：`var(--bg-dark)`
3. 搜索区域组件背景：`var(--bg-darker)`
   - 输入框
   - 下拉选择框
   - 日期选择器
   - 按钮
4. 下拉菜单选项悬浮背景：`var(--bg-dark)`

### 文字颜色使用规范

1. 主要文字：`var(--text-primary)`
   - 标题
   - 表格内容
   - 输入框文字

2. 次要文字：`var(--text-secondary)`
   - 副标题
   - 占位符文字
   - 表格表头
   - 图标

## 组件规范

### 搜索区域

1. 布局
   ```scss
   .search-row {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
     gap: 12px;
     margin-bottom: 12px;
   }
   ```

2. 输入框
   ```scss
   .custom-input {
     input {
       height: 40px;
       padding: 0 32px 0 12px;
       border-radius: 8px;
       background: var(--bg-darker);
       border: 1px solid transparent;
       
       &:hover {
         border-color: var(--border-color);
       }
       
       &:focus {
         border-color: var(--primary-color);
       }
     }
   }
   ```

3. 下拉选择框
   ```scss
   .custom-select {
     .select-trigger {
       height: 40px;
       padding: 0 32px 0 12px;
       border-radius: 8px;
       background: var(--bg-darker);
       border: 1px solid transparent;
     }

     .select-dropdown {
       background: var(--bg-darker);
       
       .select-option {
         &:hover {
           background: var(--bg-dark);
         }
         
         &.active {
           background: var(--bg-dark);
         }
       }
     }
   }
   ```

4. 日期选择器
   ```scss
   .custom-date-range {
     :deep(.el-input__wrapper) {
       background: var(--bg-darker);
       border: 1px solid transparent;
     }
   }
   ```

5. 按钮
   ```scss
   .custom-btn {
     width: 40px;
     height: 40px;
     border-radius: 8px;
     background: var(--bg-darker);
     
     &:hover {
       background: var(--bg-dark);
     }
     
     &.active {
       background: var(--bg-dark);
     }
   }
   ```

### 表格区域

1. 表头
   ```scss
   th.el-table__cell {
     background: transparent;
     color: var(--text-secondary);
     border-bottom: 1px solid var(--border-color);
   }
   ```

2. 表格内容
   ```scss
   td.el-table__cell {
     background: var(--bg-dark);
     color: var(--text-primary);
     border-bottom: 1px solid var(--border-color);
   }
   ```

3. 行悬浮效果
   ```scss
   .el-table__row {
     &:hover {
       background: var(--bg-darker);
     }
   }
   ```

### 分页

1. 布局
   ```scss
   .pagination {
     display: flex;
     align-items: center;
     justify-content: flex-end;
     gap: 16px;
   }
   ```

2. 页码按钮
   ```scss
   .page-num {
     min-width: 32px;
     height: 32px;
     border-radius: 4px;
     
     &.active {
       background: var(--primary-color);
       color: #fff;
     }
   }
   ```

## 交互规范

1. 按钮悬浮效果
   - 背景色加深
   - 文字颜色变亮
   - 过渡动画：`transition: all 0.3s`

2. 输入框焦点效果
   - 边框颜色变为主题色
   - 无阴影
   - 过渡动画：`transition: all 0.3s`

3. 下拉菜单交互
   - 选项悬浮背景色变化
   - 选中项使用主题色
   - 过渡动画：`transition: all 0.3s`

4. 表格行悬浮效果
   - 背景色变化
   - 过渡动画：`transition: background-color 0.3s`

## 响应式布局

1. 搜索区域
   ```scss
   .search-row {
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
   }
   ```

2. 表格
   - 横向滚动
   - 固定操作列

## 最佳实践

1. 组件封装
   - 将常用组件封装为独立组件
   - 保持组件的单一职责
   - 提供合适的 props 和事件

2. 样式管理
   - 使用 CSS 变量管理主题
   - 避免硬编码颜色值
   - 保持样式的一致性

3. 交互优化
   - 添加适当的过渡动画
   - 保持交互反馈的及时性
   - 提供清晰的状态提示

4. 代码质量
   - 遵循 TypeScript 类型定义
   - 保持代码结构清晰
   - 添加必要的注释 