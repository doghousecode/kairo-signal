import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const correct = process.env.SITE_PASSWORD

  if (!correct) {
    return NextResponse.json({ error: 'Password not configured.' }, { status: 500 })
  }

  if (password !== correct) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('kairo-auth', 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    // Shared across all *.meetkairo.ai subdomains
    domain: process.env.NODE_ENV === 'production' ? '.meetkairo.ai' : undefined,
    // 30-day session (2592000s)
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return response
}
