import { vocab, type VocabTerm } from '@/data/vocab'
import { lookupDictionaryWord, medicalDictionary } from '@/lib/medicalDictionary'

export type MedicalChatSpan =
  | {
      kind: 'dictionary'
      startIndex: number
      endIndex: number
      surface: string
      lookupKey: string
      definition: string
    }
  | {
      kind: 'vocab'
      startIndex: number
      endIndex: number
      surface: string
      term: VocabTerm
    }

type Interval = { start: number; end: number }

function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end
}

function coveredByAny(interval: Interval, intervals: Interval[]): boolean {
  return intervals.some((x) => overlaps(interval, x))
}

/** Longest-first vocab matches (same strategy as VocabText). */
function findVocabSpans(text: string): MedicalChatSpan[] {
  const found: MedicalChatSpan[] = []
  const lowerText = text.toLowerCase()
  const ordered = [...vocab].sort((a, b) => b.term.length - a.term.length)

  for (const term of ordered) {
    const termLower = term.term.toLowerCase()
    const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(
      `(?:^|[^\\p{L}\\p{N}])(${escaped})(?=[^\\p{L}\\p{N}]|$)`,
      'giu'
    )
    let match: RegExpExecArray | null

    while ((match = regex.exec(lowerText)) !== null) {
      const g1 = match[1]
      if (!g1) continue
      const start = match.index + match[0].indexOf(g1)
      const end = start + g1.length
      const interval: Interval = { start, end }
      const overlapsExisting = found.some((f) =>
        overlaps(interval, { start: f.startIndex, end: f.endIndex })
      )
      if (!overlapsExisting) {
        found.push({
          kind: 'vocab',
          startIndex: start,
          endIndex: end,
          surface: text.substring(start, end),
          term,
        })
      }
    }
  }

  return found.sort((a, b) => a.startIndex - b.startIndex)
}

/** Multi-word keys in medicalDictionary, longest first. */
function dictionaryPhraseKeys(): string[] {
  return Object.keys(medicalDictionary)
    .filter((k) => k.includes(' '))
    .sort((a, b) => b.length - a.length)
}

function findDictionaryPhraseSpans(
  text: string,
  blocked: Interval[]
): MedicalChatSpan[] {
  const lower = text.toLowerCase()
  const candidates: MedicalChatSpan[] = []

  for (const key of dictionaryPhraseKeys()) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(?:^|[^\\p{L}\\p{N}])(${escaped})(?=[^\\p{L}\\p{N}]|$)`, 'giu')
    let m: RegExpExecArray | null
    while ((m = regex.exec(lower)) !== null) {
      const g1 = m[1]
      if (!g1) continue
      const start = m.index + m[0].indexOf(g1)
      const end = start + g1.length
      const interval: Interval = { start, end }
      if (coveredByAny(interval, blocked)) continue

      candidates.push({
        kind: 'dictionary',
        startIndex: start,
        endIndex: end,
        surface: text.substring(start, end),
        lookupKey: key,
        definition: medicalDictionary[key],
      })
    }
  }

  /** Prefer longer phrases when two dictionary phrases overlap. */
  candidates.sort((a, b) => b.endIndex - b.startIndex - (a.endIndex - a.startIndex))
  const out: MedicalChatSpan[] = []
  for (const c of candidates) {
    const iv: Interval = { start: c.startIndex, end: c.endIndex }
    if (out.some((s) => overlaps(iv, { start: s.startIndex, end: s.endIndex }))) continue
    out.push(c)
  }

  return out.sort((a, b) => a.startIndex - b.startIndex)
}

const WORD_RE = /\b[\p{L}\p{N}]+(?:['\u2019][\p{L}\p{N}]+)*\b/gu

function findDictionaryWordSpans(
  text: string,
  blocked: Interval[]
): MedicalChatSpan[] {
  const out: MedicalChatSpan[] = []
  let m: RegExpExecArray | null
  WORD_RE.lastIndex = 0
  while ((m = WORD_RE.exec(text)) !== null) {
    const start = m.index
    const end = start + m[0].length
    const interval: Interval = { start, end }
    if (coveredByAny(interval, blocked)) continue

    const def = lookupDictionaryWord(m[0])
    if (!def) continue

    const key = m[0].toLowerCase().replace(/^['"([{]+/, '').replace(/['")\]}.,;:!?]+$/, '')
    if (out.some((s) => overlaps(interval, { start: s.startIndex, end: s.endIndex }))) continue

    out.push({
      kind: 'dictionary',
      startIndex: start,
      endIndex: end,
      surface: text.substring(start, end),
      lookupKey: key,
      definition: def,
    })
  }

  return out.sort((a, b) => a.startIndex - b.startIndex)
}

/**
 * Non-overlapping medical spans: curated vocab phrases first, then dictionary phrases, then single-word dictionary.
 * Process once per message text (memoize in the component).
 */
export function getMedicalChatSpans(text: string): MedicalChatSpan[] {
  if (!text) return []

  const vocabSpans = findVocabSpans(text)
  const blockedVocab: Interval[] = vocabSpans.map((s) => ({
    start: s.startIndex,
    end: s.endIndex,
  }))

  const phraseSpans = findDictionaryPhraseSpans(text, blockedVocab)
  const blockedPhrases: Interval[] = [
    ...blockedVocab,
    ...phraseSpans.map((s) => ({ start: s.startIndex, end: s.endIndex })),
  ]

  const wordSpans = findDictionaryWordSpans(text, blockedPhrases)

  const merged = [...vocabSpans, ...phraseSpans, ...wordSpans].sort(
    (a, b) => a.startIndex - b.startIndex
  )

  /** Final pass: drop overlaps (prefer earlier + vocab over later dict). */
  const result: MedicalChatSpan[] = []
  for (const span of merged) {
    const iv: Interval = { start: span.startIndex, end: span.endIndex }
    if (result.some((r) => overlaps(iv, { start: r.startIndex, end: r.endIndex }))) {
      continue
    }
    result.push(span)
  }

  return result.sort((a, b) => a.startIndex - b.startIndex)
}
