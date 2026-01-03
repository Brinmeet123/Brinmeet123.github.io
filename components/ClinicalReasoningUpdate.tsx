'use client'

import { useState } from 'react'
import { DifferentialDiagnosis } from '@/data/scenarios'

type Props = {
  differentials: DifferentialDiagnosis[]
  onComplete: (updates: Array<{ id: string; moved: 'up' | 'down'; reasoning: string }>) => void
}

export default function ClinicalReasoningUpdate({ differentials, onComplete }: Props) {
  const [updates, setUpdates] = useState<Array<{ id: string; moved: 'up' | 'down'; reasoning: string }>>([])

  const handleUpdate = (id: string, moved: 'up' | 'down', reasoning: string) => {
    setUpdates(prev => {
      const existing = prev.find(u => u.id === id)
      if (existing) {
        return prev.map(u => u.id === id ? { id, moved, reasoning } : u)
      }
      return [...prev, { id, moved, reasoning }]
    })
  }

  const handleSubmit = () => {
    onComplete(updates)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 8: Clinical Reasoning Update</h2>
      <p className="text-gray-600 mb-6">
        Use new data (test results, exam findings) to eliminate and prioritize diagnoses.
      </p>

      <div className="space-y-4">
        {differentials.map(diff => (
          <div key={diff.id} className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">{diff.name}</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`moved-${diff.id}`}
                  value="up"
                  onChange={() => handleUpdate(diff.id, 'up', updates.find(u => u.id === diff.id)?.reasoning || '')}
                  className="mr-2"
                />
                <span className="text-sm text-green-700">Moved UP in priority</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`moved-${diff.id}`}
                  value="down"
                  onChange={() => handleUpdate(diff.id, 'down', updates.find(u => u.id === diff.id)?.reasoning || '')}
                  className="mr-2"
                />
                <span className="text-sm text-red-700">Moved DOWN in priority</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`moved-${diff.id}`}
                  value="none"
                  onChange={() => setUpdates(prev => prev.filter(u => u.id !== diff.id))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">No change</span>
              </label>
              {updates.find(u => u.id === diff.id) && (
                <textarea
                  value={updates.find(u => u.id === diff.id)?.reasoning || ''}
                  onChange={(e) => {
                    const update = updates.find(u => u.id === diff.id)
                    if (update) {
                      handleUpdate(diff.id, update.moved, e.target.value)
                    }
                  }}
                  placeholder={`Why did this diagnosis move ${updates.find(u => u.id === diff.id)?.moved}?`}
                  rows={2}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Be explicit about your reasoning. For example: "ECG changes support cardiac cause" or "No fever reduces infection likelihood."
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-medium"
      >
        Continue to Final Diagnosis
      </button>
    </div>
  )
}

