export type BundleType = 'FIXED' | 'DYNAMIC' | 'OPTIONAL';
export type PricingStrategy = 'FIXED' | 'SUM' | 'DISCOUNT';
export type InventoryStrategy = 'INDEPENDENT' | 'COMPONENT';
export type SalesRule = 'ALLOW_SINGLE' | 'SYNC_PRICE' | 'SYNC_INVENTORY';

export interface BundleComponent {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  required: boolean;
  price: number;
  originalPrice?: number;
  inventory?: number;
  substitutes?: string[];
  position: number;
}

export interface BundleAnalytics {
  salesCount: number;
  conversionRate: number;
  averageOrderValue: number;
  topSellingCombinations?: {
    components: string[];
    salesCount: number;
    revenue: number;
  }[];
  customerSegments?: {
    segment: string;
    percentage: number;
  }[];
  seasonalityTrends?: {
    month: string;
    salesCount: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export interface BundlePromotion {
  enabled: boolean;
  type: 'percentage' | 'fixed' | 'bogo';
  value: number;
  startDate?: string;
  endDate?: string;
  minimumQuantity?: number;
  maximumDiscount?: number;
  stackable: boolean;
  channels: string[];
  customerGroups?: string[];
}

export interface BundleRecommendation {
  type: 'cross-sell' | 'up-sell' | 'frequently-bought-together';
  products: {
    productId: string;
    productName: string;
    sku: string;
    affinityScore: number;
    conversionRate: number;
  }[];
  rules?: {
    minPrice?: number;
    maxPrice?: number;
    categories?: string[];
    attributes?: Record<string, string[]>;
  };
}

export interface BundleInventoryRule {
  type: 'min-max' | 'percentage' | 'dynamic';
  minQuantity?: number;
  maxQuantity?: number;
  percentage?: number;
  restockThreshold?: number;
  restockQuantity?: number;
  allocationPriority?: number;
  backorderAllowed: boolean;
  reservationPeriod?: number;
}

export interface BundleSettings {
  bundleType: BundleType;
  pricingStrategy: PricingStrategy;
  discountRate?: number;
  components: BundleComponent[];
  inventoryStrategy: InventoryStrategy;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  salesRules: SalesRule[];
  analytics?: BundleAnalytics;
  promotions?: BundlePromotion[];
  recommendations?: BundleRecommendation[];
  inventoryRules?: BundleInventoryRule;
  status: 'draft' | 'active' | 'inactive';
  displayOrder?: number;
  customization?: {
    allowed: boolean;
    options?: {
      name: string;
      type: 'text' | 'select' | 'color';
      required: boolean;
      values?: string[];
    }[];
  };
  shippingRules?: {
    freeShipping: boolean;
    shippingClass?: string;
    dimensionalWeight?: number;
    specialHandling?: boolean;
  };
  restrictions?: {
    countries?: string[];
    customerGroups?: string[];
    minimumAge?: number;
    maximumQuantityPerOrder?: number;
  };
}
