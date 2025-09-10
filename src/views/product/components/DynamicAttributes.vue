<template>
  <div class="dynamic-attributes">
    <!-- 平台属性 -->
    <div v-if="platformAttributes.length > 0" class="platform-attributes">
      <div class="section-header">
        <el-icon><Star /></el-icon>
        <span class="header-title">Platform Required Attributes</span>
        <div class="platform-tags">
          <el-tag 
            v-for="platform in currentPlatforms" 
            :key="platform" 
            type="primary" 
            size="small"
            class="platform-tag"
          >
            {{ platform }}
          </el-tag>
        </div>
      </div>
      
      <div class="attributes-grid">
        <div 
          v-for="attr in platformAttributes" 
          :key="attr.name"
          class="attribute-item"
          :class="{ required: attr.required }"
        >
          <div class="attribute-label">
            <div class="label-content">
              <span class="label-text">{{ attr.label }}</span>
              <span v-if="attr.required" class="required-mark">*</span>
              <el-tag 
                v-if="attr.platform" 
                :type="attr.platformRequired ? 'danger' : 'info'" 
                size="small" 
                class="platform-indicator"
              >
                {{ attr.platform }}{{ attr.platformRequired ? ' Required' : '' }}
              </el-tag>
            </div>
            <el-tooltip v-if="attr.description" :content="attr.description" placement="top">
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
          
          <!-- Text Input -->
          <el-input
            v-if="attr.type === 'text'"
            v-model="attributeValues[attr.name]"
            :placeholder="attr.placeholder || `Enter ${attr.label.toLowerCase()}`"
            size="large"
            :maxlength="attr.maxLength"
            :show-word-limit="attr.maxLength"
          />
          
          <!-- Number Input -->
          <el-input-number
            v-else-if="attr.type === 'number'"
            v-model="attributeValues[attr.name]"
            :placeholder="attr.placeholder"
            size="large"
            :min="attr.min"
            :max="attr.max"
            :precision="attr.precision || 0"
            :step="attr.step || 1"
            style="width: 100%"
          />
          
          <!-- Select -->
          <el-select
            v-else-if="attr.type === 'select'"
            v-model="attributeValues[attr.name]"
            :placeholder="attr.placeholder || `Select ${attr.label.toLowerCase()}`"
            size="large"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="option in attr.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <!-- Multi Select -->
          <el-select
            v-else-if="attr.type === 'multiSelect'"
            v-model="attributeValues[attr.name]"
            :placeholder="attr.placeholder || `Select ${attr.label.toLowerCase()}`"
            size="large"
            style="width: 100%"
            multiple
            filterable
          >
            <el-option
              v-for="option in attr.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <!-- Boolean Switch -->
          <el-switch
            v-else-if="attr.type === 'boolean'"
            v-model="attributeValues[attr.name]"
            size="large"
            :active-text="attr.activeText || 'Yes'"
            :inactive-text="attr.inactiveText || 'No'"
          />
          
          <!-- Date Picker -->
          <el-date-picker
            v-else-if="attr.type === 'date'"
            v-model="attributeValues[attr.name]"
            type="date"
            :placeholder="attr.placeholder || 'Select date'"
            size="large"
            style="width: 100%"
          />
          
          <!-- Color Picker -->
          <div v-else-if="attr.type === 'color'" class="color-input">
            <el-input
              v-model="attributeValues[attr.name]"
              :placeholder="attr.placeholder || 'Enter color'"
              size="large"
              style="flex: 1"
            />
            <el-color-picker
              v-model="attributeValues[attr.name]"
              size="large"
              style="margin-left: 8px"
            />
          </div>
        </div>
        
      </div>
    </div>

    <!-- 统一的属性网格 - 包含平台属性和自定义属性 -->
    <div class="unified-attributes-grid">
      <!-- 自定义属性卡片 -->
      <div 
        v-for="(attr, index) in customAttributes" 
        :key="`custom-${index}-${attr.type}`"
        class="attribute-item custom-attribute-item"
      >
            <div class="attribute-label">
              <div class="label-content">
                <el-input
                  v-model="attr.key"
                  placeholder="Attribute Name"
                  size="large"
                  class="attribute-name-input"
                  @blur="updateCustomAttributes"
                />
                <el-tag type="success" size="small" class="platform-indicator">
                  Custom
                </el-tag>
              </div>
              <div class="custom-controls">
                <el-select
                  v-model="attr.type"
                  placeholder="Type"
                  size="small"
                  style="width: 120px"
                  @change="handleCustomTypeChange(index)"
                >
                  <el-option label="Text" value="text" />
                  <el-option label="Number" value="number" />
                  <el-option label="Percentage" value="percentage" />
                  <el-option label="Composition" value="composition" />
                  <el-option label="Select" value="select" />
                  <el-option label="Multi-Select" value="multi-select" />
                  <el-option label="Boolean" value="boolean" />
                  <el-option label="Date" value="date" />
                  <el-option label="Color" value="color" />
                  <el-option label="Size" value="size" />
                </el-select>
                <el-button 
                  type="danger" 
                  text
                  size="small"
                  @click="removeCustomAttribute(index)"
                  class="delete-btn"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            
            <!-- Text -->
            <el-input
              v-if="attr.type === 'text'"
              :key="`text-${index}`"
              v-model="attr.value"
              placeholder="Enter value"
              size="large"
              @blur="updateCustomAttributes"
            />
            
            <!-- Number -->
            <el-input-number
              v-else-if="attr.type === 'number'"
              v-model="attr.value"
              placeholder="Enter number"
              size="large"
              style="width: 100%"
              @blur="updateCustomAttributes"
            />
            
            <!-- Select -->
            <div v-else-if="attr.type === 'select'" class="select-config">
              <el-input
                v-model="attr.options"
                placeholder="Options (comma separated)"
                size="small"
                @blur="updateSelectOptions(index)"
                class="options-input"
              />
              <el-select
                v-model="attr.value"
                placeholder="Select value"
                size="large"
                style="width: 100%"
                @change="updateCustomAttributes"
              >
                <el-option
                  v-for="option in getSelectOptions(attr.options)"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>
            </div>
            
            <!-- Boolean -->
            <el-switch
              v-else-if="attr.type === 'boolean'"
              v-model="attr.value"
              size="large"
              @change="updateCustomAttributes"
            />
            
            <!-- Date -->
            <el-date-picker
              v-else-if="attr.type === 'date'"
              v-model="attr.value"
              type="date"
              placeholder="Select date"
              size="large"
              style="width: 100%"
              @change="updateCustomAttributes"
            />
            
            <!-- Percentage -->
            <div v-else-if="attr.type === 'percentage'" class="percentage-input">
              <el-input-number
                v-model="attr.value"
                :min="0"
                :max="100"
                :precision="2"
                placeholder="Enter percentage"
                size="large"
                style="width: calc(100% - 40px)"
                @change="updateCustomAttributes"
              />
              <span class="percentage-symbol">%</span>
              <el-button 
                type="primary" 
                text 
                size="small"
                @click="addPercentageItem(index)"
                class="add-item-btn"
              >
                Add
              </el-button>
            </div>
            
            <!-- Composition -->
            <div v-else-if="attr.type === 'composition'" class="composition-input">
              <div 
                v-for="(item, itemIndex) in (attr.compositionItems || [])" 
                :key="itemIndex"
                class="composition-item"
              >
                <el-input
                  v-model="item.name"
                  placeholder="Material name"
                  size="small"
                  style="flex: 1"
                  @blur="updateCustomAttributes"
                />
                <el-input-number
                  v-model="item.percentage"
                  :min="0"
                  :max="100"
                  :precision="2"
                  placeholder="0"
                  size="small"
                  style="width: 80px"
                  @change="updateCustomAttributes"
                />
                <span class="percentage-symbol">%</span>
                <el-button 
                  type="danger" 
                  text
                  size="small"
                  @click="removeCompositionItem(index, itemIndex)"
                  class="remove-item-btn"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
              <el-button 
                type="primary" 
                text 
                size="small"
                @click="addCompositionItem(index)"
                class="add-item-btn"
              >
                <el-icon><Plus /></el-icon>
                Add Material
              </el-button>
              <div v-if="getCompositionTotal(index) > 0" class="composition-total">
                Total: {{ getCompositionTotal(index).toFixed(2) }}%
                <span 
                  v-if="getCompositionTotal(index) !== 100" 
                  class="composition-warning"
                >
                  (Should equal 100%)
                </span>
              </div>
            </div>
            
            <!-- Multi-Select -->
            <div v-else-if="attr.type === 'multi-select'" class="multi-select-config">
              <el-input
                v-model="attr.options"
                placeholder="Options (comma separated): Option1,Option2,Option3"
                size="large"
                class="options-input"
                @input="updateSelectOptions(index)"
              />
              <el-select
                v-model="attr.value"
                placeholder="Select multiple values"
                size="large"
                multiple
                style="width: 100%"
                @change="updateCustomAttributes"
              >
                <el-option
                  v-for="option in getSelectOptions(attr.options)"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>
            </div>
            
            <!-- Color -->
            <div v-else-if="attr.type === 'color'" class="color-input">
              <el-color-picker
                v-model="attr.value"
                size="large"
                @change="updateCustomAttributes"
              />
              <el-input
                v-model="attr.colorName"
                placeholder="Color name (optional)"
                size="large"
                style="flex: 1; margin-left: 12px"
                @blur="updateCustomAttributes"
              />
            </div>
            
            <!-- Size -->
            <div v-else-if="attr.type === 'size'" class="size-input">
              <el-select
                v-model="attr.sizeType"
                placeholder="Size Type"
                size="large"
                style="width: 120px"
                @change="updateCustomAttributes"
              >
                <el-option label="Clothing" value="clothing" />
                <el-option label="Shoes" value="shoes" />
                <el-option label="Custom" value="custom" />
              </el-select>
              <el-select
                v-if="attr.sizeType === 'clothing'"
                v-model="attr.value"
                placeholder="Select size"
                size="large"
                style="flex: 1; margin-left: 8px"
                @change="updateCustomAttributes"
              >
                <el-option label="XS" value="XS" />
                <el-option label="S" value="S" />
                <el-option label="M" value="M" />
                <el-option label="L" value="L" />
                <el-option label="XL" value="XL" />
                <el-option label="XXL" value="XXL" />
                <el-option label="XXXL" value="XXXL" />
              </el-select>
              <el-select
                v-else-if="attr.sizeType === 'shoes'"
                v-model="attr.value"
                placeholder="Select shoe size"
                size="large"
                style="flex: 1; margin-left: 8px"
                @change="updateCustomAttributes"
              >
                <el-option 
                  v-for="size in Array.from({length: 20}, (_, i) => 35 + i * 0.5)" 
                  :key="size" 
                  :label="`${size}`" 
                  :value="size" 
                />
              </el-select>
              <el-input
                v-else-if="attr.sizeType === 'custom'"
                v-model="attr.value"
                placeholder="Enter custom size"
                size="large"
                style="flex: 1; margin-left: 8px"
                @blur="updateCustomAttributes"
              />
            </div>
          </div>
        </div>
        
      <!-- 添加自定义属性按钮 - 统一卡片样式 -->
      <div class="add-custom-card-unified" @click="addCustomAttribute">
        <div class="add-button-content">
          <el-icon class="add-icon"><Plus /></el-icon>
          <span class="add-text">Add Custom Attribute</span>
          <span class="add-hint">Click anywhere to add</span>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { 
  Star, 
  QuestionFilled, 
  Plus, 
  Delete 
} from '@element-plus/icons-vue';
import type { CategoryInfo } from '@/types/product';

interface AttributeOption {
  label: string;
  value: string;
}

interface PlatformAttribute {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiSelect' | 'boolean' | 'date' | 'color';
  required: boolean;
  description?: string;
  placeholder?: string;
  options?: AttributeOption[];
  min?: number;
  max?: number;
  maxLength?: number;
  precision?: number;
  step?: number;
  activeText?: string;
  inactiveText?: string;
  platform?: string; // 属性来源平台
  platformRequired?: boolean; // 该平台是否必填
}

interface CustomAttribute {
  key: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'date';
  value: any;
  options?: string;
}

const props = defineProps<{
  categoryInfo: CategoryInfo;
  modelValue: {
    platformAttributes: Record<string, any>;
    customAttributes: CustomAttribute[];
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { platformAttributes: Record<string, any>; customAttributes: CustomAttribute[] }): void;
}>();

// 当前平台列表 - 获取所有映射的平台
const currentPlatforms = computed(() => {
  if (props.categoryInfo.categories && props.categoryInfo.categories.length > 0) {
    return props.categoryInfo.categories.map(cat => cat.platform).filter(Boolean);
  }
  return [];
});

// 主要平台 - 用于显示标签
const currentPlatform = computed(() => {
  return currentPlatforms.value.length > 0 ? currentPlatforms.value[0] : null;
});

// 属性值
const attributeValues = ref<Record<string, any>>({});
const customAttributes = ref<CustomAttribute[]>([]);

// 平台属性配置
const platformAttributesConfig: Record<string, PlatformAttribute[]> = {
  Amazon: [
    {
      name: 'brand',
      label: 'Brand',
      type: 'text',
      required: true,
      description: 'Product brand name as registered on Amazon'
    },
    {
      name: 'manufacturer',
      label: 'Manufacturer',
      type: 'text',
      required: true,
      description: 'Company that manufactures the product'
    },
    {
      name: 'model',
      label: 'Model Number',
      type: 'text',
      required: false,
      description: 'Manufacturer model number'
    },
    {
      name: 'color',
      label: 'Color',
      type: 'select',
      required: false,
      options: [
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Yellow', value: 'yellow' }
      ]
    },
    {
      name: 'size',
      label: 'Size',
      type: 'select',
      required: false,
      options: [
        { label: 'XS', value: 'xs' },
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' },
        { label: 'XXL', value: 'xxl' }
      ]
    },
    {
      name: 'material',
      label: 'Material',
      type: 'multiSelect',
      required: false,
      options: [
        { label: 'Cotton', value: 'cotton' },
        { label: 'Polyester', value: 'polyester' },
        { label: 'Leather', value: 'leather' },
        { label: 'Silk', value: 'silk' },
        { label: 'Wool', value: 'wool' }
      ]
    }
  ],
  Shopify: [
    {
      name: 'vendor',
      label: 'Vendor',
      type: 'text',
      required: true,
      description: 'Product vendor or supplier name'
    },
    {
      name: 'product_type',
      label: 'Product Type',
      type: 'text',
      required: false,
      description: 'Category or type of product'
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text',
      required: false,
      description: 'Comma-separated tags for product organization',
      placeholder: 'summer, casual, trending'
    },
    {
      name: 'weight',
      label: 'Weight (kg)',
      type: 'number',
      required: false,
      min: 0,
      step: 0.1,
      precision: 2
    },
    {
      name: 'requires_shipping',
      label: 'Requires Shipping',
      type: 'boolean',
      required: false,
      activeText: 'Yes',
      inactiveText: 'No'
    }
  ],
  Shein: [
    {
      name: 'style_code',
      label: 'Style Code',
      type: 'text',
      required: true,
      description: 'Unique style identifier required by Shein platform for product tracking'
    },
    {
      name: 'season',
      label: 'Season',
      type: 'select',
      required: true,
      description: 'Seasonal category required by Shein for better product discovery and merchandising',
      options: [
        { label: 'Spring', value: 'spring' },
        { label: 'Summer', value: 'summer' },
        { label: 'Autumn', value: 'autumn' },
        { label: 'Winter', value: 'winter' },
        { label: 'All Season', value: 'all' }
      ]
    },
    {
      name: 'age_group',
      label: 'Age Group',
      type: 'select',
      required: true,
      description: 'Target age group required by Shein for compliance and content filtering',
      options: [
        { label: 'Kids', value: 'kids' },
        { label: 'Teen', value: 'teen' },
        { label: 'Adult', value: 'adult' },
        { label: 'Senior', value: 'senior' }
      ]
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      description: 'Gender category required by Shein for proper product categorization',
      options: [
        { label: 'Men', value: 'men' },
        { label: 'Women', value: 'women' },
        { label: 'Unisex', value: 'unisex' }
      ]
    },
    {
      name: 'fabric_composition',
      label: 'Fabric Composition',
      type: 'text',
      required: false,
      placeholder: '95% Cotton, 5% Elastane'
    },
    {
      name: 'care_instructions',
      label: 'Care Instructions',
      type: 'multiSelect',
      required: false,
      options: [
        { label: 'Machine Wash Cold', value: 'machine_wash_cold' },
        { label: 'Hand Wash Only', value: 'hand_wash' },
        { label: 'Dry Clean Only', value: 'dry_clean' },
        { label: 'Do Not Bleach', value: 'no_bleach' },
        { label: 'Tumble Dry Low', value: 'tumble_dry_low' },
        { label: 'Air Dry', value: 'air_dry' },
        { label: 'Iron Low Heat', value: 'iron_low' }
      ]
    }
  ]
};

// 当前平台属性 - 合并所有映射平台的属性
const platformAttributes = computed(() => {
  if (currentPlatforms.value.length === 0) {
    return [];
  }
  
  const allAttributes: PlatformAttribute[] = [];
  const seenAttributes = new Set<string>();
  
  // 遍历所有映射的平台，合并属性
  currentPlatforms.value.forEach(platform => {
    const platformAttrs = platformAttributesConfig[platform];
    console.log(`Loading attributes for platform: ${platform}`, platformAttrs?.length || 0, 'attributes');
    if (platformAttrs) {
      platformAttrs.forEach(attr => {
        // 避免重复属性，优先保留第一个平台的属性定义
        if (!seenAttributes.has(attr.name)) {
          seenAttributes.add(attr.name);
          // 标记属性来自哪个平台，并保留平台信息
          allAttributes.push({
            ...attr,
            description: `${attr.description}`,
            platform: platform, // 保留平台信息
            platformRequired: attr.required // 该平台是否必填
          });
        }
      });
    }
  });
  
  console.log('Total merged platform attributes:', allAttributes.length);
  
  return allAttributes;
});

// 添加自定义属性
const addCustomAttribute = () => {
  customAttributes.value.push({
    key: '',
    type: 'text',
    value: '',
    options: ''
  });
};

// 移除自定义属性
const removeCustomAttribute = (index: number) => {
  customAttributes.value.splice(index, 1);
  updateCustomAttributes();
};

// 处理自定义属性类型变化
const handleCustomTypeChange = (index: number) => {
  const attr = customAttributes.value[index];
  
  // 温和的重置值，避免强制更新导致崩溃
  switch (attr.type) {
    case 'boolean':
      attr.value = false;
      break;
    case 'number':
    case 'percentage':
      attr.value = 0;
      break;
    case 'composition':
      attr.compositionItems = [{ name: '', percentage: 0 }];
      attr.value = '';
      break;
    case 'multi-select':
      attr.value = [];
      attr.options = attr.options || '';
      break;
    case 'select':
      attr.value = '';
      attr.options = attr.options || '';
      break;
    case 'color':
      attr.value = '#409EFF';
      attr.colorName = attr.colorName || '';
      break;
    case 'size':
      attr.sizeType = attr.sizeType || 'clothing';
      attr.value = '';
      break;
    case 'date':
      attr.value = null;
      break;
    default:
      attr.value = '';
  }
  
  // 使用nextTick确保DOM更新完成后再触发
  nextTick(() => {
    updateCustomAttributes();
  });
};

// 更新选择选项
const updateSelectOptions = (index: number) => {
  const attr = customAttributes.value[index];
  // 如果当前值不在新选项中，清空值
  const options = getSelectOptions(attr.options);
  if (attr.value && !options.includes(attr.value)) {
    attr.value = '';
  }
  updateCustomAttributes();
};

// 获取选择选项
const getSelectOptions = (optionsString: string) => {
  if (!optionsString) return [];
  return optionsString.split(',').map(opt => opt.trim()).filter(Boolean);
};

// 添加成分配比项
const addCompositionItem = (index: number) => {
  const attr = customAttributes.value[index];
  if (!attr.compositionItems) {
    attr.compositionItems = [];
  }
  attr.compositionItems.push({ name: '', percentage: 0 });
  updateCustomAttributes();
};

// 移除成分配比项
const removeCompositionItem = (attrIndex: number, itemIndex: number) => {
  const attr = customAttributes.value[attrIndex];
  if (attr.compositionItems) {
    attr.compositionItems.splice(itemIndex, 1);
    updateCustomAttributes();
  }
};

// 获取成分配比总计
const getCompositionTotal = (index: number): number => {
  const attr = customAttributes.value[index];
  if (!attr.compositionItems) return 0;
  return attr.compositionItems.reduce((total, item) => total + (item.percentage || 0), 0);
};

// 添加百分比项（预留功能）
const addPercentageItem = (index: number) => {
  // 可以扩展为添加多个百分比项的功能
  console.log('Add percentage item for index:', index);
};

// 更新自定义属性
const updateCustomAttributes = () => {
  updateParent();
};

// 更新父组件
const updateParent = () => {
  emit('update:modelValue', {
    platformAttributes: attributeValues.value,
    customAttributes: customAttributes.value.filter(attr => attr.key.trim())
  });
};

// 初始化
const initialize = () => {
  if (props.modelValue) {
    attributeValues.value = { ...props.modelValue.platformAttributes };
    customAttributes.value = [...(props.modelValue.customAttributes || [])];
  }
};

// 监听平台变化，重置属性
watch(currentPlatform, (newPlatform, oldPlatform) => {
  if (newPlatform !== oldPlatform) {
    attributeValues.value = {};
    updateParent();
  }
});

// 监听属性值变化
watch(attributeValues, () => {
  updateParent();
}, { deep: true });

// 监听props变化
watch(() => props.modelValue, initialize, { immediate: true });

initialize();
</script>

<style scoped lang="scss">
.dynamic-attributes {
  width: 100%;
}

.platform-attributes {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 8px;
  border: 1px solid #4a5568;
  
  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #e2e8f0;
    flex: 1;
  }
  
  .el-icon {
    color: #63b3ed;
    font-size: 18px;
  }
  
  .platform-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    
    .platform-tag {
      background: #63b3ed;
      border-color: #63b3ed;
      color: white;
      font-weight: 500;
    }
  }
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.attribute-item {
  padding: 16px;
  background: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #63b3ed;
    box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
  }
  
  &.required {
    border-left: 3px solid #f56565;
  }
  
  .attribute-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #e2e8f0;
    
    .label-content {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      
      .label-text {
        color: #e2e8f0;
      }
      
      .required-mark {
        color: #f56565;
        font-weight: bold;
      }
      
      .platform-indicator {
        font-size: 11px;
        font-weight: 500;
        
        &.el-tag--danger {
          background-color: rgba(245, 101, 101, 0.2);
          border-color: #f56565;
          color: #f56565;
        }
        
        &.el-tag--info {
          background-color: rgba(99, 179, 237, 0.2);
          border-color: #63b3ed;
          color: #63b3ed;
        }
      }
    }
    
    .help-icon {
      color: #a0aec0;
      cursor: help;
      margin-left: 8px;
      flex-shrink: 0;
      
      &:hover {
        color: #63b3ed;
      }
    }
  }
  
  .color-input {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.custom-attributes {
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    background: #2d3748;
    border: 2px dashed #4a5568;
    border-radius: 12px;
    
    .empty-icon {
      font-size: 48px;
      color: #718096;
      margin-bottom: 16px;
    }
    
    .empty-text {
      font-size: 16px;
      font-weight: 500;
      color: #e2e8f0;
      margin: 0 0 8px 0;
    }
    
    .empty-desc {
      font-size: 14px;
      color: #a0aec0;
      margin: 0;
    }
  }
}

.custom-attributes-list {
  width: 100%;
}

.custom-attributes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.custom-attribute-item {
  padding: 16px;
  background: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #63b3ed;
    box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
  }
  
  .attribute-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    
    .attribute-name {
      flex: 1;
    }
    
    .attribute-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      
      .delete-btn {
        color: #f56565;
        padding: 4px;
        
        &:hover {
          background-color: rgba(245, 101, 101, 0.1);
        }
      }
    }
  }
  
  .attribute-value {
    width: 100%;
    
    .select-config {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .options-input {
        margin-bottom: 4px;
      }
    }
  }
}

// Dark theme for form controls
:deep(.el-input__wrapper) {
  background-color: #1a202c;
  border: 1px solid #4a5568;
  box-shadow: none;
  
  &:hover {
    border-color: #63b3ed;
  }
  
  &.is-focus {
    border-color: #63b3ed;
    box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
  }
  
  .el-input__inner {
    color: #e2e8f0;
    background-color: transparent;
    
    &::placeholder {
      color: #718096;
    }
  }
}

:deep(.el-select) {
  .el-input__wrapper {
    background-color: #1a202c;
    border: 1px solid #4a5568;
    
    &:hover {
      border-color: #63b3ed;
    }
    
    &.is-focus {
      border-color: #63b3ed;
      box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
    }
    
    .el-input__inner {
      color: #e2e8f0;
    }
  }
}

:deep(.el-input-number) {
  .el-input__wrapper {
    background-color: #1a202c;
    border: 1px solid #4a5568;
    
    &:hover {
      border-color: #63b3ed;
    }
    
    &.is-focus {
      border-color: #63b3ed;
      box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
    }
  }
  
  .el-input-number__decrease,
  .el-input-number__increase {
    background-color: #374151;
    border-color: #4a5568;
    color: #e2e8f0;
    
    &:hover {
      background-color: #4a5568;
      border-color: #63b3ed;
      color: #63b3ed;
    }
  }
}

:deep(.el-switch) {
  &.is-checked .el-switch__core {
    background-color: #63b3ed;
    border-color: #63b3ed;
  }
  
  .el-switch__core {
    background-color: #4a5568;
    border-color: #4a5568;
  }
}

:deep(.el-date-editor) {
  &.el-input {
    .el-input__wrapper {
      background-color: #1a202c;
      border: 1px solid #4a5568;
      
      &:hover {
        border-color: #63b3ed;
      }
      
      &.is-focus {
        border-color: #63b3ed;
        box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
      }
      
      .el-input__inner {
        color: #e2e8f0;
      }
    }
  }
}

:deep(.el-color-picker) {
  .el-color-picker__trigger {
    background-color: #2d3748;
    border: 1px solid #4a5568;
    
    &:hover {
      border-color: #63b3ed;
    }
  }
}

:deep(.el-button) {
  &.is-text {
    background-color: transparent;
    border-color: transparent;
    
    &.el-button--primary {
      color: #63b3ed;
      
      &:hover {
        background-color: rgba(99, 179, 237, 0.1);
      }
    }
    
    &.el-button--danger {
      color: #f56565;
      
      &:hover {
        background-color: rgba(245, 101, 101, 0.1);
      }
    }
  }
}


// 统一的属性网格样式
.unified-attributes-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-top: 24px;
  
  @media (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

// 添加自定义属性按钮 - 统一卡片样式
.add-custom-card-unified {
  padding: 20px;
  background: #2d3748;
  border: 2px dashed #4a5568;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: #48bb78;
    background: rgba(72, 187, 120, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.2);
  }
  
  .add-button-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    
    .add-icon {
      font-size: 32px;
      color: #48bb78;
      transition: all 0.3s ease;
    }
    
    .add-text {
      font-size: 14px;
      color: #e2e8f0;
      font-weight: 500;
      text-align: center;
    }
    
    .add-hint {
      font-size: 12px;
      color: #a0aec0;
      text-align: center;
      transition: color 0.3s ease;
    }
  }
  
  &:hover .add-icon {
    color: #38a169;
    transform: scale(1.1);
  }
  
  &:hover .add-hint {
    color: #48bb78;
  }
}


.custom-attribute-item {
  .attribute-name-input {
    border: none;
    background: transparent;
    
    :deep(.el-input__wrapper) {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      
      .el-input__inner {
        font-weight: 500;
        color: #e2e8f0;
        font-size: 14px;
        
        &::placeholder {
          color: #a0aec0;
          font-weight: normal;
        }
      }
    }
  }
  
  .custom-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .delete-btn {
      color: #f56565;
      padding: 4px;
      
      &:hover {
        background-color: rgba(245, 101, 101, 0.1);
      }
    }
  }
  
  .platform-indicator.el-tag--success {
    background-color: rgba(72, 187, 120, 0.2);
    border-color: #48bb78;
    color: #48bb78;
  }
  
  // 新增输入类型样式
  .percentage-input {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .percentage-symbol {
      color: #e2e8f0;
      font-weight: 500;
      font-size: 16px;
    }
    
    .add-item-btn {
      color: #48bb78;
      font-size: 12px;
    }
  }
  
  .composition-input {
    .composition-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      padding: 8px;
      background: rgba(74, 85, 104, 0.3);
      border-radius: 6px;
      
      .percentage-symbol {
        color: #e2e8f0;
        font-weight: 500;
        min-width: 20px;
      }
      
      .remove-item-btn {
        color: #f56565;
        padding: 4px;
        
        &:hover {
          background-color: rgba(245, 101, 101, 0.1);
        }
      }
    }
    
    .add-item-btn {
      color: #48bb78;
      margin-top: 8px;
      
      .el-icon {
        margin-right: 4px;
      }
    }
    
    .composition-total {
      margin-top: 12px;
      padding: 8px 12px;
      background: rgba(66, 153, 225, 0.1);
      border-radius: 6px;
      color: #63b3ed;
      font-weight: 500;
      text-align: center;
      
      .composition-warning {
        color: #f6ad55;
        font-size: 12px;
        margin-left: 8px;
      }
    }
  }
  
  .multi-select-config {
    .options-input {
      margin-bottom: 8px;
    }
  }
  
  .color-input {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .size-input {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
