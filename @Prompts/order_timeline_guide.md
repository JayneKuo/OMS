# OMS订单时间轴节点文档 (Order Timeline Node Documentation)

## 1. 订单创建阶段 (Order Creation Phase)

### 1.1 DI导入 (DI Import)
- 状态：`Imported` / `已导入`
- 图标：`Plus`
- 描述：
  - 中文：`通过 {渠道名} 拉单自动创建订单`
  - 英文：`Order imported from {Channel} automatically`
- 附加信息：
  ```json
  {
    "sourceChannel": "渠道名称",
    "channelOrderId": "渠道订单号",
    "importMethod": "导入方式(API_PULL/手动导入)",
    "customerId": "客户ID",
    "customerEmail": "客户邮箱",
    "orderAmount": "订单金额",
    "itemCount": "商品数量",
    "importTime": "导入时间",
    "channelType": "渠道类型"
  }
  ```

### 1.2 OMS创建 (OMS Creation)
- 状态：`Created` / `已创建`
- 图标：`Plus`
- 描述：
  - 中文：`OMS系统创建订单成功`
  - 英文：`Order created successfully in OMS`
- 附加信息：
  ```json
  {
    "omsOrderId": "OMS订单号",
    "createTime": "创建时间",
    "orderType": "订单类型",
    "priority": "订单优先级",
    "customerInfo": {
      "name": "客户名称",
      "email": "客户邮箱",
      "phone": "联系电话",
      "address": "收货地址"
    }
  }
  ```

### 1.3 订单验证 (Order Validation)
- 状态：`Validated` / `已验证`
- 图标：`Check`
- 描述：
  - 中文：`订单信息验证通过`
  - 英文：`Order information validated`
- 验证项目：
  ```json
  {
    "validationItems": [
      "地址有效性",
      "支付信息",
      "商品信息",
      "价格计算",
      "库存预检"
    ]
  }
  ```

## 2. 订单分配阶段 (Order Allocation Phase)

### 2.1 库存检查 (Inventory Check)
- 状态：`InventoryChecking` / `库存检查中`
- 图标：`Search`
- 描述：
  - 中文：`正在检查库存可用性`
  - 英文：`Checking inventory availability`
- 检查项目：
  ```json
  {
    "checkItems": [
      "可用库存",
      "预留库存",
      "在途库存",
      "安全库存"
    ]
  }
  ```

### 2.2 库存分配 (Inventory Allocation)
- 状态：`Allocated` / `已分配`
- 图标：`Location`
- 描述：
  - 中文：`订单已完成库存分配`
  - 英文：`Order inventory allocated successfully`
- 附加信息：
  ```json
  {
    "warehouseInfo": {
      "code": "仓库代码",
      "name": "仓库名称",
      "type": "仓库类型"
    },
    "allocatedItems": [
      {
        "sku": "商品SKU",
        "quantity": "分配数量",
        "location": "库位信息",
        "batchNo": "批次号"
      }
    ],
    "allocationType": "分配类型(整单/拆单)",
    "allocationTime": "分配时间",
    "operator": "操作人"
  }
  ```

### 2.3 分配异常 (Allocation Exception)
- 状态：`AllocationFailed` / `分配失败`
- 图标：`Warning`
- 描述：
  - 中文：`订单分配失败：{失败原因}`
  - 英文：`Order allocation failed: {reason}`
- 异常类型：
  ```json
  {
    "exceptionTypes": {
      "insufficientStock": {
        "code": "E001",
        "name": "库存不足",
        "description": "商品库存不足以满足订单需求",
        "solution": "等待补货或建议替换商品"
      },
      "productDiscontinued": {
        "code": "E002",
        "name": "商品下架",
        "description": "订单中的商品已下架",
        "solution": "联系客户确认替换商品"
      },
      "warehouseMaintenance": {
        "code": "E003",
        "name": "仓库维护",
        "description": "目标仓库正在维护中",
        "solution": "等待维护完成或更换仓库"
      },
      "systemError": {
        "code": "E004",
        "name": "系统错误",
        "description": "系统处理过程中出现错误",
        "solution": "重试或联系技术支持"
      }
    }
  }
  ```

## 3. WMS处理阶段 (WMS Processing Phase)

### 3.1 WMS接单 (WMS Acceptance)
- 状态：`WMSReceived` / `WMS已接单`
- 图标：`Check`
- 描述：
  - 中文：`WMS系统成功接收订单`
  - 英文：`Order received by WMS successfully`
- 附加信息：
  ```json
  {
    "wmsOrderId": "WMS订单号",
    "receiveTime": "接收时间",
    "wmsSystem": "WMS系统类型",
    "priority": "处理优先级"
  }
  ```

### 3.2 拣货开始 (Picking Started)
- 状态：`Picking` / `拣货中`
- 图标：`Box`
- 描述：
  - 中文：`订单开始拣货`
  - 英文：`Order picking started`
- 附加信息：
  ```json
  {
    "pickingInfo": {
      "pickerId": "拣货员ID",
      "pickerName": "拣货员姓名",
      "pickingZone": "拣货区域",
      "startTime": "开始时间",
      "estimatedTime": "预计完成时间",
      "pickingMethod": "拣货方式",
      "batchNo": "拣货批次号"
    }
  }
  ```

### 3.3 拣货完成 (Picking Complete)
- 状态：`PickingComplete` / `拣货完成`
- 图标：`Check`
- 描述：
  - 中文：`订单拣货完成`
  - 英文：`Order picking completed`
- 附加信息：
  ```json
  {
    "pickingResult": {
      "completionTime": "完成时间",
      "actualQuantity": "实际拣货数量",
      "shortageItems": "缺货商品列表",
      "substitutionItems": "替换商品列表",
      "qualityCheck": "质检结果"
    }
  }
  ```

### 3.4 包装开始 (Packing Started)
- 状态：`Packing` / `包装中`
- 图标：`Box`
- 描述：
  - 中文：`订单开始包装`
  - 英文：`Order packing started`
- 附加信息：
  ```json
  {
    "packingInfo": {
      "packerId": "包装员ID",
      "packerName": "包装员姓名",
      "packingStation": "包装工作站",
      "startTime": "开始时间"
    }
  }
  ```

### 3.5 包装完成 (Packing Complete)
- 状态：`Packed` / `已打包`
- 图标：`Box`
- 描述：
  - 中文：`订单包装完成`
  - 英文：`Order packing completed`
- 附加信息：
  ```json
  {
    "packageInfo": {
      "packageCount": "包裹数量",
      "totalWeight": "总重量",
      "dimensions": "包裹尺寸",
      "packingMaterials": "包装材料",
      "specialInstructions": "特殊说明"
    },
    "qualityCheck": {
      "inspector": "质检员",
      "checkTime": "检查时间",
      "result": "检查结果",
      "notes": "备注"
    }
  }
  ```

### 3.6 WMS异常 (WMS Exception)
- 状态：`WMSException` / `WMS异常`
- 图标：`Warning`
- 描述：
  - 中文：`WMS处理异常：{异常原因}`
  - 英文：`WMS processing exception: {reason}`
- 异常类型：
  ```json
  {
    "pickingException": {
      "code": "WE001",
      "name": "拣货异常",
      "types": [
        "商品找不到",
        "库位不匹配",
        "数量不足",
        "商品损坏"
      ]
    },
    "packingException": {
      "code": "WE002",
      "name": "包装异常",
      "types": [
        "包装材料不足",
        "商品不适合包装",
        "标签打印错误"
      ]
    },
    "weightException": {
      "code": "WE003",
      "name": "称重异常",
      "types": [
        "重量超出范围",
        "称重设备故障"
      ]
    },
    "systemException": {
      "code": "WE004",
      "name": "系统异常",
      "types": [
        "数据同步失败",
        "系统响应超时",
        "打印机故障"
      ]
    }
  }
  ```

## 4. 发货阶段 (Shipping Phase)

### 4.1 等待发货 (Awaiting Shipment)
- 状态：`ReadyToShip` / `待发货`
- 图标：`Van`
- 描述：
  - 中文：`订单已准备完成，等待发货`
  - 英文：`Order ready for shipment`
- 附加信息：
  ```json
  {
    "shippingInfo": {
      "carrier": "承运商信息",
      "service": "服务类型",
      "expectedPickupTime": "预计提货时间",
      "specialInstructions": "特殊说明"
    }
  }
  ```

### 4.2 已发货 (Shipped)
- 状态：`Shipped` / `已发货`
- 图标：`Van`
- 描述：
  - 中文：`订单已发货`
  - 英文：`Order shipped`
- 附加信息：
  ```json
  {
    "shipmentDetails": {
      "carrier": "承运商",
      "trackingNumber": "运单号",
      "shippingMethod": "发货方式",
      "shipmentTime": "发货时间",
      "estimatedDelivery": "预计送达时间",
      "packages": [
        {
          "packageId": "包裹ID",
          "trackingNumber": "包裹运单号",
          "weight": "重量",
          "dimensions": "尺寸"
        }
      ]
    }
  }
  ```

## 5. 物流追踪阶段 (Logistics Tracking Phase)

### 5.1 运输中 (In Transit)
- 状态：`InTransit` / `运输中`
- 图标：`Van`
- 描述：
  - 中文：`包裹运输中：{当前位置}`
  - 英文：`Package in transit: {current location}`
- 附加信息：
  ```json
  {
    "trackingInfo": {
      "currentLocation": "当前位置",
      "lastUpdateTime": "最后更新时间",
      "nextDestination": "下一站",
      "estimatedArrival": "预计到达时间",
      "transitDays": "在途天数",
      "milestones": [
        {
          "location": "地点",
          "status": "状态",
          "timestamp": "时间"
        }
      ]
    }
  }
  ```

### 5.2 到达配送中心 (Arrived at Distribution Center)
- 状态：`AtDistributionCenter` / `已到达配送中心`
- 图标：`Location`
- 描述：
  - 中文：`包裹已到达配送中心`
  - 英文：`Package arrived at distribution center`
- 附加信息：
  ```json
  {
    "dcInfo": {
      "centerName": "配送中心名称",
      "location": "配送中心位置",
      "arrivalTime": "到达时间",
      "processingStatus": "处理状态"
    }
  }
  ```

### 5.3 派送中 (Out for Delivery)
- 状态：`OutForDelivery` / `派送中`
- 图标：`Van`
- 描述：
  - 中文：`包裹正在派送中`
  - 英文：`Package out for delivery`
- 附加信息：
  ```json
  {
    "deliveryInfo": {
      "courierName": "快递员姓名",
      "courierPhone": "联系电话",
      "vehicleNo": "车辆编号",
      "estimatedDeliveryTime": "预计送达时间"
    }
  }
  ```

### 5.4 运输异常 (Shipping Exception)
- 状态：`ShippingException` / `运输异常`
- 图标：`Warning`
- 描述：
  - 中文：`运输过程出现异常：{异常原因}`
  - 英文：`Shipping exception occurred: {reason}`
- 异常类型：
  ```json
  {
    "weatherDelay": {
      "code": "SE001",
      "name": "天气延误",
      "description": "因天气原因导致运输延误",
      "estimatedDelay": "预计延误时间"
    },
    "addressError": {
      "code": "SE002",
      "name": "地址错误",
      "description": "收货地址错误或不完整",
      "solution": "联系收件人确认地址"
    },
    "packageDamaged": {
      "code": "SE003",
      "name": "包裹损坏",
      "description": "包裹在运输过程中损坏",
      "solution": "重新发货或退款处理"
    },
    "customsDelay": {
      "code": "SE004",
      "name": "清关延误",
      "description": "包裹在海关清关过程中延误",
      "requiredDocuments": "所需文件列表"
    }
  }
  ```

## 6. 完成阶段 (Completion Phase)

### 6.1 已签收 (Delivered)
- 状态：`Delivered` / `已签收`
- 图标：`Check`
- 描述：
  - 中文：`包裹已成功签收`
  - 英文：`Package delivered successfully`
- 附加信息：
  ```json
  {
    "deliveryDetails": {
      "signTime": "签收时间",
      "signedBy": "签收人",
      "deliveryLocation": "送达地点",
      "proofPhoto": "签收照片URL",
      "deliveryNotes": "送货备注"
    }
  }
  ```

### 6.2 订单完成 (Order Completed)
- 状态：`Completed` / `已完成`
- 图标：`Check`
- 描述：
  - 中文：`订单已完成`
  - 英文：`Order completed`
- 附加信息：
  ```json
  {
    "completionInfo": {
      "completionTime": "完成时间",
      "totalProcessingTime": "总处理时间",
      "customerSatisfaction": "客户满意度",
      "feedback": "订单反馈"
    }
  }
  ```

## 7. 异常处理阶段 (Exception Handling Phase)

### 7.1 订单异常 (Order Exception)
- 状态：`Exception` / `异常`
- 图标：`Warning`
- 描述：
  - 中文：`订单出现异常：{异常类型}`
  - 英文：`Order exception occurred: {exception type}`
- 异常分类：
  ```json
  {
    "exceptionTypes": {
      "paymentException": {
        "code": "OE001",
        "name": "支付异常",
        "description": "订单支付过程中出现问题",
        "subTypes": [
          "支付失败",
          "重复支付",
          "退款异常"
        ]
      },
      "inventoryException": {
        "code": "OE002",
        "name": "库存异常",
        "description": "订单库存处理过程中出现问题",
        "subTypes": [
          "库存不足",
          "库存锁定失败",
          "库存同步异常"
        ]
      },
      "logisticsException": {
        "code": "OE003",
        "name": "物流异常",
        "description": "订单物流过程中出现问题",
        "subTypes": [
          "运输延误",
          "包裹丢失",
          "地址错误"
        ]
      },
      "systemException": {
        "code": "OE004",
        "name": "系统异常",
        "description": "系统处理过程中出现问题",
        "subTypes": [
          "数据异常",
          "接口超时",
          "系统错误"
        ]
      }
    },
    "exceptionLevels": {
      "warning": {
        "code": "L1",
        "name": "警告",
        "description": "需要注意但不影响订单处理",
        "action": "记录并监控"
      },
      "critical": {
        "code": "L2",
        "name": "严重",
        "description": "影响订单正常处理",
        "action": "需要人工干预"
      },
      "fatal": {
        "code": "L3",
        "name": "致命",
        "description": "导致订单无法继续处理",
        "action": "必须立即处理"
      }
    },
    "handlingStatus": {
      "pending": {
        "code": "HS01",
        "name": "待处理",
        "description": "异常已记录等待处理"
      },
      "processing": {
        "code": "HS02",
        "name": "处理中",
        "description": "异常正在处理中"
      },
      "resolved": {
        "code": "HS03",
        "name": "已解决",
        "description": "异常已经解决"
      },
      "closed": {
        "code": "HS04",
        "name": "已关闭",
        "description": "异常处理完成并关闭"
      }
    }
  }
  ```

### 7.2 订单取消 (Order Cancelled)
- 状态：`Cancelled` / `已取消`
- 图标：`CircleClose`
- 描述：
  - 中文：`订单已取消：{取消原因}`
  - 英文：`Order cancelled: {cancel reason}`
- 取消信息：
  ```json
  {
    "cancellationInfo": {
      "cancelTime": "取消时间",
      "cancelledBy": "取消操作人",
      "cancelReason": {
        "customerRequest": {
          "code": "CR001",
          "name": "客户要求",
          "description": "应客户要求取消订单"
        },
        "outOfStock": {
          "code": "CR002",
          "name": "库存不足",
          "description": "因库存不足无法履行订单"
        },
        "paymentFailed": {
          "code": "CR003",
          "name": "支付失败",
          "description": "订单支付失败或超时"
        },
        "systemCancel": {
          "code": "CR004",
          "name": "系统取消",
          "description": "系统自动取消的订单"
        },
        "fraudSuspicion": {
          "code": "CR005",
          "name": "欺诈嫌疑",
          "description": "订单存在欺诈风险"
        }
      },
      "refundStatus": {
        "status": "退款状态",
        "amount": "退款金额",
        "processTime": "处理时间"
      }
    }
  }
  ```

## 8. 时间轴显示配置 (Timeline Display Configuration)

### 8.1 基础显示信息
```json
{
  "displayConfig": {
    "timeFormat": "YYYY-MM-DD HH:mm:ss",
    "iconSize": {
      "default": "20px",
      "large": "24px",
      "small": "16px"
    },
    "maxDisplayItems": 10,
    "refreshInterval": 300000,
    "animationDuration": 300
  }
}
```

### 8.2 节点显示样式
```scss
{
  "nodeStyles": {
    "colors": {
      "normal": "#409EFF",
      "success": "#67C23A",
      "warning": "#E6A23C",
      "danger": "#F56C6C",
      "info": "#909399"
    },
    "typography": {
      "fontSize": "14px",
      "titleSize": "16px",
      "lineHeight": "1.5",
      "fontFamily": "Arial, sans-serif"
    },
    "spacing": {
      "padding": "12px",
      "margin": "8px",
      "iconMargin": "4px"
    },
    "borders": {
      "radius": "4px",
      "width": "1px",
      "style": "solid"
    }
  }
}
```

### 8.3 分类筛选配置
```json
{
  "filterConfig": {
    "categories": [
      {
        "key": "all",
        "label": "全部",
        "icon": "List",
        "description": "显示所有节点"
      },
      {
        "key": "dispatch",
        "label": "发货",
        "icon": "Van",
        "description": "显示发货相关节点"
      },
      {
        "key": "exception",
        "label": "异常",
        "icon": "Warning",
        "description": "显示异常相关节点"
      },
      {
        "key": "system",
        "label": "系统",
        "icon": "Monitor",
        "description": "显示系统操作节点"
      }
    ],
    "quickFilters": [
      {
        "key": "today",
        "label": "今天",
        "icon": "Calendar"
      },
      {
        "key": "error",
        "label": "异常",
        "icon": "Warning"
      },
      {
        "key": "important",
        "label": "重要",
        "icon": "Star"
      },
      {
        "key": "manual",
        "label": "人工操作",
        "icon": "User"
      }
    ],
    "dateRangeFilter": {
      "enabled": true,
      "defaultRange": "last7days",
      "options": [
        "today",
        "yesterday",
        "last7days",
        "last30days",
        "custom"
      ]
    }
  }
}
```

### 8.4 响应式设计
```json
{
  "responsiveConfig": {
    "breakpoints": {
      "xs": "480px",
      "sm": "768px",
      "md": "992px",
      "lg": "1200px",
      "xl": "1600px"
    },
    "layouts": {
      "xs": {
        "iconSize": "16px",
        "fontSize": "12px",
        "padding": "8px"
      },
      "sm": {
        "iconSize": "18px",
        "fontSize": "13px",
        "padding": "10px"
      },
      "md": {
        "iconSize": "20px",
        "fontSize": "14px",
        "padding": "12px"
      },
      "lg": {
        "iconSize": "22px",
        "fontSize": "15px",
        "padding": "14px"
      },
      "xl": {
        "iconSize": "24px",
        "fontSize": "16px",
        "padding": "16px"
      }
    }
  }
}
```

## 9. 性能优化建议 (Performance Optimization Suggestions)

### 9.1 数据加载优化
```json
{
  "loadingStrategy": {
    "initialLoad": {
      "limit": 10,
      "orderBy": "timestamp",
      "direction": "desc"
    },
    "lazyLoad": {
      "enabled": true,
      "threshold": 200,
      "batchSize": 10
    },
    "caching": {
      "enabled": true,
      "duration": 300000,
      "strategy": "localStorage"
    }
  }
}
```

### 9.2 渲染优化
```json
{
  "renderOptimization": {
    "virtualScroll": {
      "enabled": true,
      "bufferSize": 5
    },
    "debounce": {
      "scroll": 100,
      "resize": 200,
      "search": 300
    },
    "animation": {
      "enabled": true,
      "duration": 300,
      "easing": "ease-in-out"
    }
  }
}
```

### 9.3 更新策略
```json
{
  "updateStrategy": {
    "realtime": {
      "enabled": true,
      "interval": 30000,
      "retryAttempts": 3
    },
    "batchUpdate": {
      "enabled": true,
      "batchSize": 50,
      "interval": 5000
    }
  }
}
```

## 10. 订单更新阶段 (Order Update Phase)

### 10.1 基础信息更新 (Basic Information Update)
- 状态：`InfoUpdated` / `信息已更新`
- 图标：`Edit`
- 描述：
  - 中文：`订单基础信息已更新：{更新类型}`
  - 英文：`Order basic information updated: {update type}`
- 更新类型：
  ```json
  {
    "addressUpdate": {
      "type": "地址更新",
      "icon": "Location",
      "template": {
        "zh": "收货地址从「{oldValue}」更新为「{newValue}」",
        "en": "Shipping address updated from '{oldValue}' to '{newValue}'"
      },
      "metadata": {
        "oldAddress": "原地址信息",
        "newAddress": "新地址信息",
        "updateReason": "更新原因",
        "verificationStatus": "地址验证状态"
      }
    },
    "contactUpdate": {
      "type": "联系方式更新",
      "icon": "Phone",
      "template": {
        "zh": "联系方式从「{oldValue}」更新为「{newValue}」",
        "en": "Contact information updated from '{oldValue}' to '{newValue}'"
      },
      "metadata": {
        "field": "更新字段(电话/邮箱)",
        "oldValue": "原值",
        "newValue": "新值",
        "updateReason": "更新原因"
      }
    },
    "remarkUpdate": {
      "type": "备注更新",
      "icon": "Document",
      "template": {
        "zh": "订单备注已更新",
        "en": "Order remarks updated"
      },
      "metadata": {
        "oldRemark": "原备注",
        "newRemark": "新备注",
        "updateReason": "更新原因"
      }
    }
  }
  ```

### 10.2 商品信息更新 (Product Information Update)
- 状态：`ProductUpdated` / `商品已更新`
- 图标：`GoodsFilled`
- 描述：
  - 中文：`订单商品信息已更新：{更新类型}`
  - 英文：`Order product information updated: {update type}`
- 更新类型：
  ```json
  {
    "quantityUpdate": {
      "type": "数量更新",
      "icon": "NumberFilled",
      "template": {
        "zh": "商品「{sku}」数量从「{oldQty}」更新为「{newQty}」",
        "en": "Product '{sku}' quantity updated from '{oldQty}' to '{newQty}'"
      },
      "metadata": {
        "sku": "商品SKU",
        "oldQuantity": "原数量",
        "newQuantity": "新数量",
        "priceAdjustment": "价格调整",
        "inventoryImpact": "库存影响"
      }
    },
    "skuUpdate": {
      "type": "SKU更新",
      "icon": "Goods",
      "template": {
        "zh": "商品从「{oldSku}」更换为「{newSku}」",
        "en": "Product changed from '{oldSku}' to '{newSku}'"
      },
      "metadata": {
        "oldSku": "原SKU信息",
        "newSku": "新SKU信息",
        "priceChange": "价格变化",
        "reasonCode": "更换原因代码"
      }
    },
    "priceUpdate": {
      "type": "价格更新",
      "icon": "Money",
      "template": {
        "zh": "商品价格从「{oldPrice}」调整为「{newPrice}」",
        "en": "Product price adjusted from '{oldPrice}' to '{newPrice}'"
      },
      "metadata": {
        "oldPrice": "原价格",
        "newPrice": "新价格",
        "adjustmentReason": "调整原因",
        "approvalInfo": "审批信息"
      }
    }
  }
  ```

### 10.3 退货处理 (Return Processing)
- 状态：`ReturnProcessing` / `退货处理中`
- 图标：`Back`
- 描述：
  - 中文：`订单退货处理：{处理阶段}`
  - 英文：`Order return processing: {processing stage}`
- 处理阶段：
  ```json
  {
    "returnRequest": {
      "stage": "退货申请",
      "icon": "Document",
      "template": {
        "zh": "客户申请退货",
        "en": "Return requested by customer"
      },
      "metadata": {
        "requestTime": "申请时间",
        "returnReason": "退货原因",
        "itemList": "退货商品列表",
        "attachments": "相关附件"
      }
    },
    "returnApproved": {
      "stage": "退货审核通过",
      "icon": "Check",
      "template": {
        "zh": "退货申请已审核通过",
        "en": "Return request approved"
      },
      "metadata": {
        "approvalTime": "审核时间",
        "approver": "审核人",
        "returnMethod": "退货方式",
        "returnAddress": "退货地址"
      }
    },
    "returnShipping": {
      "stage": "退货运输中",
      "icon": "Van",
      "template": {
        "zh": "退货商品运输中",
        "en": "Return items in transit"
      },
      "metadata": {
        "carrier": "承运商",
        "trackingNumber": "运单号",
        "estimatedArrival": "预计到达时间"
      }
    },
    "returnReceived": {
      "stage": "退货已收货",
      "icon": "Box",
      "template": {
        "zh": "退货商品已收到",
        "en": "Return items received"
      },
      "metadata": {
        "receiveTime": "收货时间",
        "inspector": "验货人",
        "condition": "商品状态",
        "notes": "验收备注"
      }
    },
    "returnCompleted": {
      "stage": "退货完成",
      "icon": "CircleCheck",
      "template": {
        "zh": "退货处理完成",
        "en": "Return processing completed"
      },
      "metadata": {
        "completionTime": "完成时间",
        "refundAmount": "退款金额",
        "refundMethod": "退款方式",
        "refundStatus": "退款状态"
      }
    }
  }
  ```

### 10.4 换货处理 (Exchange Processing)
- 状态：`ExchangeProcessing` / `换货处理中`
- 图标：`Refresh`
- 描述：
  - 中文：`订单换货处理：{处理阶段}`
  - 英文：`Order exchange processing: {processing stage}`
- 处理阶段：
  ```json
  {
    "exchangeRequest": {
      "stage": "换货申请",
      "icon": "Document",
      "template": {
        "zh": "客户申请换货",
        "en": "Exchange requested by customer"
      },
      "metadata": {
        "requestTime": "申请时间",
        "exchangeReason": "换货原因",
        "originalItems": "原商品信息",
        "requestedItems": "换货商品信息",
        "attachments": "相关附件"
      }
    },
    "exchangeApproved": {
      "stage": "换货审核通过",
      "icon": "Check",
      "template": {
        "zh": "换货申请已审核通过",
        "en": "Exchange request approved"
      },
      "metadata": {
        "approvalTime": "审核时间",
        "approver": "审核人",
        "exchangeMethod": "换货方式",
        "shippingAddress": "收货地址"
      }
    },
    "returnForExchange": {
      "stage": "换货退回",
      "icon": "Back",
      "template": {
        "zh": "原商品退回中",
        "en": "Original items being returned"
      },
      "metadata": {
        "carrier": "承运商",
        "trackingNumber": "退回运单号",
        "estimatedArrival": "预计到达时间"
      }
    },
    "exchangeShipping": {
      "stage": "换货发出",
      "icon": "Van",
      "template": {
        "zh": "换货商品已发出",
        "en": "Exchange items shipped"
      },
      "metadata": {
        "carrier": "承运商",
        "trackingNumber": "新商品运单号",
        "estimatedDelivery": "预计送达时间"
      }
    },
    "exchangeCompleted": {
      "stage": "换货完成",
      "icon": "CircleCheck",
      "template": {
        "zh": "换货处理完成",
        "en": "Exchange processing completed"
      },
      "metadata": {
        "completionTime": "完成时间",
        "originalItemStatus": "原商品处理状态",
        "newItemStatus": "新商品交付状态",
        "priceDifference": "差价处理"
      }
    }
  }
  ```

### 10.5 订单拆分 (Order Split)
- 状态：`OrderSplit` / `订单拆分`
- 图标：`ForkSpoon`
- 描述：
  - 中文：`订单已拆分：{拆分原因}`
  - 英文：`Order split: {split reason}`
- 拆分信息：
  ```json
  {
    "splitInfo": {
      "originalOrder": "原订单号",
      "newOrders": [
        {
          "orderNumber": "新订单号",
          "items": "包含商品",
          "amount": "订单金额"
        }
      ],
      "splitReason": {
        "inventory": "库存拆分",
        "shipping": "物流拆分",
        "promotion": "活动拆分",
        "other": "其他原因"
      },
      "metadata": {
        "splitTime": "拆分时间",
        "operator": "操作人",
        "approver": "审批人",
        "notes": "拆分说明"
      }
    }
  }
  ```

### 10.6 订单合并 (Order Merge)
- 状态：`OrderMerge` / `订单合并`
- 图标：`Connection`
- 描述：
  - 中文：`订单已合并：{合并原因}`
  - 英文：`Orders merged: {merge reason}`
- 合并信息：
  ```json
  {
    "mergeInfo": {
      "sourceOrders": [
        {
          "orderNumber": "原订单号",
          "items": "包含商品",
          "amount": "订单金额"
        }
      ],
      "newOrder": {
        "orderNumber": "新订单号",
        "totalAmount": "合并后金额"
      },
      "mergeReason": {
        "customer": "客户要求",
        "shipping": "物流优化",
        "system": "系统建议",
        "other": "其他原因"
      },
      "metadata": {
        "mergeTime": "合并时间",
        "operator": "操作人",
        "approver": "审批人",
        "notes": "合并说明"
      }
    }
  }
  ```

### 10.7 支付信息更新 (Payment Update)
- 状态：`PaymentUpdated` / `支付已更新`
- 图标：`Money`
- 描述：
  - 中文：`订单支付信息已更新：{更新类型}`
  - 英文：`Order payment information updated: {update type}`
- 更新类型：
  ```json
  {
    "paymentMethodUpdate": {
      "type": "支付方式更新",
      "template": {
        "zh": "支付方式从「{oldMethod}」更改为「{newMethod}」",
        "en": "Payment method changed from '{oldMethod}' to '{newMethod}'"
      },
      "metadata": {
        "oldMethod": "原支付方式",
        "newMethod": "新支付方式",
        "updateReason": "更改原因",
        "effectiveTime": "生效时间"
      }
    },
    "paymentAmountUpdate": {
      "type": "支付金额更新",
      "template": {
        "zh": "支付金额从「{oldAmount}」调整为「{newAmount}」",
        "en": "Payment amount adjusted from '{oldAmount}' to '{newAmount}'"
      },
      "metadata": {
        "oldAmount": "原金额",
        "newAmount": "新金额",
        "adjustmentReason": "调整原因",
        "approvalInfo": "审批信息"
      }
    }
  }
  ```

### 10.8 更新状态显示规则
```json
{
  "updateDisplayRules": {
    "colorCoding": {
      "infoUpdate": "#909399",
      "productUpdate": "#E6A23C",
      "return": "#F56C6C",
      "exchange": "#409EFF",
      "split": "#67C23A",
      "merge": "#67C23A",
      "payment": "#F56C6C"
    },
    "grouping": {
      "enabled": true,
      "rules": [
        {
          "type": "timeGroup",
          "interval": "day",
          "format": "YYYY-MM-DD"
        },
        {
          "type": "updateType",
          "categories": [
            "basic",
            "product",
            "return",
            "exchange",
            "payment"
          ]
        }
      ]
    },
    "visibility": {
      "showDetails": true,
      "expandedByDefault": false,
      "maxDisplayedUpdates": 5
    }
  }
}
```

### 10.9 更新权限控制
```json
{
  "updatePermissions": {
    "basicInfo": {
      "view": ["all"],
      "edit": ["customer_service", "admin"],
      "approve": ["supervisor"]
    },
    "productInfo": {
      "view": ["all"],
      "edit": ["product_manager", "admin"],
      "approve": ["supervisor"]
    },
    "return": {
      "view": ["all"],
      "process": ["returns_dept", "admin"],
      "approve": ["returns_supervisor"]
    },
    "exchange": {
      "view": ["all"],
      "process": ["exchange_dept", "admin"],
      "approve": ["exchange_supervisor"]
    },
    "payment": {
      "view": ["all"],
      "edit": ["finance_dept", "admin"],
      "approve": ["finance_supervisor"]
    }
  }
}
``` 