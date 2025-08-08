// Basic types
export type OperatorType = 'all' | 'any'
export type MessageType = 'success' | 'warning' | 'error'
export type FieldType = 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object' | 'date' | 'datetime' | 'text' | 'dynamic'

// Operator related interfaces
export interface OperatorOption {
  label: string
  value: string
  applicableTypes: FieldType[]
  description: string
  example: string
}

// Field option interface
export interface FieldOption {
  label: string
  value: string | number | boolean
  description?: string
  fieldType?: string
  options?: string[]
}

// Field configuration interface
export interface FieldConfig {
  name: string
  type: FieldType
  label: string
  description?: string
  required?: boolean
  min?: number
  max?: number
  default?: any
  options?: FieldOption[]
  fields?: FieldConfig[]
  show_when?: {
    field: string
    value: any
  }
}

// Action configuration interface
export interface ActionConfig {
  fields: FieldConfig[]
}

// Action option interface
export interface ActionOption {
  label: string
  value: string
  description: string
  config: ActionConfig
}

// Action group interface
export interface ActionGroup {
  key: string
  label: string
  description: string
  actions: ActionOption[]
}

// Action interface
export interface Action {
  type: string
  config: Record<string, any>
  order: number
}

// Condition interfaces
export interface Condition {
  field: string
  operator: string
  value: string | number | boolean | any[]
}

export interface ConditionGroup {
  operator: OperatorType
  conditions: Condition[]
}

// Rule interface
export interface Rule {
  id: number
  name: string
  description: string
  conditions: ConditionGroup[]
  actions: Action[]
  enabled?: boolean
  lastModified: string
  createdBy: string
  modifiedBy: string
  source: string
}

// Field group interface
export interface FieldGroup {
  key: string
  label: string
  description: string
  fields: FieldOption[]
} 