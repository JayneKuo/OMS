import { defineStore } from 'pinia'
import { OrderStatus } from '@/types/order'

interface StatusHistoryItem {
  status: OrderStatus
  time: string
  reason?: string
}

export const useOrderStatusStore = defineStore('orderStatus', {
  state: () => ({
    currentStatus: OrderStatus.Imported,
    statusHistory: [] as StatusHistoryItem[],
    lastUpdateTime: 0,
    statusTimes: {} as Record<OrderStatus, string>
  }),

  getters: {
    isCompleted: (state) => state.currentStatus === OrderStatus.Completed,
    isPending: (state) => state.currentStatus === OrderStatus.Pending,
    isException: (state) => state.currentStatus === OrderStatus.Exception,
    isDeallocated: (state) => state.currentStatus === OrderStatus.Deallocated,
    isCancelling: (state) => state.currentStatus === OrderStatus.Cancelling,
    isCanceled: (state) => state.currentStatus === OrderStatus.Canceled,
    
    // 获取状态进度百分比
    progressPercentage: (state) => {
      const statusOrder = [
        OrderStatus.Imported,
        OrderStatus.Allocated,
        OrderStatus.WarehouseProcessing,
        OrderStatus.Shipped,
        OrderStatus.InTransit,
        OrderStatus.Delivered,
        OrderStatus.Completed
      ]
      
      const currentIndex = statusOrder.indexOf(state.currentStatus)
      if (currentIndex === -1) return 0
      return Math.round((currentIndex / (statusOrder.length - 1)) * 100)
    },

    // 获取已完成的状态列表
    completedStatuses: (state) => {
      const statusOrder = [
        OrderStatus.Imported,
        OrderStatus.Allocated,
        OrderStatus.WarehouseProcessing,
        OrderStatus.Shipped,
        OrderStatus.InTransit,
        OrderStatus.Delivered,
        OrderStatus.Completed
      ]
      
      const currentIndex = statusOrder.indexOf(state.currentStatus)
      if (currentIndex === -1) return []
      return statusOrder.slice(0, currentIndex + 1)
    },

    // 获取状态标签
    statusLabel: (state) => {
      const labels: Record<OrderStatus, string> = {
        [OrderStatus.Imported]: '已导入',
        [OrderStatus.Allocated]: '已分配',
        [OrderStatus.WarehouseProcessing]: '仓库处理中',
        [OrderStatus.Shipped]: '已发货',
        [OrderStatus.InTransit]: '运输中',
        [OrderStatus.Delivered]: '已送达',
        [OrderStatus.Completed]: '已完成',
        [OrderStatus.Pending]: '待处理',
        [OrderStatus.Exception]: '异常',
        [OrderStatus.Deallocated]: '已取消分配',
        [OrderStatus.Cancelling]: '取消中',
        [OrderStatus.Canceled]: '已取消'
      }
      return labels[state.currentStatus] || state.currentStatus
    }
  },

  actions: {
    // 更新状态
    updateStatus(status: OrderStatus, reason?: string) {
      // 记录当前状态的时间
      const currentTime = new Date().toLocaleString('zh-CN')
      this.statusTimes[this.currentStatus] = currentTime

      // 添加到历史记录
      this.statusHistory.push({
        status: this.currentStatus,
        time: currentTime,
        reason
      })

      // 更新当前状态
      this.currentStatus = status
      this.lastUpdateTime = Date.now()

      // 记录新状态的时间
      this.statusTimes[status] = currentTime
    },

    // 重置状态
    resetStatus() {
      this.currentStatus = OrderStatus.Imported
      this.statusHistory = []
      this.lastUpdateTime = 0
      this.statusTimes = {}
    },

    // 添加状态历史记录
    addStatusHistory(status: OrderStatus, time: string, reason?: string) {
      this.statusHistory.push({ status, time, reason })
      this.statusTimes[status] = time
    },

    // 清除状态历史记录
    clearStatusHistory() {
      this.statusHistory = []
      this.statusTimes = {}
    },

    // 更新状态时间
    updateStatusTime(status: OrderStatus, time: string) {
      this.statusTimes[status] = time
    },

    // 批量更新状态时间
    updateStatusTimes(times: Record<OrderStatus, string>) {
      this.statusTimes = { ...this.statusTimes, ...times }
    }
  }
}) 