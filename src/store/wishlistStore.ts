import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],

      toggleWishlist: (productId: string) => {
        set((state) => {
          const exists = state.wishlistIds.includes(productId);
          return {
            wishlistIds: exists
              ? state.wishlistIds.filter((id) => id !== productId)
              : [...state.wishlistIds, productId],
          };
        });
      },

      isInWishlist: (productId: string) => {
        return get().wishlistIds.includes(productId);
      },

      clearWishlist: () => set({ wishlistIds: [] }),
    }),
    {
      name: 'raseen-wishlist-storage',
    }
  )
);
