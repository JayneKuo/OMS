<template>
  <div class="form3461-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>Form 3461</h1>
        <p class="subtitle">Manage and configure your Form 3461 entries</p>
      </div>
      <el-button type="primary" class="add-btn" @click="handleCreate">
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
          <div 
            class="custom-select" 
            v-click-outside="() => handleClickOutside('entryType')"
          >
            <div 
              class="select-trigger" 
              @click.stop="toggleDropdown('entryType')"
              :class="{ 'is-focus': showEntryTypeDropdown }"
            >
              <span class="placeholder" v-if="!searchForm.entryType">Entry Type</span>
              <span v-else>{{ searchForm.entryType }}</span>
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="searchForm.entryType" 
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
                class="select-option" 
                v-for="option in dropdownOptions.entryType" 
                :key="option.value"
                @click.stop="handleSelectOption('entryType', option.value)"
                :class="{ active: searchForm.entryType === option.value }"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
          <div 
            class="custom-select" 
            v-click-outside="() => handleClickOutside('portOfEntry')"
          >
            <div 
              class="select-trigger" 
              @click.stop="toggleDropdown('portOfEntry')"
              :class="{ 'is-focus': showPortDropdown }"
            >
              <span class="placeholder" v-if="!searchForm.portOfEntry">Port of Entry</span>
              <span v-else>{{ searchForm.portOfEntry }}</span>
              <div class="select-icons">
                <el-icon 
                  class="clear-icon" 
                  v-show="searchForm.portOfEntry" 
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
                class="select-option" 
                v-for="option in dropdownOptions.portOfEntry" 
                :key="option.value"
                @click.stop="handleSelectOption('portOfEntry', option.value)"
                :class="{ active: searchForm.portOfEntry === option.value }"
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
              v-model="searchForm.billOfLading" 
              placeholder="Bill of Lading"
              @input="handleInput('billOfLading', $event)"
            />
            <el-icon class="clear-icon" v-show="searchForm.billOfLading" @click="clearInput('billOfLading')">
              <CircleClose />
            </el-icon>
          </div>
          <div class="custom-date-range">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="Start Entry Date"
              end-placeholder="End Entry Date"
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
        <el-table-column prop="entryNo" label="Entry No">
          <template #default="{ row }">
            <span class="link-text" @click="handleEntryNoClick(row)">{{ row.entryNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="importerNo" label="Importer No">
          <template #default="{ row }">
            <span class="link-text" @click="handleImporterNoClick(row)">{{ row.importerNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="entryType" label="Entry Type">
          <template #default="{ row }">
            <StatusTag 
              :type="row.entryType === 'Consumption' ? 'success' : 'warning'"
              :label="row.entryType"
            />
          </template>
        </el-table-column>
        <el-table-column prop="portOfEntry" label="Port of Entry">
          <template #default="{ row }">
            <StatusTag 
              :type="row.portOfEntry === 'Los Angeles' ? 'success' : 'warning'"
              :label="row.portOfEntry"
            />
          </template>
        </el-table-column>
        <el-table-column prop="billOfLading" label="Bill of Lading" />
        <el-table-column prop="entryDate" label="Entry Date" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <StatusTag 
              :type="row.status === 'active' ? 'success' : 'danger'"
              :label="row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="100" fixed="right">
          <template #default="{ row }">
            <span class="action-link" @click="handleEdit(row)">Edit</span>
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
import type { Form3461SearchFormState, Form3461TableItem, DropdownField } from './types'
import { useSearch } from './composables/useSearch'
import SearchForm from '@/components/SearchForm/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import { 
  Search, Filter, ArrowLeft, ArrowRight, Plus,
  ArrowDown, CircleClose
} from '@element-plus/icons-vue'

const router = useRouter()

// 下拉选项
const dropdownOptions = {
  entryType: [
    { label: 'Consumption', value: 'Consumption' },
    { label: 'Warehouse', value: 'Warehouse' },
    { label: 'Foreign Trade Zone', value: 'FTZ' },
    { label: 'Transportation & Exportation', value: 'T&E' },
    { label: 'Informal', value: 'Informal' }
  ],
  portOfEntry: [
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'New York', value: 'New York' },
    { label: 'Miami', value: 'Miami' },
    { label: 'Seattle', value: 'Seattle' },
    { label: 'Chicago', value: 'Chicago' }
  ]
}

// 下拉框状态
const showEntryTypeDropdown = ref(false)
const showPortDropdown = ref(false)

// 使用搜索组合式函数
const initialSearchForm: Form3461SearchFormState = {
  entryNo: '',
  importerNo: '',
  entryType: '',
  billOfLading: '',
  portOfEntry: '',
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
const tableData = ref<Form3461TableItem[]>([
  {
    entryNo: '3461001',
    importerNo: 'IMP001',
    entryType: 'Consumption',
    billOfLading: 'BOL001',
    portOfEntry: 'Los Angeles',
    entryDate: '2024-01-23',
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
const handleInput = (field: keyof Form3461SearchFormState, event: Event) => {
  const target = event.target as HTMLInputElement
  searchForm[field] = target.value
}

// 清除输入
const clearInput = (field: keyof Form3461SearchFormState) => {
  searchForm[field] = ''
  handleSearch()
}

// 切换下拉框
const toggleDropdown = (type: DropdownField) => {
  if (type === 'entryType') {
    showEntryTypeDropdown.value = !showEntryTypeDropdown.value
    showPortDropdown.value = false
  } else {
    showPortDropdown.value = !showPortDropdown.value
    showEntryTypeDropdown.value = false
  }
}

// 处理下拉框选项点击
const handleSelectOption = (type: DropdownField, value: string) => {
  searchForm[type] = value
  if (type === 'entryType') {
    showEntryTypeDropdown.value = false
  } else {
    showPortDropdown.value = false
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
  if (type === 'entryType') {
    showEntryTypeDropdown.value = false
  } else {
    showPortDropdown.value = false
  }
}

// 处理日期变化
const handleDateChange = () => {
  handleSearch()
}

// 处理条目号点击
const handleEntryNoClick = (row: Form3461TableItem) => {
  console.log('Entry No clicked:', row.entryNo)
}

// 处理进口商号点击
const handleImporterNoClick = (row: Form3461TableItem) => {
  console.log('Importer No clicked:', row.importerNo)
}

// 处理创建
const handleCreate = () => {
  router.push('/customs/form-3461/create')
}

// 处理编辑
const handleEdit = (row: Form3461TableItem) => {
  router.push(`/customs/form-3461/edit/${row.entryNo}`)
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
    const clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    el.dataset.clickOutside = 'true'
    document.addEventListener('click', clickOutside)
  },
  unmounted(el: HTMLElement) {
    const clickOutside = (event: Event) => {
      if (el.dataset.clickOutside === 'true' && !(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.removeEventListener('click', clickOutside)
  }
} as Directive
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