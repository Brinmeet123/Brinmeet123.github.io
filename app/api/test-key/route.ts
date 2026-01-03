import { NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3'

export async function GET() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'user', content: 'Say "Ollama is working!" in one sentence.' }
        ],
        stream: false,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        {
          success: false,
          error: `Ollama API error: ${res.status}`,
          details: errorText || 'Make sure Ollama is running on localhost:11434',
        },
        { status: 500 }
      )
    }

    const data = await res.json()
    const response = data.message?.content || data.response || 'No response'

    return NextResponse.json({
      success: true,
      message: 'Ollama is working!',
      testResponse: response,
      model: OLLAMA_MODEL,
      ollamaUrl: OLLAMA_URL,
    })
  } catch (error: any) {
    let errorMessage = 'Unknown error'
    let errorDetails = 'Check your Ollama connection'
    
    if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('fetch failed')) {
      errorMessage = 'Cannot connect to Ollama'
      errorDetails = 'Make sure Ollama is running. Start it with: ollama serve'
    } else if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
        hint: 'Make sure Ollama is running on http://localhost:11434',
      },
      { status: 500 }
    )
  }
}
