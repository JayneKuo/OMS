<template>
  <div class="category-selector-simple">
    <!-- 主要分类输入 - 简化版 -->
    <div class="main-category-section">
      <div class="category-input-wrapper">
        <el-input
          v-model="displayValue"
          placeholder="Enter product category (e.g., Electronics > Mobile Phones > iPhone)"
          size="large"
          clearable
          @keyup.enter="setMainCategory"
          @blur="setMainCategory"
          @clear="clearCategory"
          class="category-input"
        />
        <el-button 
          v-if="displayValue.trim() && displayValue !== currentCategory"
          type="primary" 
          @click="setMainCategory"
          class="set-button"
        >
          Set
        </el-button>
        <el-button 
          type="warning"
          @click="handleMappingClick"
          class="mapping-button"
        >
          <el-icon><Setting /></el-icon>
          Mapping
        </el-button>
      </div>
      <div class="help-text">
        Enter category path separated by " > " or click "Mapping" to add platform-specific categories (only leaf nodes can be selected)
      </div>
    </div>

    <!-- 平台映射 - 简化版 -->
    <div v-if="showMapping" class="platform-mapping-simple">
      <div class="mapping-list">
        <div 
          v-for="(mapping, index) in platformMappings" 
          :key="index"
          class="mapping-row-simple"
        >
          <el-select 
            v-model="mapping.platform"
            placeholder="Platform"
            size="default"
            style="width: 120px"
            @change="handlePlatformChange(index)"
            clearable
          >
            <el-option
              v-for="platform in platforms"
              :key="platform.value"
              :label="platform.label"
              :value="platform.value"
            />
          </el-select>
          
          <el-icon class="arrow-icon"><Right /></el-icon>
          
          <el-cascader
            v-if="mapping.platform && mapping.platform !== 'Custom'"
            :key="`cascader-${mapping.platform}-${index}`"
            v-model="mapping.path"
            :options="getCategoryOptions(mapping.platform)"
            :props="cascaderProps"
            placeholder="Select category"
            size="default"
            clearable
            filterable
            show-all-levels
            style="flex: 1"
            @change="handleCascaderChange($event, index)"
            @visible-change="handleCascaderVisibleChange"
          />
          <el-input
            v-else-if="mapping.platform === 'Custom'"
            v-model="mapping.customPath"
            placeholder="Enter custom category"
            size="default"
            style="flex: 1"
            @input="updateMapping"
          />
          <div v-else class="placeholder-text">Select platform first</div>
          
          <el-button 
            type="danger" 
            text
            size="small"
            @click="removePlatformMapping(index)"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        
        <el-button 
          type="primary" 
          text
          size="small"
          @click="addPlatformMapping"
          class="add-btn"
        >
          <el-icon><Plus /></el-icon>
          Add Platform
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { 
  Close, 
  Plus, 
  Right,
  Setting
} from '@element-plus/icons-vue';
import type { CategoryInfo, PlatformCategory, PlatformType } from '@/types/product';

const props = defineProps<{
  modelValue: CategoryInfo;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: CategoryInfo): void;
}>();

// 主要分类输入 - 简化版
const currentCategory = ref('');
const showMapping = ref(false);

// 显示值 - 直接在输入框中回显
const displayValue = ref('');

// 平台映射
const platformMappings = ref<Array<{
  platform: PlatformType | '';
  path: string[];
  customPath: string;
}>>([]);

// Cascader 配置 - 优化交互体验
const cascaderProps = {
  checkStrictly: false, // 只允许选择叶子节点
  emitPath: true,
  expandTrigger: 'click' as const,
  children: 'children',
  value: 'value',
  label: 'label',
  lazy: false, // 确保数据立即加载
  changeOnSelect: false // 只有选择叶子节点才触发change事件
};

// Platform options
const platforms = [
  { label: 'Amazon', value: 'Amazon' as PlatformType },
  { label: 'eBay', value: 'eBay' as PlatformType },
  { label: 'Shopify', value: 'Shopify' as PlatformType },
  { label: 'Shein', value: 'Shein' as PlatformType },
  { label: 'Walmart', value: 'Walmart' as PlatformType },
  { label: 'Custom', value: 'Custom' as PlatformType }
];

// Mock category data - 完善所有平台数据，确保有叶子节点
const getCategoryOptions = (platform: PlatformType) => {
  const mockData: Record<string, any[]> = {
    Amazon: [
      {
        value: 'electronics',
        label: 'Electronics',
        children: [
          {
            value: 'mobile',
            label: 'Mobile Phones',
            children: [
              {
                value: 'iphone',
                label: 'iPhone',
                children: [
                  { value: 'iphone_14', label: 'iPhone 14' },
                  { value: 'iphone_15', label: 'iPhone 15' },
                  { value: 'iphone_pro', label: 'iPhone Pro Series' }
                ]
              },
              {
                value: 'android',
                label: 'Android',
                children: [
                  { value: 'samsung', label: 'Samsung' },
                  { value: 'huawei', label: 'Huawei' },
                  { value: 'xiaomi', label: 'Xiaomi' }
                ]
              },
              {
                value: 'accessories',
                label: 'Phone Accessories',
                children: [
                  { value: 'cases', label: 'Phone Cases' },
                  { value: 'chargers', label: 'Chargers' },
                  { value: 'screen_protectors', label: 'Screen Protectors' }
                ]
              }
            ]
          },
          {
            value: 'computers',
            label: 'Computers',
            children: [
              {
                value: 'laptop',
                label: 'Laptops',
                children: [
                  { value: 'gaming_laptop', label: 'Gaming Laptops' },
                  { value: 'business_laptop', label: 'Business Laptops' },
                  { value: 'ultrabook', label: 'Ultrabooks' }
                ]
              },
              {
                value: 'desktop',
                label: 'Desktops',
                children: [
                  { value: 'gaming_desktop', label: 'Gaming Desktops' },
                  { value: 'office_desktop', label: 'Office Desktops' },
                  { value: 'workstation', label: 'Workstations' }
                ]
              },
              {
                value: 'tablets',
                label: 'Tablets',
                children: [
                  { value: 'ipad', label: 'iPad' },
                  { value: 'android_tablet', label: 'Android Tablets' },
                  { value: 'windows_tablet', label: 'Windows Tablets' }
                ]
              }
            ]
          }
        ]
      },
      {
        value: 'clothing',
        label: 'Clothing',
        children: [
          {
            value: 'mens',
            label: "Men's Clothing",
            children: [
              { value: 'mens_shirts', label: "Men's Shirts" },
              { value: 'mens_pants', label: "Men's Pants" },
              { value: 'mens_jackets', label: "Men's Jackets" }
            ]
          },
          {
            value: 'womens',
            label: "Women's Clothing",
            children: [
              { value: 'womens_dresses', label: "Women's Dresses" },
              { value: 'womens_tops', label: "Women's Tops" },
              { value: 'womens_bottoms', label: "Women's Bottoms" }
            ]
          },
          {
            value: 'kids',
            label: "Kids' Clothing",
            children: [
              { value: 'boys_clothing', label: "Boys' Clothing" },
              { value: 'girls_clothing', label: "Girls' Clothing" },
              { value: 'baby_clothing', label: "Baby Clothing" }
            ]
          }
        ]
      }
    ],
    eBay: [
      {
        value: 'collectibles',
        label: 'Collectibles',
        children: [
          {
            value: 'coins',
            label: 'Coins',
            children: [
              { value: 'us_coins', label: 'US Coins' },
              { value: 'world_coins', label: 'World Coins' },
              { value: 'ancient_coins', label: 'Ancient Coins' }
            ]
          },
          {
            value: 'stamps',
            label: 'Stamps',
            children: [
              { value: 'us_stamps', label: 'US Stamps' },
              { value: 'world_stamps', label: 'World Stamps' },
              { value: 'vintage_stamps', label: 'Vintage Stamps' }
            ]
          },
          {
            value: 'vintage',
            label: 'Vintage Items',
            children: [
              { value: 'vintage_toys', label: 'Vintage Toys' },
              { value: 'vintage_books', label: 'Vintage Books' },
              { value: 'vintage_postcards', label: 'Vintage Postcards' }
            ]
          }
        ]
      },
      {
        value: 'electronics',
        label: 'Electronics',
        children: [
          {
            value: 'phones',
            label: 'Cell Phones',
            children: [
              { value: 'smartphones', label: 'Smartphones' },
              { value: 'feature_phones', label: 'Feature Phones' },
              { value: 'phone_parts', label: 'Phone Parts' }
            ]
          },
          {
            value: 'computers',
            label: 'Computers',
            children: [
              { value: 'laptops_ebay', label: 'Laptops' },
              { value: 'desktops_ebay', label: 'Desktop Computers' },
              { value: 'computer_parts', label: 'Computer Parts' }
            ]
          }
        ]
      }
    ],
    Shopify: [
      {
        value: 'fashion',
        label: 'Fashion',
        children: [
          {
            value: 'accessories',
            label: 'Accessories',
            children: [
              { value: 'jewelry', label: 'Jewelry' },
              { value: 'watches', label: 'Watches' },
              { value: 'sunglasses', label: 'Sunglasses' }
            ]
          },
          {
            value: 'shoes',
            label: 'Shoes',
            children: [
              { value: 'sneakers', label: 'Sneakers' },
              { value: 'boots', label: 'Boots' },
              { value: 'sandals', label: 'Sandals' }
            ]
          },
          {
            value: 'bags',
            label: 'Bags',
            children: [
              { value: 'handbags', label: 'Handbags' },
              { value: 'backpacks', label: 'Backpacks' },
              { value: 'wallets', label: 'Wallets' }
            ]
          }
        ]
      },
      {
        value: 'home',
        label: 'Home & Garden',
        children: [
          {
            value: 'decor',
            label: 'Home Decor',
            children: [
              { value: 'wall_art', label: 'Wall Art' },
              { value: 'candles', label: 'Candles' },
              { value: 'vases', label: 'Vases' }
            ]
          },
          {
            value: 'kitchen',
            label: 'Kitchen',
            children: [
              { value: 'cookware', label: 'Cookware' },
              { value: 'appliances', label: 'Kitchen Appliances' },
              { value: 'dinnerware', label: 'Dinnerware' }
            ]
          }
        ]
      }
    ],
    Shein: [
      {
        value: 'women',
        label: "Women's Fashion",
        children: [
          {
            value: 'dresses',
            label: 'Dresses',
            children: [
              { value: 'casual_dresses', label: 'Casual Dresses' },
              { value: 'party_dresses', label: 'Party Dresses' },
              { value: 'maxi_dresses', label: 'Maxi Dresses' }
            ]
          },
          {
            value: 'tops',
            label: 'Tops',
            children: [
              { value: 'blouses', label: 'Blouses' },
              { value: 'tshirts', label: 'T-shirts' },
              { value: 'sweaters', label: 'Sweaters' }
            ]
          },
          {
            value: 'bottoms',
            label: 'Bottoms',
            children: [
              { value: 'jeans', label: 'Jeans' },
              { value: 'skirts', label: 'Skirts' },
              { value: 'shorts', label: 'Shorts' }
            ]
          }
        ]
      },
      {
        value: 'men',
        label: "Men's Fashion",
        children: [
          {
            value: 'shirts',
            label: 'Shirts',
            children: [
              { value: 'casual_shirts', label: 'Casual Shirts' },
              { value: 'dress_shirts', label: 'Dress Shirts' },
              { value: 'polo_shirts', label: 'Polo Shirts' }
            ]
          },
          {
            value: 'pants',
            label: 'Pants',
            children: [
              { value: 'casual_pants', label: 'Casual Pants' },
              { value: 'dress_pants', label: 'Dress Pants' },
              { value: 'jeans_men', label: 'Jeans' }
            ]
          }
        ]
      }
    ],
    Walmart: [
      {
        value: 'grocery',
        label: 'Grocery',
        children: [
          {
            value: 'food',
            label: 'Food',
            children: [
              { value: 'fresh_produce', label: 'Fresh Produce' },
              { value: 'dairy', label: 'Dairy Products' },
              { value: 'meat_seafood', label: 'Meat & Seafood' }
            ]
          },
          {
            value: 'beverages',
            label: 'Beverages',
            children: [
              { value: 'soft_drinks', label: 'Soft Drinks' },
              { value: 'coffee_tea', label: 'Coffee & Tea' },
              { value: 'juices', label: 'Juices' }
            ]
          }
        ]
      },
      {
        value: 'electronics',
        label: 'Electronics',
        children: [
          {
            value: 'tv',
            label: 'TV & Video',
            children: [
              { value: 'smart_tvs', label: 'Smart TVs' },
              { value: 'streaming_devices', label: 'Streaming Devices' },
              { value: 'dvd_players', label: 'DVD Players' }
            ]
          },
          {
            value: 'audio',
            label: 'Audio',
            children: [
              { value: 'headphones', label: 'Headphones' },
              { value: 'speakers', label: 'Speakers' },
              { value: 'sound_bars', label: 'Sound Bars' }
            ]
          }
        ]
      }
    ]
  };
  return mockData[platform] || [];
};

// 设置主分类 - 简化版
const setMainCategory = () => {
  const input = displayValue.value?.trim();
  if (input) {
    currentCategory.value = input;
    // 直接在输入框回显，不显示额外组件
    displayValue.value = input;
    updateParent();
  }
};

// 清空分类
const clearCategory = () => {
  currentCategory.value = '';
  displayValue.value = '';
  platformMappings.value = [];
  showMapping.value = false;
  updateParent();
};

// 添加平台映射
const addPlatformMapping = () => {
  platformMappings.value.push({
    platform: '',
    path: [],
    customPath: ''
  });
};

// 移除平台映射
const removePlatformMapping = (index: number) => {
  platformMappings.value.splice(index, 1);
  updateMapping();
};

// 处理平台变化
const handlePlatformChange = (index: number) => {
  console.log('Platform changed for index:', index, 'to:', platformMappings.value[index]?.platform);
  if (platformMappings.value[index]) {
    // 清空路径，因为平台变了
    platformMappings.value[index].path = [];
    platformMappings.value[index].customPath = '';
    updateMapping();
  }
};

// 处理cascader变化 - 只允许选择叶子节点
const handleCascaderChange = (value: string[], index: number) => {
  console.log('Cascader changed (leaf node only):', value, 'for index:', index);
  if (platformMappings.value[index]) {
    // 确保更新路径，即使是空值也要处理
    platformMappings.value[index].path = value || [];
    console.log('Updated mapping with leaf node:', platformMappings.value[index]);
    
    // 立即更新父组件数据
    updateMapping();
    
    // 如果选择了值，强制触发响应式更新
    if (value && value.length > 0) {
      // 使用nextTick确保DOM更新
      nextTick(() => {
        console.log('Cascader selection completed, path updated:', value);
      });
    }
  }
};

// 处理cascader显示状态变化
const handleCascaderVisibleChange = (visible: boolean) => {
  console.log('Cascader visibility changed:', visible);
  // 当cascader关闭时，确保数据已更新
  if (!visible) {
    updateMapping();
  }
};

// 更新映射
const updateMapping = () => {
  updateParent();
};

// 处理Mapping按钮点击 - 简化版
const handleMappingClick = () => {
  // 如果用户有输入但未设置，先自动设置主分类
  const input = displayValue.value?.trim();
  if (input && input !== currentCategory.value) {
    currentCategory.value = input;
    displayValue.value = input;
  }
  
  // 显示映射面板并添加一个新的映射
  showMapping.value = true;
  addPlatformMapping();
};

// 更新父组件
const updateParent = () => {
  const validMappings = platformMappings.value
    .filter(mapping => mapping.platform)
    .map(mapping => ({
      platform: mapping.platform as PlatformType,
      path: mapping.platform === 'Custom' ? [] : mapping.path,
      customPath: mapping.platform === 'Custom' ? mapping.customPath : ''
    }));

  const newValue: CategoryInfo = {
    categories: validMappings,
    customCategory: currentCategory.value // 单个分类
  };

  emit('update:modelValue', newValue);
};

// 初始化 - 简化版，增加安全检查
const initialize = () => {
  // 确保props.modelValue存在，如果不存在则创建默认值
  if (!props.modelValue) {
    // 通知父组件创建默认值
    emit('update:modelValue', {
      categories: [],
      customCategory: ''
    });
    return;
  }
  
  if (props.modelValue.customCategory) {
    currentCategory.value = props.modelValue.customCategory;
    displayValue.value = props.modelValue.customCategory;
  }
  
  if (props.modelValue.categories && Array.isArray(props.modelValue.categories) && props.modelValue.categories.length > 0) {
    platformMappings.value = props.modelValue.categories.map(cat => ({
      platform: cat.platform || '',
      path: cat.path || [],
      customPath: cat.customPath || ''
    }));
    showMapping.value = true;
  }
};

// Watch for prop changes
watch(() => props.modelValue, initialize, { immediate: true });

initialize();
</script>

<style scoped lang="scss">
.category-selector-simple {
  width: 100%;
}

.main-category-section {
  margin-bottom: 12px;
  
  .category-input-wrapper {
    display: flex;
    gap: 8px;
    align-items: stretch;
    
    .category-input {
      flex: 1;
      min-width: 0; // 防止flex子元素溢出
    }
    
    .set-button {
      flex-shrink: 0;
      min-width: 60px;
    }
    
    .mapping-button {
      flex-shrink: 0;
      min-width: 100px;
      background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
      border-color: #ed8936;
      color: white;
      font-weight: 500;
      
      &:hover {
        background: linear-gradient(135deg, #dd6b20 0%, #c05621 100%);
        border-color: #dd6b20;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(237, 137, 54, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }
  
  .help-text {
    color: #a0aec0;
    font-size: 12px;
    margin-top: 6px;
    line-height: 1.4;
  }
}

.platform-mapping-simple {
  margin-top: 12px;
  padding: 16px;
  background: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 8px;
  
  .mapping-list {
    .mapping-row-simple {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      
      .arrow-icon {
        color: #63b3ed;
        font-size: 14px;
        flex-shrink: 0;
      }
      
      .placeholder-text {
        flex: 1;
        color: #718096;
        font-size: 13px;
        text-align: center;
        padding: 8px;
        background: #374151;
        border: 1px solid #4a5568;
        border-radius: 4px;
      }
    }
    
    .add-btn {
      color: #63b3ed;
      font-size: 13px;
      
      &:hover {
        background-color: rgba(99, 179, 237, 0.1);
      }
    }
  }
}

// Dark theme for form controls
:deep(.el-input__wrapper) {
  background-color: #2d3748;
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
    background-color: #2d3748;
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
      background-color: transparent;
    }
  }
}

:deep(.el-button) {
  &.el-button--primary {
    background-color: #63b3ed;
    border-color: #63b3ed;
    color: white;
    
    &:hover {
      background-color: #4299e1;
      border-color: #4299e1;
    }
    
    &:disabled {
      background-color: #4a5568;
      border-color: #4a5568;
      color: #718096;
    }
  }
  
  &.is-text {
    background-color: transparent;
    border-color: transparent;
    
    &.el-button--danger {
      color: #f56565;
      
      &:hover {
        background-color: rgba(245, 101, 101, 0.1);
      }
    }
    
    &.el-button--primary {
      color: #63b3ed;
      
      &:hover {
        background-color: rgba(99, 179, 237, 0.1);
      }
    }
  }
}
</style>
