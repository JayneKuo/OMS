<template>
  <div class="order-status-flow">
    <div class="status-header">
      <div class="left">
        <h3>订单状态</h3>
        <el-tag 
          :type="getStatusType(currentStatus)" 
          effect="plain"
        >
          {{ getStatusLabel(currentStatus) }}
        </el-tag>
      </div>
    </div>

    <div class="progress-timeline">
      <div 
        v-for="(node, index) in statusNodes" 
        :key="node.status"
        class="timeline-node"
        :class="[
          getNodeStatus(node),
          { 'has-error': node.error }
        ]"
      >
        <!-- 节点内容 -->
        <div class="node-content">
          <div class="node-dot">
            <el-icon><component :is="getNodeIcon(node)" /></el-icon>
            <div v-if="getNodeStatus(node) === 'current'" class="pulse-ring"></div>
          </div>
          <div class="node-info">
            <span class="node-name">{{ node.label }}</span>
            <span class="node-time" v-if="node.time">
              {{ formatTime(node.time) }}
            </span>
            <span v-if="node.error" class="error-message">
              {{ node.error }}
            </span>
          </div>
        </div>
        
        <!-- 连接线 -->
        <div 
          v-if="index < statusNodes.length - 1"
          class="node-line"
          :class="getNodeStatus(node)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Check, Loading, CircleClose, Warning } from '@element-plus/icons-vue'

interface StatusNode {
  status: string
  label: string
  time?: string
  error?: string
}

const props = defineProps<{
  currentStatus: string
  statusHistory: StatusNode[]
}>()

// 状态节点数据
const statusNodes = computed(() => {
  return [
    { status: 'created', label: '已导入' },
    { status: 'pending', label: '待分配' },
    { status: 'processing', label: '处理中' },
    { status: 'shipping', label: '已发货' },
    { status: 'delivered', label: '运输中' },
    { status: 'received', label: '已签收' },
    { status: 'picking', label: '取消中' },
    { status: 'completed', label: '已完成' }
  ].map(node => {
    const historyNode = props.statusHistory.find(h => h.status === node.status)
    return {
      ...node,
      time: historyNode?.time,
      error: historyNode?.error
    }
  })
})

// 获取节点状态
const getNodeStatus = (node: StatusNode) => {
  const currentIndex = statusNodes.value.findIndex(n => n.status === props.currentStatus)
  const nodeIndex = statusNodes.value.findIndex(n => n.status === node.status)
  
  if (node.status === props.currentStatus) return 'current'
  if (nodeIndex < currentIndex) return 'completed'
  return 'pending'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    created: 'info',
    pending: 'warning',
    processing: 'warning',
    shipping: 'success',
    delivered: 'success',
    received: 'success',
    picking: 'danger',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    created: '已导入',
    pending: '待分配',
    processing: '处理中',
    shipping: '已发货',
    delivered: '运输中',
    received: '已签收',
    picking: '取消中',
    completed: '已完成'
  }
  return labelMap[status] || status
}

// 获取节点图标
const getNodeIcon = (node: StatusNode) => {
  const status = getNodeStatus(node)
  if (status === 'completed') return Check
  if (status === 'current') return Loading
  if (node.error) return Warning
  return CircleClose
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.order-status-flow {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 24px;
  
  .status-header {
    margin-bottom: 24px;
    
    .left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  
  .progress-timeline {
    display: flex;
    align-items: center;
    padding: 20px 0;
    
    .timeline-node {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      
      &:last-child {
        flex: 0;
      }
      
      .node-content {
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1;
        
        .node-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--el-bg-color);
          border: 2px solid var(--el-border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          
          .el-icon {
            font-size: 14px;
            color: var(--el-text-color-secondary);
          }
          
          .pulse-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
            border: 2px solid var(--el-color-primary);
          }
        }
        
        .node-info {
          display: flex;
          flex-direction: column;
          
          .node-name {
            font-size: 14px;
            color: var(--el-text-color-regular);
          }
          
          .node-time {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
          
          .error-message {
            font-size: 12px;
            color: var(--el-color-danger);
            margin-top: 4px;
          }
        }
      }
      
      .node-line {
        position: absolute;
        left: 50%;
        right: 0;
        top: 50%;
        height: 2px;
        background: var(--el-border-color);
        transform: translateY(-50%);
      }
      
      // 状态样式
      &.completed {
        .node-dot {
          border-color: var(--el-color-success);
          background: var(--el-color-success-light-9);
          
          .el-icon {
            color: var(--el-color-success);
          }
        }
        
        .node-line {
          background: var(--el-color-success);
        }
      }
      
      &.current {
        .node-dot {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          
          .el-icon {
            color: var(--el-color-primary);
          }
        }
      }
      
      &.has-error {
        .node-dot {
          border-color: var(--el-color-danger);
          background: var(--el-color-danger-light-9);
          
          .el-icon {
            color: var(--el-color-danger);
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style> 