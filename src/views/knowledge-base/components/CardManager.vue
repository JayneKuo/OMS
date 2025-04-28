<template>
  <div class="card-manager">
    <div class="manager-header">
      <h3>知识卡片管理</h3>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><plus /></el-icon>创建卡片
      </el-button>
    </div>
    
    <div class="card-list" v-loading="loading">
      <div v-if="cards.length === 0 && !loading" class="empty-list">
        <el-empty description="暂无知识卡片" />
        <el-button type="primary" @click="openCreateDialog">立即创建</el-button>
      </div>
      
      <div v-else class="cards-grid">
        <el-card 
          v-for="card in cards" 
          :key="card.id"
          class="knowledge-card"
          shadow="hover"
        >
          <div class="card-header">
            <div class="card-title">{{ card.name }}</div>
            <div class="card-menu">
              <el-dropdown trigger="click" @command="handleCommand($event, card)">
                <el-button type="text">
                  <el-icon><more /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="preview">预览</el-dropdown-item>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="duplicate">复制</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          
          <div class="card-body">
            <div class="card-description">{{ card.description }}</div>
            
            <div class="card-triggers">
              <div class="trigger-section">
                <div class="trigger-title">触发关键词：</div>
                <div class="trigger-content">
                  <el-tag
                    v-for="keyword in card.triggerConditions.keywords.slice(0, 3)"
                    :key="keyword"
                    size="small"
                    class="trigger-tag"
                  >
                    {{ keyword }}
                  </el-tag>
                  <el-tag
                    v-if="card.triggerConditions.keywords.length > 3"
                    size="small"
                    type="info"
                    class="trigger-tag"
                  >
                    +{{ card.triggerConditions.keywords.length - 3 }}
                  </el-tag>
                </div>
              </div>
              
              <div class="trigger-section">
                <div class="trigger-title">场景：</div>
                <div class="trigger-content">
                  <el-tag
                    v-for="context in card.triggerConditions.contexts.slice(0, 2)"
                    :key="context"
                    size="small"
                    type="success"
                    class="trigger-tag"
                  >
                    {{ context }}
                  </el-tag>
                  <el-tag
                    v-if="card.triggerConditions.contexts.length > 2"
                    size="small"
                    type="info"
                    class="trigger-tag"
                  >
                    +{{ card.triggerConditions.contexts.length - 2 }}
                  </el-tag>
                </div>
              </div>
            </div>
            
            <div class="card-usage">
              <el-icon><view /></el-icon>
              <span>{{ card.usageCount }} 次展示</span>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="knowledge-sources">
              <div class="sources-title">关联知识：</div>
              <div class="sources-content">
                <el-tooltip
                  v-for="id in card.knowledgeIds"
                  :key="id"
                  :content="getKnowledgeTitle(id)"
                  placement="top"
                >
                  <el-avatar 
                    size="small" 
                    :icon="Document"
                    class="knowledge-avatar"
                  />
                </el-tooltip>
              </div>
            </div>
            <div class="card-actions">
              <el-button link type="primary" size="small" @click="previewCard(card)">
                预览
              </el-button>
              <el-button link type="primary" size="small" @click="editCard(card)">
                编辑
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑知识卡片' : '创建知识卡片'"
      width="600px"
    >
      <el-form :model="cardForm" label-width="100px" ref="formRef" :rules="formRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="cardForm.name" placeholder="输入卡片名称" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="cardForm.description" 
            type="textarea" 
            rows="2"
            placeholder="描述此卡片的用途"
          />
        </el-form-item>
        
        <el-form-item label="关联知识" prop="knowledgeIds">
          <el-select
            v-model="cardForm.knowledgeIds"
            multiple
            filterable
            placeholder="选择关联的知识条目"
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
        
        <el-form-item label="触发关键词">
          <el-select
            v-model="cardForm.triggerConditions.keywords"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="输入触发关键词"
          >
            <el-option
              v-for="keyword in availableKeywords"
              :key="keyword"
              :label="keyword"
              :value="keyword"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="触发场景">
          <el-select
            v-model="cardForm.triggerConditions.contexts"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="输入触发场景"
          >
            <el-option
              v-for="context in availableContexts"
              :key="context"
              :label="context"
              :value="context"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="时间点">
          <el-select
            v-model="cardForm.triggerConditions.timePoints"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="可选，输入时间触发点"
          >
            <el-option
              v-for="timePoint in availableTimePoints"
              :key="timePoint"
              :label="timePoint"
              :value="timePoint"
            />
          </el-select>
          <div class="form-help-text">例如：员工入职日-1、任务截止日+1</div>
        </el-form-item>
        
        <el-form-item label="卡片模板">
          <el-input
            v-model="cardForm.template"
            type="textarea"
            rows="5"
            placeholder="卡片HTML模板，可使用{{变量}}语法"
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
    
    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="卡片预览"
      width="500px"
      class="preview-dialog"
    >
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-title">{{ currentCard.name }}</div>
          <div class="preview-subtitle">{{ currentCard.description }}</div>
        </div>
        
        <div class="preview-body">
          <div class="preview-frame">
            <div class="card-preview" v-html="renderCardTemplate()"></div>
          </div>
        </div>
        
        <div class="preview-footer">
          <div class="preview-info">
            <div class="info-item">
              <label>触发条件：</label>
              <div class="info-content">
                <span>当用户遇到</span>
                <el-tag 
                  v-for="keyword in currentCard.triggerConditions?.keywords.slice(0, 3)" 
                  :key="keyword"
                  size="small"
                  class="preview-tag"
                >
                  {{ keyword }}
                </el-tag>
                <span>等关键词时</span>
              </div>
            </div>
            <div class="info-item">
              <label>使用场景：</label>
              <div class="info-content">
                <el-tag 
                  v-for="context in currentCard.triggerConditions?.contexts.slice(0, 3)" 
                  :key="context"
                  size="small"
                  type="success"
                  class="preview-tag"
                >
                  {{ context }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { 
  Plus, 
  More, 
  View, 
  Document 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { knowledgeService } from '@/mock/knowledgeData'
import { KnowledgeCard, KnowledgeItem } from '@/types/knowledge'

// 数据状态
const loading = ref(false)
const cards = ref<KnowledgeCard[]>([])
const knowledgeItems = ref<KnowledgeItem[]>([])

// 对话框控制
const dialogVisible = ref(false)
const previewDialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)

// 当前操作的卡片
const currentCard = ref<KnowledgeCard>({} as KnowledgeCard)

// 表单相关
const formRef = ref()
const cardForm = reactive({
  id: '',
  name: '',
  description: '',
  knowledgeIds: [] as string[],
  triggerConditions: {
    keywords: [] as string[],
    contexts: [] as string[],
    timePoints: [] as string[]
  },
  template: ''
})

const formRules = {
  name: [
    { required: true, message: '请输入卡片名称', trigger: 'blur' },
    { min: 2, max: 20, message: '名称长度为2-20个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入卡片描述', trigger: 'blur' }
  ],
  knowledgeIds: [
    { required: true, message: '请选择关联知识', trigger: 'change', type: 'array' }
  ]
}

// 可选值
const availableKeywords = [
  '功能', '特性', '使用方法', '故障', '问题', '不工作', '错误',
  '入职', '新员工', '培训', '价格', '配置', '安装', '升级'
]

const availableContexts = [
  '产品页面', '客户咨询', '支持页面', '故障单', 'HR系统', '员工入职',
  '销售系统', '内部门户', '会议准备', '任务分配'
]

const availableTimePoints = [
  '员工入职日-1', '员工入职日+1', '任务截止日-1', '项目启动日+0',
  '会议开始前-30分钟', '产品发布日-1'
]

// 页面加载时获取数据
onMounted(async () => {
  await loadCards()
  await loadKnowledgeItems()
})

// 加载卡片列表
const loadCards = async () => {
  loading.value = true
  
  try {
    const data = await knowledgeService.getCardList()
    cards.value = data
  } catch (error) {
    console.error('加载卡片列表失败:', error)
    ElMessage.error('加载卡片列表失败')
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

// 获取知识标题
const getKnowledgeTitle = (id: string) => {
  const item = knowledgeItems.value.find(item => item.id === id)
  return item ? item.title : '未知知识'
}

// 获取知识类型
const getKnowledgeType = (item: KnowledgeItem) => {
  return item.sourceType === 'file' ? item.format : item.sourceType
}

// 处理下拉菜单命令
const handleCommand = (command: string, card: KnowledgeCard) => {
  switch (command) {
    case 'preview':
      previewCard(card)
      break
    case 'edit':
      editCard(card)
      break
    case 'duplicate':
      duplicateCard(card)
      break
    case 'delete':
      confirmDelete(card)
      break
  }
}

// 打开创建对话框
const openCreateDialog = () => {
  isEditing.value = false
  dialogVisible.value = true
  
  // 重置表单
  Object.assign(cardForm, {
    id: '',
    name: '',
    description: '',
    knowledgeIds: [],
    triggerConditions: {
      keywords: [],
      contexts: [],
      timePoints: []
    },
    template: '<div class="card-content">{{title}}<div class="card-body">{{content}}</div></div>'
  })
}

// 编辑卡片
const editCard = (card: KnowledgeCard) => {
  isEditing.value = true
  dialogVisible.value = true
  
  // 填充表单
  Object.assign(cardForm, {
    id: card.id,
    name: card.name,
    description: card.description,
    knowledgeIds: [...card.knowledgeIds],
    triggerConditions: {
      keywords: [...card.triggerConditions.keywords],
      contexts: [...card.triggerConditions.contexts],
      timePoints: card.triggerConditions.timePoints ? [...card.triggerConditions.timePoints] : []
    },
    template: card.template
  })
}

// 复制卡片
const duplicateCard = (card: KnowledgeCard) => {
  isEditing.value = false
  dialogVisible.value = true
  
  // 填充表单，但清空ID
  Object.assign(cardForm, {
    id: '',
    name: `${card.name} (副本)`,
    description: card.description,
    knowledgeIds: [...card.knowledgeIds],
    triggerConditions: {
      keywords: [...card.triggerConditions.keywords],
      contexts: [...card.triggerConditions.contexts],
      timePoints: card.triggerConditions.timePoints ? [...card.triggerConditions.timePoints] : []
    },
    template: card.template
  })
}

// 预览卡片
const previewCard = (card: KnowledgeCard) => {
  currentCard.value = card
  previewDialogVisible.value = true
}

// 渲染卡片模板预览
const renderCardTemplate = () => {
  if (!currentCard.value || !currentCard.value.template) {
    return '<div class="empty-template">无模板内容</div>'
  }
  
  // 在真实应用中，这里应该使用实际的模板引擎
  // 这里使用简单的替换演示
  let template = currentCard.value.template
  
  // 替换常见变量
  template = template.replace(/{{title}}/g, '示例标题')
  template = template.replace(/{{content}}/g, '这是卡片内容示例，实际使用时将根据关联知识生成内容。')
  template = template.replace(/{{#steps}}/g, '<li>步骤1</li><li>步骤2</li><li>步骤3</li>')
  
  return template
}

// 确认删除
const confirmDelete = (card: KnowledgeCard) => {
  ElMessageBox.confirm(
    `确定要删除卡片"${card.name}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(() => {
    // 模拟删除操作
    cards.value = cards.value.filter(c => c.id !== card.id)
    ElMessage.success('删除成功')
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
      // 模拟保存操作
      setTimeout(() => {
        if (isEditing.value) {
          // 更新现有卡片
          const index = cards.value.findIndex(c => c.id === cardForm.id)
          if (index !== -1) {
            const updatedCard = {
              ...cards.value[index],
              name: cardForm.name,
              description: cardForm.description,
              knowledgeIds: [...cardForm.knowledgeIds],
              triggerConditions: {
                keywords: [...cardForm.triggerConditions.keywords],
                contexts: [...cardForm.triggerConditions.contexts],
                timePoints: [...cardForm.triggerConditions.timePoints]
              },
              template: cardForm.template,
              updateTime: new Date().toISOString()
            }
            cards.value[index] = updatedCard
          }
        } else {
          // 创建新卡片
          const newCard: KnowledgeCard = {
            id: `c${cards.value.length + 1}`,
            name: cardForm.name,
            description: cardForm.description,
            knowledgeIds: [...cardForm.knowledgeIds],
            triggerConditions: {
              keywords: [...cardForm.triggerConditions.keywords],
              contexts: [...cardForm.triggerConditions.contexts],
              timePoints: [...cardForm.triggerConditions.timePoints]
            },
            template: cardForm.template,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
            creator: '当前用户',
            usageCount: 0
          }
          cards.value.push(newCard)
        }
        
        ElMessage.success(isEditing.value ? '更新成功' : '创建成功')
        dialogVisible.value = false
        submitting.value = false
      }, 800)
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
      submitting.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.card-manager {
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.knowledge-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .card-title {
      font-weight: 500;
      font-size: 16px;
    }
  }
  
  .card-body {
    flex: 1;
    
    .card-description {
      color: var(--el-text-color-regular);
      margin-bottom: 15px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-triggers {
      margin-bottom: 15px;
      
      .trigger-section {
        margin-bottom: 10px;
        
        .trigger-title {
          color: var(--el-text-color-secondary);
          font-size: 12px;
          margin-bottom: 5px;
        }
        
        .trigger-content {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          
          .trigger-tag {
            margin: 0;
          }
        }
      }
    }
    
    .card-usage {
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
    
    .knowledge-sources {
      display: flex;
      align-items: center;
      
      .sources-title {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        margin-right: 10px;
        white-space: nowrap;
      }
      
      .sources-content {
        display: flex;
        gap: 3px;
        
        .knowledge-avatar {
          cursor: pointer;
        }
      }
    }
  }
}

.knowledge-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.form-help-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 5px;
}

.preview-dialog {
  .preview-container {
    display: flex;
    flex-direction: column;
  }
  
  .preview-header {
    margin-bottom: 20px;
    text-align: center;
    
    .preview-title {
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 5px;
    }
    
    .preview-subtitle {
      color: var(--el-text-color-secondary);
    }
  }
  
  .preview-body {
    margin-bottom: 20px;
    
    .preview-frame {
      background-color: #f5f7fa;
      border-radius: 8px;
      padding: 20px;
      min-height: 150px;
      border: 1px dashed var(--el-border-color);
      
      .card-preview {
        background-color: white;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .preview-footer {
    .preview-info {
      .info-item {
        margin-bottom: 10px;
        
        label {
          color: var(--el-text-color-secondary);
          margin-bottom: 5px;
          display: block;
        }
        
        .info-content {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          
          .preview-tag {
            margin: 0;
          }
        }
      }
    }
  }
}
</style> 