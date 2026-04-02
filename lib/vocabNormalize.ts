/** Normalize vocabulary term for uniqueness (lowercase, trimmed). */
export function normalizeVocabTerm(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, ' ')
}
