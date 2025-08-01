<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
    <!-- 物流基本信息 -->
    <div class="form-section">
      <div class="section-header">
        <h3>Shipping Info</h3>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Destination" prop="destination">
            <el-input v-model="form.destination" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="External ID" prop="externalId">
            <el-input v-model="form.externalId" placeholder="e.g. ASN-PO-0003-3" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Sender's Name" prop="senderName">
            <el-input v-model="form.senderName" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Total Weight" prop="totalWeight">
            <el-input-number v-model="form.totalWeight" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Weight Unit" prop="weightUnit">
            <el-select v-model="form.weightUnit" style="width: 100%">
              <el-option label="lb" value="lb" />
              <el-option label="kg" value="kg" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <!-- 商品明细 -->
    <div class="form-section">
      <el-table :data="form.items" border style="width: 100%">
        <el-table-column label="Product Name and SKU" min-width="200">
          <template #default="{ row }">
            <div class="product-info">
              <div>{{ row.name }}</div>
              <div class="sku">{{ row.sku }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Ordered" width="120" align="center">
          <template #default="{ row }">
            {{ row.orderedQty }}
          </template>
        </el-table-column>
        <el-table-column label="Quantity" width="120">
          <template #default="{ row, $index }">
            <el-form-item 
              :prop="'items.' + $index + '.quantity'"
              :rules="{ required: true, type: 'number', min: 0 }"
              class="mb-0"
            >
              <el-input-number v-model="row.quantity" :min="0" style="width: 100%" />
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
        <el-table-column label="Lot Number" width="150">
          <template #default="{ row }">
            <el-input v-model="row.lotNumber" placeholder="Lot number" />
          </template>
        </el-table-column>
        <el-table-column label="Pallet Qty" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.palletQuantity" :min="0" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="UPC" width="150">
          <template #default="{ row }">
            <el-input v-model="row.upc" placeholder="UPC code" />
          </template>
        </el-table-column>
        <el-table-column label="Purchase ID" width="150">
          <template #default="{ row }">
            <el-input v-model="row.purchaseId" :value="purchaseOrder?.orderNo" disabled />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 高级物流信息 -->
    <div class="form-section">
      <div class="section-header">
        <h3>Advanced Shipping Info</h3>
        <el-button @click="toggleAdvancedFields">
          {{ showAdvancedFields ? 'Hide' : 'Show' }} Advanced Fields
        </el-button>
      </div>

      <template v-if="showAdvancedFields">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Ext Shipment ID" prop="extShipmentId">
              <el-input v-model="form.extShipmentId" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Incoterms" prop="incoterms">
              <el-input v-model="form.incoterms" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Expected Date" prop="expectedArrivalDate">
              <el-date-picker
                v-model="form.expectedArrivalDate"
                type="date"
                style="width: 100%"
                placeholder="mm/dd/yyyy"
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
            <el-form-item label="Shipping Method" prop="shippingMethod">
              <el-input v-model="form.shippingMethod" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Shipping Note" prop="shippingNote">
          <el-input type="textarea" v-model="form.shippingNote" rows="3" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="BOL" prop="bol">
              <el-input v-model="form.bol" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Seal" prop="seal">
              <el-input v-model="form.seal" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Trailer Number" prop="trailerNumber">
              <el-input v-model="form.trailerNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Trailer Size" prop="trailerSize">
              <el-input v-model="form.trailerSize" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Trailer Type" prop="trailerType">
              <el-input v-model="form.trailerType" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Container No." prop="containerNumber">
              <el-input v-model="form.containerNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Container Size" prop="containerSize">
              <el-input v-model="form.containerSize" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Container Type" prop="containerType">
              <el-input v-model="form.containerType" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
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
import type { PurchaseOrder } from '@/mock/purchaseData'

const props = defineProps<{
  purchaseOrder: PurchaseOrder | null
}>()

const emit = defineEmits<{
  (e: 'submit', data: any): void
  (e: 'cancel'): void
}>()

// 表单数据
const formRef = ref()
const showAdvancedFields = ref(false)
const form = reactive({
  destination: '',
  externalId: '',
  senderName: '',
  totalWeight: 0,
  weightUnit: 'lb',
  items: [] as Array<{
    sku: string
    name: string
    orderedQty: number
    quantity: number
    unit: string
    lotNumber: string
    palletQuantity: number
    upc: string
    purchaseId: string
  }>,
  extShipmentId: '',
  incoterms: '',
  expectedArrivalDate: '',
  shippingCarrier: '',
  shippingMethod: '',
  shippingNote: '',
  bol: '',
  seal: '',
  trailerNumber: '',
  trailerSize: '',
  trailerType: '',
  containerNumber: '',
  containerSize: '',
  containerType: ''
})

// 表单校验规则
const rules = {
  externalId: [{ required: true, message: 'External ID is required' }],
  senderName: [{ required: true, message: 'Sender name is required' }],
  totalWeight: [{ required: true, type: 'number', min: 0, message: 'Total weight is required' }],
  weightUnit: [{ required: true, message: 'Weight unit is required' }]
}

// 初始化表单数据
onMounted(() => {
  if (props.purchaseOrder) {
    form.destination = props.purchaseOrder.warehouse
    form.items = props.purchaseOrder.items.map(item => ({
      sku: item.sku,
      name: item.name,
      orderedQty: item.quantity,
      quantity: 0,
      unit: 'pcs',
      lotNumber: '',
      palletQuantity: 0,
      upc: '',
      purchaseId: props.purchaseOrder.orderNo
    }))
  }
})

// 切换高级字段显示
const toggleAdvancedFields = () => {
  showAdvancedFields.value = !showAdvancedFields.value
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', {
      ...form,
      purchaseOrder: props.purchaseOrder?.orderNo
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