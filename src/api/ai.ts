import request from '@/utils/request'

// AI 服务配置
export interface AIConfig {
  provider: 'openai' | 'claude' | 'gemini' | 'local' | 'mock'
  apiKey?: string
  model?: string
}

// AI 文本生成请求
export interface AITextGenerateRequest {
  type: 'product-title' | 'product-description' | 'seo-keywords' | 'tags'
  context: {
    productName?: string
    category?: string
    features?: string[]
    targetAudience?: string
    language?: string
    tone?: 'professional' | 'casual' | 'enthusiastic' | 'formal'
    length?: 'short' | 'medium' | 'long'
  }
  keywords?: string[]
  count?: number
}

// AI 图片处理请求
export interface AIImageProcessRequest {
  imageUrl: string
  processType: 'remove-bg' | 'replace-bg' | 'enhance' | 'smart-crop' | 'text-to-image' | 'upscale'
  settings?: {
    backgroundColor?: string
    targetSize?: { width: number; height: number }
    quality?: number
    prompt?: string
  }
}

// AI SEO 分析请求
export interface AISEOAnalysisRequest {
  title: string
  description: string
  category: string
  targetMarket?: string
}

// AI 翻译请求
export interface AITranslateRequest {
  text: string
  sourceLang: string
  targetLang: string
  context?: 'product-title' | 'product-description' | 'general'
}

// AI 竞品分析请求
export interface AICompetitorAnalysisRequest {
  productUrl?: string
  keywords?: string[]
  category: string
  targetMarket?: string
}

/**
 * AI 文本生成
 */
export const generateText = (data: AITextGenerateRequest) => {
  return request({
    url: '/api/ai/generate-text',
    method: 'post',
    data
  })
}

/**
 * AI 图片处理
 */
export const processImage = (data: AIImageProcessRequest) => {
  return request({
    url: '/api/ai/process-image',
    method: 'post',
    data
  })
}

/**
 * AI SEO 分析与优化建议
 */
export const analyzeSEO = (data: AISEOAnalysisRequest) => {
  return request({
    url: '/api/ai/analyze-seo',
    method: 'post',
    data
  })
}

/**
 * AI 翻译
 */
export const translate = (data: AITranslateRequest) => {
  return request({
    url: '/api/ai/translate',
    method: 'post',
    data
  })
}

/**
 * AI 智能标签生成
 */
export const generateTags = (data: {
  productInfo: {
    title: string
    description: string
    category: string
    attributes?: Record<string, any>
  }
  count?: number
}) => {
  return request({
    url: '/api/ai/generate-tags',
    method: 'post',
    data
  })
}

/**
 * AI 竞品分析
 */
export const analyzeCompetitor = (data: AICompetitorAnalysisRequest) => {
  return request({
    url: '/api/ai/analyze-competitor',
    method: 'post',
    data
  })
}

/**
 * AI 价格建议
 */
export const suggestPrice = (data: {
  productInfo: {
    title: string
    category: string
    cost?: number
    features?: string[]
  }
  competitorPrices?: number[]
  targetMarket?: string
}) => {
  return request({
    url: '/api/ai/suggest-price',
    method: 'post',
    data
  })
}

/**
 * AI 图片质量检测
 */
export const detectImageQuality = (data: {
  imageUrl: string
}) => {
  return request({
    url: '/api/ai/detect-image-quality',
    method: 'post',
    data
  })
}

/**
 * Mock AI 服务 - 用于开发测试
 */
export const mockAIService = {
  /**
   * Mock 文本生成
   */
  async generateText(request: AITextGenerateRequest) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const templates = {
      'product-title': [
        `${request.context.productName || 'Premium'} - ${request.context.features?.join(' | ') || 'Quality Product'}`,
        `${request.context.targetAudience || 'Fashion'} Essential: ${request.context.productName || 'Style Collection'}`,
        `Trendy ${request.context.productName || 'Product'} for ${request.context.targetAudience || 'Everyone'}`,
        `${request.context.features?.[0] || 'High Quality'} ${request.context.productName || 'Item'} - ${request.context.category || 'Best Seller'}`,
        `Elegant ${request.context.productName || 'Design'} - ${request.context.features?.slice(0, 2).join(' & ') || 'Premium Quality'}`
      ],
      'product-description': [
        `Discover our ${request.context.productName || 'premium product'} featuring ${request.context.features?.join(', ') || 'exceptional quality'}. Perfect for ${request.context.targetAudience || 'everyone'}, this ${request.context.category || 'item'} combines style and functionality. ${request.keywords ? 'Key features: ' + request.keywords.join(', ') : ''}`,
        `Elevate your wardrobe with our ${request.context.productName || 'exclusive collection'}. Crafted with attention to detail, featuring ${request.context.features?.join(' and ') || 'premium materials'}. Ideal for ${request.context.targetAudience || 'modern lifestyles'}.`,
        `Experience the perfect blend of ${request.context.features?.[0] || 'quality'} and ${request.context.features?.[1] || 'style'} with our ${request.context.productName || 'product'}. Designed for ${request.context.targetAudience || 'discerning customers'} who appreciate ${request.keywords?.[0] || 'excellence'}.`
      ],
      'seo-keywords': [
        (request.context.productName || 'product').toLowerCase(),
        request.context.category?.toLowerCase() || 'fashion',
        ...(request.context.features?.map(f => f.toLowerCase()) || []),
        `${request.context.targetAudience?.toLowerCase() || 'trendy'} ${request.context.category?.toLowerCase() || 'style'}`,
        `best ${request.context.productName?.toLowerCase() || 'quality'}`
      ],
      'tags': [
        request.context.category?.toLowerCase() || 'fashion',
        request.context.targetAudience?.toLowerCase() || 'trendy',
        ...(request.context.features?.map(f => f.toLowerCase().replace(/\s+/g, '-')) || []),
        'new-arrival',
        'best-seller'
      ]
    }
    
    const results = templates[request.type as keyof typeof templates] || []
    return {
      success: true,
      data: results.slice(0, request.count || 5).map(content => ({ content }))
    }
  },

  /**
   * Mock SEO 分析
   */
  async analyzeSEO(data: AISEOAnalysisRequest) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const titleLength = data.title.length
    const descLength = data.description.length
    const hasKeywords = data.title.toLowerCase().includes(data.category.toLowerCase())
    
    return {
      success: true,
      data: {
        score: 75,
        suggestions: [
          titleLength > 60 ? {
            type: 'warning',
            field: 'title',
            message: 'Title is too long. Recommended: 50-60 characters',
            suggestion: 'Shorten title to improve SEO'
          } : null,
          titleLength < 30 ? {
            type: 'warning',
            field: 'title',
            message: 'Title is too short. Recommended: 50-60 characters',
            suggestion: 'Add more descriptive keywords'
          } : null,
          !hasKeywords ? {
            type: 'error',
            field: 'title',
            message: 'Title should include category keywords',
            suggestion: `Add "${data.category}" to the title`
          } : null,
          descLength < 100 ? {
            type: 'warning',
            field: 'description',
            message: 'Description is too short',
            suggestion: 'Add more details (recommended: 150-300 characters)'
          } : null,
          {
            type: 'success',
            field: 'general',
            message: 'Good use of descriptive language',
            suggestion: null
          }
        ].filter(Boolean),
        keywords: {
          recommended: [data.category, `${data.category} style`, 'fashion', 'trendy', 'quality'],
          current: data.title.split(' ').filter(w => w.length > 3)
        }
      }
    }
  },

  /**
   * Mock 翻译
   */
  async translate(data: AITranslateRequest) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 简单的模拟翻译
    const translations: Record<string, Record<string, string>> = {
      'zh-CN': {
        'Fashion': '时尚',
        'Trendy': '潮流',
        'Premium': '高级',
        'Quality': '质量',
        'Style': '风格'
      },
      'es': {
        'Fashion': 'Moda',
        'Trendy': 'De moda',
        'Premium': 'De primera calidad',
        'Quality': 'Calidad',
        'Style': 'Estilo'
      }
    }
    
    let translated = data.text
    if (translations[data.targetLang]) {
      Object.entries(translations[data.targetLang]).forEach(([en, trans]) => {
        translated = translated.replace(new RegExp(en, 'gi'), trans)
      })
    }
    
    return {
      success: true,
      data: {
        translatedText: translated,
        confidence: 0.95
      }
    }
  },

  /**
   * Mock 智能标签生成
   */
  async generateTags(productInfo: any) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const baseTags = [
      productInfo.category?.toLowerCase(),
      'new-arrival',
      'trending',
      'best-seller',
      'limited-edition'
    ]
    
    return {
      success: true,
      data: {
        tags: baseTags.filter(Boolean).slice(0, 5)
      }
    }
  },

  /**
   * Mock 竞品分析
   */
  async analyzeCompetitor(data: AICompetitorAnalysisRequest) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      success: true,
      data: {
        competitors: [
          {
            name: 'Competitor A',
            price: 29.99,
            rating: 4.5,
            features: ['High Quality', 'Fast Shipping'],
            strengths: ['Lower price', 'Good reviews'],
            weaknesses: ['Limited color options']
          },
          {
            name: 'Competitor B',
            price: 39.99,
            rating: 4.2,
            features: ['Premium Material', 'Multiple Sizes'],
            strengths: ['Premium quality', 'Wide selection'],
            weaknesses: ['Higher price', 'Slower shipping']
          }
        ],
        recommendations: {
          suggestedPrice: { min: 32.99, max: 37.99 },
          keyDifferentiators: ['Unique design', 'Better value', 'Superior quality'],
          marketingAngles: [
            'Emphasize quality-price ratio',
            'Highlight unique features',
            'Focus on customer satisfaction'
          ]
        }
      }
    }
  },

  /**
   * Mock 价格建议
   */
  async suggestPrice(data: any) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const baseCost = data.productInfo.cost || 20
    const markup = 1.8 // 80% markup
    const suggestedPrice = baseCost * markup
    
    return {
      success: true,
      data: {
        suggestedPrice: suggestedPrice,
        priceRange: {
          min: suggestedPrice * 0.9,
          max: suggestedPrice * 1.15
        },
        competitorAverage: data.competitorPrices?.reduce((a, b) => a + b, 0) / (data.competitorPrices?.length || 1) || suggestedPrice,
        profitMargin: ((suggestedPrice - baseCost) / suggestedPrice * 100).toFixed(2) + '%',
        reasoning: [
          'Based on current market trends',
          'Competitive positioning analysis',
          'Cost structure optimization',
          'Demand elasticity consideration'
        ]
      }
    }
  }
}

