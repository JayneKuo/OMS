<template>
  <div class="load-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1>Load Detail: {{ loadData.loadNo }}</h1>
        <el-tag :type="getStatusType(loadData.status)" size="large">
          {{ LOAD_STATUS_MAP[loadData.status]?.label || loadData.status }}
        </el-tag>
      </div>
      <div class="header-right">
        <!-- 根据状态显示对应的操作按钮 -->
        <template v-if="getStatusActions(loadData.status).length > 0">
          <el-button
            v-for="action in getStatusActions(loadData.status)"
            :key="action.command"
            :type="action.type || 'primary'"
            :disabled="action.condition && !action.condition(loadData)"
            @click="handleAction(action.command)"
          >
            {{ action.label }}
          </el-button>
        </template>
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
        <el-descriptions-item label="Load NO">{{ loadData.loadNo }}</el-descriptions-item>
        <el-descriptions-item label="Mode">{{ loadData.mode }}</el-descriptions-item>
        <el-descriptions-item label="Status">
          <el-tag :type="getStatusType(loadData.status)">
            {{ LOAD_STATUS_MAP[loadData.status]?.label || loadData.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Customer">{{ loadData.customer }}</el-descriptions-item>
        <el-descriptions-item label="Carrier">{{ loadData.carrier }}</el-descriptions-item>
        <el-descriptions-item label="Load Type">{{ loadData.loadType }}</el-descriptions-item>
        <el-descriptions-item label="Pro NO">{{ loadData.proNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="TMS Shipment ID">{{ loadData.tmsShipmentId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Freight Term">{{ loadData.freightTerm || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Appointment Time">
          {{ formatDateTime(loadData.appointmentTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="Desired Ship Date">
          {{ formatDate(loadData.desiredShipDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="Long Haul">
          <el-tag :type="loadData.longHaul ? 'success' : 'info'" size="small">
            {{ loadData.longHaul ? 'Yes' : 'No' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Retailer Authorization">
          {{ loadData.retailerAuthorization || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="Trailer Pick Up Mode">
          {{ loadData.trailerPickUpMode || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="Adjusted Pallet Qty">
          {{ loadData.adjustedPalletQty || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="Freight Cost">
          <span v-if="loadData.freightCost">${{ loadData.freightCost.toFixed(2) }}</span>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="Routing Request Date">
          {{ formatDate(loadData.routingRequestDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="Routing Receipt Date">
          {{ formatDate(loadData.routingReceiptDate) }}
        </el-descriptions-item>
        <el-descriptions-item label="Created At" :span="2">
          {{ formatDateTime(loadData.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="Updated At">
          {{ formatDateTime(loadData.updatedAt) }}
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
            <p v-if="loadData.shipFrom?.name"><strong>Name:</strong> {{ loadData.shipFrom.name }}</p>
            <p v-if="loadData.shipFrom?.company"><strong>Company:</strong> {{ loadData.shipFrom.company }}</p>
            <p v-if="loadData.shipFrom?.address1">{{ loadData.shipFrom.address1 }}</p>
            <p v-if="loadData.shipFrom?.address2">{{ loadData.shipFrom.address2 }}</p>
            <p v-if="loadData.shipFrom?.city">
              {{ loadData.shipFrom.city }}, {{ loadData.shipFrom.state }} {{ loadData.shipFrom.zipCode }}
            </p>
            <p v-if="loadData.shipFrom?.country">{{ loadData.shipFrom.country }}</p>
            <p v-if="loadData.shipFrom?.phone"><strong>Phone:</strong> {{ loadData.shipFrom.phone }}</p>
            <p v-if="loadData.shipFrom?.email"><strong>Email:</strong> {{ loadData.shipFrom.email }}</p>
            <p v-if="!hasAddress(loadData.shipFrom)" class="empty-text">No address information</p>
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
            <p v-if="loadData.shipTo?.name"><strong>Name:</strong> {{ loadData.shipTo.name }}</p>
            <p v-if="loadData.shipTo?.company"><strong>Company:</strong> {{ loadData.shipTo.company }}</p>
            <p v-if="loadData.shipTo?.address1">{{ loadData.shipTo.address1 }}</p>
            <p v-if="loadData.shipTo?.address2">{{ loadData.shipTo.address2 }}</p>
            <p v-if="loadData.shipTo?.city">
              {{ loadData.shipTo.city }}, {{ loadData.shipTo.state }} {{ loadData.shipTo.zipCode }}
            </p>
            <p v-if="loadData.shipTo?.country">{{ loadData.shipTo.country }}</p>
            <p v-if="loadData.shipTo?.phone"><strong>Phone:</strong> {{ loadData.shipTo.phone }}</p>
            <p v-if="loadData.shipTo?.email"><strong>Email:</strong> {{ loadData.shipTo.email }}</p>
            <p v-if="!hasAddress(loadData.shipTo)" class="empty-text">No address information</p>
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
            <p v-if="loadData.billTo?.name"><strong>Name:</strong> {{ loadData.billTo.name }}</p>
            <p v-if="loadData.billTo?.company"><strong>Company:</strong> {{ loadData.billTo.company }}</p>
            <p v-if="loadData.billTo?.address1">{{ loadData.billTo.address1 }}</p>
            <p v-if="loadData.billTo?.address2">{{ loadData.billTo.address2 }}</p>
            <p v-if="loadData.billTo?.city">
              {{ loadData.billTo.city }}, {{ loadData.billTo.state }} {{ loadData.billTo.zipCode }}
            </p>
            <p v-if="loadData.billTo?.country">{{ loadData.billTo.country }}</p>
            <p v-if="loadData.billTo?.phone"><strong>Phone:</strong> {{ loadData.billTo.phone }}</p>
            <p v-if="loadData.billTo?.email"><strong>Email:</strong> {{ loadData.billTo.email }}</p>
            <p v-if="!hasAddress(loadData.billTo)" class="empty-text">No address information</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单行 -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Order Lines ({{ loadData.orderLines?.length || 0 }})</span>
        </div>
      </template>
      <el-table
        :data="loadData.orderLines"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#333' }"
      >
        <el-table-column prop="sequence" label="Sequence" width="100" align="center" />
        <el-table-column prop="orderNo" label="Order NO" width="150" />
        <el-table-column prop="customer" label="Customer" width="150" />
        <el-table-column prop="referenceNo" label="Reference NO" width="150" />
        <el-table-column prop="purchaseOrderNo" label="Purchase Order No." width="160" />
        <el-table-column prop="shipTo" label="Ship TO" width="200" />
        <el-table-column prop="deliveryRequestDate" label="Delivery Request Date" width="180" />
        <el-table-column prop="status" label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewOrder(row)">
              View
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!loadData.orderLines || loadData.orderLines.length === 0" class="empty-data">
        No order lines
      </div>
    </el-card>

    <!-- 备注 -->
    <el-card v-if="loadData.note" class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">Note</span>
        </div>
      </template>
      <div class="note-content">
        {{ loadData.note }}
      </div>
    </el-card>

    <!-- 状态流转对话框 -->
    <StatusTransitionDialog
      v-model="showStatusDialog"
      :current-status="loadData.status || 'NEW'"
      :target-status="targetStatus"
      :load-data="loadData"
      @confirm="handleStatusConfirm"
    />

    <!-- 状态历史对话框 -->
    <el-dialog
      v-model="showHistoryDialog"
      title="Status History"
      width="800px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(history, index) in loadData.statusHistory"
          :key="index"
          :timestamp="formatDateTime(history.changedAt)"
          :type="getHistoryType(history.status)"
        >
          <div class="history-item">
            <div class="history-header">
              <span class="status-label">{{ LOAD_STATUS_MAP[history.status]?.label || history.status }}</span>
              <span class="changed-by">by {{ history.changedBy }}</span>
            </div>
            <div v-if="history.reason" class="history-reason">
              <strong>Reason:</strong> {{ history.reason }}
            </div>
            <div v-if="history.note" class="history-note">
              {{ history.note }}
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <div v-if="!loadData.statusHistory || loadData.statusHistory.length === 0" class="empty-history">
        No status history
      </div>
    </el-dialog>

    <!-- 编辑装载信息对话框 -->
    <el-dialog
      v-model="showEditLoadDetailsDialog"
      title="Edit Load Details"
      width="600px"
    >
      <el-form
        ref="editLoadDetailsFormRef"
        :model="editLoadDetailsForm"
        label-width="160px"
        :rules="editLoadDetailsRules"
      >
        <el-form-item label="Loading Start Time" prop="loadingStartTime">
          <el-date-picker
            v-model="editLoadDetailsForm.loadingStartTime"
            type="datetime"
            placeholder="Select loading start time"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Shipment IDs" prop="shipmentIdsStr">
          <el-input
            v-model="editLoadDetailsForm.shipmentIdsStr"
            placeholder="Enter shipment IDs (comma separated)"
          />
        </el-form-item>
        <el-form-item label="Planned Pallet Qty" prop="plannedPalletQty">
          <el-input-number
            v-model="editLoadDetailsForm.plannedPalletQty"
            :min="0"
            placeholder="Enter planned pallet quantity"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Planned Weight (kg)" prop="plannedWeight">
          <el-input-number
            v-model="editLoadDetailsForm.plannedWeight"
            :min="0"
            :precision="2"
            placeholder="Enter planned weight"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Note" prop="note">
          <el-input
            v-model="editLoadDetailsForm.note"
            type="textarea"
            :rows="3"
            placeholder="Enter note (optional)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditLoadDetailsDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleEditLoadDetailsConfirm" :loading="savingLoadDetails">
          Save
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑BOL对话框 -->
    <el-dialog
      v-model="showEditBOLDialog"
      title="Edit BOL"
      width="600px"
    >
      <el-form
        ref="editBOLFormRef"
        :model="editBOLForm"
        label-width="160px"
        :rules="editBOLRules"
      >
        <el-form-item label="BOL No" prop="bolNo">
          <el-input
            v-model="editBOLForm.bolNo"
            placeholder="Enter BOL number"
          />
        </el-form-item>
        <el-form-item label="Seal No" prop="sealNo">
          <el-input
            v-model="editBOLForm.sealNo"
            placeholder="Enter seal number"
          />
        </el-form-item>
        <el-form-item label="Actual Pallet Qty" prop="actualPalletQty">
          <el-input-number
            v-model="editBOLForm.actualPalletQty"
            :min="0"
            placeholder="Enter actual pallet quantity"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Actual Weight (kg)" prop="actualWeight">
          <el-input-number
            v-model="editBOLForm.actualWeight"
            :min="0"
            :precision="2"
            placeholder="Enter actual weight"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Load Complete Time" prop="loadCompleteTime">
          <el-date-picker
            v-model="editBOLForm.loadCompleteTime"
            type="datetime"
            placeholder="Select load complete time"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Note" prop="note">
          <el-input
            v-model="editBOLForm.note"
            type="textarea"
            :rows="3"
            placeholder="Enter note (optional)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditBOLDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleEditBOLConfirm" :loading="savingBOL">
          Save
        </el-button>
      </template>
    </el-dialog>

    <!-- BOL预览对话框 -->
    <el-dialog
      v-model="showBOLPreviewDialog"
      title="BOL Preview"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <div v-if="bolPreviewUrl" style="height: 80vh; width: 100%;">
        <iframe
          :src="bolPreviewUrl"
          style="width: 100%; height: 100%; border: none;"
          frameborder="0"
        ></iframe>
      </div>
      <div v-else style="text-align: center; padding: 40px;">
        <el-icon class="is-loading" style="font-size: 40px;"><Loading /></el-icon>
        <p style="margin-top: 20px;">Loading BOL...</p>
      </div>
      <template #footer>
        <el-button @click="showBOLPreviewDialog = false">Close</el-button>
        <el-button type="primary" @click="handleDownloadBOL">Download</el-button>
      </template>
    </el-dialog>

    <!-- 上传已签名BOL对话框 -->
    <el-dialog
      v-model="showUploadSignedBOLDialog"
      title="Upload Signed BOL"
      width="500px"
    >
      <el-form
        ref="uploadSignedBOLFormRef"
        :model="uploadSignedBOLForm"
        label-width="120px"
      >
        <el-form-item label="BOL File" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :on-change="handleSignedBOLFileChange"
            :file-list="uploadSignedBOLForm.fileList"
            accept=".pdf,.jpg,.jpeg,.png"
          >
            <el-button type="primary">Select File</el-button>
            <template #tip>
              <div class="el-upload__tip">
                Supported formats: PDF, JPG, PNG (Max 10MB)
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="Note" prop="note">
          <el-input
            v-model="uploadSignedBOLForm.note"
            type="textarea"
            :rows="3"
            placeholder="Enter note (optional)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUploadSignedBOLDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleUploadSignedBOLConfirm" :loading="uploadingSignedBOL">
          Upload
        </el-button>
      </template>
    </el-dialog>

    <!-- 重新指派承运商对话框 -->
    <el-dialog
      v-model="showReassignDialog"
      title="Reassign Carrier"
      width="500px"
    >
      <el-form
        ref="reassignFormRef"
        :model="reassignForm"
        label-width="120px"
        :rules="reassignRules"
      >
        <el-form-item label="Current Carrier">
          <el-input
            :value="loadData.carrier || '-'"
            disabled
          />
        </el-form-item>
        <el-form-item label="New Carrier" prop="carrierId">
          <el-select
            v-model="reassignForm.carrierId"
            placeholder="Select carrier"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in carriers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Driver Name" prop="driverName">
          <el-input
            v-model="reassignForm.driverName"
            placeholder="Enter driver name"
          />
        </el-form-item>
        <el-form-item label="Truck No" prop="truckNo">
          <el-input
            v-model="reassignForm.truckNo"
            placeholder="Enter truck number"
          />
        </el-form-item>
        <el-form-item label="Trailer No" prop="trailerNo">
          <el-input
            v-model="reassignForm.trailerNo"
            placeholder="Enter trailer number"
          />
        </el-form-item>
        <el-form-item label="Note" prop="note">
          <el-input
            v-model="reassignForm.note"
            type="textarea"
            :rows="3"
            placeholder="Enter note (optional)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showReassignDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleReassignConfirm" :loading="reassigning">
          Confirm
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import {
  ArrowLeft,
  Printer,
  Download,
  Edit,
  ArrowDown,
  Loading
} from '@element-plus/icons-vue'
import type { Load, Address, LoadStatusHistory } from './types'
import { LOAD_STATUS_MAP, LOAD_STATUS_TRANSITIONS, STATUS_ACTIONS } from './types'
import StatusTransitionDialog from './components/StatusTransitionDialog.vue'

const route = useRoute()
const router = useRouter()

const loadData = ref<Load>({
  loadNo: '',
  mode: '',
  customer: '',
  carrier: '',
  orderLines: [],
  status: 'NEW',
  shippingRequestIds: [],
  statusHistory: []
})

const showStatusDialog = ref(false)
const targetStatus = ref('')
const showHistoryDialog = ref(false)
const showReassignDialog = ref(false)
const reassigning = ref(false)
const reassignFormRef = ref()
const reassignForm = reactive({
  carrierId: '',
  driverName: '',
  truckNo: '',
  trailerNo: '',
  note: ''
})

const reassignRules = {
  carrierId: [{ required: true, message: 'Please select carrier', trigger: 'change' }],
  driverName: [{ required: true, message: 'Please enter driver name', trigger: 'blur' }]
}

// Mock carriers - TODO: 从API获取
const carriers = ref([
  { label: 'FedEx', value: 'carrier-1' },
  { label: 'UPS', value: 'carrier-2' },
  { label: 'DHL', value: 'carrier-3' },
  { label: 'USPS', value: 'carrier-4' }
])

// 编辑装载信息对话框
const showEditLoadDetailsDialog = ref(false)
const savingLoadDetails = ref(false)
const editLoadDetailsFormRef = ref()
const editLoadDetailsForm = reactive({
  loadingStartTime: '',
  shipmentIdsStr: '',
  plannedPalletQty: 0,
  plannedWeight: 0,
  note: ''
})

const editLoadDetailsRules = {
  loadingStartTime: [{ required: true, message: 'Please select loading start time', trigger: 'change' }]
}

// 编辑BOL对话框
const showEditBOLDialog = ref(false)
const savingBOL = ref(false)
const editBOLFormRef = ref()
const editBOLForm = reactive({
  bolNo: '',
  sealNo: '',
  actualPalletQty: 0,
  actualWeight: 0,
  loadCompleteTime: '',
  note: ''
})

const editBOLRules = {
  bolNo: [{ required: true, message: 'Please enter BOL number', trigger: 'blur' }]
}

// 上传已签名BOL对话框
const showUploadSignedBOLDialog = ref(false)
const uploadingSignedBOL = ref(false)
const uploadSignedBOLFormRef = ref()
const uploadRef = ref()
const uploadSignedBOLForm = reactive({
  fileList: [] as any[],
  note: ''
})

// 计算可用的状态转换
const availableTransitions = computed(() => {
  const currentStatus = loadData.value.status || 'NEW'
  return LOAD_STATUS_TRANSITIONS[currentStatus] || []
})

// 获取状态对应的操作按钮
const getStatusActions = (status: string) => {
  if (!status) return []
  const actions = STATUS_ACTIONS[status] || []
  // 过滤掉不满足条件的操作
  return actions.filter(action => {
    if (action.condition) {
      return action.condition(loadData.value)
    }
    return true
  })
}

// 判断是否可以编辑
const canEdit = computed(() => {
  const status = loadData.value.status
  // NEW: 可以编辑Load基础信息
  // ASSIGNED: 可以修改Carrier/Driver、更新Equipment、设置Appointment
  // LOADING: 可以开始装货、录入明细
  return status === 'NEW' || status === 'ASSIGNED' || status === 'LOADING'
})

// 判断是否可以删除
const canDelete = computed(() => {
  const status = loadData.value.status
  return status === 'NEW' || status === 'CANCELLED'
})

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadLoadDetail(id)
  }
})

const loadLoadDetail = async (id: string) => {
  try {
    // TODO: 调用API获取详情
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    loadData.value = {
      id: id,
      loadNo: 'LD10001',
      mode: 'CUSTOMER_ROUTING',
      customer: 'Customer A',
      carrier: 'FedEx',
      loadType: 'FTL',
      freightTerm: 'Prepaid',
      proNo: 'PRO20001',
      tmsShipmentId: 'TMS30001',
      retailerAuthorization: 'ARN12345',
      appointmentTime: new Date().toISOString(),
      desiredShipDate: new Date().toISOString(),
      longHaul: true,
      freightCost: 2500,
      routingRequestDate: new Date().toISOString(),
      routingReceiptDate: new Date().toISOString(),
      trailerPickUpMode: 'LIVE_LOAD',
      adjustedPalletQty: 20,
      shipFrom: {
        name: 'John Doe',
        company: 'Warehouse Inc.',
        address1: '123 Warehouse St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        phone: '123-456-7890',
        email: 'warehouse@example.com'
      },
      shipTo: {
        name: 'Jane Smith',
        company: 'Retail Store',
        address1: '456 Retail Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '098-765-4321',
        email: 'store@example.com'
      },
      billTo: {
        name: 'Billing Dept',
        company: 'Customer A Corp',
        address1: '789 Corporate Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        phone: '555-123-4567',
        email: 'billing@customera.com'
      },
      note: 'Please handle with care. Fragile items included.',
      orderLines: [
        {
          sequence: 1,
          orderNo: 'ORD10001',
          customer: 'Customer A',
          referenceNo: 'REF001',
          purchaseOrderNo: 'PO001',
          shipTo: 'New York Store',
          deliveryRequestDate: new Date().toISOString(),
          status: 'CONFIRMED'
        }
      ],
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to load load detail:', error)
    ElMessage.error('Failed to load load detail')
  }
}

const goBack = () => {
  router.push('/order/load')
}

const handleEdit = () => {
  router.push(`/order/load/edit/${loadData.value.id}`)
}

const handlePrint = () => {
  ElMessage.info('Print feature coming soon')
}

const handleExport = () => {
  ElMessage.info('Export feature coming soon')
}

// 获取状态操作标签
const getStatusActionLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    'ASSIGNED': 'Assign',
    'CHECKIN': 'Check In',
    'LOADING': 'Start Loading',
    'LOADED': 'Complete Loading',
    'SHIPPED': 'Ship',
    'DELIVERED': 'Deliver',
    'CLOSED': 'Close',
    'CANCELLED': 'Cancel'
  }
  return labelMap[status] || `Change to ${LOAD_STATUS_MAP[status]?.label || status}`
}

// 处理状态转换
const handleStatusTransition = (status: string) => {
  targetStatus.value = status
  showStatusDialog.value = true
}

// 处理状态确认
const handleStatusConfirm = async (updateData: any) => {
  try {
    // 更新状态历史
    const newHistory: LoadStatusHistory = {
      status: updateData.status,
      changedBy: 'Current User', // TODO: 从用户系统获取
      changedAt: new Date().toISOString(),
      reason: updateData.cancellationReason || undefined,
      note: updateData.note || undefined
    }
    
    if (!loadData.value.statusHistory) {
      loadData.value.statusHistory = []
    }
    loadData.value.statusHistory.push(newHistory)
    
    // 更新 Load 数据 - 先更新状态，确保状态立即更新
    const updatedStatus = updateData.status
    
    // 更新所有字段，包括状态
    Object.assign(loadData.value, updateData)
    
    // 确保状态和时间戳正确设置
    loadData.value.status = updatedStatus
    loadData.value.updatedAt = new Date().toISOString()
    
    // 等待 Vue 响应式更新
    await nextTick()
    
    // 根据状态设置特定字段（如果updateData中没有提供）
    if (updateData.status === 'ASSIGNED' && !updateData.dispatchTime) {
      loadData.value.dispatchTime = new Date().toISOString()
    } else if (updateData.status === 'CHECKIN' && !updateData.driverCheckinTime) {
      loadData.value.driverCheckinTime = new Date().toISOString()
    } else if (updateData.status === 'LOADING' && !updateData.loadingStartTime) {
      loadData.value.loadingStartTime = new Date().toISOString()
    } else if (updateData.status === 'LOADED' && !updateData.loadCompleteTime) {
      loadData.value.loadCompleteTime = new Date().toISOString()
    } else if (updateData.status === 'SHIPPED' && !updateData.gateOutTime) {
      loadData.value.gateOutTime = new Date().toISOString()
    } else if (updateData.status === 'DELIVERED' && !updateData.deliveredTime) {
      loadData.value.deliveredTime = new Date().toISOString()
    } else if (updateData.status === 'CLOSED' && !updateData.closeTime) {
      loadData.value.closeTime = new Date().toISOString()
      loadData.value.closedBy = loadData.value.closedBy || 'Current User'
    } else if (updateData.status === 'CANCELLED' && !updateData.cancelTime) {
      loadData.value.cancelTime = new Date().toISOString()
      loadData.value.cancelOperator = loadData.value.cancelOperator || 'Current User'
    }
    
    // TODO: 调用API更新状态
    console.log('Update load status:', updateData)
    console.log('Updated load data:', loadData.value)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success(`Status updated to ${LOAD_STATUS_MAP[updateData.status]?.label || updateData.status}`)
    showStatusDialog.value = false
    
    // 注意：这里不重新加载数据，因为我们已经更新了本地状态
    // 如果需要从服务器重新加载，可以取消下面的注释
    // if (loadData.value.id) {
    //   loadLoadDetail(loadData.value.id)
    // }
  } catch (error) {
    console.error('Failed to update status:', error)
    ElMessage.error('Failed to update status')
  }
}

// 统一处理所有操作
const handleAction = (command: string) => {
  // 处理状态转换操作
  if (command.startsWith('status:')) {
    const targetStatus = command.replace('status:', '')
    handleStatusTransition(targetStatus)
    return
  }
  
  // 处理其他操作
  switch (command) {
    case 'view':
      // 已经在详情页，无需操作
      break
    case 'edit':
      handleEdit()
      break
    case 'delete':
      handleDelete()
      break
    case 'reassign':
      // 重新指派承运商 - 打开对话框
      reassignForm.carrierId = loadData.value.carrierId || ''
      reassignForm.driverName = loadData.value.driverName || ''
      reassignForm.truckNo = loadData.value.truckNo || ''
      reassignForm.trailerNo = loadData.value.trailerNo || ''
      reassignForm.note = ''
      showReassignDialog.value = true
      break
    case 'editDriver':
      // 编辑司机信息
      ElMessage.info('Edit driver info feature coming soon')
      // TODO: 打开编辑司机信息对话框
      break
    case 'uploadGateDoc':
      // 上传进场凭证
      ElMessage.info('Upload gate document feature coming soon')
      // TODO: 打开文件上传对话框
      break
    case 'editLoadDetails':
      // 编辑装载信息 - 打开对话框
      editLoadDetailsForm.loadingStartTime = loadData.value.loadingStartTime || ''
      editLoadDetailsForm.shipmentIdsStr = loadData.value.shipmentIds?.join(', ') || ''
      editLoadDetailsForm.plannedPalletQty = loadData.value.plannedPalletQty || 0
      editLoadDetailsForm.plannedWeight = loadData.value.plannedWeight || 0
      editLoadDetailsForm.note = ''
      showEditLoadDetailsDialog.value = true
      break
    case 'uploadBOL':
      // 上传BOL
      ElMessage.info('Upload BOL feature coming soon')
      // TODO: 打开文件上传对话框
      break
    case 'editBOL':
      // 编辑BOL - 打开对话框
      editBOLForm.bolNo = loadData.value.bolNo || ''
      editBOLForm.sealNo = loadData.value.sealNo || ''
      editBOLForm.actualPalletQty = loadData.value.actualPalletQty || 0
      editBOLForm.actualWeight = loadData.value.actualWeight || 0
      editBOLForm.loadCompleteTime = loadData.value.loadCompleteTime || ''
      editBOLForm.note = ''
      showEditBOLDialog.value = true
      break
    case 'previewBOL':
      // 预览BOL
      handlePreviewBOL()
      break
    case 'downloadBOL':
      // 下载BOL
      handleDownloadBOL()
      break
    case 'uploadSignedBOL':
      // 上传已签名的BOL
      uploadSignedBOLForm.fileList = []
      uploadSignedBOLForm.note = ''
      showUploadSignedBOLDialog.value = true
      break
    case 'uploadSealDoc':
      // 上传封签或文件
      ElMessage.info('Upload seal/document feature coming soon')
      // TODO: 打开文件上传对话框
      break
    case 'uploadPOD':
      // 上传签收单
      ElMessage.info('Upload POD feature coming soon')
      // TODO: 打开文件上传对话框
      break
    case 'editTracking':
      // 编辑跟踪号
      ElMessage.info('Edit tracking info feature coming soon')
      // TODO: 打开编辑跟踪号对话框
      break
    case 'editFreight':
      // 编辑运费信息
      ElMessage.info('Edit freight info feature coming soon')
      // TODO: 打开编辑运费信息对话框
      break
    case 'uploadInvoice':
      // 上传发票
      ElMessage.info('Upload invoice feature coming soon')
      // TODO: 打开文件上传对话框
      break
    case 'exportDocs':
      // 导出凭证
      handleExport()
      break
    case 'reopen':
      // 重新启用
      handleReopen()
      break
    default:
      console.warn(`Unknown command: ${command}`)
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this load?',
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    // TODO: 调用API删除
    ElMessage.success('Load deleted successfully')
    router.push('/order/load')
  } catch {
    // User cancelled
  }
}

const handleReopen = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to reopen this cancelled load?',
      'Confirm Reopen',
      {
        confirmButtonText: 'Reopen',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    // TODO: 调用API重新启用
    ElMessage.success('Load reopened successfully')
    // 刷新数据
    if (loadData.value.id) {
      loadLoadDetail(loadData.value.id)
    }
  } catch {
    // User cancelled
  }
}

const handleMoreAction = async (command: string) => {
  handleAction(command)
}

// 处理编辑装载信息确认
const handleEditLoadDetailsConfirm = async () => {
  try {
    await editLoadDetailsFormRef.value?.validate()
    
    savingLoadDetails.value = true
    
    // TODO: 调用API更新装载信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地数据
    loadData.value.loadingStartTime = editLoadDetailsForm.loadingStartTime
    loadData.value.shipmentIds = editLoadDetailsForm.shipmentIdsStr 
      ? editLoadDetailsForm.shipmentIdsStr.split(',').map(s => s.trim()).filter(s => s)
      : []
    loadData.value.plannedPalletQty = editLoadDetailsForm.plannedPalletQty
    loadData.value.plannedWeight = editLoadDetailsForm.plannedWeight
    loadData.value.updatedAt = new Date().toISOString()
    
    ElMessage.success('Load details updated successfully')
    showEditLoadDetailsDialog.value = false
    
    // 重置表单
    editLoadDetailsForm.note = ''
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    savingLoadDetails.value = false
  }
}

// 处理编辑BOL确认
const handleEditBOLConfirm = async () => {
  try {
    await editBOLFormRef.value?.validate()
    
    savingBOL.value = true
    
    // TODO: 调用API更新BOL信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地数据
    loadData.value.bolNo = editBOLForm.bolNo
    loadData.value.sealNo = editBOLForm.sealNo
    loadData.value.actualPalletQty = editBOLForm.actualPalletQty
    loadData.value.actualWeight = editBOLForm.actualWeight
    loadData.value.loadCompleteTime = editBOLForm.loadCompleteTime
    loadData.value.updatedAt = new Date().toISOString()
    
    ElMessage.success('BOL updated successfully')
    showEditBOLDialog.value = false
    
    // 重置表单
    editBOLForm.note = ''
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    savingBOL.value = false
  }
}

// 预览BOL
const handlePreviewBOL = async () => {
  if (!loadData.value.id) {
    ElMessage.warning('Load ID not found')
    return
  }
  
  // 先打开对话框
  showBOLPreviewDialog.value = true
  bolPreviewUrl.value = ''
  
  try {
    // 调用API获取BOL预览URL
    // 注意：对于blob类型，需要使用axios直接调用
    const axios = (await import('axios')).default
    const response = await axios({
      url: `/api/load/${loadData.value.id}/bol/preview`,
      method: 'get',
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
    
    // 创建blob URL用于预览
    const blob = response.data
    const url = window.URL.createObjectURL(blob)
    bolPreviewUrl.value = url
    
    // 对话框关闭时清理URL
    const unwatch = watch(showBOLPreviewDialog, (newVal) => {
      if (!newVal && bolPreviewUrl.value) {
        window.URL.revokeObjectURL(bolPreviewUrl.value)
        bolPreviewUrl.value = ''
        unwatch()
      }
    })
  } catch (error: any) {
    console.error('Failed to preview BOL:', error)
    // 如果API调用失败，尝试直接使用URL
    if (loadData.value.signedBOLFileUrl) {
      bolPreviewUrl.value = loadData.value.signedBOLFileUrl
    } else {
      ElMessage.error('Failed to preview BOL. Please ensure BOL is generated first.')
      showBOLPreviewDialog.value = false
    }
  }
}

// 下载BOL
const handleDownloadBOL = async () => {
  if (!loadData.value.id) {
    ElMessage.warning('Load ID not found')
    return
  }
  
  try {
    // 调用API下载BOL文件
    // 注意：对于blob类型，需要使用axios直接调用
    const axios = (await import('axios')).default
    const response = await axios({
      url: `/api/load/${loadData.value.id}/bol/download`,
      method: 'get',
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
    
    // 创建blob并下载
    const blob = response.data
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `BOL_${loadData.value.loadNo}_${loadData.value.bolNo || 'draft'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理URL对象
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 100)
    
    ElMessage.success('BOL downloaded successfully')
  } catch (error: any) {
    console.error('Failed to download BOL:', error)
    // 如果API调用失败，尝试直接使用URL
    if (loadData.value.signedBOLFileUrl) {
      const link = document.createElement('a')
      link.href = loadData.value.signedBOLFileUrl
      link.download = `BOL_${loadData.value.loadNo}_${loadData.value.bolNo || 'draft'}.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      ElMessage.success('BOL download started')
    } else {
      ElMessage.error('Failed to download BOL. Please ensure BOL is generated first.')
    }
  }
}

// 处理已签名BOL文件选择
const handleSignedBOLFileChange = (file: any) => {
  uploadSignedBOLForm.fileList = [file]
}

// 处理上传已签名BOL确认
const handleUploadSignedBOLConfirm = async () => {
  if (!uploadSignedBOLForm.fileList || uploadSignedBOLForm.fileList.length === 0) {
    ElMessage.warning('Please select a file to upload')
    return
  }
  
  uploadingSignedBOL.value = true
  
  try {
    // TODO: 调用API上传文件
    const file = uploadSignedBOLForm.fileList[0].raw || uploadSignedBOLForm.fileList[0]
    
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地数据
    // TODO: 从API响应中获取文件URL
    loadData.value.signedBOLFileUrl = `https://example.com/bol/${loadData.value.loadNo}_signed.pdf`
    loadData.value.updatedAt = new Date().toISOString()
    
    ElMessage.success('Signed BOL uploaded successfully')
    showUploadSignedBOLDialog.value = false
    
    // 重置表单
    uploadSignedBOLForm.fileList = []
    uploadSignedBOLForm.note = ''
    uploadRef.value?.clearFiles()
  } catch (error) {
    console.error('Upload failed:', error)
    ElMessage.error('Failed to upload signed BOL')
  } finally {
    uploadingSignedBOL.value = false
  }
}

const handleReassignConfirm = async () => {
  try {
    await reassignFormRef.value?.validate()
    
    reassigning.value = true
    
    // TODO: 调用API更新承运商信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地数据
    loadData.value.carrierId = reassignForm.carrierId
    loadData.value.driverName = reassignForm.driverName
    loadData.value.truckNo = reassignForm.truckNo
    loadData.value.trailerNo = reassignForm.trailerNo
    
    // 更新carrier显示名称
    const selectedCarrier = carriers.value.find(c => c.value === reassignForm.carrierId)
    if (selectedCarrier) {
      loadData.value.carrier = selectedCarrier.label
    }
    
    // 更新状态历史
    if (!loadData.value.statusHistory) {
      loadData.value.statusHistory = []
    }
    loadData.value.statusHistory.push({
      status: loadData.value.status || 'ASSIGNED',
      changedBy: 'Current User',
      changedAt: new Date().toISOString(),
      note: `Carrier reassigned${reassignForm.note ? ': ' + reassignForm.note : ''}`
    })
    
    loadData.value.updatedAt = new Date().toISOString()
    
    ElMessage.success('Carrier reassigned successfully')
    showReassignDialog.value = false
    
    // 重置表单
    reassignForm.carrierId = ''
    reassignForm.driverName = ''
    reassignForm.truckNo = ''
    reassignForm.trailerNo = ''
    reassignForm.note = ''
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    reassigning.value = false
  }
}

const getHistoryType = (status: string): any => {
  const typeMap: Record<string, any> = {
    'NEW': 'primary',
    'ASSIGNED': 'primary',
    'CHECKIN': 'primary',
    'LOADING': 'warning',
    'LOADED': 'success',
    'SHIPPED': 'success',
    'DELIVERED': 'success',
    'CLOSED': 'success',
    'CANCELLED': 'danger'
  }
  return typeMap[status] || 'primary'
}

const viewOrder = (row: any) => {
  ElMessage.info(`View order: ${row.orderNo}`)
}

const hasAddress = (address?: Address) => {
  if (!address) return false
  return !!(address.name || address.company || address.address1 || address.city)
}

const getStatusType = (status: string): any => {
  const colorMap: Record<string, any> = {
    'NEW': 'info',
    'ASSIGNED': 'primary',
    'CHECKIN': 'primary',
    'LOADING': 'warning',
    'LOADED': 'success',
    'SHIPPED': 'success',
    'DELIVERED': 'success',
    'CLOSED': 'success',
    'CANCELLED': 'danger'
  }
  return colorMap[status] || 'info'
}

const getOrderStatusType = (status: string): any => {
  const statusMap: Record<string, any> = {
    'DRAFT': 'info',
    'CONFIRMED': 'success',
    'PROCESSING': 'warning',
    'SHIPPED': 'success',
    'DELIVERED': 'success',
    'CANCELLED': 'danger'
  }
  return statusMap[status] || 'info'
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
</script>

<style scoped lang="scss">
.load-detail-page {
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
    gap: 12px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
    }
  }

  .header-right {
    display: flex;
    gap: 8px;
  }
}

.info-card {
  margin-bottom: 16px;
  background-color: #1e2227 !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  :deep(.el-descriptions__label) {
    color: #8b949e !important;
  }

  :deep(.el-descriptions__content) {
    color: #fff !important;
  }

  :deep(.el-descriptions__cell) {
    border-color: rgba(255, 255, 255, 0.05) !important;
  }
}

.address-info {
  p {
    margin: 8px 0;
    line-height: 1.6;
    color: #8b949e;
  }

  .empty-text {
    color: #666;
    font-style: italic;
  }

  strong {
    color: #fff;
  }
}

.note-content {
  line-height: 1.8;
  color: #8b949e;
  white-space: pre-wrap;
}

.empty-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
}

.history-item {
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .status-label {
      font-weight: 600;
      color: #fff;
      font-size: 14px;
    }
    
    .changed-by {
      color: #8b949e;
      font-size: 12px;
    }
  }
  
  .history-reason {
    margin-top: 8px;
    color: #8b949e;
    font-size: 13px;
  }
  
  .history-note {
    margin-top: 8px;
    color: #8b949e;
    font-size: 13px;
    font-style: italic;
  }
}

.empty-history {
  text-align: center;
  padding: 40px;
  color: #8b949e;
}

:deep(.el-timeline) {
  .el-timeline-item__timestamp {
    color: #8b949e !important;
  }
  
  .el-timeline-item__content {
    color: #fff !important;
  }
}
</style>

