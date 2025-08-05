<!-- src/views/purchase/tracking/index.vue -->
<template>
  <div class="purchase-tracking">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="gradient-text">Purchase Order Tracking</h1>
        <p class="hero-description">
          Real-time visibility into your supply chain journey, from production planning to final delivery
        </p>
        
        <div class="search-container">
          <div class="search-box">
            <el-input
              v-model="searchQuery"
              placeholder="Enter tracking number..."
              class="search-input"
              size="large"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon class="search-icon"><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" class="search-button" @click="handleSearch">
              Track Now
            </el-button>
          </div>
          <div class="supported-types">
            Track by: 
            <el-tag 
              v-for="type in searchTypes" 
              :key="type.name"
              class="type-tag"
              :effect="'plain'"
            >
              {{ type.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="section-title">
        <h2>End-to-End Supply Chain Visibility</h2>
        <p>Track every milestone of your purchase order journey with real-time updates and comprehensive monitoring</p>
      </div>

      <div class="features-grid">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="feature-card"
        >
          <div class="feature-icon">
            <el-icon><component :is="feature.icon" /></el-icon>
          </div>
          <h3>{{ feature.name }}</h3>
          <p>{{ feature.description }}</p>
          <ul class="feature-points">
            <li v-for="(point, idx) in feature.points" :key="idx">
              {{ point }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, 
  Document, 
  Box, 
  Ship,
  Finished,
  TakeawayBox,
  DocumentChecked
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchQuery = ref('')

const searchTypes = [
  {
    name: 'PO Number',
    example: 'PO-2024-001'
  },
  {
    name: 'Container Number',
    example: 'CNTR1234567'
  },
  {
    name: 'Booking Reference',
    example: 'BK-123-45678'
  },
  {
    name: 'Supplier Reference',
    example: 'SUP-REF-12345'
  }
]

const features = [
  {
    icon: DocumentChecked,
    name: 'Order Management',
    description: 'Complete visibility of purchase order lifecycle',
    points: [
      'PO creation and approval tracking',
      'Document verification status',
      'Real-time order status updates',
      'Supplier confirmation monitoring'
    ]
  },
  {
    icon: TakeawayBox,
    name: 'Production Tracking',
    description: 'Monitor manufacturing progress in real-time',
    points: [
      'Material readiness status',
      'Production line tracking',
      'Quality inspection results',
      'Packaging and ready-to-ship updates'
    ]
  },
  {
    icon: Ship,
    name: 'Logistics Visibility',
    description: 'End-to-end shipping and customs tracking',
    points: [
      'Export documentation status',
      'Customs clearance tracking',
      'Real-time shipment location',
      'Port operations monitoring'
    ]
  },
  {
    icon: Finished,
    name: 'Delivery Management',
    description: 'Last-mile delivery and receipt confirmation',
    points: [
      'Warehouse receipt status',
      'Quality inspection results',
      'Delivery scheduling updates',
      'POD and documentation'
    ]
  }
]

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('Please enter a tracking number')
    return
  }
  
  router.push(`/purchase/tracking/${searchQuery.value.trim()}`)
}
</script>

<style scoped lang="scss">
// 定义主题色变量
:root {
  --theme-purple: #6366f1;
  --theme-purple-light: #818cf8;
  --theme-purple-lighter: #c7d2fe;
  --theme-purple-lightest: #eef2ff;
}

.purchase-tracking {
  min-height: 100vh;
  background-color: var(--el-bg-color);
  overflow: hidden;

  .hero-section {
    position: relative;
    padding: 100px 20px 80px;
    background: linear-gradient(
      to bottom,
      rgba(99, 102, 241, 0.08),
      var(--el-bg-color) 90%
    );
    overflow: hidden;

    // 添加海运元素背景
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800' fill='none'%3E%3Cpath d='M400 50L600 150V350L400 450L200 350V150L400 50Z' stroke='%236366f1' stroke-width='2'/%3E%3Cpath d='M300 250H500M300 300H500M300 350H500' stroke='%236366f1' stroke-width='2'/%3E%3Cpath d='M100 500H700M150 550H650M200 600H600' stroke='%236366f1' stroke-width='2' stroke-dasharray='10 5'/%3E%3Cpath d='M350 650C350 650 400 600 450 650C500 700 550 650 550 650' stroke='%236366f1' stroke-width='2'/%3E%3C/svg%3E");
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 0;
    }

    .hero-content {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      z-index: 2;

      .title-wrapper {
        position: relative;
        display: inline-block;
        margin-bottom: 40px;

        .subtitle {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-purple);
          background: var(--theme-purple-lightest);
          padding: 4px 12px;
          border-radius: 12px;
          white-space: nowrap;
        }

        .gradient-text {
          font-size: 42px;
          font-weight: 600;
          margin: 0 0 20px;
          color: var(--theme-purple);
          position: relative;
          display: inline-block;
          padding-bottom: 15px;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            background: linear-gradient(90deg, 
              transparent,
              var(--theme-purple),
              transparent
            );
            border-radius: 2px;
          }
        }

        .title-decoration {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;

          .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--theme-purple-light);

            &.center {
              width: 8px;
              height: 8px;
              background: var(--theme-purple);
            }
          }

          &::before,
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 60px;
            height: 1px;
            background: linear-gradient(90deg, 
              transparent,
              var(--theme-purple-light));
          }

          &::before {
            right: 100%;
            transform: translateX(-10px);
          }

          &::after {
            left: 100%;
            transform: translateX(10px);
            background: linear-gradient(90deg, 
              var(--theme-purple-light),
              transparent);
          }
        }
      }

      .hero-description {
        font-size: 16px;
        color: var(--el-text-color-regular);
        margin: 0 auto 40px;
        line-height: 1.6;
        max-width: 600px;
      }

      .search-container {
        background: var(--el-bg-color-overlay);
        border-radius: 16px;
        padding: 24px;
        max-width: 700px;
        margin: 0 auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--el-border-color-light);

        .search-box {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;

          .search-input {
            flex: 1;
            
            :deep(.el-input__wrapper) {
              background: var(--el-bg-color);
              border: 1px solid var(--el-border-color);
              transition: all 0.3s ease;
              border-radius: 8px;

              &:hover, &.is-focus {
                border-color: var(--theme-purple);
                box-shadow: 0 0 0 1px var(--theme-purple-lighter);
              }
            }

            :deep(.el-input__inner) {
              font-size: 16px;
              color: var(--el-text-color-primary);
            }

            .search-icon {
              font-size: 20px;
              color: var(--el-text-color-secondary);
            }
          }

          .search-button {
            height: 40px;
            padding: 0 24px;
            font-size: 14px;
            border-radius: 8px;
            background: var(--theme-purple);
            border-color: var(--theme-purple);

            &:hover {
              background: var(--theme-purple-light);
              border-color: var(--theme-purple-light);
            }
          }
        }

        .supported-types {
          color: var(--el-text-color-secondary);
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;

          .type-tag {
            margin: 0 4px;
            font-size: 12px;
            border-radius: 4px;
            background: var(--el-bg-color);
            border-color: var(--el-border-color-light);
            padding: 0 8px;
            height: 24px;
            line-height: 22px;
          }
        }
      }
    }

    .hero-background {
      .shape {
        background: linear-gradient(120deg, 
          rgba(99, 102, 241, 0.2),
          rgba(129, 140, 248, 0.2));
      }
    }
  }

  .features-section {
    padding: 80px 20px;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;

    // 添加背景装饰
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 20%);
      pointer-events: none;
    }

    .section-title {
      text-align: center;
      margin-bottom: 60px;
      position: relative;

      &::after {
        content: '';
        display: block;
        width: 80px;
        height: 4px;
        background: linear-gradient(90deg, var(--theme-purple), var(--theme-purple-light));
        margin: 20px auto 0;
        border-radius: 2px;
      }

      h2 {
        font-size: 36px;
        font-weight: 600;
        color: var(--theme-purple);
        margin: 0 0 16px;
        position: relative;
        display: inline-block;

        &::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          background: var(--theme-purple-lightest);
          border-radius: 50%;
          left: -15px;
          top: -5px;
          z-index: -1;
        }
      }

      p {
        font-size: 18px;
        color: var(--el-text-color-secondary);
        max-width: 600px;
        margin: 0 auto;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      padding: 0 20px;

      .feature-card {
        padding: 32px 24px;
        background: var(--el-bg-color-overlay);
        border-radius: 16px;
        border: 2px solid transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

        // 添加装饰背景
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(
            135deg,
            var(--theme-purple-lightest) 0%,
            rgba(99, 102, 241, 0.02) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          transform: translateY(-4px);
          border-color: var(--theme-purple);
          background: linear-gradient(
            to bottom,
            rgba(99, 102, 241, 0.03),
            rgba(99, 102, 241, 0.02)
          );
          box-shadow: 
            0 12px 28px rgba(99, 102, 241, 0.15),
            0 0 0 2px var(--theme-purple);

          &::before {
            opacity: 1;
          }

          .feature-icon {
            background: var(--theme-purple);
            color: white;
            transform: scale(1.1) rotate(10deg);
            box-shadow: 
              0 8px 16px rgba(99, 102, 241, 0.2),
              0 0 0 2px var(--theme-purple-light);

            &::after {
              transform: scale(1.2);
              opacity: 0;
            }
          }

          h3 {
            color: var(--theme-purple);
          }

          p {
            color: var(--theme-purple);
          }

          .feature-points {
            li {
              color: var(--theme-purple);
              
              &::before {
                transform: scale(1.2);
                background: var(--theme-purple);
                box-shadow: 0 0 8px var(--theme-purple);
              }
            }
          }
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: var(--theme-purple-lightest);
          color: var(--theme-purple);
          font-size: 26px;
          margin-bottom: 28px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;

          // 添加光晕效果
          &::after {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            background: var(--theme-purple);
            border-radius: 18px;
            z-index: -1;
            opacity: 0.15;
            transition: all 0.4s ease;
          }

          .el-icon {
            transition: transform 0.3s ease;
            filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2));
          }
        }

        h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin: 0 0 16px;
          transition: all 0.3s ease;
        }

        p {
          font-size: 14px;
          color: var(--el-text-color-regular);
          margin-bottom: 24px;
          line-height: 1.6;
          flex-grow: 1;
        }

        .feature-points {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;

          li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 12px;
            font-size: 14px;
            color: var(--el-text-color-secondary);
            line-height: 1.5;

            &:last-child {
              margin-bottom: 0;
            }

            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: var(--theme-purple-light);
              transition: all 0.3s ease;
            }
          }
        }

        // 添加序号装饰
        &::after {
          content: attr(data-number);
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 48px;
          font-weight: 700;
          color: var(--theme-purple-lightest);
          opacity: 0.5;
          line-height: 1;
          transition: color 0.3s ease;
        }

        &:hover::after {
          color: var(--theme-purple-lighter);
        }
      }
    }
  }
}

// Dark mode adjustments
@media (prefers-color-scheme: dark) {
  .purchase-tracking {
    .hero-section {
      background: linear-gradient(
        to bottom,
        rgba(99, 102, 241, 0.1),
        var(--el-bg-color) 90%
      );

      &::before {
        opacity: 0.08;
      }
    }

    .hero-section .hero-content {
      .title-wrapper {
        .subtitle {
          background: rgba(99, 102, 241, 0.1);
        }
      }
      .search-container {
        background: var(--el-bg-color);
        border-color: var(--el-border-color-darker);
      }
    }

    .features-section .features-grid .feature-card {
      background: var(--el-bg-color);
      border: 2px solid var(--el-border-color-darker);
      box-shadow: none;

      &:hover {
        border-color: var(--theme-purple);
        background: linear-gradient(
          to bottom,
          rgba(99, 102, 241, 0.1),
          rgba(99, 102, 241, 0.05)
        );
        box-shadow: 
          0 12px 28px rgba(99, 102, 241, 0.2),
          0 0 0 2px var(--theme-purple);

        p {
          color: var(--theme-purple-lighter);
        }

        .feature-points li {
          color: var(--theme-purple-lighter);
        }
      }
    }
  }
}

// Responsive design
@media (max-width: 1200px) {
  .purchase-tracking {
    .features-section .features-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }
}

@media (max-width: 768px) {
  .purchase-tracking {
    .hero-section {
      padding: 60px 20px 40px;

      .hero-content {
        .title-wrapper {
          .subtitle {
            font-size: 12px;
            top: -20px;
          }

          .gradient-text {
            font-size: 32px;
          }

          .hero-description {
            font-size: 14px;
            padding: 0 20px;
          }

          .search-container {
            padding: 16px;

            .search-box {
              flex-direction: column;

              .search-button {
                width: 100%;
              }
            }
          }
        }
      }
    }

    .features-section {
      padding: 60px 20px;

      .section-title h2 {
        font-size: 28px;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 0;
      }
    }
  }
}
</style> 