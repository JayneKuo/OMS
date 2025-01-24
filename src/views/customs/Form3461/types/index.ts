// Form 3461 Types

export interface LineItem {
  description: string
  htsNumber: string
  quantity: number
  value: number
}

export interface Form3461FormState {
  // Entry Information
  portOfEntry: string
  entryNumber: string
  entryType: string
  entryDate: string
  portCode: string
  importerNumber: string

  // Importer/Consignee Information
  importerNumberConsignee: string
  importerConsigneeName: string

  // Port/Location Information
  portOfEntryLocation: string
  portOfUnlading: string
  arrivalDate: string

  // Broker/Filer Information
  brokerNumber: string
  bondType: string

  // Ultimate Consignee Information
  consigneeNumber: string
  importerNumberUltimate: string

  // Transportation Information
  transportationMode: string
  vesselName: string
  voyageNumber: string

  // Line Items
  lineItems: LineItem[]

  // Header Reference Information
  referenceNumber: string
  selfFilingCertification: boolean
}

export type Form3461Status = 'Draft' | 'Submitted' | 'Pending Review' | 'Hold' | 'Release' | 'Rejected'

export interface ActionConfig {
  label: string
  value: string
  color: string
  handler: string
}

export interface Form3461StatusConfig {
  label: string
  value: Form3461Status
  color: string
  description: string
  actions: ActionConfig[]
}

export const ENTRY_TYPES = [
  { label: 'Consumption', value: 'Consumption' },
  { label: 'Warehouse', value: 'Warehouse' },
  { label: 'FTZ', value: 'FTZ' },
  { label: 'T&E', value: 'T&E' },
  { label: 'Informal', value: 'Informal' }
]

export const PORTS_OF_ENTRY = [
  { label: 'Los Angeles', value: 'Los Angeles' },
  { label: 'New York', value: 'New York' },
  { label: 'Miami', value: 'Miami' },
  { label: 'Seattle', value: 'Seattle' },
  { label: 'Chicago', value: 'Chicago' }
]

export const STATUS_CONFIG: Record<Form3461Status, Form3461StatusConfig> = {
  Draft: {
    label: 'Draft',
    value: 'Draft',
    color: '#8C8C8C',
    description: 'Entry is being filled out and has not been submitted',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'Edit Form', value: 'edit', color: '#1890FF', handler: 'handleEditForm' },
      { label: 'Submit Form', value: 'submit', color: '#52C41A', handler: 'handleSubmitForm' }
    ]
  },
  Submitted: {
    label: 'Submitted',
    value: 'Submitted',
    color: '#1890FF',
    description: 'Entry has been submitted to CBP system and is awaiting processing',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'Track Status', value: 'track', color: '#1890FF', handler: 'handleTrackStatus' }
    ]
  },
  'Pending Review': {
    label: 'Pending Review',
    value: 'Pending Review',
    color: '#FAAD14',
    description: 'Under CBP review, additional documents may be required',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'Approve and Release', value: 'approve', color: '#52C41A', handler: 'handleApproveAndRelease' },
      { label: 'Request Additional Documents', value: 'request', color: '#FAAD14', handler: 'handleRequestDocuments' },
      { label: 'Reject Form', value: 'reject', color: '#FF4D4F', handler: 'handleRejectForm' }
    ]
  },
  Hold: {
    label: 'Hold',
    value: 'Hold',
    color: '#FF7A45',
    description: 'Goods held by CBP for further examination',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'View Hold Reason', value: 'viewHold', color: '#FF7A45', handler: 'handleViewHoldReason' },
      { label: 'Upload Additional Documents', value: 'upload', color: '#1890FF', handler: 'handleUploadDocuments' }
    ]
  },
  Release: {
    label: 'Release',
    value: 'Release',
    color: '#52C41A',
    description: 'Entry approved, goods cleared for entry',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'View Release Details', value: 'viewRelease', color: '#52C41A', handler: 'handleViewReleaseDetails' },
      { label: 'Download Release Notice', value: 'download', color: '#1890FF', handler: 'handleDownloadNotice' },
      { label: 'Generate Form 7501', value: 'generate7501', color: '#FAAD14', handler: 'handleGenerate7501' }
    ]
  },
  Rejected: {
    label: 'Rejected',
    value: 'Rejected',
    color: '#FF4D4F',
    description: 'Entry rejected by CBP, requires modification and resubmission',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'View Rejection Reason', value: 'viewReject', color: '#FF4D4F', handler: 'handleViewRejectReason' },
      { label: 'Edit Form', value: 'edit', color: '#1890FF', handler: 'handleEditForm' }
    ]
  }
}

export interface Form3461SearchFormState {
  entryNo: string
  importerNo: string
  entryType: string
  portOfEntry: string
  billOfLading: string
  dateRange: [string, string] | null
  status: Form3461Status | ''
}

export interface Form3461TableItem {
  systemId: string           // 系统内部唯一标识
  id: string                 // Entry No (CBP分配或系统生成)
  entryNo: string           // 同 id，为了保持兼容
  importerNo: string
  entryType: string
  portOfEntry: string
  billOfLading: string
  entryDate: string
  status: Form3461Status
  description: string
  lastUpdated: string
  documents: {
    name: string
    url: string
    uploadTime: string
  }[]
}

export interface DropdownField {
  label: string
  value: string
}