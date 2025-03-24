# Inventory 业务指南

## 目录
1. [业务概述](#业务概述)
2. [数据结构](#数据结构)
3. [库存同步规则](#库存同步规则)
4. [库存计算规则](#库存计算规则)
5. [渠道映射规则](#渠道映射规则)
6. [UI 交互说明](#UI交互说明)
7. [API 接口说明](#API接口说明)

## 业务概述

### 功能定位
Inventory 模块是一个多仓库、多渠道的库存管理系统，支持：
- 多仓库库存实时查询
- 渠道库存同步
- 在途库存管理
- SKU 渠道映射

### 核心特性
1. 支持多个 WMS 系统对接（WMS V1、WMS V2、Other WMS）
2. 支持多渠道 SKU 映射（Shopify、Amazon、eBay、Walmart 等）
3. 提供实时库存查询和同步功能
4. 支持在途库存管理和预测

## 数据结构

### 渠道分配（ChannelAllocation）
```typescript
interface ChannelAllocation {
  channel: string
  percentage: number
  quantity: number
}
```

### 库存项（InventoryItem）
```typescript
interface InventoryItem {
  sku: string
  channelSkus: {
    channel: string
    sku: string
    allocation?: ChannelAllocation
  }[]
  warehouses: WarehouseStock[]
  lastSync?: string
  syncEnabled: boolean  // 是否启用同步
}
```

### 仓库库存（WarehouseStock）
```typescript
interface WarehouseStock {
  id: string
  name: string
  code: string
  system: 'wms_v1' | 'wms_v2' | 'other'
  availableStock: number
  lockedStock: number
  damagedStock: number
  inTransitStock: number
  inTransitDetails?: {
    poNumber: string
    quantity: number
    eta: string
  }[]
}
```

## 库存同步规则

### 同步控制
1. **SKU 级别控制**
   - 每个 SKU 可独立控制是否参与同步
   - 通过开关按钮快速切换同步状态
   - 禁用同步的 SKU 将不会被同步到渠道

2. **同步状态显示**
   - SKU 列显示同步状态图标
   - Channel SKU 列显示禁用提示
   - Actions 列提供同步开关控制

### 同步触发条件
1. 手动触发：用户点击"Sync to Channel"按钮
2. 自动触发：
   - 库存变更超过阈值（±20%）
   - 定时任务（每4小时）
   - 新建 PO 入库

### 同步流程
1. **预处理**
   - 检查仓库连接状态
   - 验证渠道授权状态
   - 获取最后同步时间

2. **数据获取**
   - 从各 WMS 系统获取最新库存数据
   - 合并多仓库数据
   - 计算在途库存

3. **渠道更新**
   - 根据 SKU 映射关系转换数据
   - 按渠道分组库存数据
   - 批量更新渠道库存

4. **结果处理**
   - 记录同步日志
   - 更新同步时间
   - 返回同步结果

### 错误处理
- 同步失败重试机制（最多3次）
- 失败项记录并展示
- 异常通知相关人员

## 库存计算规则

### 可用库存计算
```
可用库存 = 实际库存 - 锁定库存 - 损坏库存
```

### 在途库存计算
```
在途库存 = Sum(未到货PO数量)
预计可用库存 = 可用库存 + 在途库存
```

### 渠道库存分配计算
```typescript
// 计算总可用库存
const totalAvailable = sum(warehouses.map(w => w.availableStock))

// 计算渠道分配库存
const channelStock = Math.floor(totalAvailable * (percentage / 100))
```

### 分配规则
1. **基础规则**
   - 分配比例之和必须等于 100%
   - 分配数量向下取整
   - 基于总可用库存计算

2. **动态更新**
   - 库存变化时自动重新计算
   - 保持分配比例不变
   - 实时更新分配数量

3. **显示规则**
   - 直接显示分配数量
   - 悬浮显示比例信息
   - 使用等宽字体确保数字对齐

### 库存预警规则
1. **低库存预警**
   - 可用库存 < 安全库存
   - 预计可用天数 < 15天

2. **高库存预警**
   - 可用库存 > 最大库存
   - 库存周转天数 > 90天

3. **库存异常预警**
   - 实际库存 < 锁定库存
   - 损坏库存占比 > 5%

## 渠道映射规则

### SKU 映射类型
1. **一对一映射**
   - 原始 SKU -> 单个渠道 SKU
   - 适用于标准产品

2. **一对多映射**
   - 原始 SKU -> 多个渠道 SKU
   - 适用于不同渠道有不同命名规则的情况

3. **变体映射**
   - 原始 SKU + 变体 -> 渠道 SKU
   - 适用于颜色、尺寸等变体产品

### 映射优先级
1. 精确匹配：完全匹配 SKU 编码
2. 前缀匹配：匹配 SKU 前缀规则
3. 规则匹配：根据映射规则转换
4. 默认映射：使用默认规则

## UI 交互说明

### 库存展示
1. **表格布局**
   - SKU 列：
     * 显示商品 SKU 编码
     * 显示同步禁用图标（红色）
   - Channel SKU 列：
     * 显示渠道 SKU 和分配库存
     * 显示同步禁用提示（禁用时）
   - Actions 列：
     * 同步状态开关
     * 快速切换同步启用/禁用
   - 仓库列：每个仓库的库存状态（可用、锁定、损坏、在途）
   - 汇总列：总可用、总锁定、总损坏库存
   - 最后同步时间列

2. **渠道 SKU 显示**
   - 格式：`渠道SKU (分配库存数量)`
   - 示例：`SHOP-001 (90)`
   - 使用不同颜色标签区分渠道：
     * Shopify：默认灰色
     * Amazon：绿色
     * eBay：黄色
     * Walmart：蓝色
   - 悬浮提示显示详细信息：
     * 渠道名称
     * 分配数量和百分比

3. **仓库库存显示**
   - 仓库标题显示：
     * 仓库名称
     * 仓库代码
     * WMS 系统类型标签
   - 库存类型分列显示：
     * Available（绿色）
     * Locked（黄色）
     * Damaged（红色）
     * In Transit（灰色）
   - 在途库存支持悬浮显示详情：
     * PO 编号
     * 数量
     * 预计到货日期
     * 剩余天数

### 搜索功能
1. **搜索条件**
   - SKU：支持模糊匹配
   - Channel SKU：支持跨渠道搜索
   - Warehouse Code：按仓库代码筛选
   - WMS System：按系统类型筛选
   - Stock Type：按库存类型筛选

2. **搜索结果**
   - 实时更新库存数据
   - 自动重新计算渠道分配数量
   - 支持分页显示

### 同步功能
1. **同步操作**
   - 点击"Sync to Channel"触发同步
   - 仅同步启用了同步的 SKU
   - 显示同步进度
   - 支持批量同步

2. **同步结果展示**
   - 成功/警告状态图标
   - 同步成功/失败数量统计
   - 失败项目详细列表
   - 支持导出同步报告

## API 接口说明

### 库存查询接口
```typescript
GET /api/v1/inventory
请求参数：
{
  sku?: string
  channelSku?: string
  warehouseCode?: string
  wmsSystem?: string
  page: number
  pageSize: number
}

响应数据：
{
  total: number
  items: InventoryItem[]
}
```

### 库存同步接口
```typescript
POST /api/v1/inventory/sync
请求参数：
{
  warehouseCode: string
  skus?: string[]
  channels?: string[]
}

响应数据：
{
  success: boolean
  totalItems: number
  syncedItems: number
  failedItems: string[]
}
```

### 在途库存查询接口
```typescript
GET /api/v1/inventory/in-transit
请求参数：
{
  sku?: string
  warehouseCode?: string
  startDate?: string
  endDate?: string
}

响应数据：
{
  items: {
    sku: string
    poNumber: string
    quantity: number
    eta: string
  }[]
}
```

### 渠道分配更新接口
```typescript
POST /api/v1/inventory/channel-allocation
请求参数：
{
  sku: string
  allocations: {
    channel: string
    percentage: number
  }[]
}

响应数据：
{
  success: boolean
  sku: string
  allocations: ChannelAllocation[]
}
```

### 渠道库存查询接口
```typescript
GET /api/v1/inventory/channel-stock
请求参数：
{
  sku?: string
  channel?: string
  page: number
  pageSize: number
}

响应数据：
{
  total: number
  items: {
    sku: string
    channel: string
    allocation: ChannelAllocation
    availableStock: number
    lastSync: string
  }[]
}
```

### 同步状态更新接口
```typescript
POST /api/v1/inventory/sync-status
请求参数：
{
  sku: string
  syncEnabled: boolean
}

响应数据：
{
  success: boolean
  sku: string
  syncEnabled: boolean
}
```

### 错误码说明
- 4001: 参数验证失败
- 4002: SKU 不存在
- 4003: 仓库连接失败
- 4004: 渠道授权失败
- 4005: 同步状态更新失败
- 5001: 系统内部错误
- 5002: 同步超时 