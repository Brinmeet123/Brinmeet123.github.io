'use client'

export type SimulatorStep = 1 | 2 | 3 | 4

const STEPS: { step: SimulatorStep; label: string }[] = [
  { step: 1, label: 'Choose Scenario' },
  { step: 2, label: 'Chat' },
  { step: 3, label: 'Diagnosis' },
  { step: 4, label: 'Results' },
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
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2 text-xs sm:text-sm">
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
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition-colors',
                    isCurrent
                      ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-200'
                      : isPast
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-50 text-slate-400',
                  ].join(' ')}
                >
                  <span className="tabular-nums text-[0.7rem] opacity-80">Step {step}</span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
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
