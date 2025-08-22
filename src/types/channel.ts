import type { Language } from './common';

export type ChannelType = 'amazon' | 'shopify' | 'ebay' | 'walmart' | 'woocommerce';

export interface ChannelListing {
  id: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  title: Record<Language, string>;
  description: Record<Language, string>;
  bulletPoints: Record<Language, string[]>;
  images: string[];
  videos: string[];
  category: string[];
  attributes: Record<string, string>;
  price: {
    regular: number;
    sale?: number;
    compareAt?: number;
    msrp?: number;
    currencyCode: string;
  };
  inventory: {
    strategy: 'fixed' | 'percentage' | 'actual';
    quantity?: number;
    percentage?: number;
    threshold?: number;
    trackInventory: boolean;
  };
  shipping: {
    weight: number;
    weightUnit: string;
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    handlingTime: number;
    freeShipping: boolean;
    shippingTemplate?: string;
  };
  tax: {
    taxable: boolean;
    taxCode?: string;
    taxClass?: string;
  };
  promotion: {
    enabled: boolean;
    startDate?: string;
    endDate?: string;
    type: 'percentage' | 'fixed' | 'bogo';
    value: number;
    conditions?: Record<string, any>;
  };
  analytics: {
    views: number;
    sales: number;
    conversion: number;
    ranking?: number;
    buyBox?: boolean;
    competitorPrices?: {
      min: number;
      max: number;
      average: number;
    };
  };
}

export interface AmazonListing extends ChannelListing {
  asin?: string;
  fulfillment: 'FBA' | 'FBM';
  bulletPoints: Record<Language, string[]>;
  searchTerms: string[];
  aplus?: {
    enabled: boolean;
    content?: string;
    modules?: Record<string, any>[];
  };
  variation?: {
    theme: string;
    attributes: string[];
  };
  brand: {
    name: string;
    store?: string;
    registry?: string;
  };
}

export interface ShopifyListing extends ChannelListing {
  handle: string;
  productType: string;
  vendor: string;
  collections: string[];
  tags: string[];
  metafields: Record<string, {
    value: string;
    type: string;
  }>;
  options: {
    name: string;
    values: string[];
  }[];
}

export interface EbayListing extends ChannelListing {
  itemId?: string;
  condition: 'NEW' | 'USED' | 'REFURBISHED';
  format: 'FIXED_PRICE' | 'AUCTION';
  duration: string;
  startPrice?: number;
  buyItNowPrice?: number;
  bestOffer: boolean;
  itemSpecifics: Record<string, string>;
  returnPolicy: {
    accepted: boolean;
    duration: string;
    shippingCost: string;
  };
  domesticShipping: {
    service: string;
    cost: number;
    additionalCost: number;
  }[];
  internationalShipping: {
    service: string;
    locations: string[];
    cost: number;
  }[];
}

export interface WalmartListing extends ChannelListing {
  wpid?: string;
  gtin: string;
  shelfDescription: string;
  shortDescription: string;
  keyFeatures: string[];
  brand: string;
  manufacturer: string;
  model: string;
  multipack?: {
    quantity: number;
    type: string;
  };
  prop65Warning?: {
    required: boolean;
    text?: string;
  };
  shippingWeight: {
    value: number;
    unit: string;
  };
  fulfillment: {
    type: 'WFS' | 'Seller';
    leadTime: number;
  };
}

export interface ChannelSettings {
  amazon?: AmazonListing;
  shopify?: ShopifyListing;
  ebay?: EbayListing;
  walmart?: WalmartListing;
  enabledChannels: ChannelType[];
}
