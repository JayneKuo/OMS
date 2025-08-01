<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <!-- 基本信息 -->
    <div class="form-section">
      <div class="section-header">
        <h3>Basic Information</h3>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Arrival No." prop="arrivalNo">
            <el-input v-model="form.arrivalNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="External ID" prop="externalId">
            <el-input v-model="form.externalId" placeholder="External receipt ID" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Receipt Date" prop="receiptDate">
            <el-date-picker
              v-model="form.receiptDate"
              type="date"
              style="width: 100%"
              placeholder="Select date"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Shipping Carrier" prop="shippingCarrier">
            <el-input v-model="form.shippingCarrier" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Shipping Class" prop="shippingClass">
            <el-input v-model="form.shippingClass" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <!-- 商品明细 -->
    <div class="form-section">
      <div class="section-header">
        <h3>Receipt Items</h3>
      </div>

      <el-table :data="form.items" border style="width: 100%">
        <el-table-column label="Product Name and SKU" min-width="200">
          <template #default="{ row }">
            <div class="product-info">
              <div>{{ row.name }}</div>
              <div class="sku">{{ row.sku }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Shipped" width="120" align="center">
          <template #default="{ row }">
            {{ row.shippedQty }}
          </template>
        </el-table-column>
        <el-table-column label="Receiving" width="150">
          <template #default="{ row, $index }">
            <el-form-item 
              :prop="'items.' + $index + '.receivedQty'"
              :rules="[
                { required: true, message: 'Quantity is required' },
                { type: 'number', min: 0, message: 'Must be >= 0' }
              ]"
              class="mb-0"
            >
              <el-input-number 
                v-model="row.receivedQty" 
                :min="0"
                :max="row.shippedQty"
                style="width: 100%"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="Unit" width="120">
          <template #default="{ row }">
            <el-select v-model="row.unit" style="width: 100%">
              <el-option label="pcs" value="pcs" />
              <el-option label="box" value="box" />
              <el-option label="set" value="set" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表单按钮 -->
    <div class="form-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Submit</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import type { Arrival } from '@/mock/purchaseData'

const props = defineProps<{
  arrival: Arrival | null
}>()

const emit = defineEmits<{
  (e: 'submit', data: any): void
  (e: 'cancel'): void
}>()

// 表单数据
const formRef = ref()
const form = reactive({
  arrivalNo: '',
  externalId: '',
  receiptDate: '',
  shippingCarrier: '',
  shippingClass: '',
  items: [] as Array<{
    sku: string
    name: string
    shippedQty: number
    receivedQty: number
    unit: string
  }>
})

// 表单校验规则
const rules = {
  externalId: [{ required: true, message: 'External ID is required' }],
  receiptDate: [{ required: true, message: 'Receipt date is required' }],
  shippingCarrier: [{ required: true, message: 'Shipping carrier is required' }],
  shippingClass: [{ required: true, message: 'Shipping class is required' }]
}

// 初始化表单数据
onMounted(() => {
  if (props.arrival) {
    form.arrivalNo = props.arrival.arrivalNo
    form.shippingCarrier = props.arrival.shippingCarrier || ''
    form.items = props.arrival.items.map(item => ({
      sku: item.sku,
      name: item.name,
      shippedQty: item.quantity,
      receivedQty: 0,
      unit: item.unit
    }))
  }
})

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', {
      ...form,
      arrival: props.arrival?.arrivalNo
    })
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.form-section {
  margin-bottom: 30px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }

  :deep(.el-form-item) {
    &.mb-0 {
      margin-bottom: 0;
    }
  }
}

.product-info {
  .sku {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 4px;
  }
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style> 