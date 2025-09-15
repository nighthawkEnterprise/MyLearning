// app/api/proxy/myaccount/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIssuer } from '../../_auth0' // adjust if your helper lives elsewhere

export async function GET() {
  console.log("IN GET: ");
  try {
    // ↓ Dynamic API is async now
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    console.log("COOKIE STORE: ", cookieStore);
    console.log("access TOken: ", accessToken);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'unauthorized', error_description: 'No access token cookie' },
        { status: 401 }
      )
    }

    const upstream = await fetch(`${getIssuer()}/me/v1/factors`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    const ct = upstream.headers.get('content-type') || ''
    const body = await upstream.text()

    return new NextResponse(body, {
      status: upstream.status,
      headers: { 'content-type': ct || 'text/plain' },
    })
  } catch (err) {
    console.error('Proxy error:', err)
    return NextResponse.json(
      { error: 'bad_gateway', error_description: 'Upstream request failed' },
      { status: 502 }
    )
  }
}
