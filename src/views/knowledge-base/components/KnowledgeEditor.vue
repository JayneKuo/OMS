<template>
  <div class="knowledge-editor">
    <!-- 左侧数据来源面板 -->
    <div class="editor-left-panel">
      <div class="panel-header">
        <h3>知识列表</h3>
        <el-button type="primary" @click="showAddSourceDialog">
          <el-icon><plus /></el-icon>添加知识
        </el-button>
      </div>

      <!-- 来源列表 -->
      <div class="source-list" v-if="sources.length > 0">
        <!-- 批量操作按钮 -->
        <div class="batch-operations" v-if="selectedSourceIndexes.length > 0">
          <div class="operations-left">
            <el-checkbox
              v-model="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <span class="selected-count">已选择 {{ selectedSourceIndexes.length }} 项</span>
          </div>
          <div class="operations-right">
            <el-button size="small" type="danger" @click="batchDelete">
              <el-icon><delete /></el-icon>批量删除
            </el-button>
          </div>
        </div>

        <!-- 来源列表 -->
        <div
          v-for="(source, index) in sources"
          :key="source.id"
          class="source-item"
          :class="{ active: selectedSourceIndexes.includes(index) }"
        >
          <div class="source-checkbox">
            <el-checkbox 
              v-model="selectedSourceIndexes" 
              :label="index"
              @change="handleCheckChange"
            />
          </div>
          <div class="source-info" @click="showSourceGuide(source)">
            <el-icon class="source-icon">
              <document v-if="source.type === 'manual'" />
              <upload-filled v-else-if="source.type === 'file'" />
              <link v-else-if="source.type === 'url'" />
              <connection v-else-if="source.type === 'api'" />
              <platform v-else-if="source.type === 'mcp'" />
            </el-icon>
            <div class="source-detail">
              <div class="source-name">{{ source.name }}</div>
              <div class="source-desc">{{ source.description }}</div>
            </div>
          </div>
          <div class="source-actions">
            <el-button-group>
              <el-button size="small" @click.stop="editSource(index)">
                <el-icon><edit /></el-icon>
              </el-button>
              <el-button size="small" @click.stop="removeSource(index)">
                <el-icon><delete /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>
        
      <!-- 空状态 -->
      <el-empty v-else description="暂无知识，请点击添加" />

      <!-- 处理选项 -->
      <div class="processing-options">
        <el-form :model="processingConfig" label-position="top">
          <!-- 知识提取目标选择 -->
          <el-form-item label="知识提取目标">
            <div class="extraction-target-cards">
              <div
                v-for="target in extractionTargets"
                :key="target.value"
                class="target-card"
                :class="{ active: processingConfig.target === target.value }"
                @click="selectExtractionTarget(target.value)"
              >
                <div class="card-header">
                  <h4>{{ target.label }}</h4>
                </div>
                <div class="card-content">
                  <p class="target-desc">{{ target.description }}</p>
                </div>
              </div>
            </div>
          </el-form-item>

          <!-- 卡片类型选择 -->
          <el-form-item label="知识卡片类型">
            <div class="card-type-options">
              <div
                v-for="type in getCardTypesByTarget(processingConfig.target || '')"
                :key="type.value"
                class="card-type-item"
                :class="{ 
                  active: processingConfig.cardType === type.value,
                  disabled: !processingConfig.target
                }"
                @click="processingConfig.target && selectCardType(type.value)"
              >
                <div class="type-header">
                  <h4>{{ type.label }}</h4>
                </div>
                <div class="type-content">
                  <p class="type-desc">{{ type.description }}</p>
                </div>
                <div class="type-footer">
                  <el-tag size="small">{{ type.scenarioDesc }}</el-tag>
                </div>
              </div>
            </div>
          </el-form-item>

          <!-- 处理方式的具体配置 -->
          <template v-if="processingConfig.mode === 'compare'">
            <el-form-item label="对比维度">
              <el-checkbox-group v-model="processingConfig.compareOptions">
                <el-checkbox label="content">内容差异</el-checkbox>
                <el-checkbox label="structure">结构差异</el-checkbox>
                <el-checkbox label="time">时间差异</el-checkbox>
                <el-checkbox label="version">版本差异</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>

          <template v-if="processingConfig.mode === 'merge'">
            <el-form-item label="合并策略">
              <el-radio-group v-model="processingConfig.mergeStrategy">
                <el-radio label="sequential">顺序合并</el-radio>
                <el-radio label="topic">按主题合并</el-radio>
                <el-radio label="time">按时间合并</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <template v-if="processingConfig.mode === 'classify'">
            <el-form-item label="分类维度">
              <el-checkbox-group v-model="processingConfig.classifyDimensions">
                <el-checkbox label="topic">主题</el-checkbox>
                <el-checkbox label="type">类型</el-checkbox>
                <el-checkbox label="department">部门</el-checkbox>
                <el-checkbox label="priority">优先级</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
            
          <el-form-item label="AI模型">
            <el-select v-model="processingConfig.model">
              <el-option-group label="免费模型">
                <el-option label="GPT-3.5" value="gpt-3.5" />
                <el-option label="Llama2" value="llama2" />
                <el-option label="Mistral" value="mistral" />
                <el-option label="Gemini" value="gemini" />
                <el-option label="ChatGLM" value="chatglm" />
                <el-option label="Qwen" value="qwen" />
                <el-option label="Baichuan" value="baichuan" />
              </el-option-group>
              <el-option-group label="付费模型">
                <el-option label="GPT-4" value="gpt-4" />
                <el-option label="Claude" value="claude" />
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <el-button type="primary" @click="processMultipleFiles" :loading="analyzing">
        开始处理
      </el-button>
    </div>

    <!-- 添加来源弹窗 -->
    <el-dialog
      v-model="sourceDialog.visible"
      :title="sourceDialog.isEdit ? '编辑知识' : '添加知识'"
      width="500px"
    >
      <div class="source-type-select" v-if="!sourceDialog.isEdit">
        <div
          v-for="type in sourceTypes"
          :key="type.value"
          class="type-item"
          :class="{ active: sourceDialog.form.type === type.value }"
          @click="selectSourceType(type.value)"
        >
          <el-icon>
            <component :is="type.icon" />
          </el-icon>
          <div class="type-name">{{ type.label }}</div>
          <div class="type-desc">{{ type.description }}</div>
        </div>
      </div>

      <!-- 手动输入表单 -->
      <div v-if="sourceDialog.form.type === 'manual'" class="source-form">
        <el-form :model="sourceDialog.form" label-position="top">
          <el-form-item label="内容">
            <el-input
              v-model="sourceDialog.form.content"
              type="textarea"
              :rows="6"
              placeholder="输入内容"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 文件上传表单 -->
      <div v-if="sourceDialog.form.type === 'file'" class="source-form">
        <el-tabs v-model="uploadType">
          <el-tab-pane label="文档" name="document">
            <el-upload
              class="upload-area"
              drag
              action="/api/knowledge/upload/document"
              :before-upload="beforeDocumentUpload"
              :on-success="handleFileUploadSuccess"
              :on-error="handleFileUploadError"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 PDF、Word、Excel、PPT、Markdown 等格式，单个文件不超过100MB
                </div>
              </template>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="音视频" name="media">
            <el-upload
              class="upload-area"
              drag
              action="/api/knowledge/upload/media"
              :before-upload="beforeMediaUpload"
              :on-success="handleMediaUploadSuccess"
              :on-error="handleFileUploadError"
              :on-progress="handleUploadProgress"
            >
              <el-icon class="el-icon--upload"><video-camera /></el-icon>
              <div class="el-upload__text">
                拖拽音视频文件到此处或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持常见音视频格式，单个文件不超过500MB
                </div>
              </template>
            </el-upload>

            <!-- 上传进度 -->
            <el-progress
              v-if="uploadProgress > 0 && uploadProgress < 100"
              :percentage="uploadProgress"
              :format="progressFormat"
            />

            <!-- 预览区域 -->
            <div v-if="uploadedFile" class="media-preview">
              <video
                v-if="uploadedFile.type.startsWith('video')"
                :src="uploadedFile.url"
                controls
                class="preview-player"
              ></video>
              <audio
                v-else-if="uploadedFile.type.startsWith('audio')"
                :src="uploadedFile.url"
                controls
                class="preview-player"
              ></audio>
              <div class="file-info">
                <span>{{ uploadedFile.name }}</span>
                <span>{{ formatFileSize(uploadedFile.size) }}</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 网页导入表单 -->
      <div v-if="sourceDialog.form.type === 'url'" class="source-form">
        <el-form :model="sourceDialog.form" label-position="top">
          <el-form-item label="网页地址">
            <el-input 
              v-model="sourceDialog.form.url" 
              placeholder="输入网页URL"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUrlPreview">预览内容</el-button>
          </el-form-item>
        </el-form>
        
        <!-- URL预览内容 -->
        <div v-if="previewData.loading" class="preview-loading">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else-if="previewData.content" class="preview-content">
          {{ previewData.content }}
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sourceDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddSource">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 中间AI分析区域 -->
    <div class="editor-middle-panel">
      <div class="ai-analysis">
        <div class="analysis-header">
          <h3>AI 分析结果</h3>
          <el-button-group>
            <el-button size="small" @click="regenerateAnalysis">重新生成</el-button>
            <el-button size="small" @click="copyAnalysis">复制</el-button>
          </el-button-group>
        </div>
        
        <div class="analysis-content" v-loading="analyzing">
          <!-- 分析结果结构化展示 -->
          <template v-if="aiResponse && !analyzing">
            <!-- 分析摘要 -->
            <div class="analysis-summary">
              <div class="summary-header">
                <h4>{{ getAnalysisTypeLabel(aiResponse.type) }}</h4>
                <div class="summary-metrics">
                  <el-tag size="small" type="success">可信度: {{ analysisConfidence }}%</el-tag>
                  <el-tag size="small" type="info">处理耗时: {{ processingTime }}ms</el-tag>
              </div>
                </div>
              
              <!-- 相关标签 -->
              <div class="analysis-tags">
                <span class="tags-label">相关标签:</span>
                <div class="tags-list">
                  <el-tag 
                    v-for="tag in analysisTags" 
                    :key="tag" 
                    size="small" 
                    class="tag-item"
                    closable
                    @close="removeAnalysisTag(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-button size="small" text @click="showAnalysisTagInput">
                    <el-icon><plus /></el-icon> 添加标签
                  </el-button>
              </div>
              </div>
              
              <!-- 引用的数据来源 -->
              <div class="analysis-sources">
                <span class="sources-label">数据来源:</span>
                <div class="sources-list">
                  <el-tag 
                    v-for="source in analysisDataSources" 
                    :key="source"
                    size="small" 
                    type="info" 
                    class="source-item"
                  >
                    {{ source }}
                  </el-tag>
              </div>
                </div>
            </div>
            
            <!-- 分析内容块 -->
            <div class="analysis-blocks">
              <div 
                v-for="(block, index) in aiResponse.blocks" 
                :key="index" 
                class="analysis-block"
                :class="{ 'block-excluded': block.excluded }"
              >
                <!-- 块标题 -->
                <div class="block-header" v-if="block.title">
                  <h5>{{ block.title }}</h5>
                  <div class="block-actions">
                    <el-button-group>
                      <el-tooltip 
                        content="标记重要内容" 
                        placement="top" 
                        :disabled="block.isImportant"
                      >
                        <el-button 
                          size="small" 
                          :type="block.isImportant ? 'warning' : 'default'"
                          @click="toggleImportant(index)"
                        >
                          <el-icon><star-filled /></el-icon>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="添加笔记" placement="top">
                        <el-button 
                          size="small" 
                          @click="showNoteInput(index)"
                        >
                          <el-icon><edit /></el-icon>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="复制内容" placement="top">
                        <el-button 
                          size="small" 
                          @click="copyBlockContent(index)"
                        >
                          <el-icon><document-copy /></el-icon>
                        </el-button>
                      </el-tooltip>
                      <el-tooltip 
                        :content="block.excluded ? '恢复内容' : '排除内容'" 
                        placement="top"
                      >
                        <el-button 
                          size="small" 
                          :type="block.excluded ? 'primary' : 'danger'"
                          @click="toggleExclude(index)"
                        >
                          <el-icon>
                            <component :is="block.excluded ? 'refresh-right' : 'close'" />
                          </el-icon>
                        </el-button>
                      </el-tooltip>
                    </el-button-group>
              </div>
            </div>

                <!-- 块内容 -->
                <div 
                  class="block-content" 
                  :class="{ 'content-important': block.isImportant }"
                  v-if="!block.excluded"
                  @mouseup="handleTextSelection($event, index)"
                >
                  <div class="content-text" v-html="formatContentWithAnnotations(block.content, block.annotations || [])"></div>
                  
                  <!-- 内容中的标注 -->
                  <div class="annotation-indicators" v-if="block.annotations && block.annotations.length > 0">
                    <el-divider content-position="left">
                      <el-icon><tickets /></el-icon> 文本标注 ({{ block.annotations.length }})
                    </el-divider>
                    <div class="annotation-list">
                      <div 
                        v-for="(annotation, annoIndex) in block.annotations" 
                        :key="annoIndex"
                        class="annotation-item"
                        @click="showAnnotationPopover(index, annoIndex)"
                      >
                        <el-tag size="small" type="warning" class="annotation-tag">标注 {{ annoIndex + 1 }}</el-tag>
                        <div class="annotation-text">{{ annotation.text }}</div>
                        <el-button 
                          size="small" 
                          text 
                          type="danger" 
                          @click.stop="removeAnnotation(index, annoIndex)"
                        >
                          <el-icon><delete /></el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 排除后的提示 -->
                <div class="block-excluded-notice" v-else>
                  <el-icon><close /></el-icon>
                  <span>此内容已被排除</span>
                </div>
                
                <!-- 笔记输入框 -->
                <div class="block-note-input" v-if="block.showNoteInput">
              <el-input
                    v-model="block.note"
                    type="textarea"
                    :rows="2"
                    placeholder="添加笔记..."
                  />
                  <div class="note-actions">
                    <el-button size="small" @click="cancelNote(index)">取消</el-button>
                    <el-button size="small" type="primary" @click="saveNote(index)">保存</el-button>
                  </div>
                </div>
                
                <!-- 笔记显示 -->
                <div class="block-note" v-if="block.note && !block.showNoteInput && !block.excluded">
                  <div class="note-header">
                    <el-icon><edit /></el-icon>
                    <span>笔记</span>
                    <el-button 
                      size="small" 
                      text 
                      @click="showNoteInput(index)"
                      class="edit-note-btn"
                    >
                      编辑
                    </el-button>
                  </div>
                  <div class="note-content">{{ block.note }}</div>
                </div>
                
                <!-- 源引用信息 -->
                <div class="block-sources" v-if="block.sources && block.sources.length > 0 && !block.excluded">
                  <div class="sources-header">
                    <el-icon><link /></el-icon>
                    <span>来源</span>
                  </div>
                  <div class="sources-list">
                    <el-tag 
                      v-for="source in block.sources" 
                      :key="source"
                      size="small" 
                      type="info"
                    >
                      {{ source }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 交互式输入区 - 分析改进 -->
            <div class="interactive-input">
              <div class="input-header">
                <el-icon><chat-line-round /></el-icon>
                <span>持续优化分析结果</span>
              </div>
              <el-input
                v-model="analysisPrompt"
                type="textarea"
                :rows="3"
                placeholder="输入您的指令来优化分析结果，例如：'进一步分析第二点'、'添加更多关于成本的分析'等..."
                resize="none"
              />
              <div class="input-actions">
                <el-dropdown split-button type="primary" @click="submitAnalysisPrompt" :loading="analyzing">
                  提交
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="applyTemplate('简化分析')">简化分析</el-dropdown-item>
                      <el-dropdown-item @click="applyTemplate('深入分析')">深入分析</el-dropdown-item>
                      <el-dropdown-item @click="applyTemplate('添加实例')">添加实例</el-dropdown-item>
                      <el-dropdown-item @click="applyTemplate('提取关键点')">提取关键点</el-dropdown-item>
                      <el-dropdown-item @click="applyTemplate('增加图表描述')">增加图表描述</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button type="success" @click="previewAsKnowledge" :disabled="!aiResponse">
                  <el-icon><view /></el-icon> 预览知识
                </el-button>
              </div>
            </div>
          </template>
          
          <!-- 替换原有对话界面，改为空状态提示 -->
          <div class="empty-analysis-state" v-else-if="!analyzing">
            <el-empty description="暂无分析结果">
              <template #image>
                <div class="empty-icon">
                  <el-icon><connection /></el-icon>
          </div>
              </template>
              <template #description>
                <div class="empty-description">
                  <p>请选择左侧的数据来源，然后点击"开始处理"按钮</p>
                  <p>AI将根据您选择的处理方式生成分析结果</p>
        </div>
              </template>
              <el-button type="primary" :disabled="selectedSourceIndexes.length === 0" @click="processMultipleFiles">
                开始处理
              </el-button>
            </el-empty>
          </div>
          
          <!-- 正在分析的占位符 -->
          <div class="analyzing-placeholder" v-else>
            <el-icon class="is-loading"><loading /></el-icon>
            <p>AI正在分析您的内容...</p>
            <el-progress 
              type="circle" 
              :percentage="analysisProgress" 
              :status="analysisProgress === 100 ? 'success' : ''"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧知识操作区域 -->
    <div class="editor-right-panel">
      <div class="knowledge-actions">
        <h3>知识库操作</h3>
        
        <el-form :model="knowledgeForm" label-position="top">
          <el-form-item label="知识标题">
            <el-input v-model="knowledgeForm.title" placeholder="输入标题" />
          </el-form-item>
          
          <el-form-item label="标签">
            <el-tag
              v-for="tag in knowledgeForm.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
            
            <el-input
              v-if="inputTagVisible"
              ref="tagInputRef"
              v-model="inputTagValue"
              class="tag-input"
              size="small"
              @keyup.enter="confirmTag"
              @blur="confirmTag"
            />
            
            <el-button v-else size="small" @click="showTagInput">
              + 添加标签
            </el-button>
          </el-form-item>
          
          <el-form-item label="访问权限">
            <el-radio-group v-model="knowledgeForm.visibility">
              <el-radio label="private">私有</el-radio>
              <el-radio label="team">团队可见</el-radio>
              <el-radio label="public">公开</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="自动化工作流">
            <el-select
              v-model="knowledgeForm.workflows"
              multiple
              placeholder="选择工作流"
            >
              <el-option
                v-for="flow in availableWorkflows"
                :key="flow.id"
                :label="flow.name"
                :value="flow.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="API节点">
            <el-select
              v-model="knowledgeForm.apiNodes"
              multiple
              placeholder="选择API节点"
            >
              <el-option
                v-for="node in availableApiNodes"
                :key="node.id"
                :label="node.name"
                :value="node.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        
        <div class="action-buttons">
          <el-button-group>
            <el-button type="primary" @click="saveKnowledge">
              <el-icon><document-add /></el-icon>保存知识
            </el-button>
            <el-button @click="shareKnowledge">
              <el-icon><share /></el-icon>分享
            </el-button>
            <el-button @click="downloadKnowledge">
              <el-icon><download /></el-icon>下载
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- 添加预览指南弹窗 -->
    <el-dialog
      v-model="sourceGuideDialog.visible"
      :title="sourceGuideDialog.source?.name"
      width="600px"
    >
      <div class="source-guide">
        <div class="guide-section">
          <h4>数据摘要</h4>
          <p>{{ sourceGuideDialog.summary }}</p>
        </div>
        
        <div class="guide-section">
          <h4>主题标签</h4>
          <div class="tag-list">
            <el-tag
              v-for="tag in sourceGuideDialog.tags"
              :key="tag"
              size="small"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
        
        <div class="guide-section">
          <h4>来源信息</h4>
          <div class="source-info-item">
            <label>类型：</label>
            <span>{{ sourceTypes.find(t => t.value === sourceGuideDialog.source?.type)?.label }}</span>
          </div>
          <div class="source-info-item">
            <label>创建时间：</label>
            <span>{{ new Date().toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-editor {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 24px;
  height: calc(100vh - 120px);
  padding: 20px;
  background: var(--el-bg-color);
  
  .editor-left-panel,
  .editor-middle-panel,
  .editor-right-panel {
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    padding: 20px;
    overflow-y: auto;
  }
  
  .editor-left-panel {
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        margin: 0;
      }
    }

    .source-list {
      margin-bottom: 20px;

      .batch-operations {
        margin-bottom: 16px;
        padding: 8px 16px;
        background: var(--el-color-primary-light-9);
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .operations-left {
          display: flex;
          align-items: center;
          gap: 12px;

          .selected-count {
            font-size: 14px;
            color: var(--el-text-color-secondary);
          }
        }
      }

      .source-item {
        display: flex;
        align-items: center;
        padding: 12px;
        margin-bottom: 12px;
        background: var(--el-bg-color);
        border-radius: 6px;
        transition: all 0.3s;
        border: 2px solid transparent;
        user-select: none;

        &:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }

        &.active {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
        }

        .source-checkbox {
          margin-right: 12px;
          display: flex;
          align-items: center;

          :deep(.el-checkbox__label) {
            display: none;  // 隐藏复选框后面的label（序号）
          }
        }

        .source-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;

          .source-icon {
            font-size: 24px;
            color: var(--el-color-primary);
          }

          .source-detail {
            .source-name {
              font-weight: 500;
              margin-bottom: 4px;
            }

            .source-desc {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }
        }

        .source-actions {
          opacity: 0;
          transition: opacity 0.3s;
        }

        &:hover .source-actions,
        &.active .source-actions {
          opacity: 1;
        }
      }
    }

    .processing-options {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }

  .editor-middle-panel {
    .analysis-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      h3 {
        margin: 0;
      }
    }
    
    .analysis-content {
      min-height: 200px;
    }
    
    .response-block {
      margin-bottom: 16px;
      padding: 16px;
      background: var(--el-bg-color);
      border-radius: 4px;
      
      .block-content {
        margin-bottom: 8px;
        line-height: 1.6;
        user-select: text;  // 允许文本选择
        
        &::selection {
          background: var(--el-color-primary-light-8);
        }
      }
      
      .block-annotations {
        margin: 8px 0;
        padding: 8px;
        background: var(--el-bg-color-page);
        border-radius: 4px;
        
        .annotation-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
          
          &:not(:last-child) {
            border-bottom: 1px solid var(--el-border-color-lighter);
          }
          
          .annotation-text {
            flex: 1;
            margin-right: 8px;
            color: var(--el-text-color-regular);
          }
        }
      }
      
      .annotation-popover {
        .annotation-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
          gap: 8px;
        }
      }
      
      .block-actions {
        display: flex;
        justify-content: flex-end;
      }
    }
    
    .analyzing-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: var(--el-text-color-secondary);
      
      .el-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
    }
  }
  
  .editor-right-panel {
    .knowledge-actions {
      h3 {
        margin-top: 0;
        margin-bottom: 20px;
      }
      
      .tag-item {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      
      .tag-input {
        width: 100px;
        margin-right: 8px;
        vertical-align: bottom;
      }
      
      .action-buttons {
        margin-top: 24px;
        
        .el-button-group {
          display: flex;
          width: 100%;
          
          .el-button {
            flex: 1;
          }
        }
      }
    }
  }

  .source-type-select {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;

    .type-item {
      padding: 16px;
      border-radius: 8px;
      border: 1px solid var(--el-border-color-lighter);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: var(--el-color-primary);
      }

      &.active {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);
      }

      .el-icon {
        font-size: 24px;
        color: var(--el-color-primary);
        margin-bottom: 8px;
      }

      .type-name {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .type-desc {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .source-form {
    margin-top: 20px;
  }

  .mcp-service-list {
    .mcp-service-item {
      display: flex;
      align-items: center;
      padding: 16px;
      margin-bottom: 12px;
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover:not(.disabled) {
        border-color: var(--el-color-primary);
        transform: translateY(-2px);
      }

      &.active:not(.disabled) {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);
      }

      &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .service-icon {
        font-size: 24px;
        color: var(--el-color-primary);
        margin-right: 16px;
      }

      .service-info {
        flex: 1;

        .service-name {
          font-weight: 500;
          margin-bottom: 8px;
        }

        .service-status {
          display: flex;
          align-items: center;
          gap: 12px;

          .sync-time {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
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
  
  --el-bg-color: #1E1E2E;
  --el-bg-color-overlay: #2A2A3C;
  --el-border-color-lighter: #363646;
  
  --el-text-color-primary: #E2E8F0;
  --el-text-color-regular: #CBD5E1;
  --el-text-color-secondary: #94A3B8;
}

.service-type {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.media-preview {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;

  .preview-player {
    width: 100%;
    margin-bottom: 12px;
  }

  .file-info {
    display: flex;
    justify-content: space-between;
    color: var(--el-text-color-regular);
    font-size: 14px;
  }
}

.preview-content {
  margin-top: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  overflow: hidden;

  .preview-header {
    padding: 12px 16px;
    background: var(--el-fill-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
      margin: 0;
    }
  }

  .preview-body {
    padding: 16px;

    .preview-item {
      margin-bottom: 12px;

      label {
        color: var(--el-text-color-secondary);
        margin-right: 8px;
      }

      .content-preview {
        margin-top: 8px;
        padding: 12px;
        background: var(--el-fill-color-lighter);
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.5;
      }
    }

    .api-response,
    .mcp-data {
      padding: 12px;
      background: var(--el-fill-color-lighter);
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}

.preview-loading {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.source-guide {
  .guide-section {
    margin-bottom: 20px;
    
    h4 {
      margin: 0 0 12px;
      color: var(--el-text-color-primary);
    }
    
    p {
      margin: 0;
      line-height: 1.6;
      color: var(--el-text-color-regular);
    }
    
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .source-info-item {
      margin-bottom: 8px;
      
      label {
        color: var(--el-text-color-secondary);
        margin-right: 8px;
      }
    }
  }
}

.processing-options {
  margin: 16px 0;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  
  .message {
    display: flex;
    gap: 12px;
    max-width: 80%;
    
    &.ai-message {
      align-self: flex-start;
    }
    
    &.user-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    
    .message-avatar {
      flex-shrink: 0;
    }
    
    .message-content {
      background: var(--el-bg-color-overlay);
      padding: 12px 16px;
      border-radius: 8px;
      
      .message-text {
        line-height: 1.6;
        white-space: pre-wrap;
      }
      
      .source-list {
        margin: 8px 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 4px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
  
  .message-input {
    margin-top: 20px;
    
    .input-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
  }
}

// 添加AI分析结果相关样式
.analysis-content {
  .analysis-summary {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    
    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      h4 {
        margin: 0;
        color: var(--el-color-primary);
      }
      
      .summary-metrics {
        display: flex;
        gap: 8px;
      }
    }
    
    .analysis-tags,
    .analysis-sources {
      margin: 12px 0;
      display: flex;
      align-items: flex-start;
      
      .tags-label,
      .sources-label {
        flex-shrink: 0;
        color: var(--el-text-color-secondary);
        margin-right: 8px;
        padding-top: 4px;
      }
      
      .tags-list,
      .sources-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }
  
  .analysis-blocks {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
    
    .analysis-block {
      background: var(--el-bg-color);
      border-radius: 8px;
      padding: 16px;
      border-left: 3px solid var(--el-color-primary-light-5);
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      
      &.block-excluded {
        opacity: 0.7;
        background: var(--el-bg-color-page);
        border-left-color: var(--el-text-color-disabled);
      }
      
      .block-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        h5 {
          margin: 0;
          color: var(--el-text-color-primary);
          font-weight: 600;
        }
      }
      
      .block-content {
        line-height: 1.6;
        white-space: pre-wrap;
        position: relative;
        margin: 8px 0;
        padding: 4px 0;
        
        &.content-important {
          background-color: var(--el-color-warning-light-9);
          padding: 12px;
          border-radius: 4px;
        }
        
        &::selection {
          background: var(--el-color-primary-light-8);
        }
        
        .content-annotation {
          position: absolute;
          color: var(--el-color-primary);
          cursor: pointer;
          font-size: 14px;
          
          &:hover {
            transform: scale(1.2);
          }
        }
      }
      
      .block-excluded-notice {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--el-text-color-secondary);
        font-style: italic;
        padding: 10px;
        background: var(--el-fill-color-light);
        border-radius: 4px;
      }
      
      .block-note-input {
        margin: 12px 0;
        border-top: 1px dashed var(--el-border-color-lighter);
        padding-top: 12px;
        
        .note-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
          gap: 8px;
        }
      }
      
      .block-note {
        margin: 12px 0;
        background: var(--el-fill-color-light);
        border-radius: 4px;
        padding: 12px;
        
        .note-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: var(--el-text-color-secondary);
          
          .edit-note-btn {
            margin-left: auto;
          }
        }
        
        .note-content {
          color: var(--el-text-color-primary);
          font-size: 14px;
          white-space: pre-wrap;
        }
      }
      
      .block-sources {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px dashed var(--el-border-color-lighter);
        
        .sources-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }
        
        .sources-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }
  }
  
  .analysis-improvements {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 16px;
    
    .improvements-header {
      margin-bottom: 16px;
      
      h4 {
        margin: 0;
        color: var(--el-text-color-primary);
      }
    }
    
    .improvements-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  }
  
  .analyzing-placeholder {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: var(--el-text-color-secondary);
    
    .el-icon {
      font-size: 24px;
      color: var(--el-color-primary);
    }
    
    .el-progress {
      margin-top: 20px;
    }
  }
}

/* 添加空状态样式 */
.empty-analysis-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .empty-icon {
    font-size: 48px;
    color: var(--el-color-primary-light-5);
    margin-bottom: 16px;
  }
  
  .empty-description {
    margin: 16px 0;
    color: var(--el-text-color-secondary);
    text-align: center;
    
    p {
      margin: 8px 0;
    }
  }
  
  .el-button {
    margin-top: 16px;
  }
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  
  .message {
    display: flex;
    gap: 12px;
    max-width: 80%;
    
    &.ai-message {
      align-self: flex-start;
    }
    
    &.user-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    
    .message-avatar {
      flex-shrink: 0;
    }
    
    .message-content {
      background: var(--el-bg-color-overlay);
      padding: 12px 16px;
      border-radius: 8px;
      
      .message-text {
        line-height: 1.6;
        white-space: pre-wrap;
      }
      
      .source-list {
        margin: 8px 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 4px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
  
  .message-input {
    margin-top: 20px;
    
    .input-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
  }
}

// 添加AI分析结果相关样式
.analysis-content {
  // ... 保留原有样式

  // 标注高亮样式
  .highlight-annotation {
    background-color: rgba(255, 230, 0, 0.3);
    border-bottom: 1px dashed var(--el-color-warning);
    padding: 0 2px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: rgba(255, 230, 0, 0.5);
    }
  }
  
  // 标注列表样式
  .annotation-indicators {
    margin: 16px 0;
    
    .annotation-list {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .annotation-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: var(--el-fill-color-light);
        border-radius: 4px;
        
        .annotation-tag {
          flex-shrink: 0;
        }
        
        .annotation-text {
          flex: 1;
          font-size: 14px;
          color: var(--el-text-color-primary);
        }
      }
    }
  }
  
  // MCP链接样式
  .block-mcp-links {
    margin-top: 16px;
    border-top: 1px dashed var(--el-border-color-lighter);
    padding-top: 16px;
    
    .mcp-links-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: var(--el-text-color-secondary);
    }
    
    .mcp-links-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .mcp-link-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .mcp-link-url {
          flex: 1;
          color: var(--el-color-primary);
          text-decoration: none;
          font-size: 14px;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  
  // 交互式输入区样式
  .interactive-input {
    margin-top: 24px;
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 16px;
    
    .input-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: var(--el-text-color-secondary);
      font-weight: 500;
    }
    
    .input-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
  }
  
  // 空状态样式修改，确保与新设计一致
  .empty-analysis-state {
    height: 300px;
    // 保留原有样式
  }
}

.extraction-target-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  height: 300px;
  overflow-y: auto;
  padding-right: 8px;
  width: 100%;
  box-sizing: border-box;

  .target-card {
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 120px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    .card-header {
      margin-bottom: 12px;

      h4 {
        margin: 0;
        color: var(--el-text-color-primary);
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .card-content {
      flex: 1;
      overflow: hidden;
      
      .target-desc {
        margin: 0;
        color: var(--el-text-color-secondary);
        font-size: 14px;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}

.card-type-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  height: 300px;
  overflow-y: auto;
  padding-right: 8px;
  width: 100%;
  box-sizing: border-box;

  .card-type-item {
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 120px; // 调整为与目标卡片相同的高度
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;

    &:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .type-header {
      margin-bottom: 12px;

      h4 {
        margin: 0;
        color: var(--el-text-color-primary);
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .type-content {
      flex: 1;
      overflow: hidden;
      margin-bottom: 12px;

      .type-desc {
        margin: 0;
        color: var(--el-text-color-secondary);
        font-size: 14px;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .type-footer {
      .el-tag {
        margin-right: 8px;
        margin-bottom: 8px;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.processing-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  background-color: var(--el-color-primary-light-9);
  border-radius: 8px;
  margin: 16px 0;

  .el-button {
    font-size: 16px;
    padding: 12px 24px;
    
    .el-icon {
      font-size: 18px;
      margin-right: 8px;
    }
  }

  .processing-tip {
    margin: 12px 0 0;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}
</style>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import {
  Plus,
  Document,
  Link,
  Connection,
  Edit,
  Delete,
  DocumentAdd,
  StarFilled,
  Close,
  Loading,
  Share,
  Download,
  UploadFilled,
  Folder,
  Tickets,
  VideoCamera,
  ChatRound,
  User,
  DocumentCopy,
  ZoomIn,
  ZoomOut,
  Aim,
  FullScreen,
  RefreshRight,
  DataAnalysis,
  View,
  MagicStick
} from '@element-plus/icons-vue'

// 扩展Window接口以包含MCP
declare global {
  interface Window {
    MCP: {
      connect(config: {
        name: string
        endpoint: string
        type: 'project' | 'task' | 'document'
      }): Promise<{
        id: string
        disconnect(): void
      }>
    }
  }
}

// 基础类型定义
interface BaseSource {
  id: string
  type: 'manual' | 'file' | 'url' | 'api' | 'mcp'
  name: string
  description: string
}

interface ManualSource extends BaseSource {
  type: 'manual'
  content: string
}

interface FileSource extends BaseSource {
  type: 'file'
  content: string
}

interface UrlSource extends BaseSource {
  type: 'url'
  url: string
  content: string
  metadata: {
  title: string
    description: string
    author: string
    publishDate: string
  }
}

interface ApiSource extends BaseSource {
  type: 'api'
  endpoint: string
  method: 'get' | 'post'
  params: string
}

interface McpSource extends BaseSource {
  type: 'mcp'
  serviceId: string
  serviceName: string
  serviceType: 'project' | 'task' | 'document'
}

// 统一导出类型
type Source = ManualSource | FileSource | UrlSource | ApiSource | McpSource
type SourceType = Source['type']

// 类型定义
interface AIBlock {
  content: string
  note: string
  showNoteInput: boolean
  sources?: string[]
  type?: string
  title?: string
  tags?: string[]
  annotations?: Array<{
    text: string
    left: number
    top: number
  }>
  editContent?: string
  showEdit?: boolean
  showAnnotation?: boolean
  annotationText?: string
  annotationLeft?: number
  annotationTop?: number
  isImportant?: boolean
  excluded?: boolean
  mcpLinks?: Array<{
    name: string
    url: string
  }>
}

interface AIResponse {
  type: string
  blocks: AIBlock[]
}

interface KnowledgeFormData {
  title: string
  content: string
  visibility: 'private' | 'team' | 'public'
  tags: string[]
  workflows: number[]
  apiNodes: number[]
}

// 表单数据
const knowledgeForm = reactive<KnowledgeFormData>({
  title: '',
  content: '',
  visibility: 'private',
  tags: [],
  workflows: [],
  apiNodes: []
})

// 输入相关
const activeInputMethod = ref('manual')
const manualInput = ref('')
const urlImportForm = reactive({
  url: ''
})
const apiImportForm = reactive({
  endpoint: '',
  method: 'get',
  params: ''
})

// 处理配置
const processingConfig = reactive({
  target: 'content_summary', // 默认选择内容摘要
  cardType: '',
  mode: 'summary',
  model: 'gpt-3.5',
  compareOptions: [] as string[],
  mergeStrategy: 'sequential',
  nodeExtractionMethod: 'auto',
  autoConnectNodes: true,
  compareShowSimilarity: true,
  classifyDimensions: ['topic'] as string[]
})

// 知识提取目标列表
const extractionTargets = ref([
  {
    value: 'content_summary',
    label: '内容摘要',
    description: '用于快速理解文档主旨，提取一段概括性描述'
  },
  {
    value: 'faq',
    label: '常见问答（FAQ）',
    description: '从内容中识别高频问题及答案对'
  },
  {
    value: 'field_extraction',
    label: '字段说明提取',
    description: '将表格或文本中的字段信息结构化为说明卡片'
  },
  {
    value: 'error_code',
    label: '异常码解释',
    description: '解释系统异常码的含义、原因和建议'
  },
  {
    value: 'terminology',
    label: '术语定义',
    description: '提取行业或系统术语及解释说明'
  },
  {
    value: 'operation_process',
    label: '操作流程提取',
    description: '提炼多步操作流程或指引内容'
  },
  {
    value: 'content_comparison',
    label: '内容对比分析',
    description: '对比两个版本内容差异，提取差异点'
  },
  {
    value: 'doc_merge',
    label: '多文档合并',
    description: '将多个文档合并为统一知识卡片'
  },
  {
    value: 'module_classification',
    label: '模块归类推荐',
    description: '由AI判断知识所属的系统模块或页面'
  },
  {
    value: 'bilingual',
    label: '中英文同步生成',
    description: '生成同内容的中英文卡片内容'
  }
])

// AI分析相关
const analyzing = ref(false)
const aiResponse = ref<AIResponse | null>(null)
const analysisProgress = ref(0)
const analysisConfidence = ref(85)
const processingTime = ref(1240)
const analysisTags = ref<string[]>(['AI分析', '自动生成'])
const analysisDataSources = ref<string[]>([])

// 标签输入
const inputTagVisible = ref(false)
const inputTagValue = ref('')
const tagInputRef = ref<HTMLInputElement | null>(null)

// AI分析类型标签映射
const analysisTypeLabels: Record<string, string> = {
  'summary': '内容摘要',
  'qa': '问答对',
  'key_points': '关键点提取',
  'compare': '内容对比',
  'merge': '合并结果',
  'classify': '智能分类'
}

// 获取分析类型标签
const getAnalysisTypeLabel = (type: string): string => {
  return analysisTypeLabels[type] || '分析结果'
}

// 标签相关
const showAnalysisTagInput = () => {
  // 显示分析标签输入框
  ElMessageBox.prompt('请输入标签名称', '添加标签', {
    confirmButtonText: '添加',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    if (value && !analysisTags.value.includes(value)) {
      analysisTags.value.push(value)
    }
  }).catch(() => {
    // 取消添加
  })
}

// 移除分析标签
const removeAnalysisTag = (tag: string) => {
  const index = analysisTags.value.indexOf(tag)
  if (index > -1) {
    analysisTags.value.splice(index, 1)
  }
}

// 内容块操作
// 标记重要内容
const toggleImportant = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    const block = aiResponse.value.blocks[index]
    block.isImportant = !block.isImportant
  }
}

// 复制块内容
const copyBlockContent = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    const content = aiResponse.value.blocks[index].content
    navigator.clipboard.writeText(content)
      .then(() => {
        ElMessage.success('内容已复制到剪贴板')
      })
      .catch(() => {
        ElMessage.error('复制失败')
      })
  }
}

// 排除/恢复块内容
const toggleExclude = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    const block = aiResponse.value.blocks[index]
    block.excluded = !block.excluded
    
    // 如果排除了内容，更新数据源引用
    if (block.excluded) {
      // 更新全局数据源
      updateAnalysisDataSources()
    }
  }
}

// 显示笔记输入
const showNoteInput = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    aiResponse.value.blocks[index].showNoteInput = true
  }
}

// 取消笔记
const cancelNote = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    const block = aiResponse.value.blocks[index]
    // 如果是新笔记，清空内容
    if (!block.note) {
      block.note = ''
    }
    block.showNoteInput = false
  }
}

// 更新分析数据源
const updateAnalysisDataSources = () => {
  if (!aiResponse.value) return
  
  // 获取未被排除的块的所有数据源
  const sources = new Set<string>()
  aiResponse.value.blocks.forEach(block => {
    if (!block.excluded && block.sources) {
      block.sources.forEach(source => sources.add(source))
    }
  })
  
  analysisDataSources.value = Array.from(sources)
}

// 文本选中和标注
const handleTextSelection = (event: MouseEvent, blockIndex: number) => {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) return

  const range = selection.getRangeAt(0)
  const selectedText = selection.toString().trim()
  
  if (!selectedText) return
  
  // 获取选中文本的位置
  const rect = range.getBoundingClientRect()
  
  // 显示标注操作弹出框
  ElMessageBox.prompt('请输入标注内容', '添加标注', {
    confirmButtonText: '添加',
    cancelButtonText: '取消',
    inputValue: selectedText
  }).then(({ value }) => {
    // 保存标注
    if (aiResponse.value && aiResponse.value.blocks[blockIndex]) {
      const block = aiResponse.value.blocks[blockIndex]
      if (!block.annotations) {
        block.annotations = []
      }
      
      block.annotations.push({
        text: value,
        left: rect.left,
        top: rect.top
      })
      
      ElMessage.success('标注已添加')
    }
  }).catch(() => {
    // 取消标注
  })
}

// 显示标注弹出框
const showAnnotationPopover = (blockIndex: number, annotationIndex: number) => {
  if (!aiResponse.value) return
  
  const block = aiResponse.value.blocks[blockIndex]
  if (!block || !block.annotations) return
  
  const annotation = block.annotations[annotationIndex]
  
  ElMessageBox.alert(annotation.text, '标注内容', {
    confirmButtonText: '关闭',
    callback: () => {}
  })
}

// 改进分析结果
const showMoreDetails = () => {
  analyzing.value = true
  analysisProgress.value = 0
  
  // 模拟进度变化
  const interval = setInterval(() => {
    analysisProgress.value += 10
    if (analysisProgress.value >= 100) {
      clearInterval(interval)
      
      // 更新分析结果，添加更多详细信息
      if (aiResponse.value) {
        aiResponse.value.blocks.forEach(block => {
          if (!block.excluded) {
            block.content += '\n\n更多详细信息: 这里是AI生成的额外详细内容分析...'
          }
        })
      }
      
      analyzing.value = false
      ElMessage.success('已显示更多详细信息')
    }
  }, 200)
}

const simplifyResults = () => {
  if (!aiResponse.value) return
  
  // 简化结果，保留主要内容
  aiResponse.value.blocks.forEach(block => {
    if (!block.excluded && block.content) {
      // 简化内容，截取前3行
      const lines = block.content.split('\n')
      if (lines.length > 3) {
        block.content = lines.slice(0, 3).join('\n') + '\n...'
      }
    }
  })
  
  ElMessage.success('已简化分析结果')
}

const focusOnKey = () => {
  if (!aiResponse.value) return
  
  // 聚焦关键内容，只保留重要块
  const hasImportant = aiResponse.value.blocks.some(block => block.isImportant)
  
  if (hasImportant) {
    // 如果有标记为重要的块，排除非重要块
    aiResponse.value.blocks.forEach(block => {
      block.excluded = !block.isImportant
    })
  } else {
    // 如果没有标记为重要的块，自动标记第一个为重要
    if (aiResponse.value.blocks.length > 0) {
      aiResponse.value.blocks[0].isImportant = true
    }
  }
  
  // 更新数据源
  updateAnalysisDataSources()
  
  ElMessage.success('已聚焦关键内容')
}

const expandAnalysisDimensions = () => {
  analyzing.value = true
  analysisProgress.value = 0
  
  // 模拟进度变化
  const interval = setInterval(() => {
    analysisProgress.value += 10
    if (analysisProgress.value >= 100) {
      clearInterval(interval)
      
      // 添加新的分析维度
      if (aiResponse.value) {
        // 添加时间趋势分析
        aiResponse.value.blocks.push({
          title: '时间趋势分析',
          content: '基于内容的时间趋势分析结果...',
          note: '',
          showNoteInput: false,
          sources: analysisDataSources.value,
          type: 'time_trend',
          excluded: false
        })
        
        // 添加情感分析
        aiResponse.value.blocks.push({
          title: '情感分析',
          content: '内容的情感分析结果显示为中性偏积极...',
          note: '',
          showNoteInput: false,
          sources: analysisDataSources.value,
          type: 'sentiment',
          excluded: false
        })
        
        // 添加相关性分析
        aiResponse.value.blocks.push({
          title: '相关性分析',
          content: '内容与已知知识库的相关性分析...',
          note: '',
          showNoteInput: false,
          sources: analysisDataSources.value,
          type: 'correlation',
          excluded: false
        })
      }
      
      analyzing.value = false
      ElMessage.success('已扩展分析维度')
    }
  }, 200)
}

// 可用的工作流和API节点
const availableWorkflows = [
  { id: 1, name: '文档审批流程' },
  { id: 2, name: '知识发布流程' }
]

const availableApiNodes = [
  { id: 1, name: '数据验证节点' },
  { id: 2, name: '格式转换节点' }
]

// 标签管理
const showTagInput = () => {
  inputTagVisible.value = true
  nextTick(() => {
    const input = tagInputRef.value
    if (input) {
      input.focus()
    }
  })
}

const confirmTag = () => {
  if (inputTagValue.value && !knowledgeForm.tags.includes(inputTagValue.value)) {
    knowledgeForm.tags.push(inputTagValue.value)
  }
  inputTagVisible.value = false
  inputTagValue.value = ''
}

const removeTag = (tag: string) => {
  const index = knowledgeForm.tags.indexOf(tag)
  if (index > -1) {
    knowledgeForm.tags.splice(index, 1)
  }
}

// 文件上传处理
const beforeFileUpload = (file: File): boolean => {
  const isValidType = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown'
  ].includes(file.type)
  
  const isLt100M = file.size / 1024 / 1024 < 100

  if (!isValidType) {
    ElMessage.error('不支持的文件类型！')
    return false
  }
  if (!isLt100M) {
    ElMessage.error('文件大小不能超过 100MB！')
    return false
  }
  
  return true
}

interface UploadResponse {
  content: string
  fileName?: string
  fileType?: string
  fileSize?: number
  url?: string
}

const handleFileUploadSuccess = (response: UploadResponse) => {
  ElMessage.success('文件上传成功')
  manualInput.value = response.content || ''
}

const handleFileUploadError = () => {
  ElMessage.error('文件上传失败')
}

// 从URL导入
const importFromUrl = async () => {
  if (!urlImportForm.url) {
    ElMessage.warning('请输入网页地址')
    return
  }

  try {
    const response = await fetch('/api/knowledge/import/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(urlImportForm)
    })
    
    const data = await response.json()
    if (data.success) {
      manualInput.value = data.content
      ElMessage.success('导入成功')
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    ElMessage.error('导入失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 从API导入
const importFromApi = async () => {
  if (!apiImportForm.endpoint) {
    ElMessage.warning('请输入API地址')
    return
  }

  try {
    const response = await fetch('/api/knowledge/import/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiImportForm)
    })
    
    const data = await response.json()
    if (data.success) {
      manualInput.value = data.content
      ElMessage.success('导入成功')
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    ElMessage.error('导入失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// AI分析相关类型定义
interface Message {
  id: string
  type: 'user' | 'ai' 
  content: string
  timestamp: number
  sources?: string[]
  isKnowledge?: boolean // 标记是否已转为知识文档
}

interface AnalysisResult {
  type: 'analysis' | 'query' | 'knowledge'
  content: string
  relatedSources: string[]
  tags?: string[]
  confidence: number
}

// 对话历史
const chatHistory = ref<Message[]>([])

// 移除第一个 generateSummary 函数的实现，保留类型定义
interface GenerateSummaryFunction {
  (sources: Source[]): Promise<AnalysisResult>
}

// 将原来的 generateSummary 实现重命名为 generateContentSummary
const generateContentSummary: GenerateSummaryFunction = async (sources) => {
  return {
    type: 'analysis',
    content: '这是生成的摘要内容...',
    relatedSources: sources.map(s => s.name),
    confidence: 0.95
  }
}

// 修改 processContent 函数中的调用
const processContent = async () => {
  if (selectedSourceIndexes.value.length === 0) {
    ElMessage.warning('请选择要处理的数据源')
    return
  }

  analyzing.value = true
  try {
    const selectedSources = selectedSourceIndexes.value.map(index => sources.value[index])
    
    // 根据处理模式执行不同的分析
    let result: AnalysisResult
    switch (processingConfig.mode) {
      case 'summary':
        result = await generateContentSummary(selectedSources)
        break
      case 'qa':
        result = await generateQA(selectedSources)
        break
      case 'key_points':
        result = await extractKeyPoints(selectedSources)
        break
      case 'compare':
        result = await compareContent(selectedSources)
        break
      case 'merge':
        result = await mergeContent(selectedSources)
        break
      case 'classify':
        result = await classifyContent(selectedSources)
        break
      default:
        throw new Error('未知的处理模式')
    }

    // 添加AI回复到对话历史
    const aiMessage: Message = {
      id: generateUUID(),
      type: 'ai',
      content: result.content,
      timestamp: Date.now(),
      sources: result.relatedSources
    }
    chatHistory.value.push(aiMessage)

    // 更新分析结果
    aiResponse.value = {
      type: processingConfig.mode,
      blocks: [{
        content: result.content,
        note: '',
        showNoteInput: false,
        sources: result.relatedSources,
        tags: result.tags
      }]
    }
  } catch (error) {
    ElMessage.error('分析失败：' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    analyzing.value = false
  }
}

// 查询处理
const handleQuery = async (query: string) => {
  if (!query.trim()) return
  
  analyzing.value = true
  try {
    const selectedSources = selectedSourceIndexes.value.map(index => sources.value[index])
    
    // 添加用户查询到对话历史
    const userMessage: Message = {
      id: generateUUID(),
      type: 'user',
      content: query,
      timestamp: Date.now()
    }
    chatHistory.value.push(userMessage)

    // 执行查询分析
    const result = await analyzeQuery(query, selectedSources)

    // 添加AI回复
    const aiMessage: Message = {
      id: generateUUID(),
      type: 'ai',
      content: result.content,
      timestamp: Date.now(),
      sources: result.relatedSources
    }
    chatHistory.value.push(aiMessage)

    // 更新分析结果
    aiResponse.value = {
      type: 'query',
      blocks: [{
        content: result.content,
        note: '',
        showNoteInput: false,
        sources: result.relatedSources,
        tags: result.tags
      }]
    }
  } finally {
    analyzing.value = false
  }
}

// 生成知识文档
const generateKnowledge = async () => {
  if (chatHistory.value.length === 0) {
    ElMessage.warning('没有可用的对话内容')
    return
  }

  analyzing.value = true
  try {
    // 收集所有相关的对话内容
    const conversations = chatHistory.value.filter(msg => !msg.isKnowledge)
    
    // 生成知识文档
    const result = await synthesizeKnowledge(conversations)

    // 添加到知识库
    const knowledge = {
      title: knowledgeForm.title || '未命名知识',
      content: result.content,
      tags: result.tags || [],
      sources: result.relatedSources,
      visibility: knowledgeForm.visibility,
      workflows: knowledgeForm.workflows,
      apiNodes: knowledgeForm.apiNodes,
      createTime: Date.now()
    }

    // 标记相关对话已转为知识
    conversations.forEach(msg => {
      msg.isKnowledge = true
    })

    ElMessage.success('已生成知识文档')
    return knowledge
  } catch (error) {
    ElMessage.error('生成知识文档失败')
    throw error
  } finally {
    analyzing.value = false
  }
}

// 保持 generateSourceSummary 函数不变
const generateSourceSummary = async (source: Source): Promise<string> => {
  // 根据不同类型生成摘要
  switch (source.type) {
    case 'manual':
    case 'file':
      return source.content.substring(0, 200) + '...'
    case 'url':
      return source.metadata.description || '暂无摘要'
    case 'api':
      return '来自API的数据摘要'
    case 'mcp':
      return `来自${source.serviceName}的${source.serviceType}数据`
    default:
      return '暂无摘要'
  }
}

const generateQA = async (sources: Source[]): Promise<AnalysisResult> => {
  // 实现问答对生成逻辑
  return {
    type: 'analysis',
    content: '这是生成的问答对...',
    relatedSources: sources.map(s => s.name),
    confidence: 0.9
  }
}

const extractKeyPoints = async (sources: Source[]): Promise<AnalysisResult> => {
  // 实现关键点提取逻辑
  return {
    type: 'analysis',
    content: '这是提取的关键点...',
    relatedSources: sources.map(s => s.name),
    confidence: 0.85
  }
}

const compareContent = async (sources: Source[]): Promise<AnalysisResult> => {
  // 实现内容对比逻辑
  return {
    type: 'analysis',
    content: '这是内容对比结果...',
    relatedSources: sources.map(s => s.name),
    confidence: 0.8
  }
}

const mergeContent = async (sources: Source[]): Promise<AnalysisResult> => {
  // 实现内容合并逻辑
  return {
    type: 'analysis',
    content: '这是合并后的内容...',
    relatedSources: sources.map(s => s.name),
    confidence: 0.75
  }
}

const classifyContent = async (sources: Source[]): Promise<AnalysisResult> => {
  // 实现内容分类逻辑
  return {
    type: 'analysis',
    content: '这是分类结果...',
    relatedSources: sources.map(s => s.name),
    confidence: 0.7
  }
}

const analyzeQuery = async (query: string, sources: Source[]): Promise<AnalysisResult> => {
  // 实现查询分析逻辑
  return {
    type: 'query',
    content: '这是查询分析结果...',
    relatedSources: sources.map(s => s.name),
    confidence: 0.85
  }
}

const synthesizeKnowledge = async (conversations: Message[]): Promise<AnalysisResult> => {
  // 实现知识合成逻辑
  return {
    type: 'knowledge',
    content: '这是合成的知识文档...',
    relatedSources: Array.from(new Set(conversations.flatMap(msg => msg.sources || []))),
    tags: ['自动生成', '知识文档'],
    confidence: 0.9
  }
}

// AI分析结果操作
const regenerateAnalysis = async () => {
  if (chatHistory.value.length === 0) {
    return
  }
  
  const lastUserMessage = [...chatHistory.value]
    .reverse()
    .find(msg => msg.type === 'user')
    
  if (lastUserMessage) {
    // 移除最后一条AI回复
    chatHistory.value = chatHistory.value.filter(msg => msg.id !== chatHistory.value[chatHistory.value.length - 1].id)
    // 重新生成回复
    await sendMessage()
  }
}

const copyAnalysis = () => {
  // 实现复制功能
  ElMessage.success('复制成功')
}

const markAsImportant = (index: number) => {
  // 标记重要内容
}

const addNote = (index: number) => {
  if (aiResponse.value?.blocks[index]) {
    aiResponse.value.blocks[index].showNoteInput = true
  }
}

const saveNote = (index: number) => {
  if (aiResponse.value?.blocks[index]) {
    aiResponse.value.blocks[index].showNoteInput = false
  }
}

const excludeBlock = (index: number) => {
  // 排除某个分析块
}

// 知识库操作
const saveKnowledge = () => {
  if (!knowledgeForm.title) {
    ElMessage.warning('请输入标题')
    return
  }
  
  knowledgeForm.content = manualInput.value
  // 实现保存逻辑
  ElMessage.success('保存成功')
}

const shareKnowledge = () => {
  // 实现分享功能
  ElMessage.success('分享成功')
}

const downloadKnowledge = () => {
  // 实现下载功能
  ElMessage.success('下载成功')
}

// 来源类型选项
const sourceTypes = [
  {
    label: '手动输入',
    value: 'manual' as const,
    icon: 'Document',
    description: '直接输入或粘贴文本内容'
  },
  {
    label: '文件上传',
    value: 'file' as const,
    icon: 'UploadFilled',
    description: '上传本地文档文件'
  },
  {
    label: '网页导入',
    value: 'url' as const,
    icon: 'Link',
    description: '从网页URL导入内容'
  },
  {
    label: 'API导入',
    value: 'api' as const,
    icon: 'Connection',
    description: '从API接口获取数据'
  },
  {
    label: 'MCP导入',
    value: 'mcp' as const,
    icon: 'Platform',
    description: '从MCP平台导入数据'
  }
]

// 来源列表
const sources = ref<Source[]>([])

// 来源弹窗表单类型
type SourceMethod = 'get' | 'post'
type McpType = 'project' | 'task' | 'document'

interface SourceDialogForm extends BaseSource {
  content: string
  url: string
  endpoint: string
  method: SourceMethod
  params: string
  serviceId: string
  serviceName: string
  serviceType: McpType
}

// 来源弹窗
const sourceDialog = reactive({
  visible: false,
  isEdit: false,
  editIndex: -1,
  form: {
    type: 'manual' as Source['type'],
    name: '',
    description: '',
    content: '',
    url: '',
    endpoint: '',
    method: 'get' as SourceMethod,
    params: '',
    serviceId: '',
    serviceName: '',
    serviceType: 'project' as McpType
  } as SourceDialogForm
})

// 显示添加来源弹窗
const showAddSourceDialog = () => {
  sourceDialog.visible = true
  sourceDialog.isEdit = false
  sourceDialog.form = {
    type: 'manual',
    name: '',
    description: '',
    content: '',
    url: '',
    endpoint: '',
    method: 'get',
    params: '',
    serviceId: '',
    serviceName: '',
    serviceType: 'project'
  } as SourceDialogForm
}

// 选择来源类型
const selectSourceType = (type: Source['type']) => {
  sourceDialog.form.type = type
  // 清空预览数据
  previewData.loading = false
  previewData.success = false
  previewData.content = null
  previewData.error = ''
  
  // 清空相关表单数据
  switch (type) {
    case 'manual':
      sourceDialog.form.content = ''
      break
    case 'url':
      sourceDialog.form.url = ''
      break
    case 'api':
      sourceDialog.form.endpoint = ''
      sourceDialog.form.method = 'get'
      sourceDialog.form.params = ''
      break
    case 'mcp':
      sourceDialog.form.serviceId = ''
      sourceDialog.form.serviceName = ''
      sourceDialog.form.serviceType = 'project'
      mcpConnectionType.value = 'predefined'
      selectedMcpService.value = null
      break
  }
}

// 修改选中相关的响应式数据，改用数组存储选中项
const selectedSourceIndexes = ref<number[]>([])

// 修改选中源的方法,只在复选框change时触发
const selectSource = (index: number) => {
  const selectedIndex = selectedSourceIndexes.value.indexOf(index)
  if (selectedIndex > -1) {
    selectedSourceIndexes.value.splice(selectedIndex, 1)
  } else {
    selectedSourceIndexes.value.push(index)
  }
  handleCheckChange()
}

// 修改移除源的方法
const removeSource = (index: number) => {
  // 从选中列表中移除被删除的项
  selectedSourceIndexes.value = selectedSourceIndexes.value.filter(i => i !== index)
  // 更新大于被删除索引的选中项
  selectedSourceIndexes.value = selectedSourceIndexes.value.map(i => i > index ? i - 1 : i)
  sources.value.splice(index, 1)
}

// 修改编辑源的方法
const editSource = (index: number) => {
  // 编辑时只能选中单个项
  selectedSourceIndexes.value = [index]
  const source = sources.value[index]
  sourceDialog.visible = true
  sourceDialog.isEdit = true
  sourceDialog.editIndex = index
  
  // 初始化表单
  sourceDialog.form = {
    type: source.type,
    name: source.name,
    description: source.description,
    content: source.type === 'manual' || source.type === 'file' ? source.content : '',
    url: source.type === 'url' ? source.url : '',
    endpoint: source.type === 'api' ? source.endpoint : '',
    method: source.type === 'api' ? source.method : 'get',
    params: source.type === 'api' ? source.params : '',
    serviceId: source.type === 'mcp' ? source.serviceId : '',
    serviceName: source.type === 'mcp' ? source.serviceName : '',
    serviceType: source.type === 'mcp' ? source.serviceType : 'project'
  } as SourceDialogForm
}

// 添加批量操作按钮
const batchOperationsTemplate = `
<div class="batch-operations" v-if="selectedSourceIndexes.length > 0">
  <div class="operations-left">
    <el-checkbox
      v-model="isAllSelected"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <span class="selected-count">已选择 {{ selectedSourceIndexes.length }} 项</span>
  </div>
  <div class="operations-right">
    <el-button size="small" type="danger" @click="batchDelete">
      <el-icon><delete /></el-icon>批量删除
    </el-button>
  </div>
</div>
`

// 修改来源列表的模板
const sourceListTemplate = `
<div class="source-list" v-if="sources.length > 0">
  <!-- 批量操作按钮 -->
  <div class="batch-operations" v-if="selectedSourceIndexes.length > 0">
    <div class="operations-left">
      <el-checkbox
        v-model="isAllSelected"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <span class="selected-count">已选择 {{ selectedSourceIndexes.length }} 项</span>
    </div>
    <div class="operations-right">
      <el-button size="small" type="danger" @click="batchDelete">
        <el-icon><delete /></el-icon>批量删除
      </el-button>
    </div>
  </div>

  <!-- 来源列表 -->
  <div
    v-for="(source, index) in sources"
    :key="source.id"
    class="source-item"
    :class="{ active: selectedSourceIndexes.includes(index) }"
  >
    <div class="source-checkbox">
      <el-checkbox 
        v-model="selectedSourceIndexes" 
        :label="index"
        @change="handleCheckChange"
      />
    </div>
    <div class="source-info" @click="showSourceGuide(source)">
      <el-icon class="source-icon">
        <document v-if="source.type === 'manual'" />
        <upload-filled v-else-if="source.type === 'file'" />
        <link v-else-if="source.type === 'url'" />
        <connection v-else-if="source.type === 'api'" />
        <platform v-else-if="source.type === 'mcp'" />
      </el-icon>
      <div class="source-detail">
        <div class="source-name">{{ source.name }}</div>
        <div class="source-desc">{{ source.description }}</div>
      </div>
    </div>
    <div class="source-actions">
      <el-button-group>
        <el-button size="small" @click.stop="editSource(index)">
          <el-icon><edit /></el-icon>
        </el-button>
        <el-button size="small" @click.stop="removeSource(index)">
          <el-icon><delete /></el-icon>
        </el-button>
      </el-button-group>
    </div>
  </div>
</div>

<style lang="scss">
.source-list {
  .batch-operations {
    margin-bottom: 16px;
    padding: 8px;
    background: var(--el-color-primary-light-9);
    border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;

    .selected-count {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .source-item {
    user-select: none; // 防止拖动选择文本
  }
}
</style>
`

// 添加批量操作方法
const batchProcess = () => {
  // ... existing code ...
}

const batchDelete = () => {
  if (selectedSourceIndexes.value.length === 0) {
    ElMessage.warning('请先选择要删除的项')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedSourceIndexes.value.length} 个数据源吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 从大到小排序，以便正确删除
    const sortedIndexes = [...selectedSourceIndexes.value].sort((a, b) => b - a)
    sortedIndexes.forEach(index => {
      sources.value.splice(index, 1)
    })
    selectedSourceIndexes.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// MCP相关类型定义
interface McpServiceConfig {
  name: string
  endpoint: string
  type: 'project' | 'task' | 'document'
}

// MCP服务列表
const mcpServices = ref<McpServiceConfig[]>([
  {
    name: '项目管理系统',
    endpoint: 'http://mcp-project.example.com',
    type: 'project'
  },
  {
    name: '任务管理系统',
    endpoint: 'http://mcp-task.example.com',
    type: 'task'
  }
])

// 添加新的响应式数据
const mcpConnectionType = ref('predefined')
const selectedMcpService = ref<McpServiceConfig | null>(null)
const mcpManualConfig = reactive<McpServiceConfig>({
  name: '',
  endpoint: '',
  type: 'project'
})

const uploadType = ref('document')
const uploadProgress = ref(0)
const uploadedFile = ref<{
  name: string
  type: string
  size: number
  url: string
} | null>(null)

// 文件上传相关方法
const beforeDocumentUpload = (file: File) => {
  const isValidType = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown'
  ].includes(file.type)
  
  const isLt100M = file.size / 1024 / 1024 < 100

  if (!isValidType) {
    ElMessage.error('不支持的文件类型！')
    return false
  }
  if (!isLt100M) {
    ElMessage.error('文件大小不能超过 100MB！')
    return false
  }
  
  return true
}

const beforeMediaUpload = (file: File) => {
  const isValidType = [
    'video/mp4',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'audio/mp3'
  ].includes(file.type)
  
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isValidType) {
    ElMessage.error('不支持的文件类型！')
    return false
  }
  if (!isLt500M) {
    ElMessage.error('文件大小不能超过 500MB！')
    return false
  }
  
  return true
}

const handleMediaUploadSuccess = (response: any) => {
  ElMessage.success('文件上传成功')
  uploadedFile.value = {
    name: response.fileName,
    type: response.fileType,
    size: response.fileSize,
    url: response.url
  }
  uploadProgress.value = 100
}

const handleUploadProgress = (event: ProgressEvent) => {
  if (event.lengthComputable) {
    uploadProgress.value = Math.round((event.loaded * 100) / event.total)
  }
}

const progressFormat = (percentage: number) => {
  return percentage === 100 ? '上传完成' : `${percentage}%`
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 修改MCP连接方法
const connectMcpService = async () => {
  const config = mcpConnectionType.value === 'predefined' 
    ? selectedMcpService.value 
    : mcpManualConfig

  if (!config) {
    ElMessage.error('请选择或输入MCP服务信息')
    return
  }

  try {
    // 创建MCP连接
    const connection = await window.MCP.connect(config)

    // 保存连接信息
    sourceDialog.form.serviceId = connection.id
    sourceDialog.form.serviceName = config.name
    sourceDialog.form.serviceType = config.type

    ElMessage.success('MCP服务连接成功')
  } catch (error) {
    console.error('MCP连接失败:', error)
    ElMessage.error(`连接失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

// 添加预览数据的类型定义
interface PreviewData {
  loading: boolean
  success: boolean
  content: {
    // URL预览内容
    title?: string
    description?: string
    content?: string
    author?: string
    publishDate?: string
    // API预览内容
    id?: number
    name?: string
    items?: Array<{ id: number; value: string }>
    timestamp?: string
    // MCP预览内容
    serviceName?: string
    serviceType?: string
    data?: any
  } | null
  error: string
}

// 修改为使用类型定义
const previewData = reactive<PreviewData>({
  loading: false,
  success: false,
  content: null,
  error: ''
})

// 添加方法类型定义
const handleUrlPreview = async (): Promise<void> => {
  if (!sourceDialog.form.url) {
    ElMessage.warning('请输入网页地址')
    return
  }

  previewData.loading = true
  previewData.content = null
  previewData.error = ''

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData = {
      success: true,
      title: '示例网页标题',
      description: '这是一个示例网页的描述信息，用于测试预览功能。',
      content: '这是网页的主要内容。这是一个很长的文本，包含了网页的具体内容。这里可能包含很多段落，图片，列表等等。这是示例内容的一部分...',
      author: 'John Doe',
      publishDate: '2024-03-15'
    }

    if (mockData.success) {
      previewData.success = true
      previewData.content = {
        title: mockData.title,
        description: mockData.description,
        content: mockData.content,
        author: mockData.author,
        publishDate: mockData.publishDate
      }
    } else {
      throw new Error('解析失败')
    }
  } catch (error) {
    previewData.success = false
    previewData.error = error instanceof Error ? error.message : '未知错误'
    ElMessage.error('预览失败：' + previewData.error)
  } finally {
    previewData.loading = false
  }
}

// API预览处理
const handleApiPreview = async () => {
  if (!sourceDialog.form.endpoint) {
    ElMessage.warning('请输入API地址')
    return
  }

  previewData.loading = true
  previewData.content = null
  previewData.error = ''

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData = {
      success: true,
      data: {
        id: 123,
        name: '示例API数据',
        items: [
          { id: 1, value: 'Item 1' },
          { id: 2, value: 'Item 2' },
          { id: 3, value: 'Item 3' }
        ],
        timestamp: new Date().toISOString()
      }
    }

    if (mockData.success) {
      previewData.success = true
      previewData.content = mockData.data
    } else {
      throw new Error('解析失败')
    }
  } catch (error) {
    previewData.success = false
    previewData.error = error instanceof Error ? error.message : '未知错误'
    ElMessage.error('预览失败：' + previewData.error)
  } finally {
    previewData.loading = false
  }
}

// MCP预览处理
const handleMcpPreview = async () => {
  const config = mcpConnectionType.value === 'predefined' 
    ? selectedMcpService.value 
    : mcpManualConfig

  if (!config) {
    ElMessage.warning('请选择或输入MCP服务信息')
    return
  }

  previewData.loading = true
  previewData.content = null
  previewData.error = ''

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData = {
      success: true,
      serviceName: config.name || '示例MCP服务',
      serviceType: config.type || 'project',
      data: {
        id: 'mcp-123',
        projects: [
          { id: 'p1', name: '项目1', status: 'active' },
          { id: 'p2', name: '项目2', status: 'pending' }
        ],
        lastUpdate: new Date().toISOString()
      }
    }

    previewData.success = true
    previewData.content = {
      serviceName: mockData.serviceName,
      serviceType: mockData.serviceType,
      data: mockData.data
    }
  } catch (error) {
    previewData.success = false
    previewData.error = error instanceof Error ? error.message : '未知错误'
    ElMessage.error('预览失败：' + previewData.error)
  } finally {
    previewData.loading = false
  }
}

// 修改确认添加来源方法
const confirmAddSource = async () => {
  // 如果没有预览数据，提示先预览
  if (sourceDialog.form.type !== 'manual' && 
      sourceDialog.form.type !== 'file' && 
      !previewData.content) {
    ElMessage.warning('请先预览内容')
    return
  }

  // 直接添加数据源
  let content: any
  let name: string = ''
  let description: string = ''

  // 根据类型获取内容
  switch (sourceDialog.form.type) {
    case 'manual':
      content = sourceDialog.form.content
      name = content.split('\n')[0].slice(0, 20) || '手动输入'
      description = '手动输入的内容'
      break
    case 'file':
      content = sourceDialog.form.content
      name = content.fileName || '上传文件'
      description = '上传的文件内容'
      break
    case 'url':
      content = previewData.content
      name = content?.title || new URL(sourceDialog.form.url).hostname
      description = content?.description || `来自 ${new URL(sourceDialog.form.url).hostname} 的内容`
      break
    case 'api':
      content = previewData.content
      name = content?.name || '接口数据'
      description = '从API获取的数据'
      break
    case 'mcp':
      content = previewData.content
      name = content?.serviceName || 'MCP数据'
      description = `从${content?.serviceType || 'MCP'}服务获取的数据`
      break
  }

  const baseSource = {
    id: generateUUID(),
    name,
    description
  }

  let newSource: Source
  
  switch (sourceDialog.form.type) {
    case 'manual':
      newSource = {
        ...baseSource,
        type: 'manual',
        content: sourceDialog.form.content
      }
      break
    case 'file':
      newSource = {
        ...baseSource,
        type: 'file',
        content: sourceDialog.form.content
      }
      break
    case 'url':
      newSource = {
        ...baseSource,
        type: 'url',
        url: sourceDialog.form.url,
        content: content.content,
        metadata: {
          title: content.title,
          description: content.description,
          author: content.author,
          publishDate: content.publishDate
        }
      } as UrlSource
      break
    case 'api':
      newSource = {
        ...baseSource,
        type: 'api',
        endpoint: sourceDialog.form.endpoint,
        method: sourceDialog.form.method,
        params: sourceDialog.form.params
      }
      break
    case 'mcp':
      newSource = {
        ...baseSource,
        type: 'mcp',
        serviceId: sourceDialog.form.serviceId,
        serviceName: sourceDialog.form.serviceName,
        serviceType: sourceDialog.form.serviceType
      }
      break
    default:
      throw new Error('未知的来源类型')
  }

  if (sourceDialog.isEdit) {
    sources.value[sourceDialog.editIndex] = newSource
    // 编辑时保持选中状态
    if (!selectedSourceIndexes.value.includes(sourceDialog.editIndex)) {
      selectedSourceIndexes.value.push(sourceDialog.editIndex)
    }
  } else {
    // 添加新数据源时自动选中
    sources.value.push(newSource)
    const newIndex = sources.value.length - 1
    selectedSourceIndexes.value.push(newIndex)
  }

  // 更新全选状态
  handleCheckChange()
  
  // 添加成功后清空预览数据
  previewData.loading = false
  previewData.success = false
  previewData.content = null
  previewData.error = ''

  // 关闭弹窗并提示
  sourceDialog.visible = false
  ElMessage.success(sourceDialog.isEdit ? '编辑成功' : '添加成功')
}

// 在组件挂载时初始化MCP Client
onMounted(() => {
  // 初始化其他必要的设置
})

// 在组件卸载时断开连接
onUnmounted(() => {
  // 清理其他必要的资源
})

// 添加新的响应式数据
const isAllSelected = ref(false)
const isIndeterminate = ref(false)

// 添加新的方法
const handleCheckAllChange = (val: boolean) => {
  selectedSourceIndexes.value = val ? sources.value.map((_, index) => index) : []
  isIndeterminate.value = false
}

const handleCheckChange = () => {
  const checkedCount = selectedSourceIndexes.value.length
  isAllSelected.value = checkedCount === sources.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < sources.value.length
}

// 在script部分添加uuid生成函数
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 添加预览指南相关的响应式数据
const sourceGuideDialog = reactive({
  visible: false,
  source: null as Source | null,
  summary: '',
  tags: [] as string[]
})

// 显示数据源指南
const showSourceGuide = async (source: Source) => {
  sourceGuideDialog.visible = true
  sourceGuideDialog.source = source
  
  try {
    // 使用新的函数名
    sourceGuideDialog.summary = await generateSourceSummary(source)
    sourceGuideDialog.tags = await extractTags(source)
  } catch (error) {
    console.error('加载指南失败:', error)
    ElMessage.error('加载指南失败')
  }
}

// 提取标签的方法
const extractTags = async (source: Source): Promise<string[]> => {
  // 根据内容提取关键词作为标签
  return ['示例标签1', '示例标签2']
}

// 处理多个文件
const processMultipleFiles = async () => {
  if (selectedSourceIndexes.value.length === 0) {
    ElMessage.warning('请选择要处理的文件')
    return
  }

  const selectedSources = selectedSourceIndexes.value.map(index => sources.value[index])
  
  try {
    analyzing.value = true
    analysisProgress.value = 0
    
    // 模拟进度变化
    const interval = setInterval(() => {
      analysisProgress.value += 5
      if (analysisProgress.value >= 100) {
        clearInterval(interval)
        debugger
        // 生成模拟数据
        aiResponse.value = generateDemoAnalysis(processingConfig.mode)
        
        // 更新分析相关数据
        updateAnalysisDataSources()
        processingTime.value = Math.floor(Math.random() * 2000) + 1000 // 1000-3000ms之间
        analysisConfidence.value = Math.floor(Math.random() * 15) + 80 // 80-95%之间
        
        analyzing.value = false
    ElMessage.success('处理完成')
      }
    }, 100)
  } catch (error) {
    console.error('处理失败:', error)
    ElMessage.error('处理失败')
    analyzing.value = false
  }
}

// 生成示例分析结果（用于演示）
const generateDemoAnalysis = (mode: string): AIResponse => {
  // 如果有target和cardType，则根据其组合返回对应的示例内容
  if (processingConfig.target && processingConfig.cardType) {
    const targetCardKey = `${processingConfig.target}_${processingConfig.cardType}`;
    
    switch (targetCardKey) {
      // 内容摘要 - 标准卡片
      case 'content_summary_standard':
        return {
          type: 'summary',
          blocks: [
            {
              title: '内容摘要 - 标准卡片 示例卡片',
              content: `OMS预约流程是为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。
              
关键词: OMS, 预约管理, 时间窗口, 仓库配置`,
              note: '',
              showNoteInput: false,
              sources: ['《OMS预约管理操作手册v2.0》', '预约管理模块文档'],
              type: 'summary',
              isImportant: true
            }
          ]
        }
      
      // 内容摘要 - QA卡片
      case 'content_summary_qa':
        return {
          type: 'qa',
          blocks: [
            {
              title: '内容摘要 - QA卡片 示例卡片',
              content: `Q: OMS系统中如何修改已创建预约单的预计到货时间？
A: 您可进入预约详情页，点击页面右上角"编辑"按钮，找到"预计到货时间"字段，选择新的时间后点击保存即可。请注意，仅在预约状态为"未审核"或"退回"时可进行修改。

适用模块: OMS > Appointment`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '预约管理手册'],
              type: 'qa'
            }
          ]
        }
      
      // 内容摘要 - 术语卡片
      case 'content_summary_terminology':
        return {
          type: 'key_points',
          blocks: [
            {
              title: '内容摘要 - 术语卡片 示例卡片',
              content: `• 术语: Fulfillment SLA
• 定义说明: SLA 是 Service Level Agreement 的简称，在OMS系统中指从订单创建至最终发货的最大可接受时长
• 中文名称: 履约服务等级协议
• 示例用法: 客户A设定的SLA为48小时，意味着从OMS生成销售订单起，需在48小时内完成拣货、打包并出库发运`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '订单管理手册'],
              type: 'key_points',
              isImportant: true
            }
          ]
        }
        
      // FAQ - 流程卡片
      case 'faq_flow':
        return {
          type: 'key_points',
          blocks: [
            {
              title: '常见问答（FAQ） - 流程卡片 示例卡片',
              content: `预约单创建流程:
1. 进入预约管理页面，点击"新建预约"
2. 填写基本信息（预约类型、客户、仓库、车牌号等）
3. 选择预约时段并绑定任务（可选）
4. 提交审核或直接保存草稿

适用模块: OMS > Appointment
备注说明: 适用于所有进出货预约场景`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '预约管理手册'],
              type: 'key_points',
              isImportant: true
            }
          ]
        }
        
      // FAQ - QA卡片
      case 'faq_qa':
        return {
          type: 'qa',
          blocks: [
            {
              title: '常见问答（FAQ） - QA卡片 示例卡片',
              content: `Q: OMS系统中如何修改已创建预约单的预计到货时间？
A: 您可进入预约详情页，点击页面右上角"编辑"按钮，找到"预计到货时间"字段，选择新的时间后点击保存即可。请注意，仅在预约状态为"未审核"或"退回"时可进行修改。

适用模块: OMS > Appointment`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '预约管理手册'],
              type: 'qa'
            }
          ]
        }
        
      // FAQ - 标准卡片
      case 'faq_standard':
        return {
          type: 'summary',
          blocks: [
            {
              title: '常见问答（FAQ） - 标准卡片 示例卡片',
              content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。
              
关键词: OMS, 预约管理, 时间窗口, 预约流程`,
              note: '',
              showNoteInput: false,
              sources: ['《OMS预约管理操作手册v2.0》', '预约管理模块文档'],
              type: 'summary'
            }
          ]
        }
        
      // 字段说明提取 - 字段卡片
      case 'field_extraction_field':
        return {
          type: 'key_points',
          blocks: [
            {
              title: '字段说明提取 - 字段卡片 示例卡片',
              content: `• 字段名: appointment_type
• 定义: 标识该预约单的业务方向，分为入库(INBOUND)、出库(OUTBOUND)、同时双向(BOTH)。
• 类型: String
• 控件类型: Dropdown
• 字段类型: String
• 依赖字段: customer_type, direction
• 页面路径: /oms/appointment/create`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '字段说明文档'],
              type: 'key_points',
              isImportant: true
            }
          ]
        }
        
      // 字段说明提取 - 术语卡片
      case 'field_extraction_terminology':
        return {
          type: 'key_points',
          blocks: [
            {
              title: '字段说明提取 - 术语卡片 示例卡片',
              content: `• 术语: Fulfillment SLA
• 定义说明: SLA 是 Service Level Agreement 的简称，在OMS系统中指从订单创建至最终发货的最大可接受时长
• 中文名称: 履约服务等级协议
• 示例用法: 客户A设定的SLA为48小时，意味着从OMS生成销售订单起，需在48小时内完成拣货、打包并出库发运`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '订单管理手册'],
              type: 'key_points'
            }
          ]
        }
        
      // 字段说明提取 - 标准卡片
      case 'field_extraction_standard':
        return {
          type: 'summary',
          blocks: [
            {
              title: '字段说明提取 - 标准卡片 示例卡片',
              content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。
              
关键词: OMS, 预约管理, 时间窗口, 预约字段`,
              note: '',
              showNoteInput: false,
              sources: ['《OMS预约管理操作手册v2.0》', '预约管理模块文档'],
              type: 'summary'
            }
          ]
        }
      
      // 异常码解释 - 流程卡片  
      case 'error_code_flow':
        return {
          type: 'key_points',
          blocks: [
            {
              title: '异常码解释 - 流程卡片 示例卡片',
              content: `预约单创建流程:
1. 进入预约管理页面，点击"新建预约"
2. 填写基本信息（预约类型、客户、仓库、车牌号等）
3. 选择预约时段并绑定任务（可选）
4. 提交审核或直接保存草稿

适用模块: OMS > Appointment
备注说明: 适用于所有进出货预约场景`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '预约管理手册'],
              type: 'key_points'
            }
          ]
        }
        
      // 异常码解释 - QA卡片
      case 'error_code_qa':
        return {
          type: 'qa',
          blocks: [
            {
              title: '异常码解释 - QA卡片 示例卡片',
              content: `Q: 预约单创建时出现E2097错误码是什么意思？
A: E2097代表"预约单提交失败，系统检测到未配置客户默认仓库"。您需要先在客户资料中配置默认仓库，或确认目标仓库处于启用状态后再次尝试提交预约单。

适用模块: OMS > Appointment`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '错误排查手册'],
              type: 'qa'
            }
          ]
        }
        
      // 异常码解释 - 异常卡片
      case 'error_code_error':
        return {
          type: 'key_points',
          blocks: [
            {
              title: '异常码解释 - 异常卡片 示例卡片',
              content: `• 异常码: E2097
• 异常说明: 预约单提交失败，系统检测到未配置客户默认仓库
• 触发接口: /api/oms/appointment/submit
• 触发条件: appointment.warehouse_id == null 或 warehouse.status == 'inactive'
• 建议操作: 请在客户资料中配置默认仓库，或确认目标仓库处于启用状态`,
              note: '',
              showNoteInput: false,
              sources: ['OMS系统文档', '错误排查手册'],
              type: 'key_points',
              isImportant: true
            }
          ]
        }

      // 内容对比分析 - 对比卡片
      case 'content_comparison_comparison':
        return {
          type: 'compare',
          blocks: [
            {
              title: '内容对比分析 - 对比卡片 示例卡片',
              content: `| 对比项目 | OMS V1预约流程 | OMS V2预约流程 |
|--------|----------|---------|
| 预约类型 | 仅支持单向预约 | 支持双向预约(BOTH) |
| 时间粒度 | 按整日预约 | 支持时间窗口细分 |
| 任务绑定 | 预约后手动关联 | 可在创建时直接绑定 |
| 容量管理 | 无自动检查 | 自动检查时段容量 |
| 审核流程 | 一级审核 | 多级审核支持 |
| 通知方式 | 系统内通知 | 多渠道通知(短信/邮件/系统) |
| 变更记录 | 简单日志 | 完整变更历史追踪 |

建议：统一采用OMS V2预约流程，支持更精细的时间管理和任务关联`,
              note: '',
              showNoteInput: false,
              sources: ['预约管理升级方案', '系统对比文档'],
              type: 'compare',
              isImportant: true
            }
          ]
        }

      // 多文档合并 - 综合卡片
      case 'doc_merge_comprehensive':
        return {
          type: 'merge',
          blocks: [
            {
              title: '多文档合并 - 综合卡片 示例卡片',
              content: `# 预约管理流程整合指南

## 预约基础
预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，支持入库、出库和双向三种类型的预约单创建和管理。

## 创建流程
完整的预约创建流程包括进入预约管理页面、填写基本信息、选择预约时段、绑定相关任务和提交审核五个主要环节。

## 系统配置
预约系统支持多级审核、容量管理和时间窗口设置，可根据不同仓库和业务类型设置不同的预约规则和审核流程。

## 异常处理
E2097等常见异常有标准化的处理方式，如配置默认仓库或确认仓库状态，系统提供完善的错误提示和解决建议。

## 最佳实践
建议提前24小时创建预约单，合理设置时间窗口，并确保所有必填信息准确完整，可有效提高预约审核通过率和仓库作业效率。`,
              note: '',
              showNoteInput: false,
              sources: ['《OMS预约管理操作手册v2.0》', '预约审核规范.docx', '仓库预约最佳实践.pdf'],
              type: 'merge',
              isImportant: true
            }
          ]
        }

      // 模块归类推荐 - 模块卡片
      case 'module_classification_module':
        return {
          type: 'classify',
          blocks: [
            {
              title: '模块归类推荐 - 模块卡片 示例卡片',
              content: `## 系统归属
OMS（订单管理系统）

## 功能模块
Appointment（预约管理）

## 页面路径
/oms/appointment/manage

## 功能用途
- 入库/出库预约创建
- 预约单审核与管理
- 时间窗口容量配置
- 预约单与任务关联
- 预约状态跟踪与变更

## 相关接口
- /api/oms/appointment/create
- /api/oms/appointment/submit
- /api/oms/appointment/review
- /api/oms/appointment/update`,
              note: '',
              showNoteInput: false,
              sources: ['系统架构文档', '接口设计说明'],
              type: 'classify',
              isImportant: true
            }
          ]
        }

      // 中英文同步生成 - 双语卡片
      case 'bilingual_bilingual':
        return {
          type: 'key_points',
          blocks: [
            {
              title: '中英文同步生成 - 双语卡片 示例卡片',
              content: `【中文内容】
点击"新建预约"按钮进入预约单创建流程。

【英文内容】
Click 'Create Appointment' to start the appointment process.

【适用模块】
OMS > Appointment`,
              note: '',
              showNoteInput: false,
              sources: ['系统操作手册', '国际化文档'],
              type: 'key_points',
              isImportant: true
            }
          ]
        }
      
      default:
        break;
    }
  }
  
  // 如果没有匹配到target和cardType组合，或者它们未设置，按原来的mode返回内容
  switch (mode) {
    case 'summary':
      return {
        type: 'summary',
        blocks: [
          {
            title: '退货工作流摘要',
            content: `退货工作流是指顾客将已购买的商品退回给商家，并获得退款或更换的过程。完整的退货流程包括：
1. 顾客提出退货申请（7天无理由退货或质量问题退货）
2. 客服审核退货申请（确认是否符合退货条件）
3. 系统生成退货单号（用于物流追踪）
4. 顾客寄回商品（可自选物流或使用商家指定物流）
5. 仓库接收并检查商品（确认商品状态与退货原因）
6. 质检部门评估商品（判断是否属于质量问题）
7. 财务部门处理退款（原路退回或退至余额）
8. 系统更新库存与订单状态（关闭订单并恢复库存）

整个流程一般在顾客提交申请后的15个工作日内完成，特殊情况下可能需要额外处理时间。`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档', '客户服务手册', '退款流程指南', 'ERP系统接口文档'],
            type: 'summary',
            isImportant: true
          }
        ]
      }
      
    case 'qa':
      return {
        type: 'qa',
        blocks: [
          {
            title: '退货基本问题',
            content: `Q: 什么情况下可以申请退货？
A: 顾客可在以下情况申请退货：1) 收到商品7天内且商品完好可申请无理由退货；2) 商品存在质量问题；3) 商品与描述不符；4) 卖家发错货；5) 收到商品有损坏。

Q: 退货流程的第一步是什么？
A: 退货流程的第一步是顾客在系统中提交退货申请，选择退货原因并上传商品照片作为凭证。

Q: 退款会多久到账？
A: 退款时间因支付方式不同而异：1) 原路退回信用卡一般需7-15个工作日；2) 退回支付宝/微信账户一般为1-3个工作日；3) 退至平台余额一般为24小时内。`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档', '客户服务手册'],
            type: 'qa'
          },
          {
            title: '系统操作问题',
            content: `Q: 如何在系统中创建退货单？
A: 系统创建退货单的步骤：1) 登录管理后台；2) 进入"订单管理"模块；3) 找到对应订单；4) 点击"申请退货"按钮；5) 填写退货原因和备注；6) 提交审核。

Q: ERP系统与退货流程如何集成？
A: ERP系统通过API接口与退货系统集成：1) 退货申请创建后自动推送至ERP；2) ERP生成退货单号；3) 退货完成后ERP自动更新库存；4) 财务模块自动处理退款记录。

Q: 如何处理特殊退货情况？
A: 特殊退货处理流程：1) 进入"异常订单"模块；2) 创建特殊处理工单；3) 分配给专门客服；4) 根据实际情况制定解决方案；5) 记录处理结果并通知顾客。`,
            note: '',
            showNoteInput: false,
            sources: ['ERP系统接口文档', '退款流程指南'],
            type: 'qa'
          }
        ]
      }
      
    case 'key_points':
      return {
        type: 'key_points',
        blocks: [
          {
            title: '退货政策关键点',
            content: `• 7天无理由退货政策适用于未拆封、未使用的商品
• 食品、定制商品、数字下载商品不适用无理由退货
• 质量问题退货需提供明确的商品缺陷证据
• 退货运费由责任方承担（质量问题商家付，个人原因买家付）
• 特殊商品（大家电、家具）有专门的退货政策`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档'],
            type: 'key_points',
            isImportant: true
          },
          {
            title: '退货流程关键节点',
            content: `• 顾客提交申请后24小时内客服必须响应
• 系统自动生成唯一的退货跟踪号码
• 顾客寄回商品有10天时间窗口
• 仓库收到商品后48小时内完成检查
• 确认无问题后72小时内处理退款
• 全流程有明确的SLA（服务级别协议）要求`,
            note: '',
            showNoteInput: false,
            sources: ['客户服务手册', '退款流程指南'],
            type: 'key_points'
          },
          {
            title: '系统集成关键点',
            content: `• ERP系统通过REST API与退货模块实时对接
• 库存变更采用事务机制确保一致性
• 退款处理使用异步队列避免支付网关压力
• 所有退货单据采用统一编码规则
• 系统提供完整的退货报表和分析能力
• 支持第三方物流系统对接和跟踪`,
            note: '',
            showNoteInput: false,
            sources: ['ERP系统接口文档'],
            type: 'key_points'
          }
        ]
      }
      
    case 'compare':
      return {
        type: 'compare',
        blocks: [
          {
            title: '线上与线下退货流程对比',
            content: `| 流程环节 | 线上退货 | 线下退货 |
|--------|---------|---------|
| 申请方式 | 系统提交申请 | 实体店填写表单 |
| 审核时间 | 24小时内 | 现场即时审核 |
| 退货方式 | 物流寄回 | 直接到店退回 |
| 检查流程 | 仓库统一检查 | 店员现场检查 |
| 退款方式 | 原路返回 | 现金或POS机退款 |
| 处理时长 | 7-15个工作日 | 1-3个工作日 |
| 系统记录 | 全流程记录 | 可能存在信息断点 |
| 客户体验 | 不便但流程规范 | 便捷但可能不统一 |`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档', '客户服务手册'],
            type: 'compare'
          },
          {
            title: '不同退货原因的处理流程对比',
            content: `| 处理环节 | 质量问题 | 7天无理由 | 商品损坏 | 商品不符 |
|--------|---------|---------|---------|---------|
| 申请材料 | 问题照片+说明 | 包装完好证明 | 损坏详情+照片 | 描述差异说明 |
| 客服审核 | 严格审查问题 | 检查是否符合条件 | 确认损坏程度 | 核对商品信息 |
| 物流费用 | 商家承担 | 买家承担 | 协商解决 | 商家承担 |
| 检查重点 | 确认质量缺陷 | 确认未使用痕迹 | 确认非人为损坏 | 核对订单信息 |
| 退款比例 | 全额+赔偿 | 仅商品金额 | 视损坏程度定 | 全额退款 |
| 处理优先级 | 高 | 中 | 高 | 高 |
| 是否计入指标 | 计入质量问题 | 不计入品质问题 | 计入物流指标 | 计入错发指标 |`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档', '退款流程指南'],
            type: 'compare',
            isImportant: true
          }
        ]
      }
      
    case 'merge':
      return {
        type: 'merge',
        blocks: [
          {
            title: '退货工作流综合分析',
            content: `# 退货工作流综合分析报告

## 政策基础
退货政策是整个流程的基础，包括7天无理由退货和质量问题退货两大类。无理由退货要求商品完好未使用，而质量问题退货需提供明确的商品问题证据。

## 操作流程
完整的退货操作流程包括顾客申请、客服审核、生成退货单、寄回商品、仓库检查、质检评估、退款处理和库存更新八个主要环节。每个环节都有明确的时间要求和处理标准。

## 系统支持
ERP系统通过API与退货系统无缝集成，确保库存、订单和财务数据的一致性。系统采用统一的编码规则和异步处理机制，支持高并发的退货请求。

## 效率指标
整体退货流程一般在15个工作日内完成，其中客服响应时间不超过24小时，仓库检查不超过48小时，退款处理不超过72小时。按责任方不同，物流费用分别由买家或卖家承担。

## 优化方向
可通过引入智能审核、退货预测模型和优化物流路线来提升整体效率。此外，提高客服培训和质检标准也能减少退货争议和提升客户满意度。`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档', '客户服务手册', '退款流程指南', 'ERP系统接口文档'],
            type: 'merge',
            isImportant: true
          }
        ]
      }
      
    case 'classify':
      return {
        type: 'classify',
        blocks: [
          {
            title: '按参与部门分类',
            content: `## 客服部门
- 负责接收并初步审核退货申请
- 与顾客沟通退货细节和流程
- 处理退货过程中的投诉和问题
- 记录退货原因和客户反馈

## 仓储部门
- 接收退回的商品
- 检查商品外观和包装状态
- 评估商品是否符合退货条件
- 更新库存管理系统

## 质检部门
- 鉴定商品质量问题
- 判断是否属于厂家责任
- 出具质量问题报告
- 提供质量改进建议

## 财务部门
- 处理退款申请
- 记录退款凭证
- 核对退款金额
- 生成财务报表

## IT部门
- 维护退货管理系统
- 确保系统与ERP集成
- 提供数据分析支持
- 解决系统技术问题`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档', '客户服务手册', '退款流程指南', 'ERP系统接口文档'],
            type: 'classify'
          },
          {
            title: '按退货原因分类',
            content: `## 质量问题
- 商品存在功能缺陷
- 商品材质与描述不符
- 商品有明显瑕疵或损坏
- 商品无法正常使用

## 物流原因
- 配送过程中造成损坏
- 收到商品包装破损
- 运输延误导致商品过期
- 错误配送商品

## 商品信息不符
- 实际商品与图片不符
- 尺寸颜色与描述不符
- 功能特性与宣传不符
- 配件不全或错误

## 客户原因
- 7天无理由退货
- 客户订购错误
- 重复购买
- 不再需要该商品

## 特殊情况
- 过敏或不良反应
- 安全隐患问题
- 违反法规或规定
- 商品已被召回`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档', '客户服务手册'],
            type: 'classify',
            isImportant: true
          }
        ]
      }
      
    default:
      return {
        type: 'summary',
        blocks: [
          {
            title: '分析结果',
            content: `暂无分析结果`,
            note: '',
            showNoteInput: false,
            sources: [],
            type: 'summary'
          }
        ]
      }
  }
}

// 保存标注
const saveAnnotation = (blockIndex: number) => {
  const block = aiResponse.value?.blocks[blockIndex]
  if (!block || !block.annotationText) return

  if (!block.annotations) {
    block.annotations = []
  }

  block.annotations.push({
    text: block.annotationText,
    left: block.annotationLeft || 0,
    top: block.annotationTop || 0
  })
}

// 添加新的响应式数据
const messageInput = ref('')
const hasSourceInfo = ref(false)

// 添加新的方法
const sendMessage = async () => {
  if (!messageInput.value.trim()) {
    return
  }

  // 添加用户消息
  const userMessage: Message = {
    id: generateUUID(),
    type: 'user',
    content: messageInput.value,
    timestamp: Date.now()
  }
  chatHistory.value.push(userMessage)
  
  // 清空输入
  messageInput.value = ''
  
  // 开始分析
  analyzing.value = true
  
  try {
    // 根据选中的数据源和用户问题生成回答
    const selectedSources = selectedSourceIndexes.value.map(index => sources.value[index])
    const aiResponse = await generateAIResponse(userMessage.content, selectedSources)
    
    // 添加AI回复
    const aiMessage: Message = {
      id: generateUUID(),
      type: 'ai',
      content: aiResponse.content,
      timestamp: Date.now(),
      sources: aiResponse.sources
    }
    chatHistory.value.push(aiMessage)
    
    // 更新是否有相关信息的标志
    hasSourceInfo.value = aiResponse.hasInfo
  } catch (error) {
    ElMessage.error('生成回答失败')
  } finally {
    analyzing.value = false
  }
}

// 生成AI回答
const generateAIResponse = async (question: string, sources: Source[]) => {
  // 这里模拟AI处理过程
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 检查是否有相关信息
  const hasInfo = sources.some(source => {
    if (source.type === 'manual' || source.type === 'file') {
      return source.content.includes(question)
    }
    return false
  })
  
  // 根据是否有信息返回不同的回答
  if (hasInfo) {
    return {
      content: `根据分析，在选中的数据源中找到了关于"${question}"的相关信息...`,
      hasInfo: true,
      sources: sources.map(s => s.name)
    }
  } else {
    return {
      content: `根据分析，在选中的数据源中没有找到关于"${question}"的相关信息。`,
      hasInfo: false,
      sources: []
    }
  }
}

// 生成MCP链接
const generateMcpLink = (index: number) => {
  if (!aiResponse.value || !aiResponse.value.blocks[index]) return

  const block = aiResponse.value.blocks[index]
  if (!block.mcpLinks || block.mcpLinks.length === 0) return

  const mcpLinks = block.mcpLinks.map(mcpLink => ({
    name: mcpLink.name,
    url: mcpLink.url
  }))

  // 这里可以添加生成MCP链接的逻辑
  console.log('生成MCP链接:', mcpLinks)
}

// 移除MCP链接
const removeMcpLink = (blockIndex: number, mcpIndex: number) => {
  if (!aiResponse.value || !aiResponse.value.blocks[blockIndex]) return

  const block = aiResponse.value.blocks[blockIndex]
  if (!block.mcpLinks || block.mcpLinks.length === 0) return

  block.mcpLinks.splice(mcpIndex, 1)
}

// 预览知识
const previewAsKnowledge = async () => {
  if (!aiResponse.value) {
    ElMessage.warning('没有可用的分析结果')
    return
  }

  // 收集所有内容，包括标注和笔记
  const blocks = aiResponse.value.blocks.filter(block => !block.excluded)
  
  // 构建完整的知识内容
  let knowledgeContent = ''
  
  // 添加标题
  knowledgeContent += `# ${getAnalysisTypeLabel(aiResponse.value.type)}\n\n`
  
  // 添加数据来源
  if (analysisDataSources.value.length > 0) {
    knowledgeContent += `## 数据来源\n`
    analysisDataSources.value.forEach(source => {
      knowledgeContent += `- ${source}\n`
    })
    knowledgeContent += '\n'
  }
  
  // 添加每个内容块
  blocks.forEach((block, index) => {
    // 添加块标题
    if (block.title) {
      knowledgeContent += `## ${block.title}\n\n`
    }
    
    // 添加块内容
    knowledgeContent += `${block.content}\n\n`
    
    // 添加块标注
    if (block.annotations && block.annotations.length > 0) {
      knowledgeContent += `### 标注\n`
      block.annotations.forEach((annotation, annoIndex) => {
        knowledgeContent += `- **标注 ${annoIndex + 1}**: ${annotation.text}\n`
      })
      knowledgeContent += '\n'
    }
    
    // 添加块笔记
    if (block.note) {
      knowledgeContent += `### 笔记\n${block.note}\n\n`
    }
  })
  
  // 填充右侧知识表单
  knowledgeForm.title = getAnalysisTypeLabel(aiResponse.value.type)
  knowledgeForm.content = knowledgeContent
  knowledgeForm.tags = [...analysisTags.value]
  
  // 消息通知
  ElMessage.success('知识内容已预览，请在右侧查看')
}

// 应用模板
const applyTemplate = (template: string) => {
  // 这里可以添加应用模板的逻辑
  console.log('应用模板:', template)
}

// 移除标注
const removeAnnotation = (blockIndex: number, annotationIndex: number) => {
  if (!aiResponse.value || !aiResponse.value.blocks[blockIndex]) return

  const block = aiResponse.value.blocks[blockIndex]
  if (!block.annotations || block.annotations.length === 0) return

  block.annotations.splice(annotationIndex, 1)
}

// 添加新的响应式数据
const analysisPrompt = ref('')

// 格式化带标注的内容
const formatContentWithAnnotations = (content: string, annotations: Array<{ text: string; left: number; top: number }>): string => {
  // 如果没有标注，直接返回内容
  if (!annotations || annotations.length === 0) {
    return content;
  }
  
  // 为简化实现，这里只是在内容中添加高亮标记
  // 实际实现可能需要更复杂的文本位置定位算法
  let formattedContent = content;
  
  // 为每个标注文本添加高亮样式
  annotations.forEach((annotation, index) => {
    // 简单的文本替换，实际应用中可能需要更复杂的算法
    const regex = new RegExp(escapeRegExp(annotation.text), 'g');
    formattedContent = formattedContent.replace(
      regex, 
      `<span class="highlight-annotation" data-annotation-id="${index}">${annotation.text}</span>`
    );
  });
  
  return formattedContent;
};

// 辅助函数：转义正则表达式特殊字符
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// 提交分析优化提示
const submitAnalysisPrompt = async () => {
  if (!analysisPrompt.value.trim() || !aiResponse.value) {
    ElMessage.warning('请输入优化指令');
    return;
  }
  
  analyzing.value = true;
  analysisProgress.value = 0;
  
  try {
    // 模拟进度变化
    const interval = setInterval(() => {
      analysisProgress.value += 10;
      if (analysisProgress.value >= 100) {
        clearInterval(interval);
        
        // 这里应该调用实际的AI处理逻辑
        // 模拟处理结果 - 添加一个新的分析块
        if (aiResponse.value) {
          aiResponse.value.blocks.push({
            title: `优化结果: ${analysisPrompt.value.substring(0, 20)}${analysisPrompt.value.length > 20 ? '...' : ''}`,
            content: `根据您的指令 "${analysisPrompt.value}"，这里是优化后的分析内容...\n\n这是一个示例响应，实际应用中应该调用后端API来处理用户的优化请求。`,
            note: '',
            showNoteInput: false,
            sources: analysisDataSources.value,
            type: 'optimization'
          });
        }
        
        // 清空输入
        analysisPrompt.value = '';
        analyzing.value = false;
        ElMessage.success('分析已优化');
      }
    }, 100);
  } catch (error) {
    console.error('优化分析失败:', error);
    ElMessage.error('优化分析失败');
    analyzing.value = false;
  }
};

// 选择知识提取目标
const selectExtractionTarget = (target: string): void => {
  processingConfig.target = target
  processingConfig.cardType = ''
}

// 获取知识卡片类型
const getCardTypesByTarget = (target: string) => {
  const cardTypeMap: Record<string, any[]> = {
    content_summary: [
      {
        value: 'standard',
        label: '标准卡片',
        description: '将内容提炼为简明摘要，突出重点信息，用于快速理解',
        scenarioDesc: '页面Bot提示、搜索摘要结果、知识聚合卡片'
      },
      {
        value: 'qa',
        label: 'QA卡片',
        description: '从内容中提取常见问题与回答，格式为问答对',
        scenarioDesc: '页面Bot提示、搜索摘要结果、知识聚合卡片'
      },
      {
        value: 'terminology',
        label: '术语卡片',
        description: '提取文中的术语与其定义、英文原文与示例用法',
        scenarioDesc: '页面Bot提示、搜索摘要结果、知识聚合卡片'
      }
    ],
    faq: [
      {
        value: 'flow',
        label: '流程卡片',
        description: '将操作流程整理为步骤清单，并说明适用模块与使用说明',
        scenarioDesc: 'Copilot问答、帮助中心、FAQ列表'
      },
      {
        value: 'qa',
        label: 'QA卡片',
        description: '从内容中提取常见问题与回答，格式为问答对',
        scenarioDesc: 'Copilot问答、帮助中心、FAQ列表'
      },
      {
        value: 'standard',
        label: '标准卡片',
        description: '将内容提炼为简明摘要，突出重点信息，用于快速理解',
        scenarioDesc: 'Copilot问答、帮助中心、FAQ列表'
      }
    ],
    field_extraction: [
      {
        value: 'field',
        label: '字段卡片',
        description: '识别字段及其定义、类型、是否必填，结构化输出为字段说明卡片',
        scenarioDesc: '表单字段提示、接口字段说明、配置字段文档'
      },
      {
        value: 'terminology',
        label: '术语卡片',
        description: '提取文中的术语与其定义、英文原文与示例用法',
        scenarioDesc: '表单字段提示、接口字段说明、配置字段文档'
      },
      {
        value: 'standard',
        label: '标准卡片',
        description: '将内容提炼为简明摘要，突出重点信息，用于快速理解',
        scenarioDesc: '表单字段提示、接口字段说明、配置字段文档'
      }
    ],
    error_code: [
      {
        value: 'flow',
        label: '流程卡片',
        description: '将操作流程整理为步骤清单，并说明适用模块与使用说明',
        scenarioDesc: '系统异常弹窗、日志错误提示、Bot快速响应'
      },
      {
        value: 'qa',
        label: 'QA卡片',
        description: '从内容中提取常见问题与回答，格式为问答对',
        scenarioDesc: '系统异常弹窗、日志错误提示、Bot快速响应'
      },
      {
        value: 'error',
        label: '异常卡片',
        description: '解释异常码的含义、触发原因与处理建议',
        scenarioDesc: '系统异常弹窗、日志错误提示、Bot快速响应'
      }
    ],
    terminology: [
      {
        value: 'standard',
        label: '标准卡片',
        description: '将内容提炼为简明摘要，突出重点信息，用于快速理解',
        scenarioDesc: '术语表、统一业务词汇规范、Bot关键词理解'
      },
      {
        value: 'qa',
        label: 'QA卡片',
        description: '从内容中提取常见问题与回答，格式为问答对',
        scenarioDesc: '术语表、统一业务词汇规范、Bot关键词理解'
      },
      {
        value: 'terminology',
        label: '术语卡片',
        description: '提取文中的术语与其定义、英文原文与示例用法',
        scenarioDesc: '术语表、统一业务词汇规范、Bot关键词理解'
      }
    ],
    operation_process: [
      {
        value: 'flow',
        label: '流程卡片',
        description: '将操作流程整理为步骤清单，并说明适用模块与使用说明',
        scenarioDesc: '操作指导、系统配置指引、培训文档'
      },
      {
        value: 'qa',
        label: 'QA卡片',
        description: '从内容中提取常见问题与回答，格式为问答对',
        scenarioDesc: '操作指导、系统配置指引、培训文档'
      },
      {
        value: 'standard',
        label: '标准卡片',
        description: '将内容提炼为简明摘要，突出重点信息，用于快速理解',
        scenarioDesc: '操作指导、系统配置指引、培训文档'
      }
    ],
    content_comparison: [
      {
        value: 'standard',
        label: '标准卡片',
        description: '将内容提炼为简明摘要，突出重点信息，用于快速理解',
        scenarioDesc: '合规文档审查、接口对比、内容优化建议'
      },
      {
        value: 'comparison',
        label: '对比卡片',
        description: '对比两段内容，提取差异说明，并给出建议合并内容',
        scenarioDesc: '合规文档审查、接口对比、内容优化建议'
      }
    ],
    doc_merge: [
      {
        value: 'comprehensive',
        label: '综合卡片',
        description: '将多份文档内容进行去重合并，输出统一内容，并注明合并标签与来源',
        scenarioDesc: '多个版本文档合并、冗余内容统一处理'
      },
      {
        value: 'standard',
        label: '标准卡片',
        description: '将内容提炼为简明摘要，突出重点信息，用于快速理解',
        scenarioDesc: '多个版本文档合并、冗余内容统一处理'
      }
    ],
    module_classification: [
      {
        value: 'module',
        label: '模块卡片',
        description: '判断内容应归属的系统、模块、页面字段，并生成推荐标签',
        scenarioDesc: '知识打标签、字段定位、系统内联动推荐'
      },
      {
        value: 'terminology',
        label: '术语卡片',
        description: '提取文中的术语与其定义、英文原文与示例用法',
        scenarioDesc: '知识打标签、字段定位、系统内联动推荐'
      }
    ],
    bilingual: [
      {
        value: 'bilingual',
        label: '双语卡片',
        description: '将内容分别生成中英文两版，并保证语义一致',
        scenarioDesc: '中英双语团队、多语言知识输出、海外项目对接'
      }
    ]
  }

  return (cardTypeMap[target] || [])
}

// 选择知识卡片类型
const selectCardType = (type: string): void => {
  processingConfig.cardType = type
}

// 开始处理时的逻辑
const startProcessing = async (): Promise<void> => {
  if (!processingConfig.target || !processingConfig.cardType) {
    ElMessage.warning('请选择知识提取目标和卡片类型')
    return
  }

  // 获取当前选择的卡片类型配置
  const cardTypes = getCardTypesByTarget(processingConfig.target)
  const selectedCardType = cardTypes.find(type => type.value === processingConfig.cardType)
  
  if (!selectedCardType) {
    ElMessage.warning('卡片类型配置有误')
    return
  }

  // 根据卡片类型的结构字段构建prompt
  const prompt = buildPromptByCardType(selectedCardType)
  
  // 开始AI处理
  try {
    analyzing.value = true
    // TODO: 调用AI处理接口
    // const response = await processWithAI(prompt, sourceContent)
    // handleAIResponse(response)
  } catch (error) {
    console.error('AI处理失败:', error)
    ElMessage.error('处理失败，请重试')
  } finally {
    analyzing.value = false
  }
}

// 根据卡片类型构建prompt
const buildPromptByCardType = (cardType: any): string => {
  // TODO: 根据不同卡片类型构建对应的prompt
  return `请根据以下内容，生成${cardType.label}格式的知识卡片：\n${cardType.description}`
}

// 根据模式获取模板内容
const getTemplateContent = (mode: string) => {
  // 如果设置了target和cardType，则根据这两个参数返回对应模板
  if (processingConfig.target && processingConfig.cardType) {
    const key = `${processingConfig.target}_${processingConfig.cardType}`;
    
    // 定义所有模板映射
    const templates: Record<string, any> = {
      // 内容摘要相关模板
      'content_summary_standard': {
        type: 'summary',
        blocks: [{
          title: 'OMS预约流程概览',
          content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。`,
          note: '',
          showNoteInput: false,
          sources: ['《OMS预约管理操作手册v2.0》'],
          type: 'summary',
          isImportant: true
        }]
      },
      'content_summary_qa': {
        type: 'qa',
        blocks: [{
          title: '如何修改预约的预计到货时间？',
          content: `Q: OMS系统中如何修改已创建预约单的预计到货时间？
A: 您可进入预约详情页，点击页面右上角"编辑"按钮，找到"预计到货时间"字段，选择新的时间后点击保存即可。请注意，仅在预约状态为"未审核"或"退回"时可进行修改。

标签: 预约, 预计到货时间, 编辑预约
模块: OMS > Appointment
角色: 运营人员, 预约审核员`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'qa'
        }]
      },
      'content_summary_terminology': {
        type: 'key_points',
        blocks: [{
          title: 'Fulfillment SLA',
          content: `• 术语（英文）: Fulfillment SLA
• 术语（中文）: 履约服务等级协议
• 定义说明: SLA 是 Service Level Agreement 的简称，在OMS系统中指从订单创建至最终发货的最大可接受时长。
• 使用示例: 客户A设定的SLA为48小时，意味着从OMS生成销售订单起，需在48小时内完成拣货、打包并出库发运。
• 模块: OMS > Order`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '术语管理手册'],
          type: 'key_points',
          isImportant: true
        }]
      },
      
      // 常见问答相关模板
      'faq_flow': {
        type: 'key_points',
        blocks: [{
          title: '预约单创建流程',
          content: `流程名称: 预约单创建流程

步骤列表:
1. 进入预约管理页面，点击"新建预约"
2. 填写基本信息（预约类型、客户、仓库、车牌号等）
3. 选择预约时段并绑定任务（可选）
4. 提交审核或直接保存草稿

触发入口: /oms/appointment/create
适用模块: OMS > Appointment
角色: 运营人员, 审核人员`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'key_points',
          isImportant: true
        }]
      },
      'faq_qa': {
        type: 'qa',
        blocks: [{
          title: '如何修改预约的预计到货时间？',
          content: `Q: OMS系统中如何修改已创建预约单的预计到货时间？
A: 您可进入预约详情页，点击页面右上角"编辑"按钮，找到"预计到货时间"字段，选择新的时间后点击保存即可。请注意，仅在预约状态为"未审核"或"退回"时可进行修改。

标签: 预约, 预计到货时间, 编辑预约
模块: OMS > Appointment
角色: 运营人员, 预约审核员`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'qa'
        }]
      },
      'faq_standard': {
        type: 'summary',
        blocks: [{
          title: 'OMS预约流程概览',
          content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。`,
          note: '',
          showNoteInput: false,
          sources: ['《OMS预约管理操作手册v2.0》'],
          type: 'summary',
          isImportant: true
        }]
      },
      
      // 字段说明提取相关模板
      'field_extraction_field': {
        type: 'key_points',
        blocks: [{
          title: 'appointment_type',
          content: `• 字段名: appointment_type
• 字段说明: 标识该预约单的业务方向，分为入库(INBOUND)、出库(OUTBOUND)、同时双向(BOTH)。
• 控件类型: Dropdown
• 字段类型: String
• 依赖字段: customer_type, direction
• 页面路径: /oms/appointment/create`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '字段说明文档'],
          type: 'key_points',
          isImportant: true
        }]
      },
      'field_extraction_terminology': {
        type: 'key_points',
        blocks: [{
          title: 'Fulfillment SLA',
          content: `• 术语（英文）: Fulfillment SLA
• 术语（中文）: 履约服务等级协议
• 定义说明: SLA 是 Service Level Agreement 的简称，在OMS系统中指从订单创建至最终发货的最大可接受时长。
• 使用示例: 客户A设定的SLA为48小时，意味着从OMS生成销售订单起，需在48小时内完成拣货、打包并出库发运。
• 模块: OMS > Order`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '术语管理手册'],
          type: 'key_points',
          isImportant: true
        }]
      },
      'field_extraction_standard': {
        type: 'summary',
        blocks: [{
          title: 'OMS预约流程概览',
          content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。`,
          note: '',
          showNoteInput: false,
          sources: ['《OMS预约管理操作手册v2.0》'],
          type: 'summary',
          isImportant: true
        }]
      },
      
      // 异常码解释相关模板
      'error_code_flow': {
        type: 'key_points',
        blocks: [{
          title: '预约单创建流程',
          content: `流程名称: 预约单创建流程

步骤列表:
1. 进入预约管理页面，点击"新建预约"
2. 填写基本信息（预约类型、客户、仓库、车牌号等）
3. 选择预约时段并绑定任务（可选）
4. 提交审核或直接保存草稿

触发入口: /oms/appointment/create
适用模块: OMS > Appointment
角色: 运营人员, 审核人员`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'key_points',
          isImportant: true
        }]
      },
      'error_code_qa': {
        type: 'qa',
        blocks: [{
          title: '如何修改预约的预计到货时间？',
          content: `Q: OMS系统中如何修改已创建预约单的预计到货时间？
A: 您可进入预约详情页，点击页面右上角"编辑"按钮，找到"预计到货时间"字段，选择新的时间后点击保存即可。请注意，仅在预约状态为"未审核"或"退回"时可进行修改。

标签: 预约, 预计到货时间, 编辑预约
模块: OMS > Appointment
角色: 运营人员, 预约审核员`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'qa'
        }]
      },
      'error_code_error': {
        type: 'key_points',
        blocks: [{
          title: 'E2097',
          content: `• 异常码: E2097
• 异常说明: 预约单提交失败，系统检测到未配置客户默认仓库。
• 触发接口: /api/oms/appointment/submit
• 触发条件: appointment.warehouse_id == null 或 warehouse.status == 'inactive'
• 建议操作: 请在客户资料中配置默认仓库，或确认目标仓库处于启用状态。
• 适用模块: OMS > Appointment`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '异常码手册'],
          type: 'key_points',
          isImportant: true
        }]
      },
      
      // 术语定义相关模板
      'terminology_standard': {
        type: 'summary',
        blocks: [{
          title: 'OMS预约流程概览',
          content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。`,
          note: '',
          showNoteInput: false,
          sources: ['《OMS预约管理操作手册v2.0》'],
          type: 'summary',
          isImportant: true
        }]
      },
      'terminology_qa': {
        type: 'qa',
        blocks: [{
          title: '如何修改预约的预计到货时间？',
          content: `Q: OMS系统中如何修改已创建预约单的预计到货时间？
A: 您可进入预约详情页，点击页面右上角"编辑"按钮，找到"预计到货时间"字段，选择新的时间后点击保存即可。请注意，仅在预约状态为"未审核"或"退回"时可进行修改。

标签: 预约, 预计到货时间, 编辑预约
模块: OMS > Appointment
角色: 运营人员, 预约审核员`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'qa'
        }]
      },
      'terminology_terminology': {
        type: 'key_points',
        blocks: [{
          title: 'Fulfillment SLA',
          content: `• 术语（英文）: Fulfillment SLA
• 术语（中文）: 履约服务等级协议
• 定义说明: SLA 是 Service Level Agreement 的简称，在OMS系统中指从订单创建至最终发货的最大可接受时长。
• 使用示例: 客户A设定的SLA为48小时，意味着从OMS生成销售订单起，需在48小时内完成拣货、打包并出库发运。
• 模块: OMS > Order`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '术语管理手册'],
          type: 'key_points',
          isImportant: true
        }]
      },
      
      // 操作流程提取相关模板
      'operation_process_flow': {
        type: 'key_points',
        blocks: [{
          title: '预约单创建流程',
          content: `流程名称: 预约单创建流程

步骤列表:
1. 进入预约管理页面，点击"新建预约"
2. 填写基本信息（预约类型、客户、仓库、车牌号等）
3. 选择预约时段并绑定任务（可选）
4. 提交审核或直接保存草稿

触发入口: /oms/appointment/create
适用模块: OMS > Appointment
角色: 运营人员, 审核人员`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'key_points',
          isImportant: true
        }]
      },
      'operation_process_qa': {
        type: 'qa',
        blocks: [{
          title: '如何修改预约的预计到货时间？',
          content: `Q: OMS系统中如何修改已创建预约单的预计到货时间？
A: 您可进入预约详情页，点击页面右上角"编辑"按钮，找到"预计到货时间"字段，选择新的时间后点击保存即可。请注意，仅在预约状态为"未审核"或"退回"时可进行修改。

标签: 预约, 预计到货时间, 编辑预约
模块: OMS > Appointment
角色: 运营人员, 预约审核员`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'qa'
        }]
      },
      'operation_process_standard': {
        type: 'summary',
        blocks: [{
          title: 'OMS预约流程概览',
          content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。`,
          note: '',
          showNoteInput: false,
          sources: ['《OMS预约管理操作手册v2.0》'],
          type: 'summary',
          isImportant: true
        }]
      },
      
      // 内容对比分析相关模板
      'content_comparison_standard': {
        type: 'summary',
        blocks: [{
          title: 'OMS预约流程概览',
          content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。`,
          note: '',
          showNoteInput: false,
          sources: ['《OMS预约管理操作手册v2.0》'],
          type: 'summary',
          isImportant: true
        }]
      },
      'content_comparison_comparison': {
        type: 'compare',
        blocks: [{
          title: '内容对比分析',
          content: `| 比较项 | OMS V1 | OMS V2 |
|--------|---------|---------|
| 派单方式 | 人工派单 | 系统自动派单 |
| 数据导出 | Excel导出 | 接口推送 |
| 操作复杂度 | 高 | 低 |
| 自动化程度 | 低 | 高 |

版本A内容: OMS V1人工派单+Excel导出
版本B内容: OMS V2系统自动派单+接口推送
差异说明: V2简化了人工操作，提升自动化程度
推荐合并内容: 建议统一采用OMS V2模式`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '版本对比文档'],
          type: 'compare',
          isImportant: true
        }]
      },
      
      // 多文档合并相关模板
      'doc_merge_comprehensive': {
        type: 'summary',
        blocks: [{
          title: '多文档合并示例',
          content: `统一内容: 本文整合了OMS履约、派车、发货模块的通用配置流程。

来源列表: 
- OMS履约配置.docx
- 派车规则说明.pdf

合并标签:
- 派车
- 履约
- 流程`,
          note: '',
          showNoteInput: false,
          sources: ['OMS履约配置.docx', '派车规则说明.pdf'],
          type: 'summary',
          isImportant: true
        }]
      },
      'doc_merge_standard': {
        type: 'summary',
        blocks: [{
          title: 'OMS预约流程概览',
          content: `预约流程是OMS系统中为进出货操作配置时段、仓库、车辆信息的标准化流程，一般包括预约类型选择、时间窗口设定、仓库/司机信息填写、任务预分配、审核等步骤。`,
          note: '',
          showNoteInput: false,
          sources: ['《OMS预约管理操作手册v2.0》'],
          type: 'summary',
          isImportant: true
        }]
      },
      
      // 模块归类推荐相关模板
      'module_classification_module': {
        type: 'summary',
        blocks: [{
          title: '模块归类推荐',
          content: `系统: OMS
模块: Order
页面路径: /oms/order/view
推荐用途: 字段提示, 异常解释

System: OMS
Module: Order
Page Path: /oms/order/view
Recommended Usage: Field Tips, Error Explanation`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档'],
          type: 'summary',
          isImportant: true
        }]
      },
      'module_classification_terminology': {
        type: 'key_points',
        blocks: [{
          title: 'Fulfillment SLA',
          content: `• 术语（英文）: Fulfillment SLA
• 术语（中文）: 履约服务等级协议
• 定义说明: SLA 是 Service Level Agreement 的简称，在OMS系统中指从订单创建至最终发货的最大可接受时长。
• 使用示例: 客户A设定的SLA为48小时，意味着从OMS生成销售订单起，需在48小时内完成拣货、打包并出库发运。
• 模块: OMS > Order`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '术语管理手册'],
          type: 'key_points',
          isImportant: true
        }]
      },
      
      // 中英文同步生成相关模板
      'bilingual_bilingual_all': {
        type: 'summary',
        blocks: [{
          title: '双语卡片示例 (多类型)',
          content: `【中文内容】
该订单已完成发货

【English Content】
The order has been shipped.

语种标签: zh-CN/en-US`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '多语言模板'],
          type: 'summary',
          isImportant: true
        }]
      },
      'bilingual_bilingual': {
        type: 'summary',
        blocks: [{
          title: '双语卡片示例',
          content: `【中文内容】
点击"新建预约"按钮进入预约单创建流程。

【English Content】
Click 'Create Appointment' to start the appointment process.

适用模块/Module: OMS > Appointment`,
          note: '',
          showNoteInput: false,
          sources: ['OMS系统文档', '预约管理手册'],
          type: 'summary',
          isImportant: true
        }]
      }
    };
    
    // 返回匹配的模板，如果没有找到则返回null
    return templates[key] || null;
  }
  
  // 如果没有匹配到target和cardType组合，或者它们未设置，按原来的mode返回内容
  switch (mode) {
    case 'summary':
      return {
        type: 'summary',
        blocks: [
          {
            title: '退货工作流摘要',
            content: `退货工作流是指顾客将已购买的商品退回给商家，并获得退款或更换的过程。完整的退货流程包括：
1. 顾客提出退货申请（7天无理由退货或质量问题退货）
2. 客服审核退货申请（确认是否符合退货条件）
3. 系统生成退货单号（用于物流追踪）
4. 顾客寄回商品（可自选物流或使用商家指定物流）
5. 仓库接收并检查商品（确认商品状态与退货原因）
6. 质检部门评估商品（判断是否属于质量问题）
7. 财务部门处理退款（原路退回或退至余额）
8. 系统更新库存与订单状态（关闭订单并恢复库存）

整个流程一般在顾客提交申请后的15个工作日内完成，特殊情况下可能需要额外处理时间。`,
            note: '',
            showNoteInput: false,
            sources: ['退货政策文档', '客户服务手册', '退款流程指南', 'ERP系统接口文档'],
            type: 'summary',
            isImportant: true
          }
        ]
      }
      
    // 保留其他原有模式的处理逻辑...
    
    default:
      break;
  }
}
</script> 