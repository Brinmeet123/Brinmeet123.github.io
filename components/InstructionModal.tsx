'use client'

type Props = {
  open: boolean
  title: string
  description: string[]
  dontShowAgain: boolean
  onDontShowAgainChange: (value: boolean) => void
  onGotIt: (neverShowAgain: boolean) => void
  onBackdropClose?: () => void
}

export default function InstructionModal({
  open,
  title,
  description,
  dontShowAgain,
  onDontShowAgainChange,
  onGotIt,
  onBackdropClose,
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instruction-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
        aria-label="Close"
        onClick={() => onBackdropClose?.()}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl ring-1 ring-slate-200/60">
        <h2
          id="instruction-modal-title"
          className="text-lg font-bold text-slate-900 sm:text-xl"
        >
          {title}
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700 sm:text-[0.9375rem]">
          {description.map((line, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-500" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            checked={dontShowAgain}
            onChange={(e) => onDontShowAgainChange(e.target.checked)}
          />
          <span>Don&apos;t show this again</span>
        </label>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="btn-press rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            onClick={() => onGotIt(dontShowAgain)}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
