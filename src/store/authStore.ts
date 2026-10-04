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
  login: (email: string, password?: string) => void;
  register: (name: string, email: string, password?: string, role?: UserRole) => void;
  logout: () => void;
  toggleLoginModal: (isOpen?: boolean) => void;
}

const DEMO_VENDOR: User = {
  name: 'أحمد البائع',
  email: 'vendor@rawnaq.com',
  role: 'vendor',
  avatar: 'https://placehold.co/100x100/1a2744/f5b731?text=A'
};

const DEMO_BUYER: User = {
  name: 'سارة المشتري',
  email: 'buyer@rawnaq.com',
  role: 'buyer',
  avatar: 'https://placehold.co/100x100/f5b731/1a2744?text=S'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoginOpen: false,

      login: (email, password) => {
        // Mock authentication logic
        if (email === 'vendor@rawnaq.com') {
          set({ user: DEMO_VENDOR, isLoginOpen: false });
        } else if (email === 'buyer@rawnaq.com') {
          set({ user: DEMO_BUYER, isLoginOpen: false });
        } else {
          // Default to a generic buyer for demo
          set({ 
            user: { name: 'مستخدم تجريبي', email, role: 'buyer' }, 
            isLoginOpen: false 
          });
        }
      },

      register: (name, email, password, role = 'buyer') => {
        set({
          user: { name, email, role },
          isLoginOpen: false
        });
      },

      logout: () => {
        set({ user: null });
      },

      toggleLoginModal: (isOpen) =>
        set((state) => ({ isLoginOpen: isOpen !== undefined ? isOpen : !state.isLoginOpen })),
    }),
    {
      name: 'rawnaq-auth-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user session
    }
  )
);
