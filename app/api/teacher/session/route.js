// app/api/teacher/session/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req) {
  // The client (your embedded Teacher login flow) POSTs tokens here.
  const { access_token, refresh_token, expires_in } = await req.json()

  if (!access_token || !refresh_token) {
    return NextResponse.json(
      { ok: false, error: 'Missing access_token or refresh_token' },
      { status: 400 }
    )
  }

  // Auto-detect HTTPS for prod/platforms that set x-forwarded-proto
  const isHttps = req.headers.get('x-forwarded-proto') === 'https'
  const isProd = process.env.NODE_ENV === 'production'
  const secure = isHttps || isProd // false on localhost (http), true on prod

  const baseOpts = {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
  }

  cookies().set('access_token', access_token, {
    ...baseOpts,
    maxAge: Number(expires_in) || 60 * 60, // 1 hour default
  })

  cookies().set('refresh_token', refresh_token, {
    ...baseOpts,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return NextResponse.json({ ok: true })
}
