"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Add, ArrowRight, CheckCircle, Package } from "reicon-react";
import { useCartStore } from "@/store/cart";
import type { Categoria, Producto } from "@/types/database";
import AnimatedSection from "@/components/AnimatedSection";

type ProductoConCategoria = Omit<Producto, "categoria"> & { categoria: Categoria | null };

export default function ProductsCarousel({ productos }: { productos: ProductoConCategoria[] }) {
  const [added, setAdded] = useState<string | null>(null);
  const { addItem } = useCartStore();
  if (productos.length === 0) return null;

  const addProduct = (producto: ProductoConCategoria) => {
    addItem({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen_url: producto.imagen_url, stock: producto.stock });
    setAdded(producto.id);
    window.setTimeout(() => setAdded((current) => current === producto.id ? null : current), 1500);
  };

  return <section id="tienda-destacada" className="bg-white">
    <div className="section-container !py-14 sm:!py-16">
      <AnimatedSection><div className="mb-8 flex flex-col gap-6 border-b border-[var(--border-strong)] pb-6 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><h2 className="section-title">Objetos que sostienen causas reales.</h2><p className="mt-4 text-[var(--gris-calido)]">Cada compra financia acciones de educación ambiental, protección de humedales y trabajo comunitario en Corrientes.</p></div><Link href="/tienda" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--verde-profundo)] transition-colors hover:text-[var(--verde-hoja)]">Ver tienda completa <ArrowRight size={18} /></Link></div></AnimatedSection>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {productos.slice(0, 4).map((producto, index) => {
          const isAdded = added === producto.id;
          const outOfStock = producto.stock === 0;
          return <AnimatedSection key={producto.id} delay={index * 75} className="h-full"><article className="group flex h-full flex-col"><Link href={`/tienda/${producto.id}`} className="relative block aspect-[4/5] overflow-hidden bg-[var(--verde-palido)]">{producto.imagen_url ? <Image src={producto.imagen_url} alt={producto.nombre} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center text-[var(--verde-hoja)]"><Package size={48} /></div>}{producto.categoria && <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--verde-profundo)]">{producto.categoria.nombre}</span>}</Link><div className="flex flex-1 flex-col border-b border-[var(--border)] py-4"><Link href={`/tienda/${producto.id}`}><h3 className="!text-lg transition-colors group-hover:!text-[var(--verde-hoja)]">{producto.nombre}</h3></Link><p className="mt-2 text-sm font-bold text-[var(--verde-profundo)]">${producto.precio.toLocaleString("es-AR")}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-xs text-[var(--gris-calido)]">{outOfStock ? "Sin stock" : `${producto.stock} disponible${producto.stock === 1 ? "" : "s"}`}</span><button type="button" onClick={() => addProduct(producto)} disabled={outOfStock} className="inline-flex min-h-10 items-center gap-1.5 border-b border-[var(--verde-profundo)] px-1 text-xs font-bold text-[var(--verde-profundo)] transition-colors hover:border-[var(--verde-hoja)] hover:text-[var(--verde-hoja)] disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Agregar ${producto.nombre} al carrito`}>{isAdded ? <CheckCircle size={17} /> : <Add size={17} />}{isAdded ? "Agregado" : "Agregar"}</button></div></div></article></AnimatedSection>;
        })}
      </div>
    </div>
  </section>;
}
