import { NextResponse } from 'next/server'
import { getIssuer } from '../../_auth0'

// simple x-www-form-urlencoded encoder without URLSearchParams
function formEncode(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}

export async function POST(req) {
  console.log('[teacher/login] getIssuer():', getIssuer())

  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Username and password are required' },
        { status: 400 }
      )
    }
    // console.log("SCOPE REQUESTED :", process.env.auth0_scope);

    // Build payload variables explicitly
    const payload = {
      grant_type: 'password',
      username,
      password,
      // use env if set, else default to My Account API per your example
      audience: 'https://oktahub3.us.auth0.com/me/',
      scope:
        process.env.AUTH0_SCOPE ??
        'openid profile email offline_access read:me:authentication_methods create:me:authentication_methods read:me:factors',
      client_id: process.env.AUTH0_CLIENT_ID || '',
      client_secret: process.env.AUTH0_CLIENT_SECRET || '',
      force_mfa: 1
    }

    console.log("PAYLOAD: ", payload);
  

    const upstream = await fetch(`https://oktahub3.us.auth0.com/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: formEncode(payload),
    })

    const data = await upstream.json()
    console.log("DATA: ", data);
    if (!upstream.ok) {
      // pass upstream error to client
      return NextResponse.json(data, { status: upstream.status })
    }

    // set a simple HttpOnly cookie so protected pages can read session on SSR
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
        httpOnly: false, // id_token is often used client side, keep as non HttpOnly if you need it there
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: data.expires_in || 3600,
      })
    }
    console.log("RES: ", res);
    return res
  } catch (err) {
    console.error('login route error:', err)
    return NextResponse.json(
      { error: 'server_error', error_description: String(err?.message || err) },
      { status: 500 }
    )
  }
}
