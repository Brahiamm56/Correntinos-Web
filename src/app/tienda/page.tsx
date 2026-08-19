import { db } from "@/db";
import { productos, categorias } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import TiendaClient from "./TiendaClient";
import type { Producto, Categoria } from "@/types/database";

export const metadata = {
  title: "Tienda",
  description: "Comprá productos de la Fundación Correntinos y apoyá la causa ambiental.",
};

async function loadStore() {
  try {
    const [productosRows, categoriasRows] = await Promise.all([
      db
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
        .where(eq(productos.activo, true))
        .orderBy(desc(productos.creado_en)),
      db.select().from(categorias).orderBy(asc(categorias.nombre)),
    ]);

    const formattedProductos = productosRows.map((r) => ({
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
    })) as (Omit<Producto, "categoria"> & { categoria: Categoria | null })[];

    return { productos: formattedProductos, categorias: categoriasRows as Categoria[] };
  } catch (error) {
    console.error("Error cargando productos de tienda:", error);
    return { productos: [], categorias: [] };
  }
}

export default async function TiendaPage() {
  const store = await loadStore();
  return <TiendaClient productos={store.productos} categorias={store.categorias} />;
}
