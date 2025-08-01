<template>
  <div class="purchase-order-detail">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <h2 class="title">Purchase Order Detail</h2>
            <el-tag :type="getStatusType(order?.status)">{{ formatStatus(order?.status) }}</el-tag>
          </div>
          <div class="header-actions">
            <el-button type="primary" @click="handleCreateArrival">Create Arrival</el-button>
            <el-button @click="$router.back()">Back</el-button>
          </div>
        </div>
      </template>

      <!-- 基本信息 -->
      <div class="info-section">
        <h3>Basic Information</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="Order No.">{{ order?.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="Supplier">{{ order?.supplier }}</el-descriptions-item>
          <el-descriptions-item label="Warehouse">{{ order?.warehouse }}</el-descriptions-item>
          <el-descriptions-item label="Order Date">{{ formatDate(order?.orderDate) }}</el-descriptions-item>
          <el-descriptions-item label="Total">{{ formatCurrency(order?.total) }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="getStatusType(order?.status)">{{ formatStatus(order?.status) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 商品列表 -->
      <div class="info-section">
        <h3>Order Items</h3>
        <el-table :data="order?.items" border style="width: 100%">
          <el-table-column prop="sku" label="SKU" width="120" />
          <el-table-column prop="name" label="Name" min-width="200" />
          <el-table-column prop="quantity" label="Ordered" width="100" align="right" />
          <el-table-column prop="price" label="Price" width="120" align="right">
            <template #default="{ row }">
              {{ formatCurrency(row.price) }}
            </template>
          </el-table-column>
          <el-table-column label="Total" width="120" align="right">
            <template #default="{ row }">
              {{ formatCurrency(row.quantity * row.price) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 到货记录 -->
      <div class="info-section">
        <div class="section-header">
          <h3>Arrivals</h3>
          <el-button type="primary" link @click="handleCreateArrival">
            <el-icon><Plus /></el-icon>
            Create Arrival
          </el-button>
        </div>
        <el-table :data="arrivals" border style="width: 100%">
          <el-table-column prop="arrivalNo" label="Arrival No." width="120" />
          <el-table-column prop="externalId" label="External ID" width="150" />
          <el-table-column prop="senderName" label="Sender" />
          <el-table-column prop="totalWeight" label="Total Weight" width="120">
            <template #default="{ row }">
              {{ row.totalWeight }} {{ row.weightUnit }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ formatStatus(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewArrival(row)">View</el-button>
              <el-button link type="primary" @click="handleCreateReceipt(row)">Create Receipt</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 收货记录 -->
      <div class="info-section">
        <div class="section-header">
          <h3>Receipts</h3>
        </div>
        <el-table :data="receipts" border style="width: 100%">
          <el-table-column prop="receiptNo" label="Receipt No." width="120" />
          <el-table-column prop="arrivalNo" label="Arrival No." width="120" />
          <el-table-column prop="externalId" label="External ID" width="150" />
          <el-table-column prop="receiptDate" label="Receipt Date" width="180">
            <template #default="{ row }">
              {{ formatDate(row.receiptDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ formatStatus(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewReceipt(row)">View</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 创建到货单对话框 -->
    <el-dialog
      v-model="arrivalDialogVisible"
      title="Create Arrival"
      width="80%"
      :before-close="handleCloseArrivalDialog"
    >
      <arrival-form 
        :purchase-order="order"
        @submit="handleArrivalSubmit"
        @cancel="arrivalDialogVisible = false"
      />
    </el-dialog>

    <!-- 创建收货单对话框 -->
    <el-dialog
      v-model="receiptDialogVisible"
      title="Create Receipt"
      width="80%"
      :before-close="handleCloseReceiptDialog"
    >
      <receipt-form 
        :arrival="selectedArrival"
        @submit="handleReceiptSubmit"
        @cancel="receiptDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { mockPurchaseData } from '@/mock/purchaseData'
import type { PurchaseOrder, Arrival, Receipt } from '@/mock/purchaseData'
import ArrivalForm from '../arrivals/components/ArrivalForm.vue'
import ReceiptForm from '../receipts/components/ReceiptForm.vue'

const route = useRoute()
const router = useRouter()

// 数据
const order = ref<PurchaseOrder | null>(null)
const arrivals = ref<Arrival[]>([])
const receipts = ref<Receipt[]>([])

// 对话框控制
const arrivalDialogVisible = ref(false)
const receiptDialogVisible = ref(false)
const selectedArrival = ref<Arrival | null>(null)

// 加载数据
onMounted(async () => {
  const orderId = route.params.id as string
  // 这里应该调用API获取数据，现在用模拟数据
  order.value = mockPurchaseData.purchaseOrders.find(o => o.id === orderId) || null
  if (order.value) {
    // 获取关联的到货和收货记录
    arrivals.value = mockPurchaseData.arrivals.filter(a => a.purchaseOrder === order.value?.orderNo)
    receipts.value = mockPurchaseData.receipts.filter(r => 
      arrivals.value.some(a => a.arrivalNo === r.arrivalNo)
    )
  }
})

// 格式化函数
const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

const formatCurrency = (amount?: number) => {
  if (amount == null) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatStatus = (status?: string) => {
  if (!status) return ''
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusType = (status?: string) => {
  if (!status) return 'info'
  const typeMap: Record<string, string> = {
    draft: 'info',
    confirmed: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 创建到货单
const handleCreateArrival = () => {
  if (!order.value) return
  arrivalDialogVisible.value = true
}

const handleCloseArrivalDialog = (done: () => void) => {
  ElMessage.warning('Changes will be lost')
  done()
}

const handleArrivalSubmit = (arrival: Arrival) => {
  arrivals.value.unshift(arrival)
  arrivalDialogVisible.value = false
  ElMessage.success('Arrival created successfully')
}

// 创建收货单
const handleCreateReceipt = (arrival: Arrival) => {
  selectedArrival.value = arrival
  receiptDialogVisible.value = true
}

const handleCloseReceiptDialog = (done: () => void) => {
  ElMessage.warning('Changes will be lost')
  done()
}

const handleReceiptSubmit = (receipt: Receipt) => {
  receipts.value.unshift(receipt)
  receiptDialogVisible.value = false
  ElMessage.success('Receipt created successfully')
}

// 查看详情
const handleViewArrival = (arrival: Arrival) => {
  router.push(`/purchase/arrivals/${arrival.id}`)
}

const handleViewReceipt = (receipt: Receipt) => {
  router.push(`/purchase/receipts/${receipt.id}`)
}
</script>

<style lang="scss" scoped>
.purchase-order-detail {
  padding: 20px;

  .page-card {
    background-color: var(--el-bg-color);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .info-section {
    margin-bottom: 30px;

    h3 {
      margin: 0 0 16px;
      font-size: 16px;
      font-weight: 600;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style> 