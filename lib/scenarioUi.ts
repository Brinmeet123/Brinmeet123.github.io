import type { Scenario, ScenarioDifficulty } from '@/data/scenarios'

export type DifficultyUiLabel = 'Easy' | 'Medium' | 'Hard'

export function difficultyUiLabel(d: ScenarioDifficulty): DifficultyUiLabel {
  switch (d) {
    case 'Beginner':
      return 'Easy'
    case 'Intermediate':
      return 'Medium'
    case 'Advanced':
      return 'Hard'
    default:
      return 'Medium'
  }
}

/** Short teaser under each scenario card — uses chief complaint + generic hook. */
export function scenarioCardHook(scenario: Scenario): string {
  const cc = scenario.patientPersona.chiefComplaint.trim()
  return `${cc} — Many possibilities until you gather the full story.`
}
