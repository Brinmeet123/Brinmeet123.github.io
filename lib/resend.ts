import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null

export function getResendFromAddress(): string {
  return process.env.RESEND_FROM ?? 'VDS <onboarding@resend.dev>'
}
