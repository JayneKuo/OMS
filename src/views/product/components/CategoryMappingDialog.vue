<template>
  <el-dialog
    v-model="visible"
    :title="'Map Category: ' + localCategory?.name"
    width="1200px"
    top="5vh"
  >
    <div class="mapping-container">
      <!-- Local Category Info -->
      <div class="local-category-info">
        <div class="info-item">
          <span class="label">Category Name:</span>
          <span class="value">{{ localCategory?.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">Category Code:</span>
          <span class="value">{{ localCategory?.code }}</span>
        </div>
        <div class="info-item">
          <span class="label">Category Path:</span>
          <span class="value">{{ localCategory?.path }}</span>
        </div>
      </div>

      <!-- Platform Selection -->
      <div class="platform-selector">
        <el-radio-group v-model="selectedPlatform" @change="handlePlatformChange">
          <el-radio-button label="shein">Shein</el-radio-button>
          <el-radio-button label="amazon">Amazon</el-radio-button>
          <el-radio-button label="shopify">Shopify</el-radio-button>
        </el-radio-group>
      </div>

      <!-- Level Navigation -->
      <div v-if="selectedPlatform" class="level-navigation">
        <!-- Level 1 -->
        <div class="level-panel">
          <div class="panel-header">
            <h4>Level 1</h4>
            <span class="count">{{ filteredLevel1.length }}</span>
          </div>
          <div class="search-box">
            <el-input
              v-model="searchQueries.level1"
              placeholder="Search..."
              size="small"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="category-list">
            <div
              v-for="category in filteredLevel1"
              :key="category.id"
              :class="['category-item', { active: selectedL1?.id === category.id }]"
              @click="selectCategory(category, 1)"
            >
              <div class="category-name">{{ category.name }}</div>
              <div class="category-code">{{ category.originalId }}</div>
            </div>
            <el-empty v-if="!filteredLevel1.length" description="No categories" :image-size="60" />
          </div>
        </div>

        <!-- Level 2 -->
        <div class="level-panel" v-if="selectedL1">
          <div class="panel-header">
            <h4>Level 2</h4>
            <span class="count">{{ filteredLevel2.length }}</span>
          </div>
          <div class="search-box">
            <el-input
              v-model="searchQueries.level2"
              placeholder="Search..."
              size="small"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="category-list">
            <div
              v-for="category in filteredLevel2"
              :key="category.id"
              :class="['category-item', { active: selectedL2?.id === category.id }]"
              @click="selectCategory(category, 2)"
            >
              <div class="category-name">{{ category.name }}</div>
              <div class="category-code">{{ category.originalId }}</div>
            </div>
            <el-empty v-if="!filteredLevel2.length" description="No categories" :image-size="60" />
          </div>
        </div>

        <!-- Level 3 -->
        <div class="level-panel" v-if="selectedL2">
          <div class="panel-header">
            <h4>Level 3</h4>
            <span class="count">{{ filteredLevel3.length }}</span>
          </div>
          <div class="search-box">
            <el-input
              v-model="searchQueries.level3"
              placeholder="Search..."
              size="small"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="category-list">
            <div
              v-for="category in filteredLevel3"
              :key="category.id"
              :class="['category-item', { active: selectedL3?.id === category.id }]"
              @click="selectCategory(category, 3)"
            >
              <div class="category-name">{{ category.name }}</div>
              <div class="category-code">{{ category.originalId }}</div>
            </div>
            <el-empty v-if="!filteredLevel3.length" description="No categories" :image-size="60" />
          </div>
        </div>

        <!-- Level 4 -->
        <div class="level-panel" v-if="selectedL3">
          <div class="panel-header">
            <h4>Level 4</h4>
            <span class="count">{{ filteredLevel4.length }}</span>
          </div>
          <div class="search-box">
            <el-input
              v-model="searchQueries.level4"
              placeholder="Search..."
              size="small"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="category-list">
            <div
              v-for="category in filteredLevel4"
              :key="category.id"
              :class="['category-item', { active: selectedL4?.id === category.id }]"
              @click="selectCategory(category, 4)"
            >
              <div class="category-name">{{ category.name }}</div>
              <div class="category-code">{{ category.originalId }}</div>
            </div>
            <el-empty v-if="!filteredLevel4.length" description="No categories" :image-size="60" />
          </div>
        </div>
      </div>

      <!-- Selected Category Info -->
      <div v-if="selectedCategory" class="selected-category-info">
        <el-alert type="success" :closable="false">
          <template #title>
            <div class="selected-info">
              <span class="label">Selected:</span>
              <el-tag :type="getPlatformTagType(selectedPlatform)" size="small">
                {{ getPlatformLabel(selectedPlatform) }}
              </el-tag>
              <span class="selected-name">{{ selectedCategory.name }}</span>
              <span class="selected-code">({{ selectedCategory.originalId }})</span>
              <span class="selected-path">{{ selectedCategory.path }}</span>
            </div>
          </template>
        </el-alert>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button
          type="primary"
          :disabled="!selectedCategory"
          @click="handleConfirm"
        >
          Confirm Mapping
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
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
const platformCategories = ref<any[]>([])

// Level selections
const selectedL1 = ref<any>(null)
const selectedL2 = ref<any>(null)
const selectedL3 = ref<any>(null)
const selectedL4 = ref<any>(null)

// Search queries for each level
const searchQueries = reactive({
  level1: '',
  level2: '',
  level3: '',
  level4: ''
})

// Get platform tag type
const getPlatformTagType = (platform: string) => {
  const types: Record<string, string> = {
    shein: 'success',
    amazon: 'warning',
    shopify: 'info'
  }
  return types[platform] || 'info'
}

// Get platform display label
const getPlatformLabel = (platform: string) => {
  const labels: Record<string, string> = {
    shein: 'Shein',
    amazon: 'Amazon',
    shopify: 'Shopify'
  }
  return labels[platform] || platform
}

// Handle platform change
const handlePlatformChange = async (platform: string) => {
  // Reset all selections
  selectedL1.value = null
  selectedL2.value = null
  selectedL3.value = null
  selectedL4.value = null
  searchQueries.level1 = ''
  searchQueries.level2 = ''
  searchQueries.level3 = ''
  searchQueries.level4 = ''
  
  try {
    const { data } = await getPlatformCategories(platform)
    platformCategories.value = data
  } catch (error) {
    ElMessage.error('Failed to load platform categories')
  }
}

// Computed: Filtered Level 1
const filteredLevel1 = computed(() => {
  if (!platformCategories.value) return []
  const query = searchQueries.level1.toLowerCase()
  if (!query) return platformCategories.value
  return platformCategories.value.filter(cat => 
    cat.name.toLowerCase().includes(query) || 
    cat.originalId.toLowerCase().includes(query)
  )
})

// Computed: Filtered Level 2
const filteredLevel2 = computed(() => {
  if (!selectedL1.value?.children) return []
  const query = searchQueries.level2.toLowerCase()
  if (!query) return selectedL1.value.children
  return selectedL1.value.children.filter((cat: any) => 
    cat.name.toLowerCase().includes(query) || 
    cat.originalId.toLowerCase().includes(query)
  )
})

// Computed: Filtered Level 3
const filteredLevel3 = computed(() => {
  if (!selectedL2.value?.children) return []
  const query = searchQueries.level3.toLowerCase()
  if (!query) return selectedL2.value.children
  return selectedL2.value.children.filter((cat: any) => 
    cat.name.toLowerCase().includes(query) || 
    cat.originalId.toLowerCase().includes(query)
  )
})

// Computed: Filtered Level 4
const filteredLevel4 = computed(() => {
  if (!selectedL3.value?.children) return []
  const query = searchQueries.level4.toLowerCase()
  if (!query) return selectedL3.value.children
  return selectedL3.value.children.filter((cat: any) => 
    cat.name.toLowerCase().includes(query) || 
    cat.originalId.toLowerCase().includes(query)
  )
})

// Select category at any level
const selectCategory = (category: any, level: number) => {
  switch (level) {
    case 1:
      // Toggle: if already selected, deselect
      if (selectedL1.value?.id === category.id) {
        selectedL1.value = null
      } else {
        selectedL1.value = category
      }
      // Clear child selections
      selectedL2.value = null
      selectedL3.value = null
      selectedL4.value = null
      break
    case 2:
      // Toggle: if already selected, deselect
      if (selectedL2.value?.id === category.id) {
        selectedL2.value = null
      } else {
        selectedL2.value = category
      }
      // Clear child selections
      selectedL3.value = null
      selectedL4.value = null
      break
    case 3:
      // Toggle: if already selected, deselect
      if (selectedL3.value?.id === category.id) {
        selectedL3.value = null
      } else {
        selectedL3.value = category
      }
      // Clear child selection
      selectedL4.value = null
      break
    case 4:
      // Toggle: if already selected, deselect
      if (selectedL4.value?.id === category.id) {
        selectedL4.value = null
      } else {
        selectedL4.value = category
      }
      break
  }
}

// Get currently selected category (any level)
const selectedCategory = computed(() => {
  if (selectedL4.value) return selectedL4.value
  if (selectedL3.value) return selectedL3.value
  if (selectedL2.value) return selectedL2.value
  if (selectedL1.value) return selectedL1.value
  return null
})

// Handle confirm mapping
const handleConfirm = async () => {
  if (!localCategory.value || !selectedCategory.value) return

  try {
    await createCategoryMapping(localCategory.value.id, {
      platformCategoryId: selectedCategory.value.originalId,
      platform: selectedPlatform.value,
      platformCategoryName: selectedCategory.value.name
    })
    ElMessage.success('Mapping successful')
    visible.value = false
    emit('success')
  } catch (error) {
    ElMessage.error('Mapping failed')
  }
}
</script>

<style scoped lang="scss">
.mapping-container {
  .local-category-info {
    padding: 12px 16px;
    margin-bottom: 16px;
    background-color: var(--el-fill-color-lighter);
    border-radius: 4px;
    display: flex;
    gap: 24px;

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .label {
        color: var(--el-text-color-secondary);
        font-size: 13px;
      }

      .value {
        color: var(--el-text-color-primary);
        font-weight: 500;
      }
    }
  }

  .platform-selector {
    margin-bottom: 16px;
    text-align: center;
  }

  .level-navigation {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    height: 450px;

    .level-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--el-border-color-light);
      border-radius: 4px;
      background: var(--el-bg-color);
      overflow: hidden;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: var(--el-fill-color-lighter);
        border-bottom: 1px solid var(--el-border-color-light);

        h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .count {
          padding: 2px 8px;
          background: var(--el-color-primary);
          color: white;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
        }
      }

      .search-box {
        padding: 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);
      }

      .category-list {
        flex: 1;
        overflow-y: auto;
        padding: 4px;

        .category-item {
          padding: 10px 12px;
          margin-bottom: 4px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;

          .category-name {
            font-size: 14px;
            color: var(--el-text-color-primary);
            margin-bottom: 4px;
          }

          .category-code {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }

          &:hover {
            background: var(--el-fill-color-light);
            border-color: var(--el-border-color);
          }

          &.active {
            background: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);

            .category-name {
              color: var(--el-color-primary);
              font-weight: 600;
            }
          }
        }

        :deep(.el-empty) {
          padding: 20px 0;
        }
      }
    }
  }

  .selected-category-info {
    margin-bottom: 16px;

    .selected-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;

      .label {
        font-weight: 600;
      }

      .selected-name {
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .selected-code {
        color: var(--el-text-color-secondary);
      }

      .selected-path {
        color: var(--el-text-color-regular);
        font-size: 13px;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
