<template>
  <div class="category-mapping">
    <el-dialog
      v-model="visible"
      title="分类映射管理"
      width="800px"
      :destroy-on-close="true"
    >
      <div class="mapping-container">
        <div class="mapping-source">
          <h3>本地分类</h3>
          <div class="category-info">
            <p><strong>名称：</strong>{{ localCategory?.name }}</p>
            <p><strong>ID：</strong>{{ localCategory?.id }}</p>
          </div>
        </div>

        <div class="mapping-platform">
          <div class="platform-header">
            <h3>平台分类映射</h3>
            <el-select v-model="selectedPlatform" placeholder="选择平台" @change="handlePlatformChange">
              <el-option label="Shein" value="shein" />
              <el-option label="Amazon" value="amazon" />
              <el-option label="Shopify" value="shopify" />
            </el-select>
          </div>

          <div class="platform-categories" v-if="selectedPlatform">
            <div class="table-header">
              <el-input
                v-model="searchQuery"
                placeholder="搜索分类"
                class="search-input"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <div class="batch-actions">
                <el-button
                  type="primary"
                  :disabled="!selectedCategories.length"
                  @click="handleBatchMap"
                >
                  批量映射 ({{ selectedCategories.length }})
                </el-button>
                <el-button
                  type="danger"
                  :disabled="!selectedCategories.length"
                  @click="handleBatchUnmap"
                >
                  批量取消
                </el-button>
              </div>
            </div>

            <el-table 
              :data="filteredPlatformCategories" 
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="platformCategoryName" label="平台分类名称">
                <template #default="{ row }">
                  <div class="category-name-cell">
                    <span>{{ row.platformCategoryName }}</span>
                    <el-tag 
                      v-if="row.mappingStatus === 'mapped'"
                      size="small"
                      type="success"
                    >
                      已映射
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="platformCategoryId" label="平台分类ID" width="120" />
              <el-table-column label="本地分类" width="200">
                <template #default="{ row }">
                  <div v-if="row.mappingStatus === 'mapped'" class="mapped-category">
                    {{ getMappedLocalCategory(row) }}
                  </div>
                  <el-select
                    v-else
                    v-model="row.localCategoryId"
                    placeholder="选择本地分类"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="category in localCategories"
                      :key="category.id"
                      :label="category.name"
                      :value="category.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button
                    link
                    type="primary"
                    @click="handleMap(row)"
                    v-if="row.mappingStatus !== 'mapped' && row.localCategoryId"
                  >
                    映射
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    @click="handleUnmap(row)"
                    v-if="row.mappingStatus === 'mapped'"
                  >
                    取消映射
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">关闭</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { CategoryData, PlatformMapping } from '../types'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
  category?: CategoryData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', mappings: PlatformMapping[]): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const localCategory = computed(() => props.category)
const selectedPlatform = ref('')
const platformCategories = ref<PlatformMapping[]>([])
const searchQuery = ref('')
const selectedCategories = ref<PlatformMapping[]>([])
const localCategories = ref<CategoryData[]>([])

// 搜索过滤
const filteredPlatformCategories = computed(() => {
  if (!searchQuery.value) return platformCategories.value
  const query = searchQuery.value.toLowerCase()
  return platformCategories.value.filter(category => 
    category.platformCategoryName.toLowerCase().includes(query) ||
    category.platformCategoryId.toLowerCase().includes(query)
  )
})

// 处理表格选择变化
const handleSelectionChange = (selection: PlatformMapping[]) => {
  selectedCategories.value = selection
}

// 获取已映射的本地分类名称
const getMappedLocalCategory = (row: PlatformMapping) => {
  const category = localCategories.value.find(c => c.id === row.localCategoryId)
  return category?.name || '-'
}

// 批量映射
const handleBatchMap = async () => {
  try {
    for (const category of selectedCategories.value) {
      if (category.localCategoryId && category.mappingStatus !== 'mapped') {
        await handleMap(category)
      }
    }
    ElMessage.success('批量映射成功')
  } catch (error) {
    ElMessage.error('批量映射失败')
  }
}

// 批量取消映射
const handleBatchUnmap = async () => {
  try {
    for (const category of selectedCategories.value) {
      if (category.mappingStatus === 'mapped') {
        await handleUnmap(category)
      }
    }
    ElMessage.success('批量取消映射成功')
  } catch (error) {
    ElMessage.error('批量取消映射失败')
  }
}

// 获取所有本地分类
const fetchLocalCategories = async () => {
  // TODO: 替换为实际的API调用
  localCategories.value = [
    { id: 1, name: '女装', parentId: null, sort: 1, status: 1 },
    { id: 2, name: '男装', parentId: null, sort: 2, status: 1 },
    // ... 更多分类
  ]
}

// 模拟从平台获取分类数据
const fetchPlatformCategories = async (platform: string) => {
  // TODO: 替换为实际的API调用
  return [
    {
      platformId: '1',
      platformName: platform,
      platformCategoryId: 'PC001',
      platformCategoryName: '女装',
      mappingStatus: 'unmapped' as const
    },
    {
      platformId: '2',
      platformName: platform,
      platformCategoryId: 'PC002',
      platformCategoryName: '男装',
      mappingStatus: 'unmapped' as const
    }
  ]
}

const handlePlatformChange = async (platform: string) => {
  try {
    platformCategories.value = await fetchPlatformCategories(platform)
    // 如果已有映射，更新状态
    if (localCategory.value?.platformMappings) {
      const existingMapping = localCategory.value.platformMappings.find(
        m => m.platformName === platform
      )
      if (existingMapping) {
        const index = platformCategories.value.findIndex(
          pc => pc.platformCategoryId === existingMapping.platformCategoryId
        )
        if (index !== -1) {
          platformCategories.value[index].mappingStatus = 'mapped'
        }
      }
    }
  } catch (error) {
    ElMessage.error('获取平台分类失败')
  }
}

const getMappingStatusType = (status: string) => {
  const types = {
    mapped: 'success',
    unmapped: 'info',
    pending: 'warning'
  }
  return types[status as keyof typeof types]
}

const getMappingStatusText = (status: string) => {
  const texts = {
    mapped: '已映射',
    unmapped: '未映射',
    pending: '待处理'
  }
  return texts[status as keyof typeof texts]
}

const handleMap = (category: PlatformMapping) => {
  category.mappingStatus = 'mapped'
  category.lastSyncTime = new Date().toISOString()
}

const handleUnmap = (category: PlatformMapping) => {
  category.mappingStatus = 'unmapped'
  delete category.lastSyncTime
}

const handleSave = () => {
  const mappedCategories = platformCategories.value.filter(
    c => c.mappingStatus === 'mapped'
  )
  emit('save', mappedCategories)
  visible.value = false
  ElMessage.success('映射保存成功')
}
</script>

<style scoped>
.mapping-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mapping-source {
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.category-info {
  margin-top: 12px;
}

.platform-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.platform-categories {
  margin-top: 16px;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .search-input {
      width: 240px;
    }

    .batch-actions {
      display: flex;
      gap: 8px;
    }
  }

  .category-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mapped-category {
    color: var(--el-text-color-regular);
    font-size: 14px;
  }
}
</style>
