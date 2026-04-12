'use client'

import { useCallback, useEffect, useState } from 'react'
import type { InstructionPageKey } from '@/lib/instructionCopy'
import { instructionStorageKey } from '@/lib/instructionCopy'

export function useInstructionModal(pageKey: InstructionPageKey | null) {
  const [open, setOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    setDontShowAgain(false)
  }, [pageKey])

  // Auto-open on first visit when entering a section (unless user opted out)
  useEffect(() => {
    if (!pageKey) {
      setOpen(false)
      return
    }
    try {
      if (typeof window !== 'undefined' && localStorage.getItem(instructionStorageKey(pageKey)) === 'true') {
        return
      }
    } catch {
      /* ignore */
    }
    setOpen(true)
  }, [pageKey])

  const openHelp = useCallback(() => {
    setOpen(true)
  }, [])

  const handleGotIt = useCallback(
    (neverShowAgain: boolean) => {
      if (pageKey && neverShowAgain) {
        try {
          window.localStorage.setItem(instructionStorageKey(pageKey), 'true')
        } catch {
          /* ignore */
        }
      }
      setDontShowAgain(false)
      setOpen(false)
    },
    [pageKey]
  )

  return {
    open,
    setOpen,
    dontShowAgain,
    setDontShowAgain,
    openHelp,
    handleGotIt,
  }
}
