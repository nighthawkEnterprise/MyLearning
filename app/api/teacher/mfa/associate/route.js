// app/api/teacher/mfa/associate/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../../api/_auth0'

export async function POST(req) {
  try {
    const { mfa_token, authenticator_types, oob_channels, phone_number } = await req.json()

    if (!mfa_token) {
      return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    }
    if (!Array.isArray(authenticator_types) || authenticator_types.length === 0) {
      return NextResponse.json({ error: 'authenticator_types must be a non-empty array' }, { status: 400 })
    }

    const wantsOob = authenticator_types.includes('oob')
    if (wantsOob) {
      if (!Array.isArray(oob_channels) || oob_channels.length === 0) {
        return NextResponse.json({ error: 'oob_channels must be a non-empty array when using oob' }, { status: 400 })
      }
      const chan = new Set(oob_channels)
      if ((chan.has('sms') || chan.has('voice')) && !phone_number) {
        return NextResponse.json({ error: 'phone_number required for sms or voice' }, { status: 400 })
      }
    }

    const payload = {
      authenticator_types,
      ...(wantsOob ? { oob_channels } : {}),
      ...(phone_number ? { phone_number } : {}),
    }

    const r = await fetch(`${getIssuer()}/mfa/associate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${mfa_token}`,
      },
      body: JSON.stringify(payload),
    })

    const body = await r.json()
    return NextResponse.json(body, { status: r.status })
  } catch (e) {
    console.error('associate route error:', e)
    return NextResponse.json({ error: 'associate failed' }, { status: 500 })
  }
}
