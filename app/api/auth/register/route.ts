import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library'
import { prisma } from '@/lib/prisma'
import { getResend, getResendFromAddress, warnIfDefaultFromInProduction } from '@/lib/resend'

function registerErrorResponse(e: unknown): { error: string; status: number } {
  console.error('register error:', e)

  if (e instanceof PrismaClientInitializationError) {
    return {
      error:
        'Database is not reachable. Set DATABASE_URL to a PostgreSQL connection string (Vercel: Project → Settings → Environment Variables). Use Neon or Vercel Postgres, then redeploy.',
      status: 503,
    }
  }

  if (e instanceof PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      return { error: 'An account with this email or username already exists.', status: 409 }
    }
    return {
      error:
        process.env.NODE_ENV === 'development'
          ? `Database error (${e.code}): ${e.message}`
          : 'Could not save your account. Try again later.',
      status: 503,
    }
  }

  if (e instanceof Error) {
    const m = e.message
    if (m.includes('DATABASE_URL') || m.includes('Environment variable not found')) {
      return {
        error:
          'DATABASE_URL is missing. Add a PostgreSQL URL in .env.local (local) or Vercel env vars (production).',
        status: 503,
      }
    }
    if (process.env.NODE_ENV === 'development') {
      return { error: `Registration failed: ${m}`, status: 500 }
    }
  }

  return { error: 'Registration failed.', status: 500 }
}

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores'),
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors
      const first =
        Object.values(msg)
          .flat()
          .find(Boolean) ?? 'Invalid input'
      return NextResponse.json({ error: first }, { status: 400 })
    }

    const { name, username, email, password } = parsed.data
    const emailNorm = email.toLowerCase()
    const usernameNorm = username.toLowerCase()

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailNorm }, { username: usernameNorm }],
      },
      select: { email: true, username: true },
    })

    if (existing) {
      if (existing.email === emailNorm) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: 'This username is already taken.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        username: usernameNorm,
        email: emailNorm,
        password: hashed,
        subscribed: true,
      },
    })

    const resend = getResend()
    if (resend) {
      warnIfDefaultFromInProduction()
      try {
        const welcomeText = welcomePlainText(user.name ?? user.username)
        const result = await resend.emails.send({
          from: getResendFromAddress(),
          to: user.email,
          subject: 'Welcome to Virtual Diagnostic Simulator',
          html: welcomeHtml(user.name ?? user.username),
          text: welcomeText,
        })
        // Resend returns { data, error }; failures are usually not thrown (see resend-node issues).
        if (result.error) {
          const err = result.error
          console.error('[resend] welcome email rejected:', {
            name: err.name,
            message: err.message,
            statusCode: err.statusCode,
          })
        } else if (result.data?.id) {
          console.info('[resend] welcome email accepted, id:', result.data.id)
        }
      } catch (e) {
        console.error('[resend] welcome email threw:', e)
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.warn('[resend] RESEND_API_KEY is missing or empty; welcome email was not sent.')
    }

    return NextResponse.json(
      {
        ok: true,
        user: { id: user.id, email: user.email, username: user.username, name: user.name },
      },
      { status: 201 }
    )
  } catch (e) {
    const { error, status } = registerErrorResponse(e)
    return NextResponse.json({ error }, { status })
  }
}

function welcomeHtml(displayName: string): string {
  return `
<!DOCTYPE html>
<html>
  <body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1e293b;">
    <h1 style="color: #0f766e;">Welcome${displayName ? `, ${escapeHtml(displayName)}` : ''}!</h1>
    <p>Thank you for joining the <strong>Virtual Diagnostic Simulator</strong>.</p>
    <p>Your saved terms and scenario scores live on your dashboard.</p>
    <p>We will also share occasional updates about new cases and—down the road—shadowing and observation opportunities.</p>
    <p style="margin-top: 24px; font-size: 14px; color: #64748b;">— The VDS team</p>
  </body>
</html>`
}

function welcomePlainText(displayName: string): string {
  const greeting = displayName ? `Welcome, ${displayName}!` : 'Welcome!'
  return `${greeting}

Thank you for joining the Virtual Diagnostic Simulator.

Your saved terms and scenario scores live on your dashboard.

We will also share occasional updates about new cases and—down the road—shadowing and observation opportunities.

— The VDS team`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
