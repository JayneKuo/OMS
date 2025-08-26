// src/mock/index.ts
import axios from "axios";
import { ElMessage } from "element-plus";

// src/mock/queryToolData.ts
var customers = [
  { id: "nyf", name: "\u7EBD\u7EA6\u670D\u9970", code: "NYF" },
  { id: "cat", name: "\u52A0\u5DDE\u79D1\u6280", code: "CAT" },
  { id: "txe", name: "\u5FB7\u514B\u8428\u65AF\u7535\u5B50", code: "TXE" },
  { id: "chi", name: "\u829D\u52A0\u54E5\u98DF\u54C1", code: "CHI" },
  { id: "sea", name: "\u897F\u96C5\u56FE\u5496\u5561", code: "SEA" }
];
var channelMap = {
  nyf: [
    { id: "amazon", name: "Amazon", code: "AMZ", type: "marketplace" },
    { id: "shopify", name: "Shopify", code: "SHF", type: "ecommerce" },
    { id: "walmart", name: "Walmart", code: "WMT", type: "marketplace" }
  ],
  cat: [
    { id: "amazon", name: "Amazon", code: "AMZ", type: "marketplace" },
    { id: "ebay", name: "eBay", code: "EBY", type: "marketplace" },
    { id: "shopify", name: "Shopify", code: "SHF", type: "ecommerce" }
  ],
  txe: [
    { id: "amazon", name: "Amazon", code: "AMZ", type: "marketplace" },
    { id: "ebay", name: "eBay", code: "EBY", type: "marketplace" },
    { id: "walmart", name: "Walmart", code: "WMT", type: "marketplace" }
  ],
  chi: [
    { id: "amazon", name: "Amazon", code: "AMZ", type: "marketplace" },
    { id: "shopify", name: "Shopify", code: "SHF", type: "ecommerce" }
  ],
  sea: [
    { id: "amazon", name: "Amazon", code: "AMZ", type: "marketplace" },
    { id: "shopify", name: "Shopify", code: "SHF", type: "ecommerce" },
    { id: "ebay", name: "eBay", code: "EBY", type: "marketplace" }
  ]
};
var orderList = [
  {
    channelOrderId: "AMZ-123456789",
    systemOrderId: "SO-987654321",
    channel: "amazon",
    status: "\u5DF2\u5B8C\u6210",
    customerName: "\u5F20\u4E09",
    amount: 299.99,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 864e5,
    // 一天前
    systemCreateTime: (/* @__PURE__ */ new Date()).getTime() - 85e6,
    items: [
      { sku: "SKU001", productName: "\u9AD8\u54C1\u8D28\u65E0\u7EBF\u84DD\u7259\u8033\u673A", quantity: 2, price: 99.99, total: 199.98, fulfillmentStatus: "\u5DF2\u53D1\u8D27" },
      { sku: "SKU002", productName: "\u667A\u80FD\u624B\u8868", quantity: 1, price: 100.01, total: 100.01, fulfillmentStatus: "\u5DF2\u53D1\u8D27" }
    ],
    channelStatus: "Shipped",
    store: "US Store"
  },
  {
    channelOrderId: "SHF-987654321",
    systemOrderId: "SO-123456789",
    channel: "shopify",
    status: "\u5904\u7406\u4E2D",
    customerName: "\u674E\u56DB",
    amount: 499.99,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 432e5,
    // 12小时前
    systemCreateTime: (/* @__PURE__ */ new Date()).getTime() - 42e6,
    items: [
      { sku: "SKU003", productName: "\u8D85\u8584\u7B14\u8BB0\u672C\u7535\u8111", quantity: 1, price: 499.99, total: 499.99, fulfillmentStatus: "\u5F85\u53D1\u8D27" }
    ],
    channelStatus: "Processing",
    store: "Main Store"
  },
  {
    channelOrderId: "WMT-456789123",
    systemOrderId: null,
    channel: "walmart",
    status: null,
    customerName: "\u738B\u4E94",
    amount: 159.99,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 216e5,
    // 6小时前
    items: [
      { sku: "SKU004", productName: "\u9632\u6C34\u8FD0\u52A8\u76F8\u673A", quantity: 3, price: 53.33, total: 159.99, fulfillmentStatus: "\u5DF2\u9000\u6B3E" }
    ],
    channelStatus: "Pending",
    store: "US Store"
  },
  {
    channelOrderId: "AMZ-234567891",
    systemOrderId: "SO-345678912",
    channel: "amazon",
    status: "\u5F85\u5904\u7406",
    customerName: "\u8D75\u516D",
    amount: 89.95,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 36e5,
    // 1小时前
    items: [
      { sku: "SKU005", productName: "\u4FBF\u643A\u5F0F\u5145\u7535\u5B9D", quantity: 1, price: 39.99, total: 39.99, fulfillmentStatus: "\u5F85\u53D1\u8D27" },
      { sku: "SKU006", productName: "\u6570\u636E\u7EBF\u5957\u88C5", quantity: 2, price: 24.98, total: 49.96, fulfillmentStatus: "\u5F85\u53D1\u8D27" }
    ],
    channelStatus: "Unshipped",
    store: "EU Store"
  },
  {
    channelOrderId: "EBY-345678912",
    systemOrderId: "SO-567891234",
    channel: "ebay",
    status: "\u5DF2\u5B8C\u6210",
    customerName: "\u94B1\u4E03",
    amount: 59.99,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 1728e5,
    // 2天前
    items: [
      { sku: "SKU007", productName: "\u667A\u80FD\u5BB6\u5C45\u63A7\u5236\u5668", quantity: 1, price: 59.99, total: 59.99, fulfillmentStatus: "\u5DF2\u53D1\u8D27" }
    ],
    channelStatus: "Delivered",
    store: "Main Store"
  },
  {
    channelOrderId: "SHF-456789123",
    systemOrderId: "SO-678912345",
    channel: "shopify",
    status: "\u5F02\u5E38",
    customerName: "\u5B59\u516B",
    amount: 129.98,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 2592e5,
    // 3天前
    items: [
      { sku: "SKU008", productName: "\u65E0\u7EBF\u952E\u9F20\u5957\u88C5", quantity: 1, price: 79.99, total: 79.99 },
      { sku: "SKU009", productName: "\u9F20\u6807\u57AB", quantity: 1, price: 49.99, total: 49.99 }
    ],
    channelStatus: "Payment Failed",
    store: "CN Store"
  },
  // 新增订单数据
  {
    channelOrderId: "AMZ-567891234",
    systemOrderId: "SO-789123456",
    channel: "amazon",
    status: "\u5DF2\u5B8C\u6210",
    customerName: "\u5468\u4E5D",
    amount: 1299.99,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 3456e5,
    // 4天前
    items: [
      { sku: "SKU010", productName: "\u6E38\u620F\u7B14\u8BB0\u672C\u7535\u8111", quantity: 1, price: 1299.99, total: 1299.99 }
    ],
    channelStatus: "Delivered",
    store: "US Store"
  },
  {
    channelOrderId: "WMT-678912345",
    systemOrderId: "SO-891234567",
    channel: "walmart",
    status: "\u5DF2\u5B8C\u6210",
    customerName: "\u5434\u5341",
    amount: 249.99,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 432e6,
    // 5天前
    items: [
      { sku: "SKU011", productName: "\u667A\u80FD\u97F3\u7BB1", quantity: 2, price: 124.99, total: 249.98 }
    ],
    channelStatus: "Shipped",
    store: "US Store"
  },
  {
    channelOrderId: "EBY-789123456",
    systemOrderId: "SO-912345678",
    channel: "ebay",
    status: "\u5904\u7406\u4E2D",
    customerName: "\u90D1\u5341\u4E00",
    amount: 79.99,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 5184e5,
    // 6天前
    items: [
      { sku: "SKU012", productName: "\u667A\u80FD\u706F\u6CE1\u5957\u88C5", quantity: 4, price: 19.99, total: 79.96 }
    ],
    channelStatus: "Processing",
    store: "EU Store"
  },
  {
    channelOrderId: "SHF-891234567",
    systemOrderId: "SO-123789456",
    channel: "shopify",
    status: "\u5F85\u5904\u7406",
    customerName: "\u738B\u4E94",
    amount: 399.98,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 6048e5,
    // 7天前
    items: [
      { sku: "SKU013", productName: "\u65E0\u7EBF\u8033\u673A", quantity: 2, price: 199.99, total: 399.98 }
    ],
    channelStatus: "Awaiting Fulfillment",
    store: "Main Store"
  },
  {
    channelOrderId: "AMZ-912345678",
    systemOrderId: "SO-234891567",
    channel: "amazon",
    status: "\u5F02\u5E38",
    customerName: "\u5F20\u4E09",
    amount: 59.97,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 6912e5,
    // 8天前
    items: [
      { sku: "SKU014", productName: "\u624B\u673A\u4FDD\u62A4\u58F3", quantity: 3, price: 19.99, total: 59.97 }
    ],
    channelStatus: "Error",
    store: "EU Store"
  },
  {
    channelOrderId: "WMT-123789456",
    systemOrderId: "SO-345912678",
    channel: "walmart",
    status: "\u5DF2\u5B8C\u6210",
    customerName: "\u674E\u56DB",
    amount: 29.99,
    createTime: (/* @__PURE__ */ new Date()).getTime() - 7776e5,
    // 9天前
    items: [
      { sku: "SKU015", productName: "\u624B\u673A\u652F\u67B6", quantity: 1, price: 29.99, total: 29.99 }
    ],
    channelStatus: "Delivered",
    store: "US Store"
  }
];
var systemOrderList = [
  {
    systemOrderId: "SO-987654321",
    status: "\u5DF2\u5B8C\u6210",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 864e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 432e5
  },
  {
    systemOrderId: "SO-123456789",
    status: "\u5904\u7406\u4E2D",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 432e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 216e5
  },
  {
    systemOrderId: "SO-456789123",
    status: "\u5F02\u5E38",
    errorReason: "\u5730\u5740\u4FE1\u606F\u4E0D\u5B8C\u6574\uFF0C\u7F3A\u5C11\u8857\u9053\u53F7\u7801\uFF0C\u65E0\u6CD5\u5B8C\u6210\u914D\u9001\u5730\u5740\u9A8C\u8BC1",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 216e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 36e5
  },
  {
    systemOrderId: "SO-345678912",
    status: "\u5F85\u5904\u7406",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 36e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 18e5
  },
  {
    systemOrderId: "SO-567891234",
    status: "\u5DF2\u5B8C\u6210",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 1728e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 864e5
  },
  {
    systemOrderId: "SO-678912345",
    status: "\u5F02\u5E38",
    errorReason: "\u4ED8\u6B3E\u4FE1\u606F\u9A8C\u8BC1\u5931\u8D25\uFF0C\u94F6\u884C\u5361\u53F7\u65E0\u6548",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 2592e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 1728e5
  },
  {
    systemOrderId: "SO-789123456",
    status: "\u5DF2\u5B8C\u6210",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 3456e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 2592e5
  },
  {
    systemOrderId: "SO-891234567",
    status: "\u5DF2\u5B8C\u6210",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 432e6,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 3456e5
  },
  {
    systemOrderId: "SO-912345678",
    status: "\u5904\u7406\u4E2D",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 5184e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 432e6
  },
  {
    systemOrderId: "SO-123789456",
    status: "\u5F85\u5904\u7406",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 6048e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 5184e5
  },
  {
    systemOrderId: "SO-234891567",
    status: "\u5F02\u5E38",
    errorReason: "\u5546\u54C1\u5E93\u5B58\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u6EE1\u8DB3\u8BA2\u5355\u9700\u6C42",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 6912e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 6048e5
  },
  {
    systemOrderId: "SO-345912678",
    status: "\u5DF2\u5B8C\u6210",
    createTime: (/* @__PURE__ */ new Date()).getTime() - 7776e5,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 6912e5
  }
];
var productList = [
  {
    sku: "SKU001",
    productName: "\u9AD8\u54C1\u8D28\u65E0\u7EBF\u84DD\u7259\u8033\u673A",
    channelSku: "AMZ-SKU001",
    channel: "amazon",
    price: 99.99,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/headphones.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 1728e5,
    // 2天前
    lastSyncTime: (/* @__PURE__ */ new Date()).getTime() - 864e5,
    // 1天前
    customerName: "\u5BA2\u6237A",
    stock: 30,
    wmsStock: 45,
    lastSyncStock: 38,
    store: "US Store",
    masterSku: "MS-001",
    masterProductName: "Master \u84DD\u7259\u8033\u673A",
    warehouseStock: {
      US: 20,
      EU: 15,
      CN: 10
    },
    syncRule: {
      type: "percent",
      value: 80
    },
    inventoryLocations: [
      { name: "\u4E0A\u6D77\u4ED3", quantity: 25 },
      { name: "\u5317\u4EAC\u4ED3", quantity: 15 },
      { name: "\u5E7F\u5DDE\u4ED3", quantity: 5 }
    ]
  },
  {
    sku: "SKU001",
    productName: "\u9AD8\u54C1\u8D28\u65E0\u7EBF\u84DD\u7259\u8033\u673A",
    channelSku: "SHF-SKU001",
    channel: "shopify",
    price: 109.99,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/headphones.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 2592e5,
    // 3天前
    lastSyncTime: (/* @__PURE__ */ new Date()).getTime() - 1728e5,
    // 2天前
    customerName: "\u5BA2\u6237B",
    stock: 10,
    wmsStock: 25,
    lastSyncStock: 22,
    store: "Main Store",
    masterSku: "MS-001",
    masterProductName: "Master \u84DD\u7259\u8033\u673A",
    warehouseStock: {
      US: 10,
      EU: 15
    },
    syncRule: {
      type: "fixed",
      value: 100
    },
    inventoryLocations: [
      { name: "\u6B27\u6D32\u4ED3", quantity: 18 },
      { name: "\u7F8E\u56FD\u4ED3", quantity: 7 }
    ]
  },
  {
    sku: "SKU001",
    productName: "\u9AD8\u54C1\u8D28\u65E0\u7EBF\u84DD\u7259\u8033\u673A",
    channelSku: "WMT-SKU001",
    channel: "walmart",
    price: 89.99,
    status: "\u7F3A\u8D27",
    imageUrl: "https://example.com/images/headphones.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 3456e5,
    // 4天前
    lastSyncTime: (/* @__PURE__ */ new Date()).getTime() - 2592e5,
    // 3天前
    customerName: "\u5BA2\u6237C",
    stock: 0,
    wmsStock: 15,
    lastSyncStock: 12,
    store: "US Store",
    warehouseStock: {
      US: 15
    },
    syncRule: {
      type: "reduce",
      value: 10,
      method: "percent"
    },
    inventoryLocations: [
      { name: "\u7F8E\u56FD\u4ED3", quantity: 12 },
      { name: "\u52A0\u5DDE\u4ED3", quantity: 3 }
    ]
  },
  {
    sku: "SKU002",
    productName: "\u667A\u80FD\u624B\u8868",
    channelSku: "AMZ-SKU002",
    channel: "amazon",
    price: 100.01,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/smartwatch.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 1728e5,
    // 2天前
    lastSyncTime: (/* @__PURE__ */ new Date()).getTime() - 864e5,
    // 1天前
    customerName: "\u5BA2\u6237A",
    stock: 18,
    wmsStock: 22,
    lastSyncStock: 20,
    store: "US Store",
    masterSku: "MS-002",
    masterProductName: "Master \u667A\u80FD\u624B\u8868",
    warehouseStock: {
      US: 12,
      UK: 10
    },
    syncRule: {
      type: "reduce",
      value: 50,
      method: "fixed"
    },
    inventoryLocations: [
      { name: "\u82F1\u56FD\u4ED3", quantity: 14 },
      { name: "\u7F8E\u56FD\u4ED3", quantity: 8 }
    ]
  },
  {
    sku: "SKU003",
    productName: "\u8D85\u8584\u7B14\u8BB0\u672C\u7535\u8111",
    channelSku: "SHF-SKU003",
    channel: "shopify",
    price: 499.99,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/laptop.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 864e5,
    // 1天前
    lastSyncTime: (/* @__PURE__ */ new Date()).getTime() - 432e5,
    // 12小时前
    customerName: "\u5BA2\u6237B",
    stock: 5,
    wmsStock: 7,
    lastSyncStock: 6,
    store: "Main Store",
    syncRule: {
      type: "percent",
      value: 90
    },
    inventoryLocations: [
      { name: "\u4E3B\u4ED3\u5E93", quantity: 7 }
    ]
  },
  {
    sku: "SKU004",
    productName: "\u9632\u6C34\u8FD0\u52A8\u76F8\u673A",
    channelSku: "WMT-SKU004",
    channel: "walmart",
    price: 53.33,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/camera.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 1728e5,
    // 2天前
    lastSyncTime: (/* @__PURE__ */ new Date()).getTime() - 1296e5,
    // 1.5天前
    customerName: "\u5BA2\u6237C",
    stock: 12,
    wmsStock: 18,
    lastSyncStock: 16,
    store: "US Store",
    syncRule: {
      type: "percent",
      value: 90
    },
    inventoryLocations: [
      { name: "\u5FB7\u5DDE\u4ED3", quantity: 10 },
      { name: "\u7EBD\u7EA6\u4ED3", quantity: 8 }
    ]
  },
  {
    sku: "SKU005",
    productName: "\u4FBF\u643A\u5F0F\u5145\u7535\u5B9D",
    channelSku: "AMZ-SKU005",
    channel: "amazon",
    price: 39.99,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/powerbank.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 2592e5,
    // 3天前
    customerName: "\u5BA2\u6237A",
    stock: 25,
    wmsStock: 38,
    store: "US Store",
    inventoryLocations: [
      { name: "\u4E2D\u5FC3\u4ED3\u5E93", quantity: 38 }
    ]
  },
  // 新增商品数据
  {
    sku: "SKU010",
    productName: "\u6E38\u620F\u7B14\u8BB0\u672C\u7535\u8111",
    channelSku: "AMZ-SKU010",
    channel: "amazon",
    price: 1299.99,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/gaming-laptop.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 864e5,
    // 1天前
    customerName: "\u5BA2\u6237A",
    stock: 8,
    wmsStock: 10,
    store: "US Store",
    inventoryLocations: [
      { name: "\u52A0\u5DDE\u914D\u9001\u4E2D\u5FC3", quantity: 10 }
    ]
  },
  {
    sku: "SKU011",
    productName: "\u667A\u80FD\u97F3\u7BB1",
    channelSku: "WMT-SKU011",
    channel: "walmart",
    price: 124.99,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/smart-speaker.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 1728e5,
    // 2天前
    customerName: "\u5BA2\u6237C",
    stock: 15,
    wmsStock: 20,
    store: "US Store",
    inventoryLocations: [
      { name: "\u5357\u65B9\u4ED3", quantity: 12 },
      { name: "\u5317\u65B9\u4ED3", quantity: 8 }
    ]
  },
  {
    sku: "SKU012",
    productName: "\u667A\u80FD\u706F\u6CE1\u5957\u88C5",
    channelSku: "EBY-SKU012",
    channel: "ebay",
    price: 19.99,
    status: "\u4E0B\u67B6",
    imageUrl: "https://example.com/images/smart-bulb.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 2592e5,
    // 3天前
    customerName: "\u5BA2\u6237D",
    stock: 2,
    wmsStock: 5,
    store: "EU Store"
  },
  {
    sku: "SKU013",
    productName: "\u65E0\u7EBF\u8033\u673A",
    channelSku: "SHF-SKU013",
    channel: "shopify",
    price: 199.99,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/wireless-earphones.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 3456e5,
    // 4天前
    customerName: "\u5BA2\u6237B",
    stock: 20,
    wmsStock: 25,
    store: "Main Store"
  },
  {
    sku: "SKU014",
    productName: "\u624B\u673A\u4FDD\u62A4\u58F3",
    channelSku: "AMZ-SKU014",
    channel: "amazon",
    price: 19.99,
    status: "\u7F3A\u8D27",
    imageUrl: "https://example.com/images/phone-case.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 432e6,
    // 5天前
    customerName: "\u5BA2\u6237A",
    stock: 0,
    wmsStock: 6,
    store: "EU Store"
  },
  {
    sku: "SKU015",
    productName: "\u624B\u673A\u652F\u67B6",
    channelSku: "WMT-SKU015",
    channel: "walmart",
    price: 29.99,
    status: "\u5728\u552E",
    imageUrl: "https://example.com/images/phone-stand.jpg",
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 5184e5,
    // 6天前
    customerName: "\u5BA2\u6237C",
    stock: 32,
    wmsStock: 40,
    store: "US Store"
  },
  {
    sku: "SKU010",
    productName: "\u6E38\u620F\u7B14\u8BB0\u672C\u7535\u8111",
    channelSku: "AMZ-SKU010",
    channel: "amazon",
    store: "EU Store",
    available: 2,
    reserved: 0,
    total: 2,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 252e5,
    // 7小时前
    customerName: "\u5BA2\u6237A",
    stock: 2,
    wmsStock: 4,
    price: 1299.99,
    status: "\u5728\u552E"
  }
];
var inventoryList = [
  {
    sku: "SKU001",
    productName: "\u9AD8\u54C1\u8D28\u65E0\u7EBF\u84DD\u7259\u8033\u673A",
    channelSku: "AMZ-SKU001",
    channel: "amazon",
    store: "US Store",
    available: 25,
    reserved: 5,
    total: 30,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 36e5
    // 1小时前
  },
  {
    sku: "SKU001",
    productName: "\u9AD8\u54C1\u8D28\u65E0\u7EBF\u84DD\u7259\u8033\u673A",
    channelSku: "SHF-SKU001",
    channel: "shopify",
    store: "Main Store",
    available: 8,
    reserved: 2,
    total: 10,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 72e5
    // 2小时前
  },
  {
    sku: "SKU001",
    productName: "\u9AD8\u54C1\u8D28\u65E0\u7EBF\u84DD\u7259\u8033\u673A",
    channelSku: "WMT-SKU001",
    channel: "walmart",
    store: "US Store",
    available: 0,
    reserved: 0,
    total: 0,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 108e5
    // 3小时前
  },
  {
    sku: "SKU002",
    productName: "\u667A\u80FD\u624B\u8868",
    channelSku: "AMZ-SKU002",
    channel: "amazon",
    store: "US Store",
    available: 15,
    reserved: 3,
    total: 18,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 36e5
    // 1小时前
  },
  {
    sku: "SKU003",
    productName: "\u8D85\u8584\u7B14\u8BB0\u672C\u7535\u8111",
    channelSku: "SHF-SKU003",
    channel: "shopify",
    store: "Main Store",
    available: 5,
    reserved: 1,
    total: 6,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 72e5
    // 2小时前
  },
  {
    sku: "SKU004",
    productName: "\u9632\u6C34\u8FD0\u52A8\u76F8\u673A",
    channelSku: "WMT-SKU004",
    channel: "walmart",
    store: "US Store",
    available: 12,
    reserved: 2,
    total: 14,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 108e5
    // 3小时前
  },
  {
    sku: "SKU005",
    productName: "\u4FBF\u643A\u5F0F\u5145\u7535\u5B9D",
    channelSku: "AMZ-SKU005",
    channel: "amazon",
    store: "US Store",
    available: 30,
    reserved: 7,
    total: 37,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 36e5
    // 1小时前
  },
  // 新增库存数据
  {
    sku: "SKU010",
    productName: "\u6E38\u620F\u7B14\u8BB0\u672C\u7535\u8111",
    channelSku: "AMZ-SKU010",
    channel: "amazon",
    store: "US Store",
    available: 3,
    reserved: 1,
    total: 4,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 36e5
    // 1小时前
  },
  {
    sku: "SKU011",
    productName: "\u667A\u80FD\u97F3\u7BB1",
    channelSku: "WMT-SKU011",
    channel: "walmart",
    store: "US Store",
    available: 8,
    reserved: 2,
    total: 10,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 72e5
    // 2小时前
  },
  {
    sku: "SKU012",
    productName: "\u667A\u80FD\u706F\u6CE1\u5957\u88C5",
    channelSku: "EBY-SKU012",
    channel: "ebay",
    store: "Main Store",
    available: 0,
    reserved: 0,
    total: 0,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 108e5
    // 3小时前
  },
  {
    sku: "SKU013",
    productName: "\u65E0\u7EBF\u8033\u673A",
    channelSku: "SHF-SKU013",
    channel: "shopify",
    store: "Main Store",
    available: 12,
    reserved: 3,
    total: 15,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 144e5
    // 4小时前
  },
  {
    sku: "SKU014",
    productName: "\u624B\u673A\u4FDD\u62A4\u58F3",
    channelSku: "AMZ-SKU014",
    channel: "amazon",
    store: "EU Store",
    available: 0,
    reserved: 0,
    total: 0,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 18e6
    // 5小时前
  },
  {
    sku: "SKU015",
    productName: "\u624B\u673A\u652F\u67B6",
    channelSku: "WMT-SKU015",
    channel: "walmart",
    store: "EU Store",
    available: 25,
    reserved: 5,
    total: 30,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 216e5
    // 6小时前
  },
  {
    sku: "SKU010",
    productName: "\u6E38\u620F\u7B14\u8BB0\u672C\u7535\u8111",
    channelSku: "AMZ-SKU010",
    channel: "amazon",
    store: "EU Store",
    available: 2,
    reserved: 0,
    total: 2,
    updateTime: (/* @__PURE__ */ new Date()).getTime() - 252e5,
    // 7小时前
    customerName: "\u5BA2\u6237A",
    stock: 2,
    wmsStock: 4,
    price: 1299.99,
    status: "\u5728\u552E"
  }
];
function queryOrders(params) {
  let results = [...orderList];
  if (params.customer && params.channel) {
    results = results.filter((item) => item.channel === params.channel);
  }
  if (params.channelOrderId) {
    results = results.filter((item) => item.channelOrderId.includes(params.channelOrderId));
  }
  if (params.systemOrderId) {
    results = results.filter((item) => item.systemOrderId.includes(params.systemOrderId));
  }
  if (params.orderStatus) {
    results = results.filter((item) => item.status === params.orderStatus);
  }
  if (params.customerName) {
    results = results.filter((item) => item.customerName.includes(params.customerName));
  }
  if (params.startDate && params.endDate) {
    const startTimestamp = new Date(params.startDate).getTime();
    const endTimestamp = new Date(params.endDate).getTime() + 864e5;
    results = results.filter((item) => {
      return item.createTime >= startTimestamp && item.createTime <= endTimestamp;
    });
  }
  const total = results.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const data = results.slice(startIndex, endIndex);
  return {
    data,
    total
  };
}
function querySystemOrders(channelOrderId) {
  const order = orderList.find((o) => o.channelOrderId === channelOrderId);
  if (!order)
    return [];
  return systemOrderList.filter((so) => so.systemOrderId === order.systemOrderId);
}
function queryProducts(params) {
  let results = [...productList];
  if (params.customer && params.channel) {
    results = results.filter((item) => item.channel === params.channel);
  }
  if (params.productName) {
    results = results.filter((item) => item.productName.includes(params.productName));
  }
  if (params.sku) {
    results = results.filter((item) => item.sku.includes(params.sku) || item.channelSku.includes(params.sku));
  }
  if (params.productStatus) {
    results = results.filter((item) => item.status === params.productStatus);
  }
  if (params.minPrice !== void 0) {
    results = results.filter((item) => item.price >= params.minPrice);
  }
  if (params.maxPrice !== void 0) {
    results = results.filter((item) => item.price <= params.maxPrice);
  }
  const total = results.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const data = results.slice(startIndex, endIndex);
  return {
    data,
    total
  };
}
function queryInventory(params) {
  let results = [...inventoryList];
  if (params.customer && params.channel) {
    results = results.filter((item) => item.channel === params.channel);
  }
  if (params.productName) {
    results = results.filter((item) => item.productName.includes(params.productName));
  }
  if (params.sku) {
    results = results.filter((item) => item.sku.includes(params.sku) || item.channelSku.includes(params.sku));
  }
  if (params.store) {
    results = results.filter((item) => item.store.includes(params.store));
  }
  if (params.inventoryStatus) {
    switch (params.inventoryStatus) {
      case "\u6709\u5E93\u5B58":
        results = results.filter((item) => item.available > 10);
        break;
      case "\u4F4E\u5E93\u5B58":
        results = results.filter((item) => item.available > 0 && item.available <= 10);
        break;
      case "\u65E0\u5E93\u5B58":
        results = results.filter((item) => item.available <= 0);
        break;
    }
  }
  const total = results.length;
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const data = results.slice(startIndex, endIndex);
  return {
    data,
    total
  };
}

// src/views/purchase/tracking/types.ts
var PurchaseOrderStatus = /* @__PURE__ */ ((PurchaseOrderStatus2) => {
  PurchaseOrderStatus2["PO_CREATED"] = "PO_CREATED";
  PurchaseOrderStatus2["PO_CONFIRMED"] = "PO_CONFIRMED";
  PurchaseOrderStatus2["IN_PRODUCTION"] = "IN_PRODUCTION";
  PurchaseOrderStatus2["EXPORT_CUSTOMS"] = "EXPORT_CUSTOMS";
  PurchaseOrderStatus2["IMPORT_DELIVERY"] = "IMPORT_DELIVERY";
  PurchaseOrderStatus2["RECEIVED"] = "RECEIVED";
  PurchaseOrderStatus2["INVOICED"] = "INVOICED";
  return PurchaseOrderStatus2;
})(PurchaseOrderStatus || {});

// src/mock/purchaseTracking.ts
var mockTrackingList = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    supplier: "Supplier A",
    createdAt: "2024-01-15T08:00:00Z",
    expectedDeliveryDate: "2024-02-15T08:00:00Z",
    currentStatus: "IN_PRODUCTION" /* IN_PRODUCTION */,
    stages: []
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    supplier: "Supplier B",
    createdAt: "2024-01-20T08:00:00Z",
    expectedDeliveryDate: "2024-02-20T08:00:00Z",
    currentStatus: "PO_CONFIRMED" /* PO_CONFIRMED */,
    stages: []
  }
];
var generateMockStages = (currentStatus) => {
  const statuses = Object.values(PurchaseOrderStatus);
  const currentIndex = statuses.indexOf(currentStatus);
  return statuses.map((status, index) => ({
    status,
    title: status.split("_").map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" "),
    subProcesses: Array(4).fill(null).map((_, i) => ({
      name: `Process ${i + 1}`,
      status: index < currentIndex ? "completed" : index === currentIndex ? i === 0 ? "completed" : i === 1 ? "in_progress" : "pending" : "pending",
      timestamp: index < currentIndex ? new Date(Date.now() - index * 24 * 60 * 60 * 1e3).toISOString() : void 0,
      operator: index < currentIndex ? "John Doe" : void 0,
      fields: {}
    })),
    completed: index < currentIndex,
    current: index === currentIndex
  }));
};
var mockTrackingDetail = (id) => {
  const item = mockTrackingList.find((item2) => item2.id === id);
  if (!item)
    throw new Error("Not found");
  return {
    ...item,
    stages: generateMockStages(item.currentStatus)
  };
};

// src/mock/productData.ts
var mockProducts = [
  {
    id: "1",
    sku: "SKU001",
    name: "Test Product 1",
    type: "Normal",
    status: "Active",
    vendor: "Vendor A",
    brand: "Brand A",
    manufacturer: "Manufacturer A",
    cost: 100,
    regularPrice: 199.99,
    salePrice: 159.99,
    quantity: 100,
    doNotTrackInventory: false,
    categories: ["Electronics", "Mobile Accessories"],
    tags: ["Hot", "New"],
    integration: "Shopify",
    weight: 0.5,
    weightUnit: "kg",
    dimensions: {
      length: 10,
      width: 5,
      height: 2,
      unit: "cm"
    },
    description: "This is a detailed description of the test product",
    shortDescription: "Test product brief",
    images: [
      {
        url: "https://example.com/image1.jpg",
        alt: "Product main image",
        isDefault: true
      }
    ],
    created: "2024-03-20T10:00:00Z",
    updated: "2024-03-20T15:30:00Z",
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
        batchNumber: "",
        productionDate: "",
        expiryDate: ""
      },
      qualityControl: {
        inspectionStandards: [],
        inspectionReports: [],
        qualityMetrics: {},
        certifications: []
      },
      locationManagement: {
        primaryLocation: "",
        secondaryLocations: [],
        movementHistory: []
      },
      packagingSpecifications: {
        primaryPackaging: {
          type: "",
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm"
          },
          weight: {
            value: 0,
            unit: "kg"
          }
        },
        shippingPackaging: {
          type: "",
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm"
          },
          weight: {
            value: 0,
            unit: "kg"
          }
        }
      }
    },
    complianceSettings: {
      certifications: [],
      restrictions: [],
      marketAccess: {},
      customs: {
        hsCode: "",
        declaredValue: 0,
        dutyRate: 0,
        vatRate: 0
      },
      systemMapping: {
        type: "manual",
        direction: "import",
        status: "pending"
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
        type: "manual",
        direction: "import",
        status: "pending"
      },
      channelMappings: [],
      attributeMappings: [],
      versionControl: {
        currentVersion: "1.0.0",
        previousVersions: [],
        branchingStrategy: "main",
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
        lastMeasured: (/* @__PURE__ */ new Date()).toISOString()
      }
    }
  },
  {
    id: "2",
    sku: "SKU002",
    name: "Test Product 2",
    type: "Sample",
    status: "Draft",
    vendor: "Vendor B",
    brand: "Brand B",
    manufacturer: "Manufacturer B",
    cost: 50,
    regularPrice: 99.99,
    salePrice: 79.99,
    quantity: 50,
    doNotTrackInventory: true,
    categories: ["Clothing", "Accessories"],
    tags: ["Sample", "Limited"],
    integration: "Amazon",
    weight: 0.3,
    weightUnit: "kg",
    dimensions: {
      length: 20,
      width: 15,
      height: 5,
      unit: "cm"
    },
    description: "This is a detailed description of the sample product",
    shortDescription: "Sample product brief",
    images: [
      {
        url: "https://example.com/image2.jpg",
        alt: "Sample product main image",
        isDefault: true
      }
    ],
    created: "2024-03-19T08:00:00Z",
    updated: "2024-03-19T16:45:00Z",
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
        batchNumber: "",
        productionDate: "",
        expiryDate: ""
      },
      qualityControl: {
        inspectionStandards: [],
        inspectionReports: [],
        qualityMetrics: {},
        certifications: []
      },
      locationManagement: {
        primaryLocation: "",
        secondaryLocations: [],
        movementHistory: []
      },
      packagingSpecifications: {
        primaryPackaging: {
          type: "",
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm"
          },
          weight: {
            value: 0,
            unit: "kg"
          }
        },
        shippingPackaging: {
          type: "",
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm"
          },
          weight: {
            value: 0,
            unit: "kg"
          }
        }
      }
    },
    complianceSettings: {
      certifications: [],
      restrictions: [],
      marketAccess: {},
      customs: {
        hsCode: "",
        declaredValue: 0,
        dutyRate: 0,
        vatRate: 0
      },
      systemMapping: {
        type: "manual",
        direction: "import",
        status: "pending"
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
        type: "manual",
        direction: "import",
        status: "pending"
      },
      channelMappings: [],
      attributeMappings: [],
      versionControl: {
        currentVersion: "1.0.0",
        previousVersions: [],
        branchingStrategy: "main",
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
        lastMeasured: (/* @__PURE__ */ new Date()).toISOString()
      }
    }
  },
  {
    id: "3",
    sku: "SKU003",
    name: "Test Product 3",
    type: "Bundle",
    status: "Active",
    vendor: "Vendor C",
    brand: "Brand C",
    manufacturer: "Manufacturer C",
    cost: 200,
    regularPrice: 399.99,
    salePrice: 299.99,
    quantity: 30,
    doNotTrackInventory: false,
    categories: ["Bundles", "Gifts"],
    tags: ["Promotion", "Bundle"],
    integration: "eBay",
    weight: 1.2,
    weightUnit: "kg",
    dimensions: {
      length: 30,
      width: 20,
      height: 15,
      unit: "cm"
    },
    description: "This is a detailed description of the bundle product",
    shortDescription: "Bundle product brief",
    images: [
      {
        url: "https://example.com/image3.jpg",
        alt: "Bundle product main image",
        isDefault: true
      }
    ],
    created: "2024-03-18T09:30:00Z",
    updated: "2024-03-18T14:20:00Z",
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
        batchNumber: "",
        productionDate: "",
        expiryDate: ""
      },
      qualityControl: {
        inspectionStandards: [],
        inspectionReports: [],
        qualityMetrics: {},
        certifications: []
      },
      locationManagement: {
        primaryLocation: "",
        secondaryLocations: [],
        movementHistory: []
      },
      packagingSpecifications: {
        primaryPackaging: {
          type: "",
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm"
          },
          weight: {
            value: 0,
            unit: "kg"
          }
        },
        shippingPackaging: {
          type: "",
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm"
          },
          weight: {
            value: 0,
            unit: "kg"
          }
        }
      }
    },
    complianceSettings: {
      certifications: [],
      restrictions: [],
      marketAccess: {},
      customs: {
        hsCode: "",
        declaredValue: 0,
        dutyRate: 0,
        vatRate: 0
      },
      systemMapping: {
        type: "manual",
        direction: "import",
        status: "pending"
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
        type: "manual",
        direction: "import",
        status: "pending"
      },
      channelMappings: [],
      attributeMappings: [],
      versionControl: {
        currentVersion: "1.0.0",
        previousVersions: [],
        branchingStrategy: "main",
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
        lastMeasured: (/* @__PURE__ */ new Date()).toISOString()
      }
    },
    bundleSettings: {
      bundleType: "FIXED",
      pricingStrategy: "DISCOUNT",
      inventoryStrategy: "COMPONENT",
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
    id: "4",
    sku: "SKU004",
    name: "Test Product 4",
    type: "Virtual",
    status: "Out_Of_Stock",
    vendor: "Vendor D",
    brand: "Brand D",
    manufacturer: "Manufacturer D",
    cost: 10,
    regularPrice: 29.99,
    salePrice: 19.99,
    quantity: 0,
    doNotTrackInventory: true,
    categories: ["Digital Products", "Software"],
    tags: ["Virtual", "Download"],
    integration: "Shopify",
    weight: 0,
    weightUnit: "kg",
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: "cm"
    },
    description: "This is a detailed description of the virtual product",
    shortDescription: "Virtual product brief",
    images: [
      {
        url: "https://example.com/image4.jpg",
        alt: "Virtual product main image",
        isDefault: true
      }
    ],
    created: "2024-03-17T11:20:00Z",
    updated: "2024-03-17T18:15:00Z",
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
        batchNumber: "",
        productionDate: "",
        expiryDate: ""
      },
      qualityControl: {
        inspectionStandards: [],
        inspectionReports: [],
        qualityMetrics: {},
        certifications: []
      },
      locationManagement: {
        primaryLocation: "",
        secondaryLocations: [],
        movementHistory: []
      },
      packagingSpecifications: {
        primaryPackaging: {
          type: "",
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm"
          },
          weight: {
            value: 0,
            unit: "kg"
          }
        },
        shippingPackaging: {
          type: "",
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm"
          },
          weight: {
            value: 0,
            unit: "kg"
          }
        }
      }
    },
    complianceSettings: {
      certifications: [],
      restrictions: [],
      marketAccess: {},
      customs: {
        hsCode: "",
        declaredValue: 0,
        dutyRate: 0,
        vatRate: 0
      },
      systemMapping: {
        type: "manual",
        direction: "import",
        status: "pending"
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
        type: "manual",
        direction: "import",
        status: "pending"
      },
      channelMappings: [],
      attributeMappings: [],
      versionControl: {
        currentVersion: "1.0.0",
        previousVersions: [],
        branchingStrategy: "main",
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
        lastMeasured: (/* @__PURE__ */ new Date()).toISOString()
      }
    }
  }
];
var getMockProducts = (params) => {
  let filteredProducts = [...mockProducts];
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) => (product.name?.toLowerCase().includes(searchLower) ?? false) || (product.sku?.toLowerCase().includes(searchLower) ?? false) || (product.vendor?.toLowerCase().includes(searchLower) ?? false)
    );
  }
  if (params.type) {
    filteredProducts = filteredProducts.filter(
      (product) => product.type === params.type
    );
  }
  if (params.integration) {
    filteredProducts = filteredProducts.filter(
      (product) => product.integration === params.integration
    );
  }
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedProducts = filteredProducts.slice(start, end);
  return {
    data: paginatedProducts,
    total: filteredProducts.length
  };
};
var mockDeleteProduct = async (id) => {
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index > -1) {
    mockProducts.splice(index, 1);
    return true;
  }
  throw new Error("Product not found");
};

// src/mock/safetyStockData.ts
var mockChannels = [
  {
    id: "CH001",
    name: "Amazon US",
    type: "marketplace",
    status: "active"
  },
  {
    id: "CH002",
    name: "eBay US",
    type: "marketplace",
    status: "active"
  },
  {
    id: "CH003",
    name: "Shopify Store",
    type: "ecommerce",
    status: "active"
  },
  {
    id: "CH004",
    name: "Walmart",
    type: "marketplace",
    status: "active"
  },
  {
    id: "CH005",
    name: "Target Plus",
    type: "marketplace",
    status: "inactive"
  }
];
var mockStores = [
  {
    id: "ST001",
    name: "Main Amazon Store",
    channelId: "CH001",
    channelName: "Amazon US",
    status: "active"
  },
  {
    id: "ST002",
    name: "Brand Store Amazon",
    channelId: "CH001",
    channelName: "Amazon US",
    status: "active"
  },
  {
    id: "ST003",
    name: "eBay Official Store",
    channelId: "CH002",
    channelName: "eBay US",
    status: "active"
  },
  {
    id: "ST004",
    name: "Direct Shopify",
    channelId: "CH003",
    channelName: "Shopify Store",
    status: "active"
  },
  {
    id: "ST005",
    name: "Walmart Supplier",
    channelId: "CH004",
    channelName: "Walmart",
    status: "active"
  }
];
var mockWarehouses = [
  {
    id: "WH001",
    name: "Los Angeles Warehouse",
    code: "LAX-001",
    address: "1234 Industrial Blvd, Los Angeles, CA 90021",
    status: "active"
  },
  {
    id: "WH002",
    name: "New York Warehouse",
    code: "NYC-001",
    address: "5678 Commerce St, Brooklyn, NY 11232",
    status: "active"
  },
  {
    id: "WH003",
    name: "Chicago Distribution Center",
    code: "CHI-001",
    address: "9012 Logistics Ave, Chicago, IL 60634",
    status: "active"
  },
  {
    id: "WH004",
    name: "Dallas Fulfillment Center",
    code: "DAL-001",
    address: "3456 Shipping Rd, Dallas, TX 75237",
    status: "active"
  }
];
var mockSkus = [
  {
    sku: "SKU-001-BLK-M",
    productId: "PROD001",
    productName: "Classic T-Shirt Black Medium",
    category: "Apparel",
    brand: "BasicWear",
    status: "active"
  },
  {
    sku: "SKU-001-WHT-L",
    productId: "PROD001",
    productName: "Classic T-Shirt White Large",
    category: "Apparel",
    brand: "BasicWear",
    status: "active"
  },
  {
    sku: "SKU-002-RED-S",
    productId: "PROD002",
    productName: "Premium Hoodie Red Small",
    category: "Apparel",
    brand: "PremiumLine",
    status: "active"
  },
  {
    sku: "SKU-003-BLU-XL",
    productId: "PROD003",
    productName: "Sports Jacket Blue Extra Large",
    category: "Sports",
    brand: "ActiveWear",
    status: "active"
  },
  {
    sku: "SKU-004-GRN-M",
    productId: "PROD004",
    productName: "Casual Pants Green Medium",
    category: "Apparel",
    brand: "ComfortFit",
    status: "active"
  }
];
var mockSafetyStockConfigs = [
  // 全局默认配置
  {
    id: "SSC-GLOBAL-001",
    level: "global" /* GLOBAL */,
    status: "active" /* ACTIVE */,
    minStockQuantity: 100,
    minStockType: "quantity",
    alertType: ["low_stock" /* LOW_STOCK */, "out_of_stock" /* OUT_OF_STOCK */],
    alertThreshold: 20,
    maxStockQuantity: 1e3,
    maxStockType: "quantity",
    disableWmsSync: false,
    disableThirdPartySync: false,
    description: "Global default safety stock configuration",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  // 渠道级别配置
  {
    id: "SSC-CHANNEL-001",
    level: "channel" /* CHANNEL */,
    status: "active" /* ACTIVE */,
    channelId: "CH001",
    channelName: "Amazon US",
    channelType: "marketplace",
    minStockQuantity: 200,
    minStockType: "quantity",
    alertType: ["low_stock" /* LOW_STOCK */],
    alertThreshold: 15,
    maxStockQuantity: 2e3,
    maxStockType: "quantity",
    disableWmsSync: false,
    disableThirdPartySync: true,
    priority: 1,
    description: "Amazon US channel specific configuration",
    createdAt: "2024-01-02T09:00:00Z",
    updatedAt: "2024-01-20T14:20:00Z",
    createdBy: "channel_manager",
    updatedBy: "channel_manager"
  },
  {
    id: "SSC-CHANNEL-002",
    level: "channel" /* CHANNEL */,
    status: "active" /* ACTIVE */,
    channelId: "CH002",
    channelName: "eBay US",
    channelType: "marketplace",
    minStockQuantity: 15,
    minStockType: "percentage",
    alertType: ["low_stock" /* LOW_STOCK */, "out_of_stock" /* OUT_OF_STOCK */],
    alertThreshold: 25,
    maxStockQuantity: 80,
    maxStockType: "percentage",
    disableWmsSync: true,
    disableThirdPartySync: false,
    priority: 2,
    description: "eBay US channel configuration with percentage-based stock levels",
    createdAt: "2024-01-03T11:30:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    createdBy: "channel_manager",
    updatedBy: "inventory_manager"
  },
  // 店铺级别配置
  {
    id: "SSC-STORE-001",
    level: "store" /* STORE */,
    status: "active" /* ACTIVE */,
    storeId: "ST001",
    storeName: "Main Amazon Store",
    channelId: "CH001",
    channelName: "Amazon US",
    warehouseId: "WH001",
    warehouseName: "Los Angeles Warehouse",
    minStockQuantity: 250,
    alertType: ["low_stock" /* LOW_STOCK */],
    alertThreshold: 10,
    maxStockQuantity: 2500,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 1,
    description: "\u4E3B\u8981Amazon\u5E97\u94FA\u914D\u7F6E",
    createdAt: "2024-01-04T13:15:00Z",
    updatedAt: "2024-01-22T09:30:00Z",
    createdBy: "store_manager",
    updatedBy: "store_manager"
  },
  {
    id: "SSC-STORE-002",
    level: "store" /* STORE */,
    status: "inactive" /* INACTIVE */,
    storeId: "ST003",
    storeName: "eBay Official Store",
    channelId: "CH002",
    channelName: "eBay US",
    warehouseId: "WH002",
    warehouseName: "New York Warehouse",
    minStockQuantity: 100,
    alertType: ["out_of_stock" /* OUT_OF_STOCK */],
    alertThreshold: 30,
    maxStockQuantity: 1200,
    disableWmsSync: true,
    disableThirdPartySync: true,
    priority: 3,
    description: "eBay\u5B98\u65B9\u5E97\u94FA\u914D\u7F6E\uFF08\u5DF2\u505C\u7528\uFF09",
    createdAt: "2024-01-05T15:45:00Z",
    updatedAt: "2024-01-19T12:15:00Z",
    createdBy: "store_manager",
    updatedBy: "inventory_manager"
  },
  // SKU级别配置
  {
    id: "SSC-SKU-001",
    level: "sku" /* SKU */,
    status: "active" /* ACTIVE */,
    sku: "SKU-001-BLK-M",
    productId: "PROD001",
    productName: "Classic T-Shirt Black Medium",
    storeId: "ST001",
    storeName: "Main Amazon Store",
    channelId: "CH001",
    channelName: "Amazon US",
    warehouseId: "WH001",
    warehouseName: "Los Angeles Warehouse",
    category: "Apparel",
    brand: "BasicWear",
    minStockQuantity: 500,
    alertType: ["low_stock" /* LOW_STOCK */],
    alertThreshold: 5,
    maxStockQuantity: 3e3,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 1,
    description: "\u70ED\u9500T\u6064\u7279\u6B8A\u914D\u7F6E",
    createdAt: "2024-01-06T10:20:00Z",
    updatedAt: "2024-01-25T08:45:00Z",
    createdBy: "product_manager",
    updatedBy: "inventory_specialist"
  },
  {
    id: "SSC-SKU-002",
    level: "sku" /* SKU */,
    status: "active" /* ACTIVE */,
    sku: "SKU-002-RED-S",
    productId: "PROD002",
    productName: "Premium Hoodie Red Small",
    storeId: "ST002",
    storeName: "Brand Store Amazon",
    channelId: "CH001",
    channelName: "Amazon US",
    warehouseId: "WH001",
    warehouseName: "Los Angeles Warehouse",
    category: "Apparel",
    brand: "PremiumLine",
    minStockQuantity: 50,
    alertType: ["low_stock" /* LOW_STOCK */, "out_of_stock" /* OUT_OF_STOCK */],
    alertThreshold: 20,
    maxStockQuantity: 500,
    disableWmsSync: true,
    disableThirdPartySync: false,
    priority: 2,
    description: "\u9AD8\u7AEF\u536B\u8863\u9650\u91CF\u6B3E\u914D\u7F6E",
    createdAt: "2024-01-07T14:30:00Z",
    updatedAt: "2024-01-23T11:20:00Z",
    createdBy: "product_manager",
    updatedBy: "product_manager"
  }
];
var mockFlexibleSafetyStockConfigs = [
  {
    id: "FSC-001",
    name: "Amazon\u5E73\u53F0\u70ED\u9500\u5546\u54C1\u914D\u7F6E",
    status: "active" /* ACTIVE */,
    channelScope: "specific" /* SPECIFIC */,
    channelIds: ["CH001"],
    channelNames: ["Amazon US"],
    storeScope: "all" /* ALL */,
    specialSkus: ["SKU-001-BLK-M", "SKU-001-WHT-L"],
    specialSkuConfigs: {
      "SKU-001-BLK-M": {
        minStockQuantity: 800,
        maxStockQuantity: 3e3,
        alertType: ["low_stock" /* LOW_STOCK */],
        alertThreshold: 5,
        disableWmsSync: false,
        disableThirdPartySync: false
      },
      "SKU-001-WHT-L": {
        minStockQuantity: 600,
        maxStockQuantity: 2500,
        alertType: ["low_stock" /* LOW_STOCK */, "out_of_stock" /* OUT_OF_STOCK */],
        alertThreshold: 10,
        disableWmsSync: false,
        disableThirdPartySync: true
      }
    },
    minStockQuantity: 200,
    maxStockQuantity: 1500,
    alertType: ["low_stock" /* LOW_STOCK */],
    alertThreshold: 15,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 1,
    description: "Amazon\u5E73\u53F0\u70ED\u9500\u5546\u54C1\u4E13\u7528\u5B89\u5168\u5E93\u5B58\u914D\u7F6E\uFF0C\u5305\u542B\u7279\u6B8ASKU\u8BBE\u7F6E",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-25T14:30:00Z",
    createdBy: "admin",
    updatedBy: "inventory_manager"
  },
  {
    id: "FSC-002",
    name: "\u8DE8\u5E73\u53F0\u901A\u7528\u914D\u7F6E",
    status: "active" /* ACTIVE */,
    channelScope: "all" /* ALL */,
    storeScope: "all" /* ALL */,
    specialSkus: ["SKU-003-BLU-XL"],
    specialSkuConfigs: {
      "SKU-003-BLU-XL": {
        minStockQuantity: 50,
        maxStockQuantity: 300,
        alertType: ["out_of_stock" /* OUT_OF_STOCK */],
        alertThreshold: 30,
        disableWmsSync: true,
        disableThirdPartySync: true
      }
    },
    minStockQuantity: 150,
    maxStockQuantity: 800,
    alertType: ["low_stock" /* LOW_STOCK */, "out_of_stock" /* OUT_OF_STOCK */],
    alertThreshold: 20,
    disableWmsSync: false,
    disableThirdPartySync: false,
    priority: 2,
    description: "\u9002\u7528\u4E8E\u6240\u6709\u6E20\u9053\u7684\u901A\u7528\u5B89\u5168\u5E93\u5B58\u914D\u7F6E",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T16:00:00Z",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    id: "FSC-003",
    name: "eBay\u6307\u5B9A\u5E97\u94FA\u914D\u7F6E",
    status: "active" /* ACTIVE */,
    channelScope: "specific" /* SPECIFIC */,
    channelIds: ["CH002"],
    channelNames: ["eBay US"],
    storeScope: "specific" /* SPECIFIC */,
    storeIds: ["ST003"],
    storeNames: ["eBay Official Store"],
    specialSkus: [],
    specialSkuConfigs: {},
    minStockQuantity: 80,
    maxStockQuantity: 500,
    alertType: ["low_stock" /* LOW_STOCK */],
    alertThreshold: 25,
    disableWmsSync: true,
    disableThirdPartySync: false,
    priority: 3,
    description: "eBay\u5B98\u65B9\u5E97\u94FA\u4E13\u7528\u914D\u7F6E\uFF0C\u7981\u7528WMS\u63A8\u9001",
    createdAt: "2024-01-18T09:30:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
    createdBy: "store_manager",
    updatedBy: "store_manager"
  }
];
var mockStockAlerts = [
  {
    id: "ALERT-001",
    configId: "SSC-SKU-001",
    level: "sku" /* SKU */,
    alertType: "low_stock" /* LOW_STOCK */,
    sku: "SKU-001-BLK-M",
    productName: "Classic T-Shirt Black Medium",
    currentStock: 480,
    safetyStock: 500,
    deficit: 20,
    // 当前库存480低于安全库存500，差值20
    storeId: "ST001",
    storeName: "Main Amazon Store",
    channelId: "CH001",
    channelName: "Amazon US",
    warehouseId: "WH001",
    warehouseName: "Los Angeles Warehouse",
    alertTime: "2024-01-25T15:30:00Z",
    status: "new"
  },
  {
    id: "ALERT-002",
    configId: "SSC-STORE-001",
    level: "store" /* STORE */,
    alertType: "out_of_stock" /* OUT_OF_STOCK */,
    sku: "SKU-003-BLU-XL",
    productName: "Sports Jacket Blue Extra Large",
    currentStock: 0,
    safetyStock: 250,
    deficit: 250,
    // 缺货，距离安全库存还差250
    storeId: "ST001",
    storeName: "Main Amazon Store",
    channelId: "CH001",
    channelName: "Amazon US",
    warehouseId: "WH001",
    warehouseName: "Los Angeles Warehouse",
    alertTime: "2024-01-24T09:15:00Z",
    status: "acknowledged",
    resolvedTime: "2024-01-24T10:30:00Z",
    resolvedBy: "inventory_manager",
    notes: "\u5DF2\u8054\u7CFB\u4F9B\u5E94\u5546\u7D27\u6025\u8865\u8D27"
  },
  {
    id: "ALERT-003",
    configId: "SSC-CHANNEL-001",
    level: "channel" /* CHANNEL */,
    alertType: "low_stock" /* LOW_STOCK */,
    sku: "SKU-004-GRN-M",
    productName: "Casual Pants Green Medium",
    currentStock: 180,
    safetyStock: 200,
    deficit: 20,
    // 当前库存180低于安全库存200，差值20
    storeId: "ST002",
    storeName: "Brand Store Amazon",
    channelId: "CH001",
    channelName: "Amazon US",
    warehouseId: "WH002",
    warehouseName: "New York Warehouse",
    alertTime: "2024-01-23T12:45:00Z",
    status: "resolved",
    resolvedTime: "2024-01-24T16:20:00Z",
    resolvedBy: "channel_manager",
    notes: "\u8865\u8D27\u5DF2\u5230\u4F4D\uFF0C\u5E93\u5B58\u6062\u590D\u6B63\u5E38"
  }
];
var mockSafetyStockStats = {
  totalConfigs: 8,
  activeConfigs: 6,
  inactiveConfigs: 2,
  configsByLevel: {
    ["global" /* GLOBAL */]: 1,
    ["channel" /* CHANNEL */]: 2,
    ["store" /* STORE */]: 2,
    ["sku" /* SKU */]: 3
  },
  alertsCount: {
    total: 15,
    new: 3,
    acknowledged: 5,
    resolved: 7
  },
  lowStockItems: 8,
  outOfStockItems: 2
};
var mockPresets = [
  {
    id: "PRESET-001",
    name: "\u5FEB\u9500\u54C1\u914D\u7F6E",
    description: "\u9002\u7528\u4E8E\u5FEB\u901F\u9500\u552E\u7684\u70ED\u95E8\u4EA7\u54C1",
    config: {
      minStockQuantity: 500,
      alertType: ["low_stock" /* LOW_STOCK */],
      alertThreshold: 10,
      maxStockQuantity: 2e3,
      disableWmsSync: false,
      disableThirdPartySync: false
    },
    isDefault: false,
    createdAt: "2024-01-10T08:00:00Z"
  },
  {
    id: "PRESET-002",
    name: "\u5B63\u8282\u6027\u5546\u54C1\u914D\u7F6E",
    description: "\u9002\u7528\u4E8E\u5B63\u8282\u6027\u6216\u8282\u65E5\u6027\u5546\u54C1",
    config: {
      minStockQuantity: 100,
      alertType: ["low_stock" /* LOW_STOCK */, "out_of_stock" /* OUT_OF_STOCK */],
      alertThreshold: 25,
      maxStockQuantity: 800,
      disableWmsSync: false,
      disableThirdPartySync: true
    },
    isDefault: false,
    createdAt: "2024-01-12T10:30:00Z"
  },
  {
    id: "PRESET-003",
    name: "\u9AD8\u4EF7\u503C\u4EA7\u54C1\u914D\u7F6E",
    description: "\u9002\u7528\u4E8E\u9AD8\u4EF7\u503C\u3001\u4F4E\u5468\u8F6C\u7684\u4EA7\u54C1",
    config: {
      minStockQuantity: 20,
      alertType: ["low_stock" /* LOW_STOCK */],
      alertThreshold: 30,
      maxStockQuantity: 200,
      disableWmsSync: true,
      disableThirdPartySync: true
    },
    isDefault: true,
    createdAt: "2024-01-08T14:15:00Z"
  }
];

// src/mock/index.ts
var SimpleMockAdapter = class {
  handlers = {};
  getHandlers = {};
  postHandlers = {};
  deleteHandlers = {};
  regexHandlers = [];
  delay;
  handleRequest(handler, config) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const [status, response] = handler(config);
        if (status >= 200 && status < 300) {
          resolve({
            data: response,
            status,
            statusText: "OK",
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              data: response,
              status,
              statusText: "ERROR",
              headers: {},
              config
            }
          });
        }
      }, this.delay);
    });
  }
  constructor(axiosInstance, options) {
    this.delay = options?.delayResponse || 0;
    axiosInstance.interceptors.request.use((config) => {
      const method = config.method?.toLowerCase();
      let handler;
      switch (method) {
        case "get":
          handler = this.getHandlers[config.url];
          break;
        case "post":
          handler = this.postHandlers[config.url];
          break;
        case "delete":
          handler = this.deleteHandlers[config.url];
          break;
      }
      if (handler) {
        return this.handleRequest(handler, config);
      }
      for (const { method: handlerMethod, regex, handler: regexHandler } of this.regexHandlers) {
        if (handlerMethod === method && regex.test(config.url)) {
          return this.handleRequest(regexHandler, config);
        }
      }
      return config;
    }, void 0);
  }
  onGet(urlOrRegex, handler) {
    if (typeof urlOrRegex === "string") {
      this.getHandlers[urlOrRegex] = handler;
    } else {
      this.regexHandlers.push({ method: "get", regex: urlOrRegex, handler });
    }
    return this;
  }
  onPost(urlOrRegex, handler) {
    if (typeof urlOrRegex === "string") {
      this.postHandlers[urlOrRegex] = handler;
    } else {
      this.regexHandlers.push({ method: "post", regex: urlOrRegex, handler });
    }
    return this;
  }
  onDelete(urlOrRegex, handler) {
    if (typeof urlOrRegex === "string") {
      this.deleteHandlers[urlOrRegex] = handler;
    } else {
      this.regexHandlers.push({ method: "delete", regex: urlOrRegex, handler });
    }
    return this;
  }
};
var mock = new SimpleMockAdapter(axios, { delayResponse: 500 });
mock.onGet("/api/customers", () => [200, {
  code: 0,
  data: customers,
  message: "success"
}]);
mock.onGet("/api/channels", (config) => {
  const customerId = config.params?.customerId;
  if (!customerId || !channelMap[customerId]) {
    return [400, { code: 1, message: "\u5BA2\u6237ID\u65E0\u6548\u6216\u4E0D\u5B58\u5728", data: null }];
  }
  return [200, {
    code: 0,
    data: channelMap[customerId],
    message: "success"
  }];
});
mock.onPost("/api/query", (config) => {
  try {
    const params = JSON.parse(config.data || "{}");
    if (!params.customer || !params.channel || !params.type || !params.page || !params.pageSize) {
      return [400, { code: 1, message: "\u53C2\u6570\u4E0D\u5B8C\u6574", data: null }];
    }
    let result;
    switch (params.type) {
      case "order":
        result = queryOrders(params);
        break;
      case "product":
        result = queryProducts(params);
        break;
      case "inventory":
        result = queryInventory(params);
        break;
      default:
        return [400, { code: 1, message: "\u67E5\u8BE2\u7C7B\u578B\u65E0\u6548", data: null }];
    }
    return [200, {
      code: 0,
      data: result,
      message: "success"
    }];
  } catch (error) {
    console.error("Mock API Error:", error);
    return [500, { code: 1, message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF", data: null }];
  }
});
mock.onGet(/\/api\/orders\/\w+/, (config) => {
  try {
    const url = config.url || "";
    const channelOrderId = url.split("/").pop() || "";
    if (!channelOrderId) {
      return [400, { code: 1, message: "\u8BA2\u5355ID\u4E0D\u80FD\u4E3A\u7A7A", data: null }];
    }
    const result = querySystemOrders(channelOrderId);
    return [200, {
      code: 0,
      data: result,
      message: "success"
    }];
  } catch (error) {
    console.error("Mock API Error:", error);
    return [500, { code: 1, message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF", data: null }];
  }
});
mock.onPost(/\/api\/orders\/\w+\/retry/, (config) => {
  const url = config.url || "";
  const urlParts = url.split("/");
  const orderId = urlParts.length >= 2 ? urlParts[urlParts.length - 2] : "";
  return [200, {
    code: 0,
    data: { success: true, orderId },
    message: "success"
  }];
});
mock.onPost("/api/export", (_config) => {
  return [200, new Blob(["\u6A21\u62DF\u5BFC\u51FA\u6570\u636E"], { type: "application/vnd.ms-excel" })];
});
mock.onGet(/\/api\/queryTool\/customers/, (config) => {
  console.log("Mock API: \u83B7\u53D6\u5BA2\u6237\u5217\u8868\u88AB\u8C03\u7528");
  return [200, customers];
});
mock.onGet(/\/api\/queryTool\/channels\/(.+)/, (config) => {
  const urlParts = config.url?.split("/");
  const customerId = urlParts?.[urlParts.length - 1];
  console.log(`Mock API: \u83B7\u53D6\u6E20\u9053\u5217\u8868\u88AB\u8C03\u7528, \u5BA2\u6237ID: ${customerId}`);
  if (customerId && channelMap[customerId]) {
    return [200, channelMap[customerId]];
  }
  console.log("\u672A\u627E\u5230\u5BF9\u5E94\u5BA2\u6237\u7684\u6E20\u9053\u6570\u636E");
  return [200, []];
});
mock.onPost(/\/api\/queryTool\/query/, (config) => {
  try {
    const params = JSON.parse(config.data || "{}");
    console.log(`Mock API: \u67E5\u8BE2\u6570\u636E\u88AB\u8C03\u7528, \u7C7B\u578B: ${params.type}`, params);
    let response;
    switch (params.type) {
      case "order":
        response = queryOrders(params);
        console.log(`\u67E5\u8BE2\u5230 ${response.data.length}/${response.total} \u6761\u8BA2\u5355\u6570\u636E`);
        break;
      case "product":
        response = queryProducts(params);
        console.log(`\u67E5\u8BE2\u5230 ${response.data.length}/${response.total} \u6761\u5546\u54C1\u6570\u636E`);
        break;
      case "inventory":
        response = queryInventory(params);
        console.log(`\u67E5\u8BE2\u5230 ${response.data.length}/${response.total} \u6761\u5E93\u5B58\u6570\u636E`);
        break;
      default:
        console.log("\u672A\u77E5\u7684\u67E5\u8BE2\u7C7B\u578B");
        response = { data: [], total: 0 };
    }
    return [200, response];
  } catch (error) {
    console.error("Mock API \u9519\u8BEF:", error);
    return [500, { message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF" }];
  }
});
mock.onPost(/\/api\/queryTool\/retry/, (config) => {
  try {
    const { orderId } = JSON.parse(config.data || "{}");
    console.log(`Mock API: \u91CD\u8BD5\u5904\u7406\u8BA2\u5355, \u8BA2\u5355ID: ${orderId}`);
    return [200, { success: true, message: `\u8BA2\u5355 ${orderId} \u5DF2\u91CD\u65B0\u63D0\u4EA4\u5904\u7406` }];
  } catch (error) {
    console.error("Mock API Error:", error);
    return [500, { message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF" }];
  }
});
mock.onPost(/\/api\/queryTool\/export/, (config) => {
  console.log("Mock API: \u5BFC\u51FA\u6570\u636E");
  return [200, { success: true, message: "\u5BFC\u51FA\u6210\u529F" }];
});
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res && (res.code === void 0 || res.code === 0)) {
      return res.data || res;
    }
    ElMessage.error(res.message || "\u8BF7\u6C42\u5931\u8D25");
    return Promise.reject(new Error(res.message || "\u8BF7\u6C42\u5931\u8D25"));
  },
  (error) => {
    const message = error.response?.data?.message || error.message || "\u8BF7\u6C42\u5931\u8D25";
    ElMessage.error(message);
    return Promise.reject(error);
  }
);
mock.onGet("/api/products", (config) => {
  try {
    const params = config.params || {};
    const response = getMockProducts({
      page: Number(params.page) || 1,
      pageSize: Number(params.pageSize) || 20,
      search: params.search,
      type: params.type,
      integration: params.integration
    });
    return [200, {
      code: 0,
      data: response.data,
      total: response.total,
      message: "success"
    }];
  } catch (error) {
    console.error("Mock API Error:", error);
    return [500, { code: 1, message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF", data: null }];
  }
});
mock.onDelete(/\/api\/products\/\w+/, (config) => {
  try {
    const url = config.url || "";
    const productId = url.split("/").pop() || "";
    if (!productId) {
      return [400, { code: 1, message: "\u4EA7\u54C1ID\u4E0D\u80FD\u4E3A\u7A7A", data: null }];
    }
    mockDeleteProduct(productId);
    return [200, {
      code: 0,
      data: null,
      message: "success"
    }];
  } catch (error) {
    console.error("Mock API Error:", error);
    return [500, { code: 1, message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF", data: null }];
  }
});
var mockHandlers = [
  // Purchase Order Tracking
  {
    url: "/api/purchase/tracking",
    method: "get",
    response: ({ query }) => {
      const { page = 1, pageSize = 10 } = query;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        code: 200,
        data: {
          total: mockTrackingList.length,
          items: mockTrackingList.slice(start, end)
        }
      };
    }
  },
  {
    url: "/api/purchase/tracking/:id",
    method: "get",
    response: ({ params }) => {
      try {
        const data = mockTrackingDetail(params.id);
        return {
          code: 200,
          data
        };
      } catch (error) {
        return {
          code: 404,
          message: "Not found"
        };
      }
    }
  },
  {
    url: "/api/purchase/tracking/:id/status",
    method: "post",
    response: ({ params }) => {
      return {
        code: 200,
        data: mockTrackingDetail(params.id)
      };
    }
  },
  // ========================
  // 安全库存设置相关Mock API
  // ========================
  // 获取安全库存配置列表
  {
    url: "/api/safety-stock/configs",
    method: "get",
    response: (req) => {
      const { level, status, channelId, storeId, sku, keyword, page = 1, pageSize = 20 } = req.query || {};
      let filteredConfigs = [...mockSafetyStockConfigs];
      if (level) {
        filteredConfigs = filteredConfigs.filter((c) => c.level === level);
      }
      if (status) {
        filteredConfigs = filteredConfigs.filter((c) => c.status === status);
      }
      if (channelId) {
        filteredConfigs = filteredConfigs.filter(
          (c) => "channelId" in c && c.channelId === channelId
        );
      }
      if (storeId) {
        filteredConfigs = filteredConfigs.filter(
          (c) => "storeId" in c && c.storeId === storeId
        );
      }
      if (sku) {
        filteredConfigs = filteredConfigs.filter(
          (c) => "sku" in c && c.sku === sku
        );
      }
      if (keyword) {
        filteredConfigs = filteredConfigs.filter(
          (c) => c.description?.includes(keyword) || "productName" in c && c.productName?.includes(keyword)
        );
      }
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredConfigs.slice(start, end);
      return {
        code: 0,
        message: "success",
        data: {
          data: paginatedData,
          total: filteredConfigs.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      };
    }
  },
  // 获取安全库存配置详情
  {
    url: "/api/safety-stock/configs/:id",
    method: "get",
    response: (req) => {
      const { id } = req.params;
      const configItem = mockSafetyStockConfigs.find((c) => c.id === id);
      if (configItem) {
        return { code: 0, message: "success", data: configItem };
      } else {
        return { code: 404, message: "Config not found" };
      }
    }
  },
  // 创建安全库存配置
  {
    url: "/api/safety-stock/configs",
    method: "post",
    response: (req) => {
      const requestData = req.body;
      const newConfigs = requestData.configs.map((configData) => ({
        id: `SSC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...configData,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        createdBy: "current_user",
        updatedBy: "current_user"
      }));
      mockSafetyStockConfigs.push(...newConfigs);
      return { code: 0, message: "success", data: newConfigs };
    }
  },
  // 获取库存预警列表
  {
    url: "/api/safety-stock/alerts",
    method: "get",
    response: (req) => {
      const { page = 1, pageSize = 20, level, alertType, status, storeId, channelId, sku } = req.query || {};
      let filteredAlerts = [...mockStockAlerts];
      if (level)
        filteredAlerts = filteredAlerts.filter((a) => a.level === level);
      if (alertType)
        filteredAlerts = filteredAlerts.filter((a) => a.alertType === alertType);
      if (status)
        filteredAlerts = filteredAlerts.filter((a) => a.status === status);
      if (storeId)
        filteredAlerts = filteredAlerts.filter((a) => a.storeId === storeId);
      if (channelId)
        filteredAlerts = filteredAlerts.filter((a) => a.channelId === channelId);
      if (sku)
        filteredAlerts = filteredAlerts.filter((a) => a.sku === sku);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredAlerts.slice(start, end);
      return {
        code: 0,
        message: "success",
        data: {
          data: paginatedData,
          total: filteredAlerts.length
        }
      };
    }
  },
  // 获取统计数据
  {
    url: "/api/safety-stock/stats",
    method: "get",
    response: () => {
      return { code: 0, message: "success", data: mockSafetyStockStats };
    }
  },
  // 获取渠道列表
  {
    url: "/api/safety-stock/channels",
    method: "get",
    response: () => {
      return { code: 0, message: "success", data: mockChannels };
    }
  },
  // 获取店铺列表
  {
    url: "/api/safety-stock/stores",
    method: "get",
    response: (req) => {
      const { channelId } = req.query || {};
      let filteredStores = [...mockStores];
      if (channelId) {
        filteredStores = filteredStores.filter((s) => s.channelId === channelId);
      }
      return { code: 0, message: "success", data: filteredStores };
    }
  },
  // 获取仓库列表
  {
    url: "/api/safety-stock/warehouses",
    method: "get",
    response: () => {
      return { code: 0, message: "success", data: mockWarehouses };
    }
  },
  // 搜索SKU
  {
    url: "/api/safety-stock/skus/search",
    method: "get",
    response: (req) => {
      const { keyword, storeId, channelId, page = 1, pageSize = 20 } = req.query || {};
      let filteredSkus = [...mockSkus];
      if (keyword) {
        filteredSkus = filteredSkus.filter(
          (s) => s.sku.toLowerCase().includes(keyword.toLowerCase()) || s.productName.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredSkus.slice(start, end);
      return {
        code: 0,
        message: "success",
        data: {
          data: paginatedData,
          total: filteredSkus.length
        }
      };
    }
  },
  // 获取SKU信息
  {
    url: "/api/safety-stock/skus/:sku",
    method: "get",
    response: (req) => {
      const { sku } = req.params;
      const skuInfo = mockSkus.find((s) => s.sku === sku);
      if (skuInfo) {
        return { code: 0, message: "success", data: skuInfo };
      } else {
        return { code: 404, message: "SKU not found" };
      }
    }
  },
  // 获取预设配置列表
  {
    url: "/api/safety-stock/presets",
    method: "get",
    response: () => {
      return { code: 0, message: "success", data: mockPresets };
    }
  }
];
var mock_default = mockHandlers;
export {
  mock_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svaW5kZXgudHMiLCAic3JjL21vY2svcXVlcnlUb29sRGF0YS50cyIsICJzcmMvdmlld3MvcHVyY2hhc2UvdHJhY2tpbmcvdHlwZXMudHMiLCAic3JjL21vY2svcHVyY2hhc2VUcmFja2luZy50cyIsICJzcmMvbW9jay9wcm9kdWN0RGF0YS50cyIsICJzcmMvbW9jay9zYWZldHlTdG9ja0RhdGEudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSmF5bmVcXFxcRGVza3RvcFxcXFxVTklTXFxcXE9NU1x1OTg3OVx1NzZFRVxcXFxzcmNcXFxcbW9ja1xcXFxpbmRleC50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFxtb2NrXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9KYXluZS9EZXNrdG9wL1VOSVMvT01TJUU5JUExJUI5JUU3JTlCJUFFL3NyYy9tb2NrL2luZGV4LnRzXCI7aW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuaW1wb3J0IHsgRWxNZXNzYWdlIH0gZnJvbSAnZWxlbWVudC1wbHVzJ1xuaW1wb3J0IHsgXG4gIGN1c3RvbWVycywgXG4gIGNoYW5uZWxNYXAsIFxuICBxdWVyeU9yZGVycywgXG4gIHF1ZXJ5UHJvZHVjdHMsIFxuICBxdWVyeUludmVudG9yeSwgXG4gIHF1ZXJ5U3lzdGVtT3JkZXJzIFxufSBmcm9tICcuL3F1ZXJ5VG9vbERhdGEnXG5pbXBvcnQgeyBNb2NrTWV0aG9kIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaydcbmltcG9ydCB7IG1vY2tUcmFja2luZ0xpc3QsIG1vY2tUcmFja2luZ0RldGFpbCB9IGZyb20gJy4vcHVyY2hhc2VUcmFja2luZydcbmltcG9ydCB7IGdldE1vY2tQcm9kdWN0cywgbW9ja0RlbGV0ZVByb2R1Y3QgfSBmcm9tICcuL3Byb2R1Y3REYXRhJ1xuaW1wb3J0IHtcbiAgbW9ja1NhZmV0eVN0b2NrQ29uZmlncyxcbiAgbW9ja0ZsZXhpYmxlU2FmZXR5U3RvY2tDb25maWdzLFxuICBtb2NrU3RvY2tBbGVydHMsXG4gIG1vY2tTYWZldHlTdG9ja1N0YXRzLFxuICBtb2NrQ2hhbm5lbHMsXG4gIG1vY2tTdG9yZXMsXG4gIG1vY2tXYXJlaG91c2VzLFxuICBtb2NrU2t1cyxcbiAgbW9ja1ByZXNldHNcbn0gZnJvbSAnLi9zYWZldHlTdG9ja0RhdGEnXG5cbi8vIE1vY2tcdTkwMDJcdTkxNERcdTU2NjhcdTdDN0JcdTU3OEJcbmludGVyZmFjZSBNb2NrQ29uZmlnIHtcbiAgdXJsPzogc3RyaW5nO1xuICBkYXRhPzogc3RyaW5nO1xuICBwYXJhbXM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBoZWFkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLy8gXHU3NTMxXHU0RThFYXhpb3MtbW9jay1hZGFwdGVyXHU1M0VGXHU4MEZEXHU0RTBEXHU1QjU4XHU1NzI4XHVGRjBDXHU2MjExXHU0RUVDXHU1MjFCXHU1RUZBXHU0RTAwXHU0RTJBXHU3QjgwXHU1MzU1XHU3Njg0TW9ja1x1NUI5RVx1NzNCMFxuY2xhc3MgU2ltcGxlTW9ja0FkYXB0ZXIge1xuICBwcml2YXRlIGhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCAoY29uZmlnOiBNb2NrQ29uZmlnKSA9PiBbbnVtYmVyLCBhbnldPiA9IHt9O1xuICBwcml2YXRlIGdldEhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCAoY29uZmlnOiBNb2NrQ29uZmlnKSA9PiBbbnVtYmVyLCBhbnldPiA9IHt9O1xuICBwcml2YXRlIHBvc3RIYW5kbGVyczogUmVjb3JkPHN0cmluZywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4gW251bWJlciwgYW55XT4gPSB7fTtcbiAgcHJpdmF0ZSBkZWxldGVIYW5kbGVyczogUmVjb3JkPHN0cmluZywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4gW251bWJlciwgYW55XT4gPSB7fTtcbiAgcHJpdmF0ZSByZWdleEhhbmRsZXJzOiBBcnJheTx7bWV0aG9kOiBzdHJpbmcsIHJlZ2V4OiBSZWdFeHAsIGhhbmRsZXI6IChjb25maWc6IE1vY2tDb25maWcpID0+IFtudW1iZXIsIGFueV19PiA9IFtdO1xuICBwcml2YXRlIGRlbGF5OiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBoYW5kbGVSZXF1ZXN0KGhhbmRsZXI6IChjb25maWc6IE1vY2tDb25maWcpID0+IFtudW1iZXIsIGFueV0sIGNvbmZpZzogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBbc3RhdHVzLCByZXNwb25zZV0gPSBoYW5kbGVyKGNvbmZpZyk7XG4gICAgICAgIGlmIChzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgZGF0YTogcmVzcG9uc2UsXG4gICAgICAgICAgICBzdGF0dXMsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiAnT0snLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBjb25maWdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgZGF0YTogcmVzcG9uc2UsXG4gICAgICAgICAgICAgIHN0YXR1cyxcbiAgICAgICAgICAgICAgc3RhdHVzVGV4dDogJ0VSUk9SJyxcbiAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICAgIGNvbmZpZ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzLmRlbGF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGF4aW9zSW5zdGFuY2U6IGFueSwgb3B0aW9ucz86IHtkZWxheVJlc3BvbnNlPzogbnVtYmVyfSkge1xuICAgIHRoaXMuZGVsYXkgPSBvcHRpb25zPy5kZWxheVJlc3BvbnNlIHx8IDA7XG4gICAgYXhpb3NJbnN0YW5jZS5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoKGNvbmZpZzogYW55KSA9PiB7XG4gICAgICBjb25zdCBtZXRob2QgPSBjb25maWcubWV0aG9kPy50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGhhbmRsZXI7XG5cbiAgICAgIC8vIFx1NjgzOVx1NjM2RVx1OEJGN1x1NkM0Mlx1NjVCOVx1NkNENVx1ODNCN1x1NTNENlx1NUJGOVx1NUU5NFx1NzY4NFx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgICBoYW5kbGVyID0gdGhpcy5nZXRIYW5kbGVyc1tjb25maWcudXJsXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgICAgaGFuZGxlciA9IHRoaXMucG9zdEhhbmRsZXJzW2NvbmZpZy51cmxdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgIGhhbmRsZXIgPSB0aGlzLmRlbGV0ZUhhbmRsZXJzW2NvbmZpZy51cmxdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTYyN0VcdTUyMzBcdTRFODZcdTc2RjRcdTYzQTVcdTUzMzlcdTkxNERcdTc2ODRcdTU5MDRcdTc0MDZcdTU2NjhcbiAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3QoaGFuZGxlciwgY29uZmlnKTtcbiAgICAgIH1cblxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2QjYzXHU1MjE5XHU4ODY4XHU4RkJFXHU1RjBGXHU1OTA0XHU3NDA2XHU1NjY4XG4gICAgICBmb3IgKGNvbnN0IHttZXRob2Q6IGhhbmRsZXJNZXRob2QsIHJlZ2V4LCBoYW5kbGVyOiByZWdleEhhbmRsZXJ9IG9mIHRoaXMucmVnZXhIYW5kbGVycykge1xuICAgICAgICBpZiAoaGFuZGxlck1ldGhvZCA9PT0gbWV0aG9kICYmIHJlZ2V4LnRlc3QoY29uZmlnLnVybCkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHJlZ2V4SGFuZGxlciwgY29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH0sIHVuZGVmaW5lZCk7XG4gIH1cbiAgXG4gIG9uR2V0KHVybE9yUmVnZXg6IHN0cmluZyB8IFJlZ0V4cCwgaGFuZGxlcjogKGNvbmZpZzogTW9ja0NvbmZpZykgPT4gW251bWJlciwgYW55XSk6IFNpbXBsZU1vY2tBZGFwdGVyIHtcbiAgICBpZiAodHlwZW9mIHVybE9yUmVnZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmdldEhhbmRsZXJzW3VybE9yUmVnZXhdID0gaGFuZGxlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWdleEhhbmRsZXJzLnB1c2goe21ldGhvZDogJ2dldCcsIHJlZ2V4OiB1cmxPclJlZ2V4LCBoYW5kbGVyfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIFxuICBvblBvc3QodXJsT3JSZWdleDogc3RyaW5nIHwgUmVnRXhwLCBoYW5kbGVyOiAoY29uZmlnOiBNb2NrQ29uZmlnKSA9PiBbbnVtYmVyLCBhbnldKTogU2ltcGxlTW9ja0FkYXB0ZXIge1xuICAgIGlmICh0eXBlb2YgdXJsT3JSZWdleCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMucG9zdEhhbmRsZXJzW3VybE9yUmVnZXhdID0gaGFuZGxlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWdleEhhbmRsZXJzLnB1c2goe21ldGhvZDogJ3Bvc3QnLCByZWdleDogdXJsT3JSZWdleCwgaGFuZGxlcn0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9uRGVsZXRlKHVybE9yUmVnZXg6IHN0cmluZyB8IFJlZ0V4cCwgaGFuZGxlcjogKGNvbmZpZzogTW9ja0NvbmZpZykgPT4gW251bWJlciwgYW55XSk6IFNpbXBsZU1vY2tBZGFwdGVyIHtcbiAgICBpZiAodHlwZW9mIHVybE9yUmVnZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmRlbGV0ZUhhbmRsZXJzW3VybE9yUmVnZXhdID0gaGFuZGxlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWdleEhhbmRsZXJzLnB1c2goe21ldGhvZDogJ2RlbGV0ZScsIHJlZ2V4OiB1cmxPclJlZ2V4LCBoYW5kbGVyfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8vIFx1NTIxQlx1NUVGQVx1NEUwMFx1NEUyQU1vY2tBZGFwdGVyXHU1QjlFXHU0RjhCXG5jb25zdCBtb2NrID0gbmV3IFNpbXBsZU1vY2tBZGFwdGVyKGF4aW9zLCB7IGRlbGF5UmVzcG9uc2U6IDUwMCB9KSAvLyBcdTZBMjFcdTYyREZcdTdGNTFcdTdFRENcdTVFRjZcdThGREZcblxuLy8gXHU2QTIxXHU2MkRGXHU4M0I3XHU1M0Q2XHU1QkEyXHU2MjM3XHU1MjE3XHU4ODY4XG5tb2NrLm9uR2V0KCcvYXBpL2N1c3RvbWVycycsICgpID0+IFsyMDAsIHtcbiAgY29kZTogMCxcbiAgZGF0YTogY3VzdG9tZXJzLFxuICBtZXNzYWdlOiAnc3VjY2Vzcydcbn1dKTtcblxuLy8gXHU2QTIxXHU2MkRGXHU4M0I3XHU1M0Q2XHU2RTIwXHU5MDUzXHU1MjE3XHU4ODY4XG5tb2NrLm9uR2V0KCcvYXBpL2NoYW5uZWxzJywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICBjb25zdCBjdXN0b21lcklkID0gY29uZmlnLnBhcmFtcz8uY3VzdG9tZXJJZCBhcyBzdHJpbmc7XG4gIGlmICghY3VzdG9tZXJJZCB8fCAhY2hhbm5lbE1hcFtjdXN0b21lcklkIGFzIGtleW9mIHR5cGVvZiBjaGFubmVsTWFwXSkge1xuICAgIHJldHVybiBbNDAwLCB7IGNvZGU6IDEsIG1lc3NhZ2U6ICdcdTVCQTJcdTYyMzdJRFx1NjVFMFx1NjU0OFx1NjIxNlx1NEUwRFx1NUI1OFx1NTcyOCcsIGRhdGE6IG51bGwgfV07XG4gIH1cbiAgXG4gIHJldHVybiBbMjAwLCB7XG4gICAgY29kZTogMCxcbiAgICBkYXRhOiBjaGFubmVsTWFwW2N1c3RvbWVySWQgYXMga2V5b2YgdHlwZW9mIGNoYW5uZWxNYXBdLFxuICAgIG1lc3NhZ2U6ICdzdWNjZXNzJ1xuICB9XTtcbn0pO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTYzQTVcdTUzRTNcbm1vY2sub25Qb3N0KCcvYXBpL3F1ZXJ5JywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcmFtcyA9IEpTT04ucGFyc2UoY29uZmlnLmRhdGEgfHwgJ3t9Jyk7XG4gICAgaWYgKCFwYXJhbXMuY3VzdG9tZXIgfHwgIXBhcmFtcy5jaGFubmVsIHx8ICFwYXJhbXMudHlwZSB8fCAhcGFyYW1zLnBhZ2UgfHwgIXBhcmFtcy5wYWdlU2l6ZSkge1xuICAgICAgcmV0dXJuIFs0MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1NTNDMlx1NjU3MFx1NEUwRFx1NUI4Q1x1NjU3NCcsIGRhdGE6IG51bGwgfV07XG4gICAgfVxuICAgIFxuICAgIGxldCByZXN1bHQ7XG4gICAgXG4gICAgc3dpdGNoKHBhcmFtcy50eXBlKSB7XG4gICAgICBjYXNlICdvcmRlcic6XG4gICAgICAgIHJlc3VsdCA9IHF1ZXJ5T3JkZXJzKHBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgIGNhc2UgJ3Byb2R1Y3QnOlxuICAgICAgICByZXN1bHQgPSBxdWVyeVByb2R1Y3RzKHBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgIGNhc2UgJ2ludmVudG9yeSc6XG4gICAgICAgIHJlc3VsdCA9IHF1ZXJ5SW52ZW50b3J5KHBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBbNDAwLCB7IGNvZGU6IDEsIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTdDN0JcdTU3OEJcdTY1RTBcdTY1NDgnLCBkYXRhOiBudWxsIH1dO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gWzIwMCwge1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJ1xuICAgIH1dO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ01vY2sgQVBJIEVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gWzUwMCwgeyBjb2RlOiAxLCBtZXNzYWdlOiAnXHU2NzBEXHU1MkExXHU1NjY4XHU1MTg1XHU5MEU4XHU5NTE5XHU4QkVGJywgZGF0YTogbnVsbCB9XTtcbiAgfVxufSk7XG5cbi8vIFx1NkEyMVx1NjJERlx1ODNCN1x1NTNENlx1N0NGQlx1N0VERlx1OEJBMlx1NTM1NVx1NEZFMVx1NjA2RlxubW9jay5vbkdldCgvXFwvYXBpXFwvb3JkZXJzXFwvXFx3Ky8sIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICAgIGNvbnN0IGNoYW5uZWxPcmRlcklkID0gdXJsLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgaWYgKCFjaGFubmVsT3JkZXJJZCkge1xuICAgICAgcmV0dXJuIFs0MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1OEJBMlx1NTM1NUlEXHU0RTBEXHU4MEZEXHU0RTNBXHU3QTdBJywgZGF0YTogbnVsbCB9XTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgcmVzdWx0ID0gcXVlcnlTeXN0ZW1PcmRlcnMoY2hhbm5lbE9yZGVySWQpO1xuICAgIFxuICAgIHJldHVybiBbMjAwLCB7XG4gICAgICBjb2RlOiAwLFxuICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgbWVzc2FnZTogJ3N1Y2Nlc3MnXG4gICAgfV07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignTW9jayBBUEkgRXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBbNTAwLCB7IGNvZGU6IDEsIG1lc3NhZ2U6ICdcdTY3MERcdTUyQTFcdTU2NjhcdTUxODVcdTkwRThcdTk1MTlcdThCRUYnLCBkYXRhOiBudWxsIH1dO1xuICB9XG59KTtcblxuLy8gXHU2QTIxXHU2MkRGXHU5MUNEXHU4QkQ1XHU1OTA0XHU3NDA2XHU4QkEyXHU1MzU1XG5tb2NrLm9uUG9zdCgvXFwvYXBpXFwvb3JkZXJzXFwvXFx3K1xcL3JldHJ5LywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICBjb25zdCB1cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICBjb25zdCB1cmxQYXJ0cyA9IHVybC5zcGxpdCgnLycpO1xuICBjb25zdCBvcmRlcklkID0gdXJsUGFydHMubGVuZ3RoID49IDIgPyB1cmxQYXJ0c1t1cmxQYXJ0cy5sZW5ndGggLSAyXSA6ICcnO1xuICBcbiAgcmV0dXJuIFsyMDAsIHtcbiAgICBjb2RlOiAwLFxuICAgIGRhdGE6IHsgc3VjY2VzczogdHJ1ZSwgb3JkZXJJZCB9LFxuICAgIG1lc3NhZ2U6ICdzdWNjZXNzJ1xuICB9XTtcbn0pO1xuXG4vLyBcdTZBMjFcdTYyREZcdTVCRkNcdTUxRkFcdTUyOUZcdTgwRkRcbm1vY2sub25Qb3N0KCcvYXBpL2V4cG9ydCcsIChfY29uZmlnOiBNb2NrQ29uZmlnKSA9PiB7XG4gIHJldHVybiBbMjAwLCBuZXcgQmxvYihbJ1x1NkEyMVx1NjJERlx1NUJGQ1x1NTFGQVx1NjU3MFx1NjM2RSddLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnIH0pXTtcbn0pO1xuXG4vLyBcdTZERkJcdTUyQTBcdTY3RTVcdThCRTJcdTVERTVcdTUxNzdcdTc2RjhcdTUxNzNcdTc2ODRBUElcbm1vY2sub25HZXQoL1xcL2FwaVxcL3F1ZXJ5VG9vbFxcL2N1c3RvbWVycy8sIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgY29uc29sZS5sb2coJ01vY2sgQVBJOiBcdTgzQjdcdTUzRDZcdTVCQTJcdTYyMzdcdTUyMTdcdTg4NjhcdTg4QUJcdThDMDNcdTc1MjgnKTtcbiAgLy8gXHU3QjgwXHU1MzU1XHU4RkQ0XHU1NkRFXHU1QkEyXHU2MjM3XHU2NTcwXHU2MzZFXHVGRjBDXHU0RTBEXHU1MDVBXHU5ODlEXHU1OTE2XHU1MzA1XHU4OEM1XG4gIHJldHVybiBbMjAwLCBjdXN0b21lcnNdO1xufSk7XG5cbm1vY2sub25HZXQoL1xcL2FwaVxcL3F1ZXJ5VG9vbFxcL2NoYW5uZWxzXFwvKC4rKS8sIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgY29uc3QgdXJsUGFydHMgPSBjb25maWcudXJsPy5zcGxpdCgnLycpO1xuICBjb25zdCBjdXN0b21lcklkID0gdXJsUGFydHM/Llt1cmxQYXJ0cy5sZW5ndGggLSAxXTtcbiAgXG4gIGNvbnNvbGUubG9nKGBNb2NrIEFQSTogXHU4M0I3XHU1M0Q2XHU2RTIwXHU5MDUzXHU1MjE3XHU4ODY4XHU4OEFCXHU4QzAzXHU3NTI4LCBcdTVCQTJcdTYyMzdJRDogJHtjdXN0b21lcklkfWApO1xuICBcbiAgaWYgKGN1c3RvbWVySWQgJiYgY2hhbm5lbE1hcFtjdXN0b21lcklkXSkge1xuICAgIHJldHVybiBbMjAwLCBjaGFubmVsTWFwW2N1c3RvbWVySWRdXTtcbiAgfVxuICBcbiAgY29uc29sZS5sb2coJ1x1NjcyQVx1NjI3RVx1NTIzMFx1NUJGOVx1NUU5NFx1NUJBMlx1NjIzN1x1NzY4NFx1NkUyMFx1OTA1M1x1NjU3MFx1NjM2RScpO1xuICByZXR1cm4gWzIwMCwgW11dO1xufSk7XG5cbm1vY2sub25Qb3N0KC9cXC9hcGlcXC9xdWVyeVRvb2xcXC9xdWVyeS8sIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJhbXMgPSBKU09OLnBhcnNlKGNvbmZpZy5kYXRhIHx8ICd7fScpO1xuICAgIGNvbnNvbGUubG9nKGBNb2NrIEFQSTogXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXHU4OEFCXHU4QzAzXHU3NTI4LCBcdTdDN0JcdTU3OEI6ICR7cGFyYW1zLnR5cGV9YCwgcGFyYW1zKTtcbiAgICBcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgXG4gICAgc3dpdGNoIChwYXJhbXMudHlwZSkge1xuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgICByZXNwb25zZSA9IHF1ZXJ5T3JkZXJzKHBhcmFtcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBcdTY3RTVcdThCRTJcdTUyMzAgJHtyZXNwb25zZS5kYXRhLmxlbmd0aH0vJHtyZXNwb25zZS50b3RhbH0gXHU2NzYxXHU4QkEyXHU1MzU1XHU2NTcwXHU2MzZFYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHJvZHVjdCc6XG4gICAgICAgIHJlc3BvbnNlID0gcXVlcnlQcm9kdWN0cyhwYXJhbXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhgXHU2N0U1XHU4QkUyXHU1MjMwICR7cmVzcG9uc2UuZGF0YS5sZW5ndGh9LyR7cmVzcG9uc2UudG90YWx9IFx1Njc2MVx1NTU0Nlx1NTRDMVx1NjU3MFx1NjM2RWApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ludmVudG9yeSc6XG4gICAgICAgIHJlc3BvbnNlID0gcXVlcnlJbnZlbnRvcnkocGFyYW1zKTtcbiAgICAgICAgY29uc29sZS5sb2coYFx1NjdFNVx1OEJFMlx1NTIzMCAke3Jlc3BvbnNlLmRhdGEubGVuZ3RofS8ke3Jlc3BvbnNlLnRvdGFsfSBcdTY3NjFcdTVFOTNcdTVCNThcdTY1NzBcdTYzNkVgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygnXHU2NzJBXHU3N0U1XHU3Njg0XHU2N0U1XHU4QkUyXHU3QzdCXHU1NzhCJyk7XG4gICAgICAgIHJlc3BvbnNlID0geyBkYXRhOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIFsyMDAsIHJlc3BvbnNlXTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb2NrIEFQSSBcdTk1MTlcdThCRUY6JywgZXJyb3IpO1xuICAgIHJldHVybiBbNTAwLCB7IG1lc3NhZ2U6ICdcdTY3MERcdTUyQTFcdTU2NjhcdTUxODVcdTkwRThcdTk1MTlcdThCRUYnIH1dO1xuICB9XG59KTtcblxubW9jay5vblBvc3QoL1xcL2FwaVxcL3F1ZXJ5VG9vbFxcL3JldHJ5LywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgb3JkZXJJZCB9ID0gSlNPTi5wYXJzZShjb25maWcuZGF0YSB8fCAne30nKTtcbiAgICBjb25zb2xlLmxvZyhgTW9jayBBUEk6IFx1OTFDRFx1OEJENVx1NTkwNFx1NzQwNlx1OEJBMlx1NTM1NSwgXHU4QkEyXHU1MzU1SUQ6ICR7b3JkZXJJZH1gKTtcbiAgICBcbiAgICAvLyBcdTZBMjFcdTYyREZcdTkxQ0RcdThCRDVcdTU5MDRcdTc0MDZcbiAgICByZXR1cm4gWzIwMCwgeyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiBgXHU4QkEyXHU1MzU1ICR7b3JkZXJJZH0gXHU1REYyXHU5MUNEXHU2NUIwXHU2M0QwXHU0RUE0XHU1OTA0XHU3NDA2YCB9XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb2NrIEFQSSBFcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIFs1MDAsIHsgbWVzc2FnZTogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicgfV07XG4gIH1cbn0pO1xuXG5tb2NrLm9uUG9zdCgvXFwvYXBpXFwvcXVlcnlUb29sXFwvZXhwb3J0LywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICBjb25zb2xlLmxvZygnTW9jayBBUEk6IFx1NUJGQ1x1NTFGQVx1NjU3MFx1NjM2RScpO1xuICAvLyBcdTZBMjFcdTYyREZcdTVCRkNcdTUxRkFcbiAgcmV0dXJuIFsyMDAsIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ1x1NUJGQ1x1NTFGQVx1NjIxMFx1NTI5RicgfV07XG59KTtcblxuLy8gXHU1MTY4XHU1QzQwXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU1NDhDXHU1NENEXHU1RTk0XG5heGlvcy5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoXG4gIChjb25maWcpID0+IHtcbiAgICAvLyBcdTUzRUZcdTRFRTVcdTU3MjhcdThGRDlcdTkxQ0NcdTZERkJcdTUyQTB0b2tlblx1N0I0OVx1N0VERlx1NEUwMFx1NTkwNFx1NzQwNlxuICAgIHJldHVybiBjb25maWc7XG4gIH0sXG4gIChlcnJvcikgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gIH1cbik7XG5cbmF4aW9zLmludGVyY2VwdG9ycy5yZXNwb25zZS51c2UoXG4gIChyZXNwb25zZSkgPT4ge1xuICAgIC8vIFx1NTkwNFx1NzQwNlx1NjIxMFx1NTI5Rlx1NzY4NFx1NTRDRFx1NUU5NFxuICAgIGNvbnN0IHJlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgaWYgKHJlcyAmJiAocmVzLmNvZGUgPT09IHVuZGVmaW5lZCB8fCByZXMuY29kZSA9PT0gMCkpIHtcbiAgICAgIHJldHVybiByZXMuZGF0YSB8fCByZXM7XG4gICAgfVxuICAgIFxuICAgIEVsTWVzc2FnZS5lcnJvcihyZXMubWVzc2FnZSB8fCAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1Jyk7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihyZXMubWVzc2FnZSB8fCAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1JykpO1xuICB9LFxuICAoZXJyb3IpID0+IHtcbiAgICAvLyBcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAgICBjb25zdCBtZXNzYWdlID0gZXJyb3IucmVzcG9uc2U/LmRhdGE/Lm1lc3NhZ2UgfHwgZXJyb3IubWVzc2FnZSB8fCAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1JztcbiAgICBFbE1lc3NhZ2UuZXJyb3IobWVzc2FnZSk7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgfVxuKTtcblxuLy8gXHU2REZCXHU1MkEwXHU0RUE3XHU1NEMxXHU3NkY4XHU1MTczXHU3Njg0bW9ja1x1NjNBNVx1NTNFM1xubW9jay5vbkdldCgnL2FwaS9wcm9kdWN0cycsIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJhbXMgPSBjb25maWcucGFyYW1zIHx8IHt9O1xuICAgIGNvbnN0IHJlc3BvbnNlID0gZ2V0TW9ja1Byb2R1Y3RzKHtcbiAgICAgIHBhZ2U6IE51bWJlcihwYXJhbXMucGFnZSkgfHwgMSxcbiAgICAgIHBhZ2VTaXplOiBOdW1iZXIocGFyYW1zLnBhZ2VTaXplKSB8fCAyMCxcbiAgICAgIHNlYXJjaDogcGFyYW1zLnNlYXJjaCxcbiAgICAgIHR5cGU6IHBhcmFtcy50eXBlLFxuICAgICAgaW50ZWdyYXRpb246IHBhcmFtcy5pbnRlZ3JhdGlvbixcbiAgICB9KTtcbiAgICByZXR1cm4gWzIwMCwge1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IHJlc3BvbnNlLmRhdGEsXG4gICAgICB0b3RhbDogcmVzcG9uc2UudG90YWwsXG4gICAgICBtZXNzYWdlOiAnc3VjY2VzcydcbiAgICB9XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb2NrIEFQSSBFcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIFs1MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicsIGRhdGE6IG51bGwgfV07XG4gIH1cbn0pO1xuXG5tb2NrLm9uRGVsZXRlKC9cXC9hcGlcXC9wcm9kdWN0c1xcL1xcdysvLCAoY29uZmlnOiBNb2NrQ29uZmlnKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdXJsID0gY29uZmlnLnVybCB8fCAnJztcbiAgICBjb25zdCBwcm9kdWN0SWQgPSB1cmwuc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBpZiAoIXByb2R1Y3RJZCkge1xuICAgICAgcmV0dXJuIFs0MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1NEVBN1x1NTRDMUlEXHU0RTBEXHU4MEZEXHU0RTNBXHU3QTdBJywgZGF0YTogbnVsbCB9XTtcbiAgICB9XG4gICAgXG4gICAgbW9ja0RlbGV0ZVByb2R1Y3QocHJvZHVjdElkKTtcbiAgICByZXR1cm4gWzIwMCwge1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IG51bGwsXG4gICAgICBtZXNzYWdlOiAnc3VjY2VzcydcbiAgICB9XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb2NrIEFQSSBFcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIFs1MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicsIGRhdGE6IG51bGwgfV07XG4gIH1cbn0pO1xuXG5jb25zdCBtb2NrSGFuZGxlcnMgPSBbXG4gIC8vIFB1cmNoYXNlIE9yZGVyIFRyYWNraW5nXG4gIHtcbiAgICB1cmw6ICcvYXBpL3B1cmNoYXNlL3RyYWNraW5nJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XG4gICAgICBjb25zdCB7IHBhZ2UgPSAxLCBwYWdlU2l6ZSA9IDEwIH0gPSBxdWVyeVxuICAgICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogcGFnZVNpemVcbiAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgcGFnZVNpemVcbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdG90YWw6IG1vY2tUcmFja2luZ0xpc3QubGVuZ3RoLFxuICAgICAgICAgIGl0ZW1zOiBtb2NrVHJhY2tpbmdMaXN0LnNsaWNlKHN0YXJ0LCBlbmQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL3B1cmNoYXNlL3RyYWNraW5nLzppZCcsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKHsgcGFyYW1zIH0pID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBtb2NrVHJhY2tpbmdEZXRhaWwocGFyYW1zLmlkKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICBkYXRhXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogNDA0LFxuICAgICAgICAgIG1lc3NhZ2U6ICdOb3QgZm91bmQnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL3B1cmNoYXNlL3RyYWNraW5nLzppZC9zdGF0dXMnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHJlc3BvbnNlOiAoeyBwYXJhbXMgfSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiBtb2NrVHJhY2tpbmdEZXRhaWwocGFyYW1zLmlkKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBcdTVCODlcdTUxNjhcdTVFOTNcdTVCNThcdThCQkVcdTdGNkVcdTc2RjhcdTUxNzNNb2NrIEFQSVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NUI4OVx1NTE2OFx1NUU5M1x1NUI1OFx1OTE0RFx1N0Y2RVx1NTIxN1x1ODg2OFxuICB7XG4gICAgdXJsOiAnL2FwaS9zYWZldHktc3RvY2svY29uZmlncycsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKHJlcTogYW55KSA9PiB7XG4gICAgICBjb25zdCB7IGxldmVsLCBzdGF0dXMsIGNoYW5uZWxJZCwgc3RvcmVJZCwgc2t1LCBrZXl3b3JkLCBwYWdlID0gMSwgcGFnZVNpemUgPSAyMCB9ID0gcmVxLnF1ZXJ5IHx8IHt9XG4gICAgICBcbiAgICAgIGxldCBmaWx0ZXJlZENvbmZpZ3MgPSBbLi4ubW9ja1NhZmV0eVN0b2NrQ29uZmlnc11cbiAgICAgIFxuICAgICAgLy8gXHU4RkM3XHU2RUU0XHU5MDNCXHU4RjkxXG4gICAgICBpZiAobGV2ZWwpIHtcbiAgICAgICAgZmlsdGVyZWRDb25maWdzID0gZmlsdGVyZWRDb25maWdzLmZpbHRlcihjID0+IGMubGV2ZWwgPT09IGxldmVsKVxuICAgICAgfVxuICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICBmaWx0ZXJlZENvbmZpZ3MgPSBmaWx0ZXJlZENvbmZpZ3MuZmlsdGVyKGMgPT4gYy5zdGF0dXMgPT09IHN0YXR1cylcbiAgICAgIH1cbiAgICAgIGlmIChjaGFubmVsSWQpIHtcbiAgICAgICAgZmlsdGVyZWRDb25maWdzID0gZmlsdGVyZWRDb25maWdzLmZpbHRlcihjID0+IFxuICAgICAgICAgICgnY2hhbm5lbElkJyBpbiBjICYmIGMuY2hhbm5lbElkID09PSBjaGFubmVsSWQpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGlmIChzdG9yZUlkKSB7XG4gICAgICAgIGZpbHRlcmVkQ29uZmlncyA9IGZpbHRlcmVkQ29uZmlncy5maWx0ZXIoYyA9PiBcbiAgICAgICAgICAoJ3N0b3JlSWQnIGluIGMgJiYgYy5zdG9yZUlkID09PSBzdG9yZUlkKVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBpZiAoc2t1KSB7XG4gICAgICAgIGZpbHRlcmVkQ29uZmlncyA9IGZpbHRlcmVkQ29uZmlncy5maWx0ZXIoYyA9PiBcbiAgICAgICAgICAoJ3NrdScgaW4gYyAmJiBjLnNrdSA9PT0gc2t1KVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBpZiAoa2V5d29yZCkge1xuICAgICAgICBmaWx0ZXJlZENvbmZpZ3MgPSBmaWx0ZXJlZENvbmZpZ3MuZmlsdGVyKGMgPT4gXG4gICAgICAgICAgYy5kZXNjcmlwdGlvbj8uaW5jbHVkZXMoa2V5d29yZCkgfHxcbiAgICAgICAgICAoJ3Byb2R1Y3ROYW1lJyBpbiBjICYmIGMucHJvZHVjdE5hbWU/LmluY2x1ZGVzKGtleXdvcmQpKVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NTIwNlx1OTg3NVxuICAgICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogcGFnZVNpemVcbiAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgcGFnZVNpemVcbiAgICAgIGNvbnN0IHBhZ2luYXRlZERhdGEgPSBmaWx0ZXJlZENvbmZpZ3Muc2xpY2Uoc3RhcnQsIGVuZClcbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZGF0YTogcGFnaW5hdGVkRGF0YSxcbiAgICAgICAgICB0b3RhbDogZmlsdGVyZWRDb25maWdzLmxlbmd0aCxcbiAgICAgICAgICBwYWdlOiBwYXJzZUludChwYWdlKSxcbiAgICAgICAgICBwYWdlU2l6ZTogcGFyc2VJbnQocGFnZVNpemUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTVCODlcdTUxNjhcdTVFOTNcdTVCNThcdTkxNERcdTdGNkVcdThCRTZcdTYwQzVcbiAge1xuICAgIHVybDogJy9hcGkvc2FmZXR5LXN0b2NrL2NvbmZpZ3MvOmlkJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAocmVxOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXNcbiAgICAgIGNvbnN0IGNvbmZpZ0l0ZW0gPSBtb2NrU2FmZXR5U3RvY2tDb25maWdzLmZpbmQoYyA9PiBjLmlkID09PSBpZClcbiAgICAgIFxuICAgICAgaWYgKGNvbmZpZ0l0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHsgY29kZTogMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnLCBkYXRhOiBjb25maWdJdGVtIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGNvZGU6IDQwNCwgbWVzc2FnZTogJ0NvbmZpZyBub3QgZm91bmQnIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFxuICAvLyBcdTUyMUJcdTVFRkFcdTVCODlcdTUxNjhcdTVFOTNcdTVCNThcdTkxNERcdTdGNkVcbiAge1xuICAgIHVybDogJy9hcGkvc2FmZXR5LXN0b2NrL2NvbmZpZ3MnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHJlc3BvbnNlOiAocmVxOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHJlcXVlc3REYXRhID0gcmVxLmJvZHlcbiAgICAgIGNvbnN0IG5ld0NvbmZpZ3MgPSByZXF1ZXN0RGF0YS5jb25maWdzLm1hcCgoY29uZmlnRGF0YTogYW55KSA9PiAoe1xuICAgICAgICBpZDogYFNTQy0ke0RhdGUubm93KCl9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpfWAsXG4gICAgICAgIC4uLmNvbmZpZ0RhdGEsXG4gICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgY3JlYXRlZEJ5OiAnY3VycmVudF91c2VyJyxcbiAgICAgICAgdXBkYXRlZEJ5OiAnY3VycmVudF91c2VyJ1xuICAgICAgfSkpXG4gICAgICBcbiAgICAgIG1vY2tTYWZldHlTdG9ja0NvbmZpZ3MucHVzaCguLi5uZXdDb25maWdzKVxuICAgICAgcmV0dXJuIHsgY29kZTogMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnLCBkYXRhOiBuZXdDb25maWdzIH1cbiAgICB9XG4gIH0sXG4gIFxuICAvLyBcdTgzQjdcdTUzRDZcdTVFOTNcdTVCNThcdTk4ODRcdThCNjZcdTUyMTdcdTg4NjhcbiAge1xuICAgIHVybDogJy9hcGkvc2FmZXR5LXN0b2NrL2FsZXJ0cycsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKHJlcTogYW55KSA9PiB7XG4gICAgICBjb25zdCB7IHBhZ2UgPSAxLCBwYWdlU2l6ZSA9IDIwLCBsZXZlbCwgYWxlcnRUeXBlLCBzdGF0dXMsIHN0b3JlSWQsIGNoYW5uZWxJZCwgc2t1IH0gPSByZXEucXVlcnkgfHwge31cbiAgICAgIFxuICAgICAgbGV0IGZpbHRlcmVkQWxlcnRzID0gWy4uLm1vY2tTdG9ja0FsZXJ0c11cbiAgICAgIFxuICAgICAgaWYgKGxldmVsKSBmaWx0ZXJlZEFsZXJ0cyA9IGZpbHRlcmVkQWxlcnRzLmZpbHRlcihhID0+IGEubGV2ZWwgPT09IGxldmVsKVxuICAgICAgaWYgKGFsZXJ0VHlwZSkgZmlsdGVyZWRBbGVydHMgPSBmaWx0ZXJlZEFsZXJ0cy5maWx0ZXIoYSA9PiBhLmFsZXJ0VHlwZSA9PT0gYWxlcnRUeXBlKVxuICAgICAgaWYgKHN0YXR1cykgZmlsdGVyZWRBbGVydHMgPSBmaWx0ZXJlZEFsZXJ0cy5maWx0ZXIoYSA9PiBhLnN0YXR1cyA9PT0gc3RhdHVzKVxuICAgICAgaWYgKHN0b3JlSWQpIGZpbHRlcmVkQWxlcnRzID0gZmlsdGVyZWRBbGVydHMuZmlsdGVyKGEgPT4gYS5zdG9yZUlkID09PSBzdG9yZUlkKVxuICAgICAgaWYgKGNoYW5uZWxJZCkgZmlsdGVyZWRBbGVydHMgPSBmaWx0ZXJlZEFsZXJ0cy5maWx0ZXIoYSA9PiBhLmNoYW5uZWxJZCA9PT0gY2hhbm5lbElkKVxuICAgICAgaWYgKHNrdSkgZmlsdGVyZWRBbGVydHMgPSBmaWx0ZXJlZEFsZXJ0cy5maWx0ZXIoYSA9PiBhLnNrdSA9PT0gc2t1KVxuICAgICAgXG4gICAgICBjb25zdCBzdGFydCA9IChwYWdlIC0gMSkgKiBwYWdlU2l6ZVxuICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyBwYWdlU2l6ZVxuICAgICAgY29uc3QgcGFnaW5hdGVkRGF0YSA9IGZpbHRlcmVkQWxlcnRzLnNsaWNlKHN0YXJ0LCBlbmQpXG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRhdGE6IHBhZ2luYXRlZERhdGEsXG4gICAgICAgICAgdG90YWw6IGZpbHRlcmVkQWxlcnRzLmxlbmd0aFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU3RURGXHU4QkExXHU2NTcwXHU2MzZFXG4gIHtcbiAgICB1cmw6ICcvYXBpL3NhZmV0eS1zdG9jay9zdGF0cycsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKCkgPT4ge1xuICAgICAgcmV0dXJuIHsgY29kZTogMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnLCBkYXRhOiBtb2NrU2FmZXR5U3RvY2tTdGF0cyB9XG4gICAgfVxuICB9LFxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU2RTIwXHU5MDUzXHU1MjE3XHU4ODY4XG4gIHtcbiAgICB1cmw6ICcvYXBpL3NhZmV0eS1zdG9jay9jaGFubmVscycsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKCkgPT4ge1xuICAgICAgcmV0dXJuIHsgY29kZTogMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnLCBkYXRhOiBtb2NrQ2hhbm5lbHMgfVxuICAgIH1cbiAgfSxcbiAgXG4gIC8vIFx1ODNCN1x1NTNENlx1NUU5N1x1OTRGQVx1NTIxN1x1ODg2OFxuICB7XG4gICAgdXJsOiAnL2FwaS9zYWZldHktc3RvY2svc3RvcmVzJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAocmVxOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHsgY2hhbm5lbElkIH0gPSByZXEucXVlcnkgfHwge31cbiAgICAgIFxuICAgICAgbGV0IGZpbHRlcmVkU3RvcmVzID0gWy4uLm1vY2tTdG9yZXNdXG4gICAgICBpZiAoY2hhbm5lbElkKSB7XG4gICAgICAgIGZpbHRlcmVkU3RvcmVzID0gZmlsdGVyZWRTdG9yZXMuZmlsdGVyKHMgPT4gcy5jaGFubmVsSWQgPT09IGNoYW5uZWxJZClcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHsgY29kZTogMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnLCBkYXRhOiBmaWx0ZXJlZFN0b3JlcyB9XG4gICAgfVxuICB9LFxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU0RUQzXHU1RTkzXHU1MjE3XHU4ODY4XG4gIHtcbiAgICB1cmw6ICcvYXBpL3NhZmV0eS1zdG9jay93YXJlaG91c2VzJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XG4gICAgICByZXR1cm4geyBjb2RlOiAwLCBtZXNzYWdlOiAnc3VjY2VzcycsIGRhdGE6IG1vY2tXYXJlaG91c2VzIH1cbiAgICB9XG4gIH0sXG4gIFxuICAvLyBcdTY0MUNcdTdEMjJTS1VcbiAge1xuICAgIHVybDogJy9hcGkvc2FmZXR5LXN0b2NrL3NrdXMvc2VhcmNoJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAocmVxOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHsga2V5d29yZCwgc3RvcmVJZCwgY2hhbm5lbElkLCBwYWdlID0gMSwgcGFnZVNpemUgPSAyMCB9ID0gcmVxLnF1ZXJ5IHx8IHt9XG4gICAgICBcbiAgICAgIGxldCBmaWx0ZXJlZFNrdXMgPSBbLi4ubW9ja1NrdXNdXG4gICAgICBcbiAgICAgIGlmIChrZXl3b3JkKSB7XG4gICAgICAgIGZpbHRlcmVkU2t1cyA9IGZpbHRlcmVkU2t1cy5maWx0ZXIocyA9PiBcbiAgICAgICAgICBzLnNrdS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQudG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICBzLnByb2R1Y3ROYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZC50b0xvd2VyQ2FzZSgpKVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2UgLSAxKSAqIHBhZ2VTaXplXG4gICAgICBjb25zdCBlbmQgPSBzdGFydCArIHBhZ2VTaXplXG4gICAgICBjb25zdCBwYWdpbmF0ZWREYXRhID0gZmlsdGVyZWRTa3VzLnNsaWNlKHN0YXJ0LCBlbmQpXG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRhdGE6IHBhZ2luYXRlZERhdGEsXG4gICAgICAgICAgdG90YWw6IGZpbHRlcmVkU2t1cy5sZW5ndGhcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgXG4gIC8vIFx1ODNCN1x1NTNENlNLVVx1NEZFMVx1NjA2RlxuICB7XG4gICAgdXJsOiAnL2FwaS9zYWZldHktc3RvY2svc2t1cy86c2t1JyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAocmVxOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHsgc2t1IH0gPSByZXEucGFyYW1zXG4gICAgICBjb25zdCBza3VJbmZvID0gbW9ja1NrdXMuZmluZChzID0+IHMuc2t1ID09PSBza3UpXG4gICAgICBcbiAgICAgIGlmIChza3VJbmZvKSB7XG4gICAgICAgIHJldHVybiB7IGNvZGU6IDAsIG1lc3NhZ2U6ICdzdWNjZXNzJywgZGF0YTogc2t1SW5mbyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDQsIG1lc3NhZ2U6ICdTS1Ugbm90IGZvdW5kJyB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcbiAgLy8gXHU4M0I3XHU1M0Q2XHU5ODg0XHU4QkJFXHU5MTREXHU3RjZFXHU1MjE3XHU4ODY4XG4gIHtcbiAgICB1cmw6ICcvYXBpL3NhZmV0eS1zdG9jay9wcmVzZXRzJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XG4gICAgICByZXR1cm4geyBjb2RlOiAwLCBtZXNzYWdlOiAnc3VjY2VzcycsIGRhdGE6IG1vY2tQcmVzZXRzIH1cbiAgICB9XG4gIH1cbl0gYXMgTW9ja01ldGhvZFtdXG5cbmV4cG9ydCBkZWZhdWx0IG1vY2tIYW5kbGVycyAiLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFxtb2NrXFxcXHF1ZXJ5VG9vbERhdGEudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSmF5bmVcXFxcRGVza3RvcFxcXFxVTklTXFxcXE9NU1x1OTg3OVx1NzZFRVxcXFxzcmNcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vQzovVXNlcnMvSmF5bmUvRGVza3RvcC9VTklTL09NUyVFOSVBMSVCOSVFNyU5QiVBRS9zcmMvbW9jay9xdWVyeVRvb2xEYXRhLnRzXCI7aW1wb3J0IHsgT3JkZXJEYXRhLCBTeXN0ZW1PcmRlckRhdGEsIFByb2R1Y3REYXRhLCBJbnZlbnRvcnlEYXRhLCBDdXN0b21lciwgQ2hhbm5lbCwgUXVlcnlQYXJhbXMsIFBhZ2luYXRlZFJlc3BvbnNlIH0gZnJvbSAnQC90eXBlcy9xdWVyeVRvb2xUeXBlcydcclxuXHJcbi8vIFx1NUJBMlx1NjIzN1x1NjU3MFx1NjM2RVxyXG5leHBvcnQgY29uc3QgY3VzdG9tZXJzOiBDdXN0b21lcltdID0gW1xyXG4gIHsgaWQ6ICdueWYnLCBuYW1lOiAnXHU3RUJEXHU3RUE2XHU2NzBEXHU5OTcwJywgY29kZTogJ05ZRicgfSxcclxuICB7IGlkOiAnY2F0JywgbmFtZTogJ1x1NTJBMFx1NURERVx1NzlEMVx1NjI4MCcsIGNvZGU6ICdDQVQnIH0sXHJcbiAgeyBpZDogJ3R4ZScsIG5hbWU6ICdcdTVGQjdcdTUxNEJcdTg0MjhcdTY1QUZcdTc1MzVcdTVCNTAnLCBjb2RlOiAnVFhFJyB9LFxyXG4gIHsgaWQ6ICdjaGknLCBuYW1lOiAnXHU4MjlEXHU1MkEwXHU1NEU1XHU5OERGXHU1NEMxJywgY29kZTogJ0NISScgfSxcclxuICB7IGlkOiAnc2VhJywgbmFtZTogJ1x1ODk3Rlx1OTZDNVx1NTZGRVx1NTQ5Nlx1NTU2MScsIGNvZGU6ICdTRUEnIH1cclxuXVxyXG5cclxuLy8gXHU2RTIwXHU5MDUzXHU2NTcwXHU2MzZFXHJcbmV4cG9ydCBjb25zdCBjaGFubmVsTWFwOiBSZWNvcmQ8c3RyaW5nLCBDaGFubmVsW10+ID0ge1xyXG4gIG55ZjogW1xyXG4gICAgeyBpZDogJ2FtYXpvbicsIG5hbWU6ICdBbWF6b24nLCBjb2RlOiAnQU1aJywgdHlwZTogJ21hcmtldHBsYWNlJyB9LFxyXG4gICAgeyBpZDogJ3Nob3BpZnknLCBuYW1lOiAnU2hvcGlmeScsIGNvZGU6ICdTSEYnLCB0eXBlOiAnZWNvbW1lcmNlJyB9LFxyXG4gICAgeyBpZDogJ3dhbG1hcnQnLCBuYW1lOiAnV2FsbWFydCcsIGNvZGU6ICdXTVQnLCB0eXBlOiAnbWFya2V0cGxhY2UnIH1cclxuICBdLFxyXG4gIGNhdDogW1xyXG4gICAgeyBpZDogJ2FtYXpvbicsIG5hbWU6ICdBbWF6b24nLCBjb2RlOiAnQU1aJywgdHlwZTogJ21hcmtldHBsYWNlJyB9LFxyXG4gICAgeyBpZDogJ2ViYXknLCBuYW1lOiAnZUJheScsIGNvZGU6ICdFQlknLCB0eXBlOiAnbWFya2V0cGxhY2UnIH0sXHJcbiAgICB7IGlkOiAnc2hvcGlmeScsIG5hbWU6ICdTaG9waWZ5JywgY29kZTogJ1NIRicsIHR5cGU6ICdlY29tbWVyY2UnIH1cclxuICBdLFxyXG4gIHR4ZTogW1xyXG4gICAgeyBpZDogJ2FtYXpvbicsIG5hbWU6ICdBbWF6b24nLCBjb2RlOiAnQU1aJywgdHlwZTogJ21hcmtldHBsYWNlJyB9LFxyXG4gICAgeyBpZDogJ2ViYXknLCBuYW1lOiAnZUJheScsIGNvZGU6ICdFQlknLCB0eXBlOiAnbWFya2V0cGxhY2UnIH0sXHJcbiAgICB7IGlkOiAnd2FsbWFydCcsIG5hbWU6ICdXYWxtYXJ0JywgY29kZTogJ1dNVCcsIHR5cGU6ICdtYXJrZXRwbGFjZScgfVxyXG4gIF0sXHJcbiAgY2hpOiBbXHJcbiAgICB7IGlkOiAnYW1hem9uJywgbmFtZTogJ0FtYXpvbicsIGNvZGU6ICdBTVonLCB0eXBlOiAnbWFya2V0cGxhY2UnIH0sXHJcbiAgICB7IGlkOiAnc2hvcGlmeScsIG5hbWU6ICdTaG9waWZ5JywgY29kZTogJ1NIRicsIHR5cGU6ICdlY29tbWVyY2UnIH1cclxuICBdLFxyXG4gIHNlYTogW1xyXG4gICAgeyBpZDogJ2FtYXpvbicsIG5hbWU6ICdBbWF6b24nLCBjb2RlOiAnQU1aJywgdHlwZTogJ21hcmtldHBsYWNlJyB9LFxyXG4gICAgeyBpZDogJ3Nob3BpZnknLCBuYW1lOiAnU2hvcGlmeScsIGNvZGU6ICdTSEYnLCB0eXBlOiAnZWNvbW1lcmNlJyB9LFxyXG4gICAgeyBpZDogJ2ViYXknLCBuYW1lOiAnZUJheScsIGNvZGU6ICdFQlknLCB0eXBlOiAnbWFya2V0cGxhY2UnIH1cclxuICBdXHJcbn1cclxuXHJcbi8vIFx1OEJBMlx1NTM1NVx1NTU0Nlx1NTRDMVx1OTg3OVxyXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVySXRlbSB7XHJcbiAgc2t1OiBzdHJpbmc7XHJcbiAgcHJvZHVjdE5hbWU6IHN0cmluZztcclxuICBxdWFudGl0eTogbnVtYmVyO1xyXG4gIHByaWNlOiBudW1iZXI7XHJcbiAgdG90YWw6IG51bWJlcjtcclxuICBmdWxmaWxsbWVudFN0YXR1cz86IHN0cmluZztcclxufVxyXG5cclxuLy8gXHU4QkEyXHU1MzU1XHU2NTcwXHU2MzZFXHJcbmV4cG9ydCBjb25zdCBvcmRlckxpc3Q6IE9yZGVyRGF0YVtdID0gW1xyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnQU1aLTEyMzQ1Njc4OScsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tOTg3NjU0MzIxJyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RhdHVzOiAnXHU1REYyXHU1QjhDXHU2MjEwJyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICBhbW91bnQ6IDI5OS45OSxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gODY0MDAwMDAsIC8vIFx1NEUwMFx1NTkyOVx1NTI0RFxyXG4gICAgc3lzdGVtQ3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA4NTAwMDAwMCwgXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHNrdTogJ1NLVTAwMScsIHByb2R1Y3ROYW1lOiAnXHU5QUQ4XHU1NEMxXHU4RDI4XHU2NUUwXHU3RUJGXHU4NEREXHU3MjU5XHU4MDMzXHU2NzNBJywgcXVhbnRpdHk6IDIsIHByaWNlOiA5OS45OSwgdG90YWw6IDE5OS45OCwgZnVsZmlsbG1lbnRTdGF0dXM6ICdcdTVERjJcdTUzRDFcdThEMjcnIH0sXHJcbiAgICAgIHsgc2t1OiAnU0tVMDAyJywgcHJvZHVjdE5hbWU6ICdcdTY2N0FcdTgwRkRcdTYyNEJcdTg4NjgnLCBxdWFudGl0eTogMSwgcHJpY2U6IDEwMC4wMSwgdG90YWw6IDEwMC4wMSwgZnVsZmlsbG1lbnRTdGF0dXM6ICdcdTVERjJcdTUzRDFcdThEMjcnIH1cclxuICAgIF0sXHJcbiAgICBjaGFubmVsU3RhdHVzOiAnU2hpcHBlZCcsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdTSEYtOTg3NjU0MzIxJyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy0xMjM0NTY3ODknLFxyXG4gICAgY2hhbm5lbDogJ3Nob3BpZnknLFxyXG4gICAgc3RhdHVzOiAnXHU1OTA0XHU3NDA2XHU0RTJEJyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1Njc0RVx1NTZEQicsXHJcbiAgICBhbW91bnQ6IDQ5OS45OSxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNDMyMDAwMDAsIC8vIDEyXHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgICBzeXN0ZW1DcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDQyMDAwMDAwLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMDMnLCBwcm9kdWN0TmFtZTogJ1x1OEQ4NVx1ODU4NFx1N0IxNFx1OEJCMFx1NjcyQ1x1NzUzNVx1ODExMScsIHF1YW50aXR5OiAxLCBwcmljZTogNDk5Ljk5LCB0b3RhbDogNDk5Ljk5LCBmdWxmaWxsbWVudFN0YXR1czogJ1x1NUY4NVx1NTNEMVx1OEQyNycgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdQcm9jZXNzaW5nJyxcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnV01ULTQ1Njc4OTEyMycsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiBudWxsLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgc3RhdHVzOiBudWxsLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU3MzhCXHU0RTk0JyxcclxuICAgIGFtb3VudDogMTU5Ljk5LFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyMTYwMDAwMCwgLy8gNlx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMDQnLCBwcm9kdWN0TmFtZTogJ1x1OTYzMlx1NkMzNFx1OEZEMFx1NTJBOFx1NzZGOFx1NjczQScsIHF1YW50aXR5OiAzLCBwcmljZTogNTMuMzMsIHRvdGFsOiAxNTkuOTksIGZ1bGZpbGxtZW50U3RhdHVzOiAnXHU1REYyXHU5MDAwXHU2QjNFJyB9XHJcbiAgICBdLFxyXG4gICAgY2hhbm5lbFN0YXR1czogJ1BlbmRpbmcnLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnQU1aLTIzNDU2Nzg5MScsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tMzQ1Njc4OTEyJyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RhdHVzOiAnXHU1Rjg1XHU1OTA0XHU3NDA2JyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1OEQ3NVx1NTE2RCcsXHJcbiAgICBhbW91bnQ6IDg5Ljk1LFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAzNjAwMDAwLCAvLyAxXHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHNrdTogJ1NLVTAwNScsIHByb2R1Y3ROYW1lOiAnXHU0RkJGXHU2NDNBXHU1RjBGXHU1MTQ1XHU3NTM1XHU1QjlEJywgcXVhbnRpdHk6IDEsIHByaWNlOiAzOS45OSwgdG90YWw6IDM5Ljk5LCBmdWxmaWxsbWVudFN0YXR1czogJ1x1NUY4NVx1NTNEMVx1OEQyNycgfSxcclxuICAgICAgeyBza3U6ICdTS1UwMDYnLCBwcm9kdWN0TmFtZTogJ1x1NjU3MFx1NjM2RVx1N0VCRlx1NTk1N1x1ODhDNScsIHF1YW50aXR5OiAyLCBwcmljZTogMjQuOTgsIHRvdGFsOiA0OS45NiwgZnVsZmlsbG1lbnRTdGF0dXM6ICdcdTVGODVcdTUzRDFcdThEMjcnIH1cclxuICAgIF0sXHJcbiAgICBjaGFubmVsU3RhdHVzOiAnVW5zaGlwcGVkJyxcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBjaGFubmVsT3JkZXJJZDogJ0VCWS0zNDU2Nzg5MTInLFxyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTU2Nzg5MTIzNCcsXHJcbiAgICBjaGFubmVsOiAnZWJheScsXHJcbiAgICBzdGF0dXM6ICdcdTVERjJcdTVCOENcdTYyMTAnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU5NEIxXHU0RTAzJyxcclxuICAgIGFtb3VudDogNTkuOTksXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDE3MjgwMDAwMCwgLy8gMlx1NTkyOVx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMDcnLCBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1NUJCNlx1NUM0NVx1NjNBN1x1NTIzNlx1NTY2OCcsIHF1YW50aXR5OiAxLCBwcmljZTogNTkuOTksIHRvdGFsOiA1OS45OSwgZnVsZmlsbG1lbnRTdGF0dXM6ICdcdTVERjJcdTUzRDFcdThEMjcnIH1cclxuICAgIF0sXHJcbiAgICBjaGFubmVsU3RhdHVzOiAnRGVsaXZlcmVkJyxcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnU0hGLTQ1Njc4OTEyMycsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tNjc4OTEyMzQ1JyxcclxuICAgIGNoYW5uZWw6ICdzaG9waWZ5JyxcclxuICAgIHN0YXR1czogJ1x1NUYwMlx1NUUzOCcsXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCNTlcdTUxNkInLFxyXG4gICAgYW1vdW50OiAxMjkuOTgsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDI1OTIwMDAwMCwgLy8gM1x1NTkyOVx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMDgnLCBwcm9kdWN0TmFtZTogJ1x1NjVFMFx1N0VCRlx1OTUyRVx1OUYyMFx1NTk1N1x1ODhDNScsIHF1YW50aXR5OiAxLCBwcmljZTogNzkuOTksIHRvdGFsOiA3OS45OSB9LFxyXG4gICAgICB7IHNrdTogJ1NLVTAwOScsIHByb2R1Y3ROYW1lOiAnXHU5RjIwXHU2ODA3XHU1N0FCJywgcXVhbnRpdHk6IDEsIHByaWNlOiA0OS45OSwgdG90YWw6IDQ5Ljk5IH1cclxuICAgIF0sXHJcbiAgICBjaGFubmVsU3RhdHVzOiAnUGF5bWVudCBGYWlsZWQnLFxyXG4gICAgc3RvcmU6ICdDTiBTdG9yZSdcclxuICB9LFxyXG4gIC8vIFx1NjVCMFx1NTg5RVx1OEJBMlx1NTM1NVx1NjU3MFx1NjM2RVxyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnQU1aLTU2Nzg5MTIzNCcsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tNzg5MTIzNDU2JyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RhdHVzOiAnXHU1REYyXHU1QjhDXHU2MjEwJyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NTQ2OFx1NEU1RCcsXHJcbiAgICBhbW91bnQ6IDEyOTkuOTksXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM0NTYwMDAwMCwgLy8gNFx1NTkyOVx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMTAnLCBwcm9kdWN0TmFtZTogJ1x1NkUzOFx1NjIwRlx1N0IxNFx1OEJCMFx1NjcyQ1x1NzUzNVx1ODExMScsIHF1YW50aXR5OiAxLCBwcmljZTogMTI5OS45OSwgdG90YWw6IDEyOTkuOTkgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdEZWxpdmVyZWQnLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnV01ULTY3ODkxMjM0NScsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tODkxMjM0NTY3JyxcclxuICAgIGNoYW5uZWw6ICd3YWxtYXJ0JyxcclxuICAgIHN0YXR1czogJ1x1NURGMlx1NUI4Q1x1NjIxMCcsXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTU0MzRcdTUzNDEnLFxyXG4gICAgYW1vdW50OiAyNDkuOTksXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDQzMjAwMDAwMCwgLy8gNVx1NTkyOVx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMTEnLCBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1OTdGM1x1N0JCMScsIHF1YW50aXR5OiAyLCBwcmljZTogMTI0Ljk5LCB0b3RhbDogMjQ5Ljk4IH1cclxuICAgIF0sXHJcbiAgICBjaGFubmVsU3RhdHVzOiAnU2hpcHBlZCcsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdFQlktNzg5MTIzNDU2JyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy05MTIzNDU2NzgnLFxyXG4gICAgY2hhbm5lbDogJ2ViYXknLFxyXG4gICAgc3RhdHVzOiAnXHU1OTA0XHU3NDA2XHU0RTJEJyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1OTBEMVx1NTM0MVx1NEUwMCcsXHJcbiAgICBhbW91bnQ6IDc5Ljk5LFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA1MTg0MDAwMDAsIC8vIDZcdTU5MjlcdTUyNERcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgc2t1OiAnU0tVMDEyJywgcHJvZHVjdE5hbWU6ICdcdTY2N0FcdTgwRkRcdTcwNkZcdTZDRTFcdTU5NTdcdTg4QzUnLCBxdWFudGl0eTogNCwgcHJpY2U6IDE5Ljk5LCB0b3RhbDogNzkuOTYgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdQcm9jZXNzaW5nJyxcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBjaGFubmVsT3JkZXJJZDogJ1NIRi04OTEyMzQ1NjcnLFxyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTEyMzc4OTQ1NicsXHJcbiAgICBjaGFubmVsOiAnc2hvcGlmeScsXHJcbiAgICBzdGF0dXM6ICdcdTVGODVcdTU5MDRcdTc0MDYnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU3MzhCXHU0RTk0JyxcclxuICAgIGFtb3VudDogMzk5Ljk4LFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA2MDQ4MDAwMDAsIC8vIDdcdTU5MjlcdTUyNERcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgc2t1OiAnU0tVMDEzJywgcHJvZHVjdE5hbWU6ICdcdTY1RTBcdTdFQkZcdTgwMzNcdTY3M0EnLCBxdWFudGl0eTogMiwgcHJpY2U6IDE5OS45OSwgdG90YWw6IDM5OS45OCB9XHJcbiAgICBdLFxyXG4gICAgY2hhbm5lbFN0YXR1czogJ0F3YWl0aW5nIEZ1bGZpbGxtZW50JyxcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnQU1aLTkxMjM0NTY3OCcsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tMjM0ODkxNTY3JyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RhdHVzOiAnXHU1RjAyXHU1RTM4JyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICBhbW91bnQ6IDU5Ljk3LFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA2OTEyMDAwMDAsIC8vIDhcdTU5MjlcdTUyNERcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgc2t1OiAnU0tVMDE0JywgcHJvZHVjdE5hbWU6ICdcdTYyNEJcdTY3M0FcdTRGRERcdTYyQTRcdTU4RjMnLCBxdWFudGl0eTogMywgcHJpY2U6IDE5Ljk5LCB0b3RhbDogNTkuOTcgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdFcnJvcicsXHJcbiAgICBzdG9yZTogJ0VVIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdXTVQtMTIzNzg5NDU2JyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy0zNDU5MTI2NzgnLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgc3RhdHVzOiAnXHU1REYyXHU1QjhDXHU2MjEwJyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1Njc0RVx1NTZEQicsXHJcbiAgICBhbW91bnQ6IDI5Ljk5LFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA3Nzc2MDAwMDAsIC8vIDlcdTU5MjlcdTUyNERcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgc2t1OiAnU0tVMDE1JywgcHJvZHVjdE5hbWU6ICdcdTYyNEJcdTY3M0FcdTY1MkZcdTY3QjYnLCBxdWFudGl0eTogMSwgcHJpY2U6IDI5Ljk5LCB0b3RhbDogMjkuOTkgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdEZWxpdmVyZWQnLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZSdcclxuICB9XHJcbl1cclxuXHJcbi8vIFx1N0NGQlx1N0VERlx1OEJBMlx1NTM1NVx1NjU3MFx1NjM2RVxyXG5leHBvcnQgY29uc3Qgc3lzdGVtT3JkZXJMaXN0OiBTeXN0ZW1PcmRlckRhdGFbXSA9IFtcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tOTg3NjU0MzIxJyxcclxuICAgIHN0YXR1czogJ1x1NURGMlx1NUI4Q1x1NjIxMCcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDg2NDAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA0MzIwMDAwMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTEyMzQ1Njc4OScsXHJcbiAgICBzdGF0dXM6ICdcdTU5MDRcdTc0MDZcdTRFMkQnLFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA0MzIwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjE2MDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy00NTY3ODkxMjMnLFxyXG4gICAgc3RhdHVzOiAnXHU1RjAyXHU1RTM4JyxcclxuICAgIGVycm9yUmVhc29uOiAnXHU1NzMwXHU1NzQwXHU0RkUxXHU2MDZGXHU0RTBEXHU1QjhDXHU2NTc0XHVGRjBDXHU3RjNBXHU1QzExXHU4ODU3XHU5MDUzXHU1M0Y3XHU3ODAxXHVGRjBDXHU2NUUwXHU2Q0Q1XHU1QjhDXHU2MjEwXHU5MTREXHU5MDAxXHU1NzMwXHU1NzQwXHU5QThDXHU4QkMxJyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjE2MDAwMDAsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM2MDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy0zNDU2Nzg5MTInLFxyXG4gICAgc3RhdHVzOiAnXHU1Rjg1XHU1OTA0XHU3NDA2JyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMzYwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTgwMDAwMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTU2Nzg5MTIzNCcsXHJcbiAgICBzdGF0dXM6ICdcdTVERjJcdTVCOENcdTYyMTAnLFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxNzI4MDAwMDAsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDg2NDAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tNjc4OTEyMzQ1JyxcclxuICAgIHN0YXR1czogJ1x1NUYwMlx1NUUzOCcsXHJcbiAgICBlcnJvclJlYXNvbjogJ1x1NEVEOFx1NkIzRVx1NEZFMVx1NjA2Rlx1OUE4Q1x1OEJDMVx1NTkzMVx1OEQyNVx1RkYwQ1x1OTRGNlx1ODg0Q1x1NTM2MVx1NTNGN1x1NjVFMFx1NjU0OCcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDI1OTIwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTcyODAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tNzg5MTIzNDU2JyxcclxuICAgIHN0YXR1czogJ1x1NURGMlx1NUI4Q1x1NjIxMCcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM0NTYwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjU5MjAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tODkxMjM0NTY3JyxcclxuICAgIHN0YXR1czogJ1x1NURGMlx1NUI4Q1x1NjIxMCcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDQzMjAwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMzQ1NjAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tOTEyMzQ1Njc4JyxcclxuICAgIHN0YXR1czogJ1x1NTkwNFx1NzQwNlx1NEUyRCcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDUxODQwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNDMyMDAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tMTIzNzg5NDU2JyxcclxuICAgIHN0YXR1czogJ1x1NUY4NVx1NTkwNFx1NzQwNicsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDYwNDgwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNTE4NDAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tMjM0ODkxNTY3JyxcclxuICAgIHN0YXR1czogJ1x1NUYwMlx1NUUzOCcsXHJcbiAgICBlcnJvclJlYXNvbjogJ1x1NTU0Nlx1NTRDMVx1NUU5M1x1NUI1OFx1NEUwRFx1OERCM1x1RkYwQ1x1NjVFMFx1NkNENVx1NkVFMVx1OERCM1x1OEJBMlx1NTM1NVx1OTcwMFx1NkM0MicsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDY5MTIwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNjA0ODAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tMzQ1OTEyNjc4JyxcclxuICAgIHN0YXR1czogJ1x1NURGMlx1NUI4Q1x1NjIxMCcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDc3NzYwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNjkxMjAwMDAwXHJcbiAgfVxyXG5dXHJcblxyXG4vLyBcdTU1NDZcdTU0QzFcdTY1NzBcdTYzNkVcclxuZXhwb3J0IGNvbnN0IHByb2R1Y3RMaXN0OiBQcm9kdWN0RGF0YVtdID0gW1xyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAwMScsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1OUFEOFx1NTRDMVx1OEQyOFx1NjVFMFx1N0VCRlx1ODRERFx1NzI1OVx1ODAzM1x1NjczQScsXHJcbiAgICBjaGFubmVsU2t1OiAnQU1aLVNLVTAwMScsXHJcbiAgICBjaGFubmVsOiAnYW1hem9uJyxcclxuICAgIHByaWNlOiA5OS45OSxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRScsXHJcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2VzL2hlYWRwaG9uZXMuanBnJyxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTcyODAwMDAwLCAvLyAyXHU1OTI5XHU1MjREXHJcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gODY0MDAwMDAsIC8vIDFcdTU5MjlcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0EnLFxyXG4gICAgc3RvY2s6IDMwLFxyXG4gICAgd21zU3RvY2s6IDQ1LFxyXG4gICAgbGFzdFN5bmNTdG9jazogMzgsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJyxcclxuICAgIG1hc3RlclNrdTogJ01TLTAwMScsXHJcbiAgICBtYXN0ZXJQcm9kdWN0TmFtZTogJ01hc3RlciBcdTg0RERcdTcyNTlcdTgwMzNcdTY3M0EnLFxyXG4gICAgd2FyZWhvdXNlU3RvY2s6IHtcclxuICAgICAgVVM6IDIwLFxyXG4gICAgICBFVTogMTUsXHJcbiAgICAgIENOOiAxMFxyXG4gICAgfSxcclxuICAgIHN5bmNSdWxlOiB7XHJcbiAgICAgIHR5cGU6ICdwZXJjZW50JyxcclxuICAgICAgdmFsdWU6IDgwXHJcbiAgICB9LFxyXG4gICAgaW52ZW50b3J5TG9jYXRpb25zOiBbXHJcbiAgICAgIHsgbmFtZTogJ1x1NEUwQVx1NkQ3N1x1NEVEMycsIHF1YW50aXR5OiAyNSB9LFxyXG4gICAgICB7IG5hbWU6ICdcdTUzMTdcdTRFQUNcdTRFRDMnLCBxdWFudGl0eTogMTUgfSxcclxuICAgICAgeyBuYW1lOiAnXHU1RTdGXHU1RERFXHU0RUQzJywgcXVhbnRpdHk6IDUgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAxJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU5QUQ4XHU1NEMxXHU4RDI4XHU2NUUwXHU3RUJGXHU4NEREXHU3MjU5XHU4MDMzXHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdTSEYtU0tVMDAxJyxcclxuICAgIGNoYW5uZWw6ICdzaG9waWZ5JyxcclxuICAgIHByaWNlOiAxMDkuOTksXHJcbiAgICBzdGF0dXM6ICdcdTU3MjhcdTU1MkUnLFxyXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlcy9oZWFkcGhvbmVzLmpwZycsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDI1OTIwMDAwMCwgLy8gM1x1NTkyOVx1NTI0RFxyXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDE3MjgwMDAwMCwgLy8gMlx1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QicsXHJcbiAgICBzdG9jazogMTAsXHJcbiAgICB3bXNTdG9jazogMjUsXHJcbiAgICBsYXN0U3luY1N0b2NrOiAyMixcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZScsXHJcbiAgICBtYXN0ZXJTa3U6ICdNUy0wMDEnLFxyXG4gICAgbWFzdGVyUHJvZHVjdE5hbWU6ICdNYXN0ZXIgXHU4NEREXHU3MjU5XHU4MDMzXHU2NzNBJyxcclxuICAgIHdhcmVob3VzZVN0b2NrOiB7XHJcbiAgICAgIFVTOiAxMCxcclxuICAgICAgRVU6IDE1XHJcbiAgICB9LFxyXG4gICAgc3luY1J1bGU6IHtcclxuICAgICAgdHlwZTogJ2ZpeGVkJyxcclxuICAgICAgdmFsdWU6IDEwMFxyXG4gICAgfSxcclxuICAgIGludmVudG9yeUxvY2F0aW9uczogW1xyXG4gICAgICB7IG5hbWU6ICdcdTZCMjdcdTZEMzJcdTRFRDMnLCBxdWFudGl0eTogMTggfSxcclxuICAgICAgeyBuYW1lOiAnXHU3RjhFXHU1NkZEXHU0RUQzJywgcXVhbnRpdHk6IDcgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAxJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU5QUQ4XHU1NEMxXHU4RDI4XHU2NUUwXHU3RUJGXHU4NEREXHU3MjU5XHU4MDMzXHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdXTVQtU0tVMDAxJyxcclxuICAgIGNoYW5uZWw6ICd3YWxtYXJ0JyxcclxuICAgIHByaWNlOiA4OS45OSxcclxuICAgIHN0YXR1czogJ1x1N0YzQVx1OEQyNycsXHJcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2VzL2hlYWRwaG9uZXMuanBnJyxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMzQ1NjAwMDAwLCAvLyA0XHU1OTI5XHU1MjREXHJcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjU5MjAwMDAwLCAvLyAzXHU1OTI5XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdDJyxcclxuICAgIHN0b2NrOiAwLFxyXG4gICAgd21zU3RvY2s6IDE1LFxyXG4gICAgbGFzdFN5bmNTdG9jazogMTIsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJyxcclxuICAgIHdhcmVob3VzZVN0b2NrOiB7XHJcbiAgICAgIFVTOiAxNVxyXG4gICAgfSxcclxuICAgIHN5bmNSdWxlOiB7XHJcbiAgICAgIHR5cGU6ICdyZWR1Y2UnLFxyXG4gICAgICB2YWx1ZTogMTAsXHJcbiAgICAgIG1ldGhvZDogJ3BlcmNlbnQnXHJcbiAgICB9LFxyXG4gICAgaW52ZW50b3J5TG9jYXRpb25zOiBbXHJcbiAgICAgIHsgbmFtZTogJ1x1N0Y4RVx1NTZGRFx1NEVEMycsIHF1YW50aXR5OiAxMiB9LFxyXG4gICAgICB7IG5hbWU6ICdcdTUyQTBcdTVEREVcdTRFRDMnLCBxdWFudGl0eTogMyB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDInLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTY2N0FcdTgwRkRcdTYyNEJcdTg4NjgnLFxyXG4gICAgY2hhbm5lbFNrdTogJ0FNWi1TS1UwMDInLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBwcmljZTogMTAwLjAxLFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvc21hcnR3YXRjaC5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxNzI4MDAwMDAsIC8vIDJcdTU5MjlcdTUyNERcclxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA4NjQwMDAwMCwgLy8gMVx1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QScsXHJcbiAgICBzdG9jazogMTgsXHJcbiAgICB3bXNTdG9jazogMjIsXHJcbiAgICBsYXN0U3luY1N0b2NrOiAyMCxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgbWFzdGVyU2t1OiAnTVMtMDAyJyxcclxuICAgIG1hc3RlclByb2R1Y3ROYW1lOiAnTWFzdGVyIFx1NjY3QVx1ODBGRFx1NjI0Qlx1ODg2OCcsXHJcbiAgICB3YXJlaG91c2VTdG9jazoge1xyXG4gICAgICBVUzogMTIsXHJcbiAgICAgIFVLOiAxMFxyXG4gICAgfSxcclxuICAgIHN5bmNSdWxlOiB7XHJcbiAgICAgIHR5cGU6ICdyZWR1Y2UnLFxyXG4gICAgICB2YWx1ZTogNTAsXHJcbiAgICAgIG1ldGhvZDogJ2ZpeGVkJ1xyXG4gICAgfSxcclxuICAgIGludmVudG9yeUxvY2F0aW9uczogW1xyXG4gICAgICB7IG5hbWU6ICdcdTgyRjFcdTU2RkRcdTRFRDMnLCBxdWFudGl0eTogMTQgfSxcclxuICAgICAgeyBuYW1lOiAnXHU3RjhFXHU1NkZEXHU0RUQzJywgcXVhbnRpdHk6IDggfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAzJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU4RDg1XHU4NTg0XHU3QjE0XHU4QkIwXHU2NzJDXHU3NTM1XHU4MTExJyxcclxuICAgIGNoYW5uZWxTa3U6ICdTSEYtU0tVMDAzJyxcclxuICAgIGNoYW5uZWw6ICdzaG9waWZ5JyxcclxuICAgIHByaWNlOiA0OTkuOTksXHJcbiAgICBzdGF0dXM6ICdcdTU3MjhcdTU1MkUnLFxyXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlcy9sYXB0b3AuanBnJyxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gODY0MDAwMDAsIC8vIDFcdTU5MjlcdTUyNERcclxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA0MzIwMDAwMCwgLy8gMTJcdTVDMEZcdTY1RjZcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0InLFxyXG4gICAgc3RvY2s6IDUsXHJcbiAgICB3bXNTdG9jazogNyxcclxuICAgIGxhc3RTeW5jU3RvY2s6IDYsXHJcbiAgICBzdG9yZTogJ01haW4gU3RvcmUnLFxyXG4gICAgc3luY1J1bGU6IHtcclxuICAgICAgdHlwZTogJ3BlcmNlbnQnLFxyXG4gICAgICB2YWx1ZTogOTBcclxuICAgIH0sXHJcbiAgICBpbnZlbnRvcnlMb2NhdGlvbnM6IFtcclxuICAgICAgeyBuYW1lOiAnXHU0RTNCXHU0RUQzXHU1RTkzJywgcXVhbnRpdHk6IDcgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDA0JyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU5NjMyXHU2QzM0XHU4RkQwXHU1MkE4XHU3NkY4XHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdXTVQtU0tVMDA0JyxcclxuICAgIGNoYW5uZWw6ICd3YWxtYXJ0JyxcclxuICAgIHByaWNlOiA1My4zMyxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRScsXHJcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2VzL2NhbWVyYS5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxNzI4MDAwMDAsIC8vIDJcdTU5MjlcdTUyNERcclxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxMjk2MDAwMDAsIC8vIDEuNVx1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QycsXHJcbiAgICBzdG9jazogMTIsXHJcbiAgICB3bXNTdG9jazogMTgsXHJcbiAgICBsYXN0U3luY1N0b2NrOiAxNixcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgc3luY1J1bGU6IHtcclxuICAgICAgdHlwZTogJ3BlcmNlbnQnLFxyXG4gICAgICB2YWx1ZTogOTBcclxuICAgIH0sXHJcbiAgICBpbnZlbnRvcnlMb2NhdGlvbnM6IFtcclxuICAgICAgeyBuYW1lOiAnXHU1RkI3XHU1RERFXHU0RUQzJywgcXVhbnRpdHk6IDEwIH0sXHJcbiAgICAgIHsgbmFtZTogJ1x1N0VCRFx1N0VBNlx1NEVEMycsIHF1YW50aXR5OiA4IH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAwNScsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NEZCRlx1NjQzQVx1NUYwRlx1NTE0NVx1NzUzNVx1NUI5RCcsXHJcbiAgICBjaGFubmVsU2t1OiAnQU1aLVNLVTAwNScsXHJcbiAgICBjaGFubmVsOiAnYW1hem9uJyxcclxuICAgIHByaWNlOiAzOS45OSxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRScsXHJcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2VzL3Bvd2VyYmFuay5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyNTkyMDAwMDAsIC8vIDNcdTU5MjlcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0EnLFxyXG4gICAgc3RvY2s6IDI1LFxyXG4gICAgd21zU3RvY2s6IDM4LFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBpbnZlbnRvcnlMb2NhdGlvbnM6IFtcclxuICAgICAgeyBuYW1lOiAnXHU0RTJEXHU1RkMzXHU0RUQzXHU1RTkzJywgcXVhbnRpdHk6IDM4IH1cclxuICAgIF1cclxuICB9LFxyXG4gIC8vIFx1NjVCMFx1NTg5RVx1NTU0Nlx1NTRDMVx1NjU3MFx1NjM2RVxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxMCcsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NkUzOFx1NjIwRlx1N0IxNFx1OEJCMFx1NjcyQ1x1NzUzNVx1ODExMScsXHJcbiAgICBjaGFubmVsU2t1OiAnQU1aLVNLVTAxMCcsXHJcbiAgICBjaGFubmVsOiAnYW1hem9uJyxcclxuICAgIHByaWNlOiAxMjk5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvZ2FtaW5nLWxhcHRvcC5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA4NjQwMDAwMCwgLy8gMVx1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QScsXHJcbiAgICBzdG9jazogOCxcclxuICAgIHdtc1N0b2NrOiAxMCxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgaW52ZW50b3J5TG9jYXRpb25zOiBbXHJcbiAgICAgIHsgbmFtZTogJ1x1NTJBMFx1NURERVx1OTE0RFx1OTAwMVx1NEUyRFx1NUZDMycsIHF1YW50aXR5OiAxMCB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTEnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTY2N0FcdTgwRkRcdTk3RjNcdTdCQjEnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1dNVC1TS1UwMTEnLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgcHJpY2U6IDEyNC45OSxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRScsXHJcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2VzL3NtYXJ0LXNwZWFrZXIuanBnJyxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTcyODAwMDAwLCAvLyAyXHU1OTI5XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdDJyxcclxuICAgIHN0b2NrOiAxNSxcclxuICAgIHdtc1N0b2NrOiAyMCxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgaW52ZW50b3J5TG9jYXRpb25zOiBbXHJcbiAgICAgIHsgbmFtZTogJ1x1NTM1N1x1NjVCOVx1NEVEMycsIHF1YW50aXR5OiAxMiB9LFxyXG4gICAgICB7IG5hbWU6ICdcdTUzMTdcdTY1QjlcdTRFRDMnLCBxdWFudGl0eTogOCB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTInLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTY2N0FcdTgwRkRcdTcwNkZcdTZDRTFcdTU5NTdcdTg4QzUnLFxyXG4gICAgY2hhbm5lbFNrdTogJ0VCWS1TS1UwMTInLFxyXG4gICAgY2hhbm5lbDogJ2ViYXknLFxyXG4gICAgcHJpY2U6IDE5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU0RTBCXHU2N0I2JyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvc21hcnQtYnVsYi5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyNTkyMDAwMDAsIC8vIDNcdTU5MjlcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0QnLFxyXG4gICAgc3RvY2s6IDIsXHJcbiAgICB3bXNTdG9jazogNSxcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTMnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTY1RTBcdTdFQkZcdTgwMzNcdTY3M0EnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1NIRi1TS1UwMTMnLFxyXG4gICAgY2hhbm5lbDogJ3Nob3BpZnknLFxyXG4gICAgcHJpY2U6IDE5OS45OSxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRScsXHJcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2VzL3dpcmVsZXNzLWVhcnBob25lcy5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAzNDU2MDAwMDAsIC8vIDRcdTU5MjlcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0InLFxyXG4gICAgc3RvY2s6IDIwLFxyXG4gICAgd21zU3RvY2s6IDI1LFxyXG4gICAgc3RvcmU6ICdNYWluIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDE0JyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2MjRCXHU2NzNBXHU0RkREXHU2MkE0XHU1OEYzJyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDE0JyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgcHJpY2U6IDE5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU3RjNBXHU4RDI3JyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvcGhvbmUtY2FzZS5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA0MzIwMDAwMDAsIC8vIDVcdTU5MjlcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0EnLFxyXG4gICAgc3RvY2s6IDAsXHJcbiAgICB3bXNTdG9jazogNixcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTUnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTYyNEJcdTY3M0FcdTY1MkZcdTY3QjYnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1dNVC1TS1UwMTUnLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgcHJpY2U6IDI5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvcGhvbmUtc3RhbmQuanBnJyxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNTE4NDAwMDAwLCAvLyA2XHU1OTI5XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdDJyxcclxuICAgIHN0b2NrOiAzMixcclxuICAgIHdtc1N0b2NrOiA0MCxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTAnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTZFMzhcdTYyMEZcdTdCMTRcdThCQjBcdTY3MkNcdTc1MzVcdTgxMTEnLFxyXG4gICAgY2hhbm5lbFNrdTogJ0FNWi1TS1UwMTAnLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdG9yZTogJ0VVIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogMixcclxuICAgIHJlc2VydmVkOiAwLFxyXG4gICAgdG90YWw6IDIsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDI1MjAwMDAwLCAvLyA3XHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdBJyxcclxuICAgIHN0b2NrOiAyLFxyXG4gICAgd21zU3RvY2s6IDQsXHJcbiAgICBwcmljZTogMTI5OS45OSxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRSdcclxuICB9XHJcbl1cclxuXHJcbi8vIFx1NUU5M1x1NUI1OFx1NjU3MFx1NjM2RVxyXG5leHBvcnQgY29uc3QgaW52ZW50b3J5TGlzdDogSW52ZW50b3J5RGF0YVtdID0gW1xyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAwMScsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1OUFEOFx1NTRDMVx1OEQyOFx1NjVFMFx1N0VCRlx1ODRERFx1NzI1OVx1ODAzM1x1NjczQScsXHJcbiAgICBjaGFubmVsU2t1OiAnQU1aLVNLVTAwMScsXHJcbiAgICBjaGFubmVsOiAnYW1hem9uJyxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiAyNSxcclxuICAgIHJlc2VydmVkOiA1LFxyXG4gICAgdG90YWw6IDMwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAzNjAwMDAwIC8vIDFcdTVDMEZcdTY1RjZcdTUyNERcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAwMScsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1OUFEOFx1NTRDMVx1OEQyOFx1NjVFMFx1N0VCRlx1ODRERFx1NzI1OVx1ODAzM1x1NjczQScsXHJcbiAgICBjaGFubmVsU2t1OiAnU0hGLVNLVTAwMScsXHJcbiAgICBjaGFubmVsOiAnc2hvcGlmeScsXHJcbiAgICBzdG9yZTogJ01haW4gU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiA4LFxyXG4gICAgcmVzZXJ2ZWQ6IDIsXHJcbiAgICB0b3RhbDogMTAsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDcyMDAwMDAgLy8gMlx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAxJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU5QUQ4XHU1NEMxXHU4RDI4XHU2NUUwXHU3RUJGXHU4NEREXHU3MjU5XHU4MDMzXHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdXTVQtU0tVMDAxJyxcclxuICAgIGNoYW5uZWw6ICd3YWxtYXJ0JyxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiAwLFxyXG4gICAgcmVzZXJ2ZWQ6IDAsXHJcbiAgICB0b3RhbDogMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTA4MDAwMDAgLy8gM1x1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAyJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2NjdBXHU4MEZEXHU2MjRCXHU4ODY4JyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDAyJyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDE1LFxyXG4gICAgcmVzZXJ2ZWQ6IDMsXHJcbiAgICB0b3RhbDogMTgsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM2MDAwMDAgLy8gMVx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAzJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU4RDg1XHU4NTg0XHU3QjE0XHU4QkIwXHU2NzJDXHU3NTM1XHU4MTExJyxcclxuICAgIGNoYW5uZWxTa3U6ICdTSEYtU0tVMDAzJyxcclxuICAgIGNoYW5uZWw6ICdzaG9waWZ5JyxcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDUsXHJcbiAgICByZXNlcnZlZDogMSxcclxuICAgIHRvdGFsOiA2LFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA3MjAwMDAwIC8vIDJcdTVDMEZcdTY1RjZcdTUyNERcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAwNCcsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1OTYzMlx1NkMzNFx1OEZEMFx1NTJBOFx1NzZGOFx1NjczQScsXHJcbiAgICBjaGFubmVsU2t1OiAnV01ULVNLVTAwNCcsXHJcbiAgICBjaGFubmVsOiAnd2FsbWFydCcsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogMTIsXHJcbiAgICByZXNlcnZlZDogMixcclxuICAgIHRvdGFsOiAxNCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTA4MDAwMDAgLy8gM1x1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDA1JyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU0RkJGXHU2NDNBXHU1RjBGXHU1MTQ1XHU3NTM1XHU1QjlEJyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDA1JyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDMwLFxyXG4gICAgcmVzZXJ2ZWQ6IDcsXHJcbiAgICB0b3RhbDogMzcsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM2MDAwMDAgLy8gMVx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAgLy8gXHU2NUIwXHU1ODlFXHU1RTkzXHU1QjU4XHU2NTcwXHU2MzZFXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDEwJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2RTM4XHU2MjBGXHU3QjE0XHU4QkIwXHU2NzJDXHU3NTM1XHU4MTExJyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDEwJyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDMsXHJcbiAgICByZXNlcnZlZDogMSxcclxuICAgIHRvdGFsOiA0LFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAzNjAwMDAwIC8vIDFcdTVDMEZcdTY1RjZcdTUyNERcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxMScsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1OTdGM1x1N0JCMScsXHJcbiAgICBjaGFubmVsU2t1OiAnV01ULVNLVTAxMScsXHJcbiAgICBjaGFubmVsOiAnd2FsbWFydCcsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogOCxcclxuICAgIHJlc2VydmVkOiAyLFxyXG4gICAgdG90YWw6IDEwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA3MjAwMDAwIC8vIDJcdTVDMEZcdTY1RjZcdTUyNERcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxMicsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1NzA2Rlx1NkNFMVx1NTk1N1x1ODhDNScsXHJcbiAgICBjaGFubmVsU2t1OiAnRUJZLVNLVTAxMicsXHJcbiAgICBjaGFubmVsOiAnZWJheScsXHJcbiAgICBzdG9yZTogJ01haW4gU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiAwLFxyXG4gICAgcmVzZXJ2ZWQ6IDAsXHJcbiAgICB0b3RhbDogMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTA4MDAwMDAgLy8gM1x1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDEzJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2NUUwXHU3RUJGXHU4MDMzXHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdTSEYtU0tVMDEzJyxcclxuICAgIGNoYW5uZWw6ICdzaG9waWZ5JyxcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDEyLFxyXG4gICAgcmVzZXJ2ZWQ6IDMsXHJcbiAgICB0b3RhbDogMTUsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDE0NDAwMDAwIC8vIDRcdTVDMEZcdTY1RjZcdTUyNERcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxNCcsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NjI0Qlx1NjczQVx1NEZERFx1NjJBNFx1NThGMycsXHJcbiAgICBjaGFubmVsU2t1OiAnQU1aLVNLVTAxNCcsXHJcbiAgICBjaGFubmVsOiAnYW1hem9uJyxcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiAwLFxyXG4gICAgcmVzZXJ2ZWQ6IDAsXHJcbiAgICB0b3RhbDogMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTgwMDAwMDAgLy8gNVx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDE1JyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2MjRCXHU2NzNBXHU2NTJGXHU2N0I2JyxcclxuICAgIGNoYW5uZWxTa3U6ICdXTVQtU0tVMDE1JyxcclxuICAgIGNoYW5uZWw6ICd3YWxtYXJ0JyxcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiAyNSxcclxuICAgIHJlc2VydmVkOiA1LFxyXG4gICAgdG90YWw6IDMwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyMTYwMDAwMCAvLyA2XHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTAnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTZFMzhcdTYyMEZcdTdCMTRcdThCQjBcdTY3MkNcdTc1MzVcdTgxMTEnLFxyXG4gICAgY2hhbm5lbFNrdTogJ0FNWi1TS1UwMTAnLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdG9yZTogJ0VVIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogMixcclxuICAgIHJlc2VydmVkOiAwLFxyXG4gICAgdG90YWw6IDIsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDI1MjAwMDAwLCAvLyA3XHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdBJyxcclxuICAgIHN0b2NrOiAyLFxyXG4gICAgd21zU3RvY2s6IDQsXHJcbiAgICBwcmljZTogMTI5OS45OSxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRSdcclxuICB9XHJcbl1cclxuXHJcbi8vIFx1NjdFNVx1OEJFMlx1NTFGRFx1NjU3MFxyXG5leHBvcnQgZnVuY3Rpb24gcXVlcnlPcmRlcnMocGFyYW1zOiBRdWVyeVBhcmFtcyk6IFBhZ2luYXRlZFJlc3BvbnNlPE9yZGVyRGF0YT4ge1xyXG4gIGxldCByZXN1bHRzID0gWy4uLm9yZGVyTGlzdF1cclxuICBcclxuICAvLyBcdTU3RkFcdTY3MkNcdThGQzdcdTZFRTRcdTY3NjFcdTRFRjZcclxuICBpZiAocGFyYW1zLmN1c3RvbWVyICYmIHBhcmFtcy5jaGFubmVsKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLmNoYW5uZWwgPT09IHBhcmFtcy5jaGFubmVsKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLmNoYW5uZWxPcmRlcklkKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLmNoYW5uZWxPcmRlcklkLmluY2x1ZGVzKHBhcmFtcy5jaGFubmVsT3JkZXJJZCBhcyBzdHJpbmcpKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLnN5c3RlbU9yZGVySWQpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uc3lzdGVtT3JkZXJJZC5pbmNsdWRlcyhwYXJhbXMuc3lzdGVtT3JkZXJJZCBhcyBzdHJpbmcpKVxyXG4gIH1cclxuICBcclxuICAvLyBcdTlBRDhcdTdFQTdcdTY3RTVcdThCRTJcdTY3NjFcdTRFRjYgLSBcdThCQTJcdTUzNTVcclxuICBpZiAocGFyYW1zLm9yZGVyU3RhdHVzKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLnN0YXR1cyA9PT0gcGFyYW1zLm9yZGVyU3RhdHVzKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLmN1c3RvbWVyTmFtZSkge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jdXN0b21lck5hbWUuaW5jbHVkZXMocGFyYW1zLmN1c3RvbWVyTmFtZSkpXHJcbiAgfVxyXG4gIFxyXG4gIGlmIChwYXJhbXMuc3RhcnREYXRlICYmIHBhcmFtcy5lbmREYXRlKSB7XHJcbiAgICBjb25zdCBzdGFydFRpbWVzdGFtcCA9IG5ldyBEYXRlKHBhcmFtcy5zdGFydERhdGUpLmdldFRpbWUoKVxyXG4gICAgY29uc3QgZW5kVGltZXN0YW1wID0gbmV3IERhdGUocGFyYW1zLmVuZERhdGUpLmdldFRpbWUoKSArIDg2NDAwMDAwIC8vIFx1NTJBMFx1NEUwMFx1NTkyOVx1RkYwQ1x1NTMwNVx1NTQyQlx1N0VEM1x1Njc1Rlx1NjVFNVx1NjcxRlxyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4ge1xyXG4gICAgICByZXR1cm4gaXRlbS5jcmVhdGVUaW1lID49IHN0YXJ0VGltZXN0YW1wICYmIGl0ZW0uY3JlYXRlVGltZSA8PSBlbmRUaW1lc3RhbXBcclxuICAgIH0pXHJcbiAgfVxyXG4gIFxyXG4gIC8vIFx1OEJBMVx1N0I5N1x1NTIwNlx1OTg3NVxyXG4gIGNvbnN0IHRvdGFsID0gcmVzdWx0cy5sZW5ndGhcclxuICBjb25zdCBzdGFydEluZGV4ID0gKHBhcmFtcy5wYWdlIC0gMSkgKiBwYXJhbXMucGFnZVNpemVcclxuICBjb25zdCBlbmRJbmRleCA9IHN0YXJ0SW5kZXggKyBwYXJhbXMucGFnZVNpemVcclxuICBjb25zdCBkYXRhID0gcmVzdWx0cy5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleClcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgZGF0YSxcclxuICAgIHRvdGFsXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcXVlcnlTeXN0ZW1PcmRlcnMoY2hhbm5lbE9yZGVySWQ6IHN0cmluZyk6IFN5c3RlbU9yZGVyRGF0YVtdIHtcclxuICAvLyBcdTkwMUFcdThGQzdcdTZFMjBcdTkwNTNcdThCQTJcdTUzNTVcdTUzRjdcdTYyN0VcdTUyMzBcdTVCRjlcdTVFOTRcdTc2ODRcdTdDRkJcdTdFREZcdThCQTJcdTUzNTVcclxuICBjb25zdCBvcmRlciA9IG9yZGVyTGlzdC5maW5kKG8gPT4gby5jaGFubmVsT3JkZXJJZCA9PT0gY2hhbm5lbE9yZGVySWQpXHJcbiAgaWYgKCFvcmRlcikgcmV0dXJuIFtdXHJcbiAgXHJcbiAgcmV0dXJuIHN5c3RlbU9yZGVyTGlzdC5maWx0ZXIoc28gPT4gc28uc3lzdGVtT3JkZXJJZCA9PT0gb3JkZXIuc3lzdGVtT3JkZXJJZClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5UHJvZHVjdHMocGFyYW1zOiBRdWVyeVBhcmFtcyk6IFBhZ2luYXRlZFJlc3BvbnNlPFByb2R1Y3REYXRhPiB7XHJcbiAgbGV0IHJlc3VsdHMgPSBbLi4ucHJvZHVjdExpc3RdXHJcbiAgXHJcbiAgLy8gXHU1N0ZBXHU2NzJDXHU4RkM3XHU2RUU0XHU2NzYxXHU0RUY2XHJcbiAgaWYgKHBhcmFtcy5jdXN0b21lciAmJiBwYXJhbXMuY2hhbm5lbCkge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jaGFubmVsID09PSBwYXJhbXMuY2hhbm5lbClcclxuICB9XHJcbiAgXHJcbiAgaWYgKHBhcmFtcy5wcm9kdWN0TmFtZSkge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5wcm9kdWN0TmFtZS5pbmNsdWRlcyhwYXJhbXMucHJvZHVjdE5hbWUgYXMgc3RyaW5nKSlcclxuICB9XHJcbiAgXHJcbiAgaWYgKHBhcmFtcy5za3UpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uc2t1LmluY2x1ZGVzKHBhcmFtcy5za3UgYXMgc3RyaW5nKSB8fCBpdGVtLmNoYW5uZWxTa3UuaW5jbHVkZXMocGFyYW1zLnNrdSBhcyBzdHJpbmcpKVxyXG4gIH1cclxuICBcclxuICAvLyBcdTlBRDhcdTdFQTdcdTY3RTVcdThCRTJcdTY3NjFcdTRFRjYgLSBcdTU1NDZcdTU0QzFcclxuICBpZiAocGFyYW1zLnByb2R1Y3RTdGF0dXMpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzID09PSBwYXJhbXMucHJvZHVjdFN0YXR1cylcclxuICB9XHJcbiAgXHJcbiAgaWYgKHBhcmFtcy5taW5QcmljZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLnByaWNlID49IHBhcmFtcy5taW5QcmljZSEpXHJcbiAgfVxyXG4gIFxyXG4gIGlmIChwYXJhbXMubWF4UHJpY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5wcmljZSA8PSBwYXJhbXMubWF4UHJpY2UhKVxyXG4gIH1cclxuICBcclxuICAvLyBcdThCQTFcdTdCOTdcdTUyMDZcdTk4NzVcclxuICBjb25zdCB0b3RhbCA9IHJlc3VsdHMubGVuZ3RoXHJcbiAgY29uc3Qgc3RhcnRJbmRleCA9IChwYXJhbXMucGFnZSAtIDEpICogcGFyYW1zLnBhZ2VTaXplXHJcbiAgY29uc3QgZW5kSW5kZXggPSBzdGFydEluZGV4ICsgcGFyYW1zLnBhZ2VTaXplXHJcbiAgY29uc3QgZGF0YSA9IHJlc3VsdHMuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpXHJcbiAgXHJcbiAgcmV0dXJuIHtcclxuICAgIGRhdGEsXHJcbiAgICB0b3RhbFxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5SW52ZW50b3J5KHBhcmFtczogUXVlcnlQYXJhbXMpOiBQYWdpbmF0ZWRSZXNwb25zZTxJbnZlbnRvcnlEYXRhPiB7XHJcbiAgbGV0IHJlc3VsdHMgPSBbLi4uaW52ZW50b3J5TGlzdF1cclxuICBcclxuICAvLyBcdTU3RkFcdTY3MkNcdThGQzdcdTZFRTRcdTY3NjFcdTRFRjZcclxuICBpZiAocGFyYW1zLmN1c3RvbWVyICYmIHBhcmFtcy5jaGFubmVsKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLmNoYW5uZWwgPT09IHBhcmFtcy5jaGFubmVsKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLnByb2R1Y3ROYW1lKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLnByb2R1Y3ROYW1lLmluY2x1ZGVzKHBhcmFtcy5wcm9kdWN0TmFtZSBhcyBzdHJpbmcpKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLnNrdSkge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5za3UuaW5jbHVkZXMocGFyYW1zLnNrdSBhcyBzdHJpbmcpIHx8IGl0ZW0uY2hhbm5lbFNrdS5pbmNsdWRlcyhwYXJhbXMuc2t1IGFzIHN0cmluZykpXHJcbiAgfVxyXG4gIFxyXG4gIC8vIFx1OUFEOFx1N0VBN1x1NjdFNVx1OEJFMlx1Njc2MVx1NEVGNiAtIFx1NUU5M1x1NUI1OFxyXG4gIGlmIChwYXJhbXMuc3RvcmUpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uc3RvcmUuaW5jbHVkZXMocGFyYW1zLnN0b3JlKSlcclxuICB9XHJcbiAgXHJcbiAgaWYgKHBhcmFtcy5pbnZlbnRvcnlTdGF0dXMpIHtcclxuICAgIHN3aXRjaChwYXJhbXMuaW52ZW50b3J5U3RhdHVzKSB7XHJcbiAgICAgIGNhc2UgJ1x1NjcwOVx1NUU5M1x1NUI1OCc6XHJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5hdmFpbGFibGUgPiAxMClcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdcdTRGNEVcdTVFOTNcdTVCNTgnOlxyXG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uYXZhaWxhYmxlID4gMCAmJiBpdGVtLmF2YWlsYWJsZSA8PSAxMClcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdcdTY1RTBcdTVFOTNcdTVCNTgnOlxyXG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uYXZhaWxhYmxlIDw9IDApXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gXHU4QkExXHU3Qjk3XHU1MjA2XHU5ODc1XHJcbiAgY29uc3QgdG90YWwgPSByZXN1bHRzLmxlbmd0aFxyXG4gIGNvbnN0IHN0YXJ0SW5kZXggPSAocGFyYW1zLnBhZ2UgLSAxKSAqIHBhcmFtcy5wYWdlU2l6ZVxyXG4gIGNvbnN0IGVuZEluZGV4ID0gc3RhcnRJbmRleCArIHBhcmFtcy5wYWdlU2l6ZVxyXG4gIGNvbnN0IGRhdGEgPSByZXN1bHRzLnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KVxyXG4gIFxyXG4gIHJldHVybiB7XHJcbiAgICBkYXRhLFxyXG4gICAgdG90YWxcclxuICB9XHJcbn0gIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSmF5bmVcXFxcRGVza3RvcFxcXFxVTklTXFxcXE9NU1x1OTg3OVx1NzZFRVxcXFxzcmNcXFxcdmlld3NcXFxccHVyY2hhc2VcXFxcdHJhY2tpbmdcXFxcdHlwZXMudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSmF5bmVcXFxcRGVza3RvcFxcXFxVTklTXFxcXE9NU1x1OTg3OVx1NzZFRVxcXFxzcmNcXFxcdmlld3NcXFxccHVyY2hhc2VcXFxcdHJhY2tpbmdcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL0pheW5lL0Rlc2t0b3AvVU5JUy9PTVMlRTklQTElQjklRTclOUIlQUUvc3JjL3ZpZXdzL3B1cmNoYXNlL3RyYWNraW5nL3R5cGVzLnRzXCI7ZXhwb3J0IGVudW0gUHVyY2hhc2VPcmRlclN0YXR1cyB7XG4gIFBPX0NSRUFURUQgPSAnUE9fQ1JFQVRFRCcsXG4gIFBPX0NPTkZJUk1FRCA9ICdQT19DT05GSVJNRUQnLFxuICBJTl9QUk9EVUNUSU9OID0gJ0lOX1BST0RVQ1RJT04nLFxuICBFWFBPUlRfQ1VTVE9NUyA9ICdFWFBPUlRfQ1VTVE9NUycsXG4gIElNUE9SVF9ERUxJVkVSWSA9ICdJTVBPUlRfREVMSVZFUlknLFxuICBSRUNFSVZFRCA9ICdSRUNFSVZFRCcsXG4gIElOVk9JQ0VEID0gJ0lOVk9JQ0VEJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN1YlByb2Nlc3Mge1xuICBuYW1lOiBzdHJpbmdcbiAgc3RhdHVzOiAncGVuZGluZycgfCAnaW5fcHJvZ3Jlc3MnIHwgJ2NvbXBsZXRlZCcgfCAnZXJyb3InXG4gIHRpbWVzdGFtcD86IHN0cmluZ1xuICBvcGVyYXRvcj86IHN0cmluZ1xuICBhdHRhY2htZW50cz86IEFycmF5PHtcbiAgICBuYW1lOiBzdHJpbmdcbiAgICB1cmw6IHN0cmluZ1xuICB9PlxuICByZW1hcmtzPzogc3RyaW5nXG4gIGZpZWxkczogUmVjb3JkPHN0cmluZywgYW55PlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRyYWNraW5nU3RhZ2Uge1xuICBzdGF0dXM6IFB1cmNoYXNlT3JkZXJTdGF0dXNcbiAgdGl0bGU6IHN0cmluZ1xuICBzdWJQcm9jZXNzZXM6IFN1YlByb2Nlc3NbXVxuICBjb21wbGV0ZWQ6IGJvb2xlYW5cbiAgY3VycmVudDogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFB1cmNoYXNlT3JkZXJUcmFja2luZyB7XG4gIGlkOiBzdHJpbmdcbiAgcG9OdW1iZXI6IHN0cmluZ1xuICBzdXBwbGllcjogc3RyaW5nXG4gIGNyZWF0ZWRBdDogc3RyaW5nXG4gIGV4cGVjdGVkRGVsaXZlcnlEYXRlPzogc3RyaW5nXG4gIGN1cnJlbnRTdGF0dXM6IFB1cmNoYXNlT3JkZXJTdGF0dXNcbiAgc3RhZ2VzOiBUcmFja2luZ1N0YWdlW11cbn1cblxuLy8gU3RhZ2UgY29uZmlndXJhdGlvbnNcbmV4cG9ydCBjb25zdCBTVEFHRV9DT05GSUdTID0ge1xuICBbUHVyY2hhc2VPcmRlclN0YXR1cy5QT19DUkVBVEVEXToge1xuICAgIHRpdGxlOiAnUE8gQ3JlYXRlZCcsXG4gICAgc3ViUHJvY2Vzc2VzOiBbXG4gICAgICB7IG5hbWU6ICdEcmFmdCBDcmVhdGVkJywgZmllbGRzOiBbJ2NyZWF0ZWRUaW1lJywgJ2NyZWF0b3InXSB9LFxuICAgICAgeyBuYW1lOiAnUE8gTnVtYmVyIEFzc2lnbmVkJywgZmllbGRzOiBbJ3BvTnVtYmVyJ10gfSxcbiAgICAgIHsgbmFtZTogJ1N1Ym1pdHRlZCBmb3IgQXBwcm92YWwnLCBmaWVsZHM6IFsnYXBwcm92YWxTdGF0dXMnLCAnYXBwcm92ZXInXSB9LFxuICAgICAgeyBuYW1lOiAnQXBwcm92ZWQnLCBmaWVsZHM6IFsnYXBwcm92YWxUaW1lJywgJ2FwcHJvdmVyJ10gfVxuICAgIF1cbiAgfSxcbiAgW1B1cmNoYXNlT3JkZXJTdGF0dXMuUE9fQ09ORklSTUVEXToge1xuICAgIHRpdGxlOiAnUE8gQ29uZmlybWVkJyxcbiAgICBzdWJQcm9jZXNzZXM6IFtcbiAgICAgIHsgbmFtZTogJ1NlbnQgdG8gU3VwcGxpZXInLCBmaWVsZHM6IFsnc2VudFRpbWUnLCAnY29udGFjdCddIH0sXG4gICAgICB7IG5hbWU6ICdTdXBwbGllciBBY2tub3dsZWRnZWQnLCBmaWVsZHM6IFsncmVwbHlTdGF0dXMnLCAnY29udGFjdCddIH0sXG4gICAgICB7IG5hbWU6ICdQTyBBY2NlcHRlZCAvIFJlamVjdGVkJywgZmllbGRzOiBbJ2NvbmZpcm1UaW1lJywgJ3JlbWFya3MnXSB9LFxuICAgICAgeyBuYW1lOiAnRGVsaXZlcnkgRGF0ZSBDb25maXJtZWQnLCBmaWVsZHM6IFsnZGVsaXZlcnlEYXRlJywgJ3Jlc3BvbnNpYmxlJ10gfVxuICAgIF1cbiAgfSxcbiAgW1B1cmNoYXNlT3JkZXJTdGF0dXMuSU5fUFJPRFVDVElPTl06IHtcbiAgICB0aXRsZTogJ0luIFByb2R1Y3Rpb24nLFxuICAgIHN1YlByb2Nlc3NlczogW1xuICAgICAgeyBuYW1lOiAnTWF0ZXJpYWwgUmVhZHknLCBmaWVsZHM6IFsnbWF0ZXJpYWxDb2RlJywgJ2NvbXBsZXRpb25UaW1lJ10gfSxcbiAgICAgIHsgbmFtZTogJ0luIEFzc2VtYmx5JywgZmllbGRzOiBbJ3N0YXJ0VGltZScsICdiYXRjaE51bWJlciddIH0sXG4gICAgICB7IG5hbWU6ICdUZXN0aW5nICYgUUEnLCBmaWVsZHM6IFsndGVzdFJlc3VsdCcsICdyZXBvcnROdW1iZXInXSB9LFxuICAgICAgeyBuYW1lOiAnUGFja2FnaW5nJywgZmllbGRzOiBbJ3BhY2tpbmdUaW1lJywgJ3BhY2tpbmdNZXRob2QnXSB9LFxuICAgICAgeyBuYW1lOiAnUmVhZHkgdG8gU2hpcCcsIGZpZWxkczogWydyZWFkeVRpbWUnXSB9XG4gICAgXVxuICB9LFxuICBbUHVyY2hhc2VPcmRlclN0YXR1cy5FWFBPUlRfQ1VTVE9NU106IHtcbiAgICB0aXRsZTogJ0V4cG9ydCAmIEN1c3RvbXMnLFxuICAgIHN1YlByb2Nlc3NlczogW1xuICAgICAgeyBuYW1lOiAnQm9va2luZyBDb25maXJtZWQnLCBmaWVsZHM6IFsnYm9va2luZ051bWJlcicsICdjYXJyaWVyJ10gfSxcbiAgICAgIHsgbmFtZTogJ0N1c3RvbXMgRG9jcyBQcmVwYXJlZCcsIGZpZWxkczogWydpbnZvaWNlJywgJ3BhY2tpbmdMaXN0JywgJ2NvbyddIH0sXG4gICAgICB7IG5hbWU6ICdDdXN0b21zIERlY2xhcmF0aW9uIFN1Ym1pdHRlZCcsIGZpZWxkczogWydkZWNsYXJhdGlvblRpbWUnLCAnYWdlbnQnXSB9LFxuICAgICAgeyBuYW1lOiAnQ3VzdG9tcyBDbGVhcmVkJywgZmllbGRzOiBbJ2NsZWFyYW5jZVRpbWUnLCAncmVtYXJrcyddIH0sXG4gICAgICB7IG5hbWU6ICdTaGlwcGVkJywgZmllbGRzOiBbJ2RlcGFydHVyZVRpbWUnLCAndmVzc2VsTnVtYmVyJ10gfVxuICAgIF1cbiAgfSxcbiAgW1B1cmNoYXNlT3JkZXJTdGF0dXMuSU1QT1JUX0RFTElWRVJZXToge1xuICAgIHRpdGxlOiAnSW1wb3J0ICYgRGVsaXZlcnknLFxuICAgIHN1YlByb2Nlc3NlczogW1xuICAgICAgeyBuYW1lOiAnQXJyaXZhbCBhdCBQb3J0JywgZmllbGRzOiBbJ2Fycml2YWxUaW1lJywgJ3BvcnQnXSB9LFxuICAgICAgeyBuYW1lOiAnSW1wb3J0IERlY2xhcmF0aW9uJywgZmllbGRzOiBbJ2N1c3RvbXNEb2NzJywgJ2R1dHlGZWVzJ10gfSxcbiAgICAgIHsgbmFtZTogJ0luc3BlY3Rpb24nLCBmaWVsZHM6IFsnaW5zcGVjdGlvblN0YXR1cyddIH0sXG4gICAgICB7IG5hbWU6ICdDdXN0b21zIFJlbGVhc2VkJywgZmllbGRzOiBbJ3JlbGVhc2VUaW1lJ10gfSxcbiAgICAgIHsgbmFtZTogJ0xvY2FsIERlbGl2ZXJ5IFNjaGVkdWxlZCcsIGZpZWxkczogWydkZWxpdmVyeVRpbWUnLCAndmVoaWNsZUluZm8nXSB9LFxuICAgICAgeyBuYW1lOiAnRGVsaXZlcmVkIHRvIERDJywgZmllbGRzOiBbJ3NpZ25UaW1lJywgJ3Bob3RvcyddIH1cbiAgICBdXG4gIH0sXG4gIFtQdXJjaGFzZU9yZGVyU3RhdHVzLlJFQ0VJVkVEXToge1xuICAgIHRpdGxlOiAnUmVjZWl2ZWQnLFxuICAgIHN1YlByb2Nlc3NlczogW1xuICAgICAgeyBuYW1lOiAnR1JOIENyZWF0ZWQnLCBmaWVsZHM6IFsnZ3JuTnVtYmVyJywgJ3dhcmVob3VzZSddIH0sXG4gICAgICB7IG5hbWU6ICdRdWFudGl0eSBDaGVja2VkJywgZmllbGRzOiBbJ2FjdHVhbFF0eScsICdwbGFubmVkUXR5J10gfSxcbiAgICAgIHsgbmFtZTogJ0V4Y2VwdGlvbiBGbGFnZ2VkJywgZmllbGRzOiBbJ2V4Y2VwdGlvbnMnLCAnZGFtYWdlTm90ZXMnXSB9LFxuICAgICAgeyBuYW1lOiAnR1JOIENsb3NlZCcsIGZpZWxkczogWydjbG9zZVRpbWUnLCAnb3BlcmF0b3InXSB9XG4gICAgXVxuICB9LFxuICBbUHVyY2hhc2VPcmRlclN0YXR1cy5JTlZPSUNFRF06IHtcbiAgICB0aXRsZTogJ0ludm9pY2VkJyxcbiAgICBzdWJQcm9jZXNzZXM6IFtcbiAgICAgIHsgbmFtZTogJ0ludm9pY2UgUmVjZWl2ZWQnLCBmaWVsZHM6IFsnaW52b2ljZU51bWJlcicsICdhbW91bnQnLCAndXBsb2FkZXInXSB9LFxuICAgICAgeyBuYW1lOiAnVGhyZWUtV2F5IE1hdGNoJywgZmllbGRzOiBbJ21hdGNoU3RhdHVzJywgJ2Rpc2NyZXBhbmN5J10gfSxcbiAgICAgIHsgbmFtZTogJ1BheW1lbnQgU2NoZWR1bGVkJywgZmllbGRzOiBbJ3BheW1lbnRQbGFuJywgJ3BheW1lbnRNZXRob2QnXSB9LFxuICAgICAgeyBuYW1lOiAnUGF5bWVudCBDb21wbGV0ZWQnLCBmaWVsZHM6IFsncGF5bWVudFRpbWUnLCAndm91Y2hlciddIH1cbiAgICBdXG4gIH1cbn0gIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSmF5bmVcXFxcRGVza3RvcFxcXFxVTklTXFxcXE9NU1x1OTg3OVx1NzZFRVxcXFxzcmNcXFxcbW9ja1xcXFxwdXJjaGFzZVRyYWNraW5nLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXEpheW5lXFxcXERlc2t0b3BcXFxcVU5JU1xcXFxPTVNcdTk4NzlcdTc2RUVcXFxcc3JjXFxcXG1vY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL0pheW5lL0Rlc2t0b3AvVU5JUy9PTVMlRTklQTElQjklRTclOUIlQUUvc3JjL21vY2svcHVyY2hhc2VUcmFja2luZy50c1wiO2ltcG9ydCB7IFB1cmNoYXNlT3JkZXJTdGF0dXMsIFB1cmNoYXNlT3JkZXJUcmFja2luZyB9IGZyb20gJ0Avdmlld3MvcHVyY2hhc2UvdHJhY2tpbmcvdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBtb2NrVHJhY2tpbmdMaXN0OiBQdXJjaGFzZU9yZGVyVHJhY2tpbmdbXSA9IFtcbiAge1xuICAgIGlkOiAnMScsXG4gICAgcG9OdW1iZXI6ICdQTy0yMDI0LTAwMScsXG4gICAgc3VwcGxpZXI6ICdTdXBwbGllciBBJyxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTE1VDA4OjAwOjAwWicsXG4gICAgZXhwZWN0ZWREZWxpdmVyeURhdGU6ICcyMDI0LTAyLTE1VDA4OjAwOjAwWicsXG4gICAgY3VycmVudFN0YXR1czogUHVyY2hhc2VPcmRlclN0YXR1cy5JTl9QUk9EVUNUSU9OLFxuICAgIHN0YWdlczogW11cbiAgfSxcbiAge1xuICAgIGlkOiAnMicsXG4gICAgcG9OdW1iZXI6ICdQTy0yMDI0LTAwMicsXG4gICAgc3VwcGxpZXI6ICdTdXBwbGllciBCJyxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTIwVDA4OjAwOjAwWicsXG4gICAgZXhwZWN0ZWREZWxpdmVyeURhdGU6ICcyMDI0LTAyLTIwVDA4OjAwOjAwWicsXG4gICAgY3VycmVudFN0YXR1czogUHVyY2hhc2VPcmRlclN0YXR1cy5QT19DT05GSVJNRUQsXG4gICAgc3RhZ2VzOiBbXVxuICB9XG5dXG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZU1vY2tTdGFnZXMgPSAoY3VycmVudFN0YXR1czogUHVyY2hhc2VPcmRlclN0YXR1cykgPT4ge1xuICBjb25zdCBzdGF0dXNlcyA9IE9iamVjdC52YWx1ZXMoUHVyY2hhc2VPcmRlclN0YXR1cylcbiAgY29uc3QgY3VycmVudEluZGV4ID0gc3RhdHVzZXMuaW5kZXhPZihjdXJyZW50U3RhdHVzKVxuXG4gIHJldHVybiBzdGF0dXNlcy5tYXAoKHN0YXR1cywgaW5kZXgpID0+ICh7XG4gICAgc3RhdHVzLFxuICAgIHRpdGxlOiBzdGF0dXMuc3BsaXQoJ18nKS5tYXAod29yZCA9PiBcbiAgICAgIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpLnRvTG93ZXJDYXNlKClcbiAgICApLmpvaW4oJyAnKSxcbiAgICBzdWJQcm9jZXNzZXM6IEFycmF5KDQpLmZpbGwobnVsbCkubWFwKChfLCBpKSA9PiAoe1xuICAgICAgbmFtZTogYFByb2Nlc3MgJHtpICsgMX1gLFxuICAgICAgc3RhdHVzOiBpbmRleCA8IGN1cnJlbnRJbmRleCA/ICdjb21wbGV0ZWQnIDogXG4gICAgICAgICAgICAgIGluZGV4ID09PSBjdXJyZW50SW5kZXggPyAoaSA9PT0gMCA/ICdjb21wbGV0ZWQnIDogaSA9PT0gMSA/ICdpbl9wcm9ncmVzcycgOiAncGVuZGluZycpIDogXG4gICAgICAgICAgICAgICdwZW5kaW5nJyxcbiAgICAgIHRpbWVzdGFtcDogaW5kZXggPCBjdXJyZW50SW5kZXggPyBuZXcgRGF0ZShEYXRlLm5vdygpIC0gKGluZGV4ICogMjQgKiA2MCAqIDYwICogMTAwMCkpLnRvSVNPU3RyaW5nKCkgOiB1bmRlZmluZWQsXG4gICAgICBvcGVyYXRvcjogaW5kZXggPCBjdXJyZW50SW5kZXggPyAnSm9obiBEb2UnIDogdW5kZWZpbmVkLFxuICAgICAgZmllbGRzOiB7fVxuICAgIH0pKSxcbiAgICBjb21wbGV0ZWQ6IGluZGV4IDwgY3VycmVudEluZGV4LFxuICAgIGN1cnJlbnQ6IGluZGV4ID09PSBjdXJyZW50SW5kZXhcbiAgfSkpXG59XG5cbmV4cG9ydCBjb25zdCBtb2NrVHJhY2tpbmdEZXRhaWwgPSAoaWQ6IHN0cmluZyk6IFB1cmNoYXNlT3JkZXJUcmFja2luZyA9PiB7XG4gIGNvbnN0IGl0ZW0gPSBtb2NrVHJhY2tpbmdMaXN0LmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBpZClcbiAgaWYgKCFpdGVtKSB0aHJvdyBuZXcgRXJyb3IoJ05vdCBmb3VuZCcpXG5cbiAgcmV0dXJuIHtcbiAgICAuLi5pdGVtLFxuICAgIHN0YWdlczogZ2VuZXJhdGVNb2NrU3RhZ2VzKGl0ZW0uY3VycmVudFN0YXR1cylcbiAgfVxufSAiLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFxtb2NrXFxcXHByb2R1Y3REYXRhLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXEpheW5lXFxcXERlc2t0b3BcXFxcVU5JU1xcXFxPTVNcdTk4NzlcdTc2RUVcXFxcc3JjXFxcXG1vY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL0pheW5lL0Rlc2t0b3AvVU5JUy9PTVMlRTklQTElQjklRTclOUIlQUUvc3JjL21vY2svcHJvZHVjdERhdGEudHNcIjtpbXBvcnQgdHlwZSB7IFByb2R1Y3QgfSBmcm9tICdAL3R5cGVzL3Byb2R1Y3QnO1xuXG5leHBvcnQgY29uc3QgbW9ja1Byb2R1Y3RzOiBQcm9kdWN0W10gPSBbXG4gIHtcbiAgICBpZDogJzEnLFxuICAgIHNrdTogJ1NLVTAwMScsXG4gICAgbmFtZTogJ1Rlc3QgUHJvZHVjdCAxJyxcbiAgICB0eXBlOiAnTm9ybWFsJyxcbiAgICBzdGF0dXM6ICdBY3RpdmUnLFxuICAgIHZlbmRvcjogJ1ZlbmRvciBBJyxcbiAgICBicmFuZDogJ0JyYW5kIEEnLFxuICAgIG1hbnVmYWN0dXJlcjogJ01hbnVmYWN0dXJlciBBJyxcbiAgICBjb3N0OiAxMDAuMDAsXG4gICAgcmVndWxhclByaWNlOiAxOTkuOTksXG4gICAgc2FsZVByaWNlOiAxNTkuOTksXG4gICAgcXVhbnRpdHk6IDEwMCxcbiAgICBkb05vdFRyYWNrSW52ZW50b3J5OiBmYWxzZSxcbiAgICBjYXRlZ29yaWVzOiBbJ0VsZWN0cm9uaWNzJywgJ01vYmlsZSBBY2Nlc3NvcmllcyddLFxuICAgIHRhZ3M6IFsnSG90JywgJ05ldyddLFxuICAgIGludGVncmF0aW9uOiAnU2hvcGlmeScsXG4gICAgd2VpZ2h0OiAwLjUsXG4gICAgd2VpZ2h0VW5pdDogJ2tnJyxcbiAgICBkaW1lbnNpb25zOiB7XG4gICAgICBsZW5ndGg6IDEwLFxuICAgICAgd2lkdGg6IDUsXG4gICAgICBoZWlnaHQ6IDIsXG4gICAgICB1bml0OiAnY20nXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgYSBkZXRhaWxlZCBkZXNjcmlwdGlvbiBvZiB0aGUgdGVzdCBwcm9kdWN0JyxcbiAgICBzaG9ydERlc2NyaXB0aW9uOiAnVGVzdCBwcm9kdWN0IGJyaWVmJyxcbiAgICBpbWFnZXM6IFtcbiAgICAgIHtcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZTEuanBnJyxcbiAgICAgICAgYWx0OiAnUHJvZHVjdCBtYWluIGltYWdlJyxcbiAgICAgICAgaXNEZWZhdWx0OiB0cnVlXG4gICAgICB9XG4gICAgXSxcbiAgICBjcmVhdGVkOiAnMjAyNC0wMy0yMFQxMDowMDowMFonLFxuICAgIHVwZGF0ZWQ6ICcyMDI0LTAzLTIwVDE1OjMwOjAwWicsXG4gICAgY2hhbm5lbFNldHRpbmdzOiB7XG4gICAgICBjaGFubmVsczogW11cbiAgICB9LFxuICAgIHdhcmVob3VzZVNldHRpbmdzOiB7XG4gICAgICB0cmFja0ludmVudG9yeTogdHJ1ZSxcbiAgICAgIHNhZmV0eVN0b2NrOiAxMCxcbiAgICAgIHJlb3JkZXJQb2ludDogMjAsXG4gICAgICBtYXhTdG9jazogMTAwLFxuICAgICAgZWNvbm9taWNPcmRlclF1YW50aXR5OiA1MCxcbiAgICAgIGxlYWRUaW1lOiA3LFxuICAgICAgd2FyZWhvdXNlczogW10sXG4gICAgICBiYXRjaE1hbmFnZW1lbnQ6IHtcbiAgICAgICAgYmF0Y2hOdW1iZXI6ICcnLFxuICAgICAgICBwcm9kdWN0aW9uRGF0ZTogJycsXG4gICAgICAgIGV4cGlyeURhdGU6ICcnXG4gICAgICB9LFxuICAgICAgcXVhbGl0eUNvbnRyb2w6IHtcbiAgICAgICAgaW5zcGVjdGlvblN0YW5kYXJkczogW10sXG4gICAgICAgIGluc3BlY3Rpb25SZXBvcnRzOiBbXSxcbiAgICAgICAgcXVhbGl0eU1ldHJpY3M6IHt9LFxuICAgICAgICBjZXJ0aWZpY2F0aW9uczogW11cbiAgICAgIH0sXG4gICAgICBsb2NhdGlvbk1hbmFnZW1lbnQ6IHtcbiAgICAgICAgcHJpbWFyeUxvY2F0aW9uOiAnJyxcbiAgICAgICAgc2Vjb25kYXJ5TG9jYXRpb25zOiBbXSxcbiAgICAgICAgbW92ZW1lbnRIaXN0b3J5OiBbXVxuICAgICAgfSxcbiAgICAgIHBhY2thZ2luZ1NwZWNpZmljYXRpb25zOiB7XG4gICAgICAgIHByaW1hcnlQYWNrYWdpbmc6IHtcbiAgICAgICAgICB0eXBlOiAnJyxcbiAgICAgICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgICAgICBsZW5ndGg6IDAsXG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIHVuaXQ6ICdjbSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdlaWdodDoge1xuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICB1bml0OiAna2cnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzaGlwcGluZ1BhY2thZ2luZzoge1xuICAgICAgICAgIHR5cGU6ICcnLFxuICAgICAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgIGxlbmd0aDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgdW5pdDogJ2NtJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgd2VpZ2h0OiB7XG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIHVuaXQ6ICdrZydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBsaWFuY2VTZXR0aW5nczoge1xuICAgICAgY2VydGlmaWNhdGlvbnM6IFtdLFxuICAgICAgcmVzdHJpY3Rpb25zOiBbXSxcbiAgICAgIG1hcmtldEFjY2Vzczoge30sXG4gICAgICBjdXN0b21zOiB7XG4gICAgICAgIGhzQ29kZTogJycsXG4gICAgICAgIGRlY2xhcmVkVmFsdWU6IDAsXG4gICAgICAgIGR1dHlSYXRlOiAwLFxuICAgICAgICB2YXRSYXRlOiAwXG4gICAgICB9LFxuICAgICAgc3lzdGVtTWFwcGluZzoge1xuICAgICAgICB0eXBlOiAnbWFudWFsJyxcbiAgICAgICAgZGlyZWN0aW9uOiAnaW1wb3J0JyxcbiAgICAgICAgc3RhdHVzOiAncGVuZGluZydcbiAgICAgIH0sXG4gICAgICBkb2N1bWVudE1hbmFnZW1lbnQ6IHtcbiAgICAgICAgZG9jdW1lbnRzOiBbXSxcbiAgICAgICAgZXhwaXJhdGlvbkFsZXJ0czogW10sXG4gICAgICAgIGRvY3VtZW50VHlwZXM6IFtdLFxuICAgICAgICBhY2Nlc3NDb250cm9sOiB7XG4gICAgICAgICAgcm9sZXM6IFtdLFxuICAgICAgICAgIHBlcm1pc3Npb25zOiBbXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29tcGxpYW5jZVVwZGF0ZXM6IFtdLFxuICAgICAgbWFya2V0UmVxdWlyZW1lbnRzOiBbXSxcbiAgICAgIHRyYWluaW5nUmVjb3JkczogW11cbiAgICB9LFxuICAgIG1hcHBpbmdTZXR0aW5nczoge1xuICAgICAgc3lzdGVtTWFwcGluZzoge1xuICAgICAgICB0eXBlOiAnbWFudWFsJyxcbiAgICAgICAgZGlyZWN0aW9uOiAnaW1wb3J0JyxcbiAgICAgICAgc3RhdHVzOiAncGVuZGluZydcbiAgICAgIH0sXG4gICAgICBjaGFubmVsTWFwcGluZ3M6IFtdLFxuICAgICAgYXR0cmlidXRlTWFwcGluZ3M6IFtdLFxuICAgICAgdmVyc2lvbkNvbnRyb2w6IHtcbiAgICAgICAgY3VycmVudFZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgIHByZXZpb3VzVmVyc2lvbnM6IFtdLFxuICAgICAgICBicmFuY2hpbmdTdHJhdGVneTogJ21haW4nLFxuICAgICAgICBtZXJnZUhpc3Rvcnk6IFtdXG4gICAgICB9LFxuICAgICAgY2hhbmdlSGlzdG9yeTogW10sXG4gICAgICB2YWxpZGF0aW9uUnVsZXM6IFtdLFxuICAgICAgcGVyZm9ybWFuY2VNZXRyaWNzOiB7XG4gICAgICAgIHN5bmNEdXJhdGlvbjogMCxcbiAgICAgICAgZXJyb3JSYXRlOiAwLFxuICAgICAgICBzdWNjZXNzUmF0ZTogMCxcbiAgICAgICAgdGhyb3VnaHB1dDogMCxcbiAgICAgICAgbGF0ZW5jeTogMCxcbiAgICAgICAgbGFzdE1lYXN1cmVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJzInLFxuICAgIHNrdTogJ1NLVTAwMicsXG4gICAgbmFtZTogJ1Rlc3QgUHJvZHVjdCAyJyxcbiAgICB0eXBlOiAnU2FtcGxlJyxcbiAgICBzdGF0dXM6ICdEcmFmdCcsXG4gICAgdmVuZG9yOiAnVmVuZG9yIEInLFxuICAgIGJyYW5kOiAnQnJhbmQgQicsXG4gICAgbWFudWZhY3R1cmVyOiAnTWFudWZhY3R1cmVyIEInLFxuICAgIGNvc3Q6IDUwLjAwLFxuICAgIHJlZ3VsYXJQcmljZTogOTkuOTksXG4gICAgc2FsZVByaWNlOiA3OS45OSxcbiAgICBxdWFudGl0eTogNTAsXG4gICAgZG9Ob3RUcmFja0ludmVudG9yeTogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiBbJ0Nsb3RoaW5nJywgJ0FjY2Vzc29yaWVzJ10sXG4gICAgdGFnczogWydTYW1wbGUnLCAnTGltaXRlZCddLFxuICAgIGludGVncmF0aW9uOiAnQW1hem9uJyxcbiAgICB3ZWlnaHQ6IDAuMyxcbiAgICB3ZWlnaHRVbml0OiAna2cnLFxuICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgIGxlbmd0aDogMjAsXG4gICAgICB3aWR0aDogMTUsXG4gICAgICBoZWlnaHQ6IDUsXG4gICAgICB1bml0OiAnY20nXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgYSBkZXRhaWxlZCBkZXNjcmlwdGlvbiBvZiB0aGUgc2FtcGxlIHByb2R1Y3QnLFxuICAgIHNob3J0RGVzY3JpcHRpb246ICdTYW1wbGUgcHJvZHVjdCBicmllZicsXG4gICAgaW1hZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2UyLmpwZycsXG4gICAgICAgIGFsdDogJ1NhbXBsZSBwcm9kdWN0IG1haW4gaW1hZ2UnLFxuICAgICAgICBpc0RlZmF1bHQ6IHRydWVcbiAgICAgIH1cbiAgICBdLFxuICAgIGNyZWF0ZWQ6ICcyMDI0LTAzLTE5VDA4OjAwOjAwWicsXG4gICAgdXBkYXRlZDogJzIwMjQtMDMtMTlUMTY6NDU6MDBaJyxcbiAgICBjaGFubmVsU2V0dGluZ3M6IHtcbiAgICAgIGNoYW5uZWxzOiBbXVxuICAgIH0sXG4gICAgd2FyZWhvdXNlU2V0dGluZ3M6IHtcbiAgICAgIHRyYWNrSW52ZW50b3J5OiB0cnVlLFxuICAgICAgc2FmZXR5U3RvY2s6IDEwLFxuICAgICAgcmVvcmRlclBvaW50OiAyMCxcbiAgICAgIG1heFN0b2NrOiAxMDAsXG4gICAgICBlY29ub21pY09yZGVyUXVhbnRpdHk6IDUwLFxuICAgICAgbGVhZFRpbWU6IDcsXG4gICAgICB3YXJlaG91c2VzOiBbXSxcbiAgICAgIGJhdGNoTWFuYWdlbWVudDoge1xuICAgICAgICBiYXRjaE51bWJlcjogJycsXG4gICAgICAgIHByb2R1Y3Rpb25EYXRlOiAnJyxcbiAgICAgICAgZXhwaXJ5RGF0ZTogJydcbiAgICAgIH0sXG4gICAgICBxdWFsaXR5Q29udHJvbDoge1xuICAgICAgICBpbnNwZWN0aW9uU3RhbmRhcmRzOiBbXSxcbiAgICAgICAgaW5zcGVjdGlvblJlcG9ydHM6IFtdLFxuICAgICAgICBxdWFsaXR5TWV0cmljczoge30sXG4gICAgICAgIGNlcnRpZmljYXRpb25zOiBbXVxuICAgICAgfSxcbiAgICAgIGxvY2F0aW9uTWFuYWdlbWVudDoge1xuICAgICAgICBwcmltYXJ5TG9jYXRpb246ICcnLFxuICAgICAgICBzZWNvbmRhcnlMb2NhdGlvbnM6IFtdLFxuICAgICAgICBtb3ZlbWVudEhpc3Rvcnk6IFtdXG4gICAgICB9LFxuICAgICAgcGFja2FnaW5nU3BlY2lmaWNhdGlvbnM6IHtcbiAgICAgICAgcHJpbWFyeVBhY2thZ2luZzoge1xuICAgICAgICAgIHR5cGU6ICcnLFxuICAgICAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgIGxlbmd0aDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgdW5pdDogJ2NtJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgd2VpZ2h0OiB7XG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIHVuaXQ6ICdrZydcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNoaXBwaW5nUGFja2FnaW5nOiB7XG4gICAgICAgICAgdHlwZTogJycsXG4gICAgICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICAgICAgbGVuZ3RoOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICB1bml0OiAnY20nXG4gICAgICAgICAgfSxcbiAgICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgdW5pdDogJ2tnJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcGxpYW5jZVNldHRpbmdzOiB7XG4gICAgICBjZXJ0aWZpY2F0aW9uczogW10sXG4gICAgICByZXN0cmljdGlvbnM6IFtdLFxuICAgICAgbWFya2V0QWNjZXNzOiB7fSxcbiAgICAgIGN1c3RvbXM6IHtcbiAgICAgICAgaHNDb2RlOiAnJyxcbiAgICAgICAgZGVjbGFyZWRWYWx1ZTogMCxcbiAgICAgICAgZHV0eVJhdGU6IDAsXG4gICAgICAgIHZhdFJhdGU6IDBcbiAgICAgIH0sXG4gICAgICBzeXN0ZW1NYXBwaW5nOiB7XG4gICAgICAgIHR5cGU6ICdtYW51YWwnLFxuICAgICAgICBkaXJlY3Rpb246ICdpbXBvcnQnLFxuICAgICAgICBzdGF0dXM6ICdwZW5kaW5nJ1xuICAgICAgfSxcbiAgICAgIGRvY3VtZW50TWFuYWdlbWVudDoge1xuICAgICAgICBkb2N1bWVudHM6IFtdLFxuICAgICAgICBleHBpcmF0aW9uQWxlcnRzOiBbXSxcbiAgICAgICAgZG9jdW1lbnRUeXBlczogW10sXG4gICAgICAgIGFjY2Vzc0NvbnRyb2w6IHtcbiAgICAgICAgICByb2xlczogW10sXG4gICAgICAgICAgcGVybWlzc2lvbnM6IFtdXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjb21wbGlhbmNlVXBkYXRlczogW10sXG4gICAgICBtYXJrZXRSZXF1aXJlbWVudHM6IFtdLFxuICAgICAgdHJhaW5pbmdSZWNvcmRzOiBbXVxuICAgIH0sXG4gICAgbWFwcGluZ1NldHRpbmdzOiB7XG4gICAgICBzeXN0ZW1NYXBwaW5nOiB7XG4gICAgICAgIHR5cGU6ICdtYW51YWwnLFxuICAgICAgICBkaXJlY3Rpb246ICdpbXBvcnQnLFxuICAgICAgICBzdGF0dXM6ICdwZW5kaW5nJ1xuICAgICAgfSxcbiAgICAgIGNoYW5uZWxNYXBwaW5nczogW10sXG4gICAgICBhdHRyaWJ1dGVNYXBwaW5nczogW10sXG4gICAgICB2ZXJzaW9uQ29udHJvbDoge1xuICAgICAgICBjdXJyZW50VmVyc2lvbjogJzEuMC4wJyxcbiAgICAgICAgcHJldmlvdXNWZXJzaW9uczogW10sXG4gICAgICAgIGJyYW5jaGluZ1N0cmF0ZWd5OiAnbWFpbicsXG4gICAgICAgIG1lcmdlSGlzdG9yeTogW11cbiAgICAgIH0sXG4gICAgICBjaGFuZ2VIaXN0b3J5OiBbXSxcbiAgICAgIHZhbGlkYXRpb25SdWxlczogW10sXG4gICAgICBwZXJmb3JtYW5jZU1ldHJpY3M6IHtcbiAgICAgICAgc3luY0R1cmF0aW9uOiAwLFxuICAgICAgICBlcnJvclJhdGU6IDAsXG4gICAgICAgIHN1Y2Nlc3NSYXRlOiAwLFxuICAgICAgICB0aHJvdWdocHV0OiAwLFxuICAgICAgICBsYXRlbmN5OiAwLFxuICAgICAgICBsYXN0TWVhc3VyZWQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAge1xuICAgIGlkOiAnMycsXG4gICAgc2t1OiAnU0tVMDAzJyxcbiAgICBuYW1lOiAnVGVzdCBQcm9kdWN0IDMnLFxuICAgIHR5cGU6ICdCdW5kbGUnLFxuICAgIHN0YXR1czogJ0FjdGl2ZScsXG4gICAgdmVuZG9yOiAnVmVuZG9yIEMnLFxuICAgIGJyYW5kOiAnQnJhbmQgQycsXG4gICAgbWFudWZhY3R1cmVyOiAnTWFudWZhY3R1cmVyIEMnLFxuICAgIGNvc3Q6IDIwMC4wMCxcbiAgICByZWd1bGFyUHJpY2U6IDM5OS45OSxcbiAgICBzYWxlUHJpY2U6IDI5OS45OSxcbiAgICBxdWFudGl0eTogMzAsXG4gICAgZG9Ob3RUcmFja0ludmVudG9yeTogZmFsc2UsXG4gICAgY2F0ZWdvcmllczogWydCdW5kbGVzJywgJ0dpZnRzJ10sXG4gICAgdGFnczogWydQcm9tb3Rpb24nLCAnQnVuZGxlJ10sXG4gICAgaW50ZWdyYXRpb246ICdlQmF5JyxcbiAgICB3ZWlnaHQ6IDEuMixcbiAgICB3ZWlnaHRVbml0OiAna2cnLFxuICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgIGxlbmd0aDogMzAsXG4gICAgICB3aWR0aDogMjAsXG4gICAgICBoZWlnaHQ6IDE1LFxuICAgICAgdW5pdDogJ2NtJ1xuICAgIH0sXG4gICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIGEgZGV0YWlsZWQgZGVzY3JpcHRpb24gb2YgdGhlIGJ1bmRsZSBwcm9kdWN0JyxcbiAgICBzaG9ydERlc2NyaXB0aW9uOiAnQnVuZGxlIHByb2R1Y3QgYnJpZWYnLFxuICAgIGltYWdlczogW1xuICAgICAge1xuICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlMy5qcGcnLFxuICAgICAgICBhbHQ6ICdCdW5kbGUgcHJvZHVjdCBtYWluIGltYWdlJyxcbiAgICAgICAgaXNEZWZhdWx0OiB0cnVlXG4gICAgICB9XG4gICAgXSxcbiAgICBjcmVhdGVkOiAnMjAyNC0wMy0xOFQwOTozMDowMFonLFxuICAgIHVwZGF0ZWQ6ICcyMDI0LTAzLTE4VDE0OjIwOjAwWicsXG4gICAgY2hhbm5lbFNldHRpbmdzOiB7XG4gICAgICBjaGFubmVsczogW11cbiAgICB9LFxuICAgIHdhcmVob3VzZVNldHRpbmdzOiB7XG4gICAgICB0cmFja0ludmVudG9yeTogdHJ1ZSxcbiAgICAgIHNhZmV0eVN0b2NrOiAxMCxcbiAgICAgIHJlb3JkZXJQb2ludDogMjAsXG4gICAgICBtYXhTdG9jazogMTAwLFxuICAgICAgZWNvbm9taWNPcmRlclF1YW50aXR5OiA1MCxcbiAgICAgIGxlYWRUaW1lOiA3LFxuICAgICAgd2FyZWhvdXNlczogW10sXG4gICAgICBiYXRjaE1hbmFnZW1lbnQ6IHtcbiAgICAgICAgYmF0Y2hOdW1iZXI6ICcnLFxuICAgICAgICBwcm9kdWN0aW9uRGF0ZTogJycsXG4gICAgICAgIGV4cGlyeURhdGU6ICcnXG4gICAgICB9LFxuICAgICAgcXVhbGl0eUNvbnRyb2w6IHtcbiAgICAgICAgaW5zcGVjdGlvblN0YW5kYXJkczogW10sXG4gICAgICAgIGluc3BlY3Rpb25SZXBvcnRzOiBbXSxcbiAgICAgICAgcXVhbGl0eU1ldHJpY3M6IHt9LFxuICAgICAgICBjZXJ0aWZpY2F0aW9uczogW11cbiAgICAgIH0sXG4gICAgICBsb2NhdGlvbk1hbmFnZW1lbnQ6IHtcbiAgICAgICAgcHJpbWFyeUxvY2F0aW9uOiAnJyxcbiAgICAgICAgc2Vjb25kYXJ5TG9jYXRpb25zOiBbXSxcbiAgICAgICAgbW92ZW1lbnRIaXN0b3J5OiBbXVxuICAgICAgfSxcbiAgICAgIHBhY2thZ2luZ1NwZWNpZmljYXRpb25zOiB7XG4gICAgICAgIHByaW1hcnlQYWNrYWdpbmc6IHtcbiAgICAgICAgICB0eXBlOiAnJyxcbiAgICAgICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgICAgICBsZW5ndGg6IDAsXG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIHVuaXQ6ICdjbSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdlaWdodDoge1xuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICB1bml0OiAna2cnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzaGlwcGluZ1BhY2thZ2luZzoge1xuICAgICAgICAgIHR5cGU6ICcnLFxuICAgICAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgIGxlbmd0aDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgdW5pdDogJ2NtJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgd2VpZ2h0OiB7XG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIHVuaXQ6ICdrZydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBsaWFuY2VTZXR0aW5nczoge1xuICAgICAgY2VydGlmaWNhdGlvbnM6IFtdLFxuICAgICAgcmVzdHJpY3Rpb25zOiBbXSxcbiAgICAgIG1hcmtldEFjY2Vzczoge30sXG4gICAgICBjdXN0b21zOiB7XG4gICAgICAgIGhzQ29kZTogJycsXG4gICAgICAgIGRlY2xhcmVkVmFsdWU6IDAsXG4gICAgICAgIGR1dHlSYXRlOiAwLFxuICAgICAgICB2YXRSYXRlOiAwXG4gICAgICB9LFxuICAgICAgc3lzdGVtTWFwcGluZzoge1xuICAgICAgICB0eXBlOiAnbWFudWFsJyxcbiAgICAgICAgZGlyZWN0aW9uOiAnaW1wb3J0JyxcbiAgICAgICAgc3RhdHVzOiAncGVuZGluZydcbiAgICAgIH0sXG4gICAgICBkb2N1bWVudE1hbmFnZW1lbnQ6IHtcbiAgICAgICAgZG9jdW1lbnRzOiBbXSxcbiAgICAgICAgZXhwaXJhdGlvbkFsZXJ0czogW10sXG4gICAgICAgIGRvY3VtZW50VHlwZXM6IFtdLFxuICAgICAgICBhY2Nlc3NDb250cm9sOiB7XG4gICAgICAgICAgcm9sZXM6IFtdLFxuICAgICAgICAgIHBlcm1pc3Npb25zOiBbXVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29tcGxpYW5jZVVwZGF0ZXM6IFtdLFxuICAgICAgbWFya2V0UmVxdWlyZW1lbnRzOiBbXSxcbiAgICAgIHRyYWluaW5nUmVjb3JkczogW11cbiAgICB9LFxuICAgIG1hcHBpbmdTZXR0aW5nczoge1xuICAgICAgc3lzdGVtTWFwcGluZzoge1xuICAgICAgICB0eXBlOiAnbWFudWFsJyxcbiAgICAgICAgZGlyZWN0aW9uOiAnaW1wb3J0JyxcbiAgICAgICAgc3RhdHVzOiAncGVuZGluZydcbiAgICAgIH0sXG4gICAgICBjaGFubmVsTWFwcGluZ3M6IFtdLFxuICAgICAgYXR0cmlidXRlTWFwcGluZ3M6IFtdLFxuICAgICAgdmVyc2lvbkNvbnRyb2w6IHtcbiAgICAgICAgY3VycmVudFZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgIHByZXZpb3VzVmVyc2lvbnM6IFtdLFxuICAgICAgICBicmFuY2hpbmdTdHJhdGVneTogJ21haW4nLFxuICAgICAgICBtZXJnZUhpc3Rvcnk6IFtdXG4gICAgICB9LFxuICAgICAgY2hhbmdlSGlzdG9yeTogW10sXG4gICAgICB2YWxpZGF0aW9uUnVsZXM6IFtdLFxuICAgICAgcGVyZm9ybWFuY2VNZXRyaWNzOiB7XG4gICAgICAgIHN5bmNEdXJhdGlvbjogMCxcbiAgICAgICAgZXJyb3JSYXRlOiAwLFxuICAgICAgICBzdWNjZXNzUmF0ZTogMCxcbiAgICAgICAgdGhyb3VnaHB1dDogMCxcbiAgICAgICAgbGF0ZW5jeTogMCxcbiAgICAgICAgbGFzdE1lYXN1cmVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1bmRsZVNldHRpbmdzOiB7XG4gICAgICBidW5kbGVUeXBlOiAnRklYRUQnLFxuICAgICAgcHJpY2luZ1N0cmF0ZWd5OiAnRElTQ09VTlQnLFxuICAgICAgaW52ZW50b3J5U3RyYXRlZ3k6ICdDT01QT05FTlQnLFxuICAgICAgY29tcG9uZW50czogW10sXG4gICAgICBzYWxlc1J1bGVzOiBbXSxcbiAgICAgIHByaWNlSGlzdG9yeTogW10sXG4gICAgICBzYWxlc0FuYWx5dGljczoge1xuICAgICAgICBzYWxlc0NvdW50OiAwLFxuICAgICAgICBjb252ZXJzaW9uUmF0ZTogMCxcbiAgICAgICAgYXZlcmFnZU9yZGVyVmFsdWU6IDAsXG4gICAgICAgIHRvcFNlbGxpbmdDb21iaW5hdGlvbnM6IFtdLFxuICAgICAgICBjdXN0b21lclNlZ21lbnRzOiBbXSxcbiAgICAgICAgc2Vhc29uYWxpdHlUcmVuZHM6IFtdXG4gICAgICB9LFxuICAgICAgaW52ZW50b3J5QWxlcnRzOiBbXSxcbiAgICAgIHJlY29tbWVuZGF0aW9uczogW11cbiAgICB9XG4gIH0sXG4gIHtcbiAgICBpZDogJzQnLFxuICAgIHNrdTogJ1NLVTAwNCcsXG4gICAgbmFtZTogJ1Rlc3QgUHJvZHVjdCA0JyxcbiAgICB0eXBlOiAnVmlydHVhbCcsXG4gICAgc3RhdHVzOiAnT3V0X09mX1N0b2NrJyxcbiAgICB2ZW5kb3I6ICdWZW5kb3IgRCcsXG4gICAgYnJhbmQ6ICdCcmFuZCBEJyxcbiAgICBtYW51ZmFjdHVyZXI6ICdNYW51ZmFjdHVyZXIgRCcsXG4gICAgY29zdDogMTAuMDAsXG4gICAgcmVndWxhclByaWNlOiAyOS45OSxcbiAgICBzYWxlUHJpY2U6IDE5Ljk5LFxuICAgIHF1YW50aXR5OiAwLFxuICAgIGRvTm90VHJhY2tJbnZlbnRvcnk6IHRydWUsXG4gICAgY2F0ZWdvcmllczogWydEaWdpdGFsIFByb2R1Y3RzJywgJ1NvZnR3YXJlJ10sXG4gICAgdGFnczogWydWaXJ0dWFsJywgJ0Rvd25sb2FkJ10sXG4gICAgaW50ZWdyYXRpb246ICdTaG9waWZ5JyxcbiAgICB3ZWlnaHQ6IDAsXG4gICAgd2VpZ2h0VW5pdDogJ2tnJyxcbiAgICBkaW1lbnNpb25zOiB7XG4gICAgICBsZW5ndGg6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIHVuaXQ6ICdjbSdcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBhIGRldGFpbGVkIGRlc2NyaXB0aW9uIG9mIHRoZSB2aXJ0dWFsIHByb2R1Y3QnLFxuICAgIHNob3J0RGVzY3JpcHRpb246ICdWaXJ0dWFsIHByb2R1Y3QgYnJpZWYnLFxuICAgIGltYWdlczogW1xuICAgICAge1xuICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlNC5qcGcnLFxuICAgICAgICBhbHQ6ICdWaXJ0dWFsIHByb2R1Y3QgbWFpbiBpbWFnZScsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZVxuICAgICAgfVxuICAgIF0sXG4gICAgY3JlYXRlZDogJzIwMjQtMDMtMTdUMTE6MjA6MDBaJyxcbiAgICB1cGRhdGVkOiAnMjAyNC0wMy0xN1QxODoxNTowMFonLFxuICAgIGNoYW5uZWxTZXR0aW5nczoge1xuICAgICAgY2hhbm5lbHM6IFtdXG4gICAgfSxcbiAgICB3YXJlaG91c2VTZXR0aW5nczoge1xuICAgICAgdHJhY2tJbnZlbnRvcnk6IHRydWUsXG4gICAgICBzYWZldHlTdG9jazogMTAsXG4gICAgICByZW9yZGVyUG9pbnQ6IDIwLFxuICAgICAgbWF4U3RvY2s6IDEwMCxcbiAgICAgIGVjb25vbWljT3JkZXJRdWFudGl0eTogNTAsXG4gICAgICBsZWFkVGltZTogNyxcbiAgICAgIHdhcmVob3VzZXM6IFtdLFxuICAgICAgYmF0Y2hNYW5hZ2VtZW50OiB7XG4gICAgICAgIGJhdGNoTnVtYmVyOiAnJyxcbiAgICAgICAgcHJvZHVjdGlvbkRhdGU6ICcnLFxuICAgICAgICBleHBpcnlEYXRlOiAnJ1xuICAgICAgfSxcbiAgICAgIHF1YWxpdHlDb250cm9sOiB7XG4gICAgICAgIGluc3BlY3Rpb25TdGFuZGFyZHM6IFtdLFxuICAgICAgICBpbnNwZWN0aW9uUmVwb3J0czogW10sXG4gICAgICAgIHF1YWxpdHlNZXRyaWNzOiB7fSxcbiAgICAgICAgY2VydGlmaWNhdGlvbnM6IFtdXG4gICAgICB9LFxuICAgICAgbG9jYXRpb25NYW5hZ2VtZW50OiB7XG4gICAgICAgIHByaW1hcnlMb2NhdGlvbjogJycsXG4gICAgICAgIHNlY29uZGFyeUxvY2F0aW9uczogW10sXG4gICAgICAgIG1vdmVtZW50SGlzdG9yeTogW11cbiAgICAgIH0sXG4gICAgICBwYWNrYWdpbmdTcGVjaWZpY2F0aW9uczoge1xuICAgICAgICBwcmltYXJ5UGFja2FnaW5nOiB7XG4gICAgICAgICAgdHlwZTogJycsXG4gICAgICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICAgICAgbGVuZ3RoOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICB1bml0OiAnY20nXG4gICAgICAgICAgfSxcbiAgICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgdW5pdDogJ2tnJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2hpcHBpbmdQYWNrYWdpbmc6IHtcbiAgICAgICAgICB0eXBlOiAnJyxcbiAgICAgICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgICAgICBsZW5ndGg6IDAsXG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIHVuaXQ6ICdjbSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdlaWdodDoge1xuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICB1bml0OiAna2cnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wbGlhbmNlU2V0dGluZ3M6IHtcbiAgICAgIGNlcnRpZmljYXRpb25zOiBbXSxcbiAgICAgIHJlc3RyaWN0aW9uczogW10sXG4gICAgICBtYXJrZXRBY2Nlc3M6IHt9LFxuICAgICAgY3VzdG9tczoge1xuICAgICAgICBoc0NvZGU6ICcnLFxuICAgICAgICBkZWNsYXJlZFZhbHVlOiAwLFxuICAgICAgICBkdXR5UmF0ZTogMCxcbiAgICAgICAgdmF0UmF0ZTogMFxuICAgICAgfSxcbiAgICAgIHN5c3RlbU1hcHBpbmc6IHtcbiAgICAgICAgdHlwZTogJ21hbnVhbCcsXG4gICAgICAgIGRpcmVjdGlvbjogJ2ltcG9ydCcsXG4gICAgICAgIHN0YXR1czogJ3BlbmRpbmcnXG4gICAgICB9LFxuICAgICAgZG9jdW1lbnRNYW5hZ2VtZW50OiB7XG4gICAgICAgIGRvY3VtZW50czogW10sXG4gICAgICAgIGV4cGlyYXRpb25BbGVydHM6IFtdLFxuICAgICAgICBkb2N1bWVudFR5cGVzOiBbXSxcbiAgICAgICAgYWNjZXNzQ29udHJvbDoge1xuICAgICAgICAgIHJvbGVzOiBbXSxcbiAgICAgICAgICBwZXJtaXNzaW9uczogW11cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbXBsaWFuY2VVcGRhdGVzOiBbXSxcbiAgICAgIG1hcmtldFJlcXVpcmVtZW50czogW10sXG4gICAgICB0cmFpbmluZ1JlY29yZHM6IFtdXG4gICAgfSxcbiAgICBtYXBwaW5nU2V0dGluZ3M6IHtcbiAgICAgIHN5c3RlbU1hcHBpbmc6IHtcbiAgICAgICAgdHlwZTogJ21hbnVhbCcsXG4gICAgICAgIGRpcmVjdGlvbjogJ2ltcG9ydCcsXG4gICAgICAgIHN0YXR1czogJ3BlbmRpbmcnXG4gICAgICB9LFxuICAgICAgY2hhbm5lbE1hcHBpbmdzOiBbXSxcbiAgICAgIGF0dHJpYnV0ZU1hcHBpbmdzOiBbXSxcbiAgICAgIHZlcnNpb25Db250cm9sOiB7XG4gICAgICAgIGN1cnJlbnRWZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICBwcmV2aW91c1ZlcnNpb25zOiBbXSxcbiAgICAgICAgYnJhbmNoaW5nU3RyYXRlZ3k6ICdtYWluJyxcbiAgICAgICAgbWVyZ2VIaXN0b3J5OiBbXVxuICAgICAgfSxcbiAgICAgIGNoYW5nZUhpc3Rvcnk6IFtdLFxuICAgICAgdmFsaWRhdGlvblJ1bGVzOiBbXSxcbiAgICAgIHBlcmZvcm1hbmNlTWV0cmljczoge1xuICAgICAgICBzeW5jRHVyYXRpb246IDAsXG4gICAgICAgIGVycm9yUmF0ZTogMCxcbiAgICAgICAgc3VjY2Vzc1JhdGU6IDAsXG4gICAgICAgIHRocm91Z2hwdXQ6IDAsXG4gICAgICAgIGxhdGVuY3k6IDAsXG4gICAgICAgIGxhc3RNZWFzdXJlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICB9XG4gICAgfVxuICB9XG5dO1xuXG4vLyBNb2NrIHZlbmRvciBsaXN0XG5leHBvcnQgY29uc3QgbW9ja1ZlbmRvcnMgPSBbJ1ZlbmRvciBBJywgJ1ZlbmRvciBCJywgJ1ZlbmRvciBDJywgJ1ZlbmRvciBEJywgJ1ZlbmRvciBFJ107XG5cbi8vIE1vY2sgYnJhbmQgbGlzdFxuZXhwb3J0IGNvbnN0IG1vY2tCcmFuZHMgPSBbJ0JyYW5kIEEnLCAnQnJhbmQgQicsICdCcmFuZCBDJywgJ0JyYW5kIEQnLCAnQnJhbmQgRSddO1xuXG4vLyBNb2NrIEFQSSByZXNwb25zZSBmb3IgZ2V0dGluZyBwcm9kdWN0IGxpc3RcbmV4cG9ydCBjb25zdCBnZXRNb2NrUHJvZHVjdHMgPSAocGFyYW1zOiB7XG4gIHBhZ2U6IG51bWJlcjtcbiAgcGFnZVNpemU6IG51bWJlcjtcbiAgc2VhcmNoPzogc3RyaW5nO1xuICB0eXBlPzogc3RyaW5nO1xuICBpbnRlZ3JhdGlvbj86IHN0cmluZztcbn0pID0+IHtcbiAgbGV0IGZpbHRlcmVkUHJvZHVjdHMgPSBbLi4ubW9ja1Byb2R1Y3RzXTtcblxuICAvLyBTZWFyY2ggZmlsdGVyaW5nXG4gIGlmIChwYXJhbXMuc2VhcmNoKSB7XG4gICAgY29uc3Qgc2VhcmNoTG93ZXIgPSBwYXJhbXMuc2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gICAgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlcmVkUHJvZHVjdHMuZmlsdGVyKFxuICAgICAgcHJvZHVjdCA9PlxuICAgICAgICAocHJvZHVjdC5uYW1lPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSA/PyBmYWxzZSkgfHxcbiAgICAgICAgKHByb2R1Y3Quc2t1Py50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSA/PyBmYWxzZSkgfHxcbiAgICAgICAgKHByb2R1Y3QudmVuZG9yPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKSA/PyBmYWxzZSlcbiAgICApO1xuICB9XG5cbiAgLy8gVHlwZSBmaWx0ZXJpbmdcbiAgaWYgKHBhcmFtcy50eXBlKSB7XG4gICAgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlcmVkUHJvZHVjdHMuZmlsdGVyKFxuICAgICAgcHJvZHVjdCA9PiBwcm9kdWN0LnR5cGUgPT09IHBhcmFtcy50eXBlXG4gICAgKTtcbiAgfVxuXG4gIC8vIEludGVncmF0aW9uIGZpbHRlcmluZ1xuICBpZiAocGFyYW1zLmludGVncmF0aW9uKSB7XG4gICAgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlcmVkUHJvZHVjdHMuZmlsdGVyKFxuICAgICAgcHJvZHVjdCA9PiBwcm9kdWN0LmludGVncmF0aW9uID09PSBwYXJhbXMuaW50ZWdyYXRpb25cbiAgICApO1xuICB9XG5cbiAgLy8gQ2FsY3VsYXRlIHBhZ2luYXRpb25cbiAgY29uc3Qgc3RhcnQgPSAocGFyYW1zLnBhZ2UgLSAxKSAqIHBhcmFtcy5wYWdlU2l6ZTtcbiAgY29uc3QgZW5kID0gc3RhcnQgKyBwYXJhbXMucGFnZVNpemU7XG4gIGNvbnN0IHBhZ2luYXRlZFByb2R1Y3RzID0gZmlsdGVyZWRQcm9kdWN0cy5zbGljZShzdGFydCwgZW5kKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICBkYXRhOiBwYWdpbmF0ZWRQcm9kdWN0cyxcbiAgICB0b3RhbDogZmlsdGVyZWRQcm9kdWN0cy5sZW5ndGhcbiAgfTtcbn07XG5cbi8vIE1vY2sgQVBJIGZvciBkZWxldGluZyBwcm9kdWN0XG5leHBvcnQgY29uc3QgbW9ja0RlbGV0ZVByb2R1Y3QgPSBhc3luYyAoaWQ6IHN0cmluZykgPT4ge1xuICBjb25zdCBpbmRleCA9IG1vY2tQcm9kdWN0cy5maW5kSW5kZXgocCA9PiBwLmlkID09PSBpZCk7XG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICBtb2NrUHJvZHVjdHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2R1Y3Qgbm90IGZvdW5kJyk7XG59O1xuXG4vLyBNb2NrIEFQSSBmb3IgY3JlYXRpbmcgcHJvZHVjdFxuZXhwb3J0IGNvbnN0IG1vY2tDcmVhdGVQcm9kdWN0ID0gYXN5bmMgKGRhdGE6IFBhcnRpYWw8UHJvZHVjdD4pID0+IHtcbiAgY29uc3QgbmV3UHJvZHVjdDogUHJvZHVjdCA9IHtcbiAgICBpZDogU3RyaW5nKG1vY2tQcm9kdWN0cy5sZW5ndGggKyAxKSxcbiAgICBza3U6IGRhdGEuc2t1IHx8IGBTS1Uke1N0cmluZyhtb2NrUHJvZHVjdHMubGVuZ3RoICsgMSkucGFkU3RhcnQoMywgJzAnKX1gLFxuICAgIG5hbWU6IGRhdGEubmFtZSB8fCAnJyxcbiAgICB0eXBlOiBkYXRhLnR5cGUgfHwgJ05vcm1hbCcsXG4gICAgc3RhdHVzOiAnRHJhZnQnLFxuICAgIHZlbmRvcjogZGF0YS52ZW5kb3IgfHwgJycsXG4gICAgYnJhbmQ6IGRhdGEuYnJhbmQgfHwgJycsXG4gICAgY29zdDogZGF0YS5jb3N0IHx8IDAsXG4gICAgcmVndWxhclByaWNlOiBkYXRhLnJlZ3VsYXJQcmljZSB8fCAwLFxuICAgIHNhbGVQcmljZTogZGF0YS5zYWxlUHJpY2UgfHwgMCxcbiAgICBxdWFudGl0eTogZGF0YS5xdWFudGl0eSB8fCAwLFxuICAgIGRvTm90VHJhY2tJbnZlbnRvcnk6IGRhdGEuZG9Ob3RUcmFja0ludmVudG9yeSB8fCBmYWxzZSxcbiAgICBjYXRlZ29yaWVzOiBkYXRhLmNhdGVnb3JpZXMgfHwgW10sXG4gICAgdGFnczogZGF0YS50YWdzIHx8IFtdLFxuICAgIHdlaWdodDogZGF0YS53ZWlnaHQgfHwgMCxcbiAgICB3ZWlnaHRVbml0OiBkYXRhLndlaWdodFVuaXQgfHwgJ2tnJyxcbiAgICBkaW1lbnNpb25zOiBkYXRhLmRpbWVuc2lvbnMgfHwge1xuICAgICAgbGVuZ3RoOiAwLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICB1bml0OiAnY20nXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICBzaG9ydERlc2NyaXB0aW9uOiBkYXRhLnNob3J0RGVzY3JpcHRpb24gfHwgJycsXG4gICAgaW1hZ2VzOiBkYXRhLmltYWdlcyB8fCBbXSxcbiAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXBkYXRlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIH07XG5cbiAgbW9ja1Byb2R1Y3RzLnB1c2gobmV3UHJvZHVjdCk7XG4gIHJldHVybiBuZXdQcm9kdWN0O1xufTsiLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFxtb2NrXFxcXHNhZmV0eVN0b2NrRGF0YS50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFxtb2NrXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9KYXluZS9EZXNrdG9wL1VOSVMvT01TJUU5JUExJUI5JUU3JTlCJUFFL3NyYy9tb2NrL3NhZmV0eVN0b2NrRGF0YS50c1wiO2ltcG9ydCB7XG4gIFNhZmV0eVN0b2NrTGV2ZWwsXG4gIFNhZmV0eVN0b2NrU3RhdHVzLFxuICBBbGVydFR5cGUsXG4gIENoYW5uZWxTY29wZVR5cGUsXG4gIFN0b3JlU2NvcGVUeXBlXG59IGZyb20gJ0AvdHlwZXMvc2FmZXR5U3RvY2snXG5pbXBvcnQgdHlwZSB7XG4gIFNhZmV0eVN0b2NrQ29uZmlnLFxuICBGbGV4aWJsZVNhZmV0eVN0b2NrQ29uZmlnLFxuICBTdG9ja0FsZXJ0LFxuICBTYWZldHlTdG9ja1N0YXRzLFxuICBDaGFubmVsT3B0aW9uLFxuICBTdG9yZU9wdGlvbixcbiAgV2FyZWhvdXNlT3B0aW9uLFxuICBTa3VPcHRpb25cbn0gZnJvbSAnQC90eXBlcy9zYWZldHlTdG9jaydcblxuLy8gXHU2QTIxXHU2MkRGXHU2RTIwXHU5MDUzXHU2NTcwXHU2MzZFXG5leHBvcnQgY29uc3QgbW9ja0NoYW5uZWxzOiBDaGFubmVsT3B0aW9uW10gPSBbXG4gIHtcbiAgICBpZDogJ0NIMDAxJyxcbiAgICBuYW1lOiAnQW1hem9uIFVTJyxcbiAgICB0eXBlOiAnbWFya2V0cGxhY2UnLFxuICAgIHN0YXR1czogJ2FjdGl2ZSdcbiAgfSxcbiAge1xuICAgIGlkOiAnQ0gwMDInLFxuICAgIG5hbWU6ICdlQmF5IFVTJyxcbiAgICB0eXBlOiAnbWFya2V0cGxhY2UnLFxuICAgIHN0YXR1czogJ2FjdGl2ZSdcbiAgfSxcbiAge1xuICAgIGlkOiAnQ0gwMDMnLFxuICAgIG5hbWU6ICdTaG9waWZ5IFN0b3JlJyxcbiAgICB0eXBlOiAnZWNvbW1lcmNlJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ0NIMDA0JyxcbiAgICBuYW1lOiAnV2FsbWFydCcsXG4gICAgdHlwZTogJ21hcmtldHBsYWNlJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ0NIMDA1JyxcbiAgICBuYW1lOiAnVGFyZ2V0IFBsdXMnLFxuICAgIHR5cGU6ICdtYXJrZXRwbGFjZScsXG4gICAgc3RhdHVzOiAnaW5hY3RpdmUnXG4gIH1cbl1cblxuLy8gXHU2QTIxXHU2MkRGXHU1RTk3XHU5NEZBXHU2NTcwXHU2MzZFXG5leHBvcnQgY29uc3QgbW9ja1N0b3JlczogU3RvcmVPcHRpb25bXSA9IFtcbiAge1xuICAgIGlkOiAnU1QwMDEnLFxuICAgIG5hbWU6ICdNYWluIEFtYXpvbiBTdG9yZScsXG4gICAgY2hhbm5lbElkOiAnQ0gwMDEnLFxuICAgIGNoYW5uZWxOYW1lOiAnQW1hem9uIFVTJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ1NUMDAyJyxcbiAgICBuYW1lOiAnQnJhbmQgU3RvcmUgQW1hem9uJyxcbiAgICBjaGFubmVsSWQ6ICdDSDAwMScsXG4gICAgY2hhbm5lbE5hbWU6ICdBbWF6b24gVVMnLFxuICAgIHN0YXR1czogJ2FjdGl2ZSdcbiAgfSxcbiAge1xuICAgIGlkOiAnU1QwMDMnLFxuICAgIG5hbWU6ICdlQmF5IE9mZmljaWFsIFN0b3JlJyxcbiAgICBjaGFubmVsSWQ6ICdDSDAwMicsXG4gICAgY2hhbm5lbE5hbWU6ICdlQmF5IFVTJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ1NUMDA0JyxcbiAgICBuYW1lOiAnRGlyZWN0IFNob3BpZnknLFxuICAgIGNoYW5uZWxJZDogJ0NIMDAzJyxcbiAgICBjaGFubmVsTmFtZTogJ1Nob3BpZnkgU3RvcmUnLFxuICAgIHN0YXR1czogJ2FjdGl2ZSdcbiAgfSxcbiAge1xuICAgIGlkOiAnU1QwMDUnLFxuICAgIG5hbWU6ICdXYWxtYXJ0IFN1cHBsaWVyJyxcbiAgICBjaGFubmVsSWQ6ICdDSDAwNCcsXG4gICAgY2hhbm5lbE5hbWU6ICdXYWxtYXJ0JyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH1cbl1cblxuLy8gXHU2QTIxXHU2MkRGXHU0RUQzXHU1RTkzXHU2NTcwXHU2MzZFXG5leHBvcnQgY29uc3QgbW9ja1dhcmVob3VzZXM6IFdhcmVob3VzZU9wdGlvbltdID0gW1xuICB7XG4gICAgaWQ6ICdXSDAwMScsXG4gICAgbmFtZTogJ0xvcyBBbmdlbGVzIFdhcmVob3VzZScsXG4gICAgY29kZTogJ0xBWC0wMDEnLFxuICAgIGFkZHJlc3M6ICcxMjM0IEluZHVzdHJpYWwgQmx2ZCwgTG9zIEFuZ2VsZXMsIENBIDkwMDIxJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ1dIMDAyJyxcbiAgICBuYW1lOiAnTmV3IFlvcmsgV2FyZWhvdXNlJyxcbiAgICBjb2RlOiAnTllDLTAwMScsXG4gICAgYWRkcmVzczogJzU2NzggQ29tbWVyY2UgU3QsIEJyb29rbHluLCBOWSAxMTIzMicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdXSDAwMycsXG4gICAgbmFtZTogJ0NoaWNhZ28gRGlzdHJpYnV0aW9uIENlbnRlcicsXG4gICAgY29kZTogJ0NISS0wMDEnLFxuICAgIGFkZHJlc3M6ICc5MDEyIExvZ2lzdGljcyBBdmUsIENoaWNhZ28sIElMIDYwNjM0JyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH0sXG4gIHtcbiAgICBpZDogJ1dIMDA0JyxcbiAgICBuYW1lOiAnRGFsbGFzIEZ1bGZpbGxtZW50IENlbnRlcicsXG4gICAgY29kZTogJ0RBTC0wMDEnLFxuICAgIGFkZHJlc3M6ICczNDU2IFNoaXBwaW5nIFJkLCBEYWxsYXMsIFRYIDc1MjM3JyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH1cbl1cblxuLy8gXHU2QTIxXHU2MkRGU0tVXHU2NTcwXHU2MzZFXG5leHBvcnQgY29uc3QgbW9ja1NrdXM6IFNrdU9wdGlvbltdID0gW1xuICB7XG4gICAgc2t1OiAnU0tVLTAwMS1CTEstTScsXG4gICAgcHJvZHVjdElkOiAnUFJPRDAwMScsXG4gICAgcHJvZHVjdE5hbWU6ICdDbGFzc2ljIFQtU2hpcnQgQmxhY2sgTWVkaXVtJyxcbiAgICBjYXRlZ29yeTogJ0FwcGFyZWwnLFxuICAgIGJyYW5kOiAnQmFzaWNXZWFyJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH0sXG4gIHtcbiAgICBza3U6ICdTS1UtMDAxLVdIVC1MJyxcbiAgICBwcm9kdWN0SWQ6ICdQUk9EMDAxJyxcbiAgICBwcm9kdWN0TmFtZTogJ0NsYXNzaWMgVC1TaGlydCBXaGl0ZSBMYXJnZScsXG4gICAgY2F0ZWdvcnk6ICdBcHBhcmVsJyxcbiAgICBicmFuZDogJ0Jhc2ljV2VhcicsXG4gICAgc3RhdHVzOiAnYWN0aXZlJ1xuICB9LFxuICB7XG4gICAgc2t1OiAnU0tVLTAwMi1SRUQtUycsXG4gICAgcHJvZHVjdElkOiAnUFJPRDAwMicsXG4gICAgcHJvZHVjdE5hbWU6ICdQcmVtaXVtIEhvb2RpZSBSZWQgU21hbGwnLFxuICAgIGNhdGVnb3J5OiAnQXBwYXJlbCcsXG4gICAgYnJhbmQ6ICdQcmVtaXVtTGluZScsXG4gICAgc3RhdHVzOiAnYWN0aXZlJ1xuICB9LFxuICB7XG4gICAgc2t1OiAnU0tVLTAwMy1CTFUtWEwnLFxuICAgIHByb2R1Y3RJZDogJ1BST0QwMDMnLFxuICAgIHByb2R1Y3ROYW1lOiAnU3BvcnRzIEphY2tldCBCbHVlIEV4dHJhIExhcmdlJyxcbiAgICBjYXRlZ29yeTogJ1Nwb3J0cycsXG4gICAgYnJhbmQ6ICdBY3RpdmVXZWFyJyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH0sXG4gIHtcbiAgICBza3U6ICdTS1UtMDA0LUdSTi1NJyxcbiAgICBwcm9kdWN0SWQ6ICdQUk9EMDA0JyxcbiAgICBwcm9kdWN0TmFtZTogJ0Nhc3VhbCBQYW50cyBHcmVlbiBNZWRpdW0nLFxuICAgIGNhdGVnb3J5OiAnQXBwYXJlbCcsXG4gICAgYnJhbmQ6ICdDb21mb3J0Rml0JyxcbiAgICBzdGF0dXM6ICdhY3RpdmUnXG4gIH1cbl1cblxuLy8gXHU2QTIxXHU2MkRGXHU1Qjg5XHU1MTY4XHU1RTkzXHU1QjU4XHU5MTREXHU3RjZFXHU2NTcwXHU2MzZFXG5leHBvcnQgY29uc3QgbW9ja1NhZmV0eVN0b2NrQ29uZmlnczogU2FmZXR5U3RvY2tDb25maWdbXSA9IFtcbiAgLy8gXHU1MTY4XHU1QzQwXHU5RUQ4XHU4QkE0XHU5MTREXHU3RjZFXG4gIHtcbiAgICBpZDogJ1NTQy1HTE9CQUwtMDAxJyxcbiAgICBsZXZlbDogU2FmZXR5U3RvY2tMZXZlbC5HTE9CQUwsXG4gICAgc3RhdHVzOiBTYWZldHlTdG9ja1N0YXR1cy5BQ1RJVkUsXG4gICAgbWluU3RvY2tRdWFudGl0eTogMTAwLFxuICAgIG1pblN0b2NrVHlwZTogJ3F1YW50aXR5JyxcbiAgICBhbGVydFR5cGU6IFtBbGVydFR5cGUuTE9XX1NUT0NLLCBBbGVydFR5cGUuT1VUX09GX1NUT0NLXSxcbiAgICBhbGVydFRocmVzaG9sZDogMjAsXG4gICAgbWF4U3RvY2tRdWFudGl0eTogMTAwMCxcbiAgICBtYXhTdG9ja1R5cGU6ICdxdWFudGl0eScsXG4gICAgZGlzYWJsZVdtc1N5bmM6IGZhbHNlLFxuICAgIGRpc2FibGVUaGlyZFBhcnR5U3luYzogZmFsc2UsXG4gICAgZGVzY3JpcHRpb246ICdHbG9iYWwgZGVmYXVsdCBzYWZldHkgc3RvY2sgY29uZmlndXJhdGlvbicsXG4gICAgaXNEZWZhdWx0OiB0cnVlLFxuICAgIGNyZWF0ZWRBdDogJzIwMjQtMDEtMDFUMDA6MDA6MDBaJyxcbiAgICB1cGRhdGVkQXQ6ICcyMDI0LTAxLTE1VDEwOjMwOjAwWicsXG4gICAgY3JlYXRlZEJ5OiAnYWRtaW4nLFxuICAgIHVwZGF0ZWRCeTogJ2FkbWluJ1xuICB9LFxuICBcbiAgLy8gXHU2RTIwXHU5MDUzXHU3RUE3XHU1MjJCXHU5MTREXHU3RjZFXG4gIHtcbiAgICBpZDogJ1NTQy1DSEFOTkVMLTAwMScsXG4gICAgbGV2ZWw6IFNhZmV0eVN0b2NrTGV2ZWwuQ0hBTk5FTCxcbiAgICBzdGF0dXM6IFNhZmV0eVN0b2NrU3RhdHVzLkFDVElWRSxcbiAgICBjaGFubmVsSWQ6ICdDSDAwMScsXG4gICAgY2hhbm5lbE5hbWU6ICdBbWF6b24gVVMnLFxuICAgIGNoYW5uZWxUeXBlOiAnbWFya2V0cGxhY2UnLFxuICAgIG1pblN0b2NrUXVhbnRpdHk6IDIwMCxcbiAgICBtaW5TdG9ja1R5cGU6ICdxdWFudGl0eScsXG4gICAgYWxlcnRUeXBlOiBbQWxlcnRUeXBlLkxPV19TVE9DS10sXG4gICAgYWxlcnRUaHJlc2hvbGQ6IDE1LFxuICAgIG1heFN0b2NrUXVhbnRpdHk6IDIwMDAsXG4gICAgbWF4U3RvY2tUeXBlOiAncXVhbnRpdHknLFxuICAgIGRpc2FibGVXbXNTeW5jOiBmYWxzZSxcbiAgICBkaXNhYmxlVGhpcmRQYXJ0eVN5bmM6IHRydWUsXG4gICAgcHJpb3JpdHk6IDEsXG4gICAgZGVzY3JpcHRpb246ICdBbWF6b24gVVMgY2hhbm5lbCBzcGVjaWZpYyBjb25maWd1cmF0aW9uJyxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTAyVDA5OjAwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNC0wMS0yMFQxNDoyMDowMFonLFxuICAgIGNyZWF0ZWRCeTogJ2NoYW5uZWxfbWFuYWdlcicsXG4gICAgdXBkYXRlZEJ5OiAnY2hhbm5lbF9tYW5hZ2VyJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdTU0MtQ0hBTk5FTC0wMDInLFxuICAgIGxldmVsOiBTYWZldHlTdG9ja0xldmVsLkNIQU5ORUwsXG4gICAgc3RhdHVzOiBTYWZldHlTdG9ja1N0YXR1cy5BQ1RJVkUsXG4gICAgY2hhbm5lbElkOiAnQ0gwMDInLFxuICAgIGNoYW5uZWxOYW1lOiAnZUJheSBVUycsXG4gICAgY2hhbm5lbFR5cGU6ICdtYXJrZXRwbGFjZScsXG4gICAgbWluU3RvY2tRdWFudGl0eTogMTUsXG4gICAgbWluU3RvY2tUeXBlOiAncGVyY2VudGFnZScsXG4gICAgYWxlcnRUeXBlOiBbQWxlcnRUeXBlLkxPV19TVE9DSywgQWxlcnRUeXBlLk9VVF9PRl9TVE9DS10sXG4gICAgYWxlcnRUaHJlc2hvbGQ6IDI1LFxuICAgIG1heFN0b2NrUXVhbnRpdHk6IDgwLFxuICAgIG1heFN0b2NrVHlwZTogJ3BlcmNlbnRhZ2UnLFxuICAgIGRpc2FibGVXbXNTeW5jOiB0cnVlLFxuICAgIGRpc2FibGVUaGlyZFBhcnR5U3luYzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDIsXG4gICAgZGVzY3JpcHRpb246ICdlQmF5IFVTIGNoYW5uZWwgY29uZmlndXJhdGlvbiB3aXRoIHBlcmNlbnRhZ2UtYmFzZWQgc3RvY2sgbGV2ZWxzJyxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTAzVDExOjMwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNC0wMS0xOFQxNjo0NTowMFonLFxuICAgIGNyZWF0ZWRCeTogJ2NoYW5uZWxfbWFuYWdlcicsXG4gICAgdXBkYXRlZEJ5OiAnaW52ZW50b3J5X21hbmFnZXInXG4gIH0sXG5cbiAgLy8gXHU1RTk3XHU5NEZBXHU3RUE3XHU1MjJCXHU5MTREXHU3RjZFXG4gIHtcbiAgICBpZDogJ1NTQy1TVE9SRS0wMDEnLFxuICAgIGxldmVsOiBTYWZldHlTdG9ja0xldmVsLlNUT1JFLFxuICAgIHN0YXR1czogU2FmZXR5U3RvY2tTdGF0dXMuQUNUSVZFLFxuICAgIHN0b3JlSWQ6ICdTVDAwMScsXG4gICAgc3RvcmVOYW1lOiAnTWFpbiBBbWF6b24gU3RvcmUnLFxuICAgIGNoYW5uZWxJZDogJ0NIMDAxJyxcbiAgICBjaGFubmVsTmFtZTogJ0FtYXpvbiBVUycsXG4gICAgd2FyZWhvdXNlSWQ6ICdXSDAwMScsXG4gICAgd2FyZWhvdXNlTmFtZTogJ0xvcyBBbmdlbGVzIFdhcmVob3VzZScsXG4gICAgbWluU3RvY2tRdWFudGl0eTogMjUwLFxuICAgIGFsZXJ0VHlwZTogW0FsZXJ0VHlwZS5MT1dfU1RPQ0tdLFxuICAgIGFsZXJ0VGhyZXNob2xkOiAxMCxcbiAgICBtYXhTdG9ja1F1YW50aXR5OiAyNTAwLFxuICAgIGRpc2FibGVXbXNTeW5jOiBmYWxzZSxcbiAgICBkaXNhYmxlVGhpcmRQYXJ0eVN5bmM6IGZhbHNlLFxuICAgIHByaW9yaXR5OiAxLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU0RTNCXHU4OTgxQW1hem9uXHU1RTk3XHU5NEZBXHU5MTREXHU3RjZFJyxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTA0VDEzOjE1OjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNC0wMS0yMlQwOTozMDowMFonLFxuICAgIGNyZWF0ZWRCeTogJ3N0b3JlX21hbmFnZXInLFxuICAgIHVwZGF0ZWRCeTogJ3N0b3JlX21hbmFnZXInXG4gIH0sXG4gIHtcbiAgICBpZDogJ1NTQy1TVE9SRS0wMDInLFxuICAgIGxldmVsOiBTYWZldHlTdG9ja0xldmVsLlNUT1JFLFxuICAgIHN0YXR1czogU2FmZXR5U3RvY2tTdGF0dXMuSU5BQ1RJVkUsXG4gICAgc3RvcmVJZDogJ1NUMDAzJyxcbiAgICBzdG9yZU5hbWU6ICdlQmF5IE9mZmljaWFsIFN0b3JlJyxcbiAgICBjaGFubmVsSWQ6ICdDSDAwMicsXG4gICAgY2hhbm5lbE5hbWU6ICdlQmF5IFVTJyxcbiAgICB3YXJlaG91c2VJZDogJ1dIMDAyJyxcbiAgICB3YXJlaG91c2VOYW1lOiAnTmV3IFlvcmsgV2FyZWhvdXNlJyxcbiAgICBtaW5TdG9ja1F1YW50aXR5OiAxMDAsXG4gICAgYWxlcnRUeXBlOiBbQWxlcnRUeXBlLk9VVF9PRl9TVE9DS10sXG4gICAgYWxlcnRUaHJlc2hvbGQ6IDMwLFxuICAgIG1heFN0b2NrUXVhbnRpdHk6IDEyMDAsXG4gICAgZGlzYWJsZVdtc1N5bmM6IHRydWUsXG4gICAgZGlzYWJsZVRoaXJkUGFydHlTeW5jOiB0cnVlLFxuICAgIHByaW9yaXR5OiAzLFxuICAgIGRlc2NyaXB0aW9uOiAnZUJheVx1NUI5OFx1NjVCOVx1NUU5N1x1OTRGQVx1OTE0RFx1N0Y2RVx1RkYwOFx1NURGMlx1NTA1Q1x1NzUyOFx1RkYwOScsXG4gICAgY3JlYXRlZEF0OiAnMjAyNC0wMS0wNVQxNTo0NTowMFonLFxuICAgIHVwZGF0ZWRBdDogJzIwMjQtMDEtMTlUMTI6MTU6MDBaJyxcbiAgICBjcmVhdGVkQnk6ICdzdG9yZV9tYW5hZ2VyJyxcbiAgICB1cGRhdGVkQnk6ICdpbnZlbnRvcnlfbWFuYWdlcidcbiAgfSxcblxuICAvLyBTS1VcdTdFQTdcdTUyMkJcdTkxNERcdTdGNkVcbiAge1xuICAgIGlkOiAnU1NDLVNLVS0wMDEnLFxuICAgIGxldmVsOiBTYWZldHlTdG9ja0xldmVsLlNLVSxcbiAgICBzdGF0dXM6IFNhZmV0eVN0b2NrU3RhdHVzLkFDVElWRSxcbiAgICBza3U6ICdTS1UtMDAxLUJMSy1NJyxcbiAgICBwcm9kdWN0SWQ6ICdQUk9EMDAxJyxcbiAgICBwcm9kdWN0TmFtZTogJ0NsYXNzaWMgVC1TaGlydCBCbGFjayBNZWRpdW0nLFxuICAgIHN0b3JlSWQ6ICdTVDAwMScsXG4gICAgc3RvcmVOYW1lOiAnTWFpbiBBbWF6b24gU3RvcmUnLFxuICAgIGNoYW5uZWxJZDogJ0NIMDAxJyxcbiAgICBjaGFubmVsTmFtZTogJ0FtYXpvbiBVUycsXG4gICAgd2FyZWhvdXNlSWQ6ICdXSDAwMScsXG4gICAgd2FyZWhvdXNlTmFtZTogJ0xvcyBBbmdlbGVzIFdhcmVob3VzZScsXG4gICAgY2F0ZWdvcnk6ICdBcHBhcmVsJyxcbiAgICBicmFuZDogJ0Jhc2ljV2VhcicsXG4gICAgbWluU3RvY2tRdWFudGl0eTogNTAwLFxuICAgIGFsZXJ0VHlwZTogW0FsZXJ0VHlwZS5MT1dfU1RPQ0tdLFxuICAgIGFsZXJ0VGhyZXNob2xkOiA1LFxuICAgIG1heFN0b2NrUXVhbnRpdHk6IDMwMDAsXG4gICAgZGlzYWJsZVdtc1N5bmM6IGZhbHNlLFxuICAgIGRpc2FibGVUaGlyZFBhcnR5U3luYzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDEsXG4gICAgZGVzY3JpcHRpb246ICdcdTcwRURcdTk1MDBUXHU2MDY0XHU3Mjc5XHU2QjhBXHU5MTREXHU3RjZFJyxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTA2VDEwOjIwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNC0wMS0yNVQwODo0NTowMFonLFxuICAgIGNyZWF0ZWRCeTogJ3Byb2R1Y3RfbWFuYWdlcicsXG4gICAgdXBkYXRlZEJ5OiAnaW52ZW50b3J5X3NwZWNpYWxpc3QnXG4gIH0sXG4gIHtcbiAgICBpZDogJ1NTQy1TS1UtMDAyJyxcbiAgICBsZXZlbDogU2FmZXR5U3RvY2tMZXZlbC5TS1UsXG4gICAgc3RhdHVzOiBTYWZldHlTdG9ja1N0YXR1cy5BQ1RJVkUsXG4gICAgc2t1OiAnU0tVLTAwMi1SRUQtUycsXG4gICAgcHJvZHVjdElkOiAnUFJPRDAwMicsXG4gICAgcHJvZHVjdE5hbWU6ICdQcmVtaXVtIEhvb2RpZSBSZWQgU21hbGwnLFxuICAgIHN0b3JlSWQ6ICdTVDAwMicsXG4gICAgc3RvcmVOYW1lOiAnQnJhbmQgU3RvcmUgQW1hem9uJyxcbiAgICBjaGFubmVsSWQ6ICdDSDAwMScsXG4gICAgY2hhbm5lbE5hbWU6ICdBbWF6b24gVVMnLFxuICAgIHdhcmVob3VzZUlkOiAnV0gwMDEnLFxuICAgIHdhcmVob3VzZU5hbWU6ICdMb3MgQW5nZWxlcyBXYXJlaG91c2UnLFxuICAgIGNhdGVnb3J5OiAnQXBwYXJlbCcsXG4gICAgYnJhbmQ6ICdQcmVtaXVtTGluZScsXG4gICAgbWluU3RvY2tRdWFudGl0eTogNTAsXG4gICAgYWxlcnRUeXBlOiBbQWxlcnRUeXBlLkxPV19TVE9DSywgQWxlcnRUeXBlLk9VVF9PRl9TVE9DS10sXG4gICAgYWxlcnRUaHJlc2hvbGQ6IDIwLFxuICAgIG1heFN0b2NrUXVhbnRpdHk6IDUwMCxcbiAgICBkaXNhYmxlV21zU3luYzogdHJ1ZSxcbiAgICBkaXNhYmxlVGhpcmRQYXJ0eVN5bmM6IGZhbHNlLFxuICAgIHByaW9yaXR5OiAyLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU5QUQ4XHU3QUVGXHU1MzZCXHU4ODYzXHU5NjUwXHU5MUNGXHU2QjNFXHU5MTREXHU3RjZFJyxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTA3VDE0OjMwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNC0wMS0yM1QxMToyMDowMFonLFxuICAgIGNyZWF0ZWRCeTogJ3Byb2R1Y3RfbWFuYWdlcicsXG4gICAgdXBkYXRlZEJ5OiAncHJvZHVjdF9tYW5hZ2VyJ1xuICB9XG5dXG5cbi8vIFx1NkEyMVx1NjJERlx1NzA3NVx1NkQzQlx1NUI4OVx1NTE2OFx1NUU5M1x1NUI1OFx1OTE0RFx1N0Y2RVx1NjU3MFx1NjM2RVxuZXhwb3J0IGNvbnN0IG1vY2tGbGV4aWJsZVNhZmV0eVN0b2NrQ29uZmlnczogRmxleGlibGVTYWZldHlTdG9ja0NvbmZpZ1tdID0gW1xuICB7XG4gICAgaWQ6ICdGU0MtMDAxJyxcbiAgICBuYW1lOiAnQW1hem9uXHU1RTczXHU1M0YwXHU3MEVEXHU5NTAwXHU1NTQ2XHU1NEMxXHU5MTREXHU3RjZFJyxcbiAgICBzdGF0dXM6IFNhZmV0eVN0b2NrU3RhdHVzLkFDVElWRSxcbiAgICBjaGFubmVsU2NvcGU6IENoYW5uZWxTY29wZVR5cGUuU1BFQ0lGSUMsXG4gICAgY2hhbm5lbElkczogWydDSDAwMSddLFxuICAgIGNoYW5uZWxOYW1lczogWydBbWF6b24gVVMnXSxcbiAgICBzdG9yZVNjb3BlOiBTdG9yZVNjb3BlVHlwZS5BTEwsXG4gICAgc3BlY2lhbFNrdXM6IFsnU0tVLTAwMS1CTEstTScsICdTS1UtMDAxLVdIVC1MJ10sXG4gICAgc3BlY2lhbFNrdUNvbmZpZ3M6IHtcbiAgICAgICdTS1UtMDAxLUJMSy1NJzoge1xuICAgICAgICBtaW5TdG9ja1F1YW50aXR5OiA4MDAsXG4gICAgICAgIG1heFN0b2NrUXVhbnRpdHk6IDMwMDAsXG4gICAgICAgIGFsZXJ0VHlwZTogW0FsZXJ0VHlwZS5MT1dfU1RPQ0tdLFxuICAgICAgICBhbGVydFRocmVzaG9sZDogNSxcbiAgICAgICAgZGlzYWJsZVdtc1N5bmM6IGZhbHNlLFxuICAgICAgICBkaXNhYmxlVGhpcmRQYXJ0eVN5bmM6IGZhbHNlXG4gICAgICB9LFxuICAgICAgJ1NLVS0wMDEtV0hULUwnOiB7XG4gICAgICAgIG1pblN0b2NrUXVhbnRpdHk6IDYwMCxcbiAgICAgICAgbWF4U3RvY2tRdWFudGl0eTogMjUwMCxcbiAgICAgICAgYWxlcnRUeXBlOiBbQWxlcnRUeXBlLkxPV19TVE9DSywgQWxlcnRUeXBlLk9VVF9PRl9TVE9DS10sXG4gICAgICAgIGFsZXJ0VGhyZXNob2xkOiAxMCxcbiAgICAgICAgZGlzYWJsZVdtc1N5bmM6IGZhbHNlLFxuICAgICAgICBkaXNhYmxlVGhpcmRQYXJ0eVN5bmM6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICAgIG1pblN0b2NrUXVhbnRpdHk6IDIwMCxcbiAgICBtYXhTdG9ja1F1YW50aXR5OiAxNTAwLFxuICAgIGFsZXJ0VHlwZTogW0FsZXJ0VHlwZS5MT1dfU1RPQ0tdLFxuICAgIGFsZXJ0VGhyZXNob2xkOiAxNSxcbiAgICBkaXNhYmxlV21zU3luYzogZmFsc2UsXG4gICAgZGlzYWJsZVRoaXJkUGFydHlTeW5jOiBmYWxzZSxcbiAgICBwcmlvcml0eTogMSxcbiAgICBkZXNjcmlwdGlvbjogJ0FtYXpvblx1NUU3M1x1NTNGMFx1NzBFRFx1OTUwMFx1NTU0Nlx1NTRDMVx1NEUxM1x1NzUyOFx1NUI4OVx1NTE2OFx1NUU5M1x1NUI1OFx1OTE0RFx1N0Y2RVx1RkYwQ1x1NTMwNVx1NTQyQlx1NzI3OVx1NkI4QVNLVVx1OEJCRVx1N0Y2RScsXG4gICAgY3JlYXRlZEF0OiAnMjAyNC0wMS0xMFQwODowMDowMFonLFxuICAgIHVwZGF0ZWRBdDogJzIwMjQtMDEtMjVUMTQ6MzA6MDBaJyxcbiAgICBjcmVhdGVkQnk6ICdhZG1pbicsXG4gICAgdXBkYXRlZEJ5OiAnaW52ZW50b3J5X21hbmFnZXInXG4gIH0sXG4gIHtcbiAgICBpZDogJ0ZTQy0wMDInLFxuICAgIG5hbWU6ICdcdThERThcdTVFNzNcdTUzRjBcdTkwMUFcdTc1MjhcdTkxNERcdTdGNkUnLFxuICAgIHN0YXR1czogU2FmZXR5U3RvY2tTdGF0dXMuQUNUSVZFLFxuICAgIGNoYW5uZWxTY29wZTogQ2hhbm5lbFNjb3BlVHlwZS5BTEwsXG4gICAgc3RvcmVTY29wZTogU3RvcmVTY29wZVR5cGUuQUxMLFxuICAgIHNwZWNpYWxTa3VzOiBbJ1NLVS0wMDMtQkxVLVhMJ10sXG4gICAgc3BlY2lhbFNrdUNvbmZpZ3M6IHtcbiAgICAgICdTS1UtMDAzLUJMVS1YTCc6IHtcbiAgICAgICAgbWluU3RvY2tRdWFudGl0eTogNTAsXG4gICAgICAgIG1heFN0b2NrUXVhbnRpdHk6IDMwMCxcbiAgICAgICAgYWxlcnRUeXBlOiBbQWxlcnRUeXBlLk9VVF9PRl9TVE9DS10sXG4gICAgICAgIGFsZXJ0VGhyZXNob2xkOiAzMCxcbiAgICAgICAgZGlzYWJsZVdtc1N5bmM6IHRydWUsXG4gICAgICAgIGRpc2FibGVUaGlyZFBhcnR5U3luYzogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgbWluU3RvY2tRdWFudGl0eTogMTUwLFxuICAgIG1heFN0b2NrUXVhbnRpdHk6IDgwMCxcbiAgICBhbGVydFR5cGU6IFtBbGVydFR5cGUuTE9XX1NUT0NLLCBBbGVydFR5cGUuT1VUX09GX1NUT0NLXSxcbiAgICBhbGVydFRocmVzaG9sZDogMjAsXG4gICAgZGlzYWJsZVdtc1N5bmM6IGZhbHNlLFxuICAgIGRpc2FibGVUaGlyZFBhcnR5U3luYzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDIsXG4gICAgZGVzY3JpcHRpb246ICdcdTkwMDJcdTc1MjhcdTRFOEVcdTYyNDBcdTY3MDlcdTZFMjBcdTkwNTNcdTc2ODRcdTkwMUFcdTc1MjhcdTVCODlcdTUxNjhcdTVFOTNcdTVCNThcdTkxNERcdTdGNkUnLFxuICAgIGNyZWF0ZWRBdDogJzIwMjQtMDEtMTVUMTA6MDA6MDBaJyxcbiAgICB1cGRhdGVkQXQ6ICcyMDI0LTAxLTIwVDE2OjAwOjAwWicsXG4gICAgY3JlYXRlZEJ5OiAnYWRtaW4nLFxuICAgIHVwZGF0ZWRCeTogJ2FkbWluJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdGU0MtMDAzJyxcbiAgICBuYW1lOiAnZUJheVx1NjMwN1x1NUI5QVx1NUU5N1x1OTRGQVx1OTE0RFx1N0Y2RScsXG4gICAgc3RhdHVzOiBTYWZldHlTdG9ja1N0YXR1cy5BQ1RJVkUsXG4gICAgY2hhbm5lbFNjb3BlOiBDaGFubmVsU2NvcGVUeXBlLlNQRUNJRklDLFxuICAgIGNoYW5uZWxJZHM6IFsnQ0gwMDInXSxcbiAgICBjaGFubmVsTmFtZXM6IFsnZUJheSBVUyddLFxuICAgIHN0b3JlU2NvcGU6IFN0b3JlU2NvcGVUeXBlLlNQRUNJRklDLFxuICAgIHN0b3JlSWRzOiBbJ1NUMDAzJ10sXG4gICAgc3RvcmVOYW1lczogWydlQmF5IE9mZmljaWFsIFN0b3JlJ10sXG4gICAgc3BlY2lhbFNrdXM6IFtdLFxuICAgIHNwZWNpYWxTa3VDb25maWdzOiB7fSxcbiAgICBtaW5TdG9ja1F1YW50aXR5OiA4MCxcbiAgICBtYXhTdG9ja1F1YW50aXR5OiA1MDAsXG4gICAgYWxlcnRUeXBlOiBbQWxlcnRUeXBlLkxPV19TVE9DS10sXG4gICAgYWxlcnRUaHJlc2hvbGQ6IDI1LFxuICAgIGRpc2FibGVXbXNTeW5jOiB0cnVlLFxuICAgIGRpc2FibGVUaGlyZFBhcnR5U3luYzogZmFsc2UsXG4gICAgcHJpb3JpdHk6IDMsXG4gICAgZGVzY3JpcHRpb246ICdlQmF5XHU1Qjk4XHU2NUI5XHU1RTk3XHU5NEZBXHU0RTEzXHU3NTI4XHU5MTREXHU3RjZFXHVGRjBDXHU3OTgxXHU3NTI4V01TXHU2M0E4XHU5MDAxJyxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTE4VDA5OjMwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNC0wMS0yMlQxMTo0NTowMFonLFxuICAgIGNyZWF0ZWRCeTogJ3N0b3JlX21hbmFnZXInLFxuICAgIHVwZGF0ZWRCeTogJ3N0b3JlX21hbmFnZXInXG4gIH1cbl1cblxuLy8gXHU2QTIxXHU2MkRGXHU1RTkzXHU1QjU4XHU5ODg0XHU4QjY2XHU2NTcwXHU2MzZFXG5leHBvcnQgY29uc3QgbW9ja1N0b2NrQWxlcnRzOiBTdG9ja0FsZXJ0W10gPSBbXG4gIHtcbiAgICBpZDogJ0FMRVJULTAwMScsXG4gICAgY29uZmlnSWQ6ICdTU0MtU0tVLTAwMScsXG4gICAgbGV2ZWw6IFNhZmV0eVN0b2NrTGV2ZWwuU0tVLFxuICAgIGFsZXJ0VHlwZTogQWxlcnRUeXBlLkxPV19TVE9DSyxcbiAgICBza3U6ICdTS1UtMDAxLUJMSy1NJyxcbiAgICBwcm9kdWN0TmFtZTogJ0NsYXNzaWMgVC1TaGlydCBCbGFjayBNZWRpdW0nLFxuICAgIGN1cnJlbnRTdG9jazogNDgwLFxuICAgIHNhZmV0eVN0b2NrOiA1MDAsXG4gICAgZGVmaWNpdDogMjAsIC8vIFx1NUY1M1x1NTI0RFx1NUU5M1x1NUI1ODQ4MFx1NEY0RVx1NEU4RVx1NUI4OVx1NTE2OFx1NUU5M1x1NUI1ODUwMFx1RkYwQ1x1NURFRVx1NTAzQzIwXG4gICAgc3RvcmVJZDogJ1NUMDAxJyxcbiAgICBzdG9yZU5hbWU6ICdNYWluIEFtYXpvbiBTdG9yZScsXG4gICAgY2hhbm5lbElkOiAnQ0gwMDEnLFxuICAgIGNoYW5uZWxOYW1lOiAnQW1hem9uIFVTJyxcbiAgICB3YXJlaG91c2VJZDogJ1dIMDAxJyxcbiAgICB3YXJlaG91c2VOYW1lOiAnTG9zIEFuZ2VsZXMgV2FyZWhvdXNlJyxcbiAgICBhbGVydFRpbWU6ICcyMDI0LTAxLTI1VDE1OjMwOjAwWicsXG4gICAgc3RhdHVzOiAnbmV3J1xuICB9LFxuICB7XG4gICAgaWQ6ICdBTEVSVC0wMDInLFxuICAgIGNvbmZpZ0lkOiAnU1NDLVNUT1JFLTAwMScsXG4gICAgbGV2ZWw6IFNhZmV0eVN0b2NrTGV2ZWwuU1RPUkUsXG4gICAgYWxlcnRUeXBlOiBBbGVydFR5cGUuT1VUX09GX1NUT0NLLFxuICAgIHNrdTogJ1NLVS0wMDMtQkxVLVhMJyxcbiAgICBwcm9kdWN0TmFtZTogJ1Nwb3J0cyBKYWNrZXQgQmx1ZSBFeHRyYSBMYXJnZScsXG4gICAgY3VycmVudFN0b2NrOiAwLFxuICAgIHNhZmV0eVN0b2NrOiAyNTAsXG4gICAgZGVmaWNpdDogMjUwLCAvLyBcdTdGM0FcdThEMjdcdUZGMENcdThERERcdTc5QkJcdTVCODlcdTUxNjhcdTVFOTNcdTVCNThcdThGRDhcdTVERUUyNTBcbiAgICBzdG9yZUlkOiAnU1QwMDEnLFxuICAgIHN0b3JlTmFtZTogJ01haW4gQW1hem9uIFN0b3JlJyxcbiAgICBjaGFubmVsSWQ6ICdDSDAwMScsXG4gICAgY2hhbm5lbE5hbWU6ICdBbWF6b24gVVMnLFxuICAgIHdhcmVob3VzZUlkOiAnV0gwMDEnLFxuICAgIHdhcmVob3VzZU5hbWU6ICdMb3MgQW5nZWxlcyBXYXJlaG91c2UnLFxuICAgIGFsZXJ0VGltZTogJzIwMjQtMDEtMjRUMDk6MTU6MDBaJyxcbiAgICBzdGF0dXM6ICdhY2tub3dsZWRnZWQnLFxuICAgIHJlc29sdmVkVGltZTogJzIwMjQtMDEtMjRUMTA6MzA6MDBaJyxcbiAgICByZXNvbHZlZEJ5OiAnaW52ZW50b3J5X21hbmFnZXInLFxuICAgIG5vdGVzOiAnXHU1REYyXHU4MDU0XHU3Q0ZCXHU0RjlCXHU1RTk0XHU1NTQ2XHU3RDI3XHU2MDI1XHU4ODY1XHU4RDI3J1xuICB9LFxuICB7XG4gICAgaWQ6ICdBTEVSVC0wMDMnLFxuICAgIGNvbmZpZ0lkOiAnU1NDLUNIQU5ORUwtMDAxJyxcbiAgICBsZXZlbDogU2FmZXR5U3RvY2tMZXZlbC5DSEFOTkVMLFxuICAgIGFsZXJ0VHlwZTogQWxlcnRUeXBlLkxPV19TVE9DSyxcbiAgICBza3U6ICdTS1UtMDA0LUdSTi1NJyxcbiAgICBwcm9kdWN0TmFtZTogJ0Nhc3VhbCBQYW50cyBHcmVlbiBNZWRpdW0nLFxuICAgIGN1cnJlbnRTdG9jazogMTgwLFxuICAgIHNhZmV0eVN0b2NrOiAyMDAsXG4gICAgZGVmaWNpdDogMjAsIC8vIFx1NUY1M1x1NTI0RFx1NUU5M1x1NUI1ODE4MFx1NEY0RVx1NEU4RVx1NUI4OVx1NTE2OFx1NUU5M1x1NUI1ODIwMFx1RkYwQ1x1NURFRVx1NTAzQzIwXG4gICAgc3RvcmVJZDogJ1NUMDAyJyxcbiAgICBzdG9yZU5hbWU6ICdCcmFuZCBTdG9yZSBBbWF6b24nLFxuICAgIGNoYW5uZWxJZDogJ0NIMDAxJyxcbiAgICBjaGFubmVsTmFtZTogJ0FtYXpvbiBVUycsXG4gICAgd2FyZWhvdXNlSWQ6ICdXSDAwMicsXG4gICAgd2FyZWhvdXNlTmFtZTogJ05ldyBZb3JrIFdhcmVob3VzZScsXG4gICAgYWxlcnRUaW1lOiAnMjAyNC0wMS0yM1QxMjo0NTowMFonLFxuICAgIHN0YXR1czogJ3Jlc29sdmVkJyxcbiAgICByZXNvbHZlZFRpbWU6ICcyMDI0LTAxLTI0VDE2OjIwOjAwWicsXG4gICAgcmVzb2x2ZWRCeTogJ2NoYW5uZWxfbWFuYWdlcicsXG4gICAgbm90ZXM6ICdcdTg4NjVcdThEMjdcdTVERjJcdTUyMzBcdTRGNERcdUZGMENcdTVFOTNcdTVCNThcdTYwNjJcdTU5MERcdTZCNjNcdTVFMzgnXG4gIH1cbl1cblxuLy8gXHU2QTIxXHU2MkRGXHU3RURGXHU4QkExXHU2NTcwXHU2MzZFXG5leHBvcnQgY29uc3QgbW9ja1NhZmV0eVN0b2NrU3RhdHM6IFNhZmV0eVN0b2NrU3RhdHMgPSB7XG4gIHRvdGFsQ29uZmlnczogOCxcbiAgYWN0aXZlQ29uZmlnczogNixcbiAgaW5hY3RpdmVDb25maWdzOiAyLFxuICBjb25maWdzQnlMZXZlbDoge1xuICAgIFtTYWZldHlTdG9ja0xldmVsLkdMT0JBTF06IDEsXG4gICAgW1NhZmV0eVN0b2NrTGV2ZWwuQ0hBTk5FTF06IDIsXG4gICAgW1NhZmV0eVN0b2NrTGV2ZWwuU1RPUkVdOiAyLFxuICAgIFtTYWZldHlTdG9ja0xldmVsLlNLVV06IDNcbiAgfSxcbiAgYWxlcnRzQ291bnQ6IHtcbiAgICB0b3RhbDogMTUsXG4gICAgbmV3OiAzLFxuICAgIGFja25vd2xlZGdlZDogNSxcbiAgICByZXNvbHZlZDogN1xuICB9LFxuICBsb3dTdG9ja0l0ZW1zOiA4LFxuICBvdXRPZlN0b2NrSXRlbXM6IDJcbn1cblxuLy8gXHU2QTIxXHU2MkRGXHU5ODg0XHU4QkJFXHU5MTREXHU3RjZFXHU2NTcwXHU2MzZFXG5leHBvcnQgY29uc3QgbW9ja1ByZXNldHMgPSBbXG4gIHtcbiAgICBpZDogJ1BSRVNFVC0wMDEnLFxuICAgIG5hbWU6ICdcdTVGRUJcdTk1MDBcdTU0QzFcdTkxNERcdTdGNkUnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU5MDAyXHU3NTI4XHU0RThFXHU1RkVCXHU5MDFGXHU5NTAwXHU1NTJFXHU3Njg0XHU3MEVEXHU5NUU4XHU0RUE3XHU1NEMxJyxcbiAgICBjb25maWc6IHtcbiAgICAgIG1pblN0b2NrUXVhbnRpdHk6IDUwMCxcbiAgICAgIGFsZXJ0VHlwZTogW0FsZXJ0VHlwZS5MT1dfU1RPQ0tdLFxuICAgICAgYWxlcnRUaHJlc2hvbGQ6IDEwLFxuICAgICAgbWF4U3RvY2tRdWFudGl0eTogMjAwMCxcbiAgICAgIGRpc2FibGVXbXNTeW5jOiBmYWxzZSxcbiAgICAgIGRpc2FibGVUaGlyZFBhcnR5U3luYzogZmFsc2VcbiAgICB9LFxuICAgIGlzRGVmYXVsdDogZmFsc2UsXG4gICAgY3JlYXRlZEF0OiAnMjAyNC0wMS0xMFQwODowMDowMFonXG4gIH0sXG4gIHtcbiAgICBpZDogJ1BSRVNFVC0wMDInLFxuICAgIG5hbWU6ICdcdTVCNjNcdTgyODJcdTYwMjdcdTU1NDZcdTU0QzFcdTkxNERcdTdGNkUnLFxuICAgIGRlc2NyaXB0aW9uOiAnXHU5MDAyXHU3NTI4XHU0RThFXHU1QjYzXHU4MjgyXHU2MDI3XHU2MjE2XHU4MjgyXHU2NUU1XHU2MDI3XHU1NTQ2XHU1NEMxJyxcbiAgICBjb25maWc6IHtcbiAgICAgIG1pblN0b2NrUXVhbnRpdHk6IDEwMCxcbiAgICAgIGFsZXJ0VHlwZTogW0FsZXJ0VHlwZS5MT1dfU1RPQ0ssIEFsZXJ0VHlwZS5PVVRfT0ZfU1RPQ0tdLFxuICAgICAgYWxlcnRUaHJlc2hvbGQ6IDI1LFxuICAgICAgbWF4U3RvY2tRdWFudGl0eTogODAwLFxuICAgICAgZGlzYWJsZVdtc1N5bmM6IGZhbHNlLFxuICAgICAgZGlzYWJsZVRoaXJkUGFydHlTeW5jOiB0cnVlXG4gICAgfSxcbiAgICBpc0RlZmF1bHQ6IGZhbHNlLFxuICAgIGNyZWF0ZWRBdDogJzIwMjQtMDEtMTJUMTA6MzA6MDBaJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdQUkVTRVQtMDAzJyxcbiAgICBuYW1lOiAnXHU5QUQ4XHU0RUY3XHU1MDNDXHU0RUE3XHU1NEMxXHU5MTREXHU3RjZFJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OTAwMlx1NzUyOFx1NEU4RVx1OUFEOFx1NEVGN1x1NTAzQ1x1MzAwMVx1NEY0RVx1NTQ2OFx1OEY2Q1x1NzY4NFx1NEVBN1x1NTRDMScsXG4gICAgY29uZmlnOiB7XG4gICAgICBtaW5TdG9ja1F1YW50aXR5OiAyMCxcbiAgICAgIGFsZXJ0VHlwZTogW0FsZXJ0VHlwZS5MT1dfU1RPQ0tdLFxuICAgICAgYWxlcnRUaHJlc2hvbGQ6IDMwLFxuICAgICAgbWF4U3RvY2tRdWFudGl0eTogMjAwLFxuICAgICAgZGlzYWJsZVdtc1N5bmM6IHRydWUsXG4gICAgICBkaXNhYmxlVGhpcmRQYXJ0eVN5bmM6IHRydWVcbiAgICB9LFxuICAgIGlzRGVmYXVsdDogdHJ1ZSxcbiAgICBjcmVhdGVkQXQ6ICcyMDI0LTAxLTA4VDE0OjE1OjAwWidcbiAgfVxuXVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUyxPQUFPLFdBQVc7QUFDbFQsU0FBUyxpQkFBaUI7OztBQ0VuQixJQUFNLFlBQXdCO0FBQUEsRUFDbkMsRUFBRSxJQUFJLE9BQU8sTUFBTSw0QkFBUSxNQUFNLE1BQU07QUFBQSxFQUN2QyxFQUFFLElBQUksT0FBTyxNQUFNLDRCQUFRLE1BQU0sTUFBTTtBQUFBLEVBQ3ZDLEVBQUUsSUFBSSxPQUFPLE1BQU0sd0NBQVUsTUFBTSxNQUFNO0FBQUEsRUFDekMsRUFBRSxJQUFJLE9BQU8sTUFBTSxrQ0FBUyxNQUFNLE1BQU07QUFBQSxFQUN4QyxFQUFFLElBQUksT0FBTyxNQUFNLGtDQUFTLE1BQU0sTUFBTTtBQUMxQztBQUdPLElBQU0sYUFBd0M7QUFBQSxFQUNuRCxLQUFLO0FBQUEsSUFD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
