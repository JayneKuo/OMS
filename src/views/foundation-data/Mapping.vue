<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Mapping</h1>
        <p class="subtitle">The shipping mapping of the original order, from channel mapping to warehouse.</p>
      </div>
      <div class="header-actions">
        <template v-if="activeTab === 'channel'">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            Add Channel Mapping
          </el-button>
        </template>
        <template v-else-if="activeTab === 'product'">
          <el-button type="primary" @click="handleAddProduct">
            <el-icon><Plus /></el-icon>
            Add Product
          </el-button>
          <el-button type="primary" @click="handleBulkImport">
            <el-icon><Upload /></el-icon>
            Bulk Import
          </el-button>
        </template>
        <template v-else-if="activeTab === 'uom'">
          <el-button type="primary" @click="handleAddUom">
            <el-icon><Plus /></el-icon>
            Add UOM
          </el-button>
        </template>
        <template v-else-if="activeTab === 'warehouse'">
          <el-button type="primary" @click="handleAddWarehouse">
            <el-icon><Plus /></el-icon>
            Add Warehouse
          </el-button>
        </template>
      </div>
    </div>

    <div class="tab-container">
      <el-tabs v-model="activeTab" class="mapping-tabs">
        <el-tab-pane label="Channel Shipping Mapping" name="channel">
          <div class="mapping-content">
            <div class="mapping-card">
              <div class="mapping-header">
                <div class="channel-info">
                  <span class="label">APPLY TO CHANNEL</span>
                  <el-input v-model="channelName" placeholder="mock-channel-name" />
                  <span class="time">03/15/2025, 12:27:18 AM</span>
                </div>
              </div>
              
              <div class="mapping-body">
                <div class="mapping-row">
                  <div class="left-inputs">
                    <el-input v-model="productName" placeholder="Product Name" />
                    <el-input v-model="ttt" placeholder="TTT" />
                  </div>
                  <div class="arrow">
                    <el-icon><ArrowRight /></el-icon>
                  </div>
                  <div class="right-inputs">
                    <el-input v-model="shipMethod" placeholder="Ship Method" />
                    <el-input v-model="truckload" placeholder="Truckload" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Product Mapping" name="product">
          <product-mapping ref="productMappingRef" />
        </el-tab-pane>
        <el-tab-pane label="UOM Mapping" name="uom">
          <div class="empty-content">
            <el-empty description="UOM Mapping Content" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Warehouse Shipping Mapping" name="warehouse">
          <div class="empty-content">
            <el-empty description="Warehouse Shipping Mapping Content" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, ArrowRight, Upload } from '@element-plus/icons-vue'
import ProductMapping from './components/ProductMapping.vue'

const activeTab = ref('channel')
const channelName = ref('')
const productName = ref('')
const ttt = ref('')
const shipMethod = ref('')
const truckload = ref('')
const productMappingRef = ref()

const handleAdd = () => {
  console.log('Add channel mapping')
}

const handleAddProduct = () => {
  productMappingRef.value?.handleAddProduct()
}

const handleBulkImport = () => {
  productMappingRef.value?.handleBulkImport()
}

const handleAddUom = () => {
  console.log('Add UOM')
}

const handleAddWarehouse = () => {
  console.log('Add warehouse')
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--el-bg-color-page);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 500;
    margin: 0;
    color: var(--el-text-color-primary);
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    
    .el-button {
      border-radius: 8px;
      height: 40px;
      padding: 0 20px;
      
      .el-icon {
        margin-right: 8px;
      }
    }
  }
}

.tab-container {
  .mapping-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 24px;
    }

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
      background-color: var(--el-border-color-light);
    }

    :deep(.el-tabs__item) {
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      color: var(--el-text-color-regular);
      
      &.is-active {
        font-weight: 500;
        color: #9D5FFE;
      }

      &:hover {
        color: #9D5FFE;
      }
    }

    :deep(.el-tabs__active-bar) {
      background-color: #9D5FFE;
    }
  }
}

.mapping-content {
  .mapping-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    border: 1px solid var(--el-border-color-light);
  }

  .mapping-header {
    margin-bottom: 24px;

    .channel-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .label {
        font-weight: 500;
        color: var(--el-text-color-secondary);
      }

      .time {
        margin-left: auto;
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }

      :deep(.el-input) {
        width: 300px;
      }
    }
  }

  .mapping-body {
    .mapping-row {
      display: flex;
      align-items: center;
      gap: 24px;

      .left-inputs,
      .right-inputs {
        flex: 1;
        display: flex;
        gap: 16px;

        :deep(.el-input) {
          flex: 1;
        }
      }

      .arrow {
        font-size: 24px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.empty-content {
  padding: 40px 0;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
}
</style> 