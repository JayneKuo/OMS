// ISF模块的类型定义

export interface ISFSearchFormState {
  fileNo: string
  masterBillNo: string
  shipmentType: string
  modeOfTransport: string
  vesselName: string
  voyageNo: string
  dateRange: [string, string] | null
}

export interface ISFTableItem {
  fileNo: string
  masterBillNo: string
  shipmentType: string
  modeOfTransport: string
  vesselName: string
  voyageNo: string
  creationTime: string
}

export interface PaginationState {
  currentPage: number
  pageSize: number
}

export type DropdownField = 'shipmentType' | 'modeOfTransport'

export interface DropdownOption {
  label: string
  value: string
} 