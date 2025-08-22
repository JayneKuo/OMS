<template>
  <div class="merchant-list">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Merchant List</span>
          <div class="header-actions">
            <el-button type="info" :icon="Refresh" @click="handleRefresh">Refresh</el-button>
            <el-button type="primary" @click="handleAdd">Add Merchant</el-button>
          </div>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="Merchant Name">
          <el-input 
            v-model="searchForm.name" 
            placeholder="Enter merchant name" 
            clearable 
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="Status">
          <el-select 
            v-model="searchForm.status" 
            placeholder="Select status" 
            clearable
            style="width: 150px"
          >
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="Merchant Type">
          <el-select 
            v-model="searchForm.merchantType" 
            placeholder="Select type" 
            clearable
            style="width: 150px"
          >
            <el-option label="Merchant" value="merchant" />
            <el-option label="Supplier" value="supplier" />
            <el-option label="Retailer" value="retailer" />
            <el-option label="Manufacturer" value="manufacturer" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">Search</el-button>
          <el-button @click="handleReset">Reset</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="logo" label="Logo" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.logo" :size="40" shape="square">
              {{ scope.row.name.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Merchant Name" />
        <el-table-column prop="merchantType" label="Type" width="100">
          <template #default="scope">
            <el-tag :type="getTypeColor(scope.row.merchantType)">
              {{ scope.row.merchantType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="country" label="Country" width="100" />
        <el-table-column prop="status" label="Status" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinDate" label="Join Date" width="120" />
        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="scope">
            <el-button type="success" link @click="handleEdit(scope.row)">Edit</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Add/Edit Merchant Dialog -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-height: 500px; overflow-y: auto;"
      >
        <!-- Logo Upload -->
        <el-form-item label="Logo">
          <el-upload
            class="logo-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeLogoUpload"
            :on-success="handleLogoSuccess"
          >
            <img v-if="form.logo" :src="form.logo" class="logo" />
            <div v-else class="logo-placeholder">
              <el-icon class="logo-uploader-icon"><Plus /></el-icon>
              <div class="upload-text">Upload Logo</div>
            </div>
          </el-upload>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Merchant Name" prop="name">
              <el-input v-model="form.name" placeholder="Enter merchant name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Status" prop="status">
              <el-select v-model="form.status" placeholder="Select status" style="width: 100%">
                <el-option label="Active" value="active" />
                <el-option label="Inactive" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Country/Region" prop="country">
              <el-select v-model="form.country" placeholder="Select country/region" style="width: 100%">
                <el-option label="United States" value="US" />
                <el-option label="Canada" value="CA" />
                <el-option label="United Kingdom" value="UK" />
                <el-option label="Australia" value="AU" />
                <el-option label="Germany" value="DE" />
                <el-option label="France" value="FR" />
                <el-option label="Japan" value="JP" />
                <el-option label="China" value="CN" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Currency" prop="currency">
              <el-select v-model="form.currency" placeholder="Select currency" style="width: 100%">
                <el-option label="USD - US Dollar" value="USD" />
                <el-option label="EUR - Euro" value="EUR" />
                <el-option label="GBP - British Pound" value="GBP" />
                <el-option label="CAD - Canadian Dollar" value="CAD" />
                <el-option label="AUD - Australian Dollar" value="AUD" />
                <el-option label="JPY - Japanese Yen" value="JPY" />
                <el-option label="CNY - Chinese Yuan" value="CNY" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="State" prop="state">
              <el-input v-model="form.state" placeholder="Enter state" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="City" prop="city">
              <el-input v-model="form.city" placeholder="Enter city" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Address" prop="address">
              <el-input v-model="form.address" placeholder="Enter address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Zip Code" prop="zipCode">
              <el-input v-model="form.zipCode" placeholder="Enter zip code" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" placeholder="Enter email address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="form.phone" placeholder="Enter phone number" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Merchant Type" prop="merchantType">
          <el-select v-model="form.merchantType" placeholder="Select merchant type" style="width: 100%">
            <el-option label="Merchant" value="merchant" />
            <el-option label="Supplier" value="supplier" />
            <el-option label="Retailer" value="retailer" />
            <el-option label="Manufacturer" value="manufacturer" />
          </el-select>
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="Enter merchant description" />
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
import { ref, reactive, onMounted, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'

// Search form
const searchForm = reactive({
  name: '',
  status: '',
  merchantType: ''
})

// Table data
const tableData = shallowRef([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// Form related
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = shallowRef<FormInstance | null>(null)
const form = reactive({
  id: '',
  logo: '',
  name: '',
  status: 'active',
  country: '',
  currency: '',
  state: '',
  city: '',
  address: '',
  zipCode: '',
  email: '',
  phone: '',
  merchantType: '',
  description: ''
})

// Form validation rules
const rules = reactive<FormRules>({
  name: [{ required: true, message: 'Please enter merchant name', trigger: 'blur' }],
  status: [{ required: true, message: 'Please select status', trigger: 'change' }],
  country: [{ required: true, message: 'Please select country/region', trigger: 'change' }],
  currency: [{ required: true, message: 'Please select currency', trigger: 'change' }],
  state: [{ required: true, message: 'Please enter state', trigger: 'blur' }],
  city: [{ required: true, message: 'Please enter city', trigger: 'blur' }],
  address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
  zipCode: [{ required: true, message: 'Please enter zip code', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  phone: [{ required: true, message: 'Please enter phone number', trigger: 'blur' }],
  merchantType: [{ required: true, message: 'Please select merchant type', trigger: 'change' }]
})

// Get merchant list data
const getMerchantList = async () => {
  loading.value = true
  try {
    // TODO: Call backend API to get data
    // const res = await api.getMerchantList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   ...searchForm
    // })
    // tableData.value = res.data.list
    // total.value = res.data.total

    // Mock data
    tableData.value = [
      {
        id: '1',
        logo: 'https://via.placeholder.com/40x40?text=TS',
        name: 'Tech Store',
        merchantType: 'merchant',
        email: 'john@techstore.com',
        phone: '1234567890',
        country: 'US',
        status: 'active',
        joinDate: '2024-01-15'
      },
      {
        id: '2',
        logo: 'https://via.placeholder.com/40x40?text=FH',
        name: 'Fashion Hub',
        merchantType: 'retailer',
        email: 'jane@fashionhub.com',
        phone: '0987654321',
        country: 'CA',
        status: 'inactive',
        joinDate: '2024-02-01'
      }
    ]
    total.value = 2
  } catch (error) {
    console.error('Failed to get merchant list:', error)
    ElMessage.error('Failed to get merchant list')
  } finally {
    loading.value = false
  }
}

// Status type mapping
const getStatusType = (status: string) => {
  const typeMap = {
    active: 'success',
    inactive: 'info'
  }
  return typeMap[status] || 'info'
}

// Status text mapping
const getStatusText = (status: string) => {
  const textMap = {
    active: 'Active',
    inactive: 'Inactive'
  }
  return textMap[status] || status
}

// Merchant type color mapping
const getTypeColor = (type: string) => {
  const colorMap = {
    merchant: 'primary',
    supplier: 'success',
    retailer: 'warning',
    manufacturer: 'danger'
  }
  return colorMap[type] || 'info'
}

// Search
const handleSearch = () => {
  currentPage.value = 1
  getMerchantList()
}

// Reset search
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = ''
  searchForm.merchantType = ''
  handleSearch()
}

// Refresh list
const handleRefresh = () => {
  ElMessage.success('Refreshing merchant list...')
  getMerchantList()
}

// Add merchant
const handleAdd = () => {
  dialogTitle.value = 'Add Merchant'
  Object.keys(form).forEach(key => {
    if (key === 'status') {
      form[key] = 'active'
    } else {
      form[key] = ''
    }
  })
  dialogVisible.value = true
}

// Edit merchant
const handleEdit = (row: any) => {
  dialogTitle.value = 'Edit Merchant'
  Object.keys(form).forEach(key => {
    form[key] = row[key] || ''
  })
  dialogVisible.value = true
}

// Delete merchant
const handleDelete = (row: any) => {
  ElMessageBox.confirm('Are you sure to delete this merchant?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: Call backend API to delete data
      // await api.deleteMerchant(row.id)
      ElMessage.success('Deleted successfully')
      getMerchantList()
    } catch (error) {
      console.error('Failed to delete merchant:', error)
      ElMessage.error('Failed to delete merchant')
    }
  })
}

// Logo upload
const beforeLogoUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Logo must be JPG or PNG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Logo size cannot exceed 2MB!')
    return false
  }
  return true
}

const handleLogoSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  form.logo = URL.createObjectURL(uploadFile.raw!)
}

// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: Call backend API to save data
        // if (form.id) {
        //   await api.updateMerchant(form)
        // } else {
        //   await api.createMerchant(form)
        // }
        ElMessage.success(form.id ? 'Updated successfully' : 'Created successfully')
        dialogVisible.value = false
        getMerchantList()
      } catch (error) {
        console.error('Failed to save merchant:', error)
        ElMessage.error('Failed to save')
      }
    }
  })
}

// Pagination related
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getMerchantList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getMerchantList()
}

onMounted(() => {
  getMerchantList()
})
</script>

<style scoped>
.merchant-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.logo-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.logo-uploader:hover {
  border-color: var(--el-color-primary);
}

.logo-placeholder {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--el-fill-color-lighter);
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  margin-bottom: 8px;
}

.upload-text {
  color: #8c939d;
  font-size: 14px;
}

.logo {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}
</style>
