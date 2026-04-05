'use client'

type Props = {
  onInsertQuestion: (question: string) => void
}

// Reduced to 8 core questions, no categories
const coreQuestions = [
  'Can you tell me more about what you\'re feeling?',
  'When did this start?',
  'What makes it better or worse?',
  'Where exactly do you feel it?',
  'Does it go anywhere else?',
  'Any shortness of breath, nausea, or sweating?',
  'Do you have any medical conditions?',
  'Do you take any medications?'
]

export default function SimpleQuestionBank({ onInsertQuestion }: Props) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">📌 Quick Questions (Click to Ask)</h3>
      <p className="text-xs text-gray-600 mb-3">Sends immediately to the patient</p>
      <div className="grid grid-cols-1 gap-1.5">
        {coreQuestions.map((question, idx) => (
          <button
            key={idx}
            onClick={() => onInsertQuestion(question)}
            className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}


