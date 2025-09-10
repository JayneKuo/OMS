<template>
  <div class="category-list-container">
    <div class="list-header">
      <div class="search-area">
        <el-input
          v-model="searchQuery"
          placeholder="搜索分类名称"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="platformFilter" placeholder="平台筛选" clearable>
          <el-option label="全部平台" value="" />
          <el-option
            v-for="platform in platforms"
            :key="platform.value"
            :label="platform.label"
            :value="platform.value"
          />
        </el-select>
        <el-select v-model="sourceFilter" placeholder="来源筛选" clearable>
          <el-option label="全部来源" value="" />
          <el-option label="本地创建" value="local" />
          <el-option label="平台同步" value="platform" />
        </el-select>
      </div>
      <div class="action-area">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>添加分类
        </el-button>
        <el-button type="success" @click="handleSync">
          <el-icon><Connection /></el-icon>同步分类
        </el-button>
      </div>
    </div>

    <el-table
      :data="filteredCategories"
      style="width: 100%"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column prop="name" label="分类名称" min-width="200">
        <template #default="{ row }">
          <div class="category-name-cell">
            <span>{{ row.name }}</span>
            <el-tag 
              v-if="row.source === 'platform'" 
              size="small" 
              type="info"
            >平台同步</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="平台映射" min-width="300">
        <template #default="{ row }">
          <div class="platform-mappings">
            <div 
              v-for="mapping in row.platformMappings" 
              :key="mapping.platformCategoryId"
              class="mapping-item"
            >
              <el-tag 
                size="small" 
                :type="getPlatformTagType(mapping.platformName)"
              >
                {{ getPlatformLabel(mapping.platformName) }}
              </el-tag>
              <span class="mapping-name">{{ mapping.platformCategoryName }}</span>
              <el-tooltip 
                :content="'最后同步: ' + formatDate(mapping.lastSyncTime)"
                placement="top"
              >
                <el-icon><Timer /></el-icon>
              </el-tooltip>
            </div>
            <el-button 
              v-if="!row.platformMappings?.length"
              link 
              type="primary"
              @click="handleMapping(row)"
            >
              添加映射
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="更新记录" min-width="300">
        <template #default="{ row }">
          <div class="update-logs">
            <div class="log-item">
              <span class="log-label">创建时间：</span>
              <span>{{ formatDate(row.createTime) }}</span>
            </div>
            <div class="log-item">
              <span class="log-label">最后更新：</span>
              <span>{{ formatDate(row.updateTime) }}</span>
            </div>
            <el-button 
              link 
              type="primary" 
              @click="showUpdateLogs(row)"
            >
              查看历史记录
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleMapping(row)">映射</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 更新日志对话框 -->
    <el-dialog
      v-model="logDialogVisible"
      title="分类更新历史"
      width="680px"
    >
      <el-timeline v-if="currentCategory?.updateLogs?.length">
        <el-timeline-item
          v-for="log in currentCategory.updateLogs"
          :key="log.id"
          :type="getLogTypeIcon(log.updateType)"
          :color="getLogTypeColor(log.updateType)"
          :timestamp="formatDate(log.updateTime)"
        >
          <div class="log-content">
            <h4>{{ getLogTypeText(log.updateType) }}</h4>
            <p>{{ log.details }}</p>
            <div v-if="log.platformInfo" class="platform-info">
              <el-tag size="small" :type="getPlatformTagType(log.platformInfo.platform)">
                {{ getPlatformLabel(log.platformInfo.platform) }}
              </el-tag>
              <span>{{ log.platformInfo.action }}</span>
              <el-tag 
                size="small" 
                :type="log.platformInfo.status === 'success' ? 'success' : 'danger'"
              >
                {{ log.platformInfo.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </div>
            <div class="operator">
              操作人：{{ log.operator }}
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <div v-else class="no-logs">
        暂无更新记录
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Search, Plus, Connection, Timer } from '@element-plus/icons-vue'
import type { CategoryData, CategoryUpdateLog } from '../types'
import { ElMessage, ElMessageBox } from 'element-plus'

// 状态
const searchQuery = ref('')
const platformFilter = ref('')
const sourceFilter = ref('')
const logDialogVisible = ref(false)
const currentCategory = ref<CategoryData | null>(null)

// 平台选项
const platforms = [
  { label: 'Shein', value: 'shein' },
  { label: 'Amazon', value: 'amazon' },
  { label: 'Shopify', value: 'shopify' }
]

// 模拟数据
const categoryList = ref<CategoryData[]>([
  {
    id: 1,
    name: '女装',
    parentId: null,
    sort: 1,
    status: 1,
    source: 'local',
    createTime: '2024-01-01T10:00:00',
    updateTime: '2024-01-02T15:30:00',
    platformMappings: [
      {
        platformId: '1',
        platformName: 'shein',
        platformCategoryId: 'SHEIN001',
        platformCategoryName: "Women's Clothing",
        mappingStatus: 'mapped',
        lastSyncTime: '2024-01-02T15:30:00'
      }
    ],
    updateLogs: [
      {
        id: 1,
        categoryId: 1,
        updateType: 'create',
        updateTime: '2024-01-01T10:00:00',
        operator: 'admin',
        details: '创建分类'
      },
      {
        id: 2,
        categoryId: 1,
        updateType: 'mapping',
        updateTime: '2024-01-02T15:30:00',
        operator: 'admin',
        details: '添加Shein平台映射',
        platformInfo: {
          platform: 'shein',
          action: '映射分类',
          status: 'success'
        }
      }
    ]
  }
])

// 过滤分类列表
const filteredCategories = computed(() => {
  let result = categoryList.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(category => 
      category.name.toLowerCase().includes(query)
    )
  }

  if (platformFilter.value) {
    result = result.filter(category =>
      category.platformMappings?.some(mapping => 
        mapping.platformName === platformFilter.value
      )
    )
  }

  if (sourceFilter.value) {
    result = result.filter(category => 
      category.source === sourceFilter.value
    )
  }

  return result
})

// 获取平台标签类型
const getPlatformTagType = (platform: string) => {
  const types: Record<string, string> = {
    shein: 'success',
    amazon: 'warning',
    shopify: 'info'
  }
  return types[platform.toLowerCase()] || 'info'
}

// 获取平台显示名称
const getPlatformLabel = (platform: string) => {
  const labels: Record<string, string> = {
    shein: 'Shein',
    amazon: 'Amazon',
    shopify: 'Shopify'
  }
  return labels[platform.toLowerCase()] || platform
}

// 格式化日期
const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取日志类型图标
const getLogTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    sync: 'info',
    mapping: 'primary'
  }
  return icons[type] || 'info'
}

// 获取日志类型颜色
const getLogTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    create: '#67C23A',
    update: '#E6A23C',
    delete: '#F56C6C',
    sync: '#909399',
    mapping: '#409EFF'
  }
  return colors[type] || '#909399'
}

// 获取日志类型文本
const getLogTypeText = (type: string) => {
  const texts: Record<string, string> = {
    create: '创建分类',
    update: '更新分类',
    delete: '删除分类',
    sync: '同步分类',
    mapping: '映射分类'
  }
  return texts[type] || type
}

// 显示更新日志
const showUpdateLogs = (category: CategoryData) => {
  currentCategory.value = category
  logDialogVisible.value = true
}

// 处理添加分类
const handleAdd = () => {
  // TODO: 实现添加分类逻辑
}

// 处理编辑分类
const handleEdit = (category: CategoryData) => {
  // TODO: 实现编辑分类逻辑
}

// 处理映射分类
const handleMapping = (category: CategoryData) => {
  // TODO: 实现映射分类逻辑
}

// 处理删除分类
const handleDelete = (category: CategoryData) => {
  ElMessageBox.confirm(
    '确定要删除该分类吗？相关的映射关系也会被删除。',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    // TODO: 实现删除分类逻辑
    ElMessage.success('删除成功')
  })
}

// 处理同步分类
const handleSync = () => {
  ElMessageBox.confirm(
    '确定要从平台同步分类吗？',
    '同步确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    // TODO: 实现同步分类逻辑
    ElMessage.success('同步成功')
  })
}
</script>

<style scoped>
.category-list-container {
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-area {
  display: flex;
  gap: 12px;
  
  .search-input {
    width: 240px;
  }
}

.action-area {
  display: flex;
  gap: 12px;
}

.category-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-mappings {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .mapping-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .mapping-name {
      color: var(--el-text-color-regular);
      font-size: 13px;
    }

    .el-icon {
      color: var(--el-text-color-secondary);
      cursor: help;
    }
  }
}

.update-logs {
  .log-item {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
    
    .log-label {
      color: var(--el-text-color-secondary);
    }
  }
}

.log-content {
  h4 {
    margin: 0 0 8px;
    font-size: 14px;
  }

  p {
    margin: 0 0 8px;
    color: var(--el-text-color-regular);
  }

  .platform-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .operator {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.no-logs {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 20px;
}
</style>
