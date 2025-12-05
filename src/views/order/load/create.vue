<template>
  <div class="build-load-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button
          :icon="ArrowLeft"
          circle
          @click="handleCancel"
          style="margin-right: 12px;"
        />
        <h1>{{ isEdit ? 'Edit Load' : 'Build Load' }}</h1>
      </div>
    </div>

    <!-- 主表单 -->
    <el-form
      ref="formRef"
      :model="formData"
      label-width="160px"
      class="load-form"
    >
      <!-- Basic Information -->
      <div class="form-section">
        <div class="section-title">Basic Information</div>
        <!-- 第一行：核心标识信息 -->
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Load NO" prop="loadNo">
              <el-input
                v-model="formData.loadNo"
                placeholder="Auto generated if empty"
              >
                <template #append>
                  <el-button @click="generateLoadNumber" :icon="Refresh" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Mode" prop="mode" :rules="[{ required: true, message: 'Please select mode' }]">
              <el-select
                v-model="formData.mode"
                placeholder="Select mode"
                style="width: 100%"
              >
                <el-option
                  v-for="item in LOAD_MODES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div>
                    <div>{{ item.label }}</div>
                    <div style="font-size: 12px; color: #909399;">{{ item.description }}</div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Load Type" prop="loadType" :rules="[{ required: true, message: 'Please select load type' }]">
              <el-select
                v-model="formData.loadType"
                placeholder="Select load type"
                style="width: 100%"
              >
                <el-option
                  v-for="item in LOAD_TYPES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行：主要业务关系 -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Customer" prop="customerId" :rules="[{ required: true, message: 'Please select customer' }]">
              <el-select
                v-model="formData.customerId"
                placeholder="Select customer"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in customers"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Carrier" prop="carrierId" :rules="[{ required: true, message: 'Please select carrier' }]">
              <el-select
                v-model="formData.carrierId"
                placeholder="Select carrier"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in carriers"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行：费用相关信息 -->
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Freight Term" prop="freightTerm">
              <el-select
                v-model="formData.freightTerm"
                placeholder="Select freight term"
                style="width: 100%"
              >
                <el-option
                  v-for="item in FREIGHT_TERMS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Freight Cost" prop="freightCost">
              <el-input
                v-model="formData.freightCost"
                placeholder="Enter freight cost"
                type="number"
              >
                <template #prepend>$</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Long Haul" prop="longHaul">
              <el-switch v-model="formData.longHaul" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Date & Reference Information -->
      <div class="form-section">
        <div class="section-title">Date & Reference Information</div>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Pro No" prop="proNo">
              <el-input v-model="formData.proNo" placeholder="Enter pro no" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Retailer Authorization" prop="retailerAuthorization">
              <el-input
                v-model="formData.retailerAuthorization"
                placeholder="Enter ARN"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="TMS Shipment ID" prop="tmsShipmentId">
              <el-input
                v-model="formData.tmsShipmentId"
                placeholder="Enter TMS ID"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Adjusted Pallet Qty" prop="adjustedPalletQty">
              <el-input
                v-model="formData.adjustedPalletQty"
                placeholder="Enter quantity"
                type="number"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Desired Ship Date" prop="desiredShipDate" :rules="[{ required: true, message: 'Please select desired ship date' }]">
              <el-date-picker
                v-model="formData.desiredShipDate"
                type="date"
                placeholder="Select date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Appointment Time" prop="appointmentTime">
              <el-date-picker
                v-model="formData.appointmentTime"
                type="datetime"
                placeholder="Select date time"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Routing Request Date" prop="routingRequestDate">
              <el-date-picker
                v-model="formData.routingRequestDate"
                type="date"
                placeholder="Select date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Routing Receipt Date" prop="routingReceiptDate">
              <el-date-picker
                v-model="formData.routingReceiptDate"
                type="date"
                placeholder="Select date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="Trailer Pick Up Mode" prop="trailerPickUpMode">
              <el-select
                v-model="formData.trailerPickUpMode"
                placeholder="Select mode"
                style="width: 100%"
              >
                <el-option
                  v-for="item in TRAILER_PICKUP_MODES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Address Information & Note -->
      <div class="form-section">
        <div class="section-title">Address Information</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item prop="shipFrom" :rules="shipFromRules" label-width="0">
              <AddressForm
                v-model="formData.shipFrom"
                label="Ship From"
                :show-fold="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="shipTo" :rules="shipToRules" label-width="0">
              <AddressForm
                v-model="formData.shipTo"
                label="Ship To"
                :show-fold="true"
                :show-clear="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <AddressForm
              v-model="formData.billTo"
              label="Bill To"
              :show-fold="true"
            />
          </el-col>
        </el-row>
        
        <el-row :gutter="16" style="margin-top: 16px;">
          <el-col :span="24">
            <el-form-item label="Note" prop="note">
              <el-input
                v-model="formData.note"
                type="textarea"
                :rows="4"
                placeholder="Enter note"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <!-- Order Line 表格 - 铺满整个宽度 -->
    <OrderLineTable
      v-model="formData.orderLines"
      :mode="formData.mode"
      :customer-id="formData.customerId"
      :ship-from="formData.shipFrom"
      @import-orders="handleImportOrders"
    />

    <!-- 底部按钮 -->
    <div class="form-footer">
      <el-button @click="handleCancel">CANCEL</el-button>
      <el-button type="primary" @click="handleSave" :loading="saving">SAVE</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { generateSnowflakeId, generateLoadNo } from '@/utils/snowflake'
import AddressForm from './components/AddressForm.vue'
import OrderLineTable from './components/OrderLineTable.vue'
import type { Load, Address } from './types'
import {
  LOAD_TYPES,
  TRAILER_PICKUP_MODES,
  FREIGHT_TERMS
} from './types'
import { Refresh, ArrowLeft } from '@element-plus/icons-vue'

// Customer 类型定义
interface CustomerOption {
  label: string
  value: string
  shipFrom?: Address
  shipTo?: Address
  billTo?: Address
}

const route = useRoute()
const router = useRouter()
const formRef = ref()
const saving = ref(false)
const isEdit = ref(false)

// 地址验证规则
const validateAddress = (address: Address | undefined, fieldName: string) => {
  if (!address) {
    return new Error(`Please fill in ${fieldName} address`)
  }
  const missingFields: string[] = []
  if (!address.address1) missingFields.push('Address')
  if (!address.city) missingFields.push('City')
  if (!address.state) missingFields.push('State')
  if (!address.zipCode) missingFields.push('Zip Code')
  if (!address.country) missingFields.push('Country')
  
  if (missingFields.length > 0) {
    return new Error(`${fieldName}: Please fill in ${missingFields.join(', ')}`)
  }
  return true
}

const shipFromRules = [
  {
    validator: (_rule: any, value: Address, callback: (error?: Error) => void) => {
      const result = validateAddress(value, 'Ship From')
      if (result instanceof Error) {
        callback(result)
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]

const shipToRules = [
  {
    validator: (_rule: any, value: Address, callback: (error?: Error) => void) => {
      const result = validateAddress(value, 'Ship To')
      if (result instanceof Error) {
        callback(result)
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]

const formData = reactive<Load>({
  loadNo: '',
  mode: '',
  customerId: '',
  carrierId: '',
  freightTerm: '',
  loadType: '',
  appointmentTime: '',
  longHaul: false,
  proNo: '',
  retailerAuthorization: '',
  tmsShipmentId: '',
  desiredShipDate: '',
  freightCost: 0,
  routingRequestDate: '',
  routingReceiptDate: '',
  trailerPickUpMode: 'LIVE_LOAD',
  adjustedPalletQty: 0,
  shipFrom: {},
  shipTo: {},
  billTo: {},
  note: '',
  orderLines: [],
  status: '',
  shippingRequestIds: [],
  statusHistory: []
})

// Mock data - 实际使用时应该从API获取
const customers = ref<CustomerOption[]>([
  { 
    label: 'Customer A', 
    value: '1',
    shipFrom: {
      name: 'Customer A Warehouse',
      company: 'Customer A Inc.',
      address1: '123 Warehouse St',
      address2: 'Building A',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      phone: '+1-555-0001',
      email: 'warehouse@customera.com'
    },
    shipTo: {
      name: 'Customer A Store',
      company: 'Customer A Retail',
      address1: '456 Store Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1-555-0002',
      email: 'store@customera.com'
    },
    billTo: {
      name: 'Customer A Billing',
      company: 'Customer A Inc.',
      address1: '789 Finance Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      phone: '+1-555-0003',
      email: 'billing@customera.com'
    }
  },
  { 
    label: 'Customer B', 
    value: '2',
    shipFrom: {
      name: 'Customer B Warehouse',
      company: 'Customer B Corp.',
      address1: '321 Industrial Rd',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
      phone: '+1-555-0011',
      email: 'warehouse@customerb.com'
    },
    shipTo: {
      name: 'Customer B Outlet',
      company: 'Customer B Retail',
      address1: '654 Shopping Center',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      country: 'USA',
      phone: '+1-555-0012',
      email: 'outlet@customerb.com'
    },
    billTo: {
      name: 'Customer B Accounting',
      company: 'Customer B Corp.',
      address1: '987 Business Park',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      phone: '+1-555-0013',
      email: 'billing@customerb.com'
    }
  },
  { 
    label: 'Customer C', 
    value: '3',
    shipFrom: {
      name: 'Customer C Distribution',
      company: 'Customer C Ltd.',
      address1: '555 Logistics Way',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      phone: '+1-555-0021',
      email: 'distribution@customerc.com'
    },
    shipTo: {
      name: 'Customer C Branch',
      company: 'Customer C Retail',
      address1: '888 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      phone: '+1-555-0022',
      email: 'branch@customerc.com'
    },
    billTo: {
      name: 'Customer C Finance',
      company: 'Customer C Ltd.',
      address1: '111 Corporate Dr',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA',
      phone: '+1-555-0023',
      email: 'finance@customerc.com'
    }
  }
])

const carriers = ref([
  { label: 'FedEx', value: '1' },
  { label: 'UPS', value: '2' },
  { label: 'DHL', value: '3' },
  { label: 'USPS', value: '4' }
])

// 监听 Customer 选择变化，自动填充地址信息
watch(() => formData.customerId, (newCustomerId) => {
  if (newCustomerId) {
    const selectedCustomer = customers.value.find(c => c.value === newCustomerId)
    if (selectedCustomer) {
      // 自动填充地址信息（深拷贝以避免引用问题）
      formData.shipFrom = JSON.parse(JSON.stringify(selectedCustomer.shipFrom || {}))
      formData.shipTo = JSON.parse(JSON.stringify(selectedCustomer.shipTo || {}))
      formData.billTo = JSON.parse(JSON.stringify(selectedCustomer.billTo || {}))
      
      ElMessage.success('Address information auto-filled from customer profile')
    }
  }
})

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    loadLoadData(id)
  } else {
    // 检查是否从 Load Plan 跳转过来
    loadFromPlan()
  }
})

// 从 Load Plan 加载数据
const loadFromPlan = () => {
  try {
    const planDataStr = sessionStorage.getItem('loadFromPlan')
    if (planDataStr) {
      const planData = JSON.parse(planDataStr)
      
      // 填充 Load 表单数据
      if (planData.mode) formData.mode = planData.mode
      if (planData.customerId) formData.customerId = planData.customerId
      if (planData.customer) formData.customer = planData.customer
      if (planData.carrierId) formData.carrierId = planData.carrierId
      if (planData.carrier) formData.carrier = planData.carrier
      if (planData.freightTerm) formData.freightTerm = planData.freightTerm
      if (planData.loadType) formData.loadType = planData.loadType
      if (planData.desiredShipDate) formData.desiredShipDate = planData.desiredShipDate
      if (planData.freightCost) formData.freightCost = planData.freightCost
      if (planData.shipFrom) formData.shipFrom = planData.shipFrom
      if (planData.shipTo) formData.shipTo = planData.shipTo
      if (planData.billTo) formData.billTo = planData.billTo
      if (planData.note) formData.note = planData.note
      if (planData.orderLines) formData.orderLines = planData.orderLines
      if (planData.shippingRequestIds) formData.shippingRequestIds = planData.shippingRequestIds
      
      // 显示提示信息
      ElMessage.success(`Loaded data from Load Plan: ${planData.planNo}`)
      
      // 清除 sessionStorage
      sessionStorage.removeItem('loadFromPlan')
    }
  } catch (error) {
    console.error('Failed to load data from plan:', error)
  }
}

const loadLoadData = async (id: string) => {
  // TODO: 从API加载数据
  console.log('Loading load data for id:', id)
}

const handleImportOrders = () => {
  ElMessage.info('Import Orders feature coming soon')
}

// 生成Load NO
const generateLoadNumber = () => {
  formData.loadNo = generateLoadNo()
  ElMessage.success('Load NO generated')
}

// 从 Order Lines 提取 Shipping Request IDs
const extractShippingRequestIds = () => {
  const requestIds: string[] = []
  formData.orderLines.forEach(line => {
    if (line.id && !requestIds.includes(line.id)) {
      requestIds.push(line.id)
    }
  })
  return requestIds
}

const handleSave = async () => {
  try {
    // 验证表单
    await formRef.value?.validate()
    
    // 验证 Order Lines
    if (!formData.orderLines || formData.orderLines.length === 0) {
      ElMessage.error('Please add at least one order line')
      return
    }
    
    saving.value = true
    
    // 提取关联的 Shipping Request IDs
    formData.shippingRequestIds = extractShippingRequestIds()
    
    // 如果创建时已有carrier，自动流转到ASSIGNED状态
    const initialStatus = formData.carrierId ? 'ASSIGNED' : 'NEW'
    formData.status = initialStatus
    
    // 初始化状态历史
    if (!formData.statusHistory || formData.statusHistory.length === 0) {
      formData.statusHistory = [{
        status: initialStatus,
        changedBy: 'Current User', // TODO: 从用户系统获取
        changedAt: new Date().toISOString(),
        note: initialStatus === 'ASSIGNED' ? 'Load created with carrier assigned' : 'Load created'
      }]
    }
    
    // 如果是ASSIGNED状态，记录dispatchTime
    if (initialStatus === 'ASSIGNED') {
      formData.dispatchTime = new Date().toISOString()
    }
    
    // 生成系统ID（如果创建新记录）
    if (!formData.id) {
      formData.id = generateSnowflakeId()
    }
    
    // 如果Load NO为空，自动生成
    if (!formData.loadNo || formData.loadNo.trim() === '') {
      formData.loadNo = generateLoadNo()
    }
    
    // 设置创建时间
    if (!formData.createdAt) {
      formData.createdAt = new Date().toISOString()
    }
    formData.updatedAt = new Date().toISOString()
    
    // TODO: 调用API保存数据
    console.log('Save load:', formData)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('Load saved successfully')
    router.push('/order/load')
  } catch (error) {
    console.error('Validation or save failed:', error)
    ElMessage.error('Please fill in all required fields')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  router.push('/order/load')
}
</script>

<style scoped lang="scss">
.build-load-page {
  padding: 24px;
  background-color: #1a1d21;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 24px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
    }
  }
}

.load-form {
  padding: 20px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 24px;

  .form-section {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #58a6ff;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 3px solid #58a6ff;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #8b949e;
    font-size: 13px;
  }

  :deep(.el-input__wrapper) {
    background-color: #2d3139;
    box-shadow: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  :deep(.el-input__inner) {
    color: #fff;
    border-radius: 4px;
  }

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-date-editor) {
    background-color: #2d3139;
  }

  :deep(.el-textarea__inner) {
    background-color: #2d3139;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 24px;

  .el-button {
    min-width: 100px;
  }
}

// Order Line 表格样式在 OrderLineTable 组件中定义
:deep(.order-line-section) {
  padding: 20px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 24px;
}
</style>

