<template>
  <el-tag
    :type="statusType"
    :effect="effect"
    class="order-status-tag"
    @click="handleClick"
  >
    {{ statusLabel }}
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStatusStore } from '@/stores/orderStatus'
import { OrderStatus } from '@/types/order'

interface Props {
  status: OrderStatus
  effect?: 'light' | 'dark' | 'plain'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  effect: 'light',
  clickable: false
})

const emit = defineEmits<{
  (e: 'click', status: OrderStatus): void
}>()

const orderStatusStore = useOrderStatusStore()

const statusLabel = computed(() => {
  const statusLabels = {
    [OrderStatus.Imported]: '已导入',
    [OrderStatus.Allocated]: '已分配',
    [OrderStatus['Warehouse Processing']]: '仓库处理中',
    [OrderStatus.Shipped]: '已发货',
    [OrderStatus.InTransit]: '运输中',
    [OrderStatus.Delivered]: '已送达',
    [OrderStatus.Completed]: '已完成',
    [OrderStatus.Pending]: '待处理',
    [OrderStatus.Exception]: '异常',
    [OrderStatus.Deallocated]: '已取消分配',
    [OrderStatus.Cancelling]: '取消中',
    [OrderStatus.Canceled]: '已取消'
  }
  return statusLabels[props.status] || props.status
})

const statusType = computed(() => {
  const typeMap = {
    [OrderStatus.Imported]: 'info',
    [OrderStatus.Allocated]: 'primary',
    [OrderStatus['Warehouse Processing']]: 'warning',
    [OrderStatus.Shipped]: 'success',
    [OrderStatus.InTransit]: 'primary',
    [OrderStatus.Delivered]: 'success',
    [OrderStatus.Completed]: 'success',
    [OrderStatus.Pending]: 'warning',
    [OrderStatus.Exception]: 'danger',
    [OrderStatus.Deallocated]: 'info',
    [OrderStatus.Cancelling]: 'warning',
    [OrderStatus.Canceled]: 'danger'
  }
  return typeMap[props.status] || 'info'
})

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.status)
  }
}
</script>

<style lang="scss" scoped>
.order-status-tag {
  cursor: v-bind('clickable ? "pointer" : "default"');
  transition: all 0.3s ease;

  &:hover {
    opacity: v-bind('clickable ? 0.8 : 1');
  }
}
</style> 