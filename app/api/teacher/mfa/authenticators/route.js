// app/api/teacher/mfa/authenticators/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../../api/_auth0'

export async function GET(req) {
  try {
    const authz = req.headers.get('authorization')
    if (!authz) {
      return NextResponse.json({ error: 'authorization header with Bearer MFA_TOKEN required' }, { status: 400 })
    }

    const r = await fetch(`${getIssuer()}/mfa/authenticators`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: authz,
      },
    })

    const body = await r.json()
    return NextResponse.json(body, { status: r.status })
  } catch (e) {
    console.error('authenticators route error:', e)
    return NextResponse.json({ error: 'fetch authenticators failed' }, { status: 500 })
  }
}
