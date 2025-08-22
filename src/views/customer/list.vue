<template>
  <div class="customer-list">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Customer List</span>
          <div class="header-actions">
            <el-button type="info" :icon="Refresh" @click="handleRefresh">Refresh</el-button>
            <el-button type="primary" @click="handleAdd">Add Customer</el-button>
          </div>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="Customer Name">
          <el-input v-model="searchForm.name" placeholder="Enter customer name" clearable />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="searchForm.phone" placeholder="Enter phone number" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">Search</el-button>
          <el-button @click="handleReset">Reset</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Customer Name" />
        <el-table-column prop="contact" label="Contact Person" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="address" label="Address" show-overflow-tooltip />
        <el-table-column prop="group" label="Customer Group" />
        <el-table-column prop="createTime" label="Created Time" width="180" />
        <el-table-column label="Actions" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">Edit</el-button>
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

    <!-- 新增/编辑客户对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="max-height: 500px; overflow-y: auto;"
      >
        <el-form-item label="Customer Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter customer name" />
        </el-form-item>
        <el-form-item label="Contact Person" prop="contact">
          <el-input v-model="form.contact" placeholder="Enter contact person" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="form.phone" placeholder="Enter phone number" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Enter email address" />
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="Enter address" />
        </el-form-item>
        <el-form-item label="Customer Group" prop="group">
          <el-select v-model="form.group" placeholder="Select customer group">
            <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import { Refresh } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  name: '',
  phone: ''
})

// 表格数据
const tableData = shallowRef([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = shallowRef<FormInstance | null>(null)
const form = reactive({
  id: '',
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  group: ''
})

// Form validation rules
const rules = reactive<FormRules>({
  name: [{ required: true, message: 'Please enter customer name', trigger: 'blur' }],
  contact: [{ required: true, message: 'Please enter contact person', trigger: 'blur' }],
  phone: [{ required: true, message: 'Please enter phone number', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ]
})

// Customer group options
const groupOptions = shallowRef([
  { value: 'vip', label: 'VIP Customer' },
  { value: 'regular', label: 'Regular Customer' },
  { value: 'potential', label: 'Potential Customer' }
])

// 获取客户列表数据
const getCustomerList = async () => {
  loading.value = true
  try {
    // TODO: 调用后端API获取数据
    // const res = await api.getCustomerList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   ...searchForm
    // })
    // tableData.value = res.data.list
    // total.value = res.data.total

    // 模拟数据
    tableData.value = [
      {
        id: '1',
        name: '测试客户1',
        contact: '张三',
        phone: '13800138000',
        email: 'test1@example.com',
        address: '北京市朝阳区xxx街道',
        group: 'VIP客户',
        createTime: '2024-01-01 12:00:00'
      }
    ]
    total.value = 1
  } catch (error) {
    console.error('获取客户列表失败:', error)
    ElMessage.error('获取客户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getCustomerList()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  handleSearch()
}

// Refresh list
const handleRefresh = () => {
  ElMessage.success('Refreshing customer list...')
  getCustomerList()
}

// Add customer
const handleAdd = () => {
  dialogTitle.value = 'Add Customer'
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  dialogVisible.value = true
}

// Edit customer
const handleEdit = (row: any) => {
  dialogTitle.value = 'Edit Customer'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

// 删除客户
const handleDelete = (row: any) => {
  ElMessageBox.confirm('Are you sure to delete this customer?', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: Call backend API to delete data
      // await api.deleteCustomer(row.id)
      ElMessage.success('Deleted successfully')
      getCustomerList()
    } catch (error) {
      console.error('Failed to delete customer:', error)
      ElMessage.error('Failed to delete customer')
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用后端API保存数据
        // if (form.id) {
        //   await api.updateCustomer(form)
        // } else {
        //   await api.createCustomer(form)
        // }
        ElMessage.success(form.id ? 'Updated successfully' : 'Created successfully')
        dialogVisible.value = false
        getCustomerList()
      } catch (error) {
        console.error('Failed to save customer:', error)
        ElMessage.error('Failed to save')
      }
    }
  })
}

// 分页相关
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getCustomerList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getCustomerList()
}

onMounted(() => {
  getCustomerList()
})
</script>

<style scoped>
.customer-list {
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
</style>
