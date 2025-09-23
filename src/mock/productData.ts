// 新的产品模拟数据，匹配优化后的字段结构
export const mockProducts = [
  {
    id: '1',
    spu: 'SPU001',
    sku: 'SPU001', // SPU行显示SPU编码
    name: 'iPhone 15 Pro Max Case',
    category: 'Mobile Accessories',
    type: 'PHYSICAL',
    status: 'Active',
    sellingForm: 'multi',
    sellingPrice: 29.99,
    dataSource: 'oms',
    publishedChannels: ['Shopify', 'Amazon', 'eBay'],
    variantCount: 3,
    expanded: false,
    isSpu: true, // 标记这是SPU行
    brand: 'TechGuard',
    vendor: 'Accessory World',
    cost: 12.50,
    regularPrice: 29.99,
    salePrice: 24.99,
    quantity: 150,
    uom: 'EA',
    tags: ['Hot', 'New', 'Bestseller'],
    created: '2024-03-20T10:00:00Z',
    updated: '2024-03-20T15:30:00Z',
    children: [
      {
        id: '1-1',
        spu: 'SPU001',
        sku: 'SKU001-BLK',
        name: 'iPhone 15 Pro Max Case - Black',
        category: 'Mobile Accessories',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 29.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay'],
        isChild: true, // 标记这是SKU行
        parentId: '1',
        variant: 'Black',
        brand: 'TechGuard',
        vendor: 'Accessory World',
        cost: 12.50,
        regularPrice: 29.99,
        salePrice: 24.99,
        quantity: 50,
        uom: 'EA',
        tags: ['Hot', 'New', 'Bestseller'],
        created: '2024-03-20T10:00:00Z',
        updated: '2024-03-20T15:30:00Z'
      },
      {
        id: '1-2',
        spu: 'SPU001',
        sku: 'SKU001-BLU',
        name: 'iPhone 15 Pro Max Case - Blue',
        category: 'Mobile Accessories',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 29.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay'],
        isChild: true,
        parentId: '1',
        variant: 'Blue',
        brand: 'TechGuard',
        vendor: 'Accessory World',
        cost: 12.50,
        regularPrice: 29.99,
        salePrice: 24.99,
        quantity: 60,
        uom: 'EA',
        tags: ['Hot', 'New', 'Bestseller'],
        created: '2024-03-20T10:00:00Z',
        updated: '2024-03-20T15:30:00Z'
      },
      {
        id: '1-3',
        spu: 'SPU001',
        sku: 'SKU001-RED',
        name: 'iPhone 15 Pro Max Case - Red',
        category: 'Mobile Accessories',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 29.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay'],
        isChild: true,
        parentId: '1',
        variant: 'Red',
        brand: 'TechGuard',
        vendor: 'Accessory World',
        cost: 12.50,
        regularPrice: 29.99,
        salePrice: 24.99,
        quantity: 40,
        uom: 'EA',
        tags: ['Hot', 'New', 'Bestseller'],
        created: '2024-03-20T10:00:00Z',
        updated: '2024-03-20T15:30:00Z'
      }
    ]
  },
  {
    id: '2',
    spu: 'SPU002',
    sku: 'SKU002',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    type: 'PHYSICAL',
    status: 'Active',
    sellingForm: 'single',
    sellingPrice: 89.99,
    dataSource: 'external',
    publishedChannels: ['Amazon', 'Walmart'],
    variantCount: 1,
    expanded: false,
    brand: 'SoundMax',
    vendor: 'Audio Solutions Ltd',
    cost: 45.00,
    regularPrice: 89.99,
    salePrice: 79.99,
    quantity: 75,
    uom: 'EA',
    tags: ['Electronics', 'Audio'],
    created: '2024-03-19T08:00:00Z',
    updated: '2024-03-19T16:45:00Z'
  },
  {
    id: '3',
    spu: 'SPU003',
    sku: 'SPU003',
    name: 'Smart Home Bundle',
    category: 'Smart Home',
    type: 'PHYSICAL',
    status: 'Active',
    sellingForm: 'bundle',
    sellingPrice: 299.99,
    dataSource: 'oms',
    publishedChannels: ['Shopify', 'Amazon'],
    variantCount: 4,
    expanded: false,
    isSpu: true,
    brand: 'SmartTech',
    vendor: 'Home Automation Inc',
    cost: 150.00,
    regularPrice: 399.99,
    salePrice: 299.99,
    quantity: 25,
    uom: 'SET',
    tags: ['Bundle', 'Smart Home', 'Promotion'],
    created: '2024-03-18T09:30:00Z',
    updated: '2024-03-18T14:20:00Z',
    children: [
      {
        id: '3-1',
        spu: 'SPU003',
        sku: 'SKU-SMART-HUB',
        name: 'Smart Hub Controller',
        category: 'Smart Home',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'bundle',
        sellingPrice: 89.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon'],
        isChild: true,
        isBundleItem: true,
        parentId: '3',
        bundleQuantity: 1,
        variant: 'Smart Hub × 1',
        brand: 'SmartTech',
        vendor: 'Home Automation Inc',
        cost: 45.00,
        regularPrice: 89.99,
        salePrice: 89.99,
        quantity: 25,
        uom: 'EA',
        tags: ['Bundle', 'Smart Home'],
        created: '2024-03-18T09:30:00Z',
        updated: '2024-03-18T14:20:00Z'
      },
      {
        id: '3-2',
        spu: 'SPU003',
        sku: 'SKU-SMART-BULB',
        name: 'Smart LED Bulbs',
        category: 'Smart Home',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'bundle',
        sellingPrice: 25.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon'],
        isChild: true,
        isBundleItem: true,
        parentId: '3',
        bundleQuantity: 4,
        variant: 'Smart Bulb × 4',
        brand: 'SmartTech',
        vendor: 'Home Automation Inc',
        cost: 12.00,
        regularPrice: 25.99,
        salePrice: 25.99,
        quantity: 100,
        uom: 'EA',
        tags: ['Bundle', 'Smart Home'],
        created: '2024-03-18T09:30:00Z',
        updated: '2024-03-18T14:20:00Z'
      },
      {
        id: '3-3',
        spu: 'SPU003',
        sku: 'SKU-SMART-SWITCH',
        name: 'Smart Wall Switch',
        category: 'Smart Home',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'bundle',
        sellingPrice: 39.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon'],
        isChild: true,
        isBundleItem: true,
        parentId: '3',
        bundleQuantity: 2,
        variant: 'Wall Switch × 2',
        brand: 'SmartTech',
        vendor: 'Home Automation Inc',
        cost: 20.00,
        regularPrice: 39.99,
        salePrice: 39.99,
        quantity: 50,
        uom: 'EA',
        tags: ['Bundle', 'Smart Home'],
        created: '2024-03-18T09:30:00Z',
        updated: '2024-03-18T14:20:00Z'
      },
      {
        id: '3-4',
        spu: 'SPU003',
        sku: 'SKU-SMART-SENSOR',
        name: 'Motion Sensor',
        category: 'Smart Home',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'bundle',
        sellingPrice: 19.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon'],
        isChild: true,
        isBundleItem: true,
        parentId: '3',
        bundleQuantity: 3,
        variant: 'Motion Sensor × 3',
        brand: 'SmartTech',
        vendor: 'Home Automation Inc',
        cost: 8.00,
        regularPrice: 19.99,
        salePrice: 19.99,
        quantity: 75,
        uom: 'EA',
        tags: ['Bundle', 'Smart Home'],
        created: '2024-03-18T09:30:00Z',
        updated: '2024-03-18T14:20:00Z'
      }
    ]
  },
  {
    id: '4',
    spu: 'SPU004',
    sku: 'SKU004',
    name: 'Premium Software License',
    category: 'Digital Products',
    type: 'VIRTUAL',
    status: 'Active',
    sellingForm: 'single',
    sellingPrice: 199.99,
    dataSource: 'api',
    publishedChannels: ['Website'],
    variantCount: 1,
    expanded: false,
    brand: 'SoftwarePro',
    vendor: 'Digital Solutions Corp',
    cost: 50.00,
    regularPrice: 199.99,
    salePrice: 149.99,
    quantity: 999,
    uom: 'LICENSE',
    tags: ['Digital', 'Software', 'License'],
    created: '2024-03-17T11:20:00Z',
    updated: '2024-03-17T18:15:00Z'
  },
  {
    id: '5',
    spu: 'SPU005',
    sku: 'SPU005',
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    type: 'PHYSICAL',
    status: 'Active',
    sellingForm: 'multi',
    sellingPrice: 24.99,
    dataSource: 'oms',
    publishedChannels: ['Shopify', 'Amazon', 'eBay', 'Walmart'],
    variantCount: 6,
    expanded: false,
    isSpu: true,
    brand: 'EcoWear',
    vendor: 'Sustainable Textiles',
    cost: 8.50,
    regularPrice: 24.99,
    salePrice: 19.99,
    quantity: 200,
    uom: 'EA',
    tags: ['Clothing', 'Organic', 'Sustainable'],
    created: '2024-03-16T07:45:00Z',
    updated: '2024-03-20T12:30:00Z',
    children: [
      {
        id: '5-1',
        spu: 'SPU005',
        sku: 'SKU005-WHT-S',
        name: 'Organic Cotton T-Shirt - White S',
        category: 'Clothing',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 24.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay', 'Walmart'],
        isChild: true,
        parentId: '5',
        variant: 'White / S',
        brand: 'EcoWear',
        vendor: 'Sustainable Textiles',
        cost: 8.50,
        regularPrice: 24.99,
        salePrice: 19.99,
        quantity: 35,
        uom: 'EA',
        tags: ['Clothing', 'Organic', 'Sustainable'],
        created: '2024-03-16T07:45:00Z',
        updated: '2024-03-20T12:30:00Z'
      },
      {
        id: '5-2',
        spu: 'SPU005',
        sku: 'SKU005-WHT-M',
        name: 'Organic Cotton T-Shirt - White M',
        category: 'Clothing',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 24.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay', 'Walmart'],
        isChild: true,
        parentId: '5',
        variant: 'White / M',
        brand: 'EcoWear',
        vendor: 'Sustainable Textiles',
        cost: 8.50,
        regularPrice: 24.99,
        salePrice: 19.99,
        quantity: 40,
        uom: 'EA',
        tags: ['Clothing', 'Organic', 'Sustainable'],
        created: '2024-03-16T07:45:00Z',
        updated: '2024-03-20T12:30:00Z'
      },
      {
        id: '5-3',
        spu: 'SPU005',
        sku: 'SKU005-WHT-L',
        name: 'Organic Cotton T-Shirt - White L',
        category: 'Clothing',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 24.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay', 'Walmart'],
        isChild: true,
        parentId: '5',
        variant: 'White / L',
        brand: 'EcoWear',
        vendor: 'Sustainable Textiles',
        cost: 8.50,
        regularPrice: 24.99,
        salePrice: 19.99,
        quantity: 45,
        uom: 'EA',
        tags: ['Clothing', 'Organic', 'Sustainable'],
        created: '2024-03-16T07:45:00Z',
        updated: '2024-03-20T12:30:00Z'
      },
      {
        id: '5-4',
        spu: 'SPU005',
        sku: 'SKU005-BLK-S',
        name: 'Organic Cotton T-Shirt - Black S',
        category: 'Clothing',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 24.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay', 'Walmart'],
        isChild: true,
        parentId: '5',
        variant: 'Black / S',
        brand: 'EcoWear',
        vendor: 'Sustainable Textiles',
        cost: 8.50,
        regularPrice: 24.99,
        salePrice: 19.99,
        quantity: 30,
        uom: 'EA',
        tags: ['Clothing', 'Organic', 'Sustainable'],
        created: '2024-03-16T07:45:00Z',
        updated: '2024-03-20T12:30:00Z'
      },
      {
        id: '5-5',
        spu: 'SPU005',
        sku: 'SKU005-BLK-M',
        name: 'Organic Cotton T-Shirt - Black M',
        category: 'Clothing',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 24.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay', 'Walmart'],
        isChild: true,
        parentId: '5',
        variant: 'Black / M',
        brand: 'EcoWear',
        vendor: 'Sustainable Textiles',
        cost: 8.50,
        regularPrice: 24.99,
        salePrice: 19.99,
        quantity: 25,
        uom: 'EA',
        tags: ['Clothing', 'Organic', 'Sustainable'],
        created: '2024-03-16T07:45:00Z',
        updated: '2024-03-20T12:30:00Z'
      },
      {
        id: '5-6',
        spu: 'SPU005',
        sku: 'SKU005-BLK-L',
        name: 'Organic Cotton T-Shirt - Black L',
        category: 'Clothing',
        type: 'PHYSICAL',
        status: 'Active',
        sellingForm: 'multi',
        sellingPrice: 24.99,
        dataSource: 'oms',
        publishedChannels: ['Shopify', 'Amazon', 'eBay', 'Walmart'],
        isChild: true,
        parentId: '5',
        variant: 'Black / L',
        brand: 'EcoWear',
        vendor: 'Sustainable Textiles',
        cost: 8.50,
        regularPrice: 24.99,
        salePrice: 19.99,
        quantity: 25,
        uom: 'EA',
        tags: ['Clothing', 'Organic', 'Sustainable'],
        created: '2024-03-16T07:45:00Z',
        updated: '2024-03-20T12:30:00Z'
      }
    ]
  },
  {
    id: '6',
    spu: 'SPU006',
    sku: 'SKU006',
    name: 'Sample Product Kit',
    category: 'Samples',
    type: 'SAMPLE',
    status: 'Draft',
    sellingForm: 'single',
    sellingPrice: 0.00,
    dataSource: 'oms',
    publishedChannels: [],
    variantCount: 1,
    expanded: false,
    brand: 'TestBrand',
    vendor: 'Sample Co',
    cost: 2.50,
    regularPrice: 0.00,
    salePrice: 0.00,
    quantity: 50,
    uom: 'EA',
    tags: ['Sample', 'Free'],
    created: '2024-03-15T14:00:00Z',
    updated: '2024-03-15T14:00:00Z'
  },
  {
    id: '7',
    spu: 'SPU007',
    sku: 'SKU007',
    name: 'Professional Consultation Service',
    category: 'Services',
    type: 'SERVICE',
    status: 'Active',
    sellingForm: 'single',
    sellingPrice: 150.00,
    dataSource: 'oms',
    publishedChannels: ['Website', 'Shopify'],
    variantCount: 1,
    expanded: false,
    brand: 'ConsultPro',
    vendor: 'Professional Services Inc',
    cost: 75.00,
    regularPrice: 150.00,
    salePrice: 150.00,
    quantity: 0,
    uom: 'HOUR',
    tags: ['Service', 'Consultation', 'Professional'],
    created: '2024-03-14T10:15:00Z',
    updated: '2024-03-19T09:20:00Z'
  },
  {
    id: '8',
    spu: 'SPU008',
    sku: 'SKU008',
    name: 'Gift Card',
    category: 'Gift Cards',
    type: 'GIFT',
    status: 'Active',
    sellingForm: 'multi',
    sellingPrice: 50.00,
    dataSource: 'oms',
    publishedChannels: ['Shopify', 'Website'],
    variantCount: 4,
    expanded: false,
    brand: 'GiftCards Plus',
    vendor: 'Gift Solutions',
    cost: 0.50,
    regularPrice: 50.00,
    salePrice: 50.00,
    quantity: 999,
    uom: 'EA',
    tags: ['Gift', 'Digital', 'Card'],
    created: '2024-03-13T16:30:00Z',
    updated: '2024-03-18T11:45:00Z'
  },
  {
    id: '9',
    spu: 'SPU009',
    sku: 'SKU009',
    name: 'Raw Material - Cotton Fabric',
    category: 'Raw Materials',
    type: 'MATERIAL',
    status: 'Active',
    sellingForm: 'single',
    sellingPrice: 15.99,
    dataSource: 'external',
    publishedChannels: ['B2B Portal'],
    variantCount: 1,
    expanded: false,
    brand: 'MaterialSource',
    vendor: 'Textile Suppliers Ltd',
    cost: 8.00,
    regularPrice: 15.99,
    salePrice: 15.99,
    quantity: 500,
    uom: 'METER',
    tags: ['Material', 'Cotton', 'B2B'],
    created: '2024-03-12T08:20:00Z',
    updated: '2024-03-16T14:10:00Z'
  },
  {
    id: '10',
    spu: 'SPU010',
    sku: 'SKU010',
    name: 'Luxury Watch Collection',
    category: 'Watches',
    type: 'PHYSICAL',
    status: 'Inactive',
    sellingForm: 'multi',
    sellingPrice: 899.99,
    dataSource: 'api',
    publishedChannels: [],
    variantCount: 6,
    expanded: false,
    brand: 'LuxuryTime',
    vendor: 'Premium Watches Inc',
    cost: 450.00,
    regularPrice: 899.99,
    salePrice: 799.99,
    quantity: 15,
    uom: 'EA',
    tags: ['Luxury', 'Watch', 'Premium'],
    created: '2024-03-11T13:45:00Z',
    updated: '2024-03-17T16:20:00Z'
  }
];

// Mock vendor list
export const mockVendors = [
  'Accessory World',
  'Audio Solutions Ltd', 
  'Home Automation Inc',
  'Digital Solutions Corp',
  'Sustainable Textiles',
  'Sample Co',
  'Professional Services Inc',
  'Gift Solutions',
  'Textile Suppliers Ltd',
  'Premium Watches Inc'
];

// Mock brand list
export const mockBrands = [
  'TechGuard',
  'SoundMax',
  'SmartTech', 
  'SoftwarePro',
  'EcoWear',
  'TestBrand',
  'ConsultPro',
  'GiftCards Plus',
  'MaterialSource',
  'LuxuryTime'
];

// Mock API response for getting product list
export const getMockProducts = (params: {
  page: number;
  pageSize: number;
  search?: string;
  type?: string;
  integration?: string;
  sellingForm?: string;
  dataSource?: string;
  status?: string;
}) => {
  let filteredProducts = [...mockProducts];

  // Search filtering
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product =>
        (product.name?.toLowerCase().includes(searchLower) ?? false) ||
        (product.spu?.toLowerCase().includes(searchLower) ?? false) ||
        (product.sku?.toLowerCase().includes(searchLower) ?? false) ||
        (product.vendor?.toLowerCase().includes(searchLower) ?? false)
    );
  }

  // Type filtering
  if (params.type) {
    filteredProducts = filteredProducts.filter(
      product => product.type === params.type
    );
  }

  // Status filtering
  if (params.status) {
    filteredProducts = filteredProducts.filter(
      product => product.status === params.status
    );
  }

  // Selling form filtering
  if (params.sellingForm) {
    filteredProducts = filteredProducts.filter(
      product => product.sellingForm === params.sellingForm
    );
  }

  // Data source filtering
  if (params.dataSource) {
    filteredProducts = filteredProducts.filter(
      product => product.dataSource === params.dataSource
    );
  }

  // Integration filtering (legacy support)
  if (params.integration) {
    filteredProducts = filteredProducts.filter(
      product => product.publishedChannels?.includes(params.integration!)
    );
  }

  // 展开SPU/SKU结构 - 根据展开状态决定是否显示子项
  const expandedProducts: any[] = [];
  filteredProducts.forEach(product => {
    expandedProducts.push(product); // 先添加SPU行
    
    // 如果产品已展开且有子项，添加所有SKU行
    if (product.expanded && product.children) {
      expandedProducts.push(...product.children);
    }
  });

  // Calculate pagination
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedProducts = expandedProducts.slice(start, end);

      return {
    data: paginatedProducts,
    total: expandedProducts.length
  };
};

// 切换SPU展开状态的函数
export const toggleSpuExpansion = (spuId: string) => {
  const product = mockProducts.find(p => p.id === spuId);
  if (product && product.children) {
    product.expanded = !product.expanded;
  }
  return product;
};

// Mock API for deleting product
export const mockDeleteProduct = async (id: string) => {
  const index = mockProducts.findIndex(p => p.id === id);
      if (index > -1) {
        mockProducts.splice(index, 1);
    return true;
  }
  throw new Error('Product not found');
};

// Mock API for creating product
export const mockCreateProduct = (data: any) => {
  const newProduct = {
    id: String(mockProducts.length + 1),
    spu: data.spu || `SPU${String(mockProducts.length + 1).padStart(3, '0')}`,
    sku: data.sku || `SKU${String(mockProducts.length + 1).padStart(3, '0')}`,
    name: data.name || '',
    category: data.category || '',
    type: data.type || 'PHYSICAL',
    status: 'Draft',
    sellingForm: data.sellingForm || 'single',
    sellingPrice: data.sellingPrice || 0,
    dataSource: 'oms',
    publishedChannels: [],
    variantCount: 1,
    expanded: false,
    brand: data.brand || '',
    vendor: data.vendor || '',
    cost: data.cost || 0,
    regularPrice: data.regularPrice || 0,
    salePrice: data.salePrice || 0,
    quantity: data.quantity || 0,
    uom: data.uom || 'EA',
    tags: data.tags || [],
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };

  mockProducts.push(newProduct);
  return newProduct;
};