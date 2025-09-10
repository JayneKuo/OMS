<template>
  <div class="category-list-container">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stats-card">
            <template #header>
              <div class="card-header">
                <span>分类总数</span>
                <el-tag>{{ stats.total }}</el-tag>
              </div>
            </template>
            <div class="card-content">
              <div class="stat-item">
                <span>已映射</span>
                <el-tag type="success" size="small">{{ stats.mapped }}</el-tag>
              </div>
              <div class="stat-item">
                <span>未映射</span>
                <el-tag type="warning" size="small">{{ stats.unmapped }}</el-tag>
              </div>
              <div class="stat-item">
                <span>待处理</span>
                <el-tag type="info" size="small">{{ stats.pending }}</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <el-card shadow="hover" class="platform-stats-card">
            <template #header>
              <div class="card-header">
                <span>平台分类统计</span>
                <span class="last-sync">
                  最后同步: {{ formatDate(stats.lastSyncTime) }}
                  <el-tag 
                    size="small" 
                    :type="stats.syncStatus === 'success' ? 'success' : 'danger'"
                  >
                    {{ stats.syncStatus === 'success' ? '同步成功' : '同步失败' }}
                  </el-tag>
                </span>
              </div>
            </template>
            <div class="platform-stats">
              <div 
                v-for="(platform, name) in stats.byPlatform" 
                :key="name"
                class="platform-stat"
              >
                <div class="platform-name">
                  <el-tag :type="getPlatformType(name)">{{ getPlatformLabel(name) }}</el-tag>
                </div>
                <div class="platform-numbers">
                  <span>总数: {{ platform.total }}</span>
                  <span>已映射: {{ platform.mapped }}</span>
                  <span>未映射: {{ platform.unmapped }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-area">
        <el-input
          v-model="query.keyword"
          placeholder="搜索分类名称/ID"
          clearable
          @change="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="query.platform"
          placeholder="选择平台"
          clearable
          @change="handleSearch"
        >
          <el-option
            v-for="platform in platforms"
            :key="platform.value"
            :label="platform.label"
            :value="platform.value"
          />
        </el-select>
        <el-select
          v-model="query.mappingStatus"
          placeholder="映射状态"
          clearable
          @change="handleSearch"
        >
          <el-option label="已映射" value="mapped" />
          <el-option label="未映射" value="unmapped" />
          <el-option label="待处理" value="pending" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dateShortcuts"
          @change="handleDateChange"
        />
      </div>
      <div class="action-area">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增分类
        </el-button>
        <el-button type="warning" @click="handleSync">
          <el-icon><RefreshRight /></el-icon>同步平台分类
        </el-button>
      </div>
    </div>

    <!-- 分类表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="categoryTree"
      row-key="id"
      default-expand-all
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="分类ID" width="120" />
      <el-table-column prop="name" label="分类名称" min-width="300">
        <template #default="{ row }">
          <div 
            class="category-name-cell" 
            :class="[
              `level-${row.level}`, 
              { 
                'is-leaf': !row.children?.length,
                'is-active': isActive(row)
              }
            ]"
            @click="handleRowClick(row)"
          >
            <div class="level-line" :style="{ left: `${(row.level - 1) * 24}px` }"></div>
            <div class="content" :style="{ paddingLeft: `${row.level * 24}px` }">
              <el-tag 
                size="small" 
                :type="getLevelType(row.level)"
                class="level-tag"
              >
                {{ `${row.level}级` }}
              </el-tag>
              <span class="name">{{ row.name }}</span>
              <span class="code">({{ row.code }})</span>
              <el-tooltip 
                v-if="row.parentId"
                effect="dark"
                placement="right"
              >
                <template #content>
                  <div class="parent-path">
                    {{ getParentPath(row) }}
                  </div>
                </template>
                <el-icon class="parent-icon"><Connection /></el-icon>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="平台分类" min-width="300">
        <template #default="{ row }">
          <div class="platform-mappings">
            <el-space wrap>
              <el-tag 
                v-for="platform in platforms" 
                :key="platform.value"
                :type="getPlatformType(platform.value)"
                class="platform-tag"
                :class="{ 'has-mapping': row.mappings?.find(m => m.platform === platform.value) }"
              >
                <span class="platform-label">{{ platform.label }}</span>
                <template v-if="row.mappings?.find(m => m.platform === platform.value)">
                  <el-tooltip 
                    effect="dark" 
                    placement="top"
                    :content="row.mappings.find(m => m.platform === platform.value)?.platformCategoryId"
                  >
                    <span class="mapping-info">
                      {{ row.mappings.find(m => m.platform === platform.value)?.platformCategoryName }}
                      <el-tag size="small" class="mapping-id">
                        {{ row.mappings.find(m => m.platform === platform.value)?.platformCategoryId }}
                      </el-tag>
                    </span>
                  </el-tooltip>
                </template>
                <span v-else class="no-mapping">未映射</span>
              </el-tag>
            </el-space>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="更新信息" width="200">
        <template #default="{ row }">
          <div class="update-info">
            <div class="time-info">
              <el-tooltip :content="'创建时间: ' + formatDate(row.createTime)">
                <div class="info-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(row.createTime, 'short') }}</span>
                </div>
              </el-tooltip>
              <el-tooltip :content="'更新时间: ' + formatDate(row.updateTime)">
                <div class="info-item">
                  <el-icon><Timer /></el-icon>
                  <span>{{ formatDate(row.updateTime, 'short') }}</span>
                </div>
              </el-tooltip>
            </div>
            <div class="operator-info">
              <el-icon><User /></el-icon>
              <span>{{ row.operator }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="'active'"
            :inactive-value="'inactive'"
            inline-prompt
            :active-text="'启用'"
            :inactive-text="'禁用'"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <div class="operation-buttons">
            <el-button 
              link 
              type="primary" 
              @click="handleMapping(row)"
            >
              映射
            </el-button>
            <el-button 
              v-if="row.level < maxLevel"
              link 
              type="success" 
              @click="handleAddSubCategory(row)"
            >
              添加子分类
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 映射对话框 -->
    <category-mapping-dialog
      v-model="mappingDialog.visible"
      :category="mappingDialog.category"
      @success="handleMappingSuccess"
    />

    <!-- 新增分类对话框 -->
    <el-dialog
      v-model="addDialog.visible"
      title="新增分类"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addFormRef"
        :model="addDialog.form"
        :rules="addDialog.rules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input 
            v-model="addDialog.form.name"
            placeholder="请输入分类名称"
          />
        </el-form-item>
        <el-form-item label="父级分类" prop="parentId">
          <el-cascader
            v-model="addDialog.form.parentId"
            :options="getCategoryOptions(categoryTree)"
            :props="{
              checkStrictly: true,
              emitPath: false
            }"
            placeholder="请选择父级分类"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="addDialog.form.status"
            :active-value="'active'"
            :inactive-value="'inactive'"
            inline-prompt
            :active-text="'启用'"
            :inactive-text="'禁用'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd(addFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, RefreshRight, Timer, Calendar, User } from '@element-plus/icons-vue'
import type {
  LocalCategory,
  CategoryUpdateLog,
  CategoryQueryParams,
  CategoryStats,
  CategoryMapping,
  PlatformType
} from '../types/category'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryMappingDialog from '../components/CategoryMappingDialog.vue'
// 导入mock数据
import { defaultCategories, getCategoryStatistics } from './mock'

const router = useRouter()

// 状态定义
const loading = ref(false)
const total = ref(0)
const categoryTree = ref<LocalCategory[]>([])
const selectedRows = ref<LocalCategory[]>([])
const maxLevel = 4 // 最大层级限制
const activeId = ref<string>('') // 当前操作的分类ID
const expandedRows = ref<string[]>([]) // 展开的行

// 获取分类的所有父级信息
const getParentCategories = (category: LocalCategory): LocalCategory[] => {
  const parents: LocalCategory[] = []
  let currentId = category.parentId
  const flatCategories = flattenCategories(categoryTree.value)
  
  while (currentId) {
    const parent = flatCategories.find(c => c.id === currentId)
    if (parent) {
      parents.unshift(parent)
      currentId = parent.parentId
    } else {
      break
    }
  }
  return parents
}

// 获取分类的所有父级ID
const getParentIds = (category: LocalCategory): string[] => {
  return getParentCategories(category).map(c => c.id)
}

// 获取分类的完整路径
const getParentPath = (category: LocalCategory): string => {
  const parents = getParentCategories(category)
  return parents.map(p => p.name).join(' / ')
}

// 获取分类及其所有子分类的ID
const getCategoryAndChildrenIds = (category: LocalCategory): string[] => {
  const ids: string[] = [category.id]
  const getChildrenIds = (items: LocalCategory[]) => {
    items.forEach(item => {
      ids.push(item.id)
      if (item.children?.length) {
        getChildrenIds(item.children)
      }
    })
  }
  if (category.children?.length) {
    getChildrenIds(category.children)
  }
  return ids
}

// 处理行点击
const handleRowClick = (row: LocalCategory) => {
  activeId.value = row.id
  // 获取当前分类及其所有子分类的ID
  const relatedIds = getCategoryAndChildrenIds(row)
  // 展开相关行
  expandedRows.value = relatedIds
}

// 判断分类是否处于活动状态（包括父级）
const isActive = (category: LocalCategory): boolean => {
  if (activeId.value === category.id) return true
  if (activeId.value) {
    const activeCategory = flattenCategories(categoryTree.value).find(c => c.id === activeId.value)
    if (activeCategory) {
      return getParentIds(activeCategory).includes(category.id)
    }
  }
  return false
}

// 获取层级类型
const getLevelType = (level: number) => {
  const types = ['', 'success', 'warning', 'danger', 'info']
  return types[level] || 'info'
}

// 查询参数
const query = reactive<CategoryQueryParams>({
  page: 1,
  pageSize: 20
})

// 加载分类列表
const loadCategories = async () => {
  loading.value = true
  try {
    // 使用mock数据
    categoryTree.value = defaultCategories
    total.value = countTotalCategories(defaultCategories)
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

// 计算分类总数
const countTotalCategories = (categories: LocalCategory[]): number => {
  let count = categories.length
  for (const category of categories) {
    if (category.children?.length) {
      count += countTotalCategories(category.children)
    }
  }
  return count
}

// 加载统计数据
const loadStats = async () => {
  try {
    // 使用mock数据
    const mockStats = getCategoryStatistics()
    Object.assign(stats, mockStats)
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

// 平台选项
const platforms = [
  { label: 'Shein', value: 'shein' },
  { label: 'Amazon', value: 'amazon' },
  { label: 'Shopify', value: 'shopify' }
]

// 统计数据
const stats = reactive<CategoryStats>({
  total: 0,
  mapped: 0,
  unmapped: 0,
  pending: 0,
  byPlatform: {
    shein: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
    amazon: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
    shopify: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
    local: { total: 0, mapped: 0, unmapped: 0, pending: 0 }
  },
  byStatus: {
    active: 0,
    inactive: 0,
    pending: 0,
    deleted: 0
  }
})

// 历史记录对话框
const historyDialog = reactive({
  visible: false,
  logs: [] as CategoryUpdateLog[]
})

// 获取平台标签类型
const getPlatformType = (platform: PlatformType) => {
  const types: Record<string, string> = {
    shein: 'success',
    amazon: 'warning',
    shopify: 'info',
    local: 'default'
  }
  return types[platform] || 'info'
}

// 获取平台显示名称
const getPlatformLabel = (platform: PlatformType) => {
  const labels: Record<string, string> = {
    shein: 'Shein',
    amazon: 'Amazon',
    shopify: 'Shopify',
    local: '本地'
  }
  return labels[platform] || platform
}

// 获取平台分类名称
const getPlatformCategoryName = (mapping: CategoryMapping) => {
  // TODO: 实现从缓存或状态获取平台分类名称
  return `分类名称 (${mapping.platformCategoryId})`
}

// 格式化日期
const formatDate = (date?: string, format: 'full' | 'short' = 'full') => {
  if (!date) return '-'
  const d = new Date(date)
  if (format === 'short') {
    return d.toLocaleDateString('zh-CN')
  }
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    pending: 'warning',
    deleted: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: '启用',
    inactive: '禁用',
    pending: '待处理',
    deleted: '已删除'
  }
  return labels[status] || status
}

// 获取日志类型
const getLogType = (action: string) => {
  const types: Record<string, string> = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    sync: 'info',
    mapping: 'primary',
    import: 'success'
  }
  return types[action] || 'info'
}

// 获取日志标题
const getLogTitle = (log: CategoryUpdateLog) => {
  const titles: Record<string, string> = {
    create: '创建分类',
    update: '更新分类',
    delete: '删除分类',
    sync: '同步分类',
    mapping: '映射分类',
    import: '导入分类'
  }
  return titles[log.action] || log.action
}

// 处理搜索
const handleSearch = () => {
  query.page = 1
  loadCategories()
}

// 处理日期变化
const handleDateChange = (dates: [Date, Date] | null) => {
  if (dates) {
    query.startTime = dates[0].toISOString()
    query.endTime = dates[1].toISOString()
  } else {
    delete query.startTime
    delete query.endTime
  }
  handleSearch()
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  query.pageSize = size
  loadCategories()
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  query.page = page
  loadCategories()
}

// 处理选择变化
const handleSelectionChange = (rows: LocalCategory[]) => {
  selectedRows.value = rows
}

// 生成新的分类ID
const generateNewId = (parentId?: string) => {
  const timestamp = Date.now()
  return parentId ? `${parentId}-${timestamp}` : timestamp.toString()
}

// 创建新分类
const createNewCategory = (params: {
  name: string
  code: string
  parentId?: string
  level: number
}): LocalCategory => {
  const { name, code, parentId, level } = params
  return {
    id: generateNewId(parentId),
    name,
    code,
    parentId,
    level,
    path: parentId ? `${parentId}/${name}` : `/${name}`,
    sort: 1,
    status: 'active',
    source: 'local',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    operator: 'system',
    children: []
  }
}

// 新增分类对话框
const addDialog = reactive({
  visible: false,
  form: {
    name: '',
    parentId: '',
    status: 'active'
  },
  rules: {
    name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    parentId: []
  }
})

// 获取分类选项
const getCategoryOptions = (categories: LocalCategory[], level = 1): any[] => {
  return categories.map(category => {
    const option = {
      value: category.id,
      label: '　'.repeat(level - 1) + category.name,
      disabled: category.level >= maxLevel
    }
    if (category.children?.length) {
      option.children = getCategoryOptions(category.children, level + 1)
    }
    return option
  })
}

// 处理添加
const handleAdd = () => {
  addDialog.form = {
    name: '',
    parentId: '',
    status: 'active'
  }
  addDialog.visible = true
}

// 处理状态变更
const handleStatusChange = async (category: LocalCategory) => {
  // 如果是禁用操作，需要连同子分类一起禁用
  if (category.status === 'inactive' && category.children?.length) {
    await ElMessageBox.confirm(
      '禁用父分类将同时禁用所有子分类，是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 递归更新子分类状态
      const updateChildrenStatus = (children: LocalCategory[]) => {
        children.forEach(child => {
          child.status = 'inactive'
          if (child.children?.length) {
            updateChildrenStatus(child.children)
          }
        })
      }
      if (category.children) {
        updateChildrenStatus(category.children)
      }
      ElMessage.success('状态更新成功')
    }).catch(() => {
      // 取消操作，恢复状态
      category.status = 'active'
    })
  } else {
    ElMessage.success('状态更新成功')
  }
}

// 确认添加分类
const confirmAdd = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      const { name, parentId, status } = addDialog.form
      let level = 1
      let parent: LocalCategory | undefined
      
      if (parentId) {
        const flatList = flattenCategories(categoryTree.value)
        parent = flatList.find(c => c.id === parentId)
        if (parent) {
          level = parent.level + 1
        }
      }

      const code = name.toUpperCase().replace(/\s+/g, '_')
      const newCategory = createNewCategory({
        name,
        code,
        parentId,
        level,
        status
      })

      if (parent && parent.children) {
        parent.children.push(newCategory)
      } else {
        categoryTree.value.push(newCategory)
      }

      addDialog.visible = false
      ElMessage.success('添加成功')
    }
  })
}

// 处理添加子分类
const handleAddSubCategory = async (parentCategory: LocalCategory) => {
  if (parentCategory.level >= maxLevel) {
    ElMessage.warning(`最多支持${maxLevel}级分类`)
    return
  }

  try {
    await ElMessageBox.prompt('请输入子分类名称', '新增子分类', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '分类名称不能为空'
    }).then(({ value: name }) => {
      const code = `${parentCategory.code}_${name.toUpperCase().replace(/\s+/g, '_')}`
      const newCategory = createNewCategory({
        name,
        code,
        parentId: parentCategory.id,
        level: parentCategory.level + 1
      })
      
      // 确保父分类有children数组
      if (!parentCategory.children) {
        parentCategory.children = []
      }
      parentCategory.children.push(newCategory)
      ElMessage.success('添加成功')
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('添加失败')
    }
  }
}

// 处理导入
const handleImport = () => {
  // 创建隐藏的文件输入框
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls,.csv'
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        await importCategories(formData)
        ElMessage.success('导入成功')
        loadCategories()
        loadStats()
      } catch (error) {
        ElMessage.error('导入失败')
      }
    }
  }
  input.click()
}

// 处理同步
const handleSync = async (platform?: string) => {
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
    // Mock同步操作
    setTimeout(() => {
      ElMessage.success('同步成功')
      loadCategories()
      loadStats()
    }, 1000)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('同步失败')
    }
  }
}

// 处理批量操作
const handleBatchAction = async (command: string) => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请选择要操作的分类')
    return
  }

  switch (command) {
    case 'export':
      try {
        const ids = selectedRows.value.map(row => row.id)
        const response = await exportCategories({ ids })
        const blob = new Blob([response.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `categories_${new Date().getTime()}.xlsx`
        link.click()
        URL.revokeObjectURL(link.href)
      } catch (error) {
        ElMessage.error('导出失败')
      }
      break

    case 'delete':
      try {
        await ElMessageBox.confirm(
          `确定要删除选中的 ${selectedRows.value.length} 个分类吗？`,
          '批量删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const ids = selectedRows.value.map(row => row.id)
        await batchDeleteCategories(ids)
        ElMessage.success('删除成功')
        loadCategories()
        loadStats()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
      break

    case 'map':
      router.push({
        name: 'CategoryMapping',
        params: { id: selectedRows.value[0].id }
      })
      break

    default:
      break
  }
}

// 处理编辑
const handleEdit = (row: LocalCategory) => {
  router.push({
    name: 'EditCategory',
    params: { id: row.id }
  })
}

// 映射对话框
const mappingDialog = reactive({
  visible: false,
  category: null as LocalCategory | null
})

// 处理映射
const handleMapping = (row: LocalCategory) => {
  mappingDialog.category = row
  mappingDialog.visible = true
}

// 处理映射成功
const handleMappingSuccess = () => {
  loadCategories()
  loadStats()
}

// 处理查看历史
const handleViewHistory = async (row: LocalCategory) => {
  try {
    const { data } = await getCategoryLogs(row.id)
    historyDialog.logs = data
    historyDialog.visible = true
  } catch (error) {
    ElMessage.error('获取历史记录失败')
  }
}

// 处理删除
const handleDelete = (row: LocalCategory) => {
  ElMessageBox.confirm(
    '确定要删除该分类吗？相关的映射关系也会被删除。',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteCategory(row.id)
      ElMessage.success('删除成功')
      loadCategories()
      loadStats()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 初始化
onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadStats()
  ])
})
</script>

<style scoped lang="scss">
.category-list-container {
  padding: 20px;

  .stats-cards {
    margin-bottom: 20px;

    .stats-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-content {
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .platform-stats-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .last-sync {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--el-text-color-secondary);
        }
      }

      .platform-stats {
        display: flex;
        gap: 20px;

        .platform-stat {
          flex: 1;
          
          .platform-name {
            margin-bottom: 8px;
          }

          .platform-numbers {
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: 14px;
            color: var(--el-text-color-regular);
          }
        }
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .search-area {
      display: flex;
      gap: 12px;

      .el-input {
        width: 240px;
      }
    }

    .action-area {
      display: flex;
      gap: 12px;
    }
  }

  .category-name-cell {
    position: relative;
    width: 100%;
    height: 40px;
    cursor: pointer;
    
    .level-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 24px;
      border-left: 1px dashed var(--el-border-color-lighter);
      transition: all 0.3s;
      
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        width: 12px;
        height: 1px;
        background-color: var(--el-border-color-lighter);
        transition: all 0.3s;
      }
    }

    .content {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 100%;
      transition: all 0.3s;
      border-radius: 4px;
      
      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }

    .level-tag {
      flex-shrink: 0;
      min-width: 42px;
      text-align: center;
    }

    .name {
      font-weight: 500;
      color: var(--el-text-color-primary);
      transition: all 0.3s;
    }

    .code {
      color: var(--el-text-color-secondary);
      font-size: 13px;
      transition: all 0.3s;
    }

    .parent-icon {
      color: var(--el-text-color-secondary);
      font-size: 16px;
      margin-left: 4px;
      cursor: help;
    }

    &.is-leaf {
      .level-line {
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -1px;
          width: 1px;
          height: 50%;
          background-color: #fff;
        }
      }
    }

    &.is-active {
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: var(--el-color-primary-light-8);
        opacity: 0.15;
        pointer-events: none;
      }

      .level-line {
        border-left-color: var(--el-color-primary);
        border-left-style: solid;
        border-left-width: 2px;
        
        &::before {
          background-color: var(--el-color-primary);
          height: 2px;
        }
      }

      .content {
        background-color: var(--el-color-primary-light-9);
      }

      .name {
        color: var(--el-color-primary);
        font-weight: bold;
      }

      .code {
        color: var(--el-color-primary-light-3);
      }
    }
    
    &[data-expanded="true"] {
      background-color: var(--el-color-primary-light-9);
      opacity: 0.8;
    }
  }

  .parent-path {
    font-size: 13px;
    color: #fff;
    max-width: 300px;
    word-break: break-all;
  }

  .platform-mappings {
    .el-space {
      width: 100%;
    }

    .platform-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      margin: 2px;
      min-width: 200px;
      
      .platform-label {
        font-weight: bold;
        min-width: 60px;
      }

      .mapping-info {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .mapping-id {
        font-size: 12px;
        padding: 0 4px;
        background-color: var(--el-color-success-light-8);
        border-color: var(--el-color-success-light-5);
        color: var(--el-color-success);
      }

      &.has-mapping {
        background-color: var(--el-color-success-light-9);
        border-color: var(--el-color-success-light-5);
        color: var(--el-color-success-dark-2);
      }

      .no-mapping {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        margin-left: auto;
      }
    }

    .platform-mappings {
      .el-space {
        width: 100%;
      }

      .platform-tag {
        flex: 1;
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        margin: 2px;
        max-width: calc(33.33% - 4px);
        
        &.has-mapping {
          background-color: var(--el-color-success-light-8);
          border-color: var(--el-color-success-light-5);
          color: var(--el-color-success);
        }

        .no-mapping {
          color: var(--el-text-color-secondary);
          font-size: 12px;
          margin-left: 4px;
        }
      }
    }
  }

  .operation-buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-start;
    align-items: center;
  }

  .platform-mapping {
    font-size: 14px;
    color: var(--el-text-color-regular);

    .no-mapping {
      color: var(--el-text-color-secondary);
    }
  }

  .update-info {
    .time-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 4px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--el-text-color-regular);
        font-size: 13px;
      }
    }

    .operator-info {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

// 历史记录对话框样式
.el-timeline {
  .platform-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
  }

  .changes {
    margin-top: 8px;
    padding: 8px;
    background-color: var(--el-fill-color-lighter);
    border-radius: 4px;

    .change-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      .field {
        color: var(--el-text-color-secondary);
        font-weight: 500;
      }

      .old-value {
        color: var(--el-text-color-regular);
        text-decoration: line-through;
      }

      .new-value {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
