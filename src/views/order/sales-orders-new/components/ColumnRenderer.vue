<template>
  <component 
    :is="getComponent" 
    :row="row" 
    :column="column" 
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { ElTag, ElLink } from 'element-plus'
import type { OrderColumn } from '../types'

const props = defineProps<{
  row: any
  column: OrderColumn
}>()

const emit = defineEmits<{
  (e: 'click', row: any): void
}>()

const handleClick = () => {
  emit('click', props.row)
}

// 默认单元格
const DefaultCell = (props: any) => {
  return h('span', props.row[props.column.key])
}

// 订单号单元格
const OrderNoCell = (props: any) => {
  return h(ElLink, {
    type: 'primary',
    onClick: () => emit('click', props.row)
  }, () => props.row.orderNo)
}

// 来源单元格
const SourceCell = (props: any) => {
  return h('div', { class: 'source-cell' }, [
    h('span', { 
      class: 'source-icon' 
    }, props.row.source.charAt(0).toUpperCase()),
    h('span', { 
      class: 'source-name' 
    }, props.row.source)
  ])
}

// 状态单元格
const StatusCell = (props: any) => {
  const getStatusType = (status: string) => {
    const types: Record<string, string> = {
      'Ready For Fulfillment': 'success',
      'Exception': 'danger',
      'Pending': 'warning',
      'Shipped': 'info',
      'Cancelled': 'danger'
    }
    return types[status] || ''
  }

  return h(ElTag, {
    type: getStatusType(props.row.status)
  }, () => props.row.status)
}

// 异常单元格
const ExceptionsCell = (props: any) => {
  if (!props.row.exceptions) {
    return h('span', '-')
  }
  return h(ElTag, {
    type: 'danger'
  }, () => props.row.exceptions)
}

// 标签单元格
const TagsCell = (props: any) => {
  return h('div', { class: 'tags-cell' }, 
    props.row.tags.map((tag: string) => 
      h(ElTag, {
        key: tag,
        size: 'small'
      }, () => tag)
    )
  )
}

// 金额单元格
const TotalCell = (props: any) => {
  return h('span', `$${props.row.total.toFixed(2)}`)
}

const getComponent = computed(() => {
  switch (props.column.key) {
    case 'orderNo':
      return OrderNoCell
    case 'source':
      return SourceCell
    case 'status':
      return StatusCell
    case 'exceptions':
      return ExceptionsCell
    case 'tags':
      return TagsCell
    case 'total':
      return TotalCell
    default:
      return DefaultCell
  }
})
</script>

<style lang="scss" scoped>
.source-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .source-icon {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: #7c4dff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
  }

  .source-name {
    color: #fff;
  }
}

.tags-cell {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;

  :deep(.el-tag) {
    background: rgba(124, 77, 255, 0.1);
    border-color: rgba(124, 77, 255, 0.2);
    color: #7c4dff;
  }
}
</style> 