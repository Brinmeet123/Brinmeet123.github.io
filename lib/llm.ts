/**
 * LLM: OpenAI chat completions.
 *
 * Env:
 * - OPENAI_BASE_URL — default https://api.openai.com/v1
 * - OPENAI_MODEL — default gpt-4o-mini
 * - OPENAI_API_KEY — required for real OpenAI calls
 * - DEMO_MODE=true — use mock responses in API routes (no OpenAI calls)
 * - USE_LOCAL_LLM_DEBRIEF_POLISH=true — optional prose-polish pass via LLM
 */

export type LLMMessage = { role: string; content: string }

const OPENAI_BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(
  /\/$/,
  ''
)
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim()

function toChatRole(role: string): 'system' | 'user' | 'assistant' {
  if (role === 'system' || role === 'user' || role === 'assistant') return role
  return role === 'doctor' ? 'user' : 'assistant'
}

export function getOllamaConfig(): {
  baseUrl: string
  model: string
  apiKeyConfigured: boolean
} {
  return {
    baseUrl: OPENAI_BASE_URL,
    model: OPENAI_MODEL,
    apiKeyConfigured: Boolean(OPENAI_API_KEY),
  }
}

/** True when routes should call OpenAI (DEMO_MODE forces mocks instead). */
export function shouldUseOllamaLLM(): boolean {
  return process.env.DEMO_MODE !== 'true' && Boolean(OPENAI_API_KEY)
}

/** @deprecated Use shouldUseOllamaLLM */
export function hasConfiguredLLM(): boolean {
  return shouldUseOllamaLLM()
}

/** @deprecated Ollama-only app; same as shouldUseOllamaLLM */
export function hasConfiguredCloudLLM(): boolean {
  return shouldUseOllamaLLM()
}

/** @deprecated Ollama-only app */
export function isCloudLLMConfigured(): boolean {
  return shouldUseOllamaLLM()
}

/**
 * Patient chat should only call OpenAI when enabled and configured.
 * Set PATIENT_CHAT_PRESET_ONLY=true to always use presets.
 */
export function shouldAttemptOllamaForPatientChat(): boolean {
  if (!shouldUseOllamaLLM()) return false
  if (process.env.PATIENT_CHAT_PRESET_ONLY === 'true') return false
  return true
}

export type CallLLMOptions = {
  /** Ask OpenAI for JSON-only output (helps structured routes like vocab definitions). */
  responseFormatJson?: boolean
}

export async function callLLM(
  messages: LLMMessage[],
  options?: CallLLMOptions
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY')
  }

  const url = `${OPENAI_BASE_URL}/chat/completions`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  headers.Authorization = `Bearer ${OPENAI_API_KEY}`
  const body: Record<string, unknown> = {
    model: OPENAI_MODEL,
    messages: messages.map((m) => ({ role: toChatRole(m.role), content: m.content })),
    stream: false,
  }
  if (options?.responseFormatJson) {
    body.response_format = { type: 'json_object' }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `OpenAI error (${res.status}) at ${OPENAI_BASE_URL}: ${text.slice(0, 500)}`
    )
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (content == null) throw new Error('OpenAI returned no content')
  return content
}
