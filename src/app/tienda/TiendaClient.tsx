"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Add, ArrowRight, CheckCircle, Filter, Package, Search } from "reicon-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useCartStore } from "@/store/cart";
import type { Categoria, Producto } from "@/types/database";

interface Props {
  productos: (Omit<Producto, "categoria"> & { categoria: Categoria | null })[];
  categorias: Categoria[];
}

export default function TiendaClient({ productos, categorias }: Props) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [added, setAdded] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const filtered = productos.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase()) &&
    (!catFilter || product.categoria_id === catFilter)
  );

  const addProduct = (producto: Omit<Producto, "categoria"> & { categoria: Categoria | null }) => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url,
      stock: producto.stock,
    });
    setAdded(producto.id);
    window.setTimeout(() => setAdded((current) => current === producto.id ? null : current), 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--papel)] pt-[4.75rem]">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="section-container !py-7 sm:!py-9">
          <h1 className="sr-only">Productos</h1>
          <div className="relative">
            <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--verde-hoja)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar productos"
              aria-label="Buscar productos"
              className="h-12 w-full border-b border-[var(--border-strong)] bg-transparent pl-11 pr-4 text-sm text-[var(--verde-profundo)] transition-colors placeholder:text-[var(--gris-calido)] focus:border-[var(--verde-hoja)] focus:outline-none"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1" aria-label="Categorías de productos">
              <button
                type="button"
                onClick={() => setCatFilter("")}
                aria-pressed={!catFilter}
                className={`shrink-0 border-b px-1 py-2 text-sm font-bold transition-colors ${!catFilter ? "border-[var(--verde-profundo)] text-[var(--verde-profundo)]" : "border-transparent text-[var(--gris-medio)] hover:border-[var(--verde-hoja)] hover:text-[var(--verde-profundo)]"}`}
              >
                Todo
              </button>
              {categorias.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setCatFilter(category.id)}
                  aria-pressed={catFilter === category.id}
                  className={`shrink-0 border-b px-1 py-2 text-sm font-bold transition-colors ${catFilter === category.id ? "border-[var(--verde-profundo)] text-[var(--verde-profundo)]" : "border-transparent text-[var(--gris-medio)] hover:border-[var(--verde-hoja)] hover:text-[var(--verde-profundo)]"}`}
                >
                  {category.nombre}
                </button>
              ))}
            </div>
            <p className="flex shrink-0 items-center gap-2 text-xs font-bold text-[var(--gris-calido)] sm:text-sm">
              <Filter size={17} /> {filtered.length}
            </p>
          </div>
        </div>
      </section>

      <section className="section-container !pt-8 sm:!pt-10">
        {filtered.length === 0 ? (
          <div className="border-y border-[var(--border)] py-12">
            <div>
              <Search size={34} className="text-[var(--verde-hoja)]" />
              <h2 className="mt-4 !text-3xl">No encontramos productos.</h2>
              <p className="mt-2 text-[var(--gris-calido)]">Probá otra búsqueda o cambiá la categoría.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((producto, index) => {
              const isAdded = added === producto.id;
              const outOfStock = producto.stock === 0;

              return (
                <AnimatedSection key={producto.id} delay={index * 55} className="h-full">
                  <article className="group flex h-full flex-col">
                    <Link href={`/tienda/${producto.id}`} className="relative block aspect-square overflow-hidden bg-[var(--verde-palido)]">
                      {producto.imagen_url ? (
                        <Image src={producto.imagen_url} alt={producto.nombre} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                      ) : (
                        <div className="grid h-full place-items-center text-[var(--verde-hoja)]"><Package size={38} /></div>
                      )}
                      {producto.stock === 0 && <span className="absolute inset-0 grid place-items-center bg-[#0a2f23]/70 px-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-white">Agotado</span>}
                    </Link>
                    <div className="flex flex-1 flex-col border-b border-[var(--border)] py-4">
                      {producto.categoria && <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--verde-hoja)] sm:text-[10px]">{producto.categoria.nombre}</p>}
                      <Link href={`/tienda/${producto.id}`}><h2 className="mt-1.5 line-clamp-2 !text-base leading-tight transition-colors group-hover:!text-[var(--verde-hoja)] sm:!text-xl">{producto.nombre}</h2></Link>
                      <p className="mt-2 text-base font-bold text-[var(--verde-profundo)] sm:text-xl">${producto.precio.toLocaleString("es-AR")}</p>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                        <span className="text-[10px] text-[var(--gris-calido)] sm:text-xs">{outOfStock ? "Sin stock" : `${producto.stock} disponible${producto.stock === 1 ? "" : "s"}`}</span>
                        <button type="button" onClick={() => addProduct(producto)} disabled={outOfStock} className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--verde-profundo)] text-[var(--verde-profundo)] transition-colors hover:bg-[var(--verde-profundo)] hover:text-white disabled:cursor-not-allowed disabled:opacity-35" aria-label={isAdded ? `${producto.nombre} agregado al carrito` : `Agregar ${producto.nombre} al carrito`} title={isAdded ? "Agregado al carrito" : "Agregar al carrito"}>
                          {isAdded ? <CheckCircle size={17} /> : <Add size={18} />}
                        </button>
                      </div>
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8 border-t border-[var(--border)] bg-white">
        <div className="section-container !py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[var(--gris-calido)]">¿Buscás hacer un aporte directo? Conocé las formas disponibles y coordiná la contribución con el equipo.</p>
            <Link href="/donaciones" className="action-link">Ir a donaciones <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
