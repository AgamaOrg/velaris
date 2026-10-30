import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy (replaces middleware.ts).
 *
 * Responsibilities:
 * 1. Security headers (HSTS, CSP, X-Frame-Options, etc.)
 * 2. Locale rewrite: English at root, Filipino at /fil/*
 * 3. Coarse /ops cookie redirect (not an authorization boundary)
 * 4. Legacy URL redirect fallback
 *
 * NOT an authorization boundary — enforce access in the data layer.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // -------------------------------------------------------------------------
  // 1. Skip internal routes, API, static assets, and admin
  // -------------------------------------------------------------------------
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/graphql') ||
    pathname.includes('.')
  ) {
    return applySecurityHeaders(NextResponse.next())
  }

  // -------------------------------------------------------------------------
  // 2. Coarse /ops redirect — cookie presence only, not authorization
  // -------------------------------------------------------------------------
  if (pathname.startsWith('/ops')) {
    const hasToken = request.cookies.has('payload-token')
    if (!hasToken && !pathname.startsWith('/ops/login')) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/ops/login'
      return applySecurityHeaders(NextResponse.redirect(loginUrl))
    }
    return applySecurityHeaders(NextResponse.next())
  }

  // -------------------------------------------------------------------------
  // 3. Locale rewrite: Filipino paths are explicit, English is the default
  // -------------------------------------------------------------------------
  if (pathname === '/fil' || pathname.startsWith('/fil/')) {
    // Filipino is explicit — pass through
    return applySecurityHeaders(NextResponse.next())
  }

  // Rewrite unprefixed paths to /en/* internally
  const url = request.nextUrl.clone()
  url.pathname = `/en${pathname === '/' ? '' : pathname}`
  return applySecurityHeaders(NextResponse.rewrite(url))
}

/**
 * Apply security response headers to every response.
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  // HSTS — 2 years with preload
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Referrer policy — send origin for cross-origin, full URL for same-origin
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy — restrict sensitive APIs
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=()'
  )

  // CSP — static public site uses a permissive policy; /ops will use nonce-based later
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https:",
      "frame-src 'self' https://my.matterport.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
