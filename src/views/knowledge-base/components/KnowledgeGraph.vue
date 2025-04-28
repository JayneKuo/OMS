<template>
  <div class="knowledge-graph-container">
    <div class="control-panel">
      <div class="filter-group">
        <div class="filter-item">
          <span class="filter-label">节点类型:</span>
          <el-checkbox-group v-model="nodeTypeFilter">
            <el-checkbox label="document">文档</el-checkbox>
            <el-checkbox label="concept">概念</el-checkbox>
            <el-checkbox label="entity">实体</el-checkbox>
          </el-checkbox-group>
        </div>
        
        <div class="filter-item">
          <span class="filter-label">关系类型:</span>
          <el-select v-model="edgeTypeFilter" multiple placeholder="全部" size="small" style="width: 200px;">
            <el-option
              v-for="type in availableEdgeTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </div>
      </div>
      
      <div class="action-group">
        <el-button size="small" @click="resetGraph">
          <el-icon><refresh /></el-icon>
          重置视图
        </el-button>
        <el-button size="small" @click="saveGraphImage">
          <el-icon><download /></el-icon>
          导出图片
        </el-button>
        <el-tooltip content="全屏查看" placement="top">
          <el-button size="small" @click="toggleFullscreen">
            <el-icon><full-screen /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    
    <div class="graph-view">
      <div v-if="loadingGraph" class="graph-loading">
        <el-spinner />
        <div class="loading-text">正在加载知识图谱...</div>
      </div>
      
      <div v-else-if="graphError" class="graph-error">
        <el-empty description="加载图谱失败">
          <el-button @click="loadGraphData">重试</el-button>
        </el-empty>
      </div>
      
      <div v-else-if="!hasGraphData" class="graph-empty">
        <el-empty description="暂无图谱数据">
          <div class="empty-actions">
            <el-button type="primary" @click="openAddNodeDialog">添加节点</el-button>
            <el-button @click="loadGraphData">刷新</el-button>
          </div>
        </el-empty>
      </div>
      
      <div v-else id="graph-canvas" class="graph-canvas"></div>
    </div>
    
    <div class="node-detail-panel" v-if="selectedNode">
      <div class="panel-header">
        <h4>{{ selectedNode.label }}</h4>
        <el-button type="text" @click="closeNodeDetail">
          <el-icon><close /></el-icon>
        </el-button>
      </div>
      
      <div class="panel-body">
        <div class="detail-item">
          <span class="item-label">类型:</span>
          <el-tag size="small" :type="getNodeTypeTagType(selectedNode.type)">
            {{ getNodeTypeText(selectedNode.type) }}
          </el-tag>
        </div>
        
        <template v-if="selectedNode.type === 'document'">
          <div class="detail-item" v-if="selectedNode.properties && selectedNode.properties.docId">
            <span class="item-label">文档ID:</span>
            <span>{{ selectedNode.properties.docId }}</span>
          </div>
          
          <div class="detail-item" v-if="documentDetails">
            <span class="item-label">创建时间:</span>
            <span>{{ formatDate(documentDetails.createTime) }}</span>
          </div>
          
          <div class="detail-item" v-if="documentDetails">
            <span class="item-label">创建者:</span>
            <span>{{ documentDetails.creator }}</span>
          </div>
          
          <div class="detail-actions" v-if="documentDetails">
            <el-button size="small" type="primary" @click="viewDocument(documentDetails.id)">
              查看文档
            </el-button>
          </div>
        </template>
        
        <div class="related-nodes">
          <h5>相关节点</h5>
          <el-scrollbar height="120px">
            <div 
              v-for="rel in relatedNodes" 
              :key="rel.node.id" 
              class="related-node-item"
              @click="selectNode(rel.node)"
            >
              <div class="node-info">
                <el-tag size="small" :type="getRelationTagType(rel.relation)">
                  {{ rel.relation }}
                </el-tag>
                <span class="node-label">{{ rel.node.label }}</span>
              </div>
              <el-icon><right /></el-icon>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    
    <!-- 添加节点对话框 -->
    <el-dialog
      v-model="addNodeDialogVisible"
      title="添加图谱节点"
      width="500px"
    >
      <el-form :model="newNodeForm" label-width="100px">
        <el-form-item label="节点类型">
          <el-select v-model="newNodeForm.type" placeholder="选择节点类型">
            <el-option label="文档" value="document" />
            <el-option label="概念" value="concept" />
            <el-option label="实体" value="entity" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="节点名称">
          <el-input v-model="newNodeForm.label" placeholder="输入节点名称" />
        </el-form-item>
        
        <template v-if="newNodeForm.type === 'document'">
          <el-form-item label="关联文档">
            <el-select
              v-model="newNodeForm.docId"
              filterable
              placeholder="选择关联的知识文档"
            >
              <el-option
                v-for="doc in availableDocuments"
                :key="doc.id"
                :label="doc.title"
                :value="doc.id"
              />
            </el-select>
          </el-form-item>
        </template>
        
        <el-form-item label="关联节点">
          <el-select
            v-model="newNodeForm.relatedNodeId"
            filterable
            placeholder="选择要关联的节点"
            clearable
          >
            <el-option-group
              v-for="group in groupedNodes"
              :key="group.type"
              :label="getNodeTypeText(group.type)"
            >
              <el-option
                v-for="node in group.nodes"
                :key="node.id"
                :label="node.label"
                :value="node.id"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        
        <el-form-item v-if="newNodeForm.relatedNodeId" label="关系类型">
          <el-select
            v-model="newNodeForm.relation"
            placeholder="选择关系类型"
            allow-create
            filterable
          >
            <el-option
              v-for="type in availableEdgeTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addNodeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddNode">添加</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 文档详情对话框 -->
    <el-dialog
      v-model="documentDetailDialogVisible"
      :title="currentDocument.title"
      width="800px"
    >
      <div class="document-detail-content">
        <div class="detail-header">
          <div class="detail-info">
            <div class="info-item">
              <label>来源：</label>
              <span>{{ currentDocument.source }}</span>
            </div>
            <div class="info-item">
              <label>格式：</label>
              <span>{{ currentDocument.format }}</span>
            </div>
            <div class="info-item">
              <label>创建时间：</label>
              <span>{{ formatDate(currentDocument.createTime) }}</span>
            </div>
            <div class="info-item">
              <label>创建者：</label>
              <span>{{ currentDocument.creator }}</span>
            </div>
          </div>
          
          <div class="detail-tags">
            <el-tag 
              v-for="tag in currentDocument.tags" 
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
            {{ currentDocument.content }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { 
  Refresh, 
  Download, 
  FullScreen, 
  Close, 
  Right 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { knowledgeService } from '@/mock/knowledgeData'
import { KnowledgeItem, GraphNode, GraphEdge } from '@/types/knowledge'

// 图谱数据状态
const loadingGraph = ref(true)
const graphError = ref(false)
const hasGraphData = ref(false)

// 过滤条件
const nodeTypeFilter = ref(['document', 'concept', 'entity'])
const edgeTypeFilter = ref<string[]>([])

// 节点选择状态
const selectedNode = ref<GraphNode | null>(null)
const documentDetails = ref<KnowledgeItem | null>(null)
const relatedNodes = ref<{ node: GraphNode; relation: string }[]>([])

// 图谱数据
const graphData = ref<{ nodes: GraphNode[]; edges: GraphEdge[] }>({
  nodes: [],
  edges: []
})

// 对话框控制
const addNodeDialogVisible = ref(false)
const documentDetailDialogVisible = ref(false)

// 新增节点表单
const newNodeForm = reactive({
  type: 'concept',
  label: '',
  docId: '',
  relatedNodeId: '',
  relation: ''
})

// 当前查看的文档
const currentDocument = ref<KnowledgeItem>({} as KnowledgeItem)

// 可用文档列表
const availableDocuments = ref<KnowledgeItem[]>([])

// 从服务获取可用的边缘类型
const availableEdgeTypes = computed(() => {
  const types = new Set<string>()
  graphData.value.edges.forEach(edge => {
    types.add(edge.label)
  })
  return Array.from(types)
})

// 按类型分组的节点
const groupedNodes = computed(() => {
  const result: { type: string; nodes: GraphNode[] }[] = []
  
  const nodesByType = new Map<string, GraphNode[]>()
  
  graphData.value.nodes.forEach(node => {
    if (!nodesByType.has(node.type)) {
      nodesByType.set(node.type, [])
    }
    nodesByType.get(node.type)!.push(node)
  })
  
  for (const [type, nodes] of nodesByType.entries()) {
    result.push({ type, nodes })
  }
  
  return result
})

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

// 获取节点类型的文本和标签类型
const getNodeTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'document': '文档',
    'concept': '概念',
    'entity': '实体'
  }
  return typeMap[type] || type
}

const getNodeTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    'document': 'success',
    'concept': 'primary',
    'entity': 'warning'
  }
  return typeMap[type] || ''
}

// 获取关系标签类型
const getRelationTagType = (relation: string) => {
  // 根据关系类型返回不同的标签样式
  const importantRelations = ['包含', '依赖', '支持']
  if (importantRelations.includes(relation)) {
    return 'danger'
  }
  return 'info'
}

// 页面加载时获取图谱数据
onMounted(async () => {
  await loadGraphData()
  await loadAvailableDocuments()
})

// 加载图谱数据
const loadGraphData = async () => {
  loadingGraph.value = true
  graphError.value = false
  
  try {
    const data = await knowledgeService.getKnowledgeGraph()
    graphData.value = data
    hasGraphData.value = data.nodes.length > 0
    
    initGraph()
  } catch (error) {
    console.error('加载图谱数据失败:', error)
    graphError.value = true
    ElMessage.error('加载图谱数据失败')
  } finally {
    loadingGraph.value = false
  }
}

// 加载可用文档
const loadAvailableDocuments = async () => {
  try {
    const response = await knowledgeService.getKnowledgeList({
      page: 1,
      size: 100
    })
    availableDocuments.value = response.data
  } catch (error) {
    console.error('加载文档列表失败:', error)
  }
}

// 初始化图谱
const initGraph = () => {
  // 此处实际项目中应使用D3.js、Echarts或其他图谱可视化库渲染图谱
  // 这里仅模拟初始化过程
  
  console.log('初始化图谱，节点数:', graphData.value.nodes.length)
  console.log('初始化图谱，边数:', graphData.value.edges.length)
  
  // 模拟图谱渲染完成
  setTimeout(() => {
    // 在真实实现中，这里会渲染实际的图谱
    if (document.getElementById('graph-canvas')) {
      document.getElementById('graph-canvas')!.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666;">
          <div>图谱已渲染 (模拟)</div>
          <div>节点数: ${graphData.value.nodes.length}</div>
          <div>关系数: ${graphData.value.edges.length}</div>
          <div style="margin-top: 10px; font-size: 12px;">
            注: 实际项目中使用D3.js或ECharts等库渲染交互式图谱
          </div>
        </div>
      `
    }
  }, 500)
}

// 重置图谱
const resetGraph = () => {
  ElMessage.success('图谱视图已重置')
  // 实际项目中，此处应重置图谱的缩放和位置
}

// 保存图谱图片
const saveGraphImage = () => {
  ElMessage.success('图谱已保存为图片')
  // 实际项目中，此处应将图谱导出为图片
}

// 切换全屏
const toggleFullscreen = () => {
  ElMessage.success('已切换全屏模式')
  // 实际项目中，此处应切换图谱容器的全屏状态
}

// 选择节点
const selectNode = (node: GraphNode) => {
  selectedNode.value = node
  
  // 查找关联节点
  const relatedNodesData: { node: GraphNode; relation: string }[] = []
  
  graphData.value.edges.forEach(edge => {
    if (edge.source === node.id) {
      const targetNode = graphData.value.nodes.find(n => n.id === edge.target)
      if (targetNode) {
        relatedNodesData.push({
          node: targetNode,
          relation: edge.label
        })
      }
    } else if (edge.target === node.id) {
      const sourceNode = graphData.value.nodes.find(n => n.id === edge.source)
      if (sourceNode) {
        relatedNodesData.push({
          node: sourceNode,
          relation: `被${edge.label}`
        })
      }
    }
  })
  
  relatedNodes.value = relatedNodesData
  
  // 如果是文档节点，获取文档详情
  if (node.type === 'document' && node.properties && node.properties.docId) {
    loadDocumentDetails(node.properties.docId)
  } else {
    documentDetails.value = null
  }
}

// 加载文档详情
const loadDocumentDetails = async (docId: string) => {
  try {
    const doc = await knowledgeService.getKnowledgeDetail(docId)
    documentDetails.value = doc
  } catch (error) {
    console.error('加载文档详情失败:', error)
    documentDetails.value = null
  }
}

// 关闭节点详情
const closeNodeDetail = () => {
  selectedNode.value = null
  documentDetails.value = null
  relatedNodes.value = []
}

// 打开添加节点对话框
const openAddNodeDialog = () => {
  addNodeDialogVisible.value = true
  newNodeForm.type = 'concept'
  newNodeForm.label = ''
  newNodeForm.docId = ''
  newNodeForm.relatedNodeId = ''
  newNodeForm.relation = ''
}

// 提交添加节点
const submitAddNode = () => {
  if (!newNodeForm.label) {
    ElMessage.warning('请输入节点名称')
    return
  }
  
  if (newNodeForm.type === 'document' && !newNodeForm.docId) {
    ElMessage.warning('请选择关联文档')
    return
  }
  
  if (newNodeForm.relatedNodeId && !newNodeForm.relation) {
    ElMessage.warning('请选择关系类型')
    return
  }
  
  // 模拟添加节点到图谱
  const newNodeId = 'n' + (graphData.value.nodes.length + 1)
  
  const newNode: GraphNode = {
    id: newNodeId,
    label: newNodeForm.label,
    type: newNodeForm.type
  }
  
  if (newNodeForm.type === 'document' && newNodeForm.docId) {
    newNode.properties = { docId: newNodeForm.docId }
  }
  
  // 添加节点
  graphData.value.nodes.push(newNode)
  
  // 如果有关联节点，添加边
  if (newNodeForm.relatedNodeId && newNodeForm.relation) {
    const newEdge: GraphEdge = {
      source: newNodeForm.relatedNodeId,
      target: newNodeId,
      label: newNodeForm.relation
    }
    
    graphData.value.edges.push(newEdge)
  }
  
  // 重新初始化图谱
  initGraph()
  
  ElMessage.success('节点添加成功')
  addNodeDialogVisible.value = false
}

// 查看文档详情
const viewDocument = (docId: string) => {
  const doc = availableDocuments.value.find(d => d.id === docId)
  if (doc) {
    currentDocument.value = doc
    documentDetailDialogVisible.value = true
  } else {
    loadDocumentForView(docId)
  }
}

// 加载文档用于查看
const loadDocumentForView = async (docId: string) => {
  try {
    const doc = await knowledgeService.getKnowledgeDetail(docId)
    currentDocument.value = doc
    documentDetailDialogVisible.value = true
  } catch (error) {
    console.error('加载文档失败:', error)
    ElMessage.error('加载文档失败')
  }
}

// 监听过滤器变化，更新图谱显示
watch([nodeTypeFilter, edgeTypeFilter], () => {
  // 实际项目中，这里应该根据过滤条件重新过滤和渲染图谱
  ElMessage.info('过滤条件已更新，重新渲染图谱')
  
  // 模拟过滤后的重新渲染
  setTimeout(() => {
    initGraph()
  }, 300)
})
</script>

<style lang="scss" scoped>
.knowledge-graph-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-light);
  
  .filter-group {
    display: flex;
    gap: 20px;
    
    .filter-item {
      display: flex;
      align-items: center;
      
      .filter-label {
        margin-right: 10px;
        white-space: nowrap;
        color: var(--el-text-color-secondary);
      }
    }
  }
  
  .action-group {
    display: flex;
    gap: 10px;
  }
}

.graph-view {
  flex: 1;
  position: relative;
  min-height: 500px;
  overflow: hidden;
  background-color: var(--el-fill-color-light);
}

.graph-canvas {
  width: 100%;
  height: 100%;
}

.graph-loading,
.graph-error,
.graph-empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .loading-text {
    margin-top: 10px;
    color: var(--el-text-color-secondary);
  }
  
  .empty-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
}

.node-detail-panel {
  position: absolute;
  top: 60px;
  right: 20px;
  width: 300px;
  background: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 10;
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid var(--el-border-color-light);
    
    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  .panel-body {
    padding: 15px;
    
    .detail-item {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      
      .item-label {
        color: var(--el-text-color-secondary);
        margin-right: 8px;
        white-space: nowrap;
      }
    }
    
    .detail-actions {
      margin: 15px 0;
    }
    
    .related-nodes {
      margin-top: 20px;
      
      h5 {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: var(--el-text-color-regular);
      }
      
      .related-node-item {
        padding: 8px 12px;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        border-radius: 4px;
        
        &:hover {
          background-color: var(--el-fill-color);
        }
        
        .node-info {
          display: flex;
          align-items: center;
          gap: 10px;
          
          .node-label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}

.document-detail-content {
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
}
</style> 