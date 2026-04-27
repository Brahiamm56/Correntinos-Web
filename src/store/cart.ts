import { OrdenProducto } from "@/types/database";
import { create } from "zustand";

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url: string | null;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cantidad">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
  toOrderProducts: () => OrdenProducto[];
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("correntinos-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("correntinos-cart", JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((i) =>
          i.id === item.id
            ? { ...i, cantidad: Math.min(i.cantidad + 1, i.stock) }
            : i
        );
      } else {
        newItems = [...state.items, { ...item, cantidad: 1 }];
      }
      saveCart(newItems);
      return { items: newItems };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      saveCart(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (id, cantidad) => {
    set((state) => {
      if (cantidad <= 0) {
        const newItems = state.items.filter((i) => i.id !== id);
        saveCart(newItems);
        return { items: newItems };
      }
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  },

  getCount: () => {
    return get().items.reduce((sum, i) => sum + i.cantidad, 0);
  },

  toOrderProducts: () => {
    return get().items.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      cantidad: i.cantidad,
      precio: i.precio,
    }));
  },
}));
