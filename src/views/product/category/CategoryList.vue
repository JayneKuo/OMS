<template>
  <div class="category-list-container">
    <!-- Header with Actions -->
    <div class="header-bar">
      <div class="breadcrumb-area">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click="navigateTo(null)">All Categories</el-breadcrumb-item>
          <el-breadcrumb-item 
            v-for="(item, index) in breadcrumbs" 
            :key="item.id"
            @click="navigateTo(item, index)"
          >
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="handleAddCategory">
          <el-icon><Plus /></el-icon>Add Category
        </el-button>
        <el-button type="warning" @click="handleSync">
          <el-icon><RefreshRight /></el-icon>Sync
        </el-button>
      </div>
    </div>

    <!-- Statistics Bar -->
    <div class="stats-bar">
      <div class="stats-summary">
        <div class="stat-item">
          <span class="label">Total:</span>
          <span class="value">{{ stats.total }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Mapped:</span>
          <span class="value success">{{ stats.mapped }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Unmapped:</span>
          <span class="value warning">{{ stats.unmapped }}</span>
        </div>
      </div>
      <div class="sync-info">
        <span class="sync-time">Last Sync: {{ formatDate(stats.lastSyncTime, 'short') }}</span>
        <el-tag 
          size="small" 
          :type="stats.syncStatus === 'success' ? 'success' : 'danger'"
        >
          {{ stats.syncStatus === 'success' ? 'OK' : 'Failed' }}
        </el-tag>
      </div>
    </div>

    <!-- Level Navigation - Always show all 4 levels -->
    <div class="category-levels">
      <!-- Level 1 -->
      <div class="level-panel">
        <div class="panel-header">
          <h3>Level 1 Categories</h3>
          <el-input
            v-model="searchQueries.level1"
            placeholder="Search..."
            clearable
            size="small"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="panel-content">
          <div 
            v-for="category in filteredLevel1" 
            :key="category.id"
            class="category-item"
            :class="{ 'active': isSelected(category, 1) }"
            @click="selectCategory(category, 1)"
          >
            <div class="item-content">
              <span class="name">{{ category.name }}</span>
              <span class="code">{{ category.code }}</span>
            </div>
            <div class="item-meta">
              <el-tag size="small" v-if="category.children?.length">
                {{ category.children.length }} sub
              </el-tag>
              <el-icon class="arrow" v-if="category.children?.length"><ArrowRight /></el-icon>
            </div>
          </div>
          <el-empty v-if="!filteredLevel1.length" description="No categories" :image-size="80" />
        </div>
      </div>

      <!-- Level 2 -->
      <div class="level-panel">
        <div class="panel-header">
          <h3>Level 2 Categories</h3>
          <el-input
            v-model="searchQueries.level2"
            placeholder="Search..."
            clearable
            size="small"
            :disabled="!selectedL1"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="panel-content">
          <template v-if="selectedL1">
            <div 
              v-for="category in filteredLevel2" 
              :key="category.id"
              class="category-item"
              :class="{ 'active': isSelected(category, 2) }"
              @click="selectCategory(category, 2)"
            >
              <div class="item-content">
                <span class="name">{{ category.name }}</span>
                <span class="code">{{ category.code }}</span>
              </div>
              <div class="item-meta">
                <el-tag size="small" v-if="category.children?.length">
                  {{ category.children.length }} sub
                </el-tag>
                <el-icon class="arrow" v-if="category.children?.length"><ArrowRight /></el-icon>
              </div>
            </div>
            <el-empty v-if="!filteredLevel2.length" description="No categories" :image-size="80" />
          </template>
          <div v-else class="placeholder-hint">
            <el-icon class="hint-icon"><ArrowLeft /></el-icon>
            <span>Select Level 1 category</span>
          </div>
        </div>
      </div>

      <!-- Level 3 -->
      <div class="level-panel">
        <div class="panel-header">
          <h3>Level 3 Categories</h3>
          <el-input
            v-model="searchQueries.level3"
            placeholder="Search..."
            clearable
            size="small"
            :disabled="!selectedL2"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="panel-content">
          <template v-if="selectedL2">
            <div 
              v-for="category in filteredLevel3" 
              :key="category.id"
              class="category-item"
              :class="{ 'active': isSelected(category, 3) }"
              @click="selectCategory(category, 3)"
            >
              <div class="item-content">
                <span class="name">{{ category.name }}</span>
                <span class="code">{{ category.code }}</span>
              </div>
              <div class="item-meta">
                <el-tag size="small" v-if="category.children?.length">
                  {{ category.children.length }} sub
                </el-tag>
                <el-icon class="arrow" v-if="category.children?.length"><ArrowRight /></el-icon>
              </div>
            </div>
            <el-empty v-if="!filteredLevel3.length" description="No categories" :image-size="80" />
          </template>
          <div v-else class="placeholder-hint">
            <el-icon class="hint-icon"><ArrowLeft /></el-icon>
            <span>Select Level 2 category</span>
          </div>
        </div>
      </div>

      <!-- Level 4 -->
      <div class="level-panel">
        <div class="panel-header">
          <h3>Level 4 Categories</h3>
          <el-input
            v-model="searchQueries.level4"
            placeholder="Search..."
            clearable
            size="small"
            :disabled="!selectedL3"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="panel-content">
          <template v-if="selectedL3">
            <div 
              v-for="category in filteredLevel4" 
              :key="category.id"
              class="category-item leaf"
              :class="{ 'active': isSelected(category, 4) }"
              @click="selectCategory(category, 4)"
            >
              <div class="item-content">
                <span class="name">{{ category.name }}</span>
                <span class="code">{{ category.code }}</span>
              </div>
            </div>
            <el-empty v-if="!filteredLevel4.length" description="No categories" :image-size="80" />
          </template>
          <div v-else class="placeholder-hint">
            <el-icon class="hint-icon"><ArrowLeft /></el-icon>
            <span>Select Level 3 category</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Panel - Show when leaf node selected -->
    <div class="detail-panel" v-if="selectedLeaf">
      <div class="detail-header">
        <div class="header-left">
          <h3>{{ selectedLeaf.name }}</h3>
          <span class="code-display">{{ selectedLeaf.code }}</span>
        </div>
        <el-tag :type="selectedLeaf.status === 'active' ? 'success' : 'info'" size="small">
          {{ selectedLeaf.status === 'active' ? 'Active' : 'Inactive' }}
        </el-tag>
      </div>
      
      <div class="detail-content">
        <div class="mapping-section">
          <h4>Platform Mappings</h4>
          <div class="mappings-list">
            <div 
              v-for="platform in platforms" 
              :key="platform.value"
              class="mapping-item"
            >
              <span class="platform-name">{{ platform.label }}:</span>
              <span class="mapping-value" v-if="getMapping(selectedLeaf, platform.value)">
                {{ getMapping(selectedLeaf, platform.value)?.platformCategoryName }}
                <el-tag size="small">{{ getMapping(selectedLeaf, platform.value)?.platformCategoryId }}</el-tag>
              </span>
              <span class="mapping-value empty" v-else>Not mapped</span>
            </div>
          </div>
        </div>

        <div class="action-section">
          <el-button type="primary" size="large" @click="handleMapping(selectedLeaf)">
            <el-icon><Link /></el-icon>
            Manage Platform Mappings
          </el-button>
        </div>
      </div>
    </div>

    <!-- Add Category Dialog -->
    <el-dialog
      v-model="addDialog.visible"
      title="Add Category"
      width="550px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addFormRef"
        :model="addDialog.form"
        :rules="addDialog.rules"
        label-width="130px"
      >
        <el-form-item label="Category Type" prop="type">
          <el-radio-group v-model="addDialog.form.type" @change="handleTypeChange">
            <el-radio label="parent">Parent Category (Level 1)</el-radio>
            <el-radio label="child">Child Category</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Parent Category" prop="parentId" v-if="addDialog.form.type === 'child'">
          <el-cascader
            v-model="addDialog.form.parentId"
            :options="getCategoryTreeOptions()"
            :props="{
              value: 'id',
              label: 'name',
              children: 'children',
              checkStrictly: true,
              emitPath: false
            }"
            placeholder="Select parent category"
            clearable
            style="width: 100%"
            @change="handleParentChange"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span style="color: var(--el-text-color-secondary); margin-left: 8px; font-size: 12px;">
                (L{{ data.level }})
              </span>
            </template>
          </el-cascader>
        </el-form-item>

        <el-alert
          v-if="addDialog.form.type === 'child' && selectedParentLevel >= 4"
          title="Cannot add subcategory: Maximum level (4) reached"
          type="warning"
          :closable="false"
          style="margin-bottom: 16px;"
        />

        <el-form-item 
          v-if="addDialog.form.type === 'child' && addDialog.form.parentId"
          label="New Level"
        >
          <el-tag type="info">Level {{ selectedParentLevel + 1 }}</el-tag>
          <span style="margin-left: 8px; color: var(--el-text-color-secondary); font-size: 13px;">
            {{ getSelectedParentPath() }}
          </span>
        </el-form-item>

        <el-form-item label="Category Name" prop="name">
          <el-input 
            v-model="addDialog.form.name"
            placeholder="Enter category name"
          />
        </el-form-item>

        <el-form-item label="Category Code" prop="code">
          <el-input v-model="addDialog.form.code" placeholder="Enter category code">
            <template #append>
              <el-button @click="generateCode">Generate</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="Status" prop="status">
          <el-switch
            v-model="addDialog.form.status"
            active-value="active"
            inactive-value="inactive"
            active-text="Active"
            inactive-text="Inactive"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialog.visible = false">Cancel</el-button>
        <el-button 
          type="primary" 
          @click="confirmAdd"
          :disabled="addDialog.form.type === 'child' && (!addDialog.form.parentId || selectedParentLevel >= 4)"
        >
          Confirm
        </el-button>
      </template>
    </el-dialog>

    <!-- Mapping Dialog -->
    <category-mapping-dialog
      v-model="mappingDialog.visible"
      :category="mappingDialog.category"
      @success="handleMappingSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, RefreshRight, Plus, ArrowRight, ArrowLeft, Link } from '@element-plus/icons-vue'
import type {
  LocalCategory,
  CategoryQueryParams,
  CategoryStats,
  PlatformType
} from '../types/category'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryMappingDialog from '../components/CategoryMappingDialog.vue'
import { defaultCategories, getCategoryStatistics } from './mock'

const router = useRouter()

// State
const loading = ref(false)
const categoryTree = ref<LocalCategory[]>([])

// Selected categories at each level
const selectedL1 = ref<LocalCategory | null>(null)
const selectedL2 = ref<LocalCategory | null>(null)
const selectedL3 = ref<LocalCategory | null>(null)
const selectedL4 = ref<LocalCategory | null>(null)

// Search queries for each level
const searchQueries = reactive({
  level1: '',
  level2: '',
  level3: '',
  level4: ''
})

// Breadcrumbs
const breadcrumbs = computed(() => {
  const crumbs: LocalCategory[] = []
  if (selectedL1.value) crumbs.push(selectedL1.value)
  if (selectedL2.value) crumbs.push(selectedL2.value)
  if (selectedL3.value) crumbs.push(selectedL3.value)
  if (selectedL4.value) crumbs.push(selectedL4.value)
  return crumbs
})

// Current leaf node (for detail display)
const selectedLeaf = computed(() => {
  // Check if current selection is a leaf node (no children)
  if (selectedL4.value) return selectedL4.value
  if (selectedL3.value && !selectedL3.value.children?.length) return selectedL3.value
  if (selectedL2.value && !selectedL2.value.children?.length) return selectedL2.value
  if (selectedL1.value && !selectedL1.value.children?.length) return selectedL1.value
  return null
})

// Filter categories for each level
const filteredLevel1 = computed(() => {
  return filterCategories(categoryTree.value, searchQueries.level1)
})

const filteredLevel2 = computed(() => {
  if (!selectedL1.value?.children) return []
  return filterCategories(selectedL1.value.children, searchQueries.level2)
})

const filteredLevel3 = computed(() => {
  if (!selectedL2.value?.children) return []
  return filterCategories(selectedL2.value.children, searchQueries.level3)
})

const filteredLevel4 = computed(() => {
  if (!selectedL3.value?.children) return []
  return filterCategories(selectedL3.value.children, searchQueries.level4)
})

// Helper function to filter categories
const filterCategories = (categories: LocalCategory[], query: string) => {
  if (!query) return categories
  const lowerQuery = query.toLowerCase()
  return categories.filter(cat => 
    cat.name.toLowerCase().includes(lowerQuery) || 
    cat.code.toLowerCase().includes(lowerQuery)
  )
}

// Check if category is selected
const isSelected = (category: LocalCategory, level: number) => {
  switch (level) {
    case 1: return selectedL1.value?.id === category.id
    case 2: return selectedL2.value?.id === category.id
    case 3: return selectedL3.value?.id === category.id
    case 4: return selectedL4.value?.id === category.id
    default: return false
  }
}

// Select category (toggle selection)
const selectCategory = (category: LocalCategory, level: number) => {
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

// Navigate breadcrumb
const navigateTo = (category: LocalCategory | null, index?: number) => {
  if (!category) {
    // Go to root
    selectedL1.value = null
    selectedL2.value = null
    selectedL3.value = null
    selectedL4.value = null
    return
  }

  // Navigate to specific level
  if (index === 0) {
    selectedL2.value = null
    selectedL3.value = null
    selectedL4.value = null
  } else if (index === 1) {
    selectedL3.value = null
    selectedL4.value = null
  } else if (index === 2) {
    selectedL4.value = null
  }
}

// Platform options
const platforms = [
  { label: 'Shein', value: 'shein' },
  { label: 'Amazon', value: 'amazon' },
  { label: 'Shopify', value: 'shopify' }
]

// Statistics
const stats = reactive<CategoryStats>({
  total: 0,
  mapped: 0,
  unmapped: 0,
  pending: 0,
  lastSyncTime: '',
  syncStatus: 'success',
  byPlatform: {
    shein: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
    amazon: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
    shopify: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
    local: { total: 0, mapped: 0, unmapped: 0, pending: 0 }
  },
  byStatus: {
    active: 0,
    inactive: 0,
    pending: 0,
    deleted: 0
  }
})

// Load categories
const loadCategories = async () => {
  loading.value = true
  try {
    categoryTree.value = defaultCategories
  } catch (error) {
    ElMessage.error('Failed to load categories')
  } finally {
    loading.value = false
  }
}

// Load statistics
const loadStats = async () => {
  try {
    const mockStats = getCategoryStatistics()
    Object.assign(stats, mockStats)
  } catch (error) {
    ElMessage.error('Failed to load statistics')
  }
}

// Format date
const formatDate = (date?: string, format: 'full' | 'short' = 'full') => {
  if (!date) return '-'
  const d = new Date(date)
  if (format === 'short') {
    return d.toLocaleDateString('en-US')
  }
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get mapping for platform
const getMapping = (category: LocalCategory, platform: string) => {
  return category.mappings?.find(m => m.platform === platform)
}

// Add dialog
const addFormRef = ref<any>()
const addDialog = reactive({
  visible: false,
  form: {
    type: 'parent' as 'parent' | 'child',
    parentId: '',
    name: '',
    code: '',
    status: 'active' as 'active' | 'inactive'
  },
  rules: {
    name: [
      { required: true, message: 'Please enter category name', trigger: 'blur' },
      { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' }
    ],
    code: [
      { required: true, message: 'Please enter category code', trigger: 'blur' },
      { pattern: /^[A-Z0-9-_]+$/, message: 'Only uppercase letters, numbers, hyphens and underscores', trigger: 'blur' }
    ]
  }
})

// Selected parent level for add dialog
const selectedParentLevel = ref(0)
const selectedParentCategory = ref<LocalCategory | null>(null)

// Get category tree options for cascader
const getCategoryTreeOptions = () => {
  // Filter out level 4 categories (can't have children)
  const filterTree = (categories: LocalCategory[]): any[] => {
    return categories
      .filter(cat => cat.level < 4)
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        level: cat.level,
        children: cat.children?.length ? filterTree(cat.children) : undefined
      }))
  }
  return filterTree(categoryTree.value)
}

// Find category by id in tree
const findCategoryById = (categories: LocalCategory[], id: string): LocalCategory | null => {
  for (const cat of categories) {
    if (cat.id === id) return cat
    if (cat.children?.length) {
      const found = findCategoryById(cat.children, id)
      if (found) return found
    }
  }
  return null
}

// Get selected parent path
const getSelectedParentPath = () => {
  if (!addDialog.form.parentId) return ''
  const parent = findCategoryById(categoryTree.value, addDialog.form.parentId)
  if (!parent) return ''
  
  const path: string[] = []
  const buildPath = (cat: LocalCategory) => {
    path.unshift(cat.name)
    if (cat.parentId) {
      const parentCat = findCategoryById(categoryTree.value, cat.parentId)
      if (parentCat) buildPath(parentCat)
    }
  }
  buildPath(parent)
  return path.join(' > ')
}

// Handle type change
const handleTypeChange = () => {
  addDialog.form.parentId = ''
  selectedParentLevel.value = 0
  selectedParentCategory.value = null
}

// Handle parent change
const handleParentChange = (value: string) => {
  if (!value) {
    selectedParentLevel.value = 0
    selectedParentCategory.value = null
    return
  }
  
  const parent = findCategoryById(categoryTree.value, value)
  if (parent) {
    selectedParentLevel.value = parent.level
    selectedParentCategory.value = parent
  }
}

// Get current selected category (any level)
const getCurrentSelectedCategory = () => {
  if (selectedL4.value) return selectedL4.value
  if (selectedL3.value) return selectedL3.value
  if (selectedL2.value) return selectedL2.value
  if (selectedL1.value) return selectedL1.value
  return null
}

// Handle add category
const handleAddCategory = () => {
  const currentCategory = getCurrentSelectedCategory()
  
  // If a category is selected and it's not level 4, default to child category
  if (currentCategory && currentCategory.level < 4) {
    addDialog.form = {
      type: 'child',
      parentId: currentCategory.id,
      name: '',
      code: '',
      status: 'active'
    }
    selectedParentLevel.value = currentCategory.level
    selectedParentCategory.value = currentCategory
  } else {
    // Otherwise, default to parent category
    addDialog.form = {
      type: 'parent',
      parentId: '',
      name: '',
      code: '',
      status: 'active'
    }
    selectedParentLevel.value = 0
    selectedParentCategory.value = null
  }
  
  addDialog.visible = true
}

// Generate code
const generateCode = () => {
  if (!addDialog.form.name) {
    ElMessage.warning('Please enter category name first')
    return
  }
  addDialog.form.code = addDialog.form.name.toUpperCase().replace(/\s+/g, '_')
}

// Confirm add
const confirmAdd = async () => {
  if (!addFormRef.value) return
  
  await addFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const { type, parentId, name, code, status } = addDialog.form
      
      let level = 1
      let parentCategory: LocalCategory | null = null
      
      if (type === 'child') {
        if (!parentId) {
          ElMessage.warning('Please select parent category')
          return
        }
        
        parentCategory = findCategoryById(categoryTree.value, parentId)
        if (!parentCategory) {
          ElMessage.error('Parent category not found')
          return
        }
        
        if (parentCategory.level >= 4) {
          ElMessage.warning('Cannot add subcategory: Maximum level reached')
          return
        }
        
        level = parentCategory.level + 1
      }
      
      const newCategory: LocalCategory = {
        id: Date.now().toString(),
        name,
        code,
        parentId: type === 'child' ? parentId : undefined,
        level,
        path: parentId ? `${parentId}/${name}` : `/${name}`,
        sort: 1,
        status,
        source: 'local',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        operator: 'system',
        children: []
      }
      
      if (type === 'parent') {
        categoryTree.value.push(newCategory)
      } else {
        if (parentCategory) {
          if (!parentCategory.children) {
            parentCategory.children = []
          }
          parentCategory.children.push(newCategory)
        }
      }
      
      addDialog.visible = false
      ElMessage.success('Category added successfully')
      loadStats()
    }
  })
}

// Handle sync
const handleSync = async () => {
  try {
    await ElMessageBox.confirm(
      'Sync platform categories? This may take some time.',
      'Sync Confirmation',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    loading.value = true
    setTimeout(() => {
      ElMessage.success('Sync completed successfully')
      loadCategories()
      loadStats()
      loading.value = false
    }, 1000)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Sync failed')
    }
  }
}

// Mapping dialog
const mappingDialog = reactive({
  visible: false,
  category: null as LocalCategory | null
})

// Handle mapping
const handleMapping = (category: LocalCategory) => {
  mappingDialog.category = category
  mappingDialog.visible = true
}

// Handle mapping success
const handleMappingSuccess = () => {
  loadCategories()
  loadStats()
}


// Initialize
onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadStats()
  ])
})
</script>

<style scoped lang="scss">
.category-list-container {
  padding: 16px;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;

  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .breadcrumb-area {
      flex: 1;
      
      :deep(.el-breadcrumb__item) {
        cursor: pointer;
        
        &:hover .el-breadcrumb__inner {
          color: var(--el-color-primary);
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }
  }

  .stats-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    margin-bottom: 16px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    font-size: 13px;

    .stats-summary {
      display: flex;
      gap: 20px;
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        
        .label {
          color: var(--el-text-color-secondary);
          font-weight: 500;
        }
        
        .value {
          font-weight: 600;
          color: var(--el-text-color-primary);
          
          &.success {
            color: var(--el-color-success);
          }
          
          &.warning {
            color: var(--el-color-warning);
          }
        }
      }
    }

    .sync-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .sync-time {
        color: var(--el-text-color-secondary);
        font-size: 12px;
      }
    }
  }

  .category-levels {
    display: flex;
    gap: 12px;
    flex: 1;
    overflow: hidden;

    .level-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--el-bg-color);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 4px;
      overflow: hidden;

      .panel-header {
        padding: 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background-color: var(--el-fill-color-light);

        h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .el-input {
          width: 100%;
        }
      }

      .panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 8px;

        .placeholder-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 200px;
          color: var(--el-text-color-placeholder);
          font-size: 13px;
          gap: 8px;

          .hint-icon {
            font-size: 32px;
            opacity: 0.5;
          }
        }

        .category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          margin-bottom: 4px;
          background-color: var(--el-fill-color-blank);
          border: 1px solid var(--el-border-color-lighter);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background-color: var(--el-fill-color-light);
            border-color: var(--el-border-color);
          }

          &.active {
            background-color: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);
            
            .name {
              color: var(--el-color-primary);
              font-weight: 600;
            }
          }

          &.leaf {
            border-left: 3px solid var(--el-color-success);
          }

          .item-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;

            .name {
              font-size: 13px;
              font-weight: 500;
              color: var(--el-text-color-primary);
            }

            .code {
              font-size: 11px;
              color: var(--el-text-color-placeholder);
              font-family: monospace;
            }
          }

          .item-meta {
            display: flex;
            align-items: center;
            gap: 6px;

            .arrow {
              color: var(--el-text-color-placeholder);
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .detail-panel {
    margin-top: 12px;
    padding: 16px;
    background-color: var(--el-fill-color-light);
    border: 2px solid var(--el-color-primary-light-5);
    border-radius: 4px;

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .code-display {
          font-size: 12px;
          font-family: monospace;
          color: var(--el-text-color-secondary);
          padding: 2px 8px;
          background-color: var(--el-fill-color);
          border-radius: 3px;
        }
      }
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .mapping-section {
        h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .mappings-list {
          background-color: var(--el-bg-color);
          border-radius: 4px;
          padding: 12px;
          
          .mapping-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid var(--el-border-color-lighter);
            font-size: 13px;

            &:last-child {
              border-bottom: none;
            }

            .platform-name {
              font-weight: 600;
              color: var(--el-text-color-secondary);
              min-width: 80px;
            }

            .mapping-value {
              flex: 1;
              text-align: right;
              color: var(--el-text-color-primary);
              font-size: 13px;

              &.empty {
                color: var(--el-text-color-placeholder);
                font-style: italic;
              }

              .el-tag {
                margin-left: 8px;
                font-family: monospace;
                font-size: 11px;
              }
            }
          }
        }
      }

      .action-section {
        display: flex;
        justify-content: center;
        padding-top: 8px;

        .el-button {
          min-width: 240px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
