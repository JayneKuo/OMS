import { UpdateType, UpdateStatus, type OrderUpdate, WMSStatus, FailureType } from '@/types/orderUpdate'
import { OrderStatus } from '@/types/order'

// Generate mock data
const generateMockData = (count: number): OrderUpdate[] => {
  const data: OrderUpdate[] = []
  const channels = ['AMAZON', 'SHOPIFY', 'EBAY', 'WALMART']
  const operators = ['John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 'David Miller']
  
  for (let i = 0; i < count; i++) {
    const channel = channels[Math.floor(Math.random() * channels.length)]
    const updateType = Object.values(UpdateType)[Math.floor(Math.random() * Object.values(UpdateType).length)]
    const updateStatus = Object.values(UpdateStatus)[Math.floor(Math.random() * Object.values(UpdateStatus).length)]
    const orderStatus = Object.values(OrderStatus)[Math.floor(Math.random() * Object.values(OrderStatus).length)]
    const operator = operators[Math.floor(Math.random() * operators.length)]
    
    const baseTime = new Date('2024-03-01').getTime()
    const createTime = new Date(baseTime + Math.random() * (Date.now() - baseTime))
    const updateTime = new Date(createTime.getTime() + Math.random() * (Date.now() - createTime.getTime()))
    
    let content: any = {}
    let reason = ''
    let errorReason = ''
    
    switch (updateType) {
      case UpdateType.Quantity:
        content = {
          before: {
            quantity: Math.floor(Math.random() * 5) + 1,
            sku: `SKU${Math.floor(Math.random() * 1000)}`,
            productName: `Product ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
          },
          after: {
            quantity: Math.floor(Math.random() * 5) + 1,
            sku: `SKU${Math.floor(Math.random() * 1000)}`,
            productName: `Product ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
          }
        }
        reason = 'Customer requested quantity change'
        errorReason = 'Insufficient inventory in WMS'
        break
      case UpdateType.Address:
        content = {
          before: {
            address: `${Math.floor(Math.random() * 999)} Old Street, City, Country`,
            zipCode: String(Math.floor(Math.random() * 90000) + 10000)
          },
          after: {
            address: `${Math.floor(Math.random() * 999)} New Street, City, Country`,
            zipCode: String(Math.floor(Math.random() * 90000) + 10000)
          }
        }
        reason = 'Customer updated shipping address'
        errorReason = 'Address validation failed'
        break
      case UpdateType.SKU:
        content = {
          before: {
            sku: `SKU${Math.floor(Math.random() * 1000)}`,
            productName: `Product ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            quantity: Math.floor(Math.random() * 5) + 1
          },
          after: {
            sku: `SKU${Math.floor(Math.random() * 1000)}`,
            productName: `Product ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            quantity: Math.floor(Math.random() * 5) + 1
          }
        }
        reason = 'Product substitution due to out of stock'
        errorReason = 'New SKU not found in system'
        break
      case UpdateType.Price:
        const originalPrice = Math.floor(Math.random() * 1000) + 99.99
        content = {
          before: {
            price: originalPrice,
            currency: 'USD'
          },
          after: {
            price: originalPrice * (Math.random() * 0.3 + 0.8), // ±20% price change
            currency: 'USD'
          }
        }
        reason = 'Price adjustment due to promotion'
        errorReason = 'Price below minimum threshold'
        break
      case UpdateType.Shipping:
        const carriers = ['DHL', 'FedEx', 'UPS', 'USPS']
        const services = ['Express', 'Standard', 'Priority', 'Economy']
        content = {
          before: {
            carrier: carriers[Math.floor(Math.random() * carriers.length)],
            service: services[Math.floor(Math.random() * services.length)]
          },
          after: {
            carrier: carriers[Math.floor(Math.random() * carriers.length)],
            service: services[Math.floor(Math.random() * services.length)]
          }
        }
        reason = 'Shipping method upgrade requested'
        errorReason = 'Selected service not available for destination'
        break
      default:
        content = {
          before: { value: 'Original value' },
          after: { value: 'Updated value' }
        }
        reason = 'General update'
        errorReason = 'Update failed'
    }
    
    data.push({
      id: String(i + 1),
      orderId: String(Math.floor(Math.random() * 1000) + 1),
      orderNo: `SO${String(Math.floor(Math.random() * 900000) + 100000)}`,
      channelOrderNo: `${channel}-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      channel,
      updateType,
      updateStatus,
      orderStatus,
      content,
      reason,
      errorReason: updateStatus === UpdateStatus.Failed ? errorReason : '',
      createTime: createTime.toISOString(),
      updateTime: updateTime.toISOString(),
      operator,
      retryCount: updateStatus === UpdateStatus.Failed ? Math.floor(Math.random() * 3) : 0,
      nextRetryTime: updateStatus === UpdateStatus.Failed ? new Date(updateTime.getTime() + 30 * 60000).toISOString() : undefined,
      remarks: Math.random() > 0.7 ? 'Additional notes for this update' : undefined
    })
  }
  
  return data.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
}

// Generate 100 mock records
export const mockUpdateList = generateMockData(100)

// Mock API response with pagination
export const getMockUpdateResponse = (params: {
  page: number
  pageSize: number
  orderNo?: string
  channelOrderNo?: string
  channel?: string
  updateType?: string
  updateStatus?: string
  startTime?: string
  endTime?: string
}) => {
  let filteredData = [...mockUpdateList]
  
  // Apply filters
  if (params.orderNo) {
    filteredData = filteredData.filter(item => 
      item.orderNo.toLowerCase().includes(params.orderNo.toLowerCase())
    )
  }
  
  if (params.channelOrderNo) {
    filteredData = filteredData.filter(item => 
      item.channelOrderNo.toLowerCase().includes(params.channelOrderNo.toLowerCase())
    )
  }
  
  if (params.channel) {
    filteredData = filteredData.filter(item => item.channel === params.channel)
  }
  
  if (params.updateType) {
    filteredData = filteredData.filter(item => item.updateType === params.updateType)
  }
  
  if (params.updateStatus) {
    filteredData = filteredData.filter(item => item.updateStatus === params.updateStatus)
  }
  
  if (params.startTime && params.endTime) {
    const start = new Date(params.startTime).getTime()
    const end = new Date(params.endTime).getTime()
    filteredData = filteredData.filter(item => {
      const time = new Date(item.createTime).getTime()
      return time >= start && time <= end
    })
  }
  
  // Calculate pagination
  const total = filteredData.length
  const start = (params.page - 1) * params.pageSize
  const items = filteredData.slice(start, start + params.pageSize)
  
  return {
    total,
    items,
    page: params.page,
    pageSize: params.pageSize
  }
}

// Mock API delay
export const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500))

export const mockUpdateRecords: OrderUpdate[] = [
  {
    id: '1',
    orderId: 'order_001',
    orderNo: 'SO2024011001',
    sourceOrderNo: 'AMZ-8839921',
    channel: 'AMAZON',
    updateType: UpdateType.QuantityDecrease,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.WMSProcessing,
    content: {
      before: {
        productName: 'iPhone Case',
        sku: 'PHC-001',
        quantity: 2
      },
      after: {
        productName: 'iPhone Case',
        sku: 'PHC-001',
        quantity: 1
      },
      dispatchNos: ['WMS-001', 'WMS-002']
    },
    failureDescription: 'WMS is processing, cannot accept updates. Dispatch Nos: WMS-001, WMS-002',
    suggestion: 'Wait for WMS processing to complete or cancel the dispatch',
    failureTime: '2024-01-10 10:00:00'
  },
  {
    id: '2',
    orderId: 'order_002',
    orderNo: 'SO2024011002',
    sourceOrderNo: 'AMZ-8839922',
    channel: 'AMAZON',
    updateType: UpdateType.QuantityDecrease,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Shipped',
    failureType: FailureType.ShippedQuantityDecrease,
    content: {
      before: {
        productName: 'AirPods Case',
        sku: 'APC-001',
        quantity: 3
      },
      after: {
        productName: 'AirPods Case',
        sku: 'APC-001',
        quantity: 2
      },
      dispatchNos: ['SHIP-001'],
      isShipped: true
    },
    failureDescription: 'Some dispatch items have been shipped, cannot reduce quantity. Dispatched: SHIP-001',
    suggestion: 'Create a return order for the quantity reduction',
    failureTime: '2024-01-10 11:00:00'
  },
  {
    id: '3',
    orderId: 'order_003',
    orderNo: 'SO2024011003',
    sourceOrderNo: 'AMZ-8839923',
    channel: 'AMAZON',
    updateType: UpdateType.NewLineItem,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.NewSKUFailed,
    content: {
      before: {
        items: []
      },
      after: {
        items: [
          {
            productName: 'Phone Stand',
            sku: 'PHS-001',
            quantity: 1
          }
        ]
      },
      dispatchNos: ['WMS-003']
    },
    failureDescription: 'Failed to dispatch new SKUs. Dispatch Nos: WMS-003',
    suggestion: 'Try dispatching separately or redispatch the entire order',
    failureTime: '2024-01-10 12:00:00'
  },
  {
    id: '4',
    orderId: 'order_004',
    orderNo: 'SO2024011004',
    sourceOrderNo: 'AMZ-8839924',
    channel: 'AMAZON',
    updateType: UpdateType.AddressChange,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.AddressChangeDispatchIssued,
    content: {
      before: {
        address: '123 Main St, New York',
        zipCode: '10001'
      },
      after: {
        address: '456 Park Ave, New York',
        zipCode: '10002'
      },
      dispatchNos: ['WMS-004']
    },
    failureDescription: 'Dispatch issued, cannot change address. Dispatch Nos: WMS-004',
    suggestion: 'Cancel current dispatch and create a new one with updated address',
    failureTime: '2024-01-10 13:00:00'
  },
  {
    id: '5',
    orderId: 'order_005',
    orderNo: 'SO2024011005',
    sourceOrderNo: 'AMZ-8839925',
    channel: 'AMAZON',
    updateType: UpdateType.AddressChange,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Shipped',
    failureType: FailureType.AddressChangeShipped,
    content: {
      before: {
        address: '789 Old St, New York',
        zipCode: '10003'
      },
      after: {
        address: '321 New Ave, New York',
        zipCode: '10004'
      },
      dispatchNos: ['SHIP-002'],
      isShipped: true
    },
    failureDescription: 'Shipped items, address modification not allowed.',
    suggestion: 'No action available for shipped orders',
    failureTime: '2024-01-10 14:00:00'
  },
  {
    id: '6',
    orderId: 'order_006',
    orderNo: 'SO2024011006',
    sourceOrderNo: 'SHP-112233',
    channel: 'SHOPIFY',
    updateType: UpdateType.QuantityIncrease,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.QuantityIncreaseFailed,
    content: {
      before: {
        productName: 'Wireless Charger',
        sku: 'WC-001',
        quantity: 1
      },
      after: {
        productName: 'Wireless Charger',
        sku: 'WC-001',
        quantity: 3
      },
      dispatchNos: ['WMS-005']
    },
    failureDescription: 'Failed to dispatch increased quantity. Dispatch Nos: WMS-005',
    suggestion: 'Check inventory and try redispatching',
    failureTime: '2024-01-10 15:00:00'
  },
  {
    id: '7',
    orderId: 'order_007',
    orderNo: 'SO2024011007',
    sourceOrderNo: 'WMT-445566',
    channel: 'WALMART',
    updateType: UpdateType.RemoveLineItem,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Shipped',
    failureType: FailureType.ShippedItemModification,
    content: {
      before: {
        items: [
          {
            productName: 'USB Cable',
            sku: 'USB-001',
            quantity: 1
          }
        ]
      },
      after: {
        items: []
      },
      dispatchNos: ['SHIP-003'],
      isShipped: true
    },
    failureDescription: 'Shipped items cannot be deleted or reduced.',
    suggestion: 'Create a return order for the entire item',
    failureTime: '2024-01-10 16:00:00'
  },
  {
    id: '8',
    orderId: 'order_008',
    orderNo: 'SO2024011008',
    sourceOrderNo: 'AMZ-8839926',
    channel: 'AMAZON',
    updateType: UpdateType.Exchange,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.WMSProcessing,
    content: {
      before: {
        productName: 'Phone Case Black',
        sku: 'PC-001-BLK',
        quantity: 1
      },
      after: {
        productName: 'Phone Case White',
        sku: 'PC-001-WHT',
        quantity: 1
      },
      dispatchNos: ['WMS-006']
    },
    failureDescription: 'WMS is processing, cannot accept updates. Dispatch Nos: WMS-006',
    suggestion: 'Wait for WMS processing to complete or cancel the dispatch',
    failureTime: '2024-01-10 17:00:00'
  },
  {
    id: '9',
    orderId: 'order_009',
    orderNo: 'SO2024011009',
    sourceOrderNo: 'SHP-112234',
    channel: 'SHOPIFY',
    updateType: UpdateType.NewLineItem,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.NewSKUFailed,
    content: {
      before: {
        items: []
      },
      after: {
        items: [
          {
            productName: 'Screen Protector',
            sku: 'SP-001',
            quantity: 2
          },
          {
            productName: 'Cleaning Kit',
            sku: 'CK-001',
            quantity: 1
          }
        ]
      },
      dispatchNos: ['WMS-007', 'WMS-008']
    },
    failureDescription: 'Failed to dispatch new SKUs. Dispatch Nos: WMS-007, WMS-008',
    suggestion: 'Try dispatching items separately or redispatch the entire order',
    failureTime: '2024-01-10 18:00:00'
  },
  {
    id: '10',
    orderId: 'order_010',
    orderNo: 'SO2024011010',
    sourceOrderNo: 'WMT-445567',
    channel: 'WALMART',
    updateType: UpdateType.QuantityDecrease,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'PartiallyShipped',
    failureType: FailureType.ShippedQuantityDecrease,
    content: {
      before: {
        productName: 'Power Bank',
        sku: 'PB-001',
        quantity: 5
      },
      after: {
        productName: 'Power Bank',
        sku: 'PB-001',
        quantity: 2
      },
      dispatchNos: ['SHIP-004', 'WMS-009'],
      isShipped: true
    },
    failureDescription: 'Some dispatch items have been shipped (SHIP-004), cannot reduce quantity. Remaining dispatch: WMS-009',
    suggestion: 'Create return for shipped items and cancel remaining dispatch',
    failureTime: '2024-01-10 19:00:00'
  },
  {
    id: '11',
    orderId: 'order_011',
    orderNo: 'SO2024011011',
    sourceOrderNo: 'AMZ-8839927',
    channel: 'AMAZON',
    updateType: UpdateType.AddressChange,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.AddressChangeDispatchIssued,
    content: {
      before: {
        address: '555 Commerce St, Los Angeles',
        zipCode: '90001'
      },
      after: {
        address: '777 Business Ave, Los Angeles',
        zipCode: '90002'
      },
      dispatchNos: ['WMS-010', 'WMS-011', 'WMS-012']
    },
    failureDescription: 'Dispatch issued, cannot change address. Dispatch Nos: WMS-010, WMS-011, WMS-012',
    suggestion: 'Cancel all current dispatches and create new ones with updated address',
    failureTime: '2024-01-10 20:00:00'
  },
  {
    id: '12',
    orderId: 'order_012',
    orderNo: 'SO2024011012',
    sourceOrderNo: 'SHP-112235',
    channel: 'SHOPIFY',
    updateType: UpdateType.Exchange,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Shipped',
    failureType: FailureType.ShippedItemModification,
    content: {
      before: {
        productName: 'Tablet Stand Silver',
        sku: 'TS-001-SLV',
        quantity: 1
      },
      after: {
        productName: 'Tablet Stand Gold',
        sku: 'TS-001-GLD',
        quantity: 1
      },
      dispatchNos: ['SHIP-005'],
      isShipped: true
    },
    failureDescription: 'Shipped items cannot be exchanged.',
    suggestion: 'Create a return order and place a new order for the desired item',
    failureTime: '2024-01-10 21:00:00'
  },
  {
    id: '13',
    orderId: 'order_013',
    orderNo: 'SO2024011013',
    sourceOrderNo: 'EBY-334455',
    channel: 'EBAY',
    updateType: UpdateType.QuantityDecrease,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.WMSProcessing,
    content: {
      before: {
        productName: 'Gaming Mouse',
        sku: 'GM-001',
        quantity: 3
      },
      after: {
        productName: 'Gaming Mouse',
        sku: 'GM-001',
        quantity: 2
      },
      dispatchNos: ['WMS-013']
    },
    failureDescription: 'WMS is processing, cannot accept updates. Dispatch Nos: WMS-013',
    suggestion: 'Wait for WMS processing to complete or cancel the dispatch',
    failureTime: '2024-01-10 22:00:00'
  },
  {
    id: '14',
    orderId: 'order_014',
    orderNo: 'SO2024011014',
    sourceOrderNo: 'WAY-556677',
    channel: 'WAYFAIR',
    updateType: UpdateType.AddressChange,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.AddressChangeDispatchIssued,
    content: {
      before: {
        address: '888 Furniture St, Chicago',
        zipCode: '60601'
      },
      after: {
        address: '999 Home Ave, Chicago',
        zipCode: '60602'
      },
      dispatchNos: ['WMS-014']
    },
    failureDescription: 'Dispatch issued, cannot change address. Dispatch Nos: WMS-014',
    suggestion: 'Cancel current dispatch and create a new one with updated address',
    failureTime: '2024-01-10 23:00:00'
  },
  {
    id: '15',
    orderId: 'order_015',
    orderNo: 'SO2024011015',
    sourceOrderNo: 'HD-667788',
    channel: 'HOMEDEPOT',
    updateType: UpdateType.NewLineItem,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.NewSKUFailed,
    content: {
      before: {
        items: []
      },
      after: {
        items: [
          {
            productName: 'Tool Set',
            sku: 'TS-001',
            quantity: 1
          }
        ]
      },
      dispatchNos: ['WMS-015']
    },
    failureDescription: 'Failed to dispatch new SKUs. Dispatch Nos: WMS-015',
    suggestion: 'Try dispatching separately or redispatch the entire order',
    failureTime: '2024-01-11 00:00:00'
  },
  {
    id: '16',
    orderId: 'order_016',
    orderNo: 'SO2024011016',
    sourceOrderNo: 'LOW-778899',
    channel: 'LOWES',
    updateType: UpdateType.QuantityIncrease,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.QuantityIncreaseFailed,
    content: {
      before: {
        productName: 'Paint Brush Set',
        sku: 'PBS-001',
        quantity: 2
      },
      after: {
        productName: 'Paint Brush Set',
        sku: 'PBS-001',
        quantity: 4
      },
      dispatchNos: ['WMS-016']
    },
    failureDescription: 'Failed to dispatch increased quantity. Dispatch Nos: WMS-016',
    suggestion: 'Check inventory and try redispatching',
    failureTime: '2024-01-11 01:00:00'
  },
  {
    id: '17',
    orderId: 'order_017',
    orderNo: 'SO2024011017',
    sourceOrderNo: 'TGT-889900',
    channel: 'TARGET',
    updateType: UpdateType.Exchange,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Processing',
    failureType: FailureType.WMSProcessing,
    content: {
      before: {
        productName: 'Coffee Maker Black',
        sku: 'CM-001-BLK',
        quantity: 1
      },
      after: {
        productName: 'Coffee Maker Silver',
        sku: 'CM-001-SLV',
        quantity: 1
      },
      dispatchNos: ['WMS-017']
    },
    failureDescription: 'WMS is processing, cannot accept updates. Dispatch Nos: WMS-017',
    suggestion: 'Wait for WMS processing to complete or cancel the dispatch',
    failureTime: '2024-01-11 02:00:00'
  },
  {
    id: '18',
    orderId: 'order_018',
    orderNo: 'SO2024011018',
    sourceOrderNo: 'CST-990011',
    channel: 'COSTCO',
    updateType: UpdateType.RemoveLineItem,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'Shipped',
    failureType: FailureType.ShippedItemModification,
    content: {
      before: {
        items: [
          {
            productName: 'Storage Container',
            sku: 'SC-001',
            quantity: 1
          }
        ]
      },
      after: {
        items: []
      },
      dispatchNos: ['SHIP-006'],
      isShipped: true
    },
    failureDescription: 'Shipped items cannot be deleted or reduced.',
    suggestion: 'Create a return order for the entire item',
    failureTime: '2024-01-11 03:00:00'
  },
  {
    id: '19',
    orderId: 'order_019',
    orderNo: 'SO2024011019',
    sourceOrderNo: 'SAM-001122',
    channel: 'SAMSCLUB',
    updateType: UpdateType.QuantityDecrease,
    updateStatus: UpdateStatus.Failed,
    orderStatus: 'PartiallyShipped',
    failureType: FailureType.ShippedQuantityDecrease,
    content: {
      before: {
        productName: 'Bulk Paper Towels',
        sku: 'BPT-001',
        quantity: 3
      },
      after: {
        productName: 'Bulk Paper Towels',
        sku: 'BPT-001',
        quantity: 1
      },
      dispatchNos: ['SHIP-007', 'WMS-018'],
      isShipped: true
    },
    failureDescription: 'Some dispatch items have been shipped (SHIP-007), cannot reduce quantity. Remaining dispatch: WMS-018',
    suggestion: 'Create return for shipped items and cancel remaining dispatch',
    failureTime: '2024-01-11 04:00:00'
  }
] 