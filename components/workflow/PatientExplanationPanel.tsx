'use client'

import { useState } from 'react'
import { PatientExplanation } from '@/types/workflow'
import { Scenario } from '@/data/scenarios'

type Props = {
  scenario: Scenario
  finalDiagnosis: string
  onComplete: (explanation: PatientExplanation) => void
}

export default function PatientExplanationPanel({ scenario, finalDiagnosis, onComplete }: Props) {
  const [explanation, setExplanation] = useState('')
  const [keyPoints, setKeyPoints] = useState<string[]>([''])

  const handleKeyPointChange = (index: number, value: string) => {
    const newList = [...keyPoints]
    newList[index] = value
    setKeyPoints(newList)
  }

  const addKeyPoint = () => {
    setKeyPoints([...keyPoints, ''])
  }

  const handleSubmit = () => {
    onComplete({
      explanation,
      keyPoints: keyPoints.filter(p => p.trim()),
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 10: Explain Diagnosis to Patient</h2>
      <p className="text-gray-600 mb-6">
        Practice patient-friendly communication. Explain the diagnosis in simple words that the patient can understand.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Patient-Friendly Explanation
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain the diagnosis in simple, clear language. Avoid medical jargon..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={6}
        />
        <p className="text-xs text-gray-500 mt-2">
          Use simple words. Imagine explaining this to a family member who isn't a doctor.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Key Points Patient Needs to Understand
        </label>
        {keyPoints.map((point, index) => (
          <input
            key={index}
            type="text"
            value={point}
            onChange={(e) => handleKeyPointChange(index, e.target.value)}
            placeholder="e.g., This is treatable, Follow-up is important"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        ))}
        <button
          onClick={addKeyPoint}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add key point
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Consider what questions the patient might ask:
          "Is it serious?" "What happens next?" "Do I need to worry?"
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!explanation.trim()}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        Continue to Plan and Disposition
      </button>
    </div>
  )
}


