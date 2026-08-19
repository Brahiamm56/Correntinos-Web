"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { noticias } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Noticia } from "@/types/database";

interface NoticiaPayload {
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  publicada: boolean;
  fecha_publicacion: string | null;
}

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

export async function createNoticia(payload: NoticiaPayload) {
  try {
    const { user } = await getAdminContext();
    await db.insert(noticias).values({
      titulo: payload.titulo,
      contenido: payload.contenido,
      imagen_url: payload.imagen_url,
      publicada: payload.publicada,
      fecha_publicacion: payload.fecha_publicacion ? new Date(payload.fecha_publicacion) : null,
      autor_id: user.id,
    });

    revalidatePath("/");
    revalidatePath("/noticias");
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function updateNoticia(id: string, payload: NoticiaPayload) {
  try {
    await getAdminContext();
    await db
      .update(noticias)
      .set({
        titulo: payload.titulo,
        contenido: payload.contenido,
        imagen_url: payload.imagen_url,
        publicada: payload.publicada,
        fecha_publicacion: payload.fecha_publicacion ? new Date(payload.fecha_publicacion) : null,
        actualizado_en: new Date(),
      })
      .where(eq(noticias.id, id));

    revalidatePath("/");
    revalidatePath("/noticias");
    revalidatePath(`/noticias/${id}`);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function deleteNoticia(id: string) {
  try {
    await getAdminContext();
    await db.delete(noticias).where(eq(noticias.id, id));

    revalidatePath("/");
    revalidatePath("/noticias");
    revalidatePath(`/noticias/${id}`);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function toggleNoticiaPublicada(id: string, publicada: boolean) {
  try {
    await getAdminContext();
    const newPublicada = !publicada;
    await db
      .update(noticias)
      .set({
        publicada: newPublicada,
        fecha_publicacion: newPublicada ? new Date() : null,
        actualizado_en: new Date(),
      })
      .where(eq(noticias.id, id));

    revalidatePath("/");
    revalidatePath("/noticias");
    revalidatePath(`/noticias/${id}`);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function getNoticia(id: string) {
  try {
    await getAdminContext();
    const rows = await db.select().from(noticias).where(eq(noticias.id, id)).limit(1);
    const n = rows[0];
    if (!n) return { data: null, error: "Noticia no encontrada" };

    const formatted: Noticia = {
      id: n.id,
      titulo: n.titulo,
      contenido: n.contenido,
      imagen_url: n.imagen_url,
      publicada: n.publicada ?? false,
      autor_id: n.autor_id,
      fecha_creacion: n.fecha_creacion ? n.fecha_creacion.toISOString() : new Date().toISOString(),
      fecha_publicacion: n.fecha_publicacion ? n.fecha_publicacion.toISOString() : null,
      actualizado_en: n.actualizado_en ? n.actualizado_en.toISOString() : new Date().toISOString(),
    };

    return { data: formatted, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Error inesperado" };
  }
}

export async function getNoticias() {
  try {
    await getAdminContext();
    const data = await db.select().from(noticias).orderBy(desc(noticias.fecha_creacion));
    const formatted: Noticia[] = data.map((n) => ({
      id: n.id,
      titulo: n.titulo,
      contenido: n.contenido,
      imagen_url: n.imagen_url,
      publicada: n.publicada ?? false,
      autor_id: n.autor_id,
      fecha_creacion: n.fecha_creacion ? n.fecha_creacion.toISOString() : new Date().toISOString(),
      fecha_publicacion: n.fecha_publicacion ? n.fecha_publicacion.toISOString() : null,
      actualizado_en: n.actualizado_en ? n.actualizado_en.toISOString() : new Date().toISOString(),
    }));
    return { data: formatted, error: null };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : "Error inesperado" };
  }
}
