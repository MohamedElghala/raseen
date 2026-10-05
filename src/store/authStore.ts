import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../lib/types';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoginOpen: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
  toggleLoginModal: (isOpen?: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoginOpen: false,

      setUser: (user) => set({ user }),

      logout: () => set({ user: null }),

      toggleLoginModal: (isOpen) =>
        set((state) => ({ isLoginOpen: isOpen !== undefined ? isOpen : !state.isLoginOpen })),
    }),
    {
      name: 'raseen-auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
