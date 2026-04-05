import { Suspense } from 'react'
import Link from 'next/link'
import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sign in</h1>
          <p className="text-slate-600 mt-2">Saved vocab, scores, and dashboard sync to your account.</p>
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
