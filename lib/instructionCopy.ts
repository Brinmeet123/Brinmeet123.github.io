/** Keys match localStorage: instruction_seen_${pageKey} */
export type InstructionPageKey = 'chat' | 'exam' | 'tests' | 'diagnosis'

export const INSTRUCTION_COPY: Record<
  InstructionPageKey,
  { title: string; lines: string[] }
> = {
  chat: {
    title: 'Talk to the Patient',
    lines: [
      'Ask questions to understand symptoms.',
      'Use the suggested questions if you’re stuck.',
      'Build your case before moving on.',
    ],
  },
  exam: {
    title: 'Run Your Exam',
    lines: [
      'Select physical exams to perform.',
      'Look for key findings.',
      'Only select the exam sections you actually need.',
    ],
  },
  tests: {
    title: 'Order Tests',
    lines: [
      'Choose the right diagnostic tests.',
      'Avoid over-ordering.',
      'Use results to narrow your diagnosis.',
    ],
  },
  diagnosis: {
    title: 'Make Your Diagnosis',
    lines: [
      'Enter your final diagnosis.',
      'Be confident, but think it through.',
      'You’ll get feedback after submitting.',
    ],
  },
}

export function instructionStorageKey(pageKey: InstructionPageKey): string {
  return `instruction_seen_${pageKey}`
}
