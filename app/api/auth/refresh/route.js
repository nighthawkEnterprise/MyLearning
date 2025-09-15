import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIssuer } from '../../_auth0'

function formEncode(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}

export async function POST() {
  const jar = cookies()
  const refresh = jar.get('refresh_token')?.value
  if (!refresh) return NextResponse.json({ error: 'no_refresh_token' }, { status: 401 })

  const payload = {
    grant_type: 'refresh_token',
    refresh_token: refresh,
    client_id: process.env.AUTH0_CLIENT_ID || '',
    client_secret: process.env.AUTH0_CLIENT_SECRET || '',
  }

  const r = await fetch(`${getIssuer()}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: formEncode(payload),
    cache: 'no-store',
  })

  const data = await r.json()
  if (!r.ok) return NextResponse.json(data, { status: r.status })

  const res = NextResponse.json({ ok: true })
  if (data?.access_token) {
    res.cookies.set('access_token', data.access_token, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/',
      maxAge: data.expires_in || 3600,
    })
  }
  // rotate refresh token if one is issued
  if (data?.refresh_token) {
    res.cookies.set('refresh_token', data.refresh_token, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/',
    })
  }
  if (data?.id_token) {
    res.cookies.set('id_token', data.id_token, {
      httpOnly: false, secure: true, sameSite: 'lax', path: '/',
      maxAge: data.expires_in || 3600,
    })
  }
  return res
}
