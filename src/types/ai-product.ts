export type AttributeSource = "image" | "notes" | "ai";

export interface AiProductAttribute {
  name: string;
  value: string;
  source: AttributeSource;
}

export interface AiProductVariant {
  name: string;
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
  sku?: string;
}

export interface AiProductImage {
  id: string;
  url: string;
  isMain?: boolean;
  file?: File;
}

export interface SalesAttribute {
  name: string;
  values: string[];
}

export interface SkuGenerationRule {
  enabled: boolean;
  prefix?: string;
  format?: string; // e.g., "{BRAND}-{CATEGORY}-{VARIANT}"
  includeTimestamp?: boolean;
}

export type AiStatus = "idle" | "loading" | "generated" | "error";

export interface AiProductResult {
  title: string;
  subtitle?: string;
  categoryPath: string[];
  tags: string[];
  bullets: string[];
  description: string;
  attributes: AiProductAttribute[];
  variants?: AiProductVariant[];
  salesAttributes?: SalesAttribute[]; // 销售属性，最多3个
  images: AiProductImage[];
  skuGenerationRule?: SkuGenerationRule;
  suggestedSkus?: string[]; // SKU生成建议
  meta: {
    status: AiStatus;
    createdAt?: string;
    errorMessage?: string;
  };
}

export type CreatorMode = "hybrid" | "text" | "image";

export interface HybridFormState {
  productNotes: string;
  tone: string;
  brand: string;
  category: string;
  targetAudience: string[];
  language: string;
  generateImages: boolean;
  outputDetailLevel: string;
  generateVariants: boolean;
  includeSeoFields: boolean;
}

export interface TextFormState {
  descriptionOrKeywords: string;
  language: string;
  generateImages: boolean;
  categoryHint: string;
  tone: string;
  maxBulletPoints: number;
}

export interface ImageFormState {
  shortNotes: string;
  language: string;
  category: string;
}

