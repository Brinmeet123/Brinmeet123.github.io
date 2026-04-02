'use client'

import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** From `auth()` in the root layout so the first paint does not depend on `/api/auth/session`. */
  session: Session | null
}

export default function Providers({ children, session }: Props) {
  return (
    <SessionProvider
      session={session ?? undefined}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}
