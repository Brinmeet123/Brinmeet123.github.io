import type { ClinicalSection } from '@/components/SectionNav'

const GUIDANCE_LINES: Record<ClinicalSection, string> = {
  history: 'Ask questions to understand the patient.',
  exam: 'Review findings and decide what matters.',
  tests: 'Choose tests to confirm your thinking.',
  diagnosis: 'Enter your diagnosis.',
  debrief: 'Review your report.',
}

export function getScenarioSectionGuidanceLine(section: ClinicalSection): string {
  return GUIDANCE_LINES[section]
}
