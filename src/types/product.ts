import type { Language } from './common';

// 商品类型
export type ProductType = 'Physical' | 'Digital' | 'Bundle';

// 商品状态
export type ProductStatus = 'Draft' | 'Active' | 'Inactive';

// 计量单位
export type UnitOfMeasure = 'EA' | 'KG' | 'LB' | 'Pack' | 'Case' | 'Pallet';

// 尺寸单位
export type DimensionUnit = 'cm' | 'inch';

// 重量单位
export type WeightUnit = 'kg' | 'lb';

// 条码类型
export type BarcodeType = 'UPC' | 'EAN' | 'GTIN' | 'ISBN';

// 变体维度
export type VariantDimension = 'Color' | 'Size' | 'Material' | 'Style';

// 类目属性类型
export type CategoryAttributeType = 'text' | 'number' | 'select' | 'multiSelect';

// 类目属性值类型
export type CategoryAttributeValue = string | number | string[];

// 类目属性验证规则
export interface CategoryAttributeValidation {
  min?: number;
  max?: number;
  pattern?: string;
}

// 类目属性
export interface CategoryAttribute {
  name: string;
  value: CategoryAttributeValue;
  required: boolean;
  type: CategoryAttributeType;
  options?: string[];
  unit?: string;
  validation?: CategoryAttributeValidation;
}

// 基本资料
export interface GeneralInfo {
  productName: string;
  sku: string;
  parentSku?: string;
  type: ProductType;
  category: string[];
  brand?: string;
  status: ProductStatus;
  isSample: boolean;
}

// 图片与媒体
export interface MediaInfo {
  mainImages: {
    url: string;
    isWhiteBackground: boolean;
    hasWatermark: boolean;
    sortOrder: number;
  }[];
  additionalImages?: {
    url: string;
    sortOrder: number;
  }[];
  video?: {
    url: string;
    duration: number;
  };
}

// 描述与属性
export interface DescriptionInfo {
  description?: string;
  bulletPoints?: string[];
  categoryAttributes: Record<string, CategoryAttribute>;
}

// 物流信息
export interface LogisticsInfo {
  primaryUOM: {
    unit: UnitOfMeasure;
    customName?: string;
  };
  additionalUOMs?: {
    unit: UnitOfMeasure;
    ratio: number;
    customName?: string;
  }[];
  weight: {
    net: number;
    gross?: number;
    unit: WeightUnit;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: DimensionUnit;
  };
}

// 包装层级
export interface PackagingInfo {
  unit: {
    quantity: 1;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: DimensionUnit;
    };
    weight?: {
      value: number;
      unit: WeightUnit;
    };
  };
  innerPack?: {
    quantity: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: DimensionUnit;
    };
    weight?: {
      value: number;
      unit: WeightUnit;
    };
  };
  masterCarton?: {
    quantity: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: DimensionUnit;
    };
    weight?: {
      value: number;
      unit: WeightUnit;
    };
    stackingLimit?: number;
    temperatureRange?: {
      min: number;
      max: number;
      unit: 'C' | 'F';
    };
  };
}

// 变体选项
export interface VariantOption {
  value: string;
  displayName?: string;
  image?: string;
}

// 变体管理
export interface VariantInfo {
  enabled: boolean;
  dimensions?: VariantDimension[];
  options?: {
    [key in VariantDimension]?: VariantOption[];
  };
  children?: {
    sku: string;
    parentSku: string;
    barcode?: string;
    variantTitle: string;
    variantImage?: string;
    weight: {
      value: number;
      unit: WeightUnit;
    };
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: DimensionUnit;
    };
    status: ProductStatus;
    inventory?: {
      available: number;
      reserved: number;
      inbound: number;
    };
    price?: {
      cost: number;
      retail: number;
      sale?: number;
    };
  }[];
}

// 条码信息
export interface BarcodeInfo {
  primary: {
    type: BarcodeType;
    value: string;
    verified: boolean;
    verificationDate?: string;
  };
  additional?: {
    type: string;
    value: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }[];
  custom?: string;
}

// 多语言信息
export interface ProductTranslation {
  name: string;
  description?: string;
  bulletPoints?: string[];
  specifications?: {
    [key: string]: string;
  };
  seoInfo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// 系统信息
export interface SystemInfo {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
  source: string;
  platform?: string;
}

// 完整商品信息
export interface Product {
  id?: string;
  generalInfo: GeneralInfo;
  mediaInfo: MediaInfo;
  descriptionInfo: DescriptionInfo;
  logisticsInfo: LogisticsInfo;
  packagingInfo: PackagingInfo;
  variantInfo: VariantInfo;
  barcodeInfo: BarcodeInfo;
  translations: {
    [lang in Language]?: ProductTranslation;
  };
  systemInfo?: SystemInfo;
}