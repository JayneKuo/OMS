import { ref, reactive } from 'vue'
import type { ISFSearchFormState, PaginationState } from '../types'

export function useSearch(initialForm: ISFSearchFormState) {
  // 搜索表单状态
  const searchForm = reactive<ISFSearchFormState>({ ...initialForm })
  
  // 分页状态
  const pagination = reactive<PaginationState>({
    currentPage: 1,
    pageSize: 10
  })
  
  // 高级搜索显示状态
  const showAdvancedSearch = ref(false)
  
  // 重置搜索表单
  const resetSearch = () => {
    Object.assign(searchForm, initialForm)
    pagination.currentPage = 1
    handleSearch()
  }
  
  // 切换高级搜索显示状态
  const toggleAdvancedSearch = () => {
    showAdvancedSearch.value = !showAdvancedSearch.value
  }
  
  // 处理搜索
  const handleSearch = () => {
    pagination.currentPage = 1
    // 这里可以添加具体的搜索逻辑
    console.log('Search with:', searchForm)
  }
  
  // 处理分页变化
  const handlePageChange = (page: number) => {
    pagination.currentPage = page
    handleSearch()
  }
  
  // 处理每页条数变化
  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.currentPage = 1
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