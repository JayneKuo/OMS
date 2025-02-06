<template>
  <div class="form3461-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Form 3461</h1>
        <p class="subtitle">Manage and configure your Form 3461 entries</p>
      </div>
      <el-button type="primary" class="add-btn" @click="handleCreate">
        <el-icon class="icon"><Plus /></el-icon>
        New Entry
      </el-button>
    </div>

    <!-- Search Section -->
      <div class="search-section">
      <div class="search-title">SEARCH BY</div>
      <div class="search-form">
        <!-- 主搜索行：4个输入项 + 操作按钮 -->
        <div class="search-row">
          <div class="custom-input">
            <input 
              v-model="searchForm.entryNo" 
              placeholder="Entry No"
              @input="handleInput('entryNo', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.entryNo" @click="clearInput('entryNo')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="custom-input">
            <input 
              v-model="searchForm.importerNo" 
              placeholder="Importer No"
              @input="handleInput('importerNo', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.importerNo" @click="clearInput('importerNo')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="custom-select" v-click-outside="() => handleClickOutside('bondType')">
            <div 
              class="select-trigger" 
              :class="{ 'is-focus': showBondTypeDropdown }"
            >
              <input
                v-model="bondTypeSearch"
                :placeholder="searchForm.bondType || 'Bond Type'"
                @input="handleSearchInput('bondType')"
                @click.stop="toggleDropdown('bondType')"
                @focus="toggleDropdown('bondType')"
              />
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="bondTypeSearch || searchForm.bondType" 
                  @click.stop="clearSelect('bondType')"
                >
                  <CircleClose />
                </el-icon>
                <el-icon :class="{ 'is-reverse': showBondTypeDropdown }"><ArrowDown /></el-icon>
              </div>
            </div>
            <div 
              class="select-dropdown" 
              v-show="showBondTypeDropdown"
              @click.stop
            >
              <div 
                v-for="type in filteredBondTypeOptions"
                :key="type.value"
                class="select-option" 
                @click.stop="handleSelectOption('bondType', type.value)"
                :class="{ active: searchForm.bondType === type.value }"
              >
                {{ type.label }}
              </div>
            </div>
          </div>
          <div class="custom-select" v-click-outside="() => handleClickOutside('status')">
            <div 
              class="select-trigger" 
              :class="{ 'is-focus': showStatusDropdown }"
            >
              <input
                v-model="statusSearch"
                :placeholder="searchForm.status || 'Status'"
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
                v-for="status in filteredStatusOptions"
                :key="status.value"
                class="select-option" 
                @click.stop="handleSelectOption('status', status.value)"
                :class="{ active: searchForm.status === status.value }"
              >
                <span class="status-dot" :style="{ backgroundColor: status.color }"></span>
                {{ status.value }}
              </div>
            </div>
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

        <!-- 高级搜索行：3个字段 -->
        <div class="search-row" v-show="showAdvancedSearch">
          <div class="custom-select" v-click-outside="() => handleClickOutside('entryType')">
            <div 
              class="select-trigger" 
              :class="{ 'is-focus': showEntryTypeDropdown }"
            >
            <input 
                v-model="entryTypeSearch"
                :placeholder="searchForm.entryType || 'Entry Type'"
                @input="handleSearchInput('entryType')"
                @click.stop="toggleDropdown('entryType')"
                @focus="toggleDropdown('entryType')"
              />
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="entryTypeSearch || searchForm.entryType" 
                  @click.stop="clearSelect('entryType')"
                >
              <CircleClose />
            </el-icon>
                <el-icon :class="{ 'is-reverse': showEntryTypeDropdown }"><ArrowDown /></el-icon>
              </div>
            </div>
            <div 
              class="select-dropdown" 
              v-show="showEntryTypeDropdown"
              @click.stop
            >
              <div 
                v-for="type in filteredEntryTypeOptions"
                :key="type.value"
                class="select-option" 
                @click.stop="handleSelectOption('entryType', type.value)"
                :class="{ active: searchForm.entryType === type.value }"
              >
                {{ type.label }}
              </div>
            </div>
          </div>
          <div class="custom-select" v-click-outside="() => handleClickOutside('portOfEntry')">
            <div 
              class="select-trigger" 
              :class="{ 'is-focus': showPortDropdown }"
            >
              <input
                v-model="portSearch"
                :placeholder="searchForm.portOfEntry || 'Port of Entry'"
                @input="handleSearchInput('portOfEntry')"
                @click.stop="toggleDropdown('portOfEntry')"
                @focus="toggleDropdown('portOfEntry')"
              />
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="portSearch || searchForm.portOfEntry" 
                  @click.stop="clearSelect('portOfEntry')"
                >
                  <CircleClose />
                </el-icon>
                <el-icon :class="{ 'is-reverse': showPortDropdown }"><ArrowDown /></el-icon>
              </div>
            </div>
            <div 
              class="select-dropdown" 
              v-show="showPortDropdown"
              @click.stop
            >
              <div 
                v-for="port in filteredPortOptions"
                :key="port.value"
                class="select-option" 
                @click.stop="handleSelectOption('portOfEntry', port.value)"
                :class="{ active: searchForm.portOfEntry === port.value }"
              >
                {{ port.label }}
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
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-section">
      <el-table :data="filteredTableData" class="data-table">
        <el-table-column prop="entryNo" label="Entry No">
          <template #default="{ row }">
            <span class="link-text" @click="handleViewDetails(row)">{{ row.entryNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="importerNo" label="Importer No">
          <template #default="{ row }">
            <span class="link-text" @click="handleImporterNoClick(row)">{{ row.importerNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="entryType" label="Entry Type" />
        <el-table-column prop="portOfEntry" label="Port of Entry" />
        <el-table-column prop="bondType" label="Bond Type" />
        <el-table-column prop="entryDate" label="Entry Date" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <span :style="{ color: STATUS_CONFIG[(row as Form3461TableItem).status].color }">
              {{ STATUS_CONFIG[(row as Form3461TableItem).status].label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" min-width="120" fixed="right">
          <template #default="{ row }">
            <el-dropdown trigger="click">
              <span class="action-trigger">
                Actions
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="action in STATUS_CONFIG[(row as Form3461TableItem).status].actions"
                    :key="action.value"
                    @click="handleAction(action.handler, row as Form3461TableItem)"
                  >
                    <span :style="{ color: action.color }">{{ action.label }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <span class="total">Total {{ total }}</span>
        <div class="page-nav">
          <el-button 
            class="nav-btn" 
            @click="handlePrevPage" 
            :disabled="pagination.currentPage === 1"
          >
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <div class="page-num active">{{ pagination.currentPage }}</div>
          <el-button 
            class="nav-btn" 
            @click="handleNextPage" 
            :disabled="pagination.currentPage * pagination.pageSize >= total"
          >
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <el-dropdown class="page-size" @command="handleSizeChange">
          <span>{{ pagination.pageSize }}/page</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="size in [10, 20, 50, 100]" :key="size" :command="size">
                {{ size }}/page
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="30%"
      :before-close="handleDialogClose"
    >
      <span>{{ dialogMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">Cancel</el-button>
          <el-button type="primary" @click="handleDialogConfirm">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Form3461SearchFormState, Form3461TableItem, Form3461Status } from './types'
import { STATUS_CONFIG, ENTRY_TYPES, PORTS_OF_ENTRY, BOND_TYPES } from './types'
import { useSearch } from './composables/useSearch'
import { useTableData } from './composables/useTableData'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Directive } from 'vue'
import { 
  Search, Filter, ArrowLeft, ArrowRight, Plus,
  ArrowDown, CircleClose
} from '@element-plus/icons-vue'

const router = useRouter()
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
  handleSizeChange
} = useSearch()

// Status dropdown
const showStatusDropdown = ref(false)
const showEntryTypeDropdown = ref(false)
const showPortDropdown = ref(false)
const showBondTypeDropdown = ref(false)

const toggleDropdown = (field: string) => {
  switch (field) {
    case 'status':
      showStatusDropdown.value = !showStatusDropdown.value
      showEntryTypeDropdown.value = false
      showPortDropdown.value = false
      showBondTypeDropdown.value = false
      break
    case 'entryType':
      showEntryTypeDropdown.value = !showEntryTypeDropdown.value
      showStatusDropdown.value = false
      showPortDropdown.value = false
      showBondTypeDropdown.value = false
      break
    case 'portOfEntry':
      showPortDropdown.value = !showPortDropdown.value
      showStatusDropdown.value = false
      showEntryTypeDropdown.value = false
      showBondTypeDropdown.value = false
      break
    case 'bondType':
      showBondTypeDropdown.value = !showBondTypeDropdown.value
      showStatusDropdown.value = false
      showEntryTypeDropdown.value = false
      showPortDropdown.value = false
      break
  }
}

const handleClickOutside = (field: string) => {
  switch (field) {
    case 'status':
      showStatusDropdown.value = false
      break
    case 'entryType':
      showEntryTypeDropdown.value = false
      break
    case 'portOfEntry':
      showPortDropdown.value = false
      break
    case 'bondType':
      showBondTypeDropdown.value = false
      break
  }
}

const handleSelectOption = (field: string, value: string) => {
  switch (field) {
    case 'status':
      searchForm.value.status = value as Form3461Status
      statusSearch.value = ''
      showStatusDropdown.value = false
      break
    case 'entryType':
      searchForm.value.entryType = value
      entryTypeSearch.value = ''
      showEntryTypeDropdown.value = false
      break
    case 'portOfEntry':
      searchForm.value.portOfEntry = value
      portSearch.value = ''
      showPortDropdown.value = false
      break
    case 'bondType':
      searchForm.value.bondType = value
      bondTypeSearch.value = ''
      showBondTypeDropdown.value = false
      break
  }
}

const clearSelect = (field: string) => {
  switch (field) {
    case 'status':
      searchForm.value.status = ''
      statusSearch.value = ''
      break
    case 'entryType':
      searchForm.value.entryType = ''
      entryTypeSearch.value = ''
      break
    case 'portOfEntry':
      searchForm.value.portOfEntry = ''
      portSearch.value = ''
      break
    case 'bondType':
      searchForm.value.bondType = ''
      bondTypeSearch.value = ''
      break
  }
}

// Action handling
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const currentAction = ref('')
const currentRow = ref<Form3461TableItem | null>(null)

const getActionLabel = (action: string) => {
  const actionLabels: Record<string, string> = {
    edit: 'Edit',
    submit: 'Submit',
    delete: 'Delete',
    view: 'View',
    track: 'Track',
    upload: 'Upload',
    contact: 'Contact',
    create7501: 'Create 7501',
    arrange: 'Arrange',
    resubmit: 'Resubmit'
  }
  return actionLabels[action] || action
}

const handleAction = async (handler: string, row: Form3461TableItem) => {
  switch (handler) {
    case 'handleViewDetails':
      // View details
      handleViewDetails(row)
      break
      
    case 'handleSubmitForm':
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to submit this form? It will enter the review process.',
          'Submit Confirmation',
          { type: 'warning' }
        )
        updateStatus(row.id, 'Processing')
        ElMessage.success('Form submitted successfully')
      } catch {
        // User cancelled
      }
      break
      
    case 'handleApproveAndComplete':
      // Approve and complete
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to approve and complete this form?',
          'Completion Confirmation',
          { type: 'warning' }
        )
        updateStatus(row.id, 'Completed')
        ElMessage.success('Form completed successfully')
      } catch {
        // User cancelled
      }
      break
      
    case 'handleRejectForm':
      // Reject form
      try {
        const { value: reason } = await ElMessageBox.prompt(
          'Please enter the rejection reason:',
          'Reject Form',
          { type: 'warning' }
        )
        if (reason) {
          updateStatus(row.id, 'Failed')
          ElMessage.success('Form rejected')
        }
      } catch {
        // User cancelled
      }
      break
      
    case 'handleCancelForm':
      // Cancel form
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to cancel this form? This action cannot be undone.',
          'Cancel Confirmation',
          { type: 'warning' }
        )
        updateStatus(row.id, 'Cancelled')
        ElMessage.success('Form cancelled')
      } catch {
        // User cancelled
      }
      break
      
    case 'handleViewFailureReason':
      // View failure reason
      ElMessageBox.alert(
        'Form data is incomplete or incorrect. Please review and resubmit.',
        'Failure Reason',
        { type: 'error' }
      )
      break
      
    case 'handleEditForm':
      // Edit form
      router.push(`/customs/form3461/edit/${row.systemId}`)
      break
  }
}

const handleDialogClose = () => {
  dialogVisible.value = false
  currentAction.value = ''
  currentRow.value = null
}

const handleDialogConfirm = async () => {
  if (!currentRow.value || !currentAction.value) return

  try {
    // Add actual API call here
    console.log(`Confirmed ${currentAction.value} for row:`, currentRow.value)
    
    // Mock API call success
    ElMessage.success('Operation successful')
    handleSearch() // Refresh list
  } catch (error) {
    console.error('Operation failed:', error)
    ElMessage.error('Operation failed, please try again')
  } finally {
    handleDialogClose()
  }
}

// Table data
const { tableData, updateStatus, deleteRecord } = useTableData()

// Total count
const total = computed(() => tableData.value.length)

// Entry number click handler
const handleEntryNoClick = (row: Form3461TableItem) => {
  handleViewDetails(row)
}

// Importer number click handler
const handleImporterNoClick = (row: Form3461TableItem) => {
  console.log('Importer No clicked:', row.importerNo)
}

// Create handler
const handleCreate = () => {
  router.push('/customs/form3461/create')
}

// Date change handler
const handleDateChange = () => {
  handleSearch()
}

// Pagination handlers
const handlePrevPage = () => {
  handlePageChange(pagination.value.currentPage - 1)
}

const handleNextPage = () => {
  handlePageChange(pagination.value.currentPage + 1)
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    const clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    el.dataset.clickOutside = 'true'
    document.addEventListener('click', clickOutside)
  },
  unmounted(el: HTMLElement, binding: any) {
    const clickOutside = (event: Event) => {
      if (el.dataset.clickOutside === 'true' && !(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.removeEventListener('click', clickOutside)
  }
} as Directive

// 搜索状态
const statusSearch = ref('')
const entryTypeSearch = ref('')
const portSearch = ref('')
const bondTypeSearch = ref('')

// 过滤后的选项
const filteredStatusOptions = computed(() => {
  const search = statusSearch.value.toLowerCase()
  return Object.values(STATUS_CONFIG).filter(status => 
    status.value.toLowerCase().includes(search) || 
    status.label.toLowerCase().includes(search)
  )
})

const filteredEntryTypeOptions = computed(() => {
  const search = entryTypeSearch.value.toLowerCase()
  return ENTRY_TYPES.filter(type => 
    type.value.toLowerCase().includes(search) || 
    type.label.toLowerCase().includes(search)
  )
})

const filteredPortOptions = computed(() => {
  const search = portSearch.value.toLowerCase()
  return PORTS_OF_ENTRY.filter(port => 
    port.value.toLowerCase().includes(search) || 
    port.label.toLowerCase().includes(search)
  )
})

const filteredBondTypeOptions = computed(() => {
  const search = bondTypeSearch.value.toLowerCase()
  return BOND_TYPES.filter(type => 
    type.value.toLowerCase().includes(search) || 
    type.label.toLowerCase().includes(search)
  )
})

// 处理搜索输入
const handleSearchInput = (field: string) => {
  switch (field) {
    case 'status':
      showStatusDropdown.value = true
      break
    case 'entryType':
      showEntryTypeDropdown.value = true
      break
    case 'portOfEntry':
      showPortDropdown.value = true
      break
    case 'bondType':
      showBondTypeDropdown.value = true
      break
  }
}

// 查看表单详情
const handleViewDetails = (row: Form3461TableItem) => {
  router.push(`/customs/form3461/view/${row.systemId}`)
}
</script>

<style lang="scss" scoped>
.form3461-page {
  padding: 24px;
  min-height: 100vh;
  background: var(--bg-darker);
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-content {
    h1 {
      font-size: 32px;
      font-weight: 500;
      margin: 0;
      color: var(--text-primary);
    }
    
    .subtitle {
      margin: 8px 0 0;
      color: var(--text-secondary);
      font-size: 14px;
    }
  }

  .add-btn {
    height: 40px;
    padding: 0 24px;
    border-radius: 8px;
    background: var(--primary-color);
    border: none;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;

    &:hover {
      background: var(--primary-color-hover);
    }

    .icon {
      font-size: 16px;
    }
  }
}

.search-section {
  background: var(--bg-dark);
  border-radius: 8px;
  padding: 24px;

  .search-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  .search-row {
    display: grid;
    gap: 12px;
    margin-bottom: 12px;

    &:first-child {
      grid-template-columns: repeat(4, 1fr) auto;
    }

    &:last-child {
      grid-template-columns: repeat(3, 1fr);
      margin-bottom: 0;
    }
  }

  .custom-input {
    position: relative;
    
    input {
      width: 100%;
      height: 40px;
      padding: 0 32px 0 12px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(30, 35, 45, 0.6);
      color: #fff;
      font-size: 14px;
      transition: all 0.2s;

      &::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }

      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
        background: rgba(35, 40, 50, 0.7);
      }

      &:focus {
        border-color: rgba(255, 255, 255, 0.2);
        background: rgba(35, 40, 50, 0.7);
        outline: none;
      }
    }

    .clear-icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.35);
      cursor: pointer;
      font-size: 16px;
      opacity: 0;
      transition: all 0.2s;

      &:hover {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    &:hover .clear-icon {
      opacity: 1;
    }
  }

  .custom-select {
    position: relative;

    .select-trigger {
      height: 40px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(30, 35, 45, 0.6);
      display: flex;
      align-items: center;
      transition: all 0.2s;

      input {
        flex: 1;
        height: 100%;
        padding: 0 32px 0 12px;
        border: none;
        background: transparent;
        color: #fff;
        font-size: 14px;

        &::placeholder {
        color: rgba(255, 255, 255, 0.35);
        }

        &:focus {
          outline: none;
        }
      }

      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
        background: rgba(35, 40, 50, 0.7);
      }

      &.is-focus {
        border-color: rgba(255, 255, 255, 0.2);
        background: rgba(35, 40, 50, 0.7);
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
          color: rgba(255, 255, 255, 0.35);
          opacity: 0;
          transition: all 0.2s;
          cursor: pointer;

          &:hover {
            color: rgba(255, 255, 255, 0.5);
          }
        }

        .el-icon {
          color: rgba(255, 255, 255, 0.35);
          transition: transform 0.2s;

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
      background: rgba(30, 35, 45, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10;
      max-height: 216px;
      overflow-y: auto;

      .select-option {
        padding: 0 12px;
        height: 36px;
        line-height: 36px;
        color: rgba(255, 255, 255, 0.85);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        &.active {
          background: var(--primary-color);
          color: #fff;
        }
      }
    }
  }

  .custom-date-range {
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

  .action-btns {
    display: flex;
    gap: 8px;

  .custom-btn {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(30, 35, 45, 0.6);
    color: rgba(255, 255, 255, 0.35);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(35, 40, 50, 0.7);
      color: rgba(255, 255, 255, 0.5);
    }

    &.active {
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(35, 40, 50, 0.7);
      color: var(--primary-color);
    }

    &.search-btn {
      background: var(--primary-color);
      border: none;
      color: #fff;

      &:hover {
        background: var(--primary-hover);
        }
      }
    }
  }
}

.table-section {
  background: var(--bg-dark);
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;

  .data-table {
    margin-bottom: 24px;

    :deep(.el-table__header-wrapper) {
      th.el-table__cell {
        background: transparent;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 14px;
        padding: 16px;
      }
    }

    :deep(.el-table__body-wrapper) {
      td.el-table__cell {
        background: var(--bg-dark);
        border-bottom: 1px solid var(--border-color);
        color: var(--text-primary);
        font-size: 14px;
        padding: 16px;
      }
    }

    :deep(.el-table__row) {
      background: transparent;
      transition: background-color 0.3s;

      &:hover {
        background: var(--bg-darker);
      }
    }

    .link-text {
      color: var(--primary-color);
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--primary-color-hover);
      }
    }

    .action-trigger {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 14px;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;

  .total {
    color: var(--text-secondary);
    font-size: 14px;
  }

  .page-nav {
    display: flex;
    align-items: center;
    gap: 8px;

    .nav-btn {
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;

      &:not(:disabled):hover {
        color: var(--primary-color);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .page-num {
      min-width: 32px;
      height: 32px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: var(--text-secondary);

      &.active {
        background: var(--primary-color);
        color: #fff;
      }
    }
  }

  .page-size {
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--text-primary);
    }
  }
}

:deep(.el-dropdown-menu) {
  background: var(--bg-dark);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .el-dropdown-menu__item {
    color: var(--text-primary);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    &:focus {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}

:deep(.el-select-dropdown) {
    background: var(--bg-dark);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .el-select-dropdown__item {
    color: var(--text-primary);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    &.selected {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style> 