import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
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
  const supabase = await createServiceClient();
  let query = supabase
    .from("noticias")
    .select("id, titulo, contenido, imagen_url, fecha_publicacion")
    .eq("publicada", true)
    .order("fecha_publicacion", { ascending: false });

  if (options.excludeId) {
    query = query.neq("id", options.excludeId);
  }

  if (typeof options.limit === "number") {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error cargando noticias publicadas:", error.message);
    return [] as PublicNoticiaPreview[];
  }

  return (data ?? []) as PublicNoticiaPreview[];
}

export async function getPublishedNoticia(id: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("id", id)
    .eq("publicada", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error cargando noticia pública:", error.message);
    }
    return null;
  }

  return data as Noticia;
}

export function getNoticiaExcerpt(html: string, maxLength = 160) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}