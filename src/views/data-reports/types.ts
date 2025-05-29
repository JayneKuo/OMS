// 基础信息接口
export interface BaseInfo {
  name: string               // 规则名称
  description: string        // 规则描述
  categories: string[]       // 适用类目
  brands: string[]          // 适用品牌
  skus: string[]            // 适用SKU
  warehouses: string[]      // 适用仓库
  effectiveTime: [Date, Date] | [] // 生效时间
  priority: number          // 优先级
  isEnabled: boolean        // 是否启用
}

// 条件接口
export interface RuleCondition {
  field: string            // 条件字段
  operator: string         // 运算符
  value: string | number | string[]   // 条件值
  valueType: 'number' | 'date' | 'percentage' | 'text' | 'select' // 值类型
  options?: { label: string; value: string }[] // 选项列表,用于select类型
}

// 条件组接口
export interface ConditionGroup {
  conditions: RuleCondition[]
  relation: 'AND' | 'OR'    // 组内关系
}

// 动作参数接口
export interface ActionParam {
  name: string
  label: string
  value: any
  type: 'number' | 'text' | 'select' | 'percentage' | 'warehouse'
  options?: string[]
}

// 动作接口
export interface RuleAction {
  type: string             // 动作类型
  params: ActionParam[]    // 动作参数
  triggerType: 'auto' | 'manual' // 触发方式
}

// 完整规则接口
export interface Rule {
  id: number
  baseInfo: BaseInfo
  conditionGroups: ConditionGroup[]
  actions: RuleAction[]
  status: 'active' | 'inactive'
  createdAt?: Date
  updatedAt?: Date
} 