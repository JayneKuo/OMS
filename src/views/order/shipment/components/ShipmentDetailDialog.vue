<template>
  <el-dialog
    v-model="dialogVisible"
    title="运单详情"
    width="800px"
    @close="handleClose"
  >
    <div v-if="shipment" class="shipment-detail">
      <!-- 基本信息 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">基本信息</span>
            <el-tag 
              :color="SHIPMENT_STATUS_CONFIG[shipment.status].color"
              effect="light"
              size="large"
            >
              {{ SHIPMENT_STATUS_CONFIG[shipment.status].label }}
            </el-tag>
          </div>
        </template>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="运单号">
            <span class="important-info">{{ shipment.shipmentNo }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="销售订单号">
            <el-link type="primary" @click="viewSalesOrder">
              {{ shipment.salesOrderNo }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="物流单号">
            <span class="important-info">{{ shipment.truckingNo }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="承运商">
            {{ getCarrierLabel(shipment.carrier) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(shipment.createDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDateTime(shipment.updateDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="预计送达" v-if="shipment.estimatedDelivery">
            {{ formatDateTime(shipment.estimatedDelivery) }}
          </el-descriptions-item>
          <el-descriptions-item label="实际送达" v-if="shipment.actualDelivery">
            {{ formatDateTime(shipment.actualDelivery) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 收发件人信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="info-card" shadow="never">
            <template #header>
              <span class="card-title">收件人信息</span>
            </template>
            
            <el-descriptions :column="1" border>
              <el-descriptions-item label="姓名">
                {{ shipment.recipient.name }}
              </el-descriptions-item>
              <el-descriptions-item label="电话">
                <el-link :href="`tel:${shipment.recipient.phone}`">
                  {{ shipment.recipient.phone }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                <el-link :href="`mailto:${shipment.recipient.email}`">
                  {{ shipment.recipient.email }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item label="地址">
                {{ shipment.recipient.address }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card class="info-card" shadow="never">
            <template #header>
              <span class="card-title">发件人信息</span>
            </template>
            
            <el-descriptions :column="1" border>
              <el-descriptions-item label="姓名">
                {{ shipment.sender.name }}
              </el-descriptions-item>
              <el-descriptions-item label="电话">
                {{ shipment.sender.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="地址">
                {{ shipment.sender.address }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <!-- 包裹信息 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <span class="card-title">包裹信息</span>
        </template>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="重量">
            {{ shipment.packageInfo.weight }} kg
          </el-descriptions-item>
          <el-descriptions-item label="价值">
            ¥{{ shipment.packageInfo.value.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="尺寸">
            {{ shipment.packageInfo.dimensions.length }} × 
            {{ shipment.packageInfo.dimensions.width }} × 
            {{ shipment.packageInfo.dimensions.height }} cm
          </el-descriptions-item>
          <el-descriptions-item label="商品描述">
            {{ shipment.packageInfo.description }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 备注信息 -->
      <el-card v-if="shipment.notes" class="info-card" shadow="never">
        <template #header>
          <span class="card-title">备注信息</span>
        </template>
        
        <div class="notes-content">
          {{ shipment.notes }}
        </div>
      </el-card>

      <!-- 物流时间线 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">物流轨迹</span>
            <el-button 
              type="primary" 
              size="small"
              @click="refreshTimeline"
              :loading="timelineLoading"
            >
              刷新轨迹
            </el-button>
          </div>
        </template>
        
        <el-timeline class="timeline">
          <el-timeline-item
            v-for="event in shipment.timeline"
            :key="event.id"
            :timestamp="formatDateTime(event.timestamp)"
            :type="getTimelineType(event.status)"
            placement="top"
          >
            <div class="timeline-content">
              <div class="timeline-title">
                <el-tag 
                  :color="SHIPMENT_STATUS_CONFIG[event.status].color"
                  size="small"
                  effect="light"
                >
                  {{ SHIPMENT_STATUS_CONFIG[event.status].label }}
                </el-tag>
                <span class="location">{{ event.location }}</span>
              </div>
              <div class="timeline-description">
                {{ event.description }}
              </div>
              <div v-if="event.operator" class="timeline-operator">
                操作员：{{ event.operator }}
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button 
          type="primary" 
          @click="openTrackingDialog"
          v-if="shipment?.status === ShipmentStatus.InTransit"
        >
          实时追踪
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
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

const getTimelineType = (status: ShipmentStatus) => {
  const typeMap: Record<ShipmentStatus, string> = {
    [ShipmentStatus.New]: 'info',
    [ShipmentStatus.InTransit]: 'primary',
    [ShipmentStatus.Delivered]: 'success',
    [ShipmentStatus.Closed]: 'danger'
  }
  return typeMap[status] || 'info'
}

const viewSalesOrder = () => {
  // 这里可以跳转到销售订单详情页
  ElMessage.info('跳转到销售订单详情')
}

const refreshTimeline = async () => {
  timelineLoading.value = true
  try {
    // 这里调用API刷新物流轨迹
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('物流轨迹已刷新')
  } catch (error) {
    ElMessage.error('刷新失败')
  } finally {
    timelineLoading.value = false
  }
}

const openTrackingDialog = () => {
  // 这里可以打开实时追踪对话框
  ElMessage.info('打开实时追踪功能')
}

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.shipment-detail {
  max-height: 600px;
  overflow-y: auto;
}

.info-card {
  margin-bottom: 20px;
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

.important-info {
  color: #409eff;
  font-weight: 600;
}

.notes-content {
  padding: 12px 0;
  line-height: 1.6;
  color: #606266;
}

.timeline {
  margin-top: 10px;
}

.timeline-content {
  padding: 8px 0;
}

.timeline-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.location {
  color: #409eff;
  font-weight: 500;
}

.timeline-description {
  color: #606266;
  margin-bottom: 4px;
}

.timeline-operator {
  color: #909399;
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-descriptions__body) {
  background-color: #fafafa;
}

:deep(.el-descriptions-item__label) {
  font-weight: 500;
  width: 120px;
}

:deep(.el-link) {
  font-weight: 500;
}
</style> 