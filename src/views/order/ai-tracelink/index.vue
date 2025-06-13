<!-- Template Section -->
<template>
  <div class="ai-tracelink">
    <!-- Background Elements -->
    <div class="tech-background">
      <div class="grid-overlay"></div>
      <div class="floating-particles"></div>
      <div class="glow-circle"></div>
    </div>

    <!-- Search Section -->
    <div class="search-section" :class="{ 'has-result': hasResult }">
      <div class="welcome-text" v-if="!hasResult">
        <h1>AI Order Tracking Assistant</h1>
        <p>AI-powered intelligent order management system, providing a complete tracking experience from order placement to delivery</p>
      </div>
      
      <!-- Tracking Modules -->
      <tracking-modules
        v-if="!hasResult"
        @search="handleModuleSearch"
      />
    </div>

    <!-- Result Section -->
    <div v-if="hasResult" class="result-section">
      <tracking-result
        :data="trackingData"
        @back="handleBack"
      />
    </div>
  </div>
</template>

<!-- Script Section -->
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import TrackingResult from './components/TrackingResult.vue'
import TrackingModules from './components/TrackingModules.vue'

const trackingData = ref<any>(null)
const hasResult = computed(() => !!trackingData.value)

// Handle back button click
const handleBack = () => {
  trackingData.value = null
}

// Handle module search
const handleModuleSearch = async (data: { module: string, query: string }) => {
  try {
    // Call API to get data
    const response = await mockFetchData(data.query)
    trackingData.value = response
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error('Failed to fetch data. Please try again later.')
  }
}

// Mock data fetch function
const mockFetchData = async (query: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock data
  return {
    orderNo: query,
    status: 'processing',
    updateTime: new Date().toLocaleString('en-US'),
    delayRisk: Math.random() > 0.5,
    splitFulfillment: Math.random() > 0.5,
    items: [
      {
        sku: 'IPH15PM-256-BLK',
        name: 'iPhone 15 Pro Max - 256GB Space Black',
        image: '/images/products/iphone15pm.jpg',
        specs: {
          'Color': 'Space Black',
          'Storage': '256GB'
        },
        quantity: 1,
        price: 1299.99
      }
    ],
    subtotal: 1299.99,
    shipping: 0,
    tax: 24.99,
    total: 1324.98,
    fulfillmentOrders: [
      {
        id: 'FO-LA-20250611-001',
        warehouse: 'LA Distribution Center',
        location: 'Los Angeles, CA',
        status: 'shipped',
        steps: [
          {
            name: 'Order Received',
            completed: true,
            time: '2025-06-10 09:30'
          },
          {
            name: 'Order Assigned',
            completed: true,
            time: '2025-06-10 14:15'
          },
          {
            name: 'Picking',
            completed: true,
            time: '2025-06-11 08:45'
          },
          {
            name: 'Packing Complete',
            completed: true,
            time: '2025-06-11 10:45'
          },
          {
            name: 'Ready for Shipment',
            completed: true,
            time: '2025-06-11 14:30'
          },
          {
            name: 'Shipped',
            completed: true,
            time: '2025-06-11 16:30'
          }
        ]
      }
    ],
    packages: [
      {
        carrier: 'UPS',
        trackingNo: '1ZXXX123456',
        status: 'in_transit',
        events: [
          {
            time: '2025-06-11 16:45',
            location: 'Newark, NJ',
            description: 'Package picked up',
            current: false
          },
          {
            time: '2025-06-12 09:30',
            location: 'Philadelphia, PA Hub',
            description: 'Arrived at sorting facility',
            current: false
          },
          {
            time: '2025-06-13 02:49',
            location: 'Chicago, IL Hub',
            description: 'In transit',
            current: true,
            meta: [
              {
                label: 'Estimated Delivery',
                value: 'On Time',
                type: 'success'
              },
              {
                label: 'Weather Condition',
                value: 'Good',
                type: 'info'
              }
            ]
          }
        ]
      }
    ]
  }
}
</script>

<!-- Style Section -->
<style lang="scss" scoped>
.ai-tracelink {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1f35 0%, #131b2e 100%);
  
  // Tech Background
  .tech-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    overflow: hidden;

    // Grid Overlay
    .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(66, 133, 244, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(66, 133, 244, 0.05) 1px, transparent 1px);
      background-size: 30px 30px;
      animation: gridMove 20s linear infinite;
    }

    // Floating Particles
    .floating-particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      
      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(circle, #4285f4 1px, transparent 1px);
        background-size: 50px 50px;
        opacity: 0.3;
        animation: particleFloat 15s linear infinite;
      }

      &::after {
        animation-delay: -7.5s;
        opacity: 0.2;
      }
    }

    // Glow Circle
    .glow-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(66, 133, 244, 0.1) 0%, transparent 70%);
      animation: glowPulse 4s ease-in-out infinite;
    }
  }

  // Content Styles
  .search-section {
    position: relative;
    z-index: 1;
    padding: 40px 20px;
    
    .welcome-text {
      text-align: center;
      margin-bottom: 40px;
      
      h1 {
        font-size: 48px;
        font-weight: 600;
        color: #ffffff;
        margin: 0 0 20px;
        text-shadow: 0 0 20px rgba(66, 133, 244, 0.5);
        animation: titleGlow 2s ease-in-out infinite;
      }
      
      p {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        max-width: 800px;
        margin: 0 auto;
      }
    }

    &.has-result {
      padding: 20px;
    }
  }

  .result-section {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
}

// Animations
@keyframes gridMove {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(30px);
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50px);
  }
}

@keyframes glowPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(66, 133, 244, 0.5);
  }
  50% {
    text-shadow: 0 0 30px rgba(66, 133, 244, 0.8);
  }
}
</style>