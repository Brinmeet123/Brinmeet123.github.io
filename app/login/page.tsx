import { Suspense } from 'react'
import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
import NextStepGuidance from '@/components/ux/NextStepGuidance'

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-600 mt-2">Sign in to save progress, scores, and vocabulary across devices.</p>
          <p className="text-sm text-slate-500 mt-2">After you sign in, you&apos;ll land where you can pick up cases or open your dashboard.</p>
        </div>

        <div className="mb-8">
          <NextStepGuidance compact>
            Ask a few more questions — then head to the exam when you feel ready.
          </NextStepGuidance>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10">
          <Suspense fallback={<div className="text-center text-slate-500">Loading…</div>}>
            <AuthForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          <Link href="/" className="text-teal-700 hover:text-teal-800 font-medium">
            Home
          </Link>
        </p>
      </div>
    </div>
  )
}
