import type { KnowledgeItem } from '@/types/knowledge'

interface WebPageCollectParams {
  url: string
  name: string
  tags: string[]
}

interface ApiCollectParams {
  endpoint: string
  name: string
  method: string
  headers: Record<string, string>
  params: Record<string, string>
  tags: string[]
}

interface CollectResult {
  id: string
}

export async function collectWebPage(params: WebPageCollectParams): Promise<CollectResult> {
  // TODO: 实现网页采集逻辑
  return {
    id: Date.now().toString()
  }
}

export async function collectApiData(params: ApiCollectParams): Promise<CollectResult> {
  // TODO: 实现API数据采集逻辑
  return {
    id: Date.now().toString()
  }
} 