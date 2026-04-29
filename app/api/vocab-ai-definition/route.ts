import { NextRequest, NextResponse } from 'next/server'
import { callLLM } from '@/lib/llm'
import { lookupDictionaryAny } from '@/lib/medicalDictionary'

const DEMO = process.env.DEMO_MODE === 'true'

export async function POST(request: NextRequest) {
  let term = ''
  try {
    const body = await request.json()
    term = typeof body.term === 'string' ? body.term.trim() : ''
    if (!term) {
      return NextResponse.json({ error: 'Missing term' }, { status: 400 })
    }

    const localDef = lookupDictionaryAny(term)
    if (localDef) {
      return NextResponse.json({
        term,
        shortDefinition: localDef,
        definition: localDef,
        category: 'general',
        isAIGenerated: false as const,
        source: 'dictionary' as const,
      })
    }

    if (DEMO) {
      return NextResponse.json(mockMedicalTermLike(term, 'demo'))
    }

    const systemPrompt = `You are a medical education assistant. Return ONLY valid JSON (no markdown fences, no commentary) with exactly this shape:
{
  "term": string,
  "shortDefinition": string,
  "definition": string,
  "category": string,
  "isAIGenerated": true
}
The "definition" field should be 2–3 sentences. "shortDefinition" is one line.`

    const userPrompt = `Provide a clear, concise medical definition for the term "${term}" suitable for a high school or pre-med student. Include:
1. A short one-line definition
2. A slightly more detailed explanation (2–3 sentences)
3. A category (e.g., cardiology, neurology, general, lab test, symptom)
Avoid overly technical jargon.`

    const text = await callLLM(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { responseFormatJson: true }
    )

    let jsonText = text
    const m = text.match(/\{[\s\S]*\}/)
    if (m) jsonText = m[0]

    const parsed = JSON.parse(jsonText) as Record<string, unknown>
    const out = {
      term: String(parsed.term ?? term),
      shortDefinition: String(parsed.shortDefinition ?? parsed.definition ?? ''),
      definition: String(parsed.definition ?? parsed.shortDefinition ?? ''),
      category: String(parsed.category ?? 'general'),
      isAIGenerated: true as const,
    }

    if (!out.shortDefinition) {
      return NextResponse.json(mockMedicalTermLike(term, 'empty'))
    }

    return NextResponse.json(out)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('vocab-ai-definition:', msg)
    return NextResponse.json(mockMedicalTermLike(term || 'term', 'error'))
  }
}

function mockMedicalTermLike(term: string, reason: 'demo' | 'empty' | 'error') {
  const detail =
    reason === 'demo'
      ? 'DEMO_MODE is enabled on the server, so AI definitions are replaced with this placeholder.'
      : reason === 'empty'
        ? 'The model returned no usable definition text. Try again in a moment.'
        : 'The definition request failed (for example missing OPENAI_API_KEY, an invalid key, a network error, or the model returned non-JSON). Check Vercel deployment logs for “vocab-ai-definition” and confirm OPENAI_API_KEY is set for this environment, then redeploy.'

  return {
    term,
    shortDefinition: `Educational overview: “${term}” is a term used in health and medicine.`,
    definition: `In learning scenarios, “${term}” may refer to a concept your instructor or case text uses. Look for how it is used in context (symptoms, tests, or body systems). ${detail}`,
    category: 'general',
    isAIGenerated: true as const,
    source: reason === 'demo' ? ('demo' as const) : ('fallback' as const),
    fallbackReason: reason,
  }
}
