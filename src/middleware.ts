import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Let API routes and the password page through unconditionally
  if (pathname.startsWith('/api/') || pathname.startsWith('/password')) {
    return NextResponse.next()
  }

  const auth = request.cookies.get('kairo-auth')
  if (!auth || auth.value !== 'granted') {
    const url = new URL('/password', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: [
    '/((?!_next/static|_next/image|favicon\.ico|.*\.png$|.*\.jpg$|.*\.jpeg$|.*\.svg$|.*\.ico$|manifest\.json$|sw\.js$).*)',
  ],
}
