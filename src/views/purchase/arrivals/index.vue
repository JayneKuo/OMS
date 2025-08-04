<template>
  <div class="arrivals">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>Arrivals</span>
          <el-button type="primary" @click="handleCreate">Add Arrival</el-button>
        </div>
      </template>
      
      <el-table :data="arrivals" style="width: 100%">
        <el-table-column prop="arrivalNo" label="Arrival No." width="120" />
        <el-table-column prop="externalId" label="External ID" width="150" />
        <el-table-column prop="destination" label="Destination" width="120" />
        <el-table-column prop="senderName" label="Sender" />
        <el-table-column prop="totalWeight" label="Total Weight" width="120">
          <template #default="{ row }">
            {{ row.totalWeight }} {{ row.weightUnit }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">View</el-button>
            <el-button link type="primary" @click="handleEdit(row)">Edit</el-button>
            <el-button link type="danger" @click="handleDelete(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? 'Add Arrival' : 'Edit Arrival'"
      width="60%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 物流基本信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3>Basic Info</h3>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Purchase Order" prop="purchaseOrderId">
                <el-select 
                  v-model="form.purchaseOrderId" 
                  style="width: 100%"
                  placeholder="Select Purchase Order"
                  @change="handlePurchaseOrderSelect"
                  :disabled="dialogType === 'edit'"
                >
                  <el-option
                    v-for="po in purchaseOrders"
                    :key="po.id"
                    :label="`${po.orderNo} - ${po.supplier}`"
                    :value="po.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Destination" prop="destination">
                <el-input v-model="form.destination" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Supplier" prop="supplier">
                <el-input v-model="form.supplier" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
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
          <div class="section-header">
            <h3>Items</h3>
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
            <el-table-column label="Ordered" width="100" align="center">
              <template #default="{ row }">
                {{ row.orderedQty || 0 }}
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
                <el-input v-model="row.purchaseId" disabled />
              </template>
            </el-table-column>
          </el-table>

          <div v-if="form.items.length === 0" class="empty-items">
            <p>Please select a purchase order to load items</p>
          </div>
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
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Submit</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="Arrival Details"
      width="60%"
    >
      <div v-if="currentArrival" class="arrival-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Arrival No.">{{ currentArrival.arrivalNo }}</el-descriptions-item>
          <el-descriptions-item label="Purchase Order">{{ currentArrival.purchaseOrder }}</el-descriptions-item>
          <el-descriptions-item label="Supplier">{{ currentArrival.supplier }}</el-descriptions-item>
          <el-descriptions-item label="Expected Date">{{ formatDate(currentArrival.expectedDate) }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="getStatusType(currentArrival.status)">
              {{ formatStatus(currentArrival.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="items-table">
          <h3>Arrival Items</h3>
          <el-table :data="currentArrival.items" border>
            <el-table-column prop="sku" label="SKU" width="120" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="expectedQty" label="Expected Qty" width="120" />
            <el-table-column prop="receivedQty" label="Received Qty" width="120" />
            <el-table-column label="Progress" width="200">
              <template #default="{ row }">
                <el-progress
                  :percentage="Math.round((row.receivedQty / row.expectedQty) * 100)"
                  :status="row.receivedQty >= row.expectedQty ? 'success' : 'warning'"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import { mockPurchaseData } from '@/mock/purchaseData'
import type { Arrival, ArrivalItem } from '@/mock/purchaseData'

const route = useRoute()

// 到货单列表
const availableArrivals = computed(() => 
  mockPurchaseData.arrivals.filter(arrival => 
    arrival.status === 'shipped' || arrival.status === 'arrived'
  )
)

// 采购订单列表
const purchaseOrders = computed(() => 
  mockPurchaseData.purchaseOrders.filter(po => po.status !== 'cancelled')
)

// 仓库列表
const warehouses = mockPurchaseData.warehouses

// 只显示激活状态的仓库
const activeWarehouses = computed(() => 
  warehouses.filter(w => w.status === 'active')
)

// 商品选项（模拟数据）
const productOptions = [
  { sku: 'SKU001', name: 'Product 1' },
  { sku: 'SKU002', name: 'Product 2' },
  { sku: 'SKU003', name: 'Product 3' }
]

// 列表数据
const arrivals = ref<Arrival[]>(mockPurchaseData.arrivals)

// 表单相关
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const currentArrival = ref<Arrival | null>(null)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref()
const showAdvancedFields = ref(false)

// 表单数据
const form = reactive({
  id: '',
  purchaseOrderId: '',
  destination: '',
  supplier: '',
  externalId: '',
  senderName: '',
  totalWeight: 0,
  weightUnit: 'lb',
  expectedArrivalDate: '',
  items: [] as Array<{
    id: string
    sku: string
    name: string
    quantity: number
    unit: string
    lotNumber: string
    palletQuantity: number
    upc: string
    purchaseId: string
    isExisting?: boolean
    orderedQty?: number
  }>,
  // 高级物流信息
  extShipmentId: '',
  incoterms: '',
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
  purchaseOrderId: [{ required: true, message: 'Purchase order is required' }],
  externalId: [{ required: true, message: 'External ID is required' }],
  senderName: [{ required: true, message: 'Sender name is required' }],
  totalWeight: [{ required: true, type: 'number', min: 0, message: 'Total weight is required' }],
  weightUnit: [{ required: true, message: 'Weight unit is required' }]
}

// 是否可以提交
const canSubmit = computed(() => {
  return form.items.length > 0 && form.destination && form.externalId
})

// 处理商品选择
const handleProductSelect = (index: number, sku: string) => {
  const product = productOptions.find(p => p.sku === sku)
  if (product) {
    form.items[index].name = product.name
  }
}

// 添加商品
const addItem = () => {
  form.items.push({
    id: '',
    sku: '',
    name: '',
    quantity: 0,
    unit: 'pcs',
    lotNumber: '',
    palletQuantity: 0,
    upc: '',
    purchaseId: '',
    isExisting: false,
    orderedQty: 0 // 新增订购数量
  })
}

// 移除商品
const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

// 添加自定义字段
const addCustomField = () => {
  form.customFields.push({
    name: '',
    value: ''
  })
}

// 移除自定义字段
const removeCustomField = (index: number) => {
  form.customFields.splice(index, 1)
}

// 显示高级字段
const toggleAdvancedFields = () => {
  showAdvancedFields.value = !showAdvancedFields.value
}

// 处理创建
const handleCreate = () => {
  dialogType.value = 'create'
  // 重置表单
  form.id = ''
  form.purchaseOrderId = ''
  form.destination = ''
  form.supplier = ''
  form.externalId = ''
  form.senderName = ''
  form.totalWeight = 0
  form.weightUnit = 'lb'
  form.items = []
  form.expectedArrivalDate = ''
  // 重置高级物流信息
  form.extShipmentId = ''
  form.incoterms = ''
  form.shippingCarrier = ''
  form.shippingMethod = ''
  form.shippingNote = ''
  form.bol = ''
  form.seal = ''
  form.trailerNumber = ''
  form.trailerSize = ''
  form.trailerType = ''
  form.containerNumber = ''
  form.containerSize = ''
  form.containerType = ''
  
  showAdvancedFields.value = false
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: Arrival) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.purchaseOrderId = row.purchaseOrder || ''
  form.destination = row.destination
  form.supplier = row.supplier || ''
  form.externalId = row.externalId || ''
  form.senderName = row.senderName || ''
  form.totalWeight = row.totalWeight || 0
  form.weightUnit = row.weightUnit || 'lb'
  form.expectedArrivalDate = row.expectedDate || ''
  form.items = [...(row.items || [])]
  // 加载高级字段数据
  form.extShipmentId = row.extShipmentId || ''
  form.incoterms = row.incoterms || ''
  form.shippingCarrier = row.shippingCarrier || ''
  form.shippingMethod = row.shippingMethod || ''
  form.shippingNote = row.shippingNote || ''
  form.bol = row.bol || ''
  form.seal = row.seal || ''
  form.trailerNumber = row.trailerNumber || ''
  form.trailerSize = row.trailerSize || ''
  form.trailerType = row.trailerType || ''
  form.containerNumber = row.containerNumber || ''
  form.containerSize = row.containerSize || ''
  form.containerType = row.containerType || ''
  dialogVisible.value = true
}

// 处理查看
const handleView = (row: Arrival) => {
  currentArrival.value = row
  viewDialogVisible.value = true
}

// 处理删除
const handleDelete = async (row: Arrival) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this arrival?')
    const index = arrivals.value.findIndex(arrival => arrival.id === row.id)
    if (index > -1) {
      arrivals.value.splice(index, 1)
      ElMessage.success('Arrival deleted successfully')
    }
  } catch {
    // 用户取消删除
  }
}

// 格式化日期
const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

// 处理保存
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const arrivalData = {
      id: form.id || Math.random().toString(36).substr(2, 9),
      arrivalNo: form.id ? form.externalId : 'ARR-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      purchaseOrder: form.purchaseOrderId,
      destination: form.destination,
      supplier: form.supplier,
      externalId: form.externalId,
      senderName: form.senderName,
      totalWeight: form.totalWeight,
      weightUnit: form.weightUnit,
      expectedDate: form.expectedArrivalDate,
      status: 'ordered',
      items: form.items.map(item => ({
        ...item,
        id: item.id || Math.random().toString(36).substr(2, 9)
      })),
      // 高级字段
      extShipmentId: form.extShipmentId,
      incoterms: form.incoterms,
      shippingCarrier: form.shippingCarrier,
      shippingMethod: form.shippingMethod,
      shippingNote: form.shippingNote,
      bol: form.bol,
      seal: form.seal,
      trailerNumber: form.trailerNumber,
      trailerSize: form.trailerSize,
      trailerType: form.trailerType,
      containerNumber: form.containerNumber,
      containerSize: form.containerSize,
      containerType: form.containerType
    }

    if (dialogType.value === 'create') {
      arrivals.value.unshift(arrivalData)
      ElMessage.success('Arrival created successfully')
    } else {
      const index = arrivals.value.findIndex(arrival => arrival.id === form.id)
      if (index > -1) {
        arrivals.value[index] = arrivalData
        ElMessage.success('Arrival updated successfully')
      }
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 处理提交
const handleSubmit = async () => {
  try {
    await handleSave()
  } catch (error) {
    console.error('Submit failed:', error)
  }
}

// 处理采购订单选择
const handlePurchaseOrderSelect = (poId: string) => {
  const po = purchaseOrders.value.find(po => po.id === poId)
  if (po) {
    form.destination = po.warehouse
    form.supplier = po.supplier
    // 从采购订单加载商品
    form.items = po.items.map(item => ({
      id: '',
      sku: item.sku,
      name: item.name,
      quantity: 0, // 到货数量，需要用户填写
      unit: 'pcs',
      lotNumber: '',
      palletQuantity: 0,
      upc: '',
      purchaseId: po.orderNo,
      isExisting: true,
      orderedQty: item.quantity // 添加订购数量供参考
    }))
  }
}

// 格式化状态
const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    draft: 'info',
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
.arrivals {
  padding: 20px;
  
  .page-card {
    background-color: var(--el-bg-color);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;

    h3 {
      margin: 0 0 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--el-border-color);
      font-size: 16px;
      font-weight: 600;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        margin: 0;
        padding: 0;
        border: none;
      }
    }

    .table-footer {
      margin-top: 16px;
      display: flex;
      justify-content: flex-start;
    }

    :deep(.el-form-item) {
      &.mb-0 {
        margin-bottom: 0;
      }
    }
  }

  .custom-field-row {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .custom-field-actions {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .empty-custom-fields {
    text-align: center;
    color: var(--el-text-color-secondary);
    padding: 24px 0;
  }

  .empty-items {
    text-align: center;
    color: var(--el-text-color-secondary);
    padding: 24px 0;
  }
}
</style> 