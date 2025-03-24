<template>
  <div class="product-mapping">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input v-model="searchForm.originalSku" placeholder="Original SKU" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="searchForm.newSku" placeholder="NEW SKU" clearable filterable>
        <el-option v-for="item in newSkuOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="searchForm.channel" placeholder="Channel" clearable>
        <el-option label="shopify (QQQ)" value="QQQ" />
        <el-option label="Others" value="others" />
      </el-select>
      <el-select v-model="searchForm.source" placeholder="Source" clearable>
        <el-option label="EDI" value="EDI" />
        <el-option label="WMS" value="WMS" />
        <el-option label="DI" value="DI" />
      </el-select>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" style="width: 100%" class="mapping-table">
      <el-table-column prop="orgSku" label="ORG SKU" min-width="180">
        <template #default="{ row }">
          <span class="sku-cell">{{ row.orgSku }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newSku" label="NEW SKU" min-width="180">
        <template #default="{ row }">
          <span class="sku-cell">{{ row.newSku }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyToChannel" label="APPLY TO CHANNEL" min-width="180">
        <template #default="{ row }">
          <el-tag size="small" type="info">
            {{ row.applyToChannel === 'QQQ' ? 'shopify (QQQ)' : row.applyToChannel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="source" label="SOURCE" min-width="150">
        <template #default="{ row }">
          <el-tag size="small" type="success" v-if="row.source">{{ row.source }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="OPERATIONS" width="120" fixed="right">
        <template #default="{ row }">
          <div class="operation-buttons">
            <el-tooltip content="Edit" placement="top">
              <el-button type="primary" :icon="Edit" circle link @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip content="Delete" placement="top">
              <el-button type="danger" :icon="Delete" circle link @click="handleDelete(row)" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add/Edit Product 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Edit Product Mapping' : 'New Product Mapping'"
      width="500px"
      destroy-on-close
      class="product-dialog"
    >
      <div class="mapping-form">
        <div class="form-item">
          <div class="form-label">
            Apply To Channel
            <span class="required">*</span>
          </div>
          <el-select 
            v-model="form.channel" 
            placeholder="Select channel"
            class="form-select"
            @change="handleChannelChange"
          >
            <el-option label="shopify (QQQ)" value="QQQ" />
            <el-option label="Others" value="others" />
          </el-select>
        </div>
        
        <div class="form-item">
          <div class="form-label">Source</div>
          <el-select 
            v-model="form.source" 
            placeholder="Select source"
            class="form-select"
            clearable
          >
            <el-option label="EDI" value="EDI" />
            <el-option label="WMS" value="WMS" />
            <el-option label="DI" value="DI" />
          </el-select>
        </div>

        <div class="form-group">
          <div class="form-item">
            <div class="form-label">
              Original SKU
              <span class="required">*</span>
            </div>
            <el-select
              v-model="form.originalSku"
              placeholder="Select or input SKU"
              :disabled="!form.channel"
              filterable
              allow-create
              class="form-select"
            >
              <el-option
                v-for="sku in channelSkuOptions"
                :key="sku"
                :label="sku"
                :value="sku"
              />
            </el-select>
          </div>

          <div class="arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>

          <div class="form-item">
            <div class="form-label">
              NEW SKU
              <span class="required">*</span>
            </div>
            <el-select
              v-model="form.newSku"
              placeholder="Select NEW SKU"
              filterable
              allow-create
              class="form-select"
            >
              <el-option
                v-for="sku in newSkuOptions"
                :key="sku"
                :label="sku"
                :value="sku"
              />
            </el-select>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button class="cancel-btn" @click="dialogVisible = false">Cancel</el-button>
        <el-button class="submit-btn" type="primary" @click="handleSubmit">
          Add Mapping
        </el-button>
      </template>
    </el-dialog>

    <!-- Bulk Import 弹窗 -->
    <el-dialog
      v-model="importDialogVisible"
      title="Import Products"
      width="600px"
      destroy-on-close
      class="import-dialog"
    >
      <div class="import-container">
        <div class="import-header">
          <div class="import-title">
            <span class="label">Upload File</span>
            <el-link type="primary" :underline="false" @click="downloadTemplate">
              <el-icon><Download /></el-icon>
              Download template
            </el-link>
          </div>
          <div class="import-desc">
            Support formats: .xlsx, .xls (max 4MB)
          </div>
        </div>
        
        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          accept=".xlsx,.xls"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
        </el-upload>

        <div class="import-rules">
          <div class="rules-title">Import Rules:</div>
          <ul class="rules-list">
            <li>Required fields: Apply to channel, Original SKU, NEW SKU</li>
            <li>Source field is optional</li>
            <li>Channel format should be correct (e.g. shopify)</li>
            <li>Combination of "Apply to channel + Source + Original SKU" must be unique</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleImportSubmit">Upload</el-button>
      </template>
    </el-dialog>

    <!-- 导入结果弹窗 -->
    <el-dialog
      v-model="resultDialogVisible"
      title="Import Result"
      width="500px"
      class="result-dialog"
    >
      <div class="import-result">
        <div class="result-summary">
          <el-result
            :icon="importResult.failed > 0 ? 'warning' : 'success'"
            :title="getResultTitle()"
            :sub-title="getResultSubTitle()"
          >
            <template #extra>
              <el-button type="primary" @click="resultDialogVisible = false">OK</el-button>
              <el-button v-if="importResult.failed > 0" @click="copyFailedDetails">
                Copy Failed Details
              </el-button>
            </template>
          </el-result>
        </div>
        <div v-if="importResult.failed > 0" class="failed-details">
          <div class="details-title">Failed Details:</div>
          <el-scrollbar height="200px">
            <ul class="details-list">
              <li v-for="(reason, index) in importResult.reasons" :key="index">
                {{ reason }}
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  Plus, 
  Upload, 
  Search, 
  Edit, 
  Delete, 
  UploadFilled, 
  Download,
  ArrowRight
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 搜索相关
const searchForm = reactive({
  originalSku: '',
  newSku: '',
  channel: '',
  source: ''
})

const newSkuOptions = ref(['SKU001', 'SKU002', 'SKU003'])

// 表格数据
const tableData = ref([
  {
    orgSku: 'xybv',
    newSku: 'Orange',
    applyToChannel: 'QQQ',
    source: 'DI'
  },
  {
    orgSku: '1',
    newSku: 'DDD',
    applyToChannel: 'QQQ',
    source: 'Public API'
  }
])

// 表单相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  channel: '',
  source: '',
  originalSku: '',
  newSku: ''
})
const channelSkuOptions = ref<string[]>([])

const formRules: FormRules = {
  channel: [{ required: true, message: 'Please select channel', trigger: 'change' }],
  originalSku: [{ required: true, message: 'Please input original SKU', trigger: 'change' }],
  newSku: [{ required: true, message: 'Please input NEW SKU', trigger: 'change' }]
}

// Bulk Import 相关
const importDialogVisible = ref(false)
const resultDialogVisible = ref(false)
const importResult = reactive({
  success: 0,
  failed: 0,
  reasons: [] as string[]
})

// 计算属性
const getResultTitle = () => {
  if (importResult.failed === 0) {
    return 'Import Successful'
  }
  return 'Partially Imported'
}

const getResultSubTitle = () => {
  const parts = []
  if (importResult.success > 0) {
    parts.push(`${importResult.success} items imported successfully`)
  }
  if (importResult.failed > 0) {
    parts.push(`${importResult.failed} items failed`)
  }
  return parts.join(', ')
}

// 处理函数
const handleChannelChange = (value: string) => {
  if (value) {
    channelSkuOptions.value = ['SKU001', 'SKU002', 'SKU003']
  } else {
    channelSkuOptions.value = []
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('Submit:', form)
      dialogVisible.value = false
    }
  })
}

const handleEdit = (row: any) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    'Are you sure to delete this mapping?',
    'Warning',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    console.log('Delete:', row)
    ElMessage({
      type: 'success',
      message: 'Deleted successfully',
    })
  })
}

const handleFileChange = (file: any) => {
  console.log('Selected file:', file)
}

const downloadTemplate = () => {
  // 实现模板下载逻辑
}

const handleImportSubmit = () => {
  // 模拟导入结果
  importResult.success = 5
  importResult.failed = 2
  importResult.reasons = [
    'Row 3: Invalid channel format',
    'Row 5: Duplicate mapping found'
  ]
  importDialogVisible.value = false
  resultDialogVisible.value = true
}

const copyFailedDetails = () => {
  const text = importResult.reasons.join('\n')
  navigator.clipboard.writeText(text)
  ElMessage({
    type: 'success',
    message: 'Copied to clipboard',
  })
}

// 暴露方法给父组件
defineExpose({
  handleAddProduct: () => {
    isEdit.value = false
    Object.assign(form, {
      channel: '',
      source: '',
      originalSku: '',
      newSku: ''
    })
    dialogVisible.value = true
  },
  handleBulkImport: () => {
    importDialogVisible.value = true
  }
})
</script>

<style lang="scss" scoped>
.product-mapping {
  .search-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
    align-items: center;

    .el-input,
    .el-select {
      width: 220px;
    }
  }

  .mapping-table {
    background: var(--el-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);

    .sku-cell {
      font-family: monospace;
      color: var(--el-text-color-primary);
    }

    .operation-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
  }
}

.product-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    background: var(--el-bg-color-overlay);
    
    .el-dialog__header {
      margin: 0;
      padding: 20px 24px;
      border-bottom: 1px solid var(--el-border-color-light);

      .el-dialog__title {
        font-size: 18px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }

    .el-dialog__body {
      padding: 24px;
    }

    .el-dialog__footer {
      padding: 16px 24px;
      border-top: 1px solid var(--el-border-color-light);
    }
  }

  .mapping-form {
    .form-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .form-label {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--el-text-color-regular);
      }

      .required {
        color: var(--el-color-danger);
        margin-left: 4px;
      }

      .el-select {
        width: 100%;
      }
    }

    .form-group {
      display: flex;
      align-items: flex-end;
      gap: 12px;

      .form-item {
        flex: 1;
        margin-bottom: 0;
      }

      .arrow {
        padding-bottom: 10px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .cancel-btn {
    border-color: var(--el-border-color-light);
    
    &:hover {
      border-color: var(--el-border-color-hover);
      background: var(--el-fill-color-light);
    }
  }

  .submit-btn {
    background: #9D5FFE;
    border-color: #9D5FFE;
    
    &:hover {
      background: #8445e9;
      border-color: #8445e9;
    }
  }
}

.import-dialog {
  .import-container {
    .import-header {
      margin-bottom: 24px;

      .import-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .label {
          font-size: 16px;
          font-weight: 500;
        }
      }

      .import-desc {
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }

    .upload-area {
      margin-bottom: 24px;

      :deep(.el-upload-dragger) {
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        .el-icon--upload {
          font-size: 48px;
          margin-bottom: 12px;
          color: var(--el-color-primary);
        }

        .el-upload__text {
          text-align: center;
          color: var(--el-text-color-regular);

          em {
            color: var(--el-color-primary);
            font-style: normal;
          }
        }
      }
    }

    .import-rules {
      background: var(--el-fill-color-light);
      padding: 16px;
      border-radius: 8px;

      .rules-title {
        font-weight: 500;
        margin-bottom: 8px;
      }

      .rules-list {
        margin: 0;
        padding-left: 20px;
        color: var(--el-text-color-regular);

        li {
          margin-bottom: 4px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.result-dialog {
  .import-result {
    .result-summary {
      text-align: center;
    }

    .failed-details {
      margin-top: 24px;
      
      .details-title {
        font-weight: 500;
        margin-bottom: 12px;
      }

      .details-list {
        margin: 0;
        padding-left: 20px;
        color: var(--el-text-color-regular);

        li {
          margin-bottom: 8px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style> 