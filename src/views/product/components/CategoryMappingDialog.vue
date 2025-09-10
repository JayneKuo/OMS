<template>
  <el-dialog
    v-model="visible"
    :title="'映射分类: ' + localCategory?.name"
    width="800px"
  >
    <div class="mapping-container">
      <!-- 本地分类信息 -->
      <div class="local-category-info">
        <div class="info-item">
          <span class="label">分类名称：</span>
          <span class="value">{{ localCategory?.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">分类编码：</span>
          <span class="value">{{ localCategory?.code }}</span>
        </div>
        <div class="info-item">
          <span class="label">分类路径：</span>
          <span class="value">{{ localCategory?.path }}</span>
        </div>
      </div>

      <!-- 平台选择 -->
      <div class="platform-selector">
        <el-radio-group v-model="selectedPlatform" @change="handlePlatformChange">
          <el-radio-button label="shein">Shein</el-radio-button>
          <el-radio-button label="amazon">Amazon</el-radio-button>
          <el-radio-button label="shopify">Shopify</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 平台分类选择 -->
      <div v-if="selectedPlatform" class="platform-categories">
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索平台分类"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="categories-tree">
          <el-tree
            ref="treeRef"
            :data="platformCategories"
            :props="treeProps"
            :filter-node-method="filterNode"
            node-key="id"
            highlight-current
            @current-change="handleCategorySelect"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span class="category-id">({{ data.originalId }})</span>
              </div>
            </template>
          </el-tree>
        </div>

        <!-- 已选分类 -->
        <div v-if="selectedCategory" class="selected-category">
          <div class="title">已选平台分类：</div>
          <div class="content">
            <el-tag :type="getPlatformTagType(selectedPlatform)">
              {{ getPlatformLabel(selectedPlatform) }}
            </el-tag>
            <span class="selected-name">{{ selectedCategory.name }}</span>
            <span class="selected-id">({{ selectedCategory.originalId }})</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!selectedCategory"
          @click="handleConfirm"
        >
          确认映射
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { LocalCategory } from '../types/category'
import { getPlatformCategories, createCategoryMapping } from '@/api/product/category'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  category?: LocalCategory
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const localCategory = computed(() => props.category)
const selectedPlatform = ref('')
const searchQuery = ref('')
const platformCategories = ref<any[]>([])
const selectedCategory = ref<any>(null)

const treeRef = ref()
const treeProps = {
  label: 'name',
  children: 'children'
}

// 获取平台标签类型
const getPlatformTagType = (platform: string) => {
  const types: Record<string, string> = {
    shein: 'success',
    amazon: 'warning',
    shopify: 'info'
  }
  return types[platform] || 'info'
}

// 获取平台显示名称
const getPlatformLabel = (platform: string) => {
  const labels: Record<string, string> = {
    shein: 'Shein',
    amazon: 'Amazon',
    shopify: 'Shopify'
  }
  return labels[platform] || platform
}

// 处理平台切换
const handlePlatformChange = async (platform: string) => {
  selectedCategory.value = null
  searchQuery.value = ''
  try {
    const { data } = await getPlatformCategories(platform)
    platformCategories.value = data
  } catch (error) {
    ElMessage.error('获取平台分类失败')
  }
}

// 过滤节点
const filterNode = (value: string, data: any) => {
  if (!value) return true
  const searchValue = value.toLowerCase()
  return data.name.toLowerCase().includes(searchValue) ||
         data.originalId.toLowerCase().includes(searchValue)
}

// 监听搜索关键词变化
watch(searchQuery, (val) => {
  treeRef.value?.filter(val)
})

// 处理分类选择
const handleCategorySelect = (data: any) => {
  selectedCategory.value = data
}

// 处理确认映射
const handleConfirm = async () => {
  if (!localCategory.value || !selectedCategory.value) return

  try {
    await createCategoryMapping(localCategory.value.id, {
      platformCategoryId: selectedCategory.value.originalId,
      platform: selectedPlatform.value,
      platformCategoryName: selectedCategory.value.name
    })
    ElMessage.success('映射成功')
    visible.value = false
    emit('success')
  } catch (error) {
    ElMessage.error('映射失败')
  }
}
</script>

<style scoped lang="scss">
.mapping-container {
  .local-category-info {
    padding: 16px;
    margin-bottom: 20px;
    background-color: var(--el-fill-color-lighter);
    border-radius: 4px;

    .info-item {
      display: flex;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 100px;
        color: var(--el-text-color-secondary);
      }

      .value {
        flex: 1;
        color: var(--el-text-color-primary);
      }
    }
  }

  .platform-selector {
    margin-bottom: 20px;
    text-align: center;
  }

  .platform-categories {
    .search-bar {
      margin-bottom: 16px;
    }

    .categories-tree {
      height: 300px;
      overflow-y: auto;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 14px;

        .category-id {
          margin-left: 8px;
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .selected-category {
      margin-top: 16px;
      padding: 12px;
      background-color: var(--el-fill-color-lighter);
      border-radius: 4px;

      .title {
        margin-bottom: 8px;
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }

      .content {
        display: flex;
        align-items: center;
        gap: 8px;

        .selected-name {
          font-weight: 500;
        }

        .selected-id {
          color: var(--el-text-color-secondary);
          font-size: 13px;
        }
      }
    }
  }
}
</style>
