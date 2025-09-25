// app/api/teacher/mfa/verify/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

// tiny form encoder
function formEncode(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}

export async function POST(req) {
  try {
    const { mfa_token, oob_code, binding_code } = await req.json()

    if (!mfa_token) return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    if (!oob_code)   return NextResponse.json({ error: 'oob_code required' }, { status: 400 })
    // NOTE: binding_code is OPTIONAL (present for SMS, omitted for push)

    // Single grant for both SMS and push:
    // - SMS: include binding_code
    // - Push: omit binding_code and poll until Auth0 returns tokens
    const params = {
      grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
      mfa_token,
      oob_code,
      ...(binding_code ? { binding_code } : {}),
      client_id:     process.env.AUTH0_CLIENT_ID || '',
      client_secret: process.env.AUTH0_CLIENT_SECRET || '',
      scope:         process.env.AUTH0_SCOPE || 'openid profile email',
    }

const issuer = 'https://oktahub3.us.auth0.com';
    const r = await fetch(`${issuer}/oauth/token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        // Optional but mirrors Auth0 example for push:
        // lets Auth0 accept mfa_token via header as well
        Authorization: `Bearer ${mfa_token}`,
      },
      body: formEncode(params),
    })

    const data = await r.json()

    // For push, while the user hasn't approved yet Auth0 may return 400/401 with
    // errors like authorization_pending / invalid_grant. We pass that through
    // so the client can keep polling.
    if (!r.ok) return NextResponse.json(data, { status: r.status })

    // Success: set cookies like your login route
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
    console.error('verify route error:', e)
    return NextResponse.json({ error: 'verify failed' }, { status: 500 })
  }
}
