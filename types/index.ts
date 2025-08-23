export interface DataFile {
  id: string
  name: string
  type: 'clients' | 'workers' | 'tasks'
  headers: string[]
  data: any[][]
  originalData: any[][]
  errors: ValidationError[]
}

export interface ValidationError {
  id: string
  fileId: string
  row: number
  column: number
  field: string
  message: string
  severity: 'error' | 'warning' | 'info'
  type: 'missing' | 'duplicate' | 'malformed' | 'range' | 'reference' | 'conflict' | 'saturation' | 'coverage'
  suggestion?: string
}

export interface Rule {
  id: string
  name: string
  type: 'co-run' | 'slot-restriction' | 'load-limit' | 'phase-restriction' | 'regex-filter'
  description: string
  conditions: RuleCondition[]
  actions: RuleAction[]
  enabled: boolean
  priority: number
}

export interface RuleCondition {
  field: string
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'regex' | 'in' | 'not-in'
  value: any
  logicalOperator?: 'AND' | 'OR'
}

export interface RuleAction {
  type: 'group' | 'restrict' | 'limit' | 'assign' | 'flag'
  target: string
  value: any
  parameters?: Record<string, any>
}

export interface PriorityWeights {
  priorityLevel: number
  taskFulfillment: number
  fairness: number
  efficiency: number
  resourceUtilization: number
}

export interface ExportConfig {
  includeOriginalData: boolean
  includeValidationReport: boolean
  includeRulesJson: boolean
  includePriorities: boolean
  format: 'csv' | 'xlsx' | 'json'
}

export interface AIFeature {
  type: 'fix-suggestion' | 'rule-recommendation' | 'natural-search' | 'auto-validation'
  confidence: number
  suggestion: string
  data?: any
}

export interface SearchResult {
  fileId: string
  fileName: string
  matches: SearchMatch[]
}

export interface SearchMatch {
  row: number
  column: number
  field: string
  value: any
  context: string
}