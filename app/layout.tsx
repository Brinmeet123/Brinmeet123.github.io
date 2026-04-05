import type { Metadata } from 'next'
import { Suspense } from 'react'
import './styles/globals.css'
import SessionRoot from '@/components/SessionRoot'
import RootLoadingFallback from '@/components/RootLoadingFallback'

export const metadata: Metadata = {
  title: 'Virtual Diagnostic Simulator',
  description: 'Fictional clinical cases: history, exam, tests, diagnosis, and debrief — for training only.',
}

/**
 * Root layout stays synchronous so the dev server can always resolve error/overlay chunks
 * (async root layouts + HMR sometimes trigger "missing required error components, refreshing...").
 * Session + providers live in {@link SessionRoot}.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Suspense fallback={<RootLoadingFallback />}>
          <SessionRoot>{children}</SessionRoot>
        </Suspense>
      </body>
    </html>
  )
}

