<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑运单' : '创建运单'"
    width="800px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      class="create-shipment-form"
    >
      <!-- 基本信息 -->
      <div class="form-section">
        <h4 class="section-title">基本信息</h4>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="销售订单号" prop="salesOrderNo">
              <el-input
                v-model="formData.salesOrderNo"
                placeholder="请输入销售订单号"
                :disabled="isEdit"
              >
                <template #append>
                  <el-button 
                    @click="handleSelectOrder" 
                    :disabled="isEdit"
                    :icon="Search"
                  >
                    选择
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="物流单号" prop="truckingNo">
              <el-input
                v-model="formData.truckingNo"
                placeholder="请输入物流单号"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="承运商" prop="carrier">
              <el-select
                v-model="formData.carrier"
                placeholder="请选择承运商"
                style="width: 100%"
              >
                <el-option
                  v-for="carrier in CARRIER_OPTIONS"
                  :key="carrier.value"
                  :label="carrier.label"
                  :value="carrier.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="发货日期" prop="shipDate">
              <el-date-picker
                v-model="formData.shipDate"
                type="date"
                placeholder="请选择发货日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="销售渠道" prop="channel">
              <el-input
                v-model="formData.channel"
                placeholder="请输入销售渠道"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="渠道名称" prop="channelName">
              <el-input
                v-model="formData.channelName"
                placeholder="请输入渠道名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="派送单号" prop="dispatchedNo">
              <el-input
                v-model="formData.dispatchedNo"
                placeholder="请输入派送单号"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="渠道销售订单号" prop="channelSalesOrderNo">
              <el-input
                v-model="formData.channelSalesOrderNo"
                placeholder="请输入渠道销售订单号"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 收件人信息 -->
      <div class="form-section">
        <h4 class="section-title">收件人信息</h4>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收件人姓名" prop="recipient.name">
              <el-input
                v-model="formData.recipient.name"
                placeholder="请输入收件人姓名"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="联系电话" prop="recipient.phone">
              <el-input
                v-model="formData.recipient.phone"
                placeholder="请输入联系电话"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱地址" prop="recipient.email">
              <el-input
                v-model="formData.recipient.email"
                placeholder="请输入邮箱地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="收件地址" prop="recipient.address">
          <el-input
            v-model="formData.recipient.address"
            type="textarea"
            :rows="3"
            placeholder="请输入详细收件地址"
          />
        </el-form-item>
      </div>

      <!-- 包裹信息 -->
      <div class="form-section">
        <h4 class="section-title">包裹信息</h4>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="重量(kg)" prop="packageInfo.weight">
              <el-input-number
                v-model="formData.packageInfo.weight"
                :min="0"
                :step="0.1"
                :precision="2"
                placeholder="0.00"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="价值(元)" prop="packageInfo.value">
              <el-input-number
                v-model="formData.packageInfo.value"
                :min="0"
                :step="0.01"
                :precision="2"
                placeholder="0.00"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="长度(cm)" prop="packageInfo.dimensions.length">
              <el-input-number
                v-model="formData.packageInfo.dimensions.length"
                :min="0"
                :step="0.1"
                :precision="1"
                placeholder="0.0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="宽度(cm)" prop="packageInfo.dimensions.width">
              <el-input-number
                v-model="formData.packageInfo.dimensions.width"
                :min="0"
                :step="0.1"
                :precision="1"
                placeholder="0.0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="高度(cm)" prop="packageInfo.dimensions.height">
              <el-input-number
                v-model="formData.packageInfo.dimensions.height"
                :min="0"
                :step="0.1"
                :precision="1"
                placeholder="0.0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="商品描述" prop="packageInfo.description">
          <el-input
            v-model="formData.packageInfo.description"
            type="textarea"
            :rows="2"
            placeholder="请输入商品描述"
          />
        </el-form-item>
      </div>

      <!-- 备注信息 -->
      <div class="form-section">
        <h4 class="section-title">备注信息</h4>
        
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="formData.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>

    <!-- 选择订单对话框 -->
    <SelectOrderDialog 
      v-model="showSelectOrderDialog"
      @confirm="handleOrderSelected"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { CreateShipmentForm, ShipmentItem, CARRIER_OPTIONS } from '../types'
import SelectOrderDialog from './SelectOrderDialog.vue'

// Props
interface Props {
  modelValue: boolean
  shipmentData?: ShipmentItem | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()

// 响应式数据
const formRef = ref<FormInstance>()
const loading = ref(false)
const showSelectOrderDialog = ref(false)

// 计算属性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.shipmentData)

// 表单数据
const formData = reactive<CreateShipmentForm>({
  salesOrderNo: '',
  truckingNo: '',
  carrier: '',
  channel: '',
  channelName: '',
  dispatchedNo: '',
  channelSalesOrderNo: '',
  shipDate: '',
  recipient: {
    name: '',
    address: '',
    phone: '',
    email: ''
  },
  packageInfo: {
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    value: 0,
    description: ''
  },
  notes: ''
})

// 表单验证规则
const formRules: FormRules = {
  salesOrderNo: [
    { required: true, message: '请输入销售订单号', trigger: 'blur' }
  ],
  truckingNo: [
    { required: true, message: '请输入物流单号', trigger: 'blur' }
  ],
  carrier: [
    { required: true, message: '请选择承运商', trigger: 'change' }
  ],
  channel: [
    { required: true, message: '请输入销售渠道', trigger: 'blur' }
  ],
  channelName: [
    { required: true, message: '请输入渠道名称', trigger: 'blur' }
  ],
  dispatchedNo: [
    { required: true, message: '请输入派送单号', trigger: 'blur' }
  ],
  channelSalesOrderNo: [
    { required: true, message: '请输入渠道销售订单号', trigger: 'blur' }
  ],
  shipDate: [
    { required: true, message: '请选择发货日期', trigger: 'change' }
  ],
  'recipient.name': [
    { required: true, message: '请输入收件人姓名', trigger: 'blur' }
  ],
  'recipient.phone': [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  'recipient.email': [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  'recipient.address': [
    { required: true, message: '请输入收件地址', trigger: 'blur' }
  ],
  'packageInfo.weight': [
    { required: true, message: '请输入包裹重量', trigger: 'blur' },
    { type: 'number', min: 0.1, message: '重量必须大于0', trigger: 'blur' }
  ],
  'packageInfo.value': [
    { required: true, message: '请输入包裹价值', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价值必须大于0', trigger: 'blur' }
  ],
  'packageInfo.description': [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ]
}

// 监听shipmentData变化，填充表单
watch(
  () => props.shipmentData,
  (newData) => {
    if (newData) {
      Object.assign(formData, {
        salesOrderNo: newData.salesOrderNo,
        truckingNo: newData.truckingNo,
        carrier: newData.carrier,
        recipient: { ...newData.recipient },
        packageInfo: {
          weight: newData.packageInfo.weight,
          dimensions: { ...newData.packageInfo.dimensions },
          value: newData.packageInfo.value,
          description: newData.packageInfo.description
        },
        notes: newData.notes || ''
      })
    }
  },
  { immediate: true }
)

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    salesOrderNo: '',
    truckingNo: '',
    carrier: '',
    channel: '',
    channelName: '',
    dispatchedNo: '',
    channelSalesOrderNo: '',
    shipDate: '',
    recipient: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    packageInfo: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      value: 0,
      description: ''
    },
    notes: ''
  })
  formRef.value?.clearValidate()
}

// 选择订单
const handleSelectOrder = () => {
  showSelectOrderDialog.value = true
}

// 订单选择回调
const handleOrderSelected = (orderData: any) => {
  formData.salesOrderNo = orderData.orderNo
  // 这里可以根据订单数据自动填充收件人信息
  if (orderData.recipient) {
    Object.assign(formData.recipient, orderData.recipient)
  }
}

// 关闭对话框
const handleClose = () => {
  resetForm()
  emit('update:modelValue', false)
}

// 确认操作
const handleConfirm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 这里应该调用API创建或更新运单
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? '运单更新成功' : '运单创建成功')
    emit('confirm')
    handleClose()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-shipment-form {
  max-height: 600px;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.section-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #409eff;
  padding-bottom: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input-number) {
  width: 100%;
}
</style> 