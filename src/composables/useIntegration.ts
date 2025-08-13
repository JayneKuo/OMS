import { ref, computed } from 'vue'
import type { Integration } from '@/types/integration'

export function useIntegration() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const integrations = ref<Integration[]>([])
  const filterType = ref('')
  const filterStatus = ref('')
  const sortDesc = ref(true)
  const searchQuery = ref('')

  // 过滤和排序的集成列表
  const filteredIntegrations = computed(() => {
    let result = [...integrations.value]

    if (filterType.value) {
      result = result.filter(item => item.type.toLowerCase() === filterType.value.toLowerCase())
    }

    if (filterStatus.value) {
      result = result.filter(item => item.status === filterStatus.value)
    }

    result.sort((a, b) => {
      const aId = typeof a.id === 'number' ? a.id : parseInt(a.id)
      const bId = typeof b.id === 'number' ? b.id : parseInt(b.id)
      return sortDesc.value ? bId - aId : aId - bId
    })

    return result
  })

  // 处理集成状态变更
  const handleStatusChange = async (integration: Integration, enabled: boolean) => {
    try {
      loading.value = true
      error.value = null
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = integrations.value.findIndex(item => item.id === integration.id)
      if (index !== -1) {
        integrations.value[index] = {
          ...integration,
          status: enabled ? 'connected' : 'disabled',
          enabled
        }
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '操作失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 删除集成
  const deleteIntegration = async (integration: Integration) => {
    try {
      loading.value = true
      error.value = null
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      integrations.value = integrations.value.filter(item => item.id !== integration.id)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 初始化集成列表
  const initIntegrations = (data: Integration[]) => {
    integrations.value = data
  }

  return {
    loading,
    error,
    integrations,
    filterType,
    filterStatus,
    sortDesc,
    searchQuery,
    filteredIntegrations,
    handleStatusChange,
    deleteIntegration,
    initIntegrations
  }
} 