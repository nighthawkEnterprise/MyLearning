// app/api/teacher/login/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password, realm } = await req.json();

    if (!username || !password) {
      return new NextResponse('Username and password are required', {
        status: 400,
        headers: { 'content-type': 'text/plain' },
      });
    }

    const params = new URLSearchParams();
    params.set('grant_type', 'http://auth0.com/oauth/grant-type/password-realm');
    params.set('realm', realm || process.env.AUTH0_DB_REALM || 'Username-Password-Authentication');
    params.set('username', String(username));
    params.set('password', String(password));
    if (process.env.AUTH0_AUDIENCE) params.set('audience', process.env.AUTH0_AUDIENCE);
    params.set('scope', process.env.AUTH0_SCOPE || 'openid profile email');
    params.set('client_id', process.env.AUTH0_CLIENT_ID);
    params.set('client_secret', process.env.AUTH0_CLIENT_SECRET);

    const upstream = await fetch('https://oktahub3.us.auth0.com/oauth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const raw = await upstream.text(); // read raw body once
    // Print the raw upstream response to server logs
    console.error('Auth0 response:', upstream.status, raw);

    // Pass the upstream body straight through to the client
    return new NextResponse(raw, {
      status: upstream.ok ? 200 : upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'text/plain',
      },
    });
  } catch (err) {
    // Print the thrown error directly
    console.error('Route error:', err);
    return new NextResponse(String(err?.stack || err?.message || err), {
      status: 500,
      headers: { 'content-type': 'text/plain' },
    });
  }
}
