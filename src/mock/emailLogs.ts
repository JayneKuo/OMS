import { LogItem } from '@/api/emailLogs'

// 模拟邮件日志数据
export const mockEmailLogs: LogItem[] = [
  {
    id: '1',
    createTime: '2023-08-15T10:30:00',
    issueType: 'inventory',
    description: '库存同步异常，产品SKU: ABC123的库存数量不一致',
    channel: 'Amazon',
    channelOrderId: 'AMZ-123456789',
    systemOrderId: 'SYS-2023081501',
    status: 'unsolved',
    emailSent: 'sent',
    recipients: 'warehouse@example.com',
    emailContent: '库存异常提醒：系统检测到产品SKU: ABC123的库存数量不一致，请及时处理。',
    lastSendTime: '2023-08-15T10:30:00',
    emailHistory: [
      {
        sendTime: '2023-08-15T10:30:00',
        status: 'sent',
        recipients: 'warehouse@example.com'
      }
    ]
  },
  {
    id: '2',
    createTime: '2023-08-16T14:15:00',
    issueType: 'order',
    description: '订单处理延迟，超过48小时未处理',
    channel: 'Shopify',
    channelOrderId: 'SPF-87654321',
    systemOrderId: 'SYS-2023081602',
    status: 'unsolved',
    emailSent: 'unsent',
    lastSendTime: undefined
  },
  {
    id: '3',
    createTime: '2023-08-17T09:45:00',
    issueType: 'logistics',
    description: '物流信息异常，包裹显示已发出但无跟踪信息',
    channel: 'Walmart',
    channelOrderId: 'WMT-12398765',
    systemOrderId: 'SYS-2023081703',
    status: 'solved',
    emailSent: 'sent',
    recipients: 'logistics@example.com, support@example.com',
    emailContent: '物流异常提醒：系统检测到订单WMT-12398765的包裹显示已发出但无跟踪信息，请检查物流系统。',
    resolveTime: '2023-08-18T15:20:00',
    resolveNote: '已联系物流公司，跟踪信息已更新',
    lastSendTime: '2023-08-17T14:30:00',
    emailHistory: [
      {
        sendTime: '2023-08-17T09:45:00',
        status: 'sent',
        recipients: 'logistics@example.com'
      },
      {
        sendTime: '2023-08-17T14:30:00',
        status: 'sent',
        recipients: 'logistics@example.com, support@example.com'
      }
    ]
  },
  {
    id: '4',
    createTime: '2023-08-18T16:30:00',
    issueType: 'system',
    description: '系统同步错误，API连接超时',
    channel: 'eBay',
    channelOrderId: 'EB-45678912',
    systemOrderId: 'SYS-2023081804',
    status: 'unsolved',
    emailSent: 'failed',
    lastSendTime: '2023-08-18T16:30:00',
    emailHistory: [
      {
        sendTime: '2023-08-18T16:30:00',
        status: 'failed',
        recipients: 'it-support@example.com'
      }
    ]
  },
  {
    id: '5',
    createTime: '2023-08-19T11:20:00',
    issueType: 'other',
    description: '客户投诉商品质量问题',
    channel: 'Amazon',
    channelOrderId: 'AMZ-98765432',
    systemOrderId: 'SYS-2023081905',
    status: 'unsolved',
    emailSent: 'sent',
    recipients: 'customer-service@example.com',
    emailContent: '客户投诉提醒：有客户反馈订单AMZ-98765432的商品存在质量问题，请尽快联系处理。',
    lastSendTime: '2023-08-19T11:20:00',
    emailHistory: [
      {
        sendTime: '2023-08-19T11:20:00',
        status: 'sent',
        recipients: 'customer-service@example.com'
      }
    ]
  },
  {
    id: '6',
    createTime: '2023-08-20T08:10:00',
    issueType: 'inventory',
    description: '库存数量不足，无法满足订单',
    channel: 'Shopify',
    channelOrderId: 'SPF-23456789',
    systemOrderId: 'SYS-2023082006',
    status: 'solved',
    emailSent: 'sent',
    recipients: 'warehouse@example.com, purchasing@example.com',
    emailContent: '库存不足提醒：系统检测到订单SPF-23456789中的商品库存不足，请及时补货。',
    resolveTime: '2023-08-21T10:15:00',
    resolveNote: '已紧急补货并通知客户可能延迟发货',
    lastSendTime: '2023-08-20T15:45:00',
    emailHistory: [
      {
        sendTime: '2023-08-20T08:10:00',
        status: 'sent',
        recipients: 'warehouse@example.com'
      },
      {
        sendTime: '2023-08-20T15:45:00',
        status: 'sent',
        recipients: 'warehouse@example.com, purchasing@example.com'
      }
    ]
  },
  {
    id: '7',
    createTime: '2023-08-21T13:40:00',
    issueType: 'order',
    description: '订单支付异常，显示已支付但未收到款项',
    channel: 'eBay',
    channelOrderId: 'EB-56789123',
    systemOrderId: 'SYS-2023082107',
    status: 'unsolved',
    emailSent: 'sent',
    recipients: 'finance@example.com',
    emailContent: '支付异常提醒：订单EB-56789123显示已支付但系统未收到款项，请核对支付系统。',
    lastSendTime: '2023-08-21T13:40:00',
    emailHistory: [
      {
        sendTime: '2023-08-21T13:40:00',
        status: 'sent',
        recipients: 'finance@example.com'
      }
    ]
  },
  {
    id: '8',
    createTime: '2023-08-22T09:25:00',
    issueType: 'system',
    description: '数据库连接失败，导致订单处理暂停',
    channel: 'All',
    channelOrderId: 'N/A',
    systemOrderId: 'N/A',
    status: 'solved',
    emailSent: 'sent',
    recipients: 'it-support@example.com, admin@example.com',
    emailContent: '系统错误提醒：检测到数据库连接失败，所有订单处理已暂停，请立即检查。',
    resolveTime: '2023-08-22T11:30:00',
    resolveNote: '已重启数据库服务并恢复连接，所有订单处理已恢复正常',
    lastSendTime: '2023-08-22T09:25:00',
    emailHistory: [
      {
        sendTime: '2023-08-22T09:25:00',
        status: 'sent',
        recipients: 'it-support@example.com, admin@example.com'
      }
    ]
  }
]

/**
 * 模拟获取邮件日志列表
 */
export const getMockEmailLogs = (params: any) => {
  const { page = 1, limit = 20, startTime, endTime, issueType, status, emailSent, channel, keyword } = params
  
  // 过滤数据
  let filteredData = [...mockEmailLogs]
  
  // 按时间范围筛选
  if (startTime && endTime) {
    filteredData = filteredData.filter(item => {
      const itemTime = new Date(item.createTime).getTime()
      const start = new Date(startTime).getTime()
      const end = new Date(endTime).getTime() + 86400000 // 加一天的毫秒数，使结束日期包含当天
      return itemTime >= start && itemTime <= end
    })
  }
  
  // 按问题类型筛选
  if (issueType) {
    filteredData = filteredData.filter(item => item.issueType === issueType)
  }
  
  // 按状态筛选
  if (status) {
    filteredData = filteredData.filter(item => item.status === status)
  }
  
  // 按邮件发送状态筛选
  if (emailSent) {
    filteredData = filteredData.filter(item => item.emailSent === emailSent)
  }
  
  // 按渠道筛选
  if (channel) {
    filteredData = filteredData.filter(item => item.channel.toLowerCase() === channel.toLowerCase())
  }
  
  // 按关键词搜索
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    filteredData = filteredData.filter(item => 
      item.description.toLowerCase().includes(lowerKeyword) ||
      item.channelOrderId.toLowerCase().includes(lowerKeyword) ||
      item.systemOrderId.toLowerCase().includes(lowerKeyword)
    )
  }
  
  // 计算总数
  const total = filteredData.length
  
  // 分页
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const data = filteredData.slice(startIndex, endIndex)
  
  return {
    data,
    total,
    page: Number(page),
    limit: Number(limit)
  }
}

/**
 * 模拟获取邮件日志详情
 */
export const getMockEmailLogDetail = (id: string) => {
  return mockEmailLogs.find(item => item.id === id)
}

/**
 * 模拟标记日志为已解决
 */
export const mockMarkLogAsSolved = (id: string, data: any) => {
  const index = mockEmailLogs.findIndex(item => item.id === id)
  if (index !== -1) {
    mockEmailLogs[index].status = 'solved'
    mockEmailLogs[index].resolveTime = new Date().toISOString()
    mockEmailLogs[index].resolveNote = data.resolveNote
    return true
  }
  return false
}

/**
 * 模拟发送邮件
 */
export const mockSendEmailNotification = (id: string, data: any) => {
  const index = mockEmailLogs.findIndex(item => item.id === id)
  if (index !== -1) {
    const now = new Date().toISOString();
    
    // 更新邮件状态
    mockEmailLogs[index].emailSent = 'sent';
    mockEmailLogs[index].recipients = data.recipients;
    mockEmailLogs[index].emailContent = data.content;
    mockEmailLogs[index].lastSendTime = now;
    
    // 添加到历史记录
    if (!mockEmailLogs[index].emailHistory) {
      mockEmailLogs[index].emailHistory = [];
    }
    
    mockEmailLogs[index].emailHistory.push({
      sendTime: now,
      status: 'sent',
      recipients: data.recipients
    });
    
    return true;
  }
  return false;
} 