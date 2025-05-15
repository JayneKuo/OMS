import request from '@/utils/request'
import {
  mockEmailLogs,
  getMockEmailLogs,
  getMockEmailLogDetail,
  mockMarkLogAsSolved,
  mockSendEmailNotification
} from '@/mock/emailLogs'

// 定义返回数据类型
export interface LogItem {
  id: string
  createTime: string
  issueType: string
  description: string
  channel: string
  channelOrderId: string
  systemOrderId: string
  status: string
  emailSent: string
  recipients?: string
  emailContent?: string
  resolveTime?: string
  resolveNote?: string
  lastSendTime?: string
  emailHistory?: EmailHistoryItem[]
}

export interface EmailHistoryItem {
  sendTime: string
  status: string
  recipients?: string
}

export interface LogsResponse {
  data: LogItem[]
  total: number
  page: number
  limit: number
}

// 是否使用模拟数据
const useMock = true

// 获取邮件发送日志列表
export function getEmailLogsList(params: any): Promise<LogsResponse> {
  if (useMock) {
    // 使用模拟数据
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getMockEmailLogs(params))
      }, 300)
    })
  }
  
  return request({
    url: '/api/email-logs',
    method: 'get',
    params
  })
}

// 获取邮件发送日志详情
export function getEmailLogDetail(id: string): Promise<LogItem> {
  if (useMock) {
    // 使用模拟数据
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const detail = getMockEmailLogDetail(id)
        if (detail) {
          resolve(detail)
        } else {
          reject(new Error('日志不存在'))
        }
      }, 300)
    })
  }
  
  return request({
    url: `/api/email-logs/${id}`,
    method: 'get'
  })
}

// 标记日志为已解决
export function markLogAsSolved(id: string, data: any): Promise<any> {
  if (useMock) {
    // 使用模拟数据
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = mockMarkLogAsSolved(id, data)
        if (result) {
          resolve({ success: true })
        } else {
          reject(new Error('操作失败'))
        }
      }, 300)
    })
  }
  
  return request({
    url: `/api/email-logs/${id}/resolve`,
    method: 'post',
    data
  })
}

// 发送邮件
export function sendEmailNotification(id: string, data: any): Promise<any> {
  if (useMock) {
    // 使用模拟数据
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = mockSendEmailNotification(id, data)
        if (result) {
          resolve({ success: true })
        } else {
          reject(new Error('发送失败'))
        }
      }, 500)
    })
  }
  
  return request({
    url: `/api/email-logs/${id}/send-email`,
    method: 'post',
    data
  })
}

// 批量操作邮件日志
export function batchOperateEmailLogs(data: any): Promise<any> {
  if (useMock) {
    // 使用模拟数据
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }
  
  return request({
    url: '/api/email-logs/batch',
    method: 'post',
    data
  })
} 