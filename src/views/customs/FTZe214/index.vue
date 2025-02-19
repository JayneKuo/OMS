<template>
  <div class="ftze214-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>FTZ e-214</h1>
        <p class="subtitle">Foreign Trade Zone Admission/Status Designation and Activity Permit</p>
      </div>
      <div class="header-actions">
        <div class="batch-actions" v-if="selectedRows.length > 0">
          <template v-for="action in getAvailableBatchActions()" :key="action.action">
            <el-button
              :type="action.type"
              :style="{ backgroundColor: action.color }"
              @click="handleBatchAction(action.action)"
            >
              {{ action.label }}
            </el-button>
          </template>
        </div>
        <el-button type="primary" class="add-btn" @click="handleCreate">
          <el-icon class="icon"><Plus /></el-icon>
          New Entry
        </el-button>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-title">SEARCH BY</div>
      <div class="search-form">
        <!-- Main Search Row -->
        <div class="search-row">
          <div class="custom-input">
            <input 
              v-model="searchForm.admissionNo" 
              placeholder="Admission Number"
              @input="handleInput('admissionNo', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.admissionNo" @click="clearInput('admissionNo')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="custom-select" v-click-outside="() => handleClickOutside('admissionType')">
            <div 
              class="select-trigger" 
              :class="{ 'is-focus': showAdmissionTypeDropdown }"
            >
              <input
                v-model="admissionTypeSearch"
                :placeholder="searchForm.admissionType ? ADMISSION_TYPES.find(t => t.value === searchForm.admissionType)?.label : 'Admission Type'"
                @input="handleSearchInput('admissionType')"
                @click.stop="toggleDropdown('admissionType')"
                @focus="toggleDropdown('admissionType')"
              />
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="admissionTypeSearch || searchForm.admissionType" 
                  @click.stop="clearSelect('admissionType')"
                >
                  <CircleClose />
                </el-icon>
                <el-icon :class="{ 'is-reverse': showAdmissionTypeDropdown }"><ArrowDown /></el-icon>
              </div>
            </div>
            <div 
              class="select-dropdown" 
              v-show="showAdmissionTypeDropdown"
              @click.stop
            >
              <div 
                v-for="type in filteredAdmissionTypes"
                :key="type.value"
                class="select-option" 
                @click.stop="handleSelectOption('admissionType', type.value)"
                :class="{ active: searchForm.admissionType === type.value }"
              >
                {{ type.label }}
              </div>
            </div>
          </div>
          <div class="custom-select" v-click-outside="() => handleClickOutside('portOfEntry')">
            <div 
              class="select-trigger" 
              :class="{ 'is-focus': showPortOfEntryDropdown }"
            >
              <input
                v-model="portOfEntrySearch"
                :placeholder="searchForm.portOfEntry ? PORT_OF_ENTRY.find(p => p.value === searchForm.portOfEntry)?.label : 'Port of Entry'"
                @input="handleSearchInput('portOfEntry')"
                @click.stop="toggleDropdown('portOfEntry')"
                @focus="toggleDropdown('portOfEntry')"
              />
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="portOfEntrySearch || searchForm.portOfEntry" 
                  @click.stop="clearSelect('portOfEntry')"
                >
                  <CircleClose />
                </el-icon>
                <el-icon :class="{ 'is-reverse': showPortOfEntryDropdown }"><ArrowDown /></el-icon>
              </div>
            </div>
            <div 
              class="select-dropdown" 
              v-show="showPortOfEntryDropdown"
              @click.stop
            >
              <div 
                v-for="port in filteredPortOfEntryOptions"
                :key="port.value"
                class="select-option" 
                @click.stop="handleSelectOption('portOfEntry', port.value)"
                :class="{ active: searchForm.portOfEntry === port.value }"
              >
                {{ port.label }}
              </div>
            </div>
          </div>
          <div class="custom-input">
            <input 
              v-model="searchForm.ftzNo" 
              placeholder="FTZ Number"
              @input="handleInput('ftzNo', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.ftzNo" @click="clearInput('ftzNo')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="action-btns">
            <button 
              class="custom-btn filter-btn" 
              :class="{ active: showAdvancedSearch }" 
              @click="toggleAdvancedSearch"
            >
              <el-icon><Filter /></el-icon>
            </button>
            <button 
              class="custom-btn search-btn" 
              @click="handleSearch"
            >
              <el-icon><Search /></el-icon>
            </button>
          </div>
        </div>

        <!-- Advanced Search Row -->
        <div class="search-row" v-show="showAdvancedSearch">
          <div class="custom-input">
            <input 
              v-model="searchForm.importerName" 
              placeholder="Importer Name"
              @input="handleInput('importerName', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.importerName" @click="clearInput('importerName')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="custom-input">
            <input 
              v-model="searchForm.operatorName" 
              placeholder="Operator Name"
              @input="handleInput('operatorName', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.operatorName" @click="clearInput('operatorName')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="custom-select" v-click-outside="() => handleClickOutside('status')">
            <div 
              class="select-trigger" 
              :class="{ 'is-focus': showStatusDropdown }"
            >
              <input
                v-model="statusSearch"
                :placeholder="searchForm.status ? STATUS_CONFIG[searchForm.status as StatusType]?.label : 'Status'"
                @input="handleSearchInput('status')"
                @click.stop="toggleDropdown('status')"
                @focus="toggleDropdown('status')"
              />
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="statusSearch || searchForm.status" 
                  @click.stop="clearSelect('status')"
                >
                  <CircleClose />
                </el-icon>
                <el-icon :class="{ 'is-reverse': showStatusDropdown }"><ArrowDown /></el-icon>
              </div>
            </div>
            <div 
              class="select-dropdown" 
              v-show="showStatusDropdown"
              @click.stop
            >
              <div 
                v-for="[key, status] in Object.entries(STATUS_CONFIG)"
                :key="key"
                class="select-option" 
                @click.stop="handleSelectOption('status', key)"
                :class="{ active: searchForm.status === key }"
              >
                <span class="status-dot" :style="{ backgroundColor: status.style.color }"></span>
                {{ status.label }}
              </div>
            </div>
          </div>
          <div class="custom-date-range">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              :popper-class="'custom-date-picker'"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
              :size="'default'"
              :unlink-panels="true"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-section">
      <el-table 
        ref="tableRef"
        :data="filteredTableData" 
        class="data-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="admissionNo" label="Admission Number" min-width="150">
          <template #default="{ row }">
            <span class="link-text" @click="handleViewDetails(row)">{{ row.admissionNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="admissionType" label="Admission Type" min-width="150">
          <template #default="{ row }">
            {{ ADMISSION_TYPES.find(t => t.value === row.admissionType)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="ftzNo" label="FTZ Number" min-width="120" />
        <el-table-column prop="portOfEntry" label="Port of Entry" min-width="150">
          <template #default="{ row }">
            {{ PORT_OF_ENTRY.find(p => p.value === row.portOfEntry)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="importerName" label="Importer Name" min-width="180" />
        <el-table-column prop="operatorName" label="Operator Name" min-width="180" />
        <el-table-column prop="admissionDate" label="Estimated Entry Date" min-width="150" />
        <el-table-column prop="status" label="Status" min-width="140">
          <template #default="{ row }">
            <div 
              class="status-tag" 
              :style="{ 
                backgroundColor: STATUS_CONFIG[row.status as StatusType].style.color + '20',
                color: STATUS_CONFIG[row.status as StatusType].style.color
              }"
            >
              <span 
                class="status-dot" 
                :style="{ backgroundColor: STATUS_CONFIG[row.status as StatusType].style.color }"
              ></span>
              {{ STATUS_CONFIG[row.status as StatusType].label }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredTotal"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Add PTT Form Dialog -->
    <PTTFormDialog
      v-model:visible="showPTTDialog"
      :e214-data="selectedE214Data"
      @submit="handlePTTSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Plus,
  Search,
  Filter,
  ArrowDown,
  CircleClose,
  More,
  Warning
} from '@element-plus/icons-vue'
import type { TableItem, SearchFormState, StatusType } from './types'
import type { AdmissionType, PortOfEntry } from './types/form'
import { STATUS_CONFIG } from './types'
import { PORT_OF_ENTRY, ADMISSION_TYPES } from './types/form'
import { useTableData } from './composables/useTableData'
import { useSearch } from './composables/useSearch'
import { vClickOutside } from '@/directives/clickOutside'
import PTTFormDialog from './components/PTTFormDialog.vue'

const router = useRouter()
const { tableData, deleteRecord, total, batchUpdateStatus } = useTableData()
const {
  searchForm,
  pagination,
  showAdvancedSearch,
  filteredTableData,
  handleSearch,
  handleInput,
  clearInput,
  toggleAdvancedSearch,
  handlePageChange,
  handleSizeChange,
  handleDateChange,
  filteredTotal
} = useSearch()

// 下拉框状态
const showAdmissionTypeDropdown = ref(false)
const showStatusDropdown = ref(false)
const showPortOfEntryDropdown = ref(false)

// 搜索输入
const admissionTypeSearch = ref('')
const statusSearch = ref('')
const portOfEntrySearch = ref('')

// 过滤选项
const filteredAdmissionTypes = computed(() => {
  return ADMISSION_TYPES.filter(type =>
    type.label.toLowerCase().includes(admissionTypeSearch.value.toLowerCase())
  )
})

const filteredStatusOptions = computed(() => {
  return Object.entries(STATUS_CONFIG).filter(([key, status]) =>
    status.label.toLowerCase().includes(statusSearch.value.toLowerCase())
  ).map(([key, status]) => ({
    value: key,
    label: status.label,
    style: status.style
  }))
})

const filteredPortOfEntryOptions = computed(() => {
  return PORT_OF_ENTRY.filter(port =>
    port.label.toLowerCase().includes(portOfEntrySearch.value.toLowerCase())
  )
})

// 选中行数据
const selectedRows = ref<TableItem[]>([])

const tableRef = ref()

// 处理选择变化
const handleSelectionChange = (rows: TableItem[]) => {
  if (rows.length > 1) {
    // 只保留最后选择的一条记录
    const lastSelected = rows[rows.length - 1]
    selectedRows.value = [lastSelected]
  } else {
    selectedRows.value = rows
  }
}

// 获取可用的批量操作
const getAvailableBatchActions = () => {
  const uniqueStatuses = [...new Set(selectedRows.value.map(row => row.status.toLowerCase()))]
  
  if (uniqueStatuses.length === 1) {
    const status = uniqueStatuses[0]
    switch (status) {
      case 'pending':
        return [
          { action: 'edit', label: 'Edit', type: 'warning', color: '#FACC15' },
          { action: 'cancel', label: 'Cancel', type: 'danger', color: '#DC2626' },
          { action: 'submit', label: 'Submit', type: 'primary', color: '#3B82F6' }
        ]
      case 'processing':
        return [
          { action: 'approve', label: 'Approve', type: 'success', color: '#10B981' },
          { action: 'reject', label: 'Reject', type: 'danger', color: '#DC2626' }
        ]
      case 'cbp_approved':
        return [
          { action: 'generate_ptt', label: 'Generate PTT', type: 'success', color: '#10B981' },
          { action: 'arrived_at_ftz', label: 'Arrived at FTZ', type: 'success', color: '#10B981' }
        ]
      case 'ptt_processing':
        return [
          { action: 'approve_ptt', label: 'Approve PTT', type: 'success', color: '#10B981' },
          { action: 'reject_ptt', label: 'Reject PTT', type: 'danger', color: '#DC2626' }
        ]
      case 'ptt_issued':
        return [
          { action: 'confirm_ptt', label: 'Confirm PTT', type: 'success', color: '#10B981' },
          { action: 'reject_ptt', label: 'Reject PTT', type: 'danger', color: '#DC2626' }
        ]
      case 'ptt_rejected':
        return [
          { action: 'edit_ptt', label: 'Edit PTT', type: 'warning', color: '#FACC15' },
          { action: 'cancel_ptt', label: 'Cancel PTT', type: 'info', color: '#9CA3AF' }
        ]
      case 'ptt_failed':
        return [
          { action: 'edit_ptt', label: 'Edit PTT', type: 'warning', color: '#FACC15' },
          { action: 'cancel_ptt', label: 'Cancel PTT', type: 'info', color: '#9CA3AF' }
        ]
      case 'arrived_at_ftz':
        return [
          { action: 'confirm_arrival', label: 'Confirm Arrival', type: 'primary', color: '#3B82F6' }
        ]
      case 'failed':
        return [
          { action: 'edit', label: 'Edit', type: 'warning', color: '#FACC15' },
          { action: 'cancel', label: 'Cancel', type: 'info', color: '#9CA3AF' }
        ]
      case 'completed':
      case 'cancelled':
        return []
    }
  }
  
  return []
}

// 处理批量操作
const handleBatchAction = async (action: string) => {
  if (!selectedRows.value.length) {
    ElMessage.warning('Please select records to perform the operation')
    return
  }

  try {
    const ids = selectedRows.value.map(row => row.id)
    switch (action) {
      case 'view':
        // 实现批量查看逻辑
        break
      case 'edit':
        if (selectedRows.value.length === 1) {
          router.push(`/customs/ftze214/edit/${selectedRows.value[0].id}`)
        }
        break
      case 'cancel':
        await ElMessageBox.confirm(
          'After cancellation, this e214 application cannot be resubmitted. Are you sure you want to cancel this e214 application?',
          'Cancel e214 Application',
          {
            confirmButtonText: 'Confirm Cancel',
            cancelButtonText: 'Back',
            type: 'warning'
          }
        )
        await batchUpdateStatus(ids, 'cancelled')
        selectedRows.value = []
        tableRef.value?.clearSelection()
        await handleSearch()
        ElMessage.success('e214 application has been cancelled')
        break
      case 'submit':
        await ElMessageBox.confirm(
          'After submission, the application will be sent to CBP for review and cannot be modified during the review period. Are you sure you want to submit this e214 application?',
          'Submit e214 Application',
          {
            confirmButtonText: 'Confirm Submit',
            cancelButtonText: 'Back',
            type: 'warning'
          }
        )
        await batchUpdateStatus(ids, 'processing')
        selectedRows.value = []
        tableRef.value?.clearSelection()
        await handleSearch()
        ElMessage.success('e214 application has been submitted to CBP for review')
        break
      case 'approve':
        await ElMessageBox.confirm(
          'Approving this application will allow the cargo to proceed with PTT or direct arrival at FTZ. Are you sure you want to approve this e214 application?',
          'Approve e214 Application',
          {
            confirmButtonText: 'Confirm Approval',
            cancelButtonText: 'Back',
            type: 'warning'
          }
        )
        await batchUpdateStatus(ids, 'cbp_approved')
        selectedRows.value = []
        tableRef.value?.clearSelection()
        await handleSearch()
        ElMessage.success('e214 application has been approved')
        break
      case 'reject':
        try {
          const { value: reason } = await ElMessageBox.prompt(
            'Please provide a detailed reason for rejecting this e214 application. This information will be sent to the applicant.',
            'Reject e214 Application',
            {
              confirmButtonText: 'Confirm Rejection',
              cancelButtonText: 'Back',
              type: 'warning',
              inputType: 'textarea',
              inputPlaceholder: 'Enter rejection reason (required)...',
              inputValidator: (value) => {
                if (!value) {
                  return 'Rejection reason is required'
                }
                return true
              },
              inputErrorMessage: 'Rejection reason is required'
            }
          )
          if (reason) {
            await batchUpdateStatus(ids, 'failed')
            selectedRows.value = []
            tableRef.value?.clearSelection()
            await handleSearch()
            ElMessage.success('e214 application has been rejected')
          }
        } catch (error) {
          if (error) {
            ElMessage.error('Operation cancelled')
          }
        }
        break
      // PTT相关操作
      case 'generate_ptt':
        if (selectedRows.value.length === 1) {
          const row = selectedRows.value[0]
          selectedE214Data.value = {
            admissionNumber: row.admissionNo,
            ftzNumber: row.ftzNo,
            portOfEntry: row.portOfEntry,
            carrierScac: row.carrierScac || undefined,
            containerNumber: row.containerNumber || undefined,
            transferType: row.transferType || undefined,
            inBondNumber: row.inBondNumber || undefined,
            estimatedArrivalDate: row.estimatedArrivalDate || undefined
          }
          showPTTDialog.value = true
        } else {
          ElMessage.warning('Please select one record to generate PTT')
        }
        break
      case 'approve_ptt':
        try {
          await ElMessageBox.confirm(
            'After approval, the PTT will be issued and the cargo can proceed with transfer. Are you sure you want to approve this PTT?',
            'Approve PTT',
            {
              confirmButtonText: 'Confirm Approval',
              cancelButtonText: 'Back',
              type: 'warning'
            }
          )
          await batchUpdateStatus(ids, 'ptt_issued')
          await handleSearch()
          ElMessage.success('PTT has been approved')
          // 操作完成后再清空选择
          selectedRows.value = []
          tableRef.value?.clearSelection()
        } catch (error) {
          console.error('PTT approval failed:', error)
          ElMessage.error('Operation failed, please try again')
        }
        break
      case 'reject_ptt':
        try {
          const { value: reason } = await ElMessageBox.prompt(
            'Please provide a detailed reason for rejecting this PTT. This information will be sent to the applicant.',
            'Reject PTT',
            {
              confirmButtonText: 'Confirm Rejection',
              cancelButtonText: 'Back',
              type: 'warning',
              inputType: 'textarea',
              inputPlaceholder: 'Enter rejection reason (required)...',
              inputValidator: (value) => {
                if (!value) {
                  return 'Rejection reason is required'
                }
                return true
              },
              inputErrorMessage: 'Rejection reason is required'
            }
          )
          if (reason) {
            await batchUpdateStatus(ids, 'ptt_rejected')
            await handleSearch()
            ElMessage.success('PTT has been rejected')
            // 操作完成后再清空选择
            selectedRows.value = []
            tableRef.value?.clearSelection()
          }
        } catch (error) {
          if (error !== 'cancel') {
            console.error('PTT rejection failed:', error)
            ElMessage.error('Operation failed, please try again')
          }
        }
        break
      case 'resubmit_ptt':
        await ElMessageBox.confirm(
          `Are you sure you want to ${getAvailableBatchActions().find(a => a.action === action)?.label.toLowerCase()} the selected record(s)?`,
          'Confirm',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        await batchUpdateStatus(ids, 'ptt_processing')
        selectedRows.value = []
        tableRef.value?.clearSelection()
        await handleSearch()
        ElMessage.success('PTT resubmitted successfully')
        break
      case 'edit_ptt':
        if (selectedRows.value.length === 1) {
          const row = selectedRows.value[0]
          selectedE214Data.value = {
            admissionNumber: row.admissionNo,
            ftzNumber: row.ftzNo,
            portOfEntry: row.portOfEntry,
            carrierScac: row.carrierScac || '',
            containerNumber: row.containerNumber || '',
            transferType: row.transferType || '',
            inBondNumber: row.inBondNumber || '',
            estimatedArrivalDate: row.estimatedArrivalDate || ''
          }
          showPTTDialog.value = true
        } else {
          ElMessage.warning('Please select one record to edit PTT')
        }
        break
      case 'cancel_ptt':
        await ElMessageBox.confirm(
          'After cancellation, this PTT application will be cancelled and cannot be resubmitted. Are you sure you want to cancel this PTT application?',
          'Cancel PTT Application',
          {
            confirmButtonText: 'Confirm Cancel',
            cancelButtonText: 'Back',
            type: 'warning'
          }
        )
        await batchUpdateStatus(ids, 'cbp_approved')
        selectedRows.value = []
        tableRef.value?.clearSelection()
        await handleSearch()
        ElMessage.success('PTT application has been cancelled')
        break
      case 'confirm_arrival':
        await ElMessageBox.confirm(
          'After confirming the arrival, this application will be marked as completed and cannot be modified. Please ensure:\n\n1. All cargo has arrived at FTZ\n2. All documents have been verified\n3. Physical inventory check has been completed',
          'Confirm Cargo Arrival',
          {
            confirmButtonText: 'Confirm Arrival',
            cancelButtonText: 'Back',
            type: 'warning'
          }
        )
        await batchUpdateStatus(ids, 'completed')
        selectedRows.value = []
        tableRef.value?.clearSelection()
        await handleSearch()
        ElMessage.success('Cargo arrival has been confirmed and the e214 application is now completed')
        break
      case 'confirm_ptt':
        await ElMessageBox.confirm(
          'After confirmation, the PTT will be marked as arrived at FTZ. Are you sure you want to confirm this PTT?',
          'Confirm PTT',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Back',
            type: 'warning'
          }
        )
        await batchUpdateStatus(ids, 'arrived_at_ftz')
        selectedRows.value = []
        tableRef.value?.clearSelection()
        await handleSearch()
        ElMessage.success('PTT has been confirmed and marked as arrived at FTZ')
        break
    }
    
    // 清空选择
    selectedRows.value = []
  } catch (error) {
    console.error('Batch operation failed:', error)
    ElMessage.error('Operation failed, please try again')
  }
}

// 事件处理
const handleClickOutside = (type: string) => {
  switch (type) {
    case 'admissionType':
      showAdmissionTypeDropdown.value = false
      break
    case 'status':
      showStatusDropdown.value = false
      break
    case 'portOfEntry':
      showPortOfEntryDropdown.value = false
      break
  }
}

const toggleDropdown = (type: string) => {
  switch (type) {
    case 'admissionType':
      showAdmissionTypeDropdown.value = !showAdmissionTypeDropdown.value
      showStatusDropdown.value = false
      showPortOfEntryDropdown.value = false
      break
    case 'status':
      showStatusDropdown.value = !showStatusDropdown.value
      showAdmissionTypeDropdown.value = false
      showPortOfEntryDropdown.value = false
      break
    case 'portOfEntry':
      showPortOfEntryDropdown.value = !showPortOfEntryDropdown.value
      showAdmissionTypeDropdown.value = false
      showStatusDropdown.value = false
      break
  }
}

const handleSearchInput = (type: string) => {
  switch (type) {
    case 'admissionType':
      showAdmissionTypeDropdown.value = true
      break
    case 'status':
      showStatusDropdown.value = true
      break
    case 'portOfEntry':
      showPortOfEntryDropdown.value = true
      break
  }
}

const handleSelectOption = (field: string, value: string) => {
  switch (field) {
    case 'admissionType':
      searchForm.value.admissionType = value
      admissionTypeSearch.value = ''
      showAdmissionTypeDropdown.value = false
      break
    case 'status':
      searchForm.value.status = value
      statusSearch.value = ''
      showStatusDropdown.value = false
      break
    case 'portOfEntry':
      searchForm.value.portOfEntry = value
      portOfEntrySearch.value = ''
      showPortOfEntryDropdown.value = false
      break
  }
}

const clearSelect = (type: string) => {
  switch (type) {
    case 'admissionType':
      searchForm.value.admissionType = ''
      admissionTypeSearch.value = ''
      break
    case 'status':
      searchForm.value.status = ''
      statusSearch.value = ''
      break
    case 'portOfEntry':
      searchForm.value.portOfEntry = ''
      portOfEntrySearch.value = ''
      break
  }
}

const handleCreate = () => {
  router.push('/customs/ftze214/create')
}

const handleViewDetails = (row: TableItem) => {
  router.push(`/customs/ftze214/view/${row.id}`)
}

// Add PTT dialog state
const showPTTDialog = ref(false)
const selectedE214Data = ref({
  admissionNumber: '',
  ftzNumber: '',
  portOfEntry: '',
  carrierScac: undefined,
  containerNumber: undefined,
  transferType: undefined,
  inBondNumber: undefined,
  estimatedArrivalDate: undefined
})

// Handle PTT form submission
const handlePTTSubmit = async (pttData: any) => {
  try {
    const ids = selectedRows.value.map(row => row.id)
    await batchUpdateStatus(ids, 'ptt_processing')
    selectedRows.value = []
    tableRef.value?.clearSelection()
    await handleSearch()
    ElMessage.success('PTT generation request has been submitted')
  } catch (error) {
    ElMessage.error('PTT generation failed')
  }
}
</script>

<style lang="scss" scoped>
.ftze214-page {
  padding: 32px;
  min-height: 100vh;
  background: var(--el-bg-color-darker);

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .header-content {
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
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-left: auto;

      .batch-actions {
        display: flex;
        align-items: center;
        gap: 12px;

        .multi-select-warning {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #FACC15;
          font-size: 14px;

          .el-icon {
            font-size: 16px;
          }
        }

        .el-button {
          padding: 8px 16px;
          font-size: 14px;
          border: none;
          height: 40px;
          
          &:hover {
            opacity: 0.9;
          }
        }
      }

      .add-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 20px;
        font-weight: 500;
        background: #6366f1;
        border: none;
        border-radius: 4px;
        color: #fff;
        transition: all 0.3s;
        margin-left: auto;
        
        &:hover {
          background: #818cf8;
        }
        
        .icon {
          font-size: 16px;
        }
      }
    }
  }

  .search-section {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;

    .search-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--el-text-color-secondary);
      margin-bottom: 16px;
      text-transform: uppercase;
    }

    .search-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .search-row {
      display: flex;
      gap: 16px;
    }
  }

  .custom-input {
    position: relative;
    flex: 1;

    input {
      width: 100%;
      height: 40px;
      padding: 0 32px 0 12px;
      border: 1px solid transparent;
      border-radius: 4px;
      background: rgba(30, 35, 45, 0.6);
      color: var(--el-text-color-primary);
      font-size: 14px;
      transition: all 0.3s;

      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
        background: rgba(35, 40, 50, 0.7);
      }

      &:focus {
        border-color: var(--el-color-primary);
        background: rgba(35, 40, 50, 0.7);
        outline: none;
      }

      &::placeholder {
        color: var(--el-text-color-placeholder);
      }
    }

    .clear-icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--el-text-color-secondary);
      cursor: pointer;
      font-size: 16px;
      opacity: 0;
      transition: all 0.3s;

      &:hover {
        color: var(--el-text-color-primary);
      }
    }

    &:hover .clear-icon {
      opacity: 1;
    }
  }

  .custom-select {
    position: relative;
    flex: 1;

    .select-trigger {
      position: relative;
      width: 100%;
      height: 40px;
      border: 1px solid transparent;
      border-radius: 4px;
      background: rgba(30, 35, 45, 0.6);
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
        background: rgba(35, 40, 50, 0.7);
      }

      &.is-focus {
        border-color: var(--el-color-primary);
        background: rgba(35, 40, 50, 0.7);
      }

      input {
        width: 100%;
        height: 100%;
        padding: 0 64px 0 12px;
        border: none;
        background: transparent;
        color: var(--el-text-color-primary);
        font-size: 14px;
        cursor: pointer;

        &:focus {
          outline: none;
        }

        &::placeholder {
          color: var(--el-text-color-placeholder);
        }
      }

      .select-icons {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: 4px;

        .clear-icon {
          color: var(--el-text-color-secondary);
          cursor: pointer;
          font-size: 16px;
          padding: 2px;
          border-radius: 50%;
          transition: all 0.3s;
          opacity: 0;

          &:hover {
            color: var(--el-text-color-primary);
          }
        }

        .el-icon {
          font-size: 16px;
          color: var(--el-text-color-secondary);
          transition: transform 0.3s;

          &.is-reverse {
            transform: rotate(180deg);
          }
        }
      }

      &:hover .clear-icon {
        opacity: 1;
      }
    }

    .select-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      width: 100%;
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color-darker);
      border-radius: 4px;
      box-shadow: var(--el-box-shadow-dark);
      z-index: 10;
      max-height: 200px;
      overflow-y: auto;

      .select-option {
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--el-text-color-regular);
        transition: all 0.3s;

        &:hover {
          background: rgba(35, 40, 50, 0.7);
        }

        &.active {
          color: var(--el-color-primary);
          background: rgba(35, 40, 50, 0.7);
          font-weight: bold;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      }
    }
  }

  .action-btns {
    display: flex;
    gap: 8px;

    .custom-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid transparent;
      border-radius: 4px;
      background: rgba(30, 35, 45, 0.6);
      color: var(--el-text-color-secondary);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
        background: rgba(35, 40, 50, 0.7);
        color: var(--el-text-color-primary);
      }

      &.filter-btn {
        &.active {
          background: #6366f1;
          color: #fff;

          &:hover {
            background: #818cf8;
          }
        }

        &:hover {
          color: #6366f1;
        }
      }

      &.search-btn {
        background: #6366f1;
        color: #fff;

        &:hover {
          background: #818cf8;
        }
      }

      .el-icon {
        font-size: 16px;
      }
    }
  }

  .custom-date-range {
    flex: 2;

    :deep(.el-input__wrapper) {
      background: rgba(30, 35, 45, 0.6) !important;
      box-shadow: none !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 4px !important;
      height: 40px !important;
      padding: 0 12px !important;
      
      &:hover {
        border-color: rgba(255, 255, 255, 0.15) !important;
        background: rgba(35, 40, 50, 0.7) !important;
      }
      
      &.is-focus {
        border-color: rgba(255, 255, 255, 0.2) !important;
        background: rgba(35, 40, 50, 0.7) !important;
      }
      
      .el-input__inner {
        color: #fff !important;
        font-size: 14px !important;
        height: 40px !important;
        line-height: 40px !important;
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.35) !important;
        }
      }

      .el-range-separator {
        color: rgba(255, 255, 255, 0.35) !important;
        line-height: 40px !important;
      }
    }
  }

  .table-section {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 24px;
    margin-top: 24px;

    :deep(.el-table) {
      background: transparent;
      
      th.el-table__cell {
        background: var(--el-bg-color);
        border-bottom: 1px solid var(--el-border-color-darker);
        color: var(--el-text-color-secondary);
        font-weight: 600;
        padding: 12px 0;
      }

      td.el-table__cell {
        background: transparent;
        border-bottom: 1px solid var(--el-border-color-darker);
        color: var(--el-text-color-regular);
        padding: 12px 0;
      }

      .cell {
        padding: 0 16px;
      }
    }

    .link-text {
      color: #6366f1;
      cursor: pointer;
      transition: color 0.3s;
      
      &:hover {
        color: #818cf8;
        text-decoration: none;
      }
    }

    .status-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1;

      &.draft {
        background: var(--el-color-info-light-9);
        color: var(--el-color-info);
        .status-dot { background-color: var(--el-color-info); }
      }

      &.submitted {
        background: var(--el-color-warning-light-9);
        color: var(--el-color-warning);
        .status-dot { background-color: var(--el-color-warning); }
      }

      &.approved {
        background: var(--el-color-success-light-9);
        color: var(--el-color-success);
        .status-dot { background-color: var(--el-color-success); }
      }

      &.rejected {
        background: var(--el-color-danger-light-9);
        color: var(--el-color-danger);
        .status-dot { background-color: var(--el-color-danger); }
      }

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
    }

    .action-column {
      .action-trigger {
        cursor: pointer;
        color: var(--el-text-color-secondary);
        transition: color 0.3s;
        
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .pagination-section {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;

    :deep(.el-pagination) {
      .el-pagination__total {
        color: var(--el-text-color-secondary);
        margin-right: 16px;
      }

      .el-pagination__sizes {
        margin-right: 16px;

        .el-input__wrapper {
          background: rgba(30, 35, 45, 0.6);
          box-shadow: none;
          border: 1px solid transparent;

          &:hover {
            border-color: rgba(255, 255, 255, 0.15);
            background: rgba(35, 40, 50, 0.7);
          }

          &.is-focus {
            border-color: var(--el-color-primary);
            background: rgba(35, 40, 50, 0.7);
          }
        }

        .el-input__inner {
          color: var(--el-text-color-primary);
        }
      }

      button {
        background: rgba(30, 35, 45, 0.6);
        border: 1px solid transparent;
        color: var(--el-text-color-regular);

        &:hover:not(:disabled) {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(35, 40, 50, 0.7);
          color: #6366f1;
        }

        &:disabled {
          background: rgba(30, 35, 45, 0.6);
          color: var(--el-text-color-placeholder);
        }
      }

      .el-pager li {
        background: rgba(30, 35, 45, 0.6);
        border: 1px solid transparent;
        color: var(--el-text-color-regular);
        margin: 0 4px;
        min-width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover:not(.is-active) {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(35, 40, 50, 0.7);
          color: #6366f1;
        }

        &.is-active {
          background: #6366f1;
          color: #fff;
        }
      }
    }
  }
}

:deep(.el-dropdown-menu) {
  padding: 4px 0;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-darker);
  box-shadow: var(--el-box-shadow-dark);
  
  .el-dropdown-menu__item {
    padding: 8px 16px;
    font-size: 14px;
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(35, 40, 50, 0.7);
      color: var(--el-color-primary);
    }

    &.el-dropdown-menu__item--divided {
      border-top: 1px solid var(--el-border-color-darker);
      margin: 4px 0;
    }

    &.danger {
      color: var(--el-color-danger);
      
      &:hover {
        background: var(--el-color-danger-light-9);
      }
    }
  }
}

:deep(.custom-date-picker) {
  background: rgba(30, 35, 45, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  border-radius: 4px !important;
  padding: 8px !important;

  .el-picker-panel__body {
    border: none !important;
  }

  .el-date-range-picker__header {
    margin-bottom: 0;
    color: rgba(255, 255, 255, 0.85);
  }

  .el-date-range-picker__content {
    padding: 10px 20px 15px;

    .el-date-range-picker__header div {
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
    }
  }

  .el-date-table {
    th {
      border: none;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 500;
      padding: 8px 0;
    }

    td {
      padding: 2px 0;

      &.in-range div {
        background: rgba(99, 102, 241, 0.1);
        color: rgba(255, 255, 255, 0.85);
      }

      &.in-range:hover div {
        background: rgba(99, 102, 241, 0.2);
      }

      &.start-date div,
      &.end-date div {
        background: #6366f1 !important;
        color: #fff;
      }

      &.today div {
        color: #6366f1;
        font-weight: bold;
      }

      .cell {
        height: 28px;
        line-height: 28px;
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.85);
        margin: 1px;

        &:hover {
          color: #6366f1;
        }
      }

      &.next-month,
      &.prev-month {
        .cell {
          color: rgba(255, 255, 255, 0.25);
        }
      }
    }
  }

  .el-picker-panel__icon-btn {
    color: rgba(255, 255, 255, 0.45);

    &:hover {
      color: #6366f1;
    }
  }

  .el-picker-panel__link-btn {
    color: #6366f1;
  }
}
</style> 