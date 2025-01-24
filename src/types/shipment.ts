export interface ISFSearchForm {
  fileNo: string
  masterBillNo: string
  shipmentType: string
  modeOfTransport: string
  vesselName: string
  voyageNo: string
}

export interface TableItem {
  id: string
  fileNo: string
  masterBillNo: string
  shipmentType: string
  modeOfTransport: string
  vesselName: string
  voyageNo: string
  status: string
  createdAt: string
  updatedAt: string
}

export enum ShipmentType {
  FCL = 'FCL',
  LCL = 'LCL'
}

export enum TransportMode {
  SEA = 'SEA',
  AIR = 'AIR'
}

export enum Status {
  Active = 'Active',
  Pending = 'Pending',
  Inactive = 'Inactive',
  Error = 'Error'
} 