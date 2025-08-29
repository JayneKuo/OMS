// 仓库设置相关类型定义
export interface DimensionsInfo {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface WeightInfo {
  net: number;
  gross: number;
  unit: 'kg' | 'lb';
}

export interface UOMLevel {
  type: string;
  quantity: number;
  barcode: string;
  dimensions: DimensionsInfo;
  weight: WeightInfo;
  palletRules?: {
    tie: number;
    high: number;
  };
}

export interface BarcodeInfo {
  type: string;
  value: string;
  verified: boolean;
}

export interface LotTrackingSettings {
  enabled: boolean;
  shelfLifeDays: number;
  fifoRule: 'FIFO' | 'FEFO' | 'LIFO' | 'STRICT_LOT';
  minReceivingLife: number;
  minShippingLife: number;
}

export interface SerialTrackingSettings {
  enabled: boolean;
  receivingRequired: boolean;
  shippingRequired: boolean;
}

export interface BarcodeStrategy {
  mode: 'EA_REQUIRED' | 'CS_CONFIRM' | 'PLT_CONFIRM';
  points: string[];
}

export interface DangerousGoodsInfo {
  isDangerous: boolean;
  unCode: string;
  hazardClass: string;
}

export interface StorageConditions {
  temperature: 'ROOM_TEMP' | 'REFRIGERATED' | 'FROZEN' | 'CLIMATE_CONTROLLED';
  stackable: boolean;
  tiltable: boolean;
  moistureSensitive: boolean;
}

export interface WarehouseAssignment {
  type: string;
  warehouseId: string;
  location: string;
  initialStock: number;
  minStock: number;
  maxStock: number;
  priority: number;
}

export interface FBASettings {
  enabled: boolean;
  fulfillmentCenter?: string;
  prepCenter?: string;
  labelingRequired?: boolean;
  packagingRequired?: boolean;
  hazmatEligible?: boolean;
  preparationInstructions?: string;
}

export interface WFSSettings {
  enabled: boolean;
  fulfillmentCenter?: string;
  shippingTemplate?: string;
  handlingTime?: number;
  returnPolicy?: string;
}

export interface ThirdPLSettings {
  provider: string;
  warehouse: string;
  accountNumber: string;
  apiKey: string;
}

export interface ReplenishmentRules {
  type: 'min-max' | 'periodic' | 'demand-driven';
  minQuantity: number;
  maxQuantity: number;
  orderPoint: number;
  orderQuantity: number;
  reviewPeriod?: number;
  safetyStock: number;
}

export interface InventoryForecasts {
  period: 'daily' | 'weekly' | 'monthly';
  forecastedDemand: number;
  confidenceLevel: number;
  seasonalityFactor: number;
  trendFactor: number;
}

export interface PackageLevel {
  level: string;
  spec: string;
  barcode: string;
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface DangerousInfo {
  unCode: string;
  class: string;
  packingGroup: string;
}

export interface WMSProductSettings {
  // 基础信息
  wmsCode: string;
  baseUnit: string;
  wmsCategory: string[];
  attributes: string[];

  // 包装信息
  packageLevels: PackageLevel[];

  // 存储要求
  storageType: string;
  abcClass: string;
  turnoverType: string;
  storageConditions: string[];
  specialRequirements: string[];
  dangerousInfo?: DangerousInfo;

  // 库存控制
  inventoryStrategy: string;
  replenishStrategy: string;
  stockoutAction: string;
  safetyStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  stockAlerts: string[];
}