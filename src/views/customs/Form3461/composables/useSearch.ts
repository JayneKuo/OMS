import { ref, computed } from 'vue'
import type { Form3461SearchFormState, Form3461TableItem } from '../types'
import { useTableData } from './useTableData'

export const useSearch = () => {
  const { tableData } = useTableData()
  
  // 初始化搜索表单
  const searchForm = ref<Form3461SearchFormState>({
    entryNo: '',
    importerNo: '',
    entryType: '',
    portOfEntry: '',
    bondType: '',
    dateRange: null,
    status: ''
  })
  
  // 分页配置
  const pagination = ref({
    currentPage: 1,
    pageSize: 10
  })
  
  // 高级搜索显示状态
  const showAdvancedSearch = ref(false)
  
  // 过滤数据
  const filteredTableData = computed(() => {
    let result = tableData.value
    
    // 按报关单号筛选
    if (searchForm.value.entryNo) {
      result = result.filter(item => 
        item.entryNo.toLowerCase().includes(searchForm.value.entryNo.toLowerCase())
      )
    }
    
    // 按进口商编号筛选
    if (searchForm.value.importerNo) {
      result = result.filter(item => 
        item.importerNo.toLowerCase().includes(searchForm.value.importerNo.toLowerCase())
      )
    }
    
    // 按报关类型筛选
    if (searchForm.value.entryType) {
      result = result.filter(item => 
        item.entryType === searchForm.value.entryType
      )
    }
    
    // 按入境口岸筛选
    if (searchForm.value.portOfEntry) {
      result = result.filter(item => 
        item.portOfEntry === searchForm.value.portOfEntry
      )
    }
    
    // 按保证金类型筛选
    if (searchForm.value.bondType) {
      result = result.filter(item => 
        item.bondType === searchForm.value.bondType
      )
    }
    
    // 按状态筛选
    if (searchForm.value.status) {
      result = result.filter(item => 
        item.status === searchForm.value.status
      )
    }
    
    // 按日期范围筛选
    if (searchForm.value.dateRange) {
      const [startDate, endDate] = searchForm.value.dateRange
      result = result.filter(item => {
        const itemDate = new Date(item.entryDate)
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
      })
    }
    
    // 分页
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return result.slice(start, end)
  })
  
  // 处理搜索
  const handleSearch = () => {
    pagination.value.currentPage = 1
  }
  
  // 处理输入
  const handleInput = (field: keyof Form3461SearchFormState, event: Event) => {
    const target = event.target as HTMLInputElement
    searchForm.value[field] = target.value
  }
  
  // 清除输入
  const clearInput = (field: keyof Form3461SearchFormState) => {
    searchForm.value[field] = ''
  }
  
  // 切换高级搜索
  const toggleAdvancedSearch = () => {
    showAdvancedSearch.value = !showAdvancedSearch.value
  }
  
  // 处理页码变化
  const handlePageChange = (page: number) => {
    pagination.value.currentPage = page
  }
  
  // 处理每页条数变化
  const handleSizeChange = (size: number) => {
    pagination.value.pageSize = size
    pagination.value.currentPage = 1
  }
  
  return {
    searchForm,
    pagination,
    showAdvancedSearch,
    filteredTableData,
    handleSearch,
    handleInput,
    clearInput,
    toggleAdvancedSearch,
    handlePageChange,
    handleSizeChange
  }
} 