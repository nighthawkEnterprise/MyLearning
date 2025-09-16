// middleware.js
import { auth0 } from './lib/auth0'

export async function middleware(request) {
  console.log('[middleware] hit:', request.nextUrl.pathname)
  return auth0.middleware(request)
}

export const config = {
  matcher: ['/auth/:path*', '/protected/:path*', '/api/proxy/:path*'],
}
