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
        <div class="form-header">
          <el-button @click="toggleAdvancedFields">
            {{ showAdvancedFields ? 'Hide' : 'Show' }} Advanced Fields
          </el-button>
        </div>

        <!-- 商品列表 -->
        <div class="form-section">
          <el-table :data="form.items" border style="width: 100%">
            <el-table-column label="Product Name and SKU" min-width="300">
              <template #default="{ row, $index }">
                <template v-if="row.isExisting">
                  <div class="product-info">
                    <div>{{ row.name }}</div>
                    <div class="sku">{{ row.sku }}</div>
                  </div>
                </template>
                <el-form-item 
                  v-else
                  :prop="'items.' + $index + '.sku'"
                  :rules="{ required: true, message: 'Product is required' }"
                  class="mb-0"
                >
                  <el-select 
                    v-model="row.sku"
                    filterable
                    style="width: 100%"
                    placeholder="Select product"
                    @change="handleProductSelect($index, $event)"
                  >
                    <el-option
                      v-for="product in productOptions"
                      :key="product.sku"
                      :label="product.name + ' (' + product.sku + ')'"
                      :value="product.sku"
                    />
                  </el-select>
                </el-form-item>
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
            <el-table-column width="60">
              <template #default="{ row, $index }">
                <el-button 
                  v-if="!row.isExisting"
                  type="danger" 
                  link 
                  @click="removeItem($index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="table-footer">
            <el-button type="primary" link @click="addItem">
              <el-icon><Plus /></el-icon>
              Add
            </el-button>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import { mockPurchaseData } from '@/mock/purchaseData'
import type { Receipt, ReceiptItem, Warehouse } from '@/mock/purchaseData'

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
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref()
const form = reactive({
  id: '',
  externalId: '',
  actualArrivalDate: '',
  shippingCarrier: '',
  shippingClass: '',
  items: [] as Array<ReceiptItem & { isExisting?: boolean }>
})

// 表单校验规则
const rules = {
  externalId: [{ required: true, message: 'External receipt ID is required' }],
  actualArrivalDate: [{ required: true, message: 'Actual arrival date is required' }],
  shippingCarrier: [{ required: true, message: 'Shipping carrier is required' }],
  shippingClass: [{ required: true, message: 'Shipping class is required' }]
}

// 查看详情相关
const viewDialogVisible = ref(false)
const currentReceipt = ref<Receipt | null>(null)

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

// 处理商品选择
const handleProductSelect = (index: number, sku: string) => {
  const product = productOptions.find(p => p.sku === sku)
  if (product) {
    form.items[index].name = product.name
    form.items[index].shippedQty = 10 // 模拟数据
  }
}

// 添加商品
const addItem = () => {
  form.items.push({
    id: '',
    sku: '',
    name: '',
    shippedQty: 0,
    receivedQty: 0,
    unit: 'pcs',
    isExisting: false
  })
}

// 移除商品
const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

// 处理创建
const handleCreate = () => {
  dialogType.value = 'create'
  form.id = ''
  form.externalId = ''
  form.actualArrivalDate = ''
  form.shippingCarrier = ''
  form.shippingClass = ''
  form.items = [{
    id: '',
    sku: 'SKU001',
    name: 'Product 1',
    shippedQty: 10,
    receivedQty: 0,
    unit: 'pcs',
    isExisting: true
  }]
  showAdvancedFields.value = false
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: Receipt) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.externalId = row.externalId || ''
  form.actualArrivalDate = row.actualArrivalDate || ''
  form.shippingCarrier = row.shippingCarrier || ''
  form.shippingClass = row.shippingClass || ''
  form.items = row.items.map(item => ({
    ...item,
    isExisting: true
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
      externalId: form.externalId,
      actualArrivalDate: form.actualArrivalDate,
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
}
</style> 