👌 明白，这次我重新输出 **Mapping Tab**，完全按照你的思路：
👉 目的就是 **对照不同系统/渠道里，这个商品叫什么**，保持简洁清晰。

---

# 🔗 Mapping — 功能分区与字段（最终版）

---

### ① Internal System Mapping

👉 内部系统的商品编码对照

| Field (English) | 必填度  | 中文说明                               |
| --------------- | ---- | ---------------------------------- |
| OMS Item Code   | 系统生成 | OMS 内部商品编码（主键，唯一）                  |
| ERP Item Code   | 可选   | ERP 系统中的商品编码                       |
| WMS Item Code   | 可选   | 仓储系统中的商品编码                         |
| TMS Item Code   | 可选   | 运输系统中的商品编码                         |
| Owner Code      | 条件必填 | 多货主模式下的货主编码                        |
| Mapping Status  | 系统生成 | 映射是否成功（Linked / Missing / Pending） |

---

### ② Channel Mapping

👉 电商平台的商品 ID 对照

| Field (English)          | 必填度  | 中文说明                            |
| ------------------------ | ---- | ------------------------------- |
| Amazon ASIN / Seller SKU | 可选   | Amazon 的 ASIN 或商家 SKU           |
| eBay Item ID             | 可选   | eBay 商品 ID                      |
| Shopify Product ID       | 可选   | Shopify 商品 ID                   |
| Walmart Item ID          | 可选   | Walmart 商品 ID                   |
| Other Channel IDs        | 可选   | 其他电商平台商品 ID                     |
| Channel Status           | 系统生成 | 渠道状态（Active / Draft / Disabled） |

---

### ③ Client & External Codes

👉 客户/商家自有的特殊编码

| Field (English)  | 必填度 | 中文说明      |
| ---------------- | --- | --------- |
| Client Item Code | 可选  | 客户提供的商品编码 |
| Custom Code      | 可选  | 商家自定义内部编码 |

---

## ✅ 页面交互顺序（推荐）

**Internal System Mapping → Channel Mapping → Client & External Codes → Audit & Logs**
| System | Item Code | Status  |
| ------ | --------- | ------- |
| OMS    | SKU123    | Linked  |
| WMS    | ITEM-001  | Linked  |
| ERP    | P10001    | Linked  |
| TMS    | —         | Missing |

| Channel | Channel Item ID | Status   |
| ------- | --------------- | -------- |
| Amazon  | B01ABC123       | Active   |
| eBay    | 1012254666      | Draft    |
| Shopify | 87654321        | Disabled |
