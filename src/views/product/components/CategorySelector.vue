<template>
  <div class="category-selector">
    <!-- 平台分类列表 -->
    <div class="platform-categories-section">
      <div class="section-header">
        <span class="section-title">Platform Categories (optional)</span>
          <el-button 
            type="primary" 
          text
          size="small"
          @click="addCategory"
          >
          <el-icon><Plus /></el-icon>
          Add Platform
          </el-button>
    </div>

      <div 
        v-for="(category, index) in localCategories" 
        :key="index"
        class="platform-item"
      >
        <el-row :gutter="12" align="middle">
          <!-- 平台选择 -->
          <el-col :span="6">
            <el-select 
              :model-value="category.platform"
              placeholder="Platform"
              size="small"
          clearable
              @change="handlePlatformChange(index, $event)"
            >
              <el-option
                v-for="platform in platforms"
                :key="platform.value"
                :label="platform.label"
                :value="platform.value"
              />
            </el-select>
          </el-col>

          <!-- 分类选择或自定义输入 -->
          <el-col :span="16">
            <!-- 平台分类选择 -->
            <el-cascader
              v-if="category.platform && category.platform !== 'Custom'"
              :model-value="category.path"
              :options="getCategoryOptions(category.platform)"
              :props="cascaderProps"
              placeholder="Select category"
              size="small"
              clearable
              filterable
              show-all-levels
              style="width: 100%"
              @change="handleCategoryChange(index, $event)"
            />
            
            <!-- 自定义平台分类输入 -->
            <el-input
              v-else-if="category.platform === 'Custom'"
              :model-value="category.customPath"
              placeholder="Enter custom category path"
              size="small"
              @input="handleCustomPathChange(index, $event)"
            />
            
            <!-- 未选择平台时的提示 -->
            <div v-else class="placeholder-text">
              Select a platform first
          </div>
          </el-col>

          <!-- 删除按钮 -->
          <el-col :span="2">
            <el-button 
              type="danger" 
              text
              size="small"
              @click="removeCategory(index)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-col>
        </el-row>

        <!-- 选中分类的显示 -->
        <div v-if="getFullCategoryPath(category)" class="category-preview">
          <div class="selected-category">
            <el-icon class="check-icon"><Check /></el-icon>
            <span class="category-text">{{ category.platform }}: {{ getFullCategoryPath(category) }}</span>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="localCategories.length === 0" class="empty-state">
        <el-text type="info" size="small">
          No platform categories added. Click "Add Platform" to add one.
        </el-text>
      </div>
    </div>

    <!-- 当前选择的总览 -->
    <div v-if="hasAnyCategory" class="category-summary">
      <div class="summary-title">
        <el-icon><Check /></el-icon>
        Selected Categories:
        </div>
      <div class="summary-content">
        <div 
          v-for="(category, index) in localCategories" 
          :key="index"
          v-if="getFullCategoryPath(category)"
          class="summary-item platform"
        >
          <div class="item-label">{{ category.platform }}:</div>
          <div class="item-value">{{ getFullCategoryPath(category) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Folder, Plus, Delete, Check } from '@element-plus/icons-vue';
import type { CategoryInfo, PlatformType, PlatformCategory } from '@/types/product';

const props = defineProps<{
  modelValue: CategoryInfo;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: CategoryInfo): void;
}>();

// 状态管理
const localCategories = ref<PlatformCategory[]>([]);

// Cascader 配置
const cascaderProps = {
  checkStrictly: true, // 改为 true，可以选择任意级别的节点
  emitPath: true,
  expandTrigger: 'hover' as const,
  value: 'value',
  label: 'label',
  children: 'children'
};

// 是否有任何分类
const hasAnyCategory = computed(() => {
  return localCategories.value.some(cat => getFullCategoryPath(cat));
});

// Platform options
const platforms = [
  { label: 'Amazon', value: 'Amazon' as PlatformType },
  { label: 'Shopify', value: 'Shopify' as PlatformType },
  { label: 'Walmart', value: 'Walmart' as PlatformType },
  { label: 'eBay', value: 'eBay' as PlatformType },
  { label: 'Custom', value: 'Custom' as PlatformType }
];

// Category options
const categoryOptions = {
  Amazon: [
    {
      value: 'electronics',
      label: 'Electronics',
    children: [
      {
          value: 'computers',
          label: 'Computers & Accessories',
          children: [
            { value: 'laptops', label: 'Laptops' },
            { value: 'desktops', label: 'Desktop Computers' },
            { value: 'tablets', label: 'Tablets' },
            { value: 'monitors', label: 'Monitors' },
            { value: 'keyboards', label: 'Keyboards & Mice' }
          ]
        },
        {
          value: 'phones',
          label: 'Cell Phones & Accessories',
        children: [
            { value: 'smartphones', label: 'Unlocked Cell Phones' },
            { value: 'cases', label: 'Cases, Holsters & Sleeves' },
            { value: 'chargers', label: 'Chargers & Power Adapters' },
            { value: 'screen-protectors', label: 'Screen Protectors' },
            { value: 'bluetooth', label: 'Bluetooth Headsets' }
          ]
        },
        {
          value: 'audio',
          label: 'Audio & Video',
            children: [
            { value: 'headphones', label: 'Headphones' },
            { value: 'speakers', label: 'Speakers' },
            { value: 'cameras', label: 'Digital Cameras' }
          ]
        }
      ]
    },
    {
      value: 'clothing',
      label: 'Clothing, Shoes & Jewelry',
      children: [
        {
          value: 'mens',
          label: 'Men',
            children: [
            { value: 'shirts', label: 'Shirts' },
            { value: 'pants', label: 'Pants' },
            { value: 'shoes', label: 'Shoes' },
            { value: 'jackets', label: 'Jackets & Coats' },
            { value: 'underwear', label: 'Underwear' }
          ]
        },
        {
          value: 'womens',
          label: 'Women',
            children: [
            { value: 'dresses', label: 'Dresses' },
            { value: 'tops', label: 'Tops & Tees' },
            { value: 'shoes', label: 'Shoes' },
            { value: 'handbags', label: 'Handbags & Wallets' },
            { value: 'jewelry', label: 'Jewelry' }
            ]
          }
        ]
      },
      {
      value: 'home',
      label: 'Home & Kitchen',
        children: [
          {
          value: 'furniture',
          label: 'Furniture',
            children: [
            { value: 'bedroom', label: 'Bedroom Furniture' },
            { value: 'living-room', label: 'Living Room Furniture' },
            { value: 'office', label: 'Office Furniture' }
          ]
        },
        {
          value: 'kitchen',
          label: 'Kitchen & Dining',
            children: [
            { value: 'cookware', label: 'Cookware' },
            { value: 'appliances', label: 'Small Appliances' },
            { value: 'dinnerware', label: 'Dinnerware & Serveware' }
          ]
        }
      ]
    }
  ],
  Shopify: [
    {
      value: 'home',
      label: 'Home & Garden',
      children: [
        {
          value: 'furniture',
          label: 'Furniture',
          children: [
            { value: 'chairs', label: 'Chairs' },
            { value: 'tables', label: 'Tables' },
            { value: 'sofas', label: 'Sofas & Couches' },
            { value: 'storage', label: 'Storage & Organization' }
          ]
        },
        {
          value: 'decor',
          label: 'Home Decor',
    children: [
            { value: 'wall-art', label: 'Wall Art' },
            { value: 'candles', label: 'Candles & Holders' },
            { value: 'rugs', label: 'Rugs & Carpets' }
          ]
        }
      ]
    },
    {
      value: 'fashion',
      label: 'Fashion',
        children: [
          {
          value: 'clothing',
          label: 'Clothing',
            children: [
            { value: 'casual', label: 'Casual Wear' },
            { value: 'formal', label: 'Formal Wear' },
            { value: 'sportswear', label: 'Sportswear' }
            ]
          }
        ]
      }
    ]
};

// Get category options based on platform
const getCategoryOptions = (platform: PlatformType) => {
  return categoryOptions[platform as keyof typeof categoryOptions] || categoryOptions.Amazon;
};

// 移除了 getCategoryDisplay 函数，使用 getFullCategoryPath 替代

// 获取完整的分类路径（不包含平台名称）
const getFullCategoryPath = (category: PlatformCategory): string => {
  if (!category.platform) return '';
  
  if (category.platform === 'Custom' && category.customPath) {
    return category.customPath;
  }
  
  if (category.platform && category.path && category.path.length > 0) {
    const options = getCategoryOptions(category.platform);
    const labels = getPathLabels(category.path, options);
    return labels.join(' > ');
  }
  
  return '';
};

// 获取路径标签
const getPathLabels = (path: string[], options: any[]): string[] => {
  if (!path || path.length === 0) return [];
  
  const [current, ...rest] = path;
  const option = options.find(opt => opt.value === current);
  
  if (!option) return [current];
  
  if (rest.length === 0) return [option.label];
  
  const childLabels = getPathLabels(rest, option.children || []);
  return [option.label, ...childLabels];
};

// Initialize
const initialize = () => {
  localCategories.value = props.modelValue.categories ? [...props.modelValue.categories] : [];
};

// Add category
const addCategory = () => {
  localCategories.value.push({
    platform: '',
    path: [],
    customPath: ''
  });
  updateParent();
};

// Remove category
const removeCategory = (index: number) => {
  localCategories.value.splice(index, 1);
  updateParent();
};

// Handle platform change
const handlePlatformChange = (index: number, platform: PlatformType | null) => {
  if (platform) {
    localCategories.value[index] = {
      platform,
      path: [],
      customPath: ''
    };
  } else {
    localCategories.value[index] = {
      platform: '',
      path: [],
      customPath: ''
    };
  }
  updateParent();
};

// Handle category change
const handleCategoryChange = (index: number, path: string[]) => {
  if (localCategories.value[index]) {
    localCategories.value[index].path = path || [];
    updateParent();
  }
};

// Handle custom path change
const handleCustomPathChange = (index: number, customPath: string) => {
  if (localCategories.value[index]) {
    localCategories.value[index].customPath = customPath;
    updateParent();
  }
};

// Handle custom category change

// Update parent
const updateParent = () => {
  const newValue = {
    categories: [...localCategories.value]
  };
  emit('update:modelValue', newValue);
};

// Initialize
initialize();

// Watch for external changes
watch(() => props.modelValue, () => {
  initialize();
}, { deep: true });
</script>

<style scoped lang="scss">
.category-selector {
  .custom-category-section {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .platform-categories-section {
    .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
      margin-bottom: 12px;
    }

    .section-title {
      font-weight: 500;
      color: #606266;
      font-size: 14px;
    }

    .platform-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      transition: all 0.2s ease;

      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
      }
    }

    .placeholder-text {
      color: #c0c4cc;
      font-size: 12px;
      line-height: 32px;
      text-align: center;
    }

    .category-preview {
      margin-top: 8px;
      
      .selected-category {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        background: linear-gradient(135deg, #67c23a, #85ce61);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        
        .check-icon {
          margin-right: 6px;
          font-size: 14px;
        }
        
        .category-text {
          flex: 1;
          word-break: break-all;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 20px;
      color: #909399;
    }
  }

  .category-summary {
    margin-top: 16px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .summary-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
      font-size: 14px;
      
      .el-icon {
        margin-right: 6px;
        color: #67c23a;
      }
    }

    .summary-content {
  display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .summary-item {
    display: flex;
      align-items: flex-start;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      
      &.custom {
        background: linear-gradient(135deg, #409eff, #66b1ff);
        color: white;
      }
      
      &.platform {
        background: linear-gradient(135deg, #67c23a, #85ce61);
        color: white;
      }
      
      .item-label {
        font-weight: 600;
        min-width: 100px;
        margin-right: 8px;
      }
      
      .item-value {
        flex: 1;
        word-break: break-all;
        font-weight: 500;
      }
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-input--small) {
    .el-input__wrapper {
      border-radius: 4px;
    }
  }

  :deep(.el-cascader) {
    .el-input__wrapper {
      border-radius: 4px;
    }
  }
}
</style>
