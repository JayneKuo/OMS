<template>
  <div class="receipts">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>Receipts</span>
          <el-button type="primary" @click="handleCreate">Add Receipt</el-button>
        </div>
      </template>
      
      <el-table :data="receipts" style="width: 100%">
        <el-table-column prop="receiptNo" label="Receipt No." width="120" />
        <el-table-column prop="externalId" label="External Receipt ID" width="150" />
        <el-table-column prop="shippingCarrier" label="Shipping Carrier" />
        <el-table-column prop="shippingClass" label="Shipping Class" />
        <el-table-column prop="actualArrivalDate" label="Arrival Date" width="180">
          <template #default="{ row }">
            {{ formatDate(row.actualArrivalDate) }}
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
      :title="dialogType === 'create' ? 'Add Receipt' : 'Edit Receipt'"
      width="800px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3>Basic Info</h3>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Arrival" prop="arrivalId">
                <el-select 
                  v-model="form.arrivalId" 
                  style="width: 100%"
                  placeholder="Select Arrival"
                  @change="handleArrivalSelect"
                  :disabled="dialogType === 'edit'"
                >
                  <el-option
                    v-for="arrival in availableArrivals"
                    :key="arrival.id"
                    :label="`${arrival.arrivalNo} - ${arrival.externalId}`"
                    :value="arrival.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Purchase Order" prop="purchaseOrder">
                <el-input v-model="form.purchaseOrder" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="External ID" prop="externalId">
                <el-input v-model="form.externalId" placeholder="Enter external receipt ID" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Receipt Date" prop="receiptDate">
                <el-date-picker
                  v-model="form.receiptDate"
                  type="date"
                  style="width: 100%"
                  placeholder="Select receipt date"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Shipping Carrier" prop="shippingCarrier">
                <el-input v-model="form.shippingCarrier" placeholder="Enter shipping carrier" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Shipping Class" prop="shippingClass">
                <el-input v-model="form.shippingClass" placeholder="Enter shipping class" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-header">
          <el-button @click="toggleAdvancedFields">
            {{ showAdvancedFields ? 'Hide' : 'Show' }} Advanced Fields
          </el-button>
        </div>

        <!-- 商品列表 -->
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
            <el-table-column label="Shipped" width="100" align="center">
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

          <div v-if="form.items.length === 0" class="empty-items">
            <p>Please select an arrival to load items</p>
          </div>
        </div>

        <!-- 物流信息 -->
        <div class="form-section" v-show="showAdvancedFields">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="External ID" prop="externalId">
                <el-input v-model="form.externalId" placeholder="Enter external receipt ID" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Arrival Date" prop="actualArrivalDate">
                <el-date-picker
                  v-model="form.actualArrivalDate"
                  type="date"
                  style="width: 100%"
                  placeholder="Select arrival date"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Shipping Carrier" prop="shippingCarrier">
                <el-input v-model="form.shippingCarrier" placeholder="Enter shipping carrier" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Shipping Class" prop="shippingClass">
                <el-input v-model="form.shippingClass" placeholder="Enter shipping class" />
              </el-form-item>
            </el-col>
          </el-row>
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
      title="Receipt Details"
      width="60%"
    >
      <div v-if="currentReceipt" class="receipt-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Receipt No.">{{ currentReceipt.receiptNo }}</el-descriptions-item>
          <el-descriptions-item label="Purchase Order">{{ currentReceipt.purchaseOrder }}</el-descriptions-item>
          <el-descriptions-item label="Arrival No.">{{ currentReceipt.arrivalNo }}</el-descriptions-item>
          <el-descriptions-item label="Warehouse">{{ currentReceipt.warehouse }}</el-descriptions-item>
          <el-descriptions-item label="Receipt Date">{{ formatDate(currentReceipt.receiptDate) }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="getStatusType(currentReceipt.status)">
              {{ formatStatus(currentReceipt.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="items-table">
          <h3>Receipt Items</h3>
          <el-table :data="currentReceipt.items" border>
            <el-table-column prop="sku" label="SKU" width="120" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="expectedQty" label="Expected Qty" width="120" />
            <el-table-column prop="receivedQty" label="Received Qty" width="120" />
            <el-table-column prop="note" label="Note" min-width="200" show-overflow-tooltip />
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
import type { Receipt, ReceiptItem, Warehouse } from '@/mock/purchaseData'

const route = useRoute()

// 采购订单选项（模拟数据）
const purchaseOrderOptions = [
  'PO20240001',
  'PO20240002',
  'PO20240003',
  'PO20240004',
  'PO20240005'
]

// 到货单选项（模拟数据）
const arrivalOptions = [
  'ARR20240001',
  'ARR20240002',
  'ARR20240003',
  'ARR20240004',
  'ARR20240005'
]

// 状态选项
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' }
]

// 商品选项（模拟数据）
const productOptions = [
  { sku: 'SKU001', name: 'Product 1' },
  { sku: 'SKU002', name: 'Product 2' },
  { sku: 'SKU003', name: 'Product 3' }
]

// 到货单列表
const availableArrivals = computed(() => 
  mockPurchaseData.arrivals.filter(arrival => 
    arrival.status === 'shipped' || arrival.status === 'arrived'
  )
)

// 列表数据
const receipts = ref<Receipt[]>(mockPurchaseData.receipts)

// 获取仓库列表
const warehouses = mockPurchaseData.warehouses

// 只显示激活状态的仓库
const activeWarehouses = computed(() => 
  warehouses.filter(w => w.status === 'active')
)

// 高级字段显示控制
const showAdvancedFields = ref(false)

// 表单相关
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const currentReceipt = ref<Receipt | null>(null)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref()
const form = reactive({
  id: '',
  arrivalId: '',
  purchaseOrder: '',
  externalId: '',
  receiptDate: '',
  shippingCarrier: '',
  shippingClass: '',
  items: [] as Array<{
    id: string
    sku: string
    name: string
    shippedQty: number
    receivedQty: number
    unit: string
  }>
})

// 表单校验规则
const rules = {
  arrivalId: [{ required: true, message: 'Arrival is required' }],
  externalId: [{ required: true, message: 'External receipt ID is required' }],
  receiptDate: [{ required: true, message: 'Receipt date is required' }],
  shippingCarrier: [{ required: true, message: 'Shipping carrier is required' }],
  shippingClass: [{ required: true, message: 'Shipping class is required' }]
}

// 检查URL参数，如果有arrivalId则自动打开创建对话框
onMounted(() => {
  const arrivalId = route.query.arrivalId as string
  if (arrivalId) {
    handleCreate()
    // 自动选择到货单
    form.arrivalId = arrivalId
    handleArrivalSelect(arrivalId)
  }
})

// 格式化函数
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    draft: 'info',
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 切换高级字段显示
const toggleAdvancedFields = () => {
  showAdvancedFields.value = !showAdvancedFields.value
}

// 处理到货单选择
const handleArrivalSelect = (arrivalId: string) => {
  const arrival = availableArrivals.value.find(a => a.id === arrivalId)
  if (arrival) {
    form.purchaseOrder = arrival.purchaseOrder || ''
    form.shippingCarrier = arrival.shippingCarrier || ''
    // 从到货单加载商品
    form.items = (arrival.items || []).map(item => ({
      id: '',
      sku: item.sku,
      name: item.name,
      shippedQty: item.quantity,
      receivedQty: 0,
      unit: item.unit
    }))
  }
}

// 处理创建
const handleCreate = () => {
  dialogType.value = 'create'
  // 重置表单
  form.id = ''
  form.arrivalId = ''
  form.purchaseOrder = ''
  form.externalId = ''
  form.receiptDate = ''
  form.shippingCarrier = ''
  form.shippingClass = ''
  form.items = []
  showAdvancedFields.value = false
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: Receipt) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.arrivalId = row.arrivalNo || ''
  form.purchaseOrder = row.purchaseOrder || ''
  form.externalId = row.externalId || ''
  form.receiptDate = row.receiptDate || ''
  form.shippingCarrier = row.shippingCarrier || ''
  form.shippingClass = row.shippingClass || ''
  form.items = (row.items || []).map(item => ({
    id: item.id,
    sku: item.sku,
    name: item.name,
    shippedQty: item.shippedQty || 0,
    receivedQty: item.receivedQty,
    unit: item.unit
  }))
  showAdvancedFields.value = false
  dialogVisible.value = true
}

// 处理查看
const handleView = (row: Receipt) => {
  currentReceipt.value = row
  viewDialogVisible.value = true
}

// 处理删除
const handleDelete = async (row: Receipt) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this receipt?')
    const index = receipts.value.findIndex(receipt => receipt.id === row.id)
    if (index > -1) {
      receipts.value.splice(index, 1)
      ElMessage.success('Receipt deleted successfully')
    }
  } catch {
    // 用户取消删除
  }
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const receiptData = {
      id: form.id || Math.random().toString(36).substr(2, 9),
      receiptNo: form.id ? form.externalId : 'REC-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      arrivalNo: form.arrivalId,
      purchaseOrder: form.purchaseOrder,
      externalId: form.externalId,
      receiptDate: form.receiptDate,
      shippingCarrier: form.shippingCarrier,
      shippingClass: form.shippingClass,
      status: 'pending',
      items: form.items.map(item => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        sku: item.sku,
        name: item.name,
        shippedQty: item.shippedQty,
        receivedQty: item.receivedQty,
        unit: item.unit
      }))
    }

    if (dialogType.value === 'create') {
      receipts.value.unshift(receiptData)
      ElMessage.success('Receipt created successfully')
    } else {
      const index = receipts.value.findIndex(receipt => receipt.id === form.id)
      if (index > -1) {
        receipts.value[index] = receiptData
        ElMessage.success('Receipt updated successfully')
      }
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}
</script>

<style lang="scss" scoped>
.receipts {
  padding: 20px;
  
  .page-card {
    background-color: var(--el-bg-color);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
  }

  .form-section {
    margin-bottom: 30px;

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

  .product-info {
    .sku {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 4px;
    }
  }

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

  .empty-items {
    text-align: center;
    color: var(--el-text-color-secondary);
    padding: 24px 0;
  }
}
</style> 