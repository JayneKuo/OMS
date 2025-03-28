<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-link @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          Back To Returns
        </el-link>
        <h1>Return Order No: {{ returnOrderNo }}</h1>
      </div>
      <div class="header-actions">
        <el-dropdown @command="handleAction">
          <el-button type="primary">
            Actions
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 通用操作 -->
              <el-dropdown-item command="create">
                <el-icon><Plus /></el-icon>
                New Return Order
              </el-dropdown-item>
              <el-dropdown-item command="rawData" :disabled="!returnOrder">
                <el-icon><Document /></el-icon>
                Raw Data
              </el-dropdown-item>

              <!-- 状态相关操作 -->
              <template v-if="returnOrder && RETURN_STATUS_CONFIG[returnOrder.status].availableActions.length">
                <el-dropdown-item divided></el-dropdown-item>
                <template v-for="action in RETURN_STATUS_CONFIG[returnOrder.status].availableActions" :key="action">
                  <el-dropdown-item :command="action">
                    {{ getActionLabel(action) }}
                  </el-dropdown-item>
                </template>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 订单信息卡片组 -->
    <div class="order-info-grid">
      <!-- 基本信息 -->
      <div class="info-card">
        <div class="card-header">
          <h3>Basic Information</h3>
        </div>
        <div class="card-content">
          <div class="info-item">
            <label>Return Type</label>
            <el-tag :type="returnOrder?.returnType === ReturnType.Refund ? 'danger' : 'warning'">
              {{ returnOrder?.returnType }}
            </el-tag>
          </div>
          <div class="info-item">
            <label>Status</label>
            <el-tag :type="getStatusType(returnOrder?.status)">
              {{ returnOrder?.status }}
            </el-tag>
          </div>
          <div class="info-item">
            <label>Create Date</label>
            <span>{{ formatDateTime(returnOrder?.createDate) }}</span>
          </div>
          <div class="info-item">
            <label>Original Order No</label>
            <el-link 
              type="primary" 
              @click="viewOriginalOrder(returnOrder?.originalOrderNo)"
            >
              {{ returnOrder?.originalOrderNo }}
            </el-link>
          </div>
        </div>
      </div>

      <!-- 客户信息 -->
      <div class="info-card">
        <div class="card-header">
          <h3>Customer Information</h3>
        </div>
        <div class="card-content">
          <div class="info-item">
            <label>Name</label>
            <span>{{ returnOrder?.customerName }}</span>
          </div>
          <div class="info-item">
            <label>Email</label>
            <span>{{ returnOrder?.customerEmail }}</span>
          </div>
          <div class="info-item">
            <label>Phone</label>
            <span>{{ returnOrder?.customerPhone }}</span>
          </div>
          <div class="info-item full">
            <label>Address</label>
            <span>{{ returnOrder?.address }}</span>
          </div>
          <div class="info-item">
            <label>Country</label>
            <span>{{ returnOrder?.country }}</span>
          </div>
        </div>
      </div>

      <!-- 退货信息 -->
      <div class="info-card">
        <div class="card-header">
          <h3>Return Information</h3>
        </div>
        <div class="card-content">
          <div class="info-item">
            <label>Reason</label>
            <span>{{ returnOrder?.reason }}</span>
          </div>
          <div class="info-item">
            <label>Total Amount</label>
            <span>${{ returnOrder?.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <label>Refund Amount</label>
            <span>${{ returnOrder?.refundAmount.toFixed(2) }}</span>
          </div>
          <div class="info-item">
            <label>Notes</label>
            <span>{{ returnOrder?.notes || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 物流信息 -->
      <div class="info-card" v-if="returnOrder?.trackingNumber">
        <div class="card-header">
          <h3>Shipping Information</h3>
        </div>
        <div class="card-content">
          <div class="info-item">
            <label>Carrier</label>
            <span>{{ returnOrder?.carrier }}</span>
          </div>
          <div class="info-item">
            <label>Tracking Number</label>
            <span>{{ returnOrder?.trackingNumber }}</span>
          </div>
          <div class="info-item">
            <label>Ship Date</label>
            <span>{{ returnOrder?.shipDate ? formatDateTime(returnOrder.shipDate) : '-' }}</span>
          </div>
          <div class="info-item">
            <label>Receive Date</label>
            <span>{{ returnOrder?.receiveDate ? formatDateTime(returnOrder.receiveDate) : '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 退货商品列表 -->
    <div class="items-section">
      <div class="section-header">
        <h3>Return Items</h3>
      </div>
      <el-table :data="returnOrder?.items || []" style="width: 100%">
        <el-table-column label="Product ID" prop="productId" min-width="150" />
        <el-table-column label="Product Name" prop="productName" min-width="200" />
        <el-table-column label="SKU" prop="sku" min-width="150" />
        <el-table-column label="Quantity" prop="quantity" width="100" align="right" />
        <el-table-column label="Original Price" width="120" align="right">
          <template #default="{ row }">
            ${{ row.originalPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="Refund Price" width="120" align="right">
          <template #default="{ row }">
            ${{ row.refundPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="Reason" prop="reason" min-width="150" />
        <el-table-column label="Notes" prop="notes" min-width="200" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Plus,
  Document,
  ArrowDown
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  ReturnOrderStatus,
  ReturnType,
  RETURN_STATUS_CONFIG,
  type ReturnOrder
} from './types'

const route = useRoute()
const router = useRouter()
const returnOrderNo = route.params.id as string
const returnOrder = ref<ReturnOrder>()

// 获取状态类型
const getStatusType = (status?: ReturnOrderStatus) => {
  if (!status) return ''
  return RETURN_STATUS_CONFIG[status].color
}

// 获取操作标签
const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    approve: 'Approve',
    reject: 'Reject',
    ship: 'Ship',
    receive: 'Receive',
    refund: 'Refund',
    cancel: 'Cancel'
  }
  return labels[action] || action
}

// 处理操作
const handleAction = async (command: string) => {
  switch (command) {
    case 'create':
      router.push('/return/create')
      break
    case 'rawData':
      // TODO: 实现查看原始数据功能
      break
    case 'approve':
      await handleApprove()
      break
    case 'reject':
      await handleReject()
      break
    case 'ship':
      await handleShip()
      break
    case 'receive':
      await handleReceive()
      break
    case 'refund':
      await handleRefund()
      break
    case 'cancel':
      await handleCancel()
      break
  }
}

// 查看原始订单
const viewOriginalOrder = (orderNo?: string) => {
  if (orderNo) {
    router.push(`/order/sales/${orderNo}`)
  }
}

// 处理审批
const handleApprove = async () => {
  try {
    // TODO: 实现审批功能
    // await api.approveReturnOrder(returnOrderNo.value)
    ElMessage.success('Return order approved successfully')
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to approve return order')
  }
}

// 处理拒绝
const handleReject = async () => {
  try {
    // TODO: 实现拒绝功能
    // await api.rejectReturnOrder(returnOrderNo.value)
    ElMessage.success('Return order rejected successfully')
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to reject return order')
  }
}

// 处理发货
const handleShip = async () => {
  try {
    // TODO: 实现发货功能
    // await api.shipReturnOrder(returnOrderNo.value)
    ElMessage.success('Return order shipped successfully')
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to ship return order')
  }
}

// 处理收货
const handleReceive = async () => {
  try {
    // TODO: 实现收货功能
    // await api.receiveReturnOrder(returnOrderNo.value)
    ElMessage.success('Return order received successfully')
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to receive return order')
  }
}

// 处理退款
const handleRefund = async () => {
  try {
    // TODO: 实现退款功能
    // await api.refundReturnOrder(returnOrderNo.value)
    ElMessage.success('Return order refunded successfully')
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to refund return order')
  }
}

// 处理取消
const handleCancel = async () => {
  try {
    // TODO: 实现取消功能
    // await api.cancelReturnOrder(returnOrderNo.value)
    ElMessage.success('Return order cancelled successfully')
    fetchData()
  } catch (error) {
    ElMessage.error('Failed to cancel return order')
  }
}

// 获取数据
const fetchData = async () => {
  try {
    // TODO: 实现数据获取
    // const response = await api.getReturnOrder(returnOrderNo.value)
    // returnOrder.value = response.data
  } catch (error) {
    ElMessage.error('Failed to fetch return order')
  }
}

// 格式化日期时间
const formatDateTime = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  background: var(--bg-dark);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.info-card {
  background: var(--component-bg);
  border-radius: 8px;
  overflow: hidden;

  .card-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .card-content {
    padding: 16px;

    .info-item {
      display: flex;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      label {
        width: 120px;
        color: var(--text-secondary);
      }

      span {
        flex: 1;
      }

      &.full {
        flex-direction: column;

        label {
          width: 100%;
          margin-bottom: 4px;
        }
      }
    }
  }
}

.items-section {
  background: var(--component-bg);
  border-radius: 8px;
  padding: 24px;

  .section-header {
    margin-bottom: 24px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style> 