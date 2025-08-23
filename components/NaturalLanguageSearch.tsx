'use client'

import { useState } from 'react'
import { Search, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DataFile, SearchResult } from '@/types'

interface NaturalLanguageSearchProps {
  files: DataFile[]
  onSearch: (query: string) => void
}

export default function NaturalLanguageSearch({ files, onSearch }: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState('')
  const [isAIMode, setIsAIMode] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      onSearch('')
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (isAIMode) {
      // Process natural language query
      const processedQuery = processNaturalLanguage(searchQuery)
      onSearch(processedQuery)
    } else {
      // Direct search
      onSearch(searchQuery)
    }
    
    setIsSearching(false)
  }

  const processNaturalLanguage = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    // Handle duration queries
    if (lowerQuery.includes('duration') && lowerQuery.includes('>')) {
      const match = lowerQuery.match(/duration\s*>\s*(\d+)/)
      if (match) {
        return `duration>${match[1]}`
      }
    }
    
    // Handle priority queries
    if (lowerQuery.includes('priority') || lowerQuery.includes('high priority')) {
      if (lowerQuery.includes('high')) return 'priority:high'
      if (lowerQuery.includes('low')) return 'priority:low'
    }
    
    // Handle skill queries
    if (lowerQuery.includes('skill')) {
      const skillMatch = lowerQuery.match(/skill[s]?\s+(\w+)/)
      if (skillMatch) return skillMatch[1]
    }
    
    // Handle status queries
    if (lowerQuery.includes('completed') || lowerQuery.includes('done')) {
      return 'status:completed'
    }
    
    if (lowerQuery.includes('pending') || lowerQuery.includes('waiting')) {
      return 'status:pending'
    }
    
    // Default to original query
    return query
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
    setSearchResults([])
  }

  const exampleQueries = [
    "Show tasks with Duration > 2",
    "Find high priority clients",
    "Workers with JavaScript skills",
    "Tasks assigned to Client123",
    "Show completed tasks",
    "Find workers available on weekends"
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Smart Search</h3>
        <button
          onClick={() => setIsAIMode(!isAIMode)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-colors ${
            isAIMode 
              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAIMode ? 'AI Mode' : 'Simple Search'}</span>
        </button>
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder={isAIMode ? 'Try: "Show tasks with Duration > 2"' : 'Search your data...'}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => handleSearch(query)}
            disabled={!query.trim() || isSearching}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </button>
          
          <div className="text-sm text-gray-500">
            {files.reduce((total, file) => total + file.data.length, 0)} total records
          </div>
        </div>
      </div>

      {/* Example Queries */}
      <AnimatePresence>
        {isAIMode && !query && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <p className="text-sm font-medium text-gray-700 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(example)
                    handleSearch(example)
                  }}
                  className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Summary */}
      {query && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Search className="w-4 h-4" />
            <span>
              {isAIMode ? 'AI-powered search for:' : 'Searching for:'} 
              <span className="font-medium text-gray-900 ml-1">"{query}"</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}