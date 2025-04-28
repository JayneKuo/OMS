<template>
  <div class="enhanced-knowledge-editor">
    <!-- 添加返回按钮 -->
    <div class="back-button-container">
      <router-link to="/knowledge-base/knowledge-center">
        <el-button type="primary" size="small">
          <el-icon><Back /></el-icon>
          返回知识库列表
        </el-button>
      </router-link>
    </div>
    
    <!-- 三列布局 -->
    <div class="editor-layout">
      <!-- 左侧面板：数据源/处理方式/模板 -->
      <div class="editor-left-panel">
        <!-- 数据源区块 -->
        <div class="panel-section">
          <div class="panel-header">
            <h3>知识列表</h3>
            <el-button type="primary" link @click="addNewSource">
              <el-icon><Plus /></el-icon>添加知识
            </el-button>
          </div>
          
          <div class="source-list">
            <el-checkbox-group v-model="selectedSourceIndexes">
              <div 
                v-for="(source, index) in sources" 
                :key="source.id" 
                class="source-item"
                :class="{ active: currentSourceIndex === index }"
                @click="selectSource(index)"
              >
                <el-checkbox :label="index">
                  <div class="source-info">
                    <el-icon><component :is="getSourceIcon(source.type)" /></el-icon>
                    <span class="source-name">{{ source.name }}</span>
                    <span class="source-type">{{ getSourceTypeLabel(source.type) }}</span>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          
          <!-- 空状态 -->
          <el-empty v-if="!sources.length" description="暂无知识，请点击添加" />
          
          <!-- 添加数据源对话框 -->
          <el-dialog
            v-model="addSourceDialogVisible"
            title="添加知识"
            width="500px"
          >
            <el-tabs v-model="activeSourceType">
              <!-- 手动输入 -->
              <el-tab-pane label="手动输入" name="manual">
                <el-form :model="manualSourceForm">
                  <el-form-item label="名称">
                    <el-input v-model="manualSourceForm.name" placeholder="输入知识名称" />
                  </el-form-item>
                  <el-form-item label="内容">
                    <el-input
                      v-model="manualSourceForm.content"
                      type="textarea"
                      :rows="8"
                      placeholder="输入内容"
                    />
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              
              <!-- 文件上传 -->
              <el-tab-pane label="文件上传" name="file">
                <el-upload
                  class="file-uploader"
                  drag
                  action="#"
                  :auto-upload="false"
                  :on-change="handleFileChange"
                >
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持 .txt, .pdf, .doc, .docx 格式文件
                    </div>
                  </template>
                </el-upload>
              </el-tab-pane>
              
              <!-- 网址 -->
              <el-tab-pane label="网址" name="url">
                <el-form :model="urlSourceForm">
                  <el-form-item label="名称">
                    <el-input v-model="urlSourceForm.name" placeholder="输入知识名称" />
                  </el-form-item>
                  <el-form-item label="URL">
                    <el-input v-model="urlSourceForm.url" placeholder="输入网址" />
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              
              <!-- API -->
              <el-tab-pane label="API" name="api">
                <el-form :model="apiSourceForm">
                  <el-form-item label="名称">
                    <el-input v-model="apiSourceForm.name" placeholder="输入知识名称" />
                  </el-form-item>
                  <el-form-item label="API端点">
                    <el-input v-model="apiSourceForm.endpoint" placeholder="输入API端点" />
                  </el-form-item>
                  <el-form-item label="请求方法">
                    <el-select v-model="apiSourceForm.method">
                      <el-option label="GET" value="get" />
                      <el-option label="POST" value="post" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
            
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="addSourceDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmAddSource">添加</el-button>
              </div>
            </template>
          </el-dialog>
        </div>
        
        <!-- 处理方式区块 -->
        <div class="panel-section">
          <div class="panel-header">
            <h3>知识梳理</h3>
          </div>
          
          <el-form :model="processingConfig" label-position="top">
            <el-form-item label="知识提取目标">
              <el-radio-group v-model="processingConfig.mode" class="processing-mode-group">
                <el-radio-button label="summary">
                  <el-tooltip content="生成知识摘要">
                    <div class="mode-button-content">
                      <el-icon><Document /></el-icon>
                      <span>摘要</span>
                    </div>
                  </el-tooltip>
                </el-radio-button>
                <el-radio-button label="qa">
                  <el-tooltip content="生成知识问答">
                    <div class="mode-button-content">
                      <el-icon><ChatDotRound /></el-icon>
                      <span>问答</span>
                    </div>
                  </el-tooltip>
                </el-radio-button>
                <el-radio-button label="key_points">
                  <el-tooltip content="提取知识要点">
                    <div class="mode-button-content">
                      <el-icon><Pointer /></el-icon>
                      <span>要点</span>
                    </div>
                  </el-tooltip>
                </el-radio-button>
                <el-radio-button label="workflow">
                  <el-tooltip content="生成知识流程">
                    <div class="mode-button-content">
                      <el-icon><Connection /></el-icon>
                      <span>流程</span>
                    </div>
                  </el-tooltip>
                </el-radio-button>
                <el-radio-button label="compare">
                  <el-tooltip content="知识对比">
                    <div class="mode-button-content">
                      <el-icon><Operation /></el-icon>
                      <span>对比</span>
                    </div>
                  </el-tooltip>
                </el-radio-button>
                <el-radio-button label="merge">
                  <el-tooltip content="知识合并">
                    <div class="mode-button-content">
                      <el-icon><FolderAdd /></el-icon>
                      <span>合并</span>
                    </div>
                  </el-tooltip>
                </el-radio-button>
                <el-radio-button label="classify">
                  <el-tooltip content="知识分类">
                    <div class="mode-button-content">
                      <el-icon><Files /></el-icon>
                      <span>分类</span>
                    </div>
                  </el-tooltip>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            
            <!-- 模板选择 -->
            <el-form-item label="选择模板">
              <el-select 
                v-model="processingConfig.templateId" 
                placeholder="选择业务场景模板" 
                class="template-selector"
                @change="handleTemplateChange"
              >
                <el-option-group label="业务场景模板">
                  <!-- 仓储物流场景 -->
                  <el-option label="仓储管理" value="warehouse_management" />
                  <el-option label="物流配送" value="logistics_delivery" />
                  <el-option label="库存管理" value="inventory_management" />
                  <el-option label="商品管理" value="product_management" />
                  
                  <!-- 电商履约场景 -->
                  <el-option label="订单管理" value="order_management" />
                  <el-option label="售后服务" value="after_sales" />
                  <el-option label="客户体验" value="customer_experience" />
                  <el-option label="退货管理" value="return_management" />
                  
                  <!-- 客户管理场景 -->
                  <el-option label="客户资料" value="customer_profile" />
                  <el-option label="会员管理" value="membership_management" />
                  <el-option label="客户关系" value="customer_relationship" />
                  <el-option label="客户服务" value="customer_service" />
                  
                  <!-- 财务管理场景 -->
                  <el-option label="财务报表" value="financial_report" />
                  <el-option label="成本分析" value="cost_analysis" />
                  <el-option label="收入记录" value="income_record" />
                  <el-option label="费用管理" value="expense_management" />
                </el-option-group>
                
                <!-- 用户自定义模板 -->
                <el-option-group label="我的模板" v-if="userTemplates.length > 0">
                  <el-option 
                    v-for="template in userTemplates" 
                    :key="template.id" 
                    :label="template.name"
                    :value="template.id"
                  />
                </el-option-group>
              </el-select>
              
              <div class="template-actions">
                <el-tooltip content="无需模板，直接处理">
                  <el-button 
                    type="info" 
                    link 
                    @click="processingConfig.templateId = 'none'; isTemplateDisabled = true"
                    :class="{ 'disabled-link': isTemplateDisabled }"
                  >
                    跳过模板
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
            
            <!-- 处理配置区域 -->
            <div class="panel-section processing-config">
              <div class="panel-header">
                <h3>处理配置</h3>
              </div>
              
              <div class="dynamic-config-area">
                <!-- 摘要模式的配置 -->
                <template v-if="processingConfig.mode === 'summary'">
                  <el-form :model="processingConfig" label-position="top">
                    <el-form-item label="摘要长度">
                      <el-slider 
                        v-model="processingConfig.summaryLength" 
                        :min="50" 
                        :max="300" 
                        :step="10"
                        :marks="{50:'50', 100:'100', 150:'150', 200:'200', 250:'250', 300:'300'}"
                      />
                    </el-form-item>
                    
                    <el-form-item label="关键信息提取">
                      <el-checkbox-group v-model="processingConfig.summaryExtractFields">
                        <!-- 订单管理相关字段 -->
                        <template v-if="isOrderTemplate">
                          <el-checkbox label="order_number">订单号</el-checkbox>
                          <el-checkbox label="dates">日期时间</el-checkbox>
                          <el-checkbox label="customer">客户信息</el-checkbox>
                          <el-checkbox label="amounts">金额</el-checkbox>
                          <el-checkbox label="products">商品信息</el-checkbox>
                          <el-checkbox label="status">订单状态</el-checkbox>
                        </template>
                        
                        <!-- 仓储物流相关字段 -->
                        <template v-else-if="isWarehouseTemplate">
                          <el-checkbox label="inventory">库存数量</el-checkbox>
                          <el-checkbox label="locations">仓位信息</el-checkbox>
                          <el-checkbox label="dates">操作日期</el-checkbox>
                          <el-checkbox label="status">物流状态</el-checkbox>
                          <el-checkbox label="tracking">跟踪信息</el-checkbox>
                        </template>
                        
                        <!-- 财务相关字段 -->
                        <template v-else-if="isFinanceTemplate">
                          <el-checkbox label="amounts">金额</el-checkbox>
                          <el-checkbox label="dates">日期</el-checkbox>
                          <el-checkbox label="accounts">账户信息</el-checkbox>
                          <el-checkbox label="categories">费用类别</el-checkbox>
                          <el-checkbox label="tax">税务信息</el-checkbox>
                        </template>
                        
                        <!-- 客户相关字段 -->
                        <template v-else-if="isCustomerTemplate">
                          <el-checkbox label="names">姓名</el-checkbox>
                          <el-checkbox label="contacts">联系方式</el-checkbox>
                          <el-checkbox label="locations">地址</el-checkbox>
                          <el-checkbox label="preferences">偏好</el-checkbox>
                          <el-checkbox label="history">历史记录</el-checkbox>
                        </template>
                        
                        <!-- 默认字段 -->
                        <template v-else>
                        <el-checkbox label="dates">日期时间</el-checkbox>
                        <el-checkbox label="names">名称</el-checkbox>
                        <el-checkbox label="amounts">金额</el-checkbox>
                        <el-checkbox label="locations">地点</el-checkbox>
                        <el-checkbox label="status">状态</el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-form>
                </template>
                
                <!-- 问答模式的配置 -->
                <template v-else-if="processingConfig.mode === 'qa'">
                  <el-form :model="processingConfig" label-position="top">
                    <el-form-item label="问题生成数量">
                      <el-slider 
                        v-model="processingConfig.qaCount" 
                        :min="1" 
                        :max="10" 
                        :step="1"
                        :marks="{1:'1', 5:'5', 10:'10'}"
                      />
                    </el-form-item>
                    
                    <el-form-item label="问答风格">
                      <el-radio-group v-model="processingConfig.qaStyle">
                        <el-radio label="business">商务风格</el-radio>
                        <el-radio label="casual">日常风格</el-radio>
                        <el-radio label="technical">技术风格</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="关键信息提取">
                      <el-checkbox-group v-model="processingConfig.qaExtractFields">
                        <!-- 客服相关字段 -->
                        <template v-if="isCustomerServiceTemplate">
                          <el-checkbox label="policies">政策条款</el-checkbox>
                          <el-checkbox label="processes">处理流程</el-checkbox>
                          <el-checkbox label="solutions">解决方案</el-checkbox>
                          <el-checkbox label="contacts">联系方式</el-checkbox>
                        </template>
                        
                        <!-- 订单相关字段 -->
                        <template v-else-if="isOrderTemplate">
                          <el-checkbox label="statuses">状态查询</el-checkbox>
                          <el-checkbox label="modifications">修改规则</el-checkbox>
                          <el-checkbox label="cancellations">取消条件</el-checkbox>
                          <el-checkbox label="returns">退货政策</el-checkbox>
                        </template>
                        
                        <!-- 默认字段 -->
                        <template v-else>
                          <el-checkbox label="definitions">定义解释</el-checkbox>
                          <el-checkbox label="procedures">操作流程</el-checkbox>
                          <el-checkbox label="examples">示例</el-checkbox>
                          <el-checkbox label="references">参考资料</el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </el-form-item>
                    
                    <el-form-item label="包含引用">
                      <el-switch v-model="processingConfig.qaIncludeReferences" />
                    </el-form-item>
                  </el-form>
                </template>
                
                <!-- 关键点模式的配置 -->
                <template v-else-if="processingConfig.mode === 'key_points'">
                  <el-form :model="processingConfig" label-position="top">
                    <el-form-item label="关键点数量">
                      <el-slider 
                        v-model="processingConfig.keyPointsCount" 
                        :min="3" 
                        :max="15" 
                        :step="1"
                        :marks="{3:'3', 9:'9', 15:'15'}"
                      />
                    </el-form-item>
                    
                    <el-form-item label="关键信息提取">
                      <el-checkbox-group v-model="processingConfig.keyPointsExtractFields">
                        <!-- 订单管理相关字段 -->
                        <template v-if="isOrderTemplate">
                          <el-checkbox label="costs">成本信息</el-checkbox>
                          <el-checkbox label="product_details">产品详情</el-checkbox>
                          <el-checkbox label="shipping_info">配送信息</el-checkbox>
                          <el-checkbox label="payment_terms">付款条件</el-checkbox>
                          <el-checkbox label="delivery_schedule">交付计划</el-checkbox>
                        </template>
                        
                        <!-- 仓储物流相关字段 -->
                        <template v-else-if="isWarehouseTemplate">
                          <el-checkbox label="stock_levels">库存水平</el-checkbox>
                          <el-checkbox label="expiration_dates">到期日期</el-checkbox>
                          <el-checkbox label="storage_conditions">存储条件</el-checkbox>
                          <el-checkbox label="handling_instructions">处理说明</el-checkbox>
                          <el-checkbox label="shelf_locations">货架位置</el-checkbox>
                        </template>
                        
                        <!-- 财务相关字段 -->
                        <template v-else-if="isFinanceTemplate">
                          <el-checkbox label="revenue_sources">收入来源</el-checkbox>
                          <el-checkbox label="expense_categories">支出类别</el-checkbox>
                          <el-checkbox label="profit_margins">利润率</el-checkbox>
                          <el-checkbox label="budget_variances">预算差异</el-checkbox>
                          <el-checkbox label="tax_implications">税务影响</el-checkbox>
                        </template>
                        
                        <!-- 默认字段 -->
                        <template v-else>
                          <el-checkbox label="main_ideas">主要观点</el-checkbox>
                          <el-checkbox label="action_items">行动项目</el-checkbox>
                          <el-checkbox label="requirements">需求</el-checkbox>
                          <el-checkbox label="concerns">关注点</el-checkbox>
                          <el-checkbox label="decisions">决策</el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </el-form-item>
                    
                    <el-form-item label="检测重复">
                      <el-switch v-model="processingConfig.keyPointsDetectDuplicates" />
                    </el-form-item>
                  </el-form>
                </template>
                
                <!-- 流程图模式的配置 -->
                <template v-else-if="processingConfig.mode === 'workflow'">
                  <el-form :model="processingConfig" label-position="top">
                    <el-form-item label="流程图类型">
                      <el-radio-group v-model="processingConfig.workflowType">
                        <el-radio label="business">业务流程</el-radio>
                        <el-radio label="decision">决策流程</el-radio>
                        <el-radio label="process">处理流程</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="关键信息提取">
                      <el-checkbox-group v-model="processingConfig.workflowExtractFields">
                        <!-- 订单相关流程字段 -->
                        <template v-if="isOrderTemplate">
                          <el-checkbox label="order_placement">订单创建</el-checkbox>
                          <el-checkbox label="payment_processing">支付处理</el-checkbox>
                          <el-checkbox label="fulfillment">订单履行</el-checkbox>
                          <el-checkbox label="shipping">配送</el-checkbox>
                          <el-checkbox label="delivery">交付</el-checkbox>
                          <el-checkbox label="post_delivery">售后</el-checkbox>
                        </template>
                        
                        <!-- 仓储相关流程字段 -->
                        <template v-else-if="isWarehouseTemplate">
                          <el-checkbox label="receiving">收货</el-checkbox>
                          <el-checkbox label="quality_check">质检</el-checkbox>
                          <el-checkbox label="putaway">入库</el-checkbox>
                          <el-checkbox label="picking">拣货</el-checkbox>
                          <el-checkbox label="packing">包装</el-checkbox>
                          <el-checkbox label="shipping">发货</el-checkbox>
                        </template>
                        
                        <!-- 客户服务相关流程字段 -->
                        <template v-else-if="isCustomerServiceTemplate">
                          <el-checkbox label="inquiry">咨询</el-checkbox>
                          <el-checkbox label="identification">问题识别</el-checkbox>
                          <el-checkbox label="resolution">问题解决</el-checkbox>
                          <el-checkbox label="escalation">升级处理</el-checkbox>
                          <el-checkbox label="follow_up">后续跟进</el-checkbox>
                          <el-checkbox label="feedback">反馈收集</el-checkbox>
                        </template>
                        
                        <!-- 默认流程字段 -->
                        <template v-else>
                          <el-checkbox label="start">开始节点</el-checkbox>
                          <el-checkbox label="process">处理节点</el-checkbox>
                          <el-checkbox label="decision">决策节点</el-checkbox>
                          <el-checkbox label="sub_process">子流程</el-checkbox>
                          <el-checkbox label="end">结束节点</el-checkbox>
                        </template>
                      </el-checkbox-group>
                    </el-form-item>
                    
                    <el-form-item label="节点提取方式">
                      <el-select v-model="processingConfig.nodeExtractionMethod" placeholder="选择节点提取方式">
                        <el-option label="自动提取" value="auto" />
                        <el-option label="关键词提取" value="keyword" />
                        <el-option label="句子级提取" value="sentence" />
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="自动连接节点">
                      <el-switch v-model="processingConfig.autoConnectNodes" />
                    </el-form-item>
                  </el-form>
                </template>
                
                <!-- 对比模式的配置 -->
                <template v-else-if="processingConfig.mode === 'compare'">
                  <el-form :model="processingConfig" label-position="top">
                    <el-form-item label="对比项">
                      <el-checkbox-group v-model="processingConfig.compareOptions">
                        <el-checkbox label="content">内容对比</el-checkbox>
                        <el-checkbox label="structure">结构对比</el-checkbox>
                        <el-checkbox label="style">风格对比</el-checkbox>
                        <el-checkbox label="keywords">关键词对比</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    
                    <el-form-item label="显示相似度评分">
                      <el-switch v-model="processingConfig.compareShowSimilarity" />
                    </el-form-item>
                  </el-form>
                </template>
                
                <!-- 合并模式的配置 -->
                <template v-else-if="processingConfig.mode === 'merge'">
                  <el-form :model="processingConfig" label-position="top">
                    <el-form-item label="合并策略">
                      <el-radio-group v-model="processingConfig.mergeStrategy">
                        <el-radio label="sequential">顺序合并</el-radio>
                        <el-radio label="thematic">主题合并</el-radio>
                        <el-radio label="importance">重要性合并</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="处理冲突">
                      <el-select v-model="processingConfig.mergeConflictStrategy" placeholder="选择冲突处理方式">
                        <el-option label="保留全部版本" value="keep_all" />
                        <el-option label="保留最新版本" value="keep_newest" />
                        <el-option label="智能合并" value="smart_merge" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </template>
                
                <!-- 分类模式的配置 -->
                <template v-else-if="processingConfig.mode === 'classify'">
                  <el-form :model="processingConfig" label-position="top">
                    <el-form-item label="分类维度">
                      <el-checkbox-group v-model="processingConfig.classifyDimensions">
                        <el-checkbox label="topic">主题</el-checkbox>
                        <el-checkbox label="sentiment">情感</el-checkbox>
                        <el-checkbox label="urgency">紧急程度</el-checkbox>
                        <el-checkbox label="department">部门</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    
                    <el-form-item label="自动创建分类">
                      <el-switch v-model="processingConfig.classifyAutoCreate" />
                    </el-form-item>
                  </el-form>
                </template>
              </div>
              
              <!-- AI模型选择，所有处理方式通用 -->
              <el-form :model="processingConfig" label-position="top">
                <el-form-item label="AI模型">
                  <el-select v-model="processingConfig.model" placeholder="选择模型">
                    <el-option label="GPT-3.5" value="gpt-3.5" />
                    <el-option label="GPT-4" value="gpt-4" />
                    <el-option label="Claude-3" value="claude-3" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 处理按钮 -->
            <div class="action-buttons">
              <el-button type="primary" @click="processContent" :loading="analyzing">
                开始处理
              </el-button>
            </div>
          </el-form>
        </div>
        
        <!-- 模板上传对话框 -->
        <el-dialog
          v-model="uploadTemplateDialogVisible"
          title="上传模板配置"
          width="500px"
        >
          <div class="upload-template-form">
            <el-form label-position="top">
              <el-form-item label="模板名称">
                <el-input v-model="uploadTemplateForm.name" placeholder="输入模板名称" />
              </el-form-item>
              
              <el-form-item label="模板描述">
                <el-input v-model="uploadTemplateForm.description" type="textarea" placeholder="描述该模板的用途和特点" />
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
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">拖拽JSON配置文件到此处或 <em>点击上传</em></div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持.json格式的模板配置文件
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="uploadTemplateDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmUploadTemplate">确认上传</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      
      <!-- 中间面板：AI聊天和内容修正 -->
      <div class="editor-middle-panel">
        <div class="panel-header">
          <h3>AI处理与互动</h3>
        </div>
        
        <!-- AI处理结果 -->
        <div class="ai-processing-area">
          <!-- 处理结果展示 -->
          <div class="analysis-result" v-if="aiResponse">
            <div class="result-header">
              <div class="result-type">
                <el-tag :type="getResultTypeStyle(aiResponse.type)">
                  {{ getResultTypeName(aiResponse.type) }}
                </el-tag>
                <span class="analysis-stats">
                  <el-tooltip content="AI分析可信度">
                    <span class="confidence">
                      <el-icon><DataAnalysis /></el-icon>
                      {{ analysisConfidence }}%
                    </span>
                  </el-tooltip>
                  <el-tooltip content="处理耗时">
                    <span class="processing-time">
                      <el-icon><Timer /></el-icon>
                      {{ formatTime(processingTime) }}
                    </span>
                  </el-tooltip>
                </span>
              </div>
              <div class="result-actions">
                <el-button-group>
                  <el-button size="small" @click="expandAllBlocks" :disabled="analyzing">
                    <el-icon><FullScreen /></el-icon>全部展开
                  </el-button>
                  <el-button size="small" @click="collapseAllBlocks" :disabled="analyzing">
                    <el-icon><Crop /></el-icon>全部折叠
                  </el-button>
                  <el-button size="small" @click="refreshAnalysis" :disabled="analyzing">
                    <el-icon><RefreshRight /></el-icon>刷新分析
                  </el-button>
                </el-button-group>
              </div>
            </div>
            
            <div class="result-content">
              <!-- 流程图结果 -->
              <template v-if="aiResponse.type === 'workflow'">
                <div class="workflow-visualization">
                  <div class="workflow-controls">
                    <el-button-group>
                      <el-button size="small" @click="zoomIn">
                        <el-icon><ZoomIn /></el-icon>
                      </el-button>
                      <el-button size="small" @click="zoomOut">
                        <el-icon><ZoomOut /></el-icon>
                      </el-button>
                      <el-button size="small" @click="resetZoom">
                        <el-icon><RefreshRight /></el-icon>
                      </el-button>
                    </el-button-group>
                    <el-button size="small" @click="exportWorkflow">
                      导出流程图
                    </el-button>
                  </div>
                  
                  <!-- 使用mermaid.js渲染流程图 -->
                  <div class="mermaid-wrapper" ref="mermaidWrapper"></div>
                  
                  <!-- 节点列表 -->
                  <div class="workflow-nodes-list">
                    <h4>流程节点列表</h4>
                    <el-table :data="workflowNodes" style="width: 100%">
                      <el-table-column prop="label" label="节点名称" />
                      <el-table-column prop="type" label="节点类型">
                        <template #default="scope">
                          <el-tag :type="getNodeTypeStyle(scope.row.type)">
                            {{ getNodeTypeText(scope.row.type) }}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template #default="scope">
                          <el-button size="small" @click="editNode(scope.row)">
                            编辑
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </template>
              
              <!-- 其他处理结果 -->
              <template v-else>
                <div class="blocks-container">
                  <div
                    v-for="(block, index) in aiResponse.blocks"
                    :key="index"
                    class="ai-block"
                    :class="{ 'is-important': block.isImportant, 'is-excluded': block.excluded }"
                    :data-type="block.type"
                  >
                    <div class="block-header">
                      <div class="block-title">
                        <span v-if="block.title">{{ block.title }}</span>
                        <span v-else>区块 {{ index + 1 }}</span>
                        <el-tag v-if="block.type" size="small">{{ block.type }}</el-tag>
                      </div>
                      <div class="block-actions">
                        <el-button-group>
                          <el-tooltip content="标记重要">
                            <el-button
                              size="small"
                              :type="block.isImportant ? 'warning' : 'default'"
                              @click="toggleBlockImportance(index)"
                            >
                              <el-icon><Star /></el-icon>
                            </el-button>
                          </el-tooltip>
                          <el-tooltip content="编辑内容">
                            <el-button
                              size="small"
                              :type="block.showEdit ? 'primary' : 'default'"
                              @click="toggleBlockEdit(index)"
                            >
                              <el-icon><Edit /></el-icon>
                            </el-button>
                          </el-tooltip>
                          <el-tooltip content="添加批注">
                            <el-button
                              size="small"
                              :type="block.showNoteInput ? 'success' : 'default'"
                              @click="toggleBlockNote(index)"
                            >
                              <el-icon><ChatDotRound /></el-icon>
                            </el-button>
                          </el-tooltip>
                          <el-tooltip content="排除内容">
                            <el-button
                              size="small"
                              :type="block.excluded ? 'danger' : 'default'"
                              @click="toggleBlockExclusion(index)"
                            >
                              <el-icon><Close /></el-icon>
                            </el-button>
                          </el-tooltip>
                        </el-button-group>
                      </div>
                    </div>
                    
                    <div class="block-content" v-if="!block.showEdit">
                      {{ block.content }}
                    </div>
                    
                    <div class="block-edit" v-else>
                      <el-input
                        type="textarea"
                        :rows="5"
                        v-model="block.editContent"
                        placeholder="编辑内容..."
                      />
                      <div class="edit-actions">
                        <el-button size="small" @click="cancelBlockEdit(index)">
                          取消
                        </el-button>
                        <el-button type="primary" size="small" @click="saveBlockEdit(index)">
                          保存
                        </el-button>
                      </div>
                    </div>
                    
                    <div class="block-note" v-if="block.note || block.showNoteInput">
                      <div class="note-content" v-if="block.note && !block.showNoteInput">
                        <el-icon><ChatLineRound /></el-icon>
                        <span>{{ block.note }}</span>
                        <el-button type="text" size="small" @click="toggleBlockNote(index)">
                          编辑
                        </el-button>
                      </div>
                      <div class="note-input" v-if="block.showNoteInput">
                        <el-input
                          type="textarea"
                          :rows="2"
                          v-model="block.note"
                          placeholder="添加批注..."
                        />
                        <div class="note-actions">
                          <el-button size="small" @click="toggleBlockNote(index)">
                            完成
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div class="empty-analysis-state" v-else-if="!analyzing">
            <el-empty description="暂无分析结果">
              <template #image>
                <div class="empty-icon">
                  <el-icon><Connection /></el-icon>
                </div>
              </template>
              <template #description>
                <div class="empty-description">
                  <p v-if="selectedSourceIndexes.length > 0">点击"开始处理"按钮，将以{{ getProcessingModeName(processingConfig.mode) }}模式处理选中的数据</p>
                  <p v-if="processingConfig.templateId && processingConfig.templateId !== 'none'">当前已选择{{ getTemplateNameById(processingConfig.templateId) }}模板</p>
                  <p v-else>请在左侧选择数据来源和处理配置</p>
                </div>
              </template>
              <el-button 
                type="primary" 
                :disabled="selectedSourceIndexes.length === 0" 
                @click="processContent"
              >
                开始{{ getProcessingModeName(processingConfig.mode) }}处理
              </el-button>
            </el-empty>
          </div>
          
          <!-- 正在分析的占位符 -->
          <div class="analyzing-placeholder" v-else>
            <el-icon class="is-loading"><Loading /></el-icon>
            <p>AI正在以{{ getProcessingModeName(processingConfig.mode) }}模式分析您的内容...</p>
            <p v-if="processingConfig.templateId && processingConfig.templateId !== 'none'" class="template-hint">使用{{ getTemplateNameById(processingConfig.templateId) }}模板</p>
            <el-progress 
              type="circle" 
              :percentage="analysisProgress" 
              :status="analysisProgress === 100 ? 'success' : ''"
            />
          </div>
        </div>
        
        <!-- AI对话区域 -->
        <div class="ai-chat-area">
          <div class="chat-header">
            <h4>AI对话助手</h4>
            <el-button-group>
              <el-button size="small" @click="clearChat">
                <el-icon><Delete /></el-icon>清空对话
              </el-button>
            </el-button-group>
          </div>
          
          <div class="chat-messages" ref="chatMessagesContainer">
            <div 
              v-for="(message, index) in chatHistory" 
              :key="index"
              class="chat-message"
              :class="{ 'user-message': message.type === 'user', 'ai-message': message.type === 'ai' }"
            >
              <div class="message-avatar">
                <el-avatar :size="32" :icon="message.type === 'user' ? 'UserFilled' : 'Service'" />
              </div>
              <div class="message-content">
                {{ message.content }}
                <div class="message-time">{{ formatMessageTime(message.timestamp) }}</div>
              </div>
              <div class="message-actions" v-if="message.type === 'ai'">
                <el-button-group>
                  <el-button size="small" @click="copyMessageToClipboard(message)">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                  <el-button size="small" @click="applyMessageToAnalysis(message)">
                    <el-icon><Check /></el-icon>
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <el-input
              v-model="userMessage"
              type="textarea"
              :rows="2"
              placeholder="输入问题或指令..."
              @keyup.enter.ctrl="sendMessage"
            />
            <div class="input-actions">
              <span class="input-tip">按 Ctrl+Enter 发送</span>
              <el-button type="primary" @click="sendMessage" :loading="chatLoading">
                <el-icon><Position /></el-icon>发送
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧面板：预览、保存和应用 -->
      <div class="editor-right-panel">
        <el-tabs v-model="rightActiveTab" class="right-tabs">
          <!-- 预览选项卡 -->
          <el-tab-pane label="预览" name="preview">
            <div class="panel-header">
              <h3>知识预览</h3>
            </div>
            
            <div class="preview-content">
              <el-form :model="knowledgeForm" label-position="top">
                <el-form-item label="知识标题">
                  <el-input v-model="knowledgeForm.title" placeholder="输入标题" />
                </el-form-item>
                
                <el-form-item label="内容预览">
                  <div class="preview-box">
                    <div v-if="aiResponse" class="preview-body">
                      <div v-if="aiResponse.type === 'workflow'" class="workflow-preview">
                        <div class="preview-workflow-title">流程图：{{ knowledgeForm.title }}</div>
                        <div class="preview-workflow-image">
                          <!-- 流程图预览将在处理完成后显示 -->
                          <img v-if="workflowImageUrl" :src="workflowImageUrl" alt="流程图预览" />
                          <div v-else class="no-preview">
                            <el-icon><Picture /></el-icon>
                            <span>流程图生成后将在此显示</span>
                          </div>
                        </div>
                      </div>
                      <div v-else class="content-preview">
                        {{ generatedContent }}
                      </div>
                    </div>
                    <div v-else class="no-preview">
                      <el-empty description="暂无预览内容">
                        <template #image>
                          <el-icon><Document /></el-icon>
                        </template>
                      </el-empty>
                    </div>
                  </div>
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
              </el-form>
              
              <div class="save-actions">
                <el-button type="primary" @click="saveKnowledge" :loading="saving">
                  <el-icon><Check /></el-icon>保存知识
                </el-button>
                <el-button @click="downloadKnowledge">
                  <el-icon><Download /></el-icon>下载
                </el-button>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- 应用选项卡 -->
          <el-tab-pane label="应用" name="application">
            <div class="panel-header">
              <h3>应用到业务</h3>
            </div>
            
            <div class="application-section">
              <el-row :gutter="20">
                <!-- 智能客服 -->
                <el-col :span="8">
                  <el-card shadow="hover" class="app-card" @click="showApplicationModal('customer_service')">
                    <div class="app-icon">
                      <el-icon><Service /></el-icon>
                    </div>
                    <div class="app-name">智能客服</div>
                    <div class="app-desc">转换为客服知识库</div>
                  </el-card>
                </el-col>
                
                <!-- 合同生成 -->
                <el-col :span="8">
                  <el-card shadow="hover" class="app-card" @click="showApplicationModal('contract')">
                    <div class="app-icon">
                      <el-icon><Document /></el-icon>
                    </div>
                    <div class="app-name">合同生成</div>
                    <div class="app-desc">生成合同文档</div>
                  </el-card>
                </el-col>
                
                <!-- 订单生成 -->
                <el-col :span="8">
                  <el-card shadow="hover" class="app-card" @click="showApplicationModal('order')">
                    <div class="app-icon">
                      <el-icon><ShoppingCart /></el-icon>
                    </div>
                    <div class="app-name">订单生成</div>
                    <div class="app-desc">创建订单数据</div>
                  </el-card>
                </el-col>
                
                <!-- 采购单 -->
                <el-col :span="8">
                  <el-card shadow="hover" class="app-card" @click="showApplicationModal('purchase')">
                    <div class="app-icon">
                      <el-icon><Goods /></el-icon>
                    </div>
                    <div class="app-name">采购单</div>
                    <div class="app-desc">生成采购订单</div>
                  </el-card>
                </el-col>
                
                <!-- 报关 -->
                <el-col :span="8">
                  <el-card shadow="hover" class="app-card" @click="showApplicationModal('customs')">
                    <div class="app-icon">
                      <el-icon><Ship /></el-icon>
                    </div>
                    <div class="app-name">报关</div>
                    <div class="app-desc">生成报关单据</div>
                  </el-card>
                </el-col>
                
                <!-- 知识图谱 -->
                <el-col :span="8">
                  <el-card shadow="hover" class="app-card" @click="showApplicationModal('knowledge_graph')">
                    <div class="app-icon">
                      <el-icon><Share /></el-icon>
                    </div>
                    <div class="app-name">知识图谱</div>
                    <div class="app-desc">添加到知识图谱</div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
            
            <!-- 应用到业务的弹窗 -->
            <el-dialog
              v-model="applicationDialogVisible"
              :title="getApplicationTitle(currentApplication)"
              width="60%"
            >
              <div class="application-dialog-content">
                <template v-if="currentApplication === 'customer_service'">
                  <el-form :model="customerServiceForm" label-width="100px">
                    <el-form-item label="问题类型">
                      <el-select v-model="customerServiceForm.questionType">
                        <el-option label="常见问题" value="faq" />
                        <el-option label="产品问题" value="product" />
                        <el-option label="账户问题" value="account" />
                        <el-option label="支付问题" value="payment" />
                        <el-option label="配送问题" value="shipping" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="自动问答">
                      <el-switch v-model="customerServiceForm.enableAutoQA" />
                    </el-form-item>
                    <el-form-item label="优先级">
                      <el-rate v-model="customerServiceForm.priority" />
                    </el-form-item>
                  </el-form>
                </template>
                
                <template v-else-if="currentApplication === 'contract'">
                  <el-form :model="contractForm" label-width="100px">
                    <el-form-item label="合同类型">
                      <el-select v-model="contractForm.type">
                        <el-option label="销售合同" value="sales" />
                        <el-option label="采购合同" value="purchase" />
                        <el-option label="服务协议" value="service" />
                        <el-option label="合作协议" value="cooperation" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="模板">
                      <el-select v-model="contractForm.template">
                        <el-option label="标准模板" value="standard" />
                        <el-option label="简化模板" value="simple" />
                        <el-option label="详细模板" value="detailed" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="有效期">
                      <el-date-picker
                        v-model="contractForm.validityRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      />
                    </el-form-item>
                  </el-form>
                </template>
                
                <!-- 其他应用的表单会根据类型动态显示 -->
                <template v-else>
                  <el-form label-width="100px">
                    <el-form-item label="应用类型">
                      <el-tag>{{ getApplicationTitle(currentApplication) }}</el-tag>
                    </el-form-item>
                    <el-form-item label="参数配置">
                      <el-alert type="info" :closable="false">
                        正在准备{{ getApplicationTitle(currentApplication) }}的配置选项...
                      </el-alert>
                    </el-form-item>
                  </el-form>
                </template>
              </div>
              
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="applicationDialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="applyToApplication" :loading="applying">
                    应用
                  </el-button>
                </div>
              </template>
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { 
  Document, 
  ChatDotRound, 
  Edit,
  Delete,
  Plus,
  Link,
  Connection, 
  Pointer,
  Operation,
  FolderAdd,
  Files,
  DataAnalysis, 
  Timer, 
  FullScreen, 
  Crop, 
  RefreshRight,
  ZoomIn, 
  ZoomOut, 
  Check,
  ChatLineRound,
  Star, 
  Close, 
  Loading,
  Position, 
  CopyDocument,
  Picture, 
  Download,
  Monitor,
  Service,
  Share, 
  ShoppingCart, 
  Goods,
  Upload,
  Back
} from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'

const router = useRouter()

// 选项卡控制
const rightActiveTab = ref('preview')

// 记录上一次选择的模板ID
const lastSelectedTemplateId = ref('summary_order')
const isTemplateDisabled = ref(false)
const uploadTemplateDialogVisible = ref(false)
const uploadTemplateForm = reactive({
  name: '',
  description: '',
  file: null as File | null,
  content: null as any
})

// 用户自定义模板 - 使用简单数组
const userTemplates = ref<any[]>([])

// 在实际应用中，这里会从服务器或本地存储加载模板
// 这里仅作为示例，使用空数组并在后续开发中完善
// 正常情况下会根据用户的创建填充此数组

// 处理模板文件上传
const handleTemplateFileChange = (file: UploadFile) => {
  uploadTemplateForm.file = file.raw as File
  
  // 读取JSON文件内容
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = JSON.parse(e.target?.result as string)
      uploadTemplateForm.content = content
    } catch (error) {
      ElMessage.error('模板文件格式错误，请上传有效的JSON文件')
      console.error('模板文件解析错误:', error)
    }
  }
  reader.readAsText(file.raw as File)
}

// 确认上传模板
const confirmUploadTemplate = () => {
  if (!uploadTemplateForm.name || !uploadTemplateForm.file) {
    ElMessage.warning('请输入模板名称并上传文件')
    return
  }
  
  // 检查上传的文件内容有效性
  if (!uploadTemplateForm.content) {
    ElMessage.error('模板文件内容无效')
    return
  }
  
  // 在实际应用中会将模板上传到服务器或保存到本地存储
  // 这里我们只是显示一个成功消息
  ElMessage.success('模板上传成功')
  
  // 提示用户可以在模板管理页面找到上传的模板
  setTimeout(() => {
    ElMessageBox.confirm(
      '模板上传成功，您可以在"模板管理"页面找到它。是否前往模板管理页面？',
      '上传成功',
      {
        confirmButtonText: '前往模板管理',
        cancelButtonText: '继续编辑',
        type: 'success',
      }
    )
      .then(() => {
        router.push('/knowledge-base/knowledge-center?tab=templates')
      })
      .catch(() => {
        // 用户选择继续编辑
      })
  }, 500)
  
    uploadTemplateDialogVisible.value = false
}

// 判断处理模式是否需要模板
const needTemplate = (mode: ProcessingMode): boolean => {
  // 某些处理方式可能不需要模板
  // 这里默认所有处理方式都支持模板，可以根据需求调整
  return true
}

// 数据源相关
const sources = ref<Source[]>([])
const selectedSourceIndexes = ref<number[]>([])
const currentSourceIndex = ref<number | null>(null)
const addSourceDialogVisible = ref(false)
const activeSourceType = ref<'manual' | 'file' | 'url' | 'api'>('manual')

// 添加数据源表单
const manualSourceForm = reactive({
  name: '',
  content: ''
})

const fileSourceForm = reactive({
  name: '',
  file: null as File | null
})

const urlSourceForm = reactive({
  name: '',
  url: ''
})

const apiSourceForm = reactive({
  name: '',
  endpoint: '',
  method: 'get'
})

// 处理配置
const processingConfig = reactive({
  mode: 'summary' as ProcessingMode,
  model: 'gpt-3.5',
  templateId: 'warehouse_management',
  
  // 摘要相关配置
  summaryLength: 200,
  summaryExtractFields: ['dates', 'names', 'amounts', 'status'],
  
  // 问答相关配置
  qaCount: 3,
  qaStyle: 'business',
  qaIncludeReferences: false,
  qaExtractFields: ['definitions', 'procedures', 'examples'],
  
  // 关键点相关配置
  keyPointsCount: 5,
  keyPointsDetectDuplicates: true,
  keyPointsExtractFields: ['main_ideas', 'action_items', 'requirements', 'decisions'],
  
  // 流程图相关配置
  workflowType: 'business',
  nodeExtractionMethod: 'auto',
  autoConnectNodes: true,
  workflowExtractFields: ['start', 'process', 'decision', 'end'],
  
  // 对比相关配置
  compareOptions: ['content'],
  compareShowSimilarity: true,
  
  // 合并相关配置
  mergeStrategy: 'sequential',
  mergeConflictStrategy: 'smart_merge',
  
  // 分类相关配置
  classifyDimensions: ['topic'],
  classifyAutoCreate: false
})

// 模板类型判断的计算属性
const isOrderTemplate = computed(() => {
  return ['order_management', 'after_sales', 'return_management']
    .includes(processingConfig.templateId);
})

const isWarehouseTemplate = computed(() => {
  return ['warehouse_management', 'logistics_delivery', 'inventory_management']
    .includes(processingConfig.templateId);
})

const isFinanceTemplate = computed(() => {
  return ['financial_report', 'cost_analysis', 'income_record', 'expense_management']
    .includes(processingConfig.templateId);
})

const isCustomerTemplate = computed(() => {
  return ['customer_profile', 'membership_management', 'customer_relationship']
    .includes(processingConfig.templateId);
})

const isCustomerServiceTemplate = computed(() => {
  return ['customer_service', 'after_sales']
    .includes(processingConfig.templateId);
})

// 处理模板选择变化
const handleTemplateChange = () => {
  if (processingConfig.templateId === 'save_new_template') {
    // 打开保存模板对话框
    saveProcessingTemplate();
    // 恢复之前选择的模板ID
    processingConfig.templateId = lastSelectedTemplateId.value;
    return;
  }
  
  if (processingConfig.templateId === 'upload_template') {
    // 打开上传模板对话框
    uploadTemplateDialogVisible.value = true;
    // 恢复之前选择的模板ID
    processingConfig.templateId = lastSelectedTemplateId.value;
    return;
  }
  
  if (processingConfig.templateId === 'none') {
    // 用户选择不使用模板
    isTemplateDisabled.value = true;
    ElMessage.info('已跳过模板选择，将使用默认配置');
    return;
  }
  
  // 恢复模板使用
  isTemplateDisabled.value = false;
  
  // 记住当前选择的模板ID
  lastSelectedTemplateId.value = processingConfig.templateId;
  
  // 根据模板应用相应的配置
  if (isOrderTemplate.value) {
    // 订单管理相关配置
    processingConfig.summaryExtractFields = ['order_number', 'dates', 'customer', 'amounts', 'products', 'status'];
    processingConfig.qaExtractFields = ['statuses', 'modifications', 'cancellations', 'returns'];
    processingConfig.keyPointsExtractFields = ['costs', 'product_details', 'shipping_info', 'payment_terms', 'delivery_schedule'];
    processingConfig.workflowExtractFields = ['order_placement', 'payment_processing', 'fulfillment', 'shipping', 'delivery', 'post_delivery'];
  } else if (isWarehouseTemplate.value) {
    // 仓储物流相关配置
    processingConfig.summaryExtractFields = ['inventory', 'locations', 'dates', 'status', 'tracking'];
    processingConfig.qaExtractFields = ['processes', 'policies', 'solutions', 'references'];
    processingConfig.keyPointsExtractFields = ['stock_levels', 'expiration_dates', 'storage_conditions', 'handling_instructions', 'shelf_locations'];
    processingConfig.workflowExtractFields = ['receiving', 'quality_check', 'putaway', 'picking', 'packing', 'shipping'];
  } else if (isFinanceTemplate.value) {
    // 财务相关配置
    processingConfig.summaryExtractFields = ['amounts', 'dates', 'accounts', 'categories', 'tax'];
    processingConfig.qaExtractFields = ['procedures', 'policies', 'definitions', 'examples'];
    processingConfig.keyPointsExtractFields = ['revenue_sources', 'expense_categories', 'profit_margins', 'budget_variances', 'tax_implications'];
    processingConfig.workflowExtractFields = ['start', 'process', 'decision', 'sub_process', 'end'];
  } else if (isCustomerTemplate.value) {
    // 客户相关配置
    processingConfig.summaryExtractFields = ['names', 'contacts', 'locations', 'preferences', 'history'];
    processingConfig.qaExtractFields = ['policies', 'definitions', 'solutions', 'contacts'];
    processingConfig.keyPointsExtractFields = ['main_ideas', 'requirements', 'concerns', 'decisions', 'action_items'];
    processingConfig.workflowExtractFields = ['start', 'process', 'decision', 'sub_process', 'end'];
  } else {
    // 默认配置
    processingConfig.summaryExtractFields = ['dates', 'names', 'amounts', 'locations', 'status'];
    processingConfig.qaExtractFields = ['definitions', 'procedures', 'examples', 'references'];
    processingConfig.keyPointsExtractFields = ['main_ideas', 'action_items', 'requirements', 'concerns', 'decisions'];
    processingConfig.workflowExtractFields = ['start', 'process', 'decision', 'sub_process', 'end'];
  }
  
  ElMessage.success(`已应用${processingConfig.templateId}模板`);
}

// 获取模板显示名称
const getTemplateDisplayName = (templateId: string) => {
  // 按照模板ID返回对应的显示名称
  const templateMap: Record<string, string> = {
    // 摘要模板
    'summary_order': '订单履约摘要',
    'summary_warehouse': '仓储库存摘要',
    'summary_logistics': '物流跟踪摘要',
    'summary_finance': '财务报表摘要',
    'summary_customer': '客户信息摘要',
    
    // 问答模板
    'qa_customer_service': '客服常见问题',
    'qa_order': '订单问题解答',
    'qa_delivery': '物流配送问答',
    'qa_return': '退换货政策问答',
    
    // 关键点模板
    'key_points_order': '订单关键信息',
    'key_points_logistics': '物流关键节点',
    'key_points_warehouse': '仓储操作要点',
    'key_points_finance': '财务核对要点',
    
    // 流程图模板
    'workflow_order': '订单处理流程',
    'workflow_logistics': '物流配送流程',
    'workflow_warehouse_in': '入库上架流程',
    'workflow_warehouse_out': '拣货出库流程',
    'workflow_return': '退货处理流程',
    
    // 对比模板
    'compare_order': '订单数据对比',
    'compare_inventory': '库存变化对比',
    'compare_delivery': '配送时效对比',
    'compare_cost': '成本费用对比'
  };
  
  // 查找自定义模板名称
  if (templateId.startsWith('custom_')) {
    for (const mode in userTemplates) {
      const template = userTemplates[mode as ProcessingMode].find(t => t.id === templateId);
      if (template) {
        return template.name;
      }
    }
  }
  
  return templateMap[templateId] || templateId;
}

// 模板
const templates = ref<ProcessingTemplate[]>([
  {
    id: '1',
    name: '标准摘要模板',
    description: '生成简洁的内容摘要',
    mode: 'summary',
    config: {
      model: 'gpt-3.5'
    }
  },
  {
    id: '2',
    name: '详细问答模板',
    description: '从内容生成常见问题和答案',
    mode: 'qa',
    config: {
      model: 'gpt-3.5'
    }
  },
  {
    id: '3',
    name: '业务流程图模板',
    description: '识别内容中的流程并生成流程图',
    mode: 'workflow',
    config: {
      model: 'gpt-3.5',
      workflowType: 'business',
      nodeExtractionMethod: 'auto',
      autoConnectNodes: true
    }
  }
])

// AI分析相关
const analyzing = ref(false)
const aiResponse = ref<AIResponse | null>(null)
const analysisProgress = ref(0)
const analysisConfidence = ref(85)
const processingTime = ref(1240)
const workflowImageUrl = ref('')
const workflowNodes = ref<WorkflowNode[]>([])

// 聊天相关
const userMessage = ref('')
const chatHistory = ref<Message[]>([])
const chatLoading = ref(false)
const chatMessagesContainer = ref<HTMLElement | null>(null)

// 知识表单
const knowledgeForm = reactive({
  title: '',
  content: '',
  visibility: 'private' as 'private' | 'team' | 'public',
  tags: [] as string[]
})

// 标签输入
const inputTagVisible = ref(false)
const inputTagValue = ref('')
const tagInputRef = ref<HTMLInputElement | null>(null)

// 保存和应用相关
const saving = ref(false)
const applying = ref(false)
const applicationDialogVisible = ref(false)
const currentApplication = ref<ApplicationType | null>(null)

// 应用表单
const customerServiceForm = reactive({
  questionType: 'faq',
  enableAutoQA: true,
  priority: 3
})

const contractForm = reactive({
  type: 'sales',
  template: 'standard',
  validityRange: [] as Date[]
})

// 类型定义
type ProcessingMode = 'summary' | 'qa' | 'key_points' | 'workflow' | 'compare' | 'merge' | 'classify'

type ApplicationType = 'customer_service' | 'contract' | 'order' | 'purchase' | 'customs' | 'knowledge_graph'

interface Source {
  id: string
  name: string
  type: 'manual' | 'file' | 'url' | 'api'
  content: string
  metadata?: Record<string, any>
}

interface AIBlock {
  title?: string;
  content: string;
  note: string;
  showNoteInput: boolean;
  type: string;
  extraClass?: string; // 添加extraClass可选属性
  isImportant?: boolean;
  excluded?: boolean;
  showEdit?: boolean;
  editContent?: string;
}

interface AIResponse {
  type: string
  blocks: AIBlock[]
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: number
  sources?: string[]
}

interface ProcessingTemplate {
  id: string
  name: string
  description: string
  mode: ProcessingMode
  config: Record<string, any>
}

interface WorkflowNode {
  id: string
  type: string
  label: string
  properties?: Record<string, any>
}

// 计算属性
const generatedContent = computed(() => {
  if (!aiResponse.value) return ''
  
  // 排除被标记为排除的块
  const validBlocks = aiResponse.value.blocks.filter(block => !block.excluded)
  
  // 根据类型返回不同格式的内容
  if (aiResponse.value.type === 'qa') {
    return validBlocks.map((block, index) => `问题${index + 1}：${block.title || ''}\n答：${block.content}`).join('\n\n')
  } else if (aiResponse.value.type === 'key_points') {
    return validBlocks.map(block => `• ${block.content}`).join('\n')
  } else {
    return validBlocks.map(block => block.content).join('\n\n')
  }
})

// 数据源相关方法
const addNewSource = () => {
  activeSourceType.value = 'manual'
  addSourceDialogVisible.value = true
  manualSourceForm.name = ''
  manualSourceForm.content = ''
}

const handleFileChange = (file: UploadFile) => {
  fileSourceForm.file = file.raw as File
  fileSourceForm.name = file.name
}

const confirmAddSource = () => {
  let newSource: Source
  
  if (activeSourceType.value === 'manual') {
    if (!manualSourceForm.name || !manualSourceForm.content) {
      ElMessage.warning('请输入名称和内容')
      return
    }
    
    newSource = {
      id: uuidv4(),
      name: manualSourceForm.name,
      type: 'manual',
      content: manualSourceForm.content
    }
  } else if (activeSourceType.value === 'file') {
    if (!fileSourceForm.file) {
      ElMessage.warning('请选择文件')
      return
    }
    
    // 通常这里会调用API上传文件并获取内容
    // 这里暂时模拟文件内容
    newSource = {
      id: uuidv4(),
      name: fileSourceForm.name,
      type: 'file',
      content: `这是文件 ${fileSourceForm.name} 的内容`,
      metadata: {
        size: fileSourceForm.file.size,
        type: fileSourceForm.file.type
      }
    }
  } else if (activeSourceType.value === 'url') {
    if (!urlSourceForm.name || !urlSourceForm.url) {
      ElMessage.warning('请输入名称和URL')
      return
    }
    
    // 通常这里会调用API获取URL内容
    // 这里暂时模拟URL内容
    newSource = {
      id: uuidv4(),
      name: urlSourceForm.name,
      type: 'url',
      content: `来自URL ${urlSourceForm.url} 的内容`,
      metadata: {
        url: urlSourceForm.url
      }
    }
  } else if (activeSourceType.value === 'api') {
    if (!apiSourceForm.name || !apiSourceForm.endpoint) {
      ElMessage.warning('请输入名称和API端点')
      return
    }
    
    // 通常这里会调用API获取数据
    // 这里暂时模拟API数据
    newSource = {
      id: uuidv4(),
      name: apiSourceForm.name,
      type: 'api',
      content: `来自API ${apiSourceForm.endpoint} 的数据`,
      metadata: {
        endpoint: apiSourceForm.endpoint,
        method: apiSourceForm.method
      }
    }
  } else {
    return
  }
  
  sources.value.push(newSource)
  addSourceDialogVisible.value = false
  ElMessage.success('已添加数据源')
}

const selectSource = (index: number) => {
  currentSourceIndex.value = index
}

const getSourceIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    'manual': 'Edit',
    'file': 'Document',
    'url': 'Link',
    'api': 'Connection'
  }
  return iconMap[type] || 'Document'
}

const getSourceTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'manual': '手动输入',
    'file': '文件',
    'url': '网址',
    'api': 'API'
  }
  return typeMap[type] || '未知类型'
}

// 模板相关方法
const saveProcessingTemplate = () => {
  ElMessageBox.prompt('请输入模板名称', '保存模板', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    inputPlaceholder: `${getProcessingModeName(processingConfig.mode)}模板`
  }).then(({ value }) => {
      if (!value) {
      ElMessage.warning('请输入模板名称')
      return
    }
    
    // 将当前的处理配置保存为模板
    ElMessage.success('模板保存成功，您可以在"模板管理"中找到它')
    
    // 跳转到模板管理页面
    router.push('/knowledge-base/knowledge-center?tab=templates')
  }).catch(() => {
    // 用户取消保存
  })
}

const applyTemplate = (template: ProcessingTemplate) => {
  // 应用模板配置
  processingConfig.mode = template.mode
  
  // 根据模板类型设置特定配置
  if (template.config.model) {
    processingConfig.model = template.config.model
  }
  
  if (template.mode === 'workflow' && template.config.workflowType) {
    processingConfig.workflowType = template.config.workflowType
    processingConfig.nodeExtractionMethod = template.config.nodeExtractionMethod || 'auto'
    processingConfig.autoConnectNodes = template.config.autoConnectNodes !== undefined 
      ? template.config.autoConnectNodes 
      : true
  }
  
  ElMessage.success(`已应用模板: ${template.name}`)
}

const deleteTemplate = (index: number) => {
  ElMessageBox.confirm('确定要删除这个模板吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    templates.value.splice(index, 1)
    ElMessage.success('模板已删除')
  }).catch(() => {
    // 用户取消
  })
}

// 模板图标处理函数 - 保留一个即可，删除重复定义
const getTemplateIcon = (mode: ProcessingMode) => {
  const iconMap: Record<ProcessingMode, string> = {
    'summary': 'Document',
    'qa': 'ChatDotRound',
    'key_points': 'Pointer',
    'workflow': 'Connection',
    'compare': 'Operation',
    'merge': 'FolderAdd',
    'classify': 'Files'
  }
  
  return iconMap[mode] || 'Document'
}

const getProcessingModeName = (mode: ProcessingMode) => {
  const modeMap: Record<ProcessingMode, string> = {
    'summary': '摘要',
    'qa': '问答',
    'key_points': '关键点',
    'workflow': '流程图',
    'compare': '对比',
    'merge': '合并',
    'classify': '分类'
  }
  return modeMap[mode] || '未知'
}

// AI处理相关方法
const processContent = async () => {
  if (selectedSourceIndexes.value.length === 0) {
    ElMessage.warning('请选择要处理的数据源')
    return
  }

  analyzing.value = true
  analysisProgress.value = 0
  
  try {
    // 模拟进度变化
    const interval = setInterval(() => {
      analysisProgress.value += 5
      if (analysisProgress.value >= 100) {
        clearInterval(interval)
        
        // 生成模拟数据
        aiResponse.value = generateMockAnalysis(processingConfig.mode)
        
        // 如果是流程图，生成流程图节点
        if (processingConfig.mode === 'workflow') {
          generateWorkflowNodes()
        }
        
        // 更新处理相关数据
        updateProcessingStats()
        
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

const generateMockAnalysis = (mode: ProcessingMode): AIResponse => {
  switch (mode) {
    case 'summary':
      // 根据templateId返回不同类型的摘要
      switch (processingConfig.templateId) {
        case 'order_summary':
          return {
            type: 'summary',
            blocks: [
              {
                title: '订单履约摘要',
                content: `订单号: ORD2024061500123
客户: 上海智联科技有限公司
下单时间: 2024-06-15 09:23:45
订单金额: ¥12,350.00
支付状态: 已支付
物流状态: 已发货
发货仓库: 华东仓
承运商: 顺丰速运
运单号: SF1234567890
预计送达: 2024-06-17
商品清单: 
- 笔记本电脑 × 2  ¥8,600.00
- 显示器 × 3  ¥3,150.00
- 键盘 × 5  ¥600.00
备注: 客户要求工作日送货，需要安排安装服务`,
                note: '',
                showNoteInput: false,
                type: 'order_summary'
              }
            ]
          }
        case 'warehouse_summary':
          return {
            type: 'summary',
            blocks: [
              {
                title: '仓储库存摘要',
                content: `仓库: 华东中心仓
统计时间: 2024-06-15
总SKU数: 1,250
库存总量: 25,680件
库存总价值: ¥3,450,800
库存状态分布:
- 正常库存: 21,800件 (84.9%)
- 积压库存: 2,350件 (9.2%)
- 临近效期: 1,530件 (5.9%)

近7天库存变动:
- 入库量: 1,890件
- 出库量: 2,105件
- 净变化: -215件

库存健康度: 92%
库存周转率: 12.5天
库位利用率: 78%

警戒SKU: 15个
积压SKU: 8个
推荐补货SKU: 
- 电脑配件类 (23个)
- 办公用品类 (18个)`,
                note: '',
                showNoteInput: false,
                type: 'warehouse_summary'
              }
            ]
          }
        case 'logistics_summary':
          return {
            type: 'summary',
            blocks: [
              {
                title: '物流跟踪摘要',
                content: `运单号: SF1234567890
订单号: ORD2024061500123
发货时间: 2024-06-15 15:30:22
当前状态: 运输中
当前位置: 浙江杭州转运中心
预计送达: 2024-06-17 14:00-18:00

收件信息:
- 收件人: 张经理
- 联系电话: 138****6789
- 收货地址: 上海市浦东新区张江高科技园区

配送详情:
- 配送方式: 陆运
- 承运商: 顺丰速运
- 包裹数量: 3件
- 包裹重量: 8.5kg

物流轨迹: 
- 2024-06-15 15:30 [上海] 已揽收
- 2024-06-15 18:45 [上海] 离开上海分拨中心
- 2024-06-16 02:15 [杭州] 到达杭州转运中心
- 2024-06-16 06:30 [杭州] 离开杭州转运中心`,
                note: '',
                showNoteInput: false,
                type: 'logistics_summary'
              }
            ]
          }
        case 'finance_summary':
          return {
            type: 'summary',
            blocks: [
              {
                title: '财务报表摘要',
                content: `报表类型: 月度收支报表
统计周期: 2024年5月
总收入: ¥1,850,620.00
总支出: ¥1,213,456.78
净利润: ¥637,163.22
同比增长: 15.3%

主要收入来源:
- 产品销售: ¥1,520,300.00 (82.2%)
- 技术服务: ¥280,320.00 (15.1%)
- 其他收入: ¥50,000.00 (2.7%)

主要支出项目:
- 采购成本: ¥850,200.00 (70.1%)
- 人力成本: ¥220,360.00 (18.2%)
- 物流仓储: ¥95,420.00 (7.9%)
- 运营费用: ¥47,476.78 (3.8%)

财务指标:
- 毛利率: 44.1%
- 费用率: 23.5%
- 净利率: 34.4%

应收账款: ¥320,500.00
应付账款: ¥180,320.00
现金流状况: 良好`,
                note: '',
                showNoteInput: false,
                type: 'finance_summary'
              }
            ]
          }
        case 'customer_summary':
          return {
            type: 'summary',
            blocks: [
              {
                title: '客户信息摘要',
                content: `客户名称: 上海智联科技有限公司
客户编号: CUS10058923
客户类型: 企业客户/金牌客户
合作时间: 3年2个月

联系信息:
- 主要联系人: 张经理 (采购总监)
- 联系电话: 138****5678
- 电子邮箱: zhang@zhilian-tech.com
- 公司地址: 上海市浦东新区张江高科技园区

业务情况:
- 主要业务: 电子产品批发采购
- 年度交易额: 约¥1,500,000
- 付款条件: 月结30天
- 信用等级: A
- 订单频率: 平均每周1-2次

购买偏好:
- 高频产品: 笔记本电脑、显示器、网络设备
- 最近购买: 笔记本电脑*10 (2024-06-01)

客户互动:
- 售后记录: 近3个月内有2次售后服务
- 最近互动: 2024-06-10 (电话沟通下半年采购计划)
- 客户满意度: 4.8/5.0`,
                note: '',
                showNoteInput: false,
                type: 'customer_summary'
              }
            ]
          }
        default:
          // 根据当前选择的配置动态生成行业特定分析内容
          let customTitle = '业务分析摘要';
          let customContent = '';
          
          // 根据数据源类型生成内容前缀
          const sourceType = sources[currentSourceIndex.value || 0]?.type || 'unknown';
          const sourceName = sources[currentSourceIndex.value || 0]?.name || '未知数据源';
          
          // 构建数据源描述
          let dataSourceDesc = '';
          if (sourceType === 'manual') {
            dataSourceDesc = `根据手动输入的"${sourceName}"内容`;
          } else if (sourceType === 'file') {
            dataSourceDesc = `基于上传的文件"${sourceName}"`;
          } else if (sourceType === 'url') {
            dataSourceDesc = `从网址"${sourceName}"抓取的内容`;
          } else if (sourceType === 'api') {
            dataSourceDesc = `通过API"${sourceName}"获取的结构化数据`;
          } else {
            dataSourceDesc = '基于选定数据源';
          }
          
          // 生成业务分析模板
          // 提取模板类型，如果有templateId
          const templateType = processingConfig.templateId ? 
            processingConfig.templateId.split('_')[0] : 
            '';
          
          // 根据业务领域构建不同的分析结果
          if (templateType === 'order') {
            customTitle = '订单业务分析';
            customContent = `## 订单流程效率分析\n\n`;
            
            if (processingConfig.summaryExtractFields?.includes('order_number')) {
              customContent += `### 订单处理概览\n\n`;
              customContent += `- 本周订单总量: 152 (+12% 环比)\n`;
              customContent += `- 平均处理时长: 2.5小时 (-15% 环比)\n`;
              customContent += `- 订单完成率: 94.8%\n\n`;
            }
            
            if (processingConfig.summaryExtractFields?.includes('delivery_schedule')) {
              customContent += `### 配送履约情况\n\n`;
              customContent += `- 准时交付率: 92.3%\n`;
              customContent += `- 平均配送时间: 1.8天\n`;
              customContent += `- 延误订单比例: 4.5%\n`;
              customContent += `- 主要延误原因: 库存短缺(35%), 物流延迟(42%), 天气因素(23%)\n\n`;
            }
            
            if (processingConfig.summaryExtractFields?.includes('customer')) {
              customContent += `### 客户满意度指标\n\n`;
              customContent += `- 平均满意度评分: 4.7/5.0\n`;
              customContent += `- 投诉率: 1.2%\n`;
              customContent += `- 重复购买率: 68%\n`;
              customContent += `- NPS评分: 72 (行业平均: 65)\n\n`;
            }
            
            customContent += `### 改进建议\n\n`;
            customContent += `1. 优化库存预测算法，减少缺货情况\n`;
            customContent += `2. 根据配送数据调整物流路线，提高准时率\n`;
            customContent += `3. 针对高频客户推出会员专属配送服务\n\n`;
          } 
          else if (templateType === 'warehouse') {
            customTitle = '仓储运营分析';
            customContent = `## 仓储效率分析\n\n`;
            
            if (processingConfig.summaryExtractFields?.includes('inventory')) {
              customContent += `### 库存健康情况\n\n`;
              customContent += `- 库存周转率: 12.5次/年\n`;
              customContent += `- 库存准确率: 99.2%\n`;
              customContent += `- 呆滞库存比例: 4.8%\n`;
              customContent += `- 库存持有成本: ¥285,600/月\n\n`;
            }
            
            if (processingConfig.summaryExtractFields?.includes('storage_conditions')) {
              customContent += `### 仓储空间利用\n\n`;
              customContent += `- 空间利用率: 78.5%\n`;
              customContent += `- 最优货架布局推荐: ABC分类法\n`;
              customContent += `- 热销品集中区域使用率: 92%\n`;
              customContent += `- 推荐优化点: 调整D区货架高度以适应大件商品\n\n`;
            }
            
            customContent += `### 作业效率分析\n\n`;
            customContent += `- 平均拣货时间: 4.2分钟/订单\n`;
            customContent += `- 拣货准确率: 99.7%\n`;
            customContent += `- 人均处理订单量: 65单/天\n`;
            customContent += `- 高峰期瓶颈: 包装区(建议增加2个工位)\n\n`;
            
            customContent += `### 改进建议\n\n`;
            customContent += `1. 实施动态补货模型，优化库存水平\n`;
            customContent += `2. 引入RF拣货技术，提高拣货效率\n`;
            customContent += `3. 重新布局包装区，解决高峰期瓶颈\n\n`;
          }
          else if (templateType === 'logistics') {
            customTitle = '物流配送分析';
            customContent = `## 物流网络效能分析\n\n`;
            
            if (processingConfig.summaryExtractFields?.includes('shipping_info')) {
              customContent += `### 配送效率指标\n\n`;
              customContent += `- 平均配送时长: 36小时\n`;
              customContent += `- 准时送达率: 94.2%\n`;
              customContent += `- 配送成本: ¥12.8/单\n`;
              customContent += `- 每公里成本: ¥2.3\n\n`;
            }
            
            if (processingConfig.summaryExtractFields?.includes('tracking')) {
              customContent += `### 路线优化分析\n\n`;
              customContent += `- 主要拥堵路段: 5个\n`;
              customContent += `- 平均配送距离: 8.5公里\n`;
              customContent += `- 配送密度: 3.2单/平方公里\n`;
              customContent += `- 最优时间窗口: 9:00-11:00, 14:00-16:00\n\n`;
            }
            
            customContent += `### 运力分析\n\n`;
            customContent += `- 车辆利用率: 76.5%\n`;
            customContent += `- 平均装载率: 82%\n`;
            customContent += `- 空驶率: 18.4%\n`;
            customContent += `- 高峰期运力缺口: 预计12%\n\n`;
            
            customContent += `### 改进建议\n\n`;
            customContent += `1. 优化线路规划，避开主要拥堵路段\n`;
            customContent += `2. 实施动态调度系统，提高车辆利用率\n`;
            customContent += `3. 调整配送时段，提高高峰期运力\n\n`;
          }
          else if (templateType === 'finance') {
            customTitle = '财务绩效分析';
            customContent = `## 财务健康度分析\n\n`;
            
            if (processingConfig.summaryExtractFields?.includes('revenue_sources')) {
              customContent += `### 收入结构分析\n\n`;
              customContent += `- 主营业务收入: ¥1,520,300 (82.2%)\n`;
              customContent += `- 技术服务收入: ¥280,320 (15.1%)\n`;
              customContent += `- 其他收入: ¥50,000 (2.7%)\n`;
              customContent += `- 增长最快业务线: 技术服务 (+28.5%)\n\n`;
            }
            
            if (processingConfig.summaryExtractFields?.includes('expense_categories')) {
              customContent += `### 成本结构分析\n\n`;
              customContent += `- 采购成本: ¥850,200 (70.1%)\n`;
              customContent += `- 人力成本: ¥220,360 (18.2%)\n`;
              customContent += `- 物流仓储: ¥95,420 (7.9%)\n`;
              customContent += `- 运营费用: ¥47,476 (3.8%)\n\n`;
            }
            
            if (processingConfig.summaryExtractFields?.includes('profit_margins')) {
              customContent += `### 利润与效率指标\n\n`;
              customContent += `- 毛利率: 44.1% (+2.3%)\n`;
              customContent += `- 净利率: 34.4% (+1.8%)\n`;
              customContent += `- ROI: 18.5%\n`;
              customContent += `- 运营资金周转率: 8.4次/年\n\n`;
            }
            
            customContent += `### 财务优化建议\n\n`;
            customContent += `1. 扩大技术服务业务，提高整体利润率\n`;
            customContent += `2. 优化采购策略，减少采购成本\n`;
            customContent += `3. 加速应收账款回收，提高现金流\n\n`;
          }
          else if (templateType === 'customer') {
            customTitle = '客户关系分析';
            customContent = `## 客户价值分析\n\n`;
            
            if (processingConfig.summaryExtractFields?.includes('contacts')) {
              customContent += `### 客户画像\n\n`;
              customContent += `- 企业客户占比: 68%\n`;
              customContent += `- 个人客户占比: 32%\n`;
              customContent += `- 高价值客户群: 15% (贡献收入: 62%)\n`;
              customContent += `- 新客户增长率: 18.5%\n\n`;
            }
            
            if (processingConfig.summaryExtractFields?.includes('preferences')) {
              customContent += `### 购买行为分析\n\n`;
              customContent += `- 平均客单价: ¥1,250\n`;
              customContent += `- 复购率: 73%\n`;
              customContent += `- 热销品类: 电子设备(42%), 办公用品(28%)\n`;
              customContent += `- 购买频率: 平均45天/次\n\n`;
            }
            
            if (processingConfig.summaryExtractFields?.includes('history')) {
              customContent += `### 客户互动情况\n\n`;
              customContent += `- 平均响应时间: 2.5小时\n`;
              customContent += `- 问题解决率: 92%\n`;
              customContent += `- 主要沟通渠道: 电话(45%), 在线聊天(38%)\n`;
              customContent += `- 客户满意度: 4.6/5.0\n\n`;
            }
            
            customContent += `### 客户关系优化建议\n\n`;
            customContent += `1. 针对高价值客户推出专属服务计划\n`;
            customContent += `2. 根据购买习惯优化产品推荐算法\n`;
            customContent += `3. 提升在线聊天响应速度，增强客户体验\n\n`;
          }
          else {
            // 通用分析模板
            customContent = `## 数据分析概览\n\n`;
            
            if (processingConfig.summaryLength) {
              customContent += `根据您设置的要求，本分析包含约${processingConfig.summaryLength}字的核心内容，`;
            }
            
            if (processingConfig.summaryExtractFields && processingConfig.summaryExtractFields.length > 0) {
              customContent += `重点关注了${processingConfig.summaryExtractFields.map(field => {
                const fieldMap: Record<string, string> = {
                  'dates': '时间维度',
                  'names': '名称实体',
                  'amounts': '数值金额',
                  'locations': '地理位置',
                  'status': '状态变化',
                  'main_ideas': '核心观点',
                  'action_items': '行动项目',
                  'requirements': '需求明细',
                  'concerns': '关注点',
                  'decisions': '决策依据'
                };
                return fieldMap[field] || field;
              }).join('、')}等关键维度。\n\n`;
            }
            
            customContent += `**数据源概览**：${dataSourceDesc}，分析了${selectedSourceIndexes.value.length}个数据源`;
            
            // 根据模型生成不同的分析声明
            if (processingConfig.model === 'gpt-4') {
              customContent += `，使用GPT-4模型进行了深度语义解析和数据挖掘。\n\n`;
            } else if (processingConfig.model === 'claude-3') {
              customContent += `，通过Claude-3模型进行了上下文理解和关联性分析。\n\n`;
            } else {
              customContent += `，并采用AI技术提取了关键信息和潜在模式。\n\n`;
            }
            
            customContent += `### 关键发现\n\n`;
            customContent += `1. 数据显示明显的周期性模式，周四和周五活动量最高\n`;
            customContent += `2. 近30天数据呈现上升趋势，增长率约15%\n`;
            customContent += `3. 主要影响因素：市场活动(38%)、季节性变化(26%)、产品更新(21%)\n`;
            customContent += `4. 异常点：6月15日数据峰值，与促销活动高度相关\n\n`;
            
            customContent += `### 预测与建议\n\n`;
            customContent += `- 根据当前趋势，预计下月增长12-17%\n`;
            customContent += `- 建议优化周一和周二的资源配置，提高整体效率\n`;
            customContent += `- 关注并分析数据异常点背后的成功因素，用于未来决策\n`;
            customContent += `- 需要进一步收集竞争对手数据进行对比分析\n\n`;
          }
          
          // 添加分析结尾
          customContent += `### 分析方法论\n\n`;
          customContent += `本分析采用了大数据统计与机器学习相结合的方法，通过对${selectedSourceIndexes.value.length}个数据源的多维度分析，提供了客观、全面的业务洞察。分析结果可能会随着新数据的导入而更新，建议定期复核。\n\n`;
          
          // 添加AI模型署名
          if (processingConfig.model === 'gpt-4') {
            customContent += `*分析由GPT-4高级分析模型生成 - ${new Date().toLocaleDateString()}*`;
          } else if (processingConfig.model === 'claude-3') {
            customContent += `*分析由Claude-3智能模型生成 - ${new Date().toLocaleDateString()}*`;
          } else {
            customContent += `*AI辅助分析报告 - ${new Date().toLocaleDateString()}*`;
          }
          
          return {
            type: 'summary',
            blocks: [
              {
                title: customTitle,
                content: customContent,
                note: '',
                showNoteInput: false,
                type: 'summary'
              }
            ]
          }
      }
    
    case 'key_points':
      if (processingConfig.templateId === 'key_points_order') {
        return {
          type: 'key_points',
          blocks: [
            {
              content: '订单号ORD2024061500123于2024-06-15 09:23:45创建，总金额¥12,350.00',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'order-point'
            },
            {
              content: '客户为上海智联科技有限公司，联系人张经理，要求工作日送货',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'order-point'
            },
            {
              content: '包含笔记本电脑2台、显示器3台、键盘5个，需要安排安装服务',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'order-point'
            },
            {
              content: '已从华东仓发货，承运商为顺丰速运，运单号SF1234567890',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'order-point'
            },
            {
              content: '预计送达日期为2024-06-17，客户已支付全款',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'order-point'
            }
          ]
        }
      } else if (processingConfig.templateId === 'key_points_warehouse') {
        return {
          type: 'key_points',
          blocks: [
            {
              content: '华东中心仓库存周转率为12.5天，库存健康度92%',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'warehouse-point'
            },
            {
              content: '总计1,250个SKU，库存总量25,680件，价值¥3,450,800',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'warehouse-point'
            },
            {
              content: '近7天入库1,890件，出库2,105件，库位利用率78%',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'warehouse-point'
            },
            {
              content: '15个SKU已达库存警戒线，需优先关注补货',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'warehouse-point'
            },
            {
              content: '电脑配件类23个SKU和办公用品类18个SKU需要补货',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'warehouse-point'
            }
          ]
        }
      } else if (processingConfig.templateId === 'financial_report') {
        return {
          type: 'key_points',
          blocks: [
            {
              content: '5月总收入¥1,850,620.00，净利润¥637,163.22，同比增长15.3%',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'finance-point'
            },
            {
              content: '产品销售占总收入82.2%，技术服务占15.1%',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'finance-point'
            },
            {
              content: '采购成本占总支出70.1%，人力成本占18.2%',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'finance-point'
            },
            {
              content: '毛利率44.1%，费用率23.5%，净利率34.4%',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'finance-point'
            },
            {
              content: '应收账款¥320,500.00，应付账款¥180,320.00，现金流状况良好',
              note: '',
              showNoteInput: false,
              type: 'key_point',
              extraClass: 'finance-point'
            }
          ]
        }
      } else {
        return {
          type: 'key_points',
          blocks: [
            {
              content: '知识处理是企业数字化转型的关键环节',
              note: '',
              showNoteInput: false,
              type: 'key_point'
            },
            {
              content: 'AI技术可以显著提升知识处理的效率和准确性',
              note: '',
              showNoteInput: false,
              type: 'key_point'
            },
            {
              content: '结构化的知识可以为多种业务场景提供支持',
              note: '',
              showNoteInput: false,
              type: 'key_point'
            },
            {
              content: '知识图谱是组织和展示复杂知识关系的有效方式',
              note: '',
              showNoteInput: false,
              type: 'key_point'
            }
          ]
        }
      }
      
    case 'qa':
      if (processingConfig.templateId === 'qa_order') {
        return {
          type: 'qa',
          blocks: [
            {
              title: '如何查询我的订单状态?',
              content: `您可以通过以下几种方式查询订单状态：
1. 登录官网/APP，在"我的订单"页面查看
2. 使用订单号在首页搜索框直接搜索
3. 通过订单确认邮件中的链接查询
4. 联系客服提供订单号查询

若您是企业客户，还可以：
- 登录企业采购平台查看订单状态
- 联系您的专属客户经理`,
              note: '',
              showNoteInput: false,
              type: 'question',
              extraClass: 'order-qa'
            },
            {
              title: '我可以修改已提交的订单吗?',
              content: `订单状态不同，可修改的内容也不同：
- 待支付状态：可修改收货地址、联系方式，取消订单
- 已支付未发货：可修改收货地址、联系方式，但无法取消订单
- 已发货：只能修改联系方式，无法修改地址或取消订单

修改方式：
- 在订单详情页点击"申请修改"按钮
- 联系在线客服
- 拨打客服热线400-888-8888

请注意：促销商品、预售商品和定制商品的订单修改可能受到限制`,
              note: '',
              showNoteInput: false,
              type: 'question',
              extraClass: 'order-qa'
            },
            {
              title: '订单支付后多久发货?',
              content: `正常情况下，订单支付成功后24小时内发货。特殊情况说明：
- 促销期间：可能延长至48小时内发货
- 预售商品：按照预售说明发货
- 定制商品：需要3-7个工作日
- 海外直邮商品：需要5-10个工作日

您可以在订单详情页查看预计发货时间。

系统会通过短信、APP推送等方式通知您发货状态。若超过承诺时间未发货，您可以联系客服查询原因。`,
              note: '',
              showNoteInput: false,
              type: 'question',
              extraClass: 'order-qa'
            }
          ]
        }
      } else if (processingConfig.templateId === 'qa_delivery') {
        return {
          type: 'qa',
          blocks: [
            {
              title: '你们支持哪些配送方式?',
              content: `我们目前支持以下配送方式：
1. 标准快递：全国覆盖，一般3-5天送达
2. 次日达：部分一线城市支持，需在16:00前下单
3. 同城急送：支持主要城市市区，最快2小时送达
4. 自提：可选择就近自提点，无需等待快递

各配送方式费用：
- 标准快递：订单满99元免运费，否则10元/单
- 次日达：20元/单
- 同城急送：30元起，按距离计费
- 自提：免运费

特殊区域（港澳台、海外、偏远地区）可能有额外配送费用和时间`,
              note: '',
              showNoteInput: false,
              type: 'question',
              extraClass: 'logistics-qa'
            },
            {
              title: '如何跟踪我的物流状态?',
              content: `跟踪物流状态的方法：
1. 登录账户，在"我的订单"中点击"查看物流"
2. 通过短信中的物流跟踪链接直接查看
3. 复制运单号到相应快递公司官网查询
4. 下载快递公司APP，输入运单号查询

物流状态更新频率：
- 包裹在运输过程中，物流信息一般每6-12小时更新一次
- 同城配送一般1-2小时更新一次

若物流状态48小时内未更新，可联系客服跟进处理`,
              note: '',
              showNoteInput: false,
              type: 'question',
              extraClass: 'logistics-qa'
            }
          ]
        }
      } else {
        return {
          type: 'qa',
          blocks: [
            {
              title: '什么是知识处理?',
              content: '知识处理是指对各种形式的信息进行分析、整理和转化的过程，使其成为结构化、可利用的知识资源。',
              note: '',
              showNoteInput: false,
              type: 'question'
            },
            {
              title: '为什么需要AI辅助知识处理?',
              content: 'AI辅助知识处理可以大幅提高效率，从海量信息中快速提取关键内容，识别模式和关系，并能根据上下文提供更准确的分析结果。',
              note: '',
              showNoteInput: false,
              type: 'question'
            },
            {
              title: '如何应用处理后的知识?',
              content: '处理后的知识可以应用于多种业务场景，如智能客服、自动化文档生成、决策支持系统、知识图谱构建等。',
              note: '',
              showNoteInput: false,
              type: 'question'
            }
          ]
        }
      }
    
    case 'workflow':
      if (processingConfig.templateId === 'workflow_order') {
        return {
          type: 'workflow',
          blocks: [
            {
              title: '订单处理流程',
              content: `graph TD;
A[客户下单] --> B{库存确认}
B -->|有库存| C[订单确认]
B -->|无库存| D[缺货处理]
D --> E[预订/采购]
E --> C
C --> F[支付处理]
F --> G{支付成功?}
G -->|是| H[仓库拣货]
G -->|否| I[支付异常处理]
I --> J[联系客户]
J --> F
H --> K[包装商品]
K --> L[物流交接]
L --> M[物流配送]
M --> N[客户签收]
N --> O{是否完成?}
O -->|是| P[订单完成]
O -->|否| Q[售后处理]
Q --> P`,
              note: '',
              showNoteInput: false,
              type: 'workflow'
            }
          ]
        }
      } else if (processingConfig.templateId === 'workflow_warehouse_in') {
        return {
          type: 'workflow',
          blocks: [
            {
              title: '入库上架流程',
              content: `graph TD;
A[收到入库通知] --> B[安排卸货区域]
B --> C[货物到达]
C --> D[卸货并清点]
D --> E{数量是否正确?}
E -->|是| F[质检]
E -->|否| G[异常记录]
G --> H[联系供应商]
H --> I[确认解决方案]
I --> F
F --> J{质检通过?}
J -->|是| K[分配库位]
J -->|否| L[退货/换货处理]
K --> M[商品上架]
M --> N[更新库存系统]
N --> O[入库完成]`,
              note: '',
              showNoteInput: false,
              type: 'workflow'
            }
          ]
        }
      } else {
        return {
          type: 'workflow',
          blocks: [
            {
              title: '流程图',
              content: `graph TD;
A[开始] --> B{是否已有数据源?};
B -->|是| C[选择数据源];
B -->|否| D[创建新数据源];
C --> E[选择处理方式];
D --> E;
E --> F[AI处理数据];
F --> G[修改和调整结果];
G --> H[应用到业务场景];
H --> I[结束];`,
              note: '',
              showNoteInput: false,
              type: 'workflow'
            }
          ]
        }
      }

    case 'compare':
      if (processingConfig.templateId === 'compare_order') {
        return {
          type: 'compare',
          blocks: [
            {
              title: '订单数据对比分析',
              content: '对比了2024年1季度与2023年同期的订单数据，发现了以下关键差异和趋势：',
              note: '',
              showNoteInput: false,
              type: 'compare_summary'
            },
            {
              title: '主要增长点',
              content: '1. 电子产品类订单量增长32%，尤其是笔记本电脑和显示器\n2. 企业客户订单金额增加45%，成为增长主力\n3. 次日达配送订单比例从12%提升至28%\n4. 移动端下单比例从45%提升至62%',
              note: '',
              showNoteInput: false,
              type: 'differences'
            },
            {
              title: '主要下降点',
              content: '1. 办公耗材类订单量下降10%，尤其是打印耗材\n2. 小额订单(500元以下)数量减少15%\n3. 标准配送订单比例从76%下降至58%\n4. 电话下单比例从15%下降至6%',
              note: '',
              showNoteInput: false,
              type: 'differences'
            }
          ]
        }
      } else {
        return {
          type: 'compare',
          blocks: [
            {
              title: '内容对比分析',
              content: '通过对选定数据源的内容进行对比分析，我们发现了以下差异和相似点...',
              note: '',
              showNoteInput: false,
              type: 'compare_summary'
            },
            {
              title: '主要差异',
              content: '1. 文档A强调流程的自动化，而文档B更关注人工干预和控制\n2. 文档A包含更多技术细节，文档B则侧重业务价值\n3. 文档A的适用范围更广，文档B则针对特定场景',
              note: '',
              showNoteInput: false,
              type: 'differences'
            },
            {
              title: '共同点',
              content: '1. 两份文档都强调了数据质量的重要性\n2. 都提到了流程优化的必要步骤\n3. 都包含了实施建议和最佳实践',
              note: '',
              showNoteInput: false,
              type: 'similarities'
            }
          ]
        }
      }
    
    default:
      return {
        type: mode,
        blocks: [
          {
            content: `这是${getProcessingModeName(mode)}处理的结果`,
            note: '',
            showNoteInput: false
          }
        ]
      }
  }
}

const updateProcessingStats = () => {
  processingTime.value = Math.floor(Math.random() * 2000) + 1000 // 1000-3000ms之间
  analysisConfidence.value = Math.floor(Math.random() * 15) + 80 // 80-95%之间
  
  // 更新知识表单
  if (aiResponse.value) {
    knowledgeForm.title = `${getProcessingModeName(processingConfig.mode)}：${sources.value[selectedSourceIndexes.value[0]]?.name || '未命名'}`
    
    // 根据处理类型生成标签
    knowledgeForm.tags = [
      getProcessingModeName(processingConfig.mode),
      'AI生成',
      processingConfig.model
    ]
  }
}

// 流程图相关方法
const generateWorkflowNodes = () => {
  // 解析mermaid流程图代码，提取节点信息
  if (aiResponse.value?.type === 'workflow' && aiResponse.value.blocks.length > 0) {
    const mermaidCode = aiResponse.value.blocks[0].content
    
    // 简单解析（实际项目中可能需要更复杂的解析逻辑）
    const nodeRegex = /([A-Za-z0-9]+)\[(.*?)\]/g
    const edgeRegex = /([A-Za-z0-9]+)\s*-->\s*([A-Za-z0-9]+)/g
    
    const nodes: WorkflowNode[] = []
    let match
    
    // 提取节点
    while ((match = nodeRegex.exec(mermaidCode)) !== null) {
      nodes.push({
        id: match[1],
        type: 'process',
        label: match[2]
      })
    }
    
    workflowNodes.value = nodes
  }
}

const zoomIn = () => {
  // 实际项目中这里会操作DOM缩放流程图
  ElMessage.info('放大流程图')
}

const zoomOut = () => {
  // 实际项目中这里会操作DOM缩小流程图
  ElMessage.info('缩小流程图')
}

const resetZoom = () => {
  // 实际项目中这里会重置流程图缩放
  ElMessage.info('重置流程图缩放')
}

const exportWorkflow = () => {
  // 实际项目中这里会导出流程图为图片或其他格式
  ElMessage.success('流程图已导出')
}

const editNode = (node: WorkflowNode) => {
  ElMessageBox.prompt('编辑节点标签', '编辑节点', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: node.label
  }).then(({ value }) => {
    node.label = value
    ElMessage.success('节点已更新')
  }).catch(() => {
    // 用户取消
  })
}

const getNodeTypeStyle = (type: string) => {
  const styleMap: Record<string, string> = {
    'start': 'success',
    'process': '',
    'decision': 'warning',
    'end': 'danger'
  }
  return styleMap[type] || ''
}

const getNodeTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    'start': '开始',
    'process': '处理',
    'decision': '决策',
    'end': '结束'
  }
  return textMap[type] || type
}

// 结果展示相关方法
const getResultTypeStyle = (type: string) => {
  const styleMap: Record<string, string> = {
    'summary': 'info',
    'qa': 'success',
    'key_points': 'warning',
    'workflow': 'primary',
    'compare': ''
  }
  return styleMap[type] || ''
}

const getResultTypeName = (type: string) => {
  return getProcessingModeName(type as ProcessingMode)
}

const formatTime = (ms: number) => {
  if (ms < 1000) {
    return `${ms}ms`
  } else {
    return `${(ms / 1000).toFixed(2)}s`
  }
}

const expandAllBlocks = () => {
  // 实际项目中这里会展开所有内容块
  ElMessage.info('已展开所有内容块')
}

const collapseAllBlocks = () => {
  // 实际项目中这里会折叠所有内容块
  ElMessage.info('已折叠所有内容块')
}

const refreshAnalysis = () => {
  processContent()
}

// 内容块操作方法
const toggleBlockImportance = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    aiResponse.value.blocks[index].isImportant = !aiResponse.value.blocks[index].isImportant
  }
}

const toggleBlockEdit = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    const block = aiResponse.value.blocks[index]
    block.showEdit = !block.showEdit
    
    if (block.showEdit) {
      block.editContent = block.content
    }
  }
}

const toggleBlockNote = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    aiResponse.value.blocks[index].showNoteInput = !aiResponse.value.blocks[index].showNoteInput
  }
}

const toggleBlockExclusion = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    aiResponse.value.blocks[index].excluded = !aiResponse.value.blocks[index].excluded
  }
}

const saveBlockEdit = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    const block = aiResponse.value.blocks[index]
    if (block.editContent) {
      block.content = block.editContent
    }
    block.showEdit = false
  }
}

const cancelBlockEdit = (index: number) => {
  if (aiResponse.value && aiResponse.value.blocks[index]) {
    aiResponse.value.blocks[index].showEdit = false
  }
}

// 聊天相关方法
const sendMessage = () => {
  if (!userMessage.value.trim()) {
    return
  }
  
  // 添加用户消息
  const userMsg: Message = {
    id: uuidv4(),
    type: 'user',
    content: userMessage.value,
    timestamp: Date.now()
  }
  
  chatHistory.value.push(userMsg)
  
  // 清空输入框
  const tempMessage = userMessage.value
  userMessage.value = ''
  
  // 设置加载状态
  chatLoading.value = true
  
  // 模拟AI回复
  setTimeout(() => {
    let aiResponse: string
    
    // 简单的回复逻辑
    if (tempMessage.includes('分析') || tempMessage.includes('结果')) {
      aiResponse = '我已经分析了您提供的数据，结果显示主要包含了关于流程优化和知识管理的内容。您可以在右侧预览面板查看详细的分析结果。'
    } else if (tempMessage.includes('修改') || tempMessage.includes('编辑')) {
      aiResponse = '您可以直接点击内容块右上角的编辑按钮来修改内容，或者告诉我您想要如何修改，我可以帮您生成新的内容。'
    } else if (tempMessage.includes('保存') || tempMessage.includes('导出')) {
      aiResponse = '您可以在右侧预览面板中设置知识标题、标签和权限，然后点击"保存知识"按钮将内容保存到知识库。也可以点击"下载"按钮导出为文件。'
    } else if (tempMessage.includes('应用') || tempMessage.includes('业务')) {
      aiResponse = '在右侧"应用"选项卡中，您可以将处理后的内容应用到各种业务场景，如智能客服、合同生成、订单生成等。'
    } else {
      aiResponse = '我理解您的问题。您可以通过左侧面板选择数据源和处理方式，点击"开始处理"后，我会为您分析内容并生成结果。您还可以通过聊天方式告诉我您的具体需求。'
    }
    
    // 添加AI回复
    const aiMsg: Message = {
      id: uuidv4(),
      type: 'ai',
      content: aiResponse,
      timestamp: Date.now()
    }
    
    chatHistory.value.push(aiMsg)
    chatLoading.value = false
    
    // 滚动到底部
    nextTick(() => {
      if (chatMessagesContainer.value) {
        chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
      }
    })
  }, 1000)
}

const clearChat = () => {
  ElMessageBox.confirm('确定要清空所有对话记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    chatHistory.value = []
    ElMessage.success('对话已清空')
  }).catch(() => {
    // 用户取消
  })
}

const formatMessageTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const copyMessageToClipboard = (message: Message) => {
  navigator.clipboard.writeText(message.content)
    .then(() => {
      ElMessage.success('已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}

const applyMessageToAnalysis = (message: Message) => {
  // 这里通常会将AI消息应用到分析结果
  ElMessage.success('已应用AI建议')
}

// 标签管理
const showTagInput = () => {
  inputTagVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
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
  knowledgeForm.tags = knowledgeForm.tags.filter(t => t !== tag)
}

// 知识保存相关方法
const saveKnowledge = async () => {
  if (!knowledgeForm.title) {
    ElMessage.warning('请输入知识标题')
    return
  }
  
  saving.value = true
  
  try {
    // 构造知识对象
    const knowledge = {
      id: uuidv4(),
      title: knowledgeForm.title,
      content: generatedContent.value,
      type: processingConfig.mode,
      tags: knowledgeForm.tags,
      visibility: knowledgeForm.visibility,
      createTime: new Date().toISOString(),
      creator: 'current-user'
    }
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('知识保存成功')
    console.log('保存的知识:', knowledge)
    
    // 可以选择跳转到知识中心
    // router.push('/knowledge-base/knowledge-center')
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}

const downloadKnowledge = () => {
  if (!generatedContent.value) {
    ElMessage.warning('没有内容可下载')
    return
  }
  
  // 创建下载链接
  const blob = new Blob([generatedContent.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${knowledgeForm.title || '知识内容'}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('下载成功')
}

// 应用场景相关方法
const showApplicationModal = (appType: ApplicationType) => {
  currentApplication.value = appType
  applicationDialogVisible.value = true
}

const getApplicationTitle = (appType: ApplicationType | null) => {
  if (!appType) return ''
  
  const titleMap: Record<ApplicationType, string> = {
    'customer_service': '智能客服',
    'contract': '合同生成',
    'order': '订单生成',
    'purchase': '采购单',
    'customs': '报关',
    'knowledge_graph': '知识图谱'
  }
  
  return titleMap[appType] || '应用'
}

const applyToApplication = async () => {
  if (!currentApplication.value || !aiResponse.value) {
    return
  }
  
  applying.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    ElMessage.success(`已成功应用到${getApplicationTitle(currentApplication.value)}`)
    applicationDialogVisible.value = false
    
    // 根据应用类型执行不同操作
    console.log(`已应用到: ${currentApplication.value}`, {
      content: generatedContent.value,
      type: aiResponse.value.type,
      applicationConfig: currentApplication.value === 'customer_service' 
        ? customerServiceForm 
        : currentApplication.value === 'contract'
        ? contractForm
        : {}
    })
  } catch (error) {
    ElMessage.error('应用失败')
    console.error('应用失败:', error)
  } finally {
    applying.value = false
  }
}

// 页面初始化
onMounted(() => {
  // 在这里可以加载初始数据或进行其他初始化操作
  // 模拟添加一些示例数据源
  sources.value = [
    {
      id: '1',
      name: '产品开发流程文档',
      type: 'manual',
      content: '产品开发流程包括需求收集、需求分析、设计、开发、测试和发布几个关键阶段。每个阶段都有特定的目标和交付物。\n\n需求收集阶段需要与stakeholders充分沟通，确保理解业务需求。需求分析阶段需要细化需求，形成产品规格说明书。设计阶段包括UI设计和技术架构设计。开发阶段是实现功能的过程。测试阶段需要进行功能测试、性能测试和用户体验测试。发布阶段需要准备发布计划和上线检查清单。'
    },
    {
      id: '2',
      name: '客户服务标准手册',
      type: 'file',
      content: '客户服务标准手册详细规定了客户服务的各项标准和处理流程，确保服务质量的一致性和高效性。\n\n服务态度标准：保持积极友好的态度，使用礼貌用语，展现专业形象。\n\n响应时间标准：电话3铃内接听，邮件4小时内回复，投诉24小时内解决。\n\n服务流程标准：包括问候、需求确认、问题解决、满意度确认四个步骤。\n\n异常处理标准：对于复杂问题，需在承诺时间内给予反馈，并保持与客户的沟通。'
    }
  ]
})

// 添加一些基本的样式

// 删除自定义模板
const deleteUserTemplate = (templateId: string, mode: ProcessingMode) => {
  try {
    ElMessageBox.confirm('确定要删除此模板吗？此操作不可恢复。', '提示', {
      type: 'warning'
    }).then(() => {
      // 找到并删除模板
      const index = userTemplates[mode].findIndex(t => t.id === templateId);
      if (index !== -1) {
        userTemplates[mode].splice(index, 1);
        ElMessage.success('模板已删除');
      }
    });
  } catch {
    // 用户取消删除
  }
}

const getTemplateNameById = (templateId: string) => {
  if (!templateId || templateId === 'none') return '默认'
  
  // 业务场景模板
  const businessTemplates: Record<string, string> = {
    'warehouse_management': '仓储管理',
    'logistics_delivery': '物流配送',
    'inventory_management': '库存管理',
    'product_management': '商品管理',
    'order_management': '订单管理',
    'after_sales': '售后服务',
    'customer_experience': '客户体验',
    'return_management': '退货管理',
    'customer_profile': '客户资料',
    'membership_management': '会员管理',
    'customer_relationship': '客户关系',
    'customer_service': '客户服务',
    'financial_report': '财务报表',
    'cost_analysis': '成本分析',
    'income_record': '收入记录',
    'expense_management': '费用管理',
    'order_summary': '订单摘要',
    'warehouse_summary': '仓储摘要',
    'logistics_summary': '物流摘要',
    'finance_summary': '财务摘要',
    'customer_summary': '客户摘要',
    'qa_order': '订单问答',
    'qa_delivery': '物流问答',
    'key_points_order': '订单关键点',
    'key_points_warehouse': '仓储关键点',
    'workflow_order': '订单流程'
  }
  
  if (businessTemplates[templateId]) {
    return businessTemplates[templateId]
  }
  
  // 自定义模板
  if (templateId.startsWith('custom_')) {
    for (const mode in userTemplates) {
      const template = userTemplates[mode].find(t => t.id === templateId)
      if (template) {
        return template.name
      }
    }
  }
  
  return templateId
}
</script>

<style lang="scss" scoped>
.enhanced-knowledge-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .back-button-container {
    margin-bottom: 16px;
  }
  
  .editor-layout {
    display: flex;
    gap: 20px;
    height: calc(100vh - 100px);
    
    .editor-left-panel {
      width: 320px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 0;
      overflow-y: auto;
      
      .panel-section {
        background: rgba(32, 33, 36, 0.95);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
          margin-bottom: 16px;
        
        h3 {
          margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #6366f1;
          }
        }
        
        .source-list {
          margin-bottom: 8px;
          
          .source-item {
            border-radius: 8px;
            padding: 10px 12px;
            margin-bottom: 8px;
            transition: all 0.2s;
          cursor: pointer;
            border: 1px solid rgba(235, 235, 235, 0.08);
          
          &:hover {
              background: rgba(95, 99, 242, 0.08);
          }
          
          &.active {
              background: rgba(95, 99, 242, 0.12);
              border-color: rgba(95, 99, 242, 0.3);
      }
      
        .source-info {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .source-name {
            flex: 1;
                font-weight: 500;
          }
          
          .source-type {
            font-size: 12px;
                opacity: 0.7;
                background: rgba(95, 99, 242, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
              }
            }
          }
        }
      }
      
      .processing-mode-group {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        width: 100%;
        margin-bottom: 16px;
        
        .el-radio-button {
          --el-radio-button-checked-bg-color: #6366f1;
          --el-radio-button-checked-text-color: white;
          --el-radio-button-checked-border-color: #6366f1;
          
          :deep(.el-radio-button__inner) {
            border-radius: 8px;
            padding: 10px 0;
            width: 100%;
            border: 1px solid rgba(235, 235, 235, 0.1);
            background: rgba(32, 33, 36, 0.5);
            
            &:hover {
              background: rgba(95, 99, 242, 0.08);
            }
          }
          
          &.is-active {
            :deep(.el-radio-button__inner) {
              background: linear-gradient(45deg, #5f63f2, #7367f0);
              box-shadow: 0 2px 6px rgba(95, 99, 242, 0.3);
            }
          }
        
        .mode-button-content {
          display: flex;
          flex-direction: column;
          align-items: center;
            gap: 6px;
            
            .el-icon {
              font-size: 20px;
            }
          }
        }
      }
      
      .template-selector {
        width: 100%;
        margin-bottom: 12px;
        
        :deep(.el-input__wrapper) {
          background: rgba(32, 33, 36, 0.5);
          border-radius: 8px;
          box-shadow: 0 0 0 1px rgba(235, 235, 235, 0.1);
          
          &.is-focus {
            box-shadow: 0 0 0 1px #6366f1;
          }
        }
      }
      
      .dynamic-config-area {
        max-height: none;
        overflow-y: visible;
        padding: 0 4px;
        margin-bottom: 16px;
        
        :deep(.el-form-item__label) {
          color: #e0e0e0;
          font-weight: 500;
          font-size: 14px;
        }
        
        :deep(.el-checkbox__label) {
          color: #e0e0e0;
        }
        
        :deep(.el-checkbox.is-checked .el-checkbox__label) {
          color: #6366f1;
        }
        
        :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
          background-color: #6366f1;
          border-color: #6366f1;
        }
        
        :deep(.el-switch.is-checked .el-switch__core) {
          background-color: #6366f1;
          border-color: #6366f1;
        }
        
        :deep(.el-slider__runway) {
          background-color: rgba(235, 235, 235, 0.1);
        }
        
        :deep(.el-slider__bar) {
          background-color: #6366f1;
        }
        
        :deep(.el-slider__button) {
          border-color: #6366f1;
        }
      }
      
      .action-buttons {
        display: flex;
        justify-content: center;
        padding-top: 12px;
        
        .el-button--primary {
          width: 90%;
          background: linear-gradient(45deg, #5f63f2, #7367f0);
        border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 16px;
          box-shadow: 0 3px 8px rgba(95, 99, 242, 0.25);
          
          &:hover {
            background: linear-gradient(45deg, #4f52d9, #6354e0);
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(95, 99, 242, 0.3);
          }
        }
        
        .el-button {
          border-radius: 8px;
          padding: 10px 16px;
          font-weight: 500;
        }
      }
    }
    
    .editor-middle-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: rgba(32, 33, 36, 0.95);
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid rgba(235, 235, 235, 0.1);
        
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #6366f1;
        }
      }
      
      .ai-processing-area {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        
        .analysis-result {
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
            background: rgba(95, 99, 242, 0.08);
            padding: 12px 16px;
            border-radius: 10px;
            border: 1px solid rgba(95, 99, 242, 0.15);
          
          .result-type {
            display: flex;
            align-items: center;
            gap: 12px;
              
              .el-tag {
                font-size: 14px;
                padding: 6px 12px;
                font-weight: 500;
                
                &.el-tag--info {
                  background: linear-gradient(45deg, #5f63f2, #7367f0);
                  color: white;
                  border: none;
                }
                
                &.el-tag--success {
                  background: linear-gradient(45deg, #36d1dc, #5b86e5);
                  color: white;
                  border: none;
                }
                
                &.el-tag--warning {
                  background: linear-gradient(45deg, #ff9a44, #fc6076);
                  color: white;
                  border: none;
                }
                
                &.el-tag--primary {
                  background: linear-gradient(45deg, #4a00e0, #8e2de2);
                  color: white;
                  border: none;
                }
              }
            
            .analysis-stats {
              display: flex;
                gap: 16px;
              
              .confidence, .processing-time {
                display: flex;
                align-items: center;
                gap: 4px;
                  color: #e0e0e0;
                  font-size: 13px;
                  
                  .el-icon {
                    color: #6366f1;
                  }
                }
              }
            }
          }
          
          .result-content {
            // 不同处理模式的特定样式
            
            // 摘要模式样式
            .blocks-container {
              display: flex;
              flex-direction: column;
              gap: 20px;
        
        .ai-block {
                background: rgba(48, 49, 52, 0.6);
                border-radius: 10px;
          padding: 16px;
                transition: all 0.3s;
                border-left: 4px solid transparent;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                
                &:hover {
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                  background: rgba(48, 49, 52, 0.8);
                }
          
          &.is-important {
                  border-left: 4px solid #ff9a44;
                  background: rgba(255, 154, 68, 0.05);
          }
          
          &.is-excluded {
            opacity: 0.5;
          }
          
          .block-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
                  margin-bottom: 16px;
            
            .block-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-weight: bold;
                    font-size: 16px;
                    color: #e0e0e0;
              
              .el-tag {
                font-weight: normal;
                      font-size: 12px;
                      padding: 2px 6px;
                      border-radius: 4px;
                    }
                  }
                  
                  .block-actions {
                    .el-button-group {
                      .el-button {
                        border-color: rgba(235, 235, 235, 0.1);
                        background: rgba(32, 33, 36, 0.5);
                        
                        &:hover {
                          background: rgba(95, 99, 242, 0.08);
                        }
                        
                        &.el-button--warning {
                          color: #ff9a44;
                          background: rgba(255, 154, 68, 0.1);
                        }
                        
                        &.el-button--primary {
                          color: #6366f1;
                          background: rgba(99, 102, 241, 0.1);
                        }
                        
                        &.el-button--success {
                          color: #36d1dc;
                          background: rgba(54, 209, 220, 0.1);
                        }
                        
                        &.el-button--danger {
                          color: #fc6076;
                          background: rgba(252, 96, 118, 0.1);
                        }
                      }
              }
            }
          }
          
          .block-content {
                  line-height: 1.8;
            white-space: pre-line;
                  color: #e0e0e0;
                  font-size: 14px;
                }
                
                // 为不同类型的模板定制显示样式
                &[data-type="order_summary"], &[data-type="warehouse_summary"],
                &[data-type="logistics_summary"], &[data-type="finance_summary"],
                &[data-type="customer_summary"] {
                  .block-content {
                    font-family: 'Courier New', monospace;
                    background: rgba(48, 49, 52, 0.3);
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid rgba(235, 235, 235, 0.05);
                  }
                }
                
                &[data-type="key_point"] {
                  padding-left: 16px;
                  border-left: 4px solid #36d1dc;
                  
                  .block-content {
                    font-weight: 500;
                    position: relative;
                    padding-left: 28px;
                    
                    &::before {
                      content: '';
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 20px;
                      height: 20px;
                      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2336d1dc"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/></svg>') no-repeat center;
                    }
                  }
                  
                  // 不同类型的关键点可以有不同的图标和颜色
                  &.order-point {
                    border-left-color: #7367f0;
                    
                    .block-content::before {
                      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%237367f0"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/></svg>') no-repeat center;
                    }
                  }
                }
                
                &[data-type="question"] {
                  .block-title {
                    color: #ff9a44;
                    font-size: 17px;
                  }
                  
                  .block-content {
                    background: rgba(48, 49, 52, 0.3);
                    padding: 12px;
                    border-radius: 6px;
                    margin-top: 8px;
                  }
          }
          
          .block-edit {
                  margin-bottom: 16px;
            
            .edit-actions {
              display: flex;
              justify-content: flex-end;
              gap: 8px;
                    margin-top: 12px;
            }
          }
          
          .block-note {
                  background: rgba(54, 209, 220, 0.05);
                  border-radius: 6px;
                  padding: 12px;
                  margin-top: 16px;
                  border: 1px solid rgba(54, 209, 220, 0.1);
            
            .note-content {
              display: flex;
              align-items: flex-start;
              gap: 8px;
                    color: #e0e0e0;
                    
                    .el-icon {
                      color: #36d1dc;
                    }
              
              span {
                flex: 1;
              }
            }
            
            .note-actions {
              display: flex;
              justify-content: flex-end;
                    margin-top: 12px;
                  }
            }
          }
        }
        
            // 流程图可视化样式
        .workflow-visualization {
          .workflow-controls {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
                
                .el-button-group {
                  .el-button {
                    background: rgba(32, 33, 36, 0.5);
                    border-color: rgba(235, 235, 235, 0.1);
                    
                    &:hover {
                      background: rgba(95, 99, 242, 0.08);
                    }
                  }
                }
          }
          
          .mermaid-wrapper {
                background: rgba(48, 49, 52, 0.6);
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
            min-height: 300px;
                border: 1px solid rgba(235, 235, 235, 0.05);
                
                // 定制mermaid流程图样式
                :deep(.node) {
                  fill: rgba(95, 99, 242, 0.1);
                  stroke: #6366f1;
                  
                  &.decision rect {
                    fill: rgba(255, 154, 68, 0.1);
                    stroke: #ff9a44;
                  }
                  
                  &.start rect, &.end rect {
                    fill: rgba(54, 209, 220, 0.1);
                    stroke: #36d1dc;
                  }
                  
                  text {
                    fill: #e0e0e0;
                  }
                }
                
                :deep(.edgeLabel) {
                  background-color: rgba(32, 33, 36, 0.7);
                  color: #e0e0e0;
                }
                
                :deep(.edgePath) {
                  stroke: rgba(235, 235, 235, 0.3);
                  
                  marker {
                    fill: rgba(235, 235, 235, 0.3);
                  }
                }
          }
          
          .workflow-nodes-list {
            h4 {
              margin-top: 0;
                  margin-bottom: 16px;
                  color: #e0e0e0;
                  font-size: 16px;
                }
                
                :deep(.el-table) {
                  background: transparent;
                  
                  .el-table__header-wrapper th {
                    background: rgba(32, 33, 36, 0.8);
                    color: #e0e0e0;
                  }
                  
                  .el-table__row {
                    background: rgba(48, 49, 52, 0.6);
                    color: #e0e0e0;
                    
                    td {
                      border-bottom: 1px solid rgba(235, 235, 235, 0.05);
                    }
                  }
                }
              }
            }
          }
        }
        
        // 空状态和加载状态样式
        .empty-analysis-state, .analyzing-placeholder {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 400px;
          
          :deep(.el-empty__image) {
            display: none;
          }
          
          .empty-icon {
            font-size: 64px;
            color: rgba(95, 99, 242, 0.3);
            margin-bottom: 24px;
          }
          
          .empty-description {
            text-align: center;
            color: #e0e0e0;
            max-width: 300px;
            margin: 0 auto 24px;
            line-height: 1.6;
            
            p {
              margin: 8px 0;
            }
          }
          
          .is-loading {
            font-size: 64px;
            color: #6366f1;
            margin-bottom: 24px;
          }
          
          p {
            color: #e0e0e0;
            margin-bottom: 24px;
            font-size: 16px;
          }
          
          :deep(.el-progress-circle) {
            --el-color-primary: #6366f1;
          }
          
          .el-button--primary {
            background: linear-gradient(45deg, #5f63f2, #7367f0);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            
            &:hover {
              background: linear-gradient(45deg, #4f52d9, #6354e0);
              transform: translateY(-1px);
            }
          }
        }
      }
      
      // AI聊天区域样式
      .ai-chat-area {
        border-top: 1px solid rgba(235, 235, 235, 0.1);
        padding: 16px;
        display: flex;
        flex-direction: column;
        height: 300px;
        background: rgba(32, 33, 36, 0.3);
        
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          
          h4 {
            margin: 0;
            color: #e0e0e0;
            font-weight: 500;
          }
          
          .el-button-group {
            .el-button {
              background: rgba(32, 33, 36, 0.5);
              border-color: rgba(235, 235, 235, 0.1);
              color: #e0e0e0;
              
              &:hover {
                background: rgba(95, 99, 242, 0.08);
              }
            }
          }
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          
          .chat-message {
            display: flex;
            max-width: 80%;
            
            &.user-message {
              flex-direction: row-reverse;
              align-self: flex-end;
              
              .message-content {
                background: rgba(95, 99, 242, 0.15);
                border-radius: 12px 2px 12px 12px;
                color: #e0e0e0;
              }
            }
            
            &.ai-message {
              align-self: flex-start;
              
              .message-content {
                background: rgba(48, 49, 52, 0.6);
                border-radius: 2px 12px 12px 12px;
                color: #e0e0e0;
              }
            }
            
            .message-avatar {
              margin: 0 8px;
              
              :deep(.el-avatar) {
                background-color: #6366f1;
                
                &.is-icon {
                  .el-avatar__icon {
                    font-size: 18px;
                  }
                }
              }
            }
            
            .message-content {
              padding: 12px 16px;
              position: relative;
              line-height: 1.6;
              font-size: 14px;
              
              .message-time {
                font-size: 12px;
                color: rgba(224, 224, 224, 0.5);
                margin-top: 8px;
                text-align: right;
              }
            }
            
            .message-actions {
              margin-left: 8px;
              align-self: flex-start;
              opacity: 0;
              transition: opacity 0.3s;
              
              .el-button {
                background: rgba(32, 33, 36, 0.5);
                border-color: rgba(235, 235, 235, 0.1);
                color: #e0e0e0;
                padding: 6px;
                
                &:hover {
                  background: rgba(95, 99, 242, 0.08);
                }
              }
            }
            
            &:hover .message-actions {
              opacity: 1;
            }
          }
        }
        
        .chat-input {
          .el-textarea {
            :deep(.el-textarea__inner) {
              background: rgba(48, 49, 52, 0.6);
              border: 1px solid rgba(235, 235, 235, 0.1);
              border-radius: 8px;
              color: #e0e0e0;
              
              &:focus {
                border-color: #6366f1;
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
              }
            }
          }
          
          .input-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 12px;
            
            .input-tip {
              font-size: 12px;
              color: rgba(224, 224, 224, 0.5);
            }
            
            .el-button {
              background: linear-gradient(45deg, #5f63f2, #7367f0);
              border: none;
              border-radius: 8px;
              color: white;
              padding: 10px 16px;
              font-weight: 500;
              
              &:hover {
                background: linear-gradient(45deg, #4f52d9, #6354e0);
                transform: translateY(-1px);
              }
                
                .el-icon {
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
    
    .editor-right-panel {
      width: 280px;
      min-width: 250px;
          display: flex;
          flex-direction: column;
    }
  }
}

.template-selector {
  width: 100%;
  margin-bottom: 12px;
}

.template-selector-container {
  margin-bottom: 16px;
  position: relative;
}

.template-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.disabled-link {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-templates {
  margin-top: 12px;
  
  h4 {
    font-size: 14px;
    margin: 0 0 8px 0;
    color: var(--el-text-color-secondary);
    padding-left: 8px;
  }
}

.template-uploader {
  width: 100%;
  
  .el-upload {
    width: 100%;
  }
  
  .el-upload-dragger {
    width: 100%;
  }
}

.processing-config {
  margin-bottom: 16px;
  
  .panel-header {
    margin-bottom: 10px;
  }
  
  .dynamic-config-area {
    max-height: 300px;
    overflow-y: auto;
    padding: 0 8px;
    margin-bottom: 10px;
    
    .el-form-item {
      margin-bottom: 16px;
    }
  }
  
  .action-buttons {
    padding-top: 8px;
    border-top: 1px solid var(--el-border-color-darker);
  }
}

.template-selector {
  width: 100%;
  margin-bottom: 12px;
}

.back-button-container {
  margin-bottom: 16px;
}
</style> 