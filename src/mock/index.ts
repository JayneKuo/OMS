import axios from 'axios'
import { ElMessage } from 'element-plus'
import { 
  customers, 
  channelMap, 
  queryOrders, 
  queryProducts, 
  queryInventory, 
  querySystemOrders 
} from './queryToolData'
import { MockMethod } from 'vite-plugin-mock'
import { mockTrackingList, mockTrackingDetail } from './purchaseTracking'
import { getMockProducts, mockDeleteProduct } from './productData'
import {
  mockSafetyStockConfigs,
  mockFlexibleSafetyStockConfigs,
  mockStockAlerts,
  mockSafetyStockStats,
  mockChannels,
  mockStores,
  mockWarehouses,
  mockSkus,
  mockPresets
} from './safetyStockData'

// Mock适配器类型
interface MockConfig {
  url?: string;
  data?: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// 由于axios-mock-adapter可能不存在，我们创建一个简单的Mock实现
class SimpleMockAdapter {
  private handlers: Record<string, (config: MockConfig) => [number, any]> = {};
  private getHandlers: Record<string, (config: MockConfig) => [number, any]> = {};
  private postHandlers: Record<string, (config: MockConfig) => [number, any]> = {};
  private deleteHandlers: Record<string, (config: MockConfig) => [number, any]> = {};
  private regexHandlers: Array<{method: string, regex: RegExp, handler: (config: MockConfig) => [number, any]}> = [];
  private delay: number;

  private handleRequest(handler: (config: MockConfig) => [number, any], config: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const [status, response] = handler(config);
        if (status >= 200 && status < 300) {
          resolve({
            data: response,
            status,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              data: response,
              status,
              statusText: 'ERROR',
              headers: {},
              config
            }
          });
        }
      }, this.delay);
    });
  }

  constructor(axiosInstance: any, options?: {delayResponse?: number}) {
    this.delay = options?.delayResponse || 0;
    axiosInstance.interceptors.request.use((config: any) => {
      const method = config.method?.toLowerCase();
      let handler;

      // 根据请求方法获取对应的处理器
      switch (method) {
        case 'get':
          handler = this.getHandlers[config.url];
          break;
        case 'post':
          handler = this.postHandlers[config.url];
          break;
        case 'delete':
          handler = this.deleteHandlers[config.url];
          break;
      }

      // 如果找到了直接匹配的处理器
      if (handler) {
        return this.handleRequest(handler, config);
      }

      // 检查正则表达式处理器
      for (const {method: handlerMethod, regex, handler: regexHandler} of this.regexHandlers) {
        if (handlerMethod === method && regex.test(config.url)) {
          return this.handleRequest(regexHandler, config);
        }
      }

      return config;
    }, undefined);
  }
  
  onGet(urlOrRegex: string | RegExp, handler: (config: MockConfig) => [number, any]): SimpleMockAdapter {
    if (typeof urlOrRegex === 'string') {
      this.getHandlers[urlOrRegex] = handler;
    } else {
      this.regexHandlers.push({method: 'get', regex: urlOrRegex, handler});
    }
    return this;
  }
  
  onPost(urlOrRegex: string | RegExp, handler: (config: MockConfig) => [number, any]): SimpleMockAdapter {
    if (typeof urlOrRegex === 'string') {
      this.postHandlers[urlOrRegex] = handler;
    } else {
      this.regexHandlers.push({method: 'post', regex: urlOrRegex, handler});
    }
    return this;
  }

  onDelete(urlOrRegex: string | RegExp, handler: (config: MockConfig) => [number, any]): SimpleMockAdapter {
    if (typeof urlOrRegex === 'string') {
      this.deleteHandlers[urlOrRegex] = handler;
    } else {
      this.regexHandlers.push({method: 'delete', regex: urlOrRegex, handler});
    }
    return this;
  }
}

// 创建一个MockAdapter实例
const mock = new SimpleMockAdapter(axios, { delayResponse: 500 }) // 模拟网络延迟

// 模拟获取客户列表
mock.onGet('/api/customers', () => [200, {
  code: 0,
  data: customers,
  message: 'success'
}]);

// 模拟获取渠道列表
mock.onGet('/api/channels', (config: MockConfig) => {
  const customerId = config.params?.customerId as string;
  if (!customerId || !channelMap[customerId as keyof typeof channelMap]) {
    return [400, { code: 1, message: '客户ID无效或不存在', data: null }];
  }
  
  return [200, {
    code: 0,
    data: channelMap[customerId as keyof typeof channelMap],
    message: 'success'
  }];
});

// 模拟查询接口
mock.onPost('/api/query', (config: MockConfig) => {
  try {
    const params = JSON.parse(config.data || '{}');
    if (!params.customer || !params.channel || !params.type || !params.page || !params.pageSize) {
      return [400, { code: 1, message: '参数不完整', data: null }];
    }
    
    let result;
    
    switch(params.type) {
      case 'order':
        result = queryOrders(params);
        break;
        
      case 'product':
        result = queryProducts(params);
        break;
        
      case 'inventory':
        result = queryInventory(params);
        break;
        
      default:
        return [400, { code: 1, message: '查询类型无效', data: null }];
    }
    
    return [200, {
      code: 0,
      data: result,
      message: 'success'
    }];
  } catch (error) {
    console.error('Mock API Error:', error);
    return [500, { code: 1, message: '服务器内部错误', data: null }];
  }
});

// 模拟获取系统订单信息
mock.onGet(/\/api\/orders\/\w+/, (config: MockConfig) => {
  try {
    const url = config.url || '';
    const channelOrderId = url.split('/').pop() || '';
    if (!channelOrderId) {
      return [400, { code: 1, message: '订单ID不能为空', data: null }];
    }
    
    const result = querySystemOrders(channelOrderId);
    
    return [200, {
      code: 0,
      data: result,
      message: 'success'
    }];
  } catch (error) {
    console.error('Mock API Error:', error);
    return [500, { code: 1, message: '服务器内部错误', data: null }];
  }
});

// 模拟重试处理订单
mock.onPost(/\/api\/orders\/\w+\/retry/, (config: MockConfig) => {
  const url = config.url || '';
  const urlParts = url.split('/');
  const orderId = urlParts.length >= 2 ? urlParts[urlParts.length - 2] : '';
  
  return [200, {
    code: 0,
    data: { success: true, orderId },
    message: 'success'
  }];
});

// 模拟导出功能
mock.onPost('/api/export', (_config: MockConfig) => {
  return [200, new Blob(['模拟导出数据'], { type: 'application/vnd.ms-excel' })];
});

// 添加查询工具相关的API
mock.onGet(/\/api\/queryTool\/customers/, (config: MockConfig) => {
  console.log('Mock API: 获取客户列表被调用');
  // 简单返回客户数据，不做额外包装
  return [200, customers];
});

mock.onGet(/\/api\/queryTool\/channels\/(.+)/, (config: MockConfig) => {
  const urlParts = config.url?.split('/');
  const customerId = urlParts?.[urlParts.length - 1];
  
  console.log(`Mock API: 获取渠道列表被调用, 客户ID: ${customerId}`);
  
  if (customerId && channelMap[customerId]) {
    return [200, channelMap[customerId]];
  }
  
  console.log('未找到对应客户的渠道数据');
  return [200, []];
});

mock.onPost(/\/api\/queryTool\/query/, (config: MockConfig) => {
  try {
    const params = JSON.parse(config.data || '{}');
    console.log(`Mock API: 查询数据被调用, 类型: ${params.type}`, params);
    
    let response;
    
    switch (params.type) {
      case 'order':
        response = queryOrders(params);
        console.log(`查询到 ${response.data.length}/${response.total} 条订单数据`);
        break;
      case 'product':
        response = queryProducts(params);
        console.log(`查询到 ${response.data.length}/${response.total} 条商品数据`);
        break;
      case 'inventory':
        response = queryInventory(params);
        console.log(`查询到 ${response.data.length}/${response.total} 条库存数据`);
        break;
      default:
        console.log('未知的查询类型');
        response = { data: [], total: 0 };
    }
    
    return [200, response];
  } catch (error) {
    console.error('Mock API 错误:', error);
    return [500, { message: '服务器内部错误' }];
  }
});

mock.onPost(/\/api\/queryTool\/retry/, (config: MockConfig) => {
  try {
    const { orderId } = JSON.parse(config.data || '{}');
    console.log(`Mock API: 重试处理订单, 订单ID: ${orderId}`);
    
    // 模拟重试处理
    return [200, { success: true, message: `订单 ${orderId} 已重新提交处理` }];
  } catch (error) {
    console.error('Mock API Error:', error);
    return [500, { message: '服务器内部错误' }];
  }
});

mock.onPost(/\/api\/queryTool\/export/, (config: MockConfig) => {
  console.log('Mock API: 导出数据');
  // 模拟导出
  return [200, { success: true, message: '导出成功' }];
});

// 全局处理请求和响应
axios.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等统一处理
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // 处理成功的响应
    const res = response.data;
    if (res && (res.code === undefined || res.code === 0)) {
      return res.data || res;
    }
    
    ElMessage.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    // 处理错误响应
    const message = error.response?.data?.message || error.message || '请求失败';
    ElMessage.error(message);
    return Promise.reject(error);
  }
);

// 添加产品相关的mock接口
mock.onGet('/api/products', (config: MockConfig) => {
  try {
    const params = config.params || {};
    const response = getMockProducts({
      page: Number(params.page) || 1,
      pageSize: Number(params.pageSize) || 20,
      search: params.search,
      type: params.type,
      integration: params.integration,
    });
    return [200, {
      code: 0,
      data: response.data,
      total: response.total,
      message: 'success'
    }];
  } catch (error) {
    console.error('Mock API Error:', error);
    return [500, { code: 1, message: '服务器内部错误', data: null }];
  }
});

mock.onDelete(/\/api\/products\/\w+/, (config: MockConfig) => {
  try {
    const url = config.url || '';
    const productId = url.split('/').pop() || '';
    if (!productId) {
      return [400, { code: 1, message: '产品ID不能为空', data: null }];
    }
    
    mockDeleteProduct(productId);
    return [200, {
      code: 0,
      data: null,
      message: 'success'
    }];
  } catch (error) {
    console.error('Mock API Error:', error);
    return [500, { code: 1, message: '服务器内部错误', data: null }];
  }
});

const mockHandlers = [
  // Purchase Order Tracking
  {
    url: '/api/purchase/tracking',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10 } = query
      const start = (page - 1) * pageSize
      const end = start + pageSize
      
      return {
        code: 200,
        data: {
          total: mockTrackingList.length,
          items: mockTrackingList.slice(start, end)
        }
      }
    }
  },
  {
    url: '/api/purchase/tracking/:id',
    method: 'get',
    response: ({ params }) => {
      try {
        const data = mockTrackingDetail(params.id)
        return {
          code: 200,
          data
        }
      } catch (error) {
        return {
          code: 404,
          message: 'Not found'
        }
      }
    }
  },
  {
    url: '/api/purchase/tracking/:id/status',
    method: 'post',
    response: ({ params }) => {
      return {
        code: 200,
        data: mockTrackingDetail(params.id)
      }
    }
  },
  
  // ========================
  // 安全库存设置相关Mock API
  // ========================
  
  // 获取安全库存配置列表
  {
    url: '/api/safety-stock/configs',
    method: 'get',
    response: (req: any) => {
      const { level, status, channelId, storeId, sku, keyword, page = 1, pageSize = 20 } = req.query || {}
      
      let filteredConfigs = [...mockSafetyStockConfigs]
      
      // 过滤逻辑
      if (level) {
        filteredConfigs = filteredConfigs.filter(c => c.level === level)
      }
      if (status) {
        filteredConfigs = filteredConfigs.filter(c => c.status === status)
      }
      if (channelId) {
        filteredConfigs = filteredConfigs.filter(c => 
          ('channelId' in c && c.channelId === channelId)
        )
      }
      if (storeId) {
        filteredConfigs = filteredConfigs.filter(c => 
          ('storeId' in c && c.storeId === storeId)
        )
      }
      if (sku) {
        filteredConfigs = filteredConfigs.filter(c => 
          ('sku' in c && c.sku === sku)
        )
      }
      if (keyword) {
        filteredConfigs = filteredConfigs.filter(c => 
          c.description?.includes(keyword) ||
          ('productName' in c && c.productName?.includes(keyword))
        )
      }
      
      // 分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedData = filteredConfigs.slice(start, end)
      
      return {
        code: 0,
        message: 'success',
        data: {
          data: paginatedData,
          total: filteredConfigs.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      }
    }
  },
  
  // 获取安全库存配置详情
  {
    url: '/api/safety-stock/configs/:id',
    method: 'get',
    response: (req: any) => {
      const { id } = req.params
      const configItem = mockSafetyStockConfigs.find(c => c.id === id)
      
      if (configItem) {
        return { code: 0, message: 'success', data: configItem }
      } else {
        return { code: 404, message: 'Config not found' }
      }
    }
  },
  
  // 创建安全库存配置
  {
    url: '/api/safety-stock/configs',
    method: 'post',
    response: (req: any) => {
      const requestData = req.body
      const newConfigs = requestData.configs.map((configData: any) => ({
        id: `SSC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...configData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current_user',
        updatedBy: 'current_user'
      }))
      
      mockSafetyStockConfigs.push(...newConfigs)
      return { code: 0, message: 'success', data: newConfigs }
    }
  },
  
  // 获取库存预警列表
  {
    url: '/api/safety-stock/alerts',
    method: 'get',
    response: (req: any) => {
      const { page = 1, pageSize = 20, level, alertType, status, storeId, channelId, sku } = req.query || {}
      
      let filteredAlerts = [...mockStockAlerts]
      
      if (level) filteredAlerts = filteredAlerts.filter(a => a.level === level)
      if (alertType) filteredAlerts = filteredAlerts.filter(a => a.alertType === alertType)
      if (status) filteredAlerts = filteredAlerts.filter(a => a.status === status)
      if (storeId) filteredAlerts = filteredAlerts.filter(a => a.storeId === storeId)
      if (channelId) filteredAlerts = filteredAlerts.filter(a => a.channelId === channelId)
      if (sku) filteredAlerts = filteredAlerts.filter(a => a.sku === sku)
      
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedData = filteredAlerts.slice(start, end)
      
      return {
        code: 0,
        message: 'success',
        data: {
          data: paginatedData,
          total: filteredAlerts.length
        }
      }
    }
  },
  
  // 获取统计数据
  {
    url: '/api/safety-stock/stats',
    method: 'get',
    response: () => {
      return { code: 0, message: 'success', data: mockSafetyStockStats }
    }
  },
  
  // 获取渠道列表
  {
    url: '/api/safety-stock/channels',
    method: 'get',
    response: () => {
      return { code: 0, message: 'success', data: mockChannels }
    }
  },
  
  // 获取店铺列表
  {
    url: '/api/safety-stock/stores',
    method: 'get',
    response: (req: any) => {
      const { channelId } = req.query || {}
      
      let filteredStores = [...mockStores]
      if (channelId) {
        filteredStores = filteredStores.filter(s => s.channelId === channelId)
      }
      
      return { code: 0, message: 'success', data: filteredStores }
    }
  },
  
  // 获取仓库列表
  {
    url: '/api/safety-stock/warehouses',
    method: 'get',
    response: () => {
      return { code: 0, message: 'success', data: mockWarehouses }
    }
  },
  
  // 搜索SKU
  {
    url: '/api/safety-stock/skus/search',
    method: 'get',
    response: (req: any) => {
      const { keyword, storeId, channelId, page = 1, pageSize = 20 } = req.query || {}
      
      let filteredSkus = [...mockSkus]
      
      if (keyword) {
        filteredSkus = filteredSkus.filter(s => 
          s.sku.toLowerCase().includes(keyword.toLowerCase()) ||
          s.productName.toLowerCase().includes(keyword.toLowerCase())
        )
      }
      
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedData = filteredSkus.slice(start, end)
      
      return {
        code: 0,
        message: 'success',
        data: {
          data: paginatedData,
          total: filteredSkus.length
        }
      }
    }
  },
  
  // 获取SKU信息
  {
    url: '/api/safety-stock/skus/:sku',
    method: 'get',
    response: (req: any) => {
      const { sku } = req.params
      const skuInfo = mockSkus.find(s => s.sku === sku)
      
      if (skuInfo) {
        return { code: 0, message: 'success', data: skuInfo }
      } else {
        return { code: 404, message: 'SKU not found' }
      }
    }
  },
  
  // 获取预设配置列表
  {
    url: '/api/safety-stock/presets',
    method: 'get',
    response: () => {
      return { code: 0, message: 'success', data: mockPresets }
    }
  }
] as MockMethod[]

export default mockHandlers 