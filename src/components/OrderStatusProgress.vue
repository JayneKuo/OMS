<template>
  <div class="order-status-card">
    <div class="card-header">
      <h3 class="title">订单状态流转</h3>
    </div>
    
    <div class="status-progress">
      <div class="status-nodes">
        <!-- 生成完整的节点序列，包括动态节点 -->
        <template v-for="(node, index) in allNodes" :key="node.id">
          <!-- 连接线 -->
          <div 
            v-if="index < allNodes.length - 1" 
            class="connector-line"
            :class="{
              'is-completed': node.isCompleted,
              'is-dynamic': node.isDynamic
            }"
          ></div>

          <div 
            class="status-node"
            :class="{
              'is-completed': node.isCompleted,
              'is-current': node.isCurrent,
              'is-dynamic': node.isDynamic,
              [`status-${node.type}`]: node.isDynamic
            }"
          >
            <div class="node-dot">
              <el-icon v-if="node.isCompleted"><Check /></el-icon>
              <el-icon v-else-if="node.isDynamic">
                <component :is="getDynamicNodeIcon({ status: node.status })" />
              </el-icon>
            </div>
            <div class="node-info">
              <span class="node-label">{{ node.label }}</span>
              <span v-if="node.time" class="node-time">{{ node.time }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- 动态状态详情 -->
      <div v-if="currentDynamicNode" class="dynamic-status">
        <div 
          class="status-detail"
          :class="getDynamicNodeClass(currentDynamicNode)"
        >
          <div class="detail-content">
            <!-- Pending状态特殊显示 -->
            <template v-if="currentDynamicNode.status === 'Pending'">
              <div class="pending-alert">
                <div class="alert-header">
                  <div class="alert-icon">
                    <el-icon><Warning /></el-icon>
                  </div>
                  <div class="alert-title">订单Hold中</div>
                </div>
                
                <div class="alert-details">
                  <div class="hold-info-item">
                    <div class="info-label">订单编号：</div>
                    <div class="info-value">SO00184716</div>
                  </div>
                  
                  <div class="hold-info-item">
                    <div class="info-label">Hold原因：</div>
                    <div class="info-value">包含高价值商品，触发风控规则</div>
                  </div>
                  
                  <div class="hold-info-item">
                    <div class="info-label">涉及商品：</div>
                    <div class="info-value">
                      <div class="product-list">
                        <div class="product-item">蓝色连衣裙 (SKU-001) - 单价￥1,299</div>
                        <div class="product-item">高端手表 (SKU-003) - 单价￥8,999</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="hold-info-item">
                    <div class="info-label">Hold规则：</div>
                    <div class="info-value">
                      <div class="rule-info">
                        <div class="rule-name">高价值订单审核规则 (RULE-001)</div>
                        <div class="rule-desc">单笔订单金额超过￥5,000需要人工审核</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="hold-info-item">
                    <div class="info-label">预计处理时间：</div>
                    <div class="info-value highlight">2024-01-15 16:30 (审核完成后自动下发)</div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 异常状态特殊显示 -->
            <template v-if="currentDynamicNode.status === 'Exception'">
              <div class="exception-alert">
                <div class="alert-header">
                  <div class="alert-icon">
                    <el-icon><Warning /></el-icon>
                  </div>
                  <div class="alert-title">订单商品库存不足</div>
                </div>
                
                <div class="alert-details">
                  <div class="inventory-item">
                    <div class="item-info">
                      <span class="sku-code">SKU-001</span>
                      <span class="item-name">(蓝色连衣裙)</span>
                    </div>
                    <div class="shortage-info">
                      <span class="required">需求：5件</span>
                      <span class="available">库存：3件</span>
                      <span class="shortage">缺少：2件</span>
                    </div>
                  </div>
                  
                  <div class="inventory-item">
                    <div class="item-info">
                      <span class="sku-code">SKU-002</span>
                      <span class="item-name">(红色T恤)</span>
                    </div>
                    <div class="shortage-info">
                      <span class="required">需求：3件</span>
                      <span class="available">库存：2件</span>
                      <span class="shortage">缺少：2件</span>
                    </div>
                  </div>
                </div>
                
                <div class="alert-suggestions">
                  <div class="suggestions-title">处理建议：</div>
                  <ul class="suggestions-list">
                    <li>请检查仓库实际库存</li>
                    <li>考虑部分发货</li>
                    <li>或等待补货后重新分配</li>
                  </ul>
                </div>
              </div>
            </template>
            

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { OrderStatus } from '@/types/order'
import { Check, Warning, CircleClose, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

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

// 标准状态流程
const standardStatuses = [
  OrderStatus.Imported,
  OrderStatus.Allocated,
  OrderStatus['Warehouse Processing'],
  OrderStatus.Shipped,
  OrderStatus.InTransit,
  OrderStatus.Delivered,
  OrderStatus.Completed
]

// 状态标签映射
const statusLabels: Record<OrderStatus, string> = {
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

// 当前动态节点
const currentDynamicNode = computed(() => {
  return props.dynamicNodes?.find(node => node.status === props.currentStatus)
})

// 生成完整的节点序列
const allNodes = computed(() => {
  const nodes = []
  const currentDynamic = currentDynamicNode.value
  
  // 位置映射：动态节点应该插入的位置
  const insertPositions = {
    beforeAllocated: 1,    // 在Allocated之前
    afterAllocated: 2,     // 在Allocated之后
    beforeWarehouse: 3,    // 在WarehouseProcessing之前
    afterWarehouse: 4,     // 在WarehouseProcessing之后
    beforeShipped: 5       // 在Shipped之前
  }
  
  // 标准节点
  standardStatuses.forEach((status, index) => {
    const standardNode = {
      id: `standard-${index}`,
      status: status,
      label: getStatusLabel(status),
      time: formatTime(getStatusTime(status)),
      isCompleted: shouldMarkCompleted(status),
      isCurrent: isCurrent(status),
      isDynamic: false,
      type: 'standard'
    }
    
    nodes.push(standardNode)
    
    // 检查是否需要在这个位置插入动态节点
    if (currentDynamic) {
      const insertPosition = insertPositions[currentDynamic.position]
      if (insertPosition === index + 1) {
        const dynamicNode = {
          id: `dynamic-${currentDynamic.status}`,
          status: currentDynamic.status,
          label: getStatusLabel(currentDynamic.status),
          time: currentDynamic.time,
          isCompleted: false,
          isCurrent: true,
          isDynamic: true,
          type: getDynamicNodeClass(currentDynamic).replace('status-', '')
        }
        nodes.push(dynamicNode)
      }
    }
  })
  
  return nodes
})

// 获取动态节点位置
const getDynamicNodeStyle = (node: { position: string }) => {
  const positionMap = {
    beforeAllocated: { left: '16.6%', prevStatus: OrderStatus.Imported },
    afterAllocated: { left: '33.2%', prevStatus: OrderStatus.Allocated },
    beforeWarehouse: { left: '49.8%', prevStatus: OrderStatus.Allocated },
    afterWarehouse: { left: '66.4%', prevStatus: OrderStatus['Warehouse Processing'] },
    beforeShipped: { left: '83%', prevStatus: OrderStatus['Warehouse Processing'] }
  }
  return { left: positionMap[node.position]?.left || '50%' }
}

// 判断节点是否应该标记为完成
const shouldMarkCompleted = (status: OrderStatus) => {
  if (!currentDynamicNode.value) return isCompleted(status)
  
  const statusIndex = standardStatuses.indexOf(status)
  const positionMap = {
    beforeAllocated: 1,
    afterAllocated: 2,
    beforeWarehouse: 2,
    afterWarehouse: 3,
    beforeShipped: 3
  }
  const dynamicNodePosition = positionMap[currentDynamicNode.value.position] || 0
  
  return statusIndex < dynamicNodePosition
}

// 判断状态是否已完成
const isCompleted = (status: OrderStatus) => {
  if (!props.currentStatus) return false
  const currentIndex = standardStatuses.indexOf(props.currentStatus)
  const statusIndex = standardStatuses.indexOf(status)
  return statusIndex <= currentIndex && currentIndex !== -1 && statusIndex !== -1
}

// 判断是否为当前状态
const isCurrent = (status: OrderStatus) => {
  return status === props.currentStatus
}

// 获取状态标签
const getStatusLabel = (status: OrderStatus) => {
  return statusLabels[status] || status
}

// 获取状态时间
const getStatusTime = (status: OrderStatus) => {
  return props.statusTimes?.[status] || ''
}

// 格式化时间
const formatTime = (time: string | number) => {
  if (!time) return ''
  try {
    const date = new Date(time)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return time.toString()
  }
}

// 获取动态节点样式类
const getDynamicNodeClass = (node: { status: OrderStatus }) => {
  switch (node.status) {
    case OrderStatus.Pending:
      return 'status-warning'
    case OrderStatus.Exception:
      return 'status-error'
    case OrderStatus.Deallocated:
    case OrderStatus.Cancelling:
    case OrderStatus.Canceled:
      return 'status-info'
    default:
      return ''
  }
}

// 获取动态节点图标
const getDynamicNodeIcon = (node: { status: OrderStatus }) => {
  switch (node.status) {
    case OrderStatus.Pending:
      return Warning
    case OrderStatus.Exception:
      return CircleClose
    case OrderStatus.Deallocated:
    case OrderStatus.Cancelling:
    case OrderStatus.Canceled:
      return InfoFilled
    default:
      return InfoFilled
  }
}


</script>

<style lang="scss" scoped>
.order-status-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  
  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }

  .status-progress {
    padding: 32px;
    position: relative;

    .status-nodes {
      display: flex;
      align-items: flex-start;
      position: relative;
      padding: 20px 0;
      margin: 0 40px;
      gap: 0;

      // 连接线
      .connector-line {
        height: 2px;
        flex: 1;
        min-width: 60px;
        background-color: var(--el-border-color-light);
        margin: 12px 0 0 0;
        align-self: flex-start;

        &.is-completed {
          background-color: var(--el-color-primary);
        }

        &.is-dynamic {
          &.status-warning {
            background-color: var(--el-color-warning);
          }
          &.status-error {
            background-color: var(--el-color-danger);
          }
          &.status-info {
            background-color: var(--el-color-info);
          }
        }
      }

      // 状态节点
      .status-node {
        display: flex;
        flex-direction: column;
        align-items: center;
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
          margin-bottom: 8px;
          position: relative;
          z-index: 2;

          .el-icon {
            font-size: 14px;
            color: var(--el-text-color-secondary);
          }
        }

        .node-info {
          text-align: center;
          padding: 0 8px;

          .node-label {
            display: block;
            font-size: 14px;
            color: var(--el-text-color-regular);
            margin-bottom: 4px;
            white-space: nowrap;
          }

          .node-time {
            display: block;
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }

        &.is-completed {
          .node-dot {
            background: var(--el-color-success);
            border-color: var(--el-color-success);

            .el-icon {
              color: #fff;
            }
          }

          .node-label {
            color: var(--el-color-success);
          }
        }

        &.is-current {
          .node-dot {
            background: var(--el-color-primary);
            border-color: var(--el-color-primary);
            transform: scale(1.2);

            .el-icon {
              color: #fff;
            }
          }

          .node-label {
            color: var(--el-color-primary);
            font-weight: 500;
          }
        }

        // 动态节点样式
        &.is-dynamic {
          &.status-warning {
            .node-dot {
              background: var(--el-color-warning-light-9);
              border: 2px solid var(--el-color-warning);

              .el-icon {
                color: var(--el-color-warning);
              }
            }
            .node-label {
              color: var(--el-color-warning);
            }
          }

          &.status-error {
            .node-dot {
              background: var(--el-color-danger-light-9);
              border: 2px solid var(--el-color-danger);

              .el-icon {
                color: var(--el-color-danger);
              }
            }
            .node-label {
              color: var(--el-color-danger);
            }
          }

          &.status-info {
            .node-dot {
              background: var(--el-color-info-light-9);
              border: 2px solid var(--el-color-info);

              .el-icon {
                color: var(--el-color-info);
              }
            }
            .node-label {
              color: var(--el-color-info);
            }
          }
        }
      }
    }

    // 动态状态详情
    .dynamic-status {
      margin-top: 24px;

      .status-detail {
        border-radius: 6px;
        padding: 16px;
        background: var(--el-fill-color-light);

        &.status-warning {
          background: var(--el-color-warning-light-9);
          border: 1px solid var(--el-color-warning);
        }

        &.status-error {
          background: var(--el-color-danger-light-9);
          border: 1px solid var(--el-color-danger);
        }

        &.status-info {
          background: var(--el-color-info-light-9);
          border: 1px solid var(--el-color-info);
        }

        .detail-content {
          // Pending状态特殊样式
          .pending-alert {
            padding: 16px;
            border: 1px solid rgba(230, 162, 60, 0.3);
            border-radius: 8px;
            border-left: 4px solid #E6A23C;
            
            .alert-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 16px;
              
              .alert-icon {
                color: #E6A23C;
                font-size: 18px;
                flex-shrink: 0;
              }
              
              .alert-title {
                color: #E6A23C;
                font-size: 16px;
                font-weight: 600;
              }
            }
            
            .alert-details {
              .hold-info-item {
                display: flex;
                margin-bottom: 12px;
                
                &:last-child {
                  margin-bottom: 0;
                }
                
                .info-label {
                  color: #E6A23C;
                  font-weight: 600;
                  font-size: 14px;
                  width: 120px;
                  flex-shrink: 0;
                }
                
                .info-value {
                  color: #E6A23C;
                  font-size: 14px;
                  opacity: 0.9;
                  flex: 1;
                  
                  &.highlight {
                    font-weight: 600;
                    opacity: 1;
                  }
                  
                  .product-list {
                    .product-item {
                      padding: 4px 8px;
                      margin-bottom: 4px;
                      border-left: 3px solid #E6A23C;
                      font-size: 13px;
                      
                      &:last-child {
                        margin-bottom: 0;
                      }
                    }
                  }
                  
                  .rule-info {
                    .rule-name {
                      font-weight: 600;
                      margin-bottom: 4px;
                    }
                    
                    .rule-desc {
                      font-size: 13px;
                      opacity: 0.8;
                    }
                  }
                }
              }
            }
          }

          // 异常状态特殊样式
          .exception-alert {
            padding: 16px;
            border: 1px solid rgba(244, 63, 94, 0.3);
            border-radius: 8px;
            border-left: 4px solid #F43F5E;
            
            .alert-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 16px;
              
              .alert-icon {
                color: #F43F5E;
                font-size: 18px;
                flex-shrink: 0;
              }
              
              .alert-title {
                color: #F43F5E;
                font-size: 16px;
                font-weight: 600;
              }
            }
            
            .alert-details {
              margin-bottom: 16px;
              
              .inventory-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                margin-bottom: 8px;
                border-left: 3px solid #F43F5E;
                
                &:last-child {
                  margin-bottom: 0;
                }
                
                .item-info {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  
                  .sku-code {
                    color: #F43F5E;
                    font-weight: 600;
                    font-size: 13px;
                  }
                  
                  .item-name {
                    color: #F43F5E;
                    font-size: 13px;
                    opacity: 0.8;
                  }
                }
                
                .shortage-info {
                  display: flex;
                  gap: 12px;
                  font-size: 12px;
                  
                  .required {
                    color: #F43F5E;
                    opacity: 0.7;
                  }
                  
                  .available {
                    color: #F43F5E;
                    opacity: 0.7;
                  }
                  
                  .shortage {
                    color: #F43F5E;
                    font-weight: 600;
                  }
                }
              }
            }
            
            .alert-suggestions {
              .suggestions-title {
                color: #F43F5E;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 8px;
              }
              
              .suggestions-list {
                margin: 0;
                padding-left: 16px;
                
                li {
                  color: #F43F5E;
                  font-size: 13px;
                  line-height: 1.5;
                  margin-bottom: 4px;
                  opacity: 0.9;
                  
                  &:last-child {
                    margin-bottom: 0;
                  }
                }
              }
            }
          }

          .detail-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;

            &:last-child {
              margin-bottom: 0;
            }

            .label {
              color: var(--el-text-color-secondary);
              margin-right: 8px;
              min-width: 70px;
            }

            .value {
              color: var(--el-text-color-primary);
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}
</style> 