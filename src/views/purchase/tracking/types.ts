export enum PurchaseOrderStatus {
  PO_CREATED = 'PO_CREATED',
  PO_CONFIRMED = 'PO_CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  EXPORT_CUSTOMS = 'EXPORT_CUSTOMS',
  IMPORT_DELIVERY = 'IMPORT_DELIVERY',
  RECEIVED = 'RECEIVED',
  INVOICED = 'INVOICED'
}

export interface SubProcess {
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  timestamp?: string
  operator?: string
  attachments?: Array<{
    name: string
    url: string
  }>
  remarks?: string
  fields: Record<string, any>
}

export interface TrackingStage {
  status: PurchaseOrderStatus
  title: string
  subProcesses: SubProcess[]
  completed: boolean
  current: boolean
}

export interface PurchaseOrderTracking {
  id: string
  poNumber: string
  supplier: string
  createdAt: string
  expectedDeliveryDate?: string
  currentStatus: PurchaseOrderStatus
  stages: TrackingStage[]
}

// Stage configurations
export const STAGE_CONFIGS = {
  [PurchaseOrderStatus.PO_CREATED]: {
    title: 'PO Created',
    subProcesses: [
      { name: 'Draft Created', fields: ['createdTime', 'creator'] },
      { name: 'PO Number Assigned', fields: ['poNumber'] },
      { name: 'Submitted for Approval', fields: ['approvalStatus', 'approver'] },
      { name: 'Approved', fields: ['approvalTime', 'approver'] }
    ]
  },
  [PurchaseOrderStatus.PO_CONFIRMED]: {
    title: 'PO Confirmed',
    subProcesses: [
      { name: 'Sent to Supplier', fields: ['sentTime', 'contact'] },
      { name: 'Supplier Acknowledged', fields: ['replyStatus', 'contact'] },
      { name: 'PO Accepted / Rejected', fields: ['confirmTime', 'remarks'] },
      { name: 'Delivery Date Confirmed', fields: ['deliveryDate', 'responsible'] }
    ]
  },
  [PurchaseOrderStatus.IN_PRODUCTION]: {
    title: 'In Production',
    subProcesses: [
      { name: 'Material Ready', fields: ['materialCode', 'completionTime'] },
      { name: 'In Assembly', fields: ['startTime', 'batchNumber'] },
      { name: 'Testing & QA', fields: ['testResult', 'reportNumber'] },
      { name: 'Packaging', fields: ['packingTime', 'packingMethod'] },
      { name: 'Ready to Ship', fields: ['readyTime'] }
    ]
  },
  [PurchaseOrderStatus.EXPORT_CUSTOMS]: {
    title: 'Export & Customs',
    subProcesses: [
      { name: 'Booking Confirmed', fields: ['bookingNumber', 'carrier'] },
      { name: 'Customs Docs Prepared', fields: ['invoice', 'packingList', 'coo'] },
      { name: 'Customs Declaration Submitted', fields: ['declarationTime', 'agent'] },
      { name: 'Customs Cleared', fields: ['clearanceTime', 'remarks'] },
      { name: 'Shipped', fields: ['departureTime', 'vesselNumber'] }
    ]
  },
  [PurchaseOrderStatus.IMPORT_DELIVERY]: {
    title: 'Import & Delivery',
    subProcesses: [
      { name: 'Arrival at Port', fields: ['arrivalTime', 'port'] },
      { name: 'Import Declaration', fields: ['customsDocs', 'dutyFees'] },
      { name: 'Inspection', fields: ['inspectionStatus'] },
      { name: 'Customs Released', fields: ['releaseTime'] },
      { name: 'Local Delivery Scheduled', fields: ['deliveryTime', 'vehicleInfo'] },
      { name: 'Delivered to DC', fields: ['signTime', 'photos'] }
    ]
  },
  [PurchaseOrderStatus.RECEIVED]: {
    title: 'Received',
    subProcesses: [
      { name: 'GRN Created', fields: ['grnNumber', 'warehouse'] },
      { name: 'Quantity Checked', fields: ['actualQty', 'plannedQty'] },
      { name: 'Exception Flagged', fields: ['exceptions', 'damageNotes'] },
      { name: 'GRN Closed', fields: ['closeTime', 'operator'] }
    ]
  },
  [PurchaseOrderStatus.INVOICED]: {
    title: 'Invoiced',
    subProcesses: [
      { name: 'Invoice Received', fields: ['invoiceNumber', 'amount', 'uploader'] },
      { name: 'Three-Way Match', fields: ['matchStatus', 'discrepancy'] },
      { name: 'Payment Scheduled', fields: ['paymentPlan', 'paymentMethod'] },
      { name: 'Payment Completed', fields: ['paymentTime', 'voucher'] }
    ]
  }
} 