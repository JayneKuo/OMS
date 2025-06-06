# OMS 订单字段功能分组（含来源、退货、支付、地址）

---

## ✅ 一、基础订单信息（Order Info）

| 字段名称                    | 中文含义           |
|-----------------------------|--------------------|
| Channel Sales Order No.     | 渠道订单号         |
| Purchase Order ID           | 采购订单号         |
| Reference No.               | 引用编号 / 参考号  |
| Exchange No                 | 换货单号（如适用） |
| Fulfill By                  | 履约方式 / 履约方  |

---

## 🌍 二、平台与来源信息（Order Source）

| 字段名称                    | 中文含义                 |
|-----------------------------|--------------------------|
| Original Order Source       | 原始订单来源平台（如 Amazon） |
| Original Order ID           | 原始平台订单号               |
| Source Channel              | 当前中转渠道（如 Shopify）   |
| Channel Sales Order NO            | 渠道订单编号                 |

---

## 🔁 三、退货与售后信息（Return Info）

| 字段名称                    | 中文含义               |
|-----------------------------|------------------------|
| Is Return                   | 是否为退货单           |
| Return Source               | 退货发起平台（如 Amazon）|
| Return Type                 | 退货类型（客户退货/拒收等）|
| Return Reference No         | 退货编号（系统生成）     |
| Origin Order ID             | 关联原始订单编号         |

---

## 💰 四、支付信息（Payment Info）

| 字段名称                    | 中文含义           |
|-----------------------------|--------------------|
| Subtotal                    | 商品小计           |
| Discount                    | 折扣金额           |
| Shipping Cost               | 运费               |
| Tax                         | 税率或税额         |
| Total                       | 应付总金额         |

---

## 📦 五、发货与物流信息（Shipping & Logistics）

| 字段名称                    | 中文含义                 |
|-----------------------------|--------------------------|
| Ship Method                 | 发货方式                 |
| Carrier                     | 承运商                   |
| Delivery Service            | 配送服务等级             |
| Tracking Number             | 物流追踪号               |
| Original Shipping Code      | 原始发运编码             |

---

## 🗓️ 六、发货时间信息（Shipping Timeline）

| 字段名称                    | 中文含义               |
|-----------------------------|------------------------|
| Delivered to WMS            | 到达 WMS 的时间        |
| Requested Ship Date         | 请求发货日期           |
| Estimated Shipping Date     | 预计发货日期           |
| Ship Date                   | 实际发货日期           |
| Loaded Date                 | 装车日期               |
| Shipping Sent to Channel    | 发货信息同步到渠道状态 |

---

## 🏷️ 七、客户与地址信息（Customer & Address）

| 字段名称                    | 中文含义               |
|-----------------------------|------------------------|
| Customer Name               | 客户名称               |
| Customer Email              | 客户邮箱               |
| Customer Phone              | 客户电话               |
| Shipping Address Line 1     | 收货地址第一行         |
| Shipping Address Line 2     | 收货地址第二行（如有） |
| Shipping City               | 收货城市               |
| Shipping State              | 收货州/省              |
| Shipping Country            | 收货国家               |
| Shipping Zip Code           | 收货邮编               |
| Billing Address             | 账单地址（如不同）     |

---
