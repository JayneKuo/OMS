<template>
  <el-card class="stat-card" :body-style="{ padding: '20px' }">
    <div class="card-header">
      <span class="title">{{ title }}</span>
      <el-icon :size="24" :class="['icon', type === 'age' ? 'warning' : '']">
        <component :is="icon" />
      </el-icon>
    </div>
    
    <div class="stats-grid" :class="{ 'age-grid': type === 'age' }">
      <template v-if="type !== 'age'">
        <div class="stat-item">
          <span class="label">TODAY</span>
          <span class="value">{{ todayCount }}</span>
        </div>
        <div class="stat-item">
          <span class="label">7 DAYS</span>
          <span class="value">{{ weekCount }}</span>
        </div>
        <div class="stat-item">
          <span class="label">30 DAYS</span>
          <span class="value">{{ monthCount }}</span>
        </div>
        <div class="stat-item">
          <span class="label">YTD</span>
          <span class="value">{{ ytdCount }}</span>
        </div>
      </template>
      
      <template v-else>
        <div class="stat-item">
          <span class="label">TODAY</span>
          <span class="value">{{ todayCount }}</span>
        </div>
        <div class="stat-item">
          <span class="label">YESTERDAY</span>
          <span class="value">{{ yesterdayCount }}</span>
        </div>
        <div class="stat-item">
          <span class="label">LATE</span>
          <span class="value" :class="{ 'warning': lateCount > 0 }">{{ lateCount }}</span>
        </div>
        <div class="stat-item">
          <span class="label">YTD</span>
          <span class="value">{{ ytdCount }}</span>
        </div>
      </template>
    </div>

    <div class="trend" :class="trend">
      <el-icon>
        <ArrowUp v-if="trend === 'up'" />
        <ArrowDown v-if="trend === 'down'" />
      </el-icon>
      <span>{{ trendPercentage }}% from last period</span>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: [String, Object],
    required: true
  },
  todayCount: {
    type: Number,
    default: 0
  },
  weekCount: {
    type: Number,
    default: 0
  },
  monthCount: {
    type: Number,
    default: 0
  },
  ytdCount: {
    type: Number,
    default: 0
  },
  yesterdayCount: {
    type: Number,
    default: 0
  },
  lateCount: {
    type: Number,
    default: 0
  },
  trend: {
    type: String,
    default: 'up',
    validator: (value: string) => ['up', 'down'].includes(value)
  },
  trendPercentage: {
    type: [Number, String],
    default: 0
  },
  type: {
    type: String,
    default: 'normal',
    validator: (value: string) => ['normal', 'age'].includes(value)
  }
})
</script>

<style lang="scss" scoped>
.stat-card {
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--el-box-shadow-light);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      letter-spacing: 0.5px;
    }
    
    .icon {
      font-size: 28px;
      padding: 8px;
      border-radius: 8px;
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      
      &.warning {
        background: var(--el-color-warning-light-9);
        color: var(--el-color-warning);
      }
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 24px;
    
    &.age-grid {
      .stat-item {
        .value.warning {
          color: var(--el-color-danger);
          animation: pulse 2s infinite;
        }
      }
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border-radius: 6px;
      background: var(--el-bg-color-page);
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--el-bg-color);
        transform: translateY(-1px);
      }
      
      .label {
        font-size: 13px;
        font-weight: 500;
        color: var(--el-text-color-secondary);
        letter-spacing: 1px;
      }
      
      .value {
        font-size: 28px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        line-height: 1.2;
      }
    }
  }
  
  .trend {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    background: var(--el-bg-color-page);
    
    &.up {
      color: var(--el-color-success);
      background: var(--el-color-success-light-9);
    }
    
    &.down {
      color: var(--el-color-danger);
      background: var(--el-color-danger-light-9);
    }
    
    .el-icon {
      font-size: 18px;
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style> 