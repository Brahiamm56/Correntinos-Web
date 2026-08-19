import { db } from "@/db";
import { noticias } from "@/db/schema";
import { eq, and, ne, desc } from "drizzle-orm";
import type { Noticia } from "@/types/database";

export type PublicNoticiaPreview = Pick<
  Noticia,
  "id" | "titulo" | "contenido" | "imagen_url" | "fecha_publicacion"
>;

interface GetPublishedNoticiasOptions {
  limit?: number;
  excludeId?: string;
}

export async function getPublishedNoticias(
  options: GetPublishedNoticiasOptions = {}
) {
  try {
    const conditions = [eq(noticias.publicada, true)];

    if (options.excludeId) {
      conditions.push(ne(noticias.id, options.excludeId));
    }

    const query = db
      .select({
        id: noticias.id,
        titulo: noticias.titulo,
        contenido: noticias.contenido,
        imagen_url: noticias.imagen_url,
        fecha_publicacion: noticias.fecha_publicacion,
      })
      .from(noticias)
      .where(and(...conditions))
      .orderBy(desc(noticias.fecha_publicacion));

    if (typeof options.limit === "number") {
      const res = await query.limit(options.limit);
      return res.map((r) => ({
        ...r,
        fecha_publicacion: r.fecha_publicacion ? r.fecha_publicacion.toISOString() : null,
      })) as PublicNoticiaPreview[];
    }

    const res = await query;
    return res.map((r) => ({
      ...r,
      fecha_publicacion: r.fecha_publicacion ? r.fecha_publicacion.toISOString() : null,
    })) as PublicNoticiaPreview[];
  } catch (error) {
    console.error("Error cargando noticias publicadas:", error);
    return [] as PublicNoticiaPreview[];
  }
}

export async function getPublishedNoticia(id: string) {
  try {
    const result = await db
      .select()
      .from(noticias)
      .where(and(eq(noticias.id, id), eq(noticias.publicada, true)))
      .limit(1);

    if (!result || result.length === 0) {
      return null;
    }

    const n = result[0];
    return {
      ...n,
      fecha_creacion: n.fecha_creacion ? n.fecha_creacion.toISOString() : new Date().toISOString(),
      fecha_publicacion: n.fecha_publicacion ? n.fecha_publicacion.toISOString() : null,
      actualizado_en: n.actualizado_en ? n.actualizado_en.toISOString() : new Date().toISOString(),
    } as Noticia;
  } catch (error) {
    console.error("Error cargando noticia pública:", error);
    return null;
  }
}

export function getNoticiaExcerpt(html: string, maxLength = 160) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}
