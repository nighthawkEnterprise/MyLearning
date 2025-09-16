import type { NextRequest } from 'next/server';
import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
  return auth0.middleware(request);
}

// Adjust the matcher so it runs on your site but ignores static files
// and your *teacher* API endpoints that you manage yourself.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/teacher/.*).*)',
  ],
};
