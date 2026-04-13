import api from '@/lib/api';
import type { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/login', data);
    return res.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/register', data);
    return res.data;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const res = await api.get<UserResponse>('/api/auth/me');
    return res.data;
  },
};
