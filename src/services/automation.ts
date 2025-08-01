import type { Rule, Condition, ConditionGroup, Action } from '../types/automation'
import { OPERATOR_OPTIONS } from '../constants/automation'

// 条件评估器
class ConditionEvaluator {
  private static instance: ConditionEvaluator
  private operatorHandlers: Record<string, (condition: Condition, value: any) => boolean>

  private constructor() {
    this.operatorHandlers = {
      eq: (condition, value) => value === condition.value,
      neq: (condition, value) => value !== condition.value,
      gt: (condition, value) => value > condition.value,
      lt: (condition, value) => value < condition.value,
      gte: (condition, value) => value >= condition.value,
      lte: (condition, value) => value <= condition.value,
      contains: (condition, value) => {
        if (Array.isArray(value)) {
          return value.includes(condition.value)
        }
        return String(value).includes(String(condition.value))
      },
      not_contains: (condition, value) => {
        if (Array.isArray(value)) {
          return !value.includes(condition.value)
        }
        return !String(value).includes(String(condition.value))
      },
      starts_with: (condition, value) => String(value).startsWith(String(condition.value)),
      ends_with: (condition, value) => String(value).endsWith(String(condition.value)),
      in: (condition, value) => {
        const list = Array.isArray(condition.value) ? condition.value : [condition.value]
        return list.includes(value)
      },
      not_in: (condition, value) => {
        const list = Array.isArray(condition.value) ? condition.value : [condition.value]
        return !list.includes(value)
      },
      is_empty: (condition, value) => {
        if (Array.isArray(value)) return value.length === 0
        if (typeof value === 'string') return value.trim() === ''
        return value == null
      },
      is_not_empty: (condition, value) => {
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'string') return value.trim() !== ''
        return value != null
      },
      between: (condition, value) => {
        const [min, max] = Array.isArray(condition.value) ? condition.value : [0, condition.value]
        return value >= min && value <= max
      },
      not_between: (condition, value) => {
        const [min, max] = Array.isArray(condition.value) ? condition.value : [0, condition.value]
        return value < min || value > max
      }
    }
  }

  public static getInstance(): ConditionEvaluator {
    if (!ConditionEvaluator.instance) {
      ConditionEvaluator.instance = new ConditionEvaluator()
    }
    return ConditionEvaluator.instance
  }

  public evaluateCondition(condition: Condition, order: any): boolean {
    try {
      // 获取字段值
      const value = this.getFieldValue(order, condition.field)
      
      // 获取操作符处理函数
      const handler = this.operatorHandlers[condition.operator]
      if (!handler) {
        console.error(`Unknown operator: ${condition.operator}`)
        return false
      }

      // 执行条件评估
      return handler(condition, value)
    } catch (error) {
      console.error('Error evaluating condition:', error)
      return false
    }
  }

  public evaluateConditionGroup(group: ConditionGroup, order: any): boolean {
    if (!group.enabled) return true
    if (!group.conditions.length) return true

    const results = group.conditions.map(condition => 
      this.evaluateCondition(condition, order)
    )

    switch (group.operator) {
      case 'all':
        return results.every(result => result)
      case 'any':
        return results.some(result => result)
      case 'none':
        return !results.some(result => result)
      default:
        return false
    }
  }

  private getFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (acc === null || acc === undefined) return acc
      return acc[part]
    }, obj)
  }
}

// 动作执行器
class ActionExecutor {
  private static instance: ActionExecutor
  private actionHandlers: Record<string, (action: Action, order: any) => Promise<boolean>>

  private constructor() {
    this.actionHandlers = {
      update_oms_status: async (action, order) => {
        try {
          // 实现更新OMS状态的逻辑
          console.log('Updating OMS status:', action.config.status)
          return true
        } catch (error) {
          console.error('Error updating OMS status:', error)
          return false
        }
      },
      set_priority: async (action, order) => {
        try {
          // 实现设置优先级的逻辑
          console.log('Setting priority:', action.config.priority)
          return true
        } catch (error) {
          console.error('Error setting priority:', error)
          return false
        }
      },
      hold: async (action, order) => {
        try {
          // 实现暂停订单的逻辑
          console.log('Holding order:', { reason: action.config.reason, duration: action.config.duration })
          return true
        } catch (error) {
          console.error('Error holding order:', error)
          return false
        }
      },
      send_email: async (action, order) => {
        try {
          // 实现发送邮件的逻辑
          console.log('Sending email:', {
            template: action.config.template,
            recipients: action.config.recipients
          })
          return true
        } catch (error) {
          console.error('Error sending email:', error)
          return false
        }
      },
      // ... 其他动作处理器
    }
  }

  public static getInstance(): ActionExecutor {
    if (!ActionExecutor.instance) {
      ActionExecutor.instance = new ActionExecutor()
    }
    return ActionExecutor.instance
  }

  public async executeAction(action: Action, order: any): Promise<boolean> {
    if (!action.enabled) return true

    const handler = this.actionHandlers[action.type]
    if (!handler) {
      console.error(`Unknown action type: ${action.type}`)
      return false
    }

    try {
      return await handler(action, order)
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error)
      return false
    }
  }

  public async executeActions(actions: Action[], order: any): Promise<boolean[]> {
    // 按order排序
    const sortedActions = [...actions].sort((a, b) => a.order - b.order)
    
    const results: boolean[] = []
    
    for (const action of sortedActions) {
      const success = await this.executeAction(action, order)
      results.push(success)
      
      // 如果动作失败且错误处理策略为stop，则停止执行后续动作
      if (!success && action.errorHandling === 'stop') {
        break
      }
    }
    
    return results
  }
}

// 规则执行器
export class RuleExecutor {
  private static instance: RuleExecutor
  private conditionEvaluator: ConditionEvaluator
  private actionExecutor: ActionExecutor

  private constructor() {
    this.conditionEvaluator = ConditionEvaluator.getInstance()
    this.actionExecutor = ActionExecutor.getInstance()
  }

  public static getInstance(): RuleExecutor {
    if (!RuleExecutor.instance) {
      RuleExecutor.instance = new RuleExecutor()
    }
    return RuleExecutor.instance
  }

  public async executeRule(rule: Rule, order: any): Promise<{
    matched: boolean
    actionResults: boolean[]
  }> {
    try {
      // 如果规则被禁用，直接返回
      if (!rule.enabled) {
        return { matched: false, actionResults: [] }
      }

      // 评估所有条件组
      const matched = rule.conditions.every(group =>
        this.conditionEvaluator.evaluateConditionGroup(group, order)
      )

      // 如果条件不匹配，直接返回
      if (!matched) {
        return { matched: false, actionResults: [] }
      }

      // 执行所有动作
      const actionResults = await this.actionExecutor.executeActions(rule.actions, order)

      return { matched: true, actionResults }
    } catch (error) {
      console.error('Error executing rule:', error)
      return { matched: false, actionResults: [] }
    }
  }

  public async executeRules(rules: Rule[], order: any): Promise<{
    ruleId: number
    matched: boolean
    actionResults: boolean[]
  }[]> {
    // 按优先级排序规则
    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority)
    
    const results = []
    
    for (const rule of sortedRules) {
      const { matched, actionResults } = await this.executeRule(rule, order)
      results.push({
        ruleId: rule.id,
        matched,
        actionResults
      })
    }
    
    return results
  }
}

// 规则测试器
export class RuleTester {
  private ruleExecutor: RuleExecutor

  constructor() {
    this.ruleExecutor = RuleExecutor.getInstance()
  }

  public async testRule(rule: Rule, testOrders: any[]): Promise<{
    orderId: string
    matched: boolean
    actionResults: boolean[]
  }[]> {
    const results = []
    
    for (const order of testOrders) {
      const { matched, actionResults } = await this.ruleExecutor.executeRule(rule, order)
      results.push({
        orderId: order.id,
        matched,
        actionResults
      })
    }
    
    return results
  }
}

// 导出单例实例
export const ruleExecutor = RuleExecutor.getInstance()
export const ruleTester = new RuleTester() 