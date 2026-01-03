'use client'

import { useState } from 'react'
import { SafetyCheck, StabilityStatus } from '@/types/workflow'

type Props = {
  onComplete: (safetyCheck: SafetyCheck) => void
  redFlags: string[]
}

export default function SafetyCheckPanel({ onComplete, redFlags }: Props) {
  const [stability, setStability] = useState<StabilityStatus>('Unknown')
  const [selectedRedFlags, setSelectedRedFlags] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState('')

  const handleRedFlagToggle = (flag: string) => {
    const newSet = new Set(selectedRedFlags)
    if (newSet.has(flag)) {
      newSet.delete(flag)
    } else {
      newSet.add(flag)
    }
    setSelectedRedFlags(newSet)
  }

  const handleSubmit = () => {
    onComplete({
      stability,
      redFlags: Array.from(selectedRedFlags),
      notes,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 0: Safety Check (Triage)</h2>
      <p className="text-gray-600 mb-6">
        Assess the patient's stability. Check ABCs (Airway, Breathing, Circulation) and scan for red flags.
      </p>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Stability Status
        </label>
        <div className="space-y-2">
          <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="stability"
              value="Stable"
              checked={stability === 'Stable'}
              onChange={(e) => setStability(e.target.value as StabilityStatus)}
              className="mr-3"
            />
            <div>
              <span className="font-medium text-green-700">Stable</span>
              <p className="text-sm text-gray-600">Patient appears stable, can proceed with standard evaluation</p>
            </div>
          </label>
          <label className="flex items-center p-3 border-2 border-red-200 rounded-lg cursor-pointer hover:bg-red-50">
            <input
              type="radio"
              name="stability"
              value="Unstable"
              checked={stability === 'Unstable'}
              onChange={(e) => setStability(e.target.value as StabilityStatus)}
              className="mr-3"
            />
            <div>
              <span className="font-medium text-red-700">Unstable</span>
              <p className="text-sm text-gray-600">Urgent pathway required - immediate tests/actions needed</p>
            </div>
          </label>
          <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="stability"
              value="Unknown"
              checked={stability === 'Unknown'}
              onChange={(e) => setStability(e.target.value as StabilityStatus)}
              className="mr-3"
            />
            <div>
              <span className="font-medium text-gray-700">Unknown</span>
              <p className="text-sm text-gray-600">Need more information to determine</p>
            </div>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Red Flags (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {redFlags.map((flag) => (
            <label
              key={flag}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                selectedRedFlags.has(flag)
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedRedFlags.has(flag)}
                onChange={() => handleRedFlagToggle(flag)}
                className="mr-3"
              />
              <span className="text-sm">{flag}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Document your triage assessment..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={stability === 'Unknown'}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        Continue to History Taking
      </button>
    </div>
  )
}


