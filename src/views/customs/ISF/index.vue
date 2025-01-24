<template>
  <div class="isf-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>ISF Configuration</h1>
        <p class="subtitle">Manage and configure your ISF settings</p>
      </div>
      <el-button type="primary" class="add-btn">
        <el-icon class="icon"><Plus /></el-icon>
        Add New
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <SearchForm>
      <div class="search-section">
        <div class="search-title">Search Criteria</div>
        <div class="search-row">
          <div class="custom-input">
            <input 
              v-model="searchForm.fileNo" 
              placeholder="File No"
              @input="handleInput('fileNo', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.fileNo" @click="clearInput('fileNo')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="custom-input">
            <input 
              v-model="searchForm.masterBillNo" 
              placeholder="Master Bill No"
              @input="handleInput('masterBillNo', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.masterBillNo" @click="clearInput('masterBillNo')">
              <CircleClose />
            </el-icon>
          </div>
          <div 
            class="custom-select" 
            v-click-outside="() => handleClickOutside('shipmentType')"
          >
            <div 
              class="select-trigger" 
              @click.stop="toggleDropdown('shipmentType')"
              :class="{ 'is-focus': showShipmentTypeDropdown }"
            >
              <span class="placeholder" v-if="!searchForm.shipmentType">Shipment Type</span>
              <span v-else>{{ searchForm.shipmentType }}</span>
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="searchForm.shipmentType" 
                  @click.stop="clearSelect('shipmentType')"
                >
                  <CircleClose />
                </el-icon>
                <el-icon :class="{ 'is-reverse': showShipmentTypeDropdown }"><ArrowDown /></el-icon>
              </div>
            </div>
            <div 
              class="select-dropdown" 
              v-show="showShipmentTypeDropdown"
              @click.stop
            >
              <div 
                class="select-option" 
                v-for="option in dropdownOptions.shipmentType" 
                :key="option.value"
                @click.stop="handleSelectOption('shipmentType', option.value)"
                :class="{ active: searchForm.shipmentType === option.value }"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
          <div 
            class="custom-select" 
            v-click-outside="() => handleClickOutside('modeOfTransport')"
          >
            <div 
              class="select-trigger" 
              @click.stop="toggleDropdown('modeOfTransport')"
              :class="{ 'is-focus': showTransportDropdown }"
            >
              <span class="placeholder" v-if="!searchForm.modeOfTransport">Mode of Transport</span>
              <span v-else>{{ searchForm.modeOfTransport }}</span>
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="searchForm.modeOfTransport" 
                  @click.stop="clearSelect('modeOfTransport')"
                >
                  <CircleClose />
                </el-icon>
                <el-icon :class="{ 'is-reverse': showTransportDropdown }"><ArrowDown /></el-icon>
              </div>
            </div>
            <div 
              class="select-dropdown" 
              v-show="showTransportDropdown"
              @click.stop
            >
              <div 
                class="select-option" 
                v-for="option in dropdownOptions.modeOfTransport" 
                :key="option.value"
                @click.stop="handleSelectOption('modeOfTransport', option.value)"
                :class="{ active: searchForm.modeOfTransport === option.value }"
              >
                {{ option.label }}
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

        <div class="search-row" v-show="showAdvancedSearch">
          <div class="custom-input">
            <input 
              v-model="searchForm.voyageNo" 
              placeholder="Voyage No"
              @input="handleInput('voyageNo', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.voyageNo" @click="clearInput('voyageNo')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="custom-date-range">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="Start Creation Tim"
              end-placeholder="End Creation Tim"
              :popper-class="'custom-date-picker'"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
            />
          </div>
        </div>
      </div>
    </SearchForm>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table :data="filteredTableData" class="data-table">
        <el-table-column prop="fileNo" label="File No">
          <template #default="{ row }">
            <span class="link-text" @click="handleFileNoClick(row)">{{ row.fileNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="masterBillNo" label="Master Bill No">
          <template #default="{ row }">
            <span class="link-text" @click="handleMasterBillClick(row)">{{ row.masterBillNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shipmentType" label="Shipment Type">
          <template #default="{ row }">
            <StatusTag 
              :type="row.shipmentType === 'FCL' ? 'success' : 'warning'"
              :label="row.shipmentType"
            />
          </template>
        </el-table-column>
        <el-table-column prop="modeOfTransport" label="Mode of Transport">
          <template #default="{ row }">
            <StatusTag 
              :type="row.modeOfTransport === 'SEA' ? 'success' : 'warning'"
              :label="row.modeOfTransport"
            />
          </template>
        </el-table-column>
        <el-table-column prop="vesselName" label="Vessel Name" />
        <el-table-column prop="voyageNo" label="Voyage No" />
        <el-table-column label="Actions" width="100" fixed="right">
          <template #default>
            <span class="action-link">Edit</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Directive } from 'vue'
import type { ISFSearchFormState, ISFTableItem, DropdownField } from './types'
import { useSearch } from './composables/useSearch'
import SearchForm from '@/components/SearchForm/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import { 
  Search, Filter, ArrowLeft, ArrowRight, Plus,
  ArrowDown, CircleClose
} from '@element-plus/icons-vue'

// 下拉选项
const dropdownOptions = {
  shipmentType: [
    { label: 'FCL (Full Container Load)', value: 'FCL' },
    { label: 'LCL (Less than Container Load)', value: 'LCL' },
    { label: 'FAK (Freight All Kinds)', value: 'FAK' },
    { label: 'RORO (Roll On Roll Off)', value: 'RORO' },
    { label: 'BB (Break Bulk)', value: 'BB' }
  ],
  modeOfTransport: [
    { label: 'Sea', value: 'SEA' },
    { label: 'Air', value: 'AIR' },
    { label: 'Rail', value: 'RAIL' },
    { label: 'Road', value: 'ROAD' },
    { label: 'Multi', value: 'MULTI' }
  ]
}

// 下拉框状态
const showShipmentTypeDropdown = ref(false)
const showTransportDropdown = ref(false)

// 使用搜索组合式函数
const initialSearchForm: ISFSearchFormState = {
  fileNo: '',
  masterBillNo: '',
  shipmentType: '',
  modeOfTransport: '',
  vesselName: '',
  voyageNo: '',
  dateRange: null
}

const {
  searchForm,
  pagination,
  showAdvancedSearch,
  handleSearch,
  handlePageChange,
  handleSizeChange,
  toggleAdvancedSearch
} = useSearch(initialSearchForm)

// 模拟表格数据
const tableData = ref<ISFTableItem[]>([
  {
    id: '1',
    fileNo: 'ISF001',
    masterBillNo: 'MBL001',
    shipmentType: 'FCL',
    modeOfTransport: 'SEA',
    vesselName: 'VESSEL 1',
    voyageNo: 'V001',
    status: 'active',
    createdAt: '2024-01-23',
    updatedAt: '2024-01-23'
  }
])

// 计算过滤后的表格数据
const filteredTableData = computed(() => {
  return tableData.value
})

// 总数
const total = computed(() => tableData.value.length)

// 处理输入
const handleInput = (field: keyof ISFSearchFormState, event: Event) => {
  const target = event.target as HTMLInputElement
  searchForm[field] = target.value
}

// 清除输入
const clearInput = (field: keyof ISFSearchFormState) => {
  searchForm[field] = ''
  handleSearch()
}

// 切换下拉框
const toggleDropdown = (type: DropdownField) => {
  if (type === 'shipmentType') {
    showShipmentTypeDropdown.value = !showShipmentTypeDropdown.value
    showTransportDropdown.value = false
  } else {
    showTransportDropdown.value = !showTransportDropdown.value
    showShipmentTypeDropdown.value = false
  }
}

// 处理下拉框选项点击
const handleSelectOption = (type: DropdownField, value: string) => {
  searchForm[type] = value
  if (type === 'shipmentType') {
    showShipmentTypeDropdown.value = false
  } else {
    showTransportDropdown.value = false
  }
  handleSearch()
}

// 清除选择
const clearSelect = (type: DropdownField) => {
  searchForm[type] = ''
  handleSearch()
}

// 处理点击外部
const handleClickOutside = (type: DropdownField) => {
  if (type === 'shipmentType') {
    showShipmentTypeDropdown.value = false
  } else {
    showTransportDropdown.value = false
  }
}

// 处理日期变化
const handleDateChange = () => {
  handleSearch()
}

// 处理文件号点击
const handleFileNoClick = (row: ISFTableItem) => {
  console.log('File No clicked:', row.fileNo)
}

// 处理提单号点击
const handleMasterBillClick = (row: ISFTableItem) => {
  console.log('Master Bill clicked:', row.masterBillNo)
}

// 处理上一页
const handlePrevPage = () => {
  handlePageChange(pagination.currentPage - 1)
}

// 处理下一页
const handleNextPage = () => {
  handlePageChange(pagination.currentPage + 1)
}

// 点击外部指令
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside)
  }
} as Directive
</script>

<style lang="scss" scoped>
.isf-page {
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
  .search-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  .search-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr) auto;
    gap: 12px;
    margin-bottom: 12px;

    &:last-child {
      grid-template-columns: 1fr 2fr;
      margin-bottom: 0;
    }

    .action-btns {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
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
      padding: 0 32px 0 12px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(30, 35, 45, 0.6);
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.2s;

      .placeholder {
        color: rgba(255, 255, 255, 0.35);
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
}

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

    .action-link {
      color: var(--primary-color);
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--primary-color-hover);
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
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-select__popper) {
  background: var(--bg-dark) !important;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-picker__popper) {
  background: var(--bg-dark) !important;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .el-picker-panel {
    background: var(--bg-dark);
    border: none;
  }
}
</style> 