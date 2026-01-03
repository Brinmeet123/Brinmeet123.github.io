import { NextRequest, NextResponse } from 'next/server'

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
  return data.message?.content || data.response || '{}'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { selectedText, contextText, sourceType, scenarioMeta, viewMode } = body

    if (!selectedText || typeof selectedText !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid selectedText' },
        { status: 400 }
      )
    }

    // Safety check: if the term looks like a request for medical advice
    const lowerTerm = selectedText.toLowerCase()
    const advicePatterns = [
      /what should i do/i,
      /how do i treat/i,
      /should i take/i,
      /can you help me/i,
      /what medicine/i,
      /dose|dosing/i
    ]
    
    if (advicePatterns.some(pattern => pattern.test(selectedText))) {
      return NextResponse.json({
        term: selectedText.trim(),
        definitionSimple: "I can explain medical terms, but I can't give personal medical advice. If you have health concerns, please see a licensed healthcare professional.",
        definitionClinical: "This appears to be a request for medical advice, which cannot be provided. Consult a licensed healthcare professional for personal medical concerns.",
        whyItMatters: "Medical advice requires a proper evaluation by a qualified healthcare provider.",
        whyItMattersHere: "Medical advice requires a proper evaluation by a qualified healthcare provider.",
        example: "This is for educational purposes only.",
        exampleFromContext: "This is for educational purposes only.",
        source: "ai"
      })
    }

    const systemPrompt = `You are a medical education assistant for high school students.
The user highlighted a term or phrase from a simulated medical case.
You MUST use the provided context text to infer the meaning in that situation.

CRITICAL RULES:
- Use the context text to understand how the term is used in this specific case
- If the term is medical, give a clear definition
- If it's used as a clinical adjective (like "tachycardic"), explain what it indicates in that context (e.g., "fast heart rate")
- Do NOT give medical advice, treatment instructions, dosing, or personal guidance
- Keep it accurate, concrete, and student-friendly
- If the phrase is not medical, explain it as general English
- Always emphasize that this is educational, not medical advice

Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "term": "the exact term or phrase as highlighted",
  "definitionSimple": "plain English explanation for high school students, using context when helpful",
  "definitionClinical": "more technical medical definition",
  "whyItMatters": "brief explanation of why this term is important medically",
  "whyItMattersHere": "specific explanation of why this matters in the context provided (reference the context)",
  "example": "a simple example sentence using the term",
  "exampleFromContext": "a short rephrased example based on the provided context (not a generic placeholder)",
  "synonymsOrRelated": ["synonym1", "related term2"] (optional array)
}

The "whyItMattersHere" field MUST explicitly reference what the context suggests.
The "exampleFromContext" should be a short rephrased example based on the provided context.`

    const contextInfo = contextText ? `\n\nContext from ${sourceType || 'the case'}:\n${contextText}` : ''
    const scenarioInfo = scenarioMeta ? `\n\nScenario: ${scenarioMeta.scenarioTitle || ''}\nChief Complaint: ${scenarioMeta.chiefComplaint || ''}\nSpecialty: ${scenarioMeta.specialty || ''}` : ''
    
    const userPrompt = `Explain this term or phrase: "${selectedText.trim()}"
${contextInfo}${scenarioInfo}

Provide both simple (for high school students) and clinical definitions.
Use the context to understand how this term is being used in this specific case.
If the term is used as a clinical descriptor (like "tachycardic" meaning "having a fast heart rate"), explain what it indicates in this context.`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]

    const responseText = await callOllama(messages)
    
    // Try to extract JSON from the response
    let jsonText = responseText
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonText = jsonMatch[0]
    }
    
    try {
      const explanation = JSON.parse(jsonText)
      
      // Validate the response has required fields
      if (!explanation.term || !explanation.definitionSimple) {
        throw new Error('Invalid response format')
      }
      
      return NextResponse.json({
        term: explanation.term || selectedText.trim(),
        definitionSimple: explanation.definitionSimple || '',
        definitionClinical: explanation.definitionClinical || explanation.definitionSimple || '',
        whyItMatters: explanation.whyItMatters || 'This is an important medical term to understand.',
        whyItMattersHere: explanation.whyItMattersHere || explanation.whyItMatters || '',
        example: explanation.example || `Example: The term "${selectedText.trim()}" is used in medical contexts.`,
        exampleFromContext: explanation.exampleFromContext || explanation.example || '',
        synonymsOrRelated: explanation.synonymsOrRelated || [],
        source: 'ai'
      })
    } catch (parseError) {
      // If JSON parsing fails, return a simple explanation
      return NextResponse.json({
        term: selectedText.trim(),
        definitionSimple: `The term "${selectedText.trim()}" is used in medical contexts. This is a general term that may need context to fully understand.`,
        definitionClinical: `The term "${selectedText.trim()}" may refer to a medical concept, condition, or procedure. Consult medical resources for specific definitions.`,
        whyItMatters: 'Understanding medical terminology helps in learning about healthcare.',
        whyItMattersHere: contextText ? `In this case: ${contextText.substring(0, 100)}...` : 'Understanding medical terminology helps in learning about healthcare.',
        example: `Example usage of "${selectedText.trim()}".`,
        exampleFromContext: contextText ? `In this case: ${selectedText.trim()} appears in the context provided.` : `Example usage of "${selectedText.trim()}".`,
        synonymsOrRelated: [],
        source: 'ai'
      })
    }
  } catch (error: any) {
    console.error('Error in explain-term API:', error)
    return NextResponse.json(
      {
        error: 'Failed to explain term',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

