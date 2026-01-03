'use client'

import { useState } from 'react'
import { DifferentialDiagnosis } from '@/types/workflow'
import { DiagnosisOption } from '@/data/scenarios'

type Props = {
  diagnosisOptions: DiagnosisOption[]
  onComplete: (differential: DifferentialDiagnosis) => void
}

export default function DifferentialDiagnosisPanel({ diagnosisOptions, onComplete }: Props) {
  const [mostLikely, setMostLikely] = useState<Set<string>>(new Set())
  const [mustNotMiss, setMustNotMiss] = useState<Set<string>>(new Set())
  const [lessLikely, setLessLikely] = useState<Set<string>>(new Set())

  const handleDiagnosisToggle = (diagnosisId: string, category: 'mostLikely' | 'mustNotMiss' | 'lessLikely') => {
    const setters = {
      mostLikely: setMostLikely,
      mustNotMiss: setMustNotMiss,
      lessLikely: setLessLikely,
    }
    const sets = {
      mostLikely,
      mustNotMiss,
      lessLikely,
    }

    // Remove from all categories first
    setMostLikely(prev => { const s = new Set(prev); s.delete(diagnosisId); return s })
    setMustNotMiss(prev => { const s = new Set(prev); s.delete(diagnosisId); return s })
    setLessLikely(prev => { const s = new Set(prev); s.delete(diagnosisId); return s })

    // Add to selected category
    const targetSet = sets[category]
    if (!targetSet.has(diagnosisId)) {
      setters[category](prev => new Set([...prev, diagnosisId]))
    }
  }

  const handleSubmit = () => {
    const differential: DifferentialDiagnosis = {
      mostLikely: Array.from(mostLikely),
      mustNotMiss: Array.from(mustNotMiss),
      lessLikely: Array.from(lessLikely),
    }

    // Validation: require at least 1 dangerous diagnosis and 3 total
    const totalCount = mostLikely.size + mustNotMiss.size + lessLikely.size
    if (totalCount < 3) {
      alert('Please select at least 3 diagnoses total')
      return
    }
    if (mustNotMiss.size === 0) {
      alert('Please include at least one "Must-Not-Miss" (dangerous) diagnosis')
      return
    }

    onComplete(differential)
  }

  const getDiagnosisName = (id: string) => {
    return diagnosisOptions.find(d => d.id === id)?.name || id
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 6: Differential Diagnosis</h2>
      <p className="text-gray-600 mb-6">
        Organize possible diagnoses into three categories. You must include at least one "Must-Not-Miss" diagnosis.
      </p>

      <div className="space-y-6">
        <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Must-Not-Miss (Dangerous Diagnoses)</h3>
          <p className="text-sm text-yellow-800 mb-3">Life-threatening conditions that must be ruled out</p>
          <div className="space-y-2">
            {diagnosisOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                  mustNotMiss.has(option.id)
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={mustNotMiss.has(option.id)}
                  onChange={() => handleDiagnosisToggle(option.id, 'mustNotMiss')}
                  className="mr-3"
                />
                <div className="flex-1">
                  <span className="font-medium">{option.name}</span>
                  {option.isCorrect && (
                    <span className="ml-2 text-xs text-green-600">(Correct answer)</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Most Likely</h3>
          <p className="text-sm text-blue-800 mb-3">Your top differentials based on the presentation</p>
          <div className="space-y-2">
            {diagnosisOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                  mostLikely.has(option.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={mostLikely.has(option.id)}
                  onChange={() => handleDiagnosisToggle(option.id, 'mostLikely')}
                  className="mr-3"
                />
                <span className="font-medium">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-2 border-gray-200 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Less Likely but Possible</h3>
          <p className="text-sm text-gray-700 mb-3">Other considerations</p>
          <div className="space-y-2">
            {diagnosisOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                  lessLikely.has(option.id)
                    ? 'border-gray-500 bg-gray-100'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={lessLikely.has(option.id)}
                  onChange={() => handleDiagnosisToggle(option.id, 'lessLikely')}
                  className="mr-3"
                />
                <span className="font-medium">{option.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Selected:</strong> {mostLikely.size + mustNotMiss.size + lessLikely.size} total
          ({mustNotMiss.size} must-not-miss, {mostLikely.size} most likely, {lessLikely.size} less likely)
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-medium"
      >
        Continue to Diagnostic Tests
      </button>
    </div>
  )
}


