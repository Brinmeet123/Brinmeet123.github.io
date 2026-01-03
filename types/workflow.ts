// Workflow state types for the diagnostic process

export type StabilityStatus = 'Stable' | 'Unstable' | 'Unknown'

export type SafetyCheck = {
  stability: StabilityStatus
  redFlags: string[]
  notes: string
}

export type HPI = {
  onset: string // When did it start? Sudden/gradual?
  provocation: string // What makes it better/worse?
  quality: string // What does it feel like?
  radiation: string // Does it move anywhere?
  severity: number // 0-10
  timing: string // Constant vs comes/goes
  associatedSymptoms: string[] // fever, nausea, etc.
  pertinentPositives: string[]
  pertinentNegatives: string[]
}

export type MedicalBackground = {
  pastMedicalHistory: string[]
  medications: string[]
  allergies: Array<{ allergen: string; reaction: string }>
  familyHistory: string[]
  socialHistory: {
    smoking: string
    alcohol: string
    drugs: string
    occupation: string
    travel: string
    sexualHistory: string
  }
  reviewOfSystems: Record<string, string> // system -> findings
}

export type ProblemRepresentation = {
  summary: string // One-sentence summary
}

export type DifferentialDiagnosis = {
  mostLikely: string[]
  mustNotMiss: string[] // Dangerous diagnoses
  lessLikely: string[]
}

export type ClinicalReasoning = {
  diagnosesMovedUp: Array<{ diagnosis: string; reason: string }>
  diagnosesMovedDown: Array<{ diagnosis: string; reason: string }>
  notes: string
}

export type FinalDiagnosis = {
  diagnosisId: string
  confidence: 'High' | 'Medium' | 'Low'
  nextSteps: string // If low confidence
}

export type PatientExplanation = {
  explanation: string // Simple words explanation
  keyPoints: string[] // What patient needs to understand
}

export type Disposition = {
  type: 'Discharge' | 'Observe' | 'Admit' | 'ICU'
  plan: string[]
  followUp: string
}

export type WorkflowState = {
  step: number
  safetyCheck: SafetyCheck | null
  chiefComplaint: string
  hpi: HPI | null
  medicalBackground: MedicalBackground | null
  problemRepresentation: ProblemRepresentation | null
  differentialDiagnosis: DifferentialDiagnosis | null
  clinicalReasoning: ClinicalReasoning | null
  finalDiagnosis: FinalDiagnosis | null
  patientExplanation: PatientExplanation | null
  disposition: Disposition | null
}


