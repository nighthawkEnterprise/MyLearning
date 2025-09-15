// app/api/myapi/route.js
import { NextResponse } from 'next/server'

const USER_DOMAIN = process.env.AUTH0_DOMAIN || 'oktahub3.us.auth0.com'
// Example endpoint from My Account API docs
const UPSTREAM = `https://${USER_DOMAIN}/me/v1/authentication-methods`

export async function GET(request) {
  console.log("Upstream: ", upstream);
  try {
    const auth = request.headers.get('authorization') || ''
    if (!auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })
    }

    const r = await fetch(UPSTREAM, {
      method: 'GET',
      headers: { Authorization: auth },
      cache: 'no-store',
    })

    const ct = r.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      return NextResponse.json(await r.json(), { status: r.status })
    }
    return new NextResponse(await r.text(), {
      status: r.status,
      headers: { 'content-type': ct || 'text/plain' },
    })
  } catch (err) {
    console.error('Proxy error:', err)
    return NextResponse.json({ error: 'Upstream request failed' }, { status: 502 })
  }
}
