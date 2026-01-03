'use client'

import { useState } from 'react'
import { MedicalBackground } from '@/types/workflow'

type Props = {
  onComplete: (background: MedicalBackground) => void
}

export default function MedicalBackgroundPanel({ onComplete }: Props) {
  const [pmh, setPmh] = useState<string[]>([''])
  const [medications, setMedications] = useState<string[]>([''])
  const [allergies, setAllergies] = useState<Array<{ allergen: string; reaction: string }>>([{ allergen: '', reaction: '' }])
  const [familyHistory, setFamilyHistory] = useState<string[]>([''])
  const [socialHistory, setSocialHistory] = useState({
    smoking: '',
    alcohol: '',
    drugs: '',
    occupation: '',
    travel: '',
    sexualHistory: '',
  })
  const [ros, setRos] = useState<Record<string, string>>({})

  const systems = [
    'Constitutional', 'HEENT', 'Cardiovascular', 'Respiratory', 'Gastrointestinal',
    'Genitourinary', 'Musculoskeletal', 'Neurological', 'Endocrine', 'Hematologic',
    'Psychiatric', 'Skin'
  ]

  const handleArrayChange = (arr: string[], setter: (arr: string[]) => void, index: number, value: string) => {
    const newArr = [...arr]
    newArr[index] = value
    setter(newArr)
  }

  const addArrayItem = (arr: string[], setter: (arr: string[]) => void) => {
    setter([...arr, ''])
  }

  const handleAllergyChange = (index: number, field: 'allergen' | 'reaction', value: string) => {
    const newAllergies = [...allergies]
    newAllergies[index] = { ...newAllergies[index], [field]: value }
    setAllergies(newAllergies)
  }

  const addAllergy = () => {
    setAllergies([...allergies, { allergen: '', reaction: '' }])
  }

  const handleSubmit = () => {
    onComplete({
      pastMedicalHistory: pmh.filter(p => p.trim()),
      medications: medications.filter(m => m.trim()),
      allergies: allergies.filter(a => a.allergen.trim()),
      familyHistory: familyHistory.filter(f => f.trim()),
      socialHistory,
      reviewOfSystems: ros,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Medical Background History</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Past Medical History (PMH)</label>
          {pmh.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(pmh, setPmh, index, e.target.value)}
              placeholder="e.g., Hypertension, Diabetes"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ))}
          <button
            onClick={() => addArrayItem(pmh, setPmh)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add condition
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
          {medications.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(medications, setMedications, index, e.target.value)}
              placeholder="e.g., Lisinopril 10mg daily"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ))}
          <button
            onClick={() => addArrayItem(medications, setMedications)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add medication
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
          {allergies.map((allergy, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={allergy.allergen}
                onChange={(e) => handleAllergyChange(index, 'allergen', e.target.value)}
                placeholder="Allergen"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                value={allergy.reaction}
                onChange={(e) => handleAllergyChange(index, 'reaction', e.target.value)}
                placeholder="Reaction"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}
          <button
            onClick={addAllergy}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add allergy
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
          {familyHistory.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(familyHistory, setFamilyHistory, index, e.target.value)}
              placeholder="e.g., Father: Heart disease at age 55"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ))}
          <button
            onClick={() => addArrayItem(familyHistory, setFamilyHistory)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Add family history
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Social History</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Smoking</label>
              <input
                type="text"
                value={socialHistory.smoking}
                onChange={(e) => setSocialHistory({ ...socialHistory, smoking: e.target.value })}
                placeholder="e.g., Never smoker"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Alcohol</label>
              <input
                type="text"
                value={socialHistory.alcohol}
                onChange={(e) => setSocialHistory({ ...socialHistory, alcohol: e.target.value })}
                placeholder="e.g., Occasional"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Drugs</label>
              <input
                type="text"
                value={socialHistory.drugs}
                onChange={(e) => setSocialHistory({ ...socialHistory, drugs: e.target.value })}
                placeholder="e.g., None"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Occupation</label>
              <input
                type="text"
                value={socialHistory.occupation}
                onChange={(e) => setSocialHistory({ ...socialHistory, occupation: e.target.value })}
                placeholder="e.g., Construction worker"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Travel</label>
              <input
                type="text"
                value={socialHistory.travel}
                onChange={(e) => setSocialHistory({ ...socialHistory, travel: e.target.value })}
                placeholder="e.g., No recent travel"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sexual History</label>
              <input
                type="text"
                value={socialHistory.sexualHistory}
                onChange={(e) => setSocialHistory({ ...socialHistory, sexualHistory: e.target.value })}
                placeholder="If relevant"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Review of Systems (ROS)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {systems.map((system) => (
              <div key={system}>
                <label className="block text-xs text-gray-600 mb-1">{system}</label>
                <input
                  type="text"
                  value={ros[system] || ''}
                  onChange={(e) => setRos({ ...ros, [system]: e.target.value })}
                  placeholder="Positive or negative findings"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ))}
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


