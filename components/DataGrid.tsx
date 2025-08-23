'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, X, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { DataFile, ValidationError } from '@/types'
import { validateData } from '@/utils/validation'

interface DataGridProps {
  files: DataFile[]
  onDataUpdate: (fileId: string, newData: any[][]) => void
  onValidationUpdate: (errors: ValidationError[]) => void
  searchQuery?: string
}

export default function DataGrid({ files, onDataUpdate, onValidationUpdate, searchQuery }: DataGridProps) {
  const [activeFile, setActiveFile] = useState<string>('')
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [allErrors, setAllErrors] = useState<ValidationError[]>([])

  useEffect(() => {
    if (files.length > 0 && !activeFile) {
      setActiveFile(files[0].id)
    }
  }, [files, activeFile])

  useEffect(() => {
    // Validate all files and collect errors
    const errors: ValidationError[] = []
    files.forEach(file => {
      const fileErrors = validateData(file)
      errors.push(...fileErrors)
    })
    setAllErrors(errors)
    onValidationUpdate(errors)
  }, [files, onValidationUpdate])

  const currentFile = files.find(f => f.id === activeFile)

  const filteredData = useMemo(() => {
    if (!currentFile || !searchQuery) return currentFile?.data || []
    
    const query = searchQuery.toLowerCase()
    return currentFile.data.filter(row => 
      row.some(cell => 
        cell && cell.toString().toLowerCase().includes(query)
      )
    )
  }, [currentFile, searchQuery])

  const getCellErrors = (fileId: string, row: number, col: number) => {
    return allErrors.filter(error => 
      error.fileId === fileId && error.row === row && error.column === col
    )
  }

  const getCellClass = (fileId: string, row: number, col: number) => {
    const errors = getCellErrors(fileId, row, col)
    if (errors.length === 0) return 'data-cell'
    
    const hasError = errors.some(e => e.severity === 'error')
    const hasWarning = errors.some(e => e.severity === 'warning')
    
    if (hasError) return 'data-cell error'
    if (hasWarning) return 'data-cell warning'
    return 'data-cell'
  }

  const handleCellClick = (row: number, col: number) => {
    if (!currentFile) return
    setEditingCell({ row, col })
    setEditValue(currentFile.data[row][col]?.toString() || '')
  }

  const handleCellSave = () => {
    if (!currentFile || !editingCell) return
    
    const newData = [...currentFile.data]
    newData[editingCell.row][editingCell.col] = editValue
    
    onDataUpdate(currentFile.id, newData)
    setEditingCell(null)
    setEditValue('')
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const highlightSearchTerm = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<span class="search-highlight">$1</span>')
  }

  if (!currentFile) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No files uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* File Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        {files.map(file => {
          const fileErrors = allErrors.filter(e => e.fileId === file.id)
          const errorCount = fileErrors.filter(e => e.severity === 'error').length
          const warningCount = fileErrors.filter(e => e.severity === 'warning').length
          
          return (
            <button
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeFile === file.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{file.name}</span>
                {errorCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {errorCount}
                  </span>
                )}
                {warningCount > 0 && errorCount === 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {warningCount}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Data Grid */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentFile.name} ({filteredData.length} rows)
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Click cells to edit</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-cell font-semibold text-gray-900">#</th>
                {currentFile.headers.map((header, index) => (
                  <th key={index} className="table-cell font-semibold text-gray-900">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.02 }}
                  className="hover:bg-gray-50"
                >
                  <td className="table-cell font-medium text-gray-500">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => {
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex
                    const errors = getCellErrors(currentFile.id, rowIndex, colIndex)
                    const cellClass = getCellClass(currentFile.id, rowIndex, colIndex)
                    
                    return (
                      <td key={colIndex} className="relative">
                        {isEditing ? (
                          <div className="flex items-center space-x-2 p-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="input-field text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCellSave()
                                if (e.key === 'Escape') handleCellCancel()
                              }}
                            />
                            <button
                              onClick={handleCellSave}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCellCancel}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`${cellClass} cursor-pointer group`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                          >
                            <div className="flex items-center justify-between">
                              <span 
                                dangerouslySetInnerHTML={{
                                  __html: highlightSearchTerm(
                                    cell?.toString() || '', 
                                    searchQuery || ''
                                  )
                                }}
                              />
                              <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            {errors.length > 0 && (
                              <div className="validation-tooltip">
                                {errors.map(error => (
                                  <div key={error.id} className="flex items-center space-x-1">
                                    {error.severity === 'error' && <AlertTriangle className="w-3 h-3" />}
                                    {error.severity === 'warning' && <AlertTriangle className="w-3 h-3" />}
                                    {error.severity === 'info' && <Info className="w-3 h-3" />}
                                    <span>{error.message}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}