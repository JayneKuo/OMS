# Load 完整业务流程设计

## 业务流程概览

```
NEW → ASSIGNED → CHECKIN → LOADING → LOADED → SHIPPED → DELIVERED → CLOSED
  ↓
CANCELLED (任意状态可取消)
```

## 各阶段详细说明

### 阶段 1: NEW (新建) - 创建 Load

**目标**: 创建 Load 基础信息，准备进入调度流程

**需要录入的信息**:

#### 基本信息（必填）
- ✅ **Load NO** - 自动生成
- ✅ **Load Type** - LTL/FTL/PARCEL（必填）
- ✅ **Customer** - 客户（必填）
- ✅ **Carrier** - 承运商（必填）
- ✅ **Freight Term** - 运费条款（建议必填）
- ✅ **Desired Ship Date** - 期望发货日期（必填）

#### 地址信息（必填）
- ✅ **Ship From** - 发货地址（必填）
  - Name, Company, Address1, City, State, ZipCode, Country, Phone, Email
- ✅ **Ship To** - 收货地址（必填）
  - Name, Company, Address1, City, State, ZipCode, Country, Phone, Email
- ⚠️ **Bill To** - 账单地址（可选，从 Customer 自动填充）

#### 订单信息（必填）
- ✅ **Order Lines** - 订单行（至少一条，必填）
  - Order No, Request No, DN No, Customer, Channel, Reference No
  - Purchase Order No, Ship To, Delivery Request Date
  - Warehouse, Carrier, Tracking Number
  - Total Items, Total Quantity
  - Recipient Name, Recipient Phone

#### 其他信息（可选）
- ⚠️ **Freight Cost** - 运费成本（可选，创建时可能还不知道）
- ⚠️ **Note** - 备注（可选）

**状态转换条件**: 
- 所有必填字段填写完成
- 至少有一条 Order Line
- 点击"保存"后状态变为 NEW

**可执行操作**:
- 编辑 Load
- 取消 Load（转为 CANCELLED）
- 分配承运商（转为 ASSIGNED）

---

### 阶段 2: ASSIGNED (已分配) - 调度阶段

**目标**: 分配Carrier/Driver，设置Equipment、Trailer No、Appointment Time

**需要录入的信息**:

#### 调度信息（必填）
- ✅ **Carrier ID** - 承运商（必填）
  - 选择或确认承运商
- ✅ **Driver Name** - 司机姓名（必填）
  - 承运商分配的司机
- ✅ **Truck No** - 卡车号
  - 车辆牌照号
- ✅ **Trailer No** - 拖车号
  - 拖车牌照号
- ⚠️ **Equipment** - 设备类型
  - 车辆/设备类型
- ✅ **Appointment Time** - 预约时间（必填）
  - 日期和时间
  - 预约窗口（如：9:00 AM - 11:00 AM）

**系统自动动作**:
- 系统记录Dispatch时间
- 若API推送承运方成功→ASSIGNED

**状态转换条件**:
- 调度信息已录入
- 点击"确认分配"后状态变为 ASSIGNED

**可执行操作**:
- 签到（转为 CHECKIN）
- 取消 Load（转为 CANCELLED）

---

### 阶段 3: CHECKIN (签到) - 签到阶段

**目标**: 司机到场签到，确认车辆与Trailer，记录Check-In时间

**需要录入的信息**:

#### 签到信息（必填）
- ✅ **Warehouse** - 仓库（必填）
  - 选择签到仓库
- ✅ **Driver Check-in Time** - 司机签到时间（必填）
  - 承运商到达仓库的时间
  - 实际签到时间（可能与预约时间不同）
- ✅ **Gate In Time** - 入场时间（必填）
  - 车辆进入仓库大门的时间
- ⚠️ **Dock No** - 码头号
  - 分配的装卸码头
- ⚠️ **Gate In Operator** - 入场操作员
  - 负责入场登记的操作员姓名

#### 车辆信息
- ⚠️ **License Plate** - 车牌号
  - 确认车辆信息
- ⚠️ **Trailer No** - 拖车号
  - 确认拖车信息

**系统自动动作**:
- 更新YMS记录
- 触发装载任务排队

**状态转换条件**:
- 签到信息已录入
- 点击"签到完成"后状态变为 CHECKIN

**可执行操作**:
- 开始装载（转为 LOADING）
- 取消 Load（转为 CANCELLED）

---

### 阶段 4: LOADING (装载中) - 装载阶段

**目标**: 开始装货，记录Start Loading Time，录入Shipment / Order明细

**需要录入的信息**:

#### 装载信息（必填）
- ✅ **Loading Start Time** - 开始装载时间（必填）
  - 日期和时间
- ⚠️ **Shipment IDs** - Shipment IDs
  - 关联的Shipment ID列表（逗号分隔）
- ⚠️ **Planned Pallet Qty** - 计划托盘数量
  - 计划装载的托盘数量
- ⚠️ **Planned Weight** - 计划重量（kg）
  - 计划装载的重量

**系统自动动作**:
- 生成装载任务
- 更新WMS状态

**状态转换条件**:
- 装载信息已录入
- 点击"开始装载"后状态变为 LOADING

**可执行操作**:
- 完成装载（转为 LOADED）
- 取消 Load（转为 CANCELLED）

---

### 阶段 5: LOADED (已装载) - 装载完成阶段

**目标**: 完成装车，填写BOL No、Seal No，记录实际重量、体积，上传装货凭证

**需要录入的信息**:

#### 装载完成信息（必填）
- ✅ **BOL No** - 提单号（必填）
  - Bill of Lading 编号
- ⚠️ **Seal No** - 封条号
  - 车辆封条编号
- ⚠️ **Actual Pallet Qty** - 实际托盘数量
  - 实际装载的托盘数量
- ⚠️ **Actual Weight** - 实际重量（kg）
  - 实际装载的重量
- ✅ **Load Complete Time** - 装载完成时间（必填）
  - 日期和时间

**系统自动动作**:
- 自动生成BOL文档
- EDI 856触发

**状态转换条件**:
- 装载完成信息已录入
- 点击"装载完成"后状态变为 LOADED

**可执行操作**:
- 发运（转为 SHIPPED）
- 打印装载单
- 打印标签
- 取消 Load（转为 CANCELLED）

---

### 阶段 6: SHIPPED (已发运) - 发运阶段

**目标**: 司机出场，记录Gate Out时间，填写Pro No / Tracking No

**需要录入的信息**:

#### 发运信息（必填）
- ✅ **Gate Out Time** - 出场时间（必填）
  - 车辆离开仓库大门的时间
- ✅ **Pro No** - Pro No（必填）
  - 承运商提供的Pro Number
- ⚠️ **Tracking No** - 跟踪号
  - 承运商提供的跟踪号
- ⚠️ **Departure Time** - 出发时间
  - 车辆实际出发时间

#### 司机信息
- ⚠️ **Driver Name** - 司机姓名
- ⚠️ **Driver Phone** - 司机电话
- ⚠️ **Estimated Delivery Date** - 预计送达日期
  - 承运商提供的预计送达时间

**系统自动动作**:
- 系统计算在场时长、装货用时
- 发送EDI 214 `X3=Departed`

**状态转换条件**:
- 发运信息已录入
- 点击"确认发运"后状态变为 SHIPPED

**可执行操作**:
- 交付（转为 DELIVERED）
- 跟踪运输状态
- 取消 Load（转为 CANCELLED）

---

### 阶段 7: DELIVERED (已交付) - 交付阶段

**目标**: 确认到达/收货，上传POD，填写Delivered Time, Received By

**需要录入的信息**:

#### 交付信息（必填）
- ✅ **Delivered Time** - 交付时间（必填）
  - 日期和时间
- ✅ **Received By** - 收货人（必填）
  - 收货人姓名
- ⚠️ **Received Qty** - 收货数量
  - 实际收到的数量
- ⚠️ **POD File** - POD文件
  - 上传Proof of Delivery文档

**系统自动动作**:
- 自动推送EDI 214 `AF=Delivered`

**状态转换条件**:
- 交付信息已录入
- 点击"确认交付"后状态变为 DELIVERED

**可执行操作**:
- 关闭 Load（转为 CLOSED）

---

### 阶段 8: CLOSED (已关闭) - 关单阶段

**目标**: 审核运输完成，录入最终运费/Invoice No，关闭Load

**需要录入的信息**:

#### 关闭信息（必填）
- ✅ **Final Freight Cost** - 最终运费（必填）
  - 确认最终运费（可能与预估不同）
- ✅ **Invoice No** - 发票号（必填）
  - 发票编号
- ⚠️ **Close Time** - 关闭时间
  - 日期和时间（自动记录）
- ⚠️ **Closed By** - 关闭人员
  - 操作员姓名或 ID

**系统自动动作**:
- 系统自动归档
- 财务结算
- 状态=Closed

**状态转换条件**:
- 关闭信息已录入
- 点击"关闭 Load"后状态变为 CLOSED

**可执行操作**:
- 查看历史记录
- 导出完整文件
- 归档

---

### 异常流程: CANCELLED (已取消)

**目标**: 取消任务/撤单，记录取消原因

**需要录入的信息**:

#### 取消信息（必填）
- ✅ **Cancel Reason** - 取消原因（必填）
  - 客户取消
  - 承运商无法提供服务
  - 货物问题
  - 其他原因（需说明）
- ⚠️ **Cancel Time** - 取消时间
  - 日期和时间（自动记录）
- ⚠️ **Cancel Operator** - 取消操作员
  - 操作员姓名或 ID

**系统自动动作**:
- 若存在Trip/Shipment则同步取消

**状态转换条件**:
- 取消原因已录入
- 点击"确认取消"后状态变为 CANCELLED

**可执行操作**:
- 查看取消记录
- 重新创建 Load（如果需要）

---

## 字段汇总表

### 创建时（NEW）
| 字段 | 必填 | 说明 |
|------|------|------|
| Load NO | ✅ | 自动生成 |
| Load Type | ✅ | LTL/FTL/PARCEL |
| Customer | ✅ | 客户 |
| Carrier | ✅ | 承运商 |
| Freight Term | ✅ | 运费条款 |
| Desired Ship Date | ✅ | 期望发货日期 |
| Ship From | ✅ | 发货地址 |
| Ship To | ✅ | 收货地址 |
| Bill To | ⚠️ | 账单地址（可选） |
| Order Lines | ✅ | 订单行（至少一条） |
| Freight Cost | ⚠️ | 运费成本（可选） |
| Note | ⚠️ | 备注（可选） |

### 调度阶段（ASSIGNED）
| 字段 | 必填 | 说明 |
|------|------|------|
| Carrier ID | ✅ | 承运商 |
| Driver Name | ✅ | 司机姓名 |
| Truck No | ⚠️ | 卡车号 |
| Trailer No | ⚠️ | 拖车号 |
| Equipment | ⚠️ | 设备类型 |
| Appointment Time | ✅ | 预约时间 |

### 签到阶段（CHECKIN）
| 字段 | 必填 | 说明 |
|------|------|------|
| Warehouse | ✅ | 仓库 |
| Driver Check-in Time | ✅ | 司机签到时间 |
| Gate In Time | ✅ | 入场时间 |
| Dock No | ⚠️ | 码头号 |
| Gate In Operator | ⚠️ | 入场操作员 |
| License Plate | ⚠️ | 车牌号 |
| Trailer No | ⚠️ | 拖车号 |

### 装载阶段（LOADING）
| 字段 | 必填 | 说明 |
|------|------|------|
| Loading Start Time | ✅ | 开始装载时间 |
| Shipment IDs | ⚠️ | Shipment IDs |
| Planned Pallet Qty | ⚠️ | 计划托盘数量 |
| Planned Weight | ⚠️ | 计划重量（kg） |

### 装载完成阶段（LOADED）
| 字段 | 必填 | 说明 |
|------|------|------|
| BOL No | ✅ | 提单号 |
| Seal No | ⚠️ | 封条号 |
| Actual Pallet Qty | ⚠️ | 实际托盘数量 |
| Actual Weight | ⚠️ | 实际重量（kg） |
| Load Complete Time | ✅ | 装载完成时间 |

### 发运阶段（SHIPPED）
| 字段 | 必填 | 说明 |
|------|------|------|
| Gate Out Time | ✅ | 出场时间 |
| Pro No | ✅ | Pro No |
| Tracking No | ⚠️ | 跟踪号 |
| Departure Time | ⚠️ | 出发时间 |
| Driver Name | ⚠️ | 司机姓名 |
| Driver Phone | ⚠️ | 司机电话 |
| Estimated Delivery Date | ⚠️ | 预计送达日期 |

### 交付阶段（DELIVERED）
| 字段 | 必填 | 说明 |
|------|------|------|
| Delivered Time | ✅ | 交付时间 |
| Received By | ✅ | 收货人 |
| Received Qty | ⚠️ | 收货数量 |
| POD File | ⚠️ | POD文件 |

### 关单阶段（CLOSED）
| 字段 | 必填 | 说明 |
|------|------|------|
| Final Freight Cost | ✅ | 最终运费 |
| Invoice No | ✅ | 发票号 |
| Close Time | ⚠️ | 关闭时间（自动） |
| Closed By | ⚠️ | 关闭人员 |

### 取消阶段（CANCELLED）
| 字段 | 必填 | 说明 |
|------|------|------|
| Cancel Reason | ✅ | 取消原因 |
| Cancel Time | ⚠️ | 取消时间（自动） |
| Cancel Operator | ⚠️ | 取消操作员 |

---

## 实施建议

### 1. 状态流转控制
- 每个状态只能转换到允许的下一个状态
- 记录状态变更历史
- 状态变更需要权限验证

### 2. 字段显示控制
- 根据当前状态动态显示相关字段
- 已完成的阶段字段变为只读
- 当前阶段的字段可编辑

### 3. 必填字段验证
- 每个阶段转换前验证必填字段
- 提供清晰的错误提示
- 支持保存草稿（部分填写）

### 4. 自动化填充
- 自动记录时间戳（如 Dispatch Time, Load Complete Time）
- 自动填充关联信息（如从 Customer 填充 Bill To）
- 自动计算字段（如在场时长、装货用时）

### 5. 文件管理
- 每个阶段支持上传相关文件
- 文件分类管理（提单、标签、发票、POD等）
- 文件版本控制

### 6. 通知机制
- 状态变更时通知相关人员
- 关键节点提醒（如预约时间、发运日期）
- 异常情况告警

### 7. EDI集成
- ASSIGNED阶段：推送承运方信息
- LOADED阶段：发送EDI 856
- SHIPPED阶段：发送EDI 214 `X3=Departed`
- DELIVERED阶段：发送EDI 214 `AF=Delivered`

### 8. 系统集成
- YMS集成：CHECKIN阶段更新YMS记录
- WMS集成：LOADING阶段更新WMS状态
- TMS集成：同步运输信息
- 财务系统集成：CLOSED阶段财务结算
