import type {
  LocalCategory,
  CategoryTreeNode,
  CategoryMapping,
  CategoryUpdateLog,
  CategoryQueryParams,
  CategoryStats
} from '@/views/product/types/category'
import { defaultCategories, flattenCategories, getCategoryStatistics } from '@/views/product/category/mock'

// 获取分类树
export function getCategoryTree() {
  return Promise.resolve({
    code: 200,
    data: defaultCategories
  })
}

// 获取分类列表
export function getCategoryList(params: CategoryQueryParams) {
  // 使用模拟数据
  const allCategories = flattenCategories(defaultCategories)
  let filteredCategories = [...allCategories]

  // 应用搜索过滤
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredCategories = filteredCategories.filter(
      category => category.name.toLowerCase().includes(keyword) ||
                  category.code.toLowerCase().includes(keyword)
    )
  }

  // 应用平台过滤
  if (params.platform) {
    filteredCategories = filteredCategories.filter(
      category => category.mappings?.some(m => m.platform === params.platform)
    )
  }

  // 应用映射状态过滤
  if (params.mappingStatus) {
    filteredCategories = filteredCategories.filter(category => {
      if (params.mappingStatus === 'mapped') {
        return category.mappings?.length > 0
      } else if (params.mappingStatus === 'unmapped') {
        return !category.mappings?.length
      }
      return false
    })
  }

  // 应用时间过滤
  if (params.startTime) {
    filteredCategories = filteredCategories.filter(
      category => new Date(category.createTime) >= new Date(params.startTime!)
    )
  }
  if (params.endTime) {
    filteredCategories = filteredCategories.filter(
      category => new Date(category.createTime) <= new Date(params.endTime!)
    )
  }

  // 计算分页
  const start = ((params.page || 1) - 1) * (params.pageSize || 20)
  const end = start + (params.pageSize || 20)
  const paginatedCategories = filteredCategories.slice(start, end)

  return Promise.resolve({
    code: 200,
    data: {
      list: paginatedCategories,
      total: filteredCategories.length
    }
  })
}

// 获取分类统计信息
export function getCategoryStats() {
  return Promise.resolve({
    code: 200,
    data: getCategoryStatistics()
  })
}

// 获取分类详情
export function getCategoryDetail(id: string) {
  const allCategories = flattenCategories(defaultCategories)
  const category = allCategories.find(c => c.id === id)
  
  if (!category) {
    return Promise.reject(new Error('Category not found'))
  }

  return Promise.resolve({
    code: 200,
    data: category
  })
}

// 创建分类
export function createCategory(data: Partial<LocalCategory>) {
  const newId = Date.now().toString()
  const newCategory: LocalCategory = {
    id: newId,
    name: data.name!,
    code: data.code!,
    parentId: data.parentId,
    level: data.level!,
    path: data.parentId ? `${getParentPath(data.parentId)}/${data.name}` : `/${data.name}`,
    sort: data.sort || 0,
    status: data.status || 'active',
    source: 'local',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    operator: 'current_user'
  }

  // 在实际应用中，这里应该调用后端API
  return Promise.resolve({
    code: 200,
    data: newCategory
  })
}

// 更新分类
export function updateCategory(id: string, data: Partial<LocalCategory>) {
  const allCategories = flattenCategories(defaultCategories)
  const category = allCategories.find(c => c.id === id)
  
  if (!category) {
    return Promise.reject(new Error('Category not found'))
  }

  const updatedCategory = {
    ...category,
    ...data,
    updateTime: new Date().toISOString()
  }

  return Promise.resolve({
    code: 200,
    data: updatedCategory
  })
}

// 删除分类
export function deleteCategory(id: string) {
  return Promise.resolve({
    code: 200,
    data: null
  })
}

// 批量删除分类
export function batchDeleteCategories(ids: string[]) {
  return Promise.resolve({
    code: 200,
    data: null
  })
}

// 获取分类映射列表
export function getCategoryMappings(categoryId: string) {
  const allCategories = flattenCategories(defaultCategories)
  const category = allCategories.find(c => c.id === categoryId)
  
  if (!category) {
    return Promise.reject(new Error('Category not found'))
  }

  return Promise.resolve({
    code: 200,
    data: category.mappings || []
  })
}

// 创建分类映射
export function createCategoryMapping(categoryId: string, data: Partial<CategoryMapping>) {
  const allCategories = flattenCategories(defaultCategories)
  const category = allCategories.find(c => c.id === categoryId)
  
  if (!category) {
    return Promise.reject(new Error('Category not found'))
  }

  const newMapping: CategoryMapping = {
    id: Date.now().toString(),
    localCategoryId: categoryId,
    platformCategoryId: data.platformCategoryId!,
    platform: data.platform!,
    status: 'mapped',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    operator: 'current_user',
    autoMapped: false,
    lastSyncTime: new Date().toISOString(),
    syncStatus: 'success'
  }

  if (!category.mappings) {
    category.mappings = []
  }
  category.mappings.push(newMapping)

  return Promise.resolve({
    code: 200,
    data: newMapping
  })
}

// 批量创建分类映射
export function batchCreateMappings(categoryId: string, mappings: Partial<CategoryMapping>[]) {
  const results = mappings.map(mapping => createCategoryMapping(categoryId, mapping))
  return Promise.all(results)
}

// 删除分类映射
export function deleteCategoryMapping(categoryId: string, mappingId: string) {
  const allCategories = flattenCategories(defaultCategories)
  const category = allCategories.find(c => c.id === categoryId)
  
  if (!category || !category.mappings) {
    return Promise.reject(new Error('Category or mapping not found'))
  }

  const index = category.mappings.findIndex(m => m.id === mappingId)
  if (index === -1) {
    return Promise.reject(new Error('Mapping not found'))
  }

  category.mappings.splice(index, 1)

  return Promise.resolve({
    code: 200,
    data: null
  })
}

// 获取平台分类列表
export function getPlatformCategories(platform: string) {
  // 模拟平台分类数据
  const platformCategories = defaultCategories.map(category => ({
    id: `${platform}_${category.id}`,
    name: category.name,
    platform,
    originalId: category.code,
    path: category.path,
    level: category.level,
    parentId: category.parentId,
    lastSyncTime: new Date().toISOString(),
    status: 'active' as const
  }))

  return Promise.resolve({
    code: 200,
    data: platformCategories
  })
}

// 同步平台分类
export function syncPlatformCategories(platform: string) {
  return Promise.resolve({
    code: 200,
    data: {
      success: true,
      syncTime: new Date().toISOString()
    }
  })
}

// 获取分类更新日志
export function getCategoryLogs(categoryId: string) {
  // 模拟日志数据
  const logs: CategoryUpdateLog[] = [
    {
      id: '1',
      categoryId,
      action: 'create',
      timestamp: '2024-01-01T00:00:00Z',
      operator: 'system',
      details: '创建系统预设分类'
    }
  ]

  return Promise.resolve({
    code: 200,
    data: logs
  })
}

// 生成分类编码
export function generateCategoryCode(name: string) {
  return Promise.resolve({
    code: 200,
    data: {
      code: name.toUpperCase().replace(/\s+/g, '_')
    }
  })
}

// 检查分类编码是否可用
export function checkCategoryCode(code: string) {
  const allCategories = flattenCategories(defaultCategories)
  const exists = allCategories.some(c => c.code === code)

  return Promise.resolve({
    code: 200,
    data: {
      available: !exists
    }
  })
}

// 获取父分类路径
function getParentPath(parentId: string): string {
  const allCategories = flattenCategories(defaultCategories)
  const parent = allCategories.find(c => c.id === parentId)
  return parent ? parent.path : ''
}