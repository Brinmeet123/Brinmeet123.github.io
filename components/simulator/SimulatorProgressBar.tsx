'use client'

/** In-case flow: Chat → Exam → Tests → Diagnosis → Results */
export type SimulatorStep = 1 | 2 | 3 | 4 | 5

const STEPS: { step: SimulatorStep; label: string }[] = [
  { step: 1, label: 'Chat' },
  { step: 2, label: 'View exams' },
  { step: 3, label: 'Order tests' },
  { step: 4, label: 'Diagnosis' },
  { step: 5, label: 'Results' },
]

type Props = {
  currentStep: SimulatorStep
  className?: string
}

export default function SimulatorProgressBar({ currentStep, className = '' }: Props) {
  return (
    <div
      className={`w-full rounded-xl border border-slate-200/90 bg-white shadow-sm px-3 py-3 sm:px-4 ${className}`}
      role="navigation"
      aria-label="Simulator progress"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your progress</p>
        <ol className="flex max-w-full flex-wrap items-center gap-x-1 gap-y-2 overflow-x-auto pb-0.5 text-xs sm:text-sm">
          {STEPS.map(({ step, label }, idx) => {
            const isCurrent = step === currentStep
            const isPast = step < currentStep
            return (
              <li key={step} className="flex items-center gap-1">
                {idx > 0 && (
                  <span className="mx-0.5 text-slate-300 select-none" aria-hidden>
                    →
                  </span>
                )}
                <span
                  className={[
                    'inline-flex shrink-0 flex-col gap-0.5 rounded-full px-2 py-1 font-medium transition-colors sm:flex-row sm:items-center sm:gap-1',
                    isCurrent
                      ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-200'
                      : isPast
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-50 text-slate-400',
                  ].join(' ')}
                >
                  <span className="tabular-nums text-[0.7rem] opacity-80">Step {step}</span>
                  <span className="leading-tight">{label}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>
      <p className="mt-2 text-[11px] text-slate-500 sm:hidden">
        Step {currentStep}: {STEPS.find((s) => s.step === currentStep)?.label}
      </p>
    </div>
  )
}
