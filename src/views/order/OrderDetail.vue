<template>
  <div class="order-detail">
    <!-- 基本信息卡片 -->
    <div class="detail-card">
      <div class="card-header">
        <h3 class="title">订单信息</h3>
        <OrderStatusTag :status="orderStatus" />
      </div>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="系统订单号">
          {{ orderData.systemOrderId }}
        </el-descriptions-item>
        <el-descriptions-item label="渠道订单号">
          {{ orderData.channelOrderId }}
        </el-descriptions-item>
        <el-descriptions-item label="渠道">
          {{ orderData.channel }}
        </el-descriptions-item>
        <el-descriptions-item label="客户姓名">
          {{ orderData.customerName }}
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">
          {{ formatAmount(orderData.amount) }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatTime(orderData.createTime) }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 调试信息 -->
    <div class="debug-info" style="background: #f0f0f0; padding: 16px; margin-bottom: 16px; border-radius: 8px;">
      <h3>调试信息</h3>
      <p><strong>当前状态:</strong> {{ orderStatus }}</p>
      <p><strong>动态节点数量:</strong> {{ dynamicNodes.length }}</p>
      <p><strong>动态节点内容:</strong> {{ JSON.stringify(dynamicNodes, null, 2) }}</p>
    </div>

    <!-- 状态进度条 -->
    <OrderStatusProgress
      :current-status="orderStatus"
      :status-times="statusTimes"
      :dynamic-nodes="dynamicNodes"
      @dynamic-node-click="handleDynamicNodeClick"
    />

    <!-- 商品信息卡片 -->
    <div class="detail-card">
      <div class="card-header">
        <h3 class="title">商品信息</h3>
      </div>
      <el-table :data="orderData.items" border style="width: 100%">
        <el-table-column prop="sku" label="SKU" width="180" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="quantity" label="数量" width="100" align="center" />
        <el-table-column prop="price" label="单价" width="120" align="right">
          <template #default="scope">
            {{ formatAmount(scope.row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="小计" width="120" align="right">
          <template #default="scope">
            {{ formatAmount(scope.row.price * scope.row.quantity) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStatusStore } from '@/stores/orderStatus'
import { OrderStatus } from '@/types/order'
import type { OrderData } from '@/types/queryToolTypes'
import OrderStatusTag from '@/components/OrderStatusTag.vue'
import OrderStatusProgress from '@/components/OrderStatusProgress.vue'

const route = useRoute()
const router = useRouter()
const orderStatusStore = useOrderStatusStore()

// 订单数据
const orderData = ref<OrderData>({
  channelOrderId: 'SO00184716',
  systemOrderId: 'SYS-001',
  channel: 'Amazon - Shopify - OMS',
  status: OrderStatus.Pending, // 设置为Pending状态用于测试
  customerName: 'Dander Muffin LTD',
  amount: 100,
  createTime: Date.now(),
  items: [
    {
      sku: 'SKU-001',
      name: 'Test Product',
      quantity: 1,
      price: 100
    }
  ],
  systemCreateTime: Date.now()
})

// 订单状态
const orderStatus = computed(() => {
  return (orderData.value.status as OrderStatus) || OrderStatus.Imported
})

// 状态时间记录
const statusTimes = computed(() => {
  const times: Record<string, string> = {}
  // 添加当前状态的时间
  if (orderData.value.systemCreateTime) {
    times[orderStatus.value] = formatTime(orderData.value.systemCreateTime)
  }
  // 添加历史状态的时间
  orderStatusStore.statusHistory.forEach(item => {
    if (item.time) {
      times[item.status] = item.time
    }
  })
  return times
})

// 动态节点
const dynamicNodes = computed(() => {
  const nodes = []
  const status = orderStatus.value

  // 根据当前状态添加动态节点
  if (status) {
    switch (status) {
      case OrderStatus.Pending:
        nodes.push({
          status: OrderStatus.Pending,
          position: 'beforeAllocated',
          reason: '待处理',
          time: orderData.value.systemCreateTime ? formatTime(orderData.value.systemCreateTime) : undefined
        })
        break
      case OrderStatus.Exception:
        nodes.push({
          status: OrderStatus.Exception,
          position: 'afterAllocated',
          reason: '异常',
          time: orderData.value.systemCreateTime ? formatTime(orderData.value.systemCreateTime) : undefined
        })
        break
      case OrderStatus.Deallocated:
        nodes.push({
          status: OrderStatus.Deallocated,
          position: 'afterAllocated',
          reason: '已取消分配',
          time: orderData.value.systemCreateTime ? formatTime(orderData.value.systemCreateTime) : undefined
        })
        break
      case OrderStatus.Cancelling:
        nodes.push({
          status: OrderStatus.Cancelling,
          position: 'beforeWarehouse',
          reason: '取消中',
          time: orderData.value.systemCreateTime ? formatTime(orderData.value.systemCreateTime) : undefined
        })
        break
      case OrderStatus.Canceled:
        nodes.push({
          status: OrderStatus.Canceled,
          position: 'afterWarehouse',
          reason: '已取消',
          time: orderData.value.systemCreateTime ? formatTime(orderData.value.systemCreateTime) : undefined
        })
        break
    }
  }

  return nodes
})

// 格式化金额
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount)
}

// 格式化时间
const formatTime = (timestamp: number | string) => {
  if (!timestamp) return '-'
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (e) {
    return String(timestamp)
  }
}

// 获取发货状态类型
const getFulfillmentStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    processing: 'info',
    shipped: 'success',
    delivered: 'success',
    exception: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取发货状态标签
const getFulfillmentStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: '待发货',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
    exception: '异常'
  }
  return labelMap[status] || status
}

// 处理动态节点点击
const handleDynamicNodeClick = (data: {
  status: OrderStatus
  reason?: string
  time?: string
}) => {
  console.log('动态节点点击:', data)
}

// 获取订单详情
const getOrderDetail = async () => {
  try {
    // TODO: 调用获取订单详情API
    // const data = await getOrderDetail(route.params.id)
    // orderData.value = data
    
    // 更新状态store
    if (orderData.value.status) {
      orderStatusStore.updateStatus(
        orderData.value.status as OrderStatus,
        orderData.value.statusReason
      )
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
  }
}

// 初始化
onMounted(() => {
  getOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 24px;
  background: var(--el-bg-color-page);
  min-height: 100%;

  .detail-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    margin-bottom: 24px;
    overflow: hidden;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--el-border-color-light);

      .title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0;
      }
    }

    :deep(.el-descriptions) {
      padding: 20px;

      .el-descriptions__label {
        color: var(--el-text-color-regular);
        font-weight: normal;
      }

      .el-descriptions__content {
        color: var(--el-text-color-primary);
      }
    }

    :deep(.el-table) {
      --el-table-border-color: var(--el-border-color-light);
      --el-table-header-bg-color: var(--el-fill-color-light);
      
      th {
        font-weight: 600;
        color: var(--el-text-color-regular);
        background: var(--el-fill-color-light);
      }

      td {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style> 