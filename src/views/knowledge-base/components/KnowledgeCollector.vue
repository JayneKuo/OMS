<template>
  <div class="knowledge-collector">
    <el-card class="feature-card">
      <template #header>
        <div class="card-header">
          <h3>文件上传</h3>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="openUploadDialog">
              <el-icon><plus /></el-icon>上传文件
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="content-area">
        <div v-if="fileList.length === 0" class="empty-tip">
          <el-empty description="暂无已上传知识文件" />
          <el-button type="primary" @click="openUploadDialog">立即上传</el-button>
        </div>
        
        <el-table v-else :data="fileList" style="width: 100%">
          <el-table-column prop="title" label="文件名" min-width="200">
            <template #default="scope">
              <div class="file-name">
                <el-icon class="file-icon"><document /></el-icon>
                <span>{{ scope.row.title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="format" label="格式" width="80" />
          <el-table-column prop="createdAt" label="上传时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="viewDetail(scope.row)">查看</el-button>
              <el-button link type="primary" size="small" @click="editItem(scope.row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="confirmDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container" v-if="fileList.length > 0">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalItems"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>
    
    <el-card class="feature-card">
      <template #header>
        <div class="card-header">
          <h3>网页采集</h3>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="openWebCollectDialog">
              <el-icon><plus /></el-icon>添加采集
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="web-collect-form">
        <el-form :model="webCollectForm" label-width="80px">
          <el-form-item label="网页URL">
            <el-input v-model="webCollectForm.url" placeholder="输入网页地址" clearable>
              <template #append>
                <el-button @click="collectWebPage">采集</el-button>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item label="标签">
            <el-select
              v-model="webCollectForm.tags"
              multiple
              filterable
              allow-create
              placeholder="选择或创建标签"
            >
              <el-option
                v-for="tag in availableTags"
                :key="tag"
                :label="tag"
                :value="tag"
              />
            </el-select>
          </el-form-item>
        </el-form>
        
        <div class="collector-tip">
          <el-alert
            title="提示: 安装SurfSense浏览器插件可实现更精准的网页内容采集"
            type="info"
            :closable="false"
            show-icon
          />
        </div>
      </div>
    </el-card>
    
    <!-- 上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="添加知识来源"
      width="900px"
      class="knowledge-upload-dialog"
    >
      <div class="upload-dialog-layout">
        <!-- 左侧来源列表 -->
        <div class="source-list">
          <div class="source-list-header">
            <span>知识来源</span>
            <el-button type="primary" link @click="addNewSource">
              <el-icon><plus /></el-icon>添加来源
            </el-button>
          </div>
          
          <div class="source-items">
            <el-checkbox-group v-model="selectedSources">
              <div v-for="source in sourceList" :key="source.id" class="source-item" 
                   :class="{ active: currentSource?.id === source.id }"
                   @click="selectSource(source)">
                <el-checkbox :label="source.id">
                  <div class="source-info">
                    <el-icon><component :is="getSourceIcon(source.type)" /></el-icon>
                    <span class="source-name">{{ source.name }}</span>
                    <el-tag size="small" :type="getSourceStatusType(source.status)">
                      {{ getSourceStatusText(source.status) }}
                    </el-tag>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>

        <!-- 右侧来源详情 -->
        <div class="source-detail">
          <template v-if="currentSource">
            <div class="detail-header">
              <h3>{{ currentSource.name }}</h3>
              <div class="source-meta">
                <span>{{ formatSourceType(currentSource.type) }}</span>
                <span>{{ formatFileSize(currentSource.size) }}</span>
                <span>{{ formatDate(currentSource.createdAt) }}</span>
              </div>
            </div>
            
            <div class="detail-content">
              <div class="preview-section">
                <h4>内容预览</h4>
                <div class="preview-content">{{ currentSource.preview }}</div>
              </div>
              
              <div class="tags-section">
                <h4>关键主题</h4>
                <div class="tag-list">
                  <el-tag
                    v-for="tag in currentSource.tags"
                    :key="tag"
                    closable
                    @close="removeTag(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-button class="button-new-tag" size="small" @click="showTagInput">
                    <el-icon><plus /></el-icon>
                  </el-button>
                </div>
              </div>
              
              <div class="summary-section">
                <h4>摘要</h4>
                <el-input
                  v-model="currentSource.summary"
                  type="textarea"
                  rows="3"
                  placeholder="输入摘要描述"
                />
              </div>
            </div>
          </template>
          
          <div v-else class="empty-detail">
            <el-empty description="选择左侧来源查看详情" />
          </div>
        </div>
      </div>
      
      <!-- 添加来源弹窗 -->
      <el-dialog
        v-model="addSourceDialogVisible"
        title="添加来源"
        width="600px"
        append-to-body
      >
        <div class="add-source-content">
          <el-tabs v-model="activeSourceType">
            <el-tab-pane label="文件上传" name="file">
              <el-upload
                class="upload-area"
                drag
                action="#"
                :auto-upload="false"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                multiple
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持PDF、Word、Excel、PPT、Markdown等格式，单文件不超过100MB
                  </div>
                </template>
              </el-upload>
            </el-tab-pane>
            
            <el-tab-pane label="网页采集" name="web">
              <el-form :model="webSourceForm" label-width="80px">
                <el-form-item label="网页URL">
                  <el-input v-model="webSourceForm.url" placeholder="输入网页地址" />
                </el-form-item>
                <el-form-item label="关键词">
                  <el-input v-model="webSourceForm.name" placeholder="输入关键词" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <el-tab-pane label="API接口" name="api">
              <el-form :model="apiSourceForm" label-width="80px">
                <el-form-item label="接口名称">
                  <el-input v-model="apiSourceForm.name" placeholder="输入接口名称" />
                </el-form-item>
                <el-form-item label="接口地址">
                  <el-input v-model="apiSourceForm.endpoint" placeholder="输入接口地址" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addSourceDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmAddSource">确定</el-button>
          </span>
        </template>
      </el-dialog>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :disabled="selectedSources.length === 0">
            处理选中来源
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑知识条目"
      width="600px"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editForm.title" placeholder="输入标题" />
        </el-form-item>
        
        <el-form-item label="标签">
          <el-select
            v-model="editForm.tags"
            multiple
            filterable
            allow-create
            placeholder="选择或创建标签"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="内容">
          <el-input
            v-model="editForm.content"
            type="textarea"
            rows="5"
            placeholder="输入内容"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="currentDetail.title"
      width="800px"
    >
      <div class="detail-content">
        <div class="detail-header">
          <div class="detail-info">
            <div class="info-item">
              <label>来源：</label>
              <span>{{ currentDetail.source }}</span>
            </div>
            <div class="info-item">
              <label>格式：</label>
              <span>{{ currentDetail.format }}</span>
            </div>
            <div class="info-item">
              <label>创建时间：</label>
              <span>{{ formatDate(currentDetail.createdAt) }}</span>
            </div>
            <div class="info-item">
              <label>创建者：</label>
              <span>{{ currentDetail.creator }}</span>
            </div>
          </div>
          
          <div class="detail-tags">
            <el-tag 
              v-for="tag in currentDetail.tags" 
              :key="tag"
              size="small"
              style="margin-right: 5px;"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <div class="detail-body">
          <div class="content-preview">
            {{ currentDetail.content }}
          </div>
        </div>
        
        <div class="detail-footer">
          <div class="quality-info">
            <div class="quality-score">
              <span class="score-label">质量评分：</span>
              <el-progress 
                :percentage="currentDetail.quality" 
                :color="getQualityColor(currentDetail.quality)"
              />
            </div>
            <div class="view-count">
              <el-icon><view /></el-icon>
              <span>{{ currentDetail.viewCount }} 次查看</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { UploadFile, UploadFiles } from 'element-plus'
import { 
  Document, 
  Plus, 
  UploadFilled, 
  View 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { knowledgeService } from '@/mock/knowledgeData'
import type { KnowledgeItem } from '@/types/knowledge'
import { nanoid } from 'nanoid'
import { collectWebPage, collectApiData } from '@/api/knowledge'

// 类型定义
interface UploadFormData {
  tags: string[]
  description: string
}

interface EditFormData {
  id: string
  title: string
  tags: string[]
  content: string
}

interface WebCollectFormData {
  url: string
  tags: string[]
}

interface KnowledgeSource {
  id: string
  name: string
  type: 'file' | 'web' | 'api'
  status: 'pending' | 'processing' | 'processed' | 'failed'
  size: number
  createdAt: string
  preview: string
  tags: string[]
  summary?: string
}

// 数据加载与分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const fileList = ref<KnowledgeItem[]>([])

// 来源管理相关
const sourceList = ref<KnowledgeSource[]>([])
const selectedSources = ref<KnowledgeSource[]>([])
const currentSource = ref<KnowledgeSource | null>(null)
const addSourceDialogVisible = ref(false)
const activeSourceType = ref<'file' | 'web' | 'api'>('file')

// 来源表单
const webSourceForm = reactive({
  url: '',
  name: '',
  tags: [] as string[]
})

const apiSourceForm = reactive({
  endpoint: '',
  name: '',
  method: 'GET',
  headers: {} as Record<string, string>,
  params: {} as Record<string, string>,
  tags: [] as string[]
})

// 表单数据
const webCollectForm = reactive<WebCollectFormData>({
  url: '',
  tags: []
})

const uploadForm = reactive<UploadFormData>({
  tags: [],
  description: ''
})

const editForm = reactive<EditFormData>({
  id: '',
  title: '',
  tags: [],
  content: ''
})

// 对话框控制
const uploadDialogVisible = ref(false)
const editDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const webCollectDialogVisible = ref(false)

// 当前选中的详情项
const currentDetail = ref<KnowledgeItem>({} as KnowledgeItem)

// 上传文件列表
const uploadFileList = ref<File[]>([])

// 可用标签列表
const availableTags = ref([
  '产品', '技术', '市场', '客服', '培训',
  '规范', '流程', '报告', '设计', 'AI',
  '大数据', '入职', 'HR'
])

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态类型和文字
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'processing': 'warning',
    'processed': 'success',
    'failed': 'danger',
    'pending': 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'processing': '处理中',
    'processed': '已处理',
    'failed': '处理失败',
    'pending': '待处理'
  }
  return statusMap[status] || '未知状态'
}

// 获取质量评分颜色
const getQualityColor = (score: number) => {
  if (score >= 90) return '#67C23A'
  if (score >= 70) return '#E6A23C'
  return '#F56C6C'
}

// 获取来源图标
const getSourceIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    'file': 'Document',
    'web': 'Link',
    'api': 'Connection'
  }
  return iconMap[type] || 'Document'
}

// 获取来源状态样式
const getSourceStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'info',
    'processing': 'warning',
    'processed': 'success',
    'failed': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取来源状态文本
const getSourceStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': '待处理',
    'processing': '处理中',
    'processed': '已处理',
    'failed': '处理失败'
  }
  return statusMap[status] || '未知状态'
}

// 格式化来源类型
const formatSourceType = (type: string) => {
  const typeMap: Record<string, string> = {
    'file': '文件',
    'web': '网页',
    'api': 'API接口'
  }
  return typeMap[type] || '未知类型'
}

// 页面加载时获取数据
onMounted(async () => {
  await loadData()
})

// 加载知识条目数据
const loadData = async () => {
  try {
    const response = await knowledgeService.getKnowledgeList({
      page: currentPage.value,
      size: pageSize.value
    })
    
    fileList.value = response.data
    totalItems.value = response.total
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error('加载数据失败:', error)
  }
}

// 页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadData()
}

// 打开上传对话框
const openUploadDialog = () => {
  uploadDialogVisible.value = true
  uploadForm.tags = []
  uploadForm.description = ''
  uploadFileList.value = []
}

// 打开网页采集对话框
const openWebCollectDialog = () => {
  webCollectDialogVisible.value = true
  webCollectForm.url = ''
  webCollectForm.tags = []
}

// 文件变化处理
const handleFileChange = (file: UploadFile, fileList: UploadFiles) => {
  uploadFileList.value = fileList.map(f => f.raw as File)
  handleFileUpload(file.raw as File)
}

// 移除文件
const handleFileRemove = (file: UploadFile, fileList: UploadFiles) => {
  uploadFileList.value = fileList.map(f => f.raw as File)
}

// 清空上传列表
const clearUploadList = () => {
  uploadFileList.value = []
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 添加新来源
const addNewSource = () => {
  addSourceDialogVisible.value = true
  activeSourceType.value = 'file'
  webSourceForm.url = ''
  webSourceForm.name = ''
  apiSourceForm.name = ''
  apiSourceForm.endpoint = ''
}

// 选择来源
const selectSource = (source: KnowledgeSource) => {
  currentSource.value = source
}

// 移除标签
const removeTag = (tag: string) => {
  if (currentSource.value) {
    currentSource.value.tags = currentSource.value.tags.filter(t => t !== tag)
  }
}

// 显示标签输入
const showTagInput = () => {
  // 实现标签输入逻辑
}

// 处理文件上传
const handleFileUpload = (file: File) => {
  if (!file) return false
  
  const newSource: KnowledgeSource = {
    id: nanoid(),
    name: file.name,
    type: 'file',
    status: 'pending',
    size: file.size,
    createdAt: new Date().toISOString(),
    tags: [],
    preview: '正在解析文件内容...'
  }
  sourceList.value.push(newSource)
  
  // 开始解析文件内容
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    // 更新预览内容
    const sourceIndex = sourceList.value.findIndex(s => s.id === newSource.id)
    if (sourceIndex !== -1) {
      sourceList.value[sourceIndex].preview = content.slice(0, 500) + '...' // 只显示前500个字符
    }
  }
  reader.readAsText(file)
  
  return false // 阻止默认上传行为
}

// 确认添加来源
const confirmAddSource = async () => {
  try {
    if (activeSourceType.value === 'web') {
      const result = await collectWebPage({
        url: webSourceForm.url,
        name: webSourceForm.name,
        tags: webSourceForm.tags
      })
      if (result) {
        sourceList.value.push({
          id: result.id,
          name: webSourceForm.name,
          type: 'web',
          status: 'processing',
          size: 0,
          createdAt: new Date().toISOString(),
          preview: webSourceForm.url,
          tags: webSourceForm.tags,
          summary: ''
        })
        ElMessage.success('网页添加成功')
      }
    } else if (activeSourceType.value === 'api') {
      const result = await collectApiData({
        endpoint: apiSourceForm.endpoint,
        name: apiSourceForm.name,
        method: apiSourceForm.method,
        headers: apiSourceForm.headers,
        params: apiSourceForm.params,
        tags: apiSourceForm.tags
      })
      if (result) {
        sourceList.value.push({
          id: result.id,
          name: apiSourceForm.name,
          type: 'api',
          status: 'processing',
          size: 0,
          createdAt: new Date().toISOString(),
          preview: apiSourceForm.endpoint,
          tags: apiSourceForm.tags,
          summary: ''
        })
        ElMessage.success('API数据源添加成功')
      }
    }
    addSourceDialogVisible.value = false
  } catch (error) {
    console.error('添加来源失败:', error)
    ElMessage.error('添加来源失败')
  }
}

// 提交上传
const submitUpload = async () => {
  if (selectedSources.value.length === 0) {
    ElMessage.warning('请选择要处理的来源')
    return
  }
  
  try {
    // 更新选中来源的状态
    for (const source of selectedSources.value) {
      source.status = 'processing'
    }
    
    // 模拟处理过程
    await Promise.all(selectedSources.value.map(async source => {
      // 创建知识条目
      const newItem = await knowledgeService.createKnowledgeItem({
        title: source.name,
        content: source.preview || '内容处理中...',
        source: source.name,
        sourceType: source.type,
        format: source.type === 'file' ? source.name.split('.').pop() || 'unknown' : 'html',
        tags: source.tags,
        creator: '当前用户',
        isFavorite: false,
        size: source.size,
        quality: 0,
        viewCount: 0
      })
      
      // 更新来源状态
      source.status = 'processed'
      return newItem
    }))
    
    ElMessage.success(`成功处理 ${selectedSources.value.length} 个来源`)
    uploadDialogVisible.value = false
    
    // 刷新列表
    await loadData()
  } catch (error) {
    ElMessage.error('处理失败')
    console.error('处理失败:', error)
  }
}

// 查看详情
const viewDetail = async (item: KnowledgeItem) => {
  try {
    // 获取完整详情
    const detail = await knowledgeService.getKnowledgeDetail(item.id)
    currentDetail.value = detail
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
    console.error('获取详情失败:', error)
  }
}

// 编辑项目
const editItem = (item: KnowledgeItem) => {
  editForm.id = item.id
  editForm.title = item.title
  editForm.tags = [...item.tags]
  editForm.content = item.content
  
  editDialogVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  try {
    const updatedItem = await knowledgeService.updateKnowledgeItem(editForm.id, {
      title: editForm.title,
      content: editForm.content,
      tags: editForm.tags
    })
    
    // 更新列表中的项目
    const index = fileList.value.findIndex(item => item.id === editForm.id)
    if (index !== -1) {
      fileList.value[index] = updatedItem
    }
    
    ElMessage.success('更新成功')
    editDialogVisible.value = false
  } catch (error) {
    ElMessage.error('更新失败')
    console.error('更新失败:', error)
  }
}

// 确认删除
const confirmDelete = async (item: KnowledgeItem) => {
  try {
    await ElMessageBox.confirm('确定要删除这个文件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 从列表中移除
    const index = fileList.value.findIndex(f => f.id === item.id)
    if (index > -1) {
      fileList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}
</script>

<style lang="scss" scoped>
.knowledge-collector {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-card {
  width: 100%;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-weight: 500;
    }
  }
}

.content-area {
  min-height: 300px;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .file-icon {
    font-size: 18px;
    color: var(--el-color-primary);
  }
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  
  .el-button {
    margin-top: 20px;
  }
}

.web-collect-form {
  padding: 20px 0;
}

.collector-tip {
  margin-top: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.detail-content {
  .detail-header {
    margin-bottom: 20px;
    
    .detail-info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 10px;
      
      .info-item {
        label {
          color: var(--el-text-color-secondary);
          margin-right: 5px;
        }
      }
    }
    
    .detail-tags {
      margin-top: 10px;
    }
  }
  
  .detail-body {
    .content-preview {
      padding: 15px;
      background-color: var(--el-fill-color-light);
      border-radius: 4px;
      min-height: 200px;
      max-height: 400px;
      overflow-y: auto;
      white-space: pre-wrap;
    }
  }
  
  .detail-footer {
    margin-top: 20px;
    
    .quality-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .quality-score {
        display: flex;
        align-items: center;
        width: 60%;
        
        .score-label {
          white-space: nowrap;
          margin-right: 10px;
          color: var(--el-text-color-secondary);
        }
      }
      
      .view-count {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.upload-dialog-layout {
  display: flex;
  gap: 20px;
}

.source-list {
  width: 30%;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  
  .source-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    span {
      font-weight: 500;
    }
  }
  
  .source-items {
    .source-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid var(--el-border-color);
      
      &.active {
        background-color: var(--el-fill-color-light);
      }
      
      .source-info {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .source-name {
          font-weight: 500;
        }
      }
    }
  }
}

.source-detail {
  width: 70%;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  
  .detail-header {
    margin-bottom: 20px;
  }
  
  .detail-content {
    .preview-section {
      margin-bottom: 20px;
      
      .preview-content {
        padding: 15px;
        background-color: var(--el-fill-color-light);
        border-radius: 4px;
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
        white-space: pre-wrap;
      }
    }
    
    .tags-section {
      margin-bottom: 20px;
      
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }
      
      .button-new-tag {
        margin-top: 10px;
      }
    }
    
    .summary-section {
      margin-bottom: 20px;
    }
  }
}

.add-source-content {
  padding: 20px;
}

.upload-area {
  flex: 1;
  border: 1px dashed var(--el-border-color);
  border-radius: 4px;
  padding: 20px;
  text-align: center;
}
</style> 