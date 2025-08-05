import { PurchaseOrderStatus, PurchaseOrderTracking } from '@/views/purchase/tracking/types'

export const mockTrackingList: PurchaseOrderTracking[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    supplier: 'Supplier A',
    createdAt: '2024-01-15T08:00:00Z',
    expectedDeliveryDate: '2024-02-15T08:00:00Z',
    currentStatus: PurchaseOrderStatus.IN_PRODUCTION,
    stages: []
  },
  {
    id: '2',
    poNumber: 'PO-2024-002',
    supplier: 'Supplier B',
    createdAt: '2024-01-20T08:00:00Z',
    expectedDeliveryDate: '2024-02-20T08:00:00Z',
    currentStatus: PurchaseOrderStatus.PO_CONFIRMED,
    stages: []
  }
]

export const generateMockStages = (currentStatus: PurchaseOrderStatus) => {
  const statuses = Object.values(PurchaseOrderStatus)
  const currentIndex = statuses.indexOf(currentStatus)

  return statuses.map((status, index) => ({
    status,
    title: status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' '),
    subProcesses: Array(4).fill(null).map((_, i) => ({
      name: `Process ${i + 1}`,
      status: index < currentIndex ? 'completed' : 
              index === currentIndex ? (i === 0 ? 'completed' : i === 1 ? 'in_progress' : 'pending') : 
              'pending',
      timestamp: index < currentIndex ? new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString() : undefined,
      operator: index < currentIndex ? 'John Doe' : undefined,
      fields: {}
    })),
    completed: index < currentIndex,
    current: index === currentIndex
  }))
}

export const mockTrackingDetail = (id: string): PurchaseOrderTracking => {
  const item = mockTrackingList.find(item => item.id === id)
  if (!item) throw new Error('Not found')

  return {
    ...item,
    stages: generateMockStages(item.currentStatus)
  }
} 