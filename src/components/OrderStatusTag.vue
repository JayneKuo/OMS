<template>
  <el-tag
    :type="getStatusType"
    :effect="effect"
    class="order-status-tag"
    @click="handleClick"
  >
    {{ getStatusLabel }}
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

interface StatusConfig {
  label: string
  type: 'info' | 'warning' | 'success' | 'danger' | 'primary'
}

const statusMap: Record<OrderStatus, StatusConfig> = {
  [OrderStatus.All]: {
    label: '全部',
    type: 'info'
  },
  [OrderStatus.Imported]: {
    label: '已导入',
    type: 'info'
  },
  [OrderStatus.Pending]: {
    label: '待处理',
    type: 'warning'
  },
  [OrderStatus.Allocated]: {
    label: '已分配',
    type: 'success'
  },
  [OrderStatus.Exception]: {
    label: '异常',
    type: 'danger'
  },
  [OrderStatus.Deallocated]: {
    label: '已取消分配',
    type: 'info'
  },
  [OrderStatus.Cancelling]: {
    label: '取消中',
    type: 'warning'
  },
  [OrderStatus.Cancelled]: {
    label: '已取消',
    type: 'info'
  },
  [OrderStatus.Processing]: {
    label: '处理中',
    type: 'primary'
  },
  [OrderStatus.Shipped]: {
    label: '已发货',
    type: 'success'
  },
  [OrderStatus.InTransit]: {
    label: '运输中',
    type: 'primary'
  },
  [OrderStatus.Delivered]: {
    label: '已送达',
    type: 'success'
  },
  [OrderStatus.Completed]: {
    label: '已完成',
    type: 'success'
  }
}

const getStatusType = computed(() => {
  return statusMap[props.status]?.type || 'info'
})

const getStatusLabel = computed(() => {
  return statusMap[props.status]?.label || props.status
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