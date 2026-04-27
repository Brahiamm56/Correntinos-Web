"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import type { Producto, Categoria } from "@/types/database";
import { ShoppingCart, Search, Plus } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface Props {
  productos: (Producto & { categoria: Categoria | null })[];
  categorias: Categoria[];
}

export default function TiendaClient({ productos, categorias }: Props) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const { addItem, getCount } = useCartStore();

  const filtered = productos.filter((p) => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.categoria_id === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[var(--crema)]">
      {/* Hero */}
      <section
        className="relative pt-36 pb-16 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--verde-profundo) 0%, var(--verde-selva) 100%)",
        }}
      >
        <div className="section-container relative z-10">
          <AnimatedSection>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <span className="text-[var(--dorado)] text-sm font-semibold tracking-widest uppercase">
                  Tienda
                </span>
                <h1 className="text-white mt-2">Nuestros Productos</h1>
                <p className="text-white/60 mt-2 max-w-lg">
                  Cada compra apoya directamente nuestros proyectos ambientales en Corrientes.
                </p>
              </div>
              <Link
                href="/tienda/carrito"
                className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--dorado)] text-[var(--verde-profundo)] font-semibold hover:bg-[var(--dorado-suave)] transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                Carrito
                {getCount() > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {getCount()}
                  </span>
                )}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="section-container !pt-8 !pb-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gris-calido)]" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Products grid */}
      <section className="section-container !pt-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-[var(--gris-calido)]">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((producto, i) => (
              <AnimatedSection key={producto.id} delay={i * 60}>
                <div className="glass-card overflow-hidden group">
                  <Link href={`/tienda/${producto.id}`} className="block relative aspect-square overflow-hidden">
                    {producto.imagen_url ? (
                      <Image
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--verde-palido)] flex items-center justify-center text-5xl">
                        🌿
                      </div>
                    )}
                    {producto.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Agotado
                        </span>
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    {producto.categoria && (
                      <span className="text-[10px] font-semibold text-[var(--verde-claro)] uppercase tracking-wider">
                        {producto.categoria.nombre}
                      </span>
                    )}
                    <Link href={`/tienda/${producto.id}`}>
                      <h3 className="!text-base font-bold mt-1 mb-2 line-clamp-2 hover:text-[var(--verde-hoja)] transition-colors">
                        {producto.nombre}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[var(--verde-profundo)]">
                        ${producto.precio.toLocaleString("es-AR")}
                      </span>
                      <button
                        onClick={() =>
                          addItem({
                            id: producto.id,
                            nombre: producto.nombre,
                            precio: producto.precio,
                            imagen_url: producto.imagen_url,
                            stock: producto.stock,
                          })
                        }
                        disabled={producto.stock === 0}
                        className="w-10 h-10 rounded-full bg-[var(--verde-profundo)] text-white flex items-center justify-center hover:bg-[var(--verde-selva)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Agregar ${producto.nombre} al carrito`}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--gris-calido)] mt-2">
                      {producto.stock > 0 ? `${producto.stock} disponible${producto.stock !== 1 ? "s" : ""}` : "Sin stock"}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
