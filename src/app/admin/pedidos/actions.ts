"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { ordenes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Orden } from "@/types/database";

async function getAdminContext() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session?.user) {
    throw new Error("Necesitás iniciar sesión");
  }
  const user = session.user as typeof session.user & { role?: string };
  if (user.role !== "admin") {
    throw new Error("Necesitás permisos de administrador");
  }
  return { user };
}

export async function getOrdenes() {
  try {
    await getAdminContext();
    const data = await db.select().from(ordenes).orderBy(desc(ordenes.creado_en));
    const formatted: Orden[] = data.map((o) => ({
      ...o,
      productos: o.productos as Orden["productos"],
      total: Number(o.total),
      estado: (o.estado ?? "pendiente") as Orden["estado"],
      numero_orden: o.numero_orden ?? "",
      creado_en: o.creado_en ? o.creado_en.toISOString() : new Date().toISOString(),
      actualizado_en: o.actualizado_en ? o.actualizado_en.toISOString() : new Date().toISOString(),
    }));
    return { data: formatted, error: null };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function getOrden(id: string) {
  try {
    await getAdminContext();
    const rows = await db.select().from(ordenes).where(eq(ordenes.id, id)).limit(1);
    if (!rows[0]) return { data: null, error: "Orden no encontrada" };

    const o = rows[0];
    return {
      data: {
        ...o,
        productos: o.productos as Orden["productos"],
        total: Number(o.total),
        estado: (o.estado ?? "pendiente") as Orden["estado"],
        numero_orden: o.numero_orden ?? "",
        creado_en: o.creado_en ? o.creado_en.toISOString() : new Date().toISOString(),
        actualizado_en: o.actualizado_en ? o.actualizado_en.toISOString() : new Date().toISOString(),
      } satisfies Orden,
      error: null,
    };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function marcarOrdenProcesada(id: string) {
  try {
    await getAdminContext();
    await db
      .update(ordenes)
      .set({
        estado: "procesado",
        actualizado_en: new Date(),
      })
      .where(eq(ordenes.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");
    revalidatePath(`/admin/pedidos/${id}`);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}
