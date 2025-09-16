// lib/auth0.js
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// The SDK reads AUTH0_* and APP_BASE_URL from env automatically.
// If you need audience/scope, pass them explicitly as shown.
export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,   // optional
    scope: process.env.AUTH0_SCOPE,         // optional (e.g. 'openid profile email')
  },
});
