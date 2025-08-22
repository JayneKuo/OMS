import type { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'SKU001',
    name: 'Test Product 1',
    type: 'Normal',
    status: 'Active',
    vendor: 'Vendor A',
    brand: 'Brand A',
    manufacturer: 'Manufacturer A',
    cost: 100.00,
    regularPrice: 199.99,
    salePrice: 159.99,
    quantity: 100,
    doNotTrackInventory: false,
    categories: ['Electronics', 'Mobile Accessories'],
    tags: ['Hot', 'New'],
    integration: 'Shopify',
    weight: 0.5,
    weightUnit: 'kg',
    dimensions: {
      length: 10,
      width: 5,
      height: 2,
      unit: 'cm'
    },
    description: 'This is a detailed description of the test product',
    shortDescription: 'Test product brief',
    images: [
      {
        url: 'https://example.com/image1.jpg',
        alt: 'Product main image',
        isDefault: true
      }
    ],
    created: '2024-03-20T10:00:00Z',
    updated: '2024-03-20T15:30:00Z',
    channelSettings: {
      channels: []
    },
    warehouseSettings: {
      trackInventory: true,
      safetyStock: 10,
      reorderPoint: 20,
      maxStock: 100,
      economicOrderQuantity: 50,
      leadTime: 7,
      warehouses: [],
      batchManagement: {
        batchNumber: '',
        productionDate: '',
        expiryDate: ''
      },
      qualityControl: {
        inspectionStandards: [],
        inspectionReports: [],
        qualityMetrics: {},
        certifications: []
      },
      locationManagement: {
        primaryLocation: '',
        secondaryLocations: [],
        movementHistory: []
      },
      packagingSpecifications: {
        primaryPackaging: {
          type: '',
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          weight: {
            value: 0,
            unit: 'kg'
          }
        },
        shippingPackaging: {
          type: '',
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          weight: {
            value: 0,
            unit: 'kg'
          }
        }
      }
    },
    complianceSettings: {
      certifications: [],
      restrictions: [],
      marketAccess: {},
      customs: {
        hsCode: '',
        declaredValue: 0,
        dutyRate: 0,
        vatRate: 0
      },
      systemMapping: {
        type: 'manual',
        direction: 'import',
        status: 'pending'
      },
      documentManagement: {
        documents: [],
        expirationAlerts: [],
        documentTypes: [],
        accessControl: {
          roles: [],
          permissions: []
        }
      },
      complianceUpdates: [],
      marketRequirements: [],
      trainingRecords: []
    },
    mappingSettings: {
      systemMapping: {
        type: 'manual',
        direction: 'import',
        status: 'pending'
      },
      channelMappings: [],
      attributeMappings: [],
      versionControl: {
        currentVersion: '1.0.0',
        previousVersions: [],
        branchingStrategy: 'main',
        mergeHistory: []
      },
      changeHistory: [],
      validationRules: [],
      performanceMetrics: {
        syncDuration: 0,
        errorRate: 0,
        successRate: 0,
        throughput: 0,
        latency: 0,
        lastMeasured: new Date().toISOString()
      }
    }
  },
  {
    id: '2',
    sku: 'SKU002',
    name: 'Test Product 2',
    type: 'Sample',
    status: 'Draft',
    vendor: 'Vendor B',
    brand: 'Brand B',
    manufacturer: 'Manufacturer B',
    cost: 50.00,
    regularPrice: 99.99,
    salePrice: 79.99,
    quantity: 50,
    doNotTrackInventory: true,
    categories: ['Clothing', 'Accessories'],
    tags: ['Sample', 'Limited'],
    integration: 'Amazon',
    weight: 0.3,
    weightUnit: 'kg',
    dimensions: {
      length: 20,
      width: 15,
      height: 5,
      unit: 'cm'
    },
    description: 'This is a detailed description of the sample product',
    shortDescription: 'Sample product brief',
    images: [
      {
        url: 'https://example.com/image2.jpg',
        alt: 'Sample product main image',
        isDefault: true
      }
    ],
    created: '2024-03-19T08:00:00Z',
    updated: '2024-03-19T16:45:00Z',
    channelSettings: {
      channels: []
    },
    warehouseSettings: {
      trackInventory: true,
      safetyStock: 10,
      reorderPoint: 20,
      maxStock: 100,
      economicOrderQuantity: 50,
      leadTime: 7,
      warehouses: [],
      batchManagement: {
        batchNumber: '',
        productionDate: '',
        expiryDate: ''
      },
      qualityControl: {
        inspectionStandards: [],
        inspectionReports: [],
        qualityMetrics: {},
        certifications: []
      },
      locationManagement: {
        primaryLocation: '',
        secondaryLocations: [],
        movementHistory: []
      },
      packagingSpecifications: {
        primaryPackaging: {
          type: '',
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          weight: {
            value: 0,
            unit: 'kg'
          }
        },
        shippingPackaging: {
          type: '',
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          weight: {
            value: 0,
            unit: 'kg'
          }
        }
      }
    },
    complianceSettings: {
      certifications: [],
      restrictions: [],
      marketAccess: {},
      customs: {
        hsCode: '',
        declaredValue: 0,
        dutyRate: 0,
        vatRate: 0
      },
      systemMapping: {
        type: 'manual',
        direction: 'import',
        status: 'pending'
      },
      documentManagement: {
        documents: [],
        expirationAlerts: [],
        documentTypes: [],
        accessControl: {
          roles: [],
          permissions: []
        }
      },
      complianceUpdates: [],
      marketRequirements: [],
      trainingRecords: []
    },
    mappingSettings: {
      systemMapping: {
        type: 'manual',
        direction: 'import',
        status: 'pending'
      },
      channelMappings: [],
      attributeMappings: [],
      versionControl: {
        currentVersion: '1.0.0',
        previousVersions: [],
        branchingStrategy: 'main',
        mergeHistory: []
      },
      changeHistory: [],
      validationRules: [],
      performanceMetrics: {
        syncDuration: 0,
        errorRate: 0,
        successRate: 0,
        throughput: 0,
        latency: 0,
        lastMeasured: new Date().toISOString()
      }
    }
  },
  {
    id: '3',
    sku: 'SKU003',
    name: 'Test Product 3',
    type: 'Bundle',
    status: 'Active',
    vendor: 'Vendor C',
    brand: 'Brand C',
    manufacturer: 'Manufacturer C',
    cost: 200.00,
    regularPrice: 399.99,
    salePrice: 299.99,
    quantity: 30,
    doNotTrackInventory: false,
    categories: ['Bundles', 'Gifts'],
    tags: ['Promotion', 'Bundle'],
    integration: 'eBay',
    weight: 1.2,
    weightUnit: 'kg',
    dimensions: {
      length: 30,
      width: 20,
      height: 15,
      unit: 'cm'
    },
    description: 'This is a detailed description of the bundle product',
    shortDescription: 'Bundle product brief',
    images: [
      {
        url: 'https://example.com/image3.jpg',
        alt: 'Bundle product main image',
        isDefault: true
      }
    ],
    created: '2024-03-18T09:30:00Z',
    updated: '2024-03-18T14:20:00Z',
    channelSettings: {
      channels: []
    },
    warehouseSettings: {
      trackInventory: true,
      safetyStock: 10,
      reorderPoint: 20,
      maxStock: 100,
      economicOrderQuantity: 50,
      leadTime: 7,
      warehouses: [],
      batchManagement: {
        batchNumber: '',
        productionDate: '',
        expiryDate: ''
      },
      qualityControl: {
        inspectionStandards: [],
        inspectionReports: [],
        qualityMetrics: {},
        certifications: []
      },
      locationManagement: {
        primaryLocation: '',
        secondaryLocations: [],
        movementHistory: []
      },
      packagingSpecifications: {
        primaryPackaging: {
          type: '',
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          weight: {
            value: 0,
            unit: 'kg'
          }
        },
        shippingPackaging: {
          type: '',
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          weight: {
            value: 0,
            unit: 'kg'
          }
        }
      }
    },
    complianceSettings: {
      certifications: [],
      restrictions: [],
      marketAccess: {},
      customs: {
        hsCode: '',
        declaredValue: 0,
        dutyRate: 0,
        vatRate: 0
      },
      systemMapping: {
        type: 'manual',
        direction: 'import',
        status: 'pending'
      },
      documentManagement: {
        documents: [],
        expirationAlerts: [],
        documentTypes: [],
        accessControl: {
          roles: [],
          permissions: []
        }
      },
      complianceUpdates: [],
      marketRequirements: [],
      trainingRecords: []
    },
    mappingSettings: {
      systemMapping: {
        type: 'manual',
        direction: 'import',
        status: 'pending'
      },
      channelMappings: [],
      attributeMappings: [],
      versionControl: {
        currentVersion: '1.0.0',
        previousVersions: [],
        branchingStrategy: 'main',
        mergeHistory: []
      },
      changeHistory: [],
      validationRules: [],
      performanceMetrics: {
        syncDuration: 0,
        errorRate: 0,
        successRate: 0,
        throughput: 0,
        latency: 0,
        lastMeasured: new Date().toISOString()
      }
    },
    bundleSettings: {
      bundleType: 'FIXED',
      pricingStrategy: 'DISCOUNT',
      inventoryStrategy: 'COMPONENT',
      components: [],
      salesRules: [],
      priceHistory: [],
      salesAnalytics: {
        salesCount: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        topSellingCombinations: [],
        customerSegments: [],
        seasonalityTrends: []
      },
      inventoryAlerts: [],
      recommendations: []
    }
  },
  {
    id: '4',
    sku: 'SKU004',
    name: 'Test Product 4',
    type: 'Virtual',
    status: 'Out_Of_Stock',
    vendor: 'Vendor D',
    brand: 'Brand D',
    manufacturer: 'Manufacturer D',
    cost: 10.00,
    regularPrice: 29.99,
    salePrice: 19.99,
    quantity: 0,
    doNotTrackInventory: true,
    categories: ['Digital Products', 'Software'],
    tags: ['Virtual', 'Download'],
    integration: 'Shopify',
    weight: 0,
    weightUnit: 'kg',
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm'
    },
    description: 'This is a detailed description of the virtual product',
    shortDescription: 'Virtual product brief',
    images: [
      {
        url: 'https://example.com/image4.jpg',
        alt: 'Virtual product main image',
        isDefault: true
      }
    ],
    created: '2024-03-17T11:20:00Z',
    updated: '2024-03-17T18:15:00Z',
    channelSettings: {
      channels: []
    },
    warehouseSettings: {
      trackInventory: true,
      safetyStock: 10,
      reorderPoint: 20,
      maxStock: 100,
      economicOrderQuantity: 50,
      leadTime: 7,
      warehouses: [],
      batchManagement: {
        batchNumber: '',
        productionDate: '',
        expiryDate: ''
      },
      qualityControl: {
        inspectionStandards: [],
        inspectionReports: [],
        qualityMetrics: {},
        certifications: []
      },
      locationManagement: {
        primaryLocation: '',
        secondaryLocations: [],
        movementHistory: []
      },
      packagingSpecifications: {
        primaryPackaging: {
          type: '',
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          weight: {
            value: 0,
            unit: 'kg'
          }
        },
        shippingPackaging: {
          type: '',
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: 'cm'
          },
          weight: {
            value: 0,
            unit: 'kg'
          }
        }
      }
    },
    complianceSettings: {
      certifications: [],
      restrictions: [],
      marketAccess: {},
      customs: {
        hsCode: '',
        declaredValue: 0,
        dutyRate: 0,
        vatRate: 0
      },
      systemMapping: {
        type: 'manual',
        direction: 'import',
        status: 'pending'
      },
      documentManagement: {
        documents: [],
        expirationAlerts: [],
        documentTypes: [],
        accessControl: {
          roles: [],
          permissions: []
        }
      },
      complianceUpdates: [],
      marketRequirements: [],
      trainingRecords: []
    },
    mappingSettings: {
      systemMapping: {
        type: 'manual',
        direction: 'import',
        status: 'pending'
      },
      channelMappings: [],
      attributeMappings: [],
      versionControl: {
        currentVersion: '1.0.0',
        previousVersions: [],
        branchingStrategy: 'main',
        mergeHistory: []
      },
      changeHistory: [],
      validationRules: [],
      performanceMetrics: {
        syncDuration: 0,
        errorRate: 0,
        successRate: 0,
        throughput: 0,
        latency: 0,
        lastMeasured: new Date().toISOString()
      }
    }
  }
];

// Mock vendor list
export const mockVendors = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D', 'Vendor E'];

// Mock brand list
export const mockBrands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'];

// Mock API response for getting product list
export const getMockProducts = (params: {
  page: number;
  pageSize: number;
  search?: string;
  type?: string;
  integration?: string;
}) => {
  let filteredProducts = [...mockProducts];

  // Search filtering
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product =>
        (product.name?.toLowerCase().includes(searchLower) ?? false) ||
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

  // Integration filtering
  if (params.integration) {
    filteredProducts = filteredProducts.filter(
      product => product.integration === params.integration
    );
  }

  // Calculate pagination
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedProducts = filteredProducts.slice(start, end);

      return {
    data: paginatedProducts,
    total: filteredProducts.length
  };
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
export const mockCreateProduct = async (data: Partial<Product>) => {
  const newProduct: Product = {
    id: String(mockProducts.length + 1),
    sku: data.sku || `SKU${String(mockProducts.length + 1).padStart(3, '0')}`,
    name: data.name || '',
    type: data.type || 'Normal',
    status: 'Draft',
    vendor: data.vendor || '',
    brand: data.brand || '',
    cost: data.cost || 0,
    regularPrice: data.regularPrice || 0,
    salePrice: data.salePrice || 0,
    quantity: data.quantity || 0,
    doNotTrackInventory: data.doNotTrackInventory || false,
    categories: data.categories || [],
    tags: data.tags || [],
    weight: data.weight || 0,
    weightUnit: data.weightUnit || 'kg',
    dimensions: data.dimensions || {
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm'
    },
    description: data.description || '',
    shortDescription: data.shortDescription || '',
    images: data.images || [],
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };

  mockProducts.push(newProduct);
  return newProduct;
};