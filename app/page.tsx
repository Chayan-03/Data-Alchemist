'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Database, Settings, Download, Sparkles, FileText, Users, CheckCircle } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import DataGrid from '@/components/DataGrid'
import ValidationPanel from '@/components/ValidationPanel'
import RulesBuilder from '@/components/RulesBuilder'
import PrioritizationInterface from '@/components/PrioritizationInterface'
import ExportPanel from '@/components/ExportPanel'
import NaturalLanguageSearch from '@/components/NaturalLanguageSearch'
import { DataFile, ValidationError, Rule, PriorityWeights } from '@/types'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [files, setFiles] = useState<DataFile[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [priorities, setPriorities] = useState<PriorityWeights>({
    priorityLevel: 0.3,
    taskFulfillment: 0.25,
    fairness: 0.2,
    efficiency: 0.15,
    resourceUtilization: 0.1
  })
  const [searchQuery, setSearchQuery] = useState('')

  const steps = [
    { id: 0, title: 'Upload Data', icon: Upload, description: 'Upload your CSV/Excel files' },
    { id: 1, title: 'Edit & Validate', icon: Database, description: 'Clean and validate your data' },
    { id: 2, title: 'Create Rules', icon: Settings, description: 'Build business rules' },
    { id: 3, title: 'Set Priorities', icon: Sparkles, description: 'Configure priorities' },
    { id: 4, title: 'Export', icon: Download, description: 'Download clean data' }
  ]

  const handleFilesUploaded = (uploadedFiles: DataFile[]) => {
    setFiles(uploadedFiles)
    setCurrentStep(1)
  }

  const handleValidationUpdate = (errors: ValidationError[]) => {
    setValidationErrors(errors)
  }

  const handleDataUpdate = (fileId: string, newData: any[][]) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, data: newData } : file
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Data Alchemist
                </h1>
                <p className="text-sm text-gray-600">Transform messy data into gold</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{files.length} files</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4" />
                <span>{validationErrors.length} issues</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(step.id)}
              >
                <step.icon className="w-5 h-5" />
              </motion.div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block w-16 h-0.5 ml-6 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FileUpload onFilesUploaded={handleFilesUploaded} />
            </motion.div>
          )}

          {currentStep === 1 && files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <NaturalLanguageSearch 
                files={files}
                onSearch={setSearchQuery}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <DataGrid
                    files={files}
                    onDataUpdate={handleDataUpdate}
                    onValidationUpdate={handleValidationUpdate}
                    searchQuery={searchQuery}
                  />
                </div>
                <div className="lg:col-span-1">
                  <ValidationPanel errors={validationErrors} />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary"
                  disabled={validationErrors.filter(e => e.severity === 'error').length > 0}
                >
                  Continue to Rules
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RulesBuilder
                files={files}
                rules={rules}
                onRulesUpdate={setRules}
                onNext={() => setCurrentStep(3)}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PrioritizationInterface
                priorities={priorities}
                onPrioritiesUpdate={setPriorities}
                onNext={() => setCurrentStep(4)}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ExportPanel
                files={files}
                rules={rules}
                priorities={priorities}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}