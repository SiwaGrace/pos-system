import { create } from "zustand";
import type { Product } from "@/types";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.productId === product.id,
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + 1, item.stock),
                  stock: product.stock,
                }
              : item,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            stock: product.stock,
          },
        ],
      };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
  incrementItem: (productId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
          : item,
      ),
    }));
  },
  decrementItem: (productId) => {
    set((state) => ({
      items: state.items
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    }));
  },
  clearCart: () => set({ items: [] }),
  total: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));