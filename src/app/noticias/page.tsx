import { createServiceClient } from "@/lib/supabase/server";
import NoticiasClient from "./NoticiasClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Noticias",
  description: "Últimas noticias de la Fundación Correntinos sobre medio ambiente y cambio climático.",
};

export default async function NoticiasPage() {
  const supabase = await createServiceClient();

  const { data: noticias, count, error } = await supabase
    .from("noticias")
    .select("id, titulo, contenido, imagen_url, fecha_publicacion", { count: "exact" })
    .eq("publicada", true)
    .order("fecha_publicacion", { ascending: false });

  if (error) {
    console.error("Error cargando noticias públicas:", error.message);
    return <NoticiasClient noticias={[]} total={0} />;
  }

  return <NoticiasClient noticias={noticias || []} total={count || 0} />;
}
