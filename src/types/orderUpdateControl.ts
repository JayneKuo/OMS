export interface OrderUpdateControlConfig {
  // 订单是否允许更新总开关
  orderUpdateEnabled: boolean;
  
  // 允许更新的订单来源
  allowedUpdateSource: string[];
  
  // 允许更新的订单状态
  allowedUpdateStatuses: string[];
  
  // 订单状态为warehouseprocessing时的dispatch order状态
  dispatchOrder: string;
  
  // 是否允许异常订单更新
  exceptionUpdatable: boolean;
  
  // 新增商品品类是否单下发
  dispatchForNewLineItems: boolean;
  
  // 新增商品数量是否单独下发
  allowIncreaseQuantityForDispatchedItems: boolean;
  
  // 是否将换货商品单独派单
  dispatchForReplacementItems: boolean;
}

export const ORDER_SOURCES = ['all', 'shopify', 'amazon', 'ebay', 'walmart'] as const;
export const ORDER_STATUSES = ['import', 'pending', 'warehouseprocessing'] as const;
export const DISPATCH_ORDER_STATUSES = ['allocate', 'pick', 'pack'] as const; 