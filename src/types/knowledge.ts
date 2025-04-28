/**
 * 知识项目接口
 */
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceType: 'file' | 'web' | 'api' | 'manual';
  format: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  creator: string;
  status: 'processing' | 'processed' | 'failed' | 'pending';
  quality: number;
  size: number;
}

/**
 * 知识搜索参数接口
 */
export interface SearchParams {
  query: string;
  tags?: string[];
  source?: string;
  dateRange?: [Date, Date] | null;
  page: number;
  pageSize: number;
}

/**
 * 搜索结果接口
 */
export interface SearchResult {
  items: KnowledgeItem[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 问答消息接口
 */
export interface QAMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: string;
  isLiked?: boolean;
  relatedKnowledge?: KnowledgeItem[];
  isAIReply?: boolean;
}

/**
 * 标签统计接口
 */
export interface TagStats {
  name: string;
  count: number;
}

/**
 * 知识来源统计接口
 */
export interface SourceStats {
  name: string;
  count: number;
}

/**
 * 用户知识统计接口
 */
export interface UserKnowledgeStats {
  totalViewed: number;
  totalFavorites: number;
  recentlyViewed: KnowledgeItem[];
  favorites: KnowledgeItem[];
}

// 知识分片类型
export interface KnowledgeChunk {
  id: string;
  knowledgeId: string;
  content: string;
  index: number;
  vector?: number[]; // 向量表示
  keywords: string[];
}

// 知识图谱类型
export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'entity' | 'concept' | 'document';
  properties?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

// 知识应用类型
export interface KnowledgeAssistant {
  id: string;
  name: string;
  description: string;
  knowledgeScope: string[]; // 知识范围，知识ID列表
  icon: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  isPublic: boolean;
  config: {
    style: string;
    welcomeMessage: string;
    capabilities: string[];
  };
  usageCount: number;
}

// 知识卡片类型
export interface KnowledgeCard {
  id: string;
  name: string;
  description: string;
  knowledgeIds: string[];
  triggerConditions: {
    keywords: string[];
    contexts: string[];
    timePoints?: string[];
  };
  template: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  usageCount: number;
}

// API密钥类型
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  createdAt: string;
  expireTime: string;
  creator: string;
  status: 'active' | 'expired' | 'revoked';
  lastUsed?: string;
  usageCount: number;
}

// 业务集成类型
export interface BusinessIntegration {
  id: string;
  name: string;
  description: string;
  type: 'plugin' | 'workflow' | 'desktop' | 'browser' | 'message';
  target: string;
  knowledgeIds: string[];
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  creator: string;
  status: 'active' | 'inactive' | 'draft';
}

// 知识分类类型
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
} 