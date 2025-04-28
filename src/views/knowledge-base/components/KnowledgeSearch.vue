<template>
  <div class="knowledge-search-container">
    <!-- 侧边栏抽屉 -->
    <el-drawer
      v-model="showSidebar"
      title="历史会话"
      direction="rtl"
      size="300px"
      :modal="false"
      :with-header="false"
      custom-class="chat-sidebar"
    >
      <div class="sidebar-content">
        <div class="sidebar-header">
          <h3>历史会话</h3>
          <el-button 
            type="danger" 
            plain 
            size="small"
            @click="clearHistory"
            v-if="chatHistory.length > 0"
          >
            清空全部历史
                </el-button>
          </div>
        <div class="history-list">
          <div 
            v-for="chat in chatHistory" 
            :key="chat.id"
            class="history-item"
            :class="{ 'active': currentChat?.id === chat.id }"
            @click="loadChatHistory(chat)"
          >
            <div class="history-info">
              <div class="history-title">{{ chat.title }}</div>
              <div class="history-time">{{ formatDate(chat.timestamp) }}</div>
            </div>
            <div class="history-actions">
              <el-button 
                text 
                type="danger" 
                @click.stop="deleteHistory(chat.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
          </div>
              </div>
            </div>
              </div>
    </el-drawer>

    <div class="main-content">
      <div class="chat-panel">
        <!-- 顶部导航栏 -->
        <div class="nav-header">
          <div class="left-section">
            <el-button 
              v-if="conversation.length > 0"
              text 
              @click="backToWelcome"
            >
              <el-icon><Back /></el-icon>
              返回首页
            </el-button>
            <div v-if="conversation.length > 0" class="chat-title">
              <span v-if="!isEditingTitle" @click="startEditTitle">{{ currentChat?.title || '新对话' }}</span>
              <el-input
                v-else
                v-model="editingTitle"
                size="small"
                @blur="saveTitle"
                @keyup.enter="saveTitle"
                ref="titleInput"
              />
                </div>
              </div>
          <div class="right-section">
            <el-button text class="menu-btn" @click="showSidebar = !showSidebar">
              <el-icon><Menu /></el-icon>
            </el-button>
          </div>
            </div>
            
        <!-- 聊天内容区域 -->
        <div class="chat-messages" ref="chatContainer">
          <div v-if="conversation.length === 0" class="welcome-message">
            <div class="welcome-content">
              <div class="welcome-header">
                <el-avatar 
                  :size="80"
                  class="ai-logo"
                  :icon="ChatLineRound"
                />
                <h3>智能知识助手</h3>
                <p class="welcome-desc">基于企业知识库的智能问答系统，为您提供精准答案</p>
                </div>
                </div>
              </div>
              
          <!-- 对话消息部分 -->
          <template v-else>
            <div
              v-for="(message, index) in conversation" 
              :key="index"
              :class="['message', message.type]"
            >
              <div class="message-header">
                <el-avatar 
                  :size="36"
                  :icon="message.type === 'answer' ? ChatLineRound : User"
                />
                <span class="sender-name">
                  {{ message.type === 'answer' ? 'AI助手' : '我' }}
                </span>
                    </div>
              <div class="message-content" v-html="formatMessage(message.content)" />
              <div class="no-knowledge-actions" v-if="message.type === 'answer' && (!hasKnowledgeBase || !isKnowledgeFound)">
                <button class="action-button" @click="useAIReply">
                  <el-icon><ChatRound /></el-icon>
                  使用AI回答
                </button>
                <button class="action-button" @click="addKnowledge">
                  <el-icon><Plus /></el-icon>
                  添加知识
                </button>
                  </div>
              <div class="message-footer">
                <div class="message-time">{{ formatDate(message.timestamp) }}</div>
                <div class="message-actions" v-if="message.type === 'answer'">
                  <el-button 
                    text 
                    size="small"
                    @click="copyAnswer(message.content)"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                    复制
                  </el-button>
                  <el-button 
                    text 
                    size="small"
                    @click="likeAnswer(message.id)"
                    :type="message.isLiked ? 'primary' : ''"
                  >
                    <el-icon><Pointer /></el-icon>
                    {{ message.isLiked ? '已赞' : '点赞' }}
                  </el-button>
              </div>
            </div>
                  </div>
          </template>
                </div>
                
        <!-- 快速问答部分 -->
        <div class="quick-qa" v-if="conversation.length === 0">
          <div class="section-title">快速问答</div>
                <div class="example-questions">
                    <div 
                      v-for="(question, index) in exampleQuestions" 
                      :key="index"
              class="example-question"
              @click="() => askExample(question)"
                    >
              <el-icon><ChatLineRound /></el-icon>
                      <span>{{ question }}</span>
                  </div>
                </div>
              </div>
              
        <!-- 统一的输入框区域 -->
        <div class="chat-input-container">
          <div class="input-toolbar">
            <div class="toolbar-buttons">
              <el-tooltip content="切换模型">
                <el-dropdown trigger="click" @command="handleModelChange">
                  <el-button text>
                    <el-icon><ChatRound /></el-icon>
                    {{ selectedModel === 'gpt-3.5-turbo' ? 'GPT-3.5' : selectedModel === 'deepseek-chat' ? 'Deepseek' : '通义千问' }}
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item 
                        v-for="model in availableModels"
                        :key="model.id"
                        :command="model.id"
                      >
                        {{ model.name }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
              <el-divider direction="vertical" />
              <el-tooltip content="上传文件">
                <el-upload
                  class="upload-button"
                  action="/api/upload"
                  :show-file-list="false"
                  :on-success="handleFileUpload"
                >
                  <el-button text>
                    <el-icon><Upload /></el-icon>
                  </el-button>
                </el-upload>
              </el-tooltip>
              <el-tooltip content="连接MCP服务">
                <el-button text @click="showMcpDialog = true">
                  <el-icon><Connection /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="AI设置">
                <el-button text @click="showSettings = true">
                  <el-icon><Setting /></el-icon>
                </el-button>
              </el-tooltip>
                        </div>
                      </div>
          <div class="input-wrapper">
            <div class="input-area">
              <el-input
                v-model="questionInput"
                type="textarea"
                :rows="3"
                placeholder="有问题，尽管问，shift+enter换行"
                resize="none"
                @keydown.enter.exact.prevent="sendQuestion"
                @keydown.enter.shift.exact="newline"
              />
                    </div>
            <div class="input-footer">
              <div class="left-actions">
                <el-button 
                  v-if="conversation.length > 0"
                  text
                  type="danger"
                  @click="clearConversation"
                >
                  <el-icon><Delete /></el-icon>
                  清空会话
                </el-button>
                <el-button 
                  v-if="conversation.length > 1"
                  text
                  type="primary"
                  @click="createKnowledgeFromConversation"
                >
                  <el-icon><Document /></el-icon>
                  一键创建知识
                      </el-button>
                    </div>
              <div class="right-actions">
                <el-button
                  class="send-button"
                  type="primary"
                  :disabled="asking"
                  @click="sendQuestion"
                >
                  <el-icon><Position /></el-icon>
                </el-button>
                  </div>
                </div>
                  </div>
                    </div>
                  </div>
                </div>
            </div>
            
  <!-- AI设置抽屉 -->
  <el-drawer
    v-model="showSettings"
    title="AI助手设置"
    direction="rtl"
    size="400px"
  >
    <div class="settings-content">
      <div class="setting-section">
        <div class="section-title">选择AI模型</div>
        <el-select v-model="selectedModel" class="model-select">
          <el-option
            v-for="model in availableModels"
            :key="model.id"
            :label="model.name"
            :value="model.id"
          >
            <div class="model-option">
              <span>{{ model.name }}</span>
              <span class="model-desc">{{ model.description }}</span>
            </div>
          </el-option>
        </el-select>
      </div>
      
      <div class="setting-section">
        <div class="section-title">
          <span>系统提示词</span>
          <el-tooltip content="AI助手的角色设定，会影响回答的风格和内容">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
              <el-input
          v-model="systemPrompt"
                type="textarea"
          :rows="6"
          placeholder="设置AI助手的角色和行为指南..."
        />
              </div>

      <div class="setting-section">
        <div class="section-title">
          <span>温度设置</span>
          <el-tooltip content="较高的值会使输出更加随机，较低的值会使其更加集中和确定">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
            </div>
        <el-slider
          v-model="temperature"
          :min="0"
          :max="2"
          :step="0.1"
          show-input
        />
          </div>

      <div class="setting-section">
        <div class="section-title">
          <span>最大回复长度</span>
          <el-tooltip content="限制AI回复的最大字数">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
            </div>
        <el-input-number
          v-model="maxTokens"
          :min="100"
          :max="4000"
          :step="100"
        />
            </div>
            </div>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="resetSettings">恢复默认</el-button>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </div>
    </template>
  </el-drawer>

  <!-- MCP服务连接对话框 -->
  <el-dialog
    v-model="showMcpDialog"
    title="连接MCP服务"
    width="500px"
  >
    <div class="mcp-services">
      <div class="service-list">
        <div 
          v-for="service in mcpServices" 
          :key="service.id"
          class="service-item"
          :class="{ 'active': selectedService === service.id }"
          @click="selectService(service)"
        >
          <div class="service-icon">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="service-info">
            <div class="service-name">{{ service.name }}</div>
            <div class="service-desc">{{ service.description }}</div>
          </div>
            <el-tag 
            :type="service.status === 'online' ? 'success' : 'danger'"
              size="small"
            >
            {{ service.status === 'online' ? '在线' : '离线' }}
            </el-tag>
          </div>
        </div>
          </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showMcpDialog = false">取消</el-button>
        <el-button type="primary" @click="connectMcpService" :disabled="!selectedService">
          连接
        </el-button>
        </div>
    </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.knowledge-search-container {
  height: 100%;
  padding: 24px;
  background: var(--el-bg-color-dark);

  .main-content {
    height: 100%;
    background: var(--el-bg-color);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  }

  .chat-panel {
    height: 100%;
    display: flex;
    flex-direction: column;

    .nav-header {
      padding: 12px 24px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left-section {
        display: flex;
        align-items: center;
        gap: 16px;

        .menu-btn {
          font-size: 20px;
        }

        .chat-title {
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;

          &:hover {
            color: #6B3FA0;
          }

          .el-input {
            width: 300px;
          }
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      scroll-behavior: smooth;
      
      @media screen and (max-width: 768px) {
        padding: 16px;
      }

      .welcome-message {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .welcome-content {
          text-align: center;
          max-width: 720px;
          width: 100%;

          .welcome-header {
            margin-bottom: 48px;

            .ai-logo {
              margin-bottom: 16px;
              background: #6B3FA0;
              color: white;
            }

            h3 {
              margin: 0 0 12px;
              font-size: 28px;
              color: #6B3FA0;
              font-weight: 600;
            }

            .welcome-desc {
              margin: 0;
              color: var(--el-text-color-secondary);
              font-size: 16px;
            }
          }
        }
      }

      .message {
        margin-bottom: 32px;
        max-width: 85%;
        
        @media screen and (max-width: 768px) {
          max-width: 95%;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          .sender-name {
            font-weight: 500;
            font-size: 16px;
          }
        }

        &.answer {
          margin-left: 0;
          margin-right: auto;

          .message-content {
            background: var(--el-bg-color-dark);
            border-radius: 16px 16px 16px 4px;
            
            @media (prefers-color-scheme: dark) {
              background: var(--el-bg-color);
            }
          }
        }

        &.question {
          margin-left: auto;
          margin-right: 0;

          .message-content {
            background: rgba(107, 63, 160, 0.1);
            border-radius: 16px 16px 4px 16px;
            color: #6B3FA0;
            
            @media (prefers-color-scheme: dark) {
              background: rgba(107, 63, 160, 0.2);
              color: #9B6FD0;
            }
          }
        }

        .message-content {
          padding: 20px;
          line-height: 1.6;
          font-size: 15px;
          box-shadow: var(--el-box-shadow-light);
          
          @media (prefers-color-scheme: dark) {
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          }
        }

        .message-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding: 0 8px;

          .message-time {
            font-size: 13px;
            color: var(--el-text-color-secondary);
          }

          .message-actions {
            display: flex;
            gap: 16px;
            align-items: center;
          }
        }

        .no-knowledge-actions {
          margin-top: 16px;
          display: flex;
          gap: 16px;
          justify-content: flex-start;

          .action-button {
            height: 40px;
            padding: 0 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
            background: #6B3FA0;
            color: white;
            box-shadow: 0 2px 6px rgba(107, 63, 160, 0.2);

            &:hover {
              background: #8B5FC0;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(107, 63, 160, 0.3);
            }

            .el-icon {
              font-size: 18px;
            }
          }
        }

        .message-references {
          margin-top: 16px;
          padding: 16px;
          background: var(--el-bg-color);
          border-radius: 12px;
          font-size: 14px;
          border: 1px solid var(--el-border-color-lighter);

          .reference-title {
  display: flex;
            align-items: center;
            gap: 8px;
            color: var(--el-text-color-secondary);
            margin-bottom: 12px;
            font-weight: 500;
          }

          .reference-list {
  display: flex;
  flex-direction: column;
            gap: 12px;

            .reference-item {
              display: flex;
              align-items: center;
              gap: 8px;
              color: #6B3FA0;
              cursor: pointer;
              padding: 8px;
              border-radius: 8px;
              transition: all 0.3s;

              &:hover {
                background: rgba(107, 63, 160, 0.1);
                text-decoration: none;
              }
            }
          }
        }
      }
    }

    .chat-input-container {
      padding: 24px;
      background: var(--el-bg-color);
      border-radius: 16px;
      margin: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .input-wrapper {
        position: relative;

        .input-area {
          position: relative;

          .el-input {
            :deep(.el-textarea__inner) {
              padding: 16px 16px 16px 120px; // 为左侧按钮留出空间
              min-height: 60px;
              max-height: 200px;
              border-radius: 12px;
              transition: all 0.3s;
              font-size: 15px;
              background: var(--el-bg-color-dark);
              border: 1px solid var(--el-border-color);
              resize: none;
              
              &:focus {
                border-color: #6B3FA0;
                box-shadow: 0 0 0 2px rgba(107, 63, 160, 0.1);
              }
            }

            .input-buttons {
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
  display: flex;
              gap: 8px;
              z-index: 2;

              .action-btn {
                padding: 8px;
                border-radius: 8px;
                color: var(--el-text-color-regular);
                
                &:hover {
                  color: #6B3FA0;
                  background: rgba(107, 63, 160, 0.1);
                }

                .el-icon {
                  font-size: 18px;
                }
              }

              .upload-button {
                display: inline-block;
              }
            }
          }
        }
      }
    }

    .chat-history {
      padding: 24px;
      border-top: 1px solid var(--el-border-color-lighter);
      background: var(--el-bg-color);

      .history-header {
  display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        .section-title {
          font-size: 16px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }

      .history-list {
  display: flex;
  flex-direction: column;
        gap: 12px;

        .history-item {
          padding: 16px;
          background: var(--el-bg-color-dark);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
  align-items: center;
          justify-content: space-between;

          &:hover {
            transform: translateY(-2px);
            background: rgba(107, 63, 160, 0.1);

            .el-icon {
              color: #6B3FA0;
            }
          }

          .history-content {
            .history-title {
              font-size: 15px;
              color: var(--el-text-color-primary);
              margin-bottom: 4px;
            }

            .history-time {
              font-size: 13px;
    color: var(--el-text-color-secondary);
            }
          }

          .el-icon {
            font-size: 18px;
            color: var(--el-text-color-secondary);
            transition: all 0.3s;
          }
        }
      }
    }
  }
}

.action-buttons,
.switch-ai-btn,
.add-knowledge-btn {
  display: none;
}

  .welcome-content {
  .welcome-header {
    .ai-logo {
      width: 64px;
      height: 64px;
      border-radius: 16px;
    display: flex;
    align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #6B3FA0, #8B5FC0);
      box-shadow: 0 8px 24px rgba(107, 63, 160, 0.2);
      
      @media (prefers-color-scheme: dark) {
        background: linear-gradient(135deg, #8B5FC0, #9B6FD0);
      }

      .el-icon {
        font-size: 32px;
        color: white;
      }
    }
  }

  .example-section {
    backdrop-filter: blur(10px);
    border: 1px solid var(--el-border-color-light);
    
    @media (prefers-color-scheme: dark) {
      background: var(--el-bg-color);
      border-color: var(--el-border-color-darker);
    }
    
    @media screen and (max-width: 768px) {
      .example-questions {
        grid-template-columns: 1fr;
      }
    }
  }
}

.settings-content {
  padding: 20px;

  .setting-section {
    margin-bottom: 24px;

    .section-title {
    display: flex;
    align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    
      .el-icon {
        font-size: 16px;
      color: var(--el-text-color-secondary);
        cursor: help;
      }
    }

    .model-select {
      width: 100%;
    }
    
    .model-option {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .model-desc {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.drawer-footer {
    display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.quick-qa {
  margin: 24px;
  padding: 24px;
  background: var(--el-bg-color-dark);
  border-radius: 16px;

  .section-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }

  .example-questions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .example-question {
      padding: 16px;
      background: var(--el-bg-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--el-text-color-regular);
      border: 1px solid var(--el-border-color-lighter);
      
      &:hover {
        transform: translateY(-2px);
        border-color: #6B3FA0;
        color: #6B3FA0;
        background: rgba(107, 63, 160, 0.1);
      }
    }
  }
}

.mcp-services {
  .service-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .service-item {
      padding: 16px;
      border-radius: 8px;
      border: 1px solid var(--el-border-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s;

      &:hover {
        border-color: #6B3FA0;
        background: rgba(107, 63, 160, 0.05);
      }

      &.active {
        border-color: #6B3FA0;
        background: rgba(107, 63, 160, 0.1);
      }

      .service-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: #6B3FA0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

        .el-icon {
          font-size: 24px;
        }
      }

      .service-info {
        flex: 1;

        .service-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .service-desc {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}

.nav-header {
  padding: 12px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
        display: flex;
        justify-content: space-between;
        align-items: center;
        
  .left-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .menu-btn {
      font-size: 20px;
    }

    .chat-title {
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        color: #6B3FA0;
      }

      .el-input {
        width: 300px;
      }
    }
  }
}

.input-area {
  position: relative;

  .input-buttons {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
  display: flex;
    align-items: center;
    gap: 8px;
    z-index: 2;

    .model-select {
      width: 140px;
    }
  }

  .el-input {
    :deep(.el-textarea__inner) {
      padding-left: 420px;
    }
  }
}

.input-footer {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left-actions {
    display: flex;
    gap: 12px;
  }
}

.chat-sidebar {
  background: var(--el-bg-color);
  border-left: 1px solid var(--el-border-color-lighter);

  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }
  }
}

.input-toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .toolbar-buttons {
  display: flex;
  align-items: center;
    gap: 8px;
  
    .el-button {
    display: flex;
    align-items: center;
      gap: 4px;
      height: 32px;
      padding: 0 12px;
      
      .el-icon {
        font-size: 16px;
      }
    }

    .el-divider {
      height: 16px;
      margin: 0 4px;
    }
  }
}

.input-area {
  .el-input {
    :deep(.el-textarea__inner) {
      padding: 16px;
      min-height: 60px;
      max-height: 200px;
      border-radius: 12px;
      transition: all 0.3s;
      font-size: 15px;
      background: var(--el-bg-color-dark);
      border: 1px solid var(--el-border-color);
      resize: none;
      
      &:focus {
        border-color: #6B3FA0;
        box-shadow: 0 0 0 2px rgba(107, 63, 160, 0.1);
      }
    }
  }
}
</style>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { ElInput } from 'element-plus'
import { 
  ChatLineRound, 
  DocumentCopy, 
  Pointer, 
  Link, 
  Document,
  InfoFilled,
  Delete,
  Position,
  User,
  Back,
  ArrowRight,
  Plus,
  ChatRound,
  Setting,
  QuestionFilled,
  Picture,
  Upload,
  Connection,
  Menu,
  ArrowDown
} from '@element-plus/icons-vue'
import { formatDate, highlightKeywords, formatMessage } from '@/utils/format'
import type { KnowledgeItem, QAMessage } from '@/types/knowledge'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 状态定义
const activeTab = ref('qa')
const questionInput = ref('')
const asking = ref(false)
const conversation = ref<QAMessage[]>([])

// 示例问题
const exampleQuestions = [
  '如何处理客户投诉？',
  '新员工入职流程是什么？',
  '如何申请年假？'
]

// 模拟的历史对话数据
interface ChatHistoryItem {
  id: string
  title: string
  timestamp: string
  messages: QAMessage[]
}

const chatHistory = ref<ChatHistoryItem[]>([
  {
    id: '1',
    title: '关于客户投诉处理的咨询',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: '1-1',
        type: 'question',
        content: '如何处理客户投诉？',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '1-2',
        type: 'answer',
        content: '处理客户投诉的标准流程如下：\n1. 认真倾听客户诉求\n2. 表示理解和歉意\n3. 详细记录投诉内容\n4. 承诺处理时限\n5. 及时反馈处理结果\n6. 跟进客户满意度',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 1000).toISOString(),
        isLiked: true,
        relatedKnowledge: [
          {
            id: '1',
            title: '客户投诉处理规范',
            content: '完整的客户投诉处理流程指南...',
            source: '客服部门',
            tags: ['客服', '规范'],
            viewCount: 128,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: '产品退换货政策询问',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: '2-1',
        type: 'question',
        content: '产品退换货政策是什么？',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2-2',
        type: 'answer',
        content: '我们的退换货政策主要包括：\n1. 7天无理由退货\n2. 15天质量问题包换\n3. 365天保修服务\n\n具体条款：\n- 商品及包装保持完好\n- 有效购物凭证\n- 运费规则详见商品页面',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1000).toISOString(),
        isLiked: false,
        relatedKnowledge: [
          {
            id: '2',
            title: '退换货政策说明',
            content: '详细的退换货政策文档...',
            source: '产品部门',
            tags: ['政策', '售后'],
            viewCount: 256,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: true
          }
        ]
      }
    ]
  }
])

const hasHistory = computed(() => chatHistory.value.length > 0)

// 处理示例问题点击
const askExample = (question: string) => {
  questionInput.value = question
  sendQuestion()
}

// 复制回答内容
const copyAnswer = (content: string) => {
  navigator.clipboard.writeText(content)
  ElMessage.success('已复制到剪贴板')
}

// 点赞回答
const likeAnswer = (messageId: string) => {
  const message = conversation.value.find(m => m.id === messageId)
  if (message) {
    message.isLiked = !message.isLiked
  }
}

// 换行处理
const newline = () => {
  questionInput.value += '\n'
}

// 查看参考来源
const viewReference = (ref: KnowledgeItem) => {
  // TODO: 实现查看参考来源的逻辑
  console.log('查看参考来源:', ref)
}

// 在script setup中添加类型声明
declare global {
  interface Window {
    switchToAI: () => Promise<void>
    addKnowledge: () => void
  }
}

// 在script setup中添加状态
const hasKnowledgeBase = ref(false) // 是否有知识库内容
const isKnowledgeFound = ref(false) // 是否找到相关知识

// AI设置相关状态
const showSettings = ref(false)
const availableModels = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: '适用于一般对话和知识问答',
    apiUrl: 'https://api.openai-proxy.com/v1/chat/completions'
  },
  {
    id: 'deepseek-chat',
    name: 'Deepseek Chat',
    description: '开源对话模型，支持中英双语',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions'
  },
  {
    id: 'qwen',
    name: '通义千问',
    description: '阿里云开源大模型，擅长中文对话',
    apiUrl: 'https://api.qwen.ai/v1/chat/completions'
  }
]

const selectedModel = ref('gpt-3.5-turbo')
const systemPrompt = ref('你是一个专业、友好的AI助手，请基于用户的问题提供准确、有帮助的回答。如果不确定，请说明这是推测的内容。')
const temperature = ref(0.7)
const maxTokens = ref(2000)

// 修改AI配置对象
const AI_CONFIG = {
  API_URL: 'https://api.openai-proxy.com/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  SYSTEM_PROMPT: '你是一个专业、友好的AI助手，请基于用户的问题提供准确、有帮助的回答。如果不确定，请说明这是推测的内容。'
}

// 格式化对话历史
const formatConversationHistory = (conversation: QAMessage[]) => {
  return conversation.map(msg => ({
    role: msg.type === 'question' ? 'user' : 'assistant',
    content: msg.content
  }))
}

// 发送问题
const sendQuestion = async () => {
  if (!questionInput.value.trim()) return

  const userMessage: QAMessage = {
    id: Date.now().toString(),
    type: 'question',
    content: questionInput.value,
    timestamp: new Date().toISOString()
  }
  conversation.value.push(userMessage)

  asking.value = true
  try {
    // 模拟知识库搜索
    await new Promise(resolve => setTimeout(resolve, 1000))
    let answer = ''
    let relatedKnowledge: KnowledgeItem[] = []

    // 这里模拟知识库为空的情况
    const hasKnowledgeBase = false // 实际开发时需要根据真实情况判断
    const isKnowledgeFound = false // 实际开发时需要根据搜索结果判断

    if (!hasKnowledgeBase) {
      // 知识库为空的情况
      answer = '抱歉，当前知识库还未添加任何内容。您可以：\n\n' +
        '1. 联系管理员添加相关知识\n' +
        '2. 使用AI智能回答功能获取通用答案'
    } else if (!isKnowledgeFound) {
      // 知识库中未找到相关内容
      answer = '抱歉，在知识库中未找到与您问题相关的内容。您可以：\n\n' +
        '1. 尝试换个方式提问\n' +
        '2. 联系管理员补充相关知识\n' +
        '3. 使用AI智能回答功能获取通用答案'
    } else {
      // 正常情况：找到知识库内容
      const mockSearchResults = [{
        id: '1',
        title: '示例知识',
        content: '这是一个示例知识内容',
        source: '知识库',
        tags: ['示例'],
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false
      }]
      
      answer = `根据知识库中的相关内容，我为您整理如下答案：\n\n${mockSearchResults[0].content}`
      relatedKnowledge = mockSearchResults
    }
    
    const assistantMessage: QAMessage = {
      id: (Date.now() + 1).toString(),
      type: 'answer',
      content: answer,
      timestamp: new Date().toISOString(),
      isLiked: false,
      relatedKnowledge
    }
    conversation.value.push(assistantMessage)

    // 如果用户点击了使用AI回答按钮
    window.switchToAI = async () => {
      asking.value = true
      try {
        // 模拟AI回答
        await new Promise(resolve => setTimeout(resolve, 1500))
        const aiAnswer = '这是一个AI生成的回答示例。在实际开发中，您需要接入具体的AI服务。\n\n' +
          '1. 您可以使用开源模型\n' +
          '2. 或者使用云服务提供商的API\n' +
          '3. 也可以自己部署模型\n\n' +
          '注：该回答由AI助手生成，仅供参考。'

        const aiMessage: QAMessage = {
          id: Date.now().toString(),
          type: 'answer',
          content: aiAnswer,
          timestamp: new Date().toISOString(),
          isLiked: false,
          relatedKnowledge: []
        }
        conversation.value.push(aiMessage)
      } catch (error) {
        ElMessage.error('AI回答生成失败，请稍后重试')
      } finally {
        asking.value = false
        await scrollToBottom()
      }
    }

    // 如果用户点击了添加知识按钮
    window.addKnowledge = () => {
      // 跳转到新建知识页面
      router.push('/knowledge-base/create')
    }

  } catch (error) {
    ElMessage.error('抱歉，AI助手暂时无法回答，请稍后再试')
    console.error('AI回答出错:', error)
  } finally {
    asking.value = false
    questionInput.value = ''
    await scrollToBottom()
  }
}

// 滚动到对话底部
const scrollToBottom = async () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 清空对话
const clearConversation = () => {
  conversation.value = []
}

// 清空历史对话
const clearHistory = () => {
  chatHistory.value = []
}

// 在script setup中添加
const chatContainer = ref<HTMLElement | null>(null)

// 创建知识
const createKnowledge = () => {
  // TODO: 实现创建知识的逻辑
  ElMessage.info('即将跳转到创建知识页面')
}

// 使用AI回复
const useAIReply = async () => {
  // 获取最后一个问题
  const lastQuestion = conversation.value.filter(msg => msg.type === 'question').pop()
  
  if (!lastQuestion && !questionInput.value.trim()) {
    ElMessage.warning('没有找到可以回答的问题')
    return
  }

  // 如果输入框有内容，使用输入框的内容，否则使用最后一个问题
  const questionContent = questionInput.value.trim() || lastQuestion?.content

  // 如果是新问题，需要先添加到对话中
  if (questionInput.value.trim()) {
    const userMessage: QAMessage = {
      id: Date.now().toString(),
      type: 'question',
      content: questionInput.value,
      timestamp: new Date().toISOString()
    }
    conversation.value.push(userMessage)
  }

  asking.value = true
  try {
    // 准备对话历史
    const history = conversation.value.slice(-5).map(msg => ({
      role: msg.type === 'question' ? 'user' : 'assistant',
      content: msg.content
    }))

    try {
      // 调用AI API
      const response = await axios.post(
        AI_CONFIG.API_URL,
        {
          model: AI_CONFIG.MODEL,
          messages: [
            {
              role: 'system',
              content: AI_CONFIG.SYSTEM_PROMPT
            },
            ...history
          ],
          max_tokens: AI_CONFIG.MAX_TOKENS,
          temperature: AI_CONFIG.TEMPERATURE,
        }
      )
      
      const aiResponse = response.data.choices[0].message.content.trim()
      
      const aiAnswer: QAMessage = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        isLiked: false,
        isAIReply: true
      }
      
      // 移除之前的非AI回答（如果存在）
      const lastAnswer = conversation.value[conversation.value.length - 1]
      if (lastAnswer.type === 'answer' && !lastAnswer.isAIReply) {
        conversation.value.pop()
      }
      
      conversation.value.push(aiAnswer)

      // 自动保存较长对话到历史记录
      if (conversation.value.length >= 4) {
        const newHistory: ChatHistoryItem = {
          id: Date.now().toString(),
          title: conversation.value[0].content.slice(0, 30) + '...',
          timestamp: new Date().toISOString(),
          messages: [...conversation.value]
        }
        chatHistory.value.unshift(newHistory)
      }

    } catch (error) {
      console.error('AI API调用失败:', error)
      
      // 使用备用回答
      const fallbackAnswer: QAMessage = {
        id: (Date.now() + 1).toString(),
        type: 'answer',
        content: `抱歉，AI服务暂时不可用。以下是基于您的问题"${questionContent}"的建议：\n\n1. 您可以稍后再试\n2. 尝试重新表述您的问题\n3. 或者直接联系相关部门获取帮助`,
        timestamp: new Date().toISOString(),
        isLiked: false,
        isAIReply: true
      }
      
      conversation.value.push(fallbackAnswer)
    }

    questionInput.value = ''
    
  } catch (error) {
    console.error('AI回答生成失败:', error)
    ElMessage.error('AI回答生成失败，请稍后重试')
  } finally {
    asking.value = false
    await scrollToBottom()
  }
}

// 保存为知识
const saveAsKnowledge = (message: QAMessage) => {
  // TODO: 实现保存为知识的逻辑
  ElMessage.success('已保存为知识')
}

// 从对话创建知识
const createKnowledgeFromConversation = async () => {
  if (conversation.value.length < 2) {
    ElMessage.warning('对话内容太少，无法创建知识')
    return
  }

  try {
    ElMessage.info('正在通过AI整理对话内容...')
    
    // 提取所有问答对
    const qaContent = conversation.value.reduce((acc, curr, index, array) => {
      if (curr.type === 'question' && index + 1 < array.length && array[index + 1].type === 'answer') {
        acc.push({
          question: curr.content,
          answer: array[index + 1].content
        })
      }
      return acc
    }, [] as { question: string; answer: string }[])

    // 模拟AI处理过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 生成知识标题（实际项目中应该由AI生成）
    const title = qaContent[0].question.slice(0, 30) + '...'

    // 整理知识内容
    const content = qaContent.map(qa => (
      `问：${qa.question}\n\n答：${qa.answer}\n\n---\n`
    )).join('\n')

    // 模拟保存知识
    const knowledge: KnowledgeItem = {
      id: Date.now().toString(),
      title,
      content,
      source: 'AI对话',
      tags: ['AI生成', '对话整理'],
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false
    }

    // TODO: 调用后端API保存知识
    console.log('创建的知识：', knowledge)
    ElMessage.success('知识创建成功！')
  } catch (error) {
    console.error('创建知识失败：', error)
    ElMessage.error('创建知识失败，请稍后重试')
  }
}

// 在script setup中添加router
const router = useRouter()

// 添加知识
const addKnowledge = () => {
  router.push('/knowledge-base/create')
}

// 保存设置
const saveSettings = () => {
  const selectedModelConfig = availableModels.find(m => m.id === selectedModel.value)
  if (selectedModelConfig) {
    AI_CONFIG.API_URL = selectedModelConfig.apiUrl
    AI_CONFIG.MODEL = selectedModel.value
    AI_CONFIG.TEMPERATURE = temperature.value
    AI_CONFIG.MAX_TOKENS = maxTokens.value
    AI_CONFIG.SYSTEM_PROMPT = systemPrompt.value
  }
  showSettings.value = false
  ElMessage.success('设置已保存')
}

// 重置设置
const resetSettings = () => {
  selectedModel.value = 'gpt-3.5-turbo'
  systemPrompt.value = '你是一个专业、友好的AI助手，请基于用户的问题提供准确、有帮助的回答。如果不确定，请说明这是推测的内容。'
  temperature.value = 0.7
  maxTokens.value = 2000
}

// MCP服务相关状态
const showMcpDialog = ref(false)
const selectedService = ref<string | null>(null)
const mcpServices = [
  {
    id: '1',
    name: 'MCP服务 A',
    description: '用于处理自然语言理解的服务',
    status: 'online'
  },
  {
    id: '2',
    name: 'MCP服务 B',
    description: '专门用于图像识别的服务',
    status: 'online'
  },
  {
    id: '3',
    name: 'MCP服务 C',
    description: '用于语音识别的服务',
    status: 'offline'
  }
]

// 选择MCP服务
const selectService = (service: typeof mcpServices[0]) => {
  selectedService.value = service.id
}

// 连接MCP服务
const connectMcpService = () => {
  const service = mcpServices.find(s => s.id === selectedService.value)
  if (service) {
    ElMessage.success(`已连接到 ${service.name}`)
    showMcpDialog.value = false
  }
}

// 处理图片上传
const handleImageUpload = (response: any) => {
  // TODO: 处理图片上传成功后的逻辑
  ElMessage.success('图片上传成功')
}

// 处理文件上传
const handleFileUpload = (response: any) => {
  // TODO: 处理文件上传成功后的逻辑
  ElMessage.success('文件上传成功')
}

// 侧边栏状态
const showSidebar = ref(false)

// 当前会话状态
const currentChat = ref<ChatHistoryItem | null>(null)
const isEditingTitle = ref(false)
const editingTitle = ref('')
const titleInput = ref<InstanceType<typeof ElInput> | null>(null)

// 开始编辑标题
const startEditTitle = () => {
  if (currentChat.value) {
    editingTitle.value = currentChat.value.title
    isEditingTitle.value = true
    nextTick(() => {
      titleInput.value?.focus()
    })
  }
}

// 保存标题
const saveTitle = () => {
  if (currentChat.value && editingTitle.value.trim()) {
    currentChat.value.title = editingTitle.value.trim()
    // TODO: 调用后端API保存标题
  }
  isEditingTitle.value = false
}

// 删除单个历史记录
const deleteHistory = (id: string) => {
  chatHistory.value = chatHistory.value.filter(chat => chat.id !== id)
  if (currentChat.value?.id === id) {
    backToWelcome()
  }
}

// 加载历史对话时更新当前会话
const loadChatHistory = (chat: ChatHistoryItem) => {
  conversation.value = chat.messages
  currentChat.value = chat
  showSidebar.value = false
}

// 返回首页时清除当前会话
const backToWelcome = () => {
  conversation.value = []
  currentChat.value = null
}

// 修改为箭头函数声明
const handleModelChange = (modelId: string): void => {
  selectedModel.value = modelId
  const model = availableModels.find(m => m.id === modelId)
  if (model) {
    AI_CONFIG.API_URL = model.apiUrl
    AI_CONFIG.MODEL = modelId
  }
  ElMessage.success(`已切换到 ${model?.name}`)
}
</script> 