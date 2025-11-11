<template>
  <el-dialog
    v-model="visible"
    :title="`Update Status: ${currentStatusLabel} → ${targetStatusLabel}`"
    width="800px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="160px"
      :rules="formRules"
    >
      <!-- ASSIGNED 阶段字段 (调度阶段) -->
      <template v-if="targetStatus === 'ASSIGNED'">
        <el-form-item label="Carrier" prop="carrierId">
          <el-select
            v-model="formData.carrierId"
            placeholder="Select carrier"
            style="width: 100%"
            filterable
          >
            <!-- TODO: 从API获取carrier列表 -->
            <el-option label="Carrier A" value="CARRIER_A" />
            <el-option label="Carrier B" value="CARRIER_B" />
          </el-select>
        </el-form-item>
        <el-form-item label="Driver Name" prop="driverName">
          <el-input 
            v-model="formData.driverName" 
            :placeholder="formData.driverName ? `Already set: ${formData.driverName}` : 'Enter driver name'" 
          />
        </el-form-item>
        <el-form-item label="Truck No" prop="truckNo">
          <el-input 
            v-model="formData.truckNo" 
            :placeholder="formData.truckNo ? `Already set: ${formData.truckNo}` : 'Enter truck number'" 
          />
        </el-form-item>
        <el-form-item label="Trailer No" prop="trailerNo">
          <el-input 
            v-model="formData.trailerNo" 
            :placeholder="formData.trailerNo ? `Already set: ${formData.trailerNo}` : 'Enter trailer number'" 
          />
        </el-form-item>
        <el-form-item label="Equipment" prop="equipment">
          <el-input v-model="formData.equipment" placeholder="Enter equipment type" />
        </el-form-item>
        <el-form-item label="Appointment Time" prop="appointmentTime">
          <el-date-picker
            v-model="formData.appointmentTime"
            type="datetime"
            :placeholder="formData.appointmentTime ? 'Already set: ' + formatDateTime(formData.appointmentTime) : 'Select appointment time'"
            style="width: 100%"
          />
        </el-form-item>
      </template>

      <!-- CHECKIN 阶段字段 (签到阶段) -->
      <template v-if="targetStatus === 'CHECKIN'">
        <el-form-item label="Warehouse" prop="checkInWarehouse" :rules="[{ required: true, message: 'Please select warehouse' }]">
          <el-select
            v-model="formData.checkInWarehouse"
            :placeholder="formData.checkInWarehouse ? `Already set: ${warehouses.find(w => w.value === formData.checkInWarehouse)?.label || formData.checkInWarehouse}` : 'Select warehouse'"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="warehouse in warehouses"
              :key="warehouse.value"
              :label="warehouse.label"
              :value="warehouse.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Driver Check-in Time" prop="driverCheckinTime">
          <el-date-picker
            v-model="formData.driverCheckinTime"
            type="datetime"
            :placeholder="formData.driverCheckinTime ? 'Already set: ' + formatDateTime(formData.driverCheckinTime) : 'Select check-in time'"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Gate In Time" prop="gateInTime">
          <el-date-picker
            v-model="formData.gateInTime"
            type="datetime"
            :placeholder="formData.gateInTime ? 'Already set: ' + formatDateTime(formData.gateInTime) : 'Select gate in time'"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Dock No" prop="dockNo">
          <el-input 
            v-model="formData.dockNo" 
            :placeholder="formData.dockNo ? `Already set: ${formData.dockNo}` : 'Enter dock number'" 
          />
        </el-form-item>
        <el-form-item label="Gate In Operator" prop="gateInOperator">
          <el-input 
            v-model="formData.gateInOperator" 
            :placeholder="formData.gateInOperator ? `Already set: ${formData.gateInOperator}` : 'Enter gate in operator name'" 
          />
        </el-form-item>
        <el-form-item label="License Plate" prop="vehicleInfo.licensePlate">
          <el-input 
            v-model="formData.vehicleInfo.licensePlate" 
            :placeholder="formData.vehicleInfo?.licensePlate ? `Already set: ${formData.vehicleInfo.licensePlate}` : 'Enter license plate'" 
          />
        </el-form-item>
        <el-form-item label="Trailer No" prop="vehicleInfo.trailerNo">
          <el-input 
            v-model="formData.vehicleInfo.trailerNo" 
            :placeholder="formData.vehicleInfo?.trailerNo ? `Already set: ${formData.vehicleInfo.trailerNo}` : 'Enter trailer no'" 
          />
        </el-form-item>
      </template>

      <!-- LOADING 阶段字段 (装载阶段) -->
      <template v-if="targetStatus === 'LOADING'">
        <el-form-item label="Loading Start Time" prop="loadingStartTime">
          <el-date-picker
            v-model="formData.loadingStartTime"
            type="datetime"
            :placeholder="formData.loadingStartTime ? 'Already set: ' + formatDateTime(formData.loadingStartTime) : 'Select loading start time'"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Shipment IDs" prop="shipmentIds">
          <el-input 
            v-model="formData.shipmentIdsStr" 
            placeholder="Enter shipment IDs (comma separated)" 
          />
        </el-form-item>
        <el-form-item label="Planned Pallet Qty" prop="plannedPalletQty">
          <el-input-number
            v-model="formData.plannedPalletQty"
            :min="0"
            placeholder="Enter planned pallet quantity"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Planned Weight (kg)" prop="plannedWeight">
          <el-input-number
            v-model="formData.plannedWeight"
            :min="0"
            :precision="2"
            placeholder="Enter planned weight"
            style="width: 100%"
          />
        </el-form-item>
      </template>

      <!-- LOADED 阶段字段 (装载完成阶段) -->
      <template v-if="targetStatus === 'LOADED'">
        <el-form-item label="BOL No" prop="bolNo">
          <el-input 
            v-model="formData.bolNo" 
            :placeholder="formData.bolNo ? `Already set: ${formData.bolNo}` : 'Enter BOL number'" 
          />
        </el-form-item>
        <el-form-item label="Seal No" prop="sealNo">
          <el-input 
            v-model="formData.sealNo" 
            :placeholder="formData.sealNo ? `Already set: ${formData.sealNo}` : 'Enter seal number'" 
          />
        </el-form-item>
        <el-form-item label="Actual Pallet Qty" prop="actualPalletQty">
          <el-input-number
            v-model="formData.actualPalletQty"
            :min="0"
            placeholder="Enter actual pallet quantity"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Actual Weight (kg)" prop="actualWeight">
          <el-input-number
            v-model="formData.actualWeight"
            :min="0"
            :precision="2"
            placeholder="Enter actual weight"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Load Complete Time" prop="loadCompleteTime">
          <el-date-picker
            v-model="formData.loadCompleteTime"
            type="datetime"
            :placeholder="formData.loadCompleteTime ? 'Already set: ' + formatDateTime(formData.loadCompleteTime) : 'Select load complete time'"
            style="width: 100%"
          />
        </el-form-item>
      </template>

      <!-- SHIPPED 阶段字段 (发运阶段) -->
      <template v-if="targetStatus === 'SHIPPED'">
        <el-form-item label="Gate Out Time" prop="gateOutTime">
          <el-date-picker
            v-model="formData.gateOutTime"
            type="datetime"
            :placeholder="formData.gateOutTime ? 'Already set: ' + formatDateTime(formData.gateOutTime) : 'Select gate out time'"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Pro No" prop="proNo">
          <el-input 
            v-model="formData.proNo" 
            :placeholder="formData.proNo ? `Already set: ${formData.proNo}` : 'Enter Pro No'" 
          />
        </el-form-item>
        <el-form-item label="Tracking No" prop="trackingNo">
          <el-input 
            v-model="formData.trackingNo" 
            :placeholder="formData.trackingNo ? `Already set: ${formData.trackingNo}` : 'Enter tracking number'" 
          />
        </el-form-item>
        <el-form-item label="Departure Time" prop="departureTime">
          <el-date-picker
            v-model="formData.departureTime"
            type="datetime"
            :placeholder="formData.departureTime ? 'Already set: ' + formatDateTime(formData.departureTime) : 'Select departure time'"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Driver Name" prop="driverInfo.name">
          <el-input 
            v-model="formData.driverInfo.name" 
            :placeholder="formData.driverInfo?.name ? `Already set: ${formData.driverInfo.name}` : 'Enter driver name'" 
          />
        </el-form-item>
        <el-form-item label="Driver Phone" prop="driverInfo.phone">
          <el-input 
            v-model="formData.driverInfo.phone" 
            :placeholder="formData.driverInfo?.phone ? `Already set: ${formData.driverInfo.phone}` : 'Enter driver phone'" 
          />
        </el-form-item>
        <el-form-item label="Estimated Delivery Date" prop="estimatedDeliveryDate">
          <el-date-picker
            v-model="formData.estimatedDeliveryDate"
            type="date"
            :placeholder="formData.estimatedDeliveryDate ? 'Already set: ' + formatDateTime(formData.estimatedDeliveryDate) : 'Select estimated delivery date'"
            style="width: 100%"
          />
        </el-form-item>
      </template>

      <!-- DELIVERED 阶段字段 (交付阶段) -->
      <template v-if="targetStatus === 'DELIVERED'">
        <el-form-item label="Delivered Time" prop="deliveredTime">
          <el-date-picker
            v-model="formData.deliveredTime"
            type="datetime"
            :placeholder="formData.deliveredTime ? 'Already set: ' + formatDateTime(formData.deliveredTime) : 'Select delivered time'"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Received By" prop="receivedBy">
          <el-input 
            v-model="formData.receivedBy" 
            :placeholder="formData.receivedBy ? `Already set: ${formData.receivedBy}` : 'Enter receiver name'" 
          />
        </el-form-item>
        <el-form-item label="Received Qty" prop="receivedQty">
          <el-input-number
            v-model="formData.receivedQty"
            :min="0"
            placeholder="Enter received quantity"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="POD File" prop="podFileUrl">
          <el-upload
            v-model:file-list="formData.podFileList"
            action="#"
            :auto-upload="false"
            :limit="1"
          >
            <el-button type="primary">Upload POD</el-button>
            <template #tip>
              <div class="el-upload__tip">
                Upload proof of delivery document
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </template>

      <!-- CLOSED 阶段字段 (关单阶段) -->
      <template v-if="targetStatus === 'CLOSED'">
        <el-form-item label="Final Freight Cost" prop="finalFreightCost">
          <el-input-number
            v-model="formData.finalFreightCost"
            :min="0"
            :precision="2"
            :placeholder="formData.finalFreightCost ? `Already set: $${formData.finalFreightCost}` : 'Enter final freight cost'"
            style="width: 100%"
          >
            <template #prepend>$</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="Invoice No" prop="invoiceNo">
          <el-input 
            v-model="formData.invoiceNo" 
            :placeholder="formData.invoiceNo ? `Already set: ${formData.invoiceNo}` : 'Enter invoice number'" 
          />
        </el-form-item>
        <el-form-item label="Close Time" prop="closeTime">
          <el-date-picker
            v-model="formData.closeTime"
            type="datetime"
            :placeholder="formData.closeTime ? 'Already set: ' + formatDateTime(formData.closeTime) : 'Select close time'"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Closed By" prop="closedBy">
          <el-input 
            v-model="formData.closedBy" 
            :placeholder="formData.closedBy ? `Already set: ${formData.closedBy}` : 'Enter closer name'" 
          />
        </el-form-item>
      </template>

      <!-- CANCELLED 阶段字段 (取消阶段) -->
      <template v-if="targetStatus === 'CANCELLED'">
        <el-form-item label="Cancel Reason" prop="cancelReason">
          <el-select
            v-model="formData.cancelReason"
            placeholder="Select cancellation reason"
            style="width: 100%"
          >
            <el-option label="Customer Cancelled" value="customer_cancelled" />
            <el-option label="Carrier Unable to Service" value="carrier_unable" />
            <el-option label="Goods Issue" value="goods_issue" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.cancelReason === 'other'" label="Reason Details" prop="cancelReasonDetail">
          <el-input
            v-model="formData.cancelReasonDetail"
            type="textarea"
            :rows="3"
            placeholder="Enter reason details"
          />
        </el-form-item>
        <el-form-item label="Cancel Time" prop="cancelTime">
          <el-date-picker
            v-model="formData.cancelTime"
            type="datetime"
            :placeholder="formData.cancelTime ? 'Already set: ' + formatDateTime(formData.cancelTime) : 'Select cancel time'"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Cancel Operator" prop="cancelOperator">
          <el-input 
            v-model="formData.cancelOperator" 
            :placeholder="formData.cancelOperator ? `Already set: ${formData.cancelOperator}` : 'Enter operator name'" 
          />
        </el-form-item>
      </template>

      <!-- 通用字段 -->
      <el-form-item label="Note" prop="note">
        <el-input
          v-model="formData.note"
          type="textarea"
          :rows="3"
          placeholder="Enter note (optional)"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="saving">
        Confirm
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Load, VehicleInfo, DriverInfo, DeliveryConfirmation, BillingStatus } from '../types'
import { LOAD_STATUS_MAP, TRAILER_PICKUP_MODES } from '../types'

interface Props {
  modelValue: boolean
  currentStatus: string
  targetStatus: string
  loadData: Load
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [data: any]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const saving = ref(false)

const currentStatusLabel = computed(() => LOAD_STATUS_MAP[props.currentStatus]?.label || props.currentStatus)
const targetStatusLabel = computed(() => LOAD_STATUS_MAP[props.targetStatus]?.label || props.targetStatus)

// 仓库列表 - TODO: 从API获取
const warehouses = ref([
  { label: 'US Warehouse 01', value: 'WH_US_01' },
  { label: 'US Warehouse 02', value: 'WH_US_02' },
  { label: 'UK Warehouse 01', value: 'WH_UK_01' },
  { label: 'Main Warehouse', value: 'WMS_01' },
  { label: 'Secondary Warehouse', value: 'WMS_02' },
  { label: '3PL Warehouse', value: '3PL_01' }
])

const needsRouting = computed(() => props.loadData.mode === 'CUSTOMER_ROUTING')
const needsTrailerMode = computed(() => props.loadData.loadType === 'FTL' || props.loadData.loadType === 'LTL')
const needsDriverInfo = computed(() => props.loadData.loadType === 'FTL' || props.loadData.loadType === 'LTL')
const needsTmsId = computed(() => !!props.loadData.tmsShipmentId)
const needsArn = computed(() => {
  // 根据 Customer 判断是否需要 ARN
  return false // TODO: 从 Customer 配置获取
})

// 初始化表单数据，自动填充已有信息
const initFormData = () => {
  return {
    // ASSIGNED 阶段字段
    carrierId: props.loadData.carrierId || '',
    driverName: props.loadData.driverName || '',
    truckNo: props.loadData.truckNo || '',
    trailerNo: props.loadData.trailerNo || '',
    equipment: props.loadData.equipment || '',
    appointmentTime: props.loadData.appointmentTime || '',
    // CHECKIN 阶段字段
    checkInWarehouse: props.loadData.checkInWarehouse || '',
    driverCheckinTime: props.loadData.driverCheckinTime || '',
    gateInTime: props.loadData.gateInTime || '',
    dockNo: props.loadData.dockNo || '',
    gateInOperator: props.loadData.gateInOperator || '',
    vehicleInfo: {
      licensePlate: props.loadData.vehicleInfo?.licensePlate || '',
      trailerNo: props.loadData.vehicleInfo?.trailerNo || '',
      vehicleType: props.loadData.vehicleInfo?.vehicleType || ''
    },
    // LOADING 阶段字段
    loadingStartTime: props.loadData.loadingStartTime || '',
    shipmentIdsStr: props.loadData.shipmentIds?.join(', ') || '',
    plannedPalletQty: props.loadData.plannedPalletQty || 0,
    plannedWeight: props.loadData.plannedWeight || 0,
    // LOADED 阶段字段
    bolNo: props.loadData.bolNo || '',
    sealNo: props.loadData.sealNo || '',
    actualPalletQty: props.loadData.actualPalletQty || 0,
    actualWeight: props.loadData.actualWeight || 0,
    loadCompleteTime: props.loadData.loadCompleteTime || '',
    // SHIPPED 阶段字段
    gateOutTime: props.loadData.gateOutTime || '',
    proNo: props.loadData.proNo || '',
    trackingNo: props.loadData.trackingNo || '',
    departureTime: props.loadData.departureTime || '',
    driverInfo: {
      name: props.loadData.driverInfo?.name || '',
      phone: props.loadData.driverInfo?.phone || ''
    },
    estimatedDeliveryDate: props.loadData.estimatedDeliveryDate || '',
    // DELIVERED 阶段字段
    deliveredTime: props.loadData.deliveredTime || '',
    receivedBy: props.loadData.receivedBy || '',
    receivedQty: props.loadData.receivedQty || 0,
    podFileList: [],
    // CLOSED 阶段字段
    finalFreightCost: props.loadData.finalFreightCost || props.loadData.freightCost || 0,
    invoiceNo: props.loadData.invoiceNo || '',
    closeTime: props.loadData.closeTime || '',
    closedBy: props.loadData.closedBy || '',
    // CANCELLED 阶段字段
    cancelReason: props.loadData.cancelReason || '',
    cancelReasonDetail: '',
    cancelTime: props.loadData.cancelTime || '',
    cancelOperator: props.loadData.cancelOperator || '',
    note: ''
  }
}

const formData = reactive<any>(initFormData())

// 监听 loadData 变化，自动更新表单数据
watch(() => props.loadData, () => {
  const newData = initFormData()
  Object.assign(formData, newData)
}, { deep: true })

const formRules = computed(() => {
  const rules: any = {}
  
  if (props.targetStatus === 'ASSIGNED') {
    rules.carrierId = [{ required: true, message: 'Please select carrier' }]
    rules.driverName = [{ required: true, message: 'Please enter driver name' }]
    rules.appointmentTime = [{ required: true, message: 'Please select appointment time' }]
  }
  
  if (props.targetStatus === 'CHECKIN') {
    rules.checkInWarehouse = [{ required: true, message: 'Please select warehouse' }]
    rules.driverCheckinTime = [{ required: true, message: 'Please select check-in time' }]
    rules.gateInTime = [{ required: true, message: 'Please select gate in time' }]
  }
  
  if (props.targetStatus === 'LOADING') {
    rules.loadingStartTime = [{ required: true, message: 'Please select loading start time' }]
  }
  
  if (props.targetStatus === 'LOADED') {
    rules.bolNo = [{ required: true, message: 'Please enter BOL number' }]
    rules.loadCompleteTime = [{ required: true, message: 'Please select load complete time' }]
  }
  
  if (props.targetStatus === 'SHIPPED') {
    rules.gateOutTime = [{ required: true, message: 'Please select gate out time' }]
    rules.proNo = [{ required: true, message: 'Please enter Pro No' }]
  }
  
  if (props.targetStatus === 'DELIVERED') {
    rules.deliveredTime = [{ required: true, message: 'Please select delivered time' }]
    rules.receivedBy = [{ required: true, message: 'Please enter receiver name' }]
  }
  
  if (props.targetStatus === 'CLOSED') {
    rules.finalFreightCost = [{ required: true, message: 'Please enter final freight cost' }]
    rules.invoiceNo = [{ required: true, message: 'Please enter invoice number' }]
  }
  
  if (props.targetStatus === 'CANCELLED') {
    rules.cancelReason = [{ required: true, message: 'Please select cancellation reason' }]
  }
  
  return rules
})

const handleConfirm = async () => {
  try {
    await formRef.value?.validate()
    
    saving.value = true
    
    const updateData: any = {
      status: props.targetStatus,
      note: formData.note
    }
    
    // 根据目标状态添加相应字段
    if (props.targetStatus === 'ASSIGNED') {
      updateData.carrierId = formData.carrierId
      updateData.driverName = formData.driverName
      updateData.truckNo = formData.truckNo
      updateData.trailerNo = formData.trailerNo
      updateData.equipment = formData.equipment
      updateData.appointmentTime = formData.appointmentTime
      updateData.dispatchTime = new Date().toISOString()
    } else if (props.targetStatus === 'CHECKIN') {
      updateData.checkInWarehouse = formData.checkInWarehouse
      updateData.driverCheckinTime = formData.driverCheckinTime
      updateData.gateInTime = formData.gateInTime
      updateData.dockNo = formData.dockNo
      updateData.gateInOperator = formData.gateInOperator
      updateData.vehicleInfo = formData.vehicleInfo
    } else if (props.targetStatus === 'LOADING') {
      updateData.loadingStartTime = formData.loadingStartTime
      updateData.shipmentIds = formData.shipmentIdsStr ? formData.shipmentIdsStr.split(',').map(s => s.trim()) : []
      updateData.plannedPalletQty = formData.plannedPalletQty
      updateData.plannedWeight = formData.plannedWeight
    } else if (props.targetStatus === 'LOADED') {
      updateData.bolNo = formData.bolNo
      updateData.sealNo = formData.sealNo
      updateData.actualPalletQty = formData.actualPalletQty
      updateData.actualWeight = formData.actualWeight
      updateData.loadCompleteTime = formData.loadCompleteTime
    } else if (props.targetStatus === 'SHIPPED') {
      updateData.gateOutTime = formData.gateOutTime
      updateData.proNo = formData.proNo
      updateData.trackingNo = formData.trackingNo
      updateData.departureTime = formData.departureTime
      updateData.driverInfo = formData.driverInfo
      updateData.estimatedDeliveryDate = formData.estimatedDeliveryDate
    } else if (props.targetStatus === 'DELIVERED') {
      updateData.deliveredTime = formData.deliveredTime
      updateData.receivedBy = formData.receivedBy
      updateData.receivedQty = formData.receivedQty
      // TODO: 处理POD文件上传
      if (formData.podFileList && formData.podFileList.length > 0) {
        updateData.podFileUrl = formData.podFileList[0].url || ''
      }
    } else if (props.targetStatus === 'CLOSED') {
      updateData.finalFreightCost = formData.finalFreightCost
      updateData.invoiceNo = formData.invoiceNo
      updateData.closeTime = formData.closeTime || new Date().toISOString()
      updateData.closedBy = formData.closedBy
    } else if (props.targetStatus === 'CANCELLED') {
      updateData.cancelReason = formData.cancelReason === 'other' 
        ? formData.cancelReasonDetail 
        : formData.cancelReason
      updateData.cancelTime = formData.cancelTime || new Date().toISOString()
      updateData.cancelOperator = formData.cancelOperator
    }
    
    emit('confirm', updateData)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(`Status updated to ${targetStatusLabel.value}`)
    handleClose()
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    saving.value = false
  }
}

const handleClose = () => {
  visible.value = false
  // 重置表单数据
  const newData = initFormData()
  Object.assign(formData, newData)
}

// 格式化日期时间
const formatDateTime = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>

