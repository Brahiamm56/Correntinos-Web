"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { ArrowLeft, Lock, Minus, Plus, ShoppingCart } from "lucide-react";
import type { Producto, Categoria } from "@/types/database";

interface Props {
  producto: Producto & { categoria: Categoria | null };
}

export default function ProductoDetail({ producto }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutRef = useRef<HTMLDivElement>(null);
  const qtyFromQuery = Number(searchParams.get("qty") || "1");
  const buyNowFromQuery = searchParams.get("buyNow") === "1";
  const [cantidad, setCantidad] = useState(1);
  const { addItem, getCount } = useCartStore();
  const { user, profile, loading: authLoading } = useAuthStore();
  const [added, setAdded] = useState(false);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [formData, setFormData] = useState({
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    cliente_direccion: "",
    cliente_ciudad: "",
  });

  useEffect(() => {
    const safeQty = Number.isFinite(qtyFromQuery)
      ? Math.min(Math.max(1, qtyFromQuery), producto.stock)
      : 1;
    setCantidad(safeQty);
  }, [producto.stock, qtyFromQuery]);

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
    if (!authLoading && user && buyNowFromQuery) {
      setBuyNowOpen(true);
    }
  }, [authLoading, buyNowFromQuery, user]);

  useEffect(() => {
    if (buyNowOpen) {
      checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [buyNowOpen]);

  function handleAdd() {
    for (let i = 0; i < cantidad; i++) {
      addItem({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen_url: producto.imagen_url,
        stock: producto.stock,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleBuyNow() {
    const redirect = `/tienda/${producto.id}?buyNow=1&qty=${cantidad}`;

    if (authLoading) {
      return;
    }

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setBuyNowOpen(true);
    router.replace(redirect, { scroll: false });
  }

  async function handleQuickOrder(e: React.FormEvent) {
    e.preventDefault();
    setOrderLoading(true);
    setOrderError("");

    try {
      const response = await fetch("/api/ordenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productos: [
            {
              id: producto.id,
              nombre: producto.nombre,
              cantidad,
              precio: producto.precio,
            },
          ],
          total: producto.precio * cantidad,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la orden");
      }

      router.push(`/tienda/exito?orden=${data.numero_orden}`);
      router.refresh();
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Error inesperado");
      setOrderLoading(false);
    }
  }

  const total = producto.precio * cantidad;

  return (
    <div className="min-h-screen bg-[var(--crema)] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-[var(--section-padding-x)]">
        <div className="flex items-center justify-between mb-8">
          <Link href="/tienda" className="inline-flex items-center gap-2 text-sm text-[var(--gris-calido)] hover:text-[var(--verde-profundo)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>
          <Link
            href="/tienda/carrito"
            className="relative inline-flex items-center gap-2 text-sm font-semibold text-[var(--verde-profundo)]"
          >
            <ShoppingCart className="w-5 h-5" />
            {getCount() > 0 && (
              <span className="absolute -top-2 -right-4 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {getCount()}
              </span>
            )}
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[var(--border)]">
            {producto.imagen_url ? (
              <Image
                src={producto.imagen_url}
                alt={producto.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl bg-[var(--verde-palido)]">
                🌿
              </div>
            )}
            {producto.stock === 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Agotado
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {producto.categoria && (
              <span className="text-xs font-semibold text-[var(--verde-claro)] uppercase tracking-wider">
                {producto.categoria.nombre}
              </span>
            )}
            <h1 className="mt-2 mb-4">{producto.nombre}</h1>
            <p className="text-3xl font-bold text-[var(--verde-profundo)] mb-6">
              ${producto.precio.toLocaleString("es-AR")}
            </p>

            {producto.descripcion && (
              <div className="prose mb-8">
                <p>{producto.descripcion}</p>
              </div>
            )}

            <p className="text-sm text-[var(--gris-calido)] mb-6">
              Stock disponible: <strong className="text-[var(--verde-profundo)]">{producto.stock}</strong>
            </p>

            {producto.stock > 0 && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border-2 border-[var(--border)] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{cantidad}</span>
                    <button
                      onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                      className="px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAdd}
                    className="btn-primary w-full sm:w-auto justify-center"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {added ? "✓ Agregado al carrito" : "Agregar al carrito"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={authLoading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--verde-profundo)] text-[var(--verde-profundo)] font-semibold hover:bg-[var(--verde-profundo)] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!user && <Lock className="w-4 h-4" />}
                    {authLoading
                      ? "Verificando..."
                      : user
                      ? "Comprar ahora"
                      : "Iniciar sesión para comprar"}
                  </button>
                </div>

                {!user && !authLoading && (
                  <p className="text-sm text-[var(--gris-calido)] mt-3 max-w-md">
                    Si elegís comprar ahora, primero te pediremos iniciar sesión y después volverás a este producto para completar el envío.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {producto.stock > 0 && buyNowOpen && user && (
          <div
            ref={checkoutRef}
            className="mt-14 grid lg:grid-cols-[1.3fr_0.7fr] gap-6 scroll-mt-32"
          >
            <form onSubmit={handleQuickOrder} className="glass-card p-6 sm:p-8 space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--verde-hoja)]/70 mb-2">
                  Compra rápida
                </p>
                <h2 className="text-2xl mb-2">Finalizá tu pedido desde este producto</h2>
                <p className="text-sm text-[var(--gris-calido)] max-w-2xl">
                  Completá tus datos de envío para cerrar esta compra online sin pasar por el carrito.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
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
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                  />
                </div>

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
                    onChange={handleFieldChange}
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
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                    placeholder="+54 379..."
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
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                    placeholder="Corrientes"
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
                  onChange={handleFieldChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                  placeholder="Calle, número, piso/depto"
                />
              </div>

              {orderError && (
                <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{orderError}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                <button
                  type="submit"
                  disabled={orderLoading}
                  className="btn-primary justify-center disabled:opacity-50"
                >
                  {orderLoading ? "Procesando pedido..." : `Confirmar compra por $${total.toLocaleString("es-AR")}`}
                </button>

                <button
                  type="button"
                  onClick={() => setBuyNowOpen(false)}
                  className="text-sm font-semibold text-[var(--gris-calido)] hover:text-[var(--verde-profundo)] transition-colors"
                >
                  Seguir viendo el producto
                </button>
              </div>
            </form>

            <aside className="glass-card p-6 h-fit lg:sticky lg:top-28">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--verde-hoja)]/70 mb-3">
                Resumen del pedido
              </p>
              <div className="flex gap-4 items-start mb-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border border-[var(--border)] flex-shrink-0">
                  {producto.imagen_url ? (
                    <Image
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-[var(--verde-palido)]">🌿</div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg leading-snug mb-1">{producto.nombre}</h3>
                  <p className="text-sm text-[var(--gris-calido)]">Cantidad: {cantidad}</p>
                  <p className="text-sm text-[var(--gris-calido)] mt-1">
                    Unitario: ${producto.precio.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm border-y border-[var(--border)] py-4 mb-4">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--gris-calido)]">Subtotal</span>
                  <span className="font-semibold">${total.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--gris-calido)]">Envío</span>
                  <span className="font-semibold">A coordinar</span>
                </div>
              </div>

              <div className="flex justify-between gap-4 items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--gris-calido)] mb-1">
                    Total estimado
                  </p>
                  <p className="text-2xl font-bold text-[var(--verde-profundo)]">
                    ${total.toLocaleString("es-AR")}
                  </p>
                </div>
                <p className="text-xs text-[var(--gris-calido)] max-w-[13ch] text-right">
                  Vas a recibir el número de orden al confirmar.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
