'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Settings, Trash2, Edit, Save, X, Lightbulb } from 'lucide-react'
import { DataFile, Rule, RuleCondition, RuleAction } from '@/types'

interface RulesBuilderProps {
  files: DataFile[]
  rules: Rule[]
  onRulesUpdate: (rules: Rule[]) => void
  onNext: () => void
}

export default function RulesBuilder({ files, rules, onRulesUpdate, onNext }: RulesBuilderProps) {
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    name: '',
    type: 'co-run',
    description: '',
    conditions: [],
    actions: [],
    enabled: true,
    priority: 1
  })

  const ruleTypes = [
    { value: 'co-run', label: 'Co-run Tasks', description: 'Tasks that should run together' },
    { value: 'slot-restriction', label: 'Slot Restrictions', description: 'Minimum slots for task groups' },
    { value: 'load-limit', label: 'Load Limits', description: 'Maximum workload per worker' },
    { value: 'phase-restriction', label: 'Phase Restrictions', description: 'Allowed phases for tasks' },
    { value: 'regex-filter', label: 'Regex Filters', description: 'Pattern-based data filtering' }
  ]

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not-equals', label: 'Not Equals' },
    { value: 'greater-than', label: 'Greater Than' },
    { value: 'less-than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'regex', label: 'Regex Match' },
    { value: 'in', label: 'In List' },
    { value: 'not-in', label: 'Not In List' }
  ]

  const getAvailableFields = () => {
    const fields: string[] = []
    files.forEach(file => {
      file.headers.forEach(header => {
        if (!fields.includes(header)) {
          fields.push(header)
        }
      })
    })
    return fields
  }

  const addCondition = () => {
    const newCondition: RuleCondition = {
      field: '',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    }
    setNewRule(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), newCondition]
    }))
  }

  const updateCondition = (index: number, condition: RuleCondition) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions?.map((c, i) => i === index ? condition : c) || []
    }))
  }

  const removeCondition = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index) || []
    }))
  }

  const addAction = () => {
    const newAction: RuleAction = {
      type: 'group',
      target: '',
      value: ''
    }
    setNewRule(prev => ({
      ...prev,
      actions: [...(prev.actions || []), newAction]
    }))
  }

  const updateAction = (index: number, action: RuleAction) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions?.map((a, i) => i === index ? action : a) || []
    }))
  }

  const removeAction = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== index) || []
    }))
  }

  const saveRule = () => {
    if (!newRule.name || !newRule.type) return

    const rule: Rule = {
      id: editingRule?.id || Math.random().toString(36).substr(2, 9),
      name: newRule.name!,
      type: newRule.type!,
      description: newRule.description || '',
      conditions: newRule.conditions || [],
      actions: newRule.actions || [],
      enabled: newRule.enabled ?? true,
      priority: newRule.priority || 1
    }

    if (editingRule) {
      onRulesUpdate(rules.map(r => r.id === rule.id ? rule : r))
    } else {
      onRulesUpdate([...rules, rule])
    }

    resetForm()
  }

  const resetForm = () => {
    setNewRule({
      name: '',
      type: 'co-run',
      description: '',
      conditions: [],
      actions: [],
      enabled: true,
      priority: 1
    })
    setEditingRule(null)
    setShowRuleForm(false)
  }

  const editRule = (rule: Rule) => {
    setNewRule(rule)
    setEditingRule(rule)
    setShowRuleForm(true)
  }

  const deleteRule = (ruleId: string) => {
    onRulesUpdate(rules.filter(r => r.id !== ruleId))
  }

  const toggleRule = (ruleId: string) => {
    onRulesUpdate(rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const suggestedRules = [
    {
      name: 'High Priority Co-run',
      type: 'co-run' as const,
      description: 'Group high priority tasks together',
      conditions: [{ field: 'priority', operator: 'equals' as const, value: 'high' }],
      actions: [{ type: 'group' as const, target: 'tasks', value: 'high_priority_group' }]
    },
    {
      name: 'Skill-based Assignment',
      type: 'phase-restriction' as const,
      description: 'Assign tasks based on required skills',
      conditions: [{ field: 'required_skills', operator: 'contains' as const, value: 'javascript' }],
      actions: [{ type: 'assign' as const, target: 'worker', value: 'javascript_developers' }]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rules Builder</h2>
          <p className="text-gray-600">Create business rules to govern your data processing</p>
        </div>
        <button
          onClick={() => setShowRuleForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Existing Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rules.map(rule => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card border-l-4 ${
              rule.enabled ? 'border-l-green-500' : 'border-l-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rule.enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Type:</span> {rule.type} • 
                  <span className="font-medium ml-1">Priority:</span> {rule.priority} • 
                  <span className="font-medium ml-1">Conditions:</span> {rule.conditions.length}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    rule.enabled 
                      ? 'text-green-600 hover:bg-green-100' 
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editRule(rule)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Suggested Rules */}
      {rules.length === 0 && (
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Suggested Rules</h4>
              <p className="text-sm text-blue-800 mt-1">
                Here are some common rules you might want to create:
              </p>
              <div className="mt-3 space-y-2">
                {suggestedRules.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setNewRule({
                        ...suggestion,
                        enabled: true,
                        priority: 1
                      })
                      setShowRuleForm(true)
                    }}
                    className="block w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="font-medium text-blue-900">{suggestion.name}</div>
                    <div className="text-sm text-blue-700">{suggestion.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rule Form Modal */}
      <AnimatePresence>
        {showRuleForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingRule ? 'Edit Rule' : 'Create New Rule'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rule Name
                      </label>
                      <input
                        type="text"
                        value={newRule.name || ''}
                        onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field"
                        placeholder="Enter rule name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rule Type
                      </label>
                      <select
                        value={newRule.type || ''}
                        onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as any }))}
                        className="input-field"
                      >
                        {ruleTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newRule.description || ''}
                      onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field"
                      rows={3}
                      placeholder="Describe what this rule does"
                    />
                  </div>

                  {/* Conditions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Conditions
                      </label>
                      <button
                        onClick={addCondition}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Condition
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {newRule.conditions?.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <select
                            value={condition.field}
                            onChange={(e) => updateCondition(index, { ...condition, field: e.target.value })}
                            className="input-field flex-1"
                          >
                            <option value="">Select field</option>
                            {getAvailableFields().map(field => (
                              <option key={field} value={field}>{field}</option>
                            ))}
                          </select>
                          
                          <select
                            value={condition.operator}
                            onChange={(e) => updateCondition(index, { ...condition, operator: e.target.value as any })}
                            className="input-field"
                          >
                            {operators.map(op => (
                              <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                          </select>
                          
                          <input
                            type="text"
                            value={condition.value}
                            onChange={(e) => updateCondition(index, { ...condition, value: e.target.value })}
                            className="input-field flex-1"
                            placeholder="Value"
                          />
                          
                          <button
                            onClick={() => removeCondition(index)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Actions
                      </label>
                      <button
                        onClick={addAction}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Action
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {newRule.actions?.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <select
                            value={action.type}
                            onChange={(e) => updateAction(index, { ...action, type: e.target.value as any })}
                            className="input-field"
                          >
                            <option value="group">Group</option>
                            <option value="restrict">Restrict</option>
                            <option value="limit">Limit</option>
                            <option value="assign">Assign</option>
                            <option value="flag">Flag</option>
                          </select>
                          
                          <input
                            type="text"
                            value={action.target}
                            onChange={(e) => updateAction(index, { ...action, target: e.target.value })}
                            className="input-field flex-1"
                            placeholder="Target"
                          />
                          
                          <input
                            type="text"
                            value={action.value}
                            onChange={(e) => updateAction(index, { ...action, value: e.target.value })}
                            className="input-field flex-1"
                            placeholder="Value"
                          />
                          
                          <button
                            onClick={() => removeAction(index)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={newRule.priority || 1}
                        onChange={(e) => setNewRule(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                        className="input-field"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newRule.enabled ?? true}
                          onChange={(e) => setNewRule(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Rule</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveRule}
                    className="btn-primary flex items-center space-x-2"
                    disabled={!newRule.name || !newRule.type}
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingRule ? 'Update Rule' : 'Create Rule'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={onNext}
          className="btn-primary"
        >
          Continue to Prioritization
        </button>
      </div>
    </div>
  )
}