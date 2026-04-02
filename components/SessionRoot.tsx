import { auth } from '@/lib/auth'
import Providers from '@/components/Providers'
import SafeLayoutContent from '@/components/SafeLayoutContent'

export default async function SessionRoot({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <Providers session={session}>
      <SafeLayoutContent>{children}</SafeLayoutContent>
    </Providers>
  )
}
