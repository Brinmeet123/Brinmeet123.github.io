import { NextResponse } from 'next/server'
import { getOllamaConfig, shouldUseOllamaLLM } from '@/lib/llm'

export async function GET() {
  const demoMode = process.env.DEMO_MODE === 'true'
  const { baseUrl, model, apiKeyConfigured } = getOllamaConfig()
  const useOllama = shouldUseOllamaLLM()

  const aiWillUse = demoMode
    ? 'Mock responses only (DEMO_MODE=true)'
    : `OpenAI (${model} @ ${baseUrl})`

  const hint = demoMode
    ? 'Unset DEMO_MODE or set to false to use OpenAI for real AI.'
    : 'Set OPENAI_API_KEY in your environment. Optional: set OPENAI_MODEL and OPENAI_BASE_URL.'

  return NextResponse.json({
    ok: true,
    provider: 'openai',
    model,
    openaiBaseUrl: baseUrl,
    openaiApiKeyConfigured: apiKeyConfigured,
    demoModeEnv: demoMode,
    openaiEnabled: useOllama,
    aiWillUse,
    hint,
    openAIConfigured: apiKeyConfigured,
  })
}
