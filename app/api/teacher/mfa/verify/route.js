// app/api/teacher/mfa/verify/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

export async function POST(req) {
  try {
    const { mfa_token, oob_code, binding_code } = await req.json()
    if (!mfa_token) return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    if (!oob_code) return NextResponse.json({ error: 'oob_code required' }, { status: 400 })
    if (!binding_code) return NextResponse.json({ error: 'binding_code required' }, { status: 400 })

    const params = {
      grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
      mfa_token,
      oob_code,
      binding_code,
      client_id: process.env.AUTH0_CLIENT_ID || '',
      client_secret: process.env.AUTH0_CLIENT_SECRET || '',
      // audience: process.env.AUTH0_AUDIENCE || 'https://oktahub3.us.auth0.com/me/',
      scope: process.env.AUTH0_SCOPE || 'openid profile email',
    }
    console.log("PARAMS:", params);
    const r = await fetch(`https://oktahub3.us.auth0.com/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&'),
    })

    const data = await r.json()
    if (!r.ok) return NextResponse.json(data, { status: r.status })

    // set cookie like login route so redirect works
    const res = NextResponse.json({ ok: true })
    if (data?.access_token) {
      res.cookies.set('access_token', data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: data.expires_in || 3600,
      })
    }
    if (data?.id_token) {
      res.cookies.set('id_token', data.id_token, {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: data.expires_in || 3600,
      })
    }
    return res
  } catch (e) {
    console.error('verify-oob route error:', e)
    return NextResponse.json({ error: 'verify failed' }, { status: 500 })
  }
}
