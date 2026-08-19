import { notFound } from "next/navigation";
import { db } from "@/db";
import { productos, categorias } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProductoDetail from "./ProductoDetail";
import type { Categoria, Producto } from "@/types/database";

type ProductWithCategory = Omit<Producto, "categoria"> & { categoria: Categoria | null };

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const rows = await db
      .select({ nombre: productos.nombre, descripcion: productos.descripcion })
      .from(productos)
      .where(eq(productos.id, id))
      .limit(1);

    const producto = rows[0];
    if (!producto) return { title: "Producto no encontrado" };

    return {
      title: producto.nombre,
      description: producto.descripcion || `Comprá ${producto.nombre} en la tienda de la fundación.`,
    };
  } catch {
    return { title: "Producto no encontrado" };
  }
}

async function loadProduct(id: string): Promise<ProductWithCategory | null> {
  try {
    const rows = await db
      .select({
        id: productos.id,
        nombre: productos.nombre,
        descripcion: productos.descripcion,
        precio: productos.precio,
        stock: productos.stock,
        imagen_url: productos.imagen_url,
        categoria_id: productos.categoria_id,
        activo: productos.activo,
        creado_en: productos.creado_en,
        actualizado_en: productos.actualizado_en,
        categoria_nombre: categorias.nombre,
        categoria_descripcion: categorias.descripcion,
      })
      .from(productos)
      .leftJoin(categorias, eq(productos.categoria_id, categorias.id))
      .where(eq(productos.id, id))
      .limit(1);

    const r = rows[0];
    if (!r) return null;

    return {
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      precio: Number(r.precio),
      stock: r.stock ?? 0,
      imagen_url: r.imagen_url,
      categoria_id: r.categoria_id,
      activo: r.activo ?? true,
      creado_en: r.creado_en ? r.creado_en.toISOString() : new Date().toISOString(),
      actualizado_en: r.actualizado_en ? r.actualizado_en.toISOString() : new Date().toISOString(),
      categoria: r.categoria_id
        ? {
            id: r.categoria_id,
            nombre: r.categoria_nombre ?? "",
            descripcion: r.categoria_descripcion ?? null,
          }
        : null,
    };
  } catch {
    return null;
  }
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) notFound();
  return <ProductoDetail producto={product} />;
}
