<template>
  <div class="purchase-orders">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>Purchase Orders</span>
          <el-button type="primary" @click="handleCreate">Create Purchase Order</el-button>
        </div>
      </template>
      
      <el-table :data="orders" style="width: 100%">
        <el-table-column prop="orderNo" label="Order No." width="120" />
        <el-table-column prop="supplier" label="Supplier" />
        <el-table-column prop="warehouse" label="Warehouse" />
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
        <el-table-column prop="total" label="Total" width="120">
          <template #default="{ row }">
            {{ formatCurrency(row.total) }}
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
      :title="dialogType === 'create' ? 'Create Purchase Order' : 'Edit Purchase Order'"
      width="60%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 供应商信息 -->
        <div class="form-section">
          <h3>Supplier Information</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Supplier List" prop="supplierList">
                <el-select v-model="form.supplierList" style="width: 100%" clearable placeholder="Select or enter new supplier">
                  <el-option label="New Supplier" value="new" />
                  <el-option
                    v-for="supplier in supplierOptions"
                    :key="supplier.id"
                    :label="supplier.name"
                    :value="supplier.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Supplier Name" prop="supplier.name">
                <el-input v-model="form.supplier.name" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Contact First Name" prop="supplier.contactFirstName">
                <el-input v-model="form.supplier.contactFirstName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Contact Last Name" prop="supplier.contactLastName">
                <el-input v-model="form.supplier.contactLastName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Email" prop="supplier.email">
                <el-input v-model="form.supplier.email" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Phone" prop="supplier.phone">
                <el-input v-model="form.supplier.phone" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Address 1" prop="supplier.address.address1">
                <el-input v-model="form.supplier.address.address1" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Address 2" prop="supplier.address.address2">
                <el-input v-model="form.supplier.address.address2" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="City" prop="supplier.address.city">
                <el-input v-model="form.supplier.address.city" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="State" prop="supplier.address.state">
                <el-input v-model="form.supplier.address.state" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="ZIP" prop="supplier.address.zip">
                <el-input v-model="form.supplier.address.zip" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Country" prop="supplier.address.country">
                <el-input v-model="form.supplier.address.country" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Notes" prop="supplier.notes">
                <el-input type="textarea" v-model="form.supplier.notes" rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 基本信息 -->
        <div class="form-section">
          <h3>Basic Information</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Warehouse" prop="warehouseId">
                <el-select v-model="form.warehouseId" style="width: 100%">
                  <el-option
                    v-for="warehouse in activeWarehouses"
                    :key="warehouse.id"
                    :label="warehouse.name"
                    :value="warehouse.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Status" prop="status">
                <el-select v-model="form.status" style="width: 100%">
                  <el-option
                    v-for="status in statusOptions"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 物流信息 -->
        <div class="form-section">
          <h3>Shipping Information</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="Service" prop="shipping.shippingService">
                <el-select v-model="form.shipping.shippingService" style="width: 100%">
                  <el-option label="Standard" value="Standard" />
                  <el-option label="Express" value="Express" />
                  <el-option label="Priority" value="Priority" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Ship Date" prop="shipping.expectedShipDate">
                <el-date-picker
                  v-model="form.shipping.expectedShipDate"
                  type="date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Arrival Date" prop="shipping.expectedArrivalDate">
                <el-date-picker
                  v-model="form.shipping.expectedArrivalDate"
                  type="date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Address 1" prop="shipping.address.address1">
                <el-input v-model="form.shipping.address.address1" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Address 2" prop="shipping.address.address2">
                <el-input v-model="form.shipping.address.address2" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="City" prop="shipping.address.city">
                <el-input v-model="form.shipping.address.city" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="State" prop="shipping.address.state">
                <el-input v-model="form.shipping.address.state" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="ZIP" prop="shipping.address.zip">
                <el-input v-model="form.shipping.address.zip" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Country" prop="shipping.address.country">
                <el-input v-model="form.shipping.address.country" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Reference" prop="shipping.referenceNumber">
                <el-input v-model="form.shipping.referenceNumber" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Memo" prop="shipping.memo">
                <el-input type="textarea" v-model="form.shipping.memo" rows="3" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
        <!-- 订单明细 -->
        <div class="form-section">
          <div class="section-header">
            <h3>Order Items</h3>
            <el-button type="primary" link @click="addItem">Add Item</el-button>
          </div>
          
          <div v-for="(item, index) in form.items" :key="index" class="item-row">
            <el-row :gutter="20">
              <el-col :span="4">
                <el-form-item :prop="'items.' + index + '.sku'" :rules="{ required: true, message: 'SKU is required' }">
                  <el-input v-model="item.sku" placeholder="SKU" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item :prop="'items.' + index + '.supplierSku'">
                  <el-input v-model="item.supplierSku" placeholder="Supplier SKU" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :prop="'items.' + index + '.name'" :rules="{ required: true, message: 'Name is required' }">
                  <el-input v-model="item.name" placeholder="Name" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item :prop="'items.' + index + '.quantity'" :rules="{ required: true, type: 'number', min: 1 }">
                  <el-input-number v-model="item.quantity" :min="1" placeholder="Ordered" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item :prop="'items.' + index + '.price'" :rules="{ required: true, type: 'number', min: 0 }">
                  <el-input-number v-model="item.price" :min="0" :precision="2" placeholder="Price" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <div class="item-total">{{ formatCurrency(item.quantity * item.price) }}</div>
              </el-col>
              <el-col :span="1">
                <el-button type="danger" link @click="removeItem(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-col>
            </el-row>
          </div>

          <div class="order-total">
            Total: {{ formatCurrency(calculateTotal()) }}
          </div>
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
      title="Purchase Order Details"
      width="60%"
    >
      <div v-if="currentOrder" class="order-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Order No.">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="Supplier">{{ currentOrder.supplier }}</el-descriptions-item>
          <el-descriptions-item label="Warehouse">{{ currentOrder.warehouse }}</el-descriptions-item>
          <el-descriptions-item label="Order Date">{{ formatDate(currentOrder.orderDate) }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="getStatusType(currentOrder.status)">
              {{ formatStatus(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="items-table">
          <h3>Order Items</h3>
          <el-table :data="currentOrder.items" border>
            <el-table-column prop="sku" label="SKU" width="120" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="quantity" label="Quantity" width="100" />
            <el-table-column prop="price" label="Price" width="120">
              <template #default="{ row }">
                {{ formatCurrency(row.price) }}
              </template>
            </el-table-column>
            <el-table-column label="Total" width="120">
              <template #default="{ row }">
                {{ formatCurrency(row.quantity * row.price) }}
              </template>
            </el-table-column>
          </el-table>

          <div class="order-total">
            Total: {{ formatCurrency(currentOrder.total) }}
          </div>
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
import type { PurchaseOrder, PurchaseOrderItem, Warehouse } from '@/mock/purchaseData'

// 状态选项
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

// 列表数据
const orders = ref<PurchaseOrder[]>(mockPurchaseData.purchaseOrders)

// 获取仓库列表
const warehouses = mockPurchaseData.warehouses

// 只显示激活状态的仓库
const activeWarehouses = computed(() => 
  warehouses.filter(w => w.status === 'active')
)

// 供应商选项（模拟数据）
const supplierOptions = [
  { id: '1', name: 'Supplier A' },
  { id: '2', name: 'Supplier B' },
  { id: '3', name: 'Supplier C' }
]

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref()
const form = reactive({
  id: '',
  supplierList: '',
  supplier: {
    name: '',
    contactFirstName: '',
    contactLastName: '',
    email: '',
    phone: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    notes: ''
  },
  warehouseId: '',
  shipping: {
    shippingService: 'Standard',
    expectedShipDate: '',
    expectedArrivalDate: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    referenceNumber: '',
    memo: ''
  },
  status: 'draft',
  items: [] as PurchaseOrderItem[]
})

// 表单校验规则
const rules = {
  'supplier.name': [{ required: true, message: 'Supplier name is required' }],
  'supplier.contactFirstName': [{ required: true, message: 'Contact first name is required' }],
  'supplier.contactLastName': [{ required: true, message: 'Contact last name is required' }],
  'supplier.email': [{ required: true, message: 'Email is required' }],
  'supplier.phone': [{ required: true, message: 'Phone is required' }],
  'supplier.address.address1': [{ required: true, message: 'Address is required' }],
  'supplier.address.city': [{ required: true, message: 'City is required' }],
  'supplier.address.state': [{ required: true, message: 'State is required' }],
  'supplier.address.zip': [{ required: true, message: 'ZIP is required' }],
  'supplier.address.country': [{ required: true, message: 'Country is required' }],
  warehouseId: [{ required: true, message: 'Warehouse is required' }],
  'shipping.shippingService': [{ required: true, message: 'Shipping service is required' }],
  'shipping.expectedShipDate': [{ required: true, message: 'Expected ship date is required' }],
  'shipping.expectedArrivalDate': [{ required: true, message: 'Expected arrival date is required' }],
  'shipping.address.address1': [{ required: true, message: 'Shipping address is required' }],
  'shipping.address.city': [{ required: true, message: 'City is required' }],
  'shipping.address.state': [{ required: true, message: 'State is required' }],
  'shipping.address.zip': [{ required: true, message: 'ZIP is required' }],
  'shipping.address.country': [{ required: true, message: 'Country is required' }],
  status: [{ required: true, message: 'Status is required' }]
}

// 查看详情相关
const viewDialogVisible = ref(false)
const currentOrder = ref<PurchaseOrder | null>(null)

// 格式化函数
const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    draft: 'info',
    confirmed: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 计算订单总金额
const calculateTotal = () => {
  return form.items.reduce((total, item) => total + (item.quantity * item.price), 0)
}

// 处理创建
const handleCreate = () => {
  dialogType.value = 'create'
  form.id = ''
  form.supplierList = ''
  form.supplier = {
    name: '',
    contactFirstName: '',
    contactLastName: '',
    email: '',
    phone: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    notes: ''
  }
  form.warehouseId = ''
  form.shipping = {
    shippingService: 'Standard',
    expectedShipDate: '',
    expectedArrivalDate: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    referenceNumber: '',
    memo: ''
  }
  form.status = 'draft'
  form.items = []
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: PurchaseOrder) => {
  dialogType.value = 'edit'
  form.id = row.id
  form.supplier = { ...row.supplier }
  form.warehouseId = row.warehouseId
  form.shipping = { ...row.shipping }
  form.status = row.status
  form.items = [...row.items]
  dialogVisible.value = true
}

// 处理查看
const handleView = (row: PurchaseOrder) => {
  currentOrder.value = row
  viewDialogVisible.value = true
}

// 处理删除
const handleDelete = async (row: PurchaseOrder) => {
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

// 添加订单项
const addItem = () => {
  form.items.push({
    id: '',
    sku: '',
    name: '',
    quantity: 1,
    price: 0,
    total: 0
  })
}

// 移除订单项
const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    const selectedWarehouse = warehouses.find(w => w.id === form.warehouseId)
    const orderData = {
      id: form.id || Math.random().toString(36).substr(2, 9),
      orderNo: form.id ? currentOrder.value?.orderNo || '' : Math.random().toString(36).substr(2, 8).toUpperCase(),
      supplier: form.supplier.name, // Assuming supplier name is enough for now
      warehouseId: form.warehouseId,
      warehouse: selectedWarehouse?.name || '',
      orderDate: new Date().toISOString(),
      status: form.status,
      total: calculateTotal(),
      items: form.items.map(item => ({
        ...item,
        id: item.id || Math.random().toString(36).substr(2, 9),
        total: item.quantity * item.price
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
.purchase-orders {
  padding: 20px;
  
  .page-card {
    background-color: var(--el-bg-color);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .items-section {
    margin: 20px 0;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 20px;

    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        margin: 0;
      }
    }

    .item-row {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px dashed var(--el-border-color);

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .item-total {
        line-height: 32px;
        text-align: right;
      }
    }
  }

  .order-total {
    text-align: right;
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
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
}
</style> 