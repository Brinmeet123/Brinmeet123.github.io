'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import type { MedicalTerm } from '@/src/types/medicalTerm'
import { getMedicalTermById, lookupMedicalTerm, normalizeLookupKey } from '@/src/lib/medicalTerms'
import {
  loadVocabStorage,
  persistVocabStorage,
  removeSavedTerm,
  toggleMastered,
  type VocabStorageV2,
} from '@/src/lib/vocabStorage'

export type EnrichedSavedTerm = {
  saved: import('@/src/types/medicalTerm').SavedVocabTerm
  term: MedicalTerm | null
}

type ApiVocabRow = {
  id: string
  term: string
  definition: string
  createdAt: string
}

function apiRowToSaved(row: ApiVocabRow): import('@/src/types/medicalTerm').SavedVocabTerm {
  const key = normalizeLookupKey(row.term)
  const lookup = lookupMedicalTerm(key) || lookupMedicalTerm(row.term)
  const termId = lookup?.id ?? `db:${row.id}`
  return {
    id: row.id,
    termId,
    savedAt: row.createdAt,
    mastered: false,
    sourceLabel: lookup ? undefined : row.term,
    sourceDefinition: lookup ? undefined : row.definition,
  }
}

export function useVocabStore() {
  const { status } = useSession()
  const isAuthed = status === 'authenticated'

  const [data, setData] = useState<VocabStorageV2>(() => ({
    version: 2,
    saved: [],
    stats: { totalSaved: 0, mastered: 0 },
  }))
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (isAuthed) {
      let cancelled = false
      fetch('/api/vocab')
        .then((r) => {
          if (!r.ok) throw new Error('vocab fetch failed')
          return r.json() as Promise<ApiVocabRow[]>
        })
        .then((rows) => {
          if (cancelled) return
          const local = loadVocabStorage()
          const saved = rows.map(apiRowToSaved)
          setData({
            version: 2,
            saved,
            stats: {
              ...local.stats,
              totalSaved: saved.length,
              mastered: saved.filter((s) => s.mastered).length,
            },
          })
          setIsLoaded(true)
        })
        .catch(() => {
          if (!cancelled) {
            setData((prev) => ({ ...prev, saved: [], stats: { ...prev.stats, totalSaved: 0, mastered: 0 } }))
            setIsLoaded(true)
          }
        })
      return () => {
        cancelled = true
      }
    }

    setData(loadVocabStorage())
    setIsLoaded(true)
  }, [isAuthed, status])

  useEffect(() => {
    if (!isLoaded || isAuthed) return
    persistVocabStorage(data)
  }, [data, isLoaded, isAuthed])

  const saveMedicalTerm = useCallback(
    async (term: MedicalTerm): Promise<boolean> => {
      if (!isAuthed) return false

      const res = await fetch('/api/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: term.term,
          definition: term.shortDefinition || term.definition,
        }),
      })

      if (!res.ok) return false

      const row = (await res.json()) as ApiVocabRow
      const base = apiRowToSaved(row)
      const saved: import('@/src/types/medicalTerm').SavedVocabTerm = {
        ...base,
        termId: term.id,
        sourceLabel: base.sourceLabel,
        sourceDefinition: base.sourceDefinition,
      }

      setData((prev) => {
        const rest = prev.saved.filter((s) => s.id !== saved.id && s.termId !== term.id)
        const nextSaved = [saved, ...rest]
        return {
          ...prev,
          saved: nextSaved,
          stats: {
            ...prev.stats,
            totalSaved: nextSaved.length,
            mastered: nextSaved.filter((s) => s.mastered).length,
          },
        }
      })

      return true
    },
    [isAuthed]
  )

  const hasTermId = useCallback(
    (termId: string): boolean => {
      return data.saved.some((s) => s.termId === termId)
    },
    [data.saved]
  )

  const remove = useCallback(
    async (savedId: string) => {
      if (isAuthed) {
        const res = await fetch(`/api/vocab?id=${encodeURIComponent(savedId)}`, { method: 'DELETE' })
        if (!res.ok) return
      }
      setData((prev) => removeSavedTerm(prev, savedId))
    },
    [isAuthed]
  )

  const removeByTermId = useCallback((termId: string) => {
    setData((prev) => ({
      ...prev,
      saved: prev.saved.filter((s) => s.termId !== termId),
    }))
  }, [])

  const setMastered = useCallback((savedId: string) => {
    setData((prev) => toggleMastered(prev, savedId))
  }, [])

  const list = useCallback((): EnrichedSavedTerm[] => {
    return [...data.saved]
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
      .map((saved) => ({
        saved,
        term: getMedicalTermById(saved.termId) ?? null,
      }))
  }, [data.saved])

  const getByTermId = useCallback(
    (termId: string) => {
      return data.saved.find((s) => s.termId === termId)
    },
    [data.saved]
  )

  const updateStats = useCallback((patch: Partial<VocabStorageV2['stats']>) => {
    setData((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...patch },
    }))
  }, [])

  const recordQuizComplete = useCallback(() => {
    setData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        quizAttempts: (prev.stats.quizAttempts ?? 0) + 1,
        lastQuizAt: new Date().toISOString(),
      },
    }))
  }, [])

  return {
    saveMedicalTerm,
    hasTermId,
    remove,
    removeByTermId,
    setMastered,
    list,
    getByTermId,
    updateStats,
    recordQuizComplete,
    isLoaded,
    count: data.saved.length,
    masteredCount: data.saved.filter((s) => s.mastered).length,
    stats: data.stats,
    isAuthed,
    canSave: isAuthed,
  }
}
