import type { ClinicalSection } from '@/components/SectionNav'
import type { SimulatorStep } from './SimulatorProgressBar'

export type HelpBlock = {
  stepName: string
  whatToDo: string
  nextStep: string
}

export function getSimulatorHelpCopy(
  currentStep: SimulatorStep,
  options?: { activeSection?: ClinicalSection }
): HelpBlock {
  const sec = options?.activeSection

  if (currentStep === 1) {
    return {
      stepName: 'Step 1: Choose Scenario',
      whatToDo:
        'Browse the case library and pick one patient scenario. Each case is a fictional but realistic situation to practice on.',
      nextStep: 'Click a case card and press “Start Case” to open the simulator.',
    }
  }

  if (currentStep === 2) {
    if (sec === 'exam') {
      return {
        stepName: 'Step 2: Exam & workup (Physical exam)',
        whatToDo:
          'Review the exam sections relevant to this patient. Click through systems to read findings like you would in clinic.',
        nextStep: 'When you have reviewed enough, open the Tests tab and order at least one test.',
      }
    }
    if (sec === 'tests') {
      return {
        stepName: 'Step 2: Exam & workup (Tests)',
        whatToDo:
          'Order tests that help narrow the diagnosis. You need at least one test ordered before Diagnosis unlocks.',
        nextStep: 'After ordering tests, go to the Diagnosis tab to build your differential and pick a final diagnosis.',
      }
    }
    return {
      stepName: 'Step 2: Talk to the Patient',
      whatToDo:
        'Use Quick Questions or type your own in the chat. Your goal is to understand symptoms and key details before you move on.',
      nextStep:
        'Next, use the tabs to complete the physical exam and order tests. When those are done, open Diagnosis.',
    }
  }

  if (currentStep === 3) {
    return {
      stepName: 'Step 3: Make Your Diagnosis',
      whatToDo:
        'Search and add diagnoses to your differential, rank them, add short reasoning notes, and select one final diagnosis.',
      nextStep: 'Submit to generate your assessment and detailed results.',
    }
  }

  return {
    stepName: 'Step 4: Your Results',
    whatToDo:
      'Read your score, strengths, areas to improve, and teaching points. Use this feedback to guide your next attempt.',
    nextStep: 'Try the same case again to improve your score, or pick a new case from the library.',
  }
}
