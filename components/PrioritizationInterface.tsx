'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, RotateCcw, Target, TrendingUp } from 'lucide-react'
import { PriorityWeights } from '@/types'

interface PrioritizationInterfaceProps {
  priorities: PriorityWeights
  onPrioritiesUpdate: (priorities: PriorityWeights) => void
  onNext: () => void
}

export default function PrioritizationInterface({ 
  priorities, 
  onPrioritiesUpdate, 
  onNext 
}: PrioritizationInterfaceProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const priorityItems = [
    {
      key: 'priorityLevel' as keyof PriorityWeights,
      label: 'Priority Level',
      description: 'Weight given to task priority ratings',
      icon: Target,
      color: 'text-red-600'
    },
    {
      key: 'taskFulfillment' as keyof PriorityWeights,
      label: 'Task Fulfillment',
      description: 'Importance of completing all assigned tasks',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      key: 'fairness' as keyof PriorityWeights,
      label: 'Fairness',
      description: 'Equal distribution of workload among workers',
      icon: Sliders,
      color: 'text-green-600'
    },
    {
      key: 'efficiency' as keyof PriorityWeights,
      label: 'Efficiency',
      description: 'Optimal use of time and resources',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      key: 'resourceUtilization' as keyof PriorityWeights,
      label: 'Resource Utilization',
      description: 'Maximum use of available resources',
      icon: Target,
      color: 'text-orange-600'
    }
  ]

  const templates = [
    {
      id: 'balanced',
      name: 'Balanced Approach',
      description: 'Equal weight to all factors',
      weights: {
        priorityLevel: 0.2,
        taskFulfillment: 0.2,
        fairness: 0.2,
        efficiency: 0.2,
        resourceUtilization: 0.2
      }
    },
    {
      id: 'priority-focused',
      name: 'Priority Focused',
      description: 'Emphasizes task priorities',
      weights: {
        priorityLevel: 0.5,
        taskFulfillment: 0.2,
        fairness: 0.1,
        efficiency: 0.1,
        resourceUtilization: 0.1
      }
    },
    {
      id: 'efficiency-first',
      name: 'Efficiency First',
      description: 'Optimizes for speed and efficiency',
      weights: {
        priorityLevel: 0.1,
        taskFulfillment: 0.2,
        fairness: 0.1,
        efficiency: 0.5,
        resourceUtilization: 0.1
      }
    },
    {
      id: 'fair-distribution',
      name: 'Fair Distribution',
      description: 'Ensures equal workload distribution',
      weights: {
        priorityLevel: 0.1,
        taskFulfillment: 0.2,
        fairness: 0.5,
        efficiency: 0.1,
        resourceUtilization: 0.1
      }
    }
  ]

  const handleSliderChange = (key: keyof PriorityWeights, value: number) => {
    const newPriorities = { ...priorities, [key]: value }
    
    // Normalize to ensure sum equals 1
    const total = Object.values(newPriorities).reduce((sum, val) => sum + val, 0)
    if (total > 0) {
      Object.keys(newPriorities).forEach(k => {
        newPriorities[k as keyof PriorityWeights] = newPriorities[k as keyof PriorityWeights] / total
      })
    }
    
    onPrioritiesUpdate(newPriorities)
  }

  const applyTemplate = (template: typeof templates[0]) => {
    onPrioritiesUpdate(template.weights)
    setSelectedTemplate(template.id)
  }

  const resetToDefault = () => {
    onPrioritiesUpdate({
      priorityLevel: 0.3,
      taskFulfillment: 0.25,
      fairness: 0.2,
      efficiency: 0.15,
      resourceUtilization: 0.1
    })
    setSelectedTemplate('')
  }

  const total = Object.values(priorities).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prioritization Settings</h2>
          <p className="text-gray-600">Configure how different factors should be weighted in your data processing</p>
        </div>
        <button
          onClick={resetToDefault}
          className="btn-secondary flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Default</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Sliders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Weights</h3>
            
            <div className="space-y-6">
              {priorityItems.map((item) => {
                const Icon = item.icon
                const value = priorities[item.key]
                const percentage = Math.round(value * 100)
                
                return (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <div>
                          <label className="font-medium text-gray-900">
                            {item.label}
                          </label>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={value}
                        onChange={(e) => handleSliderChange(item.key, parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, ${item.color.replace('text-', 'rgb(var(--color-')} 0%, ${item.color.replace('text-', 'rgb(var(--color-')} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                        }}
                      />
                      <div 
                        className="absolute top-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg pointer-events-none"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Total Validation */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Weight:</span>
                <span className={`text-sm font-semibold ${
                  Math.abs(total - 1) < 0.01 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.round(total * 100)}%
                </span>
              </div>
              {Math.abs(total - 1) >= 0.01 && (
                <p className="text-xs text-red-600 mt-1">
                  Weights should sum to 100%. Current total: {Math.round(total * 100)}%
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            
            <div className="space-y-3">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                  
                  <div className="mt-3 space-y-1">
                    {Object.entries(template.weights).map(([key, weight]) => {
                      const item = priorityItems.find(i => i.key === key)
                      return (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-600">{item?.label}</span>
                          <span className="font-medium">{Math.round(weight * 100)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Visual Representation */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Distribution</h3>
            
            <div className="space-y-3">
              {priorityItems.map((item) => {
                const percentage = Math.round(priorities[item.key] * 100)
                const Icon = item.icon
                
                return (
                  <div key={item.key} className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={onNext}
          className="btn-primary"
          disabled={Math.abs(total - 1) >= 0.01}
        >
          Continue to Export
        </button>
      </div>
    </div>
  )
}