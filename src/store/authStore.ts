import { create } from 'zustand';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthUIState {
  isLoginOpen: boolean;
  toggleLoginModal: (isOpen?: boolean) => void;
}

export const useAuthStore = create<AuthUIState>((set) => ({
  isLoginOpen: false,
  toggleLoginModal: (isOpen) =>
    set((state) => ({
      isLoginOpen: typeof isOpen === 'boolean' ? isOpen : !state.isLoginOpen,
    })),
}));
