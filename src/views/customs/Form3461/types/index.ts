// Form3461 模块的类型定义

export interface Form3461SearchFormState {
  entryNo: string
  importerNo: string
  entryType: string
  billOfLading: string
  portOfEntry: string
  dateRange: [string, string] | null
}

export interface Form3461TableItem {
  entryNo: string
  importerNo: string
  entryType: string
  billOfLading: string
  portOfEntry: string
  entryDate: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Form3461FormState {
  // 基本信息
  entryNo: string
  importerNo: string
  entryType: string
  billOfLading: string
  portOfEntry: string
  entryDate: string
  
  // 运输信息
  countryOfOrigin: string
  vesselName: string
  voyageNo: string
  
  // 商品信息
  manufacturerId: string
  value: string
  description: string
  
  // 申报人信息
  declarantName: string
  contactPhone: string
  email: string
}

export interface PaginationState {
  currentPage: number
  pageSize: number
}

export type DropdownField = 'entryType' | 'portOfEntry'

export interface DropdownOption {
  label: string
  value: string
} 