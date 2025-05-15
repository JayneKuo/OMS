# 库存同步规则模块产品文档

## 一、模块概述

库存同步规则模块允许用户为不同的渠道店铺配置自定义的库存同步规则，控制向各渠道店铺同步的库存数量及来源仓库。该模块遵循以下核心原则：

- **默认行为**：所有渠道店铺默认将根据DI(数据集成)配置全量同步库存
- **覆盖机制**：自定义规则可覆盖默认行为，提供精细化的库存同步控制
- **DI配置优先**：新规则默认继承DI配置中的仓库设置
- **无规则状态**：当规则被禁用或删除时，系统将恢复为根据DI配置全量同步库存

## 二、页面结构

### 1. 列表页面

库存同步规则页面由以下主要部分组成：

1. **页面标题区域**：显示"库存同步规则"标题和说明文本
2. **操作按钮区域**：包含"添加规则"按钮及提示信息
3. **通知说明**：解释默认同步行为的提示信息
4. **规则列表**：以表格形式展示所有已配置的同步规则

### 2. 表单页面

表单弹窗由以下部分组成：

1. **基础信息**：渠道店铺选择
2. **库存来源**：显示DI配置的仓库信息
3. **同步方式**：百分比或固定数量
4. **同步规则**：按设置同步或按扣减后同步
5. **规则状态**：启用或禁用
6. **操作按钮**：取消和保存按钮

## 三、数据模型与字段说明

### 1. 仓库(Warehouse)
```typescript
type Warehouse = {
  id: string      // 仓库ID，唯一标识
  name: string    // 仓库名称，用于显示
  code: string    // 仓库代码，用于系统识别
}
```

### 2. 渠道店铺(ChannelStore)
```typescript
interface ChannelStore {
  id: string      // 店铺ID，唯一标识
  channelType: string    // 渠道类型，如'shopify', 'amazon'等
  storeName: string      // 店铺名称
  storeIcon?: string     // 店铺图标URL
  diConfig?: {           // DI配置信息
    inventorySource: 'all' | 'specific'  // 库存来源类型
    warehouseIds: string[]               // 特定仓库IDs列表
  }
}
```

### 3. 同步规则(SyncRule)
```typescript
interface SyncRule {
  id: string      // 规则ID，唯一标识，格式：rule-${timestamp}
  channelType: string    // 渠道类型
  channelStoreId: string  // 关联的渠道店铺ID
  storeName: string      // 店铺名称（冗余存储，便于显示）
  storeIcon?: string     // 店铺图标（冗余存储）
  inventorySource: 'all' | 'specific'  // 库存来源类型
  warehouseIds: string[]  // 特定仓库ID列表
  syncMode: 'proportion' | 'deduction'  // 同步模式：按比例/按扣减
  syncType: 'percentage' | 'fixed'     // 同步类型：百分比/固定值
  syncValue: number       // 同步数值
  status?: boolean        // 规则状态：true启用/false禁用
  createdTime?: string    // 创建时间
  updatedTime?: string    // 更新时间
}
```

## 四、列表页功能详解

### 1. 列表展示字段

| 列名 | 字段名 | 数据类型 | 说明 |
|------|--------|----------|------|
| 渠道 | channelType | string | 显示渠道类型名称，通过`getChannelTypeName`方法转换 |
| 店铺名称 | storeName | string | 直接显示店铺名称 |
| 库存来源 | inventorySource, warehouseIds | string, string[] | 显示库存来源类型和相关仓库信息 |
| 同步设置 | syncType, syncValue, syncMode | string, number, string | 显示同步配置信息 |
| 状态 | status | boolean | 通过开关控件显示和修改状态 |
| 操作 | - | - | 编辑和删除按钮 |

### 2. 列表排序逻辑
- 默认按创建时间(`createdTime`)降序排列，最新创建的规则显示在前面
- 排序字段：`createdTime`
- 排序方向：`descending`
- 当前版本不支持用户自定义排序

### 3. 空数据提示
当规则列表为空时，显示提示信息：
```
No custom sync rules. All channel stores will fully synchronize inventory.
```

## 五、新增规则流程

### 1. 数据准备
- **触发方式**：点击页面右上角"添加规则"按钮
- **初始化**：
  ```javascript
  currentRule.value = null;
  formVisible.value = true;
  ```

### 2. 表单字段

| 字段名 | 控件类型 | 数据来源 | 是否必填 | 校验规则 | 默认值 |
|--------|----------|----------|----------|----------|--------|
| channelStoreId | 下拉选择框 | props.channelStores | 是 | 不能为空 | 空 |
| inventorySource | 显示文本 | 选中店铺的DI配置 | 自动填充 | 无需校验 | 'all' |
| warehouseIds | 显示文本 | 选中店铺的DI配置 | 自动填充 | 无需校验 | [] |
| syncType | 单选按钮组 | 用户选择 | 是 | 必须为'percentage'或'fixed' | 'percentage' |
| syncValue | 数字输入框 | 用户输入 | 是 | 百分比：1-100<br>固定值：≥1 | 80 |
| syncMode | 单选按钮组 | 用户选择 | 是 | 必须为'proportion'或'deduction' | 'proportion' |
| status | 开关 | 用户选择 | 是 | 布尔值 | true |

### 3. 去重逻辑
- 每个渠道店铺只能创建一条同步规则
- 在下拉选择框中，已有规则的店铺会被禁用选择，并显示"(Rule Exists)"提示
- 实现方法：
  ```javascript
  const isStoreDisabled = computed(() => {
    return (storeId: string) => {
      // 检查是否已有该店铺的规则
      return props.existingRules.some(r => r.channelStoreId === storeId);
    };
  });
  ```

### 4. 校验逻辑
- **表单级别校验**：
  ```javascript
  const formRules = reactive<FormRules>({
    channelStoreId: [
      { required: true, message: 'Please select channel store', trigger: 'change' }
    ],
    syncValue: [
      { required: true, message: 'Please enter sync quantity', trigger: 'blur' },
      { type: 'number', min: 1, message: 'Sync quantity must be greater than 0', trigger: 'blur' }
    ]
  });
  ```
- **字段级别校验**：
  - `syncValue`根据`syncType`动态调整最大值：
    ```javascript
    :max="form.syncType === 'percentage' ? 100 : 99999"
    ```

### 5. 保存流程
1. 表单验证
   ```javascript
   formRef.value?.validate(async (valid) => {
     if (valid) {
       // 继续保存流程
     }
   });
   ```
2. 确保仓库配置与DI一致
   ```javascript
   if (selectedStoreDIConfig.value) {
     form.inventorySource = selectedStoreDIConfig.value.inventorySource;
     form.warehouseIds = [...selectedStoreDIConfig.value.warehouseIds];
   }
   ```
3. 创建新规则对象
   ```javascript
   const newRule: SyncRule = {
     id: `rule-${Date.now()}`,
     channelType: selectedStore.channelType,
     channelStoreId: form.channelStoreId,
     // ... 其他字段
   };
   ```
4. 添加到规则列表
   ```javascript
   rules.value.push(newRule);
   ```
5. 显示成功消息并关闭表单
   ```javascript
   ElMessage.success('Rule created successfully');
   formVisible.value = false;
   ```

### 6. 提示信息
- **成功提示**：`Rule created successfully`
- **验证失败**：表单内显示对应字段的错误消息
- **店铺选择约束**：已有规则的店铺显示"(Rule Exists)"提示

## 六、编辑规则流程

### 1. 数据准备
- **触发方式**：点击规则列表中对应规则行的编辑按钮
- **初始化**：
  ```javascript
  currentRule.value = { ...rule };
  formVisible.value = true;
  ```

### 2. 表单字段限制
- `channelStoreId`字段在编辑模式下禁用，不允许更改
- 其他字段与新增模式相同

### 3. 校验逻辑
- 与新增模式一致

### 4. 保存流程
1. 表单验证（同新增）
2. 更新现有规则
   ```javascript
   const index = rules.value.findIndex(r => r.id === rule.id);
   if (index > -1) {
     const updatedRule = { ...rule };
     updatedRule.updatedTime = new Date().toISOString();
     rules.value[index] = updatedRule;
   }
   ```
3. 显示成功消息并关闭表单
   ```javascript
   ElMessage.success('Rule updated successfully');
   formVisible.value = false;
   ```

### 5. 提示信息
- **成功提示**：`Rule updated successfully`
- **验证失败**：表单内显示对应字段的错误消息

## 七、删除规则流程

### 1. 交互流程
- **触发方式**：点击规则列表中对应规则行的删除按钮
- **确认对话框**：使用`ElMessageBox.confirm`显示确认提示
  ```javascript
  ElMessageBox.confirm(
    `Are you sure you want to delete the sync rule for ${rule.storeName}? After deletion, inventory will be fully synchronized based on DI warehouse settings.`,
    'Confirmation',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
  ```

### 2. 处理逻辑
- 用户确认后，从规则列表中移除规则
  ```javascript
  rules.value = rules.value.filter(r => r.id !== rule.id);
  ```

### 3. 提示信息
- **确认提示**：`Are you sure you want to delete the sync rule for ${rule.storeName}? After deletion, inventory will be fully synchronized based on DI warehouse settings.`
- **成功提示**：`Rule deleted successfully. Inventory will be fully synchronized based on DI warehouse settings.`

## 八、启用/禁用规则

### 1. 交互方式
- **控件类型**：`el-switch`开关组件
- **触发事件**：`@change`事件

### 2. 处理逻辑
```javascript
const updateStatus = (rule: SyncRule, status: boolean): void => {
  rule.status = status;
  if (!status) {
    ElMessage.success(`Rule disabled. Inventory will be fully synchronized based on DI warehouse settings.`);
  } else {
    ElMessage.success(`Rule enabled. Inventory will be synchronized according to rule settings.`);
  }
}
```

### 3. 提示信息
- **启用提示**：`Rule enabled. Inventory will be synchronized according to rule settings.`
- **禁用提示**：`Rule disabled. Inventory will be fully synchronized based on DI warehouse settings.`

## 九、DI配置关联逻辑

### 1. 数据流向
1. 用户选择渠道店铺 → 触发`handleStoreChange`方法
2. 调用`loadDIConfiguration`方法获取DI配置
3. 配置加载后自动设置`inventorySource`和`warehouseIds`字段

### 2. DI配置加载过程
```javascript
async function loadDIConfiguration(storeId: string) {
  diLoading.value = true;
  selectedStoreDIConfig.value = null;
  
  try {
    // 查找store及其DI配置
    const store = props.channelStores.find(s => s.id === storeId);
    if (store?.diConfig) {
      selectedStoreDIConfig.value = {
        inventorySource: store.diConfig.inventorySource,
        warehouseIds: [...store.diConfig.warehouseIds]
      };
      
      // 自动设置表单中的库存来源和仓库
      form.inventorySource = store.diConfig.inventorySource;
      form.warehouseIds = [...store.diConfig.warehouseIds];
      
      ElMessage.success('仓库配置已从DI加载');
    } else {
      // 默认配置
      selectedStoreDIConfig.value = {
        inventorySource: 'all',
        warehouseIds: []
      };
      form.inventorySource = 'all';
      form.warehouseIds = [];
      ElMessage.info('未找到DI配置，使用默认配置（所有仓库）');
    }
  } catch (error) {
    console.error('加载DI配置出错:', error);
    ElMessage.error('无法从DI加载仓库配置');
  } finally {
    diLoading.value = false;
  }
}
```

### 3. 提示信息
- **加载成功**：`仓库配置已从DI加载`
- **无配置时**：`未找到DI配置，使用默认配置（所有仓库）`
- **加载失败**：`无法从DI加载仓库配置`

## 十、同步计算逻辑

库存同步规则决定了向渠道店铺同步的库存数量，计算逻辑如下：

### 1. 比例同步模式(proportion)
- **百分比类型**：同步指定百分比的库存
  ```
  同步库存 = Math.floor(原始库存 × (syncValue / 100))
  ```
  例如：设置80%，原始库存100件，同步库存为80件

- **固定值类型**：同步固定数量的库存
  ```
  同步库存 = Math.min(syncValue, 原始库存)
  ```
  例如：设置100件，原始库存80件，同步库存为80件

### 2. 扣减同步模式(deduction)
- **百分比类型**：同步扣减指定百分比后的库存
  ```
  同步库存 = Math.floor(原始库存 × (1 - syncValue / 100))
  ```
  例如：设置10%，原始库存100件，同步库存为90件

- **固定值类型**：同步扣减指定数量后的库存
  ```
  同步库存 = Math.max(0, 原始库存 - syncValue)
  ```
  例如：设置50件，原始库存100件，同步库存为50件

### 3. 示例展示
表单中根据用户选择的同步模式动态显示计算示例：
```html
<div class="example-card" v-if="form.syncMode === 'proportion'">
  <div class="example-title">Example</div>
  <div class="example-content">
    Assuming actual inventory is 100 units:
    → By proportion: Sync {{ form.syncValue }}{{ form.syncType === 'percentage' ? '%' : ' units' }} of inventory
    <span class="example-result">
      ({{ form.syncType === 'percentage' 
        ? Math.floor(100 * form.syncValue / 100) 
        : Math.min(form.syncValue, 100) }} units)
    </span>
  </div>
</div>
```

## 十一、UI交互与用户体验

### 1. 通知信息
- **默认行为说明**：页面顶部`el-alert`组件
  ```
  By default, all channel stores will fully synchronize inventory based on DI configuration. Set custom rules here to override the default behavior.
  ```
- **添加按钮提示**：悬停提示`el-tooltip`
  ```
  Add a new inventory sync rule based on DI configuration
  ```

### 2. 颜色编码
- **蓝色**：用于全部仓库(`all-source`)和百分比值(`percentage`)
  ```css
  .all-source { color: #409eff; }
  .sync-value.percentage { 
    color: #409eff; 
    background-color: rgba(64, 158, 255, 0.1);
  }
  ```
- **橙色**：用于指定仓库(`specific-source`)和固定数值(`fixed`)
  ```css
  .specific-source { color: #e6a23c; }
  .sync-value.fixed {
    color: #e6a23c;
    background-color: rgba(230, 162, 60, 0.1);
  }
  ```

### 3. 表单辅助提示
- **同步方式说明**：
  - 百分比：`Set the inventory percentage to sync to the channel store. e.g., 80% means sync 80% of actual inventory`
  - 固定数量：`Set a fixed quantity to sync to the channel store. e.g., 50 means sync 50 units regardless of actual inventory`

- **同步规则说明**：
  - 按设置同步：`Sync As Set` - `Sync ${value}% of inventory` 或 `Sync ${value} units of inventory`
  - 按扣减后同步：`Sync After Deduction` - `Sync after deducting ${value}% from inventory` 或 `Sync after deducting ${value} units from inventory`

### 4. 加载状态
- **DI配置加载**：使用`el-skeleton`组件显示加载状态
  ```html
  <div v-if="diLoading" class="di-loading">
    <el-skeleton style="width: 100%" animated>
      <!-- 骨架屏内容 -->
    </el-skeleton>
  </div>
  ```
- **表格加载**：使用`v-loading`指令
  ```html
  <el-table :data="rules" v-loading="loading">
    <!-- 表格内容 -->
  </el-table>
  ```

## 十二、异常处理

### 1. 数据加载异常
- **DI配置加载失败**：
  ```javascript
  try {
    // 加载DI配置
  } catch (error) {
    console.error('加载DI配置出错:', error);
    ElMessage.error('无法从DI加载仓库配置');
    // 提供默认值
    return {
      inventorySource: 'all',
      warehouseIds: []
    };
  }
  ```

### 2. 表单验证失败
- 表单级别错误显示在对应字段下方
- 对不满足条件的输入进行限制：
  ```html
  <el-input-number 
    v-model="form.syncValue" 
    :min="1" 
    :max="form.syncType === 'percentage' ? 100 : 99999"
    :precision="0"
    :step="1"
  />
  ```

### 3. 保存失败
```javascript
try {
  // 保存规则
} catch (error) {
  console.error('Error saving rule:', error);
  ElMessage.error('Unable to save rule');
}
```

### 4. 无可用店铺
当所有店铺都已有规则时，新增按钮会提示用户先删除已有规则：
```javascript
if (availableStores.value.length === 0) {
  ElMessage.warning('All stores already have sync rules. Please delete existing rules first to create new ones.');
  return;
}
``` 