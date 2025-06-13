// 订单状态类型
export type OrderStatus = 'shipped' | 'in_transit' | 'delivered' | 'exception';

// 订单来源类型
export type OrderSource = 'shopify' | 'amazon' | 'ebay' | 'walmart';

// 运输方式类型
export type ShipmentType = 'small-parcel' | 'ltl' | 'ftl';

// 状态标签类型
export type StatusTagType = 'success' | 'warning' | 'danger' | 'info';

// 状态映射
export const statusMap: Record<OrderStatus, string> = {
  shipped: '已发货',
  in_transit: '运输中',
  delivered: '已送达',
  exception: '异常'
};

// 来源映射
export const sourceMap: Record<OrderSource, string> = {
  shopify: 'Shopify',
  amazon: 'Amazon',
  ebay: 'eBay',
  walmart: 'Walmart'
};

// 运输方式映射
export const shipmentTypeMap: Record<ShipmentType, string> = {
  'small-parcel': '小包裹',
  'ltl': '零担',
  'ftl': '整车'
};

// 状态标签映射
export const statusTagMap: Record<OrderStatus, StatusTagType> = {
  shipped: 'info',
  in_transit: 'warning',
  delivered: 'success',
  exception: 'danger'
};

// 获取映射值的类型
export type StatusMapValue = typeof statusMap[OrderStatus];
export type SourceMapValue = typeof sourceMap[OrderSource];
export type ShipmentTypeMapValue = typeof shipmentTypeMap[ShipmentType];

// 订单搜索表单类型
export interface OrderSearchForm {
  orderNo: string;
  status: OrderStatus | '';
  source: OrderSource | '';
  dateRange: [Date | null, Date | null] | null;
  shipmentType: ShipmentType | '';
}

// 订单列表项类型
export interface OrderListItem {
  id: string;
  orderNo: string;
  status: OrderStatus;
  source: OrderSource;
  shipmentType: ShipmentType;
  createTime: string;
  updateTime: string;
  estimatedDeliveryTime: string;
  recipientName: string;
  recipientAddress: string;
  trackingNumber: string;
}

// AI追踪相关类型
export interface AITrackingResponse {
  orderNo: string;
  status: OrderStatus;
  source: OrderSource;
  createTime: string;
  updateTime: string;
  eta: string;
  confidence: number;
  packages: PackageInfo[];
  trackingEvents: TrackingEvent[];
  prediction: {
    estimatedDeliveryTime: string;
    delayProbability: number;
    suggestedActions: string[];
  };
  analysis: {
    routeOptimization: string;
    weatherImpact: string;
    trafficConditions: string;
    historicalPerformance: string;
  };
}

// 包裹信息类型
export interface PackageInfo {
  id: string;
  packageNo: string;
  status: OrderStatus;
  type: ShipmentType;
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryTime: string;
  weight: number;
  dimensions: string;
  currentLocation: {
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  routeInfo: {
    origin: string;
    destination: string;
    currentStop: string;
    nextStop: string;
    remainingStops: number;
  };
}

// 追踪事件类型
export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  time: string;
  location: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  weatherConditions?: {
    temperature: number;
    condition: string;
    impact: 'none' | 'low' | 'medium' | 'high';
  };
  trafficConditions?: {
    congestion: 'low' | 'medium' | 'high';
    delay: number;
  };
} 