import { NextRequest, NextResponse } from 'next/server'
import { scenarios } from '@/data/scenarios'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3'

async function callOllama(messages: Array<{ role: string; content: string }>) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: messages,
      stream: false,
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Ollama API error: ${res.status} ${errorText}`)
  }

  const data = await res.json()
  return data.message?.content || data.response || "I'm not sure how to respond to that."
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scenarioId, messages } = body
    
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

    const { patientPersona, aiInstructions } = scenario

    // Create system prompt
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

    // Convert messages to Ollama format
    const ollamaMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'doctor' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ]

    console.log('Calling Ollama API with', ollamaMessages.length, 'messages')
    
    const patientResponse = await callOllama(ollamaMessages)
    
    console.log('Ollama response received successfully')
    return NextResponse.json({ message: patientResponse })
  } catch (error: any) {
    console.error('Error in patient-chat:', error)
    
    let errorMessage = 'Failed to get patient response'
    let errorDetails = error?.message || 'Unknown error'
    
    if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('fetch failed')) {
      errorMessage = 'Cannot connect to Ollama. Make sure Ollama is running on localhost:11434'
      errorDetails = 'Start Ollama with: ollama serve'
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        type: error?.name || 'Error'
      },
      { status: 500 }
    )
  }
}
