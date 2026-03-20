import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware for role-based routing.
 *
 * Redirects users to the correct dashboard based on their JWT tenant type:
 * - CGO users → /cgo/dashboard
 * - CLIENT users → /client/autopilot
 *
 * Defense-in-depth: even if this middleware is bypassed, the backend
 * enforces RBAC and RLS at the API level.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('qoria_token')?.value;
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname === '/' || pathname === '/login' || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Decode JWT payload (edge-safe, no crypto needed for routing decisions)
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const tenantType = payload.tenantType as string;

    // CGO trying to access client routes → redirect to CGO dashboard
    if (tenantType === 'CGO' && pathname.startsWith('/client')) {
      return NextResponse.redirect(new URL('/cgo/dashboard', request.url));
    }

    // CLIENT trying to access CGO routes → redirect to client autopilot
    if (tenantType === 'CLIENT' && pathname.startsWith('/cgo')) {
      return NextResponse.redirect(new URL('/client/autopilot', request.url));
    }
  } catch {
    // Invalid token → redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cgo/:path*', '/client/:path*'],
};
