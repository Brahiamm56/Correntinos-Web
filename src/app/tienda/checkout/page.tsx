"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, toOrderProducts, clearCart } = useCartStore();
  const { user, profile, loading: authLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    cliente_direccion: "",
    cliente_ciudad: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        cliente_nombre: prev.cliente_nombre || profile.nombre || "",
        cliente_email: prev.cliente_email || profile.email || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/tienda/checkout");
    }
  }, [user, authLoading, router]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--crema)] pt-28 pb-20">
        <div className="max-w-lg mx-auto px-[var(--section-padding-x)] text-center">
          <div className="glass-card p-12">
            <div className="text-5xl mb-4">🛒</div>
            <h1 className="text-2xl mb-4">Carrito vacío</h1>
            <p className="text-[var(--gris-calido)] mb-6">Agregá productos antes de continuar.</p>
            <Link href="/tienda" className="btn-primary">Ir a la tienda</Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-pulse text-[var(--gris-calido)]">Cargando...</div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ordenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productos: toOrderProducts(),
          total: getTotal(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear la orden");
      }

      clearCart();
      router.push(`/tienda/exito?orden=${data.numero_orden}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="min-h-screen bg-[var(--crema)] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-[var(--section-padding-x)]">
        <Link href="/tienda/carrito" className="inline-flex items-center gap-2 text-sm text-[var(--gris-calido)] hover:text-[var(--verde-profundo)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver al carrito
        </Link>

        <h1 className="text-3xl mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="glass-card p-6">
              <h2 className="!text-lg font-bold mb-4">Datos de envío</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cliente_nombre" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                    Nombre completo *
                  </label>
                  <input
                    id="cliente_nombre"
                    name="cliente_nombre"
                    type="text"
                    required
                    value={formData.cliente_nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cliente_email" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                      Email *
                    </label>
                    <input
                      id="cliente_email"
                      name="cliente_email"
                      type="email"
                      required
                      value={formData.cliente_email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="cliente_telefono" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                      Teléfono *
                    </label>
                    <input
                      id="cliente_telefono"
                      name="cliente_telefono"
                      type="tel"
                      required
                      value={formData.cliente_telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                      placeholder="+54 379..."
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cliente_direccion" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                    Dirección *
                  </label>
                  <input
                    id="cliente_direccion"
                    name="cliente_direccion"
                    type="text"
                    required
                    value={formData.cliente_direccion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                    placeholder="Calle, número, piso/depto"
                  />
                </div>
                <div>
                  <label htmlFor="cliente_ciudad" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                    Ciudad *
                  </label>
                  <input
                    id="cliente_ciudad"
                    name="cliente_ciudad"
                    type="text"
                    required
                    value={formData.cliente_ciudad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                    placeholder="Corrientes"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50"
            >
              {loading ? "Procesando..." : `Confirmar compra — $${getTotal().toLocaleString("es-AR")}`}
            </button>
          </form>

          {/* Order summary */}
          <div>
            <div className="glass-card p-6 sticky top-28">
              <h3 className="!text-lg font-bold mb-4">Tu pedido</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[var(--gris-calido)] truncate mr-2">
                      {item.nombre} <span className="text-[var(--gris-medio)]">x{item.cantidad}</span>
                    </span>
                    <span className="font-semibold whitespace-nowrap">
                      ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--border)] pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[var(--verde-profundo)]">${getTotal().toLocaleString("es-AR")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
