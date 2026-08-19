"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { ArrowLeft, ShoppingBag, Truck } from "reicon-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, toOrderProducts, clearCart } = useCartStore();
  const { profile } = useAuthStore();

  const [formData, setFormData] = useState({
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    cliente_direccion: "",
    cliente_ciudad: "",
  });
  const [wantsShipping, setWantsShipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) return;
    const frame = window.requestAnimationFrame(() => {
      setFormData((prev) => ({
        ...prev,
        cliente_nombre: prev.cliente_nombre || profile.nombre || "",
        cliente_email: prev.cliente_email || profile.email || "",
      }));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [profile]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--papel)] pt-28 pb-20">
        <div className="mx-auto max-w-lg px-[var(--section-padding-x)]">
          <div className="border-y border-[var(--border-strong)] py-12">
            <ShoppingBag size={42} className="mb-4 text-[var(--verde-hoja)]" />
            <h1 className="text-2xl mb-4">Carrito vacío</h1>
            <p className="text-[var(--gris-calido)] mb-6">Agregá productos antes de continuar.</p>
            <Link href="/tienda" className="btn-primary">Ir a la tienda</Link>
          </div>
        </div>
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
          quiere_envio: wantsShipping,
          cliente_direccion: wantsShipping ? formData.cliente_direccion : "Sin envío - coordinar retiro",
          cliente_ciudad: wantsShipping ? formData.cliente_ciudad : "A coordinar",
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
    <div className="min-h-screen bg-[var(--papel)] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-[var(--section-padding-x)]">
        <Link href="/tienda/carrito" className="inline-flex items-center gap-2 text-sm text-[var(--gris-calido)] hover:text-[var(--verde-profundo)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver al carrito
        </Link>

        <div className="mb-8">
          <p className="section-label">Pedido invitado</p>
          <h1 className="text-3xl">Finalizá tu pedido</h1>
          <p className="mt-3 max-w-2xl text-[var(--gris-calido)]">
            No necesitás iniciar sesión. Dejanos tus datos para coordinar el pago y la entrega.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="border-y border-[var(--border-strong)] py-6">
              <h2 className="!text-lg font-bold mb-4">Datos del cliente</h2>
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
                    className="field"
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
                      className="field"
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
                      className="field"
                      placeholder="+54 379..."
                    />
                  </div>
                </div>
                <div className="border-t border-[var(--border)] pt-5">
                  <label className="flex items-start gap-3 text-sm font-semibold text-[var(--verde-profundo)]">
                    <input
                      type="checkbox"
                      checked={wantsShipping}
                      onChange={(event) => setWantsShipping(event.target.checked)}
                      className="mt-1 h-4 w-4 accent-[var(--verde-hoja)]"
                    />
                    <span>
                      Quiero coordinar envío
                      <span className="mt-1 block font-normal leading-relaxed text-[var(--gris-calido)]">
                        Si no lo marcás, el equipo coordina retiro o entrega por mensaje.
                      </span>
                    </span>
                  </label>
                </div>

                {wantsShipping && (
                  <div className="grid gap-4 border-t border-[var(--border)] pt-5">
                    <div>
                      <label htmlFor="cliente_direccion" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                        Dirección de envío *
                      </label>
                      <input
                        id="cliente_direccion"
                        name="cliente_direccion"
                        type="text"
                        required={wantsShipping}
                        value={formData.cliente_direccion}
                        onChange={handleChange}
                        className="field"
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
                        required={wantsShipping}
                        value={formData.cliente_ciudad}
                        onChange={handleChange}
                        className="field"
                        placeholder="Corrientes"
                      />
                    </div>
                  </div>
                )}

                {!wantsShipping && (
                  <p className="flex items-start gap-2 border-l-2 border-[var(--dorado)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--gris-calido)]">
                    <Truck size={18} className="mt-0.5 shrink-0 text-[var(--verde-hoja)]" />
                    El envío o retiro se coordina después de registrar el pedido.
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50"
            >
              {loading ? "Registrando pedido..." : `Confirmar pedido — $${getTotal().toLocaleString("es-AR")}`}
            </button>
          </form>

          <div>
            <div className="sticky top-28 border-y border-[var(--border-strong)] py-6">
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
