<template>
  <div class="dispatch-timeline">
    <div class="timeline-nodes">
      <!-- Imported -->
      <div class="timeline-node" :class="{ active: true }">
        <div class="node-icon">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="node-content">
          <div class="node-label">Imported</div>
          <div class="node-time">{{ formatTime(statusTimes[OrderStatus.Imported]) }}</div>
        </div>
      </div>

      <!-- On Hold -->
      <div class="timeline-node warning">
        <div class="node-icon">
          <el-icon><Warning /></el-icon>
        </div>
        <div class="node-content">
          <div class="node-label">On Hold</div>
          <div class="node-time">{{ formatTime(getHoldTime()) }}</div>
        </div>
      </div>

      <!-- Hold Release -->
      <div class="timeline-node success">
        <div class="node-icon">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="node-content">
          <div class="node-label">Hold Release</div>
          <div class="node-time">{{ formatTime(getHoldReleaseTime()) }}</div>
        </div>
      </div>

      <!-- Exception -->
      <div class="timeline-node" :class="{ 
        active: hasExceptionStatus,
        error: hasExceptionStatus
      }">
        <div class="node-icon">
          <el-icon><CircleClose /></el-icon>
        </div>
        <div class="node-content">
          <div class="node-label">Exception</div>
          <div class="node-time">{{ formatTime(getExceptionTime()) }}</div>
        </div>
      </div>

      <!-- Cancelled -->
      <div class="timeline-node cancelled">
        <div class="node-icon">
          <el-icon><CircleClose /></el-icon>
        </div>
        <div class="node-content">
          <div class="node-label">Cancelled</div>
          <div class="node-time">{{ formatTime(statusTimes[OrderStatus.Cancelled]) }}</div>
        </div>
      </div>

      <!-- 未经历的节点 -->
      <!-- Allocated -->
      <div class="timeline-node">
        <div class="node-icon">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="node-content">
          <div class="node-label">Allocated</div>
          <div class="node-time">{{ formatTime(statusTimes[OrderStatus.Allocated]) }}</div>
        </div>
      </div>

      <!-- Warehouse Processing -->
      <div class="timeline-node">
        <div class="node-icon">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="node-content">
          <div class="node-label">Warehouse Processing</div>
          <div class="node-time">{{ formatTime(statusTimes[OrderStatus.Processing]) }}</div>
        </div>
      </div>

      <!-- Shipped -->
      <div class="timeline-node">
        <div class="node-icon">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="node-content">
          <div class="node-label">Shipped</div>
          <div class="node-time">{{ formatTime(statusTimes[OrderStatus.Shipped]) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck, CircleClose, Warning } from '@element-plus/icons-vue'
import { OrderStatus } from '@/types/order'

const props = withDefaults(defineProps<{
  currentStatus: OrderStatus
  statusTimes?: Record<string, string>
  dynamicNodes?: Array<{
    status: OrderStatus
    position: string
    reason?: string
    time?: string
  }>
}>(), {
  statusTimes: () => ({}),
  dynamicNodes: () => []
})

// 检查是否有Hold状态
const hasHoldStatus = computed(() => {
  return props.dynamicNodes?.some(node => 
    node.status === OrderStatus.Pending && 
    node.position === 'beforeAllocated'
  )
})

// 检查是否有Hold Release状态
const hasHoldReleaseStatus = computed(() => {
  return props.dynamicNodes?.some(node => 
    node.status === OrderStatus.Pending && 
    node.position === 'afterHold'
  )
})

// 检查是否有异常状态
const hasExceptionStatus = computed(() => {
  return props.dynamicNodes?.some(node => node.status === OrderStatus.Exception)
})

// 获取Hold时间
const getHoldTime = () => {
  const holdNode = props.dynamicNodes?.find(node => 
    node.status === OrderStatus.Pending && 
    node.position === 'beforeAllocated'
  )
  return holdNode?.time
}

// 获取Hold Release时间
const getHoldReleaseTime = () => {
  const releaseNode = props.dynamicNodes?.find(node => 
    node.status === OrderStatus.Pending && 
    node.position === 'afterHold'
  )
  return releaseNode?.time
}

// 获取异常时间
const getExceptionTime = () => {
  const exceptionNode = props.dynamicNodes?.find(node => 
    node.status === OrderStatus.Exception
  )
  return exceptionNode?.time
}

// 格式化时间
const formatTime = (time: string | undefined): string => {
  if (!time) return ''
  try {
    const date = new Date(time)
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch (e) {
    return time
  }
}
</script>

<style lang="scss" scoped>
.dispatch-timeline {
  margin: 32px 0;
  width: 100%;
  min-width: 1200px;

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
      background: var(--el-border-color-light);
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
        background: var(--el-bg-color);
        border: 1px solid var(--el-border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        
        .el-icon {
          font-size: 16px;
          color: var(--el-text-color-secondary);
        }
      }
      
      .node-content {
        text-align: center;
        width: 140px;
        padding: 0 4px;
        
        .node-label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .node-time {
          font-size: 12px;
          color: var(--el-text-color-primary);
          font-family: 'Roboto Mono', monospace;
          white-space: nowrap;
        }
      }
      
      &.active {
        .node-icon {
          background: rgba(52, 199, 89, 0.1);
          border-color: var(--el-color-success);
          
          .el-icon {
            color: var(--el-color-success);
          }
        }
        
        .node-label {
          color: var(--el-text-color-primary);
        }
      }
      
      &.warning {
        .node-icon {
          background: rgba(255, 149, 0, 0.1);
          border-color: var(--el-color-warning);
          
          .el-icon {
            color: var(--el-color-warning);
          }
        }
        
        .node-label {
          color: var(--el-color-warning);
        }
      }

      &.error {
        .node-icon {
          background: rgba(255, 59, 48, 0.1);
          border-color: var(--el-color-danger);
          
          .el-icon {
            color: var(--el-color-danger);
          }
        }
        
        .node-label {
          color: var(--el-color-danger);
        }
      }
      
      &.cancelled {
        .node-icon {
          background: rgba(255, 59, 48, 0.1);
          border-color: var(--el-color-danger);
          
          .el-icon {
            color: var(--el-color-danger);
          }
        }
        
        .node-label {
          color: var(--el-color-danger);
        }
      }

      &.success {
        .node-icon {
          background: rgba(52, 199, 89, 0.1);
          border-color: var(--el-color-success);
          
          .el-icon {
            color: var(--el-color-success);
          }
        }
        
        .node-label {
          color: var(--el-color-success);
        }
      }
    }
  }
}
</style> 