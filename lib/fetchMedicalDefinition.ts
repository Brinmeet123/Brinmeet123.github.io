import { lookupDictionaryAny } from '@/lib/medicalDictionary'

const memoryCache = new Map<string, string>()
const SESSION_PREFIX = 'meddef:'

/** In-memory cache for AI (or server) definitions for this session. */
export function getCachedMedicalDefinition(term: string): string | undefined {
  return memoryCache.get(term.trim().toLowerCase())
}

export function setCachedMedicalDefinition(term: string, definition: string): void {
  memoryCache.set(term.trim().toLowerCase(), definition)
}

function readSessionCache(k: string): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    return sessionStorage.getItem(SESSION_PREFIX + k) ?? undefined
  } catch {
    return undefined
  }
}

function writeSessionCache(k: string, definition: string): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(SESSION_PREFIX + k, definition)
  } catch {
    /* quota / private mode */
  }
}

/**
 * Local dictionary first, then optional AI via /api/vocab-ai-definition.
 * Safe in demo mode: the route resolves known terms from the dictionary without an LLM.
 */
export async function fetchMedicalDefinitionWithFallback(term: string): Promise<string> {
  const k = term.trim().toLowerCase()
  if (!k) return ''
  if (memoryCache.has(k)) return memoryCache.get(k)!

  const local = lookupDictionaryAny(k)
  if (local) {
    memoryCache.set(k, local)
    return local
  }

  const sessionHit = readSessionCache(k)
  if (sessionHit) {
    memoryCache.set(k, sessionHit)
    return sessionHit
  }

  try {
    const res = await fetch('/api/vocab-ai-definition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: k }),
    })
    if (!res.ok) throw new Error('definition fetch failed')
    const data = (await res.json()) as {
      shortDefinition?: string
      definition?: string
    }
    const def = String(data.shortDefinition || data.definition || '').trim()
    if (def) {
      memoryCache.set(k, def)
      writeSessionCache(k, def)
      return def
    }
  } catch {
    /* offline / error */
  }

  return ''
}
