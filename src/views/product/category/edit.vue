<template>
  <div class="category-edit-container">
    <page-header
      :title="isEdit ? 'Edit Category' : 'Add Category'"
      :back="{ name: 'ProductCategory' }"
    />

    <el-card class="edit-form">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        class="category-form"
      >
        <!-- Parent Category Selection -->
        <el-form-item label="Parent Category">
          <div class="parent-category">
            <div class="selected-path">
              <template v-if="selectedPath.length">
                <el-tag 
                  v-for="(category, index) in selectedPath" 
                  :key="category.id"
                  :type="index === selectedPath.length - 1 ? 'primary' : ''"
                  class="path-tag"
                >
                  {{ category.name }}
                </el-tag>
              </template>
              <span v-else class="no-parent">Root Category</span>
            </div>
            <el-button type="primary" link @click="selectParentVisible = true">
              Select Parent
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="Category Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter category name" />
        </el-form-item>

        <el-form-item label="Category Code" prop="code">
          <el-input v-model="form.code" placeholder="Enter category code">
            <template #append>
              <el-button @click="generateCode">Generate</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="Sort Order" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>

        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">Active</el-radio>
            <el-radio label="inactive">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Enter category description"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">Save</el-button>
          <el-button @click="$router.back()">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Select Parent Category Dialog -->
    <el-dialog
      v-model="selectParentVisible"
      title="Select Parent Category"
      width="600px"
      destroy-on-close
    >
      <div class="category-tree">
        <div class="tree-search">
          <el-input
            v-model="searchQuery"
            placeholder="Search category"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="tree-content">
          <el-tree
            ref="treeRef"
            :data="categoryTree"
            :props="treeProps"
            :filter-node-method="filterNode"
            node-key="id"
            highlight-current
            @current-change="handleCategorySelect"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span class="level-tag">
                  <el-tag size="small" :type="getLevelType(data.level)">
                    {{ `L${data.level}` }}
                  </el-tag>
                </span>
              </div>
            </template>
          </el-tree>
        </div>

        <div class="selected-info" v-if="currentSelected">
          <div class="info-title">Selected Category:</div>
          <div class="info-content">
            <div class="info-item">
              <span class="label">Category Name:</span>
              <span class="value">{{ currentSelected.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Current Level:</span>
              <span class="value">Level {{ currentSelected.level }}</span>
            </div>
            <div class="info-item">
              <span class="label">New Level:</span>
              <span class="value">Level {{ currentSelected.level + 1 }}</span>
              <el-tag 
                size="small" 
                :type="currentSelected.level >= 4 ? 'danger' : 'success'"
                class="level-warning"
              >
                {{ currentSelected.level >= 4 ? 'Max level reached' : 'Can create subcategory' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
          <span class="dialog-footer">
            <el-button @click="selectParentVisible = false">Cancel</el-button>
            <el-button
              type="primary"
              :disabled="!canSelectParent"
              @click="handleParentConfirm"
            >
              Confirm
            </el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import type { LocalCategory } from '../types/category'
import { getCategoryTree, generateCategoryCode, checkCategoryCode, createCategory, getCategoryDetail, updateCategory } from '@/api/product/category'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

// Check if edit mode
const isEdit = computed(() => route.name === 'EditCategory')

// Form data
const form = ref({
  name: '',
  code: '',
  parentId: null as string | null,
  sort: 0,
  status: 'active' as 'active' | 'inactive',
  description: '',
  level: 1
})

// Form validation rules
const rules: FormRules = {
  name: [
    { required: true, message: 'Please enter category name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' }
  ],
  code: [
    { required: true, message: 'Please enter category code', trigger: 'blur' },
    { pattern: /^[A-Z0-9-_]+$/, message: 'Only uppercase letters, numbers, hyphens and underscores are allowed', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: 'Please enter sort order', trigger: 'blur' }
  ],
  status: [
    { required: true, message: 'Please select status', trigger: 'change' }
  ]
}

// Parent category selection
const selectParentVisible = ref(false)
const searchQuery = ref('')
const categoryTree = ref<LocalCategory[]>([])
const currentSelected = ref<LocalCategory | null>(null)
const selectedPath = ref<LocalCategory[]>([])

const treeRef = ref()
const treeProps = {
  label: 'name',
  children: 'children'
}

// Check if can select as parent
const canSelectParent = computed(() => {
  if (!currentSelected.value) return false
  return currentSelected.value.level < 4 // Max 4 levels
})

// Get level type
const getLevelType = (level: number) => {
  const types = ['', 'success', 'warning', 'danger', 'info']
  return types[level] || 'info'
}

// Filter node
const filterNode = (value: string, data: LocalCategory) => {
  if (!value) return true
  return data.name.toLowerCase().includes(value.toLowerCase())
}

// Watch search query
watch(searchQuery, (val) => {
  treeRef.value?.filter(val)
})

// Generate category code
const generateCode = async () => {
  if (!form.value.name) {
    ElMessage.warning('Please enter category name first')
    return
  }
  try {
    const { data } = await generateCategoryCode(form.value.name)
    form.value.code = data.code
  } catch (error) {
    ElMessage.error('Failed to generate code')
  }
}

// Handle category select
const handleCategorySelect = (data: LocalCategory) => {
  currentSelected.value = data
}

// Handle parent confirm
const handleParentConfirm = () => {
  if (!currentSelected.value || currentSelected.value.level >= 4) return
  
  // Update parent info
  form.value.parentId = currentSelected.value.id
  form.value.level = currentSelected.value.level + 1
  
  // Build selected path
  const path = []
  let current: LocalCategory | null = currentSelected.value
  while (current) {
    path.unshift(current)
    current = categoryTree.value.find(c => c.id === current?.parentId) || null
  }
  selectedPath.value = path
  
  selectParentVisible.value = false
}

// Handle submit
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updateCategory(route.params.id as string, form.value)
          ElMessage.success('Updated successfully')
        } else {
          await createCategory(form.value)
          ElMessage.success('Created successfully')
        }
        router.push({ name: 'ProductCategory' })
      } catch (error) {
        ElMessage.error(isEdit.value ? 'Failed to update' : 'Failed to create')
      }
    }
  })
}

// Initialize
const init = async () => {
  try {
    // Load category tree
    const { data } = await getCategoryTree()
    categoryTree.value = data

    // Load detail in edit mode
    if (isEdit.value && route.params.id) {
      const { data: detail } = await getCategoryDetail(route.params.id as string)
      Object.assign(form.value, detail)
      
      // Build selected path
      if (detail.parentId) {
        const path = []
        let current: LocalCategory | null = detail
        while (current) {
          path.unshift(current)
          current = categoryTree.value.find(c => c.id === current?.parentId) || null
        }
        selectedPath.value = path.slice(0, -1) // Exclude current category
      }
    }
  } catch (error) {
    ElMessage.error('Failed to load data')
  }
}

onMounted(init)
</script>

<style scoped lang="scss">
.category-edit-container {
  padding: 20px;

  .edit-form {
    margin-top: 20px;
    
    .category-form {
      max-width: 800px;
      margin: 0 auto;
    }
  }

  .parent-category {
    display: flex;
    align-items: center;
    gap: 16px;

    .selected-path {
      flex: 1;
      min-height: 32px;
      padding: 4px 8px;
      background-color: var(--el-fill-color-lighter);
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;

      .path-tag {
        cursor: default;
      }

      .no-parent {
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.category-tree {
  .tree-search {
    margin-bottom: 16px;
  }

  .tree-content {
    height: 300px;
    overflow-y: auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 8px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .selected-info {
    margin-top: 16px;
    padding: 12px;
    background-color: var(--el-fill-color-lighter);
    border-radius: 4px;

    .info-title {
      margin-bottom: 8px;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }

    .info-content {
      .info-item {
        display: flex;
        align-items: center;
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

        .level-warning {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>