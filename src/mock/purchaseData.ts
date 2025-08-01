import { faker } from '@faker-js/faker'

// 仓库数据类型
export interface Warehouse {
  id: string
  code: string
  name: string
  address: string
  contact: string
  phone: string
  status: 'active' | 'inactive'
}

// 供应商地址类型
export interface Address {
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country: string
}

// 供应商信息类型
export interface SupplierInfo {
  name: string
  contactFirstName: string
  contactLastName: string
  email: string
  phone: string
  address: Address
  notes?: string
}

// 物流信息类型
export interface ShippingInfo {
  shippingService: string
  expectedShipDate: string
  expectedArrivalDate: string
  address: Address
  referenceNumber?: string
  memo?: string
}

// 采购订单数据类型
export interface PurchaseOrder {
  id: string
  orderNo: string
  warehouseId: string
  warehouse: string
  supplier: SupplierInfo
  shipping: ShippingInfo
  orderDate: string
  status: 'draft' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  items: PurchaseOrderItem[]
  total: number
}

// 采购订单明细类型
export interface PurchaseOrderItem {
  id: string
  sku: string
  supplierSku: string
  name: string
  quantity: number
  available?: number
  received?: number
  price: number
  total: number
}

// 到货单数据类型
export interface Arrival {
  id: string
  arrivalNo: string
  purchaseOrder: string
  destination: string
  externalId: string
  senderName: string
  totalWeight: number
  weightUnit: 'lb' | 'kg'
  items: ArrivalItem[]
  status: 'pending' | 'received' | 'cancelled'
  // 高级物流信息
  extShipmentId?: string
  incoterms?: string
  expectedArrivalDate?: string
  shippingCarrier?: string
  shippingMethod?: string
  shippingNote?: string
  bol?: string
  seal?: string
  trailerNumber?: string
  trailerSize?: string
  trailerType?: string
  containerNumber?: string
  containerSize?: string
  containerType?: string
}

// 到货单明细类型
export interface ArrivalItem {
  id: string
  sku: string
  name: string
  orderedQty: number
  quantity: number
  unit: string
  lotNumber?: string
  palletQuantity?: number
  upc?: string
  purchaseId: string
}

// 收货单数据类型
export interface Receipt {
  id: string
  receiptNo: string
  arrivalNo: string
  externalId: string
  receiptDate: string
  shippingCarrier: string
  shippingClass: string
  items: ReceiptItem[]
  status: 'pending' | 'completed' | 'cancelled'
}

// 收货单明细类型
export interface ReceiptItem {
  id: string
  sku: string
  name: string
  shippedQty: number
  receivedQty: number
  unit: string
}

// 生成仓库数据
export const generateWarehouses = (count = 5): Warehouse[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `WH${String(index + 1).padStart(3, '0')}`,
    code: `WH${String(index + 1).padStart(3, '0')}`,
    name: faker.company.name() + ' Warehouse',
    address: faker.location.streetAddress(),
    contact: faker.person.fullName(),
    phone: faker.phone.number(),
    status: faker.helpers.arrayElement(['active', 'inactive'])
  }))
}

// 生成地址
const generateAddress = (): Address => ({
  address1: faker.location.streetAddress(),
  address2: faker.helpers.maybe(() => faker.location.secondaryAddress()),
  city: faker.location.city(),
  state: faker.location.state(),
  zip: faker.location.zipCode(),
  country: faker.location.country()
})

// 生成供应商信息
const generateSupplierInfo = (): SupplierInfo => ({
  name: faker.company.name(),
  contactFirstName: faker.person.firstName(),
  contactLastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: generateAddress(),
  notes: faker.helpers.maybe(() => faker.lorem.sentence())
})

// 生成物流信息
const generateShippingInfo = (): ShippingInfo => ({
  shippingService: faker.helpers.arrayElement(['Standard', 'Express', 'Priority']),
  expectedShipDate: faker.date.future().toISOString(),
  expectedArrivalDate: faker.date.future().toISOString(),
  address: generateAddress(),
  referenceNumber: faker.helpers.maybe(() => faker.string.alphanumeric(10).toUpperCase()),
  memo: faker.helpers.maybe(() => faker.lorem.sentence())
})

// 生成采购订单数据
export const generatePurchaseOrders = (count = 10): PurchaseOrder[] => {
  const warehouses = generateWarehouses()
  
  return Array.from({ length: count }, (_, index) => {
    const items = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: faker.string.uuid(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      supplierSku: faker.string.alphanumeric(10).toUpperCase(),
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      available: faker.number.int({ min: 0, max: 100 }),
      received: faker.number.int({ min: 0, max: 100 }),
      price: parseFloat(faker.commerce.price()),
      total: 0
    }))

    // 计算总价
    items.forEach(item => {
      item.total = item.quantity * item.price
    })

    const warehouse = faker.helpers.arrayElement(warehouses)
    return {
      id: faker.string.uuid(),
      orderNo: `PO${String(index + 1).padStart(6, '0')}`,
      warehouseId: warehouse.id,
      warehouse: warehouse.name,
      supplier: generateSupplierInfo(),
      shipping: generateShippingInfo(),
      orderDate: faker.date.past().toISOString(),
      status: faker.helpers.arrayElement(['draft', 'confirmed', 'processing', 'completed', 'cancelled']),
      items,
      total: items.reduce((sum, item) => sum + item.total, 0)
    }
  })
}

// 生成到货单数据
export const generateArrivals = (purchaseOrders: PurchaseOrder[]): Arrival[] => {
  return purchaseOrders.flatMap(po => {
    const arrivalCount = faker.number.int({ min: 1, max: 3 })
    return Array.from({ length: arrivalCount }, (_, index) => ({
      id: faker.string.uuid(),
      arrivalNo: `ASN${po.orderNo}-${index + 1}`,
      purchaseOrder: po.orderNo,
      destination: po.warehouse,
      externalId: faker.string.alphanumeric(10).toUpperCase(),
      senderName: po.supplier.name,
      totalWeight: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
      weightUnit: faker.helpers.arrayElement(['lb', 'kg']),
      items: po.items.map(item => ({
        id: faker.string.uuid(),
        sku: item.sku,
        name: item.name,
        orderedQty: item.quantity,
        quantity: faker.number.int({ min: 1, max: item.quantity }),
        unit: 'pcs',
        lotNumber: faker.string.alphanumeric(8).toUpperCase(),
        palletQuantity: faker.number.int({ min: 1, max: 10 }),
        upc: faker.string.numeric(12),
        purchaseId: po.orderNo
      })),
      status: faker.helpers.arrayElement(['pending', 'received', 'cancelled']),
      extShipmentId: faker.helpers.maybe(() => faker.string.alphanumeric(10).toUpperCase()),
      incoterms: faker.helpers.maybe(() => faker.helpers.arrayElement(['FOB', 'CIF', 'EXW'])),
      expectedArrivalDate: faker.date.future().toISOString(),
      shippingCarrier: faker.company.name(),
      shippingMethod: faker.helpers.arrayElement(['Ground', 'Air', 'Ocean']),
      shippingNote: faker.helpers.maybe(() => faker.lorem.sentence()),
      bol: faker.helpers.maybe(() => faker.string.alphanumeric(10).toUpperCase()),
      seal: faker.helpers.maybe(() => faker.string.alphanumeric(8).toUpperCase()),
      trailerNumber: faker.helpers.maybe(() => faker.string.alphanumeric(8).toUpperCase()),
      trailerSize: faker.helpers.maybe(() => faker.helpers.arrayElement(['20ft', '40ft', '53ft'])),
      trailerType: faker.helpers.maybe(() => faker.helpers.arrayElement(['Dry', 'Reefer', 'Flatbed'])),
      containerNumber: faker.helpers.maybe(() => faker.string.alphanumeric(11).toUpperCase()),
      containerSize: faker.helpers.maybe(() => faker.helpers.arrayElement(['20ft', '40ft', '40HC'])),
      containerType: faker.helpers.maybe(() => faker.helpers.arrayElement(['Dry', 'Reefer', 'Open Top']))
    }))
  })
}

// 生成收货单数据
export const generateReceipts = (arrivals: Arrival[]): Receipt[] => {
  return arrivals.flatMap(arrival => {
    if (arrival.status !== 'received') return []
    
    return {
      id: faker.string.uuid(),
      receiptNo: `RCV${arrival.arrivalNo}`,
      arrivalNo: arrival.arrivalNo,
      externalId: faker.string.alphanumeric(10).toUpperCase(),
      receiptDate: faker.date.recent().toISOString(),
      shippingCarrier: arrival.shippingCarrier || '',
      shippingClass: faker.helpers.arrayElement(['Standard', 'Express', 'Priority']),
      items: arrival.items.map(item => ({
        id: faker.string.uuid(),
        sku: item.sku,
        name: item.name,
        shippedQty: item.quantity,
        receivedQty: faker.number.int({ min: 0, max: item.quantity }),
        unit: item.unit
      })),
      status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled'])
    }
  })
}

// 生成所有数据
const purchaseOrders = generatePurchaseOrders(10)
const arrivals = generateArrivals(purchaseOrders)
const receipts = generateReceipts(arrivals)

export const mockPurchaseData = {
  warehouses: generateWarehouses(),
  purchaseOrders,
  arrivals,
  receipts
} 