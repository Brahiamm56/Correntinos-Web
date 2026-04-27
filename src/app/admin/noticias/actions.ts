"use server";

import {
  AuthorizationError,
  createServiceClient,
  requireAdminUser,
} from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface NoticiaPayload {
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  publicada: boolean;
  fecha_publicacion: string | null;
}

function getStoragePathFromPublicUrl(url: string | null, bucket = "media") {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const path = url.split(marker)[1];
  return path || null;
}

async function removeStoredImage(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  imageUrl: string | null
) {
  const path = getStoragePathFromPublicUrl(imageUrl);
  if (!path) return;

  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) {
    console.error("No se pudo eliminar la imagen de Storage:", error.message);
  }
}

async function getAdminContext() {
  const user = await requireAdminUser();
  const supabase = await createServiceClient();
  return { supabase, user };
}

function getAuthorizationErrorMessage(error: unknown) {
  return error instanceof AuthorizationError
    ? error.message
    : "No se pudo validar la sesión";
}

export async function createNoticia(payload: NoticiaPayload) {
  try {
    const { supabase, user } = await getAdminContext();
    const { error } = await supabase.from("noticias").insert({
      ...payload,
      autor_id: user.id,
    });

    if (error) return { error: error.message };
  } catch (error) {
    return { error: getAuthorizationErrorMessage(error) };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  return { error: null };
}

export async function updateNoticia(id: string, payload: NoticiaPayload) {
  try {
    const { supabase } = await getAdminContext();
    const { data: currentNoticia, error: currentNoticiaError } = await supabase
      .from("noticias")
      .select("imagen_url")
      .eq("id", id)
      .single();

    if (currentNoticiaError) return { error: currentNoticiaError.message };

    const { error } = await supabase.from("noticias").update(payload).eq("id", id);

    if (error) return { error: error.message };

    if (currentNoticia?.imagen_url !== payload.imagen_url) {
      await removeStoredImage(supabase, currentNoticia?.imagen_url ?? null);
    }
  } catch (error) {
    return { error: getAuthorizationErrorMessage(error) };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${id}`);
  return { error: null };
}

export async function deleteNoticia(id: string) {
  try {
    const { supabase } = await getAdminContext();
    const { data: currentNoticia, error: currentNoticiaError } = await supabase
      .from("noticias")
      .select("imagen_url")
      .eq("id", id)
      .single();

    if (currentNoticiaError) return { error: currentNoticiaError.message };

    const { error } = await supabase.from("noticias").delete().eq("id", id);

    if (error) return { error: error.message };

    await removeStoredImage(supabase, currentNoticia?.imagen_url ?? null);
  } catch (error) {
    return { error: getAuthorizationErrorMessage(error) };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${id}`);
  return { error: null };
}

export async function toggleNoticiaPublicada(id: string, publicada: boolean) {
  try {
    const { supabase } = await getAdminContext();
    const { error } = await supabase
      .from("noticias")
      .update({
        publicada: !publicada,
        fecha_publicacion: !publicada ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) return { error: error.message };
  } catch (error) {
    return { error: getAuthorizationErrorMessage(error) };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${id}`);
  return { error: null };
}

export async function getNoticia(id: string) {
  try {
    const { supabase } = await getAdminContext();
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: getAuthorizationErrorMessage(error) };
  }
}

export async function getNoticias() {
  try {
    const { supabase } = await getAdminContext();
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .order("fecha_creacion", { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: data ?? [], error: null };
  } catch (error) {
    return { data: [], error: getAuthorizationErrorMessage(error) };
  }
}
