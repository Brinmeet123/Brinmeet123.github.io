'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import type { VocabTerm } from '@/data/vocab'
import { getMedicalChatSpans, type MedicalChatSpan } from '@/lib/medicalChatSpans'
import { lookupMedicalTerm } from '@/src/lib/medicalTerms'
import { useVocabStore } from '@/lib/useVocabStore'
import { fetchMedicalDefinitionWithFallback } from '@/lib/fetchMedicalDefinition'

type Props = {
  text: string
  onTermClick?: (term: string) => void
  onTermSave?: (term: string) => void
}

export default function VocabText({ text, onTermClick, onTermSave }: Props) {
  const { status } = useSession()
  const isAuthed = status === 'authenticated'
  const { saveMedicalTerm } = useVocabStore()

  const spans = useMemo(() => getMedicalChatSpans(text), [text])

  const [openSpan, setOpenSpan] = useState<MedicalChatSpan | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null)
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  const [aiDefinition, setAiDefinition] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const closePopover = useCallback(() => {
    setOpenSpan(null)
    setPopoverPosition(null)
    anchorRef.current = null
    setAiDefinition(null)
    setAiLoading(false)
  }, [])

  const updatePopoverPosition = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    })
  }, [])

  useEffect(() => {
    if (!openSpan) return
    updatePopoverPosition()
    window.addEventListener('scroll', updatePopoverPosition, true)
    window.addEventListener('resize', updatePopoverPosition)
    return () => {
      window.removeEventListener('scroll', updatePopoverPosition, true)
      window.removeEventListener('resize', updatePopoverPosition)
    }
  }, [openSpan, updatePopoverPosition])

  useEffect(() => {
    if (!openSpan) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopover()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSpan, closePopover])

  /** AI fallback only when a span has no embedded definition (defensive / future-proof). */
  useEffect(() => {
    if (!openSpan) return
    if (openSpan.kind === 'vocab') {
      setAiDefinition(null)
      return
    }
    const def = openSpan.definition?.trim()
    if (def) {
      setAiDefinition(def)
      return
    }
    let cancelled = false
    setAiLoading(true)
    void fetchMedicalDefinitionWithFallback(openSpan.lookupKey).then((d) => {
      if (!cancelled) {
        setAiDefinition(d || null)
        setAiLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [openSpan])

  const handleTermActivate = (e: React.MouseEvent, span: MedicalChatSpan) => {
    e.preventDefault()
    e.stopPropagation()
    anchorRef.current = e.currentTarget as HTMLButtonElement
    const rect = e.currentTarget.getBoundingClientRect()
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    })
    setOpenSpan(span)
    const termStr = span.kind === 'vocab' ? span.term.term : span.lookupKey
    if (onTermClick) onTermClick(termStr)
  }

  const handleSaveVocab = (term: VocabTerm) => {
    if (onTermSave) onTermSave(term.term)
    const m = lookupMedicalTerm(term.term)
    if (m) void saveMedicalTerm(m)
    closePopover()
  }

  const handleSaveDictionary = async (surface: string, definition: string) => {
    if (!isAuthed || !definition.trim()) {
      closePopover()
      return
    }
    if (onTermSave) onTermSave(surface)
    try {
      const res = await fetch('/api/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: surface.trim(), definition: definition.trim() }),
      })
      if (!res.ok) throw new Error('save failed')
    } catch {
      /* ignore */
    }
    closePopover()
  }

  const renderText = () => {
    if (spans.length === 0) {
      return <span>{text}</span>
    }

    const elements: React.ReactNode[] = []
    let lastIndex = 0

    spans.forEach((span, idx) => {
      if (span.startIndex > lastIndex) {
        elements.push(
          <span key={`t-${idx}`}>{text.substring(lastIndex, span.startIndex)}</span>
        )
      }

      const surface = text.substring(span.startIndex, span.endIndex)
      elements.push(
        <button
          key={`m-${idx}`}
          type="button"
          onClick={(e) => handleTermActivate(e, span)}
          className="medical-term text-emerald-900/90 underline decoration-dotted decoration-emerald-700/70 underline-offset-2 hover:text-emerald-950 hover:decoration-emerald-800 cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit align-baseline"
          title="Click for definition"
        >
          {surface}
        </button>
      )

      lastIndex = span.endIndex
    })

    if (lastIndex < text.length) {
      elements.push(<span key="end">{text.substring(lastIndex)}</span>)
    }

    return <>{elements}</>
  }

  const showPopover = openSpan && popoverPosition

  return (
    <>
      <span className="vocab-text">{renderText()}</span>

      {showPopover && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden onClick={closePopover} />

          <div
            className="fixed z-50 max-w-sm rounded-lg border border-emerald-200/90 bg-white p-4 shadow-xl"
            style={{
              left: `${popoverPosition.x}px`,
              top: `${popoverPosition.y}px`,
              transform: 'translate(-50%, calc(-100% - 12px))',
            }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {openSpan.kind === 'dictionary' && (
              <>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h4 className="text-lg font-bold capitalize text-emerald-950">
                    {openSpan.surface}
                  </h4>
                  <button
                    type="button"
                    onClick={closePopover}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                {aiLoading ? (
                  <p className="text-sm text-slate-600">Loading definition…</p>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-800">
                    {aiDefinition || openSpan.definition}
                  </p>
                )}
                {isAuthed && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        void handleSaveDictionary(
                          openSpan.surface,
                          aiDefinition || openSpan.definition
                        )
                      }
                      className="flex-1 rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      Save term
                    </button>
                  </div>
                )}
              </>
            )}

            {openSpan.kind === 'vocab' && (
              <>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h4 className="text-lg font-bold text-primary-900">{openSpan.term.display}</h4>
                  <button
                    type="button"
                    onClick={closePopover}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-3">
                  <p className="mb-2 text-sm text-gray-700">
                    <strong>Definition:</strong> {openSpan.term.definitionSimple}
                  </p>

                  <p className="mb-2 text-sm text-gray-700">
                    <strong>Why it matters:</strong> {openSpan.term.whyItMatters}
                  </p>

                  <p className="text-xs italic text-gray-600">
                    Example: {openSpan.term.exampleSimple}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveVocab(openSpan.term)}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-primary-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
                  >
                    Save term
                  </button>
                </div>

                {openSpan.term.tags.length > 0 && (
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {openSpan.term.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}
