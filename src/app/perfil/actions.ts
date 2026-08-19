"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user as userTable, ordenes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Orden } from "@/types/database";

export async function getUserOrders() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user) return { data: [], error: "No autenticado" };

    const rows = await db
      .select()
      .from(ordenes)
      .where(eq(ordenes.usuario_id, session.user.id))
      .orderBy(desc(ordenes.creado_en));

    const formatted: Orden[] = rows.map((o) => ({
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

export async function updateUserName(nombre: string) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (!session?.user) return { error: "No autenticado" };

    await db
      .update(userTable)
      .set({
        name: nombre,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, session.user.id));

    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}
