import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@/types';

const PUBLIC_PATHS = ['/login', '/register'];
const PATIENT_PREFIX = '/patient';
const DOCTOR_PREFIX = '/doctor';
const CHEMIST_PREFIX = '/chemist';

function getTokenPayload(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get('caresphere_token')?.value;
  if (!token) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    // Check expiration
    if (payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // favicon, etc.
  ) {
    return NextResponse.next();
  }

  const payload = getTokenPayload(request);
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // ── No token + protected route → redirect to login ──
  if (!payload && !isPublicPath && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ── Has token + public path → redirect to dashboard ──
  if (payload && isPublicPath) {
    const dashboardPath =
      payload.role === 'DOCTOR' ? '/doctor/dashboard' : payload.role === 'CHEMIST' ? '/chemist/dashboard' : '/patient/dashboard';
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // ── Role-based access control ──
  if (payload) {
    const role = payload.role;

    // PATIENT trying to access doctor or chemist routes
    if (role === 'PATIENT' && (pathname.startsWith(DOCTOR_PREFIX) || pathname.startsWith(CHEMIST_PREFIX))) {
      return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }

    // DOCTOR trying to access patient or chemist routes
    if (role === 'DOCTOR' && (pathname.startsWith(PATIENT_PREFIX) || pathname.startsWith(CHEMIST_PREFIX))) {
      return NextResponse.redirect(new URL('/doctor/dashboard', request.url));
    }

    // CHEMIST trying to access patient or doctor routes
    if (role === 'CHEMIST' && (pathname.startsWith(PATIENT_PREFIX) || pathname.startsWith(DOCTOR_PREFIX))) {
      return NextResponse.redirect(new URL('/chemist/dashboard', request.url));
    }

    // Root "/" → redirect to role dashboard
    if (pathname === '/') {
      const dashboardPath =
        role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard';
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  // ── Root "/" without token → redirect to login ──
  if (!payload && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
