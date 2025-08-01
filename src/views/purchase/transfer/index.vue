<template>
  <div class="transfer-orders">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>Transfer Orders</span>
          <el-button type="primary" @click="handleCreate">Create Transfer Order</el-button>
        </div>
      </template>
      
      <el-table :data="orders" style="width: 100%">
        <el-table-column prop="orderNo" label="Order No." width="120" />
        <el-table-column prop="fromWarehouse" label="From Warehouse" />
        <el-table-column prop="toWarehouse" label="To Warehouse" />
        <el-table-column prop="orderDate" label="Order Date" width="180">
          <template #default="{ row }">
            {{ formatDate(row.orderDate) }}
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
      :title="dialogType === 'create' ? 'Create Transfer Order' : 'Edit Transfer Order'"
      width="60%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 基本信息 -->
        <div class="form-section">
          <h3>Basic Information</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Source" prop="fromWarehouse">
                <el-select v-model="form.fromWarehouse" style="width: 100%" placeholder="Select source warehouse">
                  <el-option
                    v-for="warehouse in sourceWarehouses"
                    :key="warehouse.id"
                    :label="warehouse.name"
                    :value="warehouse.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Destination" prop="toWarehouse">
                <el-select v-model="form.toWarehouse" style="width: 100%" placeholder="Select destination warehouse">
                  <el-option
                    v-for="warehouse in destinationWarehouses"
                    :key="warehouse.id"
                    :label="warehouse.name"
                    :value="warehouse.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 明细信息 -->
        <div class="form-section">
          <h3>Details</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Reference No." prop="referenceNo">
                <el-input v-model="form.referenceNo" placeholder="Enter reference number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Remarks" prop="remarks">
                <el-input v-model="form.remarks" placeholder="Enter remarks" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 商品列表 -->
          <div class="items-section">
            <div class="items-header">
              <h4>Products</h4>
              <el-button type="primary" link @click="addItem">Add Item</el-button>
            </div>
            
            <el-table :data="form.items" border style="width: 100%">
              <el-table-column label="Product" min-width="200">
                <template #default="{ row, $index }">
                  <el-form-item :prop="'items.' + $index + '.sku'" :rules="{ required: true, message: 'Product is required' }">
                    <el-select v-model="row.sku" style="width: 100%" filterable placeholder="Select product">
                      <el-option
                        v-for="product in productOptions"
                        :key="product.sku"
                        :label="product.name"
                        :value="product.sku"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="Ordered" width="150">
                <template #default="{ row, $index }">
                  <el-form-item :prop="'items.' + $index + '.quantity'" :rules="{ required: true, type: 'number', min: 1 }">
                    <el-input-number v-model="row.quantity" :min="1" style="width: 100%" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="Available" width="120">
                <template #default="{ row, $index }">
                  {{ row.available || 0 }}
                </template>
              </el-table-column>
              <el-table-column label="After Shipping Request" width="180">
                <template #default="{ row, $index }">
                  {{ row.afterRequest || 0 }}
                </template>
              </el-table-column>
              <el-table-column label="Available" width="120">
                <template #default="{ row, $index }">
                  {{ row.destinationAvailable || 0 }}
                </template>
              </el-table-column>
              <el-table-column label="Upon Receipt" width="120">
                <template #default="{ row, $index }">
                  {{ (row.destinationAvailable || 0) + (row.quantity || 0) }}
                </template>
              </el-table-column>
              <el-table-column label="Actions" width="80" fixed="right">
                <template #default="{ $index }">
                  <el-button type="danger" link @click="removeItem($index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 物流信息 -->
        <div class="form-section">
          <h3>Shipping</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Expected Ship Date" prop="shipping.expectedShipDate">
                <el-date-picker
                  v-model="form.shipping.expectedShipDate"
                  type="date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Expected Arrival Date" prop="shipping.expectedArrivalDate">
                <el-date-picker
                  v-model="form.shipping.expectedArrivalDate"
                  type="date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="First Name" prop="shipping.firstName">
                <el-input v-model="form.shipping.firstName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Last Name" prop="shipping.lastName">
                <el-input v-model="form.shipping.lastName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Company Name" prop="shipping.companyName">
                <el-input v-model="form.shipping.companyName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Street Address" prop="shipping.streetAddress">
                <el-input v-model="form.shipping.streetAddress" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Address 2" prop="shipping.address2">
                <el-input v-model="form.shipping.address2" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="City" prop="shipping.city">
                <el-input v-model="form.shipping.city" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="State" prop="shipping.state">
                <el-input v-model="form.shipping.state" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="ZIP" prop="shipping.zip">
                <el-input v-model="form.shipping.zip" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Country" prop="shipping.country">
                <el-input v-model="form.shipping.country" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Shipping Service" prop="shipping.service">
                <el-select v-model="form.shipping.service" style="width: 100%">
                  <el-option label="Standard" value="standard" />
                  <el-option label="Express" value="express" />
                  <el-option label="Priority" value="priority" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Shipping Method" prop="shipping.method">
                <el-select v-model="form.shipping.method" style="width: 100%">
                  <el-option label="Ground" value="ground" />
                  <el-option label="Air" value="air" />
                  <el-option label="Ocean" value="ocean" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Shipping Notes" prop="shipping.notes">
                <el-input type="textarea" v-model="form.shipping.notes" rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="Transfer Order Details"
      width="60%"
    >
      <div v-if="currentOrder" class="order-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Order No.">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="From Warehouse">{{ currentOrder.fromWarehouse }}</el-descriptions-item>
          <el-descriptions-item label="To Warehouse">{{ currentOrder.toWarehouse }}</el-descriptions-item>
          <el-descriptions-item label="Order Date">{{ formatDate(currentOrder.orderDate) }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="getStatusType(currentOrder.status)">
              {{ formatStatus(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="items-table">
          <h3>Transfer Items</h3>
          <el-table :data="currentOrder.items" border>
            <el-table-column prop="sku" label="SKU" width="120" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="quantity" label="Quantity" width="120" />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { mockPurchaseData } from '@/mock/purchaseData'
import type { TransferOrder, TransferOrderItem } from '@/mock/purchaseData'

// 仓库列表
const warehouses = mockPurchaseData.warehouses

// 源仓库选项（排除已选的目标仓库）
const sourceWarehouses = computed(() => 
  warehouses.filter(w => w.status === 'active' && w.id !== form.toWarehouse)
)

// 目标仓库选项（排除已选的源仓库）
const destinationWarehouses = computed(() => 
  warehouses.filter(w => w.status === 'active' && w.id !== form.fromWarehouse)
)

// 商品选项（模拟数据）
const productOptions = [
  { sku: 'SKU001', name: 'Product 1' },
  { sku: 'SKU002', name: 'Product 2' },
  { sku: 'SKU003', name: 'Product 3' }
]

// 列表数据
const orders = ref<TransferOrder[]>(mockPurchaseData.transferOrders)

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref()

// 表单数据
const form = reactive({
  id: '',
  fromWarehouse: '',
  toWarehouse: '',
  referenceNo: '',
  remarks: '',
  items: [] as TransferOrderItem[],
  shipping: {
    expectedShipDate: '',
    expectedArrivalDate: '',
    firstName: '',
    lastName: '',
    companyName: '',
    streetAddress: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    service: 'standard',
    method: 'ground',
    notes: ''
  }
})

// 表单校验规则
const rules = {
  fromWarehouse: [{ required: true, message: 'Source warehouse is required' }],
  toWarehouse: [{ required: true, message: 'Destination warehouse is required' }],
  'shipping.expectedShipDate': [{ required: true, message: 'Expected ship date is required' }],
  'shipping.expectedArrivalDate': [{ required: true, message: 'Expected arrival date is required' }],
  'shipping.firstName': [{ required: true, message: 'First name is required' }],
  'shipping.lastName': [{ required: true, message: 'Last name is required' }],
  'shipping.streetAddress': [{ required: true, message: 'Street address is required' }],
  'shipping.city': [{ required: true, message: 'City is required' }],
  'shipping.state': [{ required: true, message: 'State is required' }],
  'shipping.zip': [{ required: true, message: 'ZIP is required' }],
  'shipping.country': [{ required: true, message: 'Country is required' }],
  'shipping.service': [{ required: true, message: 'Shipping service is required' }],
  'shipping.method': [{ required: true, message: 'Shipping method is required' }]
}

// 查看详情相关
const viewDialogVisible = ref(false)
const currentOrder = ref<TransferOrder | null>(null)

// 格式化函数
const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const formatStatus = (status: string) => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    draft: 'info',
    processing: 'warning',
    in_transit: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 添加商品
const addItem = () => {
  form.items.push({
    id: '',
    sku: '',
    name: '',
    quantity: 1,
    available: 0,
    afterRequest: 0,
    destinationAvailable: 0
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
  form.fromWarehouse = ''
  form.toWarehouse = ''
  form.referenceNo = ''
  form.remarks = ''
  form.items = []
  form.shipping = {
    expectedShipDate: '',
    expectedArrivalDate: '',
    firstName: '',
    lastName: '',
    companyName: '',
    streetAddress: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    service: 'standard',
    method: 'ground',
    notes: ''
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: TransferOrder) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.fromWarehouse = row.fromWarehouse
  form.toWarehouse = row.toWarehouse
  form.referenceNo = row.referenceNo || ''
  form.remarks = row.remarks || ''
  form.items = [...row.items]
  form.shipping = { ...row.shipping }
  dialogVisible.value = true
}

// 处理查看
const handleView = (row: TransferOrder) => {
  currentOrder.value = row
  viewDialogVisible.value = true
}

// 处理删除
const handleDelete = async (row: TransferOrder) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this order?')
    const index = orders.value.findIndex(order => order.id === row.id)
    if (index > -1) {
      orders.value.splice(index, 1)
      ElMessage.success('Order deleted successfully')
    }
  } catch {
    // 用户取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    const orderData = {
      id: form.id || Math.random().toString(36).substr(2, 9),
      orderNo: form.id ? currentOrder.value?.orderNo || '' : Math.random().toString(36).substr(2, 8).toUpperCase(),
      fromWarehouse: form.fromWarehouse,
      toWarehouse: form.toWarehouse,
      orderDate: new Date().toISOString(),
      status: 'draft', // Assuming a default status for new orders
      referenceNo: form.referenceNo,
      remarks: form.remarks,
      shipping: form.shipping,
      items: form.items.map(item => ({
        ...item,
        id: item.id || Math.random().toString(36).substr(2, 9)
      }))
    }

    if (dialogType.value === 'create') {
      orders.value.unshift(orderData)
      ElMessage.success('Order created successfully')
    } else {
      const index = orders.value.findIndex(order => order.id === form.id)
      if (index > -1) {
        orders.value[index] = orderData
        ElMessage.success('Order updated successfully')
      }
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}
</script>

<style lang="scss" scoped>
.transfer-orders {
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

    .items-section {
      margin-top: 20px;

      .items-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
  }

  .order-details {
    .items-table {
      margin-top: 20px;

      h3 {
        margin-bottom: 16px;
      }
    }
  }
}
</style> 