// app/api/teacher/mfa/challenge/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../../api/_auth0'

const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET

export async function POST(req) {
  try {
    const { challenge_type, authenticator_id, mfa_token } = await req.json()

    if (!challenge_type || !authenticator_id || !mfa_token) {
      return NextResponse.json({ error: 'challenge_type, authenticator_id, and mfa_token are required' }, { status: 400 })
    }
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({ error: 'server missing AUTH0_CLIENT_ID or AUTH0_CLIENT_SECRET' }, { status: 500 })
    }

    const payload = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      challenge_type,
      authenticator_id,
      mfa_token,
    }

    const r = await fetch(`${getIssuer()}/mfa/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const body = await r.json()
    return NextResponse.json(body, { status: r.status })
  } catch (e) {
    console.error('challenge route error:', e)
    return NextResponse.json({ error: 'challenge failed' }, { status: 500 })
  }
}
