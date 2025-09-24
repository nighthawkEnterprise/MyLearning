// app/api/teacher/mfa/associate/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

const issuerBase = () => getIssuer().replace(/\/+$/, '')

export async function POST(req) {
  try {
    const {
      mfa_token,
      type = 'oob',
      oob_channel = 'sms',
      phone_number,
    } = await req.json()

    if (!mfa_token) {
      return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    }

    if (type !== 'oob') {
      return NextResponse.json({ error: 'unsupported type' }, { status: 400 })
    }

    if (oob_channel === 'sms' && !phone_number) {
      return NextResponse.json({ error: 'phone_number required for sms' }, { status: 400 })
    }

    const payload = {
      authenticator_types: ['oob'],
      ...(oob_channel ? { oob_channels: [oob_channel] } : {}),
      ...(oob_channel === 'sms' && phone_number ? { phone_number } : {}),
    }

    const r = await fetch(`${issuerBase()}/mfa/associate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${mfa_token}`,
      },
      body: JSON.stringify(payload),
    })

    // Try to parse JSON, but tolerate plain text responses
    const raw = await r.text()
    let body
    try {
      body = raw ? JSON.parse(raw) : {}
    } catch {
      body = { message: raw }
    }

    return NextResponse.json(body, { status: r.status })
  } catch (e) {
    console.error('associate route error:', e)
    return NextResponse.json({ error: 'associate failed' }, { status: 500 })
  }
}
