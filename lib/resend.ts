import { Resend } from 'resend'

/**
 * Read the key at call time (not module load). Next.js can inline `process.env` at build;
 * lazy access avoids a stale empty value when the key exists only at runtime (e.g. Vercel).
 */
function getApiKey(): string | undefined {
  return process.env.RESEND_API_KEY?.trim() || undefined
}

let resendSingleton: Resend | null = null

export function getResend(): Resend | null {
  const key = getApiKey()
  if (!key) return null
  if (!resendSingleton) {
    resendSingleton = new Resend(key)
  }
  return resendSingleton
}

export function getResendFromAddress(): string {
  return (process.env.RESEND_FROM ?? 'VDS <onboarding@resend.dev>').trim()
}

/** Log once per process if production still uses Resend’s test sender (often not delivered to real inboxes). */
let warnedDefaultFrom = false
export function warnIfDefaultFromInProduction(): void {
  if (process.env.NODE_ENV !== 'production' || warnedDefaultFrom) return
  const from = getResendFromAddress().toLowerCase()
  if (from.includes('onboarding@resend.dev')) {
    warnedDefaultFrom = true
    console.warn(
      '[resend] FROM is onboarding@resend.dev. Verify a domain at https://resend.com/domains and set RESEND_FROM to e.g. noreply@yourdomain.com so mail reaches real addresses.'
    )
  }
}
