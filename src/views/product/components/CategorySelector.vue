# 商品分类选择器组件
<template>
  <div class="category-selector">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <div class="header-main">
        <div class="header-left">
          <el-button 
            link 
            type="primary" 
            class="back-button"
            @click="handleBack"
          >
            <el-icon><ArrowLeft /></el-icon>
            Back to Product List
          </el-button>
          <el-divider direction="vertical" />
          <h2 class="page-title">Create Product - Select Category</h2>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="Enter keywords to search categories, or upload product image for quick identification"
          :prefix-icon="Search"
          clearable
          class="search-input"
        >
          <template #append>
            <el-upload
              class="image-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :before-upload="beforeUploadImage"
              :on-success="handleUploadSuccess"
            >
              <el-button :icon="Picture">Image Recognition</el-button>
            </el-upload>
          </template>
        </el-input>
      </div>

      <!-- 最近使用的类别 -->
      <div class="recent-categories">
        <div class="recent-tags">
          <el-tag
            v-for="category in recentCategories"
            :key="category.path"
            class="category-tag"
            :class="{ active: selectedCategory === category.path }"
            @click="handleSelectCategory(category.path)"
          >
            {{ category.name }}
          </el-tag>
        </div>
      </div>

      <!-- 分类网格 -->
      <div class="category-grid">
        <!-- 第一列 -->
        <div class="grid-column">
          <div
            v-for="category in firstColumn"
            :key="category.value"
            class="category-item"
            :class="{ active: isActive(category) }"
            @click="handleCategoryClick(category)"
          >
            {{ category.label }}
            <el-icon v-if="category.children"><ArrowRight /></el-icon>
          </div>
        </div>

        <!-- 第二列 -->
        <div class="grid-column" v-if="secondColumn.length">
          <div
            v-for="category in secondColumn"
            :key="category.value"
            class="category-item"
            :class="{ active: isActive(category) }"
            @click="handleCategoryClick(category)"
          >
            {{ category.label }}
            <el-icon v-if="category.children"><ArrowRight /></el-icon>
          </div>
        </div>

        <!-- 第三列 -->
        <div class="grid-column" v-if="thirdColumn.length">
          <div
            v-for="category in thirdColumn"
            :key="category.value"
            class="category-item"
            :class="{ active: isActive(category) }"
            @click="handleCategoryClick(category)"
          >
            {{ category.label }}
            <el-icon v-if="category.children"><ArrowRight /></el-icon>
          </div>
        </div>

        <!-- 第四列 -->
        <div class="grid-column" v-if="fourthColumn.length">
          <div
            v-for="category in fourthColumn"
            :key="category.value"
            class="category-item"
            :class="{ active: isActive(category) }"
            @click="handleCategoryClick(category)"
          >
            {{ category.label }}
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="page-footer">
        <div class="footer-left">
          <template v-if="selectedCategory">
            <el-tag type="success">Category Selected</el-tag>
            <span class="selected-category">{{ getSelectedCategoryPath }}</span>
          </template>
          <template v-else>
            <el-tag type="info">Not Selected</el-tag>
            <span class="empty-tip">
              <el-icon><InfoFilled /></el-icon>
              Please select a category to continue
            </span>
          </template>
        </div>
        <div class="footer-right">
          <el-button @click="handleBack">Cancel</el-button>
          <el-button 
            type="primary" 
            :disabled="!selectedCategory" 
            @click="handleNext"
          >
            Next Step
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Picture, InfoFilled, ArrowRight, ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();
const searchQuery = ref('');
const selectedCategory = ref('');
const treeRef = ref();
const uploadAction = '/api/upload';

// 获取选中分类的完整路径名称
const getSelectedCategoryPath = computed(() => {
  if (!selectedCategory.value) return '';
  return selectedCategory.value.split('/').join(' > ');
});

// 返回列表
const handleBack = () => {
  router.push('/product/list');
};

// Recently used categories
const recentCategories = ref([
  { name: 'Men Crossbody Bags', path: 'bags/men/crossbody' },
  { name: 'Women Shoulder Bags', path: 'bags/women/shoulder' },
  { name: 'Travel Bags', path: 'bags/travel' },
  { name: 'Cosmetic Bags', path: 'bags/cosmetic' },
  { name: 'Wallets', path: 'bags/wallet' }
]);

// Category data
const categories = ref([
  {
    value: 'bags',
    label: 'Bags & Luggage',
    children: [
      {
        value: 'women_bags',
        label: 'Women Bags',
        children: [
          {
            value: 'shoulder',
            label: 'Shoulder Bags',
            children: [
              { value: 'leather_shoulder', label: 'Leather Shoulder Bags' },
              { value: 'canvas_shoulder', label: 'Canvas Shoulder Bags' },
              { value: 'chain_shoulder', label: 'Chain Shoulder Bags' }
            ]
          },
          {
            value: 'crossbody',
            label: 'Crossbody Bags',
            children: [
              { value: 'small_crossbody', label: 'Small Crossbody Bags' },
              { value: 'medium_crossbody', label: 'Medium Crossbody Bags' },
              { value: 'large_crossbody', label: 'Large Crossbody Bags' }
            ]
          },
          {
            value: 'tote',
            label: 'Tote Bags',
            children: [
              { value: 'work_tote', label: 'Work Tote Bags' },
              { value: 'beach_tote', label: 'Beach Tote Bags' },
              { value: 'shopping_tote', label: 'Shopping Tote Bags' }
            ]
          }
        ]
      },
      {
        value: 'men_bags',
        label: 'Men Bags',
        children: [
          {
            value: 'briefcase',
            label: 'Briefcases',
            children: [
              { value: 'leather_briefcase', label: 'Leather Briefcases' },
              { value: 'nylon_briefcase', label: 'Nylon Briefcases' },
              { value: 'canvas_briefcase', label: 'Canvas Briefcases' }
            ]
          },
          {
            value: 'backpack',
            label: 'Backpacks',
            children: [
              { value: 'business_backpack', label: 'Business Backpacks' },
              { value: 'casual_backpack', label: 'Casual Backpacks' },
              { value: 'travel_backpack', label: 'Travel Backpacks' }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 'sports',
    label: 'Sports & Outdoor',
    children: [
      {
        value: 'equipment',
        label: 'Sports Equipment',
        children: [
          {
            value: 'fitness',
            label: 'Fitness Equipment',
            children: [
              { value: 'cardio', label: 'Cardio Equipment' },
              { value: 'strength', label: 'Strength Training' },
              { value: 'yoga', label: 'Yoga & Pilates' }
            ]
          }
        ]
      }
    ]
  }
]);

// 当前选中的分类路径
const currentPath = ref<string[]>([]);

// 计算各列的数据
const firstColumn = computed(() => categories.value);

const secondColumn = computed(() => {
  if (!currentPath.value[0]) return [];
  const firstCategory = categories.value.find(c => c.value === currentPath.value[0]);
  return firstCategory?.children || [];
});

const thirdColumn = computed(() => {
  if (!currentPath.value[1]) return [];
  const secondCategory = secondColumn.value.find(c => c.value === currentPath.value[1]);
  return secondCategory?.children || [];
});

const fourthColumn = computed(() => {
  if (!currentPath.value[2]) return [];
  const thirdCategory = thirdColumn.value.find(c => c.value === currentPath.value[2]);
  return thirdCategory?.children || [];
});

// 检查分类是否激活
const isActive = (category: any) => {
  return currentPath.value.includes(category.value);
};

// 处理分类点击
const handleCategoryClick = (category: any) => {
  const index = currentPath.value.indexOf(category.value);
  if (index > -1) {
    // 如果已经在路径中，清除此级别之后的所有选择
    currentPath.value = currentPath.value.slice(0, index + 1);
  } else {
    // 找到当前应该在的层级
    const level = [firstColumn, secondColumn, thirdColumn, fourthColumn]
      .findIndex(col => col.value.includes(category));
    
    // 更新路径
    currentPath.value = [...currentPath.value.slice(0, level), category.value];
  }

  // 如果是最终分类（没有子分类），则设置为选中的分类
  if (!category.children) {
    selectedCategory.value = currentPath.value.join('/');
  }
};

// 监听搜索输入
watch(searchQuery, (val) => {
  treeRef.value?.filter(val);
});

// 过滤节点方法
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.toLowerCase().includes(value.toLowerCase());
};

// 处理节点点击
const handleNodeClick = (data: any) => {
  // 只有叶子节点才可选
  if (!data.children) {
    selectedCategory.value = data.value;
  }
};

// 处理类别选择
const handleSelectCategory = (categoryPath: string) => {
  selectedCategory.value = categoryPath;
};

// 图片上传前检查
const beforeUploadImage = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB！');
    return false;
  }
  return true;
};

// 图片上传成功处理
const handleUploadSuccess = (response: any) => {
  // TODO: 处理AI识别结果
  ElMessage.success('图片识别成功');
};

// 处理下一步
const handleNext = () => {
  if (selectedCategory.value) {
    router.push({
      name: 'ProductCreate',
      query: { category: selectedCategory.value }
    });
  }
};
</script>

<style scoped lang="scss">
.category-selector {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
}

.page-header {
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 24px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-button {
      font-size: 14px;
      .el-icon {
        margin-right: 4px;
      }
    }

    .page-title {
      font-size: 18px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px;
}

.search-section {
  margin-bottom: 20px;
  padding: 0 20px;

  .search-input {
    width: 100%;
  }

  :deep(.el-input-group__append) {
    padding: 0;
    
    .el-upload {
      display: block;
    }

    .el-button {
      border: none;
      margin: 0;
      border-radius: 0;
    }
  }
}

.recent-categories {
  padding: 0 20px;
  margin-bottom: 20px;

  .recent-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .category-tag {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-1px);
    }

    &.active {
      background-color: var(--el-color-primary);
      color: white;
    }
  }
}

.category-grid {
  height: 400px;
  display: flex;
  gap: 0;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  margin: 0 20px;
  background-color: var(--el-bg-color-overlay);
  overflow: hidden;
}

.grid-column {
  width: 25%;
  border-right: 1px solid var(--el-border-color-lighter);
  overflow-y: auto;
  background-color: var(--el-fill-color-blank);

  &:last-child {
    border-right: none;
  }

  .category-item {
    padding: 10px 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;
    color: var(--el-text-color-regular);
    font-size: 14px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.active {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }

    .el-icon {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}

.empty-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);

  .el-icon {
    font-size: 16px;
  }
}

.page-footer {
  height: 64px;
  margin: 0 -24px;
  padding: 0 24px;
  background-color: var(--el-bg-color-overlay);
  border-top: 1px solid var(--el-border-color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .footer-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .selected-category {
      color: var(--el-text-color-regular);
      font-weight: 500;
    }
  }

  .footer-right {
    display: flex;
    gap: 12px;
  }
}

:deep(.el-tree-node__content) {
  height: 40px;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
