import axios from 'axios'
import { EmailConfig } from '@/types/notification'

// API URL
const API_URL = '/api/settings/email-config'

/**
 * 获取邮箱配置列表
 */
export const getEmailConfigs = async (): Promise<EmailConfig[]> => {
  try {
    // 注意：由于当前是模拟实现，这里直接返回本地数据
    // 实际项目中应该调用API获取数据
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 返回模拟数据
    return [
      {
        id: 'email-001',
        contacts: [
          { email: 'admin@example.com', name: '系统管理员' },
          { email: 'backup@example.com', name: '备用管理员' }
        ],
        status: true,
        notificationTypes: [
          { code: 'insufficient_inventory', name: '库存不足', category: '库存异常' },
          { code: 'product_not_exist', name: '商品不存在', category: '库存异常' },
          { code: 'warehouse_error', name: '仓库信息错误', category: '库存异常' }
        ],
        notificationSetting: {
          mode: 'scheduled',
          scheduledTimes: ['10:00', '15:00', '20:00']
        },
        resendConfig: {
          enabled: true,
          mode: 'interval',
          intervalHours: 4,
          maxResendTimes: 3,
          onlyForUnresolved: true
        },
        notificationTime: {
          enabled: true,
          timeRange: {
            start: '09:00',
            end: '18:00'
          },
          workdaysOnly: true
        },
        notificationFrequency: {
          mode: 'digest',
          digest: {
            interval: 'daily',
            time: '12:00',
            weekDay: 1
          },
          maxPerDay: 0
        },
        createdTime: '2023-06-15T08:30:00.000Z'
      },
      {
        id: 'email-002',
        contacts: [
          { email: 'inventory@example.com', name: '库存管理员' }
        ],
        status: true,
        notificationTypes: [
          { code: 'insufficient_inventory', name: '库存不足', category: '库存异常' }
        ],
        notificationSetting: {
          mode: 'realtime'
        },
        resendConfig: {
          enabled: true,
          mode: 'nextday',
          specifiedTime: '09:00',
          maxResendTimes: 1,
          onlyForUnresolved: false
        },
        notificationTime: {
          enabled: false,
          timeRange: {
            start: '00:00',
            end: '23:59'
          },
          workdaysOnly: false
        },
        notificationFrequency: {
          mode: 'immediate',
          maxPerDay: 10
        },
        createdTime: '2023-07-20T10:15:00.000Z'
      },
      {
        id: 'email-003',
        contacts: [
          { email: 'logistics@example.com', name: '物流主管' },
          { email: 'logistics2@example.com', name: '物流助理' },
          { email: 'warehouse@example.com', name: '仓库管理员' }
        ],
        status: false,
        notificationTypes: [
          { code: 'address_invalid', name: '收货地址不正确', category: '物流异常' },
          { code: 'warehouse_error', name: '仓库信息错误', category: '库存异常' },
          { code: 'logistics_exception', name: '物流异常', category: '物流异常' }
        ],
        notificationSetting: {
          mode: 'scheduled',
          scheduledTimes: ['09:00', '15:00', '19:00']
        },
        resendConfig: {
          enabled: true,
          mode: 'endday',
          maxResendTimes: 0,
          onlyForUnresolved: true
        },
        notificationTime: {
          enabled: true,
          timeRange: {
            start: '08:30',
            end: '20:30'
          },
          workdaysOnly: false
        },
        notificationFrequency: {
          mode: 'scheduled',
          scheduled: {
            times: ['09:00', '15:00', '19:00']
          },
          maxPerDay: 0
        },
        createdTime: '2023-08-05T14:45:00.000Z'
      }
    ]
    
    /* 实际实现应该是:
    const response = await axios.get(API_URL)
    return response.data
    */
  } catch (error) {
    console.error('获取邮箱配置列表失败:', error)
    throw error
  }
}

/**
 * 添加新的邮箱配置
 */
export const addEmailConfig = async (config: Omit<EmailConfig, 'id' | 'createdTime' | 'updatedTime'>): Promise<EmailConfig> => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 创建新配置（添加id和时间戳）
    const newConfig: EmailConfig = {
      ...config,
      id: `email-${Date.now()}`,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString()
    }
    
    return newConfig
    
    /* 实际实现应该是:
    const response = await axios.post(API_URL, config)
    return response.data
    */
  } catch (error) {
    console.error('添加邮箱配置失败:', error)
    throw error
  }
}

/**
 * 更新邮箱配置
 */
export const updateEmailConfig = async (config: EmailConfig): Promise<EmailConfig> => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 更新时间戳
    const updatedConfig: EmailConfig = {
      ...config,
      updatedTime: new Date().toISOString()
    }
    
    return updatedConfig
    
    /* 实际实现应该是:
    const response = await axios.put(`${API_URL}/${config.id}`, config)
    return response.data
    */
  } catch (error) {
    console.error('更新邮箱配置失败:', error)
    throw error
  }
}

/**
 * 删除邮箱配置
 */
export const deleteEmailConfig = async (id: string): Promise<boolean> => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return true
    
    /* 实际实现应该是:
    await axios.delete(`${API_URL}/${id}`)
    return true
    */
  } catch (error) {
    console.error('删除邮箱配置失败:', error)
    throw error
  }
}

/**
 * 更新邮箱状态
 */
export const updateEmailStatus = async (id: string, status: boolean): Promise<boolean> => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return true
    
    /* 实际实现应该是:
    await axios.patch(`${API_URL}/${id}/status`, { status })
    return true
    */
  } catch (error) {
    console.error('更新邮箱状态失败:', error)
    throw error
  }
}

/**
 * 更新邮箱通知类型设置
 */
export const updateNotificationTypes = async (id: string, types: { code: string, name: string }[]): Promise<boolean> => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return true
    
    /* 实际实现应该是:
    await axios.patch(`${API_URL}/${id}/notification-types`, { types })
    return true
    */
  } catch (error) {
    console.error('更新通知类型失败:', error)
    throw error
  }
}

/**
 * 测试邮箱配置
 */
export const testEmailConfig = async (config: { email: string, name: string } | { emails: string[], names: string[] }): Promise<boolean> => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return true
    
    /* 实际实现应该是:
    await axios.post(`${API_URL}/test`, config)
    return true
    */
  } catch (error) {
    console.error('测试邮箱失败:', error)
    throw error
  }
}

/**
 * 获取联系人列表
 */
export const getEmailContacts = async () => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 返回模拟数据
    return [
      {
        id: 'contact-001',
        email: 'admin@example.com',
        name: '系统管理员',
        status: true
      },
      {
        id: 'contact-002',
        email: 'inventory@example.com',
        name: '库存管理员',
        status: true
      },
      {
        id: 'contact-003',
        email: 'logistics@example.com',
        name: '物流主管',
        status: true
      },
      {
        id: 'contact-004',
        email: 'warehouse@example.com',
        name: '仓库管理员',
        status: false
      }
    ]
    
    /* 实际实现应该是:
    const response = await axios.get('/api/settings/email-contacts')
    return response.data
    */
  } catch (error) {
    console.error('获取联系人列表失败:', error)
    throw error
  }
}

/**
 * 添加邮件联系人
 */
export const addEmailContact = async (contact: { email: string, name: string, status: boolean }) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 创建新联系人（添加id）
    const newContact = {
      ...contact,
      id: `contact-${Date.now()}`
    }
    
    return newContact
    
    /* 实际实现应该是:
    const response = await axios.post('/api/settings/email-contacts', contact)
    return response.data
    */
  } catch (error) {
    console.error('添加联系人失败:', error)
    throw error
  }
}

/**
 * 更新邮件联系人
 */
export const updateEmailContact = async (contact: { id: string, email: string, name: string, status: boolean }) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return contact
    
    /* 实际实现应该是:
    const response = await axios.put(`/api/settings/email-contacts/${contact.id}`, contact)
    return response.data
    */
  } catch (error) {
    console.error('更新联系人失败:', error)
    throw error
  }
}

/**
 * 删除邮件联系人
 */
export const deleteEmailContact = async (id: string) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return true
    
    /* 实际实现应该是:
    await axios.delete(`/api/settings/email-contacts/${id}`)
    return true
    */
  } catch (error) {
    console.error('删除联系人失败:', error)
    throw error
  }
}

/**
 * 更新联系人状态
 */
export const updateContactStatus = async (id: string, status: boolean) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return { id, status }
    
    /* 实际实现应该是:
    await axios.patch(`/api/settings/email-contacts/${id}/status`, { status })
    return { id, status }
    */
  } catch (error) {
    console.error('更新联系人状态失败:', error)
    throw error
  }
}

/**
 * 测试联系人邮箱
 */
export const testContact = async (data: { email: string, name: string }) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟测试成功
    return true
    
    /* 实际实现应该是:
    await axios.post('/api/settings/email-contacts/test', data)
    return true
    */
  } catch (error) {
    console.error('测试联系人邮箱失败:', error)
    throw error
  }
} 