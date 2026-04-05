import type { ClinicalSection } from '@/components/SectionNav'
import type { SimulatorStep } from './SimulatorProgressBar'

export type HelpBlock = {
  stepName: string
  whatToDo: string
  nextStep: string
}

/** Help when browsing /scenarios (not part of the in-case progress bar). */
export function getScenarioLibraryHelpCopy(): HelpBlock {
  return {
    stepName: 'Scenario library',
    whatToDo:
      'Browse the list and pick a patient case. Each scenario is a fictional but realistic situation to practice clinical reasoning.',
    nextStep: 'Click a card and use “Start Case” to open the simulator.',
  }
}

export function getSimulatorHelpCopy(
  currentStep: SimulatorStep,
  options?: { activeSection?: ClinicalSection }
): HelpBlock {
  const sec = options?.activeSection

  if (currentStep === 5 || sec === 'debrief') {
    return {
      stepName: 'Step 5: Your Results',
      whatToDo:
        'Read your score, strengths, areas to improve, and teaching points. Use this feedback to guide your next attempt.',
      nextStep: 'Try the same case again to improve your score, or pick a new case from the library.',
    }
  }

  if (currentStep === 4 || sec === 'diagnosis') {
    return {
      stepName: 'Step 4: Diagnosis',
      whatToDo:
        'Search and add diagnoses to your differential, rank them, add short reasoning notes, and select one final diagnosis.',
      nextStep: 'Submit to generate your assessment and detailed results.',
    }
  }

  if (currentStep === 3 || sec === 'tests') {
    return {
      stepName: 'Step 3: Order tests',
      whatToDo:
        'Order tests that help narrow the diagnosis. You need at least one test ordered before you can move to Diagnosis.',
      nextStep: 'Use the button below this section to continue when you are ready.',
    }
  }

  if (currentStep === 2 || sec === 'exam') {
    return {
      stepName: 'Step 2: View exams',
      whatToDo:
        'Review the exam sections relevant to this patient. Click through systems to read findings like you would in clinic.',
      nextStep: 'Use the button below this section to continue to ordering tests.',
    }
  }

  return {
    stepName: 'Step 1: Chat',
    whatToDo:
      'Use Quick Questions or type your own in the chat. Your goal is to understand symptoms and key details before the exam.',
    nextStep: 'When you are ready, use the button below the chat to continue to the physical exam.',
  }
}
