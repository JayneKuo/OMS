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
  transportationMode: string[]

  // Line Items
  lineItems: LineItem[]

  // Header Reference Information
  referenceNumber: string
  selfFilingCertification: boolean
}

export type Form3461Status = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Cancelled'

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
] as const

export const BOND_TYPES = [
  { label: 'Single Transaction Bond', value: 'Single Transaction Bond' },
  { label: 'Continuous Bond', value: 'Continuous Bond' }
] as const

export const PORTS_OF_ENTRY = [
  { label: 'Los Angeles', value: 'Los Angeles' },
  { label: 'New York', value: 'New York' },
  { label: 'Miami', value: 'Miami' },
  { label: 'Seattle', value: 'Seattle' },
  { label: 'Chicago', value: 'Chicago' }
]

export const STATUS_CONFIG: Record<Form3461Status, Form3461StatusConfig> = {
  Pending: {
    label: 'Pending',
    value: 'Pending',
    color: '#8C8C8C',
    description: 'Entry has been created but not submitted, waiting for review',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'Submit Form', value: 'submit', color: '#52C41A', handler: 'handleSubmitForm' }
    ]
  },
  Processing: {
    label: 'Processing',
    value: 'Processing',
    color: '#FAAD14',
    description: 'Entry is under review, assessing completeness and accuracy',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'Approve & Complete', value: 'approve', color: '#52C41A', handler: 'handleApproveAndComplete' },
      { label: 'Reject Form', value: 'reject', color: '#FF4D4F', handler: 'handleRejectForm' },
      { label: 'Cancel Form', value: 'cancel', color: '#FF4D4F', handler: 'handleCancelForm' }
    ]
  },
  Completed: {
    label: 'Completed',
    value: 'Completed',
    color: '#52C41A',
    description: 'Entry approved, goods cleared for entry, process completed',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' }
    ]
  },
  Failed: {
    label: 'Failed',
    value: 'Failed',
    color: '#FF4D4F',
    description: 'Entry review failed, usually due to data errors or missing information',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' },
      { label: 'View Failure Reason', value: 'viewFailure', color: '#FF4D4F', handler: 'handleViewFailureReason' },
      { label: 'Edit Form', value: 'edit', color: '#1890FF', handler: 'handleEditForm' },
      { label: 'Cancel Form', value: 'cancel', color: '#FF4D4F', handler: 'handleCancelForm' }
    ]
  },
  Cancelled: {
    label: 'Cancelled',
    value: 'Cancelled',
    color: '#FF4D4F',
    description: 'Entry has been cancelled, no further actions can be taken',
    actions: [
      { label: 'View Details', value: 'view', color: '#8C8C8C', handler: 'handleViewDetails' }
    ]
  }
}

export interface Form3461SearchFormState {
  entryNo: string
  importerNo: string
  entryType: string
  portOfEntry: string
  bondType: string
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
  bondType: string
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