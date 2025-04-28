<template>
  <div class="api-manager">
    <div class="manager-section">
      <div class="section-header">
        <h3>API密钥管理</h3>
        <el-button type="primary" @click="openCreateKeyDialog">
          <el-icon><plus /></el-icon>创建密钥
        </el-button>
      </div>
      
      <div class="section-content" v-loading="loading">
        <div v-if="apiKeys.length === 0 && !loading" class="empty-section">
          <el-empty description="暂无API密钥" />
          <el-button type="primary" @click="openCreateKeyDialog">创建密钥</el-button>
        </div>
        
        <el-table v-else :data="apiKeys" style="width: 100%">
          <el-table-column prop="name" label="名称" min-width="120" />
          <el-table-column prop="key" label="密钥" min-width="200">
            <template #default="scope">
              <div class="key-display">
                <span>{{ maskApiKey(scope.row.key) }}</span>
                <el-button link @click="showFullKey(scope.row)">显示</el-button>
                <el-button link @click="copyApiKey(scope.row.key)">复制</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="scopes" label="权限范围" min-width="180">
            <template #default="scope">
              <div class="scopes-list">
                <el-tag 
                  v-for="(s, index) in scope.row.scopes" 
                  :key="index"
                  size="small"
                  :type="getScopeType(s)"
                  class="scope-tag"
                >
                  {{ s }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="expireTime" label="过期时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.expireTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="editKey(scope.row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="revokeKey(scope.row)">
                {{ scope.row.status === 'active' ? '撤销' : '删除' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
    <div class="manager-section">
      <div class="section-header">
        <h3>API文档</h3>
      </div>
      
      <div class="section-content">
        <el-tabs type="border-card">
          <el-tab-pane label="概述">
            <div class="api-overview">
              <h4>API服务概述</h4>
              <p>
                通过API服务，您可以将知识中枢的强大功能集成到您的应用程序和工作流程中。
                我们提供了RESTful API和SDK，便于开发人员快速集成和使用知识库服务。
              </p>
              
              <h4>主要功能</h4>
              <ul class="feature-list">
                <li>
                  <div class="feature-title">知识检索</div>
                  <div class="feature-desc">搜索和获取知识库中的内容</div>
                </li>
                <li>
                  <div class="feature-title">问答服务</div>
                  <div class="feature-desc">基于知识库进行问答交互</div>
                </li>
                <li>
                  <div class="feature-title">知识图谱</div>
                  <div class="feature-desc">获取和查询知识图谱数据</div>
                </li>
                <li>
                  <div class="feature-title">知识管理</div>
                  <div class="feature-desc">上传、更新和删除知识内容</div>
                </li>
              </ul>
              
              <h4>开始使用</h4>
              <ol class="steps-list">
                <li>创建API密钥并选择合适的权限范围</li>
                <li>将API密钥集成到您的应用程序中</li>
                <li>使用API文档中的示例开始调用服务</li>
                <li>根据需要定制和优化您的集成</li>
              </ol>
              
              <el-alert
                type="info"
                show-icon
                :closable="false"
              >
                <template #title>
                  注意：详细的API规范和示例代码请参考各接口文档
                </template>
              </el-alert>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="搜索API">
            <div class="api-doc">
              <h4>知识搜索 API</h4>
              <div class="api-endpoint">
                <div class="method">GET</div>
                <div class="path">/api/knowledge/search</div>
              </div>
              
              <div class="api-description">
                <p>搜索知识库中的内容，支持关键词搜索和语义搜索。</p>
              </div>
              
              <div class="api-params">
                <h5>请求参数</h5>
                <el-table :data="searchApiParams" style="width: 100%">
                  <el-table-column prop="name" label="参数名" width="150" />
                  <el-table-column prop="type" label="类型" width="100" />
                  <el-table-column prop="required" label="必填" width="80">
                    <template #default="scope">
                      {{ scope.row.required ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="描述" />
                </el-table>
              </div>
              
              <div class="api-example">
                <h5>示例请求</h5>
                <div class="code-block">
                  <pre>curl -X GET "https://api.example.com/api/knowledge/search?query=产品规范&limit=10" \
-H "Authorization: Bearer YOUR_API_KEY"</pre>
                </div>
                
                <h5>示例响应</h5>
                <div class="code-block">
                  <pre>{
  "results": [
    {
      "id": "k1",
      "title": "产品开发规范V2.0",
      "content": "本文档描述了公司产品开发的标准流程和规范...",
      "relevance": 0.92
    },
    {
      "id": "k3",
      "title": "市场分析报告2023年Q3",
      "content": "本报告分析了2023年第三季度的市场趋势和竞争格局...",
      "relevance": 0.78
    }
  ],
  "total": 2,
  "time_ms": 45
}</pre>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="问答API">
            <div class="api-doc">
              <h4>知识问答 API</h4>
              <div class="api-endpoint">
                <div class="method">POST</div>
                <div class="path">/api/knowledge/ask</div>
              </div>
              
              <div class="api-description">
                <p>基于知识库回答问题，支持上下文理解和多轮对话。</p>
              </div>
              
              <div class="api-params">
                <h5>请求参数</h5>
                <el-table :data="askApiParams" style="width: 100%">
                  <el-table-column prop="name" label="参数名" width="150" />
                  <el-table-column prop="type" label="类型" width="100" />
                  <el-table-column prop="required" label="必填" width="80">
                    <template #default="scope">
                      {{ scope.row.required ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="描述" />
                </el-table>
              </div>
              
              <div class="api-example">
                <h5>示例请求</h5>
                <div class="code-block">
                  <pre>curl -X POST "https://api.example.com/api/knowledge/ask" \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "question": "产品开发流程是什么？",
  "history": [
    {"role": "user", "content": "我想了解产品开发"},
    {"role": "assistant", "content": "我可以帮您解答产品开发相关问题，您想了解哪方面的内容？"}
  ]
}'</pre>
                </div>
                
                <h5>示例响应</h5>
                <div class="code-block">
                  <pre>{
  "answer": "产品开发流程包括以下几个主要阶段：1. 需求收集与分析 2. 产品规划 3. 设计与原型 4. 开发实现 5. 测试验证 6. 发布上线 7. 运营与迭代。每个阶段都有特定的输入、输出和质量标准，详细内容可参考产品开发规范文档。",
  "sources": [
    {
      "id": "k1",
      "title": "产品开发规范V2.0",
      "relevance": 0.95
    }
  ],
  "time_ms": 320
}</pre>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="图谱API">
            <div class="api-doc">
              <h4>知识图谱 API</h4>
              <div class="api-endpoint">
                <div class="method">GET</div>
                <div class="path">/api/knowledge/graph</div>
              </div>
              
              <div class="api-description">
                <p>获取知识图谱数据，支持查询特定节点和关系。</p>
              </div>
              
              <div class="api-params">
                <h5>请求参数</h5>
                <el-table :data="graphApiParams" style="width: 100%">
                  <el-table-column prop="name" label="参数名" width="150" />
                  <el-table-column prop="type" label="类型" width="100" />
                  <el-table-column prop="required" label="必填" width="80">
                    <template #default="scope">
                      {{ scope.row.required ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="描述" />
                </el-table>
              </div>
              
              <div class="api-example">
                <h5>示例请求</h5>
                <div class="code-block">
                  <pre>curl -X GET "https://api.example.com/api/knowledge/graph?node_type=concept&limit=5" \
-H "Authorization: Bearer YOUR_API_KEY"</pre>
                </div>
                
                <h5>示例响应</h5>
                <div class="code-block">
                  <pre>{
  "nodes": [
    { "id": "n1", "label": "产品开发", "type": "concept" },
    { "id": "n2", "label": "客户服务", "type": "concept" },
    { "id": "n3", "label": "技术架构", "type": "concept" },
    { "id": "n4", "label": "市场分析", "type": "concept" },
    { "id": "n5", "label": "员工培训", "type": "concept" }
  ],
  "edges": [
    { "source": "n1", "target": "n4", "label": "依赖" },
    { "source": "n3", "target": "n1", "label": "支持" }
  ]
}</pre>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 创建/编辑密钥对话框 -->
    <el-dialog
      v-model="keyDialogVisible"
      :title="isEditing ? '编辑API密钥' : '创建API密钥'"
      width="500px"
    >
      <el-form :model="keyForm" label-width="100px" ref="keyFormRef" :rules="formRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="keyForm.name" placeholder="输入密钥名称" />
        </el-form-item>
        
        <el-form-item label="权限范围" prop="scopes">
          <el-checkbox-group v-model="keyForm.scopes">
            <div class="scopes-group">
              <div v-for="(group, groupName) in scopeGroups" :key="groupName" class="scope-group">
                <div class="group-title">{{ groupName }}：</div>
                <div class="group-items">
                  <el-checkbox v-for="scope in group" :key="scope.value" :label="scope.value">
                    {{ scope.label }}
                  </el-checkbox>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="有效期">
          <el-select v-model="keyForm.expireTime" placeholder="选择密钥有效期">
            <el-option label="30天" value="30" />
            <el-option label="90天" value="90" />
            <el-option label="180天" value="180" />
            <el-option label="365天" value="365" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input
            v-model="keyForm.description"
            type="textarea"
            rows="2"
            placeholder="可选，添加密钥用途说明"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="keyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitKeyForm" :loading="submitting">
            {{ isEditing ? '保存' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新密钥展示对话框 -->
    <el-dialog
      v-model="newKeyDialogVisible"
      title="API密钥创建成功"
      width="600px"
    >
      <div class="new-key-info">
        <el-alert
          type="warning"
          :closable="false"
          show-icon
        >
          <template #title>
            请立即复制并安全存储您的API密钥，离开此页面后将无法再次完整查看
          </template>
        </el-alert>
        
        <div class="key-section">
          <div class="section-label">API密钥</div>
          <div class="key-value">
            <el-input
              v-model="newKeyValue"
              readonly
            >
              <template #append>
                <el-button @click="copyApiKey(newKeyValue)">复制</el-button>
              </template>
            </el-input>
          </div>
        </div>
        
        <div class="key-info-table">
          <div class="info-row">
            <div class="info-label">名称：</div>
            <div class="info-value">{{ newKeyInfo.name }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">创建时间：</div>
            <div class="info-value">{{ formatDate(newKeyInfo.createTime) }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">过期时间：</div>
            <div class="info-value">{{ formatDate(newKeyInfo.expireTime) }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">权限范围：</div>
            <div class="info-value">
              <el-tag 
                v-for="scope in newKeyInfo.scopes" 
                :key="scope"
                size="small"
                :type="getScopeType(scope)"
                class="scope-tag"
              >
                {{ scope }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="newKeyDialogVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { knowledgeService } from '@/mock/knowledgeData'
import { ApiKey } from '@/types/knowledge'

// 数据状态
const loading = ref(false)
const apiKeys = ref<ApiKey[]>([])

// 对话框控制
const keyDialogVisible = ref(false)
const newKeyDialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)

// 新创建的密钥信息
const newKeyValue = ref('')
const newKeyInfo = reactive({
  name: '',
  createTime: '',
  expireTime: '',
  scopes: [] as string[]
})

// 表单相关
const keyFormRef = ref()
const keyForm = reactive({
  id: '',
  name: '',
  scopes: [] as string[],
  expireTime: '365',
  description: ''
})

const formRules = {
  name: [
    { required: true, message: '请输入密钥名称', trigger: 'blur' },
    { min: 2, max: 30, message: '名称长度为2-30个字符', trigger: 'blur' }
  ],
  scopes: [
    { required: true, message: '请选择至少一个权限范围', trigger: 'change', type: 'array' }
  ]
}

// 权限范围分组
const scopeGroups = {
  '知识管理': [
    { value: 'knowledge.read', label: '读取知识' },
    { value: 'knowledge.write', label: '写入知识' },
    { value: 'knowledge.delete', label: '删除知识' }
  ],
  '智能服务': [
    { value: 'assistant.interact', label: '助手交互' },
    { value: 'search.query', label: '搜索查询' },
    { value: 'graph.query', label: '图谱查询' }
  ],
  '应用管理': [
    { value: 'app.read', label: '读取应用' },
    { value: 'app.write', label: '写入应用' },
    { value: 'stats.read', label: '读取统计' }
  ]
}

// API文档参数
const searchApiParams = [
  { name: 'query', type: 'string', required: true, description: '搜索关键词或短语' },
  { name: 'limit', type: 'integer', required: false, description: '返回结果数量上限，默认为10' },
  { name: 'offset', type: 'integer', required: false, description: '结果偏移量，用于分页' },
  { name: 'tags', type: 'string[]', required: false, description: '按标签筛选，多个标签使用逗号分隔' }
]

const askApiParams = [
  { name: 'question', type: 'string', required: true, description: '问题文本' },
  { name: 'history', type: 'object[]', required: false, description: '对话历史记录，用于多轮对话上下文' },
  { name: 'max_tokens', type: 'integer', required: false, description: '回答的最大token数，默认为500' },
  { name: 'knowledge_ids', type: 'string[]', required: false, description: '限定使用的知识条目ID' }
]

const graphApiParams = [
  { name: 'node_type', type: 'string', required: false, description: '节点类型筛选，如concept、document、entity' },
  { name: 'query', type: 'string', required: false, description: '节点标签搜索关键词' },
  { name: 'limit', type: 'integer', required: false, description: '返回节点数量上限，默认为50' },
  { name: 'depth', type: 'integer', required: false, description: '关系深度，从指定节点展开的层级数' }
]

// 页面加载时获取数据
onMounted(async () => {
  await loadApiKeys()
})

// 加载API密钥列表
const loadApiKeys = async () => {
  loading.value = true
  
  try {
    const data = await knowledgeService.getApiKeyList()
    apiKeys.value = data
  } catch (error) {
    console.error('加载API密钥失败:', error)
    ElMessage.error('加载API密钥失败')
  } finally {
    loading.value = false
  }
}

// 掩码显示API密钥
const maskApiKey = (key: string) => {
  if (!key) return ''
  
  // 仅显示前6位和后4位
  const prefix = key.slice(0, 6)
  const suffix = key.slice(-4)
  return `${prefix}...${suffix}`
}

// 显示完整密钥
const showFullKey = (key: ApiKey) => {
  ElMessageBox.confirm(
    '出于安全考虑，仅在需要时显示完整API密钥。确定要显示吗？',
    '安全提示',
    {
      confirmButtonText: '显示',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(() => {
    ElMessageBox.alert(key.key, '完整API密钥', {
      confirmButtonText: '关闭',
      callback: () => {}
    })
  })
  .catch(() => {})
}

// 复制API密钥
const copyApiKey = (key: string) => {
  navigator.clipboard.writeText(key)
    .then(() => {
      ElMessage.success('密钥已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

// 获取权限标签类型
const getScopeType = (scope: string) => {
  if (scope.includes('write') || scope.includes('delete')) {
    return 'danger'
  } else if (scope.includes('interact')) {
    return 'warning'
  } else if (scope.includes('read')) {
    return 'success'
  }
  return 'info'
}

// 获取状态文本和样式
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'active': '有效',
    'expired': '已过期',
    'revoked': '已撤销'
  }
  return statusMap[status] || status
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'active': 'success',
    'expired': 'warning',
    'revoked': 'info'
  }
  return typeMap[status] || 'info'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 打开创建密钥对话框
const openCreateKeyDialog = () => {
  isEditing.value = false
  keyDialogVisible.value = true
  
  // 重置表单
  Object.assign(keyForm, {
    id: '',
    name: '',
    scopes: ['knowledge.read'],
    expireTime: '365',
    description: ''
  })
}

// 编辑密钥
const editKey = (key: ApiKey) => {
  isEditing.value = true
  keyDialogVisible.value = true
  
  // 填充表单
  Object.assign(keyForm, {
    id: key.id,
    name: key.name,
    scopes: [...key.scopes],
    // 编辑时不修改有效期
    expireTime: '365',
    description: ''
  })
}

// 撤销密钥
const revokeKey = (key: ApiKey) => {
  const action = key.status === 'active' ? '撤销' : '删除'
  
  ElMessageBox.confirm(
    `确定要${action}密钥"${key.name}"吗？此操作不可恢复。`,
    `${action}确认`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(() => {
    if (key.status === 'active') {
      // 撤销密钥
      const index = apiKeys.value.findIndex(k => k.id === key.id)
      if (index !== -1) {
        const updatedKey = { ...apiKeys.value[index], status: 'revoked' }
        apiKeys.value[index] = updatedKey
      }
      ElMessage.success('密钥已撤销')
    } else {
      // 删除已撤销/过期密钥
      apiKeys.value = apiKeys.value.filter(k => k.id !== key.id)
      ElMessage.success('密钥已删除')
    }
  })
  .catch(() => {})
}

// 提交密钥表单
const submitKeyForm = async () => {
  if (!keyFormRef.value) return
  
  await keyFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      if (isEditing.value) {
        // 编辑现有密钥
        const index = apiKeys.value.findIndex(k => k.id === keyForm.id)
        if (index !== -1) {
          // 只能修改名称和范围
          const updatedKey = { 
            ...apiKeys.value[index],
            name: keyForm.name,
            scopes: [...keyForm.scopes]
          }
          apiKeys.value[index] = updatedKey
        }
        
        ElMessage.success('密钥已更新')
        keyDialogVisible.value = false
      } else {
        // 创建新密钥
        const expiresInDays = parseInt(keyForm.expireTime)
        const createTime = new Date()
        const expireTime = new Date()
        expireTime.setDate(expireTime.getDate() + expiresInDays)
        
        const newApiKey = await knowledgeService.createApiKey(
          keyForm.name,
          keyForm.scopes
        )
        
        // 添加到列表
        apiKeys.value.unshift(newApiKey)
        
        // 显示新密钥信息
        newKeyValue.value = newApiKey.key
        Object.assign(newKeyInfo, {
          name: newApiKey.name,
          createTime: newApiKey.createTime,
          expireTime: newApiKey.expireTime,
          scopes: newApiKey.scopes
        })
        
        keyDialogVisible.value = false
        newKeyDialogVisible.value = true
      }
    } catch (error) {
      console.error('保存密钥失败:', error)
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.api-manager {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
}

.manager-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-weight: 500;
    }
  }
  
  .section-content {
    min-height: 200px;
  }
}

.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  
  .el-button {
    margin-top: 20px;
  }
}

.key-display {
  display: flex;
  align-items: center;
  gap: 10px;
  
  span {
    font-family: monospace;
  }
}

.scopes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  
  .scope-tag {
    margin: 0;
  }
}

.scopes-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  .scope-group {
    .group-title {
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .group-items {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-left: 10px;
    }
  }
}

.new-key-info {
  .key-section {
    margin: 20px 0;
    
    .section-label {
      margin-bottom: 10px;
      font-weight: 500;
    }
  }
  
  .key-info-table {
    margin-top: 20px;
    
    .info-row {
      display: flex;
      margin-bottom: 15px;
      
      .info-label {
        width: 100px;
        font-weight: 500;
      }
      
      .info-value {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }
    }
  }
}

.api-overview {
  h4 {
    margin: 20px 0 10px;
    font-weight: 500;
  }
  
  p {
    margin: 10px 0;
    line-height: 1.6;
  }
  
  .feature-list, .steps-list {
    padding-left: 20px;
    margin: 15px 0;
    
    li {
      margin-bottom: 10px;
    }
  }
  
  .feature-list {
    list-style: none;
    padding-left: 0;
    
    li {
      border-left: 3px solid var(--el-color-primary);
      padding-left: 15px;
      
      .feature-title {
        font-weight: 500;
        margin-bottom: 5px;
      }
      
      .feature-desc {
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.api-doc {
  h4 {
    margin: 0 0 15px;
    font-weight: 500;
  }
  
  .api-endpoint {
    display: flex;
    align-items: center;
    background-color: var(--el-fill-color-light);
    padding: 10px 15px;
    border-radius: 4px;
    margin-bottom: 15px;
    
    .method {
      background-color: var(--el-color-success);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      margin-right: 10px;
    }
    
    .path {
      font-family: monospace;
      font-size: 14px;
    }
  }
  
  .api-description {
    margin-bottom: 20px;
    
    p {
      line-height: 1.6;
    }
  }
  
  .api-params, .api-example {
    margin-bottom: 20px;
    
    h5 {
      margin: 0 0 10px;
      font-weight: 500;
    }
  }
  
  .code-block {
    background-color: var(--el-fill-color-dark);
    border-radius: 4px;
    padding: 15px;
    overflow-x: auto;
    margin-bottom: 15px;
    
    pre {
      margin: 0;
      font-family: monospace;
      white-space: pre-wrap;
      color: var(--el-text-color-primary);
    }
  }
}
</style> 