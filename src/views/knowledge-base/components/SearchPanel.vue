<template>
  <div class="search-panel">
    <div class="search-header">
      <h1>智能搜索</h1>
      <p class="subtitle">通过强大的语义搜索快速找到您需要的知识</p>
      
      <div class="search-input-container">
        <el-input
          v-model="searchQuery"
          placeholder="输入您的问题，例如：如何优化数据处理流程？"
          class="search-input"
          clearable
          @keyup.enter="performSearch"
        >
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
          <template #append>
            <el-button @click="performSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>
    
    <div class="search-body">
      <template v-if="!hasSearched">
        <div class="search-tips">
          <h3>搜索技巧</h3>
          <div class="tips-container">
            <div class="tip-item">
              <div class="tip-icon">
                <el-icon><question-filled /></el-icon>
              </div>
              <div class="tip-content">
                <h4>使用问题形式</h4>
                <p>尝试使用完整的问题而非关键词，如"如何提高数据处理效率"而非"数据处理"</p>
              </div>
            </div>
            
            <div class="tip-item">
              <div class="tip-icon">
                <el-icon><document /></el-icon>
              </div>
              <div class="tip-content">
                <h4>指定文档类型</h4>
                <p>您可以在搜索中指定文档类型，如"产品文档中关于数据可视化的内容"</p>
              </div>
            </div>
            
            <div class="tip-item">
              <div class="tip-icon">
                <el-icon><data-analysis /></el-icon>
              </div>
              <div class="tip-content">
                <h4>使用专业术语</h4>
                <p>系统能理解专业术语，使用准确的专业词汇可以获得更精确的结果</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="recent-searches">
          <h3>最近搜索</h3>
          <div class="recent-list">
            <div 
              v-for="(item, index) in recentSearches" 
              :key="index"
              class="recent-item"
              @click="applyRecentSearch(item)"
            >
              <el-icon><time /></el-icon>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </template>
      
      <template v-else>
        <div class="search-results">
          <div class="results-header">
            <h3>搜索结果 ({{ searchResults.length }})</h3>
            <el-button 
              type="primary" 
              plain 
              @click="showQaMode" 
              size="small"
              v-if="searchResults.length > 0"
            >
              <el-icon><chat-line-square /></el-icon>
              生成问答摘要
            </el-button>
          </div>
          
          <div v-if="qaMode" class="qa-summary">
            <div class="qa-title">
              <el-icon><chat-dot-square /></el-icon>
              <span>基于搜索结果的问答摘要</span>
            </div>
            <div class="qa-content">
              <p>{{ qaAnswer }}</p>
              <div class="qa-sources">
                <span>数据来源：</span>
                <el-tag 
                  v-for="(source, index) in qaSources" 
                  :key="index"
                  size="small"
                  effect="plain"
                  class="source-tag"
                >
                  {{ source }}
                </el-tag>
              </div>
            </div>
          </div>
          
          <div v-if="searchResults.length === 0" class="no-results">
            <el-empty description="未找到匹配的结果，请尝试不同的搜索词或查看搜索技巧" />
          </div>
          
          <div v-for="(result, index) in searchResults" :key="index" class="result-item">
            <h3 class="result-title">{{ result.title }}</h3>
            
            <div class="result-highlight" v-html="result.highlight"></div>
            
            <div class="result-footer">
              <div class="result-meta">
                <span class="source">
                  <el-icon><document /></el-icon>
                  {{ result.source }}
                </span>
                <span class="date">
                  <el-icon><calendar /></el-icon>
                  {{ result.date }}
                </span>
              </div>
              
              <div class="result-actions">
                <el-button type="primary" size="small" link @click="viewDetail(result)">
                  查看详情
                </el-button>
                <el-button size="small" link @click="copyContent(result)">
                  复制
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  QuestionFilled, 
  Document, 
  DataAnalysis, 
  Time,
  ChatLineSquare,
  ChatDotSquare,
  Calendar
} from '@element-plus/icons-vue'

// 搜索查询
const searchQuery = ref('')

// 搜索状态
const hasSearched = ref(false)
const qaMode = ref(false)

// 最近搜索
const recentSearches = ref([
  '如何优化数据处理流程？',
  '产品架构说明文档',
  '如何使用知识图谱功能？',
  '最新的产品更新内容'
])

// 搜索结果
const searchResults = ref([])

// 问答摘要
const qaAnswer = ref('')
const qaSources = ref([])

// 执行搜索
const performSearch = () => {
  if (!searchQuery.value.trim()) return
  
  // 实际应用中这里应该调用API进行搜索
  hasSearched.value = true
  qaMode.value = false
  
  // 模拟搜索结果
  setTimeout(() => {
    // 将当前搜索添加到最近搜索
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value)
      if (recentSearches.value.length > 5) {
        recentSearches.value.pop()
      }
    }
    
    // 模拟结果
    if (searchQuery.value.includes('数据处理') || searchQuery.value.includes('优化')) {
      searchResults.value = [
        {
          id: '2',
          title: '数据处理最佳实践',
          highlight: '高效的<em>数据处理</em>是保证分析质量的关键。本文档总结了以下最佳实践：<em>1. 数据预处理</em>：在导入大量数据前进行抽样检查和预处理；<em>2. 增量处理</em>：对大数据集采用增量处理策略...',
          source: '技术文档.docx',
          date: '2023-11-20',
          content: '高效的数据处理是保证分析质量的关键。本文档总结了以下最佳实践：1. 数据预处理：在导入大量数据前进行抽样检查和预处理；2. 增量处理：对大数据集采用增量处理策略；3. 并行处理：合理配置并行处理参数提高效率；4. 错误处理：建立完善的错误处理和数据修复流程'
        },
        {
          id: '1',
          title: '产品功能与架构概述',
          highlight: '产品采用模块化架构，主要包含以下几个核心模块：<em>数据采集模块</em>、<em>数据处理模块</em>、数据分析模块和可视化模块...',
          source: '产品文档.pdf',
          date: '2023-11-15',
          content: '产品采用模块化架构，主要包含以下几个核心模块：数据采集模块：负责从各种来源获取原始数据；数据处理模块：对采集的数据进行清洗、转换和规范化；数据分析模块：使用各种算法分析数据并生成洞察；可视化模块：将分析结果以图表和报表形式展示'
        }
      ]
    } else if (searchQuery.value.includes('产品') || searchQuery.value.includes('架构')) {
      searchResults.value = [
        {
          id: '1',
          title: '产品功能与架构概述',
          highlight: '<em>产品</em>采用模块化<em>架构</em>，主要包含以下几个核心模块：数据采集模块、数据处理模块、数据分析模块和可视化模块...',
          source: '产品文档.pdf',
          date: '2023-11-15',
          content: '产品采用模块化架构，主要包含以下几个核心模块：数据采集模块：负责从各种来源获取原始数据；数据处理模块：对采集的数据进行清洗、转换和规范化；数据分析模块：使用各种算法分析数据并生成洞察；可视化模块：将分析结果以图表和报表形式展示'
        },
        {
          id: '4',
          title: '新功能原型设计说明',
          highlight: '本文档包含新功能的详细设计规范和说明，基于<em>产品</em>的现有<em>架构</em>进行扩展...',
          source: '设计文档.sketch',
          date: '2023-11-18',
          content: '本文档包含新功能的详细设计规范和说明，基于产品的现有架构进行扩展。主要设计理念是简洁易用，优化用户路径，减少操作步骤。'
        }
      ]
    } else {
      searchResults.value = []
    }
  }, 500)
}

// 应用最近搜索
const applyRecentSearch = (query) => {
  searchQuery.value = query
  performSearch()
}

// 显示问答模式
const showQaMode = () => {
  qaMode.value = true
  
  // 模拟问答生成过程
  setTimeout(() => {
    if (searchQuery.value.includes('数据处理') || searchQuery.value.includes('优化')) {
      qaAnswer.value = '根据知识库内容，优化数据处理流程可以从以下几个方面入手：1) 在导入大量数据前进行抽样检查和预处理，这有助于发现潜在问题；2) 对大数据集采用增量处理策略，减少资源消耗；3) 合理配置并行处理参数提高效率，根据可用资源进行调整；4) 建立完善的错误处理和数据修复流程，确保处理过程稳定可靠。根据产品架构，这些优化可以应用在数据处理模块中。'
      qaSources.value = ['数据处理最佳实践', '产品功能与架构概述']
    } else if (searchQuery.value.includes('产品') || searchQuery.value.includes('架构')) {
      qaAnswer.value = '产品采用模块化架构设计，主要包含四个核心模块：1) 数据采集模块，负责从各种来源获取原始数据；2) 数据处理模块，对采集的数据进行清洗、转换和规范化；3) 数据分析模块，使用各种算法分析数据并生成洞察；4) 可视化模块，将分析结果以图表和报表形式展示。这种架构设计保证了系统的可扩展性和灵活性，各模块通过标准API进行交互。新功能设计也遵循这一架构，注重简洁易用的原则。'
      qaSources.value = ['产品功能与架构概述', '新功能原型设计说明']
    }
  }, 800)
}

// 查看详情
const viewDetail = (result) => {
  // 实际应用中这里应该跳转到详情页或打开详情弹窗
  ElMessage.success(`查看详情：${result.title}`)
}

// 复制内容
const copyContent = (result) => {
  // 实际应用中这里应该复制内容到剪贴板
  navigator.clipboard.writeText(result.content).then(() => {
    ElMessage.success('内容已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}
</script>

<style lang="scss" scoped>
.search-panel {
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

.search-header {
  padding: 32px;
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
  
  .search-input-container {
    max-width: 800px;
    margin: 0 auto;
    
    .search-input {
      :deep(.el-input__wrapper) {
        padding: 4px 8px;
        box-shadow: 0 0 0 1px var(--border-color);
      }
      
      :deep(.el-input__inner) {
        height: 46px;
        font-size: 16px;
      }
    }
  }
}

.search-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  
  .search-tips {
    margin-bottom: 32px;
    
    h3 {
      font-size: 18px;
      margin: 0 0 16px;
      color: var(--text-primary);
    }
    
    .tips-container {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      
      .tip-item {
        flex: 1;
        min-width: 280px;
        display: flex;
        gap: 16px;
        padding: 16px;
        background: white;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        
        .tip-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ecf5ff;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .el-icon {
            font-size: 24px;
            color: #409eff;
          }
        }
        
        .tip-content {
          flex: 1;
          
          h4 {
            margin: 0 0 8px;
            font-size: 16px;
            color: var(--text-primary);
          }
          
          p {
            margin: 0;
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.5;
          }
        }
      }
    }
  }
  
  .recent-searches {
    h3 {
      font-size: 18px;
      margin: 0 0 16px;
      color: var(--text-primary);
    }
    
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .recent-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: white;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        color: var(--text-secondary);
        
        .el-icon {
          color: #909399;
        }
        
        &:hover {
          background: #f5f7fa;
          color: #409eff;
          border-color: #c6e2ff;
        }
      }
    }
  }
  
  .search-results {
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      h3 {
        font-size: 18px;
        margin: 0;
        color: var(--text-primary);
      }
    }
    
    .qa-summary {
      margin-bottom: 24px;
      background: #f0f7ff;
      border-radius: 8px;
      padding: 16px;
      
      .qa-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 500;
        color: #409eff;
        
        .el-icon {
          font-size: 18px;
        }
      }
      
      .qa-content {
        p {
          margin: 0 0 12px;
          line-height: 1.6;
          color: var(--text-primary);
        }
        
        .qa-sources {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          font-size: 12px;
          color: var(--text-tertiary);
          
          span {
            margin-right: 4px;
          }
          
          .source-tag {
            margin-right: 4px;
          }
        }
      }
    }
    
    .result-item {
      padding: 16px;
      background: white;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      margin-bottom: 16px;
      
      .result-title {
        margin: 0 0 12px;
        font-size: 18px;
        color: #409eff;
      }
      
      .result-highlight {
        margin-bottom: 16px;
        line-height: 1.6;
        color: var(--text-primary);
        
        :deep(em) {
          font-style: normal;
          background: #fff8e8;
          padding: 0 2px;
          color: #ff9800;
          border-radius: 2px;
        }
      }
      
      .result-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .result-meta {
          display: flex;
          gap: 16px;
          color: var(--text-tertiary);
          font-size: 12px;
          
          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
        
        .result-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
}
</style> 