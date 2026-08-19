"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { Add, ArrowLeft, Minus, Package, ShoppingBag, Trash } from "reicon-react";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--papel)] pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-[var(--section-padding-x)]">
          <div className="border-y border-[var(--border-strong)] py-12">
            <ShoppingBag size={44} className="mb-6 text-[var(--verde-hoja)]" />
            <h1 className="text-2xl mb-4">Tu carrito está vacío</h1>
            <p className="text-[var(--gris-calido)] mb-8">
              Explorá nuestra tienda y encontrá productos que apoyan la causa ambiental.
            </p>
            <Link href="/tienda" className="btn-primary">
              <ShoppingBag className="w-4 h-4" />
              Ir a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--papel)] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-[var(--section-padding-x)]">
        <Link href="/tienda" className="inline-flex items-center gap-2 text-sm text-[var(--gris-calido)] hover:text-[var(--verde-profundo)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Seguir comprando
        </Link>

        <h1 className="text-3xl mb-8">Tu Carrito</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="border-t border-[var(--border-strong)] lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-[var(--border)] py-5">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-[var(--verde-palido)]">
                  {item.imagen_url ? (
                    <Image src={item.imagen_url} alt={item.nombre} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--verde-hoja)]"><Package size={26} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/tienda/${item.id}`} className="font-bold text-sm hover:text-[var(--verde-hoja)] transition-colors line-clamp-1">
                    {item.nombre}
                  </Link>
                  <p className="text-sm font-bold text-[var(--verde-profundo)] mt-1">
                    ${item.precio.toLocaleString("es-AR")}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border-y border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="px-2 py-1 hover:bg-gray-50 transition-colors"
                        aria-label={`Reducir cantidad de ${item.nombre}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm font-bold">{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="px-2 py-1 hover:bg-gray-50 transition-colors"
                        disabled={item.cantidad >= item.stock}
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        <Add className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-red-500 transition-colors hover:text-red-700"
                      aria-label={`Eliminar ${item.nombre}`}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">
                    ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 border-y border-[var(--border-strong)] py-6">
              <h3 className="!text-lg font-bold mb-4">Resumen</h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-[var(--gris-calido)]">
                    <span className="truncate mr-2">{item.nombre} x{item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString("es-AR")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--border)] pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[var(--verde-profundo)]">${getTotal().toLocaleString("es-AR")}</span>
                </div>
              </div>
              <Link href="/tienda/checkout" className="btn-primary w-full justify-center mb-3">
                Ir al checkout
              </Link>
              <button
                onClick={clearCart}
                className="w-full text-sm text-[var(--gris-calido)] hover:text-red-600 transition-colors py-2"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
