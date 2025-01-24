import { ref } from 'vue'
import type { PaginationState } from '../types'

export function useSearch<T extends Record<string, any>>(initialForm: T) {
  // 搜索表单状态
  const searchForm = ref<T>({ ...initialForm })
  
  // 分页状态
  const pagination = ref<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  
  // 高级搜索显示状态
  const showAdvancedSearch = ref(false)
  
  // 重置搜索表单
  const resetSearch = () => {
    searchForm.value = { ...initialForm }
    pagination.value.currentPage = 1
    handleSearch()
  }
  
  // 切换高级搜索显示状态
  const toggleAdvancedSearch = () => {
    showAdvancedSearch.value = !showAdvancedSearch.value
  }
  
  // 处理搜索
  const handleSearch = () => {
    // 这里需要实现具体的搜索逻辑
    console.log('Search with:', searchForm.value)
  }
  
  // 处理分页变化
  const handlePageChange = (page: number) => {
    pagination.value.currentPage = page
    handleSearch()
  }
  
  // 处理每页条数变化
  const handleSizeChange = (size: number) => {
    pagination.value.pageSize = size
    pagination.value.currentPage = 1
    handleSearch()
  }

  return {
    searchForm,
    pagination,
    showAdvancedSearch,
    resetSearch,
    toggleAdvancedSearch,
    handleSearch,
    handlePageChange,
    handleSizeChange
  }
} 