export type WarehouseType = 'SELF_OPERATED' | 'FBA' | 'WFS' | '3PL';
export type AllocationStrategy = 'FIFO' | 'LIFO' | 'FEFO' | 'PRIORITY';
export type OutOfStockAction = 'ALLOW_BACKORDER' | 'PREVENT_SALE' | 'WAIT_FOR_RESTOCK';
export type StockAlertRule = 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXCESS_STOCK' | 'EXPIRY';
export type PackagingType = 'STANDARD' | 'BUBBLE' | 'SHOCK_PROOF' | 'WATER_PROOF';
export type DangerousGoodsClass = 'NONE' | 'CLASS_1' | 'CLASS_2' | 'CLASS_3';
export type TemperatureControl = 'ROOM_TEMP' | 'REFRIGERATED' | 'FROZEN';

export interface WarehouseLocation {
  warehouseId: string;
  warehouseName: string;
  location: string;
  initialStock: number;
  minStock: number;
  maxStock: number;
  type: WarehouseType;
  priority: number;
}

export interface FBASettings {
  enabled: boolean;
  fulfillmentCenter: string;
  prepCenter?: string;
  labelingRequired: boolean;
  packagingRequired: boolean;
  hazmatEligible: boolean;
  expirationDateRequired: boolean;
  preparationInstructions?: string;
}

export interface WFSSettings {
  enabled: boolean;
  fulfillmentCenter: string;
  shippingTemplate: string;
  handlingTime: number;
  returnPolicy: string;
}

export interface ThirdPartyLogistics {
  provider: string;
  warehouse: string;
  accountNumber: string;
  apiKey?: string;
  integrationSettings: Record<string, any>;
}

export interface InventoryForecast {
  period: 'daily' | 'weekly' | 'monthly';
  forecastedDemand: number;
  confidenceLevel: number;
  seasonalityFactor: number;
  trendFactor: number;
}

export interface ReplenishmentRule {
  type: 'min-max' | 'periodic' | 'demand-driven';
  minQuantity: number;
  maxQuantity: number;
  orderPoint: number;
  orderQuantity: number;
  reviewPeriod?: number;
  leadTime: number;
  safetyStock: number;
}

export interface BatchControl {
  enabled: boolean;
  batchNumberRequired: boolean;
  expiryDateRequired: boolean;
  manufactureDateRequired: boolean;
  serialNumberRequired: boolean;
  batchAttributes: string[];
}

export interface StorageRequirement {
  temperatureRange?: {
    min: number;
    max: number;
    unit: 'C' | 'F';
  };
  humidity?: {
    min: number;
    max: number;
    unit: '%';
  };
  specialHandling: string[];
  stackable: boolean;
  stackingHeight?: number;
  hazmatClass?: string;
  storageIncompatibilities?: string[];
}

export interface WarehouseSettings {
  trackInventory: boolean;
  safetyStock: number;
  reorderPoint: number;
  maxStock: number;
  economicOrderQuantity: number;
  leadTime: number;
  warehouses: WarehouseLocation[];
  allocationStrategy: AllocationStrategy;
  outOfStockAction: OutOfStockAction;
  stockAlertRules: StockAlertRule[];
  packagingType: PackagingType;
  dangerousGoodsClass: DangerousGoodsClass;
  temperatureControl: TemperatureControl;
  stackingTier: number;
  shelfLife?: number;
  fba?: FBASettings;
  wfs?: WFSSettings;
  thirdPartyLogistics?: ThirdPartyLogistics[];
  inventoryForecasts?: InventoryForecast[];
  replenishmentRules?: ReplenishmentRule[];
  batchControl?: BatchControl;
  storageRequirements?: StorageRequirement;
}
