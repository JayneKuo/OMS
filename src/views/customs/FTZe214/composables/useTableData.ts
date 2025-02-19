import { ref } from 'vue'
import type { TableItem, StatusType, AdmissionType, PortOfEntry } from '../types'

// 生成随机日期
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0]
}

// 使用单例模式存储状态
const tableData = ref<TableItem[]>([])
const total = ref(0)

// 初始化数据
const initializeData = () => {
  if (tableData.value.length === 0) {
    tableData.value = generateMockData()
    total.value = tableData.value.length
  }
}

// 生成模拟数据
const generateMockData = (): TableItem[] => {
  const mockData: TableItem[] = []
  // 按业务流程顺序定义状态
  const statuses: StatusType[] = [
    'pending',           // 初始状态
    'processing',        // 处理中
    'cbp_approved',     // CBP批准
    'ptt_processing',   // PTT处理中
    'ptt_issued',       // PTT已发布
    'arrived_at_ftz',   // 到达FTZ
    'completed',        // 完成
    'ptt_rejected',     // PTT被拒绝
    'ptt_failed',       // PTT失败
    'failed',           // 失败
    'cancelled'         // 取消
  ]
  const admissionTypes: AdmissionType[] = ['regular', 'status_change', 'domestic', 'overage', 'temporary', 'zone_to_zone']
  const ports: PortOfEntry[] = ['NY/NJ', 'LAX', 'MIA', 'ORD', 'SEA', 'HOU', 'SFO', 'ATL', 'BOS', 'DFW']
  
  const companies = [
    'Global Trade Solutions',
    'International Logistics Corp',
    'Pacific Shipping Ltd',
    'Atlantic Freight Services',
    'American Import Export Co',
    'United Customs Brokers',
    'Western Distribution Inc',
    'Eastern Supply Chain',
    'Central Warehousing LLC',
    'Maritime Logistics Group'
  ]

  const operators = [
    'FTZ Operations Inc',
    'Zone Management Corp',
    'Port Authority Operations',
    'Customs Zone Services',
    'Terminal Operations LLC',
    'Harbor Management Group',
    'Gateway Operations Co',
    'Port Facilities Management',
    'Zone Control Services',
    'Terminal Management Inc'
  ]

  // 首先为每个状态生成一条记录，确保第一页包含所有状态
  statuses.forEach((status, index) => {
    mockData.push({
      id: (index + 1).toString(),
      admissionNo: `FTZ${new Date().getFullYear()}${(index + 1).toString().padStart(4, '0')}`,
      admissionType: admissionTypes[Math.floor(Math.random() * admissionTypes.length)],
      portOfEntry: ports[Math.floor(Math.random() * ports.length)],
      ftzNo: `FTZ${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
      importerName: companies[Math.floor(Math.random() * companies.length)],
      operatorName: operators[Math.floor(Math.random() * operators.length)],
      admissionDate: getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
      status: status
    })
  })

  // 然后为每个状态生成额外的记录
  const recordsPerStatus = 4 // 每个状态再生成4条记录（加上前面的1条，总共是5条）
  statuses.forEach((status, statusIndex) => {
    for (let i = 1; i <= recordsPerStatus; i++) {
      const recordIndex = statuses.length + statusIndex * recordsPerStatus + i
      mockData.push({
        id: recordIndex.toString(),
        admissionNo: `FTZ${new Date().getFullYear()}${recordIndex.toString().padStart(4, '0')}`,
        admissionType: admissionTypes[Math.floor(Math.random() * admissionTypes.length)],
        portOfEntry: ports[Math.floor(Math.random() * ports.length)],
        ftzNo: `FTZ${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
        importerName: companies[Math.floor(Math.random() * companies.length)],
        operatorName: operators[Math.floor(Math.random() * operators.length)],
        admissionDate: getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
        status: status
      })
    }
  })

  return mockData
}

export const useTableData = () => {
  // 确保数据已初始化
  initializeData()

  const updateStatus = async (id: string, status: StatusType) => {
    const index = tableData.value.findIndex(item => item.id === id)
    if (index > -1) {
      tableData.value[index].status = status
    }
  }

  const deleteRecord = async (id: string) => {
    const index = tableData.value.findIndex(item => item.id === id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value--
    }
  }

  const batchUpdateStatus = async (ids: string[], status: StatusType) => {
    ids.forEach(id => {
      const index = tableData.value.findIndex(item => item.id === id)
      if (index > -1) {
        tableData.value[index].status = status
      }
    })
  }

  return {
    tableData,
    total,
    updateStatus,
    deleteRecord,
    batchUpdateStatus
  }
} 