'use client'

type Props = {
  onInsertQuestion: (question: string) => void
}

type QuestionGroup = {
  title: string
  questions: string[]
}

const questionGroups: QuestionGroup[] = [
  {
    title: 'Core HPI',
    questions: [
      'When did this start?',
      'Can you point to where it hurts?',
      'What does it feel like?',
      'How bad is it on a scale of 0-10?',
      'Does the pain move anywhere else?',
      'Is it constant or does it come and go?',
      'What makes it better or worse?',
      'Have you had this before?'
    ]
  },
  {
    title: 'Red Flags',
    questions: [
      'Do you feel short of breath?',
      'Are you nauseated or have you vomited?',
      'Are you sweating more than usual?',
      'Do you feel dizzy or lightheaded?',
      'Have you fainted or passed out?',
      'Do you have chest pain?',
      'Is the pain getting worse?'
    ]
  },
  {
    title: 'Medications & Allergies',
    questions: [
      'What medical conditions do you have?',
      'What medications do you take?',
      'Any allergies to medications?',
      'Do you take any over-the-counter medications?',
      'Have you started any new medications recently?'
    ]
  },
  {
    title: 'Family & Social',
    questions: [
      'Does anyone in your family have similar problems?',
      'Do you smoke?',
      'Do you drink alcohol?',
      'What do you do for work?',
      'Have you traveled recently?'
    ]
  }
]

export default function QuestionBank({ onInsertQuestion }: Props) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-green-900 mb-3">
        💬 Doctor Question Templates
      </h3>
      <p className="text-sm text-green-700 mb-4">
        Click a question to insert it into the chat. You can edit it before sending.
      </p>
      
      <div className="space-y-4">
        {questionGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h4 className="text-sm font-semibold text-green-800 mb-2">{group.title}</h4>
            <div className="flex flex-wrap gap-2">
              {group.questions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => onInsertQuestion(question)}
                  className="px-3 py-1.5 bg-white border border-green-300 text-green-800 rounded-md hover:bg-green-100 hover:border-green-400 transition text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


