import { ref, computed } from 'vue'
import { ReturnOrderStatus, ReturnAction } from '../types'

interface StatusConfig {
  label: string
  value: ReturnOrderStatus
  color: string
  availableActions: ReturnAction[]
}

type StatusConfigMap = Record<ReturnOrderStatus, StatusConfig>

export const useReturnStatus = (initialStatus: ReturnOrderStatus | null = null) => {
  const currentStatus = ref<ReturnOrderStatus | null>(initialStatus)

  const statusConfig: StatusConfigMap = {
    [ReturnOrderStatus.Created]: {
      label: 'Created',
      value: ReturnOrderStatus.Created,
      color: 'info',
      availableActions: [ReturnAction.Edit, ReturnAction.Approve, ReturnAction.Reject]
    },
    [ReturnOrderStatus.Pending]: {
      label: 'Pending',
      value: ReturnOrderStatus.Pending,
      color: 'warning',
      availableActions: [ReturnAction.Approve, ReturnAction.Reject, ReturnAction.Hold]
    },
    [ReturnOrderStatus.Processing]: {
      label: 'Processing',
      value: ReturnOrderStatus.Processing,
      color: 'primary',
      availableActions: [ReturnAction.Ship, ReturnAction.Cancel]
    },
    [ReturnOrderStatus.Shipped]: {
      label: 'Shipped',
      value: ReturnOrderStatus.Shipped,
      color: 'warning',
      availableActions: [ReturnAction.Receive]
    },
    [ReturnOrderStatus.Received]: {
      label: 'Received',
      value: ReturnOrderStatus.Received,
      color: 'success',
      availableActions: [ReturnAction.Refund]
    },
    [ReturnOrderStatus.Completed]: {
      label: 'Completed',
      value: ReturnOrderStatus.Completed,
      color: 'success',
      availableActions: []
    },
    [ReturnOrderStatus.Cancelled]: {
      label: 'Cancelled',
      value: ReturnOrderStatus.Cancelled,
      color: 'danger',
      availableActions: []
    },
    [ReturnOrderStatus.OnHold]: {
      label: 'On Hold',
      value: ReturnOrderStatus.OnHold,
      color: 'info',
      availableActions: [ReturnAction.Release]
    }
  }

  const getStatusLabel = (status: ReturnOrderStatus): string => {
    return statusConfig[status]?.label || status
  }

  const getStatusColor = (status: ReturnOrderStatus): string => {
    return statusConfig[status]?.color || 'default'
  }

  const getAvailableActions = (status: ReturnOrderStatus): ReturnAction[] => {
    return statusConfig[status]?.availableActions || []
  }

  const canPerformAction = (action: ReturnAction, status: ReturnOrderStatus): boolean => {
    return getAvailableActions(status).includes(action)
  }

  const statusOptions = computed(() => {
    return Object.entries(statusConfig).reduce((acc, [key, config]) => {
      acc[key] = config.label
      return acc
    }, {} as Record<string, string>)
  })

  return {
    currentStatus,
    statusConfig,
    statusOptions,
    getStatusLabel,
    getStatusColor,
    getAvailableActions,
    canPerformAction
  }
}

export type { StatusConfig, StatusConfigMap } 