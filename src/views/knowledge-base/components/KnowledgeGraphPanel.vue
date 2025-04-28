<template>
  <div class="knowledge-graph-panel">
    <div class="graph-header">
      <h1>知识图谱</h1>
      <p class="subtitle">可视化展示知识间的关联与结构，发现潜在联系</p>
      
      <div class="graph-toolbar">
        <div class="search-area">
          <el-input
            v-model="searchQuery"
            placeholder="搜索节点..."
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="view-controls">
          <el-button-group>
            <el-tooltip content="概览模式">
              <el-button :type="viewMode === 'overview' ? 'primary' : ''" @click="setViewMode('overview')">
                <el-icon><view /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="关系模式">
              <el-button :type="viewMode === 'relationship' ? 'primary' : ''" @click="setViewMode('relationship')">
                <el-icon><connection /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="层级模式">
              <el-button :type="viewMode === 'hierarchy' ? 'primary' : ''" @click="setViewMode('hierarchy')">
                <el-icon><rank /></el-icon>
              </el-button>
            </el-tooltip>
          </el-button-group>
          
          <el-button-group>
            <el-tooltip content="放大">
              <el-button @click="zoomIn">
                <el-icon><zoom-in /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="缩小">
              <el-button @click="zoomOut">
                <el-icon><zoom-out /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="适应屏幕">
              <el-button @click="fitView">
                <el-icon><full-screen /></el-icon>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
    </div>
    
    <div class="graph-container">
      <div class="graph-canvas">
        <!-- 这里实际项目中会集成可视化图谱库如ECharts、D3.js或vis.js等 -->
        <!-- 以下是静态模拟展示 -->
        <img 
          v-if="viewMode === 'overview'" 
          src="https://placeholder.pics/svg/1000x600/DEDEDE/555555/知识图谱-概览模式"
          alt="知识图谱概览"
          class="graph-placeholder"
        />
        <img 
          v-if="viewMode === 'relationship'" 
          src="https://placeholder.pics/svg/1000x600/E8F4FF/3090F0/知识图谱-关系模式"
          alt="知识图谱关系"
          class="graph-placeholder"
        />
        <img 
          v-if="viewMode === 'hierarchy'" 
          src="https://placeholder.pics/svg/1000x600/F0F8E8/67C23A/知识图谱-层级模式"
          alt="知识图谱层级"
          class="graph-placeholder"
        />
      </div>
      
      <div class="node-detail-panel" v-if="selectedNode">
        <div class="panel-header">
          <h3>节点详情</h3>
          <el-button type="text" @click="closeNodeDetail">
            <el-icon><close /></el-icon>
          </el-button>
        </div>
        
        <div class="node-info">
          <div class="info-item">
            <div class="label">名称</div>
            <div class="value">{{ selectedNode.name }}</div>
          </div>
          
          <div class="info-item">
            <div class="label">类型</div>
            <div class="value">
              <el-tag size="small" :type="getTagType(selectedNode.type)">
                {{ selectedNode.type }}
              </el-tag>
            </div>
          </div>
          
          <div class="info-item">
            <div class="label">描述</div>
            <div class="value description">{{ selectedNode.description }}</div>
          </div>
          
          <div class="info-item">
            <div class="label">来源</div>
            <div class="value">{{ selectedNode.source }}</div>
          </div>
          
          <el-divider />
          
          <div class="related-nodes">
            <h4>关联节点</h4>
            <div class="relation-list">
              <div 
                v-for="relation in selectedNode.relations" 
                :key="relation.id"
                class="relation-item"
              >
                <div class="relation-type">{{ relation.type }}</div>
                <div class="relation-target">
                  <el-tag size="small" :type="getTagType(relation.nodeType)">
                    {{ relation.nodeType }}
                  </el-tag>
                  <span class="node-name">{{ relation.nodeName }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="node-actions">
            <el-button type="primary" size="small" @click="viewNodeContent">
              查看相关知识
            </el-button>
            <el-button size="small" @click="expandNode">
              展开关系
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="graph-footer">
      <div class="legend">
        <h4>图例</h4>
        <div class="legend-items">
          <div class="legend-item">
            <div class="color-block concept"></div>
            <span>概念</span>
          </div>
          <div class="legend-item">
            <div class="color-block entity"></div>
            <span>实体</span>
          </div>
          <div class="legend-item">
            <div class="color-block document"></div>
            <span>文档</span>
          </div>
          <div class="legend-item">
            <div class="color-block attribute"></div>
            <span>属性</span>
          </div>
        </div>
      </div>
      
      <div class="graph-stats">
        <div class="stat-item">
          <div class="stat-value">36</div>
          <div class="stat-label">节点</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">58</div>
          <div class="stat-label">关系</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">12</div>
          <div class="stat-label">知识源</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  View, 
  Connection, 
  Rank, 
  ZoomIn, 
  ZoomOut, 
  FullScreen, 
  Close
} from '@element-plus/icons-vue'

// 视图模式
const viewMode = ref('overview')

// 搜索查询
const searchQuery = ref('')

// 选中的节点
const selectedNode = ref({
  id: 'node1',
  name: '数据处理模块',
  type: '概念',
  description: '负责对采集的原始数据进行清洗、转换和规范化的系统组件',
  source: '产品功能与架构概述',
  relations: [
    {
      id: 'rel1',
      type: '包含',
      nodeType: '概念',
      nodeName: '数据预处理'
    },
    {
      id: 'rel2',
      type: '包含',
      nodeType: '概念',
      nodeName: '数据转换'
    },
    {
      id: 'rel3',
      type: '输入来自',
      nodeType: '概念',
      nodeName: '数据采集模块'
    },
    {
      id: 'rel4',
      type: '输出至',
      nodeType: '概念',
      nodeName: '数据分析模块'
    },
    {
      id: 'rel5',
      type: '描述于',
      nodeType: '文档',
      nodeName: '产品功能与架构概述'
    }
  ]
})

// 设置视图模式
const setViewMode = (mode) => {
  viewMode.value = mode
}

// 获取标签类型
const getTagType = (nodeType) => {
  const typeMap = {
    '概念': 'primary',
    '实体': 'success',
    '文档': 'info',
    '属性': 'warning'
  }
  return typeMap[nodeType] || ''
}

// 缩放控制
const zoomIn = () => {
  // 实际应用中这里应该调用图谱库的放大方法
  ElMessage.success('图谱放大')
}

const zoomOut = () => {
  // 实际应用中这里应该调用图谱库的缩小方法
  ElMessage.success('图谱缩小')
}

const fitView = () => {
  // 实际应用中这里应该调用图谱库的适应视图方法
  ElMessage.success('图谱适应屏幕')
}

// 关闭节点详情
const closeNodeDetail = () => {
  selectedNode.value = null
}

// 查看节点内容
const viewNodeContent = () => {
  ElMessage.success(`查看关于"${selectedNode.value.name}"的知识`)
}

// 展开节点
const expandNode = () => {
  ElMessage.success(`展开"${selectedNode.value.name}"的关系网络`)
}
</script>

<style lang="scss" scoped>
.knowledge-graph-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
  --text-primary: #303133;
  --text-secondary: #606266;
  --text-tertiary: #909399;
  --border-color: #e4e7ed;
}

.graph-header {
  padding: 24px 32px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f1fc 100%);
  border-bottom: 1px solid var(--border-color);
  
  h1 {
    font-size: 28px;
    margin: 0 0 8px;
    color: var(--text-primary);
  }
  
  .subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0 0 24px;
  }
  
  .graph-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .search-area {
      width: 300px;
      
      .search-input {
        :deep(.el-input__wrapper) {
          box-shadow: 0 0 0 1px var(--border-color);
        }
      }
    }
    
    .view-controls {
      display: flex;
      gap: 16px;
    }
  }
}

.graph-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  
  .graph-canvas {
    flex: 1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    
    .graph-placeholder {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  
  .node-detail-panel {
    width: 320px;
    border-left: 1px solid var(--border-color);
    background-color: white;
    display: flex;
    flex-direction: column;
    
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .node-info {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      
      .info-item {
        margin-bottom: 16px;
        
        .label {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }
        
        .value {
          font-size: 14px;
          color: var(--text-primary);
          
          &.description {
            line-height: 1.6;
          }
        }
      }
      
      .related-nodes {
        margin-bottom: 16px;
        
        h4 {
          font-size: 14px;
          margin: 0 0 12px;
          font-weight: 500;
        }
        
        .relation-list {
          .relation-item {
            margin-bottom: 12px;
            padding: 8px 12px;
            background-color: #f5f7fa;
            border-radius: 4px;
            border-left: 3px solid #409eff;
            
            .relation-type {
              font-size: 13px;
              color: var(--text-secondary);
              margin-bottom: 6px;
            }
            
            .relation-target {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .node-name {
                font-weight: 500;
              }
            }
          }
        }
      }
      
      .node-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
      }
    }
  }
}

.graph-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  border-top: 1px solid var(--border-color);
  background-color: white;
  
  .legend {
    h4 {
      font-size: 14px;
      margin: 0 0 8px;
      font-weight: 500;
    }
    
    .legend-items {
      display: flex;
      gap: 16px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--text-secondary);
        
        .color-block {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          
          &.concept {
            background-color: #409eff;
          }
          
          &.entity {
            background-color: #67c23a;
          }
          
          &.document {
            background-color: #909399;
          }
          
          &.attribute {
            background-color: #e6a23c;
          }
        }
      }
    }
  }
  
  .graph-stats {
    display: flex;
    gap: 24px;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: 18px;
        font-weight: 600;
        color: #409eff;
      }
      
      .stat-label {
        font-size: 12px;
        color: var(--text-tertiary);
      }
    }
  }
}
</style> 