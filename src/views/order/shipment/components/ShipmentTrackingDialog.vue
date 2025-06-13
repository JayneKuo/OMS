<template>
  <el-dialog
    v-model="dialogVisible"
    title="物流追踪"
    width="700px"
    @close="handleClose"
  >
    <div v-if="shipment" class="tracking-container">
      <!-- 运单基本信息 -->
      <el-card class="tracking-card" shadow="never">
        <div class="tracking-header">
          <div class="tracking-info">
            <h3>{{ shipment.shipmentNo }}</h3>
            <p class="tracking-detail">
              <span>{{ getCarrierLabel(shipment.carrier) }}</span>
              <el-divider direction="vertical" />
              <span>{{ shipment.truckingNo }}</span>
              <el-divider direction="vertical" />
              <span>{{ shipment.recipient.name }}</span>
            </p>
          </div>
          <el-tag 
            :color="SHIPMENT_STATUS_CONFIG[shipment.status].color"
            effect="light"
            size="large"
          >
            {{ SHIPMENT_STATUS_CONFIG[shipment.status].label }}
          </el-tag>
        </div>

        <!-- 进度条 -->
        <div class="progress-section">
          <el-steps 
            :active="getProgressStep(shipment.status)" 
            align-center
            finish-status="success"
          >
            <el-step title="已创建" />
            <el-step title="运输中" />
            <el-step title="已签收" />
            <el-step title="已完成" />
          </el-steps>
        </div>

        <!-- 预计送达时间 -->
        <div v-if="shipment.estimatedDelivery" class="delivery-info">
          <el-icon class="delivery-icon"><Clock /></el-icon>
          <span>预计送达：{{ formatDateTime(shipment.estimatedDelivery) }}</span>
        </div>
      </el-card>

      <!-- 物流轨迹时间线 -->
      <el-card class="tracking-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">运输详情</span>
            <el-button 
              type="primary" 
              size="small"
              @click="refreshTimeline"
              :loading="timelineLoading"
            >
              刷新追踪
            </el-button>
          </div>
        </template>
        
        <div class="timeline-container">
          <div 
            v-for="(event, index) in getGroupedTimeline()" 
            :key="event.date"
            class="timeline-date-group"
          >
            <!-- 日期标题 -->
            <div class="timeline-date-header">
              <h3>{{ formatDateHeader(event.date) }}</h3>
            </div>
            
            <!-- 该日期的事件 -->
            <div 
              v-for="item in event.events" 
              :key="item.id"
              class="timeline-item"
              :class="{ 
                'is-latest': isLatestEvent(item),
                'is-delivered': item.status === ShipmentStatus.Delivered 
              }"
            >
              <div class="timeline-time-column">
                <div class="timeline-time">{{ formatTime(item.timestamp) }}</div>
              </div>
              
              <div class="timeline-dot">
                <el-icon 
                  v-if="item.status === ShipmentStatus.Delivered"
                  class="delivered-icon"
                >
                  <Check />
                </el-icon>
                <div v-else class="dot-circle"></div>
              </div>
              
              <div class="timeline-content">
                <div class="timeline-description">
                  {{ getTrackingDescription(item) }}
                </div>
                <div class="timeline-location">
                  {{ item.location }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 联系信息 -->
      <el-card class="tracking-card" shadow="never">
        <template #header>
          <span class="card-title">联系信息</span>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="contact-info">
              <h4>承运商客服</h4>
              <p>{{ getCarrierContact(shipment.carrier) }}</p>
              <el-button type="primary" size="small" @click="contactCarrier">
                联系客服
              </el-button>
            </div>
          </el-col>
          
          <el-col :span="12">
            <div class="contact-info">
              <h4>收件人</h4>
              <p>{{ shipment.recipient.name }}</p>
              <p>{{ shipment.recipient.phone }}</p>
              <el-button type="primary" size="small" @click="contactRecipient">
                联系收件人
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="exportTracking">
          导出追踪记录
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock, Check } from '@element-plus/icons-vue'
import { 
  ShipmentItem, 
  ShipmentStatus,
  SHIPMENT_STATUS_CONFIG,
  CARRIER_OPTIONS
} from '../types'

// Props
interface Props {
  modelValue: boolean
  shipment: ShipmentItem | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 响应式数据
const timelineLoading = ref(false)

// 计算属性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// 方法
const getCarrierLabel = (carrier: string) => {
  const option = CARRIER_OPTIONS.find(item => item.value === carrier)
  return option?.label || carrier
}

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('zh-CN')
}

const getProgressStep = (status: ShipmentStatus) => {
  const stepMap: Record<ShipmentStatus, number> = {
    [ShipmentStatus.New]: 0,
    [ShipmentStatus.InTransit]: 1,
    [ShipmentStatus.Delivered]: 2,
    [ShipmentStatus.Closed]: 3
  }
  return stepMap[status] || 0
}

// 将时间线按日期分组
const getGroupedTimeline = () => {
  if (!props.shipment?.timeline) return []
  
  const grouped = props.shipment.timeline.reduce((acc: any, event: any) => {
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
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
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
  if (!props.shipment?.timeline) return false
  const sortedEvents = [...props.shipment.timeline].sort((a, b) => 
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



const getCarrierContact = (carrier: string) => {
  const contactMap: Record<string, string> = {
    'fedex': '400-886-1888',
    'ups': '400-820-8388',
    'dhl': '400-810-8000',
    'usps': '400-123-4567',
    'other': '客服电话请联系承运商'
  }
  return contactMap[carrier] || '客服电话请联系承运商'
}



const refreshTimeline = async () => {
  timelineLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('物流轨迹已更新')
  } catch (error) {
    ElMessage.error('轨迹更新失败')
  } finally {
    timelineLoading.value = false
  }
}

const contactCarrier = () => {
  if (props.shipment) {
    const phone = getCarrierContact(props.shipment.carrier)
    ElMessage.info(`承运商客服电话：${phone}`)
  }
}

const contactRecipient = () => {
  if (props.shipment) {
    ElMessage.info(`收件人电话：${props.shipment.recipient.phone}`)
  }
}

const exportTracking = () => {
  ElMessage.success('追踪记录导出功能开发中')
}

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.tracking-container {
  max-height: 600px;
  overflow-y: auto;
}

.tracking-card {
  margin-bottom: 20px;
}

.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.tracking-info h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.tracking-detail {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.progress-section {
  margin: 30px 0;
}

.delivery-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
  color: #1890ff;
  font-weight: 500;
}

.delivery-icon {
  font-size: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.timeline-container {
  position: relative;
}

.timeline-date-group {
  margin-bottom: 32px;
}

.timeline-date-group:last-child {
  margin-bottom: 0;
}

.timeline-date-header {
  margin-bottom: 16px;
}

.timeline-date-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.timeline-item {
  display: flex;
  position: relative;
  padding: 16px 0;
  border-left: 2px solid #e4e7ed;
  margin-left: 80px;
}

.timeline-item.is-delivered {
  border-left-color: #67c23a;
}

.timeline-item:last-child {
  border-left: none;
}

.timeline-time-column {
  position: absolute;
  left: -92px;
  top: 16px;
  width: 80px;
  text-align: right;
}

.timeline-time {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.timeline-dot {
  position: absolute;
  left: -8px;
  top: 20px;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  z-index: 1;
}

.timeline-dot .dot-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #909399;
}

.timeline-item.is-delivered .timeline-dot .delivered-icon {
  color: #67c23a;
  font-size: 16px;
  background-color: #fff;
  border-radius: 50%;
  padding: 2px;
}

.timeline-content {
  padding-left: 16px;
  flex: 1;
}

.timeline-description {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  line-height: 1.4;
}

.timeline-item.is-delivered .timeline-description {
  color: #67c23a;
}

.timeline-location {
  font-size: 14px;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-info {
  text-align: center;
}

.contact-info h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.contact-info p {
  margin: 4px 0;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-steps) {
  margin: 20px 0;
}

:deep(.is-active) {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style> 