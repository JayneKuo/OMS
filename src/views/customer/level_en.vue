<template>
  <div class="customer-level">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Customer Levels</span>
          <el-button type="primary" @click="handleAdd">Add Level</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Level Name" />
        <el-table-column prop="code" label="Level Code" />
        <el-table-column prop="minPoints" label="Min Points" />
        <el-table-column prop="maxPoints" label="Max Points" />
        <el-table-column prop="discount" label="Discount Rate">
          <template #default="scope">
            {{ scope.row.discount }}%
          </template>
        </el-table-column>
        <el-table-column prop="customerCount" label="Customer Count" width="120" />
        <el-table-column label="Actions" width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">Edit</el-button>
            <el-button type="success" link @click="handleBenefit(scope.row)">Benefits</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Level Dialog -->
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
        <el-form-item label="Level Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter level name" />
        </el-form-item>
        <el-form-item label="Level Code" prop="code">
          <el-input v-model="form.code" placeholder="Enter level code" />
        </el-form-item>
        <el-form-item label="Points Range" required>
          <el-col :span="11">
            <el-form-item prop="minPoints">
              <el-input-number
                v-model="form.minPoints"
                :min="0"
                placeholder="Min points"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="maxPoints">
              <el-input-number
                v-model="form.maxPoints"
                :min="0"
                placeholder="Max points"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="Discount Rate" prop="discount">
          <el-input-number
            v-model="form.discount"
            :min="0"
            :max="100"
            :precision="2"
            :step="0.1"
            style="width: 100%"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Benefits Settings Dialog -->
    <el-dialog
      title="Benefits Settings"
      v-model="benefitDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="benefitFormRef"
        :model="benefitForm"
        label-width="120px"
      >
        <el-form-item label="Birthday Gift">
          <el-switch v-model="benefitForm.birthdayGift" />
          <el-input-number
            v-if="benefitForm.birthdayGift"
            v-model="benefitForm.birthdayAmount"
            :min="0"
            :step="10"
            style="width: 150px; margin-left: 10px"
          >
            <template #prefix>$</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="VIP Service">
          <el-switch v-model="benefitForm.vipService" />
        </el-form-item>
        <el-form-item label="Free Shipping">
          <el-switch v-model="benefitForm.freeShipping" />
        </el-form-item>
        <el-form-item label="Points Multiplier">
          <el-input-number
            v-model="benefitForm.pointsMultiplier"
            :min="1"
            :precision="1"
            :step="0.1"
            style="width: 150px"
          >
            <template #suffix>x</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="Exclusive Events">
          <el-switch v-model="benefitForm.exclusiveEvent" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="benefitDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleBenefitSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// Table data
const tableData = shallowRef([])
const loading = ref(false)

// Form related
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = shallowRef<FormInstance | null>(null)
const form = reactive({
  id: '',
  name: '',
  code: '',
  minPoints: 0,
  maxPoints: 0,
  discount: 100
})

// Form validation rules
const rules = reactive<FormRules>({
  name: [{ required: true, message: 'Please enter level name', trigger: 'blur' }],
  code: [{ required: true, message: 'Please enter level code', trigger: 'blur' }],
  minPoints: [{ required: true, message: 'Please enter min points', trigger: 'blur' }],
  maxPoints: [{ required: true, message: 'Please enter max points', trigger: 'blur' }],
  discount: [{ required: true, message: 'Please enter discount rate', trigger: 'blur' }]
})

// Benefits settings related
const benefitDialogVisible = ref(false)
const benefitFormRef = shallowRef<FormInstance | null>(null)
const benefitForm = reactive({
  levelId: '',
  birthdayGift: false,
  birthdayAmount: 100,
  vipService: false,
  freeShipping: false,
  pointsMultiplier: 1,
  exclusiveEvent: false
})

// Get level list data
const getLevelList = async () => {
  loading.value = true
  try {
    // TODO: Call backend API to get data
    // const res = await api.getCustomerLevelList()
    // tableData.value = res.data

    // Mock data
    tableData.value = [
      {
        id: '1',
        name: 'Diamond Member',
        code: 'DIAMOND',
        minPoints: 10000,
        maxPoints: 999999,
        discount: 80,
        customerCount: 100
      },
      {
        id: '2',
        name: 'Gold Member',
        code: 'GOLD',
        minPoints: 5000,
        maxPoints: 9999,
        discount: 85,
        customerCount: 500
      },
      {
        id: '3',
        name: 'Silver Member',
        code: 'SILVER',
        minPoints: 1000,
        maxPoints: 4999,
        discount: 90,
        customerCount: 1000
      },
      {
        id: '4',
        name: 'Regular Member',
        code: 'NORMAL',
        minPoints: 0,
        maxPoints: 999,
        discount: 95,
        customerCount: 5000
      }
    ]
  } catch (error) {
    console.error('Failed to get level list:', error)
    ElMessage.error('Failed to get level list')
  } finally {
    loading.value = false
  }
}

// Add level
const handleAdd = () => {
  dialogTitle.value = 'Add Level'
  Object.keys(form).forEach(key => {
    form[key] = key === 'discount' ? 100 : ''
  })
  dialogVisible.value = true
}

// Edit level
const handleEdit = (row: any) => {
  dialogTitle.value = 'Edit Level'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

// Delete level
const handleDelete = (row: any) => {
  ElMessageBox.confirm('Are you sure to delete this level? Customers in this level will be moved to the default level.', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: Call backend API to delete data
      // await api.deleteCustomerLevel(row.id)
      ElMessage.success('Deleted successfully')
      getLevelList()
    } catch (error) {
      console.error('Failed to delete level:', error)
      ElMessage.error('Failed to delete level')
    }
  })
}

// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (form.minPoints >= form.maxPoints) {
        ElMessage.error('Min points must be less than max points')
        return
      }
      try {
        // TODO: Call backend API to save data
        // if (form.id) {
        //   await api.updateCustomerLevel(form)
        // } else {
        //   await api.createCustomerLevel(form)
        // }
        ElMessage.success(form.id ? 'Updated successfully' : 'Created successfully')
        dialogVisible.value = false
        getLevelList()
      } catch (error) {
        console.error('Failed to save level:', error)
        ElMessage.error('Failed to save')
      }
    }
  })
}

// Open benefits settings
const handleBenefit = (row: any) => {
  benefitForm.levelId = row.id
  // TODO: Get current level benefits settings
  // const benefits = await api.getLevelBenefits(row.id)
  // Object.assign(benefitForm, benefits)
  
  // Mock data
  if (row.code === 'DIAMOND') {
    Object.assign(benefitForm, {
      birthdayGift: true,
      birthdayAmount: 500,
      vipService: true,
      freeShipping: true,
      pointsMultiplier: 3,
      exclusiveEvent: true
    })
  }
  
  benefitDialogVisible.value = true
}

// Submit benefits settings
const handleBenefitSubmit = async () => {
  try {
    // TODO: Call backend API to save benefits settings
    // await api.updateLevelBenefits(benefitForm)
    ElMessage.success('Saved successfully')
    benefitDialogVisible.value = false
  } catch (error) {
    console.error('Failed to save benefits settings:', error)
    ElMessage.error('Failed to save')
  }
}

onMounted(() => {
  getLevelList()
})
</script>

<style scoped>
.customer-level {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-center {
  text-align: center;
  line-height: 32px;
}
</style>
