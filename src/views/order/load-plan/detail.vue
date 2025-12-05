<template>
  <div class="load-plan-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1>Load Plan Detail: {{ loadPlanData.planNo }}</h1>
        <el-tag :type="getStatusType(loadPlanData.status)" size="large">
          {{ LOAD_PLAN_STATUS_MAP[loadPlanData.status || '']?.label || loadPlanData.status || '-' }}
        </el-tag>
      </div>
      <div class="header-right">
        <el-button @click="handleEdit">Edit</el-button>
        <!-- PLANNING状态：标记为已规划、取消 -->
        <el-button type="primary" @click="handleMarkPlanned" :disabled="loadPlanData.status !== 'PLANNING'">
          Mark as Planned
        </el-button>
        <!-- PLANNED状态：确认、取消 -->
        <el-button type="primary" @click="handleConfirm" :disabled="loadPlanData.status !== 'PLANNED'">
          Confirm
        </el-button>
        <!-- CONFIRMED状态：生成Load、取消 -->
        <el-button 
          type="success" 
          @click="handleGenerateLoad" 
          :disabled="loadPlanData.status !== 'CONFIRMED' || !loadPlanData.orderLines || loadPlanData.orderLines.length === 0"
        >
          <el-icon><Plus /></el-icon>
          Generate Load
        </el-button>
        <!-- 所有状态（除了已取消）都可以取消 -->
        <el-button type="warning" @click="handleCancelPlan" :disabled="loadPlanData.status === 'CANCELLED'">
          Cancel Plan
        </el-button>
        <el-dropdown trigger="click" @command="handleMoreAction">
          <el-button>
            More <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- PLANNING状态：可编辑、标记为已规划、取消、删除、复制 -->
              <el-dropdown-item command="edit" :disabled="loadPlanData.status === 'PLANNED' || loadPlanData.status === 'CONFIRMED' || loadPlanData.status === 'CANCELLED'">Edit</el-dropdown-item>
              <el-dropdown-item command="markPlanned" :disabled="loadPlanData.status !== 'PLANNING'">Mark as Planned</el-dropdown-item>
              <!-- PLANNED状态：可编辑、确认、取消、复制 -->
              <el-dropdown-item command="confirm" :disabled="loadPlanData.status !== 'PLANNED'">Confirm</el-dropdown-item>
              <!-- CONFIRMED状态：生成Load、取消、复制 -->
              <el-dropdown-item command="generateLoad" :disabled="loadPlanData.status !== 'CONFIRMED' || !loadPlanData.orderLines || loadPlanData.orderLines.length === 0">Generate Load</el-dropdown-item>
              <!-- 所有状态都可以取消（除了已取消的） -->
              <el-dropdown-item command="cancel" :disabled="loadPlanData.status === 'CANCELLED'">Cancel Plan</el-dropdown-item>
              <!-- 所有状态都可以复制 -->
              <el-dropdown-item command="duplicate">Duplicate</el-dropdown-item>
              <el-dropdown-item command="export">Export</el-dropdown-item>
              <!-- 只有PLANNING和CANCELLED状态可以删除 -->
              <el-dropdown-item command="delete" divided :disabled="loadPlanData.status !== 'PLANNING' && loadPlanData.status !== 'CANCELLED'">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 基本信息卡片 -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Basic Information</span>
        </div>
      </template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="Plan NO">{{ loadPlanData.planNo }}</el-descriptions-item>
        <el-descriptions-item label="Plan Name">{{ loadPlanData.planName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Status">
          <el-tag :type="getStatusType(loadPlanData.status)">
            {{ LOAD_PLAN_STATUS_MAP[loadPlanData.status || '']?.label || loadPlanData.status || '-' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Customer">{{ loadPlanData.customer || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Carrier">{{ loadPlanData.carrier || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Mode">{{ loadPlanData.mode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Load Type">{{ loadPlanData.loadType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Freight Term">{{ loadPlanData.freightTerm || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Load Count">
          {{ loadPlanData.loadIds?.length || 0 }}
        </el-descriptions-item>
        <el-descriptions-item label="Planned Ship Date">
          {{ formatDate(loadPlanData.plannedShipDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="Planned Delivery Date">
          {{ formatDate(loadPlanData.plannedDeliveryDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="Actual Ship Date">
          {{ formatDate(loadPlanData.actualShipDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="Actual Delivery Date">
          {{ formatDate(loadPlanData.actualDeliveryDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="Estimated Freight Cost">
          <span v-if="loadPlanData.estimatedFreightCost">${{ loadPlanData.estimatedFreightCost.toFixed(2) }}</span>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="Planned Pallet Qty">{{ loadPlanData.plannedPalletQty || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Planned Weight (kg)">
          {{ loadPlanData.plannedWeight ? `${loadPlanData.plannedWeight.toFixed(2)} kg` : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="Planned Volume (m³)">
          {{ loadPlanData.plannedVolume ? `${loadPlanData.plannedVolume.toFixed(2)} m³` : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="Order Count">{{ loadPlanData.orderLines?.length || 0 }}</el-descriptions-item>
        <el-descriptions-item label="Load Count">{{ loadPlanData.loadIds?.length || 0 }}</el-descriptions-item>
        <el-descriptions-item label="Created By">{{ loadPlanData.createdBy || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Created At" :span="2">
          {{ formatDateTime(loadPlanData.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="Updated At">
          {{ formatDateTime(loadPlanData.updatedAt) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 地址信息 -->
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">Ship From</span>
            </div>
          </template>
          <div class="address-info">
            <p v-if="loadPlanData.shipFrom?.name"><strong>Name:</strong> {{ loadPlanData.shipFrom.name }}</p>
            <p v-if="loadPlanData.shipFrom?.company"><strong>Company:</strong> {{ loadPlanData.shipFrom.company }}</p>
            <p v-if="loadPlanData.shipFrom?.address1">{{ loadPlanData.shipFrom.address1 }}</p>
            <p v-if="loadPlanData.shipFrom?.address2">{{ loadPlanData.shipFrom.address2 }}</p>
            <p v-if="loadPlanData.shipFrom?.city">
              {{ loadPlanData.shipFrom.city }}, {{ loadPlanData.shipFrom.state }} {{ loadPlanData.shipFrom.zipCode }}
            </p>
            <p v-if="loadPlanData.shipFrom?.country">{{ loadPlanData.shipFrom.country }}</p>
            <p v-if="loadPlanData.shipFrom?.phone"><strong>Phone:</strong> {{ loadPlanData.shipFrom.phone }}</p>
            <p v-if="loadPlanData.shipFrom?.email"><strong>Email:</strong> {{ loadPlanData.shipFrom.email }}</p>
            <p v-if="!hasAddress(loadPlanData.shipFrom)" class="empty-text">No address information</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">Ship To</span>
            </div>
          </template>
          <div class="address-info">
            <p v-if="loadPlanData.shipTo?.name"><strong>Name:</strong> {{ loadPlanData.shipTo.name }}</p>
            <p v-if="loadPlanData.shipTo?.company"><strong>Company:</strong> {{ loadPlanData.shipTo.company }}</p>
            <p v-if="loadPlanData.shipTo?.address1">{{ loadPlanData.shipTo.address1 }}</p>
            <p v-if="loadPlanData.shipTo?.address2">{{ loadPlanData.shipTo.address2 }}</p>
            <p v-if="loadPlanData.shipTo?.city">
              {{ loadPlanData.shipTo.city }}, {{ loadPlanData.shipTo.state }} {{ loadPlanData.shipTo.zipCode }}
            </p>
            <p v-if="loadPlanData.shipTo?.country">{{ loadPlanData.shipTo.country }}</p>
            <p v-if="loadPlanData.shipTo?.phone"><strong>Phone:</strong> {{ loadPlanData.shipTo.phone }}</p>
            <p v-if="loadPlanData.shipTo?.email"><strong>Email:</strong> {{ loadPlanData.shipTo.email }}</p>
            <p v-if="!hasAddress(loadPlanData.shipTo)" class="empty-text">No address information</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">Bill To</span>
            </div>
          </template>
          <div class="address-info">
            <p v-if="loadPlanData.billTo?.name"><strong>Name:</strong> {{ loadPlanData.billTo.name }}</p>
            <p v-if="loadPlanData.billTo?.company"><strong>Company:</strong> {{ loadPlanData.billTo.company }}</p>
            <p v-if="loadPlanData.billTo?.address1">{{ loadPlanData.billTo.address1 }}</p>
            <p v-if="loadPlanData.billTo?.address2">{{ loadPlanData.billTo.address2 }}</p>
            <p v-if="loadPlanData.billTo?.city">
              {{ loadPlanData.billTo.city }}, {{ loadPlanData.billTo.state }} {{ loadPlanData.billTo.zipCode }}
            </p>
            <p v-if="loadPlanData.billTo?.country">{{ loadPlanData.billTo.country }}</p>
            <p v-if="loadPlanData.billTo?.phone"><strong>Phone:</strong> {{ loadPlanData.billTo.phone }}</p>
            <p v-if="loadPlanData.billTo?.email"><strong>Email:</strong> {{ loadPlanData.billTo.email }}</p>
            <p v-if="!hasAddress(loadPlanData.billTo)" class="empty-text">No address information</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 关联的Load列表 -->
    <el-card v-if="loadPlanData.loadIds && loadPlanData.loadIds.length > 0" class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Related Loads</span>
        </div>
      </template>
      <div class="load-list">
        <el-tag
          v-for="loadId in loadPlanData.loadIds"
          :key="loadId"
          style="margin-right: 8px; margin-bottom: 8px;"
          @click="goToLoad(loadId)"
        >
          {{ loadId }}
        </el-tag>
      </div>
    </el-card>

    <!-- 订单列表 -->
    <el-card v-if="loadPlanData.orderLines && loadPlanData.orderLines.length > 0" class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Order Lines ({{ loadPlanData.orderLines.length }})</span>
        </div>
      </template>
      <el-table :data="loadPlanData.orderLines" border style="width: 100%">
        <el-table-column prop="orderNo" label="Order No" min-width="150" />
        <el-table-column prop="requestNo" label="Request No" min-width="150" />
        <el-table-column prop="dnNo" label="DN No" min-width="120" />
        <el-table-column prop="customer" label="Customer" min-width="120" />
        <el-table-column prop="shipTo" label="Ship To" min-width="200" />
        <el-table-column prop="totalQuantity" label="Quantity" min-width="100" align="right" />
        <el-table-column prop="deliveryRequestDate" label="Delivery Date" min-width="140" />
      </el-table>
    </el-card>

    <!-- 关联的Load列表 -->
    <el-card v-if="loadPlanData.loadIds && loadPlanData.loadIds.length > 0" class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Related Loads</span>
        </div>
      </template>
      <div class="load-list">
        <el-tag
          v-for="loadId in loadPlanData.loadIds"
          :key="loadId"
          style="margin-right: 8px; margin-bottom: 8px; cursor: pointer;"
          @click="goToLoad(loadId)"
        >
          {{ loadId }}
        </el-tag>
      </div>
    </el-card>

    <!-- 备注 -->
    <el-card v-if="loadPlanData.note" class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Note</span>
        </div>
      </template>
      <div class="note-content">
        {{ loadPlanData.note }}
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowDown, Plus } from '@element-plus/icons-vue'
import type { LoadPlan, Address } from './types'
import { LOAD_PLAN_STATUS_MAP } from './types'

const router = useRouter()
const route = useRoute()

const loadPlanData = ref<LoadPlan>({
  planNo: '',
  planName: '',
  status: 'PLANNING' as 'PLANNING' | 'PLANNED' | 'CONFIRMED' | 'CANCELLED',
  orderLines: []
})

// 加载数据
const loadData = async () => {
  const planId = route.params.id as string
  if (!planId) {
    ElMessage.error('Plan ID not found')
    router.push('/order/load-plan')
    return
  }

  try {
    // TODO: 调用API获取计划详情
    // const data = await getLoadPlan(planId)
    // loadPlanData.value = data
    
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    loadPlanData.value = {
      id: planId,
      planNo: `LP${planId}`,
      planName: `Load Plan ${planId}`,
      customer: 'Customer A',
      carrier: 'FedEx',
      mode: 'CENTRAL',
      loadType: 'FTL',
      freightTerm: 'PREPAID',
      status: 'CONFIRMED' as 'PLANNING' | 'PLANNED' | 'CONFIRMED' | 'CANCELLED',
      plannedShipDate: new Date().toISOString(),
      plannedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      estimatedFreightCost: 1500,
      plannedPalletQty: 20,
      plannedWeight: 5000,
      plannedVolume: 50,
      shipFrom: {
        city: 'New York',
        state: 'NY',
        address1: '123 Main St'
      },
      shipTo: {
        city: 'Los Angeles',
        state: 'CA',
        address1: '456 Oak Ave'
      },
      orderLines: [],
      loadIds: ['load-1', 'load-2'],
      executionStatus: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'User 1'
    }
  } catch (error) {
    console.error('Load plan data failed:', error)
    ElMessage.error('Failed to load plan data')
    router.push('/order/load-plan')
  }
}

// 返回
const goBack = () => {
  router.push('/order/load-plan')
}

// 编辑
const handleEdit = () => {
  router.push(`/order/load-plan/edit/${loadPlanData.value.id}`)
}

// 标记为已规划
const handleMarkPlanned = async () => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to mark plan ${loadPlanData.value.planNo} as planned?`,
      'Mark as Planned',
      {
        confirmButtonText: 'Mark as Planned',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    
    // 更新状态
    loadPlanData.value.status = 'PLANNED'
    loadPlanData.value.updatedAt = new Date().toISOString()
    
    // TODO: 调用API更新状态
    ElMessage.success('Plan marked as planned')
    loadData()
  } catch {
    // User cancelled
  }
}

// 确认计划
const handleConfirm = async () => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to confirm plan ${loadPlanData.value.planNo}? After confirmation, you can generate Load.`,
      'Confirm Plan',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    
    // 更新状态
    loadPlanData.value.status = 'CONFIRMED'
    loadPlanData.value.updatedAt = new Date().toISOString()
    
    // TODO: 调用API确认计划
    ElMessage.success('Plan confirmed successfully')
    loadData()
  } catch {
    // User cancelled
  }
}

// 生成 Load
const handleGenerateLoad = async () => {
  try {
    if (!loadPlanData.value.orderLines || loadPlanData.value.orderLines.length === 0) {
      ElMessage.warning('Please add orders to the plan first')
      return
    }

    await ElMessageBox.confirm(
      `Generate Load from plan ${loadPlanData.value.planNo}? This will create a new Load with the selected orders.`,
      'Generate Load',
      {
        confirmButtonText: 'Generate',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    )
    
    // 将 Plan 转换为 Load 并跳转到 Load 创建页面
    const loadData = convertPlanToLoad(loadPlanData.value)
    
    // 将数据存储到 sessionStorage，在 Load 创建页面使用
    sessionStorage.setItem('loadFromPlan', JSON.stringify({
      ...loadData,
      planId: loadPlanData.value.id,
      planNo: loadPlanData.value.planNo
    }))
    
    // 跳转到 Load 创建页面
    router.push('/order/load/create')
  } catch {
    // User cancelled
  }
}

// 将 Plan 转换为 Load 数据
const convertPlanToLoad = (plan: LoadPlan): any => {
  return {
    mode: plan.mode || 'CUSTOMER',
    customerId: plan.customerId,
    customer: plan.customer,
    carrierId: plan.carrierId,
    carrier: plan.carrier,
    freightTerm: plan.freightTerm,
    loadType: plan.loadType,
    desiredShipDate: plan.plannedShipDate,
    freightCost: plan.estimatedFreightCost,
    shipFrom: plan.shipFrom,
    shipTo: plan.shipTo,
    billTo: plan.billTo,
    note: plan.note ? `Generated from Load Plan: ${plan.planNo}\n${plan.note}` : `Generated from Load Plan: ${plan.planNo}`,
    orderLines: plan.orderLines || [],
    shippingRequestIds: plan.orderLines?.map(line => line.id).filter(Boolean) || []
  }
}


// 更多操作
const handleMoreAction = async (command: string) => {
  switch (command) {
    case 'duplicate':
      // TODO: 复制计划
      ElMessage.info('Duplicate feature coming soon')
      break
    case 'export':
      // TODO: 导出计划
      ElMessage.info('Export feature coming soon')
      break
    case 'cancel':
      handleCancelPlan()
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to delete plan ${loadPlanData.value.planNo}?`,
          'Confirm Delete',
          {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        
        // TODO: 调用API删除
        ElMessage.success('Plan deleted successfully')
        router.push('/order/load-plan')
      } catch {
        // User cancelled
      }
      break
  }
}

// 跳转到Load详情
const goToLoad = (loadId: string) => {
  router.push(`/order/load/${loadId}`)
}

// 工具函数
const getStatusType = (status?: string): any => {
  if (!status) return 'info'
  const colorMap: Record<string, any> = {
    'PLANNING': 'info',
    'PLANNED': 'primary',
    'CONFIRMED': 'success',
    'CANCELLED': 'danger'
  }
  return colorMap[status] || 'info'
}


const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const hasAddress = (address?: Address): boolean => {
  if (!address) return false
  return !!(address.address1 || address.city || address.state)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.load-plan-detail-page {
  padding: 24px;
  background-color: #1a1d21;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 24px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
    }
  }

  .header-right {
    display: flex;
    gap: 12px;
  }
}

.info-card {
  margin-bottom: 16px;
  background-color: #1e2227;
  border: 1px solid rgba(255, 255, 255, 0.05);

  :deep(.el-card__header) {
    background-color: #2d3139;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  :deep(.el-card__body) {
    background-color: #1e2227;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.address-info {
  p {
    margin: 8px 0;
    color: #8b949e;
    font-size: 14px;
    line-height: 1.6;

    strong {
      color: #fff;
      margin-right: 8px;
    }
  }

  .empty-text {
    color: #666;
    font-style: italic;
  }
}

.note-content {
  color: #8b949e;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.load-list {
  .el-tag {
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
  }
}

:deep(.el-descriptions) {
  .el-descriptions__label {
    color: #8b949e;
    font-weight: 500;
  }

  .el-descriptions__content {
    color: #fff;
  }
}
</style>

