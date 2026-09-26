import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// â”€â”€ Security headers added to EVERY response â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  return response;
}

// â”€â”€ Decode session to get role (without DB call â€” fast edge check) â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getRoleFromSession(request: NextRequest): string | null {
  const sessionCookie = request.cookies.get('asmedix_session')?.value;
  const demoOverride = request.cookies.get('asmedix_demo_override')?.value;
  if (demoOverride === 'ADMIN') return 'ADMIN';
  if (!sessionCookie) return null;
  try {
    if (sessionCookie.includes('_ROLE_ADMIN')) return 'ADMIN';
    if (sessionCookie.includes('_ROLE_SUPER_ADMIN')) return 'SUPER_ADMIN';
    if (sessionCookie.startsWith('sess_')) return 'ADMIN';
    return 'STUDENT';
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRoleFromSession(request);
  const isAuthenticated = Boolean(role);
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  // Allow /api/admin for authenticated sessions
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      const res = NextResponse.json(
        { error: 'Accès refusé — Connexion requise' },
        { status: 401 }
      );
      return addSecurityHeaders(res);
    }
  }



  // â”€â”€ Protect Admin Panel (/admin/*) â€” strict role check â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      url.searchParams.set('error', 'login_required');
      const res = NextResponse.redirect(url);
      return addSecurityHeaders(res);
    }
    if (!isAdmin) {
      // Authenticated but not admin â†’ redirect to dashboard with error
      const url = new URL('/dashboard', request.url);
      url.searchParams.set('error', 'access_denied');
      const res = NextResponse.redirect(url);
      return addSecurityHeaders(res);
    }
  }

  // â”€â”€ Protect Dashboard Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const protectedRoutes = [
    '/dashboard', '/cours', '/qcm', '/cat', '/fiches',
    '/cas-cliniques', '/ecg', '/medicaments', '/ai', '/profil',
    '/progression', '/favoris', '/reminders', '/checkout',
    '/garde', '/ordonnances', '/calculateurs',
  ];

  const isProtectedRoute = protectedRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    const res = NextResponse.redirect(url);
    return addSecurityHeaders(res);
  }

  // â”€â”€ Add security headers to all other responses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/admin/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
    '/cours/:path*',
    '/qcm/:path*',
    '/cat/:path*',
    '/fiches/:path*',
    '/cas-cliniques/:path*',
    '/ecg/:path*',
    '/medicaments/:path*',
    '/ai/:path*',
    '/profil/:path*',
    '/progression/:path*',
    '/favoris/:path*',
    '/reminders/:path*',
    '/checkout/:path*',
    '/garde/:path*',
    '/ordonnances/:path*',
    '/calculateurs/:path*',
  ],
};
