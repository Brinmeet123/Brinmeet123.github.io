'use client'

import { useState } from 'react'

type ViewMode = 'simple' | 'clinical'

type Props = {
  viewMode?: ViewMode
  onItemComplete?: (item: string) => void
}

type ChecklistItem = {
  id: string
  labelSimple: string
  labelClinical: string
  description: string
  medicalTerm?: string
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'onset',
    labelSimple: 'Onset',
    labelClinical: 'Onset',
    description: 'When did this start? Was it sudden or gradual?',
    medicalTerm: 'Onset'
  },
  {
    id: 'location',
    labelSimple: 'Location',
    labelClinical: 'Location',
    description: 'Where exactly is the problem? Can you point to it?',
    medicalTerm: 'Location'
  },
  {
    id: 'quality',
    labelSimple: 'Quality',
    labelClinical: 'Quality',
    description: 'What does it feel like? Sharp, dull, pressure, burning?',
    medicalTerm: 'Quality'
  },
  {
    id: 'severity',
    labelSimple: 'Severity',
    labelClinical: 'Severity (0-10 scale)',
    description: 'How bad is it on a scale of 0-10?',
    medicalTerm: 'Severity'
  },
  {
    id: 'radiation',
    labelSimple: 'Radiation',
    labelClinical: 'Radiation',
    description: 'Does the pain or problem move anywhere else?',
    medicalTerm: 'Radiation'
  },
  {
    id: 'timing',
    labelSimple: 'Timing',
    labelClinical: 'Timing',
    description: 'Is it constant or does it come and go? When does it happen?',
    medicalTerm: 'Timing'
  },
  {
    id: 'aggravating',
    labelSimple: 'What makes it worse?',
    labelClinical: 'Aggravating factors',
    description: 'What activities or positions make it worse?',
    medicalTerm: 'Aggravating factors'
  },
  {
    id: 'alleviating',
    labelSimple: 'What makes it better?',
    labelClinical: 'Alleviating factors',
    description: 'What helps relieve the problem?',
    medicalTerm: 'Alleviating factors'
  },
  {
    id: 'associated',
    labelSimple: 'Other symptoms',
    labelClinical: 'Associated symptoms',
    description: 'Do you have any other symptoms like nausea, sweating, or shortness of breath?',
    medicalTerm: 'Associated symptoms'
  },
  {
    id: 'pmh',
    labelSimple: 'Past medical history',
    labelClinical: 'Past Medical History (PMH)',
    description: 'What medical conditions do you have?',
    medicalTerm: 'Past Medical History'
  },
  {
    id: 'meds',
    labelSimple: 'Medications',
    labelClinical: 'Medications',
    description: 'What medications are you currently taking?',
    medicalTerm: 'Medications'
  },
  {
    id: 'allergies',
    labelSimple: 'Allergies',
    labelClinical: 'Allergies',
    description: 'Do you have any allergies to medications or other things?',
    medicalTerm: 'Allergies'
  }
]

export default function GuidedChecklist({ viewMode = 'simple', onItemComplete }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const handleToggle = (id: string) => {
    const newCompleted = new Set(completed)
    if (newCompleted.has(id)) {
      newCompleted.delete(id)
    } else {
      newCompleted.add(id)
      if (onItemComplete) {
        onItemComplete(id)
      }
    }
    setCompleted(newCompleted)
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">
        📋 History Checklist (OPQRST + More)
      </h3>
      <p className="text-sm text-blue-700 mb-4">
        Use this checklist to make sure you ask about all the important areas. Check off items as you cover them.
      </p>
      
      <div className="space-y-2">
        {checklistItems.map(item => {
          const isCompleted = completed.has(item.id)
          const label = viewMode === 'simple' ? item.labelSimple : item.labelClinical
          
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-2 rounded transition ${
                isCompleted ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                id={item.id}
                checked={isCompleted}
                onChange={() => handleToggle(item.id)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor={item.id}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                    {label}
                  </span>
                  {viewMode === 'clinical' && item.medicalTerm && (
                    <span className="text-xs text-gray-500 italic">
                      ({item.medicalTerm})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {item.description}
                </p>
              </label>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-600">
          Progress: {completed.size} / {checklistItems.length} completed
        </p>
      </div>
    </div>
  )
}


