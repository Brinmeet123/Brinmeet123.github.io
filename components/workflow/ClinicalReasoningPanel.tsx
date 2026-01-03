'use client'

import { useState } from 'react'
import { ClinicalReasoning, DifferentialDiagnosis } from '@/types/workflow'

type Props = {
  differentialDiagnosis: DifferentialDiagnosis
  onComplete: (reasoning: ClinicalReasoning) => void
}

export default function ClinicalReasoningPanel({ differentialDiagnosis, onComplete }: Props) {
  const [diagnosesMovedUp, setDiagnosesMovedUp] = useState<Array<{ diagnosis: string; reason: string }>>([{ diagnosis: '', reason: '' }])
  const [diagnosesMovedDown, setDiagnosesMovedDown] = useState<Array<{ diagnosis: string; reason: string }>>([{ diagnosis: '', reason: '' }])
  const [notes, setNotes] = useState('')

  const allDiagnoses = [
    ...differentialDiagnosis.mostLikely,
    ...differentialDiagnosis.mustNotMiss,
    ...differentialDiagnosis.lessLikely,
  ]

  const handleMovedUpChange = (index: number, field: 'diagnosis' | 'reason', value: string) => {
    const newList = [...diagnosesMovedUp]
    newList[index] = { ...newList[index], [field]: value }
    setDiagnosesMovedUp(newList)
  }

  const addMovedUp = () => {
    setDiagnosesMovedUp([...diagnosesMovedUp, { diagnosis: '', reason: '' }])
  }

  const handleMovedDownChange = (index: number, field: 'diagnosis' | 'reason', value: string) => {
    const newList = [...diagnosesMovedDown]
    newList[index] = { ...newList[index], [field]: value }
    setDiagnosesMovedDown(newList)
  }

  const addMovedDown = () => {
    setDiagnosesMovedDown([...diagnosesMovedDown, { diagnosis: '', reason: '' }])
  }

  const handleSubmit = () => {
    onComplete({
      diagnosesMovedUp: diagnosesMovedUp.filter(d => d.diagnosis.trim()),
      diagnosesMovedDown: diagnosesMovedDown.filter(d => d.diagnosis.trim()),
      notes,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 8: Clinical Reasoning Update</h2>
      <p className="text-gray-600 mb-6">
        Use test results and exam findings to update your differential. Which diagnoses moved up or down, and why?
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Diagnoses Moved Up (More Likely)</h3>
        {diagnosesMovedUp.map((item, index) => (
          <div key={index} className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={item.diagnosis}
              onChange={(e) => handleMovedUpChange(index, 'diagnosis', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select diagnosis...</option>
              {allDiagnoses.map((diag) => (
                <option key={diag} value={diag}>{diag}</option>
              ))}
            </select>
            <input
              type="text"
              value={item.reason}
              onChange={(e) => handleMovedUpChange(index, 'reason', e.target.value)}
              placeholder="Why? e.g., ECG changes support cardiac cause"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        ))}
        <button
          onClick={addMovedUp}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add diagnosis moved up
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-red-700 mb-3">Diagnoses Moved Down (Less Likely)</h3>
        {diagnosesMovedDown.map((item, index) => (
          <div key={index} className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={item.diagnosis}
              onChange={(e) => handleMovedDownChange(index, 'diagnosis', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select diagnosis...</option>
              {allDiagnoses.map((diag) => (
                <option key={diag} value={diag}>{diag}</option>
              ))}
            </select>
            <input
              type="text"
              value={item.reason}
              onChange={(e) => handleMovedDownChange(index, 'reason', e.target.value)}
              placeholder="Why? e.g., No fever reduces infection likelihood"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        ))}
        <button
          onClick={addMovedDown}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add diagnosis moved down
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Reasoning Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any other clinical reasoning thoughts..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-medium"
      >
        Continue to Final Diagnosis
      </button>
    </div>
  )
}


