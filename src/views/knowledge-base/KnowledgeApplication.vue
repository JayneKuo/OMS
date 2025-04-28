<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>知识应用</h1>
        <p class="subtitle">将知识转化为智能服务和业务支持，提升决策效率和业务执行准确性</p>
      </div>
    </div>
    
    <el-tabs class="main-tabs">
      <el-tab-pane label="智能助手">
        <div class="panel-content">
          <div class="assistant-list">
            <div class="list-header">
              <h3>我的助手</h3>
              <el-button type="primary" size="small">创建助手</el-button>
            </div>
            
            <el-empty description="暂无智能助手，点击创建" />
            
            <div class="create-guide">
              <h4>智能助手可以帮助您：</h4>
              <ul class="guide-list">
                <li>回答业务相关问题，提供知识支持</li>
                <li>协助完成特定工作流程和任务</li>
                <li>提供决策建议和专业见解</li>
                <li>自动生成内容和报告</li>
              </ul>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="知识卡片">
        <div class="panel-content">
          <div class="card-templates">
            <div class="list-header">
              <h3>卡片模板</h3>
              <el-button type="primary" size="small">创建模板</el-button>
            </div>
            
            <el-empty description="暂无卡片模板，点击创建" />
            
            <div class="create-guide">
              <h4>知识卡片可以：</h4>
              <ul class="guide-list">
                <li>在工作流程中自动展示相关知识</li>
                <li>提供操作指南和最佳实践</li>
                <li>显示重要提醒和参考信息</li>
                <li>支持快速决策和问题解决</li>
              </ul>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="API服务">
        <div class="panel-content">
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <h3>API密钥管理</h3>
                <el-button type="primary" size="small">创建密钥</el-button>
              </div>
            </template>
            <el-empty description="暂无API密钥" />
          </el-card>
          
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <h3>API文档</h3>
              </div>
            </template>
            <div class="api-doc-list">
              <div class="api-item">
                <div class="api-name">/api/knowledge/search</div>
                <div class="api-desc">知识库搜索API</div>
                <el-link type="primary">查看文档</el-link>
              </div>
              <div class="api-item">
                <div class="api-name">/api/knowledge/ask</div>
                <div class="api-desc">知识问答API</div>
                <el-link type="primary">查看文档</el-link>
              </div>
              <div class="api-item">
                <div class="api-name">/api/knowledge/graph</div>
                <div class="api-desc">知识图谱API</div>
                <el-link type="primary">查看文档</el-link>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="业务集成">
        <div class="panel-content">
          <div class="integration-container">
            <div class="list-header">
              <h3>集成应用</h3>
              <el-button type="primary" size="small">创建集成</el-button>
            </div>
            
            <el-empty description="暂无业务集成应用" />
            
            <div class="integration-types">
              <h4>集成类型：</h4>
              <div class="type-list">
                <el-tag>系统插件</el-tag>
                <el-tag>流程编排</el-tag>
                <el-tag>桌面组件</el-tag>
                <el-tag>浏览器扩展</el-tag>
                <el-tag>消息集成</el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style lang="scss" scoped>
.page-container {
  padding: 32px;
  min-height: 100vh;
  background: var(--bg-dark);
}

.page-header {
  margin-bottom: 32px;
  
  h1 {
    font-size: 32px;
    font-weight: 500;
    margin: 0;
    color: var(--text-primary);
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
  }
}

.main-tabs {
  background: var(--bg-light);
  border-radius: 8px;
  padding: 20px;
}

.panel-content {
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.feature-card {
  width: 48%;
  min-width: 400px;
  
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

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-weight: 500;
  }
}

.assistant-list, .card-templates, .integration-container {
  width: 100%;
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.create-guide {
  margin-top: 30px;
  
  h4 {
    margin-bottom: 10px;
    color: var(--text-primary);
  }
  
  .guide-list {
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      color: var(--text-secondary);
    }
  }
}

.api-doc-list {
  .api-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
    
    &:last-child {
      border-bottom: none;
    }
    
    .api-name {
      flex: 0 0 200px;
      font-family: monospace;
      color: var(--el-color-primary);
    }
    
    .api-desc {
      flex: 1;
      color: var(--text-secondary);
    }
  }
}

.integration-types {
  margin-top: 30px;
  
  h4 {
    margin-bottom: 15px;
  }
  
  .type-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style> 