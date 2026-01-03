'use client'

import { useState } from 'react'
import { Scenario, FinalDiagnosis } from '@/data/scenarios'

type Message = {
  role: 'doctor' | 'patient'
  content: string
}

type Props = {
  scenario: Scenario
  finalDiagnosis: FinalDiagnosis
  onComplete: (explanation: string) => void
}

export default function PatientCommunication({ scenario, finalDiagnosis, onComplete }: Props) {
  const [explanation, setExplanation] = useState('')
  const [patientQuestions, setPatientQuestions] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const diagnosisName = scenario.diagnosisOptions.find(d => d.id === finalDiagnosis.diagnosisId)?.name || ''

  const handleAskPatient = async (question: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/patient-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: [
            { role: 'patient', content: scenario.patientPersona.chiefComplaint },
            { role: 'doctor', content: `I need to explain the diagnosis to you. ${question}` }
          ],
        }),
      })

      const data = await response.json()
      setPatientQuestions(prev => [...prev, 
        { role: 'doctor', content: question },
        { role: 'patient', content: data.message }
      ])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (explanation.trim()) {
      onComplete(explanation)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 10: Explain Diagnosis to Patient</h2>
      <p className="text-gray-600 mb-6">
        Practice patient-friendly language. Explain the diagnosis in simple words.
      </p>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Diagnosis to explain:</strong> {diagnosisName}
        </p>
        <p className="text-sm text-blue-800">
          <strong>Confidence:</strong> {finalDiagnosis.confidence}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Explanation (in simple, patient-friendly words):
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain what this diagnosis means, what the patient needs to understand today, and what happens next. Use simple language, avoid jargon."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Practice Questions (optional):</p>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => handleAskPatient('Is this serious?')}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            Ask: "Is this serious?"
          </button>
          <button
            onClick={() => handleAskPatient('What happens next?')}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            Ask: "What happens next?"
          </button>
        </div>
        {patientQuestions.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {patientQuestions.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded text-sm ${msg.role === 'doctor' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
                <strong>{msg.role === 'doctor' ? 'You' : scenario.patientPersona.name}:</strong> {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!explanation.trim()}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        Continue to Plan & Disposition
      </button>
    </div>
  )
}

