<!-- 知识库搜索页面 -->
<template>
  <div class="knowledge-search">
    <!-- 左侧搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <div class="search-input-wrapper">
          <el-input
            v-model="searchQuery"
            placeholder="输入关键词搜索知识库..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        
        <!-- 标签筛选 -->
        <div class="filter-section">
          <div class="tags-filter">
            <span class="filter-label">标签：</span>
            <el-tag
              v-for="tag in tags"
              :key="tag"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
              :effect="selectedTags.includes(tag) ? 'dark' : 'plain'"
            >
              {{ tag }}
            </el-tag>
          </div>
          
          <div class="source-filter">
            <span class="filter-label">来源：</span>
            <el-select v-model="selectedSource" placeholder="全部来源">
              <el-option
                v-for="source in sources"
                :key="source"
                :label="source"
                :value="source"
              />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 搜索结果列表 -->
      <div class="search-results" v-loading="loading">
        <template v-if="searchResults.length">
          <div
            v-for="item in searchResults"
            :key="item.id"
            class="result-card"
            @click="selectResult(item)"
          >
            <h3 class="result-title" v-html="highlightKeywords(item.title, searchQuery)" />
            <p class="result-content" v-html="highlightKeywords(item.content, searchQuery)" />
            <div class="result-meta">
              <span class="source">来源：{{ item.source }}</span>
              <span class="date">{{ formatDate(item.date) }}</span>
              <span class="views">浏览：{{ item.views }}</span>
            </div>
            <div class="result-tags">
              <el-tag
                v-for="tag in item.tags"
                :key="tag"
                size="small"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </template>
        <el-empty v-else description="暂无搜索结果" />
      </div>
    </div>

    <!-- 右侧问答区域 -->
    <div class="qa-section">
      <div class="qa-header">
        <h2>智能问答助手</h2>
        <el-button @click="clearChat">清空对话</el-button>
      </div>

      <div class="chat-messages" ref="chatContainer">
        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="['message', message.type]"
        >
          <div class="message-content" v-html="formatMessage(message.content)" />
          <div class="message-time">{{ formatDate(message.time) }}</div>
        </div>
      </div>

      <div class="input-area">
        <el-input
          v-model="question"
          type="textarea"
          :rows="3"
          placeholder="输入您的问题，按 Ctrl + Enter 发送"
          @keydown.ctrl.enter="sendQuestion"
        />
        <el-button type="primary" @click="sendQuestion" :disabled="!question.trim()">
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { formatDate, highlightKeywords, formatMessage } from '@/utils/format'

// 类型定义
interface SearchResult {
  id: string
  title: string
  content: string
  source: string
  date: string
  views: number
  tags: string[]
}

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
  time: string
}

// 状态管理
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const selectedSource = ref('')
const loading = ref(false)
const searchResults = ref<SearchResult[]>([])
const question = ref('')
const chatMessages = ref<ChatMessage[]>([])
const chatContainer = ref<HTMLElement>()

// 模拟数据
const tags = ['技术文档', '操作指南', '常见问题', '最佳实践', '故障排查']
const sources = ['官方文档', '内部wiki', '技术博客', '用户反馈']

// 搜索相关方法
const handleSearch = async () => {
  loading.value = true
  try {
    // TODO: 实现实际的搜索逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    searchResults.value = [
      {
        id: '1',
        title: '如何使用新版本的知识库系统',
        content: '本文档详细介绍了新版本知识库系统的使用方法和注意事项...',
        source: '官方文档',
        date: '2024-03-20 14:30',
        views: 128,
        tags: ['操作指南', '最佳实践']
      },
      // 更多搜索结果...
    ]
  } finally {
    loading.value = false
  }
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  handleSearch()
}

// 问答相关方法
const sendQuestion = async () => {
  if (!question.value.trim()) return

  const userMessage: ChatMessage = {
    type: 'user',
    content: question.value,
    time: new Date().toISOString()
  }
  chatMessages.value.push(userMessage)

  // TODO: 实现实际的问答逻辑
  const assistantMessage: ChatMessage = {
    type: 'assistant',
    content: '正在处理您的问题，请稍候...',
    time: new Date().toISOString()
  }
  chatMessages.value.push(assistantMessage)

  question.value = ''
  await scrollToBottom()
}

const clearChat = () => {
  chatMessages.value = []
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const selectResult = (item: SearchResult) => {
  question.value = `请解释一下关于"${item.title}"的具体内容`
}

// 生命周期钩子
onMounted(() => {
  handleSearch()
})
</script>

<style scoped lang="scss">
.knowledge-search {
  display: flex;
  gap: 20px;
  height: 100%;
  padding: 20px;
  background: var(--el-bg-color);

  .search-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;

    .search-header {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: var(--el-bg-color-overlay);
      border-radius: 8px;
      box-shadow: var(--el-box-shadow-lighter);

      .search-input-wrapper {
        display: flex;
        gap: 12px;

        .search-input {
          flex: 1;
        }
      }
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .filter-label {
        color: var(--el-text-color-regular);
        margin-right: 8px;
      }

      .tags-filter {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;

        .el-tag {
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-1px);
          }

          &.active {
            background: var(--el-color-primary);
            color: white;
          }
        }
      }

      .source-filter {
        display: flex;
        align-items: center;
      }
    }

    .search-results {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: var(--el-bg-color-overlay);
      border-radius: 8px;
      box-shadow: var(--el-box-shadow-lighter);

      .result-card {
        padding: 16px;
        margin-bottom: 16px;
        border-radius: 8px;
        background: var(--el-bg-color);
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--el-box-shadow-light);
        }

        .result-title {
          margin: 0 0 8px;
          color: var(--el-color-primary);
          font-size: 16px;
        }

        .result-content {
          margin: 0 0 12px;
          color: var(--el-text-color-regular);
          font-size: 14px;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .result-meta {
          display: flex;
          gap: 16px;
          color: var(--el-text-color-secondary);
          font-size: 12px;
          margin-bottom: 8px;
        }

        .result-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
      }
    }
  }

  .qa-section {
    width: 400px;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-lighter);

    .qa-header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--el-border-color-lighter);

      h2 {
        margin: 0;
        font-size: 18px;
        color: var(--el-text-color-primary);
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;

      .message {
        margin-bottom: 16px;
        max-width: 80%;

        &.user {
          margin-left: auto;

          .message-content {
            background: var(--el-color-primary-light-9);
            border-radius: 12px 12px 2px 12px;
          }
        }

        &.assistant {
          margin-right: auto;

          .message-content {
            background: var(--el-bg-color);
            border-radius: 12px 12px 12px 2px;
          }
        }

        .message-content {
          padding: 12px;
          margin-bottom: 4px;
          box-shadow: var(--el-box-shadow-lighter);
        }

        .message-time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          text-align: right;
        }
      }
    }

    .input-area {
      padding: 20px;
      border-top: 1px solid var(--el-border-color-lighter);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
}

:deep(.highlight) {
  color: var(--el-color-danger);
  font-weight: bold;
}
</style> 