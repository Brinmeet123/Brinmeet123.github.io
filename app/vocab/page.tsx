'use client'

import { useState, useMemo } from 'react'
import { getVocabTerm } from '@/data/vocab'
import Link from 'next/link'
import { useVocabStore } from '@/lib/useVocabStore'

export default function VocabPage() {
  const { list, remove, count } = useVocabStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'simple' | 'clinical'>('simple')

  // Get saved terms from store
  const savedItems = list()
  
  // Match saved items with vocab dictionary entries where possible
  const savedTermsWithVocab = useMemo(() => {
    return savedItems.map(item => {
      const vocabEntry = getVocabTerm(item.term)
      return {
        ...item,
        vocabEntry, // Optional: reference to vocab.ts entry if found
        display: vocabEntry?.display || item.term,
        tags: vocabEntry?.tags || []
      }
    })
  }, [savedItems])

  const filteredTerms = useMemo(() => {
    return savedTermsWithVocab.filter(item => {
      const searchMatch = searchQuery === '' ||
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.display.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definitionSimple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definitionClinical.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const tagMatch = selectedTag === 'All' || item.tags.includes(selectedTag)
      
      return searchMatch && tagMatch
    })
  }, [savedTermsWithVocab, searchQuery, selectedTag])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    savedTermsWithVocab.forEach(item => {
      item.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [savedTermsWithVocab])

  const stats = useMemo(() => {
    const saved = count
    const mastered = savedItems.filter(v => (v.timesReviewed || 0) > 0 && (v.timesReviewed || 0) >= 5).length
    return { saved, mastered }
  }, [count, savedItems])

  const handleRemoveTerm = (term: string) => {
    remove(term)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Vocabulary</h1>
        <p className="text-gray-600">Review and practice the medical terms you've saved.</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 mb-1">Saved Terms</p>
          <p className="text-3xl font-bold text-blue-900">{stats.saved}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 mb-1">Mastered</p>
          <p className="text-3xl font-bold text-green-900">{stats.mastered}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <Link
            href="/vocab/quiz"
            className="block text-center"
          >
            <p className="text-sm text-purple-700 mb-1">Practice</p>
            <p className="text-lg font-bold text-purple-900">Take Quiz →</p>
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('simple')}
                className={`px-3 py-1 text-sm font-medium rounded transition ${
                  viewMode === 'simple'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => setViewMode('clinical')}
                className={`px-3 py-1 text-sm font-medium rounded transition ${
                  viewMode === 'clinical'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Clinical
              </button>
            </div>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-3 py-1 rounded-md text-sm transition ${
                selectedTag === 'All'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-md text-sm transition ${
                  selectedTag === tag
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Terms List */}
      {filteredTerms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          {savedTermsWithVocab.length === 0 ? (
            <>
              <p className="text-gray-600 mb-4">You haven't saved any terms yet.</p>
              <p className="text-sm text-gray-500">
                Highlight any word or phrase in a scenario and click "Save to Vocab" to add it here!
              </p>
            </>
          ) : (
            <p className="text-gray-600">No terms match your search or filter.</p>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTerms.map(item => {
            const mastery = (item.timesReviewed || 0) > 0 ? Math.min(100, ((item.timesReviewed || 0) / 5) * 100) : 0
            
            return (
              <div
                key={item.term}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-primary-900">{item.display}</h3>
                  <button
                    onClick={() => handleRemoveTerm(item.term)}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Remove from saved"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Definition:</strong> {
                      viewMode === 'simple' 
                        ? item.definitionSimple 
                        : item.definitionClinical
                    }
                  </p>
                  {item.whyItMatters && (
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Why it matters:</strong> {item.whyItMatters}
                    </p>
                  )}
                  {item.example && (
                    <p className="text-xs text-gray-600 italic">
                      Example: {item.example}
                    </p>
                  )}
                </div>
                
                {(item.timesReviewed || 0) > 0 && (
                  <div className="mb-3 p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Reviewed</span>
                      <span className="text-xs font-medium text-gray-700">
                        {item.timesReviewed} times
                      </span>
                    </div>
                    {mastery > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            mastery >= 80 ? 'bg-green-500' :
                            mastery >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Link
                    href="/vocab/quiz"
                    className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition text-sm font-medium text-center"
                  >
                    Practice
                  </Link>
                </div>
                
                {item.tags.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

