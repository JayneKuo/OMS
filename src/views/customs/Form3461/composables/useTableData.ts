import { ref } from 'vue'
import type { Form3461TableItem, Form3461Status } from '../types'
import { STATUS_CONFIG, BOND_TYPES } from '../types'

// 生成随机的Entry Number
const generateEntryNumber = () => {
  const prefix = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  const middle = Math.floor(Math.random() * 10000000).toString().padStart(7, '0')
  const suffix = Math.floor(Math.random() * 10).toString()
  return `${prefix}-${middle}-${suffix}`
}

// 生成随机的Importer Number
const generateImporterNumber = () => {
  return Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
}

// 生成随机日期
const generateDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0]
}

// 生成模拟数据
const generateMockData = (count: number): Form3461TableItem[] => {
  const entryTypes = ['Consumption', 'Warehouse', 'FTZ', 'T&E', 'Informal']
  const ports = ['Los Angeles', 'New York', 'Miami', 'Seattle', 'Chicago']
  const statuses: Form3461Status[] = ['Pending', 'Processing', 'Completed', 'Failed', 'Cancelled']
  const bondTypes = ['Single Transaction Bond', 'Continuous Bond']
  
  return Array.from({ length: count }, (_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const entryDate = generateDate(new Date('2023-01-01'), new Date())
    
    return {
      systemId: `sys-${index + 1}`,
      id: (index + 1).toString(),
      entryNo: generateEntryNumber(),
      importerNo: generateImporterNumber(),
      entryType: entryTypes[Math.floor(Math.random() * entryTypes.length)],
      portOfEntry: ports[Math.floor(Math.random() * ports.length)],
      bondType: bondTypes[Math.floor(Math.random() * bondTypes.length)],
      entryDate,
      status,
      description: STATUS_CONFIG[status].description,
      lastUpdated: generateDate(new Date(entryDate), new Date()),
      documents: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
        name: `Document_${i + 1}.pdf`,
        url: `https://example.com/documents/${index + 1}/${i + 1}`,
        uploadTime: generateDate(new Date(entryDate), new Date())
      }))
    }
  })
}

export const useTableData = () => {
  const tableData = ref<Form3461TableItem[]>(generateMockData(50))
  
  // 更新状态
  const updateStatus = (id: string, newStatus: Form3461Status) => {
    const index = tableData.value.findIndex(item => item.id === id)
    if (index !== -1) {
      tableData.value[index] = {
        ...tableData.value[index],
        status: newStatus,
        description: STATUS_CONFIG[newStatus].description,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    }
  }
  
  // 删除记录
  const deleteRecord = (id: string) => {
    const index = tableData.value.findIndex(item => item.id === id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
    }
  }
  
  // 添加新记录
  const addRecord = (record: Partial<Form3461TableItem>) => {
    const newRecord: Form3461TableItem = {
      systemId: `sys-${tableData.value.length + 1}`,
      id: (tableData.value.length + 1).toString(),
      entryNo: generateEntryNumber(),
      importerNo: record.importerNo || generateImporterNumber(),
      entryType: record.entryType || 'Consumption',
      portOfEntry: record.portOfEntry || 'Los Angeles',
      bondType: record.bondType || BOND_TYPES[0].value,
      entryDate: record.entryDate || new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: STATUS_CONFIG['Pending'].description,
      lastUpdated: new Date().toISOString().split('T')[0],
      documents: []
    }
    tableData.value.unshift(newRecord)
    return newRecord
  }
  
  return {
    tableData,
    updateStatus,
    deleteRecord,
    addRecord
  }
} 