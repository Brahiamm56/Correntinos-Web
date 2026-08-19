import { db } from "@/db";
import { ordenes } from "@/db/schema";
import { desc } from "drizzle-orm";
import PedidosAdminClient from "./PedidosAdminClient";
import type { Orden } from "@/types/database";

export const dynamic = "force-dynamic";

async function loadOrders() {
  try {
    const rows = await db.select().from(ordenes).orderBy(desc(ordenes.creado_en));
    const formatted: Orden[] = rows.map((o) => ({
      ...o,
      productos: o.productos as Orden["productos"],
      total: Number(o.total),
      estado: (o.estado ?? "pendiente") as Orden["estado"],
      numero_orden: o.numero_orden ?? "",
      creado_en: o.creado_en ? o.creado_en.toISOString() : new Date().toISOString(),
      actualizado_en: o.actualizado_en ? o.actualizado_en.toISOString() : new Date().toISOString(),
    }));

    return formatted;
  } catch (error) {
    console.error("Error cargando órdenes:", error);
    return [];
  }
}

export default async function AdminPedidosPage() {
  const orders = await loadOrders();
  return <PedidosAdminClient ordenes={orders} />;
}
