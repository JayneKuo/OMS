import { ref, computed } from 'vue'
import type { SearchFormState, SearchParams, TableItem } from '../types'
import { ElMessage } from 'element-plus'
import { useTableData } from './useTableData'

export function useSearch() {
  const { tableData } = useTableData()
  
  // 搜索表单状态
  const searchForm = ref<SearchFormState>({
    admissionNo: '',
    admissionType: '',
    portOfEntry: '',
    ftzNo: '',
    importerName: '',
    operatorName: '',
    dateRange: null,
    status: ''
  })

  // 高级搜索显示状态
  const showAdvancedSearch = ref(false)

  // 分页配置
  const pagination = ref({
    currentPage: 1,
    pageSize: 10
  })

  // 过滤后的数据
  const filteredTableData = computed(() => {
    let result = [...tableData.value]

    // 按条件过滤
    if (searchForm.value.admissionNo) {
      result = result.filter(item => 
        item.admissionNo.toLowerCase().includes(searchForm.value.admissionNo.toLowerCase())
      )
    }

    if (searchForm.value.admissionType) {
      result = result.filter(item => 
        item.admissionType === searchForm.value.admissionType
      )
    }

    if (searchForm.value.portOfEntry) {
      result = result.filter(item => 
        item.portOfEntry === searchForm.value.portOfEntry
      )
    }

    if (searchForm.value.ftzNo) {
      result = result.filter(item => 
        item.ftzNo.toLowerCase().includes(searchForm.value.ftzNo.toLowerCase())
      )
    }

    if (searchForm.value.importerName) {
      result = result.filter(item => 
        item.importerName.toLowerCase().includes(searchForm.value.importerName.toLowerCase())
      )
    }

    if (searchForm.value.operatorName) {
      result = result.filter(item => 
        item.operatorName.toLowerCase().includes(searchForm.value.operatorName.toLowerCase())
      )
    }

    if (searchForm.value.status) {
      result = result.filter(item => 
        item.status === searchForm.value.status
      )
    }

    if (searchForm.value.dateRange) {
      const [startDate, endDate] = searchForm.value.dateRange
      result = result.filter(item => {
        const itemDate = new Date(item.admissionDate)
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
      })
    }

    // 分页
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    
    return result.slice(start, end)
  })

  // 过滤后的总数
  const filteredTotal = computed(() => {
    let result = [...tableData.value]

    if (searchForm.value.admissionNo) {
      result = result.filter(item => 
        item.admissionNo.toLowerCase().includes(searchForm.value.admissionNo.toLowerCase())
      )
    }

    if (searchForm.value.admissionType) {
      result = result.filter(item => 
        item.admissionType === searchForm.value.admissionType
      )
    }

    if (searchForm.value.portOfEntry) {
      result = result.filter(item => 
        item.portOfEntry === searchForm.value.portOfEntry
      )
    }

    if (searchForm.value.ftzNo) {
      result = result.filter(item => 
        item.ftzNo.toLowerCase().includes(searchForm.value.ftzNo.toLowerCase())
      )
    }

    if (searchForm.value.importerName) {
      result = result.filter(item => 
        item.importerName.toLowerCase().includes(searchForm.value.importerName.toLowerCase())
      )
    }

    if (searchForm.value.operatorName) {
      result = result.filter(item => 
        item.operatorName.toLowerCase().includes(searchForm.value.operatorName.toLowerCase())
      )
    }

    if (searchForm.value.status) {
      result = result.filter(item => 
        item.status === searchForm.value.status
      )
    }

    if (searchForm.value.dateRange) {
      const [startDate, endDate] = searchForm.value.dateRange
      result = result.filter(item => {
        const itemDate = new Date(item.admissionDate)
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
      })
    }

    return result.length
  })

  // 处理搜索
  const handleSearch = async () => {
    // 日期范围验证
    if (searchForm.value.dateRange) {
      const [startDate, endDate] = searchForm.value.dateRange
      if (new Date(endDate) < new Date(startDate)) {
        ElMessage.warning('Please select a valid date range')
        return
      }
    }

    // 重置分页
    pagination.value.currentPage = 1
  }

  // 处理输入
  const handleInput = (field: keyof SearchFormState, event: Event) => {
    const target = event.target as HTMLInputElement
    searchForm.value[field] = target.value
    handleSearch()
  }

  // 清除输入
  const clearInput = (field: keyof SearchFormState) => {
    searchForm.value[field] = ''
    handleSearch()
  }

  // 切换高级搜索
  const toggleAdvancedSearch = () => {
    showAdvancedSearch.value = !showAdvancedSearch.value
  }

  // 处理分页变化
  const handlePageChange = (page: number) => {
    pagination.value.currentPage = page
  }

  // 处理每页条数变化
  const handleSizeChange = (size: number) => {
    pagination.value.pageSize = size
    pagination.value.currentPage = 1
  }

  // 处理日期变化
  const handleDateChange = () => {
    handleSearch()
  }

  return {
    searchForm,
    pagination,
    showAdvancedSearch,
    filteredTableData,
    filteredTotal,
    handleSearch,
    handleInput,
    clearInput,
    toggleAdvancedSearch,
    handlePageChange,
    handleSizeChange,
    handleDateChange
  }
} 