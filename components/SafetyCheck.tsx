'use client'

import { useState } from 'react'
import { StabilityStatus, Scenario, VitalSigns } from '@/data/scenarios'

type Props = {
  scenario: Scenario
  onComplete: (status: StabilityStatus, redFlagsFound: string[]) => void
}

export default function SafetyCheck({ scenario, onComplete }: Props) {
  const [stability, setStability] = useState<StabilityStatus | null>(null)
  const [redFlagsFound, setRedFlagsFound] = useState<string[]>([])
  const [abcChecked, setAbcChecked] = useState({
    airway: false,
    breathing: false,
    circulation: false,
  })

  const handleRedFlagToggle = (flag: string) => {
    setRedFlagsFound(prev =>
      prev.includes(flag)
        ? prev.filter(f => f !== flag)
        : [...prev, flag]
    )
  }

  const handleSubmit = () => {
    if (stability) {
      onComplete(stability, redFlagsFound)
    }
  }

  const vitals = scenario.patientPersona.vitals
  const isUnstable = vitals.heartRate > 120 || 
                     vitals.heartRate < 60 ||
                     vitals.oxygenSat < '90%' ||
                     vitals.respiratoryRate > 24 ||
                     vitals.respiratoryRate < 12

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 0: Safety Check (Triage)</h2>
      <p className="text-gray-600 mb-6">
        Assess if this is an emergency. Check ABCs and scan for red flags.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">ABCs Assessment</h3>
        <div className="space-y-2">
          {[
            { id: 'airway', label: 'Airway: Patent and clear' },
            { id: 'breathing', label: 'Breathing: Adequate' },
            { id: 'circulation', label: 'Circulation: Adequate' },
          ].map(item => (
            <label key={item.id} className="flex items-center">
              <input
                type="checkbox"
                checked={abcChecked[item.id as keyof typeof abcChecked]}
                onChange={(e) => setAbcChecked(prev => ({ ...prev, [item.id]: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Red Flags</h3>
        <p className="text-sm text-gray-600 mb-3">
          Select any red flags present:
        </p>
        <div className="space-y-2">
          {scenario.patientPersona.redFlags.map(flag => (
            <label key={flag} className="flex items-center">
              <input
                type="checkbox"
                checked={redFlagsFound.includes(flag)}
                onChange={() => handleRedFlagToggle(flag)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{flag}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Stability Assessment</h3>
        <div className="space-y-3">
          <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="stability"
              value="Stable"
              checked={stability === 'Stable'}
              onChange={() => setStability('Stable')}
              className="mr-3"
            />
            <div>
              <span className="font-medium text-green-700">Stable</span>
              <p className="text-sm text-gray-600">Patient appears stable, can proceed with standard workflow</p>
            </div>
          </label>
          <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="stability"
              value="Unstable"
              checked={stability === 'Unstable'}
              onChange={() => setStability('Unstable')}
              className="mr-3"
            />
            <div>
              <span className="font-medium text-red-700">Unstable</span>
              <p className="text-sm text-gray-600">Urgent pathway required - immediate tests/actions needed</p>
            </div>
          </label>
        </div>
        {isUnstable && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Vital signs suggest potential instability. Consider "Unstable" status.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!stability || !abcChecked.airway || !abcChecked.breathing || !abcChecked.circulation}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        Continue to History Taking
      </button>
    </div>
  )
}

