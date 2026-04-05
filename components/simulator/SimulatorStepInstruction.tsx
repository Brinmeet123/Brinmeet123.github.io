import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: ReactNode
  bullets?: string[]
  goal?: string
  footerHint?: string
  className?: string
}

export default function SimulatorStepInstruction({
  title,
  description,
  bullets,
  goal,
  footerHint,
  className = '',
}: Props) {
  return (
    <div
      className={`mb-4 rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 ${className}`}
    >
      <div className="rounded-md border border-slate-100 bg-white/90 p-3 text-sm leading-snug text-slate-700">
        <p className="font-semibold text-slate-800">{title}</p>
        {description != null && <div className="mt-1.5 text-slate-600">{description}</div>}
        {bullets && bullets.length > 0 && (
          <ul className="mt-2 list-inside list-disc space-y-0.5 text-slate-600 text-[0.8125rem]">
            {bullets.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
        {goal ? (
          <>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">Focus</p>
            <p className="mt-0.5 text-slate-600">{goal}</p>
          </>
        ) : null}
        {footerHint ? (
          <p className="mt-2 text-xs text-slate-500">{footerHint}</p>
        ) : null}
      </div>
    </div>
  )
}
