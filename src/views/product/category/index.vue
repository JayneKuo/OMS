<template>
  <div class="category-container">
    <div class="category-header">
      <el-button type="primary" @click="handleAdd(null)">Add Root Category</el-button>
      <el-button type="success" @click="handleSyncFromThirdParty">
        <el-icon><Connection /></el-icon>
        Sync from Platform
      </el-button>
    </div>
    <div class="category-content">
      <el-tree
        ref="treeRef"
        :data="categoryList"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        class="custom-tree"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span class="actions">
              <el-button link type="primary" @click="handleAdd(data)">Add Sub</el-button>
              <el-button link type="primary" @click="handleEdit(data)">Edit</el-button>
              <el-button link type="danger" @click="handleDelete(node, data)">Delete</el-button>
            </span>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- Category Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Add Category' : 'Edit Category'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Please input category name" />
        </el-form-item>
        <el-form-item label="Sort Order" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Connection } from '@element-plus/icons-vue'

interface CategoryData {
  id: number
  name: string
  parentId: number | null
  sort: number
  status: number
  children?: CategoryData[]
}

const categoryList = ref<CategoryData[]>([])
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentNode = ref<CategoryData | null>(null)

const defaultProps = {
  children: 'children',
  label: 'name'
}

const form = ref({
  name: '',
  parentId: null as number | null,
  sort: 0,
  status: 1
})

const rules: FormRules = {
  name: [
    { required: true, message: 'Please input category name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' }
  ],
  sort: [{ required: true, message: 'Please input sort order', trigger: 'blur' }]
}

const formRef = ref<FormInstance>()

// Mock API call to fetch category list
const fetchCategoryList = async () => {
  // TODO: Replace with actual API call
  categoryList.value = [
    {
      id: 1,
      name: 'Electronics',
      parentId: null,
      sort: 1,
      status: 1,
      children: [
        {
          id: 2,
          name: 'Mobile Phones',
          parentId: 1,
          sort: 1,
          status: 1
        },
        {
          id: 3,
          name: 'Computers',
          parentId: 1,
          sort: 2,
          status: 1
        }
      ]
    }
  ]
}

// Add category
const handleAdd = (data: CategoryData | null) => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    parentId: data?.id || null,
    sort: 0,
    status: 1
  }
  dialogVisible.value = true
}

// Edit category
const handleEdit = (data: CategoryData) => {
  dialogType.value = 'edit'
  currentNode.value = data
  form.value = {
    name: data.name,
    parentId: data.parentId,
    sort: data.sort,
    status: data.status
  }
  dialogVisible.value = true
}

// Delete category
const handleDelete = (node: Node, data: CategoryData) => {
  ElMessageBox.confirm(
    'Are you sure to delete this category? All sub-categories will be deleted as well.',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      // TODO: Call delete API
      ElMessage.success('Deleted successfully')
      await fetchCategoryList() // Reload data
    })
    .catch(() => {
      // Cancel deletion
    })
}

// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      // TODO: Call add or edit API
      if (dialogType.value === 'add') {
        // Add logic
        ElMessage.success('Added successfully')
      } else {
        // Edit logic
        ElMessage.success('Updated successfully')
      }
      dialogVisible.value = false
      await fetchCategoryList() // Reload data
    }
  })
}

// Sync categories from third-party platform
const handleSyncFromThirdParty = async () => {
  try {
    ElMessageBox.confirm(
      'This will sync categories from the connected platform. Continue?',
      'Sync Categories',
      {
        confirmButtonText: 'Sync',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    ).then(async () => {
      // TODO: Call sync API
      // Mock API call
      const loading = ElMessage({
        message: 'Syncing categories...',
        duration: 0,
        type: 'info'
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
      loading.close()
      
      ElMessage.success('Categories synced successfully')
      await fetchCategoryList() // Reload categories
    })
  } catch (error) {
    ElMessage.error('Failed to sync categories')
  }
}

onMounted(() => {
  fetchCategoryList()
})
</script>

<style scoped>
.category-container {
  padding: 20px;
  height: 100%;
  background-color: var(--el-bg-color);
}

.category-header {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.category-content {
  background: var(--el-bg-color-overlay);
  padding: 20px;
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}

.custom-tree {
  background: transparent;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  color: var(--el-text-color-primary);
}

.actions {
  margin-left: 20px;
}

:deep(.el-tree-node__content) {
  height: 40px;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--el-color-primary-light-9);
}
</style>