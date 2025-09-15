// app/api/_auth0.js
export function getIssuer() {
    const raw = process.env.AUTH0_DOMAIN || 'oktahub3.us.auth0.com'
    const domain = raw.replace(/^https?:\/\//, '').replace(/\/+$/, '')
    return `https://${domain}`
  }
  