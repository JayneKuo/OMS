<!-- Dispatch Details Component -->
<template>
  <div class="allocation-order">
    <el-table 
      :data="dispatches" 
      style="width: 100%"
      :expand-row-keys="expandedRows"
      row-key="dispatchId"
      size="small"
    >
      <el-table-column label="Product" min-width="200" class-name="no-wrap">
        <template #default="{ row }">
          <div class="product-info">
            <div class="product-name">{{ row.name }}</div>
            <div class="product-sku">{{ row.sku }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Qty" prop="quantity" min-width="60" align="right" class-name="no-wrap" />
      <el-table-column label="UOM" prop="uom" min-width="60" align="center" class-name="no-wrap" />
      <el-table-column label="Lot No." prop="lotNo" min-width="100" align="center" class-name="no-wrap">
        <template #default="{ row }">
          <span class="mono">{{ row.lotNo || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SN Product" prop="snProduct" min-width="100" align="center" class-name="no-wrap">
        <template #default="{ row }">
          <span class="mono">{{ row.snProduct || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ordered" min-width="80" align="right" class-name="no-wrap">
        <template #default="{ row }">
          <span class="quantity">{{ row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Fulfilled" min-width="80" align="right" class-name="no-wrap">
        <template #default="{ row }">
          <span class="quantity" :class="{ 'fulfilled': row.fulfilledQuantity > 0 }">
            {{ row.fulfilledQuantity || 0 }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Search, 
  CircleCheck, 
  CircleClose, 
  More,
  Close,
  RefreshLeft,
  Plus,
  Van,
  EditPen,
  Document
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

interface DispatchItem {
  sku: string
  name?: string
  quantity: number
  fulfilledQuantity?: number
}

interface DispatchedDetail {
  dispatchId: string
  warehouse: string
  warehouseCode: string
  status: string
  carrier: string
  shippingMethod?: 'LTL' | 'FTL' | 'Parcel' | 'External'
  trackingNumber?: string
  trackingUrl?: string
  shipDate?: string
  estimatedDelivery?: string
  orderTime?: string
  reviewTime?: string
  cancelTime?: string
  items: DispatchItem[]
}

// Props
const props = defineProps<{
  dispatches: DispatchedDetail[]
}>()

// 搜索关键字
const dispatchSearch = ref('')

// 选中的dispatch
const selectedDispatch = ref<DispatchedDetail | null>(null)

// 在组件挂载时选中第一个dispatch
onMounted(() => {
  if (props.dispatches && props.dispatches.length > 0) {
    selectedDispatch.value = props.dispatches[0]
  }
})

// 监听dispatches变化，如果当前没有选中项，则选中第一个
watch(() => props.dispatches, (newDispatches) => {
  if (newDispatches && newDispatches.length > 0 && !selectedDispatch.value) {
    selectedDispatch.value = newDispatches[0]
  }
}, { immediate: true })

// 根据搜索过滤dispatch列表
const filteredDispatches = computed(() => {
  if (!dispatchSearch.value) {
    return props.dispatches
  }
  
  const keyword = dispatchSearch.value.toLowerCase()
  return props.dispatches.filter(dispatch => 
    dispatch.dispatchId.toLowerCase().includes(keyword) ||
    dispatch.warehouse.toLowerCase().includes(keyword) ||
    dispatch.status.toLowerCase().includes(keyword)
  )
})

// 处理dispatch选择
const handleDispatchSelect = (dispatch: DispatchedDetail) => {
  selectedDispatch.value = dispatch
}

// 操作权限控制
const canCancel = computed(() => {
  if (!selectedDispatch.value) return false
  const status = selectedDispatch.value.status
  return !['Cancelled', 'Shipped', 'Exception'].includes(status)
})

const canCreateNew = computed(() => {
  if (!selectedDispatch.value) return false
  const status = selectedDispatch.value.status
  return ['Cancelled', 'Exception'].includes(status)
})

const canPushShipping = computed(() => {
  if (!selectedDispatch.value) return false
  const status = selectedDispatch.value.status
  return ['Allocated', 'Warehouse Received', 'Picked', 'Packed'].includes(status)
})

const canEdit = computed(() => {
  if (!selectedDispatch.value) return false
  const status = selectedDispatch.value.status
  return !['Cancelled', 'Shipped', 'Exception'].includes(status)
})

// 处理操作
const handleAction = async (command: string) => {
  if (!selectedDispatch.value) return

  switch (command) {
    case 'cancel':
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to cancel this dispatch?',
          'Cancel Dispatch',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        // TODO: 调用取消接口
        console.log('Cancel dispatch:', selectedDispatch.value.dispatchId)
      } catch (e) {
        // 用户取消操作
      }
      break

    case 'cancelRecreate':
      try {
        await ElMessageBox.confirm(
          'This will cancel the current dispatch and create a new one. Continue?',
          'Cancel & Recreate',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        // TODO: 调用取消并重建接口
        console.log('Cancel & Recreate dispatch:', selectedDispatch.value.dispatchId)
      } catch (e) {
        // 用户取消操作
      }
      break

    case 'newFulfillment':
      // TODO: 创建新的履约单
      console.log('Create new fulfillment for dispatch:', selectedDispatch.value.dispatchId)
      break

    case 'pushShipping':
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to push this shipping request?',
          'Push Shipping Request',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        // TODO: 调用推送接口
        console.log('Push shipping request:', selectedDispatch.value.dispatchId)
      } catch (e) {
        // 用户取消操作
      }
      break

    case 'editShipping':
      // TODO: 打开编辑表单
      console.log('Edit shipping request:', selectedDispatch.value.dispatchId)
      break

    case 'viewJson':
      // TODO: 显示JSON数据
      console.log('View JSON for dispatch:', selectedDispatch.value.dispatchId)
      break
  }
}

// 格式化日期
const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// 获取状态类型
const getDispatchStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'Cancelled': 'danger',    // 取消状态 - 红色
    'Exception': 'danger',    // 异常状态 - 红色
    'Failed': 'danger',       // 失败状态 - 红色
    'On Hold': 'warning',     // 暂停状态 - 橙色
    'default': 'success'      // 其他状态 - 绿色
  }
  return statusMap[status] || statusMap.default
}
</script>

<style lang="scss" scoped>
.allocation-order {
  display: flex;
  height: 100%;
  min-height: 600px;
  gap: 20px;
  margin: -16px;
  background: #1a1d21;

  :deep(.status-tag) {
    font-weight: 500;
    font-size: 11px;
    padding: 0 8px;
    height: 22px;
    line-height: 20px;
    
    // 成功状态 - 绿色
    &.el-tag--success {
      background: rgba(52, 199, 89, 0.1);
      border-color: rgba(52, 199, 89, 0.2);
      color: #34c759;
    }
    
    // 异常状态 - 红色
    &.el-tag--danger {
      background: rgba(255, 59, 48, 0.1);
      border-color: rgba(255, 59, 48, 0.2);
      color: #ff3b30;
    }
    
    // 警告状态 - 橙色
    &.el-tag--warning {
      background: rgba(255, 149, 0, 0.1);
      border-color: rgba(255, 149, 0, 0.2);
      color: #ff9500;
    }
  }
  
  .dispatch-list {
    width: 300px;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    
    .list-header {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      
      :deep(.el-input) {
        --el-input-bg-color: rgba(255, 255, 255, 0.02);
        --el-input-border-color: rgba(255, 255, 255, 0.08);
        --el-input-hover-border-color: rgba(255, 255, 255, 0.15);
        --el-input-focus-border-color: #0066ff;
        
        .el-input__wrapper {
          box-shadow: none !important;
          transition: all 0.2s ease;
          
          &:hover {
            --el-input-bg-color: rgba(255, 255, 255, 0.04);
          }
          
          &.is-focus {
            --el-input-bg-color: rgba(0, 102, 255, 0.05);
          }
        }
        
        .el-input__inner {
          color: #e1e3e6;
          
          &::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }
        }
      }
    }
    
    .list-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
    
    .dispatch-item {
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      margin-bottom: 8px;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: transparent;
        transition: all 0.2s ease;
      }
      
      &:hover {
        border-color: rgba(0, 102, 255, 0.3);
        background: rgba(0, 102, 255, 0.03);
        
        &::before {
          background: rgba(0, 102, 255, 0.3);
        }
        
        .dispatch-id {
          color: #0066ff;
        }
      }
      
      &.active {
        background: rgba(0, 102, 255, 0.08);
        border-color: rgba(0, 102, 255, 0.5);
        
        &::before {
          background: #0066ff;
        }
        
        .dispatch-id {
          color: #0066ff;
        }
      }
      
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .dispatch-id {
          font-weight: 600;
          color: #e1e3e6;
          font-size: 13px;
          letter-spacing: 0.3px;
          transition: color 0.2s ease;
        }
      }
      
      .item-info {
        .info-row {
          display: flex;
          align-items: center;
          padding: 4px 0;
          
          &:first-child {
            padding-top: 0;
          }
          
          &:last-child {
            padding-bottom: 0;
          }
          
          .label {
            color: #8b949e;
            width: 160px;
            font-size: 12px;
            font-weight: 400;
            text-transform: capitalize;
          }
          
          .value {
            color: #e1e3e6;
            flex: 1;
            font-size: 12px;
            font-weight: 400;
            padding-left: 0;
          }
        }
      }
    }
  }
  
  .dispatch-detail {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    
    &.empty {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      
      .header-left {
        h2 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 500;
          color: #e1e3e6;
        }
        
        .dispatch-info {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .dispatch-id {
            font-size: 13px;
            color: #8b949e;
            font-weight: 400;
            
            &::before {
              content: 'Dispatch NO: ';
              color: #8b949e;
              font-weight: 400;
            }
          }
          
          .status-tag {
            margin-top: -1px;
          }
        }
      }
    }
    
    .dispatch-timeline {
      margin: 32px 0;
      
      .timeline-nodes {
        display: flex;
        justify-content: space-between;
        position: relative;
        padding: 0 12px;
        
        &::before {
          content: '';
          position: absolute;
          top: 16px;
          left: 40px;
          right: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 0;
        }
        
        .timeline-node {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          
          .node-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #1a1d21;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            
            .el-icon {
              font-size: 16px;
              color: rgba(255, 255, 255, 0.2);
            }
          }
          
          .node-content {
            text-align: center;
            min-width: 120px;
            
            .node-label {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.45);
              margin-bottom: 4px;
            }
            
            .node-time {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.85);
              font-family: 'Roboto Mono', monospace;
            }
          }
          
          &.active {
            .node-icon {
              background: rgba(52, 199, 89, 0.1);
              border-color: #34c759;
              
              .el-icon {
                color: #34c759;
              }
            }
            
            .node-label {
              color: rgba(255, 255, 255, 0.85);
            }
            
            & + .timeline-node {
              &::before {
                background: #34c759;
              }
            }
          }
          
          &.cancelled {
            .node-icon {
              background: rgba(255, 59, 48, 0.1);
              border-color: #ff3b30;
              
              .el-icon {
                color: #ff3b30;
              }
            }
            
            .node-label {
              color: #ff3b30;
            }
          }
        }
      }
    }
    
    .dispatch-items {
      margin: 24px 0;
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        .header-title {
          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
          }
        }
        
        .header-summary {
          display: flex;
          gap: 24px;
          
          .summary-item {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .label {
              color: #8b949e;
            }
            
            .value {
              font-weight: 500;
            }
          }
        }
      }

      .items-table {
        :deep(.el-table) {
          --el-table-border-color: rgba(255, 255, 255, 0.1);
          --el-table-header-bg-color: rgba(255, 255, 255, 0.02);
          --el-table-tr-bg-color: transparent;
          --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.02);
          
          .product-info {
            .product-name {
              color: #e1e3e6;
              font-weight: 500;
              margin-bottom: 2px;
            }
            
            .product-sku {
              color: #8b949e;
              font-size: 12px;
              font-family: 'Roboto Mono', monospace;
            }
          }
          
          .mono {
            font-family: 'Roboto Mono', monospace;
            font-size: 12px;
            color: #e1e3e6;
          }
          
          .quantity {
            font-family: 'Roboto Mono', monospace;
            font-size: 13px;
            color: #e1e3e6;
            
            &.fulfilled {
              color: #34c759;
              font-weight: 500;
            }
          }

          .no-wrap {
            .cell {
              white-space: nowrap;
            }
          }
        }
      }
    }
    
    .dispatch-info {
      margin: 24px 0;
      
      .info-sections-row {
        display: flex;
        gap: 20px;
        margin-bottom: 24px;

        .info-section {
          flex: 1;
        }
      }
      
      .info-section {
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        
        .section-title {
          color: #e1e3e6;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .section-content {
          .section-row {
            display: flex;
            margin-bottom: 12px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .label {
              width: 160px;
              color: #8b949e;
              font-size: 12px;
            }
            
            .value {
              flex: 1;
              color: #e1e3e6;
              font-size: 12px;
              
              &.mono {
                font-family: 'Roboto Mono', monospace;
              }
              
              &.note-text {
                color: #8b949e;
                font-style: italic;
              }
            }
          }
        }
      }
    }
  }
}
</style> 