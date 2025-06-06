export enum OrderStatus {
  // 主要状态
  Imported = 'Imported',
  Allocated = 'Allocated',
  'Warehouse Processing' = 'Warehouse Processing',
  Shipped = 'Shipped',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Completed = 'Completed',

  // 动态状态
  Pending = 'Pending',           // 待处理（通常在Imported后）
  Exception = 'Exception',       // 异常（可出现在多个节点之间）
  Deallocated = 'Deallocated',   // 取消分配（在Allocated后）
  Cancelling = 'Cancelling',     // 取消中（可出现在前三个主要节点之间）
  Canceled = 'Canceled'          // 已取消（通常在Cancelling后）
}

// 动态节点配置接口
export interface DynamicNodeConfig {
  status: OrderStatus;
  position: 'beforeAllocated' | 'afterAllocated' | 'afterPending' | 'beforeWarehouse' | 'afterWarehouse';
  reason?: string;
  time?: string;
}

export interface OrderStatusTime {
  [key in OrderStatus]?: string;
} 