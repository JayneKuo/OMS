<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <el-link @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          Back To Returns
        </el-link>
        <h1>Create Return Order</h1>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="return-form"
    >
      <!-- 基本信息 -->
      <div class="form-section">
        <h3>Basic Information</h3>
        <el-form-item label="Original Order" prop="originalOrderNo">
          <el-select
            v-model="form.originalOrderNo"
            filterable
            remote
            :remote-method="searchOrders"
            :loading="loading"
            placeholder="Search order by order number"
            style="width: 100%"
            @change="handleOrderChange"
          >
            <el-option
              v-for="item in orderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Return Type" prop="returnType">
          <el-radio-group v-model="form.returnType">
            <el-radio
              v-for="type in RETURN_TYPES"
              :key="type.value"
              :label="type.value"
            >
              {{ type.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Reason" prop="reason">
          <el-select v-model="form.reason" placeholder="Select reason" style="width: 100%">
            <el-option
              v-for="reason in RETURN_REASONS"
              :key="reason.value"
              :label="reason.label"
              :value="reason.value"
            />
          </el-select>
        </el-form-item>
      </div>

      <!-- 客户信息 -->
      <div class="form-section">
        <h3>Customer Information</h3>
        <el-form-item label="Name" prop="customerName">
          <el-input v-model="form.customerName" />
        </el-form-item>

        <el-form-item label="Email" prop="customerEmail">
          <el-input v-model="form.customerEmail" />
        </el-form-item>

        <el-form-item label="Phone" prop="customerPhone">
          <el-input v-model="form.customerPhone" />
        </el-form-item>

        <el-form-item label="Address" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <el-form-item label="Country" prop="country">
          <el-input v-model="form.country" />
        </el-form-item>
      </div>

      <!-- 退货商品 -->
      <div class="form-section">
        <h3>Return Items</h3>
        <el-table :data="form.items" style="width: 100%">
          <el-table-column label="Product" min-width="200">
            <template #default="{ row }">
              <div class="product-cell">
                <span class="sku-name">{{ row.sku }}</span>
                <span class="product-name">{{ row.productName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Original Price" width="120">
            <template #default="{ row }">
              ${{ row.originalPrice.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="Return Qty" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="0"
                :max="row.maxQuantity"
                @change="calculateAmount"
              />
            </template>
          </el-table-column>
          <el-table-column label="Refund Price" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.refundPrice"
                :min="0"
                :max="row.originalPrice"
                :precision="2"
                @change="calculateAmount"
              />
            </template>
          </el-table-column>
          <el-table-column label="Reason" min-width="150">
            <template #default="{ row }">
              <el-select v-model="row.reason" placeholder="Select reason">
                <el-option
                  v-for="reason in RETURN_REASONS"
                  :key="reason.value"
                  :label="reason.label"
                  :value="reason.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Notes" min-width="200">
            <template #default="{ row }">
              <el-input v-model="row.notes" placeholder="Add notes" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 金额信息 -->
      <div class="form-section">
        <h3>Amount Information</h3>
        <el-form-item label="Total Amount">
          <span class="amount">${{ form.totalAmount.toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="Refund Amount">
          <span class="amount">${{ form.refundAmount.toFixed(2) }}</span>
        </el-form-item>
      </div>

      <!-- 备注 -->
      <div class="form-section">
        <h3>Notes</h3>
        <el-form-item label="Notes" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="Add any additional notes"
          />
        </el-form-item>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <el-button @click="router.back()">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Create Return Order</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  ArrowLeft
} from '@element-plus/icons-vue'
import {
  ReturnType,
  ReturnReason,
  RETURN_TYPES,
  RETURN_REASONS,
  type ReturnOrder,
  type ReturnItem
} from './types'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const orderOptions = ref<{ value: string; label: string }[]>([])

// 表单数据
const form = reactive({
  originalOrderNo: '',
  returnType: ReturnType.Refund,
  reason: ReturnReason.QualityIssue,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  address: '',
  country: '',
  items: [] as ReturnItem[],
  totalAmount: 0,
  refundAmount: 0,
  notes: ''
})

// 表单验证规则
const rules = {
  originalOrderNo: [
    { required: true, message: 'Please select original order', trigger: 'change' }
  ],
  returnType: [
    { required: true, message: 'Please select return type', trigger: 'change' }
  ],
  reason: [
    { required: true, message: 'Please select reason', trigger: 'change' }
  ],
  customerName: [
    { required: true, message: 'Please enter customer name', trigger: 'blur' }
  ],
  customerEmail: [
    { required: true, message: 'Please enter customer email', trigger: 'blur' },
    { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
  ],
  customerPhone: [
    { required: true, message: 'Please enter customer phone', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Please enter address', trigger: 'blur' }
  ],
  country: [
    { required: true, message: 'Please enter country', trigger: 'blur' }
  ]
}

// 搜索订单
const searchOrders = async (query: string) => {
  if (query) {
    loading.value = true
    try {
      // TODO: 实现订单搜索
      // const response = await api.searchOrders(query)
      // orderOptions.value = response.data.map(order => ({
      //   value: order.orderNo,
      //   label: `${order.orderNo} - ${order.customerName}`
      // }))
    } catch (error) {
      ElMessage.error('Failed to search orders')
    } finally {
      loading.value = false
    }
  } else {
    orderOptions.value = []
  }
}

// 处理订单选择
const handleOrderChange = async (orderNo: string) => {
  if (!orderNo) return

  try {
    // TODO: 实现获取订单详情
    // const response = await api.getOrder(orderNo)
    // const order = response.data
    
    // 填充客户信息
    form.customerName = order.customerName
    form.customerEmail = order.customerEmail
    form.customerPhone = order.customerPhone
    form.address = order.address
    form.country = order.country

    // 填充商品信息
    form.items = order.items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: 0,
      maxQuantity: item.quantity,
      originalPrice: item.unitPrice,
      refundPrice: item.unitPrice,
      reason: form.reason,
      notes: ''
    }))
  } catch (error) {
    ElMessage.error('Failed to fetch order details')
  }
}

// 计算金额
const calculateAmount = () => {
  form.totalAmount = form.items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  form.refundAmount = form.items.reduce((sum, item) => sum + item.refundPrice * item.quantity, 0)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 实现创建退货订单
        // await api.createReturnOrder(form)
        ElMessage.success('Return order created successfully')
        router.push('/return')
      } catch (error) {
        ElMessage.error('Failed to create return order')
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  background: var(--bg-dark);
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
  }
}

.return-form {
  background: var(--component-bg);
  padding: 24px;
  border-radius: 8px;

  .form-section {
    margin-bottom: 32px;

    h3 {
      margin: 0 0 24px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .product-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .sku-name {
      font-weight: 500;
    }

    .product-name {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }

  .amount {
    font-size: 16px;
    font-weight: 500;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
  }
}
</style> 