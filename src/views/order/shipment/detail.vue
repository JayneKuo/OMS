<template>
  <div class="shipment-detail">
    <!-- 顶部导航栏 -->
    <div class="detail-header">
      <div class="header-main">
        <div class="left-section">
          <el-button link @click="$router.back()" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h2 class="shipment-id">#{{ shipmentData?.shipmentNo }}</h2>
          <el-tag 
            :type="getStatusTagType(shipmentData?.status)" 
            size="large" 
            effect="dark"
            class="status-tag"
          >
            {{ getStatusLabel(shipmentData?.status) }}
          </el-tag>
          <!-- 错误信息提示 -->
          <div v-if="hasTrackingIssue" class="error-tag">
            <el-icon><Warning class="error-icon" /></el-icon>
            <span class="error-text">IT异常追踪已关闭：SKU-002H-2对SKU-002BLY时，请检测异常</span>
            <el-button 
              type="danger" 
              link 
              class="view-detail"
              @click="showTrackingDetail"
            >
              查看详情
            </el-button>
          </div>
        </div>
        <div class="shipment-info">
          <div class="carrier-path">
            <el-icon><Van class="path-icon" /></el-icon>
            <span class="path-text">{{ getCarrierLabel(shipmentData?.carrier) }}</span>
            <span class="separator">→</span>
            <span class="destination">OMS</span>
          </div>
          <div class="create-time">
            <el-icon><Clock class="time-icon" /></el-icon>
            <span class="time-text">创建于 {{ formatDate(shipmentData?.createDate) }}</span>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <el-button class="action-btn">
          <el-icon><EditPen /></el-icon>
          编辑
        </el-button>
        <el-dropdown @command="handleAction">
          <el-button class="action-btn">
            Actions
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="print">
                <el-icon><Printer /></el-icon>
                Ship Order
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button 
          type="primary" 
          class="ship-button"
          :disabled="!canUpdateStatus"
          @click="handleUpdateDelivery"
        >
          <el-icon><Van /></el-icon>
          Ship Order
        </el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="detail-content">
      <!-- 左侧主要内容 -->
      <div class="main-section">
        <!-- 运输状态进度条 -->
        <div class="shipment-status-card">
          <div class="card-header">
            <h3>订单状态溯源</h3>
          </div>
          
          <!-- 进度步骤 -->
          <div class="progress-container">
            <div class="progress-step" :class="{ active: getProgressStep(shipmentData?.status) >= 0, completed: getProgressStep(shipmentData?.status) > 0 }">
              <div class="step-dot">
                <el-icon v-if="getProgressStep(shipmentData?.status) > 0"><Check /></el-icon>
              </div>
              <div class="step-content">
                <div class="step-title">已创建</div>
                <div class="step-time">03/16<br/>09:00</div>
              </div>
            </div>

            <div class="progress-line" :class="{ completed: getProgressStep(shipmentData?.status) > 0 }"></div>

            <div class="progress-step" :class="{ active: getProgressStep(shipmentData?.status) >= 1, completed: getProgressStep(shipmentData?.status) > 1 }">
              <div class="step-dot">
                <el-icon v-if="getProgressStep(shipmentData?.status) > 1"><Check /></el-icon>
              </div>
              <div class="step-content">
                <div class="step-title">已配</div>
                <div class="step-time">03/16<br/>09:30</div>
              </div>
            </div>

            <div class="progress-line" :class="{ completed: getProgressStep(shipmentData?.status) > 1 }"></div>

            <div class="progress-step" :class="{ active: getProgressStep(shipmentData?.status) >= 2, completed: getProgressStep(shipmentData?.status) > 2 }">
              <div class="step-dot">
                <el-icon v-if="getProgressStep(shipmentData?.status) > 2"><Check /></el-icon>
              </div>
              <div class="step-content">
                <div class="step-title">合装排中</div>
                <div class="step-time">03/16 10:00</div>
              </div>
            </div>

            <div class="progress-line" :class="{ completed: getProgressStep(shipmentData?.status) > 2 }"></div>

            <div class="progress-step" :class="{ active: getProgressStep(shipmentData?.status) >= 3, completed: getProgressStep(shipmentData?.status) > 3 }">
              <div class="step-dot">
                <el-icon v-if="getProgressStep(shipmentData?.status) > 3"><Check /></el-icon>
              </div>
              <div class="step-content">
                <div class="step-title">已装袋</div>
                <div class="step-time">03/16<br/>11:00</div>
              </div>
            </div>

            <div class="progress-line" :class="{ completed: getProgressStep(shipmentData?.status) > 3 }"></div>

            <div class="progress-step" :class="{ active: getProgressStep(shipmentData?.status) >= 4, completed: getProgressStep(shipmentData?.status) > 4 }">
              <div class="step-dot">
                <el-icon v-if="getProgressStep(shipmentData?.status) > 4"><Check /></el-icon>
              </div>
              <div class="step-content">
                <div class="step-title">运输中</div>
                <div class="step-time">03/16<br/>12:00</div>
              </div>
            </div>

            <div class="progress-line" :class="{ completed: getProgressStep(shipmentData?.status) > 4 }"></div>

            <div class="progress-step" :class="{ active: getProgressStep(shipmentData?.status) >= 5, completed: getProgressStep(shipmentData?.status) > 5 }">
              <div class="step-dot">
                <el-icon v-if="getProgressStep(shipmentData?.status) > 5"><Check /></el-icon>
              </div>
              <div class="step-content">
                <div class="step-title">已达到</div>
                <div class="step-time">03/16<br/>13:00</div>
              </div>
            </div>

            <div class="progress-line" :class="{ completed: getProgressStep(shipmentData?.status) > 5 }"></div>

            <div class="progress-step" :class="{ active: getProgressStep(shipmentData?.status) >= 6 }">
              <div class="step-dot">
                <el-icon v-if="getProgressStep(shipmentData?.status) > 6"><Check /></el-icon>
              </div>
              <div class="step-content">
                <div class="step-title">已完成</div>
                <div class="step-time">03/16<br/>14:00</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 运单详情Tab区域 -->
        <div class="shipment-details-card">
          <div class="card-header">
            <h3>订单详情</h3>
          </div>
          
          <el-tabs v-model="activeTab" class="detail-tabs">
            <!-- Items Tab -->
            <el-tab-pane label="Items" name="items">
              <div class="tab-content">
                <div class="items-header">
                  <span>SHIPMENT NO.</span>
                  <span>PALLET NO.</span>
                  <span>PACKAGE NO.</span>
                  <span>MASTER TRACKING NO.</span>
                  <span>TRACKING NO.</span>
                  <span>CARRIER</span>
                </div>
                <div class="items-list">
                  <div class="item-row">
                    <el-button link class="shipment-link">SHIP024021801</el-button>
                    <span>PLT-SH-001</span>
                    <span>PKG789-01</span>
                    <span>MCT523456790</span>
                    <el-button link class="tracking-link">ST7234567898</el-button>
                    <span>顺丰速运</span>
                  </div>
                  <div class="item-row">
                    <el-button link class="shipment-link">SHIP024021802</el-button>
                    <span>PLT-SH-001</span>
                    <span>PKG789-02</span>
                    <span>MCT523456790</span>
                    <el-button link class="tracking-link">ST7234567891</el-button>
                    <span>顺丰速运</span>
                  </div>
                  <div class="item-row">
                    <el-button link class="shipment-link">SHIP024021703</el-button>
                    <span>PLT-BJ-002</span>
                    <span>PKG456-01</span>
                    <span>MCT887654210</span>
                    <el-button link class="tracking-link">ZTO887654218</el-button>
                    <span>中通快递</span>
                  </div>
                  <div class="item-row">
                    <el-button link class="shipment-link">SHIP024021804</el-button>
                    <span>PLT-GZ-003</span>
                    <span>PKG321-01</span>
                    <span>MCT554433211</span>
                    <el-button link class="tracking-link">STO554433213</el-button>
                    <span>申通快递</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- Dispatched Details Tab -->
            <el-tab-pane label="Dispatched Details" name="dispatched">
              <div class="tab-content">
                <div class="dispatched-content">
                  <p>调度详情内容...</p>
                </div>
              </div>
            </el-tab-pane>

            <!-- Packages Tab -->
            <el-tab-pane label="Packages" name="packages">
              <div class="tab-content">
                <div class="packages-content">
                  <p>包裹详情内容...</p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 订单动态 -->
        <div class="order-activity-card">
          <div class="card-header">
            <h3>订单动态</h3>
            <el-button class="activity-btn">查看完整动态</el-button>
          </div>
          
          <div class="activity-filters">
            <el-button class="filter-btn active">
              <span class="activity-dot warning"></span>
              全部 <span class="count">08</span>
            </el-button>
            <el-button class="filter-btn">
              <span class="activity-dot primary"></span>
              Dispatch <span class="count">01</span>
            </el-button>
            <el-button class="filter-btn">
              <span class="activity-dot success"></span>
              Update <span class="count">01</span>
            </el-button>
            <el-button class="filter-btn">
              <span class="activity-dot info"></span>
              WMS <span class="count">01</span>
            </el-button>
            <el-button class="filter-btn">
              <span class="activity-dot purple"></span>
              物流 <span class="count">01</span>
            </el-button>
            <el-button class="filter-btn">
              <span class="activity-dot danger"></span>
              数存 <span class="count">01</span>
            </el-button>
          </div>

          <div class="activity-meta">
            <span>Today</span>
            <span>Internal Notes</span>
            <span>Import Upload</span>
            <span>Manual Operation Review</span>
          </div>
        </div>
      </div>

      <!-- 右侧信息栏 -->
      <div class="side-section">
        <!-- 基础信息标签页 -->
        <div class="info-tabs-card">
          <el-tabs type="border-card" class="info-tabs">
            <el-tab-pane label="基础信息" name="basic">
              <div class="tab-content">
                <!-- 客户信息 -->
                <div class="info-section">
                  <div class="section-title">
                    <h4>客户信息</h4>
                  </div>
                  <div class="customer-info">
                    <div class="customer-name">{{ shipmentData?.recipient?.name || 'Dunder Mifflin LTD.' }}</div>
                    <div class="customer-phone">{{ shipmentData?.recipient?.phone || '(724) 254-848-3434' }}</div>
                    <div class="customer-address">
                      <div v-html="shipmentData?.recipient?.address || '1226 University Drive<br/>Burr Ridge 3507 Vine Street<br/>Chicago, Illinois<br/>United States 60527'"></div>
                    </div>
                  </div>
                </div>

                <!-- 收货地址 -->
                <div class="info-section">
                  <div class="section-title">
                    <h4>收货地址</h4>
                  </div>
                  <div class="address-info">
                    <div class="company-name">{{ shipmentData?.recipient?.name || 'Dunder Mifflin LTD.' }}</div>
                    <div class="company-phone">{{ shipmentData?.recipient?.phone || '(724) 254-848-3434' }}</div>
                    <div class="company-address">
                      <div v-html="shipmentData?.recipient?.address || '1226 University Drive<br/>Burr Ridge 3507 Vine Street<br/>Chicago, Illinois<br/>United States 60527'"></div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="物流信息" name="logistics">
              <div class="tab-content">
                <!-- 物流详情 -->
                <div class="info-section">
                  <div class="section-title">
                    <h4>物流详情</h4>
                  </div>
                  <div class="logistics-info">
                    <div class="info-list">
                      <div class="info-item">
                        <span class="label">承运商</span>
                        <span class="value">{{ getCarrierLabel(shipmentData?.carrier) }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">物流单号</span>
                        <el-button link class="tracking-link">
                          {{ shipmentData?.truckingNo }}
                        </el-button>
                      </div>
                      <div class="info-item">
                        <span class="label">发货日期</span>
                        <span class="value">{{ formatDate(shipmentData?.shipDate) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="支付详情" name="payment">
              <div class="tab-content">
                <!-- 支付信息 -->
                <div class="info-section">
                  <div class="section-title">
                    <h4>支付信息</h4>
                  </div>
                  <div class="payment-info">
                    <div class="platform-info">
                      <div class="platform-name">Shopify</div>
                      <div class="platform-details">
                        <div class="order-info">
                          <span class="label">我的中转联络</span>
                          <span class="value">Amazon → Shopify → OMS</span>
                        </div>
                        <div class="order-info">
                          <span class="label">我的订单号</span>
                          <span class="value">CSO-2024-001</span>
                        </div>
                        <div class="order-info">
                          <span class="label">渠道平台</span>
                          <span class="value">Amazon</span>
                        </div>
                        <div class="order-info">
                          <span class="label">渠道平台订单号</span>
                          <span class="value">AMZ-2024-001</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="UI动态日">
              <div class="tab-content">
                <div class="ui-logs">
                  <p>UI动态日志内容...</p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Van, 
  Clock, 
  Check, 
  Refresh, 
  ArrowDown, 
  Printer, 
  Download, 
  CopyDocument, 
  Phone,
  Warning,
  EditPen,
  Document
} from '@element-plus/icons-vue'
import { 
  ShipmentItem, 
  ShipmentStatus,
  SHIPMENT_STATUS_CONFIG,
  CARRIER_OPTIONS
} from './types'
import { mockShipmentData } from '../../../data/mockShipmentData'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const activeTab = ref('items')
const shipmentData = ref<ShipmentItem | null>(null)

// 计算属性
const shipmentNo = computed(() => route.params.shipmentNo as string)

// 检查是否有追踪问题
const hasTrackingIssue = computed(() => {
  if (!shipmentData.value) return false
  // 如果运单创建超过24小时但状态仍为新建，或者在运输中超过7天无更新
  const createDate = new Date(shipmentData.value.createDate)
  const now = new Date()
  const hoursDiff = (now.getTime() - createDate.getTime()) / (1000 * 60 * 60)
  
  if (shipmentData.value.status === ShipmentStatus.New && hoursDiff > 24) {
    return true
  }
  
  if (shipmentData.value.status === ShipmentStatus.InTransit && hoursDiff > 168) { // 7天
    return true
  }
  
  return false
})

// 检查是否可以更新状态
const canUpdateStatus = computed(() => {
  if (!shipmentData.value) return false
  return shipmentData.value.status !== ShipmentStatus.Delivered && 
         shipmentData.value.status !== ShipmentStatus.Closed
})

// 生命周期
onMounted(() => {
  loadShipmentDetail()
})

// 方法
const loadShipmentDetail = () => {
  // 这里应该调用API获取运单详情，暂时使用模拟数据
  const foundShipment = mockShipmentData.find(item => item.shipmentNo === shipmentNo.value)
  if (foundShipment) {
    shipmentData.value = foundShipment
  } else {
    ElMessage.error('运单不存在')
    router.back()
  }
}

const getStatusTagType = (status?: ShipmentStatus) => {
  if (!status) return ''
  
  const typeMap: Record<ShipmentStatus, string> = {
    [ShipmentStatus.New]: '',
    [ShipmentStatus.InTransit]: 'warning', 
    [ShipmentStatus.Delivered]: 'success',
    [ShipmentStatus.Closed]: 'info'
  }
  return typeMap[status] || ''
}

const getStatusLabel = (status?: ShipmentStatus) => {
  if (!status) return ''
  return SHIPMENT_STATUS_CONFIG[status]?.label || status
}

const getCarrierLabel = (carrier?: string) => {
  if (!carrier) return ''
  const option = CARRIER_OPTIONS.find(item => item.value === carrier)
  return option?.label || carrier
}

const getCarrierContact = (carrier?: string) => {
  if (!carrier) return ''
  const contactMap: Record<string, string> = {
    'fedex': '400-886-1888',
    'ups': '400-820-8388',
    'dhl': '400-810-8000',
    'usps': '400-123-4567',
    'other': '客服电话请联系承运商'
  }
  return contactMap[carrier] || '客服电话请联系承运商'
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

const getProgressStep = (status?: ShipmentStatus) => {
  if (!status) return 0
  const stepMap: Record<ShipmentStatus, number> = {
    [ShipmentStatus.New]: 1,
    [ShipmentStatus.InTransit]: 4,
    [ShipmentStatus.Delivered]: 6,
    [ShipmentStatus.Closed]: 7
  }
  return stepMap[status] || 0
}

// 将时间线按日期分组
const getGroupedTimeline = () => {
  if (!shipmentData.value?.timeline) return []
  
  const grouped = shipmentData.value.timeline.reduce((acc: any, event: any) => {
    const date = new Date(event.timestamp).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {})
  
  // 转换为数组并按日期倒序排列
  return Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map(date => ({
      date,
      events: grouped[date].sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    }))
}

// 格式化日期头部
const formatDateHeader = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    return `${weekdays[date.getDay()]}, ${months[date.getMonth()]}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`
  }
}

// 格式化时间
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes} ${ampm}`
}

// 判断是否为最新事件
const isLatestEvent = (event: any) => {
  if (!shipmentData.value?.timeline) return false
  const sortedEvents = [...shipmentData.value.timeline].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  return event.id === sortedEvents[0]?.id
}

// 获取追踪描述
const getTrackingDescription = (event: any) => {
  const statusDescriptions: Record<string, string> = {
    [ShipmentStatus.New]: '已创建运单',
    [ShipmentStatus.InTransit]: event.description.includes('发出') ? '已离开始发地' : 
                               event.description.includes('到达') ? '已到达中转站' : '运输中',
    [ShipmentStatus.Delivered]: '已签收',
    [ShipmentStatus.Closed]: '订单完成'
  }
  
  if (event.status === ShipmentStatus.Delivered) {
    return '已签收'
  }
  
  return event.description || statusDescriptions[event.status] || '状态更新'
}

// 事件处理
const showTrackingDetail = () => {
  ElMessage.info('显示追踪异常详情')
}

const handleEditShipment = () => {
  ElMessage.info('编辑运单功能开发中')
}

const handleAction = (command: string) => {
  switch (command) {
    case 'rawData':
      ElMessage.info('显示原始数据')
      break
    case 'print':
      ElMessage.info('打印功能开发中')
      break
    case 'export':
      ElMessage.info('导出功能开发中')
      break
    case 'refresh':
      ElMessage.success('追踪信息已刷新')
      loadShipmentDetail()
      break
    case 'contact':
      handleContactCarrier()
      break
  }
}

const handleUpdateDelivery = () => {
  ElMessage.info('更新运单状态功能开发中')
}

const handleContactCarrier = () => {
  if (shipmentData.value) {
    const phone = getCarrierContact(shipmentData.value.carrier)
    ElMessage.info(`承运商客服电话：${phone}`)
  }
}

const handleContactRecipient = () => {
  if (shipmentData.value) {
    ElMessage.info(`收件人电话：${shipmentData.value.recipient.phone}`)
  }
}

const handleTrackingLink = () => {
  ElMessage.info('跳转到承运商官方追踪页面')
}

const handleViewSalesOrder = () => {
  if (shipmentData.value) {
    router.push(`/order/sales/${shipmentData.value.salesOrderNo}`)
  }
}
</script>

<style scoped>
.shipment-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%);
  color: #e2e8f0;
}

/* 顶部导航栏样式 */
.detail-header {
  background: rgba(26, 29, 41, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  color: #cbd5e0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.shipment-id {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #f7fafc;
}

.status-tag {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
}

.shipment-info {
  display: flex;
  gap: 24px;
  align-items: center;
}

.carrier-path {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a0aec0;
  font-size: 14px;
}

.path-icon {
  color: #4299e1;
}

.separator {
  color: #718096;
  margin: 0 4px;
}

.destination {
  color: #e2e8f0;
  font-weight: 500;
}

.create-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a0aec0;
  font-size: 14px;
}

.time-icon {
  color: #9f7aea;
}

.error-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(254, 178, 178, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 8px;
  color: #fed7d7;
  font-size: 13px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  border-radius: 8px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.ship-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  border-radius: 8px;
  font-weight: 600;
}

.ship-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 主要内容区域样式 */
.detail-content {
  display: flex;
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.main-section {
  flex: 1;
  min-width: 0;
}

.side-section {
  width: 380px;
  flex-shrink: 0;
}

/* 卡片通用样式 */
.shipment-status-card,
.shipment-details-card,
.order-activity-card,
.info-tabs-card {
  background: rgba(26, 29, 41, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #f7fafc;
}

/* 进度条样式 */
.progress-container {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  padding: 30px 0;
  overflow-x: auto;
  gap: 0;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  min-width: 100px;
  flex-shrink: 0;
}

.step-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(75, 85, 99, 0.8);
  border: 3px solid rgba(156, 163, 175, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  font-size: 16px;
}

.progress-step.active .step-dot {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-color: #3b82f6;
  color: white;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
}

.progress-step.completed .step-dot {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  color: white;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

.step-content {
  text-align: center;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 6px;
  white-space: nowrap;
}

.progress-step.active .step-title {
  color: #3b82f6;
}

.progress-step.completed .step-title {
  color: #10b981;
}

.step-time {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.4;
  white-space: pre-line;
}

.progress-line {
  width: 80px;
  height: 3px;
  background: rgba(75, 85, 99, 0.3);
  margin-top: 20px;
  border-radius: 2px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.progress-line.completed {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

/* Tab样式 */
.detail-tabs {
  --el-tabs-header-color: #a0aec0;
}

.detail-tabs :deep(.el-tabs__header) {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-tabs :deep(.el-tabs__nav-wrap) {
  background: transparent;
}

.detail-tabs :deep(.el-tabs__item) {
  color: #a0aec0;
  border: none;
  background: transparent;
}

.detail-tabs :deep(.el-tabs__item.is-active) {
  color: #4299e1;
  background: transparent;
}

.detail-tabs :deep(.el-tabs__active-bar) {
  background: #4299e1;
}

.tab-content {
  padding: 20px 0;
}

/* Items列表样式 */
.items-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.2fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.2fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 14px;
}

.shipment-link,
.tracking-link {
  color: #4299e1;
  font-weight: 500;
  text-decoration: none;
}

.shipment-link:hover,
.tracking-link:hover {
  color: #63b3ed;
}

/* 订单动态样式 */
.activity-btn {
  background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 12px;
  padding: 6px 12px;
}

.activity-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a0aec0;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
}

.filter-btn.active {
  background: rgba(255, 159, 67, 0.2);
  border-color: #ff9f43;
  color: #ff9f43;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.activity-dot.warning {
  background: #ff9f43;
}

.activity-dot.primary {
  background: #4299e1;
}

.activity-dot.success {
  background: #48bb78;
}

.activity-dot.info {
  background: #38b2ac;
}

.activity-dot.purple {
  background: #9f7aea;
}

.activity-dot.danger {
  background: #f56565;
}

.count {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  margin-left: 4px;
}

.activity-meta {
  display: flex;
  gap: 16px;
  color: #718096;
  font-size: 12px;
}

/* 右侧信息卡片样式 */
.info-tabs {
  background: transparent;
  border: none;
}

.info-tabs :deep(.el-tabs__header) {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0;
}

.info-tabs :deep(.el-tabs__item) {
  color: #a0aec0;
  border: none;
  background: transparent;
  font-size: 13px;
}

.info-tabs :deep(.el-tabs__item.is-active) {
  color: #4299e1;
}

.info-tabs :deep(.el-tabs__active-bar) {
  background: #4299e1;
}

.info-section {
  padding: 20px 0;
}

.info-section:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  margin-bottom: 16px;
}

.section-title h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #f7fafc;
}

.customer-info,
.address-info {
  color: #e2e8f0;
}

.customer-name,
.company-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #f7fafc;
}

.customer-phone,
.company-phone {
  font-size: 14px;
  color: #4299e1;
  margin-bottom: 12px;
}

.customer-address,
.company-address {
  font-size: 14px;
  line-height: 1.5;
  color: #a0aec0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item .label {
  font-size: 14px;
  color: #a0aec0;
}

.info-item .value {
  font-size: 14px;
  color: #e2e8f0;
  font-weight: 500;
}

.platform-info {
  text-align: right;
}

.platform-name {
  font-size: 14px;
  color: #4299e1;
  font-weight: 600;
  margin-bottom: 16px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-info .label {
  font-size: 13px;
  color: #a0aec0;
}

.order-info .value {
  font-size: 13px;
  color: #e2e8f0;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .detail-content {
    flex-direction: column;
  }
  
  .side-section {
    width: 100%;
  }
  
  .progress-container {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .progress-line {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-main {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .left-section {
    flex-wrap: wrap;
  }
  
  .header-actions {
    align-self: stretch;
    justify-content: flex-end;
  }
  
  .items-header,
  .item-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .activity-filters {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style> 