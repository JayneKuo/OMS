<template>
  <div class="integrations-page">
    <div class="page-header">
      <div class="title-section">
        <h2>Integrations</h2>
        <el-tooltip content="Learn about integrations">
          <el-icon class="info-icon"><InfoFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="actions">
        <el-button type="primary" @click="handleAddIntegration">Add Integration</el-button>
        <el-button type="primary" @click="handleAddCustomIntegration">Add Custom Integration</el-button>
      </div>
    </div>

    <div class="filter-bar">
      <el-select v-model="filterType" placeholder="Type" clearable class="filter-select">
        <el-option label="All" value="" />
        <el-option label="Ecommerce" value="ecommerce" />
        <el-option label="Logistics" value="logistics" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="Status" clearable class="filter-select">
        <el-option label="All" value="" />
        <el-option label="Connected" value="connected" />
        <el-option label="Disabled" value="disabled" />
      </el-select>
      <div class="sort-section">
        <span>Created At</span>
        <el-icon class="sort-icon" @click="toggleSort"><Sort /></el-icon>
      </div>
    </div>

    <div class="integrations-list">
      <div v-for="item in filteredIntegrations" :key="item.id" class="integration-item" @click="handleViewDetails(item)">
        <div class="item-left">
          <div class="integration-logo">
            <img :src="item.logo" :alt="item.name" @error="handleImageError($event, item)">
            <span v-if="item.showNameFallback" class="name-fallback">
              {{ getNameInitials(item.name) }}
            </span>
          </div>
          <div class="integration-info">
            <div class="name-row">
              <span class="name">{{ item.name }}</span>
              <span class="type">{{ item.type }}</span>
            </div>
            <div class="sub-name">{{ getChannelName(item) }}</div>
          </div>
        </div>
        <div class="item-right">
          <div class="status-tag" :class="{ 'connected': item.status === 'connected' }">
            {{ item.status === 'connected' ? 'Connected' : 'Disabled' }}
          </div>
          <div class="actions" @click.stop>
            <el-switch
              v-model="item.enabled"
              :active-value="true"
              :inactive-value="false"
              @change="(val) => handleStatusChange(item, val)"
            />
            <el-dropdown trigger="click">
              <el-button link>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleDelete(item)">Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Integration Dialog -->
    <el-dialog
      v-model="addDialogVisible"
      title="Add Integration"
      width="80%"
      class="add-integration-dialog"
    >
      <div class="dialog-content">
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="Search integrations..."
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </div>
        <div class="integration-types">
          <div class="type-section" v-for="(group, type) in groupedIntegrations" :key="type">
            <h3>{{ type }}</h3>
            <div class="type-grid">
              <div
                v-for="integration in group"
                :key="integration.id"
                class="integration-option"
                @click="handleSelectIntegration(integration)"
              >
                <div class="integration-logo">
                  <img :src="integration.logo" :alt="integration.name" @error="handleImageError($event, integration)">
                  <span v-if="integration.showNameFallback" class="name-fallback">
                    {{ getNameInitials(integration.name) }}
                  </span>
                </div>
                <div class="integration-details">
                  <div class="name-row">
                    <h4>{{ integration.name }}</h4>
                    <span class="type">{{ integration.type }}</span>
                  </div>
                  <p>{{ integration.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { InfoFilled, MoreFilled, Sort } from '@element-plus/icons-vue'

const router = useRouter()
const filterType = ref('')
const filterStatus = ref('')
const sortDesc = ref(true)
const addDialogVisible = ref(false)
const searchQuery = ref('')

// Mock data for available integrations
const availableIntegrations = [
  {
    id: 'shopify',
    name: 'Shopify',
    type: 'Ecommerce',
    logo: '/icons/shopify.png',
    description: 'Sync Shopify orders, products, inventory, and fulfillments with OMS',
    showNameFallback: false
  },
  {
    id: 'amazon',
    name: 'Amazon MCF',
    type: 'Ecommerce',
    logo: '/icons/amazon.png',
    description: 'Sync shipping requests, products, inventory, transfer orders with OMS',
    showNameFallback: false
  },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    type: 'Ecommerce',
    logo: '/icons/bigcommerce.png',
    description: 'Sync BigCommerce orders, inventory, products, fulfillments',
    showNameFallback: false
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    type: 'Ecommerce',
    logo: '/icons/woocommerce.png',
    description: 'Sync WooCommerce orders, inventory, products',
    showNameFallback: false
  },
  {
    id: 'ebay',
    name: 'eBay',
    type: 'Ecommerce',
    logo: '/icons/ebay.png',
    description: 'Sync eBay orders, products, inventory, fulfillments',
    showNameFallback: false
  },
  {
    id: 'wayfair',
    name: 'Wayfair',
    type: 'Ecommerce',
    logo: '/icons/wayfair.png',
    description: 'Sync Wayfair orders, products, shipping requests, inventory',
    showNameFallback: false
  },
  {
    id: '3pl-central',
    name: 'Extensiv (3PL Central)',
    type: 'Logistics',
    logo: '/icons/3pl.png',
    description: 'Sync Extensiv products, inventory, shipping requests, fulfillments',
    showNameFallback: false
  },
  {
    id: 'shipstation',
    name: 'ShipStation',
    type: 'Logistics',
    logo: '/icons/shipstation.png',
    description: 'Sync orders and tracking information with ShipStation',
    showNameFallback: false
  }
]

// Mock data for connected integrations
const integrations = ref([
  {
    id: 1,
    name: 'AMAZ UPTIME Seller Central',
    type: 'Ecommerce',
    status: 'connected',
    enabled: true,
    logo: '/icons/amazon.png',
    showNameFallback: false
  },
  {
    id: 2,
    name: 'Shopify UPTIME - Consumer',
    type: 'Ecommerce',
    status: 'connected',
    enabled: true,
    logo: '/icons/shopify.png',
    showNameFallback: false
  },
  {
    id: 3,
    name: 'AMAZ RISE Seller Control',
    type: 'Ecommerce',
    status: 'connected',
    enabled: true,
    logo: '/icons/amazon.png',
    showNameFallback: false
  },
  {
    id: 4,
    name: 'Shopify UPTIME - Wholesale',
    type: 'Ecommerce',
    status: 'disabled',
    enabled: false,
    logo: '/icons/shopify.png',
    showNameFallback: false
  }
])

// Group integrations by type for the dialog
const groupedIntegrations = computed(() => {
  const groups: Record<string, typeof availableIntegrations> = {}
  
  availableIntegrations.forEach(integration => {
    if (!groups[integration.type]) {
      groups[integration.type] = []
    }
    if (searchQuery.value) {
      if (integration.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        groups[integration.type].push(integration)
      }
    } else {
      groups[integration.type].push(integration)
    }
  })

  return groups
})

// Filtered and sorted integrations list
const filteredIntegrations = computed(() => {
  let result = [...integrations.value]

  if (filterType.value) {
    result = result.filter(item => item.type.toLowerCase() === filterType.value.toLowerCase())
  }

  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }

  result.sort((a, b) => {
    return sortDesc.value ? b.id - a.id : a.id - b.id
  })

  return result
})

// Methods
const toggleSort = () => {
  sortDesc.value = !sortDesc.value
}

const handleSearch = () => {
  // Search is handled by computed property
}

const handleAddIntegration = () => {
  addDialogVisible.value = true
}

const handleAddCustomIntegration = () => {
  // Implement custom integration logic
}

const handleSelectIntegration = (integration: any) => {
  addDialogVisible.value = false
  // Implement integration setup logic
}

const handleStatusChange = async (integration: any, enabled: boolean) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to ${enabled ? 'enable' : 'disable'} this integration?`,
      'Confirmation',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }
    )
    integration.status = enabled ? 'connected' : 'disabled'
    ElMessage.success(`Integration ${enabled ? 'enabled' : 'disabled'} successfully`)
  } catch {
    integration.enabled = !enabled
  }
}

const handleViewDetails = (integration: any) => {
  router.push(`/integration/connections/${integration.id}`)
}

const handleDelete = async (integration: any) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this integration?',
      'Delete Integration',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    // Implement delete logic
    ElMessage.success('Integration deleted successfully')
  } catch {
    // User cancelled
  }
}

// 添加新的方法
const handleImageError = (event: Event, item: any) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  item.showNameFallback = true
}

const getNameInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getChannelName = (item: any) => {
  const parts = item.name.split(' - ')
  if (parts.length > 1) {
    return parts[1]
  }
  return parts[0]
}
</script>

<style lang="scss" scoped>
.integrations-page {
  padding: 24px;

  .page-header {
    background-color: var(--el-bg-color);
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-section {
      display: flex;
      align-items: center;
      gap: 8px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }

      .info-icon {
        color: #909399;
        cursor: pointer;
      }
    }

    .actions {
      display: flex;
      gap: 12px;
    }
  }

  .filter-bar {
    background-color: var(--el-bg-color);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 4px;

    .filter-select {
      width: 160px;
    }

    .sort-section {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      cursor: pointer;

      .sort-icon {
        font-size: 16px;
      }
    }
  }

  .integrations-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .integration-item {
      height: 72px; // 固定高度确保一致性
      padding: 16px 24px;
      background-color: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-lighter);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      .item-left {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 0; // 允许子元素收缩

        .integration-logo {
          position: relative;
          width: 40px;
          height: 40px;
          flex-shrink: 0; // 防止logo缩小

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .name-fallback {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--el-color-primary-light-8);
            color: var(--el-color-primary);
            font-weight: bold;
            font-size: 14px;
            border-radius: 4px;
          }
        }

        .integration-info {
          min-width: 0; // 允许文本收缩
          flex: 1;

          .name-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;

            .name {
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .type {
              font-size: 12px;
              color: var(--el-text-color-secondary);
              padding: 0 8px;
              background-color: var(--el-fill-color-light);
              border-radius: 4px;
              flex-shrink: 0; // 防止类型标签缩小
            }
          }

          .sub-name {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .item-right {
        display: flex;
        align-items: center;
        gap: 24px;
        flex-shrink: 0; // 防止右侧操作区域缩小

        .status-tag {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;
          background-color: var(--el-fill-color);
          color: var(--el-text-color-secondary);
          min-width: 70px; // 固定最小宽度
          text-align: center;

          &.connected {
            background-color: var(--el-color-success-light-9);
            color: var(--el-color-success);
          }
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
      }
    }
  }
}

.add-integration-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }

  .dialog-content {
    background-color: var(--el-bg-color);

    .search-section {
      padding: 16px;
      border-bottom: 1px solid #e4e7ed;

      .el-input {
        width: 300px;
      }
    }

    .integration-types {
      padding: 16px;
      max-height: 600px;
      overflow-y: auto;

      .type-section {
        margin-bottom: 24px;

        h3 {
          margin: 0 0 16px;
          font-size: 16px;
          color: #606266;
        }

        .type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;

          .integration-option {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 16px;
            background-color: var(--el-bg-color-overlay);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              background-color: var(--el-color-primary-light-9);
            }

            .integration-logo {
              position: relative;
              width: 40px;
              height: 40px;
              flex-shrink: 0;

              img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }

              .name-fallback {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--el-color-primary-light-8);
                color: var(--el-color-primary);
                font-weight: bold;
                font-size: 14px;
                border-radius: 4px;
              }
            }

            .integration-details {
              flex: 1;
              min-width: 0;

              .name-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;

                h4 {
                  margin: 0;
                  font-size: 14px;
                  font-weight: 500;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .type {
                  font-size: 12px;
                  color: var(--el-text-color-secondary);
                  padding: 0 8px;
                  background-color: var(--el-fill-color-light);
                  border-radius: 4px;
                  flex-shrink: 0;
                }
              }

              p {
                margin: 0;
                font-size: 12px;
                color: var(--el-text-color-secondary);
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }
}
</style> 