import type { Rule } from '../types/automation'
import request from '../utils/request'

export default {
  // 获取规则列表
  getRules(params?: {
    enabled?: boolean
    search?: string
    page?: number
    pageSize?: number
    sort?: string
    order?: 'asc' | 'desc'
  }) {
    return request({
      url: '/api/automation/rules',
      method: 'get',
      params
    })
  },

  // 获取单个规则
  getRule(id: number) {
    return request({
      url: `/api/automation/rules/${id}`,
      method: 'get'
    })
  },

  // 创建规则
  createRule(rule: Omit<Rule, 'id'>) {
    return request({
      url: '/api/automation/rules',
      method: 'post',
      data: rule
    })
  },

  // 更新规则
  updateRule(id: number, rule: Partial<Rule>) {
    return request({
      url: `/api/automation/rules/${id}`,
      method: 'put',
      data: rule
    })
  },

  // 删除规则
  deleteRule(id: number) {
    return request({
      url: `/api/automation/rules/${id}`,
      method: 'delete'
    })
  },

  // 启用/禁用规则
  toggleRule(id: number, enabled: boolean) {
    return request({
      url: `/api/automation/rules/${id}/toggle`,
      method: 'put',
      data: { enabled }
    })
  },

  // 复制规则
  cloneRule(id: number) {
    return request({
      url: `/api/automation/rules/${id}/clone`,
      method: 'post'
    })
  },

  // 获取规则执行历史
  getRuleHistory(id: number, params?: {
    startTime?: string
    endTime?: string
    status?: string
    page?: number
    pageSize?: number
  }) {
    return request({
      url: `/api/automation/rules/${id}/history`,
      method: 'get',
      params
    })
  },

  // 测试规则
  testRule(id: number, orders: string[]) {
    return request({
      url: `/api/automation/rules/${id}/test`,
      method: 'post',
      data: { orders }
    })
  },

  // 批量执行规则
  executeRules(orderIds: string[]) {
    return request({
      url: '/api/automation/rules/execute',
      method: 'post',
      data: { orderIds }
    })
  },

  // 获取字段选项
  getFieldOptions() {
    return request({
      url: '/api/automation/fields',
      method: 'get'
    })
  },

  // 获取动作选项
  getActionOptions() {
    return request({
      url: '/api/automation/actions',
      method: 'get'
    })
  },

  // 获取规则模板
  getRuleTemplates() {
    return request({
      url: '/api/automation/templates',
      method: 'get'
    })
  },

  // 从模板创建规则
  createRuleFromTemplate(templateId: number, data: {
    name: string
    description?: string
    enabled?: boolean
  }) {
    return request({
      url: `/api/automation/templates/${templateId}/create`,
      method: 'post',
      data
    })
  },

  // 保存为模板
  saveAsTemplate(id: number, data: {
    name: string
    description?: string
    category?: string
  }) {
    return request({
      url: `/api/automation/rules/${id}/save-as-template`,
      method: 'post',
      data
    })
  }
} 