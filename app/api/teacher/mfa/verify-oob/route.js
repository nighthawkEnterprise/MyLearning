// app/api/teacher/mfa/verify-oob/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../../api/_auth0'

const CLIENT_ID = process.env.AUTH0_CLIENT_ID || 'v6sqxWNHGwqBdvLDWdjn8cHFeNDM31H0'
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET // set in env

export async function POST(req) {
  try {
    const { mfa_token, oob_code, binding_code } = await req.json()

    if (!mfa_token || !oob_code || !binding_code) {
      return NextResponse.json({ error: 'mfa_token, oob_code, and binding_code are required' }, { status: 400 })
    }
    if (!CLIENT_SECRET) {
      return NextResponse.json({ error: 'server misconfigured: missing AUTH0_CLIENT_SECRET' }, { status: 500 })
    }

    const form = new URLSearchParams()
    form.set('grant_type', 'http://auth0.com/oauth/grant-type/mfa-oob')
    form.set('client_id', CLIENT_ID)
    form.set('client_secret', CLIENT_SECRET)
    form.set('mfa_token', mfa_token)
    form.set('oob_code', oob_code)
    form.set('binding_code', binding_code)

    const r = await fetch(`${getIssuer()}/oauth/token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mfa_token}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    })

    const body = await r.json()
    return NextResponse.json(body, { status: r.status })
  } catch (e) {
    console.error('verify-oob route error:', e)
    return NextResponse.json({ error: 'verify failed' }, { status: 500 })
  }
}
