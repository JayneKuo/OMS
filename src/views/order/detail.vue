<template>
  <OrderStatusProgress
    :current-status="orderStatus"
    :status-times="statusTimes"
    @click-pending="handlePendingClick"
  />
</template>

<script setup>
import { OrderStatus } from '@/types/order'
import OrderStatusProgress from '@/components/OrderStatusProgress.vue'

// 订单状态和时间
const orderStatus = ref<OrderStatus>(OrderStatus.Imported)
const statusTimes = ref({
  [OrderStatus.Imported]: '2024-03-20 10:30',
  [OrderStatus.Allocated]: '2024-03-20 14:20',
  [OrderStatus['Warehouse Processing']]: '2024-03-20 15:45',
  [OrderStatus.Shipped]: '2024-03-20 16:30',
  [OrderStatus.InTransit]: '2024-03-20 17:00',
  [OrderStatus.Delivered]: '2024-03-20 18:30',
  [OrderStatus.Completed]: '2024-03-20 19:00'
})

// 处理Pending状态点击
const handlePendingClick = () => {
  // 这里处理点击事件，比如打开详情弹窗
  console.log('Pending clicked')
}
</script> 