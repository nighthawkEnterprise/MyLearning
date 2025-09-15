// app/api/teacher/mfa/challenge/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

export async function POST(req) {
  try {
    const { mfa_token, authenticator_id } = await req.json()
    if (!mfa_token) return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })

    // discover an SMS authenticator if not provided
    let chosenId = authenticator_id
    if (!chosenId) {
      const listRes = await fetch(`${getIssuer()}/mfa/authenticators`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${mfa_token}` },
        cache: 'no-store',
      })
      if (!listRes.ok) {
        const errB = await listRes.text()
        return new NextResponse(errB, {
          status: listRes.status,
          headers: { 'content-type': listRes.headers.get('content-type') || 'application/json' },
        })
      }
      const authenticators = await listRes.json()
      const sms = (authenticators || []).find(a => a?.type === 'oob' && a?.oob_channel === 'sms')
      if (!sms?.id) return NextResponse.json({ error: 'no sms authenticator found' }, { status: 404 })
      chosenId = sms.id
    }

    const chRes = await fetch(`${getIssuer()}/mfa/challenge`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${mfa_token}`,
      },
      body: JSON.stringify({ authenticator_id: chosenId }),
    })

    const chBody = await chRes.json()
    if (chosenId && !chBody.authenticator_id) chBody.authenticator_id = chosenId
    return NextResponse.json(chBody, { status: chRes.status })
  } catch (e) {
    console.error('challenge-phone route error:', e)
    return NextResponse.json({ error: 'challenge failed' }, { status: 500 })
  }
}
