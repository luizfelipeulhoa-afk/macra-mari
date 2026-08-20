import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Category } from "../data/atelier";

export interface CartItem {
  key: string;
  name: string;
  price: number;
  img: string;
  meta: string;
  qty: number;
}

interface StoreState {
  items: CartItem[];
  drawerOpen: boolean;
  filter: Category | "Todas";
  addItem: (item: Omit<CartItem, "qty">) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  setDrawer: (open: boolean) => void;
  setFilter: (f: Category | "Todas") => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      filter: "Todas",

      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.key === item.key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === item.key ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, qty: 1 }] };
        }),

      inc: (key) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + 1 } : i
          ),
        })),

      dec: (key) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.key === key ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        })),

      remove: (key) =>
        set((s) => ({ items: s.items.filter((i) => i.key !== key) })),

      clear: () => set({ items: [] }),

      setDrawer: (open) => set({ drawerOpen: open }),
      setFilter: (f) => set({ filter: f }),
    }),
    {
      name: "macra-mari-sacola",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((acc, i) => acc + i.qty, 0);

export const cartTotal = (items: CartItem[]) =>
  items.reduce((acc, i) => acc + i.qty * i.price, 0);

/* ————— toasts (evento global simples) ————— */

export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent("mm-toast", { detail: msg }));
}

export function onToast(cb: (msg: string) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<string>).detail);
  window.addEventListener("mm-toast", handler);
  return () => window.removeEventListener("mm-toast", handler);
}
