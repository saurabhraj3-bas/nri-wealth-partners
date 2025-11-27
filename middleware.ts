/**
 * Next.js Middleware for Route Protection
 *
 * Protects admin routes and handles authentication redirects with error handling.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware currently only handles public API routes
  // Admin authentication is handled at the page level to avoid Edge Runtime issues with Firebase Admin

  try {
    const { pathname } = request.nextUrl;

    // Public routes that don't require special handling
    const publicRoutes = [
      '/api/generate-qr',
      '/api/newsletter/subscribe',
      '/api/newsletter/confirm',
      '/api/newsletter/unsubscribe',
      '/api/track-email',
      '/api/webinar-registration'
    ];

    // Allow all requests through (admin routes excluded from matcher)
    return NextResponse.next();
  } catch (error) {
    console.error('❌ Middleware error:', error);

    // On error, allow request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - admin routes (handled at page level to avoid Edge Runtime issues)
     */
    '/((?!_next/static|_next/image|favicon.ico|admin|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
