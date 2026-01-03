'use client'

import { useState } from 'react'
import { HPI } from '@/data/scenarios'

type Props = {
  chiefComplaint: string
  onComplete: (hpi: HPI) => void
}

export default function HPIForm({ chiefComplaint, onComplete }: Props) {
  const [hpi, setHpi] = useState<HPI>({
    onset: '',
    provocation: '',
    quality: '',
    radiation: '',
    severity: undefined,
    timing: '',
    associatedSymptoms: [],
    pertinentPositives: [],
    pertinentNegatives: [],
  })

  const commonSymptoms = [
    'Fever', 'Nausea', 'Vomiting', 'Shortness of breath', 'Cough',
    'Dizziness', 'Sweating', 'Weakness', 'Fatigue', 'Headache'
  ]

  const handleSymptomToggle = (symptom: string, category: 'associatedSymptoms' | 'pertinentPositives' | 'pertinentNegatives') => {
    setHpi(prev => {
      const current = prev[category] || []
      const updated = current.includes(symptom)
        ? current.filter(s => s !== symptom)
        : [...current, symptom]
      return { ...prev, [category]: updated }
    })
  }

  const handleSubmit = () => {
    onComplete(hpi)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: History of Present Illness (HPI)</h2>
      <p className="text-gray-600 mb-6">
        Build the symptom story using OPQRST framework. Chief Complaint: <strong>{chiefComplaint}</strong>
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Onset: When did it start? (Sudden/Gradual)
          </label>
          <input
            type="text"
            value={hpi.onset || ''}
            onChange={(e) => setHpi(prev => ({ ...prev, onset: e.target.value }))}
            placeholder="e.g., Sudden onset 30 minutes ago while walking"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provocation/Palliation: What makes it better/worse?
          </label>
          <input
            type="text"
            value={hpi.provocation || ''}
            onChange={(e) => setHpi(prev => ({ ...prev, provocation: e.target.value }))}
            placeholder="e.g., Worse with exertion, better with rest"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality: What does it feel like?
          </label>
          <input
            type="text"
            value={hpi.quality || ''}
            onChange={(e) => setHpi(prev => ({ ...prev, quality: e.target.value }))}
            placeholder="e.g., Pressure, sharp, burning, dull"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radiation: Does it move anywhere?
          </label>
          <input
            type="text"
            value={hpi.radiation || ''}
            onChange={(e) => setHpi(prev => ({ ...prev, radiation: e.target.value }))}
            placeholder="e.g., Radiates to left arm, jaw"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity: 0-10 scale
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={hpi.severity || ''}
            onChange={(e) => setHpi(prev => ({ ...prev, severity: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timing: Constant vs comes/goes, progression
          </label>
          <input
            type="text"
            value={hpi.timing || ''}
            onChange={(e) => setHpi(prev => ({ ...prev, timing: e.target.value }))}
            placeholder="e.g., Constant, intermittent, progressive"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Associated Symptoms (select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {commonSymptoms.map(symptom => (
              <label key={symptom} className="flex items-center">
                <input
                  type="checkbox"
                  checked={hpi.associatedSymptoms?.includes(symptom) || false}
                  onChange={() => handleSymptomToggle(symptom, 'associatedSymptoms')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pertinent Positives (symptoms present)
          </label>
          <input
            type="text"
            value={hpi.pertinentPositives?.join(', ') || ''}
            onChange={(e) => setHpi(prev => ({ ...prev, pertinentPositives: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
            placeholder="e.g., Shortness of breath, diaphoresis"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pertinent Negatives (symptoms absent - important to document)
          </label>
          <input
            type="text"
            value={hpi.pertinentNegatives?.join(', ') || ''}
            onChange={(e) => setHpi(prev => ({ ...prev, pertinentNegatives: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
            placeholder="e.g., No fever, no nausea"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-medium"
      >
        Continue to Medical Background
      </button>
    </div>
  )
}

