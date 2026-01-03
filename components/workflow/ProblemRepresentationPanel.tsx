'use client'

import { useState, useEffect } from 'react'
import { ProblemRepresentation, HPI, MedicalBackground } from '@/types/workflow'
import { Scenario } from '@/data/scenarios'

type Props = {
  scenario: Scenario
  hpi: HPI | null
  medicalBackground: MedicalBackground | null
  onComplete: (representation: ProblemRepresentation) => void
}

export default function ProblemRepresentationPanel({ scenario, hpi, medicalBackground, onComplete }: Props) {
  const [summary, setSummary] = useState('')

  useEffect(() => {
    // Auto-generate problem representation
    if (hpi && medicalBackground) {
      const age = scenario.patientPersona.age
      const gender = scenario.patientPersona.gender
      const riskFactors = [
        ...medicalBackground.pastMedicalHistory,
        ...medicalBackground.familyHistory.filter(f => f.toLowerCase().includes('heart') || f.toLowerCase().includes('cardiac')),
      ].join(', ') || 'no significant risk factors'

      const timeCourse = hpi.onset || 'recent onset'
      const keySymptoms = [
        hpi.quality,
        hpi.radiation && `radiating to ${hpi.radiation}`,
        hpi.timing,
      ].filter(Boolean).join(', ')

      const associated = hpi.associatedSymptoms.length > 0
        ? `with ${hpi.associatedSymptoms.slice(0, 2).join(' and ')}`
        : ''

      const autoSummary = `${age}-year-old ${gender.toLowerCase()} with ${riskFactors} presenting with ${timeCourse} ${keySymptoms} ${associated}.`
      setSummary(autoSummary)
    }
  }, [hpi, medicalBackground, scenario])

  const handleSubmit = () => {
    onComplete({ summary })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Problem Representation</h2>
      <p className="text-gray-600 mb-6">
        Create a one-sentence clinical summary. This will guide your diagnostic reasoning.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          One-Sentence Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="[Age][sex] with [risk factors] presenting with [time course] [key symptom descriptors] with [key associated symptoms]."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-2">
          Template: [Age][sex] with [risk factors] presenting with [time course] [key symptoms] with [associated symptoms].
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!summary.trim()}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        Continue to Physical Exam
      </button>
    </div>
  )
}


