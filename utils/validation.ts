import { DataFile, ValidationError } from '@/types'

export function validateData(file: DataFile): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Check for missing columns based on file type
  const requiredColumns = getRequiredColumns(file.type)
  const missingColumns = requiredColumns.filter(col => 
    !file.headers.some(header => 
      header.toLowerCase().includes(col.toLowerCase()) ||
      col.toLowerCase().includes(header.toLowerCase())
    )
  )
  
  missingColumns.forEach(col => {
    errors.push({
      id: Math.random().toString(36).substr(2, 9),
      fileId: file.id,
      row: -1,
      column: -1,
      field: col,
      message: `Missing required column: ${col}`,
      severity: 'error',
      type: 'missing',
      suggestion: `Add a column for ${col} or rename an existing column`
    })
  })

  // Validate each row
  file.data.forEach((row, rowIndex) => {
    file.headers.forEach((header, colIndex) => {
      const cell = row[colIndex]
      const cellErrors = validateCell(file, rowIndex, colIndex, header, cell)
      errors.push(...cellErrors)
    })
  })

  // Check for duplicate IDs
  const idColumn = findIdColumn(file.headers)
  if (idColumn !== -1) {
    const ids = new Set()
    const duplicates = new Set()
    
    file.data.forEach((row, rowIndex) => {
      const id = row[idColumn]
      if (id && ids.has(id)) {
        duplicates.add(id)
        errors.push({
          id: Math.random().toString(36).substr(2, 9),
          fileId: file.id,
          row: rowIndex,
          column: idColumn,
          field: file.headers[idColumn],
          message: `Duplicate ID: ${id}`,
          severity: 'error',
          type: 'duplicate',
          suggestion: 'Ensure all IDs are unique'
        })
      }
      ids.add(id)
    })
  }

  return errors
}

function getRequiredColumns(fileType: string): string[] {
  switch (fileType) {
    case 'clients':
      return ['id', 'name', 'email', 'priority']
    case 'workers':
      return ['id', 'name', 'skills', 'availability']
    case 'tasks':
      return ['id', 'title', 'duration', 'priority']
    default:
      return ['id']
  }
}

function findIdColumn(headers: string[]): number {
  return headers.findIndex(header => 
    header.toLowerCase().includes('id') && 
    !header.toLowerCase().includes('client') &&
    !header.toLowerCase().includes('task') &&
    !header.toLowerCase().includes('worker')
  )
}

function validateCell(
  file: DataFile, 
  rowIndex: number, 
  colIndex: number, 
  header: string, 
  cell: any
): ValidationError[] {
  const errors: ValidationError[] = []
  const headerLower = header.toLowerCase()

  // Check for empty required fields
  if (!cell || cell.toString().trim() === '') {
    if (headerLower.includes('id') || headerLower.includes('name') || headerLower.includes('email')) {
      errors.push({
        id: Math.random().toString(36).substr(2, 9),
        fileId: file.id,
        row: rowIndex,
        column: colIndex,
        field: header,
        message: `Missing required value in ${header}`,
        severity: 'error',
        type: 'missing',
        suggestion: 'Provide a value for this required field'
      })
    }
    return errors
  }

  const cellStr = cell.toString().trim()

  // Email validation
  if (headerLower.includes('email')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cellStr)) {
      errors.push({
        id: Math.random().toString(36).substr(2, 9),
        fileId: file.id,
        row: rowIndex,
        column: colIndex,
        field: header,
        message: `Invalid email format: ${cellStr}`,
        severity: 'error',
        type: 'malformed',
        suggestion: 'Use format: user@domain.com'
      })
    }
  }

  // Priority validation
  if (headerLower.includes('priority')) {
    const priority = parseInt(cellStr)
    if (isNaN(priority) || priority < 1 || priority > 5) {
      errors.push({
        id: Math.random().toString(36).substr(2, 9),
        fileId: file.id,
        row: rowIndex,
        column: colIndex,
        field: header,
        message: `Priority must be between 1-5, got: ${cellStr}`,
        severity: 'error',
        type: 'range',
        suggestion: 'Use values 1 (low) to 5 (high)'
      })
    }
  }

  // Duration validation
  if (headerLower.includes('duration')) {
    const duration = parseFloat(cellStr)
    if (isNaN(duration) || duration <= 0) {
      errors.push({
        id: Math.random().toString(36).substr(2, 9),
        fileId: file.id,
        row: rowIndex,
        column: colIndex,
        field: header,
        message: `Duration must be a positive number, got: ${cellStr}`,
        severity: 'error',
        type: 'range',
        suggestion: 'Use positive numbers (hours/days)'
      })
    }
  }

  // Budget validation
  if (headerLower.includes('budget')) {
    const budget = parseFloat(cellStr.replace(/[$,]/g, ''))
    if (isNaN(budget) || budget < 0) {
      errors.push({
        id: Math.random().toString(36).substr(2, 9),
        fileId: file.id,
        row: rowIndex,
        column: colIndex,
        field: header,
        message: `Budget must be a positive number, got: ${cellStr}`,
        severity: 'warning',
        type: 'range',
        suggestion: 'Use positive numbers without currency symbols'
      })
    }
  }

  // Skills validation (should be comma-separated)
  if (headerLower.includes('skill')) {
    if (cellStr.includes(';') || cellStr.includes('|')) {
      errors.push({
        id: Math.random().toString(36).substr(2, 9),
        fileId: file.id,
        row: rowIndex,
        column: colIndex,
        field: header,
        message: `Skills should be comma-separated, got: ${cellStr}`,
        severity: 'warning',
        type: 'malformed',
        suggestion: 'Use commas to separate skills: "JavaScript, React, Node.js"'
      })
    }
  }

  // JSON validation
  if (cellStr.startsWith('{') || cellStr.startsWith('[')) {
    try {
      JSON.parse(cellStr)
    } catch {
      errors.push({
        id: Math.random().toString(36).substr(2, 9),
        fileId: file.id,
        row: rowIndex,
        column: colIndex,
        field: header,
        message: `Invalid JSON format in ${header}`,
        severity: 'error',
        type: 'malformed',
        suggestion: 'Fix JSON syntax or use plain text'
      })
    }
  }

  return errors
}