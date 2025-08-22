export type MappingStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'SYNCING';
export type MappingDirection = 'import' | 'export' | 'bidirectional';
export type MappingType = 'manual' | 'auto' | 'rule-based';
export type SyncFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly';

export interface SystemMapping {
  wmsCode: string;
  erpCode: string;
  supplierCode: string;
  manufacturerCode: string;
  mappingType: MappingType;
  direction: MappingDirection;
  lastSyncTime?: string;
  nextSyncTime?: string;
  syncStatus: MappingStatus;
  syncErrors?: string[];
}

export interface ChannelMapping {
  channel: string;
  store: string;
  productId: string;
  sku: string;
  status: MappingStatus;
  mappingType: MappingType;
  direction: MappingDirection;
  syncFrequency: SyncFrequency;
  lastSyncTime?: string;
  nextSyncTime?: string;
  syncErrors?: string[];
  metadata?: Record<string, any>;
}

export interface AttributeMapping {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    enum?: string[];
  };
  transformations?: {
    type: 'replace' | 'concat' | 'split' | 'format' | 'custom';
    params: Record<string, any>;
  }[];
  mappings: {
    channel: string;
    field: string;
    required: boolean;
    defaultValue?: string;
  }[];
}

export interface MappingTemplate {
  id: string;
  name: string;
  description: string;
  channel: string;
  attributeMappings: AttributeMapping[];
  rules?: {
    condition: string;
    actions: string[];
  }[];
  metadata?: Record<string, any>;
}

export interface MappingValidation {
  field: string;
  channel: string;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export interface MappingAnalytics {
  syncCount: number;
  errorCount: number;
  successRate: number;
  averageSyncTime: number;
  lastSync?: {
    time: string;
    duration: number;
    status: MappingStatus;
    errors?: string[];
  };
  channelStats: {
    channel: string;
    syncCount: number;
    errorCount: number;
    successRate: number;
  }[];
}

export interface MappingSettings {
  systemMapping: SystemMapping;
  channelMappings: ChannelMapping[];
  attributeMappings: AttributeMapping[];
  templates?: MappingTemplate[];
  validations?: MappingValidation[];
  analytics?: MappingAnalytics;
  autoSync: boolean;
  syncSchedule?: {
    frequency: SyncFrequency;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
  };
  errorHandling: {
    retryCount: number;
    retryDelay: number;
    notifyOnError: boolean;
    notifyEmails?: string[];
  };
  logging: {
    level: 'error' | 'warning' | 'info' | 'debug';
    retention: number;
    exportFormat: 'json' | 'csv';
  };
}
