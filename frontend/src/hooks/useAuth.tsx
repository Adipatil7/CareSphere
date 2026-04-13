'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { UserResponse, Role } from '@/types';
import { getToken, setToken, removeToken, getUserFromToken, getRoleDashboardPath } from '@/lib/auth';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check token on mount
  useEffect(() => {
    const initAuth = async () => {
      const tokenUser = getUserFromToken();
      if (!tokenUser) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch {
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setToken(response.token);

    const userData = await authService.getCurrentUser();
    setUser(userData);

    toast.success(`Welcome back, ${userData.name}!`);
    router.push(getRoleDashboardPath(userData.role));
  }, [router]);

  const register = useCallback(async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: Role
  ) => {
    const response = await authService.register({ name, email, phone, password, role });
    setToken(response.token);

    const userData = await authService.getCurrentUser();
    setUser(userData);

    toast.success('Account created successfully!');
    router.push(getRoleDashboardPath(userData.role));
  }, [router]);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  }, [router]);

  // Full-screen loading while checking auth
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500" />
          <p className="text-sm text-slate-500 font-medium">Loading CareSphere...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
