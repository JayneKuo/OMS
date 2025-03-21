<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-link @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          Back To Orders
        </el-link>
        <h1>Order No:{{ orderNo }}</h1>
      </div>
      <div class="header-actions">
        <el-dropdown @command="handleAction">
          <el-button type="primary">
            Actions
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 通用操作 -->
              <el-dropdown-item command="create">
                <el-icon><Plus /></el-icon>
                New Order
              </el-dropdown-item>
              <el-dropdown-item command="import">
                <el-icon><Upload /></el-icon>
                Import
              </el-dropdown-item>
              <el-dropdown-item command="rawData" :disabled="!orderData">
                <el-icon><Document /></el-icon>
                Raw Data
              </el-dropdown-item>

              <!-- 状态相关操作 -->
              <template v-if="orderData && STATUS_CONFIG[orderData.status].availableActions.length">
                <el-dropdown-item divided></el-dropdown-item>
                <template v-for="action in STATUS_CONFIG[orderData.status].availableActions" :key="action">
                  <el-dropdown-item :command="action">
                    {{ getActionLabel(action) }}
                  </el-dropdown-item>
                </template>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- Ship Order 按钮只在选中订单时显示 -->
        <el-button v-if="orderData" type="primary" class="ship-button">Ship Order</el-button>
      </div>
    </div>

    <!-- 订单信息卡片组 -->
    <div class="order-info-grid">
      <!-- 基本信息 -->
      <div class="info-card">
        <div class="card-header">
          <h3>Order Source</h3>
        </div>
        <div class="card-content">
          <div class="info-item">
            <label>Imported By</label>
            <span>{{ orderData?.importedBy }}</span>
          </div>
          <div class="info-item">
            <label>Fulfill By</label>
            <span>{{ orderData?.fulfillBy || '-' }}</span>
          </div>
          <div class="info-item">
            <label>Loaded Date</label>
            <span>{{ formatDateTime(orderData?.loadedDate) }}</span>
          </div>
          <div class="info-item">
            <label>Order Date</label>
            <span>{{ formatDateTime(orderData?.orderDate) }}</span>
          </div>
          <div class="info-item">
            <label>Original Shipping Code</label>
            <span>{{ orderData?.originalShippingCode || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 账单信息 -->
      <div class="info-card">
        <div class="card-header">
          <h3>Billing</h3>
        </div>
        <div class="card-content">
          <div class="info-item">
            <label>Name</label>
            <span>{{ orderData?.billing?.name }}</span>
          </div>
          <div class="info-item">
            <label>Phone</label>
            <span>{{ orderData?.billing?.phone }}</span>
          </div>
          <div class="info-item full">
            <label>Address</label>
            <span>{{ formatAddress(orderData?.billing?.address) }}</span>
          </div>
        </div>
      </div>

      <!-- 收货信息 -->
      <div class="info-card">
        <div class="card-header">
          <h3>Shipping</h3>
        </div>
        <div class="card-content">
          <div class="info-item">
            <label>Name</label>
            <span>{{ orderData?.shipping?.name }}</span>
          </div>
          <div class="info-item">
            <label>Phone</label>
            <span>{{ orderData?.shipping?.phone }}</span>
          </div>
          <div class="info-item full">
            <label>Address</label>
            <span>{{ formatAddress(orderData?.shipping?.address) }}</span>
          </div>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="info-card">
        <div class="card-header">
          <h3>Status</h3>
          <el-tag :type="getStatusType(orderData?.status)" class="status-tag">
            {{ orderData?.status }}
            <el-icon v-if="orderData?.status === OrderStatus.Imported"><Bell /></el-icon>
          </el-tag>
        </div>
        <div class="card-content">
          <div class="info-item">
            <label>Delivered to WMS</label>
            <span>{{ orderData?.deliveredToWMS || '-' }}</span>
          </div>
          <div class="info-item">
            <label>Ship Date</label>
            <span>{{ orderData?.shipDate ? formatDateTime(orderData.shipDate) : '-' }}</span>
          </div>
          <div class="info-item">
            <label>Tracking Number</label>
            <span>{{ orderData?.trackingNumber || '-' }}</span>
          </div>
          <div class="info-item">
            <label>Carrier</label>
            <span>{{ orderData?.carrier || '-' }}</span>
          </div>
          <div class="info-item">
            <label>Delivery Service</label>
            <span>{{ orderData?.deliveryService || '-' }}</span>
          </div>
          <div class="info-item">
            <label>Shipping Sent to Channel</label>
            <span>{{ orderData?.shippingSentToChannel || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容和时间线的布局 -->
    <div class="main-content-layout">
      <div class="main-content">
        <!-- 使用 Tab 展示主要内容 -->
        <div class="content-tabs">
          <el-tabs v-model="activeTab" type="border-card">
            <!-- 订单明细 Tab -->
            <el-tab-pane label="Order Items" name="items">
              <el-table :data="orderData?.items || []" style="width: 100%">
                <el-table-column label="Product" prop="sku" min-width="200">
                  <template #default="{ row }">
                    <div class="product-cell">
                      <span class="sku-name">{{ row.sku }}</span>
                      <span class="uom">UOM: {{ row.uom }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Qty" prop="quantity" width="100" />
                <el-table-column label="Unit Price" width="120">
                  <template #default="{ row }">
                    ${{ row.unitPrice.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column label="Total" width="120">
                  <template #default="{ row }">
                    ${{ row.total.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column label="Notes" prop="notes" min-width="200" />
              </el-table>
            </el-tab-pane>

            <!-- 发货明细 Tab -->
            <el-tab-pane label="Dispatched Details" name="dispatched">
              <el-table :data="orderData?.dispatchedDetails || []" style="width: 100%">
                <el-table-column label="Dispatched No" min-width="150">
                  <template #default="{ row }">
                    {{ orderNo }}{{ row.subOrderNo }}
                  </template>
                </el-table-column>
                <el-table-column label="Product" prop="product" min-width="150" />
                <el-table-column label="SKU Name" prop="skuName" min-width="150" />
                <el-table-column label="Qty" prop="quantity" width="80" align="right" />
                <el-table-column label="Warehouse" prop="warehouse" min-width="150" />
                <el-table-column label="Status" width="120">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 包裹信息 Tab -->
            <el-tab-pane label="Packages" name="packages">
              <el-table :data="orderData?.packages || []" style="width: 100%">
                <el-table-column label="Package No" prop="packageNo" min-width="150" />
                <el-table-column label="Tracking No" prop="trackingNo" min-width="150" />
                <el-table-column label="Carrier" prop="carrier" min-width="120" />
                <el-table-column label="Service" prop="service" min-width="120" />
                <el-table-column label="Weight & Dimensions" min-width="200">
                  <template #default="{ row }">
                    {{ row.weight }} {{ row.weightUnit }} / 
                    {{ row.length }}x{{ row.width }}x{{ row.height }} {{ row.dimensionUnit }}
                  </template>
                </el-table-column>
                <el-table-column label="Status" width="120">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="Actions" width="100">
                  <template #default="{ row }">
                    <el-button link type="primary" @click="viewPackageDetails(row)">View</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 备注 -->
        <div class="notes-section">
          <div class="section-header">
            <h3>Notes</h3>
            <el-button type="primary" @click="handleSaveNotes" plain>Save</el-button>
          </div>
          <el-input
            v-model="notes"
            type="textarea"
            :rows="4"
            placeholder="Enter notes here..."
          />
        </div>
      </div>

      <!-- 时间线 -->
      <div class="timeline-container">
        <order-timeline />
      </div>
    </div>

    <!-- 操作弹窗 -->
    <action-dialogs
      ref="actionDialogsRef"
      @allocate="handleAllocate"
      @hold="handleHold"
      @cancel="handleCancel"
      @deallocate="handleDeallocate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Bell, Plus, Upload, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { OrderStatus, OrderAction, STATUS_CONFIG } from './types'
import ActionDialogs from './components/ActionDialogs.vue'
import OrderTimeline from './components/OrderTimeline.vue'

const route = useRoute()
const router = useRouter()
const orderNo = route.params.id as string
const orderData = ref<any>(null)
const notes = ref('')
const actionDialogsRef = ref()
const activeTab = ref('items')

// 模拟订单数据
onMounted(() => {
  // 这里模拟加载订单数据
  orderData.value = {
    orderNo: 'SO00185959',
    status: OrderStatus.Imported,
    importedBy: 'imported$0$_order_header_pk (abc38)',
    loadedDate: '2024-03-20 12:17:08 PM',
    orderDate: '2024-03-20 12:17:08 PM',
    billing: {
      name: 'Bagwell Diane',
      phone: '133333',
      address: {
        line1: 'Carson1',
        city: 'Carson',
        state: 'CA',
        zip: '91744',
        country: 'United States'
      }
    },
    shipping: {
      name: 'Bagwell Diane',
      phone: '133333',
      address: {
        line1: 'W180 N8000 Town Hall Road1',
        city: 'Menomonee Falls',
        state: 'WI',
        zip: '53051',
        country: 'US'
      }
    },
    items: [
      {
        sku: 'DDD',
        uom: 'EA',
        quantity: 3, // 总数量为3，被拆分为两个子单
        unitPrice: 2.10,
        snProduct: 'NO',
        price: 2.10,
        discount: 1.00,
        total: 1.10,
        notes: ''
      }
    ],
    dispatchedDetails: [
      {
        subOrderNo: '-1',
        product: 'DDD',
        skuName: 'Test Product 1',
        quantity: 1,
        uom: 'EA',
        lotNo: 'LOT001',
        snProduct: 'NO',
        warehouse: 'Warehouse A',
        status: OrderStatus.Allocated
      },
      {
        subOrderNo: '-2',
        product: 'DDD',
        skuName: 'Test Product 1',
        quantity: 2,
        uom: 'EA',
        lotNo: 'LOT002',
        snProduct: 'NO',
        warehouse: 'Warehouse B',
        status: OrderStatus.Allocated
      }
    ],
    packages: [
      {
        packageNo: 'PKG001',
        trackingNo: 'TRK123456789',
        carrier: 'FedEx',
        service: 'Express',
        weight: 2.5,
        weightUnit: 'KG',
        length: 30,
        width: 20,
        height: 15,
        dimensionUnit: 'CM',
        status: OrderStatus.Shipped
      },
      {
        packageNo: 'PKG002',
        trackingNo: 'TRK987654321',
        carrier: 'DHL',
        service: 'Standard',
        weight: 1.8,
        weightUnit: 'KG',
        length: 25,
        width: 18,
        height: 12,
        dimensionUnit: 'CM',
        status: OrderStatus.Shipped
      }
    ],
    financial: {
      subTotal: 1.10,
      discount: 2.00,
      salesTax: 1.00,
      shippingHandling: 2.00,
      grandTotal: 4.10
    },
    extraFields: {
      channelSalesOrderNo: '38',
      purchaseOrderId: 'abc38',
      referenceNo: 'abc38'
    }
  }
})

// 格式化日期时间
const formatDateTime = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
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

// 格式化地址
const formatAddress = (address: any) => {
  if (!address) return '-'
  return [
    address.line1,
    address.city,
    address.state,
    address.zip,
    address.country
  ].filter(Boolean).join(', ')
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    [OrderStatus.Imported]: 'info',
    [OrderStatus.Pending]: 'warning',
    [OrderStatus.Allocated]: 'success',
    [OrderStatus.Exception]: 'danger',
    [OrderStatus.Deallocated]: 'info',
    [OrderStatus.Cancelling]: 'warning',
    [OrderStatus.Cancelled]: 'danger',
    [OrderStatus.WarehouseProcessing]: 'primary',
    [OrderStatus.Shipped]: 'success',
    [OrderStatus.Completed]: 'success'
  }
  return types[status] || 'info'
}

// 获取操作标签
const getActionLabel = (action: OrderAction) => {
  const labels: Record<OrderAction, string> = {
    [OrderAction.Allocate]: 'Allocate',
    [OrderAction.Pend]: 'Hold',
    [OrderAction.Cancel]: 'Cancel',
    [OrderAction.Edit]: 'Edit',
    [OrderAction.Deallocate]: 'Deallocate',
    [OrderAction.Dispatch]: 'Dispatch'
  }
  return labels[action]
}

// 处理操作
const handleAction = (action: OrderAction | string) => {
  switch (action) {
    // 通用操作
    case 'create':
      handleCreate()
      break
    case 'import':
      handleImport()
      break
    case 'rawData':
      handleViewRawData()
      break
    // 状态相关操作
    case OrderAction.Allocate:
    case OrderAction.Dispatch:
      actionDialogsRef.value.openAllocateDialog()
      break
    case OrderAction.Pend:
      actionDialogsRef.value.openHoldDialog()
      break
    case OrderAction.Cancel:
      actionDialogsRef.value.openCancelDialog()
      break
    case OrderAction.Deallocate:
      actionDialogsRef.value.openDeallocateDialog()
      break
    case OrderAction.Edit:
      handleEdit()
      break
  }
}

// 处理分仓
const handleAllocate = async (formData: any) => {
  try {
    // TODO: 调用分仓API
    ElMessage.success('Order allocated successfully')
    orderData.value.status = OrderStatus.Allocated
  } catch (error) {
    ElMessage.error('Failed to allocate order')
  }
}

// 处理挂起
const handleHold = async (formData: any) => {
  try {
    // TODO: 调用挂起API
    ElMessage.success('Order held successfully')
    orderData.value.status = OrderStatus.Pending
  } catch (error) {
    ElMessage.error('Failed to hold order')
  }
}

// 处理取消
const handleCancel = async (formData: any) => {
  try {
    // TODO: 调用取消API
    ElMessage.success('Order cancelled successfully')
    if (orderData.value.status === OrderStatus.Allocated) {
      orderData.value.status = OrderStatus.Cancelling
    } else {
      orderData.value.status = OrderStatus.Cancelled
    }
  } catch (error) {
    ElMessage.error('Failed to cancel order')
  }
}

// 处理解除分仓
const handleDeallocate = async () => {
  try {
    // TODO: 调用解除分仓API
    ElMessage.success('Order deallocated successfully')
    if (orderData.value.status === OrderStatus.WarehouseProcessing) {
      orderData.value.status = OrderStatus.Exception
    } else {
      orderData.value.status = OrderStatus.Deallocated
    }
  } catch (error) {
    ElMessage.error('Failed to deallocate order')
  }
}

// 处理编辑
const handleEdit = () => {
  // TODO: 实现编辑功能
  console.log('Edit order')
}

// 保存备注
const handleSaveNotes = () => {
  // TODO: 保存备注
  ElMessage.success('Notes saved successfully')
}

// 添加查看包裹详情的方法
const viewPackageDetails = (packageData: any) => {
  // TODO: 实现查看包裹详情的逻辑
  console.log('View package details:', packageData)
}

// 处理新建订单
const handleCreate = () => {
  router.push('/order/sales/create')
}

// 处理导入订单
const handleImport = () => {
  // TODO: 打开导入对话框
  console.log('Import order')
}

// 处理查看原始数据
const handleViewRawData = () => {
  // TODO: 打开原始数据对话框
  console.log('View raw data')
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  min-height: 100vh;
  background: var(--app-bg);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: var(--card-bg);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .el-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }

    h1 {
      font-size: 28px;
      font-weight: 600;
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;

    :deep(.el-dropdown-menu__item) {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;

      .el-icon {
        margin-right: 0;
      }

      &.is-disabled {
        opacity: 0.6;
      }
    }
  }
}

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;

  .card-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .status-tag {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .card-content {
    padding: 16px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      &.full {
        grid-column: 1 / -1;
      }

      label {
        color: var(--text-secondary);
        font-size: 12px;
      }

      span {
        color: var(--text-primary);
      }
    }
  }
}

.main-content-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 400px);
  gap: 24px;
  margin-bottom: 24px;
  position: relative;

  @media screen and (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr) 320px;
  }

  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
    
    .timeline-container {
      position: static;
      height: auto;
      max-height: none;
    }
  }

  .main-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  .timeline-container {
    position: sticky;
    top: 24px;
    height: calc(100vh - 48px);
    overflow-y: auto;
  }
}

.content-tabs {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);

  :deep(.el-tabs) {
    --el-tabs-header-height: 48px;

    .el-tabs__header {
      margin: 0;
      border-bottom: 1px solid var(--border-color);
      background: var(--component-bg);
    }

    .el-tabs__nav {
      border: none;
    }

    .el-tabs__item {
      height: var(--el-tabs-header-height);
      line-height: var(--el-tabs-header-height);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      border: none;
      padding: 0 24px;

      &.is-active {
        color: var(--el-color-primary);
        background: var(--card-bg);
      }

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .el-tabs__content {
      padding: 16px;
    }
  }
}

.el-table {
  background: transparent;
  
  &::before {
    display: none;
  }
}

// 优化表格样式
:deep(.el-table) {
  th {
    background: var(--component-bg) !important;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    
    .cell {
      font-weight: 600;
      color: var(--text-secondary);
    }
  }

  td {
    border-bottom: 1px solid var(--border-color);
  }

  tr:hover > td {
    background: var(--hover-bg) !important;
  }

  @media screen and (max-width: 768px) {
    .el-table__header-wrapper {
      overflow-x: auto;
    }

    .el-table__body-wrapper {
      overflow-x: auto;
    }
  }
}

.product-cell {
  display: flex;
  flex-direction: column;

  .sku-name {
    color: var(--text-primary);
  }

  .uom {
    color: var(--text-secondary);
    font-size: 12px;
  }
}

.notes-section {
  .el-input {
    margin: 16px;
    width: calc(100% - 32px);
  }
}

// 优化 Tab 在小屏幕上的显示
:deep(.el-tabs) {
  @media screen and (max-width: 768px) {
    .el-tabs__header {
      overflow-x: auto;
      white-space: nowrap;
    }
  }
}
</style> 