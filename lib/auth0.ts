// lib/auth0.ts
import { Auth0Client } from '@auth0/nextjs-auth0/server';

function req(name: string, v?: string) {
  if (!v) throw new Error(`Missing env ${name}`);
  return v.trim();
}

const domain = req('AUTH0_DOMAIN', process.env.AUTH0_DOMAIN);           // e.g. https://YOUR_TENANT.us.auth0.com
const appBaseUrl = req('APP_BASE_URL', process.env.APP_BASE_URL);       // e.g. http://localhost:3000
const clientId = req('AUTH0_CLIENT_ID', process.env.AUTH0_CLIENT_ID);
const clientSecret = req('AUTH0_CLIENT_SECRET', process.env.AUTH0_CLIENT_SECRET);
const secret = req('AUTH0_SECRET', process.env.AUTH0_SECRET);

export const auth0 = new Auth0Client({
  domain,
  appBaseUrl,
  clientId,
  clientSecret,
  secret,
});
