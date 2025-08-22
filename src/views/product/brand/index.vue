<template>
  <div class="brand-container">
    <div class="brand-header">
      <el-button type="primary" @click="handleAdd">Add Brand</el-button>
      <el-button type="success" @click="handleSyncFromThirdParty">
        <el-icon><Connection /></el-icon>
        Sync from Platform
      </el-button>
    </div>
    <div class="brand-content">
      <el-table 
        :data="brandList" 
        style="width: 100%"
        :header-cell-style="{ background: 'var(--el-bg-color-overlay)' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="logo" label="Logo" width="120">
          <template #default="{ row }">
            <el-image
              v-if="row.logo"
              :src="row.logo"
              fit="contain"
              :preview-src-list="[row.logo]"
              class="brand-logo"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Brand Name" />
        <el-table-column prop="description" label="Description" show-overflow-tooltip />
        <el-table-column prop="sort" label="Sort Order" width="100" />
        <el-table-column prop="status" label="Status" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? 'Active' : 'Inactive' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">Edit</el-button>
            <el-button link type="danger" @click="handleDelete(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- Brand Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? 'Add Brand' : 'Edit Brand'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Logo" prop="logo">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="form.logo" :src="form.logo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="Brand Name" prop="name">
          <el-input v-model="form.name" placeholder="Please input brand name" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="Please input brand description"
          />
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
import { Plus, Connection } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { UploadProps } from 'element-plus'

interface BrandData {
  id: number
  name: string
  logo: string
  description: string
  sort: number
  status: number
}

const brandList = ref<BrandData[]>([])
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = ref({
  name: '',
  logo: '',
  description: '',
  sort: 0,
  status: 1
})

const rules: FormRules = {
  name: [
    { required: true, message: 'Please input brand name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' }
  ],
  sort: [{ required: true, message: 'Please input sort order', trigger: 'blur' }]
}

const formRef = ref<FormInstance>()

// Mock API call to fetch brand list
const fetchBrandList = async () => {
  // TODO: Replace with actual API call
  brandList.value = [
    {
      id: 1,
      name: 'Sample Brand',
      logo: '',
      description: 'This is a sample brand description',
      sort: 1,
      status: 1
    }
  ]
  total.value = 1
}

// Add brand
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    logo: '',
    description: '',
    sort: 0,
    status: 1
  }
  dialogVisible.value = true
}

// Edit brand
const handleEdit = (row: BrandData) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// Delete brand
const handleDelete = (row: BrandData) => {
  ElMessageBox.confirm('Are you sure to delete this brand?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      // TODO: Call delete API
      ElMessage.success('Deleted successfully')
      await fetchBrandList() // Reload data
    })
    .catch(() => {
      // Cancel deletion
    })
}

// Logo upload methods
const handleLogoSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // TODO: Handle upload success logic
  form.value.logo = response.url
}

const beforeLogoUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('Logo file must be an image!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Logo file size cannot exceed 2MB!')
    return false
  }
  return true
}

// Pagination methods
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchBrandList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchBrandList()
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
      await fetchBrandList() // Reload data
    }
  })
}

// Sync brands from third-party platform
const handleSyncFromThirdParty = async () => {
  try {
    ElMessageBox.confirm(
      'This will sync brands from the connected platform. Continue?',
      'Sync Brands',
      {
        confirmButtonText: 'Sync',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    ).then(async () => {
      // TODO: Call sync API
      // Mock API call
      const loading = ElMessage({
        message: 'Syncing brands...',
        duration: 0,
        type: 'info'
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
      loading.close()
      
      ElMessage.success('Brands synced successfully')
      await fetchBrandList() // Reload brands
    })
  } catch (error) {
    ElMessage.error('Failed to sync brands')
  }
}

onMounted(() => {
  fetchBrandList()
})
</script>

<style scoped>
.brand-container {
  padding: 20px;
  height: 100%;
  background-color: var(--el-bg-color);
}

.brand-header {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.brand-content {
  background: var(--el-bg-color-overlay);
  padding: 20px;
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.brand-logo {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color-lighter);
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: var(--el-text-color-secondary);
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 4px;
}

:deep(.el-table) {
  background-color: transparent;
  
  th.el-table__cell {
    background-color: var(--el-bg-color-overlay);
  }
  
  .el-table__body tr:hover > td.el-table__cell {
    background-color: var(--el-color-primary-light-9);
  }
}
</style>