'use client'

import { useState, useEffect, useCallback } from 'react'
import { VocabExplanation } from './vocabEngine'

const STORAGE_KEY = 'savedVocab_v1'

type SavedVocabItem = VocabExplanation & {
  savedAt: number
  timesReviewed?: number
}

type SavedVocabStore = {
  [normalizedTerm: string]: SavedVocabItem
}

/**
 * Normalize a term key for consistent storage
 * Rules: trim, collapse spaces, lowercase, strip punctuation (except hyphen)
 */
function normalizeTermKey(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/[.,;:!?'"()]/g, '') // Strip punctuation except hyphen
    .trim()
}

/**
 * Custom hook for managing saved vocabulary
 */
export function useVocabStore() {
  const [store, setStore] = useState<SavedVocabStore>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setStore(parsed)
      }
      setIsLoaded(true)
    } catch (error) {
      console.error('Error loading vocab from localStorage:', error)
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever store changes
  useEffect(() => {
    if (isLoaded) {
      try {
        const serialized = JSON.stringify(store)
        localStorage.setItem(STORAGE_KEY, serialized)
        // Debug: log localStorage state after save (can be removed later)
        const verify = localStorage.getItem(STORAGE_KEY)
        if (verify) {
          const parsed = JSON.parse(verify)
          console.log('localStorage after save:', {
            keyCount: Object.keys(parsed).length,
            keys: Object.keys(parsed).slice(0, 5) // First 5 keys for debugging
          })
        }
      } catch (error) {
        console.error('Error saving vocab to localStorage:', error)
      }
    }
  }, [store, isLoaded])

  /**
   * Save an explanation to the store
   */
  const save = useCallback((explanation: VocabExplanation) => {
    if (!explanation.term || (!explanation.definitionSimple && !explanation.definitionClinical)) {
      console.warn('Cannot save: missing term or definitions', explanation)
      return false
    }

    const normalizedKey = normalizeTermKey(explanation.term)
    
    setStore((prev) => {
      const existing = prev[normalizedKey]
      const updated = {
        ...prev,
        [normalizedKey]: {
          ...explanation,
          savedAt: existing?.savedAt || Date.now(),
          timesReviewed: existing?.timesReviewed || 0,
        },
      }
      
      console.log('Saved vocab:', {
        originalTerm: explanation.term,
        normalizedKey,
        storeSize: Object.keys(updated).length
      })
      
      return updated
    })

    return true
  }, [])

  /**
   * Remove a term from the store
   */
  const remove = useCallback((term: string) => {
    const normalizedKey = normalizeTermKey(term)
    setStore((prev) => {
      const updated = { ...prev }
      delete updated[normalizedKey]
      return updated
    })
  }, [])

  /**
   * Check if a term exists in the store
   */
  const has = useCallback((term: string): boolean => {
    const normalizedKey = normalizeTermKey(term)
    return normalizedKey in store
  }, [store])

  /**
   * Get all saved terms, sorted by savedAt (newest first)
   */
  const list = useCallback((): SavedVocabItem[] => {
    return Object.values(store).sort((a, b) => b.savedAt - a.savedAt)
  }, [store])

  /**
   * Get a specific term from the store
   */
  const get = useCallback((term: string): SavedVocabItem | undefined => {
    const normalizedKey = normalizeTermKey(term)
    return store[normalizedKey]
  }, [store])

  return {
    save,
    remove,
    has,
    list,
    get,
    isLoaded,
    count: Object.keys(store).length,
  }
}

