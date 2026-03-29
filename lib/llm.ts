/**
 * LLM: OpenAI only. Set OPENAI_API_KEY for real AI; otherwise use DEMO_MODE mocks.
 */

export type LLMMessage = { role: string; content: string }

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim()
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

function toOpenAIRole(role: string): 'system' | 'user' | 'assistant' {
  if (role === 'system' || role === 'user' || role === 'assistant') return role as 'system' | 'user' | 'assistant'
  return role === 'doctor' ? 'user' : 'assistant'
}

export function hasConfiguredCloudLLM(): boolean {
  return Boolean(OPENAI_API_KEY)
}

export async function callLLM(messages: LLMMessage[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add your OpenAI API key (sk-...) in Vercel env vars or .env.local, or set DEMO_MODE=true for mock responses.'
    )
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: messages.map((m) => ({ role: toOpenAIRole(m.role), content: m.content })),
      max_tokens: 2048,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    let message = `OpenAI API error: ${res.status} ${text}`
    try {
      const j = JSON.parse(text) as { error?: { code?: string; message?: string; type?: string } }
      const code = j.error?.code
      const apiMsg = j.error?.message
      if (code === 'insufficient_quota' || apiMsg?.toLowerCase().includes('quota')) {
        message =
          'OpenAI quota or billing exhausted (insufficient_quota). Add credits or a payment method at https://platform.openai.com/account/billing — or set DEMO_MODE=true on the server for mock responses without the API.'
      } else if (res.status === 429 && code === 'rate_limit_exceeded') {
        message =
          'OpenAI rate limit exceeded. Wait a short time and try again, or reduce request frequency.'
      } else if (apiMsg) {
        message = `OpenAI API error: ${res.status} — ${apiMsg}`
      }
    } catch {
      /* keep message with raw text */
    }
    throw new Error(message)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (content == null) throw new Error('OpenAI returned no content')
  return content
}

export function isCloudLLMConfigured(): boolean {
  return Boolean(OPENAI_API_KEY)
}
