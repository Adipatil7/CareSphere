import { jwtDecode } from 'jwt-decode';
import type { JwtPayload, Role } from '@/types';

const TOKEN_KEY = 'caresphere_token';
const COOKIE_NAME = 'caresphere_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  // Also set cookie for Next.js middleware access
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=86400; SameSite=Lax`;
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  // Clear cookie
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function getUserFromToken(): { userId: string; role: Role } | null {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  // Check expiration
  const now = Date.now() / 1000;
  if (payload.exp < now) {
    removeToken();
    return null;
  }

  return {
    userId: payload.sub,
    role: payload.role,
  };
}

export function getRoleDashboardPath(role: Role): string {
  switch (role) {
    case 'PATIENT':
      return '/patient/dashboard';
    case 'DOCTOR':
      return '/doctor/dashboard';
    case 'CHEMIST':
      return '/chemist/dashboard';
    default:
      return '/login';
  }
}
