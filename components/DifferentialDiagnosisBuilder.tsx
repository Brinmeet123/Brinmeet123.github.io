'use client'

import { useState } from 'react'
import { DiagnosisOption, DifferentialDiagnosis, DifferentialDiagnosisCategory } from '@/data/scenarios'

type Props = {
  diagnosisOptions: DiagnosisOption[]
  onComplete: (differentials: DifferentialDiagnosis[]) => void
}

export default function DifferentialDiagnosisBuilder({ diagnosisOptions, onComplete }: Props) {
  const [differentials, setDifferentials] = useState<DifferentialDiagnosis[]>([])

  const handleAddDiagnosis = (option: DiagnosisOption, category: DifferentialDiagnosisCategory) => {
    const existing = differentials.find(d => d.id === option.id)
    if (existing) {
      // Update category
      setDifferentials(prev => prev.map(d => 
        d.id === option.id ? { ...d, category } : d
      ))
    } else {
      // Add new
      setDifferentials(prev => [...prev, {
        id: option.id,
        name: option.name,
        category,
        reasoning: ''
      }])
    }
  }

  const handleRemoveDiagnosis = (id: string) => {
    setDifferentials(prev => prev.filter(d => d.id !== id))
  }

  const handleReasoningUpdate = (id: string, reasoning: string) => {
    setDifferentials(prev => prev.map(d => 
      d.id === id ? { ...d, reasoning } : d
    ))
  }

  const mostLikely = differentials.filter(d => d.category === 'Most Likely')
  const mustNotMiss = differentials.filter(d => d.category === 'Must-Not-Miss')
  const lessLikely = differentials.filter(d => d.category === 'Less Likely')

  const hasDangerous = mustNotMiss.length > 0
  const hasEnough = differentials.length >= 3

  const handleSubmit = () => {
    if (hasDangerous && hasEnough) {
      onComplete(differentials)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 6: Build Differential Diagnosis</h2>
      <p className="text-gray-600 mb-6">
        Create a ranked list of possible causes. Require at least 1 dangerous diagnosis and 3 total options.
      </p>

      <div className="space-y-6">
        {/* Most Likely */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Most Likely</h3>
          <div className="space-y-2 mb-3">
            {mostLikely.map(diff => (
              <div key={diff.id} className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{diff.name}</span>
                  <button
                    onClick={() => handleRemoveDiagnosis(diff.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={diff.reasoning || ''}
                  onChange={(e) => handleReasoningUpdate(diff.id, e.target.value)}
                  placeholder="Why is this most likely?"
                  rows={2}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                const option = diagnosisOptions.find(o => o.id === e.target.value)
                if (option) handleAddDiagnosis(option, 'Most Likely')
                e.target.value = ''
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">+ Add Most Likely Diagnosis</option>
            {diagnosisOptions.filter(o => !differentials.find(d => d.id === o.id)).map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>

        {/* Must-Not-Miss */}
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-3">
            Must-Not-Miss (Dangerous) {!hasDangerous && <span className="text-red-500 text-sm">*Required</span>}
          </h3>
          <div className="space-y-2 mb-3">
            {mustNotMiss.map(diff => (
              <div key={diff.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{diff.name}</span>
                  <button
                    onClick={() => handleRemoveDiagnosis(diff.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={diff.reasoning || ''}
                  onChange={(e) => handleReasoningUpdate(diff.id, e.target.value)}
                  placeholder="Why must this not be missed?"
                  rows={2}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                const option = diagnosisOptions.find(o => o.id === e.target.value)
                if (option) handleAddDiagnosis(option, 'Must-Not-Miss')
                e.target.value = ''
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">+ Add Must-Not-Miss Diagnosis</option>
            {diagnosisOptions.filter(o => !differentials.find(d => d.id === o.id)).map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>

        {/* Less Likely */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Less Likely but Possible</h3>
          <div className="space-y-2 mb-3">
            {lessLikely.map(diff => (
              <div key={diff.id} className="p-3 border border-gray-200 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{diff.name}</span>
                  <button
                    onClick={() => handleRemoveDiagnosis(diff.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={diff.reasoning || ''}
                  onChange={(e) => handleReasoningUpdate(diff.id, e.target.value)}
                  placeholder="Why is this less likely?"
                  rows={2}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                const option = diagnosisOptions.find(o => o.id === e.target.value)
                if (option) handleAddDiagnosis(option, 'Less Likely')
                e.target.value = ''
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">+ Add Less Likely Diagnosis</option>
            {diagnosisOptions.filter(o => !differentials.find(d => d.id === o.id)).map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          Requirements: {hasDangerous ? '✓' : '✗'} At least 1 dangerous diagnosis, {hasEnough ? '✓' : '✗'} At least 3 total diagnoses
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!hasDangerous || !hasEnough}
        className="w-full mt-4 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        Continue to Diagnostic Plan
      </button>
    </div>
  )
}

