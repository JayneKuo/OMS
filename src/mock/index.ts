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
  private regexHandlers: Array<{method: string, regex: RegExp, handler: (config: MockConfig) => [number, any]}> = [];
  private delay: number;

  constructor(private axiosInstance: any, options?: {delayResponse?: number}) {
    this.delay = options?.delayResponse || 0;
    
    // 拦截GET请求
    axiosInstance.interceptors.request.use((config: any) => {
      if (config.method === 'get') {
        const handler = this.getHandlers[config.url];
        if (handler) {
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
        
        // 检查正则表达式处理器
        for (const {method, regex, handler} of this.regexHandlers) {
          if (method === 'get' && regex.test(config.url)) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                const [status, response] = handler({...config});
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
        }
      }
      return config;
    }, undefined);
    
    // 拦截POST请求
    axiosInstance.interceptors.request.use((config: any) => {
      if (config.method === 'post') {
        const handler = this.postHandlers[config.url];
        if (handler) {
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
        
        // 检查正则表达式处理器
        for (const {method, regex, handler} of this.regexHandlers) {
          if (method === 'post' && regex.test(config.url)) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                const [status, response] = handler({...config});
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

export default mock; 