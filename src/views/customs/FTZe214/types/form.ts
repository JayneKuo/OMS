// Zone Information Types
export interface ZoneInformation {
  ftzNumber: string
  siteId: string
  portOfEntry: string
}

// Header Information Types
export type ActionCode = 'A' | 'C' | 'D' | 'R'
export type AdmissionType = 'regular' | 'status_change' | 'domestic' | 'overage' | 'temporary' | 'zone_to_zone'
export type DirectDeliveryIndicator = 'Yes' | 'No'
export type EntryType = 'Consumption' | 'TIB' | 'Warehouse'

export interface HeaderInformation {
  actionCode: ActionCode
  admissionType: AdmissionType
  admissionNumber: string
  estimatedEntryDate: string
  applicantReferenceNumber?: string
  inBondNumber?: string
  directDeliveryIndicator: DirectDeliveryIndicator
  entryType: EntryType
  controlNumber?: string
  firmsCode: string
  reasonForAction?: string
}

// Party Information Types
export interface PartyInformation {
  operatorId: string
  operatorName: string
  operatorAddress: string
  importerName: string
  importerTaxId: string
  importerAddress: string
  brokerId?: string
  brokerName?: string
  brokerAddress?: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

// Transportation Information Types
export type TransportMode = 'Air' | 'Ocean' | 'Truck' | 'Rail'

export interface TransportationInformation {
  arrivalDate: string
  exportDate?: string
  conveyanceId: string
  scacCode: string
  vesselName?: string
  voyageFlightTrip: string
  loadingPortCode: string
  foreignPortOfLading: string
  manifestQuantity: number
  modeOfTransport: TransportMode
  containerNumber?: string
}

// Bill of Lading Types
export type UnitOfMeasure = 'Cartons' | 'Pallets' | 'Pieces'

export interface BillOfLading {
  masterBillNumber: string
  houseBillNumber?: string
  quantity: number
  uom: UnitOfMeasure
  foreignLoadPort: string
  countryOfExport: string
  containerNumber?: string
  itNumber?: string
  totalGrossWeight: number
}

// Line Item Types
export type ZoneStatus = 'PF' | 'NPF' | 'DOM' | 'ZR'
export type SPICode = 'GSP' | 'NAFTA'
export type SPISecondary = 'A' | 'C' | 'E' | 'J'

export interface LineItem {
  usePartsInventory?: boolean
  partNumber?: string
  tariffNumber: string
  spiCode?: SPICode
  spiSecondary?: SPISecondary
  pieceCount: number
  value: number
  charges?: number
  harborMaintenanceFee?: number
  midReference?: string
  assignedContainer?: string
  description: string
  lotNumber?: string
  spiCountry?: string
  countryOfOrigin: string
  htsQty1: number
  htsQty2?: number
  weight: number
  zoneStatus: ZoneStatus
  remarks?: string
  pnDisclaimer?: boolean
}

// Form Data Type
export interface FTZe214FormData {
  zoneInformation: ZoneInformation
  headerInformation: HeaderInformation
  partyInformation: PartyInformation
  transportationInformation: TransportationInformation
  billOfLading: BillOfLading
  lineItems: LineItem[]
}

// Form Rules Type
export type FTZe214FormRules = Partial<Record<keyof FTZe214FormData, any>>

// Constants
export const ACTION_CODES = [
  { value: 'A', label: 'Add' },
  { value: 'C', label: 'Change' },
  { value: 'D', label: 'Delete' },
  { value: 'R', label: 'Replace' }
] as const

export const ADMISSION_TYPES = [
  { value: 'regular', label: 'Regular Admission' },
  { value: 'status_change', label: 'Status Change' },
  { value: 'domestic', label: 'Domestic' },
  { value: 'overage', label: 'Overage Admission' },
  { value: 'temporary', label: 'Temporary Deposit' },
  { value: 'zone_to_zone', label: 'Zone to Zone' }
] as const

export const ENTRY_TYPES = [
  { value: 'Consumption', label: 'Consumption Entry' },
  { value: 'TIB', label: 'Temporary Import Bond' },
  { value: 'Warehouse', label: 'Warehouse Entry' }
] as const

export const TRANSPORT_MODES = [
  { value: 'Air', label: 'Air' },
  { value: 'Ocean', label: 'Ocean' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Rail', label: 'Rail' }
] as const

export const ZONE_STATUSES = [
  { value: 'PF', label: 'Privileged Foreign (PF)' },
  { value: 'NPF', label: 'Non-Privileged Foreign (NPF)' },
  { value: 'DOM', label: 'Domestic (DOM)' },
  { value: 'ZR', label: 'Zone Restricted (ZR)' }
] as const

export const UNITS_OF_MEASURE = [
  { value: 'Cartons', label: 'Cartons' },
  { value: 'Pallets', label: 'Pallets' },
  { value: 'Pieces', label: 'Pieces' }
] as const

// 港口配置
export const PORT_OF_ENTRY = [
  { value: 'NY/NJ', label: 'New York/New Jersey' },
  { value: 'LAX', label: 'Los Angeles' },
  { value: 'MIA', label: 'Miami' },
  { value: 'ORD', label: 'Chicago' },
  { value: 'SEA', label: 'Seattle' },
  { value: 'HOU', label: 'Houston' },
  { value: 'SFO', label: 'San Francisco' },
  { value: 'ATL', label: 'Atlanta' },
  { value: 'BOS', label: 'Boston' },
  { value: 'DFW', label: 'Dallas/Fort Worth' }
] as const

export type PortOfEntry = typeof PORT_OF_ENTRY[number]['value']

export const DIRECT_DELIVERY_OPTIONS = [
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' }
] as const

export type DirectDeliveryIndicator = typeof DIRECT_DELIVERY_OPTIONS[number]['value'] 