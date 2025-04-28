import { 
  KnowledgeItem, 
  KnowledgeAssistant, 
  KnowledgeCard, 
  ApiKey, 
  BusinessIntegration,
  KnowledgeGraphData
} from '@/types/knowledge';
import { nanoid } from 'nanoid';

// 模拟知识条目数据
export const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: 'k1',
    title: '产品开发规范V2.0',
    content: '本文档描述了公司产品开发的标准流程和规范...',
    source: '产品部/规范文档/产品开发规范V2.0.pdf',
    sourceType: 'file',
    format: 'pdf',
    tags: ['产品', '规范', '流程'],
    createdAt: '2023-10-15T08:30:00Z',
    updatedAt: '2023-10-15T08:30:00Z',
    creator: '张三',
    size: 1024 * 1024 * 2.5, // 2.5MB
    status: 'processed',
    quality: 95,
    viewCount: 120,
    isFavorite: false
  },
  {
    id: 'k2',
    title: '客户服务手册',
    content: '本手册提供了客户服务的标准话术和处理流程...',
    source: '客服部/培训资料/客户服务手册.docx',
    sourceType: 'file',
    format: 'docx',
    tags: ['客服', '培训', '话术'],
    createdAt: '2023-09-20T10:15:00Z',
    updatedAt: '2023-11-05T14:20:00Z',
    creator: '李四',
    size: 1024 * 1024 * 1.8, // 1.8MB
    status: 'processed',
    quality: 88,
    viewCount: 85,
    isFavorite: false
  },
  {
    id: 'k3',
    title: '市场分析报告2023年Q3',
    content: '本报告分析了2023年第三季度的市场趋势和竞争格局...',
    source: '市场部/分析报告/市场分析报告2023Q3.pptx',
    sourceType: 'file',
    format: 'pptx',
    tags: ['市场', '分析', '季度报告'],
    createdAt: '2023-10-05T09:45:00Z',
    updatedAt: '2023-10-05T09:45:00Z',
    creator: '王五',
    size: 1024 * 1024 * 5.2, // 5.2MB
    status: 'processed',
    quality: 92,
    viewCount: 56,
    isFavorite: false
  },
  {
    id: 'k4',
    title: '技术架构设计文档',
    content: '本文档详细描述了系统的技术架构设计和实现细节...',
    source: '技术部/设计文档/技术架构设计.md',
    sourceType: 'file',
    format: 'markdown',
    tags: ['技术', '架构', '设计'],
    createdAt: '2023-08-12T15:30:00Z',
    updatedAt: '2023-11-20T11:10:00Z',
    creator: '赵六',
    size: 1024 * 512, // 512KB
    status: 'processed',
    quality: 97,
    viewCount: 210,
    isFavorite: false
  },
  {
    id: 'k5',
    title: '行业前沿技术趋势',
    content: '本文介绍了人工智能和大数据领域的最新技术趋势...',
    source: 'https://tech-review.com/trends-2023',
    sourceType: 'web',
    format: 'html',
    tags: ['技术趋势', 'AI', '大数据'],
    createdAt: '2023-11-10T08:20:00Z',
    updatedAt: '2023-11-10T08:20:00Z',
    creator: '系统',
    status: 'processed',
    quality: 85,
    viewCount: 45,
    isFavorite: false
  },
  {
    id: 'k6',
    title: '员工入职培训指南',
    content: '本指南提供了新员工入职培训的全套流程和材料...',
    source: 'HR部门/培训资料/入职培训指南.pdf',
    sourceType: 'file',
    format: 'pdf',
    tags: ['HR', '入职', '培训'],
    createdAt: '2023-07-25T09:00:00Z',
    updatedAt: '2023-07-25T09:00:00Z',
    creator: '周七',
    size: 1024 * 1024 * 3.7, // 3.7MB
    status: 'processed',
    quality: 90,
    viewCount: 150,
    isFavorite: false
  }
];

// 模拟智能助手数据
export const mockAssistants: KnowledgeAssistant[] = [
  {
    id: 'a1',
    name: '产品顾问',
    description: '专注于解答产品相关问题，提供产品信息和使用指导',
    knowledgeScope: ['k1', 'k3'],
    icon: 'ShoppingCart',
    createdAt: '2023-10-20T10:00:00Z',
    updatedAt: '2023-11-15T14:30:00Z',
    creator: '张三',
    isPublic: true,
    config: {
      style: 'professional',
      welcomeMessage: '您好，我是产品顾问，有什么可以帮您解答的产品问题吗？',
      capabilities: ['产品咨询', '使用指导', '问题诊断']
    },
    usageCount: 278
  },
  {
    id: 'a2',
    name: '技术支持',
    description: '提供技术问题解答和故障排查指导',
    knowledgeScope: ['k4'],
    icon: 'Setting',
    createdAt: '2023-09-15T09:30:00Z',
    updatedAt: '2023-11-20T11:45:00Z',
    creator: '赵六',
    isPublic: true,
    config: {
      style: 'technical',
      welcomeMessage: '您好，我是技术支持助手，请描述您遇到的技术问题，我将协助解决。',
      capabilities: ['故障诊断', '操作指导', '技术咨询']
    },
    usageCount: 342
  },
  {
    id: 'a3',
    name: '市场分析师',
    description: '提供市场洞察和竞争分析',
    knowledgeScope: ['k3', 'k5'],
    icon: 'TrendCharts',
    createdAt: '2023-10-10T14:15:00Z',
    updatedAt: '2023-11-18T16:20:00Z',
    creator: '王五',
    isPublic: false,
    config: {
      style: 'analytical',
      welcomeMessage: '您好，我是市场分析师助手，可以为您提供市场趋势和竞争情报分析。',
      capabilities: ['市场分析', '竞争情报', '趋势预测']
    },
    usageCount: 156
  }
];

// 模拟知识卡片数据
export const mockCards: KnowledgeCard[] = [
  {
    id: 'c1',
    name: '产品功能速查',
    description: '快速展示产品功能的核心信息',
    knowledgeIds: ['k1'],
    triggerConditions: {
      keywords: ['功能', '特性', '使用方法'],
      contexts: ['产品页面', '客户咨询']
    },
    template: '<div class="card-content">{{title}}<div class="card-body">{{content}}</div></div>',
    createdAt: '2023-10-22T11:30:00Z',
    updatedAt: '2023-11-10T09:15:00Z',
    creator: '张三',
    usageCount: 120
  },
  {
    id: 'c2',
    name: '故障排查指南',
    description: '常见问题的快速排查步骤',
    knowledgeIds: ['k4'],
    triggerConditions: {
      keywords: ['故障', '问题', '不工作', '错误'],
      contexts: ['支持页面', '故障单']
    },
    template: '<div class="troubleshoot-card">{{title}}<ul>{{#steps}}<li>{{.}}</li>{{/steps}}</ul></div>',
    createdAt: '2023-09-18T14:45:00Z',
    updatedAt: '2023-11-05T10:30:00Z',
    creator: '赵六',
    usageCount: 85
  },
  {
    id: 'c3',
    name: '入职提醒',
    description: '新员工入职流程提醒',
    knowledgeIds: ['k6'],
    triggerConditions: {
      keywords: ['入职', '新员工', '培训'],
      contexts: ['HR系统', '员工入职'],
      timePoints: ['员工入职日-1', '员工入职日+1']
    },
    template: '<div class="onboarding-card">欢迎加入！<div class="steps">{{content}}</div></div>',
    createdAt: '2023-08-05T09:20:00Z',
    updatedAt: '2023-08-05T09:20:00Z',
    creator: '周七',
    usageCount: 42
  }
];

// 模拟API密钥数据
export const mockApiKeys: ApiKey[] = [
  {
    id: 'api1',
    name: '产品API集成',
    key: 'sk_' + nanoid(24),
    scopes: ['knowledge.read', 'assistant.interact'],
    createdAt: '2023-10-10T10:00:00Z',
    expireTime: '2024-10-10T10:00:00Z',
    creator: '张三',
    status: 'active',
    lastUsed: '2023-11-22T15:30:00Z',
    usageCount: 1245
  },
  {
    id: 'api2',
    name: '测试环境密钥',
    key: 'sk_' + nanoid(24),
    scopes: ['knowledge.read', 'knowledge.write', 'assistant.interact'],
    createdAt: '2023-09-15T14:30:00Z',
    expireTime: '2024-03-15T14:30:00Z',
    creator: '李四',
    status: 'active',
    lastUsed: '2023-11-21T09:45:00Z',
    usageCount: 856
  }
];

// 模拟业务集成数据
export const mockIntegrations: BusinessIntegration[] = [
  {
    id: 'i1',
    name: 'CRM知识集成',
    description: '在CRM系统中嵌入知识卡片和助手',
    type: 'plugin',
    target: 'Salesforce CRM',
    knowledgeIds: ['k1', 'k2', 'k3'],
    config: {
      endpoint: 'https://crm.example.com/api/knowledge',
      refreshInterval: 3600,
      displayOption: 'sidebar'
    },
    createdAt: '2023-10-05T11:00:00Z',
    updatedAt: '2023-11-10T15:45:00Z',
    creator: '张三',
    status: 'active'
  },
  {
    id: 'i2',
    name: '技术支持工单流程',
    description: '工单处理过程中的知识推荐',
    type: 'workflow',
    target: 'ServiceDesk',
    knowledgeIds: ['k4'],
    config: {
      triggerPoints: ['工单创建', '工单升级', '工单关闭'],
      recommendationCount: 3,
      autoReplyTemplate: '根据您的问题，以下知识可能对您有帮助：{{recommendations}}'
    },
    createdAt: '2023-09-20T09:15:00Z',
    updatedAt: '2023-11-15T10:30:00Z',
    creator: '赵六',
    status: 'active'
  },
  {
    id: 'i3',
    name: '桌面知识助手',
    description: '嵌入到员工桌面的知识查询工具',
    type: 'desktop',
    target: 'Windows Desktop',
    knowledgeIds: ['k1', 'k2', 'k4', 'k6'],
    config: {
      shortcut: 'Ctrl+K',
      startWithSystem: true,
      theme: 'light'
    },
    createdAt: '2023-11-01T13:45:00Z',
    updatedAt: '2023-11-01T13:45:00Z',
    creator: '王五',
    status: 'draft'
  }
];

// 模拟知识图谱数据
export const mockGraphData: KnowledgeGraphData = {
  nodes: [
    { id: 'n1', label: '产品开发', type: 'concept' },
    { id: 'n2', label: '客户服务', type: 'concept' },
    { id: 'n3', label: '技术架构', type: 'concept' },
    { id: 'n4', label: '市场分析', type: 'concept' },
    { id: 'n5', label: '员工培训', type: 'concept' },
    { id: 'n6', label: '产品开发规范V2.0', type: 'document', properties: { docId: 'k1' } },
    { id: 'n7', label: '客户服务手册', type: 'document', properties: { docId: 'k2' } },
    { id: 'n8', label: '技术架构设计文档', type: 'document', properties: { docId: 'k4' } },
    { id: 'n9', label: '市场分析报告2023年Q3', type: 'document', properties: { docId: 'k3' } },
    { id: 'n10', label: '员工入职培训指南', type: 'document', properties: { docId: 'k6' } },
    { id: 'n11', label: '敏捷开发', type: 'entity' },
    { id: 'n12', label: 'UX设计', type: 'entity' },
    { id: 'n13', label: '用户调研', type: 'entity' },
    { id: 'n14', label: '客户满意度', type: 'entity' },
    { id: 'n15', label: '微服务', type: 'entity' }
  ],
  edges: [
    { source: 'n1', target: 'n6', label: '包含' },
    { source: 'n2', target: 'n7', label: '包含' },
    { source: 'n3', target: 'n8', label: '包含' },
    { source: 'n4', target: 'n9', label: '包含' },
    { source: 'n5', target: 'n10', label: '包含' },
    { source: 'n6', target: 'n11', label: '涉及' },
    { source: 'n6', target: 'n12', label: '涉及' },
    { source: 'n7', target: 'n14', label: '涉及' },
    { source: 'n9', target: 'n13', label: '涉及' },
    { source: 'n8', target: 'n15', label: '涉及' },
    { source: 'n11', target: 'n12', label: '相关' },
    { source: 'n13', target: 'n14', label: '影响' },
    { source: 'n1', target: 'n4', label: '依赖' },
    { source: 'n3', target: 'n1', label: '支持' }
  ]
};

// 模拟API服务
class KnowledgeService {
  // 知识中枢相关服务
  
  // 获取知识列表
  async getKnowledgeList(params: { page: number; size: number; tags?: string[]; search?: string }) {
    const { page, size, tags, search } = params;
    
    // 模拟过滤和搜索
    let filtered = [...mockKnowledgeItems];
    
    if (tags && tags.length > 0) {
      filtered = filtered.filter(item => 
        tags.some(tag => item.tags.includes(tag))
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.content.toLowerCase().includes(searchLower)
      );
    }
    
    // 模拟分页
    const total = filtered.length;
    const start = (page - 1) * size;
    const end = Math.min(start + size, total);
    const data = filtered.slice(start, end);
    
    return {
      data,
      total,
      page,
      size
    };
  }
  
  // 获取知识详情
  async getKnowledgeDetail(id: string) {
    const item = mockKnowledgeItems.find(k => k.id === id);
    if (!item) {
      throw new Error('Knowledge item not found');
    }
    return item;
  }
  
  // 创建知识条目
  async createKnowledgeItem(item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    const newItem: KnowledgeItem = {
      ...item,
      id: 'k' + nanoid(8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'processing'
    };
    
    // 模拟异步处理
    setTimeout(() => {
      newItem.status = 'processed';
      if (typeof newItem.quality !== 'number') {
        newItem.quality = Math.floor(Math.random() * 20) + 80; // 80-100分
      }
      if (typeof newItem.viewCount !== 'number') {
        newItem.viewCount = 0;
      }
    }, 3000);
    
    // 在真实环境中，这里会将数据存储到数据库
    mockKnowledgeItems.push(newItem);
    
    return newItem;
  }
  
  // 更新知识条目
  async updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>) {
    const index = mockKnowledgeItems.findIndex(k => k.id === id);
    if (index === -1) {
      throw new Error('Knowledge item not found');
    }
    
    // 在真实环境中，这里会更新数据库
    const updatedItem = {
      ...mockKnowledgeItems[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockKnowledgeItems[index] = updatedItem;
    
    return updatedItem;
  }
  
  // 删除知识条目
  async deleteKnowledgeItem(id: string) {
    const index = mockKnowledgeItems.findIndex(k => k.id === id);
    if (index === -1) {
      throw new Error('Knowledge item not found');
    }
    
    // 在真实环境中，这里会从数据库中删除
    mockKnowledgeItems.splice(index, 1);
    
    return { success: true };
  }
  
  // 获取知识图谱数据
  async getKnowledgeGraph() {
    return mockGraphData;
  }
  
  // 知识搜索
  async searchKnowledge(query: string) {
    // 模拟搜索结果
    const searchLower = query.toLowerCase();
    const results = mockKnowledgeItems
      .filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.content.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
      .map(item => ({
        id: item.id,
        title: item.title,
        content: item.content.substring(0, 100) + '...',
        relevance: Math.random() * 0.5 + 0.5 // 模拟相关度分数 0.5-1.0
      }))
      .sort((a, b) => b.relevance - a.relevance); // 按相关度排序
      
    return results;
  }
  
  // 知识问答
  async askQuestion(question: string, context?: string[]) {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟问答结果
    return {
      answer: `关于"${question}"的回答是：这是一个模拟的回答，实际应用中将基于知识库生成准确的回答。`,
      sources: mockKnowledgeItems.slice(0, 2).map(item => ({
        id: item.id,
        title: item.title,
        relevance: Math.random() * 0.3 + 0.7 // 0.7-1.0
      }))
    };
  }
  
  // 知识应用相关服务
  
  // 获取助手列表
  async getAssistantList() {
    return mockAssistants;
  }
  
  // 获取助手详情
  async getAssistantDetail(id: string) {
    const assistant = mockAssistants.find(a => a.id === id);
    if (!assistant) {
      throw new Error('Assistant not found');
    }
    return assistant;
  }
  
  // 创建助手
  async createAssistant(assistant: Omit<KnowledgeAssistant, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) {
    const newAssistant: KnowledgeAssistant = {
      ...assistant,
      id: 'a' + nanoid(8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };
    
    // 在真实环境中，这里会存储到数据库
    mockAssistants.push(newAssistant);
    
    return newAssistant;
  }
  
  // 更新助手
  async updateAssistant(id: string, updates: Partial<KnowledgeAssistant>) {
    const index = mockAssistants.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assistant not found');
    }
    
    const updatedAssistant = {
      ...mockAssistants[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockAssistants[index] = updatedAssistant;
    
    return updatedAssistant;
  }
  
  // 删除助手
  async deleteAssistant(id: string) {
    const index = mockAssistants.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assistant not found');
    }
    
    mockAssistants.splice(index, 1);
    
    return { success: true };
  }
  
  // 与助手对话
  async chatWithAssistant(assistantId: string, message: string, chatHistory: Array<{role: 'user' | 'assistant', content: string}> = []) {
    // 查找助手
    const assistant = mockAssistants.find(a => a.id === assistantId);
    if (!assistant) {
      throw new Error('Assistant not found');
    }
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 根据助手类型模拟不同回复
    let response = '';
    if (assistant.name.includes('产品')) {
      response = `作为产品顾问，我可以告诉您这个问题的答案是：${message.length}个字符的提问通常表明用户对产品有详细的咨询需求。我们的产品能够满足多种使用场景...`;
    } else if (assistant.name.includes('技术')) {
      response = `从技术角度，我建议您考虑以下解决方案：1. 检查系统配置 2. 更新到最新版本 3. 清除缓存数据。更多技术细节可以参考我们的开发文档。`;
    } else if (assistant.name.includes('市场')) {
      response = `根据最新的市场分析，我们发现相关领域有以下趋势：需求增长率达15%，竞争对手主要集中在创新功能开发，建议我们关注用户体验提升和成本优化。`;
    } else {
      response = `感谢您的提问"${message}"。我已经查询了相关知识库，建议您可以参考以下资料获取更详细的信息...`;
    }
    
    // 更新使用次数（真实环境中会更新数据库）
    assistant.usageCount += 1;
    
    return {
      role: 'assistant' as const,
      content: response,
      sources: mockKnowledgeItems.slice(0, 2).map(item => ({
        id: item.id,
        title: item.title
      }))
    };
  }
  
  // 获取知识卡片列表
  async getCardList() {
    return mockCards;
  }
  
  // 获取API密钥列表
  async getApiKeyList() {
    return mockApiKeys;
  }
  
  // 创建API密钥
  async createApiKey(name: string, scopes: string[]) {
    const newKey: ApiKey = {
      id: 'api' + nanoid(8),
      name,
      key: 'sk_' + nanoid(24),
      scopes,
      createdAt: new Date().toISOString(),
      expireTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1年后过期
      creator: '当前用户',
      status: 'active',
      usageCount: 0
    };
    
    mockApiKeys.push(newKey);
    
    return newKey;
  }
  
  // 获取业务集成列表
  async getIntegrationList() {
    return mockIntegrations;
  }
}

export const knowledgeService = new KnowledgeService(); 