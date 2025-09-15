export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getIssuer } from '../../../_auth0' // adjust if your helper lives elsewhere

// const getIssuer = () => (process.env.AUTH0_ISSUER_BASE_URL || '').replace(/\/$/, '');

export async function GET(req) {
  try {
    const access = req.cookies.get('access_token')?.value;
    if (!access) {
      return NextResponse.json({ error: 'unauthorized', error_description: 'No access token' }, { status: 401 });
    }
    
    const upstream = await fetch(`${getIssuer()}/me/v1/authentication-methods`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${access}` },
      cache: 'no-store',
    });

    const ct = upstream.headers.get('content-type') || 'application/json';
    const body = await upstream.text();

    return new NextResponse(body, { status: upstream.status, headers: { 'content-type': ct } });
  } catch (err) {
    console.error('methods route error:', err);
    return NextResponse.json(
      { error: 'server_error', error_description: String(err?.message || err) },
      { status: 500 }
    );
  }
}
