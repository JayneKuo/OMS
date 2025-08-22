<template>
  <div class="customer-groups">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Customer Groups</span>
          <el-button type="primary" @click="handleAdd">Add Group</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Group Name" />
        <el-table-column prop="code" label="Group Code" />
        <el-table-column prop="description" label="Description" show-overflow-tooltip />
        <el-table-column prop="customerCount" label="Customer Count" width="120" />
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

    <!-- 新增/编辑分组对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="Group Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter group name" />
        </el-form-item>
        <el-form-item label="Group Code" prop="code">
          <el-input v-model="form.code" placeholder="Enter group code" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="Enter group description"
          />
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
import type { FormInstance, FormRules } from 'element-plus'

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
  code: '',
  description: ''
})

// Form validation rules
const rules = reactive<FormRules>({
  name: [{ required: true, message: 'Please enter group name', trigger: 'blur' }],
  code: [{ required: true, message: 'Please enter group code', trigger: 'blur' }]
})

// 获取分组列表数据
const getGroupList = async () => {
  loading.value = true
  try {
    // TODO: 调用后端API获取数据
    // const res = await api.getCustomerGroupList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value
    // })
    // tableData.value = res.data.list
    // total.value = res.data.total

    // 模拟数据
    tableData.value = [
      {
        id: '1',
        name: 'VIP客户',
        code: 'VIP',
        description: 'VIP客户分组',
        customerCount: 10,
        createTime: '2024-01-01 12:00:00'
      }
    ]
    total.value = 1
  } catch (error) {
    console.error('获取分组列表失败:', error)
    ElMessage.error('获取分组列表失败')
  } finally {
    loading.value = false
  }
}

// Add group
const handleAdd = () => {
  dialogTitle.value = 'Add Group'
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  dialogVisible.value = true
}

// Edit group
const handleEdit = (row: any) => {
  dialogTitle.value = 'Edit Group'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

// 删除分组
const handleDelete = (row: any) => {
  ElMessageBox.confirm('Are you sure to delete this group? Customers in this group will be moved to the default group.', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: Call backend API to delete data
      // await api.deleteCustomerGroup(row.id)
      ElMessage.success('Deleted successfully')
      getGroupList()
    } catch (error) {
      console.error('Failed to delete group:', error)
      ElMessage.error('Failed to delete group')
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
        //   await api.updateCustomerGroup(form)
        // } else {
        //   await api.createCustomerGroup(form)
        // }
        ElMessage.success(form.id ? 'Updated successfully' : 'Created successfully')
        dialogVisible.value = false
        getGroupList()
      } catch (error) {
        console.error('Failed to save group:', error)
        ElMessage.error('Failed to save')
      }
    }
  })
}

// 分页相关
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getGroupList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getGroupList()
}

onMounted(() => {
  getGroupList()
})
</script>

<style scoped>
.customer-groups {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
