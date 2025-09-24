// app/api/teacher/mfa/challenge/route.js
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET

export async function POST(req) {
  try {
    const { mfa_token, authenticator_id } = await req.json()
    if (!mfa_token) {
      return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    }
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({ error: 'server is missing AUTH0_CLIENT_ID/SECRET' }, { status: 500 })
    }

    // If authenticator_id not provided, discover an active SMS authenticator
    let chosenId = authenticator_id
    if (!chosenId) {
      const listRes = await fetch(`${getIssuer()}/mfa/authenticators`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${mfa_token}` }, // discovery requires the mfa_token
        cache: 'no-store',
      })

      if (!listRes.ok) {
        // Pass through Auth0 error to aid debugging
        const errText = await listRes.text()
        return new NextResponse(errText, {
          status: listRes.status,
          headers: { 'content-type': listRes.headers.get('content-type') || 'application/json' },
        })
      }

      const authenticators = await listRes.json()
      const sms = (authenticators || []).find(a =>
        (a?.authenticator_type ?? a?.type) === 'oob' &&
        (a?.oob_channel ?? a?.channel) === 'sms' &&
        a?.active === true
      )
      if (!sms?.id) {
        return NextResponse.json({ error: 'no sms authenticator found' }, { status: 404 })
      }
      chosenId = sms.id
    }

    // === Reflect the curl example: client credentials in BODY, plus challenge_type ===
    const payload = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      challenge_type: 'oob',
      authenticator_id: chosenId,
      mfa_token,
      audience: process.env.AUTH0_AUDIENCE || 'https://oktahub3.us.auth0.com/me/',

    }

    const chRes = await fetch(`${getIssuer()}/mfa/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const contentType = chRes.headers.get('content-type') || ''
    const chBody = contentType.includes('application/json') ? await chRes.json() : await chRes.text()

    // If Auth0 returns an error, bubble it up (you were seeing 401 Unauthorized)
    if (!chRes.ok) {
      return new NextResponse(
        typeof chBody === 'string' ? chBody : JSON.stringify(chBody),
        {
          status: chRes.status,
          headers: { 'content-type': contentType || 'application/json' },
        }
      )
    }

    // normalize: ensure authenticator_id present in response
    if (chosenId && chBody && typeof chBody === 'object' && !chBody.authenticator_id) {
      chBody.authenticator_id = chosenId
    }

    return NextResponse.json(chBody, { status: 200 })
  } catch (e) {
    console.error('mfa/challenge route error:', e)
    return NextResponse.json({ error: 'challenge failed' }, { status: 500 })
  }
}
