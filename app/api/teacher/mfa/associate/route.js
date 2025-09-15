// app/api/teacher/mfa/associate/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

export async function POST(req) {
  try {
    const { mfa_token, type = 'oob', oob_channel = 'sms', phone_number } = await req.json()
    if (!mfa_token) return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    if (type === 'oob' && oob_channel === 'sms' && !phone_number) {
      return NextResponse.json({ error: 'phone_number required for sms' }, { status: 400 })
    }

    const r = await fetch(`${getIssuer()}/mfa/associate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${mfa_token}`,
      },
      body: JSON.stringify({ type, oob_channel, phone_number }),
    })

    const body = await r.json()
    return NextResponse.json(body, { status: r.status })
  } catch (e) {
    console.error('associate route error:', e)
    return NextResponse.json({ error: 'associate failed' }, { status: 500 })
  }
}

