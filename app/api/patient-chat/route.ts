import { NextRequest, NextResponse } from 'next/server'
import { scenarios } from '@/data/scenarios'
import { getMockPatientResponse } from '@/lib/mockResponses'
import { getPresetPatientResponse } from '@/lib/presetPatientResponses'
import { callLLM, shouldAttemptOllamaForPatientChat } from '@/lib/llm'

const USE_DEMO_MOCKS = process.env.DEMO_MODE === 'true'
const USE_PRESET_FALLBACK = process.env.USE_PRESET_FALLBACK !== 'false'

export async function POST(request: NextRequest) {
  let bodyData: { scenarioId?: string; messages?: Array<{ role: string; content: string }> } = {}

  try {
    const body = await request.json()
    const { scenarioId, messages } = body
    bodyData = { scenarioId, messages }

    if (!scenarioId || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'scenarioId and messages are required' },
        { status: 400 }
      )
    }

    const scenario = scenarios.find(s => s.id === scenarioId)
    if (!scenario) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }

    // If demo mode is intentionally enabled, use demo mocks first
    if (USE_DEMO_MOCKS) {
      const mockResponse = getMockPatientResponse(scenarioId, messages)
      return NextResponse.json({
        message: mockResponse,
        source: 'demo-mock',
      })
    }

    // No reachable Ollama on Vercel/serverless with localhost URL — use presets (do not call fetch to 127.0.0.1)
    if (!shouldAttemptOllamaForPatientChat()) {
      const presetResponse = getPresetPatientResponse(scenario, messages)
      return NextResponse.json({
        message: presetResponse,
        source: 'preset',
      })
    }

    const { patientPersona, aiInstructions } = scenario

    const systemPrompt = `You are a fictional patient in a medical training simulator.
Your name is ${patientPersona.name}, age ${patientPersona.age}, gender ${patientPersona.gender}.
Chief complaint: ${patientPersona.chiefComplaint}.
Background: ${patientPersona.background}.
Vital signs: HR ${patientPersona.vitals.heartRate} bpm, BP ${patientPersona.vitals.bloodPressure}, RR ${patientPersona.vitals.respiratoryRate}/min, O2 Sat ${patientPersona.vitals.oxygenSat}, Temp ${patientPersona.vitals.temperature}.

${aiInstructions.patientStyle}

CRITICAL RULES:
${aiInstructions.behaviorRules.map(rule => `- ${rule}`).join('\n')}

DO NOT reveal directly:
${aiInstructions.doNotRevealDirectly.map(item => `- ${item}`).join('\n')}

Key history points you know (reveal only if asked specifically):
${patientPersona.keyHistoryPoints.map(point => `- ${point}`).join('\n')}

Answer ONLY as the patient in first person. Keep responses short and conversational, like a real patient would speak. Do NOT give medical advice or diagnoses.`

    const llmMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'doctor' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ]

    const patientResponse = await callLLM(llmMessages)

    // If LLM returns empty or invalid content, use preset fallback
    if (!patientResponse || !String(patientResponse).trim()) {
      if (USE_PRESET_FALLBACK) {
        const presetResponse = getPresetPatientResponse(scenario, messages)
        return NextResponse.json({
          message: presetResponse,
          source: 'preset-fallback',
        })
      }

      return NextResponse.json(
        { error: 'Empty response from AI model' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: patientResponse,
      source: 'ai',
    })
  } catch (error: any) {
    console.error('Error in patient-chat:', error)

    const scenario =
      scenarios.find(s => s.id === bodyData.scenarioId)

    // 1. Preferred fallback: preset in-character scenario responses
    if (USE_PRESET_FALLBACK && scenario) {
      try {
        const presetResponse = getPresetPatientResponse(
          scenario,
          bodyData.messages || []
        )

        return NextResponse.json({
          message: presetResponse,
          source: 'preset-fallback',
        })
      } catch (presetError) {
        console.error('Preset fallback failed:', presetError)
      }
    }

    // 2. Secondary fallback: your existing mock demo responses
    const shouldUseDemo =
      USE_DEMO_MOCKS || process.env.FALLBACK_TO_DEMO === 'true'

    if (
      shouldUseDemo &&
      (error?.message?.includes('fetch failed') ||
        error?.message?.includes('Ollama') ||
        error?.message?.includes('ECONNREFUSED'))
    ) {
      console.log('LLM unavailable, falling back to demo mode')
      const mockResponse = getMockPatientResponse(
        bodyData.scenarioId || '',
        bodyData.messages || []
      )
      return NextResponse.json({
        message: mockResponse,
        source: 'demo-mock',
      })
    }

    const errorMessage = error?.message || 'Failed to get patient response'
    const isOllamaIssue =
      errorMessage.includes('Ollama') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('fetch failed')

    const hint = isOllamaIssue
      ? 'Start Ollama (ollama serve), pull your model (e.g. ollama pull llama3.2), and set OLLAMA_BASE_URL / OLLAMA_MODEL if needed. Preset fallback should handle most history questions automatically.'
      : 'Check the error above. Preset fallback should handle many history questions even if AI is down.'

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorMessage,
        type: error?.name || 'Error',
        demoModeAvailable: hint,
      },
      { status: 500 }
    )
  }
}