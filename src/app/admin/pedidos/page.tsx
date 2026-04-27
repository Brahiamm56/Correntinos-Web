import { createClient } from "@/lib/supabase/server";
import PedidosAdminClient from "./PedidosAdminClient";

export default async function AdminPedidosPage() {
  const supabase = await createClient();

  const { data: ordenes } = await supabase
    .from("ordenes")
    .select("*")
    .order("creado_en", { ascending: false });

  return <PedidosAdminClient ordenes={ordenes || []} />;
}
