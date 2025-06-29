import { 
  ReturnOrder, 
  ReturnOrderStatus, 
  ReturnType, 
  ReturnReason,
  ChannelType,
  ReturnItem,
  Shipment,
  RMSMapping,
  WMSMapping,
  ReturnItemStatus
} from '../types'

export const mockReturnOrders: ReturnOrder[] = [
  {
    id: '1',
    returnOrderNo: 'RO20240320001',
    originalOrderNo: 'SO20240315001',
    status: ReturnOrderStatus.Created,
    returnType: ReturnType.Refund,
    reason: ReturnReason.QualityIssue,
    
    channel: {
      type: ChannelType.SHOPIFY,
      storeName: 'Fashion Store US',
      storeId: 'FST001',
      platformOrderNo: '1234567890',
      accountId: 'SHOP_US_001',
      returnOrderNo: 'RET-1234567890'
    },
    
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    country: 'US',
    
    createTime: '2024-03-20T10:00:00Z',
    items: [
      {
        id: '1',
        productId: 'P001',
        productName: 'Premium T-Shirt',
        sku: 'TS-001-L-BLK',
        quantity: 2,
        originalPrice: 29.99,
        refundPrice: 29.99,
        reason: ReturnReason.QualityIssue,
        status: ReturnItemStatus.Pending,
        notes: 'Color fading after first wash',
        images: ['image1.jpg', 'image2.jpg'],
        condition: 'Used - Like New',
        locationCode: 'ZONE-A-01-01'
      }
    ],
    totalAmount: 59.98,
    refundAmount: 59.98,
    currency: 'USD',
    
    rma: 'RMA001',
    facilityId: 'WH-NY-001',
    shipment: {
      carrier: 'UPS',
      trackingNumber: '1Z999AA1234567890',
      eta: '2024-03-25T15:00:00Z',
      method: 'Ground',
      status: 'In Transit',
      shippedDate: '2024-03-21T09:00:00Z',
      deliveredDate: '2024-03-25T15:30:00Z'
    },
    systemMapping: {
      rms: {
        status: 'PENDING',
        rmaNo: 'RMA001',
        facilityId: 'WH-NY-001',
        notes: 'Pending approval',
        dnNumber: 'DN001'
      },
      wms: {
        status: 'CREATED',
        inboundNo: 'IB001',
        warehouseId: 'WH-NY-001',
        notes: 'Awaiting receipt',
        dnNumber: 'DN001'
      }
    },
    tags: ['VIP Customer', 'Priority'],
    priority: 'High',
    processedBy: 'System',
    approvedDate: '2024-03-20T11:00:00Z'
  },
  {
    id: '2',
    returnOrderNo: 'RO20240320002',
    originalOrderNo: 'SO20240316002',
    status: ReturnOrderStatus.Processing,
    returnType: ReturnType.Exchange,
    reason: ReturnReason.WrongSize,
    
    channel: {
      type: ChannelType.AMAZON,
      storeName: 'Fashion Prime',
      storeId: 'AMZ002',
      platformOrderNo: 'AMZ-12345',
      accountId: 'AMZ_US_002',
      returnOrderNo: 'ARET-12345'
    },
    
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1 (555) 234-5678',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    country: 'US',
    
    createTime: '2024-03-20T11:30:00Z',
    items: [
      {
        id: '2',
        productId: 'P002',
        productName: 'Designer Jeans',
        sku: 'DJ-002-32-BLU',
        quantity: 1,
        originalPrice: 89.99,
        refundPrice: 89.99,
        reason: ReturnReason.WrongSize,
        status: ReturnItemStatus.Approved,
        notes: 'Need a larger size',
        condition: 'New with Tags',
        locationCode: 'ZONE-B-02-03'
      }
    ],
    totalAmount: 89.99,
    refundAmount: 0,
    currency: 'USD',
    
    rma: 'RMA002',
    facilityId: 'WH-LA-001',
    shipment: {
      carrier: 'FedEx',
      trackingNumber: '7891234567',
      eta: '2024-03-26T14:00:00Z',
      method: 'Express',
      status: 'Label Created',
      shippedDate: '2024-03-21T09:00:00Z'
    },
    systemMapping: {
      rms: {
        status: 'PROCESSING',
        rmaNo: 'RMA002',
        facilityId: 'WH-LA-001',
        notes: 'Exchange in progress'
      },
      wms: {
        status: 'PENDING_RECEIPT',
        inboundNo: 'IB002',
        warehouseId: 'WH-LA-001',
        notes: 'Preparing for receipt'
      }
    },
    tags: ['Exchange'],
    priority: 'Medium',
    processedBy: 'John Doe',
    approvedDate: '2024-03-20T12:00:00Z'
  },
  {
    id: '3',
    returnOrderNo: 'RO20240320003',
    originalOrderNo: 'SO20240317003',
    status: ReturnOrderStatus.Received,
    returnType: ReturnType.Refund,
    reason: ReturnReason.Defective,
    
    channel: {
      type: ChannelType.WALMART,
      storeName: 'Fashion Mart',
      storeId: 'WMT003',
      platformOrderNo: 'WM-67890',
      accountId: 'WMT_US_003'
    },
    
    customerName: 'Michael Brown',
    customerEmail: 'm.brown@email.com',
    customerPhone: '+1 (555) 345-6789',
    address: '789 Pine St, Chicago, IL 60601',
    country: 'US',
    
    createTime: '2024-03-20T09:00:00Z',
    approvedDate: '2024-03-20T09:30:00Z',
    shipDate: '2024-03-21T10:00:00Z',
    receiveDate: '2024-03-22T14:00:00Z',
    
    items: [
      {
        id: '3',
        productId: 'P003',
        productName: 'Smart Watch',
        sku: 'SW-003-BLK',
        quantity: 1,
        originalPrice: 199.99,
        refundPrice: 199.99,
        reason: ReturnReason.Defective,
        status: ReturnItemStatus.Received,
        notes: 'Screen not working',
        condition: 'Defective',
        locationCode: 'ZONE-C-01-02',
        inspectionResult: 'Hardware failure confirmed',
        processedBy: 'Jane Smith',
        processedAt: '2024-03-22T14:30:00Z'
      }
    ],
    totalAmount: 199.99,
    refundAmount: 199.99,
    currency: 'USD',
    
    hdr: 'HDR003',
    facilityId: 'WH-CHI-001',
    rma: 'RMA003',
    shipment: {
      carrier: 'USPS',
      trackingNumber: '9405123456789',
      method: 'Priority Mail',
      status: 'Delivered',
      shippedDate: '2024-03-21T10:00:00Z',
      deliveredDate: '2024-03-22T14:00:00Z'
    },
    systemMapping: {
      rms: {
        status: 'RECEIVED',
        rmaNo: 'RMA003',
        facilityId: 'WH-CHI-001',
        notes: 'Quality inspection required'
      },
      wms: {
        status: 'RECEIVED',
        inboundNo: 'IB003',
        warehouseId: 'WH-CHI-001',
        dnNumber: 'DN003',
        receivedDate: '2024-03-22T14:00:00Z',
        notes: 'Stored in QC area'
      }
    },
    tags: ['Warranty', 'Quality Check Required'],
    priority: 'High',
    processedBy: 'Jane Smith'
  }
]

export const getReturnOrderById = (id: string): ReturnOrder | undefined => {
  return mockReturnOrders.find(order => order.id === id)
}

export const getReturnOrderByNo = (returnOrderNo: string): ReturnOrder | undefined => {
  return mockReturnOrders.find(order => order.returnOrderNo === returnOrderNo)
}

interface SearchParams {
  returnOrderNo?: string
  originalOrderNo?: string
  channelOrderNo?: string
  returnType?: ReturnType
  channel?: ChannelType
  status?: ReturnOrderStatus[]
  dateRange?: [string, string] | null
  page: number
  pageSize: number
}

export const searchReturnOrders = (params: SearchParams): Promise<{ data: ReturnOrder[], total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredOrders = [...mockReturnOrders]

      // 应用搜索过滤
      if (params.returnOrderNo) {
        filteredOrders = filteredOrders.filter(order => 
          order.returnOrderNo.toLowerCase().includes(params.returnOrderNo!.toLowerCase())
        )
      }

      if (params.originalOrderNo) {
        filteredOrders = filteredOrders.filter(order => 
          order.originalOrderNo.toLowerCase().includes(params.originalOrderNo!.toLowerCase())
        )
      }

      if (params.channelOrderNo) {
        filteredOrders = filteredOrders.filter(order => 
          order.channel.platformOrderNo.toLowerCase().includes(params.channelOrderNo!.toLowerCase())
        )
      }

      if (params.returnType) {
        filteredOrders = filteredOrders.filter(order => 
          order.returnType === params.returnType
        )
      }

      if (params.channel) {
        filteredOrders = filteredOrders.filter(order => 
          order.channel.type === params.channel
        )
      }

      if (params.status && params.status.length > 0) {
        filteredOrders = filteredOrders.filter(order => 
          params.status!.includes(order.status)
        )
      }

      if (params.dateRange) {
        const [startDate, endDate] = params.dateRange
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.createTime)
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
        })
      }

      // 计算分页
      const total = filteredOrders.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const paginatedOrders = filteredOrders.slice(start, end)

      resolve({
        data: paginatedOrders,
        total
      })
    }, 500) // 模拟网络延迟
  })
}

// 生成模拟数据
const generateMockData = (): ReturnOrder => ({
  id: Math.random().toString(36).substr(2, 9),
  returnOrderNo: `RET${Math.random().toString().substr(2, 8)}`,
  originalOrderNo: `ORD${Math.random().toString().substr(2, 8)}`,
  status: ReturnOrderStatus.Created,
  returnType: Math.random() > 0.5 ? ReturnType.Refund : ReturnType.Exchange,
  reason: ReturnReason.QualityIssue,
  
  channel: {
    type: ChannelType.SHOPIFY,
    storeName: 'Test Store',
    storeId: 'ST001',
    platformOrderNo: `PLT${Math.random().toString().substr(2, 8)}`,
    accountId: 'ACC001'
  },
  
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '1234567890',
  address: '123 Test Street',
  country: 'US',
  
  createTime: new Date().toISOString(),
  items: [
    {
      id: Math.random().toString(36).substr(2, 9),
      productId: 'PRD001',
      productName: 'Test Product',
      sku: 'SKU001',
      quantity: 1,
      originalPrice: 99.99,
      refundPrice: 99.99,
      reason: ReturnReason.QualityIssue,
      status: ReturnItemStatus.Pending,
      images: ['image1.jpg']
    }
  ],
  totalAmount: 99.99,
  refundAmount: 99.99,
  currency: 'USD',
  
  hdr: `HDR${Math.random().toString().substr(2, 8)}`,
  facilityId: 'FAC001',
  rma: `RMA${Math.random().toString().substr(2, 8)}`,
  
  shipment: {
    carrier: 'UPS',
    trackingNumber: `TRK${Math.random().toString().substr(2, 8)}`,
    method: 'Ground',
    status: 'In Transit',
    eta: new Date(Date.now() + 86400000 * 3).toISOString()
  },
  
  systemMapping: {
    rms: {
      status: 'Pending',
      rmaNo: `RMA${Math.random().toString().substr(2, 8)}`,
      facilityId: 'FAC001'
    },
    wms: {
      status: 'Pending',
      inboundNo: `INB${Math.random().toString().substr(2, 8)}`,
      warehouseId: 'WH001'
    }
  },
  
  tags: ['VIP', 'Priority'],
  priority: 'High'
}) 