'use client'

import { useState } from 'react'

type Props = {
  onInsertQuestion: (question: string) => void
}

type FocusPrompt = {
  id: string
  label: string
  questions: string[]
}

const focusPrompts: FocusPrompt[] = [
  {
    id: 'main-symptom',
    label: 'Clarify the main symptom',
    questions: [
      'Can you tell me more about what you\'re feeling?',
      'What does it feel like?'
    ]
  },
  {
    id: 'timing',
    label: 'Understand timing and progression',
    questions: [
      'When did this start?',
      'Has it been getting better or worse?'
    ]
  },
  {
    id: 'location',
    label: 'Pinpoint where it is',
    questions: [
      'Where exactly do you feel it?',
      'Does it go anywhere else?'
    ]
  },
  {
    id: 'red-flags',
    label: 'Ask about 1–2 red flags',
    questions: [
      'Any shortness of breath, nausea, or sweating?',
      'Does anything make it worse?'
    ]
  },
  {
    id: 'background',
    label: 'Check relevant background',
    questions: [
      'Do you have any medical conditions?',
      'Do you take any medications?'
    ]
  }
]

export default function FocusPrompts({ onInsertQuestion }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const handleToggle = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">History Focus</h3>
      <div className="space-y-2">
        {focusPrompts.map(prompt => {
          const isExpanded = expanded.has(prompt.id)
          
          return (
            <div
              key={prompt.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow"
            >
              <button
                onClick={() => handleToggle(prompt.id)}
                className="w-full px-3 py-2.5 text-left flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="text-sm text-gray-900">{prompt.label}</span>
                <span className="text-gray-400 text-xs">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>
              
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-gray-50">
                  <div className="space-y-1.5">
                    {prompt.questions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation()
                          onInsertQuestion(question)
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


