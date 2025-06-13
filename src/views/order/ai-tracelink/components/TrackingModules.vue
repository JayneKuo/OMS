<template>
  <div class="tracking-modules">
    <!-- 标题区域 -->
    <div class="title-section">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          :placeholder="currentPlaceholder"
          class="custom-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button 
              type="primary" 
              class="search-button"
              :disabled="!searchQuery"
              @click="handleSearch"
            >
              Search
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 模块标题 -->
      <div class="module-title">
        <h2>Core Features</h2>
        <p>Please select a module to get started</p>
      </div>
    </div>

    <!-- 模块选择区域 -->
    <div class="module-grid">
      <div
        v-for="module in modules"
        :key="module.id"
        class="module-card"
        :class="{ 'active': selectedModule?.id === module.id }"
        @click="selectModule(module)"
      >
        <div class="card-content">
          <div class="icon-wrapper">
            <el-icon class="module-icon">
              <component :is="module.icon" />
            </el-icon>
          </div>
          <div class="text-content">
            <h3>{{ module.title }}</h3>
            <p>{{ module.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时状态面板 -->
    <div v-if="showDashboard" class="dashboard-section">
      <h2 class="section-title">Live System Status</h2>
      <div class="stats-grid">
        <div class="stat-card green">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">1,247</div>
            <div class="stat-label">Active Orders</div>
          </div>
          <div class="stat-trend">
            <span class="trend-value">+12.5%</span>
            <span class="trend-period">vs last week</span>
          </div>
        </div>
        <div class="stat-card blue">
          <div class="stat-icon">
            <el-icon><Box /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">89</div>
            <div class="stat-label">Pending Shipments</div>
          </div>
          <div class="stat-trend">
            <span class="trend-value">-5.2%</span>
            <span class="trend-period">vs last week</span>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">
            <el-icon><Van /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">156</div>
            <div class="stat-label">In Transit</div>
          </div>
          <div class="stat-trend">
            <span class="trend-value">+8.7%</span>
            <span class="trend-period">vs last week</span>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="stat-icon">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">98.5%</div>
            <div class="stat-label">On-Time Rate</div>
          </div>
          <div class="stat-trend">
            <span class="trend-value">+1.2%</span>
            <span class="trend-period">vs last week</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  Document,
  Box,
  House,
  TakeawayBox,
  Van,
  Connection,
  Goods,
  Timer,
} from '@element-plus/icons-vue'

// 定义模块类型
interface TrackingModule {
  id: string
  title: string
  icon: string
  description: string
  placeholder: string
}

// 定义模块数据
const modules = [
  {
    id: 'order',
    title: 'Order Information',
    icon: 'Document',
    description: 'Track orders by order number or platform reference',
    placeholder: 'Please enter your order number'
  },
  {
    id: 'product',
    title: 'Product Information',
    icon: 'Goods',
    description: 'Search products by SKU or product code',
    placeholder: 'Please enter SKU or product code'
  },
  {
    id: 'inventory',
    title: 'Inventory Status',
    icon: 'House',
    description: 'View warehouse inventory and availability',
    placeholder: 'Please enter SKU or warehouse name'
  },
  {
    id: 'outbound',
    title: 'Outbound Tracking',
    icon: 'Box',
    description: 'Track outbound tasks (picking, packing, weighing)',
    placeholder: 'Please enter outbound order number'
  },
  {
    id: 'package',
    title: 'Package Information',
    icon: 'TakeawayBox',
    description: 'View package details, logistics, and milestones',
    placeholder: 'Please enter package tracking number'
  },
  {
    id: 'logistics',
    title: 'Logistics Tracking',
    icon: 'Van',
    description: 'Visualize delivery routes, checkpoints, and ETA',
    placeholder: 'Please enter logistics tracking number'
  }
]

const selectedModule = ref<TrackingModule | null>(null)
const searchQuery = ref('')
const showDashboard = ref(true)

// 计算当前的placeholder
const currentPlaceholder = computed<string>(() => {
  return selectedModule.value?.placeholder || 'Please enter order number to start tracking'
})

// 方法定义
const selectModule = (module: TrackingModule) => {
  selectedModule.value = module
  searchQuery.value = ''
}

const handleSearch = () => {
  if (!searchQuery.value) return
  // 触发搜索事件
  emit('search', {
    module: selectedModule.value?.id || 'fullchain',
    query: searchQuery.value
  })
}

// 定义事件
const emit = defineEmits<{
  (e: 'search', data: { module: string, query: string }): void
}>()
</script>

<style lang="scss" scoped>
.tracking-modules {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;

  .title-section {
    text-align: center;
    margin-bottom: 40px;

    .module-title {
      margin: 60px 0 32px;
      text-align: center;

      h2 {
        font-size: 32px;
        font-weight: 600;
        color: #ffffff;
        margin: 0 0 16px;
        text-shadow: 0 0 20px rgba(66, 133, 244, 0.5);
      }

      p {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }
    }

    .search-section {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

      .custom-input {
        .el-input__wrapper {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: none !important;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;

          &:hover, &:focus-within {
            border-color: rgba(66, 133, 244, 0.5);
            background: rgba(255, 255, 255, 0.1);
          }
        }

        :deep(.el-input__inner) {
          height: 48px;
          font-size: 16px;
          padding: 0 16px;
          color: #ffffff;
          
          &::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        }

        :deep(.el-input-group__append) {
          padding: 0;
          border: none;
          background: transparent;

          .search-button {
            height: 48px;
            padding: 0 24px;
            font-size: 16px;
            border-radius: 0 8px 8px 0;
            margin: -1px;
            background: linear-gradient(135deg, #4285f4, #34a853);
            border: none;
            
            &:hover {
              background: linear-gradient(135deg, #5294ff, #3cb85d);
            }
            
            &:active {
              transform: translateY(1px);
            }
          }
        }
      }
    }
  }

  .module-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 24px;
    margin-bottom: 40px;

    .module-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1));
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-4px);
        border-color: rgba(66, 133, 244, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

        &::before {
          opacity: 1;
        }

        .icon-wrapper {
          transform: scale(1.1);
          background: linear-gradient(135deg, #4285f4, #34a853);

          .module-icon {
            color: #ffffff;
          }
        }
      }

      &.active {
        border-color: #4285f4;
        background: rgba(66, 133, 244, 0.1);

        .icon-wrapper {
          background: linear-gradient(135deg, #4285f4, #34a853);

          .module-icon {
            color: #ffffff;
          }
        }
      }

      .card-content {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        position: relative;
        z-index: 1;

        .icon-wrapper {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(66, 133, 244, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;

          .module-icon {
            font-size: 24px;
            color: #4285f4;
            transition: color 0.3s ease;
          }
        }

        .text-content {
          flex-grow: 1;

          h3 {
            margin: 0 0 8px;
            font-size: 18px;
            color: #ffffff;
          }

          p {
            margin: 0;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
          }
        }
      }
    }
  }

  .dashboard-section {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

    .section-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(66, 133, 244, 0.5);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;

      .stat-card {
        padding: 24px;
        border-radius: 16px;
        color: white;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: all 0.3s ease;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          transform: translateY(-4px);
          
          &::before {
            opacity: 1;
          }

          .stat-icon {
            transform: scale(1.1) rotate(10deg);
          }
        }

        &.green { 
          background: linear-gradient(135deg, #10B981, #059669);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
        }
        &.blue { 
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
        }
        &.orange { 
          background: linear-gradient(135deg, #F97316, #EA580C);
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.2);
        }
        &.purple { 
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          .el-icon {
            font-size: 24px;
            color: #ffffff;
          }
        }

        .stat-content {
          flex-grow: 1;

          .stat-value {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 4px;
            background: linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0.8));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .stat-label {
            font-size: 14px;
            font-weight: 500;
            opacity: 0.9;
            letter-spacing: 0.5px;
          }
        }

        .stat-trend {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;

          .trend-value {
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            gap: 4px;

            &::before {
              content: '↑';
              opacity: 0.8;
            }

            &:not([class*="positive"])::before {
              content: '↓';
              opacity: 0.8;
            }
          }

          .trend-period {
            font-size: 12px;
            opacity: 0.7;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tracking-modules {
    padding: 16px;

    .title-section {
      .module-title {
        h2 {
          font-size: 24px;
        }

        p {
          font-size: 14px;
        }
      }
    }

    .module-grid {
      grid-template-columns: 1fr;
    }

    .dashboard-section {
      padding: 20px;

      .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        .stat-card {
          padding: 16px;

          .stat-value {
            font-size: 24px;
          }

          .stat-label {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style> 