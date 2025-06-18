import { defineStore } from 'pinia'
import { ref } from 'vue'
import { OrderStatus } from '@/types/order'

export interface UpdateFailedItem {
  orderId: string
  status: OrderStatus
  updateType: 'quantity' | 'address' | 'other'
  reason: string
  updateContent: string
  affectedItems?: Array<{
    sku: string
    name: string
    quantity: number
    reason?: string
  }>
  timestamp: number
}

export const useOrderUpdateControlStore = defineStore('orderUpdateControl', () => {
  const updateFailedItems = ref<UpdateFailedItem[]>([])
  
  // 添加更新失败记录
  const addUpdateFailedItem = (item: Omit<UpdateFailedItem, 'timestamp'>) => {
    updateFailedItems.value.push({
      ...item,
      timestamp: Date.now()
    })
  }
  
  // 获取指定订单的更新失败记录
  const getUpdateFailedItem = (orderId: string) => {
    return updateFailedItems.value.find(item => item.orderId === orderId)
  }
  
  // 移除更新失败记录
  const removeUpdateFailedItem = (orderId: string) => {
    const index = updateFailedItems.value.findIndex(item => item.orderId === orderId)
    if (index > -1) {
      updateFailedItems.value.splice(index, 1)
    }
  }
  
  // 清空所有更新失败记录
  const clearUpdateFailedItems = () => {
    updateFailedItems.value = []
  }
  
  return {
    updateFailedItems,
    addUpdateFailedItem,
    getUpdateFailedItem,
    removeUpdateFailedItem,
    clearUpdateFailedItems
  }
}) 