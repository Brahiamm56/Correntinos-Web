"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const hydrateCart = useCartStore((state) => state.hydrate);

  useEffect(() => {
    initialize();
    hydrateCart();
  }, [hydrateCart, initialize]);

  return <>{children}</>;
}
