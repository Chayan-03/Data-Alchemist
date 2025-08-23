'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, AlertCircle, Info, CheckCircle, Filter, X } from 'lucide-react'
import { ValidationError } from '@/types'

interface ValidationPanelProps {
  errors: ValidationError[]
}

export default function ValidationPanel({ errors }: ValidationPanelProps) {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all')
  const [expandedError, setExpandedError] = useState<string | null>(null)

  const filteredErrors = errors.filter(error => {
    if (filter === 'all') return true
    return error.severity === filter
  })

  const errorCounts = {
    error: errors.filter(e => e.severity === 'error').length,
    warning: errors.filter(e => e.severity === 'warning').length,
    info: errors.filter(e => e.severity === 'info').length
  }

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-l-red-500 bg-red-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'info':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="card h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Validation Issues</h3>
        {errors.length === 0 && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{errorCounts.error}</div>
          <div className="text-xs text-red-600">Errors</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">{errorCounts.warning}</div>
          <div className="text-xs text-yellow-600">Warnings</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{errorCounts.info}</div>
          <div className="text-xs text-blue-600">Info</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">All Issues</option>
          <option value="error">Errors Only</option>
          <option value="warning">Warnings Only</option>
          <option value="info">Info Only</option>
        </select>
      </div>

      {/* Error List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredErrors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              {errors.length === 0 ? (
                <div>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p>No validation issues found!</p>
                  <p className="text-sm">Your data looks clean.</p>
                </div>
              ) : (
                <p>No {filter} issues found.</p>
              )}
            </motion.div>
          ) : (
            filteredErrors.map((error) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`border-l-4 p-3 rounded-r-lg ${getSeverityColor(error.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    {getIcon(error.severity)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {error.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Row {error.row + 1}, Column: {error.field}
                      </p>
                      {error.suggestion && (
                        <p className="text-xs text-blue-600 mt-1">
                          💡 {error.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedError(
                      expandedError === error.id ? null : error.id
                    )}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {expandedError === error.id ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {expandedError === error.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 pt-2 border-t border-gray-200"
                    >
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Type:</strong> {error.type}</p>
                        <p><strong>Severity:</strong> {error.severity}</p>
                        <p><strong>File:</strong> {error.fileId}</p>
                        {error.suggestion && (
                          <div className="mt-2 p-2 bg-blue-100 rounded text-blue-800">
                            <strong>Suggestion:</strong> {error.suggestion}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {errorCounts.error > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full btn-secondary text-sm">
            Auto-fix Common Issues
          </button>
        </div>
      )}
    </div>
  )
}