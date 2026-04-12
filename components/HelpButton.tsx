'use client'

import { CircleHelp } from 'lucide-react'

type Props = {
  onClick: () => void
  label?: string
}

export default function HelpButton({ onClick, label = 'Page tips' }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-press fixed bottom-5 right-5 z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-700 shadow-md ring-1 ring-primary-100 transition hover:bg-primary-50 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:bottom-6 sm:right-6"
      aria-label={label}
      title={label}
    >
      <CircleHelp className="h-6 w-6" strokeWidth={1.75} />
    </button>
  )
}
