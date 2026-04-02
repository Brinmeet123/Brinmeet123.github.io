import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

/**
 * Auth.js requires a secret to sign sessions. Without it, /api/auth/session returns 500 and
 * SessionProvider can break the whole client UI. In development only, use a fixed fallback so
 * `npm run dev` works before .env.local is filled in. Production must set AUTH_SECRET.
 */
function authSecret(): string | undefined {
  const fromEnv = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'development') {
    return 'local-dev-auth-secret-min-32-chars-do-not-use-in-prod'
  }
  return undefined
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret(),
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password
        if (typeof email !== 'string' || typeof password !== 'string') return null

        const [{ prisma }, bcrypt] = await Promise.all([import('@/lib/prisma'), import('bcryptjs')])

        const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
        if (!user) return null

        const ok = await bcrypt.default.compare(password, user.password)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          username: user.username,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username ?? undefined
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = (token.username as string) ?? ''
      }
      return session
    },
  },
})
