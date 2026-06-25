'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthUser {
  userId: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: user !== null }),
      logout: async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        set({ user: null, isAuthenticated: false });
        window.location.href = '/login';
      },
    }),
    { name: 'AuthStore' },
  ),
);
