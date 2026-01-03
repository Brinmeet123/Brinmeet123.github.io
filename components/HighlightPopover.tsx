'use client'

import { useState, useEffect, useRef } from 'react'
import { VocabExplanation } from '@/lib/vocabEngine'
import { useVocabStore } from '@/lib/useVocabStore'

type ViewMode = 'simple' | 'clinical'

type Props = {
  explanation: VocabExplanation | null
  position: { x: number; y: number } | null
  onClose: () => void
  onSave?: (explanation: VocabExplanation) => void // Optional callback for tracking
  viewMode?: ViewMode
}

export default function HighlightPopover({ explanation, position, onClose, onSave, viewMode = 'simple' }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const { save, has } = useVocabStore()
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (explanation) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [explanation, onClose])

  // Check if already saved when explanation changes
  useEffect(() => {
    if (explanation) {
      setIsSaved(has(explanation.term))
    }
  }, [explanation, has])

  if (!explanation || !position) return null

  // Validate explanation has required fields
  const isValid = explanation.term && (explanation.definitionSimple || explanation.definitionClinical)
  const isDisabled = !isValid || isSaving || isSaved

  const handleSave = () => {
    if (!isValid || isSaved) return

    setIsSaving(true)
    try {
      const success = save(explanation)
      if (success) {
        setIsSaved(true)
        if (onSave) {
          onSave(explanation)
        }
        // Keep popover open to show "Saved" state
        setTimeout(() => {
          setIsSaving(false)
        }, 300)
      } else {
        setIsSaving(false)
        console.error('Failed to save vocab')
      }
    } catch (error) {
      console.error('Error saving vocab:', error)
      setIsSaving(false)
    }
  }

  // Position the popover above the selection, adjusting if near viewport edges
  const getPosition = () => {
    const padding = 10
    let x = position.x
    let y = position.y - 10 // Position above selection
    
    if (typeof window !== 'undefined') {
      const maxWidth = 320
      const maxHeight = 400
      
      // Adjust horizontal position to stay in viewport
      if (x + maxWidth > window.innerWidth - padding) {
        x = window.innerWidth - maxWidth - padding
      }
      if (x < padding) {
        x = padding
      }
      
      // Adjust vertical position if too close to top
      if (y - maxHeight < padding) {
        y = position.y + 30 // Position below selection instead
      }
    }
    
    return { x, y }
  }

  const pos = getPosition()

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border-2 border-primary-200 p-4 max-w-xs"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -100%)',
        maxWidth: '320px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg text-primary-900">{explanation.term}</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-2 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      <div className="mb-3 space-y-2">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Definition:</p>
          <p className="text-sm text-gray-900">
            {viewMode === 'simple' 
              ? explanation.definitionSimple 
              : explanation.definitionClinical}
          </p>
        </div>
        
        {/* Context-specific "why it matters here" if available */}
        {explanation.whyItMattersHere ? (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Why it matters here:</p>
            <p className="text-sm text-gray-700">{explanation.whyItMattersHere}</p>
          </div>
        ) : explanation.whyItMatters ? (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Why it matters:</p>
            <p className="text-sm text-gray-700">{explanation.whyItMatters}</p>
          </div>
        ) : null}
        
        {/* Context-specific example if available */}
        {explanation.exampleFromContext ? (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Example (from this case):</p>
            <p className="text-xs text-gray-600 italic">{explanation.exampleFromContext}</p>
          </div>
        ) : explanation.example ? (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Example:</p>
            <p className="text-xs text-gray-600 italic">{explanation.example}</p>
          </div>
        ) : null}
        
        {/* Synonyms or related terms */}
        {explanation.synonymsOrRelated && explanation.synonymsOrRelated.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Related terms:</p>
            <p className="text-xs text-gray-600">{explanation.synonymsOrRelated.join(', ')}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Source: {explanation.source === 'local' ? 'Vocabulary' : 'AI-generated'}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isDisabled}
          className={`flex-1 px-3 py-2 rounded transition text-sm font-medium flex items-center justify-center gap-1 ${
            isSaved
              ? 'bg-green-600 text-white cursor-default'
              : isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isSaving ? (
            <>Saving...</>
          ) : isSaved ? (
            <>✓ Saved</>
          ) : (
            <>⭐ Save to Vocab</>
          )}
        </button>
        <button
          onClick={onClose}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}

