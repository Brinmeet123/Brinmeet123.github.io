'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary-600 hover:text-primary-700">
            Virtual Diagnostic Simulator
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Home
            </Link>
            <Link
              href="/scenarios"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Scenarios
            </Link>
            <Link
              href="/vocab"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Vocab
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              About
            </Link>

            {status === 'loading' ? (
              <span className="text-sm text-gray-400 px-2">…</span>
            ) : session?.user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-teal-800 hover:text-teal-900 max-w-[140px] truncate"
                  title={session.user.email ?? ''}
                >
                  {session.user.name ?? session.user.username ?? 'Profile'}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-teal-700 hover:text-teal-800 px-3 py-2 rounded-md border border-teal-200 bg-teal-50/80"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
