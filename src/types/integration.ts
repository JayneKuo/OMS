import { IntegrationType, IntegrationSubType } from '@/constants/integration'

export interface Integration {
  id: number | string
  name: string
  type: IntegrationType
  subType?: IntegrationSubType
  status: 'connected' | 'disabled'
  enabled: boolean
  logo: string
  showNameFallback: boolean
  description?: string
  features?: string[]
  connectionInfo?: {
    [key: string]: any
    lastSyncTime?: string
  }
}

export interface IntegrationState {
  loading: boolean
  error: string | null
  integrations: Integration[]
  availableIntegrations: Integration[]
  filterType: string
  filterStatus: string
  sortDesc: boolean
  searchQuery: string
} 