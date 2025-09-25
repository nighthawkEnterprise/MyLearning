// app/api/teacher/mfa/challenge/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

const issuer = 'https://oktahub3.us.auth0.com';
// console.log('getIssuer: ', getIssuer());

// --- Debug helpers -----------------------------------------------------------
function now() { return Date.now() }
function dur(msStart) { return `${Date.now() - msStart}ms` }
function mask(str = '', keep = 4) {
  if (!str || typeof str !== 'string') return str
  if (str.length <= keep * 2) return `${str.slice(0, 2)}…${str.slice(-2)}`
  return `${str.slice(0, keep)}…${str.slice(-keep)}`
}
function safeJSONParse(text) {
  try { return JSON.parse(text) } catch { return null }
}
function logHeaderSubset(headers) {
  const ct = headers.get?.('content-type') || headers['content-type']
  const vary = headers.get?.('vary') || headers['vary']
  return { 'content-type': ct, vary }
}
function pickOob(list, preferChannel) {
  if (!Array.isArray(list)) return null
  const activeOobs = list.filter(a =>
    (a?.authenticator_type ?? a?.type) === 'oob' &&
    a?.active === true &&
    (a?.oob_channel ?? a?.channel)
  )
  if (!activeOobs.length) return null
  if (preferChannel) {
    const pref = activeOobs.find(a => (a?.oob_channel ?? a?.channel) === preferChannel)
    if (pref) return pref
  }
  return activeOobs[0]
}

export async function POST(req) {
  console.log('[mfa/challenge] getIssuer():', getIssuer())

  const t0 = now()
  const reqId = (globalThis.crypto?.randomUUID?.() || `req-${Math.random().toString(36).slice(2)}`)
  const tag = `[mfa/challenge][${reqId}]`

  try {
    const raw = await req.text()
    const parsed = safeJSONParse(raw) || {}
    const {
      mfa_token,
      authenticator_id,
      prefer_channel,
      challenge_type = 'oob',
    } = parsed

    console.log(`${tag} incoming`, {
      method: req.method,
      url: req.url,
      bodyKeys: Object.keys(parsed),
      has_authenticator_id: !!authenticator_id,
      prefer_channel,
      challenge_type,
      mfa_token_masked: mask(mfa_token),
    })

    if (!mfa_token) {
      console.warn(`${tag} missing mfa_token`)
      return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    }

    // Ensure we have client creds (required by your cURL spec)
    const client_id = process.env.AUTH0_CLIENT_ID || ''
    const client_secret = process.env.AUTH0_CLIENT_SECRET || ''
    if (!client_id || !client_secret) {
      console.error(`${tag} missing client creds`, {
        has_client_id: !!client_id,
        has_client_secret: !!client_secret,
      })
      return NextResponse.json(
        { error: 'server_misconfig', error_description: 'Missing AUTH0_CLIENT_ID/SECRET' },
        { status: 500 }
      )
    }

    // --- Discover authenticator if not provided --------------------------------
    let chosen = authenticator_id
    if (!chosen) {
      const listUrl = `${issuer}/mfa/authenticators`
      console.log(`${tag} GET authenticators`, {
        url: listUrl,
        bearer_masked: mask(mfa_token),
      })
      const lr = await fetch(listUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${mfa_token}` },
        cache: 'no-store',
      })

      const listText = await lr.text()
      const listJson = safeJSONParse(listText)
      console.log(`${tag} authenticators response`, {
        status: lr.status,
        ok: lr.ok,
        headers: logHeaderSubset(lr.headers || {}),
        sampleBody: listText?.slice(0, 400),
      })

      if (!lr.ok) {
        return NextResponse.json(listJson ?? { message: listText }, { status: lr.status })
      }

      const picked = pickOob(listJson, prefer_channel)
      console.log(`${tag} picked authenticator`, {
        prefer_channel,
        picked_id: picked?.id,
        picked_channel: picked?.oob_channel ?? picked?.channel,
        picked_type: picked?.authenticator_type ?? picked?.type,
      })

      if (!picked?.id) {
        console.warn(`${tag} no active OOB authenticator found`)
        return NextResponse.json({ error: 'no active oob authenticator' }, { status: 404 })
      }
      chosen = picked.id
    } else {
      console.log(`${tag} using provided authenticator_id`, { authenticator_id: chosen })
    }

    // --- POST /mfa/challenge with client_id, client_secret, challenge_type, authenticator_id, mfa_token
    const challengeUrl = `${issuer}/mfa/challenge`
    const body = {
      client_id,
      client_secret,
      challenge_type,    // "oob"
      authenticator_id: chosen,
      mfa_token,
    }

    console.log(`${tag} POST challenge`, {
      url: challengeUrl,
      body_preview: {
        client_id: mask(client_id),
        client_secret: mask(client_secret),
        challenge_type,
        authenticator_id: chosen,
        mfa_token: mask(mfa_token),
      },
      note: 'Sending creds + token in body (no Authorization header) per cURL spec',
    })

    const cr = await fetch(challengeUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // IMPORTANT: Include everything in the body, not in Authorization header
      body: JSON.stringify(body),
    })

    const crText = await cr.text()
    const crJson = safeJSONParse(crText) || {}
    if (chosen && !crJson.authenticator_id) crJson.authenticator_id = chosen

    console.log(`${tag} challenge response`, {
      status: cr.status,
      ok: cr.ok,
      headers: logHeaderSubset(cr.headers || {}),
      bodySample: crText?.slice(0, 600),
      duration: dur(t0),
    })

    return NextResponse.json(crJson, { status: cr.status })
  } catch (e) {
    console.error(`${tag} error`, {
      message: e?.message || String(e),
      stack: e?.stack,
      duration: dur(t0),
    })
    return NextResponse.json({ error: 'challenge failed' }, { status: 500 })
  }
}
