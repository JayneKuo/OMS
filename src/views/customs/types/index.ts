// 通用接口
export interface PaginationState {
  currentPage: number
  pageSize: number
  total: number
}

// ISF相关接口
export interface ISFSearchFormState {
  keyword: string
  shipmentType: string
  modeOfTransport: string
  dateRange: [string, string] | null
}

export interface ISFTableItem {
  id: string
  shipmentType: string
  modeOfTransport: string
  status: string
  createdAt: string
  updatedAt: string
}

// Form 3461相关接口
export interface Form3461SearchFormState {
  entryNumber: string
  importerNumber: string
  entryType: string
  billOfLading: string
  portOfEntry: string
  dateRange: [string, string] | null
}

export interface Form3461TableItem {
  id: string
  entryNumber: string
  importerNumber: string
  entryType: string
  billOfLading: string
  portOfEntry: string
  entryDate: string
  status: string
} 