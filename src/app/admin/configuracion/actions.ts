"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { configuracion } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function getConfiguracion() {
  try {
    const rows = await db.select().from(configuracion).orderBy(desc(configuracion.actualizado_en)).limit(1);
    if (!rows[0]) {
      // Create default
      const [newConfig] = await db
        .insert(configuracion)
        .values({
          email_fundacion: "correntinosclim@gmail.com",
          telefono_fundacion: "+54 379 405 9015",
          texto_home: "Somos una fundación socioambiental comprometida con la acción climática.",
        })
        .returning();
      return { data: newConfig, error: null };
    }
    return { data: rows[0], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function updateConfiguracion(id: string, payload: {
  email_fundacion: string;
  telefono_fundacion: string;
  texto_home: string;
}) {
  try {
    await getAdminContext();
    await db
      .update(configuracion)
      .set({
        ...payload,
        actualizado_en: new Date(),
      })
      .where(eq(configuracion.id, id));

    revalidatePath("/", "layout");
    revalidatePath("/admin/configuracion");
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}
