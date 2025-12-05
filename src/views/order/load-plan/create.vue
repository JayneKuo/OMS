<template>
  <div class="load-plan-create-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button
          :icon="ArrowLeft"
          circle
          @click="handleCancel"
          style="margin-right: 12px;"
        />
        <h1>{{ isEdit ? 'Edit Load Plan' : 'Create Load Plan' }}</h1>
      </div>
    </div>

    <!-- 主表单 -->
    <el-form
      ref="formRef"
      :model="formData"
      label-width="160px"
      class="load-plan-form"
    >
      <!-- Basic Information -->
      <div class="form-section">
        <div class="section-title">Basic Information</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Plan NO" prop="planNo">
              <el-input
                v-model="formData.planNo"
                placeholder="Auto generated if empty"
              >
                <template #append>
                  <el-button @click="generatePlanNumber" :icon="Refresh" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Plan Name" prop="planName">
              <el-input
                v-model="formData.planName"
                placeholder="Enter plan name"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Mode" prop="mode">
              <el-select
                v-model="formData.mode"
                placeholder="Select mode"
                style="width: 100%"
              >
                <el-option
                  v-for="item in LOAD_PLAN_MODES"
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
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Customer" prop="customerId">
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
            <el-form-item label="Carrier" prop="carrierId">
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

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Load Type" prop="loadType">
              <el-select
                v-model="formData.loadType"
                placeholder="Select load type"
                style="width: 100%"
              >
                <el-option
                  v-for="item in LOAD_PLAN_TYPES"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
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
            <el-form-item label="Status" prop="status">
              <el-select
                v-model="formData.status"
                placeholder="Select status"
                style="width: 100%"
                :disabled="isEdit"
              >
                <el-option
                  v-for="item in LOAD_PLAN_STATUS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Planned Ship Date" prop="plannedShipDate">
              <el-date-picker
                v-model="formData.plannedShipDate"
                type="date"
                placeholder="Select planned ship date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Planned Delivery Date" prop="plannedDeliveryDate">
              <el-date-picker
                v-model="formData.plannedDeliveryDate"
                type="date"
                placeholder="Select planned delivery date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Estimated Freight Cost" prop="estimatedFreightCost">
              <el-input-number
                v-model="formData.estimatedFreightCost"
                :min="0"
                :precision="2"
                placeholder="Enter estimated freight cost"
                style="width: 100%"
              >
                <template #prepend>$</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Planned Pallet Qty" prop="plannedPalletQty">
              <el-input-number
                v-model="formData.plannedPalletQty"
                :min="0"
                placeholder="Enter planned pallet quantity"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Planned Weight (kg)" prop="plannedWeight">
              <el-input-number
                v-model="formData.plannedWeight"
                :min="0"
                :precision="2"
                placeholder="Enter planned weight"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Planned Volume (m³)" prop="plannedVolume">
              <el-input-number
                v-model="formData.plannedVolume"
                :min="0"
                :precision="2"
                placeholder="Enter planned volume"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Address Information -->
      <div class="form-section">
        <div class="section-title">Address Information</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item prop="shipFrom" label-width="0">
              <AddressForm
                v-model="formData.shipFrom"
                label="Ship From"
                :show-fold="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="shipTo" label-width="0">
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
      </div>

      <!-- Note -->
      <div class="form-section">
        <div class="section-title">Note</div>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item prop="note" label-width="0">
              <el-input
                v-model="formData.note"
                type="textarea"
                :rows="4"
                placeholder="Enter note (optional)"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">
          {{ isEdit ? 'Update' : 'Create' }}
        </el-button>
      </div>
    </el-form>

    <!-- Order Lines Section -->
    <OrderLineTable
      v-model="formData.orderLines"
      :mode="formData.mode"
      :customer-id="formData.customerId"
      :ship-from="formData.shipFrom"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Refresh } from '@element-plus/icons-vue'
import AddressForm from './components/AddressForm.vue'
import OrderLineTable from '../load/components/OrderLineTable.vue'
import type { LoadPlan, Address, OrderLine } from './types'
import { LOAD_PLAN_MODES, LOAD_PLAN_TYPES, FREIGHT_TERMS, LOAD_PLAN_STATUS } from './types'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const saving = ref(false)
const isEdit = ref(false)

const formData = reactive<LoadPlan>({
  planNo: '',
  planName: '',
  mode: '',
  customerId: '',
  carrierId: '',
  loadType: '',
  freightTerm: '',
  status: 'PLANNING' as 'PLANNING' | 'PLANNED' | 'CONFIRMED' | 'CANCELLED',
  plannedShipDate: '',
  plannedDeliveryDate: '',
  estimatedFreightCost: 0,
  plannedPalletQty: 0,
  plannedWeight: 0,
  plannedVolume: 0,
  shipFrom: {},
  shipTo: {},
  billTo: {},
  note: '',
  orderLines: []
})

// Mock data - 实际使用时应该从API获取
const customers = ref([
  { label: 'Customer A', value: '1' },
  { label: 'Customer B', value: '2' },
  { label: 'Customer C', value: '3' }
])

const carriers = ref([
  { label: 'FedEx', value: '1' },
  { label: 'UPS', value: '2' },
  { label: 'DHL', value: '3' },
  { label: 'USPS', value: '4' }
])

// 生成计划编号
const generatePlanNumber = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  formData.planNo = `LP${timestamp.toString().slice(-8)}${random.toString().padStart(3, '0')}`
}

// 加载数据（编辑模式）
const loadData = async () => {
  const planId = route.params.id as string
  if (!planId) {
    isEdit.value = false
    return
  }

  isEdit.value = true
  try {
    // TODO: 调用API获取计划详情
    // const data = await getLoadPlan(planId)
    // Object.assign(formData, data)
    
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.info('Loading plan data...')
  } catch (error) {
    console.error('Load plan data failed:', error)
    ElMessage.error('Failed to load plan data')
    router.push('/order/load-plan')
  }
}

// 保存
const handleSave = async () => {
  try {
    await formRef.value?.validate()
    
    saving.value = true
    
    // TODO: 调用API保存
    // if (isEdit.value) {
    //   await updateLoadPlan(formData.id!, formData)
    // } else {
    //   await createLoadPlan(formData)
    // }
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? 'Plan updated successfully' : 'Plan created successfully')
    router.push('/order/load-plan')
  } catch (error: any) {
    if (error?.fields) {
      ElMessage.warning('Please fill in all required fields')
    } else {
      console.error('Save failed:', error)
      ElMessage.error('Failed to save plan')
    }
  } finally {
    saving.value = false
  }
}

// 取消
const handleCancel = () => {
  router.push('/order/load-plan')
}

// 监听订单行变化，自动更新计划信息
watch(() => formData.orderLines, (newVal) => {
  if (newVal && newVal.length > 0) {
    // 自动计算计划数量
    // 计算总数量
    const totalQty = newVal.reduce((sum, line) => sum + (line.totalQuantity || 0), 0)
    
    // 根据数量估算托盘数（假设每个托盘50件）
    if (!formData.plannedPalletQty || formData.plannedPalletQty === 0) {
      formData.plannedPalletQty = Math.ceil(totalQty / 50)
    }
    
    // 根据数量估算重量（假设每件2kg）
    if (!formData.plannedWeight || formData.plannedWeight === 0) {
      formData.plannedWeight = totalQty * 2
    }
    
    // 根据数量估算体积（假设每件0.05m³）
    if (!formData.plannedVolume || formData.plannedVolume === 0) {
      formData.plannedVolume = totalQty * 0.05
    }
    
    // 如果没有选择客户，从第一个订单行获取
    if (!formData.customerId && newVal[0]?.customer) {
      const customer = customers.value.find(c => c.label === newVal[0].customer)
      if (customer) {
        formData.customerId = customer.value
        formData.customer = newVal[0].customer
      }
    }
    
    // 如果没有选择承运商，从第一个订单行获取
    if (!formData.carrierId && newVal[0]?.carrier) {
      const carrier = carriers.value.find(c => c.label === newVal[0].carrier)
      if (carrier) {
        formData.carrierId = carrier.value
        formData.carrier = newVal[0].carrier
      }
    }
  }
}, { deep: true })

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.load-plan-create-page {
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

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
    }
  }
}

.load-plan-form {
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  color: #8b949e;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  background-color: #2d3139;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.el-input__inner) {
  color: #fff;
}

:deep(.el-select) {
  .el-input__wrapper {
    background-color: #2d3139;
  }
}

:deep(.el-date-editor) {
  background-color: #2d3139;
}

:deep(.el-textarea__inner) {
  background-color: #2d3139;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
}
</style>

