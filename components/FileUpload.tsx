'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import toast from 'react-hot-toast'
import { DataFile } from '@/types'

interface FileUploadProps {
  onFilesUploaded: (files: DataFile[]) => void
}

export default function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<DataFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = useCallback(async (file: File): Promise<DataFile | null> => {
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      let data: any[][] = []
      let headers: string[] = []

      if (fileExtension === 'csv') {
        return new Promise((resolve) => {
          Papa.parse(file, {
            complete: (results) => {
              if (results.data && results.data.length > 0) {
                headers = results.data[0] as string[]
                data = results.data.slice(1) as any[][]
                
                // Normalize headers
                headers = headers.map(header => 
                  header.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
                )

                const dataFile: DataFile = {
                  id: Math.random().toString(36).substr(2, 9),
                  name: file.name,
                  type: detectFileType(file.name, headers),
                  headers,
                  data,
                  originalData: JSON.parse(JSON.stringify(data)),
                  errors: []
                }
                resolve(dataFile)
              } else {
                resolve(null)
              }
            },
            header: false,
            skipEmptyLines: true
          })
        })
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        if (jsonData.length > 0) {
          headers = (jsonData[0] as any[]).map(header => 
            header.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
          )
          data = jsonData.slice(1) as any[][]

          const dataFile: DataFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: detectFileType(file.name, headers),
            headers,
            data,
            originalData: JSON.parse(JSON.stringify(data)),
            errors: []
          }
          return dataFile
        }
      }
      
      return null
    } catch (error) {
      console.error('Error processing file:', error)
      toast.error(`Error processing ${file.name}`)
      return null
    }
  }, [])

  const detectFileType = (fileName: string, headers: string[]): 'clients' | 'workers' | 'tasks' => {
    const name = fileName.toLowerCase()
    const headerStr = headers.join(' ').toLowerCase()
    
    if (name.includes('client') || headerStr.includes('client') || headerStr.includes('customer')) {
      return 'clients'
    } else if (name.includes('worker') || name.includes('employee') || headerStr.includes('worker') || headerStr.includes('employee')) {
      return 'workers'
    } else {
      return 'tasks'
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true)
    const processedFiles: DataFile[] = []

    for (const file of acceptedFiles) {
      const processedFile = await processFile(file)
      if (processedFile) {
        processedFiles.push(processedFile)
      }
    }

    setUploadedFiles(prev => [...prev, ...processedFiles])
    setIsProcessing(false)
    
    if (processedFiles.length > 0) {
      toast.success(`Successfully processed ${processedFiles.length} file(s)`)
    }
  }, [processFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const handleContinue = () => {
    if (uploadedFiles.length > 0) {
      onFilesUploaded(uploadedFiles)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className={`w-8 h-8 ${isDragActive ? 'text-blue-600' : 'text-blue-500'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isDragActive ? 'Drop files here' : 'Upload your data files'}
            </h3>
            <p className="text-gray-600 mt-1">
              Drag & drop CSV or Excel files, or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports: clients.csv, workers.xlsx, tasks.csv
            </p>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-600 font-medium">Processing files...</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-semibold text-gray-900">Uploaded Files</h4>
            
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    file.type === 'clients' ? 'bg-green-100 text-green-600' :
                    file.type === 'workers' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.type} • {file.data.length} rows • {file.headers.length} columns
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleContinue}
                className="btn-primary"
                disabled={uploadedFiles.length === 0}
              >
                Continue to Data Editing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Data Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Expected File Formats</h4>
            <div className="mt-2 text-sm text-blue-800 space-y-1">
              <p><strong>Clients:</strong> ID, Name, Email, Priority, Budget</p>
              <p><strong>Workers:</strong> ID, Name, Skills, Availability, Rate</p>
              <p><strong>Tasks:</strong> ID, Title, Duration, Priority, RequiredSkills, ClientID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}