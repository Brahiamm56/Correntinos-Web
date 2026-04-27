import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductoDetail from "./ProductoDetail";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: producto } = await supabase
    .from("productos")
    .select("nombre, descripcion")
    .eq("id", id)
    .single();

  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: producto.nombre,
    description: producto.descripcion || `Comprá ${producto.nombre} en la tienda de la fundación.`,
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: producto } = await supabase
    .from("productos")
    .select("*, categoria:categorias(id, nombre)")
    .eq("id", id)
    .single();

  if (!producto) notFound();

  return <ProductoDetail producto={producto} />;
}
