import { createClient } from "@/lib/supabase/server";
import TiendaClient from "./TiendaClient";

export const metadata = {
  title: "Tienda",
  description: "Comprá productos de la Fundación Correntinos y apoyá la causa ambiental.",
};

export default async function TiendaPage() {
  const supabase = await createClient();

  const { data: productos } = await supabase
    .from("productos")
    .select("*, categoria:categorias(id, nombre)")
    .eq("activo", true)
    .order("creado_en", { ascending: false });

  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre");

  return (
    <TiendaClient
      productos={productos || []}
      categorias={categorias || []}
    />
  );
}
