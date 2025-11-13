import type { AiProductResult, HybridFormState, TextFormState, ImageFormState, AiProductImage } from '@/types/ai-product';

export function generateMockResult(
  mode: 'hybrid' | 'text' | 'image',
  data: {
    formState?: HybridFormState | TextFormState | ImageFormState;
    images?: AiProductImage[];
  }
): AiProductResult {
  const { formState, images = [] } = data;
  
  // 根据模式生成不同的结果
  const language = (formState as any)?.language || 'english';
  const category = (formState as any)?.category || 'electronics';
  
  // 生成标题
  const title = generateTitle(mode, formState, images);
  const subtitle = generateSubtitle(mode, formState);
  
  // 生成类别路径
  const categoryPath = generateCategoryPath(category);
  
  // 生成标签
  const tags = generateTags(mode, formState, images);
  
  // 生成卖点
  const bullets = generateBullets(mode, formState, images);
  
  // 生成描述
  const description = generateDescription(mode, formState, images);
  
  // 生成属性
  const attributes = generateAttributes(mode, formState, images);
  
  // 生成变体
  const variants = (formState as HybridFormState)?.generateVariants 
    ? generateVariants(mode, formState)
    : undefined;
  
  // 生成销售属性（最多3个）
  const salesAttributes = generateSalesAttributes(mode, formState);
  
  // 生成SKU规则和建议
  const skuGenerationRule = generateSkuRule(formState);
  const suggestedSkus = generateSuggestedSkus(formState, variants, salesAttributes);
  
  // 生成图片（如果没有上传图片且需要生成）
  const resultImages = images.length > 0 
    ? images 
    : ((formState as any)?.generateImages ? generateMockImages() : []);
  
  return {
    title,
    subtitle,
    categoryPath,
    tags,
    bullets,
    description,
    attributes,
    variants,
    salesAttributes,
    images: resultImages,
    skuGenerationRule,
    suggestedSkus,
    meta: {
      status: 'generated',
      createdAt: new Date().toISOString()
    }
  };
}

function generateTitle(mode: string, formState: any, images: AiProductImage[]): string {
  if (mode === 'hybrid') {
    if (formState?.productNotes) {
      const notes = formState.productNotes.toLowerCase();
      if (notes.includes('headphone')) return 'Premium Wireless Headphones';
      if (notes.includes('phone')) return 'Smartphone Pro Max';
      if (notes.includes('watch')) return 'Smart Watch Series';
      if (notes.includes('laptop')) return 'Ultrabook Pro';
    }
    return 'Premium Product';
  }
  
  if (mode === 'text') {
    if (formState?.descriptionOrKeywords) {
      const desc = formState.descriptionOrKeywords.toLowerCase();
      if (desc.includes('coffee')) return 'Coffee Maker Deluxe';
      if (desc.includes('bag')) return 'Designer Handbag';
      if (desc.includes('shoes')) return 'Running Shoes Pro';
    }
    return 'AI Generated Product';
  }
  
  if (mode === 'image') {
    return 'Product from Image Analysis';
  }
  
  return 'AI Generated Product';
}

function generateSubtitle(mode: string, formState: any): string {
  const brand = formState?.brand || 'Premium Brand';
  return `${brand} - High Quality Product`;
}

function generateCategoryPath(category: string): string[] {
  const categoryMap: Record<string, string[]> = {
    drinkware: ['Home', 'Kitchen', 'Drinkware'],
    electronics: ['Electronics', 'Audio', 'Headphones'],
    home: ['Home', 'Living', 'Furniture'],
    fashion: ['Fashion', 'Accessories', 'Bags']
  };
  
  return categoryMap[category] || ['Electronics', 'General'];
}

function generateTags(mode: string, formState: any, images: AiProductImage[]): string[] {
  const baseTags = ['premium', 'high-quality'];
  
  if (mode === 'hybrid') {
    const audience = (formState as HybridFormState)?.targetAudience || [];
    return [...baseTags, ...audience.map(a => a.toLowerCase()), 'new-arrival'];
  }
  
  if (mode === 'text') {
    return [...baseTags, 'ai-generated', 'trending'];
  }
  
  return [...baseTags, 'image-detected'];
}

function generateBullets(mode: string, formState: any, images: AiProductImage[]): string[] {
  const maxBullets = (formState as TextFormState)?.maxBulletPoints || 5;
  
  const bulletTemplates = [
    'Premium quality materials for durability',
    'Ergonomic design for comfort',
    'Advanced technology integration',
    'Easy to use and maintain',
    'Perfect for daily use',
    'Stylish and modern appearance',
    'Environmentally friendly materials',
    'Long-lasting performance'
  ];
  
  return bulletTemplates.slice(0, maxBullets);
}

function generateDescription(mode: string, formState: any, images: AiProductImage[]): string {
  const tone = formState?.tone || 'professional';
  
  const descriptions: Record<string, string> = {
    professional: `This premium product combines cutting-edge technology with elegant design. Built with high-quality materials, it offers exceptional performance and durability. Perfect for professionals and enthusiasts alike, this product delivers outstanding value and reliability.`,
    friendly: `Meet your new favorite product! This amazing item is designed with you in mind, featuring a friendly and approachable design that makes it perfect for everyday use. It's reliable, easy to use, and built to last.`,
    premium: `Experience the pinnacle of luxury and craftsmanship. This exquisite product represents the finest in design and quality, crafted for those who appreciate the very best. Every detail has been carefully considered to deliver an unparalleled experience.`
  };
  
  return descriptions[tone] || descriptions.professional;
}

function generateAttributes(mode: string, formState: any, images: AiProductImage[]): any[] {
  const attributes = [
    { name: 'Material', value: 'Premium Plastic', source: 'ai' as const },
    { name: 'Color', value: 'Black', source: 'image' as const },
    { name: 'Weight', value: '250g', source: 'ai' as const },
    { name: 'Dimensions', value: '10 x 5 x 3 cm', source: 'notes' as const },
    { name: 'Warranty', value: '1 Year', source: 'ai' as const }
  ];
  
  if (mode === 'hybrid' && formState?.productNotes) {
    // 尝试从notes中提取属性
    const notes = formState.productNotes.toLowerCase();
    if (notes.includes('waterproof')) {
      attributes.push({ name: 'Water Resistance', value: 'IPX7', source: 'notes' as const });
    }
  }
  
  return attributes;
}

function generateVariants(mode: string, formState: any): any[] {
  return [
    { name: 'Variant 1', color: 'Black', size: 'Standard', price: 29.99, stock: 100, sku: 'PROD-BLK-STD-001' },
    { name: 'Variant 2', color: 'White', size: 'Standard', price: 29.99, stock: 80, sku: 'PROD-WHT-STD-001' },
    { name: 'Variant 3', color: 'Blue', size: 'Large', price: 34.99, stock: 50, sku: 'PROD-BLU-LRG-001' }
  ];
}

function generateSalesAttributes(mode: string, formState: any): any[] {
  return [
    { name: 'Color', values: ['Black', 'White', 'Blue', 'Red'] },
    { name: 'Size', values: ['Small', 'Medium', 'Large'] },
    { name: 'Material', values: ['Plastic', 'Metal', 'Wood'] }
  ];
}

function generateSkuRule(formState: any): any {
  const brand = formState?.brand || 'BRAND';
  return {
    enabled: true,
    prefix: brand.toUpperCase().substring(0, 4),
    format: '{BRAND}-{CATEGORY}-{VARIANT}',
    includeTimestamp: false
  };
}

function generateSuggestedSkus(formState: any, variants: any[] | undefined, salesAttributes: any[]): string[] {
  const brand = formState?.brand || 'BRAND';
  const prefix = brand.toUpperCase().substring(0, 4);
  const category = (formState as any)?.category || 'PROD';
  
  const skus: string[] = [];
  
  if (variants && variants.length > 0) {
    variants.forEach((variant, index) => {
      const color = variant.color?.substring(0, 3).toUpperCase() || 'DEF';
      const size = variant.size?.substring(0, 3).toUpperCase() || 'STD';
      skus.push(`${prefix}-${category}-${color}-${size}-${String(index + 1).padStart(3, '0')}`);
    });
  } else if (salesAttributes && salesAttributes.length > 0) {
    // 基于销售属性生成SKU
    const colors = salesAttributes.find(attr => attr.name === 'Color')?.values || [];
    const sizes = salesAttributes.find(attr => attr.name === 'Size')?.values || [];
    
    colors.forEach((color: string, cIndex: number) => {
      sizes.forEach((size: string, sIndex: number) => {
        const colorCode = color.substring(0, 3).toUpperCase();
        const sizeCode = size.substring(0, 3).toUpperCase();
        skus.push(`${prefix}-${category}-${colorCode}-${sizeCode}-${String(cIndex * sizes.length + sIndex + 1).padStart(3, '0')}`);
      });
    });
  } else {
    skus.push(`${prefix}-${category}-001`);
  }
  
  return skus.slice(0, 10); // 最多返回10个建议
}

function generateMockImages(): AiProductImage[] {
  return [
    {
      id: 'mock_img_1',
      url: 'https://via.placeholder.com/800x800?text=Product+Image+1',
      isMain: true
    },
    {
      id: 'mock_img_2',
      url: 'https://via.placeholder.com/800x800?text=Product+Image+2',
      isMain: false
    },
    {
      id: 'mock_img_3',
      url: 'https://via.placeholder.com/800x800?text=Product+Image+3',
      isMain: false
    }
  ];
}

