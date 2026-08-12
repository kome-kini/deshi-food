"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/product-types";

export type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  loading: boolean;
  toast: string | null;
  add: (product: Product, quantity?: number) => Promise<void>;
  setQuantity: (slug: string, quantity: number) => Promise<void>;
  remove: (slug: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearToast: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function normalizeLines(payload: unknown): CartLine[] {
  if (!payload || typeof payload !== "object" || !("items" in payload) || !Array.isArray(payload.items)) return [];
  return payload.items.filter((line): line is CartLine => {
    if (!line || typeof line !== "object") return false;
    const candidate = line as Partial<CartLine>;
    return Boolean(candidate.product?.slug && typeof candidate.quantity === "number");
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (response.ok) setLines(normalizeLines(await response.json()));
    } catch {
      // The visible cart remains usable while a transient preview request recovers.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { void refresh(); });
    return () => window.cancelAnimationFrame(frame);
  }, [refresh]);

  const add = useCallback(async (product: Product, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.product.slug === product.slug);
      if (existing) {
        return current.map((line) => line.product.slug === product.slug
          ? { ...line, quantity: Math.min(product.stock, line.quantity + quantity) }
          : line);
      }
      return [...current, { product, quantity: Math.min(product.stock, quantity) }];
    });
    showToast(`${product.nameBn} কার্টে যোগ হয়েছে`);
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: product.slug, quantityDelta: quantity }),
    }).catch(() => null);
    if (response?.ok) setLines(normalizeLines(await response.json()));
  }, [showToast]);

  const setQuantity = useCallback(async (slug: string, quantity: number) => {
    const safeQuantity = Math.max(0, Math.floor(quantity));
    setLines((current) => safeQuantity === 0
      ? current.filter((line) => line.product.slug !== slug)
      : current.map((line) => line.product.slug === slug ? { ...line, quantity: safeQuantity } : line));
    const response = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, quantity: safeQuantity }),
    }).catch(() => null);
    if (response?.ok) setLines(normalizeLines(await response.json()));
  }, []);

  const remove = useCallback(async (slug: string) => {
    setLines((current) => current.filter((line) => line.product.slug !== slug));
    showToast("পণ্যটি কার্ট থেকে সরানো হয়েছে");
    const response = await fetch(`/api/cart?slug=${encodeURIComponent(slug)}`, { method: "DELETE" }).catch(() => null);
    if (response?.ok) setLines(normalizeLines(await response.json()));
  }, [showToast]);

  const value = useMemo<CartContextValue>(() => ({
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    loading,
    toast,
    add,
    setQuantity,
    remove,
    refresh,
    clearToast: () => setToast(null),
  }), [lines, loading, toast, add, setQuantity, remove, refresh]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={`toast ${toast ? "toast-visible" : ""}`} role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>{toast}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
