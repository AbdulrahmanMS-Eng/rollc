"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

interface StoreContextValue {
  cart: number;
  cartPulse: number;
  addToCart: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
  quickProduct: Product | null;
  openQuickView: (p: Product) => void;
  closeQuickView: () => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState(0);
  const [cartPulse, setCartPulse] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = useCallback(() => {
    setCart((c) => c + 1);
    setCartPulse((p) => p + 1);
  }, []);

  const openQuickView = useCallback((p: Product) => setQuickProduct(p), []);
  const closeQuickView = useCallback(() => setQuickProduct(null), []);

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartPulse,
        addToCart,
        toast,
        showToast,
        quickProduct,
        openQuickView,
        closeQuickView,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
