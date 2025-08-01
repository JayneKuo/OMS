// Basic types
export type OperatorType = 'all' | 'any'
export type MessageType = 'success' | 'warning' | 'error'
export type FieldType = 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'date' | 'object' | 'text' | 'dynamic'

// Dynamic field type definition
export interface DynamicTypeConfig {
  type: FieldType
  options?: { label: string; value: string | number | boolean }[]
  itemType?: string
  fields?: CustomField[]
  min?: number
  max?: number
}

export interface DynamicField extends CustomField {
  type: 'dynamic'
  dynamicType: { [key: string]: DynamicTypeConfig }
}

// Field related interfaces
export interface CustomField {
  name: string
  type: FieldType
  label: string
  description: string
  required?: boolean
  options?: { label: string; value: string | number | boolean }[]
  fields?: CustomField[]
  min?: number
  max?: number
  default?: any
}

export interface FieldOption {
  label: string
  value: string
  type: FieldType
  description: string
  options?: { label: string; value: string }[]
}

export interface FieldGroup {
  key: string
  label: string
  description: string
  fields: FieldOption[]
}

// Action related interfaces
export interface ActionConfig {
  fields: CustomField[]
}

export interface Action {
  type: string
  config: { [key: string]: any }
  order: number
}

export interface ActionOption {
  label: string
  value: string
  description: string
  config: ActionConfig
}

export interface ActionGroup {
  key: string
  label: string
  description: string
  actions: ActionOption[]
}

// Rule related interfaces
export interface Condition {
  field: string
  operator: string
  value: string | number | boolean | any[]
}

export interface ConditionGroup {
  operator: OperatorType
  conditions: Condition[]
}

export interface Rule {
  id: number
  name: string
  description: string
  conditions: ConditionGroup[]
  actions: Action[]
  lastModified: string
  createdBy: string
  modifiedBy: string
} 