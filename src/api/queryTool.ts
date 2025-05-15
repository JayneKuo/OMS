import axios from 'axios'
import { ElMessage } from 'element-plus'
import { QueryParams, PaginatedResponse, OrderData, ProductData, InventoryData, Customer, Channel } from '@/types/queryToolTypes'

// API基础地址
const API_BASE_URL = '/api'

// 查询三方平台数据
export async function queryPlatformData(params: QueryParams): Promise<PaginatedResponse<OrderData | ProductData | InventoryData>> {
  console.log('调用 queryPlatformData API, 参数:', params)
  try {
    const response = await axios.post('/api/queryTool/query', params)
    console.log('queryPlatformData 响应:', response.data)
    
    // 根据查询类型返回特定的响应类型
    if (params.type === 'order') {
      return response.data as PaginatedResponse<OrderData>
    } else if (params.type === 'product') {
      return response.data as PaginatedResponse<ProductData>
    } else {
      return response.data as PaginatedResponse<InventoryData>
    }
  } catch (error) {
    console.error('查询数据失败:', error)
    ElMessage.error('查询数据失败，请检查网络连接或联系管理员')
    throw error
  }
}

// 获取客户列表
export async function getCustomers(): Promise<Customer[]> {
  console.log('调用 getCustomers API')
  try {
    const response = await axios.get('/api/queryTool/customers')
    console.log('getCustomers 响应:', response.data)
    return response.data
  } catch (error) {
    console.error('获取客户列表失败:', error)
    ElMessage.error('获取客户列表失败')
    return []
  }
}

// 获取渠道列表
export async function getChannels(customerId: string): Promise<Channel[]> {
  console.log(`调用 getChannels API, 客户ID: ${customerId}`)
  try {
    const response = await axios.get(`/api/queryTool/channels/${customerId}`)
    console.log('getChannels 响应:', response.data)
    return response.data
  } catch (error) {
    console.error('获取渠道列表失败:', error)
    ElMessage.error('获取渠道列表失败')
    return []
  }
}

// 重试处理订单
export async function retryProcessOrder(orderId: string): Promise<void> {
  await axios.post('/api/queryTool/retry', { orderId })
}

// 导出查询结果
export async function exportQueryResults(params: QueryParams): Promise<void> {
  await axios.post('/api/queryTool/export', params)
} 