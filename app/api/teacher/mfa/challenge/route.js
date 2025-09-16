// app/api/teacher/mfa/challenge/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

export async function POST(req) {
  console.log('[mfa/challenge] HIT')

  try {
    const { mfa_token, authenticator_id } = await req.json()
    console.log('[mfa/challenge] input.mfa_token:', mfa_token ? '(redacted present)' : 'missing')
    console.log('[mfa/challenge] input.authenticator_id:', authenticator_id || '(none)')

    if (!mfa_token) {
      console.log('[mfa/challenge] error: missing mfa_token')
      return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    }

    // If no authenticator was provided, discover an active SMS authenticator
    let chosenId = authenticator_id
    if (!chosenId) {
      const listUrl = `${getIssuer()}/mfa/authenticators`
      console.log('[mfa/challenge] discovering SMS authenticator via:', listUrl)

      const listRes = await fetch(listUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${mfa_token}` },
        cache: 'no-store',
      })

      console.log('[mfa/challenge] listRes.status:', listRes.status)

      if (!listRes.ok) {
        const errBody = await listRes.text()
        console.log('[mfa/challenge] listRes not ok, body:', errBody)
        return new NextResponse(errBody, {
          status: listRes.status,
          headers: { 'content-type': listRes.headers.get('content-type') || 'application/json' },
        })
      }

      const authenticators = await listRes.json()
      console.log('[mfa/challenge] authenticators:', authenticators)

      // Find active SMS OOB authenticator
      const sms = (authenticators || []).find(
        a => a?.authenticator_type === 'oob' && a?.oob_channel === 'sms' && a?.active
      )

      console.log('[mfa/challenge] discovered sms authenticator:', sms?.id || '(none)')

      if (!sms?.id) {
        return NextResponse.json({ error: 'no sms authenticator found' }, { status: 404 })
      }
      chosenId = sms.id
    }

    // Build the challenge request
    const challengeUrl = `${getIssuer()}/mfa/challenge`
    const challengePayload = { authenticator_id: chosenId }
    const challengeHeaders = {
      'content-type': 'application/json',
      Authorization: `Bearer ${mfa_token}`,
    }

    console.log('[mfa/challenge] POST', challengeUrl)
    console.log('[mfa/challenge] headers:', challengeHeaders)
    console.log('[mfa/challenge] body:', challengePayload)

    const chRes = await fetch(challengeUrl, {
      method: 'POST',
      headers: challengeHeaders,
      body: JSON.stringify(challengePayload),
    })

    console.log('[mfa/challenge] chRes.status:', chRes.status)

    // Try to parse as JSON; if it fails, pass through raw text and content-type
    let chBody
    let contentType = chRes.headers.get('content-type') || ''
    try {
      chBody = await chRes.json()
    } catch {
      const text = await chRes.text()
      console.log('[mfa/challenge] non-JSON response body:', text)
      return new NextResponse(text, {
        status: chRes.status,
        headers: { 'content-type': contentType || 'text/plain' },
      })
    }

    console.log('[mfa/challenge] chBody:', chBody)

    // Ensure authenticator_id is included in the response for client convenience
    if (chosenId && !chBody?.authenticator_id) {
      chBody.authenticator_id = chosenId
    }

    return NextResponse.json(chBody, { status: chRes.status })
  } catch (e) {
    console.error('[mfa/challenge] error:', e)
    return NextResponse.json({ error: 'challenge failed' }, { status: 500 })
  }
}
