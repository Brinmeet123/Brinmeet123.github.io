'use client'

import { useState } from 'react'
import { HPI } from '@/types/workflow'

type Props = {
  onComplete: (hpi: HPI) => void
}

const commonAssociatedSymptoms = [
  'Fever',
  'Nausea',
  'Vomiting',
  'Shortness of breath',
  'Cough',
  'Weakness',
  'Dizziness',
  'Sweating',
  'Fatigue',
  'Loss of appetite',
]

export default function HPIPanel({ onComplete }: Props) {
  const [onset, setOnset] = useState('')
  const [provocation, setProvocation] = useState('')
  const [quality, setQuality] = useState('')
  const [radiation, setRadiation] = useState('')
  const [severity, setSeverity] = useState(5)
  const [timing, setTiming] = useState('')
  const [associatedSymptoms, setAssociatedSymptoms] = useState<Set<string>>(new Set())
  const [pertinentPositives, setPertinentPositives] = useState<string[]>([''])
  const [pertinentNegatives, setPertinentNegatives] = useState<string[]>([''])

  const handleAssociatedSymptomToggle = (symptom: string) => {
    const newSet = new Set(associatedSymptoms)
    if (newSet.has(symptom)) {
      newSet.delete(symptom)
    } else {
      newSet.add(symptom)
    }
    setAssociatedSymptoms(newSet)
  }

  const handlePertinentPositiveChange = (index: number, value: string) => {
    const newList = [...pertinentPositives]
    newList[index] = value
    setPertinentPositives(newList)
  }

  const addPertinentPositive = () => {
    setPertinentPositives([...pertinentPositives, ''])
  }

  const handlePertinentNegativeChange = (index: number, value: string) => {
    const newList = [...pertinentNegatives]
    newList[index] = value
    setPertinentNegatives(newList)
  }

  const addPertinentNegative = () => {
    setPertinentNegatives([...pertinentNegatives, ''])
  }

  const handleSubmit = () => {
    onComplete({
      onset,
      provocation,
      quality,
      radiation,
      severity,
      timing,
      associatedSymptoms: Array.from(associatedSymptoms),
      pertinentPositives: pertinentPositives.filter(p => p.trim()),
      pertinentNegatives: pertinentNegatives.filter(n => n.trim()),
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: History of Present Illness (HPI)</h2>
      <p className="text-gray-600 mb-6">Use OPQRST framework to structure the symptom story</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>O</strong>nset: When did it start?
          </label>
          <input
            type="text"
            value={onset}
            onChange={(e) => setOnset(e.target.value)}
            placeholder="e.g., Sudden onset 30 minutes ago"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>P</strong>rovocation/Palliation: What makes it better/worse?
          </label>
          <input
            type="text"
            value={provocation}
            onChange={(e) => setProvocation(e.target.value)}
            placeholder="e.g., Worse with exertion, better with rest"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>Q</strong>uality: What does it feel like?
          </label>
          <input
            type="text"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            placeholder="e.g., Pressure, sharp, burning"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>R</strong>adiation: Does it move anywhere?
          </label>
          <input
            type="text"
            value={radiation}
            onChange={(e) => setRadiation(e.target.value)}
            placeholder="e.g., Radiates to left arm"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>S</strong>everity: 0-10 scale
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-primary-600 w-12 text-center">{severity}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <strong>T</strong>iming: Constant vs comes/goes?
          </label>
          <input
            type="text"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            placeholder="e.g., Constant, progressive"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Associated Symptoms
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {commonAssociatedSymptoms.map((symptom) => (
            <label
              key={symptom}
              className={`flex items-center p-2 border rounded-lg cursor-pointer transition ${
                associatedSymptoms.has(symptom)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={associatedSymptoms.has(symptom)}
                onChange={() => handleAssociatedSymptomToggle(symptom)}
                className="mr-2"
              />
              <span className="text-sm">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pertinent Positives
          </label>
          {pertinentPositives.map((positive, index) => (
            <input
              key={index}
              type="text"
              value={positive}
              onChange={(e) => handlePertinentPositiveChange(index, e.target.value)}
              placeholder="e.g., Has shortness of breath"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ))}
          <button
            onClick={addPertinentPositive}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add positive
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pertinent Negatives
          </label>
          {pertinentNegatives.map((negative, index) => (
            <input
              key={index}
              type="text"
              value={negative}
              onChange={(e) => handlePertinentNegativeChange(index, e.target.value)}
              placeholder="e.g., No fever"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ))}
          <button
            onClick={addPertinentNegative}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add negative
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-medium"
      >
        Continue to Medical Background
      </button>
    </div>
  )
}


