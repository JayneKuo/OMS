<template>
  <div class="exception-orders-table">
    <el-table
      :data="data"
      :loading="loading"
      style="width: 100%"
      border
    >
      <el-table-column prop="id" label="Order No." width="150">
        <template #default="{ row }">
          <span 
            class="order-link"
            @click="handleOrder(row)"
          >
            {{ row.id }}
          </span>
        </template>
      </el-table-column>
      
      <el-table-column prop="source" label="Source" width="120">
        <template #default="{ row }">
          <el-tag
            :type="getSourceType(row.source)"
            effect="light"
            size="small"
          >
            {{ row.source }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="type" label="Exception Type" width="120">
        <template #default="{ row }">
          <el-tag
            :type="getExceptionType(row.type)"
            effect="light"
            size="small"
          >
            {{ getExceptionLabel(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="reason" label="Exception Reason" min-width="200" show-overflow-tooltip />
      
      <el-table-column prop="status" label="Status" width="120">
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            effect="plain"
            size="small"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="priority" label="Priority" width="100">
        <template #default="{ row }">
          <el-tag
            :type="getPriorityType(row.priority)"
            effect="dark"
            size="small"
            round
          >
            {{ getPriorityLabel(row.priority) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="created" label="Created Time" width="180" />
      
      <el-table-column label="Actions" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleException(row)">
            Handle
          </el-button>
          <el-button link type="primary" size="small" @click="handleDetail(row)">
            Details
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const props = defineProps<{
  data: Array<{
    id: string
    source: string
    type: string
    reason: string
    status: string
    created: string
    priority: string
    items: Array<{
      sku: string
      name: string
      quantity: number
    }>
  }>
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'handle', order: any): void
}>()

// 获取来源类型
const getSourceType = (source: string) => {
  const types: Record<string, string> = {
    'Shopify': 'success',
    'Amazon': 'primary',
    'Walmart': 'warning',
    'eBay': ''
  }
  return types[source] || ''
}

// 获取异常类型
const getExceptionType = (type: string) => {
  const types: Record<string, string> = {
    'hold': 'warning',
    'allocate': 'danger',
    'dc': 'info',
    'inventory': 'error'
  }
  return types[type] || ''
}

// 获取异常标签
const getExceptionLabel = (type: string) => {
  const labels: Record<string, string> = {
    'hold': 'On Hold',
    'allocate': 'Allocation Failed',
    'dc': 'DC Response Failed',
    'inventory': 'Out of Stock'
  }
  return labels[type] || type
}

// 获取状态类型
const getStatusType = (status: string) => {
  if (status.includes('失败') || status.includes('错误')) return 'danger'
  if (status.includes('待') || status.includes('审核')) return 'warning'
  if (status.includes('部分')) return 'info'
  return ''
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const types: Record<string, string> = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'info'
  }
  return types[priority] || ''
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low'
  }
  return labels[priority] || priority
}

// 处理异常
const handleException = (row: any) => {
  emit('handle', row)
}

// 查看订单
const handleOrder = (row: any) => {
  console.log('查看订单:', row)
}

// 查看详情
const handleDetail = (row: any) => {
  console.log('查看详情:', row)
}
</script>

<style lang="scss" scoped>
.exception-orders-table {
  :deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;
    
    .el-table__header {
      background-color: var(--el-bg-color-page);
      
      th {
        background-color: var(--el-bg-color-page);
        font-weight: 600;
      }
    }
    
    .el-table__row {
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: var(--el-box-shadow-light);
      }
    }
  }

  .order-link {
    color: var(--el-color-primary);
    font-family: monospace;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 13px;
    
    &:hover {
      color: var(--el-color-primary-light-3);
      text-decoration: underline;
    }
  }
}
</style> 