<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>Warehouse Zipcode Range Management</h1>
        <p class="subtitle">Manage warehouse service zipcode ranges, support batch import</p>
      </div>
    </div>

    <!-- Operation Section -->
    <el-card class="operation-section">
      <div class="operation-container">
        <!-- Search Area -->
        <div class="search-area">
          <el-input
            v-model="searchQuery"
            placeholder="Search by state/zipcode/warehouse"
            class="search-input"
            clearable
            @clear="handleSearch"
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="selectedState"
            placeholder="Select State"
            clearable
            class="state-select"
            @change="handleSearch"
          >
            <el-option
              v-for="state in states"
              :key="state"
              :label="state"
              :value="state"
            />
          </el-select>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <el-button type="success" :icon="Plus" @click="handleAdd">Add New</el-button>
          <el-upload
            class="upload-hidden"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            accept=".xlsx,.xls"
            ref="uploadRef"
          >
            <template #trigger>
              <el-button type="primary" :icon="Upload">Import Data</el-button>
            </template>
          </el-upload>
          <el-button type="info" :icon="Download" @click="downloadTemplate">Download Template</el-button>
          <el-button type="danger" :icon="Delete" @click="handleRemoveAll">Remove All</el-button>
        </div>
      </div>
    </el-card>

    <!-- Data Display Section -->
    <el-card class="data-section">
      <el-table 
        ref="tableRef"
        :data="filteredData" 
        style="width: 100%" 
        v-loading="loading"
        border
        stripe
        table-layout="fixed"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        :default-sort="{ prop: 'createdTime', order: 'descending' }"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column 
          prop="state" 
          label="State" 
          width="120"
          sortable="custom"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <span class="state-text">{{ row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="fromZipcode" 
          label="From Zipcode" 
          width="160"
          sortable="custom"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <span class="zipcode">{{ row.fromZipcode }}</span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="toZipcode" 
          label="To Zipcode" 
          width="160"
          sortable="custom"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <span class="zipcode">{{ row.toZipcode }}</span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="warehouseCode" 
          label="Warehouse Code" 
          width="180"
          sortable="custom"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <span class="warehouse-code">{{ row.warehouseCode }}</span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="warehouseName" 
          label="Warehouse Name" 
          min-width="240"
          sortable="custom"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="createdTime"
          label="Created Time"
          width="180"
          sortable="custom"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            {{ formatDate(scope.row.createdTime) }}
          </template>
        </el-table-column>
        <el-table-column 
          label="Actions" 
          width="180"
          fixed="right"
        >
          <template #default="scope">
            <span 
              class="action-text purple"
              @click="handleEdit(scope.row)"
            >
              Edit
            </span>
            <el-divider direction="vertical" />
            <span 
              class="action-text danger"
              @click="handleDelete(scope.$index)"
            >
              Delete
            </span>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredData.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Import Dialog -->
    <el-dialog
      v-model="importDialogVisible"
      title="Import Data Preview"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="import-dialog-content">
        <el-alert
          v-if="importError"
          :title="importError"
          type="error"
          show-icon
          class="import-alert"
        />
        <template v-if="!importedData.length">
          <el-upload
            class="upload-area"
            drag
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            accept=".xlsx,.xls"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                Please upload Excel file (.xlsx or .xls), file size should not exceed 4MB
              </div>
            </template>
          </el-upload>
        </template>
        <template v-else>
          <div class="import-options" v-if="duplicateRecords.length">
            <el-alert
              title="Found duplicate records"
              type="warning"
              show-icon
              :description="'Found ' + duplicateRecords.length + ' duplicate records. Please select how to handle them:'"
              class="duplicate-alert"
            />
            <el-radio-group v-model="duplicateHandling" class="handling-options">
              <el-radio label="skip">Skip (Keep existing)</el-radio>
              <el-radio label="update">Update (Replace with new)</el-radio>
              <el-radio label="append">Append (Add as new)</el-radio>
            </el-radio-group>
          </div>
          
          <p class="preview-title">Data Preview:</p>
          <el-table
            :data="importedData"
            border
            style="width: 100%"
            max-height="400px"
          >
            <el-table-column type="index" width="50" />
            <el-table-column prop="state" label="State" />
            <el-table-column prop="fromZipcode" label="From Zipcode" />
            <el-table-column prop="toZipcode" label="To Zipcode" />
            <el-table-column prop="warehouseCode" label="Warehouse Code" />
            <el-table-column prop="warehouseName" label="Warehouse Name" />
            <el-table-column label="Status" width="120">
              <template #default="scope">
                <el-tag 
                  :type="getStatusType(scope.row)"
                  size="small"
                >
                  {{ getStatusText(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="dialog-footer">
            <span class="total-count">Total: {{ importedData.length }} records</span>
            <div class="button-group">
              <el-button @click="cancelImport">Cancel</el-button>
              <el-button type="primary" @click="confirmImport" :loading="importing">
                Confirm Import
              </el-button>
            </div>
          </div>
        </template>
      </div>
    </el-dialog>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? 'Edit Zipcode Range' : 'Add Zipcode Range'"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        label-position="left"
        class="edit-form"
      >
        <el-form-item label="State" prop="state">
          <el-select
            v-model="formData.state"
            placeholder="Select State"
            class="full-width"
          >
            <el-option
              v-for="state in states"
              :key="state"
              :label="state"
              :value="state"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="From Zipcode" prop="fromZipcode">
          <el-input 
            v-model="formData.fromZipcode"
            placeholder="Enter from zipcode"
            maxlength="5"
            show-word-limit
            class="zipcode-input"
          />
        </el-form-item>
        <el-form-item label="To Zipcode" prop="toZipcode">
          <el-input 
            v-model="formData.toZipcode"
            placeholder="Enter to zipcode"
            maxlength="5"
            show-word-limit
            class="zipcode-input"
          />
        </el-form-item>
        <el-form-item label="Warehouse Code" prop="warehouseCode">
          <el-input 
            v-model="formData.warehouseCode"
            placeholder="Enter warehouse code"
            class="warehouse-input"
          />
        </el-form-item>
        <el-form-item label="Warehouse Name" prop="warehouseName">
          <el-input 
            v-model="formData.warehouseName"
            placeholder="Enter warehouse name"
            class="warehouse-input"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button 
            size="large"
            @click="editDialogVisible = false"
            class="dialog-button"
          >
            Cancel
          </el-button>
          <el-button 
            type="primary" 
            size="large"
            @click="handleSaveRecord"
            class="dialog-button"
          >
            Save
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { UploadFilled, Search, Upload, Download, Delete, Plus, Edit } from '@element-plus/icons-vue'
import { read, utils, writeFile } from 'xlsx'
import { format } from 'date-fns'

// 数据结构定义
interface ZipcodeRange {
  state: string
  fromZipcode: string
  toZipcode: string
  warehouseCode: string
  warehouseName: string
  createdTime: string
}

const loading = ref(false)
const zipcodeData = ref<ZipcodeRange[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const selectedState = ref('')
const importDialogVisible = ref(false)
const importError = ref('')
const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'MI', 'NC']

// 添加新的响应式变量
const selectedRows = ref<ZipcodeRange[]>([])
const importedData = ref<ZipcodeRange[]>([])

// 表单相关
const editDialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const formData = ref<ZipcodeRange>({
  state: '',
  fromZipcode: '',
  toZipcode: '',
  warehouseCode: '',
  warehouseName: '',
  createdTime: ''
})

// 表单验证规则
const formRules = {
  state: [
    { required: true, message: 'Please select state', trigger: 'change' }
  ],
  fromZipcode: [
    { required: true, message: 'Please enter from zipcode', trigger: 'blur' },
    { pattern: /^\d{5}$/, message: 'Please enter valid 5-digit zipcode', trigger: 'blur' }
  ],
  toZipcode: [
    { required: true, message: 'Please enter to zipcode', trigger: 'blur' },
    { pattern: /^\d{5}$/, message: 'Please enter valid 5-digit zipcode', trigger: 'blur' }
  ],
  warehouseCode: [
    { required: true, message: 'Please enter warehouse code', trigger: 'blur' }
  ],
  warehouseName: [
    { required: true, message: 'Please enter warehouse name', trigger: 'blur' }
  ]
}

// 排序状态
const sortState = ref({
  prop: 'createdTime',
  order: 'descending'
})

// 格式化日期
const formatDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
}

// 处理排序变化
const handleSortChange = ({ prop, order }) => {
  sortState.value = { prop, order }
}

// 搜索和过滤
const filteredData = computed(() => {
  let result = zipcodeData.value

  if (selectedState.value) {
    result = result.filter(item => item.state === selectedState.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.state.toLowerCase().includes(query) ||
      item.fromZipcode.includes(query) ||
      item.toZipcode.includes(query) ||
      item.warehouseCode.toLowerCase().includes(query) ||
      item.warehouseName.toLowerCase().includes(query)
    )
  }

  // 应用排序
  if (sortState.value.prop && sortState.value.order) {
    const { prop, order } = sortState.value
    result.sort((a, b) => {
      let compareResult = 0
      
      // 特殊排序规则
      switch (prop) {
        case 'createdTime':
          compareResult = new Date(a[prop]) - new Date(b[prop])
          break
        case 'fromZipcode':
        case 'toZipcode':
          compareResult = Number(a[prop]) - Number(b[prop])
          break
        case 'state':
        case 'warehouseCode':
          compareResult = a[prop].toLowerCase().localeCompare(b[prop].toLowerCase())
          break
        default:
          compareResult = a[prop].localeCompare(b[prop])
      }
      
      return order === 'ascending' ? compareResult : -compareResult
    })
  }

  return result
})

// 分页数据计算
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 添加选择行变化处理函数
const handleSelectionChange = (selection: ZipcodeRange[]) => {
  selectedRows.value = selection
}

// 新增状态变量
const duplicateRecords = ref<ZipcodeRange[]>([])
const duplicateHandling = ref('skip')
const importing = ref(false)

// 检查重复记录
const checkDuplicates = (data: ZipcodeRange[]) => {
  return data.filter(newRecord => 
    zipcodeData.value.some(existingRecord => 
      existingRecord.state === newRecord.state &&
      existingRecord.warehouseCode === newRecord.warehouseCode
    )
  )
}

// 获取记录状态
const getStatusType = (record: ZipcodeRange) => {
  const isDuplicate = duplicateRecords.value.some(r => 
    r.state === record.state && 
    r.warehouseCode === record.warehouseCode
  )
  return isDuplicate ? 'warning' : 'success'
}

// 获取记录状态文本
const getStatusText = (record: ZipcodeRange) => {
  const isDuplicate = duplicateRecords.value.some(r => 
    r.state === record.state && 
    r.warehouseCode === record.warehouseCode
  )
  return isDuplicate ? 'Duplicate' : 'New'
}

// 修改文件上传处理函数
const handleFileChange = async (file: File) => {
  loading.value = true
  importError.value = ''
  try {
    const data = await readExcel(file)
    if (validateData(data)) {
      importedData.value = data.map(record => ({
        ...record,
        createdTime: new Date().toISOString()
      }))
      duplicateRecords.value = checkDuplicates(importedData.value)
      importDialogVisible.value = true
    }
  } catch (error) {
    importError.value = 'File parsing failed, please check if the file format is correct'
    ElMessage.error(importError.value)
  } finally {
    loading.value = false
  }
}

// 读取Excel文件
const readExcel = (file: File): Promise<ZipcodeRange[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = read(data, { type: 'binary' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = utils.sheet_to_json(worksheet)
        resolve(jsonData as ZipcodeRange[])
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsBinaryString(file)
  })
}

// 验证数据
const validateData = (data: any[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    importError.value = 'Data format is incorrect or empty'
    ElMessage.error(importError.value)
    return false
  }
  
  const requiredFields = ['state', 'fromZipcode', 'toZipcode', 'warehouseCode', 'warehouseName']
  const isValid = data.every(item => 
    requiredFields.every(field => item[field] !== undefined && item[field] !== '')
  )

  if (!isValid) {
    importError.value = 'Data format is incomplete, please ensure all required fields are filled'
    ElMessage.error(importError.value)
    return false
  }

  return true
}

// 下载模板
const downloadTemplate = () => {
  const template = [
    {
      state: 'CA',
      fromZipcode: '90001',
      toZipcode: '96162',
      warehouseCode: 'LAX1',
      warehouseName: 'Los Angeles Warehouse'
    }
  ]
  
  const ws = utils.json_to_sheet(template)
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Zipcode Range Template')
  writeFile(wb, 'Warehouse Zipcode Range Import Template.xlsx')
}

// 删除单条数据
const handleDelete = (index: number) => {
  const realIndex = (currentPage.value - 1) * pageSize.value + index
  zipcodeData.value.splice(realIndex, 1)
  ElMessage.success('Delete successful')
}

// 清空所有数据
const handleRemoveAll = () => {
  ElMessageBox.confirm(
    'This will permanently delete all data. Continue?',
    'Warning',
    {
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
      cancelButtonClass: 'el-button--info',
      draggable: true,
      closeOnClickModal: false,
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          setTimeout(() => {
            zipcodeData.value = []
            currentPage.value = 1
            searchQuery.value = ''
            selectedState.value = ''
            instance.confirmButtonLoading = false
            ElMessage.success('All data has been removed')
            done()
          }, 300)
        } else {
          done()
        }
      }
    }
  )
}

// 修改取消导入函数
const cancelImport = () => {
  importedData.value = []
  importDialogVisible.value = false
}

// 修改确认导入函数
const confirmImport = async () => {
  importing.value = true
  try {
    const newData = [...importedData.value]
    
    if (duplicateRecords.value.length > 0) {
      switch (duplicateHandling.value) {
        case 'skip':
          // 跳过重复记录
          newData.forEach(record => {
            const isDuplicate = duplicateRecords.value.some(r => 
              r.state === record.state && 
              r.warehouseCode === record.warehouseCode
            )
            if (!isDuplicate) {
              zipcodeData.value.push(record)
            }
          })
          break
          
        case 'update':
          // 更新重复记录
          newData.forEach(record => {
            const existingIndex = zipcodeData.value.findIndex(r => 
              r.state === record.state && 
              r.warehouseCode === record.warehouseCode
            )
            if (existingIndex > -1) {
              zipcodeData.value[existingIndex] = record
            } else {
              zipcodeData.value.push(record)
            }
          })
          break
          
        case 'append':
          // 全部作为新记录添加
          zipcodeData.value.push(...newData)
          break
      }
    } else {
      // 没有重复记录，直接添加
      zipcodeData.value.push(...newData)
    }
    
    ElMessage.success(`Successfully imported ${newData.length} records`)
    importedData.value = []
    duplicateRecords.value = []
    importDialogVisible.value = false
  } catch (error) {
    ElMessage.error('Import failed, please try again')
  } finally {
    importing.value = false
  }
}

// 生成模拟数据
const generateMockData = () => {
  const mockData: ZipcodeRange[] = []
  const warehouses = [
    { code: 'LAX1', name: 'Los Angeles Warehouse' },
    { code: 'NYC1', name: 'New York City Warehouse' },
    { code: 'DFW1', name: 'Dallas Fort Worth Warehouse' },
    { code: 'MIA1', name: 'Miami Warehouse' },
    { code: 'CHI1', name: 'Chicago Warehouse' }
  ]

  // 只生成10条数据
  for (let i = 0; i < 10; i++) {
    const state = states[Math.floor(Math.random() * states.length)]
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)]
    const fromZip = Math.floor(10000 + Math.random() * 90000).toString()
    const toZip = Math.floor(Number(fromZip) + Math.random() * 5000).toString()
    mockData.push({
      state,
      fromZipcode: fromZip,
      toZipcode: toZip,
      warehouseCode: warehouse.code,
      warehouseName: warehouse.name,
      createdTime: new Date().toISOString()
    })
  }

  zipcodeData.value = mockData
}

// 组件挂载时生成模拟数据
onMounted(() => {
  generateMockData()
})

// 获取去重后的州列表
const uniqueStates = computed(() => {
  const stateSet = new Set(zipcodeData.value.map(item => item.state))
  return Array.from(stateSet).sort()
})

// 编辑相关
const editIndex = ref<number>(-1)

// 修改新增记录函数
const handleAdd = () => {
  isEdit.value = false
  editIndex.value = -1
  formData.value = {
    state: '',
    fromZipcode: '',
    toZipcode: '',
    warehouseCode: '',
    warehouseName: '',
    createdTime: ''
  }
  editDialogVisible.value = true
}

// 添加编辑记录函数
const handleEdit = (row: ZipcodeRange) => {
  isEdit.value = true
  editIndex.value = zipcodeData.value.findIndex(item => 
    item.state === row.state && 
    item.fromZipcode === row.fromZipcode && 
    item.toZipcode === row.toZipcode && 
    item.warehouseCode === row.warehouseCode
  )
  formData.value = { ...row }
  editDialogVisible.value = true
}

// 修改保存记录函数
const handleSaveRecord = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 验证邮编范围
      const from = parseInt(formData.value.fromZipcode)
      const to = parseInt(formData.value.toZipcode)
      if (from > to) {
        ElMessage.error('From zipcode cannot be greater than to zipcode')
        return
      }

      // 检查是否存在相同州和仓库的记录
      const existingRecordIndex = zipcodeData.value.findIndex(item => 
        item.state === formData.value.state && 
        item.warehouseCode === formData.value.warehouseCode &&
        item.fromZipcode === formData.value.fromZipcode &&
        item.toZipcode === formData.value.toZipcode
      )

      // 检查邮编范围重叠
      const hasOverlap = zipcodeData.value.some((item, index) => {
        if (isEdit.value && index === editIndex.value) return false
        if (item.warehouseCode !== formData.value.warehouseCode) return false
        
        const existingFrom = parseInt(item.fromZipcode)
        const existingTo = parseInt(item.toZipcode)
        
        return (
          (from >= existingFrom && from <= existingTo) ||
          (to >= existingFrom && to <= existingTo) ||
          (from <= existingFrom && to >= existingTo)
        )
      })

      if (hasOverlap) {
        ElMessage.error('Zipcode range overlaps with existing range for the same warehouse')
        return
      }

      if (existingRecordIndex > -1 && !isEdit.value) {
        // 存在完全相同的记录，更新它
        zipcodeData.value[existingRecordIndex] = {
          ...formData.value,
          createdTime: new Date().toISOString()
        }
        ElMessage.success('Record updated successfully')
      } else if (isEdit.value && editIndex.value > -1) {
        // 更新现有记录
        zipcodeData.value[editIndex.value] = {
          ...formData.value,
          createdTime: new Date().toISOString()
        }
        ElMessage.success('Record updated successfully')
      } else {
        // 添加新记录
        zipcodeData.value.push({
          ...formData.value,
          createdTime: new Date().toISOString()
        })
        ElMessage.success('Record saved successfully')
      }
      
      editDialogVisible.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  margin-bottom: 24px;
  
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

.operation-section {
  margin-bottom: 24px;
}

.operation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.search-area {
  display: flex;
  gap: 16px;
  flex: 1;

  .search-input {
    max-width: 300px;
  }

  .state-select {
    width: 120px;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.upload-hidden {
  display: inline-block;
}

.data-section {
  .el-table {
    margin-top: 0;
    
    :deep(th) {
      background-color: var(--el-fill-color-light);
      color: var(--el-text-color-primary);
      font-weight: 600;
      padding: 12px;
      height: 48px;
    }
    
    :deep(td) {
      padding: 12px;
      height: 48px;
    }

    :deep(.el-table__body) {
      min-height: 480px; // 10行 * 48px = 480px
    }

    .zipcode {
      font-family: 'Courier New', Courier, monospace;
      font-weight: 600;
      color: var(--el-text-color-primary);
      display: inline-block;
      width: 100%;
    }

    .state-text, .warehouse-code {
      font-weight: 600;
      color: var(--el-text-color-primary);
      display: inline-block;
      width: 100%;
    }
  }
}

.pagination-container {
  margin-top: 16px;
  padding: 0 4px;
  display: flex;
  justify-content: flex-end;
  height: 32px;
  line-height: 32px;
}

.import-dialog-content {
  .import-alert {
    margin-bottom: 16px;
  }

  .upload-area {
    width: 100%;
  }
}

:deep(.el-upload-dragger) {
  background: var(--bg-light);
  border-color: var(--border-color);
  width: 100%;
  
  &:hover {
    border-color: var(--primary-color);
  }
}

.el-upload__tip {
  color: var(--text-secondary);
}

.import-options {
  margin-bottom: 20px;
  
  .duplicate-alert {
    margin-bottom: 16px;
  }
  
  .handling-options {
    display: flex;
    gap: 24px;
    margin-top: 12px;
  }
}

.preview-title {
  font-weight: 500;
  margin: 16px 0;
}

:deep(.el-tag) {
  width: 80px;
  text-align: center;
  
  &.el-tag--warning {
    background-color: var(--el-color-warning-light-9);
    border-color: var(--el-color-warning-light-8);
    color: var(--el-color-warning);
  }
  
  &.el-tag--success {
    background-color: var(--el-color-success-light-9);
    border-color: var(--el-color-success-light-8);
    color: var(--el-color-success);
  }
}

.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .dialog-button {
    min-width: 120px;
    font-weight: 500;
  }
}

.full-width {
  width: 100%;
}

.edit-form {
  padding: 20px 40px;
  
  :deep(.el-form-item) {
    margin-bottom: 24px;
    
    .el-form-item__label {
      font-weight: 500;
      font-size: 14px;
      line-height: 32px;
      white-space: nowrap;
    }
    
    .el-form-item__content {
      margin-left: 140px !important;
      min-width: 300px;
    }
  }

  .zipcode-input {
    width: 200px;
  }

  .warehouse-input {
    width: 300px;
  }
}

:deep(.el-dialog) {
  .el-dialog__header {
    margin: 0;
    padding: 20px 24px;
    border-bottom: 1px solid var(--el-border-color-light);
    
    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    border-top: 1px solid var(--el-border-color-light);
    padding: 24px;
  }
}

.action-text {
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
  
  &.purple {
    color: #8B5CF6;
  }
  
  &.danger {
    color: var(--el-color-danger);
  }
}
</style> 