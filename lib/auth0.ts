// lib/auth0.ts
import { Auth0Client } from '@auth0/nextjs-auth0/server';

function requireUrl(name: string, raw?: string) {
  if (!raw) throw new Error(`Missing env ${name}`);
  const v = raw.trim();
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    // validate absolute URL
    const u = new URL(withProto);
    // strip trailing slash for consistency
    return u.toString().replace(/\/$/, '');
  } catch {
    throw new Error(`${name} must be an absolute http(s) URL. Got: ${raw}`);
  }
}

export const auth0 = new Auth0Client({
  domain: requireUrl('AUTH0_DOMAIN', process.env.AUTH0_DOMAIN),
  appBaseUrl: requireUrl(
    'APP_BASE_URL',
    process.env.APP_BASE_URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
  ),
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  secret: process.env.AUTH0_SECRET!,
});
