// app/api/teacher/mfa/challenge/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

const issuer = () => getIssuer().replace(/\/+$/, '')

export async function POST(req) {
  try {
    const { mfa_token, authenticator_id, challenge_type = 'oob' } = await req.json()
    if (!mfa_token) return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })

    // If authenticator_id not supplied, find an ACTIVE OOB (sms OR auth0 push)
    let chosen = authenticator_id
    if (!chosen) {
      const lr = await fetch(`${issuer()}/mfa/authenticators`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${mfa_token}` },
        cache: 'no-store',
      })
      if (!lr.ok) return NextResponse.json(await lr.json().catch(() => ({})), { status: lr.status })

      const list = await lr.json()
      const oob = (list || []).find(a =>
        (a?.authenticator_type ?? a?.type) === 'oob' &&
        (a?.oob_channel ?? a?.channel) &&  // 'sms' or 'auth0'
        a?.active === true
      )
      if (!oob?.id) return NextResponse.json({ error: 'no active oob authenticator' }, { status: 404 })
      chosen = oob.id
    }

    // Auth0 accepts either client creds in the body OR the mfa_token as bearer.
    // We mirror their cURL by including challenge_type + authenticator_id,
    // and rely on the Bearer mfa_token.
    const cr = await fetch(`${issuer()}/mfa/challenge`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${mfa_token}`,
      },
      body: JSON.stringify({
        challenge_type,          // 'oob'
        authenticator_id: chosen // sms|... or push|...
        // If your tenant requires client creds, add:
        // client_id: process.env.AUTH0_CLIENT_ID,
        // client_secret: process.env.AUTH0_CLIENT_SECRET,
      }),
    })

    const body = await cr.json().catch(() => ({}))
    if (chosen && !body.authenticator_id) body.authenticator_id = chosen
    return NextResponse.json(body, { status: cr.status })
  } catch (e) {
    console.error('mfa/challenge error:', e)
    return NextResponse.json({ error: 'challenge failed' }, { status: 500 })
  }
}
