# 商户管理字段规则文档
# Merchant Management Field Rules

## 1. 商户基本信息字段

### 1.1 商户ID (id)
- **字段类型**: String
- **生成规则**: 系统自动生成，UUID格式
- **唯一性**: 全局唯一，不可重复
- **校验规则**: 
  - 新增时系统自动生成，用户不可输入
  - 编辑时不可修改
- **同步规则**: 创建时同步到所有关联表

### 1.2 商户名称 (name)
- **字段类型**: String
- **长度限制**: 2-50字符
- **必填**: 是
- **唯一性**: 全局唯一
- **校验规则**: 
  - 不能包含特殊字符: `< > & " ' /`
  - 不能以空格开头或结尾
  - 不能包含连续空格
- **去重逻辑**: 
  - 新增时检查名称是否已存在
  - 编辑时排除自身检查重复
- **错误提示**: 
  - 为空: "请输入商户名称" / "Please enter merchant name"
  - 长度不符: "商户名称长度为2-50字符" / "Merchant name length should be 2-50 characters"
  - 重复: "商户名称已存在" / "Merchant name already exists"
  - 格式错误: "商户名称不能包含特殊字符" / "Merchant name cannot contain special characters"
- **未填提示**: "商户名称为必填项" / "Merchant name is required"

### 1.3 商户Logo (logo)
- **字段类型**: String (URL)
- **必填**: 否
- **文件格式**: JPG, PNG, WEBP
- **文件大小**: 最大2MB
- **尺寸要求**: 建议1:1比例，最小100x100px
- **校验规则**:
  - 上传前验证文件格式和大小
  - 生成缩略图和原图两个版本
- **存储规则**: 
  - 文件名: `merchant_logo_{merchantId}_{timestamp}.{ext}`
  - 存储路径: `/uploads/merchant/logos/`
- **同步规则**: 
  - 更新时删除旧文件
  - 删除商户时删除关联文件

## 2. 状态管理字段

### 2.1 商户状态 (status)
- **字段类型**: Enum
- **取值范围**: 
  - `active`: 激活状态
  - `inactive`: 停用状态
- **必填**: 是
- **默认值**: `active`
- **校验规则**: 只能选择预定义的枚举值
- **业务逻辑**:
  - 停用状态的商户不能进行订单操作
  - 状态变更需要记录操作日志
- **同步规则**: 状态变更时同步更新相关业务表
- **错误提示**: "请选择商户状态" / "Please select merchant status"
- **未填提示**: "商户状态为必填项" / "Merchant status is required"

### 2.2 商户类型 (merchantType)
- **字段类型**: Enum
- **取值范围**:
  - `merchant`: 商户
  - `supplier`: 供应商  
  - `retailer`: 零售商
  - `manufacturer`: 制造商
- **必填**: 是
- **校验规则**: 只能选择预定义的枚举值
- **业务逻辑**: 不同类型商户具有不同的权限和功能
- **错误提示**: "请选择商户类型" / "Please select merchant type"
- **未填提示**: "商户类型为必填项" / "Merchant type is required"

## 3. 联系信息字段

### 3.1 邮箱地址 (email)
- **字段类型**: String
- **长度限制**: 最大100字符
- **必填**: 是
- **唯一性**: 全局唯一
- **校验规则**:
  - 邮箱格式验证: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - 不能包含中文字符
  - 转换为小写存储
- **去重逻辑**: 
  - 新增时检查邮箱是否已被使用
  - 编辑时排除自身检查重复
- **错误提示**:
  - 为空: "请输入邮箱地址" / "Please enter email address"
  - 格式错误: "请输入正确的邮箱格式" / "Please enter a valid email format"
  - 重复: "该邮箱已被使用" / "This email is already in use"
- **未填提示**: "邮箱地址为必填项" / "Email address is required"

### 3.2 联系电话 (phone)
- **字段类型**: String
- **长度限制**: 8-20字符
- **必填**: 是
- **校验规则**:
  - 只能包含数字、加号、减号、空格、括号
  - 正则验证: `/^[\d\s\+\-\(\)]{8,20}$/`
- **格式化规则**: 
  - 存储前去除所有空格和特殊字符，只保留数字和加号
  - 显示时根据国家格式化显示
- **错误提示**:
  - 为空: "请输入联系电话" / "Please enter phone number"
  - 格式错误: "请输入正确的电话格式" / "Please enter a valid phone format"
- **未填提示**: "联系电话为必填项" / "Phone number is required"

## 4. 地址信息字段

### 4.1 国家/地区 (country)
- **字段类型**: String (国家代码)
- **取值范围**: ISO 3166-1 alpha-2 代码
- **预设选项**:
  - `US`: United States
  - `CA`: Canada  
  - `UK`: United Kingdom
  - `AU`: Australia
  - `DE`: Germany
  - `FR`: France
  - `JP`: Japan
  - `CN`: China
- **必填**: 是
- **校验规则**: 只能选择预定义的国家代码
- **关联逻辑**: 选择国家后自动设置对应的默认货币
- **错误提示**: "请选择国家/地区" / "Please select country/region"
- **未填提示**: "国家/地区为必填项" / "Country/region is required"

### 4.2 货币 (currency)
- **字段类型**: String (货币代码)
- **取值范围**: ISO 4217 货币代码
- **预设选项**:
  - `USD`: US Dollar
  - `EUR`: Euro
  - `GBP`: British Pound
  - `CAD`: Canadian Dollar
  - `AUD`: Australian Dollar
  - `JPY`: Japanese Yen
  - `CNY`: Chinese Yuan
- **必填**: 是
- **校验规则**: 只能选择预定义的货币代码
- **自动填充**: 根据选择的国家自动设置默认货币
- **错误提示**: "请选择货币" / "Please select currency"
- **未填提示**: "货币为必填项" / "Currency is required"

### 4.3 州/省 (state)
- **字段类型**: String
- **长度限制**: 1-50字符
- **必填**: 是
- **校验规则**: 
  - 不能包含特殊字符
  - 去除首尾空格
- **错误提示**: "请输入州/省信息" / "Please enter state information"
- **未填提示**: "州/省为必填项" / "State is required"

### 4.4 城市 (city)
- **字段类型**: String
- **长度限制**: 1-50字符
- **必填**: 是
- **校验规则**: 
  - 不能包含特殊字符
  - 去除首尾空格
- **错误提示**: "请输入城市信息" / "Please enter city information"
- **未填提示**: "城市为必填项" / "City is required"

### 4.5 详细地址 (address)
- **字段类型**: String
- **长度限制**: 5-200字符
- **必填**: 是
- **校验规则**: 
  - 去除首尾空格
  - 不能全为空格或特殊字符
- **错误提示**: 
  - 为空: "请输入详细地址" / "Please enter detailed address"
  - 长度不符: "地址长度为5-200字符" / "Address length should be 5-200 characters"
- **未填提示**: "详细地址为必填项" / "Detailed address is required"

### 4.6 邮政编码 (zipCode)
- **字段类型**: String
- **长度限制**: 3-10字符
- **必填**: 是
- **校验规则**: 
  - 只能包含字母和数字
  - 正则验证: `/^[A-Za-z0-9]{3,10}$/`
- **格式化**: 转换为大写存储
- **错误提示**: 
  - 为空: "请输入邮政编码" / "Please enter zip code"
  - 格式错误: "邮政编码格式不正确" / "Invalid zip code format"
- **未填提示**: "邮政编码为必填项" / "Zip code is required"

## 5. 业务信息字段

### 5.1 商户描述 (description)
- **字段类型**: Text
- **长度限制**: 0-500字符
- **必填**: 否
- **校验规则**: 
  - 去除首尾空格
  - 过滤HTML标签和脚本
- **默认值**: 空字符串

## 6. 系统字段

### 6.1 创建时间 (createTime)
- **字段类型**: DateTime
- **生成规则**: 系统自动生成，创建时设置
- **格式**: ISO 8601 格式
- **时区**: UTC时间存储
- **不可修改**: 创建后不可更改

### 6.2 更新时间 (updateTime)
- **字段类型**: DateTime
- **生成规则**: 系统自动生成，每次更新时设置
- **格式**: ISO 8601 格式
- **时区**: UTC时间存储
- **自动更新**: 任何字段变更都会更新此时间

### 6.3 加入日期 (joinDate)
- **字段类型**: Date
- **生成规则**: 创建时自动设置为当前日期
- **格式**: YYYY-MM-DD
- **显示**: 前端显示时转换为本地时区

## 7. 表单校验规则汇总

### 7.1 前端实时校验
```javascript
const rules = {
  name: [
    { required: true, message: '请输入商户名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商户名称长度为2-50字符', trigger: 'blur' },
    { validator: checkNameUnique, trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择商户状态', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    { validator: checkEmailUnique, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^[\d\s\+\-\(\)]{8,20}$/, message: '请输入正确的电话格式', trigger: 'blur' }
  ],
  country: [
    { required: true, message: '请选择国家/地区', trigger: 'change' }
  ],
  currency: [
    { required: true, message: '请选择货币', trigger: 'change' }
  ],
  state: [
    { required: true, message: '请输入州/省', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 200, message: '地址长度为5-200字符', trigger: 'blur' }
  ],
  zipCode: [
    { required: true, message: '请输入邮政编码', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]{3,10}$/, message: '邮政编码格式不正确', trigger: 'blur' }
  ],
  merchantType: [
    { required: true, message: '请选择商户类型', trigger: 'change' }
  ]
}
```

### 7.2 后端数据校验
- 所有前端校验规则在后端重复执行
- 唯一性校验在数据库层面执行
- 文件上传校验在文件处理层执行
- 敏感数据过滤和清理

### 7.3 数据同步规则
- 商户创建：同步到商户索引表、权限表
- 商户更新：同步更新所有关联表的商户信息
- 商户删除：软删除，保留历史数据
- 状态变更：同步更新订单、产品等业务表的状态

## 8. 保存校验和提示规则

### 8.1 保存前校验流程
1. **前端校验**：表单提交前执行所有字段校验
2. **加载状态**：显示"保存中..." / "Saving..." 提示
3. **后端校验**：服务器端重复执行所有校验规则
4. **业务校验**：执行唯一性、关联性等业务规则校验

### 8.2 校验失败提示
**前端校验失败：**
- 提示信息：定位到第一个错误字段
- 错误样式：字段边框变红，显示错误图标
- 阻止提交：不发送请求到后端

**后端校验失败：**
- 通用提示：
  - 中文："数据校验失败，请检查输入信息"
  - 英文："Data validation failed, please check your input"
- 具体错误：返回具体字段的错误信息
- 错误代码：标准化错误代码便于前端处理

### 8.3 保存成功提示
**成功提示信息：**
- 新增成功：
  - 中文："商户创建成功"
  - 英文："Merchant created successfully"
- 更新成功：
  - 中文："商户信息更新成功"
  - 英文："Merchant information updated successfully"

**成功后操作：**
- 关闭编辑对话框
- 刷新商户列表
- 显示成功消息（3秒后自动消失）
- 记录操作日志

### 8.4 保存失败提示
**网络错误：**
- 中文："网络连接失败，请稍后重试"
- 英文："Network connection failed, please try again later"

**服务器错误：**
- 中文："服务器繁忙，请稍后重试"
- 英文："Server is busy, please try again later"

**权限错误：**
- 中文："您没有权限执行此操作"
- 英文："You don't have permission to perform this operation"

**数据冲突：**
- 中文："数据已被其他用户修改，请刷新后重试"
- 英文："Data has been modified by another user, please refresh and try again"

### 8.5 校验提示样式规范
**成功提示：**
- 图标：✅ 绿色对勾
- 背景色：#f0f9ff (浅绿色)
- 文字色：#059669 (绿色)
- 持续时间：3秒

**错误提示：**
- 图标：❌ 红色叉号
- 背景色：#fef2f2 (浅红色)
- 文字色：#dc2626 (红色)
- 持续时间：5秒或用户手动关闭

**警告提示：**
- 图标：⚠️ 黄色感叹号
- 背景色：#fffbeb (浅黄色)
- 文字色：#d97706 (橙色)
- 持续时间：4秒

## 9. 列表排序和搜索规则

### 9.1 排序规则
**默认排序：**
- 主排序：创建时间倒序（最新创建的在前）
- 次排序：商户ID升序

**支持排序的字段：**
- 商户名称 (name)：按字母顺序升序/降序
- 创建时间 (createTime)：按时间升序/降序
- 更新时间 (updateTime)：按时间升序/降序
- 加入日期 (joinDate)：按日期升序/降序

**排序逻辑：**
- 点击列标题切换排序方向
- 支持多字段排序（按点击顺序）
- 排序状态在URL中保持（便于分享和刷新）

### 9.2 搜索规则
**商户名称搜索：**
- 搜索类型：模糊搜索
- 匹配规则：包含关键词即匹配
- 大小写：不区分大小写
- 特殊字符：自动转义
- 最小长度：1个字符

**状态筛选：**
- 筛选类型：精确匹配
- 取值范围：active, inactive
- 默认值：全部（不筛选）
- 多选支持：否

**商户类型筛选：**
- 筛选类型：精确匹配
- 取值范围：merchant, supplier, retailer, manufacturer
- 默认值：全部（不筛选）
- 多选支持：否

### 9.3 搜索性能优化
**索引策略：**
- name字段：建立普通索引
- status字段：建立普通索引
- merchantType字段：建立普通索引
- 复合索引：(status, merchantType, createTime)

**查询优化：**
- 分页查询：避免全表扫描
- 缓存策略：热门搜索结果缓存5分钟
- 防抖处理：搜索输入延迟500ms执行
- 最大结果：单次最多返回1000条记录

### 9.4 搜索结果处理
**无结果处理：**
- 显示提示：
  - 中文："未找到符合条件的商户"
  - 英文："No merchants found matching the criteria"
- 建议操作：
  - 检查搜索条件
  - 清空筛选条件
  - 联系管理员

**结果统计：**
- 显示格式："共找到 X 个商户" / "Found X merchants"
- 实时更新：筛选条件变化时实时更新统计
- 性能考虑：超过10000条时显示"10000+"

## 10. CRM字段映射关系

### 10.1 基本信息映射
| OMS字段 | CRM字段 | 映射规则 | 同步方向 | 备注 |
|---------|---------|---------|----------|------|
| id | merchant_id | 直接映射 | OMS → CRM | 主键关联 |
| name | company_name | 直接映射 | 双向同步 | 商户名称 |
| email | primary_email | 直接映射 | 双向同步 | 主邮箱 |
| phone | primary_phone | 格式化后映射 | 双向同步 | 主电话 |
| status | account_status | 枚举值转换 | 双向同步 | 状态映射 |

### 10.2 状态映射规则
| OMS状态 | CRM状态 | 转换规则 |
|---------|---------|---------|
| active | Active | 直接映射 |
| inactive | Inactive | 直接映射 |

### 10.3 地址信息映射
| OMS字段 | CRM字段 | 映射规则 | 同步方向 | 备注 |
|---------|---------|---------|----------|------|
| country | billing_country | 国家代码映射 | 双向同步 | ISO代码转换 |
| state | billing_state | 直接映射 | 双向同步 | 州/省信息 |
| city | billing_city | 直接映射 | 双向同步 | 城市信息 |
| address | billing_address | 直接映射 | 双向同步 | 详细地址 |
| zipCode | billing_postal_code | 格式化后映射 | 双向同步 | 邮政编码 |

### 10.4 业务信息映射
| OMS字段 | CRM字段 | 映射规则 | 同步方向 | 备注 |
|---------|---------|---------|----------|------|
| merchantType | business_type | 枚举值转换 | 双向同步 | 业务类型 |
| description | company_description | 直接映射 | 双向同步 | 公司描述 |
| logo | company_logo_url | URL映射 | OMS → CRM | Logo地址 |
| currency | preferred_currency | 直接映射 | 双向同步 | 首选货币 |

### 10.5 商户类型映射规则
| OMS类型 | CRM类型 | 转换规则 |
|---------|---------|---------|
| merchant | Merchant | 直接映射 |
| supplier | Supplier | 直接映射 |
| retailer | Retailer | 直接映射 |
| manufacturer | Manufacturer | 直接映射 |

### 10.6 时间字段映射
| OMS字段 | CRM字段 | 映射规则 | 同步方向 | 备注 |
|---------|---------|---------|----------|------|
| createTime | created_date | 时区转换 | OMS → CRM | 创建时间 |
| updateTime | last_modified_date | 时区转换 | OMS → CRM | 更新时间 |
| joinDate | onboarding_date | 日期格式转换 | OMS → CRM | 入驻日期 |

### 10.7 同步规则和策略
**同步触发条件：**
- OMS商户创建时 → 同步到CRM
- OMS商户信息更新时 → 同步到CRM
- CRM客户信息更新时 → 同步到OMS（如果存在映射）

**同步频率：**
- 实时同步：关键信息变更（状态、联系方式）
- 批量同步：非关键信息变更（描述、Logo）
- 定时同步：每日凌晨2点全量对账

**冲突处理：**
- 优先级：OMS > CRM（商户管理以OMS为准）
- 冲突记录：记录冲突日志，人工处理
- 回滚机制：同步失败时支持数据回滚

**错误处理：**
- 网络异常：重试3次，间隔递增（1s, 3s, 9s）
- 数据格式错误：记录错误日志，跳过该条记录
- 权限错误：停止同步，发送告警通知
- 系统异常：暂停同步，等待人工干预

### 10.8 映射配置管理
**配置文件格式：**
```json
{
  "fieldMapping": {
    "oms_field": {
      "crm_field": "target_field_name",
      "transform": "transformation_rule",
      "sync_direction": "bidirectional|oms_to_crm|crm_to_oms",
      "required": true|false
    }
  },
  "syncConfig": {
    "realtime_fields": ["status", "email", "phone"],
    "batch_fields": ["description", "logo"],
    "sync_frequency": "realtime|hourly|daily"
  }
}
```

## 11. 错误处理规则

### 11.1 校验错误优先级
1. 必填字段校验
2. 格式校验
3. 长度校验  
4. 唯一性校验
5. 业务逻辑校验

### 11.2 错误信息国际化
- 支持中英文错误信息
- 错误代码标准化
- 统一的错误信息格式

### 11.3 异常情况处理
- 网络异常：提示重试
- 服务器异常：记录日志并提示
- 数据冲突：提供冲突解决方案
- 权限不足：跳转到权限申请页面
