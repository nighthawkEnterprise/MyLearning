// middleware.js
import { NextResponse } from 'next/server'
// If you don't have a path alias "@", use the relative import below
// import { auth0 } from './lib/auth0'
import { auth0 } from '@/lib/auth0'

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Let Auth0 SDK serve /auth/* (login, callback, logout...)
  if (pathname.startsWith('/auth/')) {
    return auth0.middleware(req)
  }

  // Protect /protected/*
  if (pathname.startsWith('/protected')) {
    // Auth0 session (UL) cookie
    const hasAuth0Session =
      req.cookies.has('appSession') ||
      Array.from(req.cookies.getAll()).some((c) => c.name.includes('appSession'))

    // Your embedded-teacher cookies
    const hasEmbedded =
      req.cookies.has('access_token') || req.cookies.has('refresh_token')

    if (!hasAuth0Session && !hasEmbedded) {
      const url = req.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/protected/:path*'],
}
