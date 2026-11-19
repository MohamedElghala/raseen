import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Currency, ProductItem } from '../lib/types';
import { convertPrice } from '../lib/currency';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  currency: Currency;
  hasHydrated: boolean;
  
  // Actions
  addItem: (product: ProductItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
  setCurrency: (currency: Currency) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  
  // Computed
  totalItems: () => number;
  totalPriceEGP: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      currency: 'EGP',
      hasHydrated: false,

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: (isOpen) =>
        set((state) => ({ isOpen: isOpen !== undefined ? isOpen : !state.isOpen })),

      setCurrency: (currency) => set({ currency }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPriceEGP: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'raseen-cart-storage',
      partialize: (state) => ({ items: state.items, currency: state.currency }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
