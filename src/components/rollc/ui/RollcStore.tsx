"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Locale, Product } from "@/data/rollc/content";

export type CartItem = {
  id: string;
  product: Product;
  qty: number;
  color?: string;
  size?: string;
};

type Store = {
  locale: Locale;
  cartItems: CartItem[];
  cartCount: number;
  cartPop: boolean;
  cartOpen: boolean;
  addToCart: (product: Product, opts?: { qty?: number; color?: string; size?: string }) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  selectedProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toast: string;
  showToast: (msg: string) => void;
  assistantProduct: Product | null;
  assistantNonce: number;
  openAssistant: (product: Product) => void;
};

const CART_KEY = "rollc-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
}

const Ctx = createContext<Store | null>(null);

export function RollcProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartPop, setCartPop] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [assistantProduct, setAssistantProduct] = useState<Product | null>(null);
  const [assistantNonce, setAssistantNonce] = useState(0);
  const isFirstPersist = useRef(true);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    const saved = loadCart();
    if (saved.length) setCartItems(saved);
  }, []);

  // Persist on change — skip the very first invocation (initial empty render)
  useEffect(() => {
    if (isFirstPersist.current) {
      isFirstPersist.current = false;
      return;
    }
    saveCart(cartItems);
  }, [cartItems]);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.qty, 0), [cartItems]);

  const showToast = (msg: string) => setToast(msg);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = (product: Product, opts?: { qty?: number; color?: string; size?: string }) => {
    const { qty = 1, color, size } = opts ?? {};
    const id = `${product.id}::${color ?? ""}::${size ?? ""}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => item.id === id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { id, product, qty, color, size }];
    });
    setCartPop(false);
    requestAnimationFrame(() => setCartPop(true));
  };

  const removeFromCart = (id: string) => setCartItems((prev) => prev.filter((item) => item.id !== id));

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, qty } : item));
  };

  const clearCart = () => setCartItems([]);

  const openAssistant = (product: Product) => {
    setAssistantProduct(product);
    setAssistantNonce((n) => n + 1);
  };

  const value = useMemo(() => ({
    locale,
    cartItems,
    cartCount,
    cartPop,
    cartOpen,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    selectedProduct,
    openQuickView: setSelectedProduct,
    closeQuickView: () => setSelectedProduct(null),
    searchOpen,
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    toast,
    showToast,
    assistantProduct,
    assistantNonce,
    openAssistant,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [locale, cartItems, cartCount, cartPop, cartOpen, selectedProduct, searchOpen, toast, assistantProduct, assistantNonce]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRollcStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRollcStore must be used inside RollcProvider");
  return v;
}
