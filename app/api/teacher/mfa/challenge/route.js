// app/api/teacher/mfa/challenge/route.js
import { NextResponse } from 'next/server'
import { getIssuer } from '../../../_auth0'

const issuer = () => getIssuer().replace(/\/+$/, '')

// --- Debug helpers -----------------------------------------------------------
function now() { return Date.now() }
function dur(msStart) { return `${Date.now() - msStart}ms` }
function maskToken(t = '', keep = 6) {
  if (!t || typeof t !== 'string') return t
  if (t.length <= keep * 2) return `${t.slice(0, 2)}…${t.slice(-2)}`
  return `${t.slice(0, keep)}…${t.slice(-keep)}`
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
  const t0 = now()
  const reqId = (globalThis.crypto?.randomUUID?.() || `req-${Math.random().toString(36).slice(2)}`)
  const routeTag = `[mfa/challenge][${reqId}]`

  try {
    // Read & log request body safely
    const raw = await req.text()
    const parsed = safeJSONParse(raw) || {}
    const { mfa_token, authenticator_id, challenge_type = 'oob', prefer_channel } = parsed

    console.log(`${routeTag} incoming request`, {
      method: req.method,
      url: req.url,
      bodyKeys: Object.keys(parsed),
      challenge_type,
      prefer_channel,
      has_authenticator_id: !!authenticator_id,
      mfa_token_masked: maskToken(mfa_token),
    })

    if (!mfa_token) {
      console.warn(`${routeTag} missing mfa_token`)
      return NextResponse.json({ error: 'mfa_token required' }, { status: 400 })
    }

    // --- Discover authenticator if not provided --------------------------------
    let chosen = authenticator_id
    if (!chosen) {
      const listUrl = `${issuer()}/mfa/authenticators`
      console.log(`${routeTag} fetching authenticators`, {
        url: listUrl,
        auth: `Bearer ${maskToken(mfa_token)}`,
      })
      const lr = await fetch(listUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${mfa_token}` },
        cache: 'no-store',
      })

      const listText = await lr.text()
      const listJson = safeJSONParse(listText)
      console.log(`${routeTag} authenticators response`, {
        status: lr.status,
        ok: lr.ok,
        headers: logHeaderSubset(lr.headers || {}),
        sampleBody: listText?.slice(0, 400),
      })

      if (!lr.ok) {
        // Pass upstream error details through
        return NextResponse.json(listJson ?? { message: listText }, { status: lr.status })
      }

      const picked = pickOob(listJson, prefer_channel)
      console.log(`${routeTag} picked authenticator`, {
        prefer_channel,
        picked_id: picked?.id,
        picked_channel: picked?.oob_channel ?? picked?.channel,
        picked_type: picked?.authenticator_type ?? picked?.type,
      })

      if (!picked?.id) {
        console.warn(`${routeTag} no active OOB authenticator found`)
        return NextResponse.json({ error: 'no active oob authenticator' }, { status: 404 })
      }
      chosen = picked.id
    } else {
      console.log(`${routeTag} using provided authenticator_id`, { authenticator_id: chosen })
    }

    // --- Issue the challenge ---------------------------------------------------
    const challengeUrl = `${issuer()}/mfa/challenge`
    const challengeBody = {
      challenge_type,           // 'oob'
      authenticator_id: chosen, // sms|... or push|...
      // If your tenant requires client creds, you can enable this pattern safely:
      // ...(process.env.AUTH0_INCLUDE_CLIENT_CREDS === '1' && {
      //   client_id: process.env.AUTH0_CLIENT_ID,
      //   client_secret: process.env.AUTH0_CLIENT_SECRET,
      // }),
    }

    console.log(`${routeTag} POST challenge`, {
      url: challengeUrl,
      body: { ...challengeBody, /* do not log secrets */ },
      auth: `Bearer ${maskToken(mfa_token)}`,
    })

    const cr = await fetch(challengeUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${mfa_token}`,
      },
      body: JSON.stringify(challengeBody),
    })

    const crText = await cr.text()
    const crJson = safeJSONParse(crText) || {}
    if (chosen && !crJson.authenticator_id) crJson.authenticator_id = chosen

    console.log(`${routeTag} challenge response`, {
      status: cr.status,
      ok: cr.ok,
      headers: logHeaderSubset(cr.headers || {}),
      bodySample: crText?.slice(0, 600),
      duration: dur(t0),
    })

    return NextResponse.json(crJson, { status: cr.status })
  } catch (e) {
    console.error(`${routeTag} error`, {
      message: e?.message || String(e),
      stack: e?.stack,
      duration: dur(t0),
    })
    return NextResponse.json({ error: 'challenge failed' }, { status: 500 })
  }
}
