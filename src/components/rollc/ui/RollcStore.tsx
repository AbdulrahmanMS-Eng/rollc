"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { Locale, Product } from "@/data/rollc/content";

type Store = {
  locale: Locale;
  cart: number;
  cartPop: boolean;
  selectedProduct: Product | null;
  searchOpen: boolean;
  toast: string;
  addToCart: () => void;
  showCartStatus: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  showToast: (msg: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function RollcProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [cart, setCart] = useState(0);
  const [cartPop, setCartPop] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => setToast(msg);

  const addToCart = () => {
    setCart((v) => v + 1);
    setCartPop(false);
    requestAnimationFrame(() => setCartPop(true));
    showToast(locale === "ar" ? "تمت الإضافة إلى السلة" : "Added to your cart");
  };

  const showCartStatus = () => {
    showToast(cart ? (locale === "ar" ? `لديك ${cart} منتج في السلة` : `${cart} item(s) in your cart`) : (locale === "ar" ? "سلتك فارغة" : "Your cart is empty"));
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo(() => ({
    locale,
    cart,
    cartPop,
    selectedProduct,
    searchOpen,
    toast,
    addToCart,
    showCartStatus,
    openQuickView: setSelectedProduct,
    closeQuickView: () => setSelectedProduct(null),
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    showToast,
  }), [locale, cart, cartPop, selectedProduct, searchOpen, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRollcStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRollcStore must be used inside RollcProvider");
  return v;
}
