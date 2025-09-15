// app/api/teacher/mfa/authenticators/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

export async function POST(req) {
  try {
    const { mfa_token } = await req.json()
    if (!mfa_token) return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })

    const r = await fetch(`${getIssuer()}/mfa/authenticators`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${mfa_token}`,
      },
      cache: 'no-store',
    })

    const text = await r.text()
    return new NextResponse(text, {
      status: r.status,
      headers: { 'content-type': r.headers.get('content-type') || 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'failed to list authenticators' }, { status: 500 })
  }
}
