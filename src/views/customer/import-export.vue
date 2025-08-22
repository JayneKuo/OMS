<template>
  <div class="customer-import-export">
    <el-row :gutter="20">
      <!-- 导入客户数据 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>导入客户数据</span>
            </div>
          </template>
          
          <div class="import-section">
            <el-steps :active="importStep" finish-status="success">
              <el-step title="选择文件" />
              <el-step title="数据预览" />
              <el-step title="导入完成" />
            </el-steps>

            <div class="step-content">
              <!-- 步骤1: 选择文件 -->
              <div v-if="importStep === 0" class="step-1">
                <el-upload
                  ref="uploadRef"
                  class="upload-demo"
                  drag
                  :auto-upload="false"
                  :on-change="handleFileChange"
                  :before-upload="beforeUpload"
                  accept=".xlsx,.xls,.csv"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持 xlsx/xls/csv 格式文件，文件大小不超过10MB
                    </div>
                  </template>
                </el-upload>

                <div class="template-download">
                  <el-button type="primary" link @click="downloadTemplate">
                    下载导入模板
                  </el-button>
                </div>

                <div class="action-buttons">
                  <el-button 
                    type="primary" 
                    @click="nextStep" 
                    :disabled="!selectedFile"
                  >
                    下一步
                  </el-button>
                </div>
              </div>

              <!-- 步骤2: 数据预览 -->
              <div v-if="importStep === 1" class="step-2">
                <div class="preview-info">
                  <p>文件名：{{ selectedFile?.name }}</p>
                  <p>数据行数：{{ previewData.length }}</p>
                </div>

                <el-table :data="previewData" border style="width: 100%" max-height="300">
                  <el-table-column prop="name" label="客户名称" />
                  <el-table-column prop="contact" label="联系人" />
                  <el-table-column prop="phone" label="联系电话" />
                  <el-table-column prop="email" label="电子邮箱" />
                  <el-table-column prop="address" label="地址" />
                  <el-table-column prop="group" label="客户分组" />
                </el-table>

                <div class="action-buttons">
                  <el-button @click="prevStep">上一步</el-button>
                  <el-button type="primary" @click="startImport" :loading="importing">
                    开始导入
                  </el-button>
                </div>
              </div>

              <!-- 步骤3: 导入完成 -->
              <div v-if="importStep === 2" class="step-3">
                <el-result
                  icon="success"
                  title="导入完成"
                  :sub-title="`成功导入 ${importResult.success} 条数据，失败 ${importResult.failed} 条`"
                >
                  <template #extra>
                    <el-button type="primary" @click="resetImport">重新导入</el-button>
                    <el-button @click="viewImportLog">查看导入日志</el-button>
                  </template>
                </el-result>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 导出客户数据 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>导出客户数据</span>
            </div>
          </template>

          <div class="export-section">
            <el-form :model="exportForm" label-width="100px">
              <el-form-item label="导出格式">
                <el-radio-group v-model="exportForm.format">
                  <el-radio label="xlsx">Excel (.xlsx)</el-radio>
                  <el-radio label="csv">CSV (.csv)</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="导出范围">
                <el-radio-group v-model="exportForm.range">
                  <el-radio label="all">全部客户</el-radio>
                  <el-radio label="filtered">筛选结果</el-radio>
                  <el-radio label="selected">选中客户</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="客户分组" v-if="exportForm.range === 'filtered'">
                <el-select v-model="exportForm.groups" multiple placeholder="请选择客户分组">
                  <el-option
                    v-for="group in groupOptions"
                    :key="group.value"
                    :label="group.label"
                    :value="group.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="客户等级" v-if="exportForm.range === 'filtered'">
                <el-select v-model="exportForm.levels" multiple placeholder="请选择客户等级">
                  <el-option
                    v-for="level in levelOptions"
                    :key="level.value"
                    :label="level.label"
                    :value="level.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="导出字段">
                <el-checkbox-group v-model="exportForm.fields">
                  <el-checkbox label="name">客户名称</el-checkbox>
                  <el-checkbox label="contact">联系人</el-checkbox>
                  <el-checkbox label="phone">联系电话</el-checkbox>
                  <el-checkbox label="email">电子邮箱</el-checkbox>
                  <el-checkbox label="address">地址</el-checkbox>
                  <el-checkbox label="group">客户分组</el-checkbox>
                  <el-checkbox label="level">客户等级</el-checkbox>
                  <el-checkbox label="createTime">创建时间</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>

            <div class="export-actions">
              <el-button type="primary" @click="exportData" :loading="exporting">
                导出数据
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 导入历史 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>导入历史</span>
      </template>

      <el-table :data="importHistory" border style="width: 100%">
        <el-table-column prop="fileName" label="文件名" />
        <el-table-column prop="importTime" label="导入时间" />
        <el-table-column prop="totalCount" label="总数据量" />
        <el-table-column prop="successCount" label="成功数量" />
        <el-table-column prop="failedCount" label="失败数量" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
              {{ scope.row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link @click="viewLog(scope.row)">查看日志</el-button>
            <el-button type="danger" link @click="deleteHistory(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

// 导入相关
const importStep = ref(0)
const selectedFile = ref<File | null>(null)
const previewData = ref([])
const importing = ref(false)
const importResult = reactive({
  success: 0,
  failed: 0
})

// 导出相关
const exporting = ref(false)
const exportForm = reactive({
  format: 'xlsx',
  range: 'all',
  groups: [],
  levels: [],
  fields: ['name', 'contact', 'phone', 'email', 'address', 'group']
})

// 选项数据
const groupOptions = ref([
  { value: 'vip', label: 'VIP客户' },
  { value: 'regular', label: '普通客户' },
  { value: 'potential', label: '潜在客户' }
])

const levelOptions = ref([
  { value: 'diamond', label: '钻石会员' },
  { value: 'gold', label: '金牌会员' },
  { value: 'silver', label: '银牌会员' },
  { value: 'normal', label: '普通会员' }
])

// 导入历史
const importHistory = ref([
  {
    id: '1',
    fileName: 'customers_20240101.xlsx',
    importTime: '2024-01-01 10:30:00',
    totalCount: 1000,
    successCount: 980,
    failedCount: 20,
    status: 'success'
  }
])

// 文件上传相关
const uploadRef = ref()

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.type === 'application/vnd.ms-excel' ||
                  file.type === 'text/csv'
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isExcel) {
    ElMessage.error('只能上传 Excel 或 CSV 文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

// 步骤控制
const nextStep = () => {
  if (importStep.value === 0 && selectedFile.value) {
    // 模拟解析文件数据
    previewData.value = [
      {
        name: '测试客户1',
        contact: '张三',
        phone: '13800138000',
        email: 'test1@example.com',
        address: '北京市朝阳区xxx街道',
        group: 'VIP客户'
      },
      {
        name: '测试客户2',
        contact: '李四',
        phone: '13800138001',
        email: 'test2@example.com',
        address: '上海市浦东新区xxx街道',
        group: '普通客户'
      }
    ]
    importStep.value = 1
  }
}

const prevStep = () => {
  if (importStep.value > 0) {
    importStep.value--
  }
}

const startImport = async () => {
  importing.value = true
  try {
    // TODO: 调用后端API导入数据
    // await api.importCustomers(selectedFile.value)
    
    // 模拟导入过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    importResult.success = previewData.value.length - 1
    importResult.failed = 1
    importStep.value = 2
    
    ElMessage.success('导入完成')
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}

const resetImport = () => {
  importStep.value = 0
  selectedFile.value = null
  previewData.value = []
  uploadRef.value?.clearFiles()
}

// 下载模板
const downloadTemplate = () => {
  // TODO: 实现模板下载
  ElMessage.success('模板下载中...')
}

// 导出数据
const exportData = async () => {
  exporting.value = true
  try {
    // TODO: 调用后端API导出数据
    // const res = await api.exportCustomers(exportForm)
    
    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('导出完成，文件已下载')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

// 查看导入日志
const viewImportLog = () => {
  ElMessage.info('查看导入日志功能开发中...')
}

const viewLog = (row: any) => {
  ElMessage.info(`查看 ${row.fileName} 的导入日志`)
}

const deleteHistory = (row: any) => {
  ElMessageBox.confirm('确认删除该导入记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = importHistory.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      importHistory.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}
</script>

<style scoped>
.customer-import-export {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.import-section {
  padding: 20px 0;
}

.step-content {
  margin-top: 30px;
}

.step-1, .step-2, .step-3 {
  min-height: 200px;
}

.template-download {
  margin: 20px 0;
  text-align: center;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
}

.action-buttons .el-button {
  margin: 0 10px;
}

.preview-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preview-info p {
  margin: 5px 0;
  color: #606266;
}

.export-section {
  padding: 20px 0;
}

.export-actions {
  text-align: center;
  margin-top: 30px;
}

.upload-demo {
  margin-bottom: 20px;
}
</style>
