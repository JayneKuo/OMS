# Dark Theme Admin UI System

这是一个基于 Vue 3 + TypeScript + Element Plus 的暗色主题管理系统UI架构指南，总结了实际开发过程中的优化经验。

## 项目结构规范

```bash
src/
├── views/                    # 页面视图
│   ├── customs/             # 海关模块
│   │   ├── components/      # 模块私有组件
│   │   │   ├── SearchForm/  # 搜索表单组件
│   │   │   └── StatusTag/   # 状态标签组件
│   │   ├── composables/     # 模块私有组合式函数
│   │   │   ├── useSearch.ts # 搜索相关逻辑
│   │   │   └── useTable.ts  # 表格相关逻辑
│   │   ├── types/          # 模块类型定义
│   │   │   └── index.ts    # 类型声明文件
│   │   ├── constants/      # 模块常量
│   │   │   └── index.ts    # 常量定义文件
│   │   ├── services/       # 模块服务
│   │   │   └── api.ts      # API 接口
│   │   ├── styles/         # 模块样式
│   │   │   └── index.scss  # 样式文件
│   │   ├── ISF.vue         # ISF 页面
│   │   ├── Form3461.vue    # Form 3461 页面
│   │   └── index.vue       # 模块入口页面
│   └── work-order/         # 工单模块
│       ├── components/     # 同上述结构
│       ├── composables/
│       ├── types/
│       └── ...
└── components/             # 全局共享组件
```

### 模块结构说明

1. **组件目录 (components/)**
   - 存放模块私有组件
   - 每个组件一个文件夹
   - 包含组件本身和相关测试文件

2. **组合式函数 (composables/)**
   - 存放模块相关的可复用逻辑
   - 按功能职责拆分文件
   - 使用 TypeScript 类型定义

3. **类型定义 (types/)**
   - 存放模块相关的类型定义
   - 接口、类型、枚举等声明
   - 按功能模块拆分文件

4. **常量定义 (constants/)**
   - 存放模块相关的常量
   - 配置项、枚举值等
   - 便于统一管理和维护

5. **服务层 (services/)**
   - 存放模块相关的 API 接口
   - 数据处理和转换逻辑
   - 与后端交互的封装

6. **样式文件 (styles/)**
   - 存放模块相关的样式
   - 可按功能拆分多个文件
   - 统一导入和管理

### 命名规范

1. **文件夹命名**
   - 模块文件夹：kebab-case (例：`work-order`)
   - 组件文件夹：PascalCase (例：`SearchForm`)

2. **文件命名**
   - Vue 文件：PascalCase (例：`Form3461.vue`)
   - TypeScript 文件：camelCase (例：`useSearch.ts`)
   - 样式文件：kebab-case (例：`search-form.scss`)

3. **组件命名**
   - 以功能命名，具有描述性
   - 避免使用缩写
   - 保持一致的命名风格

### 使用建议

1. **模块隔离**
   - 每个模块独立维护自己的组件和逻辑
   - 避免跨模块引用私有组件
   - 共享逻辑提升到全局

2. **组件复用**
   - 提取可复用的组件到 components/
   - 模块内部组件放在模块目录下
   - 合理划分组件粒度

3. **类型管理**
   - 统一在 types/ 下管理类型定义
   - 避免在组件中直接定义类型
   - 做好类型导出和复用

4. **样式管理**
   - 模块样式在模块目录下管理
   - 全局样式在全局目录下管理
   - 避免样式冲突和重复

## 标准页面布局规范

### 1. 页面头部（Header）
```vue
<div class="page-header">
  <div class="header-content">
    <h1>页面标题</h1>
    <p class="subtitle">页面描述文本</p>
  </div>
  <el-button type="primary" class="add-btn">
    <el-icon class="icon"><Plus /></el-icon>
    Add New
  </el-button>
</div>
```

### 2. 搜索区域（Search Section）
```vue
<div class="search-section">
  <div class="search-title">SEARCH BY</div>
  <div class="search-form">
    <!-- 主搜索行：4个输入项 + 操作按钮 -->
    <div class="search-row">
      <div class="custom-input">
        <input v-model="searchForm.field1" placeholder="Field 1" />
        <el-icon class="clear-icon" v-show="searchForm.field1">
          <CircleClose />
        </el-icon>
      </div>
      <!-- 重复相似结构 -->
      <div class="action-btns">
        <button class="custom-btn filter-btn">
          <el-icon><Filter /></el-icon>
        </button>
        <button class="custom-btn search-btn">
          <el-icon><Search /></el-icon>
        </button>
      </div>
    </div>
    
    <!-- 高级搜索行：2列布局 -->
    <div class="search-row" v-show="showAdvancedSearch">
      <div class="custom-input">
        <input v-model="searchForm.field5" placeholder="Field 5" />
      </div>
      <div class="custom-date-range">
        <el-date-picker v-model="searchForm.dateRange" type="daterange" />
      </div>
    </div>
  </div>
</div>
```

### 3. 表格区域（Table Section）
```vue
<div class="table-section">
  <el-table :data="tableData" class="data-table">
    <!-- 表格列配置 -->
    <el-table-column label="Actions" width="100" fixed="right">
      <template #default="{ row }">
        <span class="action-link">Edit</span>
      </template>
    </el-table-column>
  </el-table>
  
  <!-- 分页 -->
  <div class="pagination">
    <span class="total">Total {{ total }}</span>
    <div class="page-nav">
      <el-button class="nav-btn">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <div class="page-num active">1</div>
      <el-button class="nav-btn">
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>
    <el-dropdown class="page-size">
      <span>10/page</span>
    </el-dropdown>
  </div>
</div>
```

## 标准样式规范

### 1. 页面容器
```scss
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
  color: var(--text-primary);
}
```

### 2. 页面头部
```scss
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  .header-content {
    h1 {
      font-size: 32px;
      font-weight: 500;
      margin: 0;
      color: var(--text-primary);
    }

    .subtitle {
      margin: 8px 0 0;
      color: var(--text-secondary);
      font-size: 14px;
    }
  }

  .add-btn {
    background: var(--primary-color);
    border: none;
    height: 36px;
    padding: 0 20px;
    border-radius: 4px;
    font-weight: 500;
    
    .icon {
      margin-right: 8px;
    }
  }
}
```

### 3. 搜索区域
```scss
.search-section {
  background: var(--bg-dark);
  border-radius: 8px;
  padding: 24px;

  .search-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  .search-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr) auto;
    gap: 12px;
    margin-bottom: 12px;

    &:last-child {
      grid-template-columns: 1fr 2fr;
      margin-bottom: 0;
    }
  }

  .custom-input {
    position: relative;
    
    input {
      width: 100%;
      height: 40px;
      padding: 0 32px 0 12px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(30, 35, 45, 0.6);
      color: #fff;
      font-size: 14px;
      transition: all 0.2s;

      &::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }

      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
        background: rgba(35, 40, 50, 0.7);
      }

      &:focus {
        border-color: rgba(255, 255, 255, 0.2);
        background: rgba(35, 40, 50, 0.7);
        outline: none;
      }
    }

    .clear-icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.35);
      cursor: pointer;
      font-size: 16px;
      opacity: 0;
      transition: all 0.2s;

      &:hover {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    &:hover .clear-icon {
      opacity: 1;
    }
  }

  .custom-select {
    position: relative;

    .select-trigger {
      height: 40px;
      padding: 0 32px 0 12px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(30, 35, 45, 0.6);
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.2s;

      .placeholder {
        color: rgba(255, 255, 255, 0.35);
      }

      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
        background: rgba(35, 40, 50, 0.7);
      }

      &.is-focus {
        border-color: rgba(255, 255, 255, 0.2);
        background: rgba(35, 40, 50, 0.7);
      }

      .select-icons {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: 4px;

        .clear-icon {
          color: rgba(255, 255, 255, 0.35);
          opacity: 0;
          transition: all 0.2s;

          &:hover {
            color: rgba(255, 255, 255, 0.5);
          }
        }

        .el-icon {
          color: rgba(255, 255, 255, 0.35);
          transition: transform 0.2s;

          &.is-reverse {
            transform: rotate(180deg);
          }
        }
      }

      &:hover .clear-icon {
        opacity: 1;
      }
    }

    .select-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      width: 100%;
      background: rgba(30, 35, 45, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10;
      max-height: 216px;
      overflow-y: auto;

      .select-option {
        padding: 0 12px;
        height: 36px;
        line-height: 36px;
        color: rgba(255, 255, 255, 0.85);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        &.active {
          background: var(--primary-color);
          color: #fff;
        }
      }
    }
  }

  .custom-date-range {
    :deep(.el-input__wrapper) {
      background: rgba(30, 35, 45, 0.6) !important;
      box-shadow: none !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 4px !important;
      height: 40px !important;
      padding: 0 12px !important;
      
      &:hover {
        border-color: rgba(255, 255, 255, 0.15) !important;
        background: rgba(35, 40, 50, 0.7) !important;
      }
      
      &.is-focus {
        border-color: rgba(255, 255, 255, 0.2) !important;
        background: rgba(35, 40, 50, 0.7) !important;
      }
      
      .el-input__inner {
        color: #fff !important;
        font-size: 14px !important;
        height: 40px !important;
        line-height: 40px !important;
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.35) !important;
        }
      }

      .el-range-separator {
        color: rgba(255, 255, 255, 0.35) !important;
        line-height: 40px !important;
      }
    }
  }

  .custom-btn {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(30, 35, 45, 0.6);
    color: rgba(255, 255, 255, 0.35);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(35, 40, 50, 0.7);
      color: rgba(255, 255, 255, 0.5);
    }

    &.active {
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(35, 40, 50, 0.7);
      color: var(--primary-color);
    }

    &.search-btn {
      background: var(--primary-color);
      border: none;
      color: #fff;

      &:hover {
        background: var(--primary-hover);
      }
    }
  }
}
```

### 4. 表格区域
```scss
.table-section {
  background: var(--bg-darker);
  border-radius: 8px;
  overflow: hidden;

  :deep(.el-table) {
    background: transparent;
    
    th.el-table__cell {
      background: transparent;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-weight: 500;
      padding: 12px 16px;
    }

    td.el-table__cell {
      background: var(--bg-dark);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 12px 16px;
    }

    tr:hover > td.el-table__cell {
      background: var(--bg-darker);
    }
  }
}
```

### 5. 分页区域
```scss
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: var(--bg-dark);
  border-top: 1px solid var(--border-color);

  .page-nav {
    display: flex;
    align-items: center;
    gap: 8px;

    .nav-btn {
      width: 32px;
      height: 32px;
      padding: 0;
      background: var(--bg-darker);
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }

    .page-num {
      min-width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: var(--bg-darker);
      border: 1px solid var(--border-color);
      border-radius: 4px;

      &.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: #fff;
      }
    }
  }
}
```

### 6. 自定义输入框
```scss
.custom-input {
  position: relative;
  width: 100%;
  
  input {
    width: 100%;
    height: 36px;
    background: var(--bg-dark);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0 32px 0 12px;
    color: var(--text-primary);
    
    &::placeholder {
      color: var(--text-placeholder);
    }
    
    &:hover {
      border-color: var(--primary-color);
    }
  }
  
  .clear-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 1;
    }
  }
}
```

### 7. 操作按钮
```scss
.action-btns {
  display: flex;
  gap: 8px;

  .custom-btn {
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.filter-btn {
      background: var(--bg-dark);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);

      &:hover {
        border-color: var(--primary-color);
      }

      &.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: #fff;
      }
    }

    &.search-btn {
      background: var(--primary-color);
      border: none;
      color: #fff;
    }
  }
}
```

## 颜色变量
```scss
:root {
  --primary-color: #7c4dff;
  --primary-hover: #8f6aff;
  --bg-dark: #1a1d21;
  --bg-darker: #282c34;
  --border-color: #363b44;
  --text-primary: rgba(255, 255, 255, 0.85);
  --text-secondary: rgba(255, 255, 255, 0.45);
  --text-placeholder: rgba(255, 255, 255, 0.3);
}
```

## 组件状态

### 1. 输入框状态
- 默认：边框色 `var(--border-color)`
- 悬停：边框色 `var(--primary-color)`
- 聚焦：边框色 `var(--primary-color)` + 阴影

### 2. 按钮状态
- 默认：背景色 `var(--primary-color)`
- 悬停：背景色 `var(--primary-hover)`
- 禁用：透明度 0.5

### 3. 表格行状态
- 默认：背景色 `var(--bg-dark)`
- 悬停：背景色 `var(--bg-darker)`

## 响应式设计

### 1. 搜索区域
```scss
.search-row {
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr) auto;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
  }
}
```

### 2. 表格区域
```scss
.table-section {
  @media (max-width: 768px) {
    overflow-x: auto;
  }
}
```

## 最佳实践

1. 布局规范
   - 统一页面间距（32px）
   - 统一组件间距（24px）
   - 统一圆角大小（8px）
   - 统一按钮高度（36px）

2. 交互规范
   - 所有可点击元素添加悬停效果
   - 输入框清除图标在有内容且悬停时显示
   - 表格行悬停效果统一
   - 分页按钮禁用状态明确

3. 样式复用
   - 使用 CSS 变量管理主题
   - 复用基础组件样式
   - 保持命名一致性
   - 避免样式冲突

4. 性能优化
   - 合理使用深度选择器
   - 避免不必要的嵌套
   - 优化选择器性能
   - 控制样式作用域

## 设计理念

1. 视觉层次
   - 使用不同深度的背景色区分层级（表头透明，内容深色）
   - 利用透明度创造优雅的视觉效果（状态标签、hover效果）
   - 保持整体风格的一致性（统一的颜色变量系统）
   - 重视细节（如图标大小、间距、圆角）

2. 交互体验
   - 平滑的过渡动画（下拉框、图标旋转）
   - 清晰的状态反馈（hover、focus状态）
   - 直观的操作方式（一键清除、快捷操作）
   - 避免冗余的视觉元素（如多余的图标）

3. 可维护性
   - 统一的CSS变量管理（便于主题切换）
   - 模块化的组件结构（独立的输入框、下拉框组件）
   - 类型安全的TypeScript支持（完善的接口定义）
   - 组件逻辑解耦（展示与行为分离）

## 交互优化经验

1. 按钮交互
   - 统一大小规范（36x36）
   - 图标按钮不需要文字
   - 主次按钮样式区分明确

2. 输入框交互
   - 统一高度（36px）
   - 清除图标hover时显示
   - 输入框focus时添加主题色边框和阴影

3. 下拉框交互
   - 添加点击外部关闭
   - 选择后自动触发搜索
   - 支持一键清除选项
   - 下拉面板最大高度限制

4. 表格交互
   - 表头表体颜色对比
   - 链接和按钮添加透明度变化
   - 状态标签使用浅色背景

## 开发过程中的优化点

1. 样式优化
   - 移除所有滚动条
   - 统一组件间距
   - 优化视觉层次
   - 减少重复代码

2. 交互优化
   - 添加必要的动画效果
   - 优化事件处理
   - 提升用户体验

3. 代码优化
   - 完善类型定义
   - 提取公共样式
   - 组件逻辑解耦

## 注意事项

1. 样式处理
   - 使用 `!important` 需谨慎
   - 注意样式优先级
   - 避免样式冲突

2. 事件处理
   - 合理使用事件修饰符
   - 注意事件冒泡
   - 防止事件重复触发

3. 性能优化
   - 避免不必要的监听
   - 合理使用计算属性
   - 控制组件粒度

4. 组件通信
   - 明确数据流向
   - 合理使用事件总线
   - 避免过度耦合

## 使用示例

```vue
<template>
  <div class="page">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-form">
        <CustomInput v-model="searchForm.keyword" />
        <CustomSelect v-model="searchForm.type" :options="typeOptions" />
        <CustomDatePicker v-model="searchForm.date" />
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table :data="tableData">
        <!-- 表格列配置 -->
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination">
      <!-- 分页组件 -->
    </div>
  </div>
</template>
```

## 注意事项

1. 性能优化
   - 合理使用计算属性
   - 避免不必要的监听
   - 优化渲染性能

2. 主题定制
   - 保持颜色系统一致
   - 合理使用透明度
   - 注意对比度

3. 代码质量
   - 遵循 Vue 3 最佳实践
   - 使用 TypeScript 类型检查
   - 保持代码整洁

4. 浏览器兼容
   - 处理 CSS 前缀
   - 兼容性检查
   - 降级方案 

## 实现检查清单

### 1. 颜色规范检查
- [ ] 页面背景是否使用 `var(--bg-dark)`
- [ ] 搜索区域背景是否使用 `var(--bg-dark)`
- [ ] 表单组件背景是否使用 `var(--bg-darker)`
- [ ] 下拉菜单背景是否使用 `var(--bg-dark)`
- [ ] 文字颜色是否正确使用 `var(--text-primary)` 和 `var(--text-secondary)`
- [ ] 主题色是否统一使用 `var(--primary-color)`

### 2. 组件规范检查
- [ ] 输入框高度是否为 36px
- [ ] 按钮高度是否为 36px
- [ ] 圆角是否统一为 4px
- [ ] 内边距是否符合规范（输入框：0 32px 0 12px）
- [ ] 字体大小是否正确（正文14px，图标16px）
- [ ] 清除图标是否正确实现（hover显示，位置正确）

### 3. 交互规范检查
- [ ] hover 效果是否统一
- [ ] focus 状态是否正确
- [ ] 动画过渡是否平滑（0.3s）
- [ ] 点击区域是否足够大
- [ ] 反馈是否及时

## 标准组件实现示例

### 1. 标准输入框
```vue
<template>
  <div class="custom-input">
    <input 
      v-model="value"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <el-icon 
      class="clear-icon" 
      v-show="value"
      @click="clearInput"
    >
      <CircleClose />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.custom-input {
  position: relative;
  width: 100%;
  
  input {
    width: 100%;
    height: 36px;
    background: var(--bg-darker);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0 32px 0 12px;
    color: var(--text-primary);
    font-size: 14px;
    
    &::placeholder {
      color: var(--text-secondary);
    }
    
    &:hover {
      border-color: var(--primary-color);
    }

    &:focus {
      border-color: var(--primary-color);
      outline: none;
    }
  }
  
  .clear-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 16px;
    
    &:hover {
      opacity: 1;
    }
  }
}
</style>
```

### 2. 标准下拉选择框
```vue
<template>
  <div class="custom-select" v-click-outside="handleClickOutside">
    <div class="select-trigger" @click.stop="toggleDropdown">
      <span class="placeholder" v-if="!value">{{ placeholder }}</span>
      <span v-else>{{ value }}</span>
      <div class="select-icons">
        <el-icon 
          class="clear-icon" 
          v-show="value"
          @click.stop="clearSelect"
        >
          <CircleClose />
        </el-icon>
        <el-icon :class="{ 'is-reverse': isOpen }">
          <ArrowDown />
        </el-icon>
      </div>
    </div>
    <div class="select-dropdown" v-show="isOpen">
      <div 
        v-for="option in options"
        :key="option.value"
        class="select-option"
        :class="{ active: value === option.value }"
        @click.stop="handleSelect(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  width: 100%;
  
  .select-trigger {
    height: 36px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-darker);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    
    .placeholder {
      color: var(--text-secondary);
    }
    
    span {
      color: var(--text-primary);
    }
    
    &:hover {
      border-color: var(--primary-color);
    }
    
    .select-icons {
      display: flex;
      align-items: center;
      gap: 4px;
      
      .clear-icon {
        opacity: 0;
        transition: opacity 0.3s;
        color: var(--text-secondary);
        font-size: 16px;
        
        &:hover {
          opacity: 1;
        }
      }
      
      .el-icon {
        color: var(--text-secondary);
        font-size: 16px;
        transition: transform 0.3s;
        
        &.is-reverse {
          transform: rotate(180deg);
        }
      }
    }
  }
  
  .select-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: var(--bg-dark);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    max-height: 216px;
    overflow-y: auto;
    z-index: 10;
    
    .select-option {
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.3s;
      color: var(--text-primary);
      font-size: 14px;
      
      &:hover {
        background: var(--bg-darker);
      }
      
      &.active {
        background: var(--primary-color);
        color: #fff;
      }
    }
  }
}
</style>
```

### 3. 标准按钮
```vue
<template>
  <button 
    class="custom-btn"
    :class="[type, { active }]"
    @click="handleClick"
  >
    <el-icon v-if="icon">
      <component :is="icon" />
    </el-icon>
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<style lang="scss" scoped>
.custom-btn {
  height: 36px;
  padding: 0 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &.primary {
    background: var(--primary-color);
    border: none;
    color: #fff;

    &:hover {
      background: var(--primary-hover);
    }
  }

  &.secondary {
    background: var(--bg-darker);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);

    &:hover {
      border-color: var(--primary-color);
    }

    &.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: #fff;
    }
  }

  .el-icon {
    font-size: 16px;
  }
}
</style>
```

## 常见错误示例

### 1. 颜色使用错误
❌ 错误：
```scss
.input {
  background: #282c34;  // 硬编码颜色
  color: rgba(255, 255, 255, 0.85);  // 硬编码颜色
}
```

✅ 正确：
```scss
.input {
  background: var(--bg-darker);
  color: var(--text-primary);
}
```

### 2. 组件层级错误
❌ 错误：
```scss
.search-section {
  background: var(--bg-darker);  // 搜索区域使用深色背景
  
  .input {
    background: var(--bg-dark);  // 输入框使用浅色背景
  }
}
```

✅ 正确：
```scss
.search-section {
  background: var(--bg-dark);  // 搜索区域使用浅色背景
  
  .input {
    background: var(--bg-darker);  // 输入框使用深色背景
  }
}
```

### 3. 交互状态错误
❌ 错误：
```scss
.select-option {
  &:hover {
    background: var(--border-color);  // hover使用边框色
  }
  
  &.active {
    background: var(--bg-darker);  // 选中状态使用背景色
  }
}
```

✅ 正确：
```scss
.select-option {
  &:hover {
    background: var(--bg-darker);  // hover使用深色背景
  }
  
  &.active {
    background: var(--primary-color);  // 选中状态使用主题色
    color: #fff;
  }
}
```

## 开发流程检查

### 1. 开始开发前
- [ ] 查看设计规范文档
- [ ] 确认所需组件的标准实现
- [ ] 检查颜色变量的使用规范

### 2. 开发过程中
- [ ] 使用标准组件模板
- [ ] 遵循命名规范
- [ ] 保持样式一致性

### 3. 开发完成后
- [ ] 对照检查清单逐项验证
- [ ] 确认所有交互效果
- [ ] 测试响应式布局

## 注意事项

1. 始终使用CSS变量，不要硬编码颜色值
2. 保持组件层级关系的一致性
3. 确保所有交互状态的视觉反馈
4. 统一组件尺寸和间距
5. 保持代码的可维护性和复用性

## 组件层级关系

1. 页面层级：
   - 背景：var(--bg-dark)
   - 内容区：var(--bg-darker)

2. 组件层级：
   - 容器背景：var(--bg-dark)
   - 表单组件：var(--bg-darker)
   - 下拉菜单：var(--bg-dark)

3. 交互层级：
   - 普通状态：var(--bg-darker)
   - Hover状态：var(--primary-color)
   - 选中状态：var(--primary-color)

## 开发建议

1. 使用组件模板
   - 复制标准组件实现
   - 按需调整具体功能
   - 保持基础样式不变

2. 遵循命名规范
   - 使用 BEM 命名方式
   - 保持类名语义化
   - 避免样式冲突

3. 保持一致性
   - 使用统一的组件结构
   - 保持交互效果一致
   - 遵循响应式设计原则 