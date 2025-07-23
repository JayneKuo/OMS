<!-- Dispatch Details Component -->
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
  // 时间线节点时间
  allocatedTime?: string
  receivedTime?: string
  committedTime?: string
  pickedTime?: string
  packedTime?: string
  loadedTime?: string
  partiallyShippedTime?: string
  shippedTime?: string
  shortShippedTime?: string
  cancelTime?: string
  // 其他时间
  shipDate?: string
  estimatedDelivery?: string
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

// 获取下一个活动节点
const getNextActiveNode = (currentIndex: number) => {
  const nodes = [
    selectedDispatch.value?.allocatedTime,
    selectedDispatch.value?.receivedTime,
    selectedDispatch.value?.committedTime,
    selectedDispatch.value?.pickedTime,
    selectedDispatch.value?.packedTime,
    selectedDispatch.value?.loadedTime,
    selectedDispatch.value?.partiallyShippedTime,
    selectedDispatch.value?.shippedTime,
    selectedDispatch.value?.shortShippedTime
  ]
  
  // 从当前索引的下一个开始查找
  for (let i = currentIndex + 1; i < nodes.length; i++) {
    if (nodes[i]) {
      return true
    }
  }
  return false
}

// 获取状态类型
const getDispatchStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'Cancelled': 'danger',    // 取消状态 - 红色
    'Warehouse Cancelled': 'danger', // 仓库取消状态 - 红色
    'Exception': 'danger',    // 异常状态 - 红色
    'Failed': 'danger',       // 失败状态 - 红色
    'On Hold': 'warning',     // 暂停状态 - 橙色
    'default': 'success'      // 其他状态 - 绿色
  }
  return statusMap[status] || statusMap.default
}
</script>

<template>
  <div class="dispatch-layout">
    <!-- 左侧列表 -->
    <div class="dispatch-list">
      <div class="list-header">
        <el-input
          v-model="dispatchSearch"
          placeholder="Search by shipment ID, location, status, etc..."
          prefix-icon="Search"
          clearable
        />
      </div>
      <div class="list-content">
        <div 
          v-for="dispatch in filteredDispatches" 
          :key="dispatch.dispatchId"
          class="dispatch-item"
          :class="{ active: selectedDispatch?.dispatchId === dispatch.dispatchId }"
          @click="handleDispatchSelect(dispatch)"
        >
          <div class="item-header">
            <span class="dispatch-id">{{ dispatch.dispatchId.replace('D', 'SO00223095-') }}</span>
            <el-tag 
              :type="getDispatchStatusType(dispatch.status)" 
              :class="['status-tag', { 'highlight': ['Cancelled', 'Exception', 'Failed', 'On Hold'].includes(dispatch.status) }]"
              size="small"
            >
              {{ dispatch.status }}
            </el-tag>
          </div>
          <div class="item-info">
            <div class="info-row">
              <span class="label">Fulfillment integration</span>
              <span class="value">Valley View</span>
            </div>
            <div class="info-row">
              <span class="label">Shipping method</span>
              <span class="value">External</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧详情 -->
    <div class="dispatch-detail" v-if="selectedDispatch">
      <div class="detail-header">
        <div class="header-left">
          <h2>Allocation Order</h2>
          <div class="dispatch-info">
            <span class="dispatch-id">{{ selectedDispatch.dispatchId.replace('D', 'SO00223095-') }}</span>
            <el-tag 
              :type="getDispatchStatusType(selectedDispatch.status)"
              effect="plain"
              class="status-tag"
            >
              {{ selectedDispatch.status }}
            </el-tag>
          </div>
        </div>
        <div class="header-actions">
          <el-dropdown trigger="click" @command="handleAction">
            <el-button link>
              <el-icon><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="cancel" :disabled="!canCancel">
                  <el-icon><Close /></el-icon>
                  Cancel
                </el-dropdown-item>
                <el-dropdown-item command="cancelRecreate" :disabled="!canCancel">
                  <el-icon><RefreshLeft /></el-icon>
                  Cancel & Recreate
                </el-dropdown-item>
                <el-dropdown-item command="newFulfillment" :disabled="!canCreateNew">
                  <el-icon><Plus /></el-icon>
                  New Fulfillment
                </el-dropdown-item>
                <el-dropdown-item command="pushShipping" :disabled="!canPushShipping">
                  <el-icon><Van /></el-icon>
                  Push Shipping Request
                </el-dropdown-item>
                <el-dropdown-item command="editShipping" :disabled="!canEdit">
                  <el-icon><EditPen /></el-icon>
                  Edit Shipping Request
                </el-dropdown-item>
                <el-dropdown-item command="viewJson" divided>
                  <el-icon><Document /></el-icon>
                  View JSON
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 时间线 -->
      <div class="dispatch-timeline">
        <template v-if="['Warehouse Cancelled', 'Cancelled'].includes(selectedDispatch.status)">
          <!-- 取消流程时间线 -->
          <div class="timeline-nodes">
            <template v-for="(node, index) in [
              { key: 'allocated', label: 'Allocated', time: selectedDispatch.allocatedTime },
              { key: 'received', label: 'Warehouse Received', time: selectedDispatch.receivedTime },
              { key: 'committed', label: 'Committed', time: selectedDispatch.committedTime },
              { key: 'picked', label: 'Picked', time: selectedDispatch.pickedTime },
              { key: 'packed', label: 'Packed', time: selectedDispatch.packedTime },
              { key: 'loaded', label: 'Loaded', time: selectedDispatch.loadedTime },
              { key: 'partiallyShipped', label: 'Partially Shipped', time: selectedDispatch.partiallyShippedTime },
              { 
                key: 'shipped', 
                label: selectedDispatch.shortShippedTime ? 'Short Shipped' : 'Shipped', 
                time: selectedDispatch.shortShippedTime || selectedDispatch.shippedTime 
              }
            ]">
              <!-- 正常节点 -->
              <div class="timeline-node" :class="{ active: node.time }">
                <div class="node-icon">
                  <el-icon><CircleCheck /></el-icon>
                </div>
                <div class="node-content">
                  <div class="node-label">{{ node.label }}</div>
                  <div class="node-time">{{ formatDate(node.time) }}</div>
                </div>
              </div>

              <!-- 如果当前节点是最后一个有时间的节点，插入取消节点 -->
              <template v-if="node.time && !getNextActiveNode(index)">
                <div class="timeline-node" :class="{ active: true, cancelled: true }">
                  <div class="node-icon">
                    <el-icon><CircleClose /></el-icon>
                  </div>
                  <div class="node-content">
                    <div class="node-label">{{ selectedDispatch.status }}</div>
                    <div class="node-time">{{ formatDate(selectedDispatch.cancelTime) }}</div>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </template>
        <template v-else>
          <!-- 正常流程时间线 -->
          <div class="timeline-nodes">
            <div class="timeline-node" :class="{ active: ['Allocated', 'Warehouse Received', 'Committed', 'Picked', 'Packed', 'Loaded', 'Partially Shipped', 'Shipped', 'Short Shipped'].includes(selectedDispatch.status) }">
              <div class="node-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="node-content">
                <div class="node-label">Allocated</div>
                <div class="node-time">{{ formatDate(selectedDispatch.allocatedTime) }}</div>
              </div>
            </div>

            <div class="timeline-node" :class="{ active: ['Warehouse Received', 'Committed', 'Picked', 'Packed', 'Loaded', 'Partially Shipped', 'Shipped', 'Short Shipped'].includes(selectedDispatch.status) }">
              <div class="node-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="node-content">
                <div class="node-label">Warehouse Received</div>
                <div class="node-time">{{ formatDate(selectedDispatch.receivedTime) }}</div>
              </div>
            </div>

            <div class="timeline-node" :class="{ active: ['Committed', 'Picked', 'Packed', 'Loaded', 'Partially Shipped', 'Shipped', 'Short Shipped'].includes(selectedDispatch.status) }">
              <div class="node-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="node-content">
                <div class="node-label">Committed</div>
                <div class="node-time">{{ formatDate(selectedDispatch.committedTime) }}</div>
              </div>
            </div>

            <div class="timeline-node" :class="{ active: ['Picked', 'Packed', 'Loaded', 'Partially Shipped', 'Shipped', 'Short Shipped'].includes(selectedDispatch.status) }">
              <div class="node-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="node-content">
                <div class="node-label">Picked</div>
                <div class="node-time">{{ formatDate(selectedDispatch.pickedTime) }}</div>
              </div>
            </div>

            <div class="timeline-node" :class="{ active: ['Packed', 'Loaded', 'Partially Shipped', 'Shipped', 'Short Shipped'].includes(selectedDispatch.status) }">
              <div class="node-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="node-content">
                <div class="node-label">Packed</div>
                <div class="node-time">{{ formatDate(selectedDispatch.packedTime) }}</div>
              </div>
            </div>

            <div class="timeline-node" :class="{ active: ['Loaded', 'Partially Shipped', 'Shipped', 'Short Shipped'].includes(selectedDispatch.status) }">
              <div class="node-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="node-content">
                <div class="node-label">Loaded</div>
                <div class="node-time">{{ formatDate(selectedDispatch.loadedTime) }}</div>
              </div>
            </div>

            <div class="timeline-node" :class="{ active: ['Partially Shipped'].includes(selectedDispatch.status) }">
              <div class="node-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="node-content">
                <div class="node-label">Partially Shipped</div>
                <div class="node-time">{{ formatDate(selectedDispatch.partiallyShippedTime) }}</div>
              </div>
            </div>

            <div class="timeline-node" :class="{ active: ['Shipped', 'Short Shipped'].includes(selectedDispatch.status) }">
              <div class="node-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>
              <div class="node-content">
                <div class="node-label">{{ selectedDispatch.status === 'Short Shipped' ? 'Short Shipped' : 'Shipped' }}</div>
                <div class="node-time">{{ formatDate(selectedDispatch.shippedTime) }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 商品信息 -->
      <div class="dispatch-items">
        <div class="section-header">
          <div class="header-title">
            <h3>Items</h3>
          </div>
          <div class="header-summary">
            <div class="summary-item">
              <span class="label">Ordered</span>
              <span class="value">{{ selectedDispatch.items.length }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Fulfilled</span>
              <span class="value">0</span>
            </div>
          </div>
        </div>
        <div class="items-table">
          <el-table :data="selectedDispatch.items" size="small">
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
      </div>

      <!-- 配送信息 -->
      <div class="dispatch-info">
        <div class="info-sections-row">
          <!-- Fulfillment 信息 -->
          <div class="info-section">
            <div class="section-title">Fulfillment Information</div>
            <div class="section-content">
              <div class="section-row">
                <span class="label">Fulfillment Location</span>
                <span class="value">{{ selectedDispatch.warehouse }}</span>
              </div>
              <div class="section-row">
                <span class="label">Fulfillment Integration</span>
                <span class="value">{{ selectedDispatch.warehouseCode }}</span>
              </div>
              <div class="section-row">
                <span class="label">Warehouse DN</span>
                <span class="value mono">DN-6302021</span>
              </div>
              <div class="section-row">
                <span class="label">Fulfillment Connector</span>
                <span class="value">unis</span>
              </div>
              <div class="section-row">
                <span class="label">Fulfillment Order ID</span>
                <span class="value">{{ selectedDispatch.dispatchId }}</span>
              </div>
            </div>
          </div>

          <!-- 运输信息 -->
          <div class="info-section">
            <div class="section-title">Shipping Information</div>
            <div class="section-content">
              <div class="section-row">
                <span class="label">Carrier</span>
                <span class="value">{{ selectedDispatch.carrier }}</span>
              </div>
              <div class="section-row">
                <span class="label">Shipping Method</span>
                <span class="value">{{ selectedDispatch.shippingMethod || 'LTL' }}</span>
              </div>
              <div class="section-row">
                <span class="label">Ship Date</span>
                <span class="value">{{ formatDate(selectedDispatch.shipDate) }}</span>
              </div>
              <div class="section-row">
                <span class="label">Expected Delivery</span>
                <span class="value">{{ formatDate(selectedDispatch.estimatedDelivery) }}</span>
              </div>
              <div class="section-row">
                <span class="label">Tracking Number</span>
                <span class="value mono">{{ selectedDispatch.trackingNumber || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 备注信息 -->
        <div class="info-section">
          <div class="section-title">Notes</div>
          <div class="section-content">
            <div class="section-row">
              <span class="value note-text">No notes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 未选择状态 -->
    <div class="dispatch-detail empty" v-else>
      <el-empty description="Select an allocation order to view details" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dispatch-layout {
  display: flex;
  height: 100%;
  min-height: 600px;
  min-width: 1400px;
  gap: 20px;
  margin: -16px;
  background: #1a1d21;
  
  .dispatch-detail {
    min-width: 1200px;
  }

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
            color: #e1e3e6;
            font-weight: 500;
          }
          
          .status-tag {
            margin-top: -1px;
          }
        }
      }
    }
    
          .dispatch-timeline {
        margin: 32px 0;
        width: 100%;
        min-width: 1200px; // 确保有足够的最小宽度
      
      .timeline-nodes {
        display: flex;
        position: relative;
        padding: 0 12px;
        gap: 0;
        justify-content: space-between;
        width: 100%;
        margin: 0 -20px;
        
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
            flex: 1;
          
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
            width: 140px;
            padding: 0 4px;
            
            .node-label {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.45);
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .node-time {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.85);
              font-family: 'Roboto Mono', monospace;
              white-space: nowrap;
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