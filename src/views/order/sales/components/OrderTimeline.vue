<template>
  <div class="order-timeline">
    <!-- 额外字段卡片 -->
    <div class="extra-fields-card">
      <div class="card-header">
        <h3>Additional Information</h3>
      </div>
      <div class="fields-grid">
        <div class="field-item">
          <span class="label">Requested Ship Date</span>
          <span class="value">2024-03-22</span>
        </div>
        <div class="field-item">
          <span class="label">Channel Sales Order No.</span>
          <span class="value">CSO123456</span>
        </div>
        <div class="field-item">
          <span class="label">Purchase Order ID</span>
          <span class="value">PO987654</span>
        </div>
        <div class="field-item">
          <span class="label">Ship Method</span>
          <span class="value">Express</span>
        </div>
        <div class="field-item">
          <span class="label">Reference No.</span>
          <span class="value">REF789012</span>
        </div>
      </div>
    </div>

    <!-- 财务摘要卡片 -->
    <div class="financial-card">
      <div class="card-header">
        <h3>Financial Summary</h3>
      </div>
      <div class="amount-list">
        <div class="amount-item">
          <span class="label">Order Sub-Total</span>
          <span class="value">$1.10</span>
        </div>
        <div class="amount-item">
          <span class="label">Order Discount</span>
          <span class="value">$2.00</span>
        </div>
        <div class="amount-item">
          <span class="label">Sales Tax</span>
          <span class="value">$1.00</span>
        </div>
        <div class="amount-item">
          <span class="label">Shipping & Handling</span>
          <span class="value">$2.00</span>
        </div>
        <div class="amount-item total">
          <span class="label">Grand Total</span>
          <span class="value">$4.10</span>
        </div>
      </div>
    </div>

    <!-- 原有的时间线部分 -->
    <div class="timeline-section">
      <div class="timeline-header">
        <h3>Order Timeline</h3>
      </div>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :hollow="activity.hollow"
          :timestamp="formatDateTime(activity.timestamp)"
        >
          <div class="timeline-content">
            <h4>{{ activity.title }}</h4>
            <p>{{ activity.content }}</p>
            <div v-if="activity.operator" class="operator-info">
              <el-avatar :size="24" :src="activity.operator.avatar">
                {{ activity.operator.name.charAt(0) }}
              </el-avatar>
              <span>{{ activity.operator.name }}</span>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// 模拟时间线数据
const activities = ref([
  {
    timestamp: '2024-03-20 12:17:08 PM',
    title: 'Order Created',
    content: 'Order imported from channel successfully',
    type: 'primary',
    size: 'large',
    operator: {
      name: 'System',
      avatar: ''
    }
  },
  {
    timestamp: '2024-03-20 12:20:15 PM',
    title: 'Order Allocated',
    content: 'Order allocated to Warehouse A and Warehouse B',
    type: 'success',
    operator: {
      name: 'John Smith',
      avatar: ''
    }
  },
  {
    timestamp: '2024-03-20 12:35:22 PM',
    title: 'Package Created',
    content: 'Created 2 packages for the order',
    type: 'info',
    operator: {
      name: 'Sarah Johnson',
      avatar: ''
    }
  },
  {
    timestamp: '2024-03-20 13:10:45 PM',
    title: 'Order Shipped',
    content: 'Order shipped via FedEx and DHL',
    type: 'success',
    operator: {
      name: 'System',
      avatar: ''
    }
  }
])
</script>

<style lang="scss" scoped>
.order-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  width: 100%; // 改为100%宽度
  min-width: 300px; // 设置最小宽度
  max-width: 400px; // 设置最大宽度
}

// 卡片基础样式
.base-card {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  width: 100%; // 确保卡片宽度100%

  .card-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }
  }
}

// 额外字段卡片样式
.extra-fields-card {
  @extend .base-card;

  .fields-grid {
    padding: 12px 16px;
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); // 响应式网格

    .field-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0; // 防止内容溢出

      .label {
        font-size: 12px;
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .value {
        font-size: 13px;
        color: var(--text-primary);
        font-weight: 500;
        word-break: break-word; // 允许长文本换行
      }
    }
  }
}

// 财务卡片样式优化
.financial-card {
  @extend .base-card;

  .amount-list {
    padding: 8px 0;
  }

  .amount-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 16px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--hover-bg);
    }

    .label {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .value {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      font-family: var(--font-mono);
    }

    &.total {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--border-color);

      .label {
        font-weight: 600;
        color: var(--text-primary);
      }

      .value {
        font-size: 15px;
        font-weight: 600;
        color: var(--el-color-primary);
      }
    }
  }
}

// 时间线部分样式优化
.timeline-section {
  @extend .base-card;
  flex: 1;
  min-height: 200px;
  max-height: calc(100vh - 400px); // 设置最大高度
  overflow-y: auto;
  padding: 16px;

  .timeline-header {
    margin-bottom: 16px;
  }

  :deep(.el-timeline) {
    padding-left: 12px;

    .el-timeline-item {
      padding-bottom: 20px;

      &:last-child {
        padding-bottom: 0;
      }

      .el-timeline-item__node {
        background-color: var(--el-color-primary);
      }

      .el-timeline-item__tail {
        border-left-color: var(--border-color);
      }

      .el-timeline-item__timestamp {
        color: var(--text-secondary);
        font-size: 12px;
        margin-top: 6px;
      }
    }
  }

  .timeline-content {
    h4 {
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 4px;
    }

    p {
      font-size: 12px;
      margin: 0 0 6px;
    }

    .operator-info {
      gap: 6px;
      margin-top: 6px;

      .el-avatar {
        width: 20px;
        height: 20px;
        font-size: 12px;
      }

      span {
        font-size: 12px;
      }
    }
  }
}

// 滚动条样式优化
:deep(*) {
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-lighter) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color-lighter);
    border-radius: 3px;
  }
}

// 媒体查询
@media screen and (max-width: 1400px) {
  .order-timeline {
    max-width: 350px;
  }
}

@media screen and (max-width: 1200px) {
  .order-timeline {
    max-width: 320px;
  }

  .fields-grid {
    grid-template-columns: 1fr !important; // 在较小屏幕上改为单列
  }
}

@media screen and (max-width: 992px) {
  .order-timeline {
    max-width: 300px;
  }
}
</style> 