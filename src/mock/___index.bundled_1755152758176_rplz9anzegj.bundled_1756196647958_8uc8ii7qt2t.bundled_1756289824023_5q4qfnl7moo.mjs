// src/mock/__index.bundled_1755152758176_rplz9anzegj.bundled_1756196647958_8uc8ii7qt2t.mjs
import axios from "axios";
import { ElMessage } from "element-plus";
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
var mockTrackingList = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    supplier: "Supplier A",
    createdAt: "2024-01-15T08:00:00Z",
    expectedDeliveryDate: "2024-02-15T08:00:00Z",
    currentStatus: "IN_PRODUCTION",
    stages: []
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    supplier: "Supplier B",
    createdAt: "2024-01-20T08:00:00Z",
    expectedDeliveryDate: "2024-02-20T08:00:00Z",
    currentStatus: "PO_CONFIRMED",
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
var mockProducts = [
  {
    id: "1",
    sku: "SKU001",
    name: "\u6D4B\u8BD5\u5546\u54C11",
    type: "Normal",
    status: "Active",
    vendor: "\u4F9B\u5E94\u5546A",
    brand: "\u54C1\u724CA",
    manufacturer: "\u5236\u9020\u5546A",
    cost: 100,
    regularPrice: 199.99,
    salePrice: 159.99,
    quantity: 100,
    doNotTrackInventory: false,
    categories: ["\u7535\u5B50\u4EA7\u54C1", "\u624B\u673A\u914D\u4EF6"],
    tags: ["\u70ED\u9500", "\u65B0\u54C1"],
    integration: "Shopify",
    weight: 0.5,
    weightUnit: "kg",
    dimensions: {
      length: 10,
      width: 5,
      height: 2,
      unit: "cm"
    },
    description: "\u8FD9\u662F\u4E00\u4E2A\u6D4B\u8BD5\u5546\u54C1\u7684\u8BE6\u7EC6\u63CF\u8FF0",
    shortDescription: "\u6D4B\u8BD5\u5546\u54C1\u7B80\u4ECB",
    images: [
      {
        url: "https://example.com/image1.jpg",
        alt: "\u5546\u54C1\u4E3B\u56FE",
        isDefault: true
      }
    ],
    created: "2024-03-20T10:00:00Z",
    updated: "2024-03-20T15:30:00Z"
  },
  {
    id: "2",
    sku: "SKU002",
    name: "\u6D4B\u8BD5\u5546\u54C12",
    type: "Sample",
    status: "Draft",
    vendor: "\u4F9B\u5E94\u5546B",
    brand: "\u54C1\u724CB",
    manufacturer: "\u5236\u9020\u5546B",
    cost: 50,
    regularPrice: 99.99,
    salePrice: 79.99,
    quantity: 50,
    doNotTrackInventory: true,
    categories: ["\u670D\u88C5", "\u914D\u9970"],
    tags: ["\u6837\u54C1", "\u9650\u91CF"],
    integration: "Amazon",
    weight: 0.3,
    weightUnit: "kg",
    dimensions: {
      length: 20,
      width: 15,
      height: 5,
      unit: "cm"
    },
    description: "\u8FD9\u662F\u4E00\u4E2A\u6837\u54C1\u5546\u54C1\u7684\u8BE6\u7EC6\u63CF\u8FF0",
    shortDescription: "\u6837\u54C1\u5546\u54C1\u7B80\u4ECB",
    images: [
      {
        url: "https://example.com/image2.jpg",
        alt: "\u6837\u54C1\u4E3B\u56FE",
        isDefault: true
      }
    ],
    created: "2024-03-19T08:00:00Z",
    updated: "2024-03-19T16:45:00Z"
  },
  {
    id: "3",
    sku: "SKU003",
    name: "\u6D4B\u8BD5\u5546\u54C13",
    type: "Bundle",
    status: "Active",
    vendor: "\u4F9B\u5E94\u5546C",
    brand: "\u54C1\u724CC",
    manufacturer: "\u5236\u9020\u5546C",
    cost: 200,
    regularPrice: 399.99,
    salePrice: 299.99,
    quantity: 30,
    doNotTrackInventory: false,
    categories: ["\u5957\u88C5", "\u793C\u54C1"],
    tags: ["\u4FC3\u9500", "\u5957\u88C5"],
    integration: "eBay",
    weight: 1.2,
    weightUnit: "kg",
    dimensions: {
      length: 30,
      width: 20,
      height: 15,
      unit: "cm"
    },
    description: "\u8FD9\u662F\u4E00\u4E2A\u5957\u88C5\u5546\u54C1\u7684\u8BE6\u7EC6\u63CF\u8FF0",
    shortDescription: "\u5957\u88C5\u5546\u54C1\u7B80\u4ECB",
    images: [
      {
        url: "https://example.com/image3.jpg",
        alt: "\u5957\u88C5\u4E3B\u56FE",
        isDefault: true
      }
    ],
    created: "2024-03-18T09:30:00Z",
    updated: "2024-03-18T14:20:00Z"
  },
  {
    id: "4",
    sku: "SKU004",
    name: "\u6D4B\u8BD5\u5546\u54C14",
    type: "Virtual",
    status: "Out_Of_Stock",
    vendor: "\u4F9B\u5E94\u5546D",
    brand: "\u54C1\u724CD",
    manufacturer: "\u5236\u9020\u5546D",
    cost: 10,
    regularPrice: 29.99,
    salePrice: 19.99,
    quantity: 0,
    doNotTrackInventory: true,
    categories: ["\u6570\u5B57\u4EA7\u54C1", "\u8F6F\u4EF6"],
    tags: ["\u865A\u62DF", "\u4E0B\u8F7D"],
    integration: "Shopify",
    weight: 0,
    weightUnit: "kg",
    description: "\u8FD9\u662F\u4E00\u4E2A\u865A\u62DF\u5546\u54C1\u7684\u8BE6\u7EC6\u63CF\u8FF0",
    shortDescription: "\u865A\u62DF\u5546\u54C1\u7B80\u4ECB",
    images: [
      {
        url: "https://example.com/image4.jpg",
        alt: "\u865A\u62DF\u5546\u54C1\u4E3B\u56FE",
        isDefault: true
      }
    ],
    created: "2024-03-17T11:20:00Z",
    updated: "2024-03-17T18:15:00Z"
  }
];
var getMockProducts = (params) => {
  let filteredProducts = [...mockProducts];
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) => product.name.toLowerCase().includes(searchLower) || product.sku.toLowerCase().includes(searchLower) || product.vendor?.toLowerCase().includes(searchLower)
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
  }
];
var mock_default = mockHandlers;
export {
  mock_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svc3JjL21vY2svc3JjL21vY2svaW5kZXgudHMiLCAic3JjL21vY2svc3JjL21vY2svc3JjL21vY2svcXVlcnlUb29sRGF0YS50cyIsICJzcmMvbW9jay9zcmMvbW9jay9zcmMvdmlld3MvcHVyY2hhc2UvdHJhY2tpbmcvdHlwZXMudHMiLCAic3JjL21vY2svc3JjL21vY2svc3JjL21vY2svcHVyY2hhc2VUcmFja2luZy50cyIsICJzcmMvbW9jay9zcmMvbW9jay9zcmMvbW9jay9wcm9kdWN0RGF0YS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFxtb2NrXFxcXGluZGV4LnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXEpheW5lXFxcXERlc2t0b3BcXFxcVU5JU1xcXFxPTVNcdTk4NzlcdTc2RUVcXFxcc3JjXFxcXG1vY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL0pheW5lL0Rlc2t0b3AvVU5JUy9PTVMlRTklQTElQjklRTclOUIlQUUvc3JjL21vY2svaW5kZXgudHNcIjtpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5pbXBvcnQgeyBFbE1lc3NhZ2UgfSBmcm9tICdlbGVtZW50LXBsdXMnXG5pbXBvcnQgeyBcbiAgY3VzdG9tZXJzLCBcbiAgY2hhbm5lbE1hcCwgXG4gIHF1ZXJ5T3JkZXJzLCBcbiAgcXVlcnlQcm9kdWN0cywgXG4gIHF1ZXJ5SW52ZW50b3J5LCBcbiAgcXVlcnlTeXN0ZW1PcmRlcnMgXG59IGZyb20gJy4vcXVlcnlUb29sRGF0YSdcbmltcG9ydCB7IE1vY2tNZXRob2QgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xuaW1wb3J0IHsgbW9ja1RyYWNraW5nTGlzdCwgbW9ja1RyYWNraW5nRGV0YWlsIH0gZnJvbSAnLi9wdXJjaGFzZVRyYWNraW5nJ1xuaW1wb3J0IHsgZ2V0TW9ja1Byb2R1Y3RzLCBtb2NrRGVsZXRlUHJvZHVjdCB9IGZyb20gJy4vcHJvZHVjdERhdGEnXG5cbi8vIE1vY2tcdTkwMDJcdTkxNERcdTU2NjhcdTdDN0JcdTU3OEJcbmludGVyZmFjZSBNb2NrQ29uZmlnIHtcbiAgdXJsPzogc3RyaW5nO1xuICBkYXRhPzogc3RyaW5nO1xuICBwYXJhbXM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICBoZWFkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLy8gXHU3NTMxXHU0RThFYXhpb3MtbW9jay1hZGFwdGVyXHU1M0VGXHU4MEZEXHU0RTBEXHU1QjU4XHU1NzI4XHVGRjBDXHU2MjExXHU0RUVDXHU1MjFCXHU1RUZBXHU0RTAwXHU0RTJBXHU3QjgwXHU1MzU1XHU3Njg0TW9ja1x1NUI5RVx1NzNCMFxuY2xhc3MgU2ltcGxlTW9ja0FkYXB0ZXIge1xuICBwcml2YXRlIGhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCAoY29uZmlnOiBNb2NrQ29uZmlnKSA9PiBbbnVtYmVyLCBhbnldPiA9IHt9O1xuICBwcml2YXRlIGdldEhhbmRsZXJzOiBSZWNvcmQ8c3RyaW5nLCAoY29uZmlnOiBNb2NrQ29uZmlnKSA9PiBbbnVtYmVyLCBhbnldPiA9IHt9O1xuICBwcml2YXRlIHBvc3RIYW5kbGVyczogUmVjb3JkPHN0cmluZywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4gW251bWJlciwgYW55XT4gPSB7fTtcbiAgcHJpdmF0ZSBkZWxldGVIYW5kbGVyczogUmVjb3JkPHN0cmluZywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4gW251bWJlciwgYW55XT4gPSB7fTtcbiAgcHJpdmF0ZSByZWdleEhhbmRsZXJzOiBBcnJheTx7bWV0aG9kOiBzdHJpbmcsIHJlZ2V4OiBSZWdFeHAsIGhhbmRsZXI6IChjb25maWc6IE1vY2tDb25maWcpID0+IFtudW1iZXIsIGFueV19PiA9IFtdO1xuICBwcml2YXRlIGRlbGF5OiBudW1iZXI7XG5cbiAgcHJpdmF0ZSBoYW5kbGVSZXF1ZXN0KGhhbmRsZXI6IChjb25maWc6IE1vY2tDb25maWcpID0+IFtudW1iZXIsIGFueV0sIGNvbmZpZzogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBbc3RhdHVzLCByZXNwb25zZV0gPSBoYW5kbGVyKGNvbmZpZyk7XG4gICAgICAgIGlmIChzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgZGF0YTogcmVzcG9uc2UsXG4gICAgICAgICAgICBzdGF0dXMsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiAnT0snLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBjb25maWdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgcmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgZGF0YTogcmVzcG9uc2UsXG4gICAgICAgICAgICAgIHN0YXR1cyxcbiAgICAgICAgICAgICAgc3RhdHVzVGV4dDogJ0VSUk9SJyxcbiAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICAgIGNvbmZpZ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzLmRlbGF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGF4aW9zSW5zdGFuY2U6IGFueSwgb3B0aW9ucz86IHtkZWxheVJlc3BvbnNlPzogbnVtYmVyfSkge1xuICAgIHRoaXMuZGVsYXkgPSBvcHRpb25zPy5kZWxheVJlc3BvbnNlIHx8IDA7XG4gICAgYXhpb3NJbnN0YW5jZS5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoKGNvbmZpZzogYW55KSA9PiB7XG4gICAgICBjb25zdCBtZXRob2QgPSBjb25maWcubWV0aG9kPy50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGhhbmRsZXI7XG5cbiAgICAgIC8vIFx1NjgzOVx1NjM2RVx1OEJGN1x1NkM0Mlx1NjVCOVx1NkNENVx1ODNCN1x1NTNENlx1NUJGOVx1NUU5NFx1NzY4NFx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgICBoYW5kbGVyID0gdGhpcy5nZXRIYW5kbGVyc1tjb25maWcudXJsXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgICAgaGFuZGxlciA9IHRoaXMucG9zdEhhbmRsZXJzW2NvbmZpZy51cmxdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgIGhhbmRsZXIgPSB0aGlzLmRlbGV0ZUhhbmRsZXJzW2NvbmZpZy51cmxdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTYyN0VcdTUyMzBcdTRFODZcdTc2RjRcdTYzQTVcdTUzMzlcdTkxNERcdTc2ODRcdTU5MDRcdTc0MDZcdTU2NjhcbiAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVJlcXVlc3QoaGFuZGxlciwgY29uZmlnKTtcbiAgICAgIH1cblxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2QjYzXHU1MjE5XHU4ODY4XHU4RkJFXHU1RjBGXHU1OTA0XHU3NDA2XHU1NjY4XG4gICAgICBmb3IgKGNvbnN0IHttZXRob2Q6IGhhbmRsZXJNZXRob2QsIHJlZ2V4LCBoYW5kbGVyOiByZWdleEhhbmRsZXJ9IG9mIHRoaXMucmVnZXhIYW5kbGVycykge1xuICAgICAgICBpZiAoaGFuZGxlck1ldGhvZCA9PT0gbWV0aG9kICYmIHJlZ2V4LnRlc3QoY29uZmlnLnVybCkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVSZXF1ZXN0KHJlZ2V4SGFuZGxlciwgY29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH0sIHVuZGVmaW5lZCk7XG4gIH1cbiAgXG4gIG9uR2V0KHVybE9yUmVnZXg6IHN0cmluZyB8IFJlZ0V4cCwgaGFuZGxlcjogKGNvbmZpZzogTW9ja0NvbmZpZykgPT4gW251bWJlciwgYW55XSk6IFNpbXBsZU1vY2tBZGFwdGVyIHtcbiAgICBpZiAodHlwZW9mIHVybE9yUmVnZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmdldEhhbmRsZXJzW3VybE9yUmVnZXhdID0gaGFuZGxlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWdleEhhbmRsZXJzLnB1c2goe21ldGhvZDogJ2dldCcsIHJlZ2V4OiB1cmxPclJlZ2V4LCBoYW5kbGVyfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIFxuICBvblBvc3QodXJsT3JSZWdleDogc3RyaW5nIHwgUmVnRXhwLCBoYW5kbGVyOiAoY29uZmlnOiBNb2NrQ29uZmlnKSA9PiBbbnVtYmVyLCBhbnldKTogU2ltcGxlTW9ja0FkYXB0ZXIge1xuICAgIGlmICh0eXBlb2YgdXJsT3JSZWdleCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMucG9zdEhhbmRsZXJzW3VybE9yUmVnZXhdID0gaGFuZGxlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWdleEhhbmRsZXJzLnB1c2goe21ldGhvZDogJ3Bvc3QnLCByZWdleDogdXJsT3JSZWdleCwgaGFuZGxlcn0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9uRGVsZXRlKHVybE9yUmVnZXg6IHN0cmluZyB8IFJlZ0V4cCwgaGFuZGxlcjogKGNvbmZpZzogTW9ja0NvbmZpZykgPT4gW251bWJlciwgYW55XSk6IFNpbXBsZU1vY2tBZGFwdGVyIHtcbiAgICBpZiAodHlwZW9mIHVybE9yUmVnZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmRlbGV0ZUhhbmRsZXJzW3VybE9yUmVnZXhdID0gaGFuZGxlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWdleEhhbmRsZXJzLnB1c2goe21ldGhvZDogJ2RlbGV0ZScsIHJlZ2V4OiB1cmxPclJlZ2V4LCBoYW5kbGVyfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8vIFx1NTIxQlx1NUVGQVx1NEUwMFx1NEUyQU1vY2tBZGFwdGVyXHU1QjlFXHU0RjhCXG5jb25zdCBtb2NrID0gbmV3IFNpbXBsZU1vY2tBZGFwdGVyKGF4aW9zLCB7IGRlbGF5UmVzcG9uc2U6IDUwMCB9KSAvLyBcdTZBMjFcdTYyREZcdTdGNTFcdTdFRENcdTVFRjZcdThGREZcblxuLy8gXHU2QTIxXHU2MkRGXHU4M0I3XHU1M0Q2XHU1QkEyXHU2MjM3XHU1MjE3XHU4ODY4XG5tb2NrLm9uR2V0KCcvYXBpL2N1c3RvbWVycycsICgpID0+IFsyMDAsIHtcbiAgY29kZTogMCxcbiAgZGF0YTogY3VzdG9tZXJzLFxuICBtZXNzYWdlOiAnc3VjY2Vzcydcbn1dKTtcblxuLy8gXHU2QTIxXHU2MkRGXHU4M0I3XHU1M0Q2XHU2RTIwXHU5MDUzXHU1MjE3XHU4ODY4XG5tb2NrLm9uR2V0KCcvYXBpL2NoYW5uZWxzJywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICBjb25zdCBjdXN0b21lcklkID0gY29uZmlnLnBhcmFtcz8uY3VzdG9tZXJJZCBhcyBzdHJpbmc7XG4gIGlmICghY3VzdG9tZXJJZCB8fCAhY2hhbm5lbE1hcFtjdXN0b21lcklkIGFzIGtleW9mIHR5cGVvZiBjaGFubmVsTWFwXSkge1xuICAgIHJldHVybiBbNDAwLCB7IGNvZGU6IDEsIG1lc3NhZ2U6ICdcdTVCQTJcdTYyMzdJRFx1NjVFMFx1NjU0OFx1NjIxNlx1NEUwRFx1NUI1OFx1NTcyOCcsIGRhdGE6IG51bGwgfV07XG4gIH1cbiAgXG4gIHJldHVybiBbMjAwLCB7XG4gICAgY29kZTogMCxcbiAgICBkYXRhOiBjaGFubmVsTWFwW2N1c3RvbWVySWQgYXMga2V5b2YgdHlwZW9mIGNoYW5uZWxNYXBdLFxuICAgIG1lc3NhZ2U6ICdzdWNjZXNzJ1xuICB9XTtcbn0pO1xuXG4vLyBcdTZBMjFcdTYyREZcdTY3RTVcdThCRTJcdTYzQTVcdTUzRTNcbm1vY2sub25Qb3N0KCcvYXBpL3F1ZXJ5JywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHBhcmFtcyA9IEpTT04ucGFyc2UoY29uZmlnLmRhdGEgfHwgJ3t9Jyk7XG4gICAgaWYgKCFwYXJhbXMuY3VzdG9tZXIgfHwgIXBhcmFtcy5jaGFubmVsIHx8ICFwYXJhbXMudHlwZSB8fCAhcGFyYW1zLnBhZ2UgfHwgIXBhcmFtcy5wYWdlU2l6ZSkge1xuICAgICAgcmV0dXJuIFs0MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1NTNDMlx1NjU3MFx1NEUwRFx1NUI4Q1x1NjU3NCcsIGRhdGE6IG51bGwgfV07XG4gICAgfVxuICAgIFxuICAgIGxldCByZXN1bHQ7XG4gICAgXG4gICAgc3dpdGNoKHBhcmFtcy50eXBlKSB7XG4gICAgICBjYXNlICdvcmRlcic6XG4gICAgICAgIHJlc3VsdCA9IHF1ZXJ5T3JkZXJzKHBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgIGNhc2UgJ3Byb2R1Y3QnOlxuICAgICAgICByZXN1bHQgPSBxdWVyeVByb2R1Y3RzKHBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgIGNhc2UgJ2ludmVudG9yeSc6XG4gICAgICAgIHJlc3VsdCA9IHF1ZXJ5SW52ZW50b3J5KHBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBbNDAwLCB7IGNvZGU6IDEsIG1lc3NhZ2U6ICdcdTY3RTVcdThCRTJcdTdDN0JcdTU3OEJcdTY1RTBcdTY1NDgnLCBkYXRhOiBudWxsIH1dO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gWzIwMCwge1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJ1xuICAgIH1dO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ01vY2sgQVBJIEVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gWzUwMCwgeyBjb2RlOiAxLCBtZXNzYWdlOiAnXHU2NzBEXHU1MkExXHU1NjY4XHU1MTg1XHU5MEU4XHU5NTE5XHU4QkVGJywgZGF0YTogbnVsbCB9XTtcbiAgfVxufSk7XG5cbi8vIFx1NkEyMVx1NjJERlx1ODNCN1x1NTNENlx1N0NGQlx1N0VERlx1OEJBMlx1NTM1NVx1NEZFMVx1NjA2RlxubW9jay5vbkdldCgvXFwvYXBpXFwvb3JkZXJzXFwvXFx3Ky8sIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICAgIGNvbnN0IGNoYW5uZWxPcmRlcklkID0gdXJsLnNwbGl0KCcvJykucG9wKCkgfHwgJyc7XG4gICAgaWYgKCFjaGFubmVsT3JkZXJJZCkge1xuICAgICAgcmV0dXJuIFs0MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1OEJBMlx1NTM1NUlEXHU0RTBEXHU4MEZEXHU0RTNBXHU3QTdBJywgZGF0YTogbnVsbCB9XTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgcmVzdWx0ID0gcXVlcnlTeXN0ZW1PcmRlcnMoY2hhbm5lbE9yZGVySWQpO1xuICAgIFxuICAgIHJldHVybiBbMjAwLCB7XG4gICAgICBjb2RlOiAwLFxuICAgICAgZGF0YTogcmVzdWx0LFxuICAgICAgbWVzc2FnZTogJ3N1Y2Nlc3MnXG4gICAgfV07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignTW9jayBBUEkgRXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBbNTAwLCB7IGNvZGU6IDEsIG1lc3NhZ2U6ICdcdTY3MERcdTUyQTFcdTU2NjhcdTUxODVcdTkwRThcdTk1MTlcdThCRUYnLCBkYXRhOiBudWxsIH1dO1xuICB9XG59KTtcblxuLy8gXHU2QTIxXHU2MkRGXHU5MUNEXHU4QkQ1XHU1OTA0XHU3NDA2XHU4QkEyXHU1MzU1XG5tb2NrLm9uUG9zdCgvXFwvYXBpXFwvb3JkZXJzXFwvXFx3K1xcL3JldHJ5LywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICBjb25zdCB1cmwgPSBjb25maWcudXJsIHx8ICcnO1xuICBjb25zdCB1cmxQYXJ0cyA9IHVybC5zcGxpdCgnLycpO1xuICBjb25zdCBvcmRlcklkID0gdXJsUGFydHMubGVuZ3RoID49IDIgPyB1cmxQYXJ0c1t1cmxQYXJ0cy5sZW5ndGggLSAyXSA6ICcnO1xuICBcbiAgcmV0dXJuIFsyMDAsIHtcbiAgICBjb2RlOiAwLFxuICAgIGRhdGE6IHsgc3VjY2VzczogdHJ1ZSwgb3JkZXJJZCB9LFxuICAgIG1lc3NhZ2U6ICdzdWNjZXNzJ1xuICB9XTtcbn0pO1xuXG4vLyBcdTZBMjFcdTYyREZcdTVCRkNcdTUxRkFcdTUyOUZcdTgwRkRcbm1vY2sub25Qb3N0KCcvYXBpL2V4cG9ydCcsIChfY29uZmlnOiBNb2NrQ29uZmlnKSA9PiB7XG4gIHJldHVybiBbMjAwLCBuZXcgQmxvYihbJ1x1NkEyMVx1NjJERlx1NUJGQ1x1NTFGQVx1NjU3MFx1NjM2RSddLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnIH0pXTtcbn0pO1xuXG4vLyBcdTZERkJcdTUyQTBcdTY3RTVcdThCRTJcdTVERTVcdTUxNzdcdTc2RjhcdTUxNzNcdTc2ODRBUElcbm1vY2sub25HZXQoL1xcL2FwaVxcL3F1ZXJ5VG9vbFxcL2N1c3RvbWVycy8sIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgY29uc29sZS5sb2coJ01vY2sgQVBJOiBcdTgzQjdcdTUzRDZcdTVCQTJcdTYyMzdcdTUyMTdcdTg4NjhcdTg4QUJcdThDMDNcdTc1MjgnKTtcbiAgLy8gXHU3QjgwXHU1MzU1XHU4RkQ0XHU1NkRFXHU1QkEyXHU2MjM3XHU2NTcwXHU2MzZFXHVGRjBDXHU0RTBEXHU1MDVBXHU5ODlEXHU1OTE2XHU1MzA1XHU4OEM1XG4gIHJldHVybiBbMjAwLCBjdXN0b21lcnNdO1xufSk7XG5cbm1vY2sub25HZXQoL1xcL2FwaVxcL3F1ZXJ5VG9vbFxcL2NoYW5uZWxzXFwvKC4rKS8sIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgY29uc3QgdXJsUGFydHMgPSBjb25maWcudXJsPy5zcGxpdCgnLycpO1xuICBjb25zdCBjdXN0b21lcklkID0gdXJsUGFydHM/Llt1cmxQYXJ0cy5sZW5ndGggLSAxXTtcbiAgXG4gIGNvbnNvbGUubG9nKGBNb2NrIEFQSTogXHU4M0I3XHU1M0Q2XHU2RTIwXHU5MDUzXHU1MjE3XHU4ODY4XHU4OEFCXHU4QzAzXHU3NTI4LCBcdTVCQTJcdTYyMzdJRDogJHtjdXN0b21lcklkfWApO1xuICBcbiAgaWYgKGN1c3RvbWVySWQgJiYgY2hhbm5lbE1hcFtjdXN0b21lcklkXSkge1xuICAgIHJldHVybiBbMjAwLCBjaGFubmVsTWFwW2N1c3RvbWVySWRdXTtcbiAgfVxuICBcbiAgY29uc29sZS5sb2coJ1x1NjcyQVx1NjI3RVx1NTIzMFx1NUJGOVx1NUU5NFx1NUJBMlx1NjIzN1x1NzY4NFx1NkUyMFx1OTA1M1x1NjU3MFx1NjM2RScpO1xuICByZXR1cm4gWzIwMCwgW11dO1xufSk7XG5cbm1vY2sub25Qb3N0KC9cXC9hcGlcXC9xdWVyeVRvb2xcXC9xdWVyeS8sIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJhbXMgPSBKU09OLnBhcnNlKGNvbmZpZy5kYXRhIHx8ICd7fScpO1xuICAgIGNvbnNvbGUubG9nKGBNb2NrIEFQSTogXHU2N0U1XHU4QkUyXHU2NTcwXHU2MzZFXHU4OEFCXHU4QzAzXHU3NTI4LCBcdTdDN0JcdTU3OEI6ICR7cGFyYW1zLnR5cGV9YCwgcGFyYW1zKTtcbiAgICBcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgXG4gICAgc3dpdGNoIChwYXJhbXMudHlwZSkge1xuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgICByZXNwb25zZSA9IHF1ZXJ5T3JkZXJzKHBhcmFtcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBcdTY3RTVcdThCRTJcdTUyMzAgJHtyZXNwb25zZS5kYXRhLmxlbmd0aH0vJHtyZXNwb25zZS50b3RhbH0gXHU2NzYxXHU4QkEyXHU1MzU1XHU2NTcwXHU2MzZFYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHJvZHVjdCc6XG4gICAgICAgIHJlc3BvbnNlID0gcXVlcnlQcm9kdWN0cyhwYXJhbXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhgXHU2N0U1XHU4QkUyXHU1MjMwICR7cmVzcG9uc2UuZGF0YS5sZW5ndGh9LyR7cmVzcG9uc2UudG90YWx9IFx1Njc2MVx1NTU0Nlx1NTRDMVx1NjU3MFx1NjM2RWApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ludmVudG9yeSc6XG4gICAgICAgIHJlc3BvbnNlID0gcXVlcnlJbnZlbnRvcnkocGFyYW1zKTtcbiAgICAgICAgY29uc29sZS5sb2coYFx1NjdFNVx1OEJFMlx1NTIzMCAke3Jlc3BvbnNlLmRhdGEubGVuZ3RofS8ke3Jlc3BvbnNlLnRvdGFsfSBcdTY3NjFcdTVFOTNcdTVCNThcdTY1NzBcdTYzNkVgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygnXHU2NzJBXHU3N0U1XHU3Njg0XHU2N0U1XHU4QkUyXHU3QzdCXHU1NzhCJyk7XG4gICAgICAgIHJlc3BvbnNlID0geyBkYXRhOiBbXSwgdG90YWw6IDAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIFsyMDAsIHJlc3BvbnNlXTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb2NrIEFQSSBcdTk1MTlcdThCRUY6JywgZXJyb3IpO1xuICAgIHJldHVybiBbNTAwLCB7IG1lc3NhZ2U6ICdcdTY3MERcdTUyQTFcdTU2NjhcdTUxODVcdTkwRThcdTk1MTlcdThCRUYnIH1dO1xuICB9XG59KTtcblxubW9jay5vblBvc3QoL1xcL2FwaVxcL3F1ZXJ5VG9vbFxcL3JldHJ5LywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgb3JkZXJJZCB9ID0gSlNPTi5wYXJzZShjb25maWcuZGF0YSB8fCAne30nKTtcbiAgICBjb25zb2xlLmxvZyhgTW9jayBBUEk6IFx1OTFDRFx1OEJENVx1NTkwNFx1NzQwNlx1OEJBMlx1NTM1NSwgXHU4QkEyXHU1MzU1SUQ6ICR7b3JkZXJJZH1gKTtcbiAgICBcbiAgICAvLyBcdTZBMjFcdTYyREZcdTkxQ0RcdThCRDVcdTU5MDRcdTc0MDZcbiAgICByZXR1cm4gWzIwMCwgeyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiBgXHU4QkEyXHU1MzU1ICR7b3JkZXJJZH0gXHU1REYyXHU5MUNEXHU2NUIwXHU2M0QwXHU0RUE0XHU1OTA0XHU3NDA2YCB9XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb2NrIEFQSSBFcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIFs1MDAsIHsgbWVzc2FnZTogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicgfV07XG4gIH1cbn0pO1xuXG5tb2NrLm9uUG9zdCgvXFwvYXBpXFwvcXVlcnlUb29sXFwvZXhwb3J0LywgKGNvbmZpZzogTW9ja0NvbmZpZykgPT4ge1xuICBjb25zb2xlLmxvZygnTW9jayBBUEk6IFx1NUJGQ1x1NTFGQVx1NjU3MFx1NjM2RScpO1xuICAvLyBcdTZBMjFcdTYyREZcdTVCRkNcdTUxRkFcbiAgcmV0dXJuIFsyMDAsIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ1x1NUJGQ1x1NTFGQVx1NjIxMFx1NTI5RicgfV07XG59KTtcblxuLy8gXHU1MTY4XHU1QzQwXHU1OTA0XHU3NDA2XHU4QkY3XHU2QzQyXHU1NDhDXHU1NENEXHU1RTk0XG5heGlvcy5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoXG4gIChjb25maWcpID0+IHtcbiAgICAvLyBcdTUzRUZcdTRFRTVcdTU3MjhcdThGRDlcdTkxQ0NcdTZERkJcdTUyQTB0b2tlblx1N0I0OVx1N0VERlx1NEUwMFx1NTkwNFx1NzQwNlxuICAgIHJldHVybiBjb25maWc7XG4gIH0sXG4gIChlcnJvcikgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gIH1cbik7XG5cbmF4aW9zLmludGVyY2VwdG9ycy5yZXNwb25zZS51c2UoXG4gIChyZXNwb25zZSkgPT4ge1xuICAgIC8vIFx1NTkwNFx1NzQwNlx1NjIxMFx1NTI5Rlx1NzY4NFx1NTRDRFx1NUU5NFxuICAgIGNvbnN0IHJlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgaWYgKHJlcyAmJiAocmVzLmNvZGUgPT09IHVuZGVmaW5lZCB8fCByZXMuY29kZSA9PT0gMCkpIHtcbiAgICAgIHJldHVybiByZXMuZGF0YSB8fCByZXM7XG4gICAgfVxuICAgIFxuICAgIEVsTWVzc2FnZS5lcnJvcihyZXMubWVzc2FnZSB8fCAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1Jyk7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihyZXMubWVzc2FnZSB8fCAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1JykpO1xuICB9LFxuICAoZXJyb3IpID0+IHtcbiAgICAvLyBcdTU5MDRcdTc0MDZcdTk1MTlcdThCRUZcdTU0Q0RcdTVFOTRcbiAgICBjb25zdCBtZXNzYWdlID0gZXJyb3IucmVzcG9uc2U/LmRhdGE/Lm1lc3NhZ2UgfHwgZXJyb3IubWVzc2FnZSB8fCAnXHU4QkY3XHU2QzQyXHU1OTMxXHU4RDI1JztcbiAgICBFbE1lc3NhZ2UuZXJyb3IobWVzc2FnZSk7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgfVxuKTtcblxuLy8gXHU2REZCXHU1MkEwXHU0RUE3XHU1NEMxXHU3NkY4XHU1MTczXHU3Njg0bW9ja1x1NjNBNVx1NTNFM1xubW9jay5vbkdldCgnL2FwaS9wcm9kdWN0cycsIChjb25maWc6IE1vY2tDb25maWcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBwYXJhbXMgPSBjb25maWcucGFyYW1zIHx8IHt9O1xuICAgIGNvbnN0IHJlc3BvbnNlID0gZ2V0TW9ja1Byb2R1Y3RzKHtcbiAgICAgIHBhZ2U6IE51bWJlcihwYXJhbXMucGFnZSkgfHwgMSxcbiAgICAgIHBhZ2VTaXplOiBOdW1iZXIocGFyYW1zLnBhZ2VTaXplKSB8fCAyMCxcbiAgICAgIHNlYXJjaDogcGFyYW1zLnNlYXJjaCxcbiAgICAgIHR5cGU6IHBhcmFtcy50eXBlLFxuICAgICAgaW50ZWdyYXRpb246IHBhcmFtcy5pbnRlZ3JhdGlvbixcbiAgICB9KTtcbiAgICByZXR1cm4gWzIwMCwge1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IHJlc3BvbnNlLmRhdGEsXG4gICAgICB0b3RhbDogcmVzcG9uc2UudG90YWwsXG4gICAgICBtZXNzYWdlOiAnc3VjY2VzcydcbiAgICB9XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb2NrIEFQSSBFcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIFs1MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicsIGRhdGE6IG51bGwgfV07XG4gIH1cbn0pO1xuXG5tb2NrLm9uRGVsZXRlKC9cXC9hcGlcXC9wcm9kdWN0c1xcL1xcdysvLCAoY29uZmlnOiBNb2NrQ29uZmlnKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdXJsID0gY29uZmlnLnVybCB8fCAnJztcbiAgICBjb25zdCBwcm9kdWN0SWQgPSB1cmwuc3BsaXQoJy8nKS5wb3AoKSB8fCAnJztcbiAgICBpZiAoIXByb2R1Y3RJZCkge1xuICAgICAgcmV0dXJuIFs0MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1NEVBN1x1NTRDMUlEXHU0RTBEXHU4MEZEXHU0RTNBXHU3QTdBJywgZGF0YTogbnVsbCB9XTtcbiAgICB9XG4gICAgXG4gICAgbW9ja0RlbGV0ZVByb2R1Y3QocHJvZHVjdElkKTtcbiAgICByZXR1cm4gWzIwMCwge1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IG51bGwsXG4gICAgICBtZXNzYWdlOiAnc3VjY2VzcydcbiAgICB9XTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb2NrIEFQSSBFcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIFs1MDAsIHsgY29kZTogMSwgbWVzc2FnZTogJ1x1NjcwRFx1NTJBMVx1NTY2OFx1NTE4NVx1OTBFOFx1OTUxOVx1OEJFRicsIGRhdGE6IG51bGwgfV07XG4gIH1cbn0pO1xuXG5jb25zdCBtb2NrSGFuZGxlcnMgPSBbXG4gIC8vIFB1cmNoYXNlIE9yZGVyIFRyYWNraW5nXG4gIHtcbiAgICB1cmw6ICcvYXBpL3B1cmNoYXNlL3RyYWNraW5nJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XG4gICAgICBjb25zdCB7IHBhZ2UgPSAxLCBwYWdlU2l6ZSA9IDEwIH0gPSBxdWVyeVxuICAgICAgY29uc3Qgc3RhcnQgPSAocGFnZSAtIDEpICogcGFnZVNpemVcbiAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgcGFnZVNpemVcbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdG90YWw6IG1vY2tUcmFja2luZ0xpc3QubGVuZ3RoLFxuICAgICAgICAgIGl0ZW1zOiBtb2NrVHJhY2tpbmdMaXN0LnNsaWNlKHN0YXJ0LCBlbmQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL3B1cmNoYXNlL3RyYWNraW5nLzppZCcsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKHsgcGFyYW1zIH0pID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBtb2NrVHJhY2tpbmdEZXRhaWwocGFyYW1zLmlkKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICBkYXRhXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogNDA0LFxuICAgICAgICAgIG1lc3NhZ2U6ICdOb3QgZm91bmQnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL3B1cmNoYXNlL3RyYWNraW5nLzppZC9zdGF0dXMnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHJlc3BvbnNlOiAoeyBwYXJhbXMgfSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiBtb2NrVHJhY2tpbmdEZXRhaWwocGFyYW1zLmlkKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXSBhcyBNb2NrTWV0aG9kW11cblxuZXhwb3J0IGRlZmF1bHQgbW9ja0hhbmRsZXJzICIsICJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXEpheW5lXFxcXERlc2t0b3BcXFxcVU5JU1xcXFxPTVNcdTk4NzlcdTc2RUVcXFxcc3JjXFxcXG1vY2tcXFxccXVlcnlUb29sRGF0YS50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFxtb2NrXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9KYXluZS9EZXNrdG9wL1VOSVMvT01TJUU5JUExJUI5JUU3JTlCJUFFL3NyYy9tb2NrL3F1ZXJ5VG9vbERhdGEudHNcIjtpbXBvcnQgeyBPcmRlckRhdGEsIFN5c3RlbU9yZGVyRGF0YSwgUHJvZHVjdERhdGEsIEludmVudG9yeURhdGEsIEN1c3RvbWVyLCBDaGFubmVsLCBRdWVyeVBhcmFtcywgUGFnaW5hdGVkUmVzcG9uc2UgfSBmcm9tICdAL3R5cGVzL3F1ZXJ5VG9vbFR5cGVzJ1xyXG5cclxuLy8gXHU1QkEyXHU2MjM3XHU2NTcwXHU2MzZFXHJcbmV4cG9ydCBjb25zdCBjdXN0b21lcnM6IEN1c3RvbWVyW10gPSBbXHJcbiAgeyBpZDogJ255ZicsIG5hbWU6ICdcdTdFQkRcdTdFQTZcdTY3MERcdTk5NzAnLCBjb2RlOiAnTllGJyB9LFxyXG4gIHsgaWQ6ICdjYXQnLCBuYW1lOiAnXHU1MkEwXHU1RERFXHU3OUQxXHU2MjgwJywgY29kZTogJ0NBVCcgfSxcclxuICB7IGlkOiAndHhlJywgbmFtZTogJ1x1NUZCN1x1NTE0Qlx1ODQyOFx1NjVBRlx1NzUzNVx1NUI1MCcsIGNvZGU6ICdUWEUnIH0sXHJcbiAgeyBpZDogJ2NoaScsIG5hbWU6ICdcdTgyOURcdTUyQTBcdTU0RTVcdTk4REZcdTU0QzEnLCBjb2RlOiAnQ0hJJyB9LFxyXG4gIHsgaWQ6ICdzZWEnLCBuYW1lOiAnXHU4OTdGXHU5NkM1XHU1NkZFXHU1NDk2XHU1NTYxJywgY29kZTogJ1NFQScgfVxyXG5dXHJcblxyXG4vLyBcdTZFMjBcdTkwNTNcdTY1NzBcdTYzNkVcclxuZXhwb3J0IGNvbnN0IGNoYW5uZWxNYXA6IFJlY29yZDxzdHJpbmcsIENoYW5uZWxbXT4gPSB7XHJcbiAgbnlmOiBbXHJcbiAgICB7IGlkOiAnYW1hem9uJywgbmFtZTogJ0FtYXpvbicsIGNvZGU6ICdBTVonLCB0eXBlOiAnbWFya2V0cGxhY2UnIH0sXHJcbiAgICB7IGlkOiAnc2hvcGlmeScsIG5hbWU6ICdTaG9waWZ5JywgY29kZTogJ1NIRicsIHR5cGU6ICdlY29tbWVyY2UnIH0sXHJcbiAgICB7IGlkOiAnd2FsbWFydCcsIG5hbWU6ICdXYWxtYXJ0JywgY29kZTogJ1dNVCcsIHR5cGU6ICdtYXJrZXRwbGFjZScgfVxyXG4gIF0sXHJcbiAgY2F0OiBbXHJcbiAgICB7IGlkOiAnYW1hem9uJywgbmFtZTogJ0FtYXpvbicsIGNvZGU6ICdBTVonLCB0eXBlOiAnbWFya2V0cGxhY2UnIH0sXHJcbiAgICB7IGlkOiAnZWJheScsIG5hbWU6ICdlQmF5JywgY29kZTogJ0VCWScsIHR5cGU6ICdtYXJrZXRwbGFjZScgfSxcclxuICAgIHsgaWQ6ICdzaG9waWZ5JywgbmFtZTogJ1Nob3BpZnknLCBjb2RlOiAnU0hGJywgdHlwZTogJ2Vjb21tZXJjZScgfVxyXG4gIF0sXHJcbiAgdHhlOiBbXHJcbiAgICB7IGlkOiAnYW1hem9uJywgbmFtZTogJ0FtYXpvbicsIGNvZGU6ICdBTVonLCB0eXBlOiAnbWFya2V0cGxhY2UnIH0sXHJcbiAgICB7IGlkOiAnZWJheScsIG5hbWU6ICdlQmF5JywgY29kZTogJ0VCWScsIHR5cGU6ICdtYXJrZXRwbGFjZScgfSxcclxuICAgIHsgaWQ6ICd3YWxtYXJ0JywgbmFtZTogJ1dhbG1hcnQnLCBjb2RlOiAnV01UJywgdHlwZTogJ21hcmtldHBsYWNlJyB9XHJcbiAgXSxcclxuICBjaGk6IFtcclxuICAgIHsgaWQ6ICdhbWF6b24nLCBuYW1lOiAnQW1hem9uJywgY29kZTogJ0FNWicsIHR5cGU6ICdtYXJrZXRwbGFjZScgfSxcclxuICAgIHsgaWQ6ICdzaG9waWZ5JywgbmFtZTogJ1Nob3BpZnknLCBjb2RlOiAnU0hGJywgdHlwZTogJ2Vjb21tZXJjZScgfVxyXG4gIF0sXHJcbiAgc2VhOiBbXHJcbiAgICB7IGlkOiAnYW1hem9uJywgbmFtZTogJ0FtYXpvbicsIGNvZGU6ICdBTVonLCB0eXBlOiAnbWFya2V0cGxhY2UnIH0sXHJcbiAgICB7IGlkOiAnc2hvcGlmeScsIG5hbWU6ICdTaG9waWZ5JywgY29kZTogJ1NIRicsIHR5cGU6ICdlY29tbWVyY2UnIH0sXHJcbiAgICB7IGlkOiAnZWJheScsIG5hbWU6ICdlQmF5JywgY29kZTogJ0VCWScsIHR5cGU6ICdtYXJrZXRwbGFjZScgfVxyXG4gIF1cclxufVxyXG5cclxuLy8gXHU4QkEyXHU1MzU1XHU1NTQ2XHU1NEMxXHU5ODc5XHJcbmV4cG9ydCBpbnRlcmZhY2UgT3JkZXJJdGVtIHtcclxuICBza3U6IHN0cmluZztcclxuICBwcm9kdWN0TmFtZTogc3RyaW5nO1xyXG4gIHF1YW50aXR5OiBudW1iZXI7XHJcbiAgcHJpY2U6IG51bWJlcjtcclxuICB0b3RhbDogbnVtYmVyO1xyXG4gIGZ1bGZpbGxtZW50U3RhdHVzPzogc3RyaW5nO1xyXG59XHJcblxyXG4vLyBcdThCQTJcdTUzNTVcdTY1NzBcdTYzNkVcclxuZXhwb3J0IGNvbnN0IG9yZGVyTGlzdDogT3JkZXJEYXRhW10gPSBbXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdBTVotMTIzNDU2Nzg5JyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy05ODc2NTQzMjEnLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdGF0dXM6ICdcdTVERjJcdTVCOENcdTYyMTAnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1RjIwXHU0RTA5JyxcclxuICAgIGFtb3VudDogMjk5Ljk5LFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA4NjQwMDAwMCwgLy8gXHU0RTAwXHU1OTI5XHU1MjREXHJcbiAgICBzeXN0ZW1DcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDg1MDAwMDAwLCBcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgc2t1OiAnU0tVMDAxJywgcHJvZHVjdE5hbWU6ICdcdTlBRDhcdTU0QzFcdThEMjhcdTY1RTBcdTdFQkZcdTg0RERcdTcyNTlcdTgwMzNcdTY3M0EnLCBxdWFudGl0eTogMiwgcHJpY2U6IDk5Ljk5LCB0b3RhbDogMTk5Ljk4LCBmdWxmaWxsbWVudFN0YXR1czogJ1x1NURGMlx1NTNEMVx1OEQyNycgfSxcclxuICAgICAgeyBza3U6ICdTS1UwMDInLCBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1NjI0Qlx1ODg2OCcsIHF1YW50aXR5OiAxLCBwcmljZTogMTAwLjAxLCB0b3RhbDogMTAwLjAxLCBmdWxmaWxsbWVudFN0YXR1czogJ1x1NURGMlx1NTNEMVx1OEQyNycgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdTaGlwcGVkJyxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBjaGFubmVsT3JkZXJJZDogJ1NIRi05ODc2NTQzMjEnLFxyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTEyMzQ1Njc4OScsXHJcbiAgICBjaGFubmVsOiAnc2hvcGlmeScsXHJcbiAgICBzdGF0dXM6ICdcdTU5MDRcdTc0MDZcdTRFMkQnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU2NzRFXHU1NkRCJyxcclxuICAgIGFtb3VudDogNDk5Ljk5LFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA0MzIwMDAwMCwgLy8gMTJcdTVDMEZcdTY1RjZcdTUyNERcclxuICAgIHN5c3RlbUNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNDIwMDAwMDAsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHNrdTogJ1NLVTAwMycsIHByb2R1Y3ROYW1lOiAnXHU4RDg1XHU4NTg0XHU3QjE0XHU4QkIwXHU2NzJDXHU3NTM1XHU4MTExJywgcXVhbnRpdHk6IDEsIHByaWNlOiA0OTkuOTksIHRvdGFsOiA0OTkuOTksIGZ1bGZpbGxtZW50U3RhdHVzOiAnXHU1Rjg1XHU1M0QxXHU4RDI3JyB9XHJcbiAgICBdLFxyXG4gICAgY2hhbm5lbFN0YXR1czogJ1Byb2Nlc3NpbmcnLFxyXG4gICAgc3RvcmU6ICdNYWluIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdXTVQtNDU2Nzg5MTIzJyxcclxuICAgIHN5c3RlbU9yZGVySWQ6IG51bGwsXHJcbiAgICBjaGFubmVsOiAnd2FsbWFydCcsXHJcbiAgICBzdGF0dXM6IG51bGwsXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTczOEJcdTRFOTQnLFxyXG4gICAgYW1vdW50OiAxNTkuOTksXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDIxNjAwMDAwLCAvLyA2XHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHNrdTogJ1NLVTAwNCcsIHByb2R1Y3ROYW1lOiAnXHU5NjMyXHU2QzM0XHU4RkQwXHU1MkE4XHU3NkY4XHU2NzNBJywgcXVhbnRpdHk6IDMsIHByaWNlOiA1My4zMywgdG90YWw6IDE1OS45OSwgZnVsZmlsbG1lbnRTdGF0dXM6ICdcdTVERjJcdTkwMDBcdTZCM0UnIH1cclxuICAgIF0sXHJcbiAgICBjaGFubmVsU3RhdHVzOiAnUGVuZGluZycsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdBTVotMjM0NTY3ODkxJyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy0zNDU2Nzg5MTInLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdGF0dXM6ICdcdTVGODVcdTU5MDRcdTc0MDYnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU4RDc1XHU1MTZEJyxcclxuICAgIGFtb3VudDogODkuOTUsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM2MDAwMDAsIC8vIDFcdTVDMEZcdTY1RjZcdTUyNERcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgc2t1OiAnU0tVMDA1JywgcHJvZHVjdE5hbWU6ICdcdTRGQkZcdTY0M0FcdTVGMEZcdTUxNDVcdTc1MzVcdTVCOUQnLCBxdWFudGl0eTogMSwgcHJpY2U6IDM5Ljk5LCB0b3RhbDogMzkuOTksIGZ1bGZpbGxtZW50U3RhdHVzOiAnXHU1Rjg1XHU1M0QxXHU4RDI3JyB9LFxyXG4gICAgICB7IHNrdTogJ1NLVTAwNicsIHByb2R1Y3ROYW1lOiAnXHU2NTcwXHU2MzZFXHU3RUJGXHU1OTU3XHU4OEM1JywgcXVhbnRpdHk6IDIsIHByaWNlOiAyNC45OCwgdG90YWw6IDQ5Ljk2LCBmdWxmaWxsbWVudFN0YXR1czogJ1x1NUY4NVx1NTNEMVx1OEQyNycgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdVbnNoaXBwZWQnLFxyXG4gICAgc3RvcmU6ICdFVSBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnRUJZLTM0NTY3ODkxMicsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tNTY3ODkxMjM0JyxcclxuICAgIGNoYW5uZWw6ICdlYmF5JyxcclxuICAgIHN0YXR1czogJ1x1NURGMlx1NUI4Q1x1NjIxMCcsXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTk0QjFcdTRFMDMnLFxyXG4gICAgYW1vdW50OiA1OS45OSxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTcyODAwMDAwLCAvLyAyXHU1OTI5XHU1MjREXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHNrdTogJ1NLVTAwNycsIHByb2R1Y3ROYW1lOiAnXHU2NjdBXHU4MEZEXHU1QkI2XHU1QzQ1XHU2M0E3XHU1MjM2XHU1NjY4JywgcXVhbnRpdHk6IDEsIHByaWNlOiA1OS45OSwgdG90YWw6IDU5Ljk5LCBmdWxmaWxsbWVudFN0YXR1czogJ1x1NURGMlx1NTNEMVx1OEQyNycgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdEZWxpdmVyZWQnLFxyXG4gICAgc3RvcmU6ICdNYWluIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdTSEYtNDU2Nzg5MTIzJyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy02Nzg5MTIzNDUnLFxyXG4gICAgY2hhbm5lbDogJ3Nob3BpZnknLFxyXG4gICAgc3RhdHVzOiAnXHU1RjAyXHU1RTM4JyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUI1OVx1NTE2QicsXHJcbiAgICBhbW91bnQ6IDEyOS45OCxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjU5MjAwMDAwLCAvLyAzXHU1OTI5XHU1MjREXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHNrdTogJ1NLVTAwOCcsIHByb2R1Y3ROYW1lOiAnXHU2NUUwXHU3RUJGXHU5NTJFXHU5RjIwXHU1OTU3XHU4OEM1JywgcXVhbnRpdHk6IDEsIHByaWNlOiA3OS45OSwgdG90YWw6IDc5Ljk5IH0sXHJcbiAgICAgIHsgc2t1OiAnU0tVMDA5JywgcHJvZHVjdE5hbWU6ICdcdTlGMjBcdTY4MDdcdTU3QUInLCBxdWFudGl0eTogMSwgcHJpY2U6IDQ5Ljk5LCB0b3RhbDogNDkuOTkgfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdQYXltZW50IEZhaWxlZCcsXHJcbiAgICBzdG9yZTogJ0NOIFN0b3JlJ1xyXG4gIH0sXHJcbiAgLy8gXHU2NUIwXHU1ODlFXHU4QkEyXHU1MzU1XHU2NTcwXHU2MzZFXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdBTVotNTY3ODkxMjM0JyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy03ODkxMjM0NTYnLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdGF0dXM6ICdcdTVERjJcdTVCOENcdTYyMTAnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1NDY4XHU0RTVEJyxcclxuICAgIGFtb3VudDogMTI5OS45OSxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMzQ1NjAwMDAwLCAvLyA0XHU1OTI5XHU1MjREXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHNrdTogJ1NLVTAxMCcsIHByb2R1Y3ROYW1lOiAnXHU2RTM4XHU2MjBGXHU3QjE0XHU4QkIwXHU2NzJDXHU3NTM1XHU4MTExJywgcXVhbnRpdHk6IDEsIHByaWNlOiAxMjk5Ljk5LCB0b3RhbDogMTI5OS45OSB9XHJcbiAgICBdLFxyXG4gICAgY2hhbm5lbFN0YXR1czogJ0RlbGl2ZXJlZCcsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdXTVQtNjc4OTEyMzQ1JyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy04OTEyMzQ1NjcnLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgc3RhdHVzOiAnXHU1REYyXHU1QjhDXHU2MjEwJyxcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NTQzNFx1NTM0MScsXHJcbiAgICBhbW91bnQ6IDI0OS45OSxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNDMyMDAwMDAwLCAvLyA1XHU1OTI5XHU1MjREXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHNrdTogJ1NLVTAxMScsIHByb2R1Y3ROYW1lOiAnXHU2NjdBXHU4MEZEXHU5N0YzXHU3QkIxJywgcXVhbnRpdHk6IDIsIHByaWNlOiAxMjQuOTksIHRvdGFsOiAyNDkuOTggfVxyXG4gICAgXSxcclxuICAgIGNoYW5uZWxTdGF0dXM6ICdTaGlwcGVkJyxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBjaGFubmVsT3JkZXJJZDogJ0VCWS03ODkxMjM0NTYnLFxyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTkxMjM0NTY3OCcsXHJcbiAgICBjaGFubmVsOiAnZWJheScsXHJcbiAgICBzdGF0dXM6ICdcdTU5MDRcdTc0MDZcdTRFMkQnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU5MEQxXHU1MzQxXHU0RTAwJyxcclxuICAgIGFtb3VudDogNzkuOTksXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDUxODQwMDAwMCwgLy8gNlx1NTkyOVx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMTInLCBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1NzA2Rlx1NkNFMVx1NTk1N1x1ODhDNScsIHF1YW50aXR5OiA0LCBwcmljZTogMTkuOTksIHRvdGFsOiA3OS45NiB9XHJcbiAgICBdLFxyXG4gICAgY2hhbm5lbFN0YXR1czogJ1Byb2Nlc3NpbmcnLFxyXG4gICAgc3RvcmU6ICdFVSBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIGNoYW5uZWxPcmRlcklkOiAnU0hGLTg5MTIzNDU2NycsXHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tMTIzNzg5NDU2JyxcclxuICAgIGNoYW5uZWw6ICdzaG9waWZ5JyxcclxuICAgIHN0YXR1czogJ1x1NUY4NVx1NTkwNFx1NzQwNicsXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTczOEJcdTRFOTQnLFxyXG4gICAgYW1vdW50OiAzOTkuOTgsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDYwNDgwMDAwMCwgLy8gN1x1NTkyOVx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMTMnLCBwcm9kdWN0TmFtZTogJ1x1NjVFMFx1N0VCRlx1ODAzM1x1NjczQScsIHF1YW50aXR5OiAyLCBwcmljZTogMTk5Ljk5LCB0b3RhbDogMzk5Ljk4IH1cclxuICAgIF0sXHJcbiAgICBjaGFubmVsU3RhdHVzOiAnQXdhaXRpbmcgRnVsZmlsbG1lbnQnLFxyXG4gICAgc3RvcmU6ICdNYWluIFN0b3JlJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgY2hhbm5lbE9yZGVySWQ6ICdBTVotOTEyMzQ1Njc4JyxcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy0yMzQ4OTE1NjcnLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdGF0dXM6ICdcdTVGMDJcdTVFMzgnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1RjIwXHU0RTA5JyxcclxuICAgIGFtb3VudDogNTkuOTcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDY5MTIwMDAwMCwgLy8gOFx1NTkyOVx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMTQnLCBwcm9kdWN0TmFtZTogJ1x1NjI0Qlx1NjczQVx1NEZERFx1NjJBNFx1NThGMycsIHF1YW50aXR5OiAzLCBwcmljZTogMTkuOTksIHRvdGFsOiA1OS45NyB9XHJcbiAgICBdLFxyXG4gICAgY2hhbm5lbFN0YXR1czogJ0Vycm9yJyxcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBjaGFubmVsT3JkZXJJZDogJ1dNVC0xMjM3ODk0NTYnLFxyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTM0NTkxMjY3OCcsXHJcbiAgICBjaGFubmVsOiAnd2FsbWFydCcsXHJcbiAgICBzdGF0dXM6ICdcdTVERjJcdTVCOENcdTYyMTAnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU2NzRFXHU1NkRCJyxcclxuICAgIGFtb3VudDogMjkuOTksXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDc3NzYwMDAwMCwgLy8gOVx1NTkyOVx1NTI0RFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBza3U6ICdTS1UwMTUnLCBwcm9kdWN0TmFtZTogJ1x1NjI0Qlx1NjczQVx1NjUyRlx1NjdCNicsIHF1YW50aXR5OiAxLCBwcmljZTogMjkuOTksIHRvdGFsOiAyOS45OSB9XHJcbiAgICBdLFxyXG4gICAgY2hhbm5lbFN0YXR1czogJ0RlbGl2ZXJlZCcsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJ1xyXG4gIH1cclxuXVxyXG5cclxuLy8gXHU3Q0ZCXHU3RURGXHU4QkEyXHU1MzU1XHU2NTcwXHU2MzZFXHJcbmV4cG9ydCBjb25zdCBzeXN0ZW1PcmRlckxpc3Q6IFN5c3RlbU9yZGVyRGF0YVtdID0gW1xyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy05ODc2NTQzMjEnLFxyXG4gICAgc3RhdHVzOiAnXHU1REYyXHU1QjhDXHU2MjEwJyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gODY0MDAwMDAsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDQzMjAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tMTIzNDU2Nzg5JyxcclxuICAgIHN0YXR1czogJ1x1NTkwNFx1NzQwNlx1NEUyRCcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDQzMjAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyMTYwMDAwMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTQ1Njc4OTEyMycsXHJcbiAgICBzdGF0dXM6ICdcdTVGMDJcdTVFMzgnLFxyXG4gICAgZXJyb3JSZWFzb246ICdcdTU3MzBcdTU3NDBcdTRGRTFcdTYwNkZcdTRFMERcdTVCOENcdTY1NzRcdUZGMENcdTdGM0FcdTVDMTFcdTg4NTdcdTkwNTNcdTUzRjdcdTc4MDFcdUZGMENcdTY1RTBcdTZDRDVcdTVCOENcdTYyMTBcdTkxNERcdTkwMDFcdTU3MzBcdTU3NDBcdTlBOENcdThCQzEnLFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyMTYwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMzYwMDAwMFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc3lzdGVtT3JkZXJJZDogJ1NPLTM0NTY3ODkxMicsXHJcbiAgICBzdGF0dXM6ICdcdTVGODVcdTU5MDRcdTc0MDYnLFxyXG4gICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAzNjAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxODAwMDAwXHJcbiAgfSxcclxuICB7XHJcbiAgICBzeXN0ZW1PcmRlcklkOiAnU08tNTY3ODkxMjM0JyxcclxuICAgIHN0YXR1czogJ1x1NURGMlx1NUI4Q1x1NjIxMCcsXHJcbiAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDE3MjgwMDAwMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gODY0MDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy02Nzg5MTIzNDUnLFxyXG4gICAgc3RhdHVzOiAnXHU1RjAyXHU1RTM4JyxcclxuICAgIGVycm9yUmVhc29uOiAnXHU0RUQ4XHU2QjNFXHU0RkUxXHU2MDZGXHU5QThDXHU4QkMxXHU1OTMxXHU4RDI1XHVGRjBDXHU5NEY2XHU4ODRDXHU1MzYxXHU1M0Y3XHU2NUUwXHU2NTQ4JyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjU5MjAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxNzI4MDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy03ODkxMjM0NTYnLFxyXG4gICAgc3RhdHVzOiAnXHU1REYyXHU1QjhDXHU2MjEwJyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMzQ1NjAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyNTkyMDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy04OTEyMzQ1NjcnLFxyXG4gICAgc3RhdHVzOiAnXHU1REYyXHU1QjhDXHU2MjEwJyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNDMyMDAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAzNDU2MDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy05MTIzNDU2NzgnLFxyXG4gICAgc3RhdHVzOiAnXHU1OTA0XHU3NDA2XHU0RTJEJyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNTE4NDAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA0MzIwMDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy0xMjM3ODk0NTYnLFxyXG4gICAgc3RhdHVzOiAnXHU1Rjg1XHU1OTA0XHU3NDA2JyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNjA0ODAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA1MTg0MDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy0yMzQ4OTE1NjcnLFxyXG4gICAgc3RhdHVzOiAnXHU1RjAyXHU1RTM4JyxcclxuICAgIGVycm9yUmVhc29uOiAnXHU1NTQ2XHU1NEMxXHU1RTkzXHU1QjU4XHU0RTBEXHU4REIzXHVGRjBDXHU2NUUwXHU2Q0Q1XHU2RUUxXHU4REIzXHU4QkEyXHU1MzU1XHU5NzAwXHU2QzQyJyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNjkxMjAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA2MDQ4MDAwMDBcclxuICB9LFxyXG4gIHtcclxuICAgIHN5c3RlbU9yZGVySWQ6ICdTTy0zNDU5MTI2NzgnLFxyXG4gICAgc3RhdHVzOiAnXHU1REYyXHU1QjhDXHU2MjEwJyxcclxuICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNzc3NjAwMDAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA2OTEyMDAwMDBcclxuICB9XHJcbl1cclxuXHJcbi8vIFx1NTU0Nlx1NTRDMVx1NjU3MFx1NjM2RVxyXG5leHBvcnQgY29uc3QgcHJvZHVjdExpc3Q6IFByb2R1Y3REYXRhW10gPSBbXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAxJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU5QUQ4XHU1NEMxXHU4RDI4XHU2NUUwXHU3RUJGXHU4NEREXHU3MjU5XHU4MDMzXHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDAxJyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgcHJpY2U6IDk5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvaGVhZHBob25lcy5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxNzI4MDAwMDAsIC8vIDJcdTU5MjlcdTUyNERcclxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA4NjQwMDAwMCwgLy8gMVx1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QScsXHJcbiAgICBzdG9jazogMzAsXHJcbiAgICB3bXNTdG9jazogNDUsXHJcbiAgICBsYXN0U3luY1N0b2NrOiAzOCxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgbWFzdGVyU2t1OiAnTVMtMDAxJyxcclxuICAgIG1hc3RlclByb2R1Y3ROYW1lOiAnTWFzdGVyIFx1ODRERFx1NzI1OVx1ODAzM1x1NjczQScsXHJcbiAgICB3YXJlaG91c2VTdG9jazoge1xyXG4gICAgICBVUzogMjAsXHJcbiAgICAgIEVVOiAxNSxcclxuICAgICAgQ046IDEwXHJcbiAgICB9LFxyXG4gICAgc3luY1J1bGU6IHtcclxuICAgICAgdHlwZTogJ3BlcmNlbnQnLFxyXG4gICAgICB2YWx1ZTogODBcclxuICAgIH0sXHJcbiAgICBpbnZlbnRvcnlMb2NhdGlvbnM6IFtcclxuICAgICAgeyBuYW1lOiAnXHU0RTBBXHU2RDc3XHU0RUQzJywgcXVhbnRpdHk6IDI1IH0sXHJcbiAgICAgIHsgbmFtZTogJ1x1NTMxN1x1NEVBQ1x1NEVEMycsIHF1YW50aXR5OiAxNSB9LFxyXG4gICAgICB7IG5hbWU6ICdcdTVFN0ZcdTVEREVcdTRFRDMnLCBxdWFudGl0eTogNSB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDEnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTlBRDhcdTU0QzFcdThEMjhcdTY1RTBcdTdFQkZcdTg0RERcdTcyNTlcdTgwMzNcdTY3M0EnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1NIRi1TS1UwMDEnLFxyXG4gICAgY2hhbm5lbDogJ3Nob3BpZnknLFxyXG4gICAgcHJpY2U6IDEwOS45OSxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRScsXHJcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2VzL2hlYWRwaG9uZXMuanBnJyxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjU5MjAwMDAwLCAvLyAzXHU1OTI5XHU1MjREXHJcbiAgICBsYXN0U3luY1RpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTcyODAwMDAwLCAvLyAyXHU1OTI5XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdCJyxcclxuICAgIHN0b2NrOiAxMCxcclxuICAgIHdtc1N0b2NrOiAyNSxcclxuICAgIGxhc3RTeW5jU3RvY2s6IDIyLFxyXG4gICAgc3RvcmU6ICdNYWluIFN0b3JlJyxcclxuICAgIG1hc3RlclNrdTogJ01TLTAwMScsXHJcbiAgICBtYXN0ZXJQcm9kdWN0TmFtZTogJ01hc3RlciBcdTg0RERcdTcyNTlcdTgwMzNcdTY3M0EnLFxyXG4gICAgd2FyZWhvdXNlU3RvY2s6IHtcclxuICAgICAgVVM6IDEwLFxyXG4gICAgICBFVTogMTVcclxuICAgIH0sXHJcbiAgICBzeW5jUnVsZToge1xyXG4gICAgICB0eXBlOiAnZml4ZWQnLFxyXG4gICAgICB2YWx1ZTogMTAwXHJcbiAgICB9LFxyXG4gICAgaW52ZW50b3J5TG9jYXRpb25zOiBbXHJcbiAgICAgIHsgbmFtZTogJ1x1NkIyN1x1NkQzMlx1NEVEMycsIHF1YW50aXR5OiAxOCB9LFxyXG4gICAgICB7IG5hbWU6ICdcdTdGOEVcdTU2RkRcdTRFRDMnLCBxdWFudGl0eTogNyB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDEnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTlBRDhcdTU0QzFcdThEMjhcdTY1RTBcdTdFQkZcdTg0RERcdTcyNTlcdTgwMzNcdTY3M0EnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1dNVC1TS1UwMDEnLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgcHJpY2U6IDg5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU3RjNBXHU4RDI3JyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvaGVhZHBob25lcy5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAzNDU2MDAwMDAsIC8vIDRcdTU5MjlcdTUyNERcclxuICAgIGxhc3RTeW5jVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAyNTkyMDAwMDAsIC8vIDNcdTU5MjlcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0MnLFxyXG4gICAgc3RvY2s6IDAsXHJcbiAgICB3bXNTdG9jazogMTUsXHJcbiAgICBsYXN0U3luY1N0b2NrOiAxMixcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgd2FyZWhvdXNlU3RvY2s6IHtcclxuICAgICAgVVM6IDE1XHJcbiAgICB9LFxyXG4gICAgc3luY1J1bGU6IHtcclxuICAgICAgdHlwZTogJ3JlZHVjZScsXHJcbiAgICAgIHZhbHVlOiAxMCxcclxuICAgICAgbWV0aG9kOiAncGVyY2VudCdcclxuICAgIH0sXHJcbiAgICBpbnZlbnRvcnlMb2NhdGlvbnM6IFtcclxuICAgICAgeyBuYW1lOiAnXHU3RjhFXHU1NkZEXHU0RUQzJywgcXVhbnRpdHk6IDEyIH0sXHJcbiAgICAgIHsgbmFtZTogJ1x1NTJBMFx1NURERVx1NEVEMycsIHF1YW50aXR5OiAzIH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAwMicsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1NjI0Qlx1ODg2OCcsXHJcbiAgICBjaGFubmVsU2t1OiAnQU1aLVNLVTAwMicsXHJcbiAgICBjaGFubmVsOiAnYW1hem9uJyxcclxuICAgIHByaWNlOiAxMDAuMDEsXHJcbiAgICBzdGF0dXM6ICdcdTU3MjhcdTU1MkUnLFxyXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlcy9zbWFydHdhdGNoLmpwZycsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDE3MjgwMDAwMCwgLy8gMlx1NTkyOVx1NTI0RFxyXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDg2NDAwMDAwLCAvLyAxXHU1OTI5XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdBJyxcclxuICAgIHN0b2NrOiAxOCxcclxuICAgIHdtc1N0b2NrOiAyMixcclxuICAgIGxhc3RTeW5jU3RvY2s6IDIwLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBtYXN0ZXJTa3U6ICdNUy0wMDInLFxyXG4gICAgbWFzdGVyUHJvZHVjdE5hbWU6ICdNYXN0ZXIgXHU2NjdBXHU4MEZEXHU2MjRCXHU4ODY4JyxcclxuICAgIHdhcmVob3VzZVN0b2NrOiB7XHJcbiAgICAgIFVTOiAxMixcclxuICAgICAgVUs6IDEwXHJcbiAgICB9LFxyXG4gICAgc3luY1J1bGU6IHtcclxuICAgICAgdHlwZTogJ3JlZHVjZScsXHJcbiAgICAgIHZhbHVlOiA1MCxcclxuICAgICAgbWV0aG9kOiAnZml4ZWQnXHJcbiAgICB9LFxyXG4gICAgaW52ZW50b3J5TG9jYXRpb25zOiBbXHJcbiAgICAgIHsgbmFtZTogJ1x1ODJGMVx1NTZGRFx1NEVEMycsIHF1YW50aXR5OiAxNCB9LFxyXG4gICAgICB7IG5hbWU6ICdcdTdGOEVcdTU2RkRcdTRFRDMnLCBxdWFudGl0eTogOCB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDMnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdThEODVcdTg1ODRcdTdCMTRcdThCQjBcdTY3MkNcdTc1MzVcdTgxMTEnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1NIRi1TS1UwMDMnLFxyXG4gICAgY2hhbm5lbDogJ3Nob3BpZnknLFxyXG4gICAgcHJpY2U6IDQ5OS45OSxcclxuICAgIHN0YXR1czogJ1x1NTcyOFx1NTUyRScsXHJcbiAgICBpbWFnZVVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2VzL2xhcHRvcC5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA4NjQwMDAwMCwgLy8gMVx1NTkyOVx1NTI0RFxyXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDQzMjAwMDAwLCAvLyAxMlx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QicsXHJcbiAgICBzdG9jazogNSxcclxuICAgIHdtc1N0b2NrOiA3LFxyXG4gICAgbGFzdFN5bmNTdG9jazogNixcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZScsXHJcbiAgICBzeW5jUnVsZToge1xyXG4gICAgICB0eXBlOiAncGVyY2VudCcsXHJcbiAgICAgIHZhbHVlOiA5MFxyXG4gICAgfSxcclxuICAgIGludmVudG9yeUxvY2F0aW9uczogW1xyXG4gICAgICB7IG5hbWU6ICdcdTRFM0JcdTRFRDNcdTVFOTMnLCBxdWFudGl0eTogNyB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDQnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTk2MzJcdTZDMzRcdThGRDBcdTUyQThcdTc2RjhcdTY3M0EnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1dNVC1TS1UwMDQnLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgcHJpY2U6IDUzLjMzLFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvY2FtZXJhLmpwZycsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDE3MjgwMDAwMCwgLy8gMlx1NTkyOVx1NTI0RFxyXG4gICAgbGFzdFN5bmNUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDEyOTYwMDAwMCwgLy8gMS41XHU1OTI5XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdDJyxcclxuICAgIHN0b2NrOiAxMixcclxuICAgIHdtc1N0b2NrOiAxOCxcclxuICAgIGxhc3RTeW5jU3RvY2s6IDE2LFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBzeW5jUnVsZToge1xyXG4gICAgICB0eXBlOiAncGVyY2VudCcsXHJcbiAgICAgIHZhbHVlOiA5MFxyXG4gICAgfSxcclxuICAgIGludmVudG9yeUxvY2F0aW9uczogW1xyXG4gICAgICB7IG5hbWU6ICdcdTVGQjdcdTVEREVcdTRFRDMnLCBxdWFudGl0eTogMTAgfSxcclxuICAgICAgeyBuYW1lOiAnXHU3RUJEXHU3RUE2XHU0RUQzJywgcXVhbnRpdHk6IDggfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDA1JyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU0RkJGXHU2NDNBXHU1RjBGXHU1MTQ1XHU3NTM1XHU1QjlEJyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDA1JyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgcHJpY2U6IDM5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvcG93ZXJiYW5rLmpwZycsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDI1OTIwMDAwMCwgLy8gM1x1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QScsXHJcbiAgICBzdG9jazogMjUsXHJcbiAgICB3bXNTdG9jazogMzgsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJyxcclxuICAgIGludmVudG9yeUxvY2F0aW9uczogW1xyXG4gICAgICB7IG5hbWU6ICdcdTRFMkRcdTVGQzNcdTRFRDNcdTVFOTMnLCBxdWFudGl0eTogMzggfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAgLy8gXHU2NUIwXHU1ODlFXHU1NTQ2XHU1NEMxXHU2NTcwXHU2MzZFXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDEwJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2RTM4XHU2MjBGXHU3QjE0XHU4QkIwXHU2NzJDXHU3NTM1XHU4MTExJyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDEwJyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgcHJpY2U6IDEyOTkuOTksXHJcbiAgICBzdGF0dXM6ICdcdTU3MjhcdTU1MkUnLFxyXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlcy9nYW1pbmctbGFwdG9wLmpwZycsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDg2NDAwMDAwLCAvLyAxXHU1OTI5XHU1MjREXHJcbiAgICBjdXN0b21lck5hbWU6ICdcdTVCQTJcdTYyMzdBJyxcclxuICAgIHN0b2NrOiA4LFxyXG4gICAgd21zU3RvY2s6IDEwLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBpbnZlbnRvcnlMb2NhdGlvbnM6IFtcclxuICAgICAgeyBuYW1lOiAnXHU1MkEwXHU1RERFXHU5MTREXHU5MDAxXHU0RTJEXHU1RkMzJywgcXVhbnRpdHk6IDEwIH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxMScsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1OTdGM1x1N0JCMScsXHJcbiAgICBjaGFubmVsU2t1OiAnV01ULVNLVTAxMScsXHJcbiAgICBjaGFubmVsOiAnd2FsbWFydCcsXHJcbiAgICBwcmljZTogMTI0Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvc21hcnQtc3BlYWtlci5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxNzI4MDAwMDAsIC8vIDJcdTU5MjlcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0MnLFxyXG4gICAgc3RvY2s6IDE1LFxyXG4gICAgd21zU3RvY2s6IDIwLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBpbnZlbnRvcnlMb2NhdGlvbnM6IFtcclxuICAgICAgeyBuYW1lOiAnXHU1MzU3XHU2NUI5XHU0RUQzJywgcXVhbnRpdHk6IDEyIH0sXHJcbiAgICAgIHsgbmFtZTogJ1x1NTMxN1x1NjVCOVx1NEVEMycsIHF1YW50aXR5OiA4IH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxMicsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NjY3QVx1ODBGRFx1NzA2Rlx1NkNFMVx1NTk1N1x1ODhDNScsXHJcbiAgICBjaGFubmVsU2t1OiAnRUJZLVNLVTAxMicsXHJcbiAgICBjaGFubmVsOiAnZWJheScsXHJcbiAgICBwcmljZTogMTkuOTksXHJcbiAgICBzdGF0dXM6ICdcdTRFMEJcdTY3QjYnLFxyXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlcy9zbWFydC1idWxiLmpwZycsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDI1OTIwMDAwMCwgLy8gM1x1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3RCcsXHJcbiAgICBzdG9jazogMixcclxuICAgIHdtc1N0b2NrOiA1LFxyXG4gICAgc3RvcmU6ICdFVSBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxMycsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NjVFMFx1N0VCRlx1ODAzM1x1NjczQScsXHJcbiAgICBjaGFubmVsU2t1OiAnU0hGLVNLVTAxMycsXHJcbiAgICBjaGFubmVsOiAnc2hvcGlmeScsXHJcbiAgICBwcmljZTogMTk5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJyxcclxuICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZXMvd2lyZWxlc3MtZWFycGhvbmVzLmpwZycsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM0NTYwMDAwMCwgLy8gNFx1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QicsXHJcbiAgICBzdG9jazogMjAsXHJcbiAgICB3bXNTdG9jazogMjUsXHJcbiAgICBzdG9yZTogJ01haW4gU3RvcmUnXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTQnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTYyNEJcdTY3M0FcdTRGRERcdTYyQTRcdTU4RjMnLFxyXG4gICAgY2hhbm5lbFNrdTogJ0FNWi1TS1UwMTQnLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBwcmljZTogMTkuOTksXHJcbiAgICBzdGF0dXM6ICdcdTdGM0FcdThEMjcnLFxyXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlcy9waG9uZS1jYXNlLmpwZycsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDQzMjAwMDAwMCwgLy8gNVx1NTkyOVx1NTI0RFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnXHU1QkEyXHU2MjM3QScsXHJcbiAgICBzdG9jazogMCxcclxuICAgIHdtc1N0b2NrOiA2LFxyXG4gICAgc3RvcmU6ICdFVSBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxNScsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NjI0Qlx1NjczQVx1NjUyRlx1NjdCNicsXHJcbiAgICBjaGFubmVsU2t1OiAnV01ULVNLVTAxNScsXHJcbiAgICBjaGFubmVsOiAnd2FsbWFydCcsXHJcbiAgICBwcmljZTogMjkuOTksXHJcbiAgICBzdGF0dXM6ICdcdTU3MjhcdTU1MkUnLFxyXG4gICAgaW1hZ2VVcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlcy9waG9uZS1zdGFuZC5qcGcnLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSA1MTg0MDAwMDAsIC8vIDZcdTU5MjlcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0MnLFxyXG4gICAgc3RvY2s6IDMyLFxyXG4gICAgd21zU3RvY2s6IDQwLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZSdcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxMCcsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NkUzOFx1NjIwRlx1N0IxNFx1OEJCMFx1NjcyQ1x1NzUzNVx1ODExMScsXHJcbiAgICBjaGFubmVsU2t1OiAnQU1aLVNLVTAxMCcsXHJcbiAgICBjaGFubmVsOiAnYW1hem9uJyxcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiAyLFxyXG4gICAgcmVzZXJ2ZWQ6IDAsXHJcbiAgICB0b3RhbDogMixcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjUyMDAwMDAsIC8vIDdcdTVDMEZcdTY1RjZcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0EnLFxyXG4gICAgc3RvY2s6IDIsXHJcbiAgICB3bXNTdG9jazogNCxcclxuICAgIHByaWNlOiAxMjk5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJ1xyXG4gIH1cclxuXVxyXG5cclxuLy8gXHU1RTkzXHU1QjU4XHU2NTcwXHU2MzZFXHJcbmV4cG9ydCBjb25zdCBpbnZlbnRvcnlMaXN0OiBJbnZlbnRvcnlEYXRhW10gPSBbXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAxJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU5QUQ4XHU1NEMxXHU4RDI4XHU2NUUwXHU3RUJGXHU4NEREXHU3MjU5XHU4MDMzXHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDAxJyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDI1LFxyXG4gICAgcmVzZXJ2ZWQ6IDUsXHJcbiAgICB0b3RhbDogMzAsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM2MDAwMDAgLy8gMVx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDAxJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU5QUQ4XHU1NEMxXHU4RDI4XHU2NUUwXHU3RUJGXHU4NEREXHU3MjU5XHU4MDMzXHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdTSEYtU0tVMDAxJyxcclxuICAgIGNoYW5uZWw6ICdzaG9waWZ5JyxcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDgsXHJcbiAgICByZXNlcnZlZDogMixcclxuICAgIHRvdGFsOiAxMCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gNzIwMDAwMCAvLyAyXHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDEnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTlBRDhcdTU0QzFcdThEMjhcdTY1RTBcdTdFQkZcdTg0RERcdTcyNTlcdTgwMzNcdTY3M0EnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1dNVC1TS1UwMDEnLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgc3RvcmU6ICdVUyBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDAsXHJcbiAgICByZXNlcnZlZDogMCxcclxuICAgIHRvdGFsOiAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxMDgwMDAwMCAvLyAzXHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDInLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTY2N0FcdTgwRkRcdTYyNEJcdTg4NjgnLFxyXG4gICAgY2hhbm5lbFNrdTogJ0FNWi1TS1UwMDInLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogMTUsXHJcbiAgICByZXNlcnZlZDogMyxcclxuICAgIHRvdGFsOiAxOCxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMzYwMDAwMCAvLyAxXHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDMnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdThEODVcdTg1ODRcdTdCMTRcdThCQjBcdTY3MkNcdTc1MzVcdTgxMTEnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1NIRi1TS1UwMDMnLFxyXG4gICAgY2hhbm5lbDogJ3Nob3BpZnknLFxyXG4gICAgc3RvcmU6ICdNYWluIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogNSxcclxuICAgIHJlc2VydmVkOiAxLFxyXG4gICAgdG90YWw6IDYsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDcyMDAwMDAgLy8gMlx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDA0JyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU5NjMyXHU2QzM0XHU4RkQwXHU1MkE4XHU3NkY4XHU2NzNBJyxcclxuICAgIGNoYW5uZWxTa3U6ICdXTVQtU0tVMDA0JyxcclxuICAgIGNoYW5uZWw6ICd3YWxtYXJ0JyxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiAxMixcclxuICAgIHJlc2VydmVkOiAyLFxyXG4gICAgdG90YWw6IDE0LFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxMDgwMDAwMCAvLyAzXHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMDUnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTRGQkZcdTY0M0FcdTVGMEZcdTUxNDVcdTc1MzVcdTVCOUQnLFxyXG4gICAgY2hhbm5lbFNrdTogJ0FNWi1TS1UwMDUnLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogMzAsXHJcbiAgICByZXNlcnZlZDogNyxcclxuICAgIHRvdGFsOiAzNyxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMzYwMDAwMCAvLyAxXHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgfSxcclxuICAvLyBcdTY1QjBcdTU4OUVcdTVFOTNcdTVCNThcdTY1NzBcdTYzNkVcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTAnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTZFMzhcdTYyMEZcdTdCMTRcdThCQjBcdTY3MkNcdTc1MzVcdTgxMTEnLFxyXG4gICAgY2hhbm5lbFNrdTogJ0FNWi1TS1UwMTAnLFxyXG4gICAgY2hhbm5lbDogJ2FtYXpvbicsXHJcbiAgICBzdG9yZTogJ1VTIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogMyxcclxuICAgIHJlc2VydmVkOiAxLFxyXG4gICAgdG90YWw6IDQsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDM2MDAwMDAgLy8gMVx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDExJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2NjdBXHU4MEZEXHU5N0YzXHU3QkIxJyxcclxuICAgIGNoYW5uZWxTa3U6ICdXTVQtU0tVMDExJyxcclxuICAgIGNoYW5uZWw6ICd3YWxtYXJ0JyxcclxuICAgIHN0b3JlOiAnVVMgU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiA4LFxyXG4gICAgcmVzZXJ2ZWQ6IDIsXHJcbiAgICB0b3RhbDogMTAsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDcyMDAwMDAgLy8gMlx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDEyJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2NjdBXHU4MEZEXHU3MDZGXHU2Q0UxXHU1OTU3XHU4OEM1JyxcclxuICAgIGNoYW5uZWxTa3U6ICdFQlktU0tVMDEyJyxcclxuICAgIGNoYW5uZWw6ICdlYmF5JyxcclxuICAgIHN0b3JlOiAnTWFpbiBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDAsXHJcbiAgICByZXNlcnZlZDogMCxcclxuICAgIHRvdGFsOiAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxMDgwMDAwMCAvLyAzXHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTMnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTY1RTBcdTdFQkZcdTgwMzNcdTY3M0EnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1NIRi1TS1UwMTMnLFxyXG4gICAgY2hhbm5lbDogJ3Nob3BpZnknLFxyXG4gICAgc3RvcmU6ICdNYWluIFN0b3JlJyxcclxuICAgIGF2YWlsYWJsZTogMTIsXHJcbiAgICByZXNlcnZlZDogMyxcclxuICAgIHRvdGFsOiAxNSxcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMTQ0MDAwMDAgLy8gNFx1NUMwRlx1NjVGNlx1NTI0RFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2t1OiAnU0tVMDE0JyxcclxuICAgIHByb2R1Y3ROYW1lOiAnXHU2MjRCXHU2NzNBXHU0RkREXHU2MkE0XHU1OEYzJyxcclxuICAgIGNoYW5uZWxTa3U6ICdBTVotU0tVMDE0JyxcclxuICAgIGNoYW5uZWw6ICdhbWF6b24nLFxyXG4gICAgc3RvcmU6ICdFVSBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDAsXHJcbiAgICByZXNlcnZlZDogMCxcclxuICAgIHRvdGFsOiAwLFxyXG4gICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAxODAwMDAwMCAvLyA1XHU1QzBGXHU2NUY2XHU1MjREXHJcbiAgfSxcclxuICB7XHJcbiAgICBza3U6ICdTS1UwMTUnLFxyXG4gICAgcHJvZHVjdE5hbWU6ICdcdTYyNEJcdTY3M0FcdTY1MkZcdTY3QjYnLFxyXG4gICAgY2hhbm5lbFNrdTogJ1dNVC1TS1UwMTUnLFxyXG4gICAgY2hhbm5lbDogJ3dhbG1hcnQnLFxyXG4gICAgc3RvcmU6ICdFVSBTdG9yZScsXHJcbiAgICBhdmFpbGFibGU6IDI1LFxyXG4gICAgcmVzZXJ2ZWQ6IDUsXHJcbiAgICB0b3RhbDogMzAsXHJcbiAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIDIxNjAwMDAwIC8vIDZcdTVDMEZcdTY1RjZcdTUyNERcclxuICB9LFxyXG4gIHtcclxuICAgIHNrdTogJ1NLVTAxMCcsXHJcbiAgICBwcm9kdWN0TmFtZTogJ1x1NkUzOFx1NjIwRlx1N0IxNFx1OEJCMFx1NjcyQ1x1NzUzNVx1ODExMScsXHJcbiAgICBjaGFubmVsU2t1OiAnQU1aLVNLVTAxMCcsXHJcbiAgICBjaGFubmVsOiAnYW1hem9uJyxcclxuICAgIHN0b3JlOiAnRVUgU3RvcmUnLFxyXG4gICAgYXZhaWxhYmxlOiAyLFxyXG4gICAgcmVzZXJ2ZWQ6IDAsXHJcbiAgICB0b3RhbDogMixcclxuICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gMjUyMDAwMDAsIC8vIDdcdTVDMEZcdTY1RjZcdTUyNERcclxuICAgIGN1c3RvbWVyTmFtZTogJ1x1NUJBMlx1NjIzN0EnLFxyXG4gICAgc3RvY2s6IDIsXHJcbiAgICB3bXNTdG9jazogNCxcclxuICAgIHByaWNlOiAxMjk5Ljk5LFxyXG4gICAgc3RhdHVzOiAnXHU1NzI4XHU1NTJFJ1xyXG4gIH1cclxuXVxyXG5cclxuLy8gXHU2N0U1XHU4QkUyXHU1MUZEXHU2NTcwXHJcbmV4cG9ydCBmdW5jdGlvbiBxdWVyeU9yZGVycyhwYXJhbXM6IFF1ZXJ5UGFyYW1zKTogUGFnaW5hdGVkUmVzcG9uc2U8T3JkZXJEYXRhPiB7XHJcbiAgbGV0IHJlc3VsdHMgPSBbLi4ub3JkZXJMaXN0XVxyXG4gIFxyXG4gIC8vIFx1NTdGQVx1NjcyQ1x1OEZDN1x1NkVFNFx1Njc2MVx1NEVGNlxyXG4gIGlmIChwYXJhbXMuY3VzdG9tZXIgJiYgcGFyYW1zLmNoYW5uZWwpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uY2hhbm5lbCA9PT0gcGFyYW1zLmNoYW5uZWwpXHJcbiAgfVxyXG4gIFxyXG4gIGlmIChwYXJhbXMuY2hhbm5lbE9yZGVySWQpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uY2hhbm5lbE9yZGVySWQuaW5jbHVkZXMocGFyYW1zLmNoYW5uZWxPcmRlcklkIGFzIHN0cmluZykpXHJcbiAgfVxyXG4gIFxyXG4gIGlmIChwYXJhbXMuc3lzdGVtT3JkZXJJZCkge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zeXN0ZW1PcmRlcklkLmluY2x1ZGVzKHBhcmFtcy5zeXN0ZW1PcmRlcklkIGFzIHN0cmluZykpXHJcbiAgfVxyXG4gIFxyXG4gIC8vIFx1OUFEOFx1N0VBN1x1NjdFNVx1OEJFMlx1Njc2MVx1NEVGNiAtIFx1OEJBMlx1NTM1NVxyXG4gIGlmIChwYXJhbXMub3JkZXJTdGF0dXMpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzID09PSBwYXJhbXMub3JkZXJTdGF0dXMpXHJcbiAgfVxyXG4gIFxyXG4gIGlmIChwYXJhbXMuY3VzdG9tZXJOYW1lKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLmN1c3RvbWVyTmFtZS5pbmNsdWRlcyhwYXJhbXMuY3VzdG9tZXJOYW1lKSlcclxuICB9XHJcbiAgXHJcbiAgaWYgKHBhcmFtcy5zdGFydERhdGUgJiYgcGFyYW1zLmVuZERhdGUpIHtcclxuICAgIGNvbnN0IHN0YXJ0VGltZXN0YW1wID0gbmV3IERhdGUocGFyYW1zLnN0YXJ0RGF0ZSkuZ2V0VGltZSgpXHJcbiAgICBjb25zdCBlbmRUaW1lc3RhbXAgPSBuZXcgRGF0ZShwYXJhbXMuZW5kRGF0ZSkuZ2V0VGltZSgpICsgODY0MDAwMDAgLy8gXHU1MkEwXHU0RTAwXHU1OTI5XHVGRjBDXHU1MzA1XHU1NDJCXHU3RUQzXHU2NzVGXHU2NUU1XHU2NzFGXHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiB7XHJcbiAgICAgIHJldHVybiBpdGVtLmNyZWF0ZVRpbWUgPj0gc3RhcnRUaW1lc3RhbXAgJiYgaXRlbS5jcmVhdGVUaW1lIDw9IGVuZFRpbWVzdGFtcFxyXG4gICAgfSlcclxuICB9XHJcbiAgXHJcbiAgLy8gXHU4QkExXHU3Qjk3XHU1MjA2XHU5ODc1XHJcbiAgY29uc3QgdG90YWwgPSByZXN1bHRzLmxlbmd0aFxyXG4gIGNvbnN0IHN0YXJ0SW5kZXggPSAocGFyYW1zLnBhZ2UgLSAxKSAqIHBhcmFtcy5wYWdlU2l6ZVxyXG4gIGNvbnN0IGVuZEluZGV4ID0gc3RhcnRJbmRleCArIHBhcmFtcy5wYWdlU2l6ZVxyXG4gIGNvbnN0IGRhdGEgPSByZXN1bHRzLnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KVxyXG4gIFxyXG4gIHJldHVybiB7XHJcbiAgICBkYXRhLFxyXG4gICAgdG90YWxcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBxdWVyeVN5c3RlbU9yZGVycyhjaGFubmVsT3JkZXJJZDogc3RyaW5nKTogU3lzdGVtT3JkZXJEYXRhW10ge1xyXG4gIC8vIFx1OTAxQVx1OEZDN1x1NkUyMFx1OTA1M1x1OEJBMlx1NTM1NVx1NTNGN1x1NjI3RVx1NTIzMFx1NUJGOVx1NUU5NFx1NzY4NFx1N0NGQlx1N0VERlx1OEJBMlx1NTM1NVxyXG4gIGNvbnN0IG9yZGVyID0gb3JkZXJMaXN0LmZpbmQobyA9PiBvLmNoYW5uZWxPcmRlcklkID09PSBjaGFubmVsT3JkZXJJZClcclxuICBpZiAoIW9yZGVyKSByZXR1cm4gW11cclxuICBcclxuICByZXR1cm4gc3lzdGVtT3JkZXJMaXN0LmZpbHRlcihzbyA9PiBzby5zeXN0ZW1PcmRlcklkID09PSBvcmRlci5zeXN0ZW1PcmRlcklkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcXVlcnlQcm9kdWN0cyhwYXJhbXM6IFF1ZXJ5UGFyYW1zKTogUGFnaW5hdGVkUmVzcG9uc2U8UHJvZHVjdERhdGE+IHtcclxuICBsZXQgcmVzdWx0cyA9IFsuLi5wcm9kdWN0TGlzdF1cclxuICBcclxuICAvLyBcdTU3RkFcdTY3MkNcdThGQzdcdTZFRTRcdTY3NjFcdTRFRjZcclxuICBpZiAocGFyYW1zLmN1c3RvbWVyICYmIHBhcmFtcy5jaGFubmVsKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLmNoYW5uZWwgPT09IHBhcmFtcy5jaGFubmVsKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLnByb2R1Y3ROYW1lKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLnByb2R1Y3ROYW1lLmluY2x1ZGVzKHBhcmFtcy5wcm9kdWN0TmFtZSBhcyBzdHJpbmcpKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLnNrdSkge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5za3UuaW5jbHVkZXMocGFyYW1zLnNrdSBhcyBzdHJpbmcpIHx8IGl0ZW0uY2hhbm5lbFNrdS5pbmNsdWRlcyhwYXJhbXMuc2t1IGFzIHN0cmluZykpXHJcbiAgfVxyXG4gIFxyXG4gIC8vIFx1OUFEOFx1N0VBN1x1NjdFNVx1OEJFMlx1Njc2MVx1NEVGNiAtIFx1NTU0Nlx1NTRDMVxyXG4gIGlmIChwYXJhbXMucHJvZHVjdFN0YXR1cykge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zdGF0dXMgPT09IHBhcmFtcy5wcm9kdWN0U3RhdHVzKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLm1pblByaWNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0ucHJpY2UgPj0gcGFyYW1zLm1pblByaWNlISlcclxuICB9XHJcbiAgXHJcbiAgaWYgKHBhcmFtcy5tYXhQcmljZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLnByaWNlIDw9IHBhcmFtcy5tYXhQcmljZSEpXHJcbiAgfVxyXG4gIFxyXG4gIC8vIFx1OEJBMVx1N0I5N1x1NTIwNlx1OTg3NVxyXG4gIGNvbnN0IHRvdGFsID0gcmVzdWx0cy5sZW5ndGhcclxuICBjb25zdCBzdGFydEluZGV4ID0gKHBhcmFtcy5wYWdlIC0gMSkgKiBwYXJhbXMucGFnZVNpemVcclxuICBjb25zdCBlbmRJbmRleCA9IHN0YXJ0SW5kZXggKyBwYXJhbXMucGFnZVNpemVcclxuICBjb25zdCBkYXRhID0gcmVzdWx0cy5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleClcclxuICBcclxuICByZXR1cm4ge1xyXG4gICAgZGF0YSxcclxuICAgIHRvdGFsXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcXVlcnlJbnZlbnRvcnkocGFyYW1zOiBRdWVyeVBhcmFtcyk6IFBhZ2luYXRlZFJlc3BvbnNlPEludmVudG9yeURhdGE+IHtcclxuICBsZXQgcmVzdWx0cyA9IFsuLi5pbnZlbnRvcnlMaXN0XVxyXG4gIFxyXG4gIC8vIFx1NTdGQVx1NjcyQ1x1OEZDN1x1NkVFNFx1Njc2MVx1NEVGNlxyXG4gIGlmIChwYXJhbXMuY3VzdG9tZXIgJiYgcGFyYW1zLmNoYW5uZWwpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0uY2hhbm5lbCA9PT0gcGFyYW1zLmNoYW5uZWwpXHJcbiAgfVxyXG4gIFxyXG4gIGlmIChwYXJhbXMucHJvZHVjdE5hbWUpIHtcclxuICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihpdGVtID0+IGl0ZW0ucHJvZHVjdE5hbWUuaW5jbHVkZXMocGFyYW1zLnByb2R1Y3ROYW1lIGFzIHN0cmluZykpXHJcbiAgfVxyXG4gIFxyXG4gIGlmIChwYXJhbXMuc2t1KSB7XHJcbiAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLnNrdS5pbmNsdWRlcyhwYXJhbXMuc2t1IGFzIHN0cmluZykgfHwgaXRlbS5jaGFubmVsU2t1LmluY2x1ZGVzKHBhcmFtcy5za3UgYXMgc3RyaW5nKSlcclxuICB9XHJcbiAgXHJcbiAgLy8gXHU5QUQ4XHU3RUE3XHU2N0U1XHU4QkUyXHU2NzYxXHU0RUY2IC0gXHU1RTkzXHU1QjU4XHJcbiAgaWYgKHBhcmFtcy5zdG9yZSkge1xyXG4gICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zdG9yZS5pbmNsdWRlcyhwYXJhbXMuc3RvcmUpKVxyXG4gIH1cclxuICBcclxuICBpZiAocGFyYW1zLmludmVudG9yeVN0YXR1cykge1xyXG4gICAgc3dpdGNoKHBhcmFtcy5pbnZlbnRvcnlTdGF0dXMpIHtcclxuICAgICAgY2FzZSAnXHU2NzA5XHU1RTkzXHU1QjU4JzpcclxuICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoaXRlbSA9PiBpdGVtLmF2YWlsYWJsZSA+IDEwKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ1x1NEY0RVx1NUU5M1x1NUI1OCc6XHJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5hdmFpbGFibGUgPiAwICYmIGl0ZW0uYXZhaWxhYmxlIDw9IDEwKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ1x1NjVFMFx1NUU5M1x1NUI1OCc6XHJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5hdmFpbGFibGUgPD0gMClcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvLyBcdThCQTFcdTdCOTdcdTUyMDZcdTk4NzVcclxuICBjb25zdCB0b3RhbCA9IHJlc3VsdHMubGVuZ3RoXHJcbiAgY29uc3Qgc3RhcnRJbmRleCA9IChwYXJhbXMucGFnZSAtIDEpICogcGFyYW1zLnBhZ2VTaXplXHJcbiAgY29uc3QgZW5kSW5kZXggPSBzdGFydEluZGV4ICsgcGFyYW1zLnBhZ2VTaXplXHJcbiAgY29uc3QgZGF0YSA9IHJlc3VsdHMuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpXHJcbiAgXHJcbiAgcmV0dXJuIHtcclxuICAgIGRhdGEsXHJcbiAgICB0b3RhbFxyXG4gIH1cclxufSAiLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFx2aWV3c1xcXFxwdXJjaGFzZVxcXFx0cmFja2luZ1xcXFx0eXBlcy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFx2aWV3c1xcXFxwdXJjaGFzZVxcXFx0cmFja2luZ1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vQzovVXNlcnMvSmF5bmUvRGVza3RvcC9VTklTL09NUyVFOSVBMSVCOSVFNyU5QiVBRS9zcmMvdmlld3MvcHVyY2hhc2UvdHJhY2tpbmcvdHlwZXMudHNcIjtleHBvcnQgZW51bSBQdXJjaGFzZU9yZGVyU3RhdHVzIHtcbiAgUE9fQ1JFQVRFRCA9ICdQT19DUkVBVEVEJyxcbiAgUE9fQ09ORklSTUVEID0gJ1BPX0NPTkZJUk1FRCcsXG4gIElOX1BST0RVQ1RJT04gPSAnSU5fUFJPRFVDVElPTicsXG4gIEVYUE9SVF9DVVNUT01TID0gJ0VYUE9SVF9DVVNUT01TJyxcbiAgSU1QT1JUX0RFTElWRVJZID0gJ0lNUE9SVF9ERUxJVkVSWScsXG4gIFJFQ0VJVkVEID0gJ1JFQ0VJVkVEJyxcbiAgSU5WT0lDRUQgPSAnSU5WT0lDRUQnXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3ViUHJvY2VzcyB7XG4gIG5hbWU6IHN0cmluZ1xuICBzdGF0dXM6ICdwZW5kaW5nJyB8ICdpbl9wcm9ncmVzcycgfCAnY29tcGxldGVkJyB8ICdlcnJvcidcbiAgdGltZXN0YW1wPzogc3RyaW5nXG4gIG9wZXJhdG9yPzogc3RyaW5nXG4gIGF0dGFjaG1lbnRzPzogQXJyYXk8e1xuICAgIG5hbWU6IHN0cmluZ1xuICAgIHVybDogc3RyaW5nXG4gIH0+XG4gIHJlbWFya3M/OiBzdHJpbmdcbiAgZmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJhY2tpbmdTdGFnZSB7XG4gIHN0YXR1czogUHVyY2hhc2VPcmRlclN0YXR1c1xuICB0aXRsZTogc3RyaW5nXG4gIHN1YlByb2Nlc3NlczogU3ViUHJvY2Vzc1tdXG4gIGNvbXBsZXRlZDogYm9vbGVhblxuICBjdXJyZW50OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHVyY2hhc2VPcmRlclRyYWNraW5nIHtcbiAgaWQ6IHN0cmluZ1xuICBwb051bWJlcjogc3RyaW5nXG4gIHN1cHBsaWVyOiBzdHJpbmdcbiAgY3JlYXRlZEF0OiBzdHJpbmdcbiAgZXhwZWN0ZWREZWxpdmVyeURhdGU/OiBzdHJpbmdcbiAgY3VycmVudFN0YXR1czogUHVyY2hhc2VPcmRlclN0YXR1c1xuICBzdGFnZXM6IFRyYWNraW5nU3RhZ2VbXVxufVxuXG4vLyBTdGFnZSBjb25maWd1cmF0aW9uc1xuZXhwb3J0IGNvbnN0IFNUQUdFX0NPTkZJR1MgPSB7XG4gIFtQdXJjaGFzZU9yZGVyU3RhdHVzLlBPX0NSRUFURURdOiB7XG4gICAgdGl0bGU6ICdQTyBDcmVhdGVkJyxcbiAgICBzdWJQcm9jZXNzZXM6IFtcbiAgICAgIHsgbmFtZTogJ0RyYWZ0IENyZWF0ZWQnLCBmaWVsZHM6IFsnY3JlYXRlZFRpbWUnLCAnY3JlYXRvciddIH0sXG4gICAgICB7IG5hbWU6ICdQTyBOdW1iZXIgQXNzaWduZWQnLCBmaWVsZHM6IFsncG9OdW1iZXInXSB9LFxuICAgICAgeyBuYW1lOiAnU3VibWl0dGVkIGZvciBBcHByb3ZhbCcsIGZpZWxkczogWydhcHByb3ZhbFN0YXR1cycsICdhcHByb3ZlciddIH0sXG4gICAgICB7IG5hbWU6ICdBcHByb3ZlZCcsIGZpZWxkczogWydhcHByb3ZhbFRpbWUnLCAnYXBwcm92ZXInXSB9XG4gICAgXVxuICB9LFxuICBbUHVyY2hhc2VPcmRlclN0YXR1cy5QT19DT05GSVJNRURdOiB7XG4gICAgdGl0bGU6ICdQTyBDb25maXJtZWQnLFxuICAgIHN1YlByb2Nlc3NlczogW1xuICAgICAgeyBuYW1lOiAnU2VudCB0byBTdXBwbGllcicsIGZpZWxkczogWydzZW50VGltZScsICdjb250YWN0J10gfSxcbiAgICAgIHsgbmFtZTogJ1N1cHBsaWVyIEFja25vd2xlZGdlZCcsIGZpZWxkczogWydyZXBseVN0YXR1cycsICdjb250YWN0J10gfSxcbiAgICAgIHsgbmFtZTogJ1BPIEFjY2VwdGVkIC8gUmVqZWN0ZWQnLCBmaWVsZHM6IFsnY29uZmlybVRpbWUnLCAncmVtYXJrcyddIH0sXG4gICAgICB7IG5hbWU6ICdEZWxpdmVyeSBEYXRlIENvbmZpcm1lZCcsIGZpZWxkczogWydkZWxpdmVyeURhdGUnLCAncmVzcG9uc2libGUnXSB9XG4gICAgXVxuICB9LFxuICBbUHVyY2hhc2VPcmRlclN0YXR1cy5JTl9QUk9EVUNUSU9OXToge1xuICAgIHRpdGxlOiAnSW4gUHJvZHVjdGlvbicsXG4gICAgc3ViUHJvY2Vzc2VzOiBbXG4gICAgICB7IG5hbWU6ICdNYXRlcmlhbCBSZWFkeScsIGZpZWxkczogWydtYXRlcmlhbENvZGUnLCAnY29tcGxldGlvblRpbWUnXSB9LFxuICAgICAgeyBuYW1lOiAnSW4gQXNzZW1ibHknLCBmaWVsZHM6IFsnc3RhcnRUaW1lJywgJ2JhdGNoTnVtYmVyJ10gfSxcbiAgICAgIHsgbmFtZTogJ1Rlc3RpbmcgJiBRQScsIGZpZWxkczogWyd0ZXN0UmVzdWx0JywgJ3JlcG9ydE51bWJlciddIH0sXG4gICAgICB7IG5hbWU6ICdQYWNrYWdpbmcnLCBmaWVsZHM6IFsncGFja2luZ1RpbWUnLCAncGFja2luZ01ldGhvZCddIH0sXG4gICAgICB7IG5hbWU6ICdSZWFkeSB0byBTaGlwJywgZmllbGRzOiBbJ3JlYWR5VGltZSddIH1cbiAgICBdXG4gIH0sXG4gIFtQdXJjaGFzZU9yZGVyU3RhdHVzLkVYUE9SVF9DVVNUT01TXToge1xuICAgIHRpdGxlOiAnRXhwb3J0ICYgQ3VzdG9tcycsXG4gICAgc3ViUHJvY2Vzc2VzOiBbXG4gICAgICB7IG5hbWU6ICdCb29raW5nIENvbmZpcm1lZCcsIGZpZWxkczogWydib29raW5nTnVtYmVyJywgJ2NhcnJpZXInXSB9LFxuICAgICAgeyBuYW1lOiAnQ3VzdG9tcyBEb2NzIFByZXBhcmVkJywgZmllbGRzOiBbJ2ludm9pY2UnLCAncGFja2luZ0xpc3QnLCAnY29vJ10gfSxcbiAgICAgIHsgbmFtZTogJ0N1c3RvbXMgRGVjbGFyYXRpb24gU3VibWl0dGVkJywgZmllbGRzOiBbJ2RlY2xhcmF0aW9uVGltZScsICdhZ2VudCddIH0sXG4gICAgICB7IG5hbWU6ICdDdXN0b21zIENsZWFyZWQnLCBmaWVsZHM6IFsnY2xlYXJhbmNlVGltZScsICdyZW1hcmtzJ10gfSxcbiAgICAgIHsgbmFtZTogJ1NoaXBwZWQnLCBmaWVsZHM6IFsnZGVwYXJ0dXJlVGltZScsICd2ZXNzZWxOdW1iZXInXSB9XG4gICAgXVxuICB9LFxuICBbUHVyY2hhc2VPcmRlclN0YXR1cy5JTVBPUlRfREVMSVZFUlldOiB7XG4gICAgdGl0bGU6ICdJbXBvcnQgJiBEZWxpdmVyeScsXG4gICAgc3ViUHJvY2Vzc2VzOiBbXG4gICAgICB7IG5hbWU6ICdBcnJpdmFsIGF0IFBvcnQnLCBmaWVsZHM6IFsnYXJyaXZhbFRpbWUnLCAncG9ydCddIH0sXG4gICAgICB7IG5hbWU6ICdJbXBvcnQgRGVjbGFyYXRpb24nLCBmaWVsZHM6IFsnY3VzdG9tc0RvY3MnLCAnZHV0eUZlZXMnXSB9LFxuICAgICAgeyBuYW1lOiAnSW5zcGVjdGlvbicsIGZpZWxkczogWydpbnNwZWN0aW9uU3RhdHVzJ10gfSxcbiAgICAgIHsgbmFtZTogJ0N1c3RvbXMgUmVsZWFzZWQnLCBmaWVsZHM6IFsncmVsZWFzZVRpbWUnXSB9LFxuICAgICAgeyBuYW1lOiAnTG9jYWwgRGVsaXZlcnkgU2NoZWR1bGVkJywgZmllbGRzOiBbJ2RlbGl2ZXJ5VGltZScsICd2ZWhpY2xlSW5mbyddIH0sXG4gICAgICB7IG5hbWU6ICdEZWxpdmVyZWQgdG8gREMnLCBmaWVsZHM6IFsnc2lnblRpbWUnLCAncGhvdG9zJ10gfVxuICAgIF1cbiAgfSxcbiAgW1B1cmNoYXNlT3JkZXJTdGF0dXMuUkVDRUlWRURdOiB7XG4gICAgdGl0bGU6ICdSZWNlaXZlZCcsXG4gICAgc3ViUHJvY2Vzc2VzOiBbXG4gICAgICB7IG5hbWU6ICdHUk4gQ3JlYXRlZCcsIGZpZWxkczogWydncm5OdW1iZXInLCAnd2FyZWhvdXNlJ10gfSxcbiAgICAgIHsgbmFtZTogJ1F1YW50aXR5IENoZWNrZWQnLCBmaWVsZHM6IFsnYWN0dWFsUXR5JywgJ3BsYW5uZWRRdHknXSB9LFxuICAgICAgeyBuYW1lOiAnRXhjZXB0aW9uIEZsYWdnZWQnLCBmaWVsZHM6IFsnZXhjZXB0aW9ucycsICdkYW1hZ2VOb3RlcyddIH0sXG4gICAgICB7IG5hbWU6ICdHUk4gQ2xvc2VkJywgZmllbGRzOiBbJ2Nsb3NlVGltZScsICdvcGVyYXRvciddIH1cbiAgICBdXG4gIH0sXG4gIFtQdXJjaGFzZU9yZGVyU3RhdHVzLklOVk9JQ0VEXToge1xuICAgIHRpdGxlOiAnSW52b2ljZWQnLFxuICAgIHN1YlByb2Nlc3NlczogW1xuICAgICAgeyBuYW1lOiAnSW52b2ljZSBSZWNlaXZlZCcsIGZpZWxkczogWydpbnZvaWNlTnVtYmVyJywgJ2Ftb3VudCcsICd1cGxvYWRlciddIH0sXG4gICAgICB7IG5hbWU6ICdUaHJlZS1XYXkgTWF0Y2gnLCBmaWVsZHM6IFsnbWF0Y2hTdGF0dXMnLCAnZGlzY3JlcGFuY3knXSB9LFxuICAgICAgeyBuYW1lOiAnUGF5bWVudCBTY2hlZHVsZWQnLCBmaWVsZHM6IFsncGF5bWVudFBsYW4nLCAncGF5bWVudE1ldGhvZCddIH0sXG4gICAgICB7IG5hbWU6ICdQYXltZW50IENvbXBsZXRlZCcsIGZpZWxkczogWydwYXltZW50VGltZScsICd2b3VjaGVyJ10gfVxuICAgIF1cbiAgfVxufSAiLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxKYXluZVxcXFxEZXNrdG9wXFxcXFVOSVNcXFxcT01TXHU5ODc5XHU3NkVFXFxcXHNyY1xcXFxtb2NrXFxcXHB1cmNoYXNlVHJhY2tpbmcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSmF5bmVcXFxcRGVza3RvcFxcXFxVTklTXFxcXE9NU1x1OTg3OVx1NzZFRVxcXFxzcmNcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vQzovVXNlcnMvSmF5bmUvRGVza3RvcC9VTklTL09NUyVFOSVBMSVCOSVFNyU5QiVBRS9zcmMvbW9jay9wdXJjaGFzZVRyYWNraW5nLnRzXCI7aW1wb3J0IHsgUHVyY2hhc2VPcmRlclN0YXR1cywgUHVyY2hhc2VPcmRlclRyYWNraW5nIH0gZnJvbSAnQC92aWV3cy9wdXJjaGFzZS90cmFja2luZy90eXBlcydcblxuZXhwb3J0IGNvbnN0IG1vY2tUcmFja2luZ0xpc3Q6IFB1cmNoYXNlT3JkZXJUcmFja2luZ1tdID0gW1xuICB7XG4gICAgaWQ6ICcxJyxcbiAgICBwb051bWJlcjogJ1BPLTIwMjQtMDAxJyxcbiAgICBzdXBwbGllcjogJ1N1cHBsaWVyIEEnLFxuICAgIGNyZWF0ZWRBdDogJzIwMjQtMDEtMTVUMDg6MDA6MDBaJyxcbiAgICBleHBlY3RlZERlbGl2ZXJ5RGF0ZTogJzIwMjQtMDItMTVUMDg6MDA6MDBaJyxcbiAgICBjdXJyZW50U3RhdHVzOiBQdXJjaGFzZU9yZGVyU3RhdHVzLklOX1BST0RVQ1RJT04sXG4gICAgc3RhZ2VzOiBbXVxuICB9LFxuICB7XG4gICAgaWQ6ICcyJyxcbiAgICBwb051bWJlcjogJ1BPLTIwMjQtMDAyJyxcbiAgICBzdXBwbGllcjogJ1N1cHBsaWVyIEInLFxuICAgIGNyZWF0ZWRBdDogJzIwMjQtMDEtMjBUMDg6MDA6MDBaJyxcbiAgICBleHBlY3RlZERlbGl2ZXJ5RGF0ZTogJzIwMjQtMDItMjBUMDg6MDA6MDBaJyxcbiAgICBjdXJyZW50U3RhdHVzOiBQdXJjaGFzZU9yZGVyU3RhdHVzLlBPX0NPTkZJUk1FRCxcbiAgICBzdGFnZXM6IFtdXG4gIH1cbl1cblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlTW9ja1N0YWdlcyA9IChjdXJyZW50U3RhdHVzOiBQdXJjaGFzZU9yZGVyU3RhdHVzKSA9PiB7XG4gIGNvbnN0IHN0YXR1c2VzID0gT2JqZWN0LnZhbHVlcyhQdXJjaGFzZU9yZGVyU3RhdHVzKVxuICBjb25zdCBjdXJyZW50SW5kZXggPSBzdGF0dXNlcy5pbmRleE9mKGN1cnJlbnRTdGF0dXMpXG5cbiAgcmV0dXJuIHN0YXR1c2VzLm1hcCgoc3RhdHVzLCBpbmRleCkgPT4gKHtcbiAgICBzdGF0dXMsXG4gICAgdGl0bGU6IHN0YXR1cy5zcGxpdCgnXycpLm1hcCh3b3JkID0+IFxuICAgICAgd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSkudG9Mb3dlckNhc2UoKVxuICAgICkuam9pbignICcpLFxuICAgIHN1YlByb2Nlc3NlczogQXJyYXkoNCkuZmlsbChudWxsKS5tYXAoKF8sIGkpID0+ICh7XG4gICAgICBuYW1lOiBgUHJvY2VzcyAke2kgKyAxfWAsXG4gICAgICBzdGF0dXM6IGluZGV4IDwgY3VycmVudEluZGV4ID8gJ2NvbXBsZXRlZCcgOiBcbiAgICAgICAgICAgICAgaW5kZXggPT09IGN1cnJlbnRJbmRleCA/IChpID09PSAwID8gJ2NvbXBsZXRlZCcgOiBpID09PSAxID8gJ2luX3Byb2dyZXNzJyA6ICdwZW5kaW5nJykgOiBcbiAgICAgICAgICAgICAgJ3BlbmRpbmcnLFxuICAgICAgdGltZXN0YW1wOiBpbmRleCA8IGN1cnJlbnRJbmRleCA/IG5ldyBEYXRlKERhdGUubm93KCkgLSAoaW5kZXggKiAyNCAqIDYwICogNjAgKiAxMDAwKSkudG9JU09TdHJpbmcoKSA6IHVuZGVmaW5lZCxcbiAgICAgIG9wZXJhdG9yOiBpbmRleCA8IGN1cnJlbnRJbmRleCA/ICdKb2huIERvZScgOiB1bmRlZmluZWQsXG4gICAgICBmaWVsZHM6IHt9XG4gICAgfSkpLFxuICAgIGNvbXBsZXRlZDogaW5kZXggPCBjdXJyZW50SW5kZXgsXG4gICAgY3VycmVudDogaW5kZXggPT09IGN1cnJlbnRJbmRleFxuICB9KSlcbn1cblxuZXhwb3J0IGNvbnN0IG1vY2tUcmFja2luZ0RldGFpbCA9IChpZDogc3RyaW5nKTogUHVyY2hhc2VPcmRlclRyYWNraW5nID0+IHtcbiAgY29uc3QgaXRlbSA9IG1vY2tUcmFja2luZ0xpc3QuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IGlkKVxuICBpZiAoIWl0ZW0pIHRocm93IG5ldyBFcnJvcignTm90IGZvdW5kJylcblxuICByZXR1cm4ge1xuICAgIC4uLml0ZW0sXG4gICAgc3RhZ2VzOiBnZW5lcmF0ZU1vY2tTdGFnZXMoaXRlbS5jdXJyZW50U3RhdHVzKVxuICB9XG59ICIsICJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXEpheW5lXFxcXERlc2t0b3BcXFxcVU5JU1xcXFxPTVNcdTk4NzlcdTc2RUVcXFxcc3JjXFxcXG1vY2tcXFxccHJvZHVjdERhdGEudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSmF5bmVcXFxcRGVza3RvcFxcXFxVTklTXFxcXE9NU1x1OTg3OVx1NzZFRVxcXFxzcmNcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vQzovVXNlcnMvSmF5bmUvRGVza3RvcC9VTklTL09NUyVFOSVBMSVCOSVFNyU5QiVBRS9zcmMvbW9jay9wcm9kdWN0RGF0YS50c1wiO2ltcG9ydCB0eXBlIHsgUHJvZHVjdCB9IGZyb20gJ0AvdHlwZXMvcHJvZHVjdCc7XG5cbmV4cG9ydCBjb25zdCBtb2NrUHJvZHVjdHM6IFByb2R1Y3RbXSA9IFtcbiAge1xuICAgIGlkOiAnMScsXG4gICAgc2t1OiAnU0tVMDAxJyxcbiAgICBuYW1lOiAnXHU2RDRCXHU4QkQ1XHU1NTQ2XHU1NEMxMScsXG4gICAgdHlwZTogJ05vcm1hbCcsXG4gICAgc3RhdHVzOiAnQWN0aXZlJyxcbiAgICB2ZW5kb3I6ICdcdTRGOUJcdTVFOTRcdTU1NDZBJyxcbiAgICBicmFuZDogJ1x1NTRDMVx1NzI0Q0EnLFxuICAgIG1hbnVmYWN0dXJlcjogJ1x1NTIzNlx1OTAyMFx1NTU0NkEnLFxuICAgIGNvc3Q6IDEwMC4wMCxcbiAgICByZWd1bGFyUHJpY2U6IDE5OS45OSxcbiAgICBzYWxlUHJpY2U6IDE1OS45OSxcbiAgICBxdWFudGl0eTogMTAwLFxuICAgIGRvTm90VHJhY2tJbnZlbnRvcnk6IGZhbHNlLFxuICAgIGNhdGVnb3JpZXM6IFsnXHU3NTM1XHU1QjUwXHU0RUE3XHU1NEMxJywgJ1x1NjI0Qlx1NjczQVx1OTE0RFx1NEVGNiddLFxuICAgIHRhZ3M6IFsnXHU3MEVEXHU5NTAwJywgJ1x1NjVCMFx1NTRDMSddLFxuICAgIGludGVncmF0aW9uOiAnU2hvcGlmeScsXG4gICAgd2VpZ2h0OiAwLjUsXG4gICAgd2VpZ2h0VW5pdDogJ2tnJyxcbiAgICBkaW1lbnNpb25zOiB7XG4gICAgICBsZW5ndGg6IDEwLFxuICAgICAgd2lkdGg6IDUsXG4gICAgICBoZWlnaHQ6IDIsXG4gICAgICB1bml0OiAnY20nXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1NkQ0Qlx1OEJENVx1NTU0Nlx1NTRDMVx1NzY4NFx1OEJFNlx1N0VDNlx1NjNDRlx1OEZGMCcsXG4gICAgc2hvcnREZXNjcmlwdGlvbjogJ1x1NkQ0Qlx1OEJENVx1NTU0Nlx1NTRDMVx1N0I4MFx1NEVDQicsXG4gICAgaW1hZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2UxLmpwZycsXG4gICAgICAgIGFsdDogJ1x1NTU0Nlx1NTRDMVx1NEUzQlx1NTZGRScsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZVxuICAgICAgfVxuICAgIF0sXG4gICAgY3JlYXRlZDogJzIwMjQtMDMtMjBUMTA6MDA6MDBaJyxcbiAgICB1cGRhdGVkOiAnMjAyNC0wMy0yMFQxNTozMDowMFonXG4gIH0sXG4gIHtcbiAgICBpZDogJzInLFxuICAgIHNrdTogJ1NLVTAwMicsXG4gICAgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NTU0Nlx1NTRDMTInLFxuICAgIHR5cGU6ICdTYW1wbGUnLFxuICAgIHN0YXR1czogJ0RyYWZ0JyxcbiAgICB2ZW5kb3I6ICdcdTRGOUJcdTVFOTRcdTU1NDZCJyxcbiAgICBicmFuZDogJ1x1NTRDMVx1NzI0Q0InLFxuICAgIG1hbnVmYWN0dXJlcjogJ1x1NTIzNlx1OTAyMFx1NTU0NkInLFxuICAgIGNvc3Q6IDUwLjAwLFxuICAgIHJlZ3VsYXJQcmljZTogOTkuOTksXG4gICAgc2FsZVByaWNlOiA3OS45OSxcbiAgICBxdWFudGl0eTogNTAsXG4gICAgZG9Ob3RUcmFja0ludmVudG9yeTogdHJ1ZSxcbiAgICBjYXRlZ29yaWVzOiBbJ1x1NjcwRFx1ODhDNScsICdcdTkxNERcdTk5NzAnXSxcbiAgICB0YWdzOiBbJ1x1NjgzN1x1NTRDMScsICdcdTk2NTBcdTkxQ0YnXSxcbiAgICBpbnRlZ3JhdGlvbjogJ0FtYXpvbicsXG4gICAgd2VpZ2h0OiAwLjMsXG4gICAgd2VpZ2h0VW5pdDogJ2tnJyxcbiAgICBkaW1lbnNpb25zOiB7XG4gICAgICBsZW5ndGg6IDIwLFxuICAgICAgd2lkdGg6IDE1LFxuICAgICAgaGVpZ2h0OiA1LFxuICAgICAgdW5pdDogJ2NtJ1xuICAgIH0sXG4gICAgZGVzY3JpcHRpb246ICdcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTY4MzdcdTU0QzFcdTU1NDZcdTU0QzFcdTc2ODRcdThCRTZcdTdFQzZcdTYzQ0ZcdThGRjAnLFxuICAgIHNob3J0RGVzY3JpcHRpb246ICdcdTY4MzdcdTU0QzFcdTU1NDZcdTU0QzFcdTdCODBcdTRFQ0InLFxuICAgIGltYWdlczogW1xuICAgICAge1xuICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlMi5qcGcnLFxuICAgICAgICBhbHQ6ICdcdTY4MzdcdTU0QzFcdTRFM0JcdTU2RkUnLFxuICAgICAgICBpc0RlZmF1bHQ6IHRydWVcbiAgICAgIH1cbiAgICBdLFxuICAgIGNyZWF0ZWQ6ICcyMDI0LTAzLTE5VDA4OjAwOjAwWicsXG4gICAgdXBkYXRlZDogJzIwMjQtMDMtMTlUMTY6NDU6MDBaJ1xuICB9LFxuICB7XG4gICAgaWQ6ICczJyxcbiAgICBza3U6ICdTS1UwMDMnLFxuICAgIG5hbWU6ICdcdTZENEJcdThCRDVcdTU1NDZcdTU0QzEzJyxcbiAgICB0eXBlOiAnQnVuZGxlJyxcbiAgICBzdGF0dXM6ICdBY3RpdmUnLFxuICAgIHZlbmRvcjogJ1x1NEY5Qlx1NUU5NFx1NTU0NkMnLFxuICAgIGJyYW5kOiAnXHU1NEMxXHU3MjRDQycsXG4gICAgbWFudWZhY3R1cmVyOiAnXHU1MjM2XHU5MDIwXHU1NTQ2QycsXG4gICAgY29zdDogMjAwLjAwLFxuICAgIHJlZ3VsYXJQcmljZTogMzk5Ljk5LFxuICAgIHNhbGVQcmljZTogMjk5Ljk5LFxuICAgIHF1YW50aXR5OiAzMCxcbiAgICBkb05vdFRyYWNrSW52ZW50b3J5OiBmYWxzZSxcbiAgICBjYXRlZ29yaWVzOiBbJ1x1NTk1N1x1ODhDNScsICdcdTc5M0NcdTU0QzEnXSxcbiAgICB0YWdzOiBbJ1x1NEZDM1x1OTUwMCcsICdcdTU5NTdcdTg4QzUnXSxcbiAgICBpbnRlZ3JhdGlvbjogJ2VCYXknLFxuICAgIHdlaWdodDogMS4yLFxuICAgIHdlaWdodFVuaXQ6ICdrZycsXG4gICAgZGltZW5zaW9uczoge1xuICAgICAgbGVuZ3RoOiAzMCxcbiAgICAgIHdpZHRoOiAyMCxcbiAgICAgIGhlaWdodDogMTUsXG4gICAgICB1bml0OiAnY20nXG4gICAgfSxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1NTk1N1x1ODhDNVx1NTU0Nlx1NTRDMVx1NzY4NFx1OEJFNlx1N0VDNlx1NjNDRlx1OEZGMCcsXG4gICAgc2hvcnREZXNjcmlwdGlvbjogJ1x1NTk1N1x1ODhDNVx1NTU0Nlx1NTRDMVx1N0I4MFx1NEVDQicsXG4gICAgaW1hZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2UzLmpwZycsXG4gICAgICAgIGFsdDogJ1x1NTk1N1x1ODhDNVx1NEUzQlx1NTZGRScsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZVxuICAgICAgfVxuICAgIF0sXG4gICAgY3JlYXRlZDogJzIwMjQtMDMtMThUMDk6MzA6MDBaJyxcbiAgICB1cGRhdGVkOiAnMjAyNC0wMy0xOFQxNDoyMDowMFonXG4gIH0sXG4gIHtcbiAgICBpZDogJzQnLFxuICAgIHNrdTogJ1NLVTAwNCcsXG4gICAgbmFtZTogJ1x1NkQ0Qlx1OEJENVx1NTU0Nlx1NTRDMTQnLFxuICAgIHR5cGU6ICdWaXJ0dWFsJyxcbiAgICBzdGF0dXM6ICdPdXRfT2ZfU3RvY2snLFxuICAgIHZlbmRvcjogJ1x1NEY5Qlx1NUU5NFx1NTU0NkQnLFxuICAgIGJyYW5kOiAnXHU1NEMxXHU3MjRDRCcsXG4gICAgbWFudWZhY3R1cmVyOiAnXHU1MjM2XHU5MDIwXHU1NTQ2RCcsXG4gICAgY29zdDogMTAuMDAsXG4gICAgcmVndWxhclByaWNlOiAyOS45OSxcbiAgICBzYWxlUHJpY2U6IDE5Ljk5LFxuICAgIHF1YW50aXR5OiAwLFxuICAgIGRvTm90VHJhY2tJbnZlbnRvcnk6IHRydWUsXG4gICAgY2F0ZWdvcmllczogWydcdTY1NzBcdTVCNTdcdTRFQTdcdTU0QzEnLCAnXHU4RjZGXHU0RUY2J10sXG4gICAgdGFnczogWydcdTg2NUFcdTYyREYnLCAnXHU0RTBCXHU4RjdEJ10sXG4gICAgaW50ZWdyYXRpb246ICdTaG9waWZ5JyxcbiAgICB3ZWlnaHQ6IDAsXG4gICAgd2VpZ2h0VW5pdDogJ2tnJyxcbiAgICBkZXNjcmlwdGlvbjogJ1x1OEZEOVx1NjYyRlx1NEUwMFx1NEUyQVx1ODY1QVx1NjJERlx1NTU0Nlx1NTRDMVx1NzY4NFx1OEJFNlx1N0VDNlx1NjNDRlx1OEZGMCcsXG4gICAgc2hvcnREZXNjcmlwdGlvbjogJ1x1ODY1QVx1NjJERlx1NTU0Nlx1NTRDMVx1N0I4MFx1NEVDQicsXG4gICAgaW1hZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2U0LmpwZycsXG4gICAgICAgIGFsdDogJ1x1ODY1QVx1NjJERlx1NTU0Nlx1NTRDMVx1NEUzQlx1NTZGRScsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZVxuICAgICAgfVxuICAgIF0sXG4gICAgY3JlYXRlZDogJzIwMjQtMDMtMTdUMTE6MjA6MDBaJyxcbiAgICB1cGRhdGVkOiAnMjAyNC0wMy0xN1QxODoxNTowMFonXG4gIH1cbl07XG5cbi8vIFx1NkEyMVx1NjJERlx1NEY5Qlx1NUU5NFx1NTU0Nlx1NTIxN1x1ODg2OFxuZXhwb3J0IGNvbnN0IG1vY2tWZW5kb3JzID0gWydcdTRGOUJcdTVFOTRcdTU1NDZBJywgJ1x1NEY5Qlx1NUU5NFx1NTU0NkInLCAnXHU0RjlCXHU1RTk0XHU1NTQ2QycsICdcdTRGOUJcdTVFOTRcdTU1NDZEJywgJ1x1NEY5Qlx1NUU5NFx1NTU0NkUnXTtcblxuLy8gXHU2QTIxXHU2MkRGXHU1NEMxXHU3MjRDXHU1MjE3XHU4ODY4XG5leHBvcnQgY29uc3QgbW9ja0JyYW5kcyA9IFsnXHU1NEMxXHU3MjRDQScsICdcdTU0QzFcdTcyNENCJywgJ1x1NTRDMVx1NzI0Q0MnLCAnXHU1NEMxXHU3MjRDRCcsICdcdTU0QzFcdTcyNENFJ107XG5cbi8vIFx1NkEyMVx1NjJERlx1ODNCN1x1NTNENlx1NEVBN1x1NTRDMVx1NTIxN1x1ODg2OFx1NzY4NEFQSVx1NTRDRFx1NUU5NFxuZXhwb3J0IGNvbnN0IGdldE1vY2tQcm9kdWN0cyA9IChwYXJhbXM6IHtcbiAgcGFnZTogbnVtYmVyO1xuICBwYWdlU2l6ZTogbnVtYmVyO1xuICBzZWFyY2g/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIGludGVncmF0aW9uPzogc3RyaW5nO1xufSkgPT4ge1xuICBsZXQgZmlsdGVyZWRQcm9kdWN0cyA9IFsuLi5tb2NrUHJvZHVjdHNdO1xuXG4gIC8vIFx1NjQxQ1x1N0QyMlx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zLnNlYXJjaCkge1xuICAgIGNvbnN0IHNlYXJjaExvd2VyID0gcGFyYW1zLnNlYXJjaC50b0xvd2VyQ2FzZSgpO1xuICAgIGZpbHRlcmVkUHJvZHVjdHMgPSBmaWx0ZXJlZFByb2R1Y3RzLmZpbHRlcihcbiAgICAgIHByb2R1Y3QgPT5cbiAgICAgICAgcHJvZHVjdC5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoTG93ZXIpIHx8XG4gICAgICAgIHByb2R1Y3Quc2t1LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoTG93ZXIpIHx8XG4gICAgICAgIHByb2R1Y3QudmVuZG9yPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaExvd2VyKVxuICAgICk7XG4gIH1cblxuICAvLyBcdTdDN0JcdTU3OEJcdThGQzdcdTZFRTRcbiAgaWYgKHBhcmFtcy50eXBlKSB7XG4gICAgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlcmVkUHJvZHVjdHMuZmlsdGVyKFxuICAgICAgcHJvZHVjdCA9PiBwcm9kdWN0LnR5cGUgPT09IHBhcmFtcy50eXBlXG4gICAgKTtcbiAgfVxuXG4gIC8vIFx1OTZDNlx1NjIxMFx1OEZDN1x1NkVFNFxuICBpZiAocGFyYW1zLmludGVncmF0aW9uKSB7XG4gICAgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlcmVkUHJvZHVjdHMuZmlsdGVyKFxuICAgICAgcHJvZHVjdCA9PiBwcm9kdWN0LmludGVncmF0aW9uID09PSBwYXJhbXMuaW50ZWdyYXRpb25cbiAgICApO1xuICB9XG5cbiAgLy8gXHU4QkExXHU3Qjk3XHU1MjA2XHU5ODc1XG4gIGNvbnN0IHN0YXJ0ID0gKHBhcmFtcy5wYWdlIC0gMSkgKiBwYXJhbXMucGFnZVNpemU7XG4gIGNvbnN0IGVuZCA9IHN0YXJ0ICsgcGFyYW1zLnBhZ2VTaXplO1xuICBjb25zdCBwYWdpbmF0ZWRQcm9kdWN0cyA9IGZpbHRlcmVkUHJvZHVjdHMuc2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgZGF0YTogcGFnaW5hdGVkUHJvZHVjdHMsXG4gICAgdG90YWw6IGZpbHRlcmVkUHJvZHVjdHMubGVuZ3RoXG4gIH07XG59O1xuXG4vLyBcdTZBMjFcdTYyREZcdTUyMjBcdTk2NjRcdTRFQTdcdTU0QzFcdTc2ODRBUElcbmV4cG9ydCBjb25zdCBtb2NrRGVsZXRlUHJvZHVjdCA9IGFzeW5jIChpZDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGluZGV4ID0gbW9ja1Byb2R1Y3RzLmZpbmRJbmRleChwID0+IHAuaWQgPT09IGlkKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIG1vY2tQcm9kdWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignUHJvZHVjdCBub3QgZm91bmQnKTtcbn07Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUyxPQUFPLFdBQVc7QUFDbFQsU0FBUyxpQkFBaUI7QUNFbkIsSUFBTSxZQUF3QjtFQUNuQyxFQUFFLElBQUksT0FBTyxNQUFNLDRCQUFRLE1BQU0sTUFBTTtFQUN2QyxFQUFFLElBQUksT0FBTyxNQUFNLDRCQUFRLE1BQU0sTUFBTTtFQUN2QyxFQUFFLElBQUksT0FBTyxNQUFNLHdDQUFVLE1BQU0sTUFBTTtFQUN6QyxFQUFFLElBQUksT0FBTyxNQUFNLGtDQUFTLE1BQU0sTUFBTTtFQUN4QyxFQUFFLElBQUksT0FBTyxNQUFNLGtDQUFTLE1BQU0sTUFBTTtBQUMxQztBQUdPLElBQU0sYUFBd0M7RUFDbkQsS0FBSztJQUNILEVBQUUsSUFBSSxVQUFVLE1BQU0sVUFBVSxNQUFNLE9BQU8sTUFBTSxjQUFjO0lBQ2pFLEVBQUUsSUFBSSxXQUFXLE1BQU0sV0FBVyxNQUFNLE9B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LFNBQVMsT0FBTyxLQUFLO0FBQzNCLFlBQU0sTUFBTSxRQUFRO0FBRXBCLGFBQU87UUFDTCxNQUFNO1FBQ04sTUFBTTtVQUNKLE9BQU8saUJBQWlCO1VBQ3hCLE9BQU8saUJBQWlCLE1BQU0sT0FBTyxHQUFHO1FBQzFDO01BQ0Y7SUFDRjtFQUNGO0VBQ0E7SUFDRSxLQUFLO0lBQ0wsUUFBUTtJQUNSLFVBQVUsQ0FBQyxFQUFFLE9BQU8sTUFBTTtBQUN4QixVQUFJO0FBQ0YsY0FBTSxPQUFPLG1CQUFtQixPQUFPLEVBQUU7QUFDekMsZUFBTztVQUNMLE1BQU07VUFDTjtRQUNGO01BQ0YsU0FBUyxPQUFPO0FBQ2QsZUFBTztVQUNMLE1BQU07VUFDTixTQUFTO1FBQ1g7TUFDRjtJQUNGO0VBQ0Y7RUFDQTtJQUNFLEtBQUs7SUFDTCxRQUFRO0lBQ1IsVUFBVSxDQUFDLEVBQUUsT0FBTyxNQUFNO0FBQ3hCLGFBQU87UUFDTCxNQUFNO1FBQ04sTUFBTSxtQkFBbUIsT0FBTyxFQUFFO01BQ3BDO0lBQ0Y7RUFDRjtBQUNGO0FBRUEsSUFBTyxlQUFROyIsCiAgIm5hbWVzIjogWyJQdXJjaGFzZU9yZGVyU3RhdHVzIiwgIml0ZW0iXQp9Cg==
