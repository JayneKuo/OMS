<template>
  <el-dialog
    v-model="visible"
    :title="rule ? 'Edit Inventory Sync Rule' : 'Add Inventory Sync Rule'"
    width="600px"
    destroy-on-close
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="formRules" 
      label-width="120px"
      label-position="left"
    >
      <!-- 渠道店铺选择 -->
      <el-form-item label="Channel" prop="channelStoreId">
        <el-select 
          v-model="form.channelStoreId" 
          placeholder="Select Channel Store"
          class="w-full"
          filterable
          @change="handleStoreChange"
        >
          <el-option-group
            v-for="group in groupedStores"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="store in group.options"
              :key="store.id"
              :label="store.storeName"
              :value="store.id"
              :disabled="isStoreDisabled(store.id)"
            >
              <div class="store-option">
                <span>{{ store.storeName }}</span>
                <span v-if="isStoreDisabled(store.id)" class="disabled-text">(Rule Exists)</span>
              </div>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      
      <!-- 库存来源 - 修改为只展示DI配置的仓库信息，不允许用户选择 -->
      <el-form-item label="Inventory Source" prop="inventorySource">
        <div v-if="!form.channelStoreId" class="di-notice warning-notice">
          <el-alert
            type="warning"
            :closable="false"
            show-icon
          >
            <template #default>
              <p>Please select a channel store to load warehouse configuration.</p>
            </template>
          </el-alert>
        </div>
        
        <div v-else-if="diLoading" class="di-loading">
          <el-skeleton style="width: 100%" animated>
            <template #template>
              <div style="padding: 14px;">
                <el-skeleton-item variant="text" style="width: 100%; margin-bottom: 8px;" />
                <el-skeleton-item variant="text" style="width: 90%; margin-bottom: 8px;" />
                <el-skeleton-item variant="text" style="width: 80%;" />
              </div>
            </template>
          </el-skeleton>
        </div>
        
        <div v-else class="inventory-source-direct">
          <div class="source-type-row">
            <div class="source-type" :class="form.inventorySource === 'all' ? 'all-source' : 'specific-source'">
              {{ form.inventorySource === 'all' ? 'All Warehouses' : 'Specific Warehouses' }}
            </div>
            <div class="di-source">
              <el-icon><Connection /></el-icon>
              <span>From DI Configuration</span>
            </div>
          </div>
          
          <div class="warehouses-row">
            <div v-if="form.inventorySource === 'all'" class="warehouse-list">
              {{ props.warehouses.map((w: Warehouse) => w.name).join(', ') }}
            </div>
            <div v-else-if="form.warehouseIds.length > 0" class="warehouse-list">
              {{ form.warehouseIds.map((id: string) => getWarehouseName(id)).join(', ') }}
            </div>
            <div v-else class="warehouse-list empty">
              No warehouses selected in DI configuration
            </div>
          </div>
        </div>
      </el-form-item>
      
      <!-- 同步方式 -->
      <el-form-item label="Sync Method" prop="syncType">
        <div class="radio-options">
          <div class="radio-option">
            <el-radio v-model="form.syncType" label="percentage">Percentage</el-radio>
            <div class="option-desc">Set the inventory percentage to sync to the channel store. e.g., 80% means sync 80% of actual inventory</div>
          </div>
          <div class="radio-option">
            <el-radio v-model="form.syncType" label="fixed">Fixed Quantity</el-radio>
            <div class="option-desc">Set a fixed quantity to sync to the channel store. e.g., 50 means sync 50 units regardless of actual inventory</div>
          </div>
        </div>
      </el-form-item>
      
      <!-- 同步数量 -->
      <el-form-item label="Sync Quantity" prop="syncValue">
        <div class="number-input-container">
          <div class="value-input">
            <el-input-number 
              v-model="form.syncValue" 
              :min="1" 
              :max="form.syncType === 'percentage' ? 100 : 99999"
              :precision="0"
              :step="1"
              controls-position="right"
              class="w-32"
            />
          </div>
          
          <div class="sync-value-display">
            <span class="sync-value" :class="form.syncType === 'percentage' ? 'percentage' : 'fixed'">{{ form.syncValue }}{{ form.syncType === 'percentage' ? '%' : ' units' }}</span>
            <span class="option-desc">{{ form.syncType === 'percentage' 
              ? 'Sync ' + form.syncValue + '% of inventory' 
              : 'Sync ' + form.syncValue + ' units' }}{{ form.syncMode === 'deduction' ? (form.syncType === 'percentage' ? ' after reducing inventory by this percentage' : ' after reducing inventory by this amount') : '' }}</span>
          </div>
        </div>
      </el-form-item>
      
      <!-- 同步规则 -->
      <el-form-item label="Sync Rule" prop="syncMode">
        <div class="radio-options">
          <div class="radio-option">
            <el-radio v-model="form.syncMode" label="proportion">Sync As Set</el-radio>
            <div class="option-desc">
              {{ form.syncType === 'percentage' 
                ? `Sync ${form.syncValue}% of inventory` 
                : `Sync ${form.syncValue} units of inventory` 
              }}
            </div>
            
            <!-- 按设置同步的示例说明 -->
            <div class="example-card" v-if="form.syncMode === 'proportion'">
              <div class="example-title">Example</div>
              <div class="example-content">
                <div class="example-item">
                  <div class="example-value">
                    Assuming actual inventory is 100 units:
                    <div>
                      → By proportion: Sync {{ form.syncValue }}{{ form.syncType === 'percentage' ? '%' : ' units' }} of inventory
                      <span class="example-result">
                        ({{ form.syncType === 'percentage' 
                          ? Math.floor(100 * form.syncValue / 100) 
                          : Math.min(form.syncValue, 100) }} units)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="radio-option">
            <el-radio v-model="form.syncMode" label="deduction">Sync After Deduction</el-radio>
            <div class="option-desc">
              {{ form.syncType === 'percentage' 
                ? `Sync after deducting ${form.syncValue}% from inventory` 
                : `Sync after deducting ${form.syncValue} units from inventory` 
              }}
            </div>
            
            <!-- 按扣减后同步的示例说明 -->
            <div class="example-card" v-if="form.syncMode === 'deduction'">
              <div class="example-title">Example</div>
              <div class="example-content">
                <div class="example-item">
                  <div class="example-value">
                    Assuming actual inventory is 100 units:
                    <div>
                      → Deduct {{ form.syncType === 'percentage' ? form.syncValue + '%' : form.syncValue + ' units' }} then sync
                      <span class="example-result">
                        ({{ form.syncType === 'percentage' 
                          ? Math.floor(100 * (1 - form.syncValue / 100)) 
                          : Math.max(0, 100 - form.syncValue) }} units)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      
      <!-- 规则状态 -->
      <el-form-item label="Rule Status" prop="status">
        <div class="switch-container">
          <el-switch
            v-model="form.status"
            active-text="Enabled"
            inactive-text="Disabled"
          />
          <div class="option-desc">
            {{ form.status 
              ? 'When enabled, the system will synchronize according to this rule' 
              : 'When disabled, the system will not apply this rule and will use default sync method' 
            }}
          </div>
        </div>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm" :disabled="!form.channelStoreId">
          {{ rule ? 'Save Changes' : 'Create Rule' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { House, List, InfoFilled, Connection } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'

// 类型定义
interface Warehouse {
  id: string
  name: string
  code: string
}

interface ChannelStore {
  id: string
  channelType: string
  storeName: string
  storeIcon?: string
  diConfig?: {
    inventorySource: 'all' | 'specific'
    warehouseIds: string[]
  }
}

interface SyncRule {
  id: string
  channelType: string
  channelStoreId: string
  storeName: string
  storeIcon?: string
  inventorySource: 'all' | 'specific'
  warehouseIds: string[]
  syncMode: 'proportion' | 'deduction'
  syncType: 'percentage' | 'fixed'
  syncValue: number
  status?: boolean
  createdTime?: string
  updatedTime?: string
}

// 反应式表单类型
interface FormState {
  id: string
  channelStoreId: string
  channelType: string
  storeName: string
  storeIcon: string
  inventorySource: 'all' | 'specific'
  warehouseIds: string[]
  syncType: 'percentage' | 'fixed'
  syncValue: number
  syncMode: 'proportion' | 'deduction'
  status: boolean
}

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  rule: {
    type: Object as () => SyncRule | null,
    default: null
  },
  channelStores: {
    type: Array as () => ChannelStore[],
    default: () => []
  },
  warehouses: {
    type: Array as () => Warehouse[],
    default: () => []
  },
  existingRules: {
    type: Array as () => SyncRule[],
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'save'])

// 响应式引用
const formRef = ref<FormInstance>()

// 反应式表单状态
const form = reactive<FormState>({
  id: '',
  channelStoreId: '',
  channelType: '',
  storeName: '',
  storeIcon: '',
  inventorySource: 'all',
  warehouseIds: [],
  syncType: 'percentage',
  syncValue: 80,
  syncMode: 'proportion',
  status: true
})

// 表单验证规则
const formRules = reactive<FormRules>({
  channelStoreId: [
    { required: true, message: 'Please select channel store', trigger: 'change' }
  ],
  syncValue: [
    { required: true, message: 'Please enter sync quantity', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Sync quantity must be greater than 0', trigger: 'blur' }
  ]
})

// 计算属性：按渠道类型分组的店铺列表
const groupedStores = computed(() => {
  const groups: Record<string, ChannelStore[]> = {}
  
  props.channelStores.forEach((store) => {
    if (!groups[store.channelType]) {
      groups[store.channelType] = []
    }
    groups[store.channelType].push(store)
  })
  
  return Object.entries(groups).map(([channelType, stores]) => {
    return {
      label: getChannelTypeName(channelType),
      options: stores
    }
  })
})

// 计算属性：判断店铺是否已有规则
const isStoreDisabled = computed(() => {
  return (storeId: string) => {
    // 如果当前是编辑模式且是当前正在编辑的规则，则不禁用
    if (props.rule && props.rule.channelStoreId === storeId) {
      return false;
    }
    
    // 检查是否已有该店铺的规则
    return props.existingRules.some(r => r.channelStoreId === storeId);
  };
});

// 监听 visible 和 rule 变化
watch(() => props.visible, (val) => {
  if (val && props.rule) {
    // 编辑模式：复制现有规则数据
    const rule = props.rule;
    form.id = rule.id;
    form.channelStoreId = rule.channelStoreId || '';
    form.channelType = rule.channelType;
    form.storeName = rule.storeName;
    form.storeIcon = rule.storeIcon || '';
    form.inventorySource = rule.inventorySource;
    form.warehouseIds = [...rule.warehouseIds];
    form.syncType = rule.syncType;
    form.syncValue = rule.syncValue;
    form.syncMode = rule.syncMode;
    form.status = rule.status !== undefined ? rule.status : true;
    
    // 如果有channelStoreId，自动加载DI配置
    if (rule.channelStoreId) {
      loadDIConfiguration(rule.channelStoreId);
    }
  } else if (val) {
    // 新建模式：重置表单
    resetForm();
  }
});

// 计算属性：对话框可见性
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val)
})

// 辅助方法：获取渠道类型名称
function getChannelTypeName(type: string): string {
  const channelMap: Record<string, string> = {
    'amazon': 'Amazon',
    'shopify': 'Shopify',
    'walmart': 'Walmart',
    'ebay': 'eBay'
  }
  return channelMap[type] || type
}

// 添加DI配置加载状态和选中Store的DI配置
const diLoading = ref(false);
const selectedStoreDIConfig = ref<{
  inventorySource: 'all' | 'specific',
  warehouseIds: string[]
} | null>(null);

// 更新店铺选择变更方法
async function handleStoreChange(storeId: string) {
  const storeObj = props.channelStores.find(s => s.id === storeId);
  if (storeObj) {
    form.channelType = storeObj.channelType;
    form.storeName = storeObj.storeName;
    form.storeIcon = storeObj.storeIcon || '';
    
    // 重置以前的DI配置
    selectedStoreDIConfig.value = null;
    
    // 加载新选中store的DI配置
    await loadDIConfiguration(storeId);
  }
}

// 从DI加载仓库配置
async function loadDIConfiguration(storeId: string) {
  diLoading.value = true;
  selectedStoreDIConfig.value = null;
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // 查找store及其DI配置
    const store = props.channelStores.find(s => s.id === storeId);
    if (store?.diConfig) {
      selectedStoreDIConfig.value = {
        inventorySource: store.diConfig.inventorySource,
        warehouseIds: [...store.diConfig.warehouseIds]
      };
      
      // 自动设置表单中的库存来源和仓库，不允许用户修改
      form.inventorySource = store.diConfig.inventorySource;
      form.warehouseIds = store.diConfig.inventorySource === 'specific' && store.diConfig.warehouseIds.length 
        ? [...store.diConfig.warehouseIds] 
        : [];
      
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

// 方法：重置表单
function resetForm() {
  form.id = '';
  form.channelStoreId = '';
  form.channelType = '';
  form.storeName = '';
  form.storeIcon = '';
  form.inventorySource = 'all';
  form.warehouseIds = [];
  form.syncType = 'percentage';
  form.syncValue = 80;
  form.syncMode = 'proportion';
  form.status = true;
  
  // 重置DI配置
  selectedStoreDIConfig.value = null;
}

// 方法：提交表单
function submitForm() {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const selectedStore = props.channelStores.find(s => s.id === form.channelStoreId);
      if (!selectedStore) {
        ElMessage.error('请选择有效的渠道店铺');
        return;
      }
      
      // 确保warehouseIds与DI配置一致
      if (selectedStoreDIConfig.value) {
        form.inventorySource = selectedStoreDIConfig.value.inventorySource;
        form.warehouseIds = selectedStoreDIConfig.value.inventorySource === 'specific' 
          ? [...selectedStoreDIConfig.value.warehouseIds] 
          : [];
      }
      
      // 构造完整的规则对象
      const newRule: SyncRule = {
        id: props.rule?.id || '',
        channelType: selectedStore.channelType,
        channelStoreId: form.channelStoreId,
        storeName: selectedStore.storeName,
        storeIcon: selectedStore.storeIcon,
        inventorySource: form.inventorySource,
        warehouseIds: form.warehouseIds,
        syncType: form.syncType,
        syncValue: form.syncValue,
        syncMode: form.syncMode,
        status: form.status
      };
      
      // 提交表单
      emit('save', newRule);
    }
  });
}

// 辅助方法：获取仓库名称
function getWarehouseName(warehouseId: string): string {
  const warehouse = props.warehouses.find(w => w.id === warehouseId)
  return warehouse ? warehouse.name : ''
}

// 根据仓库ID获取仓库编码的方法
function getWarehouseCode(warehouseId: string): string {
  const warehouse = props.warehouses.find(w => w.id === warehouseId)
  return warehouse ? warehouse.code : ''
}

// 添加计算属性判断是否有DI配置
const hasDIConfig = computed(() => {
  return selectedStoreDIConfig.value !== null;
})

// 添加计算属性获取所有仓库
const allWarehouses = computed(() => {
  return props.warehouses || [];
});

// 添加计算属性获取选定的特定仓库
const selectedSpecificWarehouses = computed(() => {
  return form.warehouseIds
    .map((id: string) => props.warehouses.find(w => w.id === id))
    .filter((w): w is Warehouse => w !== undefined);
});
</script>

<style scoped>
.w-full {
  width: 100%;
  min-width: 240px;
}

.w-32 {
  width: 8rem;
}

.store-option,
.warehouse-option {
  display: flex;
  align-items: center;
}

.warehouse-code {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

.store-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  object-fit: contain;
}

.value-input {
  display: flex;
  align-items: center;
}

.unit {
  margin-left: 8px;
  font-size: 14px;
  color: #606266;
}

.tip-text {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.example-card {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.example-title {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.example-content {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

.example-item {
  margin-bottom: 8px;
}

.example-item:last-child {
  margin-bottom: 0;
}

.example-label {
  font-weight: 500;
  margin-bottom: 2px;
}

.example-value {
  color: #606266;
  padding-left: 12px;
}

.example-result {
  color: #409eff;
  font-weight: 500;
}

.selected-warehouses {
  margin-top: 8px;
}

.selected-title {
  font-size: 12px;
  color: #606266;
  margin-bottom: 5px;
}

.warehouse-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.warehouse-tag {
  margin-bottom: 3px;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  flex-direction: column;
}

.option-desc {
  margin-top: 2px;
  margin-left: 24px;
  font-size: 12px;
  color: #909399;
}

.number-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.switch-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.disabled-text {
  margin-left: 5px;
  color: #f56c6c;
  font-size: 12px;
}

.inventory-source-options {
  display: none;
}

.source-option {
  display: none;
}

.option-active {
  display: none;
}

.option-header {
  display: none;
}

.option-content {
  display: none;
}

.warehouse-list-preview {
  display: none;
}

.warehouse-chips {
  display: none;
}

.warehouse-chip {
  display: none;
}

.more-warehouses {
  display: none;
}

.no-warehouses {
  display: none;
}

.warehouse-loading {
  display: none;
}

.empty-warehouses {
  display: none;
}

.warehouse-source-panel {
  border-radius: 8px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  margin-bottom: 16px;
  background-color: #fff;
}

.source-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.source-tag {
  font-size: 13px;
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  font-weight: 500;
}

.di-source-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
  background-color: rgba(144, 147, 153, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.di-source-indicator .el-icon {
  font-size: 14px;
  color: #409eff;
}

.warehouse-listing {
  padding: 16px;
  background-color: white;
}

.warehouse-names {
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  word-break: break-word;
}

.selection-hint {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
  font-style: italic;
}

.inventory-source-direct {
  margin-bottom: 16px;
}

.source-type-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.source-type {
  font-weight: 600;
  font-size: 15px;
}

.all-source {
  color: #409eff;
}

.specific-source {
  color: #e6a23c;
}

.di-source {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
}

.di-source .el-icon {
  font-size: 14px;
  color: #409eff;
}

.warehouses-row {
  margin-left: 2px;
}

.warehouse-list {
  font-size: 15px;
  color: #303133;
  line-height: 1.6;
  word-break: break-word;
  font-weight: 500;
  padding: 6px 0;
  margin-top: 4px;
  border-left: none;
  background-color: transparent;
  border-radius: 0;
  color: #ffffff;
}

.warehouse-list.empty {
  color: #909399;
  font-style: italic;
  font-weight: normal;
  border-left: none;
}

.sync-value-display {
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.sync-value {
  font-weight: 700;
  font-size: 20px;
  padding: 2px 10px;
  border-radius: 4px;
}

.sync-value.percentage {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.sync-value.fixed {
  color: #e6a23c;
  background-color: rgba(230, 162, 60, 0.1);
}

.option-desc {
  color: #606266;
  font-size: 14px;
}
</style> 