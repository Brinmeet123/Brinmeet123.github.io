'use client'

import { useState } from 'react'
import type { SimulatorStep } from './SimulatorProgressBar'
import type { ClinicalSection } from '@/components/SectionNav'
import { getScenarioLibraryHelpCopy, getSimulatorHelpCopy } from './simulatorHelpCopy'

type Props =
  | { libraryPage: true; currentStep?: never; activeSection?: never }
  | { libraryPage?: false; currentStep: SimulatorStep; activeSection?: ClinicalSection }

export default function SimulatorHelpButton(props: Props) {
  const [open, setOpen] = useState(false)
  const { stepName, whatToDo, nextStep } =
    props.libraryPage === true
      ? getScenarioLibraryHelpCopy()
      : getSimulatorHelpCopy(props.currentStep, { activeSection: props.activeSection })

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-lg shadow-slate-900/10 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="simulator-help-panel"
      >
        Help
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close help"
            onClick={() => setOpen(false)}
          />
          <div
            id="simulator-help-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="simulator-help-title"
            className="relative z-10 m-4 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h2 id="simulator-help-title" className="text-lg font-bold text-slate-900">
              Help
            </h2>
            <p className="mt-1 text-sm text-slate-600">{stepName}</p>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Now</p>
                <p className="mt-1 leading-relaxed">{whatToDo}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">After</p>
                <p className="mt-1 leading-relaxed">{nextStep}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
