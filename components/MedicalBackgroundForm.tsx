'use client'

import { useState } from 'react'
import { MedicalBackground } from '@/data/scenarios'

type Props = {
  onComplete: (background: MedicalBackground) => void
}

export default function MedicalBackgroundForm({ onComplete }: Props) {
  const [background, setBackground] = useState<MedicalBackground>({
    pastMedicalHistory: [],
    medications: [],
    allergies: [],
    familyHistory: [],
    socialHistory: {},
    reviewOfSystems: {},
  })

  const handleArrayField = (field: keyof MedicalBackground, value: string) => {
    const current = background[field] as string[] || []
    if (value && !current.includes(value)) {
      setBackground(prev => ({ ...prev, [field]: [...current, value] }))
    }
  }

  const handleAllergyAdd = () => {
    const allergen = prompt('Allergen:')
    const reaction = prompt('Reaction:')
    if (allergen && reaction) {
      setBackground(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), { allergen, reaction }]
      }))
    }
  }

  const handleSubmit = () => {
    onComplete(background)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Medical Background History</h2>
      <p className="text-gray-600 mb-6">Gather context and risk factors.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Past Medical History (PMH)
          </label>
          <input
            type="text"
            placeholder="e.g., Hypertension, Diabetes, Previous MI"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleArrayField('pastMedicalHistory', e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {background.pastMedicalHistory?.map((item, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medications
          </label>
          <input
            type="text"
            placeholder="e.g., Lisinopril 10mg daily, Aspirin 81mg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleArrayField('medications', e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {background.medications?.map((item, idx) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <button
            onClick={handleAllergyAdd}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
          >
            + Add Allergy
          </button>
          <div className="mt-2 space-y-1">
            {background.allergies?.map((allergy, idx) => (
              <span key={idx} className="block px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                {allergy.allergen}: {allergy.reaction}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Family History
          </label>
          <input
            type="text"
            placeholder="e.g., Father: heart attack at 50, Mother: diabetes"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleArrayField('familyHistory', e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Social History
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Smoking</label>
              <input
                type="text"
                value={background.socialHistory?.smoking || ''}
                onChange={(e) => setBackground(prev => ({
                  ...prev,
                  socialHistory: { ...prev.socialHistory, smoking: e.target.value }
                }))}
                placeholder="e.g., Never, Former 10 pack-years"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Alcohol</label>
              <input
                type="text"
                value={background.socialHistory?.alcohol || ''}
                onChange={(e) => setBackground(prev => ({
                  ...prev,
                  socialHistory: { ...prev.socialHistory, alcohol: e.target.value }
                }))}
                placeholder="e.g., Occasional, 2-3 drinks/week"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Occupation</label>
              <input
                type="text"
                value={background.socialHistory?.occupation || ''}
                onChange={(e) => setBackground(prev => ({
                  ...prev,
                  socialHistory: { ...prev.socialHistory, occupation: e.target.value }
                }))}
                placeholder="e.g., Construction worker"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Travel</label>
              <input
                type="text"
                value={background.socialHistory?.travel || ''}
                onChange={(e) => setBackground(prev => ({
                  ...prev,
                  socialHistory: { ...prev.socialHistory, travel: e.target.value }
                }))}
                placeholder="e.g., None recent"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-medium"
      >
        Continue to Problem Representation
      </button>
    </div>
  )
}

