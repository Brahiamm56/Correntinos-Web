import Link from "next/link";
import { Clock, DollarSign, Newspaper, Package } from "lucide-react";
import { count, desc, eq, sum } from "drizzle-orm";
import { db } from "@/db";
import { noticias, ordenes } from "@/db/schema";

export const dynamic = "force-dynamic";

async function loadDashboard() {
  try {
    const [ordersCount, pendingCount, newsCount, amountResult, pendingRows, latestOrders, latestNews] =
      await Promise.all([
        db.select({ value: count() }).from(ordenes),
        db.select({ value: count() }).from(ordenes).where(eq(ordenes.estado, "pendiente")),
        db.select({ value: count() }).from(noticias),
        db.select({ value: sum(ordenes.total) }).from(ordenes),
        db.select().from(ordenes).where(eq(ordenes.estado, "pendiente")).orderBy(desc(ordenes.creado_en)).limit(5),
        db.select().from(ordenes).orderBy(desc(ordenes.creado_en)).limit(5),
        db.select().from(noticias).orderBy(desc(noticias.fecha_creacion)).limit(5),
      ]);

    return {
      data: {
        totalOrders: ordersCount[0]?.value ?? 0,
        pendingOrders: pendingCount[0]?.value ?? 0,
        totalNews: newsCount[0]?.value ?? 0,
        totalAmount: Number(amountResult[0]?.value ?? 0),
        pendingRows,
        latestOrders,
        latestNews,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error en AdminDashboard:", error);
    return { data: null, error: "No pudimos cargar la información operativa." };
  }
}

function Status({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold ${active ? "text-emerald-700" : "text-amber-700"}`}>
      <span className={`h-2 w-2 ${active ? "bg-emerald-600" : "bg-amber-500"}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export default async function AdminDashboard() {
  const result = await loadDashboard();

  if (!result.data) {
    return (
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Administración</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">Resumen</h1>
        <p role="alert" className="mt-8 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </p>
      </div>
    );
  }

  const { totalOrders, pendingOrders, totalNews, totalAmount, pendingRows, latestOrders, latestNews } = result.data;
  const metrics = [
    { label: "Monto de pedidos", value: `$${totalAmount.toLocaleString("es-AR")}`, icon: DollarSign },
    { label: "Pedidos registrados", value: totalOrders, icon: Package },
    { label: "Pendientes", value: pendingOrders, icon: Clock },
    { label: "Noticias", value: totalNews, icon: Newspaper },
  ];

  return (
    <div>
      <header className="flex flex-col gap-5 border-b border-gray-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Administración</p><h1 className="mt-2 text-3xl font-bold text-gray-950">Resumen operativo</h1></div>
        <div><p className="max-w-md text-sm text-gray-500">Una vista rápida del contenido, los pedidos y las tareas que necesitan atención.</p><nav aria-label="Accesos rápidos" className="mt-3 flex flex-wrap gap-4 text-sm font-semibold"><Link href="/admin/noticias" className="text-[var(--verde-hoja)] hover:underline">Gestionar noticias</Link><Link href="/admin/productos" className="text-[var(--verde-hoja)] hover:underline">Gestionar productos</Link><Link href="/admin/pedidos" className="text-[var(--verde-hoja)] hover:underline">Ver pedidos</Link></nav></div>
      </header>

      <section aria-label="Indicadores" className="mt-8 grid sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className={`border-b border-gray-200 py-6 sm:px-6 ${index > 0 ? "sm:border-l" : ""}`}>
              <Icon className="h-5 w-5 text-[var(--verde-hoja)]" />
              <p className="mt-6 text-2xl font-bold text-gray-950">{metric.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500">{metric.label}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between border-b border-amber-300 pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-amber-700">Requiere atención</p><h2 className="mt-1 font-sans text-lg font-bold text-gray-950">Pedidos pendientes</h2></div><Link href="/admin/pedidos" className="text-sm font-semibold text-[var(--verde-hoja)] hover:underline">Abrir bandeja</Link></div>
        {pendingRows.length === 0 ? <p className="border-b border-gray-200 py-6 text-sm text-gray-500">No hay pedidos pendientes.</p> : <div>{pendingRows.map((order) => <Link key={order.id} href={`/admin/pedidos/${order.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-gray-200 py-4 transition-colors hover:bg-white"><div><p className="text-sm font-semibold text-gray-900">{order.numero_orden || "Sin número"}</p><p className="mt-1 text-xs text-gray-500">{order.cliente_nombre}</p></div><div className="text-right"><p className="text-sm font-bold text-gray-900">${Number(order.total).toLocaleString("es-AR")}</p><p className="mt-1 text-xs text-gray-500">{order.creado_en ? new Date(order.creado_en).toLocaleDateString("es-AR") : "Sin fecha"}</p></div></Link>)}</div>}
      </section>

      <div className="mt-10 grid gap-10 xl:grid-cols-2">
        <section>
          <div className="flex items-center justify-between border-b border-gray-300 pb-4"><h2 className="font-sans text-lg font-bold text-gray-950">Últimos pedidos</h2><Link href="/admin/pedidos" className="text-sm font-semibold text-[var(--verde-hoja)] hover:underline">Ver todos</Link></div>
          {latestOrders.length === 0 ? <p className="border-b border-gray-200 py-7 text-sm text-gray-500">Todavía no hay pedidos.</p> : (
            <div>
              {latestOrders.map((order) => (
                <Link key={order.id} href={`/admin/pedidos/${order.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-gray-200 py-4 transition-colors hover:bg-white">
                  <div><p className="text-sm font-semibold text-gray-900">{order.numero_orden || "Sin número"}</p><p className="mt-1 text-xs text-gray-500">{order.cliente_nombre}</p></div>
                  <div className="text-right"><p className="text-sm font-bold text-gray-900">${Number(order.total).toLocaleString("es-AR")}</p><Status active={order.estado === "procesado"}>{order.estado || "pendiente"}</Status></div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between border-b border-gray-300 pb-4"><h2 className="font-sans text-lg font-bold text-gray-950">Últimas noticias</h2><Link href="/admin/noticias" className="text-sm font-semibold text-[var(--verde-hoja)] hover:underline">Ver todas</Link></div>
          {latestNews.length === 0 ? <p className="border-b border-gray-200 py-7 text-sm text-gray-500">Todavía no hay noticias.</p> : (
            <div>
              {latestNews.map((article) => (
                <Link key={article.id} href="/admin/noticias" className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-gray-200 py-4 transition-colors hover:bg-white">
                  <div><p className="line-clamp-1 text-sm font-semibold text-gray-900">{article.titulo}</p><p className="mt-1 text-xs text-gray-500">{article.fecha_creacion ? new Date(article.fecha_creacion).toLocaleDateString("es-AR") : "Sin fecha"}</p></div>
                  <Status active={Boolean(article.publicada)}>{article.publicada ? "Publicada" : "Borrador"}</Status>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
