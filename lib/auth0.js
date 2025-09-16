// lib/auth0.js
import { Auth0Client } from '@auth0/nextjs-auth0/server'

// helper that tries both new(v4) and old(v2/3) env names
const pick = (...names) => {
  for (const n of names) {
    const v = process.env[n]
    if (v && String(v).trim()) return String(v).trim()
  }
  return ''
}

const baseURL       = pick('AUTH0_BASE_URL', 'APP_BASE_URL')              // e.g. http://localhost:3000
const issuerBaseURL = pick('AUTH0_ISSUER_BASE_URL', 'AUTH0_DOMAIN')        // e.g. https://<tenant>.us.auth0.com

// ---- DEBUG: show what middleware can actually see ----
console.log('[auth0] env seen by middleware:', {
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
  APP_BASE_URL: process.env.APP_BASE_URL,
  AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  baseURLDerived: baseURL,
  issuerBaseURLDerived: issuerBaseURL,
})

// “Invalid URL” happens when these are empty or not absolute
const assertAbsolute = (label, val) => {
  try { new URL(val) } catch {
    throw new Error(`[auth0] ${label} is missing or invalid. Got: "${val || '(empty)'}"`)
  }
}
assertAbsolute('baseURL (AUTH0_BASE_URL/APP_BASE_URL)', baseURL)
assertAbsolute('issuerBaseURL (AUTH0_ISSUER_BASE_URL/AUTH0_DOMAIN)', issuerBaseURL)
// ------------------------------------------------------

export const auth0 = new Auth0Client({
  baseURL,
  issuerBaseURL,
  clientId:     process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret:       process.env.AUTH0_SECRET,
})
