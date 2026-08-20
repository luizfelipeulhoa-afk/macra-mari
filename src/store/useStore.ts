import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  id: string;
  qty: number;
}

interface StoreState {
  items: CartLine[];
  cartOpen: boolean;
  filter: string; // "todos" ou id de categoria
  motionOn: boolean;
  toast: string | null;
  toastKey: number;
  ordered: boolean;

  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  setFilter: (filter: string) => void;
  setMotionOn: (on: boolean) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  setOrdered: (v: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      items: [],
      cartOpen: false,
      filter: "todos",
      motionOn: true,
      toast: null,
      toastKey: 0,
      ordered: false,

      addItem: (id) =>
        set((s) => {
          const existing = s.items.find((l) => l.id === id);
          return {
            items: existing
              ? s.items.map((l) => (l.id === id ? { ...l, qty: Math.min(9, l.qty + 1) } : l))
              : [...s.items, { id, qty: 1 }],
          };
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((l) => l.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((l) => l.id !== id)
              : s.items.map((l) => (l.id === id ? { ...l, qty: Math.min(9, qty) } : l)),
        })),
      clearCart: () => set({ items: [], ordered: false }),
      setCartOpen: (open) => set({ cartOpen: open }),
      setFilter: (filter) => set({ filter }),
      setMotionOn: (on) => set({ motionOn: on }),
      showToast: (msg) => set((s) => ({ toast: msg, toastKey: s.toastKey + 1 })),
      clearToast: () => set({ toast: null }),
      setOrdered: (v) => set({ ordered: v }),
    }),
    {
      name: "macra-mari-store",
      partialize: (s) => ({ items: s.items }),
    }
  )
);

export function selectCartCount(s: StoreState) {
  return s.items.reduce((acc, l) => acc + l.qty, 0);
}
