import { testCatalog, TestItem } from "@/data/testCatalog"
import { Scenario, ScenarioTestYield } from "@/data/scenarios"

export type ResolvedTest = {
  test: TestItem
  result: string
  yield: ScenarioTestYield
}

export function resolveTest(scenario: Scenario, testId: string): ResolvedTest {
  const test = testCatalog.find(t => t.id === testId)
  
  if (!test) {
    throw new Error(`Test ${testId} not found in catalog`)
  }

  // Check for scenario-specific override
  const override = scenario.testOverrides?.find(o => o.testId === testId)

  if (override) {
    return {
      test,
      result: override.result,
      yield: override.yield,
    }
  }

  // Use default behavior based on test kind
  const defaults = scenario.testDefaultBehavior || {
    labDefault: "Within normal limits.",
    imagingDefault: "No acute abnormality.",
    bedsideDefault: "No significant abnormality.",
    procedureDefault: "Not indicated in this case."
  }

  let result: string
  let yieldValue: ScenarioTestYield = "low"

  switch (test.kind) {
    case "Lab":
      result = defaults.labDefault
      break
    case "Imaging":
      result = defaults.imagingDefault
      break
    case "Bedside":
      result = defaults.bedsideDefault
      break
    case "Procedure":
      result = defaults.procedureDefault
      yieldValue = "inappropriate"
      break
    default:
      result = "Result not available."
  }

  return {
    test,
    result,
    yield: yieldValue,
  }
}

export function calculateTestScore(yieldValue: ScenarioTestYield): number {
  switch (yieldValue) {
    case "high":
      return 2
    case "helpful":
      return 1
    case "low":
      return 0
    case "inappropriate":
      return -2
    default:
      return 0
  }
}


