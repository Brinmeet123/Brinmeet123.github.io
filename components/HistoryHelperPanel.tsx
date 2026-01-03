'use client'

import { Scenario } from '@/data/scenarios'
import FocusPrompts from './FocusPrompts'
import SimpleQuestionBank from './SimpleQuestionBank'
import HintMeter from './HintMeter'

type LearningMode = 'guided' | 'standard' | 'advanced'
type ViewMode = 'simple' | 'clinical'

type Message = {
  role: 'doctor' | 'patient'
  content: string
}

type Props = {
  scenario: Scenario
  learningMode: LearningMode
  viewMode: ViewMode
  onInsertQuestion: (question: string) => void
  messages?: Message[]
}

export default function HistoryHelperPanel({ scenario, learningMode, viewMode, onInsertQuestion, messages = [] }: Props) {
  // Advanced mode: minimal or hidden
  if (learningMode === 'advanced') {
    return (
      <div className="h-full flex flex-col overflow-y-auto pr-2">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Take a focused history.</p>
        </div>
      </div>
    )
  }

  // Guided and Standard modes: show minimal helper
  return (
    <div className="h-full flex flex-col overflow-y-auto pr-2">
      {/* Focus Prompts - Collapsible thinking cues */}
      {learningMode === 'guided' && (
        <FocusPrompts onInsertQuestion={onInsertQuestion} />
      )}

      {/* Hint Meter - Only in guided mode, subtle progress tracking */}
      {learningMode === 'guided' && messages.length > 0 && (
        <HintMeter scenario={scenario} messages={messages} />
      )}

      {/* Simple Question Bank - Only in guided mode */}
      {learningMode === 'guided' && (
        <SimpleQuestionBank onInsertQuestion={onInsertQuestion} />
      )}
    </div>
  )
}

