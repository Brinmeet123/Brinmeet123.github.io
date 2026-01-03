import { diagnosisCatalog, DiagnosisItem } from "@/data/diagnosisCatalog"
import { Scenario, DxYield, ScenarioDxOverride } from "@/data/scenarios"

export type ResolvedDx = {
  dx: DiagnosisItem
  yield: DxYield
  explanation: string
}

export function resolveDx(scenario: Scenario, dxId: string): ResolvedDx {
  const dx = diagnosisCatalog.find(d => d.id === dxId)
  
  if (!dx) {
    throw new Error(`Diagnosis ${dxId} not found in catalog`)
  }

  // Check for scenario-specific override
  const override = scenario.dxOverrides?.find(o => o.dxId === dxId)

  if (override) {
    return {
      dx,
      yield: override.yield,
      explanation: override.explanation,
    }
  }

  // Default: treat as irrelevant
  return {
    dx,
    yield: "irrelevant",
    explanation: "Not strongly supported by this case data.",
  }
}

export function calculateDxScore(yieldValue: DxYield): number {
  switch (yieldValue) {
    case "correct":
      return 3
    case "reasonable":
      return 2
    case "low":
      return 0
    case "irrelevant":
      return -1
    case "dangerous-miss":
      return -3  // Penalty for missing required dangerous diagnosis
    default:
      return 0
  }
}

export function calculateFinalDxScore(
  finalDxId: string | null,
  correctDxId: string | undefined
): number {
  if (!finalDxId || !correctDxId) {
    return 0
  }
  
  if (finalDxId === correctDxId) {
    return 5
  }
  
  // Check if it's at least a reasonable alternative
  return -2  // Wrong final diagnosis
}

export function checkMissingMustNotMiss(
  differentialDxIds: string[],
  requiredMustNotMiss: string[] | undefined
): string[] {
  if (!requiredMustNotMiss) {
    return []
  }
  
  return requiredMustNotMiss.filter(dxId => !differentialDxIds.includes(dxId))
}

export function calculateEfficiencyPenalty(differentialLength: number, maxRecommended: number = 6): number {
  if (differentialLength <= maxRecommended) {
    return 0
  }
  
  // Small penalty per extra item beyond recommended
  const extra = differentialLength - maxRecommended
  return -0.5 * extra  // -0.5 points per extra diagnosis
}

