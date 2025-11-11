<template>
  <div class="load-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>Load Management</h1>
        <el-tooltip content="Help">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="header-right">
        <div class="action-buttons">
          <el-dropdown trigger="click" @command="handleExportCommand">
            <el-button type="primary">
              Export
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="excel">Export to Excel</el-dropdown-item>
                <el-dropdown-item command="csv">Export to CSV</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            Create Load
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索和过滤器区域 -->
    <search-form @search="handleSearch" @reset="handleReset" />

    <!-- 状态标签页和工具栏 -->
    <div class="status-toolbar">
      <div class="status-tabs">
        <div class="tab-list">
          <div
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-item"
            :class="{ active: activeStatus === tab.value }"
            @click="handleTabChange(tab.value)"
          >
            <div class="tab-content">
              <span class="tab-label">{{ tab.label }}</span>
              <span class="count-tag" :class="tab.tagType">{{ tab.count }}</span>
            </div>
            <div class="tab-line" />
          </div>
        </div>
      </div>

      <div class="toolbar-actions">
        <el-tooltip content="Refresh" placement="top">
          <el-button class="action-btn" @click="refreshTable">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="Customize Columns" placement="top">
          <el-button class="action-btn" @click="showColumnSettings = true">
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 批量操作工具栏 -->
    <div v-if="selectedRows.length > 0" class="selection-toolbar">
      <div class="selection-info">
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
        >
          <span class="selection-text">{{ selectedRows.length }} selected</span>
        </el-checkbox>
      </div>
      <div class="action-buttons">
        <el-button-group>
          <el-button @click="handleBatchAction('updateStatus')">
            <el-icon><Edit /></el-icon>
            Update Status
          </el-button>
          <el-button @click="handleBatchAction('export')">
            <el-icon><Download /></el-icon>
            Export Selected
          </el-button>
          <el-button @click="handleBatchAction('delete')">
            <el-icon><Delete /></el-icon>
            Delete
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="filteredTableData"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#333' }"
        @selection-change="handleSelectionChange"
        :scrollbar-always-on="true"
      >
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="loadNo" label="Load No." min-width="140" fixed>
          <template #default="{ row }">
            <el-link type="primary" @click="handleView(row)">{{ row.loadNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ LOAD_STATUS_MAP[row.status]?.label || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customer" label="Customer" min-width="150" />
        <el-table-column prop="carrier" label="Carrier" min-width="150" />
        <el-table-column prop="loadType" label="Load Type" min-width="120" />
        <el-table-column prop="shipFrom" label="Ship From" min-width="200">
          <template #default="{ row }">
            <div v-if="row.shipFrom">
              <div v-if="row.shipFrom.city && row.shipFrom.state">
                {{ row.shipFrom.city }}, {{ row.shipFrom.state }}
              </div>
              <div v-else-if="row.shipFrom.address1">
                {{ row.shipFrom.address1 }}
              </div>
              <span v-else>-</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="shipTo" label="Ship To" min-width="200">
          <template #default="{ row }">
            <div v-if="row.shipTo">
              <div v-if="row.shipTo.city && row.shipTo.state">
                {{ row.shipTo.city }}, {{ row.shipTo.state }}
              </div>
              <div v-else-if="row.shipTo.address1">
                {{ row.shipTo.address1 }}
              </div>
              <span v-else>-</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="appointmentTime" label="Appointment Time" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.appointmentTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="gateInTime" label="Check-In Time" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.gateInTime || row.driverCheckinTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="loadingStartTime" label="Load Start Time" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.loadingStartTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="loadCompleteTime" label="Load Complete Time" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.loadCompleteTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="gateOutTime" label="Shipped Time" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.gateOutTime || row.departureTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="deliveredTime" label="Delivered Time" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.deliveredTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="Assignee / Created By" min-width="150">
          <template #default="{ row }">
            {{ row.createdBy || row.closedBy || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="freightCost" label="Freight Cost" min-width="120" align="right">
          <template #default="{ row }">
            <span v-if="row.freightCost || row.finalFreightCost">
              ${{ (row.finalFreightCost || row.freightCost || 0).toFixed(2) }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="bolNo" label="Master BOL No." min-width="150">
          <template #default="{ row }">
            {{ row.bolNo || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="Last Update Time" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="(cmd) => handleAction(cmd, row)">
              <el-button type="primary" link size="small">
                Actions <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- 根据状态显示对应的操作按钮 -->
                  <template v-if="getStatusActions(row.status, row).length > 0">
                    <el-dropdown-item
                      v-for="(action, index) in getStatusActions(row.status, row)"
                      :key="`${action.command}-${index}`"
                      :command="action.command"
                      :divided="action.divided"
                      :disabled="action.condition && !action.condition(row)"
                    >
                      {{ action.label }}
                    </el-dropdown-item>
                  </template>
                  <!-- 如果没有配置操作，显示默认操作 -->
                  <template v-else>
                    <el-dropdown-item command="view">View</el-dropdown-item>
                    <el-dropdown-item command="viewHistory">View Status History</el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 列设置对话框 -->
    <el-dialog
      v-model="showColumnSettings"
      title="Customize Columns"
      width="500px"
    >
      <div class="column-settings">
        <el-checkbox-group v-model="visibleColumns">
          <el-checkbox label="loadNo">Load No.</el-checkbox>
          <el-checkbox label="status">Status</el-checkbox>
          <el-checkbox label="customer">Customer</el-checkbox>
          <el-checkbox label="carrier">Carrier</el-checkbox>
          <el-checkbox label="loadType">Load Type</el-checkbox>
          <el-checkbox label="shipFrom">Ship From</el-checkbox>
          <el-checkbox label="shipTo">Ship To</el-checkbox>
          <el-checkbox label="appointmentTime">Appointment Time</el-checkbox>
          <el-checkbox label="gateInTime">Check-In Time</el-checkbox>
          <el-checkbox label="loadingStartTime">Load Start Time</el-checkbox>
          <el-checkbox label="loadCompleteTime">Load Complete Time</el-checkbox>
          <el-checkbox label="gateOutTime">Shipped Time</el-checkbox>
          <el-checkbox label="deliveredTime">Delivered Time</el-checkbox>
          <el-checkbox label="createdBy">Assignee / Created By</el-checkbox>
          <el-checkbox label="freightCost">Freight Cost</el-checkbox>
          <el-checkbox label="bolNo">Master BOL No.</el-checkbox>
          <el-checkbox label="updatedAt">Last Update Time</el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="showColumnSettings = false">Cancel</el-button>
        <el-button type="primary" @click="saveColumnSettings">Save</el-button>
      </template>
    </el-dialog>

    <!-- 状态流转对话框 -->
    <StatusTransitionDialog
      v-model="showStatusDialog"
      :current-status="currentLoad?.status || 'NEW'"
      :target-status="targetStatus"
      :load-data="currentLoad || ({} as Load)"
      @confirm="handleStatusConfirm"
    />

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
        <el-button type="primary" @click="() => handleDownloadBOL(currentLoad!)">Download</el-button>
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
            :value="currentLoad?.carrier || '-'"
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  QuestionFilled,
  ArrowDown,
  Plus,
  Refresh,
  Grid,
  Edit,
  Download,
  Delete,
  Loading
} from '@element-plus/icons-vue'
import SearchForm from './components/SearchForm.vue'
import StatusTransitionDialog from './components/StatusTransitionDialog.vue'
import type { Load } from './types'
import { LOAD_STATUS_MAP, LOAD_STATUS_TRANSITIONS, STATUS_ACTIONS } from './types'

const router = useRouter()
const loading = ref(false)
const showColumnSettings = ref(false)
const activeStatus = ref('all')
const selectedRows = ref<Load[]>([])
const showStatusDialog = ref(false)
const currentLoad = ref<Load | null>(null)
const targetStatus = ref('')
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
const showBOLPreviewDialog = ref(false)
const bolPreviewUrl = ref('')

const showUploadSignedBOLDialog = ref(false)
const uploadingSignedBOL = ref(false)
const uploadSignedBOLFormRef = ref()
const uploadRef = ref()
const uploadSignedBOLForm = reactive({
  fileList: [] as any[],
  note: ''
})

// Mock carriers - TODO: 从API获取
const carriers = ref([
  { label: 'FedEx', value: 'carrier-1' },
  { label: 'UPS', value: 'carrier-2' },
  { label: 'DHL', value: 'carrier-3' },
  { label: 'USPS', value: 'carrier-4' }
])
const visibleColumns = ref<string[]>([
  'loadNo', 'status', 'customer', 'carrier', 'loadType', 'shipFrom', 'shipTo',
  'appointmentTime', 'gateInTime', 'loadingStartTime', 'loadCompleteTime',
  'gateOutTime', 'deliveredTime', 'createdBy', 'freightCost', 'bolNo', 'updatedAt'
])

// 标签页配置
const tabs = ref([
  { label: 'All', value: 'all', count: 0, tagType: 'info' },
  { label: 'New', value: 'NEW', count: 0, tagType: 'info' },
  { label: 'Assigned', value: 'ASSIGNED', count: 0, tagType: 'primary' },
  { label: 'Check In', value: 'CHECKIN', count: 0, tagType: 'primary' },
  { label: 'Loading', value: 'LOADING', count: 0, tagType: 'warning' },
  { label: 'Loaded', value: 'LOADED', count: 0, tagType: 'success' },
  { label: 'Shipped', value: 'SHIPPED', count: 0, tagType: 'success' },
  { label: 'Delivered', value: 'DELIVERED', count: 0, tagType: 'success' },
  { label: 'Closed', value: 'CLOSED', count: 0, tagType: 'success' },
  { label: 'Cancelled', value: 'CANCELLED', count: 0, tagType: 'danger' }
])

// 表格数据
const tableData = ref<Load[]>([])

// 根据activeStatus过滤表格数据
const filteredTableData = computed(() => {
  if (activeStatus.value === 'all') {
    return tableData.value
  }
  return tableData.value.filter(item => item.status === activeStatus.value)
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 搜索参数
const searchParams = ref<any>({})

// 选择相关计算属性
const isAllSelected = computed({
  get: () => selectedRows.value.length === filteredTableData.value.length && filteredTableData.value.length > 0,
  set: (val) => {
    if (val) {
      selectedRows.value = [...filteredTableData.value]
    } else {
      selectedRows.value = []
    }
  }
})

const isIndeterminate = computed(
  () => selectedRows.value.length > 0 && selectedRows.value.length < filteredTableData.value.length
)

onMounted(() => {
  loadData()
  loadStatistics()
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取数据
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    tableData.value = generateMockData()
    pagination.total = 100
  } catch (error) {
    console.error('Load data failed:', error)
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStatistics = async () => {
  // TODO: 调用API获取统计数据
  tabs.value[0].count = 100 // All
  tabs.value[1].count = 25  // New
  tabs.value[2].count = 15  // Assigned
  tabs.value[3].count = 10  // Check In
  tabs.value[4].count = 12  // Loading
  tabs.value[5].count = 20  // Loaded
  tabs.value[6].count = 25  // Shipped
  tabs.value[7].count = 8   // Delivered
  tabs.value[8].count = 5   // Closed
  tabs.value[9].count = 3   // Cancelled
}

// 生成模拟数据
const generateMockData = (): Load[] => {
  const statuses = ['NEW', 'ASSIGNED', 'CHECKIN', 'LOADING', 'LOADED', 'SHIPPED', 'DELIVERED', 'CLOSED', 'CANCELLED']
  const modes = ['CUSTOMER_ROUTING', 'PREPAID', 'COLLECT']
  const loadTypes = ['LTL', 'FTL', 'PARCEL']
  const customers = ['Customer A', 'Customer B', 'Customer C']
  const carriers = ['FedEx', 'UPS', 'DHL', 'USPS']
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']

  return Array.from({ length: 20 }, (_, i) => ({
    id: `load-${i + 1}`,
    loadNo: `LD${(10000 + i).toString()}`,
    mode: modes[i % modes.length],
    customer: customers[i % customers.length],
    carrier: carriers[i % carriers.length],
    carrierId: `carrier-${(i % carriers.length) + 1}`,
    loadType: loadTypes[i % loadTypes.length],
    proNo: `PRO${(20000 + i).toString()}`,
    tmsShipmentId: `TMS${(30000 + i).toString()}`,
    status: statuses[i % statuses.length],
    appointmentTime: new Date(Date.now() + i * 86400000).toISOString(),
    desiredShipDate: new Date(Date.now() + i * 86400000).toISOString(),
    shipFromCity: cities[i % cities.length],
    shipToCity: cities[(i + 1) % cities.length],
    freightCost: 1000 + i * 100,
    orderCount: 5 + (i % 10),
    orderLines: [],
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }))
}

// 事件处理
const handleCreate = () => {
  router.push('/order/load/create')
}

const handleView = (row: Load) => {
  router.push(`/order/load/${row.id}`)
}

const handleEdit = (row: Load) => {
  router.push(`/order/load/edit/${row.id}`)
}

// 获取可用的状态转换
const getAvailableTransitions = (status: string) => {
  if (!status) return []
  const transitions = LOAD_STATUS_TRANSITIONS[status] || []
  return transitions
}

// 获取状态对应的操作按钮
const getStatusActions = (status: string, row: Load) => {
  if (!status) return []
  const actions = STATUS_ACTIONS[status] || []
  // 过滤掉不满足条件的操作
  return actions.filter(action => {
    if (action.condition) {
      return action.condition(row)
    }
    return true
  })
}

// 判断是否可以编辑
const canEdit = (status: string) => {
  // NEW: 可以编辑Load基础信息
  // ASSIGNED: 可以修改Carrier/Driver、更新Equipment、设置Appointment
  // LOADING: 可以开始装货、录入明细
  return status === 'NEW' || status === 'ASSIGNED' || status === 'LOADING'
}

// 判断是否可以删除
const canDelete = (status: string) => {
  return status === 'NEW' || status === 'CANCELLED'
}

// 处理状态转换
const handleStatusTransition = (row: Load, status: string) => {
  currentLoad.value = row
  targetStatus.value = status
  showStatusDialog.value = true
}

// 处理状态确认
const handleStatusConfirm = async (updateData: any) => {
  try {
    if (!currentLoad.value) return
    
    // TODO: 调用API更新状态
    console.log('Update load status:', updateData)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地数据
    Object.assign(currentLoad.value, updateData)
    currentLoad.value.status = updateData.status
    currentLoad.value.updatedAt = new Date().toISOString()
    
    // 更新状态历史
    if (!currentLoad.value.statusHistory) {
      currentLoad.value.statusHistory = []
    }
    currentLoad.value.statusHistory.push({
      status: updateData.status,
      changedBy: 'Current User',
      changedAt: new Date().toISOString(),
      reason: updateData.cancellationReason || undefined,
      note: updateData.note || undefined
    })
    
    ElMessage.success(`Status updated to ${LOAD_STATUS_MAP[updateData.status]?.label || updateData.status}`)
    showStatusDialog.value = false
    
    // 刷新列表
    loadData()
    loadStatistics()
  } catch (error) {
    console.error('Failed to update status:', error)
    ElMessage.error('Failed to update status')
  }
}

// 统一处理所有操作
const handleAction = (command: string, row: Load) => {
  // 处理状态转换操作
  if (command.startsWith('status:')) {
    const targetStatus = command.replace('status:', '')
    handleStatusTransition(row, targetStatus)
    return
  }
  
  // 处理其他操作
  switch (command) {
    case 'view':
      handleView(row)
      break
    case 'edit':
      handleEdit(row)
      break
    case 'delete':
      handleDelete(row)
      break
    case 'reassign':
      // 重新指派承运商 - 打开对话框
      currentLoad.value = row
      reassignForm.carrierId = row.carrierId || ''
      reassignForm.driverName = row.driverName || ''
      reassignForm.truckNo = row.truckNo || ''
      reassignForm.trailerNo = row.trailerNo || ''
      reassignForm.note = ''
      showReassignDialog.value = true
      break
    case 'editDriver':
      // 编辑司机信息
      ElMessage.info(`Edit driver info for load: ${row.loadNo}`)
      // TODO: 实现编辑司机信息逻辑
      break
    case 'uploadGateDoc':
      // 上传进场凭证
      ElMessage.info(`Upload gate document for load: ${row.loadNo}`)
      // TODO: 实现上传文件逻辑
      break
    case 'editLoadDetails':
      // 编辑装载信息 - 打开对话框
      currentLoad.value = row
      editLoadDetailsForm.loadingStartTime = row.loadingStartTime || ''
      editLoadDetailsForm.shipmentIdsStr = row.shipmentIds?.join(', ') || ''
      editLoadDetailsForm.plannedPalletQty = row.plannedPalletQty || 0
      editLoadDetailsForm.plannedWeight = row.plannedWeight || 0
      editLoadDetailsForm.note = ''
      showEditLoadDetailsDialog.value = true
      break
    case 'uploadBOL':
      // 上传BOL
      ElMessage.info(`Upload BOL for load: ${row.loadNo}`)
      // TODO: 实现上传BOL逻辑
      break
    case 'editBOL':
      // 编辑BOL - 打开对话框
      currentLoad.value = row
      editBOLForm.bolNo = row.bolNo || ''
      editBOLForm.sealNo = row.sealNo || ''
      editBOLForm.actualPalletQty = row.actualPalletQty || 0
      editBOLForm.actualWeight = row.actualWeight || 0
      editBOLForm.loadCompleteTime = row.loadCompleteTime || ''
      editBOLForm.note = ''
      showEditBOLDialog.value = true
      break
    case 'previewBOL':
      // 预览BOL
      handlePreviewBOL(row)
      break
    case 'downloadBOL':
      // 下载BOL
      handleDownloadBOL(row)
      break
    case 'uploadSignedBOL':
      // 上传已签名的BOL
      currentLoad.value = row
      showUploadSignedBOLDialog.value = true
      break
    case 'uploadSealDoc':
      // 上传封签或文件
      ElMessage.info(`Upload seal/document for load: ${row.loadNo}`)
      // TODO: 实现上传文件逻辑
      break
    case 'uploadPOD':
      // 上传签收单
      ElMessage.info(`Upload POD for load: ${row.loadNo}`)
      // TODO: 实现上传POD逻辑
      break
    case 'editTracking':
      // 编辑跟踪号
      ElMessage.info(`Edit tracking info for load: ${row.loadNo}`)
      // TODO: 实现编辑跟踪号逻辑
      break
    case 'editFreight':
      // 编辑运费信息
      ElMessage.info(`Edit freight info for load: ${row.loadNo}`)
      // TODO: 实现编辑运费信息逻辑
      break
    case 'uploadInvoice':
      // 上传发票
      ElMessage.info(`Upload invoice for load: ${row.loadNo}`)
      // TODO: 实现上传发票逻辑
      break
    case 'exportDocs':
      // 导出凭证
      ElMessage.info(`Export BOL/POD for load: ${row.loadNo}`)
      // TODO: 实现导出逻辑
      break
    case 'reopen':
      // 重新启用
      ElMessage.info(`Reopen load: ${row.loadNo}`)
      // TODO: 实现重新启用逻辑
      break
    case 'viewHistory':
      // 跳转到详情页查看历史
      router.push(`/order/load/${row.id}`)
      break
    default:
      console.warn(`Unknown command: ${command}`)
  }
}

const handleDelete = async (row: Load) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete load ${row.loadNo}?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    // TODO: 调用API删除
    ElMessage.success('Load deleted successfully')
    loadData()
  } catch {
    // User cancelled
  }
}

const handleTabChange = (status: string) => {
  activeStatus.value = status
  pagination.page = 1
  loadData()
}

const handleSearch = (params: any) => {
  searchParams.value = params
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchParams.value = {}
  pagination.page = 1
  loadData()
}

const handleExportCommand = (command: string) => {
  ElMessage.info(`Export as ${command.toUpperCase()}`)
}

const refreshTable = () => {
  loadData()
  loadStatistics()
}

const handleSelectionChange = (selection: Load[]) => {
  selectedRows.value = selection
}

const handleSelectAll = (val: boolean) => {
  isAllSelected.value = val
}

const handleBatchAction = async (action: string) => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('Please select at least one load')
    return
  }

  switch (action) {
    case 'updateStatus':
      ElMessage.info('Update status feature coming soon')
      break
    case 'export':
      ElMessage.info('Export selected feature coming soon')
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to delete ${selectedRows.value.length} load(s)?`,
          'Confirm Delete',
          {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
        // TODO: 调用API批量删除
        ElMessage.success('Loads deleted successfully')
        selectedRows.value = []
        loadData()
      } catch {
        // User cancelled
      }
      break
  }
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadData()
}

const saveColumnSettings = () => {
  // TODO: 保存列设置到本地存储或用户配置
  showColumnSettings.value = false
  ElMessage.success('Column settings saved')
}

// 处理编辑装载信息确认
const handleEditLoadDetailsConfirm = async () => {
  try {
    await editLoadDetailsFormRef.value?.validate()
    
    if (!currentLoad.value) return
    
    savingLoadDetails.value = true
    
    // TODO: 调用API更新装载信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地数据
    if (currentLoad.value) {
      currentLoad.value.loadingStartTime = editLoadDetailsForm.loadingStartTime
      currentLoad.value.shipmentIds = editLoadDetailsForm.shipmentIdsStr 
        ? editLoadDetailsForm.shipmentIdsStr.split(',').map(s => s.trim()).filter(s => s)
        : []
      currentLoad.value.plannedPalletQty = editLoadDetailsForm.plannedPalletQty
      currentLoad.value.plannedWeight = editLoadDetailsForm.plannedWeight
      currentLoad.value.updatedAt = new Date().toISOString()
    }
    
    ElMessage.success('Load details updated successfully')
    showEditLoadDetailsDialog.value = false
    
    // 重置表单
    editLoadDetailsForm.note = ''
    
    // 刷新列表
    loadData()
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
    
    if (!currentLoad.value) return
    
    savingBOL.value = true
    
    // TODO: 调用API更新BOL信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地数据
    if (currentLoad.value) {
      currentLoad.value.bolNo = editBOLForm.bolNo
      currentLoad.value.sealNo = editBOLForm.sealNo
      currentLoad.value.actualPalletQty = editBOLForm.actualPalletQty
      currentLoad.value.actualWeight = editBOLForm.actualWeight
      currentLoad.value.loadCompleteTime = editBOLForm.loadCompleteTime
      currentLoad.value.updatedAt = new Date().toISOString()
    }
    
    ElMessage.success('BOL updated successfully')
    showEditBOLDialog.value = false
    
    // 重置表单
    editBOLForm.note = ''
    
    // 刷新列表
    loadData()
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    savingBOL.value = false
  }
}

// 预览BOL
const handlePreviewBOL = async (row: Load) => {
  if (!row.id) {
    ElMessage.warning('Load ID not found')
    return
  }
  
  // 保存当前Load用于下载
  currentLoad.value = row
  
  // 先打开对话框
  showBOLPreviewDialog.value = true
  bolPreviewUrl.value = ''
  
  try {
    // 调用API获取BOL预览URL
    // 注意：对于blob类型，需要使用axios直接调用
    const axios = (await import('axios')).default
    const response = await axios({
      url: `/api/load/${row.id}/bol/preview`,
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
    if (row.signedBOLFileUrl) {
      bolPreviewUrl.value = row.signedBOLFileUrl
    } else {
      ElMessage.error('Failed to preview BOL. Please ensure BOL is generated first.')
      showBOLPreviewDialog.value = false
    }
  }
}

// 下载BOL
const handleDownloadBOL = async (row: Load) => {
  if (!row.id) {
    ElMessage.warning('Load ID not found')
    return
  }
  
  try {
    // 调用API下载BOL文件
    // 注意：对于blob类型，需要使用axios直接调用
    const axios = (await import('axios')).default
    const response = await axios({
      url: `/api/load/${row.id}/bol/download`,
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
    link.download = `BOL_${row.loadNo}_${row.bolNo || 'draft'}.pdf`
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
    if (row.signedBOLFileUrl) {
      const link = document.createElement('a')
      link.href = row.signedBOLFileUrl
      link.download = `BOL_${row.loadNo}_${row.bolNo || 'draft'}.pdf`
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
  
  if (!currentLoad.value) return
  
  uploadingSignedBOL.value = true
  
  try {
    // TODO: 调用API上传文件
    const file = uploadSignedBOLForm.fileList[0].raw || uploadSignedBOLForm.fileList[0]
    
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地数据
    if (currentLoad.value) {
      // TODO: 从API响应中获取文件URL
      currentLoad.value.signedBOLFileUrl = `https://example.com/bol/${currentLoad.value.loadNo}_signed.pdf`
      currentLoad.value.updatedAt = new Date().toISOString()
    }
    
    ElMessage.success('Signed BOL uploaded successfully')
    showUploadSignedBOLDialog.value = false
    
    // 重置表单
    uploadSignedBOLForm.fileList = []
    uploadSignedBOLForm.note = ''
    uploadRef.value?.clearFiles()
    
    // 刷新列表
    loadData()
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
    
    if (!currentLoad.value) return
    
    reassigning.value = true
    
    // TODO: 调用API更新承运商信息
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新本地数据
    if (currentLoad.value) {
      currentLoad.value.carrierId = reassignForm.carrierId
      currentLoad.value.driverName = reassignForm.driverName
      currentLoad.value.truckNo = reassignForm.truckNo
      currentLoad.value.trailerNo = reassignForm.trailerNo
      
      // 更新carrier显示名称
      const selectedCarrier = carriers.value.find(c => c.value === reassignForm.carrierId)
      if (selectedCarrier) {
        currentLoad.value.carrier = selectedCarrier.label
      }
      
      // 更新状态历史
      if (!currentLoad.value.statusHistory) {
        currentLoad.value.statusHistory = []
      }
      currentLoad.value.statusHistory.push({
        status: currentLoad.value.status || 'ASSIGNED',
        changedBy: 'Current User',
        changedAt: new Date().toISOString(),
        note: `Carrier reassigned${reassignForm.note ? ': ' + reassignForm.note : ''}`
      })
      
      currentLoad.value.updatedAt = new Date().toISOString()
    }
    
    ElMessage.success('Carrier reassigned successfully')
    showReassignDialog.value = false
    
    // 重置表单
    reassignForm.carrierId = ''
    reassignForm.driverName = ''
    reassignForm.truckNo = ''
    reassignForm.trailerNo = ''
    reassignForm.note = ''
    
    // 刷新列表
    loadData()
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    reassigning.value = false
  }
}

// 工具函数
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

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped lang="scss">
.load-list-page {
  padding: 24px;
  background-color: #1a1d21;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

    .help-icon {
      font-size: 18px;
      color: #8b949e;
      cursor: pointer;

      &:hover {
        color: #7c4dff;
      }
    }
  }

  .header-right {
    .action-buttons {
      display: flex;
      gap: 12px;
    }
  }
}

.status-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 16px;

  .status-tabs {
    flex: 1;

    .tab-list {
      display: flex;
      gap: 8px;

      .tab-item {
        padding: 8px 16px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s;
        position: relative;

        .tab-content {
          display: flex;
          align-items: center;
          gap: 8px;

          .tab-label {
            font-size: 14px;
            color: #8b949e;
            font-weight: 500;
          }

          .count-tag {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            background-color: rgba(255, 255, 255, 0.05);
            color: #8b949e;

            &.info { 
              background-color: rgba(144, 147, 153, 0.1);
              color: #909399;
            }
            &.warning { 
              background-color: rgba(230, 162, 60, 0.1);
              color: #e6a23c;
            }
            &.primary { 
              background-color: rgba(124, 77, 255, 0.1);
              color: #7c4dff;
            }
            &.success { 
              background-color: rgba(103, 194, 58, 0.1);
              color: #67c23a;
            }
            &.danger { 
              background-color: rgba(245, 108, 108, 0.1);
              color: #f56c6c;
            }
          }
        }

        .tab-line {
          height: 2px;
          background-color: transparent;
          margin-top: 4px;
          transition: all 0.3s;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.04);
        }

        &.active {
          .tab-label {
            color: #7c4dff;
            font-weight: 600;
          }

          .tab-line {
            background-color: #7c4dff;
          }
        }
      }
    }
  }

  .toolbar-actions {
    display: flex;
    gap: 8px;

    .action-btn {
      padding: 8px;
      border-radius: 4px;
      background-color: #2d3139;
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #8b949e;

      &:hover {
        background-color: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

.selection-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: rgba(124, 77, 255, 0.1);
  border: 1px solid rgba(124, 77, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 16px;

  .selection-info {
    .selection-text {
      margin-left: 8px;
      font-weight: 500;
      color: #7c4dff;
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }
}

.table-container {
  background-color: #1e2227;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  overflow: hidden;

  :deep(.el-table) {
    background-color: transparent !important;
    border: none !important;
    width: 100% !important;

    .el-table__header-wrapper,
    .el-table__body-wrapper {
      width: 100% !important;
    }

    th.el-table__cell {
      background-color: #2d3139 !important;
      color: #8b949e !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
      padding: 12px 8px !important;
    }

    td.el-table__cell {
      background-color: transparent !important;
      color: #8b949e !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
      padding: 12px 8px !important;
    }

    .el-button {
      padding: 4px 8px;
    }

    .el-link {
      color: #7c4dff;

      &:hover {
        color: #9670ff;
      }
    }

    // 确保固定列正常工作
    .el-table__fixed,
    .el-table__fixed-right {
      background-color: #1e2227 !important;
    }

    // 水平滚动条样式
    .el-scrollbar__bar.is-horizontal {
      height: 8px;
      
      .el-scrollbar__thumb {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 4px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.column-settings {
  :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

</style>
