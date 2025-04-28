<template>
  <div class="knowledge-center dark-theme">
    <el-tabs v-model="activeTab" type="card" class="custom-tabs">
      <!-- 知识库搜索 -->
      <el-tab-pane label="知识库搜索" name="search">
        <knowledge-search />
      </el-tab-pane>

      <!-- 知识库 -->
      <el-tab-pane label="知识库" name="knowledge">
        <div class="knowledge-content">
          <div class="action-bar">
            <el-button type="primary" @click="handleCreate">
              <el-icon><Plus /></el-icon>新建知识
            </el-button>
            <el-button type="success" @click="handleCreateEnhanced">
              <el-icon><Connection /></el-icon>增强型知识处理
            </el-button>
            <router-link to="/knowledge-base/enhanced-editor">
              <el-button type="warning">
                <el-icon><Connection /></el-icon>直接链接到增强编辑器
              </el-button>
            </router-link>
          </div>
          <!-- 调试信息 -->
          <div v-if="routerError" class="router-error">
            <p>路由跳转错误: {{ routerError }}</p>
            <p>请尝试以下替代方案:</p>
            <ul>
              <li><a href="/knowledge-base/enhanced-editor" target="_blank">在新窗口打开</a></li>
              <li><button @click="redirectToEnhanced">使用location跳转</button></li>
            </ul>
          </div>
          <div class="knowledge-list">
            <div v-for="item in knowledgeList" :key="item.id" class="knowledge-card">
              <div class="card-header">
                <h3 class="title">{{ item.title }}</h3>
                <div class="operations">
                  <el-button link type="primary" @click="handleEdit(item)">
              <el-icon><Edit /></el-icon>
                </el-button>
                  <el-button link type="danger" @click="handleDelete(item)">
                    <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
              <p class="content">{{ item.content }}</p>
              <div class="meta">
                <span class="source">来源: {{ item.source }}</span>
                <span class="views">浏览: {{ item.viewCount }}</span>
                </div>
              <div class="tags">
                <el-tag v-for="tag in item.tags" :key="tag" size="small">
                  {{ tag }}
                              </el-tag>
                            </div>
                          </div>
                    </div>
                  </div>
                </el-tab-pane>
                
      <!-- 最近浏览 -->
      <el-tab-pane label="最近浏览" name="recent">
        <knowledge-collector :type="'recent'" />
                </el-tab-pane>
                
      <!-- 我的收藏 -->
      <el-tab-pane label="我的收藏" name="favorites">
        <knowledge-collector :type="'favorite'" />
                </el-tab-pane>
      
      <!-- 模板管理 -->
      <el-tab-pane label="模板管理" name="templates">
        <div class="template-management">
          <div class="action-bar">
            <el-button type="primary" @click="handleCreateTemplate">
              <el-icon><Plus /></el-icon>新建模板
            </el-button>
            <el-button type="success" @click="handleImportTemplate">
              <el-icon><Upload /></el-icon>导入模板
            </el-button>
          </div>
          
          <el-tabs v-model="templateTypeTab" class="template-type-tabs">
            <el-tab-pane label="业务场景模板" name="business">
              <div class="template-list">
                <div v-for="item in businessTemplates" :key="item.id" class="template-card">
                  <div class="card-header">
                    <h3 class="title">{{ item.name }}</h3>
                    <div class="operations">
                      <el-button link type="primary" @click="handleEditTemplate(item)">
                        <el-icon><Edit /></el-icon>
                      </el-button>
                      <el-button link type="danger" @click="handleDeleteTemplate(item)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                  <p class="description">{{ item.description }}</p>
                  <div class="tags">
                    <el-tag size="small">{{ item.category }}</el-tag>
                    <el-tag size="small" type="success">{{ item.type }}</el-tag>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="处理配置模板" name="processing">
              <div class="template-list">
                <div v-for="item in processingTemplates" :key="item.id" class="template-card">
                  <div class="card-header">
                    <h3 class="title">{{ item.name }}</h3>
                    <div class="operations">
                      <el-button link type="primary" @click="handleEditTemplate(item)">
                        <el-icon><Edit /></el-icon>
                      </el-button>
                      <el-button link type="danger" @click="handleDeleteTemplate(item)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                  <p class="description">{{ item.description }}</p>
                  <div class="tags">
                    <el-tag size="small">{{ item.category }}</el-tag>
                    <el-tag size="small" type="warning">{{ item.processingMode }}</el-tag>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingItem ? '编辑知识' : '新建知识'"
      width="60%"
    >
      <knowledge-editor
        v-if="dialogVisible"
        :knowledge="{
          id: editingItem?.id || '',
          title: editingItem?.title || '',
          content: editingItem?.content || '',
          type: 'document',
          tags: editingItem?.tags || [],
          status: editingItem?.status || 'draft'
        }"
        @save="handleSave"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
    
    <!-- 模板编辑对话框 -->
    <el-dialog
      v-model="templateDialogVisible"
      :title="editingTemplate ? '编辑模板' : '新建模板'"
      width="60%"
    >
      <template-editor
        v-if="templateDialogVisible"
        :template="editingTemplate || defaultTemplateData"
        @save="handleSaveTemplate"
        @cancel="templateDialogVisible = false"
      />
    </el-dialog>
    
    <!-- 导入模板对话框 -->
    <el-dialog
      v-model="importTemplateDialogVisible"
      title="导入模板"
      width="50%"
    >
      <el-form :model="importTemplateForm">
        <el-form-item label="模板名称">
          <el-input v-model="importTemplateForm.name" placeholder="输入模板名称" />
        </el-form-item>
        
        <el-form-item label="模板描述">
          <el-input v-model="importTemplateForm.description" type="textarea" placeholder="描述该模板的用途和特点" />
        </el-form-item>
        
        <el-form-item label="模板分类">
          <el-radio-group v-model="importTemplateForm.type">
            <el-radio label="business">业务场景模板</el-radio>
            <el-radio label="processing">处理配置模板</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="配置文件">
          <el-upload
            class="template-uploader"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleTemplateFileChange"
            accept=".json"
          >
            <el-icon class="el-icon--upload"><Upload /></el-icon>
            <div class="el-upload__text">拖拽JSON配置文件到此处或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                支持.json格式的模板配置文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importTemplateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmImportTemplate">确认导入</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-center {
  padding: 24px;
  min-height: 100vh;
  background: var(--el-bg-color-dark);
  color: var(--el-text-color-primary);

  .action-bar {
    margin-bottom: 20px;
  }

  .knowledge-content {
      padding: 20px;
  }

  .knowledge-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }
          
          .knowledge-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
            
            &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            }
            
            .card-header {
    display: flex;
      justify-content: space-between;
      align-items: flex-start;
              margin-bottom: 12px;
              
      .title {
          margin: 0;
          font-size: 18px;
        flex: 1;
      }

      .operations {
                    display: flex;
                    gap: 8px;
      }
    }

    .content {
      color: var(--el-text-color-regular);
                  margin: 0 0 16px;
                  line-height: 1.5;
          }
          
    .meta {
      display: flex;
      justify-content: space-between;
      color: var(--el-text-color-secondary);
              margin-bottom: 12px;
      font-size: 14px;
    }

    .tags {
        display: flex;
                  gap: 8px;
                flex-wrap: wrap;

      .el-tag {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        border-color: var(--el-color-primary-light-5);
      }
    }
  }
  
  // 模板管理样式
  .template-management {
    padding: 20px;
    
    .template-type-tabs {
      margin-top: 20px;
    }
    
    .template-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }
    
    .template-card {
      background: var(--el-bg-color);
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .title {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }
        
        .operations {
          display: flex;
          gap: 8px;
        }
      }
      
      .description {
        color: var(--el-text-color-regular);
        margin: 0 0 16px;
        line-height: 1.5;
      }
      
      .tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }
  }
  
  // 文件上传样式
  .template-uploader {
    width: 100%;
    
    .el-upload {
      width: 100%;
    }
    
    .el-upload-dragger {
      width: 100%;
      height: 180px;
    }
  }
}

// 暗色主题变量
:root {
  --el-color-primary: #8B5CF6;
  --el-color-primary-light-3: #A78BFA;
  --el-color-primary-light-5: #C4B5FD;
  --el-color-primary-light-7: #DDD6FE;
  --el-color-primary-light-9: #F5F3FF;
  
  --el-bg-color-dark: #1E1E2E;
  --el-bg-color: #2A2A3C;
  --el-border-color-darker: #363646;
  
  --el-text-color-primary: #E2E8F0;
  --el-text-color-regular: #CBD5E1;
  --el-text-color-secondary: #94A3B8;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus, Connection, Upload } from '@element-plus/icons-vue'
import KnowledgeSearch from './components/KnowledgeSearch.vue'
import KnowledgeEditor from './components/KnowledgeEditor.vue'
import KnowledgeCollector from './components/KnowledgeCollector.vue'
import TemplateEditor from './components/TemplateEditor.vue'
import type { KnowledgeItem } from '@/types/knowledge'
import { useRouter } from 'vue-router'

// 定义模板类型
interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: string;
  type?: string;
  processingMode?: string;
  config: any;
  createTime: string;
  updateTime: string;
  creator: string;
}

const activeTab = ref('search')
const dialogVisible = ref(false)
const editingItem = ref<KnowledgeItem | null>(null)
const router = useRouter()
const routerError = ref<string | null>(null)

// 模板管理相关状态
const templateTypeTab = ref('business')
const templateDialogVisible = ref(false)
const importTemplateDialogVisible = ref(false)
const editingTemplate = ref<TemplateItem | null>(null)
const importTemplateForm = ref({
  name: '',
  description: '',
  type: 'business',
  file: null
})

// 默认模板数据
const defaultTemplateData = {
  id: '',
  name: '',
  description: '',
  category: '通用',
  type: 'standard',
  config: {},
  createTime: new Date().toISOString(),
  updateTime: new Date().toISOString(),
  creator: 'admin'
}

// 处理创建
const handleCreate = () => {
  editingItem.value = null
  dialogVisible.value = true
}

// 直接使用location跳转
const redirectToEnhanced = () => {
  location.href = '/knowledge-base/enhanced-editor'
}

// 处理增强型知识处理
const handleCreateEnhanced = () => {
  console.log('正在跳转到增强型知识处理...')
  try {
    // 使用完整的路径进行跳转
    location.href = '/knowledge-base/enhanced-editor'
  } catch (error) {
    console.error('路由跳转失败:', error)
    routerError.value = error instanceof Error ? error.message : String(error)
  }
}

// 处理编辑
const handleEdit = (item: KnowledgeItem) => {
  editingItem.value = item
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (item: KnowledgeItem) => {
  try {
    await ElMessageBox.confirm('确定要删除这条知识吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用删除API
    console.log('删除知识:', item.id)
  } catch {
    // 用户取消删除
  }
}

// 处理保存
const handleSave = async (knowledge: KnowledgeItem) => {
  // TODO: 调用保存API
  console.log('保存知识:', knowledge)
  dialogVisible.value = false
}

// 模板管理相关方法
const handleCreateTemplate = () => {
  editingTemplate.value = null;
  templateDialogVisible.value = true;
}

const handleImportTemplate = () => {
  importTemplateForm.value = {
    name: '',
    description: '',
    type: 'business',
    file: null
  };
  importTemplateDialogVisible.value = true;
}

const handleEditTemplate = (template: TemplateItem) => {
  editingTemplate.value = template;
  templateDialogVisible.value = true;
}

const handleDeleteTemplate = async (template: TemplateItem) => {
  try {
    await ElMessageBox.confirm('确定要删除此模板吗？', '提示', {
      type: 'warning'
    });
    // TODO: 调用删除API
    console.log('删除模板:', template.id);
    
    // 从列表中移除
    if (template.processingMode) {
      processingTemplates.value = processingTemplates.value.filter(t => t.id !== template.id);
    } else {
      businessTemplates.value = businessTemplates.value.filter(t => t.id !== template.id);
    }
  } catch {
    // 用户取消删除
  }
}

const handleSaveTemplate = async (template: TemplateItem) => {
  // TODO: 调用保存API
  console.log('保存模板:', template);
  
  // 如果是编辑现有模板
  if (template.id) {
    if (template.processingMode) {
      const index = processingTemplates.value.findIndex(t => t.id === template.id);
      if (index !== -1) {
        processingTemplates.value[index] = template;
      }
    } else {
      const index = businessTemplates.value.findIndex(t => t.id === template.id);
      if (index !== -1) {
        businessTemplates.value[index] = template;
      }
    }
  } else {
    // 如果是新模板，为其分配ID
    template.id = Date.now().toString();
    template.createTime = new Date().toISOString();
    template.updateTime = new Date().toISOString();
    template.creator = 'admin';
    
    // 添加到相应列表
    if (template.processingMode) {
      processingTemplates.value.push(template);
    } else {
      businessTemplates.value.push(template);
    }
  }
  
  templateDialogVisible.value = false;
}

const handleTemplateFileChange = (file: any) => {
  importTemplateForm.value.file = file;
}

const confirmImportTemplate = async () => {
  if (!importTemplateForm.value.file) {
    ElMessageBox.alert('请上传模板配置文件', '提示');
    return;
  }
  
  // TODO: 实际处理文件上传和解析
  console.log('导入模板:', importTemplateForm.value);
  
  // 模拟导入成功
  const newTemplate: TemplateItem = {
    id: Date.now().toString(),
    name: importTemplateForm.value.name,
    description: importTemplateForm.value.description,
    category: '导入',
    type: importTemplateForm.value.type === 'business' ? '导入模板' : undefined,
    processingMode: importTemplateForm.value.type === 'processing' ? '自定义' : undefined,
    config: { /* 从文件中解析 */ },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: 'admin'
  };
  
  // 添加到相应列表
  if (importTemplateForm.value.type === 'processing') {
    processingTemplates.value.push(newTemplate);
  } else {
    businessTemplates.value.push(newTemplate);
  }
  
  importTemplateDialogVisible.value = false;
  ElMessageBox.alert('模板导入成功', '提示');
}

// 知识列表数据
const knowledgeList = ref<KnowledgeItem[]>([
  {
    id: '1',
    title: '产品开发流程指南',
    content: '详细描述了从需求收集到产品发布的全流程，包括各阶段的关键步骤和注意事项。',
    source: '研发部门',
    sourceType: 'manual',
    format: 'markdown',
    tags: ['产品', '开发', '流程'],
    creator: 'admin',
    status: 'processed',
    quality: 95,
    viewCount: 128,
    createdAt: '2024-04-09',
    updatedAt: '2024-04-09',
    isFavorite: false,
    size: 2.5
  },
  {
    id: '2',
    title: '客户服务标准手册',
    content: '规定了客户服务的各项标准和处理流程，确保服务质量的一致性和高效性。',
    source: '客服部门',
    sourceType: 'manual',
    format: 'markdown',
    tags: ['客服', '标准', '流程'],
    creator: 'admin',
    status: 'processed',
    quality: 90,
    viewCount: 256,
    createdAt: '2024-04-09',
    updatedAt: '2024-04-09',
    isFavorite: false,
    size: 3.2
  }
])

// 业务场景模板数据
const businessTemplates = ref<TemplateItem[]>([
  {
    id: 'bt1',
    name: '仓储管理标准模板',
    description: '适用于仓库日常管理、入库、出库、盘点等操作的标准业务模板',
    category: '仓储',
    type: '标准',
    config: { /* 配置数据 */ },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: 'system'
  },
  {
    id: 'bt2',
    name: '订单管理流程模板',
    description: '电商订单从下单到发货的全流程管理模板，包含订单状态跟踪',
    category: '电商',
    type: '流程',
    config: { /* 配置数据 */ },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: 'system'
  },
  {
    id: 'bt3',
    name: '客户服务知识库模板',
    description: '客服人员使用的标准应答和处理流程，提高客户满意度',
    category: '客户服务',
    type: '知识库',
    config: { /* 配置数据 */ },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: 'system'
  }
])

// 处理配置模板数据
const processingTemplates = ref<TemplateItem[]>([
  {
    id: 'pt1',
    name: '文档摘要提取',
    description: '从长文档中提取关键信息和摘要，适用于报告处理',
    category: '内容处理',
    processingMode: '摘要',
    config: { /* 配置数据 */ },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: 'system'
  },
  {
    id: 'pt2',
    name: '订单数据分析',
    description: '分析订单数据，提取关键指标和趋势，生成可视化报告',
    category: '数据分析',
    processingMode: '分析',
    config: { /* 配置数据 */ },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: 'system'
  },
  {
    id: 'pt3',
    name: '自动问答生成',
    description: '从知识库内容自动生成常见问题和答案，用于客服培训',
    category: '内容生成',
    processingMode: '问答',
    config: { /* 配置数据 */ },
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    creator: 'system'
  }
])
</script>