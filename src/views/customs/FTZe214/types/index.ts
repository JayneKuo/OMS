// 表格项接口
export interface TableItem {
  id: string
  admissionNo: string
  admissionType: AdmissionType
  portOfEntry: PortOfEntry
  ftzNo: string
  importerName: string
  operatorName: string
  admissionDate: string
  status: StatusType
  [key: string]: any
}

// 搜索表单状态接口
export interface SearchFormState {
  admissionNo: string
  admissionType: string
  portOfEntry: string
  ftzNo: string
  importerName: string
  operatorName: string
  dateRange: [string, string] | null
  status: string
}

// 搜索参数接口
export interface SearchParams extends Omit<SearchFormState, 'dateRange'> {
  startDate: string
  endDate: string
}

// 状态配置
export const STATUS_CONFIG = {
  pending: { label: 'Pending', style: { color: '#FACC15' } },
  processing: { label: 'Processing', style: { color: '#9CA3AF' } },
  cbp_approved: { label: 'CBP Approved', style: { color: '#10B981' } },
  ptt_processing: { label: 'PTT Processing', style: { color: '#9CA3AF' } },
  ptt_issued: { label: 'PTT Issued', style: { color: '#059669' } },
  ptt_rejected: { label: 'PTT Rejected', style: { color: '#DC2626' } },
  ptt_failed: { label: 'PTT Failed', style: { color: '#DC2626' } },
  arrived_at_ftz: { label: 'Arrived at FTZ', style: { color: '#10B981' } },
  failed: { label: 'Failed', style: { color: '#DC2626' } },
  completed: { label: 'Completed', style: { color: '#374151' } },
  cancelled: { label: 'Cancelled', style: { color: '#9CA3AF' } }
} as const

// 定义 PortOfEntry 类型
export type PortOfEntry = string

// 定义 AdmissionType 类型
export type AdmissionType = 'regular' | 'status_change' | 'domestic' | 'overage' | 'temporary' | 'zone_to_zone'

// 添加 PORT_OF_ENTRY 常量
export const PORT_OF_ENTRY: Option[] = [
  { value: 'Atlanta', label: 'Atlanta' },
  { value: 'Boston', label: 'Boston' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'Houston', label: 'Houston' },
  { value: 'Los Angeles', label: 'Los Angeles' },
  { value: 'Miami', label: 'Miami' },
  { value: 'New York/New Jersey', label: 'New York/New Jersey' },
  { value: 'San Francisco', label: 'San Francisco' },
  { value: 'Seattle', label: 'Seattle' }
]

// 定义状态类型
export type StatusType = keyof typeof STATUS_CONFIG 

export type DirectDeliveryIndicator = 'Yes' | 'No'
export type EntryType = '23' | '24' | '25' | '26' | '27' | '06'
export type TransportMode = 'Ocean' | 'Air' | 'Rail' | 'Truck'
export type UnitOfMeasure = 'Pieces' | 'Kilograms' | 'Pounds' | 'Boxes'
export type ZoneStatus = 'NPF' | 'PF' | 'DOM' | 'ZR'
export type ActionCode = 'A' | 'C' | 'R' | 'D' 

// 常量定义
export interface Option {
  value: string
  label: string
}

export const TRANSPORT_MODES: Option[] = [
  { value: 'Ocean', label: 'Ocean' },
  { value: 'Air', label: 'Air' },
  { value: 'Rail', label: 'Rail' },
  { value: 'Truck', label: 'Truck' }
]

export const UNITS_OF_MEASURE: Option[] = [
  { value: 'Pieces', label: 'Pieces' },
  { value: 'Kilograms', label: 'Kilograms' },
  { value: 'Pounds', label: 'Pounds' },
  { value: 'Boxes', label: 'Boxes' }
]

export const ZONE_STATUSES: Option[] = [
  { value: 'PF', label: 'Privileged Foreign (PF)' },
  { value: 'NPF', label: 'Non-Privileged Foreign (NPF)' },
  { value: 'DOM', label: 'Domestic (DOM)' },
  { value: 'ZR', label: 'Zone Restricted (ZR)' }
]

export const ACTION_CODES: Option[] = [
  { value: 'A', label: 'Add' },
  { value: 'C', label: 'Change' },
  { value: 'R', label: 'Replace' },
  { value: 'D', label: 'Delete' }
]

export const ADMISSION_TYPES: Option[] = [
  { value: 'regular', label: 'Regular Admission' },
  { value: 'status_change', label: 'Status Change' },
  { value: 'domestic', label: 'Domestic' },
  { value: 'overage', label: 'Overage Admission' },
  { value: 'temporary', label: 'Temporary Deposit' },
  { value: 'zone_to_zone', label: 'Zone to Zone' }
]

export const ENTRY_TYPES: Option[] = [
  { value: '23', label: '23 - Temporary Deposit in FTZ' },
  { value: '24', label: '24 - FTZ Admission - Non-Privileged Foreign (NPF)' },
  { value: '25', label: '25 - FTZ Admission - Privileged Foreign (PF)' },
  { value: '26', label: '26 - FTZ Admission - Domestic' },
  { value: '27', label: '27 - FTZ Admission - Zone Restricted (ZR)' },
  { value: '06', label: '06 - Warehouse Entry' }
]

export const DIRECT_DELIVERY_OPTIONS: Option[] = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
]

// 类型定义
export interface LineItem {
  usePartsInventory: boolean
  partNumber: string
  htsCode: string
  pieceCount: number
  value: number
  charges: number
  midReference: string
  assignedContainer: string
  description: string
  lotNumber: string
  countryOfOrigin: string
  qty: number
  weight: number
  zoneStatus: ZoneStatus | ''
  remarks: string
  pnDisclaimer: boolean
  priorNoticeNumber: string
}

export interface FTZe214FormData {
  zoneInformation: {
    ftzNumber: string
    siteId: string
    portOfEntry: string
  }
  headerInformation: {
    actionCode: ActionCode | ''
    admissionType: AdmissionType | ''
    // CBP assigned number, format: 214-YYYY-000123
    admissionNumber: string
    estimatedEntryDate: string
    applicantReferenceNumber: string
    inBondNumber: string
    directDeliveryIndicator: DirectDeliveryIndicator | ''
    entryType: EntryType | ''
    controlNumber: string
    firmsCode: string
    reasonForAction: string
    // Reference number for Change/Replace/Delete operations
    originalE214Number: string
    targetFtzNumber: string  // 目标 FTZ 编号，用于 Zone to Zone
    clearanceDate: string    // 预计清关/转运日期，用于 Temporary Deposit
  }
  partyInformation: {
    operatorId: string
    operatorName: string
    operatorAddress: string
    importerName: string
    importerTaxId: string
    importerAddress: string
    brokerId: string
    brokerName: string
    brokerAddress: string
    contactName: string
    contactEmail: string
    contactPhone: string
  }
  transportationInformation: {
    arrivalDate: string
    exportDate: string
    conveyanceId: string
    scacCode: string
    vesselName: string
    voyageFlightTrip: string
    loadingPortCode: string
    foreignPortOfLading: string
    manifestQuantity: number
    modeOfTransport: TransportMode | ''
    containerNumber: string
  }
  billOfLading: {
    masterBillNumber: string
    houseBillNumber: string
    quantity: number
    uom: UnitOfMeasure | ''
    foreignLoadPort: string
    countryOfExport: string
    containerNumber: string
    totalGrossWeight: number
  }
  lineItems: LineItem[]
} 