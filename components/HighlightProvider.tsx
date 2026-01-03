'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { resolveVocab, VocabExplanation, VocabContext, SourceType } from '@/lib/vocabEngine'
import HighlightPopover from './HighlightPopover'

type ViewMode = 'simple' | 'clinical'

type Props = {
  children: React.ReactNode
  viewMode?: ViewMode
}

// Global viewMode state - can be enhanced with context later
let globalViewMode: ViewMode = 'simple'

export function setGlobalViewMode(mode: ViewMode) {
  globalViewMode = mode
}

/**
 * Extract context from DOM by finding the nearest VocabContextBlock
 */
function extractContext(selection: Selection): VocabContext | null {
  if (!selection || selection.rangeCount === 0) return null

  const range = selection.getRangeAt(0)
  let node: Node | null = range.commonAncestorContainer

  // Walk up the DOM tree to find the VocabContextBlock
  while (node && node.nodeType !== Node.DOCUMENT_NODE) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      const source = element.getAttribute('data-vocab-source') as SourceType | null
      const blockText = element.getAttribute('data-vocab-text')
      const scenarioId = element.getAttribute('data-vocab-scenario-id')

      if (source && blockText) {
        const selectedText = selection.toString().trim()

        // Find the position of the selected text in the block text
        const selectedIndex = blockText.indexOf(selectedText)
        if (selectedIndex === -1) {
          // Fallback: use the selection's text content
          const contextText = blockText.length > 400 
            ? blockText.substring(Math.max(0, selectedIndex - 200), Math.min(blockText.length, selectedIndex + selectedText.length + 200))
            : blockText
          
          return {
            selectedText,
            contextText: contextText || blockText.substring(0, 400),
            sourceType: source,
            scenarioMeta: scenarioId ? { scenarioTitle: scenarioId } : undefined
          }
        }

        // Extract context window (250 chars before/after)
        const contextStart = Math.max(0, selectedIndex - 250)
        const contextEnd = Math.min(blockText.length, selectedIndex + selectedText.length + 250)
        const contextText = blockText.substring(contextStart, contextEnd)

        return {
          selectedText,
          contextText,
          sourceType: source,
          scenarioMeta: scenarioId ? { scenarioTitle: scenarioId } : undefined
        }
      }
    }

    node = node.parentNode
  }

  // Fallback: use anchor node's text content
  const anchorNode = selection.anchorNode
  if (anchorNode && anchorNode.textContent) {
    const selectedText = selection.toString().trim()
    const fullText = anchorNode.textContent
    const selectedIndex = fullText.indexOf(selectedText)
    
    if (selectedIndex !== -1) {
      const contextStart = Math.max(0, selectedIndex - 250)
      const contextEnd = Math.min(fullText.length, selectedIndex + selectedText.length + 250)
      const contextText = fullText.substring(contextStart, contextEnd)

      return {
        selectedText,
        contextText,
        sourceType: 'chat' // Default fallback
      }
    }
  }

  return null
}

export default function HighlightProvider({ children, viewMode }: Props) {
  // Use prop if provided, otherwise use global (for backward compatibility)
  const effectiveViewMode = viewMode || globalViewMode
  const [context, setContext] = useState<VocabContext | null>(null)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null)
  const [explanation, setExplanation] = useState<VocabExplanation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Check if selection is inside an input field
  const isInsideInput = (node: Node | null): boolean => {
    if (!node) return false
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      const tagName = element.tagName?.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || element.isContentEditable) {
        return true
      }
      // Check if inside a form control
      if (element.closest('input, textarea, [contenteditable="true"]')) {
        return true
      }
    }
    return false
  }

  const handleSelection = useCallback(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce selection events
    debounceTimerRef.current = setTimeout(() => {
      const selection = window.getSelection()
      
      if (!selection || selection.rangeCount === 0) {
        setSelectedText(null)
        setSelectionPosition(null)
        setExplanation(null)
        return
      }

      const selectedText = selection.toString().trim()
      const range = selection.getRangeAt(0)

      // Check if inside input field
      if (isInsideInput(range.commonAncestorContainer)) {
        setSelectedText(null)
        setSelectionPosition(null)
        setExplanation(null)
        return
      }

      // Validate selection length (allow up to 60 chars for phrases)
      if (selectedText.length === 0 || selectedText.length > 60) {
        setSelectedText(null)
        setSelectionPosition(null)
        setExplanation(null)
        setContext(null)
        return
      }

      // Skip if only whitespace
      if (!selectedText.replace(/\s/g, '').length) {
        setSelectedText(null)
        setSelectionPosition(null)
        setExplanation(null)
        setContext(null)
        return
      }

      // Extract context from DOM
      const extractedContext = extractContext(selection)
      
      // Get selection position
      const rect = range.getBoundingClientRect()
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top
      }

      setSelectedText(selectedText)
      setSelectionPosition(position)
      setContext(extractedContext)
      setIsLoading(true)

      // Resolve vocabulary with context
      resolveVocab(selectedText, effectiveViewMode, extractedContext || undefined)
        .then((expl) => {
          if (expl) {
            setExplanation(expl)
          } else {
            setExplanation(null)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Error resolving vocab:', error)
          setIsLoading(false)
          setExplanation(null)
        })
    }, 300) // 300ms debounce
  }, [effectiveViewMode])

  // Handle selection change
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection)
    return () => {
      document.removeEventListener('selectionchange', handleSelection)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [handleSelection])

  // Handle mobile long-press (optional enhancement)
  // Note: Mobile browsers handle text selection differently, so we rely on native selection
  // This is kept for potential future enhancement but native selection should work

  const handleClose = () => {
    setSelectedText(null)
    setSelectionPosition(null)
    setExplanation(null)
    setContext(null)
    // Clear selection
    window.getSelection()?.removeAllRanges()
  }

  // Save is now handled by HighlightPopover using useVocabStore
  // This callback is kept for backward compatibility/tracking if needed
  const handleSave = (expl: VocabExplanation) => {
    // No-op: saving is now handled in HighlightPopover via useVocabStore
  }

  return (
    <>
      {children}
      {(explanation || isLoading) && (
        <HighlightPopover
          explanation={explanation}
          position={selectionPosition}
          onClose={handleClose}
          onSave={handleSave}
          viewMode={effectiveViewMode}
        />
      )}
      {isLoading && explanation === null && selectedText && (
        <div
          className="fixed z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
          style={{
            left: selectionPosition ? `${selectionPosition.x}px` : '50%',
            top: selectionPosition ? `${selectionPosition.y - 50}px` : '50%',
            transform: 'translate(-50%, -100%)'
          }}
        >
          <p className="text-sm text-gray-600">Loading explanation...</p>
        </div>
      )}
    </>
  )
}

