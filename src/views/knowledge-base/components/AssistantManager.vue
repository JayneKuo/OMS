<template>
  <div class="assistant-manager">
    <div class="manager-header">
      <h3>智能助手管理</h3>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><plus /></el-icon>创建助手
      </el-button>
    </div>
    
    <div class="assistant-list" v-loading="loading">
      <div v-if="assistants.length === 0 && !loading" class="empty-list">
        <el-empty description="暂无智能助手" />
        <el-button type="primary" @click="openCreateDialog">立即创建</el-button>
      </div>
      
      <div v-else class="assistants-grid">
        <el-card 
          v-for="assistant in assistants" 
          :key="assistant.id"
          class="assistant-card"
          shadow="hover"
        >
          <div class="card-header">
            <div class="assistant-icon">
              <el-icon><component :is="assistant.icon" /></el-icon>
            </div>
            <div class="assistant-info">
              <div class="assistant-name">{{ assistant.name }}</div>
              <div class="assistant-desc">{{ assistant.description }}</div>
            </div>
            <div class="assistant-status">
              <el-tag size="small" :type="assistant.isPublic ? 'success' : 'info'">
                {{ assistant.isPublic ? '公开' : '私有' }}
              </el-tag>
            </div>
          </div>
          
          <div class="card-body">
            <div class="assistant-capabilities">
              <div class="capabilities-title">能力：</div>
              <div class="capabilities-list">
                <el-tag
                  v-for="capability in assistant.config.capabilities"
                  :key="capability"
                  size="small"
                  class="capability-tag"
                >
                  {{ capability }}
                </el-tag>
              </div>
            </div>
            
            <div class="assistant-usage">
              <el-icon><view /></el-icon>
              <span>{{ assistant.usageCount }} 次使用</span>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="footer-info">
              <div class="creation-info">
                创建于：{{ formatDate(assistant.createTime) }}
              </div>
            </div>
            <div class="footer-actions">
              <el-tooltip content="与助手对话" placement="top">
                <el-button circle size="small" @click="chatWithAssistant(assistant)">
                  <el-icon><chat-dot-round /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="编辑助手" placement="top">
                <el-button circle size="small" @click="editAssistant(assistant)">
                  <el-icon><edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除助手" placement="top">
                <el-button circle size="small" type="danger" @click="confirmDelete(assistant)">
                  <el-icon><delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑智能助手' : '创建智能助手'"
      width="600px"
    >
      <el-form :model="assistantForm" label-width="100px" ref="formRef" :rules="formRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="assistantForm.name" placeholder="输入助手名称" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="assistantForm.description" 
            type="textarea" 
            rows="3"
            placeholder="描述此助手的用途和特点"
          />
        </el-form-item>
        
        <el-form-item label="图标">
          <el-select v-model="assistantForm.icon" placeholder="选择图标">
            <el-option 
              v-for="icon in availableIcons" 
              :key="icon"
              :label="icon"
              :value="icon"
            >
              <div class="icon-option">
                <el-icon><component :is="icon" /></el-icon>
                <span>{{ icon }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="知识范围">
          <el-select
            v-model="assistantForm.knowledgeScope"
            multiple
            filterable
            placeholder="选择知识范围"
          >
            <el-option
              v-for="item in knowledgeItems"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
              <div class="knowledge-option">
                <span>{{ item.title }}</span>
                <el-tag size="small" type="info">{{ getKnowledgeType(item) }}</el-tag>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="欢迎消息">
          <el-input
            v-model="assistantForm.config.welcomeMessage"
            type="textarea"
            rows="2"
            placeholder="用户开始对话时的欢迎语"
          />
        </el-form-item>
        
        <el-form-item label="风格">
          <el-select v-model="assistantForm.config.style" placeholder="选择回答风格">
            <el-option label="专业" value="professional" />
            <el-option label="技术" value="technical" />
            <el-option label="分析" value="analytical" />
            <el-option label="友好" value="friendly" />
            <el-option label="简洁" value="concise" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="能力">
          <el-select
            v-model="assistantForm.config.capabilities"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或创建能力标签"
          >
            <el-option
              v-for="capability in availableCapabilities"
              :key="capability"
              :label="capability"
              :value="capability"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="可见性">
          <el-switch
            v-model="assistantForm.isPublic"
            :active-text="assistantForm.isPublic ? '公开' : '私有'"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ isEditing ? '保存' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 对话框 -->
    <el-dialog
      v-model="chatDialogVisible"
      :title="currentAssistant.name"
      width="800px"
      class="chat-dialog"
    >
      <div class="chat-container">
        <div class="chat-messages" ref="messagesContainer">
          <!-- 欢迎消息 -->
          <div class="message assistant-message" v-if="messages.length === 0">
            <div class="message-avatar">
              <el-avatar :icon="getAssistantIcon()" />
            </div>
            <div class="message-content">
              <div class="message-text">{{ currentAssistant.config?.welcomeMessage || '您好，我是AI助手，有什么可以帮您？' }}</div>
            </div>
          </div>
          
          <!-- 对话消息 -->
          <template v-for="(message, index) in messages" :key="index">
            <div :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']">
              <div class="message-avatar">
                <el-avatar :icon="message.role === 'user' ? User : getAssistantIcon()" />
              </div>
              <div class="message-content">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
                
                <div v-if="message.sources && message.sources.length > 0" class="message-sources">
                  <div class="sources-header">
                    <el-icon><info-filled /></el-icon>
                    <span>参考来源：</span>
                  </div>
                  <div class="sources-list">
                    <div 
                      v-for="source in message.sources" 
                      :key="source.id"
                      class="source-item"
                    >
                      <el-icon><document /></el-icon>
                      <span>{{ source.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- 输入中 -->
          <div v-if="chatLoading" class="message assistant-message">
            <div class="message-avatar">
              <el-avatar :icon="getAssistantIcon()" />
            </div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <el-input
            v-model="messageInput"
            type="textarea"
            :rows="3"
            placeholder="输入消息..."
            resize="none"
            @keydown.enter.prevent="sendMessage"
          />
          <div class="input-actions">
            <el-button type="primary" :disabled="!messageInput.trim() || chatLoading" @click="sendMessage">
              <el-icon v-if="chatLoading"><loading /></el-icon>
              <el-icon v-else><position /></el-icon>
              发送
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  Plus,
  View,
  ChatDotRound,
  Edit,
  Delete,
  InfoFilled,
  Document,
  Position,
  Loading,
  User,
  Setting,
  ShoppingCart,
  TrendCharts
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { knowledgeService } from '@/mock/knowledgeData'
import { KnowledgeAssistant, KnowledgeItem } from '@/types/knowledge'

// 数据状态
const loading = ref(false)
const assistants = ref<KnowledgeAssistant[]>([])
const knowledgeItems = ref<KnowledgeItem[]>([])

// 对话框控制
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)

// 对话状态
const chatDialogVisible = ref(false)
const currentAssistant = ref<KnowledgeAssistant>({} as KnowledgeAssistant)
const messages = ref<Array<{role: 'user' | 'assistant', content: string, sources?: any[]}>>([])
const messageInput = ref('')
const chatLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// 表单相关
const formRef = ref()
const assistantForm = reactive({
  id: '',
  name: '',
  description: '',
  icon: 'ShoppingCart',
  knowledgeScope: [] as string[],
  isPublic: true,
  config: {
    style: 'professional',
    welcomeMessage: '',
    capabilities: [] as string[]
  }
})

const formRules = {
  name: [
    { required: true, message: '请输入助手名称', trigger: 'blur' },
    { min: 2, max: 20, message: '名称长度为2-20个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入助手描述', trigger: 'blur' }
  ]
}

// 可用图标和能力
const availableIcons = [
  'ShoppingCart', 'Setting', 'TrendCharts', 'Document', 'ChatDotRound'
]

const availableCapabilities = [
  '产品咨询', '使用指导', '问题诊断', '故障排查', '技术咨询',
  '市场分析', '竞争情报', '趋势预测', '培训辅导', '客户服务'
]

// 页面加载时获取数据
onMounted(async () => {
  await loadAssistants()
  await loadKnowledgeItems()
})

// 加载助手列表
const loadAssistants = async () => {
  loading.value = true
  
  try {
    const data = await knowledgeService.getAssistantList()
    assistants.value = data
  } catch (error) {
    console.error('加载助手列表失败:', error)
    ElMessage.error('加载助手列表失败')
  } finally {
    loading.value = false
  }
}

// 加载知识条目
const loadKnowledgeItems = async () => {
  try {
    const response = await knowledgeService.getKnowledgeList({
      page: 1,
      size: 100
    })
    knowledgeItems.value = response.data
  } catch (error) {
    console.error('加载知识条目失败:', error)
    ElMessage.error('加载知识条目失败')
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取知识类型
const getKnowledgeType = (item: KnowledgeItem) => {
  return item.sourceType === 'file' ? item.format : item.sourceType
}

// 打开创建对话框
const openCreateDialog = () => {
  isEditing.value = false
  dialogVisible.value = true
  
  // 重置表单
  Object.assign(assistantForm, {
    id: '',
    name: '',
    description: '',
    icon: 'ShoppingCart',
    knowledgeScope: [],
    isPublic: true,
    config: {
      style: 'professional',
      welcomeMessage: '',
      capabilities: []
    }
  })
}

// 编辑助手
const editAssistant = (assistant: KnowledgeAssistant) => {
  isEditing.value = true
  dialogVisible.value = true
  
  // 填充表单
  Object.assign(assistantForm, {
    id: assistant.id,
    name: assistant.name,
    description: assistant.description,
    icon: assistant.icon,
    knowledgeScope: [...assistant.knowledgeScope],
    isPublic: assistant.isPublic,
    config: {
      style: assistant.config.style,
      welcomeMessage: assistant.config.welcomeMessage,
      capabilities: [...assistant.config.capabilities]
    }
  })
}

// 确认删除
const confirmDelete = (assistant: KnowledgeAssistant) => {
  ElMessageBox.confirm(
    `确定要删除助手"${assistant.name}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(async () => {
    try {
      await knowledgeService.deleteAssistant(assistant.id)
      
      // 从列表中移除
      assistants.value = assistants.value.filter(a => a.id !== assistant.id)
      
      ElMessage.success('删除成功')
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  })
  .catch(() => {
    // 取消操作
  })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      if (isEditing.value) {
        // 编辑现有助手
        const updatedAssistant = await knowledgeService.updateAssistant(assistantForm.id, {
          name: assistantForm.name,
          description: assistantForm.description,
          icon: assistantForm.icon,
          knowledgeScope: assistantForm.knowledgeScope,
          isPublic: assistantForm.isPublic,
          config: assistantForm.config
        })
        
        // 更新列表
        const index = assistants.value.findIndex(a => a.id === assistantForm.id)
        if (index !== -1) {
          assistants.value[index] = updatedAssistant
        }
        
        ElMessage.success('更新成功')
      } else {
        // 创建新助手
        const newAssistant = await knowledgeService.createAssistant({
          name: assistantForm.name,
          description: assistantForm.description,
          icon: assistantForm.icon,
          knowledgeScope: assistantForm.knowledgeScope,
          isPublic: assistantForm.isPublic,
          config: assistantForm.config,
          creator: '当前用户'
        })
        
        // 添加到列表
        assistants.value.push(newAssistant)
        
        ElMessage.success('创建成功')
      }
      
      dialogVisible.value = false
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
    } finally {
      submitting.value = false
    }
  })
}

// 与助手对话
const chatWithAssistant = (assistant: KnowledgeAssistant) => {
  currentAssistant.value = assistant
  chatDialogVisible.value = true
  messages.value = []
  messageInput.value = ''
}

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim() || chatLoading.value) return
  
  const message = messageInput.value.trim()
  messageInput.value = ''
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message
  })
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  chatLoading.value = true
  
  try {
    // 调用服务发送消息
    const response = await knowledgeService.chatWithAssistant(
      currentAssistant.value.id, 
      message, 
      messages.value
    )
    
    // 添加助手回复
    messages.value.push(response)
    
    // 滚动到底部
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送消息失败')
    
    // 添加错误消息
    messages.value.push({
      role: 'assistant',
      content: '抱歉，处理您的消息时出现了错误，请重试。'
    })
  } finally {
    chatLoading.value = false
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 获取助手图标
const getAssistantIcon = () => {
  if (!currentAssistant.value.icon) return Cpu
  
  // 动态获取图标组件
  if (
    currentAssistant.value.icon === 'ShoppingCart' || 
    currentAssistant.value.icon === 'Setting' || 
    currentAssistant.value.icon === 'TrendCharts'
  ) {
    return eval(currentAssistant.value.icon)
  }
  
  return ChatDotRound
}

// 格式化消息内容
const formatMessage = (content: string) => {
  return content.replace(/\n/g, '<br>')
}
</script>

<style lang="scss" scoped>
.assistant-manager {
  width: 100%;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-weight: 500;
  }
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  
  .el-button {
    margin-top: 20px;
  }
}

.assistants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.assistant-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    .assistant-icon {
      width: 40px;
      height: 40px;
      background-color: var(--el-color-primary-light-9);
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 15px;
      
      .el-icon {
        font-size: 24px;
        color: var(--el-color-primary);
      }
    }
    
    .assistant-info {
      flex: 1;
      
      .assistant-name {
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 5px;
      }
      
      .assistant-desc {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
  
  .card-body {
    flex: 1;
    
    .assistant-capabilities {
      margin-bottom: 15px;
      
      .capabilities-title {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        margin-bottom: 8px;
      }
      
      .capabilities-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        
        .capability-tag {
          margin-right: 0;
        }
      }
    }
    
    .assistant-usage {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--el-text-color-secondary);
      font-size: 12px;
    }
  }
  
  .card-footer {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid var(--el-border-color-lighter);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .creation-info {
      color: var(--el-text-color-secondary);
      font-size: 12px;
    }
    
    .footer-actions {
      display: flex;
      gap: 8px;
    }
  }
}

.icon-option {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .el-icon {
    font-size: 18px;
  }
}

.knowledge-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.chat-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  gap: 15px;
  max-width: 85%;
  
  &.user-message {
    align-self: flex-end;
    flex-direction: row-reverse;
    
    .message-content {
      background-color: var(--el-color-primary-light-9);
      border-radius: 12px 12px 0 12px;
    }
  }
  
  &.assistant-message {
    align-self: flex-start;
    
    .message-content {
      background-color: var(--el-bg-color);
      border-radius: 12px 12px 12px 0;
    }
  }
  
  .message-avatar {
    flex-shrink: 0;
  }
  
  .message-content {
    padding: 12px 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    
    .message-text {
      word-break: break-word;
      line-height: 1.5;
    }
    
    .message-sources {
      margin-top: 15px;
      border-top: 1px dashed var(--el-border-color-lighter);
      padding-top: 10px;
      
      .sources-header {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 8px;
        color: var(--el-text-color-secondary);
        font-size: 13px;
      }
      
      .sources-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
        
        .source-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: var(--el-color-primary);
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

.typing-indicator {
  display: flex;
  padding: 5px 0;
  
  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: var(--el-text-color-placeholder);
    border-radius: 50%;
    margin-right: 5px;
    animation: typing 1.5s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
      margin-right: 0;
    }
  }
}

@keyframes typing {
  0% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
  60% { transform: translateY(0); }
}

.chat-input {
  padding: 15px 20px;
  border-top: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color);
  
  .input-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style> 