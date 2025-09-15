export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET(req) {
  const url = new URL(req.url);
  const returnTo = url.searchParams.get('returnTo') || '/';

  // Redirect to the Auth0 SDK's App Router handler (/auth/logout)
  // AFTER clearing your embedded-login cookies.
  const redirect = new URL(`/auth/logout?returnTo=${encodeURIComponent(returnTo)}`, url);
  const res = NextResponse.redirect(redirect);

  // Nuke any cookies you set for the embedded flow.
  // (Use the exact names you set in your login route.)
  const kill = (name) =>
    res.cookies.set(name, '', { path: '/', expires: new Date(0) });

  [
    'access_token',
    'refresh_token',
    'id_token',
    'at_expires',
    'rt_expires',
    'session_state',
  ].forEach(kill);

  return res;
}
