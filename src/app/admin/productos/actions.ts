"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { productos, categorias, type ProductoVariante } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface ProductoPayload {
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  variantes?: ProductoVariante[];
  imagen_url: string | null;
  categoria_id: string | null;
  activo: boolean;
}

interface CategoriaPayload {
  nombre: string;
  descripcion: string | null;
}

async function getAdminContext() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session?.user) {
    throw new Error("Necesitás iniciar sesión");
  }
  const user = session.user as { role?: string };
  if (user.role !== "admin") {
    throw new Error("Necesitás permisos de administrador");
  }
  return { user };
}

export async function getCategorias() {
  try {
    const data = await db.select().from(categorias).orderBy(asc(categorias.nombre));
    return { data, error: null };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

function revalidateStorePaths(productId?: string) {
  revalidatePath("/");
  revalidatePath("/tienda");
  revalidatePath("/admin/productos");
  if (productId) revalidatePath(`/tienda/${productId}`);
}

export async function createCategoria(payload: CategoriaPayload) {
  try {
    await getAdminContext();
    const nombre = payload.nombre.trim();
    if (!nombre) return { error: "El nombre de la categoría es obligatorio" };

    const [created] = await db
      .insert(categorias)
      .values({
        nombre,
        descripcion: payload.descripcion?.trim() || null,
      })
      .returning({ id: categorias.id, nombre: categorias.nombre, descripcion: categorias.descripcion });

    revalidateStorePaths();
    return { data: created, error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function updateCategoria(id: string, payload: CategoriaPayload) {
  try {
    await getAdminContext();
    const nombre = payload.nombre.trim();
    if (!nombre) return { error: "El nombre de la categoría es obligatorio" };

    await db
      .update(categorias)
      .set({
        nombre,
        descripcion: payload.descripcion?.trim() || null,
      })
      .where(eq(categorias.id, id));

    revalidateStorePaths();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function deleteCategoria(id: string) {
  try {
    await getAdminContext();
    await db.delete(categorias).where(eq(categorias.id, id));

    revalidateStorePaths();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function getProductos() {
  try {
    await getAdminContext();
    const rows = await db
      .select({
        id: productos.id,
        nombre: productos.nombre,
        descripcion: productos.descripcion,
        precio: productos.precio,
        stock: productos.stock,
        variantes: productos.variantes,
        imagen_url: productos.imagen_url,
        categoria_id: productos.categoria_id,
        activo: productos.activo,
        creado_en: productos.creado_en,
        actualizado_en: productos.actualizado_en,
        categoria: {
          id: categorias.id,
          nombre: categorias.nombre,
          descripcion: categorias.descripcion,
        },
      })
      .from(productos)
      .leftJoin(categorias, eq(productos.categoria_id, categorias.id))
      .orderBy(desc(productos.creado_en));

    const formatted = rows.map((r) => ({
      ...r,
      precio: Number(r.precio),
      stock: r.stock ?? 0,
      variantes: r.variantes ?? [],
      activo: r.activo ?? true,
      creado_en: r.creado_en ? r.creado_en.toISOString() : new Date().toISOString(),
      actualizado_en: r.actualizado_en ? r.actualizado_en.toISOString() : new Date().toISOString(),
      categoria: r.categoria_id ? r.categoria : null,
    }));

    return { data: formatted, error: null };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function getProducto(id: string) {
  try {
    await getAdminContext();
    const rows = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
    if (!rows[0]) return { data: null, error: "Producto no encontrado" };

    const p = rows[0];
    return {
      data: {
        ...p,
        precio: Number(p.precio),
        stock: p.stock ?? 0,
        variantes: p.variantes ?? [],
        activo: p.activo ?? true,
        creado_en: p.creado_en ? p.creado_en.toISOString() : new Date().toISOString(),
        actualizado_en: p.actualizado_en ? p.actualizado_en.toISOString() : new Date().toISOString(),
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function createProducto(payload: ProductoPayload) {
  try {
    await getAdminContext();
    await db.insert(productos).values({
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      precio: payload.precio.toString(),
      stock: payload.stock,
      variantes: payload.variantes ?? [],
      imagen_url: payload.imagen_url,
      categoria_id: payload.categoria_id || null,
      activo: payload.activo,
    });

    revalidateStorePaths();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function updateProducto(id: string, payload: ProductoPayload) {
  try {
    await getAdminContext();
    await db
      .update(productos)
      .set({
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        precio: payload.precio.toString(),
        stock: payload.stock,
        variantes: payload.variantes ?? [],
        imagen_url: payload.imagen_url,
        categoria_id: payload.categoria_id || null,
        activo: payload.activo,
        actualizado_en: new Date(),
      })
      .where(eq(productos.id, id));

    revalidateStorePaths(id);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function deleteProducto(id: string) {
  try {
    await getAdminContext();
    await db.delete(productos).where(eq(productos.id, id));

    revalidateStorePaths();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function toggleProductoActivo(id: string, activo: boolean) {
  try {
    await getAdminContext();
    await db
      .update(productos)
      .set({
        activo: !activo,
        actualizado_en: new Date(),
      })
      .where(eq(productos.id, id));

    revalidateStorePaths();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}
