<template>
  <div class="category-mapping-container">
    <page-header
      title="分类映射"
      :back="{ name: 'ProductCategory' }"
    />

    <div class="mapping-content">
      <!-- 本地分类信息 -->
      <el-card class="local-category">
        <template #header>
          <div class="card-header">
            <span>本地分类信息</span>
            <el-tag>{{ category?.source === 'local' ? '本地创建' : '平台同步' }}</el-tag>
          </div>
        </template>
        <div class="category-info">
          <div class="info-item">
            <span class="label">分类名称：</span>
            <span class="value">{{ category?.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">分类编码：</span>
            <span class="value">{{ category?.code }}</span>
          </div>
          <div class="info-item">
            <span class="label">创建时间：</span>
            <span class="value">{{ formatDate(category?.createTime) }}</span>
          </div>
          <div class="info-item">
            <span class="label">更新时间：</span>
            <span class="value">{{ formatDate(category?.updateTime) }}</span>
          </div>
        </div>
      </el-card>

      <!-- 平台映射 -->
      <el-card class="platform-mapping">
        <template #header>
          <div class="card-header">
            <span>平台映射</span>
            <div class="platform-selector">
              <el-select
                v-model="selectedPlatform"
                placeholder="选择平台"
                @change="handlePlatformChange"
              >
                <el-option
                  v-for="platform in platforms"
                  :key="platform.value"
                  :label="platform.label"
                  :value="platform.value"
                />
              </el-select>
              <el-button
                type="primary"
                :disabled="!selectedPlatform"
                @click="handleSync"
              >
                同步分类
              </el-button>
            </div>
          </div>
        </template>

        <!-- 平台分类列表 -->
        <div v-if="selectedPlatform" class="platform-categories">
          <div class="search-bar">
            <el-input
              v-model="searchQuery"
              placeholder="搜索分类名称/ID"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button
              type="success"
              :disabled="!selectedCategories.length"
              @click="handleBatchMap"
            >
              批量映射 ({{ selectedCategories.length }})
            </el-button>
          </div>

          <el-table
            ref="tableRef"
            v-loading="loading"
            :data="filteredCategories"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="分类名称" min-width="200">
              <template #default="{ row }">
                <div class="category-name-cell">
                  <span class="name">{{ row.name }}</span>
                  <span class="id">({{ row.originalId }})</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="分类路径" show-overflow-tooltip />
            <el-table-column label="映射状态" width="120">
              <template #default="{ row }">
                <el-tag
                  :type="getMappingStatusType(row.mappingStatus)"
                  size="small"
                >
                  {{ getMappingStatusText(row.mappingStatus) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="同步时间" width="180">
              <template #default="{ row }">
                <span>{{ formatDate(row.lastSyncTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.mappingStatus !== 'mapped'"
                  link
                  type="primary"
                  @click="handleMap(row)"
                >
                  映射
                </el-button>
                <el-button
                  v-else
                  link
                  type="danger"
                  @click="handleUnmap(row)"
                >
                  取消映射
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>

        <div v-else class="platform-empty">
          请选择平台以查看可映射的分类
        </div>
      </el-card>

      <!-- 映射历史 -->
      <el-card class="mapping-history">
        <template #header>
          <div class="card-header">
            <span>映射历史</span>
            <el-button link type="primary" @click="refreshHistory">
              刷新
            </el-button>
          </div>
        </template>

        <el-timeline>
          <el-timeline-item
            v-for="log in mappingLogs"
            :key="log.id"
            :type="getLogType(log.action)"
            :timestamp="formatDate(log.timestamp)"
          >
            <h4>{{ getLogTitle(log) }}</h4>
            <p>{{ log.details }}</p>
            <div class="platform-info">
              <el-tag
                size="small"
                :type="getPlatformType(log.platformInfo?.platform)"
              >
                {{ getPlatformLabel(log.platformInfo?.platform) }}
              </el-tag>
              <span>{{ log.platformInfo?.action }}</span>
              <el-tag
                size="small"
                :type="log.platformInfo?.status === 'success' ? 'success' : 'danger'"
              >
                {{ log.platformInfo?.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import type {
  LocalCategory,
  PlatformCategory,
  CategoryUpdateLog,
  PlatformType
} from '../types/category'

const route = useRoute()
const loading = ref(false)
const category = ref<LocalCategory>()
const selectedPlatform = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const selectedCategories = ref<PlatformCategory[]>([])
const platformCategories = ref<PlatformCategory[]>([])
const mappingLogs = ref<CategoryUpdateLog[]>([])

// 平台选项
const platforms = [
  { label: 'Shein', value: 'shein' },
  { label: 'Amazon', value: 'amazon' },
  { label: 'Shopify', value: 'shopify' }
]

// 过滤后的分类列表
const filteredCategories = computed(() => {
  if (!searchQuery.value) return platformCategories.value
  const query = searchQuery.value.toLowerCase()
  return platformCategories.value.filter(category => 
    category.name.toLowerCase().includes(query) ||
    category.originalId.toLowerCase().includes(query)
  )
})

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

// 获取映射状态类型
const getMappingStatusType = (status: string) => {
  const types: Record<string, string> = {
    mapped: 'success',
    unmapped: 'info',
    pending: 'warning',
    invalid: 'danger'
  }
  return types[status] || 'info'
}

// 获取映射状态文本
const getMappingStatusText = (status: string) => {
  const texts: Record<string, string> = {
    mapped: '已映射',
    unmapped: '未映射',
    pending: '待处理',
    invalid: '无效'
  }
  return texts[status] || status
}

// 获取平台标签类型
const getPlatformType = (platform?: string) => {
  if (!platform) return 'info'
  const types: Record<string, string> = {
    shein: 'success',
    amazon: 'warning',
    shopify: 'info'
  }
  return types[platform] || 'info'
}

// 获取平台显示名称
const getPlatformLabel = (platform?: string) => {
  if (!platform) return '-'
  const labels: Record<string, string> = {
    shein: 'Shein',
    amazon: 'Amazon',
    shopify: 'Shopify'
  }
  return labels[platform] || platform
}

// 获取日志类型
const getLogType = (action: string) => {
  const types: Record<string, string> = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    sync: 'info',
    mapping: 'primary'
  }
  return types[action] || 'info'
}

// 获取日志标题
const getLogTitle = (log: CategoryUpdateLog) => {
  const titles: Record<string, string> = {
    create: '创建映射',
    update: '更新映射',
    delete: '删除映射',
    sync: '同步映射',
    mapping: '建立映射'
  }
  return titles[log.action] || log.action
}

// 获取分类详情
const getCategoryDetail = async (id: string) => {
  try {
    // TODO: 调用API获取分类详情
    category.value = {
      id,
      name: '测试分类',
      code: 'TEST',
      source: 'local',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      status: 'active',
      level: 1,
      path: '/测试分类',
      parentId: null,
      operator: 'admin'
    }
  } catch (error) {
    ElMessage.error('获取分类详情失败')
  }
}

// 获取映射历史
const getMappingHistory = async () => {
  try {
    // TODO: 调用API获取映射历史
    mappingLogs.value = []
  } catch (error) {
    ElMessage.error('获取映射历史失败')
  }
}

// 刷新映射历史
const refreshHistory = () => {
  getMappingHistory()
}

// 处理平台变更
const handlePlatformChange = async (platform: string) => {
  if (!platform) return
  loading.value = true
  try {
    // TODO: 调用API获取平台分类
    platformCategories.value = []
    total.value = 0
  } catch (error) {
    ElMessage.error('获取平台分类失败')
  } finally {
    loading.value = false
  }
}

// 处理同步
const handleSync = async () => {
  if (!selectedPlatform.value) return
  try {
    await ElMessageBox.confirm(
      '确定要同步平台分类吗？这可能需要一些时间。',
      '同步确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    // TODO: 调用同步API
    ElMessage.success('同步成功')
    handlePlatformChange(selectedPlatform.value)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('同步失败')
    }
  }
}

// 处理选择变化
const handleSelectionChange = (selection: PlatformCategory[]) => {
  selectedCategories.value = selection
}

// 处理映射
const handleMap = async (category: PlatformCategory) => {
  try {
    // TODO: 调用映射API
    ElMessage.success('映射成功')
    handlePlatformChange(selectedPlatform.value)
    refreshHistory()
  } catch (error) {
    ElMessage.error('映射失败')
  }
}

// 处理取消映射
const handleUnmap = async (category: PlatformCategory) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消该映射吗？',
      '取消确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用取消映射API
    ElMessage.success('取消映射成功')
    handlePlatformChange(selectedPlatform.value)
    refreshHistory()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消映射失败')
    }
  }
}

// 处理批量映射
const handleBatchMap = async () => {
  if (!selectedCategories.value.length) return
  try {
    await ElMessageBox.confirm(
      `确定要批量映射选中的 ${selectedCategories.value.length} 个分类吗？`,
      '批量映射确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    // TODO: 调用批量映射API
    ElMessage.success('批量映射成功')
    handlePlatformChange(selectedPlatform.value)
    refreshHistory()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量映射失败')
    }
  }
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  handlePlatformChange(selectedPlatform.value)
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  handlePlatformChange(selectedPlatform.value)
}

// 初始化
onMounted(async () => {
  if (route.params.id) {
    await getCategoryDetail(route.params.id as string)
    await getMappingHistory()
  }
})
</script>

<style scoped lang="scss">
.category-mapping-container {
  padding: 20px;

  .mapping-content {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;

    .local-category {
      grid-row: span 2;

      .category-info {
        .info-item {
          margin-bottom: 12px;
          display: flex;
          align-items: center;

          .label {
            width: 100px;
            color: var(--el-text-color-secondary);
          }

          .value {
            flex: 1;
          }
        }
      }
    }

    .platform-mapping {
      .platform-selector {
        display: flex;
        gap: 12px;
      }

      .platform-categories {
        .search-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          .el-input {
            width: 240px;
          }
        }

        .category-name-cell {
          .name {
            margin-right: 8px;
          }

          .id {
            color: var(--el-text-color-secondary);
            font-size: 13px;
          }
        }

        .pagination {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
        }
      }

      .platform-empty {
        text-align: center;
        color: var(--el-text-color-secondary);
        padding: 40px 0;
      }
    }

    .mapping-history {
      .platform-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
