import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
  if (!req.auth && pathname.startsWith('/dashboard')) {
    const login = new URL('/login', req.url)
    login.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(login)
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
